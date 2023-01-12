/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","jquery","ojs/ojcomponentcore","ojs/ojdvt-base","ojs/ojtimeaxis-toolkit","ojs/ojlocaledata","ojs/ojconverter-datetime","ojs/ojconverterutils-i18n","ojs/ojconverter-number"],function(e,t,n,o,r,s,i,a,l){"use strict";var u;e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,(u={properties:{converter:{type:"object",properties:{days:{type:"object"},default:{type:"object"},hours:{type:"object"},minutes:{type:"object"},months:{type:"object"},quarters:{type:"object"},seconds:{type:"object"},weeks:{type:"object"},years:{type:"object"}}},end:{type:"string",value:""},scale:{type:"string|DvtTimeComponentScale",enumValues:["days","hours","minutes","months","quarters","seconds","weeks","years"]},start:{type:"string",value:""},trackResize:{type:"string",enumValues:["off","on"],value:"on"},translations:{type:"object",value:{},properties:{accessibleContainsControls:{type:"string"},componentName:{type:"string"},labelAndValue:{type:"string"},labelClearSelection:{type:"string"},labelCountWithTotal:{type:"string"},labelDataVisualization:{type:"string"},labelInvalidData:{type:"string"},labelNoData:{type:"string"},stateCollapsed:{type:"string"},stateDrillable:{type:"string"},stateExpanded:{type:"string"},stateHidden:{type:"string"},stateIsolated:{type:"string"},stateMaximized:{type:"string"},stateMinimized:{type:"string"},stateSelected:{type:"string"},stateUnselected:{type:"string"},stateVisible:{type:"string"}}}},methods:{getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}).extension._WIDGET_NAME="ojTimeAxis",e.CustomElementBridge.register("oj-time-axis",{metadata:u}),e.__registerWidget("oj.ojTimeAxis",t.oj.dvtBaseComponent,{widgetEventPrefix:"oj",options:{converter:void 0,start:"",end:"",scale:null},_ComponentCreate:function(){this._super(),this._SetLocaleHelpers(l,a)},_CreateDvtComponent:function(e,t,n){return new r.TimeAxis(e,t,n)},_GetComponentStyleClasses:function(){var e=this._super();return e.push("oj-timeaxis"),e},_GetChildStyleClasses:function(){var e=this._super();return e["oj-timeaxis-label"]={path:"labelStyle",property:"TEXT"},e},_GetEventTypes:function(){return["optionChange"]},_GetComponentRendererOptions:function(){return[]},_ProcessOptions:function(){this._super();var e=this,t=function(t){"string"!==typeof e.options[t]&&(e.options[t]=null)};t("start"),t("end");const n=this.options.scale;if(n)if(this.options._scaleLabelPosition={},n.name){const e=n.labelPosition||"auto",t="auto"===e?"center":e;this.options._scaleLabelPosition[n.name]=t}else this.options._scaleLabelPosition[n]="center";this.options._labelAlignment={horizontal:"middle",vertical:"middle"}},_LoadResources:function(){null==this.options._resources&&(this.options._resources={});var e=this.options._resources,t=new i.IntlDateTimeConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),n=new i.IntlDateTimeConverter({hour:"numeric",minute:"2-digit"}),o=new i.IntlDateTimeConverter({hour:"numeric"}),r=new i.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),a=new i.IntlDateTimeConverter({month:"long"}),l=new i.IntlDateTimeConverter({year:"numeric"}),u=new i.IntlDateTimeConverter({month:"short"}),m={seconds:t,minutes:n,hours:o,days:r,weeks:r,months:a,quarters:a,years:l},p={seconds:t,minutes:n,hours:o,days:r,weeks:r,months:u,quarters:u,years:new i.IntlDateTimeConverter({year:"2-digit"})};e.defaultDateTimeConverter=new i.IntlDateTimeConverter({formatType:"datetime",dateFormat:"medium",timeFormat:"medium"}),e.defaultDateConverter=new i.IntlDateTimeConverter({formatType:"date",dateFormat:"medium"}),e.converter=m,e.converterVert=p,e.axisClass="oj-timeaxis-container",e.axisLabelClass="oj-timeaxis-label",e.axisSeparatorClass="oj-timeaxis-separator",e.firstDayOfWeek=s.getFirstDayOfWeek()},_GetComponentNoClonePaths:function(){var e=this._super();return e.scale=!0,e.converter=!0,e._resources={converter:!0,defaultDateConverter:!0,defaultDateTimeConverter:!0},e}}),n.setDefaultOptions({ojTimeAxis:{converter:n.createDynamicPropertyGetter(function(){return{default:null,seconds:new i.IntlDateTimeConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),minutes:new i.IntlDateTimeConverter({hour:"numeric",minute:"2-digit"}),hours:new i.IntlDateTimeConverter({hour:"numeric"}),days:new i.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),weeks:new i.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),months:new i.IntlDateTimeConverter({month:"long"}),quarters:new i.IntlDateTimeConverter({month:"long"}),years:new i.IntlDateTimeConverter({year:"numeric"})}})}})});
//# sourceMappingURL=ojtimeaxis.js.map