/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","hammerjs"],function(a,f,b){b?(f.fn.jl=function(a){return"instance"==a?this.data("ojHammer"):this.each(function(){var c=f(this);c.data("ojHammer")||c.data("ojHammer",new b.Manager(c[0],a))})},o_("$.fn.ojHammer",f.fn.jl,void 0),b.Manager.prototype.emit=function(a){return function(b,e){a.call(this,b,e);f(this.element).trigger({type:b,gesture:e})}}(b.Manager.prototype.emit)):a.q.warn("Hammer jQuery extension loaded without Hammer.")});