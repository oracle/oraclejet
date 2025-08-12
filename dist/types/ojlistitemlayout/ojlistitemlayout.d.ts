/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, Slot } from 'ojs/ojvcomponent';
import { Component, ComponentChildren } from 'preact';
declare class ListItemLayoutProps {
    /**
     * @description
     * <p>The <code class="prettyprint">default</code> slot accepts default text. </p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div>
     *       &lt;oj-bind-text value="default">&lt;/oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The default slot accepts a default text."
     * @ojmetadata displayName "default"
     * @ojmetadata help "#Default"
     */
    children?: ComponentChildren;
    /**
     * @description
     * <p>The <code class="prettyprint">overline</code> slot is used for adding overline text above the default text.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="overline">
     *       &lt;oj-bind-text value="overline">&lt;/oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The overline slot is for adding a overline text above the default text."
     * @ojmetadata help "#overline"
     */
    overline?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">selector</code> slot can accept an oj-selector component and is optional.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;oj-selector slot='selector' selected-keys='{{selectorSelectedItems}}' key='[[item.data.id]]'>
     *    &lt;/oj-selector>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The selector slot can accept a oj-selector component and is optional."
     * @ojmetadata help "#selector"
     */
    selector?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">leading</code> slot is used for adding a leading visual
     * next to the selector. Leading slot content can be a badge, image, avatar or initials.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;oj-avatar slot='leading' role="img" size="xs" initials='[[item.data.initials]]'
     *                  src="[[item.data.image]]" :aria-label="[['Avatar of ' + item.data.name]]"
     *                  :title="[['Avatar of ' + item.data.name]]">
     *    &lt;/oj-avatar>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The leading slot is used for adding a leading visual next to the selector. Leading slot can be an image, avatar or initials."
     * @ojmetadata help "#leading"
     */
    leading?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">secondary</code> slot is used for adding secondary text below the default text.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="secondary">
     *       &lt;oj-bind-text value="secondary">&lt;/oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The secondary slot is for adding a secondary text below the default text."
     * @ojmetadata help "#secondary"
     */
    secondary?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">tertiary</code> slot is used for adding tertiary text below the secondary text.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="tertiary">
     *       &lt;oj-bind-text value="tertiary">&lt;/oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The tertiary slot is for adding a tertiary text below the secondary text."
     * @ojmetadata help "#tertiary"
     */
    tertiary?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">metadata</code> slot is used for adding extra trailing information. Examples of metadata are author, date etc.
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="metadata">
     *       &lt;oj-bind-text value="metadata">&lt;/oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The metadata for adding extra trailing information. Examples of metadata are author, date etc."
     * @ojmetadata help "#metadata"
     */
    metadata?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">trailing</code> slot is used for adding a trailing visual.
     * Trailing slot content can be a badge, image or icon.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;oj-avatar slot='trailing' role="img" size="xs" initials='[[item.data.initials]]'
     *                  src="[[item.data.image]]" :aria-label="[['Avatar of ' + item.data.name]]"
     *                  :title="[['Avatar of ' + item.data.name]]">
     *    &lt;/oj-avatar>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The trailing slot is used for adding a trailing visual."
     * @ojmetadata help "#trailing"
     */
    trailing?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">action</code> slot is used for adding either one primary action or one or more secondary actions.
     * Note that navigation slot by default sets data-oj-clickthrough to "disabled", so that any
     * actions performed in the slot will not propagate to its parent component.
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="action">
     *       &lt;oj-button>Edit&lt;/oj-button>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The action slot is used for adding action buttons say like a toolbar."
     * @ojmetadata help "#action"
     */
    action?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">quaternary</code> slot is used for adding quaternary text below the tertiary text.</p>
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="quaternary">
     *       &lt;oj-bind-text value="quaternary">&lt;/oj-bind-text>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The quaternary slot is for adding a quaternary text below the tertiary text."
     * @ojmetadata help "#quaternary"
     */
    quaternary?: Slot;
    /**
     * @description
     * <p>The <code class="prettyprint">navigation</code> slot is used for adding a navigation control, such as a link or button.</p>
     * Note that navigation slot by default sets data-oj-clickthrough to "disabled", so that any
     * actions performed in the slot will not propagate to its parent component.
     * @example
     * &lt;oj-list-item-layout>
     *    &lt;div slot="navigation">
     *       &lt;oj-button>navigation&lt;/oj-button>
     *    &lt;/div>
     * &lt;/oj-list-item-layout>
     *
     * @ojmetadata description "The navigation slot is used for adding a navigation text below the trailing slot."
     * @ojmetadata help "#navigation"
     */
    navigation?: Slot;
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
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojListItemLayout.html"
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
/**
 * This export corresponds to the ListItemLayout Preact component. For the oj-list-item-layout custom element, import ListItemLayoutElement instead.
 */
export declare class ListItemLayout extends Component<ExtendGlobalProps<ListItemLayoutProps>> {
    private readonly _hasContent;
    private _getWrappedSlotContent;
    private _getWrappedSlotContentWithClickThroughDisabled;
    render(props: ExtendGlobalProps<ListItemLayoutProps>): import("preact").JSX.Element;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-list-item-layout custom element. For the ListItemLayout Preact component, import ListItemLayout instead.
 */
export interface ListItemLayoutElement extends JetElement<ListItemLayoutElementSettableProperties>, ListItemLayoutElementSettableProperties {
    addEventListener<T extends keyof ListItemLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: ListItemLayoutElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ListItemLayoutElementSettableProperties>(property: T): ListItemLayoutElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ListItemLayoutElementSettableProperties>(property: T, value: ListItemLayoutElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ListItemLayoutElementSettableProperties>): void;
    setProperties(properties: ListItemLayoutElementSettablePropertiesLenient): void;
}
export interface ListItemLayoutElementEventMap extends HTMLElementEventMap {
}
export interface ListItemLayoutElementSettableProperties extends JetSettableProperties {
}
export interface ListItemLayoutElementSettablePropertiesLenient extends Partial<ListItemLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface ListItemLayoutIntrinsicProps extends Partial<Readonly<ListItemLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-list-item-layout': ListItemLayoutIntrinsicProps;
        }
    }
}
