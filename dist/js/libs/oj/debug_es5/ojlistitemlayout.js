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

  var ListItemLayoutProps = function ListItemLayoutProps() {
    _classCallCheck(this, ListItemLayoutProps);
  };

  exports.ListItemLayout = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(ListItemLayout, _ojvcomponentElement$);

    var _super = _createSuper(ListItemLayout);

    function ListItemLayout() {
      var _this;

      _classCallCheck(this, ListItemLayout);

      _this = _super.apply(this, arguments);

      _this._hasContent = function (slotContent) {
        return Array.isArray(slotContent) && slotContent.length > 0 || slotContent;
      };

      return _this;
    }

    _createClass(ListItemLayout, [{
      key: "_getWrappedSlotContent",
      value: function _getWrappedSlotContent(slotContent, wrapperClasses) {
        if (this._hasContent(slotContent)) {
          if (wrapperClasses && wrapperClasses.length > 0) return ojvcomponentElement.h("div", {
            class: wrapperClasses
          }, slotContent);else return ojvcomponentElement.h("div", null, slotContent);
        }

        return null;
      }
    }, {
      key: "_getWrappedSlotContentWithClickThroughDisabled",
      value: function _getWrappedSlotContentWithClickThroughDisabled(slotContent, wrapperClasses) {
        if (this._hasContent(slotContent)) {
          if (wrapperClasses && wrapperClasses.length > 0) return ojvcomponentElement.h("div", {
            "data-oj-clickthrough": 'disabled',
            class: wrapperClasses
          }, slotContent);else return ojvcomponentElement.h("div", {
            "data-oj-clickthrough": 'disabled'
          }, slotContent);
        }

        return null;
      }
    }, {
      key: "render",
      value: function render() {
        var props = this.props;

        var hasExtra = this._hasContent(props.metadata) || this._hasContent(props.action) || this._hasContent(props.trailing);

        var tertiaryClass = '';
        if (this._hasContent(props.secondary) && this._hasContent(props.tertiary)) tertiaryClass = 'oj-listitemlayout-tertiary';
        var leadingClass = 'oj-listitemlayout-leading';

        if (this._hasContent(props.selector) && this._hasContent(props.leading)) {
          leadingClass = leadingClass + ' oj-listitemlayout-start-padding';
        }

        var quaternaryClass = 'oj-listitemlayout-quaternary';
        var textSlotClass = 'oj-listitemlayout-textslots';

        if (this._hasContent(props.selector) || this._hasContent(props.leading)) {
          textSlotClass = textSlotClass + ' oj-listitemlayout-start-padding';
          quaternaryClass = quaternaryClass + ' oj-listitemlayout-start-padding';
        }

        return ojvcomponentElement.h("oj-list-item-layout", null, ojvcomponentElement.h("div", {
          class: 'oj-listitemlayout-grid'
        }, this._getWrappedSlotContent(props.selector, 'oj-listitemlayout-selector'), this._getWrappedSlotContent(props.leading, leadingClass), ojvcomponentElement.h("div", {
          class: textSlotClass
        }, this._getWrappedSlotContent(props.overline), this._getWrappedSlotContent(props.children), this._getWrappedSlotContent(props.secondary), this._getWrappedSlotContent(props.tertiary, tertiaryClass)), hasExtra ? ojvcomponentElement.h("div", {
          class: 'oj-listitemlayout-extra'
        }, this._getWrappedSlotContent(props.metadata, 'oj-listitemlayout-metadata oj-listitemlayout-start-padding'), this._getWrappedSlotContent(props.trailing, 'oj-listitemlayout-trailing oj-listitemlayout-image oj-listitemlayout-start-padding'), this._getWrappedSlotContentWithClickThroughDisabled(props.action, 'oj-listitemlayout-action oj-listitemlayout-start-padding')) : null, this._getWrappedSlotContent(props.quaternary, quaternaryClass), this._getWrappedSlotContentWithClickThroughDisabled(props.navigation, 'oj-listitemlayout-navigation')));
      }
    }]);

    return ListItemLayout;
  }(ojvcomponentElement.ElementVComponent);

  exports.ListItemLayout.metadata = {
    "extension": {
      "_DEFAULTS": ListItemLayoutProps
    },
    "slots": {
      "": {},
      "overline": {},
      "selector": {},
      "leading": {},
      "secondary": {},
      "tertiary": {},
      "metadata": {},
      "trailing": {},
      "action": {},
      "quaternary": {},
      "navigation": {}
    }
  };
  exports.ListItemLayout = __decorate([ojvcomponentElement.customElement('oj-list-item-layout')], exports.ListItemLayout);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())