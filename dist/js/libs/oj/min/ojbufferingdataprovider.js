/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojdataprovider","ojs/ojeventtarget","ojs/ojmap","ojs/ojbufferingdataproviderevents","ojs/ojcomponentcore"],function(t,e,a,s,i,r){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,s=s&&Object.prototype.hasOwnProperty.call(s,"default")?s.default:s;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class d{constructor(){this.unsubmittedItems=new s,this.submittingItems=new s,this.unsubmittedChangedItems=new s,this.mapOpTransform=new s,this.mapEditItemStatus=new s}addItem(t){const e=this.unsubmittedItems.get(t.metadata.key),a=this.submittingItems.get(t.metadata.key);this.unsubmittedChangedItems.get(t.metadata.key);if(e&&("add"===e.operation||"update"===e.operation)||a&&("add"===a.operation||"update"===a.operation))throw new Error("Cannot add item with same key as an item being added or updated");if(e&&"remove"===e.operation){const e={operation:"update",item:t};return this.unsubmittedItems.set(t.metadata.key,e),void this.mapOpTransform.set(t.metadata.key,e)}this.unsubmittedItems.set(t.metadata.key,{operation:"add",item:t})}removeItem(t){const e=this.unsubmittedItems.get(t.metadata.key),a=this.submittingItems.get(t.metadata.key);if(e&&"remove"===e.operation||a&&"remove"===a.operation)throw new Error("Cannot remove item with same key as an item being removed");e&&"add"===e.operation?this.unsubmittedItems.delete(t.metadata.key):(e&&e.operation,this.unsubmittedItems.set(t.metadata.key,{operation:"remove",item:t}))}updateItem(t){const e=this.unsubmittedItems.get(t.metadata.key),a=this.submittingItems.get(t.metadata.key);if(e&&"remove"===e.operation||a&&"remove"===a.operation)throw new Error("Cannot update item with same key as an item being removed");if(e&&("add"===e.operation||"update"===e.operation))return this.unsubmittedItems.set(t.metadata.key,{operation:e.operation,item:t}),void this.mapOpTransform.delete(t.metadata.key);this.unsubmittedChangedItems.set(t.metadata.key,!0),this.unsubmittedItems.set(t.metadata.key,{operation:"update",item:t})}setItemMutated(t){const e=t.item.metadata.key,a=this.submittingItems.get(e);if(a){"submitted"===this.mapEditItemStatus.get(e)?this.submittingItems.delete(e):(this.mapEditItemStatus.set(e,"mutated"),this.submittingItems.set(e,a))}}setItemStatus(t,e,a){const s=t.item.metadata.key;if("submitting"===e)this.unsubmittedItems.delete(s),this.submittingItems.set(s,t);else if("submitted"===e){if(t){"mutated"===this.mapEditItemStatus.get(s)?this.submittingItems.delete(s):this.mapEditItemStatus.set(s,"submitted")}this.unsubmittedChangedItems.delete(s)}else if("unsubmitted"===e){let e;this.submittingItems.delete(s),e=a?{operation:t.operation,item:{data:t.item.data,metadata:{key:t.item.metadata.key,message:a}}}:t,this.unsubmittedItems.set(s,e)}}getUnsubmittedItems(){return this.unsubmittedItems}getSubmittingItems(){return this.submittingItems}isEmpty(){return 0===this.unsubmittedItems.size&&0===this.submittingItems.size}getItem(t){let e=this.unsubmittedItems.get(t);return e||(e=this.submittingItems.get(t)),e}isUpdateTransformed(t){return!!this.mapOpTransform.get(t)}getEditItemStatus(t){return this.mapEditItemStatus.get(t)}resetAllUnsubmittedItems(){this.unsubmittedItems.clear(),this.submittingItems.clear(),this.unsubmittedChangedItems.clear(),this.mapOpTransform.clear()}}var n=function(t,e,a,s){return new(a||(a=Promise))(function(i,r){function d(t){try{o(s.next(t))}catch(t){r(t)}}function n(t){try{o(s.throw(t))}catch(t){r(t)}}function o(t){var e;t.done?i(t.value):(e=t.value,e instanceof a?e:new a(function(t){t(e)})).then(d,n)}o((s=s.apply(t,e||[])).next())})};class o{constructor(t,a){var s;this.dataProvider=t,this.options=a,this._generateKey=t=>this.customKeyGenerator?this.customKeyGenerator(t):crypto.randomUUID?crypto.randomUUID():([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,t=>(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16)),this.AsyncIterable=(s=class{constructor(t,e){this._parent=t,this._asyncIterator=e,this[Symbol.asyncIterator]=function(){return this._asyncIterator}}},Symbol.asyncIterator,s),this.AsyncIterator=class{constructor(t,e,a){this._parent=t,this._baseIterator=e,this._params=a,this.firstBaseKey=null,this.mergedAddKeySet=new Set,this.mergedItemArray=[],this.nextOffset=0,null==this._params&&(this._params={})}_fetchNext(){var t;const a=null===(t=this._params)||void 0===t?void 0:t.signal;if(a&&a.aborted){const t=a.reason;return Promise.reject(new DOMException(t,"AbortError"))}return new Promise((t,s)=>{if(a){const t=a.reason;a.addEventListener("abort",e=>s(new DOMException(t,"AbortError")))}t(this._baseIterator.next().then(t=>n(this,void 0,void 0,function*(){var a;!this.firstBaseKey&&t.value.metadata.length&&(this.firstBaseKey=t.value.metadata[0].key),t.value.fetchParameters&&t.value.fetchParameters.sortCriteria&&(this._parent.lastSortCriteria=t.value.fetchParameters.sortCriteria);const s=t.value.data.map((e,a)=>({data:t.value.data[a],metadata:t.value.metadata[a]}));this._parent.totalFilteredRowCount=t.value.totalFilteredRowCount,yield this._parent._mergeEdits(s,this.mergedItemArray,this._params.filterCriterion,this._parent.lastSortCriteria,!0,this.mergedAddKeySet,t.done);let i=this.mergedItemArray.length-this.nextOffset;for(let t=this.nextOffset;t<this.mergedItemArray.length;t++){const e=this.mergedItemArray[t];this._parent._isItemRemoved(e.metadata.key)&&--i}const r=this._params||{};if((r.size&&i<r.size||null==r.size&&0===i)&&!t.done)return this._fetchNext();const d=[],n=[];let o;for(o=this.nextOffset;o<this.mergedItemArray.length;o++){++this.nextOffset;const t=this.mergedItemArray[o];if(!this._parent._isItemRemoved(t.metadata.key)&&(d.push(t.data),n.push(t.metadata),r.size&&d.length===r.size))break}if(this._parent.itemsInWrongPosition.size>0){const t={remove:{data:[],keys:new Set,metadata:[]}};this._parent.itemsInWrongPosition.forEach(e=>{t.remove.data.push(e.data),t.remove.keys.add(e.metadata.key),t.remove.metadata.push(e.metadata)});const a=new e.DataProviderMutationEvent(t);this._parent.dispatchEvent(a)}return{done:t.done&&0===d.length,value:{fetchParameters:this._params,data:d,metadata:n,totalFilteredRowCount:"enabled"===(null===(a=this._params)||void 0===a?void 0:a.includeFilteredRowCount)?this._parent.totalFilteredRowCount:null}}})))})}next(){return this._fetchNext()}},this._addEventListeners(t),this.editBuffer=new d,this.lastSortCriteria=null,this.lastIterator=null,this.customKeyGenerator=null==a?void 0:a.keyGenerator,this.generatedKeyMap=new Map,this.lastSortIndex=new Map,this.itemsInWrongPosition=new Set,this.totalFilteredRowCount=0,this.dataBeforeUpdated=new Map}_fetchByKeysFromBuffer(t){const e=new s,a=new Set;return t.keys.forEach(t=>{const s=this.editBuffer.getItem(t);if(s)switch(s.operation){case"add":case"update":e.set(t,s.item)}else a.add(t)}),{results:e,unresolvedKeys:a}}_compareItem(t,e,a){for(const s of a){if(t[s.attribute]>e[s.attribute])return"ascending"===s.direction?1:-1;if(t[s.attribute]<e[s.attribute])return"ascending"===s.direction?-1:1}return 0}_insertAddEdits(t,e,a,s,i,r){t.forEach((t,a)=>n(this,void 0,void 0,function*(){if("add"===t.operation)e&&!e.filter(t.item.data)||this.totalFilteredRowCount++;else if("remove"===t.operation)e&&!e.filter(t.item.data)||this.totalFilteredRowCount--;else if("update"===t.operation&&e){let s=null;if(this.dataBeforeUpdated.has(a))s=this.dataBeforeUpdated.get(a);else{let t=new Set;t.add(a),s=(yield this.dataProvider.fetchByKeys({keys:t})).results.get(a).data,this.dataBeforeUpdated.set(a,s)}e.filter(s)&&!e.filter(t.item.data)?this.totalFilteredRowCount--:!e.filter(s)&&e.filter(t.item.data)&&this.totalFilteredRowCount++}if("add"!==t.operation||i.has(a)){if("update"===t.operation&&!i.has(a)&&this.editBuffer.isUpdateTransformed(a)){for(let t=0;t<s.length;t++)if(s[t].metadata.key===a){s.splice(t,1);break}s.push(t.item)}}else e&&!e.filter(t.item.data)||(s.push(t.item),i.add(a))})),a&&a.length&&(s.sort((t,e)=>this._compareItem(t.data,e.data,a)),s.forEach((e,a)=>{const s=e.metadata.key;t.has(s)&&(void 0===this.lastSortIndex.get(s)?this.lastSortIndex.set(s,a):this.lastSortIndex.get(s)!==a?(this.itemsInWrongPosition.add(e),this.lastSortIndex.set(s,a)):this.lastSortIndex.get(s)===a&&this.itemsInWrongPosition.delete(e))}))}_mergeAddEdits(t,e,a,s,i){this._insertAddEdits(this.editBuffer.getUnsubmittedItems(),t,e,a,s,i),this._insertAddEdits(this.editBuffer.getSubmittingItems(),t,e,a,s,i)}_mergeEdits(t,a,s,i,r,d,n){let o;s&&(o=s.filter?s:e.FilterFactory.getFilter({filterDef:s,filterOptions:this.options})),!r||i&&i.length||this._mergeAddEdits(o,i,a,d,n);for(const e of t){const t=this.editBuffer.getItem(e.metadata.key);t?"remove"===t.operation?a.push(e):"update"!==t.operation||this.editBuffer.isUpdateTransformed(t.item.metadata.key)||o&&!o.filter(t.item.data)||a.push(t.item):a.push(e)}i&&i.length&&this._mergeAddEdits(o,i,a,d,n)}_fetchFromOffset(t,e){const a=null==t?void 0:t.signal;if(a&&a.aborted){const t=a.reason;return Promise.reject(new DOMException(t,"AbortError"))}return new Promise((s,i)=>{if(a){const t=a.reason;a.addEventListener("abort",e=>i(new DOMException(t,"AbortError")))}s(this.dataProvider.fetchByOffset(t).then(a=>{if(!this.editBuffer.isEmpty()){const s=a.results;let i=null;i=a.fetchParameters&&a.fetchParameters.sortCriteria?a.fetchParameters.sortCriteria:t.sortCriteria,this._mergeEdits(s,e,t.filterCriterion,i,0===t.offset,new Set,a.done);let r=e.length;for(const t of e)this._isItemRemoved(t.metadata.key)&&--r;if((t.size&&r<t.size||null==t.size&&0===r)&&!a.done){const s={attributes:t.attributes,clientId:t.clientId,filterCriterion:t.filterCriterion,offset:t.offset+a.results.length,size:t.size,sortCriteria:t.sortCriteria};return this._fetchFromOffset(s,e)}for(let t=0;t<e.length;t++)this._isItemRemoved(e[t].metadata.key)&&(e.splice(t,1),--t);return t.size&&-1!=t.size&&e.length>t.size&&e.splice(t.size),{fetchParameters:t,results:e,done:a.done}}return a}))})}containsKeys(t){const e=this._fetchByKeysFromBuffer(t),a=e.unresolvedKeys,s=new Set;return e.results.forEach((t,e)=>{s.add(e)}),0===a.size?Promise.resolve({containsParameters:t,results:s}):this.dataProvider.containsKeys({attributes:t.attributes,keys:a,scope:t.scope}).then(e=>s.size>0?(e.results.forEach((t,e)=>{s.add(e)}),{containsParameters:t,results:s}):e)}fetchByKeys(t){const e=this._fetchByKeysFromBuffer(t),a=e.unresolvedKeys,s=e.results,i=null==t?void 0:t.signal;if(i&&i.aborted){const t=i.reason;return Promise.reject(new DOMException(t,"AbortError"))}return new Promise((e,r)=>{if(i){const t=i.reason;i.addEventListener("abort",e=>r(new DOMException(t,"AbortError")))}0===a.size&&e({fetchParameters:t,results:s}),e(this.dataProvider.fetchByKeys({attributes:t.attributes,keys:a,scope:t.scope,signal:i}).then(e=>s.size>0?(e.results.forEach((t,e)=>{s.set(e,t)}),{fetchParameters:t,results:s}):e))})}fetchByOffset(t){return this._fetchFromOffset(t,[])}fetchFirst(t){this.lastSortCriteria=t?t.sortCriteria:null;const e=this.dataProvider.fetchFirst(t)[Symbol.asyncIterator]();return this.lastIterator=new this.AsyncIterator(this,e,t),new this.AsyncIterable(this,this.lastIterator)}getCapability(t){return this.dataProvider.getCapability(t)}_calculateSizeChange(t){let e=0;return t.forEach((t,a)=>{this.editBuffer.getEditItemStatus(a)||("add"===t.operation?++e:"remove"===t.operation&&--e)}),e}getTotalSize(){return this.dataProvider.getTotalSize().then(t=>(t>-1&&(t+=this._calculateSizeChange(this.editBuffer.getSubmittingItems()),t+=this._calculateSizeChange(this.editBuffer.getUnsubmittedItems())),t))}isEmpty(){const t=this.editBuffer.getUnsubmittedItems(),e=this.editBuffer.getSubmittingItems();t.forEach((t,e)=>{if("add"===t.operation||"update"===t.operation)return"no"}),e.forEach((t,e)=>{if("add"===t.operation||"update"===t.operation)return"no"});const a=this.dataProvider.isEmpty();return"no"===a&&(t.size>0||e.size>0)?"unknown":a}_isItemRemoved(t){const e=this.editBuffer.getItem(t);return null!=e&&"remove"===e.operation}_addToMergedArrays(t,e,a=null){let s=null;return this.lastIterator&&(s=e?this._getNextKey(a):this.lastIterator.firstBaseKey),s}_getNextKey(t){let e=t;if(this.lastIterator){const a=this.lastIterator.mergedItemArray;let s=this._findKeyInItems(t,a);for(;e&&this._isItemRemoved(e);)e=-1===s||s+1===a.length?null:a[s+1].metadata.key,s++}return e}addItem(t){const a=Object.assign({},t);null===t.metadata.key&&(a.metadata=Object.assign({},t.metadata),a.metadata.key=this._generateKey(t.data)),this.editBuffer.addItem(a);const s=this._addToMergedArrays(a,!1);this.lastIterator&&(this.lastIterator.firstBaseKey=a.metadata.key);const i={add:{data:[a.data],keys:(new Set).add(a.metadata.key),metadata:[a.metadata],addBeforeKeys:[s]}},r=new e.DataProviderMutationEvent(i);this.dispatchEvent(r),this._dispatchSubmittableChangeEvent()}_removeFromMergedArrays(e,a){if(this.lastIterator){const s=this.lastIterator.mergedItemArray,i=this.lastIterator.mergedAddKeySet,r=this._findKeyInItems(e,s);if(-1!==r&&(a||i.has(e)||this.editBuffer.isUpdateTransformed(e)?(s.splice(r,1),i.delete(e),r<this.lastIterator.nextOffset&&--this.lastIterator.nextOffset):r===this.lastIterator.nextOffset-1&&--this.lastIterator.nextOffset,t.KeyUtils.equals(this.lastIterator.firstBaseKey,e)&&(this.lastIterator.firstBaseKey=null,s.length>r)))for(let t=r;t<s.length;t++){const e=s[t].metadata.key;if(!this._isItemRemoved(e)){this.lastIterator.firstBaseKey=e;break}}}}removeItem(t){this.editBuffer.removeItem(t),this._removeFromMergedArrays(t.metadata.key,!1);const a={remove:{data:t.data?[t.data]:null,keys:(new Set).add(t.metadata.key),metadata:[t.metadata]}},s=new e.DataProviderMutationEvent(a);this.dispatchEvent(s),this._dispatchSubmittableChangeEvent()}updateItem(t){this.editBuffer.updateItem(t);const a={update:{data:[t.data],keys:(new Set).add(t.metadata.key),metadata:[t.metadata]}},s=new e.DataProviderMutationEvent(a);this.dispatchEvent(s),this._dispatchSubmittableChangeEvent()}getSubmittableItems(){const t=this.editBuffer.getUnsubmittedItems(),e=this.editBuffer.getSubmittingItems(),a=[];return t.forEach((t,s)=>{e.has(s)||a.push(t)}),a}resetAllUnsubmittedItems(){this.editBuffer.resetAllUnsubmittedItems(),this._dispatchSubmittableChangeEvent(),this.dispatchEvent(new e.DataProviderRefreshEvent)}_addEventDetail(t,e,a,s){null==t[e]&&(t[e]="add"===e?{data:[],keys:new Set,metadata:[],addBeforeKeys:[]}:{data:[],keys:new Set,metadata:[]}),t[e].keys.add(a.metadata.key),t[e].data.push(a.data),t[e].metadata.push(a.metadata),"add"===e&&t[e].addBeforeKeys.push(s)}resetUnsubmittedItem(t){const a=this.editBuffer.getUnsubmittedItems(),i=new Set,r=new s,d=a.get(t);d&&(i.add(t),r.set(t,d),a.delete(t)),this._dispatchSubmittableChangeEvent(),this.dataProvider.fetchByKeys({keys:i}).then(t=>{const a={};let s;r.forEach((e,i)=>{if("add"===e.operation)this._removeFromMergedArrays(e.item.metadata.key,!1),this._addEventDetail(a,"remove",e.item);else if("remove"===e.operation){if(s=t.results.get(i),s){let t=null;if(this.lastIterator){const e=this.lastIterator.mergedItemArray,a=this._findKeyInItems(i,e);if(-1!==a)for(let s=a+1;s<e.length;s++)if(!this._isItemRemoved(e[s].metadata.key)){t=e[s].metadata.key;break}}this._addEventDetail(a,"add",s,t)}}else s=t.results.get(i),s?this._addEventDetail(a,"update",s):this._addEventDetail(a,"remove",e.item)}),this.dispatchEvent(new e.DataProviderMutationEvent(a))})}setItemStatus(t,e,a,s){t&&(s&&this.generatedKeyMap.set(s,t.item.metadata.key),this.editBuffer.setItemStatus(t,e,a),this._dispatchSubmittableChangeEvent())}_dispatchSubmittableChangeEvent(){const t=this.getSubmittableItems(),e=new i.BufferingDataProviderSubmittableChangeEvent(t);this.dispatchEvent(e)}_findKeyInMetadata(e,a){if(a)for(let s=0;s<a.length;s++)if(t.KeyUtils.equals(e,a[s].key))return s;return-1}_findKeyInItems(e,a){if(a)for(let s=0;s<a.length;s++)if(t.KeyUtils.equals(e,a[s].metadata.key))return s;return-1}_initDetailProp(t,e,a,s){t[a]&&(e[a]=s)}_initDetail(t,e,a,s=!1){a?(this._initDetailProp(t,e,"data",[]),this._initDetailProp(t,e,"metadata",[]),s&&this._initDetailProp(t,e,"addBeforeKeys",[]),this._initDetailProp(t,e,"indexes",[]),this._initDetailProp(t,e,"parentKeys",[])):(this._initDetailProp(t,e,"data",t.data),this._initDetailProp(t,e,"metadata",t.metadata),s&&this._initDetailProp(t,e,"addBeforeKeys",t.addBeforeKeys),this._initDetailProp(t,e,"indexes",t.indexes),this._initDetailProp(t,e,"parentKeys",t.parentKeys))}_initDetails(t,e,a){t.add&&(e.add={keys:new Set},this._initDetail(t.add,e.add,a,!0)),t.remove&&(e.remove={keys:new Set},this._initDetail(t.remove,e.remove,a)),t.update&&(e.update={keys:new Set},this._initDetail(t.update,e.update,a))}_pushDetailProp(t,e,a,s){t[a]&&e[a].push(t[a][s])}_pushDetail(t,e,a){if(a.keys.add(t),e.metadata){const s=this._findKeyInMetadata(t,e.metadata);s>-1&&(this._pushDetailProp(e,a,"data",s),this._pushDetailProp(e,a,"metadata",s),e.addBeforeKeys&&0!==e.addBeforeKeys.length&&this._pushDetailProp(e,a,"addBeforeKeys",s),e.indexes&&0!==e.indexes.length&&this._pushDetailProp(e,a,"indexes",s),this._pushDetailProp(e,a,"parentKeys",s))}}_isSkipItem(t,e,a){let s=null!=e.get(t);if(!s){const e=a.get(t);s=e&&"remove"===e.operation}return s}_isSortFieldUpdated(t,e){let a=!1;if(this.lastIterator&&this.lastSortCriteria&&this.lastSortCriteria.length){const s=this._findKeyInItems(t,this.lastIterator.mergedItemArray);if(s<0)return!1;const i=[];let r=0;if(this.lastIterator&&this.lastSortCriteria)for(const t of this.lastSortCriteria)i[r++]=t.attribute;for(const r of i){const i=this._findKeyInMetadata(t,e.metadata);this.lastIterator.mergedItemArray[s][r]!==e.data[i]&&(a=!0)}}return a}_getOperationDetails(t,e,a){if(t&&(t.add||t.remove||t.update)){let e={};const a=this.editBuffer.getSubmittingItems(),s=this.editBuffer.getUnsubmittedItems();if(0===a.size&&0===s.size)e=t;else{let i;this._initDetails(t,e,!0),this._processAdd(e,t,a,s),t.remove&&t.remove.keys.forEach(r=>{i=this._isSkipItem(r,a,s),i||this._pushDetail(r,t.remove,e.remove);const d=s.get(r);!d||"remove"!==d.operation&&"update"!==d.operation||s.delete(r)}),t.update&&t.update.keys.forEach(r=>{i=this._isSkipItem(r,a,s),i||this._pushDetail(r,t.update,e.update)})}return e}return t}_processAdd(t,e,a,s){e.add&&(t.add=e.add)}_handleRefreshEvent(t){this.dataBeforeUpdated=new Map;const e=this.editBuffer.getUnsubmittedItems(),a=new Set;e.forEach(t=>{"remove"!==t.operation&&"update"!==t.operation||a.add(t.item.metadata.key)}),a.size>0?this.dataProvider.fetchByKeys({keys:a}).then(s=>{s.results.forEach((t,e)=>{a.delete(e)}),a.forEach(t=>{e.delete(t)}),this.dispatchEvent(t)}):this.dispatchEvent(t)}_cleanUpSubmittedItem(t,e){const a=this.editBuffer.getSubmittingItems().get(e);a&&this.editBuffer.setItemMutated(a)}_handleMutateEvent(t){this.dataBeforeUpdated=new Map;const a=t.detail.add;a&&a.metadata&&a.data&&a.metadata.forEach((t,e)=>{let s;if(a.addBeforeKeys&&void 0!==a.addBeforeKeys[e])s=this._addToMergedArrays({metadata:a.metadata[e],data:a.data[e]},!0,a.addBeforeKeys[e]),a.addBeforeKeys[e]&&!s&&this.lastIterator&&this.lastIterator.mergedItemArray&&this.lastIterator.mergedItemArray.splice(this.lastIterator.mergedItemArray.length,0,{data:a.data[e],metadata:a.metadata[e]}),a.addBeforeKeys[e]=s;else if(a.indexes&&a.indexes[e]){let t=a.indexes[e];for(;this.lastIterator&&t<this.lastIterator.mergedItemArray.length&&this._isItemRemoved(this.lastIterator.mergedItemArray[t].metadata.key);)t++;this.lastIterator&&t>=this.lastIterator.mergedItemArray.length&&this.lastIterator.mergedItemArray.splice(this.lastIterator.mergedItemArray.length,0,{data:a.data[e],metadata:a.metadata[e]})}this._cleanUpSubmittedItem("add",t.key)});const s=t.detail.remove;s&&s.keys.forEach(t=>{this._removeFromMergedArrays(t,!0),this._cleanUpSubmittedItem("remove",t)});const i=[],r=[],d=t.detail.update;d&&d.data.forEach((t,e)=>{r[e]=this._isSortFieldUpdated(d.metadata[e].key,d),r[e]&&(this._removeFromMergedArrays(d.metadata[e].key,!0),i[e]=this._addToMergedArrays({data:t,metadata:d.metadata[e]},!0),i[e]||this.lastIterator&&this.lastIterator.mergedItemArray&&this.lastIterator.mergedItemArray.splice(this.lastIterator.mergedItemArray.length,0,{data:t,metadata:d.metadata[e]})),this._cleanUpSubmittedItem("remove",d.metadata[e].key)});const n=this._getOperationDetails(t.detail,i,r);this._checkGeneratedKeys(n),this.dispatchEvent(new e.DataProviderMutationEvent(n))}_checkGeneratedKeys(t){var e;const a=(e,a,s)=>{var i,r,d,n,o;if(this.generatedKeyMap.has(e)){const m=this.generatedKeyMap.get(e);if((!t.remove||!(null===(i=t.remove.keys)||void 0===i?void 0:i.has(e)))&&(t.remove||(t.remove={keys:new Set}),t.remove.keys.add(m),a)){const t=null===(o=null===(n=null===(d=null===(r=this.lastIterator)||void 0===r?void 0:r.mergedItemArray)||void 0===d?void 0:d[0])||void 0===n?void 0:n.metadata)||void 0===o?void 0:o.key;null!==t&&(a.addBeforeKeys||(a.addBeforeKeys=[]),a.addBeforeKeys[s]=t)}}};if(null===(e=t.add)||void 0===e?void 0:e.keys){let e=0;t.add.keys.forEach(s=>{a(s,t.add,e),e++})}}_addEventListeners(t){t[o._ADDEVENTLISTENER](o._REFRESH,this._handleRefreshEvent.bind(this)),t[o._ADDEVENTLISTENER](o._MUTATE,this._handleMutateEvent.bind(this))}}return o._REFRESH="refresh",o._MUTATE="mutate",o._ADDEVENTLISTENER="addEventListener",a.EventTargetMixin.applyMixin(o),t._registerLegacyNamespaceProp("BufferingDataProvider",o),o});
//# sourceMappingURL=ojbufferingdataprovider.js.map