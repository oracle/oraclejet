/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";function t(t){var n=t;return n&&!n.match(/\/$/)&&(n+="/"),n}function n(t){var n=[];return Object.keys(t).sort().forEach(function(o){var r=t[o];null!=r&&n.push(";"+o+"="+function(t){return encodeURIComponent(t)}(r))}),n.join("")}function o(t){var n=t.split(";"),o={path:r(n.shift()),params:{}};return n.forEach(function(t){if(t){var n=t.split("=");o.params[n[0]]=r(n[1])}}),o}function r(t){return decodeURIComponent(t)}function e(n){this._baseUrl=t(void 0!==n?n:document.location.pathname)}return e.prototype.getRoutesForUrl=function(t,n){var r=void 0!==n?n:document.location.pathname,e=this._baseUrl,u=r.substring(e.length).split("/"),a=[];return u.forEach(function(t){var n=o(t);a.push(n)}),a.length||a.push(o("")),a},e.prototype.getUrlForRoutes=function(o){const r=o.map(function(t){const o=n(t.params||{});return t.path+o});let e=this._baseUrl;const u=r.join("/");return u&&(e=t(e)),e+u+document.location.search},e});
//# sourceMappingURL=ojurlpathadapter.js.map