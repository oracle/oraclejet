/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcustomelement-utils"],function(e,t){"use strict";class r{spanContext(){return{traceId:"",spanId:"",traceFlags:0}}setAttribute(e,t){return this}setAttributes(e){return this}addEvent(e,t,r){return this}setStatus(e){return this}updateName(e){return this}end(e){}isRecording(){return!1}recordException(e,t){}}class n{startSpan(e,t,n){return new r}startActiveSpan(e,t,n,s){let u;if(!(arguments.length<2))return u=2===arguments.length?t:3===arguments.length?n:s,u(new r)}}class s{getTracer(e,t){return new n}}let u;e.endRecordMode=function(){},e.getDescriptiveText=function(e){const r=t.CustomElementUtils.getElementState(e);return r?.getDescriptiveText()??""},e.getTracerProvider=function(){return u||(u=new s),u},e.setTracerProvider=function(e){u=e},e.startRecordMode=function(e){return null},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtracer.js.map