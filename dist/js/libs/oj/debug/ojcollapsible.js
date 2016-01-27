/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore'], 
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        */
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/**
 * @ojcomponent oj.ojCollapsible
 * @augments oj.baseComponent
 * @since 0.6
 *
 * @classdesc
 * <h3 id="collapsibleOverview-section">
 *   JET Collapsible Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#collapsibleOverview-section"></a>
 * </h3>
 *
 * <p>Description: Themeable, WAI-ARIA-compliant collapsible with mouse and keyboard interactions for navigation.
 *
 * <p>A JET Collapsible can be created from any valid markup as long as the root element has at least two children: the first element for the header and the second element for the content.
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;div id="collapsible">
 *   &lt;h3>Header 1&lt;/h3>
 *   &lt;p>Content 1&lt;/p>
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
 *
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 *
 * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the collapsible must be <code class="prettyprint">refresh()</code>ed.
 *
 *
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 *
 * <p>The <code class="prettyprint">:oj-collapsible</code> pseudo-selector can be used in jQuery expressions to select JET Collapsible.  For example:
 *
 * <pre class="prettyprint">
 * <code>$( ":oj-collapsible" ) // selects all JET Collapsible on the page
 * $myEventTarget.closest( ":oj-collapsible" ) // selects the closest ancestor that is a JET Collapsible
 * </code></pre>
 *
 *
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 *
 * <ol>
 *   <li>JET Collapsible supports expandArea option: specifies where to click to toggle disclosure. Default is "disclosureIcon", however if a collapsible is inside an Accordion, default is "header"</li>
 * </ol>
 *
 * <p>Also, event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "collapsible".
 *
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 *
 * @desc Creates a JET Collapsible.
 * @example <caption>Initialize the collapsible with no options specified:</caption>
 * $( ".selector" ).ojCollapsible();
 *
 * @example <caption>Initialize the collapsible with some options specified:</caption>
 * $( ".selector" ).ojCollapsible( { "expanded": true } );
 *
 * @example <caption>Initialize the collapsible via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="collapsible" data-bind="ojComponent: { component: 'ojCollapsible', expanded: true}">
 *
 */
(function ()
{
  var uid = 0,
      OPEN_ICON = "oj-collapsible-open-icon",
      CLOSE_ICON = "oj-collapsible-close-icon";

  oj.__registerWidget("oj.ojCollapsible", $['oj']['baseComponent'],
  {
    widgetEventPrefix : "oj",
    options :
    {
      /**
       * Specifies if the content is expanded.
       *
       * @expose
       * @memberof! oj.ojCollapsible
       * @instance
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">expanded</code> option specified:</caption>
       * $( ".selector" ).ojCollapsible( { "expanded": true } );
       *
       * @example <caption>Get or set the <code class="prettyprint">expanded</code> option, after initialization:</caption>
       * // getter
       * var expanded = $( ".selector" ).ojCollapsible( "option", "expanded" );
       *
       * // setter
       * $( ".selector" ).ojCollapsible( "option", "expanded", true );
       */
      expanded : false,

      /**
       * Disables the collapsible if set to <code class="prettyprint">true</code>.
       * @name disabled
       * @memberof! oj.ojCollapsible
       * @instance
       * @type {boolean|null}
       * @default <code class="prettyprint">false</code>
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">disabled</code> option specified:</caption>
       * $( ".selector" ).ojCollapsible( { "disabled": true } );
       *
       * @example <caption>Get or set the <code class="prettyprint">disabled</code> option, after initialization:</caption>
       * // getter
       * var disabled = $( ".selector" ).ojCollapsible( "option", "disabled" );
       *
       * // setter
       * $( ".selector" ).ojCollapsible( "option", "disabled", true );
       */
      disabled: null,

      /**
       * The type of event to expand/collapse the collapsible.
       * To expand the collapsible on hover, use "mouseover".
       *
       * @expose
       * @memberof! oj.ojCollapsible
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"click"</code>
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">expandOn</code> option specified:</caption>
       * $( ".selector" ).ojCollapsible( { "expandOn": "mouseover" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">expandOn</code> option, after initialization:</caption>
       * // getter
       * var expandOn = $( ".selector" ).ojCollapsible( "option", "expandOn" );
       *
       * // setter
       * $( ".selector" ).ojCollapsible( "option", "expandOn", "mouseover" );
       */
      expandOn : "click",

      /**
       * Where in the header to click to toggle disclosure. Valid values: disclosureIcon or header
       *
       * @expose
       * @memberof! oj.ojCollapsible
       * @instance
       * @type {string}
       * @default <code class="prettyprint">"header"</code>
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">expandArea</code> option specified:</caption>
       * $( ".selector" ).ojCollapsible( { "expandArea": "disclosureIcon" } );
       *
       * @example <caption>Get or set the <code class="prettyprint">expandArea</code> option, after initialization:</caption>
       * // getter
       * var expandArea = $( ".selector" ).ojCollapsible( "option", "expandArea" );
       *
       * // setter
       * $( ".selector" ).ojCollapsible( "option", "expandArea", "disclosureIcon" );
       */
      expandArea : "header",

      // callbacks
      /**
       * Triggered immediately before the collapsible is expanded.
       * beforeExpand can be canceled to prevent the content from expanding by returning a false in the event listener.
       *
       * @expose
       * @event
       * @memberof! oj.ojCollapsible
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.header The header that is about to be expanded.
       * @property {jQuery} ui.content The content that is about to be expanded.
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">beforeExpand</code> callback specified:</caption>
       * $( ".selector" ).ojCollapsible({
       *     "beforeExpand": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeexpand</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeexpand", function( event, ui ) {} );
       */
      beforeExpand : null,

      /**
       * Triggered after the collapsible has been expanded (after animation completes).
       *
       * @expose
       * @event
       * @memberof oj.ojCollapsible
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.header The header that was just expanded.
       * @property {jQuery} ui.content The content that was just expanded.
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">expand</code> callback specified:</caption>
       * $( ".selector" ).ojCollapsible({
       *     "expand": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpand</code> event:</caption>
       * $( ".selector" ).on( "ojexpand", function( event, ui ) {} );
       */
      expand : null,

      /**
       * Triggered immediately before the collapsible is collapsed.
       * beforeCollapse can be canceled to prevent the content from collapsing by returning a false in the event listener.
       *
       * @expose
       * @event
       * @memberof! oj.ojCollapsible
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.header The header that is about to be collapsed.
       * @property {jQuery} ui.content The content that is about to be collapsed.
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">beforeCollapse</code> callback specified:</caption>
       * $( ".selector" ).ojCollapsible({
       *     "beforeCollapse": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforecollapse</code> event:</caption>
       * $( ".selector" ).on( "ojbeforecollapse", function( event, ui ) {} );
       */
      beforeCollapse : null,

      /**
       * Triggered after the collapsible has been collapsed.
       *
       * @expose
       * @event
       * @memberof oj.ojCollapsible
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.header The header that was just collapsed.
       * @property {jQuery} ui.content The content that was just collapsed.
       *
       * @example <caption>Initialize the collapsible with the <code class="prettyprint">collapse</code> callback specified:</caption>
       * $( ".selector" ).ojCollapsible({
       *     "collapse": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapse</code> event:</caption>
       * $( ".selector" ).on( "ojcollapse", function( event, ui ) {} );
       */
      collapse : null,

      /**
       * Fired whenever a supported component option changes, whether due to user interaction or programmatic
       * intervention.  If the new value is the same as the previous value, no event will be fired.
       *
       * Currently there is one supported option, <code class="prettyprint">"expanded"</code>.  Additional
       * options may be supported in the future, so listeners should verify which option is changing
       * before taking any action.
       *
       * @expose
       * @event
       * @memberof! oj.ojCollapsible
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {string} ui.option the name of the option that is changing
       * @property {boolean} ui.previousValue the previous value of the option
       * @property {boolean} ui.value the current value of the option
       * @property {Object} ui.optionMetadata information about the option that is changing
       * @property {string} ui.optionMetadata.writeback <code class="prettyprint">"shouldWrite"</code> or
       *           <code class="prettyprint">"shouldNotWrite"</code>.  For use by the JET writeback mechanism.
       *
       */
      optionChange: null

    },

    _ComponentCreate : function ()
    {
      this._super();

      // - Stop using ui-helper-reset in the layout widgets.
      this.element.addClass("oj-collapsible oj-component")

      this._processPanels();
      this._refresh();

      // - collapsible shouldn't implement _init()
      this._initialRender = true;

      //don't fire event on initial render
      var elem = this.element[0];
      this._expandCollapseHandler(
      {
        type : this.options.expanded ? "ojexpand" : "ojcollapse",
        target : elem,
        currentTarget : elem,
        preventDefault : $.noop
      });

      this._initialRender = undefined;

    },

    // Override to set custom launcher
    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
      // Setting the launcher to the "twisty" icon, since that seems to be the only tabbable thing in the collapsible,
      // and it seems to remain tabbable even if the collapsible is disabled.  See the superclass JSDoc for _OpenContextMenu
      // for tips on choosing a launcher.
      this._OpenContextMenu(event, eventType, {"launcher": this.element.find(".oj-collapsible-header-icon").first()});
    },

    _createIcons : function ()
    {
      var options = this.options;
      var icon = (options.expanded ? OPEN_ICON : CLOSE_ICON);
      var iconTag = this._isDisabled() ? $("<span>") : $("<a href='#'>");

      iconTag.addClass("oj-component-icon oj-clickable-icon-nocontext oj-collapsible-header-icon " + icon)
        .attr("aria-labelledby", this.header.attr( "id" ))
        .prependTo(this.header); //@HTMLUpdateOK

    },

    _destroyIcons : function ()
    {
      this.header
        .children(".oj-collapsible-header-icon")
        .remove();
    },

    _destroy : function ()
    {
      this._cleanup();

      // clean up main element
      this.element
        .removeClass("oj-collapsible oj-component oj-expanded oj-collapsed oj-disabled");

      // clean up headers
      if (this._isDisabled())
        this._findFocusables(this.header).removeAttr("tabIndex");

      this.header
        .removeClass("oj-collapsible-header")
        .each(function ()
        {
          if (/^oj-collapsible/.test(this.id))
          {
            this.removeAttribute("id");
          }
        });

      //aria
      var focusable = this._findFirstFocusableInHeader();
      focusable.removeAttr("role")
        .removeAttr("aria-controls")
        .removeAttr("aria-expanded")
        .removeAttr("aria-disabled");

      this._destroyIcons();

      // clean up content panels
      this.content
        .css("display", "")
        .removeAttr("aria-hidden")
        .removeAttr("tabIndex")
        .removeClass("oj-component-content oj-collapsible-content")
        .each(function ()
        {
          if (/^oj-collapsible/.test(this.id))
          {
            this.removeAttribute("id");
          }
        });
    },

    _cleanup : function ()
    {
      //remove listeners
      this._tearDownEvents();

      //remove wrapper
      if (this.content)
      {
        //  - DomUtils.unwrap() will avoid unwrapping if the node is being destroyed by Knockout
        oj.DomUtils.unwrap(this.content);
        this.wrapper = null;
      }
      //TODO: remove oj-disabled

    },

    _isDisabled : function ()
    {
      return this.element.hasClass("oj-disabled");
    },

    _getExpandAreaSelector : function ()
    {
      if (this.options.expandArea == "header")
        return "> .oj-collapsible-header";
      else //disclosureIcon
        return "> .oj-collapsible-header > .oj-collapsible-header-icon";
    },

    _setOption : function (key, value, flags)
    {
      if (key === "expanded")
      {
        if (value === this.options.expanded)
          return;
        this._setExpanded(value);
        return;
      }

      // #5332 - opacity doesn't cascade to positioned elements in IE
      // so we need to add the disabled class to the headers and panels
//TODO: ignore disabled until disabled propagation is supported
      if (key === "disabled")
      {
        this.header
          .add(this.header.next());
        this.element.toggleClass("oj-disabled", !!value);

        // - a collapsible contained within a disabled collapsible appears disabled
        return;
      }

      if (key === "expandOn" || key === "expandArea")
      {
        this._tearDownEvents();
        this._super(key, value, flags);
        this._setupEvents();
      }
      else
      {
        this._super(key, value, flags);
      }

    },

    _keydown : function (event)
    {
      if (event.altKey || event.ctrlKey)
      {
        return;
      }
      var keyCode = $.ui.keyCode;

      switch (event.keyCode)
      {
        case keyCode.SPACE:
        case keyCode.ENTER:
          this._toggleHandler(event);
          break;
      }
    },

    /**
     * Refreshes the visual state of the collapsible. JET components require a <code class="prettyprint">refresh()</code> or re-init after the DOM is
     * programmatically changed underneath the component.
     *
     * <p>This method does not accept any arguments.
     *
     * @expose
     * @memberof! oj.ojCollapsible
     * @instance
     *
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojCollapsible( "refresh" );
     */
    refresh : function ()
    {
      this._super();
      this._cleanup();
      this._processPanels();
      this._destroyIcons();
      this._refresh();
    },

    _processPanels : function ()
    {
      // - Stop using ui-helper-reset in the layout widgets.
      this.header = this.element.children(":first-child")
                      .addClass("oj-collapsible-header");

      this.content = this.header.next()
        .addClass("oj-collapsible-content oj-component-content");

      this.content.wrap("<div></div>"); //@HTMLUpdateOK
      this.wrapper = this.content.parent()
        .addClass("oj-collapsible-wrapper");

      if (this.options.disabled)
        this.element.addClass("oj-disabled");

      //Note: must set tabIndex=-1 to focusable elements
      //to avoid tabbing in a disabled header
      if (this._isDisabled())
      {
        this._findFocusables(this.header)
          .attr("tabIndex",  -1);
      }
    },

    /**
     * Used for explicit cases where the component needs to be refreshed
     * (e.g., when the value option changes or other UI gestures).
     * @private
     */
    _refresh : function ()
    {
      var header = this.header,
          content = this.content,
          options = this.options;

      var collapsibleId = this.collapsibleId =
        "oj-collapsible-" + (this.element.attr("id") || ++uid);

      var headerId = header.attr("id"),
          contentId = content.attr("id");

      if (!headerId)
      {
        headerId = collapsibleId + "-header";
        header.attr("id", headerId);
      }
      if (!contentId)
      {
        contentId = collapsibleId + "-content";
        content.attr("id", contentId);
      }

      //aria
      this._createIcons();
      var focusable = this._findFirstFocusableInHeader();
      focusable.attr("role", "button")
        .attr("aria-controls", contentId)
        .attr("aria-expanded", options.expanded);

      if (this._isDisabled())
      {
        focusable.attr("aria-disabled", "true");
      }

      // - when collapsible is refreshed, it's content displays & disclosure icon collapsed
      if (options.expanded)
      {
        content.removeAttr("aria-hidden");
      }
      else
      {
        this.wrapper.css({
          'max-height': 0,
          'overflow-y': 'hidden',
          'display': 'none'
        });
        this.wrapper.css('max-height', 0);
        content.attr("aria-hidden", "true");
      }

      this._setupEvents();
    },

    _setExpanded : function (expanded)
    {
      if (expanded)
        this.expand(true);
      else
        this.collapse(true);
    },

    _setupEvents : function ()
    {
      var events =
      {
        "keydown" : this._keydown
      };

      var event = this.options.expandOn;
      if (event)
      {
        var self = this ;
        $.each(event.split(" "), function (index, eventName)
        {
          //security test
          if (oj.DomUtils.isValidIdentifier(eventName))
          {
            events[eventName] = self._toggleHandler;
          }
        });
      }

      var expandArea = this.element.find(this._getExpandAreaSelector());

      //add listeners on expandArea (event expandArea)
      this._on(expandArea, events);

      this._on(this.wrapper,
      {
        "transitionend" : this._transitionEndHandler,
        "webkitTransitionEnd" : this._transitionEndHandler,
        "otransitionend" : this._transitionEndHandler,
        "oTransitionEnd" : this._transitionEndHandler
      });

      if (!this._isDisabled())
      {
        this._on(this.element,
        {
          "ojexpand" : this._expandCollapseHandler,
          "ojcollapse" : this._expandCollapseHandler,
          "ojfocus" : this._focusHandler,
          "ojfocusout" : this._focusHandler
        });

        this._hoverable(expandArea);
        this._focusable(expandArea);
        this._activeable(expandArea);

      }
    },

    _tearDownEvents : function ()
    {
      this._off(this.element.find(this._getExpandAreaSelector()));

      //remove wrapper listeners
      if (this.wrapper)
        this._off(this.wrapper);
      this._off(this.element.add(this.content));
    },

    _toggleHandler : function (event)
    {
      if (this._isDisabled() || event.isDefaultPrevented())
        return;

      if (this.options.expanded)
        this.collapse(true, event);
      else
        this.expand(true, event);

      event.preventDefault();
      event.stopPropagation();

      //set focus on the disclosure icon
      this.header.find(".oj-collapsible-header-icon").focus();

    },

    _expandCollapseHandler : function (event)
    {
      if (this._isDisabled())
        return;

      if (event.target !== this.element[0])
        return;

      if (this._initialRender || !event.isDefaultPrevented())
      {
        var element = this.element,
            options = this.options,
            content = this.content,
            wrapper = this.wrapper,
            isExpanded = (event.type === "ojexpand");

        event.preventDefault();

        // - expansion animation on initial render.
        //skip animation
        if (this._initialRender) {

          // - collapsible shouldn't implement _init()
          options.expanded = isExpanded;
          if (isExpanded)
          {
            element.removeClass("oj-collapsed");
            element.addClass("oj-expanded");

            // - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
            oj.Components.subtreeShown(wrapper[0]);
          }
          else
          {
            element.removeClass("oj-expanded");
            element.addClass("oj-collapsed");
            wrapper.css('max-height', 0);
            wrapper.hide();

            // - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
            oj.Components.subtreeHidden(wrapper[0]);
          }
        }
        // do animation
        else
        {
          //fire option change event
          this._changeExpandedOption(isExpanded, event);

          wrapper.contentHeight = wrapper.outerHeight();

          //expanding
          if (isExpanded)
          {
            //James: set display:none on the wrapper when it is hidden and then remove display:none when its is shown.
            //This should trigger JAWS into refreshing the buffer.
            wrapper.show();

            setTimeout(function()
            {
              wrapper.contentHeight += content.outerHeight(); // if closed, add inner height to content height
              wrapper.addClass('oj-collapsible-transition').css(
              {
                'max-height': wrapper.contentHeight
              });
              element.removeClass("oj-collapsed");
              element.addClass("oj-expanded");

              // - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
              oj.Components.subtreeShown(wrapper[0]);

            }, 1);
          }

          //collapsing
          else
          {
            // disable transitions & set max-height to content height
            wrapper.removeClass("oj-collapsible-transition");
            wrapper.css({
              'max-height': wrapper.contentHeight,
              'overflow-y': 'hidden'
            });

            setTimeout(function()
            {
              // enable & start transition
              wrapper.addClass('oj-collapsible-transition')
                .css({
                  'max-height': 0   //!important
                });

              element.removeClass("oj-expanded");
              element.addClass("oj-collapsed");

              // - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
              oj.Components.subtreeHidden(wrapper[0]);

            }, 10); // 10ms timeout is the secret ingredient for disabling/enabling transitions
            // chrome only needs 1ms but FF needs ~10ms or it chokes on the first animation for some reason
          }
        }

        this.header
          .find(".oj-collapsible-header-icon").toggleClass(OPEN_ICON, isExpanded)
            // logic or cause same icon for expanded/collapsed state would remove the oj-icon-class
            .toggleClass(CLOSE_ICON, (! isExpanded || OPEN_ICON === CLOSE_ICON))
          .end();

        //aria
        if (isExpanded)
          this.content.removeAttr("aria-hidden")
        else
          this.content.attr("aria-hidden", "true");

        this._findFirstFocusableInHeader().attr("aria-expanded", isExpanded);

      }
    },

    _focusHandler : function (event)
    {
      if (this._isDisabled())
        return null;

      if (event.type == "ojfocusout")
      {
        this._findFirstFocusableInHeader()
          .attr("tabIndex", -1);

        event.preventDefault();
        event.stopPropagation();
      }
      else if (event.type == "ojfocus")
      {
        this._findFirstFocusableInHeader()
          .attr("tabIndex", 0)
          .focus();
        event.preventDefault();
        event.stopPropagation();
      }
    },

    _findFirstFocusableInHeader : function ()
    {
      return this._findFocusables(this.header).first();
    },

    _findFocusables : function (start)
    {
      //create <span> or <a> depending on if this.isDisabled
      if (this._isDisabled()) {
        return start.find("span");
      }
      return start.find("a,:input");
    },

    /**
     * Expand a collapsible.<p>
     * Note the beforeExpand event will only be fired when vetoable is true.<p>
     * Please use the <code class="prettyprint">expanded</code> option
     * for expanding a collapsible so that it triggers the beforeExpand event:
     * $( ".selector" ).ojCollapsible( "option", "expanded", true );
     *
     * @expose
     * @memberof oj.ojCollapsible
     * @instance
     * @param {boolean} vetoable if event is vetoable
     */
    expand : function (vetoable, event)
    {
      if (this._isDisabled())
        return;

      var eventData =
      {
        /** @expose */
        header : this.header,
        /** @expose */
        content : this.content
      };

      if (!vetoable || this._trigger("beforeExpand", event, eventData) !== false)
      {
        this._trigger("expand", event, eventData);
        //fire option change event in _expandCollapseHandler
//        this._changeExpandedOption(true, event);
      }
    },

    /**
     * Collapse a collapsible.<p>
     * Note the beforeCollapse event will only be fired when vetoable is true.<p>
     * Please use the <code class="prettyprint">expanded</code> option
     * for collapsing a collapsible so that it triggers the beforeCollapse event:
     * $( ".selector" ).ojCollapsible( "option", "expanded", false );
     *
     * @expose
     * @memberof oj.ojCollapsible
     * @instance
     * @param {boolean} vetoable if event is vetoable
     */
    collapse : function (vetoable, event)
    {
      if (this._isDisabled())
        return;

      var eventData =
      {
        /** @expose */
        header : this.header,
        /** @expose */
        content : this.content
      };

      if (!vetoable || this._trigger("beforeCollapse", event, eventData) !== false)
      {
        this._trigger("collapse", event, eventData);
        //fire option change event in _expandCollapseHandler
//        this._changeExpandedOption(false, event);
      }
    },

    _transitionEndHandler : function (event)
    {
      if (this._isDisabled())
        return;

      var propName = event.originalEvent? event.originalEvent.propertyName : null;

      //TODO: fire expand and collapse here
      if (propName == "max-height")
      {
        event.preventDefault();
        event.stopPropagation();
      }

      //just completed a collapse transition
      if (this.options.expanded)
      {
        this.wrapper.css({
          'max-height': 9999,
          'overflow-y': ''
        });
      }
      else
      {
        //James: set display:none on the wrapper when it is hidden and then remove display:none when its is shown.
        //This should trigger JAWS into refreshing the buffer.
        this.wrapper.hide();
      }

      this.wrapper.removeClass("oj-collapsible-transition");
    },

    /**
     * @param {boolean} value
     * @param {Event} originalEvent
     *
     * @private
     */
    _changeExpandedOption: function(value, originalEvent)
    {
      this.option('expanded', value, {'_context': {originalEvent: originalEvent,
                                                   writeback: true,
                                                   internalSet: true}});
    },

    //** @inheritdoc */
    getNodeBySubId: function(locator)
    {
      if (locator == null)
      {
        return this.element ? this.element[0] : null;
      }

      var subId = locator['subId'];

      switch (subId)
      {
      case 'oj-collapsible-content':
        return this.content[0];

      case 'oj-collapsible-header':
        return this.header[0];

      case 'oj-collapsible-disclosure':
      case 'oj-collapsible-header-icon':
        return this.header.find(".oj-collapsible-header-icon")[0];
      }

      // Non-null locators have to be handled by the component subclasses
      return null;
    },

    //** @inheritdoc */
    getSubIdByNode: function(node) {
      var headerIcon = this.getNodeBySubId({'subId':'oj-collapsible-disclosure'});
      var currentNode = node;
      while (currentNode) {
        if (currentNode === this.content[0])
          return {'subId':'oj-collapsible-content'};
        else if (currentNode === this.header[0])
          return {'subId':'oj-collapsible-header'};
        else if (currentNode === headerIcon)
          return {'subId':'oj-collapsible-disclosure'};

        currentNode = currentNode.parentElement;
      }
      return null;
    }

    // Fragments:

    /**
     * <p>Sub-ID for the header of a Collapsible.</p>
     *
     * @ojsubid oj-collapsible-header
     * @memberof oj.ojCollapsible
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the Collapsible header:</caption>
     * var node = $( ".selector" ).ojCollapsible( "getNodeBySubId", {'subId': 'oj-collapsible-header'} );
     */

    /**
     * <p>Sub-ID for the content of a Collapsible.</p>
     *
     * @ojsubid oj-collapsible-content
     * @memberof oj.ojCollapsible
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the Collapsible content:</caption>
     * var node = $( ".selector" ).ojCollapsible( "getNodeBySubId", {'subId': 'oj-collapsible-content'} );
     */

    /**
     * <p>Sub-ID for the disclosure icon of a Collapsible.</p>
     *
     * @ojsubid oj-collapsible-header-icon
     * @memberof oj.ojCollapsible
     * @deprecated this sub-ID is deprecated, please use oj-collapsible-disclosure instead.
     *
     * @example <caption>Get the Collapsible disclosure icon:</caption>
     * var node = $( ".selector" ).ojCollapsible( "getNodeBySubId", {'subId': 'oj-collapsible-header-icon'} );
     */

    /**
     * <p>Sub-ID for the disclosure icon of a Collapsible.</p>
     *
     * @ojsubid oj-collapsible-disclosure
     * @memberof oj.ojCollapsible
     *
     * @example <caption>Get the Collapsible disclosure icon:</caption>
     * var node = $( ".selector" ).ojCollapsible( "getNodeBySubId", {'subId': 'oj-collapsible-disclosure'} );
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
     *       <td>Header</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Toggle disclosure state</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojCollapsible
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
     *       <td>Header</td>
     *       <td><kbd>Space or Enter</kbd></td>
     *       <td>Toggle disclosure state.</tr>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>Disabled items can receive keyboard focus, but do not allow any other interaction.
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojCollapsible
     */

  });

}
());

});
