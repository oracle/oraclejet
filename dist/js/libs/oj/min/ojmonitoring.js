/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(t){"use strict";const e={},n=Symbol();function o(){return e[n]}t.getWritebackMonitor=o,t.performMonitoredWriteback=function(t,e,n,i){if(e){const r=o();r?r(t,n,e.bind(null,i)):e(i)}},t.setWritebackMonitor=function(t){e[n]=t},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojmonitoring.js.map