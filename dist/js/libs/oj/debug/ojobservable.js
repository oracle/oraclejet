/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define([], function()
{
  "use strict";

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
var BehaviorSubject = function (value) {
    this.observers = [];
    this._value = value;
};
BehaviorSubject.prototype.subscribe = function (onNextOrSubscriber, onError, onComplete) {
    let subscriber = onNextOrSubscriber;
    if (typeof subscriber === "function") {
        subscriber = {
            next: onNextOrSubscriber,
            error: onError,
            complete: onComplete
        };
    }
    else if (typeof subscriber !== "object") {
        subscriber = {};
    }
    this.observers.push(subscriber);
    let subscription = new SubjectSubscription(this, subscriber);
    if (subscription && !subscription.closed) {
        subscriber.next(this._value);
    }
    return subscription;
};
BehaviorSubject.prototype.next = function (value) {
    this._value = value;
    let { observers } = this;
    let len = observers.length;
    let copy = observers.slice();
    for (let i = 0; i < len; i++) {
        copy[i].next(value);
    }
    ;
};
var SubjectSubscription = function (subject, subscriber) {
    this.subject = subject;
    this.subscriber = subscriber;
    this.closed = false;
};
SubjectSubscription.prototype.unsubscribe = function () {
    if (this.closed) {
        return;
    }
    this.closed = true;
    let subject = this.subject;
    let observers = subject.observers;
    this.subject = null;
    if (!observers || observers.length === 0) {
        return;
    }
    let subscriberIndex = observers.indexOf(this.subscriber);
    if (subscriberIndex !== -1) {
        observers.splice(subscriberIndex, 1);
    }
};
SubjectSubscription.prototype.closed = function () {
    return this.closed;
};

  return {'BehaviorSubject': BehaviorSubject};
});