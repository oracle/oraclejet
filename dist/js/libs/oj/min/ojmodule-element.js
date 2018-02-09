/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","knockout","ojs/ojmodule","ojs/ojcomposite"],function(a,g){a.Te.register("oj-module",{view:{inline:'\x3c!-- ko ojModule: {"view":$props.config.view, "viewModel":$props.config.viewModel,"cleanupMode":$props.config.cleanupMode,"animation":$props.animation} --\x3e\x3c!-- /ko --\x3e'},metadata:{inline:{properties:{config:{type:"object",properties:{viewModel:{type:"object"},view:{type:"array\x3cobject\x3e"},cleanupMode:{type:"string",enumValues:["onDisconnect","none"],value:"onDisconnect"}}},
animation:{type:"object"}},events:{transitionStart:{},transitionEnd:{},viewConnected:{},viewDisconnected:{}}}},viewModel:{inline:function(a){function b(a){return(a=a?a.view:null)&&0<a.length&&e.contains(a[0])}function d(a,b){var c=a&&a[b];"function"===typeof c&&g.ignoreDependencies(c,a)}var e=a.element,f;a.props.then(function(a){f=a});this.connected=function(){b(f&&f.config)&&d(f.config?f.config.viewModel:null,"connected")};this.disconnected=function(){b(f&&f.config)&&d(f.config?f.config.viewModel:
null,"disconnected")}}}})});