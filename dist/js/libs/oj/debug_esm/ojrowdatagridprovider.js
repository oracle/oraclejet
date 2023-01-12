/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { DataGridProviderRefreshEvent, DataGridProviderRemoveEvent, DataGridProviderAddEvent, DataGridProviderUpdateEvent } from 'ojs/ojdatagridprovider';
import { EventTargetMixin } from 'ojs/ojeventtarget';
import { getAddEventKeysResult } from 'ojs/ojdatacollection-common';

var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RowDataGridProvider {
    constructor(dataProvider, options) {
        var _a;
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
            constructor(sortDirection, expanded, treeDepth, showRequired) {
                this.sortDirection = sortDirection;
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
        this.sortable = options === null || options === void 0 ? void 0 : options.sortable;
        this.sortCriteria = null;
        this.supportsFilteredRowCount =
            ((_a = dataProvider.getCapability('fetchFirst')) === null || _a === void 0 ? void 0 : _a.totalFilteredRowCount) === 'exact';
        if (options === null || options === void 0 ? void 0 : options.expandedObservable) {
            const expandedObservable = options === null || options === void 0 ? void 0 : options.expandedObservable.subscribe((value) => {
                this.expandedState = value.value;
            });
        }
        dataProvider.addEventListener('mutate', this._handleUnderlyingMutation.bind(this));
        dataProvider.addEventListener('refresh', this._handleUnderlyingRefresh.bind(this));
    }
    fetchByOffset(parameters) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const rowOffset = parameters.rowOffset;
            let rowCount = parameters.rowCount;
            let fetchResult = { results: [], done: false, fetchParameters: null };
            if (rowCount != 0) {
                fetchResult = yield this.dataProvider.fetchByOffset({ offset: rowOffset, size: rowCount });
            }
            let totalSize = -1;
            let sameFetchParameters = this.isSameFetchParameters(fetchResult.fetchParameters);
            if (!sameFetchParameters || this.totalRowCount == null) {
                if (this.supportsFilteredRowCount) {
                    let fetchFirstResult = yield this.dataProvider
                        .fetchFirst({ size: 1, includeFilteredRowCount: 'enabled' })[Symbol.asyncIterator]()
                        .next();
                    if (fetchFirstResult.value.totalFilteredRowCount != null) {
                        totalSize = fetchFirstResult.value.totalFilteredRowCount;
                    }
                }
                else if (this.isUnfiltered(fetchResult.fetchParameters)) {
                    totalSize = yield this.dataProvider.getTotalSize();
                }
                this.totalRowCount = totalSize;
            }
            this.updateKeyCache(fetchResult, rowOffset);
            this.setupLayout(fetchResult.results);
            this.sortCriteria = (_a = fetchResult.fetchParameters) === null || _a === void 0 ? void 0 : _a.sortCriteria;
            const columnOffset = parameters.columnOffset;
            const columnDone = columnOffset + parameters.columnCount >= this.columns.databody.length;
            const columnCount = Math.max(Math.min(parameters.columnCount, this.columns.databody.length - columnOffset), 0);
            rowCount = Math.min(parameters.rowCount, fetchResult.results.length);
            const rowDone = fetchResult.done;
            this.lastRowKeyCached = fetchResult.done;
            const version = this.version;
            const requestSet = parameters.fetchRegions;
            const isAll = requestSet == null || requestSet.has('all');
            const requestDatabody = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('databody'));
            const requestRowHeader = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('rowHeader'));
            const requestColumnHeader = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('columnHeader'));
            const requestRowEndHeader = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('rowEndHeader'));
            const requestColumnEndHeader = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('columnEndHeader'));
            const requestRowHeaderLabel = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('rowHeaderLabel'));
            const requestColumnHeaderLabel = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('columnHeaderLabel'));
            const requestRowEndHeaderLabel = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('rowEndHeaderLabel'));
            const requestColumnEndHeaderLabel = isAll || (requestSet === null || requestSet === void 0 ? void 0 : requestSet.has('columnEndHeaderLabel'));
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
        });
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
        var _a, _b;
        let sortCriterion = fetchParameters === null || fetchParameters === void 0 ? void 0 : fetchParameters.sortCriteria;
        let filterCriterion = fetchParameters === null || fetchParameters === void 0 ? void 0 : fetchParameters.filterCriterion;
        let currentSortCriterion = (_a = this.currentFetchParameters) === null || _a === void 0 ? void 0 : _a.sortCriteria;
        let currentFilterCriterion = (_b = this.currentFetchParameters) === null || _b === void 0 ? void 0 : _b.filterCriterion;
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
        var _a, _b, _c, _d, _e, _f;
        if (this.columns == null) {
            this.columns = {};
            const firstResult = results[0];
            this.columns.rowHeader = this.getFromOptions((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.columns) === null || _b === void 0 ? void 0 : _b.rowHeader, firstResult);
            this.columns.rowEndHeader = this.getFromOptions((_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.columns) === null || _d === void 0 ? void 0 : _d.rowEndHeader, firstResult);
            if ((_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.columns) === null || _f === void 0 ? void 0 : _f.databody) {
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
                this.columns.databody = dataKeys.filter((key) => { var _a, _b; return !((_a = this.columns.rowHeader) === null || _a === void 0 ? void 0 : _a.includes(key)) && !((_b = this.columns.rowEndHeader) === null || _b === void 0 ? void 0 : _b.includes(key)); });
            }
        }
    }
    setupColumnHeaders() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (this.columnHeaders == null) {
            this.columnHeaders = {};
            const unparsedColumnHeaders = this.getFromOptions((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.columnHeaders) === null || _b === void 0 ? void 0 : _b.column, (_c = this.columns) === null || _c === void 0 ? void 0 : _c.databody, (_d = this.columns) === null || _d === void 0 ? void 0 : _d.databody, (data) => {
                return { data };
            });
            this.columnHeaders.column = this.parseNestedHeaders(unparsedColumnHeaders);
            const unparsedColumnEndHeaders = this.getFromOptions((_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.columnHeaders) === null || _f === void 0 ? void 0 : _f.columnEnd, (_g = this.columns) === null || _g === void 0 ? void 0 : _g.databody, (_h = this.columns) === null || _h === void 0 ? void 0 : _h.databody, (data) => {
                return { data };
            });
            this.columnHeaders.columnEnd = this.parseNestedHeaders(unparsedColumnEndHeaders);
        }
    }
    setupHeaderLabels() {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (this.headerLabels == null) {
            this.headerLabels = {};
            this.headerLabels.row = this.getFromOptions((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.headerLabels) === null || _b === void 0 ? void 0 : _b.row, (_c = this.columns) === null || _c === void 0 ? void 0 : _c.rowHeader, (_d = this.columns) === null || _d === void 0 ? void 0 : _d.rowHeader, (data) => {
                return data;
            });
            this.headerLabels.rowEnd = this.getFromOptions((_f = (_e = this.options) === null || _e === void 0 ? void 0 : _e.headerLabels) === null || _f === void 0 ? void 0 : _f.rowEnd, (_g = this.columns) === null || _g === void 0 ? void 0 : _g.rowEndHeader, (_h = this.columns) === null || _h === void 0 ? void 0 : _h.rowEndHeader, (data) => {
                return data;
            });
            this.headerLabels.column = this.getFromOptions((_k = (_j = this.options) === null || _j === void 0 ? void 0 : _j.headerLabels) === null || _k === void 0 ? void 0 : _k.column, (_m = (_l = this.columnHeaders) === null || _l === void 0 ? void 0 : _l.column) === null || _m === void 0 ? void 0 : _m.headerArray);
            this.headerLabels.columnEnd = this.getFromOptions((_p = (_o = this.options) === null || _o === void 0 ? void 0 : _o.headerLabels) === null || _p === void 0 ? void 0 : _p.columnEnd, (_r = (_q = this.columnHeaders) === null || _q === void 0 ? void 0 : _q.columnEnd) === null || _r === void 0 ? void 0 : _r.headerArray);
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
    getDatabodyResults(data, rowStart, rowCount, columnStart, columnCount) {
        if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
            const databody = [];
            for (let i = 0; i < rowCount; i++) {
                const rowItem = data[i];
                for (let j = 0; j < columnCount; j++) {
                    const columnKey = this.columns.databody[columnStart + j];
                    const value = { data: rowItem.data[columnKey] };
                    let metadata = { rowItem };
                    const item = new this.GridBodyItem(1, 1, rowStart + i, columnStart + j, metadata, value);
                    databody.push(item);
                }
            }
            return databody;
        }
    }
    getRowHeaderResults(axis, data, offset, count) {
        const keys = this.columns[axis];
        if ((data === null || data === void 0 ? void 0 : data.length) > 0 && (keys === null || keys === void 0 ? void 0 : keys.length) > 0) {
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
                    headers.push(item);
                }
            }
            return headers;
        }
    }
    getSortState(index) {
        let columnAttribute = this.columns.databody[index];
        if (this.sortCriteria && this.sortCriteria.length > 0 && columnAttribute) {
            let criterion = this.sortCriteria[0];
            if (criterion.attribute === columnAttribute) {
                return criterion.direction;
            }
        }
        return 'unsorted';
    }
    getColumnHeaderResults(axis, offset, count) {
        var _a, _b;
        if ((_a = this.columnHeaders) === null || _a === void 0 ? void 0 : _a[axis]) {
            const headers = [];
            const tempArray = [];
            const levelCount = this.columnHeaders[axis].levelCount;
            for (let i = 0; i < count; i++) {
                const index = offset + i;
                for (let level = 0; level < levelCount; level++) {
                    if ((_b = tempArray[index]) === null || _b === void 0 ? void 0 : _b[level]) {
                        continue;
                    }
                    const columnHeader = this.getColumnHeaderItem(index, level, this.columnHeaders[axis].headerArray);
                    const data = { data: columnHeader.data };
                    const startIndex = columnHeader.index;
                    const extent = columnHeader.extent;
                    const startLevel = columnHeader.level;
                    const depth = columnHeader.depth;
                    let metadata;
                    if (this.sortable && axis === 'column' && level + depth === levelCount) {
                        metadata = new this.GridHeaderMetadata(this.getSortState(startIndex));
                    }
                    else {
                        metadata = {};
                    }
                    const item = new this.GridHeaderItem(startIndex, extent, startLevel, depth, metadata, data);
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
        var _a, _b;
        let iterArray;
        if (((_a = this.headerLabels) === null || _a === void 0 ? void 0 : _a.row) === 'attributeName') {
            iterArray = this.columns.rowHeader;
        }
        else if ((_b = this.headerLabels) === null || _b === void 0 ? void 0 : _b.row) {
            iterArray = this.headerLabels.row;
        }
        if (iterArray) {
            let returnVal = [];
            for (let i = iterArray.length - 1; i >= 0; i--) {
                returnVal.push(new this.GridItem({}, { data: iterArray[i] }));
            }
            return returnVal;
        }
    }
    getRowEndHeaderLabelResults() {
        var _a, _b;
        let iterArray;
        if (((_a = this.headerLabels) === null || _a === void 0 ? void 0 : _a.rowEnd) === 'attributeName') {
            iterArray = this.columns.rowEndHeader;
        }
        else if ((_b = this.headerLabels) === null || _b === void 0 ? void 0 : _b.rowEnd) {
            iterArray = this.headerLabels.rowEnd;
        }
        if (iterArray) {
            let returnVal = [];
            for (let i = iterArray.length - 1; i >= 0; i--) {
                returnVal.push(new this.GridItem({}, { data: iterArray[i] }));
            }
            return returnVal;
        }
    }
    getColumnHeaderLabelResults(axis) {
        var _a;
        if ((_a = this.headerLabels) === null || _a === void 0 ? void 0 : _a[axis]) {
            let returnVal = [];
            for (let i = this.headerLabels[axis].length - 1; i >= 0; i--) {
                returnVal.push(new this.GridItem({}, { data: this.headerLabels[axis][i] }));
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
        removeItems === null || removeItems === void 0 ? void 0 : removeItems.sort((a, b) => {
            return b.index - a.index;
        }).forEach((item) => {
            this.keyCache.splice(item.index, 1);
        });
        if (!needsRefresh && detail.add && detail.add.keys.size > 0) {
            let finalKeys = getAddEventKeysResult(this.keyCache, detail.add, allLoaded);
            needsRefresh = isSparse && finalKeys.length !== this.keyCache.length + detail.add.keys.size;
            if (!needsRefresh) {
                let ranges = [];
                detail.add.keys.forEach((key) => {
                    let index = finalKeys.indexOf(key);
                    ranges.push({ offset: index, count: 1 });
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
            var _a;
            let givenIndex = (_a = detail.indexes) === null || _a === void 0 ? void 0 : _a[indexInArrays];
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
        this.resetInternal();
        this.dispatchEvent(new DataGridProviderRefreshEvent());
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
