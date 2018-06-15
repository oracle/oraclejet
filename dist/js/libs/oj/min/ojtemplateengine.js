/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";define(["knockout"],function(e){return new function(){this.execute=function(t,n,o,r){var c=function(e){var t=document.createElement("div");if(1!==e.nodeType||"template"!==e.tagName.toLowerCase())throw new Error("Invalid template node "+e);var n=e.content;return n?t.appendChild(document.importNode(n,!0)):Array.prototype.forEach.call(e.childNodes,function(e){t.appendChild(e.cloneNode(!0))}),t}(n),a=n.getAttribute("data-oj-as");return e.applyBindingsToDescendants(function(t,n,o,r){var c={$current:n},a=e.contextFor(t);return a?(o&&(c[o]=n),r&&(c[r]=n),a.extend(c)):c}(t,o,r,a),c),Array.prototype.slice.call(c.childNodes,0)},this.clean=function(t){return e.cleanNode(t)}}});