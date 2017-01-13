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
define(["ojs/ojcore","jquery"],function(a,g){a.Fg=function(a){this._init(a)};a.Fg.prototype._init=function(a){this.pd=a;this.HL=this.XE=!1;this.JL=g.proxy(this.mFa,this);this.VE=g.proxy(this.kFa,this);this.gX=g.proxy(this.lFa,this);this.pd.on({touchstart:this.JL,touchend:this.VE,touchmove:this.gX,touchcancel:this.VE})};a.Fg.prototype._destroy=function(){this.pd&&this.JL&&(this.pd.off({touchstart:this.JL,touchmove:this.gX,touchend:this.VE,touchcancel:this.VE}),this.gX=this.VE=this.JL=void 0)};a.Fg.prototype.ww=
function(a,c){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(c,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.Fg.prototype.mFa=function(a){this.XE||(this.XE=!0,this.HL=!1,this.ww(a,"mouseover"),this.ww(a,"mousemove"),this.ww(a,"mousedown"))};a.Fg.prototype.lFa=function(a){this.XE&&(this.HL=!0,this.ww(a,
"mousemove"))};a.Fg.prototype.kFa=function(a){this.XE&&(this.ww(a,"mouseup"),this.ww(a,"mouseout"),this.HL||"touchend"!=a.type||this.ww(a,"click"),this.XE=!1)};a.Fg.TH="_ojTouchProxy";a.Fg.Pea=function(b){b=g(b);var c=b.data(a.Fg.TH);c||(c=new a.Fg(b),b.data(a.Fg.TH,c));return c};a.Fg.Cja=function(b){b=g(b);var c=b.data(a.Fg.TH);c&&(c._destroy(),b.removeData(a.Fg.TH))}});