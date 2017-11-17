/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 jQuery UI Touch Punch 0.2.3

 Copyright 2011-2014, Dave Furfero
 Dual licensed under the MIT or GPL Version 2 licenses.
*/
define(["ojs/ojcore","jquery"],function(a,g){a.dh=function(a){this._init(a)};a.dh.prototype._init=function(a){this.Pf=a;this.yU=this.QL=!1;this.AU=g.proxy(this.lZa,this);this.NL=g.proxy(this.iZa,this);this.B7=g.proxy(this.kZa,this);this.Pf.on({touchstart:this.AU,touchend:this.NL,touchmove:this.B7,touchcancel:this.NL})};a.dh.prototype._destroy=function(){this.Pf&&this.AU&&(this.Pf.off({touchstart:this.AU,touchmove:this.B7,touchend:this.NL,touchcancel:this.NL}),this.B7=this.NL=this.AU=void 0)};a.dh.prototype.cB=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.dh.prototype.lZa=function(a){this.QL||(this.QL=!0,this.yU=!1,this.cB(a,"mouseover"),this.cB(a,"mousemove"),this.cB(a,"mousedown"))};a.dh.prototype.kZa=function(a){this.QL&&(this.yU=!0,this.cB(a,
"mousemove"))};a.dh.prototype.iZa=function(a){this.QL&&(this.cB(a,"mouseup"),this.cB(a,"mouseout"),this.yU||"touchend"!=a.type||this.cB(a,"click"),this.QL=!1)};a.dh.JP="_ojTouchProxy";a.dh.p8=function(c){c=g(c);var b=c.data(a.dh.JP);b||(b=new a.dh(c),c.data(a.dh.JP,b));return b};a.dh.naa=function(c){c=g(c);var b=c.data(a.dh.JP);b&&(b._destroy(),c.removeData(a.dh.JP))}});