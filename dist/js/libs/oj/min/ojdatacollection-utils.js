/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery"],function(a,g){a.sH={};o_("DataCollectionEditUtils",a.sH,a);a.sH.J0a=function(c,b){var d;if(null==b||null==b.cellContext)b=c.detail;d=g(b.cellContext.parentElement).find(".oj-component-initnode")[0];d=a.Components.qd(d);b.cancelEdit?d("reset"):(d("validate"),d("isValid")||c.preventDefault())};o_("DataCollectionEditUtils.basicHandleEditEnd",a.sH.J0a,a);a.sH.basicHandleRowEditEnd=function(c,b){var d,e,f,h=g(b.rowContext.parentElement).find(".oj-component-initnode");for(d=
0;d<h.length;d++){f=a.Components.qd(h[d]);e=b.cancelEdit;try{if(e)f("reset");else if(f("validate"),!f("isValid"))return!1}catch(k){}}return!0};o_("DataCollectionEditUtils.basicHandleRowEditEnd",a.sH.basicHandleRowEditEnd,a)});