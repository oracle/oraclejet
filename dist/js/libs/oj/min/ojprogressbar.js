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
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){(function(){a.Pa("oj.ojProgressbar",g.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,ez:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.l5();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.F_=g("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.uba()},Yf:function(a,c){var d=this.element;this._super(a,c);void 0===c.max&&(d=d.attr("max")||void 0,null!=d&&(this.options.max=d))},l5:function(a){void 0===a&&(a=this.options.value);this.ez=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.ez?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,c){var d=a.value;delete a.value;this._super(a,c);this.options.disabled||(this.options.value=this.l5(d),this.uba())},_setOption:function(a,c,d){"max"===a&&(c=Math.max(this.min,
c));this._super(a,c,d)},DAa:function(){return this.ez?100:100*(this.options.value-this.min)/(this.options.max-this.min)},uba:function(){var a=this.options.value,c=this.DAa();this.F_.toggle(this.ez||a>this.min).width(c.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.ez);this.ez?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.hG||(this.hG=
g("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.F_),this.hG.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.hG&&(this.hG.remove(),this.hG=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.F_.remove();this._super()}})})();a.Components.Wa("ojProgressbar","baseComponent",{properties:{disabled:{},
max:{},value:{}},methods:{},extension:{_widgetName:"ojProgressbar"}});a.Components.register("oj-progressbar",a.Components.getMetadata("ojProgressbar"))});