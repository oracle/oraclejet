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
define(["ojs/ojcore","jquery"],function(b,f){b.Ce=function(a){this._init(a)};b.Ce.prototype._init=function(a){this.rc=a;this.pD=this.cy=!1;this.rD=f.proxy(this.Xla,this);this.ay=f.proxy(this.Vla,this);this.iM=f.proxy(this.Wla,this);this.rc.on({touchstart:this.rD,touchend:this.ay,touchmove:this.iM,touchcancel:this.ay})};b.Ce.prototype._destroy=function(){this.rc&&this.rD&&(this.rc.off({touchstart:this.rD,touchmove:this.iM,touchend:this.ay,touchcancel:this.ay}),this.iM=this.ay=this.rD=void 0)};b.Ce.prototype.Tq=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var c=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null);c.target.dispatchEvent(e)}};b.Ce.prototype.Xla=function(a){this.cy||(this.cy=!0,this.pD=!1,this.Tq(a,"mouseover"),this.Tq(a,"mousemove"),this.Tq(a,"mousedown"))};b.Ce.prototype.Wla=function(a){this.cy&&(this.pD=!0,this.Tq(a,
"mousemove"))};b.Ce.prototype.Vla=function(a){this.cy&&(this.Tq(a,"mouseup"),this.Tq(a,"mouseout"),this.pD||"touchend"!=a.type||this.Tq(a,"click"),this.cy=!1)};b.Ce.mA="_ojTouchProxy";b.Ce.z1=function(a){a=f(a);var d=a.data(b.Ce.mA);d||(d=new b.Ce(a),a.data(b.Ce.mA,d));return d};b.Ce.V4=function(a){a=f(a);var d=a.data(b.Ce.mA);d&&(d._destroy(),a.removeData(b.Ce.mA))}});