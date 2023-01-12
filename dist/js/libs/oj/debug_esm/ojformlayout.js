/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import 'ojs/ojcore';
import 'ojs/ojcomponentcore';
import 'ojs/ojlabel';
import oj from 'ojs/ojcore-base';
import { addResizeListener, removeResizeListener, isAncestorOrSelf } from 'ojs/ojdomutils';
import Context from 'ojs/ojcontext';
import { error } from 'ojs/ojlogger';
import { parseJSONFromFontFamily } from 'ojs/ojthemeutils';
import { FormVariantContext } from '@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext';

/**
 * @ojcomponent oj.ojFormLayout
 * @since 4.1.0
 * @ojshortdesc A form layout manages the layout of labels and fields in a form.
 *
 * @ojsignature {target: "Type", value:"class ojFormLayout extends JetElement<ojFormLayoutSettableProperties>"}
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["maxColumns", "labelEdge", "labelWidth", "readonly"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 2
 *
 * @ojoracleicon 'oj-ux-ico-form-layout'
 * @ojuxspecs ['form-layout']
 *
 * @classdesc
 * <h3 id="optionOverview-section">
 *   JET FormLayout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#optionOverview-section"></a>
 * </h3>
 * <p>The oj-form-layout element is used to layout groups of label/value pairs in an organized layout that
 * can be optimized for multiple display sizes via attribute value settings.  The following describes how child
 * elements are handled:<br><br>
 * - The following JET components have a <code class="prettyprint">label-hint</code> attribute that allows them to be treated as a
 * label/value pair with an oj-label element dynamically created from the label-hint and help-hints:<br>
 * oj-checkboxset, oj-color-palette, oj-color-spectrum, oj-input-date, oj-input-date-time, oj-input-time,
 * oj-input-number, oj-input-text, oj-text-area, oj-input-password, oj-combobox-one, oj-combobox-many,
 * oj-radioset, oj-select-one, oj-select-many, oj-slider, oj-switch<br>
 * - An oj-label element, followed by any element. The oj-label element will be in the label area
 * and the next element will be in the value area<br>
 * - An oj-label-value child component allows the developer to place elements in the label and/or value area as 'label' and 'value' slot chilren.<br>
 * - All other elements will span the entire width of a single label/value pair.
 *
 * To have a form element span multiple columns, add an oj-label-value component as a child of the oj-form-layout
 * add the component that you want to span multiple columns as a child of the oj-label-value. The colspan attribute
 * on the oj-label-value is used to specify the number of columns to span, and the direction attribute on the
 * oj-form-layout must be set to "row".
 * NOTE: To minimize the need for adding a style attribute to achieve a max-width of 100% on the column spanning
 * component and to facilitate start and end field alignment, the default max-width for form controls is changed
 * to 100% when all of the following conditions are met:
 * - direction == "row"
 * - max-columns > 1
 * - there is at least one oj-label-value child with a colspan attribute specified.
 *
 * <p>For example:
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-form-layout max-columns='2' label-edge='start' label-width="50%">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 *   &lt;oj-input-text id="inputcontrol2" value="text" label-hint="input 2">&lt;/oj-input-text>
 *   &lt;oj-input-text id="inputcontrol3" value="text" label-hint="input 3 longer label">&lt;/oj-input-text>
 *   &lt;oj-label>oj-label in label area&lt;/oj-label>
 *   &lt;p>Next element in value area&lt;/p>
 *   &lt;oj-label-value id="labelonly">
 *     &lt;p slot="label">Some text in the label area&lt;/p>
 *   &lt;/oj-label-value>
 *   &lt;oj-label-value id="valueonly">
 *     &lt;p slot="value">Some text in the value area&lt;/p>
 *   &lt;/oj-label-value>
 *   &lt;p>Some text that spans the label/value area&lt;/p>
 * &lt;/oj-form-layout>
 * </code></pre>
 *
 * <p>The oj-form-layout element currently supports custom element children that support the label-hint
 * and help-hints attributes (oj-input-text, oj-text-area, etc.).
 * For each custom element child with label-hint, FormLayout will generate an oj-label element and pair
 * them together in the layout.
 * </p>
 * <h6>
 *   Accessbility
 * </h6>
 * <p>
 * For a form control to be accessible, it should be labelled, which can be a visible label or, in the case
 * there is no visible label, an aria-label or aria-labelledby attribute.
 * </p>
 * <p>
 * oj-form-layout or form controls can dynamically create labels at different locations based on the combinations of label-edge
 * and label-hint. Refer to the documentation of the label-edge and label-hint attributes for details.
 * </p>
 * <p>
 * If a form control has label-edge=“none” and a label-hint attribute but no
 * labelled-by, aria-label, or aria-labelledby attribute, the label-hint value will be used as the aria-label.
 * </p>
 */

// --------------------------------------------------- oj.ojFormLayout Styling Start ------------------------------------------------------------
/**
 * @classdesc The following CSS classes can be applied by the page author as needed.<br/>
 * The form layout style classes should be applied to the oj-form-layout component. <br/>
 */
// ---------------- oj-formlayout-full-width --------------
/**
 * In Redwood by default a form layout has a max width, add this class if you'd like to opt out and have the form layout to stretch the full width.
 * @ojstyleclass oj-formlayout-full-width
 * @ojdisplayname Form Layout Full Width
 * @memberof oj.ojFormLayout
 * @ojtsexample
 * &lt;oj-form-layout class="oj-formlayout-full-width">
 * &lt;/oj-form-layout>
 */
/**
 * @ojstylevariableset oj-form-layout-css-set1
 * @ojstylevariable oj-form-layout-margin-bottom {description: "Bottom margin of each row in a form layout", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-column-min-width {description: "Form layout column min width", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-column-max-width {description: "Form layout column max width", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-start-edge-column-min-width {description: "Form layout column min width when label-edge is set to start", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-start-edge-column-max-width {description: "Form layout column max width when label-edge is set to start", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-column-gutter {description: "Gutter between form layout columns", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-top-edge-label-to-value-padding {description: "Vertical padding between the label and value when label-edge is set to top in a form layout", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-start-edge-label-text-align {description: "Label text align when label-edge is set to start in a form layout", keywords: ["start","end"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-start-edge-value-text-align {description: "Value text align when label-edge is set to start in a form layout", keywords: ["start","end"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-start-edge-label-to-value-padding {description: "Horizontal padding between the label and value when label-edge is set to start in a form layout", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-horizontal-margin {description: "Form layout horizontal margin", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-divider-width {description: "Form layout divider width", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-form-layout-divider-margin {description: "Form layout divider margin", formats: ["length"], help: "#css-variables"}
 * @memberof oj.ojFormLayout
 */

// --------------------------------------------------- oj.ojFormLayout Styling end ------------------------------------------------------------

/**
 * @member
 * @name colspanWrap
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @ojvalue {string} "nowrap" The component will occupy the remaining columns in the current row.
 * @ojvalue {string} "wrap" The component will start from the first column of the next row.
 * @desc Specifies how to fit components with colspan attribute in the form layout, when there are fewer columns left in the current row
 * than the colspan value specifies.
 * <p>The default value depends on the theme.</p>
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">colspan-wrap</code> attribute specified:</caption>
 * &lt;oj-form-layout max-columns="3" colspan-wrap="wrap">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-label-value colspan="2">
 *     &lt;oj-label slot="label" for="textareacontrol">textarea&lt;/oj-input-text>
 *     &lt;oj-text-area slot="value" id="textareacontrol" value='text' rows="6">&lt;/oj-text-area>
 *   &lt;/oj-label-value>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">colspanWrap</code> property after initialization:</caption>
 * // getter
 * var wrap = myFormLayout.colspanWrap;
 *
 * // setter
 * myFormLayout.colspanWrap = 'wrap';
 */

/**
 * @member
 * @name direction
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @ojvalue {string} "column" Components are laid out in columns
 * @ojvalue {string} "row" Components are laid out in rows
 * @desc Specifies the layout direction of the form layout children.
 * <p>The default value depends on the theme.</p>
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">direction</code> attribute specified:</caption>
 * &lt;oj-form-layout direction="row">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">disabled</code> property after initialization:</caption>
 * // getter
 * var dir = myFormLayout.direction;
 *
 * // setter
 * myFormLayout.direction = "column";
 */

/**
 * @member
 * @name labelEdge
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @ojvalue {string} "inside" oj-form-layout will not create any label. Label will be created by the form control if the form control has its label-edge set to "inside".
 *                            Please see the specific form control's label-edge attribute documentation for details.
 * @ojvalue {string} "start" oj-form-layout will create a label that's before the start of the form control if the form control's label-edge is not explicitly set.
 *                           If the form control specifies "inside" or "none" as its label-edge, no label will be created by oj-form-layout.
 * @ojvalue {string} "top" oj-form-layout will create a label that's on top of the form control if the form control‘s label-edge is not explicitly set.
 *                         If the form control specifies "inside" or "none" as its label-edge, no label will be created by oj-form-layout.
 * @desc Specifies how the label is created and aligned with its form control.
 * <p>The default value varies by theme, and it works well for the theme in most cases.
 * The oj-form-layout component uses the <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
 * <code class="prettyprint">provide</code> property to provide its <code class="prettyprint">label-edge</code>
 * attribute to any descendent form components and oj-form-layout. It also uses
 * <a href="MetadataTypes.html#ProvideProperty">MetadataTypes.ProvideProperty</a> <code class="prettyprint">transform</code> property
 * to transform the <code class="prettyprint">label-edge</code> attribute to its descendent form components.
 * The form components and the oj-form-layout are configured to consume the label-edge property if it is not explicitly set.
 * For example, if the oj-form-layout's label-edge attribute is set to "top" or "start", and a descendent form component does
 * not have its label-edge attribute set, the form component's label-edge will be the transformed value "provided".</p>
 *
 * @ojshortdesc Specifies how the label is created and aligned with its form control. See the Help documentation for more information.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-edge</code> attribute specified:</caption>
 * &lt;oj-form-layout label-edge="top">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelEdge</code> property after initialization:</caption>
 * // getter
 * var edge = myFormLayout.labelEdge;
 *
 * // setter
 * myFormLayout.labelEdge = 'start';
 */

/**
 * @member
 * @name labelWidth
 * @ojshortdesc Specifies the label width. See the Help documentation for more information.
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default "33%"
 * @desc Specifies the label width.
 * <p>This specifies the width of the oj-label elements.  This can be any legal <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/width">CSS width</a>.</p>
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-width</code> attribute specified:</caption>
 * &lt;oj-form-layout label-width="50%">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelWidth</code> property after initialization:</caption>
 * // getter
 * var width = myFormLayout.labelWidth;
 *
 * // setter
 * myFormLayout.labelWidth = '60px';
 */

/**
 * @member
 * @name labelWrapping
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @default "wrap"
 * @ojvalue {string} "truncate" Label will truncate if needed
 * @ojvalue {string} "wrap" Label will wrap if needed
 * @desc Specifies if the label text should wrap or truncate.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">label-wrapping</code> attribute specified:</caption>
 * &lt;oj-form-layout label-wrapping="truncate">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">labelWrapping</code> property after initialization:</caption>
 * // getter
 * var wrap = myFormLayout.labelWrapping;
 *
 * // setter
 * myFormLayout.labelWrapping = 'wrap';
 */

/**
 * @member
 * @name columns
 * @ojshortdesc Specifies the exact number of columns. This attribute overrides max-columns if it is positive.
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {number}
 * @default 0
 * @desc Specifies the absolute number of columns and overrides max-columns, if the value is positive.
 * If the value is not positive, then this attribute is ignored and max-columns is used to determine
 * the number of columns. This attribute should only be used in special circumstances where you need
 * a specific number of columns even if the fields will be narrower than the suggested minimum
 * (a nested form layout might be an example).
 * </p>
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">columns</code> attribute specified:</caption>
 * &lt;oj-form-layout columns="2">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">columns</code> property after initialization:</caption>
 * // getter
 * var cols = myFormLayout.columns;
 *
 * // setter
 * myFormLayout.columns = 2;
 */

/**
 * @member
 * @name maxColumns
 * @ojshortdesc Specifies the maximum number of columns. See the Help documentation for more information.
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {number}
 * @default 1
 * @ojmin 1
 * @desc Specifies the maximum number of columns.  The actual number of columns will be responsively determined
 * based on the viewport size and the column width specified in the theme. Note that max-columns will be ignored
 * if columns has a positive value.
 *
 * @example <caption>Initialize the oj-form-layout with the <code class="prettyprint">max-columns</code> attribute specified:</caption>
 * &lt;oj-form-layout max-columns="2">
 *   &lt;oj-input-text id="inputcontrol" required value="text" label-hint="input 1">&lt;/oj-input-text>
 *   &lt;oj-text-area id="textareacontrol" value='text' rows="6" label-hint="textarea">&lt;/oj-text-area>
 * &lt;/oj-form-layout>
 *
 * @example <caption>Get or set the <code class="prettyprint">maxColumns</code> property after initialization:</caption>
 * // getter
 * var maxCol = myFormLayout.maxColumns;
 *
 * // setter
 * myFormLayout.maxColumns = 2;
 */

/**
 * @member
 * @name readonly
 * @ojshortdesc Specifies whether the form is readonly. See the Help documentation for more information.
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {boolean}
 * @default false
 * @desc Specifies whether the form is readonly. A readonly form has no reserved rows for user assistance text.
 * <p>
 * The oj-form-layout component uses the
 * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
 * <code class="prettyprint">provide</code> property to provide its
 * <code class="prettyprint">readonly</code>
 * property to any descendent components that are
 * configured to consume it.
 * The form components and the oj-form-layout are configured to consume the readonly property
 * if it is not explicitly set.
 * For example, if the oj-form-layout's readonly attribute is set to true,
 * and a descendent form component does
 * not have its readonly attribute set, the form component's readonly will be true.
 * </p>
 */

/**
 * @member
 * @name userAssistanceDensity
 * @ojunsupportedthemes ["Alta"]
 * @ojshortdesc Specifies the density of the form component's user assistance presentation.
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 * @type {string}
 * @ojsignature {target: "Type", value: "'reflow'|'efficient'|'compact'",  jsdocOverride: true}
 * @ojvalue {string} "reflow" If reflow, messages, help, hints, and required are all shown inline under the field with no reserved space.
 * @ojvalue {string} "efficient" messages, help, hints, and required are all shown inline under the field with reserved space underneath.
 * @ojvalue {string} "compact" messages, help, hints, and required will not be shown inline; they will show in a mode that keeps the screen more compact, like
 * a popup for the messages, and a required icon to indicate Required.
 * @default "efficient"
 *
 * @desc <p>Specifies the density of the form layout's user assistance presentation.
 * It can be shown inline with reserved rows to prevent reflow if
 * a user assistance text shows up, inline without reserved rows,
 * or it can be shown compactly in a popup instead.</p>
 * <p>
 * The oj-form-layout component uses the
 * <a href="MetadataTypes.html#PropertyBinding">MetadataTypes.PropertyBinding</a>
 * <code class="prettyprint">provide</code> property to provide its
 * user-assistance-density property to any descendent components that are
 * configured to consume it.
 * The form components and the oj-form-layout are configured to consume the
 * user-assistance-density property if it is not explicitly set.
 * For example, oj-form-layout's user-assistance-density defaults to 'efficient', so all its
 * oj-form-layout and form control descendents will have user-assistance-density='efficient' by default.
 * </p>
 *
 */

/**
 * Sets a property or a single subproperty for complex properties and notifies the component
 * of the change, triggering a [property]Changed event.
 *
 * @function setProperty
 * @ojshortdesc Sets a property or a single subproperty for complex properties and notifies the component of the change, triggering a corresponding event.
 * @param {string} property - The property name to set. Supports dot notation for subproperty access.
 * @param {any} value - The new value to set the property to.
 * @return {void}
 *
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
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
 * @memberof oj.ojFormLayout
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
 * @expose
 * @memberof oj.ojFormLayout
 * @instance
 *
 * @example <caption>Set a batch of properties:</caption>
 * myComponent.setProperties({"prop1": "value1", "prop2.subprop": "value2", "prop3": "value3"});
 */
/**
 * Refreshes the visual state of the component.
 *
 * @function refresh
 *
 * @expose
 * @memberof oj.ojFormLayout
 * @return {void}
 * @instance
 */

// Slots
// //////

/**
 * <p>The <code class="prettyprint">&lt;oj-form-layout></code> element only accepts element children
 * in the Default slot.  Content in <code class="prettyprint">&lt;oj-form-layout></code>'s Default
 * slot will be laid out in a row/column style form layout.
 *
 * @ojchild Default
 * @memberof oj.ojFormLayout
 * @since 4.1.0
 *
 * @example <caption>Initialize <code class="prettyprint">&lt;oj-form-layout></code> with children in the
 * Default slot.</caption>
 * &lt;oj-form-layout id="AddressormLayout">
 *   &lt;oj-input-text id="firstname" label-hint="First Name" value="{{firstname}}">&lt;/oj-oj-input-text>
 *   &lt;oj-input-text id="lastname" label-hint="Last Name" value="{{lastname}}">&lt;/oj-oj-input-text>
 *   &lt;oj-input-text id="address" label-hint="Address" value="{{address}}">&lt;/oj-oj-input-text>
 * &lt;/oj-form-layout>
 */

var __oj_form_layout_metadata = 
{
  "properties": {
    "colspanWrap": {
      "type": "string",
      "enumValues": [
        "nowrap",
        "wrap"
      ]
    },
    "columns": {
      "type": "number",
      "value": 0
    },
    "direction": {
      "type": "string",
      "enumValues": [
        "column",
        "row"
      ]
    },
    "labelEdge": {
      "type": "string",
      "enumValues": [
        "inside",
        "start",
        "top"
      ]
    },
    "labelWidth": {
      "type": "string",
      "value": "33%"
    },
    "labelWrapping": {
      "type": "string",
      "enumValues": [
        "truncate",
        "wrap"
      ],
      "value": "wrap"
    },
    "maxColumns": {
      "type": "number",
      "value": 1
    },
    "readonly": {
      "type": "boolean",
      "value": false
    },
    "userAssistanceDensity": {
      "type": "string",
      "enumValues": [
        "compact",
        "efficient",
        "reflow"
      ],
      "value": "efficient"
    }
  },
  "methods": {
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
/* global __oj_form_layout_metadata */
Object.freeze(__oj_form_layout_metadata);

// counter for the generation of unique ids.
var _uidCounter = 0;

/**
 * @private
 */
const _OJ_DEFAULTS = 'oj-form-layout-option-defaults';

/**
 * The _ojFormLayout constructor function.  This function adds a wrapper div with
 * an oj-form class.
 *
 * @constructor
 * @private
 */
// eslint-disable-next-line no-unused-vars
function ojFormLayout(context) {
  var self = this;
  var element = context.element;
  var LABEL_ELEMENT_ID = '-labelled-by';
  // We need to mark every element we add so that we can remove it during a refresh/re-render.
  var BONUS_DOM_ATTR = 'data-oj-formlayout-bonus-dom';
  var BONUS_DOM_SELECTOR = '[' + BONUS_DOM_ATTR + ']';
  const _OJ_INTERNAL = 'data-oj-internal';
  const _OJ_CONTEXT = 'data-oj-context';
  const _OJ_ENABLED = 'oj-enabled';
  const _OJ_NOWRAP = 'oj-formlayout-labels-nowrap';
  const _OJ_FORM_LAYOUT = 'OJ-FORM-LAYOUT';
  var ojFormReadyResolveFunc;
  var readyResolveFunc;
  var ojForm;
  var isInitialRender = true;
  var unresolvedChildren;
  var updatePending = false;
  var calculatedColumns;

  // update labelEdge and colspanWrap based on context
  _updateDefaultFromTheme(context);

  // Our version of GCC has a bug where the second param of MutationObserver.observe must be of
  // type MutationObserverInit which isn't a real class that we can instantiate. Work around is to
  // create the MutationObserver on an alias of 'this' and call observe in a different function.
  // TODO Cleanup when we replace GCC with uglify in 5.0.0.
  /**
   * If the dom is mutated, call refresh to allow for added or deleted editable
   * value components.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  self._rootElementMutationObserver = new MutationObserver(function (mutations) {
    // if the oj-form-layout has been removed from the body element's subtree,
    // no need to remove event listeners or refresh.  Just disconnect the observer.
    // This can happen when you press apply in the cookbook demo.
    if (document.body.contains(element)) {
      // Move any added direct children to the ojForm div.
      _moveNewDirectChildrenToOjFormDiv(mutations);
      // Ignore mutations that aren't direct children of bonus dom div elements as those
      // are not generated by application program logic and the should't require
      // a refresh. Examples of mutations that we care about: an application
      // adding a new editable value element; removing an existing original
      // child element.  Example of mutations that we don't care about: dom
      // elements added or removed inside of the editable value child elements
      // or oj-label elements.
      // In theory, we shouldn't get mutaion events if we wait until a component is ready
      // but are are still seeing mutations sometimes even though the we waited on the busyContext
      // for the component. See 
      if (!_ignoreMutations(mutations)) {
        _removeEventListenersFromRemovedChildren(mutations);
        element.refresh();
      }
    } else {
      this.disconnect();
    }
  });

  // declare the resize handler for this instance.
  self._resizeHandler = _handleResize;

  this.createDOM = function () {
    element.classList.add('oj-form-layout');

    // Create wrapper div
    ojForm = document.createElement('div');
    ojForm.classList.add('oj-form');
    ojForm.setAttribute(_OJ_CONTEXT, ''); // @HTMLUpdateOK
    ojForm.setAttribute(_OJ_INTERNAL, ''); // @HTMLUpdateOK
    ojForm.setAttribute(BONUS_DOM_ATTR, ''); // @HTMLUpdateOK

    // set style
    if (element.readonly) {
      ojForm.classList.remove(_OJ_ENABLED);
    } else {
      ojForm.classList.add(_OJ_ENABLED);
    }

    // set styleclass for user-assistance-density
    const efficientStyleClass = 'oj-efficient';
    if (element.userAssistanceDensity === 'efficient') {
      ojForm.classList.add(efficientStyleClass);
    } else {
      ojForm.classList.remove(efficientStyleClass);
    }

    // wrap the children with the div
    // we use .firstChild and not .firstElementChild so that comment
    // nodes will be copied
    while (element.firstChild) {
      ojForm.appendChild(element.firstChild); // @HTMLUpdateOK reparenting child nodes
    }

    element.appendChild(ojForm); // @HTMLUpdateOK appending internally created DOM element
  };

  /**
   * In Chrome 103 - the relative/absolute positioning inside a multi-col layout is broken
   * https://bugs.chromium.org/p/chromium/issues/detail?id=1338997
   * This is to workaround this bug and make things render correctly for chromium browsers.
   * This bug will be fixed in 104 and later.
   */
  // data-oj- attributes used to identify the workaround DOM
  const _WORKAROUND_DOM_ATTR = 'data-oj-formlayout-workaround-dom';
  // Form layout can have nested oj-form-layout, so query only for the direct child
  const _WORKAROUND_DOM_SELECTOR = `:scope > [${_WORKAROUND_DOM_ATTR}]`;

  /**
   * Applies the workaround for the Chromium v103 bug
   */
  function _applyChromium103Workaround() {
    const workaroundDiv = document.createElement('div');
    workaroundDiv.style.display = 'table';
    workaroundDiv.style.visibility = 'hidden';
    workaroundDiv.setAttribute(_WORKAROUND_DOM_ATTR, ''); // @HTMLUpdateOK
    ojForm.appendChild(workaroundDiv);
  }

  /**
   * Removes the workaround for the Chromium v103 bug
   */
  function _removeChromium103Workaround() {
    const workaroundDiv = ojForm.querySelector(_WORKAROUND_DOM_SELECTOR);
    if (workaroundDiv) {
      ojForm.removeChild(workaroundDiv);
    }
  }

  /**
   * Register event listeners for resize the container DOM element.
   * @param {Element} domElem  DOM element
   * @private
   */
  function _registerResizeListener(domElem) {
    // register resize listener if needed
    if (_shouldRegisterResizeListener()) {
      addResizeListener(domElem, self._resizeHandler, 25);
    }
  }

  /**
   * We don't need a resize listener if 'columns' is positive as the oj-form-layout is not responsive.
   * Also not needed for direction = column because the browser does the work so is not needed.
   * @private
   */
  function _shouldRegisterResizeListener() {
    return element.columns < 1 && element.direction === 'row';
  }

  /**
   * Unregister event listeners for resize the container DOM element.
   * @param {Element} domElem  DOM element
   * @private
   */
  function _unregisterResizeListener(domElem) {
    if (domElem && self._resizeHandler) {
      // remove existing listener
      removeResizeListener(domElem, self._resizeHandler);
    }
  }

  /**
   * The resize handler.  We only pay attention to changes in the width.
   * @param {number} width the new width
   * @param {number} height the new height
   * @private
   */
  // eslint-disable-next-line no-unused-vars
  function _handleResize(width, height) {
    let newColumns = _calculateColumns();

    // If the number of calculated columns changes, we need to refresh the form layout
    if (newColumns !== calculatedColumns) {
      // When the column count changes, we need to completely re-render the oj-form-layout
      // because the components need to be shuffled around, the numbder of rows changes, etc.
      // and it's easier to just start over by throwing away all of the generated dom and
      // generate new dom in the right configuration.
      element.refresh();
    }
  }

  // Handles property changes for oj-form-layout.
  // handlePropertyChanged is an optional DefinitionalElementBridge method where if defined,
  // will be called with the property and value that changed
  // letting the component handle a partial update case. The component
  // can return true in this callback to skip a full render call to updateDOM
  // which will be done if this method returns false or undefined.

  // eslint-disable-next-line no-unused-vars
  self.handlePropertyChanged = function (property, value) {
    switch (property) {
      // if readonly, just update the styleclass and move on.
      case 'readonly': {
        if (element.readonly) {
          ojForm.classList.remove(_OJ_ENABLED);
        } else {
          ojForm.classList.add(_OJ_ENABLED);
        }
        return true;
      }
      case 'userAssistanceDensity': {
        // if ojFormLayout's userAssistanceDensity property changes,
        // update the styleclass.
        // See _childUserAssistanceDensityChanged for formlayout's responsibilities
        // when the form control's userAssistanceDensity changes.
        const efficientStyleClass = 'oj-efficient';
        if (element.userAssistanceDensity === 'efficient') {
          ojForm.classList.add(efficientStyleClass);
        } else {
          ojForm.classList.remove(efficientStyleClass);
        }
        return true;
      }
      case 'labelWrapping': {
        if (element.labelWrapping === 'truncate') {
          ojForm.classList.add(_OJ_NOWRAP);
        } else {
          ojForm.classList.remove(_OJ_NOWRAP);
        }
        return true;
      }
      default:
        return false;
    }
  };

  /**
   * The main render function.  This function gets called on initial render,
   * when oj-form-layout attributes are modified, and when mutations occur
   * (child nodes are added or deleted).  If the render is not the initial
   * render, all of the bonus dom elements are removed.  Then the bonus dom
   * elements are added (for both initial and non-initial cases).  The bonus dom
   * are the elements like oj-flex/oj-flex-item DIVs and oj-label elements that
   * get added and these are marked with "data-oj-formlayout-bonus-dom".
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  this.updateDOM = function () {
    function doUpdate() {
      _notReady();

      _updateDefaultFromTheme();

      unresolvedChildren = []; // start with an empty list

      // Wait until child elements have finished upgrading before performing DOM
      // manipulations so we can access child properties, like label-hint and help-hints.
      // The new oj-form div element has a data-oj-context attribute so we can get
      // the correctly scoped busy context  for the oj-form div subtree. When custom
      // elements are reparented, they reregister their busy state if they haven't
      // finished upgrading. Also, if the oj-form itself is being rendered, wait for
      // that as well.
      var busyContext = Context.getContext(ojForm).getBusyContext();
      busyContext.whenReady().then(function () {
        var tmpFocusElem = document.activeElement;
        var needsFocusRestored = false;
        // add a busy state for the oj-form div so we don't have multiple threads
        // modifying the oj-form div at the same time.
        _ojFormNotReady();

        // we don't want the observer being called when we are making modifications to dom subtree elements.
        self._rootElementMutationObserver.disconnect();

        _unregisterResizeListener(ojForm);
        _removeChromium103Workaround();

        _updateOjFormDiv();

        if (!isInitialRender) {
          _removeAllBonusDomElements();
        }

        _addLabelsFromHints();
        _addAllFlexDivs();
        if (oj.Components) {
          // if ojs/ojcomponentcore was loaded by some component, there may be logic that depends on being notified
          // when the component gets reattched.  this might be components themselves (via NotifyAttached) or it might
          // be ResizeListeners.  the subtreeAttached code ensure that both codepaths get notifications.
          oj.Components.subtreeAttached(ojForm);
        }
        if (tmpFocusElem) {
          needsFocusRestored = isAncestorOrSelf(element, tmpFocusElem);
        }
        // If the current focus is inside form layout while updating the DOM, place the focus back to the element;
        if (needsFocusRestored) {
          // : Since IE11 is having different render sequence of the DOM tree, it will blur out of the focused element.
          // To avoide losing focus, we need to add setTimeout to give the broswer enough time to finish the normal sequence and then
          // set the focus back.
          setTimeout(function () {
            tmpFocusElem.focus();
          }, 0);
        }

        // we need to do this before the mutation observer is activated because this can add divs which
        // would fire the mutation observer and send it into a refresh->mutation loop.
        _registerResizeListener(ojForm);
        _applyChromium103Workaround();

        // We are done making modifications to dom subtree elements so we should start paying attention
        // to mutations of the oj-form DIV subtree.  The mutations we care about are added elements and
        // removed elements. For the added elements, we should only see them added next to an existing
        // original child element, which is always a child of a bonus dom DIV element, so we ignore all
        // other added elements. For removed elements, we only care about removed original children.
        // All other removed elements are ignored by the observer.
        //
        // We also need to track custom element upgrade status. We do this by observing attribute
        // mutations and if the 'class' attribute gets "oj-complete" added, we know the custom element
        // is finished upgrading.
        self._rootElementMutationObserver.observe(element, {
          childList: true,
          subtree: true,
          attributes: true
        });

        // During debugging a different bug, I noticed on IE11 that sometimes this wasn't updated
        // when it obviously should have been (i.e. we reentered this function after the initial time
        // and isInitialRender was still true), so moving this setting before marking the promiss ready
        if (isInitialRender) {
          isInitialRender = false;
        }

        _ojFormMakeReady();
        _makeReady();
      });
    }

    // Dynamic form could set the busy state on the oj-form-layout element
    // when it's inserting children to oj-form-layout.  In this case we want
    // to delay the update until the busy state is clear.
    // The only other time the oj-form-layout can be busy when updateDOM is called is
    // during initial render, when busy state is set by DefinitionalElementBridge.
    // In that case we don't want to delay the update.
    // No need to do anything if an update is already pending.
    if (!updatePending) {
      var delayUpdate;
      var outerBusyContext;
      if (!isInitialRender && element.hasAttribute(_OJ_CONTEXT)) {
        outerBusyContext = Context.getContext(element).getBusyContext();
        delayUpdate = !outerBusyContext.isReady();
      } else {
        delayUpdate = false;
      }
      if (delayUpdate) {
        updatePending = true;
        outerBusyContext.whenReady().then(function () {
          updatePending = false;
          doUpdate();
        });
      } else {
        doUpdate();
      }
    }
  };

  /*
   * Called to set the component busy during rendering
   */
  function _notReady() {
    if (!readyResolveFunc) {
      var busyContext = Context.getContext(element).getBusyContext();
      var options = {
        description:
          "The oj-form-layout component with id = '" + element.id + "' is being rendered."
      };
      readyResolveFunc = busyContext.addBusyState(options);
    }
  }

  /*
   * Called to set the component not busy after rendering is finished
   */
  function _makeReady() {
    if (readyResolveFunc) {
      readyResolveFunc();
      readyResolveFunc = null;
    }
  }

  /*
   * Called to make the oj-form div busy during rendering
   */
  function _ojFormNotReady() {
    if (!ojFormReadyResolveFunc) {
      var busyContext = Context.getContext(ojForm).getBusyContext();
      var options = {
        description:
          "The oj-form div for oj-form-layout component with id = '" +
          element.id +
          "' is being rendered."
      };
      ojFormReadyResolveFunc = busyContext.addBusyState(options);
    }
  }

  /*
   * Called to make the oj-form div not busy after rendering is finished
   */
  function _ojFormMakeReady() {
    if (ojFormReadyResolveFunc) {
      ojFormReadyResolveFunc();
      ojFormReadyResolveFunc = null;
    }
  }

  /**
   * Updates the oj-form div with the appropriate styles and column count.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _updateOjFormDiv() {
    var maxCols;

    if (element.labelEdge === 'start') {
      // If labelWidth is set to 0 (including "0", "0px", "0%", etc.), we don't need the
      // oj-form-cols-labels-inline class because the labels are not visible.
      var width = parseInt(element.labelWidth, 10);
      if (isNaN(width) || width > 0) {
        ojForm.classList.add('oj-form-cols-labels-inline');
      }
      element.classList.add('oj-formlayout-labels-inline');
      ojForm.classList.remove('oj-form-cols');
    } else {
      ojForm.classList.add('oj-form-cols');
      ojForm.classList.remove('oj-form-cols-labels-inline');
      element.classList.remove('oj-formlayout-labels-inline');
    }

    if (element.labelWrapping === 'truncate') {
      ojForm.classList.add(_OJ_NOWRAP);
    } else {
      ojForm.classList.remove(_OJ_NOWRAP);
    }

    // Compute the actual number of columns and save them for later.  This depends on the style
    // classes set above, and is used by the code below, so it has to happen here.
    let oldColumns = calculatedColumns;
    calculatedColumns = _calculateColumns();
    // Any time we recalculate the number of columns, we need to adjust this style class.
    if (calculatedColumns !== oldColumns) {
      var newClass = 'oj-formlayout-max-cols-' + calculatedColumns;
      var cName = element.className;
      if (cName.indexOf('oj-formlayout-max-cols-') !== -1) {
        // This will replace the old class name with the new one
        element.className = cName.replace(/oj-formlayout-max-cols-[\d+]/, newClass);
      } else {
        element.classList.add(newClass); // First time, just add it.
      }
    }

    // When direction === "row", we need to set the columns to 1, as we use the
    // oj-flex and oj-flex-item divs to control the number of columns.
    // Also, we need to add the 'oj-formlayout-form-across' class to get the buffer between the
    // label/value pairs.
    if (element.direction === 'row') {
      maxCols = 1;
      ojForm.classList.add('oj-formlayout-form-across');
    } else {
      maxCols = calculatedColumns;
      ojForm.classList.remove('oj-formlayout-form-across');
    }

    ojForm.style.columnCount = maxCols;
    ojForm.style.webkitColumnCount = maxCols;
    ojForm.style.MozColumnCount = maxCols;
  }

  /**
   * This method goes through and removes all of the bonus dom elements, those that
   * have been marked with the 'data-oj-formlayout-bonus-dom' attribute. For oj-label bonus
   * dom elements, we just remove the element as we don't need to preserve the children.
   * For the oj-flex and oj-flex-item DIVs, we need to preserve the children as they
   * contain the original child elements that we don't want removed.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _removeAllBonusDomElements() {
    var bonusDomElems = ojForm.querySelectorAll(BONUS_DOM_SELECTOR);
    var length = bonusDomElems.length;

    for (var i = 0; i < length; ++i) {
      var bonusDomElem = bonusDomElems[i];

      // don't remove bonus dom elems owned by child oj-form-layouts
      if (_isNodeOfThisFormLayout(bonusDomElem)) {
        if (bonusDomElem.tagName === 'OJ-LABEL') {
          // Before we remove the oj-label, set the for to "" to trigger the code to
          // unlink the oj-label from its form component
          bonusDomElem.for = '';
          // For the oj-label elements we create, we can just remove them safely
          // as none of their children are the original child elements we are preserving
          bonusDomElem.parentElement.removeChild(bonusDomElem);
        } else {
          // for all other elements, remove the element preserving the children
          _removeElementAndReparentChildren(bonusDomElem);
        }
      }
    }
  }

  /**
   * For each editable value child with a label hint, add an oj-label.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addLabelsFromHints() {
    var child = ojForm.firstElementChild;
    var childCnt = 0;
    var directionIsColumn = element.direction === 'column';

    // for all of the direct children, add a label for any child element supports "labelHint"
    while (child) {
      var tagName = child.tagName.toLowerCase();
      // check for custom element
      if (tagName.indexOf('-') !== -1) {
        if (tagName === 'oj-label') {
          // if we find an oj-label component, then skip it and the next sibling element.
          // If there is no next sibling element, throw an error.  We don't need to know
          // if they are completely upgraded as we are excepting all element types for the child
          // that follows an oj-label.  The assumption is that the app developer has correctly
          // associated the oj-label with and element of some kind.
          var label = child;
          child = child.nextElementSibling; // move to the next child element

          // an oj-label should always be followed by an element
          if (!child) {
            _ensureUniqueId(element);
            _ensureUniqueId(label);

            // make the component ready before throwing an error so the page won't hang
            _ojFormMakeReady();
            _makeReady();

            throw new Error(
              "oj-form-layout component with id='" +
                element.id +
                "' has an oj-label child element with id='" +
                label.id +
                "' but has no next sibling element that it is associated with."
            );
          }
        } else if (tagName === 'oj-label-value') {
          // if were are being re-rendered, then we need to refresh any oj-label-value children.
          if (!isInitialRender) {
            child.refresh();
          }
        } else if (child.classList.contains('oj-complete')) {
          _addLabelFromHint(child);
        } else {
          // we need to tell this child if it needs an oj-flex div created for it.
          if (directionIsColumn || childCnt % calculatedColumns === 0) {
            child.setAttribute('data-oj-needs-oj-flex-div', ''); // @HTMLUpdateOK
          }
          // This custom element child hasn't been upgraded so add it to the unresolved children
          unresolvedChildren.push(child);
        }
      }

      childCnt += 1;
      child = child.nextElementSibling; // move to the next child element
    }
  }

  /**
   * Return true if the label is handled by the child element; false otherwise.
   */
  function _isLabelByChild(child) {
    return (
      element.labelEdge === 'inside' ||
      child.labelEdge === 'inside' ||
      child.labelEdge === 'none' ||
      child.tagName.toLowerCase().startsWith('oj-c-')
    );
  }

  /**
   * For one child, add an oj-label if it supports label-hint.
   *
   * @param {EventTarget} child The element that may need an oj-label created
   * @memberof oj.ojFormLayout
   * @returns {Element|null} the oj-label element or null if no label was created
   * @instance
   * @private
   */
  function _addLabelFromHint(child) {
    var ojLabel = null;

    if (_isLabelByChild(child)) {
      // if the label is created by the component we just return
      return ojLabel;
    }

    if (child instanceof Element && 'labelHint' in child && child.labelHint !== '') {
      _ensureUniqueId(child);
      ojLabel = _createOjLabelAndInitialize(child);

      // the label should preceed the input element it is associated with
      child.parentElement.insertBefore(ojLabel, child); // @HTMLUpdateOK insert oj-label containing trusted content.

      // JET's custom element's property change events,
      // e.g., labelHintChanged,
      // do not bubble and component events do bubble.
      // Therefore, we can't listen on the
      // oj-form-layout for child property change events.
      // We add them to the component themselves.
      _addChildEventListeners(child);
    }

    return ojLabel;
  }

  /**
   * create the oj-label and initialize it
   *
   * @param {Element} editableElem the element associated with the oj-label element
   * @returns {Element} the oj-label element
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _createOjLabelAndInitialize(editableElem) {
    let evLabelledBy = editableElem.labelledBy;
    if (evLabelledBy) {
      // catch the condition where the app dev removed
      // oj-label in favor of label-hint but forgot to remove labelled-by.
      let labelledByLabel = document.getElementById(evLabelledBy);
      if (labelledByLabel) {
        error(
          'The oj-form-layout descendent component with id ' +
            editableElem.id +
            ' has both label-hint and labelled-by. Remove labelled-by="' +
            evLabelledBy +
            '" since no matching element was found in the document, ' +
            'and a label will be created using the label-hint.'
        );
      }
    }
    var ojLabel = document.createElement('oj-label');
    ojLabel.setAttribute(BONUS_DOM_ATTR, ''); // @HTMLUpdateOK
    ojLabel.setAttribute(_OJ_INTERNAL, ''); // @HTMLUpdateOK

    // programmatically created elements not managed by a binding stratagy like knockout
    // needs this attribute to signal the component should be created.
    ojLabel.setAttribute('data-oj-binding-provider', 'none');
    ojLabel.setAttribute(_OJ_CONTEXT, ''); // @HTMLUpdateOK

    // Note: the hint might be null, but that is fine, we still want a label for this case to hang the required and help icons off of
    // and allow for programatic changes to label-hint, help-hints, required.
    var span = document.createElement('span');
    span.id = editableElem.id + '|hint';
    span.textContent = editableElem.labelHint;

    // For Alta theme, we ignore userAssistanceDensity and always show help on label
    if (_showUserAssistanceNotInline(editableElem)) {
      _updateLabelHelpAndShowRequired(editableElem, ojLabel);
    }

    ojLabel.appendChild(span); // @HTMLUpdateOK append span containing trusted content.

    _linkLabelAndElement(ojLabel, editableElem);

    return ojLabel;
  }

  /**
   * Link the oj-label and editable component with 'for'/'id.
   * As of v7.0 all form components have 'labelledBy' attribute. If oj-label has 'for' on it,
   * the oj-label will set labelledBy on the form component.
   *
   * @param {Element} _ojLabel
   * @param {Element} _editableElem element to link with the oj-label
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _linkLabelAndElement(_ojLabel, _editableElem) {
    var ojLabel = _ojLabel;
    var editableElem = _editableElem;
    ojLabel.id = editableElem.id + LABEL_ELEMENT_ID;
    ojLabel.setAttribute('for', editableElem.id);
  }

  /**
   * listener for labelHintChanged events.
   *
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _childLabelHintChanged(event) {
    var editable = event.target;
    // Get the hint span and update its innerText
    var span = document.getElementById(editable.id + '|hint');

    if (span) {
      span.textContent = event.detail.value;
    }
  }

  /**
   * listener for helpHintsChanged events.
   *
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _childHelpHintsChanged(event) {
    var editable = event.target;
    var ojLabel = _getOjLabelForChildElement(editable);
    let help = event.detail.value;

    if (ojLabel) {
      let showHelpOnLabel = _showRequiredHelpOnLabel(editable);
      if (showHelpOnLabel) {
        ojLabel.help = help;
      }
    }
  }

  /**
   * listener for requiredChanged events.
   *
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _childRequiredChanged(event) {
    var editable = event.target;
    var ojLabel = _getOjLabelForChildElement(editable);
    if (ojLabel) {
      let required = event.detail.value;
      // need to see if we should show required on the label.
      // For example, in 'inline' mode, required is not shown on the label.
      let showRequiredOnLabel;
      if (required) {
        showRequiredOnLabel = _showRequiredHelpOnLabel(editable);
      } else {
        showRequiredOnLabel = false;
      }
      ojLabel.showRequired = showRequiredOnLabel;
    }
  }

  /**
   * listener for userAssistanceDensityChanged events on the form controls.
   * When userAssistanceDensity changes on a form control, ojformlayout needs
   * to update the form control's label it created (if any).
   * For example, when 'compact', the label has the required icon and
   * the help definition/source icon, otherwise it does not.
   *
   * @param {Event} event the change event object
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _childUserAssistanceDensityChanged(event) {
    let eventTarget = event.target;
    let userAssistanceValue = event.detail.value; // compact or not.
    let userAssistancePrevious = event.detail.previousValue;

    // In this callback, we only care about if userAssistanceDensity
    // changed from or changed to 'compact'. So, for example,
    // if it is going from 'efficient' to 'reflow', then we can return
    if (userAssistanceValue !== 'compact' && userAssistancePrevious !== 'compact') {
      return;
    }

    let ojLabel = _getOjLabelForChildElement(eventTarget);
    // For Alta theme, we ignore userAssistanceDensity and always show help on label
    if (_showUserAssistanceNotInline(eventTarget)) {
      _updateLabelHelpAndShowRequired(eventTarget, ojLabel);
    } else {
      // clear out label because if it shown inline
      if (eventTarget.required) {
        ojLabel.showRequired = false;
      }
      const helpHints = eventTarget.helpHints;
      if (helpHints) {
        if (helpHints.definition || helpHints.source) {
          ojLabel.help = { definition: null, source: null };
        }
      }
    }
  }

  /*
   * Returns true if required is not shown inline, meaning it needs to be on the label.
   * @param {Element} editable
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _showRequiredHelpOnLabel(editable) {
    let defaultOptions = parseJSONFromFontFamily('oj-form-control-option-defaults');
    // this will return 'use' or 'ignore'. This tells us whether we should use the
    // user-assistance-density attribute or ignore it. If we ignore it, we will
    // use the displayOptions attribute.
    var useUserAssistanceOption = defaultOptions.useUserAssistanceOptionDefault;

    let displayMethod =
      useUserAssistanceOption === 'use' ? editable.userAssistanceDensity : 'displayOptions';
    return displayMethod === 'compact' || displayMethod === 'displayOptions';
  }

  /**
   * Components with label-hint and label-edge of none or inside create
   * their own labels, and therefore these event listeners are not created here,
   * but instead event listeners are in the BaseInsideLabelStrategy.
   * Only when the oj-form-layout creates the label
   * (label-edge='top' on oj-form-layout and 'provided' on component)
   * do we listen here.
   * If the child element doesn't have listeners yet, add them.
   * Only the component events bubble and not the property change events,
   * so it doesn't work to listen on the oj-form-layout for
   * these property change events. Instead we
   * put them on the child component themselves, and we share the listener.
   *
   * @param {Element} child
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addChildEventListeners(child) {
    child.addEventListener('labelHintChanged', _childLabelHintChanged);
    child.addEventListener('helpHintsChanged', _childHelpHintsChanged);
    child.addEventListener('requiredChanged', _childRequiredChanged);
    child.addEventListener('userAssistanceDensityChanged', _childUserAssistanceDensityChanged);
  }

  /**
   * This function moves any new direct children under the ojForm node, which is where the
   * oj-form-layout component expects these children to be.
   * @param {Array.<MutationRecord>} mutations the mustation list passed in to the mutation observer function
   * @returns {undefined}
   */
  function _moveNewDirectChildrenToOjFormDiv(mutations) {
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'childList') {
        var addedNodesLength = mutation.addedNodes.length;

        for (var j = 0; j < addedNodesLength; j++) {
          var child = mutation.addedNodes[j];

          // check to see if it was added as a direct child
          if (child.parentNode === element) {
            ojForm.appendChild(child);
          }
        }
      }
    }
  }

  /**
   * if the removed child nodes have event listeners we've added, remove them
   * Only the component events bubble and not the property change events,
   * so it doesn't work to listen on the oj-form-layout
   * for these property change events. We add/remove the listener from the
   * child JET component itself.
   *
   * @param {Array.<MutationRecord>} mutations the array of MutationRecords from the observer
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _removeEventListenersFromRemovedChildren(mutations) {
    var mutationsLength = mutations.length;

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (mutation.type === 'childList') {
        var removedNodesLength = mutation.removedNodes.length;

        for (var j = 0; j < removedNodesLength; j++) {
          var child = mutation.removedNodes[j];

          if (child.nodeType === 1) {
            child.removeEventListener('labelHintChanged', _childLabelHintChanged);
            child.removeEventListener('helpHintsChanged', _childHelpHintsChanged);
            child.removeEventListener('requiredChanged', _childRequiredChanged);
            child.removeEventListener(
              'userAssistanceDensityChanged',
              _childUserAssistanceDensityChanged
            );
          }
        }
      }
    }
  }

  /**
   * Return the oj-label element for a component. This may be the oj-label with a for attribute
   * for the component, or may be the oj-label that this component's labelled-by points to.
   *
   * @param {EventTarget} child The child element whose label we want to return
   * @memberof oj.ojFormLayout
   * @instance
   * @return {Element} The oj-label element.
   * @private
   */
  function _getOjLabelForChildElement(child) {
    var ojLabel;
    // for editable value components that have a labelled-by attribute, we need to
    // retrieve the oj-label by the labelledBy ID. Otherwise
    // we query for it by the for attribute.
    if ('labelledBy' in child) {
      // For some reason, element is undefined in this case, so using document
      ojLabel = document.getElementById(child.labelledBy);
    } else {
      ojLabel = element.querySelector('oj-label[for="' + child.id + '"]');
    }

    return ojLabel;
  }

  /**
   * Update the help and showRequired from the form component's helpHints and
   * required attributes.  This needs to be done after the label is no longer
   * busy.
   *
   * @param {Element} comp
   * @param {Element} _ojLabel
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _updateLabelHelpAndShowRequired(comp, _ojLabel) {
    var ojLabel = _ojLabel;
    var helpHints = comp.helpHints;

    if (helpHints) {
      // if either of these has a value, set the help property of ojLabel.
      // This is a work around for the fact that oj-label doesn't correctly
      // handle the default value for help.definition or help.source (i.e. when
      // the value is "").  If we have the default value, null or undefined
      // for both of them, we don't set the help attribute on the oj-label.
      if (helpHints.definition || helpHints.source) {
        ojLabel.help = helpHints;
      }
    }
    let required = comp.required;
    let showRequiredOnLabel;
    if (required) {
      showRequiredOnLabel = _showRequiredHelpOnLabel(comp);
    } else {
      showRequiredOnLabel = false;
    }
    ojLabel.showRequired = showRequiredOnLabel;
  }

  // Determine whether we should skip non-element nodes
  function _skipNonElementNodes() {
    // If direction is column or max-columns is 1, we don't need to move non-element nodes
    // because we are wrapping every element in its own oj-flex div, so the order
    // of the nodes will always remain the same.
    return element.direction === 'column' || calculatedColumns === 1;
  }

  // Move all non-element nodes preceding elem into ojFlex
  function _movePrecedingNonElementNodes(ojFlex, elem) {
    if (_skipNonElementNodes()) {
      return;
    }

    var firstNode;

    // Find the first of all non-element nodes preceding elem
    var sibling = elem.previousSibling;
    while (sibling && sibling.nodeType !== 1) {
      firstNode = sibling;
      sibling = sibling.previousSibling;
    }

    // Move all the non-element nodes into ojFlex in order
    while (firstNode && firstNode !== elem) {
      sibling = firstNode.nextSibling;
      ojFlex.appendChild(firstNode);
      firstNode = sibling;
    }
  }

  // Move all non-element nodes succeeding ojFlex into ojFlex
  // Stop if an oj-bind-* comment node is encountered.
  function _moveSucceedingNonElementNodes(ojFlex) {
    if (_skipNonElementNodes()) {
      return;
    }

    while (ojFlex.nextSibling) {
      var sibling = ojFlex.nextSibling;
      if (sibling.nodeType === 1) {
        // Stop if we get to an element
        break;
      } else if (sibling.nodeType === 8) {
        var str = sibling.textContent.trim();
        // Stop if we get to a start comment node for oj-bind-*
        // It needs to stay with the next element
        if (str.indexOf('oj-bind-') === 0) {
          break;
        }
      }
      // Move the node into ojFlex
      ojFlex.appendChild(sibling);
    }
  }

  // Create a new flex div for a row
  function _createRowDiv(currentRow, insertBeforeElem) {
    // If we are ending a row, move any succeeding non-element nodes into it
    // because there may be end comment node for the last element.
    if (currentRow) {
      _moveSucceedingNonElementNodes(currentRow);
    }

    var newRow = _createDivElement('oj-flex');
    insertBeforeElem.parentElement.insertBefore(newRow, insertBeforeElem); // @HTMLUpdateOK insert div containing trusted content.

    // After starting a new row, move any preceding non-element nodes into it
    // because there may be start comment nodes for the next element.
    _movePrecedingNonElementNodes(newRow, newRow);

    return newRow;
  }

  /**
   * Add an oj-flex div for each label/input pair and add an oj-flex-item div
   * for each label and each input.
   *
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addAllFlexDivs() {
    var childArray = []; // copy array
    var arrayLength = ojForm.children.length;
    var directionIsColumn = element.direction === 'column';
    var j = 0;
    var pairCnt = 0; // counter of label/element count

    _appendChildrenToArray(ojForm.children, childArray);

    var currentRow;
    var curCol = 0;
    var colspan;
    var directionColspanError = false;
    var needsFullWidthClass = false;

    // each iteration should process a label/input pair
    while (j < arrayLength) {
      var label = childArray[j];
      colspan = 1;

      if (directionIsColumn || pairCnt % calculatedColumns === 0) {
        currentRow = _createRowDiv(currentRow, label);
      } // This will be the oj-flex div for a row

      // if the current child element is on the unresolvedChildren list, skip it
      if (unresolvedChildren.indexOf(label) === -1) {
        var tagName = label.tagName.toLowerCase();
        if (tagName === 'oj-label') {
          j += 1; // skip to the next element
          var elem = childArray[j];

          // for direction === "row", we only render the oj-flex div once per row.
          _addFlexDivs(label, elem, currentRow);
        } else if ('labelHint' in label && _isLabelByChild(label)) {
          // In case of label edge = inside or top generated by component,
          // Form layout does not render the label.
          // But we want all the flow to be similar to what it does if component was rendering a label
          _addFlexDivs(label, null, currentRow);
        } else {
          // handle the non oj-label child, which includes oj-label-value
          // if the child element supports colspan, we need to calculate that actual
          // colspan based on the available columns left in this row.
          // Issue a warning if colspan is used, but direction is not set to row
          if ('colspan' in label && label.colspan > 1) {
            if (directionIsColumn) {
              // We only need to issue this error once
              if (!directionColspanError) {
                error('Colspan attribute is ignored unless direction is set to "row"');
                directionColspanError = true;
              }
            } else {
              var availableCols = calculatedColumns - curCol;
              // force integer colspan values
              colspan = Math.floor(label.colspan);
              if (element.colspanWrap === 'wrap' && availableCols < colspan && curCol > 0) {
                // If colspanWrap is 'wrap' and there isn't enough column left to satisfy colspan,
                // then just add empty flex items to take up remaining columns and adjust the counters.
                _addMissingFlexItems(currentRow, pairCnt);
                pairCnt += availableCols;
                colspan = Math.min(colspan, calculatedColumns);

                // Start a new row
                currentRow = _createRowDiv(currentRow, label);
              } else {
                // don't exceed availableCols
                colspan = Math.min(colspan, availableCols);
              }

              if (!needsFullWidthClass && calculatedColumns > 1) {
                needsFullWidthClass = true;
              }
            }
          }

          _addFlexDivs(label, null, currentRow, colspan);
        }
      }

      pairCnt += colspan;

      // we want to add a gutter div as long as we aren't at the end of the row
      if (!directionIsColumn && pairCnt % calculatedColumns !== 0) {
        _addColumnGutterDiv(currentRow);
      }

      curCol = pairCnt % calculatedColumns;
      j += 1;
    }

    // if we need the full width class, put it on the ojForm element so that if this class was
    // specified on the oj-form-layout, we don't accidentally remove it.
    if (needsFullWidthClass && !directionIsColumn) {
      ojForm.classList.add('oj-form-control-full-width');
    } else {
      ojForm.classList.remove('oj-form-control-full-width');
    }

    _addMissingFlexItems(currentRow, pairCnt);
  }

  // This function returns the actual number of columns the oj-form-layout should be
  // using.  Currently, this only applies to direction = 'row', as direction = column
  // responsive layout is handled by the browser
  function _calculateColumns() {
    let calculatedCols = element.maxColumns;
    const cols = element.columns;

    // if columns is positive, then a value was specified and we use that value
    // as absolute, rather than calculating the number of columns
    // also, we add a style class that is used to remove the column-width
    // of the oj-form div so that the browser doesn't change the number of
    // columns.
    if (cols > 0) {
      calculatedCols = cols;
      element.classList.add('oj-form-layout-no-min-column-width');
    } else {
      element.classList.remove('oj-form-layout-no-min-column-width');

      // adjust if we are in row direction.  For column direction, the browser
      // will already automatically adjust the number of displayed columns based
      // on the column-width specified.
      // TODO: should we be consistent and set the computed columns for direction
      // "column" for consistency?

      if (element.direction === 'row' && !_isIE11()) {
        // get the column width specified in the theme
        let colWidth = parseFloat(window.getComputedStyle(ojForm).columnWidth);

        // if there is no column-width, we just use max-columns
        if (!isNaN(colWidth)) {
          // get the total width of the parent container
          let totalWidth = parseFloat(window.getComputedStyle(element.parentElement).width);
          // Determine the number of columns.  This should be at least 1.
          let computedMaxCols = Math.max(Math.floor(totalWidth / colWidth), 1);

          // We can't fit the number of columns in calculatedCols, need to adjust.
          if (computedMaxCols < calculatedCols) {
            calculatedCols = computedMaxCols;
          }
        }
      }
    }

    return calculatedCols;
  }

  // The elem passed in is the elem that will be that child element for this flex item that we
  // are calculation the width for.
  function _getFullFlexItemWidth(elem, availableCols) {
    var colspan = 1;
    // For direction === 'column', we want the width to be 100%.  For 'row', we want it to be
    // the 100% divided by the number of columns.
    if (element.direction === 'column') {
      return '100%';
    }

    // If elem has a colspan property, then
    if (elem && 'colspan' in elem && elem.colspan) {
      colspan = Math.min(Math.floor(elem.colspan), availableCols); /* force integer colspan values,
                                                                      don't exceed availableCols */
    }

    let columnGap = parseJSONFromFontFamily(_OJ_DEFAULTS).columnGap;

    // TODO: remove this IE specific hack that I had to put in here because IE's rounding errors cause the resulting
    // width to be just a tad to long and was causing the last column to wrap.  This minor work around fixes that.
    let fullWidth =
      'calc(((100% / ' +
      calculatedColumns +
      ') - ((' +
      columnGap +
      ' * (' +
      (calculatedColumns - 1) +
      ') / ' +
      calculatedColumns +
      '))' +
      (_isIE11() ? ' - 0.1px' : '') +
      ')';

    // We only need to append this when we are spanning more than one column.
    if (colspan > 1) {
      fullWidth += ' * ' + colspan + ' + (' + columnGap + ' * ' + (colspan - 1) + ')';
    }

    // add the closing paren
    fullWidth += ')';

    return fullWidth;
  }

  function _addEmptyFlexItem(flexContainer, width) {
    var flexItem = _createDivElement('oj-flex-item');

    //  - IE11 doesn't allow calc() expressions in 'style.flex' so we have to specify
    // the longhand versions just in case the slotWidth is specified as a calc() expression
    flexItem.style.flexGrow = '0';
    flexItem.style.flexShrink = '1';
    flexItem.style.flexBasis = width;
    flexItem.style.width = width;
    flexItem.style.maxWidth = width;

    flexContainer.appendChild(flexItem);
    return flexItem;
  }

  function _addMissingFlexItems(flexContainer, count) {
    var last = count % calculatedColumns;
    var flexItemWidth = _getFullFlexItemWidth();

    if (element.direction !== 'column' && flexContainer && last > 0) {
      for (var i = last; i < calculatedColumns; i++) {
        // add a column gutter div for every missing column except the first.
        if (i !== last) {
          _addColumnGutterDiv(flexContainer);
        }
        _addEmptyFlexItem(flexContainer, flexItemWidth);
      }
    }
  }

  function _addColumnGutterDiv(flexContainer) {
    var gutterDiv = _createDivElement('oj-formlayout-column-gutter');
    flexContainer.appendChild(gutterDiv);
  }

  /**
   * Add an oj-flex-item div for each label and each input.
   *
   * @param {Object} labelOrElem when there is an explicit oj-label/component pair, it is the <oj-label>. Else it is the component.
   * @param {Element} elem when there is an explicit oj-label/component pair, it is the component, else it is null.
   * @param {Element} ojFlex the oj-flex div
   * @param {number} colspan
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _addFlexDivs(labelOrElem, elem, ojFlex, colspan) {
    var slotWidth = _getFullFlexItemWidth(labelOrElem, colspan);

    _movePrecedingNonElementNodes(ojFlex, labelOrElem);

    var elementOjFlexItem = _createDivElement('oj-flex-item');
    ojFlex.appendChild(elementOjFlexItem); // @HTMLUpdateOK append div containing trusted content.
    elementOjFlexItem.appendChild(labelOrElem); // @HTMLUpdateOK append oj-label containing trusted content.

    // create the component flex-item and append the element as a child
    if (elem) {
      // Set the flex style of the value flex item.
      // Set a flex-grow factor of 1 and a flex-basis of 0 so that all "value" flex items share the
      // remaining space left over by "label" flex items equally.
      //  - IE11 doesn't allow calc() expressions in 'style.flex' so we have to specify
      // the longhand versions just in case the slotWidth is specified as a calc() expression
      elementOjFlexItem.style.flexGrow = '1';
      elementOjFlexItem.style.flexShrink = '1';
      elementOjFlexItem.style.flexBasis = slotWidth;
      elementOjFlexItem.style.width = slotWidth;
      elementOjFlexItem.style.maxWidth = slotWidth;

      if (elem.tagName === _OJ_FORM_LAYOUT) {
        // For the nested form layout case, we need to have a way to apply styles to the
        // flex item element that is the parent of the oj-form-layout so that we can
        // make padding adjustments, etc.
        elementOjFlexItem.classList.add('oj-formlayout-nested-formlayout');
      }

      // If labelEdge is 'start', then we need to set the flex item to be display flex and set
      // the appropriate widths on the child wrapping divs
      if (element.labelEdge === 'start') {
        elementOjFlexItem.style.display = 'flex';
        // create wrapper divs for the label and elem so we can add flex css for the label.
        let labelWrappingDiv = _createDivElement('oj-formlayout-inline-label');
        let elemWrappingDiv = _createDivElement('oj-formlayout-inline-value');

        labelWrappingDiv.style.flexGrow = '0';
        labelWrappingDiv.style.flexShrink = '0';
        labelWrappingDiv.style.flexBasis = element.labelWidth;
        labelWrappingDiv.style.width = element.labelWidth;
        labelWrappingDiv.style.maxWidth = element.labelWidth;
        labelWrappingDiv.appendChild(labelOrElem); // @HTMLUpdateOK append oj-label containing trusted content.
        elementOjFlexItem.appendChild(labelWrappingDiv); // @HTMLUpdateOK append oj-label containing trusted content.
        elemWrappingDiv.style.flexGrow = '1';
        elemWrappingDiv.style.flexShrink = '1';
        elemWrappingDiv.style.flexBasis = 'calc(100% - ' + element.labelWidth + ')';
        elemWrappingDiv.style.width = elemWrappingDiv.style.flexBasis;
        elemWrappingDiv.style.maxWidth = elemWrappingDiv.style.flexBasis;
        elemWrappingDiv.appendChild(elem); // @HTMLUpdateOK append oj-label containing trusted content.
        elementOjFlexItem.appendChild(elemWrappingDiv); // @HTMLUpdateOK append oj-label containing trusted content.
      } else {
        // otherwise, we just need to append the elem to the flex item div
        elementOjFlexItem.appendChild(elem); // @HTMLUpdateOK append element containing trusted content.
      }
    } else if ('labelHint' in labelOrElem && _isLabelByChild(labelOrElem)) {
      elementOjFlexItem.style.flexGrow = '1';
      elementOjFlexItem.style.flexShrink = '1';
      elementOjFlexItem.style.flexBasis = slotWidth;
      elementOjFlexItem.style.width = slotWidth;
      elementOjFlexItem.style.maxWidth = slotWidth;
      elementOjFlexItem.appendChild(labelOrElem); // @HTMLUpdateOK append oj-label containing trusted content.
    } else {
      elementOjFlexItem.appendChild(labelOrElem); // @HTMLUpdateOK append oj-label containing trusted content.
      // this is actually the element flex item in this case
      //  - IE11 doesn't allow calc() expressions in 'style.flex' so we have to specify
      // the longhand versions just in case the slotWidth is specified as a calc() expression
      elementOjFlexItem.style.flexGrow = '1';
      elementOjFlexItem.style.flexShrink = '1';
      elementOjFlexItem.style.flexBasis = slotWidth;
      elementOjFlexItem.style.width = slotWidth;
      elementOjFlexItem.style.maxWidth = slotWidth;
      // We need this for both row and column direction so that labels will
      // truncate correctly.
      elementOjFlexItem.classList.add('oj-formlayout-no-label-flex-item'); // This is actually the element
      // we need to tell the oj-label-value child how many actual columns are being spanned.
      if (labelOrElem.tagName === 'OJ-LABEL-VALUE') {
        // We need to pass the columnGutter down to the oj-label-value
        let columnGap = parseJSONFromFontFamily(_OJ_DEFAULTS).columnGap;

        elementOjFlexItem.classList.add('oj-formlayout-nested-labelvalue'); // This is actually the element
        labelOrElem.setAttribute('data-oj-colspan', colspan);
        labelOrElem.setAttribute('data-oj-column-gap', columnGap);
        labelOrElem.refresh();
      } else if (labelOrElem.tagName === _OJ_FORM_LAYOUT) {
        // For the nested form layout case, we need to have a way to apply styles to the
        // flex item element that is the parent of the oj-form-layout so that we can
        // make padding adjustments, etc.
        elementOjFlexItem.classList.add('oj-formlayout-nested-formlayout');
      }
    }

    _moveSucceedingNonElementNodes(ojFlex);
  }

  /**
   * Append a children list to an array.
   *
   * @param {NodeList} children the child element list to copy
   * @param {Array.<Element>} _childArray the array to copy to
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _appendChildrenToArray(children, _childArray) {
    var childArray = _childArray;
    for (var i = children.length - 1; i >= 0; i--) {
      childArray[i] = children[i];
    }
  }

  /**
   * Create a div element and initialize it.
   *
   * @param {string} className the style class name of the div
   * @returns {Element} the created div element
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _createDivElement(className) {
    var div = document.createElement('div');
    div.setAttribute(BONUS_DOM_ATTR, ''); // @HTMLUpdateOK
    div.setAttribute(_OJ_INTERNAL, ''); // @HTMLUpdateOK
    div.classList.add(className);
    return div;
  }

  /**
   * The target element of a mutation should be a DIV with the bonus dom attribute
   * set on it.  Otherwise ignore the mutations.  We never have to worry about bonus
   * dom being inserted or removed.  The only time bonus dom elements are added
   * or removed, the mutation observer is disconnected.  The application developer
   * should never manipulate generated dom elements.  What this is checking for
   * is if there are any nodes being added or removed from our bonus dom divs while
   * the observer is active.  Specific examples would be adding a new
   * oj-input-text element, or removing an existing editable value element. These
   * should always be add to, or removed from one of the bonus dom DIV elements.
   * Any set of mutations that doesn't contain at least one node added or removed
   * from a bonus dom div will be ignored.
   *
   * @param {Array.<MutationRecord>} mutations the array of MutationRecords from the observer
   * @private
   * @returns {boolean} true if we should ignore these mutations
   */
  function _ignoreMutations(mutations) {
    var ignore = true;
    var mutationsLength = mutations.length;
    var dontIgnoreAttribute = ['colspan', 'label-hint'];

    for (var i = 0; i < mutationsLength; i++) {
      var mutation = mutations[i];

      if (
        mutation.type === 'childList' &&
        _isBonusDomDivOrSelf(mutation.target) &&
        _isNodeOfThisFormLayout(mutation.target)
      ) {
        ignore = false;
        break;
      }
      // If an attribute we care about changes on a child, we don't ignore the mutation
      if (mutation.type === 'attributes' && dontIgnoreAttribute.includes(mutation.attributeName)) {
        ignore = false;
        break;
      }
    }

    return ignore;
  }

  /**
   * Checks to see if the node is a DIV with our bonus dom attribute on it or if it is the
   * oj-form-layout itself.
   *
   * @param {Node} node Node to check.
   * @returns {boolean|null} true if we have a parent DIV with the bonus dom attribute
   */
  function _isBonusDomDivOrSelf(node) {
    return (
      node === element || (node && node.tagName === 'DIV' && node.hasAttribute(BONUS_DOM_ATTR))
    );
  }
  /**
   * Checks to make sure that this node belongs to this oj-form-layout rather than a nested -oj-form-layout
   * @param {Node} node
   * @returns {boolean}
   */
  function _isNodeOfThisFormLayout(_node) {
    var node = _node;
    var result = true;

    while (node !== element) {
      if (node.tagName === _OJ_FORM_LAYOUT) {
        result = false;
        break;
      }

      node = node.parentElement;

      // must be a deleted node so ignore it
      if (node == null) {
        result = false;
        break;
      }
    }

    return result;
  }
  /**
   * Remove a dom element preserving all of its children
   *
   * @param {Element} elem
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _removeElementAndReparentChildren(elem) {
    // We need to reparent all nodes, not just element nodes because some comment nodes
    // may be oj-bind-* components.
    while (elem.firstChild) {
      var child = elem.firstChild;
      elem.parentNode.insertBefore(child, elem); // @HTMLUpdateOK reparenting existing element.
    }

    elem.parentNode.removeChild(elem);
  }

  /**
   * If an element doesn't have an ID, generate a unique ID for it.
   *
   * @param {Element} _elem
   * @memberof oj.ojFormLayout
   * @instance
   * @private
   */
  function _ensureUniqueId(_elem) {
    var elem = _elem;
    if (!elem.id) {
      elem.id = 'oflId_' + _uidCounter;
      _uidCounter += 1;
    }
  }

  /**
   * @private
   */
  function _isIE11() {
    var agent = oj.AgentUtils.getAgentInfo();
    return agent.browser === 'ie' && agent.browserVersion === 11;
  }

  /**
   * In the Alta theme, we show required on the label with an * icon,
   * and help on label with a ? icon.
   * In the Redwood theme, we show 'Required'/help as text inline if
   * user-assistance-density attribute is not 'compact',
   * else we show it as an * on the icon.
   */
  function _showUserAssistanceNotInline(editableElem) {
    let defaultOptions = parseJSONFromFontFamily('oj-form-control-option-defaults');
    let resolvedUserAssistance = 'displayOptions';

    if (defaultOptions) {
      // this will return 'use' or 'ignore'. This tells us whether we should use the
      // user-assistance-density attribute or ignore it. If we ignore it, we will
      // use the displayOptions attribute.
      let useUserAssistanceOption = defaultOptions.useUserAssistanceOptionDefault;
      resolvedUserAssistance =
        useUserAssistanceOption === 'use' ? editableElem.userAssistanceDensity : 'displayOptions';
    }
    return resolvedUserAssistance === 'compact' || resolvedUserAssistance === 'displayOptions';
  }

  /**
   * Some properties of the form is based on the theme.
   * We first check if the user has set a value. If so, we use it and do not find a default from themes.
   * Else we take the default from themes and use it.
   */
  function _updateDefaultFromTheme(componentContext) {
    var themeDefault = parseJSONFromFontFamily(_OJ_DEFAULTS) || {};
    if (componentContext) {
      if (!componentContext.props.labelEdge) {
        element.labelEdge = themeDefault.labelEdge;
      }
      if (!componentContext.props.colspanWrap) {
        element.colspanWrap = themeDefault.colspanWrap;
      }
      if (!componentContext.props.direction) {
        element.direction = themeDefault.direction;
      }
    } else {
      if (!element.labelEdge) {
        element.labelEdge = themeDefault.labelEdge;
      }
      if (!element.colspanWrap) {
        element.colspanWrap = themeDefault.colspanWrap;
      }
      if (!element.direction) {
        element.direction = themeDefault.direction;
      }
    }
  }
}

// static function called by the bridge to get attribute default values
ojFormLayout.getDynamicDefaults = function () {
  var themeDefault = parseJSONFromFontFamily(_OJ_DEFAULTS) || {};
  return {
    labelEdge: themeDefault.labelEdge,
    direction: themeDefault.direction
  };
};

// eslint-disable-next-line wrap-iife
(function () {
  __oj_form_layout_metadata.extension._CONSTRUCTOR = ojFormLayout;
  __oj_form_layout_metadata.extension._TRACK_CHILDREN = 'nearestCustomElement';
  __oj_form_layout_metadata.extension._BINDING = {
    provide: [
      {
        name: '__oj_private_contexts',
        default: new Map([[FormVariantContext, 'default']])
      }
    ]
  };
  oj.CustomElementBridge.register('oj-form-layout', {
    metadata: oj.CollectionUtils.mergeDeep(__oj_form_layout_metadata, {
      properties: {
        readonly: {
          binding: {
            provide: [{ name: 'containerReadonly', default: false }, { name: 'readonly' }],
            consume: { name: 'containerReadonly' }
          }
        },
        userAssistanceDensity: {
          binding: {
            provide: [
              { name: 'containerUserAssistanceDensity', default: 'efficient' },
              { name: 'userAssistanceDensity', default: 'efficient' }
            ],
            consume: { name: 'containerUserAssistanceDensity' }
          }
        },
        labelEdge: {
          binding: {
            provide: [
              { name: 'containerLabelEdge' },
              { name: 'labelEdge', transform: { top: 'provided', start: 'provided' } }
            ],
            consume: { name: 'containerLabelEdge' }
          }
        },
        labelWidth: {
          binding: {
            provide: [{ name: 'labelWidth' }]
          }
        },
        labelWrapping: {
          binding: {
            // This is consumed by oj-c- form components to pass to the preact FormContext.
            provide: [{ name: 'labelWrapping' }]
          }
        }
      }
    })
  });
})();
