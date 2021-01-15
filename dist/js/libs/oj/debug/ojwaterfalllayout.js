/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojthemeutils', 'ojs/ojvcomponent-element', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojvcollection', 'ojs/ojdomutils'], function (exports, oj, DataCollectionUtils, AnimationUtils, ThemeUtils, ojvcomponentElement, Context, Logger, ojvcollection, DomUtils) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    Context = Context && Object.prototype.hasOwnProperty.call(Context, 'default') ? Context['default'] : Context;

    class DefaultLayout {
        constructor(dataProvider, fullWidth, gutterWidth, itemWidth, cache) {
            this.dataProvider = dataProvider;
            this.fullWidth = fullWidth;
            this.gutterWidth = gutterWidth;
            this.itemWidth = itemWidth;
            this.cache = cache;
            this.columns = 0;
            this.margin = 0;
            this.columnsInfo = [];
            this.bottom = 0;
            this.keys = [];
            if (dataProvider) {
                this.modelEventHandler = this._handleModelEvent.bind(this);
                dataProvider.addEventListener('mutate', this.modelEventHandler);
            }
            if (this.cache == null) {
                this.cache = new Map();
            }
        }
        destroy() {
            if (this.dataProvider && this.modelEventHandler) {
                this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
            }
        }
        _initializeColumnsInfo() {
            this.columns = Math.max(1, Math.floor(this.fullWidth / (this.itemWidth + this.gutterWidth)));
            this.margin = Math.max(this.gutterWidth, (this.fullWidth - this.columns * (this.itemWidth + this.gutterWidth)) / 2);
            this.columnsInfo.length = this.columns;
            for (let i = 0; i < this.columns; i++) {
                this.columnsInfo[i] = 0;
            }
        }
        _populatePositions(arr, startIndex, keyFunc, cacheHitFunc, cacheMissFunc, resultFunc) {
            for (let k = 0; k < arr.length; k++) {
                let key = keyFunc(arr[k]);
                if (key == null) {
                    continue;
                }
                const index = k + startIndex;
                const colIndex = index % this.columnsInfo.length;
                let itemHeight = undefined;
                const cachedPos = this.cache.get(key);
                if (cachedPos && !isNaN(cachedPos.height)) {
                    itemHeight = cachedPos.height;
                    if (cachedPos.valid !== false && !isNaN(cachedPos.top) && !isNaN(cachedPos.left)) {
                        cacheHitFunc(index, key, colIndex, cachedPos);
                        continue;
                    }
                }
                else {
                    itemHeight = cacheMissFunc(arr[k]);
                }
                if (isNaN(itemHeight)) {
                    return;
                }
                let left = this.margin;
                let val;
                if (index < this.columnsInfo.length) {
                    left += colIndex * (this.itemWidth + this.gutterWidth);
                    val = { top: this.gutterWidth, left: left, height: itemHeight, valid: true };
                    this.columnsInfo[colIndex] = itemHeight + this.gutterWidth * 2;
                    this.bottom = Math.max(this.bottom, itemHeight);
                }
                else {
                    const minTop = this.columnsInfo.reduce((a, b) => {
                        return Math.min(a, b);
                    });
                    const minIndex = this.columnsInfo.indexOf(minTop);
                    left += minIndex * (this.itemWidth + this.gutterWidth);
                    val = { top: minTop, left: left, height: itemHeight, valid: true };
                    this.columnsInfo[minIndex] = this.columnsInfo[minIndex] + itemHeight + this.gutterWidth;
                    this.bottom = Math.max(this.bottom, minTop + itemHeight);
                }
                if (val) {
                    if (this.keys.indexOf(key) === -1) {
                        this.keys.push(key);
                    }
                    this.cache.set(key, val);
                    if (resultFunc) {
                        resultFunc(key, val);
                    }
                }
            }
        }
        setWidth(width) {
            if (this.fullWidth === width) {
                return;
            }
            this.fullWidth = width;
            if (this.columnsInfo.length > 0) {
                this._initializeColumnsInfo();
                this._invalidatePositions(0);
            }
        }
        getPositionForItems(items, startIndex) {
            let positions = new Map();
            if (this.itemWidth == null && items.length > 0) {
                this.itemWidth = items[0].element.offsetWidth;
            }
            if (this.columnsInfo.length === 0) {
                this._initializeColumnsInfo();
            }
            this._populatePositions(items, startIndex, (item) => {
                return item.key;
            }, (index, key, colIndex, cachedPos) => {
                positions.set(key, cachedPos);
            }, (item) => {
                return item.element.offsetHeight;
            }, (key, val) => {
                positions.set(key, val);
            });
            let start = 0;
            let posSet = new Set();
            let posArray = Array.from(positions.values());
            for (let i = 0; i < posArray.length; i++) {
                let key = posArray[i].left;
                if (!posSet.has(key)) {
                    posSet.add(key);
                }
                start = Math.max(start, posArray[i].top);
                if (posSet.size === this.columnsInfo.length) {
                    break;
                }
            }
            posSet.clear();
            let end = Number.MAX_VALUE;
            for (let j = posArray.length - 1; j >= 0; j--) {
                let key = posArray[j].left;
                if (!posSet.has(key)) {
                    posSet.add(key);
                }
                end = Math.min(end, posArray[j].top + posArray[j].height);
                if (posSet.size === this.columnsInfo.length) {
                    break;
                }
            }
            return { start: start, end: end, positions: positions };
        }
        getItemWidth() {
            return this.itemWidth;
        }
        getPositions() {
            return this.cache;
        }
        getPosition(key) {
            return this.cache.get(key);
        }
        getLastItemPosition() {
            return this.bottom;
        }
        getColumnsInfo() {
            return this.columnsInfo.map((val, index) => {
                return { top: val, left: this.margin + index * (this.itemWidth + this.gutterWidth) };
            });
        }
        _handleModelEvent(event) {
            if (event.type === 'mutate') {
                const detail = event['detail'];
                if (detail.add) {
                    const addBeforeKeys = detail.add.addBeforeKeys;
                    if (addBeforeKeys != null) {
                        const keys = Array.from(detail.add.keys);
                        this._insertKeys(addBeforeKeys, keys);
                    }
                }
                if (detail.remove) {
                    const keys = Array.from(detail.remove.keys);
                    this._removeKeys(keys);
                }
                if (detail.update) {
                    const keys = Array.from(detail.update.keys);
                    this._updateKeys(keys);
                }
            }
        }
        _insertKeys(beforeKeys, keys) {
            let minIndex = Number.MAX_VALUE;
            beforeKeys.forEach((beforeKey, i) => {
                const index = this.keys.indexOf(beforeKey);
                const key = keys[i];
                if (index > -1) {
                    minIndex = Math.min(minIndex, index);
                    this.keys.splice(index, 0, key);
                    this.cache.set(key, { top: undefined, left: undefined, height: undefined, valid: false });
                }
            });
            this._invalidatePositions(minIndex);
        }
        _removeKeys(keys) {
            let minIndex = Number.MAX_VALUE;
            keys.forEach((key) => {
                this.cache.delete(key);
                const index = this.keys.indexOf(key);
                if (index > -1) {
                    minIndex = Math.min(minIndex, index);
                    this.keys.splice(index, 1);
                }
            });
            this._invalidatePositions(minIndex);
        }
        _updateKeys(keys) {
            let minIndex = Number.MAX_VALUE;
            keys.forEach((key) => {
                const index = this.keys.indexOf(key);
                if (index > -1) {
                    minIndex = Math.min(minIndex, index + 1);
                    let position = this.getPosition(key);
                    if (position) {
                        position.top = undefined;
                        position.left = undefined;
                        position.height = undefined;
                        position.valid = false;
                    }
                }
            });
            this._invalidatePositions(minIndex);
        }
        _invalidatePositions(fromIndex) {
            for (let i = fromIndex; i < this.keys.length; i++) {
                let position = this.cache.get(this.keys[i]);
                if (position != null) {
                    position.valid = false;
                }
            }
            for (let j = 0; j < this.columns; j++) {
                this.columnsInfo[j] = 0;
            }
            this.recalculatePositions();
        }
        recalculatePositions() {
            this._populatePositions(this.keys, 0, (key) => {
                return key;
            }, (index, key, colIndex, cachedPos) => {
                const itemHeight = cachedPos.height;
                if (index < this.columnsInfo.length) {
                    this.columnsInfo[colIndex] = itemHeight + this.gutterWidth * 2;
                    this.bottom = Math.max(this.bottom, itemHeight);
                }
                else {
                    const minTop = this.columnsInfo.reduce(function (a, b) {
                        return Math.min(a, b);
                    });
                    const minIndex = this.columnsInfo.indexOf(minTop);
                    this.columnsInfo[minIndex] = this.columnsInfo[minIndex] + itemHeight + this.gutterWidth;
                    this.bottom = Math.max(this.bottom, minTop + itemHeight);
                }
            }, (item) => {
                return undefined;
            });
        }
    }

    class WaterfallLayoutContentHandler extends ojvcollection.IteratingDataProviderContentHandler {
        constructor(root, dataProvider, callback, scrollPolicyOptions, gutterWidth) {
            super(root, dataProvider, callback, scrollPolicyOptions);
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.scrollPolicyOptions = scrollPolicyOptions;
            this.gutterWidth = gutterWidth;
            this.postRender = () => {
                const itemsRoot = this.root.lastElementChild.firstElementChild;
                if (itemsRoot && this.adjustPositionsResolveFunc == null) {
                    this.adjustPositionsResolveFunc = this.addBusyState('adjusting item positions');
                    const busyContext = Context.getContext(itemsRoot).getBusyContext();
                    busyContext.whenReady().then(() => {
                        if (this.adjustPositionsResolveFunc) {
                            this.adjustPositionsResolveFunc();
                            this.adjustPositionsResolveFunc = null;
                        }
                        if (this.callback) {
                            const result = this._adjustAllItems();
                            if (result.done) {
                                this.newItemsTracker.clear();
                                if (this.domScroller && !this.domScroller.checkViewport()) {
                                    return;
                                }
                                this.callback.renderComplete(result.items);
                                this.initialFetch = false;
                            }
                        }
                    });
                }
            };
            this.newItemsTracker = new Set();
            this.vnodesCache = new Map();
        }
        destroy() {
            super.destroy();
            if (this.layout) {
                this.layout.destroy();
            }
        }
        getLayout() {
            if (this.layout == null) {
                this.layout = new DefaultLayout(this.dataProvider, this.root.clientWidth, this.gutterWidth, null, null);
            }
            return this.layout;
        }
        _adjustAllItems() {
            let adjusted = true;
            const items = Array.from(this.root.querySelectorAll('.oj-waterfalllayout-item')).map((elem) => {
                if (elem.getAttribute('data-oj-positioned') === 'false') {
                    adjusted = false;
                }
                return { key: this.getKey(elem), element: elem };
            });
            if (adjusted) {
                return { done: true, items: items };
            }
            const startIndex = this.callback.getData().startIndex;
            const positions = this.getLayout().getPositionForItems(items, isNaN(startIndex) ? 0 : startIndex);
            this.callback.setPositions(positions.positions);
            this.callback.setContentHeight(this.getLayout().getLastItemPosition());
            if (this.domScroller) {
                this.domScroller.setViewportRange(positions.start, positions.end);
            }
            return { done: false, items: items };
        }
        handleResizeWidth(newWidth) {
            this.initialFetch = false;
            this.getLayout().setWidth(newWidth);
        }
        fetchSuccess(result) {
            if (result != null) {
                this.newItemsTracker.clear();
            }
            this.initialFetch = false;
            super.fetchSuccess(result);
        }
        beforeFetchByOffset(startIndex, endIndex) {
            if (this.isRenderingViewportOnly()) {
                this.vnodesCache.clear();
            }
            return super.beforeFetchByOffset(startIndex, endIndex);
        }
        addItem(key, index, data, visible) {
            let x = -1;
            let y = -1;
            const position = this.getLayout().getPosition(key);
            if (position != null) {
                if (!isNaN(position.left) && !isNaN(position.top)) {
                    x = position.left;
                    y = position.top;
                }
            }
            else {
                this.newItemsTracker.add(key);
            }
            const initialFetch = this.isInitialFetch();
            const currentItem = this.callback.getCurrentItem();
            if (currentItem == null && initialFetch && index == 0) {
                this.callback.setCurrentItem(key);
            }
            const vnodes = this.renderItem(key, index, data);
            this.decorateItem(vnodes, key, x, y, initialFetch, visible);
            return vnodes;
        }
        renderItem(key, index, data) {
            const node = this.vnodesCache.get(key);
            if (node) {
                if (node.index === index) {
                    return node.vnodes;
                }
                else {
                    this.vnodesCache.clear();
                }
            }
            const renderer = this.callback.getItemRenderer();
            const vnodes = renderer({ data: data, index: index, key: key });
            this.vnodesCache.set(key, { index: index, vnodes: vnodes });
            return vnodes;
        }
        decorateItem(vnodes, key, x, y, initialFetch, visible) {
            let vnode;
            let contentRoot;
            for (let i = 0; i < vnodes.length; i++) {
                vnode = vnodes[i];
                const node = vnode._node;
                if (node.nodeType === 1) {
                    contentRoot = node;
                    break;
                }
            }
            if (contentRoot != null) {
                contentRoot.key = key;
                contentRoot.setAttribute('role', 'gridcell');
                contentRoot.setAttribute('tabIndex', '-1');
                contentRoot.setAttribute('data-oj-positioned', x != -1 && y != -1 ? 'true' : 'false');
                const styleClasses = this.getItemStyleClass(visible, x, y, this.newItemsTracker.has(key), initialFetch);
                styleClasses.forEach((styleClass) => {
                    contentRoot.classList.add(styleClass);
                });
                const inlineStyle = this.getItemInlineStyle(visible, x, y, initialFetch);
                Object.keys(inlineStyle).forEach((prop) => {
                    contentRoot.style[prop] = inlineStyle[prop];
                });
            }
        }
        getItemInlineStyle(visible, x, y, animate) {
            let style = {};
            if (x === -1 || y === -1) {
                style.top = 0;
                style.left = 0;
            }
            else {
                style.left = x + 'px';
                style.top = y + 'px';
            }
            if (visible && x != -1 && y != -1 && !animate) {
                style.visibility = 'visible';
            }
            return style;
        }
        getItemStyleClass(visible, x, y, isNew, animate) {
            let styleClass = [];
            if (visible) {
                styleClass.push('oj-waterfalllayout-item');
                if (x != -1 && y != -1 && !animate && isNew) {
                    styleClass.push('oj-waterfalllayout-new-item');
                }
            }
            return styleClass;
        }
        renderSkeletonsForLoadMore() {
            const layout = this.getLayout();
            const columnsInfo = layout.getColumnsInfo();
            const itemWidth = layout.getItemWidth();
            let skeletons = [];
            const maxTop = Math.max(...columnsInfo.map((column) => {
                return column.top;
            }));
            if (maxTop > 0) {
                const endPos = maxTop + 100;
                this.callback.setContentHeight(endPos);
                let positions = columnsInfo.map((columnInfo) => {
                    return {
                        left: columnInfo.left,
                        top: columnInfo.top,
                        height: endPos - columnInfo.top,
                        width: itemWidth
                    };
                });
                skeletons = this.callback.renderSkeletons(positions);
            }
            return skeletons;
        }
        handleCurrentRangeItemUpdated(key) {
            let position = this.getLayout().getPosition(key);
            if (position) {
                position.top = undefined;
                position.left = undefined;
            }
            super.handleCurrentRangeItemUpdated(key);
        }
        handleItemsUpdated(detail) {
            detail.keys.forEach((key) => {
                this.vnodesCache.delete(key);
            });
            super.handleItemsUpdated(detail);
        }
        handleItemsRemoved(detail) {
            detail.keys.forEach((key) => {
                this.vnodesCache.delete(key);
            });
            super.handleItemsRemoved(detail);
        }
        handleModelRefresh() {
            this.vnodesCache.clear();
            super.handleModelRefresh();
        }
        _log(msg) {
            Logger.info('[WaterfallLayoutContentHandler]=> ' + msg);
        }
    }

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var WaterfallLayout_1;
    class Props {
        constructor() {
            this.data = null;
            this.scrollPolicy = 'loadMoreOnScroll';
            this.scrollPolicyOptions = {
                fetchSize: 25,
                maxCount: 500,
                scroller: null
            };
            this.scrollPosition = { y: 0 };
        }
    }
    exports.WaterfallLayout = WaterfallLayout_1 = class WaterfallLayout extends ojvcomponentElement.ElementVComponent {
        constructor(props) {
            super(props);
            this.restoreFocus = false;
            this.actionableMode = false;
            this.renderCompleted = false;
            this.ticking = false;
            this.setRootElement = (element) => {
                this.root = element;
            };
            this.state = {
                renderedData: null,
                positions: null,
                skeletonPositions: null,
                width: 0,
                height: 0,
                contentHeight: 0
            };
        }
        _handleFocusIn(event) {
            if (this.currentItem) {
                this.focusInHandler(this.currentItem);
            }
        }
        _handleFocusOut(event) {
            if (this.currentItem) {
                this.focusOutHandler(this.currentItem);
            }
        }
        _handleClick(event) {
            this._handleTouchOrClickEvent(event);
        }
        _handleKeyDown(event) {
            if (this.currentItem) {
                let next;
                switch (event.key) {
                    case 'ArrowLeft':
                    case 'Left': {
                        next = this.currentItem.previousElementSibling;
                        break;
                    }
                    case 'ArrowRight':
                    case 'Right': {
                        next = this.currentItem.nextElementSibling;
                        break;
                    }
                    case 'F2': {
                        if (this.actionableMode === false) {
                            this._enterActionableMode();
                        }
                        break;
                    }
                    case 'Escape':
                    case 'Esc': {
                        if (this.actionableMode === true) {
                            this._exitActionableMode();
                        }
                        break;
                    }
                    case 'Tab': {
                        if (this.actionableMode === true && this.currentItem) {
                            if (event.shiftKey) {
                                DataCollectionUtils.handleActionablePrevTab(event, this.currentItem);
                            }
                            else {
                                DataCollectionUtils.handleActionableTab(event, this.currentItem);
                            }
                        }
                        break;
                    }
                }
                if (this.actionableMode === false &&
                    next != null &&
                    next.classList.contains(this.getItemStyleClass())) {
                    this._updateCurrentItem(next);
                }
            }
        }
        _touchStartHandler(event) {
            this._handleTouchOrClickEvent(event);
        }
        render() {
            let content;
            if (this.contentHandler == null) {
                content = this._renderInitialSkeletons(null);
            }
            else {
                const data = this.getData();
                const positions = this.state.skeletonPositions;
                if (data) {
                    if (positions != null && this.contentHandler.isInitialFetch()) {
                        content = this._renderInitialSkeletons(positions.positions);
                    }
                    else {
                        content = this.contentHandler.render();
                        if (this.currentItem && this.currentItem.contains(document.activeElement)) {
                            this.restoreFocus = true;
                        }
                    }
                }
                else if (positions != null) {
                    content = this._renderInitialSkeletons(positions.positions);
                }
            }
            return (ojvcomponentElement.h("oj-waterfall-layout", { ref: this.setRootElement, style: this._getRootElementStyle() },
                ojvcomponentElement.h("div", { onClick: this._handleClick, onKeydown: this._handleKeyDown, onTouchstart: this._touchStartHandler, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut, role: 'grid', "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'] },
                    ojvcomponentElement.h("div", { role: 'row', style: this._getContentDivStyle(), "data-oj-context": true }, content))));
        }
        _getScrollPolicyOptions() {
            return {
                fetchSize: this.props.scrollPolicyOptions.fetchSize,
                maxCount: this.props.scrollPolicyOptions.maxCount,
                scroller: this._getScroller()
            };
        }
        mounted() {
            const root = this.getRootElement();
            if (this.props.data) {
                this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this._getScrollPolicyOptions(), WaterfallLayout_1.gutterWidth);
                this.contentHandler.fetchRows();
            }
            const rootWidth = root.clientWidth;
            const rootHeight = root.clientHeight;
            this.updateState({ width: rootWidth, height: rootHeight });
            let skeleton = root.querySelector('.oj-waterfalllayout-skeleton');
            if (skeleton) {
                this.skeletonWidth = skeleton.clientWidth;
                if (this.contentHandler) {
                    this._delayShowSkeletons();
                }
            }
            if (window['ResizeObserver']) {
                const resizeObserver = new window['ResizeObserver']((entries) => {
                    entries.forEach((entry) => {
                        if (entry.target === root && entry.contentRect) {
                            const currWidth = this.state.width;
                            const newWidth = Math.round(entry.contentRect.width);
                            if (Math.abs(newWidth - currWidth) > WaterfallLayout_1.minResizeWidthThreshold) {
                                this.updateState({ width: newWidth });
                                if (this.getSkeletonPositions() != null) {
                                    this._updatePositionsForSkeletons(newWidth);
                                }
                                else if (this.getPositions() != null && this.contentHandler) {
                                    this.contentHandler.getLayout().setWidth(newWidth);
                                    if (this.renderCompleted) {
                                        this.contentHandler.handleResizeWidth(newWidth);
                                    }
                                }
                            }
                            const currHeight = this.state.height;
                            const newHeight = Math.round(entry.contentRect.height);
                            if (Math.abs(newHeight - currHeight) > 1 && newHeight !== this.state.contentHeight) {
                                this.updateState({ height: newHeight });
                            }
                        }
                    });
                });
                resizeObserver.observe(root);
                this.resizeObserver = resizeObserver;
            }
            DomUtils.makeFocusable({
                applyHighlight: true,
                setupHandlers: (focusInHandler, focusOutHandler) => {
                    let noJQHandlers = DataCollectionUtils.getNoJQFocusHandlers(focusInHandler, focusOutHandler);
                    this.focusInHandler = noJQHandlers.focusIn;
                    this.focusOutHandler = noJQHandlers.focusOut;
                }
            });
            this._getScroller().addEventListener('scroll', this.scrollListener);
        }
        _handleNewData() {
            this.updateState({ renderedData: null, positions: null });
            if (this.contentHandler) {
                this.contentHandler.destroy();
            }
            this.currentKey = null;
            this.currentItem = null;
            const root = this.getRootElement();
            this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this._getScrollPolicyOptions(), WaterfallLayout_1.gutterWidth);
            this.contentHandler.fetchRows();
            this._delayShowSkeletons();
        }
        updated(oldProps, oldState) {
            const data = this.getData();
            if (data != null) {
                if (oldState.renderedData == null) {
                    const skeletons = this._findSkeletons();
                    if (skeletons.length > 0) {
                        this._applySkeletonExitAnimation(skeletons).then(() => {
                            this.updateState({ skeletonPositions: null });
                        });
                    }
                    else {
                        this.updateState({ skeletonPositions: null });
                        this.contentHandler.postRender();
                    }
                }
                else if (this.props.data != oldProps.data) {
                    const resolveFunc = this.addBusyState('apply exit animations on existing items');
                    this._applyExitAnimation().then(() => {
                        resolveFunc();
                        this._handleNewData();
                    });
                }
                else if (oldState.positions == null && this.state.positions != null) {
                    this._applyEntranceAnimation();
                    if (!this.renderCompleted && this.contentHandler) {
                        this.contentHandler.postRender();
                    }
                }
                else if (oldState.positions != null &&
                    this.state.positions != null &&
                    oldState.positions.size < this.state.positions.size) {
                    this._applyLoadMoreEntranceAnimation();
                    if (!this.renderCompleted && this.contentHandler) {
                        this.contentHandler.postRender();
                    }
                }
                else if (this.contentHandler) {
                    this.contentHandler.postRender();
                }
                if (!oj.Object.compareValues(this.props.scrollPosition, oldProps.scrollPosition) &&
                    !oj.Object.compareValues(this.props.scrollPosition, this.lastInternalScrollPositionUpdate)) {
                    this._syncScrollTopWithProps();
                }
            }
            else {
                if (this.props.data && oldProps.data == null) {
                    this._handleNewData();
                }
            }
        }
        unmounted() {
            if (this.contentHandler) {
                this.contentHandler.destroy();
            }
            this.contentHandler = null;
            if (this.resizeObserver) {
                this.resizeObserver.disconnect();
            }
            this.resizeObserver = null;
            if (this.scrollListener && this._getScroller() != null) {
                this._getScroller().removeEventListener('scroll', this.scrollListener);
            }
        }
        _delayShowSkeletons() {
            window.setTimeout(() => {
                const data = this.getData();
                if (data == null) {
                    this._updatePositionsForSkeletons(this.state.width);
                }
            }, this._getShowSkeletonsDelay());
        }
        _updatePositionsForSkeletons(width) {
            const positions = this._getPositionsForSkeletons(50, width, this.skeletonWidth);
            this.updateState({ skeletonPositions: positions });
        }
        _getOptionDefaults() {
            if (this.defaultOptions == null) {
                this.defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-waterfalllayout-option-defaults');
            }
            return this.defaultOptions;
        }
        _getShowSkeletonsDelay() {
            const defaultOptions = this._getOptionDefaults();
            const delay = parseInt(defaultOptions.showIndicatorDelay, 10);
            return isNaN(delay) ? 0 : delay;
        }
        addBusyState(description) {
            const root = this.getRootElement();
            const componentBusyContext = Context.getContext(root).getBusyContext();
            return componentBusyContext.addBusyState({ description: description });
        }
        _isReady() {
            const root = this.getRootElement();
            const componentBusyContext = Context.getContext(root).getBusyContext();
            return componentBusyContext.isReady();
        }
        _findSkeletons() {
            const skeletons = this.getRootElement().querySelectorAll('.oj-waterfalllayout-skeleton');
            return skeletons.length > 1 ? skeletons : [];
        }
        getRootElement() {
            return this.root;
        }
        isAvailable() {
            return this.contentHandler != null;
        }
        getCurrentItem() {
            return this.currentKey;
        }
        setCurrentItem(item) {
            this.currentKey = item;
        }
        getData() {
            return this.state.renderedData;
        }
        setData(data) {
            if (data != null) {
                this.renderCompleted = false;
            }
            this.updateState({ renderedData: data });
            const skeletons = this._findSkeletons();
            if (data == null || skeletons.length === 0) {
                this.updateState({ skeletonPositions: null });
            }
        }
        updateData(updater) {
            this.updateState(function (state) {
                let currentData = state.renderedData;
                let returnVal = updater(currentData);
                return returnVal;
            }.bind(this));
        }
        getSkeletonPositions() {
            return this.state.skeletonPositions;
        }
        setSkeletonPositions(positions) {
            this.updateState({ skeletonPositions: positions });
        }
        getPositions() {
            return this.state.positions;
        }
        setPositions(positions) {
            this.updateState({ positions: positions });
        }
        setContentHeight(height) {
            if (this.props.scrollPolicyOptions.scroller != null) {
                this.updateState({ contentHeight: height });
            }
        }
        getItemRenderer() {
            return this.props.itemTemplate;
        }
        getItemStyleClass() {
            return 'oj-waterfalllayout-item';
        }
        getExpanded() { }
        _applySkeletonExitAnimation(skeletons) {
            const resolveFunc = this.addBusyState('apply skeleton exit animations');
            return new Promise((resolve, reject) => {
                let promise;
                skeletons.forEach((skeleton) => {
                    promise = AnimationUtils.fadeOut(skeleton);
                });
                if (promise) {
                    promise.then(() => {
                        resolveFunc();
                        resolve(true);
                    });
                }
            });
        }
        _applyEntranceAnimation() {
            const root = this.getRootElement();
            const items = root.querySelectorAll('.' + this.getItemStyleClass());
            if (items.length === 0) {
                return Promise.resolve(true);
            }
            const promises = [];
            items.forEach((item, index) => {
                let elem = item;
                elem.style.visibility = 'visible';
                const currentTransition = elem.style.transition;
                elem.style.transition = 'none';
                const delay = Math.min(1000, index * 50) + 'ms';
                const duration = '300ms';
                const promise = AnimationUtils.slideIn(item, {
                    offsetY: '300px',
                    delay: delay,
                    duration: duration
                });
                promises.push(promise);
                promises.push(AnimationUtils.fadeIn(item, { delay: delay, duration: duration }));
                promise.then(() => {
                    elem.style.transition = currentTransition;
                });
            });
            return Promise.all(promises);
        }
        _applyExitAnimation() {
            const root = this.getRootElement();
            const items = root.querySelectorAll('.' + this.getItemStyleClass());
            if (items.length === 0) {
                return Promise.resolve(true);
            }
            const promises = [];
            items.forEach((item) => {
                const duration = '300ms';
                promises.push(AnimationUtils.slideOut(item, { offsetY: '300px', duration: duration, persist: 'all' }));
                promises.push(AnimationUtils.fadeOut(item, { duration: duration, persist: 'all' }));
            });
            return Promise.all(promises);
        }
        _applyLoadMoreEntranceAnimation() {
            const root = this.getRootElement();
            const items = root.querySelectorAll('.oj-waterfalllayout-new-item');
            if (items.length === 0) {
                return Promise.resolve(true);
            }
            const promises = [];
            items.forEach((item) => {
                item.classList.remove('oj-waterfalllayout-new-item');
                promises.push(AnimationUtils.fadeIn(item, { duration: '150ms' }));
            });
            return Promise.all(promises);
        }
        scrollListener(event) {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    if (this.isAvailable()) {
                        this._updateScrollPosition();
                    }
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }
        _updateScrollPosition() {
            var _a, _b;
            const scrollTop = this._getScroller().scrollTop;
            const iterator = this.contentHandler.getLayout().getPositions().entries();
            let result = iterator.next();
            let key;
            let maxTop = 0;
            while (!result.done) {
                let entry = result.value;
                result = iterator.next();
                let top = entry[1].top;
                if (top > scrollTop) {
                    if (key === undefined) {
                        key = entry[0];
                    }
                    break;
                }
                else if (top > maxTop) {
                    key = entry[0];
                    maxTop = top;
                }
            }
            const offsetY = Math.abs(scrollTop - maxTop);
            const scrollPosition = {
                y: scrollTop,
                key: key,
                offsetY: offsetY
            };
            this.lastInternalScrollPositionUpdate = scrollPosition;
            (_b = (_a = this.props).onScrollPositionChanged) === null || _b === void 0 ? void 0 : _b.call(_a, scrollPosition);
        }
        _syncScrollTopWithProps() {
            let scrollPosition = this.props.scrollPosition;
            let scrollTop;
            const key = scrollPosition.key;
            if (key) {
                const pos = this.contentHandler.getLayout().getPosition(key);
                if (pos != null) {
                    scrollTop = pos.top;
                }
                else {
                    return;
                }
                const offsetY = scrollPosition.offsetY;
                if (!isNaN(offsetY)) {
                    scrollTop = scrollTop + offsetY;
                }
            }
            else {
                const y = scrollPosition.y;
                if (!isNaN(y)) {
                    scrollTop = y;
                }
                else {
                    return;
                }
            }
            if (scrollTop > this._getScroller().scrollHeight) {
                return;
            }
            this._getScroller().scrollTop = scrollTop;
        }
        _handleTouchOrClickEvent(event) {
            let target = event.target;
            let item = target.closest('.' + this.getItemStyleClass());
            this._updateCurrentItem(item);
        }
        _resetFocus(elem) {
            this.focusOutHandler(elem);
            elem.tabIndex = -1;
        }
        _setFocus(elem, focus) {
            elem.tabIndex = 0;
            if (focus) {
                this.focusInHandler(elem);
                elem.focus();
            }
        }
        _updateCurrentItem(item) {
            if (this.currentItem) {
                let currentElem = this.currentItem;
                this._resetFocus(currentElem);
            }
            this.currentItem = item;
            const elem = item;
            this.currentKey = elem.key;
            this._setFocus(elem, true);
            this._scrollToVisible(elem);
        }
        _scrollToVisible(elem) {
            const top = elem.offsetTop;
            const height = elem.offsetHeight;
            const container = this._getScroller();
            const containerScrollTop = container.scrollTop;
            const containerHeight = container.offsetHeight;
            if (top >= containerScrollTop && top + height <= containerScrollTop + containerHeight) {
                return;
            }
            const scrollTop = Math.max(0, Math.min(top, Math.abs(top + height - containerHeight)));
            container.scrollTop = scrollTop;
        }
        _getScroller() {
            let scroller = this.props.scrollPolicyOptions.scroller;
            if (typeof scroller === 'string') {
                scroller = document.querySelector(scroller);
            }
            return scroller != null ? scroller : this.getRootElement();
        }
        _getContentDivStyle() {
            return { height: this.state.contentHeight + 'px' };
        }
        _getRootElementStyle() {
            return this.props.scrollPolicyOptions.scroller != null ? { overflow: 'hidden' } : null;
        }
        _renderInitialSkeletons(positions) {
            const scroller = this._getScroller();
            if (scroller != null) {
                scroller.scrollTop = 0;
            }
            if (positions == null) {
                return this._renderSkeleton(null);
            }
            else {
                const count = positions.size;
                let skeletons = [];
                for (let i = 0; i < count; i++) {
                    let position = positions.get(i);
                    skeletons.push(this._renderSkeleton(position));
                }
                return ojvcomponentElement.h("div", { role: 'row' }, skeletons);
            }
        }
        _getPositionsForSkeletons(count, rootWidth, skeletonWidth) {
            let items = [];
            let cache = new Map();
            for (let i = 0; i < count; i++) {
                const height = 150 + (i % 3) * 100;
                cache.set(i, {
                    height: height
                });
                items.push({
                    key: i
                });
            }
            let layout = new DefaultLayout(null, rootWidth, WaterfallLayout_1.gutterWidth, skeletonWidth, cache);
            let positions = layout.getPositionForItems(items, 0);
            return positions;
        }
        _isInViewport(item) {
            let itemElem = item;
            let top = parseInt(itemElem.style.top, 10);
            let scrollTop = this._getScroller().scrollTop;
            return top >= scrollTop && top <= scrollTop + this.state.height;
        }
        _restoreCurrentItem(items) {
            if (this.currentKey != null) {
                for (let i = 0; i < items.length; i++) {
                    if (oj.KeyUtils.equals(items[i].key, this.currentKey)) {
                        const elem = items[i].element;
                        if (this.restoreFocus && this._isInViewport(elem)) {
                            this._updateCurrentItem(elem);
                        }
                        else {
                            this._setFocus(elem, false);
                            this.currentItem = elem;
                        }
                        break;
                    }
                }
            }
            this.restoreFocus = false;
        }
        _disableAllTabbableElements(items) {
            items.forEach((item) => {
                DataCollectionUtils.disableAllFocusableElements(item.element, true);
            });
        }
        _enterActionableMode() {
            this.actionableMode = true;
            if (this.currentItem) {
                const elems = DataCollectionUtils.enableAllFocusableElements(this.currentItem, true);
                if (elems && elems.length > 0) {
                    elems[0].focus();
                }
            }
        }
        _exitActionableMode() {
            this.actionableMode = false;
            if (this.currentItem) {
                DataCollectionUtils.disableAllFocusableElements(this.currentItem, true);
                this._setFocus(this.currentItem, true);
            }
        }
        renderComplete(items) {
            this.renderCompleted = true;
            this.actionableMode = false;
            this._disableAllTabbableElements(items);
            this._restoreCurrentItem(items);
        }
        renderSkeletons(positions) {
            let skeletons = [];
            positions.forEach((position) => {
                skeletons.push(this._renderSkeleton(position));
            });
            return skeletons;
        }
        _renderSkeleton(position) {
            let style;
            if (position == null) {
                style = { visibility: 'hidden' };
            }
            else {
                style = {
                    top: position.top + 'px',
                    left: position.left + 'px',
                    height: position.height + 'px'
                };
                if (!isNaN(position.width)) {
                    style.width = position.width + 'px';
                }
            }
            return (ojvcomponentElement.h("div", { class: 'oj-waterfalllayout-skeleton', style: style },
                ojvcomponentElement.h("div", { class: 'oj-waterfalllayout-skeleton-content oj-animation-skeleton' })));
        }
    };
    exports.WaterfallLayout.gutterWidth = 20;
    exports.WaterfallLayout.minResizeWidthThreshold = 10;
    exports.WaterfallLayout.metadata = { "extension": { "_DEFAULTS": Props, "_ROOT_PROPS_MAP": { "aria-label": 1, "aria-labelledby": 1 }, "_WRITEBACK_PROPS": ["scrollPosition"], "_READ_ONLY_PROPS": [] }, "properties": { "data": { "type": "object|null", "value": null }, "scrollPolicy": { "type": "string", "enumValues": ["loadAll", "loadMoreOnScroll"], "value": "loadMoreOnScroll" }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number", "value": 25 }, "maxCount": { "type": "number", "value": 500 }, "scroller": { "type": "Element|string|null", "value": null } } }, "scrollPosition": { "type": "object", "properties": { "y": { "type": "number", "value": 0 }, "key": { "type": "any" }, "offsetY": { "type": "number" } }, "writeback": true } }, "slots": { "itemTemplate": { "data": {} } } };
    __decorate([
        ojvcomponentElement.listener()
    ], exports.WaterfallLayout.prototype, "_handleFocusIn", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.WaterfallLayout.prototype, "_handleFocusOut", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.WaterfallLayout.prototype, "_handleClick", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.WaterfallLayout.prototype, "_handleKeyDown", null);
    __decorate([
        ojvcomponentElement.listener({ passive: true })
    ], exports.WaterfallLayout.prototype, "_touchStartHandler", null);
    __decorate([
        ojvcomponentElement.listener()
    ], exports.WaterfallLayout.prototype, "scrollListener", null);
    exports.WaterfallLayout = WaterfallLayout_1 = __decorate([
        ojvcomponentElement.customElement('oj-waterfall-layout')
    ], exports.WaterfallLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
