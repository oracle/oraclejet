/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojeventtarget', 'ojs/ojmap', 'ojs/ojbufferingdataproviderevents', 'ojs/ojset', 'ojs/ojcomponentcore'], function (oj, ojdataprovider, ojeventtarget, ojMap, ojbufferingdataproviderevents, ojSet, ojcomponentcore) { 'use strict';

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
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
     *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
     *   "FetchListResult","FetchListParameters", "FetchAttribute", "DataFilter", "Item", "ItemWithOptionalData", "ItemMessage"]}
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
     * If a "remove" entry already exists:
     * <ol>
     * <li>
     * If the "remove" entry does not have data, it will be changed to an "update" entry with the new data.
     * </li><li>
     * If the "remove" entry has data, it will be compared to the new data passed to this method.<br>
     *      If the data are the same, the "remove" entry will be removed and no new entry will be created.<br>
     *      If the data are different, the "remove" entry will be changed to an "update" entry with the new data.
     * </li>
     * </ol>
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
     * @throws {Error} if an "add" or "update" entry already exists for the same key.
     * @ojsignature {target: "Type",
     *               value: "(item: Item<K, D>): void"}
     */

    /**
     * Create a buffer entry for removing a row.  The entry initially has a status of 'unsubmitted'.
     * <p>
     * If an "add" entry already exists, it will be deleted.<br>
     * If an "update" entry already exists, it will be changed to a "remove" entry.
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
     *               value: "(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage, mewKey?: K): void"}
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

    class EditBuffer {
        constructor() {
            this.unsubmittedItems = new ojMap();
            this.submittingItems = new ojMap();
            this.submittedAddItems = new ojMap();
            this.addItemOrder = [];
            this.mapOpTransform = new ojMap();
            this.mapEditItemStatus = new ojMap();
        }
        addItem(item) {
            const key = item.metadata.key;
            const unsubmitted = this.unsubmittedItems.get(key);
            const submitting = this.submittingItems.get(key);
            if ((unsubmitted && (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) ||
                (submitting && (submitting.operation === 'add' || submitting.operation === 'update'))) {
                throw new Error('Cannot add item with same key as an item being added or updated');
            }
            else if (unsubmitted && unsubmitted.operation === 'remove') {
                this.unsubmittedItems.delete(key);
                const editItem = { operation: 'update', item };
                this.unsubmittedItems.set(key, editItem);
                this.mapOpTransform.set(key, editItem);
                this.addItemOrder.unshift(key);
                return;
            }
            this.unsubmittedItems.set(key, { operation: 'add', item });
            this.addItemOrder.unshift(key);
        }
        removeItem(item) {
            const key = item.metadata.key;
            const unsubmitted = this.unsubmittedItems.get(key);
            const submitting = this.submittingItems.get(key);
            if ((unsubmitted && unsubmitted.operation === 'remove') ||
                (submitting && submitting.operation === 'remove')) {
                throw new Error('Cannot remove item with same key as an item being removed');
            }
            else if (unsubmitted && unsubmitted.operation === 'add') {
                this.unsubmittedItems.delete(key);
                this._removeFromAddItemOrder(key);
                return;
            }
            else if (unsubmitted && unsubmitted.operation === 'update') {
                this.unsubmittedItems.set(key, {
                    operation: 'remove',
                    item
                });
                this.mapOpTransform.delete(key);
                this._removeFromAddItemOrder(key);
                this.submittedAddItems.delete(key);
                return;
            }
            this._removeFromAddItemOrder(key);
            this.submittedAddItems.delete(key);
            this.unsubmittedItems.set(key, { operation: 'remove', item });
        }
        updateItem(item) {
            const unsubmitted = this.unsubmittedItems.get(item.metadata.key);
            const submitting = this.submittingItems.get(item.metadata.key);
            if ((unsubmitted && unsubmitted.operation === 'remove') ||
                (submitting && submitting.operation === 'remove')) {
                throw new Error('Cannot update item with same key as an item being removed');
            }
            else if (unsubmitted &&
                (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) {
                this.unsubmittedItems.set(item.metadata.key, {
                    operation: unsubmitted.operation,
                    item
                });
                return;
            }
            this.unsubmittedItems.set(item.metadata.key, { operation: 'update', item });
        }
        setItemMutated(editItem) {
            const key = editItem.item.metadata.key;
            const item = this.submittingItems.get(key);
            if (item) {
                const status = this.mapEditItemStatus.get(key);
                if (status === 'submitted') {
                    this.submittingItems.delete(key);
                    if (this._isAddOrMoveAdd(item)) {
                        this.submittedAddItems.set(key, item);
                    }
                }
                else {
                    this.mapEditItemStatus.set(key, 'mutated');
                    this.submittingItems.set(key, item);
                }
            }
        }
        setItemStatus(editItem, newStatus, error) {
            const key = editItem.item.metadata.key;
            if (newStatus === 'submitting') {
                this.unsubmittedItems.delete(key);
                this.submittingItems.set(key, editItem);
            }
            else if (newStatus === 'submitted') {
                if (editItem) {
                    const status = this.mapEditItemStatus.get(key);
                    if (status === 'mutated') {
                        this.submittingItems.delete(key);
                        if (this._isAddOrMoveAdd(editItem)) {
                            this.submittedAddItems.set(key, editItem);
                        }
                    }
                    else {
                        this.mapEditItemStatus.set(key, 'submitted');
                    }
                }
            }
            else if (newStatus === 'unsubmitted') {
                this.submittingItems.delete(key);
                let newEditItem;
                if (error) {
                    newEditItem = {
                        operation: editItem.operation,
                        item: {
                            data: editItem.item.data,
                            metadata: {
                                key: editItem.item.metadata.key,
                                message: error
                            }
                        }
                    };
                }
                else {
                    newEditItem = editItem;
                }
                this.unsubmittedItems.set(key, newEditItem);
            }
        }
        getUnsubmittedItems() {
            return this.unsubmittedItems;
        }
        getSubmittingItems() {
            return this.submittingItems;
        }
        getSubmittedAddItems() {
            return this.submittedAddItems;
        }
        isEmpty(includeSubmitted) {
            return (this.unsubmittedItems.size === 0 &&
                this.submittingItems.size === 0 &&
                (includeSubmitted ? this.submittedAddItems.size === 0 : true));
        }
        getItem(key, includeSubmitted) {
            let editItem = this.unsubmittedItems.get(key);
            if (!editItem) {
                editItem = this.submittingItems.get(key);
            }
            if (includeSubmitted && !editItem) {
                editItem = this.submittedAddItems.get(key);
            }
            return editItem;
        }
        isUpdateTransformed(key) {
            return this.mapOpTransform.get(key) ? true : false;
        }
        getEditItemStatus(key) {
            return this.mapEditItemStatus.get(key);
        }
        isSubmittingOrSubmitted(key) {
            return this.submittingItems.has(key) || this.submittedAddItems.has(key);
        }
        resetAllUnsubmittedItems() {
            this._clearAddItemOrder();
            this.unsubmittedItems.clear();
            this.submittingItems.clear();
            this.mapOpTransform.clear();
        }
        _clearAddItemOrder() {
            this.unsubmittedItems.forEach((editItem, key) => {
                if (this._isAddOrMoveAdd(editItem)) {
                    this._removeFromAddItemOrder(key);
                }
            });
            this.submittingItems.forEach((editItem, key) => {
                if (this._isAddOrMoveAdd(editItem)) {
                    this._removeFromAddItemOrder(key);
                }
            });
        }
        _removeFromAddItemOrder(key) {
            let index = this.addItemOrder.findIndex((k) => {
                return oj.KeyUtils.equals(k, key);
            });
            if (index !== -1) {
                this.addItemOrder.splice(index, 1);
            }
        }
        _isAddOrMoveAdd(editItem) {
            return editItem.operation === 'add' || this._isMoveAdd(editItem);
        }
        _isMoveAdd(editItem) {
            return editItem.operation === 'update' && this.isUpdateTransformed(editItem.item.metadata.key);
        }
        getAddItemOrder() {
            return this.addItemOrder;
        }
    }

    class BufferingDataProvider {
        constructor(dataProvider, options) {
            var _a;
            this.dataProvider = dataProvider;
            this.options = options;
            this._generateKey = (value) => {
                if (this.customKeyGenerator) {
                    return this.customKeyGenerator(value);
                }
                else {
                    if (crypto.randomUUID) {
                        return crypto.randomUUID();
                    }
                    else {
                        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
                    }
                }
            };
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
                _fetchNext() {
                    const signal = this._params?.signal;
                    const callback = (resolve) => {
                        return resolve(this._baseIterator.next().then(async (result) => {
                            if (result.value.fetchParameters && result.value.fetchParameters.sortCriteria) {
                                this._parent.lastSortCriteria = result.value.fetchParameters.sortCriteria;
                            }
                            const baseItemArray = result.value.data.map((val, index) => {
                                return { data: result.value.data[index], metadata: result.value.metadata[index] };
                            });
                            this._parent.totalFilteredRowCount = result.value.totalFilteredRowCount;
                            await this._parent._mergeEdits(baseItemArray, this.mergedItemArray, this._params.filterCriterion, this._parent.lastSortCriteria, this.mergedAddKeySet, result.done);
                            let actualReturnSize = this.mergedItemArray.length - this.nextOffset;
                            for (let i = this.nextOffset; i < this.mergedItemArray.length; i++) {
                                const item = this.mergedItemArray[i];
                                if (this._parent._isItemRemoved(item.metadata.key)) {
                                    --actualReturnSize;
                                }
                            }
                            const params = this._params || {};
                            if ((params.size && actualReturnSize < params.size) ||
                                (params.size == null && actualReturnSize === 0)) {
                                if (!result.done) {
                                    return this._fetchNext();
                                }
                            }
                            const newDataArray = [];
                            const newMetaArray = [];
                            let idx;
                            for (idx = this.nextOffset; idx < this.mergedItemArray.length; idx++) {
                                const item = this.mergedItemArray[idx];
                                if (!this._parent._isItemRemoved(item.metadata.key)) {
                                    this.nextOffset = idx + 1;
                                    newDataArray.push(item.data);
                                    newMetaArray.push(item.metadata);
                                    if (params.size && newDataArray.length === params.size) {
                                        break;
                                    }
                                }
                            }
                            const done = result.done && newDataArray.length === 0;
                            return {
                                done,
                                value: {
                                    fetchParameters: this._params,
                                    data: newDataArray,
                                    metadata: newMetaArray,
                                    totalFilteredRowCount: this._params?.includeFilteredRowCount === 'enabled'
                                        ? this._parent.totalFilteredRowCount
                                        : null
                                }
                            };
                        }));
                    };
                    return ojdataprovider.wrapWithAbortHandling(signal, callback, false);
                }
                ['next']() {
                    return this._fetchNext();
                }
            };
            this._addEventListeners(dataProvider);
            this.editBuffer = new EditBuffer();
            this.lastSortCriteria = null;
            this.lastIterator = null;
            this.customKeyGenerator = options?.keyGenerator;
            this.generatedKeyMap = new ojMap();
            this.totalFilteredRowCount = 0;
            this.dataBeforeUpdated = new Map();
        }
        _fetchByKeysFromBuffer(params) {
            const results = new ojMap();
            const unresolvedKeys = new Set();
            params.keys.forEach((key) => {
                const editItem = this.editBuffer.getItem(key);
                if (editItem) {
                    switch (editItem.operation) {
                        case 'add':
                        case 'update':
                            results.set(key, editItem.item);
                            break;
                        case 'remove':
                            break;
                    }
                }
                else {
                    unresolvedKeys.add(key);
                }
            });
            return { results, unresolvedKeys };
        }
        _compareItem(d1, d2, sortCriteria) {
            for (const sortCrt of sortCriteria) {
                let comparator = ojdataprovider.SortUtils.getNaturalSortComparator();
                const descendingResult = sortCrt.direction === 'descending' ? -1 : 1;
                const comparatorResult = comparator(d1[sortCrt.attribute], d2[sortCrt.attribute]) * descendingResult;
                if (comparatorResult !== 0) {
                    return comparatorResult;
                }
            }
            return 0;
        }
        _insertAddEdits(editItems, filterObj, sortCriteria, itemArray, mergedAddKeySet, lastBlock) {
            editItems.forEach(async (editItem, key) => {
                if (editItem.operation === 'add') {
                    if (!filterObj || filterObj.filter(editItem.item.data)) {
                        this.totalFilteredRowCount++;
                    }
                }
                else {
                    let oldData = null;
                    if (filterObj) {
                        if (this.dataBeforeUpdated.has(key)) {
                            oldData = this.dataBeforeUpdated.get(key);
                        }
                        else {
                            let keySet = new Set();
                            keySet.add(key);
                            let value = await this.dataProvider.fetchByKeys({ keys: keySet });
                            oldData = value.results.get(key).data;
                            this.dataBeforeUpdated.set(key, oldData);
                        }
                    }
                    if (editItem.operation === 'remove') {
                        if (!filterObj || filterObj.filter(oldData)) {
                            this.totalFilteredRowCount--;
                        }
                    }
                    else if (editItem.operation === 'update' && filterObj) {
                        if (filterObj.filter(oldData) && !filterObj.filter(editItem.item.data)) {
                            this.totalFilteredRowCount--;
                        }
                        else if (!filterObj.filter(oldData) && filterObj.filter(editItem.item.data)) {
                            this.totalFilteredRowCount++;
                        }
                    }
                }
                if ((editItem.operation === 'add' || editItem.operation === 'update') &&
                    !mergedAddKeySet.has(key)) {
                    if (!filterObj || filterObj.filter(editItem.item.data)) {
                        if (sortCriteria && sortCriteria.length) {
                            let inserted = false;
                            for (let i = 0; i < itemArray.length; i++) {
                                if (editItem.operation === 'update' &&
                                    !this.editBuffer.isUpdateTransformed(key) &&
                                    key === itemArray[i].metadata.key) {
                                    itemArray.splice(i, 1);
                                }
                                if (this._compareItem(editItem.item.data, itemArray[i].data, sortCriteria) < 0) {
                                    itemArray.splice(i, 0, editItem.item);
                                    mergedAddKeySet.add(key);
                                    inserted = true;
                                    break;
                                }
                            }
                            if (!inserted && lastBlock) {
                                itemArray.push(editItem.item);
                                mergedAddKeySet.add(key);
                            }
                        }
                        else if (editItem.operation === 'add' ||
                            (editItem.operation === 'update' && this.editBuffer.isUpdateTransformed(key))) {
                            let allItemsRemoved = true;
                            itemArray.forEach((item) => {
                                if (key !== item.metadata.key &&
                                    !mergedAddKeySet.has(key) &&
                                    !this._isItemRemoved(item.metadata.key)) {
                                    allItemsRemoved = false;
                                    return;
                                }
                            });
                            if (allItemsRemoved) {
                                itemArray.push(editItem.item);
                            }
                            else {
                                itemArray.splice(0, 0, editItem.item);
                            }
                            mergedAddKeySet.add(key);
                        }
                    }
                }
            });
        }
        _mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock) {
            this._insertAddEdits(this.editBuffer.getUnsubmittedItems(), filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
            this._insertAddEdits(this.editBuffer.getSubmittingItems(), filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
        }
        _mergeEdits(baseItemArray, newItemArray, filterCriterion, sortCriteria, mergedAddKeySet, lastBlock) {
            let filterObj;
            if (filterCriterion) {
                if (!filterCriterion.filter) {
                    filterObj = ojdataprovider.FilterFactory.getFilter({
                        filterDef: filterCriterion,
                        filterOptions: this.options
                    });
                }
                else {
                    filterObj = filterCriterion;
                }
            }
            const includeSubmitted = newItemArray.length !== 0;
            for (const baseItem of baseItemArray) {
                const editItem = this.editBuffer.getItem(baseItem.metadata.key, includeSubmitted);
                if (!editItem) {
                    newItemArray.push(baseItem);
                }
                else {
                    if (editItem.operation === 'remove') {
                        newItemArray.push(baseItem);
                    }
                    else if (editItem.operation === 'update' &&
                        !this.editBuffer.isUpdateTransformed(editItem.item.metadata.key)) {
                        if (!filterObj || filterObj.filter(editItem.item.data)) {
                            if (!sortCriteria || sortCriteria.length === 0) {
                                newItemArray.push(editItem.item);
                            }
                        }
                    }
                }
            }
            this._mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
        }
        async _fetchFromOffset(params) {
            const signal = params?.signal;
            const callback = async (resolve) => {
                const offset = params.offset;
                const isFetchToEnd = params.size == null || params.size === -1;
                const size = params.size;
                const mergedItems = [];
                const { submitting, submitted, unsubmitted } = this._getEditBufferCounts();
                const numUnsubmittedAdds = unsubmitted.numAdds;
                const numAdds = numUnsubmittedAdds + submitting.numAdds + submitted.numAdds;
                let results;
                let baseItemArray = [];
                let done = false;
                let unbufferedResultsToIgnore = 0;
                if (this.editBuffer.isEmpty(true)) {
                    const fetchByOffsetResults = await this.dataProvider.fetchByOffset(params);
                    return resolve(fetchByOffsetResults);
                }
                else if (isFetchToEnd || offset + size > numAdds) {
                    const numRemoves = unsubmitted.numRemoves + submitting.numRemoves;
                    const numMoveAdds = unsubmitted.numMoveAdds + submitting.numMoveAdds;
                    const numSubmittedOrSubmittingAdds = submitting.numAdds + submitted.numAdds;
                    let overrideOffset;
                    let overrideSize;
                    if (numRemoves > 0 || numMoveAdds > 0 || numSubmittedOrSubmittingAdds > 0) {
                        overrideOffset = {
                            offset: 0
                        };
                        if (!isFetchToEnd) {
                            overrideSize = {
                                size: offset +
                                    size +
                                    numRemoves +
                                    numMoveAdds +
                                    numSubmittedOrSubmittingAdds -
                                    Math.max(numUnsubmittedAdds - offset, 0)
                            };
                        }
                        unbufferedResultsToIgnore = Math.max(offset - numAdds, 0);
                    }
                    else if (numUnsubmittedAdds > 0) {
                        overrideOffset = {
                            offset: Math.max(offset - numUnsubmittedAdds, 0)
                        };
                        if (!isFetchToEnd) {
                            overrideSize = {
                                size: size - Math.max(numUnsubmittedAdds - offset, 0)
                            };
                        }
                    }
                    const underlyingFetchParams = { ...params, ...overrideOffset, ...overrideSize };
                    results = await this.dataProvider.fetchByOffset(underlyingFetchParams);
                }
                if (results) {
                    baseItemArray = results.results;
                    done = results.done;
                }
                if (offset < numAdds) {
                    mergedItems.push(...this._getAllAdds().slice(offset, isFetchToEnd ? undefined : offset + size));
                }
                for (let index = 0; index < baseItemArray.length && (isFetchToEnd || mergedItems.length < size); index++) {
                    const item = baseItemArray[index];
                    const key = item.metadata.key;
                    if (this.editBuffer.isUpdateTransformed(key) ||
                        this._isItemRemoved(key) ||
                        this.editBuffer.isSubmittingOrSubmitted(key)) {
                        continue;
                    }
                    else if (unbufferedResultsToIgnore > 0) {
                        --unbufferedResultsToIgnore;
                    }
                    else {
                        const updatedItem = this.editBuffer.getItem(key);
                        mergedItems.push(updatedItem ? updatedItem.item : item);
                    }
                }
                if (!done && (isFetchToEnd || mergedItems.length < size)) {
                    const nextParams = {
                        ...params,
                        offset: params.offset + mergedItems.length,
                        size: isFetchToEnd ? params.size : params.size - mergedItems.length
                    };
                    let extraResults = await this._fetchFromOffset(nextParams);
                    mergedItems.push(...extraResults.results);
                    done = extraResults.done;
                }
                return resolve({ fetchParameters: params, results: mergedItems, done: done });
            };
            return ojdataprovider.wrapWithAbortHandling(signal, callback, true);
        }
        containsKeys(params) {
            const bufferResult = this._fetchByKeysFromBuffer(params);
            const unresolvedKeys = bufferResult.unresolvedKeys;
            const results = new Set();
            bufferResult.results.forEach((value, key) => {
                results.add(key);
            });
            if (unresolvedKeys.size === 0) {
                return Promise.resolve({ containsParameters: params, results });
            }
            return this.dataProvider
                .containsKeys({ attributes: params.attributes, keys: unresolvedKeys, scope: params.scope })
                .then((baseResults) => {
                if (results.size > 0) {
                    baseResults.results.forEach((value, key) => {
                        results.add(key);
                    });
                    return { containsParameters: params, results };
                }
                return baseResults;
            });
        }
        fetchByKeys(params) {
            const bufferResult = this._fetchByKeysFromBuffer(params);
            const unresolvedKeys = bufferResult.unresolvedKeys;
            const results = bufferResult.results;
            const signal = params?.signal;
            const callback = (resolve) => {
                if (unresolvedKeys.size === 0) {
                    return resolve({ fetchParameters: params, results });
                }
                return resolve(this.dataProvider
                    .fetchByKeys({
                    attributes: params.attributes,
                    keys: unresolvedKeys,
                    scope: params.scope,
                    signal
                })
                    .then((baseResults) => {
                    if (results.size > 0) {
                        baseResults.results.forEach((value, key) => {
                            results.set(key, value);
                        });
                        return { fetchParameters: params, results };
                    }
                    return baseResults;
                }));
            };
            return ojdataprovider.wrapWithAbortHandling(signal, callback, false);
        }
        fetchByOffset(params) {
            return this._fetchFromOffset(params);
        }
        fetchFirst(params) {
            this.lastSortCriteria = params ? params.sortCriteria : null;
            const baseIterator = this.dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
            this.lastIterator = new this.AsyncIterator(this, baseIterator, params);
            return new this.AsyncIterable(this, this.lastIterator);
        }
        getCapability(capabilityName) {
            return this.dataProvider.getCapability(capabilityName);
        }
        _calculateSizeChange(editItems) {
            let sizeChange = 0;
            editItems.forEach((value, key) => {
                if (!this.editBuffer.getEditItemStatus(key)) {
                    if (value.operation === 'add') {
                        ++sizeChange;
                    }
                    else if (value.operation === 'remove') {
                        --sizeChange;
                    }
                }
            });
            return sizeChange;
        }
        _getEditBufferCounts() {
            const submitting = this._getCounts(this.editBuffer.getSubmittingItems());
            const unsubmitted = this._getCounts(this.editBuffer.getUnsubmittedItems());
            const submitted = { numAdds: this.editBuffer.getSubmittedAddItems().size };
            return { submitting, unsubmitted, submitted };
        }
        _getCounts(editItems) {
            let numAdds = 0;
            let numRemoves = 0;
            let numMoveAdds = 0;
            editItems.forEach((value, key) => {
                if (value.operation === 'add') {
                    ++numAdds;
                }
                else if (value.operation === 'remove') {
                    ++numRemoves;
                }
                else if (value.operation === 'update' && this.editBuffer.isUpdateTransformed(key)) {
                    ++numMoveAdds;
                }
            });
            return { numAdds, numRemoves, numMoveAdds };
        }
        _getAllAdds() {
            let addOrder = this.editBuffer.getAddItemOrder();
            return addOrder.map((key) => {
                return this.editBuffer.getItem(key, true)?.item;
            });
        }
        getTotalSize() {
            return this.dataProvider.getTotalSize().then((totalSize) => {
                if (totalSize > -1) {
                    totalSize += this._calculateSizeChange(this.editBuffer.getSubmittingItems());
                    totalSize += this._calculateSizeChange(this.editBuffer.getUnsubmittedItems());
                }
                return totalSize;
            });
        }
        isEmpty() {
            const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
            const submittingItems = this.editBuffer.getSubmittingItems();
            unsubmittedItems.forEach((item, key) => {
                if (item.operation === 'add' || item.operation === 'update') {
                    return 'no';
                }
            });
            submittingItems.forEach((item, key) => {
                if (item.operation === 'add' || item.operation === 'update') {
                    return 'no';
                }
            });
            const isEmpty = this.dataProvider.isEmpty();
            if (isEmpty === 'no') {
                if (unsubmittedItems.size > 0 || submittingItems.size > 0) {
                    return 'unknown';
                }
            }
            return isEmpty;
        }
        _isItemRemoved(key) {
            const editItem = this.editBuffer.getItem(key);
            return editItem != null && editItem.operation === 'remove';
        }
        _addToMergedArrays(item, fromBaseDP, addBeforeKeyFromBase = null) {
            let addBeforeKey = null;
            if (this.lastIterator) {
                if (fromBaseDP) {
                    addBeforeKey = this._getNextKey(addBeforeKeyFromBase);
                }
                else {
                    for (let i = 0; i < this.lastIterator.mergedItemArray.length; i++) {
                        const key = this.lastIterator.mergedItemArray[i].metadata.key;
                        if (!this._isItemRemoved(key)) {
                            addBeforeKey = key;
                            break;
                        }
                    }
                    let shouldIncrementNextOffset = this.lastIterator.nextOffset !== 0;
                    if (this.editBuffer.isUpdateTransformed(item.metadata.key)) {
                        for (let i = 0; i < this.lastIterator.mergedItemArray.length; i++) {
                            if (oj.KeyUtils.equals(this.lastIterator.mergedItemArray[i].metadata.key, item.metadata.key)) {
                                if (shouldIncrementNextOffset) {
                                    shouldIncrementNextOffset = this.lastIterator.nextOffset <= i;
                                }
                                this.lastIterator.mergedItemArray.splice(i, 1);
                                break;
                            }
                        }
                    }
                    this.lastIterator.mergedItemArray.splice(0, 0, item);
                    this.lastIterator.mergedAddKeySet.add(item.metadata.key);
                    if (shouldIncrementNextOffset) {
                        this.lastIterator.nextOffset++;
                    }
                }
            }
            return addBeforeKey;
        }
        _getNextKey(key, bRemoved = false) {
            let nextKey = key;
            if (this.lastIterator) {
                const mergedItemArray = this.lastIterator.mergedItemArray;
                let keyIdx = this._findKeyInItems(key, mergedItemArray);
                while (nextKey !== null && (bRemoved || this._isItemRemoved(nextKey))) {
                    if (bRemoved) {
                        bRemoved = false;
                    }
                    nextKey =
                        keyIdx === -1
                            ? null
                            : keyIdx + 1 === mergedItemArray.length
                                ? null
                                : mergedItemArray[keyIdx + 1].metadata.key;
                    keyIdx++;
                }
            }
            return nextKey;
        }
        addItem(item) {
            const addItem = Object.assign({}, item);
            if (item.metadata.key === null) {
                addItem.metadata = Object.assign({}, item.metadata);
                addItem.metadata.key = this._generateKey(item.data);
            }
            this.editBuffer.addItem(addItem);
            const addBeforeKey = this._addToMergedArrays(addItem, false);
            const detail = {
                add: {
                    data: [addItem.data],
                    keys: new Set().add(addItem.metadata.key),
                    metadata: [addItem.metadata],
                    addBeforeKeys: [addBeforeKey],
                    indexes: [0]
                }
            };
            const event = new ojdataprovider.DataProviderMutationEvent(detail);
            this.dispatchEvent(event);
            this._dispatchSubmittableChangeEvent();
        }
        _removeFromMergedArrays(key, fromBaseDP) {
            if (this.lastIterator) {
                const mergedItemArray = this.lastIterator.mergedItemArray;
                const mergedAddKeySet = this.lastIterator.mergedAddKeySet;
                const keyIdx = this._findKeyInItems(key, mergedItemArray);
                if (keyIdx !== -1) {
                    if (fromBaseDP || mergedAddKeySet.has(key)) {
                        mergedItemArray.splice(keyIdx, 1);
                        mergedAddKeySet.delete(key);
                    }
                    for (let i = this.lastIterator.nextOffset - 1; i >= 0; i--) {
                        let itemKey = mergedItemArray[i]?.metadata.key;
                        if (itemKey != null && !this._isItemRemoved(itemKey)) {
                            break;
                        }
                        this.lastIterator.nextOffset = i;
                    }
                }
            }
        }
        removeItem(item) {
            this.editBuffer.removeItem(item);
            this._removeFromMergedArrays(item.metadata.key, false);
            const detail = {
                remove: {
                    data: item.data ? [item.data] : null,
                    keys: new Set().add(item.metadata.key),
                    metadata: [item.metadata]
                }
            };
            const event = new ojdataprovider.DataProviderMutationEvent(detail);
            this.dispatchEvent(event);
            this._dispatchSubmittableChangeEvent();
        }
        updateItem(item) {
            this.editBuffer.updateItem(item);
            const detail = {
                update: {
                    data: [item.data],
                    keys: new Set().add(item.metadata.key),
                    metadata: [item.metadata]
                }
            };
            const event = new ojdataprovider.DataProviderMutationEvent(detail);
            this.dispatchEvent(event);
            this._dispatchSubmittableChangeEvent();
        }
        getSubmittableItems() {
            const unsubmitted = this.editBuffer.getUnsubmittedItems();
            const submitting = this.editBuffer.getSubmittingItems();
            const submittableItems = [];
            unsubmitted.forEach((editItem, key) => {
                if (!submitting.has(key)) {
                    submittableItems.push(editItem);
                }
            });
            return submittableItems;
        }
        resetAllUnsubmittedItems() {
            this.editBuffer.resetAllUnsubmittedItems();
            this._dispatchSubmittableChangeEvent();
            this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
        }
        _addEventDetail(detail, detailType, detailItem, detailAddBeforeKey) {
            if (detail[detailType] == null) {
                if (detailType === 'add') {
                    detail[detailType] = { data: [], keys: new Set(), metadata: [], addBeforeKeys: [] };
                }
                else {
                    detail[detailType] = { data: [], keys: new Set(), metadata: [] };
                }
            }
            detail[detailType].keys.add(detailItem.metadata.key);
            detail[detailType].data.push(detailItem.data);
            detail[detailType].metadata.push(detailItem.metadata);
            if (detailType === 'add') {
                detail[detailType].addBeforeKeys.push(detailAddBeforeKey);
            }
        }
        resetUnsubmittedItem(key) {
            const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
            const keySet = new Set();
            const editItemMap = new ojMap();
            const editItem = unsubmittedItems.get(key);
            if (editItem) {
                keySet.add(key);
                editItemMap.set(key, editItem);
                unsubmittedItems.delete(key);
            }
            this._dispatchSubmittableChangeEvent();
            this.dataProvider.fetchByKeys({ keys: keySet }).then((resultObj) => {
                const detail = {};
                let resultItem;
                editItemMap.forEach((editItem, key) => {
                    if (editItem.operation === 'add') {
                        this._removeFromMergedArrays(editItem.item.metadata.key, false);
                        this._addEventDetail(detail, 'remove', editItem.item);
                    }
                    else if (editItem.operation === 'remove') {
                        resultItem = resultObj.results.get(key);
                        if (resultItem) {
                            let addBeforeKey = null;
                            if (this.lastIterator) {
                                const mergedItemArray = this.lastIterator.mergedItemArray;
                                const keyIdx = this._findKeyInItems(key, mergedItemArray);
                                if (keyIdx !== -1) {
                                    for (let i = keyIdx + 1; i < mergedItemArray.length; i++) {
                                        if (!this._isItemRemoved(mergedItemArray[i].metadata.key)) {
                                            addBeforeKey = mergedItemArray[i].metadata.key;
                                            break;
                                        }
                                    }
                                }
                            }
                            this._addEventDetail(detail, 'add', resultItem, addBeforeKey);
                        }
                    }
                    else {
                        resultItem = resultObj.results.get(key);
                        if (resultItem) {
                            this._addEventDetail(detail, 'update', resultItem);
                        }
                        else {
                            this._addEventDetail(detail, 'remove', editItem.item);
                        }
                    }
                });
                this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(detail));
            });
        }
        setItemStatus(editItem, newStatus, error, newKey) {
            if (editItem) {
                if (newKey) {
                    this.generatedKeyMap.set(newKey, editItem.item.metadata.key);
                }
                this.editBuffer.setItemStatus(editItem, newStatus, error);
                this._dispatchSubmittableChangeEvent();
            }
        }
        _dispatchSubmittableChangeEvent() {
            const submittable = this.getSubmittableItems();
            const event = new ojbufferingdataproviderevents.BufferingDataProviderSubmittableChangeEvent(submittable);
            this.dispatchEvent(event);
        }
        _findKeyInMetadata(key, metadata) {
            if (metadata) {
                for (let i = 0; i < metadata.length; i++) {
                    if (oj.KeyUtils.equals(key, metadata[i].key)) {
                        return i;
                    }
                }
            }
            return -1;
        }
        _findKeyInItems(key, items) {
            if (items) {
                for (let i = 0; i < items.length; i++) {
                    if (oj.KeyUtils.equals(key, items[i].metadata.key)) {
                        return i;
                    }
                }
            }
            return -1;
        }
        _initDetailProp(detail, newDetail, propName, initValue) {
            if (detail[propName]) {
                newDetail[propName] = initValue;
            }
        }
        _initDetail(detail, newDetail, bEmpty, bAdd = false) {
            if (bEmpty) {
                this._initDetailProp(detail, newDetail, 'data', []);
                this._initDetailProp(detail, newDetail, 'metadata', []);
                if (bAdd) {
                    this._initDetailProp(detail, newDetail, 'addBeforeKeys', []);
                }
                this._initDetailProp(detail, newDetail, 'indexes', []);
                this._initDetailProp(detail, newDetail, 'parentKeys', []);
            }
            else {
                this._initDetailProp(detail, newDetail, 'data', detail.data);
                this._initDetailProp(detail, newDetail, 'metadata', detail.metadata);
                if (bAdd) {
                    this._initDetailProp(detail, newDetail, 'addBeforeKeys', detail.addBeforeKeys);
                }
                this._initDetailProp(detail, newDetail, 'indexes', detail.indexes);
                this._initDetailProp(detail, newDetail, 'parentKeys', detail.parentKeys);
            }
        }
        _initDetails(details, newDetails, bEmpty) {
            if (details.add) {
                newDetails.add = { keys: new Set() };
                this._initDetail(details.add, newDetails.add, bEmpty, true);
            }
            if (details.remove) {
                newDetails.remove = { keys: new Set() };
                this._initDetail(details.remove, newDetails.remove, bEmpty);
            }
            if (details.update) {
                newDetails.update = { keys: new Set() };
                this._initDetail(details.update, newDetails.update, bEmpty);
            }
        }
        _pushDetailProp(detail, newDetail, propName, idx) {
            if (detail[propName]) {
                newDetail[propName].push(detail[propName][idx]);
            }
        }
        _pushDetail(key, detail, newDetail) {
            newDetail.keys.add(key);
            if (detail.metadata) {
                const idx = this._findKeyInMetadata(key, detail.metadata);
                if (idx > -1) {
                    this._pushDetailProp(detail, newDetail, 'data', idx);
                    this._pushDetailProp(detail, newDetail, 'metadata', idx);
                    if (detail.addBeforeKeys && detail.addBeforeKeys.length !== 0) {
                        this._pushDetailProp(detail, newDetail, 'addBeforeKeys', idx);
                    }
                    if (detail.indexes && detail.indexes.length !== 0) {
                        this._pushDetailProp(detail, newDetail, 'indexes', idx);
                    }
                    this._pushDetailProp(detail, newDetail, 'parentKeys', idx);
                }
            }
        }
        _isSkipItem(key, submittingItems, unsubmittedItems) {
            let skipItem = submittingItems.get(key) != null;
            if (!skipItem) {
                const editItem = unsubmittedItems.get(key);
                skipItem = editItem && editItem.operation === 'remove';
            }
            return skipItem;
        }
        _isSortFieldUpdated(key, detail) {
            let sortUpd = false;
            if (this.lastIterator && this.lastSortCriteria && this.lastSortCriteria.length) {
                const keyIdx = this._findKeyInItems(key, this.lastIterator.mergedItemArray);
                if (keyIdx < 0) {
                    return false;
                }
                const sortFields = [];
                let i = 0;
                if (this.lastIterator && this.lastSortCriteria) {
                    for (const sortCriteria of this.lastSortCriteria) {
                        sortFields[i++] = sortCriteria.attribute;
                    }
                }
                for (const sortField of sortFields) {
                    const idx = this._findKeyInMetadata(key, detail.metadata);
                    if (this.lastIterator.mergedItemArray[keyIdx][sortField] !== detail.data[idx]) {
                        sortUpd = true;
                    }
                }
            }
            return sortUpd;
        }
        _getOperationDetails(details, addBeforeKeys, sortFldUpdateds) {
            if (details && (details.add || details.remove || details.update)) {
                let newDetails = {};
                const submittingItems = this.editBuffer.getSubmittingItems();
                const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
                if (submittingItems.size === 0 && unsubmittedItems.size === 0) {
                    newDetails = details;
                }
                else {
                    this._initDetails(details, newDetails, true);
                    this._processAdd(newDetails, details, submittingItems, unsubmittedItems);
                    let skipItem;
                    if (details.remove) {
                        details.remove.keys.forEach((key) => {
                            skipItem = this._isSkipItem(key, submittingItems, unsubmittedItems);
                            if (!skipItem) {
                                this._pushDetail(key, details.remove, newDetails.remove);
                            }
                            const editItem = unsubmittedItems.get(key);
                            if (editItem && (editItem.operation === 'remove' || editItem.operation === 'update')) {
                                unsubmittedItems.delete(key);
                            }
                        });
                    }
                    if (details.update) {
                        details.update.keys.forEach((key) => {
                            skipItem = this._isSkipItem(key, submittingItems, unsubmittedItems);
                            if (!skipItem) {
                                this._pushDetail(key, details.update, newDetails.update);
                            }
                        });
                    }
                }
                return newDetails;
            }
            else {
                return details;
            }
        }
        _processAdd(newDetails, details, submittingItems, unsubmittedItems) {
            if (details.add) {
                newDetails.add = details.add;
                return;
            }
        }
        _handleRefreshEvent(event) {
            this.dataBeforeUpdated = new Map();
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
                    keySet.forEach((key) => {
                        unsubmittedItems.delete(key);
                    });
                    this.dispatchEvent(event);
                });
            }
            else {
                this.dispatchEvent(event);
            }
        }
        _cleanUpSubmittedItem(operation, key) {
            const submittedItems = this.editBuffer.getSubmittingItems();
            const item = submittedItems.get(key);
            if (item) {
                this.editBuffer.setItemMutated(item);
            }
        }
        _handleMutateEvent(event) {
            this.dataBeforeUpdated = new Map();
            const detailAdd = event.detail.add;
            if (detailAdd && detailAdd.metadata && detailAdd.data) {
                detailAdd.metadata.forEach((metadata, idx) => {
                    let addBeforeKey;
                    if (detailAdd.addBeforeKeys && detailAdd.addBeforeKeys[idx] !== undefined) {
                        addBeforeKey = this._addToMergedArrays({ metadata: detailAdd.metadata[idx], data: detailAdd.data[idx] }, true, detailAdd.addBeforeKeys[idx]);
                        if (detailAdd.addBeforeKeys[idx] && !addBeforeKey) {
                            if (this.lastIterator && this.lastIterator.mergedItemArray) {
                                this.lastIterator.mergedItemArray.splice(this.lastIterator.mergedItemArray.length, 0, {
                                    data: detailAdd.data[idx],
                                    metadata: detailAdd.metadata[idx]
                                });
                            }
                        }
                        detailAdd.addBeforeKeys[idx] = addBeforeKey;
                    }
                    else {
                        if (detailAdd.indexes && detailAdd.indexes[idx]) {
                            let nextIdx = detailAdd.indexes[idx];
                            while (this.lastIterator && nextIdx < this.lastIterator.mergedItemArray.length) {
                                if (!this._isItemRemoved(this.lastIterator.mergedItemArray[nextIdx].metadata.key)) {
                                    break;
                                }
                                nextIdx++;
                            }
                            if (this.lastIterator && nextIdx >= this.lastIterator.mergedItemArray.length) {
                                this.lastIterator.mergedItemArray.splice(this.lastIterator.mergedItemArray.length, 0, {
                                    data: detailAdd.data[idx],
                                    metadata: detailAdd.metadata[idx]
                                });
                            }
                        }
                    }
                    this._cleanUpSubmittedItem('add', metadata.key);
                });
            }
            const detailRemove = event.detail.remove;
            if (detailRemove) {
                detailRemove.keys.forEach((key) => {
                    this._removeFromMergedArrays(key, true);
                    this._cleanUpSubmittedItem('remove', key);
                });
            }
            const addBeforeKeys = [];
            const sortFldUpdateds = [];
            const detailUpdate = event.detail.update;
            if (detailUpdate) {
                detailUpdate.data.forEach((currData, idx) => {
                    sortFldUpdateds[idx] = this._isSortFieldUpdated(detailUpdate.metadata[idx].key, detailUpdate);
                    if (sortFldUpdateds[idx]) {
                        this._removeFromMergedArrays(detailUpdate.metadata[idx].key, true);
                        addBeforeKeys[idx] = this._addToMergedArrays({ data: currData, metadata: detailUpdate.metadata[idx] }, true);
                        if (!addBeforeKeys[idx]) {
                            if (this.lastIterator && this.lastIterator.mergedItemArray) {
                                this.lastIterator.mergedItemArray.splice(this.lastIterator.mergedItemArray.length, 0, {
                                    data: currData,
                                    metadata: detailUpdate.metadata[idx]
                                });
                            }
                        }
                    }
                    this._cleanUpSubmittedItem('remove', detailUpdate.metadata[idx].key);
                });
            }
            const newDetails = this._getOperationDetails(event.detail, addBeforeKeys, sortFldUpdateds);
            this._checkGeneratedKeys(newDetails);
            this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(newDetails));
        }
        _checkGeneratedKeys(eventDetail) {
            const checkKeyMap = (key, eventAddDetail, index) => {
                if (this.generatedKeyMap.has(key)) {
                    const transientKey = this.generatedKeyMap.get(key);
                    if (!eventDetail.remove || !eventDetail.remove.keys?.has(key)) {
                        if (!eventDetail.remove) {
                            eventDetail.remove = { keys: new Set() };
                        }
                        eventDetail.remove.keys.add(transientKey);
                        if (eventAddDetail) {
                            const firstKey = this.lastIterator?.mergedItemArray?.[0]?.metadata?.key;
                            if (firstKey !== null) {
                                if (!eventAddDetail.addBeforeKeys) {
                                    eventAddDetail.addBeforeKeys = [];
                                }
                                eventAddDetail.addBeforeKeys[index] = firstKey;
                            }
                        }
                    }
                }
            };
            if (eventDetail.add?.keys) {
                let i = 0;
                eventDetail.add.keys.forEach((key) => {
                    checkKeyMap(key, eventDetail.add, i);
                    i++;
                });
            }
        }
        _addEventListeners(dataprovider) {
            dataprovider[BufferingDataProvider._ADDEVENTLISTENER](BufferingDataProvider._REFRESH, this._handleRefreshEvent.bind(this));
            dataprovider[BufferingDataProvider._ADDEVENTLISTENER](BufferingDataProvider._MUTATE, this._handleMutateEvent.bind(this));
        }
    }
    BufferingDataProvider._REFRESH = 'refresh';
    BufferingDataProvider._MUTATE = 'mutate';
    BufferingDataProvider._ADDEVENTLISTENER = 'addEventListener';
    ojeventtarget.EventTargetMixin.applyMixin(BufferingDataProvider);
    oj._registerLegacyNamespaceProp('BufferingDataProvider', BufferingDataProvider);

    return BufferingDataProvider;

});
