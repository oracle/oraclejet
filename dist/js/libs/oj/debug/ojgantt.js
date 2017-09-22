/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtGantt'], function(oj, $, comp, base, dvt)
{

/**
 * Copyright (c) 2016, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojGantt
 * @augments oj.dvtTimeComponent
 * @since 2.1.0
 * @ojstatus preview
 *
 * @classdesc
 * <h3 id="GanttOverview-section">
 *   JET Gantt
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#GanttOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Gantt is a themable, WAI-ARIA compliant element that illustrates the start and finish dates of tasks.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-gantt
 *   start='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Jan 1, 2016"))}}'
 *   end='{{oj.IntlConverterUtils.dateToLocalIso(new Date("Dec 31, 2016"))}}'
 *   major-axis='{"scale": "months"}'
 *   minor-axis='{"scale": "weeks"}'
 *   rows='{{data}}'>
 * &lt;/oj-gantt>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"a11yKeyboard"}
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
 *    can cause severe performance degradation when interacting with the element
 *    (scrolling and zooming) regardless of the number of task bars present.
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojGantt', $['oj']['dvtTimeComponent'],
{
  widgetEventPrefix : "oj",
  options: 
  {
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     *
     * @property {string} viewportStart the start of the new viewport on a gantt chart
     * @property {string} viewportEnd the end of the new viewport on a gantt chart
     * @property {string} majorAxisScale the time scale of the majorAxis
     * @property {string} minorAxisScale the time scale of the minorAxis
     *
     * @expose
     * @event
     * @memberof oj.ojGantt
     * @instance
     */
    viewportChange: null
  },

  // @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) 
  {
    context['styleClasses'] = this._getComponentStyleMap();
    return dvt.Gantt.newInstance(context, callback, callbackObj);
  },

  // @inheritdoc */
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
    map['taskBar'] = "oj-gantt-task-bar";
    map['taskMilestone'] = "oj-gantt-task-milestone";
    map['baseline'] = "oj-gantt-baseline";
    map['baselineBar'] = "oj-gantt-baseline-bar"
    map['baselineMilestone'] = "oj-gantt-baseline-milestone";
    map['taskLabel'] = "oj-gantt-task-label";
    map['taskProgress'] = "oj-gantt-task-progress";
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

  // @inheritdoc */
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

  // @inheritdoc */
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

  // @inheritdoc */
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

    // progress value converter for task tooltip
    var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
    resources['percentConverter'] = converterFactory.createConverter({style: 'percent'})
  },

  //** @inheritdoc */
  _ProcessOptions: function() {
    this._super();

    // taskDefaults.labelPosition takes in Array<string>|string, and for custom elements
    // we want the getter to always return Array<string>, so perform the conversion here.
    // NOTE: rows[].tasks[].labelPosition also takes Array<string>|string, and getter
    // should return Array<string> for custom elements. The conversion is done in 
    // _RenderComponent; see comments there for reasons for doing it there.
    var taskDefaults = this.options['taskDefaults'];
    var labelPosition = taskDefaults ? taskDefaults['labelPosition'] : null;
    if (this._IsCustomElement() && labelPosition && typeof labelPosition === 'string')
      this.options['taskDefaults']['labelPosition'] = [labelPosition];
  },

  //** @inheritdoc */
  _RenderComponent : function(options, isResize) {
    // rows[].tasks[].labelPosition takes Array<string>|string, and getter
    // should return Array<string> for custom elements. The conversion needs to be done here
    // instead of in _ProcessOptions because:
    // 1. rows may be a Promise, in which case we need to be able to access the array it resolves to.
    //    The Promise is definitely resolved at this point.
    // 2. rows is not copied (see _GetComponentDeferredDataPaths, _GetComponentNoClonePaths), and so 
    //    the array reference in options here is the same as that of this.options['rows']
    // 3. Since we're gauranteed to have the reference to the correct array right before component render,
    //    we can do the conversion here.
    var rows = options ? options['rows'] : null;
    if (this._IsCustomElement() && rows)
    {
      for (var i = 0; i < rows.length; i++)
      {
        var tasks = rows[i]['tasks'];
        if (tasks)
        {
          for (var j = 0; j < tasks.length; j++)
          {
            var labelPosition = tasks[j]['labelPosition'];
            if (labelPosition && typeof labelPosition === 'string')
            {
              options['rows'][i]['tasks'][j]['labelPosition'] = [labelPosition];
            }
          }
        }
      }
    }
    
    this._super(options, isResize);
  },

  // @inheritdoc */
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

  // @inheritdoc */
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

  // @inheritdoc */
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
 *       <td rowspan="3">Task</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selection-mode</code> is enabled.</td>
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
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
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
 *       <td>When focus is on a task, move focus and selection to the task on the left within the same row.  In LTR reading direction, if this is the first task within the row, then move focus and selection to the last task in the previous row. In RTL reading direction, if this is the last task within the row, then move focus and selection to the first task in the next row.
 *           <br>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the predecessor task (RTL: successor task).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>When focus is on a task, move focus and selection to the task on the right within the same row.  In LTR reading direction, if this is the last task within the row, then move focus and selection to the first task in the next row. In RTL reading direction, if this is the first task within the row, then move focus and selection to the last task in the previous row.
 *           <br>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the successor task (RTL: predecessor task).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>When focus is on a task, move focus and selection to first task in the previous row.
 *           <br>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the previous dependency line with the same
 *           predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>When focus is on a task, move focus and selection to first task in the next row.
 *           <br>When focus is on a dependency line (see <kbd>Alt + &lt;</kbd> and <kbd>Alt + &gt;</kbd>), move focus to the next dependency line with the same
 *           predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Multi-select task with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + &lt;task navigation shortcut&gt;</kbd></td>
 *       <td>Move focus and multi-select a task.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + &lt;task navigation shortcut&gt;</kbd></td>
 *       <td>Move focus to a task but do not select.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &lt;</kbd></td>
 *       <td>Move focus from a task to an associated dependency line connecting to a predecessor task (RTL: successor task). Note that the dependency line must have been 
 *        created referencing the task's ID in its predecessor/successorTask objects for an association to exist. Also note that when focus is on a dependency line, the <kbd>UpArrow</kbd> and <kbd>DownArrow</kbd> keys are used to move focus to the next dependency line with the same predecessor/successor.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &gt;</kbd></td>
 *       <td>Move focus from a task to an associated dependency line connecting to a successor task (RTL: predecessor task). Note that the dependency line must have been 
 *        created referencing the task's ID in its predecessor/successorTask objects for an association to exist. Also note that when focus is on a dependency line, the <kbd>UpArrow</kbd> and <kbd>DownArrow</kbd> keys are used to move focus to the next dependency line with the same predecessor/successor.</td>
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
 * The position of the major and minor axis.
 * @expose
 * @name axisPosition
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "top"
 * @default <code class="prettyprint">"top"</code>
 */
/**
 * Defines the animation that is applied on data changes.
 * @expose
 * @name animationOnDataChange
 * @memberof oj.ojGantt
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
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "auto"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * An array of objects that defines dependencies between tasks. Also accepts a Promise that will resolve with an array for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name dependencies
 * @memberof oj.ojGantt
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the dependency line. This must be unique across all dependency lines in Gantt.
 * @expose
 * @name dependencies[].id
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the predecessor task. This must reference a task in Gantt.
 * @expose
 * @name dependencies[].predecessorTaskId
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The description of the dependency line. This is used for accessibility.
 * @expose
 * @name dependencies[].shortDesc
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the successor task. This must reference a task in Gantt.
 * @expose
 * @name dependencies[].successorTaskId
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of class name set on the dependency line.
 * @expose
 * @name dependencies[].svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the dependency line.
 * @expose
 * @name dependencies[].svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 *  The type of dependency. The following values are supported: <ul> <li>finishStart: predecessor task must finish before successor task can start.</li> <li>finishFinish: predecessor task must finish before successor task can finish.</li> <li>startStart: predecessor task must start before successor task can start.</li> <li>startFinish: predecessor task must start before successor task can finish.</li> </ul> 
 * @expose
 * @name dependencies[].type
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "startStart"
 * @ojvalue {string} "startFinish"
 * @ojvalue {string} "finishFinish"
 * @ojvalue {string} "finishStart"
 * @default <code class="prettyprint">"finishStart"</code>
 */
/**
 * The end time of the Gantt. This is required in order for the Gantt to properly render. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name end
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Display or hide the horizontal or vertical grid lines. The default value is "auto", which means Gantt will decide whether the grid lines should be made visible or hidden.
 * @expose
 * @name gridlines
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Horizontal gridlines.
 * @expose
 * @name gridlines.horizontal
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "hidden"
 * @ojvalue {string} "visible"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Vertical gridlines.
 * @expose
 * @name gridlines.vertical
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "hidden"
 * @ojvalue {string} "visible"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * An object with the following properties, used to define the minor time axis. This is required in order for the Gantt to properly render.
 * @expose
 * @name minorAxis
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the labels of the minor axis. If not specified, the default converter is used. If a single converter is specified, it will be used for all 'scale' values. Otherwise, an object whose keys are 'scale' values that map to the converter instances is expected. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to use for all 'scale' values that do not otherwise have a converter object provided. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.default
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'seconds' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.seconds
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'minutes' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.minutes
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'hours' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.hours
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'days' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.days
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'weeks' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.weeks
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'months' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.months
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'quarters' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.quarters
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'years' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name minorAxis.converter.years
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The time scale used for the minor axis. This is required in order for the Gantt to properly render.
 * @expose
 * @name minorAxis.scale
 * @memberof! oj.ojGantt
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
 * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
 * @expose
 * @name minorAxis.zoomOrder
 * @memberof! oj.ojGantt
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define the major time axis. If not specified, no major time axis is shown.
 * @expose
 * @name majorAxis
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the labels of the major axis. If not specified, the default converter is used. If a single converter is specified, it will be used for all 'scale' values. Otherwise, an object whose keys are 'scale' values that map to the converter instances is expected. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The default converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) to use for all 'scale' values that do not otherwise have a converter object provided. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.default
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'seconds' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.seconds
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'minutes' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.minutes
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'hours' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.hours
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'days' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.days
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'weeks' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.weeks
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'months' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.months
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'quarters' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.quarters
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used for the 'years' scale. If not specified, the default converter will be used for this scale. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name majorAxis.converter.years
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The time scale used for the major axis.
 * @expose
 * @name majorAxis.scale
 * @memberof! oj.ojGantt
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
 * An array of strings containing the names of scales used for zooming from longest to shortest. If not specified, the 'scale' specified on the axis will be used at all zoom levels.
 * @expose
 * @name majorAxis.zoomOrder
 * @memberof! oj.ojGantt
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The array of reference objects associated with the gantt. For each reference object, a line is rendered at the specified value. Currently only the first reference object in the array is supported. Any additional objects supplied in the array will be ignored.
 * @expose
 * @name referenceObjects
 * @memberof oj.ojGantt
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes defining the style of the reference object. Note that only CSS style applicable to SVG elements can be used.
 * @expose
 * @name referenceObjects[].svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the reference object.
 * @expose
 * @name referenceObjects[].svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The time value of this reference object. If not specified, no reference object will be shown. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name referenceObjects[].value
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object defining properties for the row labels region.
 * @expose
 * @name rowAxis
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether row labels are rendered.
 * @expose
 * @name rowAxis.rendered
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * Defines the maximum width of the region in pixels (e.g. '50px') or percent (e.g. '15%') of the element width. If 'none' is specified, then the width has no maximum value. Labels will truncate to fit.
 * @expose
 * @name rowAxis.maxWidth
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties, used to define rows and tasks within rows. Also accepts a Promise that will resolve with an array for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name rows
 * @memberof oj.ojGantt
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the row. Optional if the row contains only one task. This must be unique across all rows in Gantt.
 * @expose
 * @name rows[].id
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The label associated with the row.
 * @expose
 * @name rows[].label
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the label. Only CSS style applicable to SVG elements can be used.
 * @expose
 * @name rows[].labelStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties, used to define a task. If not specified, no data will be shown. When only one of 'start' or 'end' value is specified, or when 'start' and 'end' values are equal, the task is considered a milestone task.
 * @expose
 * @name rows[].tasks
 * @memberof! oj.ojGantt
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of the task. Accepts values allowed in CSS border-radius attribute.
 * @expose
 * @name rows[].tasks[].borderRadius
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The end time of this task. Optional if task is a single date event like Milestone. Either start or end has to be defined in order for the task to properly render. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name rows[].tasks[].end
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of the task in pixel.
 * @expose
 * @name rows[].tasks[].height
 * @memberof! oj.ojGantt
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The identifier for the task. This must be unique across all tasks in the Gantt, and is required in order for the Gantt to properly render.
 * @expose
 * @name rows[].tasks[].id
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The label associated with the task.
 * @expose
 * @name rows[].tasks[].label
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The position of the label relative to the task. An array of values is also supported. If an array is specified, then the values are traversed until a position that can fully display the label is found. If 'max' is specified in the array, then of all the positions evaluated up to that point of the traversal, the one with the largest space is used (label is truncated to fit). Naturally, 'max' is ignored if it's specified as the first value of the array. If the last value of the array is reached, but the label cannot be fully displayed, then the label is placed at that position, truncated to fit. Due to space constraints in the milestone and task with progress cases, the inner positions will exhibit the following behaviors: <ul> <li> For milestones, specifying 'innerStart', 'innerEnd', or 'innerCenter' would be equivalent to specifying 'start', 'end', and 'end' respectively. </li> <li> For tasks with progress, 'innerCenter' means the label will be aligned to the end of the progress bar, either placed inside or outside of the progress, whichever is the larger space. 'innerStart' and 'innerEnd' positions are honored when there is enough space to show the label at those positions. Otherwise, the aforementioned 'innerCenter' behavior is exhibited. </li> </ul>
 * @expose
 * @name rows[].tasks[].labelPosition
 * @memberof! oj.ojGantt
 * @instance
 * @type {string|Array.<string>}
 * @ojvalue {string} "start"
 * @ojvalue {string} "innerCenter"
 * @ojvalue {string} "innerStart"
 * @ojvalue {string} "innerEnd"
 * @ojvalue {string} "end"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">["end", "innerCenter", "start", "max"]</code>
 */
/**
 * The CSS style defining the style of the label. Only CSS style applicable to SVG elements can be used.
 * @expose
 * @name rows[].tasks[].labelStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of this task. Optional if task is a single date event like Milestone. Either start or end has to be defined in order for the task to properly render. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name rows[].tasks[].start
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The description of the task. This is used for accessibility and for customizing the tooltip text.
 * @expose
 * @name rows[].tasks[].shortDesc
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes defining the style of the task.
 * @expose
 * @name rows[].tasks[].svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the task.
 * @expose
 * @name rows[].tasks[].svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies the progress of the task. This property is ignored if the task is a milestone.
 * @expose
 * @name rows[].tasks[].progress
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of the progress bar. Accepts values allowed in CSS border-radius attribute.
 * @expose
 * @name rows[].tasks[].progress.borderRadius
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies the height of the progress bar in pixels (e.g. '50px') or percent of the associated task bar (e.g. '15%').
 * @expose
 * @name rows[].tasks[].progress.height
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes to apply to the progress bar. Note that only CSS style applicable to SVG elements can be used.
 * @expose
 * @name rows[].tasks[].progress.svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS inline style to apply to the progress bar. Only CSS style applicable to SVG elements can be used.
 * @expose
 * @name rows[].tasks[].progress.svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The value of the progress between 0 and 1 inclusive. If not specified or invalid, no progress will be shown.
 * @expose
 * @name rows[].tasks[].progress.value
 * @memberof! oj.ojGantt
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies the baseline of the task. When only one of 'start' or 'end' value is specified, or when 'start' and 'end' values are equal, the baseline is considered a milestone baseline.
 * @expose
 * @name rows[].tasks[].baseline
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of the baseline. Accepts values allowed in CSS border-radius attribute.
 * @expose
 * @name rows[].tasks[].baseline.borderRadius
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The end time of the baseline. Optional if baseline is a milestone. Either start or end has to be defined in order for the baseline to properly render. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name rows[].tasks[].baseline.end
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of the baseline in pixel.
 * @expose
 * @name rows[].tasks[].baseline.height
 * @memberof! oj.ojGantt
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of the baseline. Optional if baseline is a milestone. Either start or end has to be defined in order for the baseline to properly render. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name rows[].tasks[].baseline.start
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes defining the style of the baseline.
 * @expose
 * @name rows[].tasks[].baseline.svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the baseline.
 * @expose
 * @name rows[].tasks[].baseline.svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of strings containing the ids of the initially selected tasks.
 * @expose
 * @name selection
 * @memberof oj.ojGantt
 * @instance
 * @type {Array.<string>}
 * @ojwriteback
 * @default <code class="prettyprint">null</code>
 */
/**
 * The type of selection behavior that is enabled on the Gantt. If 'single' is specified, only a single task can be selected at once. If 'multiple', any number of tasks can be selected at once. Otherwise, selection is disabled.
 * @expose
 * @name selectionMode
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "single"
 * @ojvalue {string} "multiple"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The start time of the Gantt. This is required in order for the Gantt to properly render. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name start
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define default styling for tasks in the Gantt.
 * @expose
 * @name taskDefaults
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of the task. Accepts values allowed in CSS border-radius attribute.
 * @expose
 * @name taskDefaults.borderRadius
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The position of the label relative to the task. An array of values is also supported. If an array is specified, then the values are traversed until a position that can fully display the label is found. If 'max' is specified in the array, then of all the positions evaluated up to that point of the traversal, the one with the largest space is used (label is truncated to fit). Naturally, 'max' is ignored if it's specified as the first value of the array. If the last value of the array is reached, but the label cannot be fully displayed, then the label is placed at that position, truncated to fit. Due to space constraints in the milestone and task with progress cases, the inner positions will exhibit the following behaviors: <ul> <li> For milestones, specifying 'innerStart', 'innerEnd', or 'innerCenter' would be equivalent to specifying 'start', 'end', and 'end' respectively. </li> <li> For tasks with progress, 'innerCenter' means the label will be aligned to the end of the progress bar, either placed inside or outside of the progress, whichever is the larger space. 'innerStart' and 'innerEnd' positions are honored when there is enough space to show the label at those positions. Otherwise, the aforementioned 'innerCenter' behavior is exhibited. </li> </ul>
 * @expose
 * @name taskDefaults.labelPosition
 * @memberof! oj.ojGantt
 * @instance
 * @type {string|Array.<string>}
 * @ojvalue {string} "start"
 * @ojvalue {string} "innerCenter"
 * @ojvalue {string} "innerStart"
 * @ojvalue {string} "innerEnd"
 * @ojvalue {string} "end"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">["end", "innerCenter", "start", "max"]</code>
 */
/**
 * The height of the task in pixel.
 * @expose
 * @name taskDefaults.height
 * @memberof! oj.ojGantt
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes defining the style of the task.
 * @expose
 * @name taskDefaults.svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the task.
 * @expose
 * @name taskDefaults.svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define default styling for progress bars on non-milestone tasks.
 * @expose
 * @name taskDefaults.progress
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of the progress bar. Accepts values allowed in CSS border-radius attribute.
 * @expose
 * @name taskDefaults.progress.borderRadius
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies the height of the progress bar in pixels (e.g. '50px') or percent of the associated task bar (e.g. '15%').
 * @expose
 * @name taskDefaults.progress.height
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes to apply to the progress bar. Note that only CSS style applicable to SVG elements can be used.
 * @expose
 * @name taskDefaults.progress.svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS inline style to apply to the progress bar. Only CSS style applicable to SVG elements can be used.
 * @expose
 * @name taskDefaults.progress.svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object with the following properties, used to define default styling for task baseline elements.
 * @expose
 * @name taskDefaults.baseline
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border radius of the baseline. Accepts values allowed in CSS border-radius attribute.
 * @expose
 * @name taskDefaults.baseline.borderRadius
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of the baseline in pixel.
 * @expose
 * @name taskDefaults.baseline.height
 * @memberof! oj.ojGantt
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A space delimited list of CSS style classes defining the style of the baseline.
 * @expose
 * @name taskDefaults.baseline.svgClassName
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style defining the style of the baseline.
 * @expose
 * @name taskDefaults.baseline.svgStyle
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 *  An object containing an optional callback function for tooltip customization. 
 * @expose
 * @name tooltip
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 *  A function that returns a custom tooltip. The function takes a dataContext argument, 
 *  provided by the gantt, with the following properties: 
 *  <ul>
 *     <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li>
 *     <li>data: The data object of the hovered task.</li>
 *     <li>rowData: The data for the row the hovered task belongs to.</li>
 *     <li>componentElement: The gantt element.</li>
 *     <li>color: The color of the hovered task.</li>
 *   </ul>
 *  The function should return an Object that contains only one of the two properties:
 *  <ul>
 *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
 *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
 *  </ul>
 * @expose
 * @name tooltip.renderer
 * @memberof! oj.ojGantt
 * @instance
 * @type {function(object)}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An object specifying value formatting and tooltip behavior, whose keys generally correspond to task properties.
 * @expose
 * @name valueFormats
 * @memberof oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Specifies tooltip behavior for the row value.
 * @expose
 * @name valueFormats.row
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.row.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.row.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the start value.
 * @expose
 * @name valueFormats.start
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name valueFormats.start.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.start.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.start.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the end value.
 * @expose
 * @name valueFormats.end
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name valueFormats.end.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.end.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.end.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the date value of a milestone task.
 * @expose
 * @name valueFormats.date
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name valueFormats.date.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.date.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.date.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the label value.
 * @expose
 * @name valueFormats.label
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.label.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.label.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the progress value.
 * @expose
 * @name valueFormats.progress
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.NumberConverterFactory.html">oj.NumberConverterFactory</a> for details on creating built-in number converters.
 * @expose
 * @name valueFormats.progress.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.progress.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.progress.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the start value of the baseline.
 * @expose
 * @name valueFormats.baselineStart
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name valueFormats.baselineStart.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.baselineStart.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.baselineStart.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the end value of the baseline.
 * @expose
 * @name valueFormats.baselineEnd
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name valueFormats.baselineEnd.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.baselineEnd.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.baselineEnd.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * Specifies tooltip behavior for the date value of the milestone baseline.
 * @expose
 * @name valueFormats.baselineDate
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The converter (an object literal or instance that duck types <a href="oj.Converter.html">oj.Converter</a>) used to format the label. See <a href="oj.DateTimeConverterFactory.html">oj.DateTimeConverterFactory</a> for details on creating built-in datetime converters.
 * @expose
 * @name valueFormats.baselineDate.converter
 * @memberof! oj.ojGantt
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * A string representing the label that is displayed before the value in the tooltip.
 * @expose
 * @name valueFormats.baselineDate.tooltipLabel
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the value is displayed in the tooltip.
 * @expose
 * @name valueFormats.baselineDate.tooltipDisplay
 * @memberof! oj.ojGantt
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default <code class="prettyprint">"auto"</code>
 */
/**
 * The end time of the Gantt's viewport. If not specified, this will default to a value determined by the initial 'scale' of the minor axis and the width of the Gantt. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name viewportEnd
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The start time of the Gantt's viewport. If not specified, this will default to a value determined by the initial 'scale' of the minor axis and the width of the Gantt. See <a href="oj.ojGantt.html#formats-section">Date and Time Formats</a> for more details on string formats.
 * @expose
 * @name viewportStart
 * @memberof oj.ojGantt
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for Gantt task (including milestone) at a specified index.</p>
 *
 * @property {number} rowIndex
 * @property {number} index
 *
 * @ojsubid oj-gantt-taskbar
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the second task of the first row:</caption>
 * var nodes = myGantt.getNodeBySubId({'subId': 'oj-gantt-taskbar', 'rowIndex': 0, 'index': 1});
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
 * var nodes = myGantt.getNodeBySubId({'subId': 'oj-gantt-row-label', 'index': 0});
 */

 /**
 * <p>Sub-ID for the the Gantt tooltip.</p>
 *
 * @ojsubid oj-gantt-tooltip
 * @memberof oj.ojGantt
 *
 * @example <caption>Get the tooltip object of the gantt, if displayed:</caption>
 * var nodes = myGantt.getNodeBySubId({'subId': 'oj-gantt-tooltip'});
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for Gantt task at a specified index.</p>
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
      "type": "Array<object>|Promise"
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
      "type": "Array<object>|Promise"
    },
    "selection": {
      "type": "Array<string>",
      "writeback": true
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
          "type": "Array<string>|string",
          "enumValues": ["start", "innerCenter", "innerStart", "innerEnd", "none", "end"]
        },
        "svgClassName": {
          "type": "string"
        },
        "svgStyle": {
          "type": "object"
        },
        "progress": {
          "type": "object",
          "properties": {
            "borderRadius": {
              "type": "string"
            },
            "height": {
              "type": "number"
            },
            "svgClassName": {
              "type": "string"
            },
            "svgStyle": {
              "type": "object"
            }
          }
        },
        "baseline": {
          "type": "object",
          "properties": {
            "borderRadius": {
              "type": "string"
            },
            "height": {
              "type": "number"
            },
            "svgClassName": {
              "type": "string"
            },
            "svgStyle": {
              "type": "object"
            }
          }
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
        "labelBaselineDate": {
          "type": "string"
        },
        "labelBaselineEnd": {
          "type": "string"
        },
        "labelBaselineStart": {
          "type": "string"
        },
        "labelDate": {
          "type": "string"
        },
        "labelEnd": {
          "type": "string"
        },
        "labelLabel": {
          "type": "string"
        },
        "labelProgress": {
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
        "date": {
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
        },
        "progress": {
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
        "baselineStart": {
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
        "baselineEnd": {
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
        "baselineDate": {
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
