/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore'], function(oj)
{
  "use strict";


/* global Set:false, Symbol:false */

/**
 * Contains all the core functionalities of KeySet.
 * @param {(Set|Array)=} keys A set of keys to initialize this KeySet with.
 *
 * @ignore
 * @ojtsignore
 * @export
 * @class KeySetImpl
 * @constructor
 * @since 5.1.0
 */
// eslint-disable-next-line no-unused-vars
var KeySetImpl = function KeySetImpl(initialValues) {
  this.NOT_A_KEY = {};
  /**
   * Returns whether the specified key is contained in this set.
   * @private
   * @param {any} key the key to check whether it is contained in this set.
   * @return {boolean} true if the specified key is contained in this set, false otherwise.
   */

  this.has = function (key) {
    return this.get(key) !== this.NOT_A_KEY;
  };
  /**
   * Finds the equavalent key of the specified key within this KeySet.
   * @private
   * @param {any} keyToFind the key to find
   * @return {any} the key in the key that is equivalent to keyToFind, or NO_KEY if nothing equivalent can be found.
   */


  this.get = function (keyToFind) {
    var iterator;
    var key;
    var found = this.NOT_A_KEY;
    var self = this;

    if (this._keys.has(keyToFind)) {
      return keyToFind;
    } // if it's a primitive, then we are done also


    if (!(keyToFind === Object(keyToFind))) {
      return this.NOT_A_KEY;
    } // using iterator if it's supported since we could break at any time


    if (typeof Symbol === 'function' && typeof Set.prototype[Symbol.iterator] === 'function') {
      iterator = this._keys[Symbol.iterator]();
      key = iterator.next();

      while (!key.done) {
        if (oj.KeyUtils.equals(key.value, keyToFind)) {
          return key.value;
        }

        key = iterator.next();
      }
    } else {
      // IE11 supports forEach
      this._keys.forEach(function (_key) {
        if (found === self.NOT_A_KEY && oj.KeyUtils.equals(_key, keyToFind)) {
          found = _key;
        }
      });
    }

    return found;
  };
  /**
   * Initialize the internal Set with a set of keys.
   * @private
   * @param {Set|Array|null|undefined} keys the initial keys to create the internal Set with.
   */


  this.InitializeWithKeys = function (keys) {
    this._keys = new Set(keys);
  };

  this.InitializeWithKeys(initialValues);
};

;return KeySetImpl;
});