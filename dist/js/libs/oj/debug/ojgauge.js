/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
    flags['_context'] = {writeback: true, internalSet: true};
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
      rawValueFlags['_context'] = {writeback: true, internalSet: true};
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
 *   JET LED Gauge Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ledGaugeOverview-section"></a>
 * </h3>
 *
 * <p>LED gauge component for JET.  LED gauges are used to highlight a specific metric value in relation to its
 * thresholds.<p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojLedGauge',
 *   value: 63, min: 0, max: 100,
 *   thresholds: [{max: 33}, {max: 67}, {}]
 * }"/>
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
 *
 * @desc Creates a JET LED Gauge.
 * @example <caption>Initialize the LED Gauge with no options specified:</caption>
 * $(".selector").ojLedGauge();
 *
 * @example <caption>Initialize the LED Gauge with some options:</caption>
 * $(".selector").ojLedGauge({value: 63, min: 0, max: 100, thresholds: [{max: 33}, {max: 67}, {}]});
 *
 * @example <caption>Initialize the LED Gauge via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojLedGauge'}">
 */
oj.__registerWidget('oj.ojLedGauge', $['oj']['dvtBaseGauge'],
{
  widgetEventPrefix : "oj",
  options: {},

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
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
 *   JET Rating Gauge Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#ratingGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Rating gauge component for JET.  Rating gauges are typically used to display or accept user feedback on a product
 * or service.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {component: 'ojRatingGauge', value: 4}"/>
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
 *
 * @desc Creates a JET Rating Gauge.
 * @example <caption>Initialize the Rating Gauge with no options specified:</caption>
 * $(".selector").ojRatingGauge();
 *
 * @example <caption>Initialize the Rating Gauge with some options:</caption>
 * $(".selector").ojRatingGauge({value: 4});
 *
 * @example <caption>Initialize the Rating Gauge via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojRatingGauge'}">
 */
oj.__registerWidget('oj.ojRatingGauge', $['oj']['dvtBaseGauge'],
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
     * $(".selector").ojRatingGauge({
     *   "input": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojinput</code> event:</caption>
     * $(".selector").on("ojinput", function(event, ui){});
     *
     * @expose
     * @event
     * @deprecated Use the <a href="#rawValue">rawValue</a> option instead.
     * @memberof oj.ojRatingGauge
     * @instance
     */
    input : null,

    /**
     * Fired whenever a supported component option changes, whether due to user interaction or programmatic
     * intervention. If the new value is the same as the previous value, no event will be fired.
     *
     * @property {Object} data event payload
     * @property {string} data.option the name of the option that changed, i.e. "value"
     * @property {Object} data.previousValue an Object holding the previous value of the option
     * @property {Object} data.value an Object holding the current value of the option
     * @property {Object} ui.optionMetadata information about the option that is changing
     * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
     *                    <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
     * $(".selector").ojRatingGauge({
     *   'optionChange': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojoptionchange</code> event:</caption>
     * $(".selector").on({
     *   'ojoptionchange': function (event, data) {
     *       window.console.log("option changing is: " + data['option']);
     *   };
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojRatingGauge
     * @instance
     */
    optionChange: null,
    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only option for retrieving
     * the transient value from the rating gauge.</p>
     *
     * <p>This is a read-only option so page authors cannot set or change it directly.</p>
     * @expose
     * @instance
     * @type {?number|undefined}
     * @memberof oj.ojRatingGauge
     * @since 1.2
     * @readonly
     */
     rawValue: undefined
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
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
 * <p>This component has no touch interaction.  </p>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojLedGauge
 */

/**
 * <p>This component has no keyboard interaction.  </p>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojLedGauge
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for the the led guage tooltip.</p>
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
 * var nodes = $( ".selector" ).ojLedGauge( "getNodeBySubId", {'subId': 'oj-ledgauge-tooltip'} );
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
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase value.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease value.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease value in left-to-right locales. Increase value in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase value in left-to-right locales. Decrease value in right-to-left locales.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojStatusMeterGauge
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
 * var nodes = $( ".selector" ).ojojStatusMeterGauge( "getNodeBySubId", {'subId': 'oj-statusmetergauge-tooltip'} );
 */
/**
 * @ojcomponent oj.ojDialGauge
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
     * Fired whenever a supported component option changes, whether due to user interaction or programmatic
     * intervention. If the new value is the same as the previous value, no event will be fired.
     *
     * @property {Object} data event payload
     * @property {string} data.option the name of the option that changed, i.e. "value"
     * @property {Object} data.previousValue an Object holding the previous value of the option
     * @property {Object} data.value an Object holding the current value of the option
     * @property {Object} ui.optionMetadata information about the option that is changing
     * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
     *                    <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
     * $(".selector").ojDialGauge({
     *   'optionChange': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojoptionchange</code> event:</caption>
     * $(".selector").on({
     *   'ojoptionchange': function (event, data) {
     *       window.console.log("option changing is: " + data['option']);
     *   };
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojDialGauge
     * @instance
     */
    optionChange: null,
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
 * <p>This component should be bound to an HTML div element, and the SVG DOM that it generates should be treated as a
 * black box, as it is subject to change.  This component should not be extended.</p>
 *
 * @ojfragment warning
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the shortDesc value in the
 * component options object with meaningful descriptors when the component does
 * not provide a default descriptor.</p>
 *
 * @ojfragment a11y
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for populating the shortDesc value in the
 * component options object with meaningful descriptors when the component does
 * not provide a default descriptor.  Since component terminology for keyboard
 * and touch shortcuts can conflict with those of the application, it is the
 * application's responsibility to provide these shortcuts, possibly via a help
 * popup.</p>
 *
 * @ojfragment a11yKeyboard
 * @memberof oj.dvtBaseComponent
 */

/**
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>
 *   As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the
 *   component must be <code class="prettyprint">refresh()</code>ed.
 * </p>
 *
 * @ojfragment rtl
 * @memberof oj.dvtBaseComponent
 */

/**
 * @ojcomponent oj.ojStatusMeterGauge
 * @augments oj.dvtBaseGauge
 * @since 0.7
 *
 * @classdesc
 * <h3 id="statusMeterGaugeOverview-section">
 *   JET Status Meter Gauge Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#statusMeterGaugeOverview-section"></a>
 * </h3>
 *
 * <p>Status meter gauge component for JET, supporting horizontal and circular status meters.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojStatusMeterGauge',
 *   value: 63, min: 0, max: 100,
 *   thresholds: [{max: 33}, {max: 67}, {}]
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
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Status Meter Gauge.
 * @example <caption>Initialize the Status Meter Gauge with no options specified:</caption>
 * $(".selector").ojStatusMeterGauge();
 *
 * @example <caption>Initialize the Status Meter Gauge with some options:</caption>
 * $(".selector").ojStatusMeterGauge({value: 63, min: 0, max: 100, thresholds: [{max: 33}, {max: 67}, {}]});
 *
 * @example <caption>Initialize the Status Meter Gauge via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojStatusMeterGauge'}">
 */
oj.__registerWidget('oj.ojStatusMeterGauge', $['oj']['dvtBaseGauge'],
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
     * $(".selector").ojStatusMeterGauge({
     *   "input": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojinput</code> event:</caption>
     * $(".selector").on("ojinput", function(event, ui){});
     *
     * @expose
     * @event
     * @deprecated Use the <a href="#rawValue">rawValue</a> option instead.
     * @memberof oj.ojStatusMeterGauge
     * @instance
     */
    input : null,

    /**
     * Fired whenever a supported component option changes, whether due to user interaction or programmatic
     * intervention. If the new value is the same as the previous value, no event will be fired.
     *
     * @property {Object} data event payload
     * @property {string} data.option the name of the option that changed, i.e. "value"
     * @property {Object} data.previousValue an Object holding the previous value of the option
     * @property {Object} data.value an Object holding the current value of the option
     * @property {Object} ui.optionMetadata information about the option that is changing
     * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
     *                    <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
     * $(".selector").ojStatusMeterGauge({
     *   'optionChange': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojoptionchange</code> event:</caption>
     * $(".selector").on({
     *   'ojoptionchange': function (event, data) {
     *       window.console.log("option changing is: " + data['option']);
     *   };
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojStatusMeterGauge
     * @instance
     */
    optionChange: null,
    /**
     * <p>The <code class="prettyprint">rawValue</code> is the read-only option for retrieving
     * the transient value from the status meter gauge.</p>
     *
     * <p>This is a read-only option so page authors cannot set or change it directly.</p>
     * @expose
     * @instance
     * @type {?number|undefined}
     * @memberof oj.ojStatusMeterGauge
     * @since 1.2
     * @readonly
     */
     rawValue: undefined
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
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
 *       <td>Value change when <code class="prettyprint">readOnly</code> is <code class="prettyprint">false</code>.</td>
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
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase value.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease value.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease value in left-to-right locales. Increase value in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase value in left-to-right locales. Decrease value in right-to-left locales.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojRatingGauge
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
 * var nodes = $( ".selector" ).ojRatingGauge( "getNodeBySubId", {'subId': 'oj-ratinggauge-tooltip'} );
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
 * var nodes = $( ".selector" ).ojRatingGauge( "getNodeBySubId", {'subId': 'oj-ratinggauge-item', index: 0} );
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
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increase value.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrease value.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Decrease value in left-to-right locales. Increase value in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Increase value in left-to-right locales. Decrease value in right-to-left locales.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDialGauge
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
});
