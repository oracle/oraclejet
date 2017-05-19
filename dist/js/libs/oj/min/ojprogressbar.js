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
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){(function(){a.ab("oj.ojProgressbar",g.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,HB:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.Saa();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.H5=g("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.qia()},Sg:function(a,b){var d=this.element;this._super(a,b);void 0===b.max&&(d=d.attr("max")||void 0,null!=d&&(this.options.max=d))},Saa:function(a){void 0===a&&(a=this.options.value);this.HB=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.HB?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,b){var d=a.value;delete a.value;this._super(a,b);this.options.disabled||(this.options.value=this.Saa(d),this.qia())},_setOption:function(a,b,d){"max"===a&&(b=Math.max(this.min,
b));this._super(a,b,d)},hJa:function(){return this.HB?100:100*(this.options.value-this.min)/(this.options.max-this.min)},qia:function(){var a=this.options.value,b=this.hJa();this.H5.toggle(this.HB||a>this.min).width(b.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.HB);this.HB?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.EJ||(this.EJ=
g("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.H5),this.EJ.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.EJ&&(this.EJ.remove(),this.EJ=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.H5.remove();this._super()}})})();a.U.qb("oj-progressbar","baseComponent",{properties:{max:{type:"number"},
value:{type:"number",writeback:!0}},methods:{},extension:{nb:"ojProgressbar"}});a.U.register("oj-progressbar",{metadata:a.U.getMetadata("oj-progressbar")})});