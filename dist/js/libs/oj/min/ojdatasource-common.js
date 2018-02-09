/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
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
define(["ojs/ojcore","jquery"],function(a){a.Wn=function(a){this.data=a;this.Init()};o_("DataSource",a.Wn,a);a.f.ua(a.Wn,a.Gl,"oj.DataSource");a.Wn.prototype.Init=function(){a.Wn.N.Init.call(this)};a.f.j("DataSource.prototype.Init",{Init:a.Wn.prototype.Init});a.bw=function(g){a.bw.N.constructor.call(this,g)};o_("TreeDataSource",a.bw,a);a.f.ua(a.bw,a.Wn,"oj.TreeDataSource");a.ta=function(g,c){if(this.constructor==a.ta)throw Error(a.ta.De.e8a+"\n"+a.ta.De.d8a);this.data=g;this.options=c;this.oa=0;this.Init()};
o_("TableDataSource",a.ta,a);a.f.ua(a.ta,a.Wn,"oj.TableDataSource");a.ta.prototype.Init=function(){a.ta.N.Init.call(this)};a.ta.prototype.sortCriteria=null;a.f.j("TableDataSource.prototype.sortCriteria",{sortCriteria:a.ta.prototype.sortCriteria});a.ta.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.ta.prototype.totalSizeConfidence});a.ta.ga={ADD:"add",REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",
REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.ta.ga,a);a.ta.De={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};
a.Xy=function(g){a.Xy.N.constructor.call(this,g)};o_("DiagramDataSource",a.Xy,a);a.f.ua(a.Xy,a.Wn,"oj.DiagramDataSource");a.Xy.ga={ADD:"add",REMOVE:"remove",CHANGE:"change"};o_("DiagramDataSource.EventType",a.Xy.ga,a);a.Rv=function(g){a.Rv.N.constructor.call(this,g)};o_("DataGridDataSource",a.Rv,a);a.f.ua(a.Rv,a.Wn,"oj.DataGridDataSource")});