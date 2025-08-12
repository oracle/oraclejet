/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { wrapWithAbortHandling } from 'ojs/ojdataprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';

/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
class CachedFetchByOffsetResultsDataProvider {
    constructor(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this.cache = new oj.DataCache();
        this._lastFetchParams = null;
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
        // Listen to mutate event on wrapped DataProvider
        dataProvider.addEventListener(CachedFetchByOffsetResultsDataProvider._MUTATE, (event) => {
            // First allow the cache to process the mutations, which may result in different detail
            this.cache.processMutations(event.detail);
            // Then fire mutate with new detail
            this.dispatchEvent(event);
        });
        // Listen to refresh event on wrapped DataProvider
        dataProvider.addEventListener(CachedFetchByOffsetResultsDataProvider._REFRESH, (event) => {
            // Invalidate the cache on refresh event
            this._clearCachedParameters();
            this.dispatchEvent(event);
        });
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
        return wrapWithAbortHandling(signal, callback, false);
    }
    fetchByOffset(params) {
        const size = params.size ? params.size : CachedFetchByOffsetResultsDataProvider._DEFAULT_SIZE;
        const updatedParams = { ...params };
        updatedParams.size = size;
        const signal = params?.signal;
        const callback = async (resolve) => {
            // Use the cache if the attributes, filterCriterion, and sortCriteria match and the offset is in range
            // We also need to check if the cached rows can satisfy the requested size.
            if (!CachedFetchByOffsetResultsDataProvider._compareCachedFetchParameters(params, this._lastFetchParams)) {
                this._clearCachedParameters();
            }
            else if (this._doesCacheSatisfyParameters(updatedParams)) {
                return resolve(this._fetchByOffsetFromCache(params));
            }
            this._lastFetchParams =
                CachedFetchByOffsetResultsDataProvider._createCachedFetchParams(params);
            await this._fetchByOffsetFromDataProvider(updatedParams);
            return resolve(this._fetchByOffsetFromCache(params));
        };
        return wrapWithAbortHandling(signal, callback, false);
    }
    fetchFirst(params) {
        return this.dataProvider.fetchFirst(params);
    }
    getCapability(capabilityName) {
        const capability = this.dataProvider.getCapability(capabilityName);
        if (capabilityName === 'fetchByOffset') {
            return { attributeFilter: capability?.attributeFilter, caching: 'visitedByOffset' };
        }
        return capability;
    }
    getTotalSize() {
        // If all the data is cached then we can just return the cache size
        if (this._isAllDataCached()) {
            return Promise.resolve(this.cache.getSize());
        }
        // Otherwise delegate to the wrapped DataProvider
        return this.dataProvider.getTotalSize();
    }
    isEmpty() {
        // If all the data is cached then we can just return the cache size
        if (this._isAllDataCached()) {
            return this.cache.getSize() === 0 ? 'yes' : 'no';
        }
        // Otherwise delegate to the wrapped DataProvider
        return this.dataProvider.isEmpty();
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
            oj.Object.compareValues(cachedParams.filterDef, CachedFetchByOffsetResultsDataProvider._getFilterDef(params.filterCriterion)) &&
            oj.Object.compareValues(cachedParams.sortCriteria, params.sortCriteria || null));
    }
    static _createCachedFetchParams(params) {
        params = params || {};
        const cachedFetchParams = {};
        cachedFetchParams.size = params.size;
        cachedFetchParams.attributes = params.attributes ? [...params.attributes] : null;
        cachedFetchParams.filterDef = params.filterCriterion
            ? CachedFetchByOffsetResultsDataProvider._getFilterDef(params.filterCriterion)
            : null;
        cachedFetchParams.sortCriteria = params.sortCriteria ? [...params.sortCriteria] : null;
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
    _doesCacheSatisfyParameters(params) {
        const isDone = this.cache.isDone();
        let isSparse;
        if (params.size === -1) {
            isSparse = this.cache.getSparseIndex(params.offset) > -1;
            return !isSparse && isDone;
        }
        const cacheSize = this.cache.getSize();
        if (params.offset + params.size >= cacheSize && isDone) {
            isSparse = this.cache.getSparseIndex(params.offset, cacheSize) > -1;
            return !isSparse;
        }
        isSparse = this.cache.getSparseIndex(params.offset, params.offset + params.size) > -1;
        return !isSparse && this.cache.getSize() >= params.offset + params.size;
    }
    _isAllDataCached() {
        return this._lastFetchParams != null && !this._lastFetchParams.filterDef && this.cache.isDone();
    }
    async _fetchByOffsetFromDataProvider(params) {
        let endIndex = params.size - 1;
        const cacheSize = this.cache.getSize();
        if (params.offset < cacheSize) {
            const cachedData = this.cache.getDataByOffset(params).results;
            for (let i = 0; i < cachedData.length; i++) {
                if (cachedData[i] === undefined) {
                    break;
                }
                params.offset++;
                params.size--;
            }
            while (cachedData[endIndex] != undefined) {
                params.size--;
                endIndex--;
            }
        }
        const results = await this.dataProvider.fetchByOffset(params);
        this._totalFilteredRowCount = results.totalFilteredRowCount;
        // save sortCriteria to consider implicit sort
        this._cachedSortCriteria = results.fetchParameters.sortCriteria;
        this.cache.addFetchByOffsetResult(results);
    }
    _fetchByOffsetFromCache(params) {
        let results = this.cache.getDataByOffset(params);
        results.fetchParameters.sortCriteria = this._cachedSortCriteria
            ? this._cachedSortCriteria
            : params.sortCriteria;
        if (params.includeFilteredRowCount === 'enabled') {
            results.totalFilteredRowCount = this._totalFilteredRowCount;
        }
        else {
            delete results.totalFilteredRowCount;
        }
        return results;
    }
    _clearCachedParameters() {
        this.cache.reset();
        this._lastFetchParams = null;
        this._totalFilteredRowCount = null;
        this._cachedSortCriteria = null;
    }
}
CachedFetchByOffsetResultsDataProvider._REFRESH = 'refresh';
CachedFetchByOffsetResultsDataProvider._MUTATE = 'mutate';
CachedFetchByOffsetResultsDataProvider._DEFAULT_SIZE = 25;
EventTargetMixin.applyMixin(CachedFetchByOffsetResultsDataProvider);
oj._registerLegacyNamespaceProp('CachedFetchByOffsetResultsDataProvider', CachedFetchByOffsetResultsDataProvider);

export default CachedFetchByOffsetResultsDataProvider;
