/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { wrapWithAbortHandling } from 'ojs/ojdataprovider';

class Debouncer {
    constructor() {
        this._responseTimes = [
            { time: 900, count: 0 },
            { time: 720, count: 0 },
            { time: 600, count: 0 },
            { time: 450, count: 0 },
            { time: 360, count: 0 },
            { time: 300, count: 0 }
        ];
        this._requestTime = { time: 250, count: 0 };
        this._lastRequestTime = 0;
    }
    debounce(callback, filterTextLength) {
        const wait = this.GetDebounceTime(filterTextLength);
        return (...args) => {
            window.setTimeout(() => {
                callback(...args);
            }, wait);
        };
    }
    recordResponseTime(time, filterTextLength) {
        const index = Math.min(filterTextLength, 5);
        const record = this._responseTimes[index];
        if (record.count === 0) {
            record.time = time;
        }
        else {
            record.time = (record.time * record.count + time) / (record.count + 1);
        }
        record.count += 1;
    }
    recordRequestTime() {
        const requestTime = Date.now();
        const lastRequestTime = this._lastRequestTime;
        this._lastRequestTime = requestTime;
        if (lastRequestTime === 0) {
            return;
        }
        const time = requestTime - lastRequestTime;
        if (time > 1000) {
            return;
        }
        const record = this._requestTime;
        if (record.count === 0) {
            record.time = time;
        }
        else {
            record.time = (record.time * record.count + time) / (record.count + 1);
        }
        record.count += 1;
    }
    _getResponseTime(filterTextLength) {
        const index = Math.min(filterTextLength, 5);
        const record = this._responseTimes[index];
        return record.time;
    }
    _getRequestTime() {
        return this._requestTime.time;
    }
    GetDebounceTime(filterTextLength) {
        const responseTime = this._getResponseTime(filterTextLength);
        const requestTime = this._getRequestTime();
        const paddedRequestTime = 1.2 * requestTime;
        if (responseTime < paddedRequestTime) {
            return 0;
        }
        const factor = (responseTime - paddedRequestTime) / responseTime;
        const debounceTime = (1 + factor) * paddedRequestTime;
        return debounceTime;
    }
}

var _a;
class AsyncIteratorWrapper {
    constructor(dataProvider, debouncer, params) {
        this._isFirstNext = true;
        this.dataProvider = dataProvider;
        this.debouncer = debouncer;
        this.params = params;
    }
    next() {
        if (this._isFirstNext) {
            this.debouncer.recordRequestTime();
            this._isFirstNext = false;
            const filterText = this.params?.filterCriterion?.text;
            const debounceCallback = (resolve, reject) => {
                if (this.params?.signal?.aborted) {
                    reject(this.params?.signal?.reason);
                    return;
                }
                const asyncIterable = this.dataProvider.fetchFirst(this.params);
                this._asyncIterator = asyncIterable[Symbol.asyncIterator]();
                const fetchStart = Date.now();
                const iterPromise = this._asyncIterator.next();
                iterPromise.then((result) => {
                    const fetchEnd = Date.now();
                    this.debouncer.recordResponseTime(fetchEnd - fetchStart, filterText ? filterText.length : 0);
                    resolve(result);
                }, reject);
            };
            const callback = (resolve, reject) => {
                const promise = new Promise((pResolve, pReject) => {
                    this.debouncer.debounce(debounceCallback, filterText ? filterText.length : 0)(pResolve, pReject);
                });
                return promise.then(resolve, reject);
            };
            return wrapWithAbortHandling(this.params?.signal, callback, false);
        }
        return this._asyncIterator.next();
    }
}
class AsyncIterableWrapper {
    constructor(dataProvider, debouncer, params) {
        this[_a] = () => {
            return new AsyncIteratorWrapper(this.dataProvider, this.debouncer, this.params);
        };
        this.dataProvider = dataProvider;
        this.debouncer = debouncer;
        this.params = params;
    }
}
_a = Symbol.asyncIterator;
class DebouncingDataProviderView {
    constructor(dataProvider) {
        this._debouncer = new Debouncer();
        this.dataProvider = dataProvider;
    }
    fetchFirst(params) {
        return new AsyncIterableWrapper(this.dataProvider, this._debouncer, params);
    }
    fetchByKeys(params) {
        return this.dataProvider.fetchByKeys(params);
    }
    containsKeys(params) {
        return this.dataProvider.containsKeys(params);
    }
    fetchByOffset(params) {
        return this.dataProvider.fetchByOffset(params);
    }
    getTotalSize() {
        return this.dataProvider.getTotalSize();
    }
    isEmpty() {
        return this.dataProvider.isEmpty();
    }
    getCapability(capabilityName) {
        return this.dataProvider.getCapability(capabilityName);
    }
    addEventListener(eventType, listener) {
        this.dataProvider.addEventListener(eventType, listener);
    }
    removeEventListener(eventType, listener) {
        this.dataProvider.removeEventListener(eventType, listener);
    }
    dispatchEvent(event) {
        return this.dataProvider.dispatchEvent(event);
    }
}

export { Debouncer, DebouncingDataProviderView };
