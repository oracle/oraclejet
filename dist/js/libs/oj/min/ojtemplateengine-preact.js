/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojtemplateengine-utils"],function(e){"use strict";return new class{constructor(){this._defaultProps=new Map}execute(t,r,n,o,a,c){const l=r.getAttribute("data-oj-as"),p=e.TemplateEngineUtils.getContext(null,t,r,n,o,l,c);if(r.render)return this._executeVDomTemplate(t,r,p,c);throw new Error(`The render property is expected on the template for component ${t.id}`)}clean(t,r){return e.PreactTemplate.findTemplateRoots(t,r).forEach(t=>{e.PreactTemplate.clean(t)}),null}resolveProperties(t,r,n,o,a,c,l,p){const s=r.render;if(s){const t=e.TemplateEngineUtils.getResolvedDefaultProps(this._defaultProps,n,o);return e.PreactTemplate.resolveVDomTemplateProps(r,s,n,o,a,t,l)}throw new Error(`The render property is expected on the template for component ${t.id}`)}defineTrackableProperty(e,t,r,n){throw new Error("This template engine does not support trackable property")}_executeVDomTemplate(t,r,n,o){const a=r.render(n.$current);e.PreactTemplate.extendTemplate(r,e.PreactTemplate._ROW_CACHE_FACTORY,n=>{r._cachedRows.forEach(r=>{let a=n(r.currentContext);e.PreactTemplate.renderNodes(t,a,r,o)})});const c=document.createElement("div"),l={currentContext:n.$current,template:r,parentStub:c,computedVNode:null,vnode:void 0,nodes:void 0};return e.PreactTemplate.renderNodes(t,a,l,o),r._cachedRows.push(l),l.nodes}}});
//# sourceMappingURL=ojtemplateengine-preact.js.map