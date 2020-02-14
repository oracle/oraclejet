/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojs/ojurlpathadapter","ojs/ojlogger"],function(t,o,r){"use strict";function e(t,o,r){return o in t?Object.defineProperty(t,o,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[o]=r,t}return function(){var t="_ojCoreRouter";function r(){var t=document.location.search?document.location.search.substring(1):"",o=[];return t&&t.split("&").forEach(function(t){var r,n=t.split("=");o.push(e({},n[0],(r=n[1],decodeURIComponent(r))))}),o}function n(t){var o=[];return t.forEach(function(t){var r,e=Object.keys(t)[0];o.push(e+"="+(r=t[e],encodeURIComponent(r)))}),o.join("&")}function u(){this._pathAdapter=new o("")}return u.prototype.getRoutesForUrl=function(){var o,e,n=(o=r(),e="",o.forEach(function(o){o[t]&&(e=o[t])}),e);return this._pathAdapter.getRoutesForUrl(n)},u.prototype.getUrlForRoutes=function(o){var u,i,c,a=this._pathAdapter.getUrlForRoutes(o);return a.indexOf("?")>-1&&(a=a.substring(0,a.indexOf("?"))),"?"+(u=a,i=r(),c=!1,i.forEach(function(o){o[t]&&(o[t]=u,c=!0)}),c||i.push(e({},t,u)),n(i))},u}()});