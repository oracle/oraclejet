(function() {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojmenu', 'ojs/ojvcomponent', 'ojs/ojpopupcore'], function (exports, ojmenu, ojvcomponent, ojpopupcore) {
  'use strict';

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.launcherElement = null;
  };

  var VMenu = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(VMenu, _ojvcomponent$VCompon);

    var _super = _createSuper(VMenu);

    function VMenu(props) {
      _classCallCheck(this, VMenu);

      return _super.call(this, props);
    }

    _createClass(VMenu, [{
      key: "render",
      value: function render() {
        var _this = this;

        return ojvcomponent.h("div", {
          style: {
            display: 'none'
          },
          ref: function ref(elem) {
            return _this._rootRef = elem;
          }
        }, this.props.children);
      }
    }, {
      key: "mounted",
      value: function mounted() {
        if (!this._menuElement) {
          this._menuElement = this._getMenu();

          if (this._menuElement !== null) {
            this._openMenu();
          }
        }
      }
    }, {
      key: "_getMenu",
      value: function _getMenu() {
        var menu = this._rootRef.firstChild;
        return menu;
      }
    }, {
      key: "_openMenu",
      value: function _openMenu() {
        var openOption = this._getOpenOptions();

        this._menuElement['__openingContextMenu'] = true;

        try {
          this._menuElement.open(this.props.eventObj.event, openOption);

          this._addCloseListener();
        } catch (error) {
          throw error;
        } finally {
          this._menuElement['__openingContextMenu'] = false;
        }
      }
    }, {
      key: "_addCloseListener",
      value: function _addCloseListener() {
        if (!this.props.onCloseCallback) {
          return;
        }

        this._menuElement.addEventListener('ojClose', this.props.onCloseCallback);
      }
    }, {
      key: "_getOpenOptions",
      value: function _getOpenOptions() {
        var eventType = this.props.eventObj.eventType || 'keyboard';
        var openOption = {
          launcher: this.props.launcherElement,
          position: Object.assign(Object.assign({}, VMenu._MENU_POSITION[eventType]), {
            of: eventType === 'keyboard' ? this.props.launcherElement : this.props.eventObj.event
          }),
          initialFocus: 'menu'
        };
        return openOption;
      }
    }, {
      key: "unmounted",
      value: function unmounted() {
        if (this._rootRef) {
          ojpopupcore.PopupService.getInstance().close(_defineProperty({}, ojpopupcore.PopupService.OPTION.POPUP, this._rootRef));
        }

        this._removeCloseListener();
      }
    }, {
      key: "_removeCloseListener",
      value: function _removeCloseListener() {
        if (this._menuElement && this.props.onCloseCallback) {
          this._menuElement.removeEventListener('ojClose', this.props.onCloseCallback);
        }
      }
    }]);

    return VMenu;
  }(ojvcomponent.VComponent);

  VMenu._MENU_POSITION = {
    mouse: {
      my: 'start top',
      at: 'start bottom',
      collision: 'flipfit'
    },
    touch: {
      my: 'start>40 center',
      at: 'start bottom',
      collision: 'flipfit'
    },
    keyboard: {
      my: 'start top',
      at: 'start bottom',
      collision: 'flipfit'
    }
  };
  VMenu.metadata = {
    "extension": {
      "_DEFAULTS": Props
    }
  };
  exports.VMenu = VMenu;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())