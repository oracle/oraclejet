/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { CollectionTableDataSource } from 'ojs/ojcollectiontabledatasource';
import 'ojs/ojdataprovideradapter';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 6.0.0
 * @export
 * @final
 * @class CollectionDataProvider
 * @implements DataProvider
 * @classdesc This class implements {@link DataProvider}.
 *            This object represents a data provider that is created from an {@link Collection} object, such as an external data source. It can be used by [ListView]{@link oj.ojListView}, [NavigationList]{@link oj.ojNavigationList},
 *            [TabBar]{@link oj.ojTabBar}, and [Table]{@link oj.ojTable}.<br><br>
 * In general, apps should not listen to the underlying ojCollection events. They should only list to events from the DataProvider itself.
 * CollectionDataProvider may silence ojCollection events.  How CollectionDP uses ojCollection is entirely up to itself and not part of the CollectionDataProvider contract.
 * So it's unreliable for apps to listen to the underlying ojCollection events and expect events to be triggered based on CollectionDataProvider operations.
 * @param {oj.Collection} collection data supported by the components
 * @example
 * // Create collection
 * var collecton = oj.Collection(...);
 * // Create CollectionDataProvider object from collection
 * var dataprovider = new CollectionDataProvider(collection);
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
 * @inheritdoc
 * @memberof CollectionDataProvider
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
 * </p><p>
 * The iterator accounts for data mutations when returning the next block of data, so that no row is duplicated or skipped.
 * It will adjust the offset from which the next block of data starts if rows
 * have been added or removed in the returned data.
 * </p><p>
 * Please see the <a href="DataProvider.html#custom-implementations-section">DataProvider documentation</a> for
 * more information on custom implementations.
 * </p>
 *
 * @param {FetchListParameters=} params fetch parameters
 * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof CollectionDataProvider
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
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof CollectionDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

// end of jsdoc

class CollectionDataProvider {
    constructor(collection) {
        this.collection = collection;
        this._dataProviderAdapter = new oj.TableDataSourceAdapter(new CollectionTableDataSource(collection));
        this.addEventListener = this._dataProviderAdapter.addEventListener.bind(this._dataProviderAdapter);
        this.removeEventListener = this._dataProviderAdapter.removeEventListener.bind(this._dataProviderAdapter);
        this.dispatchEvent = this._dataProviderAdapter.dispatchEvent.bind(this._dataProviderAdapter);
    }
    destroy() {
        this._dataProviderAdapter.destroy();
    }
    fetchFirst(parameters) {
        return this._dataProviderAdapter.fetchFirst(parameters);
    }
    fetchByKeys(parameters) {
        return this._dataProviderAdapter.fetchByKeys(parameters);
    }
    containsKeys(parameters) {
        return this._dataProviderAdapter.containsKeys(parameters);
    }
    fetchByOffset(parameters) {
        return this._dataProviderAdapter.fetchByOffset(parameters);
    }
    getCapability(capabilityName) {
        return this._dataProviderAdapter.getCapability(capabilityName);
    }
    getTotalSize() {
        return this._dataProviderAdapter.getTotalSize();
    }
    isEmpty() {
        return this._dataProviderAdapter.isEmpty();
    }
}
oj._registerLegacyNamespaceProp('CollectionDataProvider', CollectionDataProvider);

export default CollectionDataProvider;
