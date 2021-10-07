/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojtracer"],function(e,t){"use strict";e.traceDispatchEvent=function(e){return function(n){const a=this,r=t.getTracerProvider().getTracer("JET");if("undefined"!=typeof window&&window.__JET_TRACER_ENABLED__&&r&&function(e){const t=null==e?void 0:e.type;if(!t||t.startsWith("ojBefore"))return!1;switch(t){case"attribute-changed":case"ojAnimateStart":case"ojAnimateEnd":case"ojTransitionStart":case"ojTransitionEnd":case"labelledByChanged":case"beforeDestroyChanged":return!1}return!0}(n)){const t=function(e){var t;let n=e.type;const a=null===(t=e.detail)||void 0===t?void 0:t.value;if(null!=a)switch(n){case"validChanged":n=`${n}=${a}`;break;case"expandedChanged":"boolean"==typeof a&&(n=`${n}=${a}`)}return n}(n),o="componentEvent";return r.startActiveSpan(`${o} ${t}`,r=>{try{return r.setAttribute("type",t),r.setAttribute("operationName",o),e.call(a,n)}catch(e){r.setStatus({code:2,message:e.message})}finally{r.end()}})}return e.call(a,n)}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtrace-event.js.map