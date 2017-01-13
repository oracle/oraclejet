/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
/*
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
 Copyright 2013 jQuery Foundation and other contributors
 Released under the MIT license.
 http://jquery.org/license
*/
define(["ojs/ojcore","jquery"],function(a){a.Fm=function(a){this.data=a;this.Init()};o_("DataSource",a.Fm,a);a.b.sa(a.Fm,a.yj,"oj.DataSource");a.Fm.prototype.Init=function(){a.Fm.u.Init.call(this)};a.b.g("DataSource.prototype.Init",{Init:a.Fm.prototype.Init});a.Iu=function(g){a.Iu.u.constructor.call(this,g)};o_("TreeDataSource",a.Iu,a);a.b.sa(a.Iu,a.Fm,"oj.TreeDataSource");a.W=function(g,b){if(this.constructor==a.W)throw Error(a.W.od.yMa+"\n"+a.W.od.xMa);this.data=g;this.options=b;this.oa=0;this.Init()};
o_("TableDataSource",a.W,a);a.b.sa(a.W,a.Fm,"oj.TableDataSource");a.W.prototype.Init=function(){a.W.u.Init.call(this)};a.b.g("TableDataSource.prototype.Init",{Init:a.W.prototype.Init});a.W.prototype.sortCriteria=null;a.b.g("TableDataSource.prototype.sortCriteria",{sortCriteria:a.W.prototype.sortCriteria});a.W.prototype.totalSizeConfidence=function(){return"actual"};a.b.g("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.W.prototype.totalSizeConfidence});a.W.O={ADD:"add",REMOVE:"remove",
RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.W.O,a);a.W.od={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};
a.Rr=function(g){a.Rr.u.constructor.call(this,g)};o_("DataGridDataSource",a.Rr,a);a.b.sa(a.Rr,a.Fm,"oj.DataGridDataSource")});