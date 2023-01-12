/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovideradapter-base', 'ojs/ojdataprovider', 'ojs/ojmap'], function (oj, DataSourceAdapter, ojdataprovider, KeyMap) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    DataSourceAdapter = DataSourceAdapter && Object.prototype.hasOwnProperty.call(DataSourceAdapter, 'default') ? DataSourceAdapter['default'] : DataSourceAdapter;
    KeyMap = KeyMap && Object.prototype.hasOwnProperty.call(KeyMap, 'default') ? KeyMap['default'] : KeyMap;

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
                const childDataProvider = new TreeDataSourceAdapter(this.treeDataSource);
                childDataProvider._parentKey = parentKey;
                childDataProvider._parentInfoMap = this._parentInfoMap;
                return childDataProvider;
            }
            return null;
        }
        fetchFirst(params) {
            return new this.AsyncIterable(new this.AsyncIterator(this._getFetchFunc(params), params));
        }
        getTotalSize() {
            return Promise.resolve(this.treeDataSource.getChildCount(this._parentKey));
        }
        isEmpty() {
            const count = this.treeDataSource.getChildCount();
            if (count === -1) {
                return 'unknown';
            }
            return count > 0 ? 'no' : 'yes';
        }
        getCapability(capabilityName) {
            if (capabilityName === TreeDataSourceAdapter._SORT &&
                this.treeDataSource.getCapability(capabilityName) === 'full') {
                return { attributes: 'multiple' };
            }
            else if (capabilityName === 'fetchByKeys') {
                return { implementation: 'iteration' };
            }
            else if (capabilityName === 'fetchByOffset') {
                return { implementation: 'iteration' };
            }
            return null;
        }
        _getFetchFunc(params) {
            const self = this;
            if (params != null && params[TreeDataSourceAdapter._SORTCRITERIA] != null) {
                const attribute = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._ATTRIBUTE];
                const direction = params[TreeDataSourceAdapter._SORTCRITERIA][0][TreeDataSourceAdapter._DIRECTION];
                return (function (attribute, direction) {
                    return function (params, fetchFirst) {
                        if (fetchFirst) {
                            const sortParam = {};
                            sortParam[TreeDataSourceAdapter._KEY] = attribute;
                            sortParam[TreeDataSourceAdapter._DIRECTION] = direction;
                            return new Promise(function (resolve, reject) {
                                self.treeDataSource.sort(sortParam, {
                                    success() {
                                        resolve(self._getTreeDataSourceFetch(params)(params));
                                    },
                                    error(err) {
                                        reject(err);
                                    }
                                });
                            });
                        }
                        else {
                            return self._getTreeDataSourceFetch(params)(params);
                        }
                    };
                })(attribute, direction);
            }
            else {
                return this._getTreeDataSourceFetch(params);
            }
        }
        _getTreeDataSourceFetch(params) {
            const self = this;
            return function (params) {
                const sortCriteria = self.treeDataSource.getSortCriteria();
                if (sortCriteria !== null &&
                    sortCriteria[TreeDataSourceAdapter._DIRECTION] != 'none' &&
                    params[TreeDataSourceAdapter._SORTCRITERIA] == null) {
                    params[TreeDataSourceAdapter._SORTCRITERIA] = [];
                    const sortCriterion = new self.SortCriterion(self, sortCriteria[TreeDataSourceAdapter._KEY], sortCriteria[TreeDataSourceAdapter._DIRECTION]);
                    params[TreeDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
                }
                self._isFetching = true;
                return new Promise(function (resolve, reject) {
                    self.treeDataSource.fetchChildren(self._parentKey, { start: 0, end: -1 }, {
                        success(nodeSet) {
                            self._isFetching = false;
                            const resultData = [];
                            const resultMetadata = [];
                            const start = nodeSet.getStart();
                            const count = nodeSet.getCount();
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
                        },
                        error(error) {
                            self._isFetching = false;
                            reject(error);
                        }
                    });
                });
            };
        }
        _addTreeDataSourceEventListeners() {
            this.removeAllListeners();
            this.addListener('change', this._handleChange);
            this.addListener('refresh', this._handleRefresh);
        }
        _removeTreeDataSourceEventListeners() {
            this.removeListener('change');
            this.removeListener('refresh');
        }
        _handleChange(event) {
            const operation = event[TreeDataSourceAdapter._OPERATION];
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
            const data = event[TreeDataSourceAdapter._DATA];
            const index = event[TreeDataSourceAdapter._INDEX];
            const key = event[TreeDataSourceAdapter._KEY];
            const parentKey = event[TreeDataSourceAdapter._PARENT];
            const itemMetadata = new this.ItemMetadata(this, key);
            const keySet = new Set();
            keySet.add(key);
            const metadata = event[TreeDataSourceAdapter._METADATA];
            if (metadata != null && metadata[TreeDataSourceAdapter._LEAF]) {
                this._parentInfoMap.set(key, metadata);
            }
            const operationEventDetail = new this.DataProviderAddOperationEventDetail(this, keySet, null, null, [parentKey], [itemMetadata], [data], [index]);
            const mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationEventDetail, null, null);
            this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
        }
        _handleDelete(event) {
            const data = event[TreeDataSourceAdapter._DATA];
            const index = event[TreeDataSourceAdapter._INDEX];
            const key = event[TreeDataSourceAdapter._KEY];
            const itemMetadata = new this.ItemMetadata(this, key);
            const keySet = new Set();
            keySet.add(key);
            this._parentInfoMap.delete(key);
            const operationEventDetail = new this.DataProviderOperationEventDetail(this, keySet, [itemMetadata], [data], [index]);
            const mutationEventDetail = new this.DataProviderMutationEventDetail(this, null, operationEventDetail, null);
            this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
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
            self.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
        }
        _handleRefresh(event) {
            if (!this._isFetching) {
                this._parentInfoMap.clear();
                this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
        }
    }
    TreeDataSourceAdapter._SORTCRITERIA = 'sortCriteria';
    TreeDataSourceAdapter._INDEX = 'index';
    TreeDataSourceAdapter._PARENT = 'parent';
    TreeDataSourceAdapter._LEAF = 'leaf';
    TreeDataSourceAdapter._OPERATION = 'operation';
    oj._registerLegacyNamespaceProp('TreeDataSourceAdapter', TreeDataSourceAdapter);
    ojdataprovider.FetchByKeysMixin.applyMixin(TreeDataSourceAdapter);
    ojdataprovider.FetchByOffsetMixin.applyMixin(TreeDataSourceAdapter);

    return TreeDataSourceAdapter;

});
