/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojdvt-base', 'ojs/internal-deps/dvt/DvtLegend'], function(oj, $, comp, base, dvt)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojLegend
 * @augments oj.dvtBaseComponent
 * @since 0.7
 * @ojstatus preview
 * @ojshortdesc Displays an interactive description of symbols, colors, etc., used in graphical information representations.
 * @ojrole application
 * @ojtsignore
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
     *  Whether drilling is enabled on all legend items. Drillable objects will show a pointer cursor on hover and fire <code class="prettyprint">ojDrill</code> event on click. To enable or disable drilling on individual legend item, use the drilling attribute in each legend item. 
     * @expose
     * @name drilling
     * @memberof oj.ojLegend
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">drilling</code> attribute specified:</caption>
     * &lt;oj-legend drilling="on">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">drilling</code> property after initialization:</caption>
     * // getter 
     * var drillingValue = myLegend.drilling;
     * 
     * // setter 
     * myLegend.drilling = 'on';
     */
    drilling: 'off',

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
     * @default "start"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">halign</code> attribute specified:</caption>  
     * &lt;oj-legend halign="center">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">halign</code> property after initialization:</caption>
     * // getter 
     * var halignValue = myLegend.halign;
     *
     * // setter 
     * myLegend.halign = "center";
     * 
     */
    halign: 'start',

    /**
     * An array of categories that will be hidden.
     * @expose
     * @name hiddenCategories
     * @memberof oj.ojLegend
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hidden-categories</code> attribute specified:</caption>
     * &lt;oj-legend hidden-categories='["Apples", "Bananas"]'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">hiddenCategories</code> property after initialization:</caption>
     * // Get one
     * var value = myLegend.hiddenCategories[0];
     *
     * // Get all
     * var hiddenCategoriesValue = myLegend.hiddenCategories;
     *
     * // setter
     * myLegend.hiddenCategories = ["Apples", "Bananas"];
     */
    hiddenCategories: [],

    /**
     * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
     * @expose
     * @name hideAndShowBehavior
     * @memberof oj.ojLegend
     * @instance
     * @type {string}
     * @ojvalue {string} "on"
     * @ojvalue {string} "off"
     * @default "off"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hide-and-show-behavior</code> attribute specified:</caption>
     * &lt;oj-legend hide-and-show-behavior="on">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">hideAndShowBehavior</code> property after initialization:</caption>
     * // getter 
     * var hideAndShowValue = myLegend.hideAndShowBehavior;
     *
     * // setter 
     * myLegend.hideAndShowBehavior = 'on';
     */
    hideAndShowBehavior: 'off',

    /**
     * An array of categories that will be highlighted.
     * @expose
     * @name highlightedCategories
     * @memberof oj.ojLegend
     * @instance
     * @type {Array.<string>}
     * @default []
     * @ojwriteback
     * 
     * @example <caption>Initialize the Legend with the <code class="prettyprint">highlighted-categories</code> attribute specified:</caption>
     * &lt;oj-legend highlighted-categories='["Bananas", "Apples"]'>&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">highlightedCategories</code> property after initialization:</caption>
     * // Get one
     * var value = myLegend.highlightedCategories[0];
     *
     * // getter
     * var highlightedCategoriesValue = myLegend.highlightedCategories;
     *
     * // setter
     * myLegend.highlightedCategories = ["Bananas", "Apples"];
     */
    highlightedCategories: [],

    /**
     * Defines the behavior applied when hovering over a legend item.
     * @expose
     * @name hoverBehavior
     * @memberof oj.ojLegend
     * @instance
     * @type {string}
     * @ojvalue {string} "dim"
     * @ojvalue {string} "none"
     * @default "none"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hover-behavior</code> attribute specified:</caption>
     * &lt;oj-legend hover-behavior="dim">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">hoverBehavior</code> property after initialization:</caption>
     * // getter 
     * var hoverBehaviorValue = myLegend.hoverBehavior;
     * 
     * // setter 
     * myLegend.hoverBehavior = 'dim';
     */
    hoverBehavior: 'none',

    /**
     * Specifies initial hover delay in ms for highlighting items in legend.
     * @expose
     * @name hoverBehaviorDelay
     * @memberof oj.ojLegend
     * @instance
     * @type {number}
     * @ojunits milliseconds
     * @ojmin 0
     * @default 200
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">hover-behavior-delay</code> attribute specified:</caption>
     * &lt;oj-legend hover-behavior-delay="150">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">hoverBehaviorDelay</code> property after initialization:</caption>
     * // getter 
     * var delayValue = myLegend.hoverBehaviorDelay;
     *  
     * // setter 
     * myLegend.hoverBehaviorDelay = 150;
     */
    hoverBehaviorDelay: 200,

    /**
     * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
     * @expose
     * @name orientation
     * @memberof oj.ojLegend
     * @instance
     * @type {string}
     * @ojvalue {string} "horizontal"
     * @ojvalue {string} "vertical"
     * @default "vertical"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">orientation</code> attribute specified:</caption>
     * &lt;oj-legend orientation="horizontal">&lt;/oj-legend>
     *
     * @example <caption>Get or set the <code class="prettyprint">orientation</code> property after initialization:</caption>
     * // getter 
     * var orientationValue = myLegend.orientation;
     *
     * // setter 
     * myLegend.orientation = "horizontal";
     */
    orientation: 'vertical',

    /**
     * Defines whether scrolling is enabled for the legend.
     * @expose
     * @name scrolling
     * @memberof oj.ojLegend
     * @instance
     * @type {string}
     * @ojvalue {string} "off"
     * @ojvalue {string} "asNeeded"
     * @default "asNeeded"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">scrolling</code> attribute specified:</caption>
     * &lt;oj-legend scrolling="off">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">scrolling</code> property after initialization:</caption>
     * // getter 
     * var scrollingValue = myLegend.scrolling;
     *
     * // setter 
     * myLegend.scrolling = 'off';
     *
     */
    scrolling: 'asNeeded',

    /**
     * An array of objects with the following properties defining the legend sections.
     * @expose
     * @name sections
     * @memberof oj.ojLegend
     * @instance
     * @type {Array.<Object>|null}
     * @default null
     * 
     * @example <caption>Initialize the legend with the 
     * <code class="prettyprint">sections</code> attribute specified:</caption>
     * &lt;oj-legend sections='[{"title": "Brand", "expanded": "on", "collapsible": "on", 
     *                        items: [{"color": "red", "text": "Coke", "id": "Coke"}, 
     *                                {"color": "blue", "text": "Pepsi", "id": "Pepsi"}, 
     *                                {"color": "yellow", "text": "Snapple", "id": "Snapple"},
     *                                {"color": "brown", "text": "Nestle", "id": "Nestle"}]}]'>
     * &lt;/oj-legend>
     * 
     * &lt;oj-legend sections='[[sectionsPromise]]'>&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">sections</code> 
     * property after initialization:</caption>
     * // Get one
     * var value = myLegend.sections[0];
     *
     * // Get all (The items getter always returns a Promise so there is no "get one" syntax)
     * var values = myLegend.sections;
     * 
     * // Set all (There is no permissible "set one" syntax.)
     * myLegend.sections=[{title: "Brand", expanded: "on", collapsible: "on", 
     *                     items: [{color: "red", text: "Coke", id: "Coke"}, 
     *                             {color: "blue", text: "Pepsi", id: "Pepsi"}, 
     *                             {color: "yellow", text: "Snapple", id: "Snapple"},
     *                             {color: "brown", text: "Nestle", id: "Nestle"}]}];
     */
    sections: null,

    /**
     * The height of the legend symbol (line or marker) in pixels. If the value is 0, it will take the same value as symbolWidth. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme.
     * @expose
     * @name symbolHeight
     * @memberof oj.ojLegend
     * @instance
     * @type {number}
     * @ojunits pixels
     * @default 0
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">symbol-height</code> attribute specified:</caption>
     * &lt;oj-legend symbol-height="20">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">symbolHeight</code> property after initialization:</caption>
     * // getter 
     * var symbolHeightValue = myLegend.symbolHeight;
     * 
     * // setter 
     * myLegend.symbolHeight = 20;
     */
    symbolHeight: 0,

    /**
     * The width of the legend symbol (line or marker) in pixels. If the value is 0, it will take the same value as symbolWidth. If both symbolWidth and symbolHeight are 0, then it will use a default value that may vary based on theme.
     * @expose
     * @name symbolWidth
     * @memberof oj.ojLegend
     * @instance
     * @type {number}
     * @ojunits pixels
     * @default 0
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">symbol-width</code> attribute specified:</caption>
     * &lt;oj-legend symbol-width="15">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">symbolWidth</code> property after initialization:</caption>
     * // getter 
     * var symbolWidthValue = myLegend.symbolWidth;
     * 
     * // setter 
     * myLegend.symbolWidth = 15;
     */
    symbolWidth: 0,

    /**
     * The CSS style object defining the style of the legend item text. The default value comes from the CSS and varies based on theme.
     * @expose
     * @name textStyle
     * @memberof oj.ojLegend
     * @instance
     * @type {Object}
     * 
     * @example <caption>Initialize the Legend with the <code class="prettyprint">text-style</code> attribute specified:</caption>
     * &lt;oj-legend text-style='{"fontSize":"12px"}'>&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">textStyle</code> property after initialization:</caption>
     * // getter 
     * var textStyleValue = myLegend.textStyle;
     * 
     * // setter 
     * myLegend.textStyle = {"fontSize" : "12px"};
     */
    textStyle: undefined,

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
     * @default "top"
     *
     * @example <caption>Initialize the Legend with the <code class="prettyprint">valign</code> attribute specified:</caption>
     * &lt;oj-legend valign="middle">&lt;/oj-legend>
     * 
     * @example <caption>Get or set the <code class="prettyprint">valign</code> property after initialization:</caption>
     * // getter 
     * var valignValue = myLegend.valign;
     *  
     * // setter 
     * myLegend.valign = "middle";
     */
    valign: 'top',

    // EVENTS

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
    styleClasses['oj-legend'] = {'path' : 'textStyle', 'property' : 'TEXT'};
    styleClasses['oj-legend-title'] = {'path' : 'titleStyle', 'property' : 'TEXT'};
    styleClasses['oj-legend-section-title'] = {'path' : '_sectionTitleStyle', 'property' : 'TEXT'};
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
   * @property {function(number)} getSection Returns the section with the specified index.
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
 * The title of the legend section.
 * @expose
 * @name sections[].title
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
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
 * @type {Object}
 * @default null
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
 * @default "off"
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
 * @default "on"
 */
/**
 * An array of nested legend sections.
 * @expose
 * @name sections[].sections
 * @memberof! oj.ojLegend
 * @instance
 * @type {Array.<Object>}
 * @default null
 */
/**
 * An array of objects with the following properties defining the legend items. Also accepts a Promise for deferred data rendering. No data will be rendered if the Promise is rejected.
 * @expose
 * @name sections[].items
 * @memberof! oj.ojLegend
 * @instance
 * @type {Array.<Object>|Promise}
 * @default null
 */
/**
 * The id of the legend item, which is provided as part of the context for events fired by the legend. If not specified, the id defaults to the text of the legend item.
 * @expose
 * @name sections[].items[].id
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The legend item text.
 * @expose
 * @name sections[].items[].text
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
 */
/**
 * An array of categories for the legend item. Legend items currently only support a single category. If no category is specified, this defaults to the id or text of the legend item.
 * @expose
 * @name sections[].items[].categories
 * @memberof! oj.ojLegend
 * @instance
 * @type {Array.<string>}
 * @default null
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
 * @default null
 */
/**
 * The color of the legend symbol (line or marker). When symbolType is "lineWithMarker", this attribute defines the line color and the markerColor attribute defines the marker color.
 * @expose
 * @name sections[].items[].color
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The border color of the marker. Only applies if symbolType is "marker" or "lineWithMarker".
 * @expose
 * @name sections[].items[].borderColor
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
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
 * @default "none"
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
 * @default null
 */
/**
 * The CSS style class to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name sections[].items[].svgClassName
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the legend item. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the color attribute.
 * @expose
 * @name sections[].items[].svgStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {Object}
 * @default null
 */
/**
 * The CSS style class to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @expose
 * @name sections[].items[].markerSvgClassName
 * @memberof! oj.ojLegend
 * @instance
 * @type {string}
 * @default null
 */
/**
 * The inline style to apply to the marker. The style class and inline style will override any other styling specified through the options. For tooltips and hover interactivity, it's recommended to also pass a representative color to the markerColor attribute.
 * @expose
 * @name sections[].items[].markerSvgStyle
 * @memberof! oj.ojLegend
 * @instance
 * @type {Object}
 * @default null
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
 * @default null
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
 * @default null
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
      "type": "Object",
      "properties": {
        "componentName": {
          "type": "string",
          "value": "Legend"
        },
        "labelAndValue": {
          "type": "string",
          "value": "{0}: {1}"
        },
        "labelClearSelection": {
          "type": "string",
          "value": "Clear Selection"
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