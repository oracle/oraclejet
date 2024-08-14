/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { isElementRegistered, getElementRegistration, getElementDescriptor, getMetadata, getElementProperties } from 'ojs/ojcustomelement-registry';
import Context from 'ojs/ojcontext';
import { warn } from 'ojs/ojlogger';
import { verifyThemeVersion } from 'ojs/ojthemeutils';

const _SUPPORTED_TYPES_MAP = {};
class ElementUtils {
    static isValidCustomElementName(localName) {
        const reserved = ElementUtils._RESERVED_TAGS.has(localName);
        const validForm = ElementUtils._ELEMENT_NAME_REGEXP.test(localName);
        return !reserved && validForm && !localName.startsWith('oj-bind-', 0);
    }
    static getSupportedTypes(typeStr) {
        if (!typeStr)
            return {};
        let supportedTypes = _SUPPORTED_TYPES_MAP[typeStr];
        if (!supportedTypes) {
            supportedTypes = {};
            const lowerTypeStr = typeStr.toLowerCase();
            const types = lowerTypeStr.match(/(?=[^|])(?:[^|]*<[^>]+>)*[^|]*/g);
            let numTypes = 0;
            types.forEach((untrimmedType) => {
                const type = untrimmedType.trim();
                if (type === 'any' ||
                    type === 'boolean' ||
                    type === 'number' ||
                    type === 'string' ||
                    type === 'array' ||
                    type === 'object' ||
                    type === 'null') {
                    supportedTypes[type] = 1;
                }
                else if (type.indexOf('array<') === 0) {
                    supportedTypes.array = 1;
                }
                else if (type.indexOf('object<') === 0) {
                    supportedTypes.object = 1;
                }
                else {
                    supportedTypes.other = 1;
                }
                numTypes++;
            });
            supportedTypes.typeCount = numTypes;
            _SUPPORTED_TYPES_MAP[lowerTypeStr] = supportedTypes;
        }
        return supportedTypes;
    }
    static getUniqueId(id) {
        if (id) {
            return id;
        }
        const ret = ElementUtils._UNIQUE + ElementUtils._UNIQUE_INCR;
        ElementUtils._UNIQUE_INCR += 1;
        return ret;
    }
    static comparePropertyValues(isWriteback, value1, value2) {
        if (isWriteback) {
            return oj.Object.compareValues(value1, value2);
        }
        return value1 === value2;
    }
}
ElementUtils._UNIQUE_INCR = 0;
ElementUtils._UNIQUE = '_oj';
ElementUtils._RESERVED_TAGS = new Set([
    'annotation-xml',
    'color-profile',
    'font-face',
    'font-face-src',
    'font-face-uri',
    'font-face-format',
    'font-face-name',
    'missing-glyph'
]);
ElementUtils._ELEMENT_NAME_REGEXP = /^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/;

const GLOBAL_PROPS = {
    accessKey: 'accesskey',
    autocapitalize: 'autocapitalize',
    autofocus: 'autofocus',
    class: 'class',
    contentEditable: 'contenteditable',
    dir: 'dir',
    draggable: 'draggable',
    enterKeyHint: 'enterkeyhint',
    hidden: 'hidden',
    id: 'id',
    inputMode: 'inputmode',
    lang: 'lang',
    role: 'role',
    slot: 'slot',
    spellcheck: 'spellcheck',
    style: 'style',
    tabIndex: 'tabindex',
    translate: 'translate',
    title: 'title'
};

class JetElementError extends Error {
    constructor(element, message) {
        super(`${element.localName} with id '${element.id || ''}': ${message}`);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, JetElementError);
        }
        this.name = 'JetElementError';
    }
}

const _ARRAY_VALUE_EXP = /^\s*\[[^]*\]\s*$/;
const _OBJ_VALUE_EXP = /^\s*\{[^]*\}\s*$/;
const _ATTR_EXP = /^(?:\{\{)([^]+)(?:\}\})$/;
const _ATTR_EXP_RO = /^(?:\[\[)([^]+)(?:\]\])$/;
const _GLOBAL_ATTRS = {};
Object.keys(GLOBAL_PROPS).forEach(function (prop) {
    const attr = GLOBAL_PROPS[prop];
    if (prop !== attr) {
        _GLOBAL_ATTRS[attr] = prop;
    }
});
class AttributeUtils {
    static getExpressionInfo(attrValue) {
        let downstreamOnly = false;
        let expr;
        if (attrValue) {
            const trimmedVal = attrValue.trim();
            let expArr = _ATTR_EXP.exec(trimmedVal);
            expr = expArr?.[1];
            if (!expr) {
                downstreamOnly = true;
                expArr = _ATTR_EXP_RO.exec(trimmedVal);
                expr = expArr?.[1];
            }
        }
        return { downstreamOnly, expr };
    }
    static attributeToPropertyValue(elem, attr, val, propMeta) {
        if (val == null)
            return undefined;
        try {
            return AttributeUtils.coerceValue(elem, attr, val, propMeta.type);
        }
        catch (err) {
            throw new JetElementError(elem, `Error while parsing parsing attribute ${attr}. ${err.stack || err}`);
        }
    }
    static parseAttributeValue(tagName, attr, value, type, id = null) {
        if (!type) {
            throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${id}'. \
        This attribute only supports data bound values. Check the API doc for supported types`);
        }
        const supportedTypes = ElementUtils.getSupportedTypes(type);
        const isValueArray = _ARRAY_VALUE_EXP.test(value);
        const isValueObj = _OBJ_VALUE_EXP.test(value);
        if ((supportedTypes.array && isValueArray) ||
            (supportedTypes.object && isValueObj) ||
            (supportedTypes.any && (isValueArray || isValueObj))) {
            try {
                return JSON.parse(value);
            }
            catch (ex) {
                throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${id}' \
          to a JSON Object. Check the value for correct JSON syntax, e.g. double quoted strings. ${ex}`);
            }
        }
        else if (supportedTypes.string || supportedTypes.any) {
            return value;
        }
        else if (supportedTypes.boolean) {
            return AttributeUtils.parseBooleanValue(tagName, attr, value, type, id);
        }
        else if (supportedTypes.number && !isNaN(value)) {
            return Number(value);
        }
        throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${id}' \
      to a ${type}.`);
    }
    static parseBooleanValue(tagName, attr, value, type, id) {
        if (value == null || value === 'true' || value === '' || value.toLowerCase() === attr) {
            return true;
        }
        else if (value === 'false') {
            return false;
        }
        throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${id}' to a ${type}.`);
    }
    static coerceValue(elem, attr, value, type) {
        const tagName = elem.tagName.toLowerCase();
        return AttributeUtils.parseAttributeValue(tagName, attr, value, type, elem.id);
    }
    static coerceBooleanValue(elem, attr, value, type) {
        return AttributeUtils.parseBooleanValue(elem.tagName.toLowerCase(), attr, value, type, elem.id);
    }
    static isGlobalOrData(prop) {
        return (Object.prototype.hasOwnProperty.call(GLOBAL_PROPS, prop) ||
            prop.startsWith('data-') ||
            prop.startsWith('aria-'));
    }
    static getGlobalAttrForProp(prop) {
        return GLOBAL_PROPS[prop] || prop;
    }
    static getGlobalPropForAttr(attr) {
        return _GLOBAL_ATTRS[attr] || attr;
    }
    static getGlobalValuePropForAttr(attr) {
        if (attr.toLowerCase() === 'contenteditable') {
            return 'isContentEditable';
        }
        return AttributeUtils.getGlobalPropForAttr(attr);
    }
}
AttributeUtils.attributeToPropertyName = cacheHelper.bind(null, (attr) => attr.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase()));
AttributeUtils.propertyNameToAttribute = cacheHelper.bind(null, (name) => name.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`));
AttributeUtils.eventTypeToEventListenerProperty = cacheHelper.bind(null, (type) => 'on' + type.substr(0, 1).toUpperCase() + type.substr(1));
AttributeUtils.isEventListenerProperty = cacheHelper.bind(null, (property) => /^on[A-Z]/.test(property));
AttributeUtils.isEventListenerAttr = cacheHelper.bind(null, (attr) => /^on-[a-z]/.test(attr));
AttributeUtils.eventListenerPropertyToEventType = cacheHelper.bind(null, (property) => property.substr(2, 1).toLowerCase() + property.substr(3));
AttributeUtils.propertyNameToChangeEventType = cacheHelper.bind(null, (name) => `${name}Changed`);
AttributeUtils.propertyNameToChangedCallback = cacheHelper.bind(null, (prop) => `on${prop[0].toUpperCase()}${prop.substr(1)}Changed`);
AttributeUtils.eventTriggerToEventType = cacheHelper.bind(null, (trigger) => `oj${trigger.substr(0, 1).toUpperCase()}${trigger.substr(1)}`);
AttributeUtils.eventAttrToPreactPropertyName = cacheHelper.bind(null, (attr) => {
    const capitalize = (chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1);
    const chunks = attr.toLowerCase().split('-');
    return chunks.reduce((acc, curr, index) => {
        return index > 1 ? acc + capitalize(curr) : acc + curr;
    }, '');
});
function cacheHelper(converter, key) {
    let cache = converter['cache'];
    if (!cache) {
        cache = new Map();
        converter['cache'] = cache;
    }
    if (!cache.has(key)) {
        cache.set(key, converter(key));
    }
    return cache.get(key);
}

const CHILD_BINDING_PROVIDER = Symbol('childBindingProvider');
const CACHED_BINDING_PROVIDER = Symbol('cachedBindingProvider');
const EMPTY_SET = new Set();
const _OJ_SUBTREE_HIDDEN_CLASS = 'oj-subtree-hidden';
const _OJ_PENDING_SUBTREE_HIDDEN_CLASS = 'oj-pending-subtree-hidden';
const _OJ_SLOT_WHITESPACE = Symbol('ojSlotWhitespace');
class CustomElementUtils {
    static subtreeShown(elem, initialRender, skipDeferActivation) {
        CustomElementUtils._legacySubtreeShownOnceCB?.(elem, initialRender);
        _unmarkSubtreeHidden(elem);
        const legacyShowCB = CustomElementUtils._legacySubtreeShownInstanceCB;
        const instanceCB = legacyShowCB
            ? _executeWithSlotRelocationOn((elem) => legacyShowCB(elem, initialRender))
            : null;
        _applyHideShowToComponents(elem, instanceCB, skipDeferActivation ? null : _ojDeferCallback);
    }
    static getElementInfo(element) {
        if (element) {
            return `${element.tagName.toLowerCase()} with id '${element.id}'`;
        }
        return '';
    }
    static getElementState(element) {
        let state = element[CustomElementUtils._ELEMENT_STATE_KEY];
        if (!state && isElementRegistered(element.tagName)) {
            const StateClass = getElementRegistration(element.tagName).stateClass;
            state = new StateClass(element);
            Object.defineProperty(element, CustomElementUtils._ELEMENT_STATE_KEY, { value: state });
        }
        return state ?? null;
    }
    static getElementBridge(element) {
        let bridge = element[CustomElementUtils._ELEMENT_BRIDGE_KEY];
        if (bridge === undefined && isElementRegistered(element.tagName)) {
            bridge = null;
            const bridgeProto = getElementRegistration(element.tagName).bridgeProto;
            if (bridgeProto !== undefined) {
                bridge = Object.create(bridgeProto);
                const descriptor = getElementDescriptor(element.tagName);
                bridge.initializeBridge(element, descriptor);
            }
            Object.defineProperty(element, CustomElementUtils._ELEMENT_BRIDGE_KEY, { value: bridge });
        }
        return bridge ?? null;
    }
    static getSlotMap(element) {
        const slotMap = {};
        const childNodeList = element.childNodes;
        const metadata = childNodeList.length > 0 ? getMetadata(element.localName) : null;
        for (let i = 0; i < childNodeList.length; i++) {
            const child = childNodeList[i];
            if (CustomElementUtils.isSlotable(child)) {
                const slot = CustomElementUtils.getSlotAssignment(child);
                if (!slotMap[slot]) {
                    slotMap[slot] = [];
                }
                CustomElementUtils._possiblyApplyImplicitContext(child, slot, metadata);
                slotMap[slot].push(child);
                child[CACHED_BINDING_PROVIDER] = CustomElementUtils._getBindingProviderTypeForSlot(element, child);
            }
        }
        return slotMap;
    }
    static getSlotAssignment(node) {
        const slot = node['__oj_slots'] != null
            ? node['__oj_slots']
            : node.getAttribute && node.getAttribute('slot');
        if (!slot)
            return '';
        return slot;
    }
    static isSlotable(node) {
        const isSlotable = node.nodeType === 1 || (node.nodeType === 3 && !!node.nodeValue.trim());
        if (!isSlotable) {
            node[_OJ_SLOT_WHITESPACE] = true;
        }
        return isSlotable;
    }
    static getElementProperty(element, property) {
        if (isElementRegistered(element.tagName)) {
            let vInst = element[CustomElementUtils.VCOMP_INSTANCE];
            if (vInst) {
                return CustomElementUtils.getPropertyValue(vInst.props, property);
            }
            return element.getProperty(property);
        }
        return element[property];
    }
    static getPropertyValue(allProps, property) {
        let propObj = allProps;
        const propPath = property.split('.');
        try {
            propPath.forEach((subprop) => (propObj = propObj[subprop]));
        }
        catch {
            return undefined;
        }
        return propObj;
    }
    static allowSlotRelocation(allow) {
        CustomElementUtils._ALLOW_RELOCATION_COUNT += allow ? 1 : -1;
    }
    static canRelocateNode(element, node) {
        const state = CustomElementUtils.getElementState(element);
        const slotMap = state.getSlotMap();
        if (!slotMap || CustomElementUtils._ALLOW_RELOCATION_COUNT > 0) {
            return true;
        }
        const slotSet = state.getSlotSet();
        if (state.isPostCreateCallbackOrComplete() &&
            (slotSet.has(node) || node[_OJ_SLOT_WHITESPACE])) {
            if (element.hasAttribute('data-oj-preact')) {
                throw new JetElementError(element, `${node.localName} cannot be relocated as a child of this element.`);
            }
            else if (state.getBindingProviderType() === 'preact') {
                return false;
            }
        }
        return true;
    }
    static cleanComponentBindings(element) {
        CustomElementUtils.getElementState(element)?.getBindingProviderCleanNode()(element);
    }
    static getClassSet(strClass) {
        if (strClass) {
            const arClasses = strClass.split(/\s+/).filter((cls) => cls.length > 0);
            if (arClasses.length > 0) {
                return new Set(arClasses);
            }
        }
        return EMPTY_SET;
    }
    static _possiblyApplyImplicitContext(child, slot, metadata) {
        if (child?.nodeType === Node.ELEMENT_NODE) {
            if (metadata.slots?.[slot]?.implicitBusyContext) {
                child.setAttribute('data-oj-context', '');
            }
        }
    }
    static _getBindingProviderTypeForSlot(element, child) {
        return (child[CACHED_BINDING_PROVIDER] ||
            (child.nodeType === 1 && child.getAttribute('data-oj-binding-provider')) ||
            CustomElementUtils.getElementState(element)?.getBindingProviderType());
    }
    static markPendingSubtreeHidden(element) {
        element.classList.add(_OJ_PENDING_SUBTREE_HIDDEN_CLASS);
    }
    static unmarkPendingSubtreeHidden(element) {
        element.classList.remove(_OJ_PENDING_SUBTREE_HIDDEN_CLASS);
    }
    static registerLegacySubtreeCallbacks(instanceShown, shownOnce, instanceHidden) {
        CustomElementUtils._legacySubtreeShownInstanceCB = instanceShown;
        CustomElementUtils._legacySubtreeShownOnceCB = shownOnce;
        CustomElementUtils._legacySubtreeHiddenInstanceCB = instanceHidden;
    }
    static parseAttrValue(elem, attr, prop, val, metadata) {
        if (val == null) {
            return val;
        }
        function _coerceVal(value) {
            return AttributeUtils.attributeToPropertyValue(elem, attr, value, metadata);
        }
        var parseFunction = getElementDescriptor(elem.tagName)['parseFunction'];
        if (parseFunction) {
            return parseFunction(val, prop, metadata, function (value) {
                return _coerceVal(value);
            });
        }
        return _coerceVal(val);
    }
}
CustomElementUtils._ELEMENT_STATE_KEY = '_ojElementState';
CustomElementUtils._ELEMENT_BRIDGE_KEY = '_ojBridge';
CustomElementUtils._ALLOW_RELOCATION_COUNT = 0;
CustomElementUtils.VCOMP_INSTANCE = Symbol('vcompInstance');
CustomElementUtils.subtreeHidden = function (elem) {
    const legacyHideCB = CustomElementUtils._legacySubtreeHiddenInstanceCB;
    const instanceCB = legacyHideCB ? _executeWithSlotRelocationOn(legacyHideCB) : null;
    _applyHideShowToComponents(elem, instanceCB, null);
    _markSubtreeHidden(elem);
};
const _deferTag = 'oj-defer';
function _markSubtreeHidden(element) {
    element.classList.add(_OJ_SUBTREE_HIDDEN_CLASS);
}
function _unmarkSubtreeHidden(element) {
    element.classList.remove(_OJ_SUBTREE_HIDDEN_CLASS);
}
function _ojDeferCallback(elem) {
    if (elem.localName !== _deferTag) {
        return;
    }
    if (elem._activate) {
        elem._activate();
    }
    else {
        throw new Error('subtreeShown called before module ojs/ojdefer was loaded');
    }
}
function _executeWithSlotRelocationOn(callback) {
    return (elem) => {
        CustomElementUtils.allowSlotRelocation(true);
        try {
            callback(elem);
        }
        finally {
            CustomElementUtils.allowSlotRelocation(false);
        }
    };
}
function _applyHideShowToComponents(rootElem, instanceCB, activateDeferCB) {
    if (!instanceCB && !activateDeferCB) {
        return;
    }
    function isHidden(elem) {
        let curr = elem;
        while (curr) {
            if (curr.nodeType === Node.DOCUMENT_NODE) {
                return false;
            }
            if (curr.nodeType === Node.ELEMENT_NODE &&
                curr.classList.contains(_OJ_SUBTREE_HIDDEN_CLASS)) {
                return true;
            }
            curr = curr.parentNode;
        }
        return true;
    }
    function filterHidden(allNodes, hiddenNodes) {
        const shownNodes = [];
        let j = 0;
        for (var i = 0; i < hiddenNodes.length; i++) {
            var hidden = hiddenNodes[i];
            while (j < allNodes.length && allNodes[j] !== hidden) {
                shownNodes.push(allNodes[j]);
                j += 1;
            }
            j += 1;
        }
        while (j < allNodes.length) {
            shownNodes.push(allNodes[j]);
            j += 1;
        }
        return shownNodes;
    }
    function processFunc(element) {
        instanceCB?.(element);
        activateDeferCB?.(element);
    }
    if (!isHidden(rootElem)) {
        processFunc(rootElem);
        const selectors = ['.oj-component-initnode'];
        if (activateDeferCB) {
            selectors.push(_deferTag);
        }
        const hiddenSelectors = [];
        selectors.forEach(function (s) {
            hiddenSelectors.push(`.${_OJ_SUBTREE_HIDDEN_CLASS} ${s}`);
            hiddenSelectors.push(`.${_OJ_PENDING_SUBTREE_HIDDEN_CLASS} ${s}`);
        });
        if (activateDeferCB) {
            hiddenSelectors.push(`${_deferTag}.${_OJ_SUBTREE_HIDDEN_CLASS}`);
        }
        const selector = selectors.join(',');
        const hiddenSelector = hiddenSelectors.join(',');
        const allNodes = rootElem.querySelectorAll(selector);
        const hiddenNodes = rootElem.querySelectorAll(hiddenSelector);
        var shownNodes = filterHidden(allNodes, hiddenNodes);
        shownNodes.forEach((el) => processFunc(el));
    }
}

class ElementState {
    constructor(element) {
        this.dirtyProps = new Set();
        this._componentState = ComponentState.WaitingToCreate;
        this._outerClasses = new Set();
        this.Element = element;
    }
    startCreationCycle() {
        if (this._isInErrorState())
            return;
        if (this._preCreatedPromise == null ||
            this._componentState === ComponentState.WaitingToCreate) {
            this._updateComponentState(ComponentState.Creating);
        }
        this._registerBusyState();
    }
    pauseCreationCycle() {
        this._resolveBusyState();
    }
    resetCreationCycle() {
        this._updateComponentState(ComponentState.WaitingToCreate);
        this._bindingProviderPromise = null;
        this._preCreatedPromise = null;
        this._createdPromise = null;
    }
    isComplete() {
        return this._componentState === ComponentState.Complete;
    }
    isCreating() {
        return this._componentState === ComponentState.Creating;
    }
    isPostCreateCallbackOrComplete() {
        return this._componentState === ComponentState.PostCreateCallback || this.isComplete();
    }
    canHandleAttributes() {
        return !this._isInErrorState() && this._componentState !== ComponentState.WaitingToCreate;
    }
    beginApplyingBindings() {
        if (!this.isComplete()) {
            this._bindingProviderType = 'knockout';
            this._updateComponentState(ComponentState.ApplyingBindings);
        }
    }
    allowPropertySets() {
        return (this._componentState === ComponentState.Creating ||
            this._componentState === ComponentState.ApplyingBindings ||
            this._componentState === ComponentState.BindingsApplied ||
            this._componentState === ComponentState.PostCreateCallback ||
            this._componentState === ComponentState.Complete);
    }
    allowPropertyChangedEvents() {
        return (this._componentState === ComponentState.BindingsApplied ||
            this._componentState === ComponentState.PostCreateCallback ||
            this._componentState === ComponentState.Complete);
    }
    getTrackChildrenOption() {
        const metadata = getElementDescriptor(this.Element.tagName).metadata;
        return metadata?.extension?.['_TRACK_CHILDREN'] ?? 'none';
    }
    setCreateCallback(createComponentCallback) {
        if (this._isInErrorState())
            return;
        this._updateComponentState(ComponentState.WaitingForBindings);
        if (!this._preCreatedPromise) {
            this._preCreatedPromise = this.GetPreCreatedPromise();
        }
        this._createdPromise = this._preCreatedPromise.then(() => {
            if (!this._isInErrorState()) {
                const createVal = createComponentCallback();
                this._updateComponentState(ComponentState.PostCreateCallback);
                return createVal;
            }
            return Promise.reject();
        });
        this._createdPromise.then(() => {
            this._updateComponentState(ComponentState.Complete);
        }, (error) => {
            this._updateComponentState(ComponentState.Incomplete);
            if (error)
                throw error;
        });
    }
    setBindingsDisposedCallback(callback) {
        this._disposedCallback = callback;
    }
    resolveBindingProvider(provider) {
        this._bpClean = provider.__CleanNode;
        if (this._resolveBindingProviderCallback) {
            this._bindingsApplied();
            this._resolveBindingProviderCallback(provider);
            this._resolveBindingProviderCallback = null;
            this._rejectBindingProviderCallback = null;
        }
        this._bindingProvider = provider;
    }
    rejectBindingProvider(error) {
        if (this._rejectBindingProviderCallback) {
            this._rejectBindingProviderCallback(error);
            this._resolveBindingProviderCallback = null;
            this._rejectBindingProviderCallback = null;
        }
    }
    disposeBindingProvider() {
        if (!this.isComplete()) {
            this.rejectBindingProvider();
            this._updateComponentState(ComponentState.BindingsDisposed);
        }
        else {
            this._disposedCallback?.();
        }
    }
    setBindingProviderCallback(callback) {
        this._bindingProviderCallback = callback;
    }
    getBindingProviderPromise() {
        const bpType = this.getBindingProviderType();
        if (!this._bindingProviderPromise) {
            verifyThemeVersion();
            if (bpType === 'none' || bpType === 'preact') {
                this._bindingsApplied();
                this._bindingProviderPromise = Promise.resolve(null);
            }
            else if (bpType === 'knockout') {
                if (this._bindingProvider) {
                    this._bindingsApplied();
                    this._bindingProviderPromise = Promise.resolve(this._bindingProvider);
                }
                else {
                    this._bindingProviderPromise = new Promise((resolve, reject) => {
                        this._resolveBindingProviderCallback = resolve;
                        this._rejectBindingProviderCallback = reject;
                    });
                }
            }
            else {
                throw new JetElementError(this.Element, `Unknown binding provider '${bpType}'.`);
            }
        }
        return this._bindingProviderPromise;
    }
    getBindingProvider() {
        return this._bindingProvider;
    }
    getBindingProviderType() {
        if (!this._bindingProviderType) {
            this._bindingProviderType = ElementState._walkBindingProviders(this.Element);
        }
        return this._bindingProviderType;
    }
    getUseKoFlag() {
        if (this._useKoFlag === undefined) {
            this._useKoFlag = ElementState._findKoUseFlag(this.Element);
        }
        return this._useKoFlag;
    }
    getBindingProviderCleanNode() {
        return this._bpClean || ElementState._NOOP;
    }
    getDescriptiveText() {
        let text = this.GetDescriptiveValue('aria-label') ||
            this.GetDescriptiveValue('title') ||
            this.GetDescriptiveLabelByValue('labelled-by') ||
            this.GetDescriptiveValue('label-hint') ||
            this.GetDescriptiveLabelByValue('aria-labelledby');
        if (text) {
            text = text.trim().replace(/\s+/g, ' ');
        }
        else {
            text = '';
        }
        return text;
    }
    getSlotMap(bCreate) {
        if (!this._slotMap && bCreate) {
            this._slotMap = CustomElementUtils.getSlotMap(this.Element);
        }
        return this._slotMap;
    }
    getSlotSet() {
        if (!this._slotSet) {
            const keys = Object.keys(this._slotMap);
            let nodes = [];
            keys.forEach((key) => (nodes = nodes.concat(this._slotMap[key])));
            this._slotSet = new Set(nodes);
        }
        return this._slotSet;
    }
    setOuterClasses(outerClasses) {
        this.PatchClasses(this._outerClasses, outerClasses);
        this._outerClasses = outerClasses;
    }
    PatchClasses(oldClasses, newClasses) {
        oldClasses.forEach((oldClass) => {
            if (!newClasses.has(oldClass)) {
                this.Element.classList.remove(oldClass);
            }
        });
        newClasses.forEach((newClass) => {
            if (!oldClasses.has(newClass)) {
                this.Element.classList.add(newClass);
            }
        });
    }
    GetCreatedPromise() {
        return this._createdPromise;
    }
    GetPreCreatedPromise() {
        let preCreatePromise = this.getBindingProviderPromise();
        const trackOption = this.getTrackChildrenOption();
        if (trackOption !== 'none') {
            preCreatePromise = preCreatePromise.then((bindingProvider) => {
                return this._getTrackedChildrenPromises(bindingProvider);
            });
        }
        return preCreatePromise;
    }
    IsTransferAttribute(attrName) {
        return false;
    }
    GetDescriptiveValue(attrName) {
        const propName = AttributeUtils.attributeToPropertyName(attrName);
        const properties = getElementProperties(this.Element);
        let value;
        if (properties && properties[propName]) {
            value = this.Element[propName];
        }
        else if (this.IsTransferAttribute(attrName)) {
            value = this.GetDescriptiveTransferAttributeValue(attrName);
        }
        else {
            value = this.Element.getAttribute(attrName);
        }
        return value;
    }
    GetDescriptiveTransferAttributeValue(attrName) {
        return '';
    }
    GetDescriptiveLabelByValue(attrName) {
        const LabelBy = this.GetDescriptiveValue(attrName);
        if (LabelBy) {
            const label = document.getElementById(LabelBy);
            if (label) {
                return label.textContent;
            }
        }
        return null;
    }
    _updateComponentState(state) {
        if (this._componentState !== ComponentState.BindingsDisposed) {
            switch (state) {
                case ComponentState.WaitingToCreate:
                    this.Element.classList.remove('oj-complete');
                    this._createdPromise = null;
                    break;
                case ComponentState.Complete:
                    this.Element.classList.add('oj-complete');
                    this._resolveBusyState();
                    break;
                case ComponentState.BindingsDisposed:
                case ComponentState.Incomplete:
                    this.Element.classList.add('oj-incomplete');
                    this._resolveBusyState();
                    break;
                default:
                    break;
            }
            this._componentState = state;
        }
    }
    _bindingsApplied() {
        this._updateComponentState(ComponentState.BindingsApplied);
        this._bindingProviderCallback?.();
    }
    _registerBusyState() {
        const busyContext = Context.getContext(this.Element).getBusyContext();
        if (this._resolveCreatedBusyState) {
            throw new JetElementError(this.Element, 'Registering busy state before previous state is resolved.');
        }
        this._resolveCreatedBusyState = busyContext.addBusyState({
            description: CustomElementUtils.getElementInfo(this.Element) + ' is being upgraded.'
        });
    }
    _resolveBusyState() {
        if (this._resolveCreatedBusyState) {
            this._resolveCreatedBusyState();
            this._resolveCreatedBusyState = null;
        }
    }
    static _findKoUseFlag(element) {
        const template = element.querySelector(':scope > template[data-oj-use-ko]');
        return !!template;
    }
    static _walkBindingProviders(element, startElement = element) {
        let name = element[CACHED_BINDING_PROVIDER];
        if (name) {
            return name;
        }
        name = element.getAttribute('data-oj-binding-provider');
        if (!name) {
            const parent = element.parentElement;
            if (parent == null) {
                if (element === document.documentElement) {
                    name = 'knockout';
                }
                else {
                    throw new JetElementError(startElement, 'Cannot determine binding provider for a disconnected subtree.');
                }
            }
            else {
                name =
                    parent[CHILD_BINDING_PROVIDER] ??
                        ElementState._walkBindingProviders(parent, startElement);
            }
        }
        element[CACHED_BINDING_PROVIDER] = name;
        return name;
    }
    _getTrackedChildrenPromises(bindingProvider) {
        const _UPGRADE_MESSAGE_INTERVAL = 20000;
        const trackOption = this.getTrackChildrenOption();
        const busyContext = Context.getContext(this.Element).getBusyContext();
        const trackedElements = this._getChildrenToTrack(this.Element, trackOption, []);
        const promises = trackedElements.map((trackedElement) => {
            if (!bindingProvider) {
                const resolveElementDefinedBusyState = busyContext.addBusyState({
                    description: `Waiting for element ${trackedElement.localName} to be defined.`
                });
                const timer = setInterval(() => {
                    warn(`Waiting for element ${trackedElement.localName} to be defined.`);
                }, _UPGRADE_MESSAGE_INTERVAL);
                return customElements
                    .whenDefined(trackedElement.localName)
                    .then(() => {
                    resolveElementDefinedBusyState();
                    clearInterval(timer);
                    if (isElementRegistered(trackedElement.tagName)) {
                        return CustomElementUtils.getElementState(trackedElement).GetCreatedPromise();
                    }
                    return null;
                })
                    .catch((error) => {
                    resolveElementDefinedBusyState();
                    clearInterval(timer);
                    throw new Error(`Error defining element ${trackedElement.localName} : ${error}`);
                });
            }
            else if (isElementRegistered(trackedElement.tagName)) {
                return CustomElementUtils.getElementState(trackedElement).GetCreatedPromise();
            }
            return null;
        });
        return Promise.all(promises);
    }
    _getChildrenToTrack(element, trackOption, trackedElements) {
        const children = element.childNodes;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            if (ElementUtils.isValidCustomElementName(child.localName)) {
                trackedElements.push(child);
            }
            else if (trackOption === 'nearestCustomElement') {
                this._getChildrenToTrack(child, trackOption, trackedElements);
            }
        }
        return trackedElements;
    }
    _isInErrorState() {
        return (this._componentState === ComponentState.Incomplete ||
            this._componentState === ComponentState.BindingsDisposed);
    }
}
ElementState._NOOP = () => { };
var ComponentState;
(function (ComponentState) {
    ComponentState[ComponentState["WaitingToCreate"] = 0] = "WaitingToCreate";
    ComponentState[ComponentState["Creating"] = 1] = "Creating";
    ComponentState[ComponentState["WaitingForBindings"] = 2] = "WaitingForBindings";
    ComponentState[ComponentState["ApplyingBindings"] = 3] = "ApplyingBindings";
    ComponentState[ComponentState["BindingsApplied"] = 4] = "BindingsApplied";
    ComponentState[ComponentState["PostCreateCallback"] = 5] = "PostCreateCallback";
    ComponentState[ComponentState["Complete"] = 6] = "Complete";
    ComponentState[ComponentState["Incomplete"] = 7] = "Incomplete";
    ComponentState[ComponentState["BindingsDisposed"] = 8] = "BindingsDisposed";
})(ComponentState || (ComponentState = {}));

class LifecycleElementState extends ElementState {
    constructor() {
        super(...arguments);
        this._connectCallbacks = [];
        this._disconnectCallbacks = [];
    }
    addLifecycleCallbacks(connectFunc, disconnectFunc) {
        if (connectFunc) {
            this._connectCallbacks.push(connectFunc);
        }
        if (disconnectFunc) {
            this._disconnectCallbacks.push(disconnectFunc);
        }
    }
    removeLifecycleCallbacks(connectFunc, disconnectFunc) {
        if (connectFunc) {
            this._connectCallbacks = this._connectCallbacks.filter((item) => item != connectFunc);
        }
        if (disconnectFunc) {
            this._disconnectCallbacks = this._disconnectCallbacks.filter((item) => item != disconnectFunc);
        }
    }
    executeLifecycleCallbacks(isConnected) {
        const callbacks = isConnected ? this._connectCallbacks : this._disconnectCallbacks;
        callbacks.forEach((callback) => callback());
    }
}

const NULL_SYMBOL = Symbol('custom element null');
const EMPTY_STRING_SYMBOL = Symbol('custom element empty string');
const UNDEFINED_SYMBOL = Symbol('custom element undefined');
const PRIVATE_VALUE_KEY = '__oj_private_do_not_use_value';
const PRIVATE_CHECKED_KEY = '__oj_private_do_not_use_checked';
const publicToPrivateName = new Map([
    ['value', PRIVATE_VALUE_KEY],
    ['checked', PRIVATE_CHECKED_KEY]
]);
const toSymbolizedValue = (value) => {
    if (value === null) {
        return NULL_SYMBOL;
    }
    if (value === '') {
        return EMPTY_STRING_SYMBOL;
    }
    if (value === undefined) {
        return UNDEFINED_SYMBOL;
    }
    return value;
};
const fromSymbolizedValue = (value) => {
    if (value === NULL_SYMBOL) {
        return null;
    }
    if (value === EMPTY_STRING_SYMBOL) {
        return '';
    }
    if (value === UNDEFINED_SYMBOL || value === '') {
        return undefined;
    }
    return value;
};
const convertEmptyStringToUndefined = (element, propertyMeta, value) => {
    if (!element ||
        CustomElementUtils.getElementState(element).getBindingProviderType() === 'preact') {
        const types = ElementUtils.getSupportedTypes(propertyMeta.type);
        if (!types.string || propertyMeta.enumValues) {
            return undefined;
        }
    }
    return value;
};
const transformPreactValue = (element, propertyName, propertyMeta, originalValue) => {
    let value = originalValue;
    if (propertyName !== 'value' && propertyName !== 'checked') {
        if (value === '') {
            value = convertEmptyStringToUndefined(element, propertyMeta, value);
        }
    }
    return value;
};
const convertPrivatePropFromPreact = (prop, value) => {
    if (prop === PRIVATE_VALUE_KEY) {
        return { prop: 'value', value: fromSymbolizedValue(value) };
    }
    if (prop === PRIVATE_CHECKED_KEY) {
        return { prop: 'checked', value: fromSymbolizedValue(value) };
    }
    return { prop, value };
};
const addPrivatePropGetterSetters = (proto, property) => {
    if (property === 'value' || property === 'checked') {
        Object.defineProperty(proto, publicToPrivateName.get(property), {
            get() {
                return this[property];
            },
            set(newValue) {
                this[property] = fromSymbolizedValue(newValue);
            }
        });
    }
};

const OJ_BIND_CONVERTED_NODE = Symbol('ojBindConvertedNode');

export { AttributeUtils, CACHED_BINDING_PROVIDER, CHILD_BINDING_PROVIDER, CustomElementUtils, ElementState, ElementUtils, JetElementError, LifecycleElementState, OJ_BIND_CONVERTED_NODE, addPrivatePropGetterSetters, convertPrivatePropFromPreact, publicToPrivateName, toSymbolizedValue, transformPreactValue };
