/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue', 'ojs/ojvalidation-number', 'ojs/ojbutton'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

// jeanne retrieved from https://raw.github.com/jquery/jquery-ui/1-10-stable/ui/jquery.ui.spinner.js on 6/2013, and then modified

/*!
 * JET InputNumber @VERSION
 *
 *
 * Depends:
 *  jquery.ui.widget.js
 */
(function() // inputNumber wrapper function, to keep "private static members" private
{
/**
 * @ojcomponent oj.ojInputNumber 
 * @augments oj.editableValue
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojInputNumber extends editableValue<number, ojInputNumberSettableProperties, number, string>"
 *               },
 *               {
 *                target: "Type",
 *                value: "ojInputNumberSettableProperties extends editableValueSettableProperties<number, number, string>",
 *                for: "SettableProperties"
 *               }
 *              ]
 * @since 0.6
 * @ojshortdesc Provides basic support for specifying a number value.
 * @ojrole textbox
 * @ojrole spinbutton
 * @ojstatus preview
 * @ojtsimport ojvalidation-base
 * @ojtsimport ojvalidation-number
 * @classdesc
 * <h3 id="inputNumberOverview-section">
 *   JET InputNumber Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputNumberOverview-section"></a>
 * </h3>
 * <p>Description: The oj-input-number component enhances a browser input element
 * into one that holds numbers and it has a spinbox to quickly increment or
 * decrement the number. The <code class="prettyprint">value</code> attribute must be a number and must
 * be within the <code class="prettyprint">min</code> and <code class="prettyprint">max</code> range.
 * </p>
 * <p>A step mismatch is when
 * the value is not a multiple of <code class="prettyprint">step</code>,
 * starting at the <code class="prettyprint">min</code>
 * else initial vlaue if no <code class="prettyprint">min</code> is set, else 0.
 * A step mismatch will not be flagged as a validation error by default, but
 * the step up and step down feature will change the value to be a step match
 * if it isn't already.
 * </p>
 *
 * {@ojinclude "name":"validationAndMessagingDoc"}
 * 
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * <p>
 * The component is accessible; it sets and maintains the appropriate aria- attributes,
 * like aria-valuenow, aria-valuemax, aria-valuemin and aria-valuetext.
 * </p>
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 * 
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 *
 * <h3 id="label-section">
 *   Label and InputNumber
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * It is up to the application developer to associate the oj-label to the oj-input-number component.
 * For accessibility, you should associate a oj-label element with the oj-input-number component
 * by putting an <code class="prettyprint">id</code> on the oj-input-number element, and then setting the
 * <code class="prettyprint">for</code> attribute on the oj-label to be the component's id.
 * </p>
 *
 * @example <caption>Declare the oj-input-number component with no attributes specified:</caption>
 * &lt;oj-input-number>&lt;/oj-input-number>
 *
 * @example <caption>Initialize the component with some attributes:</caption>
 * &lt;oj-input-number id="numberId" max="100" min="0" step="2">&lt;/oj-input-number>
 *
 * @example <caption>Initialize a component attribute via component binding:</caption>
 * &lt;oj-input-number id="numberId" value="{{currentValue}}">&lt;/oj-input-number>
 */
oj.__registerWidget("oj.ojInputNumber", $['oj']['editableValue'],
{
  version: "1.0.0",
  defaultElement: "<input>",
  widgetEventPrefix: "oj",
  
  /**
   * @private
   */
  _ALLOWED_TYPES : ['number', 'text'],

  options:
  {
    /** 
     * Dictates component's autocomplete state. 
     * This attribute indicates whether the value of the control can be automatically
     * completed by the browser. The common values are "on" and "off".
     * <p>Since this attribute passes through to the input element
     * unchanged, you can look at the html specs for detailed information for how browsers behave
     * and what values besides "on" and "off" you can set. The html spec says the default is "on",
     * so when autocomplete is not explicitly set, the browsers treat it as "on".
     * </p>
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input}
     * @see {@link https://caniuse.com/#feat=input-autocomplete-onoff}
     * @see {@link https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute}
     * 
     * @example <caption>Initialize component with <code class="prettyprint">autocomplete</code> attribute:</caption>
     * &lt;oj-input-number autocomplete = "on">&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">autocomplete</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.autocomplete;
     *
     * // setter
     * myComp.autocomplete = "off";
     * 
     * @ojshortdesc Dictates component's autocomplete state.
     * @expose 
     * @type {string}
     * @ojsignature {target: "Type", value: "'on'|'off'|string", jsdocOverride: true}
     * @default "on"
     * @instance
     * @access public
     * @memberof oj.ojInputNumber
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    autocomplete: undefined,
     /** 
     * Autofocus is a Boolean that reflects the autofocus attribute, If it is set to true 
     * then the associated component  will get input focus when the page is loaded.
     * Setting this property doesn't set the focus to the component: 
     * it tells the browser to focus to it when the element is inserted in the document. 
     * 
     * @example <caption>Initialize component with <code class="prettyprint">autofocus</code> attribute:</caption>
     * &lt;oj-input-number autofocus>&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">autofocus</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.autofocus;
     *
     * // setter
     * myComp.autofocus = false;
     * 
     * @expose 
     * @type {boolean}
     * @alias autofocus
     * @access public
     * @default false
     * @instance
     * @memberof oj.ojInputNumber
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    autofocus: false,
    // TODO: revisit
    // It's expensive to create a default converter ahead of time when a page author can set a custom
    // one for if they do this will be promptly discarded.

    /**
     * A number converter instance that duck types {@link oj.NumberConverter}. Or an object literal
     * containing the properties listed below.
     * When no converter is specified, the default converter will be used,
     * and default option of "numeric" is used. 
     * <p>
     * When <code class="prettyprint">converter</code> property changes due to programmatic
     * intervention, the component performs various tasks based on the current state it is in. </br>
     * When initialized with no options, the default options for the current locale are assumed. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>Any cached converter instance is cleared and new converter created. The converter hint is
     * pushed to messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when <code class="prettyprint">converter</code> property changes, the
     * display value is refreshed.</li>
     * <li>if component is invalid and is showing messages when
     * <code class="prettyprint">converter</code> property changes, then all messages generated by the
     * component are cleared and full validation run using its current display value.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated, and the errors are shown. The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors. The display value is refreshed with the formatted
     *   value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when
     * <code class="prettyprint">converter</code> property changes, then the display value is
     * refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>messages created by
     * the component  are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared. Page authors can
     * choose to clear it explicitly when setting the converter property.</li>
     * </ul>
     * </p>
     *
     * @property {string} type - the converter type registered with the oj.ConverterFactory.
     * Usually 'number'. See {@link oj.NumberConverterFactory} for details. <br/>
     * E.g., <code class="prettyprint">{converter: {type: 'number'}</code>
     * @property {Object=} options - optional Object literal of options that the converter expects.
     * See {@link oj.IntlNumberConverter} for options supported by the jet number converter.
     * E.g., <code class="prettyprint">{converter: {type: 'number', options: {style: 'decimal'}}</code>
     *
     * @example <caption>Initialize component to use default converter</caption>
     * &lt;oj-input-number value="25000">&lt;/oj-input-number>
     *
     * @example <caption>Initialize the component with a number converter instance:</caption>
     * // Initialize converter instance using currency options
     * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
     * var numberConverterFactory = oj.Validation.converterFactory("number");
     * var salaryConverter = numberConverterFactory.createConverter(options);<br/>
     * // set converter instance using converter attribute
     * &lt;oj-input-number value="25000" converter="[[salaryConverter]]">&lt;/oj-input-number>
     *
     * @example <caption>Initialize the component with converter object literal:</caption>
     * &lt;oj-input-number value="25000" converter='
     *   {
     *     "type": "number",
     *     "options" : {
     *       "style": "currency",
     *       "currency": "USD",
     *       "maximumFractionDigits": "0"
     *     }
     *   }'>&lt;/oj-input-number>
     *
     * @example <caption>Get or set the <code class="prettyprint">converter</code> property after initialization:</caption>
     * // Getter
     * var convtr = myComponent.converter;
     * 
     * // Setter
     * myComponent.converter = salaryConverter;
     *
     *
     * @default oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter()
     *
     * @expose
     * @access public
     * @instance
     * @memberof oj.ojInputNumber
     * @ojsignature {
     *    target: "Type",
     *    value: "oj.Converter<number>|oj.Validation.FactoryRegisteredValidatorOrConverter"}
     * @type {Object}
     */
    converter: oj.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter(),

    /**
     * The maximum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is greater than the <code class="prettyprint">max</code>,
     * then the range validator flags an error to the user. The up arrow
     *  is disabled when the maximum value is reached.
     * <p>
     *  <code class="prettyprint">Max</code> must be a
     *  <code class="prettyprint">number</code> or <code class="prettyprint">null</code>;
     *  <code class="prettyprint">null</code> indicates no maximum.
     * <p>
     * The <code class="prettyprint">max</code> must not be less than the
     * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
     * @expose
     * @memberof oj.ojInputNumber
     * @instance
     * @type {?number}
     * @default null
     * @example <caption>Initialize the inputNumber with the
     * <code class="prettyprint">max</code> attribute specified:</caption>
     * &lt;oj-input-number max="100">&lt;/oj-input-number>
     * 
     * @example <caption>Change the <code class="prettyprint">max</code> property to a float:</caption>
     * myComponent.max = 100.5;
     * 
     * @example <caption>To remove the maximum range restriction from inputNumber:</caption>
     * myComponent.max =  null;
     * 
     * @example <caption>Get or set the <code class="prettyprint">max</code> property after initialization:</caption>
     * // Getter
     * var max = myComponent.max;
     * 
     * // Setter
     * myComponent.max = 100;
     */
    max: null,

    /**
     * The minimum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is less than the <code class="prettyprint">min</code>,
     * then the range validator flags an error to the user. The down arrow
     *  is disabled when the minimum value is reached.
     *  <p>
     *  <code class="prettyprint">Min</code> must be a <code class="prettyprint">number</code> or <code class="prettyprint">null</code>;
     *  <code class="prettyprint">null</code> indicates no minimum.
     * <p>
     * The <code class="prettyprint">max</code> must not be less than the
     * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
     * @expose
     * @memberof oj.ojInputNumber
     * @instance
     * @type {?number}
     * @default null
     * @example <caption>Initialize the inputNumber with the
     * <code class="prettyprint">min</code> attribute specified:</caption>
     * &lt;oj-input-number min="0">&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">min</code> property after initialization:</caption>
     * // Getter
     * var min = myComponent.min;
     * 
     * // Setter
     * myComponent.min = 0;
     * 
     * @example <caption>Change the <code class="prettyprint">min</code> property to a float:</caption>
     * myComponent.min = 10.5;
     * 
     * @example <caption>To remove the minimum range restriction from inputNumber:</caption>
     * myComponent.min =  null;
     * 
     */
    min: null,
     /** 
     * It indicates the name of the component. 
     * 
     * @example <caption>Initialize component with <code class="prettyprint">name</code> attribute:</caption>
     * &lt;oj-input-number name="myName">&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">name</code> property after initialization:</caption>
     * // getter
     * var ro = myComp.name;
     *
     * // setter
     * myComp.name = "myName";
     * 
     * @expose 
     * @type {string}
     * @alias name
     * @access public
     * @instance
     * @default ""
     * @memberof oj.ojInputNumber
     * @ojextension {_COPY_TO_INNER_ELEM: true}
     */
    name: "",
    /**
     * The placeholder text to set on the element.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> attribute:</caption>
     * &lt;oj-input-number placeholder="Enter a number">&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">placeholder</code> property after initialization:</caption>
     * // Getter
     * var placeholder = myComponent.placeholder;
     * 
     * // Setter
     * myComponent.placeholder = "Address";
     *
     * If the attribute is not set then the default can be a converter hint. See display-options for
     * details.
     *
     * @expose
     * @instance
     * @default ""
     * @memberof oj.ojInputNumber
     * @type {string|null}
     */
    placeholder: "",
    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current value from the input field in string form. The main consumer of 
     * <code class="prettyprint">rawValue</code> is a converter.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
     * ..., and finally '1,200'. Then when the user blurs or presses Enter
     * the <code class="prettyprint">value</code> property gets updated.
     * </p>
     * <p>This is a read-only property so page authors cannot set or change it directly.</p>
     * @expose
     * @access public
     * @instance
     * @memberof oj.ojInputNumber
     * @type {string|undefined}
     * @ojsignature {target:"Type", value:"string"}
     * @since 1.2.0
     * @readonly
     * @ojwriteback
     */
    rawValue: undefined,
    /**
     * Whether the component is readonly.
     *
     * @example <caption>Initialize component with <code class="prettyprint">readonly</code> attribute:</caption>
     * &lt;oj-input-number readonly>&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">readonly</code> property after initialization:</caption>
     * // Getter
     * var readonly = myComponent.readonly;
     * 
     * // Setter
     * myComponent.readonly = false;
     *
     * @default false
     * @access public
     * @expose
     * @type {?boolean}
     * @alias readonly
     * @instance
     * @memberof oj.ojInputNumber
     */
    readOnly: false,
    /** 
     * Whether the component is required or optional. When required is set to true, an implicit 
     * required validator is created using the validator factory - 
     * <code class="prettyprint">oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED).createValidator()</code>.
     * 
     * Translations specified using the <code class="prettyprint">translations.required</code> attribute 
     * and the label associated with the component, are passed through to the options parameter of the 
     * createValidator method. 
     * 
     * <p>
     * When <code class="prettyprint">required</code> property changes due to programmatic intervention, 
     * the component may clear messages and run validation, based on the current state it's in. </br>
     *  
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on 
     * the value property. This is to ensure errors are not flagged unnecessarily.
     * </li>
     * <li>if component is invalid and has deferred messages when required is set to false, then 
     * component messages are cleared but no deferred validation is run.
     * </li>
     * <li>if component is invalid and currently showing invalid messages when required is set, then 
     * component messages are cleared and normal validation is run using the current display value. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   property is not updated and the error is shown. 
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code> 
     *   event on the component to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * 
     * </p>
     * 
     * @ojvalue {boolean} false - implies a value is not required to be provided by the user. 
     * This is the default.
     * @ojvalue {boolean} true - implies a value is required to be provided by user and the 
     * input's label will render a required icon. Additionally a required validator - 
     * {@link oj.RequiredValidator} - is implicitly used if no explicit required validator is set. 
     * An explicit required validator can be set by page authors using the validators attribute. 
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">required</code> attribute:</caption>
     * &lt;oj-input-number required>&lt;/oj-input-number><br/>
     * 
     * @example <caption>Customize messages and hints used by implicit required validator when 
     * <code class="prettyprint">required</code> attribute is set:</caption> 
     * &lt;oj-input-number required translations='{"required": {
     *                 "hint": "custom: enter at least 3 alphabets",
     *                 "messageSummary": "custom: \'{label}\' is Required", 
     *                 "messageDetail": "custom: please enter a valid value for \'{label}\'"}}'>
     * &lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">required</code> property after initialization:</caption>
     * // getter
     * var rq = myComp.required;
     *
     * // setter
     * myComp.required = false;
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.ojInputNumber
     * @type {boolean}
     * @default false
     * @since 0.7
     * @see #translations
     */
    required: false, 
    /**
     * The size of the step to take when spinning via buttons or via the
     * <code class="prettyprint">stepUp()</code>/<code class="prettyprint">stepDown()</code> methods.
     * Step must be a <code class="prettyprint">number</code>
     * greater than 0, otherwise an exception is thrown. It defaults to <code class="prettyprint">1</code>.
     * <p>
     * The step up and step down feature will change the value to be a step match if it isn't already.
     * A step match is when the value is a multiple of step, starting at the
     * <code class="prettyprint">min</code>, and if min is not set, then starting at the initial value, 
     * and if neither <code class="prettyprint">min</code> or initial value are set, 
     * then starting at <code class="prettyprint">0</code>. For example, if the value is 5, min is 0,
     * and step is 100, stepUp will change value to be 100. Now if the value is 5, min is -20,
     * and step is 100, stepUp will change the value to be 80.
     * If the min is not set, and the initial value is 5 and the step is 100, then the stepUp will change
     * the value to be 105.
     * </p>
     * <p> 
     * A value can be a step mismatch; if the <code class="prettyprint">value</code> is set
     * to be a step mismatch, it will not be flagged as a validation error.
     * @expose
     * @instance
     * @type {?number}
     * @default 1
     * @memberof oj.ojInputNumber
     * @access public
     * @example <caption>Initialize the inputNumber with the
     * <code class="prettyprint">step</code> attribute specified:</caption>
     * &lt;oj-input-number step="2">&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">step</code> property after initialization:</caption>
     * // Getter
     * var step = myComponent.step;
     * 
     * // Setter
     * myComponent.step = 5;
     * */
    step: 1,
    /** 
         * List of validators used by component along with the implicit component validators
         * when performing validation. Each item is either an
     * instance that duck types {@link oj.Validator}, or is an Object literal containing the 
         * properties listed below.
     * <p>
         * Implicit validators are created by the element when certain attributes are present. 
         * For example, if the <code class="prettyprint">required</code> 
         * attribute is set, an implicit {@link oj.RequiredValidator} is created. If the 
         * <code class="prettyprint">min</code> and/or <code class="prettyprint">max</code> attribute
         * is set, an implicit {@link oj.NumberRangeValidator} is created.
         * At runtime when the component runs validation, it
         * combines all the implicit validators with all the validators 
         * specified through this <code class="prettyprint">validators</code> attribute, and runs 
         * all of them.
         * </p>
         * <p>
     * Hints exposed by validators are shown in the notewindow by default, or as determined by the 
     * 'validatorHint' property set on the <code class="prettyprint">display-options</code> 
     * attribute. 
     * </p>
     * 
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic 
     * intervention, the component may decide to clear messages and run validation, based on the 
     * current state it is in. </br>
     * 
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to 
     * messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *  
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when validators changes, component does nothing other than the 
     * steps it always performs.</li>
     * <li>if component is invalid and is showing messages when 
     * <code class="prettyprint">validators</code> changes then all component messages are cleared 
     * and full validation run using the display value on the component. 
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code> 
     *   property is not updated and the error is shown. 
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code> 
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code> 
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when validators changes, it does 
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     * 
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     * 
     * @property {string} type - the validator type that has a {@link oj.ValidatorFactory} that can 
     * be retrieved using the {@link oj.Validation} module. For a list of supported validators refer 
     * to {@link oj.ValidatorFactory}. <br/>
     * E.g., <code class="prettyprint">{validators: [{type: 'regExp'}]}</code>
     * @property {Object=} options - optional Object literal of options that the validator expects. 
     * <br/>
     * E.g., <code class="prettyprint">{validators: [{type: 'regExp', options: {pattern: '[a-zA-Z0-9]{3,}'}}]}</code>

     * 
     * @example <caption>Initialize the component with validator object literal:</caption>
     * &lt;oj-input-number validators='[{"type": "regExp", "options": {
     *                     "pattern": "[a-zA-Z0-9]{3,}", 
     *                     "messageDetail": "You must enter at least 3 letters or numbers"}}]'>
     * &lt;/oj-input-number>      
     * 
     * 
     * @example <caption>Initialize the component with multiple validator instances:</caption>
     * var validator1 = new MyCustomValidator({'foo': 'A'}); 
     * var validator2 = new MyCustomValidator({'foo': 'B'});
     * var validators = [validator1,validator2];<br/>
     * ...
     * &lt;oj-input-number validators='[[validators]]'>
     * &lt;/oj-input-number>      
     * 
     * @example <caption>Get or set the <code class="prettyprint">validators</code> property after initialization:</caption>
     * // getter
     * var validators = myComp.validators;
     *
     * // setter
     * myComp.validators = myValidators;
     * 
     * @expose 
     * @access public
     * @instance
     * @memberof oj.ojInputNumber
     * @ojsignature  { target: "Type", 
     *       value: "Array<oj.Validator<number>|oj.Validation.FactoryRegisteredValidatorOrConverter>|null",
     *       jsdocOverride: true}
     * @type {Array.<Object>|undefined}
     */
    
    validators: undefined,    
    /**
     * The value of the component. Value must be a number or null.
     * 
     * <p>
     * When <code class="prettyprint">value</code> property changes due to programmatic 
     * intervention, the component always clears all messages
     * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and 
     * always refreshes UI display value.</br>
     * 
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; if there is a validation error the 
     * <code class="prettyprint">valid</code> property is updated.</li>
     * </ul>
     * </p>
     * 
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> attribute specified:</caption>
     * &lt;oj-input-number value='10'>&lt;/oj-input-number>
     * @example <caption>Get or set <code class="prettyprint">value</code> attribute, after initialization:</caption>
     * // Getter: returns 10
     * var val = myComp.value;
     * // Setter: sets 20
     * myComp.value = 20;
     * 
     * @expose 
     * @access public
     * @instance
     * @default null
     * @ojwriteback
     * @memberof oj.ojInputNumber
     * @type {?number}
     */
    value: null,
    /**
     * The type of virtual keyboard to display for entering value on mobile browsers.  This attribute has no effect on desktop browsers.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">virtual-keyboard</code> attribute:</caption>
     * &lt;oj-input-number virtual-keyboard="number">&lt;/oj-input-number>
     * 
     * @example <caption>Get or set the <code class="prettyprint">virtualKeyboard</code> property after initialization:</caption>
     * // Getter
     * var virtualKeyboard = myComp.virtualKeyboard;
     * 
     * // Setter
     * myComp.virtualKeyboard = "number";
     *
     * @expose
     * @instance
     * @memberof oj.ojInputNumber
     * @type {string}
     * @ojvalue {string} "auto" The component will determine the best virtual keyboard to use.
     *                          <p>This is always "text" for this release but may change in future
     *                          releases.</p>
     * @ojvalue {string} "number" Use a virtual keyboard for entering number.
     *                            <p>Note that on Android and Windows Mobile, the "number" keyboard does
     *                            not contain the minus sign.  This value should not be used on fields that
     *                            accept negative values.</p>
     * @ojvalue {string} "text" Use a virtual keyboard for entering text.
     * @default "auto"
     * @since 5.0.0
     */
    virtualKeyboard: "auto"

    // Events

    /**
     * Triggered when the ojInputNumber is created.
     *
     * @event
     * @name create
     * @memberof oj.ojInputNumber
     * @instance
     * @property {Event} event event object
     * @property {Object} ui Currently empty
     * @ignore
     *
     * @example <caption>Initialize the ojInputNumber with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojInputNumber({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },
  // P U B L I C    M E T H O D S

  getNodeBySubId: function(locator)
  {
    var node = this._superApply(arguments), subId;
    if (!node)
    {
      subId = locator['subId'];
      if (subId === "oj-inputnumber-up") {
        node = this.widget().find(".oj-inputnumber-up")[0];
      }
      if (subId === "oj-inputnumber-down") {
        node = this.widget().find(".oj-inputnumber-down")[0];
      }
      if (subId === "oj-inputnumber-input") {
        node = this.widget().find(".oj-inputnumber-input")[0];
      }
    }
    // Non-null locators have to be handled by the component subclasses
    return node || null;
 },
  getSubIdByNode: function(node)
  {
    var subId = null;

    if (node != null)
    {
      if(node === this.widget().find(".oj-inputnumber-up")[0])
      {
        subId = {'subId': "oj-inputnumber-up"};
      }
      else if(node === this.widget().find(".oj-inputnumber-down")[0])
      {
        subId = {'subId': "oj-inputnumber-down"};
      }
      else if(node === this.widget().find(".oj-inputnumber-input")[0])
      {
        subId = {'subId': "oj-inputnumber-input"};
      }
    }

    return subId || this._superApply(arguments);
  },
  /**
   * Refreshes the inputNumber component
   * <p>A <code class="prettyprint">refresh()</code> or re-init is required
   * when an inputNumber is changed in a non-option way, like in the following circumstances:
   * <ul>
   *   <li>Button translations change.</li>
   * </ul>
   * @expose
   * @memberof oj.ojInputNumber
   * @access public
   * @instance
   * @return {void}
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   * myComp.refresh();
   */
  refresh: function()
  {
    this._super();
    this._setup();
  },
  /**
   * <p>Decrements the value by the specified number of steps.
   * Without the parameter, a single step is decremented.</p>
   <p>If the resulting value is above the max, below the min,
   or results in a step mismatch, the value will be adjusted to the closest valid value.</p>
   * @param {number=} steps - Number of steps to decrement, defaults to 1.
   * @return {void}
   * @expose
   * @instance
   * @memberof oj.ojInputNumber
   * @access public
   * @example <caption>Invoke the <code class="prettyprint">stepDown</code> method:</caption>
   * myComp.stepDown();
   */
  stepDown: function(steps)
  {
    this._step(steps, false);
  },
   /**
   * <p>Increments the value by the specified number of steps.
   * Without the parameter, a single step is incremented.</p>
   <p>If the resulting value is above the max, below the min,
   or results in a step mismatch, the value will be adjusted to the closest valid value.</p>
   * @param {number=} steps - Number of steps to increment, defaults to 1.
   * @return {void}
   * @expose
   * @instance
   * @memberof oj.ojInputNumber
   * @access public
   * @example <caption>Invoke the <code class="prettyprint">stepUp</code> method:</caption>
   * myComp.stepUp();
  */
  stepUp: function(steps)
  {
    this._step(steps, true);
  },

  /**
   * Returns a jQuery object containing the element visually representing the inputnumber.
   *
   * <p>This method does not accept any arguments.
   *
   * @expose
   * @memberof oj.ojInputNumber
   * @instance
   * @return {jQuery} the inputnumber
   * @access public
   * @ignore
   */
  widget: function()
  {
    return this.uiInputNumber;
  },

  // P R O T E C T E D    C O N S T A N T S   A N D   M E T H O D S

  // *********** START WIDGET FACTORY METHODS (they retain _camelcase naming convention) **********


  /**
  * Called at component create time primarily to initialize options, often using DOM values. This
  * method is called before _ComponentCreate is called, so components that override this method
  * should be aware that the component has not been rendered yet. The element DOM is available and
  * can be relied on to retrieve any default values. <p>
  * @param {!Object} originalDefaults - original default options defined on the widget and its ancestors.
  * For example, if we have the step attribute defaulted to 12 in this class, it will be 12. (unless there
  * is some global default on the component ?)
  * @param {?Object} constructorOptions - options passed into the widget constructor
  *
  * @memberof oj.ojInputNumber
  * @instance
  * @protected
  */
  _InitOptions: function(originalDefaults, constructorOptions)
  {
    var opts = this.options;
    var self = this;;

    // call super class with arguments: originalDefaults and constructorOptions. It will set
    // the this.options.
    this._superApply(arguments);

    if (!this._IsCustomElement())
    {
      // 'props' is the list of properties that I need to get from the dom if they aren't already defined in the options.
      // There is no need to list defaults here like we used to do
      // since the defaults are in originalDefaults and they are merged in with the options in the this._superApply call.

      // attribute below is the html-5 dom attribute name. If 'option' is different, like in the case of
      // readonly (readonly html vs readOnly (camelcase) component option), specify both.
      var props =
        [{attribute: "disabled", validateOption: true},
        {attribute: "placeholder"},
        {attribute: "value"}, // don't coerce here. I do it myself
        {attribute: "readonly", option: "readOnly", validateOption: true},
        {attribute: "required", coerceDomValue: true, validateOption: true},
        {attribute: "title"},
        {attribute: "min"},
        {attribute: "max"},
        {attribute: "step"}];


      oj.EditableValueUtils.initializeOptionsFromDom(props, constructorOptions, this,
        // post-process callback
        function (initializedOptions)
        {
        // coerce regardless of where the option value came from - dom/constructor
          var toParse = ['value', 'step', 'min', 'max'];

          for (var i=0; i<toParse.length; i++)
          {
            var opt = toParse[i];
            var value = (opt in initializedOptions) ? initializedOptions[opt] : opts[opt];
            if (value != null)
            {
              if (opt === 'step')
                initializedOptions[opt] =  self._parseStep(value);
              else
                initializedOptions[opt] =  self._parse(opt, value);
            }
          }
        }
      );
    }

    // The custom element bridge framework coerces the options according to the type in the
    // metadata file (componentRegister.js), so there is no need to do the coercion in _InitOptions
    // for custom elements like we do above for non-custom-elements.
    // Check the 'step' to make sure it's in the correct range.
    if (this._IsCustomElement())
    {
      var optValue = opts['step'];
      if (optValue != null)
      {
        // this will coerce with a + and throw an error if it is < 0.
        // since the bridge frameworkd code already coerced step to a number before _InitOptions
        // was called, all we care about is throwing an error if step < 0.
        self._parseStep(optValue);
      }
    }


    if (opts['value'] === undefined)
    {
      throw new Error("ojInputNumber has no value");
    }
    
    this.initialValue = opts['value'];

    // now make sure min < max, else throw an Error
    if (opts['min'] != null && opts['max'] != null)
    {
      if (opts['max'] < opts['min'])
      {
        throw new Error("ojInputNumber's max must not be less than min");
      }
    }

  },
  /**
   * After _ComponentCreate and _AfterCreate,
   * the widget should be 100% set up. this._super should be called first.
   * @override
   * @protected
   * @instance
   * @memberof oj.ojInputNumber
   */
  _ComponentCreate: function()
  {
    this._super();

    this._draw();

    this._inputNumberDefaultValidators = {};
    this._setup();
    // I want everything set up before I turn on events, since the events affect the component,
    // like keydown will update the value and update the buttons.
    this._on(this._events);
    
    this._focusable( this.uiInputNumber );
  },
  /**
   * Performs post processing after _SetOption() is called. Different options when changed perform
   * different tasks. See _AfterSetOption[OptionName] method for details.
   *
   * @param {string} option
   * @param {Object|string=} previous
   * @param {Object=} flags
   * @protected
   * @memberof oj.ojInputNumber
   * @instance
   * @override
   */
  _AfterSetOption : function (option, previous, flags)
  {
    this._superApply(arguments);
    switch (option)
    {
      case "min":
      case "max":
        this._Refresh(option, this.options[option]);
        break;           
      case "readOnly":
        this._AfterSetOptionDisabledReadOnly(option, oj.EditableValueUtils.readOnlyOptionOptions);
        break;
      case "required":
        this._AfterSetOptionRequired(option);
        break;
      case "validators":
        this._AfterSetOptionValidators(option);
        break;
      case "converter":
        this._AfterSetOptionConverter(option);
        break;           
      case "virtualKeyboard":
        this._SetInputType(this._ALLOWED_TYPES);
        break;        
      default:
        break;
    }

  },
  /**
   * Whether the a value can be set on the component. For example, if the component is 
   * disabled or readOnly then setting value on component is a no-op. 
   * 
   * @see #_SetValue
   * @return {boolean}
   * @memberof oj.ojInputNumber
   * @override
   * @instance
   * @protected
   */
  _CanSetValue: function ()
  {
    var readOnly;
    var superCanSetValue = this._super();
    
    if (!superCanSetValue)
      return false;

    readOnly = this.options['readOnly'] || false;
    return (readOnly) ? false : true;

    
  },
  /**
   * Performs post processing after value option changes by taking the following steps.
   * This method piggybacks on the super's method by using the 'doNotClearMessages' flag to
   * determine if this was a direct value option programmatic change.
   * 
   * - Calls super<br/>
   * - if setOption was from programmatic intervention, <br/>
   * &nbsp;&nbsp;- reset the this.initialValue which is used to determine the stepBase; <br/>
   * 
   * @param {string} option
   * @param {Object=} flags
   * 
   * @protected
   * @memberof oj.ojInputNumber
   * @instance
   * 
   */
  _AfterSetOptionValue : function(option, flags)
  {
    this._superApply(arguments);
    var context = flags ? flags['_context'] : null;
    var isUIValueChange;
    var doNotClearMessages;

    if (context)
    {
      isUIValueChange = context.originalEvent ? true : false;
      doNotClearMessages = context.doNotClearMessages || false;
    }

    if (!isUIValueChange)
    {
      // value option can be updated directly (i.e., programmatically or through user interaction) 
      // or updated indirectly as a result of some other option changing - e.g., converter, 
      // validators, required etc. See _updateValue() method for details.
      // When value changes directly due to programatic intervention (usually page author does this) 
      // then update this.initialValue.
      if (!doNotClearMessages) 
      {
        this.initialValue = this.options["value"];
      }

    }

  },
  /**
   * Whether the component is required.
   * 
   * @return {boolean} true if required; false
   * 
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   * @override
   */
  _IsRequired : function () 
  {
    return this.options['required'];
  },
  /**
   * Performs post processing after required option is set by taking the following steps.
   * 
   * - if component is invalid and has messgesShown -> required: false/true -> clear component errors; 
   * run full validation with UI value (we don't know if the UI error is from a required validator 
   * or something else);<br/>
   * &nbsp;&nbsp;- if there are validation errors, then value not pushed to model; messagesShown is 
   * updated<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to optionChange(value) to clear custom errors.<br/>
   * 
   * - if component is invalid and has messagesHidden -> required: false -> clear component 
   * errors; no deferred validation is run.<br/>
   * - if component has no error -> required: true -> run deferred validation (we don't want to flag 
   * errors unnecessarily)<br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @param {string} option
   * 
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   */
  _AfterSetOptionRequired : oj.EditableValueUtils._AfterSetOptionRequired,
  /**
   * When validators option changes, take the following steps.
   * 
   * - Clear the cached normalized list of all validator instances. push new hints to messaging.<br/>
   * - if component is valid -> validators changes -> no change<br/>
   * - if component is invalid has messagesShown -> validators changes -> clear all component 
   * messages and re-run full validation on displayValue. if there are no errors push value to 
   * model;<br/>
   * - if component is invalid has messagesHidden -> validators changes -> do nothing; doesn't change 
   * the required-ness of component <br/>
   * - messagesCustom is not cleared.<br/>
   * 
   * NOTE: The behavior applies to any option that creates implicit validators - min, max, pattern, 
   * etc. Components can call this method when these options change.
   * 
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   */
  _AfterSetOptionValidators : oj.EditableValueUtils._AfterSetOptionValidators,
  /**
   * Performs post processing after converter option changes by taking the following steps.
   * 
   * - always push new converter hint to messaging <br/>
   * - if component has no errors -> refresh UI value<br/>
   * - if component is invalid has messagesShown -> clear all component errors and run full 
   * validation using display value. <br/>
   * &nbsp;&nbsp;- if there are validation errors, value is not pushed to model; messagesShown is 
   * updated.<br/>
   * &nbsp;&nbsp;- if no errors result from the validation, push value to model; author needs to 
   * listen to optionChange(value) to clear custom errors.<br/>
   * - if component is invalid has messagesHidden -> refresh UI value. no need to run deferred 
   * validations. <br/>
   * - messagesCustom is never cleared<br/>
   * 
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   */
  _AfterSetOptionConverter : oj.EditableValueUtils._AfterSetOptionConverter,  
  /**
   * Clears the cached converter stored in _converter and pushes new converter hint to messaging.
   * Called when convterer option changes 
   * @memberof oj.ojInputNumber
   * @instance
   * @protected 
   */
  _ResetConverter : oj.EditableValueUtils._ResetConverter,
 
    // *********** END WIDGET FACTORY METHODS **********
  /**
   * Need to override since we allow users to set the converter to null, undefined, and etc and when
   * they do we use the default converter
   *
   * @return {Object} a converter instance or null
   *
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   * @override
   */
  _GetConverter : function ()
  {
    return this.options['converter'] ?
        this._getConverter() :
        $["oj"]["ojInputNumber"]["prototype"]["options"]["converter"];
  },
  /**
   * This returns an array of all validators 
   * normalized from the validators option set on the component. <br/>
   * @return {Array} of validators. 
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   */
  _GetNormalizedValidatorsFromOption : oj.EditableValueUtils._GetNormalizedValidatorsFromOption,
  
  /**
   * Called to find out if aria-required is unsupported.
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   */
  _AriaRequiredUnsupported : function()
  {
    return false;
  },
  /**
   * Handles options specific to inputnumber.
   * Note that _setOption does not get called during create in the super class.
   * It only gets called when the component has already been created.
   * However, we do call _setOption in _draw for certain attributes
   * (disabled)
   * @override
   * @protected
   * @memberof oj.ojInputNumber
   */
  _setOption: function(key, value, flags)
  {
    var coercedValue;

    if (!this._IsCustomElement() && (key === "value" || key === "max" || key === "min"))
    {
      // we only have to coerce for non-custom-elements since the frameworkd coerces for us for
      // custom elements.
      coercedValue = this._parse(key, value);
    }
    else if (key === "step")
    {
      coercedValue = this._parseStep(value);
    }
    else
      coercedValue = value;


    // the superclass calls _Refresh. Our _Refresh calls _updateButtons
    // and _refreshAriaMinMaxValue.
    // call _super with the newly coerced 'value' property.
    this._super(key, coercedValue, flags);

    if (key === "max" || key === "min")
    {
      // since validators are immutable, they will contain min + max as local values.
      // Because of this will need to recreate
      this._createRangeValidator();
      this._AfterSetOptionValidators();
    }

    // when a dom element supports disabled, use that, and not aria-disabled.
    // having both is an error.
    // having aria-disabled on root dom element is ok (if it is added in base class)
    if (key === "disabled")
    {
      // force it to be a boolean. this is what/how ojbutton, EditableValue does.
      this.element.prop("disabled", !!value);
    }
    // when a dom element supports readonly, use that, and not aria-readonly.
    // having both is an error
    if (key === "readOnly")
    {
      this.element.prop("readonly", !!value);
      this._refreshStateTheming("readOnly", this.options.readOnly);
      this._refreshRoleSpinbutton("readOnly", this.options.readOnly);
    }
  },
  /**
   * Override of protected base class method.
   * Method name needn't be quoted since is in externs.js.
   * @protected
   * @memberof oj.ojInputNumber
   * @instance
   */
  _destroy: function()
  {
    var ret = this._super();

    // destroy the buttonset
    this.buttonSet.ojButtonset("destroy");
    this.buttonSet.remove();
    this.upButton = null;
    this.downButton = null;
    this.buttonSet = null;
    this.initialValue = null;

    //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
    oj.DomUtils.unwrap(this.element, this.uiInputNumber);
    clearTimeout(this.timer);
    return ret;
  },
      
  /**
   * Validates the component's display value using the converter and all validators registered on 
   * the component and updates the <code class="prettyprint">value</code> option by performing the 
   * following steps. 
   * 
   * <p>
   * <ol> 
   * <li>All messages are cleared, including custom messages added by the app. </li>
   * <li>If no converter is present then processing continues to next step. If a converter is 
   * present, the UI value is first converted (i.e., parsed). If there is a parse error then 
   * the messages are shown.</li>
   * <li>If there are no validators setup for the component the <code class="prettyprint">value</code> 
   * option is updated using the display value. Otherwise all 
   * validators are run in sequence using the parsed value from the previous step. The implicit 
   * required validator is run first if the component is marked required. When a validation error is 
   * encountered it is remembered and the next validator in the sequence is run. </li>
   * <li>At the end of validation if there are errors, the messages are shown. 
   * If there were no errors, then the 
   * <code class="prettyprint">value</code> option is updated.</li>
   * </ol>
   * 
   * @example <caption>Validate component using its current value.</caption>
   * // validate display value and shows messages if there are any to be shown.
   * myComp.validate();
   * @example <caption>Validate component and use the Promise's resolved state.</caption>
   * myComp.validate().then(
   *  function(result) {
   *    if(result === "valid")
   *    {
   *      submitForm();
   *    }
   *  }); 
   * @return {Promise.<string>} Promise resolves to "valid" if there were no converter parse errors and
   * the component passed all validations. 
   * The Promise resolves to "invalid" if there were converter parse errors or 
   * if there were validation errors.
   * 
   * 
   * @method
   * @access public
   * @expose
   * @instance
   * @memberof oj.ojInputNumber
   * @since 4.0.0
   * @ojstatus preview
   */
  validate : oj.EditableValueUtils.validate,
  /**
   * Used for explicit cases where the component needs to be refreshed
   * (e.g., when the value option changes or other UI gestures).
   * @override
   * @protected
   * @memberof oj.ojInputNumber
   */
  _Refresh: function(name, value, forceDisplayValueRefresh)
  {
    var valuenow;
    
    this._superApply(arguments);
    
    switch (name)
    {
      case "disabled":
      case "max":
      case "min": 
      case "value":
        valuenow = this._getConvertedDisplayValue();
        // disables or enables both the up and down buttons depending upon what the value
        // is on the screen after conversion plus what min/max are set to.
        this._updateButtons(valuenow); 
        // do not break;
      case "max":
      case "min": 
      case "value":
        // refreshes the aria-valuenow, aria-min, aria-max, etc.
        this._refreshAriaMinMaxValue(valuenow);
        break;
        
      case "converter":
        valuenow = this._getConvertedDisplayValue();
        this._refreshAriaText(valuenow);
        break;
     
      case "required":
        this._refreshRequired(value);
        break;
        
      default:
        break;
        
    }
  },
  /**
   * @memberof oj.ojInputNumber
   * @instance
   * @private
   */
  _refreshRequired : oj.EditableValueUtils._refreshRequired,


  /**
   * Sets up the default numberRange validators if there is a min or max.
   *
   * @ignore
   * @protected
   * @override
   * @instance
   * @memberof oj.ojInputNumber
   */
  _GetImplicitValidators: function()
  {
    var ret = this._superApply(arguments);
    if (this.options['min'] != null || this.options['max'] != null)
    {
      this._createRangeValidator();
    }

    return $.extend(this._inputNumberDefaultValidators, ret);
  },
  /**
   * Returns the default styleclass for the component.
   *
   * @return {string}
   * @memberof oj.ojInputNumber
   * @override
   * @protected
   */
  _GetDefaultStyleClass: function()
  {
    return "oj-inputnumber";
  },
  _events:
  {
    'input': function(event)
    {
      this._SetRawValue(this.element.val(), event);
    },
    'keydown': function(event)
    {
      var keyCode = $.ui.keyCode;
      if (event.keyCode === keyCode.ENTER)
      {
        this._blurEnterSetValue(event);
        event.preventDefault();
      }
      else if (this._start() && this._keydown(event))
      {
        event.preventDefault();
      }
    },
    'keyup': function(event)
    {
      this._stop(event);
    },
    'blur': function(event)
    {
      this._blurEnterSetValue(event);
    },
    "touchstart .oj-inputnumber-button.oj-enabled": function(event)
    {
      this._start();
      
      this._repeat(null, $(event.currentTarget).hasClass("oj-inputnumber-up") ? 1 : -1, event);
    },
    "touchend .oj-inputnumber-button": function(event)
    {
      this._stop(event);
    },
    "touchcancel .oj-inputnumber-button": function(event)
    {
      this._stop(event);
    },
    "mousedown .oj-inputnumber-button.oj-enabled": function(event)
    {
      if (this._isRealMouseEvent(event))
      {
        this._start();

        this._repeat(null, $(event.currentTarget).hasClass("oj-inputnumber-up") ? 1 : -1, event);
      }
    },
    "mouseup .oj-inputnumber-button": function(event)
    {
      if (this._isRealMouseEvent(event))
      {
        this._stop(event);
      }
    },
    "mouseenter .oj-inputnumber-button.oj-enabled": function(event)
    {
      // button will add oj-active if mouse was down while mouseleave and kept down
      if (!$(event.currentTarget).hasClass("oj-active"))
      {
        return;
      }
      if (this._isRealMouseEvent(event))
      {
        this._start();

        this._repeat(null, $(event.currentTarget).hasClass("oj-inputnumber-up") ? 1 : -1, event);
      }
    },
    // TODO: do we really want to consider this a stop?
    // shouldn't we just stop the repeater and wait until mouseup before
    // we trigger the stop event?
    "mouseleave .oj-inputnumber-button": function(event)
    {
      if (this._isRealMouseEvent(event))
      {
        this._stop(event);
      }
    }
  },
  // I N T E R N A L   P R I V A T E   C O N S T A N T S    A N D   M E T H O D S
  // 
  // Subclasses should not override or call these methods
  /**
   * @private
   * @const
   * @memberof oj.ojInputNumber
   */
  _BUNDLE_KEY:
  {
    _TOOLTIP_DECREMENT: 'tooltipDecrement',
    _TOOLTIP_INCREMENT: 'tooltipIncrement'
  },
  /**
   * when below listed options are passed to the component, corresponding CSS will be toggled
   * @private
   * @const
   * @memberof oj.ojInputNumber
   * @type {Object}
   */
  _OPTION_TO_CSS_MAPPING:
  {
    "readOnly": "oj-read-only"
  },

  /**
   * _setup is called on create and refresh.
   * @private
   * @memberof oj.ojInputNumber
   */
  _setup: function()
  {

    // add/update translated strings to buttons
    var incrementString =
            this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_INCREMENT);
    var decrementString =
            this.getTranslatedString(this._BUNDLE_KEY._TOOLTIP_DECREMENT);
    var valuenow = this._getConvertedDisplayValue();
    this.upButton.ojButton({label: incrementString});
    this.downButton.ojButton({label: decrementString});
    this._refreshAriaMinMaxValue(valuenow);
    this._updateButtons(valuenow);
    // update element DOM for readOnly
    if (typeof this.options['readOnly'] === "boolean")
    {
      this.element.prop("readonly", this.options['readOnly']);
    }
    this._refreshStateTheming("readOnly", this.options.readOnly);
    this._refreshRoleSpinbutton("readOnly", this.options.readOnly);
    
    this._refreshRequired(this.options['required']);
  },
  // Mark internal JET components for automation support. The automation
  // support needs to know while traversing the nodes that the JET button/buttonset 
  // is not the root JET component, but an internal node to a JET component.
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _markInternalComponents: function ()
  {
     this.upButton.attr('data-oj-internal', '');
     this.downButton.attr('data-oj-internal', '');
     this.buttonSet.attr('data-oj-internal', '');
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _createOjButtonset: function()
  {
    var $upButton = this.uiInputNumber.find(".oj-inputnumber-up");
    var $downButton = this.uiInputNumber.find(".oj-inputnumber-down");
    var buttonsetDiv = $upButton[0].parentNode;
    this.upButton = $upButton.ojButton({display: 'icons',
      icons: {start: 'oj-component-icon oj-inputnumber-up-icon'}})
    this.downButton = $downButton.ojButton({display: 'icons',
      icons: {start: 'oj-component-icon oj-inputnumber-down-icon'}})
    this.buttonSet = $(buttonsetDiv).ojButtonset({focusManagement: 'none'});
    this._markInternalComponents();
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _draw: function()
  {
    var element = this.element;
    var widgetId;
    
    this.uiInputNumber = element.addClass("oj-inputnumber-input")         
            .wrap(this._uiInputNumberHtml()).parent() // @HTMLUpdateOK
            // add buttons          
            .append(this._buttonHtml()); // @HTMLUpdateOK
    if (this.OuterWrapper) 
    {
      this.uiInputNumber = $(this.OuterWrapper).append(this.uiInputNumber); // @HTMLUpdateOK
      this.uiInputNumber.addClass("oj-inputnumber oj-component");
    }
    else 
    {
      this.uiInputNumber = this.uiInputNumber.wrap("<div class='oj-inputnumber oj-component'></div>").parent(); // @HTMLUpdateOK
    }
    
    if (this._IsCustomElement())
    {
      // if it is a custom element, then set the sub-id on the input so if they have a oj-label
      // pointing to it with the 'for' attrbiute, JAWS will read the label.
      widgetId = this.widget().attr("id");
      if (widgetId)
        oj.EditableValueUtils.setSubIdForCustomLabelFor(this._GetContentElement()[0], widgetId);
    }
    //
    // TODO: need to save off attributes and reset on destroy generically.
    this.saveType = element.prop("type");
    this._SetInputType(this._ALLOWED_TYPES);


    // As the buttons are not in the keyboard sequence at first
    // we decided it makes sense to add aria-hidden="true" to them
    // and rely on the up/down arrow keys. However, now we decided to remove aria-hidden because
    // in voiceover there is no way to access the up/down buttons otherwise.
    // Still, voiceover is broken due to this webkit bug
    //  - ios: input number doesn't support vo because of webkit bug 
    this.uiInputNumber.find(".oj-inputnumber-button")
        .attr("tabIndex", "-1");
    this._createOjButtonset();

  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _keydown: function(event)
  {
    var keyCode = $.ui.keyCode;

    switch (event.keyCode)
    {
      // keeping the up/down pressed repeats
      // using the up and down arrows will adjust the value so that it is
      // a multiple of step and it is in min/max, same as if you used the
      // up and down buttons
      case keyCode.UP:
        this._repeat(null, 1, event);
        return true;
      case keyCode.DOWN:
        this._repeat(null, -1, event);
        return true;
    }

    return false;
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _uiInputNumberHtml: function()
  {
    // need to wrap the input+buttons with a span so that inline messaging
    // can come after this span, and we can position popups on this span.
    return "<span class='oj-inputnumber-wrapper'></span>";
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _buttonHtml: function()
  {
    return "<div class='oj-buttonset-width-auto'>" +
      "<button type='button' class='oj-inputnumber-button oj-inputnumber-down'></button>" +
      "<button type='button' class='oj-inputnumber-button oj-inputnumber-up'></button></div>";
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _start: function()
  {
    this.spinning = true;
    return true;
  },
  /**
   * Calls _spin to increment or decrement the number. It is called in a loop until
   * this.timer is cleared (see this._stop(event) or min/max is reached. 
   * @private
   * @memberof oj.ojInputNumber
   */
  _repeat: function(i, steps, event)
  {
    var stopRepeat = false;
    
    // if steps is > 0, it is going up, else it is going down.
    // need to check if min/max is reached, and if so, stop the repeat.
    // we do a quick css check to see if it is disabled.
    if (steps > 0)
    {
      if (this.upButton.hasClass("oj-disabled"))
        stopRepeat = true;
    }
    else
    {
      if (this.downButton.hasClass("oj-disabled"))
        stopRepeat = true;
    }
    // repeat spinning as long as the key is down and min/max isn't reached
    i = i || 500;

    clearTimeout(this.timer);
    // this.timer will be cleared elsewhere, like when the user stops holding down the up/down
    // arrows. See this._stop
    this.timer = this._delay(function()
    {
      if (!stopRepeat)
      {

        this._repeat(40, steps, event);
      }
    },
            i);

    this._spin(steps * this.options.step, event);
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   * @param {Number} step - Number of steps to increment.
   * @param {Object=} event an optional event if this was a result of ui interaction.
   */
  _spin: function(step, event)
  {
    // When the component's 'value' changes, the displayValue is automatically updated.
    // So reading the component's display value should always give you the element's value
    var value = this._getConvertedDisplayValue();
    var options = this.options;
    var minOpt = options.min;
    var maxOpt = options.max;
    var stepOpt = options.step;
    var initialValue = this.initialValue;
    
    // get the max precision. e.g., min=2.4, initialValue=3.444, maxPrecision is 3.
    var precision = this._precision(minOpt, stepOpt, initialValue);
    
    value = this._adjustValue(value, step, minOpt, maxOpt, stepOpt, precision, initialValue);
    
    // Show the user what is going to be validated. We are making it so that clicking on the
    // up/down button is the same as if the user typed in a number and blurred.
    if (this._CanSetValue())
    {
      // update the input's val which is what the user sees.
      this.element.val(value);
      // keep aria-valuenow in sync with the input's val
      this._refreshAriaMinMaxValue(value);
      // keep up/down buttons disabled state in sync with the input's val
      this._updateButtons(value);
      // keep rawValue in sync with the input's val
      // use this.element.val() because the raw value should always be a string
      this._SetRawValue(this.element.val(), event);
    }

    // now validate and set value and all of that.
    this._SetValue(value, event, {'validationMode': this._VALIDATION_MODE.VALIDATORS_ONLY});
  },
  /**
   * called from _adjustValue
   * @private
   * @memberof oj.ojInputNumber
   */
  _precision: function(minOpt, stepOpt, value)
  {
    var precision = this._precisionOf(stepOpt);
    
    if (minOpt != null)
    {
      precision = Math.max(precision, this._precisionOf(minOpt));
    }
    
    if (value != null)
      precision = Math.max(precision, this._precisionOf(value));
    
    return precision;
  },
  /**
   * return the number of digits after the '.'
   * called from _adjustValue->_precision
   * @private
   * @memberof oj.ojInputNumber
   * @param {Number} num - Number from which to calculate the precision
   */
  _precisionOf: function(num)
  {
    var str = num.toString(), decimal = str.indexOf(".");
    return decimal === -1 ? 0 : str.length - decimal - 1;
  },
  /**
   * adjust the value to be "valid".
   * The logic follows that of HTML-5's input number.
   * http://www.w3.org/TR/html5/forms.html#dom-input-stepup
   * A valid value is one that is a multiple of
   * step starting at stepBase, where stepBase is min (if present),
   * else initial value (if present),
   * else (if type == number) 0
   * If max is not a valid value, stepUp/stepDown will never go to max. It
   * will go to the calculated valid max (one that is the largest value
   * that is an integral multiple of the step, and that is less than or equal
   * to the maximum.
   * @private
   * @memberof oj.ojInputNumber
   * @param {number} value - the current value
   * @param {number} step - the step you want to adjust the value by
   * @param {number} minOpt - the min option
   * @param {number} maxOpt - the max option
   * @param {number} stepOpt - the step option
   * @param {number} precision - the precision @see _precision
   * @param {number} initialValue - the value when the component was created
   * @returns {number} - the new value after it has been adjusted
   */
  _adjustValue: function(value, step, minOpt, maxOpt, stepOpt, precision, initialValue)
  {
    var newValue;
    var stepBase; 
    var aboveMin;
    var valueWithFraction;
    
    if (precision > 0)
    {
      valueWithFraction = 
        this._adjustValueForFractions(value, step, minOpt, maxOpt, stepOpt, precision, initialValue);
      return valueWithFraction;
    }

    // make sure we're at a valid step when we step up or down.
    // - find out where we are relative to the base.
    // follow these rules. use min, else use initial value, else use 0.
    // https://www.w3.org/TR/html5/forms.html#concept-input-min-zero
    stepBase = minOpt != null ? minOpt : initialValue;
    if (stepBase == null)
      stepBase = 0;

    
    // From http://www.w3.org/TR/html5/forms.html#dom-input-stepup:
    // If value subtracted from the step base is not an integral multiple
    // of the step, then set value to the nearest value that, when subtracted
    // from the step base, is an integral multiple of the allowed value step,
    // and that is less than value if the method invoked was stepDown() and
    // more than value if the method invoked was stepUp().

    // is value-stepBase an integral multiple of step?
    try 
    {
      value = parseFloat(value.toFixed(precision));
    }
    catch (e)
    {
      if (e instanceof TypeError)
      {
        // I've only seen this fail if they set a null converter.
        oj.Logger.warn("inputNumber's value after conversion is not a number. \n\
                      The converter must convert the value to a Number. coercing using +");
        value = +value; // coerce
      }
    }
    aboveMin = value - stepBase;
    
    var rounded = Math.round(aboveMin / stepOpt) * stepOpt;
    rounded = parseFloat(rounded.toFixed(precision));
    var multiple = (rounded === aboveMin);

    if (!multiple)
    {
      if (step < 0)
        aboveMin = Math.ceil(aboveMin / stepOpt) * stepOpt;
      else
      {
        aboveMin = Math.floor(aboveMin / stepOpt) * stepOpt;
      }
      // rounding is based on 0, so adjust back to our base
      newValue = stepBase + aboveMin + step;
    }
    else
    {
      newValue = value + step;
    }

    // fix precision from bad JS floating point math
    // toFixed returns the newValue with a specific # of digits after the
    // decimal point (this_precision() looks at max of step/min/value's # of
    // digits.
    newValue = parseFloat(newValue.toFixed(precision));
    
    if (minOpt != null && newValue < minOpt) 
    {
      return minOpt;
    }

    if (maxOpt!= null && newValue > maxOpt)
    {
      var validMax = (Math.floor((maxOpt - stepBase) / stepOpt) *
              stepOpt) + stepBase;
      // fix precision from bad JS floating point math
      validMax = parseFloat(validMax.toFixed(precision));
      return validMax;
    }

    return newValue;
  },
  /**
   * Call this from _adjustValue when you have numbers with precision > 0. This method
   * multiples everything by Math.pow(10,precision), calls _adjustValue with these numbers so that
   * the math works, then divides the result by Math.pow(10,precision) to get it back to fractions.
   * This is to work around the issue with Javascript's binary floating-point numbers not being 
   * great about adding decimal fractions. e.g., 0.1 + 0.2 is not equal to 0.3. It is 
   * an intentional consequence of the IEEE Standard for Binary Floating-Point Arithmetic (IEEE 754)
   * @private
   * @memberof oj.ojInputNumber
   * @param {number} value - the current value
   * @param {number} step - the step you want to adjust the value by
   * @param {number} minOpt - the min option
   * @param {number} maxOpt - the max option
   * @param {number} stepOpt - the step option
   * @param {number} precision - the precision @see _precision
   * @param {number} initialValue - the value when the component was created
   * @returns {number}
   */
  _adjustValueForFractions: function(value, step, minOpt, maxOpt, stepOpt, precision, initialValue)
  {
    // don't call this function if precision is 0
    oj.Assert.assert(precision > 0);
    var power = Math.pow(10,precision);
    // if minOpt, maxOpt, stepOpt are undefined, keep them that way
    // when we adjust the values to make them decimals, they should be whole numbers.
    // javascript sometimes gives them fractions (
    // e.g., 10000000.45*100=1000000044.9999999), so everywhere here we multiply
    // by power, round the value to make it a whole number.
    var minOptPower = minOpt != null ? Math.round(minOpt*power) : minOpt;
    var maxOptPower = maxOpt != null ? Math.round(maxOpt*power) : maxOpt;
    var stepOptPower = stepOpt != null ? Math.round(stepOpt*power) : stepOpt;
    
    
    var adjustValuePower =   
      this._adjustValue(Math.round(value*power), 
                        Math.round(step*power), 
                        minOptPower, 
                        maxOptPower, 
                        stepOptPower, 
                        0, 
                        Math.round(initialValue*power));
    return adjustValuePower/power;
    
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _stop: function(event)
  {
    if (!this.spinning)
    {
      return;
    }
    clearTimeout(this.timer);
    this.spinning = false;
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   * @return {boolean} true if there is no touch detected within the last 500 ms
   */
  _isRealMouseEvent: function(event)
  {
    return ! oj.DomUtils.recentTouchEnd();
  },
  /**
   * disables or enables both the up and down buttons depending upon what the value
   * is on the screen after conversion plus what min/max are set to.
   * e.g., $10.00 is on the screen, valuenow is 10
   * @private
   * @memberof oj.ojInputNumber
   */
  _updateButtons: function(valuenow)
  {
    var options = this.options;
    var maxOpt = options.max;
    var minOpt = options.min;
    var downButton = this.downButton;
    var upButton = this.upButton;
    var downButtonDisabledAlready;
    var upButtonDisabledAlready;
    var isMaxOptNonNull = maxOpt != null;
    var isMinOptNonNull = minOpt != null;

    if (!this.uiInputNumber)
      return;
    
    if (!downButton && !upButton)
      return;

    // to prevent the overhead of disabling a button that is already disabled, check to see
    // if it is already disabled already.
    downButtonDisabledAlready = downButton.hasClass("oj-disabled");
    upButtonDisabledAlready = upButton.hasClass("oj-disabled");
      
    if (options.disabled || valuenow === undefined || 
       (isMaxOptNonNull && isMinOptNonNull && maxOpt === minOpt && valuenow === maxOpt))
    {
      if (!downButtonDisabledAlready)
        downButton.ojButton("disable");
      if (!upButtonDisabledAlready)
        upButton.ojButton("disable");
    }
    else if (isMaxOptNonNull && valuenow >= maxOpt)
    {
      if (downButtonDisabledAlready)
        downButton.ojButton("enable");
      if (!upButtonDisabledAlready)
        upButton.ojButton("disable");
    }
    else if (isMinOptNonNull && valuenow <= minOpt)
    {
      if (!downButtonDisabledAlready)
        downButton.ojButton("disable");
      if (upButtonDisabledAlready)
        upButton.ojButton("enable");
    }
    else
    {
      if (downButtonDisabledAlready)
        downButton.ojButton("enable");
      if (upButtonDisabledAlready)
        upButton.ojButton("enable");
    }
    

  },
  /**
   * Returns the normalized converter instance.
   * 
   * @return {Object} a converter instance or null
   * @memberof oj.ojInputNumber
   * @instance
   * @private 
   */
  _getConverter : oj.EditableValueUtils._GetConverter,   
  /**
   * Returns the converted display value.
   * This function gets the display value (or 0 if no display value), then parses it using
   * the converter.
   * The converted display value is used for 'valuenow'. For example,
   * the display value might be $6.00, but we want valuenow to be 6.
   * @private
   * @memberof oj.ojInputNumber
   */
  _getConvertedDisplayValue: function()
  {
    var value;
    var displayValue;
    try
    {
      displayValue = this._GetDisplayValue() || 0;
      // if displayValue is not parseable, say it is 'abc',
      // then _parseValue throws an error. catch it and move on.
      // TODO: Make _parseValue protected in EditableValue();
      value = this._parseValue(displayValue);
    }
    catch (e)
    {
      // catch the error, set value to undefined, and continue to update
      // the buttons. both the up/down buttons will be disabled in this case.
      value = undefined;
    }
    return value;
  },
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _blurEnterSetValue: function(event)
  {
    var val = this.element.val();
    var valuenow;
    
    this._stop();
    valuenow = this._getConvertedDisplayValue();
    this._refreshAriaMinMaxValue(valuenow);
    this._updateButtons(valuenow);
    // _SetValue triggers valuechange event
    this._SetValue(val, event);
  },
  /**
   * Create the NumberRangeValidator. Use the translations['numberRange'] options if they exist,
   * otherwise use the NumberRangeValidator default strings for
   *  hints, messageSummary and messageDetail.
   * Use the 'min' and 'max' options.
   * @private
   * @memberof oj.ojInputNumber
   */
  _createRangeValidator: function()
  {
    var options = this.options;
    var minOpt = options['min'];
    var maxOpt = options['max'];
    var newMin = minOpt != null ? minOpt : undefined;
    var newMax = maxOpt != null ? maxOpt : undefined;
    var translations = options['translations'];
    var translationsOptionNumberRange = translations ? translations['numberRange'] || {}: {};   
    var hintMin;
    var hintMax;
    var hintInRange;
    var hintExact;
    var messageDetailRangeOverflow;
    var messageDetailRangeUnderflow;
    var messageDetailExact;
    var messageSummaryRangeOverflow;
    var messageSummaryRangeUnderflow;
    var translationsHint = translationsOptionNumberRange['hint'] || {};
    var translationsMessageDetail = translationsOptionNumberRange['messageDetail'] || {};
    var translationsMessageSummary = translationsOptionNumberRange['messageSummary'] || {};
    var numberRangeValidatorOptions;

    // First check if the translations hint/messageDetail/messageSummary options are set, and if
    // so, use them.
    // This is how the app dev could use inputNumber's translations option.
    // var element = $("#spin").ojInputNumber(
    //      {value: 10, min: -50,
    //        translations:
    //        {numberRange:
    //          {hint:
    //            {min: 'Translations Option Test: Please enter a number greater than or equal to {min}',
    //             max: 'Translations Option Test: Please enter a number less than or equal to {max}',
    //             inRange: 'Translations Option Test: Please enter a number between {min} and {max}'
    //            },
    //            messageDetail:
    //            {rangeUnderflow: 
    //            'Translations Option Test: The number {value} must be greater than or equal to {min}',
    //              rangeOverflow: 
    //              'Translations Option Test: The number {value} must be less than or equal to {max}'
    //            }
    //          }
    //        } // end numberRange
    if (translationsHint !== null)
    {
      hintMin = translationsHint['min'] || null;
      hintMax = translationsHint['max'] || null;
      hintInRange = translationsHint['inRange'] || null;
      hintExact = translationsHint['exact'] || null;
    }
    if (translationsMessageDetail !== null)
    {
      messageDetailRangeOverflow = translationsMessageDetail['rangeOverflow'] || null;
      messageDetailRangeUnderflow = translationsMessageDetail['rangeUnderflow'] || null;
      messageDetailExact = translationsMessageDetail['exact'] || null;
    }
    if (translationsMessageSummary !== null)
    {
      messageSummaryRangeOverflow = translationsMessageSummary['rangeOverflow'] || null;
      messageSummaryRangeUnderflow = translationsMessageSummary['rangeUnderflow'] || null;
    }

    // unless the translations options for the numberrange were set, the hints and messageDetails
    // and messageSummaries will be null and we'll pick up the default strings from the 
    // NumberRangeValidator.
    numberRangeValidatorOptions = {
      'min': newMin,
      'max': newMax,
      'hint' : {'min':hintMin || null,
                'max':hintMax || null,
                'inRange': hintInRange || null,
                'exact': hintExact || null
               },
      'messageDetail' : {
                'rangeOverflow':messageDetailRangeOverflow || null,
                'rangeUnderflow': messageDetailRangeUnderflow || null,
                'exact': messageDetailExact || null},
      'messageSummary' : {
                'rangeOverflow':messageSummaryRangeOverflow || null,
                'rangeUnderflow': messageSummaryRangeUnderflow || null},
      'converter': this._GetConverter()};

    this._inputNumberDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE] =
            oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE)
            .createValidator(numberRangeValidatorOptions);
  },

  // The user can clear out min/max by setting the option to null, so we
  // do not coerce null.
  /**
   * @param {string} option name of the option. this will show up in the error if thrown
   * @param val value to parse
   * @throws {Error} if option value is invalid
   * @private
   * @memberof oj.ojInputNumber
   */
  _parse: function(option, val)
  {
    var returnValue;
    if (val !== null)
      returnValue = +val;
    else
      returnValue = val;

    // isNaN(null) returns false, which is what we want
    if (isNaN(returnValue))
      throw new Error("ojInputNumber's " + option + " option is not a number");

    return returnValue;
  },
  /**
   * parse the step's value
   * We are following the behavior of HTML-5 the best we can. According
   * to the spec, it says step must be a number greater than 0.
   * Chrome defaults it to 1 if it is not.
   * @throws {Error} if option value is invalid
   * @private
   * @memberof oj.ojInputNumber
   */
  _parseStep: function(val)
  {
    var defaultStep = 1;
    var parsedStep;
    if (val === null)
      return defaultStep;
    parsedStep = this._parse("step", val);
    if (parsedStep <= 0)
    {
      // throw an exception
      throw new Error("Invalid step for ojInputNumber; step must be > 0");
    }
    // DEFAULT to 1 if it isn't > 0
    if (parsedStep === null || parsedStep <= 0)
      parsedStep = defaultStep;
    return parsedStep;
  },
  /**
   * Toggles css selector on the widget. E.g., when readOnly option changes,
   * the oj-read-only selector needs to be toggled.
   * @param {string} option
   * @param {Object|string|boolean} value
   * @private
   * @memberof oj.ojInputNumber
   */
  _refreshStateTheming: function(option, value)
  {
    if (Object.keys(this._OPTION_TO_CSS_MAPPING).indexOf(option) != -1)
    {
      // value is a boolean
      this.widget().toggleClass(this._OPTION_TO_CSS_MAPPING[option], !!value);
    }
  },
  /**
   * When readOnly option changes,
   * the role spinbutton needs to be toggled We don't have role spinbutton
   * on readOnly inputNumber.
   * @param {string} option
   * @param {Object|string|boolean} readOnly
   * @private
   * @memberof oj.ojInputNumber
   */
  _refreshRoleSpinbutton: function(option, readOnly)
  {
    readOnly = !!readOnly;
    // if readonly is true, remove role spinbutton
    // if readonly is false, add role spinbutton
    if (readOnly)
      this.element.removeAttr("role");
    else
      this.element.attr("role", "spinbutton");
  },
  /* updates the aria-value information */
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _refreshAriaMinMaxValue: function(valuenow)
  {
    var element = this.element;

    element.attr(
            {
              "aria-valuemin": this.options.min, "aria-valuemax": this.options.max,
              "aria-valuenow": valuenow
            });
    this._refreshAriaText(valuenow);
  },
  /* updates the aria-text if needed */
  /**
   * @private
   * @memberof oj.ojInputNumber
   */
  _refreshAriaText: function(valuenow)
  {
    var element = this.element;
    var valuetext = element.val();

    if (!this._CompareOptionValues("value", "" + valuenow, valuetext))
      element.attr({"aria-valuetext": valuetext});
  },
  /**
   * step the inputnumber value up or down
   * @private
   * @memberof oj.ojInputNumber
   * @param {Number} steps - Number of steps to increment.
   * @param {boolean} up If true step up, else step down.
   */
  _step: function(steps, up)
  {
    this._start();
    if (up)
      this._spin((steps || 1) * this.options.step);
    else
      this._spin((steps || 1) * -this.options.step);
    this._stop();
  },
  /**
   * Set the type of the input element based on virtualKeyboard option.
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   * @ignore
   */
  _SetInputType: oj.EditableValueUtils._SetInputType,
  /**
   * the validate method from v3.x that returns a boolean
   * @memberof oj.ojInputNumber
   * @instance
   * @protected
   * @ignore
   */
  _ValidateReturnBoolean: oj.EditableValueUtils._ValidateReturnBoolean,

  // API doc for inherited methods with no JS in this file:

  /**
   * Removes the inputNumber functionality completely.
   * This will return the element back to its pre-init state.
   *
   * <p>This method does not accept any arguments.
   *
   * @method
   * @name oj.ojInputNumber#destroy
   * @memberof oj.ojInputNumber
   * @instance
   * @ignore
   *
   * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
   * myComp.destroy();
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
     *       <td>Up Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Increment the number.</td>
     *     </tr>
     *     <tr>
     *       <td>Down Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Decrement the number.</td>
     *     </tr>
     *     <tr>
     *       <td>Input</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Set focus to the input. If hints, help.instruction or messages exists in a notewindow,
     *       pop up the notewindow.</td>
     *     </tr>
     *     <tr>
     *       <td>Elsewhere on Page</td>
     *       <td><kbd>Touch</kbd></td>
     *       <td>Submit the value you typed in the input field.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojInputNumber
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
     *       <td rowspan="4">Input</td>
     *       <td><kbd>Enter</kbd> or <kbd>Tab</kbd></td>
     *       <td>Submit the value you typed in the input field.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus to input. If hints, help.instruction or messages exist in a notewindow,
     *       pop up the notewindow.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Increment the number.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Decrement the number.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojInputNumber
     */
    /**
     * {@ojinclude "name":"ojStylingDocIntro"}
     * 
     * <table class="generic-table styling-table">
     *   <thead>
     *     <tr>
     *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
     *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>oj-form-control-text-align-right</td>
     *       <td>Aligns the text to the right regardless of the reading direction,
                 this is normally used for right aligning numbers 
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
     * @memberof oj.ojInputNumber
     */
});

// -----------------------------------------------------------------------------
// "private static members" shared by all inputNumbers
// -----------------------------------------------------------------------------

//////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for the inputNumber's Up arrow.</p>
 *
 * @ojsubid oj-inputnumber-up
 * @memberof oj.ojInputNumber
 *
 * @example <caption>Get the node for the Up arrow:</caption>
 * var node = myComp.getNodeBySubId('oj-inputnumber-up');
 */

/**
 * <p>Sub-ID for the inputNumber's Down arrow.</p>
 *
 * @ojsubid oj-inputnumber-down
 * @memberof oj.ojInputNumber
 *
 * @example <caption>Get the node for the Down arrow:</caption>
 * var node = myComp.getNodeBySubId('oj-inputnumber-down);
 */

/**
 * <p>Sub-ID for the inputNumber's input element.</p>
 * @ojsubid oj-inputnumber-input
 * @memberof oj.ojInputNumber
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = myComp.getNodeBySubId('oj-inputnumber-input');
 */
}() ); // end of inputNumber wrapper function
(function() {
var ojInputNumberMeta = {
  "properties": {
    "autocomplete": {
      "type": "string",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "autofocus": {
      "type": "boolean",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "converter": {
      "type": "Object"
    },
    "max": {
      "type": "number"
    },
    "min": {
      "type": "number"
    },
    "name": {
      "type": "string",
      "extension": {
        _COPY_TO_INNER_ELEM: true
      }
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readonly": {
      "type": "boolean"
    },
    "required": {
      "type": "boolean"
    },    
    "step": {
      "type": "number"
    },
    "translations": {
      "type": "Object",
      "properties": {
        "numberRange": {
          "type": "Object",
          "properties": {
            "hint": {
              "type": "Object",
              "properties": {
                "exact": {
                  "type": "string"
                },
                "inRange": {
                  "type": "string"
                },
                "max": {
                  "type": "string"
                },
                "min": {
                  "type": "string"
                }
              }
            },
            "messageDetail": {
              "type": "Object",
              "properties": {
                "exact": {
                  "type": "string"
                },
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            },
            "messageSummary": {
              "type": "Object",
              "properties": {
                "rangeOverflow": {
                  "type": "string"
                },
                "rangeUnderflow": {
                  "type": "string"
                }
              }
            }
          }
        },
        "required": {
          "type": "Object",
          "properties": {
            "hint": {
              "type": "string"
            },
            "messageDetail": {
              "type": "string"
            },
            "messageSummary": {
              "type": "string"
            }
          }
        },
        "tooltipDecrement": {
          "type": "string",
          "value": "Decrement"
        },
        "tooltipIncrement": {
          "type": "string",
          "value": "Increment"
        }
      }
    },
    "validators": {
      "type": "Array"
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "virtualKeyboard": {
      "type": "string",
      "enumValues": ["auto", "number", "text"]
    }
  },
  "methods": {
    "stepDown": {},
    "stepUp": {},
    "validate": {}
  },
  "extension": {
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _INNER_ELEM: 'input',
    _WIDGET_NAME: "ojInputNumber",
    _GLOBAL_TRANSFER_ATTRS: ["accesskey", "aria-label", "tabindex"]
  }
};
oj.CustomElementBridge.registerMetadata('oj-input-number', 'editableValue', ojInputNumberMeta);
oj.CustomElementBridge.register('oj-input-number', {'metadata': oj.CustomElementBridge.getMetadata('oj-input-number')});
})();
});