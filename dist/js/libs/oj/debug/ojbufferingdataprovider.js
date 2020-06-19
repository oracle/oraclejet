/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojset', 'ojs/ojmap', 'ojs/ojdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget'],
function(oj, ojSet, ojMap, __DataProvider)
{
  "use strict";
  var GenericEvent = oj.GenericEvent;


/**
 * Class which provides edit buffering
 */
class BufferingDataProvider {
    constructor(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this.AsyncIterable = class {
            constructor(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
        };
        this.AsyncIterator = class {
            constructor(_parent, _baseIterator, _params) {
                this._parent = _parent;
                this._baseIterator = _baseIterator;
                this._params = _params;
                this.itemArray = [];
                this.firstBaseKey = null;
                this.mergedAddKeySet = new ojSet();
                this.mergedMetadataArray = [];
                this.mergedDataArray = [];
            }
            _fetchNext() {
                return this._baseIterator.next().then((result) => {
                    // Remember the first key from base DataProvider before which we add unsorted new items
                    if (!this.firstBaseKey && result.value.metadata.length) {
                        this.firstBaseKey = result.value.metadata[0].key;
                    }
                    const editBuffer = this._parent.editBuffer;
                    if (!editBuffer.isEmpty()) {
                        let baseItemArray = result.value.data.map((val, index) => {
                            return { data: result.value.data[index], metadata: result.value.metadata[index] };
                        });
                        let newItemArray = this.itemArray.slice();
                        this.itemArray = [];
                        this._parent._mergeEdits(baseItemArray, newItemArray, this._params.filterCriterion, this._params.sortCriteria, true, this.mergedAddKeySet, result.done);
                        // If the new results don't have the requested number of rows, we may need to fetch more
                        const params = this._params || {};
                        if ((params.size && newItemArray.length < params.size) ||
                            (params.size == null && newItemArray.length === 0)) {
                            // We can only fetch more if the underlying DataProvider is not done
                            if (!result.done) {
                                // Set this.itemArray to newItemArray so that the next call will append to it
                                this.itemArray = newItemArray;
                                return this._fetchNext();
                            }
                        }
                        // If the new results have more rows than requested, we can save the rest for next call
                        if (params.size && newItemArray.length > params.size) {
                            this.itemArray = newItemArray.splice(params.size);
                        }
                        const done = result.done && this.itemArray.length === 0;
                        let newDataArray = newItemArray.map((item) => {
                            return item.data;
                        });
                        let newMetaArray = newItemArray.map((item) => {
                            return item.metadata;
                        });
                        return {
                            done: done,
                            value: { fetchParameters: this._params, data: newDataArray, metadata: newMetaArray }
                        };
                    }
                    return result;
                });
            }
            ['next']() {
                const promise = this._fetchNext();
                return promise.then((result) => {
                    // Keep track of the merged data that have been returned so that we know where added items should be inserted
                    const metadata = result.value.metadata;
                    const data = result.value.data;
                    for (let i = 0; i < metadata.length; i++) {
                        this.mergedMetadataArray.push(metadata[i]);
                        this.mergedDataArray.push(data[i]);
                    }
                    return result;
                });
            }
        };
        this._addEventListeners(dataProvider);
        this.editBuffer = new EditBuffer();
        this.lastSubmittableCount = 0;
        this.lastFetchListParams = null;
        this.lastIterator = null;
    }
    _fetchByKeysFromBuffer(params) {
        let results = new ojMap();
        let unresolvedKeys = new ojSet();
        params.keys.forEach((key) => {
            const editItem = this.editBuffer.getItem(key);
            if (editItem) {
                switch (editItem.operation) {
                    case 'add':
                    case 'update':
                        // Return the buffered item if it is being added or updated
                        results.set(key, editItem.item);
                        break;
                    case 'remove':
                        // Skip the key if it is being removed
                        break;
                }
            }
            else {
                // need to fetch from underlying DataProvider if it's not in the buffer
                unresolvedKeys.add(key);
            }
        });
        return {
            results: results,
            unresolvedKeys: unresolvedKeys
        };
    }
    _compareItem(d1, d2, sortCriteria) {
        for (let i = 0; i < sortCriteria.length; i++) {
            if (d1[sortCriteria[i].attribute] > d2[sortCriteria[i].attribute]) {
                return sortCriteria[i].direction === 'ascending' ? 1 : -1;
            }
            else if (d1[sortCriteria[i].attribute] < d2[sortCriteria[i].attribute]) {
                return sortCriteria[i].direction === 'ascending' ? -1 : 1;
            }
            // If d1 and d2 is the same on the current sortCriterion, move on to the next sortCriterion
        }
        return 0;
    }
    _insertAddEdits(editItems, filterObj, sortCriteria, itemArray, mergedAddKeySet, lastBlock) {
        editItems.forEach((editItem, key) => {
            // Check if it's an "add" item and not previously merged before merging it
            if (editItem.operation === 'add' && !mergedAddKeySet.has(key)) {
                // First check to see if this item satisfies any filter
                if (!filterObj || filterObj.filter(editItem.item.data)) {
                    if (sortCriteria && sortCriteria.length) {
                        let inserted = false;
                        for (let i = 0; i < itemArray.length; i++) {
                            if (this._compareItem(editItem.item.data, itemArray[i].data, sortCriteria) < 0) {
                                itemArray.splice(i, 0, editItem.item);
                                mergedAddKeySet.add(key);
                                inserted = true;
                                break;
                            }
                        }
                        // Add to the end only if the item hasn't been inserted and there is no more data
                        if (!inserted && lastBlock) {
                            itemArray.push(editItem.item);
                            mergedAddKeySet.add(key);
                        }
                    }
                    else {
                        itemArray.push(editItem.item);
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
    _mergeEdits(baseItemArray, newItemArray, filterCriterion, sortCriteria, addToBeginning, mergedAddKeySet, lastBlock) {
        let filterObj;
        // Get a filter if there is a filterCriterion
        if (filterCriterion) {
            if (!filterCriterion.filter) {
                filterObj = __DataProvider.FilterFactory.getFilter({
                    filterDef: filterCriterion,
                    filterOptions: this.options
                });
            }
            else {
                filterObj = filterCriterion;
            }
        }
        // If addToBeginning is true and there is no sortCriteria, insert all "add" items at the beginning.
        // Newly added items are likely the most important items and users want to see it at the beginning
        // instead of at the end.  We can add option to control this if there is request to add them
        // to the end.
        if (addToBeginning && !(sortCriteria && sortCriteria.length)) {
            this._mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
        }
        // Merge the removes and updates
        for (let i = 0; i < baseItemArray.length; i++) {
            let baseItem = baseItemArray[i];
            let editItem = this.editBuffer.getItem(baseItem.metadata.key);
            if (!editItem) {
                newItemArray.push(baseItem);
            }
            else {
                if (editItem.operation === 'remove') {
                    // Skip the item if it's marked for remove
                }
                else if (editItem.operation === 'update') {
                    // Replace the item if it's marked for update
                    // However, if the replacement doesn't satisfy any filter, skip it altogether.
                    if (!filterObj || filterObj.filter(editItem.item.data)) {
                        newItemArray.push(editItem.item);
                    }
                }
            }
        }
        // If there is sortCriteria, merge the "add" items into the existing items
        if (sortCriteria && sortCriteria.length) {
            this._mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock);
        }
    }
    _fetchFromOffset(params, newItemArray) {
        return this.dataProvider.fetchByOffset(params).then((baseResults) => {
            const editBuffer = this.editBuffer;
            if (!editBuffer.isEmpty()) {
                const baseItemArray = baseResults.results;
                this._mergeEdits(baseItemArray, newItemArray, params.filterCriterion, params.sortCriteria, params.offset === 0, new ojSet(), baseResults.done);
                // If the new results don't have the requested number of rows, we may need to fetch more
                if ((params.size && newItemArray.length < params.size) ||
                    (params.size == null && newItemArray.length === 0)) {
                    // We can only fetch more if the underlying DataProvider is not done
                    if (!baseResults.done) {
                        const nextParams = {
                            attributes: params.attributes,
                            clientId: params.clientId,
                            filterCriterion: params.filterCriterion,
                            offset: params.offset + baseResults.results.length,
                            size: params.size,
                            sortCriteria: params.sortCriteria
                        };
                        return this._fetchFromOffset(nextParams, newItemArray);
                    }
                }
                // If the new results have more rows than requested, we can remove the extra
                if (params.size && newItemArray.length > params.size) {
                    newItemArray.splice(params.size);
                }
                return { fetchParameters: params, results: newItemArray, done: baseResults.done };
            }
            return baseResults;
        });
    }
    containsKeys(params) {
        // First try to resolve the keys from the buffer
        let bufferResult = this._fetchByKeysFromBuffer(params);
        let unresolvedKeys = bufferResult.unresolvedKeys;
        let results = new ojSet();
        // Extract the set of keys from bufferResult
        bufferResult.results.forEach((value, key) => {
            results.add(key);
        });
        // We are done if all keys are resolved by the buffer
        if (unresolvedKeys.size === 0) {
            return Promise.resolve({ containsParameters: params, results: results });
        }
        // Otherwise fetch the remaining keys from the underlying DataProvider
        return this.dataProvider
            .containsKeys({ attributes: params.attributes, keys: unresolvedKeys, scope: params.scope })
            .then((baseResults) => {
            if (results.size > 0) {
                // If we already have some results from the buffer, add the remaining results from the underlying DataProvider
                baseResults.results.forEach((value, key) => {
                    results.add(key);
                });
                return { containsParameters: params, results: results };
            }
            return baseResults;
        });
    }
    fetchByKeys(params) {
        // First try to resolve the keys from the buffer
        let bufferResult = this._fetchByKeysFromBuffer(params);
        let unresolvedKeys = bufferResult.unresolvedKeys;
        let results = bufferResult.results;
        // We are done if all keys are resolved by the buffer
        if (unresolvedKeys.size === 0) {
            return Promise.resolve({ fetchParameters: params, results: results });
        }
        // Otherwise fetch the remaining keys from the underlying DataProvider
        return this.dataProvider
            .fetchByKeys({ attributes: params.attributes, keys: unresolvedKeys, scope: params.scope })
            .then((baseResults) => {
            if (results.size > 0) {
                // If we already have some results from the buffer, add the remaining results from the underlying DataProvider
                baseResults.results.forEach((value, key) => {
                    results.set(key, value);
                });
                return { fetchParameters: params, results: results };
            }
            return baseResults;
        });
    }
    fetchByOffset(params) {
        return this._fetchFromOffset(params, []);
    }
    fetchFirst(params) {
        this.lastFetchListParams = params;
        const baseIterator = this.dataProvider.fetchFirst(params)[Symbol.asyncIterator]();
        this.lastIterator = new this.AsyncIterator(this, baseIterator, params);
        return new this.AsyncIterable(this, this.lastIterator);
    }
    getCapability(capabilityName) {
        return this.dataProvider.getCapability(capabilityName);
    }
    _calculateSizeChange(editItems) {
        let sizeChange = 0;
        // Add the size of "add" items and substract the size of "remove" items
        editItems.forEach((value, key) => {
            if (value.operation === 'add') {
                ++sizeChange;
            }
            else if (value.operation === 'remove') {
                --sizeChange;
            }
        });
        return sizeChange;
    }
    getTotalSize() {
        // Start with the total size from underlying DataProvider
        return this.dataProvider.getTotalSize().then((totalSize) => {
            if (totalSize > -1) {
                // Adjust the size by submitting items
                totalSize += this._calculateSizeChange(this.editBuffer.getSubmittingItems());
                // Adjust the size by unsubmitted items.  We shouldn't need to worry about
                // "add" or "remove" items existing in both submitting and unsubmitted maps.
                // Duplicate "add" and "remove" is not allowed.
                totalSize += this._calculateSizeChange(this.editBuffer.getUnsubmittedItems());
            }
            return totalSize;
        });
    }
    isEmpty() {
        const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
        const submittingItems = this.editBuffer.getSubmittingItems();
        // If there is any add or update item, the BufferingDataProvider is not empty
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
        // At this point, we know that there is either no item or only remove items in the buffer.
        // delegate to the underlying DataProvider
        let isEmpty = this.dataProvider.isEmpty();
        if (isEmpty === 'no') {
            // If the underlying DataProvider is not empty, the BufferingDataProvider can
            // still be empty if all the rows in the underlying DataProvider are being removed.
            // However, to verify that, we have to get all the keys from the underlying DataProvider,
            // which can be expensive.  Consumer usually calls isEmpty as an inexpensive way to
            // tell if the DataProvider has any data.  If we cannot tell inexpensively, we
            // returns "unknown".
            if (unsubmittedItems.size > 0 || submittingItems.size > 0) {
                return 'unknown';
            }
        }
        return isEmpty;
    }
    addItem(item) {
        this.editBuffer.addItem(item);
        let addBeforeKey = null;
        if (this.lastIterator) {
            const sortCriteria = this.lastFetchListParams ? this.lastFetchListParams.sortCriteria : null;
            if (sortCriteria && sortCriteria.length) {
                // If there is sortCriteria, new items are inserted based on the sort
                let mergedMetadataArray = this.lastIterator.mergedMetadataArray;
                let mergedDataArray = this.lastIterator.mergedDataArray;
                for (let i = 0; i < mergedDataArray.length; i++) {
                    if (this._compareItem(item.data, mergedDataArray[i], sortCriteria) < 0) {
                        addBeforeKey = mergedMetadataArray[i].key;
                        mergedMetadataArray.splice(i, 0, item.metadata);
                        mergedDataArray.splice(i, 0, item.data);
                        break;
                    }
                }
            }
            else {
                // If there is no sortCriteria, new items are added at the beginning of dataset
                addBeforeKey = this.lastIterator.firstBaseKey;
            }
        }
        // Fire mutate event if successful
        const detail = {
            add: {
                data: [item.data],
                keys: new ojSet().add(item.metadata.key),
                metadata: [item.metadata],
                addBeforeKeys: [addBeforeKey]
            }
        };
        const event = new __DataProvider.DataProviderMutationEvent(detail);
        this.dispatchEvent(event);
        this._dispatchSubmittableChangeEvent();
    }
    removeItem(item) {
        this.editBuffer.removeItem(item);
        if (this.lastIterator) {
            // Remove item from the merged arrays
            let mergedMetadataArray = this.lastIterator.mergedMetadataArray;
            let mergedDataArray = this.lastIterator.mergedDataArray;
            let mergedAddKeySet = this.lastIterator.mergedAddKeySet;
            const keyIdx = this._findKeyInMetadata(item.metadata.key, mergedMetadataArray);
            if (keyIdx !== -1) {
                mergedMetadataArray.splice(keyIdx, 1);
                mergedDataArray.splice(keyIdx, 1);
                mergedAddKeySet.delete(item.metadata.key);
            }
        }
        // Fire mutate event if successful
        const detail = {
            remove: {
                data: item.data ? [item.data] : null,
                keys: new ojSet().add(item.metadata.key),
                metadata: [item.metadata]
            }
        };
        const event = new __DataProvider.DataProviderMutationEvent(detail);
        this.dispatchEvent(event);
        this._dispatchSubmittableChangeEvent();
    }
    updateItem(item) {
        this.editBuffer.updateItem(item);
        // Fire mutate event if successful
        const detail = {
            update: {
                data: [item.data],
                keys: new ojSet().add(item.metadata.key),
                metadata: [item.metadata]
            }
        };
        const event = new __DataProvider.DataProviderMutationEvent(detail);
        this.dispatchEvent(event);
        this._dispatchSubmittableChangeEvent();
    }
    getSubmittableItems() {
        const unsubmitted = this.editBuffer.getUnsubmittedItems();
        const submitting = this.editBuffer.getSubmittingItems();
        // If some items are in submitting state, only return those unsubmitted items that don't
        // have the same keys as the ones that are submitting.
        let submittableItems = [];
        unsubmitted.forEach((editItem, key) => {
            if (!submitting.has(key)) {
                submittableItems.push(editItem);
            }
        });
        return submittableItems;
    }
    resetAllUnsubmittedItems() {
        // Clear the buffer and fire submittableChange event
        this.editBuffer.getUnsubmittedItems().clear();
        this._dispatchSubmittableChangeEvent();
        // Fire refresh event so that consumers can refetch data
        this.dispatchEvent(new __DataProvider.DataProviderRefreshEvent());
    }
    _addEventDetail(detail, detailType, detailItem) {
        if (detail[detailType] == null) {
            detail[detailType] = { data: [], keys: new ojSet(), metadata: [] };
        }
        detail[detailType].keys.add(detailItem.metadata.key);
        detail[detailType].data.push(detailItem.data);
        detail[detailType].metadata.push(detailItem.metadata);
    }
    resetUnsubmittedItem(key) {
        const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
        let keySet = new ojSet();
        let editItemMap = new ojMap();
        // Remove the reset items from buffer and fire submittableChange event
        const editItem = unsubmittedItems.get(key);
        if (editItem) {
            keySet.add(key);
            // Delete the entry from the buffer but keep it in a temporary map
            editItemMap.set(key, editItem);
            unsubmittedItems.delete(key);
        }
        this._dispatchSubmittableChangeEvent();
        // Refetch the reset items and fire mutate event so that consumer have the original data
        this.dataProvider.fetchByKeys({ keys: keySet }).then((resultObj) => {
            let detail = {};
            let resultItem;
            editItemMap.forEach((editItem, key) => {
                if (editItem.operation === 'add') {
                    // If we reset an "add" entry, fire mutate event with remove detail.
                    this._addEventDetail(detail, 'remove', editItem.item);
                }
                else if (editItem.operation === 'remove') {
                    // If we reset a "remove" entry, fire mutate event with add detail,
                    // unless the underlying data no longer exists, in which case we don't do anything.
                    resultItem = resultObj.results.get(key);
                    if (resultItem) {
                        this._addEventDetail(detail, 'add', resultItem);
                    }
                }
                else {
                    // If we reset an "update" entry, fire mutate event with update detail,
                    // unless the underlying data no longer exists, in which case we fire mutate event with remove detail
                    resultItem = resultObj.results.get(key);
                    if (resultItem) {
                        this._addEventDetail(detail, 'update', resultItem);
                    }
                    else {
                        this._addEventDetail(detail, 'remove', editItem.item);
                    }
                }
            });
            this.dispatchEvent(new __DataProvider.DataProviderMutationEvent(detail));
        });
    }
    setItemStatus(editItem, newStatus, error) {
        if (editItem) {
            this.editBuffer.setItemStatus(editItem, newStatus, error);
            // If any item is changing status, we may have submittable items.
            // Call _dispatchSubmittableChangeEvent, which will figure out if we need to fire submittableChange event.
            this._dispatchSubmittableChangeEvent();
        }
    }
    _dispatchSubmittableChangeEvent() {
        // Fire the submittableChange event if the number of submittable item has changed
        const submittable = this.getSubmittableItems();
        if (submittable.length !== this.lastSubmittableCount) {
            this.lastSubmittableCount = submittable.length;
            const event = new BufferingDataProviderSubmittableChangeEvent(submittable);
            this.dispatchEvent(event);
        }
    }
    // Return the index of key in a metadata array
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
    _initDetailProp(detail, newDetail, propName, initValue) {
        if (detail[propName]) {
            newDetail[propName] = initValue;
        }
    }
    _pushDetailProp(detail, newDetail, propName, idx) {
        if (detail[propName]) {
            newDetail[propName].push(detail[propName][idx]);
        }
    }
    // Get the operation detail from underlying mutate event and create new detail that excludes items that are submitting.
    // The "indexes" property is also excluded from the new detail since it's optional and the original indexes could be wrong
    // due to "add" operations in the buffer.
    // If "isRemoveDetail" is true, also delete unsubmitted remove and update items that have the same keys as the mutated items because
    // the underlying data items no longer exist.
    _getOperationDetail(detail, isRemoveDetail) {
        if (detail) {
            let newDetail = {};
            const submittingItems = this.editBuffer.getSubmittingItems();
            const unsubmittedItems = this.editBuffer.getUnsubmittedItems();
            if (submittingItems.size === 0) {
                // If not item is submitting, simply use the underlying operation detail except indexes.
                this._initDetailProp(detail, newDetail, 'data', detail.data);
                this._initDetailProp(detail, newDetail, 'metadata', detail.metadata);
                this._initDetailProp(detail, newDetail, 'addBeforeKeys', detail.addBeforeKeys);
                this._initDetailProp(detail, newDetail, 'parentKeys', detail.parentKeys);
            }
            else {
                newDetail.keys = new ojSet();
                this._initDetailProp(detail, newDetail, 'data', []);
                this._initDetailProp(detail, newDetail, 'metadata', []);
                this._initDetailProp(detail, newDetail, 'addBeforeKeys', []);
                this._initDetailProp(detail, newDetail, 'parentKeys', []);
                detail.keys.forEach((key) => {
                    // Skip the mutation if it's in the submitting buffer, because this should be coming from
                    // the data source when the item is committed.  We would have already fired the mutate
                    // event when the item was first added to the buffer.
                    if (!submittingItems.get(key)) {
                        newDetail.keys.add(key);
                        if (detail.metadata) {
                            let idx = this._findKeyInMetadata(key, detail.metadata);
                            if (idx > -1) {
                                this._pushDetailProp(detail, newDetail, 'data', idx);
                                this._pushDetailProp(detail, newDetail, 'metadata', idx);
                                this._pushDetailProp(detail, newDetail, 'addBeforeKeys', idx);
                                this._pushDetailProp(detail, newDetail, 'parentKeys', idx);
                            }
                        }
                    }
                    // delete unsubmitted remove and update items for keys that are removed from underlying data
                    if (isRemoveDetail) {
                        const editItem = unsubmittedItems.get(key);
                        if (editItem && (editItem.operation === 'remove' || editItem.operation === 'update')) {
                            unsubmittedItems.delete(key);
                        }
                    }
                });
                return newDetail;
            }
        }
        return detail;
    }
    // Handle refresh event from underlying DataProvider
    _handleRefreshEvent(event) {
        // If we get a refresh event from the underlying DataProvider, check to see if the
        // unsubmitted remove and update edits still exist in the underlying DataProvider
        let unsubmittedItems = this.editBuffer.getUnsubmittedItems();
        let keySet = new ojSet();
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
    // Handle mutate event from underlying DataProvider
    _handleMutateEvent(event) {
        let newAddDetail = this._getOperationDetail(event.detail.add, false);
        let newRemoveDetail = this._getOperationDetail(event.detail.remove, true);
        let newUpdateDetail = this._getOperationDetail(event.detail.update, false);
        let newEventDetail = {
            add: newAddDetail,
            remove: newRemoveDetail,
            update: newUpdateDetail
        };
        this.dispatchEvent(new __DataProvider.DataProviderMutationEvent(newEventDetail));
    }
    /**
     * Add event listeners
     */
    _addEventListeners(dataprovider) {
        dataprovider[BufferingDataProvider._ADDEVENTLISTENER](BufferingDataProvider._REFRESH, this._handleRefreshEvent.bind(this));
        dataprovider[BufferingDataProvider._ADDEVENTLISTENER](BufferingDataProvider._MUTATE, this._handleMutateEvent.bind(this));
    }
}
BufferingDataProvider._REFRESH = 'refresh';
BufferingDataProvider._MUTATE = 'mutate';
BufferingDataProvider._ADDEVENTLISTENER = 'addEventListener';
oj['BufferingDataProvider'] = BufferingDataProvider;
oj.EventTargetMixin.applyMixin(BufferingDataProvider);


class BufferingDataProviderSubmittableChangeEvent extends GenericEvent {
    constructor(detail) {
        let eventOptions = {};
        eventOptions['detail'] = detail;
        super('submittableChange', eventOptions);
    }
}



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
 * The underlying DataProvider is responsible for fetchting data, and BufferingDataProvider will merge any buffered edits with
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
 * <p>In general, the edit item data should have the same shape as the data in the underlying DataProvider.
 * </p>
 * <p>If sorting and filtering is used in the underlying DataProvider, the application should ensure that all attributes referenced in the
 * sort criterion and filter criterion are included in the item data.  If there is a sortCriteria, added items are merged with the
 * underlying data based on the sortCriteria.  If there is no sortCriteria, added items are inserted at the
 * beginning of the underlying data.  Furthermore, iterators obtained by fetchFirst must all use the same sortCriteria
 * if the application is using those iterators at the same time.
 * </p>
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
 * <pre class="prettyprint"><code>var listener = function(event) {
 *   var editItems = event.detail;
 *   console.log("Number of submittable edit items: " + editItems.length);
 * };
 * dataProvider.addEventListener("submittableChange", listener);
 * </code></pre>
 *
 * @param {DataProvider} dataProvider The underlying DataProvider that provides the original data.
 * @param {Object=} options Options for the underlying DataProvider.
 * @ojsignature [{target: "Type",
 *               value: "class BufferingDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of key"}, {"name": "D", "description": "Type of data"}]},
 *               {target: "Type",
 *               value: "DataProvider<K, D>",
 *               for: "dataProvider"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 *   "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults", "DataMapping",
 *   "FetchListResult","FetchListParameters", "FetchAttribute", "DataFilter", "Item", "ItemWithOptionalData", "ItemMessage"]}
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
 * @inheritdoc
 * @memberof BufferingDataProvider
 * @instance
 * @method
 * @name fetchFirst
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
 * @ojsignature {target: "Type",
 *               value: "(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage): void"}
 */


/**
 * End of jsdoc
 */


class EditBuffer {
    constructor() {
        this.unsubmittedItems = new ojMap();
        this.submittingItems = new ojMap();
    }
    addItem(item) {
        let unsubmitted = this.unsubmittedItems.get(item.metadata.key);
        let submitting = this.submittingItems.get(item.metadata.key);
        if ((unsubmitted && (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) ||
            (submitting && (submitting.operation === 'add' || submitting.operation === 'update'))) {
            // It's an error if we add an item that's being added or updated
            throw new Error('Cannot add item with same key as an item being added or updated');
        }
        else if (unsubmitted && unsubmitted.operation === 'remove') {
            // If we add an item that's being remove and...
            if (unsubmitted.item.data && oj.Object.compareValues(unsubmitted.item.data, item.data)) {
                // the data is the same, simply delete the "remove" entry
                this.unsubmittedItems.delete(item.metadata.key);
            }
            else {
                // the data is different, change the "remove" entry to an "update" entry
                this.unsubmittedItems.set(item.metadata.key, { operation: 'update', item: item });
            }
            return;
        }
        this.unsubmittedItems.set(item.metadata.key, { operation: 'add', item: item });
    }
    removeItem(item) {
        let unsubmitted = this.unsubmittedItems.get(item.metadata.key);
        let submitting = this.submittingItems.get(item.metadata.key);
        if ((unsubmitted && unsubmitted.operation === 'remove') ||
            (submitting && submitting.operation === 'remove')) {
            // It's an error if we remove an item that's being removed
            throw new Error('Cannot remove item with same key as an item being removed');
        }
        else if (unsubmitted && unsubmitted.operation === 'add') {
            // If we remove an item that's being added but unsubmitted, just remove it from the buffer as if it never exists
            this.unsubmittedItems.delete(item.metadata.key);
            return;
        }
        else if (unsubmitted && unsubmitted.operation === 'update') {
            // If we remove an item that's being updated but unsubmitted, mark it for remove instead
            this.unsubmittedItems.set(item.metadata.key, { operation: 'remove', item: item });
            return;
        }
        this.unsubmittedItems.set(item.metadata.key, { operation: 'remove', item: item });
    }
    updateItem(item) {
        let unsubmitted = this.unsubmittedItems.get(item.metadata.key);
        let submitting = this.submittingItems.get(item.metadata.key);
        if ((unsubmitted && unsubmitted.operation === 'remove') ||
            (submitting && submitting.operation === 'remove')) {
            // It's an error if we update an item that's being removed
            throw new Error('Cannot update item with same key as an item being removed');
        }
        else if (unsubmitted &&
            (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) {
            // If we update an item that's being added or updated but unsubmitted, it's the same operation with different data
            this.unsubmittedItems.set(item.metadata.key, {
                operation: unsubmitted.operation,
                item: item
            });
            return;
        }
        this.unsubmittedItems.set(item.metadata.key, { operation: 'update', item: item });
    }
    setItemStatus(editItem, newStatus, error) {
        const key = editItem.item.metadata.key;
        if (newStatus === 'submitting') {
            this.unsubmittedItems.delete(key);
            this.submittingItems.set(key, editItem);
        }
        else if (newStatus === 'submitted') {
            this.submittingItems.delete(key);
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
    isEmpty() {
        return this.unsubmittedItems.size === 0 && this.submittingItems.size === 0;
    }
    // Get an unsubmitted or submitting EditItem by key.
    getItem(key) {
        let editItem = this.unsubmittedItems.get(key);
        if (!editItem) {
            editItem = this.submittingItems.get(key);
        }
        return editItem;
    }
}






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

/**
 * End of jsdoc
 */

  return BufferingDataProvider;
});