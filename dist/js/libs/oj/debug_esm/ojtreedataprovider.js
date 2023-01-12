/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore';

const TreeDataProvider = function () {};
// mapping variable definition, used in a no-require environment. Maps the TreeDataProvider function object to the name used in the require callback.
// eslint-disable-next-line no-unused-vars
oj._registerLegacyNamespaceProp('TreeDataProvider', TreeDataProvider);

/**
 * Get the data provider for the children of the row identified by key.
 *
 *
 * @since 5.1.0
 * @param {any} key key of the row to get child data provider for.
 * @return {TreeDataProvider | null} A TreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof TreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(key: K): TreeDataProvider<K, D> | null"}
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
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
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
 * }
 */

/**
 * Fetch rows by keys.
 * If this method is called on a DataProvider returned from <code>getChildDataProvider(key)</code>,
 * the rows will be only those from the children of the <code>key</code>.
 *
 *
 * @since 4.2.0
 * @param {FetchByKeysParameters} parameters fetch by key parameters
 * @return {Promise.<FetchByKeysResults>} Returns Promise which resolves to {@link FetchByKeysResults}.
 * @export
 * @expose
 * @memberof TreeDataProvider
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
 * Check if there are rows containing the specified keys.
 * If this method is called on a DataProvider returned from <code>getChildDataProvider(key)</code>,
 * the rows will be only those from the children of the <code>key</code>.
 *
 *
 * @since 4.2.0
 * @param {FetchByKeysParameters} parameters contains by key parameters
 * @return {Promise.<ContainsKeysResults>} Returns Promise which resolves to {@link ContainsKeysResults}.
 * @export
 * @expose
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 * @ojsignature {target: "Type",
 *               value: "?(initialSet?: Set<K>): Set<K>"}
 * @ojtsexample <caption>create empty key Set</caption>
 * let keySet = dataprovider.createOptimizedKeySet();
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
 * @memberof TreeDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 * @ojsignature {target: "Type",
 *               value: "?(initialMap?: Map<K, D>): Map<K, D>"}
 * @ojtsexample <caption>create empty key Map</caption>
 * let keyMap = dataprovider.createOptimizedKeyMap();
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 *
 * @export
 * @expose
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
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
 * @memberof TreeDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

// end of jsdoc
