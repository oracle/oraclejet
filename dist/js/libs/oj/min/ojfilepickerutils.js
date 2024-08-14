/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base"],function(e,t){"use strict";let n;const c=(t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t).AgentUtils.getAgentInfo().os===t.AgentUtils.OS.IOS,o=()=>{c&&document.body.removeChild(n),n=null},l=e=>{n&&o(),n=document.createElement("input"),n.type="file",e?.capture&&"none"!=e.capture&&(n.capture=e.capture);const t=e?.accept,l=t&&t.length?t.join(","):null;n.accept=l,n.multiple="multiple"==e?.selectionMode,n.style.display="none",c&&document.body.appendChild(n)};e.pickFiles=function(e,t){l(t),n.onchange=function(){const t=n._pickerTestData?n._pickerTestData:n.files;e(t),o()},n.click()},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojfilepickerutils.js.map