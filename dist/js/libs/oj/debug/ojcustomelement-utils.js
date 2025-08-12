/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojcustomelement-registry', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojthemeutils'], function (exports, oj, ojcustomelementRegistry, Context, Logger, ThemeUtils) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    const _SUPPORTED_TYPES_MAP = {};
    /**
     * Element utilities.
     * @class ElementUtils
     * @ignore
     */
    class ElementUtils {
        /**
         * Custom element name check
         * @param {String} localName Element name
         * @return {boolean}
         * @ignore
         */
        static isValidCustomElementName(localName) {
            const reserved = ElementUtils._RESERVED_TAGS.has(localName);
            const validForm = ElementUtils._ELEMENT_NAME_REGEXP.test(localName);
            return !reserved && validForm && !localName.startsWith('oj-bind-', 0);
        }
        /**
         * Returns an object containing the parsed types from the input
         * type string. The return object will return truthy values for the
         * following types: any, boolean, number, string, array, object, null.
         * @param {string} typeStr
         * @return {object}
         * @ignore
         */
        static getSupportedTypes(typeStr) {
            if (!typeStr)
                return {};
            let supportedTypes = _SUPPORTED_TYPES_MAP[typeStr];
            if (!supportedTypes) {
                // Generate the supported types map
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
                        // array<string>
                        supportedTypes.array = 1;
                    }
                    else if (type.indexOf('object<') === 0) {
                        // object<string, number>
                        supportedTypes.object = 1;
                    }
                    else {
                        // Skip checking of other types and just bucket them
                        // all under one category
                        supportedTypes.other = 1;
                    }
                    // eslint-disable-next-line no-plusplus
                    numTypes++;
                });
                supportedTypes.typeCount = numTypes;
                // A union type is only cached with the given type, e.g. 'string|number'
                // so 'number|string' will be a miss in the cache
                _SUPPORTED_TYPES_MAP[lowerTypeStr] = supportedTypes;
            }
            return supportedTypes;
        }
        /**
         * Returns either the passed id or a unique string that can be used for
         * a custom element id.
         * @ignore
         * @param {string} id
         * @return {string}
         * @private
         */
        static getUniqueId(id) {
            if (id) {
                return id;
            }
            const ret = ElementUtils._UNIQUE + ElementUtils._UNIQUE_INCR;
            ElementUtils._UNIQUE_INCR += 1;
            return ret;
        }
        /**
         * Compares two values, returning true if they are equal. Does a deeper check for writeback values
         * because we can't prevent knockout from triggering a second property set with the same values
         * when writing back, but we do want to prevent the addtional update and property changed event.
         * @ignore
         */
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

    /**
     * This list should be kept in sync with GlobalProps from "ojs/ojvcomponent"
     *
     * This list provides a map of global property to attribute names
     * where the attribute name is used for both key and value if no property
     * exists. We start with the list of global attributes found here:
     * https://html.spec.whatwg.org/multipage/dom.html#global-attributes
     * and check those against the Element and HTMLElement specs to determine
     * the property name if different:
     * https://dom.spec.whatwg.org/#interface-element
     * https://html.spec.whatwg.org/multipage/dom.html#htmlelement
     * This list is not exhaustive of all Element and HTMLElement properties.
     * @ignore
     */
    // eslint-disable-next-line no-unused-vars
    const GLOBAL_PROPS = {
        accessKey: 'accesskey',
        autocapitalize: 'autocapitalize',
        autofocus: 'autofocus',
        class: 'class', // We support class instead of className for JSX
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
            // Maintains proper stack trace for where error was thrown (only available on V8)
            if (Error.captureStackTrace) {
                Error.captureStackTrace(this, JetElementError);
            }
            this.name = 'JetElementError';
        }
    }

    const _ARRAY_VALUE_EXP = /^\s*\[[^]*\]\s*$/;
    const _OBJ_VALUE_EXP = /^\s*\{[^]*\}\s*$/;
    // Check for {{..}} and [[..]] at the beginning of strings to avoid matching
    // any usages mid string
    const _ATTR_EXP = /^(?:\{\{)([^]+)(?:\}\})$/;
    const _ATTR_EXP_RO = /^(?:\[\[)([^]+)(?:\]\])$/;
    /**
     * This map includes attribute to property names for
     * all global attributes where the two differ.
     * @ignore
     */
    const _GLOBAL_ATTRS = {};
    Object.keys(GLOBAL_PROPS).forEach(function (prop) {
        const attr = GLOBAL_PROPS[prop];
        if (prop !== attr) {
            _GLOBAL_ATTRS[attr] = prop;
        }
    });
    /**
     * @ignore
     * @private
     */
    class AttributeUtils {
        /**
         * @ignore
         * @return {{expr: (null|string), downstreamOnly: boolean}}
         * @private
         */
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
            // TODO handle complex properties
            try {
                return AttributeUtils.coerceValue(elem, attr, val, propMeta.type);
            }
            catch (err) {
                throw new JetElementError(elem, `Error while parsing parsing attribute ${attr}. ${err.stack || err}`);
            }
        }
        /**
         * Parses attribute values to the specified metadata type. Throws
         * an error if the value cannot be parsed to the metadata type
         * or if no type was provided.
         * @ignore
         * @param {string} tagName lowercase tag name
         * @param {string} attr attribute
         * @param {string} value attribute value
         * @param {string} type property type
         * @param {string} [id] optional element Id
         * @return {any} coerced value
         * @private
         */
        static parseAttributeValue(tagName, attr, value, type, id = null) {
            if (!type) {
                throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${id}'. \
        This attribute only supports data bound values. Check the API doc for supported types`);
            }
            // We only support primitive types and JSON objects for coerced properties.
            const supportedTypes = ElementUtils.getSupportedTypes(type);
            // The below checks ignore the couble {{}} [[]] cases since expression checking occurs
            // before attribute value coercion
            // Tests to see if the value starts and ends with matched [...] ignoring whitespace
            const isValueArray = _ARRAY_VALUE_EXP.test(value);
            // Tests to see if the value starts and ends with matched {...} ignoring whitespace
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
                // If the supported type(s) contain string or any we won't know
                // whether to coerce the type further, e.g. if boolean is also supported
                // so we will always return a string. For the non string type, data binding
                // needs to be used instead.
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
        /**
         * Parses boolean attribute values. Throws
         * an error if the value cannot be parsed.
         * @ignore
         * @param {string} tagName lowercase tag name
         * @param {string} attr attribute
         * @param {string} value attribute value
         * @param {string} type property type
         * @param {string} [id] optional element Id
         * @return {boolean} coerced value
         * @private
         */
        static parseBooleanValue(tagName, attr, value, type, id) {
            // Boolean attributes are considered true if the attribute is:
            // 1) Set to the empty string
            // 2) Present in the DOM without a value assignment
            // 3) Set to the 'true' string
            // 4) Set to the case-insensitive attribute name
            // Boolean values are considered false if set to the false string.
            // An error is thrown for all other values and the attribute value will not be set.
            if (value == null || value === 'true' || value === '' || value.toLowerCase() === attr) {
                return true;
            }
            else if (value === 'false') {
                return false;
            }
            throw new Error(`Unable to parse ${attr}='${value}' for ${tagName} with id '${id}' to a ${type}.`);
        }
        /**
         * Parses attribute values to the specified metadata type. Throws
         * an error if the value cannot be parsed to the metadata type
         * or if no type was provided.
         * @ignore
         * @param {Element} elem The element whose value we are parsing
         * @param {string} attr attribute
         * @param {string} value attribute value
         * @param {string} type property type
         * @return {any} coerced value
         * @private
         */
        static coerceValue(elem, attr, value, type) {
            const tagName = elem.tagName.toLowerCase();
            return AttributeUtils.parseAttributeValue(tagName, attr, value, type, elem.id);
        }
        /**
         * Parses boolean attribute values. Throws
         * an error if the value cannot be parsed.
         * @ignore
         * @param {Element} elem The element whose value we are parsing
         * @param {string} attr attribute
         * @param {string} value attribute value
         * @param {string} type property type
         * @return {boolean} coerced value
         * @private
         */
        static coerceBooleanValue(elem, attr, value, type) {
            return AttributeUtils.parseBooleanValue(elem.tagName.toLowerCase(), attr, value, type, elem.id);
        }
        /**
         * Returns true if the given property name maps to a global attribute.
         * For global attributes with no property getter, this method will check
         * the attribute name and handle data- and aria- dash cases.
         * @param {string} prop The property name to check
         * @return {boolean}
         * @private
         * @ignore
         */
        static isGlobalOrData(prop) {
            // TODO: watch out for performance of hasOwnProperty given how often we expect isGlobal to be called
            return (Object.prototype.hasOwnProperty.call(GLOBAL_PROPS, prop) ||
                prop.startsWith('data-') ||
                prop.startsWith('aria-'));
        }
        /**
         * This method assumes that the given property name has already been confirmed to
         * be global and will return the attribute syntax or the original value which could be
         * the global attribute name that does not have a property equivalent, e.g.
         * data- or aria-.
         * @ignore
         * @param {string} prop The property name to check
         * @return {string}
         * @private
         */
        static getGlobalAttrForProp(prop) {
            return GLOBAL_PROPS[prop] || prop;
        }
        /**
         * This method assumes that the given attribute name has already been confirmed
         * to be global and will return the attribute syntax or the original value which could be
         * the global attribute name that does not have a property equivalent, e.g.
         * data- or aria-.
         * @ignore
         * @param {string} attr The attribute name to check
         * @return {string}
         * @private
         */
        static getGlobalPropForAttr(attr) {
            return _GLOBAL_ATTRS[attr] || attr;
        }
        /**
         * The purpose of this method is to get a property name that should be used
         * for retrieving a property value.
         * The method is similar to AttributeUtils.getGlobalPropForAttr() with one difference - it handles
         * 'contenteditable' attribute as a special case. The value type for the property is 'string',
         * but it is defined as 'boolean' in preact.JSX.HTMLAttributes. Using 'isContentEditable' name
         * as a replacement gives us the correct boolean value for the 'contentEditable' property.
         * @ignore
         * @param {string} attr The attribute name to check
         * @returns {string}
         */
        static getGlobalValuePropForAttr(attr) {
            if (attr.toLowerCase() === 'contenteditable') {
                return 'isContentEditable';
            }
            return AttributeUtils.getGlobalPropForAttr(attr);
        }
    }
    /**
     * @ignore
     * @param {string} attr attribute name
     * @return {string} property name
     * @private
     */
    AttributeUtils.attributeToPropertyName = cacheHelper.bind(null, (attr) => attr.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase()));
    /**
     * @ignore
     * @param {string} name property name
     * @return {string} attribute name
     * @private
     */
    AttributeUtils.propertyNameToAttribute = cacheHelper.bind(null, (name) => name.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`));
    /**
     * @ignore
     * @param {string} type event type (e.g. ojBeforeExpand)
     * @return {string} event listener property name (e.g. onOjBeforeExpand)
     * @private
     */
    AttributeUtils.eventTypeToEventListenerProperty = cacheHelper.bind(null, (type) => 'on' + type.substr(0, 1).toUpperCase() + type.substr(1));
    AttributeUtils.isEventListenerProperty = cacheHelper.bind(null, (property) => /^on[A-Z]/.test(property));
    AttributeUtils.isEventListenerAttr = cacheHelper.bind(null, (attr) => /^on-[a-z]/.test(attr));
    /**
     * @ignore
     * @param {string} property event listener property name (e.g. onOjBeforeExpand)
     * @return {string|null} event type (e.g. ojBeforeExpand)
     * @private
     */
    AttributeUtils.eventListenerPropertyToEventType = cacheHelper.bind(null, (property) => property.substr(2, 1).toLowerCase() + property.substr(3));
    /**
     * @ignore
     * @param {string} name property name (e.g. expanded)
     * @return {string} change event type (e.g. expandedChanged)
     * @private
     */
    AttributeUtils.propertyNameToChangeEventType = cacheHelper.bind(null, (name) => `${name}Changed`);
    /**
     * @ignore
     * @param {string} prop Property name (e.g. value)
     * @return {string} property changed callback (e.g. onValueChanged)
     * @private
     */
    AttributeUtils.propertyNameToChangedCallback = cacheHelper.bind(null, (prop) => `on${prop[0].toUpperCase()}${prop.substr(1)}Changed`);
    /**
     * @ignore
     * @param {string} trigger event trigger (e.g. beforeExpand)
     * @return {string} event type (e.g. ojBeforeExpand)
     * @private
     */
    AttributeUtils.eventTriggerToEventType = cacheHelper.bind(null, (trigger) => `oj${trigger.substr(0, 1).toUpperCase()}${trigger.substr(1)}`);
    /**
     * @ignore
     * @param {string} attr attribute for a custom event (e.g. on-value-changed)
     * @return {string} custom event in the form of on[eventType] - Preact style (e.g. onvalueChanged)
     * @private
     */
    AttributeUtils.eventAttrToPreactPropertyName = cacheHelper.bind(null, (attr) => {
        const capitalize = (chunk) => chunk.charAt(0).toUpperCase() + chunk.substr(1);
        const chunks = attr.toLowerCase().split('-');
        return chunks.reduce((acc, curr, index) => {
            return index > 1 ? acc + capitalize(curr) : acc + curr;
        }, '');
    });
    function cacheHelper(converter, key) {
        // Check for cache stored on the converter function and create one
        // if not found
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

    /**
     * Utility class with methods used to convert oj-bind-[element] into comment nodes.
     * The methods are shared between oj-knockout-base and ojtemplateengine-utils modules.
     * @ignore
     * @private
     */
    class KoBindingUtils {
        /**
         * Creates ko handler for oj-bind-fo-each element.
         * @param node
         * @returns
         * @ignore
         * @private
         */
        static createBindForEachHandlerStr(node) {
            const dataValue = node.getAttribute('data');
            let dataExp = AttributeUtils.getExpressionInfo(dataValue).expr;
            if (!dataExp) {
                try {
                    const literalValue = JSON.parse(dataValue);
                    if (Array.isArray(literalValue)) {
                        dataExp = dataValue;
                    }
                    else {
                        throw new Error(`Literal value must be an array, actual value: ${dataValue}`);
                    }
                }
                catch (e) {
                    throw new Error(`The value on the oj-bind-for-each data attribute should be either a JSON array or an expression : ${e}`);
                }
            }
            if (!dataExp) {
                return undefined;
            }
            const asExp = KoBindingUtils.getExpressionForAttr(node, 'as', true);
            const closing = asExp ? `,as:${asExp}}` : '}';
            return `ko _ojBindForEach_:{data:${dataExp}${closing}`;
        }
        /**
         * Builds a string for a wrapper comment around ko comment node
         * with all of the attribute info that was on the original DOM node.
         * The wrapper comment is used to help identifying oj-bind-[element] that
         * was converted into a comment node.
         * @param node
         * @returns
         * @ignore
         * @private
         */
        static getNodeReplacementCommentStr(node) {
            var commentText = node.tagName.toLowerCase();
            var attrs = node.attributes;
            for (var i = 0; i < attrs.length; i++) {
                // jsperf says string concat is faster than array join, but
                // varies across browsers whether text += or text = text + is faster
                // the below method is fastest on Chrome and not bad on FF
                var attr = attrs[i];
                commentText += ' ';
                commentText += attr.name;
                commentText += "='";
                commentText += attr.value;
                commentText += "'";
            }
            return commentText;
        }
        /**
         * Gets an expression for the specified attribute;
         * stringifies it if it is necessary.
         * @param node
         * @param attr
         * @param stringify
         * @returns
         * @ignore
         * @private
         */
        static getExpressionForAttr(node, attr, stringify) {
            const attrValue = node.getAttribute(attr);
            if (attrValue != null) {
                let exp = AttributeUtils.getExpressionInfo(attrValue).expr;
                if (exp == null) {
                    exp = stringify ? `'${attrValue}'` : attrValue;
                }
                return exp;
            }
            return null;
        }
    }

    const CHILD_BINDING_PROVIDER = Symbol('childBindingProvider');
    const CACHED_BINDING_PROVIDER = Symbol('cachedBindingProvider');
    const EMPTY_SET = new Set();
    const _OJ_SUBTREE_HIDDEN_CLASS = 'oj-subtree-hidden';
    const _OJ_PENDING_SUBTREE_HIDDEN_CLASS = 'oj-pending-subtree-hidden';
    const _OJ_SLOT_WHITESPACE = Symbol('ojSlotWhitespace');
    /**
     * Utility class used with JET custom elements.
     * @ignore
     */
    class CustomElementUtils {
        /**
         * Notifies JET framework that a subtree possibly containing JET components is no longer hidden with display:none style
         * This method should be used when subtree shown travsersal is initiated outside of legacy jQueryUI widgets
         * @param elem The element at the root of the subtree shown traversal
         * @param initialRender true if a component performs subtree shown traversal during its intial rendering
         * @param {boolean} skipDeferActivation true if oj-defer elements should not be activated during subtree shown traversal.
         * We ony want to perform oj-defer activation when a component starts displaying a subtree FOR THE FIRST TIME
         * (a collapsible is expanded, a tab is revealed, etc...) For cases when we are temporarily hiding the already-displayed
         * content and are then making it visible again, we do not want to activate oj-defer.
         * @ignore
         */
        static subtreeShown(elem, initialRender, skipDeferActivation) {
            // legacySubtreeShownOnceCB fixes up resize listeners
            CustomElementUtils._legacySubtreeShownOnceCB?.(elem, initialRender);
            _unmarkSubtreeHidden(elem);
            const legacyShowCB = CustomElementUtils._legacySubtreeShownInstanceCB;
            const instanceCB = legacyShowCB
                ? _executeWithSlotRelocationOn((elem) => legacyShowCB(elem, initialRender))
                : null;
            _applyHideShowToComponents(elem, instanceCB, skipDeferActivation ? null : _ojDeferCallback);
        }
        /**
         * Returns a string including the element tag name and id for use in error messages and logging.
         * @param element The element to get the information for.
         * @ignore
         */
        static getElementInfo(element) {
            if (element) {
                return `${element.tagName.toLowerCase()} with id '${element.id}'`;
            }
            return '';
        }
        /**
         * Returns an instance of ElementState for a given element within the case insensitive
         * JET custom element registry or null if not found.
         * @param element
         */
        static getElementState(element) {
            let state = element[CustomElementUtils._ELEMENT_STATE_KEY];
            if (!state && ojcustomelementRegistry.isElementRegistered(element.tagName)) {
                const StateClass = ojcustomelementRegistry.getElementRegistration(element.tagName).stateClass;
                state = new StateClass(element);
                Object.defineProperty(element, CustomElementUtils._ELEMENT_STATE_KEY, { value: state });
            }
            return state ?? null;
        }
        /**
         * Returns an instance of BaseCustomElementBridge for a given element
         * within the case insensitive JET custom element registry or null if not found.
         * @param element
         */
        static getElementBridge(element) {
            let bridge = element[CustomElementUtils._ELEMENT_BRIDGE_KEY];
            if (bridge === undefined && ojcustomelementRegistry.isElementRegistered(element.tagName)) {
                bridge = null;
                const bridgeProto = ojcustomelementRegistry.getElementRegistration(element.tagName).bridgeProto;
                if (bridgeProto !== undefined) {
                    bridge = Object.create(bridgeProto);
                    const descriptor = ojcustomelementRegistry.getElementDescriptor(element.tagName);
                    bridge.initializeBridge(element, descriptor);
                }
                Object.defineProperty(element, CustomElementUtils._ELEMENT_BRIDGE_KEY, { value: bridge });
            }
            return bridge ?? null;
        }
        /**
         * Returns the slot map of slot name to slotted child elements for a given custom element.
         * If the given element has no children, this method returns an empty object.
         * Note that the default slot name is mapped to the empty string.
         * @param element
         */
        static getSlotMap(element) {
            const slotMap = {};
            const childNodeList = element.childNodes;
            const metadata = childNodeList.length > 0 ? ojcustomelementRegistry.getMetadata(element.localName) : null;
            for (let i = 0; i < childNodeList.length; i++) {
                const child = childNodeList[i];
                // Only assign Text and Element nodes to a slot
                if (CustomElementUtils.isSlotable(child)) {
                    const slot = CustomElementUtils.getSlotAssignment(child);
                    if (!slotMap[slot]) {
                        slotMap[slot] = [];
                    }
                    // Create implict Context for slots that have 'implicitBusyContext=true' in their metadata.
                    //
                    // Note that it is possible that a busy state will be registered from the slot
                    // subtree BEFEORE the slot is distributed. In that case, the implicit context will
                    // be added by the Context.getContext() implementation, and the busy state will still
                    // be captured accordingly. Calling _possiblyApplyImplicitContext() after that will
                    // still add a data-oj-context attribute, but it won't affect anything.
                    CustomElementUtils._possiblyApplyImplicitContext(child, slot, metadata);
                    slotMap[slot].push(child);
                    // Set a binding provider for the slot subtree. See details in the method description.
                    child[CACHED_BINDING_PROVIDER] = CustomElementUtils._getBindingProviderTypeForSlot(element, child);
                }
            }
            return slotMap;
        }
        /**
         * Returns the slot that the node should get assigned to.
         * Note that the default slot name is mapped to the empty string.
         * @param node
         */
        static getSlotAssignment(node) {
            // Text nodes and elements with no slot attribute map to the default slot.
            // __oj_slots is the slot attribute saved from an oj-bind-slot or oj-bind-template-slot element
            // Remember that the slot name can be the empty string so we should do a null check instead of just using || directly
            const slot = node['__oj_slots'] != null
                ? node['__oj_slots']
                : node.getAttribute && node.getAttribute('slot');
            if (!slot)
                return '';
            return slot;
        }
        /**
         * Returns true if an element is slot assignable.
         * @param node
         */
        static isSlotable(node) {
            // Ignore text nodes that only contain whitespace
            const isSlotable = node.nodeType === 1 || (node.nodeType === 3 && !!node.nodeValue.trim());
            if (!isSlotable) {
                // Mark the node as a part of a slot to offset preact behavior
                // during rerender when the slot content is reparented back.
                node[_OJ_SLOT_WHITESPACE] = true;
            }
            return isSlotable;
        }
        /**
         * Returns the property value for an element, used by the WebElement test adapters.
         * For most cases, this method just returns the property directly from the element.
         * For VComponent-first custom elements, this method returns the property from the
         * component instance's props variable.
         */
        static getElementProperty(element, property) {
            // TODO: May want to refactor once we design out additional test related APIs
            if (ojcustomelementRegistry.isElementRegistered(element.tagName)) {
                let vInst = element[CustomElementUtils.VCOMP_INSTANCE];
                // For VComponent-first instances, we need to get the value from the props
                if (vInst) {
                    return CustomElementUtils.getPropertyValue(vInst.props, property);
                }
                // For all other component types, we can just use the element getProperty() method
                return element.getProperty(property);
            }
            return element[property];
        }
        /**
         * Retrieves the property or subproperty value from the given props object,
         * walking complex properties to return the nested value as needed
         * @param allProps Either a property bag or the element to retrieve properties from
         * @param property The property to retrieve, which can include dot notation for complex properties
         */
        static getPropertyValue(allProps, property) {
            let propObj = allProps;
            const propPath = property.split('.');
            try {
                propPath.forEach((subprop) => (propObj = propObj[subprop]));
            }
            catch {
                // We return undefined for invalid properties, so return undefined if an
                // invalid complex property path is given
                return undefined;
            }
            return propObj;
        }
        /**
         * Sets a flag used by our custom element appendChild and insertBefore overrides
         * to determine whether we can relocate a child node. This flag is used to work
         * around preact .
         * @param allow True if an appendChild/inertB
         */
        static allowSlotRelocation(allow) {
            CustomElementUtils._ALLOW_RELOCATION_COUNT += allow ? 1 : -1;
        }
        /**
         * A check used by our custom element appendChild and insertBefore overrides
         * to determine whether we can relocate a child node. This check is used to work
         * around preact .
         * @param element
         * @param node
         */
        static canRelocateNode(element, node) {
            const state = CustomElementUtils.getElementState(element);
            const slotMap = state.getSlotMap();
            // If no SlotMap has been cached, the component has not rendered
            // for the first time yet so we can safely relocate nodes
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
        /**
         * Cleans ko bindings from an element if they were applied on the element;
         * noop otherwise.
         * @param element
         */
        static cleanComponentBindings(element) {
            CustomElementUtils.getElementState(element)?.getBindingProviderCleanNode()(element);
        }
        /**
         * Returns a Set containing the individual classNames specified in the (possibly null) passed-in string
         * @param strClass
         * @returns
         */
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
        /**
         * Get binding provider type for slot elements.
         * The provider should match the provider of the parent element unless
         * the slot child has been redistributed and already has CACHED_BINDING_PROVIDER property or
         * the provider is explicitly set with 'data-oj-binding-provider' attribute.
         * The method is added to support conditional rendering of composite components inside VComponent.
         * See JET-57970 for details.
         * @param element
         * @param child
         * @returns
         */
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
        /**
         * @ignore
         */
        static registerLegacySubtreeCallbacks(instanceShown, shownOnce, instanceHidden) {
            CustomElementUtils._legacySubtreeShownInstanceCB = instanceShown;
            CustomElementUtils._legacySubtreeShownOnceCB = shownOnce;
            CustomElementUtils._legacySubtreeHiddenInstanceCB = instanceHidden;
        }
        /**
         * Returns the coerced attribute value using a custom parse function or the framework default.
         * @ignore
         */
        static parseAttrValue(elem, attr, prop, val, metadata) {
            if (val == null) {
                return val;
            }
            function _coerceVal(value) {
                return AttributeUtils.attributeToPropertyValue(elem, attr, value, metadata);
            }
            var parseFunction = ojcustomelementRegistry.getElementDescriptor(elem.tagName)['parseFunction'];
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
    /**
     * Notifies JET framework that a subtree possibly containing JET components is being hidden with display:none style
     * This method should be used when subtree hidden travsersal is initiated outside of legacy jQueryUI widgets
     * @param elem The element at the root of the subtree hidden traversal
     * @ignore
     */
    CustomElementUtils.subtreeHidden = function (elem) {
        const legacyHideCB = CustomElementUtils._legacySubtreeHiddenInstanceCB;
        const instanceCB = legacyHideCB ? _executeWithSlotRelocationOn(legacyHideCB) : null;
        _applyHideShowToComponents(elem, instanceCB, null);
        _markSubtreeHidden(elem);
    };
    // Non-member function helpers
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
        // Detect hidden without forcing a layout.
        function isHidden(elem) {
            let curr = elem;
            while (curr) {
                if (curr.nodeType === Node.DOCUMENT_NODE) {
                    return false; // Walked up to document.  Not hidden
                }
                if (curr.nodeType === Node.ELEMENT_NODE &&
                    curr.classList.contains(_OJ_SUBTREE_HIDDEN_CLASS)) {
                    return true;
                }
                curr = curr.parentNode;
            }
            return true; // Didn't find document, so it must be detached and therefore hidden.
        }
        /**
         * Both node lists must be in document order.
         * Return new array containing nodes in 'allNodes' that are not in 'hiddenNodes'
         * @private
         */
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
            // Create selectors for jquery components and oj-defer as needed.
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
                // treat oj-defer nodes with the _OJ_SUBTREE_HIDDEN_CLASS class on them
                // the same way as the oj-defer nodes contained by an element with that class
                hiddenSelectors.push(`${_deferTag}.${_OJ_SUBTREE_HIDDEN_CLASS}`);
            }
            // Assemble a selector that gets all matches and the subset that are hidden
            const selector = selectors.join(',');
            const hiddenSelector = hiddenSelectors.join(',');
            // Fetch all matching elements and those that are hidden.
            // Use the second list to filter out hidden elements.
            const allNodes = rootElem.querySelectorAll(selector);
            const hiddenNodes = rootElem.querySelectorAll(hiddenSelector);
            var shownNodes = filterHidden(allNodes, hiddenNodes);
            shownNodes.forEach((el) => processFunc(el));
        }
    }

    /**
     * Handles instantiating and tracking the component lifecycle for a custom element.
     * A specific component model implementation may have a subclass with special logic.
     * See the ComponentState enum for descriptions of the component lifecycle.
     * @ignore
     */
    class ElementState {
        constructor(element) {
            // Set of properties that have been updated so we can check attribute
            // changes against to get the actual value since we don't reflect property sets back
            // to the DOM
            this.dirtyProps = new Set();
            // Keeps track of where the compnent is in the creation lifecycle
            this._componentState = ComponentState.WaitingToCreate;
            this._outerClasses = new Set();
            this.Element = element;
        }
        /**
         * Starts the component creation cycle. Called by the custom element when it is
         * connected to the DOM and not in a terminal state.
         */
        startCreationCycle() {
            if (this._isInErrorState())
                return;
            // If the component is being created for the first time, update state the state,
            // otherwise pickup where the component last left off. Note that the component state
            // could be at ApplyingBindings before it's connected to the DOM so we need to also check
            // if the preCreatedPromise has ever been created
            if (this._preCreatedPromise == null ||
                this._componentState === ComponentState.WaitingToCreate) {
                this._updateComponentState(ComponentState.Creating);
            }
            this._registerBusyState();
        }
        /**
         * Used to resolve busy states when the custom element is disconnected from the DOM before the
         * component has been created. Called by the custom element when it is
         * disconnected to the DOM and not in a terminal state.
         */
        pauseCreationCycle() {
            // If the component creation did not complete (either successfully or unsuccessfully),
            // resolve the busy state and save where the component last left off
            this._resolveBusyState();
        }
        /**
         * Resets the creation cycle so the component can be recreated as is the case for
         * VComponents when disconnected and reconnected.
         */
        resetCreationCycle() {
            // This is currently only used for VComponents.
            // No other component model re-creates the component on reconnect
            this._updateComponentState(ComponentState.WaitingToCreate);
            // Reset the creation promises so that the ComponentState gets updated properly
            this._bindingProviderPromise = null;
            this._preCreatedPromise = null;
            this._createdPromise = null;
        }
        /**
         * Returns true if the component has successfully been created and has
         * the oj-complete class applied.
         */
        isComplete() {
            return this._componentState === ComponentState.Complete;
        }
        /**
         * Returns true if the component creation cycle has already started.
         */
        isCreating() {
            return this._componentState === ComponentState.Creating;
        }
        /**
         * Returns true if the component has succcessfully passed
         * create component callback invocation or reached the complete
         * state.
         */
        isPostCreateCallbackOrComplete() {
            return this._componentState === ComponentState.PostCreateCallback || this.isComplete();
        }
        /**
         * Returns true if the component creation cycle is not in a terminal state and
         * not waiting to create. This helper is only used by the BaseCustomElementBridge
         * as there's an ordering issue in some components that prevent us from initializing
         * properties from DOM and playing back properties in the same callback as rendering
         * the component.
         */
        canHandleAttributes() {
            return !this._isInErrorState() && this._componentState !== ComponentState.WaitingToCreate;
        }
        /**
         * Indicates that bindings are being applied and called by the CustomElementBinding class.
         * Note that this could be called while the component is waiting to be created as in the case
         * of an oj-bind-for-each.
         */
        beginApplyingBindings() {
            // The component may not have a binding provider, but its parent may have a knockout
            // binding provider which could trigger this call after the component is complete
            if (!this.isComplete()) {
                // skip walking binding providers and set directly to knockout
                this._bindingProviderType = 'knockout';
                this._updateComponentState(ComponentState.ApplyingBindings);
            }
        }
        /**
         * Returns true if the custom element should accept property sets vs saving
         * them to be played back after data bound attribute values are resolved.
         */
        allowPropertySets() {
            // We can accept property sets w/o saving them to an early property sets queue
            // when we first initialize properties on connect, when applying bindings, and then
            // after bindings are applied and the component is created
            return (this._componentState === ComponentState.Creating ||
                this._componentState === ComponentState.ApplyingBindings ||
                this._componentState === ComponentState.BindingsApplied ||
                this._componentState === ComponentState.PostCreateCallback ||
                this._componentState === ComponentState.Complete);
        }
        /**
         * Returns true if the custom element should fire property changed events.
         * Property changed events are not fired for initial custom element values set
         * via attributes.
         */
        allowPropertyChangedEvents() {
            // We should fire property changed events for property sets after component is created
            return (this._componentState === ComponentState.BindingsApplied ||
                this._componentState === ComponentState.PostCreateCallback ||
                this._componentState === ComponentState.Complete);
        }
        /**
         * Returns the component child tracking option: 'none', 'immediate', or 'nearestCustomElement'.
         */
        getTrackChildrenOption() {
            // This setting is involved in tracking child elements used for slots
            // for VComponents created as custom elements. The method is called when the
            // element is connected to the DOM, but it is not created yet.
            // Tracking children is prevented for vcomp-first elements, since such elements are
            // rendered first and children are already passed to them through props.
            // The getTrackChildrenOption() is called on mount operation for already rendered component.
            // If tracking is not prevented at this point, the component would wait for its internal content.
            const metadata = ojcustomelementRegistry.getElementDescriptor(this.Element.tagName).metadata;
            return metadata?.extension?.['_TRACK_CHILDREN'] ?? 'none';
        }
        /**
         * Sets a callback to instantiate the component. The callback will be
         * called after the chain of promises for the binding provider,
         * child tracking, and any other component specific
         * (e.g. template engine promise) logic are resolved. The callback
         * should return a Promise if the component is created asynchronously
         * @param createComponentCallback
         */
        setCreateCallback(createComponentCallback) {
            // If we are in an error, e.g. bindings have been disposed, do not
            // try to start component creation
            if (this._isInErrorState())
                return;
            this._updateComponentState(ComponentState.WaitingForBindings);
            // Cache the pre create Promise for cases
            // where the component is removed and later reattached to the
            // DOM and we need to recreate the component (e.g. Preact Component)
            if (!this._preCreatedPromise) {
                this._preCreatedPromise = this.GetPreCreatedPromise();
            }
            // The createdPromise is used for child tracking and does not neet to wait on the
            // oj-complete class to be applied, just for the component to have been created so
            // properties can be inspected
            this._createdPromise = this._preCreatedPromise.then(() => {
                // Bindings may have been disposed causing the component to end up in a
                // error state after the creation process has begun so we need to check here as well
                if (!this._isInErrorState()) {
                    const createVal = createComponentCallback();
                    this._updateComponentState(ComponentState.PostCreateCallback);
                    return createVal;
                }
                return Promise.reject();
            });
            // When the created promise resolves/rejects we will resolve the busy state and set a class
            this._createdPromise.then(() => {
                this._updateComponentState(ComponentState.Complete);
            }, (error) => {
                this._updateComponentState(ComponentState.Incomplete);
                // If the binding provider is disposed, we will reject the binding provider promise,
                // but not throw an error so check to see if one was passed before rethrowing.
                if (error)
                    throw error;
            });
        }
        /**
         * Stores a callback that will be invoked when bindings are disposed for an
         * already-created component
         * @param callback
         */
        setBindingsDisposedCallback(callback) {
            this._disposedCallback = callback;
        }
        /**
         * Resolves the binding provider Promise.
         * @param provider
         */
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
        /**
         * Rejects the binding provider Promise.
         * @param message
         */
        rejectBindingProvider(error) {
            if (this._rejectBindingProviderCallback) {
                this._rejectBindingProviderCallback(error);
                this._resolveBindingProviderCallback = null;
                this._rejectBindingProviderCallback = null;
            }
        }
        /**
         * Disposes a binding provider
         */
        disposeBindingProvider() {
            if (!this.isComplete()) {
                // The reject callback will check to see if the binding provider promise has previously been
                // rejected or resolved before rejecting since disposal can occur after the binding
                // provider has been resolved
                this.rejectBindingProvider();
                this._updateComponentState(ComponentState.BindingsDisposed);
            }
            else {
                this._disposedCallback?.();
            }
        }
        /**
         * Sets a callback that's called right before the binding
         * provider is resolved.
         * @param callback
         */
        setBindingProviderCallback(callback) {
            this._bindingProviderCallback = callback;
        }
        /**
         * Returns the binding provider Promise
         */
        getBindingProviderPromise() {
            const bpType = this.getBindingProviderType();
            if (!this._bindingProviderPromise) {
                // This call is totally unrelated to everything, but it's the best
                // chokepoint we have to validate the CSS version against the JET version
                // at a point where we should be guaranteed that the CSS has been loaded.
                ThemeUtils.verifyThemeVersion();
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
        /**
         * Returns the binding provider. This method should be called after GetPreCreatedPromise() is resolved.
         */
        getBindingProvider() {
            return this._bindingProvider;
        }
        /**
         * Returns the binding provider type, either 'none', 'knockout', or preact
         */
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
        /**
         * Returns binding provider's clean node function
         */
        getBindingProviderCleanNode() {
            return this._bpClean || ElementState._NOOP;
        }
        /**
         * Returns the label or descriptive text for Tracing.
         */
        getDescriptiveText() {
            let text = this.GetDescriptiveValue('aria-label') ||
                this.GetDescriptiveValue('title') ||
                this.GetDescriptiveLabelByValue('labelled-by') ||
                this.GetDescriptiveValue('label-hint') ||
                this.GetDescriptiveLabelByValue('aria-labelledby');
            if (text) {
                // Normalize whitespace to a single space
                text = text.trim().replace(/\s+/g, ' ');
            }
            else {
                text = '';
            }
            return text;
        }
        /**
         * Gets the stored slot map, creating one if the flag is specified.
         */
        getSlotMap(bCreate) {
            if (!this._slotMap && bCreate) {
                this._slotMap = CustomElementUtils.getSlotMap(this.Element);
            }
            return this._slotMap;
        }
        /**
         * Returns a set of the nodes representing top-level slot content
         * Guaranteed to be called after the slotMap has been created + stored
         */
        getSlotSet() {
            if (!this._slotSet) {
                // Cache a set of slot map nodes for faster look up.
                // Slot nodes should not be changing after initial render so this
                // should be safe.
                const keys = Object.keys(this._slotMap);
                let nodes = [];
                keys.forEach((key) => (nodes = nodes.concat(this._slotMap[key])));
                this._slotSet = new Set(nodes);
            }
            return this._slotSet;
        }
        /**
         * Updates the element classList based on the specified set of outer classes (i.e. classes
         * specified by the application or parent component)
         * @param outerClasses
         */
        setOuterClasses(outerClasses) {
            this.PatchClasses(this._outerClasses, outerClasses);
            this._outerClasses = outerClasses;
        }
        /**
         * Diffs two Sets of styleClass strings and updates the element classList accordingly
         * @param oldClasses
         * @param newClasses
         */
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
        /**
         * Returns a Promise that will be resolved when the component has been initialized
         * and property values can be inspected. Note that oj-complete/oj-incomplete classes
         * will have not yet be added to the custom element.
         * @return {Promise}
         */
        GetCreatedPromise() {
            return this._createdPromise;
        }
        /**
         * Returns a Promise that resolves when it's safe to call the create component callback.
         */
        GetPreCreatedPromise() {
            let preCreatePromise = this.getBindingProviderPromise();
            const trackOption = this.getTrackChildrenOption();
            if (trackOption !== 'none') {
                // this will return a Promise that will get automatically chained to the binding provider Promise
                preCreatePromise = preCreatePromise.then((bindingProvider) => {
                    return this._getTrackedChildrenPromises(bindingProvider);
                });
            }
            return preCreatePromise;
        }
        /**
         * Returns true if the given attribute is one that is moved
         * from the root element to a child element.
         * @param attrName
         */
        IsTransferAttribute(attrName) {
            return false;
        }
        /**
         * Returns the descriptive text of an attribute
         * @param attrName
         */
        GetDescriptiveValue(attrName) {
            const propName = AttributeUtils.attributeToPropertyName(attrName);
            const properties = ojcustomelementRegistry.getElementProperties(this.Element);
            // Get the descriptive value from:
            // 1. If the attribute is a declared property of the component, return the property
            // 2. If the atrribite gets moved off of the root element, fetch it from the new location
            // 3. Otherwise just return the attribute value.
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
        /**
         * Returns the descritive text for a transfer attribute
         * @param attrName
         */
        GetDescriptiveTransferAttributeValue(attrName) {
            return '';
        }
        /**
         * Returns the label value of a "labelled-by" like attribute
         * @param attrName
         */
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
        /**
         * Updates the internal component state
         * @param state The new state
         */
        _updateComponentState(state) {
            // When bindings are disposed, the component is in a terminal,
            // error state that cannot be reset when disconnected/reconnected
            if (this._componentState !== ComponentState.BindingsDisposed) {
                switch (state) {
                    case ComponentState.WaitingToCreate:
                        // Reset flags so we can recreate the component
                        this.Element.classList.remove('oj-complete');
                        this._createdPromise = null;
                        break;
                    case ComponentState.Complete:
                        // Add marker class to unhide components
                        this.Element.classList.add('oj-complete');
                        this._resolveBusyState();
                        break;
                    case ComponentState.BindingsDisposed:
                    case ComponentState.Incomplete:
                        // Add marker class to mark that there was an error during upgrade so consumers like
                        // VBCS can apply their own styling to incorrectly setup custom elements.
                        this.Element.classList.add('oj-incomplete');
                        this._resolveBusyState();
                        break;
                    default:
                        break;
                }
                this._componentState = state;
            }
        }
        /**
         * Updates state to indicate that bindings have been applied and call
         * the binding provider callback as needed.
         */
        _bindingsApplied() {
            this._updateComponentState(ComponentState.BindingsApplied);
            this._bindingProviderCallback?.();
        }
        /**
         * Registers a busy state for while the component is waiting to be created.
         */
        _registerBusyState() {
            const busyContext = Context.getContext(this.Element).getBusyContext();
            if (this._resolveCreatedBusyState) {
                throw new JetElementError(this.Element, 'Registering busy state before previous state is resolved.');
            }
            this._resolveCreatedBusyState = busyContext.addBusyState({
                description: CustomElementUtils.getElementInfo(this.Element) + ' is being upgraded.'
            });
        }
        /**
         * Resolves the busy state stashed while the component is waiting to be created.
         */
        _resolveBusyState() {
            // If the component is disconnected, the busy state
            // must be already resolved
            if (this._resolveCreatedBusyState) {
                this._resolveCreatedBusyState();
                this._resolveCreatedBusyState = null;
            }
        }
        /**
         * Walks down the DOM tree looking for the data-oj-use-ko attribute on template that might be set
         * by VTemplateEngine on a nested template.
         * @param element The current element whose useKoFlag is being asked for
         * @returns
         */
        static _findKoUseFlag(element) {
            const template = element.querySelector(':scope > template[data-oj-use-ko]');
            return !!template;
        }
        /**
         * Walks up the DOM tree looking for the closest binding provider.
         * @param element The current element whose binding provider is being asked for
         * @param startElement The element that began this recursive walk, used for reporting errors
         */
        static _walkBindingProviders(element, startElement = element) {
            // If not defined on the current node, find the binding provider by walking up the
            // DOM tree. The binding provider could be set for the following cases:
            // 1) The current element could have an implicit binding provider due to being
            //    rendered by the parent as would be the case for elements inside of a composite view or
            //    a Preact render.
            // 2) The node could be stamped by the template engine and have knockout as its binding provider
            //    which may be different than the parent node's binding provider.
            // 3) The node could be rendered in the same context as the parent with the binding provider, e.g.
            //    slot content or the general case of elements in the same html page.
            let name = element[CACHED_BINDING_PROVIDER];
            if (name) {
                return name;
            }
            name = element.getAttribute('data-oj-binding-provider');
            if (!name) {
                const parent = element.parentElement;
                if (parent == null) {
                    if (element === document.documentElement) {
                        name = 'knockout'; // the default
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
            // cache provider name as a non-enumerable property
            element[CACHED_BINDING_PROVIDER] = name;
            return name;
        }
        /**
         * Returns a Promise for tracked children which resolves when the children
         * are created which means on waiting for Promises from:
         * o customElements.whenDefined() for unloaded custom elements
         * o component created Promise
         * @param bindingProvider
         */
        _getTrackedChildrenPromises(bindingProvider) {
            const _UPGRADE_MESSAGE_INTERVAL = 20000;
            const trackOption = this.getTrackChildrenOption();
            const busyContext = Context.getContext(this.Element).getBusyContext();
            const trackedElements = this._getChildrenToTrack(this.Element, trackOption, []);
            // map tracked elements to Promises
            const promises = trackedElements.map((trackedElement) => {
                // 1) if bindingProvider is null, then we don't expect to discover knockout custom components -
                //    wait for all components to be defined, then wait for JET components to be created
                // 2) if bindingProvider is knockout, then child JET components should already be registered -
                //    no need to wait for whenDefined, just wait for JET components to be created
                if (!bindingProvider) {
                    // register busy state for the element
                    const resolveElementDefinedBusyState = busyContext.addBusyState({
                        description: `Waiting for element ${trackedElement.localName} to be defined.`
                    });
                    // setup a timer to log 'waiting' message for an element
                    const timer = setInterval(() => {
                        Logger.warn(`Waiting for element ${trackedElement.localName} to be defined.`);
                    }, _UPGRADE_MESSAGE_INTERVAL);
                    // return a Promise that will be resolved, when element is defined and created
                    return customElements
                        .whenDefined(trackedElement.localName)
                        .then(() => {
                        resolveElementDefinedBusyState();
                        clearInterval(timer);
                        if (ojcustomelementRegistry.isElementRegistered(trackedElement.tagName)) {
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
                else if (ojcustomelementRegistry.isElementRegistered(trackedElement.tagName)) {
                    return CustomElementUtils.getElementState(trackedElement).GetCreatedPromise();
                }
                return null; // knockout binding provider, but the component is not JET component
            });
            return Promise.all(promises);
        }
        /**
         * Returns a list of children to track.
         * @param element
         * @param trackOption
         * @param trackedElements
         */
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
        /* The initial and reset state of the component */
        ComponentState[ComponentState["WaitingToCreate"] = 0] = "WaitingToCreate";
        /* The component can accept property sets in this state while it initializes
          properties from the current DOM */
        ComponentState[ComponentState["Creating"] = 1] = "Creating";
        /* A state mainly used to indicate that property sets should be saved to playback
          after bindings are applied */
        ComponentState[ComponentState["WaitingForBindings"] = 2] = "WaitingForBindings";
        /* A component can jump to this state directly from WaitingToCreate since
          bindings can be applied to disconnected DOM as in the case of oj-bind-for-each.
          Also note that non data bound components may skip this state. */
        ComponentState[ComponentState["ApplyingBindings"] = 3] = "ApplyingBindings";
        /* Indicates bindings have been applied (applies to none binding providers as well)
          and that it is safe to accept property sets as they come in and fire property changed events */
        ComponentState[ComponentState["BindingsApplied"] = 4] = "BindingsApplied";
        /* Indicates that the createComponentCallback has been invoked.  We need to track this in
           order to know when it is safe to enable our Preact slot management hacks.  Note that
           reaching this state does not necessarily mean that the component has rendered its content, as
           composite components can delay rendering by returning a Promise from the activated lifecycle
           method.  However, slot maps are populated synchronously in response to the
           createComponentCallback being innvoked, and once we are past that it is safe to enable
           our Preact workarounds.  */
        ComponentState[ComponentState["PostCreateCallback"] = 5] = "PostCreateCallback";
        /* A terminal state (unless reset) where a component has successfully been created */
        ComponentState[ComponentState["Complete"] = 6] = "Complete";
        /* A terminal state (unless reset) where an error was thrown during component creation */
        ComponentState[ComponentState["Incomplete"] = 7] = "Incomplete";
        /* A non resettable terminal state. Once the binding provider has been disposed during creation,
          the component cannot be reset from this error state unlike for the Complete and Incomplete
          terminal states*/
        ComponentState[ComponentState["BindingsDisposed"] = 8] = "BindingsDisposed";
    })(ComponentState || (ComponentState = {}));

    /**
     * Extends ElementState with functionality needed by VComponentState and CompositeState.
     * Composite components as well VComponents have customer defined implementation
     * and need additional steps to cleanup and restore components on lifecycle events.
     * @ignore
     */
    class LifecycleElementState extends ElementState {
        constructor() {
            super(...arguments);
            this._connectCallbacks = [];
            this._disconnectCallbacks = [];
        }
        /**
         * Specify connect/disconnect callbacks that will
         * be called on _verifiedConnect() and _verifiedDisconnect()
         * @param connectFunc
         * @param disconnectFunc
         */
        addLifecycleCallbacks(connectFunc, disconnectFunc) {
            if (connectFunc) {
                this._connectCallbacks.push(connectFunc);
            }
            if (disconnectFunc) {
                this._disconnectCallbacks.push(disconnectFunc);
            }
        }
        /**
         * Remove connect/disconnect callbacks that will
         * be called on _verifiedConnect() and _verifiedDisconnect().
         * @param connectFunc
         * @param disconnectFunc
         */
        removeLifecycleCallbacks(connectFunc, disconnectFunc) {
            if (connectFunc) {
                this._connectCallbacks = this._connectCallbacks.filter((item) => item != connectFunc);
            }
            if (disconnectFunc) {
                this._disconnectCallbacks = this._disconnectCallbacks.filter((item) => item != disconnectFunc);
            }
        }
        /**
         * Used by _verifiedConnect() and _verifiedDisconnect() to execute
         * specified callbacks.
         * @param isConnected true for connected state
         */
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
    /**
     * The method is used exclusively by private 'value'/'checked' setters that
     * are used by Preact. Note that Preact will pass an empty string for
     * a skipped property which should be recognized as undefined.
     * @param value
     * @returns
     */
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
    /**
     * Handles JET-42984 where Preact will convert null/undefined values to
     * the empty string and set them as property values. We will convert empty strings
     * to undefined if the property does not support string types or is an enum.
     * @param element the HTML element
     * @param propertyMeta The property metadata
     * @param value The value
     * @returns The original value or undefined
     */
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
    /**
     * Transforms values from preact renders to their original values for use by JET
     * custom elements
     *
     * @param element (optional) JET custom element.  If an element is passed, empty string conversion will only be done
     * for preact binding providers.  If no element is passed, empty string conversion will be done unconditionally
     * @param propertyName The property name
     * @param propertyMeta The property metadata
     * @param originalValue The value
     * @returns The transformed value
     */
    const transformPreactValue = (element, propertyName, propertyMeta, originalValue) => {
        let value = originalValue;
        // Note that conversion of symbolized values for 'value' and 'checked' properties happen in private
        // setters added to component prototypes.
        if (propertyName !== 'value' && propertyName !== 'checked') {
            // We only want to do this transformation for empty strings that preact's diffing code
            // passing via direct property assignment
            if (value === '') {
                value = convertEmptyStringToUndefined(element, propertyMeta, value);
            }
        }
        return value;
    };
    /**
     * Utility method used by resolveVDomTemplateProps() on TemplateEngine to resolve
     * properties for DVT component templates. The method converts both name and value
     * of private props ('value' and 'checked') into its original form.
     * @param prop
     * @param value
     * @returns
     */
    const convertPrivatePropFromPreact = (prop, value) => {
        if (prop === PRIVATE_VALUE_KEY) {
            return { prop: 'value', value: fromSymbolizedValue(value) };
        }
        if (prop === PRIVATE_CHECKED_KEY) {
            return { prop: 'checked', value: fromSymbolizedValue(value) };
        }
        return { prop, value };
    };
    /**
     * Utility method that defines private property setters and getters
     * on the component prototype for the 'value' and 'checked' properties
     * that are treated differently in Preact.
     * The goal is to convert those properties to private and force Preact
     * to handle them as regular properties.
     * @param proto
     * @param property
     */
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

    exports.AttributeUtils = AttributeUtils;
    exports.CACHED_BINDING_PROVIDER = CACHED_BINDING_PROVIDER;
    exports.CHILD_BINDING_PROVIDER = CHILD_BINDING_PROVIDER;
    exports.CustomElementUtils = CustomElementUtils;
    exports.ElementState = ElementState;
    exports.ElementUtils = ElementUtils;
    exports.JetElementError = JetElementError;
    exports.KoBindingUtils = KoBindingUtils;
    exports.LifecycleElementState = LifecycleElementState;
    exports.OJ_BIND_CONVERTED_NODE = OJ_BIND_CONVERTED_NODE;
    exports.addPrivatePropGetterSetters = addPrivatePropGetterSetters;
    exports.convertPrivatePropFromPreact = convertPrivatePropFromPreact;
    exports.publicToPrivateName = publicToPrivateName;
    exports.toSymbolizedValue = toSymbolizedValue;
    exports.transformPreactValue = transformPreactValue;

    Object.defineProperty(exports, '__esModule', { value: true });

});
