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
 * @ojcomponent oj.ojSunburst
 * @augments oj.dvtBaseComponent
 * @since 0.7
 * @ojstatus preview
 * @ojrole application
 * @ojshortdesc An interactive data visualization in which hierarchical data is represented in concentric rings.  Each ring segment is proportionally sized relative to the other segments at a given level.
 * @ojtsignore
 *
 * @classdesc
 * <h3 id="sunburstOverview-section">
 *   JET Sunburst
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sunburstOverview-section"></a>
 * </h3>
 *
 * <p>Sunbursts are used to display hierarchical data across two dimensions, represented by
 * the size and color of the sunburst nodes.</p>
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-sunburst
 *    nodes='[{"value": 100, "color": "#FFFF00", "label": "Total Sales",
 *             "nodes": [{"value": 75, "color": "#00FF00", "label": "Candy"},
 *                       {"value": 20, "color": "#FFFF00", "label": "Fruit"},
 *                       {"value": 15, "color": "#FF0000", "label": "Vegetables"}]}]'>
 * &lt;/oj-sunburst>
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
 *    on the individual nodes. The sunburst can take advantage of these higher level properties to apply the style properties on
 *    containers, saving expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"fragment_trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 */
oj.__registerWidget('oj.ojSunburst', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Specifies the animation duration in milliseconds. For data change animations with multiple stages, 
     * this attribute defines the duration of each stage. For example, if an animation contains two stages, 
     * the total duration will be two times this attribute's value. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name animationDuration
     * @memberof oj.ojSunburst
     * @instance
     * @type {number}
     * @ojunits milliseconds
     */
    animationDuration: undefined,
    
    /**
     * Specifies the animation that is applied on data changes.
     * @expose
     * @name animationOnDataChange
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @default ""
     */
    animationUpdateColor: "",
    
    /**
     * The number of levels of nodes to display. By default all nodes are displayed.
     * @expose
     * @name displayLevels
     * @memberof oj.ojSunburst
     * @instance
     * @type {number}
     * @default Number.MAX_VALUE
     */
    displayLevels: Number.MAX_VALUE,
    
    /**
     * Specifies the key set containing the ids of sunburst nodes that should be expanded on initial render.
     * Use the <a href="ExpandedKeySet.html">ExpandedKeySet</a> class to specify nodes to expand.
     * Use the <a href="ExpandAllKeySet.html">ExpandAllKeySet</a> class to expand all nodes.                 
     * By default, all sunburst nodes are expanded.
     * @expose
     * @name expanded
     * @memberof oj.ojSunburst
     * @instance
     * @type {KeySet}
     * @default new ExpandAllKeySet()
     * @ojwriteback
     */
    expanded: new oj.ExpandAllKeySet(),
    
    /**
     * An array of category strings used for filtering. Nodes with any category matching an item in this array will be filtered.
     * @expose
     * @name hiddenCategories
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
     * @instance
     * @type {number}
     * @default 200
     * @ojunits milliseconds
     */
    hoverBehaviorDelay: 200,
    
    /**
     * An object containing an optional callback function for tooltip customization. 
     * @expose
     * @name tooltip
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object}
     * @default {"renderer": null}
     */
    tooltip: {
      /**
       *  A function that returns a custom tooltip. The function takes a dataContext argument,
       *  provided by the sunburst, with the following properties:
       *  <ul>
       *    <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li>
       *    <li>id: The id of the hovered node.</li>
       *    <li>label: The label of the hovered node.</li>
       *    <li>value: The value of the hovered node.</li>
       *    <li>radius: The radius of the hovered node.</li>
       *    <li>color: The color of the hovered node.</li>
       *    <li>data: The data object of the hovered node.</li>
       *    <li>componentElement: The sunburst element.</li>
       *  </ul>
       *  The function should return an Object that contains only one of the two properties:
       *  <ul>
       *    <li>insert: HTMLElement | string - An HTML element, which will be appended to the tooltip, or a tooltip string.</li> 
       *    <li>preventDefault: <code>true</code> - Indicates that the tooltip should not be displayed. It is not necessary to return {preventDefault:false} to display tooltip, since this is a default behavior.</li> 
       *  </ul>
       * @expose
       * @name tooltip.renderer
       * @memberof! oj.ojSunburst
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       */
      renderer: null
    },
    /**
     * Specifies the selection mode.
     * @expose
     * @name selectionMode
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @ojvalue {string} "none"
     * @ojvalue {string} "single"
     * @ojvalue {string} "multiple"
     * @default "multiple"
     */
    selectionMode: "multiple",
    
    /**
     * Specifies whether client side rotation is enabled.
     * @expose
     * @name rotation
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @ojvalue {string} "off"
     * @ojvalue {string} "on"
     * @default "on"
     */
    rotation: "on",
    
    /**
     * Specifies whether whether the nodes are sorted by size. When sorting is enabled, nodes that have the same parent are sorted in order of descending size.
     * @expose
     * @name sorting
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     */
    sorting: "off",
    
    /**
     * An object defining custom root node content for the sunburst.
     * @expose
     * @name rootNodeContent
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object}
     * @default {"renderer": null}
     */
    rootNodeContent: {
      /**
       * A function that returns custom root node content. The function takes a dataContext argument,
       * provided by the sunburst, with the following properties:
       * <ul>
       *   <li>outerBounds: Object containing (x, y, width, height) of the rectangle circumscribing the root node area. 
       *   The x and y coordinates are relative to the top, left corner of the element.</li>
       *   <li>innerBounds: Object containing (x, y, width, height) of the rectangle inscribed in the root node area. 
       *   The x and y coordinates are relative to the top, left corner of the element.</li>
       *   <li>id: The id of the root node.</li>
       *   <li>data: The data object of the root node.</li>
       *   <li>componentElement: The sunburst element.</li>
       * </ul>
       * The function should return an Object with the following property: 
       * <ul>
       *    <li>insert: HTMLElement - HTML element, which will be overlaid on top of the sunburst. 
       *    This HTML element will block interactivity of the sunburst by default, but the CSS pointer-events 
       *    property can be set to 'none' on this element if the sunburst's interactivity is desired. 
       *    </li> 
       * </ul>
       * @expose
       * @name rootNodeContent.renderer
       * @memberof! oj.ojSunburst
       * @instance
       * @type {function(Object):Object|null}
       * @default null
       */
       renderer: null
    },
    
    /**
     * Specifies the starting angle of the sunburst. Valid values are numbers between 0 and 360.
     * @expose
     * @name startAngle
     * @memberof oj.ojSunburst
     * @instance
     * @type {number}
     * @default 90
     * @ojunits degrees
     * @ojmin 0
     * @ojmax 360
     * @ojwriteback
     */
    startAngle: 90,
    
    /**
     * Specifies the label describing the color metric of the sunburst. This label will be used in the legend.
     * @expose
     * @name colorLabel
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @default ""
     */
    colorLabel: "",
    
    /**
     * Specifies the label describing the size metric of the sunburst. This label will be used in the legend.
     * @expose
     * @name sizeLabel
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @default ""
     */
    sizeLabel: "",
    
    /**
     * Specifies whether drilling is enabled. Drillable nodes will show a pointer cursor on hover and fire an <code class="prettyprint">ojBeforeDrill</code> and <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). Drilling on a node causes a property change to the rootNode attribute. The displayLevels attribute can be used in conjunction with drilling to display very deep hieracrchies. Use "on" to enable drilling for all nodes. To enable or disable drilling on individual nodes use the drilling attribute in each node.
     * @expose
     * @name drilling
     * @memberof oj.ojSunburst
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
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @default ""
     */
    rootNode: "",
    
    /**
     * An array of objects with the following properties that defines the data for the nodes. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
     * @expose
     * @name nodes
     * @memberof oj.ojSunburst
     * @instance
     * @type {Array.<Object>|Promise|null}
     * @default null
     */
    nodes: null,
    
    /**
     * An object defining default properties for the nodes. Component CSS classes should be used to set component wide styling. 
     * This API should be used only for styling a specific instance of the component. Properties specified on this object may 
     * be overridden by specifications on the sunburst nodes. Some property default values come from the CSS and varies based on theme.
     * @expose
     * @name nodeDefaults
     * @memberof oj.ojSunburst
     * @instance
     * @type {Object}
     * @default {"borderWidth": 1, "showDisclosure": "off", "labelMinLength": 1, "labelDisplay": "auto", "labelHalign": "center"}
     */
     nodeDefaults: {
       /**
        * The default border color of the nodes.
        * @expose
        * @name nodeDefaults.borderColor
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        */
       borderColor: "rgba(255,255,255,0.3)",
       
       /**
        * The default border width of the nodes.
        * @expose
        * @name nodeDefaults.borderWidth
        * @memberof! oj.ojSunburst
        * @instance
        * @type {number}
        * @default 1
        * @ojunits pixels
        */
       borderWidth: 1,
       
       /**
        * Specifies whether to display the expand/collapse button on hover. If the button is clicked, the expanded attribute is updated with the new array of node ids.
        * @expose
        * @name nodeDefaults.showDisclosure
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        * @ojvalue {string} "on"
        * @ojvalue {string} "off"
        * @default "off"
        */
       showDisclosure: "off",
      
       /**
        * The horizontal alignment for labels displayed within the node. Only applies to rotated text.
        * @expose
        * @name nodeDefaults.labelHalign
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        * @ojvalue {string} "inner"
        * @ojvalue {string} "outer"
        * @ojvalue {string} "center"
        * @default "center"
        */
       labelHalign: "center",
       
       /**
        * The CSS style object defining the style of the label. The default value comes from the CSS and varies based on theme.
        * @expose
        * @name nodeDefaults.labelStyle
        * @memberof! oj.ojSunburst
        * @instance
        * @type {Object}
        */
       labelStyle: undefined,
       
       /**
        * The minimum number of visible characters needed in order to render a truncated label. If the minimum is not met when calculating the truncated label then the label is not displayed.
        * @expose
        * @name nodeDefaults.labelMinLength
        * @memberof! oj.ojSunburst
        * @instance
        * @type {number}
        * @default 1
        */
       labelMinLength: 1,
       
       /**
        * The label display behavior for the nodes. More labels are generally displayed when using rotation, with the trade off of readability. When auto is used, rotated or horizontal labels will be used based on the client browser and platform.
        * @expose
        * @name nodeDefaults.labelDisplay
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        * @ojvalue {string} "horizontal"
        * @ojvalue {string} "rotated"
        * @ojvalue {string} "off"
        * @ojvalue {string} "auto"
        * @default "auto"
        */
       labelDisplay: "auto",
       
       /**
        * The color of the node hover feedback. The default value comes from the CSS and varies based on theme.
        * @expose
        * @name nodeDefaults.hoverColor
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        */
       hoverColor: undefined,
       
       /**
        * The inner color of the node selection feedback. The default value comes from the CSS and varies based on theme.
        * @expose
        * @name nodeDefaults.selectedInnerColor
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        */
       selectedInnerColor: undefined,
       
       /**
        * The outer color of the node selection feedback. The default value comes from the CSS and varies based on theme.
        * @expose
        * @name nodeDefaults.selectedOuterColor
        * @memberof! oj.ojSunburst
        * @instance
        * @type {string}
        */
       selectedOuterColor: undefined  
     },
    
    /**
     * An array containing the ids of the initially selected nodes.
     * @expose
     * @name selection
     * @memberof oj.ojSunburst
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     */
    selection: [],
    
    /**
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if panning is not available for those elements that support the feature. 
     * @expose
     * @name touchResponse
     * @memberof oj.ojSunburst
     * @instance
     * @type {string}
     * @ojvalue {string} "touchStart"
     * @ojvalue {string} "auto"
     * @default "auto"
     */
    touchResponse: "auto",
     
    /**
     * Triggered during user rotation of the sunburst.
     *
     * @property {number} value the start angle of the sunburst, in degrees
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    rotateInput : null,
    /**
     * Triggered immediately before any node in the sunburst is drilled into. The drill event can be vetoed if the beforeDrill callback returns false.
     *
     * @property {string} id the id of the drilled node
     * @property {Object} data the data object of the drilled node
     * 
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    beforeDrill: null,
    /**
     * Triggered during a drill gesture (double click if selection is enabled, single click otherwise).
     *
     * @property {string} id the id of the drilled node
     * @property {Object} data the data object of the drilled node
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    drill: null,
     /**
     * Triggered immediately before any node in the sunburst is expanded. The expand event can be vetoed if the beforeExpand callback returns false.
     *
     * @property {string} id the id of the node to expand
     * @property {Object} data the data object of the node to expand
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    beforeExpand: null,
    /**
     * Triggered when a node has been expanded. The ui object contains one property, "nodeId", which is the id of the node that has been expanded.
     *
     * @property {string} id the id of the expanded node
     * @property {Object} data the data object of the expanded node
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */    
    expand: null,
    /**
     * Triggered immediately before any container node in the sunburst is collapsed. The collapse event can be vetoed if the beforeCollapse callback returns false.
     *
     * @property {string} id the id of the node to collapse
     * @property {Object} data the data object of the node to collapse
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    beforeCollapse: null,
    /**
     * Triggered when a node has been collapsed.
     *
     * @property {string} id the id of the collapsed node
     * @property {Object} data the data object of the collapsed node
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */        
    collapse: null
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return dvt.Sunburst.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-sunburst-node') {
      // node[index0][index1]...[indexN]
      subId = 'node' + this._GetStringFromIndexPath(locator['indexPath']);
    }
    else if(subId == 'oj-sunburst-tooltip') {
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
      locator['subId'] = 'oj-sunburst-node';
      locator['indexPath'] = this._GetIndexPath(subId);
    }
    else if(subId == 'tooltip') {
        locator['subId'] = 'oj-sunburst-tooltip';
    }
    return locator;
  },

  //** @inheritdoc */
  _ProcessOptions: function() {
    this._super();
    var rootNodeContent = this.options['rootNodeContent'];
    if (rootNodeContent && rootNodeContent['_renderer'])
      rootNodeContent['renderer'] = this._GetTemplateRenderer(rootNodeContent['_renderer'], 'rootNodeContent');
    
    // if expanded not declared, pass default expandAll key set to the toolkit  
    if (!this.options['expanded'])
      this.options['expanded'] = new oj.ExpandAllKeySet();
  },

  //** @inheritdoc */
  _GetComponentRendererOptions: function() {
    return ['tooltip/renderer', 'rootNodeContent/renderer'];
  },
  
  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-sunburst');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-dvtbase oj-sunburst'] = {'path': 'animationDuration', 'property': 'ANIM_DUR'};
    styleClasses['oj-sunburst-attribute-type-text'] = {'path' : 'styleDefaults/_attributeTypeTextStyle', 'property' : 'TEXT'};
    styleClasses['oj-sunburst-attribute-value-text'] = {'path' : 'styleDefaults/_attributeValueTextStyle', 'property' : 'TEXT'};
    styleClasses['oj-sunburst-drill-text'] = {'path' : 'styleDefaults/_drillTextStyle', 'property' : 'TEXT'};
    styleClasses['oj-sunburst-current-drill-text'] = {'path' : 'styleDefaults/_currentTextStyle', 'property' : 'TEXT'};
    styleClasses['oj-sunburst-node'] = {'path' : 'nodeDefaults/labelStyle', 'property' : 'TEXT'};
    styleClasses['oj-sunburst-node oj-hover'] = {'path' : 'nodeDefaults/hoverColor', 'property' : 'border-top-color'};
    styleClasses['oj-sunburst-node oj-selected'] = [
      {'path' : 'nodeDefaults/selectedOuterColor', 'property' : 'border-top-color'},
      {'path' : 'nodeDefaults/selectedInnerColor', 'property' : 'border-bottom-color'}
    ];
    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['optionChange', 'rotateInput','beforeDrill', 'drill', 'beforeExpand', 'expand', 'beforeCollapse', 'collapse'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtSunburstBundle.COLLAPSE'] = translations['tooltipCollapse'];
    ret['DvtSunburstBundle.COLOR'] = translations['labelColor'];
    ret['DvtSunburstBundle.EXPAND'] = translations['tooltipExpand'];
    ret['DvtSunburstBundle.SIZE'] = translations['labelSize'];
    ret['DvtUtilBundle.SUNBURST'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _HandleEvent : function(event) {
    var type = event['type'];
    var eventData = {'id': event['id'], 'data': event['data']};
    if (!this._IsCustomElement())
      eventData['component'] = event['component'];
  
    if(type === 'rotation') {
      if(event['complete'])
        this._UserOptionChange('startAngle', event['startAngle']);
      else
        this._trigger('rotateInput', null, {'value': event['startAngle']});
    }
    else if(type == 'drill') {
      if(event['id'] && this._trigger('beforeDrill', null, eventData)) {
        this._UserOptionChange('rootNode', event['id']);
        this._Render();
        this._trigger('drill', null, eventData);
      }
    }
    else if(type == 'expand') {
      if(event['id'] && this._trigger('beforeExpand', null, eventData)) {
        this._UserOptionChange('expanded', event['expanded']);
        this._Render();
        this._trigger('expand', null, eventData);
      }
    }
    else if(type == 'collapse') {
      if(event['id'] && this._trigger('beforeCollapse', null, eventData)) {
        this._UserOptionChange('expanded', event['expanded']);
        this._Render();
        this._trigger('collapse', null, eventData);
      }
    }
    else {
      this._super(event);
    }
  },

  //** @inheritdoc */
  _LoadResources : function() {
    // Ensure the resources object exists
    if(this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];

    // Add cursors
    resources['rotateCursor'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/sunburst/rotate.cur');
    
    resources['expand'] = 'oj-sunburst-expand-icon';
    resources['expandOver'] = 'oj-sunburst-expand-icon oj-hover';
    resources['expandDown'] = 'oj-sunburst-expand-icon oj-active';
    resources['collapse'] = 'oj-sunburst-collapse-icon';
    resources['collapseOver'] = 'oj-sunburst-collapse-icon oj-hover';
    resources['collapseDown'] = 'oj-sunburst-collapse-icon oj-active';
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
   * @memberof oj.ojSunburst
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
   * @memberof oj.ojSunburst
   */
  getContextByNode: function(node)
  {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context['subId'] !== 'oj-sunburst-tooltip')
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
 *     <tr>
 *       <td>Outer Edge</td>
 *       <td><kbd>Drag</kbd></td>
 *       <td>Rotate when <code class="prettyprint">rotation</code> is enabled.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojSunburst
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
 *       <td>
 *         Move focus and selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move away from the center, while it will move towards the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>
 *         Move focus and selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move towards the center, while it will move away from the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection counterclockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection clockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>
 *         Move focus and extend selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move away from the center, while it will move towards the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>
 *         Move focus and extend selection to the first adjacent sector in an inner or outer layer (ring). In
 *         the northern hemisphere of the sunburst, this will move towards the center, while it will move away from the
 *         center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and extend selection counterclockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and extend selection clockwise to adjacent sector in the same layer (ring).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>
 *         Move focus to the first adjacent sector in an inner or outer layer (ring), without changing the
 *         current selection. In the northern hemisphere of the sunburst, this will move away from the center, while it
 *         will move towards the center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>
 *         Move focus to the first adjacent sector in an inner or outer layer (ring), without changing the
 *         current selection. In the northern hemisphere of the sunburst, this will move towards the center, while it
 *         will move away from the center in the southern hemisphere of the sunburst.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus counterclockwise to adjacent sector in the same layer (ring), without changing the current
 *       selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus clockwise to adjacent sector in the same layer (ring), without changing the current
 *       selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select sectors with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Alt + LeftArrow</kbd></td>
 *       <td>Rotate 5 degrees counterclockwise.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Alt + RightArrow</kbd></td>
 *       <td>Rotate 5 degrees clockwise.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Drill on a node when <code class="prettyprint">drilling</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>+</kbd></td>
 *       <td>Expand a node when <code class="prettyprint">showDisclosure</code> is enabled and the node is expandable.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>-</kbd></td>
 *       <td>Collapse a node when <code class="prettyprint">showDisclosure</code> is enabled and the node is collapsable.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSunburst
 */

/**
 * The border color of the node.
 * @expose
 * @name nodes[].borderColor
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border width of the node.
 * @expose
 * @name nodes[].borderWidth
 * @memberof! oj.ojSunburst
 * @instance
 * @type {number}
 * @default null
 */
/**
 * An array of objects with properties for the child nodes.
 * @expose
 * @name nodes[].nodes
 * @memberof! oj.ojSunburst
 * @instance
 * @type {Array.<Object>}
 * @default null
 */
/**
 * The id of the node.
 * @expose
 * @name nodes[].id
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend and other visualization elements. The categories array of each node is required to be a superset of the categories array of its parent node. If not specified, the ids of the node and its ancestors will be used.
 * @expose
 * @name nodes[].categories
 * @memberof! oj.ojSunburst
 * @instance
 * @type {Array.<string>}
 * @default null
 */
/**
 * The relative size of the node.
 * @expose
 * @name nodes[].value
 * @memberof! oj.ojSunburst
 * @instance
 * @type {number}
 * @default null
 */
/**
 * The fill color of the node.
 * @expose
 * @name nodes[].color
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The CSS style class to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name nodes[].svgClassName
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the node. The style class and inline style will override any other styling specified through the properties. For tooltip interactivity, it's recommended to also pass a representative color to the node color attribute.
 * @expose
 * @name nodes[].svgStyle
 * @memberof! oj.ojSunburst
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The label for this node.
 * @expose
 * @name nodes[].label
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The horizontal alignment for labels displayed within the node. Only applies to rotated text.
 * @expose
 * @name nodes[].labelHalign
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @ojvalue {string} "inner"
 * @ojvalue {string} "outer"
 * @ojvalue {string} "center"
 * @default "center"
 */
/**
 * Specifies whether or not the node will be selectable.
 * @expose
 * @name nodes[].selectable
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * The description of this node. This is used for accessibility and also for customizing the tooltip text.
 * @expose
 * @name nodes[].shortDesc
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The pattern used to fill the node.
 * @expose
 * @name nodes[].pattern
 * @memberof! oj.ojSunburst
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
 * The CSS style object defining the style of the label.
 * @expose
 * @name nodes[].labelStyle
 * @memberof! oj.ojSunburst
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * Specifies whether to display the expand/collapse button on hover for a specific node. If the button is clicked, the expanded attribute is updated with the new array of node ids.
 * @expose
 * @name nodes[].showDisclosure
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * The label display behavior for the nodes. More labels are generally displayed when using rotation, with the trade off of readability. When auto is used, rotated or horizontal labels will be used based on the client browser and platform.
 * @expose
 * @name nodes[].labelDisplay
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @ojvalue {string} "horizontal"
 * @ojvalue {string} "rotated"
 * @ojvalue {string} "off"
 * @ojvalue {string} "auto"
 * @default "auto"
 */
/**
 * Specifies whether drilling is enabled for the node. Drillable nodes will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all nodes at once, use the drilling attribute in the top level.
 * @expose
 * @name nodes[].drilling
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string}
 * @ojvalue {string} "on"
 * @ojvalue {string} "off"
 * @ojvalue {string} "inherit"
 * @default "inherit"
 */
/**
 * The radius of the node relative to the other nodes.
 * @expose
 * @name nodes[].radius
 * @memberof! oj.ojSunburst
 * @instance
 * @type {number}
 * @default 1
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for sunburst nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojsubid oj-sunburst-node
 * @memberof oj.ojSunburst
 *
 * @example <caption>Get the node at index 0 in the first layer, index 1 in the second:</caption>
 * var nodes = mySunburst.getNodeBySubId( {'subId': 'oj-sunburst-node', 'indexPath': [0, 1]} );
 */

/**
 * <p>Sub-ID for the the sunburst tooltip.</p>
 * 
 * <p>See the <a href="#getNodeBySubId">getNodeBySubId</a> and 
 * <a href="#getSubIdByNode">getSubIdByNode</a> methods for details.</p>
 * 
 * @ojsubid
 * @member
 * @name oj-sunburst-tooltip
 * @memberof oj.ojSunburst
 * @instance
 * 
 * @example <caption>Get the tooltip object of the sunburst, if displayed:</caption>
 * var nodes = mySunburst.getNodeBySubId( {'subId': 'oj-sunburst-tooltip'} );
 */
// Node Context Objects ********************************************************

/**
 * <p>Context for sunburst nodes indexed by their position in the hierarchy.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the node.
 *
 * @ojnodecontext oj-sunburst-node
 * @memberof oj.ojSunburst
 */
/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojSunburstMeta = {
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
    "expanded" : {
      "writeback": true
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
    },    
    "nodeDefaults": {
      "type": "object",
      "properties": {
        "borderColor": {
          "type": "string"
        },
        "borderWidth": {
          "type": "number"
        },
        "hoverColor": {
          "type": "string"
        },
        "labelDisplay": {
          "type": "string",
          "enumValues": ["auto", "horizontal", "rotated", "off"]
        },
        "labelHalign": {
          "type": "string",
          "enumValues": ["inner", "outer", "center"]
        },
        "labelStyle": {
          "type": "object"
        },
        "selectedInnerColor": {
          "type": "string"
        },
        "selectedOuterColor": {
          "type": "string"
        },
        "showDisclosure": {
          "type": "string",
          "enumValues": ["on", "off"]
        }
      }
    },
    "nodes": {
      "type": "Array<object>|Promise"
    },
    "rootNode": {
      "type": "string"
    },
    "rotation": {
      "type": "string",
      "enumValues": ["off", "on"]
    },
    "rootNodeContent": {
      "type": "object",
      "properties": {
        "renderer": {}
      }
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
    "startAngle": {
      "type": "number",
      "writeback": true
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
          "value": "Sunburst"
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
        "tooltipCollapse": {
          "type": "string",
          "value": "Collapse"
        },
        "tooltipExpand": {
          "type": "string",
          "value": "Expand"
        }
      }
    }
  },
  "methods": {
    "getContextByNode": {},
    "getNode": {}
  },
  "events": {
    "rotateInput": {},
    "beforeDrill": {},
    "drill": {},
    "beforeExpand": {},
    "expand": {},
    "beforeCollapse": {},
    "collapse": {}
  },
  "extension": {
    _WIDGET_NAME: "ojSunburst"
  }
};
oj.CustomElementBridge.registerMetadata('oj-sunburst', 'dvtBaseComponent', ojSunburstMeta);
oj.CustomElementBridge.register('oj-sunburst', {'metadata': oj.CustomElementBridge.getMetadata('oj-sunburst')});
})();

});