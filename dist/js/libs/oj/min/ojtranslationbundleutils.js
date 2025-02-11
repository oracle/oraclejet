/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconfig","@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle","@oracle/oraclejet-preact/resources/nls/supportedLocales"],function(e,t,r,a){"use strict";a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;const o=new Set(a),l=new Map,n=new Map,s=e=>{let t=n.get(e);return t||(t=l.get(e)(c(e)),n.set(e,t)),t},c=(()=>{let e;return a=>(void 0===e&&(e=r.matchTranslationBundle([t.getLocale()],o)),e)})();e.getTranslationBundlePromise=s,e.loadAllPendingBundles=()=>{const e=Array.from(l.keys(),e=>s(e));return Promise.all(e)},e.registerTranslationBundleLoaders=e=>{Object.keys(e).forEach(t=>{l.has(t)||l.set(t,e[t])})},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtranslationbundleutils.js.map