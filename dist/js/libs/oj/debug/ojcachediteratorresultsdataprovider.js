/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojeventtarget'], function (oj, ojdataprovider, ojeventtarget) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    /**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
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

    /**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
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
                            return new this._parent.CacheAsyncIterator(this._parent, this.dataProviderAsyncIterator, this.params, this.cache, this._clientId);
                        };
                        this._clientId = Symbol();
                        this._parent._mapClientIdToIteratorInfo.set(this._clientId, 0);
                    }
                },
                _a = Symbol.asyncIterator,
                _b);
            this.CacheAsyncIterator = class {
                constructor(_parent, asyncIterator, params, cache, _clientId) {
                    this._parent = _parent;
                    this.asyncIterator = asyncIterator;
                    this.params = params;
                    this.cache = cache;
                    this._clientId = _clientId;
                    // offset in our cache
                    this._iteratorOffset = 0;
                    // We need to provide local row count if this capability has been requested through getEnhancedDataProvider,
                    // and the fetchFirst parameters indicates it wants row count for this iterator,
                    // and the base DataProvider does not have this capability.
                    this._needLocalRowCount =
                        _parent.options?.includeFilteredRowCount === 'enabled' &&
                            params?.includeFilteredRowCount === 'enabled' &&
                            _parent._baseFetchFirstCapability?.totalFilteredRowCount !== 'exact';
                }
                _getIteratorOffset(clientId) {
                    return this._parent._mapClientIdToIteratorInfo.get(clientId);
                }
                // private helper to return results so far when a stale fetch is detected
                _getStaleResult(result) {
                    // if no result is already present, return an empty 'done' stub as this fetch is 'stale'
                    return result != null
                        ? result.value.data?.length > 0
                            ? new this._parent.CacheAsyncIteratorYieldResult(result.value, -1)
                            : new this._parent.CacheAsyncIteratorReturnResult(result.value, -1)
                        : {
                            value: {
                                data: [],
                                metadata: [],
                                fetchParameters: this.params,
                                totalFilteredRowCount: -1
                            },
                            done: true
                        };
                }
                ['next']() {
                    const params = this.params || {};
                    const size = params.size || -1;
                    const signal = params?.signal;
                    const callback = (resolve) => {
                        return resolve(this._getResult(params, size, this._needLocalRowCount ? this._parent.cache.getSize() : undefined));
                    };
                    return ojdataprovider.wrapWithAbortHandling(signal, callback, false);
                }
                _getResult(params, size, totalFilteredRowCount) {
                    // check if we have enough in the cache
                    let result;
                    if (size === -1 ||
                        (this._needLocalRowCount && this._getIteratorOffset(this._clientId) === 0)) {
                        // we want to fetch everything
                        if (this.cache.isDone()) {
                            result = this.cache.getDataList(params, this._getIteratorOffset(this._clientId));
                            // this._iteratorOffset = this._iteratorOffset + result.data.length;
                            this._parent._mapClientIdToIteratorInfo.set(this._clientId, this._getIteratorOffset(this._clientId) + result.data.length);
                            return Promise.resolve(this._getFinalResult(result, totalFilteredRowCount));
                        }
                        else {
                            const fetchUntilDone = () => {
                                return this._checkCachedParamsAndIterate(params, -1).then((result) => {
                                    if (this.asyncIterator !== this._parent._currentAsyncIterator) {
                                        return this._getStaleResult();
                                    }
                                    if (result.done) {
                                        return Promise.resolve(this._getResult(params, size, this._parent.cache.getSize()));
                                    }
                                    else {
                                        return fetchUntilDone();
                                    }
                                });
                            };
                            return fetchUntilDone();
                        }
                    }
                    else {
                        return this._fetchFromCacheAndIterate(params, size, totalFilteredRowCount);
                    }
                }
                _getFinalResult(result, totalFilteredRowCount) {
                    if (this._parent._getSharedIteratorState().cachedFetchParams.sortCriteria &&
                        (!result.fetchParameters || !result.fetchParameters.sortCriteria)) {
                        result.fetchParameters.sortCriteria =
                            this._parent._getSharedIteratorState().cachedFetchParams.sortCriteria;
                    }
                    return result?.data?.length > 0
                        ? new this._parent.CacheAsyncIteratorYieldResult(result, totalFilteredRowCount)
                        : new this._parent.CacheAsyncIteratorReturnResult(result, totalFilteredRowCount);
                }
                _checkCachedParamsAndIterate(params, size) {
                    let asyncIteratorFetchPromise;
                    let firstIteratorCachedFetchParams = this._parent._getSharedIteratorState().cachedFetchParams;
                    let firstIteratorCachedFetchOffset = this._parent._getSharedIteratorState().fetchOffset;
                    let firstIteratorCachedFetchPromise = this._parent._getSharedIteratorState().fetchPromise;
                    if (firstIteratorCachedFetchPromise &&
                        this._getIteratorOffset(this._clientId) === firstIteratorCachedFetchOffset &&
                        CachedIteratorResultsDataProvider._compareCachedFetchParameters(params, firstIteratorCachedFetchParams)) {
                        asyncIteratorFetchPromise = firstIteratorCachedFetchPromise;
                    }
                    else {
                        this._parent._getSharedIteratorState().cachedFetchParams =
                            CachedIteratorResultsDataProvider._createCachedFetchParams(params);
                        this._parent._getSharedIteratorState().fetchPromise = this.asyncIterator
                            .next()
                            .then((result) => {
                            // only update the state variables of this data provider if results are not 'stale'
                            // ie - the currentAsyncIterator instance did not change after the call was issued
                            if (this.asyncIterator !== this._parent._currentAsyncIterator) {
                                return this._getStaleResult(result);
                            }
                            else {
                                // save sortCriteria from baseDP and will be used as part of return result
                                // to reserve implicitSort from baseDP
                                if (result.value.fetchParameters?.sortCriteria) {
                                    this._parent._getSharedIteratorState().cachedFetchParams.sortCriteria =
                                        result.value.fetchParameters?.sortCriteria;
                                }
                                this._parent._getSharedIteratorState().fetchOffset =
                                    this._parent._getSharedIteratorState().fetchOffset + result.value.data.length;
                                this._parent._getSharedIteratorState().fetchPromise = null;
                                this.cache.addListResult(result);
                            }
                            return result;
                        });
                        asyncIteratorFetchPromise = this._parent._getSharedIteratorState().fetchPromise;
                    }
                    return asyncIteratorFetchPromise;
                }
                _fetchFromCacheAndIterate(params, size, totalFilteredRowCount) {
                    let result = this.cache.getDataList(params, this._getIteratorOffset(this._clientId));
                    if (this.cache.getSize() >= this._getIteratorOffset(this._clientId) + size ||
                        this.cache.isDone()) {
                        let iteratorOffset = this._getIteratorOffset(this._clientId) + result.data.length;
                        this._parent._mapClientIdToIteratorInfo.set(this._clientId, iteratorOffset);
                        return Promise.resolve(this._getFinalResult(result, totalFilteredRowCount));
                    }
                    else {
                        let offset = 0;
                        // count - remaining data to be fetched from iterator call
                        let count = size - result.data.length;
                        const fetchUntilOffset = () => {
                            return this._checkCachedParamsAndIterate(params, size).then((finalResult) => {
                                if (this.asyncIterator !== this._parent._currentAsyncIterator) {
                                    return this._getStaleResult();
                                }
                                else {
                                    let data = finalResult.value.data.slice(offset, count);
                                    count -= data.length;
                                    if (count === 0 || this.cache.isDone()) {
                                        result = this.cache.getDataList(params, this._getIteratorOffset(this._clientId));
                                        let iteratorOffset = this._getIteratorOffset(this._clientId) + result.data.length;
                                        this._parent._mapClientIdToIteratorInfo.set(this._clientId, iteratorOffset);
                                        let resultObj = Object.assign({}, finalResult);
                                        resultObj.value.data = result.data;
                                        resultObj.value.metadata = result.metadata;
                                        return Promise.resolve(this._getFinalResult(resultObj.value, totalFilteredRowCount));
                                    }
                                    else {
                                        return fetchUntilOffset();
                                    }
                                }
                            });
                        };
                        return fetchUntilOffset();
                    }
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
            this._mapClientIdToIteratorInfo = new Map();
            this._lastFetchParams = null;
            this._firstIteratorState = null;
            // Add createOptimizedKeyMap method to this DataProvider if the wrapped DataProvider supports it
            if (dataProvider.createOptimizedKeyMap) {
                this.createOptimizedKeyMap = (initialMap) => {
                    return dataProvider.createOptimizedKeyMap(initialMap);
                };
            }
            // Add createOptimizedKeySet method to this DataProvider if the wrapped DataProvider supports it
            if (dataProvider.createOptimizedKeySet) {
                this.createOptimizedKeySet = (initialSet) => {
                    return dataProvider.createOptimizedKeySet(initialSet);
                };
            }
            this.handleMutationOffsetUpdate = function (mutationType, indexes) {
                if (mutationType === 'remove') {
                    let count = 0;
                    indexes.forEach((index) => {
                        this._mapClientIdToIteratorInfo.forEach((offset, symbol) => {
                            if (index < offset) {
                                this._mapClientIdToIteratorInfo.set(symbol, offset - 1);
                                count += 1;
                            }
                        });
                    });
                    if (this._firstIteratorState !== null) {
                        this._firstIteratorState.fetchOffset -= count;
                    }
                }
                if (mutationType === 'add') {
                    let count = 0;
                    indexes.forEach((index) => {
                        this._mapClientIdToIteratorInfo.forEach((offset, symbol) => {
                            if (index < offset) {
                                this._mapClientIdToIteratorInfo.set(symbol, offset + 1);
                                count += 1;
                            }
                        });
                    });
                    if (this._firstIteratorState !== null) {
                        this._firstIteratorState.fetchOffset += count;
                    }
                }
            }.bind(this);
            // Listen to mutate event on wrapped DataProvider
            dataProvider.addEventListener(CachedIteratorResultsDataProvider._MUTATE, (event) => {
                // First allow the cache to process the mutations, which may result in different detail
                this.cache.processMutations(event.detail, this.handleMutationOffsetUpdate);
                // Then fire mutate with new detail
                this.dispatchEvent(event);
            });
            // Listen to refresh event on wrapped DataProvider
            dataProvider.addEventListener(CachedIteratorResultsDataProvider._REFRESH, (event) => {
                // Invalidate the cache on refresh event
                this.cache.reset();
                this._lastFetchParams = null;
                this._firstIteratorState = null;
                this.dispatchEvent(event);
            });
            this._baseFetchFirstCapability = dataProvider.getCapability('fetchFirst');
        }
        containsKeys(params) {
            const finalResults = new Set();
            const neededKeys = new Set();
            // First resolve any keys that can be found in the cache
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
                // Return the result if all keys have been resolved from cache
                return Promise.resolve({ containsParameters: params, results: finalResults });
            }
            else {
                // If there are unresolved keys, delegate to the wrapped DataProvider
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
            const signal = params?.signal;
            const callback = (resolve) => {
                // First resolve any keys that can be found in the cache
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
                    // Return the result if all keys have been resolved from cache
                    return resolve({ fetchParameters: params, results: finalResults });
                }
                else {
                    // If there are unresolved keys, delegate to the wrapped DataProvider
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
            };
            return ojdataprovider.wrapWithAbortHandling(signal, callback, false);
        }
        fetchByOffset(params) {
            // size is optional so use the default size if not specified
            const size = params.size || CachedIteratorResultsDataProvider._DEFAULT_SIZE;
            const signal = params?.signal;
            const callback = (resolve) => {
                // Use the cache if the attributes, filterCriterion, and sortCriteria match and the offset is in range
                // We also need to check if the cached rows can satisfy the requested size.
                if (CachedIteratorResultsDataProvider._compareCachedFetchParameters(params, this._lastFetchParams) &&
                    params.offset + size <= this.cache.getSize()) {
                    let updatedParams = { ...params };
                    updatedParams.size = size;
                    const results = this.cache.getDataByOffset(updatedParams);
                    if (results) {
                        return resolve(results);
                    }
                }
                return resolve(this.dataProvider.fetchByOffset(params));
            };
            return ojdataprovider.wrapWithAbortHandling(signal, callback, false);
        }
        fetchFirst(params) {
            if (params?.signal?.aborted) {
                // signal is already aborted, no need to check
                const asyncIterable = this.dataProvider.fetchFirst(params);
                const asyncIterator = asyncIterable[Symbol.asyncIterator]();
                this._currentAsyncIterator = asyncIterator;
                return new this.CacheAsyncIterable(this, asyncIterator, null, null);
            }
            // Invalidate the cache if fetchFirst is called with different fetch parameters from last call
            if (!this._getSharedIteratorState() ||
                !CachedIteratorResultsDataProvider._compareCachedFetchParameters(params, params && this._getSharedIteratorState()
                    ? this._getSharedIteratorState().cachedFetchParams
                    : this._lastFetchParams)) {
                this.cache.reset();
                // Remember the last fetch parameters
                this._lastFetchParams = CachedIteratorResultsDataProvider._createCachedFetchParams(params);
                let _underlyingDPParams = { ...params };
                if (this.options?.includeFilteredRowCount === 'enabled' &&
                    params?.includeFilteredRowCount === 'enabled' &&
                    this._baseFetchFirstCapability?.totalFilteredRowCount !== 'exact') {
                    _underlyingDPParams.size = -1;
                }
                const asyncIterable = this.dataProvider.fetchFirst(_underlyingDPParams);
                const asyncIterator = asyncIterable[Symbol.asyncIterator]();
                this._firstIteratorState = {
                    cachedFetchParams: this._lastFetchParams,
                    fetchOffset: 0,
                    fetchPromise: null,
                    asyncIterator: asyncIterator
                };
            }
            this._currentAsyncIterator = this._getSharedIteratorState().asyncIterator;
            return new this.CacheAsyncIterable(this, this._getSharedIteratorState().asyncIterator, params, this.cache);
        }
        getCapability(capabilityName) {
            const capability = this.dataProvider.getCapability(capabilityName);
            if (capabilityName === 'fetchCapability' || capabilityName === 'fetchFirst') {
                return { attributeFilter: capability?.attributeFilter, caching: 'visitedByCurrentIterator' };
            }
            return capability;
        }
        getTotalSize() {
            // If there is no filterCriterion and the cache is complete, we can just return the cache size
            if (this._lastFetchParams != null && !this._lastFetchParams.filterDef && this.cache.isDone()) {
                return Promise.resolve(this.cache.getSize());
            }
            // Otherwise delegate to the wrapped DataProvider
            return this.dataProvider.getTotalSize();
        }
        isEmpty() {
            // If there is no filterCriterion and the cache is complete, we can just return this info based on the cache
            if (this._lastFetchParams != null && !this._lastFetchParams.filterDef && this.cache.isDone()) {
                return this.cache.getSize() === 0 ? 'yes' : 'no';
            }
            // Otherwise delegate to the wrapped DataProvider
            return this.dataProvider.isEmpty();
        }
        _getSharedIteratorState() {
            return this._firstIteratorState;
        }
        static _compareCachedFetchParameters(params, cachedParams) {
            params = params || {};
            // prev aborted, curr not aborted
            // ie first aborted, sec not aborted, return false to create a new iterator
            // for case like first not aborted, sec aborted and third not aborted won't return false
            // because sec aborted fetch won't update cachedParams if other params are same
            if (cachedParams != null && cachedParams.signal?.aborted && !params.signal?.aborted) {
                return false;
            }
            // prev not aborted, curr aborted and other cases
            return (cachedParams != null &&
                oj.Object.compareValues(cachedParams.attributes, params.attributes || null) &&
                oj.Object.compareValues(cachedParams.filterDef, params.filterCriterion
                    ? CachedIteratorResultsDataProvider._getFilterDef(params.filterCriterion)
                    : null) &&
                oj.Object.compareValues(cachedParams.sortCriteria, params.sortCriteria || null));
        }
        static _createCachedFetchParams(params) {
            params = params || {};
            const cachedFetchParams = {};
            cachedFetchParams.size = params.size;
            cachedFetchParams.attributes = params.attributes ? Object.assign({}, params.attributes) : null;
            cachedFetchParams.filterDef = params.filterCriterion
                ? CachedIteratorResultsDataProvider._getFilterDef(params.filterCriterion)
                : null;
            cachedFetchParams.sortCriteria = params.sortCriteria
                ? Object.assign([], params.sortCriteria)
                : null;
            cachedFetchParams.signal = params.signal;
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
    CachedIteratorResultsDataProvider._REFRESH = 'refresh';
    CachedIteratorResultsDataProvider._MUTATE = 'mutate';
    CachedIteratorResultsDataProvider._VALUE = 'value';
    CachedIteratorResultsDataProvider._DONE = 'done';
    CachedIteratorResultsDataProvider._DEFAULT_SIZE = 25;
    ojeventtarget.EventTargetMixin.applyMixin(CachedIteratorResultsDataProvider);
    oj._registerLegacyNamespaceProp('CachedIteratorResultsDataProvider', CachedIteratorResultsDataProvider);

    /**
     * @license
     * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */

    return CachedIteratorResultsDataProvider;

});
