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
define(['exports', 'ojs/ojvcomponent-element', 'ojs/ojdomutils', 'ojs/ojdatacollection-common'], function (exports, ojvcomponentElement, DomUtils, DataCollectionUtils) {
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
  };

  exports.ActionCard = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(ActionCard, _ojvcomponentElement$);

    var _super = _createSuper(ActionCard);

    function ActionCard(props) {
      var _this;

      _classCallCheck(this, ActionCard);

      _this = _super.call(this, props);
      _this.state = {
        active: false,
        focus: false
      };

      _this._rootElemRef = function (element) {
        _this._rootElem = element;
      };

      return _this;
    }

    _createClass(ActionCard, [{
      key: "render",
      value: function render() {
        var _a;

        var classNameObj = {
          'oj-actioncard': true,
          'oj-active': this.state.active,
          'oj-focus-highlight': this.state.focus && !DomUtils.recentPointer()
        };
        var tabIndex = (_a = this.props.tabIndex) !== null && _a !== void 0 ? _a : 0;
        return ojvcomponentElement.h("oj-action-card", {
          tabIndex: tabIndex,
          class: classNameObj,
          role: 'button',
          onKeyup: this._handleKeyup,
          onMouseup: this._handleMouseup,
          onKeydown: this._handleKeydown,
          onMousedown: this._handleMousedown,
          onMousemove: this._handleMousemove,
          onTouchstart: this._handleTouchstart,
          onTouchend: this._handleTouchend,
          onTouchcancel: this._handleTouchcancel,
          onTouchmove: this._handleTouchmove,
          onFocusin: this._handleFocusin,
          onFocusout: this._handleFocusout,
          onOjAction: this._handleOjAction,
          ref: this._rootElemRef
        }, this.props.children);
      }
    }, {
      key: "_isFromActiveSource",
      value: function _isFromActiveSource(event) {
        return DataCollectionUtils.isEventClickthroughDisabled(event, this._rootElem);
      }
    }, {
      key: "_handleOjAction",
      value: function _handleOjAction(event) {
        if (this._isFromActiveSource(event)) {
          event.stopPropagation();
        }
      }
    }, {
      key: "_handleTouchstart",
      value: function _handleTouchstart(event) {
        if (!this._isFromActiveSource(event)) {
          this.updateState({
            active: true
          });
        }
      }
    }, {
      key: "_handleTouchend",
      value: function _handleTouchend(event) {
        var _a, _b;

        if (!this._isFromActiveSource(event)) {
          if (this.state.active) {
            this.updateState({
              active: false
            });
            (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, {
              originalEvent: event
            });
          }
        }
      }
    }, {
      key: "_handleTouchcancel",
      value: function _handleTouchcancel(event) {
        if (!this._isFromActiveSource(event)) {
          this.updateState({
            active: false
          });
        }
      }
    }, {
      key: "_handleTouchmove",
      value: function _handleTouchmove(event) {
        if (this.state.active) {
          if (!this._isFromActiveSource(event)) {
            this.updateState({
              active: false
            });
          }
        }
      }
    }, {
      key: "_handleKeydown",
      value: function _handleKeydown(event) {
        if (!this._isFromActiveSource(event)) {
          if (!event.repeat && (event.key === 'Enter' || event.key === ' ')) {
            this.updateState({
              active: true
            });
          }
        }
      }
    }, {
      key: "_handleKeyup",
      value: function _handleKeyup(event) {
        var _a, _b;

        if (!this._isFromActiveSource(event)) {
          if (event.key === 'Enter' || event.key === ' ') {
            this.updateState({
              active: false
            });
            (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, {
              originalEvent: event
            });
          }
        }
      }
    }, {
      key: "_handleMousedown",
      value: function _handleMousedown(event) {
        if (!this._isFromActiveSource(event)) {
          this.updateState({
            active: true
          });
        }
      }
    }, {
      key: "_handleMouseup",
      value: function _handleMouseup(event) {
        var _a, _b;

        if (!this._isFromActiveSource(event)) {
          if (this.state.active) {
            this.updateState({
              active: false
            });
            (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, {
              originalEvent: event
            });
          }
        }
      }
    }, {
      key: "_handleMousemove",
      value: function _handleMousemove(event) {
        if (this.state.active) {
          if (!this._isFromActiveSource(event)) {
            this.updateState({
              active: false
            });
          }
        }
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
    }]);

    return ActionCard;
  }(ojvcomponentElement.ElementVComponent);

  exports.ActionCard.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "tabIndex": 1,
        "role": 1
      }
    },
    "slots": {
      "": {}
    },
    "events": {
      "ojAction": {
        "bubbles": true
      }
    }
  };

  __decorate([ojvcomponentElement.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleOjAction", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleTouchstart", null);

  __decorate([ojvcomponentElement.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleTouchend", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleTouchcancel", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleTouchmove", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleKeydown", null);

  __decorate([ojvcomponentElement.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleKeyup", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleMousedown", null);

  __decorate([ojvcomponentElement.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleMouseup", null);

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleMousemove", null);

  __decorate([ojvcomponentElement.listener()], exports.ActionCard.prototype, "_handleFocusin", null);

  __decorate([ojvcomponentElement.listener()], exports.ActionCard.prototype, "_handleFocusout", null);

  exports.ActionCard = __decorate([ojvcomponentElement.customElement('oj-action-card')], exports.ActionCard);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())