/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcomponentcore"],function(t,e){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class r{constructor(t,e){var r;this._dataProvider=t,this._capabilityFunc=e,this._DATAPROVIDER="dataProvider",this.AsyncIterable=(r=class{constructor(t){this._asyncIterator=t,this[Symbol.asyncIterator]=()=>this._asyncIterator}},Symbol.asyncIterator,r),this.AsyncIterator=class{constructor(t){this._asyncIteratorPromise=t}next(){return this._asyncIteratorPromise.then(t=>t.next())}}}fetchFirst(t){const e=this._getDataProvider().then(e=>e.fetchFirst(t)[Symbol.asyncIterator]());return new this.AsyncIterable(new this.AsyncIterator(e))}fetchByKeys(t){return this._getDataProvider().then(e=>e.fetchByKeys(t))}containsKeys(t){return this._getDataProvider().then(e=>e.containsKeys(t))}fetchByOffset(t){return this._getDataProvider().then(e=>e.fetchByOffset(t))}getTotalSize(){return this._getDataProvider().then(t=>t.getTotalSize())}isEmpty(){return this[this._DATAPROVIDER]?this[this._DATAPROVIDER].isEmpty():"unknown"}getCapability(t){return this._capabilityFunc?this._capabilityFunc(t):null}addEventListener(t,e){this._getDataProvider().then(r=>{r.addEventListener(t,e)})}removeEventListener(t,e){this._getDataProvider().then(r=>{r.removeEventListener(t,e)})}dispatchEvent(t){return!!this[this._DATAPROVIDER]&&this[this._DATAPROVIDER].dispatchEvent(t)}_getDataProvider(){return this._dataProvider.then(t=>{if(e.DataProviderFeatureChecker.isDataProvider(t))return this[this._DATAPROVIDER]||(this[this._DATAPROVIDER]=t),t;throw new Error("Invalid data type. DeferredDataProvider takes a Promise<DataProvider>")})}}return t._registerLegacyNamespaceProp("DeferredDataProvider",r),r});
//# sourceMappingURL=ojdeferreddataprovider.js.map