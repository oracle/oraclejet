/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojs/ojlogger"],function(t,n){"use strict";return function(){function t(t){var n=t;return n&&!n.match(/\/$/)&&(n+="/"),n}function n(t){var n=[];return Object.keys(t).sort().forEach(function(o){var r=t[o];null!=r&&n.push(";"+o+"="+function(t){return encodeURIComponent(t)}(r))}),n.join("")}function o(t){var n=t.split(";"),o={path:r(n.shift()),params:{}};return n.forEach(function(t){if(t){var n=t.split("=");o.params[n[0]]=r(n[1])}}),o}function r(t){return decodeURIComponent(t)}function e(n){this._baseUrl=t(void 0!==n?n:document.location.pathname)}return e.prototype.getRoutesForUrl=function(t){var n=void 0!==t?t:document.location.pathname,r=this._baseUrl,e=n.substring(r.length).split("/"),u=[];return e.forEach(function(t){var n=o(t);u.push(n)}),u.length||u.push(o("")),u},e.prototype.getUrlForRoutes=function(o){var r=[];o.forEach(function(t){var o=n(t.params||{});r.push(t.path+o)});var e=this._baseUrl,u=r.join("/");return u&&(e=t(e)),e+u+document.location.search},e}()});