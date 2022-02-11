/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base"],function(e,t){"use strict";let n;const l=(t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t).AgentUtils.getAgentInfo().os===t.AgentUtils.OS.IOS,o=()=>{l&&document.body.removeChild(n),n=null};e.pickFiles=function(e,t){(e=>{n&&o(),n=document.createElement("input"),n.type="file",(null==e?void 0:e.capture)&&"none"!=e.capture&&(n.capture=e.capture);const t=null==e?void 0:e.accept,c=t&&t.length?t.join(","):null;n.accept=c,n.multiple="multiple"==(null==e?void 0:e.selectionMode),n.style.display="none",l&&document.body.appendChild(n)})(t),n.onchange=function(){e(n.files),o()},n.click()},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojfilepickerutils.js.map