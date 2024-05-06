/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","preact"],function(e,t){"use strict";class n extends t.Component{render(e){let n=t.toChildArray(e?.children),r=n[0];if(this._isVNode(r)&&"function"==typeof r.type&&r.type.__ojIsEnvironmentWrapper&&(n=t.toChildArray(r.props?.children),r=n[0]),1!==n.length||!this._isVNode(r)||"string"!=typeof r.type)throw new Error("The only child of the Remounter must be a custom element node");const o=this._getElementKey(r);return[t.cloneElement(r,{key:o})]}_getElementKey(e){const n=t.toChildArray(e.props?.children).map(e=>this._isVNode(e)?this._getSlotInfo(e):e);return JSON.stringify(n)}_getSlotInfo(e){let t=e.type;return t="string"==typeof t?t:t.name||String(t),{key:e.key,type:t,slot:e.props?.slot}}_isVNode(e){return"string"!=typeof e&&isNaN(e)}}e.Remounter=n,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojvcomponent-remounter.js.map