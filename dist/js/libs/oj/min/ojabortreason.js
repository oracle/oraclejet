/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports"],function(e){"use strict";e.getAbortReason=e=>{const r=e?`<${e.tagName.toLowerCase()}>: `:"",t=new DOMException(`${r}Aborting stale fetch for performance – a newer request has been issued`,"AbortError");return t.severity="info",t},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojabortreason.js.map