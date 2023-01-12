/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import ojMap from 'ojs/ojmap';
import ojSet from 'ojs/ojset';
import { FilterFactory, DataProviderRefreshEvent, DataProviderMutationEvent } from 'ojs/ojdataprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import { warn } from 'ojs/ojlogger';

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
 * @class MutableArrayDataProvider
 * @implements DataProvider
 * @classdesc This class implements {@link DataProvider}.
 *            Object representing data available from an array.
 *            This dataprovider can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 *            See the MutableArrayDataProvider and Table - Base Table demos for examples.<br><br>
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
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
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
 * <pre class="prettyprint"><code>let listener = function(event) {
 *   if (event.detail.remove) {
 *     const removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 *
 * @param {Array=} data data supported by the components.
 *  <p>If the data array is frozen, it will be used by MutableArrayDataProvider directly.
 *  If it is not frozen, MutableArrayDataProvider will make a shallow copy and use the copy.
 *  Mutations to the original array will not be reflected in MutableArrayDataProvider.
 *  The only way to mutate the data in MutableArrayDataProvider is by setting the "data" property to another array.
 *  </p>
 * @param {MutableArrayDataProvider.Options=} options Options for the ArrayDataProvider
 * @ojsignature [{target: "Type",
 *               value: "class MutableArrayDataProvider<K, D> implements DataProvider<K, D>",
 *               genericTypeParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "MutableArrayDataProvider.Options<D>",
 *               for: "options"}]
 *
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 * @ojtsexample
 * // First initialize an array
 * let deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an MutableArrayDataProvider object with the array
 * let dataprovider = new MutableArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 * @example
 * // First initialize an array
 * let deptArray = [{DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200},
 *                  {DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200},
 *                  {DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200}];
 * // Then create an MutableArrayDataProvider object with the array
 * let dataprovider = new MutableArrayDataProvider(deptArray, {keyAttributes: 'DepartmentId'});
 */

/**
 * @typedef {Object} MutableArrayDataProvider.SortComparators
 * @property {Object} comparators - Sort comparators. Map of attribute to comparator function.
 * @ojsignature [
 *   {target: "Type", value: "<D>", for: "genericTypeParameters"},
 *   {target: "Type", value: "Map<keyof D, (a: any, b: any) => number>", for: "comparators"}]
 */

/**
 * <p>The underlying data array.
 * </p>
 * <p>Applications can get and set this property directly, such as setting it to a different array.
 * </p>
 * <p>The array returned by the "data" property is frozen.  Applications cannot call array mutation methods
 * such as splice or push on "data" directly.  Applications need to make a copy of the array, mutate the copy,
 * and set it back into the "data" property.
 * </p>
 * <p>When setting this property, MutableArrayDataProvider will shallow compare the new data array with
 * the existing data array to determine if it can fire "mutate" event with add/remove/update details.
 * It will fire the "refresh" event if it cannot make that determination (e.g. if the two arrays are vastly different.)
 * </p>
 * @since 10.0.0
 * @name data
 * @export
 * @expose
 * @memberof MutableArrayDataProvider
 * @instance
 * @property {D[]} data
 * @ojsignature {target: "Type", value: "D[]"}
 */

/**
 * @typedef {Object} MutableArrayDataProvider.Options
 * @property {MutableArrayDataProvider.SortComparators=} sortComparators - Optional sortComparator for custom sort.
 * <p>
 * Sort follows JavaScript's localeCompare <code>{numeric: true}</code>.
 * Please check {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#numeric_sorting|String.prototype.localeCompare()} for details.
 * </p>
 * <p>
 * For numbers, we convert them into strings then compare them with localeCompare, which may not sort floating point numbers based on their numeric values.
 * If you want to sort floating point numbers based on their numeric values, sortComparator can be used to do a custom sort.
 * </p>
 * <p>
 * For undefined and null values, they are considered as the largest values during sorting. For an empty string, it is considered as the smallest value during sorting.
 * </p>
 * @property {SortCriterion=} implicitSort - Optional array of {@link SortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * This is used for cases where we would like display some indication that the data is already sorted.
 * For example, ojTable will display the column sort indicator for the corresponding column in either ascending or descending order upon initial render.
 * This option is not used for cases where we want the MutableArrayDataProvider to apply a sort on initial fetch.
 * For those cases, please wrap in a ListDataProviderView and set the sortCriteria property on it.
 * @property {string=} keyAttributes - Optionally the field name which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                  of strings for multiple key attributes. Please note that the ids in MutableArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations. @index causes MutableArrayDataProvider to use index as key and @value will cause MutableArrayDataProvider to
 *                                                  use all attributes as key. @index is the default.
 * @property {string=} textFilterAttributes - Optionally specify which attributes the filter should be applied on when a TextFilter filterCriteria is specified. If this option is not specified then the filter will be applied to all attributes.
 * @ojsignature [
 *  {target: "Type", value: "<D>", for: "genericTypeParameters"},
 *  {target: "Type", value: "MutableArrayDataProvider.SortComparators<D>", for: "sortComparators"},
 *  {target: "Type", value: "Array<SortCriterion<D>>", for: "implicitSort"},
 *  {target: "Type", value: "string | string[]", for: "keyAttributes"},
 *  {target: "Type", value: "string[]", for: "textFilterAttributes"},
 * ]
 * @ojtsexample <caption>Examples for sortComparator</caption>
 * // Custom comparator for date
 * let comparator = function (a, b) {
 *    if (a === b) {
 *      return 0;
 *    }
 *
 *    let dateA = new Date(a).getTime();
 *    let dateB = new Date(b).getTime();
 *    return dateA > dateB ? 1 : -1;
 * };
 * // Then create an MutableArrayDataProvider object and set Date field to use the this comparator
 * this.dataprovider = new MutableArrayDataProvider(JSON.parse(deptArray), {
 *    keyAttributes: "DepartmentId",
 *    sortComparators: { comparators: new Map().set("Date", comparator) },
 * });
 * @ojtsexample
 * // Custom comparator for number
 * let comparator = function (a, b) {
 *    return a - b;
 *  };
 * // Then create an MutableArrayDataProvider object and set Salary field to use the this comparator
 * this.dataprovider = new MutableArrayDataProvider(JSON.parse(deptArray), {
 *    keyAttributes: "DepartmentId",
 *    sortComparators: { comparators: new Map().set("Salary", comparator) },
 * });
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof MutableArrayDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

// end of jsdoc

class MutableArrayDataProvider {
    constructor(_data, options) {
        var _a;
        this._data = _data;
        this.options = options;
        this.findMovesInArrayComparison = (left, right, limitFailedCompares) => {
            if (left.length && right.length) {
                let failedCompares, l, r, leftItem, rightItem;
                for (failedCompares = l = 0; (!limitFailedCompares || failedCompares < limitFailedCompares) && (leftItem = left[l]); ++l) {
                    for (r = 0; (rightItem = right[r]); ++r) {
                        if (leftItem['value'] === rightItem['value']) {
                            leftItem['moved'] = rightItem['index'];
                            rightItem['moved'] = leftItem['index'];
                            right.splice(r, 1);
                            failedCompares = r = 0;
                            break;
                        }
                    }
                    failedCompares += r;
                }
            }
        };
        this.Item = class {
            constructor(metadata, data) {
                this.metadata = metadata;
                this.data = data;
                this[MutableArrayDataProvider._METADATA] = metadata;
                this[MutableArrayDataProvider._DATA] = data;
            }
        };
        this.ItemMetadata = class {
            constructor(key) {
                this.key = key;
                this[MutableArrayDataProvider._KEY] = key;
            }
        };
        this.FetchByKeysResults = class {
            constructor(fetchParameters, results) {
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[MutableArrayDataProvider._FETCHPARAMETERS] = fetchParameters;
                this[MutableArrayDataProvider._RESULTS] = results;
            }
        };
        this.ContainsKeysResults = class {
            constructor(containsParameters, results) {
                this.containsParameters = containsParameters;
                this.results = results;
                this[MutableArrayDataProvider._CONTAINSPARAMETERS] = containsParameters;
                this[MutableArrayDataProvider._RESULTS] = results;
            }
        };
        this.FetchByOffsetResults = class {
            constructor(fetchParameters, results, done, totalFilteredRowCount) {
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this.totalFilteredRowCount = totalFilteredRowCount;
                this[MutableArrayDataProvider._FETCHPARAMETERS] = fetchParameters;
                this[MutableArrayDataProvider._RESULTS] = results;
                this[MutableArrayDataProvider._DONE] = done;
                if ((fetchParameters === null || fetchParameters === void 0 ? void 0 : fetchParameters.includeFilteredRowCount) === 'enabled') {
                    this[MutableArrayDataProvider._TOTALFILTEREDROWCOUNR] = totalFilteredRowCount;
                }
            }
        };
        this.FetchListParameters = class {
            constructor(size, sortCriteria, filterCriterion, attributes) {
                this.size = size;
                this.sortCriteria = sortCriteria;
                this.filterCriterion = filterCriterion;
                this.attributes = attributes;
                this[MutableArrayDataProvider._SIZE] = size;
                this[MutableArrayDataProvider._SORTCRITERIA] = sortCriteria;
                this[MutableArrayDataProvider._FILTERCRITERION] = filterCriterion;
                this[MutableArrayDataProvider._ATTRIBUTES] = attributes;
            }
        };
        this.FetchListResult = class {
            constructor(fetchParameters, data, metadata) {
                this.fetchParameters = fetchParameters;
                this.data = data;
                this.metadata = metadata;
                this[MutableArrayDataProvider._FETCHPARAMETERS] = fetchParameters;
                this[MutableArrayDataProvider._DATA] = data;
                this[MutableArrayDataProvider._METADATA] = metadata;
            }
        };
        this.AsyncIterable = (_a = class {
                constructor(_asyncIterator) {
                    this._asyncIterator = _asyncIterator;
                    this[Symbol.asyncIterator] = () => {
                        return this._asyncIterator;
                    };
                }
            },
            Symbol.asyncIterator,
            _a);
        this.AsyncIterator = class {
            constructor(_parent, _nextFunc, _params, _offset) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._offset = _offset;
                this._clientId = (_params && _params.clientId) || Symbol();
                _parent._mapClientIdToOffset.set(this._clientId, _offset);
                this._cacheObj = {};
                this._cacheObj[MutableArrayDataProvider._MUTATIONSEQUENCENUM] = _parent._mutationSequenceNum;
            }
            ['next']() {
                const cachedOffset = this._parent._mapClientIdToOffset.get(this._clientId);
                const resultObj = this._nextFunc(this._params, cachedOffset, false, this._cacheObj);
                this._parent._mapClientIdToOffset.set(this._clientId, resultObj.offset);
                Object.defineProperty(resultObj.result.value, 'totalFilteredRowCount', {
                    get: () => {
                        var _a;
                        if (((_a = this._params) === null || _a === void 0 ? void 0 : _a.includeFilteredRowCount) === 'enabled') {
                            if (this._totalFilteredRowCount === undefined ||
                                this._parent._resetTotalFilteredRowCount) {
                                this._totalFilteredRowCount = this._parent._getTotalFilteredRowCount(this._params);
                                this._parent._resetTotalFilteredRowCount = false;
                            }
                            return this._totalFilteredRowCount;
                        }
                    },
                    enumerable: true
                });
                return Promise.resolve(resultObj.result);
            }
        };
        this.AsyncIteratorYieldResult = class {
            constructor(value) {
                this.value = value;
                this[MutableArrayDataProvider._VALUE] = value;
                this[MutableArrayDataProvider._DONE] = false;
            }
        };
        this.AsyncIteratorReturnResult = class {
            constructor(value) {
                this.value = value;
                this[MutableArrayDataProvider._VALUE] = value;
                this[MutableArrayDataProvider._DONE] = true;
            }
        };
        this.DataProviderMutationEventDetail = class {
            constructor(_parent, add, remove, update) {
                this._parent = _parent;
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[MutableArrayDataProvider._ADD] = add;
                this[MutableArrayDataProvider._REMOVE] = remove;
                this[MutableArrayDataProvider._UPDATE] = update;
                Object.defineProperty(this, MutableArrayDataProvider._PARENT, {
                    value: _parent,
                    enumerable: false
                });
            }
        };
        this.DataProviderOperationEventDetail = class {
            constructor(_parent, keys, metadata, data, indexes) {
                this._parent = _parent;
                this.keys = keys;
                this.metadata = metadata;
                this.data = data;
                this.indexes = indexes;
                this[MutableArrayDataProvider._KEYS] = keys;
                this[MutableArrayDataProvider._METADATA] = metadata;
                this[MutableArrayDataProvider._DATA] = data;
                this[MutableArrayDataProvider._INDEXES] = indexes;
                Object.defineProperty(this, MutableArrayDataProvider._PARENT, {
                    value: _parent,
                    enumerable: false
                });
            }
        };
        this.DataProviderAddOperationEventDetail = class {
            constructor(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
                this._parent = _parent;
                this.keys = keys;
                this.afterKeys = afterKeys;
                this.addBeforeKeys = addBeforeKeys;
                this.metadata = metadata;
                this.data = data;
                this.indexes = indexes;
                this[MutableArrayDataProvider._KEYS] = keys;
                this[MutableArrayDataProvider._AFTERKEYS] = afterKeys;
                this[MutableArrayDataProvider._ADDBEFOREKEYS] = addBeforeKeys;
                this[MutableArrayDataProvider._METADATA] = metadata;
                this[MutableArrayDataProvider._DATA] = data;
                this[MutableArrayDataProvider._INDEXES] = indexes;
                Object.defineProperty(this, MutableArrayDataProvider._PARENT, {
                    value: _parent,
                    enumerable: false
                });
            }
        };
        this._sequenceNum = 0;
        this._mutationSequenceNum = 0;
        this._mapClientIdToOffset = new Map();
        this.data = _data;
    }
    set data(value) {
        const oldData = this._data == undefined ? [] : this._data.slice();
        if (Array.isArray(value)) {
            if (Object.isFrozen(value)) {
                this._data = value;
            }
            else {
                this._data = value.slice();
                Object.freeze(this._data);
            }
        }
        else {
            this._data = value == undefined ? [] : [].concat(value);
        }
        if (((oldData == undefined || oldData.length === 0) &&
            this._data != undefined &&
            this._data.length > 0) ||
            ((this._data == undefined || this._data.length === 0) &&
                oldData != undefined &&
                oldData.length > 0)) {
            this._keys = null;
            this._dataRefreshed(this._data);
            this._resetTotalFilteredRowCount = true;
        }
        else {
            this._changes = this.compareArrays(oldData, this._data, false);
            if (this._changes != null && this._changes.length > 0) {
                this._resetTotalFilteredRowCount = true;
                this._dataMutated(this._changes);
                this._dataRefreshed(this._data);
            }
        }
    }
    get data() {
        return this._data;
    }
    get dataChanges() {
        return this._changes;
    }
    containsKeys(params) {
        const self = this;
        return this.fetchByKeys(params).then((fetchByKeysResult) => {
            const results = new ojSet();
            params[MutableArrayDataProvider._KEYS].forEach((key) => {
                if (fetchByKeysResult[MutableArrayDataProvider._RESULTS].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve(new self.ContainsKeysResults(params, results));
        });
    }
    fetchByKeys(params) {
        const self = this;
        this._generateKeysIfNeeded();
        const results = new ojMap();
        const keys = this._getKeys();
        const fetchAttributes = params != null ? params[MutableArrayDataProvider._ATTRIBUTES] : null;
        let findKeyIndex, i = 0;
        if (params) {
            const rowData = self._getRowData();
            params[MutableArrayDataProvider._KEYS].forEach((searchKey) => {
                findKeyIndex = null;
                for (i = 0; i < keys.length; i++) {
                    if (oj.Object.compareValues(keys[i], searchKey)) {
                        findKeyIndex = i;
                        break;
                    }
                }
                if (findKeyIndex != null && findKeyIndex >= 0) {
                    let row = rowData[findKeyIndex];
                    if (fetchAttributes && fetchAttributes.length > 0) {
                        const updatedData = {};
                        self._filterRowAttributes(fetchAttributes, row, updatedData);
                        row = updatedData;
                    }
                    results.set(searchKey, new self.Item(new self.ItemMetadata(searchKey), row));
                }
            });
            return Promise.resolve(new self.FetchByKeysResults(params, results));
        }
        else {
            return Promise.reject('Keys are a required parameter');
        }
    }
    fetchByOffset(params) {
        const self = this;
        const size = params != null ? params[MutableArrayDataProvider._SIZE] : -1;
        const sortCriteria = params != null ? params[MutableArrayDataProvider._SORTCRITERIA] : null;
        const offset = params != null
            ? params[MutableArrayDataProvider._OFFSET] > 0
                ? params[MutableArrayDataProvider._OFFSET]
                : 0
            : 0;
        const fetchAttributes = params != null ? params[MutableArrayDataProvider._ATTRIBUTES] : null;
        const filterCriterion = params != null ? params[MutableArrayDataProvider._FILTERCRITERION] : null;
        this._generateKeysIfNeeded();
        let resultsArray = [];
        let done = true;
        let totalFilteredRowCount;
        if (params) {
            const fetchParams = new this.FetchListParameters(size, sortCriteria, filterCriterion, fetchAttributes);
            const iteratorResults = this._fetchFrom(fetchParams, offset, true).result;
            if (fetchParams[MutableArrayDataProvider._SORTCRITERIA]) {
                params[MutableArrayDataProvider._SORTCRITERIA] =
                    fetchParams[MutableArrayDataProvider._SORTCRITERIA];
            }
            const value = iteratorResults[MutableArrayDataProvider._VALUE];
            done = iteratorResults[MutableArrayDataProvider._DONE];
            const data = value[MutableArrayDataProvider._DATA];
            const keys = value[MutableArrayDataProvider._METADATA].map((value) => {
                return value[MutableArrayDataProvider._KEY];
            });
            resultsArray = data.map((value, index) => {
                return new self.Item(new self.ItemMetadata(keys[index]), value);
            });
            if (params.includeFilteredRowCount === 'enabled') {
                totalFilteredRowCount = this._getTotalFilteredRowCount(params);
            }
            return Promise.resolve(new this.FetchByOffsetResults(params, resultsArray, done, totalFilteredRowCount));
        }
        else {
            return Promise.reject('Offset is a required parameter');
        }
    }
    _getTotalFilteredRowCount(params) {
        const rowData = this._getRowData();
        const filterDef = params ? params[MutableArrayDataProvider._FILTERCRITERION] : null;
        let totalFilteredRowCount = -1;
        if (filterDef) {
            totalFilteredRowCount = 0;
            let filterCriterion = FilterFactory.getFilter({
                filterDef: filterDef,
                filterOptions: this.options
            });
            for (let i = 0; i < rowData.length; i++) {
                if (filterCriterion.filter(rowData[i])) {
                    ++totalFilteredRowCount;
                }
            }
        }
        else {
            totalFilteredRowCount = rowData.length;
        }
        return totalFilteredRowCount;
    }
    fetchFirst(params) {
        const offset = 0;
        return new this.AsyncIterable(new this.AsyncIterator(this, this._fetchFrom.bind(this), params, offset));
    }
    getCapability(capabilityName) {
        return MutableArrayDataProvider.getCapability(capabilityName);
    }
    static _getFetchCapability() {
        const exclusionFeature = new Set();
        exclusionFeature.add('exclusion');
        return {
            caching: 'all',
            attributeFilter: {
                expansion: {},
                ordering: {},
                defaultShape: {
                    features: exclusionFeature
                }
            }
        };
    }
    static getCapability(capabilityName) {
        if (capabilityName === 'sort') {
            return { attributes: 'multiple' };
        }
        else if (capabilityName === 'fetchByKeys') {
            return Object.assign({ implementation: 'lookup' }, MutableArrayDataProvider._getFetchCapability());
        }
        else if (capabilityName === 'fetchByOffset') {
            return Object.assign({ implementation: 'randomAccess', totalFilteredRowCount: 'exact' }, MutableArrayDataProvider._getFetchCapability());
        }
        else if (capabilityName === 'fetchFirst') {
            return Object.assign({ iterationSpeed: 'immediate', totalFilteredRowCount: 'exact' }, MutableArrayDataProvider._getFetchCapability());
        }
        else if (capabilityName === 'fetchCapability') {
            return MutableArrayDataProvider._getFetchCapability();
        }
        else if (capabilityName === 'filter') {
            return {
                operators: [
                    '$co',
                    '$eq',
                    '$ew',
                    '$pr',
                    '$gt',
                    '$ge',
                    '$lt',
                    '$le',
                    '$ne',
                    '$regex',
                    '$sw',
                    '$exists'
                ],
                attributeExpression: ['*'],
                textFilter: {},
                nestedFilter: {},
                collationOptions: {
                    sensitivity: ['base', 'accent', 'case', 'variant']
                }
            };
        }
        return null;
    }
    getTotalSize() {
        return Promise.resolve(this._getRowData().length);
    }
    isEmpty() {
        return this._getRowData().length > 0 ? 'no' : 'yes';
    }
    createOptimizedKeySet(initialSet) {
        return new ojSet(initialSet);
    }
    createOptimizedKeyMap(initialMap) {
        if (initialMap) {
            const map = new ojMap();
            initialMap.forEach((value, key) => {
                map.set(key, value);
            });
            return map;
        }
        return new ojMap();
    }
    _getRowData() {
        return this[MutableArrayDataProvider._DATA];
    }
    _getKeys() {
        if (this._keys != null && !(this._keys instanceof Array)) {
            return this._keys();
        }
        return this._keys;
    }
    _indexOfKey(searchKey) {
        const keys = this._getKeys();
        let keyIndex = -1;
        let i;
        for (i = 0; i < keys.length; i++) {
            if (oj.Object.compareValues(keys[i], searchKey)) {
                keyIndex = i;
                break;
            }
        }
        return keyIndex;
    }
    _adjustIteratorOffset(removeIndexes, addIndexes) {
        this._mapClientIdToOffset.forEach((offset, clientId) => {
            let addCount = 0;
            let deleteCount = 0;
            if (removeIndexes) {
                removeIndexes.forEach((index) => {
                    if (index < offset) {
                        ++deleteCount;
                    }
                });
            }
            offset -= deleteCount;
            if (addIndexes) {
                addIndexes.forEach((index) => {
                    if (index < offset) {
                        ++addCount;
                    }
                });
            }
            offset += addCount;
            this._mapClientIdToOffset.set(clientId, offset);
        });
    }
    compareArrays(oldArray, newArray, options) {
        const statusNotInOld = 'added';
        const statusNotInNew = 'deleted';
        options = typeof options === 'boolean' ? { dontLimitMoves: options } : options || {};
        oldArray = oldArray || [];
        newArray = newArray || [];
        if (oldArray.length < newArray.length) {
            return this.compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
        }
        else {
            return this.compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
        }
    }
    compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
        const myMin = Math.min;
        const myMax = Math.max;
        const editDistanceMatrix = [];
        let smlIndex;
        const smlIndexMax = smlArray.length;
        let bigIndex;
        const bigIndexMax = bigArray.length;
        const compareRange = bigIndexMax - smlIndexMax || 1;
        const maxDistance = smlIndexMax + bigIndexMax + 1;
        let thisRow;
        let lastRow;
        let bigIndexMaxForRow;
        let bigIndexMinForRow;
        for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
            lastRow = thisRow;
            editDistanceMatrix.push((thisRow = []));
            bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
            bigIndexMinForRow = myMax(0, smlIndex - 1);
            for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
                if (!bigIndex) {
                    thisRow[bigIndex] = smlIndex + 1;
                }
                else if (!smlIndex) {
                    thisRow[bigIndex] = bigIndex + 1;
                }
                else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1]) {
                    thisRow[bigIndex] = lastRow[bigIndex - 1];
                }
                else {
                    const northDistance = lastRow[bigIndex] || maxDistance;
                    const westDistance = thisRow[bigIndex - 1] || maxDistance;
                    thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
                }
            }
        }
        const editScript = [];
        let meMinusOne;
        const notInSml = [];
        const notInBig = [];
        for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
            meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
            if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex - 1]) {
                --bigIndex;
                notInSml.push((editScript[editScript.length] = {
                    status: statusNotInSml,
                    value: bigArray[bigIndex],
                    index: bigIndex
                }));
            }
            else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
                --smlIndex;
                notInBig.push((editScript[editScript.length] = {
                    status: statusNotInBig,
                    value: smlArray[smlIndex],
                    index: smlIndex
                }));
            }
            else {
                --bigIndex;
                --smlIndex;
            }
        }
        this.findMovesInArrayComparison(notInBig, notInSml, !options['dontLimitMoves'] && smlIndexMax * 10);
        return editScript.reverse();
    }
    _dataMutated(changes) {
        const self = this;
        let i, j, id, index, status, dataArray = [], keyArray = [], indexArray = [], metadataArray = [];
        const afterKeyArray = [];
        let addCount = 0;
        let deleteCount = 0;
        self._mutationSequenceNum++;
        let onlyAdds = true;
        let onlyDeletes = true;
        changes.forEach((change) => {
            if (change['status'] === 'deleted') {
                onlyAdds = false;
                ++deleteCount;
            }
            else if (change['status'] === 'added') {
                onlyDeletes = false;
                ++addCount;
            }
        });
        const updatedIndexes = [];
        const removeDuplicate = [];
        let operationUpdateEventDetail = null;
        let operationAddEventDetail = null;
        let operationRemoveEventDetail = null;
        const generatedKeys = self._generateKeysIfNeeded();
        if (!onlyAdds && !onlyDeletes) {
            for (i = 0; i < changes.length; i++) {
                index = changes[i].index;
                status = changes[i].status;
                const iKey = self._getId(changes[i].value);
                for (j = 0; j < changes.length; j++) {
                    if (j !== i &&
                        index === changes[j].index &&
                        status !== changes[j]['status'] &&
                        updatedIndexes.indexOf(i) < 0 &&
                        removeDuplicate.indexOf(i) < 0) {
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
                    const key = self._getKeys()[changes[i].index];
                    keyArray.push(key);
                    dataArray.push(changes[i].value);
                    indexArray.push(changes[i].index);
                }
            }
            if (keyArray.length > 0) {
                metadataArray = keyArray.map((value) => {
                    return new self.ItemMetadata(value);
                });
                const keySet = new ojSet();
                keyArray.forEach((key) => {
                    keySet.add(key);
                });
                operationUpdateEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, dataArray, indexArray);
            }
        }
        dataArray = [];
        keyArray = [];
        indexArray = [];
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
                keyArray.forEach((key) => {
                    const keyIndex = self._indexOfKey(key);
                    self._keys.splice(keyIndex, 1);
                });
            }
            if (keyArray.length > 0) {
                metadataArray = keyArray.map((value) => {
                    return new self.ItemMetadata(value);
                });
                const keySet = new ojSet();
                keyArray.forEach((key) => {
                    keySet.add(key);
                });
                operationRemoveEventDetail = new self.DataProviderOperationEventDetail(self, keySet, metadataArray, dataArray, indexArray);
            }
        }
        dataArray = [];
        keyArray = [];
        indexArray = [];
        if (!onlyDeletes) {
            const isInitiallyEmpty = self._getKeys() != null ? (self._getKeys().length > 0 ? false : true) : true;
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'added' &&
                    updatedIndexes.indexOf(i) < 0 &&
                    removeDuplicate.indexOf(i) < 0) {
                    id = self._getId(changes[i].value);
                    if (id == null && (generatedKeys || self._keysSpecified)) {
                        id = self._getKeys()[changes[i].index];
                    }
                    if (id == null) {
                        id = self._sequenceNum;
                        self._sequenceNum++;
                        self._keys.splice(changes[i].index, 0, id);
                    }
                    else if (isInitiallyEmpty || self._indexOfKey(id) === -1) {
                        self._keys.splice(changes[i].index, 0, id);
                    }
                    else if (!generatedKeys && !self._keysSpecified) {
                        warn('added row has duplicate key ' + id);
                        self._keys.splice(changes[i].index, 0, id);
                    }
                    keyArray.push(id);
                    dataArray.push(changes[i].value);
                    indexArray.push(changes[i].index);
                }
            }
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'added' &&
                    updatedIndexes.indexOf(i) < 0 &&
                    removeDuplicate.indexOf(i) < 0) {
                    let afterKey = self._getKeys()[changes[i].index + 1];
                    afterKey = afterKey == null ? null : afterKey;
                    afterKeyArray.push(afterKey);
                }
            }
            if (keyArray.length > 0) {
                metadataArray = keyArray.map((value) => {
                    return new self.ItemMetadata(value);
                });
                const keySet = new ojSet();
                keyArray.forEach((key) => {
                    keySet.add(key);
                });
                const afterKeySet = new ojSet();
                afterKeyArray.forEach((key) => {
                    afterKeySet.add(key);
                });
                operationAddEventDetail = new self.DataProviderAddOperationEventDetail(self, keySet, afterKeySet, afterKeyArray, metadataArray, dataArray, indexArray);
            }
        }
        self._fireMutationEvent(operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
    }
    _dataRefreshed(changes) {
        var _a, _b, _c, _d;
        const self = this;
        if (self._mutationEvent) {
            const detail = self._mutationEvent['detail'];
            self._adjustIteratorOffset((_a = detail.remove) === null || _a === void 0 ? void 0 : _a.indexes, (_b = detail.add) === null || _b === void 0 ? void 0 : _b.indexes);
            self.dispatchEvent(self._mutationEvent);
        }
        else if (self._mutationRemoveEvent || self._mutationAddEvent || self._mutationUpdateEvent) {
            if (self._mutationRemoveEvent) {
                const detail = self._mutationRemoveEvent['detail'];
                self._adjustIteratorOffset((_c = detail.remove) === null || _c === void 0 ? void 0 : _c.indexes, null);
                self.dispatchEvent(self._mutationRemoveEvent);
            }
            if (self._mutationAddEvent) {
                const detail = self._mutationAddEvent['detail'];
                self._adjustIteratorOffset(null, (_d = detail.add) === null || _d === void 0 ? void 0 : _d.indexes);
                self.dispatchEvent(self._mutationAddEvent);
            }
            if (self._mutationUpdateEvent) {
                self.dispatchEvent(self._mutationUpdateEvent);
            }
        }
        else {
            self.dispatchEvent(new DataProviderRefreshEvent());
        }
        self._mutationEvent = null;
        self._mutationRemoveEvent = null;
        self._mutationAddEvent = null;
        self._mutationUpdateEvent = null;
    }
    _fireMutationEvent(operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail) {
        const mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
        this._mutationEvent = new DataProviderMutationEvent(mutationEventDetail);
    }
    _hasSamePropValue(operationEventDetail1, operationEventDetail2, prop) {
        const errStr = '_hasSamePropValue is true';
        try {
            if (operationEventDetail1 && operationEventDetail1[prop]) {
                operationEventDetail1[prop].forEach((prop1) => {
                    if (operationEventDetail2 && operationEventDetail2[prop]) {
                        operationEventDetail2[prop].forEach((prop2) => {
                            if (oj.Object.compareValues(prop1, prop2)) {
                                throw errStr;
                            }
                        });
                    }
                });
            }
        }
        catch (e) {
            if (e === errStr) {
                return true;
            }
            else {
                throw e;
            }
        }
        return false;
    }
    _generateKeysIfNeeded() {
        if (this._keys == null) {
            const keyAttributes = this.options != null ? this.options[MutableArrayDataProvider._KEYATTRIBUTES] : null;
            this._keys = [];
            const rowData = this._getRowData();
            let id, i = 0;
            for (i = 0; i < rowData.length; i++) {
                id = this._getId(rowData[i]);
                if (id == null || keyAttributes === '@index') {
                    id = this._sequenceNum;
                    this._sequenceNum++;
                }
                this._keys[i] = id;
            }
            return true;
        }
        return false;
    }
    _getId(row) {
        let id;
        let keyAttributes = null;
        if (this.options != null && this.options[MutableArrayDataProvider._KEYATTRIBUTES] != null) {
            keyAttributes = this.options[MutableArrayDataProvider._KEYATTRIBUTES];
        }
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                let i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
                    id[i] = this._getVal(row, keyAttributes[i]);
                }
            }
            else if (keyAttributes === '@value') {
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
    }
    _getVal(val, attr) {
        if (typeof attr === 'string') {
            const dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                const startAttr = attr.substring(0, dotIndex);
                const endAttr = attr.substring(dotIndex + 1);
                const subObj = val[startAttr];
                if (subObj) {
                    return this._getVal(subObj, endAttr);
                }
            }
        }
        if (typeof val[attr] === 'function') {
            return val[attr]();
        }
        return val[attr];
    }
    _getAllVals(val) {
        if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
            return val;
        }
        const self = this;
        return Object.keys(val).map((key) => {
            return self._getVal(val, key);
        });
    }
    _fetchFrom(params, offset, useHasMore, cacheObj) {
        const self = this;
        const fetchAttributes = params != null ? params[MutableArrayDataProvider._ATTRIBUTES] : null;
        this._generateKeysIfNeeded();
        const sortCriteria = params != null ? params[MutableArrayDataProvider._SORTCRITERIA] : null;
        const indexMap = this._getCachedIndexMap(sortCriteria, cacheObj);
        const rowData = this._getRowData();
        const mappedData = indexMap.map((index) => {
            const row = rowData[index];
            return row;
        });
        const mappedKeys = indexMap.map((index) => {
            return self._getKeys()[index];
        });
        const fetchSize = params != null
            ? params[MutableArrayDataProvider._SIZE] > 0
                ? params[MutableArrayDataProvider._SIZE]
                : params[MutableArrayDataProvider._SIZE] < 0
                    ? self._getKeys().length
                    : 25
            : 25;
        let hasMore = offset + fetchSize < mappedData.length ? true : false;
        const mergedSortCriteria = this._mergeSortCriteria(sortCriteria);
        if (mergedSortCriteria != null) {
            params = params || {};
            params[MutableArrayDataProvider._SORTCRITERIA] = mergedSortCriteria;
        }
        let resultData = [];
        let resultKeys = [];
        let updatedOffset = 0;
        let filteredResultData;
        if (params != null && params[MutableArrayDataProvider._FILTERCRITERION]) {
            let filterCriterion = null;
            filterCriterion = FilterFactory.getFilter({
                filterDef: params[MutableArrayDataProvider._FILTERCRITERION],
                filterOptions: this.options
            });
            let i = 0;
            while (resultData.length < fetchSize && i < mappedData.length) {
                if (filterCriterion.filter(mappedData[i])) {
                    if (updatedOffset >= offset) {
                        resultData.push(mappedData[i]);
                        resultKeys.push(mappedKeys[i]);
                    }
                    updatedOffset++;
                }
                i++;
            }
            hasMore = i < mappedData.length ? true : false;
        }
        else {
            resultData = mappedData.slice(offset, offset + fetchSize);
            resultKeys = mappedKeys.slice(offset, offset + fetchSize);
        }
        updatedOffset = offset + resultData.length;
        filteredResultData = resultData.map((row) => {
            if (fetchAttributes && fetchAttributes.length > 0) {
                const updatedData = {};
                self._filterRowAttributes(fetchAttributes, row, updatedData);
                row = updatedData;
            }
            return row;
        });
        const resultMetadata = resultKeys.map((value) => {
            return new self.ItemMetadata(value);
        });
        const result = new this.FetchListResult(params, filteredResultData, resultMetadata);
        if (useHasMore ? hasMore : result.data.length > 0) {
            return {
                result: new this.AsyncIteratorYieldResult(result),
                offset: updatedOffset
            };
        }
        else {
            return {
                result: new this.AsyncIteratorReturnResult(result),
                offset: updatedOffset
            };
        }
    }
    _getCachedIndexMap(sortCriteria, cacheObj) {
        if (cacheObj &&
            cacheObj['indexMap'] &&
            cacheObj[MutableArrayDataProvider._MUTATIONSEQUENCENUM] === this._mutationSequenceNum) {
            return cacheObj['indexMap'];
        }
        const dataIndexes = this._getRowData().map((value, index) => {
            return index;
        });
        const indexMap = this._sortData(dataIndexes, sortCriteria);
        if (cacheObj) {
            cacheObj['indexMap'] = indexMap;
            cacheObj[MutableArrayDataProvider._MUTATIONSEQUENCENUM] = this._mutationSequenceNum;
        }
        return indexMap;
    }
    _sortData(indexMap, sortCriteria) {
        const self = this;
        const rowData = this._getRowData();
        const indexedData = indexMap.map((index) => {
            return { index: index, value: rowData[index] };
        });
        if (sortCriteria != null) {
            indexedData.sort(this._getSortComparator(sortCriteria));
        }
        return indexedData.map((item) => {
            return item.index;
        });
    }
    _getSortComparator(sortCriteria) {
        const self = this;
        return (x, y) => {
            const sortComparators = self.options != null ? self.options[MutableArrayDataProvider._SORTCOMPARATORS] : null;
            let i, direction, attribute, comparator, xval, yval;
            for (i = 0; i < sortCriteria.length; i++) {
                direction = sortCriteria[i][MutableArrayDataProvider._DIRECTION];
                attribute = sortCriteria[i][MutableArrayDataProvider._ATTRIBUTE];
                comparator = null;
                if (sortComparators != null) {
                    comparator = sortComparators[MutableArrayDataProvider._COMPARATORS].get(attribute);
                }
                xval = self._getVal(x.value, attribute);
                yval = self._getVal(y.value, attribute);
                if (comparator != null) {
                    const descendingResult = direction == 'descending' ? -1 : 1;
                    const comparatorResult = comparator(xval, yval) * descendingResult;
                    if (comparatorResult != 0) {
                        return comparatorResult;
                    }
                }
                else {
                    let compareResult = 0;
                    const strX = typeof xval === 'string' ? xval : new String(xval).toString();
                    const strY = typeof yval === 'string' ? yval : new String(yval).toString();
                    if (direction === 'ascending') {
                        if (strX === 'null' || strX === 'undefined') {
                            return 1;
                        }
                        if (strY === 'null' || strY === 'undefined') {
                            return -1;
                        }
                        compareResult = strX.localeCompare(strY, undefined, {
                            numeric: true,
                            sensitivity: 'base'
                        });
                    }
                    else {
                        if (strX === 'null' || strX === 'undefined') {
                            return -1;
                        }
                        if (strY === 'null' || strY === 'undefined') {
                            return 1;
                        }
                        compareResult = strY.localeCompare(strX, undefined, {
                            numeric: true,
                            sensitivity: 'base'
                        });
                    }
                    if (compareResult != 0) {
                        return compareResult;
                    }
                }
            }
            return 0;
        };
    }
    _mergeSortCriteria(sortCriteria) {
        var _a;
        if (sortCriteria && sortCriteria.length > 0) {
            return sortCriteria;
        }
        else {
            return (_a = this.options) === null || _a === void 0 ? void 0 : _a.implicitSort;
        }
    }
    _filterRowAttributes(fetchAttribute, data, updatedData) {
        const self = this;
        if (Array.isArray(fetchAttribute)) {
            let fetchAllAttributes = false;
            fetchAttribute.forEach((key) => {
                if (key == MutableArrayDataProvider._ATDEFAULT ||
                    key.name == MutableArrayDataProvider._ATDEFAULT) {
                    fetchAllAttributes = true;
                }
            });
            let i;
            Object.keys(data).forEach((dataAttr) => {
                if (fetchAllAttributes) {
                    let excludeAttribute = false;
                    let fetchAttr = dataAttr;
                    let attribute;
                    for (i = 0; i < fetchAttribute.length; i++) {
                        if (fetchAttribute[i] instanceof Object) {
                            attribute = fetchAttribute[i]['name'];
                        }
                        else {
                            attribute = fetchAttribute[i];
                        }
                        if (attribute.startsWith('!')) {
                            attribute = attribute.substr(1, attribute.length - 1);
                            if (attribute == dataAttr) {
                                excludeAttribute = true;
                                break;
                            }
                        }
                        else if (attribute == dataAttr) {
                            fetchAttr = fetchAttribute[i];
                            break;
                        }
                    }
                    if (!excludeAttribute) {
                        self._filterRowAttributes(fetchAttr, data, updatedData);
                    }
                }
                else {
                    fetchAttribute.forEach((fetchAttr) => {
                        let attribute;
                        if (fetchAttr instanceof Object) {
                            attribute = fetchAttr['name'];
                        }
                        else {
                            attribute = fetchAttr;
                        }
                        if (!attribute.startsWith('!') && attribute == dataAttr) {
                            self._filterRowAttributes(fetchAttr, data, updatedData);
                        }
                    });
                }
            });
        }
        else if (fetchAttribute instanceof Object) {
            const name = fetchAttribute['name'];
            const attributes = fetchAttribute['attributes'];
            if (name && !name.startsWith('!')) {
                if (data[name] instanceof Object && !Array.isArray(data[name]) && attributes) {
                    const updatedDataSubObj = {};
                    self._filterRowAttributes(attributes, data[name], updatedDataSubObj);
                    updatedData[name] = updatedDataSubObj;
                }
                else if (Array.isArray(data[name]) && attributes) {
                    updatedData[name] = [];
                    let updatedDataArrayItem;
                    data[name].forEach((arrVal, index) => {
                        updatedDataArrayItem = {};
                        self._filterRowAttributes(attributes, arrVal, updatedDataArrayItem);
                        updatedData[name][index] = updatedDataArrayItem;
                    });
                }
                else {
                    self._proxyAttribute(updatedData, data, name);
                }
            }
        }
        else {
            self._proxyAttribute(updatedData, data, fetchAttribute);
        }
    }
    _proxyAttribute(updatedData, data, attribute) {
        if (!updatedData || !data) {
            return;
        }
        Object.defineProperty(updatedData, attribute, {
            get() {
                return data[attribute];
            },
            set(val) {
                data[attribute] = val;
            },
            enumerable: true
        });
    }
}
MutableArrayDataProvider._KEY = 'key';
MutableArrayDataProvider._KEYS = 'keys';
MutableArrayDataProvider._AFTERKEYS = 'afterKeys';
MutableArrayDataProvider._ADDBEFOREKEYS = 'addBeforeKeys';
MutableArrayDataProvider._DIRECTION = 'direction';
MutableArrayDataProvider._ATTRIBUTE = 'attribute';
MutableArrayDataProvider._ATTRIBUTES = 'attributes';
MutableArrayDataProvider._SORT = 'sort';
MutableArrayDataProvider._SORTCRITERIA = 'sortCriteria';
MutableArrayDataProvider._FILTERCRITERION = 'filterCriterion';
MutableArrayDataProvider._DATA = '_data';
MutableArrayDataProvider._METADATA = 'metadata';
MutableArrayDataProvider._INDEXES = 'indexes';
MutableArrayDataProvider._OFFSET = 'offset';
MutableArrayDataProvider._SIZE = 'size';
MutableArrayDataProvider._IMPLICITSORT = 'implicitSort';
MutableArrayDataProvider._KEYATTRIBUTES = 'keyAttributes';
MutableArrayDataProvider._SORTCOMPARATORS = 'sortComparators';
MutableArrayDataProvider._COMPARATORS = 'comparators';
MutableArrayDataProvider._COMPARATOR = 'comparator';
MutableArrayDataProvider._RESULTS = 'results';
MutableArrayDataProvider._CONTAINS = 'contains';
MutableArrayDataProvider._FETCHPARAMETERS = 'fetchParameters';
MutableArrayDataProvider._CONTAINSPARAMETERS = 'containsParameters';
MutableArrayDataProvider._VALUE = 'value';
MutableArrayDataProvider._DONE = 'done';
MutableArrayDataProvider._ADD = 'add';
MutableArrayDataProvider._REMOVE = 'remove';
MutableArrayDataProvider._UPDATE = 'update';
MutableArrayDataProvider._DETAIL = 'detail';
MutableArrayDataProvider._FETCHLISTRESULT = 'fetchListResult';
MutableArrayDataProvider._ATDEFAULT = '@default';
MutableArrayDataProvider._MUTATIONSEQUENCENUM = 'mutationSequenceNum';
MutableArrayDataProvider._PARENT = '_parent';
MutableArrayDataProvider._TOTALFILTEREDROWCOUNR = 'totalFilteredRowCount';
EventTargetMixin.applyMixin(MutableArrayDataProvider);

export default MutableArrayDataProvider;
