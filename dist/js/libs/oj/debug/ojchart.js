/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
   * Returns a SparkChartDataItem object for automation testing verification.
   * @param {String} itemIndex The dataItem index
   * @return {Object} The spark chart data item with the given item index
   * @expose
   * @instance
   * @memberof oj.ojSparkChart
   */
  getDataItem: function(itemIndex) {
    var auto = this._component.getAutomation();
    return new oj.SparkChartDataItem(auto.getDataItem(itemIndex));
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['items']};
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
 * An object used for automation verification of spark chart data items
 * Applications should not create this object.
 * @param {Object} data An object containing verification data
 * @constructor
 * @export
 */  
oj.SparkChartDataItem = function(data) {
  this._data = data;
};

/**
 * Returns the border color of a spark chart data item
 * @returns {String} The data item border color
 * @export
 */
oj.SparkChartDataItem.prototype.getBorderColor = function() {
  return this._data ? this._data['borderColor'] : null;
};

/**
 * Returns the color of a spark chart data item
 * @returns {String} The data item color
 * @export
 */
oj.SparkChartDataItem.prototype.getColor = function() {
  return this._data ? this._data['color'] : null;
};

/**
 * Returns the date of a spark chart data item.
 * @returns {Date} The data item date
 * @export
 */
oj.SparkChartDataItem.prototype.getDate = function() {
  return this._data ? this._data['date'] : null;
};

/**
 * Returns the float value of a spark chart data item. Only applies to floatingBar sparkChart types.
 * @returns {Number} The data item float value
 * @export
 */
oj.SparkChartDataItem.prototype.getFloatValue = function() {
  return this.getLow();
};

/**
 * Returns the low value of a spark chart data item.
 * @returns {Number} The data item low value
 * @export
 */
oj.SparkChartDataItem.prototype.getLow = function() {
  return this._data ? this._data['low'] : null;
};

/**
 * Returns the high value of a spark chart data item.
 * @returns {Number} The data item high value
 * @export
 */
oj.SparkChartDataItem.prototype.getHigh = function() {
  return this._data ? this._data['high'] : null;
};

/**
 * Returns the value of a spark chart data item.
 * @returns {Number} The data item value
 * @export
 */
oj.SparkChartDataItem.prototype.getValue = function() {
  return this._data ? this._data['value'] : null;
};
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
       * Triggered when a category of data items is hidden or shown.
       *
       * @property {Object} ui event payload
       * @property {Object} ui.category the category that was filtered on
       * @property {string} ui.type specifies whether the category is being filtered 'in' or 'out'
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">categoryFilter</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "categoryFilter": function(event, ui){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcategoryfilter</code> event:</caption>
       * $(".selector").on("ojcategoryfilter", function(event, ui){});
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       * @deprecated Use the <code class="prettyprint">optionChange</code> listener to detect changes to the <code class="prettyprint">hiddenCategories</code> property instead.
       */
      categoryFilter: null,
      /**
       * Triggered when a category of data items is highlighted.
       *
       * @property {Object} ui event payload
       * @property {Array} ui.categories the categories that are being highlighted
       * @property {string} ui.type specifies whether highlighting is being turned 'on' or 'off'
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">categoryHighlight</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "categoryHighlight": function(event, ui){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcategoryhighlight</code> event:</caption>
       * $(".selector").on("ojcategoryhighlight", function(event, ui){});
       *
       * @expose
       * @event
       * @memberof oj.ojChart
       * @instance
       * @deprecated Use the <code class="prettyprint">optionChange</code> listener to detect changes to the <code class="prettyprint">highlightedCategories</code> property instead.
       */
      categoryHighlight: null,

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
       * @property {string} ui.optionMetadata.endGroup the end group of a marquee selection on a chart with categorical axis
       * @property {string} ui.optionMetadata.startGroup the start group of a marquee selection on a chart with categorical axis
       * @property {number} ui.optionMetadata.xMax the maximum x value of a marquee selection
       * @property {number} ui.optionMetadata.xMin the minimum x value of a marquee selection
       * @property {number} ui.optionMetadata.yMax the maximum y value of a marquee selection
       * @property {number} ui.optionMetadata.yMin the minimum y value of a marquee selection
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
       * $(".selector").ojChart({
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
       * @memberof oj.ojChart
       * @instance
       */
      optionChange: null,

      /**
       * Triggered during a selection gesture, such as a change in the marquee selection rectangle.
       *
       * @property {Object} ui event payload
       * @property {Array} ui.items an array containing objects describing the selected data items
       * @property {string} ui.items.id the id of the data item, if one was specified
       * @property {string} ui.items.group the group of the data item
       * @property {string} ui.items.series the series of the data item
       * @property {string} ui.endGroup the end group of a marquee selection on a chart with categorical axis
       * @property {string} ui.startGroup the start group of a marquee selection on a chart with categorical axis
       * @property {number} ui.xMax the maximum x value of a marquee selection
       * @property {number} ui.xMin the minimum x value of a marquee selection
       * @property {number} ui.yMax the maximum y value of a marquee selection
       * @property {number} ui.yMin the minimum y value of a marquee selection
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">selectInput</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "selectInput": function(event, ui){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojselectinput</code> event:</caption>
       * $(".selector").on("ojselectinput", function(event, ui){});
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
       * @property {Object} ui event payload
       * @property {string} ui.endGroup the end group of the new viewport on a chart with categorical axis
       * @property {string} ui.startGroup the start group of the new viewport on a chart with categorical axis
       * @property {number} ui.xMax the maximum x value of the new viewport
       * @property {number} ui.xMin the minimum x value of the new viewport
       * @property {number} ui.yMax the maximum y value of the new viewport
       * @property {number} ui.yMin the minimum y value of the new viewport
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">viewportChange</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "viewportChange": function(event, ui){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojviewportchange</code> event:</caption>
       * $(".selector").on("ojviewportchange", function(event, ui){});
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
       * @property {Object} ui event payload
       * @property {string} ui.endGroup the end group of the new viewport on a chart with categorical axis
       * @property {string} ui.startGroup the start group of the new viewport on a chart with categorical axis
       * @property {number} ui.xMax the maximum x value of the new viewport
       * @property {number} ui.xMin the minimum x value of the new viewport
       * @property {number} ui.yMax the maximum y value of the new viewport
       * @property {number} ui.yMin the minimum y value of the new viewport
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">viewportChangeInput</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "viewportChangeInput": function(event, ui){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojviewportchangeinput</code> event:</caption>
       * $(".selector").on("ojviewportchangeinput", function(event, ui){});
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
       * @property {Object} ui event payload
       * @property {string} ui.id the id of the drilled object
       * @property {string} ui.series the series id of the drilled object, if applicable
       * @property {string} ui.group the group id of the drilled object, if applicable
       *
       * @example <caption>Initialize the component with the <code class="prettyprint">drill</code> callback specified:</caption>
       * $(".selector").ojChart({
       *   "drill": function(event, ui){}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojdrill</code> event:</caption>
       * $(".selector").on("ojdrill", function(event, ui){});
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
      styleClasses['oj-chart-pie-center-label'] = {'path': 'pieCenterLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-slice-label'] = {'path': 'styleDefaults/sliceLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-subtitle'] = {'path': 'subtitle/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-stock-falling'] = {'path': 'styleDefaults/stockFallingColor', 'property': 'background-color'};
      styleClasses['oj-chart-stock-range'] = {'path': 'styleDefaults/stockRangeColor', 'property': 'background-color'};
      styleClasses['oj-chart-stock-rising'] = {'path': 'styleDefaults/stockRisingColor', 'property': 'background-color'};
      styleClasses['oj-chart-title'] = {'path': 'title/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-xaxis-tick-label'] = {'path': 'xAxis/tickLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-xaxis-title'] = {'path': 'xAxis/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-yaxis-tick-label'] = {'path': 'yAxis/tickLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-yaxis-title'] = {'path': 'yAxis/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-y2axis-tick-label'] = {'path': 'y2Axis/tickLabel/style', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-chart-y2axis-title'] = {'path': 'y2Axis/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};

      // Images
      styleClasses['oj-chart-pan-icon'] = {'path': '_resources/panUp', 'property': 'CSS_URL'};
      styleClasses['oj-chart-pan-icon oj-active'] = {'path': '_resources/panDown', 'property': 'CSS_URL'};
      styleClasses['oj-chart-select-icon'] = {'path': '_resources/selectUp', 'property': 'CSS_URL'};
      styleClasses['oj-chart-select-icon oj-active'] = {'path': '_resources/selectDown', 'property': 'CSS_URL'};
      styleClasses['oj-chart-zoom-icon'] = {'path': '_resources/zoomUp', 'property': 'CSS_URL'};
      styleClasses['oj-chart-zoom-icon oj-active'] = {'path': '_resources/zoomDown', 'property': 'CSS_URL'};

      // Legend
      styleClasses['oj-legend'] = {'path': 'legend/textStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-legend-title'] = {'path': 'legend/titleStyle', 'property': 'CSS_TEXT_PROPERTIES'};

      styleClasses['oj-legend-section-close-icon'] = {'path': 'legend/_resources/closedEnabled', 'property': 'CSS_URL'};
      styleClasses['oj-legend-section-close-icon oj-hover'] = {'path': 'legend/_resources/closedOver', 'property': 'CSS_URL'};
      styleClasses['oj-legend-section-close-icon oj-active'] = {'path': 'legend/_resources/closedDown', 'property': 'CSS_URL'};

      styleClasses['oj-legend-section-open-icon'] = {'path': 'legend/_resources/openEnabled', 'property': 'CSS_URL'};
      styleClasses['oj-legend-section-open-icon oj-hover'] = {'path': 'legend/_resources/openOver', 'property': 'CSS_URL'};
      styleClasses['oj-legend-section-open-icon oj-active'] = {'path': 'legend/_resources/openDown', 'property': 'CSS_URL'};

      return styleClasses;
    },

    //** @inheritdoc */
    _GetEventTypes : function() {
      return ['categoryFilter', 'categoryHighlight', 'drill', 'optionChange', 'selectInput',
              'viewportChange', 'viewportChangeInput'];
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
          for (var i = 0; i < selection.length; i++) {
            var selectedItem = {'id': selection[i]['id'],
              'series': selection[i]['series'],
              'group': selection[i]['group']};
            selectedItems.push(selectedItem);
          }

          var selectPayload = {
            'endGroup': event['endGroup'], 'startGroup': event['startGroup'],
            'xMax': event['xMax'], 'xMin': event['xMin'],
            'yMax': event['yMax'], 'yMin': event['yMin'],
            'y2Max': event['y2Max'], 'y2Min': event['y2Min']
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
      else if (type === 'categoryHide' || type === 'categoryShow') {
        var filterType = (type === 'categoryHide') ? 'out' : 'in';
        this._trigger('categoryFilter', null, {'category': event['category'], 'type': filterType});
        this._UserOptionChange('hiddenCategories', event['hiddenCategories']);
      }
      else if (type === 'categoryHighlight') {
        var highlightType = event['categories'] && event['categories'].length > 0 ? 'on' : 'off';
        this._trigger('categoryHighlight', null, {'categories': event['categories'], 'type': highlightType});
        this._UserOptionChange('highlightedCategories', event['categories']);
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
        this._trigger('drill', null, {'id': event['id'], 'series': event['series'], 'group': event['group']});
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
     * @property {Function} getBorderColor <b>Deprecated</b>: Use <code class="prettyprint">borderColor</code> instead.
     * @property {Function} getColor <b>Deprecated</b>: Use <code class="prettyprint">color</code> instead.
     * @property {Function} getGroup <b>Deprecated</b>: Use <code class="prettyprint">group</code> instead.
     * @property {Function} getLabel <b>Deprecated</b>: Use <code class="prettyprint">label</code> instead.
     * @property {Function} getSeries <b>Deprecated</b>: Use <code class="prettyprint">series</code> instead.
     * @property {Function} getTargetValue <b>Deprecated</b>: Use <code class="prettyprint">targetValue</code> instead.
     * @property {Function} getTooltip <b>Deprecated</b>: Use <code class="prettyprint">tooltip</code> instead.
     * @property {Function} getValue <b>Deprecated</b>: Use <code class="prettyprint">value</code> instead.
     * @property {Function} getX <b>Deprecated</b>: Use <code class="prettyprint">x</code> instead.
     * @property {Function} getY <b>Deprecated</b>: Use <code class="prettyprint">y</code> instead.
     * @property {Function} getZ <b>Deprecated</b>: Use <code class="prettyprint">z</code> instead.
     * @property {Function} isSelected <b>Deprecated</b>: Use <code class="prettyprint">selected</code> instead.
     * @return {Object|null} An object containing properties for the data item, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getDataItem: function(seriesIndex, groupIndex) {
      var ret = this._component.getAutomation().getDataItem(seriesIndex, groupIndex);

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      return ret;
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
     * @property {Function} getBounds <b>Deprecated</b>: Use <code class="prettyprint">bounds</code> instead.
     * @property {Function} getTitle <b>Deprecated</b>: Use <code class="prettyprint">title</code> instead.
     * @return {Object} An object containing properties for the chart legend.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getLegend: function() {
      var ret = this._component.getAutomation().getLegend();

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      return ret;
    },

    /**
     * Returns an object with the following properties for automation testing verification of the chart plot area.
     *
     * @property {Object} bounds An object containing the bounds of the plot area.
     * @property {number} bounds.x
     * @property {number} bounds.y
     * @property {number} bounds.width
     * @property {number} bounds.height
     * @property {Function} getBounds <b>Deprecated</b>: Use <code class="prettyprint">bounds</code> instead.
     * @return {Object} An object containing properties for the chart plot area.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getPlotArea: function() {
      var ret = this._component.getAutomation().getPlotArea();

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      return ret;
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
     * @property {Function} getBounds <b>Deprecated</b>: Use <code class="prettyprint">bounds</code> instead.
     * @property {Function} getTitle <b>Deprecated</b>: Use <code class="prettyprint">title</code> instead.
     * @return {Object} An object containing properties for the x axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getXAxis: function() {
      var ret = this._component.getAutomation().getXAxis();

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      return ret;
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
     * @property {Function} getBounds <b>Deprecated</b>: Use <code class="prettyprint">bounds</code> instead.
     * @property {Function} getTitle <b>Deprecated</b>: Use <code class="prettyprint">title</code> instead.
     * @return {Object} An object containing properties for the y axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getYAxis: function() {
      var ret = this._component.getAutomation().getYAxis();

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      return ret;
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
     * @property {Function} getBounds <b>Deprecated</b>: Use <code class="prettyprint">bounds</code> instead.
     * @property {Function} getTitle <b>Deprecated</b>: Use <code class="prettyprint">title</code> instead.
     * @return {Object} An object containing properties for the y2 axis.
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    getY2Axis: function() {
      var ret = this._component.getAutomation().getY2Axis();

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      return ret;
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
    },

    /**
     * Returns a promise that is resolved when the component is finished rendering.
     * This can be used to determine when it is okay to call automation and other APIs on the component.
     * @returns {Promise}
     * @expose
     * @instance
     * @memberof oj.ojChart
     */
    whenReady : function() {
      return this._super();
    }
  });

});
