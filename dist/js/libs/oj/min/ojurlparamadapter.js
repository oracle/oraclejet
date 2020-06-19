/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojurlpathadapter","ojs/ojlogger"],function(t,n,r){"use strict";return function(){var t="_ojCoreRouter";function r(){var t=document.location.search?document.location.search.substring(1):"",n=[];return t&&t.split("&").forEach(function(t){var r=t.split("=");n.push(r)}),n}function o(){var n,o=r().find(function(n){return n[0]===t});return o&&(n=o[1],decodeURIComponent(n))}function e(n){var o=encodeURIComponent(n),e=r(),u=e.find(function(n){return n[0]===t});return u?u[1]=o:e.push([t,o]),e.map(function(t){return t[0]+"="+t[1]}).join("&")}function u(){this._pathAdapter=new n("")}return u.prototype.getRoutesForUrl=function(){var t=o()||"";return this._pathAdapter.getRoutesForUrl(t)},u.prototype.getUrlForRoutes=function(t){var n=this._pathAdapter.getUrlForRoutes(t);return n.indexOf("?")>-1&&(n=n.substring(0,n.indexOf("?"))),"?"+e(n)},u}()});