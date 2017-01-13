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
define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(a,g){(function(){a.Ra("oj.ojProgressbar",g.oj.baseComponent,{version:"1.0.0",defaultElement:"\x3cdiv\x3e",widgetEventPrefix:"oj",options:{max:100,value:0,disabled:!1},min:0,gz:!1,_ComponentCreate:function(){this._super();this.oldValue=this.options.value=this.E5();this.element.addClass("oj-progressbar").attr({role:"progressbar","aria-valuemin":this.min});this.V_=g("\x3cdiv class\x3d'oj-progressbar-value'\x3e\x3c/div\x3e").appendTo(this.element);
this.Rba()},Yf:function(a,c){var d=this.element;this._super(a,c);void 0===c.max&&(d=d.attr("max")||void 0,null!=d&&(this.options.max=d))},E5:function(a){void 0===a&&(a=this.options.value);this.gz=-1==a;"number"!==typeof a&&(a=isNaN(a)?0:Number(a));return this.gz?-1:Math.min(this.options.max,Math.max(this.min,a))},_setOptions:function(a,c){var d=a.value;delete a.value;this._super(a,c);this.options.disabled||(this.options.value=this.E5(d),this.Rba())},_setOption:function(a,c,d){"max"===a&&(c=Math.max(this.min,
c));this._super(a,c,d)},hBa:function(){return this.gz?100:100*(this.options.value-this.min)/(this.options.max-this.min)},Rba:function(){var a=this.options.value,c=this.hBa();this.V_.toggle(this.gz||a>this.min).width(c.toFixed(0)+"%");this.element.toggleClass("oj-progressbar-indeterminate",this.gz);this.gz?(this.element.attr({"aria-valuetext":"In Progress"}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),this.nG||(this.nG=
g("\x3cdiv class\x3d'oj-progressbar-overlay'\x3e\x3c/div\x3e").appendTo(this.V_),this.nG.addClass("oj-indeterminate"))):(this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":a}),this.nG&&(this.nG.remove(),this.nG=null))},_destroy:function(){this.element.removeClass("oj-progressbar").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow");this.V_.remove();this._super()}})})();a.Components.Xa("ojProgressbar","baseComponent",{properties:{disabled:{},
max:{},value:{}},methods:{},extension:{_widgetName:"ojProgressbar"}});a.Components.register("oj-progressbar",a.Components.getMetadata("ojProgressbar"))});