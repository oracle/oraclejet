/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function(){"use strict";function t(t){let n=t;return n&&!n.match(/\/$/)&&(n+="/"),n}function n(t){return t&&encodeURIComponent(t)}return class{constructor(n){this._baseUrl=t(void 0!==n?n:document.location.pathname)}getRoutesForUrl(t,n){const o=n||document.location.pathname,a=this._baseUrl;let e=o.substring(a.length).split("/").map(t=>{return(n=t)&&decodeURIComponent(n);var n});const s=e.map(t=>({path:t,params:{}}));if(t){const n=t.offset;e=e.slice(n);const o=e.shift();if(o){const a={};t.pathParams.forEach(t=>a[t]=e.shift()),s[n]={path:o,params:a}}}return s}getUrlForRoutes(o){const a=o.map(t=>[t.path,...t.pathParams.map(n=>t.params[n])].map(n).join("/"));let e=this._baseUrl;const s=a.join("/");return s&&(e=t(e)),e+s+document.location.search}}});
//# sourceMappingURL=ojurlpathparamadapter.js.map