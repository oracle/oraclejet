/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtChart'], function(oj, $, comp, base, dvt)
{
/**
 * @ojcomponent oj.ojSparkChart
 * @augments oj.dvtBaseComponent
 * @since 0.7
 *
 * @classdesc
 * <h3 id="sparkChartOverview-section">
 *   JET Spark Chart Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sparkChartOverview-section"></a>
 * </h3>
 *
 * <p>Spark Chart component for JET with support for bar, line, area, and floating bar subtypes.  Spark Charts are
 * designed to visualize the trend of a data set in a compact form factor.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojSparkChart',
 *   type: 'line',
 *   items: [5, 8, 2, 7, 0, 9]
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
 * @desc Creates a JET Spark Chart.
 * @example <caption>Initialize the Chart with no options specified:</caption>
 * $(".selector").ojSparkChart();
 *
 * @example <caption>Initialize the Spark Chart with some options:</caption>
 * $(".selector").ojSparkChart({type: 'line', items: [5, 8, 2, 7, 0, 9]});
 *
 * @example <caption>Initialize the Spark Chart via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojSparkChart'}">
 */
oj.__registerWidget('oj.ojSparkChart', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {},

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    this._focusable({'element': this.element, 'applyHighlight': true});
    return dvt.SparkChart.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-sparkchart');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.CHART'] = translations['componentName'];
    return ret;
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
   * Returns an object with the following properties for automation testing verification of the data item with
   * the specified item index.
   * @param {number} itemIndex The item index
   * @property {string} borderColor
   * @property {string} color
   * @property {Date} date
   * @property {number} high The high value for a range item
   * @property {number} low  The low value for a range item
   * @property {number} value
   * @property {Function} getBorderColor <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">borderColor</code> instead.
   * @property {Function} getColor <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">color</code> instead.
   * @property {Function} getDate <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">date</code> instead.
   * @property {Function} getFloatValue <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">low</code> instead.
   * @property {Function} getHigh <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">high</code> instead.
   * @property {Function} getLow <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">low</code> instead.
   * @property {Function} getValue <b>Deprecated in 3.0.0</b>: Use <code class="prettyprint">value</code> instead.
   * @return {Object|null} An object containing properties for the data item, or null if none exists.
   * @expose
   * @instance
   * @memberof oj.ojSparkChart
   */
  getDataItem: function(itemIndex) {
    var ret = this._component.getAutomation().getDataItem(itemIndex);

    // : Provide backwards compatibility for getters until 1.2.0.
    this._AddAutomationGetters(ret);
    if (ret)
      ret['getFloatValue'] = ret['getLow'];

    return ret;
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['items']};
  },

  /**
   * Adds getters for the properties on the specified map. 
   * @param {Object|null} map
   * @memberof oj.ojSparkChart
   * @instance
   * @protected
   */
  _AddAutomationGetters: function(map) {
    if(!map)
      return;

    // These getters are deprecated in 3.0.0
    var props = {};
    for (var key in map) {
      this._addGetter(map, key, props);
    }
    Object.defineProperties(map, props);
  },

  /**
   * Adds getter for the specified property on the specified properties map.
   * @param {Object} map
   * @param {string} key
   * @param {Object} props The properties map onto which the getter will be added.
   * @memberof oj.ojSparkChart
   * @instance
   * @private
   */
  _addGetter: function(map, key, props) {
    var prefix = (key == 'selected') ? 'is' : 'get';
    var getterName = prefix + key.charAt(0).toUpperCase() + key.slice(1);
    props[getterName] = {'value': function() { return map[key] }};
  },
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
 *       <td rowspan="5">Data Item</td>
 *       <td rowspan="2"><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is <code class="prettyprint">none</code>.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
 *       <td>Display tooltip.</td>
 *     </tr>
 *     <tr>
 *       <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *       <td>Categorical Axis Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="2">Legend Item</td>
 *       <td rowspan="2"><kbd>Tap</kbd></td>
 *       <td>Drill when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td>Filter when <code class="prettyprint">hideAndShowBehavior</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan="4">Plot Area</td>
 *       <td rowspan="2"><kbd>Drag</kbd></td>
 *       <td>Pan when panning is enabled and toggled into that mode.</td>
 *     </tr>
 *     <tr>
 *       <td>Marquee select when <code class="prettyprint">selectionMode</code> is <code class="prettyprint">multiple</code> and toggled into that mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Pinch-close</kbd></td>
 *       <td>Zoom out when zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Spread-open</kbd></td>
 *       <td>Zoom in when zooming is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojChart
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
 *       <td>Move focus and selection to previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus and selection to next data item.</td>
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
 *       <td><kbd>=</kbd> or <kbd>+</kbd></td>
 *       <td>Zoom in one level if zooming is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>-</kbd> or <kbd>_</kbd></td>
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
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on data item, categorical axis label, or legend item when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojChart
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for chart data items indexed by series and group indices. The group index is not required for pie and
 * funnel charts.</p>
 *
 * @property {number} seriesIndex
 * @property {number} itemIndex
 *
 * @ojsubid oj-chart-item
 * @memberof oj.ojChart
 *
 * @example <caption>Get the data item from the first series and second group:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-chart-item', 'seriesIndex': 0, 'itemIndex': 1} );
 */

/**
 * <p>Sub-ID for a legend item that represents the series with the specified index.</p>
 *
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-chart-series
 * @memberof oj.ojChart
 *
 * @example <caption>Get the legend item that represents the first series:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-chart-series', 'index': 0} );
 */

/**
 * <p>Sub-ID for a categorical axis label that represents the group with the specified index.</p>
 *
 * @property {Array} indexPath The array of indices corresponding to the position of the group in the options array.
 *
 * @ojsubid oj-chart-group
 * @memberof oj.ojChart
 * @instance
 *
 * @example <caption>Get the categorical axis label that represents the first group:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-chart-group', 'indexPath': [0]} );
 */

/**
 * <p>Sub-ID for the title of the specified axis.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 *
 * @ojsubid oj-chart-axis-title
 * @memberof oj.ojChart
 *
 * @example <caption>Get the title for the x-axis:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-chart-axis-title', 'axis': 'xAxis'} );
 */

/**
 * <p>Sub-ID for the reference object of the specified axis with the given index.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 * @property {number} index The index of the reference object for the specified axis.
 *
 * @ojsubid oj-chart-reference-object
 * @memberof oj.ojChart
 *
 * @example <caption>Get the first reference object of the y-axis:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-chart-reference-object', 'axis': 'yAxis', 'index': 0} );
 */

/**
 * <p>Sub-ID for the the chart tooltip.</p>
 *
 * @ojsubid oj-chart-tooltip
 * @memberof oj.ojChart
 *
 * @example <caption>Get the tooltip object of the chart, if displayed:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-chart-tooltip'} );
 */

/**
 * <p>Sub-ID for a legend item indexed by its position in its parent section's
 * item array and its parent's sectionIndex.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojsubid oj-legend-item
 * @memberof oj.ojChart
 *
 * @example <caption>Get the first legend item from the first legend section:</caption>
 * var nodes = $( ".selector" ).ojChart( "getNodeBySubId", {'subId': 'oj-legend-item', sectionIndexPath: [0], itemIndex: 1} );
 */

// Node Context Objects ********************************************************

/**
* <p>Context for chart data items indexed by series and group indices.</p>
*
* @property {number} seriesIndex
* @property {number} itemIndex
*
* @ojnodecontext oj-chart-item
* @memberof oj.ojChart
*/

/**
 * <p>Context for a legend item that represents the series with the specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-chart-series
 * @memberof oj.ojChart
 */

/**
 * <p>Context for a categorical axis label that represents the group with the specified index.</p>
 *
 * @property {Array} indexPath The array of indices corresponding to the position of the group in the options array.
 *
 * @ojnodecontext oj-chart-group
 * @memberof oj.ojChart
 */

/**
 * <p>Context for the title of the specified axis.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 *
 * @ojnodecontext oj-chart-axis-title
 * @memberof oj.ojChart
 */

/**
 * <p>Context for the reference object of the specified axis with the given index.</p>
 *
 * @property {string} axis <code class="prettyprint">xAxis</code>, <code class="prettyprint">yAxis</code>, or <code class="prettyprint">y2Axis</code>
 * @property {number} index The index of the reference object for the specified axis.
 *
 * @ojnodecontext oj-chart-reference-object
 * @memberof oj.ojChart
 */

/**
 * <p>Context for a legend item indexed by its position in its parent section's
 * item array and its parent's sectionIndex.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojnodecontext oj-legend-item
 * @memberof oj.ojChart
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *   <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li>
 *   <li>id: The id of the hovered item.</li> 
 *   <li>series: The id of the series the hovered item belongs to.</li> 
 *   <li>group: The ids or an array of ids of the group(s) the hovered item belongs to. For hierarchcal groups, it will be an array of outermost to innermost group ids.</li> 
 *   <li>value, targetValue, x, y, z, low, high, open, close, volume: The values of the hovered item.</li> 
 *   <li>label: The data label of the hovered item.</li> 
 *   <li>data: The data object of the hovered item</li> 
 *   <li>seriesData: The data for the series the hovered item belongs to.</li> 
 *   <li>groupData: An array of data for the group the hovered item belongs to. For hierarchcal groups, it will be an array of outermost to innermost group data related to the hovered item.</li> 
 *   <li>component: The widget constructor for the chart. The 'component' is bound to the associated jQuery element so can be called directly as a function. 
 *   <li>color: The color of the hovered item.</li> 
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojChart
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * The knockout template used to render the content of the pie center area.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *    <li>outerBounds: Object containing (x, y, width, height) of the rectangle circumscribing the center area. 
 *    The x and y coordinates are relative to the top, left corner of the component.</li> 
 *    <li>innerBounds: Object containing (x, y, width, height) of the rectangle inscribed in the center area. 
 *    The x and y coordinates are relative to the top, left corner of the component.</li> 
 *    <li>label: The pieCenter label.</li> 
 *    <li>component: The widget constructor for the chart. The 'component' is bound to the associated jQuery element so can be called directly as a function.</li> 
 *  </ul>
 *
 * @ojbindingonly
 * @name pieCenter.template
 * @memberof! oj.ojChart
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * <p>This component has no touch interaction.  </p>
 *
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojSparkChart
 */

/**
 * <p>This component has no keyboard interaction.  </p>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSparkChart
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *    <li>parentElement: The tooltip element. This can be used to change the tooltip border or background color.</li> 
 *    <li>color: The color of the chart.</li> 
 *    <li>component: The widget constructor for the chart. The 'component' is bound to the associated jQuery element so can be called directly as a function. </li> 
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojSparkChart
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojChart
 * @augments oj.dvtBaseComponent
 * @since 0.7
 *
 * @classdesc
 * <h3 id="chartOverview-section">
 *   JET Chart Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#chartOverview-section"></a>
 * </h3>
 *
 * <p>Chart component for JET with support for bar, line, area, combination, pie, scatter, bubble, and funnel
 * charts.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojChart',
 *   type: 'bar',
 *   series: [{name: 'Q1 Sales', items: [50, 60, 20]}],
 *   groups: ['Phones', 'Tablets', 'Laptops']
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
 * <h4>Animation</h4>
 * <p>Animation should only be enabled for visualizations of small to medium data sets. When animating changes to larger
 *    data sets or when animating between data sets, it's recommended to turn off the
 *    <code class="prettyprint">styleDefaults.animationIndicators</code>, since they effectively double the amount of
 *    work required for the animation.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications only set usable data densities on the chart. For example,
 *    it's not recommended to show more than 500 bars on a 500 pixel wide chart, since the  bars will be unusably thin.
 *    While there are several optimizations within the chart to deal with large data sets, it's always more efficient to
 *    reduce the data set size as early as possible. Future optimizations will focus on improving end user experience as
 *    well as developer productivity for common use cases.
 * </p>
 *
 * <h4>Style Attributes</h4>
 * <p>Use the highest level options property available. For example, consider using  attributes on
 *    <code class="prettyprint">styleDefaults</code> or <code class="prettyprint">series</code>, instead of attributes
 *    on the data items. The chart can take advantage of these higher level attributes to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Chart.
 * @example <caption>Initialize the Chart with no options specified:</caption>
 * $(".selector").ojChart();
 *
 * @example <caption>Initialize the Chart with some options:</caption>
 * $(".selector").ojChart({type: 'bar'});
 *
 * @example <caption>Initialize the Chart via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojChart'}">
 */
oj.__registerWidget('oj.ojChart', $['oj']['dvtBaseComponent'],
  {
    widgetEventPrefix: "oj",
    options: {
      /**
       * Fired whenever a supported component option changes, whether due to user interaction or programmatic
       * intervention.  If the new value is the same as the previous value, no event will be fired.  The event 
       * listener will receive two parameters described below:
       *
       * @property {Object} ui event payload
       * @property {string} ui.option the name of the option that changed, i.e. "value"
       * @property {Object} ui.previousValue an Object holding the previous value of the option
       * @property {Object} ui.value - an Object holding the current value of the option.
       * @property {?Object} ui.subproperty - an Object holding information about the subproperty that changed.
       * @property {string} ui.subproperty.path - the subproperty path that changed.
       * @property {Object} ui.subproperty.previousValue - an Object holding the previous value of the subproperty.
       * @property {Object} ui.subproperty.value - an Object holding the current value of the subproperty.
       * @property {Object} ui.optionMetadata information about the option that is changing
       * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
       *                    <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
       * @property {string} ui.optionMetadata.endGroup the end group of a marquee selection on a chart with categorical axis
       * @property {string} ui.optionMetadata.startGroup the start group of a marquee selection on a chart with categorical axis
       * @property {number} ui.optionMetadata.xMax the maximum x value of a marquee selection
       * @property {number} ui.optionMetadata.xMin the minimum x value of a marquee selection
       * @property {number} ui.optionMetadata.yMax the maximum y value of a marquee selection
       * @property {number} ui.optionMetadata.yMin the minimum y value of a marquee selection
       * @property {Object} ui.optionMetadata.component the widget constructor for the chart. The 'component' is bound to the associated jQuery element so can be called directly as a function
       * @property {Array} ui.optionMetadata.selectionData an array of objects with data, seriesData and groupData corresponding to the selected items in data.value
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
       * $(".selector").ojChart({
       *   'optionChange': function (event, ui) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojoptionchange</code> event:</caption>
       * $(".selector").on({
       *   'ojoptionchange': function (event, ui) {
       *       window.console.log("option changing is: " + ui['option']);
       *   };
       * });
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       */
      optionChange: null,

      /**
       * Triggered during a selection gesture, such as a change in the marquee selection rectangle.
       *
       * @property {Object} data event payload
       * @property {Array} data.items an array containing the string ids of the selected data items for the custom element syntax. For the old syntax, an
       *                              array of objects with the following properties. This array of objects syntax is deprecated in 3.0.0 and 
       *                              will be changed to an array of strings in 5.0.0.
       * @property {string} data.items.id <b>Deprecated in 3.0.0</b>
       * @property {string} data.items.group <b>Deprecated in 3.0.0</b>
       * @property {string} data.items.series <b>Deprecated in 3.0.0</b>
       * @property {Array}  data.selectionData an array containing objects describing the selected data items
       * @property {object} data.selectionData.data the data of the item, if one was specified
       * @property {Array} data.selectionData.groupData the group data of the item
       * @property {object} data.selectionData.seriesData the series data of the item
       * @property {string} data.endGroup the end group of a marquee selection on a chart with categorical axis
       * @property {string} data.startGroup the start group of a marquee selection on a chart with categorical axis
       * @property {number} data.xMax the maximum x value of a marquee selection
       * @property {number} data.xMin the minimum x value of a marquee selection
       * @property {number} data.yMax the maximum y value of a marquee selection
       * @property {number} data.yMin the minimum y value of a marquee selection
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">selectInput</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "selectInput": function(event, data){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojselectinput</code> event:</caption>
       * $(".selector").on("ojselectinput", function(event, data){});
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       */
      selectInput: null,

      /**
       * Triggered after the viewport is changed due to a zoom or scroll operation.
       *
       * @property {Object} data event payload
       * @property {string} data.endGroup the end group of the new viewport on a chart with categorical axis
       * @property {string} data.startGroup the start group of the new viewport on a chart with categorical axis
       * @property {number} data.xMax the maximum x value of the new viewport
       * @property {number} data.xMin the minimum x value of the new viewport
       * @property {number} data.yMax the maximum y value of the new viewport
       * @property {number} data.yMin the minimum y value of the new viewport
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">viewportChange</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "viewportChange": function(event, data){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojviewportchange</code> event:</caption>
       * $(".selector").on("ojviewportchange", function(event, data){});
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       */
      viewportChange: null,

      /**
       * Triggered during a viewport change gesture, such as a drag operation on the overview window. Note: There are
       * situations where the component cannot determine whether the viewport change gesture is still in progress, such
       * as with mouse wheel zoom interactions. Standard viewportChange events are fired in these cases.
       *
       * @property {Object} data event payload
       * @property {string} data.endGroup the end group of the new viewport on a chart with categorical axis
       * @property {string} data.startGroup the start group of the new viewport on a chart with categorical axis
       * @property {number} data.xMax the maximum x value of the new viewport
       * @property {number} data.xMin the minimum x value of the new viewport
       * @property {number} data.yMax the maximum y value of the new viewport
       * @property {number} data.yMin the minimum y value of the new viewport
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">viewportChangeInput</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "viewportChangeInput": function(event, data){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojviewportchangeinput</code> event:</caption>
       * $(".selector").on("ojviewportchangeinput", function(event, data){});
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       */
      viewportChangeInput: null,

      /**
       * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
       *
       * @property {Object} data event payload
       * @property {string} data.id the id of the drilled object
       * @property {string} data.series the series id of the drilled object, if applicable
       * @property {string} data.group the group id of the drilled object, if applicable
       * @property {Object} data.data  the data object of the drilled item
       * @property {Object} data.seriesData the data for the series of the drilled object
       * @property {Array} data.groupData an array of data for the group the drilled object belongs to. For hierarchcal groups, it will be an array of outermost to innermost group data related to the drilled object
       * @property {Object} data.component the widget constructor for the chart. The 'component' is bound to the associated jQuery element so can be called directly as a function
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">drill</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "drill": function(event, data){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojdrill</code> event:</caption>
       * $(".selector").on("ojdrill", function(event, data){});
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       */
      drill: null
    },

    //** @inheritdoc */
    _CreateDvtComponent: function(context, callback, callbackObj) {
      return dvt.Chart.newInstance(context, callback, callbackObj);
    },

    //** @inheritdoc */
    _ConvertLocatorToSubId : function(locator) {
      var subId = locator['subId'];

      // Convert the supported locators
      if(subId == 'oj-chart-item') {
        // dataItem[seriesIndex][itemIndex]
        subId = 'dataItem[' + locator['seriesIndex'] + '][' + locator['itemIndex'] + ']';
      }
      else if(subId == 'oj-chart-group') {
        // group[index1][index2]...[indexN]
        subId = 'group' + this._GetStringFromIndexPath(locator['indexPath']);
      }
      else if(subId == 'oj-chart-series') {
        // series[index]
        subId = 'series[' + locator['index'] + ']';
      }
      else if(subId == 'oj-chart-axis-title') {
        // xAxis/yAxis/y2Axis:title
        subId = locator['axis'] + ':title';
      }
      else if(subId == 'oj-chart-reference-object') {
        // xAxis/yAxis/y2Axis:referenceObject[index]
        subId = locator['axis'] + ':referenceObject[' + locator['index'] + ']';
      }
      else if(subId == 'oj-legend-section') {
        // legend:section[sectionIndex0][sectionIndex1]...[sectionIndexN]
        subId = 'legend:section' + this._GetStringFromIndexPath(locator['indexPath']);
      }
      else if(subId == 'oj-legend-item') {
        // legend:section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
        subId = 'legend:section' + this._GetStringFromIndexPath(locator['sectionIndexPath']);
        subId += ':item[' + locator['itemIndex'] + ']';
      }
      else if(subId == 'oj-chart-tooltip') {
        subId = 'tooltip';
      }
      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },


    //** @inheritdoc */
    _ProcessOptions: function() {
      this._super();
      var center = this.options['pieCenter'];
      if (center && center['_renderer'])
        center['renderer'] = this._GetTemplateRenderer(center['_renderer'], 'center');
      
      var selection = this.options['selection'];
      // The array<object> type is deprecated since 2.1.0 so for custom elements 
      // we are breaking selection in order to push developers to use the correct syntax
      if(this._IsCustomElement() && selection && typeof selection[0] == 'object')
        this.options['selection'] = null;
    },

    //** @inheritdoc */
    _ConvertSubIdToLocator : function(subId) {
      var locator = {};

      if(subId.indexOf('dataItem') == 0) {
        // dataItem[seriesIndex][itemIndex]
        var indexPath = this._GetIndexPath(subId);

        locator['subId'] = 'oj-chart-item';
        locator['seriesIndex'] = indexPath[0];
        locator['itemIndex'] = indexPath[1];
      }
      else if(subId.indexOf('group') == 0) {
        // group[index1][index2]...[indexN]
        locator['subId'] = 'oj-chart-group';
        locator['indexPath'] = this._GetIndexPath(subId);
      }
      else if(subId.indexOf('series') == 0) {
        // series[index]
        locator['subId'] = 'oj-chart-series';
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId.indexOf('Axis:title') > 0) {
        // xAxis/yAxis/y2Axis:title
        locator['subId'] = 'oj-chart-axis-title';
        locator['axis'] = subId.substring(0, subId.indexOf(':'));
      }
      else if(subId.indexOf('Axis:referenceObject') > 0) {
        // xAxis/yAxis/y2Axis:referenceObject[index]
        locator['subId'] = 'oj-chart-reference-object';
        locator['axis'] = subId.substring(0, subId.indexOf(':'));
        locator['index'] = this._GetFirstIndex(subId);
      }
      else if(subId.indexOf('legend') == 0) {
        if(subId.indexOf(':item') > 0) {
          // legend:section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
          var itemStartIndex = subId.indexOf(':item');
          var sectionSubstr = subId.substring(0, itemStartIndex);
          var itemSubstr = subId.substring(itemStartIndex);

          locator['subId'] = 'oj-legend-item';
          locator['sectionIndexPath'] = this._GetIndexPath(sectionSubstr);
          locator['itemIndex'] = this._GetFirstIndex(itemSubstr);
        }
        else if(subId.indexOf('section') == 0) {
          // legend:section[sectionIndex0][sectionIndex1]...[sectionIndexN]
          locator['subId'] = 'oj-legend-section';
          locator['indexPath'] = this._GetIndexPath(subId);
        }
      }
      else if(subId == 'tooltip') {
        locator['subId'] = 'oj-chart-tooltip';
      }

      return locator;
    },

    //** @inheritdoc */
    _ProcessStyles: function() {
      this._super();
      if (!this.options['styleDefaults'])
        this.options['styleDefaults'] = {};
      if (!this.options['styleDefaults']['colors']) {
        var handler = new oj.ColorAttributeGroupHandler();
        // override default colors with css attribute group colors
        this.options['styleDefaults']['colors'] = handler.getValueRamp();
      }
    },

    //** @inheritdoc */
    _GetComponentStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses.push('oj-chart');
      return styleClasses;
    },

    //** @inheritdoc */
    _GetChildStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses['oj-chart-data-label'] = {'path': 'styleDefaults/dataLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-stack-label'] = {'path': 'styleDefaults/stackLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-footnote'] = {'path': 'footnote/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-pie-center-label'] = {'path': 'pieCenter/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-slice-label'] = {'path': 'styleDefaults/sliceLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-subtitle'] = {'path': 'subtitle/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-stock-falling'] = {'path': 'styleDefaults/stockFallingColor', 'property': 'background-color'};
      styleClasses['oj-chart-stock-range'] = {'path': 'styleDefaults/stockRangeColor', 'property': 'background-color'};
      styleClasses['oj-chart-stock-rising'] = {'path': 'styleDefaults/stockRisingColor', 'property': 'background-color'};
      styleClasses['oj-chart-tooltip-label'] = {'path': 'styleDefaults/tooltipLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-title'] = {'path': 'title/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-xaxis-tick-label'] = {'path': 'xAxis/tickLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-xaxis-title'] = {'path': 'xAxis/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-yaxis-tick-label'] = {'path': 'yAxis/tickLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-yaxis-title'] = {'path': 'yAxis/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-y2axis-tick-label'] = {'path': 'y2Axis/tickLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-y2axis-title'] = {'path': 'y2Axis/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};

      // Legend
      styleClasses['oj-legend'] = {'path': 'legend/textStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-legend-title'] = {'path': 'legend/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};

      return styleClasses;
    },

    //** @inheritdoc */
    _GetEventTypes : function() {
      return ['drill', 'optionChange', 'selectInput', 'viewportChange', 'viewportChangeInput'];
    },

    //** @inheritdoc */
    _GetTranslationMap: function() {
      // The translations are stored on the options object.
      var translations = this.options['translations'];

      // Safe to modify super's map because function guarentees a new map is returned
      var ret = this._super();
      ret['DvtChartBundle.DEFAULT_GROUP_NAME'] = translations['labelDefaultGroupName'];
      ret['DvtChartBundle.LABEL_SERIES'] = translations['labelSeries'];
      ret['DvtChartBundle.LABEL_GROUP'] = translations['labelGroup'];
      ret['DvtChartBundle.LABEL_VALUE'] = translations['labelValue'];
      ret['DvtChartBundle.LABEL_TARGET_VALUE'] = translations['labelTargetValue'];
      ret['DvtChartBundle.LABEL_X'] = translations['labelX'];
      ret['DvtChartBundle.LABEL_Y'] = translations['labelY'];
      ret['DvtChartBundle.LABEL_Z'] = translations['labelZ'];
      ret['DvtChartBundle.LABEL_PERCENTAGE'] = translations['labelPercentage'];
      ret['DvtChartBundle.LABEL_LOW'] = translations['labelLow'];
      ret['DvtChartBundle.LABEL_HIGH'] = translations['labelHigh'];
      ret['DvtChartBundle.LABEL_OPEN'] = translations['labelOpen'];
      ret['DvtChartBundle.LABEL_CLOSE'] = translations['labelClose'];
      ret['DvtChartBundle.LABEL_VOLUME'] = translations['labelVolume'];
      ret['DvtChartBundle.LABEL_Q1'] = translations['labelQ1'];
      ret['DvtChartBundle.LABEL_Q2'] = translations['labelQ2'];
      ret['DvtChartBundle.LABEL_Q3'] = translations['labelQ3'];
      ret['DvtChartBundle.LABEL_MIN'] = translations['labelMin'];
      ret['DvtChartBundle.LABEL_MAX'] = translations['labelMax'];
      ret['DvtChartBundle.LABEL_OTHER'] = translations['labelOther'];
      ret['DvtChartBundle.PAN'] = translations['tooltipPan'];
      ret['DvtChartBundle.MARQUEE_SELECT'] = translations['tooltipSelect'];
      ret['DvtChartBundle.MARQUEE_ZOOM'] = translations['tooltipZoom'];
      ret['DvtUtilBundle.CHART'] = translations['componentName'];
      return ret;
    },

    //** @inheritdoc */
    _HandleEvent: function(event) {
      var type = event['type'];
      if (type === 'selection') {
        var selection = event['selection'];
        if (selection) {
          // Convert the graph selection context into the JET context
          var selectedItems = [];
          var selectionData = [];
          for (var i = 0; i < selection.length; i++) {
            var selectedItem;
            if (this._IsCustomElement())
              selectedItem = selection[i]['id'];
            else {
              selectedItem = {'id': selection[i]['id'],
                'series': selection[i]['series'],
                'group': selection[i]['group']};
            }
            var selectedItemData = {'data': selection[i]['data'],
              'seriesData': selection[i]['seriesData'],
              'groupData': selection[i]['groupData']};
            selectedItems.push(selectedItem);
            selectionData.push(selectedItemData);
          }

          var selectPayload = {
            'endGroup': event['endGroup'], 'startGroup': event['startGroup'],
            'xMax': event['xMax'], 'xMin': event['xMin'],
            'yMax': event['yMax'], 'yMin': event['yMin'],
            'y2Max': event['y2Max'], 'y2Min': event['y2Min'],
            'component': event['component'], 'selectionData': selectionData
          };

          // Update the options selection state if the user interaction is complete
          if(event['complete'])
            this._UserOptionChange('selection', selectedItems, selectPayload);
          else {
            selectPayload['items'] = selectedItems;
            this._trigger('selectInput', null, selectPayload);
          }
        }
      }
      else if (type === 'viewportChange') {
        var viewportChangePayload = {'endGroup': event['endGroup'], 'startGroup': event['startGroup'],
                                     'xMax': event['xMax'], 'xMin': event['xMin'],
                                     'yMax': event['yMax'], 'yMin': event['yMin']};

        // Maintain the viewport state
        // TODO we should be firing option change event for this, but it doesn't support nested props yet.
        if(event['complete']) {
          // Ensure the axis options both exist
          if(!this.options['xAxis'])
            this.options['xAxis'] = {};

          if(!this.options['yAxis'])
            this.options['yAxis'] = {};

          // X-Axis: Clear the start and end group because min/max more accurate.
          this.options['xAxis']['viewportStartGroup'] = null;
          this.options['xAxis']['viewportEndGroup'] = null;
          if(event['xMin'] != null && event['xMax'] != null) {
            this.options['xAxis']['viewportMin'] = event['xMin'];
            this.options['xAxis']['viewportMax'] = event['xMax'];
          }

          // Y-Axis
          if(event['yMin'] != null && event['yMax'] != null) {
            this.options['yAxis']['viewportMin'] = event['yMin'];
            this.options['yAxis']['viewportMax'] = event['yMax'];
          }
        }

        this._trigger(event['complete'] ? 'viewportChange' : 'viewportChangeInput', null, viewportChangePayload);
      }
      else if (type === 'drill') {
        this._trigger('drill', null, {'id': event['id'], 'series': event['series'], 'group': event['group'], 'data': event['data'], 'seriesData': event['seriesData'],'groupData': event['groupData'],'component': event['component']});
      }
      else {
        this._super(event);
      }
    },

    //** @inheritdoc */
    _LoadResources: function() {
      // Ensure the resources object exists
      if (this.options['_resources'] == null)
        this.options['_resources'] = {};

      var resources = this.options['_resources'];

      // Add images
      // TODO these should be defined in the skin instead
      resources['overviewGrippy'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/drag_horizontal.png');

      // Add cursors
      resources['panCursorDown'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-closed.cur');
      resources['panCursorUp'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/hand-open.cur');

      // Drag button images
      resources['panUp'] = 'oj-chart-pan-icon';
      resources['panUpHover'] = 'oj-chart-pan-icon oj-hover';
      resources['panDown'] = 'oj-chart-pan-icon oj-active';
      resources['panDownHover'] = 'oj-chart-pan-icon oj-hover oj-active';
      resources['selectUp'] = 'oj-chart-select-icon';
      resources['selectUpHover'] = 'oj-chart-select-icon oj-hover';
      resources['selectDown'] = 'oj-chart-select-icon oj-active';
      resources['selectDownHover'] = 'oj-chart-select-icon oj-hover oj-active';
      resources['zoomUp'] = 'oj-chart-zoom-icon';
      resources['zoomUpHover'] = 'oj-chart-zoom-icon oj-hover';
      resources['zoomDown'] = 'oj-chart-zoom-icon oj-active';
      resources['zoomDownHover'] = 'oj-chart-zoom-icon oj-hover oj-active';
    },

    /**
     * Returns the chart title.
     * @return {String} The chart title
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getTitle: function() {
      var auto = this._component.getAutomation();
      return auto.getTitle();
    },

    /**
     * Returns the group corresponding to the given index
     * @param {String} groupIndex the group index
     * @return {String} The group name corresponding to the given group index
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getGroup: function(groupIndex) {
      var auto = this._component.getAutomation();
      return auto.getGroup(groupIndex);
    },

    /**
     * Returns the series corresponding to the given index
     * @param {String} seriesIndex the series index
     * @return {String} The series name corresponding to the given series index
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getSeries: function(seriesIndex) {
      var auto = this._component.getAutomation();
      return auto.getSeries(seriesIndex);
    },

    /**
     * Returns number of groups in the chart data
     * @return {Number} The number of groups
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getGroupCount: function() {
      var auto = this._component.getAutomation();
      return auto.getGroupCount();
    },

    /**
     * Returns number of series in the chart data
     * @return {Number} The number of series
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getSeriesCount: function() {
      var auto = this._component.getAutomation();
      return auto.getSeriesCount();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the data item with
     * the specified series and group indices.
     *
     * @param {number} seriesIndex
     * @param {number} groupIndex
     * @property {string} borderColor
     * @property {string} color
     * @property {number} close The closing value for a stock item
     * @property {string} group The group id.
     * @property {number} high The high value for a range or stock item
     * @property {string} label
     * @property {number} low  The low value for a range or stock item
     * @property {number} open The opening value for a stock item
     * @property {boolean} selected
     * @property {string} series The series id.
     * @property {number} targetValue The target value for a funnel slice.
     * @property {string} tooltip
     * @property {number} value
     * @property {number} volume  The volume of a stock item
     * @property {number} x
     * @property {number} y
     * @property {number} z
     * @return {Object|null} An object containing properties for the data item, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getDataItem: function(seriesIndex, groupIndex) {
      return this._component.getAutomation().getDataItem(seriesIndex, groupIndex);
    },

    /**
     * Returns an object with the following properties for automation testing verification of the chart legend.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @return {Object} An object containing properties for the chart legend.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getLegend: function() {
      return this._component.getAutomation().getLegend();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the chart plot area.
     *
     * @property {Object} bounds An object containing the bounds of the plot area.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @return {Object} An object containing properties for the chart plot area.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getPlotArea: function() {
      return this._component.getAutomation().getPlotArea();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the x axis.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @property {Function(number, number)} getPreferredSize Returns the preferred size of the axis, given the available
     *   width and height. This value can be passed into the <code class="prettyprint">size</code> and
     *   <code class="prettyprint">maxSize</code> options of the axis. A re-render must be triggered by calling
     *   <code class="prettyprint">refresh</code> after invoking this function.
     * @property {number} getPreferredSize.width
     * @property {number} getPreferredSize.height
     * @return {Object} An object containing properties for the x axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getXAxis: function() {
      return this._component.getAutomation().getXAxis();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the y axis.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @property {Function(number, number)} getPreferredSize Returns the preferred size of the axis, given the available
     *   width and height. This value can be passed into the <code class="prettyprint">size</code> and
     *   <code class="prettyprint">maxSize</code> options of the axis. A re-render must be triggered by calling
     *   <code class="prettyprint">refresh</code> after invoking this function.
     * @property {number} getPreferredSize.width
     * @property {number} getPreferredSize.height
     * @return {Object} An object containing properties for the y axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getYAxis: function() {
      return this._component.getAutomation().getYAxis();
    },

    /**
     * Returns an object with the following properties for automation testing verification of the y2 axis.
     *
     * @property {Object} bounds An object containing the bounds of the legend.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {string} title
     * @property {Function(number, number)} getPreferredSize Returns the preferred size of the axis, given the available
     *   width and height. This value can be passed into the <code class="prettyprint">size</code> and
     *   <code class="prettyprint">maxSize</code> options of the axis. A re-render must be triggered by calling
     *   <code class="prettyprint">refresh</code> after invoking this function.
     * @property {number} getPreferredSize.width
     * @property {number} getPreferredSize.height
     * @return {Object} An object containing properties for the y2 axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getY2Axis: function() {
      return this._component.getAutomation().getY2Axis();
    },

    /**
     * Returns the x, y, and y2 axis values at the specified X and Y coordinate.
     * @param {Number} x The X coordinate relative to the component.
     * @param {Number} y The Y coordinate relative to the component.
     * @return {Object} An object containing the "x", "y", and "y2" axis values.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getValuesAt: function(x, y) {
      return this._component.getValuesAt(x, y);
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
     * @memberof oj.ojChart
     */
    getContextByNode: function(node)
    {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context['subId'] !== 'oj-chart-tooltip')
        return context;

      return null;
    },

    //** @inheritdoc */
    _GetComponentDeferredDataPaths : function() {
      return {'root': ['groups', 'series']};
    }
  });

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojChartMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string",
      "enumValues": ["auto", "slideToLeft", "slideToRight", "none"]
    },
    "animationOnDisplay": {
      "type": "string",
      "enumValues": ["auto", "alphaFade", "zoom", "none"]
    },
    "coordinateSystem": {
      "type": "string",
      "enumValues": ["polar", "cartesian"]
    },
    "dataCursor": {
      "type": "string",
      "enumValues": ["on", "off", "auto"]
    },
    "dataCursorBehavior": {
      "type": "string",
      "enumValues": ["smooth", "snap", "auto"]
    },
    "dataCursorPosition": {
      "type": "object",
      "properties": {
        "x": {
          "type": "string"
        },
        "y": {
          "type": "number"
        },
        "y2": {
          "type": "number"
        }
      },
      "writeback": true
    },
    "dataLabel": {},
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties": {
            "groups": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "drag": {},
                "dragEnd": {},
                "dragStart": {}
              }
            },
            "items": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "drag": {},
                "dragEnd": {},
                "dragStart": {}
              }
            },
            "series": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "drag": {},
                "dragEnd": {},
                "dragStart": {}
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties": {
            "legend": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            },
            "plotArea": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            },
            "xAxis": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            },
            "y2Axis": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            },
            "yAxis": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  type: "Array<string>"
                },
                "dragEnter": {},
                "dragLeave": {},
                "dragOver": {},
                "drop": {}
              }
            }
          }
        }
      }
    },
    "dragMode": {
      "type": "string",
      "enumValues": ["pan", "zoom", "select", "off", "user"]
    },
    "drilling": {
      "type": "string",
      "enumValues": ["on", "seriesOnly", "groupsOnly", "off"]
    },
    "groups": {
      "type": "Array<object>"
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "hideAndShowBehavior": {
      "type": "string",
      "enumValues": ["withRescale", "withoutRescale", "none"]
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "highlightMatch": {
      "type": "string",
      "enumValues": ["any", "all"]
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": ["dim", "none"]
    },
    "initialZooming": {
      "type": "string",
      "enumValues": ["first", "last", "none"]
    },
    "legend": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "type": "string"
        },
        "borderColor": {
          "type": "string"
        },
        "maxSize": {
          "type": "string"
        },
        "position": {
          "type": "string",
          "enumValues": ["start", "end", "bottom", "top", "auto"]
        },
        "referenceObjectSection": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "titleHalign": {
              "type": "string",
              "enumValues": ["center", "end", "start"]
            },
            "titleStyle": {
              "type": "object"
            }
          }
        },
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off", "auto"]
        },
        "scrolling": {
          "type": "string",
          "enumValues": ["off", "asNeeded"]
        },
        "sections": {
          "type": "Array<object>"
        },
        "seriesSection": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "titleHalign": {
              "type": "string",
              "enumValues": ["center", "end", "start"]
            },
            "titleStyle": {
              "type": "object"
            }
          }
        },
        "size": {
          "type": "string"
        },
        "symbolHeight": {
          "type": "number"
        },
        "symbolWidth": {
          "type": "number"
        },
        "textStyle": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "titleHalign": {
          "type": "string"
        },
        "titleStyle": {
          "type": "string"
        }
      }
    },
    "orientation": {
      "type": "string",
      "enumValues": ["horizontal", "vertical"]
    },
    "otherThreshold": {
      "type": "number"
    },
    "overview": {
      "type": "object",
      "properties": {
        "content": {
          "type": "object"
        },
        "height": {
          "type": "string"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off"]
        }
      }
    },
    "pieCenter": {
      "type": "object",
      "properties": {
        "converter": {
          "type": "object"
        },
        "label": {
          "type": "string"
        },
        "labelStyle": {
          "type": "object"
        },
        "renderer": {},
        "scaling": {
          "type": "string",
          "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
        }
      }
    },
    "pieCenterLabel": {
      "type": "object",
      "properties": {
        "style": {
          "type": "object"
        },
        "text": {
          "type": "string"
        }
      }
    },
    "plotArea": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "type": "string"
        },
        "borderColor": {
          "type": "string"
        },
        "borderWidth": {
          "type": "number"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["on", "off"]
        }
      }
    },
    "polarGridShape": {
      "type": "string",
      "enumValues": ["polygon", "circle"]
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
      "type": "Array<object>"
    },
    "sorting": {
      "type": "string",
      "enumValues": ["ascending", "descending", "off"]
    },
    "splitDualY": {
      "type": "string",
      "enumValues": ["on", "off", "auto"]
    },
    "splitterPosition": {
      "type": "number"
    },
    "stack": {
      "type": "string",
      "enumValues": ["on", "off"]
    },
    "stackLabel": {
      "type": "string",
      "enumValues": ["on", "off"]
    },
    "styleDefaults": {
      "type": "object",
      "properties": {
        "animationDownColor": {
          "type": "string"
        },
        "animationDuration": {
          "type": "number"
        },
        "animationIndicators": {
          "type": "string",
          "enumValues": ["none", "all"]
        },
        "animationUpColor": {
          "type": "string"
        },
        "barGapRatio": {
          "type": "number"
        },
        "borderColor": {
          "type": "string"
        },
        "borderWidth": {
          "type": "number"
        },
        "boxPlot": {
          "type": "object",
          "properties": {
            "medianSvgClassName": {
              "type": "string"
            },
            "medianSvgStyle": {
              "type": "object"
            },
            "whiskerSvgClassName": {
              "type": "string"
            },
            "whiskerEndSvgClassName": {
              "type": "string"
            },
            "whiskerEndLength": {
              "type": "string"
            },
            "whiskerEndSvgStyle": {
              "type": "object"
            },
            "whiskerSvgStyle": {
              "type": "object"
            }
          }
        },
        "colors": {
          "type": "Array<string>"
        },
        "dataCursor": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "markerColor": {
              "type": "string"
            },
            "markerDisplayed": {
              "type": "string",
              "enumValues": ["on", "off"]
            },
            "markerSize": {
              "type": "number"
            }
          }
        },
        "dataItemGaps": {
          "type": "string"
        },
        "dataLabelPosition": {
          "type": "Array<string>",
          "enumValues": ["center", "outsideSlice", "aboveMarker", "belowMarker", "beforeMarker",
                         "afterMarker", "insideBarEdge", "outsideBarEdge", "none", "auto"]
        },
        "dataLabelStyle": {
          "type": "Array<string>"
        },
        "funnelBackgroundColor": {
          "type": "string"
        },
        "groupSeparators": {
          "type": "object",
          "properties": {
            "color": {
              "type": "string"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off"]
            }
          }
        },
        "hoverBehaviorDelay": {
          "type": "number"
        },
        "lineStyle": {
          "type": "string",
          "enumValues": ["dotted", "dashed", "solid"]
        },
        "lineType": {
          "type": "string",
          "enumValues": ["straight", "curved", "stepped", "centerStepped", "segmented", "centerSegmented", "none", "auto"]
        },
        "lineWidth": {
          "type": "number"
        },
        "markerColor": {
          "type": "string"
        },
        "markerDisplayed": {
          "type": "string",
          "enumValues": ["on", "off", "auto"]
        },
        "markerShape": {
          "type": "string",
          "enumValues": ["square", "circle", "diamond", "plus", "triangleDown",
                         "triangleUp", "human", "star", "auto"]
        },
        "markerSize": {
          "type": "number"
        },
        "marqueeBorderColor": {
          "type": "string"
        },
        "marqueeColor": {
          "type": "string"
        },
        "maxBarWidth": {
          "type": "number"
        },
        "otherColor": {
          "type": "string"
        },
        "patterns": {
          "type": "Array<string>"
        },
        "pieFeelerColor": {
          "type": "string"
        },
        "pieInnerRadius": {
          "type": "number"
        },
        "selectionEffect": {
          "type": "string",
          "enumValues": ["explode", "highlightAndExplode", "highlight"]
        },
        "seriesEffect": {
          "type": "string",
          "enumValues": ["color", "pattern", "gradient"]
        },
        "shapes": {
          "type": "Array<string>"
        },
        "stackLabelStyle": {
          "type": "string"
        },
        "stockFallingColor": {
          "type": "string"
        },
        "stockRangeColor": {
          "type": "string"
        },
        "stockRisingColor": {
          "type": "string"
        },
        "stockVolumeColor": {
          "type": "string"
        },
        "threeDEffect": {
          "type": "string",
          "enumValues": ["on", "off"]
        },
        "tooltipLabelStyle": {
          "type": "string"
        },
        "tooltipValueStyle": {
          "type": "string"
        }
      }
    },
    "timeAxisType": {
      "type": "string",
      "enumValues": ["enabled", "mixedFrequency", "skipGaps", "disabled", "auto"]
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "touchResponse": {
      "type": "string"
    },
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        },
        "labelClose": {
          "type": "string"
        },
        "labelDate": {
          "type": "string"
        },
        "labelDefaultGroupName": {
          "type": "string"
        },
        "labelGroup": {
          "type": "string"
        },
        "labelHigh": {
          "type": "string"
        },
        "labelLow": {
          "type": "string"
        },
        "labelOpen": {
          "type": "string"
        },
        "labelOther": {
          "type": "string"
        },
        "labelPercentage": {
          "type": "string"
        },
        "labelQ1": {
          "type": "string"
        },
        "labelQ2": {
          "type": "string"
        },
        "labelQ3": {
          "type": "string"
        },
        "labelSeries": {
          "type": "string"
        },
        "labelTargetValue": {
          "type": "string"
        },
        "labelValue": {
          "type": "string"
        },
        "labelVolume": {
          "type": "string"
        },
        "labelX": {
          "type": "string"
        },
        "labelY": {
          "type": "string"
        },
        "labelZ": {
          "type": "string"
        },
        "tooltipPan": {
          "type": "string"
        },
        "tooltipSelect": {
          "type": "string"
        },
        "tooltipZoom": {
          "type": "string"
        }
      }
    },
    "type": {
      "type": "string",
      "enumValues": ["line", "area", "lineWithArea", "stock", "boxPlot", "combo", "pie", "scatter", "bubble", "funnel", "pyramid", "bar"]
    },
    "valueFormats": {
      "type": "object",
      "properties": {
        "series": {
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
        "group": {
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
        "x": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "y": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "y2": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "z": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "value": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "targetValue": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "low": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "high": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "open": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "close": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "volume": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "q1": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "q2": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "tooltipDisplay": {
              "type": "string",
              "enumValues": ["auto", "off"]
            },
            "tooltipLabel": {
              "type": "string"
            }
          }
        },
        "q3": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
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
            "converter": {
              "type": "object"
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
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
    "xAxis": {
      "type": "object",
      "properties": {
        "axisLine": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off"]
            }
          }
        },
        "baselineScaling": {
          "type": "string",
          "enumValues": ["min", "zero"]
        },
        "dataMax": {
          "type": "number"
        },
        "dataMin": {
          "type": "number"
        },
        "majorTick": {
          "type": "object",
          "properties": {
            "baselineColor": {
              "type": "string",
              "enumValues": ["inherit", "auto"]
            },
            "baselineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "baselineWidth": {
              "type": "number"
            },
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off", "auto"]
            }
          }
        },
        "max": {
          "type": "string"
        },
        "maxSize": {
          "type": "string"
        },
        "min": {
          "type": "string"
        },
        "minorStep": {
          "type": "number"
        },
        "minorTick": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off", "auto"]
            }
          }
        },
        "minStep": {
          "type": "number"
        },
        "referenceObjects": {
          "type": "Array<object>"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["off", "on"]
        },
        "scale": {
          "type": "string",
          "enumValues": ["log", "linear"]
        },
        "size": {
          "type": "string"
        },
        "step": {
          "type": "number"
        },
        "tickLabel": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["off", "on"]
            },
            "rotation": {
              "type": "string",
              "enumValues": ["none", "auto"]
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "style": {
              "type": "object"
            }
          }
        },
        "title": {
          "type": "string"
        },
        "titleStyle": {
          "type": "object"
        },
        "viewportEndGroup": {
          "type": "string"
        },
        "viewportMax": {
          "type": "string"
        },
        "viewportMin": {
          "type": "string"
        },
        "viewportStartGroup": {
          "type": "string"
        }
      }
    },
    "y2Axis": {
      "type": "object",
      "properties": {
        "alignTickMarks": {
          "type": "string",
          "enumValues": ["off", "on"]
        },
        "axisLine": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off", "auto"]
            }
          }
        },
        "baselineScaling": {
          "type": "string",
          "enumValues": ["min", "zero"]
        },
        "dataMax": {
          "type": "number"
        },
        "dataMin": {
          "type": "number"
        },
        "majorTick": {
          "type": "object",
          "properties": {
            "baselineColor": {
              "type": "string",
              "enumValues": ["inherit", "auto"]
            },
            "baselineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "baselineWidth": {
              "type": "number"
            },
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["off", "on", "auto"]
            }
          }
        },
        "max": {
          "type": "number"
        },
        "maxSize": {
          "type": "string"
        },
        "min": {
          "type": "number"
        },
        "minorStep": {
          "type": "number"
        },
        "minorTick": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "auto", "off"]
            }
          }
        },
        "minStep": {
          "type": "number"
        },
        "position": {
          "type": "string",
          "enumValues": ["start", "end", "top", "bottom", "auto"]
        },
        "referenceObjects": {
          "type": "Array<object>"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["off", "on"]
        },
        "scale": {
          "type": "string",
          "enumValues": ["log", "linear"]
        },
        "size": {
          "type": "string"
        },
        "step": {
          "type": "number"
        },
        "tickLabel": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "position": {
              "type": "string",
              "enumValues": ["inside", "outisde"]
            },
            "rendered": {
              "type": "string",
              "enumValues": ["off", "on"]
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "style": {
              "type": "object"
            }
          }
        },
        "title": {
          "type": "string"
        },
        "titleStyle": {
          "type": "object"
        }
      }
    },
    "yAxis": {
      "type": "object",
      "properties": {
        "axisLine": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["off", "on", "auto"]
            }
          }
        },
        "baselineScaling": {
          "type": "string",
          "enumValues": ["min", "zero"]
        },
        "dataMax": {
          "type": "number"
        },
        "dataMin": {
          "type": "number"
        },
        "majorTick": {
          "type": "object",
          "properties": {
            "baselineColor": {
              "type": "string",
              "enumValues": ["inherit", "auto"]
            },
            "baselineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "baselineWidth": {
              "type": "number"
            },
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off", "auto"]
            }
          }
        },
        "max": {
          "type": "number"
        },
        "maxSize": {
          "type": "string"
        },
        "min": {
          "type": "number"
        },
        "minorStep": {
          "type": "number"
        },
        "minorTick": {
          "type": "object",
          "properties": {
            "lineColor": {
              "type": "string"
            },
            "lineStyle": {
              "type": "string",
              "enumValues": ["dotted", "dashed", "solid"]
            },
            "lineWidth": {
              "type": "number"
            },
            "rendered": {
              "type": "string",
              "enumValues": ["on", "off", "auto"]
            }
          }
        },
        "minStep": {
          "type": "number"
        },
        "position": {
          "type": "string",
          "enumValues": ["start", "end", "top", "bottom", "auto"]
        },
        "referenceObjects": {
          "type": "Array<object>"
        },
        "rendered": {
          "type": "string",
          "enumValues": ["off", "on"]
        },
        "scale": {
          "type": "string",
          "enumValues": ["log", "linear"]
        },
        "size": {
          "type": "string"
        },
        "step": {
          "type": "number"
        },
        "tickLabel": {
          "type": "object",
          "properties": {
            "converter": {
              "type": "object"
            },
            "position": {
              "type": "string",
              "enumValues": ["inside", "outside"]
            },
            "rendered": {
              "type": "string",
              "enumValues": ["off", "on"]
            },
            "scaling": {
              "type": "string",
              "enumValues": ["none", "auto", "thousand", "million", "billion", "trillion", "quadrillion"]
            },
            "style": {
              "type": "object"
            }
          }
        },
        "title": {
          "type": "string"
        },
        "titleStyle": {
          "type": "object"
        },
        "viewportMax": {
          "type": "number"
        },
        "viewportMin": {
          "type": "number"
        }
      }
    },
    "zoomAndScroll": {
      "type": "string"
    },
    "zoomDirection": {
      "type": "string"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getDataItem": {},
    "getGroup": {},
    "getGroupCount": {},
    "getLegend": {},
    "getPlotArea": {},
    "getSeries": {},
    "getSeriesCount": {},
    "getValuesAt": {},
    "getXAxis": {},
    "getY2Axis": {},
    "getYAxis": {}
  },
  "events": {
    "drill": {},
    "viewportChange": {},
    "selectInput": {},
    "viewportChangeInput": {}
  },
  "extension": {
    _WIDGET_NAME: "ojChart"
  }
};
oj.CustomElementBridge.registerMetadata('oj-chart', 'dvtBaseComponent', ojChartMeta);
oj.CustomElementBridge.register('oj-chart', {'metadata': oj.CustomElementBridge.getMetadata('oj-chart')});
})();

(function() {
var ojSparkChartMeta = {
  "properties": {
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
    "areaSvgClassName": {
      "type": "string"
    },
    "areaColor": {
      "type": "string"
    },
    "areaSvgStyle": {
      "type": "object"
    },
    "barGapRatio": {
      "type": "number"
    },
    "baselineScaling": {
      "type": "string",
      "enumValues": ["zero", "min"]
    },
    "svgClassName": {
      "type": "string"
    },
    "color": {
      "type": "string"
    },
    "firstColor": {
      "type": "string"
    },
    "highColor": {
      "type": "string"
    },
    "items": {
      "type": "Array<number>"
    },
    "lastColor": {
      "type": "string"
    },
    "lineStyle": {
      "type": "string",
      "enumValues": ["dotted", "dashed", "solid"]
    },
    "lineType": {
      "type": "string",
      "enumValues": ["curved", "stepped", "centerStepped", "segmented", "centerSegmented", "none", "straight"]
    },
    "lineWidth": {
      "type": "number"
    },
    "lowColor": {
      "type": "string"
    },
    "markerShape": {
      "type": "string",
      "enumValues": ["square", "circle", "diamond", "plus", "triangleDown", "triangleUp", "human", "auto"]
    },
    "markerSize": {
      "type": "number"
    },
    "referenceObjects": {
      "type": "Array<object>"
    },
    "svgStyle": {
      "type": "object"
    },
    "tooltip": {
      "type": "object"
    },
    "type": {
      "type": "string",
      "enumValues": ["line", "lineWithArea", "bar", "line"]
    },
    "visualEffects": {
      "type": "string",
      "enumValues": ["none", "auto"]
    }
  },
  "methods": {
    "getDataItem": {}
  },
  "extension": {
    _WIDGET_NAME: "ojSparkChart"
  }
};
oj.CustomElementBridge.registerMetadata('oj-spark-chart', 'dvtBaseComponent', ojSparkChartMeta);
oj.CustomElementBridge.register('oj-spark-chart', {'metadata': oj.CustomElementBridge.getMetadata('oj-spark-chart')});
})();

});
