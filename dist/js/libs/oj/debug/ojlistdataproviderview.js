/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, __DataProvider)
{
  "use strict";
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
/**
 * Class which provides list based optimizations
 */
var ListDataProviderView = /** @class */ (function () {
    function ListDataProviderView(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this._noFilterSupport = false;
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
            }
            class_2.prototype['next'] = function () {
                var result = this._nextFunc(this._params);
                return Promise.resolve(result);
            };
            return class_2;
        }());
        this.AsyncIteratorResult = /** @class */ (function () {
            function class_3(_parent, value, done) {
                this._parent = _parent;
                this.value = value;
                this.done = done;
                this[ListDataProviderView._VALUE] = value;
                this[ListDataProviderView._DONE] = done;
            }
            return class_3;
        }());
        this.FetchListResult = /** @class */ (function () {
            function class_4(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                this[ListDataProviderView._DATA] = data;
                this[ListDataProviderView._METADATA] = metadata;
            }
            return class_4;
        }());
        this.Item = /** @class */ (function () {
            function class_5(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[ListDataProviderView._METADATA] = metadata;
                this[ListDataProviderView._DATA] = data;
            }
            return class_5;
        }());
        this.ItemMetadata = /** @class */ (function () {
            function class_6(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[ListDataProviderView._KEY] = key;
            }
            return class_6;
        }());
        this.FetchListParameters = /** @class */ (function () {
            function class_7(_parent, size, sortCriteria, filterCriterion, attributes) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.filterCriterion = filterCriterion;
                this.attributes = attributes;
                this[ListDataProviderView._SIZE] = size;
                this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
                this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
                this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
            }
            return class_7;
        }());
        this.FetchByKeysParameters = /** @class */ (function () {
            function class_8(_parent, keys, attributes) {
                this._parent = _parent;
                this.keys = keys;
                this.attributes = attributes;
                this[ListDataProviderView._KEYS] = keys;
                this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
            }
            return class_8;
        }());
        this.FetchByOffsetParameters = /** @class */ (function () {
            function class_9(_parent, offset, size, sortCriteria, filterCriterion, attributes) {
                this._parent = _parent;
                this.offset = offset;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.filterCriterion = filterCriterion;
                this.attributes = attributes;
                this[ListDataProviderView._SIZE] = size;
                this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
                this[ListDataProviderView._OFFSET] = offset;
                this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
                this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
            }
            return class_9;
        }());
        this.FetchByKeysResults = /** @class */ (function () {
            function class_10(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                this[ListDataProviderView._RESULTS] = results;
            }
            return class_10;
        }());
        this.ContainsKeysResults = /** @class */ (function () {
            function class_11(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[ListDataProviderView._CONTAINSPARAMETERS] = containsParameters;
                this[ListDataProviderView._RESULTS] = results;
            }
            return class_11;
        }());
        this.FetchByOffsetResults = /** @class */ (function () {
            function class_12(_parent, fetchParameters, results, done) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                this[ListDataProviderView._RESULTS] = results;
                this[ListDataProviderView._DONE] = done;
            }
            return class_12;
        }());
        this[ListDataProviderView._FROM] = this.options == null ? null : this.options[ListDataProviderView._FROM];
        this[ListDataProviderView._OFFSET] = this.options == null ? 0 : this.options[ListDataProviderView._OFFSET] > 0 ? this.options[ListDataProviderView._OFFSET] : 0;
        this[ListDataProviderView._SORTCRITERIA] = this.options == null ? null : this.options[ListDataProviderView._SORTCRITERIA];
        this[ListDataProviderView._DATAMAPPING] = this.options == null ? null : this.options[ListDataProviderView._DATAMAPPING];
        this[ListDataProviderView._FETCHATTRIBUTES] = this.options == null ? null : this.options[ListDataProviderView._FETCHATTRIBUTES];
        this[ListDataProviderView._FILTERCRITERION] = this.options == null ? null : this.options[ListDataProviderView._FILTERCRITERION];
        this._addEventListeners(dataProvider);
        if (dataProvider.getCapability && !dataProvider.getCapability('filter')) {
            this._noFilterSupport = true;
        }
    }
    ListDataProviderView.prototype.containsKeys = function (params) {
        var self = this;
        if (this.dataProvider[ListDataProviderView._CONTAINSKEYS]) {
            return this.dataProvider[ListDataProviderView._CONTAINSKEYS](params);
        }
        else {
            return this.fetchByKeys(params).then(function (fetchByKeysResult) {
                var results = new Set();
                params[ListDataProviderView._KEYS].forEach(function (key) {
                    if (fetchByKeysResult[ListDataProviderView._RESULTS].get(key) != null) {
                        results.add(key);
                    }
                });
                return Promise.resolve(new self.ContainsKeysResults(self, params, results));
            });
        }
    };
    ListDataProviderView.prototype.fetchByKeys = function (params) {
        var self = this;
        var keys = params != null ? params[ListDataProviderView._KEYS] : null;
        var fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
        }
        var updatedParams = new self.FetchByKeysParameters(self, keys, fetchAttributes);
        if (this.dataProvider[ListDataProviderView._FETCHBYKEYS]) {
            return this.dataProvider[ListDataProviderView._FETCHBYKEYS](updatedParams).then(function (value) {
                var resultMap = value[ListDataProviderView._RESULTS];
                var mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    var mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
            });
        }
        else {
            var options = new this.FetchListParameters(this, ListDataProviderView._DEFAULT_SIZE, null, null, fetchAttributes);
            var resultMap = new Map();
            var dataProviderAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](options)[Symbol.asyncIterator]();
            return this._fetchNextSet(params, dataProviderAsyncIterator, resultMap).then(function (resultMap) {
                var mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    var mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
            });
        }
    };
    ListDataProviderView.prototype.fetchByOffset = function (params) {
        var self = this;
        var offset = params != null ? params[ListDataProviderView._OFFSET] : null;
        var size = params != null ? params[ListDataProviderView._SIZE] : null;
        var fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
        }
        var sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;
        if (sortCriteria == null) {
            sortCriteria = this[ListDataProviderView._SORTCRITERIA];
        }
        var mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
        var filterCriterion = params != null ? params[ListDataProviderView._FILTERCRITERION] : null;
        var mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
        var updatedParams = new self.FetchByOffsetParameters(self, offset, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
        return this.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then(function (value) {
            var resultArray = value[ListDataProviderView._RESULTS];
            var done = value[ListDataProviderView._DONE];
            var mappedResultArray = new Array();
            resultArray.forEach(function (value) {
                var mappedItem = self._getMappedItems([value]);
                mappedResultArray.push(mappedItem[0]);
            });
            return new self.FetchByOffsetResults(self, updatedParams, mappedResultArray, done);
        });
    };
    ListDataProviderView.prototype.fetchFirst = function (params) {
        // this fetchFirst applies the offset and from properties on the this.
        // If fetchByOffset is supported by the underlying dataprovider then that is used for offset.
        // Otherwise, fetches are made in chunks until from and offset are fulfilled.
        var cachedData = {};
        cachedData[ListDataProviderView._DATA] = [];
        cachedData[ListDataProviderView._KEYS] = [];
        cachedData[ListDataProviderView._DONE] = false;
        cachedData[ListDataProviderView._STARTINDEX] = 0;
        var size = params != null ? params[ListDataProviderView._SIZE] : null;
        var sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;
        if (sortCriteria == null) {
            sortCriteria = this[ListDataProviderView._SORTCRITERIA];
        }
        var mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
        var filterCriterion = params != null ? params[ListDataProviderView._FILTERCRITERION] : null;
        if (filterCriterion == null) {
            filterCriterion = this[ListDataProviderView._FILTERCRITERION];
        }
        var mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
        var fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
        }
        var self = this;
        if (self[ListDataProviderView._FROM] == null &&
            self[ListDataProviderView._OFFSET] > 0) {
            var offset_1 = self[ListDataProviderView._OFFSET];
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData) {
                return function () {
                    var updatedParams = new self.FetchByOffsetParameters(self, offset_1, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
                    return self.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then(function (result) {
                        var results = result['results'];
                        var data = results.map(function (value) {
                            return value[ListDataProviderView._DATA];
                        });
                        var metadata = results.map(function (value) {
                            return value[ListDataProviderView._METADATA];
                        });
                        var keys = results.map(function (value) {
                            return value[ListDataProviderView._METADATA][ListDataProviderView._KEY];
                        });
                        offset_1 = offset_1 + keys.length;
                        var mappedResult = self._getMappedDataAndKeys(keys, data);
                        self._cacheResult(cachedData, mappedResult[ListDataProviderView._DATA], mappedResult[ListDataProviderView._KEYS]);
                        cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
                        var resultFetchParams = result[ListDataProviderView._FETCHPARAMETERS];
                        var resultSortCriteria = resultFetchParams != null ? resultFetchParams[ListDataProviderView._SORTCRITERIA] : null;
                        var resultFilterCriterion = resultFetchParams != null ? resultFetchParams[ListDataProviderView._FILTERCRITERION] : null;
                        var unmappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                        var unmappedResultFilterCriterion = self._getUnmappedFilterCriterion(resultFilterCriterion);
                        var resultParams = new self.FetchByOffsetParameters(self, self[ListDataProviderView._OFFSET], size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
                        // if the dataprovider supports fetchByOffset then we use that to do an offset based fetch
                        return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, resultParams, mappedResult[ListDataProviderView._DATA], mappedResult[ListDataProviderView._METADATA]), cachedData[ListDataProviderView._DONE]));
                    });
                };
            }(cachedData), params));
        }
        else {
            var updatedParams = new this.FetchListParameters(this, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
            var cachedAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](updatedParams)[Symbol.asyncIterator]();
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData, cachedAsyncIterator) {
                return function () {
                    return cachedAsyncIterator.next().then(function (result) {
                        var data = result[ListDataProviderView._VALUE][ListDataProviderView._DATA];
                        var metadata = result[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
                        var keys = metadata.map(function (value) {
                            return value[ListDataProviderView._KEY];
                        });
                        if (self._noFilterSupport) {
                            self._filterResult(mappedFilterCriterion, data, keys, metadata);
                        }
                        var items = data.map(function (value, index) {
                            return new self.Item(self, metadata[index], data[index]);
                        });
                        // apply any mapping defined in the DataMapping parameter
                        var mappedResult = self._getMappedDataAndKeys(keys, data);
                        self._cacheResult(cachedData, mappedResult[ListDataProviderView._DATA], mappedResult[ListDataProviderView._KEYS]);
                        cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
                        var size = params != null ? params[ListDataProviderView._SIZE] : null;
                        var offset = params != null ? params[ListDataProviderView._OFFSET] : null;
                        var resultFetchParams = result[ListDataProviderView._VALUE][ListDataProviderView._FETCHPARAMETERS];
                        var resultSortCriteria = resultFetchParams != null ? resultFetchParams[ListDataProviderView._SORTCRITERIA] : null;
                        var resultFilterCriterion = resultFetchParams != null ? resultFetchParams[ListDataProviderView._FILTERCRITERION] : null;
                        var unmappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                        var unmappedResultFilterCriterion = self._getUnmappedFilterCriterion(resultFilterCriterion);
                        var resultParams = new self.FetchListParameters(self, size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
                        return self._fetchUntilKey(resultParams, self[ListDataProviderView._FROM], cachedData, cachedAsyncIterator).then(function () {
                            return self._fetchUntilOffset(resultParams, self[ListDataProviderView._OFFSET] + cachedData[ListDataProviderView._STARTINDEX], data.length, cachedData, cachedAsyncIterator);
                        });
                    });
                };
            }(cachedData, cachedAsyncIterator), params));
        }
    };
    ListDataProviderView.prototype.getCapability = function (capabilityName) {
        return this.dataProvider.getCapability(capabilityName);
    };
    ListDataProviderView.prototype.getTotalSize = function () {
        return this.dataProvider.getTotalSize();
    };
    ListDataProviderView.prototype.isEmpty = function () {
        return this.dataProvider.isEmpty();
    };
    /**
     * Fetches the next block
     */
    ListDataProviderView.prototype._fetchNextSet = function (params, dataProviderAsyncIterator, resultMap) {
        var self = this;
        return dataProviderAsyncIterator.next().then(function (result) {
            var value = result[ListDataProviderView._VALUE];
            var data = value[ListDataProviderView._DATA];
            var metadata = value[ListDataProviderView._METADATA];
            var keys = metadata.map(function (metadata) {
                return metadata[ListDataProviderView._KEY];
            });
            var foundAllKeys = true;
            params[ListDataProviderView._KEYS].forEach(function (findKey) {
                if (!resultMap.has(findKey)) {
                    keys.map(function (key, index) {
                        if (oj.Object.compareValues(key, findKey)) {
                            resultMap.set(findKey, new self.Item(self, metadata[index], data[index]));
                        }
                    });
                }
                if (!resultMap.has(findKey)) {
                    foundAllKeys = false;
                }
            });
            if (!foundAllKeys && !result[ListDataProviderView._DONE]) {
                return self._fetchNextSet(params, dataProviderAsyncIterator, resultMap);
            }
            else {
                return resultMap;
            }
        });
    };
    /**
     * Fetches until we find the key
     */
    ListDataProviderView.prototype._fetchUntilKey = function (params, key, cachedData, cachedAsyncIterator) {
        var self = this;
        if (key != null) {
            // first check if the key is in our cache
            var resultKeys = cachedData[ListDataProviderView._KEYS].filter(function (resultKey) {
                if (key == resultKey) {
                    return true;
                }
            });
            if (resultKeys.length > 0) {
                // if the key is in our cache, then trim the cache so that it starts from the key
                var keyIndex = cachedData[ListDataProviderView._KEYS].indexOf(resultKeys[0]);
                cachedData[ListDataProviderView._KEYS] = cachedData[ListDataProviderView._KEYS].slice(keyIndex, cachedData[ListDataProviderView._KEYS].length);
                cachedData[ListDataProviderView._DATA] = cachedData[ListDataProviderView._DATA].slice(keyIndex, cachedData[ListDataProviderView._DATA].length);
            }
            else if (!cachedData[ListDataProviderView._DONE]) {
                // if the key is not in our cache and we are not done then fetch the next block and call _fetchUntilKey again.
                return cachedAsyncIterator.next().then(function (nextResult) {
                    var data = nextResult[ListDataProviderView._VALUE][ListDataProviderView._DATA];
                    var keys = nextResult[ListDataProviderView._VALUE][ListDataProviderView._METADATA].map(function (value) {
                        return value[ListDataProviderView._KEY];
                    });
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(cachedData, mappedResult[ListDataProviderView._DATA], mappedResult[ListDataProviderView._KEYS]);
                    cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
                    return self._fetchUntilKey(nextResult[ListDataProviderView._FETCHPARAMETERS], mappedResult[ListDataProviderView._KEYS], cachedData, cachedAsyncIterator);
                });
            }
            else {
                // if we are done then this means that the key is not in the entire data set
                cachedData[ListDataProviderView._DATA] = [];
                cachedData[ListDataProviderView._KEYS] = [];
            }
        }
        return Promise.resolve(null);
    };
    /**
     * Fetches until we fulfill the offset
     */
    ListDataProviderView.prototype._fetchUntilOffset = function (params, offset, resultSize, cachedData, cachedAsyncIterator) {
        var self = this;
        var fetchSize = params != null ? params[ListDataProviderView._SIZE] > 0 ? params[ListDataProviderView._SIZE] : resultSize : resultSize;
        offset = offset > 0 ? offset : 0;
        var keys = cachedData[ListDataProviderView._KEYS].slice(offset, offset + fetchSize);
        var data = cachedData[ListDataProviderView._DATA].slice(offset, offset + fetchSize);
        if (this._noFilterSupport) {
            var mappedFilterCriterion = this._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);
            this._filterResult(mappedFilterCriterion, data, keys, null);
        }
        var metadata = keys.map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        if (data.length < fetchSize) {
            if (!cachedData[ListDataProviderView._DONE]) {
                return cachedAsyncIterator.next().then(function (nextResult) {
                    var data = nextResult[ListDataProviderView._VALUE][ListDataProviderView._DATA];
                    var keys = nextResult[ListDataProviderView._VALUE][ListDataProviderView._METADATA].map(function (value) {
                        return value[ListDataProviderView._KEY];
                    });
                    if (self._noFilterSupport) {
                        var mappedFilterCriterion = self._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);
                        self._filterResult(mappedFilterCriterion, data, keys, null);
                    }
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(cachedData, mappedResult[ListDataProviderView._DATA], mappedResult[ListDataProviderView._KEYS]);
                    cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
                    return self._fetchUntilOffset(nextResult[ListDataProviderView._VALUE][ListDataProviderView._FETCHPARAMETERS], offset, data.length, cachedData, cachedAsyncIterator);
                });
            }
            else {
                cachedData[ListDataProviderView._STARTINDEX] = cachedData[ListDataProviderView._STARTINDEX] + data.length;
                return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, data, metadata), true));
            }
        }
        else {
            cachedData[ListDataProviderView._STARTINDEX] = cachedData[ListDataProviderView._STARTINDEX] + data.length;
            return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, data, metadata), cachedData[ListDataProviderView._DONE]));
        }
    };
    /**
     * Cache the data and keys
     */
    ListDataProviderView.prototype._cacheResult = function (cachedData, data, keys) {
        var self = this;
        data.map(function (value) {
            cachedData[ListDataProviderView._DATA].push(value);
        });
        keys.map(function (value) {
            cachedData[ListDataProviderView._KEYS].push(value);
        });
    };
    ListDataProviderView.prototype._filterResult = function (filterCriterion, data, keys, metadata) {
        var filter;
        if (filterCriterion) {
            if (!filterCriterion.filter) {
                filterCriterion = __DataProvider.FilterFactory.getFilter({ filterDef: filterCriterion });
            }
            var i = data.length - 1;
            while (i >= 0) {
                if (!filterCriterion.filter(data[i])) {
                    data.splice(i, 1);
                    if (keys) {
                        keys.splice(i, 1);
                    }
                    if (metadata) {
                        metadata.splice(i, 1);
                    }
                }
                i--;
            }
        }
    };
    /**
     * Apply DataMapping to the items
     */
    ListDataProviderView.prototype._getMappedItems = function (items) {
        var self = this;
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            var mapFields_1 = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPFIELDS];
            if (mapFields_1 != null) {
                if (items != null && items.length > 0) {
                    var mappedItems = new Array();
                    mappedItems = items.map(function (value) {
                        return mapFields_1.bind(self)(value);
                    });
                    return mappedItems;
                }
            }
        }
        return items;
    };
    /**
     * Apply DataMapping to the keys and data
     */
    ListDataProviderView.prototype._getMappedDataAndKeys = function (keys, data) {
        var self = this;
        var items = data.map(function (value, index) {
            return new self.Item(self, new self.ItemMetadata(self, keys[index]), data[index]);
        });
        var mappedItems = this._getMappedItems(items);
        var mappedData = mappedItems.map(function (value) {
            return value[ListDataProviderView._DATA];
        });
        var mappedKeys = mappedItems.map(function (value) {
            return value[ListDataProviderView._METADATA][ListDataProviderView._KEY];
        });
        var mappedMetadata = mappedItems.map(function (value) {
            return value[ListDataProviderView._METADATA];
        });
        var result = {};
        result[ListDataProviderView._DATA] = mappedData;
        result[ListDataProviderView._KEYS] = mappedKeys;
        result[ListDataProviderView._METADATA] = mappedMetadata;
        return result;
    };
    /**
     * Apply mapping to the filterCriterion
     */
    ListDataProviderView.prototype._getMappedFilterCriterion = function (filterCriterion) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            var mappedFilterCriterion = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPFILTERCRITERION];
            if (mappedFilterCriterion != null) {
                if (filterCriterion != null) {
                    return mappedFilterCriterion(filterCriterion);
                }
            }
        }
        return filterCriterion;
    };
    /**
     * Apply mapping to the sortCriteria
     */
    ListDataProviderView.prototype._getMappedSortCriteria = function (sortCriteria) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            var mapSortCriteria = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPSORTCRITERIA];
            if (mapSortCriteria != null) {
                if (sortCriteria != null && sortCriteria.length > 0) {
                    return mapSortCriteria(sortCriteria);
                }
            }
        }
        return sortCriteria;
    };
    /**
     * Unmapping the sortCriteria
     */
    ListDataProviderView.prototype._getUnmappedSortCriteria = function (sortCriteria) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            var unmapSortCriteria = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._UNMAPSORTCRITERIA];
            if (unmapSortCriteria != null) {
                if (sortCriteria != null && sortCriteria.length > 0) {
                    return unmapSortCriteria(sortCriteria);
                }
            }
        }
        return sortCriteria;
    };
    /**
     * Unmapping the FilterCriterion
     */
    ListDataProviderView.prototype._getUnmappedFilterCriterion = function (filter) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            var unmapFilterCriterion = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._UNMAPFILTERCRITERION];
            if (unmapFilterCriterion != null) {
                if (filter != null) {
                    return unmapFilterCriterion(filter);
                }
            }
        }
        return filter;
    };
    /**
     * Add event listeners
     */
    ListDataProviderView.prototype._addEventListeners = function (dataprovider) {
        var self = this;
        dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._REFRESH, function (event) {
            self.dispatchEvent(event);
        });
        dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._MUTATE, function (event) {
            self.dispatchEvent(event);
        });
    };
    ListDataProviderView._KEY = 'key';
    ListDataProviderView._KEYS = 'keys';
    ListDataProviderView._DATA = 'data';
    ListDataProviderView._STARTINDEX = 'startIndex';
    ListDataProviderView._SORT = 'sort';
    ListDataProviderView._SORTCRITERIA = 'sortCriteria';
    ListDataProviderView._FILTERCRITERION = 'filterCriterion';
    ListDataProviderView._METADATA = 'metadata';
    ListDataProviderView._FROM = 'from';
    ListDataProviderView._OFFSET = 'offset';
    ListDataProviderView._REFRESH = 'refresh';
    ListDataProviderView._MUTATE = 'mutate';
    ListDataProviderView._SIZE = 'size';
    ListDataProviderView._FETCHPARAMETERS = 'fetchParameters';
    ListDataProviderView._VALUE = 'value';
    ListDataProviderView._DONE = 'done';
    ListDataProviderView._DATAMAPPING = 'dataMapping';
    ListDataProviderView._MAPFIELDS = 'mapFields';
    ListDataProviderView._MAPSORTCRITERIA = 'mapSortCriteria';
    ListDataProviderView._MAPFILTERCRITERION = 'mapFilterCriterion';
    ListDataProviderView._UNMAPSORTCRITERIA = 'unmapSortCriteria';
    ListDataProviderView._UNMAPFILTERCRITERION = 'unmapFilterCriterion';
    ListDataProviderView._RESULTS = 'results';
    ListDataProviderView._CONTAINSPARAMETERS = 'containsParameters';
    ListDataProviderView._DEFAULT_SIZE = 25;
    ListDataProviderView._CONTAINSKEYS = 'containsKeys';
    ListDataProviderView._FETCHBYKEYS = 'fetchByKeys';
    ListDataProviderView._FETCHBYOFFSET = 'fetchByOffset';
    ListDataProviderView._FETCHFIRST = 'fetchFirst';
    ListDataProviderView._ADDEVENTLISTENER = 'addEventListener';
    ListDataProviderView._FETCHATTRIBUTES = 'attributes';
    return ListDataProviderView;
}());
oj['ListDataProviderView'] = ListDataProviderView;
oj.ListDataProviderView = ListDataProviderView;
oj.EventTargetMixin.applyMixin(ListDataProviderView);

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @class oj.ListDataProviderView
 * @ojtsmodule
 * @implements oj.DataProvider
 * @classdesc Provides list based optimizations for oj.DataProvider. Supports fetchFirst starting at arbitrary key or index offset, sortCriteria,
 * and field mapping. Please see the select demos for examples of DataMapping [Select]{@link oj.ojSelect}
 * @param {oj.DataProvider} dataProvider the DataProvider.
 * @param {Object=} options Options for the ListDataProviderView
 * @param {any=} options.from key to start fetching from. This will be applied first before offset is applied.
 * @param {number=} options.offset offset to start fetching from.
 * @param {Array.<oj.SortCriterion>=} options.sortCriteria {@link oj.sortCriteria} to apply to the data.
 * @param {oj.DataMapping=} options.dataMapping mapping to apply to the data.
 * @param {Array<string | FetchAttribute>=} options.attributes fetch attributes to apply
 * @param {oj.AttributeFilter | oj.CompoundFilter} options.filterCriterion filter criterion to apply. If the DataProvider does not support filtering then
 *        ListDataProviderView will do local filtering of the data.
 * @ojsignature [{target: "Type",
 *               value: "class ListDataProviderView<K, D, Kin, Din> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"},
 *                    {"name": "Kin", "description": "Type of input key"}, {"name": "Din", "description": "Type of input data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "Kin",
 *               for: "options.from"},
 *               {target: "Type",
 *               value: "Array<SortCriterion<D>>",
 *               for: "options.sortCriteria"},
 *               {target: "Type",
 *               value: "DataMapping<K, D, Kin, Din>",
 *               for: "options.dataMapping"},
 *               {target: "Type",
 *               value: "Array<string | FetchAttribute>",
 *               for: "options.attributes"},
 *               {target: "Type",
 *               value: "AttributeFilter<D> | CompoundFilter<D> | FilterOperator<D>",
 *               for: "options.filterCriterion"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute", "AttributeFilter", "CompoundFilter", "FilterOperator"]}
 */

/**
 * Check if there are rows containing the specified keys
 *
 * @ojstatus preview
 * @since 4.1.0
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys
 *
 * @ojstatus preview
 * @since 4.1.0
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset
 *
 * @ojstatus preview
 * @since 4.2.0
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first block of data.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @param {string} capabilityName capability name. Supported capability names
 *                  are determined by the underlying dataprovider.
 * @return {Object} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 */

/**
 * Return the total number of rows in this dataprovider
 *
 * @ojstatus preview
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 * @ojstatus preview
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Optional key to start fetching from.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name from
 * @type {any}
 * @ojsignature {target: "Type",
 *               value: "Kin"}
 */

/**
 * Optional offset to start fetching from. Should be greater than or equal to zero.
 * If a negative offset is used then it will be treated as zero.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name offset
 * @type {number}
 */

/**
 * Optional sortCriteria to apply
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name sortCriteria
 * @ojsignature {target: "Type",
 *               value: "Array<SortCriterion<D>>"}
 */

/**
 * Optional dataMapping to apply
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name dataMapping
 * @ojsignature {target: "Type",
 *               value: "DataMapping<K, D, Kin, Din>"}
 */

/**
 * Optional fetch attributes to apply
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name attributes
 * @ojsignature {target: "Type",
 *               value: "Array<string | FetchAttribute>"}
 */

/**
 * Optional filter criterion to apply
 *
 * @ojstatus preview
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name filterCriterion
 * @ojsignature {target: "Type",
 *               value: "AttributeFilter<D> | CompoundFilter<D> | FilterOperator<D>"}
 */


/**
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name addEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name removeEventListener
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name dispatchEvent
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * End of jsdoc
 */

  return ListDataProviderView;
});