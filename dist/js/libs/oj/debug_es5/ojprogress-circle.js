(function() {function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

define(['exports', 'ojs/ojvcomponent', 'ojs/ojtranslation'], function (exports, ojvcomponent, Translations) {
  'use strict';
  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @ojcomponent oj.ojProgressCircle
   * @ojtsvcomponent
   * @ojsignature {target: "Type", value: "class ojProgressCircle extends JetElement<ojProgressCircleSettableProperties>"}
   *
   * @since 9.0.0
   * @ojshortdesc A progress circle allows the user to visualize the progression of an extended computer operation.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["size", "max"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 4
   * @ojvbmincolumns 1
   * @ojunsupportedthemes ["Alta"]
   *
   * @ojuxspecs ['progress-indicator']
   *
   * @classdesc
   * <h3 id="progressCircleOverview-section">
   *   JET Progress Circle
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressCircleOverview-section"></a>
   * </h3>
   * The JET Progress Circle element allows a user to display progress of an operation with a circular meter.
   * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
   *
   * <pre class="prettyprint"><code>&lt;oj-progress-circle value='{{progressValue}}'>&lt;/oj-progress-circle></code></pre>
   *
   *
   */

  /**
   * The maximum allowed value. The element's max attribute is used if it
   * is provided, otherwise the default value of 100 is used.
   * @ojshortdesc The maximum allowed value.
   * @expose
   * @name max
   * @type {number}
   * @instance
   * @memberof oj.ojProgressCircle
   * @default 100
   * @ojmin 0
   */

  /**
   * The value of the Progress Circle. The element's value attribute is used if it
   * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
   * Any other negative value will default to 0.
   * @ojshortdesc The value of the Progress Circle.
   * @expose
   * @name value
   * @type {number}
   * @instance
   * @memberof oj.ojProgressCircle
   * @default 0
   * @ojmin -1
   * @ojeventgroup common
   */

  /**
   * Specifies the size of the progress circle.
   * @expose
   * @name size
   * @memberof oj.ojProgressCircle
   * @ojshortdesc Specifies the size of the progress circle.
   * @instance
   * @type {string}
   * @ojvalue {string} "sm" {"description": "small progress circle", "displayName": "Small"}
   * @ojvalue {string} "md" {"description": "medium progress circle (default, if unspecified)", "displayName": "Medium"}
   * @ojvalue {string} "lg" {"description": "large progress circle", "displayName": "Large"}
   * @ojvalueskeeporder
   * @default "md"
   */

  /**
   * Sets a property or a single subproperty for complex properties and notifies the component
   * of the change, triggering a [property]Changed event.
   *
   * @function setProperty
   * @param {string} property - The property name to set. Supports dot notation for subproperty access.
   * @param {any} value - The new value to set the property to.
   *
   * @expose
   * @memberof oj.ojProgressCircle
   * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
   * @instance
   * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
   * @return {void}
   *
   * @example <caption>Set a single subproperty of a complex property:</caption>
   * myComponent.setProperty('complexProperty.subProperty1.subProperty2', "someValue");
   */

  /**
   * Retrieves a value for a property or a single subproperty for complex properties.
   * @function getProperty
   * @param {string} property - The property name to get. Supports dot notation for subproperty access.
   * @return {any}
   *
   * @expose
   * @memberof oj.ojProgressCircle
   * @instance
   *
   * @example <caption>Get a single subproperty of a complex property:</caption>
   * var subpropValue = myComponent.getProperty('complexProperty.subProperty1.subProperty2');
   */

  /**
   * Performs a batch set of properties.
   * @function setProperties
   * @param {Object} properties - An object containing the property and value pairs to set.
   * @return {void}
   *
   * @expose
   * @memberof oj.ojProgressCircle
   * @instance
   *
   * @example <caption>Set a batch of properties:</caption>
   * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
   */

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.max = 100;
    this.value = 0;
    this.size = 'md';
  };

  exports.ProgressCircle = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(ProgressCircle, _ojvcomponent$VCompon);

    var _super = _createSuper(ProgressCircle);

    function ProgressCircle() {
      _classCallCheck(this, ProgressCircle);

      return _super.apply(this, arguments);
    }

    _createClass(ProgressCircle, [{
      key: "render",
      value: function render() {
        return this.props.value == -1 ? this._renderIndeterminateCircle() : this._renderDeterminateCircle();
      }
    }, {
      key: "_renderIndeterminateCircle",
      value: function _renderIndeterminateCircle() {
        return ojvcomponent.h("oj-progress-circle", {
          class: 'oj-progress-circle oj-progress-circle-' + this.props.size,
          role: 'progressbar',
          "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText')
        }, ojvcomponent.h("div", {
          class: 'oj-progress-circle-indeterminate'
        }, ojvcomponent.h("div", {
          class: 'oj-progress-circle-indeterminate-inner'
        })));
      }
    }, {
      key: "_renderDeterminateCircle",
      value: function _renderDeterminateCircle() {
        var props = this.props;
        var max = props.max;
        var value = props.value;

        if (max < 0) {
          max = 0;
        }

        if (value < 0 && value !== -1) {
          value = 0;
        }

        var percentage = max == 0 ? 0 : value > max ? 1 : value / max;

        var clipPath = this._getClipPath(percentage);

        return ojvcomponent.h("oj-progress-circle", {
          class: 'oj-progress-circle oj-progress-circle-' + props.size,
          role: 'progressbar',
          "aria-valuemin": '0',
          "aria-valuemax": max,
          "aria-valuenow": value
        }, ojvcomponent.h("div", {
          class: 'oj-progress-circle-tracker'
        }), ojvcomponent.h("div", {
          class: 'oj-progress-circle-value',
          style: {
            clipPath: clipPath
          }
        }));
      }
    }, {
      key: "_getClipPath",
      value: function _getClipPath(percentage) {
        var tangent;

        if (percentage < 0.125) {
          tangent = this._calculateTangent(percentage) + 50;
          return "polygon(50% 0, ".concat(tangent, "% 0, 50% 50%)");
        } else if (percentage < 0.375) {
          if (percentage < 0.25) {
            tangent = 50 - this._calculateTangent(0.25 - percentage);
          } else {
            tangent = this._calculateTangent(percentage - 0.25) + 50;
          }

          return "polygon(50% 0, 100% 0, 100% ".concat(tangent, "%, 50% 50%)");
        } else if (percentage < 0.625) {
          if (percentage < 0.5) {
            tangent = 50 + this._calculateTangent(0.5 - percentage);
          } else {
            tangent = 50 - this._calculateTangent(percentage - 0.5);
          }

          return "polygon(50% 0, 100% 0, 100% 100%, ".concat(tangent, "% 100%, 50% 50%)");
        } else if (percentage < 0.875) {
          if (percentage < 0.75) {
            tangent = 50 + this._calculateTangent(0.75 - percentage);
          } else {
            tangent = 50 - this._calculateTangent(percentage - 0.75);
          }

          return "polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% ".concat(tangent, "%, 50% 50%)");
        }

        tangent = 50 - this._calculateTangent(1 - percentage);
        return "polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% 0%, ".concat(tangent, "% 0%, 50% 50%)");
      }
    }, {
      key: "_calculateTangent",
      value: function _calculateTangent(percentage) {
        return 50 * Math.tan(percentage * 2 * Math.PI);
      }
    }]);

    return ProgressCircle;
  }(ojvcomponent.VComponent);

  exports.ProgressCircle.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "aria-valuemin": true,
        "aria-valuemax": true,
        "aria-valuetext": true,
        "aria-valuenow": true,
        "role": true
      }
    },
    "properties": {
      "max": {
        "type": "number",
        "value": 100
      },
      "value": {
        "type": "number",
        "value": 0
      },
      "size": {
        "type": "string",
        "enumValues": ["sm", "md", "lg"],
        "value": "md"
      }
    }
  };
  exports.ProgressCircle = __decorate([ojvcomponent.customElement('oj-progress-circle')], exports.ProgressCircle);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())