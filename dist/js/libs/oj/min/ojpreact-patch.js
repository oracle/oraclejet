/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";Symbol();const t=Symbol(),n=Symbol();const o=Symbol();e.OJ_POPUP=t,e.OJ_SLOT_REMOVE=n,e.patchPopupParent=function(e){e[o]||(e[o]=!0,Object.defineProperty(e,"firstChild",{get(){let n=e.childNodes[0];return n?n[t]||n:null},enumerable:!0}))},e.patchSlotParent=function(e){if(!e[o]){e[o]=!0;const t=e.removeChild;e.removeChild=o=>{const l=o[n];return l?(l(),null):t.call(e,o)}}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojpreact-patch.js.map