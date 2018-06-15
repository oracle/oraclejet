/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtTimeline'], function (oj, $, comp, base, dvt)
{
/**
 * @ojcomponent oj.ojTimeline
 * @ojdisplayname Timeline
 * @augments oj.dvtTimeComponent
 * @ojrole application
 * @since 1.1.0
 * @ojstatus preview
 * @ojshortdesc An interactive data visualization that displays a series of events in chronological order.
 * @ojtsignore
 *
 * @classdesc
 * <h3 id="timelineOverview-section">
 * JET Timeline
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#timelineOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Timeline is a themable, WAI-ARIA compliant element that displays a set of events in chronological order.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-timeline
 *   start='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Jan 1, 2016"))}}'
 *   end='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Dec 31, 2016"))}}'
 *   major-axis='{"scale": "months"}'
 *   minor-axis='{"scale": "weeks"}'
 *   series='{{seriesData}}'>
 * &lt;/oj-timeline>
 * </code>
 * </pre>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"a11yDoc"}
 *
 * <h3 id="formats-section">
 *   Date and Time Formats
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#formats-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"formatsDoc"}
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
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets.</p>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications only set usable data
 *    densities on the timeline. For example, applications should limit the number of
 *    overlapping items rendered beyond the height of the timeline. This can be
 *    achieved by increasing the size of the timeline, decreasing the axis scale, or
 *    providing external filters to reduce the amount of data rendered at any given
 *    time. While there are several optimizations within the timeline to deal with
 *    large data sets, it's always more efficient to reduce the data set size as early
 *    as possible. Future optimizations will focus on improving end user experience as
 *    well as developer productivity for common use cases.</p>
 *
 * <h4>Timeline Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the timeline. For example, a timeline spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering this many intervals
 *    can cause severe performance degradation when interacting with the timeline
 *    (scrolling and zooming) regardless of the number of items present.
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTimeline', $['oj']['dvtTimeComponent'],
{
  widgetEventPrefix: "oj",
  options:
  {
    /**
     * Defines the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">animation-on-data-change</code> attribute specified:</caption>
     * &lt;oj-timeline animation-on-data-change='auto'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">animationOnDataChange</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.animationOnDataChange;
     *
     * // setter
     * myTimeline.animationOnDataChange = 'auto';
     */
    animationOnDataChange: "none",
    /**
     * Defines the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">animation-on-display</code> attribute specified:</caption>
     * &lt;oj-timeline animation-on-display='auto'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">animationOnDisplay</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.animationOnDisplay;
     *
     * // setter
     * myTimeline.animationOnDisplay = 'auto';
     */
    animationOnDisplay: "none",
    /**
     * The end time of the timeline. A valid value is required in order for the timeline to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name end
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @default ""
     *
     * @example <caption>Get or set the <code class="prettyprint">end</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.end;
     *
     * // setter
     * myTimeline.end = '2017-12-31T05:00:00.000Z';
     */
    end: "",
    /**
     * An object with the following properties, used to define a timeline axis. This is required in order for the timeline to properly render.
     * @expose
     * @name minorAxis
     * @memberof oj.ojTimeline
     * @instance
     * @type {Object}
     * @default {"converter": {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}, "svgStyle": {}}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">minor-axis</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline minor-axis.converter="[[myConverterObject]]" minor-axis.scale="weeks" minor-axis.zoom-order='["quarters", "months", "weeks", "days"]'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline minor-axis='{"scale": "weeks", "zoomOrder": ["quarters", "months", "weeks", "days"]}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">minorAxis</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.minorAxis.scale;
     *
     * // Set one, leaving the others intact.
     * myTimeline.setProperty('minorAxis.scale', 'weeks');
     *
     * // Get all
     * var values = myTimeline.minorAxis;
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.minorAxis = {
     *     "converter": myConverterObject,
     *     "scale": "weeks",
     *     "svgStyle": {"backgroundColor": "red"},
     *     "zoomOrder": ["quarters", "months", "weeks", "days"]
     * };
     */
    minorAxis: {
      /**
       * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the labels of the minor axis for all 'scale' values, or 
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converter}). 
       * See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.converter
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converter|oj.Converter<string>)", jsdocOverride: true}
       * @default {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}
       */
      converter: {
        "default": null,
        "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}),
        "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}),
        "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}),
        "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}),
        "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}),
        "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}),
        "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}),
        "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})
      },
      /**
       * The time scale used for the minor axis. This is required in order for the timeline to properly render.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.scale
       * @memberof! oj.ojTimeline
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
       */
      scale: null,
      /**
       * The CSS style defining any additional styling of the axis. If not specified, no additional styling will be applied.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.svgStyle
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      svgStyle: {},
      /**
       * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
       * <br></br>See the <a href="#minorAxis">minor-axis</a> attribute for usage examples.
       * @expose
       * @name minorAxis.zoomOrder
       * @memberof! oj.ojTimeline
       * @instance
       * @type {?Array.<string>}
       * @ojsignature {target: "Type", value: "?"}
       * @default null
       */
      zoomOrder: null
    },
    /**
     * An object with the following properties, used to define a timeline axis. If not specified, no axis labels will be shown above the minor axis or in the overview.
     * @expose
     * @name majorAxis
     * @memberof oj.ojTimeline
     * @instance
     * @type {?Object}
     * @default {"converter": {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}, "svgStyle": {}}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">major-axis</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline major-axis.converter="[[myConverterObject]]" major-axis.scale="months" major-axis.zoom-order='["quarters", "months", "weeks", "days"]'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline major-axis='{"scale": "months", "zoomOrder": ["quarters", "months", "weeks", "days"]}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">majorAxis</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.majorAxis.scale;
     *
     * // Set one, leaving the others intact.
     * myTimeline.setProperty('majorAxis.scale', 'months');
     *
     * // Get all
     * var values = myTimeline.majorAxis;
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.majorAxis = {
     *     "converter": myConverterObject,
     *     "scale": "months"
     * };
     */
    majorAxis: {
      /**
       * A converter (an object literal or instance that duck types {@link oj.Converter}) used to format the labels of the major axis for all 'scale' values, or 
       * an object literal whose keys are 'scale' values that map specific converters for scale specific formatting (see {@link oj.ojTimeAxis.Converter}). 
       * See {@link oj.DateTimeConverterFactory} for details on creating built-in datetime converters.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.converter
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?(oj.ojTimeAxis.Converter|oj.Converter<string>)", jsdocOverride: true}
       * @default {"default": null, "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}), "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}), "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}), "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}), "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}), "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})}
       */
      converter: {
        "default": null,
        "seconds": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit', 'second': '2-digit'}),
        "minutes": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric', 'minute': '2-digit'}),
        "hours": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'hour': 'numeric'}),
        "days": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}),
        "weeks": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'numeric', 'day': '2-digit'}),
        "months": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}),
        "quarters": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'month': 'long'}),
        "years": oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({'year': 'numeric'})
      },
      /**
       * The time scale used for the major axis. If not specified, no axis labels will be shown above the minor axis or in the overview.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.scale
       * @memberof! oj.ojTimeline
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
       */
      scale: null,
      /**
       * The CSS style defining any additional styling of the axis. If not specified, no additional styling will be applied.
       * <br></br>See the <a href="#majorAxis">major-axis</a> attribute for usage examples.
       * @expose
       * @name majorAxis.svgStyle
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      svgStyle: {}
    },
    /**
     * The orientation of the element.
     * @expose
     * @name orientation
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "vertical"
     * @ojvalue {string} "horizontal"
     * @default "horizontal"
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">orientation</code> attribute specified:</caption>
     * &lt;oj-timeline orientation='vertical'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">orientation</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.orientation;
     *
     * // setter
     * myTimeline.orientation = 'vertical';
     */
    orientation: "horizontal",
    /**
     * An object with the following properties, used to define a timeline overview. If not specified, no overview will be shown.
     * @expose
     * @name overview
     * @memberof oj.ojTimeline
     * @instance
     * @type {?Object}
     * @default {"rendered": "off", "svgStyle": {}}
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">overview</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline overview.rendered="on" overview.svg-style='{"height":"50px"}'>&lt;/oj-timeline>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline overview='{"rendered": "on", "svgStyle": {"height":"50px"}}'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">majorAxis</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.overview.rendered;
     *
     * // Set one, leaving the others intact.
     * myTimeline.setProperty('overview.rendered', 'on');
     *
     * // Get all
     * var values = myTimeline.rendered;
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.majorAxis = {
     *     "rendered": "on",
     *     "svgStyle": {"height":"50px"}
     * };
     */
    overview: {
      /**
       * Specifies whether the overview scrollbar is rendered.
       * <br></br>See the <a href="#overview">overview</a> attribute for usage examples.
       * @expose
       * @name overview.rendered
       * @memberof! oj.ojTimeline
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       * @ojvalue {string} "on"
       * @ojvalue {string} "off"
       * @default "off"
       */
      rendered: "off",
      /**
       * The CSS style defining any additional styling of the overview. If not specified, no additional styling will be applied.
       * <br></br>See the <a href="#overview">overview</a> attribute for usage examples.
       * @expose
       * @name overview.svgStyle
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      svgStyle: {}
    },
    /**
     * The array of reference objects associated with the timeline. For each reference object, a line is rendered at the specified value. Currently only the first reference object in the array is supported. Any additional objects supplied in the array will be ignored.
     * @expose
     * @name referenceObjects
     * @memberof oj.ojTimeline
     * @instance
     * @type {Array.<Object>}
     * @ojsignature {target: "Type", value: "Array<oj.ojTimeline.ReferenceObject>", jsdocOverride: true}
     * @default []
     * 
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">reference-objects</code> attribute specified:</caption>
     * &lt;oj-timeline reference-objects='[{"value": "2017-04-15T04:00:00.000Z"}]'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">referenceObjects</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.referenceObjects[0];
     * 
     * // Get all
     * var values = myTimeline.referenceObjects;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myTimeline.referenceObjects = [{"value": "2017-04-15T00:00:00.000Z"}];
     */
    referenceObjects: [],
    /**
     * An array of strings containing the ids of the initially selected items.
     * @expose
     * @name selection
     * @memberof oj.ojTimeline
     * @instance
     * @type {Array.<string>}
     * @ojwriteback
     * @default []
     * 
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">selection</code> attribute specified:</caption>
     * &lt;oj-timeline selection='["itemID1", "itemID2", "itemID3"]'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">gridlines</code> property after initialization:</caption>
     * // Get one
     * var value = myTimeline.selection[0];
     * 
     * // Get all
     * var values = myTimeline.selection;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myTimeline.selection = ["itemID1", "itemID2", "itemID3"];
     */
    selection: [],
    /**
     * The type of selection behavior that is enabled on the timeline. If 'single' is specified, only a single item across all series can be selected at once. If 'multiple', any number of items across all series can be selected at once. Otherwise, selection is disabled.
     * @expose
     * @name selectionMode
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @ojvalue {string} "single"
     * @ojvalue {string} "multiple"
     * @ojvalue {string} "none"
     * @default "none"
     * 
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">selection-mode</code> attribute specified:</caption>
     * &lt;oj-timeline selection-mode='multiple'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.selectionMode;
     * 
     * // setter
     * myTimeline.selectionMode = 'multiple';
     */
    selectionMode: "none",
    /**
     * An array of objects with the following properties, used to define a timeline series. Also accepts a Promise that will resolve with an array for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @name series
     * @memberof oj.ojTimeline
     * @instance
     * @type {?(Array.<Object>|Promise)}
     * @ojsignature {target: "Accessor", value: {GetterType: "Promise<Array<oj.ojTimeline.Series>>|null", SetterType: "Array<oj.ojTimeline.Series>|Promise<Array<oj.ojTimeline.Series>>|null"}, jsdocOverride: true}
     * @default null
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">series</code> attribute specified:</caption>
     * &lt;oj-timeline series='[[mySeries]]'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">series</code> property after initialization:</caption>
     * // Get all (The series getter always returns a Promise so there is no "get one" syntax)
     * var values = myTimeline.series;
     *
     * // Set all (There is no permissible "set one" syntax.)
     * myTimeline.series = [
     *     {
     *         "id": "s1",
     *         "emptyText": "No Tournaments Played.",
     *         "label": "Rafael Nadal: 75-7",
     *         "items": [
     *             {
     *                 "id": "e1",
     *                 "title":"ATP VTR Open",
     *                 "start": "2013-02-04",
     *                 "description":"Finalist: 3-1"
     *             },
     *             {
     *                 "id": "e2",
     *                 "title":"ATP Brasil Open",
     *                 "start": "2013-02-11",
     *                 "description":"Champion: 4-0"
     *             }
     *         ]
     *     },
     *     {
     *         "id": "s2",
     *         "emptyText": "No Tournaments Played.",
     *         "label": "Novak Djokovic: 74-9",
     *         "items": [
     *             {
     *                 "id": "e101",
     *                 "title":"AUSTRALIAN OPEN",
     *                 "start": "2013-01-14",
     *                 "description":"Champion: 7-0"
     *             },
     *             {
     *                 "id": "e102",
     *                 "title":"Davis Cup World Group Round 1n",
     *                 "start": "2013-02-01",
     *                 "description":"Results: 1-0"
     *             },
     *             {
     *                 "id": "e103",
     *                 "title":"ATP Dubai Duty Free Tennis Championships",
     *                 "start": "2013-02-25",
     *                 "description":"Champion: 5-0"
     *             }
     *         ]
     *     }
     * ];
     */
    series: null,
    /**
     * The start time of the timeline. A valid value is required in order for the timeline to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name start
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @default ""
     * 
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">start</code> attribute specified:</caption>
     * &lt;oj-timeline start='2017-01-01T05:00:00.000Z'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">start</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.start;
     *
     * // setter
     * myTimeline.start = "2017-01-01T05:00:00.000Z";
     */
    start: "",
    /**
     * An object with the following properties, used to define default styling for the timeline.
     * Component CSS classes should be used to set component wide styling. This API should be used
     * only for styling a specific instance of the component. Properties specified on this object may 
     * be overridden by specifications on the data item. Some property default values come from the CSS 
     * and varies based on theme.
     * @expose
     * @name styleDefaults
     * @memberof oj.ojTimeline
     * @instance
     * @type {Object}
     * @default {"item": {}, "minorAxis": {}, "majorAxis": {}, "overview": {"window": {}},  "referenceObject": {}, "series": {"colors": ["#237bb1", "#68c182", "#fad55c", "#ed6647", "#8561c8", "#6ddbdb", "#ffb54d", "#e371b2", "#47bdef", "#a2bf39", "#a75dba", "#f7f37b"]}}
     * 
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">style-defaults</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-timeline style-defaults.animation-duration='200'>&lt;/oj-timeline>
     * 
     * &lt;!-- Using JSON notation -->
     * &lt;oj-timeline style-defaults='{"animationDuration": 200, "item": {"backgroundColor": "red"}'>&lt;/oj-timeline>
     * 
     * @example <caption>Get or set the <code class="prettyprint">styleDefaults</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myTimeline.styleDefaults.animationDuration;
     * 
     * // Get all
     * var values = myTimeline.styleDefaults;
     *
     * // Set one, leaving the others intact. Always use the setProperty API for 
     * // subproperties rather than setting a subproperty directly.
     * myTimeline.setProperty('styleDefaults.borderColor', 'red');
     * 
     * // Set all. Must list every resource key, as those not listed are lost.
     * myTimeline.styleDefaults = {'borderColor': 'red'};
     */
    styleDefaults: {
      /**
       * The duration of the animations, in milliseconds. The default value comes from the CSS and varies based on theme. For data change animations with multiple stages, this attribute defines the duration of each stage. For example, if an animation contains two stages, the total duration will be two times this attribute's value.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.animationDuration
       * @memberof! oj.ojTimeline
       * @instance
       * @type {number}
       * @ojsignature {target: "Type", value: "?"}
       * @ojunits "milliseconds"
       */
      animationDuration: undefined,
      /**
       * The border color of the timeline. The default value comes from the CSS and varies based on theme.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.borderColor
       * @memberof! oj.ojTimeline
       * @instance
       * @type {string}
       * @ojsignature {target: "Type", value: "?"}
       */
      borderColor: undefined,
      /**
       * An object with the following properties, used to define the default styling for the timeline item.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.item
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      item: {
        /**
         * The background color of the timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.backgroundColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        backgroundColor: undefined,
        /**
         * The border color of the timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.borderColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        borderColor: undefined,
        /**
         * The CSS style defining the style of the timeline item description text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.descriptionStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        descriptionStyle: undefined,
        /**
         * The background color of the highlighted timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.hoverBackgroundColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        hoverBackgroundColor: undefined,
        /**
         * The border color of the highlighted timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.hoverBorderColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        hoverBorderColor: undefined,
        /**
         * The background color of the selected timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.selectedBackgroundColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        selectedBackgroundColor: undefined,
        /**
         * The border color of the selected timeline items. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.selectedBorderColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        selectedBorderColor: undefined,
        /**
         * The CSS style defining the style of the timeline item title text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.item.titleStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        titleStyle: undefined
      },
      /**
       * An object with the following properties, used to define the default styling for the time axis.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.minorAxis
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      minorAxis: {
        /**
         * The background color of the time axis. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.backgroundColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        backgroundColor: undefined,
        /**
         * The border color of the time axis. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.borderColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        borderColor: undefined,
        /**
         * The CSS style defining the style of the time axis label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.labelStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        labelStyle: undefined,
        /**
         * The color of the time axis separators. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.minorAxis.separatorColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        separatorColor: undefined
      },
      
      /**
       * An object with the following properties, used to define the default styling for the major time axis.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.majorAxis
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      majorAxis: {
        /**
         * The CSS style defining the style of the major time axis label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.majorAxis.labelStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        labelStyle: undefined,
        /**
         * The color of the major time axis separators. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.majorAxis.separatorColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        separatorColor: undefined
      },
      /**
       * An object with the following properties, used to define the default styling for the timeline overview.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.overview
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      overview: {
        /**
         * The background color of the timeline overview. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.overview.backgroundColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        backgroundColor: undefined,
        /**
         * The CSS style defining the style of the timeline overview label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.overview.labelStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        labelStyle: undefined,
        /**
         * An object with the following properties, used to define the default styling for the timeline overview window.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.overview.window
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         * @default {}
         */
        window: {
          /**
           * The background color of the timeline overview window. The default value comes from the CSS and varies based on theme.
           * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
           * @expose
           * @name styleDefaults.overview.window.backgroundColor
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           */
          backgroundColor: undefined,
          /**
           * The border color of the timeline overview window. The default value comes from the CSS and varies based on theme.
           * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
           * @expose
           * @name styleDefaults.overview.window.borderColor
           * @memberof! oj.ojTimeline
           * @instance
           * @type {string}
           * @ojsignature {target: "Type", value: "?"}
           */
          borderColor: undefined
        }
      },
      /**
       * An object with the following properties, used to define the default styling for the reference objects.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.referenceObject
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {}
       */
      referenceObject: {
        /**
         * The color of the reference objects. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.referenceObject.color
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        color: undefined
      },
      /**
       * An object with the following properties, used to define the default styling for the timeline series.
       * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
       * @expose
       * @name styleDefaults.series
       * @memberof! oj.ojTimeline
       * @instance
       * @type {Object}
       * @ojsignature {target: "Type", value: "?"}
       * @default {"colors": ["#237bb1", "#68c182", "#fad55c", "#ed6647", "#8561c8", "#6ddbdb", "#ffb54d", "#e371b2", "#47bdef", "#a2bf39", "#a75dba", "#f7f37b"]}
       */
      series: {
        /**
         * The background color of the series. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.backgroundColor
         * @memberof! oj.ojTimeline
         * @instance
         * @type {string}
         * @ojsignature {target: "Type", value: "?"}
         */
        backgroundColor: undefined,
        /**
         * The array defining the default color ramp for the series items.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.colors
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Array.<string>}
         * @ojsignature {target: "Type", value: "?"}
         * @default ["#237bb1", "#68c182", "#fad55c", "#ed6647", "#8561c8", "#6ddbdb", "#ffb54d", "#e371b2", "#47bdef", "#a2bf39", "#a75dba", "#f7f37b"]
         */
        colors: ["#237bb1", "#68c182", "#fad55c", "#ed6647", "#8561c8", "#6ddbdb", "#ffb54d", "#e371b2", "#47bdef", "#a2bf39", "#a75dba", "#f7f37b"],
        /**
         * The CSS style defining the style of the series empty text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.emptyTextStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        emptyTextStyle: undefined,
        /**
         * The CSS style defining the style of the series label text. The default value comes from the CSS and varies based on theme.
         * <br></br>See the <a href="#styleDefaults">style-defaults</a> attribute for usage examples.
         * @expose
         * @name styleDefaults.series.labelStyle
         * @memberof! oj.ojTimeline
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         */
        labelStyle: undefined
      }
    },
    /**
     * The end time of the timeline's viewport. If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the timeline. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name viewportEnd
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @default ""
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">viewport-end</code> attribute specified:</caption>
     * &lt;oj-timeline viewport-end='2017-12-31T05:00:00.000Z'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">viewportEnd</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.viewportEnd;
     *
     * // setter
     * myTimeline.viewportEnd = '2017-12-31T05:00:00.000Z';
     */
    viewportEnd: "",
    /**
     * The start time of the timeline's viewport. If not specified or invalid, this will default to a value determined by the initial 'scale' of the minor axis and the width of the timeline. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
     * @expose
     * @name viewportStart
     * @memberof oj.ojTimeline
     * @instance
     * @type {string}
     * @default ""
     *
     * @example <caption>Initialize the Timeline with the <code class="prettyprint">viewport-start</code> attribute specified:</caption>
     * &lt;oj-timeline viewport-start='2017-01-01T05:00:00.000Z'>&lt;/oj-timeline>
     *
     * @example <caption>Get or set the <code class="prettyprint">viewportStart</code> property after initialization:</caption>
     * // getter
     * var value = myTimeline.viewportStart;
     *
     * // setter
     * myTimeline.viewportStart = '2017-01-01T05:00:00.000Z';
     */
    viewportStart: "",
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     *
     * @property {string} viewportStart the start of the new viewport on a timeline
     * @property {string} viewportEnd the end of the new viewport on a timeline
     * @property {string} minorAxisScale the time scale of the minor axis
     *
     * @expose
     * @event
     * @memberof oj.ojTimeline
     * @instance
     * @ojbubbles
     */
    viewportChange: null
  },

  //@inheritdoc
  _CreateDvtComponent: function(context, callback, callbackObj)
  {
    return dvt.Timeline.newInstance(context, callback, callbackObj);
  },

  /**
   * @override
   * @instance
   * @memberof oj.ojTimeline
   * @protected
   */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-timeline-item') {
      // timelineItem[seriesIndex][itemIndex]
      subId = 'timelineItem[' + locator['seriesIndex'] + '][' + locator['itemIndex'] + ']';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  /**
   * @override
   * @instance
   * @memberof oj.ojTimeline
   * @protected
   */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId.indexOf('timelineItem') == 0) {
      // timelineItem[seriesIndex][itemIndex]
      var indexPath = this._GetIndexPath(subId);

      locator['subId'] = 'oj-timeline-item';
      locator['seriesIndex'] = indexPath[0];
      locator['itemIndex'] = indexPath[1];
    }

    return locator;
  },

  //@inheritdoc
  _ProcessStyles: function()
  {
    this._super();
    if (!this.options['styleDefaults'])
      this.options['styleDefaults'] = {};

    if (!this.options['styleDefaults']['series'])
      this.options['styleDefaults']['series'] = {};

    if (!this.options['styleDefaults']['series']['colors'])
    {
      var handler = new oj.ColorAttributeGroupHandler();

      // override default colors with css attribute group colors
      this.options['styleDefaults']['series']['colors'] = handler.getValueRamp();
    }
  },

  //@inheritdoc
  _GetComponentStyleClasses: function()
  {
    var styleClasses = this._super();
    styleClasses.push('oj-timeline');
    return styleClasses;
  },

  //@inheritdoc
  _GetComponentRendererOptions: function() {
    //the function should be removed if the timeline will support 'tooltip.renderer' attr
    return [];
  },

  //@inheritdoc
  _GetChildStyleClasses: function()
  {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-timeline'] = {'path': 'styleDefaults/animationDuration', 'property': 'ANIM_DUR'};
    styleClasses['oj-timeline'] = {'path': 'styleDefaults/borderColor', 'property': 'border-color'};
    styleClasses['oj-timeline-item'] = [
      {'path': 'styleDefaults/item/borderColor', 'property': 'border-color'},
      {'path': 'styleDefaults/item/backgroundColor', 'property': 'background-color'}
    ];
    styleClasses['oj-timeline-item oj-hover'] = [
      {'path': 'styleDefaults/item/hoverBorderColor', 'property': 'border-color'},
      {'path': 'styleDefaults/item/hoverBackgroundColor', 'property': 'background-color'}
    ];
    styleClasses['oj-timeline-item oj-selected'] = [
      {'path': 'styleDefaults/item/selectedBorderColor', 'property': 'border-color'},
      {'path': 'styleDefaults/item/selectedBackgroundColor', 'property': 'background-color'}
    ];
    styleClasses['oj-timeline-item-description'] = {'path': 'styleDefaults/item/descriptionStyle', 'property': 'TEXT'};
    styleClasses['oj-timeline-item-title'] = {'path': 'styleDefaults/item/titleStyle', 'property': 'TEXT'};
    styleClasses['oj-timeline-major-axis-label'] = {'path': 'styleDefaults/majorAxis/labelStyle', 'property': 'TEXT'};
    styleClasses['oj-timeline-major-axis-separator'] = {'path': 'styleDefaults/majorAxis/separatorColor', 'property': 'color'};
    styleClasses['oj-timeline-minor-axis'] = [
      {'path': 'styleDefaults/minorAxis/backgroundColor', 'property': 'background-color'},
      {'path': 'styleDefaults/minorAxis/borderColor', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-minor-axis-label'] = {'path': 'styleDefaults/minorAxis/labelStyle', 'property': 'TEXT'};
    styleClasses['oj-timeline-minor-axis-separator'] = {'path': 'styleDefaults/minorAxis/separatorColor', 'property': 'color'};
    styleClasses['oj-timeline-overview'] = {'path': 'styleDefaults/overview/backgroundColor', 'property': 'background-color'};
    styleClasses['oj-timeline-overview-label'] = {'path': 'styleDefaults/overview/labelStyle', 'property': 'TEXT'};
    styleClasses['oj-timeline-overview-window'] = [
      {'path': 'styleDefaults/overview/window/backgroundColor', 'property': 'background-color'},
      {'path': 'styleDefaults/overview/window/borderColor', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-reference-object'] = {'path': 'styleDefaults/referenceObject/color', 'property': 'color'};
    styleClasses['oj-timeline-series'] = {'path': 'styleDefaults/series/backgroundColor', 'property': 'background-color'};
    styleClasses['oj-timeline-series-empty-text'] = {'path': 'styleDefaults/series/emptyTextStyle', 'property': 'TEXT'};
    styleClasses['oj-timeline-series-label'] = {'path': 'styleDefaults/series/labelStyle', 'property': 'TEXT'};

    // Zoom Control Icons
    styleClasses['oj-timeline-zoomin-icon'] = [
      {'path': '_resources/zoomIn_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-hover'] = [
      {'path': '_resources/zoomIn_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-active'] = [
      {'path': '_resources/zoomIn_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-disabled'] = [
      {'path': '_resources/zoomIn_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_d_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon'] = [
      {'path': '_resources/zoomOut_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-hover'] = [
      {'path': '_resources/zoomOut_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-active'] = [
      {'path': '_resources/zoomOut_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-disabled'] = [
      {'path': '_resources/zoomOut_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_d_bc', 'property': 'border-color'}
    ];

    return styleClasses;
  },

  //@inheritdoc
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.TIMELINE'] = translations['componentName'];
    ret['DvtUtilBundle.TIMELINE_SERIES'] = translations['labelSeries'];
    ret['DvtUtilBundle.ZOOM_IN'] = translations['tooltipZoomIn'];
    ret['DvtUtilBundle.ZOOM_OUT'] = translations['tooltipZoomOut'];

    return ret;
  },

  //@inheritdoc
  _LoadResources: function() {
    this._super();

    var resources = this.options['_resources'];
    var converter = resources['converter'];
    var converterFactory = resources['converterFactory'];

    // Create default converters for vertical timeline
    var monthsConverterVert = converterFactory.createConverter({'month': 'short'});
    var yearsConverterVert = converterFactory.createConverter({'year': '2-digit'});

    var converterVert = {
      'seconds': converter['seconds'],
      'minutes': converter['minutes'],
      'hours': converter['hours'],
      'days': converter['days'],
      'weeks': converter['weeks'],
      'months': monthsConverterVert,
      'quarters': monthsConverterVert,
      'years': yearsConverterVert
    };

    resources['converterVert'] = converterVert;

    // Zoom control icons
    resources['zoomIn'] = 'oj-timeline-zoomin-icon';
    resources['zoomIn_h'] = 'oj-timeline-zoomin-icon oj-hover';
    resources['zoomIn_a'] = 'oj-timeline-zoomin-icon oj-active';
    resources['zoomIn_d'] = 'oj-timeline-zoomin-icon oj-disabled';
    resources['zoomOut'] = 'oj-timeline-zoomout-icon';
    resources['zoomOut_h'] = 'oj-timeline-zoomout-icon oj-hover';
    resources['zoomOut_a'] = 'oj-timeline-zoomout-icon oj-active';
    resources['zoomOut_d'] = 'oj-timeline-zoomout-icon oj-disabled';

    // Overview icons
    resources['overviewHandleHor'] = 'oj-timeline-overview-window-handle-horizontal';
    resources['overviewHandleVert'] = 'oj-timeline-overview-window-handle-vertical';
  },

  //@inheritdoc
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['series']};
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   * @ojsignature {target: "Type", value: "oj.ojTimeline.NodeContext|null", jsdocOverride: true, for: "returns"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojTimeline
   */
  getContextByNode: function(node)
  {
    // context objects are documented with @ojnodecontext
    return this.getSubIdByNode(node);
  }
});
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
 *       <td>Timeline Item</td>
 *       <td>Tap</td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Timeline Panel</td>
 *       <td>Drag</td>
 *       <td>Paning: navigate forward and backward in time in horizontal/vertical orientation.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan>Pinch-Close/Spread-Open</td>
 *       <td>Zoom In/Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Zoom Control</td>
 *       <td>Tap on "+" element</td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td>Tap on "-" element</td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Overview</td>
 *       <td>Press on right/left side of window & Hold & Drag in right of left direction</td>
 *       <td>Zoom In/Out (resize overview window).</td>
 *     </tr>
 *     <tr>
 *       <td>Press & Hold on the body of window & Drag in right of left direction</td>
 *       <td>Pan (move overview window).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeline
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
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td rowspan="2">Moves focus between series in a Dual Timeline and does nothing in a Single Timeline.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and multi-select next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and multi-select next data item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus to previous data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus to next data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to previous data item (on left), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to next data item (on right), without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select data item with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>= or +</kbd></td>
 *       <td>Zoom in one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>- or _</kbd></td>
 *       <td>Zoom out one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Pan up if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Pan down if scrolling is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp</kbd></td>
 *       <td>Pan left in left-to-right locales. Pan right in right-to-left locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageDown</kbd></td>
 *       <td>Pan right in left-to-right locales. Pan left in right-to-left locales.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTimeline
 */

/**
 *<p>The date/time data in the Timeline plays a key role, not only in the representation of events in the order in which they occurred, but also in many other places, such as the time axis, event durations, time markers, size and position calculations for the overview locator window, etc.</p>
 *<p>The Timeline supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
 *<table  class="keyboard-table">
 *<thead>
 *<tr>
 *<th>Symbol</th>
 *<th>Description</th>
 *<th>Values</th>
 *<th>Examples</th>
 *</tr>
 </thead>
 <tbody>
 *<tr>
 *<td><font color="#4B8A08">-, :, .,T</font></td><td>Characters actually in the string. T specifies the start of a time.</td><td></td><td></td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">YYYY</font></td><td>Year</td><td></td><td rowspan="3">2013-03-22<br>2014-02</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">MM</font></td><td>Month</td><td>01 to 12</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">DD</font></td><td>Day of the month</td><td>01 to 31</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">HH</font></td><td>Hours</td><td>00 to 24</td><td rowspan="3">2013-02-04T15:20Z<br>2013-02-10T15:20:45.300Z</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">mm</font></td><td>Minutes</td><td>00 to 59</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">ss</font></td><td>Seconds. The seconds and milliseconds are optional if a time is specified.</td><td>00 to 59</td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">sss</font></td><td>Milliseconds</td><td>00 to 999</td><td></td>
 *</tr>
 *<tr>
 *<td><font color="#4B8A08">Z</font></td><td>The value in this position can be one of the following. If the value is omitted, character 'Z' should be used to specify UTC time.<br><ul><li><b>Z</b> indicates UTC time.</li><li><b>+hh:mm</b> indicates that the input time is the specified offset after UTC time.</li><li><b>-hh:mm</b> indicates that the input time is the absolute value of the specified offset before UTC time.</li></ul></td><td></td><td>2013-02-04T15:20:00-07:00<br>2013-02-04T15:20:00+05:00<br>2013-02-04T15:20:00Z</td>
 *</tr>
 *</tbody>
 *</table>
 *<p>The ISO format support short notations where the string must only include the date and not time, as in the following formats: YYYY, YYYY-MM, YYYY-MM-DD.</p>
 *<p>The ISO format does not support time zone names. You can use the Z position to specify an offset from UTC time. If you do not include a value in the Z position, UTC time is used. The correct format for UTC should always include character 'Z' if the offset time value is omitted. The date-parsing algorithms are browser-implementation-dependent and, for example, the date string '2013-02-27T17:00:00' will be parsed differently in Chrome vs Firefox vs IE.</p>
 *<p>You can specify midnight by using 00:00, or by using 24:00 on the previous day. The following two strings specify the same time: 2010-05-25T00:00Z and 2010-05-24T24:00Z.</p>
 *
 * @ojfragment formatsDoc
 * @memberof oj.ojTimeline
 */

/**
 *<p>The application is responsible for populating the shortDesc value in the component options object with meaningful descriptors when the component does not provide a default descriptor. Since component terminology for keyboard and touch shortcuts can conflict with those of the application, it is the application's responsibility to provide these shortcuts, possibly via a help popup.</p>
 *
 * @ojfragment a11yDoc
 * @memberof oj.ojTimeline
 */

// PROPERTY TYPEDEFS

/**
 * @typedef {Object} oj.ojTimeline.ReferenceObject
 * @property {string=} value The time value of this reference object. If not specified, no reference object will be shown. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 */
/**
 * @typedef {Object} oj.ojTimeline.Series
 * @property {string=} emptyText The text of an empty timeline series.
 * @property {string} id The identifier for the timeline series.
 * @property {"bottomToTop"|"topToBottom"|"auto"} [itemLayout="auto"] The direction in which items are laid out when in a horizontal orientation. This attribute is ignored when in a vertical orientation.
 * @property {string=} label The label displayed on the timeline series. In not specified, no label will be shown.
 * @property {Object=} svgStyle The CSS style defining any additional styling of the series. If not specified, no additional styling will be applied.
 * @property {Array.<oj.ojTimeline.SeriesItem>} [items] An array of items. If not specified, no data will be shown in this series.
 */
/**
 * @typedef {Object} oj.ojTimeline.SeriesItem
 * @property {string=} description The description text displayed on the timeline item. If not specified, no description will be shown.
 * @property {string=} end The end time of this timeline item. If not specified, no duration bar will be shown. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @property {string=} durationFillColor The color applied to the duration bar of the timeline item. If not specified, this will be determined by the color ramp of the series.
 * @property {string} id The identifier for the timeline item. This must be unique across all items in the timeline, and is required in order for the timeline to properly render.
 * @property {string} start The start time of this timeline item. This is required in order for the timeline item to properly render. See <a href="#formats-section">Date and Time Formats</a> for more details on the required string formats.
 * @property {Object=} svgStyle The CSS style defining any additional styling of the item. If not specified, no additional styling will be applied.
 * @property {string=} thumbnail An optional URI specifying the location of an image resource to be displayed on the item. The image will be rendered at 32px x 32px in size. If not specified, no thumbnail will be shown.
 * @property {string=} title The title text displayed on the timeline item. If not specified, no title will be shown.
 */

// METHOD TYPEDEFS

/**
 * @typedef {Object} oj.ojTimeline.NodeContext
 * @property {string} subId The subId string to identify the particular DOM node.
 * @property {number} seriesIndex The zero based index of the timeline series.
 * @property {number} itemIndex The zero based index of the timeline series item.
 */

// KEEP FOR WIDGET SYNTAX

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for timeline series items indexed by series and item indices.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojsubid oj-timeline-item
 * @memberof oj.ojTimeline
 *
 * @example <caption>Gets the second item from the first series:</caption>
 * var node = myComponent.getNodeBySubId({'subId': 'oj-timeline-item', 'seriesIndex': 0, 'itemIndex': 1});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for timeline series items indexed by series and item indices.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojnodecontext oj-timeline-item
 * @memberof oj.ojTimeline
 */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojTimelineMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "end": {
      "type": "string"
    },
    "majorAxis": {
      "type": "object",
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
        "scale": {
          "type": "string",
          "enumValues": ["seconds", "minutes", "hours", "days", "weeks", "months", "quarters", "years"]
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "minorAxis": {
      "type": "object",
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
        "scale": {
          "type": "string",
          "enumValues": ["seconds", "minutes", "hours", "days", "weeks", "months", "quarters", "years"]
        },
        "svgStyle": {
          "type": "object"
        },
        "zoomOrder": {
          "type": "Array<string>"
        }
      }
    },
    "orientation": {
      "type": "string",
      "enumValues": ["horizontal", "vertical"]
    },
    "overview": {
      "type": "object",
      "properties": {
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off"]
        },
        "svgStyle": {
          "type": "object"
        }
      }
    },
    "referenceObjects": {
      "type": "Array<object>"
    },
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["single", "multiple", "none"]
    },
    "series": {
      "type": "Array<object>|Promise"
    },
    "start": {
      "type": "string"
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDuration": {
          "type": "number"
        },
        "borderColor": {
          "type": "string"
        },
        "item": {
          "type": "object",
          "properties": {
            "item": {
              "backgroundColor": {
                "type": "string"
              },
              "borderColor": {
                "type": "string"
              },
              "descriptionStyle": {
                "type": "object"
              },
              "hoverBackgroundColor": {
                "type": "string"
              },
              "hoverBorderColor": {
                "type": "string"
              },
              "selectedBackgroundColor": {
                "type": "string"
              },
              "selectedBorderColor": {
                "type": "string"
              },
              "titleStyle": {
                "type": "object"
              }
            }
          }
        },
        "majorAxis": {
          "type": "object",
          "properties": {
            "majorAxis": {
              "labelStyle": {
                "type": "object"
              },
              "separatorColor": {
                "type": "string"
              }
            }
          }
        },
        "minorAxis": {
          "type": "object",
          "properties": {
            "minorAxis": {
              "backgroundColor": {
                "type": "string"
              },
              "borderColor": {
                "type": "string"
              },
              "labelStyle": {
                "type": "object"
              },
              "separatorColor": {
                "type": "string"
              }
            }
          }
        },
        "overview": {
          "type": "object",
          "properties": {
            "overview": {
              "backgroundColor": {
                "type": "string"
              },
              "labelStyle": {
                "type": "object"
              },
              "window": {
                "type": "object",
                "properties": {
                  "window": {
                    "backgroundColor": {
                      "type": "string"
                    },
                    "borderColor": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "referenceObject": {
          "type": "object",
          "properties": {
            "referenceObject": {
              "color": {
                "type": "string"
              }
            }
          }
        },
        "series": {
          "type": "object",
          "properties": {
            "series": {
              "backgroundColor": {
                "type": "string"
              },
              "colors": {
                "type": "Array<string>"
              },
              "emptyTextStyle": {
                "type": "object"
              },
              "labelStyle": {
                "type": "object"
              }
            }
          }
        }
      }
    },
    "translations": {
      "type": "Object",
      "properties": {
        "accessibleItemDesc": {
          "type": "string",
          "value": "Description is {0}."
        },
        "accessibleItemEnd": {
          "type": "string",
          "value": "End time is {0}."
        },
        "accessibleItemStart": {
          "type": "string",
          "value": "Start time is {0}."
        },
        "accessibleItemTitle": {
          "type": "string",
          "value": "Title is {0}."
        },
        "componentName": {
          "type": "string",
          "value": "Timeline"
        },
        "labelAndValue": {
          "type": "string",
          "value": "{0}: {1}"
        },
        "labelClearSelection": {
          "type": "string",
          "value": "Clear Selection"
        },
        "labelCountWithTotal": {
          "type": "string",
          "value": "{0} of {1}"
        },
        "labelDataVisualization": {
          "type": "string",
          "value": "Data Visualization"
        },
        "labelInvalidData": {
          "type": "string",
          "value": "Invalid data"
        },
        "labelNoData": {
          "type": "string",
          "value": "No data to display"
        },
        "labelSeries": {
          "type": "string",
          "value": "Series"
        },
        "stateCollapsed": {
          "type": "string",
          "value": "Collapsed"
        },
        "stateDrillable": {
          "type": "string",
          "value": "Drillable"
        },
        "stateExpanded": {
          "type": "string",
          "value": "Expanded"
        },
        "stateHidden": {
          "type": "string",
          "value": "Hidden"
        },
        "stateIsolated": {
          "type": "string",
          "value": "Isolated"
        },
        "stateMaximized": {
          "type": "string",
          "value": "Maximized"
        },
        "stateMinimized": {
          "type": "string",
          "value": "Minimized"
        },
        "stateSelected": {
          "type": "string",
          "value": "Selected"
        },
        "stateUnselected": {
          "type": "string",
          "value": "Unselected"
        },
        "stateVisible": {
          "type": "string",
          "value": "Visible"
        },
        "tooltipZoomIn": {
          "type": "string",
          "value": "Zoom In"
        },
        "tooltipZoomOut": {
          "type": "string",
          "value": "Zoom Out"
        }
      }
    },
    "viewportEnd": {
      "type": "string"
    },
    "viewportStart": {
      "type": "string"
    }
  },
  "methods": {
    "getContextByNode": {}
  },
  "events": {
    "viewportChange": {}
  },
  "extension": {
    _WIDGET_NAME: "ojTimeline"
  }
};
oj.CustomElementBridge.registerMetadata('oj-timeline', 'dvtTimeComponent', ojTimelineMeta);
oj.CustomElementBridge.register('oj-timeline', {'metadata': oj.CustomElementBridge.getMetadata('oj-timeline')});
})();
});