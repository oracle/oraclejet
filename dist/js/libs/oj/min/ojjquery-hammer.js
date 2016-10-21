/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","hammerjs"],function(a,g,b){b?(g.fn.tj=function(a){switch(a){case "instance":return this.data("ojHammer");case "destroy":return this.each(function(){var a=g(this),b=a.data("ojHammer");b&&(b.destroy(),a.removeData("ojHammer"))});default:return this.each(function(){var d=g(this);d.data("ojHammer")||d.data("ojHammer",new b.Manager(d[0],a))})}},o_("$.fn.ojHammer",g.fn.tj,void 0),b.Manager.prototype.emit=function(a){return function(b,e){a.call(this,b,e);g(this.element).trigger({type:b,
gesture:e})}}(b.Manager.prototype.emit)):a.t.warn("Hammer jQuery extension loaded without Hammer.")});