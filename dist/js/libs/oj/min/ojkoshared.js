/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","knockout"],function(n,i){n.__KO_CUSTOM_BINDING_PROVIDER_INSTANCE=(new function(){this.install=function(){var r=i.bindingProvider,t=r.instance;if(!t.getBindingAccessors)return n.Logger.error("JET's Knockout bindings are not compatible with the current binding provider since it does not implement getBindingAccessors()"),this;var o=r.instance={},s=[];return s.push("getBindingAccessors","nodeHasBindings","getBindings","preprocessNode"),s.forEach(function(n){!function(n,r,t){var o=n[t];r[t]=function(){var r=o?o.apply(n,arguments):null,s=e[t];if(null!=s){var c=arguments;s.forEach(function(e){var t=Array.prototype.slice.call(c);t.push(r,n),r=i.ignoreDependencies(e,null,t)})}return r}}(t,o,n)}),this},this.addPostprocessor=function(n){Object.keys(n).forEach(function(i){e[i]=e[i]||[],e[i].push(n[i])})};var e={}}).install()});