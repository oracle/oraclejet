/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojlistdataproviderview"],function(t,e){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;
/**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */
class i{constructor(t,i){this.dataProvider=t,this.options=i,this._listDataProviderView=new e(t,i)}getChildDataProvider(t,e){let r=this.dataProvider.getChildDataProvider(t);return r?new i(r,this.options):null}containsKeys(t){return this._listDataProviderView.containsKeys(t)}fetchByKeys(t){return this._listDataProviderView.fetchByKeys(t)}fetchByOffset(t){return this._listDataProviderView.fetchByOffset(t)}fetchFirst(t){return this._listDataProviderView.fetchFirst(t)}getCapability(t){return this._listDataProviderView.getCapability(t)}getTotalSize(){return this._listDataProviderView.getTotalSize()}isEmpty(){return this._listDataProviderView.isEmpty()}addEventListener(t,e){this._listDataProviderView.addEventListener(t,e)}removeEventListener(t,e){this._listDataProviderView.removeEventListener(t,e)}dispatchEvent(t){return this._listDataProviderView.dispatchEvent(t)}}return t._registerLegacyNamespaceProp("TreeDataProviderView",i),i});
//# sourceMappingURL=ojtreedataproviderview.js.map