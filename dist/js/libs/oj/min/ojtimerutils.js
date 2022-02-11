/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";const n={};function t(){}t.prototype.getPromise=function(){},t.prototype.clear=function(){},n.getTimer=function(e){return new n._TimerImpl(e)},n._TimerImpl=function(e){var n,t,i;function o(e){i=null,t(e)}this.getPromise=function(){return n},this.clear=function(){window.clearTimeout(i),i=null,o(!1)},n="undefined"==typeof window?Promise.reject():new Promise(function(n){t=n,i=window.setTimeout(o.bind(null,!0),e)})};const i=n.getTimer;e.getTimer=i,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojtimerutils.js.map