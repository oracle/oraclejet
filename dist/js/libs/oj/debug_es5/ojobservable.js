/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define([], function()
{
  "use strict";
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/**
 * A behavior subject implementation of observable
 * @class BehaviorSubject
 *
 * @classdesc a internal class behavior subject implementation of observable
 * @constructor
 * @hideconstructor
 * @ojignore
 * @ojtsignore
 * @param {any} value
 * @since 7.0.0
 */
var BehaviorSubject = function BehaviorSubject(value) {
  this.observers = [];
  this._value = value;
};

BehaviorSubject.prototype.subscribe = function (onNextOrSubscriber, onError, onComplete) {
  var subscriber = onNextOrSubscriber;

  if (typeof subscriber === "function") {
    subscriber = {
      next: onNextOrSubscriber,
      error: onError,
      complete: onComplete
    };
  } else if (_typeof(subscriber) !== "object") {
    subscriber = {};
  }

  this.observers.push(subscriber);
  var subscription = new SubjectSubscription(this, subscriber);

  if (subscription && !subscription.closed) {
    subscriber.next(this._value);
  }

  return subscription;
};

BehaviorSubject.prototype.next = function (value) {
  this._value = value;
  var observers = this.observers;
  var len = observers.length;
  var copy = observers.slice();

  for (var i = 0; i < len; i++) {
    copy[i].next(value);
  }

  ;
};

var SubjectSubscription = function SubjectSubscription(subject, subscriber) {
  this.subject = subject;
  this.subscriber = subscriber;
  this.closed = false;
};

SubjectSubscription.prototype.unsubscribe = function () {
  if (this.closed) {
    return;
  }

  this.closed = true;
  var subject = this.subject;
  var observers = subject.observers;
  this.subject = null;

  if (!observers || observers.length === 0) {
    return;
  }

  var subscriberIndex = observers.indexOf(this.subscriber);

  if (subscriberIndex !== -1) {
    observers.splice(subscriberIndex, 1);
  }
};

SubjectSubscription.prototype.closed = function () {
  return this.closed;
};

  return {'BehaviorSubject': BehaviorSubject};
});