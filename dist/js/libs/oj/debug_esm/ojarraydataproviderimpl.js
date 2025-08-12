/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { wrapWithAbortHandling, FilterFactory, DataProviderRefreshEvent, DataProviderMutationEvent } from 'ojs/ojdataprovider';
import ojSet from 'ojs/ojset';
import oj from 'ojs/ojcore-base';
import ojMap from 'ojs/ojmap';
import { warn } from 'ojs/ojlogger';

const _ATDEFAULT = '@default';
const getFetchCapability = () => {
    const exclusionFeature = new Set();
    exclusionFeature.add('exclusion');
    return {
        caching: 'all',
        attributeFilter: {
            expansion: {},
            ordering: {},
            defaultShape: {
                features: exclusionFeature
            }
        }
    };
};
const markNoProxy = (obj) => {
    Object.defineProperty(obj, Symbol.for('oj-vb-no-object-proxy'), { value: true });
    return obj;
};
const getCapability = (capabilityName) => {
    if (capabilityName === 'sort') {
        return { attributes: 'multiple' };
    }
    else if (capabilityName === 'fetchByKeys') {
        return Object.assign({ implementation: 'lookup' }, getFetchCapability());
    }
    else if (capabilityName === 'fetchByOffset') {
        return Object.assign({ implementation: 'randomAccess', totalFilteredRowCount: 'exact' }, getFetchCapability());
    }
    else if (capabilityName === 'fetchFirst') {
        return Object.assign({ iterationSpeed: 'immediate', totalFilteredRowCount: 'exact' }, getFetchCapability());
    }
    else if (capabilityName === 'fetchCapability') {
        return getFetchCapability();
    }
    else if (capabilityName === 'filter') {
        return {
            operators: [
                '$co',
                '$eq',
                '$ew',
                '$pr',
                '$gt',
                '$ge',
                '$lt',
                '$le',
                '$ne',
                '$regex',
                '$sw',
                '$exists'
            ],
            attributeExpression: ['*'],
            textFilter: {},
            textFilterMatching: { matchBy: ['startsWith', 'contains', 'phrase'] },
            nestedFilter: {},
            collationOptions: {
                sensitivity: ['base', 'accent', 'case', 'variant']
            }
        };
    }
    return null;
};
/**
 * Get value for attribute
 */
const getVal = (val, attr) => {
    if (typeof attr === 'string') {
        const dotIndex = attr.indexOf('.');
        if (dotIndex > 0) {
            const startAttr = attr.substring(0, dotIndex);
            const endAttr = attr.substring(dotIndex + 1);
            const subObj = val[startAttr];
            if (subObj) {
                return getVal(subObj, endAttr);
            }
        }
    }
    if (typeof val[attr] === 'function') {
        return val[attr]();
    }
    return val[attr];
};
/**
 * Get all values in a row
 */
const getAllVals = (val) => {
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return val;
    }
    return Object.keys(val).map((key) => {
        return getVal(val, key);
    });
};
const filterRowAttributes = (fetchAttribute, data, updatedData) => {
    if (Array.isArray(fetchAttribute)) {
        // first see if we want all attributes
        let fetchAllAttributes = false;
        fetchAttribute.forEach((key) => {
            if (key === _ATDEFAULT || key.name === _ATDEFAULT) {
                fetchAllAttributes = true;
            }
        });
        let i;
        Object.keys(data).forEach((dataAttr) => {
            if (fetchAllAttributes) {
                let excludeAttribute = false;
                let fetchAttr = dataAttr;
                let attribute;
                for (i = 0; i < fetchAttribute.length; i++) {
                    if (fetchAttribute[i] instanceof Object) {
                        attribute = fetchAttribute[i]['name'];
                    }
                    else {
                        attribute = fetchAttribute[i];
                    }
                    if (attribute.startsWith('!')) {
                        attribute = attribute.substr(1, attribute.length - 1);
                        if (attribute === dataAttr) {
                            // if it's excluded then set the exclusion flag and break
                            excludeAttribute = true;
                            break;
                        }
                    }
                    else if (attribute === dataAttr) {
                        // if there is a fetch attribute with the same name then use that
                        fetchAttr = fetchAttribute[i];
                        break;
                    }
                }
                if (!excludeAttribute) {
                    filterRowAttributes(fetchAttr, data, updatedData);
                }
            }
            else {
                fetchAttribute.forEach((fetchAttr) => {
                    let attribute;
                    if (fetchAttr instanceof Object) {
                        attribute = fetchAttr['name'];
                    }
                    else {
                        attribute = fetchAttr;
                    }
                    if (!attribute.startsWith('!') && attribute === dataAttr) {
                        filterRowAttributes(fetchAttr, data, updatedData);
                    }
                });
            }
        });
    }
    else if (fetchAttribute instanceof Object) {
        const name = fetchAttribute['name'];
        const attributes = fetchAttribute['attributes'];
        if (name && !name.startsWith('!')) {
            if (data[name] instanceof Object && !Array.isArray(data[name]) && attributes) {
                const updatedDataSubObj = {};
                filterRowAttributes(attributes, data[name], updatedDataSubObj);
                updatedData[name] = updatedDataSubObj;
            }
            else if (Array.isArray(data[name]) && attributes) {
                updatedData[name] = [];
                let updatedDataArrayItem;
                data[name].forEach((arrVal, index) => {
                    updatedDataArrayItem = {};
                    filterRowAttributes(attributes, arrVal, updatedDataArrayItem);
                    updatedData[name][index] = updatedDataArrayItem;
                });
            }
            else {
                _proxyAttribute(updatedData, data, name);
            }
        }
    }
    else {
        _proxyAttribute(updatedData, data, fetchAttribute);
    }
};
const _proxyAttribute = (updatedData, data, attribute) => {
    if (!updatedData || !data) {
        return;
    }
    Object.defineProperty(updatedData, attribute, {
        get() {
            return data[attribute];
        },
        set(val) {
            data[attribute] = val;
        },
        enumerable: true
    });
};
/**
 * Return an empty Set which is optimized to store keys
 */
const createOptimizedKeySet = (initialSet) => {
    return new ojSet(initialSet);
};
/**
 * Returns an empty Map which will efficiently store Keys returned by the DataProvider
 */
const createOptimizedKeyMap = (initialMap) => {
    if (initialMap) {
        const map = new ojMap();
        initialMap.forEach((value, key) => {
            map.set(key, value);
        });
        return map;
    }
    return new ojMap();
};
const createItem = (key, data) => {
    return markNoProxy({
        metadata: markNoProxy({ key }),
        data,
    });
};
const keyArrayToMetadataArray = (keys) => {
    return keys.map((key) => {
        return markNoProxy({ key });
    });
};
/**
 * Return the index of a key, or -1 if the key is not found.
 */
const indexOfKey = (searchKey, keys) => {
    let keyIndex = -1;
    let i;
    for (i = 0; i < keys.length; i++) {
        if (oj.Object.compareValues(keys[i], searchKey)) {
            keyIndex = i;
            break;
        }
    }
    return keyIndex;
};

class ArrayDataProviderImpl {
    constructor(options, implOptions) {
        var _a;
        this.options = options;
        this.implOptions = implOptions;
        this._sequenceNum = 0;
        this._mutationSequenceNum = 0;
        this._mapClientIdToIteratorInfo = new Map();
        this.AsyncIterable = (_a = class {
                constructor(_asyncIterator) {
                    this._asyncIterator = _asyncIterator;
                    this[Symbol.asyncIterator] = () => {
                        return this._asyncIterator;
                    };
                }
            },
            Symbol.asyncIterator,
            _a);
        this.AsyncIterator = class {
            constructor(_parent, _nextFunc, _params, _offset) {
                this._parent = _parent;
                this._nextFunc = _nextFunc;
                this._params = _params;
                this._offset = _offset;
                this._clientId = (_params && _params.clientId) || Symbol();
                _parent._mapClientIdToIteratorInfo.set(this._clientId, {
                    offset: _offset,
                    rowKey: null,
                    filterCriterion: _params?.filterCriterion,
                    sortCriteria: _params?.sortCriteria,
                    fetchedRowKeys: []
                });
                this._cacheObj = { mutationSequenceNum: _parent._mutationSequenceNum };
            }
            ['next']() {
                const callback = (resolve, reject) => {
                    const cachedIteratorInfo = this._parent._mapClientIdToIteratorInfo.get(this._clientId);
                    const cachedOffset = cachedIteratorInfo ? cachedIteratorInfo.offset : null;
                    const resultObj = this._nextFunc(this._params, cachedOffset, false, this._cacheObj);
                    // Add a getter for totalFilteredRowCount
                    Object.defineProperty(resultObj.result.value, 'totalFilteredRowCount', {
                        get: () => {
                            if (this._params?.includeFilteredRowCount === 'enabled') {
                                if (this._totalFilteredRowCount === undefined ||
                                    this._parent._resetTotalFilteredRowCount) {
                                    this._totalFilteredRowCount = this._parent._getTotalFilteredRowCount(this._params);
                                    this._parent._resetTotalFilteredRowCount = false;
                                }
                                return this._totalFilteredRowCount;
                            }
                        },
                        enumerable: true
                    });
                    const rowKeyArray = resultObj.result.value.metadata?.map((itemMetadata) => itemMetadata.key);
                    const fetchedRowKeys = rowKeyArray
                        ? cachedIteratorInfo?.fetchedRowKeys
                            ? cachedIteratorInfo.fetchedRowKeys.concat(rowKeyArray)
                            : rowKeyArray
                        : [];
                    const lastRowKey = fetchedRowKeys.length > 0 ? fetchedRowKeys[fetchedRowKeys.length - 1] : null;
                    this._parent._mapClientIdToIteratorInfo.set(this._clientId, {
                        offset: resultObj.offset,
                        rowKey: lastRowKey,
                        filterCriterion: this._params?.filterCriterion,
                        sortCriteria: this._params?.sortCriteria,
                        fetchedRowKeys
                    });
                    return resolve(resultObj.result);
                };
                return this._parent.implOptions.supportAbortController
                    ? wrapWithAbortHandling(this._params?.signal, callback, false)
                    : // Using the syntax below as opposed to the more straightfoward
                        // "new Promise((resolve, reject) => callback(resolve, reject))"
                        // to allow Errors to be thrown rather than being turned into Promise rejections.
                        // This avoids what would be a (subtle) change in behavior in MADP
                        callback(Promise.resolve.bind(Promise), Promise.reject.bind(Promise));
            }
        };
    }
    containsKeys(containsParameters) {
        return this.fetchByKeys(containsParameters).then((fetchByKeysResult) => {
            const results = new ojSet();
            containsParameters.keys.forEach((key) => {
                if (fetchByKeysResult.results.get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve(markNoProxy({
                containsParameters,
                results
            }));
        });
    }
    fetchByKeys(fetchParameters) {
        const callback = (resolve, reject) => {
            this.implOptions.generateKeysIfNeeded(() => this.generateKeys());
            const results = new ojMap();
            const keys = this.implOptions.getKeys();
            const fetchAttributes = fetchParameters != null ? fetchParameters.attributes : null;
            let findKeyIndex, i = 0;
            if (fetchParameters) {
                const rowData = this.implOptions.getData();
                fetchParameters.keys.forEach((searchKey) => {
                    findKeyIndex = null;
                    for (i = 0; i < keys.length; i++) {
                        if (oj.Object.compareValues(keys[i], searchKey)) {
                            findKeyIndex = i;
                            break;
                        }
                    }
                    if (findKeyIndex != null && findKeyIndex >= 0) {
                        let row = rowData[findKeyIndex];
                        if (fetchAttributes && fetchAttributes.length > 0) {
                            const updatedData = {};
                            filterRowAttributes(fetchAttributes, row, updatedData);
                            row = updatedData;
                        }
                        results.set(searchKey, createItem(searchKey, row));
                    }
                });
                return resolve(markNoProxy({
                    fetchParameters,
                    results
                }));
            }
            else {
                return reject('Keys are a required parameter');
            }
        };
        return this.implOptions.supportAbortController
            ? wrapWithAbortHandling(fetchParameters?.signal, callback, false)
            : // Using the syntax below as opposed to the more straightfoward
                // "new Promise((resolve, reject) => callback(resolve, reject))"
                // to allow Errors to be thrown rather than being turned into Promise rejections.
                // This avoids what would be a (subtle) change in behavior in MADP
                callback(Promise.resolve.bind(Promise), Promise.reject.bind(Promise));
    }
    fetchByOffset(params) {
        const callback = (resolve, reject) => {
            const size = params != null ? params.size : -1;
            const sortCriteria = params != null ? params.sortCriteria : null;
            const offset = params != null ? (params.offset > 0 ? params.offset : 0) : 0;
            const fetchAttributes = params != null ? params.attributes : null;
            const filterCriterion = params != null ? params.filterCriterion : null;
            this.implOptions.generateKeysIfNeeded(() => this.generateKeys());
            let resultsArray = [];
            let done = true;
            if (params) {
                const fetchParams = {
                    size,
                    sortCriteria,
                    filterCriterion,
                    attributes: fetchAttributes
                };
                const iteratorResults = this._fetchFrom(fetchParams, offset, true).result;
                const newParams = iteratorResults.value.fetchParameters;
                if (newParams.sortCriteria !== sortCriteria) {
                    params = { ...params, sortCriteria: newParams.sortCriteria };
                }
                const value = iteratorResults.value;
                done = iteratorResults.done;
                const data = value.data;
                const keys = value.metadata.map((value) => value.key);
                resultsArray = data.map((value, index) => {
                    return createItem(keys[index], value);
                });
                return resolve(Object.assign(markNoProxy({
                    fetchParameters: params,
                    results: resultsArray,
                    done
                }), params?.includeFilteredRowCount === 'enabled'
                    ? { totalFilteredRowCount: this._getTotalFilteredRowCount(params) }
                    : null));
            }
            else {
                return reject('Offset is a required parameter');
            }
        };
        return this.implOptions.supportAbortController
            ? wrapWithAbortHandling(params?.signal, callback, false)
            : // Using the syntax below as opposed to the more straightfoward
                // "new Promise((resolve, reject) => callback(resolve, reject))"
                // to allow Errors to be thrown rather than being turned into Promise rejections.
                // This avoids what would be a (subtle) change in behavior in MADP
                callback(Promise.resolve.bind(Promise), Promise.reject.bind(Promise));
    }
    /**
     * Fetch the first block of data
     */
    fetchFirst(params) {
        const offset = 0;
        return new this.AsyncIterable(new this.AsyncIterator(this, this._fetchFrom.bind(this), params, offset));
    }
    getTotalSize() {
        return Promise.resolve(this.implOptions.getData().length);
    }
    isEmpty() {
        return this.implOptions.getData().length > 0 ? 'no' : 'yes';
    }
    _getTotalFilteredRowCount(params) {
        const rowData = this.implOptions.getData();
        const filterDef = params ? params.filterCriterion : null;
        let totalFilteredRowCount = -1;
        if (filterDef) {
            totalFilteredRowCount = 0;
            // Always call getFilter to get a Filter instance, so any ArrayDataProvider options such as textFilterAttributes will work.
            // This effectively ignore any "filter" property passed in filterCriterion.
            let filterCriterion = FilterFactory.getFilter({
                filterDef: filterDef,
                filterOptions: this.options
            });
            for (let i = 0; i < rowData.length; i++) {
                if (filterCriterion.filter(rowData[i])) {
                    ++totalFilteredRowCount;
                }
            }
        }
        else {
            totalFilteredRowCount = rowData.length;
        }
        return totalFilteredRowCount;
    }
    /**
     * Get id value for row
     */
    getId(row) {
        let id;
        const keyAttributes = this.options?.keyAttributes;
        const enforceKeyStringify = this.options?.enforceKeyStringify;
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                let i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
                    id[i] = getVal(row, keyAttributes[i]);
                }
            }
            else if (keyAttributes === '@value') {
                id = getAllVals(row);
            }
            else {
                id = getVal(row, keyAttributes);
            }
            if (enforceKeyStringify === 'on') {
                return JSON.stringify(id);
            }
            return id;
        }
        else {
            return null;
        }
    }
    generateKeys() {
        const keyAttributes = this.options?.keyAttributes;
        const enforceKeyStringify = this.options?.enforceKeyStringify;
        const keys = [];
        const rowData = this.implOptions.getData();
        for (let i = 0; i < rowData.length; i++) {
            let id = this.getId(rowData[i]);
            if (id == null || keyAttributes === '@index') {
                id =
                    enforceKeyStringify === 'on' ? JSON.stringify(this._sequenceNum++) : this._sequenceNum++;
            }
            keys.push(id);
        }
        return keys;
    }
    /**
     * Fetch from offset
     */
    _fetchFrom(params, offset, useHasMore, cacheObj) {
        const fetchAttributes = params != null ? params.attributes : null;
        this.implOptions.generateKeysIfNeeded(() => this.generateKeys());
        const sortCriteria = params != null ? params.sortCriteria : null;
        const indexMap = this._getCachedIndexMap(sortCriteria, cacheObj);
        const rowData = this.implOptions.getData();
        const keys = this.implOptions.getKeys();
        const mappedData = indexMap.map((index) => {
            const row = rowData[index];
            return row;
        });
        const mappedKeys = indexMap.map((index) => {
            return keys[index];
        });
        const fetchSize = params != null ? (params.size > 0 ? params.size : params.size < 0 ? keys.length : 25) : 25;
        let hasMore = offset + fetchSize < mappedData.length;
        const mergedSortCriteria = this.implOptions.mergeSortCriteria(sortCriteria);
        if (mergedSortCriteria != null) {
            params = { ...params, sortCriteria: mergedSortCriteria };
        }
        let resultData = [];
        let resultKeys = [];
        let updatedOffset = 0;
        let filteredResultData;
        if (params != null && params.filterCriterion) {
            let filterCriterion = null;
            // Always call getFilter to get a Filter instance, so any constructor options such as textFilterAttributes will work.
            // This effectively ignore any "filter" property passed in filterCriterion.
            filterCriterion = FilterFactory.getFilter({
                filterDef: params.filterCriterion,
                filterOptions: this.options
            });
            let i = 0;
            while (resultData.length < fetchSize && i < mappedData.length) {
                if (filterCriterion.filter(mappedData[i])) {
                    // updatedOffset is the post-filtered offset
                    if (updatedOffset >= offset) {
                        resultData.push(mappedData[i]);
                        resultKeys.push(mappedKeys[i]);
                    }
                    updatedOffset++;
                }
                i++;
            }
            hasMore = i < mappedData.length;
        }
        else {
            resultData = mappedData.slice(offset, offset + fetchSize);
            resultKeys = mappedKeys.slice(offset, offset + fetchSize);
        }
        updatedOffset = offset + resultData.length;
        filteredResultData = resultData.map((row) => {
            if (fetchAttributes && fetchAttributes.length > 0) {
                const updatedData = {};
                filterRowAttributes(fetchAttributes, row, updatedData);
                row = updatedData;
            }
            return row;
        });
        const resultMetadata = keyArrayToMetadataArray(resultKeys);
        const result = markNoProxy({
            fetchParameters: params,
            data: filteredResultData,
            metadata: resultMetadata
        });
        const done = !(useHasMore ? hasMore : result.data.length > 0);
        return {
            result: markNoProxy({
                value: result,
                done
            }),
            offset: updatedOffset
        };
    }
    /**
     * Get cached index map
     */
    _getCachedIndexMap(sortCriteria, cacheObj) {
        if (cacheObj &&
            cacheObj['indexMap'] &&
            cacheObj['mutationSequenceNum'] === this._mutationSequenceNum) {
            return cacheObj['indexMap'];
        }
        const dataIndexes = this.implOptions.getData().map((value, index) => {
            return index;
        });
        const indexMap = this._sortData(dataIndexes, sortCriteria);
        if (cacheObj) {
            cacheObj['indexMap'] = indexMap;
            cacheObj['mutationSequenceNum'] = this._mutationSequenceNum;
        }
        return indexMap;
    }
    /**
     * Sort data
     */
    _sortData(indexMap, sortCriteria) {
        const rowData = this.implOptions.getData();
        const indexedData = indexMap.map((index) => {
            return { index: index, value: rowData[index] };
        });
        if (sortCriteria != null) {
            indexedData.sort(this.implOptions.getSortComparator(sortCriteria));
        }
        return indexedData.map((item) => {
            return item.index;
        });
    }
    queueMutationEvent(changes) {
        this._mutationEvent = this._createMutationEvent(changes);
    }
    flushQueue() {
        this.implOptions.dispatchEvent(this._mutationEvent ?? new DataProviderRefreshEvent());
        this._mutationEvent = null;
    }
    _createMutationEvent(changes) {
        let i, j, id, index, status, dataArray = [], keyArray = [], indexArray = [];
        const afterKeyArray = [];
        let addCount = 0;
        let deleteCount = 0;
        this._mutationSequenceNum++;
        // first check if we only have adds or only have deletes
        let onlyAdds = true;
        let onlyDeletes = true;
        this._resetTotalFilteredRowCount = true;
        changes.forEach((change) => {
            if (change['status'] === 'deleted') {
                onlyAdds = false;
                ++deleteCount;
            }
            else if (change['status'] === 'added') {
                onlyDeletes = false;
                ++addCount;
            }
        });
        const updatedIndexes = [];
        const removeDuplicate = [];
        let operationUpdateEventDetail = null;
        let operationAddEventDetail = null;
        let operationRemoveEventDetail = null;
        const generatedKeys = this.implOptions.generateKeysIfNeeded(() => this.generateKeys());
        if (!onlyAdds && !onlyDeletes) {
            // squash deletes and adds into updates
            for (i = 0; i < changes.length; i++) {
                index = changes[i].index;
                status = changes[i].status;
                const iKey = this.getId(changes[i].value);
                for (j = 0; j < changes.length; j++) {
                    if (j !== i &&
                        index === changes[j].index &&
                        status !== changes[j]['status'] &&
                        updatedIndexes.indexOf(i) < 0 &&
                        removeDuplicate.indexOf(i) < 0) {
                        // Squash delete and add only if they have the same index and either no key or same key
                        if (iKey == null || oj.Object.compareValues(iKey, this.getId(changes[j].value))) {
                            if (status === 'deleted') {
                                removeDuplicate.push(i);
                                updatedIndexes.push(j);
                            }
                            else {
                                removeDuplicate.push(j);
                                updatedIndexes.push(i);
                            }
                        }
                    }
                }
            }
            for (i = 0; i < changes.length; i++) {
                if (updatedIndexes.indexOf(i) >= 0) {
                    const key = this.implOptions.getKeys()[changes[i].index];
                    // By this time, updatedIndexes contains indexes of "added" entries in "changes" array that
                    // have matching "deleted" entries with same keys, which should be the same as the old keys.
                    keyArray.push(key);
                    dataArray.push(changes[i].value);
                    indexArray.push(changes[i].index);
                }
            }
            if (keyArray.length > 0) {
                operationUpdateEventDetail = markNoProxy({
                    keys: new ojSet(keyArray),
                    metadata: keyArrayToMetadataArray(keyArray),
                    data: dataArray,
                    indexes: indexArray
                });
            }
        }
        dataArray = [];
        keyArray = [];
        indexArray = [];
        if (!onlyAdds) {
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'deleted' &&
                    updatedIndexes.indexOf(i) < 0 &&
                    removeDuplicate.indexOf(i) < 0) {
                    id = this.implOptions.getKeyForDelete(changes[i], generatedKeys);
                    keyArray.push(id);
                    dataArray.push(changes[i].value);
                    indexArray.push(changes[i].index);
                }
            }
            if (keyArray.length > 0) {
                keyArray.forEach((key) => {
                    const keyIndex = indexOfKey(key, this.implOptions.getKeys());
                    if (keyIndex >= 0) {
                        this.implOptions.spliceKeys(keyIndex, 1);
                    }
                });
            }
            if (keyArray.length > 0) {
                operationRemoveEventDetail = markNoProxy({
                    keys: new ojSet(keyArray),
                    metadata: keyArrayToMetadataArray(keyArray),
                    data: dataArray,
                    indexes: indexArray
                });
            }
        }
        dataArray = [];
        keyArray = [];
        indexArray = [];
        if (!onlyDeletes) {
            const isInitiallyEmpty = this.implOptions.getKeys() != null
                ? this.implOptions.getKeys().length > 0
                    ? false
                    : true
                : true;
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'added' &&
                    updatedIndexes.indexOf(i) < 0 &&
                    removeDuplicate.indexOf(i) < 0) {
                    id = this.getId(changes[i].value);
                    if (id == null && (generatedKeys || this.implOptions.keysSpecified)) {
                        id = this.implOptions.getKeys()[changes[i].index];
                    }
                    if (id == null) {
                        id = this._sequenceNum++;
                        this.implOptions.spliceKeys(changes[i].index, 0, id);
                    }
                    else if (isInitiallyEmpty || indexOfKey(id, this.implOptions.getKeys()) === -1) {
                        this.implOptions.spliceKeys(changes[i].index, 0, id);
                    }
                    else if (!generatedKeys && !this.implOptions.keysSpecified) {
                        // If we get here, we have a duplicate key because the id is found in the _keys array,
                        // and it was neither just generated nor specified in the keys options.
                        // In this case we log a warning but should add the key to the _keys array to keep
                        // it in sync with the data array.  It is up to the app to ensure key uniqueness.
                        warn('added row has duplicate key ' + id);
                        this.implOptions.spliceKeys(changes[i].index, 0, id);
                    }
                    keyArray.push(id);
                    dataArray.push(changes[i].value);
                    indexArray.push(changes[i].index);
                }
            }
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'added' &&
                    updatedIndexes.indexOf(i) < 0 &&
                    removeDuplicate.indexOf(i) < 0) {
                    // afterKeys can only be calculated after all keys
                    // have been added to the internal keys cache
                    let afterKey = this.implOptions.getKeys()[changes[i].index + 1];
                    afterKey = afterKey == null ? null : afterKey;
                    afterKeyArray.push(afterKey);
                }
            }
            if (keyArray.length > 0) {
                operationAddEventDetail = markNoProxy({
                    keys: new ojSet(keyArray),
                    afterKeys: new ojSet(afterKeyArray),
                    addBeforeKeys: afterKeyArray,
                    metadata: keyArrayToMetadataArray(keyArray),
                    data: dataArray,
                    indexes: indexArray
                });
            }
        }
        // Adjust the last offset for iterators before firing event
        this._adjustIteratorOffset(operationRemoveEventDetail, operationAddEventDetail);
        return new DataProviderMutationEvent(markNoProxy({
            add: operationAddEventDetail,
            remove: operationRemoveEventDetail,
            update: operationUpdateEventDetail
        }));
    }
    resetTotalFilteredRowCount() {
        this._resetTotalFilteredRowCount = true;
    }
    /**
     * Adjust the last offset for iterators.
     */
    _adjustIteratorOffset(removeArray, addArray) {
        const removeIndexes = removeArray?.indexes;
        const addIndexes = addArray?.indexes.slice(0);
        this._mapClientIdToIteratorInfo.forEach((iteratorInfo, clientId) => {
            if (iteratorInfo.offset > 0) {
                const filterCriterion = iteratorInfo.filterCriterion;
                const sortCriteria = iteratorInfo.sortCriteria;
                const sortComparator = sortCriteria
                    ? this.implOptions.getSortComparator(sortCriteria)
                    : null;
                if (removeIndexes) {
                    removeIndexes.forEach((rowIndex, index) => {
                        const rowKey = Array.from(removeArray.keys)[index];
                        const fetchedRowIndex = indexOfKey(rowKey, iteratorInfo.fetchedRowKeys);
                        if (fetchedRowIndex > -1) {
                            --iteratorInfo.offset;
                            iteratorInfo.fetchedRowKeys.splice(fetchedRowIndex, 1);
                        }
                    });
                    iteratorInfo.rowKey = iteratorInfo.fetchedRowKeys[iteratorInfo.fetchedRowKeys.length - 1];
                }
                if (addIndexes) {
                    const addData = addArray.data.slice(0);
                    const addKeys = Array.from(addArray.keys);
                    // ignore all filtered items
                    if (filterCriterion?.filter != null) {
                        for (let i = addIndexes.length - 1; i >= 0; i--) {
                            let data = addData[i];
                            if (data != null && filterCriterion.filter(data)) {
                                addIndexes.splice(i, 1);
                                addData.splice(i, 1);
                                addKeys.splice(i, 1);
                            }
                        }
                    }
                    if (sortComparator != null) {
                        // if sorted add all keys to array, sort array, and remove keys after last key
                        const newArray = [...iteratorInfo.fetchedRowKeys, ...addKeys];
                        const allData = this.implOptions.getData();
                        // We can use a plain map here instead of ojMap because the
                        // addKeys === _getKeys when this is called today
                        const indexOfKeyMap = new Map();
                        this.implOptions.getKeys().forEach((key, index) => {
                            indexOfKeyMap.set(key, index);
                        });
                        newArray.sort((key1, key2) => {
                            const key1Data = allData[indexOfKeyMap.get(key1)];
                            const key2Data = allData[indexOfKeyMap.get(key2)];
                            return sortComparator({ value: key1Data }, { value: key2Data });
                        });
                        iteratorInfo.fetchedRowKeys = newArray.slice(0, indexOfKey(iteratorInfo.rowKey, newArray) + 1);
                        iteratorInfo.offset = iteratorInfo.fetchedRowKeys.length;
                    }
                    else {
                        // if unsorted add data to position in add event if it's in range
                        addIndexes.forEach((rowIndex, index) => {
                            const rowKey = addKeys[index];
                            const lastFetchedRowIndex = indexOfKey(iteratorInfo.rowKey, this.implOptions.getKeys());
                            if (rowIndex < lastFetchedRowIndex) {
                                ++iteratorInfo.offset;
                                const fetchedRowIndex = indexOfKey(rowKey, iteratorInfo.fetchedRowKeys);
                                if (fetchedRowIndex < 0) {
                                    iteratorInfo.fetchedRowKeys.splice(rowIndex, 0, rowKey);
                                }
                            }
                        });
                    }
                }
                this._mapClientIdToIteratorInfo.set(clientId, iteratorInfo);
            }
        });
    }
}

export { ArrayDataProviderImpl, createOptimizedKeyMap, createOptimizedKeySet, getCapability, getVal };
