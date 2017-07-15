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
define(["ojs/ojcore","jquery"],function(a){a.Im=function(a){this.data=a;this.Init()};o_("DataSource",a.Im,a);a.f.xa(a.Im,a.pk,"oj.DataSource");a.Im.prototype.Init=function(){a.Im.N.Init.call(this)};a.f.j("DataSource.prototype.Init",{Init:a.Im.prototype.Init});a.au=function(g){a.au.N.constructor.call(this,g)};o_("TreeDataSource",a.au,a);a.f.xa(a.au,a.Im,"oj.TreeDataSource");a.ga=function(g,c){if(this.constructor==a.ga)throw Error(a.ga.Qd.$Va+"\n"+a.ga.Qd.ZVa);this.data=g;this.options=c;this.Aa=0;this.Init()};
o_("TableDataSource",a.ga,a);a.f.xa(a.ga,a.Im,"oj.TableDataSource");a.ga.prototype.Init=function(){a.ga.N.Init.call(this)};a.f.j("TableDataSource.prototype.Init",{Init:a.ga.prototype.Init});a.ga.prototype.sortCriteria=null;a.f.j("TableDataSource.prototype.sortCriteria",{sortCriteria:a.ga.prototype.sortCriteria});a.ga.prototype.totalSizeConfidence=function(){return"actual"};a.f.j("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.ga.prototype.totalSizeConfidence});a.ga.Y={ADD:"add",
REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",a.ga.Y,a);a.ga.Qd={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",
_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};a.Dw=function(g){a.Dw.N.constructor.call(this,g)};o_("DiagramDataSource",a.Dw,a);a.f.xa(a.Dw,a.Im,"oj.DiagramDataSource");a.Dw.Y={ADD:"add",REMOVE:"remove",CHANGE:"change"};o_("DiagramDataSource.EventType",a.Dw.Y,a);a.Ut=function(g){a.Ut.N.constructor.call(this,g)};o_("DataGridDataSource",a.Ut,a);a.f.xa(a.Ut,a.Im,"oj.DataGridDataSource")});