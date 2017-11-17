/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore"],function(a){var g=function(){function a(){}a.prototype.addEventListener=function(a,c){this.xr||(this.xr=[]);this.xr.push({type:a.toLowerCase(),listener:c})};a.prototype.removeEventListener=function(a,c){if(this.xr)for(var e=void 0,e=this.xr.length-1;0<=e;e--)this.xr[e].type==a&&this.xr[e].listener==c&&this.xr.splice(e,1)};a.prototype.dispatchEvent=function(a){if(this.xr){var c,e;for(c=0;c<this.xr.length;c++)if(e=this.xr[c],e.type==a.type&&(e=e.listener.apply(this,[a]),!1===e))return!1}return!0};
a.t8=function(b){[a].forEach(function(a){Object.getOwnPropertyNames(a.prototype).forEach(function(c){"constructor"!==c&&(b.prototype[c]=a.prototype[c])})})};return a}();a.dY=g;a.jY=function(){return function(a,b){this.type=a;this.options=b;null!=b&&(this.detail=b.detail)}}()});