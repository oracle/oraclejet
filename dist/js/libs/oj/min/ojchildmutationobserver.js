/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["ojs/ojcore","ojs/ojcustomelement"],function(e){return function(t,n){var r=t,o=n,s=e.BaseCustomElementBridge.getRegistered(t.tagName)?e.BaseCustomElementBridge.getTrackChildrenOption(t):"none",a=new MutationObserver(function(t){var n=function(t){for(var n=[],o=0;o<t.length;o++)for(var a=t[o],i="childList"===a.type?a.target:a.target.parentNode;i;)i===r?(n.push(a),i=null):i="nearestCustomElement"!==s||e.BaseCustomElementBridge.isValidCustomElementName(i.localName)?null:i.parentNode;return n}(t);n.length>0&&o(n)});return{observe:function(){"none"!==s&&a.observe(r,{attributes:!0,childList:!0,subtree:!0,characterData:!0})},disconnect:function(){a.disconnect()}}}});