/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconfig","@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle","@oracle/oraclejet-preact/resources/nls/supportedLocales"],function(e,t,a,r){"use strict";r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r;const n=new Set(r),l=new Map,o=new Map,s=e=>{let t=o.get(e);return t||(t=l.get(e)(c(e)),o.set(e,t)),t},c=(()=>{let e;return r=>(void 0===e&&(e=a.matchTranslationBundle([t.getLocale()],n)),e)})();e.getTranslationBundlePromise=s,e.loadAllPendingBundles=()=>{const e=Array.from(l.keys(),e=>s(e));return Promise.all(e)},e.matchTranslationBundle=(e,t)=>a.matchTranslationBundle([e],t),e.registerTranslationBundleLoaders=e=>{Object.keys(e).forEach(t=>{l.has(t)||l.set(t,e[t])})},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtranslationbundleutils.js.map