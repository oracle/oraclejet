/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtGauge'], function(oj, $, comp, base, dvt)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.dvtBaseGauge
 * @augments oj.dvtBaseComponent
 * @since 0.7
 * @abstract
 */
oj.__registerWidget('oj.dvtBaseGauge', $['oj']['dvtBaseComponent'],
{
  //** @inheritdoc */
  _ProcessStyles: function() {
    // The superclass evaluates the style classes, including those in _GetChildStyleClasses
    this._super();

    // Transfer the threshold colors to the correct location
    this.options['_thresholdColors'] = [this.options['_threshold1'], this.options['_threshold2'], this.options['_threshold3']];
    this.options['_threshold1'] = null;
    this.options['_threshold2'] = null;
    this.options['_threshold3'] = null;
  },
  //** @override */
  _AfterCreate: function() {
    this._super();
    var flags = {};
    flags['_context'] = {writeback: true, internalSet: true, readOnly: true};
    this.option("rawValue",this.options['value'], flags);
  },

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-gauge-metric-label'] = {'path' : 'metricLabel/style', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-gauge-tick-label'] = {'path' : 'tickLabel/style', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-gauge-threshold1'] = {'path' : '_threshold1', 'property' : 'color'};
    styleClasses['oj-gauge-threshold2'] = {'path' : '_threshold2', 'property' : 'color'};
    styleClasses['oj-gauge-threshold3'] = {'path' : '_threshold3', 'property' : 'color'};
    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['input', 'optionChange'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtGaugeBundle.EMPTY_TEXT'] = translations['labelNoData'];
    ret['DvtUtilBundle.GAUGE'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _HandleEvent : function(event) {
    var type = event['type'];
    if(type === 'valueChange') {
      var newValue = event['newValue'];
      if(event['complete'])
        this._UserOptionChange('value', newValue);
      else {
        // Fired during the value change interaction for each change
        this._trigger('input', null, {'value': newValue});
        this._UserOptionChange('rawValue', newValue);
      }
    }
    else {
      this._super(event);
    }
  },

  /**
   * @override
   * @private
   */
  _setOption : function (key, value, flags)
  {
    if (key === "rawValue") {
      // rawValue is a read-only option
      oj.Logger.error("'rawValue' is a read-only option and cannot be set");
      return;
    }

    if(key === "value") {
      var rawValueFlags = {};
      rawValueFlags['_context'] = {writeback: true, internalSet: true, readOnly: true};
      this.option("rawValue", value, rawValueFlags);
    }

    this._super(key, value, flags);
  },

  //** @inheritdoc */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-dialgauge-tooltip' || subId == 'oj-ledgauge-tooltip' || subId == 'oj-ratinggauge-tooltip' || subId == 'oj-statusmetergauge-tooltip') {
      subId = 'tooltip';
    }
	if (subId == 'oj-ratinggauge-item' && locator['index'] != null)
	  subId = 'item[' + locator['index'] + ']';

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  }
}, true);

/**
 * @ojcomponent oj.ojLedGauge
 * @augments oj.dvtBaseGauge
 * @since 0.7
 *
 * @classdesc
 * <h3 id="ledGaugeOverview-section">
 *   JET LED Gauge
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ledGaugeOverview-section"></a>
 * </h3>
 *
 * <p>LED gauges are used to highlight a specific metric value in relation to its
 * thresholds.<p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-led-gauge
 *   value='63' 
 *   min='0' 
 *   max='100'
 *   thresholds='[{"max": 33}, {"max": 67}, {}]'>
 * &lt;/oj-led-gauge>
 * </code>
 * </pre>
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"a11y"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojLedGauge', $['oj']['dvtBaseGauge'],
{
  widgetEventPrefix : "oj",
  options: {},

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    this._focusable({'element': this.element, 'applyHighlight': true});
    return dvt.LedGauge.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId == 'tooltip') {
      locator['subId'] = 'oj-ledgauge-tooltip';
    }
    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-ledgauge');
    return styleClasses;
  },

  //** @inheritdoc */
  _Render : function() {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if(this.element.attr('title'))
    {
      this.options['shortDesc'] =  this.element.attr('title');
      this.element.data( this.element,'title', this.element.attr('title'));
      this.element.removeAttr('title');
    }
    else if (this.element.data('title'))
      this.options['shortDesc'] =  this.element.data('title');

    // Call the super to render
    this._super();
  },

  /**
   * Returns the gauge's metric label.
   * @return {Object} The metric label object
   * @expose
   * @instance
   * @memberof oj.ojLedGauge
   */
  getMetricLabel: function() {
    var auto = this._component.getAutomation();
    return auto.getMetricLabel();
  }
});

/**
 * @ojcomponent oj.ojRatingGauge
 * @augments oj.dvtBaseGauge
 * @since 0.7
 *
 * @classdesc
 * <h3 id="ratingGaugeOverview-section">
 *   JET Rating Gauge
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ratingGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Rating gauges are typically used to display or accept user feedback on a product
 * or service.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-rating-gauge
 *   value='4' >
 * &lt;/oj-rating-gauge>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojRatingGauge', $['oj']['dvtBaseGauge'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Triggered during a value change gesture on mouse or touch move.
     *
     * @property {number} value the value of the gauge
     *
     * @ignore
     * @event
     * @deprecated Use the <a href="#rawValue">rawValue</a> property instead.
     * @memberof oj.ojRatingGauge
     * @instance
     */
    input : null,

    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the transient value from the rating gauge.</p>
     *
     * <p>This is a read-only property so page authors cannot set or change it directly.</p>
     * @ignore
     * @instance
     * @type {?number|undefined}
     * @memberof oj.ojRatingGauge
     * @since 1.2
     * @readonly
     * @ojwriteback
     */
     rawValue: undefined
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    this._focusable({'element': this.element, 'applyHighlight': true});
    return dvt.RatingGauge.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId == 'tooltip') {
      locator['subId'] = 'oj-ratinggauge-tooltip';
    }
	else if (subId.indexOf('item') == 0){
      locator['subId'] = 'oj-ratinggauge-item';
      locator['index'] = this._GetFirstIndex(subId);
    }
    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-ratinggauge');
    //TODO  Add style classes for rating gauge selected/hover/unselected/changed
    return styleClasses;
  },

  //** @inheritdoc */
  _Render : function() {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if(this.element.attr('title'))
    {
      this.options['shortDesc'] =  this.element.attr('title');
      this.element.data( this.element,'title', this.element.attr('title'));
      this.element.removeAttr('title');
    }
    else if (this.element.data('title'))
      this.options['shortDesc'] =  this.element.data('title');

    // Call the super to render
    this._super();
  },

  //** @inheritdoc */
  _UserOptionChange : function(key, value) {
    this._superApply(arguments);

    // If this was a value change, also update the changed value
    if(key == 'value')
      this._UserOptionChange('changed', true);
  }
});

/**
 * <p>This element has no touch interaction.  </p>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojLedGauge
 */

/**
 * <p>This element has no keyboard interaction.  </p>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojLedGauge
 */

/**
 * The metric value.
 * @expose
 * @name value
 * @memberof oj.ojLedGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * The minimum value of the gauge.
 * @expose
 * @name min
 * @memberof oj.ojLedGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * The maximum value of the gauge.
 * @expose
 * @name max
 * @memberof oj.ojLedGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">100</code>
 */
/**
 * The rotation angle for the gauge. Useful for changing the direction of triangle or arrow gauges.
 * @expose
 * @name rotation
 * @memberof oj.ojLedGauge
 * @instance
 * @type {number}
 * @ojvalue {number} 90
 * @ojvalue {number} 180
 * @ojvalue {number} 270
 * @ojvalue {number} 0
 * @default <code class="prettyprint">0</code>
 */
/**
 * The CSS style class to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name svgClassName
 * @memberof oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name svgStyle
 * @memberof oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @ignore
 * @name className
 * @memberof oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the gauge. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @ignore
 * @name style
 * @memberof oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * Fraction of area to use. Values range from 0 to 1.
 * @expose
 * @name size
 * @memberof oj.ojLedGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">1</code>
 */
/**
 * An array of objects with the following properties defining the thresholds for the gauge.
 * @expose
 * @name thresholds
 * @memberof oj.ojLedGauge
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @expose
 * @name thresholds[].max
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the threshold.
 * @expose
 * @name thresholds[].color
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the threshold.
 * @expose
 * @name thresholds[].borderColor
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name thresholds[].shortDesc
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 *  An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A function that returns a custom tooltip. The function takes a dataContext argument,
 * provided by the gauge, with the following properties:
 * <ul>
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
 *   <li>label: The computed metric label.</li>
 *   <li>color: The color of the gauge.</li>
 *   <li>componentElement: The LED gauge HTML element.</li>
 * </ul>
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape of the LED gauge. Can take the name of a built-in shape or the svg path commands for a custom shape. 
 * @expose
 * @name type
 * @memberof oj.ojLedGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "arrow"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "square"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "triangle"
 * @ojvalue {string} "star"
 * @ojvalue {string} "human"
 * @ojvalue {string} "circle"
 * @ojvalue {string} "ellipse"
 * @default <code class="prettyprint">"circle"</code>
 */
/**
 * The color of the gauge. Only applies when thresholds are not defined.
 * @expose
 * @name color
 * @memberof oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the gauge. Only applies when thresholds are not defined.
 * @expose
 * @name borderColor
 * @memberof oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the value label.
 * @expose
 * @name metricLabel
 * @memberof oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name metricLabel.style
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether the label is a number or a percentage of the total value.
 * @expose
 * @name metricLabel.textType
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "percent"
 * @ojvalue {string} "number"
 * @default <code class="prettyprint">"number"</code>
 */
/**
 * Defines if the label is rendered.
 * @expose
 * @name metricLabel.rendered
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.scaling
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "thousand"
 * @ojvalue {string} "million"
 * @ojvalue {string} "billion"
 * @ojvalue {string} "trillion"
 * @ojvalue {string} "quadrillion"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.converter
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the label. If specified, text will overwrite the numeric value that is displayed by default. The converter, scaling, and textType attributes are ignored when text is specified.
 * @expose
 * @name metricLabel.text
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the label.
 * @expose
 * @name label
 * @memberof oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name label.style
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the label.
 * @expose
 * @name label.text
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the title.
 * @ignore
 * @name title
 * @memberof oj.ojLedGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the label attribute instead.
 */
/**
 * The CSS style string defining the style of the title.
 * @ignore
 * @name title.style
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the title.
 * @ignore
 * @name title.text
 * @memberof! oj.ojLedGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether visual effects such as overlays are applied to the gauge.
 * @expose
 * @name visualEffects
 * @memberof oj.ojLedGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the LED gauge tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-ledgauge-tooltip
 * @memberof oj.ojLedGauge
 * @instance
 * 
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = myLedGauge.getNodeBySubId({'subId': 'oj-ledgauge-tooltip'});
 */
/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Value change when <code class="prettyprint">readonly</code> is <code class="prettyprint">false</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojStatusMeterGauge
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element and submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease the gauge's transient value in left-to-right locales. Increase the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase the gauge's transient value in left-to-right locales. Decrease the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojStatusMeterGauge
 */
 
 /**
 * The metric value.
 * @expose
 * @name value
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * The minimum value of the gauge.
 * @expose
 * @name min
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * The maximum value of the gauge.
 * @expose
 * @name max
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">100</code>
 */
/**
 * An array of objects with the following properties defining the reference lines for the gauge.
 * @expose
 * @name referenceLines
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The value of the reference line.
 * @expose
 * @name referenceLines[].value
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the reference line.
 * @expose
 * @name referenceLines[].color
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties defining the thresholds for the gauge.
 * @expose
 * @name thresholds
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @expose
 * @name thresholds[].max
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the threshold.
 * @expose
 * @name thresholds[].color
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the threshold.
 * @expose
 * @name thresholds[].borderColor
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name thresholds[].shortDesc
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the border radius of the indicator and plot area. When set to "auto", the border radius is set to a built-in default. Acceptable input follows CSS border-radius attribute specifications. The plot area border radius can be overwritten with the plotArea borderRadius atribute.
 * @expose
 * @name borderRadius
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 *  An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A function that returns a custom tooltip. The function takes a dataContext argument,
 * provided by the gauge, with the following properties:
 * <ul>
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
 *   <li>label: The computed metric label.</li> 
 *   <li>color: The indicator color of the gauge.</li> 
 *   <li>componentElement: The status meter gauge HTML elment.</li> 
 * </ul> 
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the gauge. Only applies when thresholds are not defined.
 * @expose
 * @name color
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name svgClassName
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name svgStyle
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @ignore
 * @name className
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the gauge indicator. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the color attribute.
 * @ignore
 * @name style
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * The border color of the gauge. Only applies when thresholds are not defined.
 * @expose
 * @name borderColor
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the value label.
 * @expose
 * @name metricLabel
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the position of the metric label for horizontal and vertical gauges. The default position of the metric label is outside of the plot area. If the label is not rendered, then 'withLabel' will render the metric label outside the plot area. When the label is rendered, all positions are treated as 'withLabel' except 'auto' and 'outsidePlotArea' which render the metric label outside the plot area. When the metric label is rendered 'withLabel', the metric label is displayed with the same style as the label. The position in the 'withLabel' case is specified by the label position attribute.
 * @expose
 * @name metricLabel.position
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "insideIndicatorEdge"
 * @ojvalue {string} "outsideIndicatorEdge"
 * @ojvalue {string} "outsidePlotArea"
 * @ojvalue {string} "withLabel"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name metricLabel.style
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether the label is a number or a percentage of the total value.
 * @expose
 * @name metricLabel.textType
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "percent"
 * @ojvalue {string} "number"
 * @default <code class="prettyprint">"number"</code>
 */
/**
 * Defines if the label is rendered. If set to auto, the label is rendered if the orientation is circular.
 * @expose
 * @name metricLabel.rendered
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.scaling
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "thousand"
 * @ojvalue {string} "million"
 * @ojvalue {string} "billion"
 * @ojvalue {string} "trillion"
 * @ojvalue {string} "quadrillion"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.converter
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the label. If specified, text will overwrite the numeric value that is displayed by default. The converter, scaling, and textType attributes are ignored when text is specified.
 * @expose
 * @name metricLabel.text
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the label.
 * @expose
 * @name label
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the position of the label for horizontal and vertical gauges. The default position for horizontal gauges is 'start' and for vertical gauges is 'center'.
 * @expose
 * @name label.position
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "start"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name label.style
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the label.
 * @expose
 * @name label.text
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the title.
 * @ignore
 * @name title
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the label attribute instead.
 */
/**
 * Defines the position of the title for horizontal and vertical gauges. The default position for horizontal gauges is 'start' and for vertical gauges is 'center'.
 * @ignore
 * @name title.position
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "start"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The CSS style string defining the style of the title.
 * @ignore
 * @name title.style
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The text for the title.
 * @ignore
 * @name title.text
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether visual effects such as overlays are applied to the gauge.
 * @expose
 * @name visualEffects
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The duration of the animations, in milliseconds.
 * @expose
 * @name animationDuration
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Defines the animation that is shown on initial display.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Defines whether the value of the gauge can be changed by the end user.
 * @expose
 * @name readOnly
 * @alias readonly
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {boolean}
 * @default <code class="prettyprint">false</code>
 */
/**
 * Plot Area for Status Meter Guage
 * @expose
 * @name plotArea
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the border radius of the plot area shape. When set to "auto", the border radius is the same as the top level border radius. Acceptable input follows CSS border-radius attribute specifications.
 * @expose
 * @name plotArea.borderRadius
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The color of the plot area. Only applies when useThresholdFillColor is off.
 * @expose
 * @name plotArea.color
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the plot area.
 * @expose
 * @name plotArea.borderColor
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines if the plot area is to be rendered. If set to auto, the plot area is rendered if the orientation is circular or if the thresholdDisplay is not onIndicator.
 * @expose
 * @name plotArea.rendered
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The CSS style class to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
 * @expose
 * @name plotArea.svgClassName
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
 * @expose
 * @name plotArea.svgStyle
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
 * @ignore
 * @name plotArea.className
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the plot area. The style class and inline style will override any other styling specified through the properties.
 * @ignore
 * @name plotArea.style
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * An object defining the center content of a status meter with circular orientation. 
 * @expose
 * @name center
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A function that returns custom center content. The function takes a dataContext argument,
 * provided by the gauge, with the following properties:
 * <ul>
 *   <li>outerBounds: Object containing (x, y, width, height) of the rectangle circumscribing the center area. 
 *   The outer bounds are useful for creating background for the entire center area when used with a CSS border-radius. 
 *   If the angleExtent isn't 360 then we will provide the clipped square. 
 *   The x and y coordinates are relative to the top, left corner of the element.</li>
 *   <li>innerBounds: Object containing (x, y, width, height) of the rectangle inscribed in the center area. 
 *   The inner bounds are useful for inserting content that is guaranteed to fit within the center area. 
 *   If the angleExtent isn't 360 then we will provide the clipped square. 
 *   The x and y coordinates are relative to the top, left corner of the element.</li>
 *   <li>metricLabel: The computed metric label.</li>
 *   <li>componentElement: The status meter gauge HTML element.</li>
 * </ul>
 * The function should return an Object with the following property: 
 * <ul>
 *   <li>insert: HTMLElement - HTML element, which will be overlaid on top of the gauge. 
 *   This HTML element will block interactivity of the gauge by default, but the CSS pointer-events property 
 *   can be set to 'none' on this element if the gauge's interactivity is desired. 
 *   </li>
 * </ul>
 * @expose
 * @name center.renderer
 * @memberof! oj.ojStatusMeterGauge
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies the start angle of a gauge with circular orientation. Value should be provided in degrees.
 * @expose
 * @name startAngle
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">90</code>
 */
/**
 * Specifies the angle extent of a gauge with circular orientation. Value should be provided in degrees.
 * @expose
 * @name angleExtent
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">360</code>
 */
/**
 * Specifies the inner radius of a gauge with circular orientation, defined by the distance from the center of the gauge to the innermost edge of the indicator and plot area. Valid values are a percent or ratio from 0 to 1.
 * @expose
 * @name innerRadius
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">.7</code>
 */
/**
 * Controls whether the current threshold is displayed on the indicator, in the plotArea, or if all the thresholds are diplayed in the plot area
 * @expose
 * @name thresholdDisplay
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "currentOnly"
 * @ojvalue {string} "all"
 * @ojvalue {string} "onIndicator"
 * @default <code class="prettyprint">"onIndicator"</code>
 */
/**
 * Defines the ratio of relative thickness of the indicator to the plot area.
 * @expose
 * @name indicatorSize
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">1</code>
 */
/**
 * Defines the type of status meter to be rendered.
 * @expose
 * @name orientation
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "circular"
 * @ojvalue {string} "vertical"
 * @ojvalue {string} "horizontal"
 * @default <code class="prettyprint">"horizontal"</code>
 */
/**
 * Specifies the increment by which values can be changed by the end user when readonly is false. The step must be a positive value that is smaller than the difference between the min and max.
 * @expose
 * @name step
 * @memberof oj.ojStatusMeterGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */

 // SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the status meter guage tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-statusmetergauge-tooltip
 * @memberof oj.ojSatusMeterGauge
 * @instance
 * 
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = myStatusMeterGauge.getNodeBySubId({'subId': 'oj-statusmetergauge-tooltip'});
 */
/**
 * @ojcomponent oj.ojDialGauge
 * @ignore
 * @augments oj.dvtBaseGauge
 * @since 0.7
 *
 * @classdesc
 * <h3 id="dialGaugeOverview-section">
 *   JET Dial Gauge Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dialGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Dial gauge component for JET.  Dial gauges are used to display a metric value in relation to the minimum and
 * maximum possible values for that metric.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojDialGauge',
 *   value: 63, min: 0, max: 100,
 *   metricLabel: {rendered: 'on'}
 * }"/>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Dial Gauge.
 * @example <caption>Initialize the Dial Gauge with no options specified:</caption>
 * $(".selector").ojDialGauge();
 *
 * @example <caption>Initialize the Dial Gauge with some options:</caption>
 * $(".selector").ojDialGauge({value: 63, min: 0, max: 100, metricLabel: {rendered: 'on'}});
 *
 * @example <caption>Initialize the Dial Gauge via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojDialGauge'}">
 */
oj.__registerWidget('oj.ojDialGauge', $['oj']['dvtBaseGauge'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Triggered during a value change gesture on mouse or touch move.
     *
     * @property {Object} ui event payload
     * @property {number} ui.value the value of the gauge
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">input</code> callback specified:</caption>
     * $(".selector").ojDialGauge({
     *   "input": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojinput</code> event:</caption>
     * $(".selector").on("ojinput", function(event, ui){});
     *
     * @expose
     * @event
     * @deprecated Use the <a href="#rawValue">rawValue</a> option instead.
     * @memberof oj.ojDialGauge
     * @instance
     */
    input : null,

    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only option for retrieving
     * the transient value from the dial gauge.</p>
     *
     * <p>This is a read-only option so page authors cannot set or change it directly.</p>
     * @expose
     * @instance
     * @type {?number|undefined}
     * @memberof oj.ojDialGauge
     * @since 1.2
     * @readonly
     */
     rawValue: undefined
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    this._focusable({'element': this.element, 'applyHighlight': true});
    return dvt.DialGauge.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId == 'tooltip') {
      locator['subId'] = 'oj-dialgauge-tooltip';
    }
    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-dialgauge');
    return styleClasses;
  },

  //** @inheritdoc */
  _Render : function() {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if(this.element.attr('title'))
    {
      this.options['shortDesc'] =  this.element.attr('title');
      this.element.data( this.element,'title', this.element.attr('title'));
      this.element.removeAttr('title');
    }
    else if (this.element.data('title'))
      this.options['shortDesc'] =  this.element.data('title');

    // Set images for dial gauge
    this._setImages();

    // Call the super to render
    this._super();
  },

  /**
   * Applies image URLs to the options object passed into the dial gauge.
   * @private
   */
  _setImages: function() {
    // Pass the correct background image information set the default circleAlta and needleAlta.
    var backgroundImages = this.options['background'];
    if(backgroundImages == null) {
      backgroundImages = "circleAlta";
      this.options['background'] = "circleAlta";
    }
    var indicatorImages = this.options['indicator'];
    if(indicatorImages == null) {
      indicatorImages = "needleAlta"
      this.options['indicator'] = "needleAlta";
    }
    if(typeof backgroundImages === 'string') {
      var backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-circle-200x200.png'), width: 200, height: 200},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-circle-400x400.png'), width: 400, height: 400}];
      if(backgroundImages === "rectangleAlta") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-rectangle-200x200.png'), width: 200, height: 154},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-rectangle-400x400.png'), width: 400, height: 309}];
        }

      else if(backgroundImages === "domeAlta") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-dome-200x200.png') , width: 200, height: 154},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-dome-400x400.png') , width: 400, height: 309}];
      }

      else if(backgroundImages === "circleAntique") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-circle-200x200.png'), width: 200, height: 200},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-circle-400x400.png'), width: 400, height: 400}];
      }

      else if(backgroundImages === "rectangleAntique") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-rectangle-200x200.png'), width: 200, height: 168},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-rectangle-400x400.png'), width: 400, height: 335}];
      }

      else if(backgroundImages === "domeAntique") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-dome-200x200.png'), width: 200, height: 176},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-dome-400x400.png'), width: 400, height: 352}];
      }

      else if(backgroundImages === "circleLight") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-circle-200x200.png'), width: 200, height: 200},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-circle-400x400.png'), width: 400, height: 400}];
      }

      else if(backgroundImages === "rectangleLight") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-rectangle-200x200.png'), width: 200, height: 154},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-rectangle-400x400.png'), width: 400, height: 307}];
      }

      else if(backgroundImages === "domeLight") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-dome-200x200.png'), width: 200, height: 138},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-dome-400x400.png'), width: 400, height: 276}];
      }

      else if(backgroundImages === "circleDark") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-circle-200x200.png'), width: 200, height: 200},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-circle-400x400.png'), width: 400, height: 400}];
      }

      else if(backgroundImages === "rectangleDark") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-rectangle-200x200.png'), width: 200, height: 154},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-rectangle-400x400.png'), width: 400, height: 307}];
      }
      else if(backgroundImages === "domeDark") {
        backgroundInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-dome-200x200.png'), width: 200, height: 138},
      {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-dome-400x400.png'), width: 400, height: 276}];
      }
      this.options['_backgroundImages'] = backgroundInfo;
    }
    if(typeof indicatorImages === 'string') {
      var indicatorInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/alta-needle-1600x1600.png'),  width: 374, height: 575}];
      if(indicatorImages === "needleAntique") {
        indicatorInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/antique-needle-1600x1600.png'), width: 81, height: 734}];
        }

      else if(indicatorImages === "needleDark") {
        indicatorInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/dark-needle-1600x1600.png'),  width: 454, height: 652}];
      }

      else if(indicatorImages === "needleLight") {
        indicatorInfo = [{src: oj.Config.getResourceUrl('resources/internal-deps/dvt/gauge/light-needle-1600x1600.png'),  width: 454, height: 652}];
      }
      this.options['_indicatorImages'] = indicatorInfo;
    }
  },

  /**
   * Returns the gauge's metric label.
   * @return {Object} The metric label object
   * @expose
   * @instance
   * @memberof oj.ojDialGauge
   */
  getMetricLabel: function() {
    var auto = this._component.getAutomation();
    return auto.getMetricLabel();
  }
});


/**
 * @ojcomponent oj.ojStatusMeterGauge
 * @augments oj.dvtBaseGauge
 * @since 0.7
 *
 * @classdesc
 * <h3 id="statusMeterGaugeOverview-section">
 *   JET Status Meter Gauge
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#statusMeterGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Status meter gauges support horizontal and circular status meters.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-status-meter-gauge
 *   value='63' 
 *   min='0' 
 *   max='100'
 *   thresholds='[{"max": 33}, {"max": 67}, {}]'>
 * &lt;/oj-status-meter-gauge>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojStatusMeterGauge', $['oj']['dvtBaseGauge'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Triggered during a value change gesture on mouse or touch move.
     *
     * @property {number} value the value of the gauge
     *
     * @ignore
     * @event
     * @deprecated Use the <a href="#rawValue">rawValue</a> property instead.
     * @memberof oj.ojStatusMeterGauge
     * @instance
     */
    input : null,
    
    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the transient value from the status meter gauge.</p>
     *
     * <p>This is a read-only property so page authors cannot set or change it directly.</p>
     * @ignore
     * @instance
     * @type {?number|undefined}
     * @memberof oj.ojStatusMeterGauge
     * @since 1.2
     * @readonly
     * @ojwriteback
     */
     rawValue: undefined
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    this._focusable({'element': this.element, 'applyHighlight': true});
    return dvt.StatusMeterGauge.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId == 'tooltip') {
      locator['subId'] = 'oj-statusmetergauge-tooltip';
    }
    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-statusmetergauge');
    return styleClasses;
  },
  
   //** @inheritdoc */
  _GetComponentRendererOptions: function() {
    return ['tooltip/renderer', 'center/renderer'];
  },

  //** @inheritdoc */
  _ProcessOptions: function() {
    this._super();
    var center = this.options['center'];
    if (center && center['_renderer'])
      center['renderer'] = this._GetTemplateRenderer(center['_renderer'], 'center');
  },

  //** @inheritdoc */
  _Render: function() {
    // Display the title of the surrounding div as the tooltip. Remove title from div to avoid browser default tooltip.
    if(this.element.attr('title'))
    {
      this.options['shortDesc'] =  this.element.attr('title');
      this.element.data( this.element,'title', this.element.attr('title'));
      this.element.removeAttr('title');
    }
    else if (this.element.data('title'))
      this.options['shortDesc'] =  this.element.data('title');

    // Call the super to render
    this._super();
  },

  /**
   * Returns the gauge's metric label.
   * @return {Object} The metric label object
   * @expose
   * @instance
   * @memberof oj.ojStatusMeterGauge
   */
  getMetricLabel: function() {
    var auto = this._component.getAutomation();
    return auto.getMetricLabel();
  }
});

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Value change when <code class="prettyprint">readonly</code> is <code class="prettyprint">false</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojRatingGauge
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element and submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease the gauge's transient value. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease the gauge's transient value in left-to-right locales. Increase the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase the gauge's transient value in left-to-right locales. Decrease the gauge's transient value in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojRatingGauge
 */

/**
 * The value set on the gauge.
 * @expose
 * @name value
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * Integer value specifying the maximum value of the gauge, which determines the number of shapes or images that are displayed.
 * @expose
 * @name max
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">5</code>
 */
/**
 * The minimum value that can be set on the gauge by the end user. Does not affect the value set on the gauge by API.
 * @expose
 * @name min
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * Whether there has been a value entered by the user.
 * @expose
 * @name changed
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {boolean}
 * @default <code class="prettyprint">false</code>
 * @ojwriteback
 */
/**
 *  An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A function that returns a custom tooltip. The function takes a dataContext argument,
 * provided by the gauge, with the following properties:
 * <ul>
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
 *   <li>label: The computed metric label.</li>
 *   <li>color: The indicator color of the gauge.</li>
 *   <li>componentElement: The rating gauge HTML element.</li>
 * </ul>
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties defining the thresholds for the gauge.
 * @expose
 * @name thresholds
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The upper bound of the threshold. This value is ignored for the final threshold, which uses the maximum value of the gauge.
 * @expose
 * @name thresholds[].max
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the threshold.
 * @expose
 * @name thresholds[].color
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the threshold.
 * @expose
 * @name thresholds[].borderColor
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specific description for the threshold and overwrites the shortDesc specified on gauge. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name thresholds[].shortDesc
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The unselected shape for the gauge.
 * @expose
 * @name unselectedState
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape to be used. Can take the name of a built-in shape or the svg path commands for a custom shape. Does not apply if a custom image is specified.
 * @expose
 * @name unselectedState.shape
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "square"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangle"
 * @ojvalue {string} "human"
 * @ojvalue {string} "dot"
 * @ojvalue {string} "none"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">"star"</code>
 */
/**
 * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels. 
 * @expose
 * @name unselectedState.source
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color for unselected state. Does not apply if a custom image is specified.
 * @expose
 * @name unselectedState.color
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color for unselected state. Does not apply if a custom image is specified.
 * @expose
 * @name unselectedState.borderColor
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the unselected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name unselectedState.svgClassName
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the unselected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name unselectedState.svgStyle
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the unselected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name unselectedState.className
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the unselected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name unselectedState.style
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * The selected shape for the gauge.
 * @expose
 * @name selectedState
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape to be used. Can take the name of a built-in shape or the svg path commands for a custom shape. Does not apply if a custom image is specified.
 * @expose
 * @name selectedState.shape
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "square"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangle"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">"star"</code>
 */
/**
 * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels. 
 * @expose
 * @name selectedState.source
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color for selected state. Does not apply if a custom image is specified.
 * @expose
 * @name selectedState.color
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color for selected state. Does not apply if a custom image is specified.
 * @expose
 * @name selectedState.borderColor
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name selectedState.svgClassName
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name selectedState.svgStyle
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name selectedState.className
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the selected state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name selectedState.style
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * The shape that displays on hover.
 * @expose
 * @name hoverState
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape to be used. Can take the name of a built-in shape or the svg path commands for a custom shape. Does not apply if a custom image is specified.
 * @expose
 * @name hoverState.shape
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "square"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangle"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">"star"</code>
 */
/**
 * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels. 
 * @expose
 * @name hoverState.source
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color for hover state. Does not apply if a custom image is specified.
 * @expose
 * @name hoverState.color
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color for hover state. Does not apply if a custom image is specified.
 * @expose
 * @name hoverState.borderColor
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the hover state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name hoverState.svgClassName
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the hover state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name hoverState.svgStyle
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the hover state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name hoverState.className
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the hover state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name hoverState.style
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * The changed shape for the gauge. Displayed after the user has set a value, or when the changed attribute of the data object is set to true.
 * @expose
 * @name changedState
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape to be used. Can take the name of a built-in shape or the svg path commands for a custom shape. Does not apply if a custom image is specified.
 * @expose
 * @name changedState.shape
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "square"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangle"
 * @ojvalue {string} "human"
 * @ojvalue {string} "star"
 * @default <code class="prettyprint">"star"</code>
 */
/**
 * The URI of the custom image. If specified, it takes precedence over shape. For SVG images, the width and height must be defined on the SVG element as pixels. 
 * @expose
 * @name changedState.source
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color for changed state. Does not apply if a custom image is specified.
 * @expose
 * @name changedState.color
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color for changed state. Does not apply if a custom image is specified.
 * @expose
 * @name changedState.borderColor
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name changedState.svgClassName
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @expose
 * @name changedState.svgStyle
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name changedState.className
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the changed state. The style class and inline style will override any other styling specified through the properties. Does not apply if custom image is specified.
 * @ignore
 * @name changedState.style
 * @memberof! oj.ojRatingGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * Defines whether visual effects such as overlays are applied to the gauge.
 * @expose
 * @name visualEffects
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies the increment by which values can be specified by the end user.
 * @expose
 * @name step
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {number}
 * @ojvalue {number} 0.5
 * @ojvalue {number} 1
 * @default <code class="prettyprint">1</code>
 */
/**
 * Defines the type of rating gauge to be rendered.
 * @expose
 * @name orientation
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "vertical"
 * @ojvalue {string} "horizontal"
 * @default <code class="prettyprint">"horizontal"</code>
 */
/**
 * Defines whether the value of the gauge can be changed by the end user.
 * @expose
 * @name readOnly
 * @alias readonly
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {boolean}
 * @default <code class="prettyprint">false</code>
 */
/**
 * Specifies whether the images provided should show up at their defined aspect ratio. With 'none', the space is allocated evenly, and shapes could be stretched. With 'meet', The aspect ratio of the shape or image is taken into account when space is allocated. When aspect ratios conflict, the aspect ratio of the selectedState will be used.
 * @expose
 * @name preserveAspectRatio
 * @memberof oj.ojRatingGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "meet"
 * @default <code class="prettyprint">"meet"</code>
 */
 
 // SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the rating guage tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-ratinggauge-tooltip
 * @memberof oj.ojRatingGauge
 * @instance
 * 
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = myRatingGauge.getNodeBySubId('subId': 'oj-ratinggauge-tooltip'});
 */
 
/**
 * <p>Sub-ID for a rating gauge item indexed by its position.</p>
 *
 * @property {number} index The index of the item within the gauge.
 *
 * @ojsubid oj-ratinggauge-item
 * @memberof oj.ojRatingGauge
 *
 * @example <caption>Get the first item from the rating gauge:</caption>
 * var nodes = myRatingGauge.getNodeBySubId('subId': 'oj-ratinggauge-item', index: 0});
 */
/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Value change when <code class="prettyprint">readOnly</code> is <code class="prettyprint">false</code>.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojDialGauge
 */

/**
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next component and submit the current value of the gauge.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase rawValue. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease rawValue. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease rawValue in left-to-right locales. Increase rawValue in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase rawValue in left-to-right locales. Decrease rawValue in right-to-left locales. Value is set after using <kbd>Enter</kbd> or <kbd>Tab</kbd> to submit.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDialGauge
 */

/**
 * The metric value.
 * @expose
 * @name value
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The minimum value of the gauge.
 * @expose
 * @name min
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * The maximum value of the gauge.
 * @expose
 * @name max
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">100</code>
 */
/**
 *  An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 *  A function that returns a custom tooltip. The function takes a dataContext argument, provided by the gauge, with the following properties: <ul> <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li> <li>label: The computed metric label.</li> <li>component: The widget constructor for the gauge. The 'component' is bound to the associated jQuery element so can be called directly as a function.</li> </ul> The function may return an HTML element, which will be appended to the tooltip, or a tooltip string. 
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object or string defining the background specification for the gauge. Acceptable string options are: circleAlta, domeAlta, rectangleAlta, circleLight, domeLight, rectangleLight, circleDark, domeDark, rectangleDark, circleAntique, domeAntique, rectangleAntique
 * @expose
 * @name background
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object|string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties, used to the define the image for the background. Multiple versions of the same image to be specified for different resolutions and for right to left locales, and the first image with enough detail for the requested resolution will be used.
 * @expose
 * @name background.images
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The URI specifying the location of the image resource.
 * @expose
 * @name background.images[].src
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name background.images[].width
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name background.images[].height
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies the text direction for which this image is used.
 * @expose
 * @name background.images[].dir
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "rtl"
 * @ojvalue {string} "ltr"
 * @default <code class="prettyprint">"ltr"</code>
 */
/**
 * The x coordinate of the indicator anchor point. Defaults to the center of the background.
 * @expose
 * @name background.anchorX
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The y coordinate of the indicator anchor point. Defaults to the center of the background.
 * @expose
 * @name background.anchorY
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start angle of the dial in degrees.
 * @expose
 * @name background.startAngle
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">180</code>
 */
/**
 * The angular extent of the dial in degrees.
 * @expose
 * @name background.angleExtent
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">180</code>
 */
/**
 * The distance from the anchor to the center of the tick labels.
 * @expose
 * @name background.radius
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height bound for the tick labels.
 * @expose
 * @name background.tickLabelHeight
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width bound for the tick labels.
 * @expose
 * @name background.tickLabelWidth
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The number of ticks that have labels. By default, no ticks are drawn.
 * @expose
 * @name background.majorTickCount
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0</code>
 */
/**
 * An object defining the bounds of the metric label. By default, the metric label is centered within the gauge.
 * @expose
 * @name background.metricLabelBounds
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The x coordinate of the bounding box.
 * @expose
 * @name background.metricLabelBounds.x
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The y coordinate of the bounding box.
 * @expose
 * @name background.metricLabelBounds.y
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of the bounding box.
 * @expose
 * @name background.metricLabelBounds.width
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of the bounding box.
 * @expose
 * @name background.metricLabelBounds.height
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The length of the indicator as a fraction of the background radius. Valid values are between 0 and 1.
 * @expose
 * @name background.indicatorLength
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">0.7</code>
 */
/**
 * An object or string defining the indicator specification for the gauge. Acceptable string options are: needleAlta, needleLight, needleDark, needleAntique
 * @expose
 * @name indicator
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object|string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties, used to the define the image for the indicator. Multiple versions of the same image to be specified for different resolutions, and the first image with enough detail for the requested resolution will be used.
 * @expose
 * @name indicator.images
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The URI specifying the location of the image resource. The image must be provided with the indicator at 90 degrees (pointing up).
 * @expose
 * @name indicator.images[].src
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name indicator.images[].width
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of this image resource. The size of the first image is considered the reference size, upon which the anchor and other coordinates are based.
 * @expose
 * @name indicator.images[].height
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The x coordinate of the indicator anchor point. Defaults to the center of the indicator.
 * @expose
 * @name indicator.anchorX
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The y coordinate of the indicator anchor point. Defaults to the bottom of the indicator.
 * @expose
 * @name indicator.anchorY
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the value label.
 * @expose
 * @name metricLabel
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name metricLabel.style
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines if the label is rendered.
 * @expose
 * @name metricLabel.rendered
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.scaling
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "thousand"
 * @ojvalue {string} "million"
 * @ojvalue {string} "billion"
 * @ojvalue {string} "trillion"
 * @ojvalue {string} "quadrillion"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name metricLabel.converter
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining the dial tick labels.
 * @expose
 * @name tickLabel
 * @memberof oj.ojDialGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style string defining the style of the label.
 * @expose
 * @name tickLabel.style
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Define the label to be displayed as number or as a percentage of the total value.
 * @expose
 * @name tickLabel.textType
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "percent"
 * @ojvalue {string} "number"
 * @default <code class="prettyprint">"number"</code>
 */
/**
 * Defines if the label is rendered.
 * @expose
 * @name tickLabel.rendered
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * The scaling behavior of the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name tickLabel.scaling
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "none"
 * @ojvalue {string} "thousand"
 * @ojvalue {string} "million"
 * @ojvalue {string} "billion"
 * @ojvalue {string} "trillion"
 * @ojvalue {string} "quadrillion"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The converter used to format the labels. When using a converter, scaling should be set to none, as the formatted result may not be compatible with the scaling suffixes.
 * @expose
 * @name tickLabel.converter
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The duration of the animations, in milliseconds. Also accepts CSS strings such as 1s and 1000ms.
 * @expose
 * @name animationDuration
 * @memberof oj.ojDialGauge
 * @instance
 * @type {number|string}
 * @default <code class="prettyprint">null</code>
 * @deprecated The string type is deprecated in 2.1.0.
 */
/**
 * Defines the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Defines the animation that is shown on initial display.
 * @expose
 * @name animationOnDisplay
 * @memberof oj.ojDialGauge
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Defines whether the value of the gauge can be changed by the end user.
 * @expose
 * @name readOnly
 * @memberof oj.ojDialGauge
 * @instance
 * @type {boolean}
 * @default <code class="prettyprint">true</code>
 */
 
// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the dial guage tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-dialgauge-tooltip
 * @memberof oj.ojDialGauge
 * @instance
 * 
 * @example <caption>Get the tooltip object of the gauge, if displayed:</caption>
 * var nodes = $( ".selector" ).ojDialGauge( "getNodeBySubId", {'subId': 'oj-dialgauge-tooltip'} );
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *    <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li> 
 *    <li>label: The computed metric label.</li> 
 *    <li>component: The widget constructor for the gauge. The 'component' is bound to the associated jQuery element so can be called directly as a function.</li> 
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojDialGauge
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var dvtBaseGaugeMeta = {
  "properties": {
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        }
      }
    }
  },
  "methods": {},
  "extension": {
    _WIDGET_NAME: "dvtBaseGauge"
  }
};
oj.CustomElementBridge.registerMetadata('dvtBaseGauge', 'dvtBaseComponent', dvtBaseGaugeMeta);
})();

(function() {
var ojLedGaugeMeta = {
  "properties": {
    "borderColor": {
      "type": "string"
    },
    "svgClassName": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "max": {
      "type": "number"
    },
    "metricLabel": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off"]
        },
        "scaling": {
          "type": "string",
          "enumValues": ["auto", "none", "thousand", "million", "billion", "trillion", "quadrillion"]
        },
        "style": {
          "type": "string"
        },
        "text": {
          "type": "string",
          "enumValues": ["percent", "number"]
        },
        "textType": {
          "type": "string"
        }
      }
    },
    "min": {
      "type": "number"
    },
    "rotation": {
      "type": "number",
      "enumValues": ["0", "90", "180", "270"]
    },
    "size": {
      "type": "number"
    },
    "svgStyle": {
      "type": "object"
    },
    "thresholds": {
      "type": "Array<object>"
    },
    "label": {
      "type": "object",
      "properties": {
        "style": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "type": {
      "type": "string"
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "visualEffects": {
      "type": "string",
      "enumValues": ["none", "auto"]
    }
  },
  "methods": {
    "getMetricLabel": {}
  },
  "extension": {
    _WIDGET_NAME: "ojLedGauge"
  }
};
oj.CustomElementBridge.registerMetadata('oj-led-gauge', 'dvtBaseGauge', ojLedGaugeMeta);
// Supported marker shapes for gauges
var _LED_GAUGE_SHAPE_ENUMS = {
  "arrow": true,
  "square": true,
  "rectangle": true,
  "circle": true,
  "ellipse": true,
  "diamond": true,
  "triangle": true,
  "human": true,
  "star": true
};
// Get the combined meta of superclass which contains a shape parse function generator
var dvtMeta = oj.CustomElementBridge.getMetadata('oj-led-gauge');
oj.CustomElementBridge.register('oj-led-gauge', {
  'metadata': dvtMeta,
  'parseFunction': dvtMeta['extension']._DVT_PARSE_FUNC({'type': true}, _LED_GAUGE_SHAPE_ENUMS)
});
})();

(function() {
var ojRatingGaugeMeta = {
  "properties": {
    "changed": {
      "type": "boolean",
      "writeback": true
    },
    "changedState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string"
        },
        "source": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "hoverState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string"
        },
        "source": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "max": {
      "type": "number"
    },
    "min": {
      "type": "number"
    },
    "orientation": {
      "type": "string",
      "orientation": ["vertical", "horizontal"]
    },
    "preserveAspectRatio": {
      "type": "string"
    },
    "readonly": {
      "type": "boolean"
    },
    "selectedState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string"
        },
        "source": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "step": {
      "type": "number",
      "enumValues": ["1", ".5"]
    },
    "thresholds": {
      "type": "Array<object>"
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "unselectedState": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "svgClassName": {
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "shape": {
          "type": "string"
        },
        "source": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "visualEffects": {
      "type": "string",
      "enumValues": ["none", "auto"]
    }
  },
  "methods": {},
  "extension": {
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _WIDGET_NAME: "ojRatingGauge"
  }
};
oj.CustomElementBridge.registerMetadata('oj-rating-gauge', 'dvtBaseGauge', ojRatingGaugeMeta);

// Consider a string with at least one digit a valid SVG path
var _SHAPE_REGEXP = /\d/;
var _RATING_GAUGE_SHAPE_ENUMS = {
  "circle": true,
  "square": true,
  "diamond": true,
  "triangle": true,
  "human": true,
  "star": true
};
var _UNSELECTED_RATING_GAUGE_SHAPE_ENUMS = {
  "circle": true,
  "square": true,
  "diamond": true,
  "triangle": true,
  "human": true,
  "star": true,
  "dot": true,
  "none": true
};
var _RATING_GAUGE_SHAPE_PROPS = {
  'changed-state.shape': true, 
  'hover-state.shape': true,
  'selected-state.shape': true,
  'unselected-state.shape': true
};
function shapePropertyParser(value, name, meta, defaultParseFunction) {
  if (_RATING_GAUGE_SHAPE_PROPS[name] || name === 'unselected-state.shape') {
    if (_SHAPE_REGEXP.test(value))
      return value;
    else if (_RATING_GAUGE_SHAPE_PROPS[name] && !_RATING_GAUGE_SHAPE_ENUMS[name])
      throw "Found: " + value + ". Expected: " + _RATING_GAUGE_SHAPE_ENUMS.toString();
    else if (name === 'unselected-state.shape' && !_UNSELECTED_RATING_GAUGE_SHAPE_ENUMS[name])
      throw "Found: " + value + ". Expected: " + _UNSELECTED_RATING_GAUGE_SHAPE_ENUMS.toString();
    else
      return value;
  }
  return defaultParseFunction(value);
};
oj.CustomElementBridge.register('oj-rating-gauge', {
  'metadata': oj.CustomElementBridge.getMetadata('oj-rating-gauge'),
  'parseFunction': shapePropertyParser
});
})();

(function() {
var ojStatusMeterGaugeMeta = {
  "properties": {
    "angleExtent": {
      "type": "number"
    },
    "animationDuration": {
      "type": "number"
    },
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "borderColor": {
      "type": "string"
    },
    "borderRadius": {
      "type": "string",
      "enumValues": ["auto"]
    },
    "center": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "svgClassName": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "indicatorSize": {
      "type": "number"
    },
    "innerRadius": {
      "type": "number"
    },
    "max": {
      "type": "number"
    },
    "metricLabel": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object"
        },
        "position": {
          "type": "string",
          "enumValues": ["auto", "center", "insideIndicatorEdge", "outsideIndicatorEdge", "outsidePlotArea", "withTitle"]
        },
        "rendered": {
          "type": "string",
          "enumValues": ["auto", "on", "off"]
        },
        "scaling": {
          "type": "string",
          "enumValues": ["auto", "none", "thousand", "million", "billion", "trillion", "quadrillion"]
        },
        "style": {
          "type": "string"
        },
        "text": {
          "type": "string"
        },
        "textType": {
          "type": "string",
          "enumValues": ["percent", "number"]
        }
      }
    },
    "min": {
      "type": "number"
    },
    "orientation": {
      "type": "string",
      "enumValues": ["circular", "horizontal", "vertical"]
    },
    "plotArea": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "borderRadius": {
          "type": "string",
          "enumValues": ["auto"]
        },
        "svgClassName": {
          "type": "string"
        },
        "color": {
          "type": "string"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["auto", "on", "off"]
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "readonly": {
      "type": "boolean"
    },
    "referenceLines": {
      "type": "Array<object>"
    },
    "startAngle": {
      "type": "number"
    },
    "step": {
      "type": "number"
    },
    "svgStyle": {
      "type": "object"
    },
    "thresholdDisplay": {
      "type": "string",
      "enumValues": ["currentOnly", "all", "onIndicator"]
    },
    "thresholds": {
      "type": "Array<object>"
    },
    "label": {
      "type": "object",
      "properties": {
        "position": {
          "type": "string",
          "enumValues": ["auto", "center", "start"]
        },
        "style": {
          "type": "string"
        },
        "text": {
          "type": "string"
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "value": {
      "type": "number",
      "writeback": true
    },
    "visualEffects": {
      "type": "string",
      "enumValues": ["none", "auto"]
    }
  },
  "methods": {
    "getMetricLabel": {}
  },
  "extension": {
    _ALIASED_PROPS: {"readonly": "readOnly"},
    _WIDGET_NAME: "ojStatusMeterGauge"
  }
};
oj.CustomElementBridge.registerMetadata('oj-status-meter-gauge', 'dvtBaseGauge', ojStatusMeterGaugeMeta);
oj.CustomElementBridge.register('oj-status-meter-gauge', {'metadata': oj.CustomElementBridge.getMetadata('oj-status-meter-gauge')});
})();

});
