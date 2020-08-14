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

define(['exports', 'ojs/ojvcomponent', 'ojs/ojdomutils'], function (exports, ojvcomponent, DomUtils) {
  'use strict';
  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @ojcomponent oj.ojActionCard
   * @ojtsvcomponent
   * @ojsignature {target: "Type", value: "class ojActionCard extends JetElement<ojActionCardSettableProperties>"}
   * @since 9.1.0
   * @ojmetadata since "9.0.0"
   * @ojdisplayname Action Card
   * @ojshortdesc An Action Card is an actionable container rendering related information
   * @ojuxspecs ['card']
   *
   * @classdesc
   * <h3 id="ActionCardOverview-section">
   *   JET Action
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#CardOverview-section"></a>
   * </h3>
   * <p>Description: Themeable, WAI-ARIA-compliant element that represents a card.</p>
   * <p>A JET Action Card provides a styled rectangular area with hover/focus/active state rendering,
   * along with an ojAction event.  It is used to enclosed a layout card component or
   * or generic html.
   *
   * The action card is intended for consumption by waterfall containers.
   *
   *
   * <pre class="prettyprint">
   * <code>
   *&lt;oj-action-card on-oj-action="[[actionHandler]]">
   *   Sample Text
   * &lt;/oj-action-card>
   *
   *</code></pre>
   *
   * <p> As oj-action-card does not style the enclosed content, the
   * application is responsible for ensuring that text colors used will satisfy the 3.1 contrast ratio between
   * background color and text to comply with accessibility requirements.
   *
   * <h3 id="touch-section">
   *   Touch End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"touchDoc"}
   *
   *
   * <h3 id="keyboard-section">
   *   Keyboard End User Information
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
   * </h3>
   *
   * {@ojinclude "name":"keyboardDoc"}
   *
   *
   * <h3 id="a11y-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
   * </h3>
   *
   * <p>For accessibility, a JET Button2 that doesn't have any text in its default slot (making it an icon-only button) should include an aria-label attribute
   * that indicate its purpose.
   *
   *
   */

  /**
   * <p>Triggered when an action card is clicked. This will be triggered by keyboard events as well as mouse/touch events.</p>
   *
   * <p>When double-clicking or multi-clicking (as determined by the browser), only the first click will trigger the ojAction event.</p>
   *
   * <p>To ensure keyboard accessibility, the only correct, supported way to react to the click of a card is to listen
   * for this event. Click listeners should not be used.</p>
     * @member
   * @name action
   * @memberof oj.ojActionCard
   * @instance
   * @event
   * @ojshortdesc Triggered when a card is clicked, whether by keyboard, mouse, or touch events.  To meet accessibility requirements, the only supported way to react to the click of a button is to listen for this event.
   * @ojcancelable
   * @ojbubbles
   * @ojeventgroup common
   * @since 9.1.0
   */

  /**
   * <p>The <code class="prettyprint">Default</code> slot is the actions's body. It should not be explicitly named.</p>
   *
   * @ojchild Default
   * @memberof oj.ojActionCard
   * @displayName default
   * @ojshortdesc The default slot is the card's content.  It accepts and renders one or more nodes.
   * @ojtsexample <caption>Displays the content in the central area of the action</caption>
   * &lt;oj-action-card>
   *    Default Card
   * &lt;/oj-action-card>
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
   * @memberof oj.ojActionCard
   * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
   * @instance
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
   * @memberof oj.ojActionCard
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
   * @memberof oj.ojActionCard
   * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
   * @instance
   *
   * @example <caption>Set a batch of properties:</caption>
   * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
   */
  // Fragments:

  /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Gesture</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Action Card</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Invoke the card's action.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojActionCard
   * @instance
   */

  /**
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>Action Card</td>
   *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
   *       <td>Invoke the card's action</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojActionCard
   * @instance
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

  var _CLICKTHROUGH_ATTR = 'data-oj-clickthrough';

  var Props = function Props() {
    _classCallCheck(this, Props);
  };

  exports.ActionCard = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(ActionCard, _ojvcomponent$VCompon);

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
        return ojvcomponent.h("oj-action-card", {
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
        var node = event.target;

        if (node === this._rootElem) {
          return false;
        }

        while (node != this._rootElem) {
          if (node.hasAttribute(_CLICKTHROUGH_ATTR)) {
            if (node.getAttribute(_CLICKTHROUGH_ATTR) === 'disabled') {
              return true;
            }
          }

          node = node.parentNode;
        }

        return false;
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
            event.preventDefault();
            event.stopPropagation();
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
            event.preventDefault();
            event.stopPropagation();
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
            event.preventDefault();
            event.stopPropagation();
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
  }(ojvcomponent.VComponent);

  exports.ActionCard.metadata = {
    "extension": {
      "_DEFAULTS": Props,
      "_ROOT_PROPS_MAP": {
        "tabIndex": true,
        "role": true
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

  __decorate([ojvcomponent.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleOjAction", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleTouchstart", null);

  __decorate([ojvcomponent.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleTouchend", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleTouchcancel", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleTouchmove", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleKeydown", null);

  __decorate([ojvcomponent.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleKeyup", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleMousedown", null);

  __decorate([ojvcomponent.listener({
    passive: false
  })], exports.ActionCard.prototype, "_handleMouseup", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.ActionCard.prototype, "_handleMousemove", null);

  __decorate([ojvcomponent.listener()], exports.ActionCard.prototype, "_handleFocusin", null);

  __decorate([ojvcomponent.listener()], exports.ActionCard.prototype, "_handleFocusout", null);

  exports.ActionCard = __decorate([ojvcomponent.customElement('oj-action-card')], exports.ActionCard);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())