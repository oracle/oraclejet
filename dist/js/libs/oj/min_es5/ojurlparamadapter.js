/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojurlpathadapter"],function(t){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var r="_ojCoreRouter";function n(){var t=document.location.search?document.location.search.substring(1):"",r=[];return t&&t.split("&").forEach(function(t){var n=t.split("=");r.push(n)}),r}function o(){var t,o=n().find(function(t){return t[0]===r});return o&&(t=o[1],decodeURIComponent(t))}function e(t){var o=encodeURIComponent(t),e=n(),u=e.find(function(t){return t[0]===r});return u?u[1]=o:e.push([r,o]),e.map(function(t){return t[0]+"="+t[1]}).join("&")}function u(){this._pathAdapter=new t(""),void 0===o()&&(r="ojr")}return u.prototype.getRoutesForUrl=function(){var t=o()||"";return this._pathAdapter.getRoutesForUrl(t)},u.prototype.getUrlForRoutes=function(t){var r=this._pathAdapter.getUrlForRoutes(t);return r.indexOf("?")>-1&&(r=r.substring(0,r.indexOf("?"))),"?"+e(r)},u});
//# sourceMappingURL=ojurlparamadapter.js.map