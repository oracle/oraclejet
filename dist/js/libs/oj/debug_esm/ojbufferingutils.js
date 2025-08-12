/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { SortUtils, FilterFactory, wrapWithAbortHandling, DataProviderMutationEvent } from 'ojs/ojdataprovider';
import ojMap from 'ojs/ojmap';

class BufferingDataProviderUtils {
    static fetchByKeysFromBuffer(params, editBuffer) {
        const results = new ojMap();
        const unresolvedKeys = new Set();
        params.keys.forEach((key) => {
            const editItem = editBuffer.getItem(key);
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
        return { results, unresolvedKeys };
    }
    static compareItem(d1, d2, sortCriteria) {
        for (const sortCrt of sortCriteria) {
            let comparator = SortUtils.getNaturalSortComparator();
            const descendingResult = sortCrt.direction === 'descending' ? -1 : 1;
            const comparatorResult = comparator(this.getVal(d1, sortCrt.attribute), this.getVal(d2, sortCrt.attribute)) *
                descendingResult;
            if (comparatorResult !== 0) {
                return comparatorResult;
            }
            // If d1 and d2 is the same on the current sortCriterion, move on to the next sortCriterion
        }
        return 0;
    }
    static getVal(val, attr) {
        if (val === null || typeof val === 'undefined') {
            return val;
        }
        if (typeof attr === 'string') {
            const dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                const startAttr = attr.substring(0, dotIndex);
                const endAttr = attr.substring(dotIndex + 1);
                const subObj = val[startAttr];
                if (subObj) {
                    return this.getVal(subObj, endAttr);
                }
            }
        }
        if (typeof val[attr] === 'function') {
            return val[attr]();
        }
        return val[attr];
    }
    static insertAddEdits(editItems, filterObj, sortCriteria, itemArray, mergedAddKeySet, lastBlock, editBuffer, parent) {
        editItems.forEach(async (editItem, key) => {
            if (editItem.operation === 'add') {
                if (!filterObj || filterObj.filter(editItem.item.data)) {
                    // no filter or meets the filter
                    parent.totalFilteredRowCount++;
                }
            }
            else {
                // update and remove case
                // need to check old data if we have filterObj and then calculate new totalFilteredRowCount
                let oldData = null;
                if (filterObj) {
                    if (parent.dataBeforeUpdated.has(key)) {
                        oldData = parent.dataBeforeUpdated.get(key);
                    }
                    else {
                        let keySet = new Set();
                        keySet.add(key);
                        let value = await parent.dataProvider.fetchByKeys({ keys: keySet });
                        oldData = value.results.get(key).data;
                        parent.dataBeforeUpdated.set(key, oldData);
                    }
                }
                if (editItem.operation === 'remove') {
                    if (!filterObj || filterObj.filter(oldData)) {
                        // don't have filter or
                        // old data meets the filter
                        parent.totalFilteredRowCount--;
                    }
                }
                else if (editItem.operation === 'update' && filterObj) {
                    if (filterObj.filter(oldData) && !filterObj.filter(editItem.item.data)) {
                        // old data meets filter, new data doesn't meet filter
                        parent.totalFilteredRowCount--;
                    }
                    else if (!filterObj.filter(oldData) && filterObj.filter(editItem.item.data)) {
                        // old data doesn't meets filter, new data meets filter
                        parent.totalFilteredRowCount++;
                    }
                }
            }
            // Check if it's an "add" item and not previously merged before merging it
            if ((editItem.operation === 'add' || editItem.operation === 'update') &&
                !mergedAddKeySet.has(key)) {
                // First check to see if this item satisfies any filter
                if (!filterObj || filterObj.filter(editItem.item.data)) {
                    if (sortCriteria && sortCriteria.length) {
                        let inserted = false;
                        for (let i = 0; i < itemArray.length; i++) {
                            if (editItem.operation === 'update' &&
                                !editBuffer.isUpdateTransformed(key) &&
                                key === itemArray[i].metadata.key) {
                                itemArray.splice(i, 1); // remove the old updated item and will be added if within fetch range later
                            }
                            if (this.compareItem(editItem.item.data, itemArray[i].data, sortCriteria) < 0) {
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
                        (editItem.operation === 'update' && editBuffer.isUpdateTransformed(key))) {
                        const insertIndex = editItem.addDetail === undefined
                            ? 0
                            : this.findKeyInItems(editItem.addDetail.addBeforeKey, itemArray);
                        if (insertIndex > -1) {
                            itemArray.splice(insertIndex, 0, editItem.item);
                            mergedAddKeySet.add(key);
                        }
                        else if (lastBlock) {
                            itemArray.push(editItem.item);
                            mergedAddKeySet.add(key);
                        }
                    }
                }
            }
        });
    }
    static mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock, editBuffer, parent) {
        const editBufferUnsubmittedItems = editBuffer.getUnsubmittedItems();
        this.insertAddEdits(editBufferUnsubmittedItems, filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock, editBuffer, parent);
        const editBufferSubmittingItems = editBuffer.getSubmittingItems();
        this.insertAddEdits(editBufferSubmittingItems, filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock, editBuffer, parent);
    }
    // Merge "add" and "update" edit items with baseItemArray and add to newItemArray
    static mergeEdits(baseItemArray, newItemArray, filterCriterion, sortCriteria, mergedAddKeySet, lastBlock, editBuffer, parent) {
        let filterObj;
        // Get a filter if there is a filterCriterion
        if (filterCriterion) {
            if (!filterCriterion.filter) {
                filterObj = FilterFactory.getFilter({
                    filterDef: filterCriterion,
                    filterOptions: parent.options
                });
            }
            else {
                filterObj = filterCriterion;
            }
        }
        // include submitted items for iterators that were active when the submit happened
        const includeSubmitted = newItemArray.length !== 0;
        // Merge the removes and updates
        for (const baseItem of baseItemArray) {
            const editItem = editBuffer.getItem(baseItem.metadata.key, includeSubmitted);
            if (!editItem) {
                newItemArray.push(baseItem);
            }
            else {
                if (editItem.operation === 'remove') {
                    // Include "remove" items in merged item array in case it's reset. We need to remove them from final result.
                    newItemArray.push(baseItem);
                }
                else if (editItem.operation === 'update' &&
                    !editBuffer.isUpdateTransformed(editItem.item.metadata.key)) {
                    if (!filterObj || filterObj.filter(editItem.item.data)) {
                        if (!sortCriteria || sortCriteria.length === 0) {
                            newItemArray.push(editItem.item);
                        }
                    }
                }
            }
        }
        // If there is sortCriteria, merge the "add" items into the existing items
        this.mergeAddEdits(filterObj, sortCriteria, newItemArray, mergedAddKeySet, lastBlock, editBuffer, parent);
    }
    static async fetchFromOffset(params, dataProvider, editBuffer) {
        const signal = params?.signal;
        const callback = async (resolve) => {
            const offset = params.offset;
            const isFetchToEnd = params.size == null || params.size === -1;
            const size = params.size;
            const mergedItems = [];
            const { submitting, submitted, unsubmitted } = this.getEditBufferCounts(editBuffer);
            const numUnsubmittedAdds = unsubmitted.numAdds;
            const numAdds = numUnsubmittedAdds + submitting.numAdds + submitted.numAdds;
            const numAddsAtIndexZero = unsubmitted.numAddsAtTop + submitting.numAddsAtTop + submitted.numAddsAtTop;
            let done = false;
            let skipAddsAtIndexZero = true;
            let underlyingFetchParams;
            // some concern with the values changing during the fetch
            // for fetch all get all underlying results
            const submittingItems = editBuffer.getSubmittingItems();
            const unSubmittedItems = editBuffer.getUnsubmittedItems();
            const submittedItems = editBuffer.getSubmittedAddItems();
            if (submittingItems.size === 0 && unSubmittedItems.size === 0 && submittedItems.size === 0) {
                underlyingFetchParams = { ...params };
                const fetchByOffsetResults = await dataProvider.fetchByOffset(params);
                return resolve(fetchByOffsetResults);
            }
            // add results from the editBuffer
            if (offset < numAddsAtIndexZero) {
                mergedItems.push(...this.getAllAddsAtTop(editBuffer).slice(offset, isFetchToEnd ? undefined : offset + size));
            }
            if (!isFetchToEnd && offset + size <= numAddsAtIndexZero) {
                return resolve({ fetchParameters: params, results: mergedItems, done: done });
            }
            // if all of the requested rows exist in the editBuffer, do not perform a fetch
            const numRemoves = unsubmitted.numRemoves + submitting.numRemoves;
            const numMoveAdds = unsubmitted.numMoveAdds + submitting.numMoveAdds;
            const numSubmittedOrSubmittingAdds = submitting.numAdds + submitted.numAdds;
            let overrideOffset = { offset: offset };
            let overrideSize = { size: size };
            let mergedItemsOffset = 0;
            // if neither of the following conditions are met then there are just true updates and the underlyingParams
            // match the original params
            if (numRemoves > 0 ||
                numMoveAdds > 0 ||
                numSubmittedOrSubmittingAdds > 0 ||
                numAdds - numAddsAtIndexZero > 0) {
                overrideOffset = {
                    // if there are removes or 'moveAdds' or adds with addBeforeKey then offset is set to zero since the BDP needs to know where
                    // those rows are in the underlying data provider for deciding where to start pulling from the
                    // result set.
                    offset: 0
                };
                if (numMoveAdds > 0) {
                    // if there are moveAdds then clear the rows which are added because we can't differentiate newly added row and data from base dp
                    mergedItems.length = 0;
                    mergedItemsOffset = offset;
                    skipAddsAtIndexZero = false;
                }
                else {
                    mergedItemsOffset = Math.max(0, offset - numAddsAtIndexZero);
                }
                if (!isFetchToEnd) {
                    overrideSize = {
                        // the underlying size needs to be incremented by:
                        // offset - to account for setting it to zero
                        // numRemoves - to account for the rows underlying may returns that we would skip
                        // numMoveAdds - to account for the rows underlying may return that are in the editBuffer adds
                        // numSubmittedOrSubmittingAdds - to account for the rows underlying may return that are in the editBuffer adds
                        // the underlying size needs to be decremented by:
                        // (unsubmittedAdds - offset) - the number of added rows at the top that are in requested range but not yet in the underlying data provider
                        size: offset +
                            size +
                            numRemoves +
                            numMoveAdds +
                            numSubmittedOrSubmittingAdds -
                            Math.max(unsubmitted.numAddsAtTop - offset, 0)
                    };
                }
                // when we drop the offset to 0 we don't necessarily want to start adding the rows from index 0 of the results
                // we will start shift the window by the number of adds, this will increase for any rows deleted before the first
                // used result
            }
            else if (unsubmitted.numAddsAtTop > 0) {
                overrideOffset = {
                    // if the only adds are unsubmitted adds we can optimize the offset and size
                    // if there are adds we can need to decrement the offset by the number of adds to shift the fetch region
                    offset: Math.max(offset - unsubmitted.numAddsAtTop, 0)
                };
                if (!isFetchToEnd) {
                    overrideSize = {
                        // the underlying size needs to be decremented by:
                        // (unsubmittedAdds - offset) - the number of added rows in the requested range that are not yet in the underlying data provider
                        size: size - Math.max(unsubmitted.numAddsAtTop - offset, 0)
                    };
                }
            }
            const fetchSize = Math.max(overrideSize.size, size);
            while (!done && (isFetchToEnd || mergedItems.length < fetchSize)) {
                underlyingFetchParams = { ...params, ...overrideOffset, ...overrideSize };
                let results = await dataProvider.fetchByOffset(underlyingFetchParams);
                let resultsArray = results.results;
                if (resultsArray.length === 0) {
                    done = true;
                    break;
                }
                done = results.done;
                resultsArray.forEach((result) => {
                    if (!editBuffer.isSubmittingOrSubmittedAdd(result.metadata.key)) {
                        mergedItems.push(result);
                    }
                });
                overrideOffset.offset += resultsArray.length;
                // debate if this can be overrideSize -= resultSize
                overrideSize.size = isFetchToEnd ? size : size - mergedItems.length;
            }
            this.performEdits(mergedItems, editBuffer.getAllTransactions(), skipAddsAtIndexZero, done);
            return resolve({
                fetchParameters: params,
                results: mergedItems.slice(mergedItemsOffset, isFetchToEnd ? undefined : mergedItemsOffset + size),
                done: done
            });
        };
        return wrapWithAbortHandling(signal, callback, true);
    }
    static performEdits(itemsArray, editItems, skipAddsAtIndexZero, done) {
        editItems.forEach((editItem) => {
            if (editItem.operation === 'add') {
                if (editItem.addDetail) {
                    if (editItem.addDetail.addBeforeKey !== null) {
                        const insertionIndex = this.findKeyInItems(editItem.addDetail.addBeforeKey, itemsArray);
                        if (insertionIndex > -1) {
                            itemsArray.splice(insertionIndex, 0, editItem.item);
                        }
                        else if (done) {
                            itemsArray.push(editItem.item);
                        }
                    }
                    else if (done) {
                        itemsArray.push(editItem.item);
                    }
                }
                else if (!skipAddsAtIndexZero) {
                    itemsArray.unshift(editItem.item);
                }
            }
            else if (editItem.operation === 'remove') {
                const removeIndex = this.findKeyInItems(editItem.item.metadata.key, itemsArray);
                if (removeIndex > -1) {
                    itemsArray.splice(removeIndex, 1);
                }
            }
            else if (editItem.operation === 'update') {
                const updateIndex = this.findKeyInItems(editItem.item.metadata.key, itemsArray);
                if (updateIndex > -1) {
                    itemsArray.splice(updateIndex, 1, editItem.item);
                }
            }
        });
    }
    static calculateSizeChange(editItems, editBuffer) {
        let sizeChange = 0;
        // Add the size of "add" items and subtract the size of "remove" items
        editItems.forEach((value, key) => {
            if (!editBuffer.getEditItemStatus(key)) {
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
    static getEditBufferCounts(editBuffer) {
        const submitting = this.getCounts(editBuffer.getSubmittingItems(), editBuffer);
        const unsubmitted = this.getCounts(editBuffer.getUnsubmittedItems(), editBuffer);
        const submitted = this.getCounts(editBuffer.getSubmittedAddItems(), editBuffer);
        return { submitting, unsubmitted, submitted };
    }
    static getCounts(editItems, editBuffer) {
        let numAdds = 0;
        let numRemoves = 0;
        let numMoveAdds = 0;
        let numAddsAtTop = 0;
        editItems.forEach((value, key) => {
            if (value.operation === 'add') {
                ++numAdds;
                if (!value.addDetail) {
                    ++numAddsAtTop;
                }
            }
            else if (value.operation === 'remove') {
                ++numRemoves;
            }
            else if (value.operation === 'update' && editBuffer.isUpdateTransformed(key)) {
                ++numMoveAdds;
            }
        });
        return { numAdds, numAddsAtTop, numRemoves, numMoveAdds };
    }
    static getAllAddsAtTop(editBuffer) {
        const addOrder = editBuffer.getAddItemOrder();
        const items = new Array();
        addOrder.forEach((key) => {
            // adds always have data...
            const editItem = editBuffer.getItem(key, true);
            if (editItem && !editItem.addDetail) {
                items.push(editItem.item);
            }
        });
        return items;
    }
    // Return true if there is a "remove" edit item for key
    static isItemRemoved(key, editBuffer) {
        const editItem = editBuffer.getItem(key);
        return editItem != null && editItem.operation === 'remove';
    }
    static addToMergedArrays(item, fromBaseDP, lastIterator, editBuffer, addBeforeKey = null, insertAtTop = false) {
        let finalAddBeforeKey = addBeforeKey;
        let index = null;
        if (fromBaseDP) {
            // if item of addBeforeKey is removed by removeItem, find the next key of that item recursively
            finalAddBeforeKey = this.getNextKey(addBeforeKey, lastIterator, editBuffer, false);
        }
        else if (lastIterator) {
            if (insertAtTop) {
                index = 0;
                for (let i = 0; i < lastIterator.mergedItemArray.length; i++) {
                    const key = lastIterator.mergedItemArray[i].metadata.key;
                    if (!this.isItemRemoved(key, editBuffer)) {
                        finalAddBeforeKey = key;
                        break;
                    }
                }
            }
            else {
                if (addBeforeKey !== null) {
                    index = this.findKeyInItems(addBeforeKey, lastIterator.mergedItemArray);
                    if (index === -1) {
                        index = null;
                    }
                }
            }
            let shouldIncrementNextOffset = index !== null && lastIterator.nextOffset > index;
            if (editBuffer.isUpdateTransformed(item.metadata.key)) {
                let removeIdx = this.findKeyInItems(item.metadata.key, lastIterator.mergedItemArray);
                if (removeIdx !== -1) {
                    if (shouldIncrementNextOffset) {
                        shouldIncrementNextOffset = lastIterator.nextOffset <= removeIdx;
                    }
                    lastIterator.mergedItemArray.splice(removeIdx, 1);
                }
            }
            if (index !== null) {
                lastIterator.mergedItemArray.splice(index, 0, item);
                lastIterator.mergedAddKeySet.add(item.metadata.key);
            }
            if (shouldIncrementNextOffset) {
                lastIterator.nextOffset++;
            }
        }
        else if (insertAtTop) {
            index = 0;
        }
        return {
            addBeforeKey: finalAddBeforeKey,
            index
        };
    }
    static getNextKey(key, lastIterator, editBuffer, bRemoved = false) {
        // bRemoved=true indicates the key will be removed
        let nextKey = key;
        if (lastIterator) {
            const mergedItemArray = lastIterator.mergedItemArray;
            let keyIdx = this.findKeyInItems(key, mergedItemArray);
            while (nextKey !== null && (bRemoved || this.isItemRemoved(nextKey, editBuffer))) {
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
    static generateKey(value, customKeyGenerator) {
        if (customKeyGenerator) {
            return customKeyGenerator(value);
        }
        else {
            // check if the browser supports UUID
            if (crypto.randomUUID) {
                return crypto.randomUUID();
            }
            else {
                // fallback mainly for Safari 15.x
                // @ts-ignore
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
            }
        }
    }
    static removeFromMergedArrays(key, fromBaseDP, lastIterator, editBuffer) {
        if (lastIterator) {
            // Remove item from the merged arrays
            const mergedItemArray = lastIterator.mergedItemArray;
            const mergedAddKeySet = lastIterator.mergedAddKeySet;
            const keyIdx = this.findKeyInItems(key, mergedItemArray);
            if (keyIdx !== -1) {
                if (fromBaseDP || mergedAddKeySet.has(key)) {
                    // If the item is removed from base DP or newly added through addItem, permanently remove it from the buffer
                    mergedItemArray.splice(keyIdx, 1);
                    mergedAddKeySet.delete(key);
                }
                // we need the next offset to be the last non-removed item, before the nextOffset always
                for (let i = lastIterator.nextOffset - 1; i >= 0; i--) {
                    let itemKey = mergedItemArray[i]?.metadata.key;
                    if (itemKey != null && !this.isItemRemoved(itemKey, editBuffer)) {
                        break;
                    }
                    lastIterator.nextOffset = i;
                }
            }
        }
    }
    static addEventDetail(detail, detailType, detailItem, detailAddBeforeKey) {
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
    // Return the index of key in a metadata array
    static findKeyInMetadata(key, metadata) {
        if (metadata) {
            for (let i = 0; i < metadata.length; i++) {
                if (oj.KeyUtils.equals(key, metadata[i].key)) {
                    return i;
                }
            }
        }
        return -1;
    }
    // Return the index of key in an item array
    static findKeyInItems(key, items) {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (oj.KeyUtils.equals(key, items[i].metadata.key)) {
                    return i;
                }
            }
        }
        return -1;
    }
    static initDetailProp(detail, newDetail, propName, initValue) {
        if (detail[propName]) {
            newDetail[propName] = initValue;
        }
    }
    static initDetail(detail, newDetail, bEmpty, bAdd = false) {
        if (bEmpty) {
            this.initDetailProp(detail, newDetail, 'data', []);
            this.initDetailProp(detail, newDetail, 'metadata', []);
            if (bAdd) {
                this.initDetailProp(detail, newDetail, 'addBeforeKeys', []);
            }
            this.initDetailProp(detail, newDetail, 'indexes', []);
            this.initDetailProp(detail, newDetail, 'parentKeys', []);
        }
        else {
            this.initDetailProp(detail, newDetail, 'data', detail.data);
            this.initDetailProp(detail, newDetail, 'metadata', detail.metadata);
            if (bAdd) {
                this.initDetailProp(detail, newDetail, 'addBeforeKeys', detail.addBeforeKeys);
            }
            this.initDetailProp(detail, newDetail, 'indexes', detail.indexes);
            this.initDetailProp(detail, newDetail, 'parentKeys', detail.parentKeys);
        }
    }
    static initDetails(details, newDetails, bEmpty) {
        if (details.add) {
            newDetails.add = { keys: new Set() };
            this.initDetail(details.add, newDetails.add, bEmpty, true);
        }
        if (details.remove) {
            newDetails.remove = { keys: new Set() };
            this.initDetail(details.remove, newDetails.remove, bEmpty);
        }
        if (details.update) {
            newDetails.update = { keys: new Set() };
            this.initDetail(details.update, newDetails.update, bEmpty);
        }
    }
    static pushDetailProp(detail, newDetail, propName, idx) {
        if (detail[propName]) {
            newDetail[propName].push(detail[propName][idx]);
        }
    }
    static pushDetail(key, detail, newDetail) {
        // Add the item as it
        newDetail.keys.add(key);
        if (detail.metadata) {
            const idx = this.findKeyInMetadata(key, detail.metadata);
            if (idx > -1) {
                this.pushDetailProp(detail, newDetail, 'data', idx);
                this.pushDetailProp(detail, newDetail, 'metadata', idx);
                if (detail.addBeforeKeys && detail.addBeforeKeys.length !== 0) {
                    this.pushDetailProp(detail, newDetail, 'addBeforeKeys', idx);
                }
                if (detail.indexes && detail.indexes.length !== 0) {
                    this.pushDetailProp(detail, newDetail, 'indexes', idx);
                }
                this.pushDetailProp(detail, newDetail, 'parentKeys', idx);
            }
        }
    }
    static isSkipItem(key, submittingItems, unsubmittedItems) {
        // Skip the mutation if:
        // 1. The key is in the submitting buffer, because the mutation should be coming from
        //    the data source when the item is committed.  We would have already fired the mutate
        //    event when the item was first added to the buffer.
        // 2. The key is in the unsubmitted buffer as removed item. Skip any mutation because
        //    the item does not exist from this dataprovider's perspective.
        let skipItem = submittingItems.get(key) != null;
        if (!skipItem) {
            const editItem = unsubmittedItems.get(key);
            skipItem = editItem && editItem.operation === 'remove';
        }
        return skipItem;
    }
    static isSortFieldUpdated(key, detail, lastIterator, lastSortCriteria) {
        let sortUpd = false;
        if (lastIterator && lastSortCriteria && lastSortCriteria.length) {
            const keyIdx = this.findKeyInItems(key, lastIterator.mergedItemArray);
            if (keyIdx < 0) {
                // don't need to move since the updated item is not in 'fetched' items
                return false;
            }
            // find out the fields in sortCriterial if present
            const sortFields = [];
            let i = 0;
            if (lastIterator && lastSortCriteria) {
                for (const sortCriteria of lastSortCriteria) {
                    sortFields[i++] = sortCriteria.attribute;
                }
            }
            for (const sortField of sortFields) {
                const idx = this.findKeyInMetadata(key, detail.metadata);
                if (lastIterator.mergedItemArray[keyIdx][sortField] !== detail.data[idx]) {
                    sortUpd = true;
                }
            }
        }
        return sortUpd;
    }
    // Get the operation detail from underlying mutate event and create new detail that reflect the current sortCriterion
    // The "indexes" property is also excluded from the new detail since it's optional and the original indexes could be wrong
    // due to "add" operations in the buffer.
    // addItem() always add new items to the top.
    // For 'add', when there is sortCriterion, addItem() will not move item and commit won't change the item's position.
    // When there is no sortCriterion, addItem() will not move item and commit won't change the item's position.
    // For 'remove', also delete unsubmitted remove and update items that have the same keys as the mutated items because
    // the underlying data items no longer exist.
    // For 'update', when there is sortCriterion, updateItem() will not move item and commit won't change the item's position.
    // When there is no sortCriterion, updateItem() will not move item and commit won't change the item's position.
    static getOperationDetails(details, addBeforeKeys, editBuffer) {
        if (details && (details.add || details.remove || details.update)) {
            let newDetails = {};
            const submittingItems = editBuffer.getSubmittingItems();
            const unsubmittedItems = editBuffer.getUnsubmittedItems();
            if (submittingItems.size === 0 && unsubmittedItems.size === 0) {
                // If no item is buffered, simply use the underlying operation detail except indexes.
                newDetails = details; // this.initDetails(details, newDetails, false);
            }
            else {
                this.initDetails(details, newDetails, true);
                this.processAdd(newDetails, details, addBeforeKeys);
                let skipItem;
                if (details.remove) {
                    details.remove.keys.forEach((key) => {
                        skipItem = this.isSkipItem(key, submittingItems, unsubmittedItems);
                        if (!skipItem) {
                            this.pushDetail(key, details.remove, newDetails.remove);
                        }
                        const editItem = unsubmittedItems.get(key);
                        if (editItem && (editItem.operation === 'remove' || editItem.operation === 'update')) {
                            unsubmittedItems.delete(key);
                        }
                    });
                }
                if (details.update) {
                    details.update.keys.forEach((key) => {
                        skipItem = this.isSkipItem(key, submittingItems, unsubmittedItems);
                        if (!skipItem) {
                            this.pushDetail(key, details.update, newDetails.update);
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
    static processAdd(newDetails, details, addBeforeKeys) {
        if (details.add) {
            newDetails.add = { ...details.add };
            if (addBeforeKeys != null) {
                newDetails.add.addBeforeKeys = addBeforeKeys;
            }
            return;
        }
    }
    static cleanUpSubmittedItem(key, editBuffer) {
        /**
         * called from handleMutateEvent
         * setItemStatus to 'submitted' and firing mutate event could happen in different order.
         * 1. when setItemStatus to 'submitted' happens before mutate event fired,
         * item should not be removed from submittingItems since handleMutateEvent
         * needs such information thus we set the internal 'status' to 'submitted'.
         * when mutate happens, we delete this item from submittingItems.
         * 2. when handleMutateEvent happens before setItemStatus to 'submitted',
         * we set the internal 'status' to 'mutated' so that when setItemStatus to 'submitted' happens,
         * we can delete the item from submittingItems.
         */
        const submittingItems = editBuffer.getSubmittingItems();
        const item = submittingItems.get(key);
        if (item) {
            editBuffer.setItemMutated(item);
        }
    }
    static checkGeneratedKeys(eventDetail, generatedKeyMap, lastIterator) {
        const checkKeyMap = (key, eventAddDetail, index) => {
            if (generatedKeyMap.has(key)) {
                // need to remove the generated key
                const transientKey = generatedKeyMap.get(key);
                // sanity check to see if the new key isn't also in the remove array
                if (!eventDetail.remove || !eventDetail.remove.keys?.has(key)) {
                    if (!eventDetail.remove) {
                        eventDetail.remove = { keys: new Set() };
                    }
                    // only keys is required for a remove, others like metadata are optional
                    eventDetail.remove.keys.add(transientKey);
                    // set the addBeforeKey so that the insert is to the first row
                    if (eventAddDetail) {
                        const firstKey = lastIterator?.mergedItemArray?.[0]?.metadata?.key;
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
    static containsKeys(params, editBuffer, dataProvider) {
        // First try to resolve the keys from the buffer
        const bufferResult = BufferingDataProviderUtils.fetchByKeysFromBuffer(params, editBuffer);
        const unresolvedKeys = bufferResult.unresolvedKeys;
        const results = new Set();
        // Extract the set of keys from bufferResult
        bufferResult.results.forEach((value, key) => {
            results.add(key);
        });
        // We are done if all keys are resolved by the buffer
        if (unresolvedKeys.size === 0) {
            return Promise.resolve({ containsParameters: params, results });
        }
        // Otherwise fetch the remaining keys from the underlying DataProvider
        return dataProvider
            .containsKeys({ attributes: params.attributes, keys: unresolvedKeys, scope: params.scope })
            .then((baseResults) => {
            if (results.size > 0) {
                // If we already have some results from the buffer, add the remaining results from the underlying DataProvider
                baseResults.results.forEach((value, key) => {
                    results.add(key);
                });
                return { containsParameters: params, results };
            }
            return baseResults;
        });
    }
    static fetchByKeys(params, editBuffer, dataProvider) {
        // First try to resolve the keys from the buffer
        const bufferResult = BufferingDataProviderUtils.fetchByKeysFromBuffer(params, editBuffer);
        const unresolvedKeys = bufferResult.unresolvedKeys;
        const results = bufferResult.results;
        const signal = params?.signal;
        const callback = (resolve) => {
            // We are done if all keys are resolved by the buffer
            if (unresolvedKeys.size === 0) {
                return resolve({ fetchParameters: params, results });
            }
            // Otherwise fetch the remaining keys from the underlying DataProvider
            return resolve(dataProvider
                .fetchByKeys({
                attributes: params.attributes,
                keys: unresolvedKeys,
                scope: params.scope,
                signal
            })
                .then((baseResults) => {
                if (results.size > 0) {
                    // If we already have some results from the buffer, add the remaining results from the underlying DataProvider
                    baseResults.results.forEach((value, key) => {
                        results.set(key, value);
                    });
                    return { fetchParameters: params, results };
                }
                return baseResults;
            }));
        };
        return wrapWithAbortHandling(signal, callback, false);
    }
    static removeItem(item, lastIterator, editBuffer) {
        editBuffer.removeItem(item);
        // Remove item from the merged arrays
        BufferingDataProviderUtils.removeFromMergedArrays(item.metadata.key, false, lastIterator, editBuffer);
        // Fire mutate event if successful
        const detail = {
            remove: {
                data: item.data ? [item.data] : null,
                keys: new Set().add(item.metadata.key),
                metadata: [item.metadata]
            }
        };
        return new DataProviderMutationEvent(detail);
    }
    static updateItem(item, editBuffer) {
        editBuffer.updateItem(item);
        // Fire mutate event if successful
        const detail = {
            update: {
                data: [item.data],
                keys: new Set().add(item.metadata.key),
                metadata: [item.metadata]
            }
        };
        return new DataProviderMutationEvent(detail);
    }
    static addItem(addItem, editBuffer, lastIterator, addDetail) {
        editBuffer.addItem(addItem, addDetail);
        // Add item to the merged arrays
        const computedAddDetail = BufferingDataProviderUtils.addToMergedArrays(addItem, false, lastIterator, editBuffer, addDetail?.addBeforeKey != null ? addDetail.addBeforeKey : null, addDetail === undefined);
        // Fire mutate event if successful
        const detail = {
            add: {
                data: [addItem.data],
                keys: new Set().add(addItem.metadata.key),
                metadata: [addItem.metadata],
                addBeforeKeys: [computedAddDetail.addBeforeKey],
                indexes: computedAddDetail.index === null ? null : [computedAddDetail.index]
            }
        };
        return new DataProviderMutationEvent(detail);
    }
    static fetchByOffset(params, editBuffer, dataProvider) {
        return BufferingDataProviderUtils.fetchFromOffset(params, dataProvider, editBuffer);
    }
    static getCapability(capabilityName, dataProvider) {
        return dataProvider.getCapability(capabilityName);
    }
    static getTotalSize(dataProvider, editBuffer) {
        // Start with the total size from underlying DataProvider
        return dataProvider.getTotalSize().then((totalSize) => {
            if (totalSize > -1) {
                // Adjust the size by submitting items
                totalSize += BufferingDataProviderUtils.calculateSizeChange(editBuffer.getSubmittingItems(), editBuffer);
                // Adjust the size by unsubmitted items.  We shouldn't need to worry about
                // "add" or "remove" items existing in both submitting and unsubmitted maps.
                // Duplicate "add" and "remove" is not allowed.
                totalSize += BufferingDataProviderUtils.calculateSizeChange(editBuffer.getUnsubmittedItems(), editBuffer);
            }
            return totalSize;
        });
    }
    static isEmpty(editBuffer, dataProvider) {
        const unsubmittedItems = editBuffer.getUnsubmittedItems();
        const submittingItems = editBuffer.getSubmittingItems();
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
        const isEmpty = dataProvider.isEmpty();
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
    static getSubmittableItems(editBuffer) {
        const unsubmitted = editBuffer.getUnsubmittedItems();
        const submitting = editBuffer.getSubmittingItems();
        // If some items are in submitting state, only return those unsubmitted items that don't
        // have the same keys as the ones that are submitting.
        const submittableItems = [];
        unsubmitted.forEach((editItem, key) => {
            if (!submitting.has(key)) {
                submittableItems.push(editItem);
            }
        });
        return submittableItems;
    }
    static resetAllUnsubmittedItems(editBuffer) {
        // Clear the buffer and fire submittableChange event
        editBuffer.resetAllUnsubmittedItems();
    }
    static async resetUnsubmittedItem(editItem, editBuffer, dataProvider, lastIterator, keySet) {
        // Refetch the reset items and fire mutate event so that consumer have the original data
        return dataProvider.fetchByKeys({ keys: keySet }).then((resultObj) => {
            const detail = {};
            let resultItem;
            const transactions = editBuffer.getAllTransactions();
            const key = editItem.item.metadata.key;
            if (editItem.operation === 'add') {
                // If we reset an "add" entry, remove the item from the merged array and fire mutate event with remove detail.
                BufferingDataProviderUtils.removeFromMergedArrays(key, false, lastIterator, editBuffer);
                BufferingDataProviderUtils.addEventDetail(detail, 'remove', editItem.item);
                transactions.push({ ...editItem, ...{ operation: 'remove' } });
            }
            else if (editItem.operation === 'remove') {
                // If we reset a "remove" entry, fire mutate event with add detail,
                // unless the underlying data no longer exists, in which case we don't do anything.
                resultItem = resultObj.results.get(key);
                if (resultItem) {
                    // We need an addBeforeKey for mutate-add event
                    let addBeforeKey = null;
                    if (lastIterator) {
                        // There is an addBeforeKey only if the data has been iterated.
                        const mergedItemArray = lastIterator.mergedItemArray;
                        const keyIdx = BufferingDataProviderUtils.findKeyInItems(key, mergedItemArray);
                        if (keyIdx !== -1) {
                            for (let i = keyIdx + 1; i < mergedItemArray.length; i++) {
                                if (!BufferingDataProviderUtils.isItemRemoved(mergedItemArray[i].metadata.key, editBuffer)) {
                                    addBeforeKey = mergedItemArray[i].metadata.key;
                                    break;
                                }
                            }
                        }
                    }
                    BufferingDataProviderUtils.addEventDetail(detail, 'add', resultItem, addBeforeKey);
                    transactions.push({ operation: 'add', item: resultItem, addDetail: { addBeforeKey } });
                }
            }
            else {
                // If we reset an "update" entry, fire mutate event with update detail,
                // unless the underlying data no longer exists, in which case we fire mutate event with remove detail
                resultItem = resultObj.results.get(key);
                if (resultItem) {
                    BufferingDataProviderUtils.addEventDetail(detail, 'update', resultItem);
                }
                else {
                    BufferingDataProviderUtils.addEventDetail(detail, 'remove', editItem.item);
                }
                transactions.push({ operation: 'update', item: resultItem });
            }
            return new DataProviderMutationEvent(detail);
        });
    }
    static setItemStatus(editItem, newStatus, generatedKeyMap, editBuffer, error, newKey) {
        if (editItem) {
            if (newKey != null) {
                generatedKeyMap.set(newKey, editItem.item.metadata.key);
            }
            editBuffer.setItemStatus(editItem, newStatus, error);
            // If any item is changing status, we may have submittable items.
            // Call dispatchSubmittableChangeEvent, which will figure out if we need to fire submittableChange event.
            return editBuffer;
        }
        return null;
    }
    // Handle refresh event from underlying DataProvider
    static async handleRefreshEvent(event, editBuffer, dataProvider) {
        // If we get a refresh event from the underlying DataProvider, check to see if the
        // unsubmitted remove and update edits still exist in the underlying DataProvider
        const unsubmittedItems = editBuffer.getUnsubmittedItems();
        const keySet = new Set();
        unsubmittedItems.forEach((editItem) => {
            if (editItem.operation === 'remove' || editItem.operation === 'update') {
                keySet.add(editItem.item.metadata.key);
            }
        });
        if (keySet.size > 0) {
            await dataProvider.fetchByKeys({ keys: keySet }).then((resultObj) => {
                resultObj.results.forEach((_item, key) => {
                    keySet.delete(key);
                });
                // keySet now contains the keys of remove and update edits that no longer exist in the underlying DataProvider,
                // so we remove them from the buffer.
                keySet.forEach((key) => {
                    unsubmittedItems.delete(key);
                });
            });
        }
        else if (event?.detail?.keys) {
            editBuffer.getSubmittingItems().forEach((_value, key) => {
                const rootKey = key[0];
                if (event.detail.keys.has(rootKey)) {
                    this.cleanUpSubmittedItem(key, editBuffer);
                }
            });
        }
        // Fire the refresh event if we don't need to clean up the buffer
        return event;
    }
    // Handle mutate event from underlying DataProvider
    static handleMutateEvent(event, editBuffer, lastIterator, generatedKeyMap, lastSortCriteria) {
        // Fix up the merged arrays
        const detailAdd = event.detail.add;
        let addBeforeKeys;
        if (detailAdd && detailAdd.metadata && detailAdd.data) {
            addBeforeKeys = detailAdd.addBeforeKeys ? [...detailAdd.addBeforeKeys] : null;
            detailAdd.metadata.forEach((metadata, idx) => {
                let addBeforeKey;
                // if no addBeforeKeys exist from underlying DP, there is no need to do the adjustment bellow
                if (detailAdd.addBeforeKeys && detailAdd.addBeforeKeys[idx] !== undefined) {
                    addBeforeKey = this.addToMergedArrays({ metadata: detailAdd.metadata[idx], data: detailAdd.data[idx] }, true, lastIterator, editBuffer, detailAdd.addBeforeKeys[idx]).addBeforeKey;
                    if (detailAdd.addBeforeKeys[idx] != null && addBeforeKey == null) {
                        // the item's addBeforeKey anchor item(s) is removed and the new item is end up at the end.
                        // fetchNext won't get the new items back since the removed items in the buffer
                        // won't reflect to the underlying DP offset
                        if (lastIterator && lastIterator.mergedItemArray) {
                            lastIterator.mergedItemArray.splice(lastIterator.mergedItemArray.length, 0, {
                                data: detailAdd.data[idx],
                                metadata: detailAdd.metadata[idx]
                            });
                        }
                    }
                    addBeforeKeys[idx] = addBeforeKey;
                }
                else {
                    if (detailAdd.indexes && detailAdd.indexes[idx] != null) {
                        let nextIdx = detailAdd.indexes[idx];
                        while (lastIterator && nextIdx < lastIterator.mergedItemArray.length) {
                            if (!this.isItemRemoved(lastIterator.mergedItemArray[nextIdx].metadata.key, editBuffer)) {
                                break;
                            }
                            nextIdx++;
                        }
                        if (lastIterator && nextIdx >= lastIterator.mergedItemArray.length) {
                            lastIterator.mergedItemArray.splice(lastIterator.mergedItemArray.length, 0, {
                                data: detailAdd.data[idx],
                                metadata: detailAdd.metadata[idx]
                            });
                        }
                    }
                }
                this.cleanUpSubmittedItem(metadata.key, editBuffer);
            });
        }
        const detailRemove = event.detail.remove;
        if (detailRemove) {
            detailRemove.keys.forEach((key) => {
                this.removeFromMergedArrays(key, true, lastIterator, editBuffer);
                this.cleanUpSubmittedItem(key, editBuffer);
            });
        }
        const sortFldUpdateds = [];
        const detailUpdate = event.detail.update;
        if (detailUpdate) {
            let updateEventAddBeforeKeys = [];
            detailUpdate.data.forEach((currData, idx) => {
                sortFldUpdateds[idx] = this.isSortFieldUpdated(detailUpdate.metadata[idx].key, detailUpdate, lastIterator, lastSortCriteria);
                if (sortFldUpdateds[idx]) {
                    this.removeFromMergedArrays(detailUpdate.metadata[idx].key, true, lastIterator, editBuffer);
                    updateEventAddBeforeKeys[idx] = this.addToMergedArrays({ data: currData, metadata: detailUpdate.metadata[idx] }, true, lastIterator, editBuffer, null).addBeforeKey;
                    if (updateEventAddBeforeKeys[idx] == null) {
                        // the updated item is moved to the end.
                        // fetchNext won't get the new items back since the updated items in the buffer
                        // won't reflect to the underlying DP offset
                        if (lastIterator && lastIterator.mergedItemArray) {
                            lastIterator.mergedItemArray.splice(lastIterator.mergedItemArray.length, 0, {
                                data: currData,
                                metadata: detailUpdate.metadata[idx]
                            });
                        }
                    }
                }
                this.cleanUpSubmittedItem(detailUpdate.metadata[idx].key, editBuffer);
            });
        }
        const newDetails = this.getOperationDetails(event.detail, addBeforeKeys, editBuffer);
        // check if the event contains any mapped generated keys
        this.checkGeneratedKeys(newDetails, generatedKeyMap, lastIterator);
        return new DataProviderMutationEvent(newDetails);
    }
    static fetchNext(fetchParams, baseIterator, currentIterator, lastSortCriteria, editBuffer, parent) {
        const signal = fetchParams?.signal;
        const mergedAddKeySet = currentIterator.mergedAddKeySet;
        const mergedItemArray = currentIterator.mergedItemArray;
        const callback = (resolve) => {
            return resolve(baseIterator.next().then(async (result) => {
                // The result should contain sortCriteria that's more accurate than the one from the fetch params
                // e.g. it may contains sortCriteria property on the baseDP or implicitSort
                if (result.value.fetchParameters && result.value.fetchParameters.sortCriteria) {
                    lastSortCriteria = result.value.fetchParameters.sortCriteria;
                }
                const baseItemArray = result.value.data.map((val, index) => {
                    return { data: result.value.data[index], metadata: result.value.metadata[index] };
                });
                parent.totalFilteredRowCount = result.value.totalFilteredRowCount;
                await BufferingDataProviderUtils.mergeEdits(baseItemArray, mergedItemArray, fetchParams.filterCriterion, lastSortCriteria, mergedAddKeySet, result.done, editBuffer, parent);
                // Find out how many items can be returned (i.e. not marked for "remove")
                let actualReturnSize = mergedItemArray.length - currentIterator.nextOffset;
                for (let i = currentIterator.nextOffset; i < mergedItemArray.length; i++) {
                    const item = mergedItemArray[i];
                    if (BufferingDataProviderUtils.isItemRemoved(item.metadata.key, editBuffer)) {
                        --actualReturnSize;
                    }
                }
                // If the new results don't have the requested number of rows, we may need to fetch more
                const params = fetchParams || {};
                if ((params.size && actualReturnSize < params.size) ||
                    (params.size == null && actualReturnSize === 0)) {
                    // We can only fetch more if the underlying DataProvider is not done
                    if (!result.done) {
                        return this.fetchNext(fetchParams, baseIterator, currentIterator, lastSortCriteria, editBuffer, parent);
                    }
                }
                // Construct the result
                const newDataArray = [];
                const newMetaArray = [];
                let idx;
                for (idx = currentIterator.nextOffset; idx < mergedItemArray.length; idx++) {
                    const item = mergedItemArray[idx];
                    if (!BufferingDataProviderUtils.isItemRemoved(item.metadata.key, editBuffer)) {
                        currentIterator.nextOffset = idx + 1;
                        newDataArray.push(item.data);
                        newMetaArray.push(item.metadata);
                        if (params.size && newDataArray.length === params.size) {
                            break;
                        }
                    }
                }
                const done = result.done && newDataArray.length === 0;
                const returnParams = result.value?.fetchParameters?.sortCriteria == null
                    ? params
                    : { ...params, sortCriteria: result.value.fetchParameters.sortCriteria };
                return {
                    done,
                    value: {
                        fetchParameters: returnParams,
                        data: newDataArray,
                        metadata: newMetaArray,
                        totalFilteredRowCount: fetchParams?.includeFilteredRowCount === 'enabled'
                            ? parent.totalFilteredRowCount
                            : null
                    }
                };
            }));
        };
        return wrapWithAbortHandling(signal, callback, false);
    }
}

class EditBuffer {
    constructor() {
        this.unsubmittedItems = new ojMap();
        this.submittingItems = new ojMap();
        // Tracks submitted adds/move adds for the purpose of ignoring them in fetch calls
        this.submittedAddItems = new ojMap();
        // Tracks the order items were added in since adds can be split across the
        // unsubmitted/submitting/submitted maps in any order
        this.addItemOrder = [];
        // Tracks if an update is actually a remove/add
        this.mapOpTransform = new ojMap();
        /**
         * the order of receiving mutate event and set item status to 'submitted' is not consistent.
         * we can not remove an item from submittingItems unless this item has mutated and submitted.
         */
        this.mapEditItemStatus = new ojMap();
        // global array to track all edits in order and used to replay all changes in fetchByOffset
        this.transactions = [];
    }
    addItem(item, addDetail) {
        const key = item.metadata.key;
        const unsubmitted = this.unsubmittedItems.get(key);
        const submitting = this.submittingItems.get(key);
        if ((unsubmitted && (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) ||
            (submitting && (submitting.operation === 'add' || submitting.operation === 'update'))) {
            // It's an error if we add an item that's being added or updated
            throw new Error('Cannot add item with same key as an item being added or updated');
        }
        const editItem = { operation: 'add', item, ...(addDetail && { addDetail }) };
        this.transactions.push(editItem);
        if (unsubmitted && unsubmitted.operation === 'remove') {
            // If we add an item that's being remove, change the "remove" entry to an "update" entry
            // table doesn't have the key and fetchNext needs to return this item
            // remove the item and add back to keep the insert order
            this.unsubmittedItems.delete(key);
            const newEditItem = { ...editItem, ...{ operation: 'update' } };
            this.unsubmittedItems.set(key, newEditItem);
            this.mapOpTransform.set(key, newEditItem);
            this.addItemOrder.unshift(key);
            return;
        }
        this.unsubmittedItems.set(key, editItem);
        this.addItemOrder.unshift(key);
    }
    removeItem(item) {
        const key = item.metadata.key;
        const unsubmitted = this.unsubmittedItems.get(key);
        const submitting = this.submittingItems.get(key);
        if ((unsubmitted && unsubmitted.operation === 'remove') ||
            (submitting && submitting.operation === 'remove')) {
            // It's an error if we remove an item that's being removed
            throw new Error('Cannot remove item with same key as an item being removed');
        }
        const editItem = { operation: 'remove', item };
        this.transactions.push(editItem);
        if (unsubmitted && unsubmitted.operation === 'add') {
            // If we remove an item that's being added but unsubmitted, just remove it from the buffer as if it never exists
            this.unsubmittedItems.delete(key);
            this._removeFromAddItemOrder(key);
            return;
        }
        else if (unsubmitted && unsubmitted.operation === 'update') {
            // If we remove an item that's being updated but unsubmitted then delete update enrty and add remove
            this.unsubmittedItems.delete(key);
            this.unsubmittedItems.set(key, editItem);
            this.mapOpTransform.delete(key);
            this._removeFromAddItemOrder(key);
            return;
        }
        this._removeFromAddItemOrder(key);
        this.unsubmittedItems.set(key, editItem);
    }
    updateItem(item) {
        const unsubmitted = this.unsubmittedItems.get(item.metadata.key);
        const submitting = this.submittingItems.get(item.metadata.key);
        if ((unsubmitted && unsubmitted.operation === 'remove') ||
            (submitting && submitting.operation === 'remove')) {
            // It's an error if we update an item that's being removed
            throw new Error('Cannot update item with same key as an item being removed');
        }
        const editItem = { operation: 'update', item };
        this.transactions.push(editItem);
        if (unsubmitted && (unsubmitted.operation === 'add' || unsubmitted.operation === 'update')) {
            // If we update an item that's being added or updated but unsubmitted, it's the same operation with different data
            this.unsubmittedItems.set(item.metadata.key, {
                operation: unsubmitted.operation,
                item
            });
            return;
        }
        this.unsubmittedItems.set(item.metadata.key, editItem);
    }
    setItemMutated(editItem) {
        const key = editItem.item.metadata.key;
        const item = this.submittingItems.get(key);
        if (item) {
            const status = this.mapEditItemStatus.get(key);
            if (status === 'submitted') {
                this.submittingItems.delete(key);
                if (editItem.operation === 'remove') {
                    this.submittedAddItems.delete(key);
                }
                else if (this._isAddOrMoveAdd(item)) {
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
            // the order of receiving mutate event and set item status to 'submitted' is not consistent.
            // we can not remove an item from submittingItems unless this item has mutated and submitted.
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
    // Get an unsubmitted or submitting EditItem by key.
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
    isSubmittingOrSubmittedAdd(key) {
        return this.submittingItems.get(key)?.operation === 'add' || this.submittedAddItems.has(key);
    }
    resetAllUnsubmittedItems() {
        this._clearAddItemOrder();
        this.unsubmittedItems.clear();
        this.submittingItems.clear();
        this.mapOpTransform.clear();
        this.transactions = [];
    }
    _clearAddItemOrder() {
        // this will remove unsubmittedItems/submitting items from the add
        // order array, submitted items should stay where they are in this case
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
    getAllTransactions() {
        return this.transactions;
    }
}

class TreeEditBuffer {
    constructor(editBuffer, parentKey, bufferingTreeDataProvider) {
        this.editBuffer = editBuffer;
        this.parentKey = parentKey;
        this.bufferingTreeDataProvider = bufferingTreeDataProvider;
    }
    filterByParentKey(editItemMap) {
        const parentMap = new ojMap();
        editItemMap.forEach((value, key) => {
            const keyParentKey = this.getParentKeyFromKey(key);
            if (oj.KeyUtils.equals(keyParentKey, this.parentKey)) {
                parentMap.set(key, value);
            }
        });
        return parentMap;
    }
    getParentKeyFromKey(keyPath) {
        return keyPath.slice(0, keyPath.length - 1);
    }
    addItem(item, addDetail) {
        return this.editBuffer.addItem(item, addDetail);
    }
    removeItem(item) {
        return this.editBuffer.removeItem(item);
    }
    updateItem(item) {
        return this.editBuffer.updateItem(item);
    }
    setItemMutated(editItem) {
        return this.editBuffer.setItemMutated(editItem);
    }
    setItemStatus(editItem, newStatus, error) {
        return this.editBuffer.setItemStatus(editItem, newStatus, error);
    }
    getUnsubmittedItems() {
        const unSubbmitedItems = this.editBuffer.getUnsubmittedItems();
        if (this.parentKey !== undefined) {
            return this.filterByParentKey(unSubbmitedItems);
        }
        return unSubbmitedItems;
    }
    getSubmittingItems() {
        const subbmitedItems = this.editBuffer.getSubmittingItems();
        if (this.parentKey !== undefined) {
            return this.filterByParentKey(subbmitedItems);
        }
        return subbmitedItems;
    }
    getSubmittedAddItems() {
        const subbmitedItems = this.editBuffer.getSubmittedAddItems();
        if (this.parentKey !== undefined) {
            return this.filterByParentKey(subbmitedItems);
        }
        return subbmitedItems;
    }
    isEmpty(includeSubmitted) {
        return (this.getUnsubmittedItems().size === 0 &&
            this.getSubmittingItems().size === 0 &&
            (includeSubmitted ? this.getSubmittedAddItems().size === 0 : true));
    }
    getItem(key, includeSubmitted) {
        return this.editBuffer.getItem(key, includeSubmitted);
    }
    isUpdateTransformed(key) {
        return this.editBuffer.isUpdateTransformed(key);
    }
    getEditItemStatus(key) {
        return this.editBuffer.getEditItemStatus(key);
    }
    isSubmittingOrSubmittedAdd(key) {
        return this.editBuffer.isSubmittingOrSubmittedAdd(key);
    }
    resetAllUnsubmittedItems() {
        return this.editBuffer.resetAllUnsubmittedItems();
    }
    getAddItemOrder() {
        return this.editBuffer.getAddItemOrder().filter((key) => {
            const keyPath = this.bufferingTreeDataProvider.convertKeyToKeyPath(key);
            const itemParent = this.bufferingTreeDataProvider.getParentKey(keyPath);
            return oj.KeyUtils.equals(itemParent, this.parentKey);
        });
    }
    getAllTransactions() {
        const transactions = this.editBuffer.getAllTransactions();
        if (this.parentKey !== undefined) {
            return transactions.filter((editItem) => {
                const keyParentKey = this.getParentKeyFromKey(editItem.item.metadata.key);
                return oj.KeyUtils.equals(keyParentKey, this.parentKey);
            });
        }
        return transactions;
    }
}

export { BufferingDataProviderUtils, EditBuffer, TreeEditBuffer };
