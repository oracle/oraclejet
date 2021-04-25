/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj$1 from 'ojs/ojcore-base';
import { GenericEvent } from 'ojs/ojeventtarget';

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
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
 * @since 4.2.0
 * @export
 * @interface DataProvider
 * @extends EventTarget
 * @ojsignature {target: "Type",
 *               value: "interface DataProvider<K, D> extends EventTarget",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
 * @classdesc
 * The DataProvider interface defines the contract by which JET components retrieve data.  By exposing this contract as an interface, we allow for a range of possible data retrieval strategies, while shielding components from dependencies on any one particular implementation choice.  For example, some DataProvider implementations may get data from a local array. Others may retrieve data from a remote endpoint.  In either case, the consuming component simply interacts with the DataProvider interface and is unaware of the of the specific data retrieval approach.
 * <p>
 * The DataProvider contract has the following characteristics:
 * <ul>
 *   <li>Asynchronous: Even in cases where data is available synchronously (eg. the data is already in a local array), the DataProvider contract provides access to the data via asynchronous APIs.  As such, consumers are able to interact with the data in a consistent manner, regardless of how the data is retrieved.</li>
 *   <li>Stateless: The DataProvider’s data retrieval APIs are inherently stateless.  Attempts to retrieve data are atomic and are not impacted by previous interactions with the DataProvider.  This avoids potential brittleness when multiple consumers are interacting with the same DataProvider instance.</li>
 *   <li>Key-based: In order to ensure reliable interactions with the data set, the DataProvider contract assumes that each data item can be accessed via a unique key.  While the index can be used as a key if no viable key is available, stable keys should be used whenever possible.</li>
 *   <li>Read only (with mutation notifications):  The base DataProvider contract does not include mutation APIs.  That is, the DataProvider contract defines APIs for reading data, not for writing data.  However, DataProvider implementations may expose their own type-specific mutation APIs, and the DataProvider contract defines an event-based mechanism for notifying consumers of data changes.</li>
 *   <li>Filterable:  When requesting data from a DataProvider, consumers are able to specify filter criteria that area used to restrict the data set to those items that match the specified criteria.</li>
 *   <li>Sortable:  When requesting data from a DataProvider, consumers are able to specify sort criteria that impact the ordering of the provided data.</li>
 * </ul>
 * <p>
 * The DataProvider contract exposes three ways for consumers to retrieve data:
 * <ul>
 *   <li>Iteration: the {@link DataProvider#fetchFirst} method returns an AsyncIterable that can be used to iterate over the entire data set.  Consumers typically use this when rendering a data set.</li>
 *   <li>By keys: the {@link DataProvider#fetchByKeys} method allows specific items to be retrieved by key.  Consumers typically use this when interacting with a subset of data (eg. for retrieving the values of the selected rows in a table component).</li>
 *   <li>By offset: the {@link DataProvider#fetchByOffset} method allows a specific block of data to be retrieved by specifying an offset and size. Consumers typically use this for paging purposes.</li>
 * </ul>
 * A related interface is {@link TreeDataProvider}, which extends DataProvider. TreeDataProviders represent hierarchical data, whereas (non-tree) DataProviders represent data sets that are single-level.
 * <p>
 * JET provides several out-of-the-box DataProvider implementations that support the most common use cases.
 * <br>
 * <h4 id="description:DataProviderImplementations" class="name">
 *   Implementations
 * </h4>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Class</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>
 *         {@link ArrayDataProvider}
 *       </td>
 *       <td>
 *         Basic DataProvider implementation that takes the data from an Javascript array or ko.observableArray.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link ArrayTreeDataProvider}
 *       </td>
 *       <td>
 *         Basic TreeDataProvider implementation that takes the data from an Javascript array or ko.observableArray that contains "children" property for subtree data.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link CollectionDataProvider}
 *       </td>
 *       <td>
 *         DataProvider implementation that takes the data from a {@link oj.Collection} object. {@link oj.Collection} is an older class that represents data usually comes from external source such as a REST.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link DeferredDataProvider}
 *       </td>
 *       <td>
 *         DataProvider implementation that takes the data from a promise that resolves to another DataProvider object.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link FlattenedTreeDataProviderView}
 *       </td>
 *       <td>
 *         DataProvider implementation that wraps a TreeDataProvider object and "flattens" the hierarchical data into a single level.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link IndexerModelTreeDataProvider}
 *       </td>
 *       <td>
 *         TreeDataProvider implementation that takes the data from an Javascript array that contains "children" property for subtree data. This class also implements the {@link oj.IndexerModel} interface.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link ListDataProviderView}
 *       </td>
 *       <td>
 *         DataProvider implementation that wraps another DataProvider, adding data manipulation functionality such as filtering, sorting and field mapping.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link PagingDataProviderView}
 *       </td>
 *       <td>
 *         DataProvider implementation that wraps another DataProvider object. This class also implements the {@link PagingModel} interface so that it can be used by components that support paging.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>
 *         {@link TreeDataProviderView}
 *       </td>
 *       <td>
 *         TreeDataProvider implementation that wraps another TreeDataProvider object and exposes additional APIs. This class provides field mapping functionality for the wrapped TreeDataProvider.
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * <h4 id="description:DataProviderClassHierarchy" class="name">
 *   Class Hierarchy
 * </h4>
 * <ul>
 *   <li><b>Interface {@link DataProvider}</b></li>
 *   <ul>
 *     <li>{@link ArrayDataProvider}</li>
 *     <li>{@link CollectionDataProvider}</li>
 *     <li>{@link DeferredDataProvider}</li>
 *     <li>{@link FlattenedTreeDataProviderView}</li>
 *     <li>{@link ListDataProviderView}</li>
 *     <li>{@link PagingDataProviderView}</li>
 *     <li><b>Interface {@link TreeDataProvider}</b></li>
 *       <ul>
 *         <li>{@link ArrayTreeDataProvider}</li>
 *         <li>{@link IndexerModelTreeDataProvider}</li>
 *         <li>{@link TreeDataProviderView}</li>
 *       </ul>
 *     </li>
 *   </ul>
 * </ul>
 * </p><p>
 *
 * <h3 id="events-section">
 *   Events
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
 * </h3>
 * Implementations can fire the following events by creating an instance of the event class and passing the event payload in the constructor.
 * <h4 id="event:DataProviderMutationEvent" class="name">
 *   {@link DataProviderMutationEvent}
 * </h4>
 * This event is fired when items have been added or removed from the data.
 * <p>
 * Event payloads should implement the {@link DataProviderMutationEventDetail} interface.
 * </p><p>
 * Consumers can add an event listener for the "mutate" event type on the DataProvider object.
 * </p>
 * <i>Example of implementation firing an DataProviderMutationEvent for removed items:</i>
 * <pre class="prettyprint"><code>let removeDetail = {data: removedDataArray,
 *                     indexes: removedIndexArray,
 *                     keys: removedKeySet,
 *                     metadata: removedMetadataArray};
 * this.dispatchEvent(new DataProviderMutationEvent({remove: removeDetail}));
 * </code></pre>
 *
 * <i>Example of consumer listening for the "mutate" event type:</i>
 * <pre class="prettyprint"><code>let listener = function(event) {
 *   if (event.detail.remove) {
 *     let removeDetail = event.detail.remove;
 *     // Handle removed items
 *   }
 * };
 * dataProvider.addEventListener("mutate", listener);
 * </code></pre>
 * <h4 id="event:DataProviderRefreshEvent" class="name">
 *   {@link DataProviderRefreshEvent}
 * </h4>
 * This event is fired when the data has been refreshed and components need to re-fetch the data.
 * <p>
 * This event contains no additional event payload.
 * </p><p>
 * Consumers can add an event listener for the "refresh" event type on the DataProvider object.
 * </p>
 * <i>Example of consumer listening for the "refresh" event type:</i>
 * <pre class="prettyprint"><code>let listener = function(event) {
 * };
 * dataProvider.addEventListener("refresh", listener);
 * </code></pre>
 * <h3 id="custom-implementations-section">
 *   Custom Implementations
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#custom-implementations-section"></a>
 * </h3>
 * Applications can also create their own implementations of the DataProvider interface and use them with JET components.  For example, an application can create a DataProvider implementation
 * that fetches data from a REST endpoint.
 * </p><p>
 * Implementation classes must implement all of the interface methods.  It should also fire the DataProvider events when appropriate, so that JET components or other consumers can respond to data change accordingly.
 * </p>
 * <p>
 * A generic implementation of {@link DataProvider#fetchByKeys} and {@link DataProvider#containsKeys} is available from {@link FetchByKeysMixin}
 * which can be used in custom implementations of DataProvider.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 * <p>
 * In order for JET components to work correctly, DataProvider implementations should ensure that:
 * <ul>
 *   <li>
 *     The iterator accounts for data mutations when returning the next block of data, and that no row is duplicated or skipped.
 *     For example, an offset-based implementation may need to adjust the offset from which the next block of data starts if rows
 *     have been added or removed in the returned data.
 *   </li>
 *   <li>
 *     JET components may call "next" on the iterator even after the iterator has returned done:true.  If new data is available after
 *     the last returned row, the iterator is expected to return the new data and set "done" to false.
 *     This differs from the AsyncIterator spec for performance reasons.
 *   </li>
 * </ul>
 * </p>
 * <p>Assuming that a DataProvider has returned rows indexed 0 to 9. Normally it should start the next block at index 10. Now consider
 *    the following distinct mutation cases:</p>
 * <ul>
 *   <li>If a row is added at index 5, the DataProvider should fire a "mutate" event with the added row, and starts the
 *       next block at index 11.</li>
 *   <li>On the other hand, if a row is removed at index 5, the DataProvider should fire a "mutate" event with the removed row, and starts the
 *       next block at index 9.</li>
 * </ul>
 * <i>Example of adjusting the offset upon mutations for a DataProvider implementation that keeps track of its own offset.
 * This is just an illustration of what some implementations might do. The necessary adjustment is highly dependent of the
 * individual implementation.
 * </i>
 * <pre class="prettyprint"><code>
 * // offset is the current offset to start the next fetch
 * // removeIndexes is an array of indexes for removed items relative to the original dataset
 * // addIndexes is an array of indexes for added items relative to the dataset after the mutations
 * function getNewOffset(offset, removeIndexes, addIndexes) {
 *   let removeCount = 0;
 *
 *   if (removeIndexes) {
 *     removeIndexes.forEach(function (index) {
 *       // only count the changes below the last offset
 *       if (index < offset) {
 *         ++removeCount;
 *       }
 *     });
 *   }
 *
 *   offset -= removeCount;
 *   if (addIndexes) {
 *     addIndexes.forEach(function (index) {
 *       // only count the changes below the last offset
 *       if (index < offset) {
 *         ++offset;
 *       }
 *     });
 *   }
 *
 *   return offset;
 * }
 * </code></pre>
 */
oj.DataProvider = function () {
};

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
 * In order for JET components to work correctly, DataProvider implementations should ensure that:
 * </p>
 * <ul>
 *   <li>
 *     The iterator accounts for data mutations when returning the next block of data, and that no row is duplicated or skipped.
 *     For example, an offset-based implementation may need to adjust the offset from which the next block of data starts if rows
 *     have been added or removed in the returned data.
 *   </li>
 *   <li>
 *     JET components may call "next" on the iterator even after the iterator has returned done:true.  If new data is available after
 *     the last returned row, the iterator is expected to return the new data and set "done" to false.
 *     This differs from the AsyncIterator spec for performance reasons.
 *   </li>
 * </ul>
 * <p>
 * Please see the <a href="DataProvider.html#custom-implementations-section">DataProvider documentation</a> for
 * more information on custom implementations.
 * </p>
 *
 * @since 4.2.0
 * @param {FetchListParameters=} params fetch parameters
 * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof DataProvider
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
 * Determines whether this DataProvider defines a certain feature.
 *
 *
 * @since 4.2.0
 * @param {string} capabilityName capability name. Defined capability names are:
 *                  "fetchByKeys", "fetchByOffset", "sort", "fetchCapability" and "filter".
 * @return {Object} capability information or null if undefined
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link SortCapability} object.</li>
 *   <li>If capabilityName is "filter", returns a {@link FilterCapability} object.</li>
 *   <li>If capabilityName is "fetchCapability", returns a {@link FetchCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName: string): any"}
 * @ojtsexample <caption>Check what kind of fetchByKeys is defined.</caption>
 * let capabilityInfo = dataprovider.getCapability('fetchByKeys');
 * if (capabilityInfo.implementation == 'iteration') {
 *   // the DataProvider supports iteration for fetchByKeys
 *   ...
 */

/**
 * Return the total number of rows in this dataprovider
 *
 *
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name getTotalSize
 * @ojtsexample <caption>Get the total rows</caption>
 * let value = await dataprovider.getTotalSize();
 * if (value == -1) {
 *   // we don't know the total row count
 * } else {
 *   // the total count
 *   console.log(value);
 */

/**
 * Fetch rows by keys. The resulting key map will only contain keys which were actually found.
 *
 *
 * @since 4.2.0
 * @param {FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<FetchByKeysResults>} Returns Promise which resolves to {@link FetchByKeysResults}.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<FetchByKeysResults<K, D>>"}
 * @ojtsexample <caption>Fetch for keys 1001 and 556</caption>
 * let fetchKeys = [1001, 556];
 * let value = await dataprovider.fetchByKeys({keys: fetchKeys});
 * // get the data for key 1001
 * console.log(value.results.get(1001).data);
 */

/**
 * Check if there are rows containing the specified keys. The resulting key map will only contain keys which were actually found.
 *
 *
 * @since 4.2.0
 * @param {FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<ContainsKeysResults>} Returns Promise which resolves to {@link ContainsKeysResults}.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(parameters : FetchByKeysParameters<K>) : Promise<ContainsKeysResults<K>>"}
 * @ojtsexample <caption>Check if keys 1001 and 556 are contained</caption>
 * let containsKeys = [1001, 556];
 * let value = await dataprovider.containsKeys({keys: containsKeys});
 * let results = value['results'];
 * if (results.has(1001)) {
 *   console.log('Has key 1001');
 * } else if (results.has(556){
 *   console.log('Has key 556');
 * }
 */

/**
 * Fetch rows by offset
 * <p>
 * A generic implementation of this method is available from {@link FetchByOffsetMixin}.
 * It is for convenience and may not provide the most efficient implementation for your data provider.
 * Classes that implement the DataProvider interface are encouraged to provide a more efficient implementation.
 * </p>
 *
 *
 * @since 4.2.0
 * @param {FetchByOffsetParameters} parameters fetch by offset parameters
 * @return {Promise.<FetchByOffsetResults>} Returns Promise which resolves to {@link FetchByOffsetResults}.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 * @ojtsexample <caption>Fetch by offset 5 rows starting at index 2</caption>
 * let result = await dataprovider.fetchByOffset({size: 5, offset: 2});
 * let results = result['results'];
 * let data = results.map(function(value) {
 *   return value['data'];
 * });
 * let keys = results.map(function(value) {
 *   return value['metadata']['key'];
 * });
 */

/**
 * Returns a string that indicates if this data provider is empty.  Valid values are:
 * <ul>
 * <li>"yes": this data provider is empty.</li>
 * <li>"no": this data provider is not empty.</li>
 * <li>"unknown": it is not known if this data provider is empty until a fetch is made.</li>
 * </ul>
 *
 *
 * @since 4.2.0
 * @return {"yes" | "no" | "unknown"} string that indicates if this data provider is empty
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name isEmpty
 * @ojsignature {target: "Type",
 *               value: "(): 'yes' | 'no' | 'unknown'"}
 * @ojtsexample <caption>Check if empty</caption>
 * let isEmpty = dataprovider.isEmpty();
 * console.log('DataProvider is empty: ' + isEmpty);
 */

/**
 * Return an empty Set which is optimized to store keys
 * <p>
 * Optionally provided by certain DataProvider implementations for storing
 * keys from the DataProvider in a performant fashion. Sometimes components will
 * need to temporarily store a Set of keys provided by the DataProvider, for
 * example, in the case of maintaining a Set of selected keys. Only the DataProvider
 * is aware of the internal structure of keys such as whether they are primitives, Strings,
 * or objects and how to do identity comparisons. Therefore, the DataProvider can optionally
 * provide a Set implementation which can performantly store keys surfaced by the
 * DataProvider.
 * </p>
 *
 *
 * @since 6.2.0
 * @param {Set.<any>=} initialSet Optionally specify an initial set of keys for the Set. If not specified, then return an empty Set.
 * @return {Set.<any>} Returns a Set optimized for handling keys from the DataProvider.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 * @ojsignature {target: "Type",
 *               value: "?(initialSet?: Set<K>): Set<K>"}
 * @ojtsexample <caption>create empty key Set</caption>
 * // create optional initial parameter
 * let initSet = new Set();
 * initSet.add('a');
 * let keySet = dataprovider.createOptimizedKeySet(initSet);
 */

/**
 * Return an empty Map which is optimized to store key value pairs
 * <p>
 * Optionally provided by certain DataProvider implementations for storing
 * key/value pairs from the DataProvider in a performant fashion. Sometimes components will
 * need to temporarily store a Map of keys provided by the DataProvider, for
 * example, in the case of maintaining a Map of selected keys. Only the DataProvider
 * is aware of the internal structure of keys such as whether they are primitives, Strings,
 * or objects and how to do identity comparisons. Therefore, the DataProvider can optionally
 * provide a Map implementation which can performantly store key/value pairs surfaced by the
 * DataProvider.
 * </p>
 *
 *
 * @since 6.2.0
 * @param {Map.<any>=} initialMap Optionally specify an initial map of key/values for the Map. If not specified, then return an empty Map.
 * @return {Map.<any>} Returns a Map optimized for handling keys from the DataProvider.
 * @export
 * @expose
 * @memberof DataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 * @ojsignature {target: "Type",
 *               value: "?(initialMap?: Map<K, D>): Map<K, D>"}
 * @ojtsexample <caption>create empty key Map</caption>
 * // create optional parameter
 * let initMap = new Map();
 * initMap.set('a', 'apple');
 * let keyMap = dataprovider.createOptimizedKeyMap(initMap);
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof DataProvider
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
 *
 * @export
 * @expose
 * @memberof DataProvider
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
 *
 * @export
 * @expose
 * @memberof DataProvider
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

var AttributeFilterOperator;
(function (AttributeFilterOperator) {
    let AttributeOperator;
    (function (AttributeOperator) {
        AttributeOperator["$co"] = "$co";
        AttributeOperator["$eq"] = "$eq";
        AttributeOperator["$ew"] = "$ew";
        AttributeOperator["$pr"] = "$pr";
        AttributeOperator["$gt"] = "$gt";
        AttributeOperator["$ge"] = "$ge";
        AttributeOperator["$lt"] = "$lt";
        AttributeOperator["$le"] = "$le";
        AttributeOperator["$ne"] = "$ne";
        AttributeOperator["$regex"] = "$regex";
        AttributeOperator["$sw"] = "$sw";
    })(AttributeOperator = AttributeFilterOperator.AttributeOperator || (AttributeFilterOperator.AttributeOperator = {}));
})(AttributeFilterOperator || (AttributeFilterOperator = {}));
oj$1._registerLegacyNamespaceProp('AttributeFilterOperator', AttributeFilterOperator);

var CompoundFilterOperator;
(function (CompoundFilterOperator) {
    let CompoundOperator;
    (function (CompoundOperator) {
        CompoundOperator["$and"] = "$and";
        CompoundOperator["$or"] = "$or";
    })(CompoundOperator = CompoundFilterOperator.CompoundOperator || (CompoundFilterOperator.CompoundOperator = {}));
})(CompoundFilterOperator || (CompoundFilterOperator = {}));
oj$1._registerLegacyNamespaceProp('CompoundFilterOperator', CompoundFilterOperator);

class DataCache {
    constructor() {
        this._handleMutationAdd = function (eventDetail) {
            var _a, _b;
            let self = this;
            let eventDetailBeforeKeys = eventDetail[DataCache._BEFOREKEYS];
            let eventDetailKeys = eventDetail[DataCache._KEYS];
            let eventDetailKeysArray = [];
            eventDetailKeys.forEach(function (key) {
                eventDetailKeysArray.push(key);
            });
            let eventDetailData = eventDetail[DataCache._DATA];
            let eventDetailMetadata = eventDetail[DataCache._METADATA];
            let eventDetailIndexes = eventDetail[DataCache._INDEXES];
            if (eventDetailKeysArray && eventDetailKeysArray.length > 0) {
                if (eventDetailIndexes) {
                    eventDetailKeysArray.forEach(function (key, index) {
                        self._items.splice(eventDetailIndexes[index], 0, new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                    });
                }
                else if (eventDetailBeforeKeys) {
                    let eventDetailBeforeKeysClone = Object.assign([], eventDetailBeforeKeys);
                    let eventDetailKeysClone = Object.assign(new Set(), eventDetail[DataCache._KEYS]);
                    let eventDetailDataClone = Object.assign([], eventDetail[DataCache._DATA]);
                    let eventDetailMetadataClone = Object.assign([], eventDetail[DataCache._METADATA]);
                    let outOfRangeKeys = [];
                    let i, j, key, findKey, outOfRange;
                    for (i = 0; i < eventDetailBeforeKeys.length; i++) {
                        key = eventDetailBeforeKeys[i];
                        outOfRange = true;
                        if (key != null) {
                            for (j = 0; j < eventDetailKeysArray.length; j++) {
                                if (oj$1.Object.compareValues(eventDetailKeysArray[j], key)) {
                                    outOfRange = false;
                                    break;
                                }
                            }
                            if (outOfRange) {
                                for (j = 0; j < self._items.length; j++) {
                                    if (oj$1.Object.compareValues((_b = (_a = self._items[j]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.key, key)) {
                                        outOfRange = false;
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            outOfRange = false;
                        }
                        if (outOfRange) {
                            outOfRangeKeys.push(key);
                        }
                    }
                    let keysToCheck = eventDetailBeforeKeys.length;
                    while (keysToCheck > 0) {
                        for (i = 0; i < eventDetailBeforeKeys.length; i++) {
                            findKey = eventDetailBeforeKeys[i];
                            if (outOfRangeKeys.indexOf(findKey) >= 0) {
                                outOfRangeKeys.push(findKey);
                                break;
                            }
                        }
                        keysToCheck--;
                    }
                    for (i = eventDetailBeforeKeysClone.length - 1; i >= 0; i--) {
                        if (outOfRangeKeys.indexOf(eventDetailBeforeKeysClone[i]) >= 0) {
                            delete eventDetailBeforeKeysClone[i];
                            eventDetailKeysClone.delete(eventDetailBeforeKeysClone[i]);
                            delete eventDetailDataClone[i];
                            delete eventDetailMetadataClone[i];
                        }
                    }
                    eventDetailBeforeKeysClone.forEach(function (beforeKey, beforeKeyIndex) {
                        var _a, _b;
                        if (beforeKey === null) {
                            self._items.push(new self.Item(eventDetailMetadata[beforeKeyIndex], eventDetailData[beforeKeyIndex]));
                        }
                        else {
                            for (i = 0; i < self._items.length; i++) {
                                if (oj$1.Object.compareValues((_b = (_a = self._items[i]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.key, beforeKey)) {
                                    self._items.splice(i, 0, new self.Item(eventDetailMetadata[beforeKeyIndex], eventDetailData[beforeKeyIndex]));
                                    break;
                                }
                            }
                        }
                    });
                }
                else {
                    if (self._fetchParams && self._fetchParams.sortCriteria != null) {
                        let sortCriteria = self._fetchParams.sortCriteria;
                        if (sortCriteria) {
                            let comparator = self._getSortComparator(sortCriteria);
                            let i, currentData, currentCompare;
                            let insertedIndexes = [];
                            eventDetailData.forEach(function (data, index) {
                                for (i = 0; i < self._items.length; i++) {
                                    currentData = self._items[i].data;
                                    currentCompare = comparator(data, currentData);
                                    if (currentCompare < 0) {
                                        self._items.splice(i, 0, new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                                        insertedIndexes.push(index);
                                        break;
                                    }
                                }
                            });
                            eventDetailData.forEach(function (data, index) {
                                if (insertedIndexes.indexOf(index) < 0) {
                                    self._items.push(new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                                }
                            });
                        }
                    }
                    else {
                        eventDetailData.forEach(function (data, index) {
                            self._items.push(new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                        });
                    }
                }
            }
        };
        this._handleMutationRemove = function (eventDetail) {
            let self = this;
            let eventDetailKeys = eventDetail[DataCache._KEYS];
            if (eventDetailKeys && eventDetailKeys.size > 0) {
                let i;
                eventDetailKeys.forEach(function (key) {
                    for (i = self._items.length - 1; i >= 0; i--) {
                        if (oj$1.Object.compareValues(self._items[i].metadata.key, key)) {
                            self._items.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        };
        this._handleMutationUpdate = function (eventDetail) {
            let self = this;
            let eventDetailKeys = eventDetail[DataCache._KEYS];
            let eventDetailData = eventDetail[DataCache._DATA];
            let eventDetailMetadata = eventDetail[DataCache._METADATA];
            if (eventDetailData && eventDetailData.length > 0) {
                let i, index = 0;
                eventDetailKeys.forEach(function (key) {
                    for (i = self._items.length - 1; i >= 0; i--) {
                        if (oj$1.Object.compareValues(self._items[i].metadata.key, key)) {
                            self._items.splice(i, 1, new self.Item(eventDetailMetadata[index], eventDetailData[index]));
                            break;
                        }
                    }
                    index++;
                });
            }
        };
        this.Item = class {
            constructor(metadata, data) {
                this.metadata = metadata;
                this.data = data;
                this[DataCache._METADATA] = metadata;
                this[DataCache._DATA] = data;
            }
        };
        this.FetchByKeysResults = class {
            constructor(fetchParameters, results) {
                this.fetchParameters = fetchParameters;
                this.results = results;
                this[DataCache._FETCHPARAMETERS] = fetchParameters;
                this[DataCache._RESULTS] = results;
            }
        };
        this.FetchByOffsetResults = class {
            constructor(fetchParameters, results, done) {
                this.fetchParameters = fetchParameters;
                this.results = results;
                this.done = done;
                this[DataCache._FETCHPARAMETERS] = fetchParameters;
                this[DataCache._RESULTS] = results;
                this[DataCache._DONE] = done;
            }
        };
        this._items = [];
    }
    addListResult(result) {
        let self = this;
        let items = [];
        result.value.data.forEach(function (data, index) {
            items.push(new self.Item(result.value.metadata[index], data));
        });
        this._items = this._items.concat(items);
        this._done = result.done;
    }
    getDataList(params, offset) {
        this._fetchParams = params;
        let fetchSize = 25;
        if (params.size != null) {
            if (params.size == -1) {
                fetchSize = this.getSize();
            }
            else {
                fetchSize = params.size;
            }
        }
        let items = this._items.slice(offset, offset + fetchSize);
        let data = [];
        let metadata = [];
        items.forEach(function (item) {
            data.push(item.data);
            metadata.push(item.metadata);
        });
        return { fetchParameters: params, data: data, metadata: metadata };
    }
    getDataByKeys(params) {
        let self = this;
        let results = new Map();
        if (params && params.keys) {
            let i;
            params.keys.forEach(function (key) {
                for (i = 0; i < self._items.length; i++) {
                    if (self._items[i].metadata.key == key) {
                        results.set(key, self._items[i]);
                        break;
                    }
                }
            });
        }
        return new this.FetchByKeysResults(params, results);
    }
    getDataByOffset(params) {
        let self = this;
        let results = [];
        let done = true;
        if (params) {
            results = self._items.slice(params.offset, params.offset + params.size);
        }
        return new this.FetchByOffsetResults(params, results, done);
    }
    processMutations(detail) {
        if (detail.remove != null) {
            this._handleMutationRemove(detail.remove);
        }
        if (detail.add != null) {
            this._handleMutationAdd(detail.add);
        }
        if (detail.update != null) {
            this._handleMutationUpdate(detail.update);
        }
    }
    reset() {
        this._items = [];
        this._done = false;
    }
    getSize() {
        return this._items.length;
    }
    isDone() {
        return this._done;
    }
    _getSortComparator(sortCriteria) {
        let self = this;
        return function (x, y) {
            let i, direction, attribute, comparator, xval, yval;
            for (i = 0; i < sortCriteria.length; i++) {
                direction = sortCriteria[i][DataCache._DIRECTION];
                attribute = sortCriteria[i][DataCache._ATTRIBUTE];
                comparator = null;
                xval = self._getVal(x, attribute);
                yval = self._getVal(y, attribute);
                let compareResult = 0;
                let strX = typeof xval === 'string' ? xval : new String(xval).toString();
                let strY = typeof yval === 'string' ? yval : new String(yval).toString();
                if (direction == 'ascending') {
                    compareResult = strX.localeCompare(strY, undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                }
                else {
                    compareResult = strY.localeCompare(strX, undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                }
                if (compareResult != 0) {
                    return compareResult;
                }
            }
            return 0;
        };
    }
    _getVal(val, attr) {
        if (typeof attr == 'string') {
            let dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                let startAttr = attr.substring(0, dotIndex);
                let endAttr = attr.substring(dotIndex + 1);
                let subObj = val[startAttr];
                if (subObj) {
                    return this._getVal(subObj, endAttr);
                }
            }
        }
        if (typeof val[attr] == 'function') {
            return val[attr]();
        }
        return val[attr];
    }
}
DataCache._DATA = 'data';
DataCache._METADATA = 'metadata';
DataCache._ITEMS = 'items';
DataCache._BEFOREKEYS = 'addBeforeKeys';
DataCache._KEYS = 'keys';
DataCache._INDEXES = 'indexes';
DataCache._FROM = 'from';
DataCache._OFFSET = 'offset';
DataCache._REFRESH = 'refresh';
DataCache._MUTATE = 'mutate';
DataCache._SIZE = 'size';
DataCache._FETCHPARAMETERS = 'fetchParameters';
DataCache._SORTCRITERIA = 'sortCriteria';
DataCache._DIRECTION = 'direction';
DataCache._ATTRIBUTE = 'attribute';
DataCache._VALUE = 'value';
DataCache._DONE = 'done';
DataCache._RESULTS = 'results';
DataCache._CONTAINSPARAMETERS = 'containsParameters';
DataCache._DEFAULT_SIZE = 25;
DataCache._CONTAINSKEYS = 'containsKeys';
DataCache._FETCHBYKEYS = 'fetchByKeys';
DataCache._FETCHBYOFFSET = 'fetchByOffset';
DataCache._FETCHFIRST = 'fetchFirst';
DataCache._FETCHATTRIBUTES = 'attributes';
oj$1._registerLegacyNamespaceProp('DataCache', DataCache);

class DataProviderMutationEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions[DataProviderMutationEvent._DETAIL] = detail;
        super('mutate', eventOptions);
    }
}
DataProviderMutationEvent._DETAIL = 'detail';
oj$1._registerLegacyNamespaceProp('DataProviderMutationEvent', DataProviderMutationEvent);

class DataProviderRefreshEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions['detail'] = detail;
        super('refresh', eventOptions);
    }
}
oj$1._registerLegacyNamespaceProp('DataProviderRefreshEvent', DataProviderRefreshEvent);

class FetchByKeysMixin {
    fetchByKeys(params) {
        let fetched = 0;
        let limit = this['getIterationLimit'] ? this['getIterationLimit']() : -1;
        let options = {};
        options['size'] = 25;
        let resultMap = new Map();
        let dataProviderAsyncIterator = this['fetchFirst'](options)[Symbol.asyncIterator]();
        function _fetchNextSet(params, dataProviderAsyncIterator, resultMap) {
            return dataProviderAsyncIterator.next().then(function (result) {
                let value = result['value'];
                let data = value['data'];
                let metadata = value['metadata'];
                let keys = metadata.map(function (metadata) {
                    return metadata['key'];
                });
                let foundAllKeys = true;
                params['keys'].forEach(function (findKey) {
                    if (!resultMap.has(findKey)) {
                        keys.map(function (key, index) {
                            if (key == findKey) {
                                resultMap.set(key, { metadata: metadata[index], data: data[index] });
                            }
                        });
                    }
                    if (!resultMap.has(findKey)) {
                        foundAllKeys = false;
                    }
                });
                fetched += data.length;
                if (!foundAllKeys && !result['done']) {
                    if (limit != -1 && fetched >= limit) {
                        return resultMap;
                    }
                    else {
                        return _fetchNextSet(params, dataProviderAsyncIterator, resultMap);
                    }
                }
                else {
                    return resultMap;
                }
            });
        }
        return _fetchNextSet(params, dataProviderAsyncIterator, resultMap).then(function (resultMap) {
            let mappedResultMap = new Map();
            resultMap.forEach(function (value, key) {
                let mappedItem = [value];
                mappedResultMap.set(key, mappedItem[0]);
            });
            return { fetchParameters: params, results: mappedResultMap };
        });
    }
    containsKeys(params) {
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            let results = new Set();
            params['keys'].forEach(function (key) {
                if (fetchByKeysResult['results'].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve({ containsParameters: params, results: results });
        });
    }
    getCapability(capabilityName) {
        if (capabilityName == 'fetchByKeys') {
            return { implementation: 'iteration' };
        }
        let cap = null;
        if (this['_ojSkipLastCapability'] !== true) {
            this['_ojSkipLastCapability'] = true;
            let index = 1;
            while (this['_ojLastGetCapability' + index]) {
                ++index;
            }
            for (--index; index > 0; index--) {
                cap = this['_ojLastGetCapability' + index](capabilityName);
                if (cap) {
                    break;
                }
            }
            delete this['_ojSkipLastCapability'];
        }
        return cap;
    }
    static applyMixin(derivedCtor) {
        let _lastGetCapability = derivedCtor.prototype['getCapability'];
        let baseCtors = [FetchByKeysMixin];
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
        if (_lastGetCapability) {
            let index = 1;
            while (derivedCtor.prototype['_ojLastGetCapability' + index]) {
                ++index;
            }
            derivedCtor.prototype['_ojLastGetCapability' + index] = _lastGetCapability;
        }
    }
}
oj$1._registerLegacyNamespaceProp('FetchByKeysMixin', FetchByKeysMixin);

class FetchByOffsetMixin {
    fetchByOffset(params) {
        let size = params && params['size'] > 0 ? params['size'] : 25;
        let sortCriteria = params ? params['sortCriteria'] : null;
        let offset = params && params['offset'] > 0 ? params['offset'] : 0;
        let fetched = 0;
        let limit = this['getIterationLimit'] ? this['getIterationLimit']() : -1;
        let done = false;
        let options = {};
        options['size'] = size;
        options['sortCriteria'] = sortCriteria;
        let resultArray = new Array();
        let dataProviderAsyncIterator = this['fetchFirst'](options)[Symbol.asyncIterator]();
        function _fetchNextSet(params, dataProviderAsyncIterator, resultArray) {
            return dataProviderAsyncIterator.next().then(function (result) {
                done = result['done'];
                let value = result['value'];
                let data = value['data'];
                let metadata = value['metadata'];
                let dataLen = data.length;
                if (offset < fetched + dataLen) {
                    let start = offset <= fetched ? 0 : offset - fetched;
                    for (let index = start; index < dataLen; index++) {
                        if (resultArray.length == size) {
                            break;
                        }
                        resultArray.push({ metadata: metadata[index], data: data[index] });
                    }
                }
                fetched += dataLen;
                if (resultArray.length < size && !done) {
                    if (limit != -1 && fetched >= limit) {
                        return resultArray;
                    }
                    else {
                        return _fetchNextSet(params, dataProviderAsyncIterator, resultArray);
                    }
                }
                else {
                    return resultArray;
                }
            });
        }
        return _fetchNextSet(params, dataProviderAsyncIterator, resultArray).then(function (resultArray) {
            return { fetchParameters: params, results: resultArray, done: done };
        });
    }
    getCapability(capabilityName) {
        if (capabilityName == 'fetchByOffset') {
            return { implementation: 'iteration' };
        }
        let cap = null;
        if (this['_ojSkipLastCapability'] !== true) {
            this['_ojSkipLastCapability'] = true;
            let index = 1;
            while (this['_ojLastGetCapability' + index]) {
                ++index;
            }
            for (--index; index > 0; index--) {
                cap = this['_ojLastGetCapability' + index](capabilityName);
                if (cap) {
                    break;
                }
            }
            delete this['_ojSkipLastCapability'];
        }
        return cap;
    }
    static applyMixin(derivedCtor) {
        let _lastGetCapability = derivedCtor.prototype['getCapability'];
        let baseCtors = [FetchByOffsetMixin];
        baseCtors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                if (name !== 'constructor') {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                }
            });
        });
        if (_lastGetCapability) {
            let index = 1;
            while (derivedCtor.prototype['_ojLastGetCapability' + index]) {
                ++index;
            }
            derivedCtor.prototype['_ojLastGetCapability' + index] = _lastGetCapability;
        }
    }
}
oj$1._registerLegacyNamespaceProp('FetchByOffsetMixin', FetchByOffsetMixin);

var FilterUtils;
(function (FilterUtils) {
    function satisfy(selector, itemData) {
        if (!selector) {
            return true;
        }
        else {
            var expTree = _buildExpressionTree(selector);
            return _evaluateExpressionTree(expTree, itemData);
        }
    }
    FilterUtils.satisfy = satisfy;
    function _buildExpressionTree(expression) {
        var subTree;
        var itemTreeArray = [];
        for (var key in expression) {
            if (expression.hasOwnProperty(key)) {
                var value = expression[key];
                if (key.indexOf('$') === 0) {
                    if (_isMultiSelector(key)) {
                        if (value instanceof Array) {
                            subTree = {
                                operator: key,
                                array: []
                            };
                            for (var subindex = 0; subindex < value.length; subindex++) {
                                var itemTree = _buildExpressionTree(value[subindex]);
                                subTree.array.push(itemTree);
                            }
                        }
                        else {
                            throw new Error('not a valid expression: ' + expression);
                        }
                    }
                    else if (_isSingleSelector(key)) {
                        throw new Error('not a valid expression: ' + expression);
                    }
                }
                else if (_isLiteral(value)) {
                    itemTreeArray.push({
                        left: key,
                        right: value,
                        operator: '$eq'
                    });
                }
                else {
                    var partialTree = {
                        left: key
                    };
                    _completePartialTree(partialTree, value);
                    itemTreeArray.push(partialTree);
                }
            }
        }
        if (itemTreeArray.length > 1) {
            subTree = {
                operator: '$and',
                array: itemTreeArray
            };
        }
        else if (itemTreeArray.length === 1) {
            subTree = itemTreeArray[0];
        }
        return subTree;
    }
    function _completePartialTree(partialTree, expression) {
        var found = false;
        for (var key in expression) {
            if (expression.hasOwnProperty(key)) {
                var value = expression[key];
                if (found || !_isSingleSelector(key)) {
                    throw new Error('parsing error ' + expression);
                }
                partialTree.operator = key;
                partialTree.right = value;
                found = true;
            }
        }
    }
    function _evaluateExpressionTree(expTree, itemData) {
        var operator = expTree.operator;
        if (_isMultiSelector(operator)) {
            if (expTree.left || !(expTree.array instanceof Array)) {
                throw new Error('invalid expression tree!' + expTree);
            }
            else {
                var result;
                var subTreeArray = expTree.array;
                for (var subIndex = 0; subIndex < subTreeArray.length; subIndex++) {
                    var subResult = _evaluateExpressionTree(subTreeArray[subIndex], itemData);
                    if (operator === '$or' && subResult === true) {
                        return true;
                    }
                    else if (operator === '$and' && subResult === false) {
                        return false;
                    }
                    result = subResult;
                }
                return result;
            }
        }
        else if (_isSingleSelector(operator)) {
            var value = expTree.right;
            var itemValue;
            if (expTree.left != '*') {
                itemValue = getValue(expTree.left, itemData);
                return _evaluateSingleSelectorExpression(operator, value, itemValue);
            }
            else {
                var i;
                var itemProperties = Object.keys(itemData);
                for (i = 0; i < itemProperties.length; i++) {
                    itemValue = getValue(itemProperties[i], itemData);
                    if (_evaluateSingleSelectorExpression(operator, value, itemValue)) {
                        return true;
                    }
                }
                return false;
            }
        }
        else {
            throw new Error('not a valid expression!' + expTree);
        }
    }
    function _evaluateSingleSelectorExpression(operator, value, itemValue) {
        if (operator === '$lt') {
            var fixedTokens = _fixNullForString(itemValue, value);
            itemValue = fixedTokens[0];
            value = fixedTokens[1];
            return itemValue < value;
        }
        else if (operator === '$gt') {
            var fixedTokens = _fixNullForString(itemValue, value);
            itemValue = fixedTokens[0];
            value = fixedTokens[1];
            return itemValue > value;
        }
        else if (operator === '$lte') {
            var fixedTokens = _fixNullForString(itemValue, value);
            itemValue = fixedTokens[0];
            value = fixedTokens[1];
            return itemValue <= value;
        }
        else if (operator === '$gte') {
            var fixedTokens = _fixNullForString(itemValue, value);
            itemValue = fixedTokens[0];
            value = fixedTokens[1];
            return itemValue >= value;
        }
        else if (operator === '$eq') {
            return itemValue === value;
        }
        else if (operator === '$ne') {
            return itemValue !== value;
        }
        else if (operator === '$regex') {
            if (itemValue) {
                if (!(typeof itemValue === 'string') && !(itemValue instanceof String)) {
                    if (!(itemValue instanceof Object)) {
                        itemValue = new String(itemValue);
                    }
                    else {
                        itemValue = itemValue.toString();
                        if (itemValue == '[object Object]') {
                            return false;
                        }
                    }
                }
                var matchResult = itemValue.match(value);
                return matchResult !== null;
            }
            return false;
        }
        else if (operator === '$exists') {
            if (value) {
                return itemValue !== null && itemValue !== undefined;
            }
            else {
                return itemValue === null || itemValue === undefined;
            }
        }
        else {
            throw new Error('not a valid operator! ' + operator);
        }
        return false;
    }
    function _isMultiSelector(token) {
        return token === '$and' || token === '$or';
    }
    function _isSingleSelector(token) {
        return (token === '$lt' ||
            token === '$gt' ||
            token === '$lte' ||
            token === '$gte' ||
            token === '$eq' ||
            token === '$ne' ||
            token === '$regex' ||
            token === '$exists');
    }
    function _isLiteral(token) {
        return typeof token !== 'object';
    }
    function _isString(token) {
        return token != null && (token instanceof String || typeof token === 'string');
    }
    function _fixNullForString(leftToken, rightToken) {
        if (_isString(leftToken) && rightToken == null) {
            rightToken = '';
        }
        else if (_isString(rightToken) && leftToken == null) {
            leftToken = '';
        }
        return [leftToken, rightToken];
    }
    function getValue(path, itemValue) {
        var paths = path.split('.');
        var returnValue = itemValue;
        for (var index = 0; index < paths.length; index++) {
            returnValue = returnValue[paths[index]];
        }
        return returnValue;
    }
})(FilterUtils || (FilterUtils = {}));

class FilterImpl {
    constructor(options) {
        options = options || {};
        this._textFilterAttributes = options['filterOptions']
            ? options['filterOptions']['textFilterAttributes']
            : null;
        let filterDef = options.filterDef;
        if (filterDef) {
            if (filterDef['op']) {
                this['op'] = filterDef['op'];
                if (filterDef['value']) {
                    this['value'] = filterDef['value'];
                    if (filterDef['attribute']) {
                        this['attribute'] = filterDef['attribute'];
                    }
                }
                else if (filterDef['criteria']) {
                    this['criteria'] = filterDef['criteria'];
                }
            }
            else if (filterDef['text']) {
                this['text'] = filterDef['text'];
            }
        }
    }
    filter(item, index, array) {
        return FilterUtils.satisfy(FilterImpl._transformFilter(this), item);
    }
    static _transformFilter(filter) {
        let transformedExpr;
        if (filter) {
            let op = filter.op;
            let filterValue;
            if (filter['text']) {
                op = '$regex';
            }
            else {
                if (op === '$le') {
                    op = '$lte';
                }
                else if (op === '$ge') {
                    op = '$gte';
                }
                else if (op === '$pr') {
                    op = '$exists';
                }
            }
            if (op != '$and' && op != '$or') {
                if (filter['text']) {
                    filterValue = new RegExp(filter['text'].replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'i');
                }
                else {
                    filterValue = filter.value;
                }
                transformedExpr = {};
                let attributeExpr = filter.attribute;
                if (attributeExpr) {
                    let operatorExpr = {};
                    if (op === '$sw' || op === '$ew' || op === '$co') {
                        op = '$regex';
                        filterValue = FilterImpl._fixStringExpr(op, filterValue);
                    }
                    operatorExpr[op] = filterValue;
                    transformedExpr[attributeExpr] = operatorExpr;
                }
                else if (filter['text']) {
                    let operatorExpr = {};
                    operatorExpr[op] = filterValue;
                    if (filter._textFilterAttributes && filter._textFilterAttributes.length > 0) {
                        let textFilterArray = [];
                        filter._textFilterAttributes.forEach(function (field) {
                            let textFilter = {};
                            textFilter[field] = operatorExpr;
                            textFilterArray.push(textFilter);
                        });
                        transformedExpr['$or'] = textFilterArray;
                    }
                    else {
                        transformedExpr['*'] = operatorExpr;
                    }
                }
                else {
                    let criteriaArray = [];
                    FilterImpl._transformObjectExpr(filterValue, op, null, criteriaArray);
                    transformedExpr['$and'] = criteriaArray;
                }
            }
            else {
                let criteriaArray = [];
                filter.criteria.forEach(function (criterion) {
                    if (criterion && criterion['text'] && filter._textFilterAttributes) {
                        criterion['_textFilterAttributes'] = filter._textFilterAttributes;
                    }
                    criteriaArray.push(FilterImpl._transformFilter(criterion));
                });
                transformedExpr = {};
                transformedExpr[op] = criteriaArray;
            }
        }
        return transformedExpr;
    }
    static _transformObjectExpr(objectExpr, op, path, criteriaArray) {
        let self = this;
        let objectProps = Object.keys(objectExpr);
        if (objectProps.length > 0) {
            Object.keys(objectExpr).forEach(function (fieldAttribute) {
                let fieldValue = objectExpr[fieldAttribute];
                let fieldAttributePath = path ? path + '.' + fieldAttribute : fieldAttribute;
                if (!(fieldValue instanceof Object)) {
                    let operatorExpr = {};
                    if (op === '$sw' || op === '$ew' || op === '$co') {
                        op = '$regex';
                        fieldValue = FilterImpl._fixStringExpr(op, fieldValue);
                    }
                    operatorExpr[op] = fieldValue;
                    let fieldExpr = {};
                    fieldExpr[fieldAttributePath] = operatorExpr;
                    criteriaArray.push(fieldExpr);
                }
                else {
                    FilterImpl._transformObjectExpr(fieldValue, op, fieldAttributePath, criteriaArray);
                }
            });
        }
        else {
            let operatorExpr = {};
            operatorExpr[op] = objectExpr;
            let fieldExpr = {};
            fieldExpr[path] = operatorExpr;
            criteriaArray.push(fieldExpr);
        }
    }
    static _fixStringExpr(op, value) {
        if (typeof value === 'string' || value instanceof String) {
            if (op === '$sw') {
                value = '^' + value;
            }
            else if (op === '$ew') {
                value = value + '$';
            }
        }
        return value;
    }
}
class FilterFactory {
    static getFilter(options) {
        return new FilterImpl(options);
    }
}
oj$1._registerLegacyNamespaceProp('FilterFactory', FilterFactory);

export { AttributeFilterOperator, CompoundFilterOperator, DataCache, DataProviderMutationEvent, DataProviderRefreshEvent, FetchByKeysMixin, FetchByOffsetMixin, FilterFactory };
