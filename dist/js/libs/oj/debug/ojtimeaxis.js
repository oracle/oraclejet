/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTimeAxis', 'ojs/ojlocaledata', 
'ojs/ojvalidation-base', 'ojs/ojvalidation-datetime'], 
  function (oj, $, comp, base, dvt, LocaleData, __ValidationBase)
{
  

var __oj_time_axis_metadata = 
{
  "properties": {
    "converter": {
      "type": "object",
      "value": "{\"default\": null, \"seconds\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), \"minutes\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), \"hours\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), \"days\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), \"weeks\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), \"months\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), \"quarters\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), \"years\": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}",
      "properties": {
        "default": {
          "type": "oj.Converter<string>"
        },
        "seconds": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric, minute: 2-digit, second: 2-digit})"
        },
        "minutes": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric, minute: 2-digit})"
        },
        "hours": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour: numeric})"
        },
        "days": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: numeric, day: 2-digit})"
        },
        "weeks": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: numeric, day: 2-digit})"
        },
        "months": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: long})"
        },
        "quarters": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month: long})"
        },
        "years": {
          "type": "oj.Converter<string>",
          "value": "oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({year: numeric})"
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
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/* global dvt:false, LocaleData:false, __ValidationBase:false */

/**
 * @ojcomponent oj.ojTimeAxis
 * @augments oj.dvtBaseComponent
 * @since 2.1.0
 * @ojstatus preview
 * @ojshortdesc Displays a range of dates based on specified start and end dates and a time scale.
 * @ojrole application
 * @ojtsimport {module: "ojvalidation-base", type: "AMD", imported:["Converter"]}
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
oj.__registerWidget('oj.ojTimeAxis', $.oj.dvtBaseComponent,
  {
    widgetEventPrefix: 'oj',
    options: {
      /**
       * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the labels of the time axis for all 'scale' values, or
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting.
       * See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
       * @expose
       * @name converter
       * @memberof oj.ojTimeAxis
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "oj.ojTimeAxis.Converters|oj.Converter<string>", jsdocOverride: true}
       * @default {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}
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
        seconds: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ hour: 'numeric', minute: '2-digit', second: '2-digit' }),
        minutes: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ hour: 'numeric', minute: '2-digit' }),
        hours: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ hour: 'numeric' }),
        days: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ month: 'numeric', day: '2-digit' }),
        weeks: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ month: 'numeric', day: '2-digit' }),
        months: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ month: 'long' }),
        quarters: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ month: 'long' }),
        years: __ValidationBase.Validation.converterFactory(
          oj.ConverterFactory.CONVERTER_TYPE_DATETIME)
          .createConverter({ year: 'numeric' })
      },
      /**
       * The start time of the time axis. A valid value is required in order for the time axis to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
       * @expose
       * @name start
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

    // @inheritdoc
    _CreateDvtComponent: function (context, callback, callbackObj) {
      return dvt.TimeAxis.newInstance(context, callback, callbackObj);
    },

    // @inheritdoc
    _GetComponentStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses.push('oj-timeaxis');
      return styleClasses;
    },

    // @inheritdoc
    _GetChildStyleClasses: function () {
      var styleClasses = this._super();
      styleClasses['oj-timeaxis-label'] = { path: 'labelStyle', property: 'TEXT' };

      return styleClasses;
    },

    // @inheritdoc
    _GetEventTypes: function () {
      return ['optionChange'];
    },

    // @inheritdoc
    _GetTranslationMap: function () {
      // The translations are stored on the options object.
      var translations = this.options.translations;

      // Safe to modify super's map because function guarentees a new map is returned
      var ret = this._super();
      ret['DvtUtilBundle.TIMEAXIS'] = translations.componentName;
      return ret;
    },

    // @inheritdoc
    _GetComponentRendererOptions: function () {
      // the function should be removed if the component will support 'tooltip.renderer' attr
      return [];
    },

    // @inheritdoc
    _ProcessOptions: function () {
      this._super();

      // Date related options support only number | string types
      // TODO: remove deprecated number type support in favor of ISO String in future release
      var self = this;
      var processRootDateOptions = function (key) {
        var optionType = typeof self.options[key];
        if (!(optionType === 'number' || optionType === 'string')) {
          self.options[key] = null;
        } // e.g. this will exclude Date object types
      };

      processRootDateOptions('start');
      processRootDateOptions('end');
    },

    // @inheritdoc
    _LoadResources: function () {
      // Ensure the resources object exists
      if (this.options._resources == null) {
        this.options._resources = {};
      }

      var resources = this.options._resources;

      // Create default converters
      var converterFactory =
        __ValidationBase.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
      var secondsConverter = converterFactory.createConverter({
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
      var minutesConverter = converterFactory.createConverter({
        hour: 'numeric',
        minute: '2-digit'
      });
      var hoursConverter = converterFactory.createConverter({ hour: 'numeric' });
      var daysConverter = converterFactory.createConverter({
        month: 'numeric',
        day: '2-digit'
      });
      var monthsConverter = converterFactory.createConverter({ month: 'long' });
      var yearsConverter = converterFactory.createConverter({ year: 'numeric' });

      var monthsConverterVert = converterFactory.createConverter({ month: 'short' });
      var yearsConverterVert = converterFactory.createConverter({ year: '2-digit' });

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

      resources.converterFactory = converterFactory;
      resources.converter = converter;
      resources.converterVert = converterVert;

      // Class names to be set on appropriate svg elements
      resources.axisClass = 'oj-timeaxis-container';
      resources.axisLabelClass = 'oj-timeaxis-label';
      resources.axisSeparatorClass = 'oj-timeaxis-separator';

      // default disable all borders
      resources.borderTopVisible = false;
      resources.borderRightVisible = false;
      resources.borderBottomVisible = false;
      resources.borderLeftVisible = false;

      // first day of week; locale specific
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
 * @property {oj.Converter.<string>} [default=null] The default converter (an object literal or instance that duck types {@link oj.Converter}) to use for all 'scale' values that do not otherwise have a converter object provided. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [seconds=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'seconds' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [minutes=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'minutes' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [hours=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'hours' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [days=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'days' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [weeks=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'weeks' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [months=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'months' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [quarters=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'quarters' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 * @property {oj.Converter.<string>} [years=oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})] The converter (an object literal or instance that duck types {@link oj.Converter}) used for the 'years' scale. If not specified, the default converter will be used for this scale. See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
 */

/* global __oj_time_axis_metadata:false */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function () {
  __oj_time_axis_metadata.extension._WIDGET_NAME = 'ojTimeAxis';
  oj.CustomElementBridge.register('oj-time-axis', { metadata: __oj_time_axis_metadata });
}());

});