/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['require', 'ojs/ojcore', 'jquery', 'ojs/ojcontext', 'ojs/ojthemeutils', 'ojs/ojcomponentcore', 'ojs/ojanimation', 'ojs/ojlogger', 'ojs/ojconfig', 'ojs/ojkeyset', 'ojdnd', 'ojs/ojdatacollection-common', 'ojs/ojselector'],
    function(localRequire, oj, $, Context, ThemeUtils, Components, AnimationUtils, Logger, Config, KeySet, DnD, DataCollectionUtils)
{
  "use strict";
var __oj_tree_view_metadata = 
{
  "properties": {
    "currentItem": {
      "type": "any",
      "writeback": true,
      "readOnly": true
    },
    "data": {
      "type": "object"
    },
    "dnd": {
      "type": "object",
      "properties": {
        "drag": {
          "type": "object",
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragStart": {
                  "type": "function"
                },
                "drag": {
                  "type": "function"
                },
                "dragEnd": {
                  "type": "function"
                }
              }
            }
          }
        },
        "drop": {
          "type": "object",
          "properties": {
            "items": {
              "type": "object",
              "properties": {
                "dataTypes": {
                  "type": "string|Array<string>"
                },
                "dragEnter": {
                  "type": "function"
                },
                "dragOver": {
                  "type": "function"
                },
                "dragLeave": {
                  "type": "function"
                },
                "drop": {
                  "type": "function"
                }
              }
            }
          }
        }
      }
    },
    "expanded": {
      "type": "KeySet",
      "writeback": true
    },
    "item": {
      "type": "object",
      "properties": {
        "focusable": {
          "type": "function"
        },
        "renderer": {
          "type": "function"
        },
        "selectable": {
          "type": "function"
        }
      }
    },
    "selected": {
      "type": "KeySet",
      "writeback": true
    },
    "selection": {
      "type": "Array<any>",
      "writeback": true,
      "value": []
    },
    "selectionMode": {
      "type": "string",
      "enumValues": [
        "multiple",
        "none",
        "single"
      ],
      "value": "none"
    },
    "translations": {
      "type": "object",
      "value": {}
    }
  },
  "methods": {
    "getContextByNode": {},
    "refresh": {},
    "setProperty": {},
    "getProperty": {},
    "setProperties": {},
    "getNodeBySubId": {},
    "getSubIdByNode": {}
  },
  "events": {
    "ojAnimateEnd": {},
    "ojAnimateStart": {},
    "ojBeforeCollapse": {},
    "ojBeforeCurrentItem": {},
    "ojBeforeExpand": {},
    "ojCollapse": {},
    "ojExpand": {}
  },
  "extension": {}
};
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }



/* global Set:false, Components:false, Logger:false, ThemeUtils:false, Context:false, Promise:false, Symbol:false, Config:false, localRequire:false, KeySet:false, DataCollectionUtils:false, Map: false, AnimationUtils:false*/

/**
 * @ojcomponent oj.ojTreeView
 * @augments oj.baseComponent
 * @since 4.0.0
 *
 * @ojshortdesc A tree view displays hierarchical relationships between items.
 * @ojrole tree
 * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
 * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet"]}
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["ItemMetadata"]}
 * @ojsignature [{
 *                target: "Type",
 *                value: "class ojTreeView<K, D> extends baseComponent<ojTreeViewSettableProperties<K,D>>",
 *                genericParameters: [{"name": "K", "description": "Type of key of the dataprovider"}, {"name": "D", "description": "Type of data from the dataprovider"}]
 *               },
 *               {
 *                target: "Type",
 *                value: "ojTreeViewSettableProperties<K,D> extends baseComponentSettableProperties",
 *                for: "SettableProperties"
 *               }]
 *
 * @ojpropertylayout {propertyGroup: "common", items: ["selectionMode"]}
 * @ojpropertylayout {propertyGroup: "data", items: ["data", "expanded", "selection"]}
 * @ojvbdefaultcolumns 6
 * @ojvbmincolumns 2
 *
 * @ojuxspecs ['tree-view']
 *
 * @classdesc
 * <h3 id="treeViewOverview-section">
 *   JET TreeView
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#treeViewOverview-section"></a>
 * </h3>
 *
 * <p>The JET TreeView allows a user to display the hierarchical relationship between items.</p>
 *
 * <p>The child content can be configured via inline HTML content or a DataProvider.
 * It is recommended that inline HTML content should only be used for static data and the DataProvider should always be used for mutable data.
 * </p>
 *
 * <h3 id="data-section">
 *   Data
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
 * </h3>
 * <p>The JET TreeView gets its data in two different ways. The first way is from a TreeDataProvider or TreeDataSource.</p>
 * <ul>
 * <li><b>oj.ArrayTreeDataProvider</b> - Use this when the underlying data is an array.
 *  See the documentation for <a href="oj.ArrayTreeDataProvider.html">oj.ArrayTreeDataProvider</a>
 * for more details on the available options.</li>
 * </ul>
 * <p>There are two types of TreeDataSource that are available out of the box:</p>
 * <ul>
 * <li><b>oj.JsonTreeDataSource</b> (deprecated) - Use this when the underlying data is a JSON object.
 * See the documentation for <a href="oj.JsonTreeDataSource.html">oj.JsonTreeDataSource</a>
 * for more details on the available options.</li>
 * <li><b>oj.CollectionTreeDataSource</b> (deprecated) - Use this when oj.Collection is the model for each group of data.
 * See the documentation for <a href="oj.CollectionTreeDataSource.html">oj.CollectionTreeDataSource</a>
 * for more details on the available options.</li>
 * </ul>
 *
 * <p>Example of tree data provider content:</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-tree-view data="[[dataprovider]]">
 * &lt;/oj-tree-view>
 * </code></pre>
 * <p>Check out this <a href="../jetCookbook.html?component=arrayTreeDataProvider&demo=keys">demo</a>.</p>
 *
 * <p>The second way is using static HTML content as data.</p>
 *
 * <p>Example of static content:</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-tree-view id="treeview1">
 *   &lt;ul>
 *     &lt;li>
 *       &lt;a id="group1" href="#">Group 1&lt;/a>
 *       &lt;ul>
 *         &lt;li>&lt;a id="item1-1" href="#">Item 1-1&lt;/a>&lt;/li>
 *         &lt;li>&lt;a id="item1-2" href="#">Item 1-2&lt;/a>&lt;/li>
 *       &lt;/ul>
 *     &lt;/li>
 *     &lt;li>
 *       &lt;a id="group2" href="#">Group 2&lt;/a>
 *       &lt;ul>
 *         &lt;li>&lt;a id="item2-1" href="#">Item 2-1&lt;/a>&lt;/li>
 *         &lt;li>&lt;a id="item2-2" href="#">Item 2-2&lt;/a>&lt;/li>
 *       &lt;/ul>
 *     &lt;/li>
 *   &lt;/ul>
 * &lt;/oj-tree-view>
 * </code></pre>
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
 * <h3 id="context-section">
 *   Item Context
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#context-section"></a>
 * </h3>
 *
 * <p>For item attributes, developers can specify a function as the return value.
 * The function takes a single argument, which is an object that contains contextual
 * information about the particular item. This gives developers the flexibility
 * to return different value depending on the context.</p>
 *
 * <p>The context parameter contains the following keys:</p>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>componentElement</kbd></td>
 *       <td>The TreeView element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>data</kbd></td>
 *       <td>The data object for the item (not available for static content).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>datasource</kbd></td>
 *       <td>A reference to the data source object (not available for static content).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>depth</kbd></td>
 *       <td>The depth of the item. The depth of the first level children under the invisible root is 1.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>index</kbd></td>
 *       <td>The index of the item relative to its parent, where 0 is the index of the first item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>key</kbd></td>
 *       <td>The key of the item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>leaf</kbd></td>
 *       <td>Whether the item is a leaf item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentElement</kbd></td>
 *       <td>The TreeView item element. The renderer can use this to directly append content.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentKey</kbd></td>
 *       <td>The key of the parent item. The parent key is null for root item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>metadata</kbd></td>
 *       <td>The metadata of the item (not available for static content).</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="accessibility-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#accessibility-section"></a>
 * </h3>
 *
 * <p>Application must ensure that the context menu is available and setup with the
 * appropriate clipboard menu items so that keyboard-only users are able to reorder items
 * just by using the keyboard.
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Data Set Size</h4>
 * <p>As a rule of thumb, it is recommended that applications limit the amount of data to display. Displaying large
 * number of items in TreeView makes it hard for user to find what they are looking for, but also affects the load time and
 * scrolling performance as well.</p>
 *
 * <h4>Item Content</h4>
 * <p>TreeView allows developers to specify arbitrary content inside its item. In order to minimize any negative effect on
 * performance, please avoid putting a large number of heavy-weight components inside because as it adds more complexity
 * to the structure, and the effect will be multiplied because there can be many items in the TreeView.</p>
 *
 * <h4>Expand All</h4>
 * <p>While TreeView provides a convenient way to initially expand all parent items in the TreeView, it might have an impact
 * on the initial rendering performance since expanding each parent item might cause a fetch from the server depending on
 * the TreeDataProvider or TreeDataSource. Other factors that could impact performance includes the depth of the tree, and the number of children
 * in each level.</p>
 *
 * <h3 id="animation-section">
 *   Animation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#animation-section"></a>
 * </h3>
 *
 * <p>Applications can customize animations triggered by actions in TreeView by either listening for <code class="prettyprint">animateStart/animateEnd</code>
 *    events or overriding action specific style classes on the animated item.  See the documentation of <a href="oj.AnimationUtils.html">oj.AnimationUtils</a>
 *    class for details.</p>
 *
 * <p>The following are actions and their corresponding sass variables in which applications can use to customize animation effects.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Action</th>
 *       <th>Sass Variable</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>expand</kbd></td>
 *       <td>$treeViewExpandAnimation</td>
 *       <td>When user expands an item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>collapse</kbd></td>
 *       <td>$treeViewCollapseAnimation</td>
 *       <td>When user collapses an item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 */
// --------------------------------------------------- oj.ojTreeView Styling Start -----------------------------------------------------------
// ---------------- oj-treeview-item-text --------------

/**
* Use this class on the span providing the item text in the static markup or the item renderer or template slot.
* @ojstyleclass oj-treeview-item-text
* @ojdisplayname Treeview item text
* @ojstyleselector "oj-tree-view span"
* @memberof oj.ojTreeView
*/

/**
* Use this class on the span providing the item icon in the static markup or the item renderer or template slot.
* @ojstyleclass oj-treeview-item-icon
* @ojdisplayname Treeview item icon
* @ojstyleselector "oj-tree-view span"
* @memberof oj.ojTreeView
*/

/**
* Use this class on any additional icons included in treeview's items to assist with vertical alignment and size.
* @ojstyleclass oj-treeview-item-content-icon
* @ojdisplayname Treeview item content icon
* @memberof oj.ojTreeView
*/
// --------------------------------------------------- oj.ojTreeView Styling End -----------------------------------------------------------
(function () {
  oj.__registerWidget('oj.ojTreeView', $.oj.baseComponent, {
    version: '1.0.0',
    defaultElement: '<div>',
    widgetEventPrefix: 'oj',
    options: {
      /**
       * The key of the item that has the browser focus.
       * This is a read-only attribute so page authors cannot set or change it directly.
       *
       * @expose
       * @public
       * @type {any}
       * @instance
       * @memberof! oj.ojTreeView
       * @ojshortdesc Read-only property used for retrieving the key of the item that currently has focus.
       * @readonly
       * @ojwriteback
       * @ojsignature {target:"Type", value:"K"}
       *
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">current-item</code> attribute specified:</caption>
       * &lt;oj-tree-view current-item='{{myCurrentItem}}'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">currentItem</code> property after initialization:</caption>
       * // getter
       * var currentItemValue = myTreeView.currentItem;
       *
       * // setter
       * myTreeView.currentItem = "item2";
       */
      currentItem: null,

      /**
       * The data source for the TreeView. Accepts an instance of oj.TreeDataProvider or oj.TreeDataSource.
       * See the data source section in the introduction for out of the box data source types.
       * If the data attribute is not specified, the child elements are used as content. If there's no
       * content specified, then an empty list is rendered.
       *
       * @expose
       * @public
       * @type {Object}
       * @instance
       * @memberof! oj.ojTreeView
       * @ojshortdesc Specifies the data for the tree. See the Help documentation for more information.
       * @default null
       * @ojsignature [{target: "Type", value: "oj.TreeDataProvider<K, D>"},
       *               {target: "Type", value: "oj.TreeDataSource|oj.TreeDataProvider", consumedBy:"js"}]
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">data</code> attribute specified:</caption>
       * &lt;oj-tree-view data='{{myDataProvider}}'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
       * // getter
       * var dataValue = myTreeView.data;
       *
       * // setter
       * myTreeView.data = new oj.ArrayTreeDataProvider(myArray);
       */
      data: null,

      /**
       * Enable drag and drop functionality.<br><br>
       * JET provides support for HTML5 Drag and Drop events.  Please refer to {@link https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_and_drop third party documentation}
       * on HTML5 Drag and Drop to learn how to use it.
       *
       * @expose
       * @memberof! oj.ojTreeView
       * @ojshortdesc Customizes the drag and drop functionality. See the Help documentation for more information.
       * @type {Object}
       * @instance
       */
      dnd: {
        /**
         * @expose
         * @alias dnd.drag
         * @memberof! oj.ojTreeView
         * @ojshortdesc Customizes the drag functionality.
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         * @default null
         * @property {Object} items If this object is specified, TreeView will initiate drag operation when the user drags on an item.
         * @property {string|Array.<string>} [items.dataTypes] The MIME types to use for the dragged data in the dataTransfer object. This can be a string if there is only one
         * type, or an array of strings if multiple types are needed.<br><br>
         * For example, if selected items of employee data are being dragged, dataTypes could be "application/employees+json". Drop targets can examine the data types and decide
         * whether to accept the data. A text input may only accept "text" data type, while a chart for displaying employee data may be configured to accept the "application/employees+json" type.<br><br>
         * For each type in the array, dataTransfer.setData will be called with the specified type and the JSON version of the selected item data as the value. The selected item data
         * is an array of objects, with each object representing a model object from the underlying data source. For example, if the underlying data is an oj.Collection, then this
         * would be a oj.Model object. Note that when static HTML is used, then the value would be the HTML string of the selected item.<br><br>
         * This property is required unless the application calls setData itself in a dragStart callback function.
         * @property {function(Event, {items: Array.<D>}):void} [items.dragStart] A callback function that receives the "dragstart" event and context information as its arguments.<br><br>
         * <code class="prettyprint">function(event, context)</code><br><br>
         * All of the event payloads listed below can be found under the <code class="prettyprint">context</code> argument.
         * <ul><li><code class="prettyprint">items</code>: An array of objects, with each object representing the data of one selected item.</li></ul><br>
         * This function can set its own data and drag image as needed. If dataTypes is specified, event.dataTransfer is already populated with the default data when this function is invoked.
         * If dataTypes is not specified, this function must call event.dataTransfer.setData to set the data or else the drag operation will be cancelled. In either case, the drag image is
         * set to an image of the dragged items on the TreeView.
         * @property {function(Event):void} [items.drag] A callback function that receives the "drag" event as its argument.<br><br>
         * @property {function(Event):void} [items.dragEnd] A callback function that receives the "dragend" event as its argument.<br><br>
         *
         * @ojsignature {target: "Type",
         *               value: "?((event: Event, context: {items: Array<D>}) => void)",
         *               for: "items.dragStart"}
         *
         * @example <caption>Initialize the TreeView such that only leaf items are focusable:</caption>
         * myTreeView.setProperty('dnd.drag.items', {
         *   'dataTypes': ['application/ojtreeviewitems+json'],
         *   'dragEnd': handleDragEnd
         * });
         */
        drag: null,

        /**
         * @typedef {Object} oj.ojTreeView.ItemsDropOnDropContext
         * @property {Element} item The item being dropped on.
         * @property {'inside'|'before'|'after'|'first'} position The drop position relative to the item being dropped on.
         */

        /**
         * @expose
         * @alias dnd.drop
         * @memberof! oj.ojTreeView
         * @ojshortdesc Customizes the drop functionality.
         * @instance
         * @type {Object}
         * @ojsignature {target: "Type", value: "?"}
         * @default null
         * @property {Object} items  An object that specifies callback functions to handle dropping items<br><br>
         * @property {string|Array.<string>} [items.dataTypes] A data type or an array of data types this component can accept.<br><br>
         * This property is required unless dragEnter, dragOver, and drop callback functions are specified to handle the corresponding events.
         * @property {function(Event, {item: Element}):void} [items.dragEnter] A callback function that receives the "dragenter" event and context information as its arguments.<br><br>
         * <code class="prettyprint">function(event, context)</code><br><br>
         * All of the event payloads listed below can be found under the <code class="prettyprint">context</code> argument.
         * <ul><li><code class="prettyprint">item</code>: The item being entered.</li></ul><br>
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
         * Otherwise, dataTypes will be matched against the drag dataTypes to determine if the data is acceptable. If there is a match, <code class="prettyprint">event.preventDefault()</code>
         * will be called to indicate that the data can be accepted.
         * @property {function(Event, {item: Element}):void} [items.dragOver] A callback function that receives the "dragover" event and context information as its arguments.<br><br>
         * <code class="prettyprint">function(event, context)</code><br><br>
         * All of the event payloads listed below can be found under the <code class="prettyprint">context</code> argument.
         * <ul><li><code class="prettyprint">item</code>: The item being dragged over.</li></ul><br>
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.
         * Otherwise, dataTypes will be matched against the drag dataTypes to determine if the data is acceptable. If there is a match, <code class="prettyprint">event.preventDefault()</code>
         * will be called to indicate that the data can be accepted.
         * @property {function(Event, {item: Element}):void} [items.dragLeave] A callback function that receives the "dragleave" event and context information as its arguments.<br><br>
         * <code class="prettyprint">function(event, context)</code><br><br>
         * All of the event payloads listed below can be found under the <code class="prettyprint">context</code> argument.
         * <ul><li><code class="prettyprint">item</code>: The item that was last entered.</li></ul><br>
         * @property {function(Event, oj.ojTreeView.ItemsDropOnDropContext):void} items.drop A required callback function that receives the "drop" event and context information as its arguments.<br><br>
         * <code class="prettyprint">function(event, context)</code><br><br>
         * All of the event payloads listed below can be found under the <code class="prettyprint">context</code> argument.
         * <ul><li><code class="prettyprint">item</code>: The item being dropped on.</li>
         * <li><code class="prettyprint">position</code>: The drop position relative to the item being dropped on.
         * Valid values are "inside", "before", "after", and "first" (the first child of the item being dropped on).</li></ul><br>
         * This function should call <code class="prettyprint">event.preventDefault()</code> to indicate the dragged data can be accepted.<br><br>
         * If the application needs to look at the data for the item being dropped on, it can use the <code class="prettyprint">getContextByNode</code> method.
         *
         * @ojsignature [{target: "Type",
         *                value: "?((event: Event, context: {item: Element}) => void)",
         *                for: "items.dragEnter"},
         *               {target: "Type",
         *                value: "?((event: Event, context: {item: Element}) => void)",
         *                for: "items.dragOver"},
         *               {target: "Type",
         *                value: "?((event: Event, context: {item: Element}) => void)",
         *                for: "items.dragLeave"}]
         *
         *
         * @example <caption>Initialize the TreeView such that only leaf items are focusable:</caption>
         * myTreeView.setProperty('dnd.drop.items', {
         *   'dataTypes': ['application/ojtreeviewitems+json'],
         *   'drop': handleDrop
         * });
         */
        drop: null
      },

      /**
       * Specifies the key set containing the keys of the TreeView items that should be expanded.
       * Use the <a href="KeySetImpl.html">KeySetImpl</a> class to specify items to expand.
       * Use the <a href="AllKeySetImpl.html">AllKeySetImpl</a> class to expand all items.
       *
       * @expose
       * @memberof! oj.ojTreeView
       * @ojshortdesc Specifies the key set containing the keys of the items that should be expanded. See the Help documentation for more information.
       * @instance
       * @type {KeySet}
       * @default new KeySet()
       * @ojwriteback
       * @ojsignature {target:"Type", value:"KeySet<K>"}
       *
       * @example <caption>Initialize the TreeView with some expanded items:</caption>
       * myTreeView.expanded = new KeySet.KeySetImpl(['item1', 'item2']);
       *
       * @example <caption>Initialize the TreeView with all items expanded:</caption>
       * myListView.expanded = new KeySet.AllKeySetImpl();
       */
      expanded: new KeySet.KeySetImpl(),

      /**
       * The item attribute contains a subset of attributes for items.
       *
       * @expose
       * @memberof! oj.ojTreeView
       * @ojshortdesc Customizes the functionality of each item in the tree.
       * @type {Object}
       * @instance
       */
      item: {
        // TODO: Add data provider to item context

        /**
         * @typedef {Object} oj.ojTreeView.ItemContext
         * @property {Element} componentElement The TreeView element.
         * @property {D} [data] The data object of the item (not available for static content).
         * @property {number} depth The depth of the item. The depth of the first level children under the invisible root is 1.
         * @property {number} index The index of the item relative to its parent, where 0 is the index of the first item.
         * @property {K} key The key of the item.
         * @property {boolean} leaf Whether the item is a leaf item.
         * @property {Element} parentElement The TreeView item element. The renderer can use this to directly append content.
         * @property {K} [parentKey] The key of the parent item (not available for root item).
         * @property {oj.ItemMetadata<K>} metadata The metadata of the item (not available for static content).
         * @ojsignature {target:"Type", value:"<K,D>", for:"genericTypeParameters"}
         */

        /**
         * A function that returns whether the item is focusable.
         * A item that is not focusable cannot be clicked on or navigated to.
         * See <a href="#context-section">itemContext</a> in the introduction
         * to see the object passed into the focusable function.
         * If no function is specified, then all the items will be focusable.
         *
         * @expose
         * @alias item.focusable
         * @ojshortdesc Specifies whether the item can receive keyboard focus. See the Help documentation for more information.
         * @memberof! oj.ojTreeView
         * @instance
         * @type {function(Object):boolean|null}
         * @ojsignature {target: "Type",
         *               value: "?((itemContext: oj.ojTreeView.ItemContext<K,D>) => boolean)",
         *               jsdocOverride: true}
         * @default null
         *
         * @example <caption>Initialize the TreeView such that only leaf items are focusable:</caption>
         * myTreeView.setProperty('item.focusable', function(itemContext)
         * {
         *   return itemContext['leaf'];
         * });
         */
        focusable: null,

        /**
         * The renderer function that renders the contents of the item. See <a href="#context-section">itemContext</a>
         * in the introduction to see the object passed into the renderer function.
         * The function should return one of the following:
         * <ul>
         *   <li>An Object with the following property:
         *     <ul><li>insert: HTMLElement | string - A string or a DOM element of the content inside the item.</li></ul>
         *   </li>
         *   <li>Nothing: If the developer chooses to manipulate the item element directly, the function should return nothing.</li>
         * </ul>
         *
         * @expose
         * @alias item.renderer
         * @ojshortdesc Specifies the renderer for the item. See the Help documentation for more information.
         * @memberof! oj.ojTreeView
         * @instance
         * @type {function(Object):Object|null}
         * @ojsignature {target: "Type",
         *               value: "?((itemContext: oj.ojTreeView.ItemContext<K,D>) => {insert: Element|string}|void)|null",
         *               jsdocOverride: true}
         * @default null
         *
         * @example <caption>Initialize the TreeView with a renderer:</caption>
         * &lt;oj-tree-view item.renderer='{{myRendererFunc}}'>&lt;/oj-tree-view>
         *
         * @example <caption>Get or set the <code class="prettyprint">renderer</code> property after initialization:</caption>
         * // getter
         * var renderer = myTreeView.item.renderer;
         *
         * // setter
         * myTreeView.item.renderer = myRendererFunc;
         */
        renderer: null,

        /**
         * A function that returns whether the item can be selected.
         * If selectionMode is set to "none" this attribute is ignored.
         * In addition, if focusable is set to false, then the selectable
         * option is automatically overridden and set to false also.
         * See <a href="#context-section">itemContext</a> in the introduction
         * to see the object passed into the selectable function.
         * If no function is specified, then all the items will be selectable.
         *
         * @expose
         * @alias item.selectable
         * @ojshortdesc Specifies whether the item can be selected. See the Help documentation for more information.
         * @memberof! oj.ojTreeView
         * @instance
         * @type {function(Object):boolean|null}
         * @ojsignature {target: "Type",
         *               value: "?((itemContext: oj.ojTreeView.ItemContext<K,D>) => boolean)",
         *               jsdocOverride: true}
         * @default null
         *
         * @example <caption>Initialize the TreeView with the <code class="prettyprint">selectable</code> attribute specified:</caption>
         * &lt;oj-tree-view item.selectable='{{mySelectableFunc}}'>&lt;/oj-tree-view>
         *
         * @example <caption>Get or set the <code class="prettyprint">selectable</code> property after initialization:</caption>
         * // getter
         * var selectable = myTreeView.item.selectable;
         *
         * // setter
         * myTreeView.item.selectable = mySelectableFunc;
         */
        selectable: null
      },

      /**
       * The KeySet of the current selected items in the TreeView. An empty KeySet indicates nothing is selected.
       * Note that property change event for the deprecated selection property will still be fired when
       * selected property has changed. In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set
       * can be used to represent an select all state. In this case, the value for selection would have an
       * 'inverted' property set to true, and would contain the keys of the items that are not selected.
       *
       * @ojshortdesc Specifies the keys of the current selected items. See the Help documentation for more information.
       * @expose
       * @memberof! oj.ojTreeView
       * @instance
       * @default new KeySetImpl();
       * @type {KeySet}
       * @ojsignature {target:"Type", value:"KeySet<K>"}
       * @ojwriteback
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">selected</code> attribute specified:</caption>
       * &lt;oj-tree-view selected='{{mySelectedItemsKeySet}}'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selected</code> property after initialization:</caption>
       * // getter
       * var selectedValue = myTreeView.selected;
       *
       * // setter
       * myTreeView.selected = ['item1', 'item2', 'item3'];
       */
      selected: new KeySet.KeySetImpl(),

      /**
       * The current selections in the TreeView. An empty array indicates nothing is selected.
       *
       * @expose
       * @memberof! oj.ojTreeView
       * @ojshortdesc Specifies the current selections in the tree. An empty array indicates nothing is selected.
       * @instance
       * @type {Array.<any>}
       * @default []
       * @ojwriteback
       * @ojeventgroup common
       *
       * @ojsignature {target:"Type", value:"Array<K>"}
       * @ojdeprecated {since: '8.0.0', description: 'Use selected attribute instead.'}
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">selection</code> attribute specified:</caption>
       * &lt;oj-tree-view selection='{{mySelection}}'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selection</code> property after initialization:</caption>
       * // getter
       * var selectionValue = myTreeView.selection;
       *
       * // setter
       * myTreeView.selection = ['item1', 'item2', 'item3'];
       */
      selection: [],

      /**
       * <p>The type of selection behavior that is enabled on the TreeView. This attribute controls the number of selections that can be made via selection gestures at any given time.
       *
       * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the TreeView's selection styling will be applied to all items specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
       * If <code class="prettyprint">multiple</code> is specified <a href="oj.ojSelector.html">oj-selectors</a> will also be rendered by default.
       * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the TreeView's selection styling will not be applied to any items specified by the <a href="#selection">selection</a> and <a href="#selected">selected</a> attributes.
       *
       * <p>Changing the value of this attribute will not affect the value of the <a href="#selection">selection</a> or <a href="#selected">selected</a> attributes.
       *
       * @expose
       * @memberof! oj.ojTreeView
       * @ojshortdesc Specifies the selection mode.
       * @instance
       * @type {string}
       * @default "none"
       * @ojvalue {string} "none" Selection is disabled.
       * @ojvalue {string} "single" Only a single item can be selected at a time.
       * @ojvalue {string} "multiple" Multiple items can be selected at the same time.
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">selection-mode</code> attribute specified:</caption>
       * &lt;oj-tree-view selection-mode='multiple'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">selectionMode</code> property after initialization:</caption>
       * // getter
       * var selectionModeValue = myTreeView.selectionMode;
       *
       * // setter
       * myTreeView.selectionMode = 'multiple';
       */
      selectionMode: 'none',
      // Events

      /**
       * Triggered when the default animation of a particular action has ended.
       * Note this event will not be triggered if application cancelled the default animation on animateStart.
       *
       * @expose
       * @event
       * @memberof oj.ojTreeView
       * @ojshortdesc Triggered when the default animation of a particular action has ended.
       * @instance
       * @property {'expand'|'collapse'} action The action that triggers the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
       * @property {Element} element The target of animation.
       */
      animateEnd: null,

      /**
       * Triggered when the default animation of a particular action is about to start.
       * The default animation can be cancelled by calling <code class="prettyprint">event.preventDefault()</code>.
       *
       * @expose
       * @event
       * @memberof oj.ojTreeView
       * @ojshortdesc Triggered when the default animation of a particular action is about to start.
       * @instance
       * @property {'expand'|'collapse'} action The action that triggered the animation.<br><br>See <a href="#animation-section">animation</a> section for a list of actions.
       * @property {Element} element The target of animation.
       * @property {function():void} endCallback If the event listener calls <code class="prettyprint">event.preventDefault()</code> to cancel the default animation, it must call the endCallback function when it finishes its own animation handling and when any custom animation ends.
       */
      animateStart: null,

      /**
       * Triggered before an item is collapsed via the <code class="prettyprint">expanded</code> attribute or via the UI.
       * Call <code class="prettyprint">event.preventDefault()</code> to veto the event, which prevents collapsing the item.
       *
       * @expose
       * @event
       * @ojcancelable
       * @memberof oj.ojTreeView
       * @ojshortdesc Triggered before an item is collapsed.
       * @instance
       * @property {any} key The key of the item to be collapsed.
       * @property {Element} item The item to be collapsed.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      beforeCollapse: null,

      /**
       * Triggered before the current item is changed via the <code class="prettyprint">currentItem</code> attribute or via the UI.
       * Call <code class="prettyprint">event.preventDefault()</code> to veto the event, which prevents changing the current item.
       *
       * @expose
       * @event
       * @ojcancelable
       * @memberof oj.ojTreeView
       * @ojshortdesc Triggered before the current item is changed.
       * @instance
       * @property {any} previousKey The key of the previous item.
       * @property {Element} previousItem The previous item.
       * @property {any} key The key of the new current item.
       * @property {Element} item The new current item.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"previousKey"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      beforeCurrentItem: null,

      /**
       * Triggered before an item is expanded via the <code class="prettyprint">expanded</code> attribute or via the UI.
       * Call <code class="prettyprint">event.preventDefault()</code> to veto the event, which prevents expanding the item.
       *
       * @expose
       * @event
       * @ojcancelable
       * @memberof oj.ojTreeView
       * @ojshortdesc Triggered before an item is expanded.
       * @instance
       * @property {any} key The key of the item to be expanded.
       * @property {Element} item The item to be expanded.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      beforeExpand: null,

      /**
       * Triggered after an item has been collapsed.
       *
       * @expose
       * @event
       * @memberof oj.ojTreeView
       * @instance
       * @property {any} key The key of the item that was just collapsed.
       * @property {Element} item The item that was just collapsed.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      collapse: null,

      /**
       * Triggered after an item has been expanded.
       *
       * @expose
       * @event
       * @memberof oj.ojTreeView
       * @instance
       * @property {any} key The key of the item that was just expanded.
       * @property {Element} item The item that was just expanded.
       * @ojsignature [{target:"Type", value:"<K>", for:"genericTypeParameters"},
       *               {target:"Type", value:"K", for:"key"}]
       */
      expand: null
    },
    classNames: {
      depth0: 'oj-treeview-depth-0',
      depth1: 'oj-treeview-depth-1',
      depth2: 'oj-treeview-depth-2',
      depth3: 'oj-treeview-depth-3',
      depth4: 'oj-treeview-depth-4',
      depth5: 'oj-treeview-depth-5',
      depth6: 'oj-treeview-depth-6',
      depth7: 'oj-treeview-depth-7',
      depth8: 'oj-treeview-depth-8',
      depth9: 'oj-treeview-depth-9',
      depth10: 'oj-treeview-depth-10',
      depth11: 'oj-treeview-depth-11',
      depth12: 'oj-treeview-depth-12',
      depth13: 'oj-treeview-depth-13',
      depth14: 'oj-treeview-depth-14',
      depth15: 'oj-treeview-depth-15'
    },
    constants: {
      MAX_STYLE_DEPTH: 15
    },
    // @inheritdoc
    _ComponentCreate: function _ComponentCreate() {
      this._super();
    },
    // @inheritdoc
    _AfterCreate: function _AfterCreate() {
      this._super();

      this._initRender();

      this._render();
    },
    // @inheritdoc
    _CompareOptionValues: function _CompareOptionValues(option, value1, value2) {
      switch (option) {
        case 'selection':
          if (value1 && value1.inverted === undefined) {
            // eslint-disable-next-line no-param-reassign
            value1.inverted = false;
          }

          if (value2 && value2.inverted === undefined) {
            // eslint-disable-next-line no-param-reassign
            value2.inverted = false;
          }

          if (value1 && value2 && value1.inverted !== value2.inverted) {
            return false;
          }

          return oj.Object.compareValues(value1, value2);

        case 'selected':
          return DataCollectionUtils.areKeySetsEqual(value1, value2);

        default:
          return this._super(option, value1, value2);
      }
    },

    /**
     * Initializes the TreeView.
     * @private
     */
    _initRender: function _initRender() {
      var self = this; // Event listeners
      // Event listeners

      this._on(this.element, {
        click: function click(event) {
          self._handleClick(event);
        },
        mouseover: function mouseover(event) {
          self._handleMouseOver(event);
        },
        mouseout: function mouseout(event) {
          self._handleMouseOut(event);
        },
        mousedown: function mousedown(event) {
          self._handleMouseDown(event);
        },
        mouseup: function mouseup(event) {
          self._handleMouseUp(event);
        },
        keydown: function keydown(event) {
          self._handleKeyDown(event);
        },
        dragstart: function dragstart(event) {
          self._handleDragStart(event);
        },
        drag: function drag(event) {
          self._handleDragSourceEvent(event, 'drag');
        },
        dragend: function dragend(event) {
          self._handleDragSourceEvent(event, 'dragEnd');
        },
        dragenter: function dragenter(event) {
          self._handleDropTargetEvent(event, 'dragEnter');
        },
        dragover: function dragover(event) {
          self._handleDropTargetEvent(event, 'dragOver');
        },
        dragleave: function dragleave(event) {
          self._handleDropTargetEvent(event, 'dragLeave');
        },
        drop: function drop(event) {
          self._handleDropTargetEvent(event, 'drop');
        }
      });

      if (oj.DomUtils.isTouchSupported()) {
        this.element[0].addEventListener('touchstart', function (event) {
          self.touchStartEvent = event;
        }, {
          passive: true
        });
        this.element[0].addEventListener('touchmove', function () {
          if (self.ojTreeViewDragEvent === true) {
            document.body.style.touchAction = 'none';
          } else {
            document.body.style.touchAction = 'auto';
          }
        }, {
          passive: false
        });
        this.element[0].addEventListener('touchcancel', function () {
          self.touchStartEvent = null;
          self.ojTreeViewDragEvent = false;
        });
        this.element[0].addEventListener('touchend', function (event) {
          if (self.touchStartEvent && event.changedTouches.length) {
            var overElem = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

            if (overElem !== self.touchStartEvent.target) {
              self.touchStartEvent = null;
            }
          }

          self.ojTreeViewDragEvent = false;

          self._handleMouseOut(event);
        });
      }

      this._dropLine = document.createElement('div');

      this._dropLine.classList.add('oj-treeview-drop-line');

      this.element[0].appendChild(this._dropLine); // HTMLUpdateOk

      this._dropLineRect = this._dropLine.getBoundingClientRect();
      this._dropLine.style.display = 'none';
      this._refreshId = 0;
      this._uiExpanded = new KeySet.KeySetImpl();
      this._expandedChildrenMap = new Map();

      this._syncSelectionState();
    },

    /**
    * Syncs initial selection state with selected being source of truth
    * @private
    */
    _syncSelectionState: function _syncSelectionState() {
      var selectedArray = KeySet.KeySetUtils.toArray(this.options.selected);
      var selectionKeySet = KeySet.KeySetUtils.toKeySet(this.options.selection);

      if (selectedArray.length > 0 || selectedArray.inverted) {
        this._userOptionChange('selection', selectedArray, null);
      } else if (this.options.selection.length > 0 || this.options.selection.inverted) {
        this._userOptionChange('selected', selectionKeySet, null);
      }
    },

    /**
     * Renders the TreeView.
     * @private
     */
    _render: function _render() {
      var self = this;
      this.element[0].classList.remove('oj-complete');
      this._keyList = new Set(); // list of existing node keys

      var ulElementList = this.element[0].getElementsByTagName('ul');
      var i;

      if (this.options.data) {
        for (i = 0; i < ulElementList.length; i++) {
          ulElementList[i].parentNode.removeChild(ulElementList[i]);
        }

        this._fetchChildren(null, function (response) {
          var fetchListResult = response.values[0];
          var params = {
            fetchListResult: fetchListResult.value,
            parentElem: self.element[0]
          };

          self._renderItems(params).then(function () {
            self._resetFocus();

            self.element[0].classList.add('oj-complete');

            self._decorateTree();

            self._lastSelectedItem = null;
          });
        });
      } else {
        for (i = 0; i < ulElementList.length; i++) {
          ulElementList[i].classList.add('oj-treeview-list');
          ulElementList[i].setAttribute('role', 'group');
        }

        var liElementList = this.element[0].getElementsByTagName('li');

        for (i = 0; i < liElementList.length; i++) {
          var itemContent = this._getItemContent(liElementList[i]);

          if (itemContent) {
            var disclosureIcon = itemContent.getElementsByClassName('oj-treeview-spacer')[0];

            if (disclosureIcon) {
              itemContent.removeChild(disclosureIcon);
            }
          }

          self._decorateItem(liElementList[i]);
        }

        this._resetFocus();

        this.element[0].classList.add('oj-complete');

        this._decorateTree();

        this._lastSelectedItem = null;
      }
    },
    _getDataProvider: function _getDataProvider() {
      var self = this;
      var data;

      if (self.m_dataSource == null) {
        data = self.options.data;

        if (!oj.DataProviderFeatureChecker.isTreeDataProvider(data)) {
          var adapterPromise = oj.__getRequirePromise('./ojtreedataprovideradapter', localRequire);

          if (!adapterPromise) {
            throw new Error('Cannot adapt a TreeDataSource if require() is not available');
          }

          return adapterPromise.then(function (TreeDataSourceAdapter) {
            return new TreeDataSourceAdapter(data);
          });
        }
      } else {
        data = self.m_dataSource;
      }

      return Promise.resolve(data);
    },

    /**
     * Fetch the children of a parent item from the data source.
     * @param {string} parentKey The key of the parent item.
     * @param {Function} successFunc The function to be called if the fetch is successful.
     * @private
     */
    _fetchChildren: function _fetchChildren(parentKey, successFunc) {
      var self = this;

      var dataProviderPromiseBusyResolve = self._addBusyState('getting data provider');

      var dataProviderPromise = self._getDataProvider();

      var refreshing = this._refreshId;
      dataProviderPromise.then(function (dataProvider) {
        dataProviderPromiseBusyResolve(); // bail out of the fetch if the component was refreshed

        if (self._refreshId !== refreshing) {
          return;
        }

        self.m_dataSource = dataProvider;
        var childDataProvider = parentKey === null ? dataProvider : dataProvider.getChildDataProvider(parentKey);

        if (childDataProvider != null) {
          var busyResolve = self._addBusyState('fetching data');

          var delay = self._getShowStatusDelay();

          if (self._isSkeletonSupported()) {
            self._skeletonTimeout = setTimeout(function () {
              var rootMap = self._expandedChildrenMap.get(null);

              if (parentKey === null) {
                self._renderInitialSkeletons();
              } else if (!rootMap && !self._isParentSkeletonRendered(parentKey)) {
                var parentItem = self._getItemByKey(parentKey);

                var parentSubtree = self._getSubtree(parentItem);

                if (!parentSubtree) {
                  self._renderChildSkeletons(parentKey);
                }
              }
            }, delay);
          }

          var enginePromise = self._loadTemplateEngine(); // Create a clientId symbol that uniquely identify this consumer so that
          // DataProvider which supports it can optimize resources


          self._clientId = self._clientId || Symbol(); // size -1 to fetch all rows

          var options = {
            clientId: self._clientId,
            size: -1
          };
          var dataProviderAsyncIterator = childDataProvider.fetchFirst(options)[Symbol.asyncIterator]();
          var promise = dataProviderAsyncIterator.next(); // new helper function to be called in recursion to fetch all data.

          var helperFunction = function helperFunction(values) {
            // skip additional fetching if done
            if (values[0].done) {
              self._clearSkeletonTimeout();

              if (self._isSkeletonSupported()) {
                var expandedChildren = [];
                var children = values[0].value.data;

                for (var i = 0; i < children.length; i++) {
                  var childKey = values[0].value.metadata[i].key;

                  if (self._isInitExpanded(childKey) && self.m_dataSource.getChildDataProvider(childKey)) {
                    expandedChildren.push(childKey);
                  }
                }

                self._expandedChildrenMap.set(parentKey, expandedChildren);

                var currentExpandedChildren = self._expandedChildrenMap.get(parentKey);

                if (currentExpandedChildren) {
                  var index = currentExpandedChildren.indexOf(parentKey);

                  if (index > -1) {
                    currentExpandedChildren.splice(index, 1);
                  }
                }

                if (!currentExpandedChildren || currentExpandedChildren.length === 0) {
                  return {
                    values: values,
                    shouldRemoveSkeleton: true
                  };
                }
              }

              return {
                values: values,
                shouldRemoveSkeleton: false
              };
            }

            var nextPromise = dataProviderAsyncIterator.next();
            var fetchMoreData = nextPromise.then(function (value) {
              // bail out of the fetch if the component was refreshed
              if (self._refreshId !== refreshing) {
                return null;
              } // eslint-disable-next-line no-param-reassign


              values[0].done = value.done; // eslint-disable-next-line no-param-reassign

              values[0].value.data = values[0].value.data.concat(value.value.data); // eslint-disable-next-line no-param-reassign

              values[0].value.metadata = values[0].value.metadata.concat(value.value.metadata);
              return helperFunction(values);
            }, function (reason) {
              Logger.error('Error fetching data: ' + reason);
              busyResolve();
            });
            return fetchMoreData;
          };

          Promise.all([promise, enginePromise]).then(function (values) {
            // bail out of the fetch if the component was refreshed
            if (self._refreshId !== refreshing) {
              return null;
            }

            return helperFunction(values);
          }, function (reason) {
            Logger.error('Error fetching data: ' + reason);
            busyResolve();
          }).then(function (values) {
            // bail out of the fetch if the component was refreshed
            if (self._refreshId !== refreshing) {
              busyResolve();
              return;
            }

            successFunc(values);
            busyResolve();
          });
        }
      }, function (reason) {
        Logger.error('Error fetching data: ' + reason);
        dataProviderPromiseBusyResolve();
        self._expandedChildrenMap = new Map();
      });
    },
    _clearSkeletonTimeout: function _clearSkeletonTimeout() {
      if (this._skeletonTimeout) {
        clearTimeout(this._skeletonTimeout);
        this._skeletonTimeout = null;
      }
    },
    _isParentSkeletonRendered: function _isParentSkeletonRendered(key) {
      var item = this._getItemByKey(key);

      var parents = this._getParents(item, '.oj-treeview-item');

      for (var i = 0; i < parents.length; i++) {
        var parentKey = this._getKey(parents[i]);

        var parentMapEntry = this._expandedChildrenMap.get(parentKey);

        if (parentMapEntry) {
          return true;
        }
      }

      return false;
    },
    _getShowStatusDelay: function _getShowStatusDelay() {
      var defaultOptions = this._getOptionDefaults();

      var delay = parseInt(defaultOptions.showIndicatorDelay, 10);
      return isNaN(delay) ? 0 : delay;
    },

    /**
     * Render the TreeView items after the data is fetched.
     * @param {Object} params An object containing parameters relevant for rendering.
     * @private
     */
    _renderItems: function _renderItems(params) {
      return new Promise(function (resolve) {
        var ulElem = document.createElement('ul');
        ulElem.classList.add('oj-treeview-list');
        ulElem.setAttribute('role', 'group');

        var skeletonContainer = this._getSkeletonContainer(this.element[0]);

        if (skeletonContainer && this._isSkeletonSupported()) {
          ulElem.style.display = 'none';
        }

        params.parentElem.appendChild(ulElem); // @HTMLUpdateOK

        for (var i = 0; i < params.fetchListResult.data.length; i++) {
          this._renderItem(ulElem, params.fetchListResult, i);
        }

        if (skeletonContainer && this._isSkeletonSupported()) {
          this._toggleParentDisplay(params.parentElem, resolve);
        } else {
          resolve();
        }
      }.bind(this));
    },

    /**
     * Recursively walks _expandedChildrenMap to see if it needs to toggle the parents display style if all expanded children have been fetched.
     * @param {Element} item The item element.
     * @param {Function} resolve The function to resolve the rendering busy state.
     * @private
     */
    _toggleParentDisplay: function _toggleParentDisplay(item, resolve) {
      var itemKey = this._getKey(item);

      if (item === this.element[0]) {
        itemKey = null;
      }

      var childExpandedKeys = this._expandedChildrenMap.get(itemKey);

      if (childExpandedKeys && childExpandedKeys.length > 0) {
        resolve();
      } else {
        var key = null; // eslint-disable-next-line no-restricted-syntax

        var _iterator = _createForOfIteratorHelper(this._expandedChildrenMap.keys()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            key = _step.value;

            var parentExpandedChildren = this._expandedChildrenMap.get(key);

            var keyItem;
            var subtree;

            if (key === null) {
              keyItem = this.element[0];
              subtree = this._getRoot();
            } else {
              keyItem = this._getItemByKey(key);
              subtree = this._getSubtree(keyItem);

              this._setItemExpanded(keyItem);
            }

            if (subtree && parentExpandedChildren.length === 0) {
              this._resolveNoChildren(key, keyItem, subtree, resolve);
            }

            for (var i = parentExpandedChildren.length - 1; i >= 0; i--) {
              if (parentExpandedChildren[i] === itemKey) {
                if (subtree) {
                  parentExpandedChildren.splice(i, 1);

                  if (parentExpandedChildren.length === 0) {
                    this._resolveNoChildren(key, keyItem, subtree, resolve);
                  }
                }
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        resolve();
      }
    },

    /**
     * Removes skeleton after it has been found.
     * @param {Object} key The key of the item where the skeleton is.
     * @param {Element} keyItem The Element the key belongs to.
     * @param {Element} subtree The subtree ul element.
     * @param {Function} resolve The function to resolve the rendering busy state.
     * @private
     */
    _resolveNoChildren: function _resolveNoChildren(key, keyItem, subtree, resolve) {
      this._expandedChildrenMap.delete(key);

      var skeletonContainer = this._getSkeletonContainer(keyItem);

      if (skeletonContainer) {
        this._foundSkeleton(key, subtree, resolve);
      } else {
        if (subtree) {
          // eslint-disable-next-line no-param-reassign
          subtree.style.display = 'block';
        }

        this._toggleParentDisplay(keyItem, resolve);
      }
    },

    /**
     * Removes skeleton after it has been found.
     * @param {Object} key The key of the item where the skeleton is.
     * @param {Element} subtree The subtree ul element.
     * @param {Function} resolve The function to resolve the rendering busy state.
     * @private
     */
    _foundSkeleton: function _foundSkeleton(key, subtree, resolve) {
      var skeletonRemovedPromise = this._removeSkeleton(key);

      skeletonRemovedPromise.then(function () {
        if (subtree) {
          // eslint-disable-next-line no-param-reassign
          subtree.style.display = 'block';
        }

        var defaults = this._getOptionDefaults();

        AnimationUtils.fadeIn(subtree, {
          duration: defaults.dataFadeInDuration
        });
        resolve();
      }.bind(this));
    },

    /**
     * Render a TreeView item after the data is fetched.
     * @param {Element} ulElem The <ul> to attach the item to.
     * @param {oj.FetchListResult} fetchListResult The array of item data returned by the data source.
     * @param {number} index The index of the item.
     * @param {boolean} replace Coming from change mutation event.
     * @private
     */
    _renderItem: function _renderItem(ulElem, fetchListResult, index, insertIndex, replace) {
      var self = this;
      var i;
      var textWrapper; // eslint-disable-next-line no-param-reassign
      // index += nodeSet.getStart();

      var data = fetchListResult.data[index];
      var metadata = fetchListResult.metadata[index];
      var key = metadata.key; // Prevent infinite recursion due to duplicated keys ()

      if (!replace) {
        if (this._keyList.has(key)) {
          throw new Error('JET TreeView nodes should not have duplicated keys: ' + key);
        }

        this._keyList.add(key);
      }

      var liElem = document.createElement('li');
      liElem.setAttribute('id', key);

      if (replace) {
        var oldElem = this._getItemByKey(key);

        if (oldElem) {
          // eslint-disable-next-line no-param-reassign
          ulElem = oldElem.parentNode;

          var oldSubtree = this._getSubtree(oldElem);

          oldElem.parentNode.replaceChild(liElem, oldElem);
        } else {
          return; // nothing to replace
        }
      } else if (insertIndex == null || insertIndex >= ulElem.children.length) {
        ulElem.appendChild(liElem); // @HTMLUpdateOK
      } else {
        ulElem.insertBefore(liElem, ulElem.children[insertIndex]); // @HTMLUpdateOK
      }

      var context = {};
      context.parentElement = $(liElem);
      context.index = index;
      context.data = data;
      context.datasource = self.options.data;
      context.parentKey = self._getKey(self._getParentItem(liElem));
      context.metadata = metadata;
      context.component = Components.__GetWidgetConstructor(self.element);

      if (self._FixRendererContext) {
        context = self._FixRendererContext(context);
      } // dataSource always set by this point as it is post fetch


      var childDataProvider = self.m_dataSource.getChildDataProvider(key);
      metadata.leaf = childDataProvider === null;
      metadata.depth = this._getDepth(liElem); // Merge properties from metadata into item context

      var props = Object.keys(metadata);

      for (i = 0; i < props.length; i++) {
        var prop = props[i];
        context[prop] = metadata[prop];
      }

      var renderer = self.options.item.renderer;
      renderer = self._WrapCustomElementRenderer(renderer);

      var templateElement = this._getItemTemplate();

      var templateEngine = this._getTemplateEngine();

      if (renderer != null) {
        var content = renderer.call(self, context);

        if (content != null) {
          // Allow return of document fragment from jQuery create or JS document.createDocumentFragment
          if (content.parentNode === null || content.parentNode instanceof DocumentFragment) {
            liElem.appendChild(content); // @HTMLUpdateOK
          } else if (content.parentNode != null) {// Parent node exists, do nothing
          } else if (content.toString) {
            textWrapper = document.createElement('span');
            textWrapper.appendChild(document.createTextNode(content.toString())); // @HTMLUpdateOK

            liElem.appendChild(textWrapper); // @HTMLUpdateOK
          }
        }
      } else if (templateElement != null && templateEngine != null) {
        var componentElement = self.element[0];
        var nodes = templateEngine.execute(componentElement, templateElement, context, null);

        for (i = 0; i < nodes.length; i++) {
          if (nodes[i].tagName === 'LI') {
            liElem.parentNode.replaceChild(nodes[i], liElem);
            break;
          } else {
            liElem.appendChild(nodes[i]); // @HTMLUpdateOK
          }
        }
      } else {
        textWrapper = document.createElement('span');
        textWrapper.appendChild(document.createTextNode(data == null ? '' : data.toString())); // @HTMLUpdateOK

        liElem.appendChild(textWrapper); // @HTMLUpdateOK
      } // eslint-disable-next-line block-scoped-var


      if (replace && oldSubtree) {
        // eslint-disable-next-line block-scoped-var
        liElem.appendChild(oldSubtree);
      } // Get the item from root again as template replaces the item element


      liElem = ulElem.children[insertIndex != null ? insertIndex : index];
      context.parentElement = $(liElem); // Set id on the liElem if not set by the renderer

      if (liElem.getAttribute('id') == null) {
        liElem.setAttribute('id', key);
      }

      liElem['oj-item-data'] = data;
      liElem['oj-item-metadata'] = metadata;

      self._decorateItem(liElem);
    },

    /**
     * @param {Element} elem The li element to get depth of.
     * @return {number} depth from the li, 1 is top level
     * @private
     * @memberof oj.ojTreeView
     */
    _getDepth: function _getDepth(elem) {
      var depth = 0;
      var curr = elem;

      while (curr && curr !== this.element[0]) {
        curr = curr.parentElement.parentElement;
        depth += 1;
      }

      return depth;
    },

    /**
     * Initiate loading of the template engine.  An error is thrown if the template engine failed to load.
     * @return {Promise} resolves to the template engine, or null if:
     *                   1) there's no need because no item template is specified
     *                   2) a renderer is present which takes precedence
     * @private
     * @memberof oj.ojTreeView
     */
    _loadTemplateEngine: function _loadTemplateEngine() {
      var self = this;

      if (this._getItemTemplate() != null && self.options.item.renderer == null) {
        return new Promise(function (resolve) {
          Config.__getTemplateEngine().then(function (engine) {
            self.m_engine = engine;
            resolve(engine);
          }, function (reason) {
            throw new Error('Error loading template engine: ' + reason);
          });
        });
      }

      return Promise.resolve(null);
    },

    /**
     * Retrieve the template engine, returns null if it has not been loaded yet
     * @private
     * @memberof oj.ojTreeView
     */
    _getTemplateEngine: function _getTemplateEngine() {
      return this.m_engine;
    },

    /**
     * Returns the inline template element inside oj-list-view
     * @return {Element|null} the inline template element
     * @private
     * @memberof oj.ojTreeView
     */
    _getItemTemplate: function _getItemTemplate() {
      if (this.m_template === undefined) {
        // cache the template, assuming replacing template will require refresh
        this.m_template = null;

        var slotMap = this._getSlotMap();

        var slot = slotMap.itemTemplate;

        if (slot && slot.length > 0 && slot[0].tagName.toLowerCase() === 'template') {
          this.m_template = slot[0];
        }
      }

      return this.m_template;
    },

    /**
     * Returns the slot map object.
     * @return {object} slot Map
     * @private
     * @memberof oj.ojTreeView
     */
    _getSlotMap: function _getSlotMap() {
      return oj.BaseCustomElementBridge.getSlotMap(this.element[0]);
    },

    /**
     * Adds the necessary attributes to a TreeView root element.
     * @private
     */
    _decorateTree: function _decorateTree() {
      var self = this; // Keyboard focus and ARIA attributes

      var root = this._getRoot();

      if (root) {
        this._focusable({
          element: $(root),
          applyHighlight: true,
          setupHandlers: function setupHandlers(focusInHandler, focusOutHandler) {
            self._focusInHandler = focusInHandler;
            self._focusOutHandler = focusOutHandler;
          }
        });

        root.setAttribute('tabIndex', 0);
        $(root).on('focus', function () {
          self._focusInHandler($(self._getItemContent(self._currentItem)));
        }).on('blur', function () {
          self._focusOutHandler($(self._getItemContent(self._currentItem)));
        });
        root.setAttribute('role', 'tree');
        root.setAttribute('aria-labelledby', this.element[0].getAttribute('id'));
        var selectionMode = this.options.selectionMode;

        if (selectionMode !== 'none') {
          root.setAttribute('aria-multiselectable', selectionMode === 'multiple' ? 'true' : 'false');
        } else {
          root.removeAttribute('aria-multiselectable');
        }
      }
    },
    _isMultiSelectionEnabled: function _isMultiSelectionEnabled() {
      return this.options.selectionMode === 'multiple';
    },
    _isDefaultCheckBoxesEnabled: function _isDefaultCheckBoxesEnabled() {
      var defaults = this._getOptionDefaults();

      return defaults.multipleSelectionAffordance === 'selector' && this._isMultiSelectionEnabled();
    },
    _refreshSelectionItems: function _refreshSelectionItems() {
      var items = this._getItems();

      for (var i = 0; i < items.length; i++) {
        this._select(items[i]);
      }
    },

    /**
     * Adds the necessary attributes to a TreeView item element.
     * @param {Element} item The item element to decorate.
     * @private
     */
    _decorateItem: function _decorateItem(item) {
      var self = this;
      var i;
      item.classList.add('oj-treeview-item');
      item.setAttribute('role', 'treeitem');

      var itemKey = this._getKey(item); // Create wrapper for item icon and text


      var itemContent = this._getItemContent(item);

      if (!itemContent) {
        // Wrap everything except the subtree
        // Use innerHTML to include text and comment nodes as well
        itemContent = document.createElement('div');
        itemContent.classList.add('oj-treeview-item-content');

        if (this._isDefaultCheckBoxesEnabled() && this._isActionable(item, 'focus') && this._isActionable(item, 'select')) {
          var selectorSpan = document.createElement('span');
          selectorSpan.classList.add('oj-treeview-selector');
          var selector = document.createElement('oj-selector');
          selector.selectedKeys = this.options.selected;
          selector.setAttribute('data-oj-binding-provider', 'none');
          selector.setAttribute('selection-mode', 'multiple');
          selector.addEventListener('selectedKeysChanged', function (event) {
            if (event.detail.updatedFrom === 'internal') {
              var selectedItem = this._getItemByKey(event.target.rowKey);

              this._focus(selectedItem, event);

              this._userOptionChange('selected', event.detail.value, event);

              this._userOptionChange('selection', KeySet.KeySetUtils.toArray(event.detail.value), event);

              this._refreshSelectionItems();
            }
          }.bind(this));
          selector.rowKey = itemKey;
          selectorSpan.appendChild(selector); // @HTMLUpdateOK

          itemContent.appendChild(selectorSpan); // @HTMLUpdateOK
        }

        if (item.firstChild) {
          do {
            itemContent.appendChild(item.firstChild); // @HTMLUpdateOK
          } while (item.childNodes.length > 0);
        }

        item.appendChild(itemContent); // @HTMLUpdateOK
        // Take the subtree out of the itemContent wrapper

        var innerTree = itemContent.getElementsByTagName('ul')[0];

        if (innerTree) {
          item.appendChild(innerTree); // @HTMLUpdateOK
        }

        var treeViewItems = itemContent.getElementsByClassName('oj-treeview-item-icon');

        for (i = 0; i < treeViewItems.length; i++) {
          treeViewItems[i].classList.add('oj-treeview-icon');
        }
      } // Initial selection


      self._select(item); // DnD


      var dragOptions = this._getDragOptions();

      itemContent.setAttribute('draggable', Object.keys(dragOptions).length > 0 ? 'true' : 'false'); // Create disclosure icon or spacer

      var disclosureIcon = itemContent.getElementsByClassName('oj-treeview-spacer');

      if (disclosureIcon.length === 0) {
        disclosureIcon = document.createElement('ins');

        this._addTreeViewIconClass(disclosureIcon);

        this._addTreeviewSpacerClass(disclosureIcon);

        itemContent.insertBefore(disclosureIcon, itemContent.children[0]); // @HTMLUpdateOK
      }

      this._addIndentation(item, disclosureIcon);

      if (self._isLeaf(item)) {
        this._addTreeviewLeafClass(item);
      } else {
        // Expanded option
        if (self._isInitExpanded(itemKey)) {
          self._expand(item, false);
        } else {
          self._collapse(item, false);
        }

        this._addDisclosureClasses(disclosureIcon);
      }
    },

    /**
    * Add the indentation spacers to the item
    * @private
    */
    _addIndentation: function _addIndentation(item, disclosureIcon) {
      // 0 index the depth for style purposes
      var depth = this._getDepth(item);

      if (depth < this.constants.MAX_STYLE_DEPTH) {
        this._appendSpacerClass(depth, disclosureIcon);
      } else {
        this._appendSpacerClass(1, disclosureIcon); // eslint-disable-next-line no-param-reassign


        disclosureIcon.style.width = disclosureIcon.offsetWidth * depth + 'px';
      }
    },
    _appendSpacerClass: function _appendSpacerClass(depth, disclosureIcon) {
      disclosureIcon.classList.add(this.classNames['depth' + depth]);
    },
    _addTreeviewSpacerClass: function _addTreeviewSpacerClass(item) {
      item.classList.add('oj-treeview-spacer');
    },
    _addTreeViewIconClass: function _addTreeViewIconClass(item) {
      item.classList.add('oj-treeview-icon');
    },
    _addTreeviewLeafClass: function _addTreeviewLeafClass(item) {
      item.classList.add('oj-treeview-leaf');
    },
    _removeTreeviewLeafClass: function _removeTreeviewLeafClass(item) {
      item.classList.remove('oj-treeview-leaf');
    },
    _addDisclosureClasses: function _addDisclosureClasses(item) {
      item.classList.add('oj-treeview-disclosure-icon');
      item.classList.add('oj-component-icon');
      item.classList.add('oj-clickable-icon-nocontext');
      item.classList.add('oj-default');
    },
    _removeDisclosureClasses: function _removeDisclosureClasses(item) {
      item.classList.remove('oj-treeview-disclosure-icon');
      item.classList.remove('oj-component-icon');
      item.classList.remove('oj-clickable-icon-nocontext');
      item.classList.remove('oj-default');
    },

    /**
    /**
     * Returns all the item elements that belongs to the TreeView.
     * @return {Element} All the item elements that belongs to the TreeView.
     * @private
     */
    _getItems: function _getItems() {
      return this.element[0].getElementsByClassName('oj-treeview-item');
    },

    /**
     * Returns the key of the provided item.
     * @param {Element} item The TreeView item element.
     * @return {any} The key.
     * @private
     */
    _getKey: function _getKey(item) {
      if (!item) {
        return null;
      } // Rely on the key in the metadata first. The DOM id stringifies the key,
      // so it won't return the correct key if the key isn't string.


      var metadata = item['oj-item-metadata'];

      if (metadata) {
        return metadata.key;
      }

      return item.getAttribute('id');
    },

    /**
     * Returns the item element that is identified by the provided key.
     * @param {string} key The key.
     * @return {Element} The item element.
     * @private
     */
    _getItemByKey: function _getItemByKey(key) {
      // Rely on the key in the metadata first. The DOM id stringifies the key,
      // so it won't return the correct key if the key isn't string.
      var itemList = this.element[0].getElementsByTagName('li');
      var item;

      for (var i = 0; i < itemList.length; i++) {
        var metadata = itemList[i]['oj-item-metadata'];

        if (metadata) {
          if (oj.Object.compareValues(metadata.key, key)) {
            item = itemList[i];
            break;
          }
        }
      }

      if (item) {
        return item;
      }

      if (typeof key === 'string') {
        var keyElement = document.getElementById(key);

        var root = this._getRoot();

        if (root) {
          if (keyElement && root && root.contains(keyElement)) {
            return keyElement;
          }
        }
      }

      return undefined;
    },

    /**
     * Returns the content element of the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Element} The item content element.
     * @private
     */
    _getItemContent: function _getItemContent(item) {
      if (!item) {
        return null;
      } // : _getItemContent can give you non direct children's content


      var children = item.children;

      for (var i = 0; i < children.length; i++) {
        if (item.children[i].classList && item.children[i].classList.contains('oj-treeview-item-content')) {
          return item.children[i];
        }
      }

      return null;
    },

    /**
     * Returns the child items of the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Element} The child item elements.
     * @private
     */
    _getChildItems: function _getChildItems(item) {
      var listElements = [];
      var firstSubList = item.getElementsByClassName('oj-treeview-list')[0];

      if (firstSubList) {
        var children = firstSubList.children;

        for (var i = 0; i < children.length; i++) {
          listElements.push(children[i]);
        }
      }

      return listElements;
    },

    /**
     * Returns the parent item of the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Element} The parent item element.
     * @private
     */
    _getParentItem: function _getParentItem(item) {
      var parentListElement = this._getParents(item, '.oj-treeview-list')[0];

      return this._getParents(parentListElement, '.oj-treeview-item')[0];
    },

    /**
     * Returns the subtree element (ul) of the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Element} The subtree element (ul).
     * @private
     */
    _getSubtree: function _getSubtree(item) {
      return item.getElementsByClassName('oj-treeview-list')[0];
    },

    /**
     * Returns the root ul of the TreeView.
     * @return {Element}
     * @private
     */
    _getRoot: function _getRoot() {
      return this.element[0].getElementsByClassName('oj-treeview-list')[0];
    },

    /**
     * Returns whether the item is a leaf item.
     * @param {Element} item The TreeView item element.
     * @return {boolean}
     * @private
     */
    _isLeaf: function _isLeaf(item) {
      if (!item) {
        return null;
      }

      var metadata = item['oj-item-metadata'];
      var hasChildren = metadata ? !metadata.leaf : this._getSubtree(item) !== undefined;
      return !hasChildren;
    },

    /**
     * Returns whether item element is initially expanded in the TreeView option.
     * Note that the expanded option is not kept in sync with the actual expanded state of the TreeView.
     * @param {Object} key The TreeView items key.
     * @return {boolean}
     * @private
     */
    _isInitExpanded: function _isInitExpanded(key, uiExpanded) {
      var expanded = uiExpanded != null ? uiExpanded : this.options.expanded;
      return expanded && expanded.has ? expanded.has(key) : false;
    },

    /**
     * Returns whether item element is currently expanded.
     * Note that the expanded option is not kept in sync with the actual expanded state of the TreeView.
     * @param {Element} item The TreeView item element.
     * @return {boolean}
     * @private
     */
    _isExpanded: function _isExpanded(item) {
      return item.classList.contains('oj-expanded');
    },

    /**
     * Whether the group item is currently in the middle of expanding/collapsing
     * @param {Object} key the key of the group item
     * @return {boolean} true if it's expanding/collapsing, false otherwise
     * @private
     */
    _isDisclosing: function _isDisclosing(key) {
      if (key && this.m_disclosing) {
        return this.m_disclosing.indexOf(key) > -1;
      }

      return false;
    },

    /**
     * Marks a group item as currently in the middle of expanding/collapsing
     * @param {Object} key the key of the group item
     * @param {boolean} flag true or false
     * @private
     */
    _setDisclosing: function _setDisclosing(key, flag) {
      if (key == null) {
        return;
      }

      if (this.m_disclosing == null) {
        this.m_disclosing = [];
      }

      if (flag) {
        this.m_disclosing.push(key);
      } else {
        // there should be at most one entry, but just in case remove all occurrences
        var index = this.m_disclosing.indexOf(key);

        while (index > -1) {
          this.m_disclosing.splice(index, 1);
          index = this.m_disclosing.indexOf(key);
        }
      }
    },

    /**
     * Expands an item.
     * @param {Element} item The TreeView item element.
     * @param {boolean} animate Whether the expand should be animated.
     * @param {Event} event The event that triggers the expand.
     * @param {boolean} vetoable Whether the expand can be vetoed by beforeExpand.
     * @private
     */
    _expand: function _expand(item, animate, event, vetoable) {
      var self = this;

      if (this._isExpanded(item) || this._isLeaf(item) || animate && this._isDisclosing(this._getKey(item))) {
        return;
      }

      if (animate) {
        var cancelled = !this._trigger('beforeExpand', event, this._getEventPayload(item));

        if (cancelled && vetoable !== false) {
          return;
        }
      }

      this._lastSelectedItem = null;

      var subtree = this._getSubtree(item);

      var key = self._getKey(item);

      if (!subtree) {
        this._uiExpanded = this._uiExpanded.add([key]);

        this._fetchChildren(key, function (response) {
          // if the item is already expanded or is no longer in the expanded option bail early
          // no need to check refreshId because is handled at fetchChildren layer
          // uiExpanded is used because on ui gesture the expanded is not set until
          // fetch/animation completes, so we need an internal expanded option to track that
          if (self._isExpanded(item) && !self._isSkeletonSupported() || !self._isInitExpanded(key) && !self._isInitExpanded(key, self._uiExpanded)) {
            return;
          }

          var fetchListResult = response.values[0];
          var skeletonContainerLength = item.getElementsByClassName('oj-treeview-skeleton-container').length;
          var params = {
            fetchListResult: fetchListResult.value,
            parentElem: item
          };

          if (self._isSkeletonSupported() && skeletonContainerLength > 0 && response.shouldRemoveSkeleton) {
            self._renderItems(params).then(function () {
              var itemHeight = item.offsetHeight;
              var skeletonHeight = itemHeight * 3; // Three tiered skeleton

              var contentHeight = itemHeight * fetchListResult.value.data.length;
              subtree = self._getSubtree(item);
              var options = {};
              options.startMaxHeight = skeletonHeight + 'px';
              options.endMaxHeight = contentHeight + 'px';

              if (contentHeight > skeletonHeight) {
                self._animateSkeletonRemoval('expand', item, subtree, options, event);
              } else if (contentHeight < skeletonHeight) {
                self._animateSkeletonRemoval('collapse', item, subtree, options, event);
              } else {
                self._animateSkeletonRemoval('fadeIn', item, subtree, options, event);
              }
            });
          } else if (self._isSkeletonSupported() && skeletonContainerLength > 0) {
            self._renderItems(params).then(function () {
              self._setExpandedState(self, item, event);
            });
          } else {
            self._renderItems(params).then(function () {
              self._expandAfterFetch(item, animate, event);
            });
          }
        });

        return;
      }

      self._expandAfterFetch(item, animate, event);
    },

    /**
     * Adds necessary expand classes to an item .
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setItemExpanded: function _setItemExpanded(item) {
      item.classList.remove('oj-collapsed');
      item.classList.add('oj-expanded');
      item.setAttribute('aria-expanded', 'true');
    },

    /**
     * Animates the collapse or expand after a skeleton has been removed.
     * @param {String} action The animation action.
     * @param {Element} item The TreeView item element.
     * @param {Element} subtree The item's subtree element.
     * @param {Object} option The options for the the animation.
     * @param {Event} event The event that has caused this action.
     * @private
     */
    _animateSkeletonRemoval: function _animateSkeletonRemoval(action, item, subtree, options, event) {
      var key = this._getKey(item);

      var skeletonRemovedPromise = this._removeSkeleton(key);

      skeletonRemovedPromise.then(function () {
        this._setItemExpanded(item);

        var self = this;
        var fadeinPromise;

        var defaults = this._getOptionDefaults(); // eslint-disable-next-line no-param-reassign


        subtree.style.display = 'block';
        fadeinPromise = AnimationUtils.fadeIn(subtree, {
          duration: defaults.dataFadeInDuration
        });
        fadeinPromise.then(function () {
          var animationPromise;

          var busyResolve = this._addBusyState('animating skeleton removal');

          item.classList.add('oj-treeview-animated'); // animation flag

          this._setDisclosing(this._getKey(item), true);

          if (action === 'expand') {
            animationPromise = this._startAnimation(subtree, 'expand', options);
            animationPromise.then(this._resolveAnimationPromise(self, item, event, busyResolve));
          } else if (action === 'collapse') {
            animationPromise = this._startAnimation(subtree, 'collapse', options);
            animationPromise.then(this._resolveAnimationPromise(self, item, event, busyResolve));
          } else {
            var resolve = this._resolveAnimationPromise(self, item, event, busyResolve);

            resolve();
          }
        }.bind(this));
      }.bind(this));
    },

    /**
     * Expands an item after its child items have been fetched.
     * @param {Element} item The TreeView item element.
     * @param {boolean} animate Whether the expand should be animated.
     * @param {Event} event The event that triggers the expand.
     * @private
     */
    _expandAfterFetch: function _expandAfterFetch(item, animate, event) {
      var self = this;

      this._setItemExpanded(item);

      var subtree = this._getSubtree(item);

      if (subtree) {
        subtree.style.display = 'block';
      }

      if (animate) {
        var busyResolve = this._addBusyState('animating expand');

        item.classList.add('oj-treeview-animated'); // animation flag

        self._setDisclosing(self._getKey(item), true);

        this._startAnimation(subtree, 'expand').then(this._resolveAnimationPromise(self, item, event, busyResolve));
      }
    },
    _setExpandedState: function _setExpandedState(self, item, event) {
      self._setDisclosing(self._getKey(item), false);

      item.classList.remove('oj-treeview-animated');

      self._trigger('expand', event, self._getEventPayload(item)); // Update option and fire optionChange


      var expanded = self.options.expanded;
      var newExpanded = expanded.add([self._getKey(item)]);

      self._userOptionChange('expanded', newExpanded, event);
    },
    _resolveAnimationPromise: function _resolveAnimationPromise(self, item, event, busyResolve) {
      return function () {
        this._setExpandedState(self, item, event);

        busyResolve();
      }.bind(this);
    },

    /**
     * Collapses an item.
     * @param {Element} item The TreeView item element.
     * @param {boolean} animate Whether the collapse should be animated.
     * @param {Event} event The event that triggers the collapse.
     * @param {boolean} vetoable Whether the collapse can be vetoed by beforeCollapse.
     * @private
     */
    _collapse: function _collapse(item, animate, event, vetoable) {
      var self = this;

      if (item.classList.contains('oj-collapsed') || this._isLeaf(item) || animate && this._isDisclosing(this._getKey(item))) {
        return;
      }

      if (item.contains(this._currentItem)) {
        var tempItem = item;

        if (!this._isActionable(tempItem, 'focus')) {
          tempItem = this._getPreviousActionableItem(item, 'focus');

          if (!tempItem) {
            tempItem = this._getNextActionableItem(item, 'focus');
          }
        }

        if (tempItem) {
          this._focus(tempItem, event);
        } else {
          this.options.currentItem = null;

          this._resetFocus();
        }
      }

      if (animate) {
        var cancelled = !this._trigger('beforeCollapse', event, this._getEventPayload(item));

        if (cancelled && vetoable !== false) {
          return;
        }

        this._setDisclosing(this._getKey(item), true);
      }

      item.classList.remove('oj-expanded');
      item.classList.add('oj-collapsed');
      item.setAttribute('aria-expanded', 'false');
      this._lastSelectedItem = null;

      var subtree = this._getSubtree(item);

      if (animate) {
        var busyResolve = this._addBusyState('animating collapse');

        item.classList.add('oj-treeview-animated'); // animation flag

        this._uiExpanded = this._uiExpanded.delete([this._getKey(item)]);

        this._startAnimation(subtree, 'collapse').then(function () {
          self._setDisclosing(self._getKey(item), false);

          subtree.style.display = 'none';
          item.classList.remove('oj-treeview-animated');

          self._trigger('collapse', event, self._getEventPayload(item)); // Update option and fire optionChange


          var expanded = self.options.expanded;
          var newExpanded = expanded.delete([self._getKey(item)]);

          self._userOptionChange('expanded', newExpanded, event);

          busyResolve();
        });
      } else if (subtree) {
        subtree.style.display = 'none';
      }
    },

    /**
     * Starts the animation for the specific action.
     * @param {Element} elem The element to animate.
     * @param {string} action The name of the action to animate.
     * @return {Promise} A promise that will be resolved when the animation ends.
     * @private
     */
    _startAnimation: function _startAnimation(elem, action, options) {
      var defaultOptions = this._getOptionDefaults();

      var effects = (defaultOptions.animation || {})[action];

      if (options) {
        if (effects.effect === 'expand' || effects.effect === 'collapse') {
          Object.assign(effects, options);
        }
      }

      return AnimationUtils.startAnimation(elem, action, effects, this);
    },

    /**
     * Returns the default event payload for the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Object}
     * @private
     */
    _getEventPayload: function _getEventPayload(item) {
      return {
        key: this._getKey(item),
        item: item
      };
    },

    /**
     * Returns whether an action (select or focus) can be performed on the item.
     * @param {Element} item The TreeView item element.
     * @param {string} actionName The action name: 'select' or 'focus'.
     * @return {boolean}
     * @private
     */
    _isActionable: function _isActionable(item, actionName) {
      var actionable = this.options.item[actionName + 'able'];

      if (actionable === false) {
        return false;
      } else if (typeof actionable === 'function') {
        var itemContext = this.getContextByNode(item);
        return actionable(itemContext);
      }

      return true;
    },

    /**
     * Returns whether item element is selected.
     * @param {Element} item The TreeView item element.
     * @return {boolean}
     * @private
     */
    _isSelected: function _isSelected(item) {
      var selectionMode = this.options.selectionMode;
      var selected = this.options.selected;

      if (selectionMode === 'none') {
        return false;
      }

      var key = this._getKey(item);

      return selected.has(key);
    },

    /**
     * Handles the selected or selection option being set programmatically
     * @param {string} key the option
     * @param {KeySet} value the selected object
     * @private
     */
    _handleSelectedOption: function _handleSelectedOption(key, value) {
      if (key === 'selected') {
        var selectedArray = KeySet.KeySetUtils.toArray(value);

        this._userOptionChange('selection', selectedArray, null);

        if (this._isDefaultCheckBoxesEnabled()) {
          this._updateSelectors(value);
        }
      } else if (key === 'selection') {
        var selectionKeySet = KeySet.KeySetUtils.toKeySet(value);

        this._userOptionChange('selected', selectionKeySet, null);
      }

      this._refreshSelectionItems();
    },

    /**
     * Selects or unselects an item, depending on what triggers the selection.
     * @param {Element} item The TreeView item element.
     * @param {Event} event The event that triggers the select.
     * @private
     */
    _select: function _select(item, event) {
      var selectionMode = this.options.selectionMode;

      if (selectionMode === 'none') {
        return;
      } // Check whether the item is selectable


      if (!this._isActionable(item, 'focus') || !this._isActionable(item, 'select')) {
        return;
      }

      var isSelected = this._isSelected(item);

      if (event) {
        var sourceCapabilityTouch = event.originalEvent.sourceCapabilities && event.originalEvent.sourceCapabilities.firesTouchEvents;
        var isTouch = oj.DomUtils.isTouchSupported() && (sourceCapabilityTouch || this.touchStartEvent != null && this.touchStartEvent.target === event.target);
        var isMetaKey = oj.DomUtils.isMetaKeyPressed(event);
        var isMultiple = selectionMode === 'multiple';
        var isNavigation = event.keyCode === 40 || event.keyCode === 38;

        var key = this._getKey(item);

        var selected = new KeySet.KeySetImpl();

        if (isMultiple && event.shiftKey && !isNavigation) {
          // Maintain selection of other items if meta key is pressed
          if (isMetaKey) {
            selected = this.options.selected;
          } else {
            this._clearSelection();
          } // Select a range from the last selected item to the current item


          var nextItem = this._lastSelectedItem;
          var getNextItem = nextItem && nextItem.offsetTop < item.offsetTop ? this._getNextActionableItem.bind(this) : this._getPreviousActionableItem.bind(this);

          while (nextItem && nextItem !== item) {
            var nextKey = this._getKey(nextItem);

            if (!selected.has(nextKey)) {
              selected = selected.add([nextKey]);

              this._setSelected(nextItem);
            }

            nextItem = getNextItem(nextItem, 'select');
          } // Select the current item


          isSelected = true;
          selected = selected.add([key]);
        } else if (isMultiple && (isMetaKey || isTouch || isNavigation)) {
          // Toggle selection of current item while maintaining the selection of the other items
          isSelected = !isSelected;
          selected = this.options.selected;

          if (isSelected) {
            selected = selected.add([key]);
          } else {
            selected = selected.delete([key]);
          }
        } else {
          // Clear selection of all other items
          this._clearSelection(); // On touch or spacebar, toggle the selection of the current item
          // Otherwise, select the current item even if it is already selected


          if ((isTouch || event.keyCode === 32) && isSelected) {
            isSelected = false;
            selected = new KeySet.KeySetImpl();
          } else {
            isSelected = true;
            selected = new KeySet.KeySetImpl([key]);
          }
        } // Update option and fire optionChange


        this._userOptionChange('selected', selected, event);

        this._userOptionChange('selection', KeySet.KeySetUtils.toArray(selected), event);

        this._lastSelectedItem = item;
      }

      if (isSelected) {
        this._setSelected(item);
      } else {
        this._setUnselected(item);
      }
    },

    /**
     * Updates internal selectors for selectionMode Multiple.
     * @private
     */
    _updateSelectors: function _updateSelectors(selected) {
      var busyResolve = this._addBusyState('updating selectors');

      var selectors = this.element[0].getElementsByClassName('oj-treeview-selector');

      for (var i = 0; i < selectors.length; i++) {
        selectors[i].firstChild.selectedKeys = selected;
      }

      busyResolve();
    },

    /**
     * Style the provided item as selected.
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setSelected: function _setSelected(item) {
      var itemContent = this._getItemContent(item);

      itemContent.classList.add('oj-selected');
      item.setAttribute('aria-selected', 'true');
    },

    /**
     * Style the provided item as unselected.
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setUnselected: function _setUnselected(item) {
      var itemContent = this._getItemContent(item);

      itemContent.classList.remove('oj-selected');
      item.setAttribute('aria-selected', 'false');
    },

    /**
    * Clears the selection of all items.
    * @private
    */
    _clearSelection: function _clearSelection() {
      var items = this._getItems();

      for (var i = 0; i < items.length; i++) {
        this._setUnselected(items[i]);
      }
    },

    /**
     * Sets the focus (current item) on the provided item element.
     * @param {Element} item The TreeView item element.
     * @param {Event} event The event that triggers the focus.
     * @private
     */
    _focus: function _focus(item, event) {
      // Check whether the item is focusable
      if (!this._isActionable(item, 'focus')) {
        return;
      }

      if (event) {
        var payload = this._getEventPayload(item);

        if (this._currentItem) {
          payload.previousKey = this._getKey(this._currentItem);
          payload.previousItem = this._currentItem;
        }

        var cancelled = !this._trigger('beforeCurrentItem', event, payload);

        if (cancelled) {
          return;
        } // Update option and fire optionChange


        this._userOptionChange('currentItem', this._getKey(item), event);
      }

      this._focusOutHandler($(this._getItemContent(this._currentItem)));

      this._focusInHandler($(this._getItemContent(item)));

      this._setCurrentItem(item);
    },

    /**
     * Resets the focus (current item) of the TreeView.
     * @private
     */
    _resetFocus: function _resetFocus() {
      if (this.options.currentItem) {
        var currentItem = this._getItemByKey(this.options.currentItem);

        if (currentItem) {
          this._setCurrentItem(currentItem);

          return;
        }
      } // CurrentItem not specified, so default to the first item.
      // Update the option so the currentItem attribute is in sync.


      var firstItem = this._getItems()[0];

      if (!this._isActionable(firstItem, 'focus')) {
        firstItem = this._getNextActionableItem(firstItem, 'focus');
      }

      this._setCurrentItem(firstItem);

      this._userOptionChange('currentItem', this._getKey(this._currentItem), null);
    },

    /**
     * Set the provided item as the current item.
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setCurrentItem: function _setCurrentItem(item) {
      this._currentItem = item; // Set the item content to be the activedescendant so that the screen reader
      // does not read the child items.

      var root = this._getRoot();

      if (root) {
        root.setAttribute('aria-activedescendant', this._getKey(item));
      }
    },

    /**
     * Adds a busy state.
     * @param {string} description The description of the busy state.
     * @return {Function} The resolve function of the busy state.
     * @private
     */
    _addBusyState: function _addBusyState(description) {
      var busyContext = Context.getContext(this.element[0]).getBusyContext();
      var id = this.element.attr('id');
      return busyContext.addBusyState({
        description: "The component identified by '" + id + "', " + description
      });
    },

    /**
     * Writes back a user-triggered change into the option.
     * @param {string} key The option name.
     * @param {Object} value The new value of the option.
     * @param {Event} event The event that triggers the change.
     * @private
     */
    _userOptionChange: function _userOptionChange(key, value, event) {
      this.option(key, value, {
        _context: {
          originalEvent: event,
          writeback: true,
          internalSet: true
        }
      });

      if (key === 'selected' && this._isDefaultCheckBoxesEnabled()) {
        this._updateSelectors(value);
      }
    },

    /**
     * Returns the dnd.drag.items option.
     * @return {Object} The option object. Defaults to {}.
     * @private
     */
    _getDragOptions: function _getDragOptions() {
      return ((this.options.dnd || {}).drag || {}).items || {};
    },

    /**
     * Returns the dnd.drop.items option.
     * @return {Object} The option object. Defaults to {}.
     * @private
     */
    _getDropOptions: function _getDropOptions() {
      return ((this.options.dnd || {}).drop || {}).items || {};
    },

    /**
     * Returns the closest item to the element.
     * @param {Element} elem The element.
     * @return {Element} The item content element.
     * @private
     */
    _getClosestItem: function _getClosestItem(elem) {
      return this._closest(elem, '.oj-treeview-item');
    },

    /**
     * Returns the closest item content to the element.
     * @param {Element} elem The element.
     * @return {Element} The item content element.
     * @private
     */
    _getClosestItemContent: function _getClosestItemContent(elem) {
      return this._closest(elem, '.oj-treeview-item-content');
    },

    /**
     * Returns the closest disclosure icon to the element.
     * @param {Element} elem The element.
     * @return {Element} The disclosure icon element.
     * @private
     */
    _getClosestDisclosureIcon: function _getClosestDisclosureIcon(elem) {
      return this._closest(elem, '.oj-treeview-disclosure-icon');
    },

    /**
     * Handles click event.
     * @param {Event} event The event.
     * @private
     */
    _handleClick: function _handleClick(event) {
      var item; // Clicking on disclosure icon

      var disclosureIcon = this._getClosestDisclosureIcon(event.target);

      if (disclosureIcon) {
        item = this._getClosestItem(disclosureIcon);

        if (this._isExpanded(item)) {
          this._collapse(item, true, event);
        } else {
          this._expand(item, true, event);
        }

        this.touchStartEvent = null;
        return;
      } // Clicking on item content


      var itemContent = this._getClosestItemContent(event.target);

      if (itemContent) {
        item = itemContent.parentNode;

        this._select(item, event);

        this._focus(item, event);

        this.touchStartEvent = null;
        return;
      } // Clear selection otherwise


      var selectionMode = this.options.selectionMode;

      if (selectionMode !== 'none') {
        this._clearSelection();

        this._lastSelectedItem = null;

        this._userOptionChange('selected', new KeySet.KeySetImpl(), event);

        this._userOptionChange('selection', [], event);
      }

      this.touchStartEvent = null;
    },

    /**
     * Handles mouse over event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseOver: function _handleMouseOver(event) {
      // Don't add hover effect for touch
      if (oj.DomUtils.isTouchSupported() && this.touchStartEvent) {
        return;
      }

      var target = this._getClosestDisclosureIcon(event.target);

      if (!target) {
        target = this._getClosestItemContent(event.target);
      } // Add hover effect


      if (target) {
        target.classList.remove('oj-default');
        target.classList.add('oj-hover');
      }
    },

    /**
     * Handles mouse out event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseOut: function _handleMouseOut(event) {
      var target = this._getClosestDisclosureIcon(event.target);

      if (target) {
        target.classList.remove('oj-selected');
      }

      if (!target) {
        target = this._getClosestItemContent(event.target);
      } // Remove hover effect


      if (target) {
        target.classList.add('oj-default');
        target.classList.remove('oj-hover');
      }
    },

    /**
     * Handles mouse down event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseDown: function _handleMouseDown(event) {
      var disclosureIcon = this._getClosestDisclosureIcon(event.target);

      if (disclosureIcon) {
        disclosureIcon.classList.add('oj-selected');
      }
    },

    /**
     * Handles mouse up event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseUp: function _handleMouseUp(event) {
      var disclosureIcon = this._getClosestDisclosureIcon(event.target);

      if (disclosureIcon) {
        disclosureIcon.classList.remove('oj-selected');
      }
    },

    /**
     * Handles key down event.
     * @param {Event} event The event.
     * @private
     */
    _handleKeyDown: function _handleKeyDown(event) {
      var keyCode = event.keyCode;
      var currentItem = this._currentItem;
      var nextItem;
      var selectionMode = this.options.selectionMode;

      if (keyCode === 38 || keyCode === 40) {
        // UP or DOWN
        nextItem = keyCode === 40 ? this._getNextActionableItem(currentItem, 'focus') : this._getPreviousActionableItem(currentItem, 'focus');

        if (nextItem) {
          event.preventDefault(); // prevent scrolling the page

          if (this._isSelected(currentItem) && event.shiftKey) {
            // Shift+Up/Down either extends the selection to the next item or cancels previous Shift+Down/Up
            this._select(this._isSelected(nextItem) ? currentItem : nextItem, event);
          }

          this._scrollToVisible(nextItem, keyCode);

          this._focus(nextItem, event);
        }
      } else if (keyCode === 37 || keyCode === 39) {
        // LEFT or RIGHT
        var isRTL = this._GetReadingDirection() === 'rtl';
        var isEnd = !isRTL && keyCode === 39 || isRTL && keyCode === 37;

        if (isEnd && !this._isLeaf(currentItem) && !this._isExpanded(currentItem)) {
          event.preventDefault(); // prevent scrolling the page

          this._expand(currentItem, true, event);
        } else if (!isEnd && !this._isLeaf(currentItem) && this._isExpanded(currentItem)) {
          event.preventDefault(); // prevent scrolling the page

          this._collapse(currentItem, true, event);
        } else {
          nextItem = isEnd ? this._getNextActionableItem(currentItem, 'focus') : this._getPreviousActionableItem(currentItem, 'focus');

          if (nextItem) {
            event.preventDefault(); // prevent scrolling the page

            this._focus(nextItem, event);
          }
        }
      } else if (keyCode === 13 || keyCode === 32) {
        // ENTER or SPACE
        event.preventDefault(); // prevent scrolling the page

        this._select(currentItem, event);
      } else if (keyCode === 65 && oj.DomUtils.isMetaKeyPressed(event) && selectionMode === 'multiple') {
        // CTRL - A
        event.preventDefault(); // prevent default ctrl a

        var items = this._getItems();

        var selected = new KeySet.AllKeySetImpl();

        for (var i = 0; i < items.length; i++) {
          if (this._isActionable(items[i], 'select')) {
            this._setSelected(items[i]);
          }
        }

        this._userOptionChange('selected', selected, event);

        this._userOptionChange('selection', KeySet.KeySetUtils.toArray(selected), event);
      }
    },

    /**
    * Scroll as needed to make an element visible in the viewport
    * @param {Element} elem the element to make visible
    * @param {Number} key
    * @private
    */
    _scrollToVisible: function _scrollToVisible(elem, keyCode) {
      var spacerHeight = elem.getElementsByClassName('oj-treeview-spacer')[0].offsetHeight;
      var tree = this.element[0];
      var treeScrollTop = tree.scrollTop;
      var height = spacerHeight;
      var viewportStart = treeScrollTop;
      var viewportEnd = treeScrollTop + this.element[0].offsetHeight;
      var position;
      position = elem.offsetTop - this.element[0].offsetTop;

      if (keyCode !== 38) {
        // UP
        position += height;
      }

      if (position >= viewportStart && position <= viewportEnd) {
        return;
      } // +- 1 for the focus border


      if (position < viewportStart) {
        tree.scrollTop = treeScrollTop + (position - viewportStart - 1);
      } else if (position > viewportEnd) {
        // eslint-disable-next-line no-mixed-operators
        tree.scrollTop = treeScrollTop + (position - viewportEnd + 1);
      }
    },

    /**
     * Returns the item below the provided item.
     * @param {Element} item The TreeView item element.
     * @return {Element} The next item element.
     * @private
     */
    _getNextItem: function _getNextItem(item) {
      // If the item is expanded, go to the first child
      if (!this._isLeaf(item) && this._isExpanded(item)) {
        var firstChild = this._getChildItems(item)[0];

        if (firstChild) {
          return firstChild;
        }
      } // Otherwise, go to the next sibling of the item or its ancestors


      var parent = item;

      while (parent) {
        var nextSibling = this._getNextSibling(parent, '.oj-treeview-item');

        if (nextSibling) {
          return nextSibling;
        }

        parent = this._getParentItem(parent);
      } // Otherwise, don't go anywhere


      return null;
    },

    /**
     * Returns the closest item below the provided item that can accept the specified action.
     * @param {Element} item The TreeView item element.
     * @param {string} actionName The action name: 'select' or 'focus'.
     * @return {Element} The next item element.
     * @private
     */
    _getNextActionableItem: function _getNextActionableItem(item, actionName) {
      while (item != null) {
        // eslint-disable-next-line no-param-reassign
        item = this._getNextItem(item);

        if (item != null && this._isActionable(item, actionName)) {
          return item;
        }
      }

      return null;
    },

    /**
     * Returns the item above the provided item.
     * @param {Element} item The TreeView item element.
     * @return {Element} The previous item element.
     * @private
     */
    _getPreviousItem: function _getPreviousItem(item) {
      // Go to the last expanded child of the previous sibling
      var prevSibling = this._getPreviousSibling(item, '.oj-treeview-item');

      while (prevSibling) {
        if (!this._isLeaf(prevSibling) && this._isExpanded(prevSibling)) {
          var prevChildren = this._getChildItems(prevSibling);

          var lastChild = prevChildren[prevChildren.length - 1];

          if (lastChild) {
            prevSibling = lastChild;
          } else {
            return prevSibling;
          }
        } else {
          return prevSibling;
        }
      } // Otherwise, go to the parent


      var parent = this._getParentItem(item);

      if (parent) {
        return parent;
      } // Otherwise, don't go anywhere


      return null;
    },

    /**
     * Returns the closest item above the provided item that can accept the specified action.
     * @param {Element} item The TreeView item element.
     * @param {string} actionName The action name: 'select' or 'focus'.
     * @return {Element} The previous item element.
     * @private
     */
    _getPreviousActionableItem: function _getPreviousActionableItem(item, actionName) {
      while (item != null) {
        // eslint-disable-next-line no-param-reassign
        item = this._getPreviousItem(item);

        if (item != null && this._isActionable(item, actionName)) {
          return item;
        }
      }

      return null;
    },

    /**
     * Handles DnD dragStart event.
     * @param {Event} event The event.
     * @private
     */
    _handleDragStart: function _handleDragStart(event) {
      if (oj.DomUtils.isTouchSupported()) {
        // eslint-disable-next-line no-param-reassign
        this.ojTreeViewDragEvent = true;
      }

      var self = this;
      var isRTL = this._GetReadingDirection() === 'rtl';

      var targetItem = this._getClosestItem(event.target);

      if (!targetItem) {
        return;
      }

      var i;
      var items = [];

      if (!this._isSelected(targetItem)) {
        this._select(targetItem, event);

        items.push(targetItem);
      } else {
        var selection = this.options.selection;

        for (i = 0; i < selection.length; i++) {
          var itemByKey = this._getItemByKey(selection[i]);

          if (itemByKey) {
            items.push(itemByKey);
          }
        }
      } // TODO: static HTML needs to pass parent innerHTML for data


      var dragOptions = this._getDragOptions();

      var dataTransfer = event.originalEvent.dataTransfer;
      var dragImage = document.createElement('ul');
      dragImage.classList.add('oj-treeview-drag-image');
      dragImage.classList.add('oj-treeview-list');

      if (oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.SAFARI) {
        // On Safari, the drag image is not rendered if the position is fixed.
        // If we set {position: absolute; top: -10000px}, it should theoretically
        // work for all browsers (as it does for table and listview), but it
        // causes the treeview to blink frantically if you drag an unselected
        // item on Chrome. When an unselected item is dragged, the treeview applies
        // selection effect to it, but Chrome somehow doesn't like modifying the
        // DOM and setting drag image at the same time if the drag image has absolute
        // position and negative top (I tested that positive top is fine, but positive
        // top adds a scrollbar on IE). This issue never happens on table and
        // listview because they don't allow dragging unselected items.
        dragImage.style.position = 'absolute';
      }

      var dragData = [];
      var topmost = Infinity;
      var leftmost = Infinity;
      items.forEach(function (item) {
        dragData.push(item['oj-item-data']); // Clone the item for the drag image and match the offset of the original item.
        // For RTL, we have to use the left offset of the item content because the
        // left offset of the li is always zero due to the li filling up the entire line.

        var offset = item.getBoundingClientRect();
        var offsetTop = offset.top;
        var offsetLeft = offset.left;

        if (isRTL) {
          var itemContentChildren = self._getItemContent(item).children;

          var childrenWidth = 0;

          for (var j = 0; j < itemContentChildren.length; j++) {
            childrenWidth += itemContentChildren[j].offsetWidth;
          }

          childrenWidth += offset.left;
          offsetLeft = offset.width - childrenWidth - offset.left;
        }

        offsetTop += document.body.scrollTop;
        offsetLeft += document.body.scrollLeft;
        var clonedItem = item.cloneNode(true);
        clonedItem.style.top = offsetTop + 'px';
        clonedItem.style.left = offsetLeft + 'px'; // Don't include children in the drag image

        var children = self._getSubtree(clonedItem);

        if (children) {
          clonedItem.removeChild(children);
        }

        if (self._isDefaultCheckBoxesEnabled() && self._isActionable(item, 'focus') && self._isActionable(item, 'select')) {
          var clonedSelector = clonedItem.getElementsByClassName('oj-treeview-selector')[0];
          clonedSelector.firstChild.selectedKeys = self.options.selected;
          clonedSelector.firstChild.rowKey = item.id;
        } // Drag image offset is based on the top left corner of the resulting drag image


        if (offsetTop < topmost) {
          topmost = offsetTop;
        }

        if (offsetLeft < leftmost) {
          leftmost = offsetLeft;
        }

        dragImage.appendChild(clonedItem); // @HTMLUpdateOK
      }); // : There's inconsistency in how the drag image offset is computed
      // for the native DnD impl and the polyfill. In the native impl, the offset is
      // relative to the top-left corner of the rendered drag image element. In the
      // polyfill, the offset is relative to the {top: 0, left: 0} position. To
      // reconcile this, we must make sure that the top-left corner of the rendered
      // drag image element is at the {top: 0, left: 0} position.

      var child;

      for (i = 0; i < dragImage.children.length; i++) {
        child = dragImage.children[i];
        child.style.top = parseFloat(child.style.top) - topmost + 'px';
        child.style.left = parseFloat(child.style.left) - leftmost + 'px';
      }

      var optionTypes = dragOptions.dataTypes;
      var dragDataTypes = typeof optionTypes === 'string' ? [optionTypes] : optionTypes || [];

      for (i = 0; i < dragDataTypes.length; i++) {
        dataTransfer.setData(dragDataTypes[i], JSON.stringify(dragData));
      } // Drag image has to be attached to the DOM when being assigned to the dataTransfer.
      // It has to be removed afterwards to prevent leaks.


      document.body.appendChild(dragImage); // @HTMLUpdateOK

      dataTransfer.setDragImage(dragImage, event.pageX - leftmost, event.pageY - topmost);
      setTimeout(function () {
        dragImage.parentElement.removeChild(dragImage);
      }, 0);
      var callback = dragOptions.dragStart;

      if (callback) {
        callback(event.originalEvent, {
          items: dragData
        });
      }
    },

    /**
     * Handles DnD drag and dragEnd events.
     * @param {Event} event The event.
     * @param {string} eventType The event type (drag or dragEnd).
     * @private
     */
    _handleDragSourceEvent: function _handleDragSourceEvent(event, eventType) {
      var callback = this._getDragOptions()[eventType];

      if (callback) {
        callback(event.originalEvent);
      }
    },
    _getTreeviewWidth: function _getTreeviewWidth() {
      return this.element[0].offsetWidth;
    },

    /**
     * Handles DnD dragEnter, dragOver, dragLeave, and drop events.
     * @param {Event} event The event.
     * @param {string} eventType The event type (dragEnter, dragOver, dragLeave, or drop).
     * @private
     */
    _handleDropTargetEvent: function _handleDropTargetEvent(event, eventType) {
      var dropOptions = this._getDropOptions();

      var optionTypes = dropOptions.dataTypes;
      var dropDataTypes = typeof optionTypes === 'string' ? [optionTypes] : optionTypes || [];
      var callback = dropOptions[eventType];

      var targetItem = this._getClosestItem(event.target);

      if (!targetItem) {
        return;
      } // Position drop effects based on the spacer (disclosure icon) because it takes up the entire item height


      var spacer = targetItem.getElementsByClassName('oj-treeview-spacer')[0];
      var spacerRect = spacer.getBoundingClientRect();
      var spacerTop = spacer.offsetTop;
      var spacerLeft = spacer.offsetLeft;
      var middleY = spacerTop + spacerRect.height / 2;

      var dropLineWidth = this._getTreeviewWidth();

      var position = 'inside';
      var relativeY = event.originalEvent.clientY - spacerRect.top;

      if (relativeY < 0.25 * spacerRect.height) {
        position = 'before';
      } else if (relativeY > 0.75 * spacerRect.height) {
        position = this._isExpanded(targetItem) ? 'first' : 'after';
      }

      if (callback) {
        callback(event.originalEvent, {
          item: targetItem,
          position: position
        });
      }

      for (var i = 0; i < dropDataTypes.length; i++) {
        var dataTypes = event.originalEvent.dataTransfer.types;

        if (dataTypes && dataTypes.indexOf(dropDataTypes[i]) >= 0) {
          event.preventDefault();
          break;
        }
      }

      if ((eventType === 'dragEnter' || eventType === 'dragOver') && event.originalEvent.defaultPrevented) {
        var isRTL = this._GetReadingDirection() === 'rtl'; // Draw the drop target effect on dragEnter and dragOver

        var dropLineTop = middleY;
        var dropLineLeft = isRTL ? // eslint-disable-next-line no-mixed-operators
        spacerLeft - dropLineWidth + spacerRect.width : spacerLeft + spacerRect.width;

        if (position === 'before') {
          dropLineTop -= spacerRect.height / 2;
        } else if (position === 'after' || position === 'first') {
          dropLineTop += spacerRect.height / 2;
        }

        if (position !== 'inside') {
          this._removeDropClass(targetItem);

          if (position === 'first') {
            // Align with the child items
            var spacerOffset = (isRTL ? -1 : 1) * spacerRect.width;
            dropLineLeft += spacerOffset;
          }

          this._dropLine.style.width = dropLineWidth - dropLineLeft + 'px';
          this._dropLine.style.left = dropLineLeft + 'px';
          this._dropLine.style.top = dropLineTop + 'px';
          this._dropLine.style.display = '';
        } else {
          this._dropLine.style.display = 'none';

          this._addDropClass(targetItem);
        }
      } else {
        if (eventType === 'dragEnd' && oj.DomUtils.isTouchSupported()) {
          // eslint-disable-next-line no-param-reassign
          this.ojTreeViewDragEvent = false;
          document.body.style.touchAction = 'auto';
        }

        this._dropLine.style.display = 'none';

        this._removeDropClass(targetItem);
      }
    },
    _addDropClass: function _addDropClass(item) {
      var itemContent = this._getItemContent(item);

      itemContent.classList.add('oj-treeview-drop-zone');
    },
    _removeDropClass: function _removeDropClass(item) {
      var itemContent = this._getItemContent(item);

      itemContent.classList.remove('oj-treeview-drop-zone');
    },
    // @inheritdoc
    _NotifyContextMenuGesture: function _NotifyContextMenuGesture(menu, event, eventType) {
      if (eventType === 'keyboard') {
        // If launched by Shift+F10, the context menu should be rendered next
        // to the currentItem.
        var launcher = this._currentItem ? this._getItemContent(this._currentItem) : this.element;
        var openOptions = {
          launcher: this._getRoot(),
          initialFocus: 'menu',
          position: {
            my: 'start top',
            at: 'start bottom',
            of: launcher
          }
        };

        this._OpenContextMenu(event, eventType, openOptions);
      } else if (!this.ojTreeViewDragEvent) {
        this._superApply(arguments);
      }
    },
    // @inheritdoc
    refresh: function refresh() {
      this._super();

      this._refreshId += 1;
      delete this.m_template;
      delete this.m_engine;
      delete this.m_dataSource;
      this._expandedChildrenMap = new Map();

      this._render();
    },
    // @inheritdoc
    getNodeBySubId: function getNodeBySubId(locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var key = locator.key;
      var subId = locator.subId;

      var item = this._getItemByKey(key);

      var ret;

      if (subId === 'oj-treeview-disclosure' && item) {
        ret = item.getElementsByClassName('oj-treeview-disclosure-icon')[0];
      } else if (subId === 'oj-treeview-item' && item) {
        ret = item.getElementsByClassName('oj-treeview-item-content')[0];
      } // Non-null locators have to be handled by the component subclasses


      return ret || null;
    },
    // @inheritdoc
    getSubIdByNode: function getSubIdByNode(node) {
      if (!this.element[0].contains(node)) {
        return null;
      }

      var subId;

      var disclosureIcon = this._getClosestDisclosureIcon(node);

      var item = this._getClosestItem(node);

      if (disclosureIcon) {
        subId = 'oj-treeview-disclosure';
      } else if (item) {
        subId = 'oj-treeview-item';
      } else {
        return null;
      }

      return {
        subId: subId,
        key: this._getKey(item)
      };
    },

    /**
     * {@ojinclude "name":"nodeContextDoc"}
     * @param {!Element} node - {@ojinclude "name":"nodeContextParam"}
     * @returns {Object|null} {@ojinclude "name":"nodeContextReturn"}
     *
     * @example {@ojinclude "name":"nodeContextExample"}
     *
     * @expose
     * @instance
     * @memberof oj.ojTreeView
     * @ojshortdesc Returns an object with context for the given child DOM node. See the Help documentation for more information.
     */
    getContextByNode: function getContextByNode(node) {
      if (!this.element[0].contains(node)) {
        return null;
      }

      var i;

      var item = this._getClosestItem(node);

      if (!item) {
        return null;
      }

      var itemParentChildren = item.parentNode.children;
      var treeViewItems = [];

      for (i = 0; i < itemParentChildren.length; i++) {
        if (itemParentChildren[i].classList.contains('oj-treeview-item')) {
          treeViewItems.push(itemParentChildren[i]);
        }
      }

      var context = {};
      context.subId = 'oj-treeview-item';
      context.index = treeViewItems.indexOf(item);
      context.parentKey = this._getKey(this._getParentItem(item));
      context.component = Components.__GetWidgetConstructor(this.element);

      if (this._FixRendererContext) {
        context = this._FixRendererContext(context);
      }

      var metadata = item['oj-item-metadata'];

      if (metadata) {
        context.metadata = metadata;
        context.data = item['oj-item-data'];
        context.datasource = this.options.data; // Merge properties from metadata into item context
        // Contains key, leaf, and depth

        var props = Object.keys(metadata);

        for (i = 0; i < props.length; i++) {
          var prop = props[i];
          context[prop] = metadata[prop];
        }
      } else {
        // Static content
        context.key = this._getKey(item);
        context.leaf = this._isLeaf(item);
        context.depth = this._getParents(item, '.oj-treeview-list').length;
      }

      return context;
    },
    // @inheritdoc
    // eslint-disable-next-line no-unused-vars
    _setOption: function _setOption(key, value, flags) {
      var self = this;
      var i;
      var items; // Call the super to update the property values

      this._superApply(arguments);

      if (key === 'expanded') {
        this._uiExpanded = self._uiExpanded.clear();
        this._expandedChildrenMap = new Map();
        items = this._getItems();

        for (i = 0; i < items.length; i++) {
          var itemKey = this._getKey(items[i]);

          if (self._isInitExpanded(itemKey)) {
            self._expand(items[i], true);
          } else {
            self._collapse(items[i], true);
          }
        }
      } else if (key === 'selection' || key === 'selected') {
        this._handleSelectedOption(key, value);
      } else if (key === 'currentItem') {
        this._resetFocus();
      } else if (key === 'data') {
        this._removeDataProviderEventListeners();

        this.options.data = value;

        this._addDataProviderEventListeners();

        this.refresh();
      } else {
        this.refresh();
      }
    },
    _SetupResources: function _SetupResources() {
      this._super();

      this._addDataProviderEventListeners();
    },
    _ReleaseResources: function _ReleaseResources() {
      this._super();

      this._removeDataProviderEventListeners();
    },
    // @inheritdoc
    _destroy: function _destroy() {
      // TODO
      this._removeDataProviderEventListeners(); // Call super at the end for destroy.


      this._super();
    },
    _addDataProviderEventListeners: function _addDataProviderEventListeners() {
      var dataProvider = this.options.data;

      if (dataProvider && oj.DataProviderFeatureChecker.isTreeDataProvider(dataProvider)) {
        this.m_handleModelMutateEventListener = this.handleModelMutateEvent.bind(this);
        this.m_handleModelRefreshEventListener = this.handleModelRefreshEvent.bind(this);
        dataProvider.addEventListener('mutate', this.m_handleModelMutateEventListener);
        dataProvider.addEventListener('refresh', this.m_handleModelRefreshEventListener);
      }
    },
    _removeDataProviderEventListeners: function _removeDataProviderEventListeners() {
      var dataProvider = this.options.data;

      if (dataProvider && oj.DataProviderFeatureChecker.isTreeDataProvider(dataProvider)) {
        dataProvider.removeEventListener('mutate', this.m_handleModelMutateEventListener);
        dataProvider.removeEventListener('refresh', this.m_handleModelRefreshEventListener);
      }
    },
    handleModelMutateEvent: function handleModelMutateEvent(event) {
      if (event.detail.remove != null) {
        this.handleModelRemoveEvent(event);
      }

      if (event.detail.add != null) {
        this.handleModelAddEvent(event);
      }

      if (event.detail.update != null) {
        this.handleModelChangeEvent(event);
      }
    },
    handleModelRemoveEvent: function handleModelRemoveEvent(event) {
      var self = this;
      var keys = event.detail.remove.keys;
      var removedKeys = [];

      if (keys == null || keys.size === 0) {
        return;
      }

      keys.forEach(function (key) {
        if (!event.detail.add || event.detail.add && !event.options.detail.add.keys.has(key)) {
          removedKeys = removedKeys.concat(self._removeAllChildrenOfParentKey(key));
        }
      });

      if (removedKeys.length === 0) {
        return;
      } // checks whether the removed item is selected, and adjust the value as needed


      var selected = this.options.selected;

      if (selected != null) {
        var newSelected = selected.delete(removedKeys); // update selected/selection option if it did changed

        if (selected !== newSelected) {
          this._userOptionChange('selected', newSelected, event);

          this._userOptionChange('selection', KeySet.KeySetUtils.toArray(newSelected), event);
        }
      } // checks whether the removed item is expanded, and adjust the value as needed


      var expanded = this.options.expanded;

      if (expanded != null) {
        var newExpanded = expanded.delete(removedKeys);

        this._uiExpanded.delete(removedKeys); // update selection option if it did changed


        if (expanded !== newExpanded) {
          this._userOptionChange('expanded', newExpanded, null);
        }
      }

      this._resetFocus();
    },
    _changeNodeToLeaf: function _changeNodeToLeaf(item, subtree) {
      if (item === this.element[0]) {
        return;
      }

      item.removeChild(subtree); // eslint-disable-next-line no-param-reassign

      item['oj-item-metadata'].leaf = true;
      item.classList.add('oj-treeview-leaf');
      item.classList.remove('oj-expanded');
      item.removeAttribute('aria-expanded');
      item.classList.remove('oj-collapsed');

      var key = this._getKey(item);

      var keys = [];
      keys.push(key);
      var expanded = this.options.expanded;

      if (expanded != null) {
        var newExpanded = expanded.delete(keys);

        this._uiExpanded.delete(keys); // update selection option if it did changed


        if (expanded !== newExpanded) {
          this._userOptionChange('expanded', newExpanded, null);
        }
      }

      var disclosureIcon = item.getElementsByClassName('oj-treeview-spacer')[0];

      this._removeDisclosureClasses(disclosureIcon);
    },
    _changeNodeToParent: function _changeNodeToParent(item) {
      // eslint-disable-next-line no-param-reassign
      item['oj-item-metadata'].leaf = false;
      item.classList.remove('oj-treeview-leaf');
      item.classList.add('oj-collapsed');
      item.setAttribute('aria-expanded', false);
      var disclosureIcon = item.getElementsByClassName('oj-treeview-spacer')[0];

      this._addDisclosureClasses(disclosureIcon);
    },
    _removeAllChildrenOfParentKey: function _removeAllChildrenOfParentKey(key) {
      var self = this;
      var removedKeys = [];

      var elem = this._getItemByKey(key);

      if (elem) {
        this._getChildItems(elem).forEach(function (child) {
          var childkey = self._getKey(child);

          var childKeys = self._removeAllChildrenOfParentKey(childkey);

          removedKeys = removedKeys.concat(childKeys);
        });

        var subtree = elem.parentNode;
        subtree.removeChild(elem);

        this._keyList.delete(key);

        removedKeys.push(key);

        if (subtree.getElementsByTagName('li').length === 0) {
          self._changeNodeToLeaf(subtree.parentNode, subtree);
        }
      }

      return removedKeys;
    },
    _isLeafIcon: function _isLeafIcon(item) {
      return item.classList.contains('oj-treeview-leaf');
    },
    handleModelReorder: function handleModelReorder(moveKey, locationKey, afterFlag) {
      var locationItem = this._getItemByKey(locationKey);

      var locationItemParent = locationItem.parentElement;

      var reorderItem = this._getItemByKey(moveKey);

      var reorderParent = reorderItem.parentElement;
      var subtree = reorderItem.parentNode;
      reorderParent.removeChild(reorderItem);

      if (reorderParent.getElementsByTagName('li').length === 0) {
        this._changeNodeToLeaf(subtree.parentNode, subtree);
      }

      if (afterFlag) {
        locationItemParent.insertBefore(reorderItem, locationItem.nextSibling);
      } else {
        locationItemParent.insertBefore(reorderItem, locationItem);
      }
    },
    getLastItemKey: function getLastItemKey(list) {
      return this._getKey(list[list.length - 1]);
    },
    handleModelAddEvent: function handleModelAddEvent(event) {
      var addEvent = event.detail.add;
      var data = addEvent.data;
      var metadata = addEvent.metadata;
      var keys = [];
      var afterKeys;
      var parentKeys = addEvent.parentKeys;
      var indexes = addEvent.indexes;
      var i = 0;
      var self = this;
      var addKeys = event.detail.add.keys;
      addKeys.forEach(function (key) {
        if (!event.detail.remove || event.detail.remove && !event.options.detail.remove.keys.has(key)) {
          keys.push(key);
        } else if (addEvent.addBeforeKeys && addEvent.addBeforeKeys[i] && addEvent.addBeforeKeys.length !== 0) {
          this.handleModelReorder(key, addEvent.addBeforeKeys[i], false);
        } else {
          var locationKey;

          if (addEvent.parentKeys && addEvent.parentKeys[i] && addEvent.parentKeys.length !== 0) {
            var parent = this._getItemByKey(addEvent.parentKeys[i]);

            var parentItemList = this._getChildItems(parent);

            locationKey = this.getLastItemKey(parentItemList);
          } else {
            var rootList = this._getItems();

            locationKey = this.getLastItemKey(rootList);
          }

          if (locationKey) {
            this.handleModelReorder(key, locationKey, true);
          }
        }

        i += 1;
      }.bind(this));
      parentKeys.forEach(function (key) {
        var parentItem = self._getItemByKey(key);

        if (parentItem && self._isLeafIcon(parentItem)) {
          self._changeNodeToParent(parentItem);
        }
      }); // afterKeys is deprecated, but continue to support it until we can remove it.
      // forEach can be called on both array and set.

      var afterKeyIter = addEvent.addBeforeKeys ? addEvent.addBeforeKeys : addEvent.afterKeys;

      if (afterKeyIter) {
        afterKeys = [];
        afterKeyIter.forEach(function (key) {
          afterKeys.push(key);
        });
      }

      if (data != null && keys != null && keys.length > 0 && data.length > 0 && keys.length === data.length && (indexes == null || indexes.length === data.length)) {
        for (i = 0; i < data.length; i++) {
          var index = indexes == null ? this._getIndex(afterKeys, i) + 1 : indexes[i];
          var parentKey = parentKeys[i];

          var parentItem = this._getItemByKey(parentKey);

          var subtree;

          if (parentKey == null) {
            subtree = this._getRoot();

            if (subtree) {
              this._renderItem(subtree, {
                data: [data[i]],
                metadata: [metadata[i]]
              }, 0, index);
            }
          } else if (parentItem) {
            subtree = this._getSubtree(parentItem);

            if (!subtree && parentItem && self._isInitExpanded(parentKey)) {
              subtree = document.createElement('ul');
              subtree.classList.add('oj-treeview-list');
              subtree.setAttribute('role', 'group');
              parentItem.appendChild(subtree); // @HTMLUpdateOK
            }

            if (subtree) {
              this._renderItem(subtree, {
                data: [data[i]],
                metadata: [metadata[i]]
              }, 0, index);
            }
          }
        }
      }
    },
    handleModelChangeEvent: function handleModelChangeEvent(event) {
      var changeEvent = event.detail.update;
      var data = changeEvent.data;
      var metadata = changeEvent.metadata;
      var keys = [];
      changeEvent.keys.forEach(function (key) {
        keys.push(key);
      });

      for (var i = 0; i < data.length; i++) {
        var elem = this._getItemByKey(keys[i]);

        if (elem != null) {
          var insertIndex = this._indexToParent(elem);

          this._renderItem(null, {
            data: [data[i]],
            metadata: [metadata[i]]
          }, 0, insertIndex, true);
        }
      }

      this._resetFocus();
    },
    _indexToParent: function _indexToParent(elem) {
      var index = 0;

      for (var i = 0; i < elem.parentNode.children.length; i++) {
        if (elem.parentNode.children[i] === elem) {
          index = i;
          break;
        }
      }

      return index;
    },
    handleModelRefreshEvent: function handleModelRefreshEvent() {
      this.refresh();
    },
    _isSkeletonSupported: function _isSkeletonSupported() {
      var defaults = this._getOptionDefaults();

      return defaults.loadIndicator === 'skeleton';
    },
    _getOptionDefaults: function _getOptionDefaults() {
      if (this.defaultOptions == null) {
        this.defaultOptions = ThemeUtils.parseJSONFromFontFamily(this._getOptionDefaultsStyleClass());
      }

      return this.defaultOptions;
    },
    _getOptionDefaultsStyleClass: function _getOptionDefaultsStyleClass() {
      return 'oj-treeview-option-defaults';
    },
    _renderChildSkeletons: function _renderChildSkeletons(parentKey) {
      var parentItem = this._getItemByKey(parentKey);

      this._removeExistingSkeletons(parentItem);

      var disclosureIconWidth = parentItem.getElementsByTagName('ins')[0].offsetWidth;
      var isRTL = this._GetReadingDirection() === 'rtl';

      var threeItemedSkeleton = this._buildThreeItemedSkeleton();

      var skeletonContainer = this._buildSkeletonContainer();

      var skeletonMargin = disclosureIconWidth;

      var depth = this._getDepth(parentItem);

      if (isRTL) {
        skeletonContainer.style.marginRight = skeletonMargin + disclosureIconWidth / depth + 'px';
      } else {
        skeletonContainer.style.marginLeft = skeletonMargin + disclosureIconWidth / depth + 'px';
      }

      skeletonContainer.appendChild(threeItemedSkeleton); // @HTMLUpdateOK

      parentItem.appendChild(skeletonContainer); // @HTMLUpdateOK
    },
    _renderInitialSkeletons: function _renderInitialSkeletons() {
      this._removeExistingSkeletons(this.element[0]);

      var threeItemedSkeleton = this._buildThreeItemedSkeleton();

      var twoItemedSkeleton = this._buildTwoItemedSkeleton();

      var skeletonContainer = this._buildSkeletonContainer();

      skeletonContainer.appendChild(threeItemedSkeleton); // @HTMLUpdateOK

      skeletonContainer.appendChild(twoItemedSkeleton); // @HTMLUpdateOK

      this.element[0].classList.add('oj-complete');
      this.element[0].appendChild(skeletonContainer); // @HTMLUpdateOK

      var skeletonHeight = skeletonContainer.offsetHeight;
      var treeviewHeight = this.element[0].offsetHeight;
      var treeviewItemHeight = skeletonHeight / 5; // number of skeleton items

      var i = 0;

      if (skeletonHeight < treeviewHeight) {
        do {
          if (i % 2 === 0) {
            skeletonHeight += treeviewItemHeight * 3; // number of skeleton items

            skeletonContainer.appendChild(this._buildThreeItemedSkeleton()); // @HTMLUpdateOK
          } else {
            skeletonHeight += treeviewItemHeight * 2; // number of skeleton items

            skeletonContainer.appendChild(this._buildTwoItemedSkeleton()); // @HTMLUpdateOK
          }

          i += 1;
        } while (skeletonHeight <= treeviewHeight);
      }

      if (skeletonHeight > treeviewHeight) {
        var skeletonContents = skeletonContainer.getElementsByClassName('oj-treeview-skeleton-content');

        for (i = skeletonContents.length - 1; i >= 0; i--) {
          skeletonHeight -= treeviewItemHeight;
          skeletonContainer.removeChild(skeletonContents[i]);

          if (skeletonHeight <= treeviewHeight) {
            break;
          }
        }
      }
    },
    _removeExistingSkeletons: function _removeExistingSkeletons(item) {
      var existingSkeletonContainers = item.getElementsByClassName('oj-treeview-skeleton-container');

      for (var i = 0; i < existingSkeletonContainers.length; i++) {
        item.removeChild(existingSkeletonContainers[i]);
      }
    },
    _getSkeletonContainer: function _getSkeletonContainer(item) {
      return item.getElementsByClassName('oj-treeview-skeleton-container')[0];
    },
    _removeSkeleton: function _removeSkeleton(parentKey) {
      return new Promise(function (resolve) {
        var self = this;

        var busyResolve = self._addBusyState('removing skeleton');

        var skeletonContainer;

        if (parentKey === null) {
          skeletonContainer = this._getSkeletonContainer(self.element[0]);
        } else {
          skeletonContainer = this._getSkeletonContainer(this._getItemByKey(parentKey));
        }

        if (!skeletonContainer) {
          busyResolve();
          resolve();
        } else {
          var animatedElements = skeletonContainer.getElementsByClassName('oj-animation-skeleton');

          for (var i = 0; i < animatedElements.length; i++) {
            animatedElements[i].classList.remove('oj-animation-skeleton');
          }

          skeletonContainer.classList.add('oj-animation-skeleton-fade-out');
          skeletonContainer.addEventListener('animationend', function () {
            if (skeletonContainer.parentElement) {
              skeletonContainer.parentElement.removeChild(skeletonContainer);
            }

            busyResolve();
            resolve();
          });
        }
      }.bind(this));
    },
    _buildThreeItemedSkeleton: function _buildThreeItemedSkeleton() {
      var fragment = this._buildTwoItemedSkeleton();

      var leaf = this._buildSkeletonLeafContent();

      fragment.appendChild(leaf); // @HTMLUpdateOK

      return fragment;
    },
    _buildTwoItemedSkeleton: function _buildTwoItemedSkeleton() {
      var fragment = new DocumentFragment();

      var firstChild = this._buildSkeletonContent(false);

      fragment.appendChild(firstChild); // @HTMLUpdateOK

      var secondChild = this._buildSkeletonContent(true);

      fragment.appendChild(secondChild); // @HTMLUpdateOK

      return fragment;
    },
    _buildSkeletonContainer: function _buildSkeletonContainer() {
      var skeletonContainer = document.createElement('div');
      skeletonContainer.classList.add('oj-treeview-skeleton-container');
      skeletonContainer.classList.add('oj-animation-skeleton-fade-in');
      return skeletonContainer;
    },
    _buildSkeletonContent: function _buildSkeletonContent(child) {
      var contentDiv = document.createElement('div');
      contentDiv.classList.add('oj-treeview-skeleton-content');

      var carrotDiv = this._buildSkeletonCarrot();

      if (child) {
        carrotDiv.classList.add('oj-treeview-skeleton-child');
      }

      contentDiv.appendChild(carrotDiv); // @HTMLUpdateOK

      contentDiv.appendChild(this._buildSkeletonItem()); // @HTMLUpdateOK

      return contentDiv;
    },
    _buildSkeletonCarrot: function _buildSkeletonCarrot() {
      var carrotDiv = document.createElement('div');
      carrotDiv.classList.add('oj-treeview-skeleton-carrot');
      carrotDiv.classList.add('oj-animation-skeleton');
      return carrotDiv;
    },
    _buildSkeletonItem: function _buildSkeletonItem() {
      var itemDiv = document.createElement('div');
      itemDiv.classList.add('oj-treeview-skeleton-item');
      itemDiv.classList.add('oj-animation-skeleton');
      return itemDiv;
    },
    _buildSkeletonLeafContent: function _buildSkeletonLeafContent() {
      var contentDiv = document.createElement('div');
      contentDiv.classList.add('oj-treeview-skeleton-content');
      contentDiv.appendChild(this._buildSkeletonLeafItem()); // @HTMLUpdateOK

      return contentDiv;
    },
    _buildSkeletonLeafItem: function _buildSkeletonLeafItem() {
      var leafDiv = document.createElement('div');
      leafDiv.classList.add('oj-treeview-skeleton-leaf');
      leafDiv.classList.add('oj-animation-skeleton');
      return leafDiv;
    },
    _closest: function _closest(element, selector) {
      if (!element) {
        return null;
      }

      if (!element.closest) {
        do {
          if (this._matches(element, selector)) return element; // eslint-disable-next-line no-param-reassign

          element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);

        return null;
      }

      return element.closest(selector);
    },
    _getParents: function _getParents(elem, parentSelector) {
      var parents = []; // eslint-disable-next-line no-param-reassign

      for (; elem && elem !== document; elem = elem.parentNode) {
        if (this._matches(elem, parentSelector)) {
          parents.push(elem);
        }
      }

      return parents;
    },
    _getNextSibling: function _getNextSibling(elem, selector) {
      var sibling = elem.nextElementSibling;
      if (!selector) return sibling;

      while (sibling) {
        if (this._matches(sibling, selector)) return sibling;
        sibling = sibling.nextElementSibling;
      }

      return null;
    },
    _getPreviousSibling: function _getPreviousSibling(elem, selector) {
      var sibling = elem.previousElementSibling;
      if (!selector) return sibling;

      while (sibling) {
        if (this._matches(sibling, selector)) return sibling;
        sibling = sibling.previousElementSibling;
      }

      return null;
    },
    _matches: function _matches(elem, selector) {
      if (!elem.matches) {
        // eslint-disable-next-line no-param-reassign
        elem.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }

      return elem.matches(selector);
    }
  });
})(); // Fragments

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
 *       <td rowspan="2">Item</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Focus on the item. If <code class="prettyprint">selectionMode</code> is enabled, selects the item as well.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Press & Hold</kbd></td>
 *       <td>Display context menu</td>
 *     </tr>
 *     <tr>
 *       <td>Disclosure Icon</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Expand or collapse the item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment touchDoc - Used in touch gesture section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreeView
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
 *       <td rowspan = "12" nowrap>Item</td>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Navigates to next focusable element on page.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>Navigates to previous focusable element on page.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Moves focus to the item below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Moves focus to the item above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>On an expanded item, collapses the item. Otherwise, move focus to the item above. The action is swapped with <kbd>RightArrow</kbd> in RTL locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>On a collapsed item, expands the item. Otherwise, move focus to the item below. The action is swapped with <kbd>LeftArrow</kbd> in RTL locales.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+DownArrow</kbd></td>
 *       <td>Extends the selection to the item below. Only applicable if the multiple selection is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+UpArrow</kbd></td>
 *       <td>Extends the selection to the item above. Only applicable if the multiple selection is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Space</kbd></td>
 *       <td>Toggles the selection of the current item and deselects the other items.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Selects the current item and deselects the other items. No op if the current item is already selected.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl+Space/Enter / CMD+Space/Enter</kbd></td>
 *       <td>Toggles the selection of the current item while maintaining previously selected items. Only applicable if the multiple selection is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Space/Enter</kbd></td>
 *       <td>Selects contiguous items from the last selected item to the current item. Only applicable if the multiple selection is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl+A / CMD+A</kbd></td>
 *       <td>If selectionMode is multiple, will select all selectable nodes.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * @ojfragment keyboardDoc - Used in keyboard section of classdesc, and standalone gesture doc
 * @memberof oj.ojTreeView
 */
// ////////////////     SUB-IDS     //////////////////

/**
 * <p>Sub-ID for TreeView items. See the <a href="#getNodeBySubId">getNodeBySubId</a>
 * method for details.</p>
 *
 * @ojsubid oj-treeview-item
 * @memberof oj.ojTreeView
 *
 * @example <caption>Get the item with key 'foo':</caption>
 * var item = myTreeView.getNodeBySubId({'subId': 'oj-treeview-item', 'key': 'foo'});
 */

/**
 * <p>Sub-ID for TreeView disclosure icons. See the <a href="#getNodeBySubId">getNodeBySubId</a>
 * method for details.</p>
 *
 * @ojsubid oj-treeview-disclosure
 * @memberof oj.ojTreeView
 *
 * @example <caption>Get the disclosure icon for the non-leaf item with key 'foo':</caption>
 * var item = myTreeView.getNodeBySubId({'subId': 'oj-treeview-disclosure', 'key': 'foo'});
 */

/**
 * <p>Context for TreeView items.</p>
 *
 * @property {Element} componentElement The TreeView element.
 * @property {Object} data The data object for the item (not available for static content).
 * @property {oj.TreeDataProvider|oj.TreeDataSource} datasource A reference to the data source object (not available for static content).
 * @property {number} depth The depth of the item. The depth of the first level children under the invisible root is 1.
 * @property {number} index The index of the item relative to its parent, where 0 is the index of the first item.
 * @property {Object} key The key of the item.
 * @property {boolean} leaf Whether the item is a leaf item.
 * @property {Object} parentKey The key of the parent item. The parent key is null for root item.
 * @property {oj.ItemMetadata<K>} metadata The metadata of the item (not available for static content).
 * @ojsignature [{target:"Type", value:"oj.TreeDataProvider|oj.TreeDataSource", for:"datasource", consumedBy:"js"},
 *               {target:"Type", value:"oj.TreeDataProvider", for:"datasource", consumedBy:"ts"}]
 *
 * @ojnodecontext oj-treeview-item
 * @memberof oj.ojTreeView
 */
// Slots

/**
 * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the list. The slot content must be a &lt;template> element.
 * The content of the template could either include the &lt;li> element, in which case that will be used as
 * the root of the item.  Or it can be just the content which excludes the &lt;li> element.</p>
 * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
 * <ul>
 *   <li>$current - an object that contains information for the current item. (See [oj.ojTreeView.ItemTemplateContext]{@link oj.ojTreeView.ItemTemplateContext} or the table below for a list of properties available on $current)</li>
 *   <li>alias - if as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
 * </ul>
 *
 * @ojslot itemTemplate
 * @ojshortdesc The itemTemplate slot is used to specify the template for rendering each item in the tree. See the Help documentation for more information.
 * @ojmaxitems 1
 * @memberof oj.ojTreeView
 * @ojslotitemprops oj.ojTreeView.ItemTemplateContext
 * @example <caption>Initialize the TreeView with an inline item template specified:</caption>
 * &lt;oj-tree-view>
 *   &lt;template slot='itemTemplate'>
 *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
 *   &lt;template>
 * &lt;/oj-tree-view>
 */

/**
 * @typedef {Object} oj.ojTreeView.ItemTemplateContext
 * @property {Element} componentElement The &lt;oj-tree-view> custom element
 * @property {Object} data The data for the current item being rendered
 * @property {number} index The zero-based index of the curent item
 * @property {any} key The key of the current item being rendered
 * @property {number} depth The depth of the current item being rendered. The depth of the first level children under the invisible root is 1.
 * @property {boolean} leaf True if the current item is a leaf node.
 * @property {any} parentkey The key of the parent item. The parent key is null for root nodes.
 */



/* global __oj_tree_view_metadata:false */
(function () {
  __oj_tree_view_metadata.extension._WIDGET_NAME = 'ojTreeView';
  oj.CustomElementBridge.register('oj-tree-view', {
    metadata: __oj_tree_view_metadata
  });
})();

});