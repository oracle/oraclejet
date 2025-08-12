/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { forwardRef } from 'preact/compat';
import { jsx } from 'preact/jsx-runtime';
import { h, options, Component, createRef, render, cloneElement, Fragment, createContext } from 'preact';
import { JetElementError, CustomElementUtils, AttributeUtils, transformPreactValue, ElementUtils, CHILD_BINDING_PROVIDER, publicToPrivateName, toSymbolizedValue, LifecycleElementState, addPrivatePropGetterSetters } from 'ojs/ojcustomelement-utils';
import { getElementRegistration, isElementRegistered, isVComponent, getElementDescriptor, registerElement as registerElement$1 } from 'ojs/ojcustomelement-registry';
import { useLayoutEffect, useContext, useMemo, useCallback } from 'preact/hooks';
import { EnvironmentContext, RootEnvironmentProvider } from '@oracle/oraclejet-preact/UNSAFE_Environment';
import oj from 'ojs/ojcore-base';
import { patchSlotParent, OJ_SLOT_REMOVE } from 'ojs/ojpreact-patch';
import { error, info, warn } from 'ojs/ojlogger';
import { getPropertyMetadata, getComplexPropertyMetadata, checkEnumValues, getFlattenedAttributes, deepFreeze } from 'ojs/ojmetadatautils';
import { LayerContext } from '@oracle/oraclejet-preact/UNSAFE_Layer';
import { getLayerContext } from 'ojs/ojlayerutils';
import { getLocale } from 'ojs/ojconfig';
import Context from 'ojs/ojcontext';
import { getTranslationBundlePromise, registerTranslationBundleLoaders } from 'ojs/ojtranslationbundleutils';
import { BusyStateContext } from '@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext';

let _slotIdCount = 0;
let _originalCreateElementNS;
// A map of host elements to the set of active slot Ids. Note the the same slot
// node with an Id may be shared by several components if the parent componenent
// redistributes slots to a child component.
// Although the parent and child are not really being re-rendered on the same tick together today,
// each VComponent will get a different VNode for the redistributed slot, and it seems safer to
// account for active slots on a per-host-component basis.
const _ACTIVE_SLOTS_PER_ELEMENT = new Map();
// Active Slot nodes to support the .createElement() override. See the comment above for _ACTIVE_SLOTS_PER_ELEMENT for the
// explanation on how the same slot node may be rendered by more than one VComponent and may have more than one VNode
// associated with it.
// This map will maintain each slot node while its VNodes are being rendered. All slot nodes will be removed together when
// all their associated VNodes are done rendering.
const _ACTIVE_SLOTS = new Map();
const _OJ_SLOT_ID = Symbol();
const _OJ_SLOT_PREFIX = '@oj_s';
/**
 * Wraps a live DOM node in a VNode, so that a custom element slot can be
 * inserted inside of a component that has a VDom-based renderer.
 * The overall strategy is as follows:
 * 1. Generate a unique id for each slot element.
 * 2. Temporarily place slot element into a static map under its unique id.
 * 3. With the unique id from (1), generate a unique, fake element name that we are going to pass into Preact
 *    as VNode's type.
 * 4. Temporarily patch document.createElement() for 'fake' names that follow a certain pattern.
 * 5. When we see attempts to create the fake element, instead of actually creating a new element, return the existing slot element.
 * 6. Remove our document.createElement patch and remove slot elements from the static map as soon as Preact reaches the commit phase.
 * @ignore
 */
function convertToVNode(hostElement, node, handleSlotMount, handleSlotUnmount) {
    const key = _getSlotKey(node);
    let _refCount = 0;
    function _incrementRefCount() {
        _refCount++;
    }
    function _decrementRefCount() {
        _refCount--;
        if (_refCount < 0) {
            throw new JetElementError(hostElement, 'Slot reference count underflow');
        }
        if (_refCount === 0) {
            handleSlotUnmount(node);
        }
        else {
            // Recent Preact versions invoke unmount callbacks for removed nodes before invoking
            // mount callbacks for added nodes.
            // Note that we have been always patching the parent element in the mount callback.
            // The patching is done to short-circuit .removeChild() for a slot whose ref count
            // indicates that it has already been re-inserted elsewhere. The code below is now calling patchSlotParent()
            // in the *unmount* callback to handle the case where it is invoked when the slot has already been
            // moved to the new location.
            // Note that patchSlotParent() is safe to call on the same element multiple times (it will be a no-op). It will
            // also not affect removal of child elements that are not slots.
            const parent = node.parentElement;
            // The fact that we check for .parentElement here and are not making the check in the mount case is intentional:
            // if Preact restores the old behavior with mounts always coming first, the slot element may be relocated to the
            // new location before the unmount callback for the old location is invoked. Also, want to see the exception in the
            // mount case if our assumptions are wrong.
            if (parent) {
                patchSlotParent(parent);
            }
        }
    }
    const slotRemoveHandler = () => {
        // The only way the slots should be removed if by parking, so
        // short-circuit all removes here
        return null;
    };
    node[OJ_SLOT_REMOVE] = slotRemoveHandler;
    const ref = function (n) {
        if (n) {
            _incrementRefCount();
            patchSlotParent(node.parentElement);
            handleSlotMount(node);
        }
        else {
            _decrementRefCount();
        }
    };
    // The slot's VNode is a render function that always returns a VNode
    // with the ref and key from the closure scope
    // Using a function is needed because Preact does not copy the 'ref' property
    // when it clones a VNode with an existing DOM element. This scenario occurs when
    // the slot is being moved to a different parent element upon component's re-render
    return h(() => {
        _registerSlot(hostElement, key, node);
        // we need to increment ref count on rendering to accommodate a change in Preact
        // where the unmounts get reported before mounts
        _incrementRefCount();
        useLayoutEffect(() => {
            _unregisterSlot(hostElement, key);
            _decrementRefCount();
        });
        return h(key, { ref, key });
    }, null);
}
function _registerSlot(hostElement, id, node) {
    let activeSlots = _ACTIVE_SLOTS_PER_ELEMENT.get(hostElement);
    const wasEmpty = _ACTIVE_SLOTS_PER_ELEMENT.size === 0;
    if (!activeSlots) {
        activeSlots = new Set();
        _ACTIVE_SLOTS_PER_ELEMENT.set(hostElement, activeSlots);
    }
    else if (activeSlots.has(id)) {
        _logInvalidSlotRenderError(hostElement, node);
    }
    activeSlots.add(id);
    _ACTIVE_SLOTS.set(id, node);
    if (wasEmpty) {
        _patchCreateElement();
    }
}
function _logInvalidSlotRenderError(hostElement, node) {
    const slotName = node.nodeType === Node.ELEMENT_NODE ? node.getAttribute('slot') ?? '' : '';
    error(`Custom Element "<${hostElement.localName}>" with id "${hostElement.id}" 
  is distributing slot "${slotName}" more than once`);
}
function _unregisterSlot(hostElement, id) {
    const activeSlots = _ACTIVE_SLOTS_PER_ELEMENT.get(hostElement);
    activeSlots?.delete(id);
    if (activeSlots?.size === 0) {
        _ACTIVE_SLOTS_PER_ELEMENT.delete(hostElement);
    }
    if (_ACTIVE_SLOTS_PER_ELEMENT.size === 0) {
        // empty the map by recreating it
        _ACTIVE_SLOTS.clear();
        _restoreCreateElement();
    }
}
function _getSlotKey(n) {
    let key = n[_OJ_SLOT_ID];
    if (key === undefined) {
        key = _OJ_SLOT_PREFIX + _slotIdCount++;
        n[_OJ_SLOT_ID] = key;
    }
    return key;
}
function _patchCreateElement() {
    _originalCreateElementNS = document.createElementNS;
    document.createElementNS = _createElementOverride;
}
function _restoreCreateElement() {
    document.createElementNS = _originalCreateElementNS;
}
function _createElementOverride(namespace, tagName, opts) {
    if (tagName.startsWith(_OJ_SLOT_PREFIX)) {
        return _ACTIVE_SLOTS.get(tagName);
    }
    return _originalCreateElementNS.call(document, namespace, tagName, opts);
}

class Parking {
    parkNode(node) {
        this._getLot().appendChild(node);
    }
    /**
     * Called when bindings are disposed on the host component
     * @ignore
     */
    disposeNodes(nodeMap, cleanFunc) {
        Parking._iterateSlots(nodeMap, (node) => {
            const parent = node.parentElement;
            if (this._lot === parent) {
                cleanFunc(node);
                this._lot.__removeChild(node);
            }
            else if (!parent) {
                // Completely disconnected slots should be cleaned when bindings are disposed.
                // Slots that are still connected to the component will be disposed together with their parent
                cleanFunc(node);
            }
        });
    }
    /**
     * Called when the host component is verifiably disconnected
     * @ignore
     */
    disconnectNodes(nodeMap) {
        Parking._iterateSlots(nodeMap, (node) => {
            if (this._lot === node.parentElement) {
                this._lot.__removeChild(node);
            }
        });
    }
    /**
     * Called when the host component is reconnected
     * @ignore
     */
    reconnectNodes(nodeMap) {
        Parking._iterateSlots(nodeMap, (node) => {
            if (!node.parentElement) {
                this._lot.appendChild(node);
            }
        });
    }
    /**
     * Rerurns true if a node is parked, false otherwise
     * @ignore
     */
    isParked(n) {
        return n?.parentElement === this._lot;
    }
    _getLot() {
        if (!this._lot) {
            const div = document.createElement('div');
            // Disallow removeChild() calls from outside to deal
            // with Preact trying to remove the node after the unmount callback
            div.__removeChild = div.removeChild;
            div.removeChild = (n) => n;
            div.style.display = 'none';
            document.body.appendChild(div);
            this._lot = div;
        }
        return this._lot;
    }
    static _iterateSlots(nodeMap, callback) {
        const keys = Object.keys(nodeMap);
        keys.forEach((key) => {
            const nodes = nodeMap[key];
            nodes.forEach((node) => {
                callback(node);
            });
        });
    }
}
const ParkingLot = new Parking();

/* MODIFIED: defined internal Preact constant */
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
/**
 * Diff the old and new properties of a VNode and apply changes to the DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to apply
 * changes to
 * @param {object} newProps The new props
 * @param {object} oldProps The old props
 * @param {boolean} isSvg Whether or not this node is an SVG node
 * @param {boolean} hydrate Whether or not we are in hydration mode
 */
/* MODIFIED: added setPropertyOverrides parameter to take over handling of certain properties */
function diffProps(dom, newProps, oldProps, isSvg, hydrate, setPropertyOverrides) {
    let i;
    for (i in oldProps) {
        if (i !== 'children' && i !== 'key' && !(i in newProps)) {
            /* MODIFIED: call setPropertyOverrides() to take over handling of certain properties */
            setPropertyOverrides(dom, i, null, oldProps[i], isSvg) ||
                setProperty(dom, i, null, oldProps[i], isSvg);
        }
    }
    for (i in newProps) {
        if ((!hydrate || typeof newProps[i] == 'function') &&
            i !== 'children' &&
            i !== 'key' &&
            i !== 'value' &&
            i !== 'checked' &&
            oldProps[i] !== newProps[i]) {
            /* MODIFIED: call setPropertyOverrides() to take over handling of certain properties */
            setPropertyOverrides(dom, i, newProps[i], oldProps[i], isSvg) ||
                setProperty(dom, i, newProps[i], oldProps[i], isSvg);
        }
    }
}
function setStyle(style, key, value) {
    if (key[0] === '-') {
        style.setProperty(key, value);
    }
    else if (value == null) {
        style[key] = '';
    }
    else if (typeof value != 'number' || IS_NON_DIMENSIONAL.test(key)) {
        style[key] = value;
    }
    else {
        style[key] = value + 'px';
    }
}
/**
 * Set a property value on a DOM node
 * @param {import('../internal').PreactElement} dom The DOM node to modify
 * @param {string} name The name of the property to set
 * @param {*} value The value to set the property to
 * @param {*} oldValue The old value the property had
 * @param {boolean} isSvg Whether or not this DOM node is an SVG node or not
 */
function setProperty(dom, name, value, oldValue, isSvg) {
    let useCapture;
    o: if (name === 'style') {
        if (typeof value == 'string') {
            dom.style.cssText = value;
        }
        else {
            if (typeof oldValue == 'string') {
                dom.style.cssText = oldValue = '';
            }
            if (oldValue) {
                for (name in oldValue) {
                    if (!(value && name in value)) {
                        setStyle(dom.style, name, '');
                    }
                }
            }
            if (value) {
                for (name in value) {
                    if (!oldValue || value[name] !== oldValue[name]) {
                        setStyle(dom.style, name, value[name]);
                    }
                }
            }
        }
    }
    // Benchmark for comparison: https://esbench.com/bench/574c954bdb965b9a00965ac6
    else if (name[0] === 'o' && name[1] === 'n') {
        useCapture = name !== (name = name.replace(/(PointerCapture)$|Capture$/i, '$1'));
        // Infer correct casing for DOM built-in events:
        if (name.toLowerCase() in dom || name === 'onFocusOut' || name === 'onFocusIn')
            name = name.toLowerCase().slice(2);
        else
            name = name.slice(2);
        if (!dom._listeners)
            dom._listeners = {};
        dom._listeners[name + useCapture] = value;
        if (value) {
            if (!oldValue) {
                const handler = useCapture ? eventProxyCapture : eventProxy;
                dom.addEventListener(name, handler, useCapture);
            }
        }
        else {
            const handler = useCapture ? eventProxyCapture : eventProxy;
            dom.removeEventListener(name, handler, useCapture);
        }
    }
    else if (name !== 'dangerouslySetInnerHTML') {
        if (isSvg) {
            // Normalize incorrect prop usage for SVG:
            // - xlink:href / xlinkHref --> href (xlink:href was removed from SVG and isn't needed)
            // - className --> class
            name = name.replace(/xlink[H:h]/, 'h').replace(/sName$/, 's');
        }
        else if (name != 'width' &&
            name != 'height' &&
            name !== 'href' &&
            name !== 'list' &&
            name !== 'form' &&
            // Default value in browsers is `-1` and an empty string is
            // cast to `0` instead
            name != 'tabIndex' &&
            name != 'download' &&
            name != 'rowSpan' &&
            name != 'colSpan' &&
            name != 'role' &&
            name != 'popover' &&
            name in dom) {
            try {
                dom[name] = value == null ? '' : value;
                // labelled break is 1b smaller here than a return statement (sorry)
                break o;
            }
            catch (e) { }
        }
        // ARIA-attributes have a different notion of boolean values.
        // The value `false` is different from the attribute not
        // existing on the DOM, so we can't remove it. For non-boolean
        // ARIA-attributes we could treat false as a removal, but the
        // amount of exceptions would cost us too many bytes. On top of
        // that other VDOM frameworks also always stringify `false`.
        if (typeof value == 'function') {
            // never serialize functions as attribute values
        }
        else if (value != null && (value !== false || name[4] === '-')) {
            dom.setAttribute(name, name == 'popover' && value == true ? '' : value); // @HTMLUpdateOK
        }
        else {
            dom.removeAttribute(name);
        }
    }
}
/**
 * Proxy an event to hooked event handlers
 * @param {Event} e The event object from the browser
 * @private
 */
function eventProxy(e) {
    this._listeners[e.type + false](options.event ? options.event(e) : e);
}
function eventProxyCapture(e) {
    this._listeners[e.type + true](options.event ? options.event(e) : e);
}

const ELEMENT_REF = Symbol();
const ROOT_VNODE_PATCH = Symbol();
// This is a wrapper around base component represented by IntrincicElement.
// The base component is wrapped into necessary context providers - LayerContext, EnvironmentProvider and
// any other custom provider requested by the component.
// The wrapper is also used to deliver updates on property changes. The updates are triggered
// by this component state update.
class ComponentWithContexts extends Component {
    constructor(props) {
        super(props);
        /**
         * Method creates or updates an Environment object that is stored on instance as
         * _rootEnvironment property. The object is needed for providing environment context
         * this component.
         */
        this.getEnvironmentContextObj = (currentEnv, env, colorScheme, scale, translationBundleMap) => {
            /**
             * The logic of this method is based on the assumption that the element will have
             * either an EnvironmentContext value in __oj_private_contexts (when used in JSX) or
             * __oj_private_color_scheme/__oj_private_scale (when used in HTML) or nothing.
             * We do not expect the element to have all 3 private properties at the same time.
             *
             * Initially the _rootEnvironment property will be set to existing __oj_private_contexts property
             * or created as a new object with the available values. The translation property will be extended with
             * values from translationBundleMap to cover the case that custom element has an extra bundle
             * that was not passed from environment.
             *
             * On updates we check whether env or colorScheme/scale are changed. If they are changed the _rootEnvironment
             * will be updated.
             */
            let newEnv = currentEnv;
            if (!newEnv) {
                newEnv = env || {
                    colorScheme: colorScheme,
                    scale: scale,
                    user: { locale: getLocale() }
                };
                this.extendTranslationBundleMap(newEnv, translationBundleMap);
            }
            else if (env && env !== newEnv) {
                newEnv = env;
                this.extendTranslationBundleMap(newEnv, translationBundleMap);
            }
            else if ((colorScheme && colorScheme !== newEnv.colorScheme) ||
                (scale && scale !== newEnv.scale)) {
                newEnv = Object.assign({}, newEnv, colorScheme && { colorScheme }, scale && { scale });
            }
            return newEnv;
        };
        /**
         * Merges translations specified on custom element into translation property
         * on environment object.
         */
        this.extendTranslationBundleMap = (env, translationBundleMap) => {
            if (!env.translations) {
                env.translations = translationBundleMap;
            }
            else if (env.translations !== translationBundleMap) {
                Object.keys(translationBundleMap).forEach((key) => {
                    // Note, the code just compares keys but does not merge the bundles.
                    if (!env.translations[key]) {
                        env.translations[key] = translationBundleMap[key];
                    }
                });
            }
        };
        this.state = { compProps: props.initialCompProps, renderCount: 0, connected: true };
        this._layerContext = getLayerContext(props.baseElem);
    }
    shouldComponentUpdate(nextProps, nextState) {
        // this component's props are never mutated so we can ignore that, just need to compare the contents
        // of state to ensure that either the connected state has changed, or IntrinsicElement has
        // queued a new render
        return (this.state.renderCount !== nextState.renderCount ||
            this.state.connected !== nextState.connected);
    }
    render(props) {
        // Unmount content if we're disconnected
        if (!this.state.connected) {
            return null;
        }
        const compProps = this.state.compProps;
        const BaseComponent = props.baseComp;
        const componentVDom = jsx(BaseComponent, { ...compProps });
        const rootEnv = customMemo(this.getEnvironmentContextObj, [
            props.baseElem['__oj_private_contexts']?.get(EnvironmentContext),
            props.baseElem['__oj_private_color_scheme'],
            props.baseElem['__oj_private_scale'],
            props.translationBundleMap
        ]);
        // Wrap VDom in Providers for any propagated contexts
        const contexts = props.baseElem['__oj_private_contexts'];
        const contextWrappers = contexts
            ? Array.from(contexts).reduce((acc, [context, value]) => {
                if (context === EnvironmentContext) {
                    // Skip, RootEnvironmentProvider is handled separately
                    return acc;
                }
                const provider = jsx(context.Provider, { value: value, children: acc });
                return provider;
            }, componentVDom)
            : componentVDom;
        // Add additional props based on Symbol that we could not add during initial creation.
        const vdomProps = componentVDom.props;
        vdomProps[ELEMENT_REF] = props.baseElem;
        // Pass the root VNode patching implementation to the render override
        vdomProps[ROOT_VNODE_PATCH] = props.rootPatchCallback;
        return (jsx(LayerContext.Provider, { value: this._layerContext, children: jsx(RootEnvironmentProvider, { environment: rootEnv, children: contextWrappers }) }));
    }
}
/**
 * Custom memoization function
 * @param fn Callback for getting the value
 * @param args arguments to compare
 * @returns new value
 */
const customMemo = (fn, args) => {
    if (!fn.memoState) {
        fn.memoState = {
            value: undefined,
            prevArgs: undefined
        };
    }
    if (argsChanged(fn.memoState.prevArgs, args)) {
        fn.memoState.value = fn(fn.memoState.value, ...args);
        fn.memoState.prevArgs = args;
    }
    return fn.memoState.value;
};
/**
 * Function to compare old and new args arrays
 * @returns if args changed
 */
const argsChanged = (oldArgs, newArgs) => {
    return (!oldArgs ||
        oldArgs.length !== newArgs.length ||
        newArgs.some((arg, index) => arg !== oldArgs[index]));
};

const applyRef = (ref, value) => {
    if (ref) {
        if (typeof ref == 'function') {
            return ref(value);
        }
        else {
            ref.current = value;
        }
    }
};
const _EMPTY_SET = new Set();
const _LISTENERS = Symbol();
const _CAPTURE_LISTENERS = Symbol();
const _SUBPROP = 'subproperty';
const _PROP_CHANGE = 'propChange';
const _ACTION = 'action';
class IntrinsicElement {
    constructor(element, component, metadata, rootAttributes, rootProperties, defaultProps) {
        // The Preact Component instance
        this.ref = createRef();
        this._compWithContextsRef = createRef();
        this._initialized = false;
        // Flag to prevent us from queueing a render during patching of virtual to live DOM
        this._isPatching = false;
        this._props = { ref: this.ref }; // used for initial render
        // Used to verify a true connect/disconnect vs a reparent
        this._verifyingState = ConnectionState.Unset;
        // We track property sets before bindings have resolved so we can play these
        // back after binding property sets occur to ensure property ordering
        this._earlySets = [];
        this._eventQueue = [];
        this._isRenderQueued = false;
        this._state = CustomElementUtils.getElementState(element);
        this._element = element;
        this._metadata = metadata;
        this._component = component;
        this._controlledProps = rootProperties?.length > 0 ? new Set(rootProperties) : _EMPTY_SET;
        this._controlledAttrs = rootAttributes?.length > 0 ? new Set(rootAttributes) : _EMPTY_SET;
        this._defaultProps = defaultProps;
        this._rootPatchCallback = this._patchRootElement.bind(this);
        this._renderCount = 0;
    }
    connectedCallback() {
        this._verifyConnectDisconnect(ConnectionState.Connect);
    }
    disconnectedCallback() {
        this._verifyConnectDisconnect(ConnectionState.Disconnect);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // This callback is called when the component is instantiated and before the connected
        // callback. We need to walk up the DOM tree to determine the binding provider so in order
        // to skip data bound attributes, delay handling until component is created
        // and initialize properties from DOM for component creation instead of this handler.
        if (!this._isPatching && this._state.canHandleAttributes()) {
            const propName = AttributeUtils.attributeToPropertyName(name);
            const topProp = propName.split('.')[0];
            // Note that we need to check whether the property has been marked dirty
            // since we don't reflect property values back to the DOM attribute.
            if (this._state.dirtyProps.has(topProp)) {
                this._state.dirtyProps.delete(topProp);
            }
            else if (oldValue === newValue) {
                return;
            }
            if (newValue === null) {
                newValue = undefined;
            }
            if ('knockout' === this._state.getBindingProviderType()) {
                // The CustomElementBinding listens for these events
                if (!AttributeUtils.isGlobalOrData(propName)) {
                    this._element.dispatchEvent(new CustomEvent('attribute-changed', {
                        detail: { attribute: name, value: newValue, previousValue: oldValue }
                    }));
                }
            }
            const { propPath, propValue, propMeta, subPropMeta } = this._getPropValueInfo(name, newValue);
            if (propPath) {
                this._updatePropsAndQueueRenderAsNeeded(propPath, propValue, propMeta, subPropMeta);
            }
        }
    }
    getProperty(name) {
        const meta = getPropertyMetadata(name, this._metadata?.properties);
        if (!meta) {
            return this._element[name];
        }
        else {
            let value = CustomElementUtils.getPropertyValue(this._props, name);
            // Check for the value in defaultProps if not defined
            if (value === undefined && this._defaultProps) {
                value = CustomElementUtils.getPropertyValue(this._defaultProps, name);
            }
            return value;
        }
    }
    setProperty(name, value) {
        // Component property setters, data bound attributes,
        // and direct setProperty/setProperties method calls go
        // through here
        if (this._isPatching)
            return;
        const { prop: propMeta, subProp: subPropMeta } = getComplexPropertyMetadata(name, this._metadata?.properties);
        if (!propMeta) {
            // If not a JET component property, just set the value directly on the element
            this._element[name] = value;
        }
        else {
            if (this._state.allowPropertySets()) {
                // eslint-disable-next-line no-param-reassign
                value = transformPreactValue(this._element, name, subPropMeta, value);
                // Property triggered renders are asynchronous, but values are updated synchronously
                this._updatePropsAndQueueRenderAsNeeded(name, value, propMeta, subPropMeta);
            }
            else {
                this._earlySets.push({ property: name, value });
            }
        }
    }
    setProperties(properties) {
        if (this._isPatching) {
            return;
        }
        Object.keys(properties).forEach((prop) => {
            this.setProperty(prop, properties[prop]);
        });
    }
    getProps() {
        return this._props;
    }
    // we want to suppress property change events during early property sets, which get played back
    // immediately before this._vdom is created
    isInitialized() {
        return !!this._vdom;
    }
    appendChildHelper(element, newNode) {
        if (CustomElementUtils.canRelocateNode(element, newNode)) {
            return HTMLElement.prototype.appendChild.call(element, newNode);
        }
        return newNode;
    }
    insertBeforeHelper(element, newNode, refNode) {
        if (CustomElementUtils.canRelocateNode(element, newNode)) {
            // In case of slot nodes the refNode might be moved by the parent component
            // and it is not a direct child of that parent component anymore.
            // Preact is not aware of this movement so it uses incorrect parent for inserting a node.
            // Lets use the correct parent of refNode to insert newNode before it.
            if (refNode && refNode.parentNode !== element) {
                info(`Using insertBefore where ${element.tagName} is not a parent of ${refNode.tagName}`);
            }
            if (refNode && refNode.parentNode) {
                return HTMLElement.prototype.insertBefore.call(refNode.parentNode, newNode, refNode);
            }
            return HTMLElement.prototype.insertBefore.call(element, newNode, refNode);
        }
        return newNode;
    }
    _render() {
        if (!this._initialized) {
            this._initialized = true;
            // We delay initializing properties until the first connected callback
            // due to the fact that the binding provider isn't known when the custom element
            // is first instantiated so an attribute value coming as "[[hello]]" could be either
            // bound to a hello knockout variable or be the literal string "[[hello]]".
            // Another reason to delay initializing properties is to avoid type coercion for
            // components that may never be connected to the DOM, e.g. those inside an oj-bind-if.
            this._initializePropsFromDom();
            // After initializing properties from DOM attributes, go through
            // event metadata and writeback properties to add action and
            // writeback callbacks
            const eventsMeta = this._metadata.events;
            if (eventsMeta) {
                this._initializeActionCallbacks(eventsMeta);
            }
            const writebackProps = this._metadata.extension?.['_WRITEBACK_PROPS'];
            if (writebackProps) {
                this._initializeWritebackCallbacks(writebackProps);
            }
            // Property sets need to be saved and played back since they may occur during knocout
            // bindings of disconnected DOM like in the case of an oj-bind-for-each.
            // TODO: 04/11/2024 - Potentially we don't need early property set at all for VComponents
            // and can rely on the correct order of this._props.
            this._playbackEarlyPropertySets();
        }
        if (!this._vdom) {
            this._vdom = (jsx(ComponentWithContexts, { ref: this._compWithContextsRef, baseComp: this._component, baseElem: this._element, initialCompProps: this._props, rootPatchCallback: this._rootPatchCallback, translationBundleMap: this._state.getTranslationBundleMap() }));
            render(this._vdom, this._element);
        }
        else {
            throw new Error(`Unexpected render call for already rendered component ${this._element.tagName}`);
        }
    }
    /**
     * Returns an object with property path, value, property and subproperty metadata if the attribute is either a
     * controlled root property or a non readOnly component property.
     * Otherwise, an empty object will be returned.
     * @param attrName
     * @param attrValue
     */
    _getPropValueInfo(attrName, attrValue) {
        // Skip data bound attributes
        if ('knockout' !== this._state.getBindingProviderType() ||
            !AttributeUtils.getExpressionInfo(attrValue).expr) {
            const propPath = AttributeUtils.attributeToPropertyName(attrName);
            const { prop: propMeta, subProp: subPropMeta } = getComplexPropertyMetadata(propPath, this._metadata?.properties);
            if (propMeta) {
                if (propMeta.readOnly) {
                    return {};
                }
                return {
                    propPath,
                    propValue: AttributeUtils.attributeToPropertyValue(this._element, attrName, attrValue, subPropMeta),
                    propMeta,
                    subPropMeta
                };
            }
            // Try and get the property so the type is correct, if not available
            // get the attribute value, e.g. data-, aria-, tabindex (since property is tabIndex)
            const globalPropName = AttributeUtils.getGlobalPropForAttr(attrName);
            if (this._controlledProps.has(globalPropName)) {
                return {
                    propPath: globalPropName,
                    propValue: this._element[AttributeUtils.getGlobalValuePropForAttr(attrName)] ?? attrValue
                };
            }
        }
        return {};
    }
    _updatePropsAndQueueRenderAsNeeded(propPath, value, propMeta, subPropMeta, isOuter = true) {
        const previousValue = this.getProperty(propPath);
        const newValue = value === undefined
            ? CustomElementUtils.getPropertyValue(this._defaultProps, propPath)
            : value;
        if (propMeta &&
            ElementUtils.comparePropertyValues(propMeta.writeback, newValue, previousValue)) {
            return;
        }
        const propArray = propPath.split('.');
        const topProp = propArray[0];
        const isSubprop = propArray.length > 1;
        // If the top level property is an object, make a copy otherwise the old/new values
        // will be the same.
        let topPropPrevValue = this.getProperty(topProp);
        if (oj.CollectionUtils.isPlainObject(topPropPrevValue)) {
            topPropPrevValue = oj.CollectionUtils.copyInto({}, topPropPrevValue, undefined, true);
        }
        // Skip validation for inner sets so we don't throw an error when updating readOnly writeable properties
        if (isOuter) {
            this._verifyProps(propPath, value, propMeta, subPropMeta);
        }
        this._updateProps(propArray, value);
        // We may need to update a component property or a controlled root property.
        // We do not need to trigger property changed events for the latter.
        if (!isOuter ||
            (this._state.allowPropertyChangedEvents() && !AttributeUtils.isGlobalOrData(propPath))) {
            this._state.dirtyProps.add(topProp);
            const updatedFrom = isOuter ? 'external' : 'internal';
            const detail = {
                value: this.getProperty(topProp),
                previousValue: topPropPrevValue,
                updatedFrom
            };
            if (isSubprop) {
                detail[_SUBPROP] = {
                    path: propPath,
                    value,
                    previousValue
                };
            }
            const type = topProp + 'Changed';
            const collapseFunc = isSubprop
                ? null
                : (oldDef) => {
                    if (oldDef.kind !== _PROP_CHANGE || oldDef.type !== type || oldDef.detail[_SUBPROP]) {
                        return null;
                    }
                    const mergedDetail = Object.assign({}, detail, {
                        previousValue: oldDef.detail.previousValue
                    });
                    return { type, detail: mergedDetail, collapse: collapseFunc, kind: _PROP_CHANGE };
                };
            // Both property change event firing and re-rendering are queued as microtasks.
            // Since busy state resolves using window.setImmediate, we don't need to register
            // busy states. Preact also uses microtasks for rendering.
            this._queueFireEventsTask({ type, detail, collapse: collapseFunc, kind: _PROP_CHANGE });
        }
        // Ensure that Preact knows the latest values of the controlled properties when they have
        // been set directly on the custom element (custom-element-first case).
        // Otherwise, preact diffing will be comparing against an old value that is no longer reflected
        // in the DOM
        const oldProps = this._oldRootProps;
        if (oldProps && this._controlledProps.has(propPath)) {
            oldProps[propPath] = value;
        }
        // TODO handle interrupted render
        // Skip rendering if prop update is a readOnly property
        if (this._vdom && !propMeta?.readOnly) {
            // JET-56604: We have to handle a scenario when a component updates a property in
            // its constructor. In this case the component is connected, _vdom is created,
            // but the component is not mounted and the ref is not set yet. Wait a tick
            // before setState() call.
            if (!this._compWithContextsRef?.current) {
                window.queueMicrotask(() => {
                    this._queueRender();
                });
            }
            else {
                this._queueRender();
            }
        }
    }
    _queueRender() {
        if (this._compWithContextsRef?.current) {
            this._renderCount++;
            this._compWithContextsRef.current.setState({
                compProps: this._props,
                renderCount: this._renderCount
            });
        }
        else {
            throw new Error(`Render requested for a disconnected component ${this._element.tagName}`);
        }
    }
    _verifyProps(prop, value, propMeta, subPropMeta) {
        // Skip verification step for global properties
        if (!propMeta) {
            return;
        }
        // Check readOnly property for top level property
        if (propMeta.readOnly) {
            throw new JetElementError(this._element, `Read-only property '${prop}' cannot be set.`);
        }
        try {
            checkEnumValues(this._element, prop, value, subPropMeta);
        }
        catch (error) {
            throw new JetElementError(this._element, error.message);
        }
    }
    _updateProps(propPath, value) {
        const topProp = propPath[0];
        let propsObj = this._props;
        // Set subproperty, initializing parent objects along the way
        if (propPath.length > 1) {
            // Make a copy of the current value or default value
            const currentValue = this._props[topProp] ?? this._defaultProps?.[topProp];
            if (currentValue && oj.CollectionUtils.isPlainObject(currentValue)) {
                propsObj[topProp] = oj.CollectionUtils.copyInto({}, currentValue, undefined, true);
            }
            else {
                propsObj[topProp] = {};
            }
        }
        // Walk to the correct location
        while (propPath.length) {
            const subprop = propPath.shift();
            if (propPath.length === 0) {
                propsObj[subprop] = value;
            }
            else if (!propsObj[subprop]) {
                propsObj[subprop] = {};
            }
            propsObj = propsObj[subprop];
        }
    }
    /**
     * Queues events to be fired asynchronously and returns the queued event Promise to be used
     * for dealing with cancelable events.
     * @param eventDef Definition of the event to queue
     * @private
     */
    _queueFireEventsTask(eventDef) {
        let newDef = eventDef;
        const collapseInfo = this._getEventCollapseInfo(eventDef, this._eventQueue);
        if (collapseInfo) {
            const [removeIndex, def] = collapseInfo;
            this._eventQueue.splice(removeIndex, 1);
            newDef = def;
        }
        this._eventQueue.push(newDef);
        if (!this._queuedEvents) {
            this._queuedEvents = new Promise((resolve) => {
                window.queueMicrotask(() => {
                    try {
                        while (this._eventQueue.length) {
                            const def = this._eventQueue.shift();
                            const evt = def.kind === _PROP_CHANGE
                                ? new CustomEvent(def.type, { detail: def.detail })
                                : def.event;
                            this._element.dispatchEvent(evt);
                        }
                    }
                    finally {
                        resolve();
                        this._queuedEvents = null;
                    }
                });
            });
        }
        return this._queuedEvents;
    }
    // If the new event can be combined with an existing event in the queue, this method will
    // return the index of that existing event and the definition of the combined event.
    // Otherwise the method will return null
    _getEventCollapseInfo(newDef, queue) {
        if (newDef.kind !== _PROP_CHANGE) {
            return null;
        }
        for (let i = 0; i < queue.length; i++) {
            const combined = newDef.collapse?.(queue[i]);
            if (combined) {
                return [i, combined];
            }
        }
        return null;
    }
    _verifyConnectDisconnect(state) {
        if (this._state.isComplete()) {
            // Notify ComponentWithContexts of the change in connection state so that any queued
            // Preact renders can either render or short-circuit appropriately
            // Reparents will not result in rerenders due to shouldComponentUpdate in ComponentWithContexts
            this._compWithContextsRef?.current?.setState({
                connected: state === ConnectionState.Connect
            });
        }
        if (this._verifyingState === ConnectionState.Unset) {
            window.queueMicrotask(() => {
                // This checks that we don't call any lifecycle hooks
                // for reparent case where _verifyingState has been
                // updated but the initial state we called
                // this Promise with is different
                if (this._verifyingState === state) {
                    if (this._verifyingState === ConnectionState.Connect) {
                        this._verifiedConnect();
                    }
                    else {
                        this._verifiedDisconnect();
                    }
                }
                this._verifyingState = ConnectionState.Unset;
            });
        }
        this._verifyingState = state;
    }
    _verifiedConnect() {
        if (this._state.isComplete()) {
            this._reconnectSlots();
        }
        else {
            // If the component has not finished its creation cycle,
            // attempt to create it vs handling as a reattached since
            // the component could have finished in an error state.
            // The element state will no-op the creation process if
            // the component is already in an error state.
            this._state.startCreationCycle();
            if (this._state.isCreating()) {
                const createComponentCallback = () => {
                    // Set a non enumerable flag that this element owns a preact subtree
                    // for when we walk up the parent hierarchy to determine the binding
                    // provider for any custom element children rendered by this preact
                    // component.
                    this._element[CHILD_BINDING_PROVIDER] = 'preact';
                    let slotMap = this._state.getSlotMap();
                    if (!slotMap) {
                        slotMap = this._state.getSlotMap(true);
                        const slotProps = this._removeAndConvertSlotsToProps(slotMap);
                        Object.assign(this._props, slotProps);
                    }
                    else {
                        this._reconnectSlots();
                    }
                    this._render();
                };
                this._state.setCreateCallback(createComponentCallback);
                this._state.setBindingsDisposedCallback(() => this._handleBindingsDisposed());
            }
        }
        this._state.executeLifecycleCallbacks(true);
    }
    _verifiedDisconnect() {
        this._state.executeLifecycleCallbacks(false);
        if (this._state.isComplete()) {
            this._disconnectSlots();
            this._state.resetCreationCycle();
            render(null, this._element);
            applyRef(this.ref, null);
            applyRef(this._compWithContextsRef, null);
            if (typeof this._oldRootCleanupCallback == 'function') {
                this._oldRootCleanupCallback();
                this._oldRootCleanupCallback = undefined;
            }
            applyRef(this._oldRootRef, null);
            this._oldRootRef = undefined;
            // We need to recreate our parent stub the next time we reconnect since Preact
            // stashes the last rendered vdom tree in a private variable and will assume
            // we are picking up from that spot instead of starting over.
            this._vdom = null;
        }
        else {
            this._state.pauseCreationCycle();
        }
    }
    /**
     * Initialize this._props from DOM attributes
     */
    _initializePropsFromDom() {
        const attrs = this._element.attributes;
        // Pass everything through, the overridden component render
        // will patch uncontrolled properties back to the custom element
        for (let i = 0; i < attrs.length; i++) {
            const { name, value } = attrs[i];
            const { propPath, propValue, propMeta, subPropMeta } = this._getPropValueInfo(name, value);
            if (propPath) {
                this._verifyProps(propPath, propValue, propMeta, subPropMeta);
                this._updateProps(propPath.split('.'), propValue);
            }
        }
    }
    _playbackEarlyPropertySets() {
        // Once the binding provider has resolved and we are about
        // to render the component, we no longer need to track early
        // property sets to avoid overriding data bound DOM attributes
        while (this._earlySets.length) {
            const setObj = this._earlySets.shift();
            const meta = getPropertyMetadata(setObj.property, this._metadata?.properties);
            const updatedValue = transformPreactValue(this._element, setObj.property, meta, setObj.value);
            this.setProperty(setObj.property, updatedValue);
        }
    }
    _patchRootElement(newVNode) {
        const oldProps = this._oldRootProps || this._getInitialRootProps();
        const newProps = newVNode.props;
        this._isPatching = true;
        try {
            diffProps(this._element, newProps, oldProps, false, false, IntrinsicElement._setPropertyOverrides);
        }
        finally {
            this._isPatching = false;
        }
        const newRef = newVNode.ref;
        if (this._oldRootRef !== newRef) {
            if (typeof this._oldRootCleanupCallback == 'function') {
                this._oldRootCleanupCallback();
            }
            this._oldRootCleanupCallback = applyRef(newRef, this._element);
            // reset the old ref if the new one is not null
            if (newRef) {
                applyRef(this._oldRootRef, null);
            }
        }
        this._oldRootProps = newProps;
        this._oldRootRef = newRef;
    }
    /**
     * Customizations for the setProperty behavior in Preact's diffProps()
     * License header above
     * Return true if the property has been handled, false otherwise
     * @ignore
     */
    static _setPropertyOverrides(dom, name, value, oldValue) {
        if (name === 'style' && typeof value == 'string') {
            throw new Error('CSS style must be an object. CSS text is not supported');
        }
        // Mutate classes in a non-destructive way using classList instead of className to allow
        // classes being set from outside
        if (name === 'class' || name === 'className') {
            const oldClasses = oldValue == null ? _EMPTY_SET : CustomElementUtils.getClassSet(oldValue);
            const newClasses = value == null ? _EMPTY_SET : CustomElementUtils.getClassSet(value);
            for (const cl of oldClasses.values()) {
                if (!newClasses.has(cl)) {
                    dom.classList.remove(cl);
                }
            }
            for (const cl of newClasses.values()) {
                if (!oldClasses.has(cl)) {
                    dom.classList.add(cl);
                }
            }
            return true;
        }
        else if (name[0] === 'o' && name[1] === 'n') {
            const useCapture = name !== (name = name.replace(/(PointerCapture)$|Capture$/i, '$1'));
            // Infer correct casing for DOM built-in events:
            if (name.toLowerCase() in dom || name === 'onFocusOut' || name === 'onFocusIn')
                name = name.toLowerCase().slice(2);
            else
                name = name.slice(2);
            IntrinsicElement._getRootListeners(dom, useCapture)[name] = value;
            const proxy = useCapture ? IntrinsicElement._eventProxyCapture : IntrinsicElement._eventProxy;
            if (value) {
                if (!oldValue)
                    dom.addEventListener(name, proxy, useCapture);
            }
            else {
                dom.removeEventListener(name, proxy, useCapture);
            }
            return true;
        }
        else if (name === 'role') {
            // Safari doesn't fire the custom element reaction synchronously when role is set as a property
            // (unlike other global props or even like 'role' when set as an attribute).  Overriding preact's
            // default behavior here to always patch role as an attribute (note this is already the behavior
            // in Firefox where 'role' isn't a global prop)
            if (value) {
                dom.setAttribute(name, value); // @HTMLUpdateOK
            }
            else {
                dom.removeAttribute(name);
            }
            return true;
        }
        return false;
    }
    static _getRootListeners(dom, useCapture) {
        const key = useCapture ? _CAPTURE_LISTENERS : _LISTENERS;
        let listeners = dom[key];
        if (!listeners) {
            listeners = dom[key] = {};
        }
        return listeners;
    }
    // Populate initial root props with values of the controlled properties, so that
    // they can be overridden by the component's render
    _getInitialRootProps() {
        const props = {};
        // Controlled property values have already been copied into cthe component props
        // by _initializePropsFromDom(), so we can just copy them from _props here
        for (const name of this._controlledProps.values()) {
            if (name in this._props) {
                props[name] = this._props[name];
            }
        }
        return props;
    }
    /**
     * Removes component's slot children and converts them to properties
     */
    _removeAndConvertSlotsToProps(slotMap) {
        // dynamicSlot is an object of form { prop: [propName], isTemplate: [1 for true and 0 for false]}
        const dynamicSlotMetadata = this._metadata.extension?._DYNAMIC_SLOT;
        const dynamicSlotProp = dynamicSlotMetadata?.prop;
        const slotsMetadata = this._metadata?.slots;
        const slots = Object.keys(slotMap);
        const slotProps = {};
        if (slots.length > 0) {
            slots.forEach((slot) => {
                const slotNodes = slotMap[slot];
                slotNodes.forEach((node) => {
                    ParkingLot.parkNode(node);
                    this._propagateSubtreeHidden(node);
                });
                const slotMetadata = getPropertyMetadata(slot, slotsMetadata);
                if (slotMetadata) {
                    // static slot or templateSlot
                    const isTemplateSlot = !!slotMetadata?.data;
                    const slotProperty = !isTemplateSlot && slot === '' ? 'children' : slot;
                    this._assignSlotProperty(slotProps, slotProperty, undefined, slot, isTemplateSlot, slotNodes);
                }
                else {
                    // dynamic slot or templateSlot
                    // Stop processing if node doesn't match any named slots and component
                    // does not define a dynamic slot.
                    // TODO do we throw an error or log a warning if we encounter a slot item
                    // that should go into a dynamic prop but there's no dynamic prop, basically
                    // meaning the slot content was marked incorrectly?
                    if (!dynamicSlotProp) {
                        return;
                    }
                    if (!slotProps[dynamicSlotProp]) {
                        slotProps[dynamicSlotProp] = {};
                    }
                    const isTemplateSlot = dynamicSlotMetadata.isTemplate;
                    this._assignSlotProperty(slotProps, slot, dynamicSlotProp, slot, isTemplateSlot, slotNodes);
                }
            });
        }
        if (this._state.getBindingProviderType() === 'knockout') {
            // Remove and clean non-slot children (comment nodes, etc.) to prevent them from being
            // removed by Preact without being cleaned
            let child;
            while ((child = this._element.firstChild)) {
                this._state.getBindingProviderCleanNode()(child);
                child.remove(); // No ts definition for remove() yet
            }
        }
        return slotProps;
    }
    _assignSlotProperty(slotProps, propName, containerPropName, slotName, isTemplateSlot, slotNodes) {
        const propContainer = containerPropName ? slotProps[containerPropName] : slotProps;
        if (isTemplateSlot) {
            if (slotNodes[0]?.nodeName === 'TEMPLATE') {
                // Handle template slots
                const templateNode = slotNodes[0];
                let renderer = templateNode['render'];
                if (renderer) {
                    propContainer[propName] = renderer;
                    // Handle the case where the renderer gets updated on the template
                    Object.defineProperties(templateNode, {
                        render: {
                            enumerable: true,
                            get: () => {
                                return renderer;
                            },
                            set: (newRenderer) => {
                                renderer = newRenderer;
                                if (newRenderer) {
                                    this._updateProps([propName], newRenderer);
                                    this._queueRender();
                                }
                            }
                        }
                    });
                }
                else {
                    propContainer[propName] = this._getSlotRenderer(templateNode, propName, containerPropName);
                }
            }
            else {
                throw new JetElementError(this._element, `Slot content for template slot ${slotName} must be a template element.`);
            }
        }
        else {
            const vnodes = slotNodes.map((node, index) => convertToVNode(this._element, node, this._handleSlotMount.bind(this), this._handleSlotUnmount.bind(this)));
            propContainer[propName] = vnodes;
        }
    }
    _getSlotRenderer(templateNode, slotProp, containerProp) {
        const bindingProvider = this._state.getBindingProvider();
        const mutationCallback = bindingProvider
            ? () => {
                const propContainer = containerProp ? this._props[containerProp] : this._props;
                propContainer[slotProp] = this._getSlotRenderer(templateNode, slotProp, containerProp);
                this._queueRender();
            }
            : null;
        return (context) => {
            const cachedTemplateEngine = this._state.getTemplateEngine();
            if (!cachedTemplateEngine) {
                throw new JetElementError(this._element, 'Unexpected call to render a template slot');
            }
            return cachedTemplateEngine.execute(this._element, templateNode, context, bindingProvider, mutationCallback);
        };
    }
    _handleBindingsDisposed() {
        ParkingLot.disposeNodes(this._state.getSlotMap(), this._state.getBindingProviderCleanNode());
        this._state.disposeTemplateCache();
    }
    _disconnectSlots() {
        ParkingLot.disconnectNodes(this._state.getSlotMap());
    }
    _reconnectSlots() {
        ParkingLot.reconnectNodes(this._state.getSlotMap());
    }
    _propagateSubtreeHidden(node) {
        // Notiify legacy JET components within the slot that they are now in a hidden subtree
        if (node.nodeType === Node.ELEMENT_NODE) {
            CustomElementUtils.subtreeHidden(node);
        }
    }
    _handleSlotUnmount(node) {
        // Check for complete state to avoid parking slots when the entire component
        // is unmounted
        if (this._state.isPostCreateCallbackOrComplete() && this._element.isConnected) {
            ParkingLot.parkNode(node);
            // Check if the node is still parked after a microtask
            // to avoid .subtreeHidden traversal for slots that get
            // redistributed to a new parent
            window.queueMicrotask(() => {
                if (ParkingLot.isParked(node)) {
                    this._propagateSubtreeHidden(node);
                }
            });
        }
    }
    _handleSlotMount(node) {
        // Notiify legacy JET components within the slot that they are no longer in a hidden subtree
        const handleMount = CustomElementUtils.subtreeShown;
        if (handleMount && node.nodeType === Node.ELEMENT_NODE) {
            if (node.isConnected) {
                handleMount(node);
            }
            else {
                // Since legacy JET expects the node to be fully connected with when subtreeShown is invoked,
                // invoke the callback when Preact's diff is done
                window.queueMicrotask(() => handleMount(node));
            }
        }
    }
    static _eventProxy(e) {
        this[_LISTENERS][e.type](options.event ? options.event(e) : e);
    }
    static _eventProxyCapture(e) {
        this[_CAPTURE_LISTENERS][e.type](options.event ? options.event(e) : e);
    }
    _initializeActionCallbacks(eventsMeta) {
        Object.keys(eventsMeta).forEach((event) => {
            const eventMeta = eventsMeta[event];
            // Preact expects jsx custom event listeners to be of the form
            // on[eventType], e.g. onojAction which is different than our DOM
            // event listener syntax of on[EventType], e.g. onOjAction.
            const eventProp = AttributeUtils.eventTypeToEventListenerProperty(event);
            this._props[eventProp] = (detailObj) => {
                const detail = Object.assign({}, detailObj);
                // If we're firing a cancelable event, inject an accept function into
                // the event detail so the consumer can asynchronously cancel the event.
                // We only support an asynchronously cancelable event at the moment.
                const cancelable = !!eventMeta.cancelable;
                const acceptPromises = [];
                if (cancelable) {
                    detail.accept = (promise) => {
                        acceptPromises.push(promise);
                    };
                }
                const eventDescriptor = { detail, bubbles: !!eventMeta.bubbles, cancelable };
                const customEvent = new CustomEvent(event, eventDescriptor);
                const eventPromise = this._queueFireEventsTask({ event: customEvent, kind: _ACTION });
                if (cancelable) {
                    return eventPromise.then(() => {
                        return customEvent.defaultPrevented
                            ? Promise.reject()
                            : Promise.all(acceptPromises).then(() => Promise.resolve(), (reason) => Promise.reject(reason));
                    });
                }
                return undefined;
            };
        });
    }
    _initializeWritebackCallbacks(writebackProps) {
        writebackProps.forEach((propPath) => {
            // e.g. value -> onValueChanged
            const callbackProp = AttributeUtils.propertyNameToChangedCallback(propPath);
            const { prop: propMeta, subProp: subPropMeta } = getComplexPropertyMetadata(propPath, this._metadata?.properties);
            this._props[callbackProp] = (value) => {
                // The inner set will trigger a call to _updateProperty
                // to mutate the property and queue the property changed event
                this._updatePropsAndQueueRenderAsNeeded(propPath, value, propMeta, subPropMeta, false);
            };
        });
    }
}
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["Connect"] = 0] = "Connect";
    ConnectionState[ConnectionState["Disconnect"] = 1] = "Disconnect";
    ConnectionState[ConnectionState["Unset"] = 2] = "Unset";
})(ConnectionState || (ConnectionState = {}));

// This method is added to support ref cleanup feature. It is added for the future use
// when the outer component will need to pass a ref with cleanup callback.
// Currently both refs wrapped by EnvironmentWrapper are created by JET
// and do not have cleanup callbacks - the 'ref' added by ManageTabStops component and
// child.ref added by VComponentTemplate.
const getCleanupFunc = (c1, c2) => {
    return c1 || c2
        ? () => {
            if (typeof c1 == 'function') {
                c1();
            }
            if (typeof c2 == 'function') {
                c2();
            }
        }
        : undefined;
};
const EnvironmentWrapper = forwardRef((props, ref) => {
    // The props.children is guaranteed to be a single IntrinsicElement.
    // See how EnvironmentWrapper is used in preactOptions.
    let child = props.children;
    // This list will never change, so we're not using any hooks on a conditional basis
    const contexts = getElementRegistration(child.type).cache
        .contexts;
    const allContexts = [EnvironmentContext, ...(contexts ?? [])];
    const allValues = allContexts.map((context) => {
        // Get the provided value from __oj_provided_contexts property.
        // Use provided if exists, otherwise use the value from Preact context.
        // Note, that __oj_provided_contexts might be assigned via VTemplateEngine code.
        const ctxValue = useContext(context);
        const providedValue = child.props.__oj_provided_contexts?.get(context);
        return providedValue !== undefined ? providedValue : ctxValue;
    });
    // use memo here so that we only push a new value into __oj_private_contexts if there's actually been a change
    // to one of the Context values
    const contextMap = useMemo(() => {
        const map = new Map();
        for (let i = 0; i < allContexts.length; i++) {
            map.set(allContexts[i], allValues[i]);
        }
        return map;
    }, allValues);
    if (child.props.__oj_private_contexts !== undefined &&
        child.props.__oj_private_contexts !== contextMap) {
        // Clone the memoized child to trigger child rendering in preact.
        // The cloneElement(child) will wrap the child in another EnvironmentWrapper, so we need to take a child of the wrapper.
        child = cloneElement(child).props.children;
    }
    child.props.__oj_private_contexts = contextMap;
    // We need this code to handle ManageTabStops component that will wrap the EnvironmentWrapper and
    // wants to set a ref on a child component to access it for updating tabindex. See JET-54400 for details.
    // See note for getCleanupFunc().
    if (ref) {
        if (child.ref) {
            const originalRef = child.ref;
            child.ref = (el) => {
                let cleanup1, cleanup2;
                // Process original ref from this child element
                cleanup1 = applyRef(originalRef, el);
                // Process new ref passed to the EnvironmentWrapper
                cleanup2 = applyRef(ref, el);
                return getCleanupFunc(cleanup1, cleanup2);
            };
        }
        else {
            child.ref = ref;
        }
    }
    return jsx(Fragment, { children: child });
});
EnvironmentWrapper['__ojIsEnvironmentWrapper'] = true;

const injectSymbols = (props, property) => {
    if (Object.prototype.hasOwnProperty.call(props, property)) {
        const newKey = publicToPrivateName.get(property);
        props[newKey] = toSymbolizedValue(props[property]);
        delete props[property];
    }
};
const oldVNodeHook = options.vnode;
let isCloningElement = false; // flag to avoid infinite loop
options.vnode = (vnode) => {
    const type = vnode.type;
    // preact/compat coerces null property values to undefined.  this tends not
    // to matter in most cases since preact's diffing checks tend to rely on ==
    // comparison rather than ===.  however, for the 'value' and 'checked' properties,
    // preact itself ignores undefined values in a props object.  as a result,
    // there's no way to set a custom element property to null or undefined.
    //
    // this will hopefully be addressed via preact issue https://github.com/preactjs/preact/issues/3276
    // but in the meantime we replace these values with Symbols that we can recognize
    // in our custom element property setters so that we can honor the JSX author's
    // original intent.
    //
    // specifically checking for known JET custom elements rather than a more
    // generic check for the '-' character to avoid injecting our JET-specific
    // Symbols into some third party component which won't know what to do with them
    // (and all this call does is a map lookup)
    if (typeof type === 'string' && isElementRegistered(type)) {
        const props = vnode.props;
        injectSymbols(props, 'value');
        injectSymbols(props, 'checked');
    }
    if (typeof type === 'string' && !isCloningElement && isVComponent(type)) {
        isCloningElement = true;
        try {
            const origVNode = cloneElement(vnode);
            const wrapper = jsx(EnvironmentWrapper, { children: origVNode });
            Object.assign(vnode, wrapper);
        }
        finally {
            isCloningElement = false;
        }
    }
    oldVNodeHook?.(vnode);
};
// Replace requestAnimationFrame option to add JET busy context logic.
const RAF_TIMEOUT = 100;
const originalRAF = options.requestAnimationFrame;
function _requestAnimationFrame(task) {
    // Create RAF promise that mimics Preact RAF timeout logic.
    const rafPromise = new Promise((res) => {
        const callback = () => {
            res();
            Context.__removePreactPromise(rafPromise);
            task();
        };
        if (originalRAF) {
            originalRAF(callback);
        }
        else {
            const done = () => {
                clearTimeout(timeout);
                cancelAnimationFrame(raf);
                setTimeout(callback);
            };
            const timeout = setTimeout(done, RAF_TIMEOUT);
            const raf = requestAnimationFrame(done);
        }
    });
    // Add the the promise to the map of preact promises.
    Context.__addPreactPromise(rafPromise, 'Preact requestAnimationFrame');
}
options.requestAnimationFrame = _requestAnimationFrame;

// Override for preact options used by preact/debug to check validity of the component hook.
// The preact/debug logic is based on a global 'hooksAllowed' flag that does not check
// which component uses the hook. The hook check logic can be broken, when
// the render flow is interrupted by independent preact.render() calls.
// This override is an attempt to fix the problem for JET applications that might
// use preact.render() to clean legacy component templates as necessary.
// Specifically the fix is related to JET-69144 - a vcomponent based on oj-tree-view updates DP
// in useEffect() that triggeres templates clean for oj-tree-view.
const opts = options;
let isPreactDebugEnabled = opts.__m || opts._hydrationMismatch;
if (isPreactDebugEnabled) {
    const componentStack = [];
    // It is possible to have two versions of _render option.
    // The preact-devtools extension defines both variants, but if preact/compat was
    // loaded after preact-devtools it will override one of those.
    // It is not the case for _catchError or _hook.
    // Lets store both of them but call only one based on the knowledge
    // whether preact is mangled or not (vcomponent._component property)
    const isPreactMangled = opts._hydrationMismatch ? false : true;
    const oldRender = isPreactMangled ? opts.__r : opts._render;
    const oldCatchError = isPreactMangled ? opts.__e : opts._catchError;
    const oldDiffed = opts.diffed;
    const removeCompFromStack = (vnode) => {
        const testComp = componentStack[componentStack.length - 1];
        const comp = vnode.__c || vnode._component;
        if (testComp === comp) {
            componentStack.pop();
        }
    };
    // options._render
    opts._render = opts.__r = (vnode) => {
        const comp = isPreactMangled ? vnode.__c : vnode._component;
        componentStack.push(comp);
        if (oldRender)
            oldRender(vnode);
    };
    // options._hook
    opts._hook = opts.__h = (comp, index, type) => {
        const testComp = componentStack[componentStack.length - 1];
        if (!comp || testComp !== comp) {
            throw new Error('Hook can only be invoked from render methods.');
        }
    };
    // options._catchError
    opts._catchError = opts.__e = (error, vnode, oldVNode, errorInfo) => {
        removeCompFromStack(vnode);
        if (oldCatchError)
            oldCatchError(error, vnode, oldVNode, errorInfo);
    };
    // options.diffed
    opts.diffed = (vnode) => {
        removeCompFromStack(vnode);
        if (oldDiffed)
            oldDiffed(vnode);
    };
}

/**
 * Class decorator for VComponent custom elements. Takes the tag name
 * of the custom element.
 * @param {string} tagName The custom element tag name
 * @name customElement
 * @function
 * @ojexports
 * @memberof ojvcomponent
 * @ojdecorator
 */

/**
 * Class decorator for VComponent custom elements that specifies a list of Preact Contexts
 * whose values should be made available to the inner virtual dom tree of the VComponent when
 * rendered as an intrinsic element.  This allows the inner virtual dom tree to have access to
 * the Context values from the parent component when rendered either directly as part of the parent
 * component's virtual dom tree or when rendered as template slot content in a parent VComponent.  Note
 * that any intrinsic elements within the inner virtual dom tree must also specify a list of Contexts
 * to further propagate their values.
 *
 * @param {$$$Array<Context<any>>} contexts The list of Preact Contexts
 * @name consumedContexts
 * @function
 * @ojexports
 * @memberof ojvcomponent
 * @ojdecorator
 */

/**
 * Method decorator for VComponent class methods that should be exposed on the custom element
 * as part of its public API. Non-decorated VComponent class methods will not be made available
 * on the custom element.
 * @name method
 * @function
 * @ojexports
 * @memberof ojvcomponent
 * @ojdecorator
 */

/**
 * @ojmodulecontainer ojvcomponent
 * @ojhidden
 * @since 11.0.0
 * @ojtsimport {module: "ojmetadata", type: "AMD", importName:"MetadataTypes"}
 * @classdesc
 * <p>The VComponent API is a mechanism for creating virtual DOM-based
 * Web Components.  VComponents are authored in TypeScript as either
 * <a href="https://preactjs.com/">Preact</a> class-based
 * components or function-based components.  Class-based components specify their
 * custom element tag via the <a href="#customElement">&#64;customElement</a> decorator:
 * </p>
 * <pre class="prettyprint"><code>import { Component, ComponentChild } from 'preact';
 * import { customElement, GlobalProps } from 'ojs/ojvcomponent';
 *
 * &#64;customElement('oj-hello-world')
 * export class HelloWorld extends Component&lt;GlobalProps&gt; {
 *   render(): ComponentChild {
 *     return &lt;div&gt;Hello, World!&lt;/div&gt;;
 *   }
 * }
 * </code></pre>
 * Function-based components register their custom element tag with the VComponent
 * framework via the <a href="#registerCustomElement">registerCustomElement</a>
 * function:
 * <pre class="prettyprint"><code>import { registerCustomElement } from 'ojs/ojvcomponent';
 *
 * export const HelloWorld = registerCustomElement(
 *   'oj-hello-world',
 *   () => {
 *     return &lt;div&gt;Hello, World!&lt;/div&gt;;
 *   }
 * );
 * </code></pre>
 * <p>
 *   In order to prepare the component for use, the VComponent must be run
 *   through the <a href="https://www.npmjs.com/package/@oracle/ojet-cli">ojet
 *   CLI</a> build process.  Running <code>ojet build</code> will do the
 *   following:
 * </p>
 * <ul>
 *   <li>Inject necessary information into the module to enable Web Component
 *   usage.</li>
 *   <li>Generate a type definition that includes Web Component type info.</li>
 *   <li>Generate a component.json metadata file for enabling integration
 *   with <a href="https://developer.oracle.com/visual-builder/">Oracle
 *   Visual Builder</a></li>
 * </ul>
 * <p>
 *   Once the VComponent has been built, it can either be consumed as a
 *   plain old Web Component in HTML content, for example:
 * </p>
 * <pre class="prettyprint"><code>&lt;!-- This is HTML: --&gt;
 * &lt;oj-hello-world&gt;&lt;/oj-hello-world&gt;
 * </code></pre>
 * <p>
 *   Or via the Preact component class in JSX:
 * </p>
 * <pre class="prettyprint"><code>// This is JSX:
 * const hw =  &lt;HelloWorld /&gt;
 * </code></pre>
 * <p>
 *   These both produce the same DOM content.  That is, in both cases, an
 *   &lt;oj-hello-world&gt; custom element is created and added to the DOM.  In
 *   the case where the VComponent is referenced via its Preact component
 *   class, this custom element is automatically created and wrapped around
 *   the rendered content (the &lt;div&gt; in the above example) by the
 *   VComponent framework.
 * </p>
 * <h3 id="creating">
 *  Creating VComponents
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#creating"></a>
 * </h3>
 * <p>
 *   VComponents can be created either by hand or via the ojet
 *   CLI's "create component" command, for example:
 * </p>
 * <pre class="prettyprint"><code>$ ojet create component oj-hello-world --vcomponent
 * </code></pre>
 * <p>
 *   When running the <code>ojet create component</code> commmand, the custom
 *   element tag name is specified as an argument, and the --vcomponent flag
 *   indicates that a VComponent (as opposed to a Composite Component) should
 *   be created.
 * </p>
 * <p>
 *   (Note: if the application was originally created using the --vdom
 *   flag, the <code>ojet create component</code> command will default to
 *   creating VComponents and the --vcomponent flag can be omitted.
 * </p>
 * <p>
 * The ojet create component command creates some
 * supporting artifacts, including:
 * </p>
 * <ul>
 *   <li>A loader module</li>
 *   <li>A style sheet and SASS files for theming</li>
 *   <li>A resource module for translated strings</li>
 * </ul>
 * <p>
 *   In addition, ojet will ensure that the path to the VComponent is
 *   properly configured in the application's tsconfig.json
 * </p>
 * <h3 id="properties">
 *  Properties
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#properties"></a>
 * </h3>
 * <p>
 *   VComponents/Preact components declare their supported properties
 *   via a type parameter. For example, as we saw above:
 * </p>
 * <pre class="prettyprint"><code>export class HelloWorld extends Component&lt;GlobalProps&gt; {
 * </code></pre>
 * <p>
 *   With this declaration, the component indicates that it supports
 *   the properties specified via the
 *   <a href="#GlobalProps">GlobalProps</a> type.  This type
 *   includes a subset of the
 *   <a href="https://html.spec.whatwg.org/#global-attributes">
 *   global HTML attributes</a> which represent
 *   the minimally required set of properties that all VComponents
 *   must support.
 * </p>
 * <p>
 *   VComponents can, of course, expose other non-global,
 *   component-specific properties as well.  This is typically done by
 *   declaring a type alias:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *   greeting?: string;
 *   name?: string;
 * }
 * </code></pre>
 * <p>
 *   And associating this type with the first type parameter in the
 *   <a href="https://preactjs.com/guide/v10/api-reference#component">
 *   Component</a> class declaration.
 * </p>
 * <p>
 *   Since VComponents are minimally required to support the
 *   global HTML attributes defined by GlobalProps, the
 *   component-specific props must be combined with GlobalProps.  The
 *   VComponent API includes a utility type to help with this:
 *   <a href="#ExtendGlobalProps">ExtendGlobalProps</a>.
 *   Using ExtendGlobalProps, a component with
 *   the above Props type (including some default values) ends up looking like:
 * </p>
 * <pre class="prettyprint"><code>import { Component, ComponentChild } from 'preact';
 * import { customElement, ExtendGlobalProps } from 'ojs/ojvcomponent';
 *
 * type Props = {
 *   greeting?: string;
 *   name?: string;
 * }
 *
 * &#64;customElement('oj-hello-world-with-props')
 * export class HelloWorld extends Component&lt;ExtendGlobalProps&lt;Props&gt;&gt; {
 *   render(props: Readonly&lt;Props&gt;): ComponentChild {
 *     const { greeting, name } = props;
 *
 *     return &lt;div&gt;{ greeting }, { name }!&lt;/div&gt;;
 *   }
 *
 *   static defaultProps: Props = {
 *     greeting: "Hello",
 *     name: "World"
 *   };
 * }
 * </code></pre>
 * <p>
 *   In Preact, properties can be accessed either through this.props
 *   or via the first argument of the render method.
 * </p>
 * <p>
 *   Properties can be set on the component in various ways, including:
 * </p>
 * <ol>
 *   <li>As attributes in HTML markup</li>
 *   <li>As properties in JSX</li>
 *   <li>As properties on the DOM element</li>
 * </ol>
 * <p>
 *   One note on naming conventions: when referencing properties within JSX
 *   or on a DOM element (#2 and #3), the property name as specified in the
 *   component type is always used.
 * </p>
 * <p>
 *   However, for attributes in HTML markup (#1), JET uses a different
 *   naming convention for multi-word attributes.  As discussed in
 *   <a href="CustomElementOverview.html#ce-proptoattr-section">
 *   Property-to-Attribute Mapping</a>, JET converts camelCased property names
 *   into hyphen-separated, kebab-case attribute names.  As such, given the
 *   following property:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *     preferredGreeting?: string;
 * }
 * </code></pre>
 * <p>
 *   The attribute name "preferred-greeting" is used in HTML markup:
 * </p>
 * <pre class="prettyprint"><code>&lt;!-- This is HTML --&gt;
 * &lt;oj-hello-world preferred-greeting="Hi"&gt;&lt;/oj-hello-world&gt;
 * </code></pre>
 * <p>
 *   And the unmodified property name is used everywhere else:
 * </p>
 * <pre class="prettyprint"><code>// This is JSX
 * function Parent() {
 *   return &lt;HelloWorld preferredGreeting="Hi" /&gt;
 * }
 *
 * // This is also JSX
 * function ParentOfCustomElement() {
 *   return &lt;oj-hello-world preferredGreeting="Hi" /&gt;
 * }
 *
 * // This is plain old DOM
 * const helloWorld = document.createElement("oj-hello-world");
 * helloWorld.preferredGreeting = "Hi";
 * </code></pre>
 * </p>
 * <h3 id="children">
 *  Children and Slots
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#children"></a>
 * </h3>
 * <p>
 *   Many Web Components allow children to be specified, either as
 *   direct children or via named
 *   <a href="CustomElementOverview.html#ce-slots-section">slots</a>.
 *   A VComponent indicates
 *   that it takes arbitrary (non-named) children by declaring a "children"
 *   property using Preact's ComponentChildren type.  Named slots are
 *   declared in a similar fashion, using the
 *   VComponent-specific <a href="#Slot">Slot</a> type:
 * </p>
 * <pre class="prettyprint"><code>import { Component, ComponentChildren } from 'preact';
 * import { customElement, ExtendGlobalProps, Slot } from 'ojs/ojvcomponent';
 *
 * type Props = {
 *   // This indicates that the VComponent accepts arbitrary
 *   // (non-slot) children:
 *   children?: ComponentChildren;
 *
 *   // And this indicates that the VComponent accepts a
 *   // slot named "start"
 *   start?: Slot;
 * }
 * </code></pre>
 * <p>
 *   Both children and slots can be embedded directly in a virtual DOM
 *   tree:
 * </p>
 * <pre class="prettyprint"><code>  render(props: Readonly&lt;Props&gt;): ComponentChild {
 *     return (
 *       &lt;div&gt;
 *         // Place the start slot before our greeting
 *         { props.start }
 *
 *         Hello, World!
 *
 *         &lt;div&gt;
 *           // And dump any other children in a wrapper div
 *           { props.children }
 *         &lt;/div&gt;
 *       &lt;/div&gt;
 *     );
 *   }
 * </code></pre>
 * <p>
 *   In cases where the VComponent needs to inspect children or
 *   slot content, these values must first be normalized to a
 *   flattened array by calling Preact's
 *   <a href="https://preactjs.com/guide/v10/api-reference/#tochildarray">
 *   toChildArray</a>.
 * </p>
 * <p>
 *   When consuming the VComponent as a custom element, slots are
 *   specified using the slot attribute:
 * </p>
 * <pre class="prettyprint"><code>      &lt;!-- This is HTML --&gt;
 *       &lt;oj-hello-world-with-children&gt;
 *         &lt;!-- This is the start slot content: --&gt;
 *         &lt;oj-avatar slot="start" initials="HW"&gt;&lt;/oj-avatar&gt;
 *
 *         &lt;!-- This is other child content: --&gt;
 *         &lt;span&gt;Child content&lt;/span&gt;
 *       &lt;/oj-hello-world-with-children&gt;
 * </code></pre>
 * <p>
 *   However, when referencing the VComponent as a Preact component,
 *   slots are configured as plain old component properties:
 * </p>
 * <pre class="prettyprint"><code>function Parent() {
 *   return (
 *     &lt;HelloWorldWithChildren start={ &lt;oj-avatar initials="OJ" /&gt; }&gt;
 *       &lt;span&gt;Child content&lt;/span&gt;
 *     &lt;/HelloWorldWithChildren&gt;
 *   )
 * }
 * </code></pre>
 * <p>
 *   In some scenarios, JET application developers may require runtime access to a
 *   <a href="oj.BusyContext.html">BusyContext</a> scoped to a VComponent's children
 *   or to a particular named slot's contents. For example, application developers may
 *   require a mechanism for waiting until all of a slot's component contents have been created
 *   and initialized before programmatically interacting with the contents. For these scenarios,
 *   the VComponent API provides a <a href="#ImplicitBusyContext">ImplicitBusyContext</a> marker type
 *   that can be included via intersection with the ComponentChildren or Slot property declaration.
 * </p>
 * <h3 id="template-slots">
 *  Template Slots
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#template-slots"></a>
 * </h3>
 * <p>
 *   As with other JET components, VComponents can expose
 *   <a href="CustomElementOverview.html#ce-slots-template-section">
 *   template slots.</a>
 *   Template slots differ from plain old slots in that they are invoked
 *   with some context.  Template slots are most commonly used within
 *   iterating "collection" components, which need to stamp out some bit of
 *   content corresponding to each value/row/item in a data set.
 * </p>
 * <p>
 *   Like other slots, template slots are declared as properties.  Rather
 *   than using the Slot type, the <a href="#TemplateSlot">TemplateSlot</a>
 *   type is used:
 * </p>
 * <pre class="prettyprint"><code>import { Component } from "preact";
 * import { customElement, ExtendGlobalProps, TemplateSlot } from "ojs/ojvcomponent";
 *
 * type Props = {
 *   // This indicates that the VComponent exposes a template
 *   // slot named "itemTemplate":
 *   itemTemplate?: TemplateSlot&lt;ItemContext&gt;;
 * }
 *
 * // This is the type for the context that we'll
 * // pass into the itemTemplate slot
 * type ItemContext = {
 *   index?: number;
 *   label?: string;
 *   value?: string;
 * }
 * </code></pre>
 * <p>
 *   TemplateSlot is a function type that takes a single parameter:
 *   the context that is passed in when the template slot is
 *   rendered.  The VComponent invokes the template slot function
 *   with this context and embeds the results in the virtual DOM tree:
 * </p>
 * <pre class="prettyprint"><code>// Invoke the template slot and embed the results
 * // in a list item:
 * &lt;li&gt; {
 *   props.itemTemplate?.({
 *     index: currentIndex,
 *     label: currentLabel,
 *     value: currentValue
 *   })
 * }
 * &lt;/li&gt;
 * </code></pre>
 * <p>For each template slot, type alias definitions representing the context and renderer function signature are generated
 * at build time as part of the corresponding custom element namespace. The names of these type alias definitions
 * are derived from a base which, by default, is the template slot name. This base is converted from <i>camelCase</i> to
 * <i>PascalCase</i> to determine a <code>&lt;RootName&gt;</code>, and then the resulting type alias names are
 * '<code>&lt;RootName&gt;</code>Context' for the context type and 'Render<code>&lt;RootName&gt;</code>' for the
 * renderer function signature type. In addition:
 * <ul><li>if a template slot is defined with an empty context object, then no corresponding context type alias definition will
 * be generated;</li>
 * <li>the VComponent author can override the default base used to derive a particular template slot's type alias definition names
 * by specifying a value for an optional <code>templateSlotAlias</code> metadata property associated with that template slot.</li></ul></p>
 * <p>Note that while component consumers specify the contents for a template slot using a
 * &lt;template> element and standard HTML markup, the component implementation sees template slots as functions
 * that return virtual DOM nodes.  This transformation between live DOM and virtual DOM is performed
 * through the use of a <a href="oj.CspExpressionEvaluator.html">CSPExpressionEvaluator</a> instance.  This has
 * two consequences:
 * <ul><li>expressions used within VComponent template slots are subject to the syntax
 * <a href="oj.CspExpressionEvaluator.html#invalidExpressions">limitations</a> documented by
 * CSPExpressionEvaluator;</li>
 * <li>globally-scoped variables are not available within expressions unless the
 * application has registered a CSPExpressionEvaluator with a
 * <a href="oj.CspExpressionEvaluator.html#CspExpressionEvaluator">global scope</a> that exposes
 * these variables.</li></ul></p>
 * <h3 id="actions">
 *  Actions and Events
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#actions"></a>
 * </h3>
 * <p>
 *   As with other types of Web Components, VComponents can be the source
 *   of events, typically fired in response to some user interaction.
 *   VComponents specify their event contracts by declaring properties of
 *   the form "on&lt;PascalCaseEventName&gt;" of type
 *   <a href="#Action">Action</a>.  For example, the
 *   following declaration indicates that the component fires a
 *   "greetingComplete" event:
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps, Action } from 'ojs/ojvcomponent';
 *
 * type Props = {
 *   onGreetingComplete?: Action;
 *
 *   // Other component props...
 * }
 * </code></pre>
 * <p>
 *   Action is a function type that optionally takes an argument
 *   representing the event detail payload.  For events that include a
 *   detail payload, the detail type is specified via a type parameter:
 * </p>
 * <pre class="prettyprint"><code>type Detail = {
 *   status: "success" | "failure";
 * }
 *
 * type Props = {
 *   onGreetingComplete?: Action&lt;Detail&gt;;
 * }
 * </code></pre>
 * <p>
 *   The VComponent triggers the event by invoking the Action property and
 *   providing the detail payload:
 * </p>
 * <pre class="prettyprint"><code>  this.props.onGreetingComplete?.({ status: "success"});
 * </code></pre>
 * <p>
 *   When used in custom element form, this dispatches an
 *   actual DOM
 *   <a href="https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent">
 *   CustomEvent</a>.  See the
 *   <a href="CustomElementOverview.html#ce-events-section">Events and
 *   Listeners</a> topic for
 *   details on how to respond to these events.
 * </p>
 * <p>
 *   By default, events that are dispatched by the VComponent framework do
 *   not bubble.  See the <a href="#Bubbles">Bubbles</a> type for info on
 *   how to declare bubbling events.
 * </p>
 * <p>
 *   When consumed as a Preact component, no DOM events are created or
 *   dispatched.  Instead, the Action callback is simply invoked directly.
 *   There is no automatic event bubbling-like behavior in this case.
 * </p>
 * <p>
 *  The VComponent API also supports a contract for actions/events that
 *  can be vetoed by the consumer.  See the
 *  <a href="#CancelableAction">CancelableAction</a> type for details.
 * </p>
 * <h3 id="methods">
 *  Methods
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#methods"></a>
 * </h3>
 * <p>
 *  Some Web Components need to expose non-standard, component specific
 *  methods on their custom elements.  For example, the
 *  <a href="oj.ojPopup.html">&lt;oj-popup&gt;</a>
 *  custom element exposes
 *  <a href="oj.ojPopup.html#open">open</a>,
 *  <a href="oj.ojPopup.html#isOpen">isOpen</a> and
 *  <a href="oj.ojPopup.html#close">close</a> methods.
 * </p>
 * <p>
 *  While it is preferable to favor declarative, property-driven APIs over
 *  imperative, method-centric contracts, the VComponent API does allow
 *  components to expose methods on their custom elements.
 * </p>
 * <p>
 *  By default, no methods defined on a VComponent class are surfaced
 *  on the custom element.  To indicate that a VComponent class method should be
 *  included in the custom element's public API, simply mark the method with the
 *  <a href="#method">&#64;method</a> decorator.
 * </p>
 * <p>
 *  Function-based VComponents that wish to expose public methods must wrap their Preact
 *  functional component implementation in a call to
 *  <a href="https://preactjs.com/guide/v10/switching-to-preact/#forwardref">forwardRef</a>
 *  at the time of registration with the VComponent framework, and leverage the
 *  <code>useImperativeHandle</code> hook within their Preact implementation. See
 *  the <a href="#registerCustomElement">registerCustomElement</a> function for further details.
 * </p>
 * <h3 id="writeback">
 *  Writeback Properties
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#writeback"></a>
 * </h3>
 * <p>
 *   JET-based Web Components support a mechanism by which components can
 *   trigger changes to their own properties.  For example, the JET input
 *   and select components notify consumers of changes to the value
 *   property as the user enters new values.  When combined with two-way
 *   binding, this can be used to update values referenced via JET binding
 *   expressions.  This process is known as "writeback".  See the
 *   <a href="CustomElementOverview.html#ce-databind-writeback-section">
 *   Writeback</a> section in the
 *   <a href="CustomElementOverview.html">JET Web Components</a> topic
 *   for background.
 * </p>
 * <p>
 *   VComponents declare writeback properties by pairing a normal property
 *   declaration with a companion callback property that is invoked when the
 *   component wants to trigger a writeback.  For example, this plain old
 *   (non-writeback) value property:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *
 *   // This is a plain old (non-writeback) value property:
 *   value?: string;
 * }
 * </code></pre>
 * <p>
 *   Can be converted into a writeback property by adding a second property named
 *   "onValueChanged":
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps, PropertyChanged } from "ojs/ojvcomponent";
 *
 * type Props = {
 *   value?: string;
 *
 *   // The presence of this callback promotes "value" into a
 *   // writeback property
 *   onValueChanged?: PropertyChanged&lt;string&gt;;
 * }
 * </code></pre>
 * <p>
 *   Both the event name and type are significant.  In order to be
 *   recognizable as a writeback property, the companion callback property
 *   must follow the naming convention "on&lt;PropertyName&gt;Changed" and must
 *   be of type <a href="#PropertyChanged">PropertyChanged</a>.
 * </p>
 * <p>
 *   Similar to Actions, invoking a PropertyChanged callback has different
 *   implications depending on whether the VComponent is being consumed as
 *   a custom element or as a Preact component.
 * </p>
 * <p>
 *   When the VComponent is used in its custom element form, invoking the
 *   PropertyChanged callback results in an actual DOM
 *   <a href="CustomElementOverview.html#ce-properties-changed-section">
 *   propertyChanged event</a>
 *   being created and dispatched.  This allows JET's two-way binding
 *   mechanism to kick in.  If the property is configured with a two-way
 *   binding, the new value will be written back into the expression.
 * </p>
 * <p>
 *   In addition, when used as a custom element, triggering a writeback
 *   automatically queues a render of the VComponent, allowing the
 *   VComponent to re-render with the new value.
 * </p>
 * <p>
 *   When the VComponent is used via its Preact component class, no DOM
 *   event is created or dispatched.  Instead, the PropertyChanged callback
 *   is simply invoked with the new value.  The parent component is then
 *   responsible for deciding whether re-render with the new value or not.
 * </p>
 * <p>
 *   The VComponent API also supports writeback properties which can be
 *   read/observed by the consumer, but are only ever written by the
 *   component itself.  These are known as
 *   <a href="CustomElementOverview.html#ce-properties-readonlywriteback-section">
 *   read-only writeback properties</a>.
 *   See the <a href="#ReadOnlyPropertyChanged">ReadOnlyPropertyChanged<a> type for info on how
 *   to configure these properties.
 * </p>
 * <h3 id="observed">
 *  Observed Global Properties
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#observed"></a>
 * </h3>
 * <p>
 *   As discussed above, all VComponents minimally support the set of
 *   global HTML attributes defined by the GlobalProps/ExtendGlobalProps
 *   types.  This means that when consuming a VComponent either via its
 *   custom element tag or VComponent class, global attributes (e.g., id,
 *   tabIndex, title, etc...) can be specified:
 * </p>
 * <pre class="prettyprint"><code>function Parent() {
 *   // We can pass GlobalProps like id into any VComponent:
 *   return &lt;HelloWorld id="hw" /&gt;
 * }
 * </code></pre>
 * <p>
 *   The VComponent framework automatically transfers any global properties
 *   through to the underlying custom element in the DOM.
 * <p>
 *   In some cases, the VComponent implementation may need to inspect the
 *   values of these global properties.  In addition, VComponents may need
 *   to respond by re-rendering themselves when a global property is
 *   modified on the custom element.  In such cases, VComponents can
 *   express interest in specific global properties via the
 *   <a href="#ObservedGlobalProps">ObservedGlobalProps</a>
 *   utility type.  This type allows specific global
 *   properties to be selected for observation via a type parameter.  This
 *   type is combined with the component's other properties as part of the
 *   property declaration.
 * </p>
 * <p>
 *   The following property declaration indicates that the component
 *   exposes "greeting" and "name" properties and also observes the global
 *   "id" and "tabIndex" props:
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps, ObservedGlobalProps } from 'ojs/ojvcomponent';
 *
 * type Props = {
 *   greeting?: string;
 *   name?: string;
 * } & ObservedGlobalProps&lt;'id' | 'tabIndex'&gt;
 * </code></pre>
 * <p>
 *   Any props that are specified via ObservedGlobalProps are automatically
 *   included in the custom element's observed attributes set.  As a
 *   result, any mutations to the one of these attributes on the custom
 *   element will automatically trigger a re-render of the VComponent with
 *   the new values. Note that event listener props are <i>not</i> eligible
 *   for inclusion in the observed attributes set.
 * </p>
 * <p>
 *   Global attributes referenced with the ObservedGlobalProps utility type do not appear in the
 *   VComponent's generated API Doc. If any observed global properties require context-specific
 *   documentation in the generated API Doc, then an alternate syntax is also supported:  simply include
 *   the global prop in the VComponent's Props definition, specifying as its declaration a GlobalProps
 *   indexed access type reference to the same global prop. Note that the following variation of the
 *   previous example is functionally equivalent:
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps, GlobalProps, ObservedGlobalProps } from 'ojs/ojvcomponent';
 *
 * type Props = {
 *   greeting?: string;
 *   name?: string;
 *
 *   /&#42;&#42;
 *    &#42; Specifies this custom element's focusable behavior during sequential keyboard navigation.
 *    &#42; A value of -1 indicates that this component is not reachable through keyboard navigation.
 *    &#42;/
 *   tabIndex?: GlobalProps['tabIndex'];  // include 'tabIndex' in the observed attribute set AND the API Doc
 *
 * } & ObservedGlobalProps&lt;'id'&gt;    // include 'id' in the observed attribute set
 * </code></pre>
 * <h3 id="root-element">
 *  Root Element
 *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#root-element"></a>
 * </h3>
 * <p>
 *   In all of the VComponents that we have seen so far, the root custom
 *   element is not included in the rendered output.  Instead, this element
 *   is implicitly injected into the DOM by the VComonent framework.
 * </p>
 * <p>
 *   In some rare cases, it may be necessary to have more control over how
 *   the the root element is rendered.
 * </p>
 * <p>
 *   For example, consider this case of a VComponent that renders a link:
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps, ObservedGlobalProps } from "ojs/ojvcomponent";
 * import { Component, ComponentChild } from "preact";
 *
 * type Props = {
 *   href?: string;
 * } & ObservedGlobalProps&lt;'tabIndex'&gt;;
 *
 * &#64;customElement("oj-demo-link")
 * export class OjDemoLink extends Component&lt;ExtendGlobalProps&lt;Props&gt;&gt; {
 *
 *   render(props: Props): ComponentChild {
 *     return &lt;a href={ props.href } tabIndex={ props.tabIndex }&gt;Hello, World&lt;/a&gt;;
 *   }
 * }
 * </code></pre>
 * <p>
 *   The intent is that the value of the global tabIndex attribute will be
 *   transferred from the root element down to the link.
 * </p>
 * <p>
 *   However, since the tabIndex value will be automatically rendered on
 *   the root custom element, we end up with the tabIndex on two elements:
 *   on the root &lt;oj-demo-link&gt; and on the &lt;a&gt;.
 * </p>
 * <p>
 *   To address this, we can update the render method to render both the
 *   link *and* the root custom element.  The VComponent API includes a
 *   simple component that acts as a placeholder for the root element,
 *   named "Root".  The <a href="#Root">Root</a> component is exported from the
 *   "ojs/ojvcomponent" module, so we add this in our import list:
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps, ObservedGlobalProps, Root } from "ojs/ojvcomponent";
 * </code></pre>
 * <p>
 *   And then we can include the Root component in the virtual DOM tree,
 *   adjusting exactly which properties are rendered:
 * </p>
 * <pre class="prettyprint"><code>  render(props: Props): ComponentChild {
 *     return (
 *       // Suppress the tabIndex on the root custom element since
 *       // we are transferring this to the link
 *       &lt;Root tabIndex={ -1 }&gt;
 *
 *         // Render the tabIndex here:
 *         &lt;a href={ props.href } tabIndex={ props.tabIndex }&gt;Hello, World&lt;/a&gt;
 *       &lt;/Root&gt;
 *     );
 *   }
 * </code></pre>
 * <p>
 *   The presence of the Root component impacts how global properties are
 *   managed.  When the Root component is omitted, all global properties,
 *   both observed and non-observed, are automatically passed through to the
 *   root custom element.  When the Root component is included at the root
 *   of the rendered virtual DOM tree, non-observed global properties are
 *   still passed through to the root custom element.  However only those
 *   observed global properties that are explicitly rendered on the Root
 *   component will be passed through.
 * </p>
 */

// TYPEDEFS

/**
 * <p>
 *  The Action type is used to identify properties as action callbacks.
 *  Actions are functions that the VComponent invokes when it wants to
 *  communicate some activity to the outside world.  When the VComponent
 *  is being consumed as a custom element, this results in an actual DOM
 *  <a href="https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent">
 *  CustomEvent</a> being dispatched.  Alternatively, when the VComponent is
 *  referenced via its Preact Component class, the provided callback is
 *  invoked directly and no CustomEvent is produced.
 * </<p>
 * <p>
 *  Actions have an optional detail type, specified by an optional generic
 *  type parameter to the Action type.  If the type parameter is supplied when the
 *  the action callback property is defined, then a detail value of that specified type
 *  is either passed to the consumer via the CustomEvent detail payload for the custom element case,
 *  or is directly passed as an argument of the callback function for the Preact component case.
 * </p>
 * <p>
 *  Note that Action properties must adhere to a specific naming
 *  convention: "on&lt;PascalCaseEventName&gt;".  For the custom element case,
 *  the type of the CustomEvent will be derived by converting the first
 *  character of the event name to lower case.  Thus, the
 *  "onGreetingComplete" property will generate a CustomEvent of type
 *  "greetingComplete".
 * </p>
 * <p>
 *  See <a href="#actions">Actions and Events</a> for more info.
 * </p>
 * @typedef {Function} Action
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [
 *   {target:"Type", value:"<Detail = {}>", for:"genericTypeParameters"},
 *   {target: "Type", value: "[keyof Detail] extends [never] ? (detail?: Detail) => void : (detail: Detail) => void"}
 * ]
 */

/**
 * <p>
 *  As discussed in <a href="#actions">Actions and Events</a>,  the custom
 *  events generated by Actions do not bubble by default.  The
 *  Bubbles marker type can be combined with the <a href="#Action">Action</a>
 *  type to indicate that the Action's custom events should bubble.
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *   // This action generates bubbling custom events
 *   onThisActionBubbles?: Action & Bubbles;
 *
 *   // This action generates non-bubbling custom events
 *   onThisActionDoesNotBubble?: Action;
 * }
 * </code></pre>
 * @typedef {Object} Bubbles
 * @ojexports
 * @memberof ojvcomponent
 */

/**
 * <p>
 *   Some JET Web Components support an asynchronous, event-based
 *   cancelation contract where prior to performing some operation, the
 *   component dispatches a "cancelable" event.  If the application cancels
 *   the event, the operation is not performed.  The
 *   <a href="oj.ojFilePicker.html">&lt;oj-file-picker&gt;</a>'s
 *   <a href="oj.ojFilePicker.html#event:beforeSelect">ojBeforeSelect</a>
 *   event is one example of such an API.
 * </p>
 * <p>
 *   The VComponent API has built-in support for this pattern via the
 *   CancelableAction type.  Like the plain old <a href="#Action">Action</a>
 *   type, CancelableAction is a function type that is used for defining
 *   callback-centric properties.  One key difference between these types
 *   is that CancelableAction returns a Promise.  If the Promise resolves
 *   successfully, the action is considered to be accepted.  If the Promise
 *   is rejected, the action is canceled.
 * </p>
 * <p>
 *   As with Action-typed properties, CancelableActions exhibit different
 *   behavior depending on whether the VComponent is being consumed as a
 *   custom element or via its Preact Component class.
 * </p>
 * <p>
 *   When consumed as a custom element, invoking a CancelableAction results
 *   in a CustomEvent being created and dispatched.  The detail payload of
 *   this custom event is augmented with one extra field: an "accept"
 *   method.  The accept method takes a single argument: the Promise that
 *   produces the cancelation result.
 * </p>
 * <p>
 *   When consumed via the Preact Component class, no custom event is
 *   dispatched.  Instead, the callback function returns the cancelation promise
 *   directly.
 * </p>
 * @typedef {Function} CancelableAction
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [
 *   {target:"Type", value:"<Detail extends object = {}>", for:"genericTypeParameters"},
 *   {target: "Type", value: "[keyof Detail] extends [never] ? (detail?: Detail) => Promise<void> : (detail: Detail) => Promise<void>"}
 * ]
 */

/**
 * <p>
 *   In most cases when a Web Component accepts slot content, the number
 *   and names of the slots are known, as these are defined by the
 *   component's public API.  However, in some cases components may allow
 *   an arbitrary number of slots to be specified, where the slot names are not
 *   known up front.  The &lt;oj-switcher&gt; component
 *   is an example of a component that accepts a dynamically defined
 *   (rather than predefined) set of slots.
 * </p>
 * <p>
 *   The VComponent API supports such cases via the DynamicSlots and
 *   <a href="#DynamicTemplateSlots">DynamicTemplateSlots</a> types.  A
 *   single property can be marked with the DynamicSlots type:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *
 *   // This property will be populated with all
 *   // "unknown" slots.
 *   items?: DynamicSlots;
 *
 *   // Other properties go here...
 * }
 * </code></pre>
 * <p>
 *   When the VComponent is consumed in custom element form, this property
 *   will be populated with entries for each "dynamic" slot.  That is,
 *   an entry will be added for each child element with a slot attribute that
 *   does not correspond to a known  Slot-typed property.
 *   The property acts as a map from slot name to <a href="#Slot">Slot</a>
 *   instance.  The VComponent can use whatever heuristic it prefers to
 *   decide which (if any) slots should be included in the rendered output.
 * </p>
 * @typedef {Object} DynamicSlots
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target: "Type", value: "Record<string, Slot>" }]
 */

/**
 * <p>
 *  The DynamicTemplateSlots type is a companion to
 *  <a href="#DynamicSlots">DynamicSlots</a> that is used in cases
 *  where the component accepts an arbitrary number of
 *  <a href="#template-slots">template slots</a>.  VComponents may declare a
 *  single property of type DynamicTemplateSlots.  When the component is used as
 *  a custom element, this property will be populated with one entry for each
 *  "dynamic" template slot, where the key is the slot name and the value is a
 *  corresponding <a href="#TemplateSlot">TemplateSlot</a> function.
 * </p>
 * <p>
 *  Different TemplateSlot functions may require different context objects as arguments,
 *  so DynamicTemplateSlots can accept a union type for its type parameter.  The
 *  DynamicTemplateSlots type definition is structured to ensure that each union sub-type
 *  gets mapped to a separate TemplateSlot function.
 * </p>
 * <p>
 *   Note that each VComponent can only contain a single dynamic slot property.
 *   That is, each VComponent can have one property of type DynamicSlots or
 *   one property of type DynamicTemplateSlots, but not both.
 * </p>
 * @typedef {Object} DynamicTemplateSlots
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target:"Type", value:"<Data>", for:"genericTypeParameters"},
 *               {target: "Type", value: "Record<string, (Data extends object ? TemplateSlot<Data> : never)>" }]
 */

/**
 * <p>
 *   By default, writeback property mutations can be driven either by the
 *   component, typically in response to some user interaction, or by the
 *   consumer of the component.  In some cases, writeback properties are
 *   exclusively mutated by the component itself.  Writeback properties
 *   that cannot be mutated by the consumer are known as
 *   <a href="CustomElementOverview.html#ce-properties-readonlywriteback-section">
 *   read-only writeback properties</a>.  The
 *   <a href="oj.ojInputText.html">&lt;oj-input-text&gt;</a>'s
 *   <a href="oj.ojInputText.html#rawValue">rawValue</a> property is an
 *   example of such a property.
 * </p>
 * <p>
 *   The ReadOnlyPropertyChanged type is used to identify callback properties that
 *   notify VComponent consumers of read-only writeback property mutations.
 *   Read-only writeback property callbacks must adhere to the naming convention of
 *   "on&lt;PropertyName&gt;Changed", where "PropertyName" is the name of the
 *   writeback property with the first character converted to upper case.
 * </p>
 * <p>
 *   Note that, unlike normal writeback properties that are declared by pairing
 *   a normal property declaration with a companion callback property, a read-only
 *   writeback property is declared solely by its callback property.
 * </p>
 * <p>
 *   Declarations for both forms of writeback properties can be seen below:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *
 *   // The following two fields establish a writeback property
 *   // named 'value'
 *   value?: string;
 *   onValueChanged?: PropertyChanged&lt;string&gt;
 *
 *   // The following field establishes a read-only writeback property
 *   // named 'rawValue'
 *   onRawValueChanged?: ReadOnlyPropertyChanged&lt;string&gt;
 * }
 * </code></pre>
 * @typedef {Object} ReadOnlyPropertyChanged
 * @ojexports
 * @memberof ojvcomponent
 */

/**
 * <p>
 *   By default, writeback property mutations can be driven either by the
 *   component, typically in response to some user interaction, or by the
 *   consumer of the component.  In some cases, writeback properties are
 *   exclusively mutated by the component itself.  Writeback properties
 *   that cannot be mutated by the consumer are known as
 *   <a href="CustomElementOverview.html#ce-properties-readonlywriteback-section">
 *   read-only writeback properties</a>.  The
 *   <a href="oj.ojInputText.html">&lt;oj-input-text&gt;</a>'s
 *   <a href="oj.ojInputText.html#rawValue">rawValue</a> property is an
 *   example of such a property.
 * </p>
 * <p>
 *   Read-only writeback properties are declared in a similar manner to
 *   <a href="#writeback">plain old writeback properties</a>, with one important
 *   difference: the ElementReadOnly utility type is used as a marker to
 *   identify the that the property is read-only.
 * </p>
 * <p>
 *   Declarations for both forms of writeback properties can be seen below:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *
 *   // This is a normal writeback property:
 *   value?: string;
 *   onValueChanged?: PropertyChanged&lt;string&gt;
 *
 *   // This is a read-only writeback property:
 *   rawValue?: ElementReadOnly&lt;string&gt;;
 *   onRawValueChanged?: PropertyChanged&lt;string&gt;
 * }
 * </code></pre>
 * @typedef {Object} ElementReadOnly
 * @ojexports
 * @memberof ojvcomponent
 * @ojdeprecated {since: '12.0.0', description: 'Use the ReadOnlyPropertyChanged type instead.'}
 * @ojsignature [{target:"Type", value:"<T>", for:"genericTypeParameters"},
 *               {target: "Type", value: "T"}]
 */

/**
 * <p>
 *   As discussed in the <a href="#properties">Properties</a> section,
 *   all VComponents must minimally include the
 *   <a href="#GlobalProps">GlobalProps</a> in their property types.
 *   ExtendGlobalProps is a convenience type for combining component-specific
 *   properties with GlobalProps, e.g.:
 * </p>
 * <pre class="prettyprint"><code>import { customElement, ExtendGlobalProps } from 'ojs/ojvcomponent';
 *
 * // These are the component-specific props:
 * type Props = {
 *   greeting?: string;
 *   name?: string;
 * }
 *
 * // Below we merge the component props with the
 * // global props using ExtendGlobalProps
 * &#64;customElement('oj-hello-world-with-props')
 * export class HelloWorld extends Component&lt;ExtendGlobalProps&lt;Props&gt;&gt; {
 * </code></pre>
 * @typedef {Object} ExtendGlobalProps
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target:"Type", value:"<Props>", for:"genericTypeParameters"},
 *               {target: "Type", value: "Readonly<Props> & GlobalProps"}]
 */

/**
 * <p>
 *   The GlobalProps type defines the set of global properties that are
 *   supported by all VComponents.  This includes three categories of
 *   properties:
 * </p>
 * <ol>
 *   <li><a href="https://html.spec.whatwg.org/#global-attributes">
 *   Global HTML attributes</a></li>
 *   <li><a href="https://www.w3.org/TR/wai-aria-1.1/#state_prop_def">ARIA
 *     attributes</a></li>
 *   <li><a href="https://html.spec.whatwg.org/#event-handlers-on-elements,-document-objects,-and-window-objects">
 *     Global event listeners</a></li>
 * </ol>
 * <p>
 *   The following properties are included from category 1:
 * </p>
 * <ul>
 *   <li>accessKey</li>
 *   <li>autocapitalize</li>
 *   <li>autofocus</li>
 *   <li>class</li>
 *   <li>contentEditable</li>
 *   <li>dir</li>
 *   <li>draggable</li>
 *   <li>enterKeyHint</li>
 *   <li>hidden</li>
 *   <li>id</li>
 *   <li>inputMode</li>
 *   <li>lang</li>
 *   <li>role</li>
 *   <li>slot</li>
 *   <li>spellcheck</li>
 *   <li>style</li>
 *   <li>tabIndex</li>
 *   <li>title</li>
 *   <li>translate</li>
 * </ul>
 * <p>
 *   The following ARIA-specific attributes are included from category 2:
 * </p>
 * <ul>
 *   <li>aria-activedescendant</li>
 *   <li>aria-atomic</li>
 *   <li>aria-autocomplete</li>
 *   <li>aria-busy</li>
 *   <li>aria-checked</li>
 *   <li>aria-colcount</li>
 *   <li>aria-colindex</li>
 *   <li>aria-colspan</li>
 *   <li>aria-controls</li>
 *   <li>aria-current</li>
 *   <li>aria-describedby</li>
 *   <li>aria-details</li>
 *   <li>aria-disabled</li>
 *   <li>aria-errormessage</li>
 *   <li>aria-expanded</li>
 *   <li>aria-flowto</li>
 *   <li>aria-haspopup</li>
 *   <li>aria-hidden</li>
 *   <li>aria-invalid</li>
 *   <li>aria-keyshortcuts</li>
 *   <li>aria-label</li>
 *   <li>aria-labelledby</li>
 *   <li>aria-level</li>
 *   <li>aria-live</li>
 *   <li>aria-modal</li>
 *   <li>aria-multiline</li>
 *   <li>aria-multiselectable</li>
 *   <li>aria-orientation</li>
 *   <li>aria-owns</li>
 *   <li>aria-placeholder</li>
 *   <li>aria-posinset</li>
 *   <li>aria-pressed</li>
 *   <li>aria-readonly</li>
 *   <li>aria-relevant</li>
 *   <li>aria-required</li>
 *   <li>aria-roledescription</li>
 *   <li>aria-rowcount</li>
 *   <li>aria-rowindex</li>
 *   <li>aria-rowspan</li>
 *   <li>aria-selected</li>
 *   <li>aria-setsize</li>
 *   <li>aria-sort</li>
 *   <li>aria-valuemax</li>
 *   <li>aria-valuemin</li>
 *   <li>aria-valuenow</li>
 *   <li>aria-valuetext</li>
 * </ul>
 * <p>
 *   The following event listener properties are included
 *   from category 3:
 * </p>
 * <ul>
 *   <li>onBlur</li>
 *   <li>onClick</li>
 *   <li>onContextMenu</li>
 *   <li>onDblClick</li>
 *   <li>onDrag</li>
 *   <li>onDragEnd</li>
 *   <li>onDragEnter</li>
 *   <li>onDragExit</li>
 *   <li>onDragLeave</li>
 *   <li>onDragOver</li>
 *   <li>onDragStart</li>
 *   <li>onDrop</li>
 *   <li>onFocus</li>
 *   <li>onKeyDown</li>
 *   <li>onKeyPress</li>
 *   <li>onKeyUp</li>
 *   <li>onMouseDown</li>
 *   <li>onMouseEnter</li>
 *   <li>onMouseLeave</li>
 *   <li>onMouseMove</li>
 *   <li>onMouseOut</li>
 *   <li>onMouseOver</li>
 *   <li>onMouseUp</li>
 *   <li>onPointerOver</li>
 *   <li>onPointerEnter</li>
 *   <li>onPointerDown</li>
 *   <li>onPointerMove</li>
 *   <li>onPointerUp</li>
 *   <li>onPointerCancel</li>
 *   <li>onPointerOut</li>
 *   <li>onPointerLeave</li>
 *   <li>onTouchCancel</li>
 *   <li>onTouchEnd</li>
 *   <li>onTouchMove</li>
 *   <li>onTouchStart</li>
 *   <li>onWheel</li>
 *   <li>onfocusin</li>
 *   <li>onfocusout</li>
 * </ul>
 * <p>
 *   The above event listener properties can also be specified with
 *   the "Capture" suffix (e.g., "onClickCapture") to indicate that the
 *   listener should be registered as a capture listener.
 * </p>
 * @typedef {Object} GlobalProps
 * @ojexports
 * @memberof ojvcomponent
 */

/**
 * <p>
 *   The ObservedGlobalProps type is used to identify the subset of
 *   <a href="#GlobalProps">GlobalProps</a> that the VComponent implementation
 *   needs to observe.  When a VComponent is used as a custom element,
 *   ObservedGlobalProps determines which of the GlobalProps values will be
 *   extracted from the DOM and passed into the VComponent.  Properties
 *   that are selected using ObservedGlobalProps are also included in
 *   the custom element's observedAttributes list.  As a result, updates to
 *   observed global properties will trigger the VComponent to render
 *   with the new values.
 * </p>
 * <p>
 *   The ObservedGlobalProps type acts as a Pick type, where properties are
 *   implicitly picked from GlobalProps.  The resulting type is typically
 *   merged with any component-specific properties via a union.
 * </p>
 * <p>
 *   See the <a href="#observed">Observed Global Properties</a> section for
 *   more details.
 * </p>
 * @typedef {Object} ObservedGlobalProps
 * @ojexports
 * @memberof ojvcomponent
 */

/**
 * <p>
 *   The PropertyBindings type maps function-based VComponent property names to their corresponding
 *   <a href="MetadataTypes.html#PropertyBinding">PropertyBinding</a> metadata.
 * </p>
 * @typedef {Object} PropertyBindings
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target:"Type", value:"<P>", for:"genericTypeParameters"},
 *               {target: "Type", value: "Partial<Record<keyof P, MetadataTypes.PropertyBinding>>"}]
 */

/**
 * <p>
 *   The PropertyChanged type is used to identify callback properties that
 *   notify VComponent consumers of writeback property mutations.
 *   Writeback property callbacks must adhere to the naming convention of
 *   "on&lt;PropertyName&gt;Changed", where "PropertyName" is the name of the
 *   writeback property with the first character converted to upper case:
 * </p>
 * <pre class="prettyprint"><code>type Props = {
 *   // This is a writeback property
 *   value?: string;
 *
 *   // This is the corresponding property changed callback
 *   onValueChanged?: PropertyChanged&lt;string&gt;;
 * }
 * </code></pre>
 * <p>
 *   See the <a href="#writeback">Writeback Properties</a> section for
 *   more details.
 * </p>
 * @typedef {Object} PropertyChanged
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target:"Type", value:"<T>", for:"genericTypeParameters"},
 *               {target: "Type", value: "(value: T) => void"}]
 */

/**
 * <p>
 *   The Slot type identifies properties as representing named slot
 *   children.  This type is an alias for Preact's ComponentChildren type.  As
 *   such, the value of a slot property can either be embedded directly in
 *   a virtual DOM tree or can be passed to Preact's
 *   <a href="https://preactjs.com/guide/v10/api-reference/#tochildarray">
 *   toChildArray</a>.
 * </p>
 * <p>
 *   See <a href="#children">Children and Slots</a> for more details.
 * </p>
 * @typedef {Function} Slot
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target: "Type", value: "ComponentChildren"}]
 */

/**
 * <p>
 *   As discussed in <a href="#children">Children and Slots</a>, JET application developers
 *   may require a mechanism for waiting at runtime until all of a slot's component contents
 *   have been created and initialized before programmatically interacting with the contents.
 *   VComponent developers can request that a <a href="oj.BusyContext.html">BusyContext</a> instance,
 *   scoped to a VComponent's children or to a particular named slot's contents, be created
 *   at runtime by using the ImplicitBusyContext marker type. This marker type can be combined
 *   with Preact's ComponentChildren type or with the <a href="#Slot">Slot</a> type as needed:
 * </p>
 * <pre class="prettyprint"><code>import { Component, ComponentChildren } from 'preact';
 * import { customElement, ExtendGlobalProps, ImplicitBusyContext, Slot } from 'ojs/ojvcomponent';
 *
 * type Props = {
 *   // This indicates that the VComponent accepts arbitrary (non-slot) children,
 *   // and that a BusyContext scoped to this child content should be created at runtime
 *   children?: ComponentChildren & ImplicitBusyContext;
 *
 *   // This indicates that the VComponent accepts a slot named "end",
 *   // and that a BusyContext scoped to the slot's content should be created at runtime
 *   end?: Slot & ImplicitBusyContext;
 * }
 * </code></pre>
 * @typedef {unknown} ImplicitBusyContext
 * @ojexports
 * @memberof ojvcomponent
 */

/**
 * <p>
 *  The Methods type specifies optional design-time method metadata that can be passed in the
 *  <code>options</code> argument when calling <a href=#registerCustomElement>registerCustomElement</a>
 *  to register a function-based VComponent that exposes custom element methods.
 * </p>
 * <p>
 *  The Methods type makes several adjustments to the
 *  <a href=MetadataTypes.html#ComponentMetadataMethods>MetadataTypes.ComponentMetadataMethods</a> type:
 *  <ul>
 *   <li>
 *    The <code>internalName</code> property does not apply to VComponents.
 *   </li>
 *   <li>
 *    The return type and parameter types are explicitly omitted from
 *    <a href=MetadataTypes.html#ComponentMetadataMethods>MetadataTypes.ComponentMetadataMethods</a> and
 *    <a href=MetadataTypes.html#MethodParam>MetadataTypes.MethodParam</a> respectively, as these should
 *    come from the function signatures passed as a type parameter to the
 *    <a href=#registerCustomElement>registerCustomElement</a> call.
 *   </li>
 *   <li>
 *    Optional <code>apidocDescription</code> and <code>apidocRtnDescription</code> properties are added
 *    to specify markup text for inclusion in the generated API Doc describing the method and its return
 *    value, respectively. If <code>apidocDescription</code> is unspecified, then the
 *    <code>description</code> property is used in the API Doc.
 *   </li>
 *  </ul>
 * </p>
 * @typedef {Object} Methods
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [
 *   {target:"Type", value:"<M>", for:"genericTypeParameters"},
 *   {target:"Type", value: "{Partial<Record<keyof M, Omit<MetadataTypes.ComponentMetadataMethods, 'internalName' | 'params' | 'return'> & { params?: Array<Omit<MetadataTypes.MethodParam, 'type'>>; apidocDescription?: string; apidocRtnDescription?: string; }>>}"}
 * ]
 * @ojdeprecated {since: "16.0.0", description: "Use doclet metadata within the type alias that maps method names to function signatures instead."}
 */

/**
 * <p>
 *  The Contexts type allows a function-based VComponent to specify a list of Preact Contexts
 *  whose values should be made available to the inner virtual dom tree of the VComponent when
 *  rendered as an intrinsic element.  This allows the inner virtual dom tree to have access to
 *  the Context values from the parent component when rendered either directly as part of the parent
 *  component's virtual dom tree or when rendered as template slot content in a parent VComponent.  Note
 *  that any intrinsic elements within the inner virtual dom tree must also specify a list of Contexts
 *  to further propagate their values.
 * </p>
 * @typedef {Object} Contexts
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [
 *   {target:"Type", value: "$$${ consume?: Array<Context<any>> }"}
 * ]
 */

/**
 * <p>
 *   The Options type specifies additional options that can be passed when calling
 *   <a href=#registerCustomElement>registerCustomElement</a> to register a function-based
 *   VComponent with the JET framework.
 * </p>
 * <p>
 *   These additional options come into play under certain circumstances:
 *   <ul>
 *    <li>
 *      Optional <code>bindings</code> metadata (see <a href="#PropertyBindings">PropertyBindings</a>
 *      for further details) are only honored when the VComponent custom element is used in a Knockout
 *      binding environment.
 *    </li>
 *    <li>
 *      Optional <code>contexts</code> metadata (see <a href="#Contexts">Contexts</a>
 *      for further details) are only honored when the VComponent is rendered as an intrinsic element
 *      in a virtual dom tree.
 *    </li>
 *   </ul>
 * </p>
 * <p>
 *   In the following example:
 *    <ul>
 *      <li>
 *        <code>FormFunctionalComponent</code> is a VComponent implementing a form that consumes
 *        'labelEdge' and 'readonly' properties from its parent container. It also provides values
 *        for 'labelEdge' and 'readonly' properties to its children with any necessary transformations.
 *      </li>
 *      <li>
 *        The implementation includes an input element, and the parent function-based VComponent exposes
 *        a public <code>focusInitialInput</code> method to set the focus on this element as needed.
 *      </li>
 *    </ul>
 * </p>
 * <pre class="prettyprint"><code>
 * import { h, Ref } from 'preact';
 * import { useImperativeHandle, useRef } from 'preact/hooks';
 * import { forwardRef } from 'preact/compat';
 * import { registerCustomElement } from 'ojs/ojvcomponent';
 *
 * type Props = Readonly<{
 *   labelEdge?: 'inside' | 'start' | 'top';
 *   readonly?: boolean;
 * }>;
 *
 * type FormHandle = {
 *   // The doclet description appears in the generated API Doc, whereas the
 *   // @ojmetadata description appears in the generated component.json file.
 *   /&#42;&#42;
 *    * Sets the focus on the initial &lt;code&gt;FormInput&lt;/code&gt; control in this form.
 *    * @ojmetadata description 'Sets the focus on this form.'
 *    *&#47;
 *   focusInitialInput: () => void;
 * };
 *
 * export const FormFunctionalComponent =
 *   registerCustomElement&lt;Props, FormHandle&gt;(
 *     'my-form-functional-component',
 *     forwardRef(
 *       ({ labelEdge = 'inside', readonly = false }: Props, ref: Ref&lt;FormHandle&gt;) => {
 *         const formInputRef = useRef&lt;HTMLInputElement&gt;(null);
 *
 *         useImperativeHandle(ref, () => ({
 *           focusInitialInput: () => formInputRef.current?.focus()
 *         }));
 *
 *         return (
 *           &lt;input
 *             ref={formInputRef}
 *             readOnly={readonly}
 *             ...
 *           /&gt;
 *           ...
 *         );
 *       }
 *     ),
 *     {
 *       bindings: {
 *         // Indicate that the component's 'labelEdge' property will consume
 *         // the 'containerLabelEdge' variable provided by its parent, as well as
 *         // provide the 'labelEdge' property value under different keys and with
 *         // different transforms as required for different consumers.
 *         labelEdge: {
 *           consume: { name: 'containerLabelEdge' },
 *           provide: [
 *             { name: 'containerLabelEdge', default: 'inside' },
 *             { name: 'labelEdge', default: 'inside', transform: { top: 'provided', start: 'provided' } }
 *           ]
 *         },
 *         // Indicate that the component's 'readonly' property will consume
 *         // the 'containerReadonly' variable provided by its parent, as well as
 *         // provide the 'readonly' property value under different keys for different
 *         // consumers.
 *         readonly: {
 *           consume: { name: 'containerReadonly' },
 *           provide: [
 *             { name: 'containerReadonly' },
 *             { name: 'readonly' }
 *           ]
 *         }
 *       }
 *     }
 *   );
 * </code>
 * </pre>
 * @ojtypedef ojvcomponent.Options
 * @ojsignature {target:"Type", value:"<P, M extends Record<string, (...args) => any> = {}>", for:"genericTypeParameters"}
 */
/**
 * @expose
 * @name bindings
 * @ojtypedefmember
 * @memberof! ojvcomponent.Options
 * @type {object=}
 * @ojsignature {target:"Type", value:"PropertyBindings<P>", jsdocOverride: true}
 */
/**
 * @expose
 * @name contexts
 * @ojtypedefmember
 * @memberof! ojvcomponent.Options
 * @type {object=}
 * @ojsignature {target:"Type", value:"Contexts", jsdocOverride: true}
 */
/**
 * @expose
 * @name methods
 * @ojtypedefmember
 * @memberof! ojvcomponent.Options
 * @type {object=}
 * @ojsignature {target:"Type", value:"Methods<M>", jsdocOverride: true}
 * @ojdeprecated {since: "16.0.0", description: "Use doclet metadata within the type alias that maps method names to function signatures instead."}
 */

/**
 * <p>
 *   The TemplateSlot type identifies properties as representing named
 *   template slot children.  Unlike the <a href="#Slot">Slot</a> type,
 *   TemplateSlot is a functional type that takes some context and returns
 *   the slot children.
 * </p>
 * <p>
 *   See the <a href="#template-slots">Template Slots</a> section for more details.
 * </p>
 * @typedef {Function} TemplateSlot
 * @ojexports
 * @memberof ojvcomponent
 * @ojsignature [{target:"Type", value:"<Data extends object>", for:"genericTypeParameters"},
 *               {target: "Type", value: "(data: Data) => Slot"}]
 */

// STATIC METHODS

/**
 * <p>
 *   For the most part, VComponents should not need to render ids on child
 *   content.  However, in some cases this may be necessary.  For example,
 *   in order to set up a relationship between a label and the element that
 *   the label references, the label and labeled content must rendezvous on
 *   a common id.  Specifying fixed ids is problematic as this can
 *   lead to conflicts with other ids on the page.  The getUniqueId()
 *   method helps solve this problem by creating producing an id that is
 *   guaranteed not to conflict with ids rendered by other components.
 * </p>
 * <p>
 *   The id returned by getUniqueId() is typically used to provide a prefix
 *   (or suffix) for what would otherwise be a static id for some element
 *   rendered by the VComponent.
 * </p>
 * <p>
 *   The usage model is:
 * </p>
 * <ol>
 *   <li>
 *   In the VComponent's constructor, check to see whether the
 *   VComponent already has a props.id value.  If so, this can be used as a
 *   prefix for other ids and calling getUniqueId() is unnecessary.
 *   </li>
 *   <li>
 *   Otherwise, call getUniqueId() to retrieve the unique prefix for
 *   this component
 *   </li>
 *   <li>
 *   Store the result of the #1/#2 in an instance variable for later
 *   use.
 *   </li>
 *   <li>
 *   When rendering, use the previously stored prefix to generate
 *   unique ids for any elements that need them.
 *   </li>
 *   <li>
 *   Don't forget to include "id" in the list of
 *   <a href="#ObservedGlobalProps">ObservedGlobalProps</a> in
 *   order to ensure that the VComponent receives the value of this global
 *   HTML attribute.
 *   </li>
 * </ol>
 * <p>
 *   Putting this all together, we end up with a component like this:
 * </p>
 * <pre class="prettyprint"><code>import { Component, ComponentChild } from 'preact';
 * import { customElement, ExtendGlobalProps, ObservedGlobalProps, getUniqueId } from 'ojs/ojvcomponent';
 * import "ojs/ojinputtext";
 * import "ojs/ojlabel";
 *
 * export type Props = ObservedGlobalProps&lt;'id'&gt;;
 *
 * &#64;customElement('oj-demo-unique-id')
 * export class DemoUniqueId extends Component&lt;ExtendGlobalProps&lt;Props&gt;&gt; {
 *
 *   private uniquePrefix: string;
 *
 *   constructor(props: Readonly&lt;Props&gt;) {
 *     super(props)
 *
 *     this.uniquePrefix = props.id ?? getUniqueId();
 *   }
 *
 *   render(): ComponentChild {
 *
 *     const inputTextId = `${this.uniquePrefix}_input`;
 *
 *     return (
 *       &lt;div&gt;
 *         &lt;oj-label for={ inputTextId }&gt;Label&lt;/oj-label&gt;
 *         &lt;oj-input-text id={ inputTextId } value="Value"/&gt;
 *       &lt;/div&gt;
 *     );
 *   }
 * }
 * </code></pre>
 *
 * @function getUniqueId
 * @return {string}
 *
 * @memberof ojvcomponent
 * @expose
 * @ojexports
 */

/**
 * <p>
 *   Class-based VComponents use the <a href="#customElement">&#64;customElement</a> decorator
 *   to specify the VComponent's custom element tag name (also known as its full name) and to register
 *   the custom element with the JET framework.  However, function-based VComponents cannot utilize this
 *   approach because decorators are only supported for classes and their constituent fields.
 * </p>
 * <p>
 *   JET provides an alternate mechanism for registering a function-based VComponent and specifying its
 *   custom element tag name. The registerCustomElement method accepts three arguments:  the custom element
 *   tag name to be associated with the VComponent, a reference to the Preact functional component that
 *   supplies the VComponent implementation, and a reference to additional options that can be specified
 *   when registering the function-based VComponent (see <a href="#Options">Options</a>
 *   for futher details).  It returns a higher-order VComponent that is registered with the
 *   framework using the specified custom element tag name.
 * </p>
 * <p>
 *   Here is a simple example:
 * </p>
 * <pre class="prettyprint"><code>
 * import { registerCustomElement } from 'ojs/ojvcomponent';
 *
 * export type Props = Readonly<{
 *   message?: string;
 * }>;
 *
 * export const DemoFunctionBasedVComp = registerCustomElement(
 *   'oj-demo-based-vcomp',
 *   ({ message='This is a function-based VComponent!' }: Props) => {
 *     return &lt;div&gt;{message}&lt;/div&gt;;
 *   }
 * );
 * </code></pre>
 * <p>
 *   There are some other considerations to keep in mind when implementing function-based VComponents:
 *   <ul>
 *    <li>Function-based VComponents can use an anonymous function to implement their Preact
 *        functional component, and expose the returned higher-order VComponent as their public API.</li>
 *    <li>The registration call ensures that the returned higher-order VComponent extends the Preact functional
 *        component's custom properties with the required global HTML attributes defined by <a href="#GlobalProps">GlobalProps</a>.</li>
 *    <li>Default custom property values are specified using destructuring assignment syntax in the function implementation.</li>
 *    <li>TypeScript can typically infer the type parameters to the <code>registerCustomElement</code> call without having
 *        to explicitly specify them in your code. However, if the function-based VComponent exposes public methods then
 *        the second <code>M</code> type parameter (which maps public method names to their function signatures)
 *        <i>must</i> be provided. In addition:
 *
 *        <ol>
 *          <li>the Preact functional component that implements VComponent must be wrapped inline with a
 *            <a href="https://preactjs.com/guide/v10/switching-to-preact/#forwardref">forwardRef</a> call, and</li>
 *          <li>the <code>useImperativeHandle</code> hook must be used within the Preact implementation.</li>
 *        </ol>
 *
 *        See the <a href="#Options">Options</a> type for a detailed example.</li>
 *  </ul>
 * </p>
 *
 * @function registerCustomElement
 * @param {string} tagName The custom element tag name for the registered function-based VComponent.
 * @param {function} functionalComponent The Preact functional component that supplies the VComponent implementation.
 * @param {Options<P, M>=} options Additional options for the function-based VComponent.
 * @returns {VComponent} Higher-order VComponent that wraps the Preact functional component.
 * @ojsignature [{target:"Type", value:"<P, M extends Record<string, (...args) => any> = {}>", for:"genericTypeParameters"}]
 *
 * @memberof ojvcomponent
 * @expose
 * @ojexports
 */

/**
 * <p>
 *   Root is a Preact component that can be used to wrap the
 *   VComponent's child content.  This component should only be used
 *   for cases where the VComponent needs to control how
 *   <a href="#observed">observed global properties</a> are rendered on
 *   the component's root custom element.  In all other cases the
 *   non-wrapped child content should be returned directly.
 * </p>
 * <p>
 *   See the <a href="#root-element">Root Element</a> section for more details.
 * </p>
 *
 * @function Root
 *
 * @memberof ojvcomponent
 * @expose
 * @ojexports
 */

class ValueBasedElement {
    constructor() {
        this.appendChildHelper = (element, newNode) => HTMLElement.prototype.appendChild.call(element, newNode);
        this.insertBeforeHelper = (element, newNode, refNode) => HTMLElement.prototype.insertBefore.call(element, newNode, refNode);
    }
    connectedCallback() { }
    disconnectedCallback() { }
    attributeChangedCallback(name, oldValue, newValue) { }
    getProperty(name) {
        return undefined;
    }
    setProperty(name, value) { }
    setProperties(properties) { }
}
const valueBasedElement = new ValueBasedElement();

class HTMLJetElement extends HTMLElement {
    static get observedAttributes() {
        let observed = [];
        if (this.metadata.properties) {
            observed = observed.concat(getFlattenedAttributes(this.metadata.properties));
        }
        if (this.rootObservedAttributes) {
            observed = observed.concat(this.rootObservedAttributes);
        }
        return observed;
    }
    connectedCallback() {
        this._getHelper().connectedCallback();
    }
    disconnectedCallback() {
        this._helper?.disconnectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // The _getHelper call will instantiate either a class that either no-ops for DOM calls
        // or suppors the custom element first case. We decide which class to instantiate by checking
        // the DOM for an attribute flag which if we call it at the first attributeChangedCallback call,
        // may not yet be in the DOM since this callback is called for all element attributes when it's first
        // instantiated. To prevent instantiating the wrong helper class and since we don't need to handle
        // the initial DOM attribute sets, we check if helper is already instantiated first by either the connected
        // or setProperty calls.
        this._helper?.attributeChangedCallback(name, oldValue, newValue);
    }
    getProperty(name) {
        return this._getHelper().getProperty(name);
    }
    setProperty(name, value) {
        this._getHelper().setProperty(name, value);
    }
    setProperties(properties) {
        this._getHelper().setProperties(properties);
    }
    appendChild(newNode) {
        return this._getHelper().appendChildHelper(this, newNode);
    }
    insertBefore(newNode, refNode) {
        return this._getHelper().insertBeforeHelper(this, newNode, refNode);
    }
    // Override set/removeAttribute to only allow toggling of classes applied by application/parent component
    // This is necessary to work with Preact's class patching logic
    setAttribute(qualifiedName, value) {
        if (qualifiedName === 'class') {
            const outerClasses = CustomElementUtils.getClassSet(value);
            CustomElementUtils.getElementState(this).setOuterClasses(outerClasses);
        }
        else {
            HTMLElement.prototype.setAttribute.call(this, qualifiedName, value);
        }
    }
    removeAttribute(qualifiedName) {
        if (qualifiedName === 'class') {
            this.setAttribute('class', '');
        }
        else {
            HTMLElement.prototype.removeAttribute.call(this, qualifiedName);
        }
    }
    _getHelper() {
        // Decide which helper to instantiate after the first connected
        // callback
        if (!this._helper) {
            if (this.hasAttribute('data-oj-jsx')) {
                this.removeAttribute('data-oj-jsx');
                // We won't go through the complete component cycle so just add oj-complete here
                this.classList.add('oj-complete');
                this._helper = valueBasedElement;
            }
            else {
                this._helper = new IntrinsicElement(this, this.constructor['component'], this.constructor['metadata'], this.constructor['rootObservedAttributes'], this.constructor['rootObservedProperties'], this.constructor['defaultProps']);
            }
        }
        return this._helper;
    }
}
const getDescriptiveTransferAttributeValue = (element, attrName) => {
    const elementVal = element.getAttribute(attrName);
    if (elementVal) {
        return elementVal;
    }
    // cast as any to access private _getHelper metod
    const helper = element._getHelper();
    const vprops = helper.getProps?.() || {};
    return vprops[attrName];
};
const isInitialized = (element) => {
    // cast as any to access private _getHelper metod
    const helper = element._getHelper();
    return !!helper.isInitialized?.();
};

const RootContext = createContext(null);
function isGlobalProperty(prop, metadata) {
    return (prop === 'className' ||
        AttributeUtils.isGlobalOrData(prop) ||
        isGlobalEventListenerProperty(prop, metadata));
}
// Although an expression with negative lookbehind like /^on([A-Za-z])([A-Za-z]*)(?<!Changed)$/
// would be cleaner, we have to use negative lookahead because negative lookbehind is
// not yet supported by Safari
const _GLOBAL_EVENT_MATCH_EXP = /^on(?!.*Changed$)([A-Za-z])([A-Za-z]*)$/;
function isGlobalEventListenerProperty(prop, metadata) {
    // A VComponent could have a non-event listener component property that
    // matches our regular expression below (eg. "once" or "only"). To avoid
    // treating these like global event listeners, we first check to see whether the
    // prop corresponds to a component property.
    if (metadata?.properties?.[prop]) {
        return false;
    }
    // Any property name starting with "on" followed by at least one character
    // and not ending with 'Changed' will be considered a global event property
    // unless the event type matches component's action callback property
    const match = prop.match(_GLOBAL_EVENT_MATCH_EXP);
    if (match) {
        const eventType = match[1].toLowerCase() + match[2];
        return !metadata?.events?.[eventType];
    }
    return false;
}

/*
 * This component is used when the VComponent is not taking any responsibility for managing the Root element
 */
const InternalRoot = ({ children }) => {
    const { tagName, metadata, isElementFirst, vcompProps, elemRefObj } = useContext(RootContext);
    if (isElementFirst) {
        // When the component chooses not to render the root node in custom-element-first scenario,
        // we will be rendering implementation VDOM into the custom element 'as is'. No reconciliation
        // of custom element propewrties will occur.
        return children;
    }
    // For VComponent first, the framework is responsible for making sure global
    // attributes are rendered on the root vnode
    const refFunc = function (ref) {
        // Create a ref callback so that we can store the properties object onto
        // the element. Needed for WebElement property retrieval
        if (ref) {
            ref[CustomElementUtils.VCOMP_INSTANCE] = {
                props: vcompProps
            };
        }
        elemRefObj.current = ref; // Used by BusyContextProvider
    };
    // We don't have a reference to the element so we need to render something onto the DOM
    // to let the custom element logic know not to instantiate the vcomponent and to act as a
    // shell where most APIs are no-ops
    const globalPropKeys = Object.keys(vcompProps).filter((prop) => isGlobalProperty(prop, metadata));
    const globalProps = globalPropKeys.reduce((acc, cur) => {
        acc[cur] = vcompProps[cur];
        return acc;
    }, {});
    // We want to prevent creation of unnecessary EnvironmentWrapper component around element
    // represented by the tagName. In order to do so let's render into a 'div' and change the type
    // after that.
    const elem = (jsx("div", { ref: refFunc, "data-oj-jsx": "", ...globalProps, children: children }));
    elem.type = tagName;
    return elem;
};

const _CLASS = 'class';
const Root = forwardRef((props, ref) => {
    const { tagName, metadata, isElementFirst, vcompProps, observedPropsSet, elemRefObj } = useContext(RootContext);
    if (isElementFirst) {
        // Invoke root VNode's patch implementation passed by the IntrinsicElement
        // This will ensure that root element refs are set before the componentDidMount() callback
        // is invoked
        const artificialRoot = jsx("div", { ...props, ref: ref });
        artificialRoot.type = tagName;
        vcompProps[ROOT_VNODE_PATCH](artificialRoot);
        return jsx(Fragment, { children: props.children });
    }
    const propFixups = {};
    // Merge style values with those in the DOM.
    if (vcompProps.style && props['style']) {
        propFixups['style'] = Object.assign({}, vcompProps.style, props['style']);
    }
    const componentClass = vcompProps[_CLASS];
    if (componentClass) {
        const nodeClass = props[_CLASS] || '';
        propFixups[_CLASS] = `${componentClass} ${nodeClass}`;
    }
    // Merge back global attributes not overidden by component
    // to root vnode since the component won't render these, but
    // they are set by parent and should show up in the DOM.
    const parentGlobalKeys = Object.keys(vcompProps).filter((prop) => !(prop in props) && !observedPropsSet.has(prop) && isGlobalProperty(prop, metadata));
    const parentGlobals = parentGlobalKeys.reduce((acc, cur) => {
        acc[cur] = vcompProps[cur];
        return acc;
    }, {});
    // Create a ref callback so that we can store the properties object onto
    // the element. Needed for WebElement property retrieval.
    const refFunc = (el) => {
        let cleanupFunc;
        if (ref) {
            cleanupFunc = applyRef(ref, el);
        }
        if (el) {
            el[CustomElementUtils.VCOMP_INSTANCE] = {
                props: vcompProps
            };
        }
        elemRefObj.current = el; // Used by BusyContextProvider
        return cleanupFunc;
    };
    const elem = jsx("div", { ...props, ...propFixups, ...parentGlobals, ref: refFunc, "data-oj-jsx": "" });
    elem.type = tagName;
    return elem;
});

/**
 * @ignore
 */
class VComponentState extends LifecycleElementState {
    constructor(element) {
        super(element);
        this._translationBundleMap = {};
    }
    /**
     * Gets translation bundle map
     */
    getTranslationBundleMap() {
        return this._translationBundleMap;
    }
    /**
     * @override
     */
    getTemplateEngine() {
        return VComponentState._cachedTemplateEngine;
    }
    /**
     * @override
     */
    getTrackChildrenOption() {
        return 'immediate';
    }
    /**
     * @override
     */
    allowPropertyChangedEvents() {
        return super.allowPropertyChangedEvents() && isInitialized(this.Element);
    }
    /**
     * @override
     */
    allowPropertySets() {
        return this._allowPropertySets || super.allowPropertySets();
    }
    /**
     * @override
     */
    resetCreationCycle() {
        this._allowPropertySets = super.allowPropertySets();
        super.resetCreationCycle();
    }
    /**
     * Dispose cached entries that might be stored on a template slot
     */
    disposeTemplateCache() {
        const slotMap = this.getSlotMap();
        const slots = Object.keys(slotMap);
        const metadata = getElementDescriptor(this.Element.tagName).metadata;
        // dynamicSlot is an object of form { prop: [propName], isTemplate: [1 for true and 0 for false]}
        const dynamicSlotMetadata = metadata?.extension?._DYNAMIC_SLOT;
        const hasDynamicTemplateSlots = !!dynamicSlotMetadata?.isTemplate;
        const templateSlots = slots.filter((slot) => {
            const slotMetadata = getPropertyMetadata(slot, metadata?.slots);
            if (slotMetadata) {
                if (slotMetadata.data) {
                    // static template slot
                    return true;
                }
            }
            else {
                if (hasDynamicTemplateSlots) {
                    // dynamic template slot
                    return true;
                }
            }
            return false;
        });
        templateSlots.forEach((slot) => {
            const slotNodes = slotMap[slot];
            if (slotNodes[0]?.nodeName === 'TEMPLATE') {
                this.getTemplateEngine().cleanupTemplateCache(slotNodes[0]);
            }
        });
    }
    /**
     * @override
     */
    GetPreCreatedPromise() {
        let translationPromise;
        let templateEnginePromise;
        // If the element requests translation bundles, lets load them using best fitted locale.
        // Delay component creation until bundles are loaded.
        if (this.Element.constructor.translationBundleMap) {
            translationPromise = this._getTranslationBundlesPromise();
        }
        // If the template engine has not yet been loaded, and we have have some template elements as direct children,
        // chain the base class's pre-create promise with the promise for the template engine becoming
        // loaded and cached
        // eslint-disable-next-line no-use-before-define
        if (!VComponentState._cachedTemplateEngine && this._hasDirectTemplateChildren()) {
            templateEnginePromise = this._getTemplateEnginePromise();
        }
        // The isConnected check is made because the translationPromise and templateEnginePromise might
        // take longer than a microtask to resolve and the element might disconnect while waiting for the promises.
        // This makes the binding provider promise a) irrelevant and b) likely to blow up if we proceeded.
        return Promise.all([translationPromise, templateEnginePromise]).then(() => {
            return this.Element.isConnected ? super.GetPreCreatedPromise() : Promise.reject();
        });
    }
    /**
     * @override
     */
    IsTransferAttribute(attrName) {
        return this.Element.constructor.rootObservedAttrSet.has(attrName);
    }
    /**
     * @override
     */
    GetDescriptiveTransferAttributeValue(attrName) {
        return getDescriptiveTransferAttributeValue(this.Element, attrName);
    }
    _getTranslationBundlesPromise() {
        const translationBundleMap = this.Element.constructor.translationBundleMap;
        const bundleKeys = Object.keys(translationBundleMap);
        const translationBundlePromises = [];
        bundleKeys.forEach((key) => {
            translationBundlePromises.push(getTranslationBundlePromise(key));
        });
        return Promise.all(translationBundlePromises).then((resolvedBundlesArray) => {
            bundleKeys.forEach((key, index) => {
                this._translationBundleMap[key] = resolvedBundlesArray[index];
            });
        });
    }
    /**
     * Returns a Promise for when the template engine is loaded.
     * Once loaded, the template engine is cached in a class variable.
     */
    _getTemplateEnginePromise() {
        return import('ojs/ojvcomponent-template').then((eng) => {
            VComponentState._cachedTemplateEngine = eng;
        });
    }
    /**
     * Helper to determine whether the custom element has
     * template children.
     */
    _hasDirectTemplateChildren() {
        const childNodeList = this.Element.childNodes;
        for (let i = 0; i < childNodeList.length; i++) {
            const child = childNodeList[i];
            if (child.localName === 'template') {
                return true;
            }
        }
        return false;
    }
}

function BusyContextProvider({ elemRefObj, children }) {
    const addBusyState = useCallback((description) => {
        // If the component is not mounted, return a noop
        if (elemRefObj.current) {
            const baseDescription = `${elemRefObj.current.tagName.toLowerCase()}: `;
            const busyContext = Context.getContext(elemRefObj.current).getBusyContext();
            return busyContext.addBusyState({ description: `${baseDescription}${description}` });
        }
        throw new Error(`Cannot call addBusyState() when the component is not connected to the DOM. Ensure the component is mounted before attempting to add a busy state.`);
    }, [elemRefObj]);
    const busyContext = useMemo(() => ({ addBusyState }), [addBusyState]);
    return jsx(BusyStateContext.Provider, { value: busyContext, children: children });
}

const FUNCTIONAL_COMPONENT = Symbol('functional component');
const ELEMENT_REF_OBJ = Symbol(); // Symbol for passing element RefObject to support BusyContextProvider
function customElement(tagName) {
    return function (constructor) {
        const metadata = constructor['_metadata'] || constructor['metadata'] || {};
        extendMetadata(metadata);
        const observedProps = metadata?.extension?.['_OBSERVED_GLOBAL_PROPS'] || [];
        const observedAttrs = observedProps.map((prop) => AttributeUtils.getGlobalAttrForProp(prop));
        overrideRender(tagName, constructor, metadata, new Set(observedProps));
        registerElement(tagName, metadata, constructor, observedProps, observedAttrs, constructor['_translationBundleMap'] || constructor['translationBundleMap']);
        if (!constructor['_metadata'] && constructor['metadata']) {
            warn(`Component ${tagName} is compiled with JET version prior to 14.0.0`);
        }
    };
}
/**
 * Register a functional component for the custom element
 * @param {string} tagName The element tag name to register
 * @param {function} fcomp The functional component
 * @param {object?} options Additional options for the functional VComponent
 * @returns A Component class which encapsulates the renderer
 */
function registerCustomElement(tagName, fcomp, options) {
    class VCompWrapper extends Component {
        constructor() {
            super();
            this.__refCallback = (instance) => {
                if (this.__vcompRef) {
                    this.__vcompRef.current = instance;
                }
                const innerRef = this.props['innerRef'];
                return applyRef(innerRef, instance);
            };
            if (VCompWrapper._metadata?.['methods']) {
                this.__vcompRef = createRef();
                // NOTE:  RT methods metadata will not include standard methods for
                //        getting/setting properties - those only get included in the DT metadata
                const rtMethodMD = VCompWrapper._metadata['methods'];
                const extendableInstance = this;
                // Set up pass-through methods
                for (let mName in rtMethodMD) {
                    extendableInstance[mName] = (...args) => this.__vcompRef.current?.[mName].apply(this.__vcompRef.current, args);
                }
            }
        }
        render() {
            arguments[0]['ref'] = this.__refCallback;
            return fcomp(arguments[0]);
        }
    }
    // NOTE:  If the optional 'options' argument was supplied, custom-tsc
    //        already processed and incorporated the PropertyBinding and/or
    //        Methods metadata into the undocumented 'metadata' argument, so the
    //        optional argument was removed from the arguments array!
    //
    //        If, at some later point, we decide that we DO need to pass along
    //        the 'options' argument to the VComponent framework during
    //        registration, then we will need to make adjustments both here
    //        and in custom-tsc.
    // 'displayName' is passed by custom-tsc as a 3rd argument. Use it to
    // set a default value for the returned class's displayName property.
    VCompWrapper.displayName = arguments[2];
    // 'metadata' is passed by custom-tsc as an optional 4th argument. Assign the
    // runtime metadata to the class so that customElement can find it.
    if (arguments.length >= 4 && arguments[3]) {
        VCompWrapper._metadata = arguments[3];
        // 'defaultProps' is passed by custom-tsc as an optional 5th argument.
        if (arguments.length >= 5 && arguments[4]) {
            VCompWrapper._defaultProps = arguments[4];
        }
    }
    // A 'translationBundleMap' (object mapping bundleIDs to loader functions)
    // is passed by custom-tsc as an optional 6th argument. Assign the object map
    // to the class so that customElement can find it.
    if (arguments.length >= 6) {
        VCompWrapper._translationBundleMap = arguments[5];
    }
    // A Contexts map (of type Options<P,M>['contexts']) is passed by custom-tsc
    // as an optional 7th argument. Assign the consumed Contexts to the class
    // so that customElement can find it.
    if (arguments.length >= 7) {
        VCompWrapper['_consumedContexts'] = arguments[6]['consume'];
    }
    // Mark this class so that we can identify functional vcomponents
    VCompWrapper[FUNCTIONAL_COMPONENT] = true;
    customElement(tagName)(VCompWrapper);
    return forwardRef((props, ref) => jsx(VCompWrapper, { ...props, innerRef: ref }));
}
function extendMetadata(metadata) {
    if (!metadata.properties) {
        metadata.properties = {};
    }
    // Add __oj_private_color_scheme and __oj_private_scale properties
    // to support binding propagation of colorScheme/scale values
    // in VComponents used in HTML. The values will be passed to the
    // EnvironmentProvider.
    metadata.properties.__oj_private_color_scheme = {
        type: 'string',
        binding: { consume: { name: 'colorScheme' } }
    };
    metadata.properties.__oj_private_scale = {
        type: 'string',
        binding: { consume: { name: 'scale' } }
    };
    // Add __oj_private_contexts property to support
    // propagation of Context objects to VComponents.
    // Without this, there won't be a setter and Preact
    // will call setAttribute, which isn't what we want.
    //
    // EnvironmentContext will only be passed here within JSX trees.
    // Other Contexts may be propagated both within JSX + HTML trees.
    metadata.properties.__oj_private_contexts = {
        type: 'object'
    };
    // The member is used to pass provided context from VComponentTemplate
    // to EnvironmentWrapper component.
    metadata.properties.__oj_provided_contexts = {
        type: 'object'
    };
    // Add __oj_private_identifier_to_* properties to ensure correct behavior
    // during VComponentTemplate compilation. These properties help preserve
    // non-primitive property values on the JET components that remain essentially
    // unchanged when templates are updated.
    metadata.properties.__oj_private_identifier_to_prop = {
        type: 'object',
        writeback: true // set writeback key to true to force deep compare in comparePropertyValues().
    };
    metadata.properties.__oj_private_identifier_to_value = {
        type: 'object',
        writeback: true // set writeback key to true to force deep compare in comparePropertyValues().
    };
}
function registerElement(tagName, metadata, constructor, observedProps, observedAttrs, translationBundleMap) {
    if (translationBundleMap) {
        registerTranslationBundleLoaders(translationBundleMap);
    }
    class HTMLPreactElement extends HTMLJetElement {
    }
    HTMLPreactElement.metadata = metadata;
    HTMLPreactElement.component = constructor;
    HTMLPreactElement.rootObservedAttributes = observedAttrs;
    HTMLPreactElement.rootObservedAttrSet = new Set(observedAttrs);
    HTMLPreactElement.rootObservedProperties = observedProps;
    HTMLPreactElement.defaultProps = constructor['defaultProps'] || constructor['_defaultProps']
        ? deepFreeze(constructor['defaultProps'] || constructor['_defaultProps'])
        : null;
    HTMLPreactElement.translationBundleMap = translationBundleMap;
    // Define getters/setters for metadata properties
    addPropGetterSetters(HTMLPreactElement.prototype, metadata?.properties);
    addMethods(HTMLPreactElement.prototype, metadata?.methods);
    registerElement$1(tagName, {
        descriptor: { metadata },
        stateClass: VComponentState,
        vcomp: true,
        cache: { contexts: constructor['_consumedContexts'] }
    }, HTMLPreactElement);
}
const InternalComp = ({ instance, tagName, metadata, baseRender, props, state, context }) => {
    let vdom = baseRender.call(instance, props, state, context);
    // The various cases to handle:
    // 1) The VComponent directly returns the Root component
    // 2) The VComponent directly returns the custom element tag (not recommended, but still supported)
    //    This case will be converted to case 1
    // 3) The VComponent returns only the children of the custom element (note that they may or may not be wrapped in a forwardRef)
    //    This case should be wrapped in the InternalRoot component
    // 4) The VComponent is a functional component that is exposing methods
    //    a) *must* be wrapped in (at least) a top-level forwardRef
    //    b) *must* ultimately return the Root component
    // Fixing infinite recursion for case 2.
    // The root element will be wrapped into EnvironmentWrapper component. We should discard
    // the wrapper component in this case.
    //
    // Also convert into case 1 -- i.e. <custom-element/> -> <Root/>
    if (vdom?.type?.['__ojIsEnvironmentWrapper'] && vdom.props.children.type === tagName) {
        // props.children for EnvironmentWrapper contains a single element
        const customElementNode = vdom.props.children;
        // the simple thing here would be to clone and change the type of the clone to Root.
        // however, cloning the custom element directly will trigger an infinite loop of unwrapping/wrapping
        // instead, we'll mutate the original to Root, clone, and then restore the original.
        customElementNode.type = Root;
        try {
            vdom = cloneElement(customElementNode);
        }
        finally {
            customElementNode.type = tagName;
        }
    }
    const vdomType = vdom?.type;
    if (vdomType !== Root) {
        if (!isForwardRef(vdomType) ||
            !vdomType[FUNCTIONAL_COMPONENT] ||
            Object.keys(metadata.methods || {}).length === 0) {
            // Case 3
            vdom = jsx(InternalRoot, { children: vdom });
        }
    }
    return vdom;
};
function overrideRender(tagName, constructor, metadata, observedPropsSet) {
    // Save the original component render method
    const componentRender = constructor.prototype.render;
    // Override the component render to know how to handle the dual mounting case
    constructor.prototype.render = function (props, state, context) {
        // We need to remove readOnly properties so they're not available to VComponents in this.props.
        // We don't want components relying on readOnly props because props come from the parent and parent components
        // will not be updating readOnly properties
        const readOnlyProps = metadata?.extension?.['_READ_ONLY_PROPS'];
        if (readOnlyProps) {
            readOnlyProps.forEach((prop) => delete props[prop]);
        }
        // If a flag isn't passed through the props indicating that the custom
        // element initiated the render, we will add a marker attribute indicating that
        // the component has already been rendered so the custom element won't try and
        // instantiate the component again on connected
        const element = props[ELEMENT_REF];
        const isElementFirst = !!element;
        if (isElementFirst) {
            CustomElementUtils.getElementState(element).disposeTemplateCache();
        }
        // Fix for Preact 10.21.0 (https://github.com/preactjs/preact/pull/4337).
        // Prior to the optimization Symbols were filtered from vnode props, but after
        // the optiomization JET added Symbols can sip into child properties. We want to avoid this and
        // filter the Symbols out from property object before rendering.
        let componentProps = props;
        if (props[ELEMENT_REF]) {
            const { [ELEMENT_REF]: remove1, [ROOT_VNODE_PATCH]: remove2, ...keep } = props;
            componentProps = keep;
        }
        this[ELEMENT_REF_OBJ] = this[ELEMENT_REF_OBJ] || { current: props[ELEMENT_REF] };
        return (jsx(RootContext.Provider, { value: {
                tagName,
                metadata,
                isElementFirst,
                vcompProps: props,
                observedPropsSet,
                elemRefObj: this[ELEMENT_REF_OBJ]
            }, children: jsx(BusyContextProvider, { elemRefObj: this[ELEMENT_REF_OBJ], children: jsx(InternalComp, { instance: this, baseRender: componentRender, props: componentProps, state: state, context: context, tagName: tagName, metadata: metadata }) }) }));
    };
}
function addPropGetterSetters(proto, properties) {
    if (!properties)
        return;
    for (let name in properties) {
        Object.defineProperty(proto, name, {
            get() {
                return this.getProperty(name);
            },
            set(value) {
                this.setProperty(name, value);
            }
        });
        addPrivatePropGetterSetters(proto, name);
    }
}
function addMethods(proto, methods) {
    if (!methods)
        return;
    for (let method in methods) {
        proto[method] = function () {
            if (this._helper === valueBasedElement) {
                throw new JetElementError(this, 'Cannot access element methods when rendered as a value based element.');
            }
            // The VComponent is asynchronously instantiated by CreateComponent so we
            // need to check that this has happened before we call any methods defined on it.
            // Custom elements are upgraded synchronously meaning the method will be available
            // on the HTMLElement, but we tell applications to wait on the component busy context
            // before accessing properties and methods due to the asynch CreateComponent call.
            const comp = this._helper.ref.current;
            if (!comp) {
                throw new JetElementError(this, 'Cannot access methods before element is upgraded.');
            }
            return comp[method].apply(comp, arguments);
        };
    }
}
// in preact/compat/src/forwardRef, the $$typeof expando is added for react compatibility.
// we're relying on the fact that this is unobfuscated to identify the internal Forwarded
// component that preact/compat creates
function isForwardRef(type) {
    return get$$typeof(type) === getForwardRef$$typeof();
}
function get$$typeof(type) {
    return type?.['$$typeof'];
}
let forwardRefSymbol;
function getForwardRef$$typeof() {
    if (!forwardRefSymbol) {
        forwardRefSymbol = get$$typeof(forwardRef(() => null));
    }
    return forwardRefSymbol;
}

// The following are decorator stubs needed for component imports, but
// that are removed at compile time and will not show up in the js code.
function method(target, propertyKey, descriptor) { }
function consumedContexts(contexts) {
    return function (constructor) { };
}

(function () {
    /**
     * Preact checks to see that a property is defined on an element before
     * calling the property setter so we will add the render property to the template
     * element prototype so we can set the render function on the template instance
     * when using the template engine in vdom logic.
     * @ignore
     */
    if (typeof window !== 'undefined') {
        if (!HTMLTemplateElement.prototype.hasOwnProperty('render')) {
            Object.defineProperty(HTMLTemplateElement.prototype, 'render', {
                value: null,
                writable: true
            });
        }
    }
})();

const ReportBusyContext = createContext(null);

const getUniqueId = ElementUtils.getUniqueId.bind(null, null);

export { ReportBusyContext, Root, consumedContexts, customElement, getUniqueId, method, registerCustomElement };
