/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 jQuery UI Touch Punch 0.2.3

 Copyright 2011-2014, Dave Furfero
 Dual licensed under the MIT or GPL Version 2 licenses.
*/
define(["ojs/ojcore","jquery"],function(a,g){a.kh=function(a){this._init(a)};a.kh.prototype._init=function(a){this.Tf=a;this.fV=this.oM=!1;this.hV=g.proxy(this.r_a,this);this.mM=g.proxy(this.o_a,this);this.E8=g.proxy(this.q_a,this);this.Tf.on({touchstart:this.hV,touchend:this.mM,touchmove:this.E8,touchcancel:this.mM})};a.kh.prototype._destroy=function(){this.Tf&&this.hV&&(this.Tf.off({touchstart:this.hV,touchmove:this.E8,touchend:this.mM,touchcancel:this.mM}),this.E8=this.mM=this.hV=void 0)};a.kh.prototype.tB=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.kh.prototype.r_a=function(a){this.oM||(this.oM=!0,this.fV=!1,this.tB(a,"mouseover"),this.tB(a,"mousemove"),this.tB(a,"mousedown"))};a.kh.prototype.q_a=function(a){this.oM&&(this.fV=!0,this.tB(a,
"mousemove"))};a.kh.prototype.o_a=function(a){this.oM&&(this.tB(a,"mouseup"),this.tB(a,"mouseout"),this.fV||"touchend"!=a.type||this.tB(a,"click"),this.oM=!1)};a.kh.nQ="_ojTouchProxy";a.kh.t9=function(c){c=g(c);var b=c.data(a.kh.nQ);b||(b=new a.kh(c),c.data(a.kh.nQ,b));return b};a.kh.rba=function(c){c=g(c);var b=c.data(a.kh.nQ);b&&(b._destroy(),c.removeData(a.kh.nQ))}});