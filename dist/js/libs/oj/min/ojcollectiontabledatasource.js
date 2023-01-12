/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["exports","ojs/ojmodel","ojs/ojdatasource-common","jquery"],function(e,t,a,n){"use strict";n=n&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n;const o=function(e,a){if(this.data={},!(e instanceof t.Collection)){var n=oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_SUMMARY,l=oj.TableDataSource._LOGGER_MSG._ERR_DATA_INVALID_TYPE_DETAIL;throw new Error(n+"\n"+l)}o.superclass.constructor.call(this,e,a),this._collection=e,this._addCollectionEventListeners(),this.Init(),(null==a||"enabled"!==a.startFetch&&null!=a.startFetch)&&null!=a||(this._startFetchEnabled=!0)};oj._registerLegacyNamespaceProp("CollectionTableDataSource",o),oj.Object.createSubclass(o,oj.TableDataSource,"oj.CollectionTableDataSource"),o.prototype.comparator=null,o.prototype.Init=function(){o.superclass.Init.call(this)},o.prototype.at=function(e,t){var a=t||{};a.deferred=!0;var n,o=this._collection.at(e,a),l=this;return l._isFetchingForAt=!0,new Promise(function(t,a){null!=o?o.then(function(a){l._isFetchingForAt=!1,n={data:a.attributes,index:e,key:a.id},t(n)},function(e){l._isFetchingForAt=!1,oj.TableDataSource.superclass.handleEvent.call(l,oj.TableDataSource.EventType.ERROR,e),a(e)}):t(null)})},o.prototype.fetch=function(e){var t=e||{};return"init"!==t.fetchType||this._startFetchEnabled?this._fetchInternal(t):Promise.resolve()},o.prototype.get=function(e,t){var a=t||{};a.deferred=!0;var n=this._collection.get(e,a),o=this;return new Promise(function(e,t){null!=n?n.then(function(t){if(t){var a={data:o._wrapWritableValue(t,t.attributes),index:t.index,key:t.id};e(a)}else e(null)},function(e){oj.TableDataSource.superclass.handleEvent.call(o,oj.TableDataSource.EventType.ERROR,e),t(e)}):e(null)})},o.prototype.sort=function(e){null==e?e=this.sortCriteria:this.sortCriteria=e;var t=this.comparator,a=this;return new Promise(function(n){null==t?(a._collection.comparator=e.key,"ascending"===e.direction?a._collection.sortDirection=1:a._collection.sortDirection=-1):a._collection.comparator=t,a._collection.sort(null),n({header:e.key,direction:e.direction})})},o.prototype.totalSize=function(){var e=this._collection.totalResults>=0?this._collection.totalResults:-1;if(e>-1){var t=this._collection.size();return t>e?t:e}if(this._fetchResultSize>0)e=this._fetchResultSize;else if("atLeast"===this.totalSizeConfidence())return this._collection.size();return e},o.prototype.totalSizeConfidence=function(){return this._collection.totalResults>=0?"actual":this._collection.hasMore?"atLeast":"unknown"},o.prototype._addCollectionEventListeners=function(){var e=this;this._collection.on(t.Events.EventType.SYNC,function(a){if(a instanceof t.Model)oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.CHANGE,{data:[a.attributes],keys:[a.id],indexes:[a.index]});else if(a instanceof t.Collection&&!e._isFetchingForAt&&!e._isFetching){var n=a.offset,o=a.lastFetchCount||a.lastFetchSize;if(o>0||e._collection.IsVirtual()){e._startIndex=n,e._pageSize=o;var l=0;(e._collection.totalResults>0||e._collection.hasMore)&&(l=n+o),e._isFetchingForAt=!0,a.IterativeAt(n,l).then(function(t){e._isFetchingForAt=!1;for(var a=[],o=[],l=0;l<t.length;l++)if(null!=t[l]){var i=t[l],r=e._wrapWritableValue(i,i.attributes);a.push(r),o.push(i.id)}var s={data:a,keys:o,startIndex:n};e._endFetch.call(e,{silent:!1},s)})}else{var i=e._getRowArray();e._endFetch.call(e,{silent:!1},i)}}}),this._collection.on(t.Events.EventType.ALLADDED,function(t,a){for(var n=[],o=[],l=[],i=0;i<a.length;i++){var r=a[i],s=e._wrapWritableValue(r,r.attributes);n.push(s),o.push(r.id),l.push(r.index)}oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.ADD,{data:n,keys:o,indexes:l})}),this._collection.on(t.Events.EventType.ALLREMOVED,function(t,a){for(var n=[],o=[],l=[],i=0;i<a.length;i++){var r=a[i];n.push(r.attributes),o.push(r.id),l.push(r.index)}oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.REMOVE,{data:n,keys:o,indexes:l})}),this._collection.on(t.Events.EventType.RESET,function(t){oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.RESET,t)}),this._collection.on(t.Events.EventType.SORT,function(t,a){if(null==a||!a.add){var o={};null==t||null==!t.comparator||n.isFunction(t.comparator)||(o.header=t.comparator,o.direction=1===t.sortDirection?"ascending":"descending"),oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.SORT,o)}}),this._collection.on(t.Events.EventType.CHANGE,function(t){oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.CHANGE,{data:[t.attributes],keys:[t.id],indexes:[t.index]})}),this._collection.on(t.Events.EventType.DESTROY,function(t){oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.DESTROY,t)}),this._collection.on(t.Events.EventType.REFRESH,function(t){oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.REFRESH,t)}),this._collection.on(t.Events.EventType.ERROR,function(t,a,n){oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.ERROR,t,a,n)}),this._collection.on(t.Events.EventType.REQUEST,function(t){e._isFetching||oj.TableDataSource.superclass.handleEvent.call(e,oj.TableDataSource.EventType.REQUEST,t)})},o.prototype._fetchInternal=function(e){this._startFetch(e);var t=e||{},a=this;return this._isPaged=t.pageSize>0,this._startIndex=null==t.startIndex?this._startIndex:t.startIndex,this._pageSize=t.pageSize>0?t.pageSize:-1,t.pageSize=this._pageSize,t.startIndex=this._startIndex,t.refresh=!0,new Promise(function(e,n){var o=a._pageSize;a._isPaged||(o=25),a._collection.setRangeLocal(a._startIndex,o).then(function(n){var o;if(a._isPaged||a._collection.IsVirtual()){for(var l=[],i=[],r=0;r<n.models.length;r++){var s=n.models[r],c=a._wrapWritableValue(s,s.attributes);l[r]=c,i[r]=s.id}o={data:l,keys:i,startIndex:a._startIndex},n.models.length<a._pageSize?a.totalSize()<0&&(a._fetchResultSize=a._startIndex+n.models.length):a._fetchResultSize=null}else o=a._getRowArray();a._endFetch.call(a,t,o),e(o)},function(e){n(e)})})},o.prototype._startFetch=function(e){this._isFetching=!0,e.silent||oj.TableDataSource.superclass.handleEvent.call(this,oj.TableDataSource.EventType.REQUEST,{startIndex:e.startIndex})},o.prototype._endFetch=function(e,t){this._isFetching=!1,e.silent||oj.TableDataSource.superclass.handleEvent.call(this,oj.TableDataSource.EventType.SYNC,t)},o.prototype._getRowArray=function(){for(var e=this._collection.size()-1,t=[],a=[],n=this._startIndex>=0?this._startIndex:0;n<=e;n++){var o=this._collection.at(n),l=this._wrapWritableValue(o,o.attributes);t[n]=l,a[n]=o.id}return{data:t,keys:a,startIndex:this._startIndex}},o.prototype.getCapability=function(e){return"sort"===e?"full":null},o.prototype._wrapWritableValue=function(e,t){for(var a={},n=Object.keys(t),o=0;o<n.length;o++){!function(t){var n=e;Object.defineProperty(a,t,{get:function(){return n.get(t)},set:function(e){n.set(t,e,{silent:!0})},enumerable:!0})}(n[o])}return a},e.CollectionTableDataSource=o,Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=ojcollectiontabledatasource.js.map