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
        render() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
            const selectorSlot = (_b = (_a = this.props).selector) === null || _b === void 0 ? void 0 : _b.call(_a);
            const leadingSlot = (_d = (_c = this.props).leading) === null || _d === void 0 ? void 0 : _d.call(_c);
            const defaultSlot = this.props.children;
            const secondarySlot = (_f = (_e = this.props).secondary) === null || _f === void 0 ? void 0 : _f.call(_e);
            const tertiarySlot = (_h = (_g = this.props).tertiary) === null || _h === void 0 ? void 0 : _h.call(_g);
            const metadataSlot = (_k = (_j = this.props).metadata) === null || _k === void 0 ? void 0 : _k.call(_j);
            const hasSelector = (selectorSlot === null || selectorSlot === void 0 ? void 0 : selectorSlot.length) > 0;
            const hasLeading = (leadingSlot === null || leadingSlot === void 0 ? void 0 : leadingSlot.length) > 0;
            let tertiaryClass = {
                'oj-listitemlayout-tertiary-padding': (secondarySlot === null || secondarySlot === void 0 ? void 0 : secondarySlot.length) > 0 && (tertiarySlot === null || tertiarySlot === void 0 ? void 0 : tertiarySlot.length) > 0
            };
            return (ojvcomponent.h("oj-list-item-layout", null,
                ojvcomponent.h("div", { class: 'oj-listitemlayout' },
                    hasSelector ? (ojvcomponent.h("div", null,
                        ojvcomponent.h("div", { class: 'oj-listitemlayout-selector' }, selectorSlot))) : null,
                    ojvcomponent.h("div", { class: 'oj-listitemlayout-content' },
                        hasLeading ? (ojvcomponent.h("div", { class: 'oj-listitemlayout-leading' },
                            ojvcomponent.h("div", { class: 'oj-listitemlayout-avatar' }, leadingSlot))) : null,
                        ojvcomponent.h("div", { class: 'oj-listitemlayout-textslots' },
                            ojvcomponent.h("div", { class: 'oj-listitemlayout-main' },
                                (defaultSlot === null || defaultSlot === void 0 ? void 0 : defaultSlot.length) > 0 ? ojvcomponent.h("div", null, defaultSlot) : null,
                                (secondarySlot === null || secondarySlot === void 0 ? void 0 : secondarySlot.length) > 0 ? ojvcomponent.h("div", null, secondarySlot) : null,
                                (tertiarySlot === null || tertiarySlot === void 0 ? void 0 : tertiarySlot.length) > 0 ? ojvcomponent.h("div", { class: tertiaryClass }, tertiarySlot) : null),
                            (metadataSlot === null || metadataSlot === void 0 ? void 0 : metadataSlot.length) > 0 ? (ojvcomponent.h("div", { class: 'oj-listitemlayout-meta' }, metadataSlot)) : null)))));
        }
    };
    exports.ListItemLayout.metadata = { "extension": { "_DEFAULTS": ListItemLayoutProps }, "slots": { "selector": {}, "leading": {}, "": {}, "secondary": {}, "tertiary": {}, "metadata": {} } };
    exports.ListItemLayout = __decorate([
        ojvcomponent.customElement('oj-list-item-layout')
    ], exports.ListItemLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
