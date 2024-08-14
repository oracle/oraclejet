/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { DataGridProviderUpdateEvent, DataGridProviderRefreshEvent, DataGridProviderRemoveEvent, DataGridProviderAddEvent } from 'ojs/ojdatagridprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import { doesAttributeExistInFilterCriterion, getAddEventKeysResult } from 'ojs/ojdatacollection-common';

class RowDataGridProvider {
    constructor(dataProvider, options) {
        this.dataProvider = dataProvider;
        this.options = options;
        this.version = 0;
        this.keyCache = [];
        this.lastRowKeyCached = false;
        this.GridItem = class {
            constructor(metadata, data) {
                this.metadata = metadata;
                this.data = data;
            }
        };
        this.GridBodyItem = class {
            constructor(rowExtent, columnExtent, rowIndex, columnIndex, metadata, data) {
                this.rowExtent = rowExtent;
                this.columnExtent = columnExtent;
                this.rowIndex = rowIndex;
                this.columnIndex = columnIndex;
                this.metadata = metadata;
                this.data = data;
            }
        };
        this.GridHeaderItem = class {
            constructor(index, extent, level, depth, metadata, data) {
                this.index = index;
                this.extent = extent;
                this.level = level;
                this.depth = depth;
                this.metadata = metadata;
                this.data = data;
            }
        };
        this.GridHeaderMetadata = class {
            constructor(sortDirection, filter, expanded, treeDepth, showRequired) {
                this.sortDirection = sortDirection;
                this.filter = filter;
                this.expanded = expanded;
                this.treeDepth = treeDepth;
                this.showRequired = showRequired;
            }
        };
        this.FetchByOffsetGridResults = class {
            constructor(fetchParameters, rowDone, columnDone, rowOffset, columnOffset, rowCount, columnCount, totalRowCount, totalColumnCount, results, version, next) {
                this.fetchParameters = fetchParameters;
                this.rowDone = rowDone;
                this.columnDone = columnDone;
                this.rowOffset = rowOffset;
                this.columnOffset = columnOffset;
                this.rowCount = rowCount;
                this.columnCount = columnCount;
                this.totalRowCount = totalRowCount;
                this.totalColumnCount = totalColumnCount;
                this.results = results;
                this.version = version;
                this.next = next;
            }
        };
        this.sortable = options?.sortable;
        this.sortCriteria = null;
        this.filterable = options?.filterable;
        this.filterCriteria = null;
        this.supportsFilteredRowCount =
            dataProvider.getCapability('fetchFirst')?.totalFilteredRowCount === 'exact';
        if (options?.expandedObservable) {
            const expandedObservable = options?.expandedObservable.subscribe((value) => {
                this.expandedState = value.value;
            });
        }
        dataProvider.addEventListener('mutate', this._handleUnderlyingMutation.bind(this));
        dataProvider.addEventListener('refresh', this._handleUnderlyingRefresh.bind(this));
        if (options?.itemMetadata) {
            this.itemMetadata = options?.itemMetadata;
        }
    }
    async fetchByOffset(parameters) {
        const rowOffset = parameters.rowOffset;
        let rowCount = parameters.rowCount;
        let fetchResult = { results: [], done: false, fetchParameters: null };
        if (rowCount != 0) {
            fetchResult = await this.dataProvider.fetchByOffset({ offset: rowOffset, size: rowCount });
        }
        let totalSize = -1;
        let sameFetchParameters = this.isSameFetchParameters(fetchResult.fetchParameters);
        if (!sameFetchParameters || this.totalRowCount == null) {
            if (this.supportsFilteredRowCount) {
                let fetchFirstResult = await this.dataProvider
                    .fetchFirst({ size: 1, includeFilteredRowCount: 'enabled' })[Symbol.asyncIterator]()
                    .next();
                if (fetchFirstResult.value.totalFilteredRowCount != null) {
                    totalSize = fetchFirstResult.value.totalFilteredRowCount;
                }
            }
            else if (this.isUnfiltered(fetchResult.fetchParameters)) {
                totalSize = await this.dataProvider.getTotalSize();
            }
            this.totalRowCount = totalSize;
        }
        this.updateKeyCache(fetchResult, rowOffset);
        this.setupLayout(fetchResult.results);
        this.sortCriteria = fetchResult.fetchParameters?.sortCriteria;
        this.filterCriteria = fetchResult.fetchParameters?.filterCriterion;
        const columnOffset = parameters.columnOffset;
        const columnDone = columnOffset + parameters.columnCount >= this.columns.databody.length;
        const columnCount = Math.max(Math.min(parameters.columnCount, this.columns.databody.length - columnOffset), 0);
        rowCount = Math.min(parameters.rowCount, fetchResult.results.length);
        const rowDone = fetchResult.done;
        this.lastRowKeyCached = fetchResult.done;
        const version = this.version;
        const requestSet = parameters.fetchRegions;
        const isAll = requestSet == null || requestSet.has('all');
        const requestDatabody = isAll || requestSet?.has('databody');
        const requestRowHeader = isAll || requestSet?.has('rowHeader');
        const requestColumnHeader = isAll || requestSet?.has('columnHeader');
        const requestRowEndHeader = isAll || requestSet?.has('rowEndHeader');
        const requestColumnEndHeader = isAll || requestSet?.has('columnEndHeader');
        const requestRowHeaderLabel = isAll || requestSet?.has('rowHeaderLabel');
        const requestColumnHeaderLabel = isAll || requestSet?.has('columnHeaderLabel');
        const requestRowEndHeaderLabel = isAll || requestSet?.has('rowEndHeaderLabel');
        const requestColumnEndHeaderLabel = isAll || requestSet?.has('columnEndHeaderLabel');
        const databody = requestDatabody
            ? this.getDatabodyResults(fetchResult.results, rowOffset, rowCount, columnOffset, columnCount)
            : undefined;
        const rowHeader = requestRowHeader
            ? this.getRowHeaderResults('rowHeader', fetchResult.results, rowOffset, rowCount)
            : undefined;
        const rowEndHeader = requestRowEndHeader
            ? this.getRowHeaderResults('rowEndHeader', fetchResult.results, rowOffset, rowCount)
            : undefined;
        const columnHeader = requestColumnHeader
            ? this.getColumnHeaderResults('column', columnOffset, columnCount)
            : undefined;
        const columnEndHeader = requestColumnEndHeader
            ? this.getColumnHeaderResults('columnEnd', columnOffset, columnCount)
            : undefined;
        const rowHeaderLabel = requestRowHeaderLabel ? this.getRowHeaderLabelResults() : undefined;
        const rowEndHeaderLabel = requestRowEndHeaderLabel
            ? this.getRowEndHeaderLabelResults()
            : undefined;
        const columnHeaderLabel = requestColumnHeaderLabel
            ? this.getColumnHeaderLabelResults('column')
            : undefined;
        const columnEndHeaderLabel = requestColumnEndHeaderLabel
            ? this.getColumnHeaderLabelResults('columnEnd')
            : undefined;
        const next = null;
        const results = {
            databody: databody,
            columnHeader: columnHeader,
            columnHeaderLabel: columnHeaderLabel,
            columnEndHeader: columnEndHeader,
            columnEndHeaderLabel: columnEndHeaderLabel,
            rowHeader: rowHeader,
            rowHeaderLabel: rowHeaderLabel,
            rowEndHeader: rowEndHeader,
            rowEndHeaderLabel: rowEndHeaderLabel
        };
        return new this.FetchByOffsetGridResults(parameters, rowDone, columnDone, rowOffset, columnOffset, rowCount, columnCount, this.totalRowCount, this.columns.databody.length, results, version, next);
    }
    updateKeyCache(fetchResult, rowOffset) {
        let fetchParameters = fetchResult.fetchParameters;
        if (!this.isSameFetchParameters(fetchParameters)) {
            this._clearKeyCache();
        }
        this.currentFetchParameters = fetchParameters;
        let results = fetchResult.results;
        results.forEach((item, resultIndex) => {
            this.keyCache[rowOffset + resultIndex] = item.metadata.key;
        });
    }
    _clearKeyCache() {
        this.keyCache = [];
    }
    isKeyCacheSparse() {
        for (let i = 0; i < this.keyCache.length; i++) {
            if (this.keyCache[i] === undefined) {
                return true;
            }
        }
        return false;
    }
    isSameFetchParameters(fetchParameters) {
        let sortCriterion = fetchParameters?.sortCriteria;
        let filterCriterion = fetchParameters?.filterCriterion;
        let currentSortCriterion = this.currentFetchParameters?.sortCriteria;
        let currentFilterCriterion = this.currentFetchParameters?.filterCriterion;
        if (!oj.Object.compareValues(sortCriterion, currentSortCriterion)) {
            return false;
        }
        if (!oj.Object.compareValues(filterCriterion, currentFilterCriterion)) {
            return false;
        }
        return true;
    }
    isUnfiltered(fetchParameters) {
        return fetchParameters == null || fetchParameters.filterCriterion == null;
    }
    setupLayout(results) {
        this.setupColumns(results);
        this.setupColumnHeaders();
        this.setupHeaderLabels();
    }
    setupColumns(results) {
        if (this.columns == null) {
            this.columns = {};
            const firstResult = results[0];
            this.columns.rowHeader = this.getFromOptions(this.options?.columns?.rowHeader, firstResult);
            this.columns.rowEndHeader = this.getFromOptions(this.options?.columns?.rowEndHeader, firstResult);
            if (this.options?.columns?.databody) {
                let databody = this.options.columns.databody;
                if (typeof databody === 'function') {
                    this.columns.databody = databody(firstResult);
                }
                else {
                    this.columns.databody = databody;
                }
            }
            else if (firstResult == null) {
                this.columns.databody = [];
            }
            else {
                const dataKeys = Object.keys(firstResult.data);
                this.columns.databody = dataKeys.filter((key) => !this.columns.rowHeader?.includes(key) && !this.columns.rowEndHeader?.includes(key));
            }
        }
    }
    setupColumnHeaders() {
        if (this.columnHeaders == null) {
            this.columnHeaders = {};
            const unparsedColumnHeaders = this.getFromOptions(this.options?.columnHeaders?.column, this.columns?.databody, this.columns?.databody, (data) => {
                return { data };
            });
            this.columnHeaders.column = this.parseNestedHeaders(unparsedColumnHeaders);
            const unparsedColumnEndHeaders = this.getFromOptions(this.options?.columnHeaders?.columnEnd, this.columns?.databody, this.columns?.databody, (data) => {
                return { data };
            });
            this.columnHeaders.columnEnd = this.parseNestedHeaders(unparsedColumnEndHeaders);
        }
    }
    setupHeaderLabels() {
        if (this.headerLabels == null) {
            this.headerLabels = {};
            this.headerLabels.row = this.getFromOptions(this.options?.headerLabels?.row, this.columns?.rowHeader, this.columns?.rowHeader, (data) => {
                return data;
            });
            this.headerLabels.rowEnd = this.getFromOptions(this.options?.headerLabels?.rowEnd, this.columns?.rowEndHeader, this.columns?.rowEndHeader, (data) => {
                return data;
            });
            this.headerLabels.column = this.getFromOptions(this.options?.headerLabels?.column, this.columnHeaders?.column?.headerArray);
            this.headerLabels.columnEnd = this.getFromOptions(this.options?.headerLabels?.columnEnd, this.columnHeaders?.columnEnd?.headerArray);
        }
    }
    getFromOptions(option, callbackParams, mapFrom, mapFromFunction) {
        if (option == null) {
            return;
        }
        else if (typeof option === 'function') {
            return option(callbackParams);
        }
        else if (mapFrom && option === 'attributeName') {
            return mapFrom.map(mapFromFunction);
        }
        return option;
    }
    parseNestedHeaders(nestedHeaders) {
        if (nestedHeaders == null) {
            return;
        }
        if (typeof nestedHeaders[0] === 'string') {
            nestedHeaders = nestedHeaders.map((data) => {
                return { data };
            });
        }
        let headerArray = [];
        let levelCount = 1;
        const traverseHeaders = (headers, index, level) => {
            let extentAtLevel = 0;
            headers.forEach((header) => {
                let depth = header.depth || 1;
                let extent = 1;
                if (header.children) {
                    extent = traverseHeaders(header.children, index, level + depth);
                }
                let returnHeader = {
                    index,
                    extent,
                    level,
                    depth,
                    data: header.data
                };
                headerArray.push(returnHeader);
                levelCount = Math.max(levelCount, level + 1);
                extentAtLevel += extent;
                index += extent;
            });
            return extentAtLevel;
        };
        traverseHeaders(nestedHeaders, 0, 0);
        return { headerArray, levelCount };
    }
    getCapability(capabilityName) {
        if (capabilityName === 'version') {
            return 'monotonicallyIncreasing';
        }
        return null;
    }
    isEmpty() {
        return 'unknown';
    }
    setDataProvider(dataProvider) {
        this.dataProvider = dataProvider;
    }
    updateItemMetadata(ranges) {
        let updateEventDetail = {
            ranges: ranges,
            version: this.version
        };
        this.dispatchEvent(new DataGridProviderUpdateEvent(updateEventDetail));
    }
    getDatabodyResults(data, rowStart, rowCount, columnStart, columnCount) {
        if (data?.length > 0) {
            const databody = [];
            for (let i = 0; i < rowCount; i++) {
                const rowItem = data[i];
                for (let j = 0; j < columnCount; j++) {
                    const columnKey = this.columns.databody[columnStart + j];
                    const value = { data: rowItem.data[columnKey] };
                    let metadata = { rowItem };
                    const item = new this.GridBodyItem(1, 1, rowStart + i, columnStart + j, metadata, value);
                    if (this.itemMetadata && typeof this.itemMetadata.databody === 'function') {
                        let itemMetadata = this.itemMetadata.databody(item);
                        if (itemMetadata) {
                            Object.assign(item.metadata, itemMetadata);
                        }
                    }
                    databody.push(item);
                }
            }
            return databody;
        }
    }
    getRowHeaderResults(axis, data, offset, count) {
        const keys = this.columns[axis];
        if (data?.length > 0 && keys?.length > 0) {
            const headers = [];
            for (let j = keys.length - 1; j >= 0; j--) {
                const headerField = keys[j];
                for (let i = 0; i < count; i++) {
                    const index = offset + i;
                    const rowItem = data[i];
                    const value = { data: rowItem.data[headerField] };
                    let treeDepth = rowItem.metadata.treeDepth;
                    let expanded;
                    if (this.expandedState && rowItem.metadata.isLeaf === false) {
                        expanded = this.expandedState.has(rowItem.metadata.key) ? 'expanded' : 'collapsed';
                    }
                    const metadata = { rowItem, expanded, treeDepth };
                    const item = new this.GridHeaderItem(index, 1, j, 1, metadata, value);
                    if (this.itemMetadata?.rowHeader != null) {
                        Object.assign(metadata, this.itemMetadata.rowHeader(item));
                    }
                    headers.push(item);
                }
            }
            return headers;
        }
    }
    getSortState(index, axis) {
        let sortAttribute;
        if (axis === 'column') {
            sortAttribute = this.columns.databody[index];
        }
        else {
            sortAttribute = this.headerLabels[axis][index];
        }
        if (this.sortCriteria && this.sortCriteria.length > 0 && sortAttribute) {
            let criterion = this.sortCriteria[0];
            if (criterion.attribute === sortAttribute) {
                return criterion.direction;
            }
        }
        return 'unsorted';
    }
    getFilterState(index, axis) {
        let filterAttribute;
        if (axis === 'column') {
            filterAttribute = this.columns.databody[index];
        }
        else {
            filterAttribute = this.headerLabels[axis][index];
        }
        if (this.filterCriteria && filterAttribute) {
            if (doesAttributeExistInFilterCriterion(filterAttribute, this.filterCriteria)) {
                return 'filtered';
            }
        }
        return 'filterable';
    }
    getColumnHeaderResults(axis, offset, count) {
        if (this.columnHeaders?.[axis]) {
            const headers = [];
            const tempArray = [];
            const levelCount = this.columnHeaders[axis].levelCount;
            for (let i = 0; i < count; i++) {
                const index = offset + i;
                for (let level = 0; level < levelCount; level++) {
                    if (tempArray[index]?.[level]) {
                        continue;
                    }
                    const columnHeader = this.getColumnHeaderItem(index, level, this.columnHeaders[axis].headerArray);
                    const data = { data: columnHeader.data };
                    const startIndex = columnHeader.index;
                    const extent = columnHeader.extent;
                    const startLevel = columnHeader.level;
                    const depth = columnHeader.depth;
                    let metadata;
                    let sortState;
                    let filterState;
                    const metadataCallback = this.itemMetadata?.columnHeader;
                    if (axis === 'column' && level + depth === levelCount) {
                        if (this.sortable || (metadataCallback != null && this.sortCriteria?.length)) {
                            sortState = this.getSortState(startIndex, axis);
                        }
                        if (this.filterable || this.filterCriteria) {
                            filterState = this.getFilterState(startIndex, axis);
                        }
                        metadata = new this.GridHeaderMetadata(sortState, filterState);
                    }
                    else {
                        metadata = {};
                    }
                    const item = new this.GridHeaderItem(startIndex, extent, startLevel, depth, metadata, data);
                    if (axis === 'column' && metadataCallback != null) {
                        Object.assign(metadata, metadataCallback(item));
                    }
                    headers.push(item);
                    for (let k = startIndex; k < startIndex + extent; k++) {
                        if (tempArray[k] == null) {
                            tempArray[k] = [];
                        }
                        for (let l = level; l < level + depth; l++) {
                            tempArray[k][l] = true;
                        }
                    }
                }
            }
            return headers;
        }
    }
    getColumnHeaderItem(index, level, headerArray) {
        return headerArray.find((item) => {
            let itemIndex = item.index;
            let itemExtent = item.extent;
            let itemLevel = item.level;
            let itemDepth = item.depth;
            if (index >= itemIndex &&
                index < itemIndex + itemExtent &&
                level >= itemLevel &&
                level < itemLevel + itemDepth) {
                return true;
            }
            return false;
        });
    }
    getRowHeaderLabelResults() {
        let iterArray;
        if (this.headerLabels?.row === 'attributeName') {
            iterArray = this.columns.rowHeader;
        }
        else if (this.headerLabels?.row) {
            iterArray = this.headerLabels.row;
        }
        if (iterArray) {
            let returnVal = [];
            for (let i = this.headerLabels['row'].length - 1; i >= 0; i--) {
                let sortDirection;
                if (this.sortable || this.sortCriteria?.length) {
                    sortDirection = this.getSortState(i, 'row');
                }
                let metadata = { sortDirection };
                const item = new this.GridItem(metadata, {
                    data: this.headerLabels['row'][i]
                });
                if (this.itemMetadata?.rowHeaderLabel != null) {
                    Object.assign(item.metadata, this.itemMetadata.rowHeaderLabel(item));
                }
                returnVal.push(item);
            }
            return returnVal;
        }
    }
    getRowEndHeaderLabelResults() {
        let iterArray;
        if (this.headerLabels?.rowEnd === 'attributeName') {
            iterArray = this.columns.rowEndHeader;
        }
        else if (this.headerLabels?.rowEnd) {
            iterArray = this.headerLabels.rowEnd;
        }
        if (iterArray) {
            let returnVal = [];
            for (let i = this.headerLabels['rowEnd'].length - 1; i >= 0; i--) {
                let sortDirection;
                if (this.sortable || this.sortCriteria?.length) {
                    sortDirection = this.getSortState(i, 'rowEnd');
                }
                let metadata = { sortDirection };
                const item = new this.GridItem(metadata, {
                    data: this.headerLabels['rowEnd'][i]
                });
                if (this.itemMetadata?.rowEndHeaderLabel != null) {
                    Object.assign(item.metadata, this.itemMetadata.rowEndHeaderLabel(item));
                }
                returnVal.push(item);
            }
            return returnVal;
        }
    }
    getColumnHeaderLabelResults(axis) {
        if (this.headerLabels?.[axis]) {
            let returnVal = [];
            for (let i = this.headerLabels[axis].length - 1; i >= 0; i--) {
                let sortDirection;
                if (this.sortable) {
                    sortDirection = this.getSortState(i, 'row');
                }
                let metadata = { sortDirection };
                const item = new this.GridItem(metadata, { data: this.headerLabels[axis][i] });
                if (axis === 'column' && this.itemMetadata?.columnHeaderLabel != null) {
                    Object.assign(item.metadata, this.itemMetadata.columnHeaderLabel(item));
                }
                else if (axis === 'columnEnd' && this.itemMetadata?.columnEndHeaderLabel != null) {
                    Object.assign(item.metadata, this.itemMetadata.columnEndHeaderLabel(item));
                }
                returnVal.push(item);
            }
            return returnVal;
        }
    }
    _handleUnderlyingMutation(event) {
        this.version++;
        let detail = event.detail;
        let needsRefresh = false;
        let removeEventDetail;
        let updateEventDetail;
        let addEventDetail;
        let removeItems;
        let isSparse = this.isKeyCacheSparse();
        let allLoaded = this.lastRowKeyCached && !isSparse;
        if (detail.remove && detail.remove.keys.size > 0) {
            [needsRefresh, removeEventDetail, removeItems] = this._convertEventDetail(detail.remove, 'remove', isSparse);
        }
        removeItems
            ?.sort((a, b) => {
            return b.index - a.index;
        })
            .forEach((item) => {
            this.keyCache.splice(item.index, 1);
            if (this.totalRowCount !== -1) {
                this.totalRowCount -= 1;
            }
        });
        if (!needsRefresh && detail.add && detail.add.keys.size > 0) {
            let finalKeys = getAddEventKeysResult(this.keyCache, detail.add, allLoaded);
            needsRefresh = isSparse && finalKeys.length !== this.keyCache.length + detail.add.keys.size;
            if (!needsRefresh) {
                let ranges = [];
                detail.add.keys.forEach((key) => {
                    let index = finalKeys.indexOf(key);
                    let range = ranges.find((r) => {
                        return index === r.offset + r.count;
                    });
                    if (range) {
                        range.count += 1;
                    }
                    else {
                        ranges.push({ offset: index, count: 1 });
                    }
                    if (this.totalRowCount !== -1) {
                        this.totalRowCount += 1;
                    }
                });
                addEventDetail = { axis: 'row', ranges, version: this.version };
                this.keyCache = finalKeys;
            }
        }
        if (!needsRefresh && detail.update && detail.update.keys.size > 0) {
            [needsRefresh, updateEventDetail] = this._convertEventDetail(detail.update, 'update', isSparse);
        }
        if (needsRefresh) {
            this.resetInternal();
            this.dispatchEvent(new DataGridProviderRefreshEvent());
        }
        else {
            if (removeEventDetail) {
                this.dispatchEvent(new DataGridProviderRemoveEvent(removeEventDetail));
            }
            if (addEventDetail) {
                this.dispatchEvent(new DataGridProviderAddEvent(addEventDetail));
            }
            if (updateEventDetail) {
                this.dispatchEvent(new DataGridProviderUpdateEvent(updateEventDetail));
            }
        }
    }
    _convertEventDetail(detail, operation, isSparse) {
        let itemsToModify = [];
        let needsRefresh = false;
        let indexInArrays = 0;
        detail.keys.forEach((key) => {
            let givenIndex = detail.indexes?.[indexInArrays];
            let keyCacheIndex = this.keyCache.indexOf(key);
            if (keyCacheIndex != -1) {
                itemsToModify.push({ index: keyCacheIndex, key: key });
            }
            else if (givenIndex != null) {
                itemsToModify.push({ index: givenIndex, key: key });
            }
            else if (isSparse) {
                needsRefresh = true;
            }
            indexInArrays++;
        });
        let eventDetail;
        if (itemsToModify.length > 0) {
            if (operation === 'remove' || operation === 'add') {
                let ranges = itemsToModify.map((item) => {
                    return { offset: item.index, count: 1 };
                });
                eventDetail = { axis: 'row', ranges, version: this.version };
            }
            else if (operation === 'update') {
                let ranges = itemsToModify.map((item) => {
                    return {
                        rowOffset: item.index,
                        rowCount: 1,
                        columnOffset: 0,
                        columnCount: -1
                    };
                });
                eventDetail = { ranges, version: this.version };
            }
        }
        return [needsRefresh, eventDetail, itemsToModify];
    }
    _handleUnderlyingRefresh(event) {
        this.version++;
        let isSparse = this.isKeyCacheSparse();
        let fullRefresh = true;
        let detail;
        if (event?.detail?.disregardAfterKey != null) {
            const keyCacheIndex = this.keyCache.indexOf(event.detail.disregardAfterKey);
            if (keyCacheIndex !== -1) {
                detail = { disregardAfterRowOffset: keyCacheIndex };
                this.keyCache.length = keyCacheIndex + 1;
                this.totalRowCount = this.totalRowCount === -1 ? -1 : keyCacheIndex + 1;
                this.lastRowKeyCached = false;
                fullRefresh = false;
            }
            else if (!isSparse) {
                return;
            }
        }
        if (fullRefresh) {
            this.resetInternal();
        }
        const refreshEvent = new DataGridProviderRefreshEvent(detail);
        this.dispatchEvent(refreshEvent);
    }
    resetInternal() {
        this._clearKeyCache();
        this.totalRowCount = null;
        this.currentFetchParameters = null;
        this.sortCriteria = null;
        this.lastRowKeyCached = false;
    }
}
EventTargetMixin.applyMixin(RowDataGridProvider);

export { RowDataGridProvider };
