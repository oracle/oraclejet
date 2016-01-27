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
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(b,f){(function(){b.ya("oj.ojProgressbar",f.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,ut:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.VT();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.jP=f("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.JZ()},Wd:function(a,b){var c=this.element;this._super(a,b);void 0===b.max&&(c=c.attr("max")||void 0,null!=c&&(this.options.max=c))},VT:function(a){void 0===a&&(a=this.options.value);this.ut=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.ut?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,b){var c=a.value;delete a.value;this._super(a,b);this.options.disabled||(this.options.value=this.VT(c),this.JZ())},_setOption:function(a,b,c){"max"===a&&(b=Math.max(this.min,
b));this._super(a,b,c)},kia:function(){return this.ut?100:100*(this.options.value-this.min)/(this.options.max-this.min)},JZ:function(){var a=this.options.value,b=this.kia();this.jP.toggle(this.ut||a>this.min).width(b.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.ut);this.ut?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.Zy||(this.Zy=f("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.jP),
this.Zy.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.Zy&&(this.Zy.remove(),this.Zy=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.jP.remove();this._super()}})})()});