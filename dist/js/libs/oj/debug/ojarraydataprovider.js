/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ko)
{
var ArrayDataProvider = (function () {
    function ArrayDataProvider(data, options) {
        this.data = data;
        this.options = options;
        this._KEY = 'key';
        this._KEYS = 'keys';
        this._AFTERKEYS = 'afterKeys';
        this._DIRECTION = 'direction';
        this._ATTRIBUTE = 'attribute';
        this._SORT = 'sort';
        this._SORTCRITERIA = 'sortCriteria';
        this._DATA = 'data';
        this._METADATA = 'metadata';
        this._INDEXES = 'indexes';
        this._OFFSET = 'offset';
        this._SIZE = 'size';
        this._IDATTRIBUTE = 'idAttribute';
        this._IMPLICITSORT = 'implicitSort';
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
        this.Item = (function () {
            function class_1(_parent, metadata, data) {
                this._parent = _parent;
                this.metadata = metadata;
                this.data = data;
                this[_parent._METADATA] = metadata;
                this[_parent._DATA] = data;
            }
            return class_1;
        }());
        this.ItemMetadata = (function () {
            function class_2(_parent, key) {
                this._parent = _parent;
                this.key = key;
                this[_parent._KEY] = key;
            }
            return class_2;
        }());
        this.FetchByKeysResults = (function () {
            function class_3(_parent, fetchParameters, results) {
                this._parent = _parent;
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[_parent._FETCHPARAMETERS] = fetchParameters;
                this[_parent._RESULTS] = results;
            }
            return class_3;
        }());
        this.ContainsKeysResults = (function () {
            function class_4(_parent, containsParameters, results) {
                this._parent = _parent;
                this.containsParameters = containsParameters;
                this.results = results;
                this[_parent._CONTAINSPARAMETERS] = containsParameters;
                this[_parent._RESULTS] = results;
            }
            return class_4;
        }());
        this.FetchByOffsetResults = (function () {
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
        this.FetchListParameters = (function () {
            function class_6(_parent, size, sortCriteria) {
                this._parent = _parent;
                this.size = size;
                this.sortCriteria = sortCriteria;
                this[_parent._SIZE] = size;
                this[_parent._SORTCRITERIA] = sortCriteria;
            }
            return class_6;
        }());
        this.FetchListResult = (function () {
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
        this.AsyncIterable = (function () {
            function class_8(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_8;
        }());
        this.AsyncIterator = (function () {
            function class_9(_parent, _nextFunc, _params, _offset) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._offset = _offset;
                this._cachedOffset = _offset;
            }
            class_9.prototype['next'] = function () {
                var result = this._nextFunc(this._params, this._cachedOffset);
                this._cachedOffset = this._cachedOffset + result.value[this._parent._DATA].length;
                return Promise.resolve(result);
            };
            return class_9;
        }());
        this.AsyncIteratorResult = (function () {
            function class_10(_parent, value, done) {
                this._parent = _parent;
                this.value = value;
                this.done = done;
                this[_parent._VALUE] = value;
                this[_parent._DONE] = done;
            }
            return class_10;
        }());
        this.DataProviderMutationEventDetail = (function () {
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
        this.DataProviderOperationEventDetail = (function () {
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
        this.DataProviderAddOperationEventDetail = (function () {
            function class_13(_parent, keys, afterKeys, metadata, data, indexes) {
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
            return class_13;
        }());
        this._cachedIndexMap = [];
        this._sequenceNum = 0;
        this._subscribeObservableArray(data);
        if (options != null && options[this._KEYS] != null) {
            this._keysSpecified = true;
            this._keys = options[this._KEYS];
        }
    }
    ArrayDataProvider.prototype.containsKeys = function (params) {
        var self = this;
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            var results = new Set();
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
        var results = new Map();
        params[this._KEYS].forEach(function (key) {
            var findKeyIndex = self._getKeys().indexOf(key);
            if (findKeyIndex >= 0) {
                results.set(key, new self.Item(self, new self.ItemMetadata(self, key), self._getRowData()[findKeyIndex]));
            }
        });
        return Promise.resolve(new this.FetchByKeysResults(this, params, results));
    };
    ArrayDataProvider.prototype.fetchByOffset = function (params) {
        var self = this;
        var size = params != null ? params[this._SIZE] : -1;
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        var offset = params != null ? params[this._OFFSET] > 0 ? params[this._OFFSET] : 0 : 0;
        this._generateKeysIfNeeded();
        var fetchParams = new this.FetchListParameters(this, size, sortCriteria);
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
    ArrayDataProvider.prototype.fetchFirst = function (params) {
        var offset = 0;
        return new this.AsyncIterable(this, new this.AsyncIterator(this, this._fetchFrom.bind(this), params, offset));
    };
    ArrayDataProvider.prototype.getCapability = function (capabilityName) {
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
        return null;
    };
    ArrayDataProvider.prototype.getTotalSize = function () {
        return Promise.resolve(this._getRowData().length);
    };
    ArrayDataProvider.prototype.isEmpty = function () {
        return this._getRowData().length > 0 ? 'no' : 'yes';
    };
    ArrayDataProvider.prototype._getRowData = function () {
        if (!(this[this._DATA] instanceof Array)) {
            return this[this._DATA]();
        }
        return this[this._DATA];
    };
    ArrayDataProvider.prototype._getKeys = function () {
        if (this._keys != null &&
            !(this._keys instanceof Array)) {
            return this._keys();
        }
        return this._keys;
    };
    ArrayDataProvider.prototype._subscribeObservableArray = function (data) {
        if (!(data instanceof Array)) {
            if (!this._isObservableArray(data)) {
                throw new Error('Invalid data type. ArrayDataProvider only supports Array or observableArray.');
            }
            var self = this;
            data['subscribe'](function (changes) {
                var i, id, dataArray = [], keyArray = [], indexArray = [], metadataArray = [], afterKeyArray = [];
                var foundDelete = false;
                var foundAdd = false;
                var dispatchRefreshEvent = false;
                for (i = 0; i < changes.length; i++) {
                    if (changes[i]['status'] === 'deleted') {
                        foundDelete = true;
                        break;
                    }
                }
                for (i = 0; i < changes.length; i++) {
                    if (changes[i]['status'] === 'added') {
                        foundAdd = true;
                        break;
                    }
                }
                if (foundAdd && foundDelete) {
                    dispatchRefreshEvent = true;
                }
                if (foundDelete) {
                    for (i = 0; i < changes.length; i++) {
                        if (changes[i]['status'] === 'deleted') {
                            keyArray.push(self._getKeys()[changes[i].index]);
                            dataArray.push(changes[i].value);
                            indexArray.push(changes[i].index);
                        }
                    }
                    if (keyArray.length > 0) {
                        keyArray.map(function (key) {
                            var keyIndex = self._getKeys().indexOf(key);
                            self._keys.splice(keyIndex, 1);
                        });
                    }
                    if (keyArray.length > 0 && !dispatchRefreshEvent) {
                        metadataArray = keyArray.map(function (value) {
                            return new self.ItemMetadata(self, value);
                        });
                        var keySet_1 = new Set();
                        keyArray.map(function (key) {
                            keySet_1.add(key);
                        });
                        var operationEventDetail = new self.DataProviderOperationEventDetail(self, keySet_1, metadataArray, dataArray, indexArray);
                        var mutationEventDetail = new self.DataProviderMutationEventDetail(self, null, operationEventDetail, null);
                        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
                    }
                }
                if (foundAdd) {
                    for (i = 0; i < changes.length; i++) {
                        if (changes[i]['status'] === 'added') {
                            self._generateKeysIfNeeded();
                            id = self._getId(changes[i].value);
                            if (id == null) {
                                id = self._getKeys()[changes[i].index];
                            }
                            if (id == null) {
                                id = self._sequenceNum++;
                                self._keys.splice(changes[i].index, 0, id);
                            }
                            if (self._getKeys().indexOf(id) == -1) {
                                self._keys.splice(changes[i].index, 0, id);
                            }
                            keyArray.push(id);
                            var afterKey = self._getKeys()[changes[i].index + 1];
                            afterKey = afterKey == null ? '' : afterKey;
                            afterKeyArray.push(afterKey);
                            dataArray.push(changes[i].value);
                            indexArray.push(changes[i].index);
                        }
                    }
                    if (keyArray.length > 0 && !dispatchRefreshEvent) {
                        metadataArray = keyArray.map(function (value) {
                            return new self.ItemMetadata(self, value);
                        });
                        var keySet_2 = new Set();
                        keyArray.map(function (key) {
                            keySet_2.add(key);
                        });
                        var afterKeySet_1 = new Set();
                        afterKeyArray.map(function (key) {
                            afterKeySet_1.add(key);
                        });
                        var operationEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet_2, afterKeySet_1, metadataArray, dataArray, indexArray);
                        var mutationEventDetail = new self.DataProviderMutationEventDetail(self, operationEventDetail, null, null);
                        self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
                    }
                    if (dispatchRefreshEvent) {
                        self.dispatchEvent(new oj.DataProviderRefreshEvent());
                    }
                }
            }, null, 'arrayChange');
        }
    };
    ArrayDataProvider.prototype._isObservableArray = function (obj) {
        return ko.isObservable(obj) && !(obj['destroyAll'] === undefined);
    };
    ArrayDataProvider.prototype._generateKeysIfNeeded = function () {
        if (this._keys == null) {
            var idAttribute = this.options != null ? this.options[this._IDATTRIBUTE] : null;
            this._keys = [];
            var rowData = this._getRowData();
            var id = void 0, i = 0;
            for (i = 0; i < rowData.length; i++) {
                id = this._getId(rowData[i]);
                if (id == null || idAttribute == '@index') {
                    id = this._sequenceNum++;
                }
                this._keys[i] = id;
            }
            return true;
        }
        return false;
    };
    ArrayDataProvider.prototype._getId = function (row) {
        var id;
        var idAttribute = this.options != null ? this.options[this._IDATTRIBUTE] : null;
        if (idAttribute != null) {
            if (Array.isArray(idAttribute)) {
                var i;
                id = [];
                for (i = 0; i < idAttribute.length; i++) {
                    id[i] = this._getVal(row, idAttribute[i]);
                }
            }
            else if (idAttribute == '@value') {
                id = this._getAllVals(row);
            }
            else {
                id = this._getVal(row, idAttribute);
            }
            return id;
        }
        else {
            return null;
        }
    };
    ;
    ArrayDataProvider.prototype._getVal = function (val, attr) {
        if (typeof (val[attr]) == 'function') {
            return val[attr]();
        }
        return val[attr];
    };
    ;
    ArrayDataProvider.prototype._getAllVals = function (val) {
        var self = this;
        return Object.keys(val).map(function (key) {
            return self._getVal(val, key);
        });
    };
    ;
    ArrayDataProvider.prototype._fetchFrom = function (params, offset) {
        var self = this;
        this._generateKeysIfNeeded();
        var sortCriteria = params != null ? params[this._SORTCRITERIA] : null;
        var indexMap = this._getCachedIndexMap(sortCriteria);
        var mappedData = indexMap.map(function (index) {
            return self._getRowData()[index];
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
    ArrayDataProvider.prototype._getCachedIndexMap = function (sortCriteria) {
        var dataIndexes = this._getRowData().map(function (value, index) {
            return index;
        });
        var indexMap = this._sortData(dataIndexes, sortCriteria);
        return indexMap;
    };
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
    ArrayDataProvider.prototype._getSortComparator = function (sortCriteria) {
        var self = this;
        return function (x, y) {
            var sortComparators = self.options != null ? self.options[self._SORTCOMPARATORS] : null;
            var i, direction, attribute, comparator;
            for (i = 0; i < sortCriteria.length; i++) {
                direction = sortCriteria[i][self._DIRECTION];
                attribute = sortCriteria[i][self._ATTRIBUTE];
                comparator = null;
                if (sortComparators != null) {
                    comparator = sortComparators[self._COMPARATORS].get(attribute);
                }
                if (comparator != null) {
                    var descendingResult = direction == 'descending' ? -1 : 1;
                    var comparatorResult = comparator(x.value[attribute], y.value[attribute]) * descendingResult;
                    if (comparatorResult != 0) {
                        return comparatorResult;
                    }
                }
                else {
                    var compareResult = 0;
                    var strX = (typeof x.value[attribute] === 'string') ? x.value[attribute] : new String(x.value[attribute]);
                    var strY = (typeof y.value[attribute] === 'string') ? y.value[attribute] : new String(y.value[attribute]);
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
    ArrayDataProvider.prototype._mergeSortCriteria = function (sortCriteria) {
        var implicitSort = this.options != null ? this.options[this._IMPLICITSORT] : null;
        if (implicitSort != null) {
            if (sortCriteria == null) {
                return implicitSort;
            }
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
    return ArrayDataProvider;
}());
oj['ArrayDataProvider'] = ArrayDataProvider;
oj.EventTargetMixin.applyMixin(ArrayDataProvider);
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.containsKeys', { containsKeys: ArrayDataProvider.prototype.containsKeys });
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.fetchByKeys', { fetchByKeys: ArrayDataProvider.prototype.fetchByKeys });
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.fetchByOffset', { fetchByOffset: ArrayDataProvider.prototype.fetchByOffset });
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.fetchFirst', { fetchFirst: ArrayDataProvider.prototype.fetchFirst });
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.getCapability', { getCapability: ArrayDataProvider.prototype.getCapability });
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.getTotalSize', { getTotalSize: ArrayDataProvider.prototype.getTotalSize });
oj.Object.exportPrototypeSymbol('ArrayDataProvider.prototype.isEmpty', { isEmpty: ArrayDataProvider.prototype.isEmpty });

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
 * @interface oj.SortComparators
 */


/**
 * Sort comparators. Map of attribute to comparator function.
 * 
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.SortComparators
 * @instance
 * @name comparators
 * @type {Map.<string, Function>}
 */

/**
 * End of jsdoc
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

/*jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @export
 * @class oj.ArrayDataProvider
 * @implements oj.DataProvider
 * @classdesc This class implements {@link oj.DataProvider}.  
 *            Object representing data available from an array.  This dataprovider can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 *            See the <a href="../jetCookbook.html?component=table&demo=basicTable">Table - Base Table</a> demo for an example.<br><br>
 *            The default sorting algorithm used when a sortCriteria is passed into fetchFirst is natural sort.
 * @param {Array|function():Array} data data supported by the components
 *                                      <p>This can be either an Array, or a Knockout observableArray.</p>
 * @param {Object=} options Options for the ArrayDataProvider
 * @param {oj.SortComparators=} options.sortComparators Optional {@link oj.sortComparator} to use for sort.
 * @param {Array.<oj.SortCriterion>=} options.implicitSort Optional array of {@link oj.sortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * @param {(Array|function():Array)=} options.keys Optional keys for the data. If not supplied, then the keys are generated according options.idAttribute. If that is also not supplied then index is used as key. 
 * @param {(string | Array.<string>)=} options.idAttribute Optionally the field name which stores the id in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 * @example
 * // First initialize an array
 * var deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an ArrayDataProvider object with the array
 * var dataprovider = new oj.ArrayDataProvider(deptArray, {idAttribute: 'DepartmentId'});
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
 */

/**
 * Determines whether this DataProvider supports certain feature.
 * 
 * @ojstatus preview
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort"
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
 * @return {string} a string that indicates if this data provider is empty. Valid values are:
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
