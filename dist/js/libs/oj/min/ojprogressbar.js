/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){(function(){a.ab("oj.ojProgressbar",g.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,CB:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.maa();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.b5=g("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.Jha()},Og:function(a,b){var d=this.element;this._super(a,b);void 0===b.max&&(d=d.attr("max")||void 0,null!=d&&(this.options.max=d))},maa:function(a){void 0===a&&(a=this.options.value);this.CB=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.CB?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,b){var d=a.value;delete a.value;this._super(a,b);this.options.disabled||(this.options.value=this.maa(d),this.Jha())},_setOption:function(a,b,d){"max"===a&&(b=Math.max(this.min,
b));this._super(a,b,d)},rIa:function(){return this.CB?100:100*(this.options.value-this.min)/(this.options.max-this.min)},Jha:function(){var a=this.options.value,b=this.rIa();this.b5.toggle(this.CB||a>this.min).width(b.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.CB);this.CB?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.rJ||(this.rJ=
g("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.b5),this.rJ.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.rJ&&(this.rJ.remove(),this.rJ=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.b5.remove();this._super()}})})();a.U.ob("oj-progressbar","baseComponent",{properties:{max:{type:"number"},
value:{type:"number",writeback:!0}},methods:{},extension:{mb:"ojProgressbar"}});a.U.register("oj-progressbar",{metadata:a.U.getMetadata("oj-progressbar")})});