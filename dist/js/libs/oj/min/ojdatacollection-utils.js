/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery"],function(t,e){t.DataCollectionEditUtils={},t.DataCollectionEditUtils.basicHandleEditEnd=function(n,i){null!=i&&null!=i.cellContext||(i=n.detail);var o=e(i.cellContext.parentElement).find(".oj-component-initnode")[0],l=t.Components.__GetWidgetConstructor(o);i.cancelEdit?l("reset"):(l("validate"),l("isValid")||n.preventDefault())},t.DataCollectionEditUtils.basicHandleRowEditEnd=function(n,i){for(var o=e(i.rowContext.parentElement).find(".oj-component-initnode"),l=0;l<o.length;l++){var a=t.Components.__GetWidgetConstructor(o[l]),d=i.cancelEdit;try{if(d)a("reset");else if(a("validate"),!a("isValid"))return!1}catch(t){}}return!0}});