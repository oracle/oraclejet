/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","jquery","ojs/ojdomutils"],function(e,t,o){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const n={setup:function(e){o.makeFocusable({element:t(e),applyHighlight:!0}),e.addEventListener("keydown",function(t){13!==t.keyCode&&"Enter"!==t.key||e.classList.add("oj-active")}),e.addEventListener("keyup",function(t){13!==t.keyCode&&"Enter"!==t.key||(e.classList.remove("oj-active"),e.click())})}},s=n.setup;e.setup=s,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojnocompbutton.js.map