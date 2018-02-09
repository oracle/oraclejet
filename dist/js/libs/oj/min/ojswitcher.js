/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["ojs/ojcore","ojs/ojcomponentcore","ojs/ojcustomelement"],function(a){a.J.Ua("oj-switcher",null,{properties:{value:{type:"string",value:""}},extension:{CP:function(g){function c(c,e){var g=f[b];void 0===c[d]&&Object.defineProperty(c,d,{value:c.style.display});e===g?"none"===c.style.display?(c.style.display="",a.Components.ep(c,h?{initialRender:!0}:void 0)):h&&a.Components.ep(c,{initialRender:!0}):"none"!==c.style.display&&(c.style.display="none",a.Components.Mq(c))}var b="value",d="_ojSwitcher_orig_display_style",
e=this,f=g.element,h=!0,k=null;e.zJa=new MutationObserver(function(a){a.forEach(function(a){"childList"===a.type&&(a.addedNodes&&Array.prototype.forEach.call(a.addedNodes,function(a){if(1===a.nodeType){var b=a.getAttribute("slot");c(a,b);k=null}}),a.removedNodes&&Array.prototype.forEach.call(a.removedNodes,function(a){1===a.nodeType&&(void 0!==a[d]&&(a.style.display=a[d]),k=null)}))})});this.N9=function(){e.zJa.observe(f,{childList:!0})};this.oO=function(){var b;k||(k=a.J.sl(f));b=k;for(var d in b)b[d].forEach(function(a){c(a,
d)});h&&(h=!1)}},f_:!0}});a.J.register("oj-switcher",{metadata:a.J.getMetadata("oj-switcher")})});