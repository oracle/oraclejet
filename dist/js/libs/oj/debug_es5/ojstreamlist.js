(function() {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

define(['exports', 'ojs/ojvcomponent', 'ojs/ojdatacollection-common', 'ojs/ojcontext', 'ojs/ojvcollection', 'ojs/ojcore-base', 'ojs/ojkeyset', 'ojs/ojtreedataprovider', 'ojs/ojanimation'], function (exports, ojvcomponent, DataCollectionUtils, Context, ojvcollection, oj, KeySet, ojtreedataprovider, AnimationUtils) {
  'use strict';
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

  var StreamListContentHandler = /*#__PURE__*/function (_ojvcollection$Iterat) {
    _inherits(StreamListContentHandler, _ojvcollection$Iterat);

    var _super = _createSuper(StreamListContentHandler);

    function StreamListContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this;

      _classCallCheck(this, StreamListContentHandler);

      _this = _super.call(this, root, dataProvider, callback, scrollPolicyOptions);
      _this.root = root;
      _this.dataProvider = dataProvider;
      _this.callback = callback;
      _this.scrollPolicyOptions = scrollPolicyOptions;

      _this.postRender = function () {
        _this.vnodesCache = _this.newVnodesCache;
        _this.newVnodesCache = new Map();
        var itemsRoot = _this.root.lastElementChild;

        if (itemsRoot) {
          var busyContext = Context.getContext(itemsRoot).getBusyContext();
          busyContext.whenReady().then(function () {
            if (_this.callback) {
              if (_this.domScroller) {
                var items = itemsRoot.querySelectorAll('.oj-stream-list-item');
                var rootOffsetTop = _this.root.offsetTop;
                var start = items[0].offsetTop - rootOffsetTop;
                var end = items[items.length - 1].offsetTop + items[items.length - 1].offsetHeight - rootOffsetTop;

                _this.domScroller.setViewportRange(start, end);
              }

              if (_this.domScroller && !_this.domScroller.checkViewport()) {
                return;
              }
            }
          });
        }
      };

      _this.newItemsTracker = new Set();
      _this.vnodesCache = new Map();
      _this.newVnodesCache = new Map();
      return _this;
    }

    _createClass(StreamListContentHandler, [{
      key: "handleFetchSuccess",
      value: function handleFetchSuccess(result) {
        if (result != null) {
          this.newItemsTracker.clear();
        }

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleFetchSuccess", this).call(this, result);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        this.vnodesCache.clear();

        _get(_getPrototypeOf(StreamListContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "addItem",
      value: function addItem(key, index, data, visible) {
        var initialFetch = this.isInitialFetch();
        var currentItem = this.callback.getCurrentItem();

        if (currentItem == null && initialFetch && index == 0) {
          this.callback.setCurrentItem(key);
        }

        var vnodes = this.renderItem(key, index, data);
        this.decorateItem(vnodes, key, index, initialFetch, visible);
        return vnodes;
      }
    }, {
      key: "renderItem",
      value: function renderItem(key, index, data) {
        var node = this.vnodesCache.get(key);

        if (node) {
          this.newVnodesCache.set(key, {
            vnodes: node.vnodes
          });
          return node.vnodes;
        }

        var renderer = this.callback.getItemRenderer();
        var vnodes = renderer({
          data: data,
          key: key
        });
        var vnode;

        for (var i = 0; i < vnodes.length; i++) {
          var _node = vnodes[i]._node;

          if (_node.nodeType === 1) {
            vnode = vnodes[i];
            break;
          }
        }

        var prunedVnodes = [vnode];
        this.newVnodesCache.set(key, {
          vnodes: prunedVnodes
        });
        return prunedVnodes;
      }
    }, {
      key: "decorateItem",
      value: function decorateItem(vnodes, key, index, initialFetch, visible) {
        var vnode = vnodes[0];
        var contentRoot = vnode._node;

        if (contentRoot != null) {
          vnode.key = key;
          contentRoot.key = key;
          contentRoot.setAttribute('key', JSON.stringify(key));
          contentRoot.setAttribute('role', 'listitem');
          contentRoot.setAttribute('tabIndex', '-1');
          var styleClasses = this.getItemStyleClass(visible, this.newItemsTracker.has(key), initialFetch);
          styleClasses.forEach(function (styleClass) {
            contentRoot.classList.add(styleClass);
          });
          var inlineStyle = this.getItemInlineStyle(visible, index, initialFetch);
          Object.keys(inlineStyle).forEach(function (prop) {
            contentRoot.style[prop] = inlineStyle[prop];
          });
        }
      }
    }, {
      key: "getItemInlineStyle",
      value: function getItemInlineStyle(visible, index, animate) {
        var style = {};
        return style;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass(visible, isNew, animate) {
        var styleClass = [];
        styleClass.push('oj-stream-list-item');

        if (animate) {}

        return styleClass;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {
        return this.callback.renderSkeletons(3);
      }
    }]);

    return StreamListContentHandler;
  }(ojvcollection.IteratingDataProviderContentHandler);

  var StreamListTreeContentHandler = /*#__PURE__*/function (_ojvcollection$Iterat2) {
    _inherits(StreamListTreeContentHandler, _ojvcollection$Iterat2);

    var _super2 = _createSuper(StreamListTreeContentHandler);

    function StreamListTreeContentHandler(root, dataProvider, callback, scrollPolicyOptions) {
      var _this2;

      _classCallCheck(this, StreamListTreeContentHandler);

      _this2 = _super2.call(this, root, dataProvider, callback, scrollPolicyOptions);
      _this2.root = root;
      _this2.dataProvider = dataProvider;
      _this2.callback = callback;
      _this2.scrollPolicyOptions = scrollPolicyOptions;

      _this2.postRender = function () {
        _this2.vnodesCache = _this2.newVnodesCache;
        _this2.newVnodesCache = new Map();
        var itemsRoot = _this2.root.lastElementChild;

        if (itemsRoot) {
          var busyContext = Context.getContext(itemsRoot).getBusyContext();
          busyContext.whenReady().then(function () {
            _this2.checkViewport();
          });
        }
      };

      _this2.getLoadMoreCount = function () {
        return 3;
      };

      _this2.newItemsTracker = new Set();
      _this2.vnodesCache = new Map();
      _this2.newVnodesCache = new Map();
      return _this2;
    }

    _createClass(StreamListTreeContentHandler, [{
      key: "handleFetchSuccess",
      value: function handleFetchSuccess(result) {
        if (result != null) {
          this.newItemsTracker.clear();
        }

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleFetchSuccess", this).call(this, result);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        detail.keys.forEach(function (key) {
          this.vnodesCache.delete(key);
        }.bind(this));

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleModelRefresh",
      value: function handleModelRefresh() {
        this.vnodesCache.clear();

        _get(_getPrototypeOf(StreamListTreeContentHandler.prototype), "handleModelRefresh", this).call(this);
      }
    }, {
      key: "addItem",
      value: function addItem(metadata, index, data, visible) {
        var initialFetch = this.isInitialFetch();
        var currentItem = this.callback.getCurrentItem();

        if (currentItem == null && initialFetch && index == 0) {
          this.callback.setCurrentItem(metadata.key);
        }

        var vnodes = this.renderItem(metadata, index, data);
        this.decorateItem(vnodes, metadata, index, initialFetch, visible);
        return vnodes;
      }
    }, {
      key: "renderItem",
      value: function renderItem(metadata, index, data) {
        var key = metadata.key;
        var node = this.vnodesCache.get(key);

        if (node) {
          this.newVnodesCache.set(key, {
            vnodes: node.vnodes
          });
          return node.vnodes;
        }

        var renderer;
        var vnodes;

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
        var vnode;

        for (var i = 0; i < vnodes.length; i++) {
          var _node2 = vnodes[i]._node;

          if (_node2.nodeType === 1) {
            vnode = vnodes[i];
            break;
          }
        }

        var prunedVnodes = [vnode];
        this.newVnodesCache.set(key, {
          vnodes: prunedVnodes
        });
        return prunedVnodes;
      }
    }, {
      key: "decorateItem",
      value: function decorateItem(vnodes, metadata, index, initialFetch, visible) {
        var vnode = vnodes[0];
        var contentRoot = vnode._node;

        if (contentRoot != null) {
          vnode.key = metadata.key;
          contentRoot.key = metadata.key;
          contentRoot.setAttribute('key', JSON.stringify(metadata.key));
          contentRoot.setAttribute('role', 'listitem');
          contentRoot.setAttribute('tabIndex', '-1');
          var styleClasses = this.getItemStyleClass(metadata, visible, this.newItemsTracker.has(metadata.key), initialFetch);
          styleClasses.forEach(function (styleClass) {
            contentRoot.classList.add(styleClass);
          });
          var inlineStyle = this.getItemInlineStyle(metadata, visible, index, initialFetch);
          Object.keys(inlineStyle).forEach(function (prop) {
            contentRoot.style[prop] = inlineStyle[prop];
          });

          if (!metadata.isLeaf) {
            var expandedProp = this.callback.getExpanded();
            var expanded = expandedProp && expandedProp.has(metadata.key);

            if (expanded) {
              contentRoot.setAttribute('aria-expanded', 'true');
            } else {
              contentRoot.setAttribute('aria-expanded', 'false');
            }
          }
        }
      }
    }, {
      key: "getItemInlineStyle",
      value: function getItemInlineStyle(metadata, visible, index, animate) {
        var style = {};
        return style;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass(metadata, visible, isNew, animate) {
        var styleClass = [];

        if (!metadata.isLeaf) {
          styleClass.push('oj-stream-list-group');
        } else {
          styleClass.push('oj-stream-list-item');
        }

        if (animate) {}

        return styleClass;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {
        return this.callback.renderSkeletons(3);
      }
    }, {
      key: "renderSkeletonsForExpand",
      value: function renderSkeletonsForExpand(key) {
        return this.callback.renderSkeletons(this.getLoadMoreCount(), true, key);
      }
    }]);

    return StreamListTreeContentHandler;
  }(ojvcollection.IteratingTreeDataProviderContentHandler);

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var StreamList_1;

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.data = null;
    this.expanded = new KeySet.KeySetImpl();
    this.scrollPolicy = 'loadMoreOnScroll';
    this.scrollPolicyOptions = {
      fetchSize: 25,
      maxCount: 500,
      scroller: null
    };
    this.scrollPosition = {
      y: 0
    };
  };

  exports.StreamList = StreamList_1 = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(StreamList, _ojvcomponent$VCompon);

    var _super3 = _createSuper(StreamList);

    function StreamList(props) {
      var _this3;

      _classCallCheck(this, StreamList);

      _this3 = _super3.call(this, props);
      _this3.restoreFocus = false;
      _this3.actionableMode = false;
      _this3.skeletonHeight = 0;

      _this3.setRootElement = function (element) {
        _this3.root = element;
      };

      _this3.state = {
        renderedData: null,
        outOfRangeData: null,
        initialSkeleton: true,
        initialSkeletonCount: 1,
        expandedToggleKeys: new KeySet.KeySetImpl(),
        expandedSkeletonKeys: new KeySet.KeySetImpl(),
        expandingKeys: new KeySet.KeySetImpl(),
        height: 0
      };
      return _this3;
    }

    _createClass(StreamList, [{
      key: "_handleFocusIn",
      value: function _handleFocusIn() {
        this._clearFocusoutTimeout();
      }
    }, {
      key: "_handleFocusOut",
      value: function _handleFocusOut() {
        this._clearFocusoutTimeout();

        if (this.actionableMode) {
          this._focusoutTimeout = setTimeout(function () {
            this._doBlur();
          }.bind(this), 100);
        } else if (!this._isFocusBlurTriggeredByDescendent(event)) {
          this._doBlur();
        }
      }
    }, {
      key: "_clearFocusoutTimeout",
      value: function _clearFocusoutTimeout() {
        if (this._focusoutTimeout) {
          clearTimeout(this._focusoutTimeout);
          this._focusoutTimeout = null;
        }
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(event) {
        var target = event.target;
        var group = target.closest('.' + this.getGroupStyleClass());

        if (group) {
          var key = group.key;
          var expanded = this.props.expanded.has(key);

          this._handleToggleExpanded(key, expanded);
        }

        this._handleTouchOrClickEvent(event);
      }
    }, {
      key: "_handleToggleExpanded",
      value: function _handleToggleExpanded(key, expanded) {
        this.updateState(function (state, props) {
          var expandedToggleKeys = state.expandedToggleKeys;

          if (!expandedToggleKeys.has(key)) {
            expandedToggleKeys = expandedToggleKeys.add([key]);
            var newExpanded = props.expanded;
            expandedToggleKeys.values().forEach(function (key) {
              if (expanded) {
                newExpanded = newExpanded.delete([key]);
              } else {
                newExpanded = newExpanded.add([key]);
              }
            });

            this._updateProperty('expanded', newExpanded, true);

            return {
              expandedToggleKeys: expandedToggleKeys
            };
          }

          return {};
        }.bind(this));
      }
    }, {
      key: "_handleKeyDown",
      value: function _handleKeyDown(event) {
        if (this.currentItem) {
          var next;

          switch (event.keyCode) {
            case 37:
            case 39:
              {
                if (this.currentItem.classList.contains(this.getGroupStyleClass())) {
                  var group = this.currentItem;
                  var key = group.key;
                  var expanded = this.props.expanded.has(key);

                  if (event.keyCode === 39 && !expanded || event.keyCode === 37 && expanded) {
                    this._handleToggleExpanded(key, expanded);
                  }
                }

                break;
              }

            case 38:
              {
                if (this.actionableMode === false) {
                  next = this.currentItem.previousElementSibling;

                  while (next && next.previousElementSibling && next.classList.contains('oj-stream-list-skeleton')) {
                    next = next.previousElementSibling;
                  }
                }

                break;
              }

            case 40:
              {
                if (this.actionableMode === false) {
                  next = this.currentItem.nextElementSibling;

                  while (next && next.nextElementSibling && next.classList.contains('oj-stream-list-skeleton')) {
                    next = next.nextElementSibling;
                  }
                }

                break;
              }

            case 113:
              {
                if (this.actionableMode === false) {
                  this._enterActionableMode();
                }

                break;
              }

            case 27:
              {
                if (this.actionableMode === true) {
                  this._exitActionableMode(true);
                }

                break;
              }

            case 9:
              {
                if (this.actionableMode === true && this.currentItem) {
                  if (event.shiftKey) {
                    if (DataCollectionUtils.handleActionablePrevTab(event, this.currentItem)) {
                      event.preventDefault();
                    }
                  } else {
                    if (DataCollectionUtils.handleActionableTab(event, this.currentItem)) {
                      event.preventDefault();
                    }
                  }
                }

                break;
              }

            default:
              {
                break;
              }
          }

          if (next != null && (next.classList.contains(this.getItemStyleClass()) || next.classList.contains(this.getGroupStyleClass()))) {
            this._updateCurrentItemAndFocus(next, true);

            event.preventDefault();
          }
        }
      }
    }, {
      key: "_touchStartHandler",
      value: function _touchStartHandler(event) {
        this._handleTouchOrClickEvent(event);
      }
    }, {
      key: "render",
      value: function render() {
        var initialSkeleton = this.state.initialSkeleton;
        var initialSkeletonCount = this.state.initialSkeletonCount;
        var content;

        if (this.contentHandler == null && initialSkeleton) {
          content = this._renderInitialSkeletons(initialSkeletonCount);
        } else {
          var data = this.getData();

          if (data != null && initialSkeleton || data == null) {
            content = this._renderInitialSkeletons(initialSkeletonCount, data == null);
          } else if (data != null) {
            content = this.contentHandler.render();

            if (this.currentItem && this.currentItem.contains(document.activeElement)) {
              this.restoreFocus = true;
            }
          }
        }

        return ojvcomponent.h("oj-stream-list", {
          ref: this.setRootElement
        }, ojvcomponent.h("div", {
          role: 'list',
          "data-oj-context": true,
          onClick: this._handleClick,
          onKeydown: this._handleKeyDown,
          onTouchstart: this._touchStartHandler,
          onFocusin: this._handleFocusIn,
          onFocusout: this._handleFocusOut
        }, content));
      }
    }, {
      key: "_doBlur",
      value: function _doBlur() {
        if (this.actionableMode) {
          this._exitActionableMode(false);
        }

        if (this.currentItem) {
          this.currentItem.classList.remove('oj-focus');
        }
      }
    }, {
      key: "_isFocusBlurTriggeredByDescendent",
      value: function _isFocusBlurTriggeredByDescendent(event) {
        if (event.relatedTarget === undefined) {
          return true;
        }

        if (event.relatedTarget == null || !this.root.contains(event.relatedTarget)) {
          return false;
        }

        return true;
      }
    }, {
      key: "_renderInitialSkeletons",
      value: function _renderInitialSkeletons(count, shouldScroll) {
        if (shouldScroll) {
          var scroller = this._getScroller();

          if (scroller != null) {
            scroller.scrollTop = 0;
          }
        }

        return this.renderSkeletons(count);
      }
    }, {
      key: "renderSkeletons",
      value: function renderSkeletons(count, indented, key) {
        var skeletons = [];

        var isTreeData = this._isTreeData();

        var skeletonKey;

        for (var i = 0; i < count; i++) {
          var shouldIndent = indented;

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
    }, {
      key: "_renderSkeleton",
      value: function _renderSkeleton(indented, key) {
        var className = 'oj-stream-list-skeleton';

        if (indented) {
          className += ' oj-stream-list-child-skeleton';
        }

        return ojvcomponent.h("div", {
          class: className,
          key: key
        }, ojvcomponent.h("div", {
          class: 'oj-stream-list-skeleton-content oj-animation-skeleton'
        }));
      }
    }, {
      key: "_applySkeletonExitAnimation",
      value: function _applySkeletonExitAnimation(skeletons) {
        return new Promise(function (resolve, reject) {
          var promises = [];
          skeletons.forEach(function (skeleton) {
            promises.push(AnimationUtils.fadeOut(skeleton));
          });
          Promise.all(promises).then(function () {
            resolve(true);
          });
        });
      }
    }, {
      key: "_isTreeData",
      value: function _isTreeData() {
        var data = this.props.data;
        return data != null && this.instanceOfTreeDataProvider(data);
      }
    }, {
      key: "instanceOfTreeDataProvider",
      value: function instanceOfTreeDataProvider(object) {
        return 'getChildDataProvider' in object;
      }
    }, {
      key: "_postRender",
      value: function _postRender() {
        this._registerScrollHandler();

        var data = this.getData();
        var initialSkeleton = this.state.initialSkeleton;

        if (data != null && initialSkeleton) {
          var skeletons = this.getRootElement().querySelectorAll('.oj-stream-list-skeleton');

          this._applySkeletonExitAnimation(skeletons).then(function () {
            this.updateState({
              initialSkeleton: false
            });
          }.bind(this));
        } else if (data != null) {
          this.contentHandler.postRender();
        }

        this.actionableMode = false;
        var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');

        this._disableAllTabbableElements(items);

        this._restoreCurrentItem(items);
      }
    }, {
      key: "mounted",
      value: function mounted() {
        var _this4 = this;

        var data = this.props.data;
        var scroller = this.props.scrollPolicyOptions.scroller ? this.props.scrollPolicyOptions.scroller : this.root;

        if (this._isTreeData()) {
          this.contentHandler = new StreamListTreeContentHandler(scroller, data, this, this.props.scrollPolicyOptions);
        } else if (data != null) {
          this.contentHandler = new StreamListContentHandler(scroller, data, this, this.props.scrollPolicyOptions);
        }

        this.contentHandler.fetchRows();
        var rootHeight = this.root.clientHeight;
        this.updateState({
          height: rootHeight
        });
        var skeleton = this.root.querySelector('.oj-stream-list-skeleton');

        if (skeleton) {
          this.skeletonHeight = this.outerHeight(skeleton);
          this.updateState({
            initialSkeletonCount: Math.max(1, Math.floor(rootHeight / this.skeletonHeight))
          });
        }

        if (window['ResizeObserver']) {
          var root = this.root;
          var resizeObserver = new window['ResizeObserver'](function (entries) {
            entries.forEach(function (entry) {
              if (entry.target === root && entry.contentRect) {
                var currHeight = _this4.state.height;
                var newHeight = Math.round(entry.contentRect.height);

                if (Math.abs(newHeight - currHeight) > 1) {
                  _this4.updateState({
                    height: newHeight
                  });
                }
              }
            });
          });
          resizeObserver.observe(root);
          this.resizeObserver = resizeObserver;
        }

        this._postRender();
      }
    }, {
      key: "getSkeletonHeight",
      value: function getSkeletonHeight() {
        return this.skeletonHeight;
      }
    }, {
      key: "outerHeight",
      value: function outerHeight(el) {
        var height = el.offsetHeight;
        var style = getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);
        return height;
      }
    }, {
      key: "unmounted",
      value: function unmounted() {
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
    }, {
      key: "getRootElement",
      value: function getRootElement() {
        return this.root;
      }
    }, {
      key: "updated",
      value: function updated(oldProps, oldState) {
        var oldExpandingKeys = oldState.expandingKeys;
        var expandingKeys = this.state.expandingKeys;
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
          var scroller = this.props.scrollPolicyOptions.scroller ? this.props.scrollPolicyOptions.scroller : this.root;

          if (this._isTreeData()) {
            this.contentHandler = new StreamListTreeContentHandler(scroller, this.props.data, this, this.props.scrollPolicyOptions);
          } else if (this.props.data != null) {
            this.contentHandler = new StreamListContentHandler(scroller, this.props.data, this, this.props.scrollPolicyOptions);
          }

          this.contentHandler.fetchRows();
        }

        this._postRender();

        if (this.props.scrollPosition != oldProps.scrollPosition) {
          this._syncScrollTopWithProps();
        }
      }
    }, {
      key: "_unregisterScrollHandler",
      value: function _unregisterScrollHandler() {
        var scrollElement = this._getScrollEventElement();

        scrollElement.removeEventListener('scroll', this.scrollListener);
      }
    }, {
      key: "_registerScrollHandler",
      value: function _registerScrollHandler() {
        var scrollElement = this._getScrollEventElement();

        this._unregisterScrollHandler();

        scrollElement.addEventListener('scroll', this.scrollListener);
      }
    }, {
      key: "scrollListener",
      value: function scrollListener() {
        var self = this;

        if (!this._ticking) {
          window.requestAnimationFrame(function () {
            self._updateScrollPosition();

            self._ticking = false;
          });
          this._ticking = true;
        }
      }
    }, {
      key: "_updateScrollPosition",
      value: function _updateScrollPosition() {
        var scrollPosition = {};

        var scrollTop = this._getScroller().scrollTop;

        var result = this._findClosestElementToTop(scrollTop);

        scrollPosition.y = scrollTop;

        if (result != null) {
          var elem = result.elem;
          scrollPosition.offsetY = result.offsetY;
          scrollPosition.key = elem.getAttribute('key');

          if (this._isTreeData() && elem.classList.contains('oj-stream-list-item')) {
            scrollPosition.parentKey = this._getParentKey(elem);
          } else {
            scrollPosition.parentKey = null;
          }
        }

        this._updateProperty('scrollPosition', scrollPosition);
      }
    }, {
      key: "_syncScrollTopWithProps",
      value: function _syncScrollTopWithProps() {
        var scrollPosition = this.props.scrollPosition;
        var scrollTop;
        var key = scrollPosition.key;

        if (key) {
          var parent = scrollPosition.parentKey;

          var item = this._getItemByKey(key, parent);

          if (item != null) {
            var root = this.root;
            scrollTop = item.offsetTop - root.offsetTop;
          } else {
            return;
          }

          var offsetY = scrollPosition.offsetY;

          if (!isNaN(offsetY)) {
            scrollTop = scrollTop + offsetY;
          }
        } else {
          var y = scrollPosition.y;

          if (!isNaN(y)) {
            scrollTop = y;
          } else {
            return;
          }
        }

        if (scrollTop > this._getScroller().scrollHeight) {
          return;
        }

        this._getScroller().scrollTop = scrollTop;
      }
    }, {
      key: "_getParentKey",
      value: function _getParentKey(item) {
        while (item) {
          if (item.classList.contains('oj-stream-list-group')) {
            return item.key;
          }

          item = item.previousElementSibling;
        }

        return null;
      }
    }, {
      key: "_getItemByKey",
      value: function _getItemByKey(key, parentKey) {
        var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');

        for (var i = 0; i < items.length; i++) {
          var item = items[i];

          if (item === key) {
            if (parentKey == null || this._getParentKey(item) === parentKey) {
              return item;
            }
          }
        }
      }
    }, {
      key: "_getScrollEventElement",
      value: function _getScrollEventElement() {
        var scroller = this.props.scrollPolicyOptions.scroller;

        if (scroller != null) {
          if (scroller === document.body || scroller === document.documentElement) {
            return window;
          }

          return scroller;
        }

        return this.getRootElement();
      }
    }, {
      key: "_getScroller",
      value: function _getScroller() {
        var scroller = this.props.scrollPolicyOptions.scroller;

        if (scroller != null) {
          return scroller;
        }

        return this.getRootElement();
      }
    }, {
      key: "_findClosestElementToTop",
      value: function _findClosestElementToTop(currScrollTop) {
        var items = this.root.querySelectorAll('.oj-stream-list-item, .oj-stream-list-group');

        if (items == null || items.length === 0) {
          return null;
        }

        var root = this.root;
        var rootTop = root.offsetTop;
        var scrollTop = Math.max(currScrollTop, 0);
        var offsetTop = 0 - rootTop;
        var diff = scrollTop;
        var index = 0;
        var elem = items[index];
        var found = false;
        var elementDetail = {
          elem: elem,
          offsetY: diff
        };

        while (!found && index >= 0 && index < items.length) {
          elem = items[index];
          offsetTop = elem.offsetTop - rootTop;
          diff = Math.abs(scrollTop - offsetTop);
          found = diff < 1 || scrollTop <= offsetTop;

          if (found) {
            break;
          }

          elementDetail = {
            elem: elem,
            offsetY: diff
          };
          index += 1;
        }

        return elementDetail;
      }
    }, {
      key: "_getExpandSkeletonsForKey",
      value: function _getExpandSkeletonsForKey(key) {
        var skeletonsForKey = [];
        var allSkeletons = this.getRootElement().querySelectorAll('.oj-stream-list-child-skeleton');
        allSkeletons.forEach(function (skeleton) {
          if (skeleton.getAttribute('key') == key) {
            skeletonsForKey.push(skeleton);
          }
        });
        return skeletonsForKey;
      }
    }, {
      key: "isAvailable",
      value: function isAvailable() {
        return this.contentHandler != null;
      }
    }, {
      key: "getCurrentItem",
      value: function getCurrentItem() {
        return this.currentKey;
      }
    }, {
      key: "setCurrentItem",
      value: function setCurrentItem(item) {
        this.currentKey = item;
      }
    }, {
      key: "getData",
      value: function getData() {
        return this.state.renderedData;
      }
    }, {
      key: "setData",
      value: function setData(data) {
        this.updateState({
          renderedData: data
        });
      }
    }, {
      key: "updateData",
      value: function updateData(updater) {
        this.updateState(function (state) {
          var returnVal = updater(state.renderedData, state.expandingKeys);
          return returnVal;
        }.bind(this));
      }
    }, {
      key: "getExpanded",
      value: function getExpanded() {
        return this.props.expanded;
      }
    }, {
      key: "setExpanded",
      value: function setExpanded(set) {
        this._updateProperty('expanded', set);
      }
    }, {
      key: "updateExpand",
      value: function updateExpand(updater) {
        this.updateState(function (state, props) {
          return updater(state.renderedData, state.expandedSkeletonKeys, state.expandingKeys, props.expanded);
        }.bind(this));
      }
    }, {
      key: "getExpandingKeys",
      value: function getExpandingKeys() {
        return this.state.expandingKeys;
      }
    }, {
      key: "setExpandingKeys",
      value: function setExpandingKeys(set) {
        this.updateState({
          expandingKeys: set
        });
      }
    }, {
      key: "updateExpandingKeys",
      value: function updateExpandingKeys(key) {
        this.updateState(function (state) {
          return {
            expandingKeys: state.expandingKeys.add([key])
          };
        });
      }
    }, {
      key: "getSkeletonKeys",
      value: function getSkeletonKeys() {
        return this.state.expandedSkeletonKeys;
      }
    }, {
      key: "setSkeletonKeys",
      value: function setSkeletonKeys(set) {
        this.updateState({
          expandedSkeletonKeys: set
        });
      }
    }, {
      key: "updateSkeletonKeys",
      value: function updateSkeletonKeys(key) {
        this.updateState(function (state) {
          return {
            expandedSkeletonKeys: state.expandedSkeletonKeys.add([key])
          };
        });
      }
    }, {
      key: "getOutOfRangeData",
      value: function getOutOfRangeData() {
        return this.state.outOfRangeData;
      }
    }, {
      key: "setOutOfRangeData",
      value: function setOutOfRangeData(data) {
        this.updateState({
          outOfRangeData: data
        });
      }
    }, {
      key: "getItemRenderer",
      value: function getItemRenderer() {
        return this.props.itemTemplate;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass() {
        return 'oj-stream-list-item';
      }
    }, {
      key: "getGroupRenderer",
      value: function getGroupRenderer() {
        return this.props.groupTemplate;
      }
    }, {
      key: "getGroupStyleClass",
      value: function getGroupStyleClass() {
        return 'oj-stream-list-group';
      }
    }, {
      key: "_handleTouchOrClickEvent",
      value: function _handleTouchOrClickEvent(event) {
        var target = event.target;
        var item = target.closest('.oj-stream-list-item, .oj-stream-list-group');

        if (item) {
          if (this._isInputElement(target) || this._isInsideInputElement(target, item)) {
            this._updateCurrentItemAndFocus(item, false);

            this._enterActionableMode(target);
          } else {
            this._updateCurrentItemAndFocus(item, true);
          }
        }
      }
    }, {
      key: "_isInputElement",
      value: function _isInputElement(target) {
        var inputRegExp = /^INPUT|SELECT|OPTION|TEXTAREA/;
        return target.nodeName.match(inputRegExp) != null && !target.readOnly;
      }
    }, {
      key: "_isInsideInputElement",
      value: function _isInsideInputElement(target, item) {
        var found = false;

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
    }, {
      key: "_resetFocus",
      value: function _resetFocus(item) {
        if (this.actionableMode) {
          this._exitActionableMode(false);
        }

        item.classList.remove('oj-focus');
        item.tabIndex = -1;
      }
    }, {
      key: "_setFocus",
      value: function _setFocus(item, shouldFocus) {
        item.tabIndex = 0;

        if (shouldFocus) {
          item.classList.add('oj-focus');
          item.focus();
        }
      }
    }, {
      key: "_updateCurrentItemAndFocus",
      value: function _updateCurrentItemAndFocus(item, shouldFocus) {
        var lastCurrentItem = this.currentItem;
        var newCurrentItem = item;

        this._resetFocus(lastCurrentItem);

        this._setFocus(newCurrentItem, shouldFocus);

        this.currentItem = newCurrentItem;
        this.setCurrentItem(newCurrentItem.key);
      }
    }, {
      key: "_isInViewport",
      value: function _isInViewport(item) {
        var itemElem = item;
        var top = itemElem.offsetTop;

        var scrollTop = this._getScroller().scrollTop;

        return top >= scrollTop && top <= scrollTop + this.state.height;
      }
    }, {
      key: "_restoreCurrentItem",
      value: function _restoreCurrentItem(items) {
        if (this.currentKey != null) {
          for (var i = 0; i < items.length; i++) {
            if (oj.KeyUtils.equals(items[i].key, this.currentKey)) {
              var elem = items[i];

              if (this.restoreFocus && this._isInViewport(elem)) {
                this._updateCurrentItemAndFocus(elem, true);

                return;
              } else {
                this._setFocus(elem, false);

                this.currentItem = elem;
              }

              break;
            }
          }
        }

        this.restoreFocus = false;
      }
    }, {
      key: "_disableAllTabbableElements",
      value: function _disableAllTabbableElements(items) {
        items.forEach(function (item) {
          var busyContext = Context.getContext(item).getBusyContext();
          busyContext.whenReady().then(function () {
            DataCollectionUtils.disableAllFocusableElements(item, true);
          });
        });
      }
    }, {
      key: "_enterActionableMode",
      value: function _enterActionableMode(target) {
        this.actionableMode = true;

        if (this.currentItem) {
          var elems = DataCollectionUtils.enableAllFocusableElements(this.currentItem, true);

          if (target == null && elems && elems.length > 0) {
            elems[0].focus();
          }
        }
      }
    }, {
      key: "_exitActionableMode",
      value: function _exitActionableMode(shouldFocus) {
        this.actionableMode = false;

        if (this.currentItem) {
          DataCollectionUtils.disableAllFocusableElements(this.currentItem, true);

          this._setFocus(this.currentItem, shouldFocus);
        }
      }
    }], [{
      key: "initStateFromProps",
      value: function initStateFromProps(props, state) {
        return StreamList_1.updateStateFromProps(props, state, null);
      }
    }, {
      key: "updateStateFromProps",
      value: function updateStateFromProps(props, state, oldProps) {
        var expandedToggleKeys = state.expandedToggleKeys,
            expandingKeys = state.expandingKeys,
            renderedData = state.renderedData,
            expandedSkeletonKeys = state.expandedSkeletonKeys;
        var newExpanded = props.expanded;

        if (oldProps && newExpanded !== oldProps.expanded) {
          var oldExpanded = oldProps.expanded;
          expandedToggleKeys.values().forEach(function (key) {
            if (oldExpanded.has(key) !== newExpanded.has(key)) {
              expandedToggleKeys = expandedToggleKeys.delete([key]);
            }
          });
          var toCollapse = [];
          renderedData.value.metadata.forEach(function (itemMetadata) {
            var key = itemMetadata.key;
            var itemExpanded = itemMetadata.expanded;
            var isExpanded = newExpanded.has(key);

            if (itemExpanded && !isExpanded) {
              toCollapse.push(key);
              itemMetadata.expanded = false;
            } else if (!itemExpanded && isExpanded) {
              expandingKeys = expandingKeys.add([key]);
              itemMetadata.expanded = true;
            }
          });
          toCollapse.forEach(function (key) {
            renderedData = StreamList_1.collapse(key, renderedData);
            expandingKeys = expandingKeys.delete([key]);
            expandedSkeletonKeys = expandedSkeletonKeys.delete([key]);
          });
          return {
            renderedData: renderedData,
            expandingKeys: expandingKeys,
            expandedToggleKeys: expandedToggleKeys,
            expandedSkeletonKeys: expandedSkeletonKeys
          };
        }
      }
    }, {
      key: "_findIndex",
      value: function _findIndex(metadata, key) {
        for (var i = 0; i < metadata.length; i++) {
          if (oj.KeyUtils.equals(key, metadata[i].key)) {
            return i;
          }
        }

        return -1;
      }
    }]);

    return StreamList;
  }(ojvcomponent.VComponent);

  exports.StreamList.collapse = function (key, currentData) {
    var data = currentData.value.data;
    var metadata = currentData.value.metadata;

    var index = StreamList_1._findIndex(metadata, key);

    if (index > -1) {
      var count = StreamList_1._getLocalDescendentCount(metadata, index);

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

  exports.StreamList._getLocalDescendentCount = function (metadata, index) {
    var count = 0;
    var depth = metadata[index].treeDepth;
    var lastIndex = metadata.length;

    for (var j = index + 1; j < lastIndex; j++) {
      var newMetadata = metadata[j];
      var newDepth = newMetadata.treeDepth;

      if (newDepth > depth) {
        count += 1;
      } else {
        return count;
      }
    }

    return count;
  };

  exports.StreamList.metadata = {
    "extension": {
      "_DEFAULTS": Props
    },
    "properties": {
      "data": {
        "type": "object|null",
        "value": null
      },
      "expanded": {
        "type": "object",
        "writeback": true,
        "readOnly": false
      },
      "scrollPolicy": {
        "type": "string",
        "enumValues": ["loadAll", "loadMoreOnScroll"],
        "value": "loadMoreOnScroll"
      },
      "scrollPolicyOptions": {
        "type": "object",
        "properties": {
          "fetchSize": {
            "type": "number",
            "value": 25
          },
          "maxCount": {
            "type": "number",
            "value": 500
          },
          "scroller": {
            "type": "Element|null",
            "value": null
          }
        }
      },
      "scrollPosition": {
        "type": "object",
        "properties": {
          "y": {
            "type": "number",
            "value": 0
          },
          "key": {
            "type": "any"
          },
          "offsetY": {
            "type": "number"
          },
          "parentKey": {
            "type": "any"
          }
        },
        "writeback": true,
        "readOnly": false
      }
    },
    "slots": {
      "groupTemplate": {},
      "itemTemplate": {}
    }
  };

  __decorate([ojvcomponent.listener()], exports.StreamList.prototype, "_handleFocusIn", null);

  __decorate([ojvcomponent.listener()], exports.StreamList.prototype, "_handleFocusOut", null);

  __decorate([ojvcomponent.listener()], exports.StreamList.prototype, "_handleClick", null);

  __decorate([ojvcomponent.listener()], exports.StreamList.prototype, "_handleKeyDown", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.StreamList.prototype, "_touchStartHandler", null);

  __decorate([ojvcomponent.listener()], exports.StreamList.prototype, "scrollListener", null);

  exports.StreamList = StreamList_1 = __decorate([ojvcomponent.customElement('oj-stream-list')], exports.StreamList);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())