/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
 *
 * @classdesc
 * <h3 id="treemapOverview-section">
 *   JET Treemap Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#treemapOverview-section"></a>
 * </h3>
 *
 * <p>Treemap component for JET. Treemaps are used to display hierarchical data across two dimensions, represented by
 * the size and color of the treemap nodes. Treemaps are generally preferred over sunbursts when emphasizing the data
 * for the leaf nodes.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojTreemap',
 *   nodes: [{value: 100, color: "#FFFF00", label: "Total Sales",
 *            nodes: [{value: 75, color: "#00FF00", label: "Candy"},
 *                    {value: 20, color: "#FFFF00", label: "Fruit"},
 *                    {value: 15, color: "#FF0000", label: "Vegetables"}]}]
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
 * @desc Creates a JET Treemap.
 * @example <caption>Initialize the Treemap with no options specified:</caption>
 * $(".selector").ojTreemap();
 *
 * @example <caption>Initialize the Treemap with some options:</caption>
 * $(".selector").ojTreemap({nodes: [{value: 75, color: "#00FF00", label: "Candy"}, {value: 20, color: "#FFFF00", label: "Fruit"}, {value: 15, color: "#FF0000", label: "Vegetables"}]});
 *
 * @example <caption>Initialize the Treemap via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojTreemap'}">
 */
oj.__registerWidget('oj.ojTreemap', $['oj']['dvtBaseComponent'],
  {
    widgetEventPrefix: "oj",
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
       * $(".selector").ojTreemap({
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
       * @memberof oj.ojTreemap
       * @instance
       */
      optionChange: null
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
      styleClasses['oj-treemap-isolate-icon'] = {'path': '_resources/isolate', 'property': 'CSS_URL'};
      styleClasses['oj-treemap-isolate-icon oj-hover'] = {'path': '_resources/isolateOver', 'property': 'CSS_URL'};
      styleClasses['oj-treemap-isolate-icon oj-active'] = {'path': '_resources/isolateDown', 'property': 'CSS_URL'};

      styleClasses['oj-treemap-restore-icon'] = {'path': '_resources/restore', 'property': 'CSS_URL'};
      styleClasses['oj-treemap-restore-icon oj-hover'] = {'path': '_resources/restoreOver', 'property': 'CSS_URL'};
      styleClasses['oj-treemap-restore-icon oj-active'] = {'path': '_resources/restoreDown', 'property': 'CSS_URL'};

      styleClasses['oj-treemap-attribute-type-text'] = {'path': 'styleDefaults/_attributeTypeTextStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-treemap-attribute-value-text'] = {'path': 'styleDefaults/_attributeValueTextStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      // TODO  add this once drilling is supported
//    styleClasses['oj-treemapCurrentText '] = {'path' : '', 'property' : 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-treemap-node'] = {'path': 'nodeDefaults/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'};
      styleClasses['oj-treemap-node oj-hover'] = {'path': 'nodeDefaults/hoverColor', 'property': 'border-top-color'};
      styleClasses['oj-treemap-node oj-selected'] = [
        {'path': 'nodeDefaults/selectedOuterColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/selectedInnerColor', 'property': 'border-bottom-color'}
      ];
      styleClasses['oj-treemap-node-header'] = [
        {'path': 'nodeDefaults/header/backgroundColor', 'property': 'background-color'},
        {'path': 'nodeDefaults/header/borderColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/header/labelStyle', 'property': 'CSS_TEXT_PROPERTIES'}
      ];
      styleClasses['oj-treemap-node-header oj-hover'] = [
        {'path': 'nodeDefaults/header/hoverBackgroundColor', 'property': 'background-color'},
        {'path': 'nodeDefaults/header/hoverOuterColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/header/hoverInnerColor', 'property': 'border-bottom-color'},
        {'path': 'nodeDefaults/header/_hoverLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'}
      ];
      styleClasses['oj-treemap-node-header oj-selected'] = [
        {'path': 'nodeDefaults/header/selectedBackgroundColor', 'property': 'background-color'},
        {'path': 'nodeDefaults/header/selectedOuterColor', 'property': 'border-top-color'},
        {'path': 'nodeDefaults/header/selectedInnerColor', 'property': 'border-bottom-color'},
        {'path': 'nodeDefaults/header/_selectedLabelStyle', 'property': 'CSS_TEXT_PROPERTIES'}
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
      else {
        this._super(event);
      }
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
     * @memberof oj.ojTreemap
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
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
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
 *   </tbody>
 * </table>
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreemap
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
 * var nodes = $( ".selector" ).ojTreemap( "getNodeBySubId", {'subId': 'oj-treemap-node', 'indexPath': [0, 1]} );
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
 * var nodes = $( ".selector" ).ojTreemap( "getNodeBySubId", {'subId': 'oj-treemap-tooltip'} );
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

});
