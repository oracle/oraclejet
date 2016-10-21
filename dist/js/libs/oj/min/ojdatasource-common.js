/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
define(["ojs/ojcore","jquery"],function(a){a.Gm=function(a){this.data=a;this.Init()};o_("DataSource",a.Gm,a);a.b.sa(a.Gm,a.Aj,"oj.DataSource");a.Gm.prototype.Init=function(){a.Gm.u.Init.call(this)};a.b.g("DataSource.prototype.Init",{Init:a.Gm.prototype.Init});a.Ju=function(g){a.Ju.u.constructor.call(this,g)};o_("TreeDataSource",a.Ju,a);a.b.sa(a.Ju,a.Gm,"oj.TreeDataSource");a.V=function(g,b){if(this.constructor==a.V)throw Error(a.V.od.MLa+"\n"+a.V.od.LLa);this.data=g;this.options=b;this.pa=0;this.Init()};
o_("TableDataSource",a.V,a);a.b.sa(a.V,a.Gm,"oj.TableDataSource");a.V.prototype.Init=function(){a.V.u.Init.call(this)};a.b.g("TableDataSource.prototype.Init",{Init:a.V.prototype.Init});a.V.prototype.sortCriteria=null;a.b.g("TableDataSource.prototype.sortCriteria",{sortCriteria:a.V.prototype.sortCriteria});a.V.prototype.totalSizeConfidence=function(){return"actual"};a.b.g("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.V.prototype.totalSizeConfidence});a.V.O={ADD:"add",REMOVE:"remove",
RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.V.O,a);a.V.od={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};
a.Pr=function(g){a.Pr.u.constructor.call(this,g)};o_("DataGridDataSource",a.Pr,a);a.b.sa(a.Pr,a.Gm,"oj.DataGridDataSource")});