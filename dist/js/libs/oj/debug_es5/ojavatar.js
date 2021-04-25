(function() {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
define(['exports', 'ojs/ojvcomponent-element'], function (exports, ojvcomponentElement) {
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

    this.background = 'neutral';
    this.initials = null;
    this.size = 'md';
    this.src = null;
  };

  exports.Avatar = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(Avatar, _ojvcomponentElement$);

    var _super = _createSuper(Avatar);

    function Avatar() {
      _classCallCheck(this, Avatar);

      return _super.apply(this, arguments);
    }

    _createClass(Avatar, [{
      key: "render",
      value: function render() {
        var _classNameObj;

        var props = this.props;
        var classNameObj = (_classNameObj = {
          'oj-avatar': true,
          'oj-avatar-has-initials': !!(props.initials && !props.src),
          'oj-avatar-no-image': !props.src,
          'oj-avatar-image': !!props.src
        }, _defineProperty(_classNameObj, 'oj-avatar-bg-' + props.background, true), _defineProperty(_classNameObj, 'oj-avatar-' + props.size, true), _classNameObj);
        var innerContent;

        if (props.src) {
          innerContent = ojvcomponentElement.h("div", {
            class: 'oj-avatar-background-image',
            style: {
              backgroundImage: "url(\"".concat(props.src, "\")")
            }
          });
        } else if (props.initials) {
          innerContent = ojvcomponentElement.h("div", {
            class: 'oj-avatar-initials oj-avatar-background-image'
          }, props.initials);
        } else {
          innerContent = ojvcomponentElement.h("div", {
            class: 'oj-avatar-background-image'
          }, ojvcomponentElement.h("div", {
            class: 'oj-avatar-placeholder'
          }));
        }

        return ojvcomponentElement.h("div", {
          class: classNameObj,
          "aria-hidden": 'true'
        }, innerContent);
      }
    }]);

    return Avatar;
  }(ojvcomponentElement.ElementVComponent);

  exports.Avatar.metadata = {
    "extension": {
      "_DEFAULTS": Props
    },
    "properties": {
      "background": {
        "type": "string",
        "enumValues": ["neutral", "orange", "green", "teal", "blue", "slate", "mauve", "pink", "purple", "lilac", "gray", "red", "forest"],
        "value": "neutral"
      },
      "initials": {
        "type": "string|null",
        "value": null
      },
      "size": {
        "type": "string",
        "enumValues": ["xxs", "xs", "sm", "md", "lg", "xl", "xxl"],
        "value": "md"
      },
      "src": {
        "type": "string|null",
        "value": null
      }
    }
  };
  exports.Avatar = __decorate([ojvcomponentElement.customElement('oj-avatar')], exports.Avatar);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())