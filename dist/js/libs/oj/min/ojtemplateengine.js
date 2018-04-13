/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["knockout"],function(e){return new function(){this.execute=function(t,n,o){var r=function(e){var t=document.createElement("div");if(1!==e.nodeType||"template"!==e.tagName.toLowerCase())throw"Invalid template node "+e;var n=e.content;return n?t.appendChild(document.importNode(n,!0)):Array.prototype.forEach.call(e.childNodes,function(e){t.appendChild(e.cloneNode(!0))}),t}(n);return e.applyBindingsToDescendants(function(t,n){var o=e.contextFor(t);return o?o.extend(n):n}(t,o),r),Array.prototype.slice.call(r.childNodes,0)}}});