/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery"],function(a,g){a.MF={};o_("DataCollectionEditUtils",a.MF,a);a.MF.bWa=function(c,b){var d;null==b&&(b=c.detail);d=g(b.cellContext.parentElement).find(".oj-component-initnode")[0];d=a.Components.ud(d);b.cancelEdit?d("reset"):(d("validate"),d("isValid")||c.preventDefault())};o_("DataCollectionEditUtils.basicHandleEditEnd",a.MF.bWa,a);a.MF.basicHandleRowEditEnd=function(c,b){var d,e,f,h=g(b.rowContext.parentElement).find(".oj-component-initnode");for(d=0;d<h.length;d++){f=
a.Components.ud(h[d]);e=b.cancelEdit;try{if(e)f("reset");else if(f("validate"),!f("isValid"))return!1}catch(k){}}return!0};o_("DataCollectionEditUtils.basicHandleRowEditEnd",a.MF.basicHandleRowEditEnd,a)});