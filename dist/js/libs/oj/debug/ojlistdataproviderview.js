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
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
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
        this._KEY = 'key';
        this._KEYS = 'keys';
        this._DATA = 'data';
        this._STARTINDEX = 'startIndex';
        this._SORT = 'sort';
        this._SORTCRITERIA = 'sortCriteria';
        this._FILTERCRITERION = 'filterCriterion';
        this._METADATA = 'metadata';
        this._FROM = 'from';
        this._OFFSET = 'offset';
        this._REFRESH = 'refresh';
        this._MUTATE = 'mutate';
        this._SIZE = 'size';
        this._FETCHPARAMETERS = 'fetchParameters';
        this._VALUE = 'value';
        this._DONE = 'done';
        this._DATAMAPPING = 'dataMapping';
        this._MAPFIELDS = 'mapFields';
        this._MAPSORTCRITERIA = 'mapSortCriteria';
        this._MAPFILTERCRITERION = 'mapFilterCriterion';
        this._UNMAPSORTCRITERIA = 'mapSortCriteria';
        this._RESULTS = 'results';
        this._CONTAINSPARAMETERS = 'containsParameters';
        this._DEFAULT_SIZE = 25;
        this._CONTAINSKEYS = 'containsKeys';
        this._FETCHBYKEYS = 'fetchByKeys';
        this._FETCHBYOFFSET = 'fetchByOffset';
        this._FETCHFIRST = 'fetchFirst';
        this._ADDEVENTLISTENER = 'addEventListener';
        this._FETCHATTRIBUTES = 'attributes';
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
                this[_parent._VALUE] = value;
                this[_parent._DONE] = done;
            }
            return class_3;
        }());
        this.FetchListResult = /** @class */ (function () {
            function class_4(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._DATA] = data;
                this[_parent._METADATA] = metadata;
            }
            return class_4;
        }());
        this.Item = /** @class */ (function () {
            function class_5(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
            }
            return class_5;
        }());
        this.ItemMetadata = /** @class */ (function () {
            function class_6(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[_parent._KEY] = key;
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
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
                this[_parent._FILTERCRITERION] = filterCriterion;
                this[_parent._FETCHATTRIBUTES] = attributes;
            }
            return class_7;
        }());
        this.FetchByKeysParameters = /** @class */ (function () {
            function class_8(_parent, keys, attributes) {
                this._parent = _parent;
                this.keys = keys;
                this.attributes = attributes;
                this[_parent._KEYS] = keys;
                this[_parent._FETCHATTRIBUTES] = attributes;
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
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
                this[_parent._OFFSET] = offset;
                this[_parent._FILTERCRITERION] = filterCriterion;
                this[_parent._FETCHATTRIBUTES] = attributes;
            }
            return class_9;
        }());
        this.FetchByKeysResults = /** @class */ (function () {
            function class_10(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
            }
            return class_10;
        }());
        this.ContainsKeysResults = /** @class */ (function () {
            function class_11(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[_parent._CONTAINSPARAMETERS] = containsParameters;
                this[_parent._RESULTS] = results;
            }
            return class_11;
        }());
        this[this._FROM] = this.options == null ? null : this.options[this._FROM];
        this[this._OFFSET] = this.options == null ? 0 : this.options[this._OFFSET] > 0 ? this.options[this._OFFSET] : 0;
        this[this._SORTCRITERIA] = this.options == null ? null : this.options[this._SORTCRITERIA];
        this[this._DATAMAPPING] = this.options == null ? null : this.options[this._DATAMAPPING];
        this[this._FETCHATTRIBUTES] = this.options == null ? null : this.options[this._FETCHATTRIBUTES];
        this._addEventListeners(dataProvider);
    }
    ListDataProviderView.prototype.containsKeys = function (params) {
        var self = this;
        if (this.dataProvider[self._CONTAINSKEYS]) {
            return this.dataProvider[self._CONTAINSKEYS](params);
        }
        else {
            return this.fetchByKeys(params).then(function (fetchByKeysResult) {
                var results = new Set();
                params[self._KEYS].forEach(function (key) {
                    if (fetchByKeysResult[self._RESULTS].get(key) != null) {
                        results.add(key);
                    }
                });
                return Promise.resolve(new self.ContainsKeysResults(self, params, results));
            });
        }
    };
    ListDataProviderView.prototype.fetchByKeys = function (params) {
        var self = this;
        var keys = params != null ? params[this._KEYS] : null;
        var fetchAttributes = params != null ? params[this._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[this._FETCHATTRIBUTES];
        }
        var updatedParams = new self.FetchByKeysParameters(self, keys, fetchAttributes);
        if (this.dataProvider[self._FETCHBYKEYS]) {
            return this.dataProvider[self._FETCHBYKEYS](updatedParams).then(function (value) {
                var resultMap = value[self._RESULTS];
                var mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    var mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
            });
        }
        else {
            var options = new this.FetchListParameters(this, this._DEFAULT_SIZE, null, null, fetchAttributes);
            var resultMap = new Map();
            var dataProviderAsyncIterator = this.dataProvider[self._FETCHFIRST](options)[Symbol.asyncIterator]();
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
    ListDataProviderView.prototype.fetchFirst = function (params) {
        // this fetchFirst applies the offset and from properties on the this.
        // If fetchByOffset is supported by the underlying dataprovider then that is used for offset.
        // Otherwise, fetches are made in chunks until from and offset are fulfilled.
        var cachedData = {};
        cachedData[this._DATA] = [];
        cachedData[this._KEYS] = [];
        cachedData[this._DONE] = false;
        cachedData[this._STARTINDEX] = 0;
        var size = params != null ? params[this._SIZE] : null;
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        if (sortCriteria == null) {
            sortCriteria = this[this._SORTCRITERIA];
        }
        var mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
        var filterCriterion = params != null ? params[this._FILTERCRITERION] : null;
        var mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
        var fetchAttributes = params != null ? params[this._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[this._FETCHATTRIBUTES];
        }
        var self = this;
        if (self[this._FROM] == null &&
            self[this._OFFSET] > 0) {
            var offset_1 = self[this._OFFSET];
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData) {
                return function () {
                    var updatedParams = new self.FetchByOffsetParameters(self, offset_1, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
                    return self.dataProvider[self._FETCHBYOFFSET](updatedParams).then(function (result) {
                        var results = result['results'];
                        var data = results.map(function (value) {
                            return value[self._DATA];
                        });
                        var metadata = results.map(function (value) {
                            return value[self._METADATA];
                        });
                        var keys = results.map(function (value) {
                            return value[self._METADATA][self._KEY];
                        });
                        offset_1 = offset_1 + keys.length;
                        var mappedResult = self._getMappedDataAndKeys(keys, data);
                        self._cacheResult(cachedData, mappedResult[self._DATA], mappedResult[self._KEYS]);
                        cachedData[self._DONE] = result[self._DONE];
                        var resultFetchParams = result[self._FETCHPARAMETERS];
                        var resultSortCriteria = resultFetchParams != null ? resultFetchParams[self._SORTCRITERIA] : null;
                        var mappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                        var resultParams = new self.FetchByOffsetParameters(self, self[self._OFFSET], size, mappedResultSortCriteria);
                        // if the dataprovider supports fetchByOffset then we use that to do an offset based fetch
                        return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, resultParams, mappedResult[self._DATA], mappedResult[self._METADATA]), cachedData[self._DONE]));
                    });
                };
            }(cachedData), params));
        }
        else {
            var updatedParams = new this.FetchListParameters(this, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
            var cachedAsyncIterator = this.dataProvider[self._FETCHFIRST](updatedParams)[Symbol.asyncIterator]();
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData, cachedAsyncIterator) {
                return function () {
                    return cachedAsyncIterator.next().then(function (result) {
                        var data = result[self._VALUE][self._DATA];
                        var metadata = result[self._VALUE][self._METADATA];
                        var keys = metadata.map(function (value) {
                            return value[self._KEY];
                        });
                        var items = data.map(function (value, index) {
                            return new self.Item(self, metadata[index], data[index]);
                        });
                        // apply any mapping defined in the DataMapping parameter
                        var mappedResult = self._getMappedDataAndKeys(keys, data);
                        self._cacheResult(cachedData, mappedResult[self._DATA], mappedResult[self._KEYS]);
                        cachedData[self._DONE] = result[self._DONE];
                        var size = params != null ? params[self._SIZE] : null;
                        var offset = params != null ? params[self._OFFSET] : null;
                        var resultFetchParams = result[self._VALUE][self._FETCHPARAMETERS];
                        var resultSortCriteria = resultFetchParams != null ? resultFetchParams[self._SORTCRITERIA] : null;
                        var mappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                        var resultParams = new self.FetchListParameters(self, size, mappedResultSortCriteria);
                        return self._fetchUntilKey(resultParams, self[self._FROM], cachedData, cachedAsyncIterator).then(function () {
                            return self._fetchUntilOffset(resultParams, self[self._OFFSET] + cachedData[self._STARTINDEX], data.length, cachedData, cachedAsyncIterator);
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
            var value = result[self._VALUE];
            var data = value[self._DATA];
            var metadata = value[self._METADATA];
            var keys = metadata.map(function (metadata) {
                return metadata[self._KEY];
            });
            var foundAllKeys = true;
            params[self._KEYS].forEach(function (findKey) {
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
            if (!foundAllKeys && !result[self._DONE]) {
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
            var resultKeys = cachedData[this._KEYS].filter(function (resultKey) {
                if (key == resultKey) {
                    return true;
                }
            });
            if (resultKeys.length > 0) {
                // if the key is in our cache, then trim the cache so that it starts from the key
                var keyIndex = cachedData[this._KEYS].indexOf(resultKeys[0]);
                cachedData[this._KEYS] = cachedData[this._KEYS].slice(keyIndex, cachedData[this._KEYS].length);
                cachedData[this._DATA] = cachedData[this._DATA].slice(keyIndex, cachedData[this._DATA].length);
            }
            else if (!cachedData[self._DONE]) {
                // if the key is not in our cache and we are not done then fetch the next block and call _fetchUntilKey again.
                return cachedAsyncIterator.next().then(function (nextResult) {
                    var data = nextResult[self._VALUE][self._DATA];
                    var keys = nextResult[self._VALUE][self._METADATA].map(function (value) {
                        return value[self._KEY];
                    });
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(cachedData, mappedResult[self._DATA], mappedResult[self._KEYS]);
                    cachedData[self._DONE] = nextResult[self._DONE];
                    return self._fetchUntilKey(nextResult[self._FETCHPARAMETERS], mappedResult[self._KEYS], cachedData, cachedAsyncIterator);
                });
            }
            else {
                // if we are done then this means that the key is not in the entire data set
                cachedData[this._DATA] = [];
                cachedData[this._KEYS] = [];
            }
        }
        return Promise.resolve(null);
    };
    /**
     * Fetches until we fulfill the offset
     */
    ListDataProviderView.prototype._fetchUntilOffset = function (params, offset, resultSize, cachedData, cachedAsyncIterator) {
        var self = this;
        var fetchSize = params != null ? params[this._SIZE] > 0 ? params[this._SIZE] : resultSize : resultSize;
        offset = offset > 0 ? offset : 0;
        var keys = cachedData[this._KEYS].slice(offset, offset + fetchSize);
        var data = cachedData[this._DATA].slice(offset, offset + fetchSize);
        var metadata = keys.map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        if (data.length < fetchSize) {
            if (!cachedData[self._DONE]) {
                return cachedAsyncIterator.next().then(function (nextResult) {
                    var data = nextResult[self._VALUE][self._DATA];
                    var keys = nextResult[self._VALUE][self._METADATA].map(function (value) {
                        return value[self._KEY];
                    });
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(cachedData, mappedResult[self._DATA], mappedResult[self._KEYS]);
                    cachedData[self._DONE] = nextResult[self._DONE];
                    return self._fetchUntilOffset(nextResult[self._VALUE][self._FETCHPARAMETERS], offset, data.length, cachedData, cachedAsyncIterator);
                });
            }
            else {
                cachedData[this._STARTINDEX] = cachedData[this._STARTINDEX] + data.length;
                return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, data, metadata), true));
            }
        }
        else {
            cachedData[this._STARTINDEX] = cachedData[this._STARTINDEX] + data.length;
            return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, data, metadata), cachedData[self._DONE]));
        }
    };
    /**
     * Cache the data and keys
     */
    ListDataProviderView.prototype._cacheResult = function (cachedData, data, keys) {
        var self = this;
        data.map(function (value) {
            cachedData[self._DATA].push(value);
        });
        keys.map(function (value) {
            cachedData[self._KEYS].push(value);
        });
    };
    /**
     * Apply DataMapping to the items
     */
    ListDataProviderView.prototype._getMappedItems = function (items) {
        var self = this;
        if (this[this._DATAMAPPING] != null) {
            var mapFields_1 = this[this._DATAMAPPING][this._MAPFIELDS];
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
            return value[self._DATA];
        });
        var mappedKeys = mappedItems.map(function (value) {
            return value[self._METADATA][self._KEY];
        });
        var mappedMetadata = mappedItems.map(function (value) {
            return value[self._METADATA];
        });
        var result = {};
        result[this._DATA] = mappedData;
        result[this._KEYS] = mappedKeys;
        result[this._METADATA] = mappedMetadata;
        return result;
    };
    /**
     * Apply mapping to the filterCriterion
     */
    ListDataProviderView.prototype._getMappedFilterCriterion = function (filterCriterion) {
        if (this[this._DATAMAPPING] != null) {
            var mappedFilterCriterion = this[this._DATAMAPPING][this._MAPFILTERCRITERION];
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
        if (this[this._DATAMAPPING] != null) {
            var mapSortCriteria = this[this._DATAMAPPING][this._MAPSORTCRITERIA];
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
        if (this[this._DATAMAPPING] != null) {
            var unmapSortCriteria = this[this._DATAMAPPING][this._UNMAPSORTCRITERIA];
            if (unmapSortCriteria != null) {
                if (sortCriteria != null && sortCriteria.length > 0) {
                    return unmapSortCriteria(sortCriteria);
                }
            }
        }
        return sortCriteria;
    };
    /**
     * Add event listeners
     */
    ListDataProviderView.prototype._addEventListeners = function (dataprovider) {
        var self = this;
        dataprovider[self._ADDEVENTLISTENER](this._REFRESH, function (event) {
            self.dispatchEvent(event);
        });
        dataprovider[self._ADDEVENTLISTENER](this._MUTATE, function (event) {
            self.dispatchEvent(event);
        });
    };
    return ListDataProviderView;
}());
oj['ListDataProviderView'] = ListDataProviderView;
oj.ListDataProviderView = ListDataProviderView;
oj.EventTargetMixin.applyMixin(ListDataProviderView);
oj['FetchByOffsetMixin'].applyMixin(ListDataProviderView);

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
 *               for: "options.attributes"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute"]}
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