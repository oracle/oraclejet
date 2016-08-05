/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
 *       start: new Date('2016-01-12').getTime(),
 *       end: new Date('2016-02-22').getTime()
 *     }, {
 *       id: 't1_2',
 *       label:'Label 1-2',
 *       start: new Date('2016-03-02').getTime(),
 *       end: new Date('2016-05-21').getTime()
 *     }]
 *   }, {
 *     id: 'r2',
 *     tasks: [{
 *       id: 't2_1',
 *       label:'Label 2',
 *       start: new Date('2016-02-01').getTime(),
 *       end: new Date('2016-04-10').getTime()
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
    map['task'] = "oj-gantt-task";
    map['taskLabel'] = "oj-gantt-task-label";
    map['selected'] = "oj-selected";
    map['hover'] = "oj-hover";

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

    if(subId.indexOf('taskbar') == 0) 
    {
      // taskbar[rowIndex][index]
      var indexPath = this._GetIndexPath(subId);

      locator['subId'] = 'oj-gantt-taskbar';
      locator['rowIndex'] = indexPath[0];
      locator['index'] = indexPath[1];
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
      {'path': '_resources/zoomIn', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomin-icon oj-hover'] = [
      {'path': '_resources/zoomIn_h', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomin-icon oj-active'] = [
      {'path': '_resources/zoomIn_a', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomin-icon oj-disabled'] = [
      {'path': '_resources/zoomIn_d', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_d_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon'] = [
      {'path': '_resources/zoomOut', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon oj-hover'] = [
      {'path': '_resources/zoomOut_h', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon oj-active'] = [
      {'path': '_resources/zoomOut_a', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-gantt-zoomout-icon oj-disabled'] = [
      {'path': '_resources/zoomOut_d', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_d_bc', 'property': 'border-color'}
    ];

    // chart border
    styleClasses['oj-gantt-container'] = {'path': '_resources/chartArea/strokeWidth', 'property': 'stroke-width'};

    // horizontal gridline width
    styleClasses['oj-gantt-horizontal-gridline'] = {'path': '_resources/horizontalGridlineWidth', 'property': 'stroke-width'};

    // task label properties
    styleClasses['oj-gantt-task-label'] = {'path': '_resources/taskLabelFontProp', 'property': 'CSS_TEXT_PROPERTIES'};

    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() 
  {
    return ['optionChange', 'viewportChange'];
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
    // first day of week; locale specific
    resources['firstDayOfWeek'] = oj.LocaleData.getFirstDayOfWeek();
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
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['rows']};
  },

  /**
   * Returns a promise that is resolved when the component is finished rendering.
   * This can be used to determine when it is okay to call automation and other APIs on the component.
   * @returns {Promise}
   * @expose
   * @instance
   * @memberof oj.ojGantt
   */
  whenReady : function() {
    return this._super();
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
 *       <td rowspan="2">Task bar</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tap and hold</kbd></td>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Chart Area</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Paning: navigate forward and backward in time in horizontal/vertical orientation.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan><kbd>Pinch-close</kbd></td>
 *       <td>Zoom Out.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan><kbd>Spread-open</kbd></td>
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
 *       <td><kbd>+</kbd></td>
 *       <td>Zoom in one level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>-</kbd></td>
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
 *       <td>When focus is on a task bar, move focus and selection to the task bar on the left within the same row.  In LTR reading direction, if this is the first task within the row, then move focus and selection to the last task bar in the previous row. In RTL reading direction, if this is the last task within the row, then move focus and selection to the first task bar in the next row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to the task bar on the right within the same row.  In LTR reading direction, if this is the last task within the row, then move focus and selection to the first task bar in the next row. In RTL reading direction, if this is the first task within the row, then move focus and selection to the last task bar in the previous row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to first task bar in the previous row.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>When focus is on a task bar, move focus and selection to first task bar in the next row.</td>
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
 *<p>The application is responsible for setting the <code class="prettyprint">aria-label</code> attribute on the component element with meaningful descriptors. Since component terminology for keyboard and touch shortcuts can conflict with those of the application, it is the application's responsibility to provide these shortcuts, possibly via a help popup.</p>
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

(function() {
var ojGanttMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string"
    },
    "animationOnDisplay": {
      "type": "string"
    },
    "axisPosition": {
      "type": "string"
    },
    "end": {
      "type": "string|number"
    },
    "gridlines": {
      "type": "object"
    },
    "majorAxis": {
      "type": "object"
    },
    "minorAxis": {
      "type": "object"
    },
    "rows": {
      "type": "Array<object>"
    },
    "selection": {
      "type": "Array<string>"
    },
    "selectionMode": {
      "type": "string"
    },
    "start": {
      "type": "string|number"
    },
    "taskDefaults": {
      "type": "object"
    },
    "viewportEnd": {
      "type": "string|number"
    },
    "viewportStart": {
      "type": "string|number"
    }
  },
  "methods": {
    "whenReady": {}
  },
  "extension": {
    "_widgetName": "ojGantt"
  }
};
oj.Components.registerMetadata('ojGantt', 'dvtTimeComponent', ojGanttMeta);
oj.Components.register('oj-gantt', oj.Components.getMetadata('ojGantt'));
})();
});
