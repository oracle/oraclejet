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
define(["ojs/ojcore","jquery"],function(a,g){a.sg=function(a){this._init(a)};a.sg.prototype._init=function(a){this.Nd=a;this.kP=this.UH=!1;this.mP=g.proxy(this.JMa,this);this.SH=g.proxy(this.HMa,this);this.V0=g.proxy(this.IMa,this);this.Nd.on({touchstart:this.mP,touchend:this.SH,touchmove:this.V0,touchcancel:this.SH})};a.sg.prototype._destroy=function(){this.Nd&&this.mP&&(this.Nd.off({touchstart:this.mP,touchmove:this.V0,touchend:this.SH,touchcancel:this.SH}),this.V0=this.SH=this.mP=void 0)};a.sg.prototype.Iy=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var d=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,d.screenX,d.screenY,d.clientX,d.clientY,!1,!1,!1,!1,0,null);d.target.dispatchEvent(e)}};a.sg.prototype.JMa=function(a){this.UH||(this.UH=!0,this.kP=!1,this.Iy(a,"mouseover"),this.Iy(a,"mousemove"),this.Iy(a,"mousedown"))};a.sg.prototype.IMa=function(a){this.UH&&(this.kP=!0,this.Iy(a,
"mousemove"))};a.sg.prototype.HMa=function(a){this.UH&&(this.Iy(a,"mouseup"),this.Iy(a,"mouseout"),this.kP||"touchend"!=a.type||this.Iy(a,"click"),this.UH=!1)};a.sg.jL="_ojTouchProxy";a.sg.M1=function(c){c=g(c);var b=c.data(a.sg.jL);b||(b=new a.sg(c),c.data(a.sg.jL,b));return b};a.sg.t4=function(c){c=g(c);var b=c.data(a.sg.jL);b&&(b._destroy(),c.removeData(a.sg.jL))}});