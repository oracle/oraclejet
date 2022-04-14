/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcustomelement-utils"],function(t,e){"use strict";class r{spanContext(){return{traceId:"",spanId:"",traceFlags:0}}setAttribute(t,e){return this}setAttributes(t){return this}addEvent(t,e,r){return this}setStatus(t){return this}updateName(t){return this}end(t){}isRecording(){return!1}recordException(t,e){}}class n{startSpan(t,e,n){return new r}startActiveSpan(t,e,n,s){let i;if(!(arguments.length<2))return i=2===arguments.length?e:3===arguments.length?n:s,i(new r)}}class s{getTracer(t,e){return new n}}let i;t.getDescriptiveText=function(t){var r;const n=e.CustomElementUtils.getElementState(t);return null!==(r=null==n?void 0:n.getDescriptiveText())&&void 0!==r?r:""},t.getTracerProvider=function(){return i||(i=new s),i},t.setTracerProvider=function(t){i=t},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojtracer.js.map