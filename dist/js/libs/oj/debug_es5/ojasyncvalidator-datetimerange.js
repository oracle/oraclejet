/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'require', 'ojs/ojasyncvalidator-adapter'], 
function(oj, localRequire, SyncValidatorAdapter)
{
  "use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var AsyncDateTimeRangeValidator =
/*#__PURE__*/
function (_SyncValidatorAdapter) {
  _inherits(AsyncDateTimeRangeValidator, _SyncValidatorAdapter);

  function AsyncDateTimeRangeValidator(options) {
    var _this;

    _classCallCheck(this, AsyncDateTimeRangeValidator);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AsyncDateTimeRangeValidator).call(this, options));
    _this.options = options;
    return _this;
  }

  _createClass(AsyncDateTimeRangeValidator, [{
    key: "_InitLoadingPromise",
    value: function _InitLoadingPromise() {
      if (!this._loadingPromise) {
        this._loadingPromise = oj.__getRequirePromise('./ojvalidator-datetimerange', localRequire);
      }
    }
  }, {
    key: "hint",
    get: function get() {
      return _get(_getPrototypeOf(AsyncDateTimeRangeValidator.prototype), "_GetHint", this).call(this);
    }
  }]);

  return AsyncDateTimeRangeValidator;
}(SyncValidatorAdapter);



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/

/**
 * @since 8.0.0
 * @export
 * @class AsyncDateTimeRangeValidator
 * @final
 * @implements AsyncValidator
 * @classdesc Constructs an AsyncDateTimeRangeValidator ensures the value provided is within a given range.
 * @param {Object=} options an object literal used to provide the following properties
 * @ojtsmodule
 * @ojtsimport {module: "ojvalidator-async", type: "AMD", importName: "AsyncValidator"}
 * @ojtsimport {module: "ojvalidator-datetimerange", type: "AMD", importName: "DateTimeRangeValidator"}
 * @ojsignature [{target: "Type",
 *                value: "class AsyncDateTimeRangeValidator<V> implements AsyncValidator<V>"},
 *               {target: "Type",
 *                value: "DateTimeRangeValidator.ValidatorOptions",
 *                for: "options", jsdocOverride: true}
 *              ]
 * @see oj.DateTimeRangeValidator
 */

/**
 * Validates the minimum + maximum conditions. Returns a
 * Promise which resolves when valid and rejects which invalid.
 *
 * @param {string} value that is being validated
 * @returns {Promise.<void>}
 * @ojsignature {target: "Type",
 *               value: "(value: V): Promise<void>"}
 * @memberof AsyncDateTimeRangeValidator
 * @instance
 * @export
 * @method validate
 */

/**
 * A message to be used as hint.
 *
 * @memberof AsyncDateTimeRangeValidator
 * @instance
 * @export
 * @name hint
 * @type {Promise.<string|null>}
 */

/**
 * End of jsdoc
 */

  return AsyncDateTimeRangeValidator;
});