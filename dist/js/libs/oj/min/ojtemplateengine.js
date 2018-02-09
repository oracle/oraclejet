/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(["knockout"],function(a){return new function(){function g(a){if(1===a.nodeType&&"template"===a.tagName.toLowerCase()){var b=a.content;a=b?b.childNodes:a.childNodes}else throw"Invalid template node "+a;return Array.prototype.map.call(a,function(a){return a.cloneNode(!0)})}function c(a){var b=document.createElement("div");a.forEach(function(a){b.appendChild(a)});return b}function b(b,c){var f=a.contextFor(b);return f?f.extend(c):c}this.iW=function(d,e,f){e=g(e);e=c(e);a.applyBindingsToDescendants(b(d,
f),e);return Array.prototype.slice.call(e.childNodes,0)}}});