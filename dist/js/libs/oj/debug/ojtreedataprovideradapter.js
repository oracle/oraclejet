/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovideradapter-base', 'ojs/ojmap'], function(oj, $, DataSourceAdapter, KeyMap)
{
  "use strict";
class TreeDataSourceAdapter extends DataSourceAdapter {
    constructor(treeDataSource) {
        super(treeDataSource);
        this.treeDataSource = treeDataSource;
        this._addTreeDataSourceEventListeners();
        this._parentKey = null;
        this._parentInfoMap = new KeyMap();
    }
    destroy() {
        this._removeTreeDataSourceEventListeners();
    }
    getChildDataProvider(parentKey) {
        if (this._parentInfoMap.has(parentKey)) {
            let childDataProvider = new TreeDataSourceAdapter(this.treeDataSource);
            childDataProvider._parentKey = parentKey;
            childDataProvider._parentInfoMap = this._parentInfoMap;
            return childDataProvider;
        }
        // todo: for the component use case, this is sufficient since parentKey should have been
        // fetched already, otherwise, we would probably need a private contract in TreeDataSource
        // to handle the case when parentKey has not been fetched yet
        return null;
    }
    fetchFirst(params) {
        return new this.AsyncIterable(new this.AsyncIterator(this._getFetchFunc(params), params));
    }
    getTotalSize() {
        return Promise.resolve(this.treeDataSource.getChildCount(this._parentKey));
    }
    isEmpty() {
        var count = this.treeDataSource.getChildCount();
        if (count === -1) {
            return "unknown";
        }
        return count > 0 ? 'no' : 'yes';
    }
    getCapability(capabilityName) {
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
    }
    /**
     * Get the function which performs the fetch
     */
    _getFetchFunc(params) {
        let self = this;
        if (params != null && params[TreeDataSourceAdapter._SORTCRITERIA] != null) {
            let attribute = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._ATTRIBUTE];
            let direction = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._DIRECTION];
            return function (attribute, direction) {
                return function (params, fetchFirst) {
                    if (fetchFirst) {
                        let sortParam = {};
                        sortParam[TreeDataSourceAdapter._KEY] = attribute;
                        sortParam[TreeDataSourceAdapter._DIRECTION] = direction;
                        return new Promise(function (resolve, reject) {
                            self.treeDataSource.sort(sortParam, { success: function () {
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
    }
    /**
     * Get the function which invokes fetchChildren() on TreeDataSource
     */
    _getTreeDataSourceFetch(params) {
        let self = this;
        return function (params, fetchFirst) {
            let sortCriteria = self.treeDataSource.getSortCriteria();
            if (sortCriteria != null && sortCriteria[TreeDataSourceAdapter._DIRECTION] != 'none' && params[TreeDataSourceAdapter._SORTCRITERIA] == null) {
                params[TreeDataSourceAdapter._SORTCRITERIA] = [];
                let sortCriterion = new self.SortCriterion(self, sortCriteria[TreeDataSourceAdapter._KEY], sortCriteria[TreeDataSourceAdapter._DIRECTION]);
                params[TreeDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
            }
            self._isFetching = true;
            return new Promise(function (resolve, reject) {
                self.treeDataSource.fetchChildren(self._parentKey, { start: 0, end: -1 }, { success: function (nodeSet) {
                        self._isFetching = false;
                        let resultData = [];
                        let resultMetadata = [];
                        let start = nodeSet.getStart();
                        let count = nodeSet.getCount();
                        let i, data, metadata;
                        for (i = 0; i < count; i++) {
                            data = nodeSet.getData(start + i);
                            resultData.push(data);
                            metadata = nodeSet.getMetadata(start + i);
                            if (!metadata[TreeDataSourceAdapter._LEAF]) {
                                self._parentInfoMap.set(metadata[TreeDataSourceAdapter._KEY], metadata);
                            }
                            resultMetadata.push(new self.ItemMetadata(self, metadata[TreeDataSourceAdapter._KEY]));
                        }
                        resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, resultData, resultMetadata)));
                    }, error: function (error) {
                        self._isFetching = false;
                        reject(error);
                    } });
            });
        };
    }
    /**
     * Add event listeners to TreeDataSource.  Note that currently none of the components
     * handle change event from TreeDataSource.
     */
    _addTreeDataSourceEventListeners() {
        this.removeAllListeners();
        this.addListener('change', this._handleChange);
        this.addListener('refresh', this._handleRefresh);
    }
    /**
     * Remove event listeners to TableDataSource
     */
    _removeTreeDataSourceEventListeners() {
        this.removeListener('change');
        this.removeListener('refresh');
    }
    _handleChange(event) {
        let operation = event[TreeDataSourceAdapter._OPERATION];
        if (operation === 'insert') {
            this._handleInsert(event);
        }
        else if (operation === 'delete') {
            this._handleDelete(event);
        }
        else if (operation === 'update') {
            this._handleUpdate(event);
        }
    }
    _handleInsert(event) {
        let data = event[TreeDataSourceAdapter._DATA];
        let index = event[TreeDataSourceAdapter._INDEX];
        let key = event[TreeDataSourceAdapter._KEY];
        let parentKey = event[TreeDataSourceAdapter._PARENT];
        let itemMetadata = new this.ItemMetadata(this, key);
        let keySet = new Set();
        keySet.add(key);
        let metadata = event[TreeDataSourceAdapter._METADATA];
        if (metadata != null && metadata[TreeDataSourceAdapter._LEAF]) {
            this._parentInfoMap.set(key, metadata);
        }
        let operationEventDetail = new this.DataProviderAddOperationEventDetail(this, keySet, null, null, [parentKey], [itemMetadata], [data], [index]);
        let mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationEventDetail, null, null);
        this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
    _handleDelete(event) {
        let data = event[TreeDataSourceAdapter._DATA];
        let index = event[TreeDataSourceAdapter._INDEX];
        let key = event[TreeDataSourceAdapter._KEY];
        let itemMetadata = new this.ItemMetadata(this, key);
        let keySet = new Set();
        keySet.add(key);
        this._parentInfoMap.delete(key);
        let operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
        let mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, operationEventDetail, null);
        this.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
    _handleUpdate(event) {
        let data = event[TreeDataSourceAdapter._DATA];
        let index = event[TreeDataSourceAdapter._INDEX];
        let key = event[TreeDataSourceAdapter._KEY];
        let itemMetadata = new this.ItemMetadata(this, key);
        let keySet = new Set();
        keySet.add(key);
        let operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
        let mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, null, operationEventDetail);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
    _handleRefresh(event) {
        if (!this._isFetching) {
            this._parentInfoMap.clear();
            this.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    }
}
TreeDataSourceAdapter._SORTCRITERIA = 'sortCriteria';
TreeDataSourceAdapter._INDEX = 'index';
TreeDataSourceAdapter._PARENT = 'parent';
TreeDataSourceAdapter._LEAF = 'leaf';
TreeDataSourceAdapter._OPERATION = 'operation';
oj.TreeDataSourceAdapter = TreeDataSourceAdapter;
oj['TreeDataSourceAdapter'] = TreeDataSourceAdapter;
oj.FetchByKeysMixin.applyMixin(TreeDataSourceAdapter);
oj.FetchByOffsetMixin.applyMixin(TreeDataSourceAdapter);

return TreeDataSourceAdapter;
});