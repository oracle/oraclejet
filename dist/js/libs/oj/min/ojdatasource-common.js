/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojcore"],function(e,a,t){"use strict";a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
/**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
const r=function(e){this.data=e,this.Init()};a._registerLegacyNamespaceProp("DataSource",r),a.Object.createSubclass(r,a.EventSource,"oj.DataSource"),r.prototype.Init=function(){r.superclass.Init.call(this)};const o=function(e){o.superclass.constructor.call(this,e)};t._registerLegacyNamespaceProp("DataGridDataSource",o),t.Object.createSubclass(o,t.DataSource,"oj.DataGridDataSource");const c=function(e){c.superclass.constructor.call(this,e)};a._registerLegacyNamespaceProp("DiagramDataSource",c),a.Object.createSubclass(c,a.DataSource,"oj.DiagramDataSource"),c.EventType={ADD:"add",REMOVE:"remove",CHANGE:"change"};
/**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */
const s=function(e,a){if(this.constructor===s){var t=s._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY,r=s._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL;throw new Error(t+"\n"+r)}this.data=e,this.options=a,this.isFetching=!1,this._startIndex=0,this.Init()};t._registerLegacyNamespaceProp("TableDataSource",s),t.Object.createSubclass(s,t.DataSource,"oj.TableDataSource"),s.prototype.Init=function(){s.superclass.Init.call(this)},s.prototype.sortCriteria=null,s.prototype.totalSizeConfidence=function(){return"actual"},s.EventType={ADD:"add",REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"},s._LOGGER_MSG={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};const u=function(e){u.superclass.constructor.call(this,e)};t._registerLegacyNamespaceProp("TreeDataSource",u),t.Object.createSubclass(u,t.DataSource,"oj.TreeDataSource");var n={};n.DataGridDataSource=oj.DataGridDataSource,e.DataGridDataSource=o,e.DataSource=r,e.DataSourceCommon=n,e.DiagramDataSource=c,e.TableDataSource=s,e.TreeDataSource=u,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdatasource-common.js.map