/**
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function(oj, $, ko)
{
var DeferredDataProvider = (function () {
    function DeferredDataProvider(_dataProvider, _capabilityFunc) {
        this._dataProvider = _dataProvider;
        this._capabilityFunc = _capabilityFunc;
        this._DATAPROVIDER = 'dataProvider';
        this.AsyncIterable = (function () {
            function class_1(_asyncIterator) {
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_1;
        }());
        this.AsyncIterator = (function () {
            function class_2(_asyncIteratorPromise) {
                this._asyncIteratorPromise = _asyncIteratorPromise;
            }
            class_2.prototype['next'] = function () {
                var self = this;
                return self._asyncIteratorPromise.then(function (asyncIterator) {
                    return asyncIterator['next']();
                });
            };
            return class_2;
        }());
    }
    DeferredDataProvider.prototype.fetchFirst = function (params) {
        var asyncIteratorPromise = this._getDataProvider().then(function (dataProvider) {
            return dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
        }.bind(params));
        return new this.AsyncIterable(new this.AsyncIterator(asyncIteratorPromise));
    };
    ;
    DeferredDataProvider.prototype.fetchByKeys = function (params) {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.fetchByKeys(params);
        });
    };
    DeferredDataProvider.prototype.containsKeys = function (params) {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.containsKeys(params);
        });
    };
    DeferredDataProvider.prototype.fetchByOffset = function (params) {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.fetchByOffset(params);
        });
    };
    DeferredDataProvider.prototype.getTotalSize = function () {
        return this._getDataProvider().then(function (dataProvider) {
            return dataProvider.getTotalSize();
        });
    };
    DeferredDataProvider.prototype.isEmpty = function () {
        if (!this[this._DATAPROVIDER])
            return "unknown";
        else
            return this[this._DATAPROVIDER].isEmpty();
    };
    DeferredDataProvider.prototype.getCapability = function (capabilityName) {
        if (this._capabilityFunc)
            return this._capabilityFunc(capabilityName);
        return null;
    };
    DeferredDataProvider.prototype.addEventListener = function (eventType, listener) {
        this._getDataProvider().then(function (dataProvider) {
            dataProvider.addEventListener(eventType, listener);
        });
    };
    ;
    DeferredDataProvider.prototype.removeEventListener = function (eventType, listener) {
        this._getDataProvider().then(function (dataProvider) {
            dataProvider.removeEventListener(eventType, listener);
        });
    };
    ;
    DeferredDataProvider.prototype.dispatchEvent = function (evt) {
        if (!this[this._DATAPROVIDER])
            return false;
        return this[this._DATAPROVIDER].dispatchEvent(evt);
    };
    ;
    DeferredDataProvider.prototype._getDataProvider = function () {
        var self = this;
        return this._dataProvider.then(function (dataProvider) {
            if (oj.DataProviderFeatureChecker.isIteratingDataProvider(dataProvider)) {
                if (!self[self._DATAPROVIDER])
                    self[self._DATAPROVIDER] = dataProvider;
                return dataProvider;
            }
            else
                throw new Error('Invalid data type. DeferredDataProvider takes a Promise<DataProvider>');
        });
    };
    return DeferredDataProvider;
}());
oj['DeferredDataProvider'] = DeferredDataProvider;
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.containsKeys', { containsKeys: DeferredDataProvider.prototype.containsKeys });
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.fetchByKeys', { fetchByKeys: DeferredDataProvider.prototype.fetchByKeys });
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.fetchByOffset', { fetchByOffset: DeferredDataProvider.prototype.fetchByOffset });
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.fetchFirst', { fetchFirst: DeferredDataProvider.prototype.fetchFirst });
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.getCapability', { getCapability: DeferredDataProvider.prototype.getCapability });
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.getTotalSize', { getTotalSize: DeferredDataProvider.prototype.getTotalSize });
oj.Object.exportPrototypeSymbol('DeferredDataProvider.prototype.isEmpty', { isEmpty: DeferredDataProvider.prototype.isEmpty });

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
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
 * @class oj.DeferredDataProvider
 * @implements oj.DataProvider
 * @classdesc This class implements {@link oj.DataProvider}.  
 *            This object represents a data provider that is created with deferred data and can be used by any component that requires a data provider that will be created with data from a Promise, such as [oj.ojChart]{@link oj.ojChart}
 * @param {Promise.<oj.DataProvider>} dataProvider A promise that resolves to an oj.DataProvider
 * @param {Function} capabilityFunc An function that implements {@link oj.DataProvider#getCapability}.
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
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
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
 * @memberof oj.DeferredDataProvider
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
 * @memberof oj.DeferredDataProvider
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
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */
  
/**
 * Return the total number of rows in this dataprovider
 * 
 * @ojstatus preview
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
 * @ojstatus preview
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort"
 * @return {Object} capability information or null if unsupported
 * @export
 * @expose
 * @memberof oj.DeferredDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * Return a string that indicates if this data provider is empty 
 * @ojstatus preview
 * @return {string} a string that indicates if this data provider is empty. Valid values are:
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
 * @ojstatus preview
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
 * @ojstatus preview
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
 * @ojstatus preview
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
});
