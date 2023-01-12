/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import $ from 'jquery';
import oj from 'ojs/ojcore-base';

const _TouchProxy = function (elem) {
  this._init(elem);
};

oj._registerLegacyNamespaceProp('_TouchProxy', _TouchProxy);

/**
 * Initializes the TouchProxy instance
 *
 * @param {Object} elem
 * @private
 */
_TouchProxy.prototype._init = function (elem) {
  this._elem = elem;

  this._touchHandled = false;
  this._touchMoved = false;

  // add touchListeners
  this._touchStartHandler = $.proxy(this._touchStart, this);
  this._touchEndHandler = $.proxy(this._touchEnd, this);
  this._touchMoveHandler = $.proxy(this._touchMove, this);

  this._elem.on({
    touchend: this._touchEndHandler,
    touchcancel: this._touchEndHandler
  });

  // register touchstart & touchmove with passive option
  this._elem[0].addEventListener('touchstart', this._touchStartHandler, { passive: true });
  this._elem[0].addEventListener('touchmove', this._touchMoveHandler, { passive: false });
};

_TouchProxy.prototype._destroy = function () {
  if (this._elem && this._touchStartHandler) {
    this._elem.off({
      touchend: this._touchEndHandler,
      touchcancel: this._touchEndHandler
    });

    // remove touchstart & touchmove registered with passive option
    this._elem[0].removeEventListener('touchstart', this._touchStartHandler, { passive: true });
    this._elem[0].removeEventListener('touchmove', this._touchMoveHandler, { passive: false });

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
_TouchProxy.prototype._touchHandler = function (event, simulatedType) {
  // Ignore multi-touch events
  if (event.originalEvent.touches.length > 1) {
    return;
  }

  //  - contextmenu issues: presshold should launch the contextmenu on touch devices
  if (event.type !== 'touchstart' && event.type !== 'touchend') {
    event.preventDefault();
  }

  var touch = event.originalEvent.changedTouches[0];
  var simulatedEvent = document.createEvent('MouseEvent');

  // Initialize the simulated mouse event using the touch event's coordinates
  // initMouseEvent(type, canBubble, cancelable, view, clickCount,
  //                screenX, screenY, clientX, clientY, ctrlKey,
  //                altKey, shiftKey, metaKey, button, relatedTarget);
  simulatedEvent.initMouseEvent(
    simulatedType,
    true,
    true,
    window,
    1,
    touch.screenX,
    touch.screenY,
    touch.clientX,
    touch.clientY,
    false,
    false,
    false,
    false,
    0 /* left*/,
    null
  );

  touch.target.dispatchEvent(simulatedEvent);
};

/**
 * Handle touchstart events
 * @param {Object} event The element's touchstart event
 *
 * @private
 */
_TouchProxy.prototype._touchStart = function (event) {
  // Ignore the event if already being handled
  if (this._touchHandled) {
    return;
  }

  // set the touchHandled flag
  this._touchHandled = true;

  // Track movement to determine if interaction was a click
  this._touchMoved = false;

  // touchstart is registered with addEventListener but
  // downstream code expects jQuery event
  // eslint-disable-next-line no-param-reassign
  event = $.Event(event);

  // Simulate the mouseover, mousemove and mousedown events
  this._touchHandler(event, 'mouseover');
  this._touchHandler(event, 'mousemove');
  this._touchHandler(event, 'mousedown');
};

/**
 * Handle the touchmove events
 * @param {Object} event The element's touchmove event
 *
 * @private
 */
_TouchProxy.prototype._touchMove = function (event) {
  // Ignore event if not handled
  if (!this._touchHandled) {
    return;
  }

  // Interaction was not a click
  this._touchMoved = true;

  // touchmove is registered with addEventListener but
  // downstream code expects jQuery event
  // eslint-disable-next-line no-param-reassign
  event = $.Event(event);

  // Simulate the mousemove event
  this._touchHandler(event, 'mousemove');
};

/**
 * Handle the touchend events
 * @param {Object} event The element's touchend event
 *
 * @private
 */
_TouchProxy.prototype._touchEnd = function (event) {
  // Ignore event if not handled
  if (!this._touchHandled) {
    return;
  }

  // Simulate the mouseup and mouseout events
  this._touchHandler(event, 'mouseup');
  this._touchHandler(event, 'mouseout');

  // If the touch interaction did not move, it should trigger a click
  if (!this._touchMoved && event.type === 'touchend') {
    // Simulate the click event
    this._touchHandler(event, 'click');
  }

  // Unset the flag
  this._touchHandled = false;
};

_TouchProxy._TOUCH_PROXY_KEY = '_ojTouchProxy';

_TouchProxy.prototype.touchMoved = function () {
  return this._touchMoved;
};

/**
 * Adds touch event listeners
 * @param {Object} elem
 * @ignore
 */
_TouchProxy.addTouchListeners = function (elem) {
  var jelem = $(elem);
  var proxy = jelem.data(_TouchProxy._TOUCH_PROXY_KEY);
  if (!proxy) {
    proxy = new _TouchProxy(jelem);
    jelem.data(_TouchProxy._TOUCH_PROXY_KEY, proxy);
  }

  return proxy;
};

/**
 * Removes touch event listeners
 * @param {Object} elem
 * @ignore
 */
_TouchProxy.removeTouchListeners = function (elem) {
  var jelem = $(elem);
  var proxy = jelem.data(_TouchProxy._TOUCH_PROXY_KEY);
  if (proxy) {
    proxy._destroy();
    jelem.removeData(_TouchProxy._TOUCH_PROXY_KEY);
  }
};
