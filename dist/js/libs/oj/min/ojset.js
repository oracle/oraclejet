/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojkeysetimpl"],function(t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;class e{constructor(e){this.initialKeys=e;const s=this;this._set=new Set,this._keyset=new t,e&&e.forEach(function(t){s.add(t)}),Object.defineProperty(this,"size",{get(){return this._set.size}}),this[Symbol.iterator]=function(){return this._set[Symbol.iterator]()}}clear(){this._set.clear(),this._keyset._keys.clear()}delete(t){const e=this._keyset.get(t);return e!==this._keyset.NOT_A_KEY&&(this._keyset._keys.delete(e),this._set.delete(e))}forEach(t,e){this._set.forEach(t,e)}keys(){return this._set.keys()}values(){return this._set.values()}entries(){return this._set.entries()}has(t){return this._keyset.has(t)}add(t){return this._keyset.get(t)===this._keyset.NOT_A_KEY&&(this._keyset._keys.add(t),this._set.add(t)),this}get[Symbol.toStringTag](){return Set[Symbol.toStringTag]()}}return e});
//# sourceMappingURL=ojset.js.map