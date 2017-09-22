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
define(["ojs/ojcore","jquery"],function(a,g){a.Vg=function(a){this._init(a)};a.Vg.prototype._init=function(a){this.If=a;this.GS=this.vK=!1;this.IS=g.proxy(this.NUa,this);this.tK=g.proxy(this.KUa,this);this.m5=g.proxy(this.MUa,this);this.If.on({touchstart:this.IS,touchend:this.tK,touchmove:this.m5,touchcancel:this.tK})};a.Vg.prototype._destroy=function(){this.If&&this.IS&&(this.If.off({touchstart:this.IS,touchmove:this.m5,touchend:this.tK,touchcancel:this.tK}),this.m5=this.tK=this.IS=void 0)};a.Vg.prototype.eA=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.Vg.prototype.NUa=function(a){this.vK||(this.vK=!0,this.GS=!1,this.eA(a,"mouseover"),this.eA(a,"mousemove"),this.eA(a,"mousedown"))};a.Vg.prototype.MUa=function(a){this.vK&&(this.GS=!0,this.eA(a,
"mousemove"))};a.Vg.prototype.KUa=function(a){this.vK&&(this.eA(a,"mouseup"),this.eA(a,"mouseout"),this.GS||"touchend"!=a.type||this.eA(a,"click"),this.vK=!1)};a.Vg.gO="_ojTouchProxy";a.Vg.Z5=function(c){c=g(c);var b=c.data(a.Vg.gO);b||(b=new a.Vg(c),c.data(a.Vg.gO,b));return b};a.Vg.T8=function(c){c=g(c);var b=c.data(a.Vg.gO);b&&(b._destroy(),c.removeData(a.Vg.gO))}});