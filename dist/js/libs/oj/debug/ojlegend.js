/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
 *       <td>Move focus to next component.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous component.</td>
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

// SubId Locators **************************************************************

/**
 * <p>Sub-ID for legend section indexed by its position in the legend's sections array.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the section.
 *
 * @ojsubid oj-legend-section
 * @memberof oj.ojLegend
 *
 * @example <caption>Get the first section:</caption>
 * var nodes = $( ".selector" ).ojLegend( "getNodeBySubId", {'subId': 'oj-legend-section', indexPath: [0]} );
 */

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
 * <p>Context for legend section indexed by its position in the legend's sections array.</p>
 *
 * @property {Array} indexPath The array of numerical indices for the section.
 *
 * @ojnodecontext oj-legend-section
 * @memberof oj.ojLegend
 */

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
 *   JET Legend Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#legendOverview-section"></a>
 * </h3>
 *
 * <p>Legend component for JET.</p>
 *
 * {@ojinclude "name":"warning"}
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div data-bind="ojComponent: {
 *   component: 'ojLegend',
 *   orientation: 'vertical',
 *   sections: [{text : "Database"},
 *              {text : "Middleware"},
 *              {text : "Applications"}]
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
 * {@ojinclude "name":"rtl"}
 *
 * @desc Creates a JET Legend.
 * @example <caption>Initialize the Legend with no options specified:</caption>
 * $(".selector").ojLegend();
 *
 * @example <caption>Initialize the Legend with some options:</caption>
 * $(".selector").ojLegend({orientation: 'vertical', sections: [{text : "Database"}, {text : "Middleware"}, {text : "Applications"}});
 *
 * @example <caption>Initialize the Legend via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div data-bind="ojComponent: {component: 'ojLegend'}">
 */
oj.__registerWidget('oj.ojLegend', $['oj']['dvtBaseComponent'],
{
  widgetEventPrefix : "oj",
  options: {
    /**
     * Triggered when a category of data items is hidden or shown.
     *
     * @property {Object} ui event payload
     * @property {Object} ui.category the category that was filtered on
     * @property {string} ui.type specifies whether the category is being filtered 'in' or 'out'
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">categoryFilter</code> callback specified:</caption>
     * $(".selector").ojLegend({
     *   "categoryFilter": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcategoryfilter</code> event:</caption>
     * $(".selector").on("ojcategoryfilter", function(event, ui){});
     *
     * @expose
     * @event
     * @memberof oj.ojLegend
     * @instance
     * @deprecated Use the <code class="prettyprint">optionChange</code> listener to detect changes to the <code class="prettyprint">hiddenCategories</code> property instead.
     */
    categoryFilter : null,

    /**
     * Triggered when a category of data items is highlighted.
     *
     * @property {Object} ui event payload
     * @property {Array} ui.categories the categories that are being highlighted
     * @property {string} ui.type specifies whether highlighting is being turned 'on' or 'off'
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">categoryHighlight</code> callback specified:</caption>
     * $(".selector").ojLegend({
     *   "categoryHighlight": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcategoryhighlight</code> event:</caption>
     * $(".selector").on("ojcategoryhighlight", function(event, ui){});
     *
     * @expose
     * @event
     * @memberof oj.ojLegend
     * @instance
     * @deprecated Use the <code class="prettyprint">optionChange</code> listener to detect changes to the <code class="prettyprint">highlightedCategories</code> property instead.
     */
    categoryHighlight : null,

    /**
     * Triggered during a drill gesture (single click on the legend item).
     *
     * @property {Object} ui event payload
     * @property {string} ui.id the id of the drilled object
     *
     * @example <caption>Initialize the component with the <code class="prettyprint">drill</code> callback specified:</caption>
     * $(".selector").ojLegend({
     *   "drill": function(event, ui){}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojdrill</code> event:</caption>
     * $(".selector").on("ojdrill", function(event, ui){});
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

    // Convert the supported locators
    if(subId == 'oj-legend-section') {
      // section[sectionIndex0][sectionIndex1]...[sectionIndexN]
      subId = 'section' + this._GetStringFromIndexPath(locator['indexPath']);
    }
    else if(subId == 'oj-legend-item') {
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
    else if(subId.indexOf('section') == 0) {
      // section[sectionIndex0][sectionIndex1]...[sectionIndexN]
      locator['subId'] = 'oj-legend-section';
      locator['indexPath'] = this._GetIndexPath(subId);
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

    styleClasses['oj-legend-section-close-icon'] = {'path': '_resources/closedEnabled', 'property': 'CSS_URL'};
    styleClasses['oj-legend-section-close-icon oj-hover'] = {'path': '_resources/closedOver', 'property': 'CSS_URL'};
    styleClasses['oj-legend-section-close-icon oj-active'] = {'path': '_resources/closedDown', 'property': 'CSS_URL'};

    styleClasses['oj-legend-section-open-icon'] = {'path': '_resources/openEnabled', 'property': 'CSS_URL'};
    styleClasses['oj-legend-section-open-icon oj-hover'] = {'path': '_resources/openOver', 'property': 'CSS_URL'};
    styleClasses['oj-legend-section-open-icon oj-active'] = {'path': '_resources/openDown', 'property': 'CSS_URL'};
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
    return ['categoryFilter', 'categoryHighlight', 'drill'];
  },

  //** @inheritdoc */
  _HandleEvent : function(event) {
    var type = event['type'];
    if (type === 'categoryHide' || type === 'categoryShow') {
      var filterType = (type === 'categoryHide') ? 'out' : 'in';
      this._trigger('categoryFilter', null, {'category': event['category'], 'type': filterType});
      this._UserOptionChange('hiddenCategories', event['hiddenCategories']);
    }
    else if (type === 'categoryHighlight') {
      var highlightType = event['categories'] && event['categories'].length > 0 ? 'on' : 'off';
      this._trigger('categoryHighlight', null, {'categories': event['categories'], 'type': highlightType});
      this._UserOptionChange('highlightedCategories', event['categories']);
    }
    else if (type === 'drill') {
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
    // TODO these should be defined in the skin instead
    resources['overviewGrippy'] = oj.Config.getResourceUrl('resources/internal-deps/dvt/chart/drag_horizontal.png');
  },

  //** @inheritdoc */
  _Render: function() {
    this._super();

    // Remove the tabindex from the element to disable keyboard handling if the component
    // does not have a role on the parent element like for non-interactive legends
    if (!this.element.attr("role"))
      this.element.attr("tabIndex", null);
  },

  /**
   * Returns the legend title for automation testing verification.
   * @return {String} The legend title
   * @expose
   * @instance
   * @memberof oj.ojLegend
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
   * @property {string} getSection.getTitle <b>Deprecated</b>: Use <code class="prettyprint">title</code> instead.
   * @property {Function} getTitle <b>Deprecated</b>: Use <code class="prettyprint">title</code> instead.
   * @return {Object|null} An object containing properties for the legend section at the given subIdPath, or null if
   *   none exists.
   * @expose
   * @instance
   * @memberof oj.ojLegend
   */
  getSection : function(subIdPath) {
    var ret = this._component.getAutomation().getSection(subIdPath);
    if(ret) {
      var ojComponent = this;

      // : Provide backwards compatibility for getters until 1.2.0.
      this._AddAutomationGetters(ret);

      // Support for getSection(sectionIndex)
      ret['getSection'] = function(sectionIndex) {
        var section = ret['sections'] ? ret['sections'][sectionIndex] : null;

        // : Provide backwards compatibility for getters until 1.2.0.
        if(section)
          ojComponent._AddAutomationGetters(section);

        return section;
      }

      // Support for getSection(itemIndex)
      ret['getItem'] = function(itemIndex) {
        var item = ret['items'] ? ret['items'][itemIndex] : null;

        // : Provide backwards compatibility for getters until 1.2.0.
        if(item)
          ojComponent._AddAutomationGetters(item);

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
   * @property {Function} getText <b>Deprecated</b>: Use <code class="prettyprint">text</code> instead.
   * @return {Object|null} An object containing properties for the legend item at the given subIdPath, or null if
   *   none exists.
   * @expose
   * @instance
   * @memberof oj.ojLegend
   */
  getItem : function(subIdPath) {
    var ret = this._component.getAutomation().getItem(subIdPath);

    // : Provide backwards compatibility for getters until 1.2.0.
    this._AddAutomationGetters(ret);

    return ret;
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
    var dims = this._component.getPreferredSize(this.options, width, height);
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
  }
});

});
