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
define(["ojs/ojcore","jquery"],function(b,f){b.Ce=function(a){this._init(a)};b.Ce.prototype._init=function(a){this.rc=a;this.qD=this.by=!1;this.sD=f.proxy(this.Xla,this);this.$x=f.proxy(this.Vla,this);this.iM=f.proxy(this.Wla,this);this.rc.on({touchstart:this.sD,touchend:this.$x,touchmove:this.iM,touchcancel:this.$x})};b.Ce.prototype._destroy=function(){this.rc&&this.sD&&(this.rc.off({touchstart:this.sD,touchmove:this.iM,touchend:this.$x,touchcancel:this.$x}),this.iM=this.$x=this.sD=void 0)};b.Ce.prototype.Uq=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var c=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null);c.target.dispatchEvent(e)}};b.Ce.prototype.Xla=function(a){this.by||(this.by=!0,this.qD=!1,this.Uq(a,"mouseover"),this.Uq(a,"mousemove"),this.Uq(a,"mousedown"))};b.Ce.prototype.Wla=function(a){this.by&&(this.qD=!0,this.Uq(a,
"mousemove"))};b.Ce.prototype.Vla=function(a){this.by&&(this.Uq(a,"mouseup"),this.Uq(a,"mouseout"),this.qD||"touchend"!=a.type||this.Uq(a,"click"),this.by=!1)};b.Ce.lA="_ojTouchProxy";b.Ce.y1=function(a){a=f(a);var d=a.data(b.Ce.lA);d||(d=new b.Ce(a),a.data(b.Ce.lA,d));return d};b.Ce.U4=function(a){a=f(a);var d=a.data(b.Ce.lA);d&&(d._destroy(),a.removeData(b.Ce.lA))}});