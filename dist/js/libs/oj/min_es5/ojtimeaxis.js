!function(){function e(t){return(e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(t)}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */define(["ojs/ojcore-base","jquery","ojs/ojcomponentcore","ojs/ojdvt-base","ojs/ojtimeaxis-toolkit","ojs/ojlocaledata","ojs/ojconverter-datetime","ojs/ojconverterutils-i18n","ojs/ojconverter-number"],function(t,n,r,o,s,i,a,l,u){"use strict";
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var m;t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n,(m={properties:{converter:{type:"object",properties:{days:{type:"object"},default:{type:"object"},hours:{type:"object"},minutes:{type:"object"},months:{type:"object"},quarters:{type:"object"},seconds:{type:"object"},weeks:{type:"object"},years:{type:"object"}}},end:{type:"string",value:""},scale:{type:"string",enumValues:["days","hours","minutes","months","quarters","seconds","weeks","years"]},start:{type:"string",value:""},trackResize:{type:"string",enumValues:["off","on"],value:"on"},translations:{type:"object",value:{},properties:{componentName:{type:"string"},labelAndValue:{type:"string"},labelClearSelection:{type:"string"},labelCountWithTotal:{type:"string"},labelDataVisualization:{type:"string"},labelInvalidData:{type:"string"},labelNoData:{type:"string"},stateCollapsed:{type:"string"},stateDrillable:{type:"string"},stateExpanded:{type:"string"},stateHidden:{type:"string"},stateIsolated:{type:"string"},stateMaximized:{type:"string"},stateMinimized:{type:"string"},stateSelected:{type:"string"},stateUnselected:{type:"string"},stateVisible:{type:"string"}}}},methods:{getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}}).extension._WIDGET_NAME="ojTimeAxis",t.CustomElementBridge.register("oj-time-axis",{metadata:m}),
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2016 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
t.__registerWidget("oj.ojTimeAxis",n.oj.dvtBaseComponent,{widgetEventPrefix:"oj",options:{converter:{default:null,seconds:new a.IntlDateTimeConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),minutes:new a.IntlDateTimeConverter({hour:"numeric",minute:"2-digit"}),hours:new a.IntlDateTimeConverter({hour:"numeric"}),days:new a.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),weeks:new a.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),months:new a.IntlDateTimeConverter({month:"long"}),quarters:new a.IntlDateTimeConverter({month:"long"}),years:new a.IntlDateTimeConverter({year:"numeric"})},start:"",end:"",scale:null},_ComponentCreate:function(){this._super(),this._SetLocaleHelpers(u,l)},_CreateDvtComponent:function(e,t,n){return s.TimeAxis.newInstance(e,t,n)},_GetComponentStyleClasses:function(){var e=this._super();return e.push("oj-timeaxis"),e},_GetChildStyleClasses:function(){var e=this._super();return e["oj-timeaxis-label"]={path:"labelStyle",property:"TEXT"},e},_GetEventTypes:function(){return["optionChange"]},_GetComponentRendererOptions:function(){return[]},_ProcessOptions:function(){this._super();var t=this,n=function(n){var r=e(t.options[n]);"number"!==r&&"string"!==r&&(t.options[n]=null)};n("start"),n("end")},_LoadResources:function(){null==this.options._resources&&(this.options._resources={});var e=this.options._resources,t=new a.IntlDateTimeConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),n=new a.IntlDateTimeConverter({hour:"numeric",minute:"2-digit"}),r=new a.IntlDateTimeConverter({hour:"numeric"}),o=new a.IntlDateTimeConverter({month:"numeric",day:"2-digit"}),s=new a.IntlDateTimeConverter({month:"long"}),l=new a.IntlDateTimeConverter({year:"numeric"}),u=new a.IntlDateTimeConverter({month:"short"}),m={seconds:t,minutes:n,hours:r,days:o,weeks:o,months:s,quarters:s,years:l},p={seconds:t,minutes:n,hours:r,days:o,weeks:o,months:u,quarters:u,years:new a.IntlDateTimeConverter({year:"2-digit"})};e.defaultDateTimeConverter=new a.IntlDateTimeConverter({formatType:"datetime",dateFormat:"medium",timeFormat:"medium"}),e.defaultDateConverter=new a.IntlDateTimeConverter({formatType:"date",dateFormat:"medium"}),e.converter=m,e.converterVert=p,e.axisClass="oj-timeaxis-container",e.axisLabelClass="oj-timeaxis-label",e.axisSeparatorClass="oj-timeaxis-separator",e.borderTopVisible=!1,e.borderRightVisible=!1,e.borderBottomVisible=!1,e.borderLeftVisible=!1,e.firstDayOfWeek=i.getFirstDayOfWeek()}})})}();
//# sourceMappingURL=ojtimeaxis.js.map