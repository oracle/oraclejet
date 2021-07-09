/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./impl/pouchDBPersistenceStore"],(function(t){"use strict";var e=function(t){this._options=t};return e.prototype.createPersistenceStore=function(e,r){var n=new t(e),o=this._options;if(r)if(o){var i={};for(var c in o)Object.prototype.hasOwnProperty.call(o,c)&&(i[c]=o[c]);for(var c in r)Object.prototype.hasOwnProperty.call(r,c)&&(i[c]=r[c]);o=i}else o=r;return n.Init(o).then((function(){return n}))},e}));