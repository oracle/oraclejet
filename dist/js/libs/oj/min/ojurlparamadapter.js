/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojurlpathadapter"],function(t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n="_ojCoreRouter";function o(){var t=document.location.search?document.location.search.substring(1):"",n=[];return t&&t.split("&").forEach(function(t){var o=t.split("=");n.push(o)}),n}function r(){var t,r=o().find(function(t){return t[0]===n});return r&&(t=r[1],decodeURIComponent(t))}function e(t){var r=encodeURIComponent(t),e=o(),u=e.find(function(t){return t[0]===n});return u?u[1]=r:e.push([n,r]),e.map(function(t){return t[0]+"="+t[1]}).join("&")}function u(o){this._pathAdapter=o||new t(""),void 0===r()&&(n="ojr")}return u.prototype.getRoutesForUrl=function(t){const n=r()||"";return this._pathAdapter.getRoutesForUrl(t,n)},u.prototype.getUrlForRoutes=function(t){var n=this._pathAdapter.getUrlForRoutes(t);return n.indexOf("?")>-1&&(n=n.substring(0,n.indexOf("?"))),`${document.location.pathname}?${e(n)}`},u});
//# sourceMappingURL=ojurlparamadapter.js.map