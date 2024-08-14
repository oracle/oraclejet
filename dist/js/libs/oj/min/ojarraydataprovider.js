/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojdataprovider","ojs/ojeventtarget","ojs/ojarraydataproviderimpl"],function(e,t,r,i){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class s{constructor(e,t){this.data=e,this.options=t,this._subscribeObservableArray(e);let r=!1;null!=t&&null!=t.keys&&(r=!0,this._keys=t.keys),this._impl=new i.ArrayDataProviderImpl({...t,get keyAttributes(){return t?.keyAttributes??t?.idAttribute}},{getData:()=>this._getRowData(),getKeys:()=>this._getKeys(),generateKeysIfNeeded:e=>this._generateKeysIfNeeded(e),mergeSortCriteria:e=>this._mergeSortCriteria(e),getSortComparator:e=>this._getSortComparator(e),dispatchEvent:e=>this.dispatchEvent(e),supportAbortController:!0,getKeyForDelete:(e,t)=>this._getKeyForDelete(e,t),spliceKeys:(...e)=>this._keys.splice(...e),keysSpecified:r})}containsKeys(e){return this._impl.containsKeys(e)}fetchByKeys(e){return this._impl.fetchByKeys(e)}fetchByOffset(e){return this._impl.fetchByOffset(e)}fetchFirst(e){return this._impl.fetchFirst(e)}getCapability(e){return i.getCapability(e)}static getCapability(e){return i.getCapability(e)}getTotalSize(){return this._impl.getTotalSize()}isEmpty(){return this._impl.isEmpty()}createOptimizedKeySet(e){return i.createOptimizedKeySet(e)}createOptimizedKeyMap(e){return i.createOptimizedKeyMap(e)}_getRowData(){return a(this.data)}_getKeys(){return a(this._keys)}_subscribeObservableArray(e){if(!(e instanceof Array)){if(!this._isObservableArray(e))throw new Error("Invalid data type. ArrayDataProvider only supports Array or observableArray.");e.subscribe(e=>this._impl.queueMutationEvent(e),null,"arrayChange"),e.subscribe(e=>this._impl.flushQueue(),null,"change")}}_getKeyForDelete(e,t){let r=this._impl.getId(e.value);return null==r&&(r=t?e.index:this._getKeys()[e.index]),r}_isObservableArray(e){return"function"==typeof e&&e.subscribe&&!(void 0===e.destroyAll)}_generateKeysIfNeeded(e){return null==this._keys&&(this._keys=e(),!0)}_getSortComparator(e){return(r,s)=>{const a=null!=this.options?this.options.sortComparators:null;let o,n,l,u,y,p;for(o=0;o<e.length;o++){n=e[o].direction,l=e[o].attribute,u=null,null!=a&&(u=a.comparators.get(l)),y=i.getVal(r.value,l),p=i.getVal(s.value,l),u||(u=t.SortUtils.getNaturalSortComparator());const h="descending"===n?-1:1,c=u(y,p)*h;if(0!==c)return c}return 0}}_mergeSortCriteria(e){const t=null!=this.options?this.options.implicitSort:null;return null==t?e:null==e?t:void 0}}const a=e=>!e||e instanceof Array?e:e();return r.EventTargetMixin.applyMixin(s),e._registerLegacyNamespaceProp("ArrayDataProvider",s),s});
//# sourceMappingURL=ojarraydataprovider.js.map