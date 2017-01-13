/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
 * The knockout template used for stamping an SVG fragment or other data visualization as a diagram node. 
 * Only SVG fragments or data visualizations are currently supported.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option.
 * 
 * @ojbindingonly
 * @name template
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
 */

/**
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element. </li> 
 *   <li>id: The id of the hovered diagram object </li> 
 *   <li>type : The type of the hovered diagram object - "link" or "node" </li> 
 *   <li>label: The label of the hovered diagram object.</li>
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojDiagram
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
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
    optionChange: null,
    /**
     * Triggered immediately before any container node in the diagram is expanded.
     *
     * @property {Object} data event payload
     * @property {string} data.nodeId the id of the expanding object 
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">beforeExpand</code> callback:</caption>
     * $(".selector").ojDiagram({
     *   'beforeExpand': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeExpand</code> event:</caption>
     * $(".selector").on({
     *   'ojbeforeExpand': function (event, data) {};
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */
    beforeExpand: null,
    /**
     * Triggered when a node has been expanded. The ui object contains one property, "nodeId", which is the id of the node that has been expanded.
     *
     * @property {Object} data event payload
     * @property {string} data.nodeId the id of the expanded object 
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">expand</code> callback:</caption>
     * $(".selector").ojDiagram({
     *   'expand': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpand</code> event:</caption>
     * $(".selector").on({
     *   'ojexpand': function (event, data) {};
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */    
    expand: null,
    /**
     * Triggered immediately before any container node in the diagram is collapsed.
     *
     * @property {Object} data event payload
     * @property {string} data.nodeId the id of the collapsing object 
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">beforeCollapse</code> callback:</caption>
     * $(".selector").ojDiagram({
     *   'beforeCollapse': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeCollapse</code> event:</caption>
     * $(".selector").on({
     *   'ojbeforeCollapse': function (event, data) {};
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */
    beforeCollapse: null,
    /**
     * Triggered when a node has been collapsed.
     *
     * @property {Object} data event payload
     * @property {string} data.nodeId the id of the collapsed object 
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">collapse</code> callback:</caption>
     * $(".selector").ojDiagram({
     *   'collapse': function (event, data) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapse</code> event:</caption>
     * $(".selector").on({
     *   'ojcollapse': function (event, data) {};
     * });
     *
     * @expose
     * @event
     * @memberof oj.ojDiagram
     * @instance
     */        
    collapse: null
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
    var contextHandlerFunc = function (parentElement, rootElement, childContent, data, state, previousState) {
      var context = {
        'component': oj.Components.getWidgetConstructor(thisRef.element),
        'parentElement': parentElement,
        'rootElement': rootElement,
        'content' : childContent,
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
    return ['optionChange', 'beforeExpand', 'beforeCollapse', 'expand', 'collapse'];
  },
  
  //** @inheritdoc */
  _HandleEvent: function(event) {
    var type = event['type'];
    if (type === 'beforeExpand') {
      this.expand(event['id'], true);
    }    
    else if (type === 'beforeCollapse') {
      this.collapse(event['id'], true);
    }
    else if (type === 'expand' || type === 'collapse') {
      this._trigger(type, null, {'nodeId': event['id']});
    }
    else {
      this._super(event);
    }
  },

  //** @inheritdoc */
  _setOptions : function(options, flags) {
    if (options['expanded']) {
      this._component.clearDisclosedState();
    }
    // Call the super to update the property values
    this._superApply(arguments);
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtDiagramBundle.PROMOTED_LINK'] = translations['promotedLink'];
    ret['DvtDiagramBundle.PROMOTED_LINKS'] = translations['promotedLinks'];
    ret['DvtDiagramBundle.PROMOTED_LINK_ARIA_DESC'] = translations['promotedLinkAriaDesc'];    
    ret['DvtUtilBundle.DIAGRAM'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _LoadResources: function() {
    // Ensure the resources object exists
    if (this.options['_resources'] == null)
      this.options['_resources'] = {};

    var resources = this.options['_resources'];
    if (oj.DomUtils.getReadingDirection() === "rtl") {
      resources['collapse_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ena_rtl.svg'), 'width':20, 'height':20};
      resources['collapse_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ovr_rtl.svg'), 'width':20, 'height':20};
      resources['collapse_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-dwn_rtl.svg'), 'width':20, 'height':20};
      resources['expand_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ena_rtl.svg'), 'width':20, 'height':20};
      resources['expand_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ovr_rtl.svg'), 'width':20, 'height':20};
      resources['expand_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-dwn_rtl.svg'), 'width':20, 'height':20};      
    }
    else { //ltr
      resources['collapse_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ena.svg'), 'width':20, 'height':20};
      resources['collapse_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-ovr.svg'), 'width':20, 'height':20};
      resources['collapse_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-collapse-button-dwn.svg'), 'width':20, 'height':20};
      resources['expand_ena'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ena.svg'), 'width':20, 'height':20};
      resources['expand_ovr'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-ovr.svg'), 'width':20, 'height':20};
      resources['expand_dwn'] = {src: oj.Config.getResourceUrl('resources/internal-deps/dvt/diagram/container-expand-button-dwn.svg'), 'width':20, 'height':20};      
    }
  },

  /**
   * Collapses an expanded node. When vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.
   * @param {String} nodeId The id of the node to collapse
   * @param {boolean} vetoable Whether the event should be vetoable
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  collapse: function(nodeId, vetoable) {
    var result = this._trigger("beforeCollapse", null, {'nodeId': nodeId});
    if (!vetoable || result !== false) {
      this._component.collapse(nodeId);
    }
  },

  /**
   * Expands a collapsed parent node. When vetoable is set to false, beforeExpand event will still be fired but the event cannot be veto.
   * @param {String} nodeId The id of the node to expand
   * @param {boolean} vetoable Whether the event should be vetoable
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  expand: function(nodeId, vetoable) {
    var result = this._trigger("beforeExpand", null, {'nodeId': nodeId});
    if (!vetoable || result !== false) {
      this._component.expand(nodeId);
    }
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
   * Returns an object with the following properties for automation testing verification of the promoted link between 
   * specified nodes.
   *
   * @param {number} startNodeIndex Start node index
   * @param {number} endNodeIndex End node index
   * @property {string} color Link color
   * @property {string} endConnectorType The type of end connector on the link
   * @property {string} endNode The id of the end node.
   * @property {boolean} selected The selected state of the link
   * @property {string} startConnectorType The type of start connector on the link
   * @property {string} startNode The id of the start node.
   * @property {string} style Link style
   * @property {string} tooltip Link tooltip
   * @property {number} width Link width
   * @property {number} count Number of links it represents
   * @return {Object|null} An object containing properties for the link at the given index, or null if none exists.   
   * @expose
   * @instance
   * @memberof oj.ojDiagram
   */
  getPromotedLink: function(startNodeIndex, endNodeIndex) {
    var auto = this._component.getAutomation();
    return auto.getPromotedLink(startNodeIndex, endNodeIndex);
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

/**
 * @class 
 * @name oj.DiagramUtils
 * 
 * @classdesc
 * <h3>Diagram Layout UUtilities</h3>
 *
 * <p> DiagramUtils is a helper object that provides a function to generate a layout callback for ojDiagram out of JSON object. 
 * A JSON object contains positions for the nodes, paths for the links and properties for positioning a label for a node and a link.
 * See object details {@link oj.DiagramUtils.getLayout}
 *
 * <h3> Usage : </h3>
 * <pre class="prettyprint">
 * <code>
 * // create JSON object that contains positions for the nodes and SVG paths for the links
 * // the nodes and links are identified by ids
 * var data = {
 *  "nodes":[
 *   {"id":"N0", "x":100, "y":0},
 *   {"id":"N1", "x":200, "y":100},
 *   {"id":"N2", "x":100, "y":200},
 *   {"id":"N3", "x":0, "y":100}
 * ],
 * "links":[
 *   {"id":"L0", "path":"M120,20L220,120"},
 *   {"id":"L1", "path":"M220,120L120,220"},
 *   {"id":"L2", "path":"M120,220L20,120"},
 *   {"id":"L3", "path":"M20,120L120,20"}
 * ]
 * };
 * //generate the layout callback function using data and the oj.DiagramUtils
 * // pass the generated function to the oj.ojDiagram as the 'layout' option
 * var layoutFunc = oj.DiagramUtils.getLayout(data);
 * </code></pre>
 * @export
 * @constructor
 */
oj.DiagramUtils = function() {
};

/**
 * The complete label layout object used to position node and link label
 * @typedef {Object} oj.DiagramUtils~LabelLayout
 * @property {number} x x-coordinate for the label
 * @property {number} y y-coordinate for the label
 * @property {number} rotationPointX x-coordinate for label rotation point
 * @property {number} rotationPointY y-coordinate for label rotation point
 * @property {number} number angle of rotation for the labelLayout
 * @property {string} halign horizontal alignment for the label. Valid values are "left", "right" or "center"
 * @property {string} valign vertical alignment for the label. Valid values are "top", "middle", "bottom" or "baseline". 
 *                           The default value is <code class="prettyprint">"top"</code>
 */

/**
 * A function that generates the layout callback function for the ojDiagram component.
 * @param {Object} obj JSON object that defines positions of nodes, links paths and label layouts. The object supports the following properties.
 * @property {Array<Object>} obj.nodes An array of objects with the following properties that describe a position for the diagram node and a layout for the node's label
 * @property {number} obj.nodes.x x-coordinate for the node
 * @property {number} obj.nodes.y y-coordinate for the node
 * @property {Object} obj.nodes.labelLayout An object that defines label layout for the node. See {@link oj.DiagramUtils~LabelLayout} object. 
 *                                          The object defines absolute coordinates for label position.
 * @property {Array<Object>} obj.links An array of objects with the following properties that describe a path for the diagram link and a layout for the link's label.
 * @property {string} obj.links.path A string that represents an SVG path for the link.
 * @property {string} obj.links.coordinateSpace The coordinate container id for the. If specified the link points will be applied relative to that container. 
 *                                              If the value is not set, the link points are in the global coordinate space.
 * @property {Object} obj.links.labelLayout An object that defines label layout for the link. See {@link oj.DiagramUtils~LabelLayout} object.
 *
 * @property {Object} obj.nodeDefaults An object that defines the default layout of the node label
 * @property {Object|Function} obj.nodeDefaults.labelLayout An object that defines default label layout for diagram nodes.
 *                         See {@link oj.DiagramUtils~LabelLayout} object. The object defines relative coordinates for label position.
 *                         E.g. if all the node labels should be positioned with a certain offset relative to the node, 
 *                         a label position can be defined using an object in node defaults.
 *                         <p>Alternatively a label layout can be defined with a function. The function will receive the following parameters:
 *                           <ul>
 *                             <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                             <li>{DvtDiagramLayoutContextNode} - layout context for the current node</li>
 *                           </ul>
 *                           The return value of the function is a label object with the following properties : {@link oj.DiagramUtils~LabelLayout}. 
 *                           The object defines absolute coordinates for label position.
 *                          </p>
 * @property {Object} obj.linkDefaults An object that defines a function for generating a link path and a default layout for the link label
 * @property {Function} obj.linkDefaults.path a callback function that will be used to generate a link path. The function will receive the following parameters:
 *                      <ul>
 *                        <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                        <li>{DvtDiagramLayoutContextLink} - layout context for the current link</li>
 *                      </ul>
 *                      The return value of the function is a string that represents an SVG path for the link 
 * @property {Function} obj.linkDefaults.labelLayout a function that defines default label layout for diagram links. The function will receive the following parameters:
 *                      <ul>
 *                        <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                        <li>{DvtDiagramLayoutContextLink} - layout context for the current link</li>
 *                      </ul>
 *                      The return value of the function is a label object with the following properties {@link oj.DiagramUtils~LabelLayout}
 * @property {Object|Function} obj.viewport An object with the following properties that defines diagram viewport.
 *                         <p>Alternatively a viewport can be defined with a function. The function will receive the following parameters:
 *                           <ul>
 *                             <li>{DvtDiagramLayoutContext} - layout context for the diagram</li>
 *                           </ul>
 *                           The return value of the function is a viewport object with the properties defined below. 
 *                          </p>
 * @property {number} obj.viewport.x x-coordinate
 * @property {number} obj.viewport.y y-coordinate 
 * @property {number} obj.viewport.w width
 * @property {number} obj.viewport.h height
 * @returns {Function} layout callback function
 * @export
 */
oj.DiagramUtils.getLayout = function(obj) {
  var layoutFunc = function(layoutContext) {
    
    // position nodes and node labels
    if (obj['nodes'] && layoutContext.getNodeCount() > 0) {
      var nodesDataMap = oj.DiagramUtils._dataArrayToMap(obj['nodes']);
      var defaultLabelLayout = obj['nodeDefaults'] && obj['nodeDefaults']['labelLayout'] ? obj['nodeDefaults']['labelLayout'] : null;
      for (var ni = 0;ni < layoutContext.getNodeCount();ni++) {
        var node = layoutContext.getNodeByIndex(ni);
        var nodeData = nodesDataMap[node.getId()];
        oj.DiagramUtils._positionChildNodes(node.getChildNodes(), nodeData ? nodeData['nodes'] : null, layoutContext, defaultLabelLayout);
        oj.DiagramUtils._positionNodeAndLabel(node, nodeData, layoutContext, defaultLabelLayout);
      }
    }
    
    // position links and link labels
    if (obj['links'] && layoutContext.getLinkCount() > 0) {
      var linksDataMap = oj.DiagramUtils._dataArrayToMap(obj['links']);
      var defaultPath = obj['linkDefaults'] && obj['linkDefaults']['path'] ? obj['linkDefaults']['path'] : null;
      var defaultLabelLayout = obj['linkDefaults'] && obj['linkDefaults']['labelLayout'] ? obj['linkDefaults']['labelLayout'] : null;
      for (var li = 0;li < layoutContext.getLinkCount();li++) {
        var link = layoutContext.getLinkByIndex(li);
        var linkData = linksDataMap[link.getId()];
        if (linkData && linkData['path']) {
          link.setPoints(linkData['path']);
        }
        else if (defaultPath && defaultPath instanceof Function) {
          link.setPoints(defaultPath(layoutContext, link));
        }
        if (linkData && linkData['coordinateSpace']) {
          link.setCoordinateSpace(linkData['coordinateSpace']);
        }        
        //position label if it exists
        if (linkData['labelLayout']) {
          oj.DiagramUtils._setLabelPosition(link, linkData['labelLayout']);
        }
        else if (defaultLabelLayout && defaultLabelLayout instanceof Function ) {
          oj.DiagramUtils._setLabelPosition(link, defaultLabelLayout(layoutContext, link));
        }
      }
    }
    if (obj['viewport']){
      var viewport = obj['viewport'];
      if (viewport instanceof Function) {
        layoutContext.setViewport(viewport(layoutContext));
      }
      else {
        layoutContext.setViewport(viewport);
      }
    }
  };
  return layoutFunc;
};

/**
 * Converts a data array of nodes or links to a map
 * @param {Array} dataArray data array of node or links
 * @return {Object} a map of nodes or links
 * @private
 * @instance
 * @memberof oj.DiagramUtils
 */
oj.DiagramUtils._dataArrayToMap = function(dataArray) {
  var m = {};
  if (dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
      m[dataArray[i]['id']] = dataArray[i];
    }
  }
  return m;
};

/**
 * Positions child nodes and their labels
 * @param {Array} nodes An array of diagram nodes
 * @param {Array} nodesData An array of objects that describe a position for a diagram node and a layout for the node's label
 * @param {Object} layoutContext Layout context for diagram
 * @param {Object|Function} defaultLabelLayout Default label layout defined as an object or a function
 * @private
 */
oj.DiagramUtils._positionChildNodes =  function(nodes, nodesData, layoutContext, defaultLabelLayout){
  if (nodes && nodesData) {
    var nodesDataMap = oj.DiagramUtils._dataArrayToMap(nodesData);
    for (var ni = 0;ni < nodes.length;ni++) {
      var node = nodes[ni];
      var nodeData = nodesDataMap[node.getId()];
      oj.DiagramUtils._positionChildNodes(node.getChildNodes(), nodeData ? nodeData['nodes'] : null, layoutContext, defaultLabelLayout);
      oj.DiagramUtils._positionNodeAndLabel(node, nodeData, layoutContext, defaultLabelLayout);
    }
  }
};

/**
 * Position a diagram nodes and its label
 * @param {Object} node A node to position
 * @param {Object} nodeData An object that defines a position for the node and a layout for the node's label
 * @param {Object} layoutContext Layout context for diagram
 * @param {Object|Function} defaultLabelLayout Default label layout defined as an object or a function
 * @private
 */
oj.DiagramUtils._positionNodeAndLabel = function(node, nodeData, layoutContext, defaultLabelLayout) {
  if (node && nodeData) {
    node.setPosition({'x': nodeData['x'], 'y': nodeData['y']});
    //node has a label - position it
    if (nodeData['labelLayout']) { 
      //layout should be an object - expect absolute positions
      oj.DiagramUtils._setLabelPosition(node, nodeData['labelLayout']);
    }
    else if (defaultLabelLayout && defaultLabelLayout instanceof Function) {
      oj.DiagramUtils._setLabelPosition(node, defaultLabelLayout(layoutContext, node));
    }
    else if (defaultLabelLayout) {
      //layout should be an object - expect relative positions
      oj.DiagramUtils._setLabelPosition(node, defaultLabelLayout, node.getPosition());
    }
  }
};

/**
 * Sets label position for a link or a node
 * @param {Object} obj layout context for node or link
 * @param {Object} labelLayout an object with the following properties for the label layout
 * @property {number} x x-coordinate for the label position
 * @property {number} y y-coordinate for the label position
 * @property {number} rotationPointX x-coordinate for the rotation point
 * @property {number} rotationPointY y-coordinate for the rotation point
 * @property {number} angle angle for the angle of rotation
 * @property {string} halign horizontal alignment for the label
 * @property {string} valign vertical alignment for the label 
 * @param {Object=} offset an object with the following properties for the label offset
 * @property {number} x x-coordinate
 * @property {number} y y-coordinate
 * @private
 * @instance
 * @memberof oj.DiagramUtils
 */
oj.DiagramUtils._setLabelPosition = function(obj, labelLayout, offset) {
  offset = offset ? offset : {'x':0,'y':0};
  obj.setLabelPosition({'x': labelLayout['x'] + offset['x'], 'y': labelLayout['y'] + offset['y']});
  var rotationPointX = labelLayout['rotationPointX'], 
      rotationPointY = labelLayout['rotationPointY'];
  if (!isNaN(rotationPointX) && !isNaN(rotationPointY)) {
    obj.setLabelRotationPoint({'x':rotationPointX + offset['x'], 'y':rotationPointY + offset['y']});
  }
  obj.setLabelRotationAngle(labelLayout['angle']);
  obj.setLabelHalign(labelLayout['halign']);
  obj.setLabelValign(labelLayout['valign']);
};

/**
 * Ignore tag only needed for DVTs that have jsDoc in separate _doc.js files.
 * @ignore
 */
(function() {
var ojDiagramMeta = {
  "properties": {
    "animationOnDataChange": {
      "type": "string"
    },
    "animationOnDisplay": {
      "type": "string"
    },
    "expanded": {
      "type": "Array<string>|string"
    },
    "focusRenderer": {},
    "hiddenCategories": {
      "type": "Array<string>"
    },
    "highlightedCategories": {
      "type": "Array<string>"
    },
    "highlightMatch": {
      "type": "string"
    },
    "hoverBehavior": {
      "type": "string"
    },
    "hoverRenderer": {},
    "layout": {},
    "linkHighlightMode": {
      "type": "string"
    },
    "links": {
      "type": "Array<object>"
    },
    "maxZoom": {
      "type": "number"
    },
    "minZoom": {
      "type": "number"
    },
    "nodeHighlightMode": {
      "type": "string"
    },
    "nodes": {
      "type": "Array<object>"
    },
    "panDirection": {
      "type": "string"
    },
    "panning": {
      "type": "string"
    },
    "renderer": {},
    "selection": {
      "type": "Array<string>"
    },
    "selectionMode": {
      "type": "string"
    },
    "selectionRenderer": {},
    "styleDefaults": {
      "type": "object"
    },
    "tooltip": {
      "type": "object"
    },
    "touchResponse": {
      "type": "string"
    },
    "zooming": {
      "type": "string"
    },
    "zoomRenderer": {}
  },
  "methods": {
    "collapse": {},
    "expand": {},
    "getContextByNode": {},
    "getLink": {},
    "getLinkCount": {},
    "getNode": {},
    "getNodeCount": {},
    "getPromotedLink": {},
    "renderDefaultFocus": {},
    "renderDefaultHover": {},
    "renderDefaultSelection": {}
  },
  "extension": {
    "_widgetName": "ojDiagram"
  }
};
oj.Components.registerMetadata('ojDiagram', 'dvtBaseComponent', ojDiagramMeta);
oj.Components.register('oj-diagram', oj.Components.getMetadata('ojDiagram'));
})();
});
