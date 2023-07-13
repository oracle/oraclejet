/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["knockout","ojs/ojcore","ojs/ojkoshared","ojs/ojcustomelement-utils","ojs/ojhtmlutils","ojs/ojtemplateengine-utils"],function(e,t,r,o,n,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r;const i=new WeakMap;return new class{constructor(){this._bindingProvider={__ContextFor:e.contextFor,__ExtendBindingContext:r.extendBindingContext,__KoComputed:e.computed,__Observable:e.observable}}execute(t,r,n,i,s,l){const p=r.getAttribute("data-oj-as"),c=a.TemplateEngineUtils.getContext(this._bindingProvider,t,r,n,i,p,l);if(r.render)throw new Error(`The render property is not expected on the template for component ${t.id}`);const u=this._createAndPopulateContainer(r,s);let d=u.childNodes;for(let e=0;e<d.length;e++){d[e][o.CACHED_BINDING_PROVIDER]="knockout"}return e.applyBindingsToDescendants(c,u),Array.prototype.slice.call(d,0)}clean(t,r){return e.cleanNode(t)}resolveProperties(e,t,r,o,n,i,s,l){if(t.render)throw new Error(`The render property is not expected on the template for component ${e.id}`);const p=t.getAttribute("data-oj-as"),c=a.TemplateEngineUtils.getContext(this._bindingProvider,e,t,n,i,p),u=this._getPropertyContributorsViaCache(t,c,r,o,l||e);return this._createComputed(u,c,s)}defineTrackableProperty(e,t,r,o){a.TemplateEngineUtils.createPropertyBackedByObservable(this._bindingProvider,e,t,r,o)}_createComputed(r,o,n){const a=e.pureComputed(()=>{const a={};r.evalMap.forEach((t,r)=>{var i=e.utils.unwrapObservable(t(o));n&&n(r,i),a[r[0]]=this._getMergedValue(a,r,i)});const i=t.CollectionUtils.copyInto;let s=i({},r.staticMap,null,!0);return s=i(s,a,null,!0),s});return this._wrap(a,["peek","subscribe","dispose"])}_wrap(e,t){const r={};return t.forEach(t=>{r[t]=e[t].bind(e)}),r}_createAndPopulateContainer(e,t){var r=document.createElement("div");t&&(r._ojReportBusy=t);for(var o=n.getTemplateContent(e),a=0;a<o.length;a++)r.appendChild(o[a]);return r}_getPropertyContributorsViaCache(e,t,r,o,n){let a=i.get(e);if(!a){a={},i.set(e,a);const s=this._createAndPopulateContainer(e).querySelector(r);a.evalMap=this._getPropertyEvaluatorMap(s,o,t),a.staticMap=this._getStaticPropertyMap(s,o,n)}return a}_getStaticPropertyMap(e,t,r){const o={};if(e){var n=e.style;n.display="none",n.position="absolute",e.setAttribute("data-oj-binding-provider","none"),r.appendChild(e),t.forEach(function(t){void 0!==e[t]&&(o[t]=e[t])}),r.removeChild(e)}return o}_getMergedValue(e,t,r){if(t.length<2)return r;const o=e[t[0]]||{};let n=o;const a=t.length-1;for(let e=1;e<a;e++){const r=t[e],o=n[r]||{};n[r]=o,n=o}return n[t[a]]=r,o}_getPropertyEvaluatorMap(e,t,n){for(var a=new Map,i=e?e.attributes:[],s=0;s<i.length;s++){var l=i[s],p=o.AttributeUtils.attributeToPropertyName(l.name).split(".");if(t.has(p[0])){var c=o.AttributeUtils.getExpressionInfo(l.value).expr;c&&a.set(p,r.createBindingExpressionEvaluator(c,n))}}return a}}});
//# sourceMappingURL=ojtemplateengine-ko.js.map