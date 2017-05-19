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
define(["ojs/ojcore","jquery"],function(a){a.Em=function(a){this.data=a;this.Init()};o_("DataSource",a.Em,a);a.f.xa(a.Em,a.jk,"oj.DataSource");a.Em.prototype.Init=function(){a.Em.O.Init.call(this)};a.f.j("DataSource.prototype.Init",{Init:a.Em.prototype.Init});a.Tt=function(g){a.Tt.O.constructor.call(this,g)};o_("TreeDataSource",a.Tt,a);a.f.xa(a.Tt,a.Em,"oj.TreeDataSource");a.ha=function(g,c){if(this.constructor==a.ha)throw Error(a.ha.Pd.tVa+"\n"+a.ha.Pd.sVa);this.data=g;this.options=c;this.Aa=0;this.Init()};
o_("TableDataSource",a.ha,a);a.f.xa(a.ha,a.Em,"oj.TableDataSource");a.ha.prototype.Init=function(){a.ha.O.Init.call(this)};a.f.j("TableDataSource.prototype.Init",{Init:a.ha.prototype.Init});a.ha.prototype.sortCriteria=null;a.f.j("TableDataSource.prototype.sortCriteria",{sortCriteria:a.ha.prototype.sortCriteria});a.ha.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.ha.prototype.totalSizeConfidence});a.ha.aa={ADD:"add",
REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.ha.aa,a);a.ha.Pd={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",
_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};a.xw=function(g){a.xw.O.constructor.call(this,g)};o_("DiagramDataSource",a.xw,a);a.f.xa(a.xw,a.Em,"oj.DiagramDataSource");a.xw.aa={ADD:"add",REMOVE:"remove",CHANGE:"change"};o_("DiagramDataSource.EventType",a.xw.aa,a);a.Mt=function(g){a.Mt.O.constructor.call(this,g)};o_("DataGridDataSource",a.Mt,a);a.f.xa(a.Mt,a.Em,"oj.DataGridDataSource")});