/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","ojs/ojcollectiontabledatasource","ojs/ojdataprovideradapter"],function(e){"use strict";function t(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}var r=function(){function r(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,r),this.collection=t,this._dataProviderAdapter=new e.TableDataSourceAdapter(new e.CollectionTableDataSource(t)),this.addEventListener=this._dataProviderAdapter.addEventListener.bind(this._dataProviderAdapter),this.removeEventListener=this._dataProviderAdapter.removeEventListener.bind(this._dataProviderAdapter),this.dispatchEvent=this._dataProviderAdapter.dispatchEvent.bind(this._dataProviderAdapter)}var a,i,n;return a=r,(i=[{key:"destroy",value:function(){this._dataProviderAdapter.destroy()}},{key:"fetchFirst",value:function(e){return this._dataProviderAdapter.fetchFirst(e)}},{key:"fetchByKeys",value:function(e){return this._dataProviderAdapter.fetchByKeys(e)}},{key:"containsKeys",value:function(e){return this._dataProviderAdapter.containsKeys(e)}},{key:"fetchByOffset",value:function(e){return this._dataProviderAdapter.fetchByOffset(e)}},{key:"getCapability",value:function(e){return this._dataProviderAdapter.getCapability(e)}},{key:"getTotalSize",value:function(){return this._dataProviderAdapter.getTotalSize()}},{key:"isEmpty",value:function(){return this._dataProviderAdapter.isEmpty()}}])&&t(a.prototype,i),n&&t(a,n),r}();
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
return e.CollectionDataProvider=r,e.CollectionDataProvider=r,r});