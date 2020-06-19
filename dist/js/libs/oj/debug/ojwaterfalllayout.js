define(['exports', 'ojs/ojcore-base', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojthemeutils', 'ojs/ojvcomponent', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojvcollection'], function (exports, oj, DataCollectionUtils, AnimationUtils, ThemeUtils, ojvcomponent, Context, Logger, ojvcollection) { 'use strict';

    /**
     * @license
     * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
    /**
     * @ojcomponent oj.ojWaterfallLayout
     * @ojtsvcomponent
     * @augments oj.baseComponent
     * @since 9.0.0
     *
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojWaterfallLayout<K extends (string | number), D> extends baseComponent<ojWaterfallLayoutSettableProperties<K,D>>",
     *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
     *               },
     *               {
     *                target: "Type",
     *                value: "ojWaterfallLayoutSettableProperties<K,D> extends baseComponentSettableProperties",
     *                for: "SettableProperties"
     *               }
     *              ]
     *
     * @ojunsupportedthemes ["Alta"]
     *
     * @ojshortdesc A waterfall layout displays heterogeneous data as a grid of cards.
     * @ojrole grid
     *
     * @ojuxspecs ['waterfall-layout']
     *
     * @classdesc
     * <h3 id="waterfallLayoutOverview-section">
     *   JET WaterfallLayout
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#waterfallLayoutOverview-section"></a>
     * </h3>
     * <p>Description: The JET WaterfallLayout displays data as cards in a grid layout based on columns.
     * Cards inside WaterfallLayout usually don't have a fixed height but the width of each columns are the
     * same.</p>
     * <pre class="prettyprint">
     * <code>//WaterfallLayout with a DataProvider
     *&lt;oj-waterfall-layout data="[[dataProvider]]">
     * &lt;/oj-waterfall-layout>
     *</code></pre>
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
     * {@ojinclude "name":"touchDoc"}
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     *
     * {@ojinclude "name":"keyboardDoc"}
     */

    // Fragments
    /**
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
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojWaterfallLayout
     */

    /**
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
     *       <td>Enters Actionable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item.</td>
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
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojWaterfallLayout
     */

    /**
     * The data for WaterfallLayout.  Must be of type <a href="DataProvider.html">DataProvider</a>.
     * Please refer to the <a href="#dataprovider-section">DataProvider</a> section for key data type requirement.
     *
     * @ojshortdesc Specifies the data for the component. See the Help documentation for more information.
     * @expose
     * @name data
     * @memberof! oj.ojWaterfallLayout
     * @instance
     * @type {Object}
     * @default null
     *
     * @example <caption>Initialize the WaterfallLayout with the <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-waterfall-layout data='{{myDataProvider}}'>&lt;/oj-waterfall-layout>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
     * // getter
     * var dataValue = myWaterfallLayout.data;
     *
     * // setter
     * myWaterfallLayout.data = myDataProvider;
     * @ojsignature [{target: "Type", value: "DataProvider<K, D>"}]
     */

    /**
     * Specifies the mechanism used to scroll the data inside the WaterfallLayout. Possible values are: "loadMoreOnScroll", and "loadAll".
     * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the WaterfallLayout.  Note that
     * the component must have a height specified or inside a height constraint element so that the component element is scrollable.
     * When "loadAll" is specified, WaterfallLayout will fetch all the data when it is initially rendered.
     *
     * @ojshortdesc Specifies how data are fetched as user scrolls towards the bottom of the grid.
     * @expose
     * @name scrollPolicy
     * @memberof! oj.ojWaterfallLayout
     * @instance
     * @type {string|null}
     * @default "loadMoreOnScroll"
     * @ojvalue {string} "loadAll" Fetch and render all data.
     * @ojvalue {string} "loadMoreOnScroll" Additional data is fetched when the user scrolls towards the bottom of the grid.
     *
     * @example <caption>Initialize the WaterfallLayout with the <code class="prettyprint">scroll-policy</code> attribute specified:</caption>
     * &lt;oj-waterfall-layout scroll-policy='loadMoreOnScroll'>&lt;/oj-waterfall-layout>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrollPolicy</code> property after initialization:</caption>
     * // getter
     * var scrollPolicyValue = myWaterfallLayout.scrollPolicy;
     *
     * // setter
     * myWaterfallLayout.scrollPolicy = 'loadMoreOnScroll';
     */

    /**
     * scrollPolicy options.
     * <p>
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
     *   <li>scroller: The element which WaterfallLayout uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-waterfall-layout element is used.</li>
     * </ul>
     * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
     * when the user scrolls to the end of the component. The fetchSize option
     * determines how many rows are fetched in each block.
     *
     * @ojshortdesc Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
     * @expose
     * @name scrollPolicyOptions
     * @instance
     * @memberof! oj.ojWaterfallLayout
     * @type {Object.<string, any>|null}
     *
     * @example <caption>Initialize the WaterfallLayout with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
     * &lt;oj-waterfall-layout scroll-policy-options.fetch-size='30'>&lt;/oj-waterfall-layout>
     *
     * @example <caption>Get or set the <code class="prettyprint">scroll-policy-options</code> attribute after initialization:</caption>
     * // getter
     * var fetchSizeValue = myWaterfallLayout.scrollPolicyOptions.fetchSize;
     *
     * // setter
     * myWaterfallLayout.scrollPolicyOptions.fetchSize = 30;
     *
     * @example <caption>Initialize the WaterfallLayout with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-waterfall-layout scroll-policy-options.fetch-size='30' scroll-policy-options.max-count='1000'>&lt;/oj-waterfall-layout>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrollPolicyOptions</code> property after initialization:</caption>
     * // Get one
     * var fetchSizeValue = myWaterfallLayout.scrollPolicyOptions.fetchSize;
     *
     * // Get all
     * var scrollPolicyOptionsValues = myWaterfallLayout.scrollPolicyOptions;
     *
     * // Set one, leaving the others intact
     * myWaterfallLayout.setProperty('scrollPolicyOptions.fetchSize', 30);
     *
     * // Set all.
     * myWaterfallLayout.scrollPolicyOptions = {fetchSize: 30, maxCount: 1000};
     */

    /**
     * The number of items to fetch in each block.
     * @expose
     * @name scrollPolicyOptions.fetchSize
     * @memberof! oj.ojWaterfallLayout
     * @instance
     * @type {number}
     * @default 25
     * @ojsignature { target: "Type",
     *                value: "?"}
     */
    /**
     * The maximum total number of items to fetch.
     * @expose
     * @name scrollPolicyOptions.maxCount
     * @memberof! oj.ojWaterfallLayout
     * @instance
     * @type {number}
     * @default 500
     * @ojsignature { target: "Type",
     *                value: "?"}
     */
    /**
     * The element which WaterfallLayout uses to determine the scroll position as well as the maximum scroll position.
     * @expose
     * @name scrollPolicyOptions.scroller
     * @ojshortdesc The element used to determine the scroll position as well as the maximum scroll position. See the Help documentation for more information.
     * @memberof! oj.ojWaterfallLayout
     * @instance
     * @type {Element}
     * @default null
     * @ojsignature { target: "Type",
     *                value: "?"}
     */

    /**
     * The current scroll position of WaterfallLayout. The scroll position is updated when the vertical scroll position
     * (or its scroller, as specified in scrollPolicyOptions.scroller) has changed.  The value contains the y scroll position, the key of
     * the item closest to the top of the viewport, as well as vertical offset from the position of the item to the actual scroll position.
     * <p>
     * The default value contains just the scroll position.  Once data is fetched the 'key' and 'offsetY' sub-properties will be added.
     * If there is no data then the 'key' sub-properties will not be available.
     * </p>
     * <p>
     * When setting the scrollPosition property, applications can change any combination of the sub-properties.
     * If both key and y sub-properties are set at once then key will take precedent.
     * If offsetY is specified, it will be used to adjust the scroll position from the position where the key of the item is located.
     * </p>
     * <p>
     * If a sparse object is set the other sub-properties will be populated and updated once WaterfallLayout has scrolled to that position.
     * </p>
     * <p>
     * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
     * of the currently rendered region, then the value of scrollPosition will be ignored.
     * </p>
     * Lastly, when a re-rendered is triggered by a <a href="DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
     * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will by default remain at the top.
     * </p>
     *
     * @ojshortdesc Specifies the current scroll position of the WaterfallLayout. See the Help documentation for more information.
     * @expose
     * @name scrollPosition
     * @instance
     * @memberof! oj.ojWaterfallLayout
     * @type {Object.<string, any>}
     * @default {"y": 0}
     * @property {number=} y The vertical position in pixels.
     * @property {any=} key The key of the item.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
     * DataProvider or if the item has not been fetched yet, then the value is ignored.
     * @property {number=} offsetY The vertical offset in pixels relative to the item identified by key.
     *
     * @ojsignature [{target:"type", value:"K", for:"key"}]
     * @ojwriteback
     * @example <caption>Initialize the WaterfallLayout with the <code class="prettyprint">scroll-position</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-waterfall-layout scroll-position.index='10'>&lt;/oj-waterfall-layout>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-waterfall-layout scroll-position='{"index": 10}'>&lt;/oj-waterfall-layout>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrollPosition</code> property after initialization:</caption>
     * // Get one
     * var scrollPositionValue = myWaterfallLayout.scrollPosition.key;
     *
     * // Set one, leaving the others intact
     * myWaterfallLayout.setProperty('scrollPosition.key', 'id10');
     *
     * // Get all
     * var scrollPositionValues = myWaterfallLayout.scrollPosition;
     *
     * // Set all.  Those not listed will be lost until the scroll completes and the remaining fields are populated.
     * myWaterfallLayout.scrollPosition = {y: 150};
     */

    /**
     * @typedef {Object} oj.ojWaterfallLayout.ItemTemplateContext
     * @property {Object} data The data for the current item being rendered
     * @property {number} index The zero-based index of the current item
     * @property {any} key The key of the current item being rendered
     */

    // Slots

    /**
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the WaterfallLayout. The slot content must be a &lt;template> element.
     * <p>The content inside the template must have a single <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> as the root node. It cannot have multiple root nodes,
     *    incluidng Text and Comment nodes.  The root node also cannot be a <a href="http://jet.us.oracle.com/jsdocs/BindingOverview.html">JET Binding Element</a>, you must wrap it with an Element node.
     *    If the content do contain multiple nodes, WaterfallLayout will take the first Element node it encountered and ignore the rest.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojWaterfallLayout.ItemTemplateContext]{@link oj.ojWaterfallLayout.ItemTemplateContext})</li>
     * </ul>
     *
     * @ojslot itemTemplate
     * @ojshortdesc The itemTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information.
     * @ojmaxitems 1
     * @memberof oj.ojWaterfallLayout
     * @ojslotitemprops oj.ojWaterfallLayout.ItemTemplateContext
     *
     * @example <caption>Initialize the WaterfallLayout with an inline item template specified:</caption>
     * &lt;oj-waterfall-layout>
     *   &lt;template slot='itemTemplate'>
     *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
     *   &lt;template>
     * &lt;/oj-waterfall-layout>
     */

    // Override contextMenu slot definition to remove it from the jsdoc as it is not yet supported

    /**
    * @ojslot contextMenu
    * @memberof oj.ojWaterfallLayout
    * @ignore
    */

    /**
     * @name refresh
     * @memberof oj.ojWaterfallLayout
     * @instance
     * @ignore
     */

    /**
     * @name translations
     * @memberof oj.ojWaterfallLayout
     * @instance
     * @ignore
     */

    class DefaultLayout {
        constructor(fullWidth, gutterWidth, itemWidth, cache) {
            this.fullWidth = fullWidth;
            this.gutterWidth = gutterWidth;
            this.itemWidth = itemWidth;
            this.cache = cache;
            this.columns = 0;
            this.margin = 0;
            this.columnsInfo = [];
            this.bottom = 0;
            this.keys = [];
            if (this.cache == null) {
                this.cache = new Map();
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
                    const minTop = this.columnsInfo.reduce(function (a, b) {
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
            this.fullWidth = width;
            if (this.columnsInfo.length > 0) {
                this._initializeColumnsInfo();
                this._invalidatePositions(0);
            }
        }
        getPositionForItems(items, startIndex) {
            let positions = new Map();
            if (isNaN(this.itemWidth) && items.length > 0) {
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
        insert(beforeKeys, keys) {
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
        remove(keys) {
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
        update(keys) {
            keys.forEach((key) => {
                let position = this.getPosition(key);
                if (position) {
                    position.height = undefined;
                }
            });
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
        constructor(root, dataProvider, callback, scrollPolicyOptions, itemDimension, gutterWidth) {
            super(root, dataProvider, callback, scrollPolicyOptions);
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.scrollPolicyOptions = scrollPolicyOptions;
            this.itemDimension = itemDimension;
            this.gutterWidth = gutterWidth;
            this.postRender = () => {
                const itemsRoot = this.root.lastElementChild.firstElementChild;
                if (itemsRoot && this.adjustPositionsResolveFunc == null) {
                    this.adjustPositionsResolveFunc = this._addComponentBusyState('adjusting item positions');
                    const busyContext = Context.getContext(itemsRoot).getBusyContext();
                    busyContext.whenReady().then(() => {
                        if (this.adjustPositionsResolveFunc) {
                            this.adjustPositionsResolveFunc();
                            this.adjustPositionsResolveFunc = null;
                        }
                        if (this.callback) {
                            const recalculate = this._handleOutOfRangeItems();
                            const result = this._adjustAllItems(recalculate);
                            if (result.done) {
                                if (this.domScroller && !this.domScroller.checkViewport()) {
                                    return;
                                }
                                this.callback.renderComplete(result.items);
                            }
                        }
                    });
                }
            };
            this.newItemsTracker = new Set();
            this.vnodesCache = new Map();
        }
        getLayout() {
            if (this.layout == null) {
                let itemWidth;
                if (this.itemDimension) {
                    itemWidth = this.itemDimension.width;
                }
                this.layout = new DefaultLayout(this.root.clientWidth, this.gutterWidth, itemWidth, new Map());
            }
            return this.layout;
        }
        _handleOutOfRangeItems() {
            let recalculate = false;
            const layout = this.getLayout();
            this.root.querySelectorAll('.oj-waterfalllayout-position-only').forEach((elem) => {
                const key = this.getKey(elem);
                let position = layout.getPosition(key);
                if (position) {
                    position.height = elem.offsetHeight;
                    recalculate = true;
                }
            });
            if (recalculate) {
                layout.recalculatePositions();
            }
            return recalculate;
        }
        _adjustAllItems(force) {
            let adjusted = true;
            const items = Array.from(this.root.querySelectorAll('.oj-waterfalllayout-item')).map((elem) => {
                if (elem.getAttribute('data-oj-positioned') === 'false') {
                    adjusted = false;
                }
                return { key: this.getKey(elem), element: elem };
            });
            if (adjusted && !force) {
                return { done: true, items: items };
            }
            const startIndex = this.callback.getData().startIndex;
            const positions = this.getLayout().getPositionForItems(items, isNaN(startIndex) ? 0 : startIndex);
            this.callback.setPositions(positions.positions);
            if (this.domScroller) {
                this.domScroller.setViewportRange(positions.start, positions.end);
            }
            return { done: false, items: items };
        }
        handleResizeWidth(newWidth) {
            this.initialFetch = false;
            this.getLayout().setWidth(newWidth);
            this.newItemsTracker.clear();
        }
        _addComponentBusyState(description) {
            const componentBusyContext = Context.getContext(this.root).getBusyContext();
            return componentBusyContext.addBusyState({ description: description });
        }
        handleBeforeFetchNext(scrollTop) {
            let positions = this.callback.getPositions();
            if (positions == null) {
                return -1;
            }
            let index = this.callback.getData().startIndex;
            if (isNaN(index)) {
                index = 0;
            }
            let iterator = positions.values();
            let pos = iterator.next();
            while (!pos.done) {
                let bottom = pos.value.top + pos.value.height;
                if (bottom > scrollTop) {
                    break;
                }
                pos = iterator.next();
                index++;
            }
            return index;
        }
        _isRenderingViewportOnly() {
            return false;
        }
        handleBeforeFetchByOffset(startIndex, endIndex) {
            if (!this._isRenderingViewportOnly()) {
                return;
            }
            let map = this.getLayout().getPositions();
            let positions = Array.from(map.values()).slice(startIndex, endIndex);
            if (positions.length > 0) {
                this.callback.setSkeletonPositions({
                    startIndex: startIndex,
                    endIndex: endIndex,
                    positions: positions
                });
            }
        }
        handleFetchSuccess(result) {
            if (result != null) {
                this.newItemsTracker.clear();
            }
            this.initialFetch = false;
            super.handleFetchSuccess(result);
        }
        renderFetchedData() {
            const positions = this.callback.getSkeletonPositions();
            if (positions != null && !isNaN(positions.startIndex) && !isNaN(positions.endIndex)) {
                const skeletonStartIndex = positions.startIndex;
                const skeletonEndIndex = positions.endIndex;
                let skeletonPositions = positions.positions;
                const dataObj = this.callback.getData();
                const dataStartIndex = isNaN(dataObj.startIndex) ? 0 : dataObj.startIndex;
                const dataEndIndex = dataStartIndex + dataObj.value.data.length;
                if (dataEndIndex < skeletonStartIndex || dataStartIndex > skeletonEndIndex) {
                    this._log('no data within range, rendering all items as skeletons');
                    return this.callback.renderSkeletons(skeletonPositions);
                }
                else {
                    let data = dataObj.value.data.slice(0);
                    let metadata = dataObj.value.metadata.slice(0);
                    if (dataStartIndex >= skeletonStartIndex) {
                        skeletonPositions = skeletonPositions.slice(0, dataStartIndex - skeletonStartIndex);
                    }
                    else {
                        data = data.slice(skeletonStartIndex - dataStartIndex);
                        metadata = metadata.slice(skeletonStartIndex - dataStartIndex);
                        this._log('rendering data from: ' +
                            skeletonStartIndex +
                            ' to ' +
                            (skeletonStartIndex + data.length));
                    }
                    if (dataEndIndex >= skeletonEndIndex) {
                        data = data.slice(0, skeletonEndIndex - dataEndIndex);
                        metadata = metadata.slice(0, skeletonEndIndex - dataEndIndex);
                        this._log('rendering data from: ' + dataStartIndex + ' to ' + (dataStartIndex + data.length));
                    }
                    let skeletons = this.callback.renderSkeletons(skeletonPositions);
                    let content = this.renderData(data, metadata);
                    return content.concat(skeletons);
                }
            }
            else {
                return super.renderFetchedData();
            }
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
            this.decorateItem(vnodes, key, index, x, y, initialFetch, visible);
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
        decorateItem(vnodes, key, index, x, y, initialFetch, visible) {
            let contentRoot;
            for (let i = 0; i < vnodes.length; i++) {
                const node = vnodes[i]._node;
                if (node.nodeType === 1) {
                    contentRoot = node;
                    break;
                }
            }
            if (contentRoot != null &&
                !contentRoot.classList.contains('oj-waterfalllayout-exit-animation')) {
                contentRoot.key = key;
                contentRoot.setAttribute('key', JSON.stringify(key));
                contentRoot.setAttribute('role', 'gridcell');
                contentRoot.setAttribute('tabIndex', '-1');
                contentRoot.setAttribute('data-oj-positioned', x != -1 && y != -1 ? 'true' : 'false');
                const styleClasses = this.getItemStyleClass(visible, x, y, this.newItemsTracker.has(key), initialFetch);
                styleClasses.forEach((styleClass) => {
                    contentRoot.classList.add(styleClass);
                });
                const inlineStyle = this.getItemInlineStyle(visible, x, y, index, initialFetch);
                Object.keys(inlineStyle).forEach((prop) => {
                    contentRoot.style[prop] = inlineStyle[prop];
                });
            }
        }
        getItemInlineStyle(visible, x, y, index, animate) {
            let style = {};
            if (x === -1 || y === -1) {
                style.top = 0;
                style.left = 0;
            }
            else {
                style.left = x + 'px';
                style.top = y + 'px';
            }
            if (visible && x != -1 && y != -1) {
                if (!animate) {
                    style.visibility = 'visible';
                }
                else {
                    style.opacity = 0;
                    if (!isNaN(index)) {
                        style.animationDelay = 50 * index + 'ms';
                    }
                }
            }
            return style;
        }
        getItemStyleClass(visible, x, y, isNew, animate) {
            let styleClass = [];
            if (visible) {
                styleClass.push('oj-waterfalllayout-item');
                if (x != -1 && y != -1) {
                    if (animate) {
                        styleClass.push('oj-waterfalllayout-entrance-animation');
                    }
                    else if (isNew) {
                        styleClass.push('oj-waterfalllayout-item-fadein-animation');
                    }
                }
            }
            else {
                styleClass.push('oj-waterfalllayout-position-only');
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
        handleItemsAdded(detail) {
            const addBeforeKeys = detail.addBeforeKeys;
            if (addBeforeKeys != null) {
                const keys = Array.from(detail.keys);
                this.getLayout().insert(addBeforeKeys, keys);
            }
            super.handleItemsAdded(detail);
        }
        handleItemsRemoved(detail) {
            const keys = Array.from(detail.keys);
            this.getLayout().remove(keys);
            super.handleItemsRemoved(detail);
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
            var keys = Array.from(detail.keys);
            this.getLayout().update(keys);
            super.handleItemsUpdated(detail);
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
    exports.WaterfallLayout = WaterfallLayout_1 = class WaterfallLayout extends ojvcomponent.VComponent {
        constructor(props) {
            super(props);
            this.restoreFocus = false;
            this.actionableMode = false;
            this.ticking = false;
            this.setRootElement = (element) => {
                this.root = element;
            };
            this.state = {
                renderedData: null,
                outOfRangeData: null,
                positions: null,
                skeletonPositions: null,
                width: 0,
                height: 0
            };
        }
        _handleFocusIn(event) {
            if (this.currentItem) {
                this.currentItem.classList.add('oj-focus');
            }
        }
        _handleFocusOut(event) {
            if (this.currentItem) {
                this.currentItem.classList.remove('oj-focus');
                this.currentItem.classList.remove('oj-waterfalllayout-item-suppress-focus');
            }
        }
        _handleClick(event) {
            this._handleTouchOrClickEvent(event);
        }
        _handlePointerDown(event) {
            let item = event.target.closest('.' + this.getItemStyleClass());
            if (item != null) {
                item.classList.add('oj-waterfalllayout-item-suppress-focus');
            }
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
                    default: {
                        break;
                    }
                }
                if (this.actionableMode === false &&
                    next != null &&
                    next.classList.contains(this.getItemStyleClass())) {
                    this.currentItem.classList.remove('oj-waterfalllayout-item-suppress-focus');
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
            return (ojvcomponent.h("oj-waterfall-layout", { ref: this.setRootElement },
                ojvcomponent.h("div", { onClick: this._handleClick, onKeydown: this._handleKeyDown, onTouchstart: this._touchStartHandler, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut, onPointerdown: this._handlePointerDown, role: 'grid' },
                    ojvcomponent.h("div", { role: 'row', "data-oj-context": true }, content))));
        }
        mounted() {
            const root = this.getRootElement();
            this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this.props.scrollPolicyOptions, null, WaterfallLayout_1.gutterWidth);
            this.contentHandler.fetchRows();
            const rootWidth = root.clientWidth;
            const rootHeight = root.clientHeight;
            this.updateState({ width: rootWidth, height: rootHeight });
            let skeleton = root.querySelector('.oj-waterfalllayout-skeleton');
            if (skeleton) {
                this.skeletonWidth = skeleton.clientWidth;
                this._delayShowSkeletons();
            }
            if (window['ResizeObserver']) {
                const resizeObserver = new window['ResizeObserver']((entries) => {
                    entries.forEach((entry) => {
                        if (entry.target === root && entry.contentRect) {
                            const currWidth = this.state.width;
                            const newWidth = Math.round(entry.contentRect.width);
                            if (Math.abs(newWidth - currWidth) > 1) {
                                this.contentHandler.handleResizeWidth(newWidth);
                                this.updateState({ width: newWidth });
                            }
                            const currHeight = this.state.height;
                            const newHeight = Math.round(entry.contentRect.height);
                            if (Math.abs(newHeight - currHeight) > 1) {
                                this.updateState({ height: newHeight });
                            }
                        }
                    });
                });
                resizeObserver.observe(root);
                this.resizeObserver = resizeObserver;
                this._getScroller().addEventListener('scroll', this.scrollListener);
            }
        }
        updated(oldProps, oldState) {
            const data = this.getData();
            if (data != null) {
                const root = this.getRootElement();
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
                    this._applyExitAnimation().then(() => {
                        this.updateState({ renderedData: null });
                        if (this.contentHandler) {
                            this.contentHandler.destroy();
                        }
                        this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this.props.scrollPolicyOptions, null, WaterfallLayout_1.gutterWidth);
                        this.contentHandler.fetchRows();
                        this._delayShowSkeletons();
                    });
                }
                else {
                    this.contentHandler.postRender();
                }
                if (this.props.scrollPosition != oldProps.scrollPosition) {
                    this._syncScrollTopWithProps();
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
                    const positions = this._getPositionsForSkeletons(50, this.state.width, this.skeletonWidth);
                    this.updateState({ skeletonPositions: positions });
                }
            }, this._getShowSkeletonsDelay());
        }
        _getOptionDefaults() {
            if (this.defaultOptions == null) {
                this.defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-waterfalllayout-option-defaults');
            }
            return this.defaultOptions;
        }
        _getShowSkeletonsDelay() {
            const defaultOptions = this._getOptionDefaults();
            if (defaultOptions == null) {
                return 0;
            }
            const delay = parseInt(defaultOptions.showIndicatorDelay, 10);
            return isNaN(delay) ? 0 : delay;
        }
        _addBusyState(description) {
            const root = this.getRootElement();
            const componentBusyContext = Context.getContext(root).getBusyContext();
            return componentBusyContext.addBusyState({ description: description });
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
        getOutOfRangeData() {
            return this.state.outOfRangeData;
        }
        setOutOfRangeData(data) {
            this.updateState({ outOfRangeData: data });
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
            this.updateState({ positions: positions, outOfRangeData: null });
        }
        getItemRenderer() {
            return this.props.itemTemplate;
        }
        getItemStyleClass() {
            return 'oj-waterfalllayout-item';
        }
        getItemElementStyleClass() {
            return 'oj-waterfalllayout-item-element';
        }
        getExpanded() { }
        _applySkeletonExitAnimation(skeletons) {
            const resolveFunc = this._addBusyState('apply skeleton exit animations');
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
        _applyExitAnimation() {
            const resolveFunc = this._addBusyState('apply exit animations on existing items');
            return new Promise((resolve, reject) => {
                const root = this.getRootElement();
                const items = root.querySelectorAll('.' + this.getItemStyleClass());
                if (items.length === 0) {
                    resolveFunc();
                    resolve(true);
                }
                else {
                    const listener = (event) => {
                        root.removeEventListener('animationend', listener);
                        items.forEach((item) => {
                            item.classList.remove('oj-waterfalllayout-exit-animation');
                        });
                        resolveFunc();
                        resolve(true);
                    };
                    root.addEventListener('animationend', listener);
                    items.forEach((item) => {
                        item.style.animationDelay = '0ms';
                        item.classList.remove('oj-waterfalllayout-item-fadein-animation');
                        item.classList.remove('oj-waterfalllayout-entrance-animation');
                        item.classList.add('oj-waterfalllayout-exit-animation');
                    });
                }
            });
        }
        scrollListener(event) {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this._updateScrollPosition();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }
        _updateScrollPosition() {
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
            this._updateProperty('scrollPosition', scrollPosition);
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
            elem.classList.remove('oj-focus');
            elem.tabIndex = -1;
        }
        _setFocus(elem, focus) {
            elem.tabIndex = 0;
            if (focus) {
                elem.classList.add('oj-focus');
                elem.focus();
            }
        }
        _updateCurrentItem(item) {
            let currentElem = this.currentItem;
            this._resetFocus(currentElem);
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
            const scroller = this.props.scrollPolicyOptions.scroller;
            return scroller != null ? scroller : this.getRootElement();
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
                return ojvcomponent.h("div", { role: 'row' }, skeletons);
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
            let layout = new DefaultLayout(rootWidth, WaterfallLayout_1.gutterWidth, skeletonWidth, cache);
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
        renderSkeletonsForLoadMore(columnsInfo, itemWidth) {
            let skeletons = [];
            const maxTop = Math.max(...columnsInfo.map((column) => {
                return column.top;
            }));
            if (maxTop > 0) {
                const endPos = maxTop + 100;
                columnsInfo.forEach((columnInfo) => {
                    let position = {
                        left: columnInfo.left,
                        top: columnInfo.top,
                        height: endPos - columnInfo.top,
                        width: itemWidth
                    };
                    skeletons.push(this._renderSkeleton(position));
                });
            }
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
            return (ojvcomponent.h("div", { class: 'oj-waterfalllayout-skeleton', style: style },
                ojvcomponent.h("div", { class: 'oj-waterfalllayout-skeleton-content oj-animation-skeleton' })));
        }
    };
    exports.WaterfallLayout.gutterWidth = 20;
    exports.WaterfallLayout.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "data": { "type": "object|null", "value": null }, "scrollPolicy": { "type": "string", "enumValues": ["loadAll", "loadMoreOnScroll"], "value": "loadMoreOnScroll" }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number", "value": 25 }, "maxCount": { "type": "number", "value": 500 }, "scroller": { "type": "Element|null", "value": null } } }, "scrollPosition": { "type": "object", "properties": { "y": { "type": "number", "value": 0 }, "key": { "type": "any" }, "offsetY": { "type": "number" } }, "writeback": true, "readOnly": false } }, "slots": { "itemTemplate": {} } };
    __decorate([
        ojvcomponent.listener()
    ], exports.WaterfallLayout.prototype, "_handleFocusIn", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.WaterfallLayout.prototype, "_handleFocusOut", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.WaterfallLayout.prototype, "_handleClick", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.WaterfallLayout.prototype, "_handlePointerDown", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.WaterfallLayout.prototype, "_handleKeyDown", null);
    __decorate([
        ojvcomponent.listener({ passive: true })
    ], exports.WaterfallLayout.prototype, "_touchStartHandler", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.WaterfallLayout.prototype, "scrollListener", null);
    exports.WaterfallLayout = WaterfallLayout_1 = __decorate([
        ojvcomponent.customElement('oj-waterfall-layout')
    ], exports.WaterfallLayout);

    Object.defineProperty(exports, '__esModule', { value: true });

});
