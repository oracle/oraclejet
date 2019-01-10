/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'ojs/ojcollectiontabledatasource', 'ojs/ojdataprovideradapter'], function(oj)
{
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
var CollectionDataProvider = /** @class */ (function () {
    function CollectionDataProvider(collection) {
        this.collection = collection;
        this._dataProviderAdapter = new oj.TableDataSourceAdapter(new oj.CollectionTableDataSource(collection));
        this.addEventListener = this._dataProviderAdapter.addEventListener.bind(this._dataProviderAdapter);
        this.removeEventListener = this._dataProviderAdapter.removeEventListener.bind(this._dataProviderAdapter);
        this.dispatchEvent = this._dataProviderAdapter.dispatchEvent.bind(this._dataProviderAdapter);
    }
    CollectionDataProvider.prototype.destroy = function () {
        this._dataProviderAdapter.destroy();
    };
    CollectionDataProvider.prototype.fetchFirst = function (parameters) {
        return this._dataProviderAdapter.fetchFirst(parameters);
    };
    CollectionDataProvider.prototype.fetchByKeys = function (parameters) {
        return this._dataProviderAdapter.fetchByKeys(parameters);
    };
    CollectionDataProvider.prototype.containsKeys = function (parameters) {
        return this._dataProviderAdapter.containsKeys(parameters);
    };
    ;
    CollectionDataProvider.prototype.fetchByOffset = function (parameters) {
        return this._dataProviderAdapter.fetchByOffset(parameters);
    };
    CollectionDataProvider.prototype.getCapability = function (capabilityName) {
        return this._dataProviderAdapter.getCapability(capabilityName);
    };
    CollectionDataProvider.prototype.getTotalSize = function () {
        return this._dataProviderAdapter.getTotalSize();
    };
    CollectionDataProvider.prototype.isEmpty = function () {
        return this._dataProviderAdapter.isEmpty();
    };
    return CollectionDataProvider;
}());
oj['CollectionDataProvider'] = CollectionDataProvider;
oj.CollectionDataProvider = CollectionDataProvider;

/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 * @ojstatus preview
 * @since 6.0.0
 * @export
 * @class oj.CollectionDataProvider
 * @implements oj.DataProvider
 * @classdesc This class implements {@link oj.DataProvider}.
 *            This object represents a data provider that is created from an {@link oj.Collection} object, such as an external data source. It can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 * @param {oj.Collection} collection data supported by the components
 * @example
 * // Create collection
 * var collecton = oj.Collection(...);
 * // Create CollectionDataProvider object from collection
 * var dataprovider = new oj.CollectionDataProvider(collection);
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider",
 *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters"]}
 * @ojtsimport {module: "ojmodel", type: "AMD", imported: ["Collection"]}
 * @ojtsmodule
 * @ojsignature [{target: "Type",
 *               value: "class CollectionDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}]
 */

/**
 * Check if there are rows containing the specified keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by keys
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Fetch rows by offset
 *
 * @ojstatus preview
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
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
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
 */

/**
 * Determines whether this DataProvider supports certain feature.
 *
 * @ojstatus preview
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Return the total number of rows in this dataprovider
 *
 * @ojstatus preview
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty
 *
 * @ojstatus preview
 * @return {"yes"|"no"|"unknown"} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.CollectionDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * End of jsdoc
 */

    return CollectionDataProvider;
});