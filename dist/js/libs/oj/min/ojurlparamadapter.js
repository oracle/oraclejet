/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojs/ojurlpathadapter","ojs/ojlogger"],function(t,o,r){"use strict";return function(){var t="_ojCoreRouter";function r(){var t=document.location.search?document.location.search.substring(1):"",o=[];return t&&t.split("&").forEach(function(t){var r,n=t.split("=");o.push({[n[0]]:(r=n[1],decodeURIComponent(r))})}),o}function n(t){var o=[];return t.forEach(function(t){var r,n=Object.keys(t)[0];o.push(n+"="+(r=t[n],encodeURIComponent(r)))}),o.join("&")}function e(){this._pathAdapter=new o("")}return e.prototype.getRoutesForUrl=function(){var o,n,e=(o=r(),n="",o.forEach(function(o){o[t]&&(n=o[t])}),n);return this._pathAdapter.getRoutesForUrl(e)},e.prototype.getUrlForRoutes=function(o){var e,u,c,i=this._pathAdapter.getUrlForRoutes(o);return i.indexOf("?")>-1&&(i=i.substring(0,i.indexOf("?"))),"?"+(e=i,u=r(),c=!1,u.forEach(function(o){o[t]&&(o[t]=e,c=!0)}),c||u.push({[t]:e}),n(u))},e}()});