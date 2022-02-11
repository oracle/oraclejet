/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojkeysetimpl"],function(e){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;var t=function(t){t?(this._map=t,this._keyset=new e(Array.from(this._map.keys()))):(this._map=new Map,this._keyset=new e)},s=t.prototype;return Object.defineProperty(s,"size",{get:function(){return this._map.size}}),s.clear=function(){this._map.clear(),this._keyset._keys.clear()},s.delete=function(e){var t=this._keyset.get(e);return t!==this._keyset.NOT_A_KEY&&(this._keyset._keys.delete(t),this._map.delete(t))},s.forEach=function(e){this._map.forEach(e)},s.entries=function(){return this._map.entries()},s.keys=function(){return this._map.keys()},s.values=function(){return this._map.values()},s.get=function(e){var t=this._keyset.get(e);return this._map.get(t)},s.has=function(e){return this._keyset.has(e)},s.set=function(e,t){var s=this._keyset.get(e);return s===this._keyset.NOT_A_KEY?(this._keyset._keys.add(e),this._map.set(e,t)):this._map.set(s,t),this},t});
//# sourceMappingURL=ojmap.js.map