/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","jquery","ojs/ojarraydataprovider","ojs/ojeventtarget","ojs/ojlogger"],function(t,e,r,a,s,i){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,r=r&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class o{set data(t){const e=null==this._data?[]:this._data;if(this._data=t,this._getRootDataProvider()===this)if((null==e||0===e.length)&&null!=this._data&&this._data.length>0||(null==this._data||0===this._data.length)&&null!=e&&e.length>0||this._data.length!==e.length)this._keys=null,this._baseDataProvider=new a(this._data,this._baseDPOptions),this._dataRefreshed(null,null);else{const t=this.findDiffNodes(this._data,e,[],"",{},{}),r=t.add,{refresh:s}=t;if(this._baseDataProvider=new a(this._data,this._baseDPOptions),r.length>0||s.length>0){const{mutationEvent:e,refreshEvent:a}=this._dataMutated(r,t.refresh);this._dataRefreshed(e,a)}}}get data(){return this._data}constructor(t,e,r,s){var i;this.keyAttribute=e,this.options=r,this._rootDataProvider=s,this.TreeAsyncIterator=class{constructor(t,e){this._parent=t,this._baseIterable=e}next(){return this._baseIterable[Symbol.asyncIterator]().next().then(t=>{const e=t.value.metadata;for(let r=0;r<e.length;r++)e[r]=this._parent._getTreeMetadata(e[r],t.value.data[r]);return t})}},this.TreeAsyncIterable=(i=class{constructor(t,e){this._parent=t,this._asyncIterator=e,this[Symbol.asyncIterator]=()=>this._asyncIterator}},Symbol.asyncIterator,i),this._mapKeyToNode=new Map,this._mapNodeToKey=new Map,this._mapKeyToParentNodePath=new Map,this._baseDPOptions={keyAttributes:e},r&&(r.textFilterAttributes&&(this._baseDPOptions.textFilterAttributes=r.textFilterAttributes),r.sortComparators&&(this._baseDPOptions.sortComparators=r.sortComparators),r.implicitSort&&(this._baseDPOptions.implicitSort=r.implicitSort),r.keyAttributeScope&&(this._baseDPOptions.keyAttributesScope=r.keyAttributeScope),r.childrenAttribute&&(this._baseDPOptions.childrenAttribute=r.childrenAttribute)),this._baseDataProvider=new a(t,this._baseDPOptions),this._childrenAttr=this.options&&this.options.childrenAttribute?this.options.childrenAttribute:"children",null==s&&(this._parentNodePath=[],this._processTreeArray(t,[])),this.data=t}getChildDataProvider(t,e){const r=this._getNodeForKey(t);if(r){const e=this._getChildren(r);if(e){const r=new o(e,this.keyAttribute,this.options,this._getRootDataProvider());if(Object.defineProperty(r,"data",{writable:!1}),null!=r){const e=this._getRootDataProvider();r._parentNodePath=e._mapKeyToParentNodePath.get(JSON.stringify(t))}return r}}return null}fetchFirst(t){t=this._applyLeafNodeFilter(t);const e=this._baseDataProvider.fetchFirst(t);return new this.TreeAsyncIterable(this,new this.TreeAsyncIterator(this,e))}fetchByOffset(t){t=this._applyLeafNodeFilter(t);return this._baseDataProvider.fetchByOffset(t).then(e=>{const r=e.results,a=[];for(const t of r){let e=t.metadata;const r=t.data;e=this._getTreeMetadata(e,r),a.push({data:r,metadata:e})}const s={done:e.done,fetchParameters:e.fetchParameters,results:a};return"enabled"===t.includeFilteredRowCount&&(s.totalFilteredRowCount=e.totalFilteredRowCount),s})}fetchByKeys(t){const e=new Map;return t.keys.forEach(t=>{const r=this._getNodeForKey(t);r&&e.set(t,{metadata:{key:t},data:r})}),Promise.resolve({fetchParameters:t,results:e})}containsKeys(t){return this.fetchByKeys(t).then(e=>{const r=new Set;return t.keys.forEach(t=>{null!=e.results.get(t)&&r.add(t)}),Promise.resolve({containsParameters:t,results:r})})}getCapability(t){return this._baseDataProvider.getCapability(t)}getTotalSize(){return this._baseDataProvider.getTotalSize()}isEmpty(){return this._baseDataProvider.isEmpty()}createOptimizedKeySet(t){return this._baseDataProvider.createOptimizedKeySet(t)}createOptimizedKeyMap(t){return this._baseDataProvider.createOptimizedKeyMap(t)}_processTreeArray(t,e){let r;t instanceof Array&&(r=t),r.forEach((r,a)=>{this._processNode(r,e,t)})}_getRootDataProvider(){return this._rootDataProvider?this._rootDataProvider:this}_processNode(t,e,r){const a=this._createKeyObj(t,e,r);this._setMapEntry(a.key,t);if(this._getRootDataProvider()._mapKeyToParentNodePath.set(JSON.stringify(a.key),a.keyPath),t){const e=this._getChildren(t);e&&this._processTreeArray(e,a.keyPath)}return a}_setMapEntry(t,e){const r=this._getRootDataProvider(),a=JSON.stringify(t);r._mapKeyToNode.has(a)&&i.warn(`Duplicate key ${a} found in MutableArrayTreeDataProvider.  Keys must be unique when keyAttributes ${this.keyAttribute} is specified`),r._mapKeyToNode.set(a,e),r._mapNodeToKey.set(e,t)}_createKeyObj(t,e,r){let a=this._getId(t);const s=e?e.slice():[];return s.push(a),this.options&&"siblings"===this.options.keyAttributeScope&&(a=s),{key:a,keyPath:s}}_getChildren(t){return this._getVal(t,this._childrenAttr,!0)}_getVal(t,e,r){if("string"==typeof e){const r=e.indexOf(".");if(r>0){const a=e.substring(0,r),s=e.substring(r+1),i=t[a];if(i)return this._getVal(i,s)}}return!0!==r&&"function"==typeof t[e]?t[e]():t[e]}_getId(t){let e;const r=this.keyAttribute;return e="@value"==r?this._getAllVals(t):this._getVal(t,r),e}_getAllVals(t){return"string"==typeof t||"number"==typeof t||"boolean"==typeof t?t:Object.keys(t).map(e=>this._getVal(t,e))}_getNodeMetadata(t){return{key:this._getKeyForNode(t)}}_getNodeForKey(t){return this._getRootDataProvider()._mapKeyToNode.get(JSON.stringify(t))}_getKeyForNode(t){return this._getRootDataProvider()._mapNodeToKey.get(t)}_applyLeafNodeFilter(t){if(t&&t.filterCriterion){const e=r.extend({},t);e.filterCriterion=this._getLeafNodeFilter(e.filterCriterion),e.filterCriterion.filter=t.filterCriterion.filter,t=e}return t}_getLeafNodeFilter(t){return{op:"$or",criteria:[t,{op:"$and",criteria:[{op:"$ne",attribute:this._childrenAttr,value:null},{op:"$ne",attribute:this._childrenAttr,value:void 0}]}]}}findDiffNodes(t,e,r,a,s,i){const o={add:[],refresh:[]};if(!t&&!e)return o;const n=r.slice();if(n.pop(),!t&&e||t&&!e)return o.refresh.push({parentKey:n[n.length-1],rootNode:s,oldRootNode:i}),o;if(t.length!==e.length)return o.refresh.push({parentKey:a,rootNode:s,oldRootNode:i}),o;{let h=0,d=0;for(let r=0;r<t.length;r++){t[r]!==e[r]&&(h++,d=r)}if(0===h)return o;if(h>1)return o.refresh.push({parentKey:n[n.length-1],rootNode:s,oldRootNode:i}),o;{const n=t[d],h=e[d];""===a&&(s=n,i=h);const{refresh:l,add:u}=this.compareNode(n,h,d,r,t,s,i);return o.refresh=[...o.refresh,...l],o.add=[...o.add,...u],o}}}compareNode(t,e,r,a,s,i,o){const n={add:[],refresh:[]},h=Object.keys(t);if(t===e)return n;if(null===t||null===e||["number","string","undefined"].indexOf(typeof t)>=0||["number","string","undefined"].indexOf(typeof e)>=0)return n.add.push({index:r,value:t,treeData:s,parentKeyPath:a,oldValue:e}),n;for(let i=0;i<h.length;i++){const o=h[i];if(o!==this._childrenAttr&&t[o]!==e[o]){n.add.push({index:r,value:t,treeData:s,parentKeyPath:a,oldValue:e});break}}const d=a.slice(),l=t.id;d.push(l);const{refresh:u,add:_}=this.findDiffNodes(t[this._childrenAttr],e[this._childrenAttr],d,l,i,o);return n.refresh=[...n.refresh,...u],n.add=[...n.add,..._],n}_dataMutated(t,r){let a,s=[],i=[],o=[],n=[],h=null,d=null;let l=null;const u=new Set,_=this._data;for(let t=0;t<r.length;t++)if(r[t]){if(!r[t].parentKey)return this._getRootDataProvider()._flushMaps(),this._getRootDataProvider()._processTreeArray(_,[]),d=new e.DataProviderRefreshEvent,{mutationEvent:h,refreshEvent:d};u.add(r[t].parentKey),this._getRootDataProvider()._flushMaps(),this._getRootDataProvider()._processTreeArray(this._data,[])}s=[],i=[],o=[],n=[];const p=[],c=[],y=[],f=[];for(a=0;a<t.length;a++)if(t[a]){const e=t[a].value;t[a].oldValue;this._getRootDataProvider()._flushMaps(),this._getRootDataProvider()._processTreeArray(_,[]);let r=t[a].treeData,s=t[a].parentKeyPath;const i=this._createKeyObj(e,s,r);p.push(i.key),c.push(e),y.push(t[a].index),f.push({key:i.key})}if(t.length>0){const t=new Set;p.forEach(e=>{t.add(e)}),l={data:c,indexes:y,keys:t,metadata:f}}return l&&(h=new e.DataProviderMutationEvent({add:null,remove:null,update:l})),(u.size||r.length)&&(d=new e.DataProviderRefreshEvent({keys:u})),{mutationEvent:h,refreshEvent:d}}_dataRefreshed(t,r){t||r?(t&&this._getRootDataProvider().dispatchEvent(t),r&&this._getRootDataProvider().dispatchEvent(r)):(this._getRootDataProvider()._flushMaps(),this._getRootDataProvider()._processTreeArray(this._data,[]),this._getRootDataProvider().dispatchEvent(new e.DataProviderRefreshEvent))}_getTreeMetadata(t,e){let r=!1,a=t.key;return this.options&&"siblings"==this.options.keyAttributeScope&&(r=!0),r&&(a=this._parentNodePath?this._parentNodePath.slice():[],a.push(t.key)),t=this._getNodeMetadata(this._getNodeForKey(a))}_releaseTreeArray(t){let e;e=t instanceof Array?t:t(),e.forEach((t,e)=>{this._releaseNode(t)})}_releaseNode(t){const e=this._getKeyForNode(t);if(this._deleteMapEntry(e,t),t){const e=this._getChildren(t);e&&this._releaseTreeArray(e)}}_deleteMapEntry(t,e){const r=this._getRootDataProvider();r._mapKeyToNode.delete(JSON.stringify(t)),r._mapNodeToKey.delete(e)}_flushMaps(){const t=this._getRootDataProvider();t._mapKeyToNode.clear(),t._mapNodeToKey.clear()}}s.EventTargetMixin.applyMixin(o),e._registerLegacyNamespaceProp("MutableArrayTreeDataProvider",o),t.MutableArrayTreeDataProvider=o,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojmutablearraytreedataprovider.js.map