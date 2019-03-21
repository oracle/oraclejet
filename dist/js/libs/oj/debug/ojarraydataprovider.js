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
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojset', 'ojs/ojmap', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ko, ojSet, ojMap)
{
var ArrayDataProvider = /** @class */ (function () {
    function ArrayDataProvider(data, options) {
        this.data = data;
        this.options = options;
        this._KEY = 'key';
        this._KEYS = 'keys';
        this._AFTERKEYS = 'afterKeys';
        this._ADDBEFOREKEYS = 'addBeforeKeys';
        this._DIRECTION = 'direction';
        this._ATTRIBUTE = 'attribute';
        this._ATTRIBUTES = 'attributes';
        this._SORT = 'sort';
        this._SORTCRITERIA = 'sortCriteria';
        this._DATA = 'data';
        this._METADATA = 'metadata';
        this._INDEXES = 'indexes';
        this._OFFSET = 'offset';
        this._SIZE = 'size';
        this._IDATTRIBUTE = 'idAttribute';
        this._IMPLICITSORT = 'implicitSort';
        this._KEYATTRIBUTES = 'keyAttributes';
        this._SORTCOMPARATORS = 'sortComparators';
        this._COMPARATORS = 'comparators';
        this._COMPARATOR = 'comparator';
        this._RESULTS = 'results';
        this._CONTAINS = 'contains';
        this._FETCHPARAMETERS = 'fetchParameters';
        this._CONTAINSPARAMETERS = 'containsParameters';
        this._VALUE = 'value';
        this._DONE = 'done';
        this._ADD = 'add';
        this._REMOVE = 'remove';
        this._UPDATE = 'update';
        this._DETAIL = 'detail';
        this._FETCHLISTRESULT = 'fetchListResult';
        this._ATDEFAULT = '@default';
        this._MUTATIONSEQUENCENUM = 'mutationSequenceNum';
        this.Item = /** @class */ (function () {
            function class_1(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
            }
            return class_1;
        }());
        this.ItemMetadata = /** @class */ (function () {
            function class_2(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[_parent._KEY] = key;
            }
            return class_2;
        }());
        this.FetchByKeysResults = /** @class */ (function () {
            function class_3(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
            }
            return class_3;
        }());
        this.ContainsKeysResults = /** @class */ (function () {
            function class_4(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[_parent._CONTAINSPARAMETERS] = containsParameters;
                this[_parent._RESULTS] = results;
            }
            return class_4;
        }());
        this.FetchByOffsetResults = /** @class */ (function () {
            function class_5(_parent, fetchParameters, results, done) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
                this[_parent._DONE] = done;
            }
            return class_5;
        }());
        this.FetchListParameters = /** @class */ (function () {
            function class_6(_parent, size, sortCriteria, attributes) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.attributes = attributes;
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
                this[_parent._ATTRIBUTES] = attributes;
            }
            return class_6;
        }());
        this.FetchListResult = /** @class */ (function () {
            function class_7(_parent, fetchParameters, data, metadata) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._DATA] = data;
                this[_parent._METADATA] = metadata;
            }
            return class_7;
        }());
        this.AsyncIterable = /** @class */ (function () {
            function class_8(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_8;
        }());
        this.AsyncIterator = /** @class */ (function () {
            function class_9(_parent, _nextFunc, _params, _offset) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._offset = _offset;
                this._cachedOffset = _offset;
                this._cacheObj = {};
                this._cacheObj[_parent._MUTATIONSEQUENCENUM] = _parent._mutationSequenceNum;
            }
            class_9.prototype['next'] = function () {
                var result = this._nextFunc(this._params, this._cachedOffset, this._cacheObj);
                this._cachedOffset = this._cachedOffset + result.value[this._parent._DATA].length;
                return Promise.resolve(result);
            };
            return class_9;
        }());
        this.AsyncIteratorResult = /** @class */ (function () {
            function class_10(_parent, value, done) {
                this._parent = _parent;
                this.value = value;
                this.done = done;
                this[_parent._VALUE] = value;
                this[_parent._DONE] = done;
            }
            return class_10;
        }());
        this.DataProviderMutationEventDetail = /** @class */ (function () {
            function class_11(_parent, add, remove, update) {
                this._parent = _parent;
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[_parent._ADD] = add;
                this[_parent._REMOVE] = remove;
                this[_parent._UPDATE] = update;
            }
            return class_11;
        }());
        this.DataProviderOperationEventDetail = /** @class */ (function () {
            function class_12(_parent, keys, metadata, data, indexes) {
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
            return class_12;
        }());
        this.DataProviderAddOperationEventDetail = /** @class */ (function () {
            function class_13(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
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
            return class_13;
        }());
        this._cachedIndexMap = [];
        this._sequenceNum = 0;
        this._mutationSequenceNum = 0;
        this._subscribeObservableArray(data);
        if (options != null && options[this._KEYS] != null) {
            this._keysSpecified = true;
            this._keys = options[this._KEYS];
        }
    }
    ArrayDataProvider.prototype.containsKeys = function (params) {
        var self = this;
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            var results = new ojSet();
            params[self._KEYS].forEach(function (key) {
                if (fetchByKeysResult[self._RESULTS].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve(new self.ContainsKeysResults(self, params, results));
        });
    };
    ArrayDataProvider.prototype.fetchByKeys = function (params) {
        var self = this;
        this._generateKeysIfNeeded();
        var results = new ojMap();
        var keys = this._getKeys();
        var fetchAttributes = params != null ? params[this._ATTRIBUTES] : null;
        var findKeyIndex, i = 0;
        params[self._KEYS].forEach(function (searchKey) {
            findKeyIndex = null;
            for (i = 0; i < keys.length; i++) {
                if (oj.Object.compareValues(keys[i], searchKey)) {
                    findKeyIndex = i;
                    break;
                }
            }
            if (findKeyIndex != null &&
                findKeyIndex >= 0) {
                var rowData = self._getRowData()[findKeyIndex];
                if (fetchAttributes && fetchAttributes.length > 0) {
                    rowData = self._filterRowAttributes(fetchAttributes, rowData);
                }
                results.set(searchKey, new self.Item(self, new self.ItemMetadata(self, searchKey), rowData));
            }
        });
        return Promise.resolve(new self.FetchByKeysResults(self, params, results));
    };
    ArrayDataProvider.prototype.fetchByOffset = function (params) {
        var self = this;
        var size = params != null ? params[this._SIZE] : -1;
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        var offset = params != null ? params[this._OFFSET] > 0 ? params[this._OFFSET] : 0 : 0;
        var fetchAttributes = params != null ? params[this._ATTRIBUTES] : null;
        this._generateKeysIfNeeded();
        var fetchParams = new this.FetchListParameters(this, size, sortCriteria, fetchAttributes);
        var iteratorResults = this._fetchFrom(fetchParams, offset);
        var value = iteratorResults[this._VALUE];
        var done = iteratorResults[this._DONE];
        var data = value[this._DATA];
        var keys = value[this._METADATA].map(function (value) {
            return value[self._KEY];
        });
        var resultsArray = data.map(function (value, index) {
            return new self.Item(self, new self.ItemMetadata(self, keys[index]), value);
        });
        return Promise.resolve(new this.FetchByOffsetResults(this, params, resultsArray, done));
    };
    /**
     * Fetch the first block of data
     */
    ArrayDataProvider.prototype.fetchFirst = function (params) {
        var offset = 0;
        return new this.AsyncIterable(this, new this.AsyncIterator(this, this._fetchFrom.bind(this), params, offset));
    };
    /**
     * Determines whether this DataProvider supports certain feature.
     */
    ArrayDataProvider.prototype.getCapability = function (capabilityName) {
        // Just call the static version of getCapability
        return ArrayDataProvider.getCapability(capabilityName);
    };
    ArrayDataProvider.getCapability = function (capabilityName) {
        if (capabilityName == 'sort') {
            return { attributes: 'multiple' };
        }
        else if (capabilityName == 'fetchByKeys') {
            return { implementation: 'lookup' };
        }
        else if (capabilityName == 'fetchByOffset') {
            return { implementation: 'randomAccess' };
        }
        else if (capabilityName == 'fetchCapability') {
            var exclusionFeature = new Set();
            exclusionFeature.add('exclusion');
            return { attributeFilter: {
                    expansion: {},
                    ordering: {},
                    defaultShape: {
                        features: exclusionFeature
                    }
                }
            };
        }
        return null;
    };
    ArrayDataProvider.prototype.getTotalSize = function () {
        return Promise.resolve(this._getRowData().length);
    };
    ArrayDataProvider.prototype.isEmpty = function () {
        return this._getRowData().length > 0 ? 'no' : 'yes';
    };
    /**
     * Return an empty Set which is optimized to store keys
     */
    ArrayDataProvider.prototype.createOptimizedKeySet = function (initialSet) {
        return new ojSet(initialSet);
    };
    /**
     * Returns an empty Map which will efficiently store Keys returned by the DataProvider
     */
    ArrayDataProvider.prototype.createOptimizedKeyMap = function (initialMap) {
        if (initialMap) {
            var map_1 = new ojMap();
            initialMap.forEach(function (value, key) {
                map_1.set(key, value);
            });
            return map_1;
        }
        return new ojMap();
    };
    /**
     * Get the rows data, unwrapping observableArray if needed.
     */
    ArrayDataProvider.prototype._getRowData = function () {
        if (!(this[this._DATA] instanceof Array)) {
            return this[this._DATA]();
        }
        return this[this._DATA];
    };
    /**
     * Get the keys, unwrapping observableArray if needed.
     */
    ArrayDataProvider.prototype._getKeys = function () {
        if (this._keys != null &&
            !(this._keys instanceof Array)) {
            return this._keys();
        }
        return this._keys;
    };
    /**
     * Return the index of a key, or -1 if the key is not found.
     */
    ArrayDataProvider.prototype._indexOfKey = function (searchKey) {
        var keys = this._getKeys();
        var keyIndex = -1;
        for (var i = 0; i < keys.length; i++) {
            if (oj.Object.compareValues(keys[i], searchKey)) {
                keyIndex = i;
                break;
            }
        }
        return keyIndex;
    };
    /**
     * If observableArray, then subscribe to it
     */
    ArrayDataProvider.prototype._subscribeObservableArray = function (data) {
        if (!(data instanceof Array)) {
            if (!this._isObservableArray(data)) {
                // we only support Array or ko.observableArray
                throw new Error('Invalid data type. ArrayDataProvider only supports Array or observableArray.');
            }
            // subscribe to observableArray arrayChange event to get individual updates
            var self = this;
            data['subscribe'](function (changes) {
                var i, j, id, index, status, dataArray = [], keyArray = [], indexArray = [], metadataArray = [], afterKeyArray = [];
                self._mutationSequenceNum++;
                // first check if we only have adds or only have deletes
                var onlyAdds = true;
                var onlyDeletes = true;
                changes.forEach(function (change) {
                    if (change['status'] === 'deleted') {
                        onlyAdds = false;
                    }
                    else if (change['status'] === 'added') {
                        onlyDeletes = false;
                    }
                });
                var updatedIndexes = [];
                var removeDuplicate = [];
                var operationUpdateEventDetail = null;
                var operationAddEventDetail = null;
                var operationRemoveEventDetail = null;
                if (!onlyAdds && !onlyDeletes) {
                    // squash deletes and adds into updates
                    for (i = 0; i < changes.length; i++) {
                        index = changes[i].index;
                        status = changes[i].status;
                        var iKey = self._getId(changes[i].value);
                        for (j = 0; j < changes.length; j++) {
                            if (j != i &&
                                index === changes[j].index &&
                                status !== changes[j]['status'] &&
                                updatedIndexes.indexOf(i) < 0 &&
                                removeDuplicate.indexOf(i) < 0) {
                                // Squash delete and add only if they have the same index and either no key or same key
                                if (iKey == null || oj.Object.compareValues(iKey, self._getId(changes[j].value))) {
                                    if (status === 'deleted') {
                                        removeDuplicate.push(i);
                                        updatedIndexes.push(j);
                                    }
                                    else {
                                        removeDuplicate.push(j);
                                        updatedIndexes.push(i);
                                    }
                                }
                            }
                        }
                    }
                    for (i = 0; i < changes.length; i++) {
                        if (updatedIndexes.indexOf(i) >= 0) {
                            var key = self._getKeys()[changes[i].index];
                            // By this time, updatedIndexes contains indexes of "added" entries in "changes" array that
                            // have matching "deleted" entries with same keys, which should be the same as the old keys.
                            keyArray.push(key);
                            dataArray.push(changes[i].value);
                            indexArray.push(changes[i].index);
                        }
                    }
                    if (keyArray.length > 0) {
                        metadataArray = keyArray.map(function (value) {
                            return new self.ItemMetadata(self, value);
                        });
                        var keySet_1 = new ojSet();
                        keyArray.map(function (key) {
                            keySet_1.add(key);
                        });
                        operationUpdateEventDetail = new self.DataProviderOperationEventDetail(self, keySet_1, metadataArray, dataArray, indexArray);
                    }
                }
                dataArray = [], keyArray = [], indexArray = [];
                if (!onlyAdds) {
                    for (i = 0; i < changes.length; i++) {
                        if (changes[i]['status'] === 'deleted' &&
                            updatedIndexes.indexOf(i) < 0 &&
                            removeDuplicate.indexOf(i) < 0) {
                            keyArray.push(self._getKeys()[changes[i].index]);
                            dataArray.push(changes[i].value);
                            indexArray.push(changes[i].index);
                        }
                    }
                    if (keyArray.length > 0) {
                        keyArray.map(function (key) {
                            var keyIndex = self._indexOfKey(key);
                            self._keys.splice(keyIndex, 1);
                        });
                    }
                    if (keyArray.length > 0) {
                        metadataArray = keyArray.map(function (value) {
                            return new self.ItemMetadata(self, value);
                        });
                        var keySet_2 = new ojSet();
                        keyArray.map(function (key) {
                            keySet_2.add(key);
                        });
                        operationRemoveEventDetail = new self.DataProviderOperationEventDetail(self, keySet_2, metadataArray, dataArray, indexArray);
                    }
                }
                dataArray = [], keyArray = [], indexArray = [];
                if (!onlyDeletes) {
                    var generatedKeys = self._generateKeysIfNeeded();
                    var isInitiallyEmpty = self._getKeys() != null ? self._getKeys().length > 0 ? false : true : true;
                    for (i = 0; i < changes.length; i++) {
                        if (changes[i]['status'] === 'added' &&
                            updatedIndexes.indexOf(i) < 0 &&
                            removeDuplicate.indexOf(i) < 0) {
                            id = self._getId(changes[i].value);
                            if (id == null && (generatedKeys || self._keysSpecified)) {
                                id = self._getKeys()[changes[i].index];
                            }
                            if (id == null) {
                                id = self._sequenceNum++;
                                self._keys.splice(changes[i].index, 0, id);
                            }
                            if (isInitiallyEmpty || self._indexOfKey(id) == -1) {
                                self._keys.splice(changes[i].index, 0, id);
                            }
                            keyArray.push(id);
                            var afterKey = self._getKeys()[changes[i].index + 1];
                            afterKey = afterKey == null ? null : afterKey;
                            afterKeyArray.push(afterKey);
                            dataArray.push(changes[i].value);
                            indexArray.push(changes[i].index);
                        }
                    }
                    if (keyArray.length > 0) {
                        metadataArray = keyArray.map(function (value) {
                            return new self.ItemMetadata(self, value);
                        });
                        var keySet_3 = new ojSet();
                        keyArray.map(function (key) {
                            keySet_3.add(key);
                        });
                        var afterKeySet_1 = new ojSet();
                        afterKeyArray.map(function (key) {
                            afterKeySet_1.add(key);
                        });
                        operationAddEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet_3, afterKeySet_1, afterKeyArray, metadataArray, dataArray, indexArray);
                    }
                }
                self._fireMutationEvent(operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
            }, null, 'arrayChange');
            data['subscribe'](function (changes) {
                if (self._mutationEvent) {
                    self.dispatchEvent(self._mutationEvent);
                }
                else if (self._mutationRemoveEvent ||
                    self._mutationAddEvent ||
                    self._mutationUpdateEvent) {
                    if (self._mutationRemoveEvent) {
                        self.dispatchEvent(self._mutationRemoveEvent);
                    }
                    if (self._mutationAddEvent) {
                        self.dispatchEvent(self._mutationAddEvent);
                    }
                    if (self._mutationUpdateEvent) {
                        self.dispatchEvent(self._mutationUpdateEvent);
                    }
                }
                else {
                    self.dispatchEvent(new oj.DataProviderRefreshEvent());
                }
                self._mutationEvent = null;
                self._mutationRemoveEvent = null;
                self._mutationAddEvent = null;
                self._mutationUpdateEvent = null;
            }, null, 'change');
        }
    };
    ArrayDataProvider.prototype._fireMutationEvent = function (operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail) {
        // the keys and indexes must all be disjoint in the same mutation event. So if there are any keys/indexes which are in different mutations, then fire separate mutation events
        var self = this;
        var fireMutipleEvents = false;
        var checkProps = ['keys', 'indexes'];
        checkProps.forEach(function (prop) {
            if (!fireMutipleEvents) {
                fireMutipleEvents = self._hasSamePropValue(operationRemoveEventDetail, operationAddEventDetail, prop) ||
                    self._hasSamePropValue(operationRemoveEventDetail, operationUpdateEventDetail, prop) ||
                    self._hasSamePropValue(operationAddEventDetail, operationUpdateEventDetail, prop);
            }
        });
        if (fireMutipleEvents) {
            if (operationRemoveEventDetail) {
                var mutationRemoveEventDetail = new this.DataProviderMutationEventDetail(this, null, operationRemoveEventDetail, null);
                this._mutationRemoveEvent = new oj.DataProviderMutationEvent(mutationRemoveEventDetail);
            }
            if (operationAddEventDetail) {
                var mutationAddEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, null, null);
                this._mutationAddEvent = new oj.DataProviderMutationEvent(mutationAddEventDetail);
            }
            if (operationUpdateEventDetail) {
                var mutationUpdateEventDetail = new this.DataProviderMutationEventDetail(this, null, null, operationUpdateEventDetail);
                this._mutationUpdateEvent = new oj.DataProviderMutationEvent(mutationUpdateEventDetail);
            }
        }
        else {
            var mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
            this._mutationEvent = new oj.DataProviderMutationEvent(mutationEventDetail);
        }
    };
    ArrayDataProvider.prototype._hasSamePropValue = function (operationEventDetail1, operationEventDetail2, prop) {
        var hasSameValue = false;
        if (operationEventDetail1 && operationEventDetail1[prop]) {
            operationEventDetail1[prop].forEach(function (prop1) {
                if (!hasSameValue &&
                    operationEventDetail2 &&
                    operationEventDetail2[prop]) {
                    operationEventDetail2[prop].forEach(function (prop2) {
                        if (!hasSameValue &&
                            oj.Object.compareValues(prop1, prop2)) {
                            hasSameValue = true;
                        }
                    });
                }
            });
        }
        return hasSameValue;
    };
    /**
     * Check if observableArray
     */
    ArrayDataProvider.prototype._isObservableArray = function (obj) {
        return ko.isObservable(obj) && !(obj['destroyAll'] === undefined);
    };
    /**
     * Generate keys array if it wasn't passed in options.keys
     */
    ArrayDataProvider.prototype._generateKeysIfNeeded = function () {
        if (this._keys == null) {
            var keyAttributes = this.options != null ? (this.options[this._KEYATTRIBUTES] || this.options[this._IDATTRIBUTE]) : null;
            this._keys = [];
            var rowData = this._getRowData();
            var id = void 0, i = 0;
            for (i = 0; i < rowData.length; i++) {
                id = this._getId(rowData[i]);
                if (id == null || keyAttributes == '@index') {
                    id = this._sequenceNum++;
                }
                this._keys[i] = id;
            }
            return true;
        }
        return false;
    };
    /**
     * Get id value for row
     */
    ArrayDataProvider.prototype._getId = function (row) {
        var id;
        var keyAttributes = this.options != null ? (this.options[this._KEYATTRIBUTES] || this.options[this._IDATTRIBUTE]) : null;
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                var i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
                    id[i] = this._getVal(row, keyAttributes[i]);
                }
            }
            else if (keyAttributes == '@value') {
                id = this._getAllVals(row);
            }
            else {
                id = this._getVal(row, keyAttributes);
            }
            return id;
        }
        else {
            return null;
        }
    };
    ;
    /**
     * Get value for attribute
     */
    ArrayDataProvider.prototype._getVal = function (val, attr) {
        if (typeof (val[attr]) == 'function') {
            return val[attr]();
        }
        return val[attr];
    };
    ;
    /**
     * Get all values in a row
     */
    ArrayDataProvider.prototype._getAllVals = function (val) {
        var self = this;
        return Object.keys(val).map(function (key) {
            return self._getVal(val, key);
        });
    };
    ;
    /**
     * Fetch from offset
     */
    ArrayDataProvider.prototype._fetchFrom = function (params, offset, cacheObj) {
        var self = this;
        var fetchAttributes = params != null ? params[this._ATTRIBUTES] : null;
        this._generateKeysIfNeeded();
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        var indexMap = this._getCachedIndexMap(sortCriteria, cacheObj);
        var mappedData = indexMap.map(function (index) {
            var rowData = self._getRowData()[index];
            if (fetchAttributes && fetchAttributes.length > 0) {
                rowData = self._filterRowAttributes(fetchAttributes, rowData);
            }
            return rowData;
        });
        var mappedKeys = indexMap.map(function (index) {
            return self._getKeys()[index];
        });
        var fetchSize = params != null ? params[this._SIZE] > 0 ? params[this._SIZE] : params[this._SIZE] < 0 ? self._getKeys().length : 25 : 25;
        var resultData = mappedData.slice(offset, offset + fetchSize);
        var resultKeys = mappedKeys.slice(offset, offset + fetchSize);
        var resultMetadata = resultKeys.map(function (value) {
            return new self.ItemMetadata(self, value);
        });
        var hasMore = offset + fetchSize < mappedData.length ? true : false;
        var mergedSortCriteria = this._mergeSortCriteria(sortCriteria);
        if (mergedSortCriteria != null) {
            params = params || {};
            params[this._SORTCRITERIA] = mergedSortCriteria;
        }
        var result = new this.FetchListResult(this, params, resultData, resultMetadata);
        return new this.AsyncIteratorResult(this, result, !hasMore);
    };
    /**
     * Get cached index map
     */
    ArrayDataProvider.prototype._getCachedIndexMap = function (sortCriteria, cacheObj) {
        if (cacheObj && cacheObj['indexMap'] && cacheObj[this._MUTATIONSEQUENCENUM] === this._mutationSequenceNum) {
            return cacheObj['indexMap'];
        }
        var dataIndexes = this._getRowData().map(function (value, index) {
            return index;
        });
        var indexMap = this._sortData(dataIndexes, sortCriteria);
        if (cacheObj) {
            cacheObj['indexMap'] = indexMap;
            cacheObj[this._MUTATIONSEQUENCENUM] = this._mutationSequenceNum;
        }
        return indexMap;
    };
    /**
     * Sort data
     */
    ArrayDataProvider.prototype._sortData = function (indexMap, sortCriteria) {
        var self = this;
        var indexedData = indexMap.map(function (index) {
            return { index: index, value: self._getRowData()[index] };
        });
        if (sortCriteria != null) {
            indexedData.sort(this._getSortComparator(sortCriteria));
        }
        return indexedData.map(function (item) {
            return item.index;
        });
    };
    /**
     * Apply sort comparators
     */
    ArrayDataProvider.prototype._getSortComparator = function (sortCriteria) {
        var self = this;
        return function (x, y) {
            var sortComparators = self.options != null ? self.options[self._SORTCOMPARATORS] : null;
            var i, direction, attribute, comparator, xval, yval;
            for (i = 0; i < sortCriteria.length; i++) {
                direction = sortCriteria[i][self._DIRECTION];
                attribute = sortCriteria[i][self._ATTRIBUTE];
                comparator = null;
                if (sortComparators != null) {
                    comparator = sortComparators[self._COMPARATORS].get(attribute);
                }
                xval = self._getVal(x.value, attribute);
                yval = self._getVal(y.value, attribute);
                if (comparator != null) {
                    var descendingResult = direction == 'descending' ? -1 : 1;
                    var comparatorResult = comparator(xval, yval) * descendingResult;
                    if (comparatorResult != 0) {
                        return comparatorResult;
                    }
                }
                else {
                    var compareResult = 0;
                    var strX = (typeof xval === 'string') ? xval : (new String(xval)).toString();
                    var strY = (typeof yval === 'string') ? yval : (new String(yval)).toString();
                    if (direction == 'ascending') {
                        compareResult = strX.localeCompare(strY, undefined, { 'numeric': true, 'sensitivity': 'base' });
                    }
                    else {
                        compareResult = strY.localeCompare(strX, undefined, { 'numeric': true, 'sensitivity': 'base' });
                    }
                    if (compareResult != 0) {
                        return compareResult;
                    }
                }
            }
            return 0;
        };
    };
    /**
     * Merge sort criteria
     */
    ArrayDataProvider.prototype._mergeSortCriteria = function (sortCriteria) {
        var implicitSort = this.options != null ? this.options[this._IMPLICITSORT] : null;
        if (implicitSort != null) {
            if (sortCriteria == null) {
                return implicitSort;
            }
            // merge
            var mergedSortCriteria = sortCriteria.slice(0);
            var i = void 0, j = void 0, found = void 0;
            for (i = 0; i < implicitSort.length; i++) {
                found = false;
                for (j = 0; j < mergedSortCriteria.length; j++) {
                    if (mergedSortCriteria[j][this._ATTRIBUTE] == implicitSort[i][this._ATTRIBUTE]) {
                        found = true;
                    }
                }
                if (!found) {
                    mergedSortCriteria.push(implicitSort[i]);
                }
            }
            return mergedSortCriteria;
        }
        else {
            return sortCriteria;
        }
    };
    ArrayDataProvider.prototype._filterRowAttributes = function (fetchAttribute, data) {
        var self = this;
        var updatedData = null;
        if (Array.isArray(fetchAttribute)) {
            updatedData = {};
            // first see if we want all attributes
            var fetchAllAttributes_1 = false;
            fetchAttribute.forEach(function (key) {
                if (key == self._ATDEFAULT || key.name == self._ATDEFAULT) {
                    fetchAllAttributes_1 = true;
                }
            });
            var i_1;
            Object.keys(data).forEach(function (dataAttr) {
                if (fetchAllAttributes_1) {
                    var excludeAttribute = false;
                    var fetchAttr = dataAttr;
                    var attribute = void 0;
                    for (i_1 = 0; i_1 < fetchAttribute.length; i_1++) {
                        if (fetchAttribute[i_1] instanceof Object) {
                            attribute = fetchAttribute[i_1]['name'];
                        }
                        else {
                            attribute = fetchAttribute[i_1];
                        }
                        if (attribute.startsWith('!')) {
                            attribute = attribute.substr(1, attribute.length - 1);
                            if (attribute == dataAttr) {
                                // if it's excluded then set the exclusion flag and break
                                excludeAttribute = true;
                                break;
                            }
                        }
                        else if (attribute == dataAttr) {
                            // if there is a fetch attribute with the same name then use that
                            fetchAttr = fetchAttribute[i_1];
                            break;
                        }
                    }
                    if (!excludeAttribute) {
                        updatedData[dataAttr] = self._filterRowAttributes(fetchAttr, data);
                    }
                }
                else {
                    fetchAttribute.forEach(function (fetchAttr) {
                        var attribute;
                        if (fetchAttr instanceof Object) {
                            attribute = fetchAttr['name'];
                        }
                        else {
                            attribute = fetchAttr;
                        }
                        if (!attribute.startsWith('!') &&
                            attribute == dataAttr) {
                            updatedData[attribute] = self._filterRowAttributes(fetchAttr, data);
                        }
                    });
                }
            });
        }
        else if (fetchAttribute instanceof Object) {
            var name_1 = fetchAttribute['name'];
            var attributes_1 = fetchAttribute['attributes'];
            if (name_1 && !name_1.startsWith('!')) {
                if (data[name_1] instanceof Object &&
                    !Array.isArray(data[name_1])) {
                    updatedData = self._filterRowAttributes(attributes_1, data[name_1]);
                }
                else if (Array.isArray(data[name_1])) {
                    updatedData = [];
                    data[name_1].forEach(function (arrVal, index) {
                        updatedData[index] = self._filterRowAttributes(attributes_1, arrVal);
                    });
                }
                else {
                    updatedData = data[name_1];
                }
            }
        }
        else {
            updatedData = data[fetchAttribute];
        }
        return updatedData;
    };
    return ArrayDataProvider;
}());
oj['ArrayDataProvider'] = ArrayDataProvider;
oj.EventTargetMixin.applyMixin(ArrayDataProvider);

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
 * @class oj.ArrayDataProvider
 * @implements oj.DataProvider
 * @classdesc This class implements {@link oj.DataProvider}.
 *            Object representing data available from an array.  This dataprovider can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 *            See the <a href="../jetCookbook.html?component=table&demo=basicTable">Table - Base Table</a> demo for an example.<br><br>
 *            The default sorting algorithm used when a sortCriteria is passed into fetchFirst is natural sort.
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Consumers can add event listeners to listen for the following event types and respond to data change.
 * <h4 id="event:mutate" class="name">
 *   mutate
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link oj.DataProviderMutationEventDetail} interface.
 * </p>
 *
 * <h4 id="event:refresh" class="name">
 *   refresh
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   if (event.detail.remove) {
 *     var removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 *
 * @param {(Array|function():Array)} data data supported by the components
 *                                      <p>This can be either an Array, or a Knockout observableArray.</p>
 * @param {Object=} options Options for the ArrayDataProvider
 * @param {oj.SortComparators=} options.sortComparators Optional {@link oj.sortComparator} to use for sort.
 * @param {Array.<oj.SortCriterion>=} options.implicitSort Optional array of {@link oj.sortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * @param {(Array|function():Array)=} options.keys Optional keys for the data. If not supplied, then the keys are generated according options.keyAttributes. If that is also not supplied then index is used as key.
 * @param {(string | Array.<string>)=} options.idAttribute <span class="important">Deprecated: this option is deprecated and will be removed in the future.
 *                                                  Please use the keyAttributes option instead.</span><br><br>
 *                                                  Optionally the field name which stores the id in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Please note that the ids in ArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations.
 *                                                  @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 * @param {(string | Array.<string>)=} options.keyAttributes Optionally the field name which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Please note that the ids in ArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations. @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 * @ojsignature [{target: "Type",
 *               value: "class ArrayDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "Array<SortCriterion<D>>",
 *               for: "options.implicitSort"},
 *               {target: "Type",
 *               value: "ArrayDataProvider.SortComparators<D>",
 *               for: "options.sortComparators"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 * @example
 * // First initialize an array
 * var deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an ArrayDataProvider object with the array
 * var dataprovider = new oj.ArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 */

/**
 * Check if there are rows containing the specified keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
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
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
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
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
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
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
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
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Return the total number of rows in this dataprovider
 *
 * @ojstatus preview
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
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
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ArrayDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * End of jsdoc
 */

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

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
 * @interface oj.SortComparators
 * @ojtsnamespace ArrayDataProvider
 * @ojsignature {target: "Type",
 *               value: "interface SortComparators<D>",
 *               genericParameters: [{"name": "D", "description": "Type of Data"}]}
 */


/**
 * Sort comparators. Map of attribute to comparator function.
 *
 * @ojstatus preview
 * @since 4.1.0
 * @export
 * @expose
 * @memberof oj.SortComparators
 * @instance
 * @name comparators
 * @type {Map.<string, Function>}
 * @ojsignature {target: "Type",
 *               value: "Map<keyof D, (a: any, b: any) => number>"}
 */

/**
 * End of jsdoc
 */

  return ArrayDataProvider;
});