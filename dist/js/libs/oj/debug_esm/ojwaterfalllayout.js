/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { jsx } from 'preact/jsx-runtime';
import { h, Component } from 'preact';
import { Root, customElement } from 'ojs/ojvcomponent';
import oj from 'ojs/ojcore-base';
import { handleActionablePrevTab, handleActionableTab, getNoJQFocusHandlers, disableAllFocusableElements, enableAllFocusableElements } from 'ojs/ojdatacollection-common';
import { fadeOut, slideIn, fadeIn, slideOut } from 'ojs/ojanimation';
import { getCachedCSSVarValues } from 'ojs/ojthemeutils';
import { getTranslatedString } from 'ojs/ojtranslation';
import Context from 'ojs/ojcontext';
import { info } from 'ojs/ojlogger';
import { IteratingDataProviderContentHandler } from 'ojs/ojvcollection';
import { makeFocusable, getCSSTimeUnitAsMillis } from 'ojs/ojdomutils';

/**
 * Default class that controls how the items are layout in WaterfallLayout.  In the future release,
 * this class should be pluggable by the application.
 */
class DefaultLayout {
    /**
     * Constructor
     * @param dataProvider the DataProvider where the items are fetch from
     * @param fullWidth the width of the WaterfallLayout
     * @param gutterWidth the width of the gutter
     * @param itemWidth the width of an item
     * @param cache the optional cache which could be supplied by the application (applications can save/restore for fast subsequent load)
     */
    constructor(dataProvider, fullWidth, gutterWidth, itemWidth, cache) {
        this.dataProvider = dataProvider;
        this.fullWidth = fullWidth;
        this.gutterWidth = gutterWidth;
        this.itemWidth = itemWidth;
        this.cache = cache;
        // must have at least 1 column
        this.columns = 0;
        // space to distribute left and right so that the content is centered
        this.margin = 0;
        this.columnsInfo = [];
        // the position closest to the bottom, this is for component to calculate
        // where to render loading indicator or skeletons
        this.bottom = 0;
        // the list of keys kept in actual order
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
        // space to distribute left and right so that the content is centered
        this.margin = Math.max(this.gutterWidth, (this.fullWidth - this.columns * (this.itemWidth + this.gutterWidth)) / 2);
        this.columnsInfo.length = this.columns;
        for (let i = 0; i < this.columns; i++) {
            this.columnsInfo[i] = 0;
        }
    }
    /**
     * Helper function for getItemsForPosition and recalculatePosition methods.
     * @param arr an array of items to get positions of
     * @param startIndex start index for the items/keys relative to the entire data set
     * @param keyFunc function to extract the key from the array item
     * @param cacheHitFunc function to invoke when position cache is hit
     * @param cacheMissFunc function to invoke when position cache is missed, the function returns the item height of the missed item
     * @param resultFunc optional function to invoke when a new item is added to cache
     */
    _populatePositions(arr, startIndex, keyFunc, cacheHitFunc, cacheMissFunc, resultFunc) {
        for (let k = 0; k < arr.length; k++) {
            const key = keyFunc(arr[k]);
            if (key == null) {
                continue;
            }
            const index = k + startIndex;
            const colIndex = index % this.columnsInfo.length;
            let itemHeight;
            const cachedPos = this.cache.get(key);
            if (cachedPos && !isNaN(cachedPos.height)) {
                itemHeight = cachedPos.height;
                if (cachedPos.valid !== false && !isNaN(cachedPos.top) && !isNaN(cachedPos.left)) {
                    cacheHitFunc(index, key, colIndex, cachedPos);
                    // already have position
                    continue;
                }
            }
            else {
                itemHeight = cacheMissFunc(arr[k]);
            }
            if (isNaN(itemHeight)) {
                // we have to stop here since it doesn't have height info
                // so we can't calculate for positions after this
                return;
            }
            let left = this.margin;
            let val;
            if (index < this.columnsInfo.length) {
                left += colIndex * (this.itemWidth + this.gutterWidth);
                val = { top: this.gutterWidth, left, height: itemHeight, valid: true };
                this.columnsInfo[colIndex] = itemHeight + this.gutterWidth * 2;
                this.bottom = Math.max(this.bottom, itemHeight);
            }
            else {
                const minTop = this.columnsInfo.reduce((a, b) => {
                    return Math.min(a, b);
                });
                const minIndex = this.columnsInfo.indexOf(minTop);
                left += minIndex * (this.itemWidth + this.gutterWidth);
                val = { top: minTop, left, height: itemHeight, valid: true };
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
    /**
     * Updates the component width that this layout uses.
     * @param width the new width
     */
    setWidth(width) {
        if (this.fullWidth === width) {
            return;
        }
        this.fullWidth = width;
        // don't bother if this happens before render
        if (this.columnsInfo.length > 0) {
            // number of columns will change
            this._initializeColumnsInfo();
            // recalculate all positions
            this.recalculatePositions(0);
        }
    }
    /**
     * Gets the position of the specified items.
     * @param items an array of items and keys
     * @param startIndex the index of the first item in items relative to the entire data set
     */
    getPositionForItems(items, startIndex) {
        // should use KeyMap, but we'll need values() method
        const positions = new Map();
        if (this.itemWidth == null && items.length > 0) {
            this.setItemWidth(items[0].element.offsetWidth);
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
        // finds the minimum start and end pixel for this range of items
        let start = 0;
        const posSet = new Set();
        const posArray = Array.from(positions.values());
        for (const curr of posArray) {
            const key = curr.left;
            if (!posSet.has(key)) {
                posSet.add(key);
                start = Math.max(start, curr.top);
                if (posSet.size === this.columnsInfo.length) {
                    break;
                }
            }
        }
        posSet.clear();
        let end = Number.MAX_VALUE;
        for (let j = posArray.length - 1; j >= 0; j--) {
            const key = posArray[j].left;
            if (!posSet.has(key)) {
                posSet.add(key);
                end = Math.min(end, posArray[j].top + posArray[j].height);
                if (posSet.size === this.columnsInfo.length) {
                    break;
                }
            }
        }
        return { start, end, positions };
    }
    /**
     * Sets the width of items
     */
    setItemWidth(width) {
        this.itemWidth = width;
    }
    /**
     * Gets the width of items
     */
    getItemWidth() {
        return this.itemWidth;
    }
    /**
     * Returns the positions of all items known so far.
     */
    getPositions() {
        return this.cache;
    }
    /**
     * Sets the position for the specified item
     * @param key the key of the item
     */
    setPosition(key, position) {
        this.cache.set(key, position);
    }
    /**
     * Gets the position for the specified item
     * @param key the key of the item
     */
    getPosition(key) {
        return this.cache.get(key);
    }
    /**
     * Gets the pixel closest to the bottom of the WaterfallLayout.
     * This information will be used by the component to render loading indicator/skeletons
     */
    getLastItemPosition() {
        return this.bottom;
    }
    /**
     * Gets the information (position of the last item) of each column in the layout.
     */
    getColumnsInfo() {
        return this.columnsInfo.map((val, index) => {
            return { top: val, left: this.margin + index * (this.itemWidth + this.gutterWidth) };
        });
    }
    _handleModelEvent(event) {
        if (event.type === 'mutate') {
            // todo: don't need this if evt is correctly typed
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
    /**
     * Inserts a set of keys into the position cache
     * @param beforeKeys
     * @param keys
     */
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
            // if beforeKey is not in cache, it will be added later when user scrolls to the range
        });
        this.recalculatePositions(minIndex);
    }
    /**
     * Removes a set of keys from the position cache
     * @param keys
     */
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
        // invalidate position cache for all items starting at the one that gets removed
        this.recalculatePositions(minIndex);
    }
    /**
     * Updates a set of keys from the position cache
     * @param keys
     */
    _updateKeys(keys) {
        let minIndex = Number.MAX_VALUE;
        keys.forEach((key) => {
            const index = this.keys.indexOf(key);
            if (index > -1) {
                minIndex = Math.min(minIndex, index + 1);
                const position = this.getPosition(key);
                if (position) {
                    position.top = undefined;
                    position.left = undefined;
                    position.height = undefined;
                    position.valid = false;
                }
            }
        });
        // invalidate position cache for all items starting at the next sibling of the updated item
        this.recalculatePositions(minIndex);
    }
    /**
     * Invalidate positions of item in cache starting at the specified index
     * @param fromIndex
     */
    _invalidatePositions(fromIndex) {
        for (let i = fromIndex; i < this.keys.length; i++) {
            const position = this.cache.get(this.keys[i]);
            if (position != null) {
                position.valid = false;
            }
        }
        // reset columns info
        for (let j = 0; j < this.columns; j++) {
            this.columnsInfo[j] = 0;
        }
    }
    /**
     * in general we want to try to calculate the positions upfront whenever we can instead of
     * waiting until a range of items is rendered so that we can avoid 2-phase rendering.
     * The calculation of positions is cheap and fast to do when we have all the measurements (height).
     */
    recalculatePositions(fromIndex) {
        // invalidate positions before recalculate positions
        this._invalidatePositions(fromIndex);
        this.bottom = 0;
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

/**
 * Class that interacts with DataProvider on behalf of the component
 */
class WaterfallLayoutContentHandler extends IteratingDataProviderContentHandler {
    constructor(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions, gutterWidth) {
        super(root, dataProvider, callback, scrollPolicy, scrollPolicyOptions);
        this.root = root;
        this.dataProvider = dataProvider;
        this.callback = callback;
        this.scrollPolicy = scrollPolicy;
        this.scrollPolicyOptions = scrollPolicyOptions;
        this.gutterWidth = gutterWidth;
        /**
         * Invoked when the children DOM are inserted
         * @override
         */
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
                    // ContentHandler might have been destroyed
                    if (this.callback) {
                        const result = this._adjustAllItems();
                        if (result.done) {
                            // clear tracker now that this rendering cycle of items is complete
                            this.newItemsTracker.clear();
                            if (this.domScroller && !this.domScroller.checkViewport()) {
                                // wait until fill viewport rendering is done before calling renderComplete
                                return;
                            }
                            this.callback.renderComplete(result.items);
                            this.initialFetch = false;
                        }
                    }
                });
            }
        };
        // don't really need to use KeySet here since we know the keys added would be unique
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
            // don't really need to use KeyMap here since we know the keys added would be unique
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
            // we might still need to update if layout changes
            if (this.scrollPolicyOptions.scroller !== this.root) {
                this.callback.setContentHeight(this.getLayout().getLastItemPosition() + this.gutterWidth);
            }
            return { done: true, items };
        }
        const startIndex = this.callback.getData().startIndex;
        const positions = this.getLayout().getPositionForItems(items, isNaN(startIndex) ? 0 : startIndex);
        this.callback.setPositions(positions.positions);
        this.callback.setContentHeight(this.getLayout().getLastItemPosition() + this.gutterWidth);
        if (this.domScroller) {
            this.domScroller.setViewportRange(positions.start, positions.end);
        }
        return { done: false, items };
    }
    /**
     * Invoked when the width of the component has changed
     * @param newWidth
     * @override
     */
    handleResizeWidth(newWidth) {
        this.initialFetch = false;
        this.getLayout().setWidth(newWidth);
    }
    fetchSuccess(result) {
        if (result != null) {
            // this should be empty already
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
    /**
     * Add an item to the root
     * @override
     * @param key
     * @param index
     * @param data
     */
    addItem(key, index, data, visible) {
        let x = -1;
        let y = -1;
        let height = -1;
        const layout = this.getLayout();
        const bottom = layout.getLastItemPosition();
        const position = layout.getPosition(key);
        if (position != null) {
            if (!isNaN(position.left) && !isNaN(position.top)) {
                x = position.left;
                y = position.top;
                height = position.height;
            }
            // else, items added from mutation event, currently no special treatment
        }
        else {
            // items fetched from loadMoreOnScroll, need animation treatment
            this.newItemsTracker.add(key);
        }
        const initialFetch = this.isInitialFetch();
        const currentItem = this.callback.getCurrentItem();
        // make the first item current if none has focus
        if (currentItem == null && index == 0) {
            this.callback.setCurrentItem(key);
        }
        // find out whether the item is at the bottom
        let isBottom = false;
        if (y !== -1 && height !== -1) {
            isBottom = y + height >= bottom;
        }
        const vnodes = this.renderItem(key, index, data);
        this.decorateItem(vnodes, key, x, y, initialFetch, visible, isBottom);
        return vnodes;
    }
    /**
     * Note we do not need to purge the cache as the ContentHandler is recreated everytime
     * when component is refresh with new data
     */
    renderItem(key, index, data) {
        const renderer = this.callback.getItemRenderer();
        const content = renderer({ data, index, key });
        const contentVnode = this.findItemVNode(content);
        let vnodes;
        // if the content is not empty, wrap a div around the content
        if (contentVnode != null) {
            this.decorateItemContent(contentVnode);
            vnodes = [h('div', {}, content)];
        }
        else {
            vnodes = contentVnode;
        }
        // note with the preact migration the vnodes cache is no longer used
        // will revisit this if there is a performance issue
        this.vnodesCache.set(key, { index, vnodes });
        return vnodes;
    }
    /**
     * Add attributes and classes to the item's content
     */
    decorateItemContent(vnode) {
        vnode.props.tabIndex = -1;
        this.setStyleClass(vnode, ['oj-waterfalllayout-item-element']);
    }
    /**
     * Add attributes and classes to an item element
     */
    decorateItem(vnodes, key, x, y, initialFetch, visible, isBottom) {
        let vnode = this.findItemVNode(vnodes);
        // do not set styles if exit animation is in progress
        if (vnode != null) {
            vnode.key = key;
            vnode.props.role = 'gridcell';
            vnode.props['data-oj-positioned'] = x != -1 && y != -1 ? 'true' : 'false';
            vnode.props['data-oj-key'] = key;
            if (typeof key === 'number') {
                vnode.props['data-oj-key-type'] = 'number';
            }
            const styleClasses = this.getItemStyleClass(visible, x, y, this.newItemsTracker.has(key), initialFetch);
            this.setStyleClass(vnode, styleClasses);
            const inlineStyle = this.getItemInlineStyle(visible, x, y, initialFetch, isBottom);
            vnode.props.style = vnode.props.style ? vnode.props.style + ';' + inlineStyle : inlineStyle;
        }
    }
    /**
     * Determines the inline style for the item
     * @param visible
     * @param x
     * @param y
     * @param animate
     * @param isBottom whether the item is at the bottom
     */
    getItemInlineStyle(visible, x, y, animate, isBottom) {
        let style = x === -1 || y === -1 ? 'top:0;left:0' : 'top:' + y + 'px;left:' + x + 'px';
        if (visible && x != -1 && y != -1 && !animate) {
            style = style + ';visibility:visible';
        }
        // if the item is at the bottom, add gutter width below it to prevent the border get cut off
        if (isBottom) {
            style += `; border-bottom: ${this.gutterWidth}px solid transparent`;
        }
        return style;
    }
    /**
     * Determines the style class for the item
     * @param visible
     * @param x
     * @param y
     * @param isNew
     * @param animate
     */
    getItemStyleClass(visible, x, y, isNew, animate) {
        const styleClass = [];
        if (visible) {
            styleClass.push('oj-waterfalllayout-item');
            if (x != -1 && y != -1 && !animate && isNew) {
                styleClass.push('oj-waterfalllayout-new-item');
            }
        }
        return styleClass;
    }
    /**
     * Render skeleton for loadMoreOnScroll
     */
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
            const positions = columnsInfo.map((columnInfo) => {
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
        const position = this.getLayout().getPosition(key);
        if (position) {
            position.top = undefined;
            position.left = undefined;
        }
        super.handleCurrentRangeItemUpdated(key);
    }
    // mutation handler overrrides
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
        info('[WaterfallLayoutContentHandler]=> ' + msg);
    }
}

var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WaterfallLayout_1;
/**
 * @classdesc
 * <h3 id="waterfallLayoutOverview-section">
 *   JET WaterfallLayout
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#waterfallLayoutOverview-section"></a>
 * </h3>
 * <p>Description: The JET WaterfallLayout displays data as cards in a grid layout based on columns.
 * Cards inside WaterfallLayout usually don't have a fixed height but the width of each columns are the
 * same.</p>
 * <pre class="prettyprint">
 *  <code>//WaterfallLayout with a DataProvider
 *  &lt;oj-waterfall-layout data="[[dataProvider]]">
 *  &lt;/oj-waterfall-layout>
 * </code></pre>
 *  <h3 id="dataprovider-section">
 *   DataProvider
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dataprovider-section"></a>
 *  </h3>
 *  <p>WaterfallLayout can work with any non-hierarchical <a href="DataProvider.html">DataProvider</a> as long as the data type for its key is of type string or number.</p>
 *  <p>An error will be logged and no data will be rendered if the data type for key is not one of the above types.  This requirement enables WaterfallLayout to optimize rendering in all scenarios.</p>
 *
 *  <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 *  </h3>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Card</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Focus on the item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td rowspan = "6" nowrap>Card</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus to the previous item according to the data order.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus to the next item according to the data order.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>F2</kbd></td>
 *       <td>Enters Actionable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item. It can also be used to exit actionable mode if already in actionable mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Exits Actionable mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>When in Actionable Mode, navigates to next focusable element within the item.  If the last focusable element is reached, shift focus back to the first focusable element.
 *           When not in Actionable Mode, navigates to next focusable element on the page (outside of the component).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>When in Actionable Mode, navigates to previous focusable element within the item.  If the first focusable element is reached, shift focus back to the last focusable element.
 *           When not in Actionable Mode, navigates to previous focusable element on the page (outside of the component).</td>
 *     </tr>
 *   </tbody>
 * </table>
 * @param {string | number} K Type of key of the dataprovider
 * @param {number} D Type of data from the dataprovider
 * @ojmetadata description "A waterfall layout displays heterogeneous data as a grid of cards."
 * @ojmetadata displayName "Waterfall Layout"
 * @ojmetadata main "ojs/ojwaterfalllayout"
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "ojs/ojwaterfalllayout"
 *   },
 *   "themes": {
 *     "unsupportedThemes": [
 *       "Alta"
 *     ]
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-waterfall-layout",
 *     "uxSpecs": [
 *       "waterfall-layout"
 *     ]
 *   }
 * }
 * @ojmetadata help "https://docs.oracle.com/en/middleware/developer-tools/jet/19/reference-api/oj.ojWaterfallLayout.html"
 * @ojmetadata since "9.0.0"
 */
let WaterfallLayout = WaterfallLayout_1 = class WaterfallLayout extends Component {
    constructor() {
        super();
        this.actionableMode = false;
        this.renderCompleted = false;
        this.ticking = false;
        // set gutter width to 16 for jet 12
        // will look into this for the new component
        this.gutterWidth = 16;
        // we wrap the content with a div, but we still want the focus item to be the content.
        this._findFocusItem = (item) => {
            if (item != null) {
                return item.firstElementChild;
            }
            return item;
        };
        this._handleFocusIn = (event) => {
            const item = this._findFocusItem(this.currentItem);
            if (item) {
                this.focusInHandler(item);
            }
        };
        this._handleFocusOut = (event) => {
            const item = this._findFocusItem(this.currentItem);
            if (item) {
                this.focusOutHandler(item);
            }
        };
        this._handleMouseDownCapture = (event) => {
            this.mouseDownTarget = event.target;
        };
        this._handleClick = (event) => {
            this._handleTouchOrClickEvent(event);
        };
        this._handleKeyDown = (event) => {
            if (this.currentItem) {
                let next;
                switch (event.key) {
                    case 'ArrowLeft':
                    case 'Left': {
                        // left arrow;
                        next = this.currentItem.previousElementSibling;
                        break;
                    }
                    case 'ArrowRight':
                    case 'Right': {
                        // right arrow;
                        next = this.currentItem.nextElementSibling;
                        break;
                    }
                    case 'F2': {
                        // F2;
                        if (this.actionableMode === false) {
                            this._enterActionableMode();
                        }
                        else {
                            this._exitActionableMode();
                        }
                        break;
                    }
                    case 'Escape':
                    case 'Esc': {
                        // esc;
                        if (this.actionableMode === true) {
                            this._exitActionableMode();
                        }
                        break;
                    }
                    case 'Tab': {
                        // tab or shift+tab;
                        if (this.actionableMode === true && this.currentItem) {
                            if (event.shiftKey) {
                                handleActionablePrevTab(event, this.currentItem);
                            }
                            else {
                                handleActionableTab(event, this.currentItem);
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
        };
        this._touchStartHandler = (event) => {
            this._handleTouchOrClickEvent(event);
        };
        this.setRootElement = (element) => {
            this.root = element;
        };
        this.scrollListener = (event) => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    // need to check because the component could have been destroyed already
                    if (this.isAvailable()) {
                        this._updateScrollPosition();
                    }
                    this.ticking = false;
                });
                this.ticking = true;
            }
        };
        // TODO check if state initial values are correct
        this.state = {
            renderedData: null,
            positions: null,
            skeletonPositions: null,
            width: 0,
            height: 0,
            contentHeight: 0
        };
    }
    render() {
        let content;
        let data;
        if (this.contentHandler == null) {
            content = this._renderInitialSkeletons(null);
        }
        else {
            data = this.getData();
            const positions = this.state.skeletonPositions;
            if (data && this.state.width > 0) {
                if (data.value && data.value.data.length === 0) {
                    content = this.contentHandler.renderNoData();
                }
                else {
                    if (positions != null && this.contentHandler.isInitialFetch()) {
                        // in the intermediate state where data is available but skeletons are still visible
                        const skeletons = this._renderInitialSkeletons(positions.positions);
                        content = skeletons.concat(this.contentHandler.render(data));
                    }
                    else {
                        content = this.contentHandler.render(data);
                        // if there is data, but there is nothing rendered, i.e. the content of each waterfall layout item is empty,
                        // create a div with gridcell role for accessibility
                        if (content?.[0]?.length === 0) {
                            content[0].push(jsx("div", { role: "gridcell" }));
                        }
                    }
                }
            }
            else if (positions != null) {
                content = this._renderInitialSkeletons(positions.positions);
            }
        }
        if (data == null) {
            return (jsx(Root, { ref: this.setRootElement, style: this._getRootElementStyle(), "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'], "aria-describedby": this.props['aria-describedby'], children: jsx("div", { role: "grid", "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'], children: jsx("div", { role: "row", style: this._getContentDivStyle(), tabIndex: 0, "aria-label": getTranslatedString('oj-ojWaterfallLayout.msgFetchingData'), "data-oj-context": true, children: content }) }) }));
        }
        else {
            return (jsx(Root, { ref: this.setRootElement, style: this._getRootElementStyle(), "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'], "aria-describedby": this.props['aria-describedby'], children: jsx("div", { onMouseDownCapture: this._handleMouseDownCapture, onClick: this._handleClick, onKeyDown: this._handleKeyDown, onfocusin: this._handleFocusIn, onfocusout: this._handleFocusOut, role: "grid", "aria-label": this.props['aria-label'], "aria-labelledby": this.props['aria-labelledby'], children: jsx("div", { role: "row", style: this._getContentDivStyle(), "data-oj-context": true, children: content }) }) }));
        }
    }
    _getScrollPolicyOptions() {
        return {
            fetchSize: this.props.scrollPolicyOptions.fetchSize,
            maxCount: this.props.scrollPolicyOptions.maxCount,
            scroller: this._getScroller()
        };
    }
    _debounce(callback, wait) {
        let timeout = null;
        return (...args) => {
            const next = () => callback(...args);
            clearTimeout(timeout);
            timeout = setTimeout(next, wait);
        };
    }
    /**
     * An optional component lifecycle method called after the
     * virtual component has been initially rendered and inserted into the
     * DOM. Data fetches and global listeners can be added here.
     * This will not be called for reparenting cases.
     * @return {void}
     * @override
     */
    componentDidMount() {
        // start fetching data
        const root = this.getRootElement();
        root.addEventListener('touchStart', this._touchStartHandler, { passive: true });
        if (this.props.data) {
            this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, 
            // funky cast to avoid exposing interface methods as public API
            this, this.props.scrollPolicy, this._getScrollPolicyOptions(), this.gutterWidth);
        }
        // do measurements of the initial skeletons, re-render with positions
        const rootWidth = root.clientWidth;
        const rootHeight = root.clientHeight;
        this.setState({ width: rootWidth, height: rootHeight });
        const skeleton = root.querySelector('.oj-waterfalllayout-skeleton');
        if (skeleton) {
            this.skeletonWidth = skeleton.clientWidth;
            if (this.contentHandler) {
                this._delayShowSkeletons();
            }
        }
        // register a ResizeObserver (note ResizeObserver is not in lib.dom.ts yet...)
        if (window['ResizeObserver']) {
            const resizeObserver = new window['ResizeObserver'](this._debounce((entries) => {
                entries.forEach((entry) => {
                    if (entry.target === root && entry.contentRect) {
                        const currWidth = this.state.width;
                        const newWidth = Math.round(entry.contentRect.width);
                        if (Math.abs(newWidth - currWidth) > WaterfallLayout_1.minResizeWidthThreshold) {
                            // skeleton width might be zero because waterfall is hidden, and therefore needs to be re-calculated
                            const skeleton = root.querySelector('.oj-waterfalllayout-skeleton');
                            if (skeleton && this.skeletonWidth == 0) {
                                this.skeletonWidth = skeleton.clientWidth;
                            }
                            this.setState({ width: newWidth });
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
                            this.setState({ height: newHeight });
                        }
                    }
                });
            }, WaterfallLayout_1.debounceThreshold));
            resizeObserver.observe(root);
            this.resizeObserver = resizeObserver;
        }
        makeFocusable({
            applyHighlight: true,
            setupHandlers: (focusInHandler, focusOutHandler) => {
                const noJQHandlers = getNoJQFocusHandlers(focusInHandler, focusOutHandler);
                this.focusInHandler = noJQHandlers.focusIn;
                this.focusOutHandler = noJQHandlers.focusOut;
            }
        });
        // register a scroll listener
        this._getScroller().addEventListener('scroll', this.scrollListener);
    }
    _handleNewData() {
        this.setState({ renderedData: null, positions: null });
        if (this.contentHandler) {
            this.contentHandler.destroy();
        }
        this.currentKey = null;
        this.currentItem = null;
        const root = this.getRootElement();
        this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, 
        // funky cast to avoid exposing interface methods as public API
        this, this.props.scrollPolicy, this._getScrollPolicyOptions(), this.gutterWidth);
        // show skeletons if delay has passed
        this._delayShowSkeletons();
    }
    componentDidUpdate(oldProps, oldState) {
        const data = this.getData();
        if (data != null) {
            if (this.props.data != oldProps.data) {
                const resolveFunc = this.addBusyState('apply exit animations on existing items');
                this._applyExitAnimation().then(() => {
                    // so that skeletons are rendered
                    resolveFunc();
                    this._handleNewData();
                });
            }
            else if (oldState.positions == null && this.state.positions != null) {
                if (this.state.skeletonPositions != null) {
                    const skeletons = this._findSkeletons();
                    // this should always be true
                    if (skeletons.length > 0) {
                        this._applySkeletonExitAnimation(skeletons).then(() => {
                            this.setState({ skeletonPositions: null });
                        });
                    }
                }
                else {
                    this._applyEntranceAnimation();
                    // we don't need to wait for entrance animation to finish as long as all cards are in position
                    if (!this.renderCompleted && this.contentHandler) {
                        this.contentHandler.postRender();
                    }
                }
            }
            else if (oldState.skeletonPositions != null && this.state.skeletonPositions == null) {
                this._applyEntranceAnimation();
                // we don't need to wait for entrance animation to finish as long as all cards are in position
                if (!this.renderCompleted && this.contentHandler) {
                    this.contentHandler.postRender();
                }
            }
            else if (oldState.positions != null &&
                this.state.positions != null &&
                oldState.positions.size < this.state.positions.size) {
                this._applyLoadMoreEntranceAnimation();
                // could happen if initial fetch needs to fill viewport
                if (!this.renderCompleted && this.contentHandler) {
                    this.contentHandler.postRender();
                }
            }
            else if (this.contentHandler) {
                // if any update other than scroll position changed
                if (this._isRenderedDataSizeChanged(oldState.renderedData, this.state.renderedData) ||
                    oj.Object.compareValues(this.props.scrollPosition, oldProps.scrollPosition)) {
                    this.contentHandler.postRender();
                }
            }
            if (!oj.Object.compareValues(this.props.scrollPosition, oldProps.scrollPosition) &&
                !oj.Object.compareValues(this.props.scrollPosition, this.lastInternalScrollPositionUpdate)) {
                this._syncScrollTopWithProps();
            }
            if (this.state.skeletonPositions == null && this.props.scrollPolicyOptions.scroller != null) {
                const contentDiv = this._getContentDiv();
                const skeleton = this.getRootElement().querySelector('.oj-waterfalllayout-skeleton');
                if (skeleton) {
                    const bottom = parseInt(skeleton.style.top) + parseInt(skeleton.style.height);
                    if (this.state.contentHeight !== bottom) {
                        contentDiv.style.height = bottom + 'px';
                    }
                }
                else if (parseInt(contentDiv.style.height) != this.state.contentHeight) {
                    contentDiv.style.height = this.state.contentHeight + 'px';
                }
            }
            if (this.props.cardSizing === 'dynamic' &&
                !this.cardResizeObserver &&
                window['ResizeObserver']) {
                this.cardResizeObserver = new window['ResizeObserver'](this._debounce((entries) => {
                    let isCardSizeChanged = false;
                    entries.forEach((entry, index) => {
                        // assume all cards have same width, we can update the itemWidth only once if it's changed
                        if (index === 0) {
                            const width = entry.borderBoxSize[0].inlineSize;
                            const itemWidth = this.contentHandler.getLayout().getItemWidth();
                            if (itemWidth !== undefined && itemWidth !== width) {
                                this.contentHandler.getLayout().setItemWidth(width);
                                isCardSizeChanged = true;
                            }
                        }
                        // for each card, update the height in cache if it's changed
                        const height = entry.borderBoxSize[0].blockSize;
                        const key = this.contentHandler.getKey(entry.target);
                        const cache = this.contentHandler.getLayout().getPosition(key);
                        if (cache && cache.height !== height) {
                            this.contentHandler.getLayout().setPosition(key, { ...cache, height });
                            isCardSizeChanged = true;
                        }
                    });
                    if (isCardSizeChanged) {
                        const isRootWidthSame = this.prevRootWidth === undefined || this.prevRootWidth === this.state.width;
                        if (isRootWidthSame) {
                            // for the case that card content are loaded async and container/screen size doesn't change
                            this.contentHandler.getLayout().recalculatePositions(0);
                            this.setState({ positions: this.contentHandler.getLayout().getPositions() });
                        }
                        this.prevRootWidth = this.state.width;
                    }
                }, WaterfallLayout_1.debounceThreshold));
                const items = this.getRootElement().querySelectorAll('.' + this.getItemStyleClass());
                items.forEach((item) => {
                    this.cardResizeObserver.observe(item);
                });
            }
        }
        else {
            // no data before, updated with data
            if (this.props.data && oldProps.data == null) {
                this._handleNewData();
            }
            else if (this.state.skeletonPositions != null &&
                !isNaN(this.state.skeletonPositions.end) &&
                this.props.scrollPolicyOptions.scroller != null) {
                const contentDiv = this._getContentDiv();
                contentDiv.style.height = this.state.skeletonPositions.end + 'px';
            }
        }
    }
    /**
     * An optional component lifecycle method called after the
     * virtual component has been removed from the DOM. This will not
     * be called for reparenting cases. Global listener cleanup can
     * be done here.
     * @return {void}
     * @override
     */
    componentWillUnmount() {
        if (this.contentHandler) {
            this.contentHandler.destroy();
        }
        this.contentHandler = null;
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        this.resizeObserver = null;
        if (this.cardResizeObserver) {
            this.cardResizeObserver.disconnect();
        }
        this.cardResizeObserver = null;
        // if the scroller is the element itself, then we will be fine as it will be cleanup when the DOM is removed
        // if the scroller is something else, then _getScroller() should not return null in that case
        if (this.scrollListener && this._getScroller() != null) {
            this._getScroller().removeEventListener('scroll', this.scrollListener);
        }
    }
    _isRenderedDataSizeChanged(oldValue, newValue) {
        if (oldValue === newValue ||
            (oldValue && newValue && oldValue.value.data.length === newValue.value.data.length)) {
            return false;
        }
        return true;
    }
    _delayShowSkeletons() {
        window.setTimeout(() => {
            // see if we have data yet, if not setState to trigger rendering of skeletons
            const data = this.getData();
            if (data == null) {
                this._updatePositionsForSkeletons(this.state.width);
            }
        }, this._getShowSkeletonsDelay());
    }
    _updatePositionsForSkeletons(width) {
        // 50 is the maximum number of skeletons that we will render, which should fill the viewport
        // we could reduce the number based on viewport height
        const positions = this._getPositionsForSkeletons(50, width, this.skeletonWidth);
        this.setState({ skeletonPositions: positions });
    }
    _getOptionDefaults() {
        if (this.defaultOptions == null) {
            this.defaultOptions = this._getStyleValues();
        }
        return this.defaultOptions;
    }
    _getStyleValues() {
        const defaultOptions = {};
        Object.entries(WaterfallLayout_1._CSS_Vars).forEach(([key, value]) => {
            defaultOptions[key] = getCachedCSSVarValues([value])[0];
        });
        return defaultOptions;
    }
    _getShowSkeletonsDelay() {
        const defaultOptions = this._getOptionDefaults();
        const delay = getCSSTimeUnitAsMillis(defaultOptions.showIndicatorDelay, 10);
        return isNaN(delay) ? 0 : delay;
    }
    /**
     * Retrieve the animation delay between card entrance animation
     * @return {number} the delay in ms
     * @private
     */
    _getCardEntranceAnimationDelay() {
        const defaultOptions = this._getOptionDefaults();
        const delay = getCSSTimeUnitAsMillis(defaultOptions.cardAnimationDelay, 10);
        return isNaN(delay) ? 0 : delay;
    }
    addBusyState(description) {
        const root = this.getRootElement();
        const componentBusyContext = Context.getContext(root).getBusyContext();
        return componentBusyContext.addBusyState({ description });
    }
    _findSkeletons() {
        const skeletons = this.getRootElement().querySelectorAll('.oj-waterfalllayout-skeleton');
        // 1 instead of 0 as at the beginning we pre-render a single skeleton to measure skeleton dimension
        // so that is not the skeleton that we want to hide
        return skeletons.length > 1 ? skeletons : [];
    }
    getRootElement() {
        return this.root;
    }
    // ContentHandlerCallback implementation
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
            // this flag is mainly used in ResizeObserver.  We only want to handle resize of content
            // after rendering is completed
            this.renderCompleted = false;
        }
        // need to update state immediately, animate skeleton exit on updated instead
        this.setState({ renderedData: data });
        const skeletons = this._findSkeletons();
        if (data == null || skeletons.length === 0) {
            this.setState({ skeletonPositions: null });
        }
        window.clearTimeout(this.delayShowSkeletonsTimeout);
    }
    updateData(updater) {
        this.renderCompleted = false;
        this.setState(function (state) {
            const currentData = state.renderedData;
            return updater(currentData);
        }.bind(this));
    }
    getSkeletonPositions() {
        return this.state.skeletonPositions;
    }
    setSkeletonPositions(positions) {
        this.setState({ skeletonPositions: positions });
    }
    getPositions() {
        return this.state.positions;
    }
    setPositions(positions) {
        this.setState({ positions });
    }
    setContentHeight(height) {
        if (this.props.scrollPolicyOptions.scroller != null && this.state.contentHeight !== height) {
            this.setState({ contentHeight: height });
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
            // hide skeleton
            let promise;
            skeletons.forEach((skeleton) => {
                promise = fadeOut(skeleton);
            });
            // resolve when fade out of last skeleton is done
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
            const elem = item;
            elem.style.visibility = 'visible';
            const currentTransition = elem.style.transition;
            elem.style.transition = 'none';
            const delay = Math.min(1000, index * this._getCardEntranceAnimationDelay()) + 'ms';
            const duration = '300ms';
            const promise = slideIn(item, {
                offsetY: '300px',
                delay,
                duration
            });
            promises.push(promise);
            promises.push(fadeIn(item, { delay, duration }));
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
            promises.push(slideOut(item, { offsetY: '300px', duration, persist: 'all' }));
            promises.push(fadeOut(item, { duration, persist: 'all' }));
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
            promises.push(fadeIn(item, { duration: '150ms' }));
        });
        return Promise.all(promises);
    }
    _updateScrollPosition() {
        const scrollTop = this._getScroller().scrollTop;
        const iterator = this.contentHandler.getLayout().getPositions().entries();
        let result = iterator.next();
        let key;
        let maxTop = 0;
        while (!result.done) {
            const entry = result.value;
            result = iterator.next();
            const top = entry[1].top;
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
            key,
            offsetY
        };
        this.lastInternalScrollPositionUpdate = scrollPosition;
        // currently this will trigger a re-render
        this.props.onScrollPositionChanged?.(scrollPosition);
    }
    _syncScrollTopWithProps() {
        const scrollPosition = this.props.scrollPosition;
        let scrollTop;
        const key = scrollPosition.key;
        if (key) {
            const pos = this.contentHandler.getLayout().getPosition(key);
            if (pos != null) {
                scrollTop = pos.top;
            }
            else {
                // does not exists or not fetched yet
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
                // invalid value
                return;
            }
        }
        if (scrollTop > this._getScroller().scrollHeight) {
            // invalid value
            return;
        }
        this._getScroller().scrollTop = scrollTop;
    }
    handleItemRemoved(key) { }
    _handleTouchOrClickEvent(event) {
        let target = event.target;
        if (target == null && this.mouseDownTarget) {
            target = this.mouseDownTarget;
        }
        const item = target.closest('.' + this.getItemStyleClass());
        if (item) {
            this._updateCurrentItem(item);
        }
        // Clear the mouse down event target after click/touch event updates current item
        this.mouseDownTarget = null;
    }
    _resetFocus(elem) {
        const item = this._findFocusItem(elem);
        this.focusOutHandler(item);
        item.tabIndex = -1;
    }
    _setFocus(elem, focus) {
        const item = this._findFocusItem(elem);
        item.tabIndex = 0;
        if (focus) {
            this.focusInHandler(item);
            item.focus();
        }
    }
    _updateCurrentItem(item) {
        if (this.currentItem) {
            const currentElem = this.currentItem;
            this._resetFocus(currentElem);
        }
        this.currentItem = item;
        const elem = item;
        this.currentKey = this.contentHandler.getKey(elem);
        this._setFocus(elem, true);
    }
    _getScroller() {
        let scroller = this.props.scrollPolicyOptions.scroller;
        if (typeof scroller === 'string') {
            scroller = document.querySelector(scroller);
        }
        return scroller != null ? scroller : this.getRootElement();
    }
    _getContentDiv() {
        return this.getRootElement().firstElementChild.firstElementChild;
    }
    _getContentDivStyle() {
        return { height: this.state.contentHeight + 'px' };
    }
    _getRootElementStyle() {
        return this.props.scrollPolicyOptions.scroller != null ? { overflow: 'hidden' } : null;
    }
    /**
     * Renders the initial skeletons
     * @param positions
     */
    _renderInitialSkeletons(positions) {
        // make sure we reset scroller in case of refresh
        const scroller = this._getScroller();
        if (scroller != null) {
            scroller.scrollTop = 0;
        }
        if (positions == null) {
            // render a single skeleton so we can get the measurement
            return [this._renderSkeleton(null, true)];
        }
        else {
            const count = positions.size;
            const skeletons = [];
            for (let i = 0; i < count; i++) {
                const position = positions.get(i);
                skeletons.push(this._renderSkeleton(position, true));
            }
            return skeletons;
        }
    }
    /**
     * Generates the skeletons and calculates their positions
     * @param count
     * @param rootWidth
     * @param skeletonWidth
     * @private
     */
    _getPositionsForSkeletons(count, rootWidth, skeletonWidth) {
        const items = [];
        const cache = new Map();
        for (let i = 0; i < count; i++) {
            // height of skeleton cards are 150px, 250px, 450px
            const height = 150 + (i % 3) * 100;
            cache.set(i, { height });
            items.push({
                key: i
            });
        }
        const layout = new DefaultLayout(null, rootWidth, this.gutterWidth, skeletonWidth, cache);
        return layout.getPositionForItems(items, 0);
    }
    /**
     * Restore the current item
     * @param items an array of rendered items
     */
    _restoreCurrentItem(items) {
        if (this.currentKey != null) {
            for (const curr of items) {
                if (curr.key == this.currentKey) {
                    const elem = curr.element;
                    this._setFocus(elem, false);
                    this.currentItem = elem;
                    break;
                }
            }
            if ((this.currentItem == null || this.currentItem.parentNode == null) && items.length > 0) {
                this.currentKey = items[0].key;
                const elem = items[0].element;
                this._setFocus(elem, false);
                this.currentItem = elem;
            }
        }
    }
    /**
     * Update all tabbable elements within each item so they are no longer tabbable
     * @param items an array of rendered items
     */
    _disableAllTabbableElements(items) {
        items.forEach((item) => {
            disableAllFocusableElements(item.element);
        });
    }
    /**
     * Enter the actionable mode where user can tab through all tabbable elements within the current item
     */
    _enterActionableMode() {
        this.actionableMode = true;
        if (this.currentItem) {
            const elems = enableAllFocusableElements(this.currentItem, true);
            if (elems && elems.length > 0) {
                elems[0].focus();
            }
        }
    }
    /**
     * Exit the actionable mode
     */
    _exitActionableMode() {
        this.actionableMode = false;
        if (this.currentItem) {
            disableAllFocusableElements(this.currentItem);
            this._setFocus(this.currentItem, true);
        }
    }
    /**
     * Invoked when all the items are rendered and positioned
     */
    renderComplete(items) {
        this.renderCompleted = true;
        // always reset actionable mode on re-render
        this.actionableMode = false;
        this._disableAllTabbableElements(items);
        this._restoreCurrentItem(items);
        this.delayShowSkeletonsTimeout = window.setTimeout(() => {
            // need to check because the component could have been destroyed already
            if (this.isAvailable()) {
                const skeletons = this._findSkeletons();
                skeletons.forEach((s) => {
                    s.style.visibility = 'visible';
                });
            }
        }, this._getShowSkeletonsDelay());
    }
    /**
     * Render skeletons for these specific positions
     * @param positions
     */
    renderSkeletons(positions) {
        const skeletons = [];
        positions.forEach((position) => {
            skeletons.push(this._renderSkeleton(position));
        });
        return skeletons;
    }
    /**
     * Renders a single skeleton item
     * @private
     */
    _renderSkeleton(position, isInitial) {
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
            if (!isInitial) {
                style.visibility = 'hidden';
            }
            if (!isNaN(position.width)) {
                style.width = position.width + 'px';
            }
        }
        return (jsx("div", { class: "oj-waterfalllayout-skeleton", style: style, children: jsx("div", { class: "oj-waterfalllayout-skeleton-content oj-animation-skeleton" }) }));
    }
};
WaterfallLayout.defaultProps = {
    cardSizing: 'fixed',
    data: null,
    scrollPolicy: 'loadMoreOnScroll',
    scrollPolicyOptions: {
        fetchSize: 25,
        maxCount: 500,
        scroller: null
    },
    scrollPosition: { y: 0 }
};
WaterfallLayout.minResizeWidthThreshold = 10;
WaterfallLayout.debounceThreshold = 100;
WaterfallLayout._CSS_Vars = {
    showIndicatorDelay: '--oj-private-core-global-loading-indicator-delay-duration',
    cardAnimationDelay: '--oj-private-animation-global-card-entrance-delay-increment'
};
WaterfallLayout._metadata = { "properties": { "cardSizing": { "type": "string", "enumValues": ["fixed", "dynamic"] }, "data": { "type": "object" }, "scrollPolicy": { "type": "string", "enumValues": ["loadAll", "loadMoreOnScroll"] }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number" }, "maxCount": { "type": "number" }, "scroller": { "type": "string|Element" } } }, "scrollPosition": { "type": "object", "properties": { "y": { "type": "number" }, "key": { "type": "string|number" }, "offsetY": { "type": "number" } }, "writeback": true } }, "slots": { "itemTemplate": { "data": {} } }, "extension": { "_WRITEBACK_PROPS": ["scrollPosition"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby"] } };
WaterfallLayout = WaterfallLayout_1 = __decorate([
    customElement('oj-waterfall-layout')
], WaterfallLayout);

export { WaterfallLayout };
