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
define(["ojs/ojcore","jquery"],function(a){a.sn=function(a){this.data=a;this.Init()};o_("DataSource",a.sn,a);a.f.ya(a.sn,a.dl,"oj.DataSource");a.sn.prototype.Init=function(){a.sn.O.Init.call(this)};a.f.j("DataSource.prototype.Init",{Init:a.sn.prototype.Init});a.Vu=function(g){a.Vu.O.constructor.call(this,g)};o_("TreeDataSource",a.Vu,a);a.f.ya(a.Vu,a.sn,"oj.TreeDataSource");a.na=function(g,c){if(this.constructor==a.na)throw Error(a.na.we.Z1a+"\n"+a.na.we.Y1a);this.data=g;this.options=c;this.Ca=0;this.Init()};
o_("TableDataSource",a.na,a);a.f.ya(a.na,a.sn,"oj.TableDataSource");a.na.prototype.Init=function(){a.na.O.Init.call(this)};a.na.prototype.sortCriteria=null;a.f.j("TableDataSource.prototype.sortCriteria",{sortCriteria:a.na.prototype.sortCriteria});a.na.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.na.prototype.totalSizeConfidence});a.na.fa={ADD:"add",REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",
REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.na.fa,a);a.na.we={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};
a.Mx=function(g){a.Mx.O.constructor.call(this,g)};o_("DiagramDataSource",a.Mx,a);a.f.ya(a.Mx,a.sn,"oj.DiagramDataSource");a.Mx.fa={ADD:"add",REMOVE:"remove",CHANGE:"change"};o_("DiagramDataSource.EventType",a.Mx.fa,a);a.Lu=function(g){a.Lu.O.constructor.call(this,g)};o_("DataGridDataSource",a.Lu,a);a.f.ya(a.Lu,a.sn,"oj.DataGridDataSource")});