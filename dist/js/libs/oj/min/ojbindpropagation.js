/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";const o=new Map;e.getPropagationMetadataViaCache=function(e,n){let i=o.get(e);return void 0!==i||(i=null,Object.keys(n).forEach(e=>{var o,t;const r=n[e],l=null===(o=null==r?void 0:r.binding)||void 0===o?void 0:o.provide,d=null===(t=null==r?void 0:r.binding)||void 0===t?void 0:t.consume;if(l||d){if(r.properties)throw new Error("Propagating complex properties is not supported!");i=null!=i?i:new Map,i.set(e,[l,d])}}),o.set(e,i)),i},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojbindpropagation.js.map