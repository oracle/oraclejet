/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
var TableDataSourceAdapter = (function () {
    function TableDataSourceAdapter(tableDataSource) {
        this.tableDataSource = tableDataSource;
        this._KEY = 'key';
        this._KEYS = 'keys';
        this._AFTERKEYS = 'afterKeys';
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
        this.AsyncIterable = (function () {
            function class_1(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_1;
        }());
        this.AsyncIterator = (function () {
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
        this.AsyncIteratorResult = (function () {
            function class_3(_parent, value, done) {
                this._parent = _parent;
                this.value = value;
                this.done = done;
                this[_parent._VALUE] = value;
                this[_parent._DONE] = done;
            }
            return class_3;
        }());
        this.FetchByKeysResults = (function () {
            function class_4(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
            }
            return class_4;
        }());
        this.ContainsKeysResults = (function () {
            function class_5(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[_parent._CONTAINSPARAMETERS] = containsParameters;
                this[_parent._RESULTS] = results;
            }
            return class_5;
        }());
        this.FetchListResult = (function () {
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
        this.Item = (function () {
            function class_7(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
            }
            return class_7;
        }());
        this.ItemMetadata = (function () {
            function class_8(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[_parent._KEY] = key;
            }
            return class_8;
        }());
        this.FetchByOffsetResults = (function () {
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
        this.FetchListParameters = (function () {
            function class_10(_parent, size, sortCriteria) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
            }
            return class_10;
        }());
        this.SortCriterion = (function () {
            function class_11(_parent, attribute, direction) {
                this._parent = _parent;
                this.attribute = attribute;
                this.direction = direction;
                this[_parent._ATTRIBUTE] = attribute;
                this[_parent._DIRECTION] = direction;
            }
            return class_11;
        }());
        this.DataProviderMutationEventDetail = (function () {
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
        this.DataProviderOperationEventDetail = (function () {
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
        this.DataProviderAddOperationEventDetail = (function () {
            function class_14(_parent, keys, afterKeys, metadata, data, indexes) {
                this._parent = _parent;
                this.keys = keys;
                this.afterKeys = afterKeys;
                this.metadata = metadata;
                this.data = data;
                this.indexes = indexes;
                this[_parent._KEYS] = keys;
                this[_parent._AFTERKEYS] = afterKeys;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
                this[_parent._INDEXES] = indexes;
            }
            return class_14;
        }());
        this._addTableDataSourceEventListeners(tableDataSource);
        this[this._OFFSET] = 0;
    }
    TableDataSourceAdapter.prototype.containsKeys = function (params) {
        var self = this;
        var resultsPromiseArray = [];
        params[this._KEYS].forEach(function (key) {
            resultsPromiseArray.push(self.tableDataSource.get(key));
        });
        return Promise.all(resultsPromiseArray).then(function (resultsArray) {
            var results = new Set();
            resultsArray.map(function (value) {
                results.add(value[self._KEY]);
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
        var iteratorResults = this._getFetchFunc(fetchParams, offset);
        var value = iteratorResults[this._VALUE];
        var done = iteratorResults[this._DONE];
        var data = value[this._DATA];
        var keys = value[this._METADATA].map(function (value) {
            return value[self._KEY];
        });
        var resultsArray = data.map(function (value, index) {
            return new self.Item(self, value, keys[index]);
        });
        return Promise.resolve(new this.FetchByOffsetResults(this, params, resultsArray, done));
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
        return null;
    };
    TableDataSourceAdapter.prototype.getTotalSize = function () {
        return Promise.resolve(this.tableDataSource.totalSize());
    };
    TableDataSourceAdapter.prototype.isEmpty = function () {
        return this.tableDataSource.totalSize() > 0 ? 'no' : 'yes';
    };
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
    TableDataSourceAdapter.prototype._addTableDataSourceEventListeners = function (tableDataSource) {
        var self = this;
        tableDataSource.on('sync', function (event) {
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
        });
        tableDataSource.on('add', function (event) {
            var metadataArray = event[self._KEYS].map(function (value) {
                return new self.ItemMetadata(self, value);
            });
            var keySet = new Set();
            event[self._KEYS].map(function (key) {
                keySet.add(key);
            });
            var operationEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet, null, metadataArray, event[self._DATA], event[self._INDEXES]);
            var mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationEventDetail, null, null);
            self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
        });
        tableDataSource.on('remove', function (event) {
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
        });
        tableDataSource.on('reset', function (event) {
            if (!self._requestEventTriggered) {
                self._startIndex = 0;
                self.dispatchEvent(new oj.DataProviderRefreshEvent());
            }
        });
        tableDataSource.on(this._SORT, function (event) {
            if (!self._ignoreSortEvent) {
                self._startIndex = null;
                self.dispatchEvent(new oj.DataProviderRefreshEvent());
            }
        });
        tableDataSource.on('change', function (event) {
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
        });
        tableDataSource.on(this._REFRESH, function (event) {
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
        });
        tableDataSource.on('request', function (event) {
            if (typeof oj.Model !== "undefined" &&
                event instanceof oj.Model) {
                return;
            }
            if (!self._isFetching) {
                if (event[self._STARTINDEX] > 0 &&
                    self.getStartItemIndex() == 0) {
                    self._startIndex = event[self._STARTINDEX];
                }
                self._requestEventTriggered = true;
                self.dispatchEvent(new oj.DataProviderRefreshEvent());
            }
        });
        tableDataSource.on('error', function (event) {
            if (self._fetchRejectFunc) {
                self._fetchRejectFunc(event);
            }
            self._isFetching = false;
            self._requestEventTriggered = false;
        });
        tableDataSource.on('page', function (event) {
            self._isFetching = false;
            self._requestEventTriggered = false;
            var options = {};
            options['detail'] = event;
            self.dispatchEvent(new oj.GenericEvent(oj.PagingModel.EventType['PAGE'], options));
        });
    };
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
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.containsKeys', { containsKeys: TableDataSourceAdapter.prototype.containsKeys });
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.fetchByKeys', { fetchByKeys: TableDataSourceAdapter.prototype.fetchByKeys });
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.fetchByOffset', { fetchByOffset: TableDataSourceAdapter.prototype.fetchByOffset });
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.fetchFirst', { fetchFirst: TableDataSourceAdapter.prototype.fetchFirst });
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.getCapability', { getCapability: TableDataSourceAdapter.prototype.getCapability });
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.getTotalSize', { getTotalSize: TableDataSourceAdapter.prototype.getTotalSize });
oj.Object.exportPrototypeSymbol('TableDataSourceAdapter.prototype.isEmpty', { isEmpty: TableDataSourceAdapter.prototype.isEmpty });

});
