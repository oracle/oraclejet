/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojcore","jquery","ojs/ojlistdataproviderview","ojs/ojcomponentcore","ojs/ojeventtarget","ojs/ojdataprovider"],function(e,t,i){"use strict";function r(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var a=function(){function e(t,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.dataProvider=t,this.options=r,this._listDataProviderView=new i(t,r)}var t,a,n;return t=e,(a=[{key:"getChildDataProvider",value:function(t,i){var r=this.dataProvider.getChildDataProvider(t,i);return r?new e(r,this.options):null}},{key:"containsKeys",value:function(e){return this._listDataProviderView.containsKeys(e)}},{key:"fetchByKeys",value:function(e){return this._listDataProviderView.fetchByKeys(e)}},{key:"fetchByOffset",value:function(e){return this._listDataProviderView.fetchByOffset(e)}},{key:"fetchFirst",value:function(e){return this._listDataProviderView.fetchFirst(e)}},{key:"getCapability",value:function(e){return this._listDataProviderView.getCapability(e)}},{key:"getTotalSize",value:function(){return this._listDataProviderView.getTotalSize()}},{key:"isEmpty",value:function(){return this._listDataProviderView.isEmpty()}},{key:"addEventListener",value:function(e,t){this._listDataProviderView.addEventListener(e,t)}},{key:"removeEventListener",value:function(e,t){this._listDataProviderView.removeEventListener(e,t)}},{key:"dispatchEvent",value:function(e){return this._listDataProviderView.dispatchEvent(e)}}])&&r(t.prototype,a),n&&r(t,n),e}();
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
return e.TreeDataProviderView=a,e.TreeDataProviderView=a,a});