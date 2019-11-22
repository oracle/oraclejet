/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTimeAxis', 
'ojs/ojlocaledata', 'ojs/ojconverter-datetime', 'ojs/ojconverterutils-i18n', 'ojs/ojconverter-number'], 
function (oj, $, comp, base, dvt, LocaleData, __DateTimeConverter, ConverterUtils, NumberConverter)
{
  "use strict";
var __oj_time_axis_metadata = 
{
  "properties": {
    "converter": {
      "type": "object",
      "properties": {
        "default": {
          "type": "object"
        },
        "seconds": {
          "type": "object"
        },
        "minutes": {
          "type": "object"
        },
        "hours": {
          "type": "object"
        },
        "days": {
          "type": "object"
        },
        "weeks": {
          "type": "object"
        },
        "months": {
          "type": "object"
        },
        "quarters": {
          "type": "object"
        },
        "years": {
          "type": "object"
        }
      }
    },
    "end": {
      "type": "string",
      "value": ""
    },
    "scale": {
      "type": "string",
      "enumValues": [
        "days",
        "hours",
        "minutes",
        "months",
        "quarters",
        "seconds",
        "weeks",
        "years"
      ]
    },
    "start": {
      "type": "string",
      "value": ""
    },
    "trackResize": {
      "type": "string",
      "enumValues": [
        "off",
        "on"
      ],
      "value": "on"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "componentName": {
          "type": "string"
        },
        "labelAndValue": {
          "type": "string"
        },
        "labelClearSelection": {
          "type": "string"
        },
        "labelCountWithTotal": {
          "type": "string"
        },
        "labelDataVisualization": {
          "type": "string"
        },
        "labelInvalidData": {
          "type": "string"
        },
        "labelNoData": {
          "type": "string"
        },
        "stateCollapsed": {
          "type": "string"
        },
        "stateDrillable": {
          "type": "string"
        },
        "stateExpanded": {
          "type": "string"
        },
        "stateHidden": {
          "type": "string"
        },
        "stateIsolated": {
          "type": "string"
        },
        "stateMaximized": {
          "type": "string"
        },
        "stateMinimized": {
          "type": "string"
        },
        "stateSelected": {
          "type": "string"
        },
        "stateUnselected": {
          "type": "string"
        },
        "stateVisible": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "extension": {}
};
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* global dvt:false, LocaleData:false, __DateTimeConverter:false, ConverterUtils:false, NumberConverter:false */

/**
 * @ojcomponent oj.ojTimeAxis
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 *
 * @ojshortdesc A time axis displays a range of dates based on specified start and end dates and a time scale.
 * @ojrole application
 * @ojtsimport {module: "ojconverter", type: "AMD", importName: "Converter"}
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["start", "end", "scale", "style"]}
 * @ojvbdefaultcolumns 12
 * @ojvbmincolumns 6
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
 *   start="2017-01-01T05:00:00.000Z"
 *   end="2017-12-31T05:00:00.000Z"
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
 * {@ojinclude "name":"formatsDoc"}
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
 * <h4>Time Axis Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the Time Axis. For example, a Time Axis spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering or rerendering this many intervals
 *    can cause severe performance degradation. Depending on the amount of space allocated,
 *    this many intervals can also cause visual clutteredness.
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTimeAxis', $.oj.dvtBaseComponent, {
  widgetEventPrefix: 'oj',
  options: {
    /**
     * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the labels of the time axis for all 'scale' values, or
     * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting.
     * See also {@link DateTimeConverter}.
     * @expose
     * @name converter
     * @ojshortdesc An object that converts the labels of the time axis for all 'scale' values'. See the Help documentation for more information.
     * @memberof oj.ojTimeAxis
     * @instance
     * @type {Object}
     * @ojsignature {target: "Type", value: "oj.ojTimeAxis.Converters|oj.Converter<string>", jsdocOverride: true}
     * @default {"default": null, "seconds": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric'}), "days": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'}), "months": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "quarters": new DateTimeConverter.IntlDateTimeConverter({'month': 'long'}), "years": new DateTimeConverter.IntlDateTimeConverter({'year': 'numeric'})}
     *
     * @example <caption>Initialize the TimeAxis with the <code class="prettyprint">converter</code> attribute specified:</caption>
     * &lt;oj-time-axis converter='[[myConverterObject]]'>&lt;/oj-time-axis>
     *
     * &lt;oj-time-axis converter.days='[[myConverterDays]]'>&lt;/oj-time-axis>
     *
     * @example <caption>Get or set the <code class="prettyprint">converter</code> property after initialization:</caption>
     * // Get one
     * var converterDays = myTimeAxis.converter.days;
     *
     * // Set one, leaving the others intact.
     * myTimeAxis.setProperty('converter.days', converterDays);
     *
     * // Get all
     * var converterObject = myTimeAxis.converter;
     *
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeAxis.converter = {
     *     "default": converterDefault,
     *     "seconds": converterSeconds,
     *     "minutes": converterMinutes,
     *     "hours": converterHours,
     *     "days": converterDays,
     *     "weeks": converterWeeks,
     *     "months": converterMonths,
     *     "quarters": converterQuarters,
     *     "years": converterYears
     * };
     */
    converter: {
      default: null,
      seconds: new __DateTimeConverter.IntlDateTimeConverter({
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      }),
      minutes: new __DateTimeConverter.IntlDateTimeConverter({
        hour: 'numeric',
        minute: '2-digit'
      }),
      hours: new __DateTimeConverter.IntlDateTimeConverter({
        hour: 'numeric'
      }),
      days: new __DateTimeConverter.IntlDateTimeConverter({
        month: 'numeric',
        day: '2-digit'
      }),
      weeks: new __DateTimeConverter.IntlDateTimeConverter({
        month: 'numeric',
        day: '2-digit'
      }),
      months: new __DateTimeConverter.IntlDateTimeConverter({
        month: 'long'
      }),
      quarters: new __DateTimeConverter.IntlDateTimeConverter({
        month: 'long'
      }),
      years: new __DateTimeConverter.IntlDateTimeConverter({
        year: 'numeric'
      })
    },

    /**
     * The start time of the time axis. A valid value is required in order for the time axis to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name start
     * @ojrequired
     * @ojshortdesc The start time of the time axis. See the Help documentation for more information.
     * @memberof oj.ojTimeAxis
     * @instance
     * @type {string}
     * @ojformat date-time
     * @default ""
     *
     * @example <caption>Initialize the TimeAxis with the <code class="prettyprint">start</code> attribute specified:</caption>
     * &lt;oj-time-axis start='2017-01-01T05:00:00.000Z'>&lt;/oj-time-axis>
     *
     * @example <caption>Get or set the <code class="prettyprint">start</code> property after initialization:</caption>
     * // getter
     * var startValue = myTimeAxis.start;
     *
     * // setter
     * myTimeAxis.start = '2017-01-01T05:00:00.000Z';
     */
    start: '',

    /**
     * The end time of the time axis. A valid value is required in order for the time axis to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name end
     * @ojrequired
     * @ojshortdesc The end time of the time axis. See the Help documentation for more information.
     * @memberof oj.ojTimeAxis
     * @instance
     * @type {string}
     * @ojformat date-time
     * @default ""
     *
     * @example <caption>Initialize the TimeAxis with the <code class="prettyprint">end</code> attribute specified:</caption>
     * &lt;oj-time-axis end='2017-12-31T05:00:00.000Z'>&lt;/oj-time-axis>
     *
     * @example <caption>Get or set the <code class="prettyprint">end</code> property after initialization:</caption>
     * // getter
     * var endValue = myTimeAxis.end;
     *
     * // setter
     * myTimeAxis.end = '2017-12-31T05:00:00.000Z';
     */
    end: '',

    /**
     * The time scale used for the time axis. This is required in order for the time axis to properly render.
     * @expose
     * @name scale
     * @ojrequired
     * @ojshortdesc The time scale used for the time axis.
     * @memberof oj.ojTimeAxis
     * @instance
     * @type {?string}
     * @ojvalue {string} "seconds"
     * @ojvalue {string} "minutes"
     * @ojvalue {string} "hours"
     * @ojvalue {string} "days"
     * @ojvalue {string} "weeks"
     * @ojvalue {string} "months"
     * @ojvalue {string} "quarters"
     * @ojvalue {string} "years"
     * @default null
     *
     * @example <caption>Initialize the TimeAxis with the <code class="prettyprint">scale</code> attribute specified:</caption>
     * &lt;oj-time-axis scale='weeks'>&lt;/oj-time-axis>
     *
     * @example <caption>Get or set the <code class="prettyprint">scale</code> property after initialization:</caption>
     * // getter
     * var scaleValue = myTimeAxis.scale;
     *
     * // setter
     * myTimeAxis.scale = 'weeks';
     */
    scale: null
  },

  /**
   * @override
   * @memberof oj.ojTimeAxis
   * @protected
   */
  _ComponentCreate: function _ComponentCreate() {
    this._super();

    this._SetLocaleHelpers(NumberConverter, ConverterUtils);
  },
  // @inheritdoc
  _CreateDvtComponent: function _CreateDvtComponent(context, callback, callbackObj) {
    return dvt.TimeAxis.newInstance(context, callback, callbackObj);
  },
  // @inheritdoc
  _GetComponentStyleClasses: function _GetComponentStyleClasses() {
    var styleClasses = this._super();

    styleClasses.push('oj-timeaxis');
    return styleClasses;
  },
  // @inheritdoc
  _GetChildStyleClasses: function _GetChildStyleClasses() {
    var styleClasses = this._super();

    styleClasses['oj-timeaxis-label'] = {
      path: 'labelStyle',
      property: 'TEXT'
    };
    return styleClasses;
  },
  // @inheritdoc
  _GetEventTypes: function _GetEventTypes() {
    return ['optionChange'];
  },
  // @inheritdoc
  _GetComponentRendererOptions: function _GetComponentRendererOptions() {
    // the function should be removed if the component will support 'tooltip.renderer' attr
    return [];
  },
  // @inheritdoc
  _ProcessOptions: function _ProcessOptions() {
    this._super(); // Date related options support only number | string types
    // TODO: remove deprecated number type support in favor of ISO String in future release


    var self = this;

    var processRootDateOptions = function processRootDateOptions(key) {
      var optionType = _typeof(self.options[key]);

      if (!(optionType === 'number' || optionType === 'string')) {
        self.options[key] = null;
      } // e.g. this will exclude Date object types

    };

    processRootDateOptions('start');
    processRootDateOptions('end');
  },
  // @inheritdoc
  _LoadResources: function _LoadResources() {
    // Ensure the resources object exists
    if (this.options._resources == null) {
      this.options._resources = {};
    }

    var resources = this.options._resources; // Create default converters

    var secondsConverter = new __DateTimeConverter.IntlDateTimeConverter({
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
    var minutesConverter = new __DateTimeConverter.IntlDateTimeConverter({
      hour: 'numeric',
      minute: '2-digit'
    });
    var hoursConverter = new __DateTimeConverter.IntlDateTimeConverter({
      hour: 'numeric'
    });
    var daysConverter = new __DateTimeConverter.IntlDateTimeConverter({
      month: 'numeric',
      day: '2-digit'
    });
    var monthsConverter = new __DateTimeConverter.IntlDateTimeConverter({
      month: 'long'
    });
    var yearsConverter = new __DateTimeConverter.IntlDateTimeConverter({
      year: 'numeric'
    });
    var monthsConverterVert = new __DateTimeConverter.IntlDateTimeConverter({
      month: 'short'
    });
    var yearsConverterVert = new __DateTimeConverter.IntlDateTimeConverter({
      year: '2-digit'
    });
    var converter = {
      seconds: secondsConverter,
      minutes: minutesConverter,
      hours: hoursConverter,
      days: daysConverter,
      weeks: daysConverter,
      months: monthsConverter,
      quarters: monthsConverter,
      years: yearsConverter
    };
    var converterVert = {
      seconds: secondsConverter,
      minutes: minutesConverter,
      hours: hoursConverter,
      days: daysConverter,
      weeks: daysConverter,
      months: monthsConverterVert,
      quarters: monthsConverterVert,
      years: yearsConverterVert
    };
    resources.defaultDateTimeConverter = new __DateTimeConverter.IntlDateTimeConverter({
      formatType: 'datetime',
      dateFormat: 'medium',
      timeFormat: 'medium'
    }); // e.g. Jan 1, 2016, 5:53:39 PM

    resources.defaultDateConverter = new __DateTimeConverter.IntlDateTimeConverter({
      formatType: 'date',
      dateFormat: 'medium'
    }); // e.g. Jan 1, 2016

    resources.converter = converter;
    resources.converterVert = converterVert; // Class names to be set on appropriate svg elements

    resources.axisClass = 'oj-timeaxis-container';
    resources.axisLabelClass = 'oj-timeaxis-label';
    resources.axisSeparatorClass = 'oj-timeaxis-separator'; // default disable all borders

    resources.borderTopVisible = false;
    resources.borderRightVisible = false;
    resources.borderBottomVisible = false;
    resources.borderLeftVisible = false; // first day of week; locale specific

    resources.firstDayOfWeek = LocaleData.getFirstDayOfWeek();
  }
});



/**
 * <p>The Time Axis is intended to be used inside of a JET Table or DataGrid. All touch interactions are the same as those of the root elements. See the <a href="oj.ojTable.html#touch-section">Table</a> and <a href="oj.ojDataGrid.html#touch-section">DataGrid</a> touch doc for more details.</p>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeAxis
 */

/**
 * <p>The Time Axis is intended to be used inside of a JET Table or DataGrid. All keyboard interactions are the same as those of the root elements. See the <a href="oj.ojTable.html#keyboard-section">Table</a> and <a href="oj.ojDataGrid.html#keyboard-section">DataGrid</a> keyboard doc for more details.</p>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeAxis
 */

/**
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
 * @ojfragment formatsDoc
 * @memberof oj.ojTimeAxis
 */
// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojTimeAxis.Converters
 * @property {Object} [default=null] The default converter (an object literal or instance that duck types {@link oj.Converter}) to use for all 'scale' values that do not otherwise have a converter object provided. See also {@link DateTimeConverter}.
 * @property {Object} [seconds=new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'seconds' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [minutes=new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric', 'minute': '2-digit'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'minutes' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [hours=new DateTimeConverter.IntlDateTimeConverter({'hour': 'numeric'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'hours' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [days=new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'days' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [weeks=new DateTimeConverter.IntlDateTimeConverter({'month': 'numeric', 'day': '2-digit'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'weeks' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [months=new DateTimeConverter.IntlDateTimeConverter({'month': 'long'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'months' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [quarters=new DateTimeConverter.IntlDateTimeConverter({'month': 'long'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'quarters' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @property {Object} [years=new DateTimeConverter.IntlDateTimeConverter({'year': 'numeric'})] A converter (an instance that duck types {@link oj.Converter}) used to format the 'years' scale. If not specified, the default converter will be used for this scale. See also {@link DateTimeConverter}.
 * @ojsignature [{target:"Type", value:"oj.Converter.<string>", for:"default", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"seconds", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"minutes", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"hours", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"days", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"weeks", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"months", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"quarters", jsdocOverride:true},
 *               {target:"Type", value:"oj.Converter.<string>", for:"years", jsdocOverride:true}]
 */



/* global __oj_time_axis_metadata:false */

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_time_axis_metadata.extension._WIDGET_NAME = 'ojTimeAxis';
  oj.CustomElementBridge.register('oj-time-axis', {
    metadata: __oj_time_axis_metadata
  });
})();

});