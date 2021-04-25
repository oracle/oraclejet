(function() {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojthemeutils'], function (exports, Context, Logger, ThemeUtils) {
  'use strict';

  Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;
  var _SUPPORTED_TYPES_MAP = {};

  var ElementUtils = /*#__PURE__*/function () {
    function ElementUtils() {
      _classCallCheck(this, ElementUtils);
    }

    _createClass(ElementUtils, null, [{
      key: "isValidCustomElementName",
      value: function isValidCustomElementName(localName) {
        var reserved = ElementUtils._RESERVED_TAGS.has(localName);

        var validForm = ElementUtils._ELEMENT_NAME_REGEXP.test(localName);

        return !reserved && validForm && !localName.startsWith('oj-bind-', 0);
      }
    }, {
      key: "getSupportedTypes",
      value: function getSupportedTypes(typeStr) {
        if (!typeStr) return {};
        var supportedTypes = _SUPPORTED_TYPES_MAP[typeStr];

        if (!supportedTypes) {
          supportedTypes = {};
          var lowerTypeStr = typeStr.toLowerCase();
          var types = lowerTypeStr.match(/(?=[^|])(?:[^|]*<[^>]+>)*[^|]*/g);
          var numTypes = 0;
          types.forEach(function (untrimmedType) {
            var type = untrimmedType.trim();

            if (type === 'any' || type === 'boolean' || type === 'number' || type === 'string' || type === 'array' || type === 'object' || type === 'null') {
              supportedTypes[type] = 1;
            } else if (type.indexOf('array<') === 0) {
              supportedTypes.array = 1;
            } else if (type.indexOf('object<') === 0) {
              supportedTypes.object = 1;
            } else {
              supportedTypes.other = 1;
            }

            numTypes++;
          });
          supportedTypes.typeCount = numTypes;
          _SUPPORTED_TYPES_MAP[lowerTypeStr] = supportedTypes;
        }

        return supportedTypes;
      }
    }, {
      key: "getUniqueId",
      value: function getUniqueId(id) {
        if (id) {
          return id;
        }

        var ret = ElementUtils._UNIQUE + ElementUtils._UNIQUE_INCR;
        ElementUtils._UNIQUE_INCR += 1;
        return ret;
      }
    }]);

    return ElementUtils;
  }();

  ElementUtils._UNIQUE_INCR = 0;
  ElementUtils._UNIQUE = '_ojcustomelem';
  ElementUtils._RESERVED_TAGS = new Set(['annotation-xml', 'color-profile', 'font-face', 'font-face-src', 'font-face-uri', 'font-face-format', 'font-face-name', 'missing-glyph']);
  ElementUtils._ELEMENT_NAME_REGEXP = /^[a-z][.0-9_a-z]*-[-.0-9_a-z]*$/;
  var GLOBAL_PROPS = {
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
  var NATIVE_PROPS = {
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
  var _ARRAY_VALUE_EXP = /^\s*\[[^]*\]\s*$/;
  var _OBJ_VALUE_EXP = /^\s*\{[^]*\}\s*$/;
  var _ATTR_EXP = /^(?:\{\{)([^]+)(?:\}\})$/;
  var _ATTR_EXP_RO = /^(?:\[\[)([^]+)(?:\]\])$/;
  var _GLOBAL_ATTRS = {};
  Object.keys(GLOBAL_PROPS).forEach(function (prop) {
    var attr = GLOBAL_PROPS[prop];

    if (prop !== attr) {
      _GLOBAL_ATTRS[attr] = prop;
      NATIVE_PROPS[prop] = attr;
    }
  });

  var AttributeUtils = /*#__PURE__*/function () {
    function AttributeUtils() {
      _classCallCheck(this, AttributeUtils);
    }

    _createClass(AttributeUtils, null, [{
      key: "getExpressionInfo",
      value: function getExpressionInfo(attrValue) {
        var downstreamOnly = false;
        var expr;

        if (attrValue) {
          var trimmedVal = attrValue.trim();

          var expArr = _ATTR_EXP.exec(trimmedVal);

          expr = expArr === null || expArr === void 0 ? void 0 : expArr[1];

          if (!expr) {
            downstreamOnly = true;
            expArr = _ATTR_EXP_RO.exec(trimmedVal);
            expr = expArr === null || expArr === void 0 ? void 0 : expArr[1];
          }
        }

        return {
          downstreamOnly: downstreamOnly,
          expr: expr
        };
      }
    }, {
      key: "coerceValue",
      value: function coerceValue(elem, attr, value, type) {
        var tagName = elem.tagName.toLowerCase();

        if (!type) {
          throw new Error("Unable to parse ".concat(attr, "='").concat(value, "' for ").concat(tagName, " with id '").concat(elem.id, "'.         This attribute only supports data bound values. Check the API doc for supported types"));
        }

        var supportedTypes = ElementUtils.getSupportedTypes(type);

        var isValueArray = _ARRAY_VALUE_EXP.test(value);

        var isValueObj = _OBJ_VALUE_EXP.test(value);

        if (supportedTypes.array && isValueArray || supportedTypes.object && isValueObj || supportedTypes.any && (isValueArray || isValueObj)) {
          try {
            return JSON.parse(value);
          } catch (ex) {
            throw new Error("Unable to parse ".concat(attr, "='").concat(value, "' for ").concat(tagName, " with id '").concat(elem.id, "'           to a JSON Object. Check the value for correct JSON syntax, e.g. double quoted strings. ").concat(ex));
          }
        } else if (supportedTypes.string || supportedTypes.any) {
          return value;
        } else if (supportedTypes.boolean) {
          return AttributeUtils.coerceBooleanValue(elem, attr, value, type);
        } else if (supportedTypes.number && !isNaN(value)) {
          return Number(value);
        }

        throw new Error("Unable to parse ".concat(attr, "='").concat(value, "' for ").concat(tagName, " with id '").concat(elem.id, "'       to a ").concat(type, "."));
      }
    }, {
      key: "coerceBooleanValue",
      value: function coerceBooleanValue(elem, attr, value, type) {
        if (value == null || value === 'true' || value === '' || value.toLowerCase() === attr) {
          return true;
        } else if (value === 'false') {
          return false;
        }

        var tagName = elem.tagName.toLowerCase();
        throw new Error("Unable to parse ".concat(attr, "='").concat(value, "' for ").concat(tagName, " with id '").concat(elem.id, "' to a ").concat(type, "."));
      }
    }, {
      key: "isGlobalOrData",
      value: function isGlobalOrData(prop) {
        return Object.prototype.hasOwnProperty.call(GLOBAL_PROPS, prop) || prop.startsWith('data-') || prop.startsWith('aria-');
      }
    }, {
      key: "getGlobalAttrForProp",
      value: function getGlobalAttrForProp(prop) {
        return GLOBAL_PROPS[prop] || prop;
      }
    }, {
      key: "getGlobalPropForAttr",
      value: function getGlobalPropForAttr(attr) {
        return _GLOBAL_ATTRS[attr] || attr;
      }
    }, {
      key: "getNativeAttr",
      value: function getNativeAttr(prop) {
        return NATIVE_PROPS[prop] || prop;
      }
    }]);

    return AttributeUtils;
  }();

  AttributeUtils.attributeToPropertyName = cacheHelper.bind(null, function (attr) {
    return attr.toLowerCase().replace(/-(.)/g, function (match, group1) {
      return group1.toUpperCase();
    });
  });
  AttributeUtils.propertyNameToAttribute = cacheHelper.bind(null, function (name) {
    return name.replace(/([A-Z])/g, function (match) {
      return "-".concat(match.toLowerCase());
    });
  });
  AttributeUtils.eventTypeToEventListenerProperty = cacheHelper.bind(null, function (type) {
    return 'on' + type.substr(0, 1).toUpperCase() + type.substr(1);
  });
  AttributeUtils.isEventListenerProperty = cacheHelper.bind(null, function (property) {
    return /^on[A-Z]/.test(property);
  });
  AttributeUtils.eventListenerPropertyToEventType = cacheHelper.bind(null, function (property) {
    return property.substr(2, 1).toLowerCase() + property.substr(3);
  });
  AttributeUtils.propertyNameToChangeEventType = cacheHelper.bind(null, function (name) {
    return "".concat(name, "Changed");
  });
  AttributeUtils.propertyNameToChangedCallback = cacheHelper.bind(null, function (prop) {
    return "on".concat(prop[0].toUpperCase()).concat(prop.substr(1), "Changed");
  });
  AttributeUtils.eventTriggerToEventType = cacheHelper.bind(null, function (trigger) {
    return "oj".concat(trigger.substr(0, 1).toUpperCase()).concat(trigger.substr(1));
  });

  function cacheHelper(converter, key) {
    var cache = converter['cache'];

    if (!cache) {
      cache = new Map();
      converter['cache'] = cache;
    }

    if (!cache.has(key)) {
      cache.set(key, converter(key));
    }

    return cache.get(key);
  }

  var CustomElementUtils = /*#__PURE__*/function () {
    function CustomElementUtils() {
      _classCallCheck(this, CustomElementUtils);
    }

    _createClass(CustomElementUtils, null, [{
      key: "registerElement",
      value: function registerElement(tagName, regObj) {
        var tagNameUpper = tagName.toUpperCase();

        if (!CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagNameUpper]) {
          if (!regObj.descriptor) {
            throw new Error("Custom element ".concat(tagName, " must be registered with a descriptor."));
          }

          CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagName] = regObj;
          CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagNameUpper] = regObj;
          return true;
        }

        return false;
      }
    }, {
      key: "isComposite",
      value: function isComposite(tagName) {
        var _a, _b;

        return (_b = (_a = CustomElementUtils.getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.composite) !== null && _b !== void 0 ? _b : false;
      }
    }, {
      key: "isElementRegistered",
      value: function isElementRegistered(tagName) {
        return CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagName] != null;
      }
    }, {
      key: "getElementRegistration",
      value: function getElementRegistration(tagName) {
        var _a;

        return (_a = CustomElementUtils._CUSTOM_ELEMENT_REGISTRY[tagName]) !== null && _a !== void 0 ? _a : null;
      }
    }, {
      key: "getElementDescriptor",
      value: function getElementDescriptor(tagName) {
        var _a;

        return ((_a = CustomElementUtils.getElementRegistration(tagName)) === null || _a === void 0 ? void 0 : _a.descriptor) || {};
      }
    }, {
      key: "getElementProperties",
      value: function getElementProperties(element) {
        var _a, _b;

        var descriptor = CustomElementUtils.getElementDescriptor(element.tagName);
        return ((_b = (_a = descriptor['_metadata']) !== null && _a !== void 0 ? _a : descriptor.metadata) === null || _b === void 0 ? void 0 : _b.properties) || {};
      }
    }, {
      key: "getElementInfo",
      value: function getElementInfo(element) {
        if (element) {
          return "".concat(element.tagName.toLowerCase(), " with id '").concat(element.id, "'");
        }

        return '';
      }
    }, {
      key: "getElementState",
      value: function getElementState(element) {
        var state = element[CustomElementUtils._ELEMENT_STATE_KEY];

        if (!state && CustomElementUtils.isElementRegistered(element.tagName)) {
          var StateClass = CustomElementUtils.getElementRegistration(element.tagName).stateClass;
          state = new StateClass(element);
          Object.defineProperty(element, CustomElementUtils._ELEMENT_STATE_KEY, {
            value: state
          });
        }

        return state !== null && state !== void 0 ? state : null;
      }
    }, {
      key: "getElementBridge",
      value: function getElementBridge(element) {
        var bridge = element[CustomElementUtils._ELEMENT_BRIDGE_KEY];

        if (!bridge && CustomElementUtils.isElementRegistered(element.tagName)) {
          var bridgeProto = CustomElementUtils.getElementRegistration(element.tagName).bridgeProto;
          bridge = Object.create(bridgeProto);
          var descriptor = CustomElementUtils.getElementDescriptor(element.tagName);
          bridge.initializeBridge(element, descriptor);
          Object.defineProperty(element, CustomElementUtils._ELEMENT_BRIDGE_KEY, {
            value: bridge
          });
        }

        return bridge !== null && bridge !== void 0 ? bridge : null;
      }
    }, {
      key: "getSlotMap",
      value: function getSlotMap(element) {
        var slotMap = {};
        var childNodeList = element.childNodes;

        for (var i = 0; i < childNodeList.length; i++) {
          var child = childNodeList[i];

          if (CustomElementUtils.isSlotable(child)) {
            var slot = CustomElementUtils.getSlotAssignment(child);

            if (!slotMap[slot]) {
              slotMap[slot] = [];
            }

            slotMap[slot].push(child);
          }
        }

        return slotMap;
      }
    }, {
      key: "getSlotAssignment",
      value: function getSlotAssignment(node) {
        var slot = node['__oj_slots'] != null ? node['__oj_slots'] : node.getAttribute && node.getAttribute('slot');
        if (!slot) return '';
        return slot;
      }
    }, {
      key: "isSlotable",
      value: function isSlotable(node) {
        return node.nodeType === 1 || node.nodeType === 3 && !!node.nodeValue.trim();
      }
    }, {
      key: "getElementProperty",
      value: function getElementProperty(element, property) {
        if (CustomElementUtils.isElementRegistered(element.tagName)) {
          var vInst = element['_vcomp'];

          if (vInst && !vInst.isCustomElementFirst()) {
            return CustomElementUtils.getComplexProperty(vInst.props, property);
          }

          return element.getProperty(property);
        }

        return element[property];
      }
    }, {
      key: "getComplexProperty",
      value: function getComplexProperty(allProps, property) {
        var propObj = allProps;
        var propPath = property.split('.');

        try {
          propPath.forEach(function (subprop) {
            return propObj = propObj[subprop];
          });
        } catch (_a) {
          return undefined;
        }

        return propObj;
      }
    }]);

    return CustomElementUtils;
  }();

  CustomElementUtils._CUSTOM_ELEMENT_REGISTRY = {};
  CustomElementUtils._ELEMENT_STATE_KEY = '_ojElementState';
  CustomElementUtils._ELEMENT_BRIDGE_KEY = '_ojBridge';

  var ElementState = /*#__PURE__*/function () {
    function ElementState(element) {
      _classCallCheck(this, ElementState);

      this.isComplete = false;
      this.isConnected = false;
      this.isDisposed = false;
      this.isInitializingProperties = false;
      this.dirtyProps = new Set();
      this.Element = element;
    }

    _createClass(ElementState, [{
      key: "getTrackChildrenOption",
      value: function getTrackChildrenOption() {
        var _a, _b;

        var metadata = CustomElementUtils.getElementDescriptor(this.Element.tagName).metadata;
        return (_b = (_a = metadata === null || metadata === void 0 ? void 0 : metadata.extension) === null || _a === void 0 ? void 0 : _a['_TRACK_CHILDREN']) !== null && _b !== void 0 ? _b : 'none';
      }
    }, {
      key: "registerBusyState",
      value: function registerBusyState() {
        var busyContext = Context.getContext(this.Element).getBusyContext();

        if (this._resolveCreatedBusyState) {
          this.throwError('Registering busy state before previous state is resolved.');
        }

        this._resolveCreatedBusyState = busyContext.addBusyState({
          description: CustomElementUtils.getElementInfo(this.Element) + ' is being upgraded.'
        });
      }
    }, {
      key: "resolveBusyState",
      value: function resolveBusyState() {
        var callback = this._resolveCreatedBusyState;

        if (!callback) {
          this.throwError('Resolving busy state before one is registered.');
        }

        this._resolveCreatedBusyState = null;
        callback();
      }
    }, {
      key: "beginCreate",
      value: function beginCreate(createComponentCallback) {
        var _this = this;

        if (!this._preCreatedPromise) {
          this._preCreatedPromise = this.GetPreCreatedPromise();
        }

        if (this.isComplete) {
          this._resetStateFlags();
        }

        this._createdPromise = this._preCreatedPromise.then(createComponentCallback);

        this._createdPromise.then(function () {
          _this.Element.classList.add('oj-complete');

          _this._completeHandler();
        }, function (error) {
          _this.Element.classList.add('oj-incomplete');

          _this._completeHandler();

          if (error) throw error;
        });
      }
    }, {
      key: "throwError",
      value: function throwError(msg, origErr) {
        var errMsg = CustomElementUtils.getElementInfo(this.Element) + ': ' + msg;

        if (origErr) {
          errMsg = errMsg + ' ' + (origErr.stack ? origErr.stack : origErr);
        }

        throw new Error(errMsg);
      }
    }, {
      key: "resolveBindingProvider",
      value: function resolveBindingProvider(provider) {
        var _a;

        if (this._resolveBindingProviderCallback) {
          (_a = this._bindingProviderCallback) === null || _a === void 0 ? void 0 : _a.call(this);

          this._resolveBindingProviderCallback(provider);

          this._resolveBindingProviderCallback = null;
          this._rejectBindingProviderCallback = null;
        } else {
          this._bindingProvider = provider;
        }
      }
    }, {
      key: "rejectBindingProvider",
      value: function rejectBindingProvider(error) {
        if (this._rejectBindingProviderCallback) {
          this._rejectBindingProviderCallback(error);

          this._resolveBindingProviderCallback = null;
          this._rejectBindingProviderCallback = null;
        }
      }
    }, {
      key: "disposeBindingProvider",
      value: function disposeBindingProvider() {
        this.isDisposed = true;

        if (!this.isComplete) {
          this.rejectBindingProvider();
        }
      }
    }, {
      key: "setBindingProviderCallback",
      value: function setBindingProviderCallback(callback) {
        this._bindingProviderCallback = callback;
      }
    }, {
      key: "getBindingProviderPromise",
      value: function getBindingProviderPromise() {
        var _this2 = this;

        var _a, _b;

        if (!this._bindingProviderPromise) {
          ThemeUtils.verifyThemeVersion();

          var name = this._walkBindingProviders(this.Element);

          if (name === 'none') {
            (_a = this._bindingProviderCallback) === null || _a === void 0 ? void 0 : _a.call(this);
            this._bindingProviderPromise = Promise.resolve(null);
          } else if (name === 'knockout') {
            if (this._bindingProvider) {
              (_b = this._bindingProviderCallback) === null || _b === void 0 ? void 0 : _b.call(this);
              this._bindingProviderPromise = Promise.resolve(this._bindingProvider);
            } else {
              this._bindingProviderPromise = new Promise(function (resolve, reject) {
                _this2._resolveBindingProviderCallback = resolve;
                _this2._rejectBindingProviderCallback = reject;
              });
            }
          } else {
            this.throwError("Unknown binding provider '" + name + "'.");
          }
        }

        return this._bindingProviderPromise;
      }
    }, {
      key: "getDescriptiveText",
      value: function getDescriptiveText() {
        var text = this.GetDescriptiveValue('aria-label') || this.GetDescriptiveValue('title') || this.GetDescriptiveLabelByValue('labelled-by') || this.GetDescriptiveValue('label-hint') || this.GetDescriptiveLabelByValue('aria-labelledby');

        if (text) {
          text = text.trim().replace(/\s+/g, ' ');
        } else {
          text = '';
        }

        return text;
      }
    }, {
      key: "GetCreatedPromise",
      value: function GetCreatedPromise() {
        return this._createdPromise;
      }
    }, {
      key: "GetPreCreatedPromise",
      value: function GetPreCreatedPromise() {
        var _this3 = this;

        var preCreatePromise = this.getBindingProviderPromise();
        var trackOption = this.getTrackChildrenOption();

        if (trackOption !== 'none') {
          preCreatePromise = preCreatePromise.then(function (bindingProvider) {
            return _this3._getTrackedChildrenPromises(bindingProvider);
          });
        }

        return preCreatePromise;
      }
    }, {
      key: "IsTransferAttribute",
      value: function IsTransferAttribute(attrName) {
        return false;
      }
    }, {
      key: "GetDescriptiveValue",
      value: function GetDescriptiveValue(attrName) {
        var propName = AttributeUtils.attributeToPropertyName(attrName);
        var properties = CustomElementUtils.getElementProperties(this.Element);
        var value;

        if (properties && properties[propName]) {
          value = this.Element[propName];
        } else if (this.IsTransferAttribute(attrName)) {
          value = this.GetDescriptiveTransferAttributeValue(attrName);
        } else {
          value = this.Element.getAttribute(attrName);
        }

        return value;
      }
    }, {
      key: "GetDescriptiveTransferAttributeValue",
      value: function GetDescriptiveTransferAttributeValue(attrName) {
        return '';
      }
    }, {
      key: "GetDescriptiveLabelByValue",
      value: function GetDescriptiveLabelByValue(attrName) {
        var LabelBy = this.GetDescriptiveValue(attrName);

        if (LabelBy) {
          var label = document.getElementById(LabelBy);

          if (label) {
            return label.textContent;
          }
        }

        return null;
      }
    }, {
      key: "GetBindingProviderName",
      value: function GetBindingProviderName(element) {
        return null;
      }
    }, {
      key: "_completeHandler",
      value: function _completeHandler() {
        if (!this.isComplete) {
          if (this.isConnected) {
            this.resolveBusyState();
          }

          this.isComplete = true;
        }
      }
    }, {
      key: "_walkBindingProviders",
      value: function _walkBindingProviders(element) {
        var cachedProp = '_ojBndgPrv';
        var name = element[cachedProp];

        if (name) {
          return name;
        }

        name = element.getAttribute('data-oj-binding-provider') || this.GetBindingProviderName(element);

        if (!name) {
          var parent = element.parentElement;

          if (parent == null) {
            if (element === document.documentElement) {
              name = 'knockout';
            } else {
              this.throwError('Cannot determine binding provider for a disconnected subtree.');
            }
          } else {
            name = this._walkBindingProviders(parent);
          }
        }

        Object.defineProperty(element, cachedProp, {
          value: name
        });
        return name;
      }
    }, {
      key: "_getTrackedChildrenPromises",
      value: function _getTrackedChildrenPromises(bindingProvider) {
        var _UPGRADE_MESSAGE_INTERVAL = 20000;
        var trackOption = this.getTrackChildrenOption();
        var busyContext = Context.getContext(this.Element).getBusyContext();

        var trackedElements = this._getChildrenToTrack(this.Element, trackOption, []);

        var promises = trackedElements.map(function (trackedElement) {
          if (!bindingProvider) {
            var resolveElementDefinedBusyState = busyContext.addBusyState({
              description: 'Waiting for element ' + trackedElement.localName + ' to be defined.'
            });
            var timer = setInterval(function () {
              Logger.warn('Waiting for element ' + trackedElement.localName + ' to be defined.');
            }, _UPGRADE_MESSAGE_INTERVAL);
            return customElements.whenDefined(trackedElement.localName).then(function () {
              resolveElementDefinedBusyState();
              clearInterval(timer);

              if (CustomElementUtils.isElementRegistered(trackedElement.tagName)) {
                return CustomElementUtils.getElementState(trackedElement).GetCreatedPromise();
              }

              return null;
            }).catch(function (error) {
              resolveElementDefinedBusyState();
              clearInterval(timer);
              throw new Error('Error defining element ' + trackedElement.localName + ' : ' + error);
            });
          } else if (CustomElementUtils.isElementRegistered(trackedElement.tagName)) {
            return CustomElementUtils.getElementState(trackedElement).GetCreatedPromise();
          }

          return null;
        });
        return Promise.all(promises);
      }
    }, {
      key: "_getChildrenToTrack",
      value: function _getChildrenToTrack(element, trackOption, trackedElements) {
        var children = element.childNodes;

        for (var i = 0; i < children.length; i++) {
          var child = children[i];

          if (ElementUtils.isValidCustomElementName(child.localName)) {
            trackedElements.push(child);
          } else if (trackOption === 'nearestCustomElement') {
            this._getChildrenToTrack(child, trackOption, trackedElements);
          }
        }

        return trackedElements;
      }
    }, {
      key: "_resetStateFlags",
      value: function _resetStateFlags() {
        this._createdPromise = null;
        this.isComplete = false;
      }
    }]);

    return ElementState;
  }();

  exports.AttributeUtils = AttributeUtils;
  exports.CustomElementUtils = CustomElementUtils;
  exports.ElementState = ElementState;
  exports.ElementUtils = ElementUtils;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())