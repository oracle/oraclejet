/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

"use strict";
define(['ojs/ojcore', 'ojs/ojlogger', 'ojs/ojdataprovider'], function(oj, Logger, DataProvider)
{
class AsyncIteratorWrapper {
    constructor(asyncIterator, cache, cacheEntries) {
        this.asyncIterator = asyncIterator;
        this.cache = cache;
        this.cacheEntries = cacheEntries;
    }
    next() {
        const promise = this.asyncIterator.next();
        promise.then((result) => {
            const value = result.value;
            let start = this.cache.data.length;
            let end = start + value.data.length - 1;
            this.cache.data = this.cache.data.concat(value.data);
            this.cache.metadata = this.cache.metadata.concat(value.metadata);
            this.cache.done = result.done;
            this.cacheEntries.push({ start: start, end: end, miss: 0, status: CacheStatus.READY });
        });
        return promise;
    }
}
class AsyncIterableWrapper {
    constructor(asyncIterable, cache, cacheEntries) {
        this.asyncIterable = asyncIterable;
        this.cache = cache;
        this.cacheEntries = cacheEntries;
        this[Symbol.asyncIterator] = () => {
            return new AsyncIteratorWrapper(this.asyncIterable[Symbol.asyncIterator](), this.cache, this.cacheEntries);
        };
    }
}
var CacheEvictionStrategy;
(function (CacheEvictionStrategy) {
    CacheEvictionStrategy[CacheEvictionStrategy["NEVER"] = 0] = "NEVER";
    CacheEvictionStrategy[CacheEvictionStrategy["LRU"] = 1] = "LRU";
})(CacheEvictionStrategy || (CacheEvictionStrategy = {}));
var CacheStatus;
(function (CacheStatus) {
    CacheStatus[CacheStatus["READY"] = 0] = "READY";
    CacheStatus[CacheStatus["FETCHING"] = 1] = "FETCHING";
    CacheStatus[CacheStatus["PURGED"] = 2] = "PURGED";
})(CacheStatus || (CacheStatus = {}));
var FetchDirection;
(function (FetchDirection) {
    FetchDirection[FetchDirection["UP"] = 0] = "UP";
    FetchDirection[FetchDirection["DOWN"] = 1] = "DOWN";
})(FetchDirection || (FetchDirection = {}));
// A DataProvider wrapper that supports caching
class CachingDataProvider {
    constructor(dataProvider, cache, options) {
        this.dataProvider = dataProvider;
        this.cache = cache;
        this.options = options;
        this.strategy = CacheEvictionStrategy.NEVER;
        this.prefetching = false;
        this.currentStart = 0;
        this.CACHE_MISS_THRESHOLD = 5;
        if (cache == null) {
            this.cache = { data: [], metadata: [], done: false, startIndex: 0 };
        }
        this.cacheQueue = [];
        this.modelEventHandler = this._handleModelEvent.bind(this);
        dataProvider.addEventListener('mutate', this.modelEventHandler);
        dataProvider.addEventListener('refresh', this.modelEventHandler);
    }
    destroy() {
        if (this.dataProvider && this.modelEventHandler) {
            this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
            this.dataProvider.removeEventListener('refresh', this.modelEventHandler);
        }
    }
    /**
     * Fetch the first block of data
     */
    fetchFirst(params) {
        // clear cache
        this._resetCache();
        const result = this.dataProvider.fetchFirst(params);
        const iterable = new AsyncIterableWrapper(result, this.cache, this.cacheQueue);
        return iterable;
    }
    /**
     * Fetch rows by keys
     */
    fetchByKeys(params) {
        return this.dataProvider.fetchByKeys(params);
    }
    /**
     * Check if rows are contained by keys
     */
    containsKeys(params) {
        return this.dataProvider.containsKeys(params);
    }
    /**
     * Fetch rows by offset
     * This is also used by this DataProvider to know what the active range is so that it can purge its cache accordingly
     */
    fetchByOffset(params) {
        if (this.proximity === undefined) {
            this.proximity = params.size;
        }
        // direction serves as a hint of where to pre-fetch
        let direction = FetchDirection.UP;
        const start = params.offset;
        const end = start + params.size;
        if (start > this.currentStart) {
            direction = FetchDirection.DOWN;
        }
        this.currentStart = start;
        if (!this._isInCache(start, end)) {
            Logger.info('Cache missed: ' + start + ' - ' + end);
            this.cacheQueue.forEach((cacheInfo) => {
                if (cacheInfo.status !== CacheStatus.FETCHING) {
                    if ((cacheInfo.start >= start && cacheInfo.start <= end) ||
                        (cacheInfo.end <= end && cacheInfo.end >= start)) {
                        this._log('cache entry update to FETCHING - start: ' +
                            cacheInfo.start +
                            ' end: ' +
                            cacheInfo.end);
                        cacheInfo.status = CacheStatus.FETCHING;
                    }
                    else {
                        cacheInfo.miss = cacheInfo.miss + 1;
                    }
                }
            });
            this.fetchByOffsetPromise = new Promise((resolve, reject) => {
                this._log('Call fetchByOffset to fulfill cache');
                this.dataProvider.fetchByOffset(params).then((result) => {
                    for (let i = 0; i < result.results.length; i++) {
                        let item = result.results[i];
                        this.cache.data[start + i] = item.data;
                        this.cache.metadata[start + i] = item.metadata;
                    }
                    this._log('cache fulfilled - offset: ' + start + ' size: ' + result.results.length);
                    this.cacheQueue.forEach((cacheInfo) => {
                        if (cacheInfo.status === CacheStatus.FETCHING) {
                            this._log('cache entry update to READY - start: ' + cacheInfo.start + ' end: ' + cacheInfo.end);
                            cacheInfo.status = CacheStatus.READY;
                            cacheInfo.miss = 0;
                        }
                    });
                    const results = this._getFetchByOffsetResult(start, end);
                    resolve({ results: results, fetchParameters: params, done: false });
                    // see if we need to pre-fetch more
                    this._recalibrateCache(start, end, direction);
                });
            });
            return this.fetchByOffsetPromise;
        }
        this._updateCacheEntries(start, end);
        // must be called before cache is recalibrated
        const results = this._getFetchByOffsetResult(start, end);
        this._recalibrateCache(start, end, direction);
        return Promise.resolve({ results: results, fetchParameters: params, done: false });
    }
    _updateCacheEntries(start, end) {
        this.cacheQueue.forEach((cacheInfo) => {
            if (cacheInfo.status !== CacheStatus.PURGED) {
                if (cacheInfo.start > end || cacheInfo.end < start) {
                    cacheInfo.miss = cacheInfo.miss + 1;
                }
                else {
                    cacheInfo.miss = 0;
                }
            }
        });
    }
    _getFetchByOffsetResult(start, end) {
        const relStart = start - this.cache.startIndex;
        const relEnd = end - this.cache.startIndex;
        const results = [];
        for (let i = relStart; i < relEnd; i++) {
            results.push({ data: this.cache.data[i], metadata: this.cache.metadata[i] });
        }
        return results;
    }
    /**
     * Returns the total size of the data
     */
    getTotalSize() {
        return this.dataProvider.getTotalSize();
    }
    /**
     * Returns a string that indicates if this data provider is empty.
     * Returns "unknown" if the dataProvider has not resolved yet.
     */
    isEmpty() {
        return this.dataProvider.isEmpty();
    }
    /**
     * Determines whether this DataProvider supports certain feature.
     */
    getCapability(capabilityName) {
        return this.dataProvider.getCapability(capabilityName);
    }
    /** EVENT TARGET IMPLEMENTATION **/
    addEventListener(eventType, listener) {
        this.dataProvider.addEventListener(eventType, listener);
    }
    removeEventListener(eventType, listener) {
        this.dataProvider.removeEventListener(eventType, listener);
    }
    dispatchEvent(event) {
        return this.dataProvider.dispatchEvent(event);
    }
    _handleModelEvent(event) {
        if (event.type === 'refresh') {
            this._handleRowsRefreshed();
        }
        else if (event.type === 'mutate') {
            // todo: don't need this if evt is correctly typed
            const detail = event['detail'];
            if (detail.add) {
                this._handleRowsAdded(detail.add);
            }
            if (detail.remove) {
                this._handleRowsRemoved(detail.remove);
            }
            if (detail.update) {
                this._handleRowsUpdated(detail.update);
            }
        }
    }
    _resetCache() {
        this.cache.data.length = 0;
        this.cache.metadata.length = 0;
        this.cache.startIndex = 0;
        this.cache.done = false;
        this.cacheQueue.length = 0;
    }
    _recalibrateCache(start, end, direction) {
        if (this.strategy === CacheEvictionStrategy.NEVER) {
            return;
        }
        // first purge the cache that are LRU whose outside of current proximity range
        this.cacheQueue.forEach((cacheInfo) => {
            if (cacheInfo.status === CacheStatus.READY &&
                cacheInfo.miss >= this.CACHE_MISS_THRESHOLD &&
                (cacheInfo.end < start - this.proximity || cacheInfo.start > end + this.proximity)) {
                this._log('Purging cache range: ' + cacheInfo.start + ' to ' + cacheInfo.end);
                // for now we are just nulling out the data/metadata, todo: reduce the array if it's possible
                for (let i = cacheInfo.start; i <= cacheInfo.end; i++) {
                    this.cache.data[i] = null;
                    this.cache.metadata[i] = null;
                }
                cacheInfo.status = CacheStatus.PURGED;
            }
        });
        this._dumpCacheStatus();
        if (this.prefetching === false) {
            return;
        }
        // next pre-fetch to populate cache in anticipation of the next fetch
        for (let i = 0; i < this.cacheQueue.length; i++) {
            let entry = this.cacheQueue[i];
            // find the right CacheEntry of what the next fetch might be
            if (direction === FetchDirection.UP && entry.start < start && entry.end > start) {
                if (entry.status === CacheStatus.PURGED || !this._isInCache(entry.start, entry.end)) {
                    entry.status = CacheStatus.FETCHING;
                    this._log('pre-fetch cache range (before adjustment): ' +
                        entry.start +
                        ' - ' +
                        entry.end +
                        ' direction: ' +
                        direction);
                    this._prefetchRange(entry.start, start - entry.start).then((success) => {
                        entry.status = CacheStatus.READY;
                    });
                }
                break;
            }
            else if (direction === FetchDirection.DOWN && entry.start < end && entry.end > end) {
                if (entry.status === CacheStatus.PURGED || !this._isInCache(entry.start, entry.end)) {
                    entry.status = CacheStatus.FETCHING;
                    this._log('pre-fetch cache range (before adjustment): ' +
                        entry.start +
                        ' - ' +
                        entry.end +
                        ' direction: ' +
                        direction);
                    this._prefetchRange(end, entry.end - end).then((success) => {
                        entry.status = CacheStatus.READY;
                    });
                }
                break;
            }
        }
    }
    _prefetchRange(start, size) {
        this._log('pre-fetching to refill cache - offset: ' + start + ' size: ' + size);
        return new Promise((resolve, reject) => {
            this.dataProvider.fetchByOffset({ offset: start, size: size }).then((result) => {
                for (let i = 0; i < result.results.length; i++) {
                    let item = result.results[i];
                    this.cache.data[start + i] = item.data;
                    this.cache.metadata[start + i] = item.metadata;
                }
                this._log('pre-fetch result returned and cache is fulfilled - offset: ' + start + ' size: ' + size);
                resolve(true);
            });
        });
    }
    _isInCache(start, end) {
        if (this.strategy === CacheEvictionStrategy.NEVER) {
            return true;
        }
        if (start < this.cache.startIndex || end > this.cache.startIndex + this.cache.data.length) {
            return false;
        }
        let relStart = start - this.cache.startIndex;
        let relEnd = end - this.cache.startIndex;
        for (let i = relStart; i < relEnd; i++) {
            if (this.cache.data[i] == null) {
                return false;
            }
        }
        return true;
    }
    /**
     * Helper method for handling mutation event
     * @param detail
     * @param keyField
     * @param callback1
     * @param callback2
     */
    _handleRowsMutated(detail, keyField, callback1, callback2) {
        const indexes = detail.indexes;
        if (indexes == null) {
            const keys = detail[keyField];
        }
        else {
            indexes.forEach((index, i) => {
                if (index < this.cache.startIndex + this.cache.data.length) {
                    if (index >= this.cache.startIndex) {
                        // within fetched range, update cache
                        const data = detail.data != null ? detail.data[i] : null;
                        const metadata = detail.metadata != null ? detail.metadata[i] : null;
                        callback1(index, data, metadata);
                    }
                    else {
                        if (callback2) {
                            callback2();
                        }
                    }
                }
                // if it's after the current cache range then we don't need to do anything as it gets
                // re-populated correctly when the next set of data is fetched
            });
        }
    }
    _handleRowsAdded(detail) {
        this._log('handling add mutation event');
        this._handleRowsMutated(detail, 'addBeforeKeys', (index, data, metadata) => {
            this.cache.data.splice(index, 0, data);
            this.cache.metadata.splice(index, 0, metadata);
        }, () => {
            this.cache.startIndex++;
        });
    }
    _handleRowsRemoved(detail) {
        this._log('handling remove mutation event');
        this._handleRowsMutated(detail, 'keys', (index) => {
            this.cache.data.splice(index, 1);
            this.cache.metadata.splice(index, 1);
        }, () => {
            this.cache.startIndex = Math.max(0, this.cache.startIndex - 1);
        });
    }
    _handleRowsUpdated(detail) {
        this._log('handling update mutation event');
        this._handleRowsMutated(detail, 'keys', (index, data, metadata) => {
            this.cache.data.splice(index, 1, data);
            this.cache.metadata.splice(index, 1, metadata);
        });
    }
    _handleRowsRefreshed() {
        this._log('handling refresh event');
        this._resetCache();
    }
    _log(msg) {
        Logger.info('[CachingDataProvider]=> ' + msg);
    }
    _getStatusText(status) {
        switch (status) {
            case CacheStatus.READY:
                return 'ready';
            case CacheStatus.FETCHING:
                return 'fetching';
            case CacheStatus.PURGED:
                return 'purged';
            default:
                return 'unknown';
        }
    }
    _dumpCacheStatus() {
        this.cacheQueue.forEach((cacheInfo) => {
            this._log('Cache entry - start: ' +
                cacheInfo.start +
                ' end: ' +
                cacheInfo.end +
                ' miss: ' +
                cacheInfo.miss +
                ' status: ' +
                this._getStatusText(cacheInfo.status));
        });
    }
}

  return CachingDataProvider;
});