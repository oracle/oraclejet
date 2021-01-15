/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojhtmlutils","ojs/ojlogger","ojs/ojmetadatautils","ojs/ojcomposite-knockout","ojs/ojcustomelement","ojs/ojcustomelement-utils"],function(e,t,o,n,r,i,s,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const d={__BINDING_PROVIDER:"__oj_binding_prvdr",getContainingComposite:function(e,o){for(var n=null,r=e;r;)if((r=t.CompositeTemplateRenderer.getEnclosingComposite(r))&&"oj-module"!==r.nodeName.toLowerCase()){if(o&&!(16&e.compareDocumentPosition(o)))break;n=r}return n}};class l extends a.ElementState{getTrackChildrenOption(){return"immediate"}GetBindingProviderName(e){var t;const o=null==e?void 0:e.parentElement;return null!==(t=null==o?void 0:o[d.__BINDING_PROVIDER])&&void 0!==t?t:null}}
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */const u={};u.proto=Object.create(t.BaseCustomElementBridge.proto),u.DESC_KEY_CSS="css",u.DESC_KEY_PARSE_FUN="parseFunction",u.DESC_KEY_VIEW="view",u.DESC_KEY_VIEW_MODEL="viewModel",t.CollectionUtils.copyInto(u.proto,{beforePropertyChangedEvent:function(e,o,n){var r={property:o};t.CollectionUtils.copyInto(r,n),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"propertyChanged",[r])},AddComponentMethods:function(e){var t=function(e,t,o,n,r,i){if(!t.SaveEarlyPropertySet(e,o,n)){var s=t.SetProperty(e,o,n,r,i);if(s.propertySet)if(s.isSubproperty)u._getPropertyTracker(t,s.property).valueHasMutated()}};e.setProperty=function(e,o){var n=a.CustomElementUtils.getElementBridge(this);t(this,n,e,o,this,!0)},e.getProperty=function(e){return a.CustomElementUtils.getElementBridge(this).GetProperty(this,e,this)},e._propsProto.setProperty=function(e,o){t(this._ELEMENT,this._BRIDGE,e,o,this,!1)},e._propsProto.getProperty=function(e){return this._BRIDGE.GetProperty(this._ELEMENT,e,this)},e.getNodeBySubId=function(e){var t=a.CustomElementUtils.getElementBridge(this),o=t._getViewModel();return o.getNodeBySubId?o.getNodeBySubId(e,t._getNodeBySubId.bind(this)):t._getNodeBySubId.bind(this)(e)},e.getSubIdByNode=function(e){var t=a.CustomElementUtils.getElementBridge(this),o=t._getViewModel();return o.getSubIdByNode?o.getSubIdByNode(e,t._getSubIdByNode.bind(this)):t._getSubIdByNode.bind(this)(e)}},CreateComponent:function(e){for(var o={},n=a.CustomElementUtils.getSlotMap(e),r=Object.keys(n),i=0;i<r.length;i++){var s=r[i];o[s]=n[s].length}this._SLOT_MAP=n;var l=a.ElementUtils.getUniqueId(),_={element:e,props:Promise.resolve(this._PROPS),properties:this._PROPS,slotNodeCounts:Promise.resolve(o),slotCounts:o,unique:l};_.uniqueId=e.id?e.id:l,this._VM_CONTEXT=_;var m=a.CustomElementUtils.getElementDescriptor(e.tagName)[u.DESC_KEY_VIEW_MODEL];m="function"==typeof m?new m(_):t.CompositeTemplateRenderer.invokeViewModelMethod(e,m,"initialize",[_])||m,this._VIEW_MODEL=m;var E=t.CompositeTemplateRenderer.invokeViewModelMethod(e,m,"activated",[_])||Promise.resolve(!0),p=this;return E.then(function(){var n={props:p._PROPS,slotMap:p._SLOT_MAP,slotNodeCounts:o,unique:p._VM_CONTEXT.unique,uniqueId:p._VM_CONTEXT.uniqueId,viewModel:p._VIEW_MODEL,viewModelContext:p._VM_CONTEXT};Object.defineProperty(e,d.__BINDING_PROVIDER,{value:"knockout"}),t.Components&&t.Components.unmarkPendingSubtreeHidden(e);var r=a.CustomElementUtils.getElementRegistration(e.tagName).cache,i=u._getDomNodes(r.view,e);t.CompositeTemplateRenderer.renderTemplate(n,e,i)})},DefineMethodCallback:function(e,t,o){e[t]=function(){var e=o.internalName||t,n=a.CustomElementUtils.getElementBridge(this),r=n._getViewModel();return r[e].apply(r,arguments)}},DefinePropertyCallback:function(e,o,i){var s=function(e,r){if(!this._BRIDGE.SaveEarlyPropertySet(this._ELEMENT,o,e)){var s=u._getPropertyTracker(this._BRIDGE,o),d=s.peek();if(t.BaseCustomElementBridge.__CompareOptionValues(o,i,e,d))n.info(a.CustomElementUtils.getElementInfo(this._ELEMENT)+": Ignoring property set for property '"+o+"' with same value.");else if(r&&(e=this._BRIDGE.ValidatePropertySet(this._ELEMENT,o,e)),i._eventListener&&this._BRIDGE.SetEventListenerProperty(this._ELEMENT,o,e),s(e),!i._derived){var l=r?"external":"internal";t.BaseCustomElementBridge.__FirePropertyChangeEvent(this._ELEMENT,o,e,d,l),this._BRIDGE.State.dirtyProps.add(o)}}},d=function(e){var t=u._getPropertyTracker(this._BRIDGE,o),n=e?t.peek():t();return void 0===n&&t(n=r.getDefaultValue(i)),n};i._derived||t.BaseCustomElementBridge.__DefineDynamicObjectProperty(e._propsProto,o,function(){return d.bind(this,!1)()},function(e){s.bind(this)(e,!1)}),t.BaseCustomElementBridge.__DefineDynamicObjectProperty(e,o,function(){var e=a.CustomElementUtils.getElementBridge(this);return d.bind(e._PROPS,!0)()},function(e){var t=a.CustomElementUtils.getElementBridge(this);s.bind(t._PROPS)(e,!0)})},GetMetadata:function(e){return e._metadata||{}},HandleDetached:function(e){t.BaseCustomElementBridge.proto.HandleDetached.call(this,e),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"detached",[e]),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"disconnected",[e])},HandleReattached:function(e){t.BaseCustomElementBridge.proto.HandleReattached.call(this,e),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"connected",[this._VM_CONTEXT])},InitializeElement:function(e){var o;t.BaseCustomElementBridge.proto.InitializeElement.call(this,e),t.Components&&t.Components.markPendingSubtreeHidden(e);var n=a.CustomElementUtils.getElementRegistration(e.tagName).cache;if(!n.view){var r=(o=a.CustomElementUtils.getElementDescriptor(e.tagName))[u.DESC_KEY_VIEW];n.view||(n.view="string"==typeof r?u._getDomNodes(r,e):r)}if(!n.css){o||(o=a.CustomElementUtils.getElementDescriptor(e.tagName));var i=o[u.DESC_KEY_CSS];if(i){var s=document.createElement("style");s.type="text/css",s.styleSheet?s.styleSheet.cssText=i:s.appendChild(document.createTextNode(i)),document.head.appendChild(s),n.css=!0}}t.BaseCustomElementBridge.__InitProperties(e,e)},InitializePrototype:function(e){t.BaseCustomElementBridge.proto.InitializePrototype.call(this,e),Object.defineProperty(e,"_propsProto",{value:{}})},initializeBridge:function(e,o){t.BaseCustomElementBridge.proto.initializeBridge.call(this,e,o),e._propsProto&&(this._PROPS=Object.create(e._propsProto),this._PROPS._BRIDGE=this,this._PROPS._ELEMENT=e)},ShouldRemoveDisabled:function(){var e=this.METADATA.extension;return!!e&&!0===e._SHOULD_REMOVE_DISABLED},_getNodeBySubId:function(e){var o=u.__GetSubIdMap(this)[e.subId];if(o){if(o.alias){var n=t.CollectionUtils.copyInto({},e,void 0,!0);n.subId=o.alias;var r=o.node;return r.getNodeBySubId?r.getNodeBySubId(n):t.Components.__GetWidgetConstructor(r)("getNodeBySubId",n)}return o.node}return null},_getSubIdByNode:function(e){if(!this.contains(e))return null;var o,n,r,i=u.__GetNodeMap(this),s=d.getContainingComposite(e,this);if(null!=s){if((n=i[o=s.node.getAttribute("data-oj-subid-map")])&&s.getSubIdByNode&&(r=s.getSubIdByNode(e))){var a=n.map[r.subId];return r.subId=a,r}return null}for(var l=e;l!==this&&!(o=l.getAttribute("data-oj-subid-map")||l.getAttribute("data-oj-subid"));)l=l.parentNode;if(n=i[o]){if(!n.map)return{subId:o};var _=n.node;if(r=_.getSubIdByNode?_.getSubIdByNode(e):t.Components.__GetWidgetConstructor(_)("getSubIdByNode",e))return r.subId=n.map[r.subId],r}return null},_getViewModel:function(){return this._VIEW_MODEL||this.State.throwError("Cannot access methods before element is upgraded."),this._VIEW_MODEL}}),u.register=function(e,o){var r={};r[t.BaseCustomElementBridge.DESC_KEY_META]=u._getResource(e,o,t.BaseCustomElementBridge.DESC_KEY_META),r[u.DESC_KEY_VIEW]=u._getResource(e,o,u.DESC_KEY_VIEW),r[u.DESC_KEY_CSS]=u._getResource(e,o,u.DESC_KEY_CSS),r[u.DESC_KEY_VIEW_MODEL]=u._getResource(e,o,u.DESC_KEY_VIEW_MODEL),r[u.DESC_KEY_PARSE_FUN]=o[u.DESC_KEY_PARSE_FUN];const i={descriptor:r,bridgeProto:u.proto,stateClass:l,composite:!0,cache:{}};if(a.CustomElementUtils.registerElement(e,i)){var s=r[t.BaseCustomElementBridge.DESC_KEY_META];if(s||(n.warn("Composite registered'"+e.toLowerCase()+"' without Metadata."),s={}),null==r[u.DESC_KEY_VIEW])throw new Error("Cannot register composite '"+e.toLowerCase()+"' without a View.");r._metadata=t.BaseCustomElementBridge.__ProcessEventListeners(s,!1),customElements.define(e,u.proto.getClass(r))}},u._getDomNodes=function(e,t){var n,r;if("string"==typeof e)return o.stringToNodeArray(e);if(u._isDocumentFragment(e)){r=e.cloneNode(!0);var i=[];for(n=0;n<r.childNodes.length;n++)i.push(r.childNodes[n]);return i}if(Array.isArray(e)){for(r=[],n=0;n<e.length;n++)r.push(e[n].cloneNode(!0));return r}a.CustomElementUtils.getElementBridge(t).State.throwError("The composite View is not one of the following supported types: string, Array of DOM nodes, DocumentFragment")},u._generateSubIdMap=function(e,t){if(!e._SUBID_MAP){for(var o={},n={},r=t.children,i=0;i<r.length;i++)u._walkSubtree(o,n,r[i]);e._NODE_MAP=n,e._SUBID_MAP=o}},u._walkSubtree=function(e,o,n){if(!n.hasAttribute("slot")&&(u._addNodeToSubIdMap(e,o,n),!a.CustomElementUtils.isElementRegistered(n.tagName)&&!t.Components.__GetWidgetConstructor(n)))for(var r=n.children,i=0;i<r.length;i++)u._walkSubtree(e,o,r[i])},u._addNodeToSubIdMap=function(e,t,o){var n=o.getAttribute("data-oj-subid"),r=o.getAttribute("data-oj-subid-map");if(r){var i=JSON.parse(r);if("object"==typeof i&&!(i instanceof Array)){for(var s=i,a={},d=Object.keys(s),l=0;l<d.length;l++){var u=d[l];e[u]={alias:s[u],node:o},a[s[u]]=u}t[r]={map:a,node:o}}}else n&&(e[n]={node:o},t[n]={node:o})},u.__GetSubIdMap=function(e){var t=a.CustomElementUtils.getElementBridge(e);return u._generateSubIdMap(t,e),t._SUBID_MAP},u.__GetNodeMap=function(e){var t=a.CustomElementUtils.getElementBridge(e);return u._generateSubIdMap(t,e),t._NODE_MAP},u._getPropertyTracker=function(e,o){return e._TRACKERS||(e._TRACKERS={}),e._TRACKERS[o]||(e._TRACKERS[o]=t.CompositeTemplateRenderer.createTracker()),e._TRACKERS[o]},u._getResource=function(e,t,o){var n=t[o];if(null!=n){var r=Object.prototype.hasOwnProperty;if(r.call(n,"inline"))return n.inline;if(r.call(n,"promise"))throw new Error("Error while registering "+e+". The resource type for descriptor key '"+o+"' is no longer supported. The resource should be passed directly as the value instead.");return n}},u._isDocumentFragment=function(e){return window.DocumentFragment?e instanceof DocumentFragment:e&&11===e.nodeType};
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const _={};t._registerLegacyNamespaceProp("Composite",_),_.getMetadata=function(e){var t=_.getComponentMetadata(e);return t?Promise.resolve(t):null},_.getComponentMetadata=function(e){return a.CustomElementUtils.isComposite(e)?a.CustomElementUtils.getElementDescriptor(e)[t.BaseCustomElementBridge.DESC_KEY_META]:null},_.register=function(e,t){u.register(e,t)},_.getContainingComposite=d.getContainingComposite,_.__COMPOSITE_PROP="__oj_composite";
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
const m=_.register,E=_.getMetadata,p=_.getComponentMetadata,g=_.getContainingComposite,c=_.__COMPOSITE_PROP;e.__COMPOSITE_PROP=c,e.getComponentMetadata=p,e.getContainingComposite=g,e.getMetadata=E,e.register=m,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojcomposite.js.map