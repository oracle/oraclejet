/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojlogger","ojs/ojcustomelement-utils","ojs/ojcustomelement-registry","ojs/ojmetadatautils","ojs/ojbootstrap","ojs/ojcore-base"],function(e,t,r,n,i,o,a){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;const s={};s.proto={getClass:function(e){var t=Object.create(HTMLElement.prototype);this.InitializePrototype(t);var n=this.GetMetadata(e);s._enumerateMetadataForKey(t,n,"properties",this.DefinePropertyCallback.bind(this)),s._enumerateMetadataForKey(t,n,"methods",this.DefineMethodCallback.bind(this)),this.AddComponentMethods(t),t.setProperties=function(e){r.CustomElementUtils.getElementBridge(this)._setProperties(this,e)},Object.defineProperty(t,"set",{value:function(e,t){this.setProperty(e,t)}}),Object.defineProperty(t,"unset",{value:function(e){this.setProperty(e,void 0)}}),t.attributeChangedCallback=this.AttributeChangedCallback,t.connectedCallback=this._connectedCallback,t.disconnectedCallback=this._detachedCallback;const i=t.appendChild;t.appendChild=function(e){return r.CustomElementUtils.canRelocateNode(this,e)?i.call(this,e):e};const o=t.insertBefore;t.insertBefore=function(e,t){return r.CustomElementUtils.canRelocateNode(this,e)?o.call(this,e,t):e},t.setAttribute=function(e,t){if("class"===e){const e=r.CustomElementUtils.getClassSet(t);r.CustomElementUtils.getElementState(this).setOuterClasses(e)}else HTMLElement.prototype.setAttribute.call(this,e,t)},t.removeAttribute=function(e){"class"===e?this.setAttribute("class",""):HTMLElement.prototype.removeAttribute.call(this,e)};var a=function(){var e=window.Reflect;return void 0!==e?e.construct(HTMLElement,[],this.constructor):HTMLElement.call(this)},l=this;return Object.defineProperty(a,"observedAttributes",{get:function(){return l.GetAttributes(n)}}),Object.defineProperty(t,"constructor",{value:a,writable:!0,configurable:!0}),a.prototype=t,Object.setPrototypeOf(a,HTMLElement),a},initializeBridge:function(e,t){this.METADATA=this.GetMetadata(t),this._eventListeners={},this.State=r.CustomElementUtils.getElementState(e)},AddComponentMethods:function(e){},AttributeChangedCallback:function(e,o,a){const l=r.AttributeUtils.attributeToPropertyName(e),u=r.CustomElementUtils.getElementBridge(this);if(o!==a||u.State.dirtyProps.has(l)){if(u.State.dirtyProps.delete(l.split(".")[0]),"disabled"===e&&u.ShouldRemoveDisabled()&&u._isDisabledAttributeRemoved())return void(null!=a&&(t.warn("Ignoring 'disabled' attribute change after component initialization. Use element property setter instead."),u._removeDisabledAttribute(this)));if(u.ShouldHandleAttributeChanged(this)){s.__CheckOverlappingAttribute(this,e),null===a&&(a=void 0);var p={detail:{attribute:e,value:a,previousValue:o}};if(this.dispatchEvent(new CustomEvent("attribute-changed",p)),!r.AttributeUtils.getExpressionInfo(a).expr){const t=i.getPropertyMetadata(l,n.getElementProperties(this));t&&this.setProperty(l,s.__ParseAttrValue(this,e,l,a,t)),u.HandleAttributeChanged(this,e,o,a)}}}},CreateComponent:function(e){},DefineMethodCallback:function(e,t,r){},DefinePropertyCallback:function(e,t,r){},GetAttributes:function(e){return e?i.getFlattenedAttributes(e.properties):[]},GetMetadata:function(e){return e[s.DESC_KEY_META]||{}},GetAliasForProperty:function(e){return e},ShouldHandleAttributeChanged:function(e){return this.State.canHandleAttributes()},ShouldCallHandleAttributeChanged:function(e){return this.ShouldHandleAttributeChanged()},HandleAttributeChanged:function(e,t,r,n){},HandleBindingsApplied:function(e,t){},HandleDetached:function(e){},HandleReattached:function(e){},InitializeElement:function(e){},InitializePrototype:function(e){},BatchedPropertySet:function(e,t){for(var r=Object.keys(t),n=0;n<r.length;n++){var i=r[n];e.setProperty(i,t[i])}},GetEventListenerProperty:function(e){var t=r.AttributeUtils.eventListenerPropertyToEventType(e),n=this._eventListeners[t];if(n)return n.getListener()},GetProperty:function(e,t,o){var a=i.getPropertyMetadata(t,n.getElementProperties(e));return r.AttributeUtils.isEventListenerProperty(t)||!a||-1===t.indexOf(".")?o[t]:r.CustomElementUtils.getPropertyValue(o,t)},HandlePropertyChanged:function(e,t,r,n,i,o){var a=i?"external":"internal";s.__FirePropertyChangeEvent(e,t,r,n,a,o)},PlaybackEarlyPropertySets:function(e){if(this._earlySets){const t=n.getElementDescriptor(e.tagName),i=this.GetMetadata(t);for(;this._earlySets.length;){const t=this._earlySets.shift(),n=r.transformPreactValue(e,i.properties[t.property],t.value);e.setProperty(t.property,n)}}},SaveEarlyPropertySet:function(e,t,r){return!this.State.allowPropertySets()&&(this._earlySets||(this._earlySets=[]),this._earlySets.push({property:t,value:r}),!0)},SetEventListenerProperty:function(e,t,n){var i=r.AttributeUtils.eventListenerPropertyToEventType(t),o=this._eventListeners[i];o||(o=this._createEventListenerWrapper(),this._eventListeners[i]=o,e.addEventListener(i,o)),null==n||n instanceof Function?o.setListener(n):s.__ThrowTypeError(e,t,n,"function")},SetProperty:function(t,o,a,l,u){var p=i.getPropertyMetadata(o,n.getElementProperties(t));if(r.AttributeUtils.isEventListenerProperty(o)||!p)t[o]=a;else{var c=t.getProperty(o),d=o.split("."),h=d[0],y=l[h];e.CollectionUtils.isPlainObject(y)&&(y=e.CollectionUtils.copyInto({},y,void 0,!0));var f=void 0===a&&1===d.length?p.value:a;if(!r.ElementUtils.comparePropertyValues(p.writeback,f,c)){var b=-1!==o.indexOf(".");if(b&&(this._SKIP_PROP_CHANGE_EVENT=!0),u?this.ValidateAndSetProperty(this.GetAliasForProperty.bind(this),l,o,a,t):s.__SetProperty(this.GetAliasForProperty.bind(this),l,o,a),this._SKIP_PROP_CHANGE_EVENT=!1,b){var m={path:o,value:a,previousValue:c};this.HandlePropertyChanged(t,h,l[h],y,u,m)}return this.State.dirtyProps.add(h),{property:h,propertySet:!0,isSubproperty:b}}}return{property:null,propertySet:!1,isSubproperty:!1}},ShouldRemoveDisabled:function(){return!0},ValidateAndSetProperty:function(e,t,r,n,i){var o=this.ValidatePropertySet(i,r,n);s.__SetProperty(e,t,r,o)},ValidatePropertySet:function(e,o,a){var l=n.getElementProperties(e),u=i.getPropertyMetadata(o,l),p=o.split(".");if(u){if(l[p[0]].readOnly)throw new r.JetElementError(e,`Read-only property '${o}' cannot be set.`);try{i.checkEnumValues(e,o,a,u)}catch(t){throw new r.JetElementError(e,t.message)}return null!=a?s.checkType(e,o,a,u):a}t.warn(r.CustomElementUtils.getElementInfo(e)+": Ignoring property set for undefined property '"+o+"'.")},PostCreate:function(e){e.hasAttribute("disabled")&&this.ShouldRemoveDisabled()&&!this._isDisabledAttributeRemoved()&&this._removeDisabledAttribute(e)},_connected:function(e){const t=this.State;if(t.isComplete())this.HandleReattached(e);else if(t.startCreationCycle(),t.isCreating()){this.InitializeElement(e),t.setBindingProviderCallback(this.PlaybackEarlyPropertySets.bind(this,e));const r=()=>{try{t.getSlotMap(!0);return(this.CreateComponent(e)||Promise.resolve()).then(this.PostCreate.bind(this,e))}catch(e){return Promise.reject(e)}};t.setCreateCallback(r)}},_connectedCallback:function(){r.CustomElementUtils.getElementBridge(this)._connected(this)},_detachedCallback:function(){const e=r.CustomElementUtils.getElementBridge(this),t=e.State;t.isComplete()?e.HandleDetached(this):t.pauseCreationCycle()},_createEventListenerWrapper:function(){var e,t=function(t){e&&e(t)};return t.setListener=function(t){e=t},t.getListener=function(){return e},t},_setProperties:function(e,t){for(var r=[],n={},i=!1,o=Object.keys(t),a=0;a<o.length;a++){var s=o[a];s.indexOf(".")>=0?r.push(s):(n[s]=t[s],i=!0)}i&&this.BatchedPropertySet(e,n);for(var l=0;l<r.length;l++){var u=r[l];e.setProperty(u,t[u])}},_isDisabledAttributeRemoved:function(){return!0===this._disabledProcessed},_removeDisabledAttribute:function(e){this._disabledProcessed=!0,e.removeAttribute("disabled")}},s._enumerateMetadataForKey=function(e,t,r,n){if(t&&t[r]){var i=t[r];Object.keys(i).forEach(function(t){n(e,t,i[t])})}},s.checkType=function(e,t,n,i){const o=i.type,a=r.ElementUtils.getSupportedTypes(o);if(1===a.typeCount&&!a.any&&!a.other){const r=typeof n;if(a.array&&!Array.isArray(n)||a.object&&"object"!==r||a.string&&"string"!==r||a.number&&("number"!==r||!isFinite(n)))s.__ThrowTypeError(e,t,n,o);else if(a.boolean)return!!n}return n},s.__ThrowTypeError=function(e,t,n,i){throw new r.JetElementError(e,`Invalid type '${typeof n}' found for property '${t}'. Expected value of type '${i}'.`)},s.__CheckOverlappingAttribute=function(e,t){var n=t.split(".");if(n.length>1)for(n.pop();n.length;){var i=n.join(".");if(e.hasAttribute(i))throw new r.JetElementError(e,`Cannot set overlapping attributes '${t}' and '${i}'.`);n.pop()}},s.__InitProperties=function(e,t){const o=r.CustomElementUtils.getElementBridge(e);var a=n.getElementProperties(e);if(a)for(var l=e.attributes,u=0;u<l.length;u++){var p=l[u],c=r.AttributeUtils.attributeToPropertyName(p.nodeName),d=i.getPropertyMetadata(c,a);if(d&&!d.readOnly)if(s.__CheckOverlappingAttribute(e,p.nodeName),!r.AttributeUtils.getExpressionInfo(p.value).expr){var h=s.__ParseAttrValue(e,p.nodeName,c,p.value,d);o.ValidateAndSetProperty(o.GetAliasForProperty.bind(o),t,c,h,e)}}},s.__SetProperty=function(e,t,r,n){var i,o=t,a=r.split("."),s=e(a[0]);a.length>1&&!t[s]&&(o=i={});for(var l=0;l<a.length;l++){var u=e(a[l]);l===a.length-1?o[u]=n:o[u]||(o[u]={}),o=o[u]}i&&(t[s]=i[s])},s.__ParseAttrValue=function(e,t,i,o,a){if(null==o)return o;function s(n){return r.AttributeUtils.attributeToPropertyValue(e,t,n,a)}var l=n.getElementDescriptor(e.tagName).parseFunction;return l?l(o,i,a,function(e){return s(e)}):s(o)},s.__ProcessEventListeners=function(t){var n=e.CollectionUtils.copyInto({},t,void 0,!0,1);return n.properties=n.properties||{},s._enumerateMetadataForKey(null,n,"properties",function(e,t){var i=r.AttributeUtils.propertyNameToChangeEventType(t),o=r.AttributeUtils.eventTypeToEventListenerProperty(i);n.properties[o]={_derived:!0,_eventListener:!0}}),s._enumerateMetadataForKey(null,n,"events",function(e,t){var i=r.AttributeUtils.eventTypeToEventListenerProperty(t);n.properties[i]={_derived:!0,_eventListener:!0}}),n},s.__FirePropertyChangeEvent=function(e,t,n,i,o,a){var s=r.CustomElementUtils.getElementBridge(e);if(!s._SKIP_PROP_CHANGE_EVENT){var l={};a&&(l.subproperty=a),l.value=n,l.previousValue=i,l.updatedFrom=o,s.beforePropertyChangedEvent&&s.beforePropertyChangedEvent(e,t,l),("external"!==o||s.State.isComplete())&&e.dispatchEvent(new CustomEvent(t+"Changed",{detail:l}))}},s.__DefineDynamicObjectProperty=function(e,t,r,n){Object.defineProperty(e,t,{enumerable:!0,get:r,set:n})},s.DESC_KEY_META="metadata",e._registerLegacyNamespaceProp("BaseCustomElementBridge",s),o.whenDocumentReady().then(function(){!function(){var e=document.createElement("div");e.style.border="1px solid",e.style.borderColor="red green",e.style.position="absolute",e.style.top="-999px",e.style.backgroundImage="url(data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=)";var t=document.body;t.appendChild(e);var r=window.getComputedStyle(e),n=r.backgroundImage;r.borderTopColor!==r.borderRightColor&&(null==n||"none"!==n&&"url (invalid-url:)"!==n)||t.classList.add("oj-hicontrast"),t.removeChild(e)}()}),o.whenDocumentReady().then(function(){!function(){let e=[];const t=a.AgentUtils.getAgentInfo();e.push(`oj-agent-os-${t.os.toLowerCase()}`),e.push(`oj-agent-browser-${t.browser.toLowerCase()}`),document.documentElement.classList.add(...e)}()})});
//# sourceMappingURL=ojcustomelement.js.map