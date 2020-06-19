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
   * @ojcomponent oj.ojProgressBar
   * @ojtsvcomponent
   * @ojsignature {target: "Type", value: "class ojProgressBar extends JetElement<ojProgressBarSettableProperties>"}
   *
   * @since 9.0.0
   * @ojshortdesc A progress bar allows the user to visualize the progression of an extended computer operation.
   *
   * @ojpropertylayout {propertyGroup: "common", items: ["max"]}
   * @ojpropertylayout {propertyGroup: "data", items: ["value"]}
   * @ojvbdefaultcolumns 4
   * @ojvbmincolumns 1
   * @ojunsupportedthemes ["Alta"]
   *
   * @ojuxspecs ['progress-indicator']
   *
   * @classdesc
   * <h3 id="progressBarOverview-section">
   *   JET Progress Bar
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressBarOverview-section"></a>
   * </h3>
   * The JET Progress Bar element allows a user to display progress of an operation in a rectangular horizontal meter.
   * If a developer does not wish to display the exact value, a value of '-1' can be passed in to display an indeterminate value.
   *
   * <pre class="prettyprint"><code>&lt;oj-progress-bar value='{{progressValue}}'>&lt;/oj-progress-bar></code></pre>
   *
   *
   */
  // --------------------------------------------------- oj.ojProgressbar Styling Start -----------------------------------------------------------
  // ---------------- oj-progress-bar-embedded --------------

  /**
    * Optional class that can be set on a oj-progress bar element to style an embedded progress bar within a web application or dialog.
    * @ojstyleclass oj-progress-bar-embedded
    * @ojdisplayname Embedded
    * @memberof oj.ojProgressBar
    * @ojtsexample
    * &lt;div class='oj-web-applayout-page'>
    *   &lt;header class='oj-web-applayout-header'>
    *   &lt;/header>
    *   &lt;oj-progress-bar class='oj-progress-bar-embedded' value='{{loadingValue}}'>
    *   &lt;/oj-progress-bar>
    * &lt;/div>
    */
  // --------------------------------------------------- oj.ojProgressbar Styling end -----------------------------------------------------------

  /**
   * The maximum allowed value. The element's max attribute is used if it
   * is provided, otherwise the default value of 100 is used.
   * @ojshortdesc The maximum allowed value.
   * @expose
   * @name max
   * @type {number}
   * @instance
   * @memberof oj.ojProgressBar
   * @default 100
   * @ojmin 0
   */

  /**
   * The value of the Progress Bar. The element's value attribute is used if it
   * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
   * Any other negative value will default to 0.
   * @ojshortdesc The value of the Progress Bar.
   * @expose
   * @name value
   * @type {number}
   * @instance
   * @memberof oj.ojProgressBar
   * @default 0
   * @ojmin -1
   * @ojeventgroup common
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
   * @memberof oj.ojProgressBar
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
   * @memberof oj.ojProgressBar
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
   * @memberof oj.ojProgressBar
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
  };

  exports.ProgressBar = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(ProgressBar, _ojvcomponent$VCompon);

    var _super = _createSuper(ProgressBar);

    function ProgressBar() {
      _classCallCheck(this, ProgressBar);

      return _super.apply(this, arguments);
    }

    _createClass(ProgressBar, [{
      key: "render",
      value: function render() {
        return this.props.value == -1 ? this._renderIndeterminateBar() : this._renderDeterminateBar();
      }
    }, {
      key: "_renderDeterminateBar",
      value: function _renderDeterminateBar() {
        var props = this.props;
        var max = props.max;
        var value = props.value;

        if (max < 0) {
          max = 0;
        }

        if (value < 0) {
          value = 0;
        }

        var percentage = max == 0 ? 0 : value > max ? 1 : value / max;
        return ojvcomponent.h("oj-progress-bar", {
          class: 'oj-progress-bar',
          role: 'progressbar',
          "aria-valuemin": '0',
          "aria-valuemax": max,
          "aria-valuenow": value
        }, ojvcomponent.h("div", {
          class: 'oj-progress-bar-value',
          style: {
            width: percentage * 100 + '%'
          }
        }));
      }
    }, {
      key: "_renderIndeterminateBar",
      value: function _renderIndeterminateBar() {
        return ojvcomponent.h("oj-progress-bar", {
          class: 'oj-progress-bar',
          role: 'progressbar',
          "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText')
        }, ojvcomponent.h("div", {
          class: 'oj-progress-bar-value oj-progress-bar-indeterminate'
        }, ojvcomponent.h("div", {
          class: 'oj-progress-bar-overlay'
        })));
      }
    }]);

    return ProgressBar;
  }(ojvcomponent.VComponent);

  exports.ProgressBar.metadata = {
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
      }
    }
  };
  exports.ProgressBar = __decorate([ojvcomponent.customElement('oj-progress-bar')], exports.ProgressBar);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())