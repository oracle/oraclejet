/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","knockout"],function(n,i){n.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE=(new function(){this.install=function(){var r=i.bindingProvider,e=r.instance;if(!e.getBindingAccessors)return n.Logger.error("JET's Knockout bindings are not compatible with the current binding provider since it does not implement getBindingAccessors()"),this;var o=r.instance={},s=[];return s.push("getBindingAccessors","nodeHasBindings","getBindings","preprocessNode"),s.forEach(function(n){!function(n,i,r){var e=n[r];i[r]=function(){var i=e?e.apply(n,arguments):null,o=t[r];if(null!=o){var s=arguments;o.forEach(function(t){var r=Array.prototype.slice.call(s);r.push(i,n),i=t.apply(null,r)})}return i}}(e,o,n)}),this},this.addPostprocessor=function(n){Object.keys(n).forEach(function(i){t[i]=t[i]||[],t[i].push(n[i])})};var t={}}).install()});