/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore'], function(oj)
{
var EventTargetMixin = /** @class */ (function () {
    function EventTargetMixin() {
    }
    EventTargetMixin.prototype.addEventListener = function (eventType, listener) {
        if (!this._eventListeners) {
            this._eventListeners = [];
        }
        this._eventListeners.push({
            'type': eventType.toLowerCase(),
            'listener': listener
        });
    };
    ;
    EventTargetMixin.prototype.removeEventListener = function (eventType, listener) {
        if (this._eventListeners) {
            var i = void 0;
            for (i = this._eventListeners.length - 1; i >= 0; i--) {
                if (this._eventListeners[i]['type'] == eventType &&
                    this._eventListeners[i]['listener'] == listener) {
                    this._eventListeners.splice(i, 1);
                }
            }
        }
    };
    ;
    EventTargetMixin.prototype.dispatchEvent = function (evt) {
        if (this._eventListeners) {
            var i, returnValue;
            //clone the eventListeners to isolate mutations that may occur during dispatching events
            var eventListeners = this._eventListeners.slice(0);
            for (i = 0; i < eventListeners.length; i++) {
                var eventListener = eventListeners[i];
                if (evt &&
                    evt.type &&
                    eventListener['type'] == evt.type.toLowerCase()) {
                    returnValue = eventListener['listener'].apply(this, [evt]);
                    if (returnValue === false) {
                        // event cancelled
                        return false;
                    }
                }
            }
        }
        return true;
    };
    ;
    EventTargetMixin.applyMixin = function (derivedCtor) {
        var baseCtors = [EventTargetMixin];
        baseCtors.forEach(function (baseCtor) {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(function (name) {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
    };
    return EventTargetMixin;
}());
oj.EventTargetMixin = EventTargetMixin;

var GenericEvent = /** @class */ (function () {
    function GenericEvent(type, options) {
        this.type = type;
        this.options = options;
        if (options != null) {
            this['detail'] = options['detail'];
        }
    }
    return GenericEvent;
}());
oj.GenericEvent = GenericEvent;

});