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
define(["ojs/ojcore","jquery"],function(a,g){a.Gg=function(a){this._init(a)};a.Gg.prototype._init=function(a){this.pd=a;this.yL=this.OE=!1;this.AL=g.proxy(this.GEa,this);this.ME=g.proxy(this.EEa,this);this.RW=g.proxy(this.FEa,this);this.pd.on({touchstart:this.AL,touchend:this.ME,touchmove:this.RW,touchcancel:this.ME})};a.Gg.prototype._destroy=function(){this.pd&&this.AL&&(this.pd.off({touchstart:this.AL,touchmove:this.RW,touchend:this.ME,touchcancel:this.ME}),this.RW=this.ME=this.AL=void 0)};a.Gg.prototype.vw=
function(a,c){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(c,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.Gg.prototype.GEa=function(a){this.OE||(this.OE=!0,this.yL=!1,this.vw(a,"mouseover"),this.vw(a,"mousemove"),this.vw(a,"mousedown"))};a.Gg.prototype.FEa=function(a){this.OE&&(this.yL=!0,this.vw(a,
"mousemove"))};a.Gg.prototype.EEa=function(a){this.OE&&(this.vw(a,"mouseup"),this.vw(a,"mouseout"),this.yL||"touchend"!=a.type||this.vw(a,"click"),this.OE=!1)};a.Gg.KH="_ojTouchProxy";a.Gg.rea=function(b){b=g(b);var c=b.data(a.Gg.KH);c||(c=new a.Gg(b),b.data(a.Gg.KH,c));return c};a.Gg.$ia=function(b){b=g(b);var c=b.data(a.Gg.KH);c&&(c._destroy(),b.removeData(a.Gg.KH))}});