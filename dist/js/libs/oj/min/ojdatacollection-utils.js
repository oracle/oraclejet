/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery"],function(t,e){t.DataCollectionEditUtils={},t.DataCollectionEditUtils.basicHandleEditEnd=function(n,i){var o,l;null!=i&&null!=i.cellContext||(i=n.detail),o=e(i.cellContext.parentElement).find(".oj-component-initnode")[0],l=t.Components.__GetWidgetConstructor(o),i.cancelEdit?l("reset"):(l("validate"),l("isValid")||n.preventDefault())},t.DataCollectionEditUtils.basicHandleRowEditEnd=function(n,i){var o,l,a,d=e(i.rowContext.parentElement).find(".oj-component-initnode");for(o=0;o<d.length;o++){a=t.Components.__GetWidgetConstructor(d[o]),l=i.cancelEdit;try{if(l)a("reset");else if(a("validate"),!a("isValid"))return!1}catch(t){}}return!0}});