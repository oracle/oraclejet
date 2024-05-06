/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojhtmlutils","ojs/ojlogger","ojs/ojmetadatautils","ojs/ojcomposite-knockout","ojs/ojcustomelement","ojs/ojcustomelement-utils","ojs/ojcustomelement-registry"],function(e,t,o,n,i,r,s,a,l){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;const d={getContainingComposite:function(e,o){for(var n=null,i=e;i;)if((i=t.CompositeTemplateRenderer.getEnclosingComposite(i))&&"oj-module"!==i.nodeName.toLowerCase()){if(o&&!(16&e.compareDocumentPosition(o)))break;n=i}return n}};class u extends a.LifecycleElementState{constructor(){super(...arguments),this._templateCleanCallbacks=[]}getTrackChildrenOption(){return"immediate"}addTemplateCleanCallback(e){this._templateCleanCallbacks.push(e)}cleanTemplates(){this._templateCleanCallbacks.forEach(e=>{e()}),this._templateCleanCallbacks=[]}}const c={};c.proto=Object.create(t.BaseCustomElementBridge.proto),c.DESC_KEY_CSS="css",c.DESC_KEY_PARSE_FUN="parseFunction",c.DESC_KEY_VIEW="view",c.DESC_KEY_VIEW_MODEL="viewModel",c.SUBID_MAP="data-oj-subid-map",c.DisconnectedState=0,c.ConnectedState=1,t.CollectionUtils.copyInto(c.proto,{beforePropertyChangedEvent:function(e,o,n){var i={property:o};t.CollectionUtils.copyInto(i,n),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"propertyChanged",[i])},AddComponentMethods:function(e){var t=function(e,t,o,n,i,r){if(!t.SaveEarlyPropertySet(e,o,n)){var s=t.SetProperty(e,o,n,i,r);if(s.propertySet)if(s.isSubproperty)c._getPropertyTracker(t,s.property).valueHasMutated()}};e.setProperty=function(e,o){var n=a.CustomElementUtils.getElementBridge(this);t(this,n,e,o,this,!0)},e.getProperty=function(e){return a.CustomElementUtils.getElementBridge(this).GetProperty(this,e,this)},e._propsProto.setProperty=function(e,o){t(this._ELEMENT,this._BRIDGE,e,o,this,!1)},e._propsProto.getProperty=function(e){return this._BRIDGE.GetProperty(this._ELEMENT,e,this)},e.getNodeBySubId=function(e){var t=a.CustomElementUtils.getElementBridge(this),o=t._getViewModel();return o.getNodeBySubId?o.getNodeBySubId(e,t._getNodeBySubId.bind(this)):t._getNodeBySubId.bind(this)(e)},e.getSubIdByNode=function(e){var t=a.CustomElementUtils.getElementBridge(this),o=t._getViewModel();return o.getSubIdByNode?o.getSubIdByNode(e,t._getSubIdByNode.bind(this)):t._getSubIdByNode.bind(this)(e)}},CreateComponent:function(e){const o=a.CustomElementUtils.getElementState(e).getSlotMap();for(var n={},i=Object.keys(o),r=0;r<i.length;r++){var s=i[r];n[s]=o[s].length}var d=a.ElementUtils.getUniqueId(),u={element:e,props:Promise.resolve(this._PROPS),properties:this._PROPS,slotNodeCounts:Promise.resolve(n),slotCounts:n,unique:d};u.uniqueId=e.id?e.id:d,this._VM_CONTEXT=u;var _=l.getElementDescriptor(e.tagName)[c.DESC_KEY_VIEW_MODEL];return _="function"==typeof _?new _(u):t.CompositeTemplateRenderer.invokeViewModelMethod(e,_,"initialize",[u])||_,this._VIEW_MODEL=_,(t.CompositeTemplateRenderer.invokeViewModelMethod(e,_,"activated",[u])||Promise.resolve(!0)).then(()=>this._processCompositeTemplate(e))},DefineMethodCallback:function(e,t,o){e[t]=function(){var e=o.internalName||t,n=a.CustomElementUtils.getElementBridge(this)._getViewModel();return n[e].apply(n,arguments)}},DefinePropertyCallback:function(e,o,r){var s=function(e,i){if(!this._BRIDGE.SaveEarlyPropertySet(this._ELEMENT,o,e)){i&&(e=a.transformPreactValue(this._ELEMENT,r,e));var s=c._getPropertyTracker(this._BRIDGE,o),l=s.peek();if(a.ElementUtils.comparePropertyValues(r.writeback,e,l))n.info(a.CustomElementUtils.getElementInfo(this._ELEMENT)+": Ignoring property set for property '"+o+"' with same value.");else if(i&&(e=this._BRIDGE.ValidatePropertySet(this._ELEMENT,o,e)),r._eventListener&&this._BRIDGE.SetEventListenerProperty(this._ELEMENT,o,e),s(e),!r._derived){var d=i?"external":"internal";t.BaseCustomElementBridge.__FirePropertyChangeEvent(this._ELEMENT,o,e,l,d),this._BRIDGE.State.dirtyProps.add(o)}}},l=function(e){var t=c._getPropertyTracker(this._BRIDGE,o),n=e?t.peek():t();return void 0===n&&t(n=i.getDefaultValue(r)),n};r._derived||t.BaseCustomElementBridge.__DefineDynamicObjectProperty(e._propsProto,o,function(){return l.bind(this,!1)()},function(e){s.bind(this)(e,!1)}),t.BaseCustomElementBridge.__DefineDynamicObjectProperty(e,o,function(){var e=a.CustomElementUtils.getElementBridge(this);return l.bind(e._PROPS,!0)()},function(e){var t=a.CustomElementUtils.getElementBridge(this);s.bind(t._PROPS)(e,!0)})},GetMetadata:function(e){return e._metadata||{}},HandleDetached:function(e){t.BaseCustomElementBridge.proto.HandleDetached.call(this,e),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"detached",[e]),t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"disconnected",[e]),this._verifyConnectDisconnect(e,c.DisconnectedState)},HandleAttached:function(e){this._verifyConnectDisconnect(e,c.ConnectedState)},HandleReattached:function(e){t.BaseCustomElementBridge.proto.HandleReattached.call(this,e),this._delayedTemplateRender?(this._delayedTemplateRender=!1,this._processCompositeTemplate(e)):t.CompositeTemplateRenderer.invokeViewModelMethod(e,this._VIEW_MODEL,"connected",[this._VM_CONTEXT]),this._verifyConnectDisconnect(e,c.ConnectedState)},InitializeElement:function(e){var o;t.BaseCustomElementBridge.proto.InitializeElement.call(this,e),t.Components&&t.Components.markPendingSubtreeHidden(e);var n=l.getElementRegistration(e.tagName).cache;if(!n.view){var i=(o=l.getElementDescriptor(e.tagName))[c.DESC_KEY_VIEW];n.view||(n.view="string"==typeof i?c._getDomNodes(i,e):i)}if(!n.css){o||(o=l.getElementDescriptor(e.tagName));var r=o[c.DESC_KEY_CSS];if(r){var s=document.createElement("style");s.type="text/css",s.styleSheet?s.styleSheet.cssText=r:s.appendChild(document.createTextNode(r)),document.head.appendChild(s),n.css=!0}}t.BaseCustomElementBridge.__InitProperties(e,e)},InitializePrototype:function(e){t.BaseCustomElementBridge.proto.InitializePrototype.call(this,e),Object.defineProperty(e,"_propsProto",{value:{}})},initializeBridge:function(e,o){t.BaseCustomElementBridge.proto.initializeBridge.call(this,e,o),e._propsProto&&(this._PROPS=Object.create(e._propsProto),this._PROPS._BRIDGE=this,this._PROPS._ELEMENT=e)},ShouldRemoveDisabled:function(){var e=this.METADATA.extension;return!!e&&!0===e._SHOULD_REMOVE_DISABLED},_getNodeBySubId:function(e){var o=c.__GetSubIdMap(this)[e.subId];if(o){if(o.alias){var n=t.CollectionUtils.copyInto({},e,void 0,!0);n.subId=o.alias;var i=o.node;return i.getNodeBySubId?i.getNodeBySubId(n):t.Components.__GetWidgetConstructor(i)("getNodeBySubId",n)}return o.node}return null},_getSubIdByNode:function(e){if(!this.contains(e))return null;var o,n,i,r=c.__GetNodeMap(this),s=d.getContainingComposite(e,this);if(null!=s){if((n=r[o=s.node.getAttribute(c.SUBID_MAP)])&&s.getSubIdByNode&&(i=s.getSubIdByNode(e))){var a=n.map[i.subId];return i.subId=a,i}return null}for(var l=e;l!==this&&!(o=l.getAttribute(c.SUBID_MAP)||l.getAttribute("data-oj-subid"));)l=l.parentNode;if(n=r[o]){if(!n.map)return{subId:o};var u=n.node;if(i=u.getSubIdByNode?u.getSubIdByNode(e):t.Components.__GetWidgetConstructor(u)("getSubIdByNode",e))return i.subId=n.map[i.subId],i}return null},_getViewModel:function(){if(!this._VIEW_MODEL)throw new a.JetElementError(this._ELEMENT,"Cannot access methods before element is upgraded.");return this._VIEW_MODEL},_verifyConnectDisconnect:function(e,t){void 0===this._verifyingState&&window.queueMicrotask(()=>{this._verifyingState===t&&(this._verifyingState===c.ConnectedState?this._verifiedConnect(e):this._verifiedDisconnect(e),this._verifyingState=void 0)}),this._verifyingState=t},_verifiedConnect:function(e){a.CustomElementUtils.getElementState(e).executeLifecycleCallbacks(!0)},_verifiedDisconnect:function(e){const t=a.CustomElementUtils.getElementState(e);t.cleanTemplates(),t.executeLifecycleCallbacks(!1)},_processCompositeTemplate:function(e){if(!e.isConnected)return void(this._delayedTemplateRender=!0);const o=a.CustomElementUtils.getElementState(e).getSlotMap(),n={props:this._PROPS,slotMap:o,slotNodeCounts:this._VM_CONTEXT.slotCounts,unique:this._VM_CONTEXT.unique,uniqueId:this._VM_CONTEXT.uniqueId,viewModel:this._VIEW_MODEL,viewModelContext:this._VM_CONTEXT};e[a.CHILD_BINDING_PROVIDER]="knockout",t.Components&&t.Components.unmarkPendingSubtreeHidden(e);const i=l.getElementRegistration(e.tagName).cache,r=c._getDomNodes(i.view,e);t.CompositeTemplateRenderer.renderTemplate(n,e,r)}}),c.register=function(e,o){var i={};i[t.BaseCustomElementBridge.DESC_KEY_META]=c._getResource(e,o,t.BaseCustomElementBridge.DESC_KEY_META),i[c.DESC_KEY_VIEW]=c._getResource(e,o,c.DESC_KEY_VIEW),i[c.DESC_KEY_CSS]=c._getResource(e,o,c.DESC_KEY_CSS),i[c.DESC_KEY_VIEW_MODEL]=c._getResource(e,o,c.DESC_KEY_VIEW_MODEL),i[c.DESC_KEY_PARSE_FUN]=o[c.DESC_KEY_PARSE_FUN];const r={descriptor:i,bridgeProto:c.proto,stateClass:u,composite:!0,cache:{}};var s=i[t.BaseCustomElementBridge.DESC_KEY_META];if(s||(n.warn("Composite registered'"+e.toLowerCase()+"' without Metadata."),s={}),null==i[c.DESC_KEY_VIEW])throw new Error("Cannot register composite '"+e.toLowerCase()+"' without a View.");i._metadata=t.BaseCustomElementBridge.__ProcessEventListeners(s,!1),l.registerElement(e,r,c.proto.getClass(i))},c._getDomNodes=function(e,t){var n,i;if("string"==typeof e)return o.stringToNodeArray(e);if(c._isDocumentFragment(e)){i=e.cloneNode(!0);var r=[];for(n=0;n<i.childNodes.length;n++)r.push(i.childNodes[n]);return r}if(Array.isArray(e)){for(i=[],n=0;n<e.length;n++)i.push(e[n].cloneNode(!0));return i}throw new a.JetElementError(t,"The composite View is not one of the following supported types: string, Array of DOM nodes, DocumentFragment")},c._generateSubIdMap=function(e,t){if(!e._SUBID_MAP){for(var o={},n={},i=t.children,r=0;r<i.length;r++)c._walkSubtree(o,n,i[r]);e._NODE_MAP=n,e._SUBID_MAP=o}},c._walkSubtree=function(e,o,n){if(!n.hasAttribute("slot")&&(c._addNodeToSubIdMap(e,o,n),!l.isElementRegistered(n.tagName)&&!t.Components.__GetWidgetConstructor(n)))for(var i=n.children,r=0;r<i.length;r++)c._walkSubtree(e,o,i[r])},c._addNodeToSubIdMap=function(e,t,o){var n=o.getAttribute("data-oj-subid"),i=o.getAttribute(c.SUBID_MAP);if(i){var r=JSON.parse(i);if("object"==typeof r&&!(r instanceof Array)){for(var s=r,a={},l=Object.keys(s),d=0;d<l.length;d++){var u=l[d];e[u]={alias:s[u],node:o},a[s[u]]=u}t[i]={map:a,node:o}}}else n&&(e[n]={node:o},t[n]={node:o})},c.__GetSubIdMap=function(e){var t=a.CustomElementUtils.getElementBridge(e);return c._generateSubIdMap(t,e),t._SUBID_MAP},c.__GetNodeMap=function(e){var t=a.CustomElementUtils.getElementBridge(e);return c._generateSubIdMap(t,e),t._NODE_MAP},c._getPropertyTracker=function(e,o){return e._TRACKERS||(e._TRACKERS={}),e._TRACKERS[o]||(e._TRACKERS[o]=t.CompositeTemplateRenderer.createTracker()),e._TRACKERS[o]},c._getResource=function(e,t,o){var n=t[o];if(null!=n){var i=Object.prototype.hasOwnProperty;if(i.call(n,"inline"))return n.inline;if(i.call(n,"promise"))throw new Error("Error while registering "+e+". The resource type for descriptor key '"+o+"' is no longer supported. The resource should be passed directly as the value instead.");return n}},c._isDocumentFragment=function(e){return window.DocumentFragment?e instanceof DocumentFragment:e&&11===e.nodeType};const _={};t._registerLegacyNamespaceProp("Composite",_),_.getMetadata=function(e){var t=_.getComponentMetadata(e);return t?Promise.resolve(t):null},_.getComponentMetadata=function(e){return l.isComposite(e)?l.getElementDescriptor(e)[t.BaseCustomElementBridge.DESC_KEY_META]:null},_.register=function(e,t){c.register(e,t)},_.getContainingComposite=d.getContainingComposite,_.__COMPOSITE_PROP="__oj_composite";const m=_.register,E=_.getMetadata,p=_.getComponentMetadata,g=_.getContainingComposite,C=_.__COMPOSITE_PROP;e.__COMPOSITE_PROP=C,e.getComponentMetadata=p,e.getContainingComposite=g,e.getMetadata=E,e.register=m,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojcomposite.js.map