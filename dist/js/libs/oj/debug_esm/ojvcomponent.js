/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { forwardRef } from 'preact/compat';
import { jsx } from 'preact/jsx-runtime';
import { h, options, Component, createRef, render, Fragment, cloneElement, createContext } from 'preact';
import { JetElementError, CustomElementUtils, AttributeUtils, transformPreactValue, ElementUtils, CHILD_BINDING_PROVIDER, publicToPrivateName, toSymbolizedValue, LifecycleElementState, addPrivatePropGetterSetters } from 'ojs/ojcustomelement-utils';
import { getElementRegistration, isElementRegistered, isVComponent, getElementDescriptor, registerElement as registerElement$1 } from 'ojs/ojcustomelement-registry';
import { useLayoutEffect, useContext, useMemo } from 'preact/hooks';
import { EnvironmentContext, RootEnvironmentProvider } from '@oracle/oraclejet-preact/UNSAFE_Environment';
import oj from 'ojs/ojcore-base';
import { patchSlotParent, OJ_SLOT_REMOVE } from 'ojs/ojpreact-patch';
import { getPropertyMetadata, getComplexPropertyMetadata, checkEnumValues, getFlattenedAttributes, deepFreeze } from 'ojs/ojmetadatautils';
import { LayerContext } from '@oracle/oraclejet-preact/UNSAFE_Layer';
import { getLocale } from 'ojs/ojconfig';
import { info, warn } from 'ojs/ojlogger';
import Context from 'ojs/ojcontext';
import { getTranslationBundlePromiseFromLoader } from 'ojs/ojtranslationbundleutils';

let _slotIdCount = 0;
let _originalCreateElementNS;
const _ACTIVE_SLOTS_PER_ELEMENT = new Map();
const _ACTIVE_SLOTS = new Map();
const _OJ_SLOT_ID = Symbol();
const _OJ_SLOT_PREFIX = '@oj_s';
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
            const parent = node.parentElement;
            if (parent) {
                patchSlotParent(parent);
            }
        }
    }
    const slotRemoveHandler = () => {
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
    return h(() => {
        _registerSlot(hostElement, key, node);
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
    activeSlots.add(id);
    _ACTIVE_SLOTS.set(id, node);
    if (wasEmpty) {
        _patchCreateElement();
    }
}
function _unregisterSlot(hostElement, id) {
    const activeSlots = _ACTIVE_SLOTS_PER_ELEMENT.get(hostElement);
    activeSlots.delete(id);
    if (activeSlots.size === 0) {
        _ACTIVE_SLOTS_PER_ELEMENT.delete(hostElement);
    }
    if (_ACTIVE_SLOTS_PER_ELEMENT.size === 0) {
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
    disposeNodes(nodeMap, cleanFunc) {
        Parking._iterateSlots(nodeMap, (node) => {
            const parent = node.parentElement;
            if (this._lot === parent) {
                cleanFunc(node);
                this._lot.__removeChild(node);
            }
            else if (!parent) {
                cleanFunc(node);
            }
        });
    }
    disconnectNodes(nodeMap) {
        Parking._iterateSlots(nodeMap, (node) => {
            if (this._lot === node.parentElement) {
                this._lot.__removeChild(node);
            }
        });
    }
    reconnectNodes(nodeMap) {
        Parking._iterateSlots(nodeMap, (node) => {
            if (!node.parentElement) {
                this._lot.appendChild(node);
            }
        });
    }
    isParked(n) {
        return n?.parentElement === this._lot;
    }
    _getLot() {
        if (!this._lot) {
            const div = document.createElement('div');
            div.__removeChild = div.removeChild;
            (div.removeChild) = (n) => n;
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

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
function diffProps(dom, newProps, oldProps, isSvg, hydrate, setPropertyOverrides) {
    let i;
    for (i in oldProps) {
        if (i !== 'children' && i !== 'key' && !(i in newProps)) {
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
    else if (name[0] === 'o' && name[1] === 'n') {
        useCapture = name !== (name = name.replace(/Capture$/i, ''));
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
            name = name.replace(/xlink[H:h]/, 'h').replace(/sName$/, 's');
        }
        else if (name !== 'href' &&
            name !== 'list' &&
            name !== 'form' &&
            name !== 'tabIndex' &&
            name !== 'download' &&
            name in dom) {
            try {
                dom[name] = value == null ? '' : value;
                break o;
            }
            catch (e) { }
        }
        if (typeof value === 'function') {
        }
        else if (value != null && (value !== false || (name[0] === 'a' && name[1] === 'r'))) {
            dom.setAttribute(name, value);
        }
        else {
            dom.removeAttribute(name);
        }
    }
}
function eventProxy(e) {
    this._listeners[e.type + false](options.event ? options.event(e) : e);
}
function eventProxyCapture(e) {
    this._listeners[e.type + true](options.event ? options.event(e) : e);
}

const NEW_DEFAULT_LAYER_ID = '__root_layer_host';
const getLayerHost = (element, level, priority) => {
    let parentLayerHost = null;
    if (level === 'nearestAncestor') {
        parentLayerHost = element.closest('[data-oj-layer]');
    }
    if (parentLayerHost) {
        return parentLayerHost;
    }
    let rootLayerHost = document.getElementById(NEW_DEFAULT_LAYER_ID);
    if (!rootLayerHost) {
        rootLayerHost = document.createElement('div');
        rootLayerHost.setAttribute('id', NEW_DEFAULT_LAYER_ID);
        rootLayerHost.setAttribute('data-oj-binding-provider', 'preact');
        rootLayerHost.style.position = 'relative';
        rootLayerHost.style.zIndex = '999';
        document.body.prepend(rootLayerHost);
    }
    return rootLayerHost;
};
const getLayerContext = (baseElem) => {
    const layerHostResolver = oj.VLayerUtils ? oj.VLayerUtils.getLayerHost : getLayerHost;
    const onLayerUnmountResolver = oj.VLayerUtils ? oj.VLayerUtils.onLayerUnmount : null;
    return {
        getRootLayerHost: layerHostResolver.bind(null, baseElem, 'topLevel'),
        getLayerHost: layerHostResolver.bind(null, baseElem, 'nearestAncestor'),
        onLayerUnmount: onLayerUnmountResolver?.bind(null, baseElem)
    };
};

const ELEMENT_REF = Symbol();
const ROOT_VNODE_PATCH = Symbol();
class ComponentWithContexts extends Component {
    constructor(props) {
        super(props);
        this.getEnvironmentContextObj = (currentEnv, env, colorScheme, scale, translationBundleMap) => {
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
        this.extendTranslationBundleMap = (env, translationBundleMap) => {
            if (!env.translations) {
                env.translations = translationBundleMap;
            }
            else if (env.translations !== translationBundleMap) {
                Object.keys(translationBundleMap).forEach((key) => {
                    if (!env.translations[key]) {
                        env.translations[key] = translationBundleMap[key];
                    }
                });
            }
        };
        this.state = { compProps: props.initialCompProps };
        this._layerContext = getLayerContext(props.baseElem);
    }
    render(props) {
        const compProps = this.state.compProps;
        const BaseComponent = props.baseComp;
        const componentVDom = jsx(BaseComponent, { ...compProps });
        const rootEnv = customMemo(this.getEnvironmentContextObj, [
            props.baseElem['__oj_private_contexts']?.get(EnvironmentContext),
            props.baseElem['__oj_private_color_scheme'],
            props.baseElem['__oj_private_scale'],
            props.translationBundleMap
        ]);
        const contexts = props.baseElem['__oj_private_contexts'];
        const contextWrappers = contexts
            ? Array.from(contexts).reduce((acc, [context, value]) => {
                if (context === EnvironmentContext) {
                    return acc;
                }
                const provider = jsx(context.Provider, { value: value, children: acc });
                return provider;
            }, componentVDom)
            : componentVDom;
        const vdomProps = componentVDom.props;
        vdomProps[ELEMENT_REF] = props.baseElem;
        vdomProps[ROOT_VNODE_PATCH] = props.rootPatchCallback;
        return (jsx(LayerContext.Provider, { value: this._layerContext, children: jsx(RootEnvironmentProvider, { environment: rootEnv, children: contextWrappers }) }));
    }
}
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
const argsChanged = (oldArgs, newArgs) => {
    return (!oldArgs ||
        oldArgs.length !== newArgs.length ||
        newArgs.some((arg, index) => arg !== oldArgs[index]));
};

const applyRef = (ref, value) => {
    if (ref) {
        if (typeof ref == 'function') {
            ref(value);
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
        this.ref = createRef();
        this._compWithContextsRef = createRef();
        this._initialized = false;
        this._isPatching = false;
        this._props = { ref: this.ref };
        this._verifyingState = ConnectionState.Unset;
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
    }
    connectedCallback() {
        this._verifyConnectDisconnect(ConnectionState.Connect);
    }
    disconnectedCallback() {
        this._verifyConnectDisconnect(ConnectionState.Disconnect);
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._isPatching && this._state.canHandleAttributes()) {
            const propName = AttributeUtils.attributeToPropertyName(name);
            const topProp = propName.split('.')[0];
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
            if (value === undefined && this._defaultProps) {
                value = CustomElementUtils.getPropertyValue(this._defaultProps, name);
            }
            return value;
        }
    }
    setProperty(name, value) {
        if (this._isPatching)
            return;
        const { prop: propMeta, subProp: subPropMeta } = getComplexPropertyMetadata(name, this._metadata?.properties);
        if (!propMeta) {
            this._element[name] = value;
        }
        else {
            if (this._state.allowPropertySets()) {
                value = transformPreactValue(this._element, name, subPropMeta, value);
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
            this._initializePropsFromDom();
            const eventsMeta = this._metadata.events;
            if (eventsMeta) {
                this._initializeActionCallbacks(eventsMeta);
            }
            const writebackProps = this._metadata.extension?.['_WRITEBACK_PROPS'];
            if (writebackProps) {
                this._initializeWritebackCallbacks(writebackProps);
            }
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
    _getPropValueInfo(attrName, attrValue) {
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
        let topPropPrevValue = this.getProperty(topProp);
        if (oj.CollectionUtils.isPlainObject(topPropPrevValue)) {
            topPropPrevValue = oj.CollectionUtils.copyInto({}, topPropPrevValue, undefined, true);
        }
        if (isOuter) {
            this._verifyProps(propPath, value, propMeta, subPropMeta);
        }
        this._updateProps(propArray, value);
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
            this._queueFireEventsTask({ type, detail, collapse: collapseFunc, kind: _PROP_CHANGE });
        }
        const oldProps = this._oldRootProps;
        if (oldProps && this._controlledProps.has(propPath)) {
            oldProps[propPath] = value;
        }
        if (this._vdom && !propMeta?.readOnly) {
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
            this._compWithContextsRef.current.setState({ compProps: this._props });
        }
        else {
            throw new Error(`Render requested for a disconnected component ${this._element.tagName}`);
        }
    }
    _verifyProps(prop, value, propMeta, subPropMeta) {
        if (!propMeta) {
            return;
        }
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
        if (propPath.length > 1) {
            const currentValue = this._props[topProp] ?? this._defaultProps?.[topProp];
            if (currentValue && oj.CollectionUtils.isPlainObject(currentValue)) {
                propsObj[topProp] = oj.CollectionUtils.copyInto({}, currentValue, undefined, true);
            }
            else {
                propsObj[topProp] = {};
            }
        }
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
        if (this._verifyingState === ConnectionState.Unset) {
            window.queueMicrotask(() => {
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
            this._state.startCreationCycle();
            if (this._state.isCreating()) {
                const createComponentCallback = () => {
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
            applyRef(this._oldRootRef, null);
            this._oldRootRef = undefined;
            this._vdom = null;
        }
        else {
            this._state.pauseCreationCycle();
        }
    }
    _initializePropsFromDom() {
        const attrs = this._element.attributes;
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
            applyRef(newRef, this._element);
            if (newRef) {
                this._oldRootRef?.(null);
            }
        }
        this._oldRootProps = newProps;
        this._oldRootRef = newRef;
    }
    static _setPropertyOverrides(dom, name, value, oldValue) {
        if (name === 'style' && typeof value == 'string') {
            throw new Error('CSS style must be an object. CSS text is not supported');
        }
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
            const useCapture = name !== (name = name.replace(/Capture$/i, ''));
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
            if (value) {
                dom.setAttribute(name, value);
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
    _getInitialRootProps() {
        const props = {};
        for (const name of this._controlledProps.values()) {
            if (name in this._props) {
                props[name] = this._props[name];
            }
        }
        return props;
    }
    _removeAndConvertSlotsToProps(slotMap) {
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
                    const isTemplateSlot = !!slotMetadata?.data;
                    const slotProperty = !isTemplateSlot && slot === '' ? 'children' : slot;
                    this._assignSlotProperty(slotProps, slotProperty, undefined, slot, isTemplateSlot, slotNodes);
                }
                else {
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
            let child;
            while ((child = this._element.firstChild)) {
                this._state.getBindingProviderCleanNode()(child);
                child.remove();
            }
        }
        return slotProps;
    }
    _assignSlotProperty(slotProps, propName, containerPropName, slotName, isTemplateSlot, slotNodes) {
        const propContainer = containerPropName ? slotProps[containerPropName] : slotProps;
        if (isTemplateSlot) {
            if (slotNodes[0]?.nodeName === 'TEMPLATE') {
                const templateNode = slotNodes[0];
                let renderer = templateNode['render'];
                if (renderer) {
                    propContainer[propName] = renderer;
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
        if (node.nodeType === Node.ELEMENT_NODE) {
            CustomElementUtils.subtreeHidden(node);
        }
    }
    _handleSlotUnmount(node) {
        if (this._state.isPostCreateCallbackOrComplete()) {
            ParkingLot.parkNode(node);
            window.queueMicrotask(() => {
                if (ParkingLot.isParked(node)) {
                    this._propagateSubtreeHidden(node);
                }
            });
        }
    }
    _handleSlotMount(node) {
        const handleMount = CustomElementUtils.subtreeShown;
        if (handleMount && node.nodeType === Node.ELEMENT_NODE) {
            if (node.isConnected) {
                handleMount(node);
            }
            else {
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
            const eventProp = AttributeUtils.eventTypeToEventListenerProperty(event);
            this._props[eventProp] = (detailObj) => {
                const detail = Object.assign({}, detailObj);
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
            const callbackProp = AttributeUtils.propertyNameToChangedCallback(propPath);
            const { prop: propMeta, subProp: subPropMeta } = getComplexPropertyMetadata(propPath, this._metadata?.properties);
            this._props[callbackProp] = (value) => {
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

const EnvironmentWrapper = forwardRef((props, ref) => {
    const child = props.children;
    const contexts = getElementRegistration(child.type).cache
        .contexts;
    const allContexts = [EnvironmentContext, ...(contexts ?? [])];
    const allValues = allContexts.map((context) => {
        const ctxValue = useContext(context);
        const providedValue = child.props.__oj_private_contexts?.get(context);
        return providedValue === undefined ? ctxValue : providedValue;
    });
    const contextMap = useMemo(() => {
        const map = new Map();
        for (let i = 0; i < allContexts.length; i++) {
            map.set(allContexts[i], allValues[i]);
        }
        return map;
    }, allValues);
    child.props.__oj_private_contexts = contextMap;
    if (ref) {
        if (child.ref) {
            const originalRef = child.ref;
            child.ref = (el) => {
                applyRef(originalRef, el);
                applyRef(ref, el);
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
let isCloningElement = false;
options.vnode = (vnode) => {
    const type = vnode.type;
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
const RAF_TIMEOUT = 100;
const originalRAF = options.requestAnimationFrame;
function _requestAnimationFrame(task) {
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
    Context.__addPreactPromise(rafPromise, 'Preact requestAnimationFrame');
}
options.requestAnimationFrame = _requestAnimationFrame;

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
 *   TemplateSlot is a function type that takes a single  parameter:
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
 *   {target:"Type", value:"<Detail extends object = {}>", for:"genericTypeParameters"},
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
        if (!this._helper) {
            if (this.hasAttribute('data-oj-jsx')) {
                this.removeAttribute('data-oj-jsx');
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
    const helper = element._getHelper();
    const vprops = helper.getProps?.() || {};
    return vprops[attrName];
};
const isInitialized = (element) => {
    const helper = element._getHelper();
    return !!helper.isInitialized?.();
};

const RootContext = createContext(null);
function isGlobalProperty(prop, metadata) {
    return (prop === 'className' ||
        AttributeUtils.isGlobalOrData(prop) ||
        isGlobalEventListenerProperty(prop, metadata));
}
const _GLOBAL_EVENT_MATCH_EXP = /^on(?!.*Changed$)([A-Za-z])([A-Za-z]*)$/;
function isGlobalEventListenerProperty(prop, metadata) {
    if (metadata?.properties?.[prop]) {
        return false;
    }
    const match = prop.match(_GLOBAL_EVENT_MATCH_EXP);
    if (match) {
        const eventType = match[1].toLowerCase() + match[2];
        return !metadata?.events?.[eventType];
    }
    return false;
}

const InternalRoot = ({ children }) => {
    const { tagName, metadata, isElementFirst, vcompProps } = useContext(RootContext);
    if (isElementFirst) {
        return children;
    }
    const refFunc = function (ref) {
        if (ref) {
            ref[CustomElementUtils.VCOMP_INSTANCE] = {
                props: vcompProps
            };
        }
    };
    const globalPropKeys = Object.keys(vcompProps).filter((prop) => isGlobalProperty(prop, metadata));
    const globalProps = globalPropKeys.reduce((acc, cur) => {
        acc[cur] = vcompProps[cur];
        return acc;
    }, {});
    const elem = (jsx("div", { ref: refFunc, "data-oj-jsx": "", ...globalProps, children: children }));
    elem.type = tagName;
    return elem;
};

const _CLASS = 'class';
const Root = forwardRef((props, ref) => {
    const { tagName, metadata, isElementFirst, vcompProps, observedPropsSet } = useContext(RootContext);
    if (isElementFirst) {
        const artificialRoot = jsx("div", { ...props, ref: ref });
        artificialRoot.type = tagName;
        vcompProps[ROOT_VNODE_PATCH](artificialRoot);
        return jsx(Fragment, { children: props.children });
    }
    const propFixups = {};
    if (vcompProps.style && props['style']) {
        propFixups['style'] = Object.assign({}, vcompProps.style, props['style']);
    }
    const componentClass = vcompProps[_CLASS];
    if (componentClass) {
        const nodeClass = props[_CLASS] || '';
        propFixups[_CLASS] = `${componentClass} ${nodeClass}`;
    }
    const parentGlobalKeys = Object.keys(vcompProps).filter((prop) => !(prop in props) && !observedPropsSet.has(prop) && isGlobalProperty(prop, metadata));
    const parentGlobals = parentGlobalKeys.reduce((acc, cur) => {
        acc[cur] = vcompProps[cur];
        return acc;
    }, {});
    const refFunc = (el) => {
        if (ref) {
            applyRef(ref, el);
        }
        if (el) {
            el[CustomElementUtils.VCOMP_INSTANCE] = {
                props: vcompProps
            };
        }
    };
    const elem = jsx("div", { ...props, ...propFixups, ...parentGlobals, ref: refFunc, "data-oj-jsx": "" });
    elem.type = tagName;
    return elem;
});

class VComponentState extends LifecycleElementState {
    constructor(element) {
        super(element);
        this._translationBundleMap = {};
    }
    getTranslationBundleMap() {
        return this._translationBundleMap;
    }
    getTemplateEngine() {
        return VComponentState._cachedTemplateEngine;
    }
    getTrackChildrenOption() {
        return 'immediate';
    }
    allowPropertyChangedEvents() {
        return super.allowPropertyChangedEvents() && isInitialized(this.Element);
    }
    allowPropertySets() {
        return this._allowPropertySets || super.allowPropertySets();
    }
    resetCreationCycle() {
        this._allowPropertySets = super.allowPropertySets();
        super.resetCreationCycle();
    }
    disposeTemplateCache() {
        const slotMap = this.getSlotMap();
        const slots = Object.keys(slotMap);
        const metadata = getElementDescriptor(this.Element.tagName).metadata;
        const dynamicSlotMetadata = metadata?.extension?._DYNAMIC_SLOT;
        const hasDynamicTemplateSlots = !!dynamicSlotMetadata?.isTemplate;
        const templateSlots = slots.filter((slot) => {
            const slotMetadata = getPropertyMetadata(slot, metadata?.slots);
            if (slotMetadata) {
                if (slotMetadata.data) {
                    return true;
                }
            }
            else {
                if (hasDynamicTemplateSlots) {
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
    GetPreCreatedPromise() {
        let translationPromise;
        let templateEnginePromise;
        if (this.Element.constructor.translationBundleMap) {
            translationPromise = this._getTranslationBundlesPromise();
        }
        if (!VComponentState._cachedTemplateEngine && this._hasDirectTemplateChildren()) {
            templateEnginePromise = this._getTemplateEnginePromise();
        }
        return Promise.all([translationPromise, templateEnginePromise]).then(() => {
            return this.Element.isConnected ? super.GetPreCreatedPromise() : Promise.reject();
        });
    }
    IsTransferAttribute(attrName) {
        return this.Element.constructor.rootObservedAttrSet.has(attrName);
    }
    GetDescriptiveTransferAttributeValue(attrName) {
        return getDescriptiveTransferAttributeValue(this.Element, attrName);
    }
    _getTranslationBundlesPromise() {
        const translationBundleMap = this.Element.constructor.translationBundleMap;
        const bundleKeys = Object.keys(translationBundleMap);
        const translationBundlePromises = [];
        bundleKeys.forEach((key) => {
            if (!VComponentState._bundlePromiseCache[key]) {
                const loader = translationBundleMap[key];
                VComponentState._bundlePromiseCache[key] = getTranslationBundlePromiseFromLoader(loader);
            }
            translationBundlePromises.push(VComponentState._bundlePromiseCache[key]);
        });
        return Promise.all(translationBundlePromises).then((resolvedBundlesArray) => {
            bundleKeys.forEach((key, index) => {
                this._translationBundleMap[key] = resolvedBundlesArray[index];
            });
        });
    }
    _getTemplateEnginePromise() {
        return import('ojs/ojvcomponent-template').then((eng) => {
            VComponentState._cachedTemplateEngine = eng;
        });
    }
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
VComponentState._bundlePromiseCache = {};

const FUNCTIONAL_COMPONENT = Symbol('functional component');
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
function registerCustomElement(tagName, fcomp, options) {
    class VCompWrapper extends Component {
        constructor() {
            super();
            this.__refCallback = (instance) => {
                if (this.__vcompRef) {
                    this.__vcompRef.current = instance;
                }
                const innerRef = this.props['innerRef'];
                applyRef(innerRef, instance);
            };
            if (VCompWrapper._metadata?.['methods']) {
                this.__vcompRef = createRef();
                const rtMethodMD = VCompWrapper._metadata['methods'];
                const extendableInstance = this;
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
    VCompWrapper.displayName = arguments[2];
    if (arguments.length >= 4 && arguments[3]) {
        VCompWrapper._metadata = arguments[3];
        if (arguments.length >= 5 && arguments[4]) {
            VCompWrapper._defaultProps = arguments[4];
        }
    }
    if (arguments.length >= 6) {
        VCompWrapper._translationBundleMap = arguments[5];
    }
    if (arguments.length >= 7) {
        VCompWrapper['_consumedContexts'] = arguments[6]['consume'];
    }
    VCompWrapper[FUNCTIONAL_COMPONENT] = true;
    customElement(tagName)(VCompWrapper);
    return forwardRef((props, ref) => jsx(VCompWrapper, { ...props, innerRef: ref }));
}
function extendMetadata(metadata) {
    if (!metadata.properties) {
        metadata.properties = {};
    }
    metadata.properties.__oj_private_color_scheme = {
        type: 'string',
        binding: { consume: { name: 'colorScheme' } }
    };
    metadata.properties.__oj_private_scale = {
        type: 'string',
        binding: { consume: { name: 'scale' } }
    };
    metadata.properties.__oj_private_contexts = {
        type: 'object'
    };
}
function registerElement(tagName, metadata, constructor, observedProps, observedAttrs, translationBundleMap) {
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
    addPropGetterSetters(HTMLPreactElement.prototype, metadata?.properties);
    addMethods(HTMLPreactElement.prototype, metadata?.methods);
    registerElement$1(tagName, {
        descriptor: { metadata },
        stateClass: VComponentState,
        vcomp: true,
        cache: { contexts: constructor['_consumedContexts'] }
    }, HTMLPreactElement);
}
function overrideRender(tagName, constructor, metadata, observedPropsSet) {
    const componentRender = constructor.prototype.render;
    constructor.prototype.render = function (props, state, context) {
        const readOnlyProps = metadata?.extension?.['_READ_ONLY_PROPS'];
        if (readOnlyProps) {
            readOnlyProps.forEach((prop) => delete props[prop]);
        }
        const element = props[ELEMENT_REF];
        const isElementFirst = !!element;
        if (isElementFirst) {
            CustomElementUtils.getElementState(element).disposeTemplateCache();
        }
        let componentProps = props;
        if (props[ELEMENT_REF]) {
            const { [ELEMENT_REF]: remove1, [ROOT_VNODE_PATCH]: remove2, ...keep } = props;
            componentProps = keep;
        }
        let vdom = componentRender.call(this, componentProps, state, context);
        if (vdom?.type?.['__ojIsEnvironmentWrapper'] &&
            vdom.props.children.type === tagName) {
            const customElementNode = vdom.props.children;
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
                vdom = jsx(InternalRoot, { children: vdom });
            }
        }
        return (jsx(RootContext.Provider, { value: { tagName, metadata, isElementFirst, vcompProps: props, observedPropsSet }, children: vdom }));
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
            const comp = this._helper.ref.current;
            if (!comp) {
                throw new JetElementError(this, 'Cannot access methods before element is upgraded.');
            }
            return comp[method].apply(comp, arguments);
        };
    }
}
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

function method(target, propertyKey, descriptor) { }
function consumedContexts(contexts) {
    return function (constructor) { };
}

(function () {
    if (typeof window !== 'undefined') {
        if (!HTMLTemplateElement.prototype.hasOwnProperty('render')) {
            Object.defineProperty(HTMLTemplateElement.prototype, 'render', {
                value: null,
                writable: true
            });
        }
    }
})();

const getUniqueId = ElementUtils.getUniqueId.bind(null, null);

export { Root, consumedContexts, customElement, getUniqueId, method, registerCustomElement };
