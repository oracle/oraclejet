/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(b,f){(function(){b.ya("oj.ojProgressbar",f.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,wt:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.aU();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.pP=f("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.TZ()},Wd:function(a,b){var c=this.element;this._super(a,b);void 0===b.max&&(c=c.attr("max")||void 0,null!=c&&(this.options.max=c))},aU:function(a){void 0===a&&(a=this.options.value);this.wt=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.wt?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,b){var c=a.value;delete a.value;this._super(a,b);this.options.disabled||(this.options.value=this.aU(c),this.TZ())},_setOption:function(a,b,c){"max"===a&&(b=Math.max(this.min,
b));this._super(a,b,c)},sia:function(){return this.wt?100:100*(this.options.value-this.min)/(this.options.max-this.min)},TZ:function(){var a=this.options.value,b=this.sia();this.pP.toggle(this.wt||a>this.min).width(b.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.wt);this.wt?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.az||(this.az=f("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.pP),
this.az.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.az&&(this.az.remove(),this.az=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.pP.remove();this._super()}})})()});