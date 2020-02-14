/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

"use strict";
define(['ojs/ojcore', 'ojs/ojkeysetimpl'],
       /*
        * @param {Object} oj 
        * @param {Object} KeySetImpl
        */
       function(oj, KeySetImpl)
{

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



/* global KeySetImpl:false, Map:false, Symbol:false */
var ojSet =
/*#__PURE__*/
function () {
  function ojSet(initialKeys) {
    _classCallCheck(this, ojSet);

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
      get: function get() {
        return this._set.size;
      }
    });

    this[Symbol.iterator] = function () {
      return this._set[Symbol.iterator]();
    };
  }

  _createClass(ojSet, [{
    key: "clear",
    value: function clear() {
      this._set.clear();

      this._keyset._keys.clear();
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var theKey = this._keyset.get(key);

      if (theKey === this._keyset.NOT_A_KEY) {
        return false;
      }

      this._keyset._keys.delete(theKey);

      return this._set.delete(theKey);
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      this._set.forEach(callbackfn, thisArg);
    }
  }, {
    key: "keys",
    value: function keys() {
      return this._set.keys();
    }
  }, {
    key: "values",
    value: function values() {
      return this._set.values();
    }
  }, {
    key: "entries",
    value: function entries() {
      return this._set.entries();
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._keyset.has(key);
    }
  }, {
    key: "add",
    value: function add(key) {
      var theKey = this._keyset.get(key);

      if (theKey === this._keyset.NOT_A_KEY) {
        this._keyset._keys.add(key);

        this._set.add(key);
      }

      return this;
    }
  }, {
    key: Symbol.toStringTag,
    get: function get() {
      return Set[Symbol.toStringTag]();
    }
  }]);

  return ojSet;
}();

;return ojSet;
});