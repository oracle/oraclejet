/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery"],function(a,g){a.eE={};o_("DataCollectionEditUtils",a.eE,a);a.eE.GOa=function(c,b){var d;null==b&&(b=c.detail);d=g(b.cellContext.parentElement).find(".oj-component-initnode")[0];d=a.Components.md(d);b.cancelEdit?d("reset"):(d("validate"),d("isValid")||c.preventDefault())};o_("DataCollectionEditUtils.basicHandleEditEnd",a.eE.GOa,a);a.eE.basicHandleRowEditEnd=function(c,b){var d,e,f,h=g(b.rowContext.parentElement).find(".oj-component-initnode");for(d=0;d<h.length;d++){f=
a.Components.md(h[d]);e=b.cancelEdit;try{if(e)f("reset");else if(f("validate"),!f("isValid"))return!1}catch(k){}}return!0};o_("DataCollectionEditUtils.basicHandleRowEditEnd",a.eE.basicHandleRowEditEnd,a)});