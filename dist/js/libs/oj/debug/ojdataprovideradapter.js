/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovideradapter-base'], function(oj, $, DataSourceAdapter)
{
  "use strict";
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
        let self = this;
        let resultsPromiseArray = [];
        params[TableDataSourceAdapter._KEYS].forEach(function (key) {
            resultsPromiseArray.push(self.tableDataSource.get(key));
        });
        return Promise.all(resultsPromiseArray).then(function (resultsArray) {
            let results = new Set();
            resultsArray.map(function (value) {
                if (value != null) {
                    results.add(value[TableDataSourceAdapter._KEY]);
                }
            });
            return Promise.resolve(new self.ContainsKeysResults(self, params, results));
        });
    }
    fetchByKeys(params) {
        let self = this;
        let resultsPromiseArray = [];
        params[TableDataSourceAdapter._KEYS].forEach(function (key) {
            resultsPromiseArray.push(self.tableDataSource.get(key));
        });
        return Promise.all(resultsPromiseArray).then(function (resultsArray) {
            let results = new Map();
            resultsArray.map(function (value) {
                if (value != null) {
                    let key = value[TableDataSourceAdapter._KEY];
                    let data = value[TableDataSourceAdapter._DATA];
                    results.set(key, new self.Item(self, new self.ItemMetadata(self, key), data));
                }
            });
            return Promise.resolve(new self.FetchByKeysResults(self, params, results));
        });
    }
    fetchByOffset(params) {
        let self = this;
        let size = params != null ? params[TableDataSourceAdapter._SIZE] : -1;
        let sortCriteria = params != null ? params[TableDataSourceAdapter._SORTCRITERIA] : null;
        let offset = params != null ? params[TableDataSourceAdapter._OFFSET] > 0 ? params[TableDataSourceAdapter._OFFSET] : 0 : 0;
        let fetchParams = new this.FetchListParameters(this, size, sortCriteria);
        this._startIndex = 0;
        return this._getFetchFunc(fetchParams, offset)(fetchParams, true).then(function (iteratorResults) {
            let value = iteratorResults[TableDataSourceAdapter._VALUE];
            let done = iteratorResults[TableDataSourceAdapter._DONE];
            let data = value[TableDataSourceAdapter._DATA];
            let keys = value[TableDataSourceAdapter._METADATA].map(function (value) {
                return value[TableDataSourceAdapter._KEY];
            });
            let resultsArray = new Array();
            data.map(function (value, index) {
                resultsArray.push(new self.Item(self, new self.ItemMetadata(self, keys[index]), data[index]));
            });
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
    // Start PagingModel APIs
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
    // End PagingModel APIs
    /**
     * Get the function which performs the fetch
     */
    _getFetchFunc(params, offset) {
        let self = this;
        if (params != null &&
            params[TableDataSourceAdapter._SORTCRITERIA] != null) {
            let attribute = params[TableDataSourceAdapter._SORTCRITERIA][0][TableDataSourceAdapter._ATTRIBUTE];
            let direction = params[TableDataSourceAdapter._SORTCRITERIA][0][TableDataSourceAdapter._DIRECTION];
            this._ignoreSortEvent = true;
            if (!this._isPagingModelTableDataSource()) {
                this._startIndex = 0;
            }
            return function (attribute, direction) {
                return function (params, fetchFirst) {
                    if (fetchFirst) {
                        let sortParam = {};
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
            }(attribute, direction);
        }
        else {
            return this._getTableDataSourceFetch(params, offset);
        }
    }
    /**
     * Get the function which invokes fetch() on TableDataSource
     */
    _getTableDataSourceFetch(params, offset) {
        let self = this;
        return function (params, fetchFirst) {
            let options = {};
            offset = offset > 0 ? offset : 0;
            if (self._startIndex != null) {
                options[TableDataSourceAdapter._STARTINDEX] = self._startIndex + offset;
            }
            options[TableDataSourceAdapter._PAGESIZE] = params != null && params[TableDataSourceAdapter._SIZE] > 0 ? params[TableDataSourceAdapter._SIZE] : null;
            // to maintain backward compatibility, Table will specify silent flag
            if (!self._isPagingModelTableDataSource() && params[TableDataSourceAdapter._SILENT]) {
                options[TableDataSourceAdapter._SILENT] = params[TableDataSourceAdapter._SILENT];
            }
            if (self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA] != null && params[TableDataSourceAdapter._SORTCRITERIA] == null) {
                params[TableDataSourceAdapter._SORTCRITERIA] = [];
                let sortCriterion = new self.SortCriterion(self, self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA][TableDataSourceAdapter._KEY], self.tableDataSource[TableDataSourceAdapter._SORTCRITERIA][TableDataSourceAdapter._DIRECTION]);
                params[TableDataSourceAdapter._SORTCRITERIA].push(sortCriterion);
            }
            options[TableDataSourceAdapter._FETCHTYPE] = params[TableDataSourceAdapter._FETCHTYPE];
            self._isFetching = true;
            return new Promise(function (resolve, reject) {
                self._fetchResolveFunc = resolve;
                self._fetchRejectFunc = reject;
                self._fetchParams = params;
                if (!self._requestEventTriggered) {
                    // set a flag so that we can ignore request and sync events
                    if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
                        self._ignoreDataSourceEvents.push(true);
                    }
                    self.tableDataSource.fetch(options).then(function (result) {
                        if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
                            self._ignoreDataSourceEvents.pop();
                        }
                        if (result !== null) {
                            self._isFetching = false;
                            if (result === undefined) {
                                // fetch was not executed due to startFetch='disabled'
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
                            let done = false;
                            self._startIndex = self._startIndex + result[TableDataSourceAdapter._DATA].length;
                            if (self.tableDataSource.totalSizeConfidence() == 'actual' &&
                                self.tableDataSource.totalSize() > 0 &&
                                (result.startIndex + result[TableDataSourceAdapter._DATA].length) >= self.tableDataSource.totalSize()) {
                                done = true;
                            }
                            else if (options[TableDataSourceAdapter._PAGESIZE] > 0 &&
                                result[TableDataSourceAdapter._DATA].length < options[TableDataSourceAdapter._PAGESIZE]) {
                                done = true;
                            }
                            else if (result[TableDataSourceAdapter._DATA].length == 0) {
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
                        if (!self._isPagingModelTableDataSource() && !options[TableDataSourceAdapter._SILENT]) {
                            self._ignoreDataSourceEvents.pop();
                        }
                        reject(error);
                    });
                }
            });
        };
    }
    _handleSync(event) {
        let self = this;
        // checks for sync triggered by own fetch
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
            let resultMetadata = event[TableDataSourceAdapter._KEYS].map(function (value) {
                return new self.ItemMetadata(self, value);
            });
            let done = false;
            if (self.tableDataSource.totalSizeConfidence() == 'actual' &&
                self.tableDataSource.totalSize() > 0 &&
                (self._startIndex + event[TableDataSourceAdapter._DATA].length) >= self.tableDataSource.totalSize()) {
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
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
        self._requestEventTriggered = false;
    }
    _handleAdd(event) {
        let self = this;
        let metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        let keySet = new Set();
        event[TableDataSourceAdapter._KEYS].map(function (key) {
            keySet.add(key);
        });
        let operationEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet, null, null, null, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
        let mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationEventDetail, null, null);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
    _handleRemove(event) {
        let self = this;
        let metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        let keySet = new Set();
        event[TableDataSourceAdapter._KEYS].map(function (key) {
            keySet.add(key);
        });
        let operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
        let mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, operationEventDetail, null);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
    _handleReset(event) {
        let self = this;
        // Dispatch a dataprovider refresh event except for the following situations:
        // 1. If a datasource request event was triggered, a dataprovider refresh event has been dispatched;
        // 2. If the datasource is a paging datasource, the pagingcontrol reset handler will indirectly trigger
        //    a datasource request event, which in turn will dispatch a dataprovider refresh event.
        //
        if (!self._requestEventTriggered && !self._isPagingModelTableDataSource()) {
            self._startIndex = 0;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    }
    _handleSort(event) {
        let self = this;
        if (!self._ignoreSortEvent) {
            self._startIndex = null;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    }
    _handleChange(event) {
        let self = this;
        let metadataArray = event[TableDataSourceAdapter._KEYS].map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        let keySet = new Set();
        event[TableDataSourceAdapter._KEYS].map(function (key) {
            keySet.add(key);
        });
        let operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[TableDataSourceAdapter._DATA], event[TableDataSourceAdapter._INDEXES]);
        let mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, null, operationEventDetail);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    }
    _handleRefresh(event) {
        let self = this;
        if (!self._isFetching &&
            !self._requestEventTriggered) {
            if (event[TableDataSourceAdapter._OFFSET] != null) {
                self._startIndex = event[TableDataSourceAdapter._OFFSET];
            }
            else {
                self._startIndex = null;
            }
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
        self._requestEventTriggered = false;
    }
    _handleRequest(event) {
        let self = this;
        // checks for sync triggered by own fetch
        if (self._ignoreDataSourceEvents.length > 0) {
            return;
        }
        // to test backward compatibility we still need to be able to access Model from the oj namespace
        if (typeof oj.Model !== "undefined" &&
            event instanceof oj.Model) {
            // ignore request events by oj.Model. Those will be followed by row
            // mutation events anyway
            return;
        }
        if (!self._isFetching) {
            if (event[TableDataSourceAdapter._STARTINDEX] > 0 &&
                self.getStartItemIndex() == 0) {
                self._startIndex = event[TableDataSourceAdapter._STARTINDEX];
            }
            // dispatch a refresh event which will trigger a the component to
            // do a fetchFirst. However, the fact that we are receiving a request
            // event means that a fetch was already done on the underlying TableDataSource.
            // So we don't need to do another fetch once a fetchFirst comes in, we can
            // just resolve with the results from the paired sync event.
            self._requestEventTriggered = true;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    }
    _handleError(event) {
        let self = this;
        if (self._fetchRejectFunc) {
            self._fetchRejectFunc(event);
        }
        self._isFetching = false;
        self._requestEventTriggered = false;
    }
    _handlePage(event) {
        let self = this;
        self._isFetching = false;
        self._requestEventTriggered = false;
        let options = {};
        options['detail'] = event;
        self.dispatchEvent(new oj.GenericEvent(oj.PagingModel.EventType['PAGE'], options));
    }
    /**
     * Add event listeners to TableDataSource
     */
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
    /**
     * Remove event listeners to TableDataSource
     */
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
    /**
     * Check if it's a PagingModel TableDataSource
     */
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
oj.EventTargetMixin.applyMixin(TableDataSourceAdapter);
oj['TableDataSourceAdapter'] = TableDataSourceAdapter;
oj.TableDataSourceAdapter = TableDataSourceAdapter;

});