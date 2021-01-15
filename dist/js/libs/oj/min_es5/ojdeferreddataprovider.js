!function(){function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function n(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */define(["ojs/ojcore-base","ojs/ojcomponentcore"],function(e,r){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;
/**
   * @license
   * Copyright (c) 2017 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
/**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
var i=function(){function e(r,i){t(this,e),this._dataProvider=r,this._capabilityFunc=i,this._DATAPROVIDER="dataProvider",this.AsyncIterable=function(){return function e(n){t(this,e),this._asyncIterator=n,this[Symbol.asyncIterator]=function(){return this._asyncIterator}}}(),this.AsyncIterator=function(){function e(n){t(this,e),this._asyncIteratorPromise=n}return n(e,[{key:"next",value:function(){return this._asyncIteratorPromise.then(function(t){return t.next()})}}]),e}()}return n(e,[{key:"fetchFirst",value:function(t){var e=this._getDataProvider().then(function(e){return e.fetchFirst(t)[Symbol.asyncIterator]()});return new this.AsyncIterable(new this.AsyncIterator(e))}},{key:"fetchByKeys",value:function(t){return this._getDataProvider().then(function(e){return e.fetchByKeys(t)})}},{key:"containsKeys",value:function(t){return this._getDataProvider().then(function(e){return e.containsKeys(t)})}},{key:"fetchByOffset",value:function(t){return this._getDataProvider().then(function(e){return e.fetchByOffset(t)})}},{key:"getTotalSize",value:function(){return this._getDataProvider().then(function(t){return t.getTotalSize()})}},{key:"isEmpty",value:function(){return this[this._DATAPROVIDER]?this[this._DATAPROVIDER].isEmpty():"unknown"}},{key:"getCapability",value:function(t){return this._capabilityFunc?this._capabilityFunc(t):null}},{key:"addEventListener",value:function(t,e){this._getDataProvider().then(function(n){n.addEventListener(t,e)})}},{key:"removeEventListener",value:function(t,e){this._getDataProvider().then(function(n){n.removeEventListener(t,e)})}},{key:"dispatchEvent",value:function(t){return!!this[this._DATAPROVIDER]&&this[this._DATAPROVIDER].dispatchEvent(t)}},{key:"_getDataProvider",value:function(){var t=this;return this._dataProvider.then(function(e){if(r.DataProviderFeatureChecker.isDataProvider(e))return t[t._DATAPROVIDER]||(t[t._DATAPROVIDER]=e),e;throw new Error("Invalid data type. DeferredDataProvider takes a Promise<DataProvider>")})}}]),e}();return e._registerLegacyNamespaceProp("DeferredDataProvider",i),i})}();
//# sourceMappingURL=ojdeferreddataprovider.js.map