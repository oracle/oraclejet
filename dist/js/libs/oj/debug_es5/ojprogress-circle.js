(function() {
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojvcomponent-element', 'ojs/ojtranslation'], function (exports, ojvcomponentElement, Translations) {
  'use strict';

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

  exports.ProgressCircle = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(ProgressCircle, _ojvcomponentElement$);

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
        return ojvcomponentElement.h("oj-progress-circle", {
          class: 'oj-progress-circle oj-progress-circle-' + this.props.size,
          role: 'progressbar',
          "aria-valuetext": Translations.getTranslatedString('oj-ojProgressbar.ariaIndeterminateProgressText')
        }, ojvcomponentElement.h("div", {
          class: 'oj-progress-circle-indeterminate'
        }, ojvcomponentElement.h("div", {
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

        return ojvcomponentElement.h("oj-progress-circle", {
          class: 'oj-progress-circle oj-progress-circle-' + props.size,
          role: 'progressbar',
          "aria-valuemin": '0',
          "aria-valuemax": max,
          "aria-valuenow": value
        }, ojvcomponentElement.h("div", {
          class: 'oj-progress-circle-tracker'
        }), ojvcomponentElement.h("div", {
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
  }(ojvcomponentElement.ElementVComponent);

  exports.ProgressCircle.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "aria-valuemin": 1,
        "aria-valuemax": 1,
        "aria-valuetext": 1,
        "aria-valuenow": 1,
        "role": 1
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
  exports.ProgressCircle = __decorate([ojvcomponentElement.customElement('oj-progress-circle')], exports.ProgressCircle);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())