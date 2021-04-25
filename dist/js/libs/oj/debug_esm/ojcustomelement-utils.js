/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
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
}
ElementUtils._UNIQUE_INCR = 0;
ElementUtils._UNIQUE = '_ojcustomelem';
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
    is: 'is',
    itemid: 'itemid',
    itemprop: 'itemprop',
    itemref: 'itemref',
    itemscope: 'itemscope',
    itemtype: 'itemtype',
    lang: 'lang',
    nonce: 'nonce',
    role: 'role',
    slot: 'slot',
    spellcheck: 'spellcheck',
    style: 'style',
    tabIndex: 'tabindex',
    title: 'title',
    translate: 'translate'
};
const NATIVE_PROPS = {
    acceptCharset: 'accept-charset',
    allowFullscreen: 'allowfullscreen',
    allowPaymentRequest: 'allowpaymentrequest',
    colSpan: 'colspan',
    crossOrigin: 'crossorigin',
    dateTime: 'datetime',
    dirName: 'dirname',
    encoding: 'enctype',
    formAction: 'formaction',
    formEnctype: 'formenctype',
    formMethod: 'formmethod',
    formNoValidate: 'formnovalidate',
    formTarget: 'formtarget',
    for: 'for',
    httpEquiv: 'http-equiv',
    imageSizes: 'imagesizes',
    imageSrcset: 'imagesrcset',
    inputMode: 'inputmode',
    isMap: 'ismap',
    maxLength: 'maxlength',
    minLength: 'minlength',
    noModule: 'nomodule',
    noValidate: 'novalidate',
    readOnly: 'readonly',
    referrerPolicy: 'referrerpolicy',
    rowSpan: 'rowspan',
    useMap: 'usemap'
};

const _ARRAY_VALUE_EXP = /^\s*\[[^]*\]\s*$/;
const _OBJ_VALUE_EXP = /^\s*\{[^]*\}\s*$/;
const _ATTR_EXP = /^(?:\{\{)([^]+)(?:\}\})$/;
const _ATTR_EXP_RO = /^(?:\[\[)([^]+)(?:\]\])$/;
const _GLOBAL_ATTRS = {};
Object.keys(GLOBAL_PROPS).forEach(function (prop) {
    var attr = GLOBAL_PROPS[prop];
    if (prop !== attr) {
        _GLOBAL_ATTRS[attr] = prop;
        NATIVE_PROPS[prop] = attr;
    }
});
class AttributeUtils {
    static getExpressionInfo(attrValue) {
        let downstreamOnly = false;
        let expr;
        if (attrValue) {
            const trimmedVal = attrValue.trim();
            let expArr = _ATTR_EXP.exec(trimmedVal);
            expr = expArr === null || expArr === void 0 ? void 0 : expArr[1];
            if (!expr) {
                downstreamOnly = true;
                expArr = _ATTR_EXP_RO.exec(trimmedVal);
                expr = expArr === null || expArr === void 0 ? void 0 : expArr[1];
            }
        }
        return { downstreamOnly, expr };
    }
    static coerceValue(elem, attr, value, type) {
        var tagName = elem.tagName.toLowerCase();
        if (!type) {
            throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}'. \
        This attribute only supports data bound values. Check the API doc for supported types`);
        }
        const supportedTypes = ElementUtils.getSupportedTypes(type);
        var isValueArray = _ARRAY_VALUE_EXP.test(value);
        var isValueObj = _OBJ_VALUE_EXP.test(value);
        if ((supportedTypes.array && isValueArray) ||
            (supportedTypes.object && isValueObj) ||
            (supportedTypes.any && (isValueArray || isValueObj))) {
            try {
                return JSON.parse(value);
            }
            catch (ex) {
                throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}' \
          to a JSON Object. Check the value for correct JSON syntax, e.g. double quoted strings. ${ex}`);
            }
        }
        else if (supportedTypes.string || supportedTypes.any) {
            return value;
        }
        else if (supportedTypes.boolean) {
            return AttributeUtils.coerceBooleanValue(elem, attr, value, type);
        }
        else if (supportedTypes.number && !isNaN(value)) {
            return Number(value);
        }
        throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}' \
      to a ${type}.`);
    }
    static coerceBooleanValue(elem, attr, value, type) {
        if (value == null || value === 'true' || value === '' || value.toLowerCase() === attr) {
            return true;
        }
        else if (value === 'false') {
            return false;
        }
        const tagName = elem.tagName.toLowerCase();
        throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${elem.id}' to a ${type}.`);
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
    static getNativeAttr(prop) {
        return NATIVE_PROPS[prop] || prop;
    }
}
AttributeUtils.attributeToPropertyName = cacheHelper.bind(null, (attr) => attr.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase()));
AttributeUtils.propertyNameToAttribute = cacheHelper.bind(null, (name) => name.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`));
AttributeUtils.eventTypeToEventListenerProperty = cacheHelper.bind(null, (type) => 'on' + type.substr(0, 1).toUpperCase() + type.substr(1));
AttributeUtils.isEventListenerProperty = cacheHelper.bind(null, (property) => /^on[A-Z]/.test(property));
AttributeUtils.eventListenerPropertyToEventType = cacheHelper.bind(null, (property) => property.substr(2, 1).toLowerCase() + property.substr(3));
AttributeUtils.propertyNameToChangeEventType = cacheHelper.bind(null, (name) => `${name}Changed`);
AttributeUtils.propertyNameToChangedCallback = cacheHelper.bind(null, (prop) => `on${prop[0].toUpperCase()}${prop.substr(1)}Changed`);
AttributeUtils.eventTriggerToEventType = cacheHelper.bind(null, (trigger) => `oj${trigger.substr(0, 1).toUpperCase()}${trigger.substr(1)}`);
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

class CustomElementUtils {
    static registerElement(tagName, regObj) {
        const tagNameUpper = tagName.toUpperCase();
        if (!CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagNameUpper]) {
            if (!regObj.descriptor) {
                throw new Error(`Custom element ${tagName} must be registered with a descriptor.`);
            }
            CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagName] = regObj;
            CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagNameUpper] = regObj;
            return true;
        }
        return false;
    }
    static isComposite(tagName) {
        var _a, _b;
        return (_b = (_a = CustomElementUtils.getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.composite) !== null && _b !== void 0 ? _b : false;
    }
    static isElementRegistered(tagName) {
        return CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagName] != null;
    }
    static getElementRegistration(tagName) {
        var _a;
        return (_a = CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagName]) !== null && _a !== void 0 ? _a : null;
    }
    static getElementDescriptor(tagName) {
        var _a;
        return ((_a = CustomElementUtils.getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.descriptor) || {};
    }
    static getElementProperties(element) {
        var _a, _b;
        const descriptor = CustomElementUtils.getElementDescriptor(element.tagName);
        return ((_b = ((_a = descriptor['_metadata']) !== null && _a !== void 0 ? _a : descriptor.metadata)) === null || _b === void 0 ? void 0 : _b.properties) || {};
    }
    static getElementInfo(element) {
        if (element) {
            return `${element.tagName.toLowerCase()} with id '${element.id}'`;
        }
        return '';
    }
    static getElementState(element) {
        let state = element[CustomElementUtils._ELEMENT_STATE_KEY];
        if (!state && CustomElementUtils.isElementRegistered(element.tagName)) {
            const StateClass = CustomElementUtils.getElementRegistration(element.tagName).stateClass;
            state = new StateClass(element);
            Object.defineProperty(element, CustomElementUtils._ELEMENT_STATE_KEY, { value: state });
        }
        return state !== null && state !== void 0 ? state : null;
    }
    static getElementBridge(element) {
        let bridge = element[CustomElementUtils._ELEMENT_BRIDGE_KEY];
        if (!bridge && CustomElementUtils.isElementRegistered(element.tagName)) {
            const bridgeProto = CustomElementUtils.getElementRegistration(element.tagName).bridgeProto;
            bridge = Object.create(bridgeProto);
            const descriptor = CustomElementUtils.getElementDescriptor(element.tagName);
            bridge.initializeBridge(element, descriptor);
            Object.defineProperty(element, CustomElementUtils._ELEMENT_BRIDGE_KEY, { value: bridge });
        }
        return bridge !== null && bridge !== void 0 ? bridge : null;
    }
    static getSlotMap(element) {
        const slotMap = {};
        const childNodeList = element.childNodes;
        for (var i = 0; i < childNodeList.length; i++) {
            const child = childNodeList[i];
            if (CustomElementUtils.isSlotable(child)) {
                const slot = CustomElementUtils.getSlotAssignment(child);
                if (!slotMap[slot]) {
                    slotMap[slot] = [];
                }
                slotMap[slot].push(child);
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
        return node.nodeType === 1 || (node.nodeType === 3 && !!node.nodeValue.trim());
    }
    static getElementProperty(element, property) {
        if (CustomElementUtils.isElementRegistered(element.tagName)) {
            const vInst = element['_vcomp'];
            if (vInst && !vInst.isCustomElementFirst()) {
                return CustomElementUtils.getComplexProperty(vInst.props, property);
            }
            return element.getProperty(property);
        }
        return element[property];
    }
    static getComplexProperty(allProps, property) {
        let propObj = allProps;
        let propPath = property.split('.');
        try {
            propPath.forEach((subprop) => (propObj = propObj[subprop]));
        }
        catch (_a) {
            return undefined;
        }
        return propObj;
    }
}
CustomElementUtils._CUSTOM_ELEMENT_REGISTRY = {};
CustomElementUtils._ELEMENT_STATE_KEY = '_ojElementState';
CustomElementUtils._ELEMENT_BRIDGE_KEY = '_ojBridge';

class ElementState {
    constructor(element) {
        this.isComplete = false;
        this.isConnected = false;
        this.isDisposed = false;
        this.isInitializingProperties = false;
        this.dirtyProps = new Set();
        this.Element = element;
    }
    getTrackChildrenOption() {
        var _a, _b;
        const metadata = CustomElementUtils.getElementDescriptor(this.Element.tagName).metadata;
        return (_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.extension) === null || _a === void 0 ? void 0 : _a['_TRACK_CHILDREN']) !== null && _b !== void 0 ? _b : 'none';
    }
    registerBusyState() {
        const busyContext = Context.getContext(this.Element).getBusyContext();
        if (this._resolveCreatedBusyState) {
            this.throwError('Registering busy state before previous state is resolved.');
        }
        this._resolveCreatedBusyState = busyContext.addBusyState({
            description: CustomElementUtils.getElementInfo(this.Element) + ' is being upgraded.'
        });
    }
    resolveBusyState() {
        const callback = this._resolveCreatedBusyState;
        if (!callback) {
            this.throwError('Resolving busy state before one is registered.');
        }
        this._resolveCreatedBusyState = null;
        callback();
    }
    beginCreate(createComponentCallback) {
        if (!this._preCreatedPromise) {
            this._preCreatedPromise = this.GetPreCreatedPromise();
        }
        if (this.isComplete) {
            this._resetStateFlags();
        }
        this._createdPromise = this._preCreatedPromise.then(createComponentCallback);
        this._createdPromise.then(() => {
            this.Element.classList.add('oj-complete');
            this._completeHandler();
        }, (error) => {
            this.Element.classList.add('oj-incomplete');
            this._completeHandler();
            if (error)
                throw error;
        });
    }
    throwError(msg, origErr) {
        let errMsg = CustomElementUtils.getElementInfo(this.Element) + ': ' + msg;
        if (origErr) {
            errMsg = errMsg + ' ' + (origErr.stack ? origErr.stack : origErr);
        }
        throw new Error(errMsg);
    }
    resolveBindingProvider(provider) {
        var _a;
        if (this._resolveBindingProviderCallback) {
            (_a = this._bindingProviderCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            this._resolveBindingProviderCallback(provider);
            this._resolveBindingProviderCallback = null;
            this._rejectBindingProviderCallback = null;
        }
        else {
            this._bindingProvider = provider;
        }
    }
    rejectBindingProvider(error) {
        if (this._rejectBindingProviderCallback) {
            this._rejectBindingProviderCallback(error);
            this._resolveBindingProviderCallback = null;
            this._rejectBindingProviderCallback = null;
        }
    }
    disposeBindingProvider() {
        this.isDisposed = true;
        if (!this.isComplete) {
            this.rejectBindingProvider();
        }
    }
    setBindingProviderCallback(callback) {
        this._bindingProviderCallback = callback;
    }
    getBindingProviderPromise() {
        var _a, _b;
        if (!this._bindingProviderPromise) {
            verifyThemeVersion();
            const name = this._walkBindingProviders(this.Element);
            if (name === 'none') {
                (_a = this._bindingProviderCallback) === null || _a === void 0 ? void 0 : _a.call(this);
                this._bindingProviderPromise = Promise.resolve(null);
            }
            else if (name === 'knockout') {
                if (this._bindingProvider) {
                    (_b = this._bindingProviderCallback) === null || _b === void 0 ? void 0 : _b.call(this);
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
                this.throwError("Unknown binding provider '" + name + "'.");
            }
        }
        return this._bindingProviderPromise;
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
        const properties = CustomElementUtils.getElementProperties(this.Element);
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
    GetBindingProviderName(element) {
        return null;
    }
    _completeHandler() {
        if (!this.isComplete) {
            if (this.isConnected) {
                this.resolveBusyState();
            }
            this.isComplete = true;
        }
    }
    _walkBindingProviders(element) {
        const cachedProp = '_ojBndgPrv';
        let name = element[cachedProp];
        if (name) {
            return name;
        }
        name = element.getAttribute('data-oj-binding-provider') || this.GetBindingProviderName(element);
        if (!name) {
            const parent = element.parentElement;
            if (parent == null) {
                if (element === document.documentElement) {
                    name = 'knockout';
                }
                else {
                    this.throwError('Cannot determine binding provider for a disconnected subtree.');
                }
            }
            else {
                name = this._walkBindingProviders(parent);
            }
        }
        Object.defineProperty(element, cachedProp, { value: name });
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
                    description: 'Waiting for element ' + trackedElement.localName + ' to be defined.'
                });
                const timer = setInterval(() => {
                    warn('Waiting for element ' + trackedElement.localName + ' to be defined.');
                }, _UPGRADE_MESSAGE_INTERVAL);
                return customElements
                    .whenDefined(trackedElement.localName)
                    .then(() => {
                    resolveElementDefinedBusyState();
                    clearInterval(timer);
                    if (CustomElementUtils.isElementRegistered(trackedElement.tagName)) {
                        return CustomElementUtils.getElementState(trackedElement).GetCreatedPromise();
                    }
                    return null;
                })
                    .catch((error) => {
                    resolveElementDefinedBusyState();
                    clearInterval(timer);
                    throw new Error('Error defining element ' + trackedElement.localName + ' : ' + error);
                });
            }
            else if (CustomElementUtils.isElementRegistered(trackedElement.tagName)) {
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
    _resetStateFlags() {
        this._createdPromise = null;
        this.isComplete = false;
    }
}

export { AttributeUtils, CustomElementUtils, ElementState, ElementUtils };
