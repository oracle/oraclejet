/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base","ojs/internal-deps/dvt/DvtPictoChart"],function(a,f,b,d,c){a.ya("oj.ojPictoChart",f.oj.dvtBaseComponent,{widgetEventPrefix:"oj",options:{optionChange:null,drill:null},sf:function(a,b,d){return c.PictoChart.newInstance(a,b,d)},hi:function(a){var b=a.subId;"oj-pictochart-item"==b?b="item["+a.index+"]":"oj-pictochart-tooltip"==b&&(b="tooltip");return b},jg:function(a){var b={};0==a.indexOf("item")?(b.subId="oj-pictochart-item",b.index=
this.Vg(a)):"tooltip"==a&&(b.subId="oj-pictochart-tooltip");return b},Ge:function(){var a=this._super();a.push("oj-pictochart");return a},ii:function(){var a=this._super();a["oj-pictochart-item"]={path:"_defaultColor",property:"background-color"};return a},ki:function(){return["optionChange"]},hk:function(a){"drill"===a.type?this._trigger("drill",null,{id:a.id}):this._super(a)},getItem:function(a){return this.ka.getAutomation().getItem(a)},getItemCount:function(){return this.ka.getAutomation().getItemCount()},
getContextByNode:function(a){return(a=this.getSubIdByNode(a))&&"oj-pictochart-tooltip"!==a.subId?a:null},ji:function(){return{root:["items"]}},Yz:function(){return!0}})});