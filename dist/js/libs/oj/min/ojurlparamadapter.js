/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojurlpathadapter","ojs/ojlogger"],(function(t,r,n){"use strict";return function(){var t="_ojCoreRouter";function n(){var t=document.location.search?document.location.search.substring(1):"",r=[];return t&&t.split("&").forEach((function(t){var n=t.split("=");r.push(n)})),r}function o(){var r,o=n().find((function(r){return r[0]===t}));return o&&(r=o[1],decodeURIComponent(r))}function e(r){var o=encodeURIComponent(r),e=n(),u=e.find((function(r){return r[0]===t}));return u?u[1]=o:e.push([t,o]),e.map((function(t){return t[0]+"="+t[1]})).join("&")}function u(){this._pathAdapter=new r(""),void 0===o()&&(t="ojr")}return u.prototype.getRoutesForUrl=function(){var t=o()||"";return this._pathAdapter.getRoutesForUrl(t)},u.prototype.getUrlForRoutes=function(t){var r=this._pathAdapter.getUrlForRoutes(t);return r.indexOf("?")>-1&&(r=r.substring(0,r.indexOf("?"))),"?"+e(r)},u}()}));