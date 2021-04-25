/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojeventtarget"],function(t,e){"use strict";
/**
     * @license
     * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */class s{constructor(t,e){this.treeDataProvider=t,this.options=e,this.SuppressNodeTreeAsyncIterable=class{constructor(t,e){this._parent=t,this._asyncIterator=e,this[Symbol.asyncIterator]=()=>new this._parent.SuppressNodeTreeAsyncIterator(this._parent,this._asyncIterator)}},this.SuppressNodeTreeAsyncIterator=class{constructor(t,e){this._parent=t,this._baseIterator=e}_fetchNext(){return this._baseIterator.next()}next(){const t=this._fetchNext();let e=this;return t.then(t=>e._parent._suppressNodeIfEmptyChildrenFirst(t))}},this.AsyncIteratorYieldResult=class{constructor(t,e){this._parent=t,this.value=e,this.value=e,this.done=!1}},this.AsyncIteratorReturnResult=class{constructor(t,e){this._parent=t,this.value=e,this.value=e,this.done=!0}},this.FetchListResult=class{constructor(t,e,r){this.fetchParameters=t,this.data=e,this.metadata=r,this[s._FETCHPARAMETERS]=t,this[s._DATA]=e,this[s._METADATA]=r}},this.FetchByOffsetResults=class{constructor(t,e,r,i){this._parent=t,this.fetchParameters=e,this.results=r,this.done=i,this[s._FETCHPARAMETERS]=e,this[s._RESULTS]=r,this[s._DONE]=i}},this.Item=class{constructor(t,e,r){this._parent=t,this.metadata=e,this.data=r,this[s._METADATA]=e,this[s._DATA]=r}}}containsKeys(t){return this.treeDataProvider.containsKeys(t)}getCapability(t){return this.treeDataProvider.getCapability(t)}getTotalSize(){return this.treeDataProvider.getTotalSize()}isEmpty(){return this.treeDataProvider.isEmpty()}createOptimizedKeySet(t){return this.treeDataProvider.createOptimizedKeySet(t)}createOptimizedKeyMap(t){return this.treeDataProvider.createOptimizedKeyMap(t)}getChildDataProvider(t){let e=this.treeDataProvider.getChildDataProvider(t);return null==e?null:new s(e,this.options)}fetchByOffset(t){return this.treeDataProvider.fetchByOffset(t).then(t=>this._suppressNodeIfEmptyChildrenByOffset(t))}fetchByKeys(t){return this.treeDataProvider.fetchByKeys(t)}fetchFirst(t){let e=this.treeDataProvider.fetchFirst(t);return new this.SuppressNodeTreeAsyncIterable(this,e[Symbol.asyncIterator]())}_suppressNodeIfEmptyChildrenByOffset(t){let e=null;if(t.results&&this.options&&"ifEmptyChildren"==this.options.suppressNode){let s,r,i=[];for(let e of t.results){s=e.metadata,r=e.data;let t=this.treeDataProvider.getChildDataProvider(s.key,this.options);t&&"no"==t.isEmpty()&&i.push(new this.Item(this,s,r))}i.length>0&&(e=new this.FetchByOffsetResults(this,t.fetchParameters,i,t.done))}return null==e?t:e}_suppressNodeIfEmptyChildrenFirst(t){let e=null;if(!t.done&&this.options&&"ifEmptyChildren"==this.options.suppressNode&&t&&t.value&&t.value.data){let s=t.value.metadata,r=t.value.data,i=Array(),a=Array();for(let t=0;s&&t<s.length;t++){let e=this.treeDataProvider.getChildDataProvider(s[t].key,this.options);e&&"no"==e.isEmpty()&&(i.push(r[t]),a.push(s[t]))}i.length>0&&(e=t.done?new this.AsyncIteratorReturnResult(this,new this.FetchListResult(null,i,a)):new this.AsyncIteratorYieldResult(this,new this.FetchListResult(null,i,a)))}return Promise.resolve(null==e?t:e)}}s._DATA="data",s._METADATA="metadata",s._FETCHPARAMETERS="fetchParameters",s._RESULTS="results",s._DONE="done",s._KEY="key",e.EventTargetMixin.applyMixin(s),t.SuppressNodeTreeDataProvider=s,Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=ojsuppressnodetreedataprovider.js.map