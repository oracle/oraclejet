/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","jquery","ojs/ojcomponentcore"],function(e,t){function n(n){function o(n){var o=e.BaseCustomElementBridge.getSlotMap(n),i=["startIcon","","endIcon"];t.each(o,function(e,o){-1==i.indexOf(e)&&function(e,n){t.each(n,function(t,n){e.removeChild(n)})}(n,o)}),t.each(i,function(e,i){o[i]&&function(e,n){t.each(n,function(t,n){e.appendChild(n)})}(n,o[i])})}this.updateDOM=function(){var e=n.element.customOptionRenderer;o(n.element),e&&"function"==typeof e&&e(n.element)}}var o;o={properties:{disabled:{type:"boolean",value:!1},value:{type:"any",value:null},customOptionRenderer:{}},events:{action:{}},extension:{_CONSTRUCTOR:n}},e.CustomElementBridge.registerMetadata("oj-option",null,o),e.CustomElementBridge.register("oj-option",{metadata:e.CustomElementBridge.getMetadata("oj-option")})});