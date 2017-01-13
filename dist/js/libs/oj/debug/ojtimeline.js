/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojtime-base', 'ojs/internal-deps/dvt/DvtTimeline'], function (oj, $, comp, base, dvt)
{
/**
 * @ojcomponent oj.ojTimeline
 * @augments oj.dvtTimeComponent
 * @since 1.1.0
 *
 * @classdesc
 * <h3 id="timelineOverview-section">
 * JET Timeline Component
 * <a class="bookmarkable-link" title="Bookmarkable Link" href="#timelineOverview-section"></a>
 * </h3>
 * <p>Description:</p>
 * <p>A JET Timeline is a themable, WAI-ARIA compliant component that displays a set of events in chronological order.</p>
 *
 * <p>This component should be bound to an HTML div element, and the SVG DOM that it generates should be treated as a
 * black box, as it is subject to change.  This component should not be extended.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojTimeline',
 *   minorAxis: {scale: 'weeks'},
 *   series: [{
 *     id: 's1',
 *     items: [{
 *       id: 'e1',
 *       title:'71st Golden Globe Awards',
 *       start: oj.IntlConverterUtils.dateToLocalIso(new Date('2014-01-12')),
 *       description:'12 Years a Slave and American Hustle win'
 *     }, {
 *       id: 'e2',
 *       title: 'Olympic Games 2014',
 *       start: oj.IntlConverterUtils.dateToLocalIso(new Date(2014-02-07)),
 *       end: oj.IntlConverterUtils.dateToLocalIso(new Date(2014-02-23)),
 *       description:'Team USA came in fourth in gold medals and second overall.'
 *     }]
 *   }],
 *   orientation: 'horizontal'
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
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"keyboardDoc"}
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
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
 *    can cause severe performance degradation when interacting with the component
 *    (scrolling and zooming) regardless of the number of items present.
 *
 * @desc Creates a JET Timeline.
 * @example <caption>Initialize the Timeline with some options:</caption>
 * $(".selector").ojTimeline({orientation: 'vertical'});
 *
 * @example <caption>Initialize the Timeline via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojTimeline'}">
 */
oj.__registerWidget('oj.ojTimeline', $['oj']['dvtTimeComponent'],
{
  widgetEventPrefix: "oj",
  options:
  {
    /**
     * Triggered after the viewport is changed due to a zoom or scroll operation.
     *
     * @property {Object} ui event payload
     * @property {string} ui.viewportStart the start of the new viewport on a timeline
     * @property {string} ui.viewportEnd the end of the new viewport on a timeline
     * @property {string} ui.minorAxisScale the time scale of the minorAxis
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">viewportChange</code> callback specified:</caption>
     * $(".selector").ojTimeline({
     *   "viewportChange": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojviewportchange</code> event:</caption>
     * $(".selector").on("ojviewportchange", function(event, ui){});
     *
     * @expose
     * @event
     * @memberof oj.ojTimeline
     * @instance
     */
    viewportChange: null
  },

  //** @inheritdoc */
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

  //** @inheritdoc */
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

  //** @inheritdoc */
  _GetComponentStyleClasses: function()
  {
    var styleClasses = this._super();
    styleClasses.push('oj-timeline');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses: function()
  {
    var styleClasses = this._super();

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
    styleClasses['oj-timeline-item-description'] = {'path': 'styleDefaults/item/descriptionStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-item-title'] = {'path': 'styleDefaults/item/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-major-axis-label'] = {'path': 'styleDefaults/majorAxis/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-major-axis-separator'] = {'path': 'styleDefaults/majorAxis/separatorColor', 'property': 'color'};
    styleClasses['oj-timeline-minor-axis'] = [
      {'path': 'styleDefaults/minorAxis/backgroundColor', 'property': 'background-color'},
      {'path': 'styleDefaults/minorAxis/borderColor', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-minor-axis-label'] = {'path': 'styleDefaults/minorAxis/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-minor-axis-separator'] = {'path': 'styleDefaults/minorAxis/separatorColor', 'property': 'color'};
    styleClasses['oj-timeline-overview'] = {'path': 'styleDefaults/overview/backgroundColor', 'property': 'background-color'};
    styleClasses['oj-timeline-overview-label'] = {'path': 'styleDefaults/overview/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-overview-window'] = [
      {'path': 'styleDefaults/overview/window/backgroundColor', 'property': 'background-color'},
      {'path': 'styleDefaults/overview/window/borderColor', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-reference-object'] = {'path': 'styleDefaults/referenceObject/color', 'property': 'color'};
    styleClasses['oj-timeline-series'] = {'path': 'styleDefaults/series/backgroundColor', 'property': 'background-color'};
    styleClasses['oj-timeline-series-empty-text'] = {'path': 'styleDefaults/series/emptyTextStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-timeline-series-label'] = {'path': 'styleDefaults/series/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};

    // Zoom Control Icons
    styleClasses['oj-timeline-zoomin-icon'] = [
      {'path': '_resources/zoomIn', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-hover'] = [
      {'path': '_resources/zoomIn_h', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-active'] = [
      {'path': '_resources/zoomIn_a', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomin-icon oj-disabled'] = [
      {'path': '_resources/zoomIn_d', 'property': 'CSS_URL'},
      {'path': '_resources/zoomIn_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomIn_d_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon'] = [
      {'path': '_resources/zoomOut', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-hover'] = [
      {'path': '_resources/zoomOut_h', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_h_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_h_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-active'] = [
      {'path': '_resources/zoomOut_a', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_a_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_a_bc', 'property': 'border-color'}
    ];
    styleClasses['oj-timeline-zoomout-icon oj-disabled'] = [
      {'path': '_resources/zoomOut_d', 'property': 'CSS_URL'},
      {'path': '_resources/zoomOut_d_bgc', 'property': 'background-color'},
      {'path': '_resources/zoomOut_d_bc', 'property': 'border-color'}
    ];

    // Overview Icons
    styleClasses['oj-timeline-overview-window-handle-horizontal'] = {'path': '_resources/overviewHandleHor', 'property': 'CSS_URL'};
    styleClasses['oj-timeline-overview-window-handle-vertical'] = {'path': '_resources/overviewHandleVert', 'property': 'CSS_URL'};

    return styleClasses;
  },

  //** @inheritdoc */
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

  //** @inheritdoc */
  _LoadResources: function() {
    this._super();

    var resources = this.options['_resources'];
    var converter = resources['converter'];

    // Create default converters for vertical timeline
    var converterFactory = oj.Validation.converterFactory("datetime");
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

    // first day of week; locale specific
    resources['firstDayOfWeek'] = oj.LocaleData.getFirstDayOfWeek();
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['series']};
  }

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
 *
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
 *<p>If a date string is not in the ISO format, the following notations are allowed:</p>
 *<p>1. MM/DD/YYYY, example: "02/10/2013"<br>
 *2. MMM DD, YYYY, example: "Feb 17, 2013"<br>
 *3. MM, DD, YYYY, example: "02, 17, 2013"<br>
 *4. MM DD YYYY, example: "02 17 2013"</p>
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
});

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
 * var nodes = $( ".selector" ).ojTimeline( "getNodeBySubId", {'subId': 'oj-timeline-item', 'seriesIndex': 0, 'itemIndex': 1} );
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
      "type": "string"
    },
    "animationOnDisplay": {
      "type": "string"
    },
    "end": {
      "type": "string|number"
    },
    "majorAxis": {
      "type": "object"
    },
    "minorAxis": {
      "type": "object"
    },
    "orientation": {
      "type": "string"
    },
    "overview": {
      "type": "object"
    },
    "referenceObjects": {
      "type": "Array<object>"
    },
    "selection": {
      "type": "Array<string>"
    },
    "selectionMode": {
      "type": "string"
    },
    "series": {
      "type": "Array<object>"
    },
    "start": {
      "type": "string|number"
    },
    "styleDefaults": {
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
    "getContextByNode": {}
  },
  "extension": {
    "_widgetName": "ojTimeline"
  }
};
oj.Components.registerMetadata('ojTimeline', 'dvtBaseComponent', ojTimelineMeta);
oj.Components.register('oj-timeline', oj.Components.getMetadata('ojTimeline'));
})();
});
