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
define(["ojs/ojcore","jquery"],function(b,f){b.Ge=function(a){this._init(a)};b.Ge.prototype._init=function(a){this.qc=a;this.tD=this.gy=!1;this.vD=f.proxy(this.ima,this);this.ey=f.proxy(this.gma,this);this.nM=f.proxy(this.hma,this);this.qc.on({touchstart:this.vD,touchend:this.ey,touchmove:this.nM,touchcancel:this.ey})};b.Ge.prototype._destroy=function(){this.qc&&this.vD&&(this.qc.off({touchstart:this.vD,touchmove:this.nM,touchend:this.ey,touchcancel:this.ey}),this.nM=this.ey=this.vD=void 0)};b.Ge.prototype.Vq=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var c=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null);c.target.dispatchEvent(e)}};b.Ge.prototype.ima=function(a){this.gy||(this.gy=!0,this.tD=!1,this.Vq(a,"mouseover"),this.Vq(a,"mousemove"),this.Vq(a,"mousedown"))};b.Ge.prototype.hma=function(a){this.gy&&(this.tD=!0,this.Vq(a,
"mousemove"))};b.Ge.prototype.gma=function(a){this.gy&&(this.Vq(a,"mouseup"),this.Vq(a,"mouseout"),this.tD||"touchend"!=a.type||this.Vq(a,"click"),this.gy=!1)};b.Ge.pA="_ojTouchProxy";b.Ge.H1=function(a){a=f(a);var d=a.data(b.Ge.pA);d||(d=new b.Ge(a),a.data(b.Ge.pA,d));return d};b.Ge.f5=function(a){a=f(a);var d=a.data(b.Ge.pA);d&&(d._destroy(),a.removeData(b.Ge.pA))}});