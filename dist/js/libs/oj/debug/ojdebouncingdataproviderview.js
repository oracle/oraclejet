/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojdataprovider'], function (exports, ojdataprovider) { 'use strict';

    /**
     * Helper class for debouncing fetch requests.
     */
    class Debouncer {
        constructor() {
            // The algorithm will calculate the debounce time as follows:
            // debounceTime = (1 + (responseTime - 1.2 * requestTime) / responseTime) * 1.2 * requestTime
            //
            // Rewriting to solve for response time:
            // debounceTime = (2 - 1.2 * requestTime / responseTime) * 1.2 * requestTime
            // debounceTime * responseTime / (1.2 * requestTime) = 2 * responseTime - 1.2 * requestTime
            // responseTime = 1.2 * requestTime / (2 - debounceTime / (1.2 * requestTime))
            //
            // We want our default debounce times to start out higher for fewer characters typed and
            // decrease as the number of characters increases, so we will define our default
            // buckets of response times based on some of these example calculations.
            // (We don't want the default response time to be less than 1.2 * default requestTime (250),
            // because then the logic will use a debounce time of 0 because the response is expected to
            // return before the user types again.)
            // debounce | request | response
            // ---------|---------|---------
            //  500     | 250     | 900
            //  475     | 250     | 720
            //  450     | 250     | 600
            //  425     | 250     | 514
            //  400     | 250     | 450
            //  375     | 250     | 400
            //  350     | 250     | 360
            //  325     | 250     | 327
            //  300     | 250     | 300
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
        /**
         * Debounce a given function by the specified time.
         * @param callback function to debounce
         * @param filterTextLength text filter length
         * @returns debounced function
         */
        debounce(callback, filterTextLength) {
            const wait = this.GetDebounceTime(filterTextLength);
            return (...args) => {
                window.setTimeout(() => {
                    callback(...args);
                }, wait);
            };
        }
        /**
         * Record the time between a fetch request and response.
         * @param time fetch time in ms
         * @param filterTextLength length of the text filter for the fetch
         */
        recordResponseTime(time, filterTextLength) {
            const index = Math.min(filterTextLength, 5);
            const record = this._responseTimes[index];
            // if this is the first recorded time, overwrite our initial default;
            // otherwise calculate the new average
            if (record.count === 0) {
                record.time = time;
            }
            else {
                record.time = (record.time * record.count + time) / (record.count + 1);
            }
            record.count += 1;
        }
        /**
         * Record the time of a fetch request.
         */
        recordRequestTime() {
            const requestTime = Date.now();
            const lastRequestTime = this._lastRequestTime;
            this._lastRequestTime = requestTime;
            // we need two requests in order to record the time between them, so if this is the
            // very first request, just return
            if (lastRequestTime === 0) {
                return;
            }
            const time = requestTime - lastRequestTime;
            // assume that intervals greater than 1000ms are the start of a new search, so do not
            // factor into the average request time
            if (time > 1000) {
                return;
            }
            const record = this._requestTime;
            // if this is the first recorded time, overwrite our initial default;
            // otherwise calculate the new average
            if (record.count === 0) {
                record.time = time;
            }
            else {
                record.time = (record.time * record.count + time) / (record.count + 1);
            }
            record.count += 1;
        }
        /**
         * Get the average response time for a given text filter length.
         * @param filterTextLength length of the text filter
         * @returns average response time in ms
         */
        _getResponseTime(filterTextLength) {
            const index = Math.min(filterTextLength, 5);
            const record = this._responseTimes[index];
            return record.time;
        }
        /**
         * Get the average request time.
         * @returns average request time in ms
         */
        _getRequestTime() {
            return this._requestTime.time;
        }
        /**
         * Get the time to use for debouncing based on the text filter length, the average
         * time between requests, and the average response time.
         * @param filterTextLength text filter length
         * @returns debounce time in ms
         */
        GetDebounceTime(filterTextLength) {
            const responseTime = this._getResponseTime(filterTextLength);
            const requestTime = this._getRequestTime();
            // the request time is an average of how fast the user types, so assume any given time may
            // be a little longer than the average
            const paddedRequestTime = 1.2 * requestTime;
            // if the response is expected to come back before the user types another character, don't
            // debounce
            if (responseTime < paddedRequestTime) {
                return 0;
            }
            // if the response won't come back before the user types another character, wait between
            // 1 and 2 times the paddedRequestTime, depending on how much slower the response is expected
            // to be
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
                // record the request time with the debouncer
                this.debouncer.recordRequestTime();
                this._isFirstNext = false;
                const filterText = this.params?.filterCriterion?.text;
                const debounceCallback = (resolve, reject) => {
                    // if the request has been aborted, reject the promise with the abort error and return
                    if (this.params?.signal?.aborted) {
                        reject(this.params?.signal?.reason);
                        return;
                    }
                    const asyncIterable = this.dataProvider.fetchFirst(this.params);
                    this._asyncIterator = asyncIterable[Symbol.asyncIterator]();
                    const fetchStart = Date.now();
                    const iterPromise = this._asyncIterator.next();
                    iterPromise.then((result) => {
                        // record the response time with the debouncer
                        const fetchEnd = Date.now();
                        this.debouncer.recordResponseTime(fetchEnd - fetchStart, filterText ? filterText.length : 0);
                        resolve(result);
                    }, reject);
                };
                // the abort handler will pass its own promise resolve/reject functions into this callback
                const callback = (resolve, reject) => {
                    const promise = new Promise((pResolve, pReject) => {
                        this.debouncer.debounce(debounceCallback, filterText ? filterText.length : 0)(pResolve, pReject);
                    });
                    // when the debounce promise resolves, resolve the abort handling promise
                    return promise.then(resolve, reject);
                };
                return ojdataprovider.wrapWithAbortHandling(this.params?.signal, callback, false);
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
    /**
     * A DataProvider wrapper that supports debouncing fetchFirst requests.
     * It is up to the calling code to abort stale requests and only process
     * the results for the most recent fetch.
     * @ignore
     */
    class DebouncingDataProviderView {
        constructor(dataProvider) {
            this._debouncer = new Debouncer();
            this.dataProvider = dataProvider;
        }
        /**
         * Fetch the first block of data
         */
        fetchFirst(params) {
            return new AsyncIterableWrapper(this.dataProvider, this._debouncer, params);
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
         */
        fetchByOffset(params) {
            return this.dataProvider.fetchByOffset(params);
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
        /** start EVENT TARGET IMPLEMENTATION **/
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

    exports.Debouncer = Debouncer;
    exports.DebouncingDataProviderView = DebouncingDataProviderView;

    Object.defineProperty(exports, '__esModule', { value: true });

});
