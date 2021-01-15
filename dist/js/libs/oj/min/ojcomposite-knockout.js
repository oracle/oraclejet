/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","knockout","ojs/ojcustomelement","ojs/ojcustomelement-utils","ojs/ojkoshared","ojs/ojlogger","ojs/ojtemplateengine"],function(e,o,t,n,r,l,i){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const s={};e._registerLegacyNamespaceProp("CompositeTemplateRenderer",s),s.renderTemplate=function(t,n,r){var l=s._storeNodes(n,r);o.virtualElements.setDomNodeChildren(n,r),s.invokeViewModelMethod(n,t.viewModel,"attached",[t.viewModelContext]),s.invokeViewModelMethod(n,t.viewModel,"connected",[t.viewModelContext]);var i=s._getKoBindingContext().createChildContext(t.viewModel,void 0,function(o){o[e.Composite.__COMPOSITE_PROP]=n,o.__oj_slots=t.slotMap,o.__oj_nodestorage=l,o.$slotNodeCounts=t.slotNodeCounts,o.$slotCounts=t.slotNodeCounts,o.$props=t.props,o.$properties=t.props,o.$unique=t.unique,o.$uniqueId=t.uniqueId,o.$parent=null,o.$parentContext=null,o.$parents=null,o.$provided=null});o.applyBindingsToDescendants(i,n),s.invokeViewModelMethod(n,t.viewModel,"bindingsApplied",[t.viewModelContext])},s.getEnclosingComposite=function(t){for(var n=null,r=o.contextFor(t);r&&!n;r=r.$parentContext)n=r[e.Composite.__COMPOSITE_PROP];return n},s.createTracker=function(){return o.observable()},s.invokeViewModelMethod=function(e,t,n,r){if(null!=t){var l=t[n];if("function"==typeof l)try{return o.ignoreDependencies(l,t,r)}catch(o){throw new Error("Error while invoking "+n+" callback for "+e.tagName.toLowerCase()+" with id '"+e.id+"'.")}}},s._storeNodes=function(o,t){var r,l=o.childNodes;if(l){(r=document.createElement("div")).setAttribute("data-bind","_ojNodeStorage_"),r.style.display="none",t.push(r);for(var i=[],s=0;s<l.length;s++){var a=l[s];n.CustomElementUtils.isSlotable(a)&&i.push(a)}i.forEach(function(e){r.appendChild(e)}),e.Components&&e.Components.subtreeHidden(r)}return r},s._getKoBindingContext=function(){if(!s._BINDING_CONTEXT){var e=document.createElement("div");o.applyBindings(null,e),s._BINDING_CONTEXT=o.contextFor(e),o.cleanNode(e)}return s._BINDING_CONTEXT},s._BINDING_CONTEXT=null,
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
function(){function e(e,t){var n,r,l=["name","slot"],i=!1;if(t?(i=!0,l.push("data"),l.push("as"),r="ko _ojBindTemplateSlot_:{"):(i=!0,l.push("index"),r="ko _ojBindSlot_:{"),i){for(var s=[],a=0;a<l.length;a++){var d=l[a],u=o(e.getAttribute(d));u&&s.push(d+":"+u)}r+=s.join(","),r+="}";var p=document.createComment(r),c=document.createComment("/ko");n=[p];var _=e.parentNode;for(_.insertBefore(p,e);e.childNodes.length>0;){var m=e.childNodes[0];_.insertBefore(m,e),n.push(m)}n.push(c),_.replaceChild(c,e)}return n}function o(e){if(null!=e){var o=n.AttributeUtils.getExpressionInfo(e).expr;return null==o&&(o="'"+e+"'"),o}return null}r.registerPreprocessor("oj-bind-slot",e),r.registerPreprocessor("oj-slot",e),r.registerPreprocessor("oj-bind-template-slot",function(o){return e(o,!0)})}(),
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
o.bindingHandlers._ojNodeStorage_={init:function(){return{controlsDescendantBindings:!0}}};
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const a={};e._registerLegacyNamespaceProp("SlotUtils",a),a.cleanup=function(t,n){var r=n.__oj_nodestorage;if(r)for(var l=o.virtualElements.firstChild(t);l;){var i=o.virtualElements.nextSibling(l);null!=l.__oj_slots&&(r.appendChild(l),e.Components&&1===l.nodeType&&e.Components.subtreeHidden(l)),l=i}},
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
o.bindingHandlers._ojBindSlot_={init:function(t,n,r,l,i){o.utils.domNodeDisposal.addDisposeCallback(t,a.cleanup.bind(null,t,i));var s=i.__oj_slots,d=n(),u=o.utils.unwrapObservable,p=u(d.name)||"",c=u(d.slot)||"",_=u(d.index),m=null!=_?[s[p][_]]:s[p];if(m){var f;for(f=0;f<m.length;f++){m[f].__oj_slots=c}if(o.virtualElements.setDomNodeChildren(t,m),e.Components)for(f=0;f<m.length;f++){var v=m[f];1===v.nodeType&&e.Components.subtreeShown(v)}return{controlsDescendantBindings:!0}}o.virtualElements.childNodes(t).forEach(function(e){(function(e){return 1===e.nodeType||3===e.nodeType&&e.nodeValue.trim()})(e)&&(e.__oj_slots=c)})}},o.virtualElements.allowedBindings._ojBindSlot_=!0,
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
o.bindingHandlers._ojBindTemplateSlot_={init:function(t,n,r,s,d){o.utils.domNodeDisposal.addDisposeCallback(t,a.cleanup.bind(null,t,d));var u=d.__oj_slots,p=n(),c=o.utils.unwrapObservable,_=c(p.name)||"",m=u[_],f=m&&m[m.length-1],v=!1;if(!f)for(var g=o.virtualElements.childNodes(t),h=0;h<g.length;h++)if("TEMPLATE"===g[h].tagName){v=!0,f=g[h];break}if(f){var C=d[e.Composite.__COMPOSITE_PROP];"TEMPLATE"!==f.tagName&&l.error("Slot content for slot '"+_+"' under "+C.tagName.toLowerCase()+" with id '"+C.id+"' should be wrapped inside a <template> node."),f.__oj_slots=c(p.slot)||"",o.computed(function(){var e=c(p.data),n=c(p.as),r=i.execute(v?t:C,f,e,v?n:null);o.virtualElements.setDomNodeChildren(t,r)})}else o.virtualElements.setDomNodeChildren(t,[]);return{controlsDescendantBindings:!0}}},o.virtualElements.allowedBindings._ojBindTemplateSlot_=!0});
//# sourceMappingURL=ojcomposite-knockout.js.map