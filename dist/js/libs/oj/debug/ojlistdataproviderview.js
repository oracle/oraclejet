/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, __DataProvider)
{
  "use strict";

/**
 * Class which provides list based optimizations
 */
class ListDataProviderView {
    constructor(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this._noFilterSupport = false;
        this.AsyncIterable = class {
            constructor(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
        };
        this.AsyncIterator = class {
            constructor(_parent, _nextFunc, _params) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._params = _params;
            }
            ['next']() {
                let result = this._nextFunc(this._params);
                return Promise.resolve(result);
            }
        };
        this.AsyncIteratorYieldResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this[ListDataProviderView._VALUE] = value;
                this[ListDataProviderView._DONE] = false;
            }
        };
        this.AsyncIteratorReturnResult = class {
            constructor(_parent, value) {
                this._parent = _parent;
                this.value = value;
                this[ListDataProviderView._VALUE] = value;
                this[ListDataProviderView._DONE] = true;
            }
        };
        this.FetchListResult = class {
            constructor(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                this[ListDataProviderView._DATA] = data;
                this[ListDataProviderView._METADATA] = metadata;
            }
        };
        this.Item = class {
            constructor(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[ListDataProviderView._METADATA] = metadata;
                this[ListDataProviderView._DATA] = data;
            }
        };
        this.ItemMetadata = class {
            constructor(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[ListDataProviderView._KEY] = key;
            }
        };
        this.FetchListParameters = class {
            constructor(_parent, params, size, sortCriteria, filterCriterion, attributes) {
                this._parent = _parent;
                this.params = params;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.filterCriterion = filterCriterion;
                this.attributes = attributes;
                let self = this;
                if (params) {
                    Object.keys(params).forEach(function (prop) {
                        self[prop] = params[prop];
                    });
                }
                this[ListDataProviderView._SIZE] = size;
                if (sortCriteria) {
                    this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
                }
                if (filterCriterion) {
                    this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
                }
                if (attributes) {
                    this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
                }
            }
        };
        this.FetchByKeysParameters = class {
            constructor(_parent, keys, params, attributes) {
                this._parent = _parent;
                this.keys = keys;
                this.params = params;
                this.attributes = attributes;
                let self = this;
                if (params) {
                    Object.keys(params).forEach(function (prop) {
                        self[prop] = params[prop];
                    });
                }
                if (keys) {
                    this[ListDataProviderView._KEYS] = keys;
                }
                if (attributes) {
                    this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
                }
            }
        };
        this.FetchByOffsetParameters = class {
            constructor(_parent, offset, params, size, sortCriteria, filterCriterion, attributes) {
                this._parent = _parent;
                this.offset = offset;
                this.params = params;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.filterCriterion = filterCriterion;
                this.attributes = attributes;
                let self = this;
                if (params) {
                    Object.keys(params).forEach(function (prop) {
                        self[prop] = params[prop];
                    });
                }
                if (size) {
                    this[ListDataProviderView._SIZE] = size;
                }
                if (sortCriteria) {
                    this[ListDataProviderView._SORTCRITERIA] = sortCriteria;
                }
                if (offset) {
                    this[ListDataProviderView._OFFSET] = offset;
                }
                if (filterCriterion) {
                    this[ListDataProviderView._FILTERCRITERION] = filterCriterion;
                }
                if (attributes) {
                    this[ListDataProviderView._FETCHATTRIBUTES] = attributes;
                }
            }
        };
        this.FetchByKeysResults = class {
            constructor(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                this[ListDataProviderView._RESULTS] = results;
            }
        };
        this.ContainsKeysResults = class {
            constructor(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[ListDataProviderView._CONTAINSPARAMETERS] = containsParameters;
                this[ListDataProviderView._RESULTS] = results;
            }
        };
        this.FetchByOffsetResults = class {
            constructor(_parent, fetchParameters, results, done) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[ListDataProviderView._FETCHPARAMETERS] = fetchParameters;
                this[ListDataProviderView._RESULTS] = results;
                this[ListDataProviderView._DONE] = done;
            }
        };
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
    containsKeys(params) {
        let self = this;
        if (this.dataProvider[ListDataProviderView._CONTAINSKEYS]) {
            return this.dataProvider[ListDataProviderView._CONTAINSKEYS](params);
        }
        else {
            return this.fetchByKeys(params).then(function (fetchByKeysResult) {
                let results = new Set();
                params[ListDataProviderView._KEYS].forEach(function (key) {
                    if (fetchByKeysResult[ListDataProviderView._RESULTS].get(key) != null) {
                        results.add(key);
                    }
                });
                return Promise.resolve(new self.ContainsKeysResults(self, params, results));
            });
        }
    }
    fetchByKeys(params) {
        let self = this;
        let keys = params != null ? params[ListDataProviderView._KEYS] : null;
        let fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
        }
        let updatedParams = new self.FetchByKeysParameters(self, keys, params, fetchAttributes);
        if (this.dataProvider[ListDataProviderView._FETCHBYKEYS]) {
            return this.dataProvider[ListDataProviderView._FETCHBYKEYS](updatedParams).then(function (value) {
                let resultMap = value[ListDataProviderView._RESULTS];
                let mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    let mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
            });
        }
        else {
            let options = new this.FetchListParameters(this, null, ListDataProviderView._DEFAULT_SIZE, null, null, fetchAttributes);
            let resultMap = new Map();
            let dataProviderAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](options)[Symbol.asyncIterator]();
            return this._fetchNextSet(params, dataProviderAsyncIterator, resultMap).then(function (resultMap) {
                let mappedResultMap = new Map();
                resultMap.forEach(function (value, key) {
                    let mappedItem = self._getMappedItems([value]);
                    mappedResultMap.set(key, mappedItem[0]);
                });
                return new self.FetchByKeysResults(self, updatedParams, mappedResultMap);
            });
        }
    }
    fetchByOffset(params) {
        let self = this;
        let offset = params != null ? params[ListDataProviderView._OFFSET] : null;
        let size = params != null ? params[ListDataProviderView._SIZE] : null;
        let fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
        }
        let sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;
        if (sortCriteria == null) {
            sortCriteria = this[ListDataProviderView._SORTCRITERIA];
        }
        let mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
        let filterCriterion = params != null ? params[ListDataProviderView._FILTERCRITERION] : null;
        let mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
        let updatedParams = new self.FetchByOffsetParameters(self, offset, params, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
        return this.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then(function (value) {
            let resultArray = value[ListDataProviderView._RESULTS];
            let done = value[ListDataProviderView._DONE];
            let mappedResultArray = new Array();
            resultArray.forEach(function (value) {
                let mappedItem = self._getMappedItems([value]);
                mappedResultArray.push(mappedItem[0]);
            });
            return new self.FetchByOffsetResults(self, updatedParams, mappedResultArray, done);
        });
    }
    fetchFirst(params) {
        // this fetchFirst applies the offset and from properties on the this.
        // If fetchByOffset is supported by the underlying dataprovider then that is used for offset.
        // Otherwise, fetches are made in chunks until from and offset are fulfilled.
        let cachedData = {};
        cachedData[ListDataProviderView._ITEMS] = [];
        cachedData[ListDataProviderView._DONE] = false;
        cachedData[ListDataProviderView._STARTINDEX] = 0;
        let size = params != null ? params[ListDataProviderView._SIZE] : null;
        let sortCriteria = params != null ? params[ListDataProviderView._SORTCRITERIA] : null;
        if (sortCriteria == null) {
            sortCriteria = this[ListDataProviderView._SORTCRITERIA];
        }
        let mappedSortCriteria = this._getMappedSortCriteria(sortCriteria);
        let filterCriterion = params != null ? params[ListDataProviderView._FILTERCRITERION] : null;
        if (filterCriterion == null) {
            filterCriterion = this[ListDataProviderView._FILTERCRITERION];
        }
        let mappedFilterCriterion = this._getMappedFilterCriterion(filterCriterion);
        let fetchAttributes = params != null ? params[ListDataProviderView._FETCHATTRIBUTES] : null;
        if (fetchAttributes == null) {
            fetchAttributes = this[ListDataProviderView._FETCHATTRIBUTES];
        }
        let self = this;
        if (self[ListDataProviderView._FROM] == null &&
            self[ListDataProviderView._OFFSET] > 0) {
            let offset = self[ListDataProviderView._OFFSET];
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData) {
                return function () {
                    let updatedParams = new self.FetchByOffsetParameters(self, offset, null, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
                    return self.dataProvider[ListDataProviderView._FETCHBYOFFSET](updatedParams).then(function (result) {
                        var results = result['results'];
                        offset = offset + results.length;
                        let mappedResult = self._getMappedItems(results);
                        self._cacheResult(cachedData, mappedResult);
                        cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
                        var data = mappedResult.map(function (value) {
                            return value[ListDataProviderView._DATA];
                        });
                        var metadata = mappedResult.map(function (value) {
                            return value[ListDataProviderView._METADATA];
                        });
                        let resultFetchParams = result[ListDataProviderView._FETCHPARAMETERS];
                        let resultSortCriteria = resultFetchParams != null ? resultFetchParams[ListDataProviderView._SORTCRITERIA] : null;
                        let resultFilterCriterion = resultFetchParams != null ? resultFetchParams[ListDataProviderView._FILTERCRITERION] : null;
                        let unmappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                        let unmappedResultFilterCriterion = self._getUnmappedFilterCriterion(resultFilterCriterion);
                        let resultParams = new self.FetchByOffsetParameters(self, self[ListDataProviderView._OFFSET], null, size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
                        // if the dataprovider supports fetchByOffset then we use that to do an offset based fetch
                        if (cachedData[ListDataProviderView._DONE]) {
                            return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, resultParams, data, metadata)));
                        }
                        return Promise.resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, resultParams, data, metadata)));
                    });
                };
            }(cachedData), params));
        }
        else {
            let updatedParams = new this.FetchListParameters(this, params, size, mappedSortCriteria, mappedFilterCriterion, fetchAttributes);
            let cachedAsyncIterator = this.dataProvider[ListDataProviderView._FETCHFIRST](updatedParams)[Symbol.asyncIterator]();
            return new this.AsyncIterable(this, new this.AsyncIterator(this, function (cachedData, cachedAsyncIterator) {
                return function () {
                    return cachedAsyncIterator.next().then(function (result) {
                        let data = result[ListDataProviderView._VALUE][ListDataProviderView._DATA];
                        let metadata = result[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
                        let items = data.map(function (value, index) {
                            return new self.Item(self, metadata[index], data[index]);
                        });
                        if (self._noFilterSupport) {
                            self._filterResult(mappedFilterCriterion, items);
                        }
                        // apply any mapping defined in the DataMapping parameter
                        let mappedResult = self._getMappedItems(items);
                        self._cacheResult(cachedData, mappedResult);
                        cachedData[ListDataProviderView._DONE] = result[ListDataProviderView._DONE];
                        let size = params != null ? params[ListDataProviderView._SIZE] : null;
                        let offset = params != null ? params[ListDataProviderView._OFFSET] : null;
                        let resultFetchParams = result[ListDataProviderView._VALUE][ListDataProviderView._FETCHPARAMETERS];
                        let resultSortCriteria = resultFetchParams != null ? resultFetchParams[ListDataProviderView._SORTCRITERIA] : null;
                        let resultFilterCriterion = resultFetchParams != null ? resultFetchParams[ListDataProviderView._FILTERCRITERION] : null;
                        let unmappedResultSortCriteria = self._getUnmappedSortCriteria(resultSortCriteria);
                        let unmappedResultFilterCriterion = self._getUnmappedFilterCriterion(resultFilterCriterion);
                        let resultParams = new self.FetchListParameters(self, params, size, unmappedResultSortCriteria, unmappedResultFilterCriterion);
                        return self._fetchUntilKey(resultParams, self[ListDataProviderView._FROM], cachedData, cachedAsyncIterator).then(function () {
                            return self._fetchUntilOffset(resultParams, self[ListDataProviderView._OFFSET] + cachedData[ListDataProviderView._STARTINDEX], data.length, cachedData, cachedAsyncIterator);
                        });
                    });
                };
            }(cachedData, cachedAsyncIterator), params));
        }
    }
    getCapability(capabilityName) {
        return this.dataProvider.getCapability(capabilityName);
    }
    getTotalSize() {
        return this.dataProvider.getTotalSize();
    }
    isEmpty() {
        return this.dataProvider.isEmpty();
    }
    /**
     * Fetches the next block
     */
    _fetchNextSet(params, dataProviderAsyncIterator, resultMap) {
        let self = this;
        return dataProviderAsyncIterator.next().then(function (result) {
            var value = result[ListDataProviderView._VALUE];
            var data = value[ListDataProviderView._DATA];
            var metadata = value[ListDataProviderView._METADATA];
            var keys = metadata.map(function (metadata) {
                return metadata[ListDataProviderView._KEY];
            });
            let foundAllKeys = true;
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
    }
    /**
     * Fetches until we find the key
     */
    _fetchUntilKey(params, key, cachedData, cachedAsyncIterator) {
        let self = this;
        if (key != null) {
            // first check if the key is in our cache
            let resultItems = cachedData[ListDataProviderView._ITEMS].filter(function (resultItem) {
                if (oj.KeyUtils.equals(resultItem[ListDataProviderView._METADATA][ListDataProviderView._KEY], key)) {
                    return true;
                }
            });
            if (resultItems.length > 0) {
                // if the key is in our cache, then trim the cache so that it starts from the key
                let itemIndex = cachedData[ListDataProviderView._ITEMS].indexOf(resultItems[0]);
                cachedData[ListDataProviderView._ITEMS] = cachedData[ListDataProviderView._ITEMS].slice(itemIndex, cachedData[ListDataProviderView._ITEMS].length);
            }
            else if (!cachedData[ListDataProviderView._DONE]) {
                // if the key is not in our cache and we are not done then fetch the next block and call _fetchUntilKey again.
                return cachedAsyncIterator.next().then(function (nextResult) {
                    let data = nextResult[ListDataProviderView._VALUE][ListDataProviderView._DATA];
                    let metadata = nextResult[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
                    let items = data.map(function (value, index) {
                        return new self.Item(self, metadata[index], data[index]);
                    });
                    let mappedResult = self._getMappedItems(items);
                    self._cacheResult(cachedData, mappedResult);
                    cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
                    return self._fetchUntilKey(nextResult[ListDataProviderView._FETCHPARAMETERS], mappedResult[ListDataProviderView._KEYS], cachedData, cachedAsyncIterator);
                });
            }
            else {
                // if we are done then this means that the key is not in the entire data set
                cachedData[ListDataProviderView._ITEMS] = [];
            }
        }
        return Promise.resolve(null);
    }
    /**
     * Fetches until we fulfill the offset
     */
    _fetchUntilOffset(params, offset, resultSize, cachedData, cachedAsyncIterator) {
        let self = this;
        let fetchSize = params != null ? params[ListDataProviderView._SIZE] > 0 ? params[ListDataProviderView._SIZE] : resultSize : resultSize;
        offset = offset > 0 ? offset : 0;
        let cachedItems = cachedData[ListDataProviderView._ITEMS].slice(offset, offset + fetchSize);
        if (this._noFilterSupport) {
            let mappedFilterCriterion = this._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);
            this._filterResult(mappedFilterCriterion, cachedItems);
        }
        if (cachedItems.length < fetchSize) {
            if (!cachedData[ListDataProviderView._DONE]) {
                return cachedAsyncIterator.next().then(function (nextResult) {
                    let data = nextResult[ListDataProviderView._VALUE][ListDataProviderView._DATA];
                    let metadata = nextResult[ListDataProviderView._VALUE][ListDataProviderView._METADATA];
                    let items = data.map(function (value, index) {
                        return new self.Item(self, metadata[index], data[index]);
                    });
                    if (self._noFilterSupport) {
                        let mappedFilterCriterion = self._getMappedFilterCriterion(params[ListDataProviderView._FILTERCRITERION]);
                        self._filterResult(mappedFilterCriterion, items);
                    }
                    let mappedResult = self._getMappedItems(items);
                    self._cacheResult(cachedData, mappedResult);
                    cachedData[ListDataProviderView._DONE] = nextResult[ListDataProviderView._DONE];
                    return self._fetchUntilOffset(nextResult[ListDataProviderView._VALUE][ListDataProviderView._FETCHPARAMETERS], offset, data.length, cachedData, cachedAsyncIterator);
                });
            }
            else {
                cachedData[ListDataProviderView._STARTINDEX] = cachedData[ListDataProviderView._STARTINDEX] + cachedItems.length;
                let data = cachedItems.map(function (item) {
                    return item[ListDataProviderView._DATA];
                });
                let metadata = cachedItems.map(function (item) {
                    return item[ListDataProviderView._METADATA];
                });
                return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, data, metadata)));
            }
        }
        else {
            cachedData[ListDataProviderView._STARTINDEX] = cachedData[ListDataProviderView._STARTINDEX] + cachedItems.length;
            let data = cachedItems.map(function (item) {
                return item[ListDataProviderView._DATA];
            });
            let metadata = cachedItems.map(function (item) {
                return item[ListDataProviderView._METADATA];
            });
            if (cachedData[ListDataProviderView._DONE]) {
                return Promise.resolve(new self.AsyncIteratorReturnResult(self, new self.FetchListResult(self, params, data, metadata)));
            }
            return Promise.resolve(new self.AsyncIteratorYieldResult(self, new self.FetchListResult(self, params, data, metadata)));
        }
    }
    /**
     * Cache the data and keys
     */
    _cacheResult(cachedData, items) {
        let self = this;
        items.map(function (value) {
            cachedData[ListDataProviderView._ITEMS].push(value);
        });
    }
    _filterResult(filterCriterion, items) {
        let filter;
        if (filterCriterion) {
            if (!filterCriterion.filter) {
                filterCriterion = __DataProvider.FilterFactory.getFilter({ filterDef: filterCriterion });
            }
            let i = items.length - 1;
            while (i >= 0) {
                if (!filterCriterion.filter(items[i][ListDataProviderView._DATA])) {
                    items.splice(i, 1);
                }
                i--;
            }
        }
    }
    /**
     * Apply DataMapping to the items
     */
    _getMappedItems(items) {
        let self = this;
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            let mapFields = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPFIELDS];
            if (mapFields != null) {
                if (items != null && items.length > 0) {
                    let mappedItems = new Array();
                    mappedItems = items.map(function (value) {
                        return mapFields.bind(self)(value);
                    });
                    return mappedItems;
                }
            }
        }
        return items;
    }
    /**
     * Apply mapping to the filterCriterion
     */
    _getMappedFilterCriterion(filterCriterion) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            let mappedFilterCriterion = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPFILTERCRITERION];
            if (mappedFilterCriterion != null) {
                if (filterCriterion != null) {
                    return mappedFilterCriterion(filterCriterion);
                }
            }
        }
        return filterCriterion;
    }
    /**
     * Apply mapping to the sortCriteria
     */
    _getMappedSortCriteria(sortCriteria) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            let mapSortCriteria = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._MAPSORTCRITERIA];
            if (mapSortCriteria != null) {
                if (sortCriteria != null && sortCriteria.length > 0) {
                    return mapSortCriteria(sortCriteria);
                }
            }
        }
        return sortCriteria;
    }
    /**
     * Unmapping the sortCriteria
     */
    _getUnmappedSortCriteria(sortCriteria) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            let unmapSortCriteria = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._UNMAPSORTCRITERIA];
            if (unmapSortCriteria != null) {
                if (sortCriteria != null && sortCriteria.length > 0) {
                    return unmapSortCriteria(sortCriteria);
                }
            }
        }
        return sortCriteria;
    }
    /**
     * Unmapping the FilterCriterion
     */
    _getUnmappedFilterCriterion(filter) {
        if (this[ListDataProviderView._DATAMAPPING] != null) {
            let unmapFilterCriterion = this[ListDataProviderView._DATAMAPPING][ListDataProviderView._UNMAPFILTERCRITERION];
            if (unmapFilterCriterion != null) {
                if (filter != null) {
                    return unmapFilterCriterion(filter);
                }
            }
        }
        return filter;
    }
    /**
     * Add event listeners
     */
    _addEventListeners(dataprovider) {
        let self = this;
        dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._REFRESH, function (event) {
            self.dispatchEvent(event);
        });
        dataprovider[ListDataProviderView._ADDEVENTLISTENER](ListDataProviderView._MUTATE, function (event) {
            self.dispatchEvent(event);
        });
    }
}
ListDataProviderView._KEY = 'key';
ListDataProviderView._KEYS = 'keys';
ListDataProviderView._DATA = 'data';
ListDataProviderView._STARTINDEX = 'startIndex';
ListDataProviderView._SORT = 'sort';
ListDataProviderView._SORTCRITERIA = 'sortCriteria';
ListDataProviderView._FILTERCRITERION = 'filterCriterion';
ListDataProviderView._METADATA = 'metadata';
ListDataProviderView._ITEMS = 'items';
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
oj['ListDataProviderView'] = ListDataProviderView;
oj.ListDataProviderView = ListDataProviderView;
oj.EventTargetMixin.applyMixin(ListDataProviderView);



/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 4.1.0
 * @export
 * @final
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
 * @param {oj.DataFilter.Filter=} options.filterCriterion filter criterion to apply. If the DataProvider does not support filtering then
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
 *               value: "DataFilter.Filter<D>",
 *               for: "options.filterCriterion"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute", "DataFilter"]}
 */

/**
 * Check if there are rows containing the specified keys
 *
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
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
 *
 * @since 7.0.0
 * @export
 * @expose
 * @memberof oj.ListDataProviderView
 * @instance
 * @name filterCriterion
 * @ojsignature {target: "Type",
 *               value: "DataFilter.Filter<D>"}
 */


/**
 *
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
 *
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
 *
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