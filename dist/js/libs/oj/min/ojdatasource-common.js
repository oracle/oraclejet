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
define(["ojs/ojcore","jquery"],function(a){a.Xi=function(a){this.data=a;this.Init()};o_("DataSource",a.Xi,a);a.b.ga(a.Xi,a.Pg,"oj.DataSource");a.Xi.prototype.Init=function(){a.Xi.r.Init.call(this)};a.b.g("DataSource.prototype.Init",{Init:a.Xi.prototype.Init});a.Ap=function(f){a.Ap.r.constructor.call(this,f)};o_("TreeDataSource",a.Ap,a);a.b.ga(a.Ap,a.Xi,"oj.TreeDataSource");a.T=function(f,b){if(this.constructor==a.T)throw Error(a.T.fc.Cra+"\n"+a.T.fc.Bra);this.data=f;this.options=b;this.$=0;this.Init()};
o_("TableDataSource",a.T,a);a.b.ga(a.T,a.Xi,"oj.TableDataSource");a.T.prototype.Init=function(){a.T.r.Init.call(this)};a.b.g("TableDataSource.prototype.Init",{Init:a.T.prototype.Init});a.T.prototype.totalSizeConfidence=function(){return"actual"};a.b.g("TableDataSource.prototype.totalSizeConfidence",{totalSizeConfidence:a.T.prototype.totalSizeConfidence});a.T.D={ADD:"add",REMOVE:"remove",RESET:"reset",REFRESH:"refresh",SORT:"sort",CHANGE:"change",REQUEST:"request",SYNC:"sync",ERROR:"error"};o_("TableDataSource.EventType",
a.T.D,a);a.T.fc={_ERR_TABLE_DATASOURCE_INSTANTIATED_SUMMARY:"oj.TableDataSource constructor called.",_ERR_TABLE_DATASOURCE_INSTANTIATED_DETAIL:"Please do not instantiate oj.TableDataSource. Please use one of the subclasses instead such as oj.ArrayTableDataSource or oj.CollectionTableDataSource.",_ERR_DATA_INVALID_TYPE_SUMMARY:"Invalid data type.",_ERR_DATA_INVALID_TYPE_DETAIL:"Please specify the appropriate data type."};a.bn=function(f){a.bn.r.constructor.call(this,f)};o_("DataGridDataSource",a.bn,
a);a.b.ga(a.bn,a.Xi,"oj.DataGridDataSource")});