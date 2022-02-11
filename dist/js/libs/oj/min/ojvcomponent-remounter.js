/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact"],function(e,t){"use strict";class n extends t.Component{render(e){const n=t.toChildArray(null==e?void 0:e.children),o=n[0];if(1!==n.length||!this._isVNode(o)||"string"!=typeof o.type)throw new Error("The only child of the Remounter must be a custom element node");const r=this._getElementKey(o);return[t.cloneElement(o,{key:r})]}_getElementKey(e){var n;const o=t.toChildArray(null===(n=e.props)||void 0===n?void 0:n.children).map(e=>this._isVNode(e)?this._getSlotInfo(e):e);return JSON.stringify(o)}_getSlotInfo(e){var t;let n=e.type;return n="string"==typeof n?n:n.name||String(n),{key:e.key,type:n,slot:null===(t=e.props)||void 0===t?void 0:t.slot}}_isVNode(e){return"string"!=typeof e&&isNaN(e)}}e.Remounter=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojvcomponent-remounter.js.map