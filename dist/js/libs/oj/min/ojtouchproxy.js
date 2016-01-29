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
define(["ojs/ojcore","jquery"],function(b,f){b.Be=function(a){this._init(a)};b.Be.prototype._init=function(a){this.rc=a;this.oD=this.ay=!1;this.qD=f.proxy(this.Sla,this);this.Zx=f.proxy(this.Qla,this);this.gM=f.proxy(this.Rla,this);this.rc.on({touchstart:this.qD,touchend:this.Zx,touchmove:this.gM,touchcancel:this.Zx})};b.Be.prototype._destroy=function(){this.rc&&this.qD&&(this.rc.off({touchstart:this.qD,touchmove:this.gM,touchend:this.Zx,touchcancel:this.Zx}),this.gM=this.Zx=this.qD=void 0)};b.Be.prototype.Sq=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var c=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null);c.target.dispatchEvent(e)}};b.Be.prototype.Sla=function(a){this.ay||(this.ay=!0,this.oD=!1,this.Sq(a,"mouseover"),this.Sq(a,"mousemove"),this.Sq(a,"mousedown"))};b.Be.prototype.Rla=function(a){this.ay&&(this.oD=!0,this.Sq(a,
"mousemove"))};b.Be.prototype.Qla=function(a){this.ay&&(this.Sq(a,"mouseup"),this.Sq(a,"mouseout"),this.oD||"touchend"!=a.type||this.Sq(a,"click"),this.ay=!1)};b.Be.jA="_ojTouchProxy";b.Be.t1=function(a){a=f(a);var d=a.data(b.Be.jA);d||(d=new b.Be(a),a.data(b.Be.jA,d));return d};b.Be.P4=function(a){a=f(a);var d=a.data(b.Be.jA);d&&(d._destroy(),a.removeData(b.Be.jA))}});