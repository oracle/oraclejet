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
define(["ojs/ojcore","jquery"],function(a){a.sm=function(a){this.data=a;this.Init()};o_("DataSource",a.sm,a);a.f.xa(a.sm,a.hk,"oj.DataSource");a.sm.prototype.Init=function(){a.sm.O.Init.call(this)};a.f.j("DataSource.prototype.Init",{Init:a.sm.prototype.Init});a.Kt=function(g){a.Kt.O.constructor.call(this,g)};o_("TreeDataSource",a.Kt,a);a.f.xa(a.Kt,a.sm,"oj.TreeDataSource");a.ha=function(g,c){if(this.constructor==a.ha)throw Error(a.ha.Md.FUa+"\n"+a.ha.Md.EUa);this.data=g;this.options=c;this.Aa=0;this.Init()};
o_("TableDataSource",a.ha,a);a.f.xa(a.ha,a.sm,"oj.TableDataSource");a.ha.prototype.Init=function(){a.ha.O.Init.call(this)};a.f.j("TableDataSource.prototype.Init",{Init:a.ha.prototype.Init});a.ha.prototype.sortCriteria=null;a.f.j("TableDataSource.prototype.sortCriteria",{sortCriteria:a.ha.prototype.sortCriteria});a.ha.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.ha.prototype.totalSizeConfidence});a.ha.aa={ADD:"add",
REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.ha.aa,a);a.ha.Md={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",
_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};a.pw=function(g){a.pw.O.constructor.call(this,g)};o_("DiagramDataSource",a.pw,a);a.f.xa(a.pw,a.sm,"oj.DiagramDataSource");a.pw.aa={ADD:"add",REMOVE:"remove",CHANGE:"change"};o_("DiagramDataSource.EventType",a.pw.aa,a);a.Dt=function(g){a.Dt.O.constructor.call(this,g)};o_("DataGridDataSource",a.Dt,a);a.f.xa(a.Dt,a.sm,"oj.DataGridDataSource")});