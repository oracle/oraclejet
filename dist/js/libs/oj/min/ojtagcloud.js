/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery","ojs/ojcomponentcore","ojs/ojdvt-base","ojs/internal-deps/dvt/DvtTagCloud"],function(b,f,a,d,c){b.ya("oj.ojTagCloud",f.oj.dvtBaseComponent,{widgetEventPrefix:"oj",options:{optionChange:null},pf:function(a,b,d){return c.TagCloud.newInstance(a,b,d)},ei:function(a){var b=a.subId;"oj-tagcloud-item"==b?b="item["+a.index+"]":"oj-tagcloud-tooltip"==b&&(b="tooltip");return b},ig:function(a){var b={};0==a.indexOf("item")?(b.subId="oj-tagcloud-item",b.index=this.Wg(a)):"tooltip"==
a&&(b.subId="oj-tagcloud-tooltip");return b},Fe:function(){var a=this._super();a.push("oj-tagcloud");return a},gi:function(){var a=this._super();a["oj-tagcloud"]={path:"styleDefaults/style",property:"CSS_TEXT_PROPERTIES"};return a},ii:function(){return["optionChange"]},ji:function(){var a=this.options.translations,b=this._super();b["DvtUtilBundle.TAG_CLOUD"]=a.componentName;return b},getItem:function(a){return this.la.getAutomation().getItem(a)},getItemCount:function(){return this.la.getAutomation().getItemCount()},
getContextByNode:function(a){return(a=this.getSubIdByNode(a))&&"oj-tagcloud-tooltip"!==a.subId?a:null},hi:function(){return{root:["items"]}}})});