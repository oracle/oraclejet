/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { DataProviderRefreshEvent } from 'ojs/ojdataprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import ojMap from 'ojs/ojmap';
import ojSet from 'ojs/ojset';
import { BufferingDataProviderUtils, EditBuffer, TreeEditBuffer } from 'ojs/ojbufferingutils';
import { BufferingDataProviderSubmittableChangeEvent } from 'ojs/ojbufferingdataproviderevents';
import { MutableArrayTreeDataProvider } from 'ojs/ojmutablearraytreedataprovider';
import { error } from 'ojs/ojlogger';

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 19.0.0
 * @export
 * @final
 * @class BufferingTreeDataProvider
 * @ojtsmodule
 * @implements TreeDataProvider
 * @classdesc
 * <p>BufferingTreeDataProvider is a wrapping TreeDataProvider that provides edit buffering for an underlying TreeDataProvider, so that
 * the edits can be committed to the data source later on.
 * The underlying TreeDataProvider is responsible for fetching data, and BufferingTreeDataProvider will merge any buffered edits with
 * the underlying data so that they appear as an unified set of data.
 * </p>
 * <p>Because all edits are tracked by keys, the underlying TreeDataProvider must return unique keys in the metadata.  If new rows
 * are added, unique keys must be specified for the new rows. The underlying TreeDataProvider also must support KeyPathing.
 * </p>
 * <p>In addition to the methods in the TreeDataProvider interface, BufferingTreeDataProvider implements a set of methods for managing edits:
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
 *   <li>Create an instance of the underlying TreeDataProvider that provides the actual data.
 *   <li>Create an instance of BufferingTreeDataProvider, passing the underlying TreeDataProvider instance and any options.
 *   <li>Call "addItem", "removeItem", and "updateItem" on the BufferingTreeDataProvider instance to create edit items, usually in response
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
 * in the underlying TreeDataProvider, the application should ensure that all attributes referenced in the sort criterion and filter criterion are
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
 * When new/updated items are committed, and if the underlying TreeDataProvider fires mutate events for the committed items,
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
 * <p>BufferingTreeDataProvider does not validate the item key and data.  It is up to the application to perform any validation
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
 * @param {TreeDataProvider} dataProvider The underlying TreeDataProvider that provides the original data.
 * @param {BufferingTreeDataProvider.Options=} options Options for the BufferingTreeDataProvider
 * @ojsignature [{target: "Type",
 *               value: "class BufferingTreeDataProvider<K, D> implements TreeDataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of key"}, {"name": "D", "description": "Type of data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"},
 *               {target: "Type",
 *               value: "BufferingTreeDataProvider.Options<K, D>",
 *               for: "options"}]
 * @ojtsimport {module: "ojbufferingdataprovider", type: "AMD", importName: "BufferingDataProvider"}
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 *   "FetchListResult","FetchListParameters", "Item", "ItemWithOptionalData", "ItemMessage"]}
 *
 */

/**
 * @typedef {Object} BufferingTreeDataProvider.Options
 * @property {Function=} keyGenerator - Optional keyGenerator to use when a null key is passed in for addItem(). By default, BufferingTreeDataProvider will
 * generate a v4 UUID string. Please use this option to supply your own key generator. The key generator function takes value as parameter and returns a key.
 * @ojsignature [{target: "Type", value: "<K, D>", for: "genericTypeParameters"},
 *               {target: "Type",
 *               value: "{ keyGenerator?: (value: Partial<D>) => K }"}]
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
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
 * @memberof BufferingTreeDataProvider
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
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof BufferingTreeDataProvider
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
 * Note: addItem supports passing in an item which has null key. If the key is null then
 * a string typed v4 UUID key is generated for the key. It is expected that the application will later call
 * setItemStatus with the newKey parameter to pass in the real key once it becomes available after commit. The
 * newKey will then be stored in an internal map with the generated key and then when the underlying TreeDataProvider
 * subsequently dispatches an add mutation event which contains the new key then the BufferingTreeDataProvider will
 * include a remove mutation which will remove the row with the generated key. If a non-string typed or
 * non-v4 UUID generated key is desired then please use the constructor option: keyGenerator. To use this feature addDetail.nullParentKey
 * should be provided as the second parameter to addItem, where nullParentKey is the parentKey of the newItem.
 *
 *
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name addItem
 * @param {Item<K, D>} item - an Item object that represents the row.
 * @param {Object=} addDetail - An object that represents additional add details about the row.
 * If the addItem method is called only with the item parameter, then the item will be added at the top.
 * If addBeforeKey is provided and that key exists in the base TreeDataProvider, then the item will be added before that key.
 * If addBeforeKey is null or the provided key doesn't exist in the base TreeDataProvider, then the item will be added at the end.
 * addItem supports passing in an item that has a null key. If the key is null, then a string-typed v4 UUID key is generated for the key.
 * To use this feature, addDetail.nullParentKey should be provided as the second parameter to addItem, where nullParentKey is the parentKey of the new item.
 * @throws {Error} if an "add" or "update" entry already exists for the same key.
 * @ojsignature {target: "Type",
 *               value: "(item: Item<K, D>, addDetail?: { nullParentKey?: K, addBeforeKey?: K | null }): void"}
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
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
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
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
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
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name getSubmittableItems
 * @return {Array<BufferingDataProvider.EditItem<K, D>>} an array of all submittable edit items.  Each edit item implements the {@link EditItem} interface.
 * @ojsignature {target: "Type",
 *               value: "(): Array<BufferingDataProvider.EditItem<K, D>>"}
 */

/**
 * Reset all rows by discarding all 'unsubmitted' edit items, so that the data from the underlying
 * TreeDataProvider will be used.
 *
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @return {void}
 * @name resetAllUnsubmittedItems
 */

/**
 * Reset a row by discarding any 'unsubmitted' edit item for the row, so that the data from the underlying
 * TreeDataProvider will be used.
 *
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @return {void}
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
 * @since 19.0.0
 * @export
 * @expose
 * @memberof BufferingTreeDataProvider
 * @instance
 * @method
 * @name setItemStatus
 * @param {BufferingDataProvider.EditItem<K, D>} editItem - The edit item to set status on.  This should implement the {@link EditItem} interface and is
 *   usually one of the items returned by the getSubmittableItems method.
 * @param {'unsubmitted' | 'submitting' | 'submitted'} newStatus - the new status of the edit item.
 *   If an edit item is marked as "submitted", it will be removed at the DataProvider's discretion.
 * @param {ItemMessage?} error - an optional error message.
 * @param {K?} newKey - an optional new key for the item. This is used in cases where addItem was called with a null key which will cause BufferingTreeDataProvider
 * to generate a key. Passing in the real key when it becomes available will enable BufferingTreeDataProvider to map the real and generated keys so that a subsequent
 * add mutation event for the real key will result in BufferingTreeDataProvider also including a remove for the generated key.
 * @ojsignature {target: "Type",
 *               value: "(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage, newKey?: K): void"}
 */

// end of jsdoc

class BufferingTreeDataProvider {
    constructor(_dataProvider, _options, _rootBufferingDataProvider, _parentKey) {
        var _a;
        this._dataProvider = _dataProvider;
        this._options = _options;
        this._rootBufferingDataProvider = _rootBufferingDataProvider;
        this._parentKey = _parentKey;
        this.TreeAsyncIterable = (_a = class {
                constructor(_parent, _asyncIterator) {
                    this._parent = _parent;
                    this._asyncIterator = _asyncIterator;
                    this[Symbol.asyncIterator] = () => {
                        return this._asyncIterator;
                    };
                }
            },
            Symbol.asyncIterator,
            _a);
        this.TreeAsyncIterator = class {
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
                return BufferingDataProviderUtils.fetchNext(this._params, this._baseIterator, this, this._parent.lastSortCriteria, this._parent.getTreeEditBuffer(), this._parent);
            }
        };
        this.lastIteratorMap = new ojMap();
        this.lastSortCriteria = null;
        this.customKeyGenerator = _options?.keyGenerator;
        this.generatedKeyMap = new ojMap();
        this.totalFilteredRowCount = 0;
        this.dataBeforeUpdated = new Map();
        this.dataProvider = _dataProvider;
        this.options = _options;
        this.rootBufferingDataProvider = _rootBufferingDataProvider;
        if (!this.rootBufferingDataProvider) {
            this.editBuffer = new EditBuffer();
            this.rootBufferingDataProvider = this;
            this._addEventListeners();
            this.parentKey = [];
        }
        else {
            this.editBuffer = this.rootBufferingDataProvider.editBuffer;
            this.parentKey = this.convertKeyToKeyPath(this._parentKey);
        }
        const keyPathCapability = this.getPathCapability(this.rootBufferingDataProvider);
        if (!keyPathCapability || keyPathCapability == 'none') {
            throw new Error("BufferingTreeDataProvider only supports underlying dataProviders with keyCapability of 'pathArray' or 'pathArrayString'");
        }
    }
    getTreeEditBuffer() {
        return new TreeEditBuffer(this.editBuffer, this.parentKey, this);
    }
    getChildDataProvider(parentKey) {
        let childDp = this.dataProvider.getChildDataProvider(parentKey);
        if (!childDp) {
            const keyPath = this.convertKeyToKeyPath(parentKey);
            const hasBufferedChildren = this.hasBufferedChildren(keyPath);
            if (!hasBufferedChildren) {
                return null;
            }
            childDp = new MutableArrayTreeDataProvider([], '@value', { useKeyPaths: 'on' });
        }
        return new BufferingTreeDataProvider(childDp, this.options, this.rootBufferingDataProvider, parentKey);
    }
    hasBufferedChildren(keyPath) {
        const treeEditBuffer = new TreeEditBuffer(this.editBuffer, keyPath, this);
        const editBufferUnsubmittedItems = treeEditBuffer.getUnsubmittedItems();
        const editBufferSubmittingItems = treeEditBuffer.getSubmittingItems();
        return editBufferSubmittingItems.size !== 0 || editBufferUnsubmittedItems.size !== 0;
    }
    containsKeys(params) {
        return BufferingDataProviderUtils.containsKeys(params, this.getTreeEditBuffer(), this.dataProvider);
    }
    fetchByKeys(params) {
        return BufferingDataProviderUtils.fetchByKeys(params, this.getTreeEditBuffer(), this.dataProvider);
    }
    removeItem(item) {
        const keyPath = this.convertKeyToKeyPath(item.metadata.key);
        const parentKey = this.getParentKey(keyPath);
        const mutationEvent = BufferingDataProviderUtils.removeItem(item, this.getIteratorByParentKey(parentKey), this.getTreeEditBuffer());
        const submittableItems = this.getSubmittableItems();
        submittableItems.forEach((editItem) => {
            const key = this.convertKeyToKeyPath(editItem.item.metadata.key);
            if (this.isKeyPathDescendant(key, keyPath)) {
                this.resetUnsubmittedItem(editItem.item.metadata.key);
            }
        });
        this.dispatchEvent(mutationEvent);
        this.dispatchSubmittableChangeEvent(this.editBuffer);
    }
    updateItem(item) {
        const mutationEvent = BufferingDataProviderUtils.updateItem(item, this.getTreeEditBuffer());
        this.dispatchEvent(mutationEvent);
        this.dispatchSubmittableChangeEvent(this.editBuffer);
    }
    getParentKey(keyPath) {
        return keyPath.slice(0, keyPath.length - 1);
    }
    isKeyPathDescendant(keyPath, parentKeyPath) {
        if (parentKeyPath.length >= keyPath.length) {
            return false;
        }
        for (let i = 0; i < parentKeyPath.length; i++) {
            if (parentKeyPath[i] !== keyPath[i]) {
                return false;
            }
        }
        return true;
    }
    addItem(item, addDetail) {
        const addItem = Object.assign({}, item);
        if (addDetail?.nullParentKey != null && item.metadata.key == null) {
            const generatedKey = BufferingDataProviderUtils.generateKey(item.data, this.customKeyGenerator);
            const key = [...this.convertKeyToKeyPath(addDetail.nullParentKey), generatedKey];
            addItem.metadata = Object.assign({}, item.metadata);
            addItem.metadata.key = this.convertKeyPathToKey(key);
        }
        else if (addDetail?.nullParentKey == null && item.metadata.key == null) {
            error('item.metadata.key is null and addDetail.nullParentKey was not provided');
        }
        const keyPath = this.convertKeyToKeyPath(addItem.metadata.key);
        const parentKey = this.getParentKey(keyPath);
        const isNewParent = parentKey.length > 0 && this.dataProvider.getChildDataProvider(parentKey) == null;
        const addDetails = { ...addDetail };
        if (addDetail?.addBeforeKey != null) {
            const addBeforeKey = this.convertKeyToKeyPath(addDetail.addBeforeKey);
            const addBeforeParentKey = this.getParentKey(addBeforeKey);
            if (!oj.KeyUtils.equals(parentKey, addBeforeParentKey)) {
                error("addBeforeKey is not a descendant of item's parentKey");
                delete addDetails.addBeforeKey;
            }
        }
        const parentIterator = this.getIteratorByParentKey(parentKey);
        const mutationEvent = BufferingDataProviderUtils.addItem(addItem, this.getTreeEditBuffer(), parentIterator, addDetails);
        let parentKeys = parentKey.length !== 0 ? [parentKey] : [null];
        mutationEvent.detail.add.parentKeys = parentKeys;
        const addBeforeKey = mutationEvent.detail.add.addBeforeKeys[0];
        const addBeforeKeys = addBeforeKey != null ? [addBeforeKey] : undefined;
        mutationEvent.detail.add.addBeforeKeys = addBeforeKeys;
        if (isNewParent) {
            this.dispatchEvent(new DataProviderRefreshEvent({ keys: new ojSet([parentKey]) }));
        }
        else {
            this.dispatchEvent(mutationEvent);
        }
        this.dispatchSubmittableChangeEvent(this.editBuffer);
    }
    getIteratorByParentKey(parentKey) {
        return this.lastIteratorMap.get(parentKey);
    }
    convertKeyToKeyPath(keyPath) {
        const pathInfo = this.getPathCapability(this.dataProvider);
        if (pathInfo === 'pathArray') {
            return keyPath;
        }
        else if (pathInfo === 'pathArrayString') {
            return JSON.parse(keyPath);
        }
        return null;
    }
    convertKeyPathToKey(keyPath) {
        const pathInfo = this.getPathCapability(this.dataProvider);
        if (pathInfo === 'pathArray') {
            return keyPath;
        }
        else if (pathInfo === 'pathArrayString') {
            return JSON.stringify(keyPath);
        }
        return null;
    }
    getPathCapability(treeDataProvider) {
        return treeDataProvider.getCapability('key')?.structure;
    }
    fetchByOffset(params) {
        return BufferingDataProviderUtils.fetchByOffset(params, this.getTreeEditBuffer(), this.dataProvider);
    }
    fetchFirst(params) {
        this.lastSortCriteria = params ? params.sortCriteria : null;
        const baseIterator = this.dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
        const iterator = new this.TreeAsyncIterator(this, baseIterator, params);
        this.rootBufferingDataProvider.lastIteratorMap.set(this.parentKey ? this.parentKey : null, iterator);
        return new this.TreeAsyncIterable(this, iterator);
    }
    getCapability(capabilityName) {
        return BufferingDataProviderUtils.getCapability(capabilityName, this.dataProvider);
    }
    getTotalSize() {
        return BufferingDataProviderUtils.getTotalSize(this.dataProvider, this.getTreeEditBuffer());
    }
    isEmpty() {
        return BufferingDataProviderUtils.isEmpty(this.getTreeEditBuffer(), this.dataProvider);
    }
    getSubmittableItems() {
        return BufferingDataProviderUtils.getSubmittableItems(this.editBuffer);
    }
    resetAllUnsubmittedItems() {
        BufferingDataProviderUtils.resetAllUnsubmittedItems(this.editBuffer);
        this.dispatchSubmittableChangeEvent(this.editBuffer);
        this.dispatchEvent(new DataProviderRefreshEvent());
    }
    resetUnsubmittedItem(key) {
        const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
        const keySet = new Set();
        const editItem = unsubmittedItems.get(key);
        if (!editItem) {
            return;
        }
        keySet.add(key);
        unsubmittedItems.delete(key);
        this.dispatchSubmittableChangeEvent(this.editBuffer);
        BufferingDataProviderUtils.resetUnsubmittedItem(editItem, this.editBuffer, this.dataProvider, this.getIteratorByParentKey(this.parentKey), keySet).then((mutationEvent) => {
            this.dispatchEvent(mutationEvent);
        });
    }
    setItemStatus(editItem, newStatus, error, newKey) {
        const editBuffer = BufferingDataProviderUtils.setItemStatus(editItem, newStatus, this.generatedKeyMap, this.editBuffer, error, newKey);
        if (editBuffer) {
            // If any item is changing status, we may have submittable items.
            // Call dispatchSubmittableChangeEvent, which will figure out if we need to fire submittableChange event.
            this.dispatchSubmittableChangeEvent(editBuffer);
        }
    }
    dispatchSubmittableChangeEvent(editBuffer) {
        // Fire the submittableChange event if the number of submittable item has changed
        const submittable = BufferingDataProviderUtils.getSubmittableItems(editBuffer);
        const event = new BufferingDataProviderSubmittableChangeEvent(submittable);
        this.dispatchEvent(event);
    }
    _addEventListeners() {
        this.dataProvider.addEventListener(BufferingTreeDataProvider._REFRESH, async (event) => {
            this.dataBeforeUpdated = new Map();
            const refreshEvent = await BufferingDataProviderUtils.handleRefreshEvent(event, this.editBuffer, this.dataProvider);
            this.dispatchEvent(refreshEvent);
        });
        this.dataProvider.addEventListener(BufferingTreeDataProvider._MUTATE, (event) => {
            this.dataBeforeUpdated = new Map();
            const mutationEvent = BufferingDataProviderUtils.handleMutateEvent(event, this.editBuffer, this.getIteratorByParentKey(this.parentKey), this.generatedKeyMap, this.lastSortCriteria);
            if (event.detail.update) {
                // array tree data provider sends update event for new parent on submit, need to clean up our buffer
                event.detail.update.keys.forEach((key) => {
                    const treeEditBuffer = new TreeEditBuffer(this.editBuffer, key, this);
                    const childAdds = treeEditBuffer.getSubmittingItems();
                    childAdds.forEach((child) => {
                        if (child.operation === 'add') {
                            const keyPath = this.convertKeyToKeyPath(child.item.metadata.key);
                            BufferingDataProviderUtils.cleanUpSubmittedItem(keyPath, treeEditBuffer);
                        }
                    });
                });
            }
            this.dispatchEvent(mutationEvent);
        });
    }
    /**
     * Return an empty Set which is optimized to store keys
     */
    createOptimizedKeySet(initialSet) {
        return this.dataProvider.createOptimizedKeySet(initialSet);
    }
    /**
     * Returns an empty Map which will efficiently store Keys returned by the DataProvider
     */
    createOptimizedKeyMap(initialMap) {
        return this.dataProvider.createOptimizedKeyMap(initialMap);
    }
}
BufferingTreeDataProvider._REFRESH = 'refresh';
BufferingTreeDataProvider._MUTATE = 'mutate';
EventTargetMixin.applyMixin(BufferingTreeDataProvider);
oj._registerLegacyNamespaceProp('BufferingTreeDataProvider', BufferingTreeDataProvider);

export default BufferingTreeDataProvider;
