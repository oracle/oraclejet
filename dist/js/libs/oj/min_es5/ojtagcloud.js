/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcomponentcore","jquery","ojs/ojdvt-base","ojs/ojtagcloud-toolkit"],function(t,e,o,n,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var i={properties:{animationOnDataChange:{type:"string",enumValues:["auto","none"],value:"none"},animationOnDisplay:{type:"string",enumValues:["auto","none"],value:"none"},as:{type:"string",value:""},data:{type:"object"},hiddenCategories:{type:"Array<string>",writeback:!0,value:[]},highlightMatch:{type:"string",enumValues:["all","any"],value:"all"},highlightedCategories:{type:"Array<string>",writeback:!0,value:[]},hoverBehavior:{type:"string",enumValues:["dim","none"],value:"none"},items:{type:"Array<Object>|Promise"},layout:{type:"string",enumValues:["cloud","rectangular"],value:"rectangular"},selection:{type:"Array<any>",writeback:!0,value:[]},selectionMode:{type:"string",enumValues:["multiple","none","single"],value:"none"},styleDefaults:{type:"object",properties:{animationDuration:{type:"number"},hoverBehaviorDelay:{type:"number",value:200},svgStyle:{type:"object",value:{}}}},tooltip:{type:"object",properties:{renderer:{type:"function"}}},touchResponse:{type:"string",enumValues:["auto","touchStart"],value:"auto"},trackResize:{type:"string",enumValues:["off","on"],value:"on"},translations:{type:"object",value:{},properties:{componentName:{type:"string"},labelAndValue:{type:"string"},labelClearSelection:{type:"string"},labelCountWithTotal:{type:"string"},labelDataVisualization:{type:"string"},labelInvalidData:{type:"string"},labelNoData:{type:"string"},stateCollapsed:{type:"string"},stateDrillable:{type:"string"},stateExpanded:{type:"string"},stateHidden:{type:"string"},stateIsolated:{type:"string"},stateMaximized:{type:"string"},stateMinimized:{type:"string"},stateSelected:{type:"string"},stateUnselected:{type:"string"},stateVisible:{type:"string"}}}},methods:{getContextByNode:{},getItem:{},getItemCount:{},getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},extension:{}};i.extension._WIDGET_NAME="ojTagCloud",t.CustomElementBridge.register("oj-tag-cloud",{metadata:i});var r={properties:{categories:{type:"Array<string>",value:[]},color:{type:"string",value:""},label:{type:"string",value:""},shortDesc:{type:"string",value:""},svgClassName:{type:"string",value:""},svgStyle:{type:"object",value:{}},url:{type:"string",value:""},value:{type:"number"}},extension:{}};r.extension._CONSTRUCTOR=function(){},t.CustomElementBridge.register("oj-tag-cloud-item",{metadata:r}),t.__registerWidget("oj.ojTagCloud",o.oj.dvtBaseComponent,{widgetEventPrefix:"oj",options:{animationOnDataChange:"none",animationOnDisplay:"none",as:"",data:null,hiddenCategories:[],highlightedCategories:[],highlightMatch:"all",hoverBehavior:"none",items:null,layout:"rectangular",selection:[],selectionMode:"none",tooltip:{renderer:null},styleDefaults:{animationDuration:void 0,hoverBehaviorDelay:200},touchResponse:"auto"},_CreateDvtComponent:function(t,e,o){return a.TagCloud.newInstance(t,e,o)},_ConvertLocatorToSubId:function(t){var e=t.subId;return"oj-tagcloud-item"===e?e="item["+t.index+"]":"oj-tagcloud-tooltip"===e&&(e="tooltip"),e},_ConvertSubIdToLocator:function(t){var e={};return 0===t.indexOf("item")?(e.subId="oj-tagcloud-item",e.index=this._GetFirstIndex(t)):"tooltip"===t&&(e.subId="oj-tagcloud-tooltip"),e},_GetComponentStyleClasses:function(){var t=this._super();return t.push("oj-tagcloud"),t},_GetChildStyleClasses:function(){var t=this._super();return t["oj-dvtbase oj-tagcloud"]={path:"styleDefaults/animationDuration",property:"ANIM_DUR"},t["oj-tagcloud"]={path:"styleDefaults/svgStyle",property:"TEXT"},t},_GetEventTypes:function(){return["optionChange"]},_InitOptions:function(t,e){this._super(t,e);var o=this.options.styleDefaults;this.options.styleDefaults=o},getItem:function(t){return this._component.getAutomation().getItem(t)},getItemCount:function(){return this._component.getAutomation().getItemCount()},getContextByNode:function(t){var e=this.getSubIdByNode(t);return e&&"oj-tagcloud-tooltip"!==e.subId?e:null},_GetComponentDeferredDataPaths:function(){return{root:["items","data"]}},_GetSimpleDataProviderConfigs:function(){return{data:{templateName:"itemTemplate",templateElementName:"oj-tag-cloud-item",resultPath:"items"}}}}),e.setDefaultOptions({ojTagCloud:{styleDefaults:e.createDynamicPropertyGetter(function(t){return t.isCustomElement?{svgStyle:{}}:{}})}})});
//# sourceMappingURL=ojtagcloud.js.map