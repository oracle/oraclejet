/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import 'ojs/ojcomponentcore';

/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 9.1.0
 * @export
 * @final
 * @class CachedIteratorResultsDataProvider
 * @implements DataProvider
 * @classdesc This is an internal wrapper class meant to be used by JET collection components to provide highwatermark scrolling optimizations.
 * This wrapper will cache the most results of the most recently invoked fetchFirst by attributes, filterCriterion, and sortCriteria.
 * @param {DataProvider} dataProvider the DataProvider.
 * @param {object=} options Optional specify that we want the total row count to be returned for this query
 * with any filterCriterion applied in backend data source.
 * @ojsignature [{target: "Type",
 *               value: "class CachedIteratorResultsDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"},
 *              {target: "Type",
 *               value: "{includeFilteredRowCount?: 'disabled' | 'enabled'}",
 *               for: "options"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 * @ojhidden
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof CachedIteratorResultsDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

// end of jsdoc

class CachedIteratorResultsDataProvider {
    constructor(dataProvider, options) {
        var _a, _b;
        this.dataProvider = dataProvider;
        this.options = options;
        this.CacheAsyncIterable = (_b = class {
                constructor(_parent, dataProviderAsyncIterator, params, cache) {
                    this._parent = _parent;
                    this.dataProviderAsyncIterator = dataProviderAsyncIterator;
                    this.params = params;
                    this.cache = cache;
                    this[_a] = () => {
                        return new this._parent.CacheAsyncIterator(this._parent, this.dataProviderAsyncIterator, this.params, this.cache);
                    };
                }
            },
            _a = Symbol.asyncIterator,
            _b);
        this.CacheAsyncIterator = class {
            constructor(_parent, asyncIterator, params, cache) {
                var _b, _c;
                this._parent = _parent;
                this.asyncIterator = asyncIterator;
                this.params = params;
                this.cache = cache;
                this._cachedOffset = 0;
                this._needLocalRowCount =
                    ((_b = _parent.options) === null || _b === void 0 ? void 0 : _b.includeFilteredRowCount) === 'enabled' &&
                        (params === null || params === void 0 ? void 0 : params.includeFilteredRowCount) === 'enabled' &&
                        ((_c = _parent._baseFetchFirstCapability) === null || _c === void 0 ? void 0 : _c.totalFilteredRowCount) !== 'exact';
            }
            ['next']() {
                const params = this.params;
                const size = (params === null || params === void 0 ? void 0 : params.size) ? params.size : -1;
                const signal = params === null || params === void 0 ? void 0 : params.signal;
                if (signal && signal.aborted) {
                    const reason = signal.reason;
                    return Promise.reject(new DOMException(reason, 'AbortError'));
                }
                return new Promise((resolve, reject) => {
                    if (signal) {
                        const reason = signal.reason;
                        signal.addEventListener('abort', (e) => {
                            return reject(new DOMException(reason, 'AbortError'));
                        });
                    }
                    if (this._needLocalRowCount && this._cachedOffset === 0) {
                        return resolve(this._checkCachedParamsAndIterate(params, -1).then((result) => {
                            return this._getResult(params, size, this._parent.cache.getSize());
                        }));
                    }
                    else {
                        return resolve(this._getResult(params, size, this._needLocalRowCount ? this._parent.cache.getSize() : undefined));
                    }
                });
            }
            _getResult(params, size, totalFilteredRowCount) {
                let result;
                if (size === -1) {
                    if (this.cache.isDone()) {
                        result = this.cache.getDataList(params, this._cachedOffset);
                        this._cachedOffset = this._cachedOffset + result.data.length;
                        return Promise.resolve(this._getFinalResult(result, totalFilteredRowCount));
                    }
                }
                else {
                    if (this.cache.getSize() >= this._cachedOffset + size || this.cache.isDone()) {
                        result = this.cache.getDataList(params, this._cachedOffset);
                        this._cachedOffset = this._cachedOffset + result.data.length;
                        return Promise.resolve(this._getFinalResult(result, totalFilteredRowCount));
                    }
                    else if (this._cachedOffset > 0) {
                        return new Promise((resolve, reject) => {
                            if (this._parent._getSharedIteratorState().fetchOffset < this._cachedOffset) {
                                const fetchUntilOffset = () => {
                                    return this._checkCachedParamsAndIterate(params, size).then((result) => {
                                        if (this._parent._getSharedIteratorState().fetchOffset >= this._cachedOffset ||
                                            result.done) {
                                            resolve();
                                        }
                                        else {
                                            return fetchUntilOffset();
                                        }
                                    });
                                };
                                return fetchUntilOffset();
                            }
                            else {
                                resolve();
                            }
                        }).then(() => {
                            return this._checkCachedParamsAndIterate(params, size).then((result) => {
                                this._cachedOffset = this._parent._getSharedIteratorState().fetchOffset;
                                return Promise.resolve(this._getFinalResult(result.value, totalFilteredRowCount));
                            });
                        });
                    }
                }
                return this._checkCachedParamsAndIterate(params, size).then((result) => {
                    this._cachedOffset = this._parent._getSharedIteratorState().fetchOffset;
                    return Promise.resolve(this._getFinalResult(result.value, totalFilteredRowCount));
                });
            }
            _getFinalResult(result, totalFilteredRowCount) {
                var _b;
                return ((_b = result === null || result === void 0 ? void 0 : result.data) === null || _b === void 0 ? void 0 : _b.length) > 0
                    ? new this._parent.CacheAsyncIteratorYieldResult(result, totalFilteredRowCount)
                    : new this._parent.CacheAsyncIteratorReturnResult(result, totalFilteredRowCount);
            }
            _checkCachedParamsAndIterate(params, size) {
                let asyncIteratorFetchPromise;
                let firstIteratorCachedFetchParams = this._parent._getSharedIteratorState().cachedFetchParams;
                let firstIteratorCachedFetchOffset = this._parent._getSharedIteratorState().fetchOffset;
                let firstIteratorCachedFetchPromise = this._parent._getSharedIteratorState().fetchPromise;
                if (firstIteratorCachedFetchPromise &&
                    this._cachedOffset === firstIteratorCachedFetchOffset &&
                    CachedIteratorResultsDataProvider._compareCachedFetchParameters(params, firstIteratorCachedFetchParams)) {
                    asyncIteratorFetchPromise = firstIteratorCachedFetchPromise;
                }
                else {
                    this._parent._getSharedIteratorState().cachedFetchParams =
                        CachedIteratorResultsDataProvider._createCachedFetchParams(params);
                    this._parent._getSharedIteratorState().fetchPromise = this.asyncIterator
                        .next()
                        .then((result) => {
                        this._parent._getSharedIteratorState().fetchOffset =
                            this._parent._getSharedIteratorState().fetchOffset + result.value.data.length;
                        this._parent._getSharedIteratorState().fetchPromise = null;
                        this.cache.addListResult(result);
                        if ((size === -1 && !this.cache.isDone()) ||
                            (size > 0 && !this.cache.isDone() && result.value.data.length < size)) {
                            return this.asyncIterator.next().then((finalResult) => {
                                this.cache.addListResult(finalResult);
                                return result;
                            });
                        }
                        return result;
                    });
                    asyncIteratorFetchPromise = this._parent._getSharedIteratorState().fetchPromise;
                }
                return asyncIteratorFetchPromise;
            }
        };
        this.CacheAsyncIteratorYieldResult = class {
            constructor(value, totalFilteredRowCount) {
                this.value = value;
                if (totalFilteredRowCount !== undefined) {
                    this[CachedIteratorResultsDataProvider._VALUE] = Object.assign({ totalFilteredRowCount }, value);
                }
                else {
                    this[CachedIteratorResultsDataProvider._VALUE] = value;
                }
                this[CachedIteratorResultsDataProvider._DONE] = false;
            }
        };
        this.CacheAsyncIteratorReturnResult = class {
            constructor(value, totalFilteredRowCount) {
                this.value = value;
                if (totalFilteredRowCount !== undefined) {
                    this[CachedIteratorResultsDataProvider._VALUE] = Object.assign({ totalFilteredRowCount }, value);
                }
                else {
                    this[CachedIteratorResultsDataProvider._VALUE] = value;
                }
                this[CachedIteratorResultsDataProvider._DONE] = true;
            }
        };
        this.cache = new oj.DataCache();
        this._lastFetchParams = null;
        if (dataProvider.createOptimizedKeyMap) {
            this.createOptimizedKeyMap = (initialMap) => {
                return dataProvider.createOptimizedKeyMap(initialMap);
            };
        }
        if (dataProvider.createOptimizedKeySet) {
            this.createOptimizedKeySet = (initialSet) => {
                return dataProvider.createOptimizedKeySet(initialSet);
            };
        }
        dataProvider.addEventListener(CachedIteratorResultsDataProvider._MUTATE, (event) => {
            this.cache.processMutations(event.detail);
            this.dispatchEvent(event);
        });
        dataProvider.addEventListener(CachedIteratorResultsDataProvider._REFRESH, (event) => {
            this.cache.reset();
            this._lastFetchParams = null;
            this.dispatchEvent(event);
        });
        this._baseFetchFirstCapability = dataProvider.getCapability('fetchFirst');
    }
    containsKeys(params) {
        const finalResults = new Set();
        const neededKeys = new Set();
        const cacheResults = this.cache.getDataByKeys(params);
        params.keys.forEach((key) => {
            const item = cacheResults.results.get(key);
            if (item) {
                finalResults.add(key);
            }
            else {
                neededKeys.add(key);
            }
        });
        if (neededKeys.size === 0) {
            return Promise.resolve({ containsParameters: params, results: finalResults });
        }
        else {
            const newParams = { attributes: params.attributes, keys: neededKeys, scope: params.scope };
            return this.dataProvider.containsKeys(newParams).then((containsKeysResults) => {
                containsKeysResults.results.forEach((key) => {
                    finalResults.add(key);
                });
                return { containsParameters: params, results: finalResults };
            });
        }
    }
    fetchByKeys(params) {
        const finalResults = new Map();
        const neededKeys = new Set();
        const signal = params === null || params === void 0 ? void 0 : params.signal;
        if (signal && signal.aborted) {
            const reason = signal.reason;
            return Promise.reject(new DOMException(reason, 'AbortError'));
        }
        return new Promise((resolve, reject) => {
            if (signal) {
                const reason = signal.reason;
                signal.addEventListener('abort', (e) => {
                    return reject(new DOMException(reason, 'AbortError'));
                });
            }
            const cacheResults = this.cache.getDataByKeys(params);
            params.keys.forEach((key) => {
                const item = cacheResults.results.get(key);
                if (item) {
                    finalResults.set(key, item);
                }
                else {
                    neededKeys.add(key);
                }
            });
            if (neededKeys.size === 0) {
                return resolve({ fetchParameters: params, results: finalResults });
            }
            else {
                const newParams = {
                    attributes: params.attributes,
                    keys: neededKeys,
                    scope: params.scope
                };
                return resolve(this.dataProvider.fetchByKeys(newParams).then((fetchByKeysResults) => {
                    fetchByKeysResults.results.forEach((item, key) => {
                        finalResults.set(key, item);
                    });
                    return { fetchParameters: params, results: finalResults };
                }));
            }
        });
    }
    fetchByOffset(params) {
        const size = params.size ? params.size : CachedIteratorResultsDataProvider._DEFAULT_SIZE;
        const signal = params === null || params === void 0 ? void 0 : params.signal;
        if (signal && signal.aborted) {
            const reason = signal.reason;
            return Promise.reject(new DOMException(reason, 'AbortError'));
        }
        return new Promise((resolve, reject) => {
            if (signal) {
                const reason = signal.reason;
                signal.addEventListener('abort', (e) => {
                    return reject(new DOMException(reason, 'AbortError'));
                });
            }
            if (CachedIteratorResultsDataProvider._compareCachedFetchParameters(params, this._lastFetchParams) &&
                params.offset + size <= this.cache.getSize()) {
                const updatedParams = JSON.parse(JSON.stringify(params, (key, value) => {
                    if (key.startsWith('_')) {
                        return undefined;
                    }
                    return value;
                }));
                updatedParams.size = size;
                const results = this.cache.getDataByOffset(updatedParams);
                if (results) {
                    return resolve(results);
                }
            }
            return resolve(this.dataProvider.fetchByOffset(params));
        });
    }
    fetchFirst(params) {
        if (!CachedIteratorResultsDataProvider._compareCachedFetchParameters(params, this._lastFetchParams)) {
            this.cache.reset();
            this._lastFetchParams = CachedIteratorResultsDataProvider._createCachedFetchParams(params);
            const asyncIterable = this.dataProvider.fetchFirst(params);
            const asyncIterator = asyncIterable[Symbol.asyncIterator]();
            this._firstIteratorState = {
                cachedFetchParams: this._lastFetchParams,
                fetchOffset: 0,
                fetchPromise: null,
                asyncIterator: asyncIterator
            };
        }
        return new this.CacheAsyncIterable(this, this._getSharedIteratorState().asyncIterator, params, this.cache);
    }
    getCapability(capabilityName) {
        const capability = this.dataProvider.getCapability(capabilityName);
        if (capabilityName === 'fetchCapability') {
            return { attributeFilter: capability === null || capability === void 0 ? void 0 : capability.attributeFilter, caching: 'visitedByCurrentIterator' };
        }
        return capability;
    }
    getTotalSize() {
        if (this._lastFetchParams != null && !this._lastFetchParams.filterDef && this.cache.isDone()) {
            return Promise.resolve(this.cache.getSize());
        }
        return this.dataProvider.getTotalSize();
    }
    isEmpty() {
        if (this._lastFetchParams != null && !this._lastFetchParams.filterDef && this.cache.isDone()) {
            return this.cache.getSize() === 0 ? 'yes' : 'no';
        }
        return this.dataProvider.isEmpty();
    }
    _getSharedIteratorState() {
        return this._firstIteratorState;
    }
    static _compareCachedFetchParameters(params, cachedParams) {
        params = params || {};
        return (cachedParams != null &&
            oj.Object.compareValues(cachedParams.attributes, params.attributes || null) &&
            oj.Object.compareValues(cachedParams.filterDef, CachedIteratorResultsDataProvider._getFilterDef(params.filterCriterion)) &&
            oj.Object.compareValues(cachedParams.sortCriteria, params.sortCriteria || null));
    }
    static _createCachedFetchParams(params) {
        params = params || {};
        const cachedFetchParams = {};
        cachedFetchParams.size = params.size;
        cachedFetchParams.attributes = params.attributes
            ? JSON.parse(JSON.stringify(params.attributes))
            : null;
        cachedFetchParams.filterDef = CachedIteratorResultsDataProvider._getFilterDef(params.filterCriterion);
        cachedFetchParams.sortCriteria = params.sortCriteria
            ? JSON.parse(JSON.stringify(params.sortCriteria))
            : null;
        return cachedFetchParams;
    }
    static _getFilterDef(filter) {
        if (!filter) {
            return null;
        }
        const filterDef = {};
        Object.keys(filter).forEach((property) => {
            if (property !== 'filter') {
                filterDef[property] = filter[property];
            }
        });
        return filterDef;
    }
}
CachedIteratorResultsDataProvider._KEY = 'key';
CachedIteratorResultsDataProvider._KEYS = 'keys';
CachedIteratorResultsDataProvider._DATA = 'data';
CachedIteratorResultsDataProvider._STARTINDEX = 'startIndex';
CachedIteratorResultsDataProvider._SORT = 'sort';
CachedIteratorResultsDataProvider._SORTCRITERIA = 'sortCriteria';
CachedIteratorResultsDataProvider._FILTERCRITERION = 'filterCriterion';
CachedIteratorResultsDataProvider._METADATA = 'metadata';
CachedIteratorResultsDataProvider._ITEMS = 'items';
CachedIteratorResultsDataProvider._FROM = 'from';
CachedIteratorResultsDataProvider._OFFSET = 'offset';
CachedIteratorResultsDataProvider._REFRESH = 'refresh';
CachedIteratorResultsDataProvider._MUTATE = 'mutate';
CachedIteratorResultsDataProvider._SIZE = 'size';
CachedIteratorResultsDataProvider._FETCHPARAMETERS = 'fetchParameters';
CachedIteratorResultsDataProvider._VALUE = 'value';
CachedIteratorResultsDataProvider._DONE = 'done';
CachedIteratorResultsDataProvider._RESULTS = 'results';
CachedIteratorResultsDataProvider._CONTAINSPARAMETERS = 'containsParameters';
CachedIteratorResultsDataProvider._DEFAULT_SIZE = 25;
CachedIteratorResultsDataProvider._CONTAINSKEYS = 'containsKeys';
CachedIteratorResultsDataProvider._FETCHBYKEYS = 'fetchByKeys';
CachedIteratorResultsDataProvider._FETCHBYOFFSET = 'fetchByOffset';
CachedIteratorResultsDataProvider._FETCHFIRST = 'fetchFirst';
CachedIteratorResultsDataProvider._ADDEVENTLISTENER = 'addEventListener';
CachedIteratorResultsDataProvider._FETCHATTRIBUTES = 'attributes';
EventTargetMixin.applyMixin(CachedIteratorResultsDataProvider);
oj._registerLegacyNamespaceProp('CachedIteratorResultsDataProvider', CachedIteratorResultsDataProvider);

export default CachedIteratorResultsDataProvider;
