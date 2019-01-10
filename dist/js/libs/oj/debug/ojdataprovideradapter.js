/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var TableDataSourceAdapter = /** @class */ (function () {
    function TableDataSourceAdapter(tableDataSource) {
        this.tableDataSource = tableDataSource;
        this._KEY = 'key';
        this._KEYS = 'keys';
        this._AFTERKEYS = 'afterKeys';
        this._ADDBEFOREKEYS = 'addBeforeKeys';
        this._DIRECTION = 'direction';
        this._STARTINDEX = 'startIndex';
        this._ATTRIBUTE = 'attribute';
        this._SILENT = 'silent';
        this._SORT = 'sort';
        this._SORTCRITERIA = 'sortCriteria';
        this._PAGESIZE = 'pageSize';
        this._DATA = 'data';
        this._METADATA = 'metadata';
        this._INDEXES = 'indexes';
        this._OFFSET = 'offset';
        this._REFRESH = 'refresh';
        this._SIZE = 'size';
        this._VALUE = 'value';
        this._DONE = 'done';
        this._FETCHPARAMETERS = 'fetchParameters';
        this._CONTAINSPARAMETERS = 'containsParameters';
        this._RESULTS = 'results';
        this._ADD = 'add';
        this._REMOVE = 'remove';
        this._UPDATE = 'update';
        this._FETCHTYPE = 'fetchType';
        this.AsyncIterable = /** @class */ (function () {
            function class_1(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_1;
        }());
        this.AsyncIterator = /** @class */ (function () {
            function class_2(_parent, _nextFunc, _params) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._fetchFirst = true;
            }
            class_2.prototype['next'] = function () {
                var fetchFirst = this._fetchFirst;
                this._fetchFirst = false;
                return this._nextFunc(this._params, fetchFirst);
            };
            return class_2;
        }());
        this.AsyncIteratorResult = /** @class */ (function () {
            function class_3(_parent, value, done) {
                this._parent = _parent;
                this.value = value;
                this.done = done;
                this[_parent._VALUE] = value;
                this[_parent._DONE] = done;
            }
            return class_3;
        }());
        this.FetchByKeysResults = /** @class */ (function () {
            function class_4(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
            }
            return class_4;
        }());
        this.ContainsKeysResults = /** @class */ (function () {
            function class_5(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[_parent._CONTAINSPARAMETERS] = containsParameters;
                this[_parent._RESULTS] = results;
            }
            return class_5;
        }());
        this.FetchListResult = /** @class */ (function () {
            function class_6(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._DATA] = data;
                this[_parent._METADATA] = metadata;
            }
            return class_6;
        }());
        this.Item = /** @class */ (function () {
            function class_7(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
            }
            return class_7;
        }());
        this.ItemMetadata = /** @class */ (function () {
            function class_8(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[_parent._KEY] = key;
            }
            return class_8;
        }());
        this.FetchByOffsetResults = /** @class */ (function () {
            function class_9(_parent, fetchParameters, results, done) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
                this[_parent._DONE] = done;
            }
            return class_9;
        }());
        this.FetchListParameters = /** @class */ (function () {
            function class_10(_parent, size, sortCriteria) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
            }
            return class_10;
        }());
        this.SortCriterion = /** @class */ (function () {
            function class_11(_parent, attribute, direction) {
                this._parent = _parent;
                this.attribute = attribute;
                this.direction = direction;
                this[_parent._ATTRIBUTE] = attribute;
                this[_parent._DIRECTION] = direction;
            }
            return class_11;
        }());
        this.DataProviderMutationEventDetail = /** @class */ (function () {
            function class_12(_parent, add, remove, update) {
                this._parent = _parent;
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[_parent._ADD] = add;
                this[_parent._REMOVE] = remove;
                this[_parent._UPDATE] = update;
            }
            return class_12;
        }());
        this.DataProviderOperationEventDetail = /** @class */ (function () {
            function class_13(_parent, keys, metadata, data, indexes) {
                this._parent = _parent;
                this.keys = keys;
                this.metadata = metadata;
                this.data = data;
                this.indexes = indexes;
                this[_parent._KEYS] = keys;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
                this[_parent._INDEXES] = indexes;
            }
            return class_13;
        }());
        this.DataProviderAddOperationEventDetail = /** @class */ (function () {
            function class_14(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
                this._parent = _parent;
                this.keys = keys;
                this.afterKeys = afterKeys;
                this.addBeforeKeys = addBeforeKeys;
                this.metadata = metadata;
                this.data = data;
                this.indexes = indexes;
                this[_parent._KEYS] = keys;
                this[_parent._AFTERKEYS] = afterKeys;
                this[_parent._ADDBEFOREKEYS] = addBeforeKeys;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
                this[_parent._INDEXES] = indexes;
            }
            return class_14;
        }());
        this._addTableDataSourceEventListeners();
        this[this._OFFSET] = 0;
    }
    TableDataSourceAdapter.prototype.destroy = function () {
        this._removeTableDataSourceEventListeners();
    };
    TableDataSourceAdapter.prototype.containsKeys = function (params) {
        var self = this;
        var resultsPromiseArray = [];
        params[this._KEYS].forEach(function (key) {
            resultsPromiseArray.push(self.tableDataSource.get(key));
        });
        return Promise.all(resultsPromiseArray).then(function (resultsArray) {
            var results = new Set();
            resultsArray.map(function (value) {
                if (value != null) {
                    results.add(value[self._KEY]);
                }
            });
            return Promise.resolve(new self.ContainsKeysResults(self, params, results));
        });
    };
    TableDataSourceAdapter.prototype.fetchByKeys = function (params) {
        var self = this;
        var resultsPromiseArray = [];
        params[this._KEYS].forEach(function (key) {
            resultsPromiseArray.push(self.tableDataSource.get(key));
        });
        return Promise.all(resultsPromiseArray).then(function (resultsArray) {
            var results = new Map();
            resultsArray.map(function (value) {
                var key = value[self._KEY];
                var data = value[self._DATA];
                results.set(key, new self.Item(self, new self.ItemMetadata(self, key), data));
            });
            return Promise.resolve(new self.FetchByKeysResults(self, params, results));
        });
    };
    TableDataSourceAdapter.prototype.fetchByOffset = function (params) {
        var self = this;
        var size = params != null ? params[this._SIZE] : -1;
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        var offset = params != null ? params[this._OFFSET] > 0 ? params[this._OFFSET] : 0 : 0;
        var fetchParams = new this.FetchListParameters(this, size, sortCriteria);
        this._startIndex = 0;
        return this._getFetchFunc(fetchParams, offset)(fetchParams, true).then(function (iteratorResults) {
            var value = iteratorResults[self._VALUE];
            var done = iteratorResults[self._DONE];
            var data = value[self._DATA];
            var keys = value[self._METADATA].map(function (value) {
                return value[self._KEY];
            });
            var resultsArray = new Array();
            data.map(function (value, index) {
                resultsArray.push(new self.Item(self, new self.ItemMetadata(self, keys[index]), data[index]));
            });
            return new self.FetchByOffsetResults(self, params, resultsArray, done);
        });
    };
    TableDataSourceAdapter.prototype.fetchFirst = function (params) {
        if (!this._isPagingModelTableDataSource()) {
            this._startIndex = 0;
        }
        return new this.AsyncIterable(this, new this.AsyncIterator(this, this._getFetchFunc(params), params));
    };
    TableDataSourceAdapter.prototype.getCapability = function (capabilityName) {
        if (capabilityName == this._SORT &&
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
    };
    TableDataSourceAdapter.prototype.getTotalSize = function () {
        return Promise.resolve(this.tableDataSource.totalSize());
    };
    TableDataSourceAdapter.prototype.isEmpty = function () {
        return this.tableDataSource.totalSize() > 0 ? 'no' : 'yes';
    };
    // Start PagingModel APIs
    TableDataSourceAdapter.prototype.getPage = function () {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.getPage();
        }
        return -1;
    };
    TableDataSourceAdapter.prototype.setPage = function (value, options) {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.setPage(value, options);
        }
        return Promise.reject(null);
    };
    TableDataSourceAdapter.prototype.getStartItemIndex = function () {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.getStartItemIndex();
        }
        return -1;
    };
    TableDataSourceAdapter.prototype.getEndItemIndex = function () {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.getEndItemIndex();
        }
        return -1;
    };
    TableDataSourceAdapter.prototype.getPageCount = function () {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.getPageCount();
        }
        return -1;
    };
    TableDataSourceAdapter.prototype.totalSize = function () {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.totalSize();
        }
        return -1;
    };
    TableDataSourceAdapter.prototype.totalSizeConfidence = function () {
        if (this._isPagingModelTableDataSource()) {
            return this.tableDataSource.totalSizeConfidence();
        }
        return null;
    };
    // End PagingModel APIs
    /**
     * Get the function which performs the fetch
     */
    TableDataSourceAdapter.prototype._getFetchFunc = function (params, offset) {
        var self = this;
        if (params != null &&
            params[this._SORTCRITERIA] != null) {
            var attribute = params[this._SORTCRITERIA][0][this._ATTRIBUTE];
            var direction = params[this._SORTCRITERIA][0][this._DIRECTION];
            this._ignoreSortEvent = true;
            if (!this._isPagingModelTableDataSource()) {
                this._startIndex = 0;
            }
            return function (attribute, direction) {
                return function (params, fetchFirst) {
                    if (fetchFirst) {
                        var sortParam = {};
                        sortParam[self._KEY] = attribute;
                        sortParam[self._DIRECTION] = direction;
                        self[self._OFFSET] = 0;
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
    };
    /**
     * Get the function which invokes fetch() on TableDataSource
     */
    TableDataSourceAdapter.prototype._getTableDataSourceFetch = function (params, offset) {
        var self = this;
        return function (params, fetchFirst) {
            var options = {};
            offset = offset > 0 ? offset : 0;
            if (self._startIndex != null) {
                options[self._STARTINDEX] = self._startIndex + offset;
            }
            options[self._PAGESIZE] = params != null && params[self._SIZE] > 0 ? params[self._SIZE] : null;
            if (!self._isPagingModelTableDataSource()) {
                options[self._SILENT] = true;
            }
            if (self.tableDataSource[self._SORTCRITERIA] != null && params[self._SORTCRITERIA] == null) {
                params[self._SORTCRITERIA] = [];
                var sortCriterion = new self.SortCriterion(self, self.tableDataSource[self._SORTCRITERIA][self._KEY], self.tableDataSource[self._SORTCRITERIA][self._DIRECTION]);
                params[self._SORTCRITERIA].push(sortCriterion);
            }
            options[self._FETCHTYPE] = params[self._FETCHTYPE];
            self._isFetching = true;
            return new Promise(function (resolve, reject) {
                self._fetchResolveFunc = resolve;
                self._fetchRejectFunc = reject;
                self._fetchParams = params;
                if (!self._requestEventTriggered) {
                    self.tableDataSource.fetch(options).then(function (result) {
                        if (result !== null) {
                            self._isFetching = false;
                            if (result === undefined) {
                                // fetch was not executed due to startFetch='disabled'
                                result = {};
                                result[self._KEYS] = [];
                                result[self._DATA] = [];
                            }
                            var resultMetadata = [];
                            if (result[self._KEYS] != null) {
                                resultMetadata = result[self._KEYS].map(function (value) {
                                    return new self.ItemMetadata(self, value);
                                });
                            }
                            if (self._startIndex == null) {
                                self._startIndex = 0;
                            }
                            var done = false;
                            self._startIndex = self._startIndex + result[self._DATA].length;
                            if (self.tableDataSource.totalSizeConfidence() == 'actual' &&
                                self.tableDataSource.totalSize() > 0 &&
                                self._startIndex >= self.tableDataSource.totalSize()) {
                                done = true;
                            }
                            else if (options[self._PAGESIZE] > 0 &&
                                result[self._DATA].length < options[self._PAGESIZE]) {
                                done = true;
                            }
                            else if (result[self._DATA].length == 0) {
                                done = true;
                            }
                            self._fetchResolveFunc = null;
                            self._fetchParams = null;
                            resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, result[self._DATA], resultMetadata), done));
                        }
                    }, function (error) {
                        reject(error);
                    });
                }
            });
        };
    };
    TableDataSourceAdapter.prototype._handleSync = function (event) {
        var self = this;
        self._startIndex = null;
        if (event[self._STARTINDEX] > 0) {
            self._startIndex = event[self._STARTINDEX];
            self[self._OFFSET] = self._startIndex;
        }
        if (self._fetchResolveFunc && event[self._KEYS] != null) {
            self._isFetching = false;
            var resultMetadata = event[self._KEYS].map(function (value) {
                return new self.ItemMetadata(self, value);
            });
            var done = false;
            if (self.tableDataSource.totalSizeConfidence() == 'actual' &&
                self.tableDataSource.totalSize() > 0 &&
                self._startIndex >= self.tableDataSource.totalSize()) {
                done = true;
            }
            self._fetchResolveFunc(new self.AsyncIteratorResult(self, new self.FetchListResult(self, self._fetchParams, event[self._DATA], resultMetadata), done));
            self._fetchResolveFunc = null;
            self._fetchParams = null;
        }
        else if (!self._requestEventTriggered) {
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
        self._requestEventTriggered = false;
    };
    TableDataSourceAdapter.prototype._handleAdd = function (event) {
        var self = this;
        var metadataArray = event[self._KEYS].map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        var keySet = new Set();
        event[self._KEYS].map(function (key) {
            keySet.add(key);
        });
        var operationEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet, null, null, metadataArray, event[self._DATA], event[self._INDEXES]);
        var mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationEventDetail, null, null);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    };
    TableDataSourceAdapter.prototype._handleRemove = function (event) {
        var self = this;
        var metadataArray = event[self._KEYS].map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        var keySet = new Set();
        event[self._KEYS].map(function (key) {
            keySet.add(key);
        });
        var operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[self._DATA], event[self._INDEXES]);
        var mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, operationEventDetail, null);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    };
    TableDataSourceAdapter.prototype._handleReset = function (event) {
        var self = this;
        // Dispatch a dataprovider refresh event except for the following situations:
        // 1. If a datasource request event was triggered, a dataprovider refresh event has been dispatched;
        // 2. If the datasource is a paging datasource, the pagingcontrol reset handler will indirectly trigger
        //    a datasource request event, which in turn will dispatch a dataprovider refresh event.
        //
        if (!self._requestEventTriggered && !self._isPagingModelTableDataSource()) {
            self._startIndex = 0;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    };
    TableDataSourceAdapter.prototype._handleSort = function (event) {
        var self = this;
        if (!self._ignoreSortEvent) {
            self._startIndex = null;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    };
    TableDataSourceAdapter.prototype._handleChange = function (event) {
        var self = this;
        var metadataArray = event[self._KEYS].map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        var keySet = new Set();
        event[self._KEYS].map(function (key) {
            keySet.add(key);
        });
        var operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, event[self._DATA], event[self._INDEXES]);
        var mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, null, operationEventDetail);
        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
    };
    TableDataSourceAdapter.prototype._handleRefresh = function (event) {
        var self = this;
        if (!self._isFetching &&
            !self._requestEventTriggered) {
            if (event[self._OFFSET] != null) {
                self._startIndex = event[self._OFFSET];
            }
            else {
                self._startIndex = null;
            }
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
        self._requestEventTriggered = false;
    };
    TableDataSourceAdapter.prototype._handleRequest = function (event) {
        var self = this;
        // to test backward compatibility we still need to be able to access Model from the oj namespace
        if (typeof oj.Model !== "undefined" &&
            event instanceof oj.Model) {
            // ignore request events by oj.Model. Those will be followed by row
            // mutation events anyway
            return;
        }
        if (!self._isFetching) {
            if (event[self._STARTINDEX] > 0 &&
                self.getStartItemIndex() == 0) {
                self._startIndex = event[self._STARTINDEX];
            }
            // dispatch a refresh event which will trigger a the component to
            // do a fetchFirst. However, the fact that we are receiving a request
            // event means that a fetch was already done on the underlying TableDataSource.
            // So we don't need to do another fetch once a fetchFirst comes in, we can
            // just resolve with the results from the paired sync event.
            self._requestEventTriggered = true;
            self.dispatchEvent(new oj.DataProviderRefreshEvent());
        }
    };
    TableDataSourceAdapter.prototype._handleError = function (event) {
        var self = this;
        if (self._fetchRejectFunc) {
            self._fetchRejectFunc(event);
        }
        self._isFetching = false;
        self._requestEventTriggered = false;
    };
    TableDataSourceAdapter.prototype._handlePage = function (event) {
        var self = this;
        self._isFetching = false;
        self._requestEventTriggered = false;
        var options = {};
        options['detail'] = event;
        self.dispatchEvent(new oj.GenericEvent(oj.PagingModel.EventType['PAGE'], options));
    };
    TableDataSourceAdapter.prototype._addListener = function (eventType, eventHandler) {
        this._eventHandlerFuncs[eventType] = eventHandler.bind(this);
        this.tableDataSource.on(eventType, this._eventHandlerFuncs[eventType]);
    };
    TableDataSourceAdapter.prototype._removeListener = function (eventType) {
        this.tableDataSource.off(eventType, this._eventHandlerFuncs[eventType]);
    };
    /**
     * Add event listeners to TableDataSource
     */
    TableDataSourceAdapter.prototype._addTableDataSourceEventListeners = function () {
        this._eventHandlerFuncs = {};
        this._addListener('sync', this._handleSync);
        this._addListener('add', this._handleAdd);
        this._addListener('remove', this._handleRemove);
        this._addListener('reset', this._handleReset);
        this._addListener('sort', this._handleSort);
        this._addListener('change', this._handleChange);
        this._addListener('refresh', this._handleRefresh);
        this._addListener('request', this._handleRequest);
        this._addListener('error', this._handleError);
        this._addListener('page', this._handlePage);
    };
    /**
     * Remove event listeners to TableDataSource
     */
    TableDataSourceAdapter.prototype._removeTableDataSourceEventListeners = function () {
        this._removeListener('sync');
        this._removeListener('add');
        this._removeListener('remove');
        this._removeListener('reset');
        this._removeListener('sort');
        this._removeListener('change');
        this._removeListener('refresh');
        this._removeListener('request');
        this._removeListener('error');
        this._removeListener('page');
    };
    /**
     * Check if it's a PagingModel TableDataSource
     */
    TableDataSourceAdapter.prototype._isPagingModelTableDataSource = function () {
        if (this.tableDataSource['getStartItemIndex'] != null) {
            return true;
        }
        return false;
    };
    return TableDataSourceAdapter;
}());
oj.EventTargetMixin.applyMixin(TableDataSourceAdapter);
oj['TableDataSourceAdapter'] = TableDataSourceAdapter;
oj.TableDataSourceAdapter = TableDataSourceAdapter;

});