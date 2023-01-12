/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojkeysetimpl'], function (KeySetImpl) { 'use strict';

    KeySetImpl = KeySetImpl && Object.prototype.hasOwnProperty.call(KeySetImpl, 'default') ? KeySetImpl['default'] : KeySetImpl;

    class ojSet {
        constructor(initialKeys) {
            this.initialKeys = initialKeys;
            const self = this;
            this._set = new Set();
            this._keyset = new KeySetImpl();
            if (initialKeys) {
                initialKeys.forEach(function (key) {
                    self.add(key);
                });
            }
            Object.defineProperty(this, 'size', {
                get() {
                    return this._set.size;
                }
            });
            this[Symbol.iterator] = function () {
                return this._set[Symbol.iterator]();
            };
        }
        clear() {
            this._set.clear();
            this._keyset._keys.clear();
        }
        delete(key) {
            const theKey = this._keyset.get(key);
            if (theKey === this._keyset.NOT_A_KEY) {
                return false;
            }
            this._keyset._keys.delete(theKey);
            return this._set.delete(theKey);
        }
        forEach(callbackfn, thisArg) {
            this._set.forEach(callbackfn, thisArg);
        }
        keys() {
            return this._set.keys();
        }
        values() {
            return this._set.values();
        }
        entries() {
            return this._set.entries();
        }
        has(key) {
            return this._keyset.has(key);
        }
        add(key) {
            const theKey = this._keyset.get(key);
            if (theKey === this._keyset.NOT_A_KEY) {
                this._keyset._keys.add(key);
                this._set.add(key);
            }
            return this;
        }
        get [(Symbol.iterator, Symbol.toStringTag)]() {
            return Set[Symbol.toStringTag]();
        }
    }

    return ojSet;

});
