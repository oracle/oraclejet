/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojkoshared","knockout","ojs/ojcore-base"],function(e,t,n){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n,e.addPostprocessor({nodeHasBindings:function(e,t){return t||1===e.nodeType&&"oj-defer"===e.nodeName.toLowerCase()},getBindingAccessors:function(e,t,n){var r=n;return 1===e.nodeType&&"oj-defer"===e.nodeName.toLowerCase()&&((r=r||{})._ojDefer_=function(){}),r}}),t.bindingHandlers._ojDefer_={init:function(e,n,r,a,s){var i=e;if(i._shown)t.applyBindingsToDescendants(s,i);else if(!i._activateSubtree){for(var o=[];i.firstChild;)o.push(i.firstChild),i.removeChild(i.firstChild);i._activateSubtree=e=>{o.forEach(t=>e.appendChild(t)),t.applyBindingsToDescendants(s,e)}}return{controlsDescendantBindings:!0}}};class r extends HTMLElement{constructor(){super(),this._activateSubtreeInternal=null,this._shownInternal=!1}get _shown(){return this._shownInternal}get _activateSubtree(){return this._activateSubtreeInternal}set _activateSubtree(e){this._activateSubtreeInternal=e}_activate(){this._activateSubtree?(this._activateSubtree(this),this._activateSubtreeInternal=null):this._shownInternal=!0}}customElements.define("oj-defer",r),n._registerLegacyNamespaceProp("DeferElement",r)});
//# sourceMappingURL=ojdefer.js.map