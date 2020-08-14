define(['exports', 'ojs/ojvcomponent'], function (exports, ojvcomponent) { 'use strict';

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
     *                &lt;oj-bind-text value="default"></oj-bind-text>
     *             &lt;/div>
     *          &lt;/oj-list-item-layout>
     *       &lt;/li>
     *    &lt;/template>
     * &lt;/oj-list-view>
     * </code>
     */

    /**
     * <p>The <code class="prettyprint">default</code> slot accepts a default text. </p>
     *
     * @ojchild Default
     * @memberof oj.ojListItemLayout
     * @ojtsexample
     * &lt;oj-list-item-layout>
     *    &lt;div>
     *       &lt;oj-bind-text value="default"></oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     */

    /**
     * <p>The <code class="prettyprint">selector</code> slot can accept a oj-selector component and is optional.</p>
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
     * <p>The <code class="prettyprint">overline</code> slot is for adding a overline text above the default text.</p>
     *
     * @ojslot overline
     * @memberof oj.ojListItemLayout
     * @ojtsexample
     * &lt;oj-list-item-layout>
     *    &lt;div slot="overline">
     *       &lt;oj-bind-text value="overline"></oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     */

    /**
     * <p>The <code class="prettyprint">leading</code> slot is used for adding a leading visual
     * next to the selector. Start slot can be an image, avatar or initials.</p>
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
     * <p>The <code class="prettyprint">secondary</code> slot is for adding a secondary text below the default text.</p>
     *
     * @ojslot secondary
     * @memberof oj.ojListItemLayout
     * @ojtsexample
     * &lt;oj-list-item-layout>
     *    &lt;div slot="secondary">
     *       &lt;oj-bind-text value="secondary"></oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     */

    /**
     * <p>The <code class="prettyprint">tertiary</code> slot is for adding a tertiary text below the secondary text.</p>
     *
     * @ojslot tertiary
     * @memberof oj.ojListItemLayout
     * @ojtsexample
     * &lt;oj-list-item-layout>
     *    &lt;div slot="tertiary">
     *       &lt;oj-bind-text value="tertiary"></oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     */

    /**
     * <p>The <code class="prettyprint">metadata</code> for adding extra trailing information. Examples of metadata are author, date etc.
     *
     * @ojslot metadata
     * @memberof oj.ojListItemLayout
     * @ojtsexample
     * &lt;oj-list-item-layout>
     *    &lt;div slot="metadata">
     *       &lt;oj-bind-text value="metadata"></oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     */

    /**
     * <p>The <code class="prettyprint">trailing</code> slot is used for adding a trailing visual.</p>
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
     * <p>The <code class="prettyprint">action</code> slot for adding either one primary action or one or more secondary actions.
     *
     * @ojslot action
     * @memberof oj.ojListItemLayout
     * @ojtsexample
     * &lt;oj-list-item-layout>
     *    &lt;div slot="action">
     *       &lt;oj-button>Edit</oj-button>
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

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    class ListItemLayoutProps {
    }
    exports.ListItemLayout = class ListItemLayout extends ojvcomponent.VComponent {
        constructor() {
            super(...arguments);
            this._hasContent = (slotContent) => slotContent && slotContent.length > 0;
        }
        _getWrappedSlotContent(slotContent, wrapperClasses) {
            if (this._hasContent(slotContent)) {
                if (wrapperClasses && wrapperClasses.length > 0)
                    return ojvcomponent.h("div", { class: wrapperClasses }, slotContent);
                else
                    return ojvcomponent.h("div", null, slotContent);
            }
            return null;
        }
        render() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
            let tertiaryClass = '';
            if (this._hasContent((_b = (_a = this.props).secondary) === null || _b === void 0 ? void 0 : _b.call(_a)) && this._hasContent((_d = (_c = this.props).tertiary) === null || _d === void 0 ? void 0 : _d.call(_c)))
                tertiaryClass = 'oj-listitemlayout-tertiary';
            let leadingClass = '';
            if (!this._hasContent((_f = (_e = this.props).selector) === null || _f === void 0 ? void 0 : _f.call(_e)) && this._hasContent((_h = (_g = this.props).leading) === null || _h === void 0 ? void 0 : _h.call(_g)))
                leadingClass = 'oj-listitemlayout-horizontal-padding';
            let textSlotsClass = '';
            if (!this._hasContent((_k = (_j = this.props).selector) === null || _k === void 0 ? void 0 : _k.call(_j)))
                textSlotsClass =
                    'oj-listitemlayout-textslots oj-listitemlayout-horizontal-padding oj-listitemlayout-vertical-padding';
            else if (this._hasContent((_m = (_l = this.props).selector) === null || _m === void 0 ? void 0 : _m.call(_l))) {
                if (this._hasContent((_p = (_o = this.props).leading) === null || _p === void 0 ? void 0 : _p.call(_o)))
                    textSlotsClass =
                        'oj-listitemlayout-textslots oj-listitemlayout-horizontal-padding oj-listitemlayout-vertical-padding';
                else
                    textSlotsClass = 'oj-listitemlayout-textslots oj-listitemlayout-vertical-padding';
            }
            else
                textSlotsClass = 'oj-listitemlayout-textslots';
            return (ojvcomponent.h("oj-list-item-layout", null,
                ojvcomponent.h("div", { class: 'oj-listitemlayout' },
                    ojvcomponent.h("div", { class: 'oj-listitemlayout-allslots' },
                        this._hasContent((_r = (_q = this.props).selector) === null || _r === void 0 ? void 0 : _r.call(_q)) ? (ojvcomponent.h("div", null, this._getWrappedSlotContent((_t = (_s = this.props).selector) === null || _t === void 0 ? void 0 : _t.call(_s), 'oj-listitemlayout-selector'))) : null,
                        this._hasContent((_v = (_u = this.props).leading) === null || _v === void 0 ? void 0 : _v.call(_u)) ? (ojvcomponent.h("div", { class: leadingClass }, this._getWrappedSlotContent((_x = (_w = this.props).leading) === null || _x === void 0 ? void 0 : _x.call(_w), 'oj-listitemlayout-image oj-listitemlayout-vertical-padding'))) : null,
                        ojvcomponent.h("div", { class: textSlotsClass },
                            this._getWrappedSlotContent((_z = (_y = this.props).overline) === null || _z === void 0 ? void 0 : _z.call(_y)),
                            this._getWrappedSlotContent(this.props.children),
                            this._getWrappedSlotContent((_1 = (_0 = this.props).secondary) === null || _1 === void 0 ? void 0 : _1.call(_0)),
                            this._getWrappedSlotContent((_3 = (_2 = this.props).tertiary) === null || _3 === void 0 ? void 0 : _3.call(_2), tertiaryClass)),
                        this._getWrappedSlotContent((_5 = (_4 = this.props).metadata) === null || _5 === void 0 ? void 0 : _5.call(_4), 'oj-listitemlayout-horizontal-padding  oj-listitemlayout-vertical-padding'),
                        this._getWrappedSlotContent((_7 = (_6 = this.props).trailing) === null || _7 === void 0 ? void 0 : _7.call(_6), 'oj-listitemlayout-image oj-listitemlayout-horizontal-padding  oj-listitemlayout-vertical-padding'),
                        this._getWrappedSlotContent((_9 = (_8 = this.props).action) === null || _9 === void 0 ? void 0 : _9.call(_8), 'oj-listitemlayout-action  oj-clickthrough-disabled oj-listitemlayout-horizontal-padding  oj-listitemlayout-vertical-padding')))));
        }
    };
    exports.ListItemLayout.metadata = { "extension": { "_DEFAULTS": ListItemLayoutProps }, "slots": { "selector": {}, "leading": {}, "overline": {}, "": {}, "secondary": {}, "tertiary": {}, "link": {}, "metadata": {}, "trailing": {}, "action": {} } };
    exports.ListItemLayout = __decorate([
        ojvcomponent.customElement('oj-list-item-layout')
    ], exports.ListItemLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
