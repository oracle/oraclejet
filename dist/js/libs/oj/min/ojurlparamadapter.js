/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojurlpathadapter"],function(t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n="_ojCoreRouter";function r(){var t=document.location.search?document.location.search.substring(1):"",n=[];return t&&t.split("&").forEach(function(t){var r=t.split("=");n.push(r)}),n}function o(){var t,o=r().find(function(t){return t[0]===n});return o&&(t=o[1],decodeURIComponent(t))}function e(t){var o=encodeURIComponent(t),e=r(),u=e.find(function(t){return t[0]===n});return u?u[1]=o:e.push([n,o]),e.map(function(t){return t[0]+"="+t[1]}).join("&")}function u(r){this._pathAdapter=r||new t(""),void 0===o()&&(n="ojr")}return u.prototype.getRoutesForUrl=function(t){const n=o()||"";return this._pathAdapter.getRoutesForUrl(t,n)},u.prototype.getUrlForRoutes=function(t){var n=this._pathAdapter.getUrlForRoutes(t);return n.indexOf("?")>-1&&(n=n.substring(0,n.indexOf("?"))),"?"+e(n)},u});
//# sourceMappingURL=ojurlparamadapter.js.map