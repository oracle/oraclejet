/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcomponentcore","ojs/ojcore","jquery"],function(e,t,s,i){"use strict";var r;e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,s=s&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s,i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i,(r={properties:{max:{type:"number",value:100},translations:{type:"object",value:{},properties:{ariaIndeterminateProgressText:{type:"string"}}},type:{type:"string",enumValues:["bar","circle"],value:"bar"},value:{type:"number",writeback:!0,value:0}},methods:{getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}).extension._WIDGET_NAME="ojProgressbar",e.CustomElementBridge.register("oj-progress",{metadata:r}),s.__registerWidget("oj.ojProgressbar",i.oj.baseComponent,{version:"1.0.0",defaultElement:"<div>",widgetEventPrefix:"oj",options:{max:100,value:0,type:"bar",disabled:!1},min:0,_indeterminate:!1,_ComponentCreate:function(){this._super(),this.options.value=this._constrainedValue(),this.oldValue=this.options.value,this.element.attr({role:"progressbar","aria-valuemin":this.min}),this.element.addClass("oj-component"),this._setUpProgressType()},_setUpProgressType:function(){"circle"===this.options.type?(this.element.addClass("oj-progress-circle"),this._setupCircleSVG()):(this.element.addClass("oj-progress-bar"),this.valueDiv=i("<div class='oj-progress-bar-value'></div>").appendTo(this.element)),this._refreshValue()},_InitOptions:function(e,t){var s=this.element;if(this._super(e,t),void 0===t.max){var i=s.attr("max")||void 0;null!=i&&(this.options.max=i)}},_constrainedValue:function(e){return void 0===e&&(e=this.options.value),this._indeterminate=-1===e,"number"!=typeof e&&(e=isNaN(e)?0:Number(e)),this._indeterminate?-1:Math.min(this.options.max,Math.max(this.min,e))},_setOptions:function(e,t){var s=e.value;delete e.value,this._super(e,t),this.options.disabled||(this.options.value=this._constrainedValue(s),this._refreshValue())},_setupCircleSVG:function(){if(this.svg&&this.svg.remove(),!this._indeterminate){var e="http://www.w3.org/2000/svg",t=document.createElementNS(e,"svg"),s=document.createElementNS(e,"circle"),r=document.createElementNS(e,"circle"),a=.5*Math.min(this.element.outerWidth(),this.element.outerHeight());t.setAttribute("width",2*a),t.setAttribute("height",2*a),t.setAttribute("class","oj-progress-circle-transform"),s.setAttribute("r",.9*a),s.setAttribute("cx",a),s.setAttribute("cy",a),s.setAttribute("class","oj-progress-circle-base"),r.setAttribute("r",.9*a),r.setAttribute("cx",a),r.setAttribute("cy",a),r.setAttribute("class","oj-progress-circle-base oj-progress-circle-value");var o=2*a*.9*Math.PI,n=o-this._percentage()/100*o;r.style.strokeDasharray=o.toString(),r.style.strokeDashoffset=n,t.appendChild(s),t.appendChild(r),this.svg=i(t),this.element[0].appendChild(t)}},_setOption:function(e,t,s){"max"===e&&(t=Math.max(this.min,t)),"type"===e&&("circle"===this.options.type?(this.element.removeClass("oj-progress-circle"),this.svg&&this.svg.remove()):(this.element.removeClass("oj-progress-bar"),this.valueDiv.remove()),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)),this._super(e,t,s),"type"===e&&this._setUpProgressType()},_percentage:function(){return Math.min(this._indeterminate?100:100*(this.options.value-this.min)/(this.options.max-this.min),100)},_refreshValue:function(){var e=this.options.value,t=this._percentage(),s="circle"===this.options.type;if(s?this._setupCircleSVG():(this.valueDiv.toggle(this._indeterminate||e>this.min).width(t.toFixed(0)+"%"),this.element.toggleClass("oj-progress-bar-indeterminate",this._indeterminate)),this._indeterminate){if(this.element.attr({"aria-valuetext":this.getTranslatedString("ariaIndeterminateProgressText")}),this.element.removeAttr("aria-valuenow"),this.element.removeAttr("aria-valuemin"),this.element.removeAttr("aria-valuemax"),!this.overlayDiv){if(s){this.overlayDiv=i("<div class='oj-progress-circle-overlay'></div>").appendTo(this.element);var r=Math.min(this.element.outerWidth(),this.element.outerHeight());this.overlayDiv.css("width",r),this.overlayDiv.css("height",r)}else this.overlayDiv=i("<div class='oj-progress-bar-overlay'></div>").appendTo(this.valueDiv);this.overlayDiv.addClass("oj-indeterminate")}}else this.element.attr({"aria-valuemax":this.options.max,"aria-valuenow":e}),this.overlayDiv&&(this.overlayDiv.remove(),this.overlayDiv=null)},_destroy:function(){"circle"===this.options.type?(this.element.removeClass("oj-progress-circle oj-component"),this.svg&&this.svg.remove()):(this.element.removeClass("oj-progress-bar oj-component"),this.valueDiv.remove(),this._indeterminate&&this.element.removeClass("oj-progress-bar-indeterminate")),this.element.removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),this.overlayDiv&&this.overlayDiv.remove(),this._super()}})});
//# sourceMappingURL=ojprogress.js.map