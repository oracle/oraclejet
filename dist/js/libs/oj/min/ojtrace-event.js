/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";function t(e){var t;let n=e.type;const a=null===(t=e.detail)||void 0===t?void 0:t.value;if(null!=a)switch(n){case"validChanged":n=`${n}=${a}`;break;case"expandedChanged":"boolean"==typeof a&&(n=`${n}=${a}`)}return n}e.traceDispatchEvent=function(e){return function(n){const a=this,r=function(){var e;const t=window.GlobalTracer;return null===(e=null==t?void 0:t.get)||void 0===e?void 0:e.call(t)}();if("undefined"!=typeof window&&window.__JET_TRACER_ENABLED__&&r&&function(e){const t=null==e?void 0:e.type;if(!t||t.startsWith("ojBefore"))return!1;switch(t){case"attribute-changed":case"ojAnimateStart":case"ojAnimateEnd":case"ojTransitionStart":case"ojTransitionEnd":case"labelledByChanged":case"beforeDestroyChanged":return!1}return!0}(n)){const o={operationName:"componentEvent",trigger:{type:t(n),target:a}};return r.span(o,t=>{let r;try{return e.call(a,n)}catch(e){r=e}finally{const e={};r&&(e.error=r),t.finish(e)}})}return e.call(a,n)}},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtrace-event.js.map