define(['exports', 'ojs/ojcore-base', 'ojs/ojlogger', 'ojs/ojdomscroller'], function (exports, oj, Logger, DomScroller) { 'use strict';

    class DataProviderContentHandler {
        constructor(root, dataProvider, callback) {
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.validKeyTypes = ['string', 'number'];
            this.fetching = 0;
            this.getKey = function (element) {
                return element.key;
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
        destroy() {
            this.callback = null;
            if (this.dataProvider && this.modelEventHandler) {
                this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
                this.dataProvider.removeEventListener('refresh', this.modelEventHandler);
            }
        }
        render() {
            if (this.callback.getData() == null) {
                this.fetchRows();
            }
            return this.renderFetchedData();
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
        handleModelRefresh() {
            this.callback.setData(null);
            this.fetchRows();
        }
        handleItemsAdded(detail) { }
        handleItemsRemoved(detail) { }
        handleItemsUpdated(detail) { }
        _handleModelEvent(event) {
            if (event.type === 'refresh') {
                this.handleModelRefresh();
            }
            else if (event.type === 'mutate') {
                const detail = event['detail'];
                if (detail.add) {
                    this.handleItemsAdded(detail.add);
                }
                if (detail.remove) {
                    this.handleItemsRemoved(detail.remove);
                }
                if (detail.update) {
                    this.handleItemsUpdated(detail.update);
                }
            }
        }
    }

    (function (VirtualizationStrategy) {
        VirtualizationStrategy[VirtualizationStrategy["HIGH_WATER_MARK"] = 0] = "HIGH_WATER_MARK";
        VirtualizationStrategy[VirtualizationStrategy["VIEWPORT_ONLY"] = 1] = "VIEWPORT_ONLY";
    })(exports.VirtualizationStrategy || (exports.VirtualizationStrategy = {}));
    class VirtualizeDomScroller {
        constructor(element, dataProvider, asyncIterator, options) {
            this.element = element;
            this.dataProvider = dataProvider;
            this.asyncIterator = asyncIterator;
            this.options = options;
            this._handleScroll = (event) => {
                const target = this.element;
                const scrollTop = this._getScrollTop(target);
                const maxScrollTop = target.scrollHeight - target.clientHeight;
                if (maxScrollTop > 0) {
                    this._handleScrollerScrollTop(scrollTop, maxScrollTop);
                }
            };
            this.initialScrollTop = this.element.scrollTop;
            this.scrollListener = this._handleScroll.bind(this);
            this._getScrollEventElement().addEventListener('scroll', this.scrollListener);
            this.fetchSize = options.fetchSize > 0 ? options.fetchSize : 25;
            this.maxCount = options.maxCount > 0 ? options.maxCount : 500;
            this.rowCount = options.initialRowCount > 0 ? options.initialRowCount : 0;
            this.successCallback = options.success;
            this.errorCallback = options.error;
            this.beforeFetchCallback = options.beforeFetchNext;
            this.beforeFetchByOffsetCallback = options.beforeFetchByOffset;
            this.viewportSize = -1;
            this.viewportPixelSize = this.element.offsetHeight;
            this.currentScrollTop = 0;
            this.currentRenderedPoint = {
                startIndex: 0,
                endIndex: isNaN(this.rowCount) ? this.fetchSize : this.rowCount,
                maxCountLimit: false,
                done: false,
                valid: true
            };
            this.renderedPoints = [];
            this.lastFetchTrigger = 0;
        }
        checkViewport() {
            if (this.currentRenderedPoint.done || this.currentRenderedPoint.maxCountLimit) {
                return true;
            }
            let flag = this._isRangeValid(0, this.currentRenderedPoint.end);
            if (!flag) {
                this._doFetch();
            }
            return flag;
        }
        _isRenderingViewportOnly() {
            return this.options.strategy === exports.VirtualizationStrategy.VIEWPORT_ONLY;
        }
        setViewportRange(start, end) {
            if (this.currentRenderedPoint.start == null || this.currentRenderedPoint.end == null) {
                this.currentRenderedPoint.start = start;
                this.currentRenderedPoint.end = end;
                const renderedPoint = Object.assign({}, this.currentRenderedPoint);
                this.renderedPoints.push(renderedPoint);
                this._log('got pixel range: ' +
                    start +
                    ' to ' +
                    end +
                    ' for renderedPoint: ' +
                    this.currentRenderedPoint.startIndex +
                    ' ' +
                    this.currentRenderedPoint.endIndex);
            }
            else if (this.currentRenderedPoint.valid === false) {
                this._log('current rendered point was previous marked as invalid before: ' +
                    this.currentRenderedPoint.start +
                    ' - ' +
                    this.currentRenderedPoint.end);
                this.currentRenderedPoint.start = start;
                this.currentRenderedPoint.end = end;
                this.currentRenderedPoint.valid = true;
                this._log('... and after: ' +
                    start +
                    ' to ' +
                    end +
                    ' for renderedPoint: ' +
                    this.currentRenderedPoint.startIndex +
                    ' ' +
                    this.currentRenderedPoint.endIndex);
                this._syncRenderedPointsWithCurrent();
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
        }
        _getScrollEventElement() {
            if (this.element === document.body || this.element === document.documentElement) {
                return window;
            }
            return this.element;
        }
        _getScrollTop(element) {
            let scrollTop = 0;
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
        _setRangeLocal(startIndex, endIndex, start, end, maxCountLimit, done, valid) {
            this._log('rendering row: ' +
                startIndex +
                ' to ' +
                endIndex +
                ' covering range: ' +
                (start == null ? 'unknown' : start) +
                ' to ' +
                (end == null ? 'unknown' : end));
            this.beforeFetchByOffsetCallback(startIndex, endIndex);
            this.currentRenderedPoint = {
                startIndex: startIndex,
                endIndex: endIndex,
                start: start,
                end: end,
                maxCountLimit: maxCountLimit,
                done: done,
                valid: valid
            };
            const options = { offset: startIndex, size: endIndex - startIndex };
            this.fetchByOffsetPromise = this.dataProvider.fetchByOffset(options).then((fetchResults) => {
                let proceed = true;
                if (start != null && end != null) {
                    proceed = this._isRangeValid(start, end);
                }
                if (proceed) {
                    this._log('fetchByOffset ' +
                        startIndex +
                        ' to ' +
                        endIndex +
                        ' returned and result is still applicable');
                    let data = [];
                    let metadata = [];
                    fetchResults.results.forEach((result) => {
                        data.push(result.data);
                        metadata.push(result.metadata);
                    });
                    let ret = {};
                    ret.startIndex = startIndex;
                    ret.maxCountLimit = maxCountLimit;
                    ret.done = done;
                    ret.value = {};
                    ret.value.data = data;
                    ret.value.metadata = metadata;
                    this.successCallback(ret);
                }
                else {
                    this._log('fetchByOffset ' +
                        startIndex +
                        ' to ' +
                        endIndex +
                        ' returned but result is NO LONGER applicable');
                }
                this.fetchByOffsetPromise = null;
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
            this.viewportPixelSize = this.element.offsetHeight;
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
            for (let i = 0; i < this.renderedPoints.length; i++) {
                const renderedPoint = this.renderedPoints[i];
                if (this._isRangeValid(renderedPoint.start, renderedPoint.end)) {
                    this._setRangeLocal(renderedPoint.startIndex, renderedPoint.endIndex, renderedPoint.start, renderedPoint.end, renderedPoint.maxCountLimit, renderedPoint.done, renderedPoint.valid);
                    return false;
                }
            }
            const scrollTop = this.currentScrollTop;
            this.viewportPixelSize = this.element.offsetHeight;
            for (let i = 0; i < this.renderedPoints.length; i++) {
                const renderedPoint = this.renderedPoints[i];
                if (scrollTop >= renderedPoint.start && i < this.renderedPoints.length - 1) {
                    const nextRenderedPoint = this.renderedPoints[i + 1];
                    if (scrollTop + this.viewportPixelSize <= nextRenderedPoint.end) {
                        this._setRangeLocal(renderedPoint.startIndex, nextRenderedPoint.endIndex, renderedPoint.start, nextRenderedPoint.end, nextRenderedPoint.maxCountLimit, nextRenderedPoint.done, nextRenderedPoint.valid);
                        return false;
                    }
                }
            }
            this._log('scroll position is not covered by at most 2 rendered points');
            return true;
        }
        _doFetch() {
            this._log('fetching next set of rows from asyncIterator');
            const scrollTop = this.currentScrollTop;
            let minIndex = this._isRenderingViewportOnly() ? this.beforeFetchCallback(scrollTop) : 0;
            if (minIndex > -1) {
                if (this.viewportSize === -1) {
                    this.viewportSize =
                        this.currentRenderedPoint.endIndex - this.currentRenderedPoint.startIndex;
                }
                this.fetchPromise = this._fetchMoreRows().then((result) => {
                    let minIndexAfterFetch = this._isRenderingViewportOnly()
                        ? this.beforeFetchCallback(this.currentScrollTop)
                        : 0;
                    if (minIndexAfterFetch >= minIndex) {
                        if (result.maxCount) {
                            this._log('reached max count');
                            let start = result.size > 0 ? null : this.currentRenderedPoint.start;
                            let end = result.size > 0 ? null : this.currentRenderedPoint.end;
                            this._setRangeLocal(this.currentRenderedPoint.startIndex, this.maxCount, start, end, true, false, true);
                            this.fetchPromise = null;
                            this.asyncIterator = null;
                        }
                        else if (result.size > 0 || result.done === true) {
                            const renderedStartIndex = minIndex;
                            const renderedEndIndex = this.currentRenderedPoint.endIndex + result.size;
                            this._setRangeLocal(renderedStartIndex, renderedEndIndex, null, null, false, result.done, true);
                        }
                    }
                    else {
                        this._checkRenderedPoints();
                    }
                }, (reason) => {
                    if (this.errorCallback) {
                        this.errorCallback(reason);
                        this.fetchPromise = null;
                        this.nextFetchTrigger = undefined;
                    }
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
                    if (this.asyncIterator) {
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
                                if (status.done || status.maxCountLimit) {
                                    this.asyncIterator = null;
                                }
                            }
                            return Promise.resolve(status);
                        });
                        return this.fetchPromise;
                    }
                }
                return Promise.resolve({ maxCount: this.maxCount, maxCountLimit: true });
            }
            return this.fetchPromise;
        }
        _syncRenderedPointsWithCurrent() {
            this.renderedPoints.forEach((renderedPoint) => {
                if (renderedPoint.startIndex === this.currentRenderedPoint.startIndex) {
                    renderedPoint.start = this.currentRenderedPoint.start;
                }
                if (renderedPoint.endIndex === this.currentRenderedPoint.endIndex) {
                    renderedPoint.end = this.currentRenderedPoint.end;
                }
                if (renderedPoint.startIndex === this.currentRenderedPoint.startIndex &&
                    renderedPoint.endIndex === this.currentRenderedPoint.endIndex) {
                    renderedPoint.valid = true;
                }
            });
        }
        _updateRenderedPoint(index, renderedPoint, op) {
            let invalidateCurrentRenderedPoint = false;
            if (index <= renderedPoint.startIndex) {
                if (op === 'added') {
                    renderedPoint.startIndex = renderedPoint.startIndex + 1;
                    renderedPoint.endIndex = renderedPoint.endIndex + 1;
                }
                else if (op === 'removed') {
                    renderedPoint.startIndex = renderedPoint.startIndex - 1;
                    renderedPoint.endIndex = renderedPoint.endIndex - 1;
                }
                invalidateCurrentRenderedPoint = true;
            }
            else if (index <= renderedPoint.endIndex) {
                if (op === 'added') {
                    renderedPoint.endIndex = renderedPoint.endIndex + 1;
                }
                else if (op === 'removed') {
                    renderedPoint.endIndex = renderedPoint.endIndex - 1;
                }
                invalidateCurrentRenderedPoint = true;
            }
            if (invalidateCurrentRenderedPoint) {
                renderedPoint.valid = false;
            }
        }
        _updateRenderedPoints(index, op) {
            this.renderedPoints.forEach((renderedPoint) => {
                this._updateRenderedPoint(index, renderedPoint, op);
            });
        }
        _handleItemsAddedOrRemoved(indexes, op) {
            indexes.forEach((index) => {
                this._updateRenderedPoint(index, this.currentRenderedPoint, op);
                this._updateRenderedPoints(index, op);
            });
        }
        handleItemsAdded(indexes) {
            this._handleItemsAddedOrRemoved(indexes, 'added');
            this.rowCount = this.rowCount + indexes.length;
        }
        handleItemsRemoved(indexes) {
            this._handleItemsAddedOrRemoved(indexes, 'removed');
            this.rowCount = Math.max(0, this.rowCount - indexes.length);
        }
        handleItemsUpdated(indexes) {
            let invalidateCurrentRenderedPoint = false;
            indexes.forEach((index) => {
                if (index >= this.currentRenderedPoint.startIndex &&
                    index <= this.currentRenderedPoint.endIndex) {
                    invalidateCurrentRenderedPoint = true;
                }
            });
            if (invalidateCurrentRenderedPoint) {
                this.currentRenderedPoint.start = null;
                this.currentRenderedPoint.end = null;
            }
        }
        _log(msg) {
            Logger.info('[VirtualizeDomScroller]=> ' + msg);
        }
    }

    class IteratingDataProviderContentHandler extends DataProviderContentHandler {
        constructor(root, dataProvider, callback, scrollPolicyOptions) {
            super(root, dataProvider, callback);
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.scrollPolicyOptions = scrollPolicyOptions;
            this.fetchRows = () => {
                if (this.isReady()) {
                    this.setFetching(true);
                    let options = { clientId: this._clientId };
                    options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                    this.dataProviderAsyncIterator = this.getDataProvider()
                        .fetchFirst(options)[Symbol.asyncIterator]();
                    let promise = this.dataProviderAsyncIterator.next();
                    let fetchSize = options.size;
                    let helperFunction = (value) => {
                        if (value.done ||
                            fetchSize !== -1 ||
                            typeof this.getDataProvider().getPageCount === 'function') {
                            return value;
                        }
                        let nextPromise = this.dataProviderAsyncIterator.next();
                        let fetchMoreData = nextPromise.then(function (nextValue) {
                            value.done = nextValue.done;
                            value.value.data = value.value.data.concat(nextValue.value.data);
                            value.value.metadata = value.value.metadata.concat(value.value.metadata);
                            return helperFunction(value);
                        }, function (reason) {
                            this._handleFetchError(reason);
                        });
                        return fetchMoreData;
                    };
                    promise
                        .then((value) => {
                        return helperFunction(value);
                    }, (reason) => {
                        this._handleFetchError(reason);
                    })
                        .then((value) => {
                        if (this.isFetching()) {
                            if (this.callback == null) {
                                return;
                            }
                            this.initialFetch = true;
                            this.callback.setData(value);
                        }
                    }, (reason) => {
                        this._handleFetchError(reason);
                    });
                }
            };
            this._registerDomScroller = () => {
                let options = {
                    fetchSize: this.getFetchSize(),
                    maxCount: this._getMaxCount(),
                    initialRowCount: this.getFetchSize(),
                    strategy: exports.VirtualizationStrategy.HIGH_WATER_MARK,
                    success: (result) => {
                        this.handleFetchSuccess(result);
                    },
                    error: (reason) => {
                        this._handleFetchError(reason);
                    },
                    beforeFetchNext: (scrollTop) => {
                        return this.handleBeforeFetchNext(scrollTop);
                    },
                    beforeFetchByOffset: (startIndex, endIndex) => {
                        this.handleBeforeFetchByOffset(startIndex, endIndex);
                    }
                };
                this.domScroller = new VirtualizeDomScroller(this._getScroller(), this.getDataProvider(), this.dataProviderAsyncIterator, options);
            };
            this._clientId = Symbol();
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
            return true;
        }
        _getScroller() {
            const scroller = this.scrollPolicyOptions.scroller;
            return scroller != null ? scroller : this.root;
        }
        getFetchSize() {
            return this.scrollPolicyOptions.fetchSize;
        }
        _getMaxCount() {
            return this.scrollPolicyOptions.maxCount;
        }
        isInitialFetch() {
            return this.initialFetch;
        }
        renderSkeletonsForLoadMore() { }
        renderFetchedData() {
            if (this.callback == null) {
                return;
            }
            let result = this._renderOutOfRangeData();
            const dataObj = this.callback.getData();
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
                            Logger.info('handleFetchedData: zero data returned while done flag is false');
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
                this.setFetching(false);
                return result;
            }
        }
        handleBeforeFetchNext(scrollTop) {
        }
        handleBeforeFetchByOffset(startIndex, endIndex) {
        }
        handleFetchSuccess(result) {
            if (result != null) {
                this.callback.setData(result);
            }
        }
        _handleFetchError(reason) {
            Logger.error('an error occurred during data fetch, reason: ' + reason);
        }
        _handleScrollerMaxRowCount() {
        }
        renderData(data, metadata) {
            if (this.callback == null) {
                return null;
            }
            let children = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i] == null || metadata[i] == null) {
                    continue;
                }
                if (!this.verifyKey(metadata[i].key)) {
                    Logger.error('encounted a key with invalid data type.  Acceptable data types for key are: ' +
                        this.validKeyTypes);
                    children = [];
                    break;
                }
                let child = this.addItem(metadata[i].key, i, data[i], true);
                if (child) {
                    children.push(child);
                }
            }
            return children;
        }
        _renderOutOfRangeData() {
            let children = [];
            let outOfRangeData = this.callback.getOutOfRangeData();
            if (outOfRangeData != null) {
                outOfRangeData.forEach((result) => {
                    const data = result.data;
                    const metadata = result.metadata;
                    const child = this.addItem(metadata.key, 0, data, false);
                    if (child) {
                        children.push(child);
                    }
                });
            }
            return children;
        }
        _handleItemsMutated(detail, keyField, callback, withinRangeDataCallback, handleOutOfRangeData) {
            this.callback.updateData(function (currentData) {
                let newData = {
                    startIndex: currentData.startIndex,
                    done: currentData.done,
                    value: {
                        data: currentData.value.data.slice(0),
                        metadata: currentData.value.metadata.slice(0)
                    }
                };
                let outOfRangeData = [];
                let indexes = detail.indexes;
                const keys = Array.from(detail[keyField]);
                if (indexes == null) {
                    indexes = keys.map((key) => {
                        return this._findIndex(currentData.value.metadata, key);
                    });
                }
                if (this.domScroller) {
                    callback(indexes);
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
                    else if (handleOutOfRangeData) {
                        outOfRangeData.push({
                            data: data,
                            metadata: metadata
                        });
                    }
                });
                if (handleOutOfRangeData) {
                    return { outOfRangeData: outOfRangeData, renderedData: newData };
                }
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
            this.callback.updateData(function (currentData) {
                let newData = {
                    startIndex: currentData.startIndex,
                    done: currentData.done,
                    maxCountLimit: currentData.maxCountLimit,
                    value: {
                        data: currentData.value.data.slice(0),
                        metadata: currentData.value.metadata.slice(0)
                    }
                };
                let outOfRangeData = [];
                let indexes = detail.indexes;
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
                    keys.forEach(function () {
                        const data = detail.data[i];
                        const metadata = detail.metadata[i];
                        let index = -1;
                        if (addBeforeKeys != null && addBeforeKeys[i] != null) {
                            index = this._findIndex(newData.value.metadata, addBeforeKeys[i]);
                        }
                        else if (indexes != null && indexes[i] != null) {
                            index = indexes[i];
                        }
                        if (index > -1 && index <= newData.value.data.length) {
                            newData.value.data.splice(index, 0, data);
                            newData.value.metadata.splice(index, 0, metadata);
                        }
                        else {
                            if (newData.done && !newData.maxCountLimit) {
                                newData.value.data.push(data);
                                newData.value.metadata.push(metadata);
                            }
                            else {
                                outOfRangeData.push({
                                    data: data,
                                    metadata: metadata
                                });
                            }
                        }
                        i++;
                    }.bind(this));
                }
                if (this.domScroller && this.domScroller.handleItemsAdded) {
                    this.domScroller.handleItemsAdded(indexes);
                }
                return { renderedData: newData, outOfRangeData: outOfRangeData };
            }.bind(this));
            super.handleItemsAdded(detail);
        }
        handleItemsRemoved(detail) {
            this._handleItemsMutated(detail, 'keys', (indexes) => {
                this.domScroller.handleItemsRemoved(indexes);
            }, (newData, key) => {
                let index = this._findIndex(newData.value.metadata, key);
                if (index > -1) {
                    newData.value.data.splice(index, 1);
                    newData.value.metadata.splice(index, 1);
                }
            }, false);
            super.handleItemsRemoved(detail);
        }
        handleCurrentRangeItemUpdated(key) { }
        handleItemsUpdated(detail) {
            this._handleItemsMutated(detail, 'keys', (indexes) => {
                this.domScroller.handleItemsUpdated(indexes);
            }, (newData, key, index, data, metadata) => {
                newData.value.data.splice(index, 1, data);
                newData.value.metadata.splice(index, 1, metadata);
                this.handleCurrentRangeItemUpdated(key);
            }, true);
            super.handleItemsUpdated(detail);
        }
    }

    class IteratingTreeDataProviderContentHandler extends DataProviderContentHandler {
        constructor(root, dataProvider, callback, scrollPolicyOptions) {
            super(root, dataProvider, callback);
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.scrollPolicyOptions = scrollPolicyOptions;
            this.fetchRows = () => {
                if (this.isReady()) {
                    let options = { clientId: this._clientId };
                    options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                    let iterator = this.getDataProvider().fetchFirst(options)[Symbol.asyncIterator]();
                    this._cachedIteratorsAndResults['root'] = { iterator: iterator, cache: null };
                    let finalResults = { value: { data: [], metadata: [] } };
                    this._fetchNextFromIterator(iterator, null, options, finalResults).then(this._setNewData);
                }
            };
            this._fetchNextFromIterator = (iterator, key, options, finalResults) => {
                if (iterator == null) {
                    return Promise.resolve();
                }
                this.setFetching(true);
                let promise = iterator.next();
                let fetchSize = options.size;
                let helperFunction = (value) => {
                    if (value.done ||
                        fetchSize !== -1 ||
                        typeof this.getDataProvider().getPageCount === 'function') {
                        return value;
                    }
                    let nextPromise = iterator.next();
                    let fetchMoreData = nextPromise.then(function (nextValue) {
                        value.done = nextValue.done;
                        value.value.data = value.value.data.concat(nextValue.value.data);
                        value.value.metadata = value.value.metadata.concat(value.value.metadata);
                        return helperFunction(value);
                    }, function (reason) {
                        this._handleFetchError(reason);
                    });
                    return fetchMoreData;
                };
                return promise
                    .then((value) => {
                    return helperFunction(value);
                }, () => {
                    this._handleFetchError();
                })
                    .then((value) => {
                    if (this.isFetching()) {
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
                }, () => {
                    this._handleFetchError();
                });
            };
            this._setNewData = (result) => {
                if (this.callback == null) {
                    return;
                }
                this.callback.updateData(function (data) {
                    let final;
                    let dataToSet = result.value.data;
                    let metadataToSet = result.value.metadata;
                    if (data == null) {
                        final = {
                            value: { data: dataToSet, metadata: metadataToSet },
                            done: this._checkIteratorAndCache()
                        };
                    }
                    else {
                        final = {
                            value: {
                                data: data.value.data.concat(dataToSet),
                                metadata: data.value.metadata.concat(metadataToSet)
                            },
                            done: this._checkIteratorAndCache()
                        };
                    }
                    return { renderedData: final };
                }.bind(this));
            };
            this._checkIteratorAndCache = () => {
                let cache = this._cachedIteratorsAndResults;
                let values = Object.keys(cache).map(function (e) {
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
                    let lastEntryMetadata = this._getLastEntryMetadata();
                    let key = lastEntryMetadata.key;
                    if (lastEntryMetadata.isLeaf || !this._isExpanded(key)) {
                        key = lastEntryMetadata.parentKey;
                    }
                    let options = {};
                    options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                    let cacheInfo = this._cachedIteratorsAndResults[key === null ? 'root' : key];
                    let result = null;
                    let iterator = null;
                    if (cacheInfo != null) {
                        result = cacheInfo.cache;
                        iterator = cacheInfo.iterator;
                    }
                    let finalResults = { value: { data: [], metadata: [] } };
                    return this.handleNextItemInResults(options, key, result, finalResults).then(this._fetchFromAncestors.bind(this, options, key, iterator, finalResults));
                }
                return Promise.resolve();
            };
            this._fetchFromAncestors = (options, key, iterator, finalResults) => {
                let self = this;
                let handleFetchFromAncestors = function (lastParentKey, finalResults) {
                    if (self._checkFinalResults(options, finalResults) || lastParentKey === null) {
                        finalResults.done = this._checkIteratorAndCache();
                        return Promise.resolve(finalResults);
                    }
                    let lastEntry = self._getItemByKey(lastParentKey, finalResults);
                    let lastEntryParentKey = lastEntry.metadata.parentKey;
                    let cacheInfo = this._cachedIteratorsAndResults[lastEntryParentKey === null ? 'root' : lastEntryParentKey];
                    let result = null;
                    let parentIterator = null;
                    if (cacheInfo != null) {
                        result = cacheInfo.cache;
                        parentIterator = cacheInfo.iterator;
                    }
                    return this.handleNextItemInResults(options, lastEntryParentKey, result, finalResults).then(this._fetchFromAncestors.bind(this, options, lastEntryParentKey, parentIterator, finalResults));
                };
                return this._fetchNextFromIterator(iterator, key, options, finalResults).then(handleFetchFromAncestors.bind(this, key, finalResults));
            };
            this._getLastEntryMetadata = () => {
                let result = this.callback.getData();
                if (result && result.value.metadata.length) {
                    let metadata = result.value.metadata;
                    return metadata[metadata.length - 1];
                }
                return null;
            };
            this._isExpanded = (key) => {
                let expanded = this.callback.getExpanded();
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
                    finalResults.done = this._checkIteratorAndCache();
                    return Promise.resolve(finalResults);
                }
                let data = results.value.data.shift();
                let metadata = results.value.metadata.shift();
                let updatedMetadata = this._updateMetadata(metadata, parentKey, finalResults);
                finalResults.value.data.push(data);
                finalResults.value.metadata.push(updatedMetadata);
                if (this._isExpanded(updatedMetadata.key)) {
                    let childDataProvider = this.getChildDataProvider(updatedMetadata.key);
                    if (childDataProvider != null) {
                        let options = { clientId: this._clientId };
                        options.size = this._isLoadMoreOnScroll() ? this.getFetchSize() : -1;
                        let iterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
                        this._cachedIteratorsAndResults[updatedMetadata.key === null ? 'root' : updatedMetadata.key] = { iterator: iterator, cache: null };
                        let childrenPromise = this._fetchNextFromIterator(iterator, updatedMetadata.key, options, finalResults);
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
                let lastEntry = this._getLastItemByParentKey(parentKey, finalResults);
                let indexFromParent = lastEntry == null ? 0 : lastEntry.metadata.indexFromParent + 1;
                let isLeaf = this.getChildDataProvider(metadata.key) === null;
                if (parentKey != null) {
                    let parentItem = this._getItemByKey(parentKey, finalResults);
                    treeDepth = parentItem.metadata.treeDepth + 1;
                }
                let expanded = this._isExpanded(metadata.key);
                return {
                    key: metadata.key,
                    isLeaf: isLeaf,
                    parentKey: parentKey,
                    indexFromParent: indexFromParent,
                    treeDepth: treeDepth,
                    expanded: expanded
                };
            };
            this._getIndexByKey = (key, cache) => {
                var index = -1;
                cache.some(function (item, i) {
                    if (item.key === key) {
                        index = i;
                        return true;
                    }
                });
                return index;
            };
            this._getLastItemByParentKey = (parentKey, finalResults) => {
                var returnItem = null;
                if (finalResults) {
                    finalResults.value.metadata
                        .slice()
                        .reverse()
                        .some(function (metadata, index) {
                        if (metadata.parentKey === parentKey) {
                            returnItem = { data: finalResults.value.data[index], metadata: metadata };
                            return true;
                        }
                    });
                }
                if (returnItem)
                    return returnItem;
                let cache = this.callback.getData();
                if (cache) {
                    cache.value.metadata
                        .slice()
                        .reverse()
                        .some(function (metadata, index) {
                        if (metadata.parentKey === parentKey) {
                            returnItem = { data: cache.value.data[index], metadata: metadata };
                            return true;
                        }
                    });
                }
                return returnItem;
            };
            this._getItemByKey = (key, finalResults) => {
                var returnItem = null;
                if (finalResults) {
                    finalResults.value.metadata.some(function (metadata, index) {
                        if (metadata.key === key) {
                            returnItem = { data: finalResults.value.data[index], metadata: metadata };
                            return true;
                        }
                    });
                }
                if (returnItem)
                    return returnItem;
                let cache = this.callback.getData();
                if (cache) {
                    cache.value.metadata.some(function (metadata, index) {
                        if (metadata.key === key) {
                            returnItem = { data: cache.value.data[index], metadata: metadata };
                            return true;
                        }
                    });
                }
                return returnItem;
            };
            this.expand = (key) => {
                let childDataProvider = this.getChildDataProvider(key);
                if (childDataProvider === null) {
                    return;
                }
                let showSkeletonTimeout = setTimeout(function () {
                    if (this.callback.getExpandingKeys().has(key)) {
                        this.callback.updateSkeletonKeys(key);
                    }
                }.bind(this), 250);
                let options = { clientId: this._clientId, size: -1 };
                let iterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
                return this._fetchNextFromIterator(iterator, key, options, {
                    value: { data: [], metadata: [] }
                }).then(function (finalResults) {
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
                        let updatedData;
                        let newData = finalResults.value.data;
                        let newMetadata = finalResults.value.metadata;
                        if (result) {
                            let data = result.value.data;
                            let metadata = result.value.metadata;
                            let insertIndex = this._getIndexByKey(key, metadata);
                            if (insertIndex !== -1) {
                                updatedData = {
                                    value: {
                                        data: data
                                            .slice(0, insertIndex + 1)
                                            .concat(newData, data.slice(insertIndex + 1)),
                                        metadata: metadata
                                            .slice(0, insertIndex + 1)
                                            .concat(newMetadata, metadata.slice(insertIndex + 1))
                                    },
                                    done: result.done
                                };
                            }
                        }
                        if (updatedData == null) {
                            updatedData = { value: { data: newData, metadata: newMetadata }, done: true };
                        }
                        expandingKeys = expandingKeys.delete([key]);
                        return {
                            expandedSkeletonKeys: skeletonKeys,
                            expandingKeys: expandingKeys,
                            renderedData: updatedData
                        };
                    }.bind(this));
                }.bind(this));
            };
            this.collapse = (key, currentData) => {
                let data = currentData.value.data;
                let metadata = currentData.value.metadata;
                let index = this._findIndex(metadata, key);
                if (index > -1) {
                    let count = this._getLocalDescendentCount(metadata, index);
                    data.splice(index + 1, count);
                    metadata.splice(index + 1, count);
                }
                return {
                    value: {
                        data: data,
                        metadata: metadata
                    },
                    done: currentData.done
                };
            };
            this._getLocalDescendentCount = (metadata, index) => {
                let count = 0;
                let depth = metadata[index].treeDepth;
                let lastIndex = metadata.length;
                for (let j = index + 1; j < lastIndex; j++) {
                    let newMetadata = metadata[j];
                    let newDepth = newMetadata.treeDepth;
                    if (newDepth > depth) {
                        count += 1;
                    }
                    else {
                        return count;
                    }
                }
                return count;
            };
            this._registerDomScroller = () => {
                let options = {
                    asyncIterator: { next: this.fetchMoreRows.bind(this) },
                    fetchSize: this.getFetchSize(),
                    fetchTrigger: this.callback.getSkeletonHeight() * this.getLoadMoreCount(),
                    maxCount: this._getMaxCount(),
                    initialRowCount: this.getFetchSize(),
                    strategy: exports.VirtualizationStrategy.HIGH_WATER_MARK,
                    success: (result) => {
                        this.handleFetchSuccess(result);
                    },
                    error: () => {
                        this._handleFetchError();
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
            this._cachedIteratorsAndResults = {};
            this._clientId = Symbol();
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
            return true;
        }
        _getScroller() {
            const scroller = this.scrollPolicyOptions.scroller;
            return scroller != null ? scroller : this.root;
        }
        getFetchSize() {
            return this.scrollPolicyOptions.fetchSize;
        }
        _getMaxCount() {
            return this.scrollPolicyOptions.maxCount;
        }
        isInitialFetch() {
            return this.initialFetch;
        }
        renderSkeletonsForLoadMore() { }
        renderSkeletonsForExpand(key) { }
        renderFetchedData() {
            if (this.callback == null) {
                return;
            }
            let result = this._renderOutOfRangeData();
            const dataObj = this.callback.getData();
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
                            Logger.info('handleFetchedData: zero data returned while done flag is false');
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
        _handleFetchError() {
            this.setFetching(false);
        }
        _handleScrollerMaxRowCount() {
        }
        renderData(data, metadata) {
            if (this.callback == null) {
                return null;
            }
            let children = [];
            let skeletonKeys = this.callback.getSkeletonKeys();
            for (let i = 0; i < data.length; i++) {
                if (data[i] == null || metadata[i] == null) {
                    continue;
                }
                if (!this.verifyKey(metadata[i].key)) {
                    Logger.error('encounted a key with invalid data type.  Acceptable data types for key are: ' +
                        this.validKeyTypes);
                    children = [];
                    break;
                }
                let child = this.addItem(metadata[i], i, data[i], true);
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
            let children = [];
            return children;
        }
        _handleItemsMutated(detail, keyField, callback, withinRangeDataCallback) {
            if (this.callback == null) {
                return;
            }
            this.callback.updateData(function (currentData, expandingKeys) {
                let newExpandingKeys = expandingKeys;
                let newData = {
                    startIndex: currentData.startIndex,
                    done: currentData.done,
                    value: {
                        data: currentData.value.data.slice(0),
                        metadata: currentData.value.metadata.slice(0)
                    }
                };
                const keys = Array.from(detail[keyField]);
                let indexes = keys.map((key) => {
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
                        let returnVal = withinRangeDataCallback(newData, key, index, data, metadata, newExpandingKeys);
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
        handleModelRefresh() {
            if (this.domScroller) {
                this.domScroller.destroy();
            }
            this.domScroller = null;
            this._cachedIteratorsAndResults = {};
            super.handleModelRefresh();
        }
        handleItemsAdded(detail) {
            if (this.callback == null) {
                return;
            }
            this.callback.updateData(function (currentData, expandingKeys) {
                let newData = {
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
                let keysToExpand = [];
                let newMetadata;
                if (indexes == null && addBeforeKeys == null && parentKeys == null) {
                    if (newData.done && !newData.maxCountLimit) {
                        newData.value.data.push(detail.data);
                        newMetadata = this._updateMetadata(detail.metadata, null, newData);
                        newData.value.metadata.push(newMetadata);
                    }
                }
                else if (parentKeys != null) {
                    if (indexes == null) {
                        indexes = [];
                    }
                    parentKeys.forEach(function (parentKey, i) {
                        const data = detail.data[i];
                        const metadata = detail.metadata[i];
                        let index = -1;
                        if (parentKey === null ||
                            (this._isExpanded(parentKey) && this._getItemByKey(parentKey))) {
                            if (addBeforeKeys != null) {
                                if (addBeforeKeys[i] != null) {
                                    let beforeIndex = this._findIndex(newData.value.metadata, addBeforeKeys[i]);
                                    index = beforeIndex;
                                }
                                else {
                                    index =
                                        this._findIndex(newData.value.metadata, this._getLastItemByParentKey(parentKey).metadata.key) + 1;
                                }
                            }
                            else if (indexes != null) {
                                let parentIndex = this._findIndex(newData.value.metadata, parentKey);
                                index = parentIndex === -1 ? indexes[i] + 1 : parentIndex + indexes[i] + 1;
                            }
                            else {
                                index =
                                    this._findIndex(newData.value.metadata, this._getLastItemByParentKey(parentKey).metadata.key) + 1;
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
                            if (newData.done && !newData.maxCountLimit) {
                                newData.value.data.push(data);
                                newData.value.metadata.push(metadata);
                            }
                        }
                    }.bind(this));
                }
                if (this.domScroller && this.domScroller.handleItemsAdded) {
                    this.domScroller.handleItemsAdded(indexes);
                }
                return {
                    expandingKeys: expandingKeys.add(keysToExpand),
                    renderedData: newData
                };
            }.bind(this));
            super.handleItemsAdded(detail);
        }
        handleItemsRemoved(detail) {
            this._handleItemsMutated(detail, 'keys', (indexes) => {
                if (this.domScroller.handleItemsRemoved) {
                    this.domScroller.handleItemsRemoved(indexes);
                }
            }, (newData, key) => {
                let index = this._findIndex(newData.value.metadata, key);
                if (index > -1) {
                    let count = this._getLocalDescendentCount(newData.value.metadata, index) + 1;
                    newData.value.data.splice(index, count);
                    newData.value.metadata.splice(index, count);
                }
            });
            super.handleItemsRemoved(detail);
        }
        handleCurrentRangeItemUpdated() { }
        handleItemsUpdated(detail) {
            this._handleItemsMutated(detail, 'keys', (indexes) => {
                if (this.domScroller.handleItemsUpdated) {
                    this.domScroller.handleItemsUpdated(indexes);
                }
            }, (newData, key, index, data, metadata, expandingKeys) => {
                let oldMetadata = newData.value.metadata[index];
                let wasLeaf = oldMetadata.isLeaf;
                let newMetadata = this._updateMetadata(metadata, oldMetadata.parentKey, {
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
        }
        checkViewport() {
            if (this.domScroller) {
                let fetchPromise = this.domScroller.checkViewport();
                if (fetchPromise != null) {
                    fetchPromise.then(function (result) {
                        if (result != null) {
                            this.handleFetchSuccess(result);
                        }
                    }.bind(this));
                }
            }
        }
    }

    class KeyedElement extends HTMLElement {
    }

    exports.IteratingDataProviderContentHandler = IteratingDataProviderContentHandler;
    exports.IteratingTreeDataProviderContentHandler = IteratingTreeDataProviderContentHandler;
    exports.KeyedElement = KeyedElement;
    exports.VirtualizeDomScroller = VirtualizeDomScroller;

    Object.defineProperty(exports, '__esModule', { value: true });

});
