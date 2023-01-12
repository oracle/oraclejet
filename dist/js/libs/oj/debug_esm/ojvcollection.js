/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import { getEventDetail, CHECKVIEWPORT_THRESHOLD } from 'ojs/ojdatacollection-common';
import { info, warn, error } from 'ojs/ojlogger';
import CachedIteratorResultsDataProvider from 'ojs/ojcachediteratorresultsdataprovider';
import DomScroller from 'ojs/ojdomscroller';

class DataProviderContentHandler {
    constructor(root, dataProvider, callback) {
        this.root = root;
        this.dataProvider = dataProvider;
        this.callback = callback;
        this.validKeyTypes = ['string', 'number'];
        this.fetching = 0;
        this.getKey = function (element) {
            return element.key
                ? element.key
                : element.dataset.ojKeyType === 'number'
                    ? Number(element.dataset.ojKey)
                    : element.dataset.ojKey;
        };
        if (dataProvider) {
            this.modelEventHandler = this._handleModelEvent.bind(this);
            dataProvider.addEventListener('mutate', this.modelEventHandler);
            dataProvider.addEventListener('refresh', this.modelEventHandler);
        }
    }
    setFetching(fetching) {
        const fetchingValue = fetching ? this.fetching + 1 : this.fetching - 1;
        this.fetching = Math.max(0, fetchingValue);
    }
    isFetching() {
        return this.fetching !== 0;
    }
    addBusyState(description) {
        if (this.callback != null) {
            return this.callback.addBusyState('DataProviderContentHandler ' + description);
        }
        return () => { };
    }
    destroy() {
        this.callback = null;
        if (this.dataProvider && this.modelEventHandler) {
            this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
            this.dataProvider.removeEventListener('refresh', this.modelEventHandler);
        }
    }
    renderNoData() {
        this.setFetching(false);
        return [];
    }
    render(data) {
        return this.renderFetchedData(data);
    }
    postRender() {
    }
    getDataProvider() {
        return this.dataProvider;
    }
    setDataProvider(dataProvider) {
        this.dataProvider = dataProvider;
    }
    isReady() {
        return !this.fetching;
    }
    verifyKey(key) {
        return this.validKeyTypes.indexOf(typeof key) > -1;
    }
    setStyleClass(vnode, styleClasses) {
        const classProp = vnode.props.class || vnode.props.class === '' ? 'class' : 'className';
        const currentClasses = vnode.props[classProp]
            ? [vnode.props[classProp], ...styleClasses]
            : styleClasses;
        vnode.props[classProp] = currentClasses.join(' ');
    }
    findItemVNode(vnodes) {
        if (Array.isArray(vnodes)) {
            for (const curr of vnodes) {
                if (curr.props) {
                    if (curr.type == null || typeof curr.type != 'function') {
                        return curr;
                    }
                    else {
                        return this.findItemVNode(curr.props.children);
                    }
                }
            }
            return null;
        }
        return vnodes;
    }
    handleModelRefresh(detail) {
        this.callback.setData(null);
        this.fetchRows();
    }
    handleItemsAdded(detail) { }
    handleItemsRemoved(detail) { }
    handleItemsUpdated(detail) { }
    _handleModelEvent(event) {
        var _a;
        const detail = event['detail'];
        if (event.type === 'refresh') {
            this.handleModelRefresh(detail);
        }
        else if (event.type === 'mutate') {
            if (this.callback.getData() == null) {
                return;
            }
            const addAndRemoveKeys = [];
            if (detail.add && detail.remove) {
                detail.remove.keys.forEach((key) => {
                    if (detail.add.keys.has(key)) {
                        addAndRemoveKeys.push(key);
                    }
                });
            }
            if (detail.add) {
                const keys = detail.add.keys;
                const keysArray = [...keys];
                const metadata = (_a = this.callback.getData()) === null || _a === void 0 ? void 0 : _a.value.metadata;
                const addDetail = Object.assign({}, detail.add);
                metadata === null || metadata === void 0 ? void 0 : metadata.forEach((data) => {
                    var _a, _b, _c, _d, _e, _f;
                    if (keys.has(data.key) && addAndRemoveKeys.indexOf(data.key) == -1) {
                        const index = keysArray.indexOf(data.key);
                        (_a = addDetail.addBeforeKeys) === null || _a === void 0 ? void 0 : _a.splice(index, 1);
                        (_b = addDetail.data) === null || _b === void 0 ? void 0 : _b.splice(index, 1);
                        (_c = addDetail.indexes) === null || _c === void 0 ? void 0 : _c.splice(index, 1);
                        (_d = addDetail.keys) === null || _d === void 0 ? void 0 : _d.delete(data.key);
                        (_e = addDetail.metadata) === null || _e === void 0 ? void 0 : _e.splice(index, 1);
                        (_f = addDetail.parentKeys) === null || _f === void 0 ? void 0 : _f.splice(index, 1);
                    }
                });
                this.handleItemsAdded(addDetail);
            }
            if (detail.remove) {
                const handleDetailRemove = () => {
                    this.handleItemsRemoved(detail.remove);
                    detail.remove.keys.forEach((key) => {
                        if (addAndRemoveKeys.indexOf(key) == -1) {
                            this.callback.handleItemRemoved(key);
                        }
                    });
                };
                if (this.getValidatedEventDetailPromise) {
                    this.getValidatedEventDetailPromise.then(() => {
                        handleDetailRemove();
                        this.getValidatedEventDetailPromise = null;
                    });
                }
                else {
                    handleDetailRemove();
                }
            }
            if (detail.update) {
                this.handleItemsUpdated(detail.update);
            }
        }
    }
    _handleScrollerMaxRowCount() {
        info('ScrollPolicyOptions max count has been reached.');
    }
    getMaxCount() {
        return Infinity;
    }
    truncateIfOverMaxCount(validatedEventDetail, currentDataLength) {
        const eventDataLength = validatedEventDetail.data.length;
        const potentialDataLength = eventDataLength + currentDataLength;
        const offset = this.getMaxCount() - potentialDataLength;
        if (offset < 0) {
            validatedEventDetail.data.splice(offset, eventDataLength);
            validatedEventDetail.metadata.splice(offset, eventDataLength);
            this._handleScrollerMaxRowCount();
        }
    }
    getValidatedEventDetail(detail) {
        const addEventBusyResolve = this.addBusyState('validating mutation add event detail');
        return getEventDetail(this.getDataProvider(), detail).then((validatedEventDetail) => {
            if (validatedEventDetail === null) {
                addEventBusyResolve();
                return;
            }
            const styleClass = '.' + this.callback.getItemStyleClass();
            const items = this.root.querySelectorAll(styleClass);
            this.truncateIfOverMaxCount(validatedEventDetail, items.length);
            detail.data = validatedEventDetail.data;
            detail.metadata = validatedEventDetail.metadata;
            addEventBusyResolve();
        });
    }
}

var VirtualizationStrategy;
(function (VirtualizationStrategy) {
    VirtualizationStrategy[VirtualizationStrategy["HIGH_WATER_MARK"] = 0] = "HIGH_WATER_MARK";
    VirtualizationStrategy[VirtualizationStrategy["VIEWPORT_ONLY"] = 1] = "VIEWPORT_ONLY";
})(VirtualizationStrategy || (VirtualizationStrategy = {}));
class VirtualizeDomScroller {
    constructor(element, dataProvider, asyncIterator, callback, options) {
        this.element = element;
        this.dataProvider = dataProvider;
        this.asyncIterator = asyncIterator;
        this.callback = callback;
        this.options = options;
        this._handleScroll = (event) => {
            const target = this.element;
            const scrollTop = this._getScrollTop(target);
            const maxScrollTop = target.scrollHeight - target.clientHeight;
            if (maxScrollTop > 0) {
                this._handleScrollerScrollTop(scrollTop, maxScrollTop);
            }
        };
        this._handleModelEvent = (event) => {
            if (event.type === 'mutate') {
                const detail = event['detail'];
                if (detail.add) {
                    let indexes = detail.add.indexes;
                    const addBeforeKeys = detail.add.addBeforeKeys;
                    if (addBeforeKeys != null) {
                        const keys = Array.from(detail.add.keys);
                        indexes = this._handleModelInsert(addBeforeKeys, keys);
                    }
                    if (indexes != null) {
                        indexes = indexes.sort((a, b) => a - b);
                        this._handleItemsAddedOrRemoved(indexes, 'added');
                        this.rowCount = this.rowCount + indexes.length;
                    }
                }
                if (detail.remove) {
                    const keys = Array.from(detail.remove.keys);
                    let indexes = this._handleModelDelete(keys);
                    indexes = indexes.sort((a, b) => b - a);
                    this._handleItemsAddedOrRemoved(indexes, 'removed');
                    this.rowCount = Math.max(0, this.rowCount - indexes.length);
                }
            }
        };
        this.initialScrollTop = this.element.scrollTop;
        this.scrollListener = this._handleScroll.bind(this);
        this._getScrollEventElement().addEventListener('scroll', this.scrollListener);
        this.modelEventListener = this._handleModelEvent.bind(this);
        dataProvider.addEventListener('mutate', this.modelEventListener);
        this.fetchSize = options.fetchSize > 0 ? options.fetchSize : 25;
        this.maxCount = options.maxCount > 0 ? options.maxCount : 500;
        this.rowCount = options.keys != null ? options.keys.length : this.fetchSize;
        this.viewportSize = -1;
        this.viewportPixelSize = this.element.offsetHeight;
        this.currentScrollTop = 0;
        this.currentRenderedPoint = {
            startIndex: 0,
            endIndex: isNaN(this.rowCount) ? this.fetchSize : this.rowCount,
            maxCountLimit: false,
            done: false,
            keys: options.keys
        };
        this.lastFetchTrigger = 0;
        this.checkViewportCount = 0;
    }
    checkViewport() {
        if (this.currentRenderedPoint.done || this.currentRenderedPoint.maxCountLimit) {
            return true;
        }
        const flag = this._isRangeValid(0, this.currentRenderedPoint.end);
        if (!flag) {
            this.checkViewportCount += 1;
            if (this.checkViewportCount === CHECKVIEWPORT_THRESHOLD) {
                warn('Viewport not satisfied after multiple fetch, make sure the component is height constrained or specify a scroller.');
            }
            this._doFetch();
        }
        else {
            this.checkViewportCount = 0;
        }
        return flag;
    }
    setAsyncIterator(iterator) {
        this.asyncIterator = iterator;
    }
    _isRenderingViewportOnly(callback) {
        return (this.options.strategy === VirtualizationStrategy.VIEWPORT_ONLY &&
            callback.getIndexForRange !== undefined);
    }
    setViewportRange(start, end) {
        if (this.currentRenderedPoint.start == null || this.currentRenderedPoint.end == null) {
            this.currentRenderedPoint.start = start;
            this.currentRenderedPoint.end = end;
            this._log(`got pixel range: ${start} to ${end} for renderedPoint: ${this.currentRenderedPoint.startIndex} ${this.currentRenderedPoint.endIndex}`);
        }
        if (this._checkRenderedPoints()) {
            this.fetchPromise = null;
            if (this.currentScrollTop >= this.lastFetchTrigger) {
                this.nextFetchTrigger = undefined;
            }
        }
    }
    destroy() {
        this._getScrollEventElement().removeEventListener('scroll', this.scrollListener);
        this.dataProvider.removeEventListener('mutate', this.modelEventListener);
    }
    _getScrollEventElement() {
        if (this.element === document.body || this.element === document.documentElement) {
            return window;
        }
        return this.element;
    }
    _getScrollTop(element) {
        const scrollTop = 0;
        if (element === document.documentElement) {
            if (this.useBodyScrollTop === undefined) {
                this.useBodyScrollTop = this.initialScrollTop === element.scrollTop;
            }
            if (this.useBodyScrollTop) {
                return scrollTop + document.body.scrollTop;
            }
        }
        return scrollTop + element.scrollTop;
    }
    _setRangeLocal(startIndex, endIndex, start, end, maxCountLimit, done) {
        this._log(`rendering row: ${startIndex} to ${endIndex} covering range: ${start == null ? 'unknown' : start} to ${end == null ? 'unknown' : end}`);
        this.callback.beforeFetchByOffset(startIndex, endIndex);
        this.currentRenderedPoint = {
            startIndex,
            endIndex,
            start,
            end,
            maxCountLimit,
            done,
            keys: []
        };
        const options = { offset: startIndex, size: endIndex - startIndex };
        this.fetchByOffsetPromise = this.dataProvider.fetchByOffset(options).then((fetchResults) => {
            let proceed = true;
            if (start != null && end != null) {
                proceed = this._isRangeValid(start, end);
            }
            if (proceed) {
                this._log(`fetchByOffset ${startIndex} to ${endIndex} returned and result is still applicable`);
                const data = [];
                const metadata = [];
                const keys = this.currentRenderedPoint.keys;
                fetchResults.results.forEach((result) => {
                    data.push(result.data);
                    metadata.push(result.metadata);
                    keys.push(result.metadata.key);
                });
                const ret = {};
                ret.startIndex = startIndex;
                ret.maxCountLimit = maxCountLimit;
                ret.done = done;
                ret.value = {};
                ret.value.data = data;
                ret.value.metadata = metadata;
                this.callback.fetchSuccess(ret);
                this.fetchByOffsetPromise = null;
            }
            else {
                this._log(`fetchByOffset ${startIndex} to ${endIndex} returned but result is NO LONGER applicable`);
                this.fetchByOffsetPromise = null;
                this.callback.fetchError('notValid');
                this._checkRenderedPoints();
            }
        });
    }
    _handleScrollerScrollTop(scrollTop, maxScrollTop) {
        this.currentScrollTop = scrollTop;
        if (!this.fetchPromise && this.asyncIterator) {
            if (isNaN(this.nextFetchTrigger) && this.lastMaxScrollTop !== maxScrollTop) {
                this.nextFetchTrigger = Math.max(0, (maxScrollTop - scrollTop) / 2);
                this.lastFetchTrigger = scrollTop;
                this.lastMaxScrollTop = maxScrollTop;
                this._log('next fetch trigger point: ' + Math.round(this.nextFetchTrigger));
            }
            if (this.nextFetchTrigger != null &&
                scrollTop - this.lastFetchTrigger > this.nextFetchTrigger) {
                this._doFetch();
                return;
            }
            if (maxScrollTop - scrollTop < 1) {
                this._doFetch();
                return;
            }
        }
        if (this.fetchPromise && scrollTop > this.lastFetchTrigger) {
            return;
        }
        this._checkRenderedPoints();
    }
    _isRangeValid(start, end) {
        const scrollTop = this.currentScrollTop;
        this.viewportPixelSize = this.element.clientHeight;
        if (scrollTop >= start && scrollTop + this.viewportPixelSize <= end) {
            return true;
        }
        return false;
    }
    _checkRenderedPoints() {
        if (this.currentRenderedPoint.start == null || this.currentRenderedPoint.end == null) {
            return true;
        }
        if (this._isRangeValid(this.currentRenderedPoint.start, this.currentRenderedPoint.end)) {
            return true;
        }
        if (this._isRenderingViewportOnly(this.callback)) {
            const vCallback = this.callback;
            const start = Math.max(0, this.currentScrollTop - this.viewportPixelSize);
            const end = Math.min(this.currentScrollTop + this.viewportPixelSize * 2);
            const indexRange = vCallback.getIndexForRange(start, end);
            const startIndex = Math.max(0, indexRange.startIndex);
            const endIndex = indexRange.endIndex == null ? this.rowCount : Math.min(this.rowCount, indexRange.endIndex);
            if (startIndex < this.currentRenderedPoint.startIndex ||
                endIndex > this.currentRenderedPoint.endIndex) {
                const done = endIndex === this.lastIndex;
                const maxCountLimit = endIndex === this.maxCount;
                this._setRangeLocal(startIndex, endIndex, start, end, maxCountLimit, done);
                return false;
            }
        }
        return true;
    }
    _doFetch() {
        this._log('fetching next set of rows from asyncIterator');
        const beforeFetchCallback = this.callback.beforeFetchNext();
        if (beforeFetchCallback) {
            if (this.viewportSize === -1) {
                this.viewportSize =
                    this.currentRenderedPoint.endIndex - this.currentRenderedPoint.startIndex;
            }
            this.fetchPromise = this._fetchMoreRows().then((result) => {
                if (result.maxCountLimit) {
                    this._log('reached max count');
                    const start = result.size > 0 ? null : this.currentRenderedPoint.start;
                    const end = result.size > 0 ? null : this.currentRenderedPoint.end;
                    this._setRangeLocal(this.currentRenderedPoint.startIndex, this.maxCount, start, end, true, false);
                    this.fetchPromise = null;
                    this.asyncIterator = null;
                }
                else if (result.size > 0 || result.done === true) {
                    let minIndex = 0;
                    if (this._isRenderingViewportOnly(this.callback)) {
                        minIndex = this.callback.getIndexForPosition(this.currentScrollTop);
                    }
                    const renderedStartIndex = minIndex;
                    const renderedEndIndex = this.currentRenderedPoint.endIndex + result.size;
                    if (result.done) {
                        this.lastIndex = renderedEndIndex;
                    }
                    this._setRangeLocal(renderedStartIndex, renderedEndIndex, null, null, false, result.done);
                }
                else {
                    this.fetchPromise = null;
                    this.asyncIterator = null;
                    this.callback.fetchSuccess(null);
                }
            }, (reason) => {
                this.callback.fetchError(reason);
                this.fetchPromise = null;
                this.nextFetchTrigger = undefined;
            });
        }
        else {
            this._log('fetch is aborted due to beforeFetchCallback returning false');
            this.nextFetchTrigger = undefined;
        }
    }
    _fetchMoreRows() {
        if (!this.fetchPromise) {
            const remainingCount = this.maxCount - this.rowCount;
            if (remainingCount > 0) {
                if (!this.currentRenderedPoint.done && this.asyncIterator != null) {
                    this.fetchPromise = this.asyncIterator.next().then((result) => {
                        this.fetchPromise = null;
                        let status;
                        if (result != null) {
                            status = { done: result.done, maxCountLimit: result.maxCountLimit };
                            if (result.value != null) {
                                status.size = result.value.data.length;
                                this.rowCount += result.value.data.length;
                                if (remainingCount < this.fetchSize) {
                                    status.maxCountLimit = true;
                                    if (result.value.data.length > remainingCount) {
                                        status.size = remainingCount;
                                    }
                                }
                            }
                            if (status.maxCountLimit) {
                                this.asyncIterator = null;
                            }
                        }
                        return Promise.resolve(status);
                    });
                    return this.fetchPromise;
                }
            }
            return Promise.resolve({ maxCount: this.maxCount });
        }
        return this.fetchPromise;
    }
    _handleModelInsert(beforeKeys, keys) {
        const currentKeys = this.currentRenderedPoint.keys;
        beforeKeys.forEach((beforeKey, i) => {
            const index = currentKeys.indexOf(beforeKey);
            const key = keys[i];
            if (index > -1) {
                currentKeys.splice(index, 0, key);
            }
        });
        const indexes = [];
        const currentStartIndex = this.currentRenderedPoint.startIndex;
        keys.forEach((key) => {
            const index = currentKeys.indexOf(key);
            if (index > -1) {
                indexes.push(index + currentStartIndex);
            }
            else {
                this.currentRenderedPoint.done = false;
            }
        });
        if (indexes.length > 0) {
            this.currentRenderedPoint.start = null;
            this.currentRenderedPoint.end = null;
        }
        return indexes;
    }
    _handleModelDelete(keys) {
        const indexes = [];
        const currentStartIndex = this.currentRenderedPoint.startIndex;
        const currentKeys = this.currentRenderedPoint.keys;
        const keysToRemove = [];
        keys.forEach((key) => {
            const index = currentKeys.indexOf(key);
            if (index > -1) {
                indexes.push(currentStartIndex + index);
                keysToRemove.push(key);
            }
        });
        keysToRemove.forEach((key) => {
            currentKeys.splice(currentKeys.indexOf(key), 1);
        });
        if (indexes.length > 0) {
            this.currentRenderedPoint.start = null;
            this.currentRenderedPoint.end = null;
        }
        return indexes;
    }
    _updateRenderedPoint(index, renderedPoint, op) {
        if (index < renderedPoint.startIndex) {
            if (op === 'added') {
                renderedPoint.startIndex = renderedPoint.startIndex + 1;
                renderedPoint.endIndex = renderedPoint.endIndex + 1;
            }
            else if (op === 'removed') {
                renderedPoint.startIndex = renderedPoint.startIndex - 1;
                renderedPoint.endIndex = renderedPoint.endIndex - 1;
            }
        }
        else if (index <= renderedPoint.endIndex) {
            if (op === 'added') {
                renderedPoint.endIndex = renderedPoint.endIndex + 1;
            }
            else if (op === 'removed') {
                renderedPoint.endIndex = renderedPoint.endIndex - 1;
            }
        }
    }
    _handleItemsAddedOrRemoved(indexes, op) {
        indexes.forEach((index) => {
            this._updateRenderedPoint(index, this.currentRenderedPoint, op);
        });
    }
    _log(msg) {
        info('[VirtualizeDomScroller]=> ' + msg);
    }
}

class IteratingDataProviderContentHandler extends DataProviderContentHandler {
    constructor(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions) {
        super(root, dataProvider, callback);
        this.root = root;
        this.dataProvider = dataProvider;
        this.callback = callback;
        this.scrollPolicy = scrollPolicy;
        this.scrollPolicyOptions = scrollPolicyOptions;
        this.fetchRows = () => {
            if (this.isReady()) {
                this.setFetching(true);
                const options = { clientId: this._clientId };
                options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                this.dataProviderAsyncIterator = this.getDataProvider()
                    .fetchFirst(options)[Symbol.asyncIterator]();
                const busyStateResolveFunc = this.addBusyState('call next on iterator');
                const promise = this.dataProviderAsyncIterator.next();
                const fetchSize = options.size;
                const helperFunction = (value) => {
                    if (value.done ||
                        fetchSize !== -1 ||
                        typeof this.getDataProvider().getPageCount === 'function') {
                        return value;
                    }
                    const nextPromise = this.dataProviderAsyncIterator.next();
                    return nextPromise.then(function (nextValue) {
                        value.done = nextValue.done;
                        value.value.data = value.value.data.concat(nextValue.value.data);
                        value.value.metadata = value.value.metadata.concat(nextValue.value.metadata);
                        return helperFunction(value);
                    }, function (reason) {
                        this.fetchError(reason);
                    });
                };
                promise
                    .then((value) => {
                    return helperFunction(value);
                }, (reason) => {
                    busyStateResolveFunc();
                    this.setFetching(false);
                    this.fetchError(reason);
                    return Promise.reject(reason);
                })
                    .then((value) => {
                    if (value) {
                        busyStateResolveFunc();
                        if (this.callback == null) {
                            return;
                        }
                        this.initialFetch = true;
                        this.callback.setData(value);
                    }
                }, (reason) => {
                    if (this.callback != null) {
                        const errorValue = {
                            error: reason,
                            done: true,
                            value: { data: [], metadata: [] }
                        };
                        this.callback.setData(errorValue);
                    }
                });
            }
        };
        this._registerDomScroller = (keys) => {
            let options = {
                fetchSize: this.getFetchSize(),
                maxCount: this.getMaxCount(),
                keys: keys,
                strategy: this.isRenderingViewportOnly()
                    ? VirtualizationStrategy.VIEWPORT_ONLY
                    : VirtualizationStrategy.HIGH_WATER_MARK
            };
            this.domScroller = new VirtualizeDomScroller(this._getScroller(), this.getDataProvider(), this.dataProviderAsyncIterator, this, options);
        };
        this._clientId = Symbol();
        this.fetchRows();
    }
    getDataProvider() {
        if (this.wrappedDataProvider == null) {
            const capability = this.dataProvider.getCapability('fetchCapability');
            if (capability == null || capability.caching == null || capability.caching == 'none') {
                this.wrappedDataProvider = new CachedIteratorResultsDataProvider(this.dataProvider);
            }
            else {
                this.wrappedDataProvider = this.dataProvider;
            }
        }
        return this.wrappedDataProvider;
    }
    setDataProvider(dataProvider) {
        this.wrappedDataProvider = null;
        this.dataProvider = dataProvider;
    }
    postRender() {
        this.initialFetch = false;
    }
    destroy() {
        super.destroy();
        if (this.domScroller) {
            this.domScroller.destroy();
        }
    }
    isRenderingViewportOnly() {
        return false;
    }
    _isLoadMoreOnScroll() {
        return this.scrollPolicy === 'loadMoreOnScroll';
    }
    _getScroller() {
        const scroller = this.scrollPolicyOptions.scroller;
        return scroller != null ? scroller : this.root;
    }
    getFetchSize() {
        return this.scrollPolicyOptions.fetchSize;
    }
    getMaxCount() {
        return this.scrollPolicyOptions.maxCount;
    }
    isInitialFetch() {
        return this.initialFetch;
    }
    checkViewport() {
        if (this.domScroller) {
            return this.domScroller.checkViewport();
        }
    }
    renderSkeletonsForLoadMore() { }
    renderFetchedData(dataObj) {
        if (this.callback == null) {
            return;
        }
        const result = [];
        if (dataObj == null || dataObj.value == null) {
            return result;
        }
        const data = dataObj.value.data;
        const metadata = dataObj.value.metadata;
        const startIndex = dataObj.startIndex === undefined ? 0 : dataObj.startIndex;
        if (data.length === metadata.length) {
            result.push(this.renderData(data, metadata, startIndex));
            if (this._isLoadMoreOnScroll()) {
                if (!dataObj.done) {
                    if (data.length === 0) {
                        info('handleFetchedData: zero data returned while done flag is false');
                    }
                    if (!dataObj.maxCountLimit) {
                        if (this.domScroller == null) {
                            const keys = metadata.map((metadata) => {
                                return metadata.key;
                            });
                            this._registerDomScroller(keys);
                        }
                        result.push(this.renderSkeletonsForLoadMore());
                    }
                }
                if (dataObj.maxCountLimit) {
                    this._handleScrollerMaxRowCount();
                }
            }
            this.setFetching(false);
            return result;
        }
    }
    beforeFetchNext() {
        if (this.domScrollerFetchResolve != null) {
            return false;
        }
        this.domScrollerFetchResolve = this.addBusyState('dom scroller call next on iterator');
        return true;
    }
    beforeFetchByOffset(startIndex, endIndex) {
        if (this.domScrollerFetchResolve == null) {
            this.domScrollerFetchResolve = this.addBusyState('dom scroller call next on iterator');
        }
        return true;
    }
    fetchSuccess(result) {
        this.domScrollerFetchResolve();
        this.domScrollerFetchResolve = null;
        if (result != null && this.callback != null) {
            this.callback.setData(result);
        }
    }
    fetchError(reason) {
        if (this.domScrollerFetchResolve) {
            this.domScrollerFetchResolve();
            this.domScrollerFetchResolve = null;
        }
        if (reason !== 'notValid') {
            error('an error occurred during data fetch, reason: ' + reason);
        }
    }
    renderData(data, metadata, startIndex) {
        if (this.callback == null) {
            return null;
        }
        let children = [];
        for (let i = 0; i < data.length; i++) {
            if (data[i] == null || metadata[i] == null) {
                continue;
            }
            if (!this.verifyKey(metadata[i].key)) {
                error('encounted a key with invalid data type.  Acceptable data types for key are: ' +
                    this.validKeyTypes);
                children = [];
                break;
            }
            const child = this.addItem(metadata[i].key, i + startIndex, data[i], true);
            if (child) {
                children.push(child);
            }
        }
        return children;
    }
    _handleItemsMutated(detail, keyField, withinRangeDataCallback) {
        this.callback.updateData(function (currentData) {
            const newData = {
                startIndex: currentData.startIndex,
                done: currentData.done,
                value: {
                    data: currentData.value.data.slice(0),
                    metadata: currentData.value.metadata.slice(0)
                }
            };
            let indexes = detail.indexes;
            const keys = Array.from(detail[keyField]);
            if (indexes == null) {
                indexes = keys.map((key) => {
                    return this._findIndex(currentData.value.metadata, key);
                });
            }
            const startIndex = isNaN(currentData.startIndex) ? 0 : currentData.startIndex;
            const endIndex = Math.max(startIndex + currentData.value.data.length, this.getFetchSize());
            indexes.forEach((index, i) => {
                const key = keys[i];
                const data = detail.data != null ? detail.data[i] : null;
                const metadata = detail.metadata != null ? detail.metadata[i] : null;
                if (index >= startIndex && index <= endIndex) {
                    withinRangeDataCallback(newData, key, index, data, metadata);
                }
            });
            return { renderedData: newData };
        }.bind(this));
    }
    _findIndex(metadata, key) {
        for (let i = 0; i < metadata.length; i++) {
            if (oj.KeyUtils.equals(key, metadata[i].key)) {
                return i;
            }
        }
        return -1;
    }
    handleModelRefresh() {
        if (this.domScroller) {
            this.domScroller.destroy();
        }
        this.domScroller = null;
        super.handleModelRefresh();
    }
    handleItemsAdded(detail) {
        const itemsAdded = () => {
            this.callback.updateData((currentData) => {
                let newData = {
                    startIndex: currentData.startIndex,
                    done: currentData.done,
                    maxCountLimit: currentData.maxCountLimit,
                    value: {
                        data: currentData.value.data.slice(0),
                        metadata: currentData.value.metadata.slice(0)
                    }
                };
                const indexes = detail.indexes;
                const addBeforeKeys = detail.addBeforeKeys;
                const keys = detail.keys;
                if (indexes == null && addBeforeKeys == null) {
                    if (newData.done && !newData.maxCountLimit) {
                        newData.value.data.push(detail.data);
                        newData.value.metadata.push(detail.metadata);
                    }
                }
                else {
                    let i = 0;
                    keys.forEach(() => {
                        const data = detail.data[i];
                        const metadata = detail.metadata[i];
                        let index = -1;
                        if (indexes != null && indexes[i] != null) {
                            index = indexes[i];
                        }
                        else if (addBeforeKeys != null && addBeforeKeys[i] != null) {
                            index = this._findIndex(newData.value.metadata, addBeforeKeys[i]);
                        }
                        if (index > -1 && index < newData.value.data.length) {
                            newData.value.data.splice(index, 0, data);
                            newData.value.metadata.splice(index, 0, metadata);
                        }
                        else if (newData.done && !newData.maxCountLimit) {
                            newData.done = false;
                            if (this.domScroller == null) {
                                this._registerDomScroller([]);
                            }
                            else {
                                this.domScroller.setAsyncIterator(this.dataProviderAsyncIterator);
                            }
                        }
                        i++;
                    });
                }
                return { renderedData: newData };
            });
            super.handleItemsAdded(detail);
        };
        if (detail.data == null || detail.metadata == null) {
            this.getValidatedEventDetailPromise = this.getValidatedEventDetail(detail).then(() => {
                if (detail.data != null && detail.metadata != null) {
                    itemsAdded();
                }
            });
        }
        else {
            itemsAdded();
        }
    }
    handleItemsRemoved(detail) {
        this._handleItemsMutated(detail, 'keys', (newData, key) => {
            const index = this._findIndex(newData.value.metadata, key);
            if (index > -1) {
                newData.value.data.splice(index, 1);
                newData.value.metadata.splice(index, 1);
            }
        });
        super.handleItemsRemoved(detail);
    }
    handleCurrentRangeItemUpdated(key) { }
    handleItemsUpdated(detail) {
        const itemsUpdated = () => {
            this._handleItemsMutated(detail, 'keys', (newData, key, index, data, metadata) => {
                newData.value.data.splice(index, 1, data);
                newData.value.metadata.splice(index, 1, metadata);
                this.handleCurrentRangeItemUpdated(key);
            });
            super.handleItemsUpdated(detail);
        };
        if (detail.data == null || detail.metadata == null) {
            this.getValidatedEventDetailPromise = this.getValidatedEventDetail(detail).then(() => {
                if (detail.data != null && detail.metadata != null) {
                    itemsUpdated();
                }
            });
        }
        else {
            itemsUpdated();
        }
    }
}

class IteratingTreeDataProviderContentHandler extends DataProviderContentHandler {
    constructor(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions) {
        super(root, dataProvider, callback);
        this.root = root;
        this.dataProvider = dataProvider;
        this.callback = callback;
        this.scrollPolicy = scrollPolicy;
        this.scrollPolicyOptions = scrollPolicyOptions;
        this.fetchRows = () => {
            if (this.isReady()) {
                const options = { clientId: this._clientId };
                options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                const iterator = this.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();
                this._cachedIteratorsAndResults['root'] = { iterator, cache: null };
                const finalResults = { value: { data: [], metadata: [] } };
                this._fetchNextFromIterator(iterator, null, options, finalResults).then((result) => {
                    this._setNewData(result);
                }, () => {
                    this._setNewData(null);
                });
            }
        };
        this._fetchNextFromIterator = (iterator, key, options, finalResults) => {
            if (iterator == null) {
                return Promise.resolve();
            }
            this.setFetching(true);
            const busyStateResolveFunc = this.addBusyState('call next on iterator');
            const promise = iterator.next();
            const fetchSize = options.size;
            const helperFunction = (value) => {
                if (value.done || fetchSize !== -1) {
                    return value;
                }
                let nextPromise = iterator.next();
                return nextPromise.then(function (nextValue) {
                    value.done = nextValue.done;
                    value.value.data = value.value.data.concat(nextValue.value.data);
                    value.value.metadata = value.value.metadata.concat(value.value.metadata);
                    return helperFunction(value);
                }, function (reason) {
                    return Promise.reject(reason);
                });
            };
            return promise
                .then((value) => {
                return helperFunction(value);
            }, (reason) => {
                return Promise.reject(reason);
            })
                .then((value) => {
                if (this.isFetching()) {
                    busyStateResolveFunc();
                    this.setFetching(false);
                    if (this.callback == null || value == null) {
                        return;
                    }
                    this.initialFetch = true;
                    if (value.done && this._cachedIteratorsAndResults[key === null ? 'root' : key]) {
                        this._cachedIteratorsAndResults[key === null ? 'root' : key].iterator = null;
                    }
                    return this.handleNextItemInResults(options, key, value, finalResults);
                }
            }, (reason) => {
                busyStateResolveFunc();
                this._handleFetchError(reason);
                return Promise.reject(reason);
            });
        };
        this._setNewData = (result) => {
            if (this.callback == null) {
                return;
            }
            this.callback.updateData(function (data) {
                let final;
                let dataToSet;
                let metadataToSet;
                let done;
                if (result == null) {
                    dataToSet = [];
                    metadataToSet = [];
                    done = true;
                }
                else {
                    dataToSet = result.value.data;
                    metadataToSet = result.value.metadata;
                    done = this._checkIteratorAndCache();
                }
                if (data == null) {
                    final = {
                        value: { data: dataToSet, metadata: metadataToSet },
                        done
                    };
                }
                else {
                    final = {
                        value: {
                            data: data.value.data.concat(dataToSet),
                            metadata: data.value.metadata.concat(metadataToSet)
                        },
                        done
                    };
                }
                return { renderedData: final };
            }.bind(this));
        };
        this._checkIteratorAndCache = () => {
            const cache = this._cachedIteratorsAndResults;
            const values = Object.keys(cache).map(function (e) {
                return cache[e];
            });
            let done = true;
            values.forEach(function (value) {
                if (value && (value.iterator != null || value.cache != null)) {
                    done = false;
                }
            });
            return done;
        };
        this.fetchMoreRows = () => {
            if (this.isReady()) {
                const lastEntryMetadata = this._getLastEntryMetadata();
                let key = lastEntryMetadata.key;
                if (lastEntryMetadata.isLeaf || !this._isExpanded(key)) {
                    key = lastEntryMetadata.parentKey;
                }
                const options = {};
                options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                const cacheInfo = this._cachedIteratorsAndResults[key === null ? 'root' : key];
                let result = null;
                let iterator = null;
                if (cacheInfo != null) {
                    result = cacheInfo.cache;
                    iterator = cacheInfo.iterator;
                }
                const finalResults = { value: { data: [], metadata: [] } };
                return this.handleNextItemInResults(options, key, result, finalResults).then(() => {
                    let newCacheInfo = this._cachedIteratorsAndResults[key === null ? 'root' : key];
                    let newIterator;
                    if (newCacheInfo != null) {
                        newIterator = newCacheInfo.iterator;
                    }
                    return this._fetchFromAncestors(options, key, newIterator, finalResults);
                }, (reason) => {
                    return Promise.reject(reason);
                });
            }
            return Promise.resolve();
        };
        this._fetchFromAncestors = (options, key, iterator, finalResults) => {
            const self = this;
            if (self._checkFinalResults(options, finalResults)) {
                finalResults.done = this._checkIteratorAndCache();
                return Promise.resolve(finalResults);
            }
            const handleFetchFromAncestors = function (lastParentKey, finalResults) {
                if (self._checkFinalResults(options, finalResults) || lastParentKey === null) {
                    finalResults.done = this._checkIteratorAndCache();
                    return Promise.resolve(finalResults);
                }
                const lastEntry = self._getItemByKey(lastParentKey, finalResults);
                const lastEntryParentKey = lastEntry.metadata.parentKey;
                const cacheInfo = this._cachedIteratorsAndResults[lastEntryParentKey === null ? 'root' : lastEntryParentKey];
                let result = null;
                let parentIterator = null;
                if (cacheInfo != null) {
                    result = cacheInfo.cache;
                    parentIterator = cacheInfo.iterator;
                }
                return this.handleNextItemInResults(options, lastEntryParentKey, result, finalResults).then(this._fetchFromAncestors.bind(this, options, lastEntryParentKey, parentIterator, finalResults));
            };
            return this._fetchNextFromIterator(iterator, key, options, finalResults).then(handleFetchFromAncestors.bind(this, key, finalResults), (reason) => {
                return Promise.reject(reason);
            });
        };
        this._getLastEntryMetadata = () => {
            const result = this.callback.getData();
            if (result && result.value.metadata.length) {
                const metadata = result.value.metadata;
                return metadata[metadata.length - 1];
            }
            return null;
        };
        this._isExpanded = (key) => {
            const expanded = this.callback.getExpanded();
            return expanded.has(key);
        };
        this.getChildDataProvider = (parentKey) => {
            if (parentKey == null) {
                return this.dataProvider;
            }
            return this.dataProvider.getChildDataProvider(parentKey);
        };
        this.handleNextItemInResults = (options, parentKey, results, finalResults) => {
            if (results === null ||
                results.value.data.length === 0 ||
                this._checkFinalResults(options, finalResults)) {
                if (results != null && results.value.data.length) {
                    if (this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey]) {
                        this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = results;
                    }
                }
                else if (this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey]) {
                    this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = null;
                }
                if (this._checkFinalResults(options, finalResults) ||
                    this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].iterator == null) {
                    finalResults.done = this._checkIteratorAndCache();
                    return Promise.resolve(finalResults);
                }
                return this._fetchNextFromIterator(this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].iterator, parentKey, options, finalResults);
            }
            const data = results.value.data.shift();
            const metadata = results.value.metadata.shift();
            const updatedMetadata = this._updateMetadata(metadata, parentKey, finalResults);
            finalResults.value.data.push(data);
            finalResults.value.metadata.push(updatedMetadata);
            if (this._isExpanded(updatedMetadata.key)) {
                const childDataProvider = this.getChildDataProvider(updatedMetadata.key);
                if (childDataProvider != null) {
                    const options = { clientId: this._clientId };
                    options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                    const iterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
                    this._cachedIteratorsAndResults[updatedMetadata.key === null ? 'root' : updatedMetadata.key] = { iterator, cache: null };
                    const childrenPromise = this._fetchNextFromIterator(iterator, updatedMetadata.key, options, finalResults);
                    return childrenPromise.then(this.handleNextItemInResults.bind(this, options, parentKey, results, finalResults));
                }
            }
            return this.handleNextItemInResults(options, parentKey, results, finalResults);
        };
        this._checkFinalResults = (options, finalResults) => {
            if (finalResults.value.data.length >= options.size && options.size !== -1) {
                return true;
            }
            return false;
        };
        this._updateMetadata = (metadata, parentKey, finalResults) => {
            let treeDepth = 0;
            const lastEntry = this._getLastItemByParentKey(parentKey, finalResults);
            const indexFromParent = lastEntry == null ? 0 : lastEntry.metadata.indexFromParent + 1;
            const isLeaf = this.getChildDataProvider(metadata.key) === null;
            if (parentKey != null) {
                const parentItem = this._getItemByKey(parentKey, finalResults);
                treeDepth = parentItem.metadata.treeDepth + 1;
            }
            const expanded = this._isExpanded(metadata.key);
            return {
                key: metadata.key,
                isLeaf,
                parentKey,
                indexFromParent,
                treeDepth,
                expanded
            };
        };
        this._updateAllMetadata = (metadata, parentKey, finalResults) => {
            let newMetadata;
            if (metadata && metadata.length > 0) {
                newMetadata = [];
                metadata.forEach((oneMetadata) => {
                    newMetadata.push(this._updateMetadata(oneMetadata, parentKey, finalResults));
                });
            }
            return newMetadata;
        };
        this._getIndexByKey = (key, cache) => {
            let index = -1;
            cache.some(function (item, i) {
                if (item.key === key) {
                    index = i;
                    return true;
                }
            });
            return index;
        };
        this._getLastItemByParentKey = (parentKey, finalResults) => {
            let returnItem = null;
            if (finalResults) {
                finalResults.value.metadata
                    .slice()
                    .reverse()
                    .some(function (metadata, index) {
                    if (metadata.parentKey === parentKey) {
                        returnItem = { data: finalResults.value.data[index], metadata };
                        return true;
                    }
                });
            }
            if (returnItem)
                return returnItem;
            const cache = this.callback.getData();
            if (cache) {
                cache.value.metadata
                    .slice()
                    .reverse()
                    .some(function (metadata, index) {
                    if (metadata.parentKey === parentKey) {
                        returnItem = { data: cache.value.data[index], metadata };
                        return true;
                    }
                });
            }
            return returnItem;
        };
        this._getItemByKey = (key, finalResults) => {
            let returnItem = null;
            if (finalResults) {
                finalResults.value.metadata.some(function (metadata, index) {
                    if (metadata.key === key) {
                        returnItem = { data: finalResults.value.data[index], metadata };
                        return true;
                    }
                });
            }
            if (returnItem)
                return returnItem;
            const cache = this.callback.getData();
            if (cache) {
                cache.value.metadata.some(function (metadata, index) {
                    if (metadata.key === key) {
                        returnItem = { data: cache.value.data[index], metadata };
                        return true;
                    }
                });
            }
            return returnItem;
        };
        this.expand = (key) => {
            const fetchNext = this.fetchNextFromChildDataProvider(key);
            if (fetchNext == null) {
                return;
            }
            const showSkeletonTimeout = setTimeout(function () {
                var _a;
                if ((_a = this.callback) === null || _a === void 0 ? void 0 : _a.getExpandingKeys().has(key)) {
                    this.callback.updateSkeletonKeys(key);
                }
            }.bind(this), 250);
            fetchNext.then(function (finalResults) {
                if (this.callback == null) {
                    return;
                }
                this.callback.updateExpand(function (result, skeletonKeys, expandingKeys, expanded) {
                    if (showSkeletonTimeout) {
                        clearTimeout(showSkeletonTimeout);
                    }
                    if (skeletonKeys.has(key)) {
                        skeletonKeys = skeletonKeys.delete([key]);
                    }
                    if (!expandingKeys.has(key) || !expanded.has(key)) {
                        return { expandedSkeletonKeys: skeletonKeys };
                    }
                    else if (finalResults == null) {
                        return {
                            expandedSkeletonKeys: skeletonKeys,
                            expandingKeys: expandingKeys.delete([key])
                        };
                    }
                    let updatedData = this.getUpdatedData([finalResults], result, [key]);
                    expandingKeys = expandingKeys.delete([key]);
                    return {
                        expandedSkeletonKeys: skeletonKeys,
                        expandingKeys,
                        renderedData: updatedData
                    };
                }.bind(this));
            }.bind(this));
        };
        this._recacheData = (data, metadata) => {
            for (let i = data.length - 1; i >= 0; i--) {
                const itemData = data[i];
                const itemMetadata = metadata[i];
                const parentKey = itemMetadata.parentKey;
                const currentParentKeyCache = this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache;
                if (currentParentKeyCache == null) {
                    this._cachedIteratorsAndResults[parentKey === null ? 'root' : parentKey].cache = {
                        done: false,
                        value: { data: [itemData], metadata: [itemMetadata] }
                    };
                }
                else {
                    currentParentKeyCache.value.data.unshift(itemData);
                    currentParentKeyCache.value.metadata.unshift(itemMetadata);
                }
            }
        };
        this._registerDomScroller = () => {
            const options = {
                asyncIterator: { next: this.fetchMoreRows.bind(this) },
                fetchSize: this.getFetchSize(),
                fetchTrigger: this.callback.getSkeletonHeight() * this.getLoadMoreCount(),
                maxCount: this.getMaxCount(),
                initialRowCount: this.getFetchSize(),
                strategy: VirtualizationStrategy.HIGH_WATER_MARK,
                isOverflow: this._getOverflowFunc(),
                success: this.handleFetchSuccess.bind(this),
                error: () => {
                    this._setNewData(null);
                },
                beforeFetch: () => {
                    return this.handleBeforeFetchNext();
                },
                beforeFetchByOffset: () => {
                    this.handleBeforeFetchByOffset();
                }
            };
            this.domScroller = new DomScroller(this._getScroller(), this.getDataProvider(), options);
        };
        this.getLoadMoreCount = () => {
            return 0;
        };
        this._getOverflowFunc = () => {
            const scroller = this._getScroller();
            if (scroller !== this.root) {
                return this._isLastItemInViewport.bind(this);
            }
            return null;
        };
        this._isLastItemInViewport = () => {
            const styleClass = '.' + this.callback.getItemStyleClass() + ', .' + this.callback.getGroupStyleClass();
            const items = this.root.querySelectorAll(styleClass);
            const lastItem = items[items.length - 1];
            if (lastItem) {
                const lastItemBounds = lastItem.getBoundingClientRect();
                if (lastItemBounds.top >= 0 &&
                    lastItemBounds.bottom <= document.documentElement.clientHeight) {
                    return false;
                }
            }
            return true;
        };
        this._cachedIteratorsAndResults = {};
        this._clientId = Symbol();
        this.fetchRows();
    }
    postRender() {
        this.initialFetch = false;
    }
    destroy() {
        super.destroy();
        if (this.domScroller) {
            this.domScroller.destroy();
        }
    }
    _isLoadMoreOnScroll() {
        return this.scrollPolicy === 'loadMoreOnScroll';
    }
    _getScroller() {
        const scroller = this.scrollPolicyOptions.scroller;
        return scroller != null ? scroller : this.root;
    }
    getFetchSize() {
        return this.scrollPolicyOptions.fetchSize;
    }
    getMaxCount() {
        return this.scrollPolicyOptions.maxCount;
    }
    isInitialFetch() {
        return this.initialFetch;
    }
    renderSkeletonsForLoadMore() { }
    renderSkeletonsForExpand(key) { }
    renderFetchedData(dataObj) {
        if (this.callback == null) {
            return;
        }
        const result = this._renderOutOfRangeData();
        if (dataObj == null || dataObj.value == null) {
            return result;
        }
        const data = dataObj.value.data;
        const metadata = dataObj.value.metadata;
        if (data.length === metadata.length) {
            result.push(this.renderData(data, metadata));
            if (this._isLoadMoreOnScroll()) {
                if (!dataObj.done) {
                    if (data.length === 0) {
                        info('handleFetchedData: zero data returned while done flag is false');
                    }
                    if (!dataObj.maxCountLimit) {
                        if (this.domScroller == null) {
                            this._registerDomScroller();
                        }
                        result.push(this.renderSkeletonsForLoadMore());
                    }
                }
                if (dataObj.maxCountLimit) {
                    this._handleScrollerMaxRowCount();
                }
            }
            return result;
        }
    }
    handleBeforeFetchNext() {
        return !this.isFetching();
    }
    handleBeforeFetchByOffset() {
    }
    handleFetchSuccess(result) {
        if (result != null) {
            this._setNewData(result);
        }
    }
    _handleFetchError(reason) {
        this.setFetching(false);
        error('iterating dataprovider content handler fetch error :' + reason);
    }
    renderData(data, metadata) {
        if (this.callback == null) {
            return null;
        }
        let children = [];
        const skeletonKeys = this.callback.getSkeletonKeys();
        for (let i = 0; i < data.length; i++) {
            if (data[i] == null || metadata[i] == null) {
                continue;
            }
            if (!this.verifyKey(metadata[i].key)) {
                error('encounted a key with invalid data type.  Acceptable data types for key are: ' +
                    this.validKeyTypes);
                children = [];
                break;
            }
            const child = this.addItem(metadata[i], i, data[i], true);
            if (child) {
                children.push(child);
                if (skeletonKeys.has(metadata[i].key)) {
                    children.push(this.renderSkeletonsForExpand(metadata[i].key));
                }
            }
        }
        return children;
    }
    _renderOutOfRangeData() {
        return [];
    }
    _handleItemsMutated(detail, keyField, callback, withinRangeDataCallback) {
        if (this.callback == null) {
            return;
        }
        this.callback.updateData(function (currentData, expandingKeys) {
            let newExpandingKeys = expandingKeys;
            const newData = {
                startIndex: currentData.startIndex,
                done: currentData.done,
                value: {
                    data: currentData.value.data.slice(0),
                    metadata: currentData.value.metadata.slice(0)
                }
            };
            const keys = Array.from(detail[keyField]);
            const indexes = keys.map((key) => {
                return this._findIndex(currentData.value.metadata, key);
            });
            if (this.domScroller) {
                callback(indexes);
            }
            const startIndex = isNaN(currentData.startIndex) ? 0 : currentData.startIndex;
            const endIndex = Math.max(startIndex + currentData.value.data.length, this.getFetchSize());
            let changeWithinRange = false;
            indexes.forEach((index, i) => {
                const key = keys[i];
                const data = detail.data != null ? detail.data[i] : null;
                const metadata = detail.metadata != null ? detail.metadata[i] : null;
                if (index >= startIndex && index <= endIndex) {
                    const returnVal = withinRangeDataCallback(newData, key, index, data, metadata, newExpandingKeys);
                    if (returnVal != null) {
                        newExpandingKeys = returnVal;
                    }
                    changeWithinRange = true;
                }
            });
            if (changeWithinRange) {
                if (newExpandingKeys !== expandingKeys) {
                    return { renderedData: newData, expandingKeys: newExpandingKeys };
                }
                return { renderedData: newData };
            }
        }.bind(this));
    }
    _findIndex(metadata, key) {
        for (let i = 0; i < metadata.length; i++) {
            if (oj.KeyUtils.equals(key, metadata[i].key)) {
                return i;
            }
        }
        return -1;
    }
    _findKeyForLastChild(metadata, parentKey, maxLevel) {
        if (maxLevel === 0) {
            warn('Maximum number of levels exceed');
            return null;
        }
        const groups = metadata.filter((data) => {
            return data.parentKey == parentKey;
        });
        if (groups.length > 0) {
            const lastGroupKey = groups[groups.length - 1].key;
            const lastChildKey = this._findKeyForLastChild(metadata, lastGroupKey, maxLevel - 1);
            return lastChildKey || lastGroupKey;
        }
        else {
            return null;
        }
    }
    _findIndexForNewGroup(metadata, index) {
        if (index === 0)
            return 0;
        const groups = metadata.filter((data) => data.parentKey == null);
        if (groups.length === 0)
            return 0;
        const prevGroupKey = groups[index - 1].key;
        const prevGroupLastChildKey = this._findKeyForLastChild(metadata, prevGroupKey, 5);
        const prevGroupLastChildIndex = prevGroupLastChildKey
            ? this._findIndex(metadata, prevGroupLastChildKey)
            : this._findIndex(metadata, prevGroupKey);
        return prevGroupLastChildIndex + 1;
    }
    _findIndexForLastItem(parentKey, data) {
        let index = -1;
        const lastItem = this._getLastItemByParentKey(parentKey, data);
        if (lastItem) {
            const metadata = data.value.metadata;
            const lastItemLastChildKey = this._findKeyForLastChild(metadata, lastItem.metadata.key, 5);
            index = lastItemLastChildKey
                ? this._findIndex(metadata, lastItemLastChildKey)
                : this._findIndex(metadata, lastItem.metadata.key);
            if (index > -1) {
                index += 1;
            }
        }
        if (lastItem == null || index === -1) {
            return -1;
        }
        return index;
    }
    handleModelRefresh(detail) {
        var _a;
        if (((_a = detail === null || detail === void 0 ? void 0 : detail.keys) === null || _a === void 0 ? void 0 : _a.size) > 0) {
            this.handleModelRefreshChildren(detail.keys);
        }
        else {
            if (this.domScroller) {
                this.domScroller.destroy();
            }
            this.domScroller = null;
            this._cachedIteratorsAndResults = {};
            super.handleModelRefresh();
        }
    }
    fetchNextFromChildDataProvider(key) {
        const childDataProvider = this.getChildDataProvider(key);
        if (childDataProvider === null) {
            return null;
        }
        const fetchSize = this.getFetchSize();
        let options = { clientId: this._clientId, size: fetchSize };
        let iterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
        this._cachedIteratorsAndResults[key] = { iterator: iterator, cache: null };
        return this._fetchNextFromIterator(iterator, key, options, {
            value: { data: [], metadata: [] }
        });
    }
    getUpdatedData(finalResults, renderedData, validKeys) {
        let updatedData;
        let updatingData = renderedData;
        let recacheData;
        let recacheMetadata;
        if (updatingData) {
            validKeys.forEach((key, i) => {
                let data = updatingData.value.data;
                let metadata = updatingData.value.metadata;
                let insertIndex = this._getIndexByKey(key, metadata);
                if (insertIndex !== -1) {
                    let newData = finalResults[i].value.data;
                    let newMetadata = finalResults[i].value.metadata;
                    const fetchedCount = newData.length;
                    let dataToSet = data.slice(0, insertIndex + 1).concat(newData);
                    let metadataToSet = metadata.slice(0, insertIndex + 1).concat(newMetadata);
                    let done = updatingData.done;
                    const fetchSize = this.getFetchSize();
                    if (fetchedCount < fetchSize) {
                        recacheData = null;
                        recacheMetadata = null;
                        dataToSet = dataToSet.concat(data.slice(insertIndex + 1));
                        metadataToSet = metadataToSet.concat(metadata.slice(insertIndex + 1));
                    }
                    else {
                        recacheData = data.slice(insertIndex + 1);
                        recacheMetadata = metadata.slice(insertIndex + 1);
                        if (recacheData.length > 0) {
                            done = false;
                            if (this.domScroller != null) {
                                this.domScroller.setAsyncIterator({ next: this.fetchMoreRows.bind(this) });
                            }
                        }
                    }
                    updatingData = {
                        value: {
                            data: dataToSet,
                            metadata: metadataToSet
                        },
                        done
                    };
                    updatedData = updatingData;
                }
            });
        }
        if (updatedData == null) {
            let newData = finalResults.map((result) => result.value.data);
            let newMetadata = finalResults.map((result) => result.value.metadata);
            updatedData = { value: { data: newData, metadata: newMetadata }, done: true };
        }
        if (recacheData != null) {
            this._recacheData(recacheData, recacheMetadata);
        }
        return updatedData;
    }
    handleModelRefreshChildren(keys) {
        const allFetchNext = [];
        const validKeys = [];
        for (let key of keys) {
            const fetchNext = this.fetchNextFromChildDataProvider(key);
            if (fetchNext != null) {
                allFetchNext.push(fetchNext);
                validKeys.push(key);
            }
        }
        Promise.all(allFetchNext).then((finalResults) => {
            if (this.callback == null) {
                return;
            }
            this.callback.updateData((renderedData) => {
                if (renderedData) {
                    validKeys.forEach((key) => {
                        let metadata = renderedData.value.metadata;
                        let insertIndex = this._getIndexByKey(key, metadata);
                        if (insertIndex !== -1) {
                            const count = IteratingTreeDataProviderContentHandler.getLocalDescendentCount(metadata, insertIndex);
                            renderedData.value.data.splice(insertIndex + 1, count);
                            renderedData.value.metadata.splice(insertIndex + 1, count);
                        }
                    });
                }
                let updatedData = this.getUpdatedData(finalResults, renderedData, validKeys);
                return {
                    renderedData: updatedData
                };
            });
        });
    }
    handleItemsAdded(detail) {
        if (this.callback == null) {
            return;
        }
        const itemsAdded = () => {
            this.callback.updateData((currentData, expandingKeys) => {
                const newData = {
                    startIndex: currentData.startIndex,
                    done: currentData.done,
                    maxCountLimit: currentData.maxCountLimit,
                    value: {
                        data: currentData.value.data.slice(0),
                        metadata: currentData.value.metadata.slice(0)
                    }
                };
                let indexes = detail.indexes;
                const addBeforeKeys = detail.addBeforeKeys;
                const parentKeys = detail.parentKeys;
                const keysToExpand = [];
                let newMetadata;
                if ((indexes == null || (indexes === null || indexes === void 0 ? void 0 : indexes.length) == 0) &&
                    (addBeforeKeys == null || (addBeforeKeys === null || addBeforeKeys === void 0 ? void 0 : addBeforeKeys.length) == 0) &&
                    (parentKeys == null || (parentKeys === null || parentKeys === void 0 ? void 0 : parentKeys.length) == 0)) {
                    if (newData.done && !newData.maxCountLimit) {
                        newData.value.data.push(...detail.data);
                        newMetadata = this._updateAllMetadata(detail.metadata, null, newData);
                        newData.value.metadata.push(...newMetadata);
                    }
                }
                else if ((parentKeys === null || parentKeys === void 0 ? void 0 : parentKeys.length) > 0) {
                    if (indexes == null) {
                        indexes = [];
                    }
                    parentKeys.forEach((parentKey, i) => {
                        const data = detail.data[i];
                        const metadata = detail.metadata[i];
                        let index = -1;
                        if (parentKey === null ||
                            (this._isExpanded(parentKey) && this._getItemByKey(parentKey, null))) {
                            if (addBeforeKeys != null) {
                                if (addBeforeKeys[i] != null) {
                                    const beforeIndex = this._findIndex(newData.value.metadata, addBeforeKeys[i]);
                                    index = beforeIndex;
                                }
                                else {
                                    index = this._findIndexForLastItem(parentKey, newData);
                                    if (index === -1) {
                                        return;
                                    }
                                }
                            }
                            else if (i < indexes.length) {
                                if (parentKey == null) {
                                    index = this._findIndexForNewGroup(newData.value.metadata, indexes[i]);
                                }
                                else {
                                    index = this._findIndex(newData.value.metadata, parentKey);
                                    if (index === -1) {
                                        return;
                                    }
                                    index += indexes[i] + 1;
                                }
                            }
                            else {
                                index = this._findIndexForLastItem(parentKey, newData);
                                if (index === -1) {
                                    return;
                                }
                            }
                        }
                        if (index > -1) {
                            newData.value.data.splice(index, 0, data);
                            newMetadata = this._updateMetadata(metadata, parentKey, newData);
                            newData.value.metadata.splice(index, 0, newMetadata);
                            if (indexes.indexOf(index) === -1) {
                                indexes.push(index);
                            }
                            if (this._isExpanded(metadata.key)) {
                                keysToExpand.push(metadata.key);
                            }
                        }
                        else {
                            if (this._isExpanded(parentKey) && newData.done && !newData.maxCountLimit) {
                                newData.value.data.push(data);
                                newData.value.metadata.push(metadata);
                            }
                        }
                    });
                }
                if (this.domScroller && this.domScroller.handleItemsAdded) {
                    this.domScroller.handleItemsAdded(indexes);
                }
                return {
                    expandingKeys: expandingKeys.add(keysToExpand),
                    renderedData: newData
                };
            });
            super.handleItemsAdded(detail);
        };
        if (detail.data == null || detail.metadata == null) {
            this.getValidatedEventDetailPromise = this.getValidatedEventDetail(detail).then(() => {
                if (detail.data != null && detail.metadata != null) {
                    itemsAdded();
                }
            });
        }
        else {
            itemsAdded();
        }
    }
    handleItemsRemoved(detail) {
        this._handleItemsMutated(detail, 'keys', (indexes) => {
            if (this.domScroller.handleItemsRemoved) {
                this.domScroller.handleItemsRemoved(indexes);
            }
        }, (newData, key) => {
            const index = this._findIndex(newData.value.metadata, key);
            if (index > -1) {
                const count = IteratingTreeDataProviderContentHandler.getLocalDescendentCount(newData.value.metadata, index) + 1;
                newData.value.data.splice(index, count);
                newData.value.metadata.splice(index, count);
            }
        });
        super.handleItemsRemoved(detail);
    }
    handleCurrentRangeItemUpdated() { }
    handleItemsUpdated(detail) {
        const itemsUpdated = () => {
            this._handleItemsMutated(detail, 'keys', (indexes) => {
                if (this.domScroller.handleItemsUpdated) {
                    this.domScroller.handleItemsUpdated(indexes);
                }
            }, (newData, key, index, data, metadata, expandingKeys) => {
                const oldMetadata = newData.value.metadata[index];
                const wasLeaf = oldMetadata.isLeaf;
                const newMetadata = this._updateMetadata(metadata, oldMetadata.parentKey, {
                    value: { data: [data], metadata: [metadata] }
                });
                if (wasLeaf && !newMetadata.isLeaf) {
                    expandingKeys = expandingKeys.add([newMetadata.key]);
                }
                newData.value.data.splice(index, 1, data);
                newData.value.metadata.splice(index, 1, newMetadata);
                this.handleCurrentRangeItemUpdated();
                return expandingKeys;
            });
            super.handleItemsUpdated(detail);
        };
        if (detail.data == null || detail.metadata == null) {
            this.getValidatedEventDetailPromise = this.getValidatedEventDetail(detail).then(() => {
                if (detail.data != null && detail.metadata != null) {
                    itemsUpdated();
                }
            });
        }
        else {
            itemsUpdated();
        }
    }
    checkViewport() {
        if (this.domScroller && this.isReady()) {
            const fetchPromise = this.domScroller.checkViewport();
            if (fetchPromise != null && this.fetchPromise !== fetchPromise) {
                this.fetchPromise = fetchPromise;
                fetchPromise.then(function (result) {
                    this.fetchPromise = null;
                    if (result != null) {
                        this.handleFetchSuccess(result);
                    }
                }.bind(this));
            }
        }
    }
    collapse(keys) {
        keys.forEach(function (key) {
            if (this._cachedIteratorsAndResults[key] != null) {
                this._cachedIteratorsAndResults[key].iterator = null;
                this._cachedIteratorsAndResults[key].cache = null;
            }
        }.bind(this));
    }
}
IteratingTreeDataProviderContentHandler.getLocalDescendentCount = (metadata, index) => {
    let count = 0;
    const depth = metadata[index].treeDepth;
    const lastIndex = metadata.length;
    for (let j = index + 1; j < lastIndex; j++) {
        const newMetadata = metadata[j];
        const newDepth = newMetadata.treeDepth;
        if (newDepth > depth) {
            count += 1;
        }
        else {
            return count;
        }
    }
    return count;
};

class KeyedElement extends HTMLElement {
}

export { IteratingDataProviderContentHandler, IteratingTreeDataProviderContentHandler, KeyedElement, VirtualizationStrategy, VirtualizeDomScroller };
