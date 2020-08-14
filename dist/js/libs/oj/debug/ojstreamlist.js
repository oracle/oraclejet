define(['exports', 'ojs/ojvcomponent', 'ojs/ojdatacollection-common', 'ojs/ojcontext', 'ojs/ojvcollection', 'ojs/ojcore-base', 'ojs/ojkeyset', 'ojs/ojtreedataprovider', 'ojs/ojanimation'], function (exports, ojvcomponent, DataCollectionUtils, Context, ojvcollection, oj, KeySet, ojtreedataprovider, AnimationUtils) { 'use strict';

    /**
     * @license
     * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
     * The Universal Permissive License (UPL), Version 1.0
     * as shown at https://oss.oracle.com/licenses/upl/
     * @ignore
     */
    /**
     * @ojcomponent oj.ojStreamList
     * @ojtsvcomponent
     * @augments oj.baseComponent
     * @since 9.0.0
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "ItemMetadata"]}
     * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
     * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
     * @ojsignature [{
     *                target: "Type",
     *                value: "class ojStreamList<K extends (string | number), D> extends baseComponent<ojStreamListSettableProperties<K,D>>",
     *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
     *               },
     *               {
     *                target: "Type",
     *                value: "ojStreamListSettableProperties<K,D> extends baseComponentSettableProperties",
     *                for: "SettableProperties"
     *               }
     *              ]
     *
     * @ojunsupportedthemes ["Alta"]
     *
     * @ojshortdesc A stream list displays data in an activity stream feed.
     * @ojrole list
     *
     * @ojuxspecs ['activity-stream']
     *
     * @classdesc
     * <h3 id="streamListOverview-section">
     *   JET StreamList
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#streamListOverview-section"></a>
     * </h3>
     * <p>Description: The JET StreamList displays data in an activity stream feed.</p>
     * <pre class="prettyprint">
     * <code>//StreamList with a DataProvider
     *&lt;oj-stream-list data="[[dataProvider]]">
     * &lt;/oj-stream-list>
     *</code></pre>
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
     *
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
     *       <td>Item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Focus on the item.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
     * @memberof oj.ojStreamList
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
     *       <td rowspan="6" nowrap>Item</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Move focus to the previous item according to the data order.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
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
     *     <tr>
     *       <td rowspan="2" nowrap>Group Item</td>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Collapse the current item if it is expanded and is collapsible.  For non-hierarchical data, do nothing.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Expand the current item if it has children and is expandable.  For non-hierarchical data, do nothing.</td>
     *     </tr>
     *   </tbody>
     *   </tbody>
     * </table>
     *
     * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
     * @memberof oj.ojStreamList
     */

    /**
     * The data for StreamList. Must be of type <a href="DataProvider.html">DataProvider</a> or <a href="TreeDataProvider.html">TreeDataProvider</a>.
     *
     * @ojshortdesc Specifies the data for the component. See the Help documentation for more information.
     * @expose
     * @name data
     * @memberof! oj.ojStreamList
     * @instance
     * @type {Object}
     * @default null
     *
     * @example <caption>Initialize the StreamList with the <code class="prettyprint">data</code> attribute specified:</caption>
     * &lt;oj-stream-list data='{{myDataProvider}}'>&lt;/oj-stream-list>
     *
     * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
     * // getter
     * var dataValue = myStreamList.data;
     *
     * // setter
     * myStreamList.data = myDataProvider;
     * @ojsignature [{target: "Type", value: "oj.DataProvider<K, D>|oj.TreeDataProvider<K, D>|null"}]
     */

    /**
     * Specifies the key set containing the keys of the items that should be expanded.
     *
     * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify items to expand.
     * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all items.
     *
     * @ojshortdesc Specifies the key set containing the keys of the items that should be expanded.
     * @expose
     * @name expanded
     * @memberof! oj.ojStreamList
     * @instance
     * @default new KeySetImpl();
     * @type {KeySet}
     * @ojsignature {target:"Type", value:"oj.KeySet<K>"}
     *
     * @ojwriteback
     *
     * @example <caption>Initialize the StreamList with specific items expanded:</caption>
     * myStreamList.expanded = new KeySetImpl(['item1', 'item2']);
     *
     * @example <caption>Initialize the ListView with all items expanded:</caption>
     * myStreamList.expanded = new AllKeySetImpl();
     */

    /**
     * Specifies the mechanism used to scroll the data inside the StreamList. Possible values are: "loadMoreOnScroll", and "loadAll".
     * When "loadMoreOnScroll" is specified, additional data is fetched when the user scrolls to the bottom of the StreamList.  Note that
     * the component must have a height specified or inside a height constraint element so that the component element is scrollable.
     * When "loadAll" is specified, StreamList will fetch all the data when it is initially rendered.
     *
     * @ojshortdesc Specifies how data are fetched as user scrolls towards the bottom of the list.
     * @expose
     * @name scrollPolicy
     * @memberof! oj.ojStreamList
     * @instance
     * @type {string|null}
     * @default "loadMoreOnScroll"
     * @ojvalue {string} "loadAll" Fetch and render all data.
     * @ojvalue {string} "loadMoreOnScroll" Additional data is fetched when the user scrolls towards the bottom of the list.
     *
     * @example <caption>Initialize the StreamList with the <code class="prettyprint">scroll-policy</code> attribute specified:</caption>
     * &lt;oj-stream-list scroll-policy='loadMoreOnScroll'>&lt;/oj-stream-list>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrollPolicy</code> property after initialization:</caption>
     * // getter
     * var scrollPolicyValue = myStreamList.scrollPolicy;
     *
     * // setter
     * myStreamList.scrollPolicy = 'loadMoreOnScroll';
     */

    /**
     * scrollPolicy options.
     * <p>
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
     *   <li>scroller: The element which StreamList uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-stream-list element is used.</li>
     * </ul>
     * When scrollPolicy is loadMoreOnScroll, the next block of rows is fetched
     * when the user scrolls to the end of the component. The fetchSize option
     * determines how many rows are fetched in each block.
     *
     * @ojshortdesc Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
     * @expose
     * @name scrollPolicyOptions
     * @instance
     * @memberof! oj.ojStreamList
     * @type {Object.<string, any>|null}
     *
     * @example <caption>Initialize the StreamList with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
     * &lt;oj-stream-list scroll-policy-options.fetch-size='30'>&lt;/oj-stream-list>
     *
     * @example <caption>Get or set the <code class="prettyprint">scroll-policy-options</code> attribute after initialization:</caption>
     * // getter
     * var fetchSizeValue = myStreamList.scrollPolicyOptions.fetchSize;
     *
     * // setter
     * myStreamList.scrollPolicyOptions.fetchSize = 30;
     *
     * @example <caption>Initialize the StreamList with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-stream-list scroll-policy-options.fetch-size='30' scroll-policy-options.max-count='1000'>&lt;/oj-stream-list>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrollPolicyOptions</code> property after initialization:</caption>
     * // Get one
     * var fetchSizeValue = myStreamList.scrollPolicyOptions.fetchSize;
     *
     * // Get all
     * var scrollPolicyOptionsValues = myStreamList.scrollPolicyOptions;
     *
     * // Set one, leaving the others intact
     * myStreamList.setProperty('scrollPolicyOptions.fetchSize', 30);
     *
     * // Set all.
     * myStreamList.scrollPolicyOptions = {fetchSize: 30, maxCount: 1000};
     */

    /**
     * The number of items to fetch in each block.
     * @expose
     * @name scrollPolicyOptions.fetchSize
     * @memberof! oj.ojStreamList
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
     * @memberof! oj.ojStreamList
     * @instance
     * @type {number}
     * @default 500
     * @ojsignature { target: "Type",
     *                value: "?"}
     */
    /**
     * The element which StreamList uses to determine the scroll position as well as the maximum scroll position.
     * @expose
     * @name scrollPolicyOptions.scroller
     * @ojshortdesc The element used to determine the scroll position as well as the maximum scroll position. See the Help documentation for more information.
     * @memberof! oj.ojStreamList
     * @instance
     * @type {Element}
     * @default null
     * @ojsignature { target: "Type",
     *                value: "?"}
     */

     /**
     * @typedef {Object} oj.ojStreamList.ScrollPositionType
     * @property {number=} y The vertical position in pixels.
     * @property {any=} key The key of the item.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
     * DataProvider or if the item has not been fetched yet, then the value is ignored.
     * @property {number=} offsetY The vertical offset in pixels relative to the item identified by key.
     * @property {any=} parentKey The key of the parent if tree data.
     * @ojsignature [{target:"Type", value:"K", for:"key"},
     *               {target:"Type", value:"K", for:"parentKey"},
     *               {target:"Type", value:"<K>", for:"genericTypeParameters"}]
     */

    /**
     * The current scroll position of StreamList. The scroll position is updated when the vertical scroll position
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
     * If a sparse object is set the other sub-properties will be populated and updated once StreamList has scrolled to that position.
     * </p>
     * <p>
     * Also, if <a href="#scrollPolicy">scrollPolicy</a> is set to 'loadMoreOnScroll' and the scrollPosition is set to a value outside
     * of the currently rendered region, then the value of scrollPosition will be ignored.
     * </p>
     * Lastly, when a re-rendered is triggered by a <a href="oj.DataProviderRefreshEvent.html">refresh event</a> from the DataProvider,
     * or if the value for <a href="#data">data</a> attribute has changed, then the scrollPosition will by default remain at the top.
     * </p>
     *
     * @ojshortdesc Specifies the current scroll position of the StreamList. See the Help documentation for more information.
     * @expose
     * @name scrollPosition
     * @instance
     * @memberof! oj.ojStreamList
     * @type {Object.<string, any>}
     * @default {"y": 0}
     * @property {number=} y The vertical position in pixels.
     * @property {any=} key The key of the item.  If DataProvider is used for <a href="#data">data</a> and the key does not exists in the
     * DataProvider or if the item has not been fetched yet, then the value is ignored.
     * @property {number=} offsetY The vertical offset in pixels relative to the item identified by key.
     * @property {any=} parentKey The key of the parent if tree data.
     * @ojsignature [{target: "Type", value: "oj.ojStreamList.ScrollPositionType<K> | null"}, {target:"type", value:"K", for:"key"}, {target:"type", value:"K", for:"parentKey"}]
     *
     * @ojwriteback
     * @example <caption>Initialize the StreamList with the <code class="prettyprint">scroll-position</code> attribute specified:</caption>
     * &lt;!-- Using dot notation -->
     * &lt;oj-stream-list scroll-position.y='10'>&lt;/oj-stream-list>
     *
     * &lt;!-- Using JSON notation -->
     * &lt;oj-stream-list scroll-position='{"y": 10}'>&lt;/oj-stream-list>
     *
     * @example <caption>Get or set the <code class="prettyprint">scrollPosition</code> property after initialization:</caption>
     * // Get one
     * var scrollPositionValue = myStreamList.scrollPosition.key;
     *
     * // Set one, leaving the others intact
     * myStreamList.setProperty('scrollPosition.key', 'id10');
     *
     * // Get all
     * var scrollPositionValues = myStreamList.scrollPosition;
     *
     * // Set all.  Those not listed will be lost until the scroll completes and the remaining fields are populated.
     * myStreamList.scrollPosition = {y: 150};
     */

    /**
     * @typedef {Object} oj.ojStreamList.ItemTemplateContext
     * @property {any} data The data for the current item being rendered.
     * @property {any} key The key of the current item being rendered.
     * @property {number=} depth The zero-based depth of the current item, null if not a TreeDataProvider.
     * @property {any=} parentKey The key of the parent current item being rendered, null if not a TreeDataProvider.
     * @property {boolean=} leaf If the current item has children, null if not a TreeDataProvider.
     * @ojsignature [{target:"Type", value:"D", for:"data"},
     *               {target:"Type", value:"K", for:"key"},
     *               {target:"Type", value:"K", for:"parentKey"},
     *               {target:"Type", value:"<K,D>", for:"genericTypeParameters"}]
     */

    // Slots

    /**
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot content must be a &lt;template> element.
     * <p>This slot is required or there will be no default rendering. If a <code class="prettyprint">groupTemplate</code> is not specified the <code class="prettyprint">itemTemplate</code> will be used as a fallback.
     * <p>The content inside the template must have a single <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> as the root node. It cannot have multiple root nodes,
     *    incluidng Text and Comment nodes.  The root node also cannot be a <a href="http://jet.us.oracle.com/jsdocs/BindingOverview.html">JET Binding Element</a>, you must wrap it with an Element node.
     *    If the content do contain multiple nodes, StreamList will take the first Element node it encountered and ignore the rest.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojStreamList.ItemTemplateContext]{@link oj.ojStreamList.ItemTemplateContext})</li>
     * </ul>
     *
     * @ojslot itemTemplate
     * @ojshortdesc The itemTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information.
     * @ojmaxitems 1
     * @memberof oj.ojStreamList
     * @ojslotitemprops oj.ojStreamList.ItemTemplateContext
     *
     * @example <caption>Initialize the StreamList with an inline item template specified:</caption>
     * &lt;oj-stream-list>
     *   &lt;template slot='itemTemplate'>
     *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
     *   &lt;template>
     * &lt;/oj-stream-list>
     */

    /**
     * <p>The <code class="prettyprint">groupTemplate</code> slot is used to specify the template for rendering each non-leaf item in the list. The slot content must be a &lt;template> element.
     * <p>If a <code class="prettyprint">groupTemplate</code> is not specified the <code class="prettyprint">itemTemplate</code> will be used as a fallback.
     * <p>The content inside the template must have a single <a href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> as the root node. It cannot have multiple root nodes,
     *    incluidng Text and Comment nodes.  The root node also cannot be a <a href="http://jet.us.oracle.com/jsdocs/BindingOverview.html">JET Binding Element</a>, you must wrap it with an Element node.
     *    If the content do contain multiple nodes, StreamList will take the first Element node it encountered and ignore the rest.</p>
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See [oj.ojStreamList.ItemTemplateContext]{@link oj.ojStreamList.ItemTemplateContext})</li>
     * </ul>
     *
     * @ojslot groupTemplate
     * @ojshortdesc The groupTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information.
     * @ojmaxitems 1
     * @memberof oj.ojStreamList
     * @ojslotitemprops oj.ojStreamList.ItemTemplateContext
     *
     * @example <caption>Initialize the StreamList with an inline item template specified:</caption>
     * &lt;oj-stream-list>
     *   &lt;template slot='groupTemplate'>
     *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
     *   &lt;template>
     * &lt;/oj-stream-list>
     */

    // Override contextMenu slot definition to remove it from the jsdoc as it is not yet supported

    /**
    * @ojslot contextMenu
    * @memberof oj.ojStreamList
    * @ignore
    */

    /**
     * @name refresh
     * @memberof oj.ojStreamList
     * @instance
     * @ignore
     */

    /**
     * @name translations
     * @memberof oj.ojStreamList
     * @instance
     * @ignore
     */

    class StreamListContentHandler extends ojvcollection.IteratingDataProviderContentHandler {
        constructor(root, dataProvider, callback, scrollPolicyOptions) {
            super(root, dataProvider, callback, scrollPolicyOptions);
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.scrollPolicyOptions = scrollPolicyOptions;
            this.postRender = () => {
                this.vnodesCache = this.newVnodesCache;
                this.newVnodesCache = new Map();
                const itemsRoot = this.root.lastElementChild;
                if (itemsRoot) {
                    const busyContext = Context.getContext(itemsRoot).getBusyContext();
                    busyContext.whenReady().then(() => {
                        if (this.callback) {
                            if (this.domScroller) {
                                let items = itemsRoot.querySelectorAll('.oj-stream-list-item');
                                const rootOffsetTop = this.root.offsetTop;
                                const start = items[0].offsetTop - rootOffsetTop;
                                const end = items[items.length - 1].offsetTop +
                                    items[items.length - 1].offsetHeight -
                                    rootOffsetTop;
                                this.domScroller.setViewportRange(start, end);
                            }
                            if (this.domScroller && !this.domScroller.checkViewport()) {
                                return;
                            }
                        }
                    });
                }
            };
            this.newItemsTracker = new Set();
            this.vnodesCache = new Map();
            this.newVnodesCache = new Map();
        }
        handleFetchSuccess(result) {
            if (result != null) {
                this.newItemsTracker.clear();
            }
            super.handleFetchSuccess(result);
        }
        handleItemsUpdated(detail) {
            detail.keys.forEach(function (key) {
                this.vnodesCache.delete(key);
            }.bind(this));
            super.handleItemsUpdated(detail);
        }
        handleItemsRemoved(detail) {
            detail.keys.forEach(function (key) {
                this.vnodesCache.delete(key);
            }.bind(this));
            super.handleItemsRemoved(detail);
        }
        handleModelRefresh() {
            this.vnodesCache.clear();
            super.handleModelRefresh();
        }
        addItem(key, index, data, visible) {
            const initialFetch = this.isInitialFetch();
            const currentItem = this.callback.getCurrentItem();
            if (currentItem == null && initialFetch && index == 0) {
                this.callback.setCurrentItem(key);
            }
            const vnodes = this.renderItem(key, index, data);
            this.decorateItem(vnodes, key, index, initialFetch, visible);
            return vnodes;
        }
        renderItem(key, index, data) {
            const node = this.vnodesCache.get(key);
            if (node) {
                this.newVnodesCache.set(key, { vnodes: node.vnodes });
                return node.vnodes;
            }
            const renderer = this.callback.getItemRenderer();
            const vnodes = renderer({ data: data, key: key });
            let vnode;
            for (let i = 0; i < vnodes.length; i++) {
                const node = vnodes[i]._node;
                if (node.nodeType === 1) {
                    vnode = vnodes[i];
                    break;
                }
            }
            let prunedVnodes = [vnode];
            this.newVnodesCache.set(key, { vnodes: prunedVnodes });
            return prunedVnodes;
        }
        decorateItem(vnodes, key, index, initialFetch, visible) {
            let vnode = vnodes[0];
            let contentRoot = vnode._node;
            if (contentRoot != null) {
                vnode.key = key;
                contentRoot.key = key;
                contentRoot.setAttribute('key', JSON.stringify(key));
                contentRoot.setAttribute('role', 'listitem');
                contentRoot.setAttribute('tabIndex', '-1');
                const styleClasses = this.getItemStyleClass(visible, this.newItemsTracker.has(key), initialFetch);
                styleClasses.forEach((styleClass) => {
                    contentRoot.classList.add(styleClass);
                });
                const inlineStyle = this.getItemInlineStyle(visible, index, initialFetch);
                Object.keys(inlineStyle).forEach((prop) => {
                    contentRoot.style[prop] = inlineStyle[prop];
                });
            }
        }
        getItemInlineStyle(visible, index, animate) {
            let style = {};
            return style;
        }
        getItemStyleClass(visible, isNew, animate) {
            let styleClass = [];
            styleClass.push('oj-stream-list-item');
            if (animate) {
            }
            return styleClass;
        }
        renderSkeletonsForLoadMore() {
            return this.callback.renderSkeletons(3);
        }
    }

    class StreamListTreeContentHandler extends ojvcollection.IteratingTreeDataProviderContentHandler {
        constructor(root, dataProvider, callback, scrollPolicyOptions) {
            super(root, dataProvider, callback, scrollPolicyOptions);
            this.root = root;
            this.dataProvider = dataProvider;
            this.callback = callback;
            this.scrollPolicyOptions = scrollPolicyOptions;
            this.postRender = () => {
                this.vnodesCache = this.newVnodesCache;
                this.newVnodesCache = new Map();
                const itemsRoot = this.root.lastElementChild;
                if (itemsRoot) {
                    const busyContext = Context.getContext(itemsRoot).getBusyContext();
                    busyContext.whenReady().then(() => {
                        this.checkViewport();
                    });
                }
            };
            this.getLoadMoreCount = () => {
                return 3;
            };
            this.newItemsTracker = new Set();
            this.vnodesCache = new Map();
            this.newVnodesCache = new Map();
        }
        handleFetchSuccess(result) {
            if (result != null) {
                this.newItemsTracker.clear();
            }
            super.handleFetchSuccess(result);
        }
        handleItemsUpdated(detail) {
            detail.keys.forEach(function (key) {
                this.vnodesCache.delete(key);
            }.bind(this));
            super.handleItemsUpdated(detail);
        }
        handleItemsRemoved(detail) {
            detail.keys.forEach(function (key) {
                this.vnodesCache.delete(key);
            }.bind(this));
            super.handleItemsRemoved(detail);
        }
        handleModelRefresh() {
            this.vnodesCache.clear();
            super.handleModelRefresh();
        }
        addItem(metadata, index, data, visible) {
            const initialFetch = this.isInitialFetch();
            const currentItem = this.callback.getCurrentItem();
            if (currentItem == null && initialFetch && index == 0) {
                this.callback.setCurrentItem(metadata.key);
            }
            const vnodes = this.renderItem(metadata, index, data);
            this.decorateItem(vnodes, metadata, index, initialFetch, visible);
            return vnodes;
        }
        renderItem(metadata, index, data) {
            let key = metadata.key;
            const node = this.vnodesCache.get(key);
            if (node) {
                this.newVnodesCache.set(key, { vnodes: node.vnodes });
                return node.vnodes;
            }
            let renderer;
            let vnodes;
            if (!metadata.isLeaf) {
                renderer = this.callback.getGroupRenderer();
            }
            if (renderer == null) {
                renderer = this.callback.getItemRenderer();
            }
            vnodes = renderer({
                data: data,
                key: metadata.key,
                leaf: metadata.isLeaf,
                parentKey: metadata.parentKey,
                depth: metadata.treeDepth
            });
            let vnode;
            for (let i = 0; i < vnodes.length; i++) {
                const node = vnodes[i]._node;
                if (node.nodeType === 1) {
                    vnode = vnodes[i];
                    break;
                }
            }
            let prunedVnodes = [vnode];
            this.newVnodesCache.set(key, { vnodes: prunedVnodes });
            return prunedVnodes;
        }
        decorateItem(vnodes, metadata, index, initialFetch, visible) {
            let vnode = vnodes[0];
            let contentRoot = vnode._node;
            if (contentRoot != null) {
                vnode.key = metadata.key;
                contentRoot.key = metadata.key;
                contentRoot.setAttribute('key', JSON.stringify(metadata.key));
                contentRoot.setAttribute('role', 'listitem');
                contentRoot.setAttribute('tabIndex', '-1');
                const styleClasses = this.getItemStyleClass(metadata, visible, this.newItemsTracker.has(metadata.key), initialFetch);
                styleClasses.forEach((styleClass) => {
                    contentRoot.classList.add(styleClass);
                });
                const inlineStyle = this.getItemInlineStyle(metadata, visible, index, initialFetch);
                Object.keys(inlineStyle).forEach((prop) => {
                    contentRoot.style[prop] = inlineStyle[prop];
                });
                if (!metadata.isLeaf) {
                    let expandedProp = this.callback.getExpanded();
                    let expanded = expandedProp && expandedProp.has(metadata.key);
                    if (expanded) {
                        contentRoot.setAttribute('aria-expanded', 'true');
                    }
                    else {
                        contentRoot.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        }
        getItemInlineStyle(metadata, visible, index, animate) {
            let style = {};
            return style;
        }
        getItemStyleClass(metadata, visible, isNew, animate) {
            let styleClass = [];
            if (!metadata.isLeaf) {
                styleClass.push('oj-stream-list-group');
            }
            else {
                styleClass.push('oj-stream-list-item');
            }
            if (animate) {
            }
            return styleClass;
        }
        renderSkeletonsForLoadMore() {
            return this.callback.renderSkeletons(3);
        }
        renderSkeletonsForExpand(key) {
            return this.callback.renderSkeletons(this.getLoadMoreCount(), true, key);
        }
    }

    var __decorate = (null && null.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var StreamList_1;
    class Props {
        constructor() {
            this.data = null;
            this.expanded = new KeySet.KeySetImpl();
            this.scrollPolicy = 'loadMoreOnScroll';
            this.scrollPolicyOptions = {
                fetchSize: 25,
                maxCount: 500,
                scroller: null
            };
            this.scrollPosition = { y: 0 };
        }
    }
    exports.StreamList = StreamList_1 = class StreamList extends ojvcomponent.VComponent {
        constructor(props) {
            super(props);
            this.restoreFocus = false;
            this.actionableMode = false;
            this.skeletonHeight = 0;
            this.setRootElement = (element) => {
                this.root = element;
            };
            this.state = {
                renderedData: null,
                outOfRangeData: null,
                initialSkeleton: true,
                initialSkeletonCount: 1,
                expandedToggleKeys: new KeySet.KeySetImpl(),
                expandedSkeletonKeys: new KeySet.KeySetImpl(),
                expandingKeys: new KeySet.KeySetImpl(),
                height: 0
            };
        }
        _handleFocusIn() {
            this._clearFocusoutTimeout();
        }
        _handleFocusOut() {
            this._clearFocusoutTimeout();
            if (this.actionableMode) {
                this._focusoutTimeout = setTimeout(function () {
                    this._doBlur();
                }.bind(this), 100);
            }
            else if (!this._isFocusBlurTriggeredByDescendent(event)) {
                this._doBlur();
            }
        }
        _clearFocusoutTimeout() {
            if (this._focusoutTimeout) {
                clearTimeout(this._focusoutTimeout);
                this._focusoutTimeout = null;
            }
        }
        _handleClick(event) {
            let target = event.target;
            let group = target.closest('.' + this.getGroupStyleClass());
            if (group) {
                let key = group.key;
                let expanded = this.props.expanded.has(key);
                this._handleToggleExpanded(key, expanded);
            }
            this._handleTouchOrClickEvent(event);
        }
        _handleToggleExpanded(key, expanded) {
            this.updateState(function (state, props) {
                let expandedToggleKeys = state.expandedToggleKeys;
                if (!expandedToggleKeys.has(key)) {
                    expandedToggleKeys = expandedToggleKeys.add([key]);
                    let newExpanded = props.expanded;
                    expandedToggleKeys.values().forEach((key) => {
                        if (expanded) {
                            newExpanded = newExpanded.delete([key]);
                        }
                        else {
                            newExpanded = newExpanded.add([key]);
                        }
                    });
                    this._updateProperty('expanded', newExpanded, true);
                    return { expandedToggleKeys: expandedToggleKeys };
                }
                return {};
            }.bind(this));
        }
        _handleKeyDown(event) {
            if (this.currentItem) {
                let next;
                switch (event.keyCode) {
                    case 37:
                    case 39: {
                        if (this.currentItem.classList.contains(this.getGroupStyleClass())) {
                            let group = this.currentItem;
                            let key = group.key;
                            let expanded = this.props.expanded.has(key);
                            if ((event.keyCode === 39 && !expanded) || (event.keyCode === 37 && expanded)) {
                                this._handleToggleExpanded(key, expanded);
                            }
                        }
                        break;
                    }
                    case 38: {
                        if (this.actionableMode === false) {
                            next = this.currentItem.previousElementSibling;
                            while (next &&
                                next.previousElementSibling &&
                                next.classList.contains('oj-stream-list-skeleton')) {
                                next = next.previousElementSibling;
                            }
                        }
                        break;
                    }
                    case 40: {
                        if (this.actionableMode === false) {
                            next = this.currentItem.nextElementSibling;
                            while (next &&
                                next.nextElementSibling &&
                                next.classList.contains('oj-stream-list-skeleton')) {
                                next = next.nextElementSibling;
                            }
                        }
                        break;
                    }
                    case 113: {
                        if (this.actionableMode === false) {
                            this._enterActionableMode();
                        }
                        break;
                    }
                    case 27: {
                        if (this.actionableMode === true) {
                            this._exitActionableMode(true);
                        }
                        break;
                    }
                    case 9: {
                        if (this.actionableMode === true && this.currentItem) {
                            if (event.shiftKey) {
                                if (DataCollectionUtils.handleActionablePrevTab(event, this.currentItem)) {
                                    event.preventDefault();
                                }
                            }
                            else {
                                if (DataCollectionUtils.handleActionableTab(event, this.currentItem)) {
                                    event.preventDefault();
                                }
                            }
                        }
                        break;
                    }
                    default: {
                        break;
                    }
                }
                if (next != null &&
                    (next.classList.contains(this.getItemStyleClass()) ||
                        next.classList.contains(this.getGroupStyleClass()))) {
                    this._updateCurrentItemAndFocus(next, true);
                    event.preventDefault();
                }
            }
        }
        _touchStartHandler(event) {
            this._handleTouchOrClickEvent(event);
        }
        render() {
            const initialSkeleton = this.state.initialSkeleton;
            const initialSkeletonCount = this.state.initialSkeletonCount;
            let content;
            if (this.contentHandler == null && initialSkeleton) {
                content = this._renderInitialSkeletons(initialSkeletonCount);
            }
            else {
                const data = this.getData();
                if ((data != null && initialSkeleton) || data == null) {
                    content = this._renderInitialSkeletons(initialSkeletonCount, data == null);
                }
                else if (data != null) {
                    content = this.contentHandler.render();
                    if (this.currentItem && this.currentItem.contains(document.activeElement)) {
                        this.restoreFocus = true;
                    }
                }
            }
            return (ojvcomponent.h("oj-stream-list", { ref: this.setRootElement },
                ojvcomponent.h("div", { role: 'list', "data-oj-context": true, onClick: this._handleClick, onKeydown: this._handleKeyDown, onTouchstart: this._touchStartHandler, onFocusin: this._handleFocusIn, onFocusout: this._handleFocusOut }, content)));
        }
        _doBlur() {
            if (this.actionableMode) {
                this._exitActionableMode(false);
            }
            if (this.currentItem) {
                this.currentItem.classList.remove('oj-focus');
            }
        }
        _isFocusBlurTriggeredByDescendent(event) {
            if (event.relatedTarget === undefined) {
                return true;
            }
            if (event.relatedTarget == null || !this.root.contains(event.relatedTarget)) {
                return false;
            }
            return true;
        }
        _renderInitialSkeletons(count, shouldScroll) {
            if (shouldScroll) {
                const scroller = this._getScroller();
                if (scroller != null) {
                    scroller.scrollTop = 0;
                }
            }
            return this.renderSkeletons(count);
        }
        renderSkeletons(count, indented, key) {
            let skeletons = [];
            let isTreeData = this._isTreeData();
            let skeletonKey;
            for (let i = 0; i < count; i++) {
                let shouldIndent = indented;
                if (!indented && isTreeData && i % 4) {
                    shouldIndent = true;
                }
                if (key) {
                    skeletonKey = key + '_' + i;
                }
                skeletons.push(this._renderSkeleton(shouldIndent, skeletonKey));
            }
            return skeletons;
        }
        _renderSkeleton(indented, key) {
            let className = 'oj-stream-list-skeleton';
            if (indented) {
                className += ' oj-stream-list-child-skeleton';
            }
            return (ojvcomponent.h("div", { class: className, key: key },
                ojvcomponent.h("div", { class: 'oj-stream-list-skeleton-content oj-animation-skeleton' })));
        }
        _applySkeletonExitAnimation(skeletons) {
            return new Promise((resolve, reject) => {
                let promises = [];
                skeletons.forEach((skeleton) => {
                    promises.push(AnimationUtils.fadeOut(skeleton));
                });
                Promise.all(promises).then(function () {
                    resolve(true);
                });
            });
        }
        _isTreeData() {
            var data = this.props.data;
            return data != null && this.instanceOfTreeDataProvider(data);
        }
        instanceOfTreeDataProvider(object) {
            return 'getChildDataProvider' in object;
        }
        _postRender() {
            this._registerScrollHandler();
            const data = this.getData();
            let initialSkeleton = this.state.initialSkeleton;
            if (data != null && initialSkeleton) {
                let skeletons = this.getRootElement().querySelectorAll('.oj-stream-list-skeleton');
                this._applySkeletonExitAnimation(skeletons).then(function () {
                    this.updateState({ initialSkeleton: false });
                }.bind(this));
            }
            else if (data != null) {
                this.contentHandler.postRender();
            }
            this.actionableMode = false;
            let items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');
            this._disableAllTabbableElements(items);
            this._restoreCurrentItem(items);
        }
        mounted() {
            var data = this.props.data;
            var scroller = this.props.scrollPolicyOptions.scroller
                ? this.props.scrollPolicyOptions.scroller
                : this.root;
            if (this._isTreeData()) {
                this.contentHandler = new StreamListTreeContentHandler(scroller, data, this, this.props.scrollPolicyOptions);
            }
            else if (data != null) {
                this.contentHandler = new StreamListContentHandler(scroller, data, this, this.props.scrollPolicyOptions);
            }
            this.contentHandler.fetchRows();
            const rootHeight = this.root.clientHeight;
            this.updateState({ height: rootHeight });
            let skeleton = this.root.querySelector('.oj-stream-list-skeleton');
            if (skeleton) {
                this.skeletonHeight = this.outerHeight(skeleton);
                this.updateState({
                    initialSkeletonCount: Math.max(1, Math.floor(rootHeight / this.skeletonHeight))
                });
            }
            if (window['ResizeObserver']) {
                let root = this.root;
                const resizeObserver = new window['ResizeObserver']((entries) => {
                    entries.forEach((entry) => {
                        if (entry.target === root && entry.contentRect) {
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
            }
            this._postRender();
        }
        getSkeletonHeight() {
            return this.skeletonHeight;
        }
        outerHeight(el) {
            let height = el.offsetHeight;
            let style = getComputedStyle(el);
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            return height;
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
        getRootElement() {
            return this.root;
        }
        updated(oldProps, oldState) {
            let oldExpandingKeys = oldState.expandingKeys;
            let expandingKeys = this.state.expandingKeys;
            expandingKeys.values().forEach(function (key) {
                if (!oldExpandingKeys.has(key)) {
                    this.contentHandler.expand(key);
                }
            }.bind(this));
            if (this.props.data != oldProps.data) {
                if (this.contentHandler) {
                    this.contentHandler.destroy();
                }
                this.setCurrentItem(null);
                this.updateState({
                    renderedData: null,
                    outOfRangeData: null,
                    initialSkeleton: true,
                    initialSkeletonCount: this.state.initialSkeletonCount,
                    expandedToggleKeys: new KeySet.KeySetImpl(),
                    expandedSkeletonKeys: new KeySet.KeySetImpl(),
                    expandingKeys: new KeySet.KeySetImpl()
                });
                var scroller = this.props.scrollPolicyOptions.scroller
                    ? this.props.scrollPolicyOptions.scroller
                    : this.root;
                if (this._isTreeData()) {
                    this.contentHandler = new StreamListTreeContentHandler(scroller, this.props.data, this, this.props.scrollPolicyOptions);
                }
                else if (this.props.data != null) {
                    this.contentHandler = new StreamListContentHandler(scroller, this.props.data, this, this.props.scrollPolicyOptions);
                }
                this.contentHandler.fetchRows();
            }
            this._postRender();
            if (this.props.scrollPosition != oldProps.scrollPosition) {
                this._syncScrollTopWithProps();
            }
        }
        static initStateFromProps(props, state) {
            return StreamList_1.updateStateFromProps(props, state, null);
        }
        static updateStateFromProps(props, state, oldProps) {
            let { expandedToggleKeys, expandingKeys, renderedData, expandedSkeletonKeys } = state;
            let newExpanded = props.expanded;
            if (oldProps && newExpanded !== oldProps.expanded) {
                let oldExpanded = oldProps.expanded;
                expandedToggleKeys.values().forEach((key) => {
                    if (oldExpanded.has(key) !== newExpanded.has(key)) {
                        expandedToggleKeys = expandedToggleKeys.delete([key]);
                    }
                });
                let toCollapse = [];
                renderedData.value.metadata.forEach((itemMetadata) => {
                    let key = itemMetadata.key;
                    let itemExpanded = itemMetadata.expanded;
                    let isExpanded = newExpanded.has(key);
                    if (itemExpanded && !isExpanded) {
                        toCollapse.push(key);
                        itemMetadata.expanded = false;
                    }
                    else if (!itemExpanded && isExpanded) {
                        expandingKeys = expandingKeys.add([key]);
                        itemMetadata.expanded = true;
                    }
                });
                toCollapse.forEach((key) => {
                    renderedData = StreamList_1.collapse(key, renderedData);
                    expandingKeys = expandingKeys.delete([key]);
                    expandedSkeletonKeys = expandedSkeletonKeys.delete([key]);
                });
                return {
                    renderedData,
                    expandingKeys,
                    expandedToggleKeys,
                    expandedSkeletonKeys
                };
            }
        }
        static _findIndex(metadata, key) {
            for (let i = 0; i < metadata.length; i++) {
                if (oj.KeyUtils.equals(key, metadata[i].key)) {
                    return i;
                }
            }
            return -1;
        }
        _unregisterScrollHandler() {
            let scrollElement = this._getScrollEventElement();
            scrollElement.removeEventListener('scroll', this.scrollListener);
        }
        _registerScrollHandler() {
            let scrollElement = this._getScrollEventElement();
            this._unregisterScrollHandler();
            scrollElement.addEventListener('scroll', this.scrollListener);
        }
        scrollListener() {
            var self = this;
            if (!this._ticking) {
                window.requestAnimationFrame(function () {
                    self._updateScrollPosition();
                    self._ticking = false;
                });
                this._ticking = true;
            }
        }
        _updateScrollPosition() {
            let scrollPosition = {};
            let scrollTop = this._getScroller().scrollTop;
            let result = this._findClosestElementToTop(scrollTop);
            scrollPosition.y = scrollTop;
            if (result != null) {
                let elem = result.elem;
                scrollPosition.offsetY = result.offsetY;
                scrollPosition.key = elem.getAttribute('key');
                if (this._isTreeData() && elem.classList.contains('oj-stream-list-item')) {
                    scrollPosition.parentKey = this._getParentKey(elem);
                }
                else {
                    scrollPosition.parentKey = null;
                }
            }
            this._updateProperty('scrollPosition', scrollPosition);
        }
        _syncScrollTopWithProps() {
            let scrollPosition = this.props.scrollPosition;
            let scrollTop;
            const key = scrollPosition.key;
            if (key) {
                const parent = scrollPosition.parentKey;
                const item = this._getItemByKey(key, parent);
                if (item != null) {
                    let root = this.root;
                    scrollTop = item.offsetTop - root.offsetTop;
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
        _getParentKey(item) {
            while (item) {
                if (item.classList.contains('oj-stream-list-group')) {
                    return item.key;
                }
                item = item.previousElementSibling;
            }
            return null;
        }
        _getItemByKey(key, parentKey) {
            var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                if (item === key) {
                    if (parentKey == null || this._getParentKey(item) === parentKey) {
                        return item;
                    }
                }
            }
        }
        _getScrollEventElement() {
            var scroller = this.props.scrollPolicyOptions.scroller;
            if (scroller != null) {
                if (scroller === document.body || scroller === document.documentElement) {
                    return window;
                }
                return scroller;
            }
            return this.getRootElement();
        }
        _getScroller() {
            var scroller = this.props.scrollPolicyOptions.scroller;
            if (scroller != null) {
                return scroller;
            }
            return this.getRootElement();
        }
        _findClosestElementToTop(currScrollTop) {
            var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');
            if (items == null || items.length === 0) {
                return null;
            }
            let root = this.root;
            let rootTop = root.offsetTop;
            let scrollTop = Math.max(currScrollTop, 0);
            let offsetTop = 0 - rootTop;
            let diff = scrollTop;
            let index = 0;
            let elem = items[index];
            let found = false;
            let elementDetail = { elem: elem, offsetY: diff };
            while (!found && index >= 0 && index < items.length) {
                elem = items[index];
                offsetTop = elem.offsetTop - rootTop;
                diff = Math.abs(scrollTop - offsetTop);
                found = diff < 1 || scrollTop <= offsetTop;
                if (found) {
                    break;
                }
                elementDetail = { elem: elem, offsetY: diff };
                index += 1;
            }
            return elementDetail;
        }
        _getExpandSkeletonsForKey(key) {
            let skeletonsForKey = [];
            let allSkeletons = this.getRootElement().querySelectorAll('.oj-stream-list-child-skeleton');
            allSkeletons.forEach(function (skeleton) {
                if (skeleton.getAttribute('key') == key) {
                    skeletonsForKey.push(skeleton);
                }
            });
            return skeletonsForKey;
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
        }
        updateData(updater) {
            this.updateState(function (state) {
                let returnVal = updater(state.renderedData, state.expandingKeys);
                return returnVal;
            }.bind(this));
        }
        getExpanded() {
            return this.props.expanded;
        }
        setExpanded(set) {
            this._updateProperty('expanded', set);
        }
        updateExpand(updater) {
            this.updateState(function (state, props) {
                return updater(state.renderedData, state.expandedSkeletonKeys, state.expandingKeys, props.expanded);
            }.bind(this));
        }
        getExpandingKeys() {
            return this.state.expandingKeys;
        }
        setExpandingKeys(set) {
            this.updateState({ expandingKeys: set });
        }
        updateExpandingKeys(key) {
            this.updateState(function (state) {
                return { expandingKeys: state.expandingKeys.add([key]) };
            });
        }
        getSkeletonKeys() {
            return this.state.expandedSkeletonKeys;
        }
        setSkeletonKeys(set) {
            this.updateState({ expandedSkeletonKeys: set });
        }
        updateSkeletonKeys(key) {
            this.updateState(function (state) {
                return { expandedSkeletonKeys: state.expandedSkeletonKeys.add([key]) };
            });
        }
        getOutOfRangeData() {
            return this.state.outOfRangeData;
        }
        setOutOfRangeData(data) {
            this.updateState({ outOfRangeData: data });
        }
        getItemRenderer() {
            return this.props.itemTemplate;
        }
        getItemStyleClass() {
            return 'oj-stream-list-item';
        }
        getGroupRenderer() {
            return this.props.groupTemplate;
        }
        getGroupStyleClass() {
            return 'oj-stream-list-group';
        }
        _handleTouchOrClickEvent(event) {
            let target = event.target;
            let item = target.closest('.oj-stream-list-item, .oj-stream-list-group');
            if (item) {
                if (this._isInputElement(target) || this._isInsideInputElement(target, item)) {
                    this._updateCurrentItemAndFocus(item, false);
                    this._enterActionableMode(target);
                }
                else {
                    this._updateCurrentItemAndFocus(item, true);
                }
            }
        }
        _isInputElement(target) {
            var inputRegExp = /^INPUT|SELECT|OPTION|TEXTAREA/;
            return target.nodeName.match(inputRegExp) != null && !target.readOnly;
        }
        _isInsideInputElement(target, item) {
            let found = false;
            while (target !== item && target != null) {
                if (target.classList.contains('oj-form-control')) {
                    if (!target.readonly && !target.disabled) {
                        found = true;
                    }
                    break;
                }
                target = target.parentNode;
            }
            return found;
        }
        _resetFocus(item) {
            if (this.actionableMode) {
                this._exitActionableMode(false);
            }
            item.classList.remove('oj-focus');
            item.tabIndex = -1;
        }
        _setFocus(item, shouldFocus) {
            item.tabIndex = 0;
            if (shouldFocus) {
                item.classList.add('oj-focus');
                item.focus();
            }
        }
        _updateCurrentItemAndFocus(item, shouldFocus) {
            let lastCurrentItem = this.currentItem;
            let newCurrentItem = item;
            this._resetFocus(lastCurrentItem);
            this._setFocus(newCurrentItem, shouldFocus);
            this.currentItem = newCurrentItem;
            this.setCurrentItem(newCurrentItem.key);
        }
        _isInViewport(item) {
            let itemElem = item;
            let top = itemElem.offsetTop;
            let scrollTop = this._getScroller().scrollTop;
            return top >= scrollTop && top <= scrollTop + this.state.height;
        }
        _restoreCurrentItem(items) {
            if (this.currentKey != null) {
                for (let i = 0; i < items.length; i++) {
                    if (oj.KeyUtils.equals(items[i].key, this.currentKey)) {
                        const elem = items[i];
                        if (this.restoreFocus && this._isInViewport(elem)) {
                            this._updateCurrentItemAndFocus(elem, true);
                            return;
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
                var busyContext = Context.getContext(item).getBusyContext();
                busyContext.whenReady().then(function () {
                    DataCollectionUtils.disableAllFocusableElements(item, true);
                });
            });
        }
        _enterActionableMode(target) {
            this.actionableMode = true;
            if (this.currentItem) {
                const elems = DataCollectionUtils.enableAllFocusableElements(this.currentItem, true);
                if (target == null && elems && elems.length > 0) {
                    elems[0].focus();
                }
            }
        }
        _exitActionableMode(shouldFocus) {
            this.actionableMode = false;
            if (this.currentItem) {
                DataCollectionUtils.disableAllFocusableElements(this.currentItem, true);
                this._setFocus(this.currentItem, shouldFocus);
            }
        }
    };
    exports.StreamList.collapse = (key, currentData) => {
        let data = currentData.value.data;
        let metadata = currentData.value.metadata;
        let index = StreamList_1._findIndex(metadata, key);
        if (index > -1) {
            let count = StreamList_1._getLocalDescendentCount(metadata, index);
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
    exports.StreamList._getLocalDescendentCount = (metadata, index) => {
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
    exports.StreamList.metadata = { "extension": { "_DEFAULTS": Props }, "properties": { "data": { "type": "object|null", "value": null }, "expanded": { "type": "object", "writeback": true, "readOnly": false }, "scrollPolicy": { "type": "string", "enumValues": ["loadAll", "loadMoreOnScroll"], "value": "loadMoreOnScroll" }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number", "value": 25 }, "maxCount": { "type": "number", "value": 500 }, "scroller": { "type": "Element|null", "value": null } } }, "scrollPosition": { "type": "object", "properties": { "y": { "type": "number", "value": 0 }, "key": { "type": "any" }, "offsetY": { "type": "number" }, "parentKey": { "type": "any" } }, "writeback": true, "readOnly": false } }, "slots": { "groupTemplate": {}, "itemTemplate": {} } };
    __decorate([
        ojvcomponent.listener()
    ], exports.StreamList.prototype, "_handleFocusIn", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.StreamList.prototype, "_handleFocusOut", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.StreamList.prototype, "_handleClick", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.StreamList.prototype, "_handleKeyDown", null);
    __decorate([
        ojvcomponent.listener({ passive: true })
    ], exports.StreamList.prototype, "_touchStartHandler", null);
    __decorate([
        ojvcomponent.listener()
    ], exports.StreamList.prototype, "scrollListener", null);
    exports.StreamList = StreamList_1 = __decorate([
        ojvcomponent.customElement('oj-stream-list')
    ], exports.StreamList);

    Object.defineProperty(exports, '__esModule', { value: true });

});
