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
define(["ojs/ojcore","jquery"],function(a,f){a.He=function(b){this._init(b)};a.He.prototype._init=function(b){this.rc=b;this.uD=this.jy=!1;this.wD=f.proxy(this.Cma,this);this.hy=f.proxy(this.Ama,this);this.mM=f.proxy(this.Bma,this);this.rc.on({touchstart:this.wD,touchend:this.hy,touchmove:this.mM,touchcancel:this.hy})};a.He.prototype._destroy=function(){this.rc&&this.wD&&(this.rc.off({touchstart:this.wD,touchmove:this.mM,touchend:this.hy,touchcancel:this.hy}),this.mM=this.hy=this.wD=void 0)};a.He.prototype.Zq=
function(b,a){if(!(1<b.originalEvent.touches.length)){"touchstart"!=b.type&&"touchend"!=b.type&&b.preventDefault();var c=b.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(a,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null);c.target.dispatchEvent(e)}};a.He.prototype.Cma=function(b){this.jy||(this.jy=!0,this.uD=!1,this.Zq(b,"mouseover"),this.Zq(b,"mousemove"),this.Zq(b,"mousedown"))};a.He.prototype.Bma=function(b){this.jy&&(this.uD=!0,this.Zq(b,
"mousemove"))};a.He.prototype.Ama=function(b){this.jy&&(this.Zq(b,"mouseup"),this.Zq(b,"mouseout"),this.uD||"touchend"!=b.type||this.Zq(b,"click"),this.jy=!1)};a.He.sA="_ojTouchProxy";a.He.P1=function(b){b=f(b);var d=b.data(a.He.sA);d||(d=new a.He(b),b.data(a.He.sA,d));return d};a.He.p5=function(b){b=f(b);var d=b.data(a.He.sA);d&&(d._destroy(),b.removeData(a.He.sA))}});