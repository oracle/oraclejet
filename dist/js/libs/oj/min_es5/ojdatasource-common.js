/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojcore-base","ojs/ojcore"],function(e,a,t){"use strict";a=a&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a,t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;
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
var r=function(e){this.data=e,this.Init()};a._registerLegacyNamespaceProp("DataSource",r),a.Object.createSubclass(r,a.EventSource,"oj.DataSource"),r.prototype.Init=function(){r.superclass.Init.call(this)};
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var o=function e(a){e.superclass.constructor.call(this,a)};t._registerLegacyNamespaceProp("DataGridDataSource",o),t.Object.createSubclass(o,t.DataSource,"oj.DataGridDataSource");
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var c=function e(a){e.superclass.constructor.call(this,a)};a._registerLegacyNamespaceProp("DiagramDataSource",c),a.Object.createSubclass(c,a.DataSource,"oj.DiagramDataSource"),c.EventType={ADD:"add",REMOVE:"remove",CHANGE:"change"};
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
var s=function e(a,t){if(this.constructor===e){var r=e._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY,o=e._LOGGER_MSG._ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL;throw new Error(r+"\n"+o)}this.data=a,this.options=t,this.isFetching=!1,this._startIndex=0,this.Init()};t._registerLegacyNamespaceProp("TableDataSource",s),t.Object.createSubclass(s,t.DataSource,"oj.TableDataSource"),s.prototype.Init=function(){s.superclass.Init.call(this)},s.prototype.sortCriteria=null,s.prototype.totalSizeConfidence=function(){return"actual"},s.EventType={ADD:"add",REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"},s._LOGGER_MSG={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var u=function e(a){e.superclass.constructor.call(this,a)};t._registerLegacyNamespaceProp("TreeDataSource",u),t.Object.createSubclass(u,t.DataSource,"oj.TreeDataSource");
/**
   * @license
   * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
   * The Universal Permissive License (UPL), Version 1.0
   * as shown at https://oss.oracle.com/licenses/upl/
   * @ignore
   */
var i={};i.DataGridDataSource=oj.DataGridDataSource,e.DataGridDataSource=o,e.DataSource=r,e.DataSourceCommon=i,e.DiagramDataSource=c,e.TableDataSource=s,e.TreeDataSource=u,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojdatasource-common.js.map