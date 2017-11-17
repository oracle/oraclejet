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
define(["ojs/ojcore","jquery"],function(a){a.Pn=function(a){this.data=a;this.Init()};o_("DataSource",a.Pn,a);a.f.va(a.Pn,a.xl,"oj.DataSource");a.Pn.prototype.Init=function(){a.Pn.N.Init.call(this)};a.f.j("DataSource.prototype.Init",{Init:a.Pn.prototype.Init});a.Mv=function(g){a.Mv.N.constructor.call(this,g)};o_("TreeDataSource",a.Mv,a);a.f.va(a.Mv,a.Pn,"oj.TreeDataSource");a.ta=function(g,c){if(this.constructor==a.ta)throw Error(a.ta.Ae.Y6a+"\n"+a.ta.Ae.X6a);this.data=g;this.options=c;this.oa=0;this.Init()};
o_("TableDataSource",a.ta,a);a.f.va(a.ta,a.Pn,"oj.TableDataSource");a.ta.prototype.Init=function(){a.ta.N.Init.call(this)};a.ta.prototype.sortCriteria=null;a.f.j("TableDataSource.prototype.sortCriteria",{sortCriteria:a.ta.prototype.sortCriteria});a.ta.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.ta.prototype.totalSizeConfidence});a.ta.ga={ADD:"add",REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",
REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.ta.ga,a);a.ta.Ae={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};
a.Jy=function(g){a.Jy.N.constructor.call(this,g)};o_("DiagramDataSource",a.Jy,a);a.f.va(a.Jy,a.Pn,"oj.DiagramDataSource");a.Jy.ga={ADD:"add",REMOVE:"remove",CHANGE:"change"};o_("DiagramDataSource.EventType",a.Jy.ga,a);a.Av=function(g){a.Av.N.constructor.call(this,g)};o_("DataGridDataSource",a.Av,a);a.f.va(a.Av,a.Pn,"oj.DataGridDataSource")});