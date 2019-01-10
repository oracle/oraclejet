/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore"],function(t){return function(i){this.NOT_A_KEY={},this.has=function(t){return this.get(t)!==this.NOT_A_KEY},this.get=function(i){var e,n,s=this.NOT_A_KEY,o=this;if(this._keys.has(i))return i;if(i!==Object(i))return this.NOT_A_KEY;if("function"==typeof Symbol&&"function"==typeof Set.prototype[Symbol.iterator])for(n=(e=this._keys[Symbol.iterator]()).next();!n.done;){if(t.KeyUtils.equals(n.value,i))return n.value;n=e.next()}else this._keys.forEach(function(e){s===o.NOT_A_KEY&&t.KeyUtils.equals(e,i)&&(s=e)});return s},this.InitializeWithKeys=function(t){this._keys=this._populate(t)},this._populate=function(t){var i=new Set(t);return null!=t&&0===i.size&&t.forEach(function(t){i.add(t)}),i},this.InitializeWithKeys(i)}});