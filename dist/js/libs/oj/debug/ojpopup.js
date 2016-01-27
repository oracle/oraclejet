/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojpopupcore'], 
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
/*!
 * jQuery UI Popup @VERSION
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/menu/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.position.js
 */(function ()
{

  /**
   * List of all pseudo marker selectors that defines rules for where a tail is aligned.
   * @private
   * @const
   */
  var _TAIL_STYLES = ["oj-left", "oj-center", "oj-right", "oj-top", "oj-middle", "oj-bottom"];

  /**
   * Mapping of horizontal-vertical (x,y) positon using alignment to jet tail pseudo marker selectors.
   *
   * horizontal: right, left, center
   * vertical: top, bottom, middle
   *
   * @private
   * @const
   */
  var _TAIL_ALIGN_RULES =
  {
    'right-top' : 'oj-right oj-top',
    'right-middle' : 'oj-right oj-middle',
    'right-bottom' : 'oj-right oj-bottom',
    'left-top' : 'oj-left oj-top',
    'left-middle' : 'oj-left oj-middle',
    'left-bottom' : 'oj-left oj-bottom',
    'center-top' : 'oj-center oj-top',
    'center-middle' : 'oj-center oj-bottom',
    'center-bottom' : 'oj-center oj-bottom'
  };

  /**
   * @ojcomponent oj.ojPopup
   * @augments oj.baseComponent
   *
   * @classdesc
   * <h3 id="popupOverview-section">
   *   JET Popup Component
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#popupOverview-section"></a></h3>
   *
   * <p>Description: Themeable, WAI-ARIA-compliant popup that can display arbitrary content.</p>
   *
   * <p>A JET popup can be created from a block ( <code class="prettyprint">&lt;div></code> ) or inline element
   *   ( <code class="prettyprint">&lt;span></code> ).  This element will become the immediate child of the content element.
   *   Dynamic content can be inserted under this element.</p>
   *
   * <pre class="prettyprint">
   * <code>&lt;span id="popup">
   *   Hello World!
   * &lt;/span>
   * </code></pre>
   *
   * <p>For WAI-ARIA compliance, JET automatically adds <code class="prettyprint">role="tooltip"</code> to
   *   the root popup dom element by default.  The <code class="prettyprint">role</code> option controls the WAI-ARIA role.
   *   The popup also adds the <code class="prettyprint">aria-describedby="popup-id"</code> to the launcher while the popup is open.
   * </p>
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
   * <br/><br/>
   *
   * <h3 id="accessibility-section">
   *   Accessibility
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
   * </h3>
   *
   * <p>One point often overlooked is making the gestures that launch a popup accessible.
   *   There are no constraints to what events a page developer might choose to trigger opening a
   *   popup.  The choice should be accessible for screen reader users.  Page
   *   developers should take care when using mouse events to trigger opening of a popup.
   *   This is especially important if the content of the popup can't be derived from other
   *   visible areas on the page. In cases that mouseover, mouseout, mouseenter, mouseleave and hover
   *   events are used to launch popups, there needs to be a keyboard functional equivalency.
   * </p>
   *
   * <h3 id="reparenting-section">
   *   Reparenting
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
   * </h3>
   *
   *  <p id="reparenting-strategy">
   *     When popups are open, they will be reparented in the document and reparented back when closed.
   *     When open, the location of the popup within the document will be in context of how it's used.
   *     Popups open from other popups will be relocated in the document into the nearest parent popup's layer.
   *     The popups layer defines its z-index weight "stacking context".  The ojPopup's layer is marked with
   *     the "oj-popup-layer" style.
   *     The context of opening is defined by the launcher argument passed to the open method.  If not open from
   *     another popup, the popup will be reparented to a container in the document body. Popups of the same type
   *     are assigned the same z-index values.  The layering between peer popups reflect the opening order.
   *     The popup that has active focus will be assigned a greater z-index value. This is applied to the popup's
   *     layer by way of the "oj-focus-within" pseudo selector applied with "oj-popup-layer" selector. The page
   *     author has control over z-index weights by way of the "oj-popup-layer" selector.
   *  </p>
   *  <p>
   *     There are known caveats with this design. However, these scenarios are considered "bad use"
   *     based on our JET popup strategy.
   *  </p>
   *  <ol>
   *    <li>Events raised within the popup will not bubble up to the popup's original ancestors.  Instead, listeners for popup events should
   *        be applied to either the popup's root element, or the document.</li>
   *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that assumes that the popup will remain a child
   *        of its original parent.</li>
   *    <li>Popups containing iframes are problematic.  The iframe elements "may" fire a HTTP GET request for its src attribute
   *        each time the iframe is reparented in the document.</li>
   *    <li>In some browsers, reparenting a popup that contains elements having overflow, will cause these overflow elements to
   *        reset their scrollTop.</li>
   *  </ol>
   *
   * <h3 id="eventHandling-section">
   *   Event Handling
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#eventHandling-section"></a>
   * </h3>
   * <ul>
   *  <li>beforeClose(event, ui) - Triggered before a popup closes. Event can prevent closing the popup; However, there are cases
   *                               the framework must veto, such as when the popup is destroyed.</li>
   *  <li>beforeOpen(event, ui) - Triggered before a popup closes. Event can prevent opening the popup.</li>
   *  <li>close(event, ui) - Triggered after the popup has closed.</li>
   *  <li>create(event, ui) - Triggered after the component has been bound to an associated dom element.</li>
   *  <li>focus(event, ui) - Triggered when initial focus is established on opening, depending on the value of the initalFocus
   *      option, or <kbd>F6</kbd> focus toggle from the associated launcher.</li>
   *  <li>open(event, ui) - Triggered after the popup has been made visible.</li>
   * </ul>
   *
   * @desc Creates a JET Popup.
   *
   * @param {Object=} options a map of option-value pairs to set on the component
   *
   * @example <caption>Initialize the popup with no options specified:</caption>
   * $( ".selector" ).ojPopup();
   *
   * @example <caption>Initialize the popup with behaviors of a notewindow:</caption>
   * $( ".selector" ).ojPopup({initialFocus: 'none', autoDismiss: 'focusLoss', tail: 'simple'});
   *
   * @example <caption>Initialize a popup via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
   * &lt;div id="popup1" data-bind="ojComponent: {component: 'ojPopup'}">This is a popup!&lt;/div>
   *
   */
  oj.__registerWidget("oj.ojPopup", $['oj']['baseComponent'],
  {
    widgetEventPrefix : "oj",
    options :
    {
      /**
       * Defines conditions that will cause an open popup to auto close dismiss.  A value of <code class="prettyprint">focusLoss</code>
       * defines the dismissal condition where focus has left the content of the popup or from the associated
       * launcher or if what the popup is aligned to is not fully visible within an overflow area.
       *
       * @expose
       * @memberof! oj.ojPopup
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"focusLoss"</code>
       * @ojvalue {string} "none" disables auto dismissal behaviors.
       * @ojvalue {string} "focusLoss" defines auto dismissal behavior when focus leaves the content of the popup or
       *                   associated launcher.  In addition, if what the popup is positioned to is clipped within an
       *                   overflow area, the popup will auto close dismiss.
       *
       * @example <caption>Initialize the popup with <code class="prettyprint">autoDismiss</code> option specified:</caption>
       * $( ".selector" ).ojPopup( { "autoDismiss": "focusLoss" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">autoDismiss</code> option, after initialization:</caption>
       * // getter
       * var autoDismiss = $( ".selector" ).ojPopup( "option", "autoDismiss" );
       * // setter
       * $( ".selector" ).ojPopup( "option", "autoDismiss", "none" );
       */
       autoDismiss: 'focusLoss',
      /**
       * Defines the presents of border, shadow and background color of the root popup dom.  Value of
       * <code class="prettyprint">none</code> applies the <code class="prettyprint">oj-popup-no-chrome</code>
       * selector defined by the active theme to the root dom of the popup to remove the default chrome.
       *
       * @expose
       * @memberof! oj.ojPopup
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"default"</code>
       * @ojvalue {string} "default" describes the popups border, shadow, and background color defined by the active theme.
       * @ojvalue {string} "none" turns off the outer chrome defined by the active theme.
       *
       * @example <caption>Initialize the popup with <code class="prettyprint">chrome</code> option specified:</caption>
       * $( ".selector" ).ojPopup( { "chrome": "none" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">chrome</code> option, after initialization:</caption>
       * // getter
       * var chrome = $( ".selector" ).ojPopup( "option", "chrome" );
       *
       * // setter
       * $( ".selector" ).ojPopup( "option", "chrome", "none" );
       */
      chrome : 'default',
      /**
       * Determines if the popup should steal focus to its content when initially open. A value of <code class="prettyprint">none</code>
       * prevents the popup from grabbing focus when open.
       *
       * @expose
       * @memberof! oj.ojPopup
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"auto"</code>
       * @ojvalue {string} "auto" option is derived from the values of the modality and autoDismiss options
       * @ojvalue {string} "none" prevents the popup from stealing focus when open.
       * @ojvalue {string} "firstFocusable" defines that a popup should grab focus to the first focusable element within the
       *                   popup's content.
       * @ojvalue {string} "popup" focus to the root popup container (good choice for touch platforms).
       *
       * @example <caption>Initialize the popup with <code class="prettyprint">initialFocus</code> option specified:</caption>
       * $( ".selector" ).ojPopup( { "initialFocus": "none" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">initialFocus</code> option, after initialization:</caption>
       * // getter
       * var initialFocus = $( ".selector" ).ojPopup( "option", "initialFocus" );
       *
       * // setter
       * $( ".selector" ).ojPopup( "option", "initialFocus", "none" );
       */
      initialFocus : 'auto',
      /**
       * <p>Position object is defined by the jquery position API and is used to establish the location the
       * popup will appear relative to another element.  The position object contains the following properties:
       * "my", "at", "of", "collision", "using" and "within".</p>
       *
       * <p>The "my" and "at" properties defines aligment points relative to the popup and other element.  The
       * "my" property represents the popups alignment where the "at" property represents the other element
       * that can be identified by "of" or defauts to the launcher when the popup opens.  The values of these
       * properties describe a "horizontal vertical" location.</p>
       *
       * <p>Acceptable "horizontal" alignments values are: "right", "center", "left", "start", "end".  Note: Jet has
       * added "start" and "end" options to be more RTL friendly.  The Jet values of "start" and "end" normalize
       * to "right" or "left" depending on the direction of the document.</p>
       *
       * <p>Acceptable "vertical" alignment values are: "top", "center" and "bottom".</p>
       *
       * The following is a short summary of the most interesting positon properties:
       * <ul>
       *   <li><code class="prettyprint">my</code> - A "vertical horizontal" rule that defines the location of the popup
       *       used for alignment.</li>
       *   <li><code class="prettyprint">at</code> - A "vertical horizontal" rule that defines the location of the
       *       other element for used alignment. The other element is defined by "of" or defaults to the open launcher
       *       argument if not specified.</li>
       * </ul>
       *
       * @expose
       * @memberof! oj.ojPopup
       * @instance
       * @type {Object}
       * @default <code class="prettyprint">{my: "start top", at: "start bottom", collision: "flip"}</code>
       *
       * @example <caption>Initialize the popup with <code class="prettyprint">position</code> option specified:</caption>
       * $( ".selector" ).ojPopup( { "position": {"my": "left top", "at": "right top"} } );
       *
       * @example <caption>Get or set the <code class="prettyprint">position</code> option, after initialization:</caption>
       * // getter
       * var position = $( ".selector" ).ojPopup( "option", "position" );
       *
       * // setter
       * $( ".selector" ).ojPopup( "option", "position", {"my": "start bottom", "at": "end+14 top" } );
       */
      position :
      {
        /**
         * Defines which position on the popup to align with the target ("of") element: "horizontal vertical" alignment.
         * A single value such as "right" will be normalized to "right center", "top" will be normalized to "center top"
         * (following CSS convention). Acceptable horizontal values: "left", "center", "right".
         * Acceptable vertical values: "top", "center", "bottom". Example: "left top" or "center center".
         * Each dimension can also contain offsets, in pixels or percent, e.g., "right+10 top-25%". Percentage offsets are relative
         * to the popup being positioned.
         *
         *
         * @expose
         * @memberof! oj.ojPopup
         * @instance
         * @alias position.my
         * @type {string}
         * @default <code class="prettyprint">start top</code>
         */
         'my' : 'start top',
        /**
         * Defines which position on the target element ("of") to align the positioned element against: "horizontal vertical"
         * alignment. See the my option for full details on possible values. Percentage offsets are relative to the target element.
         *
         * @expose
         * @type {string}
         * @memberof! oj.ojPopup
         * @instance
         * @alias position.at
         * @default <code class="prettyprint">start bottom</code>
         */
         'at' : 'start bottom',
        /**
         * Which element to position the popup against.  The default is the <code class="prettyprint">launcher</code> argument
         * passed to the <code class="prettyprint">open</code> method. If you provide a selector or jQuery object,
         * the first matching element will be used. If you provide an event object, the pageX and pageY properties
         * will be used.
         *
         * @expose
         * @memberof! oj.ojPopup
         * @instance
         * @alias position.of
         * @type {string}
         * @default <code class="prettyprint">''</code>
         */
         'of' : '',
        /**
         *  When the positioned element overflows the window in some direction, move it to an alternative position. Similar to my and
         *  at, this accepts a single value or a pair for horizontal/vertical, e.g., "flip", "fit", "fit flip", "fit none".
         *
         *  <ul>
         *    <li>"flip": Flips the element to the opposite side of the target and the collision detection is run again to see if it
         *        will fit. Whichever side allows more of the element to be visible will be used.</li>
         *    <li>"fit": Shift the element away from the edge of the window.</li>
         *    <li>"flipfit": First applies the flip logic, placing the element on whichever side allows more of the element to be
         *        visible. Then the fit logic is applied to ensure as much of the element is visible as possible.</li>
         *    <li>"none": Does not apply any collision detection.</li>
         *  </ul>
         * @expose
         * @memberof! oj.ojPopup
         * @instance
         * @alias position.collision
         * @type {string}
         * @default <code class="prettyprint">flip</code>
         */
         'collision' : 'flip'
      },
      /**
       * Determines if a decoration will be displayed from the popup that points to the element the popup is aligned to.
       * The <code class="prettyprint">simple</code> value enables the tail defined by the current theme.  In addtion,
       * the <code class="prettyprint">oj-popup-tail-simple</code> selector will be applied to the root dom element.  This
       * is to allow the box-shadow, z-index and other chrome styling to vary per tail decoration.
       *
       * @expose
       * @memberof! oj.ojPopup
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"none"</code>
       * @ojvalue {string} "none" no decoration will be displayed from the popup pointing to the launcher.
       * @ojvalue {string} "simple" enables showing the tail defined by the current theme.
       *
       * @example <caption>Initialize the popup with <code class="prettyprint">tail</code> option specified:</caption>
       * $( ".selector" ).ojPopup( { "tail": "simple" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">tail</code> option, after initialization:</caption>
       * // getter
       * var tail = $( ".selector" ).ojPopup( "option", "tail" );
       *
       * // setter
       * $( ".selector" ).ojPopup( "option", "tail", "simple" );
       */
      tail : 'none',
	  /**
	   * Determines if the popup should block user input of the page behind with a blocking overlay pane.
       *
       * <p>The default modality varies by theme.  Each theme can set its default by setting
       * <code class="prettyprint">$popupModalityOptionDefault</code> as seen in the example below.
       *
       * @expose
       * @memberof oj.ojPopup
       * @instance
	   * The modality of the popup. Valid values are:
       * @default Varies by theme. <code class="prettyprint">"modless"</code> if not specified in theme
       * @ojvalue {string} "modeless" defines a modeless popup.
       * @ojvalue {string} "modal" The popup is modal. Interactions with other page elements are disabled. Modal popups overlay
       *          other page elements.
       * @type {string}
       *
       * @example <caption>Initialize the popup to have modality <code class="prettyprint">modality</code></caption>
       * $(".selector" ).ojPopup( {modality: "modal" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">modality</code> option, after initialization:</caption>
       * // getter
       * var modality = $(".selector" ).ojPopup( "option", "modality" );
       *
       * // setter
       * $(".selector" ).ojPopup( "option", "modality", "modal");
       *
       * @example <caption>Set the default in the theme (SCSS) :</caption>
       * $popupModalityOptionDefault: modal !default;
       */
	    modality: "modeless",

      /**
       *
       * The WAI-ARIA role of the popup. By default, role="tooltip" is added to the generated HTML markup that surrounds the popup.
       *
       * @expose
       * @memberof oj.ojPopup
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"tooltop"</code>
       * @ojvalue {string} "tooltip" defines contextual popup that displays a description for an element.
       * @ojvalue {string} "dialog" defines an application window that is designed to interrupt the current processing of an
       *                   application in order to prompt the user to enter information or require a response.
       * @ojvalue {string} "alertdialog" defines type of dialog that contains an alert message, where initial focus goes to an
       *                   element within the dialog.
       *
       * @example <caption>Initialize the popup with the <code class="prettyprint">role</code></caption> option specified:</caption>
       * $(".selector" ).ojPopup( {role: "alertdialog" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">role</code> option, after initialization:</caption>
       * // getter
       * var role = $(".selector" ).ojPopup( "option", "role" );
       *
       * // setter
       * $(".selector" ).ojDialog( "option", "role", "alertdialog");
       */
      role: "tooltip",
      // Events
      /**
       * Triggered before the popup is launched via the <code class="prettyprint">open()</code> method.
       * The launch can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
       *
       * @expose
       * @event
       * @memberof! oj.ojPopup
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui currently empty
       *
       * @example <caption>Initialize the popup with the <code class="prettyprint">beforeOpen</code> callback specified:</caption>
       * $( ".selector" ).ojPopup({
       *     "beforeOpen": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeopen</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeopen", function( event, ui ) {} );
       */
      beforeOpen : null,
      /**
       * Triggered after the popup is launched via the <code class="prettyprint">open()</code> method.
       *
       * @expose
       * @event
       * @memberof! oj.ojPopup
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui currently empty
       *
       * @example <caption>Initialize the popup with the <code class="prettyprint">open</code> callback specified:</caption>
       * $( ".selector" ).ojPopup({
       *     "open": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojopen</code> event:</caption>
       * $( ".selector" ).on( "ojopen", function( event, ui ) {} );
       */
      open : null,
      /**
       * Triggered before the popup is dismissed via the <code class="prettyprint">close()</code> method.
       * The close can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
       *
       * @expose
       * @event
       * @memberof! oj.ojPopup
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui currently empty
       *
       * @example <caption>Initialize the popup with the <code class="prettyprint">beforeClose</code> callback specified:</caption>
       * $( ".selector" ).ojPopup({
       *     "beforeClose": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeclose</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeclose", function( event, ui ) {} );
       */
      beforeClose : null,
      /**
       * Triggered after the popup is dismissed via the <code class="prettyprint">close()</code> method.
       *
       * @expose
       * @event
       * @memberof! oj.ojPopup
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui currently empty
       *
       * @example <caption>Initialize the popup with the <code class="prettyprint">close</code> callback specified:</caption>
       * $( ".selector" ).ojPopup({
       *     "close": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojclose</code> event:</caption>
       * $( ".selector" ).on( "ojclose", function( event, ui ) {} );
       */
      close : null,
      /**
       * Triggered after focus has been transfered to the popup. This will occur after the
       * <code class="prettyprint">open()</code> method is called, depending on the value
       * of the <code class="prettyprint">initialFocus</code> option.  It's also triggered when using the
       * <kbd>F6</kbd> key to toggle focus from the associated launcher element to the content of the popup.
       *
       * @expose
       * @event
       * @memberof! oj.ojPopup
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui currently empty
       *
       * @example <caption>Initialize the popup with the <code class="prettyprint">focus</code> callback specified:</caption>
       * $( ".selector" ).ojPopup({
       *     "focus": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojfocus</code> event:</caption>
       * $( ".selector" ).on( "ojfocus", function( event, ui ) {} );
       */
      focus : null
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @protected
    * @override
    * @return {void}
    */
     _ComponentCreate: function ()
    {
      this._super();

      var rootStyle = this._getRootStyle();
      var rootElement = $("<div>");
      this._rootElement = rootElement.hide().addClass(rootStyle).attr("aria-hidden", "true");
      rootElement.addClass("oj-component");

      var content = $("<div>").addClass([rootStyle, "content"].join("-"));
      content.attr("role", "presentation");
      content.appendTo(rootElement);    // @HTMLUpdateOK
      this.element.after(rootElement);  // @HTMLUpdateOK
      this.element.appendTo(content);   // @HTMLUpdateOK
      this.element.show();

      this._createTail();
      this._setChrome();

      // callback that overrides the positon['using'] for setting the tail.
      this._usingCallback = $.proxy(this._usingHandler, this);
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @protected
    * @override
    * @return {void}
    */
    _destroy : function ()
    {
      if (this.isOpen())
        this._closeImplicitly();

      this._destroyTail();
      delete this._usingCallback;
      delete this._popupServiceEvents;

      oj.DomUtils.unwrap(this.element, this._rootElement);  // @HTMLUpdateOK
      this.element.hide();

      var closeDelayTimer = this._closeDelayTimer;
      if (!isNaN(closeDelayTimer))
      {
        delete this._closeDelayTimer;
        window.clearTimeout(closeDelayTimer);
      }

      this._destroyVoiceOverAssist();
      this._super();
    },
    /**
     * Returns a <code class="prettyprint">jQuery</code> object containing the generated wrapper.
     * This method does not accept any arguments.
     *
     * @expose
     * @name oj.ojpopup#widget
     * @memberof! oj.ojPopup
     * @instance
     * @return {jQuery} the popup
     *
     * @example <caption>Invoke the <code class="prettyprint">widget</code> method:</caption>
     * var widget = $( ".selector" ).ojPopup( "widget" );
     */
    widget : function ()
    {
      return this._rootElement;
    },
    /**
     * Opens the popup. This method accepts two arguments but both are optional.
     *
     *
     * @expose
     * @method
     * @name oj.ojPopup#open
     * @memberof! oj.ojPopup
     * @instance
     * @param {?(string|jQuery|Element)} launcher jquery object, jquery selector or dom element that
     *                                   is associated with the popup.
     * @param {?Object} position an element relative to another
     * @return {void}
     * @fires oj.ojPopup#beforeOpen
     * @fires oj.ojPopup#open
     *
     * @example <caption>Invoke the <code class="prettyprint">open</code> method:</caption>
     * var open = $( ".selector" ).ojPopup( "open" );
     */
    open : function (launcher, position)
    {

      if (this.isOpen())
      {
        this.close();

        //if beforeClose handler prevents that action, just bail out.
        if (this.isOpen())
          return;
      }

      this._setLauncher(launcher);

      var rootElement = this._rootElement;
      launcher = this._launcher;

      if (oj.StringUtils.isEmptyOrUndefined(rootElement.attr("id")))
        rootElement.attr("id", this._getSubId("wrapper"));

      if (this._trigger("beforeOpen") === false)
        return;

      this._setPosition(position);


      var options = this.options;
      this._setAutoDismiss(options["autoDismiss"]);
      this._addDescribedBy();
      rootElement.attr("role", options["role"]);

      position = options["position"];
      var isRtl = this._GetReadingDirection() === "rtl";
      position = oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl);

      // build layer class selectors applied to the popup layer
      var rootStyle = this._getRootStyle();
      var layerClass = [rootStyle, "layer"].join("-");
      var tailDecoration = options['tail'];
      if ("none" !== tailDecoration)
        layerClass += " " + [rootStyle, "tail", tailDecoration].join("-");

      /** @type {!Object.<oj.PopupService.OPTION, ?>} */
      var psOptions = {};
      psOptions[oj.PopupService.OPTION.POPUP] = rootElement;
      psOptions[oj.PopupService.OPTION.LAUNCHER] = launcher;
      psOptions[oj.PopupService.OPTION.POSITION] = position;
      psOptions[oj.PopupService.OPTION.EVENTS] = this._getPopupServiceEvents();
      psOptions[oj.PopupService.OPTION.LAYER_SELECTORS] = layerClass;
      psOptions[oj.PopupService.OPTION.MODALITY] = options["modality"];
      oj.PopupService.getInstance().open(psOptions);

      this._trigger("open");

      this._intialFocus();

      this._initVoiceOverAssist();

      this._on(rootElement, {'keydown': this._keyHandler, 'keyup': this._keyHandler});
      if (launcher && launcher.length > 0)
        this._on(launcher, {'keydown': this._keyHandler, 'keyup': this._keyHandler});
    },
    /**
     * Closes the popup. This method does not accept any arguments.
     *
     * @expose
     * @method
     * @name oj.ojPopup#close
     * @memberof! oj.ojPopup
     * @instance
     * @return {void}
     * @fires oj.ojPopup#beforeClose
     * @fires oj.ojPopup#close
     *
     * @example <caption>Invoke the <code class="prettyprint">close</code> method:</caption>
     * var close = $( ".selector" ).ojPopup( "close" );
     */
    close : function ()
    {
      if (!this.isOpen())
        return;

      if (this._trigger("beforeClose") === false && !this._ignoreBeforeCloseResultant)
        return;

      // if the content has focus, restore the the launcher
      this._restoreFocus();

      var launcher = this._launcher;
      var rootElement = this._rootElement;

      this._off(rootElement, "keydown keyup");
      if (launcher && launcher.length > 0)
        this._off(launcher, "keydown keyup");

      //clean up voice over assist
      this._destroyVoiceOverAssist();

      /** @type {!Object.<oj.PopupService.OPTION, ?>} */
      var psOptions = {};
      psOptions[oj.PopupService.OPTION.POPUP] = rootElement;
      oj.PopupService.getInstance().close(psOptions);

      this._removeDescribedBy();
      this._setAutoDismiss();

      delete this._launcher;

      var position = this.options["position"];

      // if the open has set the of because one was not provided by default,
      // remove the override to the launcher.
      if (position["_ofo"])
      {
        delete position["_ofo"];
        delete position["of"];
      }

      this._trigger("close");
    },
    /**
     * Returns the state of whether the popup is currently open. This method does not accept any arguments.
     *
     * @expose
     * @method
     * @name oj.ojPopup#isOpen
     * @memberof! oj.ojPopup
     * @instance
     * @return {boolean} <code>true</code> if the popup is open.
     *
     * @example <caption>Invoke the <code class="prettyprint">isOpen</code> method:</caption>
     * var isOpen = $( ".selector" ).ojPopup( "isOpen" );
     */
    isOpen : function ()
    {
      return this._rootElement.is(":visible");
    },
    /**
     * Causes the popup to reevaluate its position.  Call this function after
     * the content of the popup has dynamically changed while the popup is open.
     *
     * <p>This method does not accept any arguments.</p>
     *
     * @expose
     * @method
     * @name oj.ojPopup#refresh
     * @memberof! oj.ojPopup
     * @instance
     * @return {void}
     * @override
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojPopup( "refresh" );
     */
    refresh : function ()
    {
      this._super();

      if (this.isOpen())
        this._reposition();

      // trigger refresh of descendents
      var rootElement = this._rootElement;
      oj.PopupService.getInstance().triggerOnDescendents(rootElement, oj.PopupService.EVENT.POPUP_REFRESH);
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @protected
    * @param {string} key option name
    * @param {?Object} value of the target option identified by the key
    * @override
    */
    _setOption : function (key, value)
    {

      var options = this.options;
      switch (key)
      {
        case "tail":
          if (value !== options["tail"])
          {
            this._setTail(value);
          }
          break;
        case "chrome":
          if (value !== options["chrome"])
            this._setChrome(value);
          break;
        case "position":
          this._setPosition(value);
          this.refresh();
          // don't call super because setPosition sets the option after creating a new
          // instance.  This prevents the same position instance from getting registered
          // with multiple component instances.
          return;
        case "autoDismiss":
          if (this.isOpen() && value !== options["autoDismiss"])
            this._setAutoDismiss(value);
          break;
	      case "modality":
		      if (this.isOpen())
		      {
                var rootElement = this._rootElement;
		        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
		        var psOptions = {};
		        psOptions[oj.PopupService.OPTION.POPUP] = rootElement;
		        psOptions[oj.PopupService.OPTION.MODALITY] = value;
		        oj.PopupService.getInstance().changeOptions(psOptions);
		      }
		      break;
      }

      this._superApply(arguments);
    },
   /**
    * Returns the root selector prefix for the popup components.  In the future if the popup is subcassed,
    * this method can be made protected and override to change the root selector names for the target
    * component.
    *
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {string}
    */
    _getRootStyle : function ()
    {
      return "oj-popup";
    },
   /**
    * Handles setting up the target tail.
    *
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {string} tail option value
    * @return {void}
    */
    _setTail : function (tail)
    {
      this._destroyTail();
      this._createTail(tail);
      this._reposition();
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {string} tail option value
    * @return {void}
    */
    _createTail : function (tail)
    {
      var tailDecoration = tail ? tail : this.options['tail'];
      if ("none" === tailDecoration)
        return;

      var rootStyle = this._getRootStyle();
      var tailMarkerStyle = [rootStyle, "tail"].join("-");
      var tailStyle = [tailMarkerStyle, tailDecoration].join("-");

      var tailDom = $("<div>").hide();
      tailDom.addClass(tailMarkerStyle).addClass(tailStyle);
      tailDom.attr("role", "presentation");

      // id over "marker style" due to nesting popups in popups
      this._tailId = tailDom.attr("id", this._getSubId("tail")).attr("id");
      var rootElement = this._rootElement;
      tailDom.appendTo(rootElement);  // @HTMLUpdateOK

      // tail "value" style is applied to the root dom for shadow and z-index adjustments
      rootElement.addClass(tailStyle);

      // The tail can change the z-index of the layer that defines the stacking context
      // of the popup.  If the popup is open, update the layers class.
      if (this.isOpen())
      {
        var layerClass = [rootStyle, "layer"].join("-");
        layerClass += " " + tailStyle;

        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
        var options = {};
        options[oj.PopupService.OPTION.POPUP] = rootElement;
        options[oj.PopupService.OPTION.LAYER_SELECTORS] = layerClass;
        oj.PopupService.getInstance().changeOptions(options);
      }

    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {jQuery}
    */
    _getTail : function ()
    {
      var tailId = this._tailId;
      if (!tailId)
        return null;

      return $(document.getElementById(tailId));
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _destroyTail : function ()
    {

      var tail = this._getTail();
      if (tail)
        tail.remove();

      delete this._tailId;

      var tailDecoration = this.options['tail'];
      var rootStyle = this._getRootStyle();
      var tailStyle = [rootStyle, "tail", tailDecoration].join("-");

      var rootElement = this._rootElement;
      rootElement.removeClass(tailStyle);

      // if the popup is open, reseed the layer class removing the
      // tail style.
      if (this.isOpen())
      {
        var layerClass = [rootStyle, "layer"].join("-");
        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
        var options = {};
        options[oj.PopupService.OPTION.POPUP] = rootElement;
        options[oj.PopupService.OPTION.LAYER_SELECTORS] = layerClass;
        oj.PopupService.getInstance().changeOptions(options);
      }

    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {string} chrome option value
    * @return {void}
    */
    _setChrome : function (chrome)
    {
      var chromeDecoration = (chrome ? chrome : this.options["chrome"]);
      var noChromeStyle = [this._getRootStyle(), "no-chrome"].join("-");
      var rootElement = this._rootElement;

      if ("default" === chromeDecoration && rootElement.hasClass(noChromeStyle))
        rootElement.removeClass(noChromeStyle);
      else if ("none" === chromeDecoration && !rootElement.hasClass(noChromeStyle))
        rootElement.addClass(noChromeStyle);
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {string|Node|jQuery|null} launcher provided when the popup is open
    * @return {void}
    */
    _setLauncher: function (launcher)
    {
      if (!launcher)
        launcher = $(document.activeElement);
      else if ($.type(launcher) === "string")//id jquery selector
        launcher = $(launcher);
      else if (launcher.nodeType === 1)//dom element
        launcher = $(launcher);

      // if a jquery collection, select the first dom node not in the popups content
      if (launcher instanceof jQuery && launcher.length > 1)
      {
        var rootElement = this._rootElement;

        for (var i = 0;i < launcher.length;i++)
        {
          var target = launcher[0];
          //if (rootElement.has(target).length === 0) {
          if (!oj.DomUtils.isAncestorOrSelf(rootElement[0], target))
          {
            launcher = $(target);
            break;
          }
        }
      }
      else if (!(launcher instanceof jQuery) || //object is not a jq
               ((launcher instanceof jQuery) && launcher.length === 0))// empty jq collection
        launcher = $(document.activeElement);

      this._launcher = launcher;
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {?Object} position object set as an option or passed as an argument to the open method.
    * @return {void}
    */
    _setPosition : function (position)
    {

      var options = this.options;

      // new position extends the existing object
      if (position)
        options["position"] = $.extend(options[position], position);

      // grab the updated position
      position = options["position"];

      var usingCallback = this._usingCallback;

      // if they provided a using function that is not our callback, stash it
      // away so that we can delegate to it in our proxy.
      if ($.isFunction(position["using"]) && position["using"] !== usingCallback)
        position["origUsing"] = position["using"];

      // override with our proxy to handle positioning of the tail
      position["using"] = usingCallback;

      //override "of" alignment node to the launcher if not specified
      var launcher = this._launcher;

      if (!position["of"])
      {
        position["of"] = launcher;
        position["_ofo"] = true;
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {Object} pos "my" element associated with the position object
    * @param {Object} props directions as to where the element should be moved
    * @return {void}
    */
    _usingHandler: function(pos, props)
    {
      var rootElement = props["element"]["element"];

      // do nothing if the position is the same
      if (pos["top"] === rootElement.css("top") && pos["left"] === rootElement.css("left"))
        return;

      var tail = this._getTail();
      if (!tail)
        rootElement.css(pos);
      else
      {
        tail.hide();
        for (var i = 0; i < _TAIL_STYLES.length; i++)
        {
          tail.removeClass(_TAIL_STYLES[i]);
          rootElement.removeClass(_TAIL_STYLES[i]);
        }
        tail.removeAttr("style");

        // 
        // Check if "of" alignment is to a x,y versus a dom element.  The horizontal
        // rule returned from jquery UI position defaults to "left" or "right".  The height and
        // width of the target will be zero when the "of" is not a DOM element.
        // Use the position.my alignment rules over what jquery returns when aligned to a point.
        if (props["target"] && props["target"]["height"] === 0 && props["target"]["width"] === 0)
        {
          var isRtl = this._GetReadingDirection() === "rtl";
          var position = oj.PositionUtils.normalizeHorizontalAlignment(this.options["position"], isRtl);
          var myrule = position["my"];
          if (!oj.StringUtils.isEmptyOrUndefined(myrule))
          {
            var myrules = myrule.split(" ");
            var suggestedHrule = myrules[0];
            var suggestedVrule = "middle";
            if (myrules.length > 1)
              suggestedVrule = (myrules[1] === "center") ? "middle" : myrules[1];
            props['horizontal'] = suggestedHrule;
            props['vertical'] = suggestedVrule;
          }
        }

        var alignMnemonic = [props["horizontal"], props["vertical"]].join("-");
        var tailStyle = _TAIL_ALIGN_RULES[alignMnemonic];
        tail.addClass(tailStyle);
        rootElement.addClass(tailStyle);
        tail.show();

        // adjust the vertical and horizontal positioning to account for the tail
        // so that the page developer doesn't have to factor that in
        var borderFactor = 2; // factor in a little extra so the borders overlap
        if ("left" === props["horizontal"])
        {
          var tailHOffset = tail.outerWidth();
          tailHOffset -= (tailHOffset + oj.DomUtils.getCSSLengthAsInt(tail.css("left")));
          pos["left"] = pos["left"] + (tailHOffset - borderFactor);
        }
        else if ("right" === props["horizontal"])
        {
          var tailHOffset = tail.outerWidth();
          tailHOffset -= (tailHOffset + oj.DomUtils.getCSSLengthAsInt(tail.css("right")));
          pos["left"] = pos["left"] - (tailHOffset - borderFactor);
        }

        // tail adjustments when the offset of the image is not the total size of the image
        if ("top" === props["vertical"])
        {
         var tailVOffset = tail.outerHeight();
         tailVOffset -= (tailVOffset + oj.DomUtils.getCSSLengthAsInt(tail.css(props["vertical"])));
         pos["top"] = pos["top"] + (tailVOffset - borderFactor);
        }
        else if ("bottom" === props["vertical"])
        {
         var tailVOffset = tail.outerHeight();
         tailVOffset -= (tailVOffset + oj.DomUtils.getCSSLengthAsInt(tail.css(props["vertical"])));
         pos["top"] = pos["top"] - (tailVOffset - borderFactor);
        }
        rootElement.css(pos);

        // adjustments to the vertical or horizontal centering.  The 50% alignment is from
        // the edge of the tail versus the center of the image.  The tail can't be located
        // at "center, middle". In this case (dead center), horizintal center looks better
        // on small viewports (_TAIL_ALIGN_RULES["center-middle"] === 'oj-center oj-bottom')
        if ("center" === props["horizontal"])
        {
          var rootWidth = rootElement.width();
          var leftPercent = Math.round((((rootWidth / 2) - (tail.outerWidth() / 2)) / rootWidth) * 100);
          tail.css(
          {
            left: leftPercent + '%'
          });
        }
        else if ("middle" === props["vertical"])
        {
          var rootHeight = rootElement.height();
          var topPercent = Math.round((((rootHeight / 2) - (tail.outerHeight() / 2)) / rootHeight) * 100);
          tail.css(
          {
            top: topPercent + '%'
          });
        }
      }

      // call on the original using regardless of the tail
      var options = this.options;
      var origUsing = options["position"]["origUsing"];
      if (origUsing)
        origUsing(pos, props);

      // The "origUsing" could alter the positon.  This check needs to be last.
      // When focusLoss auto dismissal is enabled, implicitly close the popup when the
      // position.of is clipped in an overflow container.
      if ("focusLoss" === options["autoDismiss"])
      {
        if (oj.PositionUtils.isAligningPositionClipped(props))
        {
          // Ignore focus back to what had focus before the popup was open. Focus
          // restore could fight scroll if the popup was closed due to the aligning
          // element being clipped.
          this._ignoreRestoreFocus = true;
          this._closeDelayTimer = this._delay($.proxy(this._closeImplicitly, this), 1);
        }
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _reposition : function ()
    {
      var rootElement = this._rootElement;
      var position = this.options["position"];
      var isRtl = this._GetReadingDirection() === "rtl";
      rootElement.position(oj.PositionUtils.normalizeHorizontalAlignment(position, isRtl));
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {boolean=} waiAriaAssisted focus established via keyboard or voice over versus from open API
    * @return {void}
    */
    _intialFocus : function (waiAriaAssisted)
    {
      var initialFocus = this._deriveInitialFocus();

      // We are toggling focus into the popup due to F6 or voice over skip link.
      if (waiAriaAssisted && "none" === initialFocus)
        initialFocus = "popup";

      if ("firstFocusable" === initialFocus)
      {
        var nodes = this.element.find(":focusable");
        if (nodes.length > 0)
        {
          var first = nodes[0];
          $(first).focus();
          this._trigger("focus");
        }
        else  // nothing to set focus to, default to "popup"
          initialFocus = "popup";
      }

      // Establish focus to the root element of the popup.  It's not a natural focus stop
      if ("popup" === initialFocus)
      {
        var rootElement = this._rootElement;
        rootElement.attr("tabindex", "-1");
        rootElement.focus();
        this._trigger("focus");
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @private
    * @return {string} derives the target initialFocus option when the default is auto
    */
    _deriveInitialFocus: function()
    {
      var options = this.options;
      var initialFocus = options["initialFocus"];

      if ("auto" === initialFocus)
      {
        var modality = options["modality"];
        if (modality === "modal")
        {
          if (oj.DomUtils.isTouchSupported())
            initialFocus = "popup";
          else
            initialFocus = "firstFocusable";
        }
        else
          initialFocus = "none";
      }

      return initialFocus;
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {Element} activeElement from the event being handled
    * @param {boolean!} includeChildren when true the focus test will include the scope of any
    *                   child popups.
    * @return {boolean} <code>true</code> if the active element is within the content of the popup
    */
    _isFocusInPopup : function (activeElement, includeChildren)
    {
      if (!activeElement)
        activeElement = document.activeElement;

      // added to avoid automation issues where an active element is not established
      if (!activeElement)
        return false;

      var rootElement = this._rootElement;

      // popups that are children are siblings to the parent popup within the
      // layer that defines the stacking context.
      if (includeChildren)
        rootElement = rootElement.parent();

      return oj.DomUtils.isAncestorOrSelf(rootElement[0], activeElement);
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {Element} activeElement from the event being handled
    * @return {boolean} <code>true</code> if the active element the launcher or a decedent of the launcher
    */
    _isFocusInLauncher : function (activeElement)
    {
      if (!activeElement)
        activeElement = document.activeElement;

      var launcher = this._launcher;
      return oj.DomUtils.isAncestorOrSelf(launcher[0], activeElement);
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _restoreFocus : function ()
    {
      if (this._ignoreRestoreFocus)
      {
        delete this._ignoreRestoreFocus;
        return;
      }

      // extend the focus check to include popups that are children
      if (this._isFocusInPopup(null, true))
      {
        var launcher = this._launcher;
        launcher.focus();
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {jQuery.Event|Event} event keydown
    * @return {void}
    */
    _keyHandler : function (event)
    {
      if (event.isDefaultPrevented())
        return;

      var eventType = event.type;

      /** @type {?} */
      var target = event.target;
      if ("keyup" === eventType && event.keyCode === $.ui.keyCode.ESCAPE &&
           (this._isFocusInPopup(target) || this._isFocusInLauncher(target)))
      {
        event.preventDefault();
        this.close();
      }
      else if ("keydown" === eventType && event.keyCode === 117)
      {
        //F6 - toggle focus to launcher or popup
        if (this._isFocusInPopup(target))
        {
          // If this is a modeless popup, toggle focus to the launcher;
          // otherwise, close the popup as we can't set focus under the
          // modal glass pane.
          var options = this.options;
          if ("modeless" === options['modality'])
          {
            event.preventDefault();
            var launcher = this._launcher;
            launcher.focus();
          }
          else
            this.close();
        }
        else if (this._isFocusInLauncher(target))
        {
          event.preventDefault();
          this._intialFocus(true);
        }
      }
      else if ("keydown" === eventType && event.keyCode === $.ui.keyCode.TAB &&
               this._isFocusInPopup(target))
      {
        // TAB within popup
        var nodes = this.element.find(":tabbable");
        if (nodes.length > 0)
        {
          var firstNode = nodes[0];
          var lastNode = nodes[nodes.length - 1];
          var rootElement = this._rootElement;

          if ((firstNode === target || rootElement[0] === target) && event.shiftKey)
          {
            //tabbing backwards, cycle focus to last node
            event.preventDefault();
            // If the first and last tab stops are the same,
            // force focus to the root popup dom.  This will
            // cause the blur to fire on any input components.
            // If we are back tabbing on the popup dom, jump to the
            // last tab stop.
            if (firstNode === lastNode && firstNode === target)
            {
              rootElement.attr("tabindex", "-1");
              rootElement.focus();
            }
            else
              $(lastNode).focus();  //tabbing backwards, cycle focus to last node
          }
          else if (lastNode === target && !event.shiftKey)
          {
            event.preventDefault();
            // If the first and last tab stops are the same,
            // force focus to the root popup dom.  This will
            // cause the blur to fire on any input components.
            if (lastNode === firstNode)
            {
              rootElement.attr("tabindex", "-1");
              rootElement.focus();
            }
            else
              $(firstNode).focus(); //tabbing forwards, cycle to the first node
          }
        }
        else
        {
          event.preventDefault();
          var options = this.options;
          if ("modeless" === options['modality'])
          {
            // if there is nothing in the popup that is tabbable, handle as a F6
            // toggle to the launcher
            var launcher = this._launcher;
            launcher.focus();
          }
          else
          {
            // Modal popup can't set focus to something under the overlay,
            // implicitly close.
            this.close();
          }
        }
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {string|null} autoDismiss option value
    * @return {void}
    */
    _setAutoDismiss : function (autoDismiss)
    {

      // unregister any existing handlers, might need to add mouseOut in the future
      var focusLossCallback = this._focusLossCallback;
      var events = this._getPopupServiceEvents();
      if (focusLossCallback)
      {
        delete events[oj.PopupService.EVENT.POPUP_AUTODISMISS];
        delete this._focusLossCallback;
      }

      if ("focusLoss" === autoDismiss)
      {
        focusLossCallback = this._focusLossCallback = $.proxy(this._dismissalHandler, this);
        events[oj.PopupService.EVENT.POPUP_AUTODISMISS] = focusLossCallback;
      }

      if (this.isOpen())
      {
        var rootElement = this._rootElement;
        /** @type {!Object.<oj.PopupService.OPTION, ?>} */
        var options = {};
        options[oj.PopupService.OPTION.POPUP] = rootElement;
        options[oj.PopupService.OPTION.EVENTS] = events;
        oj.PopupService.getInstance().changeOptions(options);
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {Event} event native doc
    * @return {void}
    */
    _dismissalHandler : function (event)
    {
      var launcher = this._launcher;
      var rootElement = this._rootElement;

      // child popups are siblings to the parent in the layer.
      var layer = rootElement.parent();

      /** @type {?} */
      var target = event.target;

      // if the target is on the focus skip link next to the launcher, ignore.
      var focusSkipLink = this._focusSkipLink;
      if (focusSkipLink)
      {
        var link = focusSkipLink.getLink();
        if (link && oj.DomUtils.isAncestorOrSelf(link[0], target))
          return;
      }

      // if event target is not under the laucher or popup root dom subtrees, dismiss
      if (!oj.DomUtils.isAncestorOrSelf(launcher[0], target) && !oj.DomUtils.isAncestorOrSelf(layer[0], target))
      {
        if ($(target).is(":focusable"))
        {
          // If the dismissal event target can take focus and the
          // event type is a mousedown or touchstart, wait for the focus event
          // to trigger dismissal.  This allows the blur to happen
          // on input components which triggers validation.
          if ("mousedown" === event.type || "touchstart" === event.type)
            return;

          this._ignoreRestoreFocus = true;
        }

        // invoke standard close dismissal that can be canceled via the beforeclose
        // event.
        this.close();
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _addDescribedBy: function ()
    {
      var launcher = this._launcher;
      var rootElement = this._rootElement;

      var popupId = rootElement.attr("id");
      var describedby = launcher.attr("aria-describedby");
      var tokens = describedby ? describedby.split(/\s+/) : [];
      tokens.push(popupId);
      describedby = $.trim(tokens.join(" "));
      launcher.attr("aria-describedby", describedby);
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _removeDescribedBy: function() {
      var launcher = this._launcher;
      var rootElement = this._rootElement;

      var popupId = rootElement.attr("id");
      var describedby = launcher.attr("aria-describedby");
      var tokens = describedby ? describedby.split(/\s+/) : [];
      var index = $.inArray(popupId, tokens);
      if (index !== -1)
        tokens.splice(index, 1);

      describedby = $.trim(tokens.join(" "));
      if (describedby)
        launcher.attr("aria-describedby", describedby);
      else
        launcher.removeAttr("aria-describedby");
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _initVoiceOverAssist: function()
    {
      var isIOSVOSupported = (oj.AgentUtils.getAgentInfo()['os'] === oj.AgentUtils.OS.IOS);
      var liveRegion = this._liveRegion;
      if (!liveRegion)
       liveRegion = this._liveRegion = new oj.PopupLiveRegion();

      var message;
      if (isIOSVOSupported)
        message = this.getTranslatedString("none" === this.options["initialFocus"] ?
                                             "ariaLiveRegionInitialFocusNoneTouch":
                                             "ariaLiveRegionInitialFocusFirstFocusableTouch");
      else
        message = this.getTranslatedString("none" === this.options["initialFocus"] ?
                                             "ariaLiveRegionInitialFocusNone":
                                             "ariaLiveRegionInitialFocusFirstFocusable");
      liveRegion.announce(message);

      if (isIOSVOSupported)
      {
        var focusSkipLink = this._focusSkipLink;
        if (!focusSkipLink)
        {
          var focusSkipLinkId = this._getSubId("focusSkipLink");
          var launcher = this._launcher;
          var callback = $.proxy(this._intialFocus, this, true);
          message = this.getTranslatedString("ariaFocusSkipLink");
          this._focusSkipLink = new oj.PopupSkipLink(launcher, message, callback, focusSkipLinkId);
        }

        var closeSkipLink = this._closeSkipLink;
        if (!closeSkipLink)
        {
          var closeSkipLinkId = this._getSubId("closeSkipLink");
          var element = this.element;
          var callback = $.proxy(this._closeImplicitly, this);
          message = this.getTranslatedString("ariaCloseSkipLink");
          this._closeSkipLink = new oj.PopupSkipLink(element, message, callback, closeSkipLinkId);
        }
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _destroyVoiceOverAssist: function()
    {
      var liveRegion = this._liveRegion;
      if (liveRegion)
      {
        liveRegion.destroy();
        delete this._liveRegion;
      }
      var focusSkipLink = this._focusSkipLink;
      if (focusSkipLink)
      {
        focusSkipLink.destroy();
        delete this._focusSkipLink;
      }
      var closeSkipLink = this._closeSkipLink;
      if (closeSkipLink)
      {
        closeSkipLink.destroy();
        delete this._closeSkipLink;
      }
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @param {string} sub id that will become a composite id prefixed with the components uuid
    * @return {string}
    */
    _getSubId: function(sub)
    {
      /** @type {?} */
      var id = this.element.attr("id");
      if (oj.StringUtils.isEmptyOrUndefined(id))
        id = this["uuid"];
      return [id, sub].join("_");
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _surrogateRemoveHandler: function()
    {
      var element = this.element;
      element.remove();
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {!Object.<oj.PopupService.EVENT, function(...)>}
    */
    _getPopupServiceEvents: function()
    {
      if (!this._popupServiceEvents)
      {
        /** @type {!Object.<oj.PopupService.EVENT, function(...)>} **/
        var events = this._popupServiceEvents = {};
        events[oj.PopupService.EVENT.POPUP_CLOSE] = $.proxy(this._closeImplicitly, this);
        events[oj.PopupService.EVENT.POPUP_REMOVE] = $.proxy(this._surrogateRemoveHandler, this);
        events[oj.PopupService.EVENT.POPUP_REFRESH] = $.proxy(this.refresh, this);
    }
      return this._popupServiceEvents;
    },
   /**
    * @memberof! oj.ojPopup
    * @instance
    * @private
    * @return {void}
    */
    _closeImplicitly: function()
    {
      this._ignoreBeforeCloseResultant = true;
      this.close();
      delete this._ignoreBeforeCloseResultant;
    }
  });

  // sets the default modality option from the current theme
  oj.Components.setDefaultOptions(
  {
    'ojPopup':
    {
      'modality': oj.Components.createDynamicPropertyGetter(
      function()
      {
        return oj.ThemeUtils.getOptionDefaultMap("popup")["modality"];
      })
    }
  });
}

// Fragments:

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
 *       <td>Outside popup or launcher</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Close the popup.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p>Disabled items do not allow any touch interaction.
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojPopup
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
 *       <td rowspan = "3">Focus within Popup</td>
 *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
 *       <td>Navigate the content of the popup. Close the open popup if there are no tab stops in the popup.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F6</kbd></td>
 *       <td>Move focus to the launcher for a popup with modeless modality.  Close the open popup if the modality is modal.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Close the open popup.</td>
 *     </tr>
 *     <tr>
 *       <td rowspan = "1">Popup Launcher</td>
 *       <td><kbd>F6</kbd></td>
 *       <td>Move focus to the first tab stop within the open popup.  If there is not a tab stop within the
 *           content, focus is established on the popup.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojPopup
 */
());
});
