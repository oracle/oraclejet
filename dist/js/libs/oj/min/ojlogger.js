/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","@oracle/oraclejet-preact/utils/UNSAFE_logger"],function(e,o){"use strict";const t={LEVEL_NONE:0,LEVEL_ERROR:1,LEVEL_WARN:2,LEVEL_INFO:3,LEVEL_LOG:4};t._defaultOptions={level:t.LEVEL_ERROR,writer:null},t._options=t._defaultOptions,t.error=o.error.bind(o),t.info=o.info.bind(o),t.warn=o.warn.bind(o),t.log=o.log.bind(o),t.option=function(e,r){var L,n,E={};if(0===arguments.length){for(n=Object.keys(t._options),L=0;L<n.length;L++)E[n[L]]="level"===n[L]?o.getLogLevel():t._options[n[L]];return E}if("string"==typeof e&&void 0===r){let r;switch(e){case"level":r=o.getLogLevel();break;case"writer":r=t._options.writer;break;default:r=null}return r}if("string"==typeof e)"level"===e?o.setLogLevel(r):"writer"===e&&(o.setLogWriter(r),t._options[e]=r);else{var i=e;for(n=Object.keys(i),L=0;L<n.length;L++)t.option(n[L],i[n[L]])}};const r=t.info,L=t.error,n=t.warn,E=t.log,i=t.option,l=t.LEVEL_ERROR,_=t.LEVEL_INFO,s=t.LEVEL_LOG,f=t.LEVEL_NONE,O=t.LEVEL_WARN;e.LEVEL_ERROR=l,e.LEVEL_INFO=_,e.LEVEL_LOG=s,e.LEVEL_NONE=f,e.LEVEL_WARN=O,e.error=L,e.info=r,e.log=E,e.option=i,e.warn=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojlogger.js.map