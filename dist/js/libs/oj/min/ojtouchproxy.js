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
define(["ojs/ojcore","jquery"],function(a,g){a.wg=function(a){this._init(a)};a.wg.prototype._init=function(a){this.Qd=a;this.BP=this.gI=!1;this.DP=g.proxy(this.yNa,this);this.eI=g.proxy(this.wNa,this);this.y1=g.proxy(this.xNa,this);this.Qd.on({touchstart:this.DP,touchend:this.eI,touchmove:this.y1,touchcancel:this.eI})};a.wg.prototype._destroy=function(){this.Qd&&this.DP&&(this.Qd.off({touchstart:this.DP,touchmove:this.y1,touchend:this.eI,touchcancel:this.eI}),this.y1=this.eI=this.DP=void 0)};a.wg.prototype.Sy=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.wg.prototype.yNa=function(a){this.gI||(this.gI=!0,this.BP=!1,this.Sy(a,"mouseover"),this.Sy(a,"mousemove"),this.Sy(a,"mousedown"))};a.wg.prototype.xNa=function(a){this.gI&&(this.BP=!0,this.Sy(a,
"mousemove"))};a.wg.prototype.wNa=function(a){this.gI&&(this.Sy(a,"mouseup"),this.Sy(a,"mouseout"),this.BP||"touchend"!=a.type||this.Sy(a,"click"),this.gI=!1)};a.wg.xL="_ojTouchProxy";a.wg.t2=function(c){c=g(c);var b=c.data(a.wg.xL);b||(b=new a.wg(c),c.data(a.wg.xL,b));return b};a.wg.Z4=function(c){c=g(c);var b=c.data(a.wg.xL);b&&(b._destroy(),c.removeData(a.wg.xL))}});