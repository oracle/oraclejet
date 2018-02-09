/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","knockout","ojs/ojcomponentcore","ojs/ojeventtarget","ojs/ojdataprovider"],function(a){var g=function(){function c(b,a){this.pR=b;this.Aia=a;this.iD="dataProvider";this.Mv=function(){return function(b){this.mn=b;this[Symbol.asyncIterator]=function(){return this.mn}}}();this.Nv=function(){function b(a){this.LIa=a}b.prototype.next=function(){return this.LIa.then(function(b){return b.next()})};return b}()}c.prototype.fetchFirst=function(b){var a=this.lA().then(function(a){return a.fetchFirst(b)[Symbol.asyncIterator]()}.bind(b));
return new this.Mv(new this.Nv(a))};c.prototype.fetchByKeys=function(b){return this.lA().then(function(a){return a.fetchByKeys(b)})};c.prototype.containsKeys=function(b){return this.lA().then(function(a){return a.containsKeys(b)})};c.prototype.fetchByOffset=function(b){return this.lA().then(function(a){return a.fetchByOffset(b)})};c.prototype.getTotalSize=function(){return this.lA().then(function(b){return b.getTotalSize()})};c.prototype.Yd=function(){return this[this.iD]?this[this.iD].Yd():"unknown"};
c.prototype.getCapability=function(b){return this.Aia?this.Aia(b):null};c.prototype.addEventListener=function(b,a){this.lA().then(function(c){c.addEventListener(b,a)})};c.prototype.removeEventListener=function(b,a){this.lA().then(function(c){c.removeEventListener(b,a)})};c.prototype.dispatchEvent=function(b){return this[this.iD]?this[this.iD].dispatchEvent(b):!1};c.prototype.lA=function(){var b=this;return this.pR.then(function(c){if(a.Pq.AG(c))return b[b.iD]||(b[b.iD]=c),c;throw Error("Invalid data type. DeferredDataProvider takes a Promise\x3cDataProvider\x3e");
})};return c}();a.DeferredDataProvider=g;a.f.j("DeferredDataProvider.prototype.containsKeys",{containsKeys:g.prototype.containsKeys});a.f.j("DeferredDataProvider.prototype.fetchByKeys",{fetchByKeys:g.prototype.fetchByKeys});a.f.j("DeferredDataProvider.prototype.fetchByOffset",{fetchByOffset:g.prototype.fetchByOffset});a.f.j("DeferredDataProvider.prototype.fetchFirst",{fetchFirst:g.prototype.fetchFirst});a.f.j("DeferredDataProvider.prototype.getCapability",{getCapability:g.prototype.getCapability});
a.f.j("DeferredDataProvider.prototype.getTotalSize",{getTotalSize:g.prototype.getTotalSize});a.f.j("DeferredDataProvider.prototype.isEmpty",{Yd:g.prototype.Yd})});