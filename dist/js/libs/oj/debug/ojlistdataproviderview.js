/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $)
{
var ListDataProviderView = (function () {
    function ListDataProviderView(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this._KEY = 'key';
        this._KEYS = 'keys';
        this._DATA = 'data';
        this._SORT = 'sort';
        this._SORTCRITERIA = 'sortCriteria';
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
        this._UNMAPSORTCRITERIA = 'mapSortCriteria';
        this._RESULTS = 'results';
        this._CONTAINSPARAMETERS = 'containsParameters';
        this._DEFAULT_SIZE = 25;
        this._CONTAINSKEYS = 'containsKeys';
        this._FETCHBYKEYS = 'fetchByKeys';
        this._FETCHBYOFFSET = 'fetchByOffset';
        this._FETCHFIRST = 'fetchFirst';
        this._ADDEVENTLISTENER = 'addEventListener';
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
            }
            class_2.prototype['next'] = function () {
                var result = this._nextFunc(this._params);
                return Promise.resolve(result);
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
        this.FetchListResult = (function () {
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
        this.Item = (function () {
            function class_5(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
            }
            return class_5;
        }());
        this.ItemMetadata = (function () {
            function class_6(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[_parent._KEY] = key;
            }
            return class_6;
        }());
        this.FetchListParameters = (function () {
            function class_7(_parent, size, sortCriteria) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
            }
            return class_7;
        }());
        this.FetchByOffsetParameters = (function () {
            function class_8(_parent, offset, size, sortCriteria) {
                this._parent = _parent;
                this.offset = offset;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
                this[_parent._OFFSET] = offset;
            }
            return class_8;
        }());
        this.FetchByKeysResults = (function () {
            function class_9(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
            }
            return class_9;
        }());
        this.ContainsKeysResults = (function () {
            function class_10(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[_parent._CONTAINSPARAMETERS] = containsParameters;
                this[_parent._RESULTS] = results;
            }
            return class_10;
        }());
        this[this._FROM] = this.options == null ? null : this.options[this._FROM];
        this[this._OFFSET] = this.options == null ? 0 : this.options[this._OFFSET] > 0 ? this.options[this._OFFSET] : 0;
        this[this._SORTCRITERIA] = this.options == null ? null : this.options[this._SORTCRITERIA];
        this[this._DATAMAPPING] = this.options == null ? null : this.options[this._DATAMAPPING];
        this._addEventListeners(dataProvider);
        this._cachedData = {};
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
        if (this.dataProvider[self._FETCHBYKEYS]) {
            return this.dataProvider[self._FETCHBYKEYS](params).then(function (value) {
                var resultMap = value[self._RESULTS];
                var mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    var mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, params, mappedResultMap);
            });
        }
        else {
            var options = {};
            options[this._SIZE] = this._DEFAULT_SIZE;
            var resultMap = new Map();
            var dataProviderAsyncIterator = this.dataProvider[self._FETCHFIRST](options)[Symbol.asyncIterator]();
            return this._fetchNextSet(params, dataProviderAsyncIterator, resultMap).then(function (resultMap) {
                var mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    var mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, params, mappedResultMap);
            });
        }
    };
    ListDataProviderView.prototype.fetchFirst = function (params) {
        this._cachedData[this._DATA] = [];
        this._cachedData[this._KEYS] = [];
        this._startIndex = 0;
        var size = params != null ? params[this._SIZE] : null;
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        if (sortCriteria == null) {
            sortCriteria = this[this._SORTCRITERIA];
        }
        var mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
        var self = this;
        if (self[this._FROM] == null &&
            self[this._OFFSET] > 0 &&
            oj.DataProviderFeatureChecker.isFetchByOffset(self.dataProvider)) {
            var offset_1 = self[this._OFFSET];
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function () {
                var updatedParams = new self.FetchByOffsetParameters(self, offset_1, size, mappedSortCriteria);
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
                    self._cacheResult(mappedResult[self._DATA], mappedResult[self._KEYS]);
                    self._cachedDone = result[self._DONE];
                    var resultFetchParams = result[self._FETCHPARAMETERS];
                    var resultSortCriteria = resultFetchParams != null ? resultFetchParams[self._SORTCRITERIA] : null;
                    var mappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                    var resultParams = new self.FetchByOffsetParameters(self, self[self._OFFSET], size, mappedResultSortCriteria);
                    return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, resultParams, mappedResult[self._DATA], mappedResult[self._METADATA]), self._cachedDone));
                });
            }, params));
        }
        else {
            var updatedParams = new this.FetchListParameters(this, size, mappedSortCriteria);
            this._cachedAsyncIterator = this.dataProvider[self._FETCHFIRST](updatedParams)[Symbol.asyncIterator]();
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function () {
                return self._cachedAsyncIterator.next().then(function (result) {
                    var data = result[self._VALUE][self._DATA];
                    var metadata = result[self._VALUE][self._METADATA];
                    var keys = metadata.map(function (value) {
                        return value[self._KEY];
                    });
                    var items = data.map(function (value, index) {
                        return new self.Item(self, metadata[index], data[index]);
                    });
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(mappedResult[self._DATA], mappedResult[self._KEYS]);
                    self._cachedDone = result[self._DONE];
                    var size = params != null ? params[self._SIZE] : null;
                    var offset = params != null ? params[self._OFFSET] : null;
                    var resultFetchParams = result[self._VALUE][self._FETCHPARAMETERS];
                    var resultSortCriteria = resultFetchParams != null ? resultFetchParams[self._SORTCRITERIA] : null;
                    var mappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                    var resultParams = new self.FetchListParameters(self, size, mappedResultSortCriteria);
                    return self._fetchUntilKey(resultParams, self[self._FROM]).then(function () {
                        return self._fetchUntilOffset(resultParams, self[self._OFFSET] + self._startIndex, data.length);
                    });
                });
            }, params));
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
                        if (key == findKey) {
                            resultMap.set(key, new self.Item(self, metadata[index], data[index]));
                        }
                    });
                }
                if (!resultMap.has(findKey)) {
                    foundAllKeys = false;
                }
            });
            if (!foundAllKeys) {
                return self._fetchNextSet(params, dataProviderAsyncIterator, resultMap);
            }
            else {
                return resultMap;
            }
        });
    };
    ListDataProviderView.prototype._fetchUntilKey = function (params, key) {
        var self = this;
        if (key != null) {
            var resultKeys = this._cachedData[this._KEYS].filter(function (resultKey) {
                if (key == resultKey) {
                    return true;
                }
            });
            if (resultKeys.length > 0) {
                var keyIndex = this._cachedData[this._KEYS].indexOf(resultKeys[0]);
                this._cachedData[this._KEYS] = this._cachedData[this._KEYS].slice(keyIndex, this._cachedData[this._KEYS].length);
                this._cachedData[this._DATA] = this._cachedData[this._DATA].slice(keyIndex, this._cachedData[this._DATA].length);
            }
            else if (!self._cachedDone) {
                return self._cachedAsyncIterator.next().then(function (nextResult) {
                    var data = nextResult[self._VALUE][self._DATA];
                    var keys = nextResult[self._VALUE][self._METADATA].map(function (value) {
                        return value[self._KEY];
                    });
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(mappedResult[self._DATA], mappedResult[self._KEYS]);
                    self._cachedDone = nextResult[self._DONE];
                    return self._fetchUntilKey(nextResult[self._FETCHPARAMETERS], mappedResult[self._KEYS]);
                });
            }
            else {
                this._cachedData[this._DATA] = [];
                this._cachedData[this._KEYS] = [];
            }
        }
        return Promise.resolve(null);
    };
    ListDataProviderView.prototype._fetchUntilOffset = function (params, offset, resultSize) {
        var self = this;
        var fetchSize = params != null ? params[this._SIZE] > 0 ? params[this._SIZE] : resultSize : resultSize;
        offset = offset > 0 ? offset : 0;
        var keys = this._cachedData[this._KEYS].slice(offset, offset + fetchSize);
        var data = this._cachedData[this._DATA].slice(offset, offset + fetchSize);
        var metadata = keys.map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        if (data.length < fetchSize) {
            if (!self._cachedDone) {
                return self._cachedAsyncIterator.next().then(function (nextResult) {
                    var data = nextResult[self._VALUE][self._DATA];
                    var keys = nextResult[self._VALUE][self._METADATA].map(function (value) {
                        return value[self._KEY];
                    });
                    var mappedResult = self._getMappedDataAndKeys(keys, data);
                    self._cacheResult(mappedResult[self._DATA], mappedResult[self._KEYS]);
                    self._cachedDone = nextResult[self._DONE];
                    return self._fetchUntilOffset(nextResult[self._VALUE][self._FETCHPARAMETERS], offset, data.length);
                });
            }
            else {
                self._startIndex = self._startIndex + data.length;
                return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, data, metadata), true));
            }
        }
        else {
            self._startIndex = self._startIndex + data.length;
            return Promise.resolve(new self.AsyncIteratorResult(self, new self.FetchListResult(self, params, data, metadata), self._cachedDone));
        }
    };
    ListDataProviderView.prototype._cacheResult = function (data, keys) {
        var self = this;
        data.map(function (value) {
            self._cachedData[self._DATA].push(value);
        });
        keys.map(function (value) {
            self._cachedData[self._KEYS].push(value);
        });
    };
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
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.fetchFirst', { fetchFirst: ListDataProviderView.prototype.fetchFirst });
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.getCapability', { getCapability: ListDataProviderView.prototype.getCapability });
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.fetchByKeys', { fetchByKeys: ListDataProviderView.prototype.fetchByKeys });
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.containsKeys', { containsKeys: ListDataProviderView.prototype.containsKeys });
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.fetchByOffset', { fetchByOffset: ListDataProviderView.prototype.fetchByOffset });
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.getTotalSize', { getTotalSize: ListDataProviderView.prototype.getTotalSize });
oj.Object.exportPrototypeSymbol('ListDataProviderView.prototype.isEmpty', { isEmpty: ListDataProviderView.prototype.isEmpty });

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @export
 * @class oj.ListDataProviderView
 * @implements oj.DataProvider
 * @classdesc Provides list based optimizations for oj.DataProvider. Supports fetchFirst starting at arbitrary key or index offset, sortCriteria,
 * and field mapping. Please see the select demos for examples of DataMapping [Select]{@link oj.ojSelect}
 * @param {oj.DataProvider} dataProvider the DataProvider.
 * @param {Object=} options Options for the ListDataProviderView
 * @param {Object=} options.from key to start fetching from. This will be applied first before offset is applied.
 * @param {number=} options.offset offset to start fetching from.
 * @param {Array.<oj.SortCriterion>=} options.sortCriteria {@link oj.sortCriteria} to apply to the data.
 * @param {oj.DataMapping=} options.dataMapping mapping to apply to the data.
 */

/**
 * Check if there are rows containing the specified keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * Fetch rows by keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * Fetch rows by offset
 *
 * @ojstatus preview
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * Fetch the first block of data.
 * 
 * @ojstatus preview
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * Determines whether this DataProvider supports certain feature.
 * 
 * @ojstatus preview
 * @param {string} capabilityName capability name. Supported capability names
 *                  are determined by the underlying dataprovider.
 * @return {Object} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @method
 * @name getCapability
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
 * @return {string} a string that indicates if this data provider is empty. Valid values are:
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
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name from
 * @type {any}
 */

/**
 * Optional offset to start fetching from.
 * 
 * @ojstatus preview
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
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name sortCriteria
 * @type {Array.<oj.SortCriterion>}
 */

/**
 * Optional dataMapping to apply
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name dataMapping
 * @type {oj.DataMapping}
 */

/**
 * @ojstatus preview
 * @param {string} eventType The event type to add listener to.
 * @param {EventListener} listener The event listener to add.
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @ojstatus preview
 * @param {string} eventType The event type to remove listener from.
 * @param {EventListener} listener The event listener to remove.
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @ojstatus preview
 * @param {Event} evt The event to dispatch.
 * @return {boolean} false if the event has been cancelled and true otherwise.
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * End of jsdoc
 */
});
