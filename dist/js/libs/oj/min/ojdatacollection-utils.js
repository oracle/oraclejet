/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery"],function(a,g){a.VA={};o_("DataCollectionEditUtils",a.VA,a);a.VA.yEa=function(c,b){var d;d=g(b.cellContext.parentElement).find(".oj-component-initnode")[0];d=a.Components.Kf(d);if(b.cancelEdit)d("reset");else if(d("validate"),!d("isValid"))return!1;return!0};o_("DataCollectionEditUtils.basicHandleEditEnd",a.VA.yEa,a);a.VA.basicHandleRowEditEnd=function(c,b){var d,e,f,h=g(b.rowContext.parentElement).find(".oj-component-initnode");for(d=0;d<h.length;d++){f=a.Components.Kf(h[d]);
e=b.cancelEdit;try{if(e)f("reset");else if(f("validate"),!f("isValid"))return!1}catch(k){}}return!0};o_("DataCollectionEditUtils.basicHandleRowEditEnd",a.VA.basicHandleRowEditEnd,a)});