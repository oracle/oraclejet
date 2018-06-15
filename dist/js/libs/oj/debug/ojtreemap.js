/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtTreeView'], function(oj, $, comp, base, dvt)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojTreemap
 * @augments oj.dvtBaseComponent
 * @since 0.7
 * @ojstatus preview
 * @ojshortdesc An interactive data visualization in which hierarchical data is represented across two dimensions by the size and color of nested rectangular nodes.
 * @ojrole application
 * @ojtsignore
 *
 * @classdesc
 * <h3 id="treemapOverview-section">
 *   JET Treemap
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#treemapOverview-section"></a>
 * </h3>
 *
 * <p>Treemaps are used to display hierarchical data across two dimensions, represented by
 * the size and color of the treemap nodes. Treemaps are generally preferred over sunbursts when emphasizing the data
 * for the leaf nodes.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-treemap
 *    nodes='[{"value": 100, "color": "#FFFF00", "label": "Total Sales",
 *             "nodes": [{"value": 75, "color": "#00FF00", "label": "Candy"},
 *                       {"value": 20, "color": "#FFFF00", "label": "Fruit"},
 *                       {"value": 15, "color": "#FF0000", "label": "Vegetables"}]}]'>
 * &lt;/oj-treemap>
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
 *   Gesture End User Information
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
 * <p>Animation should only be enabled for visualizations of small to medium data sets. Alternate visualizations should
 *    be considered if identifying data changes is important, since all nodes will generally move and resize on any data
 *    change.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it's recommended that applications only set usable data densities on this element.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 * 
 * <h4>Styling</h4>
 * <p>Use the highest level property available. For example, consider setting styling properties on
 *    <code class="prettyprint">nodeDefaults</code>, instead of styling properties
 *    on the individual nodes. The treemap can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojTreemap', $['oj']['dvtBaseComponent'],
  {
  widgetEventPrefix : "oj",
  options: {
    /**
     * Specifies the animation duration in milliseconds. For data change animations with multiple stages, 
     * this attribute defines the duration of each stage. For example, if an animation contains two stages, 
     * the total duration will be two times this attribute's value. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name animationDuration
     * @memberof oj.ojTreemap
     * @instance
     * @type {number}
     * @ojunits milliseconds
     */
    animationDuration: undefined,
    
    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDataChange: "none",
    
    /**
     * Specifies the animation that is shown on initial display.
     * @expose
     * @name animationOnDisplay
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "auto"
     * @ojvalue {string} "none"
     * @default "none"
     */
    animationOnDisplay: "none",
    
    /**
     * The color that is displayed during a data change animation when a node is updated.
     * @expose
     * @name animationUpdateColor
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @default ""
     */
    animationUpdateColor: "",
    
    /**
     * An array of category strings used for filtering. Nodes with any category matching an item in this array will be filtered.
     * @expose
     * @name hiddenCategories
     * @memberof oj.ojTreemap
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     */
    hiddenCategories: [],
    
    /**
     * An array of category strings used for highlighting. Nodes matching all categories in this array will be highlighted.
     * @expose
     * @name highlightedCategories
     * @memberof oj.ojTreemap
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     */
    highlightedCategories: [],
    
    /**
     * The matching condition for the highlightedCategories property. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @expose
     * @name highlightMatch
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "any"
     * @ojvalue {string} "all"
     * @default "all"
     */
    highlightMatch: "all",
    
    /**
     * Defines the behavior applied when hovering over the nodes.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     */
    hoverBehavior: "none",
    
    /**
     * Specifies initial hover delay in ms for highlighting nodes.
     * @expose
     * @name hoverBehaviorDelay
     * @memberof oj.ojTreemap
     * @instance
     * @type {number}
     * @default 200
     * @ojunits milliseconds
     */
    hoverBehaviorDelay: 200,
    
    /**
     * An object defining custom node content for the treemap. Only leaf nodes with no child nodes will have the custom content rendered.
     * @expose
     * @name nodeContent
     * @memberof oj.ojTreemap
     * @instance
     * @type {Object}
     * @default {"renderer" : null}
     */
    nodeContent: {
      /**
       * A function that returns custom node content. The function takes a dataContext argument, 
       * provided by the treemap, with the following properties: 
       * <ul>
       *   <li>bounds: Object containing (x, y, width, height) of the node area. 
       *   The x and y coordinates are relative to the top, left corner of the element.</li>
       *   <li>id: The id of the node.</li> <li>data: The data object of the node.</li>
       *   <li>componentElement: The treemap element.</li>
       * </ul>
       * The function should return an Object with the following property: 
       * <ul>
       *   <li>insert: HTMLElement - An HTML element, which will be overlaid on top of the treemap. 
       *   This HTML element will block interactivity of the treemap by default, but the CSS pointer-events 
       *   property can be set to 'none' on this element if the treemap's interactivity is desired. 
       *   </li>
       * </ul>
       * @expose
       * @name nodeContent.renderer
       * @memberof! oj.ojTreemap
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       */
       renderer: null
     },
     
    /**
     *  An object containing an optional callback function for tooltip customization. 
     * @expose
     * @name tooltip
     * @memberof oj.ojTreemap
     * @instance
     * @type {Object}
     * @default {"renderer" : null}
     */
    tooltip: {
      /**
       * A function that returns a custom tooltip. The function takes a dataContext argument,
       * provided by the treemap, with the following properties:
       * <ul>
       *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
       *   <li>id: The id of the hovered node.</li>
       *   <li>label: The label of the hovered node.</li>
       *   <li>value: The value of the hovered node.</li>
       *   <li>color: The color of the hovered node.</li>
       *   <li>data: The data object of the hovered node.</li>
       *   <li>componentElement: The treemap element.</li>
       * </ul>
       *  The function should return an Object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @memberof! oj.ojTreemap
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       */
       renderer: null
     },
    
    /**
     * Specifies whether gaps are displayed between groups. Gaps can be useful for drawing attention to the differences between groups.
     * @expose
     * @name groupGaps
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "all"
     * @ojvalue {string} "none"
     * @ojvalue {string} "outer"
     * @default "outer"
     */
    groupGaps: "outer",
     
    /**
     * The number of levels of nodes to display. By default all nodes are displayed.
     * @expose
     * @name displayLevels
     * @memberof oj.ojTreemap
     * @instance
     * @type {number}
     * @default Number.MAX_VALUE
     */
    displayLevels: Number.MAX_VALUE,
     
    /**
     * Specifies the layout of the treemap. The squarified layout results in nodes that are as square as possible, for easier comparison of node sizes. The sliceAndDice layouts are useful for animation, as the ordering of the data is maintained. SliceAndDice layouts are also useful for small form factor treemaps.
     * @expose
     * @name layout
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "sliceAndDiceHorizontal"
     * @ojvalue {string} "sliceAndDiceVertical"
     * @ojvalue {string} "squarified"
     * @default "squarified"
     */
    layout: "squarified",
     
    /**
     * An array of objects with the following properties that defines the data for the nodes. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @name nodes
     * @memberof oj.ojTreemap
     * @instance
     * @type {Array.<Object>|Promise|null}
     * @default null
     */
    nodes: null,
    
    /**
     * An object defining default properties for the nodes. Component CSS classes should be used to set component wide styling. 
     * This API should be used only for styling a specific instance of the component. Properties specified on this object may 
     * be overridden by specifications on the treemap nodes. Some property default values come from the CSS and varies based on theme.
     * @expose
     * @name nodeDefaults
     * @memberof oj.ojTreemap
     * @instance
     * @type {Object}
     * @default {"labelDisplay": "node", "groupLabelDisplay": "header", "labelHalign": "center", "labelMinLength": 1, "labelValign": "center", "header": {"labelHalign": "start", "isolate": "on", "useNodeColor": "off"}}
     */
    nodeDefaults: {
      /**
       * The CSS style object defining the style of the label. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping.
       * The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.labelStyle
       * @memberof! oj.ojTreemap
       * @instance
       * @type {Object}
       */
      labelStyle: undefined,
      
      /**
       * The label display behavior for leaf nodes.
       * @expose
       * @name nodeDefaults.labelDisplay
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "off"
       * @ojvalue {string} "node"
       * @default "node"
       */
      labelDisplay: "node",
      
      /**
       * The label display behavior for group nodes.
       * @expose
       * @name nodeDefaults.groupLabelDisplay
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "node"
       * @ojvalue {string} "off"
       * @ojvalue {string} "header"
       * @default "header"
       */
      groupLabelDisplay: "header",
       
      /**
       * The horizontal alignment for labels displayed within the node.
       * @expose
       * @name nodeDefaults.labelHalign
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "start"
       * @ojvalue {string} "end"
       * @ojvalue {string} "center"
       * @default "center"
       */
      labelHalign: "center",
       
      /**
       * The minimum number of visible characters needed in order to render a truncated label. If the minimum is not met when calculating the truncated label then the label is not displayed.
       * @expose
       * @name nodeDefaults.labelMinLength
       * @memberof! oj.ojTreemap
       * @instance
       * @type {number}
       * @default 1
       * @ojunits pixels
       */
      labelMinLength: 1,
       
      /**
       * The vertical alignment for labels displayed within the node.
       * @expose
       * @name nodeDefaults.labelValign
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       * @ojvalue {string} "top"
       * @ojvalue {string} "bottom"
       * @ojvalue {string} "center"
       * @default "center"
       */
      labelValign: "center",
       
      /**
       * The color of the node hover feedback. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.hoverColor
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       */
      hoverColor: undefined,
       
      /**
       * The inner color of the node selection feedback. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.selectedInnerColor
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       */
      selectedInnerColor: undefined,
      
      /**
       * The outer color of the node selection feedback. The default value comes from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.selectedOuterColor
       * @memberof! oj.ojTreemap
       * @instance
       * @type {string}
       */
      selectedOuterColor: undefined,
       
      /**
       * An object defining default properties for the node header. Component CSS classes should be used to set component wide styling. 
       * This API should be used only for styling a specific instance of the component. Some property default values come from the CSS and varies based on theme.
       * @expose
       * @name nodeDefaults.header
       * @memberof! oj.ojTreemap
       * @instance
       * @type {Object}
       * @default {"labelHalign": "start", "isolate": "on", "useNodeColor": "off"}
       */
      header: {
        /**
         * The background color of the node headers. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.backgroundColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        backgroundColor: undefined,
        
        /**
         * The border color of the node headers. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.borderColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        borderColor: undefined,
         
        /**
         * The background color of the node hover feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.hoverBackgroundColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        hoverBackgroundColor: undefined,
         
        /**
         * The inner color of the node hover feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.hoverInnerColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        hoverInnerColor: undefined, 
        /**
         * The outer color of the node hover feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.hoverOuterColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        hoverOuterColor: undefined,
         
        /**
         * The background color of the node selection feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.selectedBackgroundColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        selectedBackgroundColor: undefined,
         
        /**
         * The inner color of the node selection feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.selectedInnerColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        selectedInnerColor: undefined,
         
        /**
         * The outer color of the node selection feedback. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.selectedOuterColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         */
        selectedOuterColor: undefined,
         
        /**
         * The horizontal alignment of the header title.
         * @expose
         * @name nodeDefaults.header.labelHalign
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "center"
         * @ojvalue {string} "end"
         * @ojvalue {string} "start"
         * @default "start"
         */
        labelHalign: "start",
         
        /**
         * The CSS style string defining the style of the header title. The default value comes from the CSS and varies based on theme.
         * @expose
         * @name nodeDefaults.header.labelStyle
         * @memberof! oj.ojTreemap
         * @instance
         * @type {Object}
         */
        labelStyle: undefined,
         
        /**
         * Specifies whether isolate behavior is enabled on the node.
         * @expose
         * @name nodeDefaults.header.isolate
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "off"
         * @ojvalue {string} "on"
         * @default "on"
         */
        isolate: "on",
         
        /**
         * Specifies whether the node color should be displayed in the header.
         * @expose
         * @name nodeDefaults.header.useNodeColor
         * @memberof! oj.ojTreemap
         * @instance
         * @type {string}
         * @ojvalue {string} "on"
         * @ojvalue {string} "off"
         * @default "off"
         */  
        useNodeColor: "off" 
      }
    },
    
    /**
     * Specifies the visual effect for separating the nodes from each other. This allows for adjacent nodes of the same color to be distinguished.
     * @expose
     * @name nodeSeparators
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "bevels"
     * @ojvalue {string} "gaps"
     * @default "gaps"
     */
    nodeSeparators: "gaps",
     
    /**
     * Specifies the selection mode.
     * @expose
     * @name selectionMode
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "none"
     * @ojvalue {string} "single"
     * @ojvalue {string} "multiple"
     * @default "multiple"
     */
    selectionMode: "multiple",
     
    /**
     * Specifies whether the nodes are sorted by size. When sorting is enabled, nodes that have the same parent are sorted in order of descending size.
     * @expose
     * @name sorting
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     */
    sorting: "off",
    
    /**
     * Specifies the label describing the color metric of the treemap. This label will be used in the legend.
     * @expose
     * @name colorLabel
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @default ""
     */
    colorLabel: "",
     
    /**
     * Specifies the label describing the size metric of the treemap. This label will be used in the legend.
     * @expose
     * @name sizeLabel
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @default ""
     */
    sizeLabel: "",
     
    /**
     * Specifies whether drilling is enabled. Drillable nodes will show a pointer cursor on hover and fire an 
     * <code class="prettyprint">ojBeforeDrill</code> and <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). Drilling on a node causes a property change to the rootNode attribute. The displayLevels attribute can be used in conjunction with drilling to display very deep hieracrchies. Use "on" to enable drilling for all nodes. To enable or disable drilling on individual nodes use the drilling attribute in each node.
     * @expose
     * @name drilling
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     */
    drilling: "off",
     
    /**
     * The id of the root node. When specified, only the root node and children of the root will be displayed.
     * @expose
     * @name rootNode
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @default ""
     */
    rootNode: "",
     
    /**
     * An array containing the ids of the initially selected nodes.
     * @expose
     * @name selection
     * @memberof oj.ojTreemap
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     */
    selection: [],
    
    /**
     * The id of the initially isolated node.
     * @expose
     * @name isolatedNode
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @default ""
     * @ojwriteback
     */
    isolatedNode: "",
    
    /**
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. 
     * For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. 
     * If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature. 
     * @expose
     * @name touchResponse
     * @memberof oj.ojTreemap
     * @instance
     * @type {string}
     * @ojvalue {string} "touchStart"
     * @ojvalue {string} "auto"
     * @default "auto"
     */  
    touchResponse: "auto",
     
    /**
     * Triggered immediately before any node in the treemap is drilled into. The drill event can be vetoed if the beforeDrill callback returns false.
     *
     * @property {string} id the id of the drilled object
     * @property {Object} data the data object of the drilled node
     *
     * @expose
     * @event
     * @memberof oj.ojTreemap
     * @instance
     */
    beforeDrill: null,
    /**
     * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
     *
     * @property {string} id the id of the drilled object
     * @property {Object} data the data object of the drilled node
     *
     * @expose
     * @event
     * @memberof oj.ojTreemap
     * @instance
     */
    drill: null,
  },

    //** @inheritdoc */
    _CreateDvtComponent: function(context, callback, callbackObj) {
      return dvt.Treemap.newInstance(context, callback, callbackObj);
    },

    //** @inheritdoc */
    _ConvertLocatorToSubId : function(locator) {
      var subId = locator['subId'];

      // Convert the supported locators
      if(subId == 'oj-treemap-node') {
        // node[index0][index1]...[indexN]
        subId = 'node' + this._GetStringFromIndexPath(locator['indexPath']);
      }
      else if(subId == 'oj-treemap-tooltip') {
        subId = 'tooltip';
      }

      // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
      // support for the old subId syntax in 1.2.0.
      return subId;
    },

    //** @inheritdoc */
    _ConvertSubIdToLocator : function(subId) {
      var locator = {};
      if(subId.indexOf('node') == 0) {
        // node[index0][index1]...[indexN]
        locator['subId'] = 'oj-treemap-node';
        locator['indexPath'] = this._GetIndexPath(subId);
      }
      else if(subId == 'tooltip') {
        locator['subId'] = 'oj-treemap-tooltip';
      }
      return locator;
    },

    //** @inheritdoc */
    _GetComponentStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses.push('oj-treemap');
      return styleClasses;
    },

    //** @inheritdoc */
    _GetChildStyleClasses: function() {
      var styleClasses = this._super();
      styleClasses['oj-dvtbase oj-treemap'] = {'path': 'animationDuration', 'property': 'ANIM_DUR'};
      styleClasses['oj-treemap-attribute-type-text'] = {'path': 'styleDefaults/_attributeTypeTextStyle', 'property': 'TEXT'};
      styleClasses['oj-treemap-attribute-value-text'] = {'path': 'styleDefaults/_attributeValueTextStyle', 'property': 'TEXT'};
      styleClasses['oj-treemap-drill-text '] = {'path' : 'styleDefaults/_drillTextStyle', 'property' : 'TEXT'};
      styleClasses['oj-treemap-current-drill-text '] = {'path' : 'styleDefaults/_currentTextStyle', 'property' : 'TEXT'};
      styleClasses['oj-treemap-node'] = {'path': 'nodeDefaults/labelStyle', 'property': 'TEXT'};
      styleClasses['oj-treemap-node oj-hover'] = {'path': 'nodeDefaults/hoverColor', 'property': 'border-top-color'};
      styleClasses['oj-treemap-node oj-selected'] = [
        {'path': 'nodeDefaults/selectedOuterColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/selectedInnerColor', 'property': 'border-bottom-color'}
      ];
      styleClasses['oj-treemap-node-header'] = [
        {'path': 'nodeDefaults/header/backgroundColor', 'property': 'background-color'},
        {'path': 'nodeDefaults/header/borderColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/header/labelStyle', 'property': 'TEXT'}
      ];
      styleClasses['oj-treemap-node-header oj-hover'] = [
        {'path': 'nodeDefaults/header/hoverBackgroundColor', 'property': 'background-color'},
        {'path': 'nodeDefaults/header/hoverOuterColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/header/hoverInnerColor', 'property': 'border-bottom-color'},
        {'path': 'nodeDefaults/header/_hoverLabelStyle', 'property': 'TEXT'}
      ];
      styleClasses['oj-treemap-node-header oj-selected'] = [
        {'path': 'nodeDefaults/header/selectedBackgroundColor', 'property': 'background-color'},
        {'path': 'nodeDefaults/header/selectedOuterColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/header/selectedInnerColor', 'property': 'border-bottom-color'},
        {'path': 'nodeDefaults/header/_selectedLabelStyle', 'property': 'TEXT'}
      ];
      return styleClasses;
    },

    //** @inheritdoc */
    _GetEventTypes : function() {
      return ['optionChange', 'drill', 'beforeDrill'];
    },

    //** @inheritdoc */
    _GetTranslationMap: function() {
      // The translations are stored on the options object.
      var translations = this.options['translations'];

      // Safe to modify super's map because function guarentees a new map is returned
      var ret = this._super();
      ret['DvtTreemapBundle.COLOR'] = translations['labelColor'];
      ret['DvtTreemapBundle.ISOLATE'] = translations['tooltipIsolate'];
      ret['DvtTreemapBundle.RESTORE'] = translations['tooltipRestore'];
      ret['DvtTreemapBundle.SIZE'] = translations['labelSize'];
      ret['DvtUtilBundle.TREEMAP'] = translations['componentName'];
      return ret;
    },

    //** @inheritdoc */
    _HandleEvent: function(event) {
      var type = event['type'];
      if (type === 'isolate') {
        // Keep track of all isolated nodes
        var isolatedNodes = this.options._isolatedNodes;
        if (!isolatedNodes) {
          this.options._isolatedNodes = [];
          isolatedNodes = this.options._isolatedNodes;
        }

        // If event has id, it's an isolate.  If null id, then restore.
        var isolateType;
        var isolatedNode = event['id'];
        if (isolatedNode) {
          isolateType = "on";
          isolatedNodes.push(isolatedNode);
          this._UserOptionChange('isolatedNode', isolatedNode);
        }
        else {
          isolateType = "off";
          isolatedNode = isolatedNodes.pop();
          this._UserOptionChange('isolatedNode', (isolatedNodes.length > 0) ? isolatedNodes[isolatedNodes.length] : null);
        }
      }
      else if(type == 'drill') {
        var eventData = {'id': event['id'], 'data': event['data']};
        if (!this._IsCustomElement())
          eventData['component'] = event['component'];
             
        if(event['id'] && this._trigger('beforeDrill', null, eventData)) {
          this._UserOptionChange('rootNode', event['id']);
          this._Render();
          this._trigger('drill', null, eventData);
        }
      }
      else {
        this._super(event);
      }
    },
    
    //** @inheritdoc */
    _GetComponentRendererOptions: function() {
      return ['tooltip/renderer', 'nodeContent/renderer'];
    },

    //** @inheritdoc */
    _ProcessOptions: function() {
      this._super();
      var nodeContent = this.options['nodeContent'];
      if (nodeContent && nodeContent['_renderer'])
        nodeContent['renderer'] = this._GetTemplateRenderer(nodeContent['_renderer'], 'nodeContent');
    },
  
    //** @inheritdoc */
    _LoadResources : function() {
      // Ensure the resources object exists
      if(this.options['_resources'] == null)
        this.options['_resources'] = {};
  
      var resources = this.options['_resources'];

      // Add isolate and restore icons
      resources['isolate'] = 'oj-treemap-isolate-icon';
      resources['isolateOver'] = 'oj-treemap-isolate-icon oj-hover';
      resources['isolateDown'] = 'oj-treemap-isolate-icon oj-active';

      resources['restore'] = 'oj-treemap-restore-icon';
      resources['restoreOver'] = 'oj-treemap-restore-icon oj-hover';
      resources['restoreDown'] = 'oj-treemap-restore-icon oj-active';
    },

    /**
     * Returns an object with the following properties for automation testing verification of the node with
     * the specified subid path.
     *
     * @param {Array} subIdPath The array of indices in the subId for the desired node
     * @property {string} color
     * @property {string} label
     * @property {boolean} selected
     * @property {number} size
     * @property {string} tooltip
     * @return {Object|null} An object containing properties for the node, or null if none exists.
     * @expose
     * @instance
     * @memberof oj.ojTreemap
     */
    getNode: function(subIdPath) {
      return this._component.getAutomation().getNode(subIdPath);
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
     * @memberof oj.ojTreemap
     */
    getContextByNode: function(node)
    {
      // context objects are documented with @ojnodecontext
      var context = this.getSubIdByNode(node);
      if (context && context['subId'] !== 'oj-treemap-tooltip')
        return context;

      return null;
    },

    //** @inheritdoc */
    _GetComponentDeferredDataPaths : function() {
      return {'root': ['nodes']};
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
 *       <td rowspan="3">Node</td>
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
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreemap
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
 *       <td>Move focus and selection up to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus and selection down to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to the left to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to the right to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>]</kbd> or <kbd>Alt + UpArrow</kbd></td>
 *       <td>Move focus and selection from tile or header to group header in level above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>[</kbd> or <kbd>Alt + DownArrow</kbd></td>
 *       <td>Move focus and selection from tile or header to group header in level below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and extend selection up to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and extend selection down to the nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and extend selection to the left to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and extend selection to the right to nearest tile or header in same level.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + ]</kbd> or <kbd>Shift + Alt + UpArrow</kbd></td>
 *       <td>Move focus and extend selection from tile or header to group header in level above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + [</kbd> or <kbd>Shift + Alt + DownArrow</kbd></td>
 *       <td>Move focus and extend selection from tile or header to group header in level below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus up to the nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus down to the nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to the left to nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to the right to nearest tile or header in same level, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + ]</kbd> or <kbd>Ctrl + Alt + UpArrow</kbd></td>
 *       <td>Move focus from tile or header to group header in level above, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + [</kbd> or <kbd>Ctrl + Alt + DownArrow</kbd></td>
 *       <td>Move focus from tile or header to group header in level below, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select tiles or headers with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Enter</kbd></td>
 *       <td>Maximize/Restore on a group header.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on a node when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreemap
 */

/**
 * An array of objects with properties for the child nodes.
 * @expose
 * @name nodes[].nodes
 * @memberof! oj.ojTreemap
 * @instance
 * @type {Array.<Object>}
 * @default null
 */
/**
 * The id of the node.
 * @expose
 * @name nodes[].id
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend and other visualization elements. The categories array of each node is required to be a superset of the categories array of its parent node. If not specified, the ids of the node and its ancestors will be used.
 * @expose
 * @name nodes[].categories
 * @memberof! oj.ojTreemap
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The value of the node. The value determines the relative size of the node.
 * @expose
 * @name nodes[].value
 * @memberof! oj.ojTreemap
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The fill color of the node.
 * @expose
 * @name nodes[].color
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name nodes[].svgClassName
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name nodes[].svgStyle
 * @memberof! oj.ojTreemap
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The label for this node.
 * @expose
 * @name nodes[].label
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @default null
 */
/**
 * Specifies whether drilling is enabled for the node. Drillable nodes will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all nodes at once, use the drilling attribute in the top level.
 * @expose
 * @name nodes[].drilling
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * The description of this node. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name nodes[].shortDesc
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The pattern used to fill the node.
 * @expose
 * @name nodes[].pattern
 * @memberof! oj.ojTreemap
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
 * @default "none"
 */
/**
 * The CSS style object defining the style of the label. The CSS white-space property can be defined with value "nowrap" to disable default text wrapping.
 * @expose
 * @name nodes[].labelStyle
 * @memberof! oj.ojTreemap
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The label display behavior for leaf nodes.
 * @expose
 * @name nodes[].labelDisplay
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "node"
 * @default "node"
 */
/**
 * The label display behavior for group nodes.
 * @expose
 * @name nodes[].groupLabelDisplay
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "node"
 * @ojvalue {string} "off"
 * @ojvalue {string} "header"
 * @default "header"
 */
/**
 * The horizontal alignment for labels displayed within the node.
 * @expose
 * @name nodes[].labelHalign
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "start"
 * @ojvalue {string} "end"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * The vertical alignment for labels displayed within the node.
 * @expose
 * @name nodes[].labelValign
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "top"
 * @ojvalue {string} "bottom"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * Specifies whether or not the node will be selectable.
 * @expose
 * @name nodes[].selectable
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * An object defining the properties for the node header.
 * @expose
 * @name nodes[].header
 * @memberof! oj.ojTreemap
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The horizontal alignment of the header title.
 * @expose
 * @name nodes[].header.labelHalign
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "center"
 * @ojvalue {string} "end"
 * @ojvalue {string} "start"
 * @default "start"
 */
/**
 * The CSS style object defining the style of the header title.
 * @expose
 * @name nodes[].header.labelStyle
 * @memberof! oj.ojTreemap
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * Specifies whether isolate behavior is enabled on the node.
 * @expose
 * @name nodes[].header.isolate
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "on"
 * @default "on"
 */
/**
 * Specifies whether the node color should be displayed in the header.
 * @expose
 * @name nodes[].header.useNodeColor
 * @memberof! oj.ojTreemap
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @default "off"
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for treemap nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojsubid oj-treemap-node
 * @memberof oj.ojTreemap
 *
 * @example <caption>Get the node at index 0 in the first layer, index 1 in the second:</caption>
 * var nodes = myTreemap.getNodeBySubId( {'subId': 'oj-treemap-node', 'indexPath': [0, 1]} );
 */

/**
 * <p>Sub-ID for the the treemap tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-treemap-tooltip
 * @memberof oj.ojTreemap
 * @instance
 * 
 * @example <caption>Get the tooltip object of the treemap, if displayed:</caption>
 * var nodes =  myTreemap.getNodeBySubId( {'subId': 'oj-treemap-tooltip'} );
 */
// Node Context Objects ********************************************************

/**
 * <p>Context for treemap nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojnodecontext oj-treemap-node
 * @memberof oj.ojTreemap
 */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojTreemapMeta = {
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
    "animationUpdateColor": {
      "type": "string"
    },
    "colorLabel": {
      "type": "string"
    },
    "displayLevels": {
      "type": "number"
    },
    "drilling": {
      "type": "string",
      "enumValues": ["on", "off"]
    },
    "groupGaps": {
      "type": "string",
      "enumValues": ["all", "none", "outer"]
    },
    "hiddenCategories": {
      "type": "Array<string>",
      "writeback": true
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
    "hoverBehaviorDelay": {
      "type": "number"
    },    "isolatedNode": {
      "type": "string",
      "writeback": true
    },
    "layout": {
      "type": "string",
      "enumValues": ["sliceAndDiceHorizontal", "sliceAndDiceVertical", "squarified"]
    },
    "nodeDefaults": {
      "type": "object",
      "properties": {
        "groupLabelDisplay": {
          "type": "string",
          "enumValues": ["node", "off", "header"]
        },
        "header": {
          "type": "object",
          "properties": {
            "backgroundColor": {
              "type": "string"
            },
            "borderColor": {
              "type": "string"
            },
            "hoverBackgroundColor": {
              "type": "string"
            },
            "hoverInnerColor": {
              "type": "string"
            },
            "hoverOuterColor": {
              "type": "string"
            },
            "isolate": {
              "type": "string",
              "enumValues": ["on", "off"]
            },
            "labelHalign": {
              "type": "string",
              "enumValues": ["center", "end", "start"] 
            },
            "labelStyle": {
              "type": "object"
            },
            "selectedBackgroundColor": {
              "type": "string"
            },
            "selectedInnerColor": {
              "type": "string"
            },
            "selectedOuterColor": {
              "type": "string"
            },
            "useNodeColor": {
              "type": "string",
              "enumValues": ["on", "off"]
            }
          }
        },
        "hoverColor": {
          "type": "string"
        },
        "labelDisplay": {
          "type": "string",
          "enumValues": ["off", "node"]
        },
        "labelHalign": {
          "type": "string",
          "enumValues": ["start", "end", "center"]
        },
        "labelStyle": {
          "type": "object"
        },
        "labelValign": {
          "type": "string",
          "enumValues": ["top", "bottom", "center"]
        },
        "selectedInnerColor": {
          "type": "string"
        },
        "selectedOuterColor": {
          "type": "string"
        }
      }
    },
    "nodes": {
      "type": "Array<object>|Promise"
    },
    "nodeContent": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "nodeSeparators": {
      "type": "string",
      "enumValues": ["bevels", "gap"]
    },
    "rootNode": {
      "type": "string"
    },
    "selection": {
      "type": "Array<string>",
      "writeback": true
    },
    "selectionMode": {
      "type": "string",
      "enumValues": ["none", "single", "multiple"]
    },
    "sizeLabel": {
      "type": "string"
    },
    "sorting": {
      "type": "string",
      "enumValues": ["on", "off"]
    },
    "tooltip": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
    },
    "touchResponse": {
      "type": "string",
      "enumValues": ["touchStart", "auto"]
    },
    "translations": {
      "type": "Object",
      "properties": {
        "componentName": {
          "type": "string",
          "value": "Treemap"
        },
        "labelAndValue": {
          "type": "string",
          "value": "{0}: {1}"
        },
        "labelClearSelection": {
          "type": "string",
          "value": "Clear Selection"
        },
        "labelColor": {
          "type": "string",
          "value": "Color"
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
        "labelSize": {
          "type": "string",
          "value": "Size"
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
        "tooltipIsolate": {
          "type": "string",
          "value": "Isolate"
        },
        "tooltipRestore": {
          "type": "string",
          "value": "Restore"
        }
      }
    }
  },
  "events": {
    "beforeDrill": {},
    "drill": {}
  },
  "methods": {
    "getContextByNode": {},
    "getNode": {}
  },
  "extension": {
    _WIDGET_NAME: "ojTreemap"
  }
};
oj.CustomElementBridge.registerMetadata('oj-treemap', 'dvtBaseComponent', ojTreemapMeta);
oj.CustomElementBridge.register('oj-treemap', {'metadata': oj.CustomElementBridge.getMetadata('oj-treemap')});
})();

});