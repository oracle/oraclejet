/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery'], 
       function(oj, $)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve jQuery UI Touch Punch 0.2.3
 *
 * Copyright 2011-2014, Dave Furfero
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */

/**
 * Utility class for proxying touch events for a given element and mapping them to mouse events
 * @constructor
 * @ignore
 */
oj._TouchProxy  = function(elem)
{
  this._init(elem);
}

/**
 * Initializes the TouchProxy instance
 * 
 * @param {Object} elem
 * @private
 */
oj._TouchProxy.prototype._init = function (elem)
{
  this._elem = elem;

  this._touchHandled = false;
  this._touchMoved = false;

  //add touchListeners
  this._touchStartHandler = $.proxy(this._touchStart, this);
  this._touchEndHandler = $.proxy(this._touchEnd, this);
  this._touchMoveHandler = $.proxy(this._touchMove, this);

  this._elem.on({
    "touchstart": this._touchStartHandler,
    "touchend": this._touchEndHandler,
    "touchmove": this._touchMoveHandler,
    "touchcancel": this._touchEndHandler
  });

};

oj._TouchProxy.prototype._destroy = function ()
{
  if (this._elem && this._touchStartHandler) {
    this._elem.off({
      "touchstart": this._touchStartHandler,
      "touchmove": this._touchMoveHandler,
      "touchend": this._touchEndHandler,
      "touchcancel": this._touchEndHandler
    });

    this._touchStartHandler = undefined;
    this._touchEndHandler = undefined;
    this._touchMoveHandler = undefined;
  }
};

/**
 * Simulate a mouse event based on a corresponding touch event
 * @param {Object} event A touch event
 * @param {string} simulatedType The corresponding mouse event
 *
 * @private
 */
oj._TouchProxy.prototype._touchHandler = function (event, simulatedType)
{
  // Ignore multi-touch events
  if (event.originalEvent.touches.length > 1) {
    return;
  }

  // - contextmenu issues: presshold should launch the contextmenu on touch devices
  if (event.type != "touchstart" && event.type != "touchend")
    event.preventDefault();

  var touch = event.originalEvent.changedTouches[0], 
  simulatedEvent = document.createEvent("MouseEvent");

  // Initialize the simulated mouse event using the touch event's coordinates
  // initMouseEvent(type, canBubble, cancelable, view, clickCount,
  //                screenX, screenY, clientX, clientY, ctrlKey,
  //                altKey, shiftKey, metaKey, button, relatedTarget);
  simulatedEvent.initMouseEvent(simulatedType, true, true, window, 1,
                                touch.screenX, touch.screenY,
                                touch.clientX, touch.clientY, false,
                                false, false, false, 0/*left*/, null);

  touch.target.dispatchEvent(simulatedEvent);
};

/**
 * Handle touchstart events
 * @param {Object} event The element's touchstart event
 *
 * @private
 */
oj._TouchProxy.prototype._touchStart = function (event)
{
  // Ignore the event if already being handled
  if (this._touchHandled)
    return;

  // set the touchHandled flag
  this._touchHandled = true;

  // Track movement to determine if interaction was a click
  this._touchMoved = false;

  // Simulate the mouseover, mousemove and mousedown events
  this._touchHandler(event, "mouseover");
  this._touchHandler(event, "mousemove");
  this._touchHandler(event, "mousedown");
};

/**
 * Handle the touchmove events
 * @param {Object} event The element's touchmove event
 *
 * @private
 */
oj._TouchProxy.prototype._touchMove = function (event)
{
  // Ignore event if not handled
  if (! this._touchHandled) {
    return;
  }

  // Interaction was not a click
  this._touchMoved = true;

  // Simulate the mousemove event
  this._touchHandler(event, "mousemove");
};

/**
 * Handle the touchend events
 * @param {Object} event The element's touchend event
 *
 * @private
 */
oj._TouchProxy.prototype._touchEnd = function (event)
{
  // Ignore event if not handled
  if (! this._touchHandled) {
    return;
  }

  // Simulate the mouseup and mouseout events
  this._touchHandler(event, "mouseup");
  this._touchHandler(event, "mouseout");

  // If the touch interaction did not move, it should trigger a click
  if (! this._touchMoved && event.type == "touchend") {
    // Simulate the click event
    this._touchHandler(event, "click");
  }

  // Unset the flag
  this._touchHandled = false;

};

oj._TouchProxy._TOUCH_PROXY_KEY = "_ojTouchProxy";

oj._TouchProxy.prototype.touchMoved = function()
{
  return this._touchMoved;
};

/**
 * Adds touch event listeners
 * @param {Object} elem
 * @ignore
 */
oj._TouchProxy.addTouchListeners = function(elem)
{
  var jelem = $(elem);
  var proxy = jelem.data(oj._TouchProxy._TOUCH_PROXY_KEY);
  if (! proxy)
  {
    proxy = new oj._TouchProxy(jelem);
    jelem.data(oj._TouchProxy._TOUCH_PROXY_KEY, proxy);
  }

  return proxy;
};

/**
 * Removes touch event listeners
 * @param {Object} elem
 * @ignore
 */
oj._TouchProxy.removeTouchListeners = function(elem)
{
  var jelem = $(elem);
  var proxy = jelem.data(oj._TouchProxy._TOUCH_PROXY_KEY);
  if (proxy)
  {
    proxy._destroy();
    jelem.removeData(oj._TouchProxy._TOUCH_PROXY_KEY);
  }
};



});
