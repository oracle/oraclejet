/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojcomponentcore'], function (oj, ojcomponentcore) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     *
     * @since 4.2.0
     * @export
     * @final
     * @class DeferredDataProvider
     * @implements DataProvider
     * @ojtsmodule
     * @classdesc This class implements {@link DataProvider}.
     *            This object represents a data provider that is created with deferred data and can be used by any component that requires a data provider that will be created with data from a Promise.
     * @param {Promise.<DataProvider>} dataProvider A promise that resolves to a DataProvider
     * @param {Function} capabilityFunc A function that implements {@link DataProvider#getCapability}.
     * @ojsignature [{target: "Type",
     *               value: "class DeferredDataProvider<K, D> implements DataProvider<K, D>",
     *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
     *               {target: "Type",
     *               value: "Promise<DataProvider<K, D>>",
     *               for: "dataProvider"},
     *               {target: "Type",
     *               value: "(capabilityName: string)=> any",
     *               for: "capabilityFunc"}]
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
     *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
     *   "FetchListResult","FetchListParameters"]}
     * @ojtsexample
     * // DeferredDataProvider is used in cases where the data for the DataProvider will be
     * // provided asynchronously. In the example below, let getDeferredData() be any function
     * // that returns a Promise that will resolve to the final data.
     * const deferredDataPromise = getDeferredData();
     *
     * // Create a Promise that will resolve to an ArrayDataProvider containing the resolved data
     * const dataProviderPromise = deferredDataPromise.then((resolvedData) => {
     *  return new ArrayDataProvider(resolvedData);
     * });
     *
     * // Then create a DeferredDataProvider object with the promise that will resolve to a DataProvider,
     * // and an implemenation of {@link DataProvider#getCapability}.
     * const dataprovider = new DeferredDataProvider(dataProviderPromise, capabilityFunc);
     * // or you may pass in ArrayDataProvider's static getCapability function as
     * const dataprovider = new DeferredDataProvider(dataProviderPromise, ArrayDataProvider.getCapability);
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name containsKeys
     */

    /**
     * Get an AsyncIterable object for iterating the data.
     * <p>
     * AsyncIterable contains a Symbol.asyncIterator method that returns an AsyncIterator.
     * AsyncIterator contains a “next” method for fetching the next block of data.
     * </p><p>
     * The "next" method returns a promise that resolves to an object, which contains a "value" property for the data and a "done" property
     * that is set to true when there is no more data to be fetched.  The "done" property should be set to true only if there is no "value"
     * in the result.  Note that "done" only reflects whether the iterator is done at the time "next" is called.  Future calls to "next"
     * may or may not return more rows for a mutable data source.
     * </p>
     * <p>
     * Please see the <a href="DataProvider.html#custom-implementations-section">DataProvider documentation</a> for
     * more information on custom implementations.
     * </p>
     *
     * @param {FetchListParameters=} params fetch parameters
     * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
     * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
     * @export
     * @expose
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name fetchFirst
     * @ojsignature {target: "Type",
     *               value: "(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
     * @ojtsexample <caption>Get an asyncIterator and then fetch first block of data by executing next() on the iterator. Subsequent blocks can be fetched by executing next() again.</caption>
     * let asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
     * let result = await asyncIterator.next();
     * let value = result.value;
     * let data = value.data;
     * let keys = value.metadata.map(function(val) {
     *   return val.key;
     * });
     * // true or false for done
     * let done = result.done;
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof DeferredDataProvider
     * @instance
     * @method
     * @name dispatchEvent
     */

    // end of jsdoc

    class DeferredDataProvider {
        constructor(_dataProvider, _capabilityFunc) {
            var _a;
            this._dataProvider = _dataProvider;
            this._capabilityFunc = _capabilityFunc;
            this._DATAPROVIDER = 'dataProvider';
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
                constructor(_asyncIteratorPromise, _params) {
                    this._asyncIteratorPromise = _asyncIteratorPromise;
                    this._params = _params;
                }
                ['next']() {
                    var _a;
                    const signal = (_a = this._params) === null || _a === void 0 ? void 0 : _a.signal;
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
                        return resolve(this._asyncIteratorPromise.then((asyncIterator) => {
                            return asyncIterator['next']();
                        }));
                    });
                }
            };
        }
        fetchFirst(params) {
            const asyncIteratorPromise = this._getDataProvider().then((dataProvider) => {
                return dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
            });
            return new this.AsyncIterable(new this.AsyncIterator(asyncIteratorPromise));
        }
        fetchByKeys(params) {
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
                return resolve(this._getDataProvider().then((dataProvider) => {
                    return dataProvider.fetchByKeys(params);
                }));
            });
        }
        containsKeys(params) {
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
                resolve(this._getDataProvider().then((dataProvider) => {
                    return dataProvider.containsKeys(params);
                }));
            });
        }
        fetchByOffset(params) {
            return this._getDataProvider().then((dataProvider) => {
                return dataProvider.fetchByOffset(params);
            });
        }
        getTotalSize() {
            return this._getDataProvider().then((dataProvider) => {
                return dataProvider.getTotalSize();
            });
        }
        isEmpty() {
            if (!this[this._DATAPROVIDER])
                return 'unknown';
            else
                return this[this._DATAPROVIDER].isEmpty();
        }
        getCapability(capabilityName) {
            if (this._capabilityFunc)
                return this._capabilityFunc(capabilityName);
            return null;
        }
        addEventListener(eventType, listener) {
            this._getDataProvider().then((dataProvider) => {
                dataProvider.addEventListener(eventType, listener);
            });
        }
        removeEventListener(eventType, listener) {
            this._getDataProvider().then((dataProvider) => {
                dataProvider.removeEventListener(eventType, listener);
            });
        }
        dispatchEvent(evt) {
            if (!this[this._DATAPROVIDER])
                return false;
            return this[this._DATAPROVIDER].dispatchEvent(evt);
        }
        _getDataProvider() {
            return this._dataProvider.then((dataProvider) => {
                if (ojcomponentcore.DataProviderFeatureChecker.isDataProvider(dataProvider)) {
                    if (!this[this._DATAPROVIDER]) {
                        this[this._DATAPROVIDER] = dataProvider;
                    }
                    return dataProvider;
                }
                else
                    throw new Error('Invalid data type. DeferredDataProvider takes a Promise<DataProvider>');
            });
        }
    }
    oj._registerLegacyNamespaceProp('DeferredDataProvider', DeferredDataProvider);

    return DeferredDataProvider;

});
