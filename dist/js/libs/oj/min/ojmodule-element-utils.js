/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","knockout"],function(e,r){var t=function(){};return e.Object.createSubclass(t,e.Object,"ModuleElementUtils"),e.ModuleElementUtils=t,{createView:t.createView=function(r){if(!r||!r.viewPath)return Promise.resolve([]);var t=new Promise(function(e,t){(r.require?r.require:require)(["text!"+r.viewPath],e,t)});return new Promise(function(r,i){t.then(function(t){var i=e.__HtmlUtils.stringToNodeArray(t);return r(i)},function(e){return i(e)})})},createViewModel:t.createViewModel=function(e){return e&&e.viewModelPath?new Promise(function(r,t){(e.require?e.require:require)([e.viewModelPath],r,t)}):Promise.resolve(null)}}});