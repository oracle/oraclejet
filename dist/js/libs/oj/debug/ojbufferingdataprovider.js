/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojeventtarget', 'ojs/ojmap', 'ojs/ojset', 'ojs/ojbufferingdataproviderevents', 'ojs/ojbufferingutils'], function (oj, ojdataprovider, ojeventtarget, ojMap, ojSet, ojbufferingdataproviderevents, ojbufferingutils) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    ojMap = ojMap && Object.prototype.hasOwnProperty.call(ojMap, 'default') ? ojMap['default'] : ojMap;
    ojSet = ojSet && Object.prototype.hasOwnProperty.call(ojSet, 'default') ? ojSet['default'] : ojSet;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     *
     * @since 9.0.0
     * @export
     * @final
     * @class BufferingDataProvider
     * @ojtsmodule
     * @implements DataProvider
     * @classdesc
     * <p>BufferingDataProvider is a wrapping DataProvider that provides edit buffering for an underlying DataProvider, so that
     * the edits can be committed to the data source later on.
     * The underlying DataProvider is responsible for fetching data, and BufferingDataProvider will merge any buffered edits with
     * the underlying data so that they appear as an unified set of data.
     * </p>
     * <p>Because all edits are tracked by keys, the underlying DataProvider must return unique keys in the metadata.  If new rows
     * are added, unique keys must be specified for the new rows.
     * </p>
     * <p>In addition to the methods in the DataProvider interface, BufferingDataProvider implements a set of methods for managing edits:
     * <ul>
     *   <li>addItem</li>
     *   <li>removeItem</li>
     *   <li>updateItem</li>
     *   <li>getSubmittableItems</li>
     *   <li>resetAllUnsubmittedItems</li>
     *   <li>resetUnsubmittedItem</li>
     *   <li>setItemStatus</li>
     * </ul>
     * </p>
     * <p>In a typical usage scenario, an application will:
     * <ol>
     *   <li>Create an instance of the underlying DataProvider that provides the actual data.
     *   <li>Create an instance of BufferingDataProvider, passing the underlying DataProvider instance and any options.
     *   <li>Call "addItem", "removeItem", and "updateItem" on the BufferingDataProvider instance to create edit items, usually in response
     *       to user interactions.  These methods correspond to the basic data operations.  Buffer entries will be created for the edit items
     *       with a status of "unsubmitted".
     *   <li>When ready to submit the edits, call "getSubmittableItems" to get the list of submittable edit items.
     *   <li>Call "setItemStatus" to set the edit items' status to "submitting".
     *   <li>Submit the actual data to the data source and wait for its completion.  How this is done is up to the application and dependent
     *       on the data source.
     *   <li>If the submission is successful, call "setItemStatus" to set the edit items' status to "submitted".
     *       If the submission is unsuccessful, call "setItemStatus" to set the edit items' status
     *       to "unsubmitted" and pass error messages if available.
     *   <li>Show the error messages to the user if needed.
     * </ol>
     * </p>
     *
     * <p>In general, the edit item data should have the same shape as the data in the underlying DataProvider.  If sorting and filtering is used
     * in the underlying DataProvider, the application should ensure that all attributes referenced in the sort criterion and filter criterion are
     * included in the item data. Furthermore, iterators obtained by fetchFirst must all use the same sortCriteria if the application is using
     * those iterators at the same time.
     * </p>
     * <p>New rows are inserted at the beginning of the underlying data with latest item on top.
     * </p>
     * <p>
     * Updated rows are staying in their current position.
     * <p>
     * When uncommitted rows are sorted in current row set, their positions will correspond to server side position once they are committed.
     * Uncommitted rows will be sorted according to updated row set.
     * </p>
     * </p>
     * When new/updated items are committed, and if the underlying DataProvider fires mutate events for the committed items,
     * those items will not be sorted based on SortCriteria. The items will stay in their current positions until a subsequent sort or refresh.
     * </p>
     * <pre class="prettyprint"><code>
     * // ex: added and committed a new row with id 85
     *{
     *  add: {
     *    metadata: [{key: 85}],
     *    addBeforeKeys:[0],
     *    ...
     *  }
     *}
     * </code></pre>
     * <p>
     * Subsequent to a new/updated row but before the commit, the row can be sorted or filtered.
     * The sorted/filtered position of the row stays after the commit until a subsequent re-order/refresh.
     *
     * When uncommitted rows are sorted in current row set, their positions will correspond to server side position once they are committed.
     * Uncommitted rows will be sorted according to updated row set.
     * </p>
     *
     * <p>BufferingDataProvider does not validate the item key and data.  It is up to the application to perform any validation
     * prior to creating edit items in the buffer.
     * </p>
     *
     * <h3 id="events-section">
     *   Events
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
     * </h3>
     * Consumers can add event listeners to listen for the following event types and respond to data change.
     * <h4 id="event:mutate" class="name">
     *   mutate
     * </h4>
     * This event is fired when items have been added or removed from the data.
     * <p>
     * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
     * </p>
     *
     * <h4 id="event:refresh" class="name">
     *   refresh
     * </h4>
     * This event is fired when the data has been refreshed and components need to re-fetch the data.
     * <p>
     * This event contains no additional event payload.
     * </p>
     *
     * <h4 id="event:submittableChange" class="name">
     *   submittableChange
     * </h4>
     * This event is fired when the number of submittable edit items has changed.  An edit item is submittable if it is in "unsubmitted"
     * status and there is no other edit item with the same key in "submitting" status.
     * <p>
     * Event payload is found under <code class="prettyprint">event.detail</code>, which is array of objects that implement the {@link EditItem} interface.
     * </p>
     *
     * <i>Example of consumer listening for the "submittableChange" event type:</i>
     * <pre class="prettyprint"><code>let listener = function(event) {
     *   const editItems = event.detail;
     *   console.log("Number of submittable edit items: " + editItems.length);
     * };
     * dataProvider.addEventListener("submittableChange", listener);
     * </code></pre>
     *
     * @param {DataProvider} dataProvider The underlying DataProvider that provides the original data.
     * @param {BufferingDataProvider.Options=} options Options for the BufferingDataProvider
     * @ojsignature [{target: "Type",
     *               value: "class BufferingDataProvider<K, D> implements DataProvider<K, D>",
     *               genericParameters: [{"name": "K", "description": "Type of key"}, {"name": "D", "description": "Type of data"}]},
     *               {target: "Type",
     *               value: "DataProvider<K, D>",
     *               for: "dataProvider"},
     *               {target: "Type",
     *               value: "BufferingDataProvider.Options<K, D>",
     *               for: "options"}]
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "FetchByKeysParameters",
     *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
     *   "FetchListResult","FetchListParameters", "Item", "ItemWithOptionalData", "ItemMessage"]}
     */

    /**
     * @typedef {Object} BufferingDataProvider.Options
     * @property {Function=} keyGenerator - Optional keyGenerator to use when a null key is passed in for addItem(). By default, BufferingDataProvider will
     * generate a v4 UUID string. Please use this option to supply your own key generator. The key generator function takes value as parameter and returns a key.
     * @ojsignature [{target: "Type", value: "<K, D>", for: "genericTypeParameters"},
     *               {target: "Type",
     *               value: "{ keyGenerator?: (value: Partial<D>) => K }"}]
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name containsKeys
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name createOptimizedKeySet
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name createOptimizedKeyMap
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
     * @memberof BufferingDataProvider
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
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name dispatchEvent
     */

    /**
     * Create a buffer entry for adding a row.  The entry initially has a status of 'unsubmitted'.
     * <p>
     * If a "remove" entry with same key already exists then it will be removed and an "update" entry with new data will be added to buffer.
     * </p><p>
     * Application can call setItemStatus to change the status of the entry to 'submitting' or 'submitted'.
     * There can be at most one entry in 'unsubmitted' status and one entry in 'submitting' status with the same key.  This
     * allows application to keep track of additional changes to a row while submitting previous changes.
     * </p>
     * <p>
     * Note: Starting in 12.0.1, addItem supports passing in an item which has null key. If the key is null then
     * a string typed v4 UUID key is generated for the key. It is expected that the application will later call
     * setItemStatus with the newKey parameter to pass in the real key once it becomes available after commit. The
     * newKey will then be stored in an internal map with the generated key and then when the underlying DataProvider
     * subsequently dispatches an add mutation event which contains the new key then the BufferingDataProvider will
     * include a remove mutation which will remove the row with the generated key. If a non-string typed or
     * non-v4 UUID generated key is desired then please use the constructor option: keyGenerator.
     *
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name addItem
     * @param {Item<K, D>} item - an Item object that represents the row.
     * @param {Object=} addDetail - object that represents addBefore Row. If addItem method is called only with item
     * parameter then item will be added at the top. If addBeforeKey is provided and that key exist in base dataprovider then item will be added before that key.
     * If addBeforeKey is null or provided key doesn't exist in base dataprovider then item will be added at the end.
     * @throws {Error} if an "add" or "update" entry already exists for the same key.
     * @ojsignature {target: "Type",
     *               value: "(item: Item<K, D>, addDetail?: {addBeforeKey?: K | null}): void"}
     */

    /**
     * Create a buffer entry for removing a row.  The entry initially has a status of 'unsubmitted'.
     * <p>
     * If an "add" entry already exists, it will be deleted.<br>
     * If an "update" entry already exists, it will be removed and a new "remove" entry will be added.
     * </p><p>
     * Application can call setItemStatus to change the status of the entry to 'submitting' or 'submitted'.
     * There can be at most one entry in 'unsubmitted' status and one entry in 'submitting' status with the same key.  This
     * allows application to keep track of additional changes to a row while submitting previous changes.
     * </p>
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name removeItem
     * @param {ItemWithOptionalData} item - an ItemWithOptionalData object that represents the row.
     * @throws {Error} if a "remove" entry already exists for the same key.
     * @ojsignature {target: "Type",
     *               value: "(item: ItemWithOptionalData<K, D>): void"}
     */

    /**
     * Create a buffer entry for updating a row.  The entry initially has a status of 'unsubmitted'.
     * <p>
     * If an "add" or "update" entry already exists, the data of the entry will be changed.
     * </p><p>
     * Application can call setItemStatus to change the status of the entry to 'submitting' or 'submitted'.
     * There can be at most one entry in 'unsubmitted' status and one entry in 'submitting' status with the same key.  This
     * allows application to keep track of additional changes to a row while submitting previous changes.
     * </p>
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name updateItem
     * @param {Item<K, D>} item - an Item object that represents the row.
     * @throws {Error} if a "remove" entry already exists for the same key.
     * @ojsignature {target: "Type",
     *               value: "(item: Item<K, D>): void"}
     */

    /**
     * Get the list of all submittable edit items.
     * <p>
     * Caller should call setItemStatus to change the status
     * to "submitting" when ready to submit.  Once the edit item for a key is moved to 'submitting', new edit for the same
     * key will be tracked separately.  There can be at most one "submitting" edit item and one "unsubmitted" edit item for the same key.
     * Since we are using key to tracking edit, the key value should be immutable. We could not update the key value in "updateItem".
     * </p>
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name getSubmittableItems
     * @return {Array<BufferingDataProvider.EditItem<K, D>>} an array of all submittable edit items.  Each edit item implements the {@link EditItem} interface.
     * @ojsignature {target: "Type",
     *               value: "(): Array<BufferingDataProvider.EditItem<K, D>>"}
     */

    /**
     * Reset all rows by discarding all 'unsubmitted' edit items, so that the data from the underlying
     * DataProvider will be used.
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name resetAllUnsubmittedItems
     * @return {void}
     */

    /**
     * Reset a row by discarding any 'unsubmitted' edit item for the row, so that the data from the underlying
     * DataProvider will be used.
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name resetUnsubmittedItem
     * @return {void}
     * @param {K} key - The key of the row to reset.
     * @ojsignature {target: "Type",
     *               value: "(key: K): void"}
     */

    /**
     * Set the status of an edit item.
     * <p>
     * Application should set an edit item to 'submitting' before committing its change to the data source.  This will prevent
     * any new edit item with the same key from being changed to 'submitting'.
     * </p><p>
     * When setting an edit item from 'submitting' back to 'unsubmitted' (usually upon submission error),
     * and there is another 'unsubmitted' entry for the same key (this happens when edit is allowed while an edit item is submitting),
     * the error will be set on the new 'unsubmitted' entry and the current 'submitting' entry will be disposed.
     * </p><p>
     * when setting an edit item to 'submitted', the edit item will be removed from the buffer.
     * </p>
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof BufferingDataProvider
     * @instance
     * @method
     * @name setItemStatus
     * @param {BufferingDataProvider.EditItem<K, D>} editItem - The edit item to set status on.  This should implement the {@link EditItem} interface and is
     *   usually one of the items returned by the getSubmittableItems method.
     * @param {'unsubmitted' | 'submitting' | 'submitted'} newStatus - the new status of the edit item.
     *   If an edit item is marked as "submitted", it will be removed at the DataProvider's discretion.
     * @param {ItemMessage?} error - an optional error message.
     * @param {K?} newKey - an optional new key for the item. This is used in cases where addItem was called with a null key which will cause BufferingDataProvider
     * to generate a key. Passing in the real key when it becomes available will enable BufferingDataProvider to map the real and generated keys so that a subsequent
     * add mutation event for the real key will result in BufferingDataProvider also including a remove for the generated key.
     * @ojsignature {target: "Type",
     *               value: "(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage, newKey?: K): void"}
     */

    // end of jsdoc

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     * The interface for EditItem
     *
     *
     * @since 9.0.0
     * @export
     * @interface EditItem
     * @ojtsnamespace BufferingDataProvider
     * @ojsignature {target: "Type",
     *               value: "interface EditItem<K, D>",
     *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]}
     */

    /**
     * The type of buffered edit.
     * <p>
     * Possible values are:<ul>
     * <li>'add': The edit is for adding a new item to the data source.</li>
     * <li>'remove': The edit is for removing an existing item from the data source.</li>
     * <li>'update': The edit is for updating an existing item from the data source.</li>
     * </ul>
     * </p>
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof EditItem
     * @instance
     * @readonly
     * @name operation
     * @type {'add' | 'remove' | 'update'}
     * @ojsignature {target: "Type",
     *               value: "'add' | 'remove' | 'update'"}
     */

    /**
     * The Item object that represents the edited item.
     *
     *
     * @since 9.0.0
     * @export
     * @expose
     * @memberof EditItem
     * @instance
     * @readonly
     * @name item
     * @type {ItemWithOptionalData<K, D>}
     * @ojsignature {target: "Type",
     *               value: "ItemWithOptionalData<K, D>"}
     */

    // end of jsdoc

    /**
     * Class which provides edit buffering
     */
    class BufferingDataProvider {
        constructor(_dataProvider, _options) {
            var _a;
            this._dataProvider = _dataProvider;
            this._options = _options;
            this.AsyncIterable = (_a = class {
                    constructor(_parent, _asyncIterator) {
                        this._parent = _parent;
                        this._asyncIterator = _asyncIterator;
                        this[Symbol.asyncIterator] = function () {
                            return this._asyncIterator;
                        };
                    }
                },
                Symbol.asyncIterator,
                _a);
            this.AsyncIterator = class {
                constructor(_parent, _baseIterator, _params) {
                    this._parent = _parent;
                    this._baseIterator = _baseIterator;
                    this._params = _params;
                    this.mergedAddKeySet = new ojSet();
                    this.mergedItemArray = [];
                    this.nextOffset = 0;
                    if (this._params == null) {
                        this._params = {};
                    }
                }
                next() {
                    return ojbufferingutils.BufferingDataProviderUtils.fetchNext(this._params, this._baseIterator, this, this._parent.lastSortCriteria, this._parent.editBuffer, this._parent);
                }
            };
            this.editBuffer = new ojbufferingutils.EditBuffer();
            this.lastSortCriteria = null;
            this.lastIterator = null;
            this.customKeyGenerator = _options?.keyGenerator;
            this.generatedKeyMap = new ojMap();
            this.totalFilteredRowCount = 0;
            this.dataBeforeUpdated = new Map();
            this.dataProvider = _dataProvider;
            this.options = _options;
            this._addEventListeners();
        }
        containsKeys(params) {
            return ojbufferingutils.BufferingDataProviderUtils.containsKeys(params, this.editBuffer, this.dataProvider);
        }
        fetchByKeys(params) {
            return ojbufferingutils.BufferingDataProviderUtils.fetchByKeys(params, this.editBuffer, this.dataProvider);
        }
        removeItem(item) {
            const mutationEvent = ojbufferingutils.BufferingDataProviderUtils.removeItem(item, this.lastIterator, this.editBuffer);
            this.dispatchEvent(mutationEvent);
            this.dispatchSubmittableChangeEvent(this.editBuffer);
        }
        updateItem(item) {
            const mutationEvent = ojbufferingutils.BufferingDataProviderUtils.updateItem(item, this.editBuffer);
            this.dispatchEvent(mutationEvent);
            this.dispatchSubmittableChangeEvent(this.editBuffer);
        }
        addItem(item, addDetail) {
            const addItem = Object.assign({}, item);
            if (item.metadata.key === null) {
                addItem.metadata = Object.assign({}, item.metadata);
                addItem.metadata.key = ojbufferingutils.BufferingDataProviderUtils.generateKey(item.data, this.customKeyGenerator);
            }
            const mutationEvent = ojbufferingutils.BufferingDataProviderUtils.addItem(addItem, this.editBuffer, this.lastIterator, addDetail);
            this.dispatchEvent(mutationEvent);
            this.dispatchSubmittableChangeEvent(this.editBuffer);
        }
        fetchByOffset(params) {
            return ojbufferingutils.BufferingDataProviderUtils.fetchByOffset(params, this.editBuffer, this.dataProvider);
        }
        fetchFirst(params) {
            this.lastSortCriteria = params ? params.sortCriteria : null;
            const baseIterator = this.dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
            this.lastIterator = new this.AsyncIterator(this, baseIterator, params);
            return new this.AsyncIterable(this, this.lastIterator);
        }
        getCapability(capabilityName) {
            return ojbufferingutils.BufferingDataProviderUtils.getCapability(capabilityName, this.dataProvider);
        }
        getTotalSize() {
            return ojbufferingutils.BufferingDataProviderUtils.getTotalSize(this.dataProvider, this.editBuffer);
        }
        isEmpty() {
            return ojbufferingutils.BufferingDataProviderUtils.isEmpty(this.editBuffer, this.dataProvider);
        }
        getSubmittableItems() {
            return ojbufferingutils.BufferingDataProviderUtils.getSubmittableItems(this.editBuffer);
        }
        resetAllUnsubmittedItems() {
            ojbufferingutils.BufferingDataProviderUtils.resetAllUnsubmittedItems(this.editBuffer);
            this.dispatchSubmittableChangeEvent(this.editBuffer);
            this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
        }
        resetUnsubmittedItem(key) {
            const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
            const keySet = new Set();
            // Remove the reset items from buffer and fire submittableChange event
            const editItem = unsubmittedItems.get(key);
            if (!editItem) {
                return;
            }
            keySet.add(key);
            unsubmittedItems.delete(key);
            this.dispatchSubmittableChangeEvent(this.editBuffer);
            ojbufferingutils.BufferingDataProviderUtils.resetUnsubmittedItem(editItem, this.editBuffer, this.dataProvider, this.lastIterator, keySet).then((mutationEvent) => {
                this.dispatchEvent(mutationEvent);
            });
        }
        setItemStatus(editItem, newStatus, error, newKey) {
            const editBuffer = ojbufferingutils.BufferingDataProviderUtils.setItemStatus(editItem, newStatus, this.generatedKeyMap, this.editBuffer, error, newKey);
            if (editBuffer) {
                // If any item is changing status, we may have submittable items.
                // Call dispatchSubmittableChangeEvent, which will figure out if we need to fire submittableChange event.
                this.dispatchSubmittableChangeEvent(editBuffer);
            }
        }
        dispatchSubmittableChangeEvent(editBuffer) {
            // Fire the submittableChange event if the number of submittable item has changed
            const submittable = ojbufferingutils.BufferingDataProviderUtils.getSubmittableItems(editBuffer);
            const event = new ojbufferingdataproviderevents.BufferingDataProviderSubmittableChangeEvent(submittable);
            this.dispatchEvent(event);
        }
        // Dupped code to buffering utils to make sure people who used to get synchronous events still do, even tho we should await fetchByKeys
        _handleRefreshEvent(event) {
            // reset dataBeforeUpdated
            this.dataBeforeUpdated = new Map();
            // If we get a refresh event from the underlying DataProvider, check to see if the
            // unsubmitted remove and update edits still exist in the underlying DataProvider
            const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
            const keySet = new Set();
            unsubmittedItems.forEach((editItem) => {
                if (editItem.operation === 'remove' || editItem.operation === 'update') {
                    keySet.add(editItem.item.metadata.key);
                }
            });
            if (keySet.size > 0) {
                this.dataProvider.fetchByKeys({ keys: keySet }).then((resultObj) => {
                    resultObj.results.forEach((item, key) => {
                        keySet.delete(key);
                    });
                    // keySet now contains the keys of remove and update edits that no longer exist in the underlying DataProvider,
                    // so we remove them from the buffer.
                    keySet.forEach((key) => {
                        unsubmittedItems.delete(key);
                    });
                    // Fire the refresh event after we have cleaned up the buffer
                    this.dispatchEvent(event);
                });
            }
            else {
                // Fire the refresh event if we don't need to clean up the buffer
                this.dispatchEvent(event);
            }
        }
        _addEventListeners() {
            this.dataProvider.addEventListener(BufferingDataProvider._REFRESH, this._handleRefreshEvent.bind(this));
            this.dataProvider.addEventListener(BufferingDataProvider._MUTATE, (event) => {
                this.dataBeforeUpdated = new Map();
                const mutationEvent = ojbufferingutils.BufferingDataProviderUtils.handleMutateEvent(event, this.editBuffer, this.lastIterator, this.generatedKeyMap, this.lastSortCriteria);
                this.dispatchEvent(mutationEvent);
            });
        }
    }
    BufferingDataProvider._REFRESH = 'refresh';
    BufferingDataProvider._MUTATE = 'mutate';
    ojeventtarget.EventTargetMixin.applyMixin(BufferingDataProvider);
    oj._registerLegacyNamespaceProp('BufferingDataProvider', BufferingDataProvider);

    return BufferingDataProvider;

});
