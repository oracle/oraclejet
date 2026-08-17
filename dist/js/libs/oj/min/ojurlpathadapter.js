/**
 * @license
 * Copyright (c) 2014, 2026, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";function t(t){var n=t;return n&&!n.match(/\/$/)&&(n+="/"),n}function n(t){var n=t.split(";"),o={path:r(n.shift()),params:{}};return n.forEach(function(t){if(t){var n=t.split("=");o.params[r(n[0])]=r(n[1])}}),o}function o(t){return encodeURIComponent(t)}function r(t){return decodeURIComponent(t)}function e(n){this._baseUrl=t(void 0!==n?n:document.location.pathname)}return e.prototype.getRoutesForUrl=function(t,o){var r=void 0!==o?o:document.location.pathname,e=this._baseUrl,u=r.substring(e.length).split("/"),a=[];return u.forEach(function(t){var o=n(t);a.push(o)}),a.length||a.push(n("")),a},e.prototype.getUrlForRoutes=function(n){const r=n.map(function(t){const n=function(t){var n=[];return Object.keys(t).sort().forEach(function(r){var e=t[r];null!=e&&n.push(";"+o(r)+"="+o(e))}),n.join("")}(t.params||{});return t.path+n});let e=this._baseUrl;const u=r.join("/");return u&&(e=t(e)),e+u+document.location.search},e});
//# sourceMappingURL=ojurlpathadapter.js.map