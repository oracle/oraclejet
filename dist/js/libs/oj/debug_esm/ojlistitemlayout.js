/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { customElement } from 'ojs/ojvcomponent';
import { Component } from 'preact';
import { useRef, useEffect } from 'preact/hooks';

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class ListItemLayoutProps {
}
/**
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
 * </code></pre>
 *
 *
 *  <h3 id="migration-section">Migration<a class="bookmarkable-link" title="Bookmarkable Link" href="#migration-section"></a></h3>
 *  To migrate from ojlistitemlayout to oj-c-list-item-layout, you need to revise the import statement and references to oj-c-list-item-layout in your app.
 *  <h5>Padding Off</h5>
 *  The feature to remove default padding around the List Item Layout has changed.
 *  Replace the class "oj-listitemlayout-padding-off" with a prop, <strong>inset</strong>, set to <i>none</i>
 *    <p> Example: &lt;oj-c-list-item-layout inset="none"></p>
 *
 * @ojmetadata description "A List Item Layout represents layout used for list view item elements."
 * @ojmetadata displayName "List Item Layout"
 * @ojmetadata main "ojs/ojlistitemlayout"
 * @ojmetadata status [
 *   {
 *     "type": "maintenance",
 *     "since": "14.0.0",
 *     "value": ["oj-c-list-item-layout"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-list-item-layout",
 *     "uxSpecs": ["list-view"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojlistitemlayout",
 *     "defaultColumns": "12",
 *     "minColumns": "2"
 *   }
 * }
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojListItemLayout.html"
 * @ojmetadata since "9.0.0"
 * @ojmetadata styleClasses [
 *   {
 *     "name": "oj-listitemlayout-padding-off",
 *     "kind": "class",
 *     "displayName": "Padding Off",
 *     "description": "Turn off horizontal and vertical padding for the list item layout.",
 *     "help": "#oj-listitemlayout-padding-off",
 *     "extension": {
 *        "jet": {
 *            "example": "&lt;oj-list-item-layout class='oj-listitemlayout-padding-off'>\n &lt;div>\n  &lt;oj-bind-text value='default'>\n  &lt;/oj-bind-text>\n &lt;/div>\n&lt;/oj-list-item-layout>"
 *          }
 *      }
 *   }
 * ]
 */
let ListItemLayout = class ListItemLayout extends Component {
    constructor() {
        super(...arguments);
        this._hasContent = (slotContent) => (Array.isArray(slotContent) && slotContent.length > 0) || slotContent;
    }
    _getWrappedSlotContent(slotContent, wrapperClasses, isAdditionalTabIndexNeeded) {
        if (this._hasContent(slotContent)) {
            let defaultTabIndex = 0;
            if (wrapperClasses && wrapperClasses.length > 0 && isAdditionalTabIndexNeeded) {
                return (jsx("div", { class: wrapperClasses, tabIndex: defaultTabIndex, children: slotContent }));
            }
            else if (wrapperClasses && wrapperClasses.length > 0) {
                return jsx("div", { class: wrapperClasses, children: slotContent });
            }
            else if (isAdditionalTabIndexNeeded) {
                return jsx("div", { tabIndex: defaultTabIndex, children: slotContent });
            }
            else {
                return jsx("div", { children: slotContent });
            }
        }
        return null;
    }
    _getWrappedSlotContentWithClickThroughDisabled(slotContent, wrapperClasses, isAdditionalTabIndexNeeded) {
        if (this._hasContent(slotContent)) {
            let defaultTabIndex = 0;
            if (wrapperClasses && wrapperClasses.length > 0 && isAdditionalTabIndexNeeded) {
                return (jsx("div", { "data-oj-clickthrough": "disabled", class: wrapperClasses, tabIndex: defaultTabIndex, children: slotContent }));
            }
            else if (wrapperClasses && wrapperClasses.length > 0) {
                return (jsx("div", { "data-oj-clickthrough": "disabled", class: wrapperClasses, children: slotContent }));
            }
            else if (isAdditionalTabIndexNeeded) {
                return (jsx("div", { "data-oj-clickthrough": "disabled", tabIndex: defaultTabIndex, children: slotContent }));
            }
            else {
                return jsx("div", { "data-oj-clickthrough": "disabled", children: slotContent });
            }
        }
        return null;
    }
    render(props) {
        // a reference is used to track if the consumer has added the style class 'oj-listitemlayout-padding-off'
        // if so, we need to offset the border of the primary slot, to make it visible when there is no padding around it
        const layoutRef = useRef(null);
        let primaryClass = useRef();
        useEffect(() => {
            if (layoutRef.current.parentElement) {
                const hasPaddingOff = layoutRef.current.parentElement.classList.contains('oj-listitemlayout-padding-off');
                primaryClass.current = hasPaddingOff ? 'oj-listitemlayout-primary' : '';
            }
        }, [props.children]);
        const hasExtra = this._hasContent(props.metadata) ||
            this._hasContent(props.action) ||
            this._hasContent(props.trailing);
        let tertiaryClass = '';
        if (this._hasContent(props.secondary) && this._hasContent(props.tertiary)) {
            tertiaryClass = 'oj-listitemlayout-tertiary';
        }
        let leadingClass = 'oj-listitemlayout-leading';
        if (this._hasContent(props.selector) && this._hasContent(props.leading)) {
            leadingClass = leadingClass + ' oj-listitemlayout-start-padding';
        }
        let quaternaryClass = 'oj-listitemlayout-quaternary';
        let textSlotClass = 'oj-listitemlayout-textslots';
        if (this._hasContent(props.selector) || this._hasContent(props.leading)) {
            textSlotClass = textSlotClass + ' oj-listitemlayout-start-padding';
            quaternaryClass = quaternaryClass + ' oj-listitemlayout-start-padding';
        }
        return (jsxs("div", { class: "oj-listitemlayout-grid", ref: layoutRef, children: [this._getWrappedSlotContent(props.selector, 'oj-listitemlayout-selector', false), this._getWrappedSlotContent(props.leading, leadingClass, true), jsxs("div", { class: textSlotClass, children: [this._getWrappedSlotContent(props.overline, null, true), this._getWrappedSlotContent(props.children, primaryClass.current, true), this._getWrappedSlotContent(props.secondary, null, true), this._getWrappedSlotContent(props.tertiary, tertiaryClass, true)] }), hasExtra ? (jsxs("div", { class: "oj-listitemlayout-extra", children: [this._getWrappedSlotContent(props.metadata, 'oj-listitemlayout-metadata oj-listitemlayout-start-padding', true), this._getWrappedSlotContent(props.trailing, 'oj-listitemlayout-trailing oj-listitemlayout-image oj-listitemlayout-start-padding', true), this._getWrappedSlotContentWithClickThroughDisabled(props.action, 'oj-listitemlayout-action oj-listitemlayout-start-padding', false)] })) : null, this._getWrappedSlotContent(props.quaternary, quaternaryClass, true), this._getWrappedSlotContentWithClickThroughDisabled(props.navigation, 'oj-listitemlayout-navigation', false)] }));
    }
};
ListItemLayout._metadata = { "slots": { "": {}, "overline": {}, "selector": {}, "leading": {}, "secondary": {}, "tertiary": {}, "metadata": {}, "trailing": {}, "action": {}, "quaternary": {}, "navigation": {} } };
ListItemLayout = __decorate([
    customElement('oj-list-item-layout')
], ListItemLayout);

export { ListItemLayout };
