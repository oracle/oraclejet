/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(o){"use strict";const e=Symbol("RootBindingPropagation");const n=new Map;o.ROOT_BINDING_PROPAGATION=e,o.getPropagationMetadataViaCache=function(o,i){var t,r,l;let d=n.get(o);if(void 0!==d)return d;d=null;const s=null!==(t=i.properties)&&void 0!==t?t:{};Object.keys(s).forEach(o=>{var e,n;const i=s[o],t=null===(e=null==i?void 0:i.binding)||void 0===e?void 0:e.provide,r=null===(n=null==i?void 0:i.binding)||void 0===n?void 0:n.consume;if(t||r){if(i.properties)throw new Error("Propagating complex properties is not supported!");d=null!=d?d:new Map,d.set(o,[t,r])}});const p=null===(l=null===(r=i.extension)||void 0===r?void 0:r._BINDING)||void 0===l?void 0:l.provide;return p&&(d=null!=d?d:new Map,d.set(e,[p,void 0])),n.set(o,d),d},Object.defineProperty(o,"__esModule",{value:!0})});
//# sourceMappingURL=ojbindpropagation.js.map