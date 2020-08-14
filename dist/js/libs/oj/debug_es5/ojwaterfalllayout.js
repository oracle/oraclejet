(function() {function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

define(['exports', 'ojs/ojcore-base', 'ojs/ojdatacollection-common', 'ojs/ojanimation', 'ojs/ojthemeutils', 'ojs/ojvcomponent', 'ojs/ojcontext', 'ojs/ojlogger', 'ojs/ojvcollection'], function (exports, oj, DataCollectionUtils, AnimationUtils, ThemeUtils, ojvcomponent, Context, Logger, ojvcollection) {
  'use strict';
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

  var DefaultLayout = /*#__PURE__*/function () {
    function DefaultLayout(fullWidth, gutterWidth, itemWidth, cache) {
      _classCallCheck(this, DefaultLayout);

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

    _createClass(DefaultLayout, [{
      key: "_initializeColumnsInfo",
      value: function _initializeColumnsInfo() {
        this.columns = Math.max(1, Math.floor(this.fullWidth / (this.itemWidth + this.gutterWidth)));
        this.margin = Math.max(this.gutterWidth, (this.fullWidth - this.columns * (this.itemWidth + this.gutterWidth)) / 2);
        this.columnsInfo.length = this.columns;

        for (var i = 0; i < this.columns; i++) {
          this.columnsInfo[i] = 0;
        }
      }
    }, {
      key: "_populatePositions",
      value: function _populatePositions(arr, startIndex, keyFunc, cacheHitFunc, cacheMissFunc, resultFunc) {
        for (var k = 0; k < arr.length; k++) {
          var key = keyFunc(arr[k]);

          if (key == null) {
            continue;
          }

          var index = k + startIndex;
          var colIndex = index % this.columnsInfo.length;
          var itemHeight = undefined;
          var cachedPos = this.cache.get(key);

          if (cachedPos && !isNaN(cachedPos.height)) {
            itemHeight = cachedPos.height;

            if (cachedPos.valid !== false && !isNaN(cachedPos.top) && !isNaN(cachedPos.left)) {
              cacheHitFunc(index, key, colIndex, cachedPos);
              continue;
            }
          } else {
            itemHeight = cacheMissFunc(arr[k]);
          }

          if (isNaN(itemHeight)) {
            return;
          }

          var left = this.margin;
          var val = void 0;

          if (index < this.columnsInfo.length) {
            left += colIndex * (this.itemWidth + this.gutterWidth);
            val = {
              top: this.gutterWidth,
              left: left,
              height: itemHeight,
              valid: true
            };
            this.columnsInfo[colIndex] = itemHeight + this.gutterWidth * 2;
            this.bottom = Math.max(this.bottom, itemHeight);
          } else {
            var minTop = this.columnsInfo.reduce(function (a, b) {
              return Math.min(a, b);
            });
            var minIndex = this.columnsInfo.indexOf(minTop);
            left += minIndex * (this.itemWidth + this.gutterWidth);
            val = {
              top: minTop,
              left: left,
              height: itemHeight,
              valid: true
            };
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
    }, {
      key: "setWidth",
      value: function setWidth(width) {
        this.fullWidth = width;

        if (this.columnsInfo.length > 0) {
          this._initializeColumnsInfo();

          this._invalidatePositions(0);
        }
      }
    }, {
      key: "getPositionForItems",
      value: function getPositionForItems(items, startIndex) {
        var positions = new Map();

        if (isNaN(this.itemWidth) && items.length > 0) {
          this.itemWidth = items[0].element.offsetWidth;
        }

        if (this.columnsInfo.length === 0) {
          this._initializeColumnsInfo();
        }

        this._populatePositions(items, startIndex, function (item) {
          return item.key;
        }, function (index, key, colIndex, cachedPos) {
          positions.set(key, cachedPos);
        }, function (item) {
          return item.element.offsetHeight;
        }, function (key, val) {
          positions.set(key, val);
        });

        var start = 0;
        var posSet = new Set();
        var posArray = Array.from(positions.values());

        for (var i = 0; i < posArray.length; i++) {
          var key = posArray[i].left;

          if (!posSet.has(key)) {
            posSet.add(key);
          }

          start = Math.max(start, posArray[i].top);

          if (posSet.size === this.columnsInfo.length) {
            break;
          }
        }

        posSet.clear();
        var end = Number.MAX_VALUE;

        for (var j = posArray.length - 1; j >= 0; j--) {
          var _key = posArray[j].left;

          if (!posSet.has(_key)) {
            posSet.add(_key);
          }

          end = Math.min(end, posArray[j].top + posArray[j].height);

          if (posSet.size === this.columnsInfo.length) {
            break;
          }
        }

        return {
          start: start,
          end: end,
          positions: positions
        };
      }
    }, {
      key: "getItemWidth",
      value: function getItemWidth() {
        return this.itemWidth;
      }
    }, {
      key: "getPositions",
      value: function getPositions() {
        return this.cache;
      }
    }, {
      key: "getPosition",
      value: function getPosition(key) {
        return this.cache.get(key);
      }
    }, {
      key: "getLastItemPosition",
      value: function getLastItemPosition() {
        return this.bottom;
      }
    }, {
      key: "getColumnsInfo",
      value: function getColumnsInfo() {
        var _this = this;

        return this.columnsInfo.map(function (val, index) {
          return {
            top: val,
            left: _this.margin + index * (_this.itemWidth + _this.gutterWidth)
          };
        });
      }
    }, {
      key: "insert",
      value: function insert(beforeKeys, keys) {
        var _this2 = this;

        var minIndex = Number.MAX_VALUE;
        beforeKeys.forEach(function (beforeKey, i) {
          var index = _this2.keys.indexOf(beforeKey);

          var key = keys[i];

          if (index > -1) {
            minIndex = Math.min(minIndex, index);

            _this2.keys.splice(index, 0, key);

            _this2.cache.set(key, {
              top: undefined,
              left: undefined,
              height: undefined,
              valid: false
            });
          }
        });

        this._invalidatePositions(minIndex);
      }
    }, {
      key: "remove",
      value: function remove(keys) {
        var _this3 = this;

        var minIndex = Number.MAX_VALUE;
        keys.forEach(function (key) {
          _this3.cache.delete(key);

          var index = _this3.keys.indexOf(key);

          if (index > -1) {
            minIndex = Math.min(minIndex, index);

            _this3.keys.splice(index, 1);
          }
        });

        this._invalidatePositions(minIndex);
      }
    }, {
      key: "update",
      value: function update(keys) {
        var _this4 = this;

        keys.forEach(function (key) {
          var position = _this4.getPosition(key);

          if (position) {
            position.height = undefined;
          }
        });
      }
    }, {
      key: "_invalidatePositions",
      value: function _invalidatePositions(fromIndex) {
        for (var i = fromIndex; i < this.keys.length; i++) {
          var position = this.cache.get(this.keys[i]);

          if (position != null) {
            position.valid = false;
          }
        }

        for (var j = 0; j < this.columns; j++) {
          this.columnsInfo[j] = 0;
        }

        this.recalculatePositions();
      }
    }, {
      key: "recalculatePositions",
      value: function recalculatePositions() {
        var _this5 = this;

        this._populatePositions(this.keys, 0, function (key) {
          return key;
        }, function (index, key, colIndex, cachedPos) {
          var itemHeight = cachedPos.height;

          if (index < _this5.columnsInfo.length) {
            _this5.columnsInfo[colIndex] = itemHeight + _this5.gutterWidth * 2;
            _this5.bottom = Math.max(_this5.bottom, itemHeight);
          } else {
            var minTop = _this5.columnsInfo.reduce(function (a, b) {
              return Math.min(a, b);
            });

            var minIndex = _this5.columnsInfo.indexOf(minTop);

            _this5.columnsInfo[minIndex] = _this5.columnsInfo[minIndex] + itemHeight + _this5.gutterWidth;
            _this5.bottom = Math.max(_this5.bottom, minTop + itemHeight);
          }
        }, function (item) {
          return undefined;
        });
      }
    }]);

    return DefaultLayout;
  }();

  var WaterfallLayoutContentHandler = /*#__PURE__*/function (_ojvcollection$Iterat) {
    _inherits(WaterfallLayoutContentHandler, _ojvcollection$Iterat);

    var _super = _createSuper(WaterfallLayoutContentHandler);

    function WaterfallLayoutContentHandler(root, dataProvider, callback, scrollPolicyOptions, itemDimension, gutterWidth) {
      var _this6;

      _classCallCheck(this, WaterfallLayoutContentHandler);

      _this6 = _super.call(this, root, dataProvider, callback, scrollPolicyOptions);
      _this6.root = root;
      _this6.dataProvider = dataProvider;
      _this6.callback = callback;
      _this6.scrollPolicyOptions = scrollPolicyOptions;
      _this6.itemDimension = itemDimension;
      _this6.gutterWidth = gutterWidth;

      _this6.postRender = function () {
        var itemsRoot = _this6.root.lastElementChild.firstElementChild;

        if (itemsRoot && _this6.adjustPositionsResolveFunc == null) {
          _this6.adjustPositionsResolveFunc = _this6._addComponentBusyState('adjusting item positions');
          var busyContext = Context.getContext(itemsRoot).getBusyContext();
          busyContext.whenReady().then(function () {
            if (_this6.adjustPositionsResolveFunc) {
              _this6.adjustPositionsResolveFunc();

              _this6.adjustPositionsResolveFunc = null;
            }

            if (_this6.callback) {
              var recalculate = _this6._handleOutOfRangeItems();

              var result = _this6._adjustAllItems(recalculate);

              if (result.done) {
                if (_this6.domScroller && !_this6.domScroller.checkViewport()) {
                  return;
                }

                _this6.callback.renderComplete(result.items);
              }
            }
          });
        }
      };

      _this6.newItemsTracker = new Set();
      _this6.vnodesCache = new Map();
      return _this6;
    }

    _createClass(WaterfallLayoutContentHandler, [{
      key: "getLayout",
      value: function getLayout() {
        if (this.layout == null) {
          var itemWidth;

          if (this.itemDimension) {
            itemWidth = this.itemDimension.width;
          }

          this.layout = new DefaultLayout(this.root.clientWidth, this.gutterWidth, itemWidth, new Map());
        }

        return this.layout;
      }
    }, {
      key: "_handleOutOfRangeItems",
      value: function _handleOutOfRangeItems() {
        var _this7 = this;

        var recalculate = false;
        var layout = this.getLayout();
        this.root.querySelectorAll('.oj-waterfalllayout-position-only').forEach(function (elem) {
          var key = _this7.getKey(elem);

          var position = layout.getPosition(key);

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
    }, {
      key: "_adjustAllItems",
      value: function _adjustAllItems(force) {
        var _this8 = this;

        var adjusted = true;
        var items = Array.from(this.root.querySelectorAll('.oj-waterfalllayout-item')).map(function (elem) {
          if (elem.getAttribute('data-oj-positioned') === 'false') {
            adjusted = false;
          }

          return {
            key: _this8.getKey(elem),
            element: elem
          };
        });

        if (adjusted && !force) {
          return {
            done: true,
            items: items
          };
        }

        var startIndex = this.callback.getData().startIndex;
        var positions = this.getLayout().getPositionForItems(items, isNaN(startIndex) ? 0 : startIndex);
        this.callback.setPositions(positions.positions);
        this.callback.setContentHeight(this.getLayout().getLastItemPosition());

        if (this.domScroller) {
          this.domScroller.setViewportRange(positions.start, positions.end);
        }

        return {
          done: false,
          items: items
        };
      }
    }, {
      key: "handleResizeWidth",
      value: function handleResizeWidth(newWidth) {
        this.initialFetch = false;
        this.getLayout().setWidth(newWidth);
        this.newItemsTracker.clear();
      }
    }, {
      key: "_addComponentBusyState",
      value: function _addComponentBusyState(description) {
        var componentBusyContext = Context.getContext(this.root).getBusyContext();
        return componentBusyContext.addBusyState({
          description: description
        });
      }
    }, {
      key: "handleBeforeFetchNext",
      value: function handleBeforeFetchNext(scrollTop) {
        var positions = this.callback.getPositions();

        if (positions == null) {
          return -1;
        }

        var index = this.callback.getData().startIndex;

        if (isNaN(index)) {
          index = 0;
        }

        var iterator = positions.values();
        var pos = iterator.next();

        while (!pos.done) {
          var bottom = pos.value.top + pos.value.height;

          if (bottom > scrollTop) {
            break;
          }

          pos = iterator.next();
          index++;
        }

        return index;
      }
    }, {
      key: "_isRenderingViewportOnly",
      value: function _isRenderingViewportOnly() {
        return false;
      }
    }, {
      key: "handleBeforeFetchByOffset",
      value: function handleBeforeFetchByOffset(startIndex, endIndex) {
        if (!this._isRenderingViewportOnly()) {
          return;
        }

        var map = this.getLayout().getPositions();
        var positions = Array.from(map.values()).slice(startIndex, endIndex);

        if (positions.length > 0) {
          this.callback.setSkeletonPositions({
            startIndex: startIndex,
            endIndex: endIndex,
            positions: positions
          });
        }
      }
    }, {
      key: "handleFetchSuccess",
      value: function handleFetchSuccess(result) {
        if (result != null) {
          this.newItemsTracker.clear();
        }

        this.initialFetch = false;

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleFetchSuccess", this).call(this, result);
      }
    }, {
      key: "renderFetchedData",
      value: function renderFetchedData() {
        var positions = this.callback.getSkeletonPositions();

        if (positions != null && !isNaN(positions.startIndex) && !isNaN(positions.endIndex)) {
          var skeletonStartIndex = positions.startIndex;
          var skeletonEndIndex = positions.endIndex;
          var skeletonPositions = positions.positions;
          var dataObj = this.callback.getData();
          var dataStartIndex = isNaN(dataObj.startIndex) ? 0 : dataObj.startIndex;
          var dataEndIndex = dataStartIndex + dataObj.value.data.length;

          if (dataEndIndex < skeletonStartIndex || dataStartIndex > skeletonEndIndex) {
            this._log('no data within range, rendering all items as skeletons');

            return this.callback.renderSkeletons(skeletonPositions);
          } else {
            var data = dataObj.value.data.slice(0);
            var metadata = dataObj.value.metadata.slice(0);

            if (dataStartIndex >= skeletonStartIndex) {
              skeletonPositions = skeletonPositions.slice(0, dataStartIndex - skeletonStartIndex);
            } else {
              data = data.slice(skeletonStartIndex - dataStartIndex);
              metadata = metadata.slice(skeletonStartIndex - dataStartIndex);

              this._log('rendering data from: ' + skeletonStartIndex + ' to ' + (skeletonStartIndex + data.length));
            }

            if (dataEndIndex >= skeletonEndIndex) {
              data = data.slice(0, skeletonEndIndex - dataEndIndex);
              metadata = metadata.slice(0, skeletonEndIndex - dataEndIndex);

              this._log('rendering data from: ' + dataStartIndex + ' to ' + (dataStartIndex + data.length));
            }

            var skeletons = this.callback.renderSkeletons(skeletonPositions);
            var content = this.renderData(data, metadata);
            return content.concat(skeletons);
          }
        } else {
          return _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "renderFetchedData", this).call(this);
        }
      }
    }, {
      key: "addItem",
      value: function addItem(key, index, data, visible) {
        var x = -1;
        var y = -1;
        var position = this.getLayout().getPosition(key);

        if (position != null) {
          if (!isNaN(position.left) && !isNaN(position.top)) {
            x = position.left;
            y = position.top;
          }
        } else {
          this.newItemsTracker.add(key);
        }

        var initialFetch = this.isInitialFetch();
        var currentItem = this.callback.getCurrentItem();

        if (currentItem == null && initialFetch && index == 0) {
          this.callback.setCurrentItem(key);
        }

        var vnodes = this.renderItem(key, index, data);
        this.decorateItem(vnodes, key, index, x, y, initialFetch, visible);
        return vnodes;
      }
    }, {
      key: "renderItem",
      value: function renderItem(key, index, data) {
        var node = this.vnodesCache.get(key);

        if (node) {
          if (node.index === index) {
            return node.vnodes;
          } else {
            this.vnodesCache.clear();
          }
        }

        var renderer = this.callback.getItemRenderer();
        var vnodes = renderer({
          data: data,
          index: index,
          key: key
        });
        this.vnodesCache.set(key, {
          index: index,
          vnodes: vnodes
        });
        return vnodes;
      }
    }, {
      key: "decorateItem",
      value: function decorateItem(vnodes, key, index, x, y, initialFetch, visible) {
        var contentRoot;

        for (var i = 0; i < vnodes.length; i++) {
          var node = vnodes[i]._node;

          if (node.nodeType === 1) {
            contentRoot = node;
            break;
          }
        }

        if (contentRoot != null && !contentRoot.classList.contains('oj-waterfalllayout-exit-animation')) {
          contentRoot.key = key;
          contentRoot.setAttribute('key', JSON.stringify(key));
          contentRoot.setAttribute('role', 'gridcell');
          contentRoot.setAttribute('tabIndex', '-1');
          contentRoot.setAttribute('data-oj-positioned', x != -1 && y != -1 ? 'true' : 'false');
          var styleClasses = this.getItemStyleClass(visible, x, y, this.newItemsTracker.has(key), initialFetch);
          styleClasses.forEach(function (styleClass) {
            contentRoot.classList.add(styleClass);
          });
          var inlineStyle = this.getItemInlineStyle(visible, x, y, index, initialFetch);
          Object.keys(inlineStyle).forEach(function (prop) {
            contentRoot.style[prop] = inlineStyle[prop];
          });
        }
      }
    }, {
      key: "getItemInlineStyle",
      value: function getItemInlineStyle(visible, x, y, index, animate) {
        var style = {};

        if (x === -1 || y === -1) {
          style.top = 0;
          style.left = 0;
        } else {
          style.left = x + 'px';
          style.top = y + 'px';
        }

        if (visible && x != -1 && y != -1) {
          if (!animate) {
            style.visibility = 'visible';
          } else {
            style.opacity = 0;

            if (!isNaN(index)) {
              style.animationDelay = 50 * index + 'ms';
            }
          }
        }

        return style;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass(visible, x, y, isNew, animate) {
        var styleClass = [];

        if (visible) {
          styleClass.push('oj-waterfalllayout-item');

          if (x != -1 && y != -1) {
            if (animate) {
              styleClass.push('oj-waterfalllayout-entrance-animation');
            } else if (isNew) {
              styleClass.push('oj-waterfalllayout-item-fadein-animation');
            }
          }
        } else {
          styleClass.push('oj-waterfalllayout-position-only');
        }

        return styleClass;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore() {
        var layout = this.getLayout();
        var columnsInfo = layout.getColumnsInfo();
        var itemWidth = layout.getItemWidth();
        var skeletons = [];
        var maxTop = Math.max.apply(Math, _toConsumableArray(columnsInfo.map(function (column) {
          return column.top;
        })));

        if (maxTop > 0) {
          var endPos = maxTop + 100;
          this.callback.setContentHeight(endPos);
          var positions = columnsInfo.map(function (columnInfo) {
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
    }, {
      key: "handleItemsAdded",
      value: function handleItemsAdded(detail) {
        var addBeforeKeys = detail.addBeforeKeys;

        if (addBeforeKeys != null) {
          var keys = Array.from(detail.keys);
          this.getLayout().insert(addBeforeKeys, keys);
        }

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleItemsAdded", this).call(this, detail);
      }
    }, {
      key: "handleItemsRemoved",
      value: function handleItemsRemoved(detail) {
        var keys = Array.from(detail.keys);
        this.getLayout().remove(keys);

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleItemsRemoved", this).call(this, detail);
      }
    }, {
      key: "handleCurrentRangeItemUpdated",
      value: function handleCurrentRangeItemUpdated(key) {
        var position = this.getLayout().getPosition(key);

        if (position) {
          position.top = undefined;
          position.left = undefined;
        }

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleCurrentRangeItemUpdated", this).call(this, key);
      }
    }, {
      key: "handleItemsUpdated",
      value: function handleItemsUpdated(detail) {
        var keys = Array.from(detail.keys);
        this.getLayout().update(keys);

        _get(_getPrototypeOf(WaterfallLayoutContentHandler.prototype), "handleItemsUpdated", this).call(this, detail);
      }
    }, {
      key: "_log",
      value: function _log(msg) {
        Logger.info('[WaterfallLayoutContentHandler]=> ' + msg);
      }
    }]);

    return WaterfallLayoutContentHandler;
  }(ojvcollection.IteratingDataProviderContentHandler);

  var __decorate = null && null.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
      if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

  var WaterfallLayout_1;

  var Props = function Props() {
    _classCallCheck(this, Props);

    this.data = null;
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

  exports.WaterfallLayout = WaterfallLayout_1 = /*#__PURE__*/function (_ojvcomponent$VCompon) {
    _inherits(WaterfallLayout, _ojvcomponent$VCompon);

    var _super2 = _createSuper(WaterfallLayout);

    function WaterfallLayout(props) {
      var _this9;

      _classCallCheck(this, WaterfallLayout);

      _this9 = _super2.call(this, props);
      _this9.restoreFocus = false;
      _this9.actionableMode = false;
      _this9.ticking = false;

      _this9.setRootElement = function (element) {
        _this9.root = element;
      };

      _this9.state = {
        renderedData: null,
        outOfRangeData: null,
        positions: null,
        skeletonPositions: null,
        width: 0,
        height: 0,
        contentHeight: 0
      };
      return _this9;
    }

    _createClass(WaterfallLayout, [{
      key: "_handleFocusIn",
      value: function _handleFocusIn(event) {
        if (this.currentItem) {
          this.currentItem.classList.add('oj-focus');
        }
      }
    }, {
      key: "_handleFocusOut",
      value: function _handleFocusOut(event) {
        if (this.currentItem) {
          this.currentItem.classList.remove('oj-focus');
          this.currentItem.classList.remove('oj-waterfalllayout-item-suppress-focus');
        }
      }
    }, {
      key: "_handleClick",
      value: function _handleClick(event) {
        this._handleTouchOrClickEvent(event);
      }
    }, {
      key: "_handlePointerDown",
      value: function _handlePointerDown(event) {
        var item = event.target.closest('.' + this.getItemStyleClass());

        if (item != null) {
          item.classList.add('oj-waterfalllayout-item-suppress-focus');
        }
      }
    }, {
      key: "_handleKeyDown",
      value: function _handleKeyDown(event) {
        if (this.currentItem) {
          var next;

          switch (event.key) {
            case 'ArrowLeft':
            case 'Left':
              {
                next = this.currentItem.previousElementSibling;
                break;
              }

            case 'ArrowRight':
            case 'Right':
              {
                next = this.currentItem.nextElementSibling;
                break;
              }

            case 'F2':
              {
                if (this.actionableMode === false) {
                  this._enterActionableMode();
                }

                break;
              }

            case 'Escape':
            case 'Esc':
              {
                if (this.actionableMode === true) {
                  this._exitActionableMode();
                }

                break;
              }

            case 'Tab':
              {
                if (this.actionableMode === true && this.currentItem) {
                  if (event.shiftKey) {
                    DataCollectionUtils.handleActionablePrevTab(event, this.currentItem);
                  } else {
                    DataCollectionUtils.handleActionableTab(event, this.currentItem);
                  }
                }

                break;
              }

            default:
              {
                break;
              }
          }

          if (this.actionableMode === false && next != null && next.classList.contains(this.getItemStyleClass())) {
            this.currentItem.classList.remove('oj-waterfalllayout-item-suppress-focus');

            this._updateCurrentItem(next);
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
        var content;

        if (this.contentHandler == null) {
          content = this._renderInitialSkeletons(null);
        } else {
          var data = this.getData();
          var positions = this.state.skeletonPositions;

          if (data) {
            if (positions != null && this.contentHandler.isInitialFetch()) {
              content = this._renderInitialSkeletons(positions.positions);
            } else {
              content = this.contentHandler.render();

              if (this.currentItem && this.currentItem.contains(document.activeElement)) {
                this.restoreFocus = true;
              }
            }
          } else if (positions != null) {
            content = this._renderInitialSkeletons(positions.positions);
          }
        }

        return ojvcomponent.h("oj-waterfall-layout", {
          ref: this.setRootElement,
          style: this._getRootElementStyle()
        }, ojvcomponent.h("div", {
          onClick: this._handleClick,
          onKeydown: this._handleKeyDown,
          onTouchstart: this._touchStartHandler,
          onFocusin: this._handleFocusIn,
          onFocusout: this._handleFocusOut,
          onPointerdown: this._handlePointerDown,
          role: 'grid'
        }, ojvcomponent.h("div", {
          role: 'row',
          style: this._getContentDivStyle(),
          "data-oj-context": true
        }, content)));
      }
    }, {
      key: "mounted",
      value: function mounted() {
        var _this10 = this;

        var root = this.getRootElement();
        this.contentHandler = new WaterfallLayoutContentHandler(root, this.props.data, this, this.props.scrollPolicyOptions, null, WaterfallLayout_1.gutterWidth);
        this.contentHandler.fetchRows();
        var rootWidth = root.clientWidth;
        var rootHeight = root.clientHeight;
        this.updateState({
          width: rootWidth,
          height: rootHeight
        });
        var skeleton = root.querySelector('.oj-waterfalllayout-skeleton');

        if (skeleton) {
          this.skeletonWidth = skeleton.clientWidth;

          this._delayShowSkeletons();
        }

        if (window['ResizeObserver']) {
          var resizeObserver = new window['ResizeObserver'](function (entries) {
            entries.forEach(function (entry) {
              if (entry.target === root && entry.contentRect) {
                var currWidth = _this10.state.width;
                var newWidth = Math.round(entry.contentRect.width);

                if (Math.abs(newWidth - currWidth) > 1) {
                  _this10.contentHandler.handleResizeWidth(newWidth);

                  _this10.updateState({
                    width: newWidth
                  });
                }

                var currHeight = _this10.state.height;
                var newHeight = Math.round(entry.contentRect.height);

                if (Math.abs(newHeight - currHeight) > 1 && newHeight !== _this10.state.contentHeight) {
                  _this10.updateState({
                    height: newHeight
                  });
                }
              }
            });
          });
          resizeObserver.observe(root);
          this.resizeObserver = resizeObserver;
        }

        this._getScroller().addEventListener('scroll', this.scrollListener);
      }
    }, {
      key: "updated",
      value: function updated(oldProps, oldState) {
        var _this11 = this;

        var data = this.getData();

        if (data != null) {
          var root = this.getRootElement();

          if (oldState.renderedData == null) {
            var skeletons = this._findSkeletons();

            if (skeletons.length > 0) {
              this._applySkeletonExitAnimation(skeletons).then(function () {
                _this11.updateState({
                  skeletonPositions: null
                });
              });
            } else {
              this.updateState({
                skeletonPositions: null
              });
              this.contentHandler.postRender();
            }
          } else if (this.props.data != oldProps.data) {
            this._applyExitAnimation().then(function () {
              _this11.updateState({
                renderedData: null
              });

              if (_this11.contentHandler) {
                _this11.contentHandler.destroy();
              }

              _this11.contentHandler = new WaterfallLayoutContentHandler(root, _this11.props.data, _this11, _this11.props.scrollPolicyOptions, null, WaterfallLayout_1.gutterWidth);

              _this11.contentHandler.fetchRows();

              _this11._delayShowSkeletons();
            });
          } else {
            this.contentHandler.postRender();
          }

          if (this.props.scrollPosition != oldProps.scrollPosition) {
            this._syncScrollTopWithProps();
          }
        }
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
      key: "_delayShowSkeletons",
      value: function _delayShowSkeletons() {
        var _this12 = this;

        window.setTimeout(function () {
          var data = _this12.getData();

          if (data == null) {
            var positions = _this12._getPositionsForSkeletons(50, _this12.state.width, _this12.skeletonWidth);

            _this12.updateState({
              skeletonPositions: positions
            });
          }
        }, this._getShowSkeletonsDelay());
      }
    }, {
      key: "_getOptionDefaults",
      value: function _getOptionDefaults() {
        if (this.defaultOptions == null) {
          this.defaultOptions = ThemeUtils.parseJSONFromFontFamily('oj-waterfalllayout-option-defaults');
        }

        return this.defaultOptions;
      }
    }, {
      key: "_getShowSkeletonsDelay",
      value: function _getShowSkeletonsDelay() {
        var defaultOptions = this._getOptionDefaults();

        if (defaultOptions == null) {
          return 0;
        }

        var delay = parseInt(defaultOptions.showIndicatorDelay, 10);
        return isNaN(delay) ? 0 : delay;
      }
    }, {
      key: "_addBusyState",
      value: function _addBusyState(description) {
        var root = this.getRootElement();
        var componentBusyContext = Context.getContext(root).getBusyContext();
        return componentBusyContext.addBusyState({
          description: description
        });
      }
    }, {
      key: "_findSkeletons",
      value: function _findSkeletons() {
        var skeletons = this.getRootElement().querySelectorAll('.oj-waterfalllayout-skeleton');
        return skeletons.length > 1 ? skeletons : [];
      }
    }, {
      key: "getRootElement",
      value: function getRootElement() {
        return this.root;
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

        var skeletons = this._findSkeletons();

        if (data == null || skeletons.length === 0) {
          this.updateState({
            skeletonPositions: null
          });
        }
      }
    }, {
      key: "updateData",
      value: function updateData(updater) {
        this.updateState(function (state) {
          var currentData = state.renderedData;
          var returnVal = updater(currentData);
          return returnVal;
        }.bind(this));
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
      key: "getSkeletonPositions",
      value: function getSkeletonPositions() {
        return this.state.skeletonPositions;
      }
    }, {
      key: "setSkeletonPositions",
      value: function setSkeletonPositions(positions) {
        this.updateState({
          skeletonPositions: positions
        });
      }
    }, {
      key: "getPositions",
      value: function getPositions() {
        return this.state.positions;
      }
    }, {
      key: "setPositions",
      value: function setPositions(positions) {
        this.updateState({
          positions: positions,
          outOfRangeData: null
        });
      }
    }, {
      key: "setContentHeight",
      value: function setContentHeight(height) {
        if (this.props.scrollPolicyOptions.scroller != null) {
          this.updateState({
            contentHeight: height
          });
        }
      }
    }, {
      key: "getItemRenderer",
      value: function getItemRenderer() {
        return this.props.itemTemplate;
      }
    }, {
      key: "getItemStyleClass",
      value: function getItemStyleClass() {
        return 'oj-waterfalllayout-item';
      }
    }, {
      key: "getItemElementStyleClass",
      value: function getItemElementStyleClass() {
        return 'oj-waterfalllayout-item-element';
      }
    }, {
      key: "getExpanded",
      value: function getExpanded() {}
    }, {
      key: "_applySkeletonExitAnimation",
      value: function _applySkeletonExitAnimation(skeletons) {
        var resolveFunc = this._addBusyState('apply skeleton exit animations');

        return new Promise(function (resolve, reject) {
          var promise;
          skeletons.forEach(function (skeleton) {
            promise = AnimationUtils.fadeOut(skeleton);
          });

          if (promise) {
            promise.then(function () {
              resolveFunc();
              resolve(true);
            });
          }
        });
      }
    }, {
      key: "_applyExitAnimation",
      value: function _applyExitAnimation() {
        var _this13 = this;

        var resolveFunc = this._addBusyState('apply exit animations on existing items');

        return new Promise(function (resolve, reject) {
          var root = _this13.getRootElement();

          var items = root.querySelectorAll('.' + _this13.getItemStyleClass());

          if (items.length === 0) {
            resolveFunc();
            resolve(true);
          } else {
            var listener = function listener(event) {
              root.removeEventListener('animationend', listener);
              items.forEach(function (item) {
                item.classList.remove('oj-waterfalllayout-exit-animation');
              });
              resolveFunc();
              resolve(true);
            };

            root.addEventListener('animationend', listener);
            items.forEach(function (item) {
              item.style.animationDelay = '0ms';
              item.classList.remove('oj-waterfalllayout-item-fadein-animation');
              item.classList.remove('oj-waterfalllayout-entrance-animation');
              item.classList.add('oj-waterfalllayout-exit-animation');
            });
          }
        });
      }
    }, {
      key: "scrollListener",
      value: function scrollListener(event) {
        var _this14 = this;

        if (!this.ticking) {
          window.requestAnimationFrame(function () {
            _this14._updateScrollPosition();

            _this14.ticking = false;
          });
          this.ticking = true;
        }
      }
    }, {
      key: "_updateScrollPosition",
      value: function _updateScrollPosition() {
        var scrollTop = this._getScroller().scrollTop;

        var iterator = this.contentHandler.getLayout().getPositions().entries();
        var result = iterator.next();
        var key;
        var maxTop = 0;

        while (!result.done) {
          var entry = result.value;
          result = iterator.next();
          var top = entry[1].top;

          if (top > scrollTop) {
            if (key === undefined) {
              key = entry[0];
            }

            break;
          } else if (top > maxTop) {
            key = entry[0];
            maxTop = top;
          }
        }

        var offsetY = Math.abs(scrollTop - maxTop);
        var scrollPosition = {
          y: scrollTop,
          key: key,
          offsetY: offsetY
        };

        this._updateProperty('scrollPosition', scrollPosition);
      }
    }, {
      key: "_syncScrollTopWithProps",
      value: function _syncScrollTopWithProps() {
        var scrollPosition = this.props.scrollPosition;
        var scrollTop;
        var key = scrollPosition.key;

        if (key) {
          var pos = this.contentHandler.getLayout().getPosition(key);

          if (pos != null) {
            scrollTop = pos.top;
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
      key: "_handleTouchOrClickEvent",
      value: function _handleTouchOrClickEvent(event) {
        var target = event.target;
        var item = target.closest('.' + this.getItemStyleClass());

        this._updateCurrentItem(item);
      }
    }, {
      key: "_resetFocus",
      value: function _resetFocus(elem) {
        elem.classList.remove('oj-focus');
        elem.tabIndex = -1;
      }
    }, {
      key: "_setFocus",
      value: function _setFocus(elem, focus) {
        elem.tabIndex = 0;

        if (focus) {
          elem.classList.add('oj-focus');
          elem.focus();
        }
      }
    }, {
      key: "_updateCurrentItem",
      value: function _updateCurrentItem(item) {
        var currentElem = this.currentItem;

        this._resetFocus(currentElem);

        this.currentItem = item;
        var elem = item;
        this.currentKey = elem.key;

        this._setFocus(elem, true);

        this._scrollToVisible(elem);
      }
    }, {
      key: "_scrollToVisible",
      value: function _scrollToVisible(elem) {
        var top = elem.offsetTop;
        var height = elem.offsetHeight;

        var container = this._getScroller();

        var containerScrollTop = container.scrollTop;
        var containerHeight = container.offsetHeight;

        if (top >= containerScrollTop && top + height <= containerScrollTop + containerHeight) {
          return;
        }

        var scrollTop = Math.max(0, Math.min(top, Math.abs(top + height - containerHeight)));
        container.scrollTop = scrollTop;
      }
    }, {
      key: "_getScroller",
      value: function _getScroller() {
        var scroller = this.props.scrollPolicyOptions.scroller;
        return scroller != null ? scroller : this.getRootElement();
      }
    }, {
      key: "_getContentDivStyle",
      value: function _getContentDivStyle() {
        return {
          height: this.state.contentHeight + 'px'
        };
      }
    }, {
      key: "_getRootElementStyle",
      value: function _getRootElementStyle() {
        return this.props.scrollPolicyOptions.scroller != null ? {
          overflow: 'hidden'
        } : null;
      }
    }, {
      key: "_renderInitialSkeletons",
      value: function _renderInitialSkeletons(positions) {
        var scroller = this._getScroller();

        if (scroller != null) {
          scroller.scrollTop = 0;
        }

        if (positions == null) {
          return this._renderSkeleton(null);
        } else {
          var count = positions.size;
          var skeletons = [];

          for (var i = 0; i < count; i++) {
            var position = positions.get(i);
            skeletons.push(this._renderSkeleton(position));
          }

          return ojvcomponent.h("div", {
            role: 'row'
          }, skeletons);
        }
      }
    }, {
      key: "_getPositionsForSkeletons",
      value: function _getPositionsForSkeletons(count, rootWidth, skeletonWidth) {
        var items = [];
        var cache = new Map();

        for (var i = 0; i < count; i++) {
          var height = 150 + i % 3 * 100;
          cache.set(i, {
            height: height
          });
          items.push({
            key: i
          });
        }

        var layout = new DefaultLayout(rootWidth, WaterfallLayout_1.gutterWidth, skeletonWidth, cache);
        var positions = layout.getPositionForItems(items, 0);
        return positions;
      }
    }, {
      key: "_isInViewport",
      value: function _isInViewport(item) {
        var itemElem = item;
        var top = parseInt(itemElem.style.top, 10);

        var scrollTop = this._getScroller().scrollTop;

        return top >= scrollTop && top <= scrollTop + this.state.height;
      }
    }, {
      key: "_restoreCurrentItem",
      value: function _restoreCurrentItem(items) {
        if (this.currentKey != null) {
          for (var i = 0; i < items.length; i++) {
            if (oj.KeyUtils.equals(items[i].key, this.currentKey)) {
              var elem = items[i].element;

              if (this.restoreFocus && this._isInViewport(elem)) {
                this._updateCurrentItem(elem);
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
          DataCollectionUtils.disableAllFocusableElements(item.element, true);
        });
      }
    }, {
      key: "_enterActionableMode",
      value: function _enterActionableMode() {
        this.actionableMode = true;

        if (this.currentItem) {
          var elems = DataCollectionUtils.enableAllFocusableElements(this.currentItem, true);

          if (elems && elems.length > 0) {
            elems[0].focus();
          }
        }
      }
    }, {
      key: "_exitActionableMode",
      value: function _exitActionableMode() {
        this.actionableMode = false;

        if (this.currentItem) {
          DataCollectionUtils.disableAllFocusableElements(this.currentItem, true);

          this._setFocus(this.currentItem, true);
        }
      }
    }, {
      key: "renderComplete",
      value: function renderComplete(items) {
        this.actionableMode = false;

        this._disableAllTabbableElements(items);

        this._restoreCurrentItem(items);
      }
    }, {
      key: "renderSkeletons",
      value: function renderSkeletons(positions) {
        var _this15 = this;

        var skeletons = [];
        positions.forEach(function (position) {
          skeletons.push(_this15._renderSkeleton(position));
        });
        return skeletons;
      }
    }, {
      key: "renderSkeletonsForLoadMore",
      value: function renderSkeletonsForLoadMore(columnsInfo, itemWidth) {
        var _this16 = this;

        var skeletons = [];
        var maxTop = Math.max.apply(Math, _toConsumableArray(columnsInfo.map(function (column) {
          return column.top;
        })));

        if (maxTop > 0) {
          var endPos = maxTop + 100;
          columnsInfo.forEach(function (columnInfo) {
            var position = {
              left: columnInfo.left,
              top: columnInfo.top,
              height: endPos - columnInfo.top,
              width: itemWidth
            };
            skeletons.push(_this16._renderSkeleton(position));
          });
        }

        return skeletons;
      }
    }, {
      key: "_renderSkeleton",
      value: function _renderSkeleton(position) {
        var style;

        if (position == null) {
          style = {
            visibility: 'hidden'
          };
        } else {
          style = {
            top: position.top + 'px',
            left: position.left + 'px',
            height: position.height + 'px'
          };

          if (!isNaN(position.width)) {
            style.width = position.width + 'px';
          }
        }

        return ojvcomponent.h("div", {
          class: 'oj-waterfalllayout-skeleton',
          style: style
        }, ojvcomponent.h("div", {
          class: 'oj-waterfalllayout-skeleton-content oj-animation-skeleton'
        }));
      }
    }]);

    return WaterfallLayout;
  }(ojvcomponent.VComponent);

  exports.WaterfallLayout.gutterWidth = 20;
  exports.WaterfallLayout.metadata = {
    "extension": {
      "_DEFAULTS": Props
    },
    "properties": {
      "data": {
        "type": "object|null",
        "value": null
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
          }
        },
        "writeback": true,
        "readOnly": false
      }
    },
    "slots": {
      "itemTemplate": {}
    }
  };

  __decorate([ojvcomponent.listener()], exports.WaterfallLayout.prototype, "_handleFocusIn", null);

  __decorate([ojvcomponent.listener()], exports.WaterfallLayout.prototype, "_handleFocusOut", null);

  __decorate([ojvcomponent.listener()], exports.WaterfallLayout.prototype, "_handleClick", null);

  __decorate([ojvcomponent.listener()], exports.WaterfallLayout.prototype, "_handlePointerDown", null);

  __decorate([ojvcomponent.listener()], exports.WaterfallLayout.prototype, "_handleKeyDown", null);

  __decorate([ojvcomponent.listener({
    passive: true
  })], exports.WaterfallLayout.prototype, "_touchStartHandler", null);

  __decorate([ojvcomponent.listener()], exports.WaterfallLayout.prototype, "scrollListener", null);

  exports.WaterfallLayout = WaterfallLayout_1 = __decorate([ojvcomponent.customElement('oj-waterfall-layout')], exports.WaterfallLayout);
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});
}())