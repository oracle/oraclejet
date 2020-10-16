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

define(['exports', 'ojs/ojvcomponent'], function (exports, ojvcomponent) {
  'use strict';
  /**
   * @license
   * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */

  /**
   * @ojcomponent oj.ojListItemLayout
   * @ojtsvcomponent
   * @ojsignature {target: "Type", value: "class ojListItemLayout extends JetElement<ojListItemLayoutSettableProperties>"}
   * @since 9.0.0
   * @ojdisplayname List Item Layout
   * @ojshortdesc A List Item Layout represents layout used for list view item elements.
   * @ojvbdefaultcolumns 12
   * @ojvbmincolumns 2
   *
   * @ojuxspecs ['list-view']
   *
   * @classdesc
   * <h3 id="ListItemLayoutOverview-section">
   *   JET ListItem Layout
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ListItemLayoutOverview-section"></a>
   * </h3>
   * <p>Description: A JET ListItemLayout component helps application teams to easily layout their
   * content into different slots.</p>
   * <pre class="prettyprint">
   * <code>//ListItemLayout with text
   * &lt;oj-list-view id="listview1" aria-label="list layout within list view" data="[[dataProvider]]" style="width: 450px;"
   *                  selected="{{selectorSelectedItems}}" selection-mode="multiple">
   *    &lt;template slot="itemTemplate" data-oj-as="item">
   *       &lt;li>
   *          &lt;oj-list-item-layout>
   *             &lt;oj-selector slot='selector' selected-keys='{{selectorSelectedItems}}' key='[[item.data.id]]'>
   *             &lt;/oj-selector>
   *             &lt;div>
   *                &lt;oj-bind-text value="default">&lt;/oj-bind-text>
   *             &lt;/div>
   *          &lt;/oj-list-item-layout>
   *       &lt;/li>
   *    &lt;/template>
   * &lt;/oj-list-view>
   * </code>
   */

  /**
   * <p>The <code class="prettyprint">default</code> slot accepts default text. </p>
   *
   * @ojchild Default
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div>
   *       &lt;oj-bind-text value="default">&lt;/oj-bind-text>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">selector</code> slot can accept an oj-selector component and is optional.</p>
   *
   * @ojslot selector
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;oj-selector slot='selector' selected-keys='{{selectorSelectedItems}}' key='[[item.data.id]]'>
   *    &lt;/oj-selector>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">overline</code> slot is used for adding overline text above the default text.</p>
   *
   * @ojslot overline
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="overline">
   *       &lt;oj-bind-text value="overline">&lt;/oj-bind-text>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">leading</code> slot is used for adding a leading visual
   * next to the selector. Leading slot content can be a badge, image, avatar or initials.</p>
   *
   * @ojslot leading
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;oj-avatar slot='leading' role="img" size="xs" initials='[[item.data.initials]]'
   *                  src="[[item.data.image]]" :aria-label="[['Avatar of ' + item.data.name]]"
   *                  :title="[['Avatar of ' + item.data.name]]">
   *    &lt;/oj-avatar>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">secondary</code> slot is used for adding secondary text below the default text.</p>
   *
   * @ojslot secondary
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="secondary">
   *       &lt;oj-bind-text value="secondary">&lt;/oj-bind-text>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">tertiary</code> slot is used for adding tertiary text below the secondary text.</p>
   *
   * @ojslot tertiary
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="tertiary">
   *       &lt;oj-bind-text value="tertiary">&lt;/oj-bind-text>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">metadata</code> slot is used for adding extra trailing information. Examples of metadata are author, date etc.
   *
   * @ojslot metadata
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="metadata">
   *       &lt;oj-bind-text value="metadata">&lt;/oj-bind-text>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">trailing</code> slot is used for adding a trailing visual.
   * Trailing slot content can be a badge, image or icon.</p>
   * @ojslot trailing
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;oj-avatar slot='trailing' role="img" size="xs" initials='[[item.data.initials]]'
   *                  src="[[item.data.image]]" :aria-label="[['Avatar of ' + item.data.name]]"
   *                  :title="[['Avatar of ' + item.data.name]]">
   *    &lt;/oj-avatar>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">action</code> slot is used for adding either one primary action or one or more secondary actions.
   *
   * @ojslot action
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="action">
   *       &lt;oj-button>Edit&lt;/oj-button>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">quaternary</code> slot is used for adding quaternary text below the tertiary text.</p>
   *
   * @ojslot quaternary
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="quaternary">
   *       &lt;oj-bind-text value="quaternary">&lt;/oj-bind-text>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
   */

  /**
   * <p>The <code class="prettyprint">navigation</code> slot is used for adding a navigation control, such as a link or button.</p>
   *
   * @ojslot navigation
   * @memberof oj.ojListItemLayout
   * @ojtsexample
   * &lt;oj-list-item-layout>
   *    &lt;div slot="navigation">
   *       &lt;oj-button>navigation&lt;/oj-button>
   *    &lt;/div>
   * &lt;/oj-list-item-layout>
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
   * @memberof oj.ojListItemLayout
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
   * @memberof oj.ojListItemLayout
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
   * @memberof oj.ojListItemLayout
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

  var ListItemLayoutProps = function ListItemLayoutProps() {
    _classCallCheck(this, ListItemLayoutProps);
  };

  exports.ListItemLayout = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(ListItemLayout, _ojvcomponent$VCompon);

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
          if (wrapperClasses && wrapperClasses.length > 0) return ojvcomponent.h("div", {
            class: wrapperClasses
          }, slotContent);else return ojvcomponent.h("div", null, slotContent);
        }

        return null;
      }
    }, {
      key: "render",
      value: function render() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;

        var props = this.props;

        var hasExtra = this._hasContent((_a = props.metadata) === null || _a === void 0 ? void 0 : _a.call(props)) || this._hasContent((_b = props.action) === null || _b === void 0 ? void 0 : _b.call(props)) || this._hasContent((_c = props.trailing) === null || _c === void 0 ? void 0 : _c.call(props));

        var hasBottom = this._hasContent((_d = props.quaternary) === null || _d === void 0 ? void 0 : _d.call(props)) || this._hasContent((_e = props.navigation) === null || _e === void 0 ? void 0 : _e.call(props));

        var tertiaryClass = '';
        if (this._hasContent((_f = props.secondary) === null || _f === void 0 ? void 0 : _f.call(props)) && this._hasContent((_g = props.tertiary) === null || _g === void 0 ? void 0 : _g.call(props))) tertiaryClass = 'oj-listitemlayout-tertiary';
        var leadingClass = hasBottom ? 'oj-listitemlayout-leading oj-listitemlayout-vertical-padding-quaternary ' : 'oj-listitemlayout-leading oj-listitemlayout-vertical-padding ';

        if (!this._hasContent((_h = props.selector) === null || _h === void 0 ? void 0 : _h.call(props)) && this._hasContent((_j = props.leading) === null || _j === void 0 ? void 0 : _j.call(props))) {
          leadingClass = leadingClass + ' oj-listitemlayout-horizontal-padding';
        }

        var textSlotClass = hasBottom ? 'oj-listitemlayout-textslots oj-listitemlayout-vertical-padding-quaternary ' : 'oj-listitemlayout-textslots oj-listitemlayout-vertical-padding ';
        if (!(this._hasContent((_k = props.selector) === null || _k === void 0 ? void 0 : _k.call(props)) && !this._hasContent((_l = props.leading) === null || _l === void 0 ? void 0 : _l.call(props)))) textSlotClass = textSlotClass + ' oj-listitemlayout-horizontal-padding';
        var metadataClass = hasBottom ? 'oj-listitemlayout-metadata oj-listitemlayout-horizontal-padding oj-listitemlayout-vertical-padding-quaternary ' : 'oj-listitemlayout-metadata oj-listitemlayout-horizontal-padding oj-listitemlayout-vertical-padding';
        var trailingClass = hasBottom ? 'oj-listitemlayout-trailing oj-listitemlayout-image oj-listitemlayout-horizontal-padding oj-listitemlayout-vertical-padding-quaternary ' : 'oj-listitemlayout-trailing oj-listitemlayout-image oj-listitemlayout-horizontal-padding oj-listitemlayout-vertical-padding ';
        return ojvcomponent.h("oj-list-item-layout", null, ojvcomponent.h("div", {
          class: 'oj-listitemlayout-grid'
        }, this._getWrappedSlotContent((_m = props.selector) === null || _m === void 0 ? void 0 : _m.call(props), 'oj-listitemlayout-selector'), this._getWrappedSlotContent((_o = props.leading) === null || _o === void 0 ? void 0 : _o.call(props), leadingClass), ojvcomponent.h("div", {
          class: textSlotClass
        }, this._getWrappedSlotContent((_p = props.overline) === null || _p === void 0 ? void 0 : _p.call(props)), this._getWrappedSlotContent(props.children), this._getWrappedSlotContent((_q = props.secondary) === null || _q === void 0 ? void 0 : _q.call(props)), this._getWrappedSlotContent((_r = props.tertiary) === null || _r === void 0 ? void 0 : _r.call(props), tertiaryClass)), hasExtra ? ojvcomponent.h("div", {
          class: 'oj-listitemlayout-extra oj-listitemlayout-align'
        }, this._getWrappedSlotContent((_s = props.metadata) === null || _s === void 0 ? void 0 : _s.call(props), metadataClass), this._getWrappedSlotContent((_t = props.trailing) === null || _t === void 0 ? void 0 : _t.call(props), trailingClass), this._getWrappedSlotContent((_u = props.action) === null || _u === void 0 ? void 0 : _u.call(props), 'oj-listitemlayout-action oj-listitemlayout-horizontal-padding oj-clickthrough-disabled')) : null, this._getWrappedSlotContent((_v = props.quaternary) === null || _v === void 0 ? void 0 : _v.call(props), 'oj-listitemlayout-quaternary oj-listitemlayout-horizontal-padding'), this._getWrappedSlotContent((_w = props.navigation) === null || _w === void 0 ? void 0 : _w.call(props), 'oj-listitemlayout-navigation oj-clickthrough-disabled')));
      }
    }]);

    return ListItemLayout;
  }(ojvcomponent.VComponent);

  exports.ListItemLayout.metadata = {
    "extension": {
      "_DEFAULTS": ListItemLayoutProps
    },
    "slots": {
      "selector": {},
      "leading": {},
      "overline": {},
      "": {},
      "secondary": {},
      "tertiary": {},
      "metadata": {},
      "trailing": {},
      "action": {},
      "quaternary": {},
      "navigation": {}
    }
  };
  exports.ListItemLayout = __decorate([ojvcomponent.customElement('oj-list-item-layout')], exports.ListItemLayout);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())