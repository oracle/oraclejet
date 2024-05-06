/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcustomelement-registry"],function(e,t){"use strict";const o=Symbol("StaticContextPropagation"),n=Symbol("ConsumedContext");const i=new Map;e.CONSUMED_CONTEXT=n,e.STATIC_PROPAGATION=o,e.getPropagationMetadataViaCache=function(e,s){let r=i.get(e);if(void 0!==r)return r;r=null;const a=s.properties??{};Object.keys(a).forEach(e=>{const t=a[e],o=t?.binding?.provide,n=t?.binding?.consume;if(o||n){if(t.properties)throw new Error("Propagating complex properties is not supported!");r=r??new Map,r.set(e,[o,n])}});const c=s.extension?._BINDING?.provide;if(c){r=r??new Map;const e=new Map;c.forEach((t,o)=>{e.set(o,{name:o,default:t})}),r.set(o,[e,void 0])}const p=t.getElementRegistration(e)?.cache?.contexts;return p&&r.set(n,[void 0,p]),i.set(e,r),r},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojbindpropagation.js.map