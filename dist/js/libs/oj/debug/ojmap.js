/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojkeysetimpl'],
/*
* @param {Object} oj 
* @param {Object} KeySetImpl
*/
function(oj, KeySetImpl)
{
  "use strict";

/* global KeySetImpl:false, Map:false */

/**
 * Implementation of the ES6 Map API:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
 * that can deal with how equalities are handled when Object is used as key
 * @ignore
 * @ojtsignore
 * @export
 * @class ojMap
 * @constructor
 * @since 5.2.0
 */
var ojMap = function () {
  this._map = new Map();
  this._keyset = new KeySetImpl();
};

var _proto = ojMap.prototype;

Object.defineProperty(_proto, 'size', {
  get: function () { return this._map.size; }
});

_proto.clear = function () {
  this._map.clear();
  this._keyset._keys.clear();
};

_proto.delete = function (key) {
  var theKey = this._keyset.get(key);
  if (theKey === this._keyset.NOT_A_KEY) {
    return false;
  }
  this._keyset._keys.delete(theKey);
  return this._map.delete(theKey);
};

_proto.forEach = function (callback) {
  this._map.forEach(callback);
};

_proto.get = function (key) {
  var theKey = this._keyset.get(key);
  return this._map.get(theKey);
};

_proto.has = function (key) {
  return this._keyset.has(key);
};

_proto.set = function (key, value) {
  var theKey = this._keyset.get(key);
  if (theKey === this._keyset.NOT_A_KEY) {
    this._keyset._keys.add(key);
    this._map.set(key, value);
  } else {
    // update value
    this._map.set(theKey, value);
  }
  return this;
};

;return ojMap;
});