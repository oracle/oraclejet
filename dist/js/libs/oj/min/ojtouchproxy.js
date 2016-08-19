/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 jQuery UI Touch Punch 0.2.3

 Copyright 2011-2014, Dave Furfero
 Dual licensed under the MIT or GPL Version 2 licenses.
*/
define(["ojs/ojcore","jquery"],function(a,g){a.Ag=function(a){this._init(a)};a.Ag.prototype._init=function(a){this.od=a;this.cL=this.yE=!1;this.eL=g.proxy(this.vDa,this);this.wE=g.proxy(this.tDa,this);this.rW=g.proxy(this.uDa,this);this.od.on({touchstart:this.eL,touchend:this.wE,touchmove:this.rW,touchcancel:this.wE})};a.Ag.prototype._destroy=function(){this.od&&this.eL&&(this.od.off({touchstart:this.eL,touchmove:this.rW,touchend:this.wE,touchcancel:this.wE}),this.rW=this.wE=this.eL=void 0)};a.Ag.prototype.ew=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.Ag.prototype.vDa=function(a){this.yE||(this.yE=!0,this.cL=!1,this.ew(a,"mouseover"),this.ew(a,"mousemove"),this.ew(a,"mousedown"))};a.Ag.prototype.uDa=function(a){this.yE&&(this.cL=!0,this.ew(a,
"mousemove"))};a.Ag.prototype.tDa=function(a){this.yE&&(this.ew(a,"mouseup"),this.ew(a,"mouseout"),this.cL||"touchend"!=a.type||this.ew(a,"click"),this.yE=!1)};a.Ag.rH="_ojTouchProxy";a.Ag.Ada=function(c){c=g(c);var b=c.data(a.Ag.rH);b||(b=new a.Ag(c),c.data(a.Ag.rH,b));return b};a.Ag.aia=function(c){c=g(c);var b=c.data(a.Ag.rH);b&&(b._destroy(),c.removeData(a.Ag.rH))}});