!function(){function e(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojlistdataproviderview"],function(t,i){"use strict";t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t,i=i&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i;
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
   */
var r=function(){function t(e,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),this.dataProvider=e,this.options=r,this._listDataProviderView=new i(e,r)}var r,a,n;return r=t,(a=[{key:"getChildDataProvider",value:function(e,i){var r=this.dataProvider.getChildDataProvider(e);return r?new t(r,this.options):null}},{key:"containsKeys",value:function(e){return this._listDataProviderView.containsKeys(e)}},{key:"fetchByKeys",value:function(e){return this._listDataProviderView.fetchByKeys(e)}},{key:"fetchByOffset",value:function(e){return this._listDataProviderView.fetchByOffset(e)}},{key:"fetchFirst",value:function(e){return this._listDataProviderView.fetchFirst(e)}},{key:"getCapability",value:function(e){return this._listDataProviderView.getCapability(e)}},{key:"getTotalSize",value:function(){return this._listDataProviderView.getTotalSize()}},{key:"isEmpty",value:function(){return this._listDataProviderView.isEmpty()}},{key:"addEventListener",value:function(e,t){this._listDataProviderView.addEventListener(e,t)}},{key:"removeEventListener",value:function(e,t){this._listDataProviderView.removeEventListener(e,t)}},{key:"dispatchEvent",value:function(e){return this._listDataProviderView.dispatchEvent(e)}}])&&e(r.prototype,a),n&&e(r,n),t}();return t._registerLegacyNamespaceProp("TreeDataProviderView",r),r})}();
//# sourceMappingURL=ojtreedataproviderview.js.map