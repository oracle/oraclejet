/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
 *
 * @classdesc
 * <h3 id="sunburstOverview-section">
 *   JET Sunburst Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sunburstOverview-section"></a>
 * </h3>
 *
 * <p>Sunburst component for JET. Sunbursts are used to display hierarchical data across two dimensions, represented by
 * the size and color of the sunburst nodes.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojSunburst',
 *   nodes: [{value: 100, color: "#FFFF00", label: "Total Sales",
 *            nodes: [{value: 75, color: "#00FF00", label: "Candy"},
 *                    {value: 20, color: "#FFFF00", label: "Fruit"},
 *                    {value: 15, color: "#FF0000", label: "Vegetables"}]}]
 * }"/>
 * </code>
 * </pre>
 *
 * {@ojinclude "name":"warning"}
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
 * <p>As a rule of thumb, it's recommended that applications only set usable data densities on this component.
 *    Applications can enable progressive reveal of data through drilling or aggregate small nodes to reduce the
 *    displayed data set size.
 * </p>
 *
 * <h4>Style Attributes</h4>
 * <p>Use the highest level options property available. For example, consider using  attributes on
 *    <code class="prettyprint">nodeDefaults</code>, instead of attributes on the individual nodes. The component can
 *    take advantage of these higher level attributes to apply the style properties on containers, saving expensive DOM
 *    calls.
 * </p>
 *
 * {@ojinclude "name":"trackResize"}
 *
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Sunburst.
 * @example <caption>Initialize the Sunburst with no options specified:</caption>
 * $(".selector").ojSunburst();
 *
 * @example <caption>Initialize the Sunburst with some options:</caption>
 * $(".selector").ojSunburst({nodes: [{value: 75, color: "#00FF00", label: "Candy"}, {value: 20, color: "#FFFF00", label: "Fruit"}, {value: 15, color: "#FF0000", label: "Vegetables"}]});
 *
 * @example <caption>Initialize the Sunburst via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojSunburst'}">
 */
oj.__registerWidget('oj.ojSunburst', $['oj']['dvtBaseComponent'],
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
     * $(".selector").ojSunburst({
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
     * @memberof oj.ojSunburst
     * @instance
     */
    optionChange: null,

    /**
     * Triggered during user rotation of the sunburst.
     *
     * @property {Object} ui event payload
     * @property {number} ui.value the start angle of the sunburst, in degrees
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">rotateInput</code> callback specified:</caption>
     * $(".selector").ojSunburst({
     *   "rotateInput": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojrotateinput</code> event:</caption>
     * $(".selector").on("ojrotateinput", function(event, ui){});
     *
     * @expose
     * @event
     * @memberof oj.ojSunburst
     * @instance
     */
    rotateInput : null
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
  _GetComponentStyleClasses : function() {
    var styleClasses = this._super();
    styleClasses.push('oj-sunburst');
    return styleClasses;
  },

  //** @inheritdoc */
  _GetChildStyleClasses : function() {
    var styleClasses = this._super();
    // TODO  fill in the urls after expand/collapse are supported
// 		styleClasses['oj-sunburst-expand-icon'] = {'path' : '', 'property' : 'CSS_URL'};
// 		styleClasses['oj-sunburst-expand-icon oj-hover'] = {'path' : '', 'property' : 'CSS_URL'};
// 		styleClasses['oj-sunburst-expand-icon oj-active'] = {'path' : '', 'property' : 'CSS_URL'};
// 		styleClasses['oj-sunburst-collapse-icon'] = {'path' : '', 'property' : 'CSS_URL'};
// 		styleClasses['oj-sunburst-collapse-icon oj-hover'] = {'path' : '', 'property' : 'CSS_URL'};
// 		styleClasses['oj-sunburst-collapse-icon oj-active'] = {'path' : '', 'property' : 'CSS_URL'};
    styleClasses['oj-sunburst-attribute-type-text'] = {'path' : 'styleDefaults/_attributeTypeTextStyle', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-sunburst-attribute-value-text'] = {'path' : 'styleDefaults/_attributeValueTextStyle', 'property' : 'CSS_TEXT_PROPERTIES'};
    // TODO  add this once drilling is supported
//    styleClasses['oj-sunburst-current-text'] = {'path' : '', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-sunburst-node'] = {'path' : 'nodeDefaults/labelStyle', 'property' : 'CSS_TEXT_PROPERTIES'};
    styleClasses['oj-sunburst-node oj-hover'] = {'path' : 'nodeDefaults/hoverColor', 'property' : 'border-top-color'};
    styleClasses['oj-sunburst-node oj-selected'] = [
      {'path' : 'nodeDefaults/selectedOuterColor', 'property' : 'border-top-color'},
      {'path' : 'nodeDefaults/selectedInnerColor', 'property' : 'border-bottom-color'}
    ];
    return styleClasses;
  },

  //** @inheritdoc */
  _GetEventTypes : function() {
    return ['optionChange', 'rotateInput'];
  },

  //** @inheritdoc */
  _GetTranslationMap: function() {
    // The translations are stored on the options object.
    var translations = this.options['translations'];

    // Safe to modify super's map because function guarentees a new map is returned
    var ret = this._super();
    ret['DvtSunburstBundle.COLOR'] = translations['labelColor'];
    ret['DvtSunburstBundle.SIZE'] = translations['labelSize'];
    ret['DvtUtilBundle.SUNBURST'] = translations['componentName'];
    return ret;
  },

  //** @inheritdoc */
  _HandleEvent : function(event) {
    var type = event['type'];
    if(type === 'rotation') {
      if(event['complete'])
        this._UserOptionChange('startAngle', event['startAngle']);
      else
        this._trigger('rotateInput', null, {'value': event['startAngle']});
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
   * @property {Function} getColor <b>Deprecated</b>: Use <code class="prettyprint">color</code> instead.
   * @property {Function} getLabel <b>Deprecated</b>: Use <code class="prettyprint">label</code> instead.
   * @property {Function} getSize <b>Deprecated</b>: Use <code class="prettyprint">size</code> instead.
   * @property {Function} getTooltip <b>Deprecated</b>: Use <code class="prettyprint">tooltip</code> instead.
   * @property {Function} isSelected <b>Deprecated</b>: Use <code class="prettyprint">selected</code> instead.
   * @return {Object|null} An object containing properties for the node, or null if none exists.
   * @expose
   * @instance
   * @memberof oj.ojSunburst
   */
  getNode: function(subIdPath) {
    var ret = this._component.getAutomation().getNode(subIdPath);

    // : Provide backwards compatibility for getters until 1.2.0.
    this._AddAutomationGetters(ret);

    return ret;
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
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
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
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojSunburst
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
 * var nodes = $( ".selector" ).ojSunburst( "getNodeBySubId", {'subId': 'oj-sunburst-node', 'indexPath': [0, 1]} );
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
 * var nodes = $( ".selector" ).ojSunburst( "getNodeBySubId", {'subId': 'oj-sunburst-tooltip'} );
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
 * The knockout template used to render the content of the tooltip.
 *
 * This attribute is only exposed via the <code class="prettyprint">ojComponent</code> binding, and is not a
 * component option. The following variables are also passed into the template:
 *  <ul> 
 *   <li>parentElement: The tooltip element. The function can directly modify or append content to this element.</li> 
 *   <li>id: The id of the hovered node.</li> 
 *   <li>label: The label of the hovered node.</li> 
 *   <li>value: The value of the hovered node.</li> 
 *   <li>radius: The radius of the hovered node.</li> 
 *   <li>color: The color of the hovered node.</li> 
 *  </ul>
 *
 * @ojbindingonly
 * @name tooltip.template
 * @memberof! oj.ojSunburst
 * @instance
 * @type {string|null}
 * @default <code class="prettyprint">null</code>
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
      "type": "string"
    },
    "animationOnDisplay": {
      "type": "string"
    },
    "animationUpdateColor": {
      "type": "string"
    },
    "colorLabel": {
      "type": "string"
    },
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
    "hoverBehaviorDelay": {
      "type": "number|string"
    },
    "nodeDefaults": {
      "type": "object"
    },
    "nodes": {
      "type": "Array<object>"
    },
    "rotation": {
      "type": "string"
    },
    "selection": {
      "type": "Array<string>"
    },
    "selectionMode": {
      "type": "string"
    },
    "sizeLabel": {
      "type": "string"
    },
    "sorting": {
      "type": "string"
    },
    "startAngle": {
      "type": "number"
    },
    "tooltip": {
      "type": "object"
    },
    "touchResponse": {
      "type": "string"
    }
  },
  "methods": {
    "getContextByNode": {},
    "getNode": {}
  },
  "extension": {
    "_widgetName": "ojSunburst"
  }
};
oj.Components.registerMetadata('ojSunburst', 'dvtBaseComponent', ojSunburstMeta);
oj.Components.register('oj-sunburst', oj.Components.getMetadata('ojSunburst'));
})();
});
