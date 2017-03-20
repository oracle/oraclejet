/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtGantt'], function(oj, $, comp, base, dvt)
{

/**This file is generated. Do not edit directly. Actual file located in 3rdparty/dvt/prebuild.**/
/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojGantt
 * @augments oj.dvtTimeComponent
 * @since 2.1.0
 *
 * @classdesc
 * <h3 id="GanttOverview-section">
 *   JET Gantt Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#GanttOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Gantt is a themable, WAI-ARIA compliant component that illustrates the start and finish dates of tasks.</p>
 *
 * <p>This component should be bound to an HTML div element, and the SVG DOM that it generates should be treated as a
 * black box, as it is subject to change.  This component should not be extended.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojGantt',
 *   majorAxis: {scale: 'months'},
 *   minorAxis: {scale: 'weeks'},
 *   rows: [{
 *     id: 'r1',
 *     tasks: [{
 *       id: 't1_1',
 *       label:'Label 1-1',
 *       start: new Date('2016-01-12').toISOString(),
 *       end: new Date('2016-02-22').toISOString()
 *     }, {
 *       id: 't1_2',
 *       label:'Label 1-2',
 *       start: new Date('2016-03-02').toISOString(),
 *       end: new Date('2016-05-21').toISOString()
 *     }]
 *   }, {
 *     id: 'r2',
 *     tasks: [{
 *       id: 't2_1',
 *       label:'Label 2',
 *       start: new Date('2016-02-01').toISOString(),
 *       end: new Date('2016-04-10').toISOString()
 *     }]
 *   }]
 * }"/>
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
 * <p>Gantt has been tested to render up to 5000 tasks in 1 second.  In general, applications 
 *    should avoid displaying a very large number of task bars at the same time.  Applications 
 *    could for example use a filter to only show task bars for a specific set of time ranges.</p>
 *
 * <h4>Gantt Span</h4>
 *
 * <p>It's recommended that applications limit the number of time intervals that are
 *    rendered by the Gantt chart. For example, a Gantt chart spanning one year with a scale
 *    of hours will display (365 * 24) 8,760 intervals. Rendering this many intervals
 *    can cause severe performance degradation when interacting with the component
 *    (scrolling and zooming) regardless of the number of task bars present.
 *
 * @desc Creates a JET Gantt.
 * @example <caption>Initialize the Gantt chart with some options:</caption>
 * $(".selector").ojGantt({selectionMode: 'single'});
 *
 * @example <caption>Initialize the Gantt chart via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojGantt'}">
 */
oj.__registerWidget('oj.ojGantt', $['oj']['dvtTimeComponent'],
{
  widgetEventPrefix : "oj",
  options: 
  {
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     *
     * @property {Object} ui event payload
     * @property {string} ui.viewportStart the start of the new viewport on a gantt chart
     * @property {string} ui.viewportEnd the end of the new viewport on a gantt chart
     * @property {string} ui.majorAxisScale the time scale of the majorAxis
     * @property {string} ui.minorAxisScale the time scale of the minorAxis
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">viewportChange</code> callback specified:</caption>
     * $(".selector").ojGantt({
     *   "viewportChange": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojviewportchange</code> event:</caption>
     * $(".selector").on("ojviewportchange", function(event, ui){});
     *
     * @expose
     * @event
     * @memberof oj.ojGantt
     * @instance
     */
    viewportChange: null
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) 
  {
    context['styleClasses'] = this._getComponentStyleMap();
    return dvt.Gantt.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() 
  {
    var styleClasses = this._super();
    styleClasses.push('oj-gantt');
    return styleClasses;
  },

  /**
   * @private
   */
  _getComponentStyleMap: function()
  {
    var map = new Object();
    map["databody"] = "oj-gantt-container";
    map['dependencyLine'] = "oj-gantt-dependency-line";
    map['dependencyLineConnector'] = "oj-gantt-dependency-line-connector";
    map["nodata"] = "oj-gantt-no-data-message";
    map["hgridline"] = "oj-gantt-horizontal-gridline";
    map["vgridline"] = "oj-gantt-vertical-gridline";
    map["majorAxis"] = "oj-gantt-major-axis";
    map["majorAxisTicks"] = "oj-gantt-major-axis-separator";
    map["majorAxisLabels"] = "oj-gantt-major-axis-label";
    map["minorAxis"] = "oj-gantt-minor-axis";
    map["minorAxisTicks"] = "oj-gantt-minor-axis-separator";
    map["minorAxisLabels"] = "oj-gantt-minor-axis-label";
    map['row'] = "oj-gantt-row";
    map['rowLabel'] = "oj-gantt-row-label";
    map['task'] = "oj-gantt-task";
    map['taskLabel'] = "oj-gantt-task-label";
    map['tooltipLabel'] = "oj-gantt-tooltip-label";
    map['tooltipValue'] = "oj-gantt-tooltip-value";
    map['tooltipTable'] = "oj-gantt-tooltip-content";
    map['referenceObject'] = "oj-gantt-reference-object";
    map['selected'] = "oj-selected";
    map['hover'] = "oj-hover";
    map['focus'] = "oj-focus";

    return map;
  },

  /**
   * @override
   * @instance
   * @memberof oj.ojGantt
   * @protected
   */
  _ConvertLocatorToSubId : function(locator) 
  {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-gantt-taskbar') 
    {
      // taskbar[rowIndex][index]
      subId = 'taskbar[' + locator['rowIndex'] + '][' + locator['index'] + ']';
    }
    else if (subId == 'oj-gantt-row-label')
    {
      // rowLabel[rowIndex]
      subId = 'rowLabel[' + locator['index'] + ']';
    }
    else if (subId == 'oj-gantt-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized.
    return subId;
  },

  /**
   * @override
   * @instance
   * @memberof oj.ojGantt
   * @protected
   */
  _ConvertSubIdToLocator : function(subId) 
  {
    var locator = {};

    if (subId.indexOf('taskbar') == 0) 
    {
      // taskbar[rowIndex][index]
      var indexPath = this._GetIndexPath(subId);

      locator['subId'] = 'oj-gantt-taskbar';
      locator['rowIndex'] = indexPath[0];
      locator['index'] = indexPath[1];
    }
    else if (subId.indexOf('rowLabel') == 0)
    {
      // rowLabel[rowIndex]
      var indexPath = this._GetIndexPath(subId);

      locator['subId'] = 'oj-gantt-row-label';
      locator['index'] = indexPath[0];
    }
    else if (subId == 'tooltip') {
      locator['subId'] = 'oj-gantt-tooltip';
    }

    return locator;
  },

  //** @inheritdoc */
  _GetChildStyleClasses: function()
  {
    var styleClasses = this._super();

    // animation duration
    styleClasses['oj-gantt'] = {'path': '_resources/animationDuration', 'property': 'animation-duration'};

    // Zoom Control Icons
    styleClasses['oj-gantt-zoomin-icon'] = [
      {'path': '_resources/zoomIn_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomin-icon oj-hover'] = [
      {'path': '_resources/zoomIn_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomin-icon oj-active'] = [
      {'path': '_resources/zoomIn_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomin-icon oj-disabled'] = [
      {'path': '_resources/zoomIn_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_d_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon'] = [
      {'path': '_resources/zoomOut_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon oj-hover'] = [
      {'path': '_resources/zoomOut_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon oj-active'] = [
      {'path': '_resources/zoomOut_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon oj-disabled'] = [
      {'path': '_resources/zoomOut_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_d_bc', 'property': 'border-color'}
    ];

    // Axes labels
    styleClasses['oj-gantt-major-axis-label'] = {'path': '_resources/majorAxisLabelFontProp', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-gantt-minor-axis-label'] = {'path': '_resources/minorAxisLabelFontProp', 'property': 'CSS_TEXT_PROPERTIES'};

    // chart border
    styleClasses['oj-gantt-container'] = {'path': '_resources/chartArea/strokeWidth', 'property': 'stroke-width'};

    // horizontal gridline width
    styleClasses['oj-gantt-horizontal-gridline'] = {'path': '_resources/horizontalGridlineWidth', 'property': 'stroke-width'};

    // task label properties
    styleClasses['oj-gantt-task-label'] = {'path': '_resources/taskLabelFontProp', 'property': 'CSS_TEXT_PROPERTIES'};

    // row label properties
    styleClasses['oj-gantt-row-label'] = {'path': '_resources/rowLabelFontProp', 'property': 'CSS_TEXT_PROPERTIES'};

    return styleClasses;
  },

  //** @inheritdoc */
  _GetTranslationMap: function() 
  {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.GANTT'] = translations['componentName'];
    ret['DvtUtilBundle.ZOOM_IN'] = translations['tooltipZoomIn'];
    ret['DvtUtilBundle.ZOOM_OUT'] = translations['tooltipZoomOut'];

    return ret;
  },

  //** @inheritdoc */
  _LoadResources: function() {
    this._super();

    var resources = this.options['_resources'];

    // zoom control icon images
    resources['zoomIn'] = 'oj-gantt-zoomin-icon';
    resources['zoomIn_h'] = 'oj-gantt-zoomin-icon oj-hover';
    resources['zoomIn_a'] = 'oj-gantt-zoomin-icon oj-active';
    resources['zoomIn_d'] = 'oj-gantt-zoomin-icon oj-disabled';
    resources['zoomOut'] = 'oj-gantt-zoomout-icon';
    resources['zoomOut_h'] = 'oj-gantt-zoomout-icon oj-hover';
    resources['zoomOut_a'] = 'oj-gantt-zoomout-icon oj-active';
    resources['zoomOut_d'] = 'oj-gantt-zoomout-icon oj-disabled';
  },

  //** @inheritdoc */
  _HandleEvent: function(event)
  {
    var type = event['type'];
    if(type === 'viewportChange')
    {
      var viewportStart = new Date(event['viewportStart']).toISOString();
      var viewportEnd = new Date(event['viewportEnd']).toISOString();
      var majorAxisScale = event['majorAxisScale'];
      var minorAxisScale = event['minorAxisScale'];
      var viewportChangePayload = {
        'viewportStart': viewportStart,
        'viewportEnd': viewportEnd,
        'majorAxisScale': majorAxisScale,
        'minorAxisScale': minorAxisScale
      };

      this._UserOptionChange('viewportStart', viewportStart);
      this._UserOptionChange('viewportEnd', viewportEnd);
      this._UserOptionChange('majorAxis.scale', majorAxisScale);
      this._UserOptionChange('minorAxis.scale', minorAxisScale);
      this._trigger('viewportChange', null, viewportChangePayload);
    }
    else
    {
      this._super(event);
    }
  },

  //** @inheritdoc */
  _GetComponentNoClonePaths: function() {
    var noClonePaths = this._super();

    // Date time options as of 3.0.0 only support number and string types
    // e.g. Date object type is not supported. However,
    // during the options cloning,
    // Date objects are automatically converted to number by default.
    // We want to specify that they are to remain Date objects so that
    // we can handle them in our code later on. Note that data paths are not
    // cloned (see _GetComponentDeferredDataPaths)
    noClonePaths['start'] = true;
    noClonePaths['end'] = true;
    noClonePaths['viewportStart'] = true;
    noClonePaths['viewportEnd'] = true;
    noClonePaths['referenceObjects'] = {'value': true};
    return noClonePaths;
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['rows', 'dependencies']};
  },

  /**
   * {@ojinclude "name":"nodeContextDoc"}
   * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
   * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
   *
   * @example {@ojinclude "name":"nodeContextExample"}
   *
   * @expose
   * @instance
   * @memberof oj.ojGantt
   */
  getContextByNode: function(node)
  {
    // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context['subId'] !== 'oj-gantt-tooltip')
        return context;

      return null;
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
 *    <tr>
 *       <td rowspan="3">Task bar</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="3">Chart Area</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Paning: navigate forward and backward in time in horizontal/vertical orientation.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Pinch-close</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Spread-open</kbd></td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Zoom Control</td>
 *       <td><kbd>Tap on "+" element</kbd></td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tap on "-" element</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojGantt
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
 *       <td><kbd>= or +</kbd></td>
 *       <td>Zoom in one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>- or _</kbd></td>
 *       <td>Zoom out one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>PageUp or PageDown</kbd></td>
 *       <td>Pan up / down.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + PageUp or PageDown</kbd></td>
 *       <td>Pan left/right (RTL: Pan right/left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to the task bar on the left within the same row.  In LTR reading direction, if this is the first task within the row, then move focus and selection to the last task bar in the previous row. In RTL reading direction, if this is the last task within the row, then move focus and selection to the first task bar in the next row.
 *           <br>When focus is on a dependency line, move focus to the predecessor task bar (RTL: successor task bar).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to the task bar on the right within the same row.  In LTR reading direction, if this is the last task within the row, then move focus and selection to the first task bar in the next row. In RTL reading direction, if this is the first task within the row, then move focus and selection to the last task bar in the previous row.
 *           <br>When focus is on a dependency line, move focus to the successor task bar (RTL: predecessor task bar).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to first task bar in the previous row.
 *           <br>When focus is on a dependency line, move focus to the previous dependency line with the same
 *           predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to first task bar in the next row.
 *           <br>When focus is on a dependency line, move focus to the next dependency line with the same
 *           predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Multi-select task bar with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + &lt;task bar navigation shortcut&gt;</kbd></td>
 *       <td>Move focus and multi-select a task bar.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + &lt;task bar navigation shortcut&gt;</kbd></td>
 *       <td>Move focus to a task bar but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &lt;</kbd></td>
 *       <td>Move focus from a task bar to an associated dependency line connecting to a predecessor task (RTL: successor task). Note that the dependency line must have been 
 *        created referencing the task's ID in its predecessor/successorTask objects for an association to exist.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &gt;</kbd></td>
 *       <td>Move focus from a task bar to an associated dependency line connecting to a successor task (RTL: predecessor task). Note that the dependency line must have been 
 *        created referencing the task's ID in its predecessor/successorTask objects for an association to exist.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Mousewheel Up</kbd></td>
 *       <td>Zoom In.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Mousewheel Down</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojGantt
 */

/**
 *<p>The Gantt supports a simplified version of the ISO 8601 extended date/time format. The format is as follows: <font color="#4B8A08">YYYY-MM-DDTHH:mm:ss.sssZ</font></p>
 *<table  class="keyboard-table">
 *<thead>
 *<tr>
 *<th>Symbol</th>
 *<th>Description</th>
 *<th>Values</th>
 *<th>Examples</th>
 *</tr>
 *</thead>
 *<tbody>
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
 * @memberof oj.ojGantt
 */

/**
 *<p>The application is responsible for populating the <code class="prettyprint">aria-label</code> attribute on the component element, and the <code class="prettyprint">shortDesc</code> value in the component options object with meaningful descriptors when the component does not provide a default descriptor. Meaningful descriptors may include information on non-interactive elements such as reference objects to ensure its description is read out by screenreaders. Since component terminology for keyboard and touch shortcuts can conflict with those of the application, it is the application's responsibility to provide these shortcuts, possibly via a help popup.</p>
 *
 * @ojfragment a11yDoc
 * @memberof oj.ojGantt
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for Gantt task bar at a specified index.</p>
 *
 * @property {number} rowIndex
 * @property {number} index
 *
 * @ojsubid oj-gantt-taskbar
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the second task bar of the first row:</caption>
 * var nodes = $( ".selector" ).ojGantt( "getNodeBySubId", {'subId': 'oj-gantt-taskbar', 'rowIndex': 0, 'index': 1} );
 */

 /**
 * <p>Sub-ID for Gantt row label at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-gantt-row-label
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the label of the first row:</caption>
 * var nodes = $( ".selector" ).ojGantt( "getNodeBySubId", {'subId': 'oj-gantt-row-label', 'index': 0} );
 */

 /**
 * <p>Sub-ID for the the Gantt tooltip.</p>
 *
 * @ojsubid oj-gantt-tooltip
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the tooltip object of the gantt, if displayed:</caption>
 * var nodes = $( ".selector" ).ojGantt( "getNodeBySubId", {'subId': 'oj-gantt-tooltip'} );
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for Gantt task bar at a specified index.</p>
 *
 * @property {number} rowIndex
 * @property {number} index
 *
 * @ojnodecontext oj-gantt-taskbar
 * @memberof oj.ojGantt
 */

/**
 * <p>Context for Gantt row label at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-gantt-row-label
 * @memberof oj.ojGantt
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *   <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li>
 *   <li>data: The data object of the hovered task.</li> 
 *   <li>rowData: The data for the row the hovered task belongs to.</li>
 *   <li>component: The widget constructor for the chart. The 'component' is bound to the associated jQuery element so that it can be called directly as a function. 
 *   <li>color: The color of the hovered task.</li> 
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojGantt
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojGanttMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "none"]
    },
    "axisPosition": {
      "type": "string",
      "enumValues": ["bottom", "top"]
    },
    "dependencies": {
      "type": "Array<object>"
    },
    "end": {
      "type": "string"
    },
    "gridlines": {
      "type": "object",
      "properties": {
        "horizontal": {
          "type": "string",
          "enumValues": ["hidden", "visible", "auto"]
        },
        "vertical": {
          "type": "string",
          "enumValues": ["hidden", "visible", "auto"]
        }
      }
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
        "zoomOrder": {
          "type": "Array<string>"
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
        "zoomOrder": {
          "type": "Array<string>"
        }
      }
    },
    "referenceObjects": {
      "type": "Array<object>"
    },
    "rowAxis": {
      "type": "object",
      "properties": {
        "maxWidth": {
          "type": "string"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off"]
        }
      }
    },
    "rows": {
      "type": "Array<object>"
    },
    "selection": {
      "type": "Array<string>"
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["single", "multiple", "none"]
    },
    "start": {
      "type": "string"
    },
    "taskDefaults": {
      "type": "object",
      "properties": {
        "borderRadius": {
          "type": "string"
        },
        "height": {
          "type": "number"
        },
        "labelPosition": {
          "type": "string",
          "enumValues": ["single", "innerCenter", "innerStart", "innerEnd", "none", "end"]
        }
      }
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "translations": {
      "type": "object",
      "properties": {
        "accessibleDependencyInfo": {
          "type": "string"
        },
        "accessibleDurationDays": {
          "type": "string"
        },
        "accessibleDurationHours": {
          "type": "string"
        },
        "accessibleMilestoneInfo": {
          "type": "string"
        },
        "accessiblePredecessorInfo": {
          "type": "string"
        },
        "accessibleRowInfo": {
          "type": "string"
        },
        "accessibleSuccessorInfo": {
          "type": "string"
        },
        "accessibleTaskInfo": {
          "type": "string"
        },
        "componentName": {
          "type": "string"
        },
        "finishFinishDependencyAriaDesc": {
          "type": "string"
        },
        "finishStartDependencyAriaDesc": {
          "type": "string"
        },
        "labelEnd": {
          "type": "string"
        },
        "labelLabel": {
          "type": "string"
        },
        "labelRow": {
          "type": "string"
        },
        "labelStart": {
          "type": "string"
        },
        "startFinishDependencyAriaDesc": {
          "type": "string"
        },
        "startStartDependencyAriaDesc": {
          "type": "string"
        },
        "tooltipZoomIn": {
          "type": "string"
        },
        "tooltipZoomOut": {
          "type": "string"
        }
      }
    },
    "valueFormats": {
      "type": "object",
      "properties": {
        "row": {
          "type": "object",
          "properties": {
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "start": {
          "type": "object",
          "properties": {
            "converter": {},
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "end": {
          "type": "object",
          "properties": {
            "converter": {},
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "label": {
          "type": "object",
          "properties": {
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
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
    _WIDGET_NAME: "ojGantt"
  }
};
oj.CustomElementBridge.registerMetadata('oj-gantt', 'dvtTimeComponent', ojGanttMeta);
oj.CustomElementBridge.register('oj-gantt', {'metadata': oj.CustomElementBridge.getMetadata('oj-gantt')});
})();
});
