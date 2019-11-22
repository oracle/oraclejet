/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojconveyorbelt', 'ojs/ojmenu', 
        'jqueryui-amd/widgets/sortable', 'ojs/ojtouchproxy'], 
function(oj, $, Components)
{
  "use strict";


/* global Components:false */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * @ojcomponent oj.ojTabs
 * @ignore
 * @augments oj.baseComponent
 * @since 0.6.0
 *
 * @classdesc
 * <h3 id="tabsOverview-section">
 *   JET Tabs Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tabsOverview-section"></a>
 * </h3>
 *
 * <p>Description: Themeable, WAI-ARIA-compliant tabs with mouse and keyboard interactions for navigation.
 *
 * <p>A JET Tabs can be created from a <code class="prettyprint">div</code> element as long as the root element has a tab bar in a <code class="prettyprint">ul</code> with individual tabs in <code class="prettyprint">li</code> preceding the content divs. Each <code class="prettyprint">li</code> will be matched by position with its content in the html DOM.
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div id="tabs">
 *   &lt;ul>
 *     &lt;li>&lt;span>Tab 1&lt;/span>&lt;/li>
 *     &lt;li>&lt;span>Tab 2&lt;/span>&lt;/li>
 *     &lt;li>&lt;span>Tab 3&lt;/span>&lt;/li>
 *   &lt;/ul>
 *   &lt;div id="tab1">
 *     &lt;p>Tab 1 content&lt;/p>
 *     &lt;p>Tab 1 more content&lt;/p>
 *   &lt;/div>
 *   &lt;div id="tab2">
 *     &lt;p>Tab 2 content&lt;/p>
 *   &lt;/div>
 *   &lt;div id="tab3">
 *     &lt;p>Tab 3 content&lt;/p>
 *   &lt;/div>
 * &lt;/div>
 * </code></pre>
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
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 * {@ojinclude "name":"stylingDoc"}
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Lazy Rendering</h4>
 * <p>If an ojTabs has complex content in a tab, it is recommended to implement lazy
 * rendering of tab content. The application should keep track of which tab contents
 * have been rendered. The initial selected tab should render its content from the
 * start. The application should then listen to the ojbeforeselect event from the
 * ojTabs to control when to render the content.
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the tabs must be <code class="prettyprint">refresh()</code>ed.
 *
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">:oj-tabs</code> pseudo-selector can be used in jQuery expressions to select JET Tabs.  For example:
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-tabs" ) // selects all JET Tabs on the page
 * $myEventTarget.closest( ":oj-tabs" ) // selects the closest ancestor that is a JET Tabs
 * </code></pre>
 *
 *
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 *
 * <ol>
 *   <ul>
 *   <li>JQUI Tabs expects the tabs titles either in an ordered or unordered list followed by their content elements. Each tab must have an anchor with the href points to its content element.
 *     <pre class="prettyprint">
 *     <code>
 *       &lt;div id="tabs">
 *         &lt;ul>
 *           &lt;li>&lt;a href="#tabs-1">Tab 1 Title&lt;/a>&lt;/li>
 *           &lt;li>&lt;a href="#tabs-2">Tab 2 Title&lt;/a>&lt;/li>
 *         &lt;/ul>
 *         &lt;div id="tabs-1">
 *           &lt;p>Tab 1 content.&lt;/p>
 *         &lt;/div>
 *         &lt;div id="tabs-2">
 *           &lt;p>Tab 2 content.&lt;/p>
 *           &lt;p>More Tab 2 content.&lt;/p>
 *         &lt;/div
 *       &lt;/div>
 *     </code></pre>
 *   </li>
 *
 *   <li>JET Tabs requires a DOM structures like the JQuery Tabs, except the tab header and their content are matched by position. It requires no anchors and pointers to the contents.
 *     <pre class="prettyprint">
 *     <code>
 *       &lt;div id="tabs">
 *          &lt;ul>
 *            &lt;li>&lt;span>Tab 1&lt;/span>&lt;/li>
 *            &lt;li>&lt;span>Tab 2&lt;/span>&lt;/li>
 *          &lt;/ul>
 *          &lt;div id="tab1">
 *            &lt;p>Tab 1 content&lt;/p>
 *          &lt;/div>
 *          &lt;div id="tab2">
 *            &lt;p>Tab 2 content&lt;/p>
 *          &lt;/div>
 *       &lt;/div>
 *     </code></pre>
 *   </li>
 *   </ul>
 *   <li>JET Tabs supports <code class="prettyprint">edge</code> option: to be placed the tab bar at top(default), bottom, start or end</li>
 *   <li>JET Tabs supports <code class="prettyprint">removable</code> option by adding a close icon to each tab header which when clicked remove the tab from the DOM.</li>
 *   <li>JET Tabs supports <code class="prettyprint">reorderable</code> option allow the tab to be reordered by drag and drop within the Tab bar</li>
 * </ol>
 *
 * <p>Also, event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "tabs".
 *
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 *
 * @desc Creates a JET Tabs.
 * @example <caption>Initialize the tabs with no options specified:</caption>
 * $( ".selector" ).ojTabs();
 *
 * @example <caption>Initialize the tabs with some options specified:</caption>
 * $( ".selector" ).ojTabs( { "edge": "start" } );
 *
 * @example <caption>Initialize the tabs via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="tabs" data-bind="ojComponent: { component: 'ojTabs', edge: 'end'}">
 *
 */
(function () {
  var _CLOSE_ICON = 'oj-tabs-close-icon';
  var _CLOSE_ICON_SIZE = 28;
  var _ID_PREFIX = 'ojtabs-id_';
  var _DELETE_KEY = 46; // Context Menu: menu item id's

  var
  /** @const */
  _arMenuCmdMap = {
    cut: 'ojtabscut',
    'paste-before': 'ojtabspastebefore',
    'paste-after': 'ojtabspasteafter',
    remove: 'ojtabsremove'
  }; // Context Menu translation keys

  var _arMenuKeyMap = {
    cut: 'labelCut',
    'paste-before': 'labelPasteBefore',
    'paste-after': 'labelPasteAfter',
    remove: 'labelRemove'
  };

  oj.__registerWidget('oj.ojTabs', $.oj.baseComponent, {
    widgetEventPrefix: 'oj',
    delay: 300,
    options: {
      /**
       * The id or zero-based index of the tab that is selected.
       * Note: using zero-based index is deprecated, please use id in the future.<p>
       *
       * Setter value: either an id or index.<p>
       * Getter value: id or index. If the selected tab has a page author provided id then that id is returned, otherwise that tab's index will be returned.
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @type {string|number}
       * @default <code class="prettyprint">0</code>
       *
       * @example <caption>Initialize the tabs with the
       * <code class="prettyprint">selected</code> option specified:</caption>
       * $( ".selector" ).ojTabs( { "selected": "myTabDiv" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">selected</code>
       * option after initialization:</caption>
       * // getter
       * var selected = $( ".selector" ).ojTabs( "option", "selected" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "selected", "myTabDiv" );
       */
      selected: 0,

      /**
       * Array contains either ids or zero-based indices of the tabs that should be disabled.
       * Note: using zero-based indices is deprecated, please use ids in the future.<p>
       *
       * Setter value: array of either ids or indices.<p>
       * Getter value: array of either ids or indices. If a disabled tab has a page author provided id then that id is returned, otherwise that tab's index will be returned.
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @default <code class="prettyprint">null</code>
       * @type {Array|null}
       *
       * @example [ "disableMe" ] would disable the tab with id="disableMe"
       * @example <caption>Initialize the tabs with the
       * <code class="prettyprint">disabledTabs</code> option specified:</caption>
       * $( ".selector" ).ojTabs( { "disabledTabs": ["disableMe"] } );
       *
       */
      disabledTabs: null,

      /**
       * Truncation option applies to the tab titles when there is not enough room to display
       * all tabs.
       * Valid Values: none, progressive and auto.
       *
       * <ul>
       *  <li> none - tabs always take up the space needed by the title texts. When there
       *   is not enough room, the conveyorBelt's navigation arrows are displayed to allow
       *   the title texts be scrolled within the conveyor.</li>
       *
       *  <li> progressive - If not enough space is available to display all of the tabs,
       *   then the width of each tab title is restricted just enough to allow all tabs to fit.
       *   All tab titles that are truncated are displayed with ellipses. However the width
       *   of each tab title will not be truncated below tabLabelMinWidth. If after all truncation
       *   has been applied, there still is not enough room, then the conveyorBelt's navigation
       *   arrows will appear. When the container of the tabs is resized the truncation will
       *   be reevaluated.</li>
       *
       *  <li> auto - same as "progressive".</li>
       * </ul>
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @type {string}
       * @default <code class="prettyprint">auto</code>
       *
       * @example <caption>Get or set the <code class="prettyprint">truncation</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var truncation = $( ".selector" ).ojTabs( "option", "truncation" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "truncation", "none" );
       */
      truncation: 'auto',

      /**
       * The type of event to select the tab.
       * To select a tab on hover, use "mouseover".
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"click"</code>
       *
       * @example <caption>Get or set the <code class="prettyprint">selectOn</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var selectOn = $( ".selector" ).ojTabs( "option", "selectOn" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "selectOn", "mouseover" );
       */
      selectOn: 'click',

      /**
       * The orientation of the tab bar.
       * Valid Values: horizontal and vertical
       *
       * @deprecated Use the <a href="#edge">edge</a> option instead.
       * If the tabs is initialized without an <code class="prettyprint">edge</code> specified,
       * the <code class="prettyprint">orientation</code> value is used to convert to an equivalent <code class="prettyprint">edge</code>:
       * <code class="prettyprint">horizontal</code> to <code class="prettyprint">top</code> and <code class="prettyprint">vertical</code> to <code class="prettyprint">start</code>.
       * @expose
       * @memberof! oj.ojTabs
       * @ignore
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"horizontal"</code>
       *
       * @example <caption>Get or set the <code class="prettyprint">orientation</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var orientation = $( ".selector" ).ojTabs( "option", "orientation" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "orientation", "vertical" );
       */
      orientation: 'horizontal',

      /**
       * The position of the tab bar.
       * Valid Values: top, bottom, start and end.
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @type {string}
       * @default <code class="prettyprint">top</code>
       *
       * @example <caption>Get or set the <code class="prettyprint">edge</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var edge = $( ".selector" ).ojTabs( "option", "edge" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "edge", "end" );
       */
      edge: 'top',

      /**
       * Specifies if the tabs can be removed.
       * If removable is false, all tabs are not removable.
       * If removable is true, all tabs are removable.<p>
       * If an array is specified, the array contains ids of the tabs that are removable.
       * <p>Please note that this option is only supported if the orientation option is horizontal.
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @type {boolean|Array}
       * @default <code class="prettyprint">false</code>
       *
       * @example <caption>Initialize an ojTabs with the <code class="prettyprint">removable</code> option.</caption>
       * $( ".selector" ).ojTabs( { "removable": ["removeMe"] } );
       *
       * @example <caption>Get or set the <code class="prettyprint">removable</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var removable = $( ".selector" ).ojTabs( "option", "removable" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "removable", true );
       */
      removable: false,

      /**
       * Specifies if the tabs can be reordered within the tab bar by drag-and-drop
       *
       * @expose
       * @memberof! oj.ojTabs
       * @instance
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       *
       * @example <caption>Get or set the <code class="prettyprint">reorderable</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var reorderable = $( ".selector" ).ojTabs( "option", "reorderable" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "reorderable", true );
       */
      reorderable: false,

      /**
       * <p>The JET Menu should be initialized before the Tabs using it as a
       * context menu.
       *
       * @ojfragment contextMenuInitOrderDoc - Decomped to fragment so Tabs, Tree, and MasonryLayout can convey their init order restrictions.
       * @memberof oj.ojTabs
       */

      /**
       * {@ojinclude "name":"contextMenuDoc"}
       *
       * <p>When defining a contextMenu, ojTabs will provide built-in behavior for "cut" and "paste"
       *  if the following format for menu &lt;li&gt; item's is used (no &lt;a&gt;
       *  elements are required):
       * <ul>
       *     <li> &lt;li data-oj-command="oj-tabs-cut" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tabs-paste-before" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tabs-paste-after" /&gt;</li>
       *     <li> &lt;li data-oj-command="oj-tabs-remove" /&gt;</li>
       * </ul>
       * The available translated text will be applied to menu items defined this way.
       *
       * @member
       * @name contextMenu
       * @memberof! oj.ojTabs
       * @instance
       * @type {Element|Array.<Element>|string|jQuery|NodeList}
       * @default <code class="prettyprint">null</code>
       *
       * @example <caption>Initialize a JET Tabs with a context menu:</caption>
       * // via recommended HTML5 syntax:
       * &lt;div id="myTabs" contextmenu="myMenu" data-bind="ojComponent: { ... }>
       *
       * // via JET initializer (less preferred) :
       * $( ".selector" ).ojTabs({ "contextMenu": "#myContextMenu"  ... } });
       *
       * @example <caption>Get or set the <code class="prettyprint">contextMenu</code> option for
       *      an ojTabs after initialization:</caption>
       * // getter
       * var menu = $( ".selector" ).ojTabs( "option", "contextMenu" );
       *
       * // setter
       * $( ".selector" ).ojTabs( "option", "contextMenu", "#myContextMenu" );
       */
      // callbacks

      /**
       * Triggered immediately before a tab is selected.<p>
       * beforeSelect can be canceled to prevent the content from selecting by returning a false in the event listener.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.fromTab The tab being navigated from
       * @property {jQuery} ui.fromContent The content being navigated from
       * @property {jQuery} ui.toTab The tab being navigated to
       * @property {jQuery} ui.toContent The content being navigated to
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">beforeSelect</code> callback specified:</caption>
       * $( ".selector" ).ojTabs({
       *     "beforeSelect": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeselect</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeselect", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      beforeSelect: null,

      /**
       * Triggered after a tab has been selected.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.fromTab The tab being navigated from
       * @property {jQuery} ui.fromContent The content being navigated from
       * @property {jQuery} ui.toTab The tab being navigated to
       * @property {jQuery} ui.toContent The content being navigated to
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">select</code> callback specified:</caption>
       * $( ".selector" ).ojTabs({
       *     "select": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojselect</code> event:</caption>
       * $( ".selector" ).on( "ojselect", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      select: null,

      /**
       * Triggered immediately before a tab is deselected.<p>
       * beforeDeselect can be canceled to prevent the content from deselecting by returning a false in the event listener.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.fromTab The tab being navigated from
       * @property {jQuery} ui.fromContent The content being navigated from
       * @property {jQuery} ui.toTab The tab being navigated to
       * @property {jQuery} ui.toContent The content being navigated to
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">beforeDeselect</code> callback specified:</caption>
       * $( ".deselector" ).ojTabs({
       *     "beforeDeselect": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforedeselect</code> event:</caption>
       * $( ".selector" ).on( "ojbeforedeselect", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      beforeDeselect: null,

      /**
       * Triggered after a tab has been deselected.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.fromTab The tab being navigated from
       * @property {jQuery} ui.fromContent The content being navigated from
       * @property {jQuery} ui.toTab The tab being navigated to
       * @property {jQuery} ui.toContent The content being navigated to
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">deselect</code> callback specified:</caption>
       * $( ".deselector" ).ojTabs({
       *     "deselect": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojdeselect</code> event:</caption>
       * $( ".selector" ).on( "ojdeselect", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      deselect: null,

      /**
       * Triggered immediately before a tab is removed.
       * beforeRemove can be canceled to prevent the content from removeing by returning a false in the event listener.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.tab The tab that is about to be removed.
       * @property {jQuery} ui.content The content that is about to be removed.
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">beforeRemove</code> callback specified:</caption>
       * $( ".selector" ).ojTabs({
       *     "beforeRemove": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeremove</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeremove", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      beforeRemove: null,

      /**
       * Triggered after a tab has been removed.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.tab The tab that was just removed.
       * @property {jQuery} ui.content The content that was just removed.
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">remove</code> callback specified:</caption>
       * $( ".selector" ).ojTabs({
       *     "remove": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojremove</code> event:</caption>
       * $( ".selector" ).on( "ojremove", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      remove: null,

      /**
       * Triggered immediately before a tab is reordered.
       * beforeReorder can be canceled to prevent the content from reordering by returning a false in the event listener.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.tab The tab that is about to be reordered.
       * @property {jQuery} ui.content The content that is about to be reordered.
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">beforeReorder</code> callback specified:</caption>
       * $( ".selector" ).ojTabs({
       *     "beforeReorder": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforereorder</code> event:</caption>
       * $( ".selector" ).on( "ojbeforereorder", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      beforeReorder: null,

      /**
       * Triggered after a tab has been reordered.
       *
       * @expose
       * @event
       * @memberof! oj.ojTabs
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.tab The tab that was just reordered.
       * @property {jQuery} ui.content The content that was just reordered.
       *
       * @example <caption>Initialize the tabs with the <code class="prettyprint">reorder</code> callback specified:</caption>
       * $( ".selector" ).ojTabs({
       *     "reorder": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojreorder</code> event:</caption>
       * $( ".selector" ).on( "ojreorder", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest
       *      if ($(event.target).is(".mySelector")) {}
       * } );
       */
      reorder: null
    },
    _ComponentCreate: function _ComponentCreate() {
      var options = this.options;

      this._super();

      this.running = false; // don't fire events during creation

      this._initialRender = true;

      this._setupEdge(options.edge); // flag if an old markup is used


      this._isOldMarkup = this.element.children('ul').length === 0;

      this._createTabbarFromOldMarkup();

      this._processTabs(); //  - ojtabs touch support issues
      // only handle context menu if not touch device


      this._menu = {};
      this._menu.usermenu = false;
      this._menu.$menuItems = [];
      this._menu.$container = null;
      this._menu.$elemPasteBefore = null;
      this._menu.$elemPasteAfter = null;

      this._initMenu(); // update disabledTabs to contains ids if provided, index otherwise
      //      this._updateDisabledTabs();


      this._refresh(); //  - for tabs w/ pre 1.1 markup, selected & disabledtabs options doesn't work w/ ids


      var selectedIndex = this._getIndexByTabOrContentId(options.selected);

      if (selectedIndex === undefined) {
        selectedIndex = 0;
      } //  - tabs shouldn't implement _init()


      this._fireSelectEvents(selectedIndex);

      this._initialRender = undefined;
    },
    // TODO: selectedIndex
    _fireSelectEvents: function _fireSelectEvents(_selectedIndex, flags) {
      //  - When ojtab first displays beforeSelect & select events are not raised
      //  - ojtabs should not let user set focus on disabled tabs
      // if the selected tab is disabled or undefined, select the next enabled tab
      var selectedIndex = _selectedIndex;

      if (this._isTabDisabled(selectedIndex)) {
        selectedIndex = this._getNextEnabledTab(selectedIndex);
      }

      this._activate(selectedIndex === undefined ? undefined : $(this.tabs[selectedIndex]), flags);
    },

    /**
      *  Notification that the user has invoked the context menu via the default
      *  gestures: right-click, pressHold, and Shift-F10.
      *  @param {Object} menu       The JET Menu to open as a context menu
      *  @param {Event}  event      Triggering event
      *  @param {string} eventType  Triggering event type (e.g. 'keyboard', 'mouse', 'touch')
      *  @private
      */
    _NotifyContextMenuGesture: function _NotifyContextMenuGesture(menu, event, eventType) {
      //  - ojtabs:context menu shouldn't open - right mouse is clicked inside content area
      //  - contextmenu issues: presshold should launch the contextmenu on touch devices
      if (this._isInATab(event.target) && !(this._touchProxy && this._touchProxy.touchMoved())) {
        var keyboard = eventType === 'keyboard';

        if (event.type !== 'contextmenu' && !keyboard && eventType !== 'touch') {
          return;
        } // got here either by right mouse click (event.which == 3)
        // or <shift F10> key (event.keyCode = 121 and event.shiftKey = true)
        // or pressHold
        // get the tab acted on


        var tab = $(event.target).closest('li');
        var openOptions = {
          launcher: tab
        };
        this._menu.tab = keyboard ? this.active : openOptions.launcher;

        if (!this._menu.tab) {
          event.preventDefault();
          return;
        }

        if (this._menu.$elemRemove) {
          // if tab is disable or not removable and if "remove" is only item,  dont display context menu
          var isDisabled = tab.hasClass('oj-disabled');

          if ((isDisabled || this._getCloseIcons(tab).length === 0) && this._menu.$container.children().length === 1) {
            event.preventDefault();
            return;
          }

          if (isDisabled || !this._isTabRemovable(tab)) {
            this._menu.$elemRemove.addClass('oj-disabled');
          } else {
            this._menu.$elemRemove.removeClass('oj-disabled');
          }
        } // Set menu "Paste" disable state, depending on whether there's been a
        // previous "cut"


        if (this._menu.$elemPasteBefore || this._menu.$elemPasteAfter) {
          var disabledState = !this._menu.cutTab;

          var state = this._menu.$elemPasteBefore.hasClass('oj-disabled');

          if (state !== disabledState) {
            if (disabledState) {
              this._menu.$elemPasteBefore.addClass('oj-disabled');

              this._menu.$elemPasteAfter.addClass('oj-disabled');
            } else {
              this._menu.$elemPasteBefore.removeClass('oj-disabled');

              this._menu.$elemPasteAfter.removeClass('oj-disabled');
            }

            this._menu.$container.ojMenu('refresh');
          }
        }

        this._OpenContextMenu(event, eventType, openOptions);
      }
    },
    _tabKeydown: function _tabKeydown(event) {
      /* jshint maxcomplexity:15*/
      if (this._handlePageNav(event)) {
        return;
      }

      var focusedTab = $(this.document[0].activeElement).closest('li');

      var enabledTabs = this._getEnabledTabs();

      var selectedIndex = enabledTabs.index(focusedTab);
      var length = enabledTabs.length;

      switch (event.keyCode) {
        case $.ui.keyCode.RIGHT:
        case $.ui.keyCode.DOWN:
          selectedIndex = (selectedIndex + 1) % length;
          break;

        case $.ui.keyCode.UP:
        case $.ui.keyCode.LEFT:
          selectedIndex = ((selectedIndex === 0 ? length : selectedIndex) - 1) % length;
          break;

        case $.ui.keyCode.END:
          selectedIndex = length - 1;
          break;

        case $.ui.keyCode.HOME:
          selectedIndex = 0;
          break;

        case _DELETE_KEY:
          var tab = this.active; // James: remove tab keystroke doesn't seem to work with JAWS.
          // ALT+DEL seems to conflict with a JAWS keystroke. I have raised an issue on the Authoring
          // Practices for this. Could we just use Delete as well or does that sound like a bad idea?
          // simulate a click on the close icon of the current selected header

          if (tab && this._getCloseIcons(tab).length > 0) {
            event.preventDefault();

            this._removeTab(tab, null, event);
          }

          return;

        default:
          return;
      } // Focus the appropriate tab, based on which key was pressed


      event.preventDefault();
      clearTimeout(this.activating);
      var selTab = $(enabledTabs[selectedIndex]);
      selTab.focus(); // Navigating with control key will prevent automatic activation

      if (!event.ctrlKey) {
        // Update aria-selected immediately so that AT think the tab is already selected.
        // Otherwise AT may confuse the user by stating that they need to select the tab,
        // but the tab will already be selected by the time the announcement finishes.
        focusedTab.attr('aria-selected', 'false');
        selTab.attr('aria-selected', 'true');
        var self = this;
        this.activating = this._delay(function () {
          // qunit test failure
          if (!self || !self.tabs) {
            return;
          }

          self._activate(selTab, event);
        }, this.delay);
      }
    },
    _panelKeydown: function _panelKeydown(event) {
      // In the nested tabs case, handle keydown for the closest tabs only
      if ($(event.target).closest('.oj-tabs-selected').attr('id') !== this.element.children('.oj-tabs-selected').attr('id')) {
        return;
      }

      if (this._handlePageNav(event)) {
        return;
      } // Ctrl+up moves focus to the current tab


      if (event.ctrlKey && event.keyCode === $.ui.keyCode.UP) {
        event.preventDefault();
        this.active.focus();
      }
    },
    // Ctrl+page up/down moves focus to the previous/next tab (and selects)
    _handlePageNav: function _handlePageNav(event) {
      var selectedIndex = this._getSelectedIndex();

      if (event.ctrlKey && event.keyCode === $.ui.keyCode.PAGE_UP) {
        this._activate(this._focusNextTab(selectedIndex, false));

        return true;
      }

      if (event.ctrlKey && event.keyCode === $.ui.keyCode.PAGE_DOWN) {
        this._activate(this._focusNextTab(selectedIndex, true));

        return true;
      }

      return false;
    },
    _isTabDisabled: function _isTabDisabled(index) {
      if (index >= 0 && index < this.tabs.length) {
        return $(this.tabs[index]).hasClass('oj-disabled');
      }

      return false;
    },
    // TODO: return tab
    _focusNextTab: function _focusNextTab(index, goingForward) {
      var enabledTabs = this._getEnabledTabs();

      var currentIndex = enabledTabs.index(this.tabs[index]);
      var length = enabledTabs.length;

      if (goingForward) {
        currentIndex = (currentIndex + 1) % length;
      } else {
        currentIndex = ((currentIndex === 0 ? length : currentIndex) - 1) % length;
      }

      var selTab = $(enabledTabs[currentIndex]);
      selTab.focus();
      return selTab;
    },
    // return index
    // TODO: index: tabIndex (not panelId)
    _getNextEnabledTab: function _getNextEnabledTab(index) {
      var next = index + 1;
      var lastTabIndex = this.tabs.length - 1;

      while (next <= lastTabIndex) {
        if (!this._isTabDisabled(next)) {
          return next;
        }

        next += 1;
      }

      next = index - 1;

      while (next >= 0) {
        if (!this._isTabDisabled(next)) {
          return next;
        }

        next -= 1;
      }

      return undefined;
    },
    _isHorizontal: function _isHorizontal() {
      return this.options.edge === 'top' || this.options.edge === 'bottom';
    },
    _setOption: function _setOption(key, _value, flags) {
      var value = _value;

      if (key === 'selected') {
        value = this._getTab(value);

        if (value === undefined) {
          return;
        } // _activate() will update this.options


        this._activate(value);

        return;
      }

      if (key === 'disabledTabs') {
        if (value === null) {
          value = [];
        }

        if (Array.isArray(value)) {
          this._setOjDisabledOnTab(value); // in case the selected tab is disabled


          var selectedIndex = this._getSelectedIndex();

          if (this._isTabDisabled(selectedIndex)) {
            this._fireSelectEvents(selectedIndex);
          } //  - when observable is used to update disabled tabs, tabs do not function right


          this.refresh();
        }

        return;
      }

      if (key === 'removable' || key === 'truncation') {
        if (value !== this.options[key]) {
          this._super(key, value, flags);

          this.refresh();
        }

        return;
      } // allow drag and drop a tab within the tab bar


      if (key === 'reorderable') {
        if (value !== this.options.reorderable) {
          this._super(key, value, flags); //          this._setupReorder();
          //  - if reorderable option is changed to true programmatically,
          // it doesn't take affect


          this.refresh();
        }

        return;
      } // change orientation need refresh


      if (key === 'orientation') {
        if (!this._edgeSpecified) {
          var edge = this._orientationToEdge(value);

          if (edge && this._setupEdge(edge)) {
            this.refresh();
          }
        }

        return;
      } // change edge need refresh


      if (key === 'edge') {
        if (this._setupEdge(value)) {
          this._edgeSpecified = true;

          this._super(key, value, flags);

          this.refresh();
        }

        return;
      }

      if (key === 'selectOn') {
        this._tearDownEvents(true);

        this._super(key, value, flags);

        this._setupEvents();

        return;
      }

      if (key === 'contextMenu') {
        this._clearMenu();

        if (value) {
          this._initMenu(value);
        }
      }

      this._super(key, value, flags); //  - specifying 'translations.removecuetext' as option does not set the aria-label
      // problem is setOption is called after aria-label already set


      if (key === 'translations' && flags && flags.subkey === 'removeCueText' && this.tablist) {
        this._getCloseIcons(this.tablist).attr('aria-label', value ? value.removeCueText : '');
      }
    },

    /**
     * Refreshes the visual state of the tabs. JET components require a <code class="prettyprint">refresh()</code> or re-init after the DOM is
     * programmatically changed underneath the component.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojTabs
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojTabs( "refresh" );
     */
    refresh: function refresh() {
      this._super(); //  - open/close of tabs leaks sortable
      //      this._destroyCloseIcons();


      this._processTabs();

      this._refresh(); // set selected if needed


      if (!this.element.children('.oj-tabs-selected').length) {
        var selected = this._getNextEnabledTab(-1);

        if (selected >= 0) {
          this._fireSelectEvents(selected);
        }
      }
    },
    _refresh: function _refresh() {
      // check for length avoids error when initializing empty list
      var selectedPanel = this.element.children('.oj-tabs-selected');

      if (selectedPanel.length) {
        this.active = this.tablist.children('.oj-selected');
      } else {
        this.active = $();
      }

      this._createCloseIcons(); //  - open/close of tabs leaks sortable


      this._setupEvents();

      this.tabs.not(this.active).attr({
        'aria-selected': 'false',
        tabIndex: '-1'
      });
      this.panels.not(this._getPanelForTab(this.active)).hide().attr({
        'aria-expanded': 'false',
        'aria-hidden': 'true'
      }); // Make sure one tab is in the tab order

      if (this.active.length) {
        this.active.addClass('oj-selected').attr({
          'aria-selected': 'true',
          tabIndex: '0'
        });
        selectedPanel.show().attr('aria-expanded', 'true').removeAttr('aria-hidden');
      } else {
        $(this.tabs[0]).attr('tabIndex', '0');
      }

      if (this._isHorizontal()) {
        if (this.tabs.length > 0) {
          this._truncateBeforeOverflow();

          this._addConveyor();
        } else {
          // no tab in the tab bar
          this._getTabbarWrapper();
        } //  - er for placing buttons alongside tabs


        this._addFacets();
      }

      if (this.options.selected === undefined || this._getSelectedIndex() === 0) {
        this.element.addClass('oj-first-child-selected');
      } else {
        this.element.removeClass('oj-first-child-selected');
      } //  - After a tab is deleted, reorder does not work


      this._setupReorder();
    },
    _addConveyor: function _addConveyor() {
      var tabsId = this.tablist.uniqueId().attr('id');

      var conveyorDiv = this._getTabbarWrapper().parent();

      this.conveyor = conveyorDiv.ojConveyorBelt({
        orientation: 'horizontal',
        contentParent: '#' + tabsId
      }).attr('data-oj-internal', ''); // mark internal component, used in oj.Components.getComponentElementByNode

      var cparent = this.conveyor.parent();

      if (cparent.hasClass('oj-tabs-conveyorbelt-wrapper')) {
        var flex = '0 1 ' + this._getConveyorWrapperMaxWidth() + 'px';
        cparent.css('flex', flex);
        cparent.css('-webkit-flex', flex);
        cparent.css('-ms-flex', flex);
      }
    },
    _processTabs: function _processTabs() {
      var self = this;
      var edge = this.options.edge; // destroy the old tab bar before creating a new one

      this._destroyTabBar(); //  - use case where gauges are displayed in tabs title bar does not work
      // create a tab bar


      this._createTabbar(); // find the tab bar


      this.tablist = this.element.children('ul').addClass('oj-tabs-nav oj-helper-clearfix').attr('role', 'tablist');
      var tabbarIndex = this.tablist.index();
      var startBtn;
      var trailingBtn; //  - er for placing buttons alongside tabs
      // add oj-start class to the facets before the tab bar

      this.element.children('.oj-tabs-facet').each(function () {
        var facet = $(this);

        if (facet.index() < tabbarIndex) {
          facet.addClass('oj-start');
          startBtn = facet;
        } else {
          if (!trailingBtn) {
            trailingBtn = facet;
          }

          facet.removeClass('oj-start');
        }
      }); //  - ojtab removing first tab
      // don't insert <ul> between <!-- ko foreach: tabs --> and <!-- /ko -->

      if (edge === 'start' || edge === 'top') {
        // add <ul> after the start button or as the first child of the container
        if (startBtn && startBtn.length > 0) {
          startBtn.after(this.tablist); // @HTMLUpdateOK
        } else {
          this.element.prepend(this.tablist); // @HTMLUpdateOK
        }
      } else {
        // add <ul> before the trailing button or as the last child of the container
        if (trailingBtn && trailingBtn.length > 0) {
          // eslint-disable-line no-lonely-if
          trailingBtn.before(this.tablist); // @HTMLUpdateOK
        } else {
          this.element.append(this.tablist); // @HTMLUpdateOK
        }
      } // list of tabs


      this.tabs = $(); // list of contents

      this.panels = $(); //  - tabs lose selection when moved (sortable tabs)

      this.tablist.children('li').each(function () {
        var tab = $(this).addClass('oj-tabs-tab').attr({
          role: 'tab',
          tabIndex: '-1'
        }).removeAttr('aria-hidden');
        var div = tab.children();
        div.addClass('oj-tabs-tab-content');
        var anchor = div.children();
        anchor.addClass('oj-tabs-anchor').attr({
          role: 'presentation',
          tabIndex: '-1'
        });
        anchor.children().addClass('oj-tabs-title').removeAttr('aria-hidden');
        self.tabs = self.tabs.add(tab);
        var anchorId = anchor.uniqueId().attr('id');
        var panelId = tab.attr('data-content');
        var panel = self.element.find(self._sanitizeIdSelector(panelId));
        /*
                if (tab.hasClass("oj-disabled"))
                {
                  tab.attr("aria-disabled", "true");
                  // - clicking on disabled tab takes user to the top of the page
                  anchor.removeAttr("href");
                }
        */

        tab.attr({
          'aria-controls': panelId,
          'aria-labelledby': anchorId
        });
        self.panels = self.panels.add(panel);
        panel.attr('aria-labelledby', anchorId).attr('role', 'tabpanel');
      });

      if (edge === 'start' || edge === 'end') {
        // In vertical, "oj-tabs-nav-root" is on the same element as the element with "oj-tabs-nav"
        // as long as the theming doesn't care whether the root is on the same element or not
        self.tablist.addClass('oj-tabs-nav-root');
      } // set oj-disabled on the tabs


      if (this._initialRender) {
        this._setOjDisabledOnTab(this.options.disabledTabs);
      }
    },
    _setupEvents: function _setupEvents() {
      var self = this;
      var events = {
        keydown: this._tabKeydown
      };
      var event = this.options.selectOn;
      var selectOnClick = false;

      if (event) {
        $.each(event.split(' '), function (index, eventName) {
          //  - mousedown is a better default for jtab selecton than click
          if (eventName === 'click') {
            selectOnClick = true;
          } // security test


          if (oj.DomUtils.isValidIdentifier(eventName)) {
            events[eventName] = self._eventHandler;
          }
        });
      }

      var enabledTabs = this._getEnabledTabs();

      this._on(enabledTabs, events); //  - mousedown is a better default for jtab selecton than click


      if (!selectOnClick) {
        this._on(enabledTabs, {
          // prevent the default action
          click: function click(e) {
            e.preventDefault();
          }
        });
      } //  - ojtabs: call jquery "on"/"off" methods instead of jquery ui "_on"/"_off"


      this.panels.on('keydown' + this.eventNamespace, this._panelKeydown.bind(this)); // add listeners on close icon

      if (this.options.removable) {
        var revents = {
          click: this._removeTabHandler
        };

        var closeIcons = this._getCloseIcons(enabledTabs);

        this._on(closeIcons, revents);

        this._AddHoverable(closeIcons);

        this._AddActiveable(closeIcons);
      }

      this._focusable({
        element: enabledTabs,
        applyHighlight: true
      });

      this._AddHoverable(enabledTabs);

      this._AddActiveable({
        element: enabledTabs,
        afterToggle: function afterToggle(eventtype) {
          // after mousedown, clear the "oj-focus-highlight" class
          if (eventtype === 'mousedown') {
            enabledTabs.filter('.oj-focus-highlight').blur();
          }
        }
      });
    },
    _tearDownEvents: function _tearDownEvents(noCloseIcon) {
      var enabledTabs = this._getEnabledTabs(); //  - open/close of tabs leaks sortable
      //  - ojtabs: call jquery "on"/"off" methods instead of jquery ui "_on"/"_off"


      if (!noCloseIcon) {
        this._UnregisterChildNode(this._getCloseIcons(enabledTabs));
      }

      this._UnregisterChildNode(enabledTabs);

      if (this.panels) {
        this.panels.off('keydown' + this.eventNamespace);
      }
    },
    _eventHandler: function _eventHandler(event, flags) {
      var active = this.active;
      var tab = $(event.currentTarget).closest('li');
      var clickedIsActive = active && tab[0] === active[0];

      var oToContent = this._getPanelForTab(tab);

      var oFromContent = active && active.length ? this._getPanelForTab(active) : $();
      var eventData = {
        /** @expose */
        fromTab: active,

        /** @expose */
        fromContent: oFromContent,

        /** @expose */
        toTab: tab,

        /** @expose */
        toContent: oToContent
      };
      event.preventDefault();
      var oEvent = flags || event;

      if (tab.hasClass('oj-disabled') || // can't switch durning an animation
      this.running || // click on active header,
      clickedIsActive || // allow canceling deselect
      //  - ojbeforedeseselect & ojdeselect events shouldn't be raised
      // when tab is rendered initially
      oFromContent && oFromContent.length && this._trigger('beforeDeselect', oEvent, eventData) === false || // allow canceling select
      // don't fire initial option change events
      !this._initialRender && this._trigger('beforeSelect', oEvent, eventData) === false) {
        return;
      } //  - tabs shouldn't implement _init()
      // don't fire initial option change events


      if (this._initialRender) {
        this.options.selected = this._getTabIdOrIndex(tab);
      } else {
        this.option('selected', this._getTabIdOrIndex(tab), {
          _context: {
            originalEvent: oEvent,
            internalSet: true
          }
        });
      }

      this.active = tab; // add or remove oj-selected on the corresponding panel

      oToContent.addClass('oj-tabs-selected');

      if (oFromContent && oFromContent.length) {
        oFromContent.removeClass('oj-tabs-selected');
      }

      this._toggle(oEvent, eventData);
    },
    // handles show/hide for selecting tabs
    _toggle: function _toggle(event, eventData) {
      var self = this;
      var toTab = eventData.toTab.closest('li');
      var toShow = eventData.toContent;
      var toHide = eventData.fromContent;
      this.running = true;

      function complete() {
        self.running = false; //  - ojbeforedeseselect & ojdeselect events shouldn't be raised
        // when tab is rendered initially
        // don't fire select event during creation

        if (!self._initialRender) {
          self._trigger('deselect', event, eventData);

          self._trigger('select', event, eventData);
        }
      }

      function show() {
        toTab.addClass('oj-selected');

        if (self._isHorizontal() && self.tabs.length > 0) {
          if (toTab.index() === 0) {
            self.element.addClass('oj-first-child-selected');
          } else {
            self.element.removeClass('oj-first-child-selected');
          }
        }

        toShow.show(); //  - unable to stretch ojtable in an initially hidden ojtab

        if (toShow.length > 0) {
          Components.subtreeShown(toShow[0], {
            initialRender: self._initialRender
          });
        }

        complete();
      } // start out by hiding, then showing, then completing


      var fromTab = eventData.fromTab.closest('li').removeClass('oj-selected');
      toHide.hide(); //  - unable to stretch ojtable in an initially hidden ojtab

      if (toHide.length > 0) {
        Components.subtreeHidden(toHide[0]);
      }

      show();
      toHide.attr({
        'aria-expanded': 'false',
        'aria-hidden': 'true'
      });
      fromTab.attr('aria-selected', 'false'); // If we're switching tabs, remove the old tab from the tab order.
      // If we're opening from collapsed state, remove the previous tab from the tab order.

      if (toShow.length && toHide.length) {
        fromTab.attr('tabIndex', '-1');
      } else if (toShow.length) {
        this.tabs.filter(function () {
          return $(this).attr('tabIndex') === '0';
        }).attr('tabIndex', '-1');
      }

      toShow.attr('aria-expanded', 'true').removeAttr('aria-hidden');
      toTab.attr({
        'aria-selected': 'true',
        tabIndex: '0'
      });
    },
    // TODO: active: active tab, not panelId
    _activate: function _activate(active, flags) {
      if (active === undefined) {
        return;
      }

      var anchor; // trying to activate the already active panel

      if (this.active && active[0] === this.active[0]) {
        return;
      } //  - ojtabs should not let user set focus on disabled tabs
      // this.options.selected = panelId;
      // simulate a click on the new active header


      anchor = active.find('.oj-tabs-anchor')[0];

      this._eventHandler({
        target: anchor,
        currentTarget: anchor,
        preventDefault: $.noop
      }, flags);
    },
    _createCloseIcons: function _createCloseIcons() {
      var removable = this.options.removable; //  - for vertical tabs, removable option should be ignored
      // create close icon only if it's horizontal and  not disabled

      if (removable && this._isHorizontal()) {
        var removeCueText = this.getTranslatedString('removeCueText');
        var self = this;

        this._getEnabledTabs().each(function (index) {
          if (self._isTabRemovable($(this))) {
            var div = $(this).find('> :first-child');
            div.addClass('oj-removable'); // add cue text for removable icon for screen reader users

            var rmId = _ID_PREFIX + 'rm_' + index;
            $(this).attr('aria-describedby', rmId);
            $("<a href='#'>").addClass('oj-tabs-icon oj-component-icon oj-clickable-icon-nocontext ' + _CLOSE_ICON).attr({
              id: rmId,
              tabIndex: '-1',
              'aria-label': removeCueText,
              role: 'presentation'
            }).appendTo(div); // @HTMLUpdateOK
          }
        });
      }
    },
    _getEnabledTabs: function _getEnabledTabs() {
      return $(this.tabs.not('.oj-disabled'));
    },
    _getCloseIcons: function _getCloseIcons(elem) {
      return elem.find('.' + _CLOSE_ICON);
    },
    _destroyTabBar: function _destroyTabBar() {
      //  - open/close of tabs leaks sortable
      if (this.tabs) {
        // NOTE: also remove panel event handler
        this._tearDownEvents();
      } // remove listener


      if (this._hasResizeListener) {
        oj.DomUtils.removeResizeListener(this.element[0], this._resizeHandler);
        this._hasResizeListener = false;
        this._originalWidth = undefined;
      } //  - open/close of tabs leaks sortable


      if (this._sortable) {
        // remove touchListeners
        if (oj.DomUtils.isTouchSupported()) {
          this._tearDownTouchReorder();
        } // destroy sortable


        if (this.tablist.sortable('instance')) {
          this.tablist.sortable('destroy');
        }

        this._sortable = undefined;
      }

      var navRoot = this.element.children('.oj-tabs-nav-root');
      var navRootNotUL = !navRoot.hasClass('oj-tabs-nav'); //  - open/close of tabs leaks sortable

      if (this.tabs) {
        this._getCloseIcons(this.tabs).remove(); //  - er for placing buttons alongside tabs


        if (navRoot.length) {
          var afterMe = navRoot;
          var noFacet = true;
          var tabbar = this.tablist;
          navRoot.children().each(function () {
            var child = $(this);

            if (child.hasClass('oj-tabs-conveyorbelt-wrapper')) {
              child = tabbar;
            } else if (!child.hasClass('oj-tabs-facet')) {
              return;
            }

            noFacet = false;
            afterMe.after(child); // @HTMLUpdateOK

            afterMe = child;
          }); // move ul and lis

          if (noFacet && navRootNotUL) {
            navRoot.after(tabbar); // @HTMLUpdateOK
          }
        }
      }

      if (this.conveyor) {
        this.conveyor.ojConveyorBelt('destroy');
        this.conveyor.remove();
        this.conveyor = null;
        this.active = null;
      }

      if (navRootNotUL) {
        navRoot.remove();
      }

      this.tabs = null;
      this.tablist = null;
    },
    _destroy: function _destroy() {
      this._clearMenu();

      var verticalEdge = !this._isHorizontal();

      if (verticalEdge) {
        this.element.removeClass('oj-tabs oj-component oj-tabs-vertical oj-tabs-start oj-tabs-end oj-helper-clearfix');
      } else {
        this.element.removeClass('oj-tabs oj-component oj-tabs-horizontal oj-tabs-top oj-tabs-bottom oj-first-child-selected');
      }

      var self = this;
      var tab;
      var div;
      var anchor;
      var header;
      this.tabs.each(function (index) {
        tab = $(this);
        tab.removeAttr('tabIndex').removeAttr('aria-selected').removeAttr('aria-labelledby').removeAttr('aria-hidden').removeAttr('aria-controls').removeAttr('aria-disabled').removeAttr('aria-describedby').removeAttr('role').removeAttr('data-content').removeClass('oj-active oj-disabled oj-selected oj-tabs-gen-id oj-tabs-tab').removeUniqueId().css('display', '');
        div = tab.children('div').removeClass('oj-tabs-tab-content');
        anchor = div.children('a').removeClass('oj-tabs-anchor').removeAttr('tabIndex').removeAttr('role');
        header = anchor.children();
        header.removeClass('oj-tabs-title').removeAttr('aria-hidden'); // if old markup is used, move header back to its own div

        if (self._isOldMarkup) {
          header.prependTo(self.panels.get(index)); // @HTMLUpdateOK
        } else if (div.hasClass('oj-tabs-gen-div') && anchor.hasClass('oj-tabs-gen-a')) {
          header.prependTo(tab); // @HTMLUpdateOK

          div.remove();
        } else if (anchor.hasClass('oj-tabs-gen-a')) {
          header.prependTo(div); // @HTMLUpdateOK

          anchor.remove();
        } else if (div.hasClass('oj-tabs-gen-div')) {
          anchor.prependTo(tab); // @HTMLUpdateOK

          div.remove();
        }
      });
      var tabbar = this.tablist;

      this._destroyTabBar();

      tabbar.removeAttr('tabIndex').removeAttr('role').removeClass('oj-tabs-nav oj-tabs-nav-root oj-helper-clearfix').removeUniqueId(); // remove ul and lis

      if (this._isOldMarkup) {
        tabbar.remove();
      }

      this.panels.each(function () {
        var panel = $(this);
        panel.removeAttr('tabIndex').removeAttr('aria-expanded').removeAttr('aria-selected').removeAttr('aria-labelledby').removeAttr('aria-hidden').removeAttr('role').removeClass('oj-active oj-tabs-selected oj-tabs-gen-id oj-tabs-panel').removeUniqueId().css('display', '');
      });
      this.element.children('.oj-tabs-facet').removeClass('oj-start');
    },
    _isTabRemovable: function _isTabRemovable(tab) {
      var removable = this.options.removable;
      return removable && (!Array.isArray(removable) || removable.indexOf(tab.attr('id')) > -1);
    },
    _removeTab: function _removeTab(tab, event, flags) {
      if (!this._isTabRemovable(tab)) {
        return;
      }

      var panel = this._getPanelForTab(tab);

      var eventData = {
        /** @expose */
        tab: tab,

        /** @expose */
        content: panel
      };
      var oEvent = flags || event ? event : {
        target: tab,
        currentTarget: tab,
        preventDefault: $.noop
      }; // trigger before delete event and only delete if it's not cancelled

      if (tab && this._trigger('beforeRemove', oEvent, eventData) !== false) {
        //  - deleteing a tab scrolls page back to the top
        if (event) {
          event.preventDefault();
        } // if tab to be removed is selected, select the next enabled tab


        if (tab.hasClass('oj-selected')) {
          var curIndex = this.tabs.index(tab);

          var nextIndex = this._getNextEnabledTab(curIndex); // no enabled tabs left


          if (nextIndex === undefined) {
            this.active = undefined;
            this.option('selected', undefined, {
              _context: {
                originalEvent: oEvent,
                internalSet: true
              }
            });
          } else {
            // fire selected event
            this._fireSelectEvents(nextIndex, oEvent); // adjust index


            var idOrIndex = this._getTabIdOrIndex($(this.tabs[nextIndex]));

            if (typeof idOrIndex === 'number' && idOrIndex > curIndex) {
              idOrIndex -= 1;
            } // fire option change event


            this.option('selected', idOrIndex, {
              _context: {
                originalEvent: oEvent,
                internalSet: true
              }
            });
          }
        } //  - open/close of tabs leaks sortable


        this._tearDownEvents();

        this.tabs = this.tabs.not(tab);
        tab.remove();
        panel.remove(); //  - If user closes tab then index for tabs changes and disabled tab becomes enable
        // update indices of disabled tabs

        this._updateDisabledTabs();

        this.refresh(); //  - tab area grabs focus when tabs are closed
        // set focus on the active
        //        if (this.active)
        //          this.active.focus();

        this._trigger('remove', oEvent, eventData);
      }
    },
    _removeTabHandler: function _removeTabHandler(event, flags) {
      this._removeTab($(event.currentTarget).closest('li'), event, flags);
    },

    /**
     * Remove a tab from the tab bar.
     * <p>Please note that the tab must be <a href="#removable">removable</a>
     *
     * @expose
     * @memberof! oj.ojTabs
     * @instance
     *
     * @param {string} tabId The id of the tab that is to be removed.
     *
     * @example <caption>Invoke the <code class="prettyprint">removeTab</code> method:</caption>
     * $( ".selector" ).ojTabs( "removeTab", "removeMe" );
     *
     */
    removeTab: function removeTab(tabId) {
      if (typeof tabId !== 'string') {
        throw new Error("'" + tabId + "' is not a tab id");
      }

      this._removeTab(this._getTab(tabId), null, null);
    },
    _wrapLi: function _wrapLi(header, contentId) {
      var tab;

      if (header.prop('tagName').toLowerCase() === 'li') {
        tab = header;
        var div = tab.children('div');

        if (div.length === 1 && div.hasClass('oj-tabs-tab-content')) {
          var anchor = div.children('a');

          if (anchor.length !== 1) {
            tab.wrapInner("<a href='#'></a>"); // @HTMLUpdateOK

            anchor.addClass('oj-tabs-gen-a');
          }
        } else {
          div = tab.wrapInner("<div><a href='#'></a></div>") // @HTMLUpdateOK
          .children();
          div.addClass('oj-tabs-gen-div oj-tabs-tab-content');
          div.children().addClass('oj-tabs-gen-a');
        }
      } else {
        tab = header.wrap("<li><div><a href='#'></a></div></li>") // @HTMLUpdateOK
        .parent().parent().parent();
        tab.addClass('oj-tabs-gen-li');
        tab.children().addClass('oj-tabs-gen-div oj-tabs-tab-content');
      } // set content id on tab


      if (contentId) {
        tab.attr('data-content', contentId);
      }

      return tab;
    },

    /**
     * Add a tab to the end of the tabs
     *
     * @expose
     * @memberof! oj.ojTabs
     * @instance
     *
     * @param {Object} newTab An Object contains the properties in the following table.
     * @property {jQuery} newTab.tab The new tab
     * @property {jQuery} newTab.content The new content
     * @property {number} newTab.index The index of new tab. Default is -1, newTab is appended to the end
     *
     * @example <caption>Invoke the <code class="prettyprint">addTab</code> method:</caption>
     * $( ".selector" ).ojTabs( "addTab",
     *                          {
     *                            "tab" : $("&lt;h3>New Tab&lt;/h3>"),
     *                            "content" : $("&lt;div>&lt;p>Content of New Tab&lt;/p>&lt;/div>"),
     *                            "index" : 2
     *                          } );
     *
     * Please note that single jQuery object parameter is deprecated
     * $( ".selector" ).ojTabs( "addTab", $("&lt;div>&lt;h3>New Tab&lt;/h3>&lt;p>Content of New Tab&lt;/p>&lt;/div>") );
     */
    addTab: function addTab(newTab) {
      var tab;
      var content;
      var index = -1; // check if it is a property bag

      if (newTab.tab && newTab.content) {
        content = newTab.content;
        tab = this._wrapLi(newTab.tab, this._getUniqueId(content));

        if (newTab.index !== undefined) {
          index = newTab.index;
        }
      } else {
        // Backward compatible: move header to tab bar
        content = newTab;
        tab = this._wrapLi($(newTab).find('> :first-child'), this._getUniqueId(content));
      }

      var navRoot = this.element.children('.oj-tabs-nav-root');
      var tabbar; // vertical tabs

      if (navRoot.hasClass('oj-tabs-nav')) {
        tabbar = navRoot;
      } else {
        tabbar = navRoot.length ? navRoot.find('.oj-tabs-nav') : this.element.children('.oj-tabs-nav');
      }

      var isNew = false;

      if (!tabbar.length) {
        tabbar = $('<ul>');
        isNew = true;
      }

      if (isNew) {
        tabbar.prependTo(this.element); // @HTMLUpdateOK
      } // insertion inside


      if (index >= 0 && index < tabbar.children().length) {
        var tabAfter = tabbar.children(':eq(' + index + ')');
        var contentAfter = this.element.children(this._sanitizeIdSelector(tabAfter.attr('aria-controls')));
        tabAfter.before(tab); // @HTMLUpdateOK

        contentAfter.before(content); // @HTMLUpdateOK
      } else {
        // insertion at the end
        tab.appendTo(tabbar); // @HTMLUpdateOK

        content.appendTo(this.element); // @HTMLUpdateOK
      }

      this.refresh(); // if no active selected tab, select the new tab

      if (this.active.length === 0) {
        this._fireSelectEvents(0);
      } //  - overflow icons do not appear correctly
      //  - new tabs don't get focus
      //  - tabs flash when adding


      tab[0].scrollIntoView(false);
    },
    _setupTouchReorder: function _setupTouchReorder() {
      this._touchProxy = oj._TouchProxy.addTouchListeners(this.tablist);
    },
    _tearDownTouchReorder: function _tearDownTouchReorder() {
      oj._TouchProxy.removeTouchListeners(this.tablist);
    },
    _setupReorder: function _setupReorder() {
      // enable sortable
      if (this.options.reorderable) {
        var self = this; //  - ojtabs touch support issues

        if (oj.DomUtils.isTouchSupported()) {
          this._setupTouchReorder();
        }

        this.tablist.sortable({
          axis: self._isHorizontal() ? 'x' : 'y',
          distance: 10,
          start: function start() {
            self.tablist.children('.ui-sortable-placeholder').each(function () {
              $(this).addClass('oj-sortable-placeholder');
            });
          },
          stop: function stop(event, ui) {
            // find the element that was moved
            var mvTab = ui.item; // cancel reorder

            if (!self._doReorder(event, mvTab, mvTab.prev())) {
              self.tablist.sortable('cancel');
            }
          }
        }); //  - open/close of tabs leaks sortable

        this._sortable = true;
      } else {
        // disable sortable
        //  - ojtabs touch support issues
        this._tearDownTouchReorder(); //  - open/close of tabs leaks sortable
        // this.tablist.sortable({ disabled: true });


        this._sortable = false;
      }
    },
    _InitOptions: function _InitOptions(originalDefaults, constructorOptions) {
      // need to find out if edge is specified
      var edge = constructorOptions.edge;
      this._edgeSpecified = edge === 'top' || edge === 'bottom' || edge === 'start' || edge === 'end';

      this._super(originalDefaults, constructorOptions);
    },
    _orientationToEdge: function _orientationToEdge(value) {
      if (value === 'horizontal') {
        return 'top';
      } else if (value === 'vertical') {
        return 'start';
      }

      return null;
    },
    _setupEdge: function _setupEdge(_edge) {
      var edge = _edge;

      if (this._initialRender && !this._edgeSpecified || !edge) {
        edge = this._orientationToEdge(this.options.orientation);
      }

      var oEdge = this.options.edge;
      this.element.removeClass('oj-tabs-top oj-tabs-bottom oj-tabs-start oj-tabs-end');

      switch (edge) {
        case 'top':
        case 'bottom':
          if (this.panels && (oEdge === 'start' || oEdge === 'end')) {
            this.element.removeClass('oj-tabs-vertical oj-helper-clearfix');
          }

          this.element.addClass('oj-tabs oj-component oj-tabs-horizontal'); //  - support bottom positioned tabs

          if (edge === 'bottom') {
            this.element.addClass('oj-tabs-bottom');
          } else {
            this.element.addClass('oj-tabs-top');
          } // don't fire optionChange event during creation


          if (this._initialRender) {
            this.options.orientation = 'horizontal';
          } else if (this.options.orientation !== 'horizontal') {
            this.option('orientation', 'horizontal', {
              _context: {
                internalSet: true
              },
              changed: true
            });
          }

          break;

        case 'start':
        case 'end':
          if (this.panels && (oEdge === 'top' || oEdge === 'bottom')) {
            this.element.removeClass('oj-tabs-horizontal');
          }

          this.element.addClass('oj-tabs oj-component oj-tabs-vertical oj-helper-clearfix'); //  - em:support tabs on right

          if (edge === 'end') {
            this.element.addClass('oj-tabs-end');
          } else {
            this.element.addClass('oj-tabs-start');
          } // don't fire optionChange event during creation


          if (this._initialRender) {
            this.options.orientation = 'vertical';
          } else if (this.options.orientation !== 'vertical') {
            this.option('orientation', 'vertical', {
              _context: {
                internalSet: true
              },
              changed: true
            });
          }

          break;

        default:
          return false;
      } // use "edge" and deprecate "orientation"
      // don't fire optionChange event during creation


      if (this._initialRender) {
        this.options.edge = edge;
      } else if (this.options.edge !== edge) {
        this.option('edge', edge, {
          _context: {
            internalSet: true
          },
          changed: true
        });
      }

      return true;
    },
    _getTabbarWrapper: function _getTabbarWrapper() {
      var ulParent = this.tablist.parent();

      if (!ulParent.hasClass('oj-tabs-conveyor')) {
        ulParent = this.tablist.wrap('<div>') // @HTMLUpdateOK
        .parent().addClass('oj-tabs-conveyor'); //  - er for placing buttons alongside tabs

        var newTable;

        if (this.element.children('.oj-tabs-facet').length > 0) {
          newTable = ulParent.wrap('<div>') // @HTMLUpdateOK
          .wrap('<div>') // @HTMLUpdateOK
          .parent().parent().addClass('oj-tabs-conveyorbelt-wrapper');
        } else {
          newTable = ulParent;
        } //  - truncation not working
        // need to create the "oj-tabs-nav-root" before addConveyor
        // otherwise, all skin selectors wont apply
        // add special class so tabs component can skin the conveyor
        // overflow indicators to addpadding between them and the tabs
        //  - er for placing buttons alongside tabs


        var navRoot = newTable.wrap('<div>') // @HTMLUpdateOK
        .parent().addClass('oj-tabs-nav-root');
        navRoot.uniqueId().attr('id');
      }

      return ulParent;
    },
    _addPrefixId: function _addPrefixId(elem) {
      if (elem.id.indexOf(_ID_PREFIX) < 0) {
        $(elem).attr('id', _ID_PREFIX + elem.id);
      }
    },
    //* * @inheritdoc */
    getNodeBySubId: function getNodeBySubId(locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var subId = locator.subId;
      var index = locator.index;

      if (subId !== 'oj-conveyorbelt' && (typeof index !== 'number' || index < 0 || index >= this.panels.length)) {
        return null;
      }

      switch (subId) {
        case 'oj-conveyorbelt':
          return this.conveyor ? this.conveyor[0] : null;

        case 'oj-tabs-panel':
          return this._getPanelForTab(this.tabs[index])[0];

        case 'oj-tabs-tab':
          return this.tabs[index];

        case 'oj-tabs-title':
          return $(this.tabs[index]).find('.oj-tabs-title')[0];

        case 'oj-tabs-close-icon':
        case 'oj-tabs-close':
          return $(this.tabs[index]).find('.oj-tabs-close-icon')[0];

        default:
      } // Non-null locators have to be handled by the component subclasses


      return null;
    },
    //* * @inheritdoc */
    getSubIdByNode: function getSubIdByNode(node) {
      var panels = [];

      for (var i = 0; i < this.tabs.length; i++) {
        panels.push(this._getPanelForTab(this.tabs[i])[0]);
      }

      var tabIndex = -1;
      var panelIndex = -1;
      var currentNode = node; // Find the tab, panel or conveyor belt this node is a descendent of

      while (currentNode) {
        if (this.conveyor && currentNode === this.conveyor[0]) {
          return {
            subId: 'oj-conveyorbelt'
          };
        }

        tabIndex = Array.prototype.indexOf.call(this.tabs, currentNode);

        if (tabIndex !== -1) {
          break;
        }

        panelIndex = panels.indexOf(currentNode);

        if (panelIndex !== -1) {
          return {
            subId: 'oj-tabs-panel',
            index: panelIndex
          };
        }

        currentNode = currentNode.parentElement;
      } // If it's a tab, identify the specific subelement


      if (tabIndex !== -1) {
        var title = this.getNodeBySubId({
          subId: 'oj-tabs-title',
          index: tabIndex
        });
        var closeIcon = this.getNodeBySubId({
          subId: 'oj-tabs-close',
          index: tabIndex
        });
        currentNode = node;

        while (currentNode) {
          if (currentNode === title) {
            return {
              subId: 'oj-tabs-title',
              index: tabIndex
            };
          } else if (currentNode === closeIcon) {
            return {
              subId: 'oj-tabs-close',
              index: tabIndex
            };
          } else if (currentNode === this.tabs[tabIndex]) {
            return {
              subId: 'oj-tabs-tab',
              index: tabIndex
            };
          }

          currentNode = currentNode.parentElement;
        }
      }

      return null;
    },
    _getConveyorWrapperMaxWidth: function _getConveyorWrapperMaxWidth() {
      // add extra 10px for buffer
      return this._originalWidth + 10;
    },
    _getTabsWidth: function _getTabsWidth() {
      //  - er for placing buttons alongside tabs
      var tabbar = this.element.find('.oj-tabs-conveyorbelt-wrapper');
      return tabbar.length ? tabbar[0].clientWidth : this.element[0].clientWidth;
    },
    _isOverflow: function _isOverflow() {
      return this._originalWidth > this._getTabsWidth();
    },
    _getTabMaxWidth: function _getTabMaxWidth() {
      var max = Math.floor(this._getTabsWidth() / this.tabs.length);

      if (this.options.removable) {
        max -= _CLOSE_ICON_SIZE;
      }

      return max;
    },
    _applyTabMaxWidth: function _applyTabMaxWidth() {
      var maxWidth = this._getTabMaxWidth();

      this.tablist.find('.oj-tabs-title').each(function () {
        $(this).css('max-width', '' + maxWidth + 'px').addClass('oj-tabs-title-overflow');
      }); //      this._logMessage("apply max width");
    },
    _removeTabMaxWidth: function _removeTabMaxWidth() {
      this.tablist.find('.oj-tabs-title').each(function () {
        $(this).css('max-width', '').removeClass('oj-tabs-title-overflow');
      }); //      this._logMessage("remove max width");
    },
    _logMessage: function _logMessage()
    /* msg */
    {//      console.log(msg);
    },

    /* resize handler */
    _handleResize: function _handleResize()
    /* width */
    {
      //      this._logMessage("width " + width + " ulWidth " + this._originalWidth +
      //                       " clientWidth " + this._getTabsWidth());
      //  - truncation=none tabs + buttons are not laid out correctly.
      // if no truncation, skip applying tab max width
      if (this._isProgressive()) {
        if (this._isOverflow()) {
          //        this._logMessage("overflow");
          this._applyTabMaxWidth();
        } else {
          //        this._logMessage("underflow");
          this._removeTabMaxWidth();
        }
      }
    },
    _isProgressive: function _isProgressive() {
      return this.options.truncation === 'auto' || this.options.truncation === 'progressive';
    },
    _truncateBeforeOverflow: function _truncateBeforeOverflow() {
      //  - truncation=none tabs + buttons are not laid out correctly.
      // after adding buttons to the tab bar, the parent of the conveyor is a div with inline-block
      // which prevent the conveyor to get the width correctly.
      // Now tabs needs to add resize listener so it can set size on the conveyor in the size listener
      if (this._isHorizontal() && this.tabs.length > 0) {
        if (this._resizeHandler == null) {
          this._resizeHandler = this._handleResize.bind(this);
        }

        oj.DomUtils.addResizeListener(this.element[0], this._resizeHandler);
        this._hasResizeListener = true; // truncation=none and has facet

        this._originalWidth = this._getTabbarWrapper()[0].scrollWidth; // don't need to apply tab max width if not progressive
        // handle initial overflow

        if (this._isProgressive()) {
          if (this._isOverflow()) {
            this._applyTabMaxWidth();
          }
        }
      }
    },

    /**
     * @override
     * @protected
     * @instance
     * @memberof oj.ojtabs
     */
    _NotifyShown: function _NotifyShown() {
      this._super(); // 19518432(using tab in popup), tab need not be visible while calculating the margin,


      this.refresh();
    },

    /**
     * @override
     * @protected
     * @instance
     * @memberof oj.ojtabs
     */
    _NotifyAttached: function _NotifyAttached() {
      this._super();

      this.refresh();
    },
    _buildContextMenuItem: function _buildContextMenuItem(cmd) {
      return $('<a>').text(this.getTranslatedString(_arMenuKeyMap[cmd])).attr('href', '#').wrap('<li>') // @HTMLUpdateOK
      .parent().attr('id', _arMenuCmdMap[cmd]).addClass('oj-menu-item');
    },

    /**
     *  Menu "cut" functionality
     *  @private
     */
    _menu_cut: function _menu_cut(obj) {
      if (!obj || !obj.length) {
        return false;
      }

      this._menu.cutTab = obj;
      return true;
    },

    /**
     *  Menu "paste" functionality
     *  @private
     */
    _menu_paste: function _menu_paste(event, obj, pasteBefore) {
      if (!obj || !obj.length) {
        return false;
      }

      if (!this._menu.cutTab) {
        return false;
      }

      var mvTab = this._menu.cutTab;
      this._menu.cutTab = false;

      this._doReorder(event, mvTab, obj, pasteBefore);

      return true;
    },

    /**
     *  Menu "remove" functionality
     *  @private
     */
    _menu_remove: function _menu_remove(event, obj) {
      if (!obj || !obj.length) {
        return false;
      }

      this._removeTab(obj, null, event);

      return true;
    },

    /**
     *   Check menu selected to see if it one of tabs predefined cut/paste id's
     *   @private
     */
    _handleContextMenuSelect: function _handleContextMenuSelect(ev, ui) {
      var id = ui ? ui.item.attr('id') : undefined;

      if (id === 'ojtabscut') {
        this._menu_cut(this._menu.tab);
      } else if (id === 'ojtabspastebefore') {
        this._menu_paste(ev, this._menu.tab, true);
      } else if (id === 'ojtabspasteafter') {
        this._menu_paste(ev, this._menu.tab, false);
      } else if (id === 'ojtabsremove') {
        this._menu_remove(ev, this._menu.tab);
      }
    },

    /**
     *  Initialize the context menu.  This is called on startup, or on option
     *  "contextMenu" change.
     *  @param {Object=} newVal   true if called because of an option change.
     *  @private
     */
    _initMenu: function _initMenu(newVal) {
      var menu = newVal || this.options.contextMenu;

      if (menu) {
        var t = $.type(menu);

        if (t === 'function') {
          try {
            menu = menu(); // call user's method to get the context menu
          } catch (e) {
            menu = null;
          }

          t = $.type(menu);
        }

        if (menu) {
          var $m = $(menu); // get the user's <ul> list

          if ($m.length) {
            this.options.contextMenu = menu;
          }
        }
      }

      this._menu.usermenu = !!menu; // add default context menu

      this._addContextMenu();
    },
    _addIfNotExist: function _addIfNotExist($ul, itemList, command) {
      if (itemList.indexOf(command) === -1) {
        var menuItem = this._buildContextMenuItem(command);

        $ul.append(menuItem); // @HTMLUpdateOK

        this._menu.$menuItems.push(menuItem);
      }
    },

    /**
     * Add a default context menu to the tabs if there is none. If there is
     * a context menu set on the tabs options we use that one. Add listeners
     * for context menu before show.
     * @private
     */
    _addContextMenu: function _addContextMenu() {
      var $menuContainer = $(this.options.contextMenu);

      if ($menuContainer.length === 0 && !this.options.reorderable && !this.options.removable) {
        return;
      }

      var self = this;

      if ($menuContainer.length === 0) {
        var key = this.options.reorderable ? 'labelReorder' : _arMenuKeyMap.remove;
        var menuId = this.element.uniqueId().attr('id') + 'contextmenu';
        $menuContainer = $('<ul>');
        $menuContainer.css('display', 'none').attr('id', menuId).attr('aria-label', this.getTranslatedString(key)); // append the menu to body

        $(document.body).append($menuContainer); // @HTMLUpdateOK

        $menuContainer.ojMenu(); // don't call setOption

        this.options.contextMenu = this._sanitizeIdSelector(menuId);
      }

      var itemList = []; // If there are any ojTabs built in menu item ids, construct the menu items

      $menuContainer.find('[data-oj-command]').each(function () {
        if ($(this).children('a').length === 0) {
          var command = $(this).attr('data-oj-command').slice('oj-tabs-'.length);
          $(this).replaceWith(self._buildContextMenuItem(command)); // @HTMLUpdateOK

          $(this).addClass('oj-menu-item');
          itemList.push(command);
        }
      }); // add build-in cut/paste

      if (this.options.reorderable) {
        this._addIfNotExist($menuContainer, itemList, 'cut');

        this._addIfNotExist($menuContainer, itemList, 'paste-before');

        this._addIfNotExist($menuContainer, itemList, 'paste-after');

        this._menu.$elemPasteBefore = $menuContainer.find('#ojtabspastebefore');
        this._menu.$elemPasteAfter = $menuContainer.find('#ojtabspasteafter');
      } // add build-in "remove"


      if (this.options.removable) {
        this._addIfNotExist($menuContainer, itemList, 'remove');

        this._menu.$elemRemove = $menuContainer.find('#ojtabsremove');
      }

      this._menu.$container = $menuContainer;
      $menuContainer.ojMenu('refresh'); // Add our listeners so that we can handle build-in remove, cut/paste

      $menuContainer.on('ojselect', $.proxy(this._handleContextMenuSelect, this));
    },

    /**
     *  Clear out any contextMenu data.
     *  @private
     */
    _clearMenu: function _clearMenu() {
      var menu = this._menu;

      if (menu && menu.$container) {
        menu.$container.off('ojselect');

        if (!menu.usermenu) {
          menu.$container.ojMenu('destroy');
          menu.$container.remove();
        }

        if (menu.$menuItems) {
          for (; menu.$menuItems.length > 0;) {
            menu.$menuItems.pop().remove();
          }
        }

        menu.$container = null;
      }

      menu.$elemPasteBefore = null;
      menu.$elemPasteAfter = null;
      menu.$elemRemove = null;
    },
    //  - tabs lose selection when moved (sortable tabs)
    _doReorder: function _doReorder(event, mvTab, prevTab, pasteBefore) {
      var mvContent = this._getPanelForTab(mvTab);

      var eventData = {
        /** @expose */
        tab: mvTab,

        /** @expose */
        content: mvContent
      }; // fire beforeReorder event and only reorder when there is no veto

      if (this._trigger('beforeReorder', event, eventData) === false) {
        return false;
      }

      var mvInd = this.tabs.index(mvTab);

      if (prevTab.length) {
        if (this.tabs.index(prevTab) === mvInd) {
          return true;
        }

        var prevContent = this._getPanelForTab(prevTab);

        if (pasteBefore) {
          prevTab.before(mvTab); // @HTMLUpdateOK

          prevContent.before(mvContent); // @HTMLUpdateOK
        } else {
          prevTab.after(mvTab); // @HTMLUpdateOK

          prevContent.after(mvContent); // @HTMLUpdateOK
        }
      } else if (this.tabs.length > 0) {
        if (mvInd === 0) {
          return true;
        }

        this.tabs.first().before(mvTab); // @HTMLUpdateOK

        this.panels.first().before(mvContent); // @HTMLUpdateOK
      } //  - calling refresh after reordering tabs causes tabs to loose there disabled state
      // update disabled and active


      this._updateDisabledTabs(); //  - add new tab. move it to first place. add another tab.first tab disappears.


      this.refresh(); // remove the "oj-focus-highlight" class from the old active tab

      prevTab.blur();
      mvTab.focus(); // fire reorder event

      this._trigger('reorder', event, eventData);

      return true;
    },
    //  - ojtabs do not work with tabs whose id has '::'
    _sanitizeSelector: function _sanitizeSelector(hash) {
      // eslint-disable-next-line no-useless-escape
      return hash ? hash.replace(/[#!\"$%&'()*+,./:;<=>?@\[\]^`{|}~]/g, '\\$&') : '';
    },
    //  - can not add new tab if existing selected tab has non-blessed jquery id
    // return "#" + sanitized idSelector
    _sanitizeIdSelector: function _sanitizeIdSelector(idSelector) {
      return idSelector ? '#' + this._sanitizeSelector(idSelector) : '';
    },
    _getPanelForTab: function _getPanelForTab(tab) {
      return this.element.find(this._sanitizeIdSelector($(tab).attr('aria-controls')));
    },
    _getUniqueId: function _getUniqueId(panel) {
      var id = panel.attr('id');

      if (!id) {
        id = panel.uniqueId().attr('id');
        panel.addClass('oj-tabs-gen-id');
      }

      return id;
    },
    _getTab: function _getTab(idOrIndex) {
      var index = this._getIndexByTabOrContentId(idOrIndex);

      if (index !== -1) {
        return $(this.tabs[index]);
      }

      return undefined;
    },
    // Note: return -1 if not valid id
    _getIndexByTabOrContentId: function _getIndexByTabOrContentId(idOrIndex) {
      var index = -1;

      if (typeof idOrIndex === 'number') {
        if (idOrIndex >= 0 && idOrIndex < this.tabs.length) {
          index = idOrIndex;
        }
      } else if (typeof idOrIndex === 'string') {
        // security test
        var selector = this._sanitizeSelector(idOrIndex);

        if (oj.DomUtils.isValidIdentifier(selector)) {
          var tabOrContent = this.element.find(this._sanitizeIdSelector(selector));

          if (tabOrContent.length) {
            index = this.tabs.index(tabOrContent);

            if (index === -1) {
              index = this.panels.index(tabOrContent);
            }
          }
        }
      }

      return index;
    },
    _getSelectedIndex: function _getSelectedIndex() {
      var selected = this.options.selected;

      if (typeof selected === 'number') {
        return selected;
      }

      return this.tabs.index($(this._sanitizeIdSelector(selected)));
    },

    /*
     * return either page author provided id or index
     */
    _getTabIdOrIndex: function _getTabIdOrIndex(tab) {
      if (tab) {
        var id = tab.attr('id');
        return id || this.tabs.index(tab);
      }

      return undefined;
    },
    _setOjDisabledOnTab: function _setOjDisabledOnTab(disTabs) {
      // clear oj-disabled that were on the tabs
      var tabbar = this.tablist ? this.tablist : this.element.children('ul');
      var children = tabbar.children('li');
      children.removeClass('oj-disabled').removeAttr('aria-disabled');
      var arr = []; // for each disabled tab in otpions.disabledTabs, add oj-disabled to it

      if (disTabs && disTabs.length > 0) {
        var id;
        var tab;

        for (var i = 0; i < disTabs.length; i++) {
          tab = this._getTab(disTabs[i]);

          if (tab) {
            tab.addClass('oj-disabled');
            tab.attr('aria-disabled', 'true'); //  - clicking on disabled tab takes user to the top of the page

            tab.find('.oj-tabs-anchor').removeAttr('href');
            id = tab.attr('id');
            arr.push(id || children.index(tab));
          }
        }
      }

      this._updateDisabledTabs(arr);
    },

    /*
     * update disabledTabs array
     * entry value is either page author provided id or index
     */
    _updateDisabledTabs: function _updateDisabledTabs(_arr) {
      var arr = _arr;

      if (!arr) {
        arr = [];
        var self = this;
        this.tablist.children().each(function () {
          var tab = $(this);

          if (tab.hasClass('oj-disabled')) {
            arr.push(self._getTabIdOrIndex(tab));
          }
        });
      }

      if (!oj.Object._compareArrayIdIndexObject(arr, this.options.disabledTabs)) {
        //  - tabs shouldn't implement _init()
        // don't fire initial option change events
        if (this._initialRender) {
          this.options.disabledTabs = arr;
        } else {
          var context = {};
          context.internalSet = true;
          context.writeback = true;
          this.option({
            disabledTabs: arr
          }, {
            _context: context,
            changed: true
          });
        }
      }
    },
    _isInATab: function _isInATab(element) {
      var found = false;
      this.tabs.each(function () {
        if (this === element || $.contains(this, element)) {
          found = true;
          return false;
        }

        return true;
      });
      return found;
    },
    //  - use case where gauges are displayed in tabs title bar does not work
    _createTabbar: function _createTabbar() {
      var contentIds = this._getContentIds();

      var self = this;
      var tabbar = this.element.children('ul'); // tabbar exists

      if (tabbar.length > 0) {
        tabbar.children('li').each(function (index) {
          self._wrapLi($(this), contentIds[index]);
        });
      }
    },
    // Backward compatible: move headers to form a tab bar
    _createTabbarFromOldMarkup: function _createTabbarFromOldMarkup() {
      var tabbar = this.element.children('ul');

      if (tabbar.length === 0) {
        var self = this;

        var contentIds = this._getContentIds();

        tabbar = $('<ul>');
        this.element.children().each(function (index) {
          var tab = self._wrapLi($(this).find('> :first-child'), contentIds[index]);

          tab.appendTo(tabbar); // @HTMLUpdateOK
        });
        tabbar.prependTo(this.element); // @HTMLUpdateOK
      }
    },
    //  - er for placing buttons alongside tabs
    _addFacets: function _addFacets() {
      var navRoot = this.element.children('.oj-tabs-nav-root');
      var self = this;
      var tabbarWrapper = navRoot.children('.oj-tabs-conveyorbelt-wrapper');
      this.element.children('.oj-tabs-facet').each(function () {
        var facet = $(this);

        var facetId = self._getUniqueId(facet); // if facet doesn't exist add it to the tab bar


        if (navRoot.find(self._sanitizeIdSelector(facetId)).length === 0) {
          // add start facet
          if (facet.hasClass('oj-start')) {
            tabbarWrapper.before(facet); // @HTMLUpdateOK
          } else {
            // add other facets
            facet.appendTo(navRoot); // @HTMLUpdateOK
          }
        }
      });
    },
    _getContentIds: function _getContentIds() {
      var contentIds = [];
      var self = this;
      this.element.children(':not(ul):not(.oj-tabs-facet)').each(function () {
        var panel = $(this);
        panel.addClass('oj-tabs-panel');
        contentIds.push(self._getUniqueId(panel));
      });
      return contentIds;
    } // Fragments:

    /**
     * <p>Sub-ID for the specified tab.</p>
     *
     * @property {number} index The zero-based index of the tab.
     *
     * @ojsubid oj-tabs-tab
     * @memberof oj.ojTabs
     * @ignore
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the second tab:</caption>
     * var node = $( ".selector" ).ojTabs( "getNodeBySubId", {'subId': 'oj-tabs-tab', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the title of the specified tab.</p>
     *
     * @property {number} index The zero-based index of the tab.
     *
     * @ojsubid oj-tabs-title
     * @memberof oj.ojTabs
     * @ignore
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the title of the second tab:</caption>
     * var node = $( ".selector" ).ojTabs( "getNodeBySubId", {'subId': 'oj-tabs-title', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the content corresponding to the specified tab.</p>
     *
     * @property {number} index The zero-based index of the tab.
     *
     * @ojsubid oj-tabs-panel
     * @memberof oj.ojTabs
     * @ignore
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the content corresponding to the second tab:</caption>
     * var node = $( ".selector" ).ojTabs( "getNodeBySubId", {'subId': 'oj-tabs-panel', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the close icon of the specified tab, if present.</p>
     *
     * @property {number} index The zero-based index of the tab.
     *
     * @ojsubid oj-tabs-close-icon
     * @memberof oj.ojTabs
     * @ignore
     * @deprecated this sub-ID is deprecated, please use oj-tabs-close instead.
     *
     * @example <caption>Get the close icon of the second tab:</caption>
     * var node = $( ".selector" ).ojTabs( "getNodeBySubId", {'subId': 'oj-tabs-close-icon', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the close icon of the specified tab, if present.</p>
     *
     * @property {number} index The zero-based index of the tab.
     *
     * @ojsubid oj-tabs-close
     * @memberof oj.ojTabs
     *
     * @example <caption>Get the close icon of the second tab:</caption>
     * var node = $( ".selector" ).ojTabs( "getNodeBySubId", {'subId': 'oj-tabs-close', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the conveyor belt used for horizontal overflow.</p>
     *
     * @ojsubid oj-conveyorbelt
     * @memberof oj.ojTabs
     *
     * @example <caption>Get the conveyor belt:</caption>
     * var node = $( ".selector" ).ojTabs( "getNodeBySubId", {'subId': 'oj-conveyorbelt'} );
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
     *       <td>Tab</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Select</td>
     *     </tr>
     *     <tr>
     *       <td>Tab Close Icon</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Delete</td>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>Press and pan left/right and release</kbd></td>
     *       <td>Reorder</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojTabs
     */

    /**
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
     *       <td>Tab</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Only the selected tab is in the tab order.</td>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>UpArrow or LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
     *       <td> Move focus to the previous tab and select it.</tr>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>DownArrow or RightArrow</kbd> (<kbd>LeftArrow</kbd> in RTL)</td>
     *       <td> Move focus to the next tab and select it.</tr>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>Home</kbd></td>
     *       <td> Move focus to the first tabs item.</tr>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>End</kbd></td>
     *       <td> Move focus to the last tabs item.</tr>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>Delete</kbd></td>
     *       <td> If deletion is allowed, will delete the current tab.</tr>
     *     </tr>
     *     <tr>
     *       <td>Tab content</td>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td> move focus to the tab for that tab panel.</tr>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojTabs
     */

    /**
     * {@ojinclude "name":"ojStylingDocIntro"}
     *
     * <table class="generic-table styling-table">
     *   <thead>
     *     <tr>
     *       <th>{@ojinclude "name":"ojStylingDocClassHeader"}</th>
     *       <th>{@ojinclude "name":"ojStylingDocDescriptionHeader"}</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>oj-tabs-icon-only</td>
     *       <td>Applied to an ojtabs if the tab headers contain only icons.</td>
     *     </tr>
     *     <tr>
     *       <td>oj-tabs-text-icon<br>
     *       <td>Applied to an ojtabs if the tab headers contain both icons and text.</td>
     *     </tr>
     *     <tr>
     *       <td>oj-tabs-tab-icon</td>
     *       <td>Applied to a custom icon of a tab.</td>
     *     </tr>
     *     <tr>
     *       <td>oj-tabs-facet</td>
     *       <td>Applied to an element that is displayed on the tab bar either before or after the horizontal tab headers.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment stylingDoc - Used in Styling section of classdesc, and standalone Styling doc
     * @memberof oj.ojTabs
     */

  });
})();

});