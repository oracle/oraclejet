/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojtemplateengine-utils"],function(e){"use strict";return new class{constructor(){this._defaultProps=new Map}execute(t,r,o,n,a){const l=r.getAttribute("data-oj-as"),c=e.TemplateEngineUtils.getContext(null,t,r,o,n,l);if(r.render)return this._executeVDomTemplate(r,c);throw new Error("The render property is expected on the template for component "+t.id)}clean(t){let r=t&&t.querySelectorAll?Array.from(t.querySelectorAll('[data-oj-vdom-template-root=""]')):[];return t&&t.hasAttribute&&t.hasAttribute("data-oj-vdom-template-root")&&r.push(t),r.forEach(t=>{e.PreactTemplate.clean(t)}),null}resolveProperties(t,r,o,n,a,l,c,p){const s=r.render;if(s){const t=e.TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps,o,n);return e.PreactTemplate.resolveVDomTemplateProps(r,s,o,n,a,t,c)}throw new Error("The render property is expected on the template for component "+t.id)}defineTrackableProperty(e,t,r,o){throw new Error("This template engine does not support trackable property")}_executeVDomTemplate(t,r){const o=t.render(r.$current);e.PreactTemplate.extendTemplate(t,e.PreactTemplate._ROW_CACHE_FACTORY,r=>{t._cachedRows.forEach(t=>{let o=r(t.currentContext);e.PreactTemplate.renderNodes(o,t)})});const n=document.createElement("div"),a={currentContext:r.$current,template:t,parentStub:n,computedVNode:null,vnode:void 0,nodes:void 0};return e.PreactTemplate.renderNodes(o,a),t._cachedRows.push(a),a.nodes}}});
//# sourceMappingURL=ojtemplateengine-preact.js.map