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
t.bindingHandlers._ojDefer_={init:function(e,n,o,i,r){var s=e;if(s._shown)t.applyBindingsToDescendants(r,s);else{if(!s._savedChildNodes){for(var a=document.createDocumentFragment(),d=s.childNodes;d.length>0;)a.appendChild(d[0]);s._savedChildNodes=a}Object.defineProperty(s,"_activateDescedantBindings",{value:function(){t.applyBindingsToDescendants(r,s),delete s._activateDescedantBindings},configurable:!0})}return{controlsDescendantBindings:!0}}};
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var o={};n._registerLegacyNamespaceProp("DeferElement",o),o.register=function(){var e=Object.create(HTMLElement.prototype);Object.defineProperty(e,"_activate",{value:function(){this._activateDescedantBindings?(this._savedChildNodes&&(this.appendChild(this._savedChildNodes),delete this._savedChildNodes),this._activateDescedantBindings()):Object.defineProperty(this,"_shown",{configurable:!1,value:!0})},writable:!1});var t=function(){var e=window.Reflect;return void 0!==e?e.construct(HTMLElement,[],this.constructor):HTMLElement.call(this)};Object.defineProperty(e,"constructor",{value:t,writable:!0,configurable:!0}),t.prototype=e,Object.setPrototypeOf(t,HTMLElement),customElements.define("oj-defer",t)},o.register()});
//# sourceMappingURL=ojdefer.js.map