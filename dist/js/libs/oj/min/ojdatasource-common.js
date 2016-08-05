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
define(["ojs/ojcore","jquery"],function(a){a.wm=function(a){this.data=a;this.Init()};o_("DataSource",a.wm,a);a.b.ta(a.wm,a.pj,"oj.DataSource");a.wm.prototype.Init=function(){a.wm.u.Init.call(this)};a.b.g("DataSource.prototype.Init",{Init:a.wm.prototype.Init});a.uu=function(g){a.uu.u.constructor.call(this,g)};o_("TreeDataSource",a.uu,a);a.b.ta(a.uu,a.wm,"oj.TreeDataSource");a.aa=function(g,c){if(this.constructor==a.aa)throw Error(a.aa.nd.rKa+"\n"+a.aa.nd.qKa);this.data=g;this.options=c;this.pa=0;this.Init()};
o_("TableDataSource",a.aa,a);a.b.ta(a.aa,a.wm,"oj.TableDataSource");a.aa.prototype.Init=function(){a.aa.u.Init.call(this)};a.b.g("TableDataSource.prototype.Init",{Init:a.aa.prototype.Init});a.aa.prototype.sortCriteria=null;a.b.g("TableDataSource.prototype.sortCriteria",{sortCriteria:a.aa.prototype.sortCriteria});a.aa.prototype.totalSizeConfidence=function(){return"actual"};a.b.g("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.aa.prototype.totalSizeConfidence});a.aa.Q={ADD:"add",
REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.aa.Q,a);a.aa.nd={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",
_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};a.Br=function(g){a.Br.u.constructor.call(this,g)};o_("DataGridDataSource",a.Br,a);a.b.ta(a.Br,a.wm,"oj.DataGridDataSource")});