/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'hammerjs', 'promise', 'ojs/ojjquery-hammer', 'ojs/ojcomponentcore'],
       /*
        * @param {Object} oj 
        * @param {jQuery} $
        * @param {Object} Hammer
        */
       function(oj, $, Hammer)
 
{

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @class Utility methods for offcanvas.
 * @since 1.1.0
 * @export
 *
 * @classdesc
 * This class provides functions used for controlling offcanvas regions.  Offcanvas regions can be used in either static (simply displaying and hiding in response to user interactions) or responsive (using media queries to dynamically move application content between the main viewport and offcanvas regions) contexts.  The open, close and toggle methods can be used to directly control the display of an offcanvas region in both the static and responsive cases.  The setupResponsive and tearDownResponsive methods are only needed for responsive usages and are used to add and remove listeners that use the specified media queries to configure the offcanvas in response to changes in browser size.
 * The setupPanToReveal and tearDownPanToReveal methods are used to add and remove listeners neccessary to reveal the offcanvas as user pans on the outer wrapper.
 *
 * <ul>
 * <li>open: show the offcanvas by sliding it into the viewport.</li>
 * <li>close: hide the offcanvas by sliding it out of the viewport.</li>
 * <li>toggle: toggle the offcanvas in or out of the viewport.</li>
 * <li>setupResponsive: setup offcanvas for the responsive layout.</li>
 * <li>tearDownResponsive: remove listeners that were added in setupResponsive.</li>
 * <li>setupPanToReveal: setup offcanvas for pan to reveal.</li>
 * <li>tearDownPantoReveal: remove listeners that were added in setupPanToReveal.</li><br>
 * </ul>
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 *
 *
 * <table class="generic-table events-table">
 *   <thead>
 *     <tr>
 *       <th>Event</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>beforeClose</td>
 *       <td>Triggered immediately before the offcanvas is closed. It can be canceled to prevent the content from closing by returning a false in the event listener.</td>
*       <td>$(".selector").on("ojbeforeclose", function(event, offcanvas) {});</td>
 *     </tr>
 *     <tr>
 *       <td>beforeOpen<br>
 *       <td>Triggered immediately before the offcanvas is open. It can be canceled to prevent the content from opening by returning a false in the event listener.</td>
*       <td>$(".selector").on("ojbeforeopen", function(event, offcanvas) {});</td>
 *     </tr>
 *     <tr>
 *       <td>close<br>
 *       <td>Triggered after the offcanvas has been closed.</td>
*       <td>$(".selector").on("ojclose", function(event, offcanvas) {});</td>
 *     </tr>
 *     <tr>
 *       <td>open<br>
 *       <td>Triggered after the offcanvas has been open (after animation completes).</td>
*       <td>$(".selector").on("ojopen", function(event, offcanvas) {});</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="styling-section">
 *   Styling
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#styling-section"></a>
 * </h3>
 *
 *
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Class(es)</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>oj-offcanvas-outer-wrapper</td>
 *       <td>Applied to the outer most element of the offcanvas.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-offcanvas-inner-wrapper<br>
 *       <td>Applied to the inner wrapper of the offcanvas.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-offcanvas-start<br>
 *       <td>Applied to the offcanvas on the start edge.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-offcanvas-end<br>
 *       <td>Applied to the offcanvas on the end edge.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-offcanvas-top<br>
 *       <td>Applied to the offcanvas on the top edge.</td>
 *     </tr>
 *     <tr>
 *       <td>oj-offcanvas-bottom<br>
 *       <td>Applied to the offcanvas on the bottom edge.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 */
oj.OffcanvasUtils = {};

oj.OffcanvasUtils._DATA_EDGE_KEY = "oj-offcanvasEdge";
oj.OffcanvasUtils._DATA_OFFCANVAS_KEY = "oj-offcanvas";
oj.OffcanvasUtils._DATA_MEDIA_QUERY_KEY = "oj-mediaQueryListener";
oj.OffcanvasUtils._DATA_HAMMER_KEY = "oj-offcanvasHammer";

/**
 * @private
 */
oj.OffcanvasUtils.SELECTOR_KEY = "selector";


oj.OffcanvasUtils.EDGE_START = "start";
oj.OffcanvasUtils.EDGE_END = "end";
oj.OffcanvasUtils.EDGE_TOP = "top";
oj.OffcanvasUtils.EDGE_BOTTOM = "bottom";


/**
 * @private
 */
oj.OffcanvasUtils.DISPLAY_MODE_KEY = "displayMode";
/**
 * @private
 */
oj.OffcanvasUtils.DISPLAY_MODE_PUSH = "push";
/**
 * @private
 */
oj.OffcanvasUtils.DISPLAY_MODE_OVERLAY = "overlay";


/**
 * @private
 */
oj.OffcanvasUtils.MODALITY_KEY = "modality";
/**
 * @private
 */
oj.OffcanvasUtils.MODALITY_NONE = "none";
/**
 * @private
 */
oj.OffcanvasUtils.MODALITY_MODAL = "modal";


/**
 * @private
 */
oj.OffcanvasUtils.DISMISS_HANDLER_KEY = "_dismissHandler";

/**
 * @private
 */
oj.OffcanvasUtils.OPEN_PROMISE_KEY = "_openPromise";

/**
 * @private
 */
oj.OffcanvasUtils.CLOSE_PROMISE_KEY = "_closePromise";

/**
 * @private
 */
oj.OffcanvasUtils.GLASS_PANE_KEY = "_glassPane";

/**
 * @private
 */
oj.OffcanvasUtils.SURROGATE_KEY = "_surrogate";

/**
 * @private
 */
oj.OffcanvasUtils.SURROGATE_ATTR = "data-oj-surrogate-id";

/**
 * @private
 */
oj.OffcanvasUtils.OUTER_WRAPPER_SELECTOR = "oj-offcanvas-outer-wrapper";

/**
 * @private
 */
oj.OffcanvasUtils.OPEN_SELECTOR = "oj-offcanvas-open";

/**
 * @private
 */
oj.OffcanvasUtils.TRANSITION_SELECTOR = "oj-offcanvas-transition";

/**
 * @private
 */
oj.OffcanvasUtils.GLASSPANE_SELECTOR = "oj-offcanvas-glasspane";

/**
 * @private
 */
oj.OffcanvasUtils.GLASSPANE_DIM_SELECTOR = "oj-offcanvas-glasspane-dim";

/**
 * @private
 */
oj.OffcanvasUtils.WRAPPER_GENERATED_SELECTOR = "oj-offcanvas-generated";


oj.OffcanvasUtils._shiftSelector =
{
  "start": "oj-offcanvas-shift-start",
  "end": "oj-offcanvas-shift-end",
  "top": "oj-offcanvas-shift-down",
  "bottom": "oj-offcanvas-shift-up"
};

oj.OffcanvasUtils._drawerSelector =
{
  "start": "oj-offcanvas-start",
  "end": "oj-offcanvas-end",
  "top": "oj-offcanvas-top",
  "bottom": "oj-offcanvas-bottom"
};

oj.OffcanvasUtils._getDisplayMode = function(offcanvas)
{
  var displayMode = offcanvas[oj.OffcanvasUtils.DISPLAY_MODE_KEY];
  if (displayMode !== oj.OffcanvasUtils.DISPLAY_MODE_OVERLAY &&
      displayMode !== oj.OffcanvasUtils.DISPLAY_MODE_PUSH)
  {
    //default displayMode in iOS is push and in android and windows are overlay
    displayMode = oj.ThemeUtils.getOptionDefaultMap("offcanvas")["displayMode"];
  }

  return displayMode;
};

oj.OffcanvasUtils._getDrawer = function(offcanvas)
{
  return $(offcanvas[oj.OffcanvasUtils.SELECTOR_KEY]);
};

oj.OffcanvasUtils._isModal = function(offcanvas)
{
  return offcanvas[oj.OffcanvasUtils.MODALITY_KEY] === oj.OffcanvasUtils.MODALITY_MODAL;
};



//Returns whether the drawer is currently open.
oj.OffcanvasUtils._isOpen = function(drawer)
{
  return drawer.hasClass(oj.OffcanvasUtils.OPEN_SELECTOR);
};

oj.OffcanvasUtils._getOuterWrapper = function(drawer)
{
  return drawer.closest("." + oj.OffcanvasUtils.OUTER_WRAPPER_SELECTOR);
};

//selector
//displayMode
oj.OffcanvasUtils._getAnimateWrapper = function(offcanvas)
{
  var wrapper = oj.OffcanvasUtils._getDrawer(offcanvas);
  return (offcanvas[oj.OffcanvasUtils.DISPLAY_MODE_KEY] === oj.OffcanvasUtils.DISPLAY_MODE_PUSH) ? 
    wrapper.parent() : wrapper;
};


oj.OffcanvasUtils._getShiftSelector = function(edge)
{
  var selector = oj.OffcanvasUtils._shiftSelector[edge];
  if (! selector)
    throw "Invalid edge: " + edge;

  return selector;
};

oj.OffcanvasUtils._isRTL = function()
{
  return oj.DomUtils.getReadingDirection() === "rtl";
};


oj.OffcanvasUtils._setTransform = function(wrapper, transform)
{
  wrapper.css({
    "-webkit-transform": transform,
    "-ms-transform": transform,
    "transform": transform
    });
};

oj.OffcanvasUtils._setTranslationX = function(wrapper, edge, width)
{
  var minus = (edge === oj.OffcanvasUtils.EDGE_END);

  if (oj.OffcanvasUtils._isRTL())
    minus = ! minus;

  //set transform
  oj.OffcanvasUtils._setTransform(wrapper, "translate3d(" + (minus? "-" : "")  + width + ", 0, 0)");

};

oj.OffcanvasUtils._setTranslationY = function(wrapper, edge, height)
{
  var minus = (edge === oj.OffcanvasUtils.EDGE_BOTTOM) ? "-" : "";
  oj.OffcanvasUtils._setTransform(wrapper, "translate3d(0, " + minus + height + ", 0)");

};

oj.OffcanvasUtils._saveEdge = function(offcanvas)
{
  var edge = offcanvas["edge"];
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);

  if (! edge || ! edge.length)
  {
    if (drawer.hasClass("oj-offcanvas-start"))
      edge = oj.OffcanvasUtils.EDGE_START;
    else if (drawer.hasClass("oj-offcanvas-end"))
      edge = oj.OffcanvasUtils.EDGE_END;
    else if (drawer.hasClass("oj-offcanvas-top"))
      edge = oj.OffcanvasUtils.EDGE_TOP;
    else if (drawer.hasClass("oj-offcanvas-bottom"))
      edge = oj.OffcanvasUtils.EDGE_BOTTOM;
    //default to start edge
    else
      edge = oj.OffcanvasUtils.EDGE_START;
  }
  $.data(drawer[0], oj.OffcanvasUtils._DATA_EDGE_KEY, edge);

  return edge;
};

oj.OffcanvasUtils._getEdge = function(drawer)
{
  return $.data(drawer[0], oj.OffcanvasUtils._DATA_EDGE_KEY);
};


//This method is called right before open and after close animation
//selector
//edge
//displayMode
oj.OffcanvasUtils._toggleClass = function(offcanvas, wrapper, isOpen)
{
  var displayMode = offcanvas[oj.OffcanvasUtils.DISPLAY_MODE_KEY],
      drawer = oj.OffcanvasUtils._getDrawer(offcanvas),

      drawerClass = oj.OffcanvasUtils.OPEN_SELECTOR,
      wrapperClass = (displayMode === oj.OffcanvasUtils.DISPLAY_MODE_OVERLAY) ?
                      oj.OffcanvasUtils.TRANSITION_SELECTOR + " oj-offcanvas-overlay" :
                      oj.OffcanvasUtils.TRANSITION_SELECTOR;

  //toggle offcanvas and inner wrapper classes
  if (isOpen)
  {
    var oTabIndex = drawer.attr("tabIndex");
    if (oTabIndex !== undefined)
    {
      //save the original tabIndex
      offcanvas["tabIndex"] = oTabIndex;
    }

    // set tabIndex so the div is focusable
    drawer.addClass(drawerClass)
          .attr("tabIndex", "-1");
    wrapper.addClass(wrapperClass);
  }
  else
  {
    //restore the original tabIndex
    var oTabIndex = offcanvas["tabIndex"];
    if (oTabIndex === undefined)
      drawer.removeAttr("tabIndex");
    else
      drawer.attr("tabIndex", oTabIndex);

    drawer.removeClass(drawerClass);
    wrapper.removeClass(wrapperClass);
  }

};

oj.OffcanvasUtils._isAutoDismiss = function(offcanvas)
{
  return offcanvas["autoDismiss"] != "none";
};

oj.OffcanvasUtils._onTransitionEnd = function(wrapper, handler)
{
  var endEvents = "transitionend webkitTransitionEnd otransitionend oTransitionEnd";
  var listener =
    function ()
    {
      handler();

      //remove handler
      wrapper.off(endEvents, listener);
    };

  //add transition end listener
  wrapper.on(endEvents, listener);

};

//check offcanvas.autoDismiss
//update offcanvas.dismisHandler
oj.OffcanvasUtils._registerCloseHandler = function(offcanvas)
{
  //unregister the old handler if exists
  oj.OffcanvasUtils._unregisterCloseHandler(offcanvas);

  if (oj.OffcanvasUtils._isAutoDismiss(offcanvas))
  {
    var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);

    //save dismisHandler
    var dismisHandler = offcanvas[oj.OffcanvasUtils.DISMISS_HANDLER_KEY] =
      function(event)
      {
        var target = event.target;

        // Ignore mouse events on the scrollbar. FF and Chrome, raises focus events on the
        // scroll container too.
        if (oj.DomUtils.isChromeEvent(event) ||
            ("focus" === event.type && !$(target).is(":focusable")))
          return;

        var key = $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);
        if (key == null)
        {
            // offcanvas already destroyed, unregister the handler
            oj.OffcanvasUtils._unregisterCloseHandler(offcanvas);
            return;
        }

        // if event target is not the offcanvas dom subtrees, dismiss it
        if (! oj.DomUtils.isLogicalAncestorOrSelf(drawer[0], target))
        {
          oj.OffcanvasUtils.close(offcanvas);
        }
      };

    var documentElement = document.documentElement;
    if (oj.DomUtils.isTouchSupported())
      documentElement.addEventListener("touchstart", dismisHandler, true);

    documentElement.addEventListener("mousedown", dismisHandler, true);
    documentElement.addEventListener("focus", dismisHandler, true);
  }

  //register swipe handler
  oj.OffcanvasUtils._registerSwipeHandler(offcanvas);
};

//check offcanvas.autoDismiss
//update offcanvas.dismisHandler
oj.OffcanvasUtils._unregisterCloseHandler = function(offcanvas)
{
  var dismisHandler = offcanvas[oj.OffcanvasUtils.DISMISS_HANDLER_KEY];
  if (dismisHandler) {
    var documentElement = document.documentElement;

    if (oj.DomUtils.isTouchSupported())
      documentElement.removeEventListener("touchstart", dismisHandler, true);

    documentElement.removeEventListener("mousedown", dismisHandler, true);
    documentElement.removeEventListener("focus", dismisHandler, true);
    delete offcanvas[oj.OffcanvasUtils.DISMISS_HANDLER_KEY];

    offcanvas[oj.OffcanvasUtils.DISMISS_HANDLER_KEY] = null;
  }

  //unregister swipe handler
  oj.OffcanvasUtils._unregisterSwipeHandler(offcanvas);

};

oj.OffcanvasUtils._registerSwipeHandler = function(offcanvas)
{
  if (oj.DomUtils.isTouchSupported())
  {
    var selector = offcanvas[oj.OffcanvasUtils.SELECTOR_KEY],
        drawer = $(selector),
        edge = oj.OffcanvasUtils._getEdge(drawer),
        swipeEvent,
        options,
        drawerHammer;

    if ((edge === oj.OffcanvasUtils.EDGE_START && ! oj.OffcanvasUtils._isRTL()) ||
        (edge === oj.OffcanvasUtils.EDGE_END && oj.OffcanvasUtils._isRTL()))
    {
      options = {
        "recognizers": [
          [Hammer.Swipe, {"direction": Hammer["DIRECTION_LEFT"]}]
      ]};

      swipeEvent = "swipeleft";
    }
    else if ((edge === oj.OffcanvasUtils.EDGE_START && oj.OffcanvasUtils._isRTL()) ||
             (edge === oj.OffcanvasUtils.EDGE_END && ! oj.OffcanvasUtils._isRTL()))
    {
      options = {
        "recognizers": [
          [Hammer.Swipe, {"direction": Hammer["DIRECTION_RIGHT"]}]
      ]};

      swipeEvent = "swiperight";
    }
    else if (edge === oj.OffcanvasUtils.EDGE_TOP)
    {
      options = {
        "recognizers": [
          [Hammer.Swipe, {"direction": Hammer["DIRECTION_UP"]}]
      ]};

      swipeEvent = "swipeup";
    }
    else if (edge === oj.OffcanvasUtils.EDGE_BOTTOM)
    {
      options = {
        "recognizers": [
          [Hammer.Swipe, {"direction": Hammer["DIRECTION_DOWN"]}]
      ]};

      swipeEvent = "swipedown";
    }

    drawerHammer = drawer
      .ojHammer(options)
      .on(swipeEvent, function(event)
      {
        event.preventDefault();
        oj.OffcanvasUtils.close(offcanvas);
      });

    //keep the hammer in the offcanvas jquery data
    $.data($(selector)[0], oj.OffcanvasUtils._DATA_HAMMER_KEY,
           {"event": swipeEvent,
            "hammer": drawerHammer
           });
  }
};

oj.OffcanvasUtils._unregisterSwipeHandler = function(offcanvas)
{
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);
  if (drawer.length > 0)
  {
    var dHammer = $.data(drawer[0], oj.OffcanvasUtils._DATA_HAMMER_KEY);
    if (dHammer)
    {
      dHammer["hammer"].off(dHammer["event"]);
    }
  }

};

oj.OffcanvasUtils._afterCloseHandler = function(offcanvas)
{
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);

  //validate offcanvas
  var curOffcanvas = $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);
  if (curOffcanvas !== offcanvas)
    return;

  var edge = oj.OffcanvasUtils._getEdge(drawer),
      wrapper = oj.OffcanvasUtils._getAnimateWrapper(offcanvas);

  //After animation, set display:none and remove transition class
  oj.OffcanvasUtils._toggleClass(offcanvas, wrapper, false);

  //Remove the glassPane if offcanvas is modal
  oj.OffcanvasUtils._removeModality(offcanvas, drawer);

  //unregister dismiss handler
  oj.OffcanvasUtils._unregisterCloseHandler(offcanvas);

  //fire after close event
  drawer.trigger("ojclose", offcanvas);

  //remove data associate with the offcanvas
  $.removeData(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);

};

//Set whether the offcanvas is fixed inside the viewport
oj.OffcanvasUtils._setVisible = function(selector, visible, edge)
{
  var drawer = $(selector);
  visible = !! visible;

  //close the offcanvas without animation if it's open
  if (visible && oj.OffcanvasUtils._isOpen(drawer)) {
    //hide offcanvas without animation
    oj.OffcanvasUtils._close(selector, false);
  }

  //toggle "oj-offcanvas-" + edge class
  drawer.toggleClass(oj.OffcanvasUtils._drawerSelector[edge], ! visible);

};


/**
 * Setup offcanvas for the responsive layout.
 * This method adds a listener based on the media query specified in offcanvas.query.
 * When the media query matches the listener is called and offcanvas behavior is removed.
 * When the media query does not match the listener is called and off canvas behavior is added.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 * @property {string} offcanvas.edge the edge of the offcanvas, valid values are start, end, top, bottom. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
 * @property {string} offcanvas.query the media query determine when the offcanvas is fixed inside the viewport.
 *
 * @see #tearDownResponsive
 *
 * @example <caption>Setup the offcanvas:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer",
 *      "edge": "start",
 *      "query": oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP)
 *    };
 *
 * oj.OffcanvasUtils.setupResponsive(offcanvas);
 *
 */
oj.OffcanvasUtils.setupResponsive = function(offcanvas)
{
  var mqs = offcanvas["query"];
  if (mqs !== null)
  {
    var selector = offcanvas[oj.OffcanvasUtils.SELECTOR_KEY],
        query = window.matchMedia(mqs);

    //save the edge
    var edge = oj.OffcanvasUtils._saveEdge(offcanvas);
    var mqListener = function(event)
    {
      //when event.matches=true fix the offcanvas inside the visible viewport.
      oj.OffcanvasUtils._setVisible(selector, event.matches, edge);
    }

    query.addListener(mqListener);
    oj.OffcanvasUtils._setVisible(selector, query.matches, edge);

    //keep the listener in the offcanvas jquery data
    $.data($(selector)[0], oj.OffcanvasUtils._DATA_MEDIA_QUERY_KEY,
           {"mqList": query,
            "mqListener": mqListener
           });
  }
};

/**
 * Removes the listener that was added in setupResponsive.  Page authors should call tearDownResponsive when the offcanvas is no longer needed.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 * @see #setupResponsive
 *
 * @example <caption>TearDown the offcanvas:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer"
 *    };
 *
 * oj.OffcanvasUtils.tearDownResponsive(offcanvas);
 *
 */
oj.OffcanvasUtils.tearDownResponsive = function(offcanvas)
{
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);
  var mql = $.data(drawer[0], oj.OffcanvasUtils._DATA_MEDIA_QUERY_KEY);
  if (mql)
  {
    mql["mqList"].removeListener(mql["mqListener"]);
    $.removeData(drawer[0], oj.OffcanvasUtils._DATA_MEDIA_QUERY_KEY);
  }
};

/**
 * Shows the offcanvas by sliding it into the viewport.  This method fire an ojbeforeopen event which can be vetoed by attaching a listener and returning false.  If the open is not vetoed, this method will fire an ojopen event once animation has completed.
 *
 *<p>Upon opening an offcanvas, focus is automatically moved to the offcanvas itself.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 * @property {string} offcanvas.edge the edge of the offcanvas, valid values are start, end, top, bottom. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
 * @property {string} offcanvas.displayMode how to show the offcanvas, valid values are push or overlay. Default: defined by theme.
 * @property {string} offcanvas.autoDismiss close behavior, valid values are focusLoss and none. If autoDismiss is default(focusLoss) then any click outside the offcanvas will close it.
 * @property {string} offcanvas.size size width or height of the offcanvas: width if edge is start or end and height if edge is to and bottom. Default to the computed width or height of the offcanvas.
 * @property {string} offcanvas.modality The modality of the offcanvas. Valid values are modal and modeless. Default: modeless. If the offcanvas is modal, interaction with the main content area is disabled like in a modal dialog.
 * @returns {Promise} A promise that is resolved when all transitions have completed. The promise is rejected if the ojbeforeopen event is vetoed.
 * @see #close
 * @see #toggle
 *
 * @example <caption>Slide the offcanvas into the viewport:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer",
 *      "edge": "start",
 *      "displayMode": "overlay",
 *      "size": "200px"
 *    };
 *
 * oj.OffcanvasUtils.open(offcanvas);
 *
 */
oj.OffcanvasUtils.open = function(offcanvas)
{
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);
  var oldOffcanvas = $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);
  if (oldOffcanvas) {
    //if we are in the middle of closing, then return the previous saved promise
    if (oldOffcanvas[oj.OffcanvasUtils.CLOSE_PROMISE_KEY])
      return oldOffcanvas[oj.OffcanvasUtils.CLOSE_PROMISE_KEY];

    //if we are in the middle of opening, then return the previous saved promise
    if (oldOffcanvas[oj.OffcanvasUtils.OPEN_PROMISE_KEY])
      return oldOffcanvas[oj.OffcanvasUtils.OPEN_PROMISE_KEY];
  }

  var promise = new Promise(function(resolve, reject)
  {
    oj.Assert.assertPrototype(drawer, jQuery);

    //save the edge
    var edge = oj.OffcanvasUtils._saveEdge(offcanvas);

    //fire before open event
    var event = $.Event("ojbeforeopen");
    drawer.trigger(event, offcanvas);
    if (event.result === false)
    {
      //TODO: translate
      reject("ojbeforeopen veto");
      return;
    }

    var size,
        displayMode = oj.OffcanvasUtils._getDisplayMode(offcanvas);

    //save a copy of offcanvas object in offcanvas jquery data
    var myOffcanvas = $.extend({}, offcanvas);
    myOffcanvas[oj.OffcanvasUtils.DISPLAY_MODE_KEY] = displayMode;
    $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY, myOffcanvas);

    var wrapper;
    // Option not specifying the push inner wrapper
    //add an inner-wrapper if it doesn't already exist
//    var dparent = drawer.parent();
/*
    if (displayMode === oj.OffcanvasUtils.DISPLAY_MODE_PUSH &&
        dparent.hasClass(oj.OffcanvasUtils.OUTER_WRAPPER_SELECTOR))
    {
      //move classes from the outer to inner wrapper div
      myOffcanvas["_wrapperClass"] = dparent.attr("class");

      var nClazz = myOffcanvas["_wrapperClass"].replace(oj.OffcanvasUtils.OUTER_WRAPPER_SELECTOR, "");
      dparent.removeClass(nClazz);

      // @HTMLUpdateOK
      wrapper = dparent.wrapInner("<div>").children()
        .addClass(nClazz + " oj-offcanvas-inner-wrapper " + oj.OffcanvasUtils.WRAPPER_GENERATED_SELECTOR);
    }
    else
*/
      wrapper = oj.OffcanvasUtils._getAnimateWrapper(myOffcanvas);

    oj.Assert.assertPrototype(wrapper, jQuery);

    //Before animation, remove display:none and add transition class
    oj.OffcanvasUtils._toggleClass(myOffcanvas, wrapper, true);

    if (edge === oj.OffcanvasUtils.EDGE_START || edge === oj.OffcanvasUtils.EDGE_END)
    {
      //if size is missing, outerWidth is used
      size = (size === undefined) ? (drawer.outerWidth(true) + "px") : size;
//      drawer.css("width", size);

      //don't set transform for oj.OffcanvasUtils.DISPLAY_MODE_OVERLAY
      if (displayMode === oj.OffcanvasUtils.DISPLAY_MODE_PUSH)
        oj.OffcanvasUtils._setTranslationX(wrapper, edge, size);
    }
    else
    {
      //if size is missing, outerHeight is used
      size = (size === undefined) ? (drawer.outerHeight(true) + "px") : size;
//      drawer.css("height", size);

      //don't set transform for oj.OffcanvasUtils.DISPLAY_MODE_OVERLAY
      if (displayMode === oj.OffcanvasUtils.DISPLAY_MODE_PUSH)
        oj.OffcanvasUtils._setTranslationY(wrapper, edge, size);
    }

    var outerWrapper;

    //show the drawer
    window.setTimeout(function ()
    {
      outerWrapper = oj.OffcanvasUtils._getOuterWrapper(drawer);
      oj.Assert.assertPrototype( outerWrapper, jQuery);

      outerWrapper.addClass(oj.OffcanvasUtils._getShiftSelector(edge));

    }, 10); //chrome is fine with 0ms but FF needs ~10ms or it wont animate

    //insert a glassPane if offcanvas is modal
    oj.OffcanvasUtils._applyModality(myOffcanvas, drawer);

    //add transition end listener
    oj.OffcanvasUtils._onTransitionEnd(wrapper,
      function ()
      {
        //After animation, remove transition class
        wrapper.removeClass(oj.OffcanvasUtils.TRANSITION_SELECTOR);

        //insert a glassPane if offcanvas is modal
//        oj.OffcanvasUtils._applyModality(myOffcanvas, drawer);

        oj.FocusUtils.focusElement(drawer[0]);

        //fire after open event
        drawer.trigger("ojopen", myOffcanvas);

        // - push and overlay demos don't work in ie11
        //register dismiss handler as late as possible because IE raises focus event
        //on the launcher that will close the offcanvas if autoDismiss is true
        oj.OffcanvasUtils._registerCloseHandler(myOffcanvas);

        resolve(true);
      });
  });


  //save away the current promise
  var nOffcanvas = $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);
  if (nOffcanvas) {
    nOffcanvas[oj.OffcanvasUtils.OPEN_PROMISE_KEY] = promise;
  }
  return promise;
};

/**
 * Hides the offcanvas by sliding it out of the viewport.  This method fires an ojbeforeclose event which can be vetoed by attaching a listener and returning false.  If the close is not vetoed, this method will fire an ojclose event once animation has completed.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 *
 * @returns {Promise} A promise that is resolved when all transitions have completed. The promise is rejected if the ojbeforeclose event is vetoed.
 * @see #open
 * @see #toggle
 *
 * @example <caption>Slide the offcanvas out of the viewport:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer"
 *    };
 *
 * oj.OffcanvasUtils.close(offcanvas);
 *
 */
oj.OffcanvasUtils.close = function(offcanvas)
{
  return oj.OffcanvasUtils._close(offcanvas[oj.OffcanvasUtils.SELECTOR_KEY], true);
};

oj.OffcanvasUtils._close = function(selector, animation)
{
  var drawer = $(selector);

  oj.Assert.assertPrototype(drawer, jQuery);

  var offcanvas = $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);

  //if we are in the middle of closing, then return the previous saved promise
  if (offcanvas && offcanvas[oj.OffcanvasUtils.CLOSE_PROMISE_KEY]) {
    return offcanvas[oj.OffcanvasUtils.CLOSE_PROMISE_KEY];
  }

  var promise = new Promise(function(resolve, reject)
  {
    if (oj.OffcanvasUtils._isOpen(drawer))
    {
      if (selector != offcanvas[oj.OffcanvasUtils.SELECTOR_KEY])
        resolve(true);

      var edge = oj.OffcanvasUtils._getEdge(drawer),
          displayMode = offcanvas[oj.OffcanvasUtils.DISPLAY_MODE_KEY],
          shiftSelector = oj.OffcanvasUtils._getShiftSelector(edge),
          outerWrapper = oj.OffcanvasUtils._getOuterWrapper(drawer);

      oj.Assert.assertPrototype(outerWrapper, jQuery);

      if (! outerWrapper.hasClass(shiftSelector))
        resolve(true);

      //fire before close event
      var event = $.Event("ojbeforeclose");
      drawer.trigger(event, offcanvas);
      if (event.result === false)
      {
        reject("beforeClose veto");
        return;
      }

      var wrapper = oj.OffcanvasUtils._getAnimateWrapper(offcanvas);
      if (animation)
      {
        var rafId = 0;
        var endHandler = function ()
        {
          oj.OffcanvasUtils._afterCloseHandler(offcanvas);
          if (rafId !== 0)
            window.cancelAnimationFrame(rafId);

          resolve(true);
        };

        //request animation frame in case the transition end get lost. 
        //for example: if offcanvas is hidden before transition end
        var checkDetachedHandler = function()
        {
          //if offcanvas is detached, ex: parent display:none
          if (drawer[0].offsetParent == null)
            endHandler();
          else
            rafId = window.requestAnimationFrame(checkDetachedHandler);
        };

        //add transition end listener
        oj.OffcanvasUtils._onTransitionEnd(wrapper, endHandler);

        rafId = window.requestAnimationFrame(checkDetachedHandler);
      }

      //clear transform
      if (displayMode === oj.OffcanvasUtils.DISPLAY_MODE_PUSH) {
        oj.OffcanvasUtils._setTransform(wrapper, "");
      }
      outerWrapper.removeClass(shiftSelector);

      //dim glassPane
      if (oj.OffcanvasUtils._isModal(offcanvas))
        offcanvas[oj.OffcanvasUtils.GLASS_PANE_KEY].removeClass(oj.OffcanvasUtils.GLASSPANE_DIM_SELECTOR);

      if (animation) {
        //Before animation, add transition class
        wrapper.addClass(oj.OffcanvasUtils.TRANSITION_SELECTOR);
      }
      else {
        oj.OffcanvasUtils._afterCloseHandler(offcanvas);
        resolve(true);
      }
    }
    else {
      resolve(true);
    }
  });

  //save away the current promise
  offcanvas = $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY);
  if (offcanvas) {
    offcanvas[oj.OffcanvasUtils.CLOSE_PROMISE_KEY] = promise;
  }

  return promise;
};

/**
 * Toggles the offcanvas in or out of the viewport.  This method simply delegates to the open or close methods as appropriate.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 * @property {string} offcanvas.edge the edge of the offcanvas, valid values are start, end, top, bottom. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
 * @property {string} offcanvas.displayMode how to show the offcanvas, valid values are push or overlay. Default: push
 * @property {string} offcanvas.autoDismiss close behavior, valid values are focusLoss and none. If autoDismiss is default(focusLoss) then any click outside the offcanvas will close it.
 * @property {string} offcanvas.size size width or height of the offcanvas: width if edge is start or end and height if edge is top and bottom. Default to the computed width or height of the offcanvas.
 *
 * @returns {Promise} A promise that is resolved when all transitions have completed
 * @see #open
 * @see #close
 *
 * @example <caption>Toggle the offcanvas in or out of the viewport:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer",
 *      "edge": "start",
 *      "displayMode": "overlay"
 *    };
 *
 * oj.OffcanvasUtils.toggle(offcanvas);
 *
 */
oj.OffcanvasUtils.toggle = function(offcanvas)
{
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);
  oj.Assert.assertPrototype(drawer, jQuery);

  if (oj.OffcanvasUtils._isOpen(drawer)) {
    return oj.OffcanvasUtils.close(offcanvas);
  }
  else {
    return oj.OffcanvasUtils.open(offcanvas);
  }

};


/**
 * Creates an overlay div with the oj-offcanvas-glasspane selector
 * append to the end of the drawer's container
 * @param {!jQuery} drawer the drawer
 * @return {jQuery} the overlay div
 * @private
 */
oj.OffcanvasUtils._addGlassPane = function (drawer)
{
  var overlay = $("<div>");
  overlay.addClass(oj.OffcanvasUtils.GLASSPANE_SELECTOR);
  overlay.attr("role", "presentation");
  overlay.attr("aria-hidden", "true");

  //append glassPane at the end
//  drawer.before(overlay);
  overlay.appendTo(drawer.parent()); // @HTMLUpdateOK
  overlay.on("keydown keyup keypress mousedown mouseup mouseover mouseout click focusin focus",
    function(event)
      {
        event.stopPropagation();
        event.preventDefault();
      });

  return overlay;
};

/**
 * Creates a script element before the target layer bound to the simple jquery UI
 * surrogate component.
 *
 * @param {!jQuery} layer stacking context
 * @return {jQuery}
 * @private
 */
oj.OffcanvasUtils._createSurrogate = function (layer)
{
  var surrogate = $("<script>");
  var layerId = layer.attr("id");

  var surrogateId;
  if (layerId)
  {
    surrogateId = [layerId, "surrogate"].join("_");
    surrogate.attr("id", surrogateId);
  }
  else
  {
    surrogateId = surrogate.uniqueId();
  }
  surrogate.insertBefore(layer); // @HTMLUpdateOK

  // loosely associate the popup to the surrogate element
  layer.attr(oj.OffcanvasUtils.SURROGATE_ATTR, surrogateId);

  return surrogate;
};


/**
 * bring the drawer to the front to keep this order:  mainContent, glassPane, drawer
 * so we don't need to use z-index
 * @private
 */
oj.OffcanvasUtils._swapOrder = function (offcanvas, drawer)
{
  //create a surrogate in front of the mainContent to be used in _restoreOrder
  offcanvas[oj.OffcanvasUtils.SURROGATE_KEY] = oj.OffcanvasUtils._createSurrogate(drawer);

  drawer.appendTo(drawer.parent()); // @HTMLUpdateOK
};


/**
 * restore the order before _swapOrder
 * @private
 */
oj.OffcanvasUtils._restoreOrder = function (offcanvas)
{
  var drawer = oj.OffcanvasUtils._getDrawer(offcanvas);
  var surrogate = offcanvas[oj.OffcanvasUtils.SURROGATE_KEY];

  if (drawer && surrogate && 
      drawer.attr(oj.OffcanvasUtils.SURROGATE_ATTR) === surrogate.attr("id"))
  {
    drawer.insertAfter(surrogate); // @HTMLUpdateOK
    // remove link to the surrogate element
    drawer.removeAttr(oj.OffcanvasUtils.SURROGATE_ATTR);
    surrogate.remove(); // @HTMLUpdateOK
  }

};

/**
 * Apply modality
 * If offcanvas is modal, add a glasspane and keep the dom structure in the following order:
 * mainContent, glassPane and drawer so we don't need to apply z-index
 * @private
 */
oj.OffcanvasUtils._applyModality = function (offcanvas, drawer)
{
  if (oj.OffcanvasUtils._isModal(offcanvas))
  {
    // insert glassPane in front of the mainContent
    offcanvas[oj.OffcanvasUtils.GLASS_PANE_KEY] = oj.OffcanvasUtils._addGlassPane(drawer);

    // bring the drawer <div> to the front
    // to keep this order:  mainContent, glassPane, drawer
    oj.OffcanvasUtils._swapOrder(offcanvas, drawer);

    window.setTimeout(function ()
    {
      offcanvas[oj.OffcanvasUtils.GLASS_PANE_KEY].addClass(oj.OffcanvasUtils.GLASSPANE_DIM_SELECTOR);
    }, 0);
  }
};

/**
 * Remove modality
 * If offcanvas is modal, remove glasspane and restore the dom element orders
 * @private
 */
oj.OffcanvasUtils._removeModality = function (offcanvas, drawer)
{
  if (oj.OffcanvasUtils._isModal(offcanvas))
  {
    offcanvas[oj.OffcanvasUtils.GLASS_PANE_KEY].remove();
    // restore the order
    oj.OffcanvasUtils._restoreOrder(offcanvas);
  }
};

/**
 * Setup offcanvas for pan to reveal.
 * This method adds a touch listener to handle revealing the offcanvas as user pans on the outer wrapper.  The following events are fired by this method:
 * ojpanstart - fired when pan to reveal gesture initiated by the user.  The event includes the direction and distance of the pan.  If it is vetoed
 *              then pan to reveal is terminated
 * ojpanmove  - fired as user continues the pan gesture.  The event includes the direction and distance of the pan.
 * ojpanend   - fired when pan to reveal gesture ends.  The event includes the direction and distance of the pan.  If it is vetoed then the offcanvas
 *              will be closed.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 * @property {string=} offcanvas.edge the edge of the offcanvas, valid values are start, end. This property is optional if the offcanvas element has a "oj-offcanvas-" + <edge> class specified.
 * @property {string=} offcanvas.size size width of the offcanvas.  Default to the computed width of the offcanvas.
 *
 * @see #tearDownPanToReveal
 *
 * @example <caption>Setup the offcanvas:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer"
 *    };
 *
 * oj.OffcanvasUtils.setupPanToReveal(offcanvas);
 *
 */
oj.OffcanvasUtils.setupPanToReveal = function(offcanvas)
{
    var drawer, size, outerWrapper, wrapper, mOptions, proceed, direction, ui, evt, delta, edge, endEvents, listener;

    if ($(offcanvas).attr("oj-data-pansetup") != null)
    {
        // already setup
        return;
    }

    // mark as setup
    $(offcanvas).attr("oj-data-pansetup", "true");

    // pan to reveal only works for push display mode, so enforce it
    offcanvas["displayMode"] = "push";

    drawer = oj.OffcanvasUtils._getDrawer(offcanvas);

    // need the size to display the canvas when release
    size = offcanvas["size"];
    if (size == null)
    {
        size = drawer.outerWidth();
    }

    outerWrapper = oj.OffcanvasUtils._getOuterWrapper(drawer);
    wrapper = oj.OffcanvasUtils._getAnimateWrapper(offcanvas);

    //use hammer for swipe
    mOptions = {
       "recognizers": [
       [Hammer.Pan, { "direction": Hammer["DIRECTION_HORIZONTAL"] }]
    ]};

    // flag to signal whether pan to reveal should proceed
    proceed = false;

    $(outerWrapper)
    .ojHammer(mOptions)
    .on("panstart", function(event) 
    {
        direction = null;

        switch (event['gesture']['direction'])
        {
            case Hammer["DIRECTION_LEFT"]:
                // diagonal case
                if (Math.abs(event['gesture']['deltaY']) < Math.abs(event['gesture']['deltaX']))
                {
                    direction = oj.OffcanvasUtils._isRTL() ? "end" : "start";
                }
                break;
            case Hammer["DIRECTION_RIGHT"]:
                // diagonal case
                if (Math.abs(event['gesture']['deltaY']) < Math.abs(event['gesture']['deltaX']))
                {
                    direction = oj.OffcanvasUtils._isRTL() ? "start" : "end";
                }
                break;
        }

        if (direction == null)
        {
            return;
        }
 
        ui = {"direction": direction, "distance": Math.abs(event['gesture']['deltaX'])};
        evt = $.Event("ojpanstart");
        drawer.trigger(evt, ui);

        if (!evt.isDefaultPrevented())
        {
            // make sure it's in closed state
            offcanvas["_closePromise"] = null;

            // sets the appropriate offcanvas class
            oj.OffcanvasUtils._toggleClass(offcanvas, wrapper, true);
            proceed = true;

            // stop bubbling
            event.stopPropagation();
        }
    })
    .on("panmove", function(event) 
    {
        // don't do anything if start is vetoed
        if (!proceed)
        {
            return;
        }

        delta = Math.abs(event['gesture']['deltaX']);

        drawer.css("width", delta);

        // don't do css transition animation while panning
        wrapper.removeClass(oj.OffcanvasUtils.TRANSITION_SELECTOR);
        oj.OffcanvasUtils._setTranslationX(wrapper, "start", event['gesture']['deltaX']+"px"); 

        ui = {"direction": direction, "distance": delta};
        evt = $.Event("ojpanmove");
        drawer.trigger(evt, ui);

        // stop bubbling
        event.stopPropagation();
    })
    .on("panend", function(event) 
    {
        // don't do anything if start is vetoed
        if (!proceed)
        {
            return;
        }

        // reset flag
        proceed = false;

        delta = Math.abs(event['gesture']['deltaX']);
        ui = {"distance": delta};
        evt = $.Event("ojpanend");
        drawer.trigger(evt, ui);

        // stop bubbling
        event.stopPropagation();

        if (!evt.isDefaultPrevented())
        {
            wrapper.addClass(oj.OffcanvasUtils.TRANSITION_SELECTOR);
            drawer.css("width", size+"px");

            edge = offcanvas["edge"];
            if (edge == null)
            {
                if (drawer.hasClass("oj-offcanvas-start"))
                {
                    edge = "start";
                }
                else
                {
                    edge = "end";
                }
            }

            oj.OffcanvasUtils._setTranslationX(wrapper, edge, size+"px"); 

            $.data(drawer[0], oj.OffcanvasUtils._DATA_OFFCANVAS_KEY, offcanvas);
            $.data(drawer[0], oj.OffcanvasUtils._DATA_EDGE_KEY, edge);

            oj.OffcanvasUtils._registerCloseHandler(offcanvas);

            return;
        }

        // close the toolbar
        endEvents = "transitionend webkitTransitionEnd otransitionend oTransitionEnd";
        listener = function ()
        {
            // reset offcanvas class
            oj.OffcanvasUtils._toggleClass(offcanvas, wrapper, false);

            wrapper.removeClass(oj.OffcanvasUtils.TRANSITION_SELECTOR);

            //remove handler
            wrapper.off(endEvents, listener);
        };

        // add transition end listener
        wrapper.on(endEvents, listener);

        // restore item position
        wrapper.addClass(oj.OffcanvasUtils.TRANSITION_SELECTOR);
        oj.OffcanvasUtils._setTranslationX(wrapper, "start", "0px"); 
    });
};

/**
 * Removes the listener that was added in setupPanToReveal.  Page authors should call tearDownPanToReveal when the offcanvas is no longer needed.
 *
 * @export
 * @param {Object} offcanvas An Object contains the properties in the following table.
 * @property {string} offcanvas.selector JQ selector identifying the offcanvas
 * @see #setupPanToReveal
 *
 * @example <caption>TearDown the offcanvas:</caption>
 *    var offcanvas = {
 *      "selector": "#startDrawer"
 *    };
 *
 * oj.OffcanvasUtils.tearDownPanToReveal(offcanvas);
 *
 */
oj.OffcanvasUtils.tearDownPanToReveal = function(offcanvas)
{
    var drawer, outerWrapper;

    drawer = oj.OffcanvasUtils._getDrawer(offcanvas);
    outerWrapper = oj.OffcanvasUtils._getOuterWrapper(drawer);

    // remove all listeners
    $(outerWrapper).off("panstart panmove panend");
};
});
