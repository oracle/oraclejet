!function(){function e(e,t){for(var r=0;r<t.length;r++){var a=t[r];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojcollectiontabledatasource","ojs/ojdataprovideradapter"],function(t,r,a){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @license
   * Copyright (c) 2018 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
var i=function(){function a(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,a),this.collection=e,this._dataProviderAdapter=new t.TableDataSourceAdapter(new r.CollectionTableDataSource(e)),this.addEventListener=this._dataProviderAdapter.addEventListener.bind(this._dataProviderAdapter),this.removeEventListener=this._dataProviderAdapter.removeEventListener.bind(this._dataProviderAdapter),this.dispatchEvent=this._dataProviderAdapter.dispatchEvent.bind(this._dataProviderAdapter)}var i,n,o;return i=a,(n=[{key:"destroy",value:function(){this._dataProviderAdapter.destroy()}},{key:"fetchFirst",value:function(e){return this._dataProviderAdapter.fetchFirst(e)}},{key:"fetchByKeys",value:function(e){return this._dataProviderAdapter.fetchByKeys(e)}},{key:"containsKeys",value:function(e){return this._dataProviderAdapter.containsKeys(e)}},{key:"fetchByOffset",value:function(e){return this._dataProviderAdapter.fetchByOffset(e)}},{key:"getCapability",value:function(e){return this._dataProviderAdapter.getCapability(e)}},{key:"getTotalSize",value:function(){return this._dataProviderAdapter.getTotalSize()}},{key:"isEmpty",value:function(){return this._dataProviderAdapter.isEmpty()}}])&&e(i.prototype,n),o&&e(i,o),a}();return t._registerLegacyNamespaceProp("CollectionDataProvider",i),i})}();
//# sourceMappingURL=ojcollectiondataprovider.js.map