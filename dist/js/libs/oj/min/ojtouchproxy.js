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
define(["ojs/ojcore","jquery"],function(a,g){a.yg=function(a){this._init(a)};a.yg.prototype._init=function(a){this.Rd=a;this.MP=this.nI=!1;this.OP=g.proxy(this.iOa,this);this.lI=g.proxy(this.gOa,this);this.I1=g.proxy(this.hOa,this);this.Rd.on({touchstart:this.OP,touchend:this.lI,touchmove:this.I1,touchcancel:this.lI})};a.yg.prototype._destroy=function(){this.Rd&&this.OP&&(this.Rd.off({touchstart:this.OP,touchmove:this.I1,touchend:this.lI,touchcancel:this.lI}),this.I1=this.lI=this.OP=void 0)};a.yg.prototype.Wy=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.yg.prototype.iOa=function(a){this.nI||(this.nI=!0,this.MP=!1,this.Wy(a,"mouseover"),this.Wy(a,"mousemove"),this.Wy(a,"mousedown"))};a.yg.prototype.hOa=function(a){this.nI&&(this.MP=!0,this.Wy(a,
"mousemove"))};a.yg.prototype.gOa=function(a){this.nI&&(this.Wy(a,"mouseup"),this.Wy(a,"mouseout"),this.MP||"touchend"!=a.type||this.Wy(a,"click"),this.nI=!1)};a.yg.EL="_ojTouchProxy";a.yg.E2=function(c){c=g(c);var b=c.data(a.yg.EL);b||(b=new a.yg(c),c.data(a.yg.EL,b));return b};a.yg.k5=function(c){c=g(c);var b=c.data(a.yg.EL);b&&(b._destroy(),c.removeData(a.yg.EL))}});