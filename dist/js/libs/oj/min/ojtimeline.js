/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojtime-base","ojs/internal-deps/dvt/DvtTimeline"],function(e,o,t,r,i){e.__registerWidget("oj.ojTimeline",o.oj.dvtTimeComponent,{widgetEventPrefix:"oj",options:{animationOnDataChange:"none",animationOnDisplay:"none",end:"",minorAxis:{converter:{default:null,seconds:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),minutes:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour:"numeric",minute:"2-digit"}),hours:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour:"numeric"}),days:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"numeric",day:"2-digit"}),weeks:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"numeric",day:"2-digit"}),months:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"long"}),quarters:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"long"}),years:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({year:"numeric"})},scale:null,svgStyle:{},zoomOrder:null},majorAxis:{converter:{default:null,seconds:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour:"numeric",minute:"2-digit",second:"2-digit"}),minutes:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour:"numeric",minute:"2-digit"}),hours:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({hour:"numeric"}),days:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"numeric",day:"2-digit"}),weeks:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"numeric",day:"2-digit"}),months:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"long"}),quarters:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({month:"long"}),years:e.Validation.converterFactory(e.ConverterFactory.CONVERTER_TYPE_DATETIME).createConverter({year:"numeric"})},scale:null,svgStyle:{}},orientation:"horizontal",overview:{rendered:"off",svgStyle:{}},referenceObjects:[],selection:[],selectionMode:"none",series:null,start:"",styleDefaults:{animationDuration:void 0,borderColor:void 0,item:{backgroundColor:void 0,borderColor:void 0,descriptionStyle:void 0,hoverBackgroundColor:void 0,hoverBorderColor:void 0,selectedBackgroundColor:void 0,selectedBorderColor:void 0,titleStyle:void 0},minorAxis:{backgroundColor:void 0,borderColor:void 0,labelStyle:void 0,separatorColor:void 0},majorAxis:{labelStyle:void 0,separatorColor:void 0},overview:{backgroundColor:void 0,labelStyle:void 0,window:{backgroundColor:void 0,borderColor:void 0}},referenceObject:{color:void 0},series:{backgroundColor:void 0,colors:["#237bb1","#68c182","#fad55c","#ed6647","#8561c8","#6ddbdb","#ffb54d","#e371b2","#47bdef","#a2bf39","#a75dba","#f7f37b"],emptyTextStyle:void 0,labelStyle:void 0}},viewportEnd:"",viewportStart:"",viewportChange:null},_CreateDvtComponent:function(e,o,t){return i.Timeline.newInstance(e,o,t)},_ConvertLocatorToSubId:function(e){var o=e.subId;return"oj-timeline-item"==o&&(o="timelineItem["+e.seriesIndex+"]["+e.itemIndex+"]"),o},_ConvertSubIdToLocator:function(e){var o={};if(0==e.indexOf("timelineItem")){var t=this._GetIndexPath(e);o.subId="oj-timeline-item",o.seriesIndex=t[0],o.itemIndex=t[1]}return o},_ProcessStyles:function(){if(this._super(),this.options.styleDefaults||(this.options.styleDefaults={}),this.options.styleDefaults.series||(this.options.styleDefaults.series={}),!this.options.styleDefaults.series.colors){var o=new e.ColorAttributeGroupHandler;this.options.styleDefaults.series.colors=o.getValueRamp()}},_GetComponentStyleClasses:function(){var e=this._super();return e.push("oj-timeline"),e},_GetComponentRendererOptions:function(){return[]},_GetChildStyleClasses:function(){var e=this._super();return e["oj-dvtbase oj-timeline"]={path:"styleDefaults/animationDuration",property:"ANIM_DUR"},e["oj-timeline"]={path:"styleDefaults/borderColor",property:"border-color"},e["oj-timeline-item"]=[{path:"styleDefaults/item/borderColor",property:"border-color"},{path:"styleDefaults/item/backgroundColor",property:"background-color"}],e["oj-timeline-item oj-hover"]=[{path:"styleDefaults/item/hoverBorderColor",property:"border-color"},{path:"styleDefaults/item/hoverBackgroundColor",property:"background-color"}],e["oj-timeline-item oj-selected"]=[{path:"styleDefaults/item/selectedBorderColor",property:"border-color"},{path:"styleDefaults/item/selectedBackgroundColor",property:"background-color"}],e["oj-timeline-item-description"]={path:"styleDefaults/item/descriptionStyle",property:"TEXT"},e["oj-timeline-item-title"]={path:"styleDefaults/item/titleStyle",property:"TEXT"},e["oj-timeline-major-axis-label"]={path:"styleDefaults/majorAxis/labelStyle",property:"TEXT"},e["oj-timeline-major-axis-separator"]={path:"styleDefaults/majorAxis/separatorColor",property:"color"},e["oj-timeline-minor-axis"]=[{path:"styleDefaults/minorAxis/backgroundColor",property:"background-color"},{path:"styleDefaults/minorAxis/borderColor",property:"border-color"}],e["oj-timeline-minor-axis-label"]={path:"styleDefaults/minorAxis/labelStyle",property:"TEXT"},e["oj-timeline-minor-axis-separator"]={path:"styleDefaults/minorAxis/separatorColor",property:"color"},e["oj-timeline-overview"]={path:"styleDefaults/overview/backgroundColor",property:"background-color"},e["oj-timeline-overview-label"]={path:"styleDefaults/overview/labelStyle",property:"TEXT"},e["oj-timeline-overview-window"]=[{path:"styleDefaults/overview/window/backgroundColor",property:"background-color"},{path:"styleDefaults/overview/window/borderColor",property:"border-color"}],e["oj-timeline-reference-object"]={path:"styleDefaults/referenceObject/color",property:"color"},e["oj-timeline-series"]={path:"styleDefaults/series/backgroundColor",property:"background-color"},e["oj-timeline-series-empty-text"]={path:"styleDefaults/series/emptyTextStyle",property:"TEXT"},e["oj-timeline-series-label"]={path:"styleDefaults/series/labelStyle",property:"TEXT"},e["oj-timeline-zoomin-icon"]=[{path:"_resources/zoomIn_bgc",property:"background-color"},{path:"_resources/zoomIn_bc",property:"border-color"}],e["oj-timeline-zoomin-icon oj-hover"]=[{path:"_resources/zoomIn_h_bgc",property:"background-color"},{path:"_resources/zoomIn_h_bc",property:"border-color"}],e["oj-timeline-zoomin-icon oj-active"]=[{path:"_resources/zoomIn_a_bgc",property:"background-color"},{path:"_resources/zoomIn_a_bc",property:"border-color"}],e["oj-timeline-zoomin-icon oj-disabled"]=[{path:"_resources/zoomIn_d_bgc",property:"background-color"},{path:"_resources/zoomIn_d_bc",property:"border-color"}],e["oj-timeline-zoomout-icon"]=[{path:"_resources/zoomOut_bgc",property:"background-color"},{path:"_resources/zoomOut_bc",property:"border-color"}],e["oj-timeline-zoomout-icon oj-hover"]=[{path:"_resources/zoomOut_h_bgc",property:"background-color"},{path:"_resources/zoomOut_h_bc",property:"border-color"}],e["oj-timeline-zoomout-icon oj-active"]=[{path:"_resources/zoomOut_a_bgc",property:"background-color"},{path:"_resources/zoomOut_a_bc",property:"border-color"}],e["oj-timeline-zoomout-icon oj-disabled"]=[{path:"_resources/zoomOut_d_bgc",property:"background-color"},{path:"_resources/zoomOut_d_bc",property:"border-color"}],e},_GetTranslationMap:function(){var e=this.options.translations,o=this._super();return o["DvtUtilBundle.TIMELINE"]=e.componentName,o["DvtUtilBundle.TIMELINE_SERIES"]=e.labelSeries,o["DvtUtilBundle.ZOOM_IN"]=e.tooltipZoomIn,o["DvtUtilBundle.ZOOM_OUT"]=e.tooltipZoomOut,o},_LoadResources:function(){this._super();var e=this.options._resources,o=e.converter,t=e.converterFactory,r=t.createConverter({month:"short"}),i=t.createConverter({year:"2-digit"}),n={seconds:o.seconds,minutes:o.minutes,hours:o.hours,days:o.days,weeks:o.weeks,months:r,quarters:r,years:i};e.converterVert=n,e.zoomIn="oj-timeline-zoomin-icon",e.zoomIn_h="oj-timeline-zoomin-icon oj-hover",e.zoomIn_a="oj-timeline-zoomin-icon oj-active",e.zoomIn_d="oj-timeline-zoomin-icon oj-disabled",e.zoomOut="oj-timeline-zoomout-icon",e.zoomOut_h="oj-timeline-zoomout-icon oj-hover",e.zoomOut_a="oj-timeline-zoomout-icon oj-active",e.zoomOut_d="oj-timeline-zoomout-icon oj-disabled",e.overviewHandleHor="oj-timeline-overview-window-handle-horizontal",e.overviewHandleVert="oj-timeline-overview-window-handle-vertical"},_GetComponentDeferredDataPaths:function(){return{root:["series"]}},getContextByNode:function(e){return this.getSubIdByNode(e)}}),e.CustomElementBridge.registerMetadata("oj-timeline","dvtTimeComponent",{properties:{animationOnDataChange:{type:"string",enumValues:["auto","none"]},animationOnDisplay:{type:"string",enumValues:["auto","none"]},end:{type:"string"},majorAxis:{type:"object",properties:{converter:{type:"object",properties:{days:{},default:{},hours:{},minutes:{},months:{},quarters:{},seconds:{},weeks:{},years:{}}},scale:{type:"string",enumValues:["seconds","minutes","hours","days","weeks","months","quarters","years"]},svgStyle:{type:"object"}}},minorAxis:{type:"object",properties:{converter:{type:"object",properties:{days:{},default:{},hours:{},minutes:{},months:{},quarters:{},seconds:{},weeks:{},years:{}}},scale:{type:"string",enumValues:["seconds","minutes","hours","days","weeks","months","quarters","years"]},svgStyle:{type:"object"},zoomOrder:{type:"Array<string>"}}},orientation:{type:"string"},overview:{type:"object",properties:{rendered:{type:"string",enumValues:["on","off"]},svgStyle:{type:"object"}}},referenceObjects:{type:"Array<object>"},selection:{type:"Array<string>",writeback:!0},selectionMode:{type:"string",enumValues:["single","multiple","none"]},series:{type:"Array<object>|Promise"},start:{type:"string"},styleDefaults:{type:"object",properties:{animationDuration:{type:"number"},borderColor:{type:"string"},item:{type:"object",properties:{item:{backgroundColor:{type:"string"},borderColor:{type:"string"},descriptionStyle:{type:"object"},hoverBackgroundColor:{type:"string"},hoverBorderColor:{type:"string"},selectedBackgroundColor:{type:"string"},selectedBorderColor:{type:"string"},titleStyle:{type:"object"}}}},majorAxis:{type:"object",properties:{majorAxis:{labelStyle:{type:"object"},separatorColor:{type:"string"}}}},minorAxis:{type:"object",properties:{minorAxis:{backgroundColor:{type:"string"},borderColor:{type:"string"},labelStyle:{type:"object"},separatorColor:{type:"string"}}}},overview:{type:"object",properties:{overview:{backgroundColor:{type:"string"},labelStyle:{type:"object"},window:{type:"object",properties:{window:{backgroundColor:{type:"string"},borderColor:{type:"string"}}}}}}},referenceObject:{type:"object",properties:{referenceObject:{color:{type:"string"}}}},series:{type:"object",properties:{series:{backgroundColor:{type:"string"},colors:{type:"Array<string>"},emptyTextStyle:{type:"object"},labelStyle:{type:"object"}}}}}},translations:{type:"Object",properties:{accessibleItemDesc:{type:"string",value:"Description is {0}."},accessibleItemEnd:{type:"string",value:"End time is {0}."},accessibleItemStart:{type:"string",value:"Start time is {0}."},accessibleItemTitle:{type:"string",value:"Title is {0}."},componentName:{type:"string",value:"Timeline"},labelAndValue:{type:"string",value:"{0}: {1}"},labelClearSelection:{type:"string",value:"Clear Selection"},labelCountWithTotal:{type:"string",value:"{0} of {1}"},labelDataVisualization:{type:"string",value:"Data Visualization"},labelInvalidData:{type:"string",value:"Invalid data"},labelNoData:{type:"string",value:"No data to display"},labelSeries:{type:"string",value:"Series"},stateCollapsed:{type:"string",value:"Collapsed"},stateDrillable:{type:"string",value:"Drillable"},stateExpanded:{type:"string",value:"Expanded"},stateHidden:{type:"string",value:"Hidden"},stateIsolated:{type:"string",value:"Isolated"},stateMaximized:{type:"string",value:"Maximized"},stateMinimized:{type:"string",value:"Minimized"},stateSelected:{type:"string",value:"Selected"},stateUnselected:{type:"string",value:"Unselected"},stateVisible:{type:"string",value:"Visible"},tooltipZoomIn:{type:"string",value:"Zoom In"},tooltipZoomOut:{type:"string",value:"Zoom Out"}}},viewportEnd:{type:"string"},viewportStart:{type:"string"}},methods:{getContextByNode:{}},events:{viewportChange:{}},extension:{_WIDGET_NAME:"ojTimeline"}}),e.CustomElementBridge.register("oj-timeline",{metadata:e.CustomElementBridge.getMetadata("oj-timeline")})});