/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojkoshared","knockout","ojs/ojcore-base"],function(e,t,n){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n,e.addPostprocessor({nodeHasBindings:function(e,t){return t||1===e.nodeType&&"oj-defer"===e.nodeName.toLowerCase()},getBindingAccessors:function(e,t,n){var o=n;return 1===e.nodeType&&"oj-defer"===e.nodeName.toLowerCase()&&((o=o||{})._ojDefer_=function(){}),o}}),
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
t.bindingHandlers._ojDefer_={init:function(e,n,o,i,s){var r=e;if(r._shown)t.applyBindingsToDescendants(s,r);else{if(!r._savedChildNodes){for(var d=document.createDocumentFragment(),a=r.childNodes;a.length>0;)d.appendChild(a[0]);r._savedChildNodes=d}Object.defineProperty(r,"_activateDescedantBindings",{value:function(){t.applyBindingsToDescendants(s,r),delete r._activateDescedantBindings},configurable:!0})}return{controlsDescendantBindings:!0}}};
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const o={};n._registerLegacyNamespaceProp("DeferElement",o),o.register=function(){var e=Object.create(HTMLElement.prototype);Object.defineProperty(e,"_activate",{value:function(){this._activateDescedantBindings?(this._savedChildNodes&&(this.appendChild(this._savedChildNodes),delete this._savedChildNodes),this._activateDescedantBindings()):Object.defineProperty(this,"_shown",{configurable:!1,value:!0})},writable:!1});var t=function(){const e=window.Reflect;let t;return t=void 0!==e?e.construct(HTMLElement,[],this.constructor):HTMLElement.call(this),t};Object.defineProperty(e,"constructor",{value:t,writable:!0,configurable:!0}),t.prototype=e,Object.setPrototypeOf(t,HTMLElement),customElements.define("oj-defer",t)},o.register()});
//# sourceMappingURL=ojdefer.js.map