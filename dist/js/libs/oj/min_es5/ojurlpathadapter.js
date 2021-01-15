/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */function t(t){var n=t;return n&&!n.match(/\/$/)&&(n+="/"),n}function n(t){var n=[];return Object.keys(t).sort().forEach(function(r){var o=t[r];null!=o&&n.push(";"+r+"="+function(t){return encodeURIComponent(t)}(o))}),n.join("")}function r(t){var n=t.split(";"),r={path:o(n.shift()),params:{}};return n.forEach(function(t){if(t){var n=t.split("=");r.params[n[0]]=o(n[1])}}),r}function o(t){return decodeURIComponent(t)}function e(n){this._baseUrl=t(void 0!==n?n:document.location.pathname)}return e.prototype.getRoutesForUrl=function(t){var n=void 0!==t?t:document.location.pathname,o=this._baseUrl,e=n.substring(o.length).split("/"),a=[];return e.forEach(function(t){var n=r(t);a.push(n)}),a.length||a.push(r("")),a},e.prototype.getUrlForRoutes=function(r){var o=[];r.forEach(function(t){var r=n(t.params||{});o.push(t.path+r)});var e=this._baseUrl,a=o.join("/");return a&&(e=t(e)),e+a+document.location.search},e});
//# sourceMappingURL=ojurlpathadapter.js.map