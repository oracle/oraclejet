/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const BehaviorSubject = function (value) {
    this.observers = [];
    this._value = value;
};
BehaviorSubject.prototype.subscribe = function (onNextOrSubscriber, onError, onComplete) {
    let subscriber = onNextOrSubscriber;
    if (typeof subscriber === 'function') {
        subscriber = {
            next: onNextOrSubscriber,
            error: onError,
            complete: onComplete
        };
    }
    else if (typeof subscriber !== 'object') {
        subscriber = {};
    }
    this.observers.push(subscriber);
    const subscription = new SubjectSubscription(this, subscriber);
    if (subscription && !subscription.closed) {
        subscriber.next(this._value);
    }
    return subscription;
};
BehaviorSubject.prototype.next = function (value) {
    this._value = value;
    const { observers } = this;
    const len = observers.length;
    const copy = observers.slice();
    for (let i = 0; i < len; i++) {
        copy[i].next(value);
    }
};
const SubjectSubscription = function (subject, subscriber) {
    this.subject = subject;
    this.subscriber = subscriber;
    this.closed = false;
};
SubjectSubscription.prototype.unsubscribe = function () {
    if (this.closed) {
        return;
    }
    this.closed = true;
    const subject = this.subject;
    const observers = subject.observers;
    this.subject = null;
    if (!observers || observers.length === 0) {
        return;
    }
    const subscriberIndex = observers.indexOf(this.subscriber);
    if (subscriberIndex !== -1) {
        observers.splice(subscriberIndex, 1);
    }
};
SubjectSubscription.prototype.closed = function () {
    return this.closed;
};

export { BehaviorSubject, SubjectSubscription };
