/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcomponentcore","jquery","ojs/ojdvt-base","ojs/ojdvt-treeview","ojs/ojkeyset"],function(e,t,o,r,a,n){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o;var l={properties:{animationDuration:{type:"number"},animationOnDataChange:{type:"string",enumValues:["auto","none"],value:"none"},animationOnDisplay:{type:"string",enumValues:["auto","none"],value:"none"},animationUpdateColor:{type:"string",value:""},as:{type:"string",value:""},colorLabel:{type:"string",value:""},data:{type:"object",extension:{webelement:{exceptionStatus:[{type:"unsupported",since:"13.0.0",description:"Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}]}}},displayLevels:{type:"number",value:17976931348623157e292},drilling:{type:"string",enumValues:["off","on"],value:"off"},groupGaps:{type:"string",enumValues:["all","none","outer"],value:"outer"},hiddenCategories:{type:"Array<string>",writeback:!0,value:[]},highlightMatch:{type:"string",enumValues:["all","any"],value:"all"},highlightMode:{type:"string",enumValues:["categories","descendants"],value:"categories"},highlightedCategories:{type:"Array<string>",writeback:!0,value:[]},hoverBehavior:{type:"string",enumValues:["dim","none"],value:"none"},hoverBehaviorDelay:{type:"number",value:200},isolatedNode:{type:"any",writeback:!0,value:""},layout:{type:"string",enumValues:["sliceAndDiceHorizontal","sliceAndDiceVertical","squarified"],value:"squarified"},nodeContent:{type:"object",properties:{renderer:{type:"function"}}},nodeDefaults:{type:"object",properties:{groupLabelDisplay:{type:"string",enumValues:["header","node","off"],value:"header"},header:{type:"object",properties:{backgroundColor:{type:"string"},borderColor:{type:"string"},hoverBackgroundColor:{type:"string"},hoverInnerColor:{type:"string"},hoverOuterColor:{type:"string"},isolate:{type:"string",enumValues:["off","on"],value:"on"},labelHalign:{type:"string",enumValues:["center","end","start"],value:"start"},labelStyle:{type:"object"},selectedBackgroundColor:{type:"string"},selectedInnerColor:{type:"string"},selectedOuterColor:{type:"string"},useNodeColor:{type:"string",enumValues:["off","on"],value:"off"}}},hoverColor:{type:"string"},labelDisplay:{type:"string",enumValues:["node","off"],value:"node"},labelHalign:{type:"string",enumValues:["center","end","start"],value:"center"},labelMinLength:{type:"number",value:1},labelStyle:{type:"object"},labelValign:{type:"string",enumValues:["bottom","center","top"],value:"center"},selectedInnerColor:{type:"string"},selectedOuterColor:{type:"string"}}},nodeSeparators:{type:"string",enumValues:["bevels","gaps"],value:"gaps"},nodes:{type:"Array<Object>|Promise"},rootNode:{type:"any",value:""},selection:{type:"Array<any>",writeback:!0,value:[]},selectionMode:{type:"string",enumValues:["multiple","none","single"],value:"multiple"},sizeLabel:{type:"string",value:""},sorting:{type:"string",enumValues:["off","on"],value:"off"},tooltip:{type:"object",properties:{renderer:{type:"function"}}},touchResponse:{type:"string",enumValues:["auto","touchStart"],value:"auto"},trackResize:{type:"string",enumValues:["off","on"],value:"on"},translations:{type:"object",value:{},properties:{accessibleContainsControls:{type:"string"},componentName:{type:"string"},labelAndValue:{type:"string"},labelClearSelection:{type:"string"},labelColor:{type:"string"},labelCountWithTotal:{type:"string"},labelDataVisualization:{type:"string"},labelInvalidData:{type:"string"},labelNoData:{type:"string"},labelSize:{type:"string"},stateCollapsed:{type:"string"},stateDrillable:{type:"string"},stateExpanded:{type:"string"},stateHidden:{type:"string"},stateIsolated:{type:"string"},stateMaximized:{type:"string"},stateMinimized:{type:"string"},stateSelected:{type:"string"},stateUnselected:{type:"string"},stateVisible:{type:"string"},tooltipIsolate:{type:"string"},tooltipRestore:{type:"string"}}}},methods:{getContextByNode:{},getNode:{},getProperty:{},refresh:{},setProperties:{},setProperty:{},getNodeBySubId:{},getSubIdByNode:{}},events:{ojBeforeDrill:{},ojDrill:{}},extension:{}};l.extension._WIDGET_NAME="ojTreemap",e.CustomElementBridge.register("oj-treemap",{metadata:l});var s={properties:{categories:{type:"Array<string>",value:[]},color:{type:"string",value:"#000000"},drilling:{type:"string",enumValues:["inherit","off","on"],value:"inherit"},groupLabelDisplay:{type:"string",enumValues:["header","node","off"]},header:{type:"object",properties:{isolate:{type:"string",enumValues:["off","on"]},labelHalign:{type:"string",enumValues:["center","end","start"]},labelStyle:{type:"object"},useNodeColor:{type:"string",enumValues:["off","on"]}}},label:{type:"string",value:""},labelDisplay:{type:"string",enumValues:["node","off"]},labelHalign:{type:"string",enumValues:["center","end","start"]},labelStyle:{type:"object",value:{}},labelValign:{type:"string",enumValues:["bottom","center","top"]},pattern:{type:"string",enumValues:["largeChecker","largeCrosshatch","largeDiagonalLeft","largeDiagonalRight","largeDiamond","largeTriangle","none","smallChecker","smallCrosshatch","smallDiagonalLeft","smallDiagonalRight","smallDiamond","smallTriangle"],value:"none"},selectable:{type:"string",enumValues:["auto","off"],value:"auto"},shortDesc:{type:"string|function",value:""},svgClassName:{type:"string",value:""},svgStyle:{type:"object",value:{}},value:{type:"number"}},extension:{}};s.extension._CONSTRUCTOR=function(){},e.CustomElementBridge.register("oj-treemap-node",{metadata:s}),e.__registerWidget("oj.ojTreemap",o.oj.dvtBaseComponent,{widgetEventPrefix:"oj",options:{animationDuration:void 0,animationOnDataChange:"none",animationOnDisplay:"none",animationUpdateColor:"",as:"",data:null,hiddenCategories:[],highlightedCategories:[],highlightMatch:"all",highlightMode:"categories",hoverBehavior:"none",hoverBehaviorDelay:200,nodeContent:{renderer:null},tooltip:{renderer:null},groupGaps:"outer",displayLevels:Number.MAX_VALUE,layout:"squarified",nodes:null,nodeDefaults:{labelStyle:void 0,labelDisplay:"node",groupLabelDisplay:"header",labelHalign:"center",labelMinLength:1,labelValign:"center",hoverColor:void 0,selectedInnerColor:void 0,selectedOuterColor:void 0,header:{backgroundColor:void 0,borderColor:void 0,hoverBackgroundColor:void 0,hoverInnerColor:void 0,hoverOuterColor:void 0,selectedBackgroundColor:void 0,selectedInnerColor:void 0,selectedOuterColor:void 0,labelHalign:"start",labelStyle:void 0,isolate:"on",useNodeColor:"off"}},nodeSeparators:"gaps",selectionMode:"multiple",sorting:"off",colorLabel:"",sizeLabel:"",drilling:"off",rootNode:"",selection:[],isolatedNode:"",touchResponse:"auto",beforeDrill:null,drill:null},_CreateDvtComponent:function(e,t,o){return new a.Treemap(e,t,o)},_GetSimpleDataProviderConfigs:function(){return{data:{templateName:"nodeTemplate",templateElementName:"oj-treemap-node",resultPath:"nodes",expandedKeySet:new n.AllKeySetImpl}}},_OptionChangeHandler:function(e){Object.prototype.hasOwnProperty.call(e,"displayLevels")&&this._ClearDataProviderState("data"),this._super(e)},_ConvertLocatorToSubId:function(e){var t=e.subId;return"oj-treemap-node"===t?t="node"+this._GetStringFromIndexPath(e.indexPath):"oj-treemap-tooltip"===t&&(t="tooltip"),t},_ConvertSubIdToLocator:function(e){var t={};return 0===e.indexOf("node")?(t.subId="oj-treemap-node",t.indexPath=this._GetIndexPath(e)):"tooltip"===e&&(t.subId="oj-treemap-tooltip"),t},_GetComponentStyleClasses:function(){var e=this._super();return e.push("oj-treemap"),e},_GetChildStyleClasses:function(){var e=this._super();return e["oj-dvtbase oj-treemap"]={path:"animationDuration",property:"ANIM_DUR"},e["oj-treemap-attribute-type-text"]={path:"styleDefaults/_attributeTypeTextStyle",property:"TEXT"},e["oj-treemap-attribute-value-text"]={path:"styleDefaults/_attributeValueTextStyle",property:"TEXT"},e["oj-treemap-drill-text "]={path:"styleDefaults/_drillTextStyle",property:"TEXT"},e["oj-treemap-current-drill-text "]={path:"styleDefaults/_currentTextStyle",property:"TEXT"},e["oj-treemap-node"]={path:"nodeDefaults/labelStyle",property:"TEXT"},e["oj-treemap-node oj-hover"]={path:"nodeDefaults/hoverColor",property:"border-top-color"},e["oj-treemap-node oj-selected"]=[{path:"nodeDefaults/selectedOuterColor",property:"border-top-color"},{path:"nodeDefaults/selectedInnerColor",property:"border-bottom-color"}],e["oj-treemap-node-header"]=[{path:"nodeDefaults/header/backgroundColor",property:"background-color"},{path:"nodeDefaults/header/borderColor",property:"border-top-color"},{path:"nodeDefaults/header/_labelStyle",property:"TEXT"}],e["oj-treemap-node-header oj-hover"]=[{path:"nodeDefaults/header/hoverBackgroundColor",property:"background-color"},{path:"nodeDefaults/header/hoverOuterColor",property:"border-top-color"},{path:"nodeDefaults/header/hoverInnerColor",property:"border-bottom-color"},{path:"nodeDefaults/header/_hoverLabelStyle",property:"TEXT"}],e["oj-treemap-node-header oj-selected"]=[{path:"nodeDefaults/header/selectedBackgroundColor",property:"background-color"},{path:"nodeDefaults/header/selectedOuterColor",property:"border-top-color"},{path:"nodeDefaults/header/selectedInnerColor",property:"border-bottom-color"},{path:"nodeDefaults/header/_selectedLabelStyle",property:"TEXT"}],e},_GetEventTypes:function(){return["optionChange","drill","beforeDrill"]},_HandleEvent:function(e){var t=e.type;if("isolate"===t){var r=this.options._isolatedNodes;r||(this.options._isolatedNodes=[],r=this.options._isolatedNodes);var a=e.id;a?(r.push(a),this._UserOptionChange("isolatedNode",a)):(a=r.pop(),this._UserOptionChange("isolatedNode",r.length>0?r[r.length]:null))}else if("drill"===t){var n,l=e.data;l&&l._noTemplate?(n=l._itemData,l=l._itemData):l&&l._itemData&&(n=l._itemData,delete(l=o.extend({},e.data))._itemData);var s={id:e.id,data:l,itemData:n};this._IsCustomElement()||(s.component=e.component),e.id&&this._trigger("beforeDrill",null,s)&&(this._UserOptionChange("rootNode",e.id),this._Render(),this._trigger("drill",null,s))}else this._super(e)},_GetComponentRendererOptions:function(){return[{path:"tooltip/renderer",slot:"tooltipTemplate"},{path:"nodeContent/renderer",slot:"nodeContentTemplate"}]},_ProcessOptions:function(){this._super();var e=this.options.nodeContent;e&&e._renderer&&(e.renderer=this._GetTemplateRenderer(e._renderer,"nodeContent"))},_LoadResources:function(){null==this.options._resources&&(this.options._resources={});var e=this.options._resources;e.isolate="oj-fwk-icon oj-fwk-icon-maximize",e.restore="oj-fwk-icon oj-fwk-icon-minimize"},getNode:function(e){return this._component.getAutomation().getNode(e)},getContextByNode:function(e){var t=this.getSubIdByNode(e);return t&&"oj-treemap-tooltip"!==t.subId?t:null},_GetComponentDeferredDataPaths:function(){return{root:["nodes","data"]}}})});
//# sourceMappingURL=ojtreemap.js.map