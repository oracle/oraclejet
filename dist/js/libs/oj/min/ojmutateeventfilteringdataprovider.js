/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojdataprovider","ojs/ojcachediteratorresultsdataprovider","ojs/ojdedupdataprovider","ojs/ojeventtarget"],function(t,e,a,i,s){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i;
/**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
/**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
class r{constructor(s){var n,d;this.dataProvider=s,this.MutateEventFilteringAsyncIterable=(d=class{constructor(t,e,a,i){this._parent=t,this.params=e,this.dataProviderAsyncIterator=a,this.cache=i,this[n]=()=>new this._parent.MutateEventFilteringAsyncIterator(this._parent,this.params,this.dataProviderAsyncIterator,this.cache)}},n=Symbol.asyncIterator,d),this.MutateEventFilteringAsyncIterator=class{constructor(t,e,a,i){this._parent=t,this.params=e,this.asyncIterator=a,this.cache=i}next(){let t=this;const s=this.params?.signal;return e.wrapWithAbortHandling(s,e=>e(this.asyncIterator.next().then(e=>(t._parent.dataProvider instanceof a||t._parent.dataProvider instanceof i||t._parent.cache.addListResult(e),e))),!1)}},this.DataProviderMutationEventDetail=class{constructor(t,e,a){this.add=t,this.remove=e,this.update=a,this[r._ADD]=t,this[r._REMOVE]=e,this[r._UPDATE]=a}};let c=this;this.cache=s instanceof a||s instanceof i?s.cache:new t.DataCache,s.createOptimizedKeyMap&&(this.createOptimizedKeyMap=t=>s.createOptimizedKeyMap(t)),s.createOptimizedKeySet&&(this.createOptimizedKeySet=t=>s.createOptimizedKeySet(t)),s.addEventListener(r._MUTATE,t=>{if(t.detail){let e=c._processMutations(t.detail.remove),a=c._processMutations(t.detail.update);if(e&&e.keys&&e.keys.size>0||a&&a.keys&&a.keys.size>0||t.detail.add&&t.detail.add.keys&&t.detail.add.keys.size>0){let i=new c.DataProviderMutationEventDetail(t.detail.add,e,a),s=Object.assign({},t);s.detail=i,c.dispatchEvent(s)}}else c.dispatchEvent(t)}),s.addEventListener(r._REFRESH,t=>{c.cache.reset(),c.dispatchEvent(t)})}containsKeys(t){return this.dataProvider.containsKeys(t)}fetchByKeys(t){const a=t?.signal;return e.wrapWithAbortHandling(a,e=>e(this.dataProvider.fetchByKeys(t)),!1)}fetchByOffset(t){const a=t?.signal;return e.wrapWithAbortHandling(a,e=>e(this.dataProvider.fetchByOffset(t)),!1)}fetchFirst(t){const e=this.dataProvider.fetchFirst(t);return new this.MutateEventFilteringAsyncIterable(this,t,e[Symbol.asyncIterator](),this.cache)}getCapability(t){let e=this.dataProvider.getCapability(t);return"eventFiltering"===t?{type:"iterator"}:e}getTotalSize(){return this.dataProvider.getTotalSize()}isEmpty(){return this.dataProvider.isEmpty()}_processMutations(t){if(t){let e=t[r._KEYS];if(e&&e.size>0){let a=new Set,i=this.cache.getDataByKeys({keys:e});e.forEach(function(t){i.results.has(t)||a.add(t)});let s=Object.assign({},t);return a.forEach(function(t){let e=[];s.keys.forEach(function(t){e.push(t)});let a=e.indexOf(t);s.keys.delete(t),e.splice(a,1),s.data&&s.data.splice(a,1),s.indexes&&s.indexes.splice(a,1),s.metadata&&s.metadata.splice(a,1)}),s}}return t}}
/**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
return r._KEY="key",r._KEYS="keys",r._DATA="data",r._METADATA="metadata",r._ITEMS="items",r._FROM="from",r._OFFSET="offset",r._REFRESH="refresh",r._MUTATE="mutate",r._SIZE="size",r._FETCHPARAMETERS="fetchParameters",r._VALUE="value",r._DONE="done",r._RESULTS="results",r._ADD="add",r._UPDATE="update",r._REMOVE="remove",r._INDEXES="indexes",s.EventTargetMixin.applyMixin(r),t._registerLegacyNamespaceProp("MutateEventFilteringDataProvider",r),r});
//# sourceMappingURL=ojmutateeventfilteringdataprovider.js.map