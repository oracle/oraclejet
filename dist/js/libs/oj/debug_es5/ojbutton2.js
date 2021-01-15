(function() {
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

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

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdomutils', 'ojs/ojgestureutils', 'ojs/ojvcomponent-element', 'ojs/ojvmenu', 'ojs/ojvcomponent-binding', 'ojs/ojthemeutils'], function (exports, DomUtils, GestureUtils, ojvcomponentElement, ojvmenu, ojvcomponentBinding, ThemeUtils) {
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

  var Button2_1;

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.disabled = false;
    this.display = 'all';
    this.translations = {};
  };

  __decorate([ojvcomponentElement.dynamicDefault(getChromingDefault)], Props.prototype, "chroming", void 0);

  function getChromingDefault() {
    return (ThemeUtils.parseJSONFromFontFamily('oj-button-option-defaults') || {}).chroming || 'solid';
  }

  exports.Button2 = Button2_1 = /*#__PURE__*/function (_ojvcomponentElement$) {
    _inherits(Button2, _ojvcomponentElement$);

    var _super = _createSuper(Button2);

    function Button2(props) {
      var _this;

      _classCallCheck(this, Button2);

      _this = _super.call(this, props);

      _this._handleContextMenuGesture = function (event, eventType) {
        var contextMenuEvent = {
          event: event,
          eventType: eventType
        };
        event.preventDefault();

        _this.updateState({
          contextMenuTriggerEvent: contextMenuEvent
        });
      };

      _this._onCloseCallback = function (event) {
        if (_this.state.contextMenuTriggerEvent) {
          _this.updateState({
            contextMenuTriggerEvent: null
          });
        }
      };

      _this.state = {};
      return _this;
    }

    _createClass(Button2, [{
      key: "render",
      value: function render() {
        var _this2 = this;

        var props = this.props;
        var defaultSlot = props.children;

        var startIconContent = this._processIcon(props.startIcon, 'oj-button-icon oj-start');

        var endIconContent = this._processIcon(props.endIcon, 'oj-button-icon oj-end');

        var ariaLabel = this.props['aria-label'];
        var ariaLabelledBy = this.props['aria-labelledby'];
        var hasDefaultAriaAttribute = ariaLabel || ariaLabelledBy;
        var title = props.title;
        var defaultContent = null;
        var clickHandler = null;
        var ariaLabelledById = null;
        var buttonLabel = props.label || defaultSlot;

        if (buttonLabel) {
          title = title || props.label || this.state.derivedTitle;

          if (props.display === 'icons' && (startIconContent || endIconContent)) {
            if (props.label) {
              if (!hasDefaultAriaAttribute) {
                ariaLabel = props.label;
              }
            } else {
              if (!hasDefaultAriaAttribute) {
                ariaLabelledById = this.uniqueId() + '|text';
                ariaLabelledBy = ariaLabelledById;
              }

              defaultContent = ojvcomponentElement.h("span", {
                class: 'oj-button-text oj-helper-hidden-accessible',
                id: ariaLabelledById
              }, buttonLabel);
            }
          } else {
            if (!hasDefaultAriaAttribute) {
              ariaLabelledById = this.uniqueId() + '|text';
              ariaLabelledBy = ariaLabelledById;
            }

            defaultContent = ojvcomponentElement.h("span", {
              class: 'oj-button-text',
              id: ariaLabelledById
            }, buttonLabel);
          }
        }

        defaultContent = ojvcomponentElement.h("span", {
          ref: function ref(elem) {
            return _this2._defaultSlotRef = elem;
          }
        }, defaultContent);
        var labelContent = ojvcomponentElement.h("div", {
          class: 'oj-button-label'
        }, startIconContent, defaultContent, endIconContent);
        var buttonContent;

        if (props.disabled) {
          buttonContent = ojvcomponentElement.h("button", {
            class: 'oj-button-button',
            "aria-labelledby": ariaLabelledBy,
            "aria-label": ariaLabel,
            disabled: true
          }, labelContent);
        } else {
          clickHandler = this._handleClick;
          buttonContent = ojvcomponentElement.h("button", {
            class: 'oj-button-button',
            ref: function ref(elem) {
              return _this2._buttonRef = elem;
            },
            "aria-labelledby": ariaLabelledBy,
            "aria-label": ariaLabel,
            onTouchstart: this._handleTouchstart,
            onTouchend: this._handleTouchend,
            onTouchcancel: this._handleTouchend,
            onMouseenter: this._handleMouseenter,
            onMouseleave: this._handleMouseleave,
            onMousedown: this._handleMousedown,
            onMouseup: this._handleMouseup,
            onKeydown: this._handleKeydown,
            onKeyup: this._handleKeyup,
            onFocusin: this._handleFocusin,
            onFocusout: this._handleFocusout,
            onFocus: this._handleFocus,
            onBlur: this._handleBlur
          }, labelContent);
        }

        var rootClasses = this._getRootClasses(startIconContent, endIconContent);

        return ojvcomponentElement.h("oj-button", {
          class: rootClasses,
          title: title,
          onClick: clickHandler,
          ref: function ref(elem) {
            return _this2._rootRef = elem;
          }
        }, buttonContent, this._renderContextMenu());
      }
    }, {
      key: "_renderContextMenu",
      value: function _renderContextMenu() {
        if (!this.state.contextMenuTriggerEvent || !this.props.contextMenu) {
          return null;
        }

        return ojvcomponentElement.h(ojvmenu.VMenu, {
          eventObj: this.state.contextMenuTriggerEvent,
          launcherElement: this._buttonRef,
          onCloseCallback: this._onCloseCallback
        }, [this.props.contextMenu]);
      }
    }, {
      key: "_processIcon",
      value: function _processIcon(icon, slotClass) {
        var _this3 = this;

        var iconContent;

        if (Array.isArray(icon)) {
          iconContent = icon.map(function (elem) {
            return _this3._processIcon(elem, slotClass);
          });
        } else if (icon) {
          iconContent = ojvcomponentElement.h("span", {
            class: slotClass
          }, icon);
        }

        return iconContent;
      }
    }, {
      key: "_getRootClasses",
      value: function _getRootClasses(startIconContent, endIconContent) {
        var defaultState = true;
        var classList = 'oj-button ' + Button2_1._chromingMap[this.props.chroming];
        classList += ' ' + this._getDisplayOptionClass(startIconContent, endIconContent);

        if (this.props.disabled) {
          defaultState = false;
          classList += ' oj-disabled';
        } else {
          classList += ' oj-enabled';

          if (this.state.hover) {
            defaultState = false;
            classList += ' oj-hover';
          }

          if (this.state.active) {
            defaultState = false;
            classList += ' oj-active';
          }

          if (this.state.focus) {
            if (defaultState) {
              classList += ' oj-focus-only';
            }

            defaultState = false;
            classList += ' oj-focus';

            if (!DomUtils.recentPointer()) {
              classList += ' oj-focus-highlight';
            }
          }
        }

        if (defaultState) {
          classList += ' oj-default';
        }

        return classList;
      }
    }, {
      key: "_getDisplayOptionClass",
      value: function _getDisplayOptionClass(startIconContent, endIconContent) {
        var multipleIcons = startIconContent && endIconContent;
        var atLeastOneIcon = startIconContent || endIconContent;
        var displayIsIcons = this.props.display === 'icons';
        var buttonClass;

        if (atLeastOneIcon) {
          if (displayIsIcons) {
            if (multipleIcons) {
              buttonClass = 'oj-button-icons-only';
            } else {
              buttonClass = 'oj-button-icon-only';
            }
          } else if (multipleIcons) {
            buttonClass = 'oj-button-text-icons';
          } else if (startIconContent) {
            buttonClass = 'oj-button-text-icon-start';
          } else {
            buttonClass = 'oj-button-text-icon-end';
          }
        } else {
          buttonClass = 'oj-button-text-only';
        }

        return buttonClass;
      }
    }, {
      key: "_addMutationObserver",
      value: function _addMutationObserver() {
        var _this4 = this;

        if (this._mutationObserver) {
          return;
        }

        var config = {
          subtree: true,
          characterData: true
        };

        var callback = function callback() {
          var title = _this4._getTextContent();

          if (title != _this4.state.derivedTitle) {
            _this4.updateState({
              derivedTitle: title
            });
          }
        };

        this._mutationObserver = new MutationObserver(callback);

        this._mutationObserver.observe(this._defaultSlotRef, config);
      }
    }, {
      key: "_needsContextMenuDetection",
      value: function _needsContextMenuDetection(props) {
        return props.contextMenu && !props.disabled;
      }
    }, {
      key: "mounted",
      value: function mounted() {
        this._updateDerivedTitle();

        if (this._needsContextMenuDetection(this.props)) {
          GestureUtils.startDetectContextMenuGesture(this._rootRef, this._handleContextMenuGesture);
        }
      }
    }, {
      key: "updated",
      value: function updated(oldProps) {
        this._updateDerivedTitle();

        this._updateContextMenuDetection(oldProps);
      }
    }, {
      key: "_updateDerivedTitle",
      value: function _updateDerivedTitle() {
        var props = this.props;
        var title;

        if (props.display === 'icons' && (props.startIcon || props.endIcon) && !props.label && !props.title) {
          title = this._getTextContent();

          this._addMutationObserver();
        }

        if (title != this.state.derivedTitle) {
          this.updateState({
            derivedTitle: title
          });
        }
      }
    }, {
      key: "_updateContextMenuDetection",
      value: function _updateContextMenuDetection(oldProps) {
        var oldNeedsDetect = this._needsContextMenuDetection(oldProps);

        var newNeedsDetect = this._needsContextMenuDetection(this.props);

        if (oldNeedsDetect != newNeedsDetect) {
          if (newNeedsDetect) {
            GestureUtils.startDetectContextMenuGesture(this._rootRef, this._handleContextMenuGesture);
          } else {
            GestureUtils.stopDetectContextMenuGesture(this._rootRef);
          }
        }
      }
    }, {
      key: "_getTextContent",
      value: function _getTextContent() {
        var content = this._defaultSlotRef.textContent;
        content = content.trim();

        if (content !== '') {
          return content;
        }

        return null;
      }
    }, {
      key: "unmounted",
      value: function unmounted() {
        if (this._mutationObserver) {
          this._mutationObserver.disconnect();

          this._mutationObserver = null;
        }

        GestureUtils.stopDetectContextMenuGesture(this._rootRef);
      }
    }, {
      key: "_handleTouchstart",
      value: function _handleTouchstart(event) {
        this.updateState({
          active: true
        });
      }
    }, {
      key: "_handleTouchend",
      value: function _handleTouchend(event) {
        this.updateState({
          active: false
        });
      }
    }, {
      key: "_handleMouseenter",
      value: function _handleMouseenter(event) {
        if (!DomUtils.recentTouchEnd()) {
          if (this === Button2_1._lastActive) {
            this.updateState({
              active: true
            });
          }

          this.updateState({
            hover: true
          });
        }
      }
    }, {
      key: "_handleMouseleave",
      value: function _handleMouseleave(event) {
        this.updateState({
          hover: false,
          active: false
        });
      }
    }, {
      key: "_handleMousedown",
      value: function _handleMousedown(event) {
        if (event.which === 1 && !DomUtils.recentTouchEnd()) {
          this.updateState({
            active: true
          });
          Button2_1._lastActive = this;

          var docMouseupListener = function docMouseupListener() {
            Button2_1._lastActive = null;
            document.removeEventListener('mouseup', docMouseupListener, true);
          };

          document.addEventListener('mouseup', docMouseupListener, true);
        }
      }
    }, {
      key: "_handleMouseup",
      value: function _handleMouseup(event) {
        this.updateState({
          active: false
        });
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(event) {
        var _a, _b;

        if (event.detail <= 1) {
          (_b = (_a = this.props).onOjAction) === null || _b === void 0 ? void 0 : _b.call(_a, {
            originalEvent: event
          });
        }
      }
    }, {
      key: "_handleKeydown",
      value: function _handleKeydown(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
          this.updateState({
            active: true
          });
        }
      }
    }, {
      key: "_handleKeyup",
      value: function _handleKeyup(event) {
        this.updateState({
          active: false
        });
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
      key: "_handleFocus",
      value: function _handleFocus(event) {
        var _a;

        (_a = this._rootRef) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('focus', {
          relatedTarget: event.relatedTarget
        }));
      }
    }, {
      key: "_handleBlur",
      value: function _handleBlur(event) {
        var _a;

        this.updateState({
          active: false
        });
        (_a = this._rootRef) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new FocusEvent('blur', {
          relatedTarget: event.relatedTarget
        }));
      }
    }, {
      key: "refresh",
      value: function refresh() {
        this.render();
      }
    }, {
      key: "focus",
      value: function focus() {
        var _a;

        (_a = this._buttonRef) === null || _a === void 0 ? void 0 : _a.focus();
      }
    }, {
      key: "blur",
      value: function blur() {
        var _a;

        (_a = this._buttonRef) === null || _a === void 0 ? void 0 : _a.blur();
      }
    }], [{
      key: "updateStateFromProps",
      value: function updateStateFromProps(props) {
        if (props.disabled) {
          return {
            contextMenuTriggerEvent: null
          };
        }

        return null;
      }
    }]);

    return Button2;
  }(ojvcomponentElement.ElementVComponent);

  exports.Button2._chromingMap = {
    solid: 'oj-button-full-chrome',
    outlined: 'oj-button-outlined-chrome',
    borderless: 'oj-button-half-chrome',
    full: 'oj-button-full-chrome',
    half: 'oj-button-half-chrome',
    callToAction: 'oj-button-cta-chrome'
  };
  exports.Button2.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "title": 1,
        "aria-label": 1,
        "aria-labelledby": 1
      }
    },
    "slots": {
      "": {},
      "startIcon": {},
      "endIcon": {},
      "contextMenu": {}
    },
    "properties": {
      "disabled": {
        "type": "boolean",
        "value": false
      },
      "display": {
        "type": "string",
        "enumValues": ["all", "icons"],
        "value": "all"
      },
      "label": {
        "type": "string"
      },
      "translations": {
        "type": "object|null",
        "value": {}
      },
      "chroming": {
        "type": "string",
        "enumValues": ["borderless", "callToAction", "full", "half", "outlined", "solid"],
        "binding": {
          "consume": {
            "name": "containerChroming"
          }
        }
      }
    },
    "events": {
      "ojAction": {
        "bubbles": true
      }
    },
    "methods": {
      "refresh": {},
      "focus": {},
      "blur": {}
    }
  };

  __decorate([ojvcomponentElement.listener({
    passive: true
  })], exports.Button2.prototype, "_handleTouchstart", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleTouchend", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleMouseenter", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleMouseleave", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleMousedown", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleMouseup", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleClick", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleKeydown", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleKeyup", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleFocusin", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleFocusout", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleFocus", null);

  __decorate([ojvcomponentElement.listener()], exports.Button2.prototype, "_handleBlur", null);

  exports.Button2 = Button2_1 = __decorate([ojvcomponentElement.customElement('oj-button')], exports.Button2);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});

}())