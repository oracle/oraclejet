/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'promise', 'ojs/ojcomponentcore', 'ojs/ojanimation'], 
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
       * @deprecated
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
       * $( ".selector" ).on( "ojbeforeexpand", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
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
       * $( ".selector" ).on( "ojexpand", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
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
       * $( ".selector" ).on( "ojbeforecollapse", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
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
       * $( ".selector" ).on( "ojcollapse", function( event, ui ) {
       *      // verify that the component firing the event is a component of interest 
       *      if ($(event.target).is(".mySelector")) {} 
       * } );
       */
      collapse : null

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
      this._expandCollapseHandler(this._createEventObject(elem, 
        this.options.expanded ? "ojexpand" : "ojcollapse"));

      this._initialRender = undefined;

    },

    _createEventObject : function (element, type)
    {
      return {
        type : type,
        target : element,
        currentTarget : element,
        preventDefault : $.noop
      };
    },

    // Override to set custom launcher
    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
      // Setting the launcher to the "twisty" icon, since that seems to be the only tabbable thing in the collapsible,
      // and it seems to remain tabbable even if the collapsible is disabled.  See the superclass JSDoc for _OpenContextMenu
      // for tips on choosing a launcher.
      this._OpenContextMenu(event, eventType, {"launcher": this._getCollapsibleIcon().first()});
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

    _getCollapsibleIcon : function ()
    {
      return this.header.find(".oj-collapsible-header-icon");
    },


    _setOption : function (key, value, flags)
    {
      if (key === "expanded")
      {
        if (value === this.options.expanded)
          return;

        if (value)
          this.expand(true);
        else
          this.collapse(true);
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
        content.attr("aria-hidden", "true");
      }

      this._setupEvents();
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
          "ojfocus" : this._focusHandler,
          "ojfocusout" : this._focusHandler
        });

        this._focusable({
          'element': this._getCollapsibleIcon(),
          'applyHighlight': true
        });

        this._AddHoverable(expandArea);
        this._AddActiveable(expandArea);
      }
    },

    _tearDownEvents : function ()
    {
      var expandArea = this.element.find(this._getExpandAreaSelector());

      this._RemoveHoverable(expandArea);
      this._RemoveActiveable(expandArea);
      this._off(expandArea);

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
      this._getCollapsibleIcon().focus();

    },

    _calcEffectTime: function(jelem) {
      var propertyStr = jelem.css('transitionProperty');
      var delayStr = jelem.css('transitionDelay');
      var durationStr = jelem.css('transitionDuration');
      var propertyArray = propertyStr.split(',');
      var delayArray = delayStr.split(',');
      var durationArray = durationStr.split(',');
      var propertyLen = propertyArray.length;
      var delayLen = delayArray.length;
      var durationLen = durationArray.length;
      var maxTime = 0;
      
      for (var i = 0; i < propertyLen; i++)
      {
        var duration = durationArray[i % durationLen];
        var durationMs = (duration.indexOf('ms') > -1) ? parseFloat(duration) : parseFloat(duration) * 1000;
        if (durationMs > 0)
        {
          var delay = delayArray[i % delayLen];
          var delayMs = (delay.indexOf('ms') > -1) ? parseFloat(delay) : parseFloat(delay) * 1000;

          maxTime = Math.max(maxTime, delayMs + durationMs);
        }
      }

      return maxTime + 100;  
    },

    _resolveTransition : function(wrapper) {
      var self = this;

      this._transitionTimer = setTimeout(function() {
        self._transitionEndHandler();
      }, self._calcEffectTime(wrapper));
    },

    _expandCollapseHandler : function (event)
    {
      if (this._isDisabled())
        return;

      if (event.target !== this.element[0])
        return;

      if (this._initialRender || !event.isDefaultPrevented || !event.isDefaultPrevented())
      {
        var element = this.element,
            options = this.options,
            content = this.content,
            wrapper = this.wrapper,        
            isExpanded = (event.type === "ojexpand");

        var self = this;
        event.preventDefault();

        //fire option change event
        if (! this._initialRender)
         this._changeExpandedOption(isExpanded);

        // - expansion animation on initial render.
        if (this._initialRender || document.hidden ||
            this.element.hasClass("oj-collapsible-skip-animation")) {
          if (! isExpanded)
          {
            wrapper.css('max-height', 0);
            wrapper.hide();
          }
          self._afterExpandCollapse(isExpanded, event);
        }
        // do animation
        else
        {
          wrapper.contentHeight = wrapper.outerHeight();

          // Add a busy state for the animation.  The busy state resolver will be invoked
          // when the animation is completed
          if (! this._animationResolve) 
          {
            var busyContext = oj.Context.getContext(element[0]).getBusyContext();
            this._animationResolve = busyContext.addBusyState(
              {"description" : "The collapsible id='" + 
               this.element.attr('id') + "' is animating."});
          }
          this._transitionEnded = false;

          //expanding
          if (isExpanded)
          {
            //James: set display:none on the wrapper when it is hidden and then 
            // remove display:none when its is shown.
            //This should trigger JAWS into refreshing the buffer.
            wrapper.show();

            setTimeout(function()
            {
              // if closed, add inner height to content height
              wrapper.contentHeight += content.outerHeight(); 

              wrapper.addClass('oj-collapsible-transition')
                .css({
                  'max-height': wrapper.contentHeight
                });
              self._resolveTransition(wrapper);

            }, 0);
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

            // no transition when end state is the same
            if (wrapper.contentHeight == 0) {
              self._transitionEndHandler();
            }
            else {
              setTimeout(function()
              {
                // enable & start transition
                wrapper.addClass('oj-collapsible-transition')
                  .css({
                    'max-height': 0   //!important
                  });
                self._resolveTransition(wrapper);

              }, 20);
            }
          }
        }
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
     * @deprecated
     * @ignore
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
        this._expandCollapseHandler(this._createEventObject(this.element[0], "ojexpand"));
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
     * @deprecated
     * @ignore
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
        this._expandCollapseHandler(this._createEventObject(this.element[0], "ojcollapse"));
      }
    },

    _transitionEndHandler : function (event)
    {
      if (this._transitionTimer) {
        clearTimeout(this._transitionTimer);
        this._transitionTimer = undefined;
      }

      if (this._transitionEnded)
        return;

      if (this._isDisabled())
        return;

      var propName = event && event.originalEvent? event.originalEvent.propertyName : null;
      if (propName == "max-height")
      {
        event.preventDefault();
        event.stopPropagation();

        this._transitionEnded = true;
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
      this._afterExpandCollapse(this.options.expanded, event);

    },

    _afterExpandCollapse : function (isExpanded, event)
    {
      var element = this.element,
          wrapper = this.wrapper;

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

        // - ojcollapsible needs to call oj.components.subtreeshown()/subtreehidden()
        oj.Components.subtreeHidden(wrapper[0]);
      }

      this._getCollapsibleIcon().toggleClass(OPEN_ICON, isExpanded)
      // logic or cause same icon for expanded/collapsed state would remove the oj-icon-class
        .toggleClass(CLOSE_ICON, (! isExpanded || OPEN_ICON === CLOSE_ICON))
        .end();

      //aria
      if (isExpanded)
        this.content.removeAttr("aria-hidden")
      else
        this.content.attr("aria-hidden", "true");

      this._findFirstFocusableInHeader().attr("aria-expanded", isExpanded);

      // resolve/remove the component busy state
      if (this._animationResolve) {
        this._animationResolve();
        this._animationResolve = null;
      }

      var eventData =
      {
        /** @expose */
        header : this.header,
        /** @expose */
        content : this.content
      };

      if (! this._initialRender)
      {
        if (isExpanded) {
           this._trigger("expand", event, eventData);
        }
        else {
          this._trigger("collapse", event, eventData);
        }
      }

    },

    /**
     * @param {boolean} value
     *
     * @private
     */
    _changeExpandedOption: function(value)
    {
      this.option('expanded', value, {'_context': {writeback: true,
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
        return this._getCollapsibleIcon()[0];
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

(function() {
var ojCollapsibleMeta = {
  "properties": {
    "disabled": {
      "type": "boolean"
    },
    "expandArea": {
      "type": "string",
      "enumValues": ["header", "disclosureIcon"]
    },
    "expanded": {
      "type": "boolean",
      "writeback": true
    }
  },
  "events": {
    "beforeCollapse": {},
    "beforeExpand": {},
    "collapse": {},
    "expand": {}
  },
  "extension": {
    _WIDGET_NAME: "ojCollapsible"
  }
};
oj.CustomElementBridge.registerMetadata('oj-collapsible', 'baseComponent', ojCollapsibleMeta);
oj.CustomElementBridge.register('oj-collapsible', {'metadata': oj.CustomElementBridge.getMetadata('oj-collapsible')});
})();
});
