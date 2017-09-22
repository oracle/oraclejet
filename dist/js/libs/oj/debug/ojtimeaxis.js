/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTimeAxis', 'ojs/ojvalidation-datetime'], function (oj, $, comp, base, dvt)
{
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the labels of the time axis. If not specified, the default converter is used. If a single converter is specified, it will be used for all 'scale' values. Otherwise, an object whose keys are 'scale' values that map to the converter instances is expected. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter
 * @memberof oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to use for all 'scale' values that do not otherwise have a converter object provided. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.default
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'seconds' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.seconds
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'minutes' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.minutes
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'hours' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.hours
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'days' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.days
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'weeks' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.weeks
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'months' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.months
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'quarters' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.quarters
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'years' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name converter.years
 * @memberof! oj.ojTimeAxis
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of the time axis. This is required in order for the time axis to properly render. See <a href="oj.ojTimeAxis.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name start
 * @memberof oj.ojTimeAxis
 * @instance
 * @type {number|string}
 * @default <code class="prettyprint">null</code>
 * @deprecated The number type is deprecated in 3.0.0.
 */
/**
 * The end time of the time axis. This is required in order for the time axis to properly render. See <a href="oj.ojTimeAxis.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name end
 * @memberof oj.ojTimeAxis
 * @instance
 * @type {number|string}
 * @default <code class="prettyprint">null</code>
 * @deprecated The number type is deprecated in 3.0.0.
 */
/**
 * The time scale used for the time axis. This is required in order for the time axis to properly render.
 * @expose
 * @name scale
 * @memberof oj.ojTimeAxis
 * @instance
 * @type {string}
 * @ojvalue {string} "seconds"
 * @ojvalue {string} "minutes"
 * @ojvalue {string} "hours"
 * @ojvalue {string} "days"
 * @ojvalue {string} "weeks"
 * @ojvalue {string} "months"
 * @ojvalue {string} "quarters"
 * @ojvalue {string} "years"
 * @default <code class="prettyprint">null</code>
 */

/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojTimeAxis
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="TimeAxisOverview-section">
 *   JET Time Axis
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#TimeAxisOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Time Axis is a themable, WAI-ARIA compliant element that displays a range of dates based on specified start and end date and time scale.  The Time Axis is intended to be placed in the header of JET DataGrid or Table.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-time-axis
 *   scale="months"
 *   start='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Jan 1, 2016"))}}'
 *   end='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Dec 31, 2016"))}}'
 *   style="height:38px"
 *   aria-hidden="true">
 * &lt;/oj-time-axis>
 * </code>
 * </pre>
 *
 * <h3 id="formats-section">
 *   Date and Time Formats
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formats-section"></a>
 * </h3>
 *
 * <p>The Time Axis supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
 * <table  class="keyboard-table">
 * <thead>
 * <tr>
 * <th>Symbol</th>
 * <th>Description</th>
 * <th>Values</th>
 * <th>Examples</th>
 * </tr>
 * </thead>
 * <tbody>
 * <tr>
 * <td><font color="#4B8A08">-, :, .,T</font></td><td>Characters actually in the string. T specifies the start of a time.</td><td></td><td></td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">YYYY</font></td><td>Year</td><td></td><td rowspan="3">2013-03-22<br>2014-02</td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">MM</font></td><td>Month</td><td>01 to 12</td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">DD</font></td><td>Day of the month</td><td>01 to 31</td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">HH</font></td><td>Hours</td><td>00 to 24</td><td rowspan="3">2013-02-04T15:20Z<br>2013-02-10T15:20:45.300Z</td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">mm</font></td><td>Minutes</td><td>00 to 59</td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">ss</font></td><td>Seconds. The seconds and milliseconds are optional if a time is specified.</td><td>00 to 59</td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">sss</font></td><td>Milliseconds</td><td>00 to 999</td><td></td>
 * </tr>
 * <tr>
 * <td><font color="#4B8A08">Z</font></td><td>The value in this position can be one of the following. If the value is omitted, character 'Z' should be used to specify UTC time.<br><ul><li><b>Z</b> indicates UTC time.</li><li><b>+hh:mm</b> indicates that the input time is the specified offset after UTC time.</li><li><b>-hh:mm</b> indicates that the input time is the absolute value of the specified offset before UTC time.</li></ul></td><td></td><td>2013-02-04T15:20:00-07:00<br>2013-02-04T15:20:00+05:00<br>2013-02-04T15:20:00Z</td>
 * </tr>
 * </tbody>
 * </table>
 * <p>The ISO format support short notations where the string must only include the date and not time, as in the following formats: YYYY, YYYY-MM, YYYY-MM-DD.</p>
 * <p>The ISO format does not support time zone names. You can use the Z position to specify an offset from UTC time. If you do not include a value in the Z position, UTC time is used. The correct format for UTC should always include character 'Z' if the offset time value is omitted. The date-parsing algorithms are browser-implementation-dependent and, for example, the date string '2013-02-27T17:00:00' will be parsed differently in Chrome vs Firefox vs IE.</p>
 * <p>You can specify midnight by using 00:00, or by using 24:00 on the previous day. The following two strings specify the same time: 2010-05-25T00:00Z and 2010-05-24T24:00Z.</p>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>The application is responsible for supplying a meaningful <code class="prettyprint"><span class="pln">aria</span><span class="pun">-</span><span class="pln">label</span></code> to the element.</p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <p>The Time Axis is intended to be used inside of a JET Table or DataGrid. All touch interactions are the same as those of the root elements. See the <a href="oj.ojTable.html#touch-section">Table</a> and <a href="oj.ojDataGrid.html#touch-section">DataGrid</a> touch doc for more details.</p>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <p>The Time Axis is intended to be used inside of a JET Table or DataGrid. All keyboard interactions are the same as those of the root elements. See the <a href="oj.ojTable.html#keyboard-section">Table</a> and <a href="oj.ojDataGrid.html#keyboard-section">DataGrid</a> keyboard doc for more details.</p>
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Time Axis Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the Time Axis. For example, a Time Axis spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering or rerendering this many intervals
 *    can cause severe performance degradation. Depending on the amount of space allocated,
 *    this many intervals can also cause visual clutteredness.
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTimeAxis', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix: "oj",

  //** @inheritdoc */
  _CreateDvtComponent: function(context, callback, callbackObj)
  {
    return dvt.TimeAxis.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-timeaxis');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses: function()
  {
    var styleClasses = this._super();
    styleClasses['oj-timeaxis-label'] = {'path': 'labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['optionChange'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.TIMEAXIS'] = translations['componentName'];
    return ret;
  },
  
  //** @inheritdoc */
  _GetComponentRendererOptions: function() {
    //the function should be removed if the component will support 'tooltip.renderer' attr
    return [];
  },

  //** @inheritdoc */
  _ProcessOptions: function() {
    this._super();

    // Date related options support only number | string types
    // TODO: remove deprecated number type support in favor of ISO String in future release
    var self = this;
    var processRootDateOptions = function(key) {
      var optionType = typeof self.options[key];
      if (!(optionType === 'number' || optionType === 'string'))
        self.options[key] = null; // e.g. this will exclude Date object types
    };

    processRootDateOptions('start');
    processRootDateOptions('end');
  },

  //** @inheritdoc */
  _LoadResources: function()
  {
    // Ensure the resources object exists
    if (this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];

    // Create default converters
    var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    var secondsConverter = converterFactory.createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'});
    var minutesConverter = converterFactory.createConverter({'hour': 'numeric', 'minute': '2-digit'});
    var hoursConverter = converterFactory.createConverter({'hour': 'numeric'});
    var daysConverter = converterFactory.createConverter({'month': 'numeric', 'day': '2-digit'});
    var monthsConverter = converterFactory.createConverter({'month': 'long'});
    var yearsConverter = converterFactory.createConverter({'year': 'numeric'});

    var monthsConverterVert = converterFactory.createConverter({'month': 'short'});
    var yearsConverterVert = converterFactory.createConverter({'year': '2-digit'});

    var converter = {
      'seconds': secondsConverter,
      'minutes': minutesConverter,
      'hours': hoursConverter,
      'days': daysConverter,
      'weeks': daysConverter,
      'months': monthsConverter,
      'quarters': monthsConverter,
      'years': yearsConverter
    };
    var converterVert = {
      'seconds': secondsConverter,
      'minutes': minutesConverter,
      'hours': hoursConverter,
      'days': daysConverter,
      'weeks': daysConverter,
      'months': monthsConverterVert,
      'quarters': monthsConverterVert,
      'years': yearsConverterVert
    };

    resources['converterFactory'] = converterFactory;
    resources['converter'] = converter;
    resources['converterVert'] = converterVert;

    // Class names to be set on appropriate svg elements
    resources['axisClass'] = 'oj-timeaxis-container';
    resources['axisLabelClass'] = 'oj-timeaxis-label';
    resources['axisSeparatorClass'] = 'oj-timeaxis-separator';

    // default disable all borders
    resources['borderTopVisible'] = false;
    resources['borderRightVisible'] = false;
    resources['borderBottomVisible'] = false;
    resources['borderLeftVisible'] = false;

    // first day of week; locale specific
    resources['firstDayOfWeek'] = oj.LocaleData.getFirstDayOfWeek();
  }
});
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojTimeAxisMeta = {
  "properties": {
    "converter": {
      "type": "object",
      "properties": {
        "days": {},
        "default": {},
        "hours": {},
        "minutes": {},
        "months": {},
        "quarters": {},
        "seconds": {},
        "weeks": {},
        "years": {}
      }
    },
    "end": {
      "type": "string"
    },
    "scale": {
      "type": "string",
      "enumValues": ["seconds", "minutes", "hours", "days", "weeks", "months", "quarters", "years"]
    },
    "start": {
      "type": "string"
    },
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
    _WIDGET_NAME: "ojTimeAxis"
  }
};
oj.CustomElementBridge.registerMetadata('oj-time-axis', 'dvtBaseComponent', ojTimeAxisMeta);
oj.CustomElementBridge.register('oj-time-axis', {'metadata': oj.CustomElementBridge.getMetadata('oj-time-axis')});
})();
});
