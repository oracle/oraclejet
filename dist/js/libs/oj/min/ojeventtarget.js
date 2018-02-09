/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore"],function(a){var g=function(){function a(){}a.prototype.addEventListener=function(b,a){this.qo||(this.qo=[]);this.qo.push({type:b.toLowerCase(),listener:a})};a.prototype.removeEventListener=function(b,a){if(this.qo)for(var c=void 0,c=this.qo.length-1;0<=c;c--)this.qo[c].type==b&&this.qo[c].listener==a&&this.qo.splice(c,1)};a.prototype.dispatchEvent=function(b){if(this.qo){var a,c,f=this.qo.slice(0);for(a=0;a<f.length;a++)if(c=f[a],c.type==b.type&&(c=c.listener.apply(this,[b]),
!1===c))return!1}return!0};a.Lx=function(b){[a].forEach(function(a){Object.getOwnPropertyNames(a.prototype).forEach(function(c){"constructor"!==c&&(b.prototype[c]=a.prototype[c])})})};return a}();a.UY=g;a.Kca=function(){return function(a,b){this.type=a;this.options=b;null!=b&&(this.detail=b.detail)}}()});