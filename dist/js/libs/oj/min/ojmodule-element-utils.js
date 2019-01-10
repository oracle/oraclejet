/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","knockout","ojs/ojhtmlutils"],function(e,r,i){var t={};return e.ModuleElementUtils=t,t.createView=function(e){if(!e||!e.viewPath)return Promise.resolve([]);var r=new Promise(function(r,i){(e.require?e.require:require)(["text!"+e.viewPath],r,i)});return new Promise(function(e,t){r.then(function(r){var t=i.stringToNodeArray(r);return e(t)},function(e){return t(e)})})},t.createViewModel=function(e){return e&&e.viewModelPath?new Promise(function(r,i){(e.require?e.require:require)([e.viewModelPath],r,i)}):Promise.resolve(null)},{createView:t.createView,createViewModel:t.createViewModel}});