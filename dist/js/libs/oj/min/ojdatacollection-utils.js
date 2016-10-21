/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","jquery"],function(a,g){a.iB={};o_("DataCollectionEditUtils",a.iB,a);a.iB.JFa=function(b,c){var d;d=g(c.cellContext.parentElement).find(".oj-component-initnode")[0];d=a.Components.De(d);if(c.cancelEdit)d("reset");else if(d("validate"),!d("isValid"))return!1;return!0};o_("DataCollectionEditUtils.basicHandleEditEnd",a.iB.JFa,a);a.iB.basicHandleRowEditEnd=function(b,c){var d,e,f,h=g(c.rowContext.parentElement).find(".oj-component-initnode");for(d=0;d<h.length;d++){f=a.Components.De(h[d]);
e=c.cancelEdit;try{if(e)f("reset");else if(f("validate"),!f("isValid"))return!1}catch(k){}}return!0};o_("DataCollectionEditUtils.basicHandleRowEditEnd",a.iB.basicHandleRowEditEnd,a)});