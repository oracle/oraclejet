/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["knockout","ojs/ojcore","ojs/ojkoshared","ojs/ojhtmlutils","ojs/ojlogger","ojs/ojcustomelement-utils","preact","ojs/ojcore-base","ojs/ojcontext","ojs/ojmetadatautils"],function(e,t,r,o,n,s,a,i,l,c){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i,l=l&&Object.prototype.hasOwnProperty.call(l,"default")?l.default:l;const u=Symbol("row");class d{static executeVDomTemplate(t,r){const o=l.getContext(t).getBusyContext(),n=e.pureComputed({read:()=>t.render(r.$current)}).extend({rateLimit:{timeout:0,method:(e,t)=>{let r;return()=>{if(!r){const n=o.addBusyState({description:"pending changes for the template element"});r=setTimeout(()=>{r=void 0,e(),n()},t)}}}}}),s=n();d._extendTemplate(t,d._ROW_CACHE_FACTORY,e=>{t._cachedRows.forEach(t=>{let r=e(t.currentContext);d._renderNodes(r,t)})});const a=document.createElement("div"),i={currentContext:r.$current,template:t,parentStub:a,computedVNode:n,vnode:void 0,nodes:void 0};return d._renderNodes(s,i),t._cachedRows.push(i),n.subscribe(e=>{const r=t._cachedRows.find(e=>e.computedVNode===n);r&&d._renderNodes(e,r)}),i.nodes}static _renderNodes(e,t){const r=t.parentStub;let o=()=>Array.from(r.childNodes);t.nodes&&(o=d._getRetrieveNodesFunction(t.nodes)),a.render(e,r);const n=o();n.forEach(e=>{e.setAttribute&&e.setAttribute("data-oj-vdom-template-root",""),e[u]=t,e[s.CACHED_BINDING_PROVIDER]="preact"}),t.vnode=e,t.nodes=n}static clean(e){const t=e[u];if(!t.cleaned){t.cleaned=!0;const e=d._getInsertNodesFunction(t.nodes);a.render(null,t.parentStub),e(t.nodes),t.computedVNode.dispose();const r=t.template,o=r._cachedRows.indexOf(t);r._cachedRows.splice(o,1)}}static _getInsertNodesFunction(e){const t=e[e.length-1],r=t.parentNode,o=t.nextSibling;return e=>{e.forEach(e=>r.insertBefore(e,o))}}static _getRetrieveNodesFunction(e){const t=e[0],r=e[e.length-1],o=t.parentNode,n=t.previousSibling,s=r.nextSibling;return()=>{const e=[];for(let t=n?n.nextSibling:o.firstChild;t!==s;t=t.nextSibling)e.push(t);return e}}static resolveVDomTemplateProps(e,t,r,o,n,a,i){const l=s.CustomElementUtils.getPropertiesForElementTag(r),[c,u]=d._extendTemplate(e,d._COMPUTED_PROPS_CACHE_FACTORY,e=>{for(const t of c)t.recalculateValue(e)}),f=new p(e=>d._computeProps(e,r,l,o,n,i),t,a,u);return c.add(f),f}static _computeProps(e,t,r,o,n,a){const i=e(n),l=(Array.isArray(i)?i:[i]).find(e=>e.type===t);if(!l)throw new Error("Item template must contain an element named {elementTagName}");const u={},d=l.props;return Object.keys(d).forEach(e=>{o.has(e)&&(u[e]=s.transformPreactValue(null,c.getPropertyMetadata(e,r),l.props[e]))}),u}static _extendTemplate(e,t,r){if(!e._cachedRows){let o=e.render;Object.defineProperties(e,{_cachedRows:{writable:!0,value:t()},render:{enumerable:!0,get:()=>o,set(e){o=e,e&&r(e)}}})}return e._cachedRows}}d._COMPUTED_PROPS_CACHE_FACTORY=()=>{const e=new Set;return[e,e.delete.bind(e)]},d._ROW_CACHE_FACTORY=()=>[];class p{constructor(e,t,r,o){this._calculate=e,this._defaultProps=r,this._disposeCallback=o,this._value=e(t),this._merged=this._getMergedValue(this._value)}peek(){return this._merged}subscribe(e){if(this._sub)throw new Error("Resolved property observable does not support multiple subscribers");this._sub=e}dispose(){this._disposeCallback(this)}recalculateValue(e){const t=this._calculate(e),r=this._value;this._value=t,this._sub&&!i.Object.compareValues(t,r)&&(this._merged=this._getMergedValue(t),this._sub(this._merged))}_getMergedValue(e){return Object.assign({},this._defaultProps,e)}}return new function(){this.execute=function(t,r,o,n,a){var i=r.getAttribute("data-oj-as"),u=c(t,r,o,n,i);if(r.render)return d.executeVDomTemplate(r,u);var p=l(r,a);let f=p.childNodes;for(let e=0;e<f.length;e++){f[e][s.CACHED_BINDING_PROVIDER]="knockout"}return e.applyBindingsToDescendants(u,p),Array.prototype.slice.call(f,0)},this.clean=function(t){let r=t&&t.querySelectorAll?Array.from(t.querySelectorAll('[data-oj-vdom-template-root=""]')):[];return t&&t.hasAttribute&&t.hasAttribute("data-oj-vdom-template-root")&&r.push(t),r.forEach(e=>{d.clean(e)}),0===r.length?e.cleanNode(t):null},this.resolveProperties=function(o,n,u,p,f,h,m,_){const b=n.render;if(b){const e=this._getResolvedDefaultProps(u,p);return d.resolveVDomTemplateProps(n,b,u,p,f,e,m)}var g=n.getAttribute("data-oj-as"),v=c(o,n,f,h,g);return function(r,o,n){return s=e.pureComputed(function(){var s={};r.evalMap.forEach(function(t,r){var a=e.utils.unwrapObservable(t(o));n&&n(r,a),s[r[0]]=function(e,t,r){if(t.length<2)return r;for(var o=e[t[0]]||{},n=o,s=t.length-1,a=1;a<s;a++){var i=t[a],l=n[i]||{};n[i]=l,n=l}return n[t[s]]=r,o}(s,r,a)});var a=t.CollectionUtils.copyInto,i=a({},r.staticMap,null,!0);return i=a(i,s,null,!0)}),a=["peek","subscribe","dispose"],i={},a.forEach(function(e){i[e]=s[e].bind(s)}),i;var s,a,i}(function(e,t,o,n,c){var u=a.get(e);if(!u){u={},a.set(e,u);var d=l(e).querySelector(o);u.evalMap=function(e,t,o){for(var n=new Map,a=e?e.attributes:[],i=0;i<a.length;i++){var l=a[i],c=s.AttributeUtils.attributeToPropertyName(l.name).split(".");if(t.has(c[0])){var u=s.AttributeUtils.getExpressionInfo(l.value).expr;u&&n.set(c,r.createBindingExpressionEvaluator(u,o))}}return n}(d,n,t),u.staticMap=i(d,n,c)}return u}(n,v,u,p,_||o),v,m)},this.defineTrackableProperty=function(t,r,o,n){!function(t,r,o,n){var s=e.observable(o);Object.defineProperty(t,r,{get:function(){return s()},set:function(e){s(e),n&&n(e)},enumerable:!0})}(t,r,o,n)};var a=new WeakMap;function i(e,t,r){var o={};if(e){var n=e.style;n.display="none",n.position="absolute",e.setAttribute("data-oj-binding-provider","none"),r.appendChild(e),t.forEach(function(t){void 0!==e[t]&&(o[t]=e[t])}),r.removeChild(e)}return o}function l(e,t){var r=document.createElement("div");t&&(r._ojReportBusy=t);for(var n=o.getTemplateContent(e),s=0;s<n.length;s++)r.appendChild(n[s]);return r}function c(t,o,s,a,i){var l=o.__ojBindingContext?o.__ojBindingContext:e.contextFor(o);return l||(n.info("Binding context not found when processing template for element with id: "+t.id+". Using binding context for element instead."),l=e.contextFor(t)),r.extendBindingContext(l,s,a,i,t)}this._getResolvedDefaultProps=function(e,t){let r=this._defaultProps.get(e);if(!r){r=i(document.createElement(e),t,document.body),this._defaultProps.set(e,r)}return r},this._defaultProps=new Map}});
//# sourceMappingURL=ojtemplateengine.js.map