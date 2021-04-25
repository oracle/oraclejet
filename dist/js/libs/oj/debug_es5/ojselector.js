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
define(['exports', 'ojs/ojtranslation', 'ojs/ojvcomponent-element', 'ojs/ojdomutils'], function (exports, Translations, ojvcomponentElement, DomUtils) {
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

    this.rowKey = null;
    this.indeterminate = false;
    this.selectedKeys = null;
    this.selectionMode = 'multiple';
  };

  exports.Selector = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(Selector, _ojvcomponentElement$);

    var _super = _createSuper(Selector);

    function Selector(props) {
      var _this;

      _classCallCheck(this, Selector);

      _this = _super.call(this, props);
      _this.state = {
        focus: false
      };
      return _this;
    }

    _createClass(Selector, [{
      key: "render",
      value: function render() {
        var _this$props = this.props,
            rowKey = _this$props.rowKey,
            indeterminate = _this$props.indeterminate;

        var isSelected = this._isSelected(rowKey);

        var spanClassName = {
          'oj-selector-wrapper': true,
          'oj-selected': isSelected && !indeterminate,
          'oj-indeterminate': indeterminate,
          'oj-focus-highlight': this.state.focus && !DomUtils.recentPointer(),
          'oj-component-icon': true
        };
        var ariaLabelledby = this.props['aria-labelledby'] || null;
        var ariaLabel = this.props['aria-label'] || Translations.getTranslatedString('oj-ojSelector.checkboxAriaLabel', {
          rowKey: rowKey
        });
        return ojvcomponentElement.h("oj-selector", {
          class: 'oj-selector'
        }, ojvcomponentElement.h("span", {
          class: spanClassName
        }, ojvcomponentElement.h("input", {
          type: 'checkbox',
          class: 'oj-selectorbox oj-clickthrough-disabled',
          "aria-label": ariaLabel,
          "aria-labelledby": ariaLabelledby,
          checked: isSelected,
          onFocusin: this._handleFocusin,
          onFocusout: this._handleFocusout,
          onClick: this._checkboxListener
        })));
      }
    }, {
      key: "_handleFocusin",
      value: function _handleFocusin(event) {
        this.updateState({
          focus: true
        });
      }
    }, {
      key: "_handleFocusout",
      value: function _handleFocusout(event) {
        this.updateState({
          focus: false
        });
      }
    }, {
      key: "_checkboxListener",
      value: function _checkboxListener(event) {
        var _a, _b, _c, _d;

        var _this$props2 = this.props,
            selectedKeys = _this$props2.selectedKeys,
            rowKey = _this$props2.rowKey,
            selectionMode = _this$props2.selectionMode;
        var newSelectedKeys;

        if (selectedKeys != null) {
          if (event.target.checked) {
            if (selectionMode === 'single') {
              if (!selectedKeys.has(rowKey)) {
                newSelectedKeys = selectedKeys.clear().add([rowKey]);
              }
            } else if (selectionMode === 'all') {
              newSelectedKeys = selectedKeys.addAll();
            } else {
              newSelectedKeys = selectedKeys.add([rowKey]);
            }
          } else {
            if (selectionMode === 'all') {
              newSelectedKeys = selectedKeys.clear();
            } else {
              newSelectedKeys = selectedKeys.delete([rowKey]);
            }
          }

          (_b = (_a = this.props).onSelectedKeysChanged) === null || _b === void 0 ? void 0 : _b.call(_a, newSelectedKeys);
          (_d = (_c = this.props).onIndeterminateChanged) === null || _d === void 0 ? void 0 : _d.call(_c, false);
        }

        event.stopPropagation();
      }
    }, {
      key: "_isSelected",
      value: function _isSelected(rowKey) {
        var _this$props3 = this.props,
            selectedKeys = _this$props3.selectedKeys,
            selectionMode = _this$props3.selectionMode;

        if (!selectedKeys) {
          return false;
        }

        return selectionMode === 'all' ? selectedKeys.isAddAll() : selectedKeys.has(rowKey);
      }
    }]);

    return Selector;
  }(ojvcomponentElement.ElementVComponent);

  exports.Selector.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "aria-label": 1,
        "aria-labelledby": 1
      },
      "_WRITEBACK_PROPS": ["selectedKeys", "indeterminate"],
      "_READ_ONLY_PROPS": []
    },
    "properties": {
      "rowKey": {
        "type": "any",
        "value": null
      },
      "indeterminate": {
        "type": "boolean",
        "value": false,
        "writeback": true
      },
      "selectedKeys": {
        "type": "any",
        "value": null,
        "writeback": true
      },
      "selectionMode": {
        "type": "string",
        "enumValues": ["all", "multiple", "single"],
        "value": "multiple"
      }
    }
  };

  __decorate([ojvcomponentElement.listener()], exports.Selector.prototype, "_handleFocusin", null);

  __decorate([ojvcomponentElement.listener()], exports.Selector.prototype, "_handleFocusout", null);

  __decorate([ojvcomponentElement.listener()], exports.Selector.prototype, "_checkboxListener", null);

  exports.Selector = __decorate([ojvcomponentElement.customElement('oj-selector')], exports.Selector);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())