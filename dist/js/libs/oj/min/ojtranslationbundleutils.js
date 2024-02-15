/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojconfig","@oracle/oraclejet-preact/utils/UNSAFE_matchTranslationBundle","@oracle/oraclejet-preact/resources/nls/supportedLocales"],function(e,t,o,r){"use strict";r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r;const a=new Set(r),l=(()=>{let e;return()=>(void 0===e&&(e=o.matchTranslationBundle([t.getLocale()],a)),e)})();e.getTranslationBundlePromiseFromLoader=e=>e(l()),Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtranslationbundleutils.js.map