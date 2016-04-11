/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtDiagram'], function(oj, $, comp, base, dvt)
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
 *    <tr>
 *       <td rowspan="3">Node or Link</td>
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
 * @memberof oj.ojDiagram
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
 *       <td><kbd>0 (zero)</kbd></td>
 *       <td>Zoom to fit.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Alt + 0 (zero)</kbd></td>
 *       <td>Zoom and center.</td>
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
 *       <td><kbd>LeftArrow or RightArrow</kbd></td>
 *       <td>When focus is on a node, move focus and selection to nearest node left/right.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow or DownArrow</kbd></td>
 *       <td>When focus is on a node, move focus and selection to nearest node up/down.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Alt + &lt; or Alt + &gt;</kbd></td>
 *       <td>Move focus from the node to a link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow or DownArrow</kbd></td>
 *       <td>When focus is on a link, navigate between links clockwise or counter clockwise.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow or RightArrow</kbd></td>
 *       <td>When focus is on a link, move focus from a link to a start or end node.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Select focused node / link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Space</kbd></td>
 *       <td>Multi-select node / link with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + &lt;node or link navigation shortcut&gt;</kbd></td>
 *       <td>Move focus and multi-select a node or a link.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + &lt;node or link navigation shortcut&gt;</kbd></td>
 *       <td>Move focus to a node or a link but do not select.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojDiagram
 */

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for diagram node at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-diagram-node
 * @memberof oj.ojDiagram
 *
 * @example <caption>Get the first diagram node:</caption>
 * var nodes = $( ".selector" ).ojDiagram( "getNodeBySubId", {'subId': 'oj-diagram-node', 'index': 0} );
 */

 /**
 * <p>Sub-ID for diagram link at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojsubid oj-diagram-link
 * @memberof oj.ojDiagram
 *
 * @example <caption>Get the first diagram link:</caption>
 * var nodes = $( ".selector" ).ojDiagram( "getNodeBySubId", {'subId': 'oj-diagram-link', 'index': 0} );
 */

/**
 * <p>Sub-ID for the the diagram tooltip.</p>
 *
 * @ojsubid oj-diagram-tooltip
 * @memberof oj.ojDiagram
 *
 * @example <caption>Get the tooltip object of the diagram, if displayed:</caption>
 * var nodes = $( ".selector" ).ojDiagram( "getNodeBySubId", {'subId': 'oj-diagram-tooltip'} );
 */

// Node Context Objects ********************************************************

/**
 * <p>Context for diagram node at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-diagram-node
 * @memberof oj.ojDiagram
 */

/**
 * <p>Context for diagram link at a specified index.</p>
 *
 * @property {number} index
 *
 * @ojnodecontext oj-diagram-link
 * @memberof oj.ojDiagram
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

 /**
 * @ojcomponent oj.ojDiagram
 * @augments oj.dvtBaseComponent
 * @since 1.1.0
 *
 * @classdesc
 * <h3 id="diagramOverview-section">
 *   JET Diagram Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diagramOverview-section"></a>
 * </h3>
 *
 * <p>Diagrams are used to display a set of nodes and the links between them.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojDiagram',
 *   layout : customLayoutObj.doLayout,
 *   nodes: [{id: N0, label: "Node 0",
 *            icon : {color: "#fdffcc", width: 10, height : 10}},
 *           {id: N1, label: "Node 1",
 *             icon : {color: "#2190e5", width: 20, height : 20}},
 *           {id: N2, label: "Node 2",
 *             icon : {color: "#5ea7d9", width: 30, height : 30}}],
 *   links : [{id: "L0", startNode : "N0", endNode : "N1"},
 *            {id: "L1", startNode : "N1", endNode : "N2"],
 *            {id: "L2", startNode : "N2", endNode : "N0"]]
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
 * <p>Animation should only be enabled for visualizations of small to medium data sets.
 * Alternate visualizations should be considered if identifying data changes is important,
 * since all nodes will generally move and resize on any data change.
 * </p>
 *
 * <h4>Data Set Size</h4>
 * <p>Applications should avoid setting very large data densities on this component.
 * Applications can aggregate small nodes to reduce the displayed data set size.
 * </p>
 *
 * <h4>Style Attributes</h4>
 * <p>Use the highest level options property available. For example, consider
 * using  attributes on <code class="prettyprint">styleDefaults.nodeDefaults</code>,
 * <code class="prettyprint">styleDefaults.linkDefaults</code>, instead of
 * attributes on the individual nodes and links. The component can take advantage of these
 * higher level attributes to apply the style properties on containers, saving
 * expensive DOM calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Diagram.
 *
 * @example <caption>Initialize the Diagram:</caption>
 * $(".selector").ojDiagram(layout : customLayoutObj.doLayout,
                            nodes:[{id:N0,label:"Node 0",icon:{color:"#fdffcc",width:10,height:10}},
                                   {id:N1,label:"Node 1",icon:{color:"#2190e5",width:20,height:20}},
                                   {id:N2,label:"Node 2",icon:{color:"#5ea7d9",width:30,height:30}}],
                            links:[{id:"L0",startNode:"N0",endNode:"N1"},
                                    {id:"L1",startNode:"N1",endNode:"N2"},
                                    {id:"L2",startNode:"N2",endNode:"N0"}]);
 */
oj.__registerWidget('oj.ojDiagram', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
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
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">optionChange</code> callback:</caption>
     * $(".selector").ojDiagram({
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
     * @memberof oj.ojDiagram
     * @instance
     */
    optionChange: null
  },

  //** @inheritdoc */
  _Render: function(isResize) {
    this.options['_logger'] = oj.Logger;
    if (this.options['_templateFunction']) {
      this.options['renderer'] = this._getTemplateRenderer(this.options['_templateFunction']);
    }
    if (this.options['renderer']) {
      this.options['_contextHandler'] = this._getContextHandler();
    }
    return this._super(isResize);
  },

  /**
   * Creates a callback function that will be used by DvtDiagramNode as a custom renderer
   * @param {Function} templateFunction template function used to render knockout template
   * @return {Function} a function that will be used by DvtDiagramNode as a custom renderer
   * @private
   * @instance
   * @memberof oj.ojDiagram
   */
  _getTemplateRenderer: function(templateFunction) {
    var thisRef = this;
    var templateHandlerFunc = function (context) {
      var dummyDiv = document.createElement("div");
      dummyDiv.style.display = "none";
      dummyDiv._dvtcontext = thisRef._context;
      thisRef.element.append(dummyDiv);
      templateFunction({'parentElement':dummyDiv, 'data': context['data']});
      var elem = dummyDiv.children[0];
      if (elem && elem.namespaceURI === 'http://www.w3.org/2000/svg') {
        dummyDiv.removeChild(elem);
        $(dummyDiv).remove();
        return elem;
      }
      else if (elem) {
        return thisRef._GetDvtComponent(elem);
      }
      return null;
    };
    return templateHandlerFunc;
  },

  /**
   * Creates a callback function that will be used by DvtDiagramNode to populate context for the custom renderer
   * @return {Function} context handler callback used to create context for a custom renderer
   * @private
   * @instance
   * @memberof oj.ojDiagram
   */
  _getContextHandler: function() {
    var thisRef = this;
    var contextHandlerFunc = function (parentElement, rootElement, data, state, previousState) {
      var context = {
        'component': oj.Components.getWidgetConstructor(thisRef.element),
        'parentElement': parentElement,
        'rootElement': rootElement,
        'data': data,
        'state': state,
        'previousState' : previousState,
        'id' : data['id'],
        'type' :  'node',
        'label' : data ['label']
      };
      return context;
    }
    return contextHandlerFunc;
  },

  /**
   * Renders default hover effect for the diagram node
   * @param {Object} context - property object with the following fields
   * <ul>
   *  <li>{Function} component - ojDiagram widget constructor</li>
   *  <li>{Object} data - a data object for the node</li>
   *  <li>{SVGElement} parentElement  - a parent group element that takes a custom SVG fragment as the node content. Used for measurements and reading properties.
   *                Modifications of the parentElement are not supported</li>
   *  <li>{SVGElement} rootElement  - an SVG fragment created as a node content passed for subsequent modifications</li>
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{string} id - node id</li>
   *  <li>{string} type - object type - node</li>
   *  <li>{string} label - object label</li>
   * </ul>
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  renderDefaultHover: function (context) {
    if (!context['previousState'] || context['state']['hovered'] != context['previousState']['hovered']) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultHoverEffect(context['id'], context['state']['hovered']);
    }
  },

  /**
   * Renders default selection effect for the diagram node
   * @param {Object} context - property object with the following fields
   * <ul>
   *  <li>{Function} component - ojDiagram widget constructor</li>
   *  <li>{Object} data - a data object for the node</li>
   *  <li>{SVGElement} parentElement  - a parent group element that takes a custom SVG fragment as the node content. Used for measurements and reading properties.
   *                Modifications of the parentElement are not supported</li>
   *  <li>{SVGElement} rootElement  - an SVG fragment created as a node content passed for subsequent modifications</li>
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{string} id - node id</li>
   *  <li>{string} type - object type - node</li>
   *  <li>{string} label - object label</li>
   * </ul>
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  renderDefaultSelection: function (context) {
    if (!context['previousState'] || context['state']['selected'] != context['previousState']['selected']) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultSelectionEffect(context['id'], context['state']['selected']);
    }
  },

  /**
   * Renders default focus effect for the diagram node
   * @param {Object} context - property object with the following fields
   * <ul>
   *  <li>{Function} component - ojDiagram widget constructor</li>
   *  <li>{Object} data - a data object for the node</li>
   *  <li>{SVGElement} parentElement  - a parent group element that takes a custom SVG fragment as the node content. Used for measurements and reading properties.
   *                Modifications of the parentElement are not supported</li>
   *  <li>{SVGElement} rootElement  - an SVG fragment created as a node content passed for subsequent modifications</li>
   *  <li>{Object} state  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{Object} previousState  - property object with the following boolean properties: hovered, selected, focused, zoom</li>
   *  <li>{string} id - node id</li>
   *  <li>{string} type - object type - node</li>
   *  <li>{string} label - object label</li>
   * </ul>
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  renderDefaultFocus: function (context) {
    if (!context['previousState'] || context['state']['focused'] != context['previousState']['focused']) {
      var comp = this._GetDvtComponent(this.element);
      comp.processDefaultFocusEffect(context['id'], context['state']['focused']);
    }
  },

  //** @inheritdoc */
  _CreateDvtComponent : function(context, callback, callbackObj) {
    return dvt.Diagram.newInstance(context, callback, callbackObj);
  },

  //** @inheritdoc */
  _ConvertLocatorToSubId : function(locator) {
    var subId = locator['subId'];

    // Convert the supported locators
    if(subId == 'oj-diagram-link') {
      // link[index]
      subId = 'link[' + locator['index'] + ']';
    }
    else if(subId == 'oj-diagram-node') {
      // node[index]
      subId = 'node[' + locator['index'] + ']';
    }
    else if(subId == 'oj-diagram-tooltip') {
      subId = 'tooltip';
    }

    // Return the converted result or the original subId if a supported locator wasn't recognized. We will remove
    // support for the old subId syntax in 1.2.0.
    return subId;
  },

  //** @inheritdoc */
  _ConvertSubIdToLocator : function(subId) {
    var locator = {};

    if(subId.indexOf('link') == 0) {
      // link[index]
      locator['subId'] = 'oj-diagram-link';
      locator['index'] = this._GetFirstIndex(subId);
    }
    else if(subId.indexOf('node') == 0) {
      // node[index]
      locator['subId'] = 'oj-diagram-node';
      locator['index'] = this._GetFirstIndex(subId);
    }
    else if(subId == 'tooltip') {
      locator['subId'] = 'oj-diagram-tooltip';
    }

    return locator;
  },

  //** @inheritdoc */
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-diagram');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses['oj-diagram-node-label'] = {'path': 'styleDefaults/nodeDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-diagram-node oj-selected'] = {'path': 'styleDefaults/nodeDefaults/selectionColor', 'property': 'border-color'};
    styleClasses['oj-diagram-node oj-hover'] = [
      {'path': 'styleDefaults/nodeDefaults/hoverOuterColor', 'property': 'border-top-color'},
      {'path': 'styleDefaults/nodeDefaults/hoverInnerColor', 'property': 'border-bottom-color'}
    ];
    styleClasses['oj-diagram-link'] = {'path': 'styleDefaults/linkDefaults/color', 'property': 'color'};
    styleClasses['oj-diagram-link-label'] = {'path': 'styleDefaults/linkDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-diagram-link oj-selected'] = {'path': 'styleDefaults/linkDefaults/selectionColor', 'property': 'border-color'};
    styleClasses['oj-diagram-link oj-hover'] = [
      {'path': 'styleDefaults/linkDefaults/hoverOuterColor', 'property': 'border-top-color'},
      {'path': 'styleDefaults/linkDefaults/hoverInnerColor', 'property': 'border-bottom-color'}
    ];
    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['optionChange'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtUtilBundle.DIAGRAM'] = translations['componentName'];
    return ret;
  },

  /**
   * Returns number of diagram nodes
   * @return {Number} The number of nodes
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getNodeCount: function() {
    var auto = this._component.getAutomation();
    return auto.getNodeCount();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the diagram node at the
   * specified index.
   *
   * @param {String} nodeIndex Node index
   * @property {string} background The background style for the node.
   * @property {Object|null} icon The icon for the node, or null if none exists.
   * @property {string} icon.color The color of the icon
   * @property {string} icon.shape The shape of the icon
   * @property {string} label Node label
   * @property {boolean} selected The selected state of the node
   * @property {string} tooltip Node tooltip
   * @return {Object|null} An object containing properties for the node at the given index, or null if none exists.
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getNode: function(nodeIndex) {
    var auto = this._component.getAutomation();
    return auto.getNode(nodeIndex);
  },

  /**
   * Returns number of diagram links
   * @return {Number} The number of links
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getLinkCount: function() {
    var auto = this._component.getAutomation();
    return auto.getLinkCount();
  },

  /**
   * Returns an object with the following properties for automation testing verification of the diagram link at the
   * specified index.
   *
   * @param {number} linkIndex Link index
   * @property {string} color Link color
   * @property {string} label Link label
   * @property {string} endConnectorType The type of end connector on the link
   * @property {string} endNode The id of the end node.
   * @property {boolean} selected The selected state of the link
   * @property {string} startConnectorType The type of start connector on the link
   * @property {string} startNode The id of the start node.
   * @property {string} style Link style
   * @property {string} tooltip Link tooltip
   * @property {number} width Link width
   * @return {Object|null} An object containing properties for the link at the given index, or null if none exists.
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getLink: function(linkIndex) {
    var auto = this._component.getAutomation();
    return auto.getLink(linkIndex);
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
   * @memberof oj.ojDiagram
   */
  getContextByNode: function(node) {
    // context objects are documented with @ojnodecontext
    var context = this.getSubIdByNode(node);
    if (context && context['subId'] !== 'oj-diagram-tooltip')
      return context;

    return null;
  },

  //** @inheritdoc */
  _GetComponentDeferredDataPaths : function() {
    return {'root': ['nodes', 'links']};
  }
});

});
