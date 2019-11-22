/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ko)
{
  "use strict";
class DeferredDataProvider {
    constructor(_dataProvider, _capabilityFunc) {
        this._dataProvider = _dataProvider;
        this._capabilityFunc = _capabilityFunc;
        this._DATAPROVIDER = 'dataProvider';
        this.AsyncIterable = class {
            constructor(_asyncIterator) {
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
        };
        this.AsyncIterator = class {
            constructor(_asyncIteratorPromise) {
                this._asyncIteratorPromise = _asyncIteratorPromise;
            }
            ['next']() {
                let self = this;
                return self._asyncIteratorPromise.then(function (asyncIterator) {
                    return asyncIterator['next']();
                });
            }
        };
    }
    /**
     * Fetch the first block of data
     */
    fetchFirst(params) {
        let asyncIteratorPromise = this._getDataProvider().then(function (dataProvider) {
            return dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
        });
        return new this.AsyncIterable(new this.AsyncIterator(asyncIteratorPromise));
    }
    ;
    /**
     * Fetch rows by keys
     */
    fetchByKeys(params) {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.fetchByKeys(params);
        });
    }
    /**
     * Check if rows are contained by keys
     */
    containsKeys(params) {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.containsKeys(params);
        });
    }
    /**
     * Fetch rows by offset
     */
    fetchByOffset(params) {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.fetchByOffset(params);
        });
    }
    /**
     * Returns the total size of the data
     */
    getTotalSize() {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.getTotalSize();
        });
    }
    /**
     * Returns a string that indicates if this data provider is empty.
     * Returns "unknown" if the dataProvider has not resolved yet.
     */
    isEmpty() {
        if (!this[this._DATAPROVIDER])
            return "unknown";
        else
            return this[this._DATAPROVIDER].isEmpty();
    }
    /**
     * Determines whether this DataProvider supports certain feature.
     */
    getCapability(capabilityName) {
        if (this._capabilityFunc)
            return this._capabilityFunc(capabilityName);
        return null;
    }
    /** EVENT TARGET IMPLEMENTATION **/
    addEventListener(eventType, listener) {
        this._getDataProvider().then(function (dataProvider) {
            dataProvider.addEventListener(eventType, listener);
        });
    }
    ;
    removeEventListener(eventType, listener) {
        this._getDataProvider().then(function (dataProvider) {
            dataProvider.removeEventListener(eventType, listener);
        });
    }
    ;
    dispatchEvent(evt) {
        if (!this[this._DATAPROVIDER])
            return false;
        return this[this._DATAPROVIDER].dispatchEvent(evt);
    }
    ;
    /**
     * Returns the resolved dataProvider for this instance
     */
    _getDataProvider() {
        let self = this;
        return this._dataProvider.then(function (dataProvider) {
            if (oj.DataProviderFeatureChecker.isDataProvider(dataProvider)) {
                if (!self[self._DATAPROVIDER])
                    self[self._DATAPROVIDER] = dataProvider;
                return dataProvider;
            }
            else
                throw new Error('Invalid data type. DeferredDataProvider takes a Promise<DataProvider>');
        });
    }
}
oj['DeferredDataProvider'] = DeferredDataProvider;



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
 * @class oj.DeferredDataProvider
 * @implements oj.DataProvider
 * @ojtsmodule
 * @classdesc This class implements {@link oj.DataProvider}.
 *            This object represents a data provider that is created with deferred data and can be used by any component that requires a data provider that will be created with data from a Promise.
 * @param {Promise.<oj.DataProvider>} dataProvider A promise that resolves to an oj.DataProvider
 * @param {Function} capabilityFunc An function that implements {@link oj.DataProvider#getCapability}.
 * @ojsignature [{target: "Type",
 *               value: "class DeferredDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "Promise<oj.DataProvider<K, D>>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "(capabilityName: string)=> any",
 *               for: "capabilityFunc"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters"]}
 * @example
 * // DeferredDataProvider is used in cases where the data for the data provider will be
 * // provided asynchronously. In the example below, let getDeferredData() be any function
 * // that returns a Promise that will resolve to the final data.
 * var deferredDataPromise = getDeferredData();
 *
 * // Create a Promise that will resolve to a data provider containing the resolved data
 * var dataProviderPromise = deferredDataPromise.then(function(resolvedData){
 *  return new oj.ArrayDataProvider(resolvedData);
 * });
 *
 * // Then create a DeferredDataProvider object with the promise that will resolve to a data provider,
 * // and an implemenation of {@link oj.DataProvider#getCapability}
 * var dataprovider = new oj.DeferredDataProvider(dataProviderPromise, capabilityFunc);
 */

/**
 * Check if there are rows containing the specified keys
 *
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys
 *
 *
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset
 *
 *
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first block of data.
 *
 *
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Return the total number of rows in this dataprovider
 *
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 *
 * @param {string=} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort"
 * @return {any} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until it has resolved, and a fetch is made.
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 *
 * @param {string} eventType The event type to add listener to.
 * @param {EventListener} listener The event listener to add.
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 *
 * @param {string} eventType The event type to remove listener from.
 * @param {EventListener} listener The event listener to remove.
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 *
 * @param {Event} evt The event to dispatch.
 * @return {boolean} false if the deferred data provider has not resolved or the event has been cancelled, and true otherwise.
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * End of jsdoc
 */

  return DeferredDataProvider;
});