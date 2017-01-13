/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojeditablevalue', 'ojs/ojbutton'], 
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
 * @since 0.6
 * @classdesc
 * <h3 id="inputNumberOverview-section">
 *   JET InputNumber Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputNumberOverview-section"></a>
 * </h3>
 * <p>Description: The ojInputNumber component enhances a browser input element
 * into one that holds numbers and it has a spinbox to quickly increment or
 * decrement the number. The <code class="prettyprint">value</code> option must be a number and must
 * be within the <code class="prettyprint">min</code> and <code class="prettyprint">max</code> range.
 * </p>
 * <p>A step mismatch is when
 * the value is not a multiple of <code class="prettyprint">step</code>,
 * starting at the <code class="prettyprint">min</code>
 * or 0 if no <code class="prettyprint">min</code> is set.
 * A step mismatch will not be flagged as a validation error by default, but
 * the step up and step down feature will change the value to be a step match
 * if it isn't already.
 * </p>
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
 * <p>
 * The component is accessible; it sets and maintains the appropriate aria- attributes,
 * like aria-valuenow, aria-valuemax, aria-valuemin and aria-valuetext.
 * </p>
 * <p>
 * It is up to the application developer to associate the label to the input component.
 * For inputNumber, you should put an <code class="prettyprint">id</code> on the input, and then set
 * the <code class="prettyprint">for</code> attribute on the label to be the input's id.
 * </p>
 * <p>Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.<p>
 * <h3 id="label-section">
 *   Label and InputNumber
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#label-section"></a>
 * </h3>
 * <p>
 * For accessibility, you should associate a label element with the input
 * by putting an <code class="prettyprint">id</code> on the input, and then setting the
 * <code class="prettyprint">for</code> attribute on the label to be the input's id.
 * </p>
 * <p>
 * The component will decorate its associated label with required and help
 * information, if the <code class="prettyprint">required</code> and <code class="prettyprint">help</code> options are set.
 * </p>
 * <h3 id="state-section">
 *   Setting the Value Option
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#state-section"></a>
 * </h3>
 * <p>If the value option is undefined,
 * then the DOM value property is used, if any; else it is null.</p>
 * <p>The value option (if it is not null or undefined)
 * is coerced (+ val). e.g., "123a" is coerced to NaN</p>
 * <p>To clear out the value option, you can set it to null.
 * <code class="prettyprint">$(".selector").ojInputNumber("option", "value", null);</code>
 * </p>
 *
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * @desc Creates an ojInputNumber component
 *
 * @param {Object=} options a map of option-value pairs to set on the component
 *
 * @example <caption>Initialize component using widget API</caption>
 * &lt;input id="spin" type="text"/&gt;<br/>
 * $("#spin").ojInputNumber({'value': 10, 'max':100, 'min':0, 'step':2});
 * $("#spin").ojInputNumber({'option', 'value', 10});
 * @example <caption>Using knockout, value, min, max bind to observables - salary, salaryMax, salaryMin</caption>
 * &lt;input id="foo" data-bind="ojComponent:
 *   {component: 'ojInputNumber', value: salary, min:salaryMin, max:salaryMax, step:5}"/&gt;
 */
oj.__registerWidget("oj.ojInputNumber", $['oj']['editableValue'],
{
  version: "1.0.0",
  defaultElement: "<input>",
  widgetEventPrefix: "oj",
  options:
  {
    // TODO: revisit
    // It's expensive to create a default converter ahead of time when a page author can set a custom
    // one for if they do this will be promptly discarded.

    /**
     * A number converter instance that duck types {@link oj.NumberConverter}. Or an object literal
     * containing the properties listed below.
     * <p>
     * When <code class="prettyprint">converter</code> option changes due to programmatic
     * intervention, the component performs various tasks based on the current state it is in. </br>
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
     * <li>if component is valid when <code class="prettyprint">converter</code> option changes, the
     * display value is refreshed.</li>
     * <li>if component is invalid and is showing messages -
     * <code class="prettyprint">messagesShown</code> option is non-empty, when
     * <code class="prettyprint">converter</code> option changes, then all messages generated by the
     * component are cleared and full validation run using its current display value.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   option is not updated, and the errors pushed to <code class="prettyprint">messagesShown</code>
     *   option. The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, <code class="prettyprint">value</code>
     *   option is updated; page author can listen to the <code class="prettyprint">optionChange</code>
     *   event on the <code class="prettyprint">value</code> option to clear custom errors. The
     *   display value is refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages -
     * <code class="prettyprint">messagesHidden</code> option is non-empty, when
     * <code class="prettyprint">converter</code> option changes, then the display value is
     * refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>When component messages are cleared in the cases described above, messages created by
     * the component that are present in both <code class="prettyprint">messagesHidden</code> and
     * <code class="prettyprint">messagesShown</code> options are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> option is not cleared. Page authors can
     * choose to clear it explicitly when setting the converter option.</li>
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
     * $(".selector").ojInputNumber({value: 25000});
     *
     * @example <caption>Initialize the component with a number converter instance:</caption>
     * // Initialize converter instance using currency options
     * var options = {style: 'currency', 'currency': 'USD', maximumFractionDigits: 0};
     * var numberConverterFactory = oj.Validation.converterFactory("number");
     * var salaryConverter = numberConverterFactory.createConverter(options);<br/>
     * // set converter instance using converter option
     * $(".selector").ojInputNumber({
     *   value: 25000,
     *   converter: salaryConverter
     * });
     *
     * @example <caption>Initialize the component with converter object literal:</caption>
     * $(".selector").ojInputNumber({
     *   value: 25000,
     *   converter: {
     *     type: 'number',
     *     options : {
     *       style: 'currency',
     *       currency: 'USD',
     *       maximumFractionDigits: 0
     *     }
     *   }
     * });
     *
     * @example <caption>Change the converter option:</caption>
     * // new converter instance
     * var options = {style: 'currency', currency: 'USD', 'currencyDisplay': 'name', maximumFractionDigits: 2};
     * var numberConverterFactory = oj.Validation.converterFactory("number");
     * var salaryConverter = numberConverterFactory.createConverter(options);<br/>
     * // set converter instance using converter option
     * $(".selector").ojInputNumber("option", "converter", salaryConverter);
     *
     *
     * @default <code class="prettyprint">oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter()</code>.
     * When initialized with no options, the default options for the current locale are assumed.
     *
     * @expose
     * @access public
     * @instance
     * @memberof oj.ojInputNumber
     * @type {Object}
     */
    converter: oj.Validation.converterFactory(
            oj.ConverterFactory.CONVERTER_TYPE_NUMBER).createConverter(),

    /**
     * The maximum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is greater than the <code class="prettyprint">max</code>,
     * then the range validator flags an error to the user. The up arrow
     *  is disabled when the maximum value is reached.
     *  <p>
     * The element's <code class="prettyprint">max</code> attribute is used if it
     * exists and the option is not explicitly set.
     * <p>
     *  <code class="prettyprint">Max</code> must be a
     *  <code class="prettyprint">number</code> or <code class="prettyprint">null</code>;
     *  <code class="prettyprint">null</code> indicates no maximum. If not null,
     *  the <code class="prettyprint">max</code> option value will be coerced (+).
     *  If the coerced value is <code class="prettyprint">NaN</code>,
     *  an <code class="prettyprint">Error</code> is thrown.
     * <p>
     * The <code class="prettyprint">max</code> must not be less than the
     * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
     * @expose
     * @memberof oj.ojInputNumber
     * @instance
     * @type {?number}
     * @default <code class="prettyprint">null</code>
     * @example <caption>Initialize the inputNumber with the
     * <code class="prettyprint">max</code> option specified:</caption>
     * $( ".selector" ).ojInputNumber( { "max": 100 } );
     * @example <caption>Change the
     * <code class="prettyprint">max</code> option to a float:</caption>
     * $( ".selector" ).ojInputNumber("option", "max", 100.5);
     * @example <caption>To remove the maximum range restriction from inputNumber:</caption>
     * $( ".selector" ).ojInputNumber( { "max": null } );
     * @example <caption>Set the <code class="prettyprint">max</code> to a non-number
     * which will throw an Error:</caption>
     * $( ".selector" ).ojInputNumber( { "max": "123abc" } );
     * $( ".selector" ).ojInputNumber( { "max": "abc123" } );
     * @example <caption>Set the <code class="prettyprint">max</code> to a number inside
     * of quotes; this is valid and will be coerced to a number,
     * -100 in this example:</caption>
     * $( ".selector" ).ojInputNumber( { "max": "-100" } );
     */
    max: null,

    /**
     * The minimum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is less than the <code class="prettyprint">min</code>,
     * then the range validator flags an error to the user. The down arrow
     *  is disabled when the minimum value is reached.
     *  <p>
     * The element's <code class="prettyprint">min</code> attribute is used if it
     * exists and the option is not explicitly set.
     * <p>
     *  <code class="prettyprint">Min</code> must be a
     *  <code class="prettyprint">number</code> or <code class="prettyprint">null</code>;
     *  <code class="prettyprint">null</code> indicates no minimum. If not null,
     *  the <code class="prettyprint">min</code> option value will be coerced (+).
     *  If the coerced value is <code class="prettyprint">NaN</code>,
     *  an <code class="prettyprint">Error</code> is thrown.
     * <p>
     * The <code class="prettyprint">max</code> must not be less than the
     * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
     * @expose
     * @memberof oj.ojInputNumber
     * @instance
     * @type {?number}
     * @default <code class="prettyprint">null</code>
     * @example <caption>Initialize the inputNumber with the
     * <code class="prettyprint">min</code> option specified:</caption>
     * $( ".selector" ).ojInputNumber( { "min": -100 } );
     * @example <caption>Change the
     * <code class="prettyprint">min</code> option to a float:</caption>
     * $( ".selector" ).ojInputNumber("option", "min", 1.5);
     * @example <caption>To remove the minimum range restriction from inputNumber:</caption>
     * $( ".selector" ).ojInputNumber( { "min": null } );
     * @example <caption>Set the <code class="prettyprint">min</code> to a non-number
     * which will throw an Error:</caption>
     * $( ".selector" ).ojInputNumber( { "min": "123abc" } );
     * $( ".selector" ).ojInputNumber( { "min": "abc123" } );
     * @example <caption>Set the <code class="prettyprint">min</code> to a number inside
     * of quotes; this is valid and will be coerced to a number,
     * -100 in this example:</caption>
     * $( ".selector" ).ojInputNumber( { "min": "-100" } );
     */
    min: null,

    /**
     * The placeholder text to set on the element. Though it is possible to set placeholder
     * attribute on the element itself, the component will only read the value when the component
     * is created. Subsequent changes to the element's placeholder attribute will not be picked up
     * and page authors should update the option directly.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">placeholder</code> option:</caption>
     * &lt;input id="number" data-bind="ojComponent: {
     *   component: 'ojInputNumber', placeholder: 'Please enter a number'}" /&gt;
     *
     * @example <caption>Initialize <code class="prettyprint">placeholder</code> option from html attribute:</caption>
     * &lt;input id="number" data-bind="ojComponent: {component: 'ojInputNumber'}"
     *   placeholder="Please enter a number" /&gt;
     *
     * @default when the option is not set, the element's placeholder attribute is used if it exists.
     * If the attribute is not set then the default can be a converter hint. See displayOptions for
     * details.
     *
     * @expose
     * @instance
     * @memberof oj.ojInputNumber
     * @type {string|null|undefined}
     */
    placeholder: undefined,
    /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only option for retrieving
     * the current value from the input field in text form.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
     * ..., and finally '1,200'. Then when the user blurs or presses Enter
     * the <code class="prettyprint">value</code> option gets updated.
     * </p>
     * <p>This is a read-only option so page authors cannot set or change it directly.</p>
     * @expose
     * @access public
     * @instance
     * @default n/a
     * @memberof oj.ojInputNumber
     * @type {string|undefined}
     * @since 1.2
     * @readonly
     */
    rawValue: undefined,
    /**
     * Whether the component is readOnly. The element's <code class="prettyprint">readOnly</code>
     *  property is used as its initial
     * value if it exists, when the option is not explicitly set. When neither is set,
     * <code class="prettyprint">readOnly </code>
     * defaults to false.
     *
     * @example <caption>Initialize component with <code class="prettyprint">readOnly</code> option:</caption>
     * $(".selector").ojInputNumber({"readOnly": true});
     *
     * @expose
     * @type {?boolean}
     * @default <code class="prettyprint">false</code>
     * @instance
     * @memberof oj.ojInputNumber
     */
    readOnly: false,

    /**
     * The size of the step to take when spinning via buttons or via the
     * <code class="prettyprint">stepUp()</code>/<code class="prettyprint">stepDown()</code> methods.
     * The element's <code class="prettyprint">step</code> attribute is used if it
     * exists and the option is not explicitly set. Step must be a
     * <code class="prettyprint">number</code>
     * greater than 0, otherwise an exception is thrown. It defaults to
     * <code class="prettyprint">1</code> if nothing, or <code class="prettyprint">null</code>, is specified.
     *  If not null, the <code class="prettyprint">step</code> option value will be
     *  coerced (+).
     *  If the coerced value is <code class="prettyprint">NaN</code>,
     *  an <code class="prettyprint">Error</code> is thrown.
     * <p>
     * The step up and step down feature will change the value to be a step match if it isn't already.
     * A step match is when the value is a multiple of step, starting at the
     * <code class="prettyprint">min</code> or <code class="prettyprint">0</code> if no
     * <code class="prettyprint">min</code> is set.
     * A value can be a step mismatch; if the <code class="prettyprint">value</code> is set
     * to be a step mismatch, it will not be flagged as a validation error.
     * @expose
     * @instance
     * @type {?number}
     * @default <code class="prettyprint">1</code>
     * @memberof oj.ojInputNumber
     * @example <caption>Initialize the inputNumber with the
     * <code class="prettyprint">step</code> option specified:</caption>
     * $( ".selector" ).ojInputNumber( { "step": 10 } );
     * @example <caption>Change the
     * <code class="prettyprint">step</code> option to a float:</caption>
     * $( ".selector" ).ojInputNumber("option", "step", 0.5);
     * @example <caption>Set the <code class="prettyprint">step</code> to a non-number
     * which will throw an Error:</caption>
     * $( ".selector" ).ojInputNumber( { "step": "123abc" } );
     * $( ".selector" ).ojInputNumber( { "step": "abc123" } );
     * @example <caption>Set the <code class="prettyprint">step</code> to a number inside
     * of quotes; this is valid and will be coerced to a number,
     * 10 in this example:</caption>
     * $( ".selector" ).ojInputNumber( { "step": "10" } );
     * */
    step: 1,
    /**
     * The value of the component. Value should be a number.
     *
     * <p>
     * When <code class="prettyprint">value</code> option changes due to programmatic
     * intervention, the component always clears all messages and runs deferred validation, and
     * always refreshes UI display value. If the value cannot be coerced to a number, an
     * Error is thrown.</br>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>All messages are cleared. This includes
     * <code class="prettyprint">messagesHidden</code>, <code class="prettyprint">messagesShown</code>
     *  and <code class="prettyprint">messagesCustom</code> options.</li>
     * </ul>
     *
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; if there is a validation error the
     * <code class="prettyprint">messagesHidden</code> option is updated.</li>
     * </ul>
     * </p>
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">value</code> option specified:</caption>
     * $(".selector").ojInputNumber({'value': 55});<br/>
     * @example <caption>Get or set <code class="prettyprint">value</code> option, after initialization:</caption>
     * // Getter: returns 55
     * $(".selector").ojInputNumber("option", "value");
     * // Setter: sets 20
     * $(".selector").ojInputNumber("option", "value", 20);
     * @example <caption>Set the <code class="prettyprint">value</code> to a non-number
     * which will throw an Error:</caption>
     * $( ".selector" ).ojInputNumber( { "value": "123abc" } );
     * $( ".selector" ).ojInputNumber( { "value": "abc123" } );
     * @example <caption>Set the <code class="prettyprint">value</code> to a number inside
     * of quotes; this is valid and will be coerced to a number,
     * 10 in this example:</caption>
     * $( ".selector" ).ojInputNumber( { "value": "10" } );
     * @example <caption>Set the <code class="prettyprint">value</code> to an empty string;
     * this is valid and value is coerced (+), to 0 in this example:</caption>
     * $( ".selector" ).ojInputNumber( { "value": "" } );
     * @expose
     * @access public
     * @instance
     * @default <code class="prettyprint">null</code>
     * When the option is not set, the element's dom value is used as its initial value
     * if it exists.
     * @memberof oj.ojInputNumber
     * @type {Object|null}
     */
    value: null
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
   * @instance
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   * $( ".selector" ).ojInputNumber( "refresh" );
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
   * @param {Number} steps - Number of steps to decrement, defaults to 1.
   * @expose
   * @instance
   * @memberof oj.ojInputNumber
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
   * @param {Number} steps - Number of steps to increment, defaults to 1.
   * @expose
   * @instance
   * @memberof oj.ojInputNumber
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
  * For example, if we have the step option defaulted to 12 in this class, it will be 12. (unless there
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

    if (opts['value'] === undefined)
    {
      throw new Error("ojInputNumber has no value");
    }

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
   * @memberof! oj.ojInputNumber
   * @instance
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
      default:
        break;
    }

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

    if (key === "value" || key === "max" || key === "min")
    {
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

    //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
    oj.DomUtils.unwrap(this.element, this.uiInputNumber);
    clearTimeout(this.timer);
    return ret;
  },
  /**
   * Used for explicit cases where the component needs to be refreshed
   * (e.g., when the value option changes or other UI gestures).
   * @override
   * @protected
   * @memberof oj.ojInputNumber
   */
  _Refresh: function(name, value, forceDisplayValueRefresh)
  {
    this._superApply(arguments);
    var valueMinMax = (name === "value" || name === "max" || name === "min");
    var valueMinMaxDisabled = valueMinMax || name === "disabled";
    var valuenow;

    if (valueMinMaxDisabled)
    {
      valuenow = this._getConvertedDisplayValue();
    }
    if (valueMinMax)
      this._refreshAriaMinMaxValue(valuenow);
    if (name === "converter")
      this._refreshAriaText(valuenow);
    // needs to get called if value, min, max, or disabled change, but not otherwise.
    // put this condition since EditableValue calls _Refresh for every
    // option change, and we don't want to updateButtons for every single option
    // change.
    if (valueMinMaxDisabled)
      this._updateButtons(valuenow);
  },
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
        this._superApply(arguments) :
        $["oj"]["ojInputNumber"]["prototype"]["options"]["converter"];
  },
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
    "touchstart .oj-inputnumber-button": function(event)
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
    "mousedown .oj-inputnumber-button": function(event)
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
    "mouseenter .oj-inputnumber-button": function(event)
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
   * @type {Object}
   */
  _OPTION_TO_CSS_MAPPING:
  {
    "readOnly": "oj-read-only"
  },

    /**
   * _setup is called on create and refresh.
   * @private
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
  },
  // Mark internal JET components for automation support. The automation
  // support needs to know while traversing the nodes that the JET button/buttonset 
  // is not the root JET component, but an internal node to a JET component.
  _markInternalComponents: function ()
  {
     this.upButton.attr('data-oj-internal', true);
     this.downButton.attr('data-oj-internal', true);
     this.buttonSet.attr('data-oj-internal', true);
  },
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
   */
  _draw: function()
  {
    var element = this.element;
    this.uiInputNumber = element.addClass("oj-inputnumber-input")         
            .wrap(this._uiInputNumberHtml()).parent() // @HTMLUpdateOK
            // add buttons          
            .append(this._buttonHtml()); // @HTMLUpdateOK
     if (this.OuterWrapper) 
     {
          this.uiInputNumber = $(this.OuterWrapper).append(this.uiInputNumber);
          this.uiInputNumber.addClass("oj-inputnumber oj-component");
     }
     else 
     {
          this.uiInputNumber = this.uiInputNumber.wrap("<div class='oj-inputnumber oj-component'></div>").parent(); // @HTMLUpdateOK
     }

    //
    // TODO: need to save off attributes and reset on destroy generically.
    this.saveType = element.prop("type");
    element.attr("type", "text");


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
   */
  _uiInputNumberHtml: function()
  {
    // need to wrap the input+buttons with a span so that inline messaging
    // can come after this span, and we can position popups on this span.
    return "<span class='oj-inputnumber-wrapper'></span>";
  },
  /**
   * @private
   */
  _buttonHtml: function()
  {
    return "" + "<div class='oj-buttonset-width-auto'>" +
      "<button type='button' class='oj-inputnumber-button oj-inputnumber-down'></button>" +
      "<button type='button' class='oj-inputnumber-button oj-inputnumber-up'></button></div>";
  },
  /**
   * @private
   */
  _start: function()
  {
    this.spinning = true;
    return true;
  },
  /**
   * @private
   */
  _repeat: function(i, steps, event)
  {
    // repeat spinning as long as the key is down and min/max isn't reached
    i = i || 500;

    clearTimeout(this.timer);
    this.timer = this._delay(function()
    {
      this._repeat(40, steps, event);
    },
            i);

    this._spin(steps * this.options.step, event);
  },
  /**
   * @private
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
    var precision = this._precision(minOpt, stepOpt);
    value = this._adjustValue(value, step, minOpt, maxOpt, stepOpt, precision);
    
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
      this._SetRawValue(value, event);
    }

    // now validate and set value and all of that.
    this._SetValue(value, event, this._VALIDATION_MODE.VALIDATORS_ONLY);
  },
  /**
   * called from _adjustValue
   * @private
   */
  _precision: function(minOpt, stepOpt)
  {
    var precision = this._precisionOf(stepOpt);
    if (minOpt != null)
    {
      precision = Math.max(precision, this._precisionOf(minOpt));
    }
    return precision;
  },
  /**
   * return the number of digits after the '.'
   * called from _adjustValue->_precision
   * @private
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
   * else initial value (if present) TODO,
   * else (if type == number) 0
   * If max is not a valid value, stepUp/stepDown will never go to max. It
   * will go to the calculated valid max (one that is the largest value
   * that is an integral multiple of the step, and that is less than or equal
   * to the maximum.
   * @private
   * @param {number} value - the current value
   * @param {number} step - the step you want to adjust the value by
   * @param {number} minOpt - the min option
   * @param {number} maxOpt - the max option
   * @param {number} stepOpt - the step option
   * @param {number} precision - the precision @see _precision
   * @returns {number} - the new value after it has been adjusted
   */
  _adjustValue: function(value, step, minOpt, maxOpt, stepOpt, precision)
  {
    var newValue;
    var stepBase; 
    var aboveMin;
     
    if (precision > 0)
    {
      return this._adjustValueForFractions(value, step, minOpt, maxOpt, stepOpt, precision);
    }

    // make sure we're at a valid step when we step up or down.
    // - find out where we are relative to the base (min or 0)
    stepBase = minOpt != null ? minOpt : 0;
    
    // what if I multiply everything by 10*precision, then divide by that

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
    // decimal point (this_precision() looks at max of step/min's # of
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
   * @param {number} value - the current value
   * @param {number} step - the step you want to adjust the value by
   * @param {number} minOpt - the min option
   * @param {number} maxOpt - the max option
   * @param {number} stepOpt - the step option
   * @param {number} precision - the precision @see _precision
   * @returns {number}
   */
  _adjustValueForFractions: function(value, step, minOpt, maxOpt, stepOpt, precision)
  {
    // don't call this function if precision is 0
    oj.Assert.assert(precision > 0);
    var power = Math.pow(10,precision);
    // if minOpt, maxOpt, stepOpt are undefined, keep them that way
    var minOptPower = minOpt != null ? minOpt*power : minOpt;
    var maxOptPower = maxOpt != null ? maxOpt*power : maxOpt;
    var stepOptPower = stepOpt != null ? stepOpt*power : stepOpt;
    var adjustValuePower =   
      this._adjustValue(value*power, step*power, minOptPower, maxOptPower, stepOptPower, 0);
    return adjustValuePower/power;
    
  },
  /**
   * @private
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

    if (!this.uiInputNumber)
      return;
    
    if (!downButton && !upButton)
      return;

    // to prevent the overhead of disabling a button that is already disabled, check to see
    // if it is already disabled already.
    downButtonDisabledAlready = downButton.ojButton("option", "disabled");
    upButtonDisabledAlready = upButton.ojButton("option", "disabled");
    
    if (options.disabled || valuenow === undefined)
    {
      if (!downButtonDisabledAlready)
        downButton.ojButton("disable");
      if (!upButtonDisabledAlready)
        upButton.ojButton("disable");
    }
    else if (maxOpt != null && valuenow >= maxOpt)
    {
      if (downButtonDisabledAlready)
        downButton.ojButton("enable");
      if (!upButtonDisabledAlready)
        upButton.ojButton("disable");
    }
    else if (minOpt != null && valuenow <= minOpt)
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
   * Returns the converted display value.
   * This function gets the display value (or 0 if no display value), then parses it using
   * the converter.
   * The converted display value is used for 'valuenow'. For example,
   * the display value might be $6.00, but we want valuenow to be 6.
   * @private
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
   * @private
   */
  _createRangeValidator: function()
  {
    var options = this.options, minOpt = options['min'], maxOpt = options['max'];
    var newMin = minOpt != null ? minOpt : undefined;
    var newMax = maxOpt != null ? maxOpt : undefined;
    var translations = options['translations'];

    var reqTrans = translations ? translations['numberRange'] || {}: {};
    
    var hintMin, hintMax, hintInRange;
    var messageDetailRangeOverflow, messageDetailRangeUnderflow;
    var messageSummaryRangeOverflow, messageSummaryRangeUnderflow;

    var hint = reqTrans['hint'] || {};
    
    var messageDetail = reqTrans['messageDetail'] || {};
    var messageSummary = reqTrans['messageSummary'] || {};

    if (hint !== null)
    {
      hintMin = hint['min'] || null;
      hintMax = hint['max'] || null;
      hintInRange = hint['inRange'] || null;
    }
    if (messageDetail !== null)
    {
      messageDetailRangeOverflow = messageDetail['rangeOverflow'] || null;
      messageDetailRangeUnderflow = messageDetail['rangeUnderflow'] || null;
    }
    if (messageSummary !== null)
    {
      messageSummaryRangeOverflow = messageSummary['rangeOverflow'] || null;
      messageSummaryRangeUnderflow = messageSummary['rangeUnderflow'] || null;
    }

    var numberRangeOptions = {
      'min': newMin,
      'max': newMax,
      'hint' : {'min':hintMin || null,
                'max':hintMax || null,
                'inRange': hintInRange || null
               },
      'messageDetail' : {
                'rangeOverflow':messageDetailRangeOverflow || null,
                'rangeUnderflow': messageDetailRangeUnderflow || null},
      'messageSummary' : {
                'rangeOverflow':messageSummaryRangeOverflow || null,
                'rangeUnderflow': messageSummaryRangeUnderflow || null},
      'converter': this._GetConverter()};

    this._inputNumberDefaultValidators[oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE] =
            oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE)
            .createValidator(numberRangeOptions);
  },

  // The user can clear out min/max by setting the option to null, so we
  // do not coerce null.
  /**
   * @param {string} option name of the option. this will show up in the error if thrown
   * @param val value to parse
   * @throws {Error} if option value is invalid
   * @private
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
  }

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
   *
   * @example <caption>Invoke the <code class="prettyprint">destroy</code> method:</caption>
   * $( ".selector" ).ojInputNumber( "destroy" );
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
     *       <td>Set focus to the input. If hints, title or messages exists in a notewindow,
     *       pop up the notewindow.</td>
     *     </tr>
     *     <tr>
     *       <td>Elsewhere on Page</td>
     *       <td><kbd>Touch</kbd></td>
     *       <td>Submit the value you typed in the input field.</td>
     *     </tr>
     *     {@ojinclude "name":"labelTouchDoc"}
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
     *       <td>Set focus to input. If hints, title or messages exist in a notewindow,
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
     *     {@ojinclude "name":"labelKeyboardDoc"}
     *   </tbody>
     * </table>
     *
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
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
 * var node = $( ".selector" ).ojInputNumber( "getNodeBySubId", {'subId': 'oj-inputnumber-up'} );
 */

/**
 * <p>Sub-ID for the inputNumber's Down arrow.</p>
 *
 * @ojsubid oj-inputnumber-down
 * @memberof oj.ojInputNumber
 *
 * @example <caption>Get the node for the Down arrow:</caption>
 * var node = $( ".selector" ).ojInputNumber( "getNodeBySubId", {'subId': 'oj-inputnumber-down'} );
 */

/**
 * <p>Sub-ID for the inputNumber's input element.</p>
 * @deprecated This sub-ID is not needed.  Since the application supplies the input element, it can supply a unique ID by which the element can be accessed.
 * @ojsubid oj-inputnumber-input
 * @memberof oj.ojInputNumber
 *
 * @example <caption>Get the node for the input element:</caption>
 * var node = $( ".selector" ).ojInputNumber( "getNodeBySubId", {'subId': 'oj-inputnumber-input'} );
 */
}() ); // end of inputNumber wrapper function
(function() {
var ojInputNumberMeta = {
  "properties": {
    "converter": {
      "type": "Object"
    },
    "max": {
      "type": "number"
    },
    "min": {
      "type": "number"
    },
    "placeholder": {
      "type": "string"
    },
    "rawValue": {
      "type": "string",
      "writeback": true,
      "readOnly": true
    },
    "readOnly": {
      "type": "boolean"
    },
    "step": {
      "type": "number"
    },
    "value": {
      "type": "number",
      "writeback": true
    }
  },
  "methods": {
    "destroy": {},
    "refresh": {},
    "stepDown": {},
    "stepUp": {},
    "widget": {}
  },
  "extension": {
    "_hasWrapper": true,
    "_innerElement": 'input',
    "_widgetName": "ojInputNumber"
  }
};
oj.Components.registerMetadata('ojInputNumber', 'editableValue', ojInputNumberMeta);
oj.Components.register('oj-input-number', oj.Components.getMetadata('ojInputNumber'));
})();
});
