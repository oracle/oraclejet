/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojcollapsible'], 
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
 * @ojcomponent oj.ojAccordion
 * @augments oj.baseComponent
 * @since 0.6
 * 
 * @classdesc
 * <h3 id="accordionOverview-section">
 *   JET Accordion Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accordionOverview-section"></a>
 * </h3>
 * 
 * <p>Description: Themeable, WAI-ARIA-compliant accordion with mouse and keyboard interactions for navigation.
 * 
 * <p>A JET Accordion can be created from any valid markup as long as the root element has one or more child elements and 
 * each child element must have two children: the first element for the header and the second element for the content.
 * 
 * <pre class="prettyprint">
 * <code>
 * &lt;div id="accordion">
 *   &lt;div id="c1">
 *     &lt;h3>
 *       &lt;img src="images/default.png"/>
 *       &lt;span>Header 1&lt;/span>
 *     &lt;/h3>
 *     &lt;p>Content 1.&lt;/p>
 *   &lt;/div>
 *   &lt;div id="c3" data-bind="ojComponent: {component: 'ojAccordion', expanded:true}">
 *     &lt;h3>Header 3&lt;/h3>
 *     &lt;p>Content 3&lt;/p>
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
 * 
 * <h3 id="rtl-section">
 *   Reading direction
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
 * </h3>
 * 
 * <p>As with any JET component, in the unusual case that the directionality (LTR or RTL) changes post-init, the accordion must be <code class="prettyprint">refresh()</code>ed.
 * 
 * 
 * <h3 id="pseudos-section">
 *   Pseudo-selectors
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pseudos-section"></a>
 * </h3>
 * 
 * <p>The <code class="prettyprint">:oj-accordion</code> pseudo-selector can be used in jQuery expressions to select JET Accordion.  For example:
 * 
 * <pre class="prettyprint">
 * <code>$( ":oj-accordion" ) // selects all JET Accordion on the page
 * $myEventTarget.closest( ":oj-accordion" ) // selects the closest ancestor that is a JET Accordion
 * </code></pre>
 * 
 * 
 * <h3 id="jqui2jet-section">
 *   JET for jQuery UI developers
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#jqui2jet-section"></a>
 * </h3>
 * 
 * <p>Also, event names for all JET components are prefixed with "oj", instead of component-specific prefixes like "collapsible".  
 * 
 * <h3 id="theming-section">Theming</h3>
 * <p>Details about the include and import mechanisms described below can be found in the 
 * Theming chapter of the JET documentation.</p>
 * <ul>
 * <li>Include Mechanism Variable: <code>$includeAccordionClasses</code>
 * <pre class="prettyprint">
 * <code>$includeAllClasses: false;
 * $includeAccordionClasses: true;
 * &#64;import "scss/oj/v1.0.1/alta/oj-alta";
 * </code></pre>
 * </li>
 * <li>Import Mechanism File: 
 * <code>scss/oj/[VERSION]/[THEME NAME]/widgets/_oj.[THEME NAME].accordion.scss</code> 
 * <pre class="prettyprint">
 * <code>&#64;import "scss/oj/v1.0.1/alta/oj.alta.variables";
 * &#64;import "scss/oj/v1.0.1/alta/widgets/oj.alta.accordion";
 * </code></pre></li>
 * </ul>
 * 
 * <!-- - - - - Above this point, the tags are for the class.
 *              Below this point, the tags are for the constructor (initializer). - - - - - - -->
 * 
 * @desc Creates a JET Accordion. 
 * @example <caption>Initialize the accordion with no options specified:</caption>
 * $( ".selector" ).ojAccordion();
 * 
 * @example <caption>Initialize the accordion with some options specified:</caption>
 * $( ".selector" ).ojAccordion( { "multiple": true } );
 * 
 * @example <caption>Initialize the accordion via the JET <code class="prettyprint">ojComponent</code> binding:</caption>
 * &lt;div id="accordion" data-bind="ojComponent: { component: 'ojAccordion', multiple: true}">
 * 
 */
(function ()
{
  oj.__registerWidget("oj.ojAccordion", $['oj']['baseComponent'], 
  {
    widgetEventPrefix : "oj", 
    options : 
    {
      /** 
       * Allow multiple collapsibles to be open at the same time. 
       * Note: if multiple is true, the beforeCollapse/beforeExpand/collapse/expand events will not be fired by the accordion. They are however fired by the collapsibles.
       *
       * @expose 
       * @memberof! oj.ojAccordion
       * @instance
       * @type {boolean}
       * @default <code class="prettyprint">false</code>
       *
       * @example <caption>Initialize the accordion with the <code class="prettyprint">multiple</code> option specified:</caption>
       * $( ".selector" ).ojAccordion( { "multiple": true } );
       * 
       * @example <caption>Get or set the <code class="prettyprint">multiple</code> option, after initialization:</caption>
       * // getter
       * var multiple = $( ".selector" ).ojAccordion( "option", "multiple" );
       * 
       * // setter
       * $( ".selector" ).ojAccordion( "option", "multiple", true );
       */
      multiple : false,

      /** 
       * Array contains either ids or zero-based indices of the collapsibles that should be expanded.<p>
       * Setter value: array of either ids or indices.<p>
       * Getter value: array of either ids or indices. If an expanded collapsible has a page author provided id, that id is returned, otherwise that collapsible's index will be returned.
       *
       * @expose 
       * @memberof! oj.ojAccordion
       * @instance
       * @type {Array}
       * @default <code class="prettyprint">null</code>
       *
       * Note: expanded is default to null<p>
       * which means that accordion doesn't modify the state on the collapsible children.<p>
       * If specified, it overrides the children expanded setting.
       *
       * @example <caption>Initialize the accordion with the 
       * <code class="prettyprint">expanded</code> option specified:</caption>
       * $( ".selector" ).ojAccordion( { "expanded": ["collapsible1Div"] } );
       * 
       * @example <caption>Get or set the <code class="prettyprint">expanded</code> 
       * option after initialization:</caption>
       * // getter
       * var expanded = $( ".selector" ).ojAccordion( "option", "expanded" );
       * 
       * // setter
       * $( ".selector" ).ojAccordion( "option", "expanded", ["collapsible1Div"] );
       */
      expanded : null, 

      // callbacks
      /**
       * Triggered immediately before any collapsible in the accordion is expanded.
       * beforeExpand can be canceled to prevent the content from expanding by returning a false in the event listener.
       * If multiple is true, the beforeExpand event will not be fired by the accordion.
       *
       * @expose 
       * @event 
       * @memberof! oj.ojAccordion
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.toCollapsible The collapsible being expanded.
       * @property {jQuery} ui.fromCollapsible The collapsible being collapsed. 
       * 
       * @example <caption>Initialize any collapsible in the accordion with the <code class="prettyprint">beforeExpand</code> callback specified:</caption>
       * $( ".selector" ).ojAccordion({
       *     "beforeExpand": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforeexpand</code> event:</caption>
       * $( ".selector" ).on( "ojbeforeexpand", function( event, ui ) {} );
       */
      beforeExpand : null,

      /**
       * Triggered after the accordion has been expanded (after animation completes).
       * The expand can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
       * If multiple is true, the expand event will not be fired by the accordion.
       *
       * @expose 
       * @event 
       * @memberof! oj.ojAccordion
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.toCollapsible The collapsible being expanded.
       * @property {jQuery} ui.fromCollapsible The collapsible being collapsed. 
       * 
       * @example <caption>Initialize the accordion with the <code class="prettyprint">expand</code> callback specified:</caption>
       * $( ".selector" ).ojAccordion({
       *     "expand": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojexpand</code> event:</caption>
       * $( ".selector" ).on( "ojexpand", function( event, ui ) {} );
       */
      expand : null, 

      /**
       * Triggered immediately before any collapsible in the accordion is collapsed.
       * beforeCollapse can be canceled to prevent the content from collapseing by returning a false in the event listener.
       * If multiple is true, the beforeCollapse event will not be fired by the accordion.
       *
       * @expose 
       * @event 
       * @memberof! oj.ojAccordion
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.toCollapsible The collapsible being expanded.
       * @property {jQuery} ui.fromCollapsible The collapsible being collapsed. 
       * 
       * @example <caption>Initialize any collapsible in the accordion with the <code class="prettyprint">beforeCollapse</code> callback specified:</caption>
       * $( ".selector" ).ojAccordion({
       *     "beforeCollapse": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojbeforecollapse</code> event:</caption>
       * $( ".selector" ).on( "ojbeforecollapse", function( event, ui ) {} );
       */
      beforeCollapse : null,

      /**
       * Triggered after any collapsible in the accordion has been collapsed (after animation completes).
       * The collapse can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
       * If multiple is true, the collapse event will not be fired by the accordion.
       *
       * @expose 
       * @event 
       * @memberof! oj.ojAccordion
       * @instance
       * @property {Event} event <code class="prettyprint">jQuery</code> event object
       * @property {Object} ui Parameters
       * @property {jQuery} ui.toCollapsible The collapsible being expanded.
       * @property {jQuery} ui.fromCollapsible The collapsible being collapsed. 
       * 
       * @example <caption>Initialize any collapsible in the accordion with the <code class="prettyprint">collapse</code> callback specified:</caption>
       * $( ".selector" ).ojAccordion({
       *     "collapse": function( event, ui ) {}
       * });
       *
       * @example <caption>Bind an event listener to the <code class="prettyprint">ojcollapse</code> event:</caption>
       * $( ".selector" ).on( "ojcollapse", function( event, ui ) {} );
       */
      collapse : null

    },

    _ComponentCreate : function ()
    {
      this._super();
      // - Stop using ui-helper-reset in the layout widgets.
      this.element
        .addClass("oj-accordion oj-component")
        //aria
        .attr("role", "group");

      // - accordion expanded opt. val doesn't overrides its collaspsible expanded opt.
      this.options.expanded = this._expandedIndexToId(this.options.expanded);
      this._refresh();
    },

    // Override to set custom launcher
    _NotifyContextMenuGesture: function(menu, event, eventType)
    {
      // Setting the launcher to the "twisty" icon of the first collapsible in the accordion, since those twisties seem to be 
      // the only tabbable things in the accordion, and they seem to remain tabbable even if the collapsible is disabled.
      // Component owner should feel free to specify a different launcher if appropriate, e.g. could specify the "current" 
      // twisty rather than the first if desired.  See the superclass JSDoc for _OpenContextMenu for tips on choosing a launcher.
      this._OpenContextMenu(event, eventType, {"launcher": this.element.find(".oj-collapsible-header-icon").first()});
    },
    
    _destroy : function ()
    {
      // clean up main element
      this.element
        .removeClass("oj-accordion oj-component")
        .removeAttr("role");

      this.element.children()
        .removeClass("oj-accordion-collapsible");

      //remove collapsibles created by accordion
      this.element.children(".oj-accordion-created")
        .removeClass("oj-accordion-created")
        .ojCollapsible("destroy");
    },

    _setOption : function (key, value, flags)
    {
      var self = this;

      if (key === "multiple")
      {
        // Transition multiple to single.
        // Keep the first expanded one expanded and collapse the rest.
        if (value == false && this.options.multiple == true)
        {
          // - when "multiple" option value is changed to false, exception is displayed
          this.element.children(".oj-expanded")
            .first().siblings(".oj-collapsible")
            .ojCollapsible("collapse", false);
        }
      }
      else if (key === "expanded")
      {
        this._setExpandedOption(value);
        return;
      }

      this._super(key, value, flags);

//TODO: ignore disabled until disabled propagation is supported
/*
      if (key === "disabled")
      {
        value = !!value;

        if (value) {
          this.collapsibles.each(function ()
          {
            //TODO: Don't override if collapsible has disabled set
            if ($(this).ojCollapsible("option", key) == null)
              $(this).ojCollapsible("option", key, value);
          });
        }
        this.element.toggleClass("oj-disabled", value);
      }
*/
    },

    /**
     * Refreshes the visual state of the accordion. JET components require a <code class="prettyprint">refresh()</code> or re-init after the DOM is 
     * programmatically changed underneath the component.
     * 
     * <p>This method does not accept any arguments.
     * 
     * @expose 
     * @memberof! oj.ojAccordion
     * @instance
     * 
     * @example <caption>Invoke the <code class="prettyprint">refresh</code> method:</caption>
     * $( ".selector" ).ojAccordion( "refresh" );
     */
    refresh : function ()
    {
      this._super();
      this._refresh();
    },

    _refresh : function ()
    {
      this._makeCollapsible();

      //need to propagate the option to the collapsible children
      this._setOption("disabled", this.options.disabled);

      this._internalSetExpanded = true;
      this._setOption("expanded", this.options.expanded);
      this._internalSetExpanded = false;

      this._setupEvents();
    },

    _makeCollapsible : function ()
    {
      this.element.children(":oj-collapsible")
        .each(function ()
        {
          $(this).ojCollapsible("option", "expandArea", "header");
        });

      this.collapsibles = 
        this.element.children()
          .not(":oj-ojCollapsible")
            .ojCollapsible(
            {
              expandArea : "header"
            })
            .addClass("oj-accordion-created")
          .end()
          .addClass("oj-accordion-collapsible");
    },

    _setupEvents : function ()
    {
      var events = 
      {
        "keydown" : this._keydown, 
        "ojbeforeexpand" : this._beforeExpandHandler, 
        "ojexpand" : this._expandHandler,
        "ojbeforecollapse" : this._beforeCollapseHandler, 
        "ojcollapse" : this._collapseHandler
      };

      this._off(this.collapsibles);
      this._on(this.collapsibles, events);
    },

    _keydown : function (event)
    {
      if (event.altKey || event.ctrlKey)
        return;

      //ignore event if target is not a header
//TODO:
//      if ($(event.target).parentsUntil(event.currentTarget)[0] !== 
//          $(event.currentTarget).children()[0])
      if (! ($(event.target).hasClass("oj-collapsible-header")) &&
          ! ($(event.target).hasClass("oj-collapsible-header-icon")))
        return;

      var keyCode = $.ui.keyCode, 
          enabledCollapsibles = this.collapsibles.not(".oj-disabled"), 
          length = enabledCollapsibles.length, 
          target = $(event.target).closest(".oj-collapsible"), 
          currentIndex = enabledCollapsibles.index(target), 
          toFocus = false;

      if (currentIndex >= 0)
      {
        switch (event.keyCode)
        {
          case keyCode.RIGHT:
          case keyCode.DOWN:
            toFocus = enabledCollapsibles[(currentIndex + 1) % length];
            break;
          case keyCode.LEFT:
          case keyCode.UP:
            toFocus = enabledCollapsibles[(currentIndex - 1 + length) % length];
            break;
          case keyCode.HOME:
            toFocus = enabledCollapsibles[0];
            break;
          case keyCode.END:
            toFocus = enabledCollapsibles[length - 1];
            break;
        }
      }

      if (toFocus)
      {
        if (target)
        {
          $(target).trigger("ojfocusout");
        }
        $(toFocus).trigger("ojfocus");

        event.preventDefault();
      }
    },

    /* 
     * For single expansion
     *   returns a list of expanded collapsible widgets that are sibling 
     *   of the current event target
     * For multiple expansion
     *   returns an empty set.
     */
    _findTargetSiblings : function (event)
    {
      if (! this.options.multiple)
      {
        var closestCollapsible = $(event.target).closest(".oj-collapsible");

        if (closestCollapsible.parent().is(":oj-ojAccordion"))
          return closestCollapsible
            .siblings(".oj-collapsible.oj-expanded")
            .map(function()
            {
              return $(this).data("oj-ojCollapsible");
            });
      }
      return $();
    },

    /* 
     * Trigger "beforeCollapse" on all expanded siblings in
     * the before expand handler
     */
    _beforeExpandHandler : function (event, eventData)
    {
      if (! this._isTargetMyCollapsible(event))
        return true;

      var result, self = this;
      var newData;

      this._findTargetSiblings(event).each(function()
      {
        var collapsible = this.element;
        newData = self._initEventData(collapsible, $(event.target));

        var beforeCollapsedData = {
          /** @expose */
          header : collapsible.find(".oj-collapsible-header"),

          /** @expose */
          content : collapsible.find(".oj-collapsible-content")
        };

        result = this._trigger("beforeCollapse", event, beforeCollapsedData);
        return result;
      });

      if (! newData)
        newData = self._initEventData(null, $(event.target));

      if (! this.options.multiple)
        this._trigger("beforeExpand", event, newData);

      return result;
    },

    /* 
     * Collapse all expanded siblings and don't allow cancel
     */
    _expandHandler : function (event, eventData)
    {
      // - accordion expanded opt. val doesn't overrides its collaspsible expanded opt.
      //don't handle event during setExpandedOption
      if (! this._isTargetMyCollapsible(event) || this._duringSetExpandedOption)
        return;

      var newData;
      var self = this;

      this._findTargetSiblings(event).each(function ()
      {
        this.collapse(false, event, eventData);
        newData = self._initEventData(this.element, $(event.target));
      });

      if (! newData)
        newData = self._initEventData(null, $(event.target));

      if (! this.options.multiple)
        this._trigger("expand", event, newData);

      this._updateExpanded();

    },

    /* 
     * Trigger "beforecollapse" on all collapsed siblings in
     * the before collapse handler
     */
    _beforeCollapseHandler : function (event, eventData)
    {
      if (this._isTargetMyCollapsible(event) &&
          ! this.options.multiple)
      {
        return this._trigger("beforeCollapse", event, 
                             this._initCollapseEventData(event, eventData));
      }
      return true;
    },

    /* 
     * Collapse all collapsed siblings and don't allow cancel
     */
    _collapseHandler : function (event, eventData)
    {
      // - accordion expanded opt. val doesn't overrides its collaspsible expanded opt.
      //don't handle event during setExpandedOption
      if (! this._duringSetExpandedOption && this._isTargetMyCollapsible(event))
      {
        var newData = this._initCollapseEventData(event, eventData);

        if (! this.options.multiple)
          this._trigger("collapse", event, newData);

        this._updateExpanded();
      }
    },

    _initEventData : function (fromC, toC)
    {
      var eventData =
      {
        /** @expose */
        fromCollapsible : fromC, //the collapsible being collapsed.
        /** @expose */
        toCollapsible : toC      //the collapsible being expanded.
      };

      return eventData;
    },

    _initCollapseEventData : function (event, eventData)
    {
      var newData;
      if (eventData.toCollapsible)
      {
        newData = eventData;
      }
      else
      {
        if (event.originalEvent && event.originalEvent.target)
        {
          var collapsible = $(event.originalEvent.target);
          if (collapsible.hasClass("oj-collapsible"))
          {
            newData = this._initEventData($(event.target), collapsible);
          }
        }
        if (! newData)
          newData = this._initEventData($(event.target), null);
      }

      return newData;
    },

    /*
     * To filter out events from the nested accordion
     */
    _isTargetMyCollapsible : function (event)
    {
      return $(event.target).is(this.collapsibles);
    },

    _updateExpanded : function ()
    {
      var cid;
      var result = [];
      this.collapsibles.each(function (index)
      {
        //push collapsible id if provided, otherwise index
        if ($(this).ojCollapsible("option", "expanded"))
        {
          cid = $(this).attr("id");
          result.push(cid ? cid : index);
        }
      });

      // - accordion expanded opt. val doesn't overrides its collaspsible expanded opt.
      if (! oj.Object._compareSet(this.options.expanded, result))
        this.option('expanded', result, {'_context': {internalSet: true, writeback: true}});
    },

    // - accordion expanded opt. val doesn't overrides its collaspsible expanded opt.
    //Return a new sorted expanded array contains IDs if they are available
    _expandedIndexToId: function(expanded)
    {
      if (Array.isArray(expanded))
      {
        var id, newExp = []

        this.element.children().each (function (index)
        {
          id = $(this).attr("id");
          // use ID if available
          if (id)
          {
            if (expanded.indexOf(id) != -1)
              newExp.push(id);
            else if (expanded.indexOf(index) != -1)
              newExp.push(id);
          }
          // use index if ID not available
          else if (expanded.indexOf(index) != -1)
          {
            newExp.push(index);
          }
        });

        //if more than one expanded, keep the last collapsible
        if (! this.options.multiple && newExp.length > 1)
          newExp = [newExp[newExp.length-1]];

        return newExp;
      }

      return null;
    },

    _setExpandedOption: function(expanded)
    {
      //sort expanded array if it's from external setOption
      if (! this._internalSetExpanded)
        expanded = this._expandedIndexToId(expanded);
    
      // parent override children expanded setting
      if (expanded)
      {
        //loop thru collapsibles to collapse/expand based on expandedList
        var self = this,
            child,
            childId,
            parentExp,
            iexp = 0;

        this.collapsibles.each(function (index)
        {
          child = $(this);
          childId = child.attr("id");

          parentExp = false;
          if (childId) {
            if (childId == expanded[iexp])
              parentExp = true;
          }
          else {
            if (index == expanded[iexp])
              parentExp = true;
          }
          if (parentExp)
            iexp++;

          // - accordion expanded opt. val doesn't overrides its collaspsible expanded opt.
          //when the parent override the child setting:
          //1) log a warning
          //2) set child's expanded option with the writeback flag.
          if (child.ojCollapsible("option", "expanded") !== parentExp) {
            oj.Logger.warn("JET Accordion: override collapsible " + index + " expanded setting");

            //don't fire accordion "exanded" optionChange event here 
            self._duringSetExpandedOption = true;
            child.ojCollapsible("option", "expanded", parentExp);
            self._duringSetExpandedOption = false;
          }
        });
      }

      this._updateExpanded();
    },

    //** @inheritdoc */
    getNodeBySubId: function(locator)
    {
      if (locator == null)
      {
        return this.element ? this.element[0] : null;
      }

      var subId = locator['subId'],
          index = locator['index'];

      if ((typeof index !== 'number') ||
          index < 0 || index >= this.collapsibles.length)
        return null;

      var collapsible = this.collapsibles[index];

      switch (subId)
      {
      case 'oj-accordion-content':
        subId = 'oj-collapsible-content';
        break;

      case 'oj-accordion-header':
        subId = 'oj-collapsible-header';
        break;

      case 'oj-accordion-disclosure':
      case 'oj-accordion-header-icon':
        subId = 'oj-collapsible-disclosure';
        break;

      case 'oj-accordion-collapsible':
        return collapsible;

      default:
        // Non-null locators have to be handled by the component subclasses
        return null;
      }
      return $(collapsible).ojCollapsible("getNodeBySubId", {"subId": subId});
    },

    //** @inheritdoc */
    getSubIdByNode: function(node) {
      // First, find which collapsible the node is a descendant of
      var collapsibleIndex = -1;
      var currentNode = node;
      while (currentNode) {
        collapsibleIndex = Array.prototype.indexOf.call(this.collapsibles, currentNode);
        if (collapsibleIndex != -1)
          break;
        currentNode = currentNode.parentElement;
      }
      var subId = null;
      // Then, find the subId from the collapsible
      if (collapsibleIndex != -1) {
        var collapsibleSubId = $(this.collapsibles[collapsibleIndex]).ojCollapsible("getSubIdByNode", node);
        collapsibleSubId = collapsibleSubId ? collapsibleSubId : {};
        switch (collapsibleSubId['subId']) {
          case 'oj-collapsible-content':
            subId = 'oj-accordion-content';
            break;
          case 'oj-collapsible-header':
            subId = 'oj-accordion-header';
            break;
          case 'oj-collapsible-disclosure':
          case 'oj-collapsible-header-icon':
            subId = 'oj-accordion-disclosure';
            break;
          default:
            subId = 'oj-accordion-collapsible';
        }
      }
      if (subId) {
        return {'subId':subId, 'index': collapsibleIndex};
      }
      return null;
    }

    // Fragments:

    /**
     * <p>Sub-ID for the specified Collapsible within an Accordion.</p>
     *
     * @property {number} index The zero-based index of the Collapsible.
     *
     * @ojsubid oj-accordion-collapsible
     * @memberof oj.ojAccordion
     * @deprecated This sub-ID is not needed.
     *
     * @example <caption>Get the second Collapsible:</caption>
     * var node = $( ".selector" ).ojAccordion( "getNodeBySubId", {'subId': 'oj-accordion-collapsible', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the specified header within an Accordion.</p>
     *
     * @property {number} index The zero-based index of the header.
     *
     * @ojsubid oj-accordion-header
     * @memberof oj.ojAccordion
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the second header:</caption>
     * var node = $( ".selector" ).ojAccordion( "getNodeBySubId", {'subId': 'oj-accordion-header', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the specified content section within an Accordion.</p>
     *
     * @property {number} index The zero-based index of the content section.
     *
     * @ojsubid oj-accordion-content
     * @memberof oj.ojAccordion
     * @deprecated This sub-ID is not needed.  Since the application supplies this element, it can supply a unique ID by which the element can be accessed.
     *
     * @example <caption>Get the second content section:</caption>
     * var node = $( ".selector" ).ojAccordion( "getNodeBySubId", {'subId': 'oj-accordion-content', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the specified disclosure icon within an Accordion.</p>
     *
     * @property {number} index The zero-based index of the disclosure icon.
     *
     * @ojsubid oj-accordion-header-icon
     * @memberof oj.ojAccordion
     * @deprecated this sub-ID is deprecated, please use oj-accordion-disclosure instead.
     *
     * @example <caption>Get the second disclosure icon:</caption>
     * var node = $( ".selector" ).ojAccordion( "getNodeBySubId", {'subId': 'oj-accordion-header-icon', 'index': 1} );
     */

    /**
     * <p>Sub-ID for the specified disclosure icon within an Accordion.</p>
     *
     * @property {number} index The zero-based index of the disclosure icon.
     *
     * @ojsubid oj-accordion-disclosure
     * @memberof oj.ojAccordion
     *
     * @example <caption>Get the second disclosure icon:</caption>
     * var node = $( ".selector" ).ojAccordion( "getNodeBySubId", {'subId': 'oj-accordion-disclosure', 'index': 1} );
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
     *       <td>Collapsible header</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Toggle disclosure state.</tr>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojAccordion
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
     *       <td>Collapsible header</td>
     *       <td><kbd>Space or Enter</kbd></td>
     *       <td>Toggle disclosure state.</tr>
     *     </tr>
     *     <tr>
     *       <td>Collapsible header</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Navigate to next collapsible header and if none then the next component on page.</td>
     *     </tr>
     *     <tr>
     *       <td>Collapsible header</td>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>Navigate to previous collapsible header and if none then the previous component on page.</td>
     *     </tr>
     *     <tr>
     *       <td>Collapsible header</td>
     *       <td><kbd>UpArrow or LeftArrow</kbd> (<kbd>RightArrow</kbd> in RTL)</td>
     *       <td>Move focus to the previous collapsible header with wrap around.</tr>
     *     </tr>
     *     <tr>
     *       <td>Collapsible header</td>
     *       <td><kbd>DownArrow or RightArrow</kbd> (<kbd>LeftArrow</kbd> in RTL)</td>
     *       <td>Move focus to the next collapsible header with wrap around.</tr>
     *     </tr>
     *     <tr>
     *       <td>Collapsible header</td>
     *       <td><kbd>Home</kbd></td>
     *       <td>Move focus to the first collapsible header.</tr>
     *     </tr>
     *     <tr>
     *       <td>Collapsible header</td>
     *       <td><kbd>End</kbd></td>
     *       <td>Move focus to the last collapsible header.</tr>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>Disabled items can receive keyboard focus, but do not allow any other interaction.
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojAccordion
     */

  });
}
());
});
