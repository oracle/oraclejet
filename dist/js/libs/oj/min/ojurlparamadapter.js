/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojurlpathadapter"],function(t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var n="ojr",o="_ojCoreRouter";function r(){var t=document.location.search?document.location.search.substring(1):"",n=[];return t&&t.split("&").forEach(function(t){var o=t.split("=");n.push(o)}),n}function e(){var t,n=r().find(function(t){return t[0]===o});return n&&(t=n[1],decodeURIComponent(t))}function u(t){var n=encodeURIComponent(t),e=r(),u=e.find(function(t){return t[0]===o});return u?u[1]=n:e.push([o,n]),e.map(function(t){return t[0]+"="+t[1]}).join("&")}function i(r){this._pathAdapter=r||new t(""),void 0===e()&&(o=n)}return i.prototype.getRoutesForUrl=function(t){const n=e()||"";return this._pathAdapter.getRoutesForUrl(t,n)},i.prototype.getUrlForRoutes=function(t){var n=this._pathAdapter.getUrlForRoutes(t);return n.indexOf("?")>-1&&(n=n.substring(0,n.indexOf("?"))),`${document.location.pathname}?${u(n)}`},i});
//# sourceMappingURL=ojurlparamadapter.js.map