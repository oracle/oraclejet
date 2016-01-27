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
define(["ojs/ojcore","jquery"],function(b,f){b.Be=function(a){this._init(a)};b.Be.prototype._init=function(a){this.rc=a;this.mD=this.Zx=!1;this.oD=f.proxy(this.Kla,this);this.Xx=f.proxy(this.Ila,this);this.aM=f.proxy(this.Jla,this);this.rc.on({touchstart:this.oD,touchend:this.Xx,touchmove:this.aM,touchcancel:this.Xx})};b.Be.prototype._destroy=function(){this.rc&&this.oD&&(this.rc.off({touchstart:this.oD,touchmove:this.aM,touchend:this.Xx,touchcancel:this.Xx}),this.aM=this.Xx=this.oD=void 0)};b.Be.prototype.Sq=
function(a,b){if(!(1<a.originalEvent.touches.length)){"touchstart"!=a.type&&"touchend"!=a.type&&a.preventDefault();var c=a.originalEvent.changedTouches[0],e=document.createEvent("MouseEvent");e.initMouseEvent(b,!0,!0,window,1,c.screenX,c.screenY,c.clientX,c.clientY,!1,!1,!1,!1,0,null);c.target.dispatchEvent(e)}};b.Be.prototype.Kla=function(a){this.Zx||(this.Zx=!0,this.mD=!1,this.Sq(a,"mouseover"),this.Sq(a,"mousemove"),this.Sq(a,"mousedown"))};b.Be.prototype.Jla=function(a){this.Zx&&(this.mD=!0,this.Sq(a,
"mousemove"))};b.Be.prototype.Ila=function(a){this.Zx&&(this.Sq(a,"mouseup"),this.Sq(a,"mouseout"),this.mD||"touchend"!=a.type||this.Sq(a,"click"),this.Zx=!1)};b.Be.hA="_ojTouchProxy";b.Be.j1=function(a){a=f(a);var d=a.data(b.Be.hA);d||(d=new b.Be(a),a.data(b.Be.hA,d));return d};b.Be.G4=function(a){a=f(a);var d=a.data(b.Be.hA);d&&(d._destroy(),a.removeData(b.Be.hA))}});