/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","knockout"],function(a,g){a.rV=(new function(){function c(a,c,f){var h=a[f];c[f]=function(){var c=h?h.apply(a,arguments):null,e=b[f];if(null!=e){var g=arguments;e.forEach(function(b){var e=Array.prototype.slice.call(g);e.push(c,a);c=b.apply(null,e)})}return c}}this.U3=function(){var b=g.bindingProvider,e=b.instance;if(!e.getBindingAccessors)return a.C.error("JET's Knockout bindings are not compatible with the current binding provider since it does not implement getBindingAccessors()"),
this;var f=b.instance={},b=[];b.push("getBindingAccessors","nodeHasBindings","getBindings","preprocessNode");b.forEach(function(a){c(e,f,a)});return this};this.s2=function(a){Object.keys(a).forEach(function(c){b[c]=b[c]||[];b[c].push(a[c])})};var b={}}).U3()});