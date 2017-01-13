/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'promise'],
       function(oj, $)
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/
/**
 * Implementation of PagingModel used by FilmStrip.
 * @class oj.FilmStripPagingModel
 * @classdesc Implementation of PagingModel used by FilmStrip. 
 * @extends oj.EventSource
 * @implements oj.PagingModel
 * @constructor
 * @ignore
 */
oj.FilmStripPagingModel = function()
{
  this.Init();
};

// Subclass from oj.EventSource 
oj.Object.createSubclass(oj.FilmStripPagingModel, oj.EventSource, "oj.FilmStripPagingModel");

/**
 * Initialize the instance.
 * @export
 */
oj.FilmStripPagingModel.prototype.Init = function()
{
  oj.FilmStripPagingModel.superclass.Init.call(this);
  
  this._page = -1;
  this._totalSize = 0;
  this._pageSize = -1;
};

/**
 * Set the total size.
 * @param {number} totalSize The total size.
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.setTotalSize = function(totalSize)
{
  this._totalSize = totalSize;
};

/**
 * Get the page size.
 * @returns {number} The page size.
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.getPageSize = function()
{
  return this._pageSize;
};

// start oj.PagingModel interface methods //////////////////////////////////////

/**
 * Get the current page
 * @returns {number} The current page
 * @export
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.getPage = function()
{
  return this._page;
};

/**
 * Set the current page
 * @param {number} page The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @returns {Promise} promise object triggering done when complete
 * @export
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.setPage = function(page, options)
{
  //ensure that the page index is an actual number, because the paging control
  //seems to set a string when you click on one of the page dots
  page = parseInt(page, 10);
  
  try
  {
    var prevPageCount = this.getPageCount();
    var prevPage = this._page;
    var prevPageSize = this._pageSize;
    var pageSize = prevPageSize;
    if (options && options.pageSize)
      pageSize = options.pageSize;
    
    //FIX : if the paging model hasn't been initialized yet, 
    //just return a resolved promise instead of throwing the invalid page
    //error below
    if (this._totalSize === 0 && pageSize === -1)
      return Promise.resolve();
    
    var newPageCount = Math.ceil(this._totalSize / pageSize);
    if (page < 0 || page > newPageCount - 1)
      throw new Error("JET FilmStrip: Invalid 'page' set: " + page);
    
    var bFiredBeforePageEvent = false;
    if (page != prevPage || pageSize != prevPageSize)
    {
      var bSuccess = this.handleEvent("beforePage", {"page": page, "previousPage": prevPage});
      if (bSuccess === false)
        return Promise.reject();
      bFiredBeforePageEvent = true;
    }
    
    this._page = page;
    this._pageSize = pageSize;
    var pageCount = this.getPageCount();
    var self = this;

    return new Promise(function(resolve, reject)
      {
        if (prevPageCount != pageCount)
          self.handleEvent("pageCount", {"pageCount": pageCount, "previousPageCount": prevPageCount});
        if (bFiredBeforePageEvent)
          self.handleEvent("page", {"page": page, "previousPage": prevPage});
        resolve(null);
      });
  }
  catch (e)
  {
    return Promise.reject(e);
  }
};

/**
 * Get the current page start index
 * @returns {number} The current page start index
 * @export
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.getStartItemIndex = function()
{
  //FIX : if there is no data yet, explicitly return -1 for 
  //start index, because otherwise the calculated value would incorrectly
  //be 1
  if (this._page === -1 && this._pageSize === -1)
    return -1;
  
  return this._page * this._pageSize;
};

/**
 * Get the current page end index
 * @returns {number} The current page end index
 * @export
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.getEndItemIndex = function()
{
  return Math.min(this.getStartItemIndex() + this._pageSize, this._totalSize) - 1;
};

/**
 * Get the page count
 * @returns {number} The total number of pages
 * @export
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.getPageCount = function()
{
  return Math.ceil(this._totalSize / this._pageSize);
};

/**
 * Return the total number of items. Returns -1 if unknown.
 * @returns {number} total number of items
 * @export
 * @memberof! oj.FilmStripPagingModel
 * @instance
 */
oj.FilmStripPagingModel.prototype.totalSize = function()
{
  return this._totalSize;
};

/**
 * Returns the confidence for the totalSize value. 
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number 
 *                  "estimate" if the totalSize is an estimate 
 *                  "atLeast" if the totalSize is at least a certain number 
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof! oj.FilmStripPagingModel
 * @instance 
 */
oj.FilmStripPagingModel.prototype.totalSizeConfidence = function()
{ 
  return "actual";
};

// end oj.PagingModel interface methods ////////////////////////////////////////

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @ojcomponent oj.ojFilmStrip
 * @augments oj.baseComponent
 * @since 1.1.0
 * 
 * @classdesc
 * <h3 id="filmStripOverview-section">
 *   JET FilmStrip Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#filmStripOverview-section"></a>
 * </h3>
 * 
 * <p>Description: Container component that lays out its children in a single 
 * row or column across logical pages and allows navigating through them.
 * 
 * <p>A JET FilmStrip can be created from any 
 * <code class="prettyprint">&lt;div></code> element that contains multiple 
 * direct child elements.  All child elements are expected to be the same size.
 * <p>FilmStrip will layout the child items across multiple logical pages and 
 * allow for changing between logical pages.  When the component is resized, 
 * relayout will occur and the number of pages and number of items shown per 
 * page may change.
 * 
 * <pre class="prettyprint">
 * <code>
 * &lt;div id="filmStrip" data-bind="ojComponent: {component: 'ojFilmStrip'}">
 *   &lt;div id="item1" class="my-filmstrip-item">Alpha&lt;/div>
 *   &lt;div id="item2" class="my-filmstrip-item">Beta&lt;/div>
 *   &lt;div id="item3" class="my-filmstrip-item">Gamma&lt;/div>
 *   &lt;div id="item4" class="my-filmstrip-item">Delta&lt;/div>
 *   &lt;div id="item5" class="my-filmstrip-item">Epsilon&lt;/div>
 *   &lt;div id="item6" class="my-filmstrip-item">Zeta&lt;/div>
 * &lt;/div>
 * </code></pre>
 * 
 * <p>JET FilmStrip and ConveyorBelt look similar, but are intended to be used
 * for different purposes.
 * <p>Use FilmStrip when you want to:
 * <ul>
 * <li>layout a set of items across discrete logical pages</li>
 * <li>control which and how many items are shown</li>
 * <li>hide items outside the current viewport from tab order and screen reader</li>
 * </ul>
 * <p>Use ConveyorBelt when you want to:
 * <ul>
 * <li>handle overflow without showing a scrollbar</li>
 * <li>keep all items accessible via tabbing and readable by a screen reader</li>
 * </ul>
 *
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"touchDoc"}
 * 
 * 
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 * 
 * {@ojinclude "name":"keyboardDoc"}
 * 
 * 
 * <h3 id="keyboard-appdev-section">
 *   Keyboard Application Developer Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-appdev-section"></a>
 * </h3>
 * 
 * <p>FilmStrip is for layout only.  Providing keyboard support for the child 
 * items in the filmstrip is the responsibility of the application developer, if
 * the items do not already support keyboard interaction.  This could be done, 
 * for example, by specifying <code class="prettyprint">tabindex</code> on each 
 * item to enable tab navigation among them.  
 *
 * <p>Only the child items of the FilmStrip that are visible in the current 
 * logical page can be tabbed to.  Items outside the current logical page are
 * hidden from the tab order.  
 * 
 * 
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>FilmStrip is for layout only.  It is the responsibility of the 
 * application developer to make the items in the filmstrip accessible.  Sighted 
 * keyboard-only users need to be able to access the items in the layout just by
 * using the keyboard.  It is up to the child items of the FilmStrip to 
 * support keyboard navigation.  
 *
 * <p>Only the child items of the FilmStrip that are visible in the current 
 * logical page can be read by a screen reader.  Items outside the current 
 * logical page are hidden from a screen reader.  
 * 
 * <p>FilmStrip assigns itself the WAI-ARIA 
 * <code class="prettyprint">role</code> of 
 * <code class="prettyprint">"region"</code>.  The application <b>must</b> 
 * specify a WAI-ARIA label for the FilmStrip in the DOM so that screen reader
 * users will understand the purpose of the FilmStrip.  
 * 
 * <p>The application <b>must</b> provide accessible controls for navigating 
 * through the logical pages of the FilmStrip for use by screen reader users, 
 * because the arrow keys may be intercepted by the screen reader itself.  The
 * navigation arrows built into FilmStrip can be used, or if they are hidden,
 * then alternative means, such as a paging control, must be provided.  
 * 
 * 
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 * 
 * <h4>Lazy Rendering</h4>
 * <p>If there are many items in the FilmStrip or complex content in each item,
 * it is recommended to implement lazy rendering of item content.  The application
 * should keep track of which items have rendered their content.  Items that are
 * initially visible in the FilmStrip should render their content from the start.
 * The application should then listen to events from the FilmStrip's 
 * <code class="prettyprint">PagingModel</code> in order to render content for
 * items that are paged into view later.  
 * 
 * 
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 * 
 * <p>As with any JET component, in the unusual case that the directionality 
 * (LTR or RTL) changes post-init, the FilmStrip must be 
 * <code class="prettyprint">refresh()</code>ed.
 * 
 * 
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 * 
 * <p>The <code class="prettyprint">:oj-filmstrip</code> pseudo-selector can 
 * be used in jQuery expressions to select JET FilmStrip.  For example:
 * 
 * <pre class="prettyprint">
 * <code>$( ":oj-filmstrip" ) // selects all JET FilmStrips on the page
 * $myEventTarget.closest( ":oj-filmstrip" ) // selects the closest ancestor that is a JET FilmStrip
 * </code></pre>
 * 
 * 
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 * 
 * <p>Event names for all JET components are prefixed with "oj", instead of 
 * component-specific prefixes like "filmStrip".  
 * 
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * 
 * @desc Creates a JET FilmStrip. 
 * @example <caption>Initialize the FilmStrip with no options specified:</caption>
 * $( ".selector" ).ojFilmStrip();
 * 
 * @example <caption>Initialize the FilmStrip with some options specified:</caption>
 * $( ".selector" ).ojFilmStrip( { "orientation": "vertical" } );
 * 
 * @example <caption>Initialize the FilmStrip via the JET 
 * <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="filmStrip" data-bind="ojComponent: { component: 'ojFilmStrip', orientation: 'vertical'}">
 */
(function()
{
oj.__registerWidget("oj.ojFilmStrip", $['oj']['baseComponent'],
{
  defaultElement: "<div>",
  widgetEventPrefix: "oj",

  options:
  {
    /** 
     * Specify the maximum number of child items to show in a logical page.
     * A value of 0 (the default) means that FilmStrip will show as many items
     * per logical page as will fit based on the component and item sizes.
     * 
     * <p>FilmStrip may show fewer than the specified number of items when 
     * <code class="prettyprint">maxItemsPerPage</code> is set to a value other 
     * than 0 if the component size is smaller than what would be required to 
     * show that many items.  
     *
     * @expose 
     * @memberof! oj.ojFilmStrip
     * @instance
     * @type {number}
     * @default <code class="prettyprint">0</code>
     * @see #getItemsPerPage
     *
     * @example <caption>Initialize the FilmStrip with the 
     * <code class="prettyprint">maxItemsPerPage</code> option specified:</caption>
     * $( ".selector" ).ojFilmStrip( { "maxItemsPerPage": 3 } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">maxItemsPerPage</code> 
     * option after initialization:</caption>
     * // getter
     * var maxItemsPerPage = $( ".selector" ).ojFilmStrip( "option", "maxItemsPerPage" );
     * 
     * // setter
     * $( ".selector" ).ojFilmStrip( "option", "maxItemsPerPage", 3 );
     */
    maxItemsPerPage: 0,
    
    /** 
     * Specify the orientation of the FilmStrip.
     *
     * @expose 
     * @memberof! oj.ojFilmStrip
     * @instance
     * @type {string}
     * @ojvalue {string} "horizontal" Orient the FilmStrip horizontally.
     * @ojvalue {string} "vertical" Orient the FilmStrip vertically.
     * @default <code class="prettyprint">"horizontal"</code>
     *
     * @example <caption>Initialize the FilmStrip with the 
     * <code class="prettyprint">orientation</code> option specified:</caption>
     * $( ".selector" ).ojFilmStrip( { "orientation": "vertical" } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">orientation</code> 
     * option after initialization:</caption>
     * // getter
     * var orientation = $( ".selector" ).ojFilmStrip( "option", "orientation" );
     * 
     * // setter
     * $( ".selector" ).ojFilmStrip( "option", "orientation", "vertical" );
     */
    orientation: "horizontal",
    
    /** 
     * Specify the child item whose logical page should be displayed.  The
     * position of the item on the logical page is not guaranteed.
     * 
     * <p>This option can be set to either the string id of the item or the 
     * numeric 0-based index of the item.  
     * 
     * <p>FilmStrip will automatically update the value of this option when the 
     * logical page is changed to be the first item on the new logical page.  
     * When the value is updated automatically, preference will be given to use 
     * a string id, if possible.  
     * 
     * <p>When the component is resized, FilmStrip will preserve the value of 
     * this option to show the new logical page on which the item is located.  
     *
     * @expose 
     * @memberof! oj.ojFilmStrip
     * @instance
     * @type {(string|number)}
     * @default <code class="prettyprint">0</code>
     *
     * @example <caption>Initialize the FilmStrip with the 
     * <code class="prettyprint">currentItem</code> option specified:</caption>
     * $( ".selector" ).ojFilmStrip( { "currentItem": 3 } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">currentItem</code> 
     * option after initialization:</caption>
     * // getter
     * var currentItem = $( ".selector" ).ojFilmStrip( "option", "currentItem" );
     * 
     * // setter
     * $( ".selector" ).ojFilmStrip( "option", "currentItem", 3 );
     */
    currentItem: 0,
    
    /**
     * Specify the placement of the navigation arrows.
     *
     * @expose 
     * @memberof! oj.ojFilmStrip
     * @instance
     * @type {string}
     * @ojvalue {string} "adjacent" Arrows are outside, adjacent to the filmStrip 
     *          content.  The arrows are still inside the bounds of the filmStrip
     *          component itself.
     * @ojvalue {string} "overlay" Arrows are inside, overlaying the filmStrip content.
     * @default <code class="prettyprint">"adjacent"</code>
     *
     * @example <caption>Initialize the FilmStrip with the 
     * <code class="prettyprint">arrowPlacement</code> option specified:</caption>
     * $( ".selector" ).ojFilmStrip( { "arrowPlacement": "overlay" } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">arrowPlacement</code> 
     * option after initialization:</caption>
     * // getter
     * var arrowPlacement = $( ".selector" ).ojFilmStrip( "option", "arrowPlacement" );
     * 
     * // setter
     * $( ".selector" ).ojFilmStrip( "option", "arrowPlacement", "overlay" );
     */
    arrowPlacement: "adjacent",
    
    /** 
     * Specify the visibility of the navigation arrows.
     *
     * @expose 
     * @memberof! oj.ojFilmStrip
     * @instance
     * @type {string}
     * @ojvalue {string} "visible" Arrows are visible.
     * @ojvalue {string} "hidden" Arrows are hidden.
     * @ojvalue {string} "hover" Arrows are visible when the mouse is over the 
     *          filmStrip, and hidden otherwise.
     * @ojvalue {string} "auto" Behaves as if the value were 
     *          <code class="prettyprint">visible</code> when the 
     *          <code class="prettyprint">arrowPlacement</code> 
     *          option is set to <code class="prettyprint">adjacent</code>, and
     *          <code class="prettyprint">hover</code> when the 
     *          <code class="prettyprint">arrowPlacement</code> 
     *          option is set to <code class="prettyprint">overlay</code>.
     * @default <code class="prettyprint">"auto"</code>
     *
     * @example <caption>Initialize the FilmStrip with the 
     * <code class="prettyprint">arrowVisibility</code> option specified:</caption>
     * $( ".selector" ).ojFilmStrip( { "arrowVisibility": "visible" } );
     * 
     * @example <caption>Get or set the <code class="prettyprint">arrowVisibility</code> 
     * option after initialization:</caption>
     * // getter
     * var arrowVisibility = $( ".selector" ).ojFilmStrip( "option", "arrowVisibility" );
     * 
     * // setter
     * $( ".selector" ).ojFilmStrip( "option", "arrowVisibility", "visible" );
     */
    arrowVisibility: "auto"
    
    /**
     * FilmStrip inherits the <code class="prettyprint">disabled</code> 
     * option from its superclass, but does not support it in order to avoid 
     * tight coupling between a FilmStrip and its contents.  Setting this
     * option on FilmStrip has no effect.
     * 
     * <p><b>WARNING:</b> Applications should not depend on this behavior 
     * because we reserve the right to change it in the future in order to 
     * support <code class="prettyprint">disabled</code> and propagate it to 
     * child components of FilmStrip.  
     * 
     * @member
     * @name disabled
     * @memberof oj.ojFilmStrip
     * @instance
     * @type {boolean}
     * @default <code class="prettyprint">false</code>
     */
    // disabled option declared in superclass, but we still want the above API doc

    // Events

    /**
     * Triggered when the filmStrip is created.
     *
     * @event
     * @name create
     * @memberof oj.ojFilmStrip
     * @instance
     * @property {Event} event <code class="prettyprint">jQuery</code> event object
     * @property {Object} ui Currently empty
     *
     * @example <caption>Initialize the filmStrip with the <code class="prettyprint">create</code> callback specified:</caption>
     * $( ".selector" ).ojFilmStrip({
     *     "create": function( event, ui ) {}
     * });
     *
     * @example <caption>Bind an event listener to the <code class="prettyprint">ojcreate</code> event:</caption>
     * $( ".selector" ).on( "ojcreate", function( event, ui ) {} );
     */
    // create event declared in superclass, but we still want the above API doc
  },

  /**
   * After _ComponentCreate and _AfterCreate, 
   * the widget should be 100% set up. this._super should be called first.
   * @override
   * @protected
   * @instance
   * @memberof oj.ojFilmStrip
   */
  _ComponentCreate: function() // Override of protected base class method.  
  {
    //call superclass first
    this._super();
    
    var elem = this.element;  
    elem
      .addClass("oj-filmstrip oj-component")
      .attr("tabindex", 0)
      .attr("role", "region");
    
    //ensure a unique id for use with aria-labelledby on navigation arrows
    elem.uniqueId();
    
    //log warning message when "disabled" option set
    var options = this.options;
    if (options.disabled)
      oj.Logger.warn(_WARNING_DISABLED_OPTION);
    
    //throw error if "orientation" option set to invalid value
    if (options.orientation !== _HORIZONTAL && options.orientation !== _VERTICAL)
      throw new Error(_ERROR_INVALID_ORIENTATION + options.orientation);
    
    //throw error if "arrowPlacement" option set to invalid value
    if (options.arrowPlacement !== _ADJACENT && 
        options.arrowPlacement !== _OVERLAY)
      throw new Error(_ERROR_INVALID_NAV_ARROW_PLACEMENT + options.arrowPlacement);
    
    //throw error if "arrowVisibility" option set to invalid value
    if (options.arrowVisibility !== _VISIBLE && 
        options.arrowVisibility !== _HIDDEN && 
        options.arrowVisibility !== _HOVER && 
        options.arrowVisibility !== _AUTO)
      throw new Error(_ERROR_INVALID_NAV_ARROW_VISIBILITY + options.arrowVisibility);
    
    this.touchEventNamespace = this.eventNamespace + "Touch";
    this.mouseEventNamespace = this.eventNamespace + "Mouse";
    this.keyEventNamespace = this.eventNamespace + "Key";
    this.navArrowHoverableEventNamespace = this.eventNamespace + "NavArrowHoverable";
    
    this._setup(true);
  },

  // This method currently runs at create, init, and refresh time (since refresh() is called by _init()).
  /**
   * Refreshes the visual state of the FilmStrip. JET components require a 
   * <code class="prettyprint">refresh()</code> or re-init after the DOM is 
   * programmatically changed underneath the component.
   * 
   * <p>This method does not accept any arguments.
   * 
   * @expose 
   * @memberof oj.ojFilmStrip
   * @instance
   * 
   * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
   * $( ".selector" ).ojFilmStrip( "refresh" );
   */
  refresh: function() // Override of public base class method.  
  {
    this._super();
    
    this._setup(false);
  },
  
  /**
   * Get the actual number of items shown per logical page.  
   * <p>The value returned by this method may be different from the value of the
   * <code class="prettyprint">maxItemsPerPage</code> option.
   * @returns {number} The actual number of items shown per logical page.
   * 
   * @expose 
   * @memberof oj.ojFilmStrip
   * @instance
   * @see #maxItemsPerPage
   * 
   * @example <caption>Invoke the <code class="prettyprint">getItemsPerPage</code> method:</caption>
   * var itemsPerPage = $( ".selector" ).ojFilmStrip( "getItemsPerPage" );
   */
  getItemsPerPage: function()
  {
    return this._itemsPerPage;
  },
  
  /**
   * Get the PagingModel created and used by the FilmStrip.  The PagingModel
   * provides information about the FilmStrip's logical pages and a way to
   * programmatically change pages.  
   * @returns {Object} The instance of the PagingModel created and used by the FilmStrip.
   * 
   * @expose 
   * @memberof oj.ojFilmStrip
   * @instance
   * 
   * @example <caption>Invoke the <code class="prettyprint">getPagingModel</code> method:</caption>
   * var pagingModel = $( ".selector" ).ojFilmStrip( "getPagingModel" );
   */
  getPagingModel: function()
  {
    return this._pagingModel;
  },
  
  /**
   * Notifies the component that its subtree has been made visible 
   * programmatically after the component has been created.
   * @memberof oj.ojFilmStrip
   * @instance
   * @protected 
   * @override
   */
  _NotifyShown: function()
  {
    this._super();
    //perform a deferred layout
    if (this._needsSetup)
      this._setup(this._needsSetup[0]);
  },
  
  /**
   * Notifies the component that its subtree has been connected to the document
   * programmatically after the component has been created.
   * @memberof oj.ojFilmStrip
   * @instance
   * @protected 
   * @override
   */
  _NotifyAttached: function()
  {
    this._super();
    //perform a deferred layout
    if (this._needsSetup)
      this._setup(this._needsSetup[0]);
  },

  // isInit is true for init (create and re-init), false for refresh
  /** 
   * Setup the filmStrip.
   * @param {boolean} isInit True if _setup is called from _init(), false
   *        if called from refresh().
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _setup: function(isInit) // Private, not an override (not in base class).  
  {
    var self = this;
    
    //FIX : always create paging model, even if filmstrip is
    //detached or hidden, so that it's available for an assocated paging
    //control
    //(Note: Check whether paging model is null, because if the filmstrip
    //was created while detached or hidden, then when it's attached or
    //shown, _setup will be called again with isInit=true, and we don't
    //want to create a different instance of the paging model.)
    if (isInit && !this._pagingModel)
      this._pagingModel = new oj.FilmStripPagingModel();
    
    //FIX : when using jquery find() in the filmStrip, filter out any results from
    //nested filmStrips
    if (isInit && !this._filterNestedFilmStripsFunc)
    {
      this._filterNestedFilmStripsFunc = function(index, elem)
      {
        return $(elem).closest(".oj-filmstrip")[0] === self.element[0];
      };
    }
    
    //if filmStrip is detached or hidden, we can't layout correctly, so 
    //defer layout until filmStrip is attached or shown
    if (!this._canCalculateSizes())
    {
      //want a true value of isInit to take precedence over a false value
      var oldIsInit = false;
      if (this._needsSetup)
      {
        oldIsInit = this._needsSetup[0];
      }
      this._needsSetup = [isInit || oldIsInit];
      return;
    }
    this._needsSetup = null;
    
    this._bRTL = (this._GetReadingDirection() === "rtl");
    this._bTouchSupported = oj.DomUtils.isTouchSupported();
    var elem = this.element;
    if (isInit)
    {
      this._itemsPerPage = 0;
      this._handlePageFunc = function(event) {self._handlePage(event);};
      this._componentSize = 0;
      this._itemSize = -1;
      this._handleTransitionEndFunc = function(event) {self._handleTransitionEnd();};
      this._handleResizeFunc = function(width, height) {self._handleResize();};
      
      if (this._bTouchSupported)
      {
        this._handleTouchStartFunc = function(event) {self._handleTouchStart(event);};
        this._handleTouchMoveFunc = function(event) {self._handleTouchMove(event);};
        this._handleTouchEndFunc = function(event) {self._handleTouchEnd(event);};
        this._addTouchListeners();
      }
      this._handleMouseDownFunc = function(event) {self._handleMouseDown(event);};
      this._handleMouseMoveFunc = function(event) {self._handleMouseMove(event);};
      this._handleMouseUpFunc = function(event) {self._handleMouseUp(event);};
      this._addMouseListeners();
      this._handleKeyDownFunc = function(event) {self._handleKeyDown(event);};
      this._addKeyListeners();
    }
    else
      this._destroyInternal();
    
    //notify the original children of the filmStrip that they were detached from
    //the DOM BEFORE actually detaching so that components can save state
    var originalItems = elem.children();
    for (var i = 0; i < originalItems.length; i++)
      oj.Components.subtreeDetached(originalItems[i]);
    
    var pagingModel = this._pagingModel;
    if (isInit)
    {
      //register the page change listener
      pagingModel.on("page", this._handlePageFunc);
    }
    //initialize the paging model with the total number of items
    //FIX : always set total size on paging model in case
    //items have been appended and filmstrip has been refreshed
    pagingModel.setTotalSize(originalItems.length);
    
    //wrap the original child DOM BEFORE adding the resize listener
    this._wrapChildren();
    
    //FIX : only need to calculate layout if the filmstrip is
    //not empty
    if (originalItems.length > 0)
    {
      this._adjustSizes();

      //notify the original children of the filmStrip that they were attached
      //again after wrapping them
      for (var i = 0; i < originalItems.length; i++)
        oj.Components.subtreeAttached(originalItems[i]);

      oj.DomUtils.addResizeListener(elem[0], this._handleResizeFunc);
    }
  },

  /** 
   * Destroy the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @override
   * @protected
   */
  _destroy: function() // Override of protected base class method.  
  {
    if (this._bTouchSupported)
    {
      this._removeTouchListeners();
      this._handleTouchStartFunc = null;
      this._handleTouchMoveFunc = null;
      this._handleTouchEndFunc = null;
    }
    this._removeMouseListeners();
    this._handleMouseDownFunc = null;
    this._handleMouseMoveFunc = null;
    this._handleMouseUpFunc = null;
    this._removeKeyListeners();
    this._handleKeyDownFunc = null;
    
    this._destroyInternal();
    this._pagingModel.off("page", this._handlePageFunc);
    this._handlePageFunc = null;
    this._pagingModel = null;
    this._handleResizeFunc = null;
    this._handleTransitionEndFunc = null;
    this._filterNestedFilmStripsFunc = null;
    
    var elem = this.element;
    elem
      .removeClass("oj-filmstrip oj-component " + _OJ_FILMSTRIP_HOVER)
      .removeAttr("tabindex role");
    
    //remove a generated unique id
    elem.removeUniqueId();
    
    this._super();
  },
  
  /** 
   * Destroy the internal structure of the filmStrip that will be recreated
   * during a refresh.
   * @memberof oj.ojMasonryLayout
   * @instance
   * @private
   */
  _destroyInternal: function()
  {
    var elem = this.element;
    oj.DomUtils.removeResizeListener(elem[0], this._handleResizeFunc);
    //reset item size so it will be recalculated at the next layout
    this._itemSize = -1;
    if (this._queuedHandleResize)
    {
      clearTimeout(this._queuedHandleResize);
      this._queuedHandleResize = null;
    }
    
    var originalItems = this._getItems();
    //notify the original children of the filmStrip that they were detached from
    //the DOM BEFORE actually detaching so that components can save state
    for (var i = 0; i < originalItems.length; i++)
      oj.Components.subtreeDetached(originalItems[i]);
    
    this._clearCalculatedSizes();
    var itemContainers = this._getItemContainers();
    //remove logical page containers here instead of in _unwrapChildren because 
    //they're added in _adjustSizes, not in _wrapChildren
    itemContainers.unwrap();
    this._unwrapChildren();
    
    //notify the original children of the filmStrip that they were attached 
    //again after unwrapping them
    for (var i = 0; i < originalItems.length; i++)
      oj.Components.subtreeAttached(originalItems[i]);
  },

  /** 
   * Set an option on the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @override
   * @protected
   */
  _setOption: function(key, value, flags) // Override of protected base class method.
                                   // Method name needn't be quoted since is in externs.js.
  {
    var options = this.options;
    var bRefresh = false;
    var newPageIndex = -1;
    var pagingModel = this._pagingModel;
    var oldPageIndex = pagingModel.getPage();
    switch (key) 
    {
      case "disabled":
        //log warning message when "disabled" option set
        oj.Logger.warn(_WARNING_DISABLED_OPTION);
        break;
      case "orientation":
        //throw error if "orientation" option set to invalid value
        if (value !== _HORIZONTAL && value !== _VERTICAL)
          throw new Error(_ERROR_INVALID_ORIENTATION + value);
        bRefresh = (options.orientation != value);
        break;
      case "maxItemsPerPage":
        bRefresh = (options.maxItemsPerPage != value);
        break;
      case "arrowPlacement":
        //throw error if "arrowPlacement" option set to invalid value
        if (value !== _ADJACENT && value !== _OVERLAY)
          throw new Error(_ERROR_INVALID_NAV_ARROW_PLACEMENT + value);
        bRefresh = (options.arrowPlacement != value);
        break;
      case "arrowVisibility":
        //throw error if "arrowVisibility" option set to invalid value
        if (value !== _VISIBLE && value !== _HIDDEN && 
            value !== _HOVER && value !== _AUTO)
          throw new Error(_ERROR_INVALID_NAV_ARROW_VISIBILITY + value);
        bRefresh = (options.arrowVisibility != value);
        break;
      case _CURRENT_ITEM:
        if (options.currentItem != value)
        {
          newPageIndex = this._findPage(value);
          //throw error if item not found
          if (newPageIndex < 0 || newPageIndex >= pagingModel.getPageCount())
            throw new Error(_ERROR_CURRENT_ITEM_NOT_FOUND + value);
        }
        break;
    }
    
    this._super(key, value, flags);
    
    switch (key)
    {
      case _CURRENT_ITEM:
        if (newPageIndex > -1 && newPageIndex != oldPageIndex)
          pagingModel.setPage(newPageIndex);
        break;
    }
    
    if (bRefresh)
      this._setup(false);
  },
  
  /** 
   * Handle a component resize.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleResize: function()
  {
    //handle the resize if not already handling one
    if (!this._bHandlingResize)
    {
      this._bHandlingResize = true;
      this._adjustSizes(true);
      this._bHandlingResize = false;
    }
    //if already handling a resize, queue another one
    else if (!this._queuedHandleResize)
    {
      var self = this;
      this._queuedHandleResize = setTimeout(function()
        {
          self._queuedHandleResize = null;
          self._handleResize();
        }, 0);
    }
  },
  
  /** 
   * Determine whether the filmStrip is oriented horizontally or vertically.
   * @returns {boolean} True if horizontal, false if vertical.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _isHorizontal: function()
  {
    var options = this.options;
    return (options.orientation !== _VERTICAL);
  },
  
  /** 
   * Get the CSS position attribute to use.
   * @returns {string} CSS position attribute name.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getCssPositionAttr: function()
  {
    var bHorizontal = this._isHorizontal();
    return bHorizontal ? (this._bRTL ? "right" : "left") : "top";
  },
  
  /** 
   * Get the CSS size attribute to use.
   * @returns {string} CSS size attribute name.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getCssSizeAttr: function()
  {
    var bHorizontal = this._isHorizontal();
    return bHorizontal ? "width" : "height";
  },

  /** 
   * Determine whether the filmStrip can calculate sizes (when it is 
   * attached to the page DOM and not hidden).
   * @returns {boolean} True if sizes can be calculated, false if not.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _canCalculateSizes: function() 
  {
    var div = document.createElement("div");
    var style = div.style;
    //need to set absolute position in order to get correct offsetwidth when 
    //flexbox layout is applied; otherwise the offsetwidth becomes 0
    style.position = "absolute";
    style.width = "10px";
    style.height = "10px";
    var elem = this.element[0];
    elem.appendChild(div);
    var bCanCalcSizes = false;
    try
    {
      bCanCalcSizes = div.offsetWidth > 0 && div.offsetHeight > 0;
    }
    catch (e)
    {
      //do nothing
    }
    elem.removeChild(div);
    return bCanCalcSizes;
  },
  
  /** 
   * Wrap the original child items of the filmStrip in internal layout structure.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _wrapChildren: function()
  {
    var elem = this.element;
    var bHorizontal = this._isHorizontal();
    var originalItems = elem.children();
    
    originalItems
      .addClass(_OJ_FILMSTRIP_ITEM)
      .wrap("<div class='" + _OJ_FILMSTRIP_CONTAINER + " " + _OJ_FILMSTRIP_ITEM_CONTAINER + "'></div>"); // @HTMLUpdateOK
    
    //need to initially specify the position on the pagesWrapper so that we can
    //always get the value later
    var cssAttr = this._getCssPositionAttr();
    var pagesWrapper = elem.children()
      .wrapAll("<div class='" + _OJ_FILMSTRIP_CONTAINER + " " + _OJ_FILMSTRIP_PAGES_CONTAINER + "' style='" + cssAttr + ": 0px;'></div>") // @HTMLUpdateOK
      .parent();
    this._pagesWrapper = pagesWrapper;
    
    var options = this.options;
    if (options.arrowVisibility !== _HIDDEN &&
        options.arrowPlacement === _ADJACENT)
    {
      //FIX : add the oj-filmstrip-container class to the content
      //container so that it is a flexbox layout
      this._contentWrapper = pagesWrapper
        .wrap("<div class='" + _OJ_FILMSTRIP_CONTAINER + " oj-filmstrip-content-container'></div>") // @HTMLUpdateOK
        .parent();
    }
    
    elem.addClass(_OJ_FILMSTRIP_CONTAINER);
    if (!bHorizontal)
      elem.addClass(_OJ_FILMSTRIP_VERTICAL);
    
    //FIX : only need to create nav buttons if the filmstrip 
    //is not empty
    if (options.arrowVisibility !== _HIDDEN &&
        originalItems.length > 0)
    {
      this._prevButton = this._createPrevNavArrow();
      this._nextButton = this._createNextNavArrow();

      if (this._navArrowsShownOnHover())
        this._setupNavArrowsHoverable();
    }
  },
  
  /** 
   * Unwrap the internal layout structure around the original child items of the 
   * filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _unwrapChildren: function()
  {
    var elem = this.element;
    var originalItems = this._getItems();
    
    //unregister elem as hoverable
    this._tearDownNavArrowsHoverable();
    
    //remove navigation arrow containers
    if (this._prevButton)
    {
      this._UnregisterChildNode(this._prevButton);
      this._prevButton = null;
    }
    if (this._nextButton)
    {
      this._UnregisterChildNode(this._nextButton);
      this._nextButton = null;
    }
    var navArrowContainers = elem.children(_PERIOD + _OJ_FILMSTRIP_ARROW_CONTAINER);
    if (navArrowContainers)
      navArrowContainers.remove();
    
    //the individual page containers that were added in _adjustSizes are not
    //removed here; they are expected to have been removed before calling
    //_unwrapChildren
    originalItems
      .removeClass(_OJ_FILMSTRIP_ITEM) //original children
      .unwrap()                        //remove item containers
      .unwrap();                       //remove pages container
    this._pagesWrapper = null;
    if (this._contentWrapper)
    {
      originalItems.unwrap();          //remove content container
      this._contentWrapper = null;
    }
    
    elem.removeClass(_OJ_FILMSTRIP_CONTAINER + " " + _OJ_FILMSTRIP_VERTICAL);
  },
  
  /** 
   * Setup events to only show the navigation arrows when the mouse hovers over
   * the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _setupNavArrowsHoverable: function()
  {
    //Note: Use oj-filmstrip-hover marker instead of standard oj-hover marker
    //because if we use the standard one, then when it's added to the filmStrip
    //root node, all hoverables inside the filmStrip appear as if the mouse
    //were hovering over them.  
    //Note: keep this logic updated if superclass _hoverable method changes.
    var elem = this.element;
    elem
      .on("mouseenter" + this.navArrowHoverableEventNamespace, function(event) {
        if (!$(event.currentTarget).hasClass( "oj-disabled" ))
          $(event.currentTarget).addClass(_OJ_FILMSTRIP_HOVER);
      })
      .on("mouseleave" + this.navArrowHoverableEventNamespace, function(event) {
        $(event.currentTarget).removeClass(_OJ_FILMSTRIP_HOVER);
      });
  },
  
  /** 
   * Tear down events to only show the navigation arrows when the mouse hovers 
   * over the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _tearDownNavArrowsHoverable: function()
  {
    var elem = this.element;
    elem.off(this.navArrowHoverableEventNamespace);
  },
  
  /** 
   * Determine whether navigation arrows should only be shown on hover.
   * @returns {boolean} True if nav arrows should only be shown on hover, false
   *          otherwise.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _navArrowsShownOnHover: function()
  {
    var options = this.options;
    var arrowVisibility = options.arrowVisibility;
    return  (arrowVisibility === _HOVER || 
             (arrowVisibility === _AUTO && options.arrowPlacement === _OVERLAY));
  },
  
  /** 
   * Determine whether there is a previous logical page.
   * @returns {boolean} True if there is a previous logical page, false otherwise.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _hasPrevPage: function()
  {
    var pagingModel = this._pagingModel;
    return pagingModel.getPage() > 0;
  },
  
  /** 
   * Determine whether there is a next logical page.
   * @returns {boolean} True if there is a next logical page, false otherwise.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _hasNextPage: function()
  {
    var pagingModel = this._pagingModel;
    return pagingModel.getPage() < pagingModel.getPageCount() - 1;
  },
  
  /** 
   * Go to the previous logical page.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _prevPage: function()
  {
    if (this._hasPrevPage())
    {
      var pagingModel = this._pagingModel;
      pagingModel.setPage(pagingModel.getPage() - 1);
    }
  },
  
  /** 
   * Go to the next logical page.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _nextPage: function()
  {
    if (this._hasNextPage())
    {
      var pagingModel = this._pagingModel;
      pagingModel.setPage(pagingModel.getPage() + 1);
    }
  },
  
  /** 
   * Determine whether there is a next logical page.
   * @param {boolean} bShow True to show the navigation arrow, false to hide it.
   * @param {jQuery} jqNavArrow Navigation arrow jQuery object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _displayNavigationArrow: function(bShow, jqNavArrow)
  {
    var options = this.options;
    var navArrowPlacement = options.arrowPlacement;
    if (navArrowPlacement === _ADJACENT)
      jqNavArrow.css("visibility", bShow ? "" : _HIDDEN);
    else
      jqNavArrow.parent().css("display", bShow ? "" : _NONE);
  },
  
  /** 
   * Update whether the navigation arrows are shown.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _updateNavigationArrowsDisplay: function()
  {
    var options = this.options;
    var navArrowVisibility = options.arrowVisibility;
    if (navArrowVisibility !== _HIDDEN)
    {
      var pagingModel = this._pagingModel;
      var pageIndex = pagingModel.getPage();
      var pageCount = pagingModel.getPageCount();
      this._displayNavigationArrow(pageIndex !== 0, this._prevButton);
      this._displayNavigationArrow(pageIndex !== pageCount - 1, this._nextButton);
    }
  },
  
  /** 
   * Create the previous navigation arrow.
   * @returns {jQuery} Navigation arrow jQuery object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _createPrevNavArrow: function()
  {
    var elem = this.element;
    var bHorizontal = this._isHorizontal();
    var locationMarker = bHorizontal ? _OJ_START : _OJ_TOP;
    var container = this._createNavigationArrowContainer(locationMarker);
    
    var options = this.options;
    var navArrowPlacement = options.arrowPlacement;
    //need to append prev button when overlay so that it is in front of the
    //filmstrip items in z-order
    if (navArrowPlacement === _OVERLAY)
      elem.append(container); // @HTMLUpdateOK
    else
      elem.prepend(container); // @HTMLUpdateOK
    
    var label = _escapeHtml(this.getTranslatedString("labelAccArrowPreviousPage"));
    var tooltip = _escapeHtml(this.getTranslatedString("tipArrowPreviousPage"));
    var navArrow = this._createNavigationArrow(container, locationMarker, label, tooltip);
    var self = this;
    navArrow.on("click", function() {self._prevPage();});
    
    return navArrow;
  },
  
  /** 
   * Create the next navigation arrow.
   * @returns {jQuery} Navigation arrow jQuery object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _createNextNavArrow: function()
  {
    var elem = this.element;
    var bHorizontal = this._isHorizontal();
    var locationMarker = bHorizontal ? _OJ_END : _OJ_BOTTOM;
    var container = this._createNavigationArrowContainer(locationMarker);
    elem.append(container); // @HTMLUpdateOK
    
    var label = _escapeHtml(this.getTranslatedString("labelAccArrowNextPage"));
    var tooltip = _escapeHtml(this.getTranslatedString("tipArrowNextPage"));
    var navArrow = this._createNavigationArrow(container, locationMarker, label, tooltip);
    var self = this;
    navArrow.on("click", function() {self._nextPage();});
    
    return navArrow;
  },
  
  /** 
   * Create the container around a navigation arrow.
   * @param {string} locationMarker Marker class for the location of the 
   *        navigation arrow: oj-top, oj-bottom, oj-start, or oj-end.
   * @returns {jQuery} jQuery object for the container around a navigation arrow.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _createNavigationArrowContainer: function(locationMarker)
  {
    var container = $(document.createElement("div"));
    container.addClass(_OJ_FILMSTRIP_ARROW_CONTAINER + " " + locationMarker);
    var options = this.options;
    var navArrowPlacement = options.arrowPlacement;
    if (navArrowPlacement === _OVERLAY)
    {
      container.addClass("oj-filmstrip-arrow-container-overlay");
      
      if (this._navArrowsShownOnHover())
        container.addClass(_OJ_FILMSTRIP_ARROW_TRANSITION);
    }
    return container;
  },
  
  /** 
   * Create a navigation arrow.
   * @param {jQuery} parentElem Parent DOM element of the navigation arrow.
   * @param {string} locationMarker Marker class for the location of the 
   *        navigation arrow: oj-top, oj-bottom, oj-start, or oj-end.
   * @param {string} label Accessible label for the navigation arrow.
   * @param {string} tooltip Tooltip for the navigation arrow.
   * @returns {jQuery} Navigation arrow jQuery object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _createNavigationArrow: function(parentElem, locationMarker, label, tooltip)
  {
    var str = "<div class='" + _OJ_FILMSTRIP_ARROW + " oj-default oj-enabled " + locationMarker + "' role='button' tabindex='-1'";
    str += "><span class='oj-filmstrip-arrow-icon " + locationMarker + " oj-component-icon'></span></div>";
    parentElem.append(str); // @HTMLUpdateOK
    var elem = this.element;
    var elemId = elem.attr("id");
    var arrowElem = parentElem.children(_PERIOD + _OJ_FILMSTRIP_ARROW).eq(0);
    arrowElem.uniqueId();
    var arrowId = arrowElem.attr("id");
    if (label)
      arrowElem.attr("aria-label", label);
    if (tooltip)
      arrowElem.attr("title", tooltip);
    arrowElem.attr("aria-labelledby", arrowId + " " + elemId);

    //  - filmstrip: next/previous oj-hover colors doesn't go away in touch device
    this._AddHoverable(arrowElem);
    this._AddActiveable(arrowElem);
    
    var options = this.options;
    var navArrowPlacement = options.arrowPlacement;
    if (navArrowPlacement === _ADJACENT)
    {
      if (this._navArrowsShownOnHover())
        arrowElem.addClass(_OJ_FILMSTRIP_ARROW_TRANSITION);
    }
    
    return arrowElem;
  },
  
  /** 
   * Get the containers around the original child items.
   * @returns {jQuery} The containers around the original child items.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getItemContainers: function()
  {
    var pagesWrapper = this._pagesWrapper;
    var items = pagesWrapper.find(_PERIOD + _OJ_FILMSTRIP_ITEM_CONTAINER)
      .filter(this._filterNestedFilmStripsFunc);
    return items;
  },
  
  /** 
   * Get the original child items.
   * @returns {jQuery} The original child items.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getItems: function()
  {
    var pagesWrapper = this._pagesWrapper;
    var originalItems = pagesWrapper.find(_PERIOD + _OJ_FILMSTRIP_ITEM)
      .filter(this._filterNestedFilmStripsFunc);
    return originalItems;
  },
  
  /** 
   * Get the logical page containers.
   * @returns {jQuery} The logical page containers.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getPages: function()
  {
    var pagesWrapper = this._pagesWrapper;
    var pages = pagesWrapper.children(_PERIOD + _OJ_FILMSTRIP_PAGE);
    return pages;
  },
  
  /** 
   * Clear the calculated sizes set on the internal layout DOM structure.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _clearCalculatedSizes: function()
  {
    var pagesWrapper = this._pagesWrapper;
    var pages = this._getPages();
    pages
      .css(_FLEX_BASIS, _EMPTY_STRING)
      .css(_WEBKIT_FLEX_BASIS, _EMPTY_STRING);
    var items = this._getItemContainers();
    items
      .css(_FLEX_BASIS, _EMPTY_STRING)
      .css(_WEBKIT_FLEX_BASIS, _EMPTY_STRING);
    pagesWrapper.css(this._getCssSizeAttr(), _EMPTY_STRING);
  },
  
  /** 
   * Calculate sizes and set them on the internal layout DOM structure.
   * @param {boolean} bNotifyAttach True to notify children when they're 
   *        attached to/detached from the DOM, false to not notify them (when 
   *        the notification will happen outside of this method).
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _adjustSizes: function(bNotifyAttach)
  {
    //clear previously calculated values before recalculating
    this._clearCalculatedSizes();
    
    var options = this.options;
    var bHorizontal = this._isHorizontal();
    var itemsPerPage = options.maxItemsPerPage;
    var bCalcItemsPerPage = (itemsPerPage < 1);
    var elem = this.element;
    
    var items = this._getItemContainers();
    //if we haven't saved the item size yet, do it now
    if (this._itemSize < 0)
    {
      //use the size of the item specified in the options
      var optionItemIndex = this._getItemIndex(options.currentItem);
      var optionItemContainer = $(items[optionItemIndex]);
      
      //unhide the item, in case the app has initially hidden it
      var optionItem = optionItemContainer.children(_PERIOD + _OJ_FILMSTRIP_ITEM);
      optionItem.css(_DISPLAY, _EMPTY_STRING);
      //notify the item that it's being shown
      oj.Components.subtreeShown(optionItem[0]);
      
      this._itemSize = bHorizontal ? optionItemContainer.width() : optionItemContainer.height();
    }
    
    //get component size after itemSize, in case item needed to be unhidden
    var componentSize = bHorizontal ? elem.width() : elem.height();
    if (options.arrowVisibility !== _HIDDEN &&
        options.arrowPlacement === _ADJACENT)
    {
      var arrowContainers = elem.children(_PERIOD + _OJ_FILMSTRIP_ARROW_CONTAINER);
      var firstArrowContainer = arrowContainers.eq(0);
      var arrowSize = bHorizontal ? firstArrowContainer.width() : firstArrowContainer.height();
      componentSize -= 2 * arrowSize;
    }
    this._componentSize = componentSize;
    
    //if there are a fixed number of items per page, but the number specified
    //won't fit, then reduce the number to what will fit
    if (!bCalcItemsPerPage)
    {
      //use min of 1 to prevent browser crash
      var calcFitCount = Math.max(Math.floor(componentSize / this._itemSize), 1);
      if (calcFitCount < itemsPerPage)
        itemsPerPage = calcFitCount;
    }
    
    //if calculating fitCount, use min of 1 to prevent browser crash
    var fitCount = bCalcItemsPerPage ? Math.max(Math.floor(componentSize / this._itemSize), 1) : itemsPerPage;
    var fitItemSize = componentSize / fitCount;
    items
      .css(_FLEX_BASIS, fitItemSize + _PX)
      .css(_WEBKIT_FLEX_BASIS, fitItemSize + _PX);
    
    var newPageCount = Math.ceil(items.length / fitCount);
    //wrap items in logical page containers
    var pages = this._getPages();
    var bCreatePages = false;
    //need to create logical pages if page layout changed, or if we haven't 
    //yet created logical pages
    var pagingModel = this._pagingModel;
    if (pagingModel.getPageCount() != newPageCount ||
        this._itemsPerPage != fitCount ||
        !pages || pages.length < 1)
    {
      bCreatePages = true;
      if (bNotifyAttach)
      {
        //notify the original children of the filmStrip that they were detached from
        //the DOM BEFORE actually detaching so that components can save state
        for (var i = 0; i < items.length; i++)
          oj.Components.subtreeDetached(items[i]);
      }
      
      if (pages && pages.length > 0)
      {
        //remove old logical page containers
        items.unwrap();
      }
      
      //create new logical page containers
      for (var i = 0; i < items.length; i += fitCount)
      {
        var itemsOnPage = items.slice(i, i + fitCount);
        //initially hide the page container
        itemsOnPage.wrapAll("<div class='" + _OJ_FILMSTRIP_CONTAINER + " " + _OJ_FILMSTRIP_PAGE + "' style='" + _DISPLAY + ": " + _NONE + ";' " + _ARIA_HIDDEN + "='true'></div>"); // @HTMLUpdateOK
      }

      if (bNotifyAttach)
      {
        //notify the original children of the filmStrip that they were attached
        //again after wrapping them
        for (var i = 0; i < items.length; i++)
          oj.Components.subtreeAttached(items[i]);
      }
    }
    //always need to update size of each page, even if page count doesn't change
    pages = this._getPages();
    pages
      .css(_FLEX_BASIS, componentSize + _PX)
      .css(_WEBKIT_FLEX_BASIS, componentSize + _PX);
    
    //always need to update the pages container size
    var pagesWrapper = this._pagesWrapper;
    var contentWrapper = this._contentWrapper;
    //only show a single page at a time
    pagesWrapper.css(this._getCssSizeAttr(), componentSize);
    if (contentWrapper)
      contentWrapper.css(this._getCssSizeAttr(), componentSize);
    
    var newPageIndex = 0;
    if (options.currentItem || options.currentItem === 0)
      newPageIndex = this._findPage(options.currentItem, fitCount);
    
    if (pagingModel.getPageCount() != newPageCount || 
        this._itemsPerPage != fitCount ||
        pagingModel.getPage() != newPageIndex)
    {
      pagingModel.setPage(newPageIndex, {"pageSize": fitCount});
    }
    //if the page layout didn't change, but we recreated the logical page
    //containers, then simply go to the current logical page to make sure that
    //pages and items are hidden or shown as appropriate
    else if (bCreatePages)
    {
      var currPage = pagingModel.getPage();
      this._handlePage({"previousPage": currPage, "page": currPage});
    }
  },
  
  /** 
   * Handle a 'page' event from the PagingModel.
   * @param {Object} event Event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handlePage: function(event)
  {
    var pageIndex = event["page"];
    var prevPageIndex = event["previousPage"];
    var pagesWrapper = this._pagesWrapper;
    var options = this.options;
    var pages = this._getPages();
    var pagingModel = this._pagingModel;
    var pageSize = pagingModel.getPageSize();
    var bImmediate = prevPageIndex < 0 || prevPageIndex == pageIndex ||
                     this._itemsPerPage != pageSize;
    //update _itemsPerPage AFTER using it to initialize bImmediate above
    this._itemsPerPage = pageSize;
    
    //get the old page, if there is one
    var oldPage = null;
    if (!bImmediate)
      oldPage = $(pages[prevPageIndex]);
    
    var cssAttr = this._getCssPositionAttr();
    
    //unhide the new page
    var newPage = $(pages[pageIndex]);
    var bPageHidden = newPage.is(_HIDDEN_SELECTOR);
    if (bPageHidden)
      this._unhidePage(newPage);
    //defer the scroll if we're dragging so that we can animate it
    var bDeferScroll = this._bDragInit;
    if (prevPageIndex > -1 && !bImmediate)
    {
      bDeferScroll = true;
      //set size of pages wrapper to show two pages at a time because both of
      //them will temporarily be visible
      pagesWrapper.css(this._getCssSizeAttr(), 2 * this._componentSize);
      //if going to the previous page, initially scroll to show the current page
      //because the previous page will be at the current scroll position
      if (pageIndex < prevPageIndex)
      {
        //only adjust scroll if the page was hidden (in the case of dragging,
        //the page will already be unhidden and scrolled correctly)
        if (bPageHidden)
          pagesWrapper.css(cssAttr, -this._componentSize + _PX);
      }
      
      //set initial transition states on the pages
      if (pageIndex > prevPageIndex)
      {
        oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_FROM);
        newPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_FROM);
      }
      else
      {
        oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_FROM);
        newPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_FROM);
      }
    }
    
    if (bDeferScroll)
    {
      var self = this;
      var bDragInit = this._bDragInit;
      //if bouncing back because a drag scroll didn't cross the threshold,
      //add the transition class before the timeout because the transforms
      //are removed and reapplied in the timeout
      if (bDragInit && prevPageIndex < 0)
      {
        var visiblePages = pages.filter(_VISIBLE_SELECTOR);
        visiblePages.addClass(_OJ_FILMSTRIP_TRANSITION);
      }
      //FIX : In Safari on Mac OS X, sometimes when changing pages
      //the new page appears hidden until after the transition.  It seems to be
      //a timing issue where the new page has been made visible in the DOM, but
      //Safari hasn't processed that change before the transition starts.  
      //Changing the timeout delay from 0 to 25 seems to help.
      setTimeout(function()
        {
          self._finishHandlePage(pageIndex, prevPageIndex, bImmediate, bDragInit);
        }, 25);
    }
    else
      this._finishHandlePage(pageIndex, prevPageIndex, bImmediate);
  },
  
  /** 
   * Finish handling a 'page' event from the PagingModel.
   * @param {number} pageIndex 0-based page index to go to.
   * @param {number} prevPageIndex 0-based old page index.
   * @param {boolean} bImmediate True to change pages immediately with no 
   *        transition, false to transition them over time.
   * @param {boolean} bDragInit True if we're currently drag scrolling, false
   *        otherwise.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _finishHandlePage: function(pageIndex, prevPageIndex, bImmediate, bDragInit)
  {
    var pagesWrapper = this._pagesWrapper;
    if (!bImmediate)
    {
      this._bPageChangeTransition = true;
      pagesWrapper
        .on("transitionend" + this.eventNamespace + " webkitTransitionEnd" + this.eventNamespace, 
            this._handleTransitionEndFunc);
    }

    if (bImmediate)
      this._handleTransitionEnd();
    else
    {
      var pages = this._getPages();
      //if we're currently drag scrolling, remove the transforms that we used
      //to scroll while we were under the drag threshold
      if (bDragInit)
        _removeTransform(pages);
      
      //changing pages
      if (prevPageIndex > -1)
      {
        //remove initial transition states and set destination states, and
        //transition between them
        var bNext = pageIndex > prevPageIndex;
        var oldPage = $(pages[prevPageIndex]);
        var newPage = $(pages[pageIndex]);
        oldPage.addClass(_OJ_FILMSTRIP_TRANSITION);
        newPage.addClass(_OJ_FILMSTRIP_TRANSITION);
        if (bNext)
        {
          oldPage.removeClass(_OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_FROM);
          newPage.removeClass(_OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_FROM);
          oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_TO);
          newPage.addClass(_OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_TO);
        }
        else
        {
          oldPage.removeClass(_OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_FROM);
          newPage.removeClass(_OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_FROM);
          oldPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_TO);
          newPage.addClass(_OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_TO);
        }
      }
      //bouncing back to current page after drag scrolling under the threshold
      else if (bDragInit)
      {
        var visiblePages = pages.filter(_VISIBLE_SELECTOR);
        _applyTransform(visiblePages, "translate3d(0, 0, 0)");
      }
    }
  },
  
  /** 
   * Handle the end of a page change transition.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleTransitionEnd: function()
  {
    this._bPageChangeTransition = false;
    var pagesWrapper = this._pagesWrapper;
    var cssAttr = this._getCssPositionAttr();
    pagesWrapper
      .off(this.eventNamespace)
      .css(this._getCssSizeAttr(), this._componentSize)
      .css(cssAttr, "0px");
    
    //if the filmStrip contains the focus element, we may need to focus a new
    //element if the old one is on a page that's being hidden
    var focusElem = null;
    if (oj.FocusUtils.containsFocus(pagesWrapper[0]) ||
        (this._nextButton && oj.FocusUtils.containsFocus(this._nextButton[0])) ||
        (this._prevButton && oj.FocusUtils.containsFocus(this._prevButton[0])))
      focusElem = document.activeElement;
    
    var pagingModel = this._pagingModel;
    var pageIndex = pagingModel.getPage();
    
    //hide all pages except for current one
    var pages = this._getPages();
    for (var i = 0; i < pages.length; i++)
    {
      if (i != pageIndex)
        this._hidePage($(pages[i]));
    }
    //remove transition classes
    pages
      .removeClass(_OJ_FILMSTRIP_TRANSITION + " " + 
                   _OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_TO + " " + 
                   _OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_TO + " " + 
                   _OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_TO + " " + 
                   _OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_TO);
    //remove transforms left over from drag scrolling
    _removeTransform(pages);
    
    //update display of the navigation arrows
    this._updateNavigationArrowsDisplay();
    
    //if the old focus element is being hidden, transfer focus to something visible
    if (focusElem && $(focusElem).is(_HIDDEN_SELECTOR))
    {
      var elem = this.element;
      //focus an element in the new logical page if possible, otherwise focus
      //the filmStrip itself
      var firstTabStop = oj.FocusUtils.getFirstTabStop(pages[pageIndex]);
      if (firstTabStop)
        oj.FocusUtils.focusElement(firstTabStop);
      else
        oj.FocusUtils.focusElement(elem[0]);
    }
    
    //update currentItem option if it's not on the current page
    var options = this.options;
    var currItemPage = this._findPage(options.currentItem);
    if (currItemPage != pageIndex)
    {
      var newFirstItem = this._getFirstItemOnPage(pageIndex);
      //FIX : only update currentItem option if the filmstrip
      //is not empty
      if (newFirstItem !== -1)
        this.option(_CURRENT_ITEM, newFirstItem, {'_context': {writeback: true}});
    }
  },
  
  /** 
   * Get the 0-based index of the specified item.
   * @param {(string|number)} item String id or 0-based index of item.
   * @returns {number} The 0-based index of the specified item, or -1 if not found.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getItemIndex: function(item)
  {
    var itemIndex = -1;
    var items = this._getItems();
    if (typeof item === "number") {
      if (item >= 0 && item < items.length)
        itemIndex = item;
    }
    else if (typeof item === "string") {
      //security test
      if (oj.DomUtils.isValidIdentifier(item))
      {
        for (var i = 0; i < items.length; i++)
        {
          var itemElem = items[i];
          var itemId = itemElem.id;
          if (itemId && itemId.length > 0 && itemId === item)
          {
            itemIndex = i;
            break;
          }
        }
      }
    }
    return itemIndex;
  },
  
  /** 
   * Find the logical page containing the specified item.
   * @param {(string|number)} item String id or 0-based index of item.
   * @param {?number} itemsPerPage The number of items on each logical page.
   * @returns {number} The 0-based index of the logical page containing the item, 
   *          or -1 if not found.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _findPage: function(item, itemsPerPage)
  {
    var itemIndex = this._getItemIndex(item);
    var pageIndex = -1;
    if (itemIndex > -1)
    {
      if (itemsPerPage === undefined)
        itemsPerPage = this._itemsPerPage;
      pageIndex = Math.floor(itemIndex / itemsPerPage);
    }
    return pageIndex;
  },
  
  /** 
   * Get the first item on the specified logical page.
   * @param {number} pageIndex 0-based index of the logical page.
   * @param {?number} pageCount Number of logical pages.
   * @param {?number} itemsPerPage Number of items on each logical page.
   * @returns {(string|number)} The string id or 0-based index of item, with 
   *          preference given to string id.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _getFirstItemOnPage: function(pageIndex, pageCount, itemsPerPage)
  {
    var pagingModel = this._pagingModel;
    if (pageCount === undefined)
      pageCount = pagingModel.getPageCount();
    if (pageIndex >= 0 && pageIndex < pageCount)
    {
      var items = this._getItems();
      if (itemsPerPage === undefined)
        itemsPerPage = this._itemsPerPage;
      var itemIndex = pageIndex * itemsPerPage;
      if (itemIndex < items.length)
      {
        var firstItemOnPage = items[itemIndex];
        var firstId = firstItemOnPage.id;
        return ((firstId && firstId.length > 0) ? firstId : itemIndex);
      }
    }
    return -1;
  },
  
  /** 
   * Hide the logical page.
   * @param {jQuery} page Page to hide.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _hidePage: function(page)
  {
    //notify the page that it's being hidden BEFORE actually hiding it so that
    //components can save state
    oj.Components.subtreeHidden(page[0]);
    
    page
      .css(_DISPLAY, _NONE)
      .attr(_ARIA_HIDDEN, "true");
    
    //hide the items explicitly; unhiding will unhide them explicitly
    var items = page.find(_PERIOD + _OJ_FILMSTRIP_ITEM).filter(this._filterNestedFilmStripsFunc);
    items.css(_DISPLAY, _NONE);
  },
  
  /** 
   * Unhide the logical page.
   * @param {jQuery} page Page to unhide.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _unhidePage: function(page)
  {
    page
      .css(_DISPLAY, _EMPTY_STRING)
      .removeAttr(_ARIA_HIDDEN);
    
    //unhide the items explicitly because the app may have initially hidden them  
    var items = page.find(_PERIOD + _OJ_FILMSTRIP_ITEM).filter(this._filterNestedFilmStripsFunc);
    items.css(_DISPLAY, _EMPTY_STRING);
    
    //notify the page that it was shown
    oj.Components.subtreeShown(page[0]);
  },
  
  /** 
   * Add key listeners on the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _addKeyListeners: function()
  {
    var elem = this.element;
    elem.on("keydown" + this.keyEventNamespace, this._handleKeyDownFunc);
  },
  
  /** 
   * Remove key listeners from the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _removeKeyListeners: function()
  {
    var elem = this.element;
    elem.off(this.keyEventNamespace);
  },
  
  /** 
   * Add mouse listeners on the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _addMouseListeners: function()
  {
    var elem = this.element;
    elem
      .on("mousedown" + this.mouseEventNamespace, this._handleMouseDownFunc)
      .on("mousemove" + this.mouseEventNamespace, this._handleMouseMoveFunc)
      .on("mouseup" + this.mouseEventNamespace, this._handleMouseUpFunc);
  },
  
  /** 
   * Remove mouse listeners from the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _removeMouseListeners: function()
  {
    var elem = this.element;
    elem.off(this.mouseEventNamespace);
  },
  
  /** 
   * Add touch listeners on the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _addTouchListeners: function()
  {
    var elem = this.element;
    elem
      .on("touchstart" + this.touchEventNamespace, this._handleTouchStartFunc)
      .on("touchmove" + this.touchEventNamespace, this._handleTouchMoveFunc)
      .on("touchend" + this.touchEventNamespace, this._handleTouchEndFunc)
      .on("touchcancel" + this.touchEventNamespace, this._handleTouchEndFunc);
  },
  
  /** 
   * Remove touch listeners from the filmStrip.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _removeTouchListeners: function()
  {
    var elem = this.element;
    elem.off(this.touchEventNamespace);
  },
  
  /** 
   * Handle a keydown event.
   * @param {Event} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleKeyDown: function(event)
  {
    var pagingModel = this._pagingModel;
    var pageIndex = pagingModel.getPage();
    var newPageIndex = -1;
    switch (event.keyCode)
    {
      case $.ui.keyCode.RIGHT:
        if (this._bRTL)
          newPageIndex = pageIndex - 1;
        else
          newPageIndex = pageIndex + 1;
        break;
      case $.ui.keyCode.LEFT:
        if (this._bRTL)
          newPageIndex = pageIndex + 1;
        else
          newPageIndex = pageIndex - 1;
        break;
      case $.ui.keyCode.DOWN:
        newPageIndex = pageIndex + 1;
        break;
      case $.ui.keyCode.UP:
        newPageIndex = pageIndex - 1;
        break;
      case $.ui.keyCode.HOME:
        newPageIndex = 0;
        break;
      case $.ui.keyCode.END:
        newPageIndex = pagingModel.getPageCount() - 1;
        break;
      default :
        return;
    }
    
    if (newPageIndex > -1 && newPageIndex < pagingModel.getPageCount())
      pagingModel.setPage(newPageIndex);
    
    event.preventDefault();
  },
  
  /** 
   * Handle a mousedown event.
   * @param {Object} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleMouseDown: function(event)
  {
    var originalEvent = event.originalEvent;
    this._dragScrollStart(originalEvent);
  },
  
  /** 
   * Handle a mousemove event.
   * @param {Object} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleMouseMove: function(event)
  {
    var originalEvent = event.originalEvent;
    this._dragScrollMove(event, originalEvent);
  },
  
  /** 
   * Handle a mouseup event.
   * @param {Event} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleMouseUp: function(event)
  {
    this._dragScrollEnd();
  },
  
  /** 
   * Handle a touchstart event.
   * @param {Object} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleTouchStart: function(event)
  {
    var originalEvent = event.originalEvent;
    var eventTouches = originalEvent.touches;
    if (eventTouches.length === 1)
    {
      var firstTouch = eventTouches[0];
      this._dragScrollStart(firstTouch);
    }
  },
  
  /** 
   * Handle a touchmove event.
   * @param {Object} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleTouchMove: function(event)
  {
    var originalEvent = event.originalEvent;
    var eventTouches = originalEvent.touches;
    var firstTouch = eventTouches[0];
    this._dragScrollMove(event, firstTouch);

    //FIX : if the drag scroll was started, prevent the page
    //from scrolling also
    //FIX : do this for touchMove events instead of touchStart so 
    //that it doesn't prevent clicks/taps from being detected on nav arrows and
    //item content
    if (this._bTouch || this._scrolledForThisTouch)
      event.preventDefault();
  },
  
  /** 
   * Handle a touchend event.
   * @param {Event} event <code class="prettyprint">jQuery</code> event object.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _handleTouchEnd: function(event)
  {
    this._dragScrollEnd();
  },
  
  /** 
   * Start a drag scroll.
   * @param {Object} coordsObj Object that has pageX and pageY properties.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _dragScrollStart: function(coordsObj)
  {
    var pagingModel = this._pagingModel;
    if (pagingModel.getPageCount() > 1 && !this._bPageChangeTransition)
    {
      this._bTouch = true;
      this._bDragInit = false;
      
      var bHorizontal = this._isHorizontal();
      this._touchStartCoord = bHorizontal ? coordsObj.pageX : coordsObj.pageY;
      this._touchStartCoord2 = bHorizontal ? coordsObj.pageY : coordsObj.pageX;
    }
  },
  
  /** 
   * Initialize a drag scroll.
   * Called after a drag scroll has started if the drag has passed an initial
   * threshold.
   * @param {Object} coordsObj Object that has pageX and pageY properties.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _initDragScroll: function(coordsObj)
  {
    //save off some initial information at the start of a swipe
    var bHorizontal = this._isHorizontal();
    this._touchStartCoord = bHorizontal ? coordsObj.pageX : coordsObj.pageY;
    this._touchStartCoord2 = bHorizontal ? coordsObj.pageY : coordsObj.pageX;

    var cssAttr = this._getCssPositionAttr();
    var pagesWrapper = this._pagesWrapper;
    var pagingModel = this._pagingModel;

    //unhide adjacent pages (unhide both because we don't know which way user 
    //will scroll)
    var pages = this._getPages();
    var pageCountToShow = 1;
    if (pagingModel.getPage() > 0)
    {
      this._unhidePage($(pages[pagingModel.getPage() - 1]));

      //when unhiding previous page, need to adjust current scroll position
      //to continue showing current page
      pagesWrapper.css(cssAttr, -this._componentSize + _PX);

      //increment number of pages we need to show
      pageCountToShow++;
    }
    if (pagingModel.getPage() < pagingModel.getPageCount() - 1)
    {
      this._unhidePage($(pages[pagingModel.getPage() + 1]));

      //increment number of pages we need to show
      pageCountToShow++;
    }

    if (pageCountToShow > 1)
      pagesWrapper.css(this._getCssSizeAttr(), pageCountToShow * this._componentSize);

    this._touchStartScroll = parseInt(pagesWrapper.css(cssAttr), 10);
  },

  /** 
   * Process a move during drag scrolling.
   * @param {Event} event <code class="prettyprint">jQuery</code> event object.
   * @param {Object} coordsObj Object that has pageX and pageY properties.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _dragScrollMove: function(event, coordsObj)
  {
    //do nothing if we haven't started the scroll
    if (!this._bTouch)
      return;
    
    var bHorizontal = this._isHorizontal();
    var touchCoord = bHorizontal ? coordsObj.pageX : coordsObj.pageY;
    var diff = touchCoord - this._touchStartCoord;
    
    // - cannot scroll vertically in filmstrip component
    var touchCoord2 = bHorizontal ? coordsObj.pageY : coordsObj.pageX;
    var diff2 = touchCoord2 - this._touchStartCoord2;

    if (Math.abs(diff2) > Math.abs(diff)) {
      //don't scroll again for this same swipe
      this._bTouch = false;

      //set a flag indicating we don't scroll for this touch event
      this._scrolledForThisTouch = false;
    }

    //only initialize the drag once we've passed the initial threshold
    if (!this._bDragInit)
    {
      if (Math.abs(diff) > _DRAG_SCROLL_INIT_THRESHOLD)
      {
        this._initDragScroll(coordsObj);
        this._bDragInit = true;
      }
      //return here even if we just initialized the drag so that we'll start
      //processing the drag move on the next event when we have different mouse
      //coords
      return;
    }
    
    //in non-RTL, if swiping left or up, scroll next; otherwise scroll prev
    //in RTL, if swiping right or up, scroll next; otherwise scroll prev
    var bNext = (bHorizontal && this._bRTL) ? (diff > 0) : (diff < 0);
    //determine whether the filmStrip can be scrolled in the direction of the swipe
    var pagingModel = this._pagingModel;
    var pageIndex = pagingModel.getPage();
    var canScrollInSwipeDirection = (bNext && pageIndex < (pagingModel.getPageCount() - 1)) ||
                                    (!bNext && pageIndex > 0);
    //only need to do something if we can scroll in the swipe direction
    if (canScrollInSwipeDirection)
    {
      //only scroll next/prev if the swipe is longer than the threshold; if it's
      //less, then just drag the items with the swipe
      var elem = this.element[0];
      var threshold = Math.min(_DRAG_SCROLL_THRESHOLD * (bHorizontal ? elem.offsetWidth : elem.offsetHeight), _DRAG_SCROLL_MAX_THRESHOLD);
      var cssAttr = this._getCssPositionAttr();
      var pagesWrapper = this._pagesWrapper;
      var pages = this._getPages();

      //if swiping beyond the threshold, scroll to the next/prev page
      if (Math.abs(diff) >= threshold)
      {
        var newPageIndex = bNext ? pageIndex + 1 : pageIndex - 1;
        var newFirstItem = this._getFirstItemOnPage(newPageIndex);
        
        //hide the page that we're not scrolling to
        var pageToHide = bNext ? pageIndex - 1 : pageIndex + 1;
        if (pageToHide > -1 && pageToHide < pagingModel.getPageCount())
          this._hidePage($(pages[pageToHide]));
        
        //when hiding previous page, need to adjust current scroll position
        //to continue showing current page
        if (bNext && pageToHide > -1)
        {
          var currScroll = parseInt(pagesWrapper.css(cssAttr), 10);
          pagesWrapper.css(cssAttr, (currScroll + this._componentSize) + _PX);
        }
        
        //update size to show two pages instead of three
        pagesWrapper.css(this._getCssSizeAttr(), 2 * this._componentSize);

        //don't scroll again for this same swipe
        this._bTouch = false;
        
        pagingModel.setPage(newPageIndex);
      }
      //if swiping under the threshold, just move the conveyor with the swipe
      else
      {
        var scrollVal = (bHorizontal && this._bRTL) ? -diff : diff;
        var transform = bHorizontal ? "translate3d(" + scrollVal + "px, 0, 0)" :
                                      "translate3d(0, " + scrollVal + "px, 0)";
        _applyTransform(pages.filter(_VISIBLE_SELECTOR), transform);
      }

      //set a flag indicating we've scrolled for this touch event
      this._scrolledForThisTouch = true;
    }

    //if we've scrolled for this touch event, consume the event
    //so that the page doesn't also scroll
    if (this._scrolledForThisTouch)
    {
      event.preventDefault();
      event.stopPropagation();
    }
  },

  /** 
   * Process the end of a drag scroll.
   * @memberof oj.ojFilmStrip
   * @instance
   * @private
   */
  _dragScrollEnd: function()
  {
    //if a full page swipe hasn't happened, scroll back to the original position
    if (this._bTouch && this._bDragInit)
    {
      var pagingModel = this._pagingModel;
      var pageIndex = pagingModel.getPage();
      this._handlePage({"previousPage": pageIndex, "page": pageIndex});
    }
    this._bTouch = false;
    this._bDragInit = false;
    //reset the flag indicating if we've scrolled for this touch event
    this._scrolledForThisTouch = false;
  },
  
  //** @inheritdoc */
  getNodeBySubId: function(locator)
  {
    if (locator == null)
    {
      return this.element ? this.element[0] : null;
    }
    
    var subId = locator['subId'];
    if (subId === "oj-filmstrip-start-arrow") {
      return this.widget().find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_START)
        .filter(this._filterNestedFilmStripsFunc)[0];
    }
    if (subId === "oj-filmstrip-end-arrow") {
      return this.widget().find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_END)
        .filter(this._filterNestedFilmStripsFunc)[0];
    }
    if (subId === "oj-filmstrip-top-arrow") {
      return this.widget().find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_TOP)
        .filter(this._filterNestedFilmStripsFunc)[0];
    }
    if (subId === "oj-filmstrip-bottom-arrow") {
      return this.widget().find(_PERIOD + _OJ_FILMSTRIP_ARROW + _PERIOD + _OJ_BOTTOM)
        .filter(this._filterNestedFilmStripsFunc)[0];
    }
    
    // Non-null locators have to be handled by the component subclasses
    return null;
  },

  //** @inheritdoc */
  getSubIdByNode: function(node) {
    var startArrow = this.getNodeBySubId({'subId':'oj-filmstrip-start-arrow'});
    var endArrow = this.getNodeBySubId({'subId':'oj-filmstrip-end-arrow'});
    var topArrow = this.getNodeBySubId({'subId':'oj-filmstrip-top-arrow'});
    var bottomArrow = this.getNodeBySubId({'subId':'oj-filmstrip-bottom-arrow'});
    var currentNode = node;
    var elem = this.element[0];
    while (currentNode && currentNode != elem) {
      if (currentNode === startArrow)
        return {'subId':'oj-filmstrip-start-arrow'};
      else if (currentNode === endArrow)
        return {'subId':'oj-filmstrip-end-arrow'};
      else if (currentNode === topArrow)
        return {'subId':'oj-filmstrip-top-arrow'};
      else if (currentNode === bottomArrow)
        return {'subId':'oj-filmstrip-bottom-arrow'};

      currentNode = currentNode.parentElement;          
    }
    return null;
  }
  
  // start jsdoc fragments /////////////////////////////////////////////////////
  
  /**
   * <p>Sub-ID for the start navigation arrow of a horizontal FilmStrip.</p>
   *
   * @ojsubid oj-filmstrip-start-arrow
   * @memberof oj.ojFilmStrip
   *
   * @example <caption>Get the start navigation arrow:</caption>
   * var node = $( ".selector" ).ojFilmStrip( "getNodeBySubId", {'subId': 'oj-filmstrip-start-arrow'} );
   */
  
  /**
   * <p>Sub-ID for the end navigation arrow of a horizontal FilmStrip.</p>
   *
   * @ojsubid oj-filmstrip-end-arrow
   * @memberof oj.ojFilmStrip
   *
   * @example <caption>Get the end navigation arrow:</caption>
   * var node = $( ".selector" ).ojFilmStrip( "getNodeBySubId", {'subId': 'oj-filmstrip-end-arrow'} );
   */
  
  /**
   * <p>Sub-ID for the top navigation arrow of a vertical FilmStrip.</p>
   *
   * @ojsubid oj-filmstrip-top-arrow
   * @memberof oj.ojFilmStrip
   *
   * @example <caption>Get the top navigation arrow:</caption>
   * var node = $( ".selector" ).ojFilmStrip( "getNodeBySubId", {'subId': 'oj-filmstrip-top-arrow'} );
   */
  
  /**
   * <p>Sub-ID for the bottom navigation arrow of a vertical FilmStrip.</p>
   *
   * @ojsubid oj-filmstrip-bottom-arrow
   * @memberof oj.ojFilmStrip
   *
   * @example <caption>Get the bottom navigation arrow:</caption>
   * var node = $( ".selector" ).ojFilmStrip( "getNodeBySubId", {'subId': 'oj-filmstrip-bottom-arrow'} );
   */

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
   *       <td>FilmStrip</td>
   *       <td><kbd>Swipe</kbd></td>
   *       <td>Transition to an adjacent logical page of child items.</td>
   *     </tr>
   *     <tr>
   *       <td>Navigation Arrow</td>
   *       <td><kbd>Tap</kbd></td>
   *       <td>Transition to an adjacent logical page of child items.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
   * @memberof oj.ojFilmStrip
   */

  /**
   * <p>FilmStrip itself is a tabstop and supports the following keyboard interactions:
   * 
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th>Target</th>
   *       <th>Key</th>
   *       <th>Action</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td>FilmStrip</td>
   *       <td><kbd>UpArrow or LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
   *       <td>Transition to the previous logical page of child items.</td>
   *     </tr>
   *     <tr>
   *       <td>FilmStrip</td>
   *       <td><kbd>DownArrow or RightArrow</kbd> (<kbd>LeftArrow</kbd> in RTL)</td>
   *       <td>Transition to the next logical page of child items.</td>
   *     </tr>
   *     <tr>
   *       <td>FilmStrip</td>
   *       <td><kbd>Home</kbd></td>
   *       <td>Transition to the first logical page of child items.</td>
   *     </tr>
   *     <tr>
   *       <td>FilmStrip</td>
   *       <td><kbd>End</kbd></td>
   *       <td>Transition to the last logical page of child items.</td>
   *     </tr>
   *     <tr>
   *       <td>Navigation Arrow</td>
   *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
   *       <td>Transition to an adjacent logical page of child items.</td>
   *     </tr>
   *   </tbody>
   * </table>
   *
   * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
   * @memberof oj.ojFilmStrip
   */
  
  // end jsdoc fragments ///////////////////////////////////////////////////////
  
}); // end of oj.__registerWidget

// start static members and functions //////////////////////////////////////////

//_tmpVar is simply to trick the closure compiler so that it doesn't issue a
//warning about the below real vars declared using a single "var" statement:
//WARNING - declaration of multiple variables with shared type information
var _tmpVar;

var _ADJACENT = "adjacent",
    //aria-hidden DOM attribute
    _ARIA_HIDDEN = "aria-hidden",
    _AUTO = "auto",
    //display CSS attribute
    _DISPLAY = "display",

    //threshold to initialize a drag scroll (pixels)
    _DRAG_SCROLL_INIT_THRESHOLD = 3,
    //drag scroll threshold (percentage of filmStrip size)
    _DRAG_SCROLL_THRESHOLD = .33,
    //drag scroll threshold (max distance, pixels)
    _DRAG_SCROLL_MAX_THRESHOLD = 100,
    
    _EMPTY_STRING = "",
    //throw an error when invalid "currentItem" option set
    _ERROR_CURRENT_ITEM_NOT_FOUND = "JET FilmStrip: Value of 'currentItem' option not found: ",
    //throw an error when "orientation" option set to invalid value
    _ERROR_INVALID_ORIENTATION = "JET FilmStrip: Unsupported value set as 'orientation' option: ",
    //throw an error when "arrowPlacement" option set to invalid value
    _ERROR_INVALID_NAV_ARROW_PLACEMENT = "Unsupported value set as 'arrowPlacement' option: ",
    //throw an error when "arrowVisibility" option set to invalid value
    _ERROR_INVALID_NAV_ARROW_VISIBILITY = "Unsupported value set as 'arrowVisibility' option: ",
    _FLEX_BASIS = "flex-basis",
    _HIDDEN = "hidden",
    //jQuery hidden selector
    _HIDDEN_SELECTOR = ":hidden",
    _HORIZONTAL = "horizontal",
    _HOVER = "hover",
    _CURRENT_ITEM = "currentItem",
    _MS_TRANSFORM = "-ms-transform",
    _NONE = "none",
    
    _OJ_BOTTOM = "oj-bottom",
    _OJ_END = "oj-end",
    _OJ_FILMSTRIP_ARROW = "oj-filmstrip-arrow",
    _OJ_FILMSTRIP_ARROW_CONTAINER = "oj-filmstrip-arrow-container",
    _OJ_FILMSTRIP_ARROW_TRANSITION = "oj-filmstrip-arrow-transition",
    _OJ_FILMSTRIP_CONTAINER = "oj-filmstrip-container",
    _OJ_FILMSTRIP_HOVER = "oj-filmstrip-hover",
    _OJ_FILMSTRIP_ITEM = "oj-filmstrip-item",
    _OJ_FILMSTRIP_ITEM_CONTAINER = "oj-filmstrip-item-container",
    _OJ_FILMSTRIP_PAGE = "oj-filmstrip-page",
    _OJ_FILMSTRIP_PAGES_CONTAINER = "oj-filmstrip-pages-container",
    _OJ_FILMSTRIP_TRANSITION = "oj-filmstrip-transition",
    _OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_FROM = "oj-filmstrip-transition-next-newpage-from",
    _OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_FROM = "oj-filmstrip-transition-next-oldpage-from",
    _OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_FROM = "oj-filmstrip-transition-prev-newpage-from",
    _OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_FROM = "oj-filmstrip-transition-prev-oldpage-from",
    _OJ_FILMSTRIP_TRANSITION_NEXT_NEWPAGE_TO = "oj-filmstrip-transition-next-newpage-to",
    _OJ_FILMSTRIP_TRANSITION_NEXT_OLDPAGE_TO = "oj-filmstrip-transition-next-oldpage-to",
    _OJ_FILMSTRIP_TRANSITION_PREV_NEWPAGE_TO = "oj-filmstrip-transition-prev-newpage-to",
    _OJ_FILMSTRIP_TRANSITION_PREV_OLDPAGE_TO = "oj-filmstrip-transition-prev-oldpage-to",
    _OJ_FILMSTRIP_VERTICAL = "oj-filmstrip-vertical",
    _OJ_START = "oj-start",
    _OJ_TOP = "oj-top",
    
    _OVERLAY = "overlay",
    _PERIOD = ".",
    _PX = "px",
    _TRANSFORM = "transform",
    _VERTICAL = "vertical",
    _VISIBLE = "visible",
    //jQuery visible selector
    _VISIBLE_SELECTOR = ":visible",
    _WEBKIT_FLEX_BASIS = "-webkit-flex-basis",
    _WEBKIT_TRANSFORM = "-webkit-transform",
    
    //log warning message when "disabled" option set
    _WARNING_DISABLED_OPTION = "JET FilmStrip: 'disabled' option not supported",
    
    /**
     * Apply a CSS transform to the given object.
     * @param {jQuery} jqObj Object to apply transform to.
     * @param {string} transform The transform to apply.
     * @private
     */
    _applyTransform = function(jqObj, transform)
    {
      jqObj
        .css(_WEBKIT_TRANSFORM, transform)
        .css(_MS_TRANSFORM, transform)
        .css(_TRANSFORM, transform);
    },
    
    /**
     * Remove a CSS transform from the given object.
     * @param {jQuery} jqObj Object to apply transform to.
     * @private
     */
    _removeTransform = function(jqObj)
    {
      jqObj
        .css(_WEBKIT_TRANSFORM, _EMPTY_STRING)
        .css(_MS_TRANSFORM, _EMPTY_STRING)
        .css(_TRANSFORM, _EMPTY_STRING);
    },

    /**
     * Escape an html fragment/text.
     * @param {string} text Text to escape.
     * @returns {string} Escaped text.
     * @private
     */
    _escapeHtml = function(text)
    {
      //let jQuery escape the text
      var jqDiv = $("<div></div>");
      jqDiv.text(text); // @HTMLUpdateOK
      return jqDiv[0].innerHTML;
    };
    
// end static members and functions ////////////////////////////////////////////

}()); // end of FilmStrip wrapper function
(function() {
var ojFilmStripMeta = {
  "properties": {
    "arrowPlacement": {
      "type": "string"
    },
    "arrowVisibility": {
      "type": "string"
    },
    "currentItem": {
      "type": "string|number"
    },
    "disabled": {
      "type": "boolean"
    },
    "maxItemsPerPage": {
      "type": "number"
    },
    "orientation": {
      "type": "string"
    }
  },
  "methods": {
    "getItemsPerPage": {},
    "getPagingModel": {},
    "refresh": {}
  },
  "extension": {
    "_widgetName": "ojFilmStrip"
  }
};
oj.Components.registerMetadata('ojFilmStrip', 'baseComponent', ojFilmStripMeta);
oj.Components.register('oj-film-strip', oj.Components.getMetadata('ojFilmStrip'));
})();
});
