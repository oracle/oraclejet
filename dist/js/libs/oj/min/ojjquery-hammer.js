/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","hammerjs"],function(a,g,c){c?(g.fn.Ng=function(a){switch(a){case "instance":return this.data("ojHammer");case "destroy":return this.each(function(){var a=g(this),b=a.data("ojHammer");b&&(b.destroy(),a.removeData("ojHammer"))});default:return this.each(function(){var d=g(this);d.data("ojHammer")||d.data("ojHammer",new c.Manager(d[0],a))})}},o_("$.fn.ojHammer",g.fn.Ng,void 0),c.Manager.prototype.emit=function(a){return function(c,e){a.call(this,c,e);g(this.element).trigger({type:c,
gesture:e})}}(c.Manager.prototype.emit)):a.C.warn("Hammer jQuery extension loaded without Hammer.")});