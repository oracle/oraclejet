/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojmodel', 'ojs/ojdataprovideradapter-base', 'ojs/ojeventtarget'], function (oj, ojdataprovider, ojmodel, DataSourceAdapter, ojeventtarget) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    DataSourceAdapter = DataSourceAdapter && Object.prototype.hasOwnProperty.call(DataSourceAdapter, 'default') ? DataSourceAdapter['default'] : DataSourceAdapter;

    class TableDataSourceAdapter extends DataSourceAdapter {
        constructor(tableDataSource) {
            super(tableDataSource);
            this.tableDataSource = tableDataSource;
            this.FetchByKeysResults = class {
                constructor(_parent, fetchParameters, results) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this[TableDataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
                    this[TableDataSourceAdapter._RESULTS] = results;
                }
            };
            this.ContainsKeysResults = class {
                constructor(_parent, containsParameters, results) {
                    this._parent = _parent;
                    this.containsParameters = containsParameters;
                    this.results = results;
                    this[TableDataSourceAdapter._CONTAINSPARAMETERS] = containsParameters;
                    this[TableDataSourceAdapter._RESULTS] = results;
                }
            };
            this.Item = class {
                constructor(_parent, metadata, data) {
                    this._parent = _parent;
                    this.metadata = metadata;
                    this.data = data;
                    this[TableDataSourceAdapter._METADATA] = metadata;
                    this[TableDataSourceAdapter._DATA] = data;
                }
            };
            this.FetchByOffsetResults = class {
                constructor(_parent, fetchParameters, results, done) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                    this[TableDataSourceAdapter._FETCHPARAMETERS] = fetchParameters;
                    this[TableDataSourceAdapter._RESULTS] = results;
                    this[TableDataSourceAdapter._DONE] = done;
                }
            };
            this.FetchListParameters = class {
                constructor(_parent, size, sortCriteria) {
                    this._parent = _parent;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this[TableDataSourceAdapter._SIZE] = size;
                    this[TableDataSourceAdapter._SORTCRITERIA] = sortCriteria;
                }
            };
            this._addTableDataSourceEventListeners();
            this[TableDataSourceAdapter._OFFSET] = 0;
            this._ignoreDataSourceEvents = new Array();
        }
        destroy() {
            this._removeTableDataSourceEventListeners();
        }
        containsKeys(params) {
            const self = this;
            const resultsPromiseArray = [];
            params[TableDataSourceAdapter._KEYS].forEach(function (key) {
                resultsPromiseArray.push(self.tableDataSource.get(key));
            });
            return Promise.all(resultsPromiseArray).then(function (resultsArray) {
                const results = new Set();
                resultsArray.forEach((value) => {
                    if (value != null) {
                        results.add(value[TableDataSourceAdapter._KEY]);
                    }
                });
                return Promise.resolve(new self.ContainsKeysResults(self, params, results));
            });
        }
        fetchByKeys(params) {
            const self = this;
            const resultsPromiseArray = [];
            params[TableDataSourceAdapter._KEYS].forEach(function (key) {
                resultsPromiseArray.push(self.tableDataSource.get(key));
            });
            return Promise.all(resultsPromiseArray).then(function (resultsArray) {
                const results = new Map();
                for (let i = 0; i < resultsArray.length; i++) {
                    const value = resultsArray[i];
                    if (value != null) {
                        const itemKey = value[TableDataSourceAdapter._KEY];
                        const data = value[TableDataSourceAdapter._DATA];
                        const itemMetadata = new self.ItemMetadata(self, itemKey);
                        const index = value[TableDataSourceAdapter._INDEX];
                        self._extractMetaData(self.dataSource, index, itemMetadata);
                        results.set(itemKey, new self.Item(self, itemMetadata, data));
                    }
                }
                return Promise.resolve(new self.FetchByKeysResults(self, params, results));
            });
        }
        fetchByOffset(params) {
            const self = this;
            const size = params != null ? params[TableDataSourceAdapter._SIZE] : -1;
            const sortCriteria = params != null ? params[TableDataSourceAdapter._SORTCRITERIA] : null;
            const offset = params != null
                ? params[TableDataSourceAdapter._OFFSET] > 0
                    ? params[TableDataSourceAdapter._OFFSET]
                    : 0
                : 0;
            const fetchParams = new this.FetchListParameters(this, size, sortCriteria);
            this._startIndex = 0;
            return this._getFetchFunc(fetchParams, offset)(fetchParams, true).then(function (iteratorResults) {
                const value = iteratorResults[TableDataSourceAdapter._VALUE];
                const done = iteratorResults[TableDataSourceAdapter._DONE];
                const data = value[TableDataSourceAdapter._DATA];
                const keys = value[TableDataSourceAdapter._METADATA].map(function (value) {
                    return value[TableDataSourceAdapter._KEY];
                });
                const resultsArray = new Array();
                data.map(function (value, index) {
                    resultsArray.push(new self.Item(self, new self.ItemMetadata(self, keys[index]), data[index]));
                });
                for (let i = 0; i < resultsArray.length; i++) {
                    self._extractMetaData(self.dataSource, i + offset, resultsArray[i][TableDataSourceAdapter._METADATA]);
                }
                return new self.FetchByOffsetResults(self, params, resultsArray, done);
            });
        }
        fetchFirst(params) {
            if (!this._isPagingModelTableDataSource()) {
                this._startIndex = 0;
            }
            return new this.AsyncIterable(new this.AsyncIterator(this._getFetchFunc(params), params));
        }
        getCapability(capabilityName) {
            if (capabilityName == TableDataSourceAdapter._SORT &&
                this.tableDataSource.getCapability(capabilityName) == 'full') {
                return { attributes: 'multiple' };
            }
            else if (capabilityName == 'fetchByKeys') {
                return { implementation: 'lookup' };
            }
            else if (capabilityName == 'fetchByOffset') {
                return { implementation: 'lookup' };
            }
            return null;
        }
        getTotalSize() {
            return Promise.resolve(this.tableDataSource.totalSize());
        }
        isEmpty() {
            return this.tableDataSource.totalSize() > 0 ? 'no' : 'yes';
        }
        getPage() {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.getPage();
            }
            return -1;
        }
        setPage(value, options) {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.setPage(value, options);
            }
            return Promise.reject(null);
        }
        getStartItemIndex() {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.getStartItemIndex();
            }
            return -1;
        }
        getEndItemIndex() {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.getEndItemIndex();
            }
            return -1;
        }
        getPageCount() {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.getPageCount();
            }
            return -1;
        }
        totalSize() {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.totalSize();
            }
            return -1;
        }
        totalSizeConfidence() {
            if (this._isPagingModelTableDataSource()) {
                return this.tableDataSource.totalSizeConfidence();
            }
            return null;
        }
        _getFetchFunc(params, offset) {
            const self = this;
            if (params != null && params[TableDataSourceAdapter._SORTCRITERIA] != null) {
                const attribute = params[TableDataSourceAdapter._SORTCRITERIA][0][TableDataSourceAdapter._ATTRIBUTE];
                const direction = params[TableDataSourceAdapter._SORTCRITERIA][0][TableDataSourceAdapter._DIRECTION];
                this._ignoreSortEvent = true;
                if (!this._isPagingModelTableDataSource()) {
                    this._startIndex = 0;
                }
                return (function (attribute, direction) {
                    return function (params, fetchFirst) {
                        if (fetchFirst) {
                            const sortParam = {};
                            sortParam[TableDataSourceAdapter._KEY] = attribute;
                            sortParam[TableDataSourceAdapter._DIRECTION] = direction;
                            self[TableDataSourceAdapter._OFFSET] = 0;
                            return self.tableDataSource.sort(sortParam).then(function () {
                                self._ignoreSortEvent = false;
                                return self._getTableDataSourceFetch(params, offset)(params);
                            });
                        }
                        else {
                            return self._getTableDataSourceFetch(params, offset)(params);
                        }
                    };
                })(attribute, direction);
            }
            else {
                return this._getTableDataSourceFetch(params, offset);
            }
        }
        _extractMetaData(tableDataSource, index, itemMetadata) {
            let dataSource = tableDataSource;
            if (this._isPagingModelTableDataSource()) {
                dataSource = dataSource.getWrappedDataSource();
            }
            if (dataSource._getMetadata) {
                const metadata = dataSource._getMetadata(index);
                if (metadata) {
                    Object.keys(metadata).forEach(function (key) {
                        itemMetadata[key] = metadata[key];
                    });
                }
            }
        }
        _getTableDataSourceFetch(params, offset) {
            const self = this;
            return function (params, fetchFirst) {
                const options = {};
                offset = offset > 0 ? offset : 0;
                if (self._startIndex != null) {
                    options[TableDataSourceAdapter._STARTINDEX] = self._startIndex + offset;
                }
                options[TableDataSourceAdapter._PAGESIZE] =
                    params != null && params[TableDataSourceAdapter._SIZE] > 0
                        ? params[TableDataSourceAdapter._SIZE]
                        : null;
                if (!self._isPagingModelTableDataSource() && (params === null || params === void 0 ? void 0 : params[TableDataSourceAdapter._SILENT])) {
                    options[TableDataSourceAdapter._SILENT] = params[TableDataSourceAdapter._SILENT];
                }
                if (self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA] != null &&
                    params[TableDataSourceAdapter._SORTCRITERIA] == null) {
                    params[TableDataSourceAdapter._SORTCRITERIA] = [];
                    const sortCriterion = new self.SortCriterion(self, self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA][TableDataSourceAdapter._KEY], self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA][TableDataSourceAdapter._DIRECTION]);
                    params[TableDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
                }
                options[TableDataSourceAdapter._FETCHTYPE] = params[TableDataSourceAdapter._FETCHTYPE];
                self._isFetching = true;
                return new Promise(function (resolve, reject) {
                    self._fetchResolveFunc = resolve;
                    self._fetchRejectFunc = reject;
                    self._fetchParams = params;
                    if (!self._requestEventTriggered) {
                        if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
                            self._ignoreDataSourceEvents.push(true);
                        }
                        self.tableDataSource.fetch(options).then(function (result) {
                            if (!self._isPagingModelTableDataSource() &&
                                !options[TableDataSourceAdapter._SILENT]) {
                                self._ignoreDataSourceEvents.pop();
                            }
                            if (result !== null) {
                                self._isFetching = false;
                                if (result === undefined) {
                                    result = {};
                                    result[TableDataSourceAdapter._KEYS] = [];
                                    result[TableDataSourceAdapter._DATA] = [];
                                }
                                let resultMetadata = [];
                                if (result[TableDataSourceAdapter._KEYS] != null) {
                                    resultMetadata = result[TableDataSourceAdapter._KEYS].map(function (value) {
                                        return new self.ItemMetadata(self, value);
                                    });
                                }
                                if (self._startIndex == null) {
                                    self._startIndex = 0;
                                }
                                for (let i = 0; i < resultMetadata.length; i++) {
                                    self._extractMetaData(self.dataSource, self._startIndex + i, resultMetadata[i]);
                                }
                                let done = false;
                                self._startIndex = self._startIndex + result[TableDataSourceAdapter._DATA].length;
                                if (self.tableDataSource.totalSizeConfidence() == 'actual' &&
                                    self.tableDataSource.totalSize() > 0 &&
                                    result.startIndex + result[TableDataSourceAdapter._DATA].length >=
                                        self.tableDataSource.totalSize()) {
                                    done = true;
                                }
                                else if (options[TableDataSourceAdapter._PAGESIZE] > 0 &&
                                    result[TableDataSourceAdapter._DATA].length <
                                        options[TableDataSourceAdapter._PAGESIZE]) {
                                    done = true;
                                }
                                else if (result[TableDataSourceAdapter._DATA].length === 0) {
                                    done = true;
                                }
                                self._fetchResolveFunc = null;
                                self._fetchParams = null;
                                if (done) {
                                    resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, result[TableDataSourceAdapter._DATA], resultMetadata)));
                                }
                                else {
                                    resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, params, result[TableDataSourceAdapter._DATA], resultMetadata)));
                                }
                            }
                        }, function (error) {
                            if (!self._isPagingModelTableDataSource() &&
                                !options[TableDataSourceAdapter._SILENT]) {
                                self._ignoreDataSourceEvents.pop();
                            }
                            reject(error);
                        });
                    }
                });
            };
        }
        _adjustIteratorOffset(removeIndexes, addIndexes) {
            let offset = this._startIndex;
            let deleteCount = 0;
            if (removeIndexes) {
                removeIndexes.forEach(function (index) {
                    if (index < offset) {
                        ++deleteCount;
                    }
                });
            }
            offset -= deleteCount;
            if (addIndexes) {
                addIndexes.forEach(function (index) {
                    if (index < offset) {
                        ++offset;
                    }
                });
            }
            this._startIndex = offset;
        }
        _handleSync(event) {
            const self = this;
            if (self._ignoreDataSourceEvents.length > 0) {
                return;
            }
            self._startIndex = null;
            if (event[TableDataSourceAdapter._STARTINDEX] > 0) {
                self._startIndex = event[TableDataSourceAdapter._STARTINDEX];
                self[TableDataSourceAdapter._OFFSET] = self._startIndex;
            }
            if (self._fetchResolveFunc && event[TableDataSourceAdapter._KEYS] != null) {
                self._isFetching = false;
                const resultMetadata = event[TableDataSourceAdapter._KEYS].map(function (value) {
                    return new self.ItemMetadata(self, value);
                });
                for (let i = 0; i < resultMetadata.length; i++) {
                    let indexToExtract = self._startIndex != null ? self._startIndex + i : i;
                    self._extractMetaData(self.dataSource, indexToExtract, resultMetadata[i]);
                }
                let done = false;
                if (self.tableDataSource.totalSizeConfidence() == 'actual' &&
                    self.tableDataSource.totalSize() > 0 &&
                    self._startIndex + event[TableDataSourceAdapter._DATA].length >=
                        self.tableDataSource.totalSize()) {
                    done = true;
                }
                if (done) {
                    self._fetchResolveFunc(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, self._fetchParams, event[TableDataSourceAdapter._DATA], resultMetadata)));
                }
                else {
                    self._fetchResolveFunc(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, self._fetchParams, event[TableDataSourceAdapter._DATA], resultMetadata)));
                }
                self._fetchResolveFunc = null;
                self._fetchParams = null;
            }
            else if (!self._requestEventTriggered) {
                self.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
            self._requestEventTriggered = false;
        }
        _handleAdd(event) {
            var _a;
            const self = this;
            const metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
                return new self.ItemMetadata(self, value);
            });
            const keySet = new Set();
            event[TableDataSourceAdapter._KEYS].map(function (key) {
                keySet.add(key);
            });
            const operationEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet, null, null, null, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
            const mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationEventDetail, null, null);
            self.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
            this._adjustIteratorOffset(null, (_a = mutationEventDetail.add) === null || _a === void 0 ? void 0 : _a.indexes);
        }
        _handleRemove(event) {
            var _a;
            const self = this;
            const metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
                return new self.ItemMetadata(self, value);
            });
            const keySet = new Set();
            event[TableDataSourceAdapter._KEYS].map(function (key) {
                keySet.add(key);
            });
            const operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
            const mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, operationEventDetail, null);
            self.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
            this._adjustIteratorOffset((_a = mutationEventDetail.remove) === null || _a === void 0 ? void 0 : _a.indexes, null);
        }
        _handleReset(event) {
            const self = this;
            if (!self._requestEventTriggered && !self._isPagingModelTableDataSource()) {
                self._startIndex = 0;
                self.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
        }
        _handleSort(event) {
            const self = this;
            if (!self._ignoreSortEvent) {
                self._startIndex = null;
                self.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
        }
        _handleChange(event) {
            const self = this;
            const metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
                return new self.ItemMetadata(self, value);
            });
            const keySet = new Set();
            event[TableDataSourceAdapter._KEYS].map(function (key) {
                keySet.add(key);
            });
            const operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
            const mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, null, operationEventDetail);
            self.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
        }
        _handleRefresh(event) {
            const self = this;
            if (!self._isFetching && !self._requestEventTriggered) {
                if (event[TableDataSourceAdapter._OFFSET] != null) {
                    self._startIndex = event[TableDataSourceAdapter._OFFSET];
                    if (self.tableDataSource._fetchType === 'loadMore') {
                        self.offset = event[TableDataSourceAdapter._OFFSET];
                    }
                }
                else {
                    self._startIndex = null;
                }
                self.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
            self._requestEventTriggered = false;
        }
        _handleRequest(event) {
            const self = this;
            if (self._ignoreDataSourceEvents.length > 0) {
                return;
            }
            if (typeof ojmodel.Model !== 'undefined' && event instanceof ojmodel.Model) {
                return;
            }
            if (!self._isFetching) {
                if (event[TableDataSourceAdapter._STARTINDEX] > 0 && self.getStartItemIndex() === 0) {
                    self._startIndex = event[TableDataSourceAdapter._STARTINDEX];
                }
                self._requestEventTriggered = true;
                self.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
        }
        _handleError(event) {
            const self = this;
            if (self._fetchRejectFunc) {
                self._fetchRejectFunc(event);
            }
            self._isFetching = false;
            self._requestEventTriggered = false;
        }
        _handlePage(event) {
            const self = this;
            self._isFetching = false;
            self._requestEventTriggered = false;
            const options = {};
            options['detail'] = event;
            self.dispatchEvent(new ojeventtarget.GenericEvent(oj.PagingModel.EventType['PAGE'], options));
        }
        _addTableDataSourceEventListeners() {
            this.removeAllListeners();
            this.addListener('sync', this._handleSync);
            this.addListener('add', this._handleAdd);
            this.addListener('remove', this._handleRemove);
            this.addListener('reset', this._handleReset);
            this.addListener('sort', this._handleSort);
            this.addListener('change', this._handleChange);
            this.addListener('refresh', this._handleRefresh);
            this.addListener('request', this._handleRequest);
            this.addListener('error', this._handleError);
            this.addListener('page', this._handlePage);
        }
        _removeTableDataSourceEventListeners() {
            this.removeListener('sync');
            this.removeListener('add');
            this.removeListener('remove');
            this.removeListener('reset');
            this.removeListener('sort');
            this.removeListener('change');
            this.removeListener('refresh');
            this.removeListener('request');
            this.removeListener('error');
            this.removeListener('page');
        }
        _isPagingModelTableDataSource() {
            if (this.tableDataSource['getStartItemIndex'] != null) {
                return true;
            }
            return false;
        }
    }
    TableDataSourceAdapter._STARTINDEX = 'startIndex';
    TableDataSourceAdapter._SILENT = 'silent';
    TableDataSourceAdapter._SORTCRITERIA = 'sortCriteria';
    TableDataSourceAdapter._PAGESIZE = 'pageSize';
    TableDataSourceAdapter._OFFSET = 'offset';
    TableDataSourceAdapter._SIZE = 'size';
    TableDataSourceAdapter._CONTAINSPARAMETERS = 'containsParameters';
    TableDataSourceAdapter._RESULTS = 'results';
    TableDataSourceAdapter._FETCHTYPE = 'fetchType';
    TableDataSourceAdapter._INDEX = 'index';
    ojeventtarget.EventTargetMixin.applyMixin(TableDataSourceAdapter);
    oj._registerLegacyNamespaceProp('TableDataSourceAdapter', TableDataSourceAdapter);

    return TableDataSourceAdapter;

});
