/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact"],function(e,t){"use strict";class o extends t.Component{render(e){var o;let n=t.toChildArray(null==e?void 0:e.children),r=n[0];if(this._isVNode(r)&&"function"==typeof r.type&&r.type.__ojIsEnvironmentWrapper&&(n=t.toChildArray(null===(o=r.props)||void 0===o?void 0:o.children),r=n[0]),1!==n.length||!this._isVNode(r)||"string"!=typeof r.type)throw new Error("The only child of the Remounter must be a custom element node");const i=this._getElementKey(r);return[t.cloneElement(r,{key:i})]}_getElementKey(e){var o;const n=t.toChildArray(null===(o=e.props)||void 0===o?void 0:o.children).map(e=>this._isVNode(e)?this._getSlotInfo(e):e);return JSON.stringify(n)}_getSlotInfo(e){var t;let o=e.type;return o="string"==typeof o?o:o.name||String(o),{key:e.key,type:o,slot:null===(t=e.props)||void 0===t?void 0:t.slot}}_isVNode(e){return"string"!=typeof e&&isNaN(e)}}e.Remounter=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojvcomponent-remounter.js.map