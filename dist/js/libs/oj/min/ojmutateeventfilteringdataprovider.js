/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcachediteratorresultsdataprovider","ojs/ojdedupdataprovider","ojs/ojcomponentcore","ojs/ojeventtarget","ojs/ojdataprovider"],function(t,e,a,s,i,r){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a;
/**
     * @license
     * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class n{constructor(s){this.dataProvider=s,this.MutateEventFilteringAsyncIterable=class{constructor(t,e,a,s){this._parent=t,this.params=e,this.dataProviderAsyncIterator=a,this.cache=s,this[Symbol.asyncIterator]=()=>new this._parent.MutateEventFilteringAsyncIterator(this._parent,this.params,this.dataProviderAsyncIterator,this.cache)}},this.MutateEventFilteringAsyncIterator=class{constructor(t,e,a,s){this._parent=t,this.params=e,this.asyncIterator=a,this.cache=s}next(){let t=this;return this.asyncIterator.next().then(s=>(t._parent.dataProvider instanceof e||t._parent.dataProvider instanceof a||t._parent.cache.addListResult(s),s))}},this.DataProviderMutationEventDetail=class{constructor(t,e,a){this.add=t,this.remove=e,this.update=a,this[n._ADD]=t,this[n._REMOVE]=e,this[n._UPDATE]=a}};let i=this;this.cache=s instanceof e||s instanceof a?s.cache:new t.DataCache,s.createOptimizedKeyMap&&(this.createOptimizedKeyMap=t=>s.createOptimizedKeyMap(t)),s.createOptimizedKeySet&&(this.createOptimizedKeySet=t=>s.createOptimizedKeySet(t)),s.addEventListener(n._MUTATE,t=>{if(t.detail){let e=i._processMutations(t.detail.remove),a=i._processMutations(t.detail.update);if(e&&e.keys&&e.keys.size>0||a&&a.keys&&a.keys.size>0||t.detail.add&&t.detail.add.keys&&t.detail.add.keys.size>0){let s=new i.DataProviderMutationEventDetail(t.detail.add,e,a),r=Object.assign({},t);r.detail=s,i.dispatchEvent(r)}}else i.dispatchEvent(t)}),s.addEventListener(n._REFRESH,t=>{i.cache.reset(),i.dispatchEvent(t)})}containsKeys(t){return this.dataProvider.containsKeys(t)}fetchByKeys(t){return this.dataProvider.fetchByKeys(t)}fetchByOffset(t){return this.dataProvider.fetchByOffset(t)}fetchFirst(t){const e=this.dataProvider.fetchFirst(t);return new this.MutateEventFilteringAsyncIterable(this,t,e[Symbol.asyncIterator](),this.cache)}getCapability(t){let e=this.dataProvider.getCapability(t);return"eventFiltering"===t?{type:"iterator"}:e}getTotalSize(){return this.dataProvider.getTotalSize()}isEmpty(){return this.dataProvider.isEmpty()}_processMutations(t){if(t){let e=t[n._KEYS];if(e&&e.size>0){let a=new Set,s=this.cache.getDataByKeys({keys:e});e.forEach(function(t){s.results.has(t)||a.add(t)});let i=Object.assign({},t);return a.forEach(function(t){let e=[];i.keys.forEach(function(t){e.push(t)});let a=e.indexOf(t);i.keys.delete(t),e.splice(a,1),i.data&&i.data.splice(a,1),i.indexes&&i.indexes.splice(a,1),i.metadata&&i.metadata.splice(a,1)}),i}}return t}}return n._KEY="key",n._KEYS="keys",n._DATA="data",n._METADATA="metadata",n._ITEMS="items",n._FROM="from",n._OFFSET="offset",n._REFRESH="refresh",n._MUTATE="mutate",n._SIZE="size",n._FETCHPARAMETERS="fetchParameters",n._VALUE="value",n._DONE="done",n._RESULTS="results",n._ADD="add",n._UPDATE="update",n._REMOVE="remove",n._INDEXES="indexes",i.EventTargetMixin.applyMixin(n),t._registerLegacyNamespaceProp("MutateEventFilteringDataProvider",n),n});
//# sourceMappingURL=ojmutateeventfilteringdataprovider.js.map