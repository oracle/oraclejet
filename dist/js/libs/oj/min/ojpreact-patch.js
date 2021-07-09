/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";const t=Symbol(),n=Symbol(),o=Symbol();function l(e,n){Object.defineProperty(e,"firstChild",{get(){let l=e.childNodes[0];return l?(l=l[o]||l,n&&(l=l[t]||l),l):null},enumerable:!0})}const r=Symbol();e.OJ_POPUP=o,e.OJ_REPLACER=t,e.OJ_SLOT=n,e.patchPopupParent=function(e){e[r]||(e[r]=!0,l(e,!1))},e.patchSlotParent=function(e){if(!e[r]){e[r]=!0;const t=e.insertBefore;e.insertBefore=(o,l)=>t.call(e,o,(null==l?void 0:l[n])||l),l(e,!0)}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojpreact-patch.js.map