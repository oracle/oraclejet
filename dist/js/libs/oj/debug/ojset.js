/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'ojs/ojkeysetimpl'],
       /*
        * @param {Object} oj 
        * @param {Object} KeySetImpl
        */
       function(oj, KeySetImpl)
{

/* global KeySetImpl:false, Map:false, Symbol:false */
var ojSet = /** @class */ (function () {
    function ojSet(initialKeys) {
        this.initialKeys = initialKeys;
        var self = this;
        this._set = new Set();
        this._keyset = new KeySetImpl();
        if (initialKeys) {
            initialKeys.forEach(function (key) {
                self.add(key);
            });
        }
        Object.defineProperty(this, 'size', {
            get: function () { return this._set.size; }
        });
        this[Symbol.iterator] = function () {
            return this._set[Symbol.iterator]();
        };
    }
    ojSet.prototype.clear = function () {
        this._set.clear();
        this._keyset._keys.clear();
    };
    ;
    ojSet.prototype.delete = function (key) {
        var theKey = this._keyset.get(key);
        if (theKey === this._keyset.NOT_A_KEY) {
            return false;
        }
        this._keyset._keys.delete(theKey);
        return this._set.delete(theKey);
    };
    ;
    ojSet.prototype.forEach = function (callbackfn, thisArg) {
        this._set.forEach(callbackfn, thisArg);
    };
    ;
    ojSet.prototype.keys = function () {
        return this._set.keys();
    };
    ;
    ojSet.prototype.values = function () {
        return this._set.values();
    };
    ;
    ojSet.prototype.entries = function () {
        return this._set.entries();
    };
    ;
    ojSet.prototype.has = function (key) {
        return this._keyset.has(key);
    };
    ;
    ojSet.prototype.add = function (key) {
        var theKey = this._keyset.get(key);
        if (theKey === this._keyset.NOT_A_KEY) {
            this._keyset._keys.add(key);
            this._set.add(key);
        }
        return this;
    };
    ;
    Object.defineProperty(ojSet.prototype, Symbol.toStringTag, {
        get: function () {
            return Set[Symbol.toStringTag]();
        },
        enumerable: true,
        configurable: true
    });
    ;
    return ojSet;
}());

;return ojSet;
});