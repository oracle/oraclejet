/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojtemplateengine-utils"],function(e){"use strict";return new class{constructor(){this._defaultProps=new Map}execute(t,r,n,o,a){const c=r.getAttribute("data-oj-as"),l=e.TemplateEngineUtils.getContext(null,t,r,n,o,c);if(r.render)return this._executeVDomTemplate(r,l);throw new Error("The render property is expected on the template for component "+t.id)}clean(t){return e.PreactTemplate.findTemplateRoots(t).forEach(t=>{e.PreactTemplate.clean(t)}),null}resolveProperties(t,r,n,o,a,c,l,p){const s=r.render;if(s){const t=e.TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps,n,o);return e.PreactTemplate.resolveVDomTemplateProps(r,s,n,o,a,t,l)}throw new Error("The render property is expected on the template for component "+t.id)}defineTrackableProperty(e,t,r,n){throw new Error("This template engine does not support trackable property")}_executeVDomTemplate(t,r){const n=t.render(r.$current);e.PreactTemplate.extendTemplate(t,e.PreactTemplate._ROW_CACHE_FACTORY,r=>{t._cachedRows.forEach(t=>{let n=r(t.currentContext);e.PreactTemplate.renderNodes(n,t)})});const o=document.createElement("div"),a={currentContext:r.$current,template:t,parentStub:o,computedVNode:null,vnode:void 0,nodes:void 0};return e.PreactTemplate.renderNodes(n,a),t._cachedRows.push(a),a.nodes}}});
//# sourceMappingURL=ojtemplateengine-preact.js.map