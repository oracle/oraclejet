/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports'], function (exports) { 'use strict';

  /**
   * Timing related utilities
   * @namespace
   * @name oj.TimerUtils
   * @since 4.1.0
   *
   * @ojtsignore
   */
  const TimerUtils = {};

  /**
   * A Timer encapsulates a Promise associated with a deferred function execution
   * and the ability to cancel the timer before timeout.
   * @interface Timer
   * @ojtsignore
   */
  function Timer() {}
  /**
   * Get the Promise assocaited with this timer.  Promise callbacks will be
   * passed a single boolean value indicating if the timer's timeout expired
   * normally (without being canceled/cleared).  If the timer is left to expire
   * after its configured timeout has been exceeded, then it will pass
   * boolean(true) to the callbacks.  If the timer's {@link Timer#clear} method is
   * called before its configured timeout has been reached, then the callbacks
   * will receive boolean(false).
   * @memberof Timer
   * @return {Promise.<boolean>} This timer's Promise
   */
  Timer.prototype.getPromise = function () {};
  /**
   * Clears the timer and resolves the Promise.  If the normal timeout hasn't
   * yet expired, the value passed to the Promise callbacks will be boolean(false).
   * If the timeout has already expired, this function will do nothing, and all of
   * its Promise callbacks will receive boolean(true).
   * @return {void}
   * @memberof Timer
   */
  Timer.prototype.clear = function () {};

  /**
   * Get a Timer object with the given timeout in milliseconds.  The Promise
   * associated with the timer is resolved when the timeout window expires, or if
   * the clear() function is called.
   * This is useful for when code needs to be executed on timeout (setTimeout) and
   * must handle cleanup tasks such as clearing {@link BusyState} when the timer
   * expires or is canceled.
   *
   * @param  {number} timeout The timeout value in milliseconds to wait before the
   * promise is resolved.
   * @return {Timer}
   * A Timer object which encapsulates the Promise that will be
   * resolved once the timeout has been exceeded or cleared.
   * @export
   * @memberof oj.TimerUtils
   * @alias getTimer
   * @example <caption>Get a timer to execute code on normal timeout and
   * cancelation.  If the timeout occurs normally (not canceled), both
   * callbacks are executed and the value of the 'completed' parameter will be
   * true.</caption>
   * var timer = oj.TimerUtils.getTimer(1000);
   * timer.getPromise().then(function(completed) {
   *     if (completed) {
   *       // Delayed code
   *     }
   *   })
   * timer.getPromise().then(function() {
   *   // Code always to be run
   * })
   *
   * @example <caption>Get a timer to execute code on normal timeout and cancelation.
   * In this example, the timer is canceled before its timeout expires, and the
   * value of the 'completed' parameter will be false.</caption>
   * var timer = oj.TimerUtils.getTimer(1000);
   * timer.getPromise()
   *   .then(function(completed) {
   *     if (completed) {
   *       // Delayed code
   *     }
   *   })
   * timer.getPromise()
   *   .then(function() {
   *     // Code always to be run
   *   })
   * ...
   * timer.clear(); // timer cleared before timeout expires
   */
  TimerUtils.getTimer = function (timeout) {
    return new TimerUtils._TimerImpl(timeout);
  };

  /**
   * @constructor
   * @implements {Timer}
   * @param  {number} timeout The timeout value in milliseconds.
   * @private
   */
  TimerUtils._TimerImpl = function (timeout) {
    var _promise;
    var _resolve;
    var _timerId;

    this.getPromise = function () {
      return _promise;
    };
    this.clear = function () {
      window.clearTimeout(_timerId);
      _timerId = null;
      _timerDone(false);
    };

    /**
     * Called on normal and early timeout (cancelation)
     */
    function _timerDone(completed) {
      _timerId = null;
      _resolve(completed);
    }

    if (typeof window === 'undefined') {
      _promise = Promise.reject();
    } else {
      _promise = new Promise(function (resolve) {
        _resolve = resolve;
        _timerId = window.setTimeout(_timerDone.bind(null, true), timeout); // @HTMLUpdateOK
      });
    }
  };

  const getTimer = TimerUtils.getTimer;

  exports.getTimer = getTimer;

  Object.defineProperty(exports, '__esModule', { value: true });

});
