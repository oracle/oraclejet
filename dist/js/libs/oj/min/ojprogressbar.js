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
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,f){(function(){a.ya("oj.ojProgressbar",f.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,Et:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.rU();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.zP=f("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.l_()},ae:function(a,d){var c=this.element;this._super(a,d);void 0===d.max&&(c=c.attr("max")||void 0,null!=c&&(this.options.max=c))},rU:function(a){void 0===a&&(a=this.options.value);this.Et=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.Et?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,d){var c=a.value;delete a.value;this._super(a,d);this.options.disabled||(this.options.value=this.rU(c),this.l_())},_setOption:function(a,d,c){"max"===a&&(d=Math.max(this.min,
d));this._super(a,d,c)},$ia:function(){return this.Et?100:100*(this.options.value-this.min)/(this.options.max-this.min)},l_:function(){var a=this.options.value,d=this.$ia();this.zP.toggle(this.Et||a>this.min).width(d.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.Et);this.Et?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.jz||(this.jz=f("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.zP),
this.jz.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.jz&&(this.jz.remove(),this.jz=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.zP.remove();this._super()}})})()});