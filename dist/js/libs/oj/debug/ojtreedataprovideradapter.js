/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovideradapter-base', 'ojs/ojmap'], function(oj, $, DataSourceAdapter, KeyMap)
{
  "use strict";
/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */
var TreeDataSourceAdapter = /** @class */ (function (_super) {
    __extends(TreeDataSourceAdapter, _super);
    function TreeDataSourceAdapter(treeDataSource) {
        var _this = _super.call(this, treeDataSource) || this;
        _this.treeDataSource = treeDataSource;
        _this._addTreeDataSourceEventListeners();
        _this._parentKey = null;
        _this._parentInfoMap = new KeyMap();
        return _this;
    }
    TreeDataSourceAdapter.prototype.destroy = function () {
        this._removeTreeDataSourceEventListeners();
    };
    TreeDataSourceAdapter.prototype.getChildDataProvider = function (parentKey) {
        if (this._parentInfoMap.has(parentKey)) {
            var childDataProvider = new TreeDataSourceAdapter(this.treeDataSource);
            childDataProvider._parentKey = parentKey;
            childDataProvider._parentInfoMap = this._parentInfoMap;
            return childDataProvider;
        }
        // todo: for the component use case, this is sufficient since parentKey should have been
        // fetched already, otherwise, we would probably need a private contract in TreeDataSource
        // to handle the case when parentKey has not been fetched yet
        return null;
    };
    TreeDataSourceAdapter.prototype.fetchFirst = function (params) {
        return new this.AsyncIterable(new this.AsyncIterator(this._getFetchFunc(params), params));
    };
    TreeDataSourceAdapter.prototype.getTotalSize = function () {
        return Promise.resolve(this.treeDataSource.getChildCount(this._parentKey));
    };
    TreeDataSourceAdapter.prototype.isEmpty = function () {
        var count = this.treeDataSource.getChildCount();
        if (count === -1) {
            return "unknown";
        }
        return count > 0 ? 'no' : 'yes';
    };
    TreeDataSourceAdapter.prototype.getCapability = function (capabilityName) {
        if (capabilityName == TreeDataSourceAdapter._SORT &&
            this.treeDataSource.getCapability(capabilityName) == 'full') {
            return { attributes: 'multiple' };
        }
        else if (capabilityName == 'fetchByKeys') {
            return { implementation: 'iteration' };
        }
        else if (capabilityName == 'fetchByOffset') {
            return { implementation: 'iteration' };
        }
        return null;
    };
    /**
     * Get the function which performs the fetch
     */
    TreeDataSourceAdapter.prototype._getFetchFunc = function (params) {
        var self = this;
        if (params != null && params[TreeDataSourceAdapter._SORTCRITERIA] != null) {
            var attribute = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._ATTRIBUTE];
            var direction = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._DIRECTION];
            return function (attribute, direction) {
                return function (params, fetchFirst) {
                    if (fetchFirst) {
                        var sortParam_1 = {};
                        sortParam_1[TreeDataSourceAdapter._KEY] = attribute;
                        sortParam_1[TreeDataSourceAdapter._DIRECTION] = direction;
                        return new Promise(function (resolve, reject) {
                            self.treeDataSource.sort(sortParam_1, { success: function () {
                                    resolve(self._getTreeDataSourceFetch(params)(params));
                                }, error: function (err) {
                                    reject(err);
                                } });
                        });
                    }
                    else {
                        return self._getTreeDataSourceFetch(params)(params);
                    }
                };
            }(attribute, direction);
        }
        else {
            return this._getTreeDataSourceFetch(params);
        }
    };
    /**
     * Get the function which invokes fetchChildren() on TreeDataSource
     */
    TreeDataSourceAdapter.prototype._getTreeDataSourceFetch = function (params) {
        var self = this;
        return function (params, fetchFirst) {
            var sortCriteria = self.treeDataSource.getSortCriteria();
            if (sortCriteria != null && sortCriteria[TreeDataSourceAdapter._DIRECTION] != 'none' && params[TreeDataSourceAdapter._SORTCRITERIA] == null) {
                params[TreeDataSourceAdapter._SORTCRITERIA] = [];
                var sortCriterion = new self.SortCriterion(self, sortCriteria[TreeDataSourceAdapter._KEY], sortCriteria[TreeDataSourceAdapter._DIRECTION]);
                params[TreeDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
            }
            self._isFetching = true;
            return new Promise(function (resolve, reject) {
                self.treeDataSource.fetchChildren(self._parentKey, { start: 0, end: -1 }, { success: function (nodeSet) {
                        self._isFetching = false;
                        var resultData = [];
                        var resultMetadata = [];
                        var start = nodeSet.getStart();
                        var count = nodeSet.getCount();
                        var i, data, metadata;
                        for (i = 0; i < count; i++) {
                            data = nodeSet.getData(start + i);
                            resultData.push(data);
                            metadata = nodeSet.getMetadata(start + i);
                            if (!metadata[TreeDataSourceAdapter._LEAF]) {
                                self._parentInfoMap.set(metadata[TreeDataSourceAdapter._KEY], metadata);
                            }
                            resultMetadata.push(new self.ItemMetadata(self, metadata[TreeDataSourceAdapter._KEY]));
                        }
                        resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, resultData, resultMetadata), true));
                    }, error: function (error) {
                        self._isFetching = false;
                        reject(error);
                    } });
            });
        };
    };
    /**
     * Add event listeners to TreeDataSource.  Note that currently none of the components
     * handle change event from TreeDataSource.
     */
    TreeDataSourceAdapter.prototype._addTreeDataSourceEventListeners = function () {
        this.removeAllListeners();
        this.addListener('change', this._handleChange);
        this.addListener('refresh', this._handleRefresh);
    };
    /**
     * Remove event listeners to TableDataSource
     */
    TreeDataSourceAdapter.prototype._removeTreeDataSourceEventListeners = function () {
        this.removeListener('change');
        this.removeListener('refresh');
    };
    TreeDataSourceAdapter.prototype._handleChange = function (event) {
        var operation = event[TreeDataSourceAdapter._OPERATION];
        if (operation === 'insert') {
            this._handleInsert(event);
        }
        else if (operation === 'delete') {
            this._handleDelete(event);
        }
        else if (operation === 'update') {
            this._handleUpdate(event);
        }
    };
    TreeDataSourceAdapter.prototype._handleInsert = function (event) {
        var data = event[TreeDataSourceAdapter._DATA];
        var index = event[TreeDataSourceAdapter._INDEX];
        var key = event[TreeDataSourceAdapter._KEY];
        var parentKey = event[TreeDataSourceAdapter._PARENT];
        var itemMetadata = new this.ItemMetadata(this, key);
        var keySet = new Set();
        keySet.add(key);
        var metadata = event[TreeDataSourceAdapter._METADATA];
        if (metadata != null && metadata[TreeDataSourceAdapter._LEAF]) {
            this._parentInfoMap.set(key, metadata);
        }
        var operationEventDetail = new this.DataProviderAddOperationEventDetail(this, keySet, null, null, [parentKey], [itemMetadata], [data], [index]);
        var mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationEventDetail, null, null);
        this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    };
    TreeDataSourceAdapter.prototype._handleDelete = function (event) {
        var data = event[TreeDataSourceAdapter._DATA];
        var index = event[TreeDataSourceAdapter._INDEX];
        var key = event[TreeDataSourceAdapter._KEY];
        var itemMetadata = new this.ItemMetadata(this, key);
        var keySet = new Set();
        keySet.add(key);
        this._parentInfoMap.delete(key);
        var operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
        var mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, operationEventDetail, null);
        this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    };
    TreeDataSourceAdapter.prototype._handleUpdate = function (event) {
        var data = event[TreeDataSourceAdapter._DATA];
        var index = event[TreeDataSourceAdapter._INDEX];
        var key = event[TreeDataSourceAdapter._KEY];
        var itemMetadata = new this.ItemMetadata(this, key);
        var keySet = new Set();
        keySet.add(key);
        var operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
        var mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, null, operationEventDetail);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    };
    TreeDataSourceAdapter.prototype._handleRefresh = function (event) {
        if (!this._isFetching) {
            this._parentInfoMap.clear();
            this.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    };
    TreeDataSourceAdapter._SORTCRITERIA = 'sortCriteria';
    TreeDataSourceAdapter._INDEX = 'index';
    TreeDataSourceAdapter._PARENT = 'parent';
    TreeDataSourceAdapter._LEAF = 'leaf';
    TreeDataSourceAdapter._OPERATION = 'operation';
    return TreeDataSourceAdapter;
}(DataSourceAdapter));
oj.TreeDataSourceAdapter = TreeDataSourceAdapter;
oj['TreeDataSourceAdapter'] = TreeDataSourceAdapter;
oj.FetchByKeysMixin.applyMixin(TreeDataSourceAdapter);
oj.FetchByOffsetMixin.applyMixin(TreeDataSourceAdapter);

return TreeDataSourceAdapter;
});