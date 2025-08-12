/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Component, type ComponentChild } from 'preact';
import { type Action, type ExtendGlobalProps } from 'ojs/ojvcomponent';
type Props = {
    /**
     * @description
     * The display text of the value.
     *
     * @ojmetadata description "The display text of the value."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value?: string | null;
    /**
     * @description
     * Triggered when the dropdown icon is clicked, whether by mouse, or touch events.
     *
     * @ojmetadata description "Triggered when the dropdown icon is clicked, whether by mouse, or touch events."
     */
    onOjDropdownIconAction?: Action<{}>;
};
/**
 * @classdesc
 * <h3 id="SelectSinglePlaceholderOverview-section">
 *   JET Select Single Placeholder
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#SelectSinglePlaceholderOverview-section"></a>
 * </h3>
 * <p>Description: A custom element that renders a placeholder for a SelectSingle. This should only be used in a data-cell in "Navigation" mode within a DataGrid template.</p>
 * <pre class="prettyprint">
 * <code>// Placeholder for a single select component within an oj-bind-if within a DataGrid template
 * &lt;oj-bind-if test='[[cell.mode=="navigation"]]'>
 *   &lt;oj-select-single-placeholder on-oj-dropdown-icon-action="[[downArrowIconClick]]"
 *     value="[[cell.item.data.data]]">
 *   &lt;/oj-select-single-placeholder>
 * &lt;/oj-bind-if>
 * </code></pre>
 * @ojmetadata description "A custom element that renders a placeholder for a SelectSingle."
 * @ojmetadata displayName "Select Single Placeholder"
 * @ojmetadata main "ojs/ojselectsingleplaceholder"
 * @ojmetadata extension {
 *   "oracle": {
 *     "icon": "oj-ux-ico-select",
 *     "uxSpecs": ["select-single-item"]
 *   },
 *   "vbdt": {
 *     "module": "ojs/ojselectsingleplaceholder",
 *     "defaultColumns": "1",
 *     "minColumns": "1"
 *   }
 * }
 * @ojmetadata help "%JET_API_DOC_URL%oj.ojSelectSinglePlaceholder.html"
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "data",
 *     "items": [ "value"]
 *   }
 * ]
 * @ojmetadata preferredParent [{parentInterface: "DataGridElement"}]
 * @ojmetadata since "19.0.0"
 */
/**
 * This export corresponds to the SelectSinglePlaceholder Preact component. For the oj-select-single-placeholder custom element, import SelectSinglePlaceholderElement instead.
 */
export declare class SelectSinglePlaceholder extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Props;
    private readonly _handleIconClick;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
}
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-select-single-placeholder custom element. For the SelectSinglePlaceholder Preact component, import SelectSinglePlaceholder instead.
 */
export interface SelectSinglePlaceholderElement extends JetElement<SelectSinglePlaceholderElementSettableProperties>, SelectSinglePlaceholderElementSettableProperties {
    addEventListener<T extends keyof SelectSinglePlaceholderElementEventMap>(type: T, listener: (this: HTMLElement, ev: SelectSinglePlaceholderElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof SelectSinglePlaceholderElementSettableProperties>(property: T): SelectSinglePlaceholderElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof SelectSinglePlaceholderElementSettableProperties>(property: T, value: SelectSinglePlaceholderElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SelectSinglePlaceholderElementSettableProperties>): void;
    setProperties(properties: SelectSinglePlaceholderElementSettablePropertiesLenient): void;
}
export namespace SelectSinglePlaceholderElement {
    interface ojDropdownIconAction extends CustomEvent<{}> {
    }
    type valueChanged = JetElementCustomEventStrict<SelectSinglePlaceholderElement['value']>;
}
export interface SelectSinglePlaceholderElementEventMap extends HTMLElementEventMap {
    'ojDropdownIconAction': SelectSinglePlaceholderElement.ojDropdownIconAction;
    'valueChanged': JetElementCustomEventStrict<SelectSinglePlaceholderElement['value']>;
}
export interface SelectSinglePlaceholderElementSettableProperties extends JetSettableProperties {
    /**
     * The display text of the value.
     */
    value?: Props['value'];
}
export interface SelectSinglePlaceholderElementSettablePropertiesLenient extends Partial<SelectSinglePlaceholderElementSettableProperties> {
    [key: string]: any;
}
export interface SelectSinglePlaceholderIntrinsicProps extends Partial<Readonly<SelectSinglePlaceholderElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /**
     * Triggered when the dropdown icon is clicked, whether by mouse, or touch events.
     */
    onojDropdownIconAction?: (value: SelectSinglePlaceholderElementEventMap['ojDropdownIconAction']) => void;
    onvalueChanged?: (value: SelectSinglePlaceholderElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-select-single-placeholder': SelectSinglePlaceholderIntrinsicProps;
        }
    }
}
