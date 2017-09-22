/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtLegend'], function(oj, $, comp, base, dvt)
{
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
 *       <td rowspan="2">Legend Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Filter when <code class="prettyprint">hideAndShowBehavior</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Highlight when <code class="prettyprint">hoverBehavior</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojLegend
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
 *       <td>Move focus to previous item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to next item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus to previous item (on left).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus to next item (on right).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Hides or unhides the data associated with the current item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojLegend
 */

/**
 * The title of the legend.
 * @ignore
 * @name title
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated 
 */
/**
 * An array of objects with the following properties defining the legend sections.
 * @expose
 * @name sections
 * @memberof oj.ojLegend
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The title of the legend section.
 * @expose
 * @name sections[].title
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The horizontal alignment of the section title. If the section is collapsible or nested, only start alignment is supported.
 * @expose
 * @name sections[].titleHalign
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default <code class="prettyprint">"start"</code>
 */
/**
 * The CSS style object defining the style of the section title.
 * @expose
 * @name sections[].titleStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Whether the section is collapsible. Only applies if the legend orientation is vertical.
 * @expose
 * @name sections[].collapsible
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * Whether the section is initially expanded. Only applies if the section is collapsible.
 * @expose
 * @name sections[].expanded
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default <code class="prettyprint">"on"</code>
 */
/**
 * An array of nested legend sections.
 * @expose
 * @name sections[].sections
 * @memberof! oj.ojLegend
 * @instance
 * @type {Array.<object>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of objects with the following properties defining the legend items. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name sections[].items
 * @memberof! oj.ojLegend
 * @instance
 * @type {Array.<object>|Promise}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The id of the legend item, which is provided as part of the context for events fired by the legend. If not specified, the id defaults to the text of the legend item.
 * @expose
 * @name sections[].items[].id
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The legend item text.
 * @expose
 * @name sections[].items[].text
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of categories for the legend item. Legend items currently only support a single category. If no category is specified, this defaults to the id or text of the legend item.
 * @expose
 * @name sections[].items[].categories
 * @memberof! oj.ojLegend
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The type of legend symbol to display.
 * @expose
 * @name sections[].items[].symbolType
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "line"
 * @ojvalue {string} "lineWithMarker"
 * @ojvalue {string} "image"
 * @ojvalue {string} "marker"
 * @default <code class="prettyprint">"marker"</code>
 */
/**
 * The URI of the image of the legend symbol.
 * @expose
 * @name sections[].items[].source
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
 * @expose
 * @name sections[].items[].color
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name sections[].items[].borderColor
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The pattern used to fill the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name sections[].items[].pattern
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "smallChecker"
 * @ojvalue {string} "smallCrosshatch"
 * @ojvalue {string} "smallDiagonalLeft"
 * @ojvalue {string} "smallDiagonalRight"
 * @ojvalue {string} "smallDiamond"
 * @ojvalue {string} "smallTriangle"
 * @ojvalue {string} "largeChecker"
 * @ojvalue {string} "largeCrosshatch"
 * @ojvalue {string} "largeDiagonalLeft"
 * @ojvalue {string} "largeDiagonalRight"
 * @ojvalue {string} "largeDiamond"
 * @ojvalue {string} "largeTriangle"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * The line style. Only applies when the symbolType is "line" or "lineWithMarker".
 * @expose
 * @name sections[].items[].lineStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "dotted"
 * @ojvalue {string} "dashed"
 * @ojvalue {string} "solid"
 * @default <code class="prettyprint">"solid"</code>
 */
/**
 * The line width in pixels. Only applies when the symbolType is "line" or "lineWithMarker".
 * @expose
 * @name sections[].items[].lineWidth
 * @memberof! oj.ojLegend
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @ignore
 * @name sections[].items[].className
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgClassName attribute instead.
 */
/**
 * The inline style to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @ignore
 * @name sections[].items[].style
 * @memberof! oj.ojLegend
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the svgStyle attribute instead.
 */
/**
 * The CSS style class to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name sections[].items[].svgClassName
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name sections[].items[].svgStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The CSS style class to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @ignore
 * @name sections[].items[].markerClassName
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the markerSvgClassName attribute instead.
 */
/**
 * The inline style to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @ignore
 * @name sections[].items[].markerStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 * @deprecated This attribute is deprecated, use the markerSvgStyle attribute instead.
 */
/**
 * The CSS style class to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @expose
 * @name sections[].items[].markerSvgClassName
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The inline style to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @expose
 * @name sections[].items[].markerSvgStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The shape of the marker. Only applies if symbolType is "marker" or "lineWithMarker". Can take the name of a built-in shape or the svg path commands for a custom shape. Does not apply if a custom image is specified.
 * @expose
 * @name sections[].items[].markerShape
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "circle"
 * @ojvalue {string} "ellipse"
 * @ojvalue {string} "diamond"
 * @ojvalue {string} "triangleUp"
 * @ojvalue {string} "triangleDown"
 * @ojvalue {string} "plus"
 * @ojvalue {string} "human"
 * @ojvalue {string} "rectangle"
 * @ojvalue {string} "star"
 * @ojvalue {string} "square"
 * @default <code class="prettyprint">"square"</code>
 */
/**
 * The color of the marker, if different than the line color. Only applies if the symbolType is "lineWithMarker".
 * @expose
 * @name sections[].items[].markerColor
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether the legend item corresponds to visible data items. A hollow symbol is shown if the value is "hidden".
 * @expose
 * @name sections[].items[].categoryVisibility
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "hidden"
 * @ojvalue {string} "visible"
 * @default <code class="prettyprint">"visible"</code>
 */
/**
 *  Whether drilling is enabled on the legend item. Drillable objects will show a pointer cursor on hover and fire <code class="prettyprint">ojDrill</code> event on click. To enable drilling for all legend items at once, use the drilling attribute in the top level. 
 * @expose
 * @name sections[].items[].drilling
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default <code class="prettyprint">"inherit"</code>
 */
/**
 * The description of this legend item. This is used for accessibility and for customizing the tooltip text.
 * @expose
 * @name sections[].items[].shortDesc
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
 * @expose
 * @name orientation
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "horizontal"
 * @ojvalue {string} "vertical"
 * @default <code class="prettyprint">"vertical"</code>
 */
/**
 * Defines the horizontal alignment of the legend contents.
 * @expose
 * @name halign
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default <code class="prettyprint">"start"</code>
 */
/**
 * Defines the vertical alignment of the legend contents.
 * @expose
 * @name valign
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "middle"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "top"
 * @default <code class="prettyprint">"top"</code>
 */
/**
 * The horizontal alignment of the legend title.
 * @ignore
 * @name titleHalign
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default <code class="prettyprint">"start"</code>
 * @deprecated 
 */
/**
 * The CSS style string defining the style of the legend title.
 * @ignore
 * @name titleStyle
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @default <code class="prettyprint">null</code>
 * @deprecated 
 */
/**
 * The CSS style object defining the style of the legend item text.
 * @expose
 * @name textStyle
 * @memberof oj.ojLegend
 * @instance
 * @type {object}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The width of the legend symbol (line or marker) in pixels.
 * @expose
 * @name symbolWidth
 * @memberof oj.ojLegend
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * The height of the legend symbol (line or marker) in pixels.
 * @expose
 * @name symbolHeight
 * @memberof oj.ojLegend
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
 * @expose
 * @name hideAndShowBehavior
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */
/**
 * Defines the behavior applied when hovering over a legend item.
 * @expose
 * @name hoverBehavior
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "dim"
 * @ojvalue {string} "none"
 * @default <code class="prettyprint">"none"</code>
 */
/**
 * Specifies initial hover delay in ms for highlighting items in legend.
 * @expose
 * @name hoverBehaviorDelay
 * @memberof oj.ojLegend
 * @instance
 * @type {number}
 * @default <code class="prettyprint">null</code>
 */
/**
 * An array of categories that will be highlighted.
 * @expose
 * @name highlightedCategories
 * @memberof oj.ojLegend
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * An array of categories that will be hidden.
 * @expose
 * @name hiddenCategories
 * @memberof oj.ojLegend
 * @instance
 * @type {Array.<string>}
 * @default <code class="prettyprint">null</code>
 * @ojwriteback
 */
/**
 * Defines whether scrolling is enabled for the legend.
 * @expose
 * @name scrolling
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "asNeeded"
 * @default <code class="prettyprint">"asNeeded"</code>
 */
/**
 *  Whether drilling is enabled on all legend items. Drillable objects will show a pointer cursor on hover and fire <code class="prettyprint">ojDrill</code> event on click. To enable or disable drilling on individual legend item, use the drilling attribute in each legend item. 
 * @expose
 * @name drilling
 * @memberof oj.ojLegend
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default <code class="prettyprint">"off"</code>
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for legend items indexed by their section and item indices.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojsubid oj-legend-item
 * @memberof oj.ojLegend
 *
 * @example <caption>Get the second item in the first section:</caption>
 * var nodes = $( ".selector" ).ojLegend( "getNodeBySubId", {'subId': 'oj-legend-item', sectionIndexPath: [0], itemIndex: 1} );
 */

/**
 * <p>Sub-ID for the the legend tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-legend-tooltip
 * @memberof oj.ojLegend
 * @instance
 * 
 * @example <caption>Get the tooltip object of the legend, if displayed:</caption>
 * var nodes = $( ".selector" ).ojLegend( "getNodeBySubId", {'subId': 'oj-legend-tooltip'} );
 */
// Node Context Objects ********************************************************


/**
 * <p>Context for legend items indexed by their section and item indices.</p>
 *
 * @property {Array} sectionIndexPath The array of numerical indices for the section.
 * @property {number} itemIndex The index of the item within the specified section.
 *
 * @ojnodecontext oj-legend-item
 * @memberof oj.ojLegend
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojLegend
 * @augments oj.dvtBaseComponent
 * @since 0.7
 *
 * @classdesc
 * <h3 id="legendOverview-section">
 *   JET Legend
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#legendOverview-section"></a>
 * </h3>
 *
 * <p>A themable, WAI-ARIA compliant legend for JET.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-legend
    orientation='vertical'
    sections='[{"items": [
                {"text": "Database"},
                {"text": "Middleware"},
                {"text": "Application"}
              ]}]'
   >
 * &lt;/oj-legend>
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
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojLegend', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Triggered during a drill gesture (single click on the legend item).
     * @property {string} id the id of the drilled object
     *
     * @expose
     * @event
     * @memberof oj.ojLegend
     * @instance
     */
    drill: null
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return dvt.Legend.newInstance(context, callback, callbackObj);
  },


  //** @inheritdoc */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    if(subId == 'oj-legend-item') {
      // section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
      subId = 'section' + this._GetStringFromIndexPath(locator['sectionIndexPath']);
      subId += ':item[' + locator['itemIndex'] + ']';
    }
    else if(subId == 'oj-legend-tooltip') {
        subId = 'tooltip';
    }
    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId.indexOf(':item') > 0) {
      // section[sectionIndex0][sectionIndex1]...[sectionIndexN]:item[itemIndex]
      var itemStartIndex = subId.indexOf(':item');
      var sectionSubstr = subId.substring(0, itemStartIndex);
      var itemSubstr = subId.substring(itemStartIndex);

      locator['subId'] = 'oj-legend-item';
      locator['sectionIndexPath'] = this._GetIndexPath(sectionSubstr);
      locator['itemIndex'] = this._GetFirstIndex(itemSubstr);
    }
    else if(subId == 'tooltip') {
        locator['subId'] = 'oj-legend-tooltip';
    }
    return locator;
  },

  //** @inheritdoc */
	_GetComponentStyleClasses: function() {
		var styleClasses = this._super();
		styleClasses.push('oj-legend');
		return styleClasses;
	},

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-legend'] = {'path' : 'textStyle', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-legend-title'] = {'path' : 'titleStyle', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-legend-section-title'] = {'path' : '_sectionTitleStyle', 'property' : 'CSS_TEXT_PROPERTIES'};
    return styleClasses;
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.LEGEND'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['drill'];
  },

  //** @inheritdoc */
  _HandleEvent : function(event) {
    var type = event['type'];
    if (type === 'drill') {
      this._trigger('drill', null, {'id': event['id']});
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
    resources['closedEnabled'] = 'oj-legend-section-close-icon';
    resources['closedOver'] = 'oj-legend-section-close-icon oj-hover';
    resources['closedDown'] = 'oj-legend-section-close-icon oj-active';
    resources['openEnabled'] = 'oj-legend-section-open-icon';
    resources['openOver'] = 'oj-legend-section-open-icon oj-hover';
    resources['openDown'] = 'oj-legend-section-open-icon oj-active';
  },

  //** @inheritdoc */
  _Render: function() {
    this._super();
  },

  /**
   * Returns the legend title for automation testing verification.
   * @return {String} The legend title
   * @expose
   * @instance
   * @memberof oj.ojLegend
   * @ignore
   */
  getTitle : function() {
    var auto = this._component.getAutomation();
    return auto.getTitle();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the legend section with
   * the specified subid path.
   *
   * @param {Array} subIdPath The array of indices in the subId for the desired legend section.
   * @property {string} title
   * @property {Function(number)} getSection Returns the section with the specified index.
   * @property {string} getSection.title
   * @return {Object|null} An object containing properties for the legend section at the given subIdPath, or null if
   *   none exists.
   * @expose
   * @instance
   * @memberof oj.ojLegend
   */
  getSection : function(subIdPath) {
    var ret = this._component.getAutomation().getSection(subIdPath);
    if(ret) {
      // Support for getSection(sectionIndex)
      ret['getSection'] = function(sectionIndex) {
        var section = ret['sections'] ? ret['sections'][sectionIndex] : null;
        return section;
      }

      // Support for getSection(itemIndex)
      ret['getItem'] = function(itemIndex) {
        var item = ret['items'] ? ret['items'][itemIndex] : null;
        return item;
      }
    }
    return ret;
  },

  /**
   * Returns an object with the following properties for automation testing verification of the legend item with
   * the specified subid path.
   *
   * @param {Array} subIdPath The array of indices in the subId for the desired legend item.
   * @property {string} text
   * @return {Object|null} An object containing properties for the legend item at the given subIdPath, or null if
   *   none exists.
   * @expose
   * @instance
   * @memberof oj.ojLegend
   */
  getItem : function(subIdPath) {
    return this._component.getAutomation().getItem(subIdPath);
  },

  /**
   * Returns the preferred size of the legend, given the available width and height. A re-render must be triggered
   * by calling <code class="prettyprint">refresh</code> after invoking this function.
   * @param {Number} width The available width.
   * @param {Number} height The available height.
   * @return {Object} An object containing the preferred width and height.
   * @expose
   * @instance
   * @memberof oj.ojLegend
   */
  getPreferredSize : function(width, height) {
    // Check if the options has a promise.
    var hasPromise = false;
    var legendSections = this.options['sections'] ? this.options['sections'] : [];
    for(var i=0; i<legendSections.length; i++) {
      var items = legendSections[i]['items'];
      if(items && items.then) 
        hasPromise = true;
    }
    
    // If the options has a promise, then use the last options to be rendered rather 
    // than passing in a promise that can't be dealt with here. This won't work if the
    // data is provided via a promise and not yet rendered, but this problem will go 
    // away once we have flowing layout.
    var options = hasPromise ? null : this.options;
    var dims = this._component.getPreferredSize(options, width, height);
    return {'width': dims.getWidth(), 'height': dims.getHeight()};
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
   * @memberof oj.ojLegend
   */
  getContextByNode: function(node)
  {
    // context objects are documented with @ojnodecontext
   var context = this.getSubIdByNode(node);
   if (context && context['subId'] !== 'oj-legend-tooltip')
     return context;

   return null;
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'sections': ['items']};
  },

  //** @inheritdoc */
  _GetComponentNoClonePaths : function() {
    return {'sections': {'items': true}};
  }
});

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojLegendMeta = {
  "properties": {
    "drilling": {
      "type": "string",
      "enumValues": ["on", "off"]
    },
    "halign": {
      "type": "string",
      "enumValues": ["center", "end", "start"]
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "hideAndShowBehavior": {
      "type": "string",
      "enumValues": ["on", "off"]
    },
    "highlightedCategories": {
      "type": "Array<string>",
      "writeback": true
    },
    "hoverBehavior": {
      "type": "string",
      "enumValues": ["dim", "none"]
    },
    "hoverBehaviorDelay": {
      "type": "number"
    },    "orientation": {
      "type": "string",
      "enumValues": ["horizontal", "vertical"]
    },
    "scrolling": {
      "type": "string",
      "enumValues": ["asNeeded", "off"]
    },
    "sections": {
      "type": "Array<object>"
    },
    "symbolHeight": {
      "type": "number"
    },
    "symbolWidth": {
      "type": "number"
    },
    "textStyle": {
      "type": "object"
    },
    "translations": {
      "properties": {
        "componentName": {
          "type": "string"
        }
      }
    },
    "valign": {
      "type": "string"
    }
  },
  "events": {
    "drill": {}
  },
  "methods": {
    "getContextByNode": {},
    "getItem": {},
    "getPreferredSize": {},
    "getSection": {}
  },
  "extension": {
    _WIDGET_NAME: "ojLegend"
  }
};
oj.CustomElementBridge.registerMetadata('oj-legend', 'dvtBaseComponent', ojLegendMeta);
oj.CustomElementBridge.register('oj-legend', {'metadata': oj.CustomElementBridge.getMetadata('oj-legend')});
})();
});
