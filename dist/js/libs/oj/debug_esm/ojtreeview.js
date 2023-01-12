/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import oj from 'ojs/ojcore-base';
import $ from 'jquery';
import Context from 'ojs/ojcontext';
import { parseJSONFromFontFamily, getCachedCSSVarValues } from 'ojs/ojthemeutils';
import { __GetWidgetConstructor } from 'ojs/ojcomponentcore';
import { fadeIn, startAnimation, fadeOut } from 'ojs/ojanimation';
import { isTouchSupported, isMetaKeyPressed } from 'ojs/ojdomutils';
import { error, info } from 'ojs/ojlogger';
import { __getTemplateEngine } from 'ojs/ojconfig';
import { KeySetImpl, KeySetUtils, AllKeySetImpl } from 'ojs/ojkeyset';
import 'ojs/ojselector';
import 'ojdnd';
import { CustomElementUtils, ElementUtils } from 'ojs/ojcustomelement-utils';
import { areKeySetsEqual, disableAllFocusableElements, isArrowUpKeyEvent, isArrowDownKeyEvent, isSpaceBarKeyEvent, isFromDefaultSelector, isArrowLeftKeyEvent, isArrowRightKeyEvent, isEnterKeyEvent, isLetterAKeyEvent, isSafari, getAddEventKeysResult, getEventDetail } from 'ojs/ojdatacollection-common';
import { getTranslatedString } from 'ojs/ojtranslation';

class TreeviewSelectionManager {
  constructor(
    rawData,
    attributesMap = { keyAttributes: 'id', childrenAttribute: 'children' },
    createOptimizedKeyMap = (m) => new Map(m),
    createOptimizedKeySet = (s) => new Set(s)
  ) {
    this.data = rawData;
    this.createOptimizedKeyMap = createOptimizedKeyMap;
    this.createOptimizedKeySet = createOptimizedKeySet;
    this.keyAttr = attributesMap.keyAttributes;
    this.childrenAttr = attributesMap.childrenAttribute;

    // Generates Map(parentKey: parentData) and set of all keys from raw data
    const populateParentKeyNodeMap = (data, parentKeyNodeMap, allKeys) => {
      data.forEach((child) => {
        allKeys.add(child[this.keyAttr]);
        if (child[this.childrenAttr] && child[this.childrenAttr].length > 0) {
          parentKeyNodeMap.set(child[this.keyAttr], child);
          populateParentKeyNodeMap(child[this.childrenAttr], parentKeyNodeMap, allKeys);
        }
      });
    };
    this.parentKeyNodeMap = this.createOptimizedKeyMap();
    this.allKeys = this.createOptimizedKeySet();
    populateParentKeyNodeMap(this.data, this.parentKeyNodeMap, this.allKeys);
  }

  // Computes actual selection from given set of keys. Previous keys optional for diffing.
  computeSelection(currentKeySet, previousKeySet = new KeySetImpl()) {
    // Derive the set of leaves that becomes selected
    const currentKeys = this.normalizeKeySet(currentKeySet);
    const previousKeys = this.normalizeKeySet(previousKeySet);
    const newKeys = currentKeys.delete(previousKeys.values());
    const oldKeys = previousKeys.delete(currentKeys.values());
    const deselectedLeaves = this.reduceToLeaves(oldKeys.values());
    const selectedLeaves = this.createOptimizedKeySet(
      new Set(
        [
          ...[...currentKeys.values()].filter((key) => !this.parentKeyNodeMap.has(key)),
          ...this.reduceToLeaves(newKeys.values())
        ].filter((key) => !deselectedLeaves.has(key))
      )
    );

    // From selected leaves, derive parent selection states
    const actualSelection = {
      selectedLeaves: selectedLeaves,
      selectedParents: this.createOptimizedKeySet(),
      partialParents: this.createOptimizedKeySet()
    };
    this.assignParentSelection(
      { children: this.data },
      { selected: 0, partial: 0 },
      actualSelection
    );

    // Overall selection = selected leaves + selected parents
    actualSelection.selected = this.createOptimizedKeySet([
      ...actualSelection.selectedLeaves.values(),
      ...actualSelection.selectedParents.values()
    ]);

    return {
      selected: new KeySetImpl(actualSelection.selected),
      selectedLeaves: new KeySetImpl(actualSelection.selectedLeaves),
      selectedParents: new KeySetImpl(actualSelection.selectedParents),
      partialParents: new KeySetImpl(actualSelection.partialParents)
    };
  }

  // Reduces given keys (e.g. containing parent keys) to a set of associated leaf keys
  reduceToLeaves(keys) {
    const getLeafKeys = (node, leafKeys) => {
      const isLeaf = !this.parentKeyNodeMap.has(node[this.keyAttr]);
      if (isLeaf) {
        leafKeys.add(node[this.keyAttr]);
        return;
      }
      node[this.childrenAttr].forEach((child) => getLeafKeys(child, leafKeys));
    };

    const leafKeys = this.createOptimizedKeySet();
    keys.forEach(
      (key) =>
        this.parentKeyNodeMap.has(key)
          ? getLeafKeys(this.parentKeyNodeMap.get(key), leafKeys)
          : leafKeys.add(key),
      this
    );
    return leafKeys;
  }

  // Derives parent states (selected, partial) from selected leaves
  assignParentSelection(node, siblingsSelection, selected) {
    const isLeaf =
      node[this.keyAttr] !== undefined && !this.parentKeyNodeMap.has(node[this.keyAttr]);
    if (isLeaf) {
      if (selected.selectedLeaves.has(node[this.keyAttr])) {
        // eslint-disable-next-line no-param-reassign
        siblingsSelection.selected += 1;
      }
    } else {
      const childrenSelection = { selected: 0, partial: 0 };
      node[this.childrenAttr].forEach((child) =>
        this.assignParentSelection(child, childrenSelection, selected)
      );

      if (
        node[this.keyAttr] === undefined ||
        childrenSelection.selected + childrenSelection.partial === 0
      ) {
        return;
      }

      if (childrenSelection.selected === node[this.childrenAttr].length) {
        selected.selectedParents.add(node[this.keyAttr]);
        // eslint-disable-next-line no-param-reassign
        siblingsSelection.selected += 1;
      } else {
        selected.partialParents.add(node[this.keyAttr]);
        // eslint-disable-next-line no-param-reassign
        siblingsSelection.partial += 1;
      }
    }
  }

  // Normalizes given keyset (e.g. if it's an AllKeySetImpl) to a KeySetImpl
  normalizeKeySet(keySet) {
    return keySet.isAddAll() ? new KeySetImpl(this.allKeys).delete(keySet.deletedValues()) : keySet;
  }
}

/**
 * @ojcomponent oj.ojTreeView
 * @augments oj.baseComponent
 * @since 4.0.0
 * @ojimportmembers oj.ojSharedContextMenu
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
 * @ojoracleicon 'oj-ux-ico-tree-view'
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
 * <li><b>ArrayTreeDataProvider</b> - Use this when the underlying data is an array.
 *  See the documentation for <a href="ArrayTreeDataProvider.html">ArrayTreeDataProvider</a>
 * for more details on the available options.</li>
 * </ul>
 * <p>There are two types of TreeDataSource that are available out of the box:</p>
 * <ul>
 * <li><b>oj.JsonTreeDataSource</b> (deprecated) - Use this when the underlying data is a JSON object.
 * See the documentation for <a href="JsonTreeDataSource.html">JsonTreeDataSource</a>
 * for more details on the available options.</li>
 * <li><b>oj.CollectionTreeDataSource</b> (deprecated) - Use this when Collection is the model for each group of data.
 * See the documentation for <a href="CollectionTreeDataSource.html">CollectionTreeDataSource</a>
 * for more details on the available options.</li>
 * </ul>
 *
 * <p>Example of tree data provider content:</p>
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-tree-view data="[[dataprovider]]">
 * &lt;/oj-tree-view>
 * </code></pre>
 * <p>Check out the ArrayTreeDataProvider keys demo.</p>
 *
 * <p>The second way is using static HTML content as data.</p>
 * <p>Note that any manipulation of static HTML content, including manipulating content generated through Knockout (for example, updating observableArray in a foreach binding), is not supported.<p>
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
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>To facilitate drag and drop including item reordering using only keyboard, application must ensure that either to expose the functionality using context menu, and/or
 * allow users to perform the functionality with the appropriate keystroke.  You can find examples of how this can be done in the cookbook demos.</p>
 *
 * <p>Nesting collection components such as ListView, Table, TreeView, and TreeView inside of TreeView is not supported.</p>
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
 * <p>Applications can customize animations triggered by actions in TreeView by overriding action specific style classes on the animated item.  See the documentation of <a href="AnimationUtils.html">AnimationUtils</a>
 *    class for details.</p>
 *
 * <p>The following are actions in which applications can use to customize animation effects.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Action</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>expand</kbd></td>
 *       <td>When user expands an item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>collapse</kbd></td>
 *       <td>When user collapses an item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 */

//-----------------------------------------------------
//                   Fragments
//-----------------------------------------------------
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
 *       <td rowspan = "13" nowrap>Item</td>
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
 *       <td>Extends the selection to the item below. Only applicable if the multiple or leafOnly selection is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+UpArrow</kbd></td>
 *       <td>Extends the selection to the item above. Only applicable if the multiple or leafOnly selection is enabled.</td>
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
 *       <td>Toggles the selection of the current item while maintaining previously selected items. Only applicable if the multiple or leafOnly selection is enabled.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Space/Enter</kbd></td>
 *       <td>Selects contiguous items from the last selected item to the current item. Only applicable if the multiple or leafOnly selection is enabled.</td>
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

//-----------------------------------------------------
//                   Sub-ids
//-----------------------------------------------------
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
 * @property {ItemMetadata<K>} metadata The metadata of the item (not available for static content).
 * @ojsignature [{target:"Type", value:"oj.TreeDataProvider|oj.TreeDataSource", for:"datasource", consumedBy:"js"},
 *               {target:"Type", value:"oj.TreeDataProvider", for:"datasource", consumedBy:"ts"}]
 *
 * @ojnodecontext oj-treeview-item
 * @memberof oj.ojTreeView
 */

//-----------------------------------------------------
//                   Slots
//-----------------------------------------------------
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
 * @ojtemplateslotprops oj.ojTreeView.ItemTemplateContext
 * @example <caption>Initialize the TreeView with an inline item template specified:</caption>
 * &lt;oj-tree-view>
 *   &lt;template slot='itemTemplate'>
 *     &lt;span>&lt;oj-bind-text value='[[$current.data.name]]'>&lt;/span>
 *   &lt;template>
 * &lt;/oj-tree-view>
 */
/**
  @typedef {Object} oj.ojTreeView.ItemTemplateContext
  @property {Element} componentElement The &lt;oj-tree-view> custom element.
  @property {Object} data The data for the current item being rendered.
  @property {number} index The zero-based index of the current item.
  @property {any} key The key of the current item being rendered.
  @property {number} depth The depth of the current item being rendered. The depth of the first level children under the invisible root is 1.
  @property {boolean} leaf True if the current item is a leaf node.
  @property {any} parentkey The key of the parent item. The parent key is null for root nodes.
  @property {ItemMetadata<K>} metadata The metadata of the item.
  @ojsignature [{target:"Type", value:"<K = any,D = any>", for:"genericTypeParameters"},
  {target:"Type", value:"D", for:"data", jsdocOverride: true},
  {target:"Type", value:"K", for:"key", jsdocOverride: true},
  {target:"Type", value:"K", for:"parentkey", jsdocOverride: true}]
 */

//-----------------------------------------------------
//                   Styling
//-----------------------------------------------------
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
 * @ojstyleselector "oj-tree-view *"
 * @memberof oj.ojTreeView
 */
/**
 * @ojstylevariableset oj-tree-view-css-set1
 * @ojstylevariable oj-tree-view-row-height {description: "Tree view row height", formats: ["length"], help: "#css-variables"}
 * @ojstylevariable oj-tree-view-text-color {description: "Tree view text color", formats: ["color"], help: "#css-variables"}
 * @ojstylevariable oj-tree-view-indent-width {description: "Tree view indent width", formats: ["length"], help: "#css-variables"}
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
       * The data source for the TreeView. Accepts an instance of TreeDataProvider or TreeDataSource.
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
       * @ojsignature {target: "Type", value: "TreeDataProvider<K, D>"}
       * @ojwebelementstatus {type: "unsupported", since: "13.0.0",
       *   description: "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."}
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">data</code> attribute specified:</caption>
       * &lt;oj-tree-view data='{{myDataProvider}}'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">data</code> property after initialization:</caption>
       * // getter
       * var dataValue = myTreeView.data;
       *
       * // setter
       * myTreeView.data = new ArrayTreeDataProvider(myArray);
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
         * @name dnd.drag
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
         * is an array of objects, with each object representing a model object from the underlying data source. For example, if the underlying data is an Collection, then this
         * would be a Model object. Note that when static HTML is used, then the value would be the HTML string of the selected item.<br><br><br>
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
         * @name dnd.drop
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
         * If the application needs to look at the data for the item being dropped on, it can use the <code class="prettyprint">Context.getContextByNode</code> method.
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
       * myTreeView.expanded = new KeySetImpl(['item1', 'item2']);
       *
       * @example <caption>Initialize the TreeView with all items expanded:</caption>
       * myTreeView.expanded = new AllKeySetImpl();
       */
      expanded: new KeySetImpl(),

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
         * @property {ItemMetadata<K>} metadata The metadata of the item (not available for static content).
         * @property {TreeDataProvider<K, D> | Object} datasource A reference to the data source object (not available for static content).
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
         * @name item.focusable
         * @ojshortdesc Specifies whether the item can receive keyboard focus. See the Help documentation for more information.
         * @memberof! oj.ojTreeView
         * @instance
         * @type {function(Object):boolean|null}
         * @ojsignature {target: "Type",
         *               value: "?((itemContext: oj.ojTreeView.ItemContext<K,D>) => boolean)",
         *               jsdocOverride: true}
         * @ojdeprecated {since: '13.0.0', description: 'Not accessible by screen reader.'}
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
         * @name item.renderer
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
         * @name item.selectable
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
       * scrollPolicy options.
       * <p>
       * The following options are supported:
       * <ul>
       *   <li>maxCount: Maximum rows which will be displayed before fetching more rows will be stopped.</li>
       * </ul>
       *
       * @ojshortdesc Specifies fetch options for scrolling behaviors that trigger data fetches. See the Help documentation for more information.
       * @expose
       * @instance
       * @memberof! oj.ojTreeView
       * @type {Object.<number>|null}
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
       * &lt;oj-tree-view scroll-policy-options.max-count='1000'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scroll-policy-options</code> attribute after initialization:</caption>
       * // getter
       * var maxCountValue = myTreeView.scrollPolicyOptions.maxCount;
       *
       * // setter
       * myTreeView.scrollPolicyOptions.maxCount = 30;
       *
       * @example <caption>Initialize the TreeView with the <code class="prettyprint">scroll-policy-options</code> attribute specified:</caption>
       * &lt;!-- Using dot notation -->
       * &lt;oj-tree-view scroll-policy-options.max-count='1000'>&lt;/oj-tree-view>
       *
       * @example <caption>Get or set the <code class="prettyprint">scrollPolicyOptions</code> property after initialization:</caption>
       * // Get maxCount value
       * var maxCountValue = myTreeView.scrollPolicyOptions.maxCount;
       *
       * // Get ScrollPolicy Object
       * var scrollPolicyOptionsValues = myTreeView.scrollPolicyOptions;
       *
       * // Set maxCount value
       * myTreeView.setProperty('scrollPolicyOptions.maxCount', 1000);
       *
       */
      scrollPolicyOptions: {
        /**
         * The maximum number of rows which will be displayed before fetching more rows will be stopped.
         * <p>See the <a href="#scrollPolicyOptions">scroll-policy-options</a> attribute for usage examples.</p>
         *
         * @expose
         * @name scrollPolicyOptions.maxCount
         * @ojshortdesc The maximum number of items to display before fetching more data items will be stopped.
         * @memberof! oj.ojTreeView
         * @instance
         * @type {number}
         * @default 500
         * @ojmin 0
         */
        maxCount: 500
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
      selected: new KeySetImpl(),
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
       * If <code class="prettyprint">leafOnly</code> is specified, the selection consists only of leaves, from which parent selection states are derived.<a href="oj.ojSelector.html">oj-selectors</a> will be rendered by default and the selection states of the items will be cascaded, which means that:</p>
       * <ul>
       *   <li>If a parent item is selected, then all the descendants will be selected automatically.</li>
       *   <li>If a parent item is unselected, then all the descendants will be unselected automatically.</li>
       *   <li>If a parent item has a mixture of selected and unselected descendants, and redwood is enabled then it will display a partially selected state.</li>
       * </ul>
       * <p> Note: In order to compute the selection, in selectionMode <code>leafOnly</code> the treeview will trigger continuous fetches until it has the complete data set.
       * We do not recommend using this mode with large data sets and currently mutations are not supported in this mode.</p>
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
       * @ojvalue {string} "leafOnly" Multiple items can be selected but children items control the parent's selection state.
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
       * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
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
       * @ojdeprecated {since: "12.1.0", description: "This web component no longer supports this event."}
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
    constants: {
      TREEVIEW_CONTENT_PADDING_REM: 0.5,
      PERIOD: '.',
      OJ_COMPLETE: 'oj-complete',
      OJ_TREEVIEW_LIST: 'oj-treeview-list',
      ERROR_FETCHING_DATA: 'Error fetching data: ',
      OJ_ITEM_DATA: 'oj-item-data',
      OJ_ITEM_METADATA: 'oj-item-metadata',
      OJ_TREEVIEW_ITEM_CONTENT: 'oj-treeview-item-content',
      OJ_TREEVIEW_SELECTOR: 'oj-treeview-selector',
      OJ_COMPONENT_ICON: 'oj-component-icon',
      OJ_DRAGGABLE: 'oj-draggable',
      OJ_TREEVIEW_SPACER: 'oj-treeview-spacer',
      OJ_TREEVIEW_LEAF: 'oj-treeview-leaf',
      OJ_TREEVIEW_DISCLOSURE_ICON: 'oj-treeview-disclosure-icon',
      OJ_DEFAULT: 'oj-default',
      OJ_EXPANDED: 'oj-expanded',
      OJ_TREEVIEW_SKELETON_CONTAINER: 'oj-treeview-skeleton-container',
      OJ_COLLAPSED: 'oj-collapsed',
      OJ_TREEVIEW_ANIMATED: 'oj-treeview-animated',
      OJ_SELECTED: 'oj-selected',
      OJ_TREEVIEW_DRAG_SOURCE: 'oj-treeview-drag-source',
      OJ_TREEVIEW_SKELETON_CONTENT: 'oj-treeview-skeleton-content',
      OJ_ANIMATION_SKELETON: 'oj-animation-skeleton',
      OJ_TREEVIEW_ITEM: 'oj-treeview-item',
      OJ_HOVER: 'oj-hover',
      OJ_CLICKABLE_ICON_NOCONTEXT: 'oj-clickable-icon-nocontext',
      OJ_TREEVIEW_DROPLINE: 'oj-treeview-drop-line',
      OJ_TREEVIEW_SELECT_SINGLE: 'oj-treeview-select-single',
      OJ_TREEVIEW_ICON: 'oj-treeview-icon',
      OJ_TREEVIEW_DRAG_IMAGE: 'oj-treeview-drag-image',
      OJ_TREEVIEW_DRAG_IMAGE_ITEM: 'oj-treeview-drag-image-item',
      OJ_FOCUS: 'oj-focus',
      OJ_TREEVIEW_DROP_ZONE: 'oj-treeview-drop-zone',
      OJ_FOCUS_HIGHLIGHT: 'oj-focus-highlight',
      OJ_ANIMATION_SKELETON_FADE_IN: 'oj-animation-skeleton-fade-in',
      OJ_TREEVIEW_SKELETON_CHILD: 'oj-treeview-skeleton-child',
      OJ_TREEVIEW_SKELETON_CARROT: 'oj-treeview-skeleton-carrot',
      OJ_TREEVIEW_SKELETON_ITEM: 'oj-treeview-skeleton-item',
      OJ_TREEVIEW_SKELETON_LEAF: 'oj-treeview-skeleton-leaf',
      OJ_TREEVIEW_ITEM_ICON: 'oj-treeview-item-icon',
      OJ_TREEVIEW_SELECTED_TOP_ITEM: 'oj-selected-item-content-top',
      OJ_TREEVIEW_SELECTED_BOTTOM_ITEM: 'oj-selected-item-content-bottom',
      OJ_TREEVIEW_CSS_VARS: {
        expandAnimation: '--oj-private-tree-view-global-expand-animation',
        collapseAnimation: '--oj-private-tree-view-global-collapse-animation',
        dataFadeInDuration: '--oj-private-tree-view-global-data-fadein-duration',
        multipleSelectionAffordance: '--oj-private-tree-view-global-selection-affordance-default',
        loadIndicator: '--oj-private-tree-view-global-load-indicator-default',
        showIndicatorDelay: '--oj-private-core-global-loading-indicator-delay-duration'
      }
    },
    // @inheritdoc
    _ComponentCreate: function () {
      this._super();
    },

    // @inheritdoc
    _AfterCreate: function () {
      this._super();
      this._initRender();
      this._render();
    },
    // @inheritdoc
    _CompareOptionValues: function (option, value1, value2) {
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
          return oj.KeyUtils.equals(value1, value2);
        case 'selected':
          return areKeySetsEqual(value1, value2);
        default:
          return this._super(option, value1, value2);
      }
    },
    /**
     * Initializes the TreeView.
     * @private
     */
    _initRender: function () {
      var self = this;
      // Event listeners
      // Event listeners
      this._on(this.element, {
        click: function (event) {
          self._handleClick(event);
        },
        mouseover: function (event) {
          self._handleMouseOver(event);
        },
        mouseout: function (event) {
          self._handleMouseOut(event);
        },
        mousedown: function (event) {
          self._handleMouseDown(event);
        },
        mouseup: function (event) {
          self._handleMouseUp(event);
        },
        keydown: function (event) {
          self._handleKeyDown(event);
        },
        dragstart: function (event) {
          self._handleDragStart(event);
        },
        drag: function (event) {
          self._handleDragSourceEvent(event, 'drag');
        },
        dragend: function (event) {
          self._handleDragSourceEvent(event, 'dragEnd');
        },
        dragenter: function (event) {
          self._handleDropTargetEvent(event, 'dragEnter');
        },
        dragover: function (event) {
          self._handleDropTargetEvent(event, 'dragOver');
        },
        dragleave: function (event) {
          self._handleDropTargetEvent(event, 'dragLeave');
        },
        drop: function (event) {
          self._handleDropTargetEvent(event, 'drop');
        }
      });

      if (isTouchSupported()) {
        this.element[0].addEventListener(
          'touchstart',
          function (event) {
            self.isTouchDrag = false;
            self.contextMenuOpen = false;
            self.touchStartEvent = event;
          },
          { passive: true }
        );

        this.element[0].addEventListener(
          'touchmove',
          function (event) {
            if (self.isTouchDrag) {
              event.preventDefault();
            }
          },
          { passive: false }
        );

        this.element[0].addEventListener('touchcancel', function () {
          self.touchStartEvent = null;
          self.isTouchDrag = false;
        });

        this.element[0].addEventListener('touchend', function (event) {
          self.isTouchDrag = false;
          if (self.touchStartEvent && event.changedTouches.length) {
            var overElem = document.elementFromPoint(
              event.changedTouches[0].clientX,
              event.changedTouches[0].clientY
            );
            if (overElem !== self.touchStartEvent.target) {
              self.touchStartEvent = null;
            }
          }
          self._handleMouseOut(event);
        });
      }

      this._dropLine = document.createElement('div');
      this._dropLine.classList.add(this.constants.OJ_TREEVIEW_DROPLINE);
      this.element[0].appendChild(this._dropLine); // HTMLUpdateOk

      const status = document.createElement('div');
      status.classList.add('oj-helper-hidden-accessible');
      status.setAttribute('role', 'status');
      this.element[0].appendChild(status); // HTMLUpdateOk

      this._dropLine.style.display = 'none';

      this._refreshId = 0;
      this._uiExpanded = new KeySetImpl();
      this.m_fetching = new Set();

      this._expandedChildrenMap = new Map();
      this._syncSelectionState();
    },
    /**
     * Syncs initial selection state with selected being source of truth
     * @private
     */
    _syncSelectionState: function () {
      var selectedArray = KeySetUtils.toArray(this.options.selected);
      var selectionKeySet = KeySetUtils.toKeySet(this.options.selection);

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
    _render: function () {
      var self = this;
      this.element[0].classList.remove(this.constants.OJ_COMPLETE);
      this._keyList = new Set(); // list of existing node keys
      var ulElementList = this.element[0].querySelectorAll('ul');
      var i;
      if (this.options.data) {
        for (i = 0; i < ulElementList.length; i++) {
          ulElementList[i].parentNode.removeChild(ulElementList[i]);
        }
        this._fetchChildren(null, function (response) {
          var fetchListResult = response.values[0];
          self._truncateIfOverMaxCount(fetchListResult.value);
          var params = { fetchListResult: fetchListResult.value, parentElem: self.element[0] };
          self._renderItems(params).then(function () {
            self._resetFocus();
            self.element[0].classList.add(self.constants.OJ_COMPLETE);
            self._decorateTree();
            self._lastSelectedItem = null;
          });
        });
      } else {
        for (i = 0; i < ulElementList.length; i++) {
          ulElementList[i].classList.add(this.constants.OJ_TREEVIEW_LIST);
          ulElementList[i].setAttribute('role', 'group');
        }
        var liElementList = this.element[0].querySelectorAll('li');
        for (i = 0; i < liElementList.length; i++) {
          var itemContent = this._getItemContent(liElementList[i]);
          if (itemContent) {
            var disclosureIcon = this._getItemDisclosureIcon(itemContent);
            if (disclosureIcon) {
              itemContent.removeChild(disclosureIcon);
            }
          }
          self._decorateItem(liElementList[i]);
        }
        this._resetFocus();
        this._decorateTree();
        this.element[0].classList.add(this.constants.OJ_COMPLETE);
      }
    },
    _getDataProvider: function () {
      var self = this;
      var data;
      if (self.m_dataSource == null) {
        data = self.options.data;
        if (!oj.DataProviderFeatureChecker.isTreeDataProvider(data)) {
          var adapterPromise = import('ojs/ojtreedataprovideradapter');
          if (!adapterPromise) {
            throw new Error('Error adapting a TreeDataSource');
          }
          return adapterPromise.then(
            // eslint-disable-next-line new-cap
            (TreeDataSourceAdapter) => new TreeDataSourceAdapter.default(data)
          );
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
    _fetchChildren: function (parentKey, successFunc) {
      var self = this;
      var dataProviderPromiseBusyResolve = self._addBusyState('getting data provider', parentKey);
      var dataProviderPromise = self._getDataProvider();
      var refreshing = this._refreshId;

      dataProviderPromise.then(
        function (dataProvider) {
          dataProviderPromiseBusyResolve();

          // bail out of the fetch if the component was refreshed
          if (self._refreshId !== refreshing) {
            return;
          }
          self.m_dataSource = dataProvider;

          var childDataProvider =
            parentKey === null ? dataProvider : dataProvider.getChildDataProvider(parentKey);
          if (childDataProvider != null) {
            var busyResolve = self._addBusyState('fetching data', parentKey);
            var delay = self._getShowStatusDelay();
            if (self._isSkeletonSupported()) {
              self._skeletonTimeout = setTimeout(function () {
                var rootMap = self._expandedChildrenMap.get(null);
                if (parentKey === null) {
                  self._renderInitialSkeletons();
                } else if (
                  !rootMap &&
                  !self._isParentSkeletonRendered(parentKey) &&
                  !self._isLeafOnlySelectionEnabled()
                ) {
                  var parentItem = self._getItemByKey(parentKey);
                  if (parentItem) {
                    var parentSubtree = self._getSubtree(parentItem);
                    if (!parentSubtree) {
                      self._renderChildSkeletons(parentKey);
                    }
                  }
                }
              }, delay);
            }
            var enginePromise = self._loadTemplateEngine();

            // Create a clientId symbol that uniquely identify this consumer so that
            // DataProvider which supports it can optimize resources
            self._clientId = self._clientId || Symbol();

            // size -1 to fetch all rows
            var options = { clientId: self._clientId, size: -1 };
            var dataProviderAsyncIterator = childDataProvider
              .fetchFirst(options)
              [Symbol.asyncIterator]();
            var promise = dataProviderAsyncIterator.next();

            // new helper function to be called in recursion to fetch all data.
            var helperFunction = function (values) {
              // skip additional fetching if done
              if (values[0].done) {
                self._clearSkeletonTimeout();
                if (self._isLeafOnlySelectionEnabled()) {
                  self._buildRawData(parentKey, values[0]);
                }
                if (self._isSkeletonSupported()) {
                  var expandedChildren = [];
                  var children = values[0].value.data;
                  for (var i = 0; i < children.length; i++) {
                    var childKey = values[0].value.metadata[i].key;
                    if (
                      self._isInitExpanded(childKey) &&
                      self.m_dataSource.getChildDataProvider(childKey)
                    ) {
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
              return nextPromise.then(
                function (value) {
                  // bail out of the fetch if the component was refreshed
                  if (self._refreshId !== refreshing) {
                    return null;
                  }
                  // eslint-disable-next-line no-param-reassign
                  values[0].done = value.done;
                  // eslint-disable-next-line no-param-reassign
                  values[0].value.data = values[0].value.data.concat(value.value.data);
                  // eslint-disable-next-line no-param-reassign
                  values[0].value.metadata = values[0].value.metadata.concat(value.value.metadata);
                  return helperFunction(values);
                },
                function (reason) {
                  error(self.constants.ERROR_FETCHING_DATA + reason);
                  busyResolve();
                }
              );
            };

            Promise.all([promise, enginePromise])
              .then(
                function (values) {
                  // bail out of the fetch if the component was refreshed
                  if (self._refreshId !== refreshing) {
                    return null;
                  }
                  return helperFunction(values);
                },
                function (reason) {
                  return Promise.reject(reason);
                }
              )
              .then(
                function (values) {
                  // bail out of the fetch if the component was refreshed
                  if (self._refreshId !== refreshing) {
                    busyResolve();
                    return;
                  }
                  successFunc(values);
                  busyResolve();
                },
                function (reason) {
                  error(self.constants.ERROR_FETCHING_DATA + reason);
                  var skeletonContainer = self._getSkeletonContainer(self.element[0]);
                  if (self._isSkeletonSupported() && skeletonContainer) {
                    self._removeSkeleton(null);
                  }
                  busyResolve();
                }
              );
          }
        },
        function (reason) {
          error(self.constants.ERROR_FETCHING_DATA + reason);
          dataProviderPromiseBusyResolve();
          self._expandedChildrenMap = new Map();
          self.m_fetching = new Set();
        }
      );
    },
    _clearSkeletonTimeout: function () {
      if (this._skeletonTimeout) {
        clearTimeout(this._skeletonTimeout);
        this._skeletonTimeout = null;
      }
    },
    _buildRawData: function (parentKey, values) {
      if (parentKey === null) {
        this._rawData = values.value.metadata;
      } else {
        this._findParentAndAddChildren(this._rawData, values.value.metadata, parentKey);
      }
    },
    _findParentAndAddChildren: function (searchArray, children, parentKey) {
      for (var i = 0; i < searchArray.length; i++) {
        if (searchArray[i].key === parentKey) {
          // eslint-disable-next-line no-param-reassign
          searchArray[i].children = children;
          return;
        } else if (searchArray[i].children) {
          this._findParentAndAddChildren(searchArray[i].children, children, parentKey);
        }
      }
    },
    _isParentSkeletonRendered: function (key) {
      var item = this._getItemByKey(key);
      var parents = this._getParents(item, this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM);
      for (var i = 0; i < parents.length; i++) {
        var parentKey = this._getKey(parents[i]);
        var parentMapEntry = this._expandedChildrenMap.get(parentKey);
        if (parentMapEntry) {
          return true;
        }
      }
      return false;
    },
    _getShowStatusDelay: function () {
      var defaultOptions = this._getOptionDefaults();
      var delay = parseInt(defaultOptions.showIndicatorDelay, 10);

      return isNaN(delay) ? 0 : delay;
    },
    /**
     * Render the TreeView items after the data is fetched.
     * @param {Object} params An object containing parameters relevant for rendering.
     * @private
     */
    _renderItems: function (params) {
      return new Promise(
        function (resolve) {
          var ulElem = document.createElement('ul');
          ulElem.classList.add(this.constants.OJ_TREEVIEW_LIST);
          ulElem.setAttribute('role', 'group');
          var skeletonContainer = this._getSkeletonContainer(this.element[0]);
          if (
            (skeletonContainer && this._isSkeletonSupported()) ||
            this._isLeafOnlySelectionEnabled()
          ) {
            ulElem.style.display = 'none';
          }
          params.parentElem.appendChild(ulElem); // @HTMLUpdateOK
          for (var i = 0; i < params.fetchListResult.data.length; i++) {
            this._renderItem(ulElem, params.fetchListResult, i);
          }
          if (
            skeletonContainer &&
            this._isSkeletonSupported() &&
            !this._isLeafOnlySelectionEnabled()
          ) {
            this._toggleParentDisplay(params.parentElem, resolve);
          } else {
            resolve();
          }
        }.bind(this)
      );
    },
    /**
     * Gets the value of getScrollPolicyOptions from the treeview.
     * @private
     */
    _getScrollPolicyOptions: function () {
      return this.options.scrollPolicyOptions;
    },
    /**
     * Checks if fetched data is greater then maxCount and returns amount over.
     * @private
     */
    _validateScrollPolicyOptions: function (fetchListResultLength) {
      var scrollPolicyOptions = this._getScrollPolicyOptions();
      var potentialTotalCount = this._getTreeViewItemCount() + fetchListResultLength;
      if (scrollPolicyOptions.maxCount < potentialTotalCount) {
        info(
          'ScrollPolicyOptions max count of [' +
            scrollPolicyOptions.maxCount +
            '] has been reached.'
        );
      }
      return potentialTotalCount - scrollPolicyOptions.maxCount;
    },
    /**
     * Truncates fetched data if over maxCount.
     * @private
     */
    _truncateIfOverMaxCount: function (fetchListResultValue) {
      const valueLength = fetchListResultValue.data.length;
      const offset = this._validateScrollPolicyOptions(valueLength);
      // over max count need to truncate
      if (offset === valueLength) {
        // entire fetchListLength is over maxCount, remove all
        // eslint-disable-next-line no-param-reassign
        fetchListResultValue.data = [];
        // eslint-disable-next-line no-param-reassign
        fetchListResultValue.metadata = [];
      } else if (offset > 0) {
        // part of fetchListLength is over maxCount, remove
        fetchListResultValue.data.splice(-offset, valueLength);
        fetchListResultValue.metadata.splice(-offset, valueLength);
      }
    },
    /**
     * Recursively walks _expandedChildrenMap to see if it needs to toggle the parents display style if all expanded children have been fetched.
     * @param {Element} item The item element.
     * @param {Function} resolve The function to resolve the rendering busy state.
     * @private
     */
    _toggleParentDisplay: function (item, resolve) {
      var itemKey = this._getKey(item);
      if (item === this.element[0]) {
        itemKey = null;
      }
      var childExpandedKeys = this._expandedChildrenMap.get(itemKey);
      if (childExpandedKeys && childExpandedKeys.length > 0) {
        resolve();
      } else {
        let key = null;
        // eslint-disable-next-line no-restricted-syntax
        for (key of this._expandedChildrenMap.keys()) {
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
    _resolveNoChildren: function (key, keyItem, subtree, resolve) {
      this._expandedChildrenMap.delete(key);
      var skeletonContainer = this._getSkeletonContainer(keyItem);
      if (skeletonContainer && !this._isLeafOnlySelectionEnabled()) {
        this._foundSkeleton(key, subtree, resolve);
      } else if (!this._isLeafOnlySelectionEnabled()) {
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
    _foundSkeleton: function (key, subtree, resolve) {
      var skeletonRemovedPromise = this._removeSkeleton(key);
      skeletonRemovedPromise.then(
        function () {
          if (subtree) {
            // eslint-disable-next-line no-param-reassign
            subtree.style.display = 'block';
          }
          var defaults = this._getOptionDefaults();
          fadeIn(subtree, { duration: defaults.dataFadeInDuration });
          resolve();
        }.bind(this)
      );
    },
    /**
     * Render a TreeView item after the data is fetched.
     * @param {Element} ulElem The <ul> to attach the item to.
     * @param {oj.FetchListResult} fetchListResult The array of item data returned by the data source.
     * @param {number} index The index of the item.
     * @param {boolean} replace Coming from change mutation event.
     * @private
     */
    _renderItem: function (ulElem, fetchListResult, index, insertIndex, replace) {
      var self = this;
      var i;
      var textWrapper;

      // eslint-disable-next-line no-param-reassign
      // index += nodeSet.getStart();
      var data = fetchListResult.data[index];
      var metadata = fetchListResult.metadata[index];
      var key = metadata.key;

      // Prevent infinite recursion due to duplicated keys ()
      if (!replace) {
        if (this._keyList.has(key)) {
          throw new Error('JET TreeView nodes should not have duplicated keys: ' + key);
        }
        this._keyList.add(key);
      }

      var liElem = document.createElement('li');

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
      var context = {
        parentElement: $(liElem),
        index: index,
        data: data,
        datasource: self.options.data,
        parentKey: self._getKey(self._getParentItem(liElem)),
        metadata: metadata,
        component: __GetWidgetConstructor(self.element)
      };

      if (self._FixRendererContext) {
        context = self._FixRendererContext(context);
      }

      // dataSource always set by this point as it is post fetch
      var childDataProvider = self.m_dataSource.getChildDataProvider(key);
      metadata.leaf = childDataProvider === null;
      metadata.depth = this._getDepth(liElem);

      // Merge properties from metadata into item context
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
          } else if (content.parentNode != null) {
            // Parent node exists, do nothing
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
            liElem = nodes[i];
            break;
          } else {
            liElem.appendChild(nodes[i]); // @HTMLUpdateOK
          }
        }
      } else {
        textWrapper = document.createElement('span');
        textWrapper.appendChild(document.createTextNode(data == null ? '' : data.toString())); // @HTMLUpdateOK
        liElem.appendChild(textWrapper); // @HTMLUpdateOK
      }
      // eslint-disable-next-line block-scoped-var
      if (replace && oldSubtree) {
        // eslint-disable-next-line block-scoped-var
        liElem.appendChild(oldSubtree);
      }

      // Get the item from root again as template replaces the item element
      liElem = ulElem.children[insertIndex != null ? insertIndex : index];

      context.parentElement = $(liElem);

      // Set id on the liElem if not set by the renderer
      if (!liElem.hasAttribute('id')) {
        liElem.setAttribute('id', this._getUniqueItemId());
      }

      liElem[this.constants.OJ_ITEM_DATA] = data;
      liElem[this.constants.OJ_ITEM_METADATA] = metadata;

      self._decorateItem(liElem);
    },
    /**
     * @param {Element} elem The li element to get depth of.
     * @return {number} depth from the li, 1 is top level
     * @private
     * @memberof oj.ojTreeView
     */
    _getDepth: function (elem) {
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
    _loadTemplateEngine: function () {
      if (this._getItemTemplate() != null && this.options.item.renderer == null) {
        return new Promise((resolve) => {
          const templateOptions = {
            customElement: this._GetCustomElement()
          };
          __getTemplateEngine(templateOptions).then(
            (engine) => {
              this.m_engine = engine;
              resolve(engine);
            },
            (reason) => {
              throw new Error('Error loading template engine: ' + reason);
            }
          );
        });
      }

      return Promise.resolve(null);
    },

    /**
     * Retrieve the template engine, returns null if it has not been loaded yet
     * @private
     * @memberof oj.ojTreeView
     */
    _getTemplateEngine: function () {
      return this.m_engine;
    },

    /**
     * Returns the inline template element inside oj-tree-view
     * @return {Element|null} the inline template element
     * @private
     * @memberof oj.ojTreeView
     */
    _getItemTemplate: function () {
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
    _getSlotMap: function () {
      return CustomElementUtils.getSlotMap(this.element[0]);
    },

    /**
     * Adds the necessary attributes to a TreeView root element.
     * @private
     */
    _decorateTree: function () {
      var self = this;

      // Keyboard focus and ARIA attributes
      var root = this._getRoot();
      if (root) {
        this._focusable({
          element: $(root),
          applyHighlight: true,
          setupHandlers: function (focusInHandler, focusOutHandler) {
            self._focusInHandler = focusInHandler;
            self._focusOutHandler = focusOutHandler;
          }
        });
        root.setAttribute('tabIndex', 0);
        $(root)
          .on('focus', function () {
            self._focusInHandler($(self._getItemContent(self._currentItem)));
          })
          .on('blur', function () {
            self._focusOutHandler($(self._getItemContent(self._currentItem)));
          });
        root.setAttribute('role', 'tree');
        root.setAttribute('aria-labelledby', this.element[0].getAttribute('id'));

        var selectionMode = this.options.selectionMode;
        if (selectionMode !== 'none') {
          root.setAttribute(
            'aria-multiselectable',
            this._isMultiSelectionEnabled() || this._isLeafOnlySelectionEnabled() ? 'true' : 'false'
          );
        } else {
          root.removeAttribute('aria-multiselectable');
        }

        if (selectionMode === 'single') {
          this.element[0].classList.add(this.constants.OJ_TREEVIEW_SELECT_SINGLE);
        }

        // programmatically setting focus treeview should also handle focus
        this.element[0].setAttribute('tabIndex', -1);
        this.element[0].addEventListener('focus', () => {
          this._getRoot().focus();
        });
        this.element[0].addEventListener('blur', () => {
          this._getRoot().blur();
        });
        this._refreshTopAndBottomSelectionClasses();
      }
    },
    _isMultiSelectionEnabled: function () {
      return this.options.selectionMode === 'multiple';
    },
    _isLeafOnlySelectionEnabled: function () {
      return this.options.selectionMode === 'leafOnly';
    },
    _isDefaultCheckBoxesEnabled: function () {
      var defaults = this._getOptionDefaults();
      return (
        defaults.multipleSelectionAffordance === 'selector' &&
        (this._isMultiSelectionEnabled() || this._isLeafOnlySelectionEnabled())
      );
    },
    _refreshSelectionItems: function () {
      var selectionMode = this.options.selectionMode;
      if (selectionMode === 'none') {
        return;
      }
      var i;
      var selected = this._getSelected();
      var item;
      var newSelectedItems = Array.from(this._getItemsInSelectedKeySet(selected));
      if (!selected.isAddAll()) {
        var currentSelectedItemContents = this._getSelectedItemContents();
        for (i = currentSelectedItemContents.length - 1; i >= 0; i--) {
          var selectedItem = currentSelectedItemContents[i].parentElement;
          var indexOfSelectedItem = newSelectedItems.indexOf(selectedItem);
          if (indexOfSelectedItem !== -1) {
            newSelectedItems.splice(indexOfSelectedItem, 1);
          } else {
            this._setUnselected(selectedItem);
          }
        }

        for (i = 0; i < newSelectedItems.length; i++) {
          item = newSelectedItems[i];
          this._setSelected(item);
        }
      } else {
        for (i = 0; i < newSelectedItems.length; i++) {
          item = newSelectedItems[i];
          var itemKey = this._getKey(item);
          if (selected.has(itemKey) && this._isActionable(item, 'select')) {
            this._setSelected(item);
          } else {
            this._setUnselected(item);
          }
        }
      }
      if (this._isLeafOnlySelectionEnabled()) {
        this._updateIndeterminateState(this._selectedKeysets.partialParents);
      }
      this._refreshTopAndBottomSelectionClasses();
    },
    _getItemsInSelectedKeySet: function (selected) {
      var selectedItems = [];
      if (selected.isAddAll()) {
        return this._getItems();
      }
      selected.values().forEach((key) => {
        var item = this._getItemByKey(key);
        if (item && this._isActionable(item, 'select')) {
          selectedItems.push(item);
        }
      });
      return selectedItems;
    },
    /**
     * Adds the necessary attributes to a TreeView item element.
     * @param {Element} item The item element to decorate.
     * @private
     */
    _decorateItem: function (item) {
      var self = this;
      var i;

      item.classList.add(this.constants.OJ_TREEVIEW_ITEM);
      item.setAttribute('role', 'treeitem');
      var itemKey = this._getKey(item);

      // Create wrapper for item icon and text
      var itemContent = this._getItemContent(item);
      if (!itemContent) {
        // Wrap everything except the subtree
        // Use innerHTML to include text and comment nodes as well
        itemContent = document.createElement('div');
        itemContent.classList.add(this.constants.OJ_TREEVIEW_ITEM_CONTENT);

        if (
          this._isDefaultCheckBoxesEnabled() &&
          this._isActionable(item, 'focus') &&
          this._isActionable(item, 'select')
        ) {
          var selectorSpan = document.createElement('span');
          selectorSpan.classList.add(this.constants.OJ_TREEVIEW_SELECTOR);
          var selector = document.createElement('oj-selector');
          var selected = this._getSelected();
          if (selected.has(itemKey)) {
            selector.selectedKeys = new KeySetImpl([itemKey]);
          } else {
            selector.selectedKeys = new KeySetImpl();
          }
          selector.setAttribute('data-oj-binding-provider', 'none');
          selector.setAttribute('selection-mode', 'multiple');
          selector.setAttribute(
            'aria-label',
            getTranslatedString('oj-ojTreeView.treeViewSelectorAria', {
              rowKey: itemKey
            })
          );
          selector.addEventListener(
            'selectedKeysChanged',
            function (event) {
              if (event.detail.updatedFrom === 'internal') {
                var selectedItem = this._getItemByKey(event.target.rowKey);
                this._focus(selectedItem, event);
                var currentSelected = this._getSelected();
                if (currentSelected.has(event.target.rowKey)) {
                  currentSelected = currentSelected.delete([event.target.rowKey]);
                } else {
                  currentSelected = currentSelected.add([event.target.rowKey]);
                  this._selectionAnchor = event.target.rowKey;
                }
                this._userSelectedOptionChange(currentSelected, event);
              }
            }.bind(this)
          );
          selector.rowKey = itemKey;
          selectorSpan.appendChild(selector); // @HTMLUpdateOK
          itemContent.appendChild(selectorSpan); // @HTMLUpdateOK
          var busyContext = Context.getContext(selector).getBusyContext();
          busyContext.whenReady().then(() => {
            disableAllFocusableElements(selector);
          });
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
        var treeViewItems = itemContent.querySelectorAll(
          this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM_ICON
        );
        for (i = 0; i < treeViewItems.length; i++) {
          treeViewItems[i].classList.add(this.constants.OJ_TREEVIEW_ICON);
          treeViewItems[i].classList.add(this.constants.OJ_COMPONENT_ICON);
        }
      }
      // Initial selection
      self._select(item);

      // DnD
      itemContent.setAttribute('draggable', this._isDnD() ? 'true' : 'false');

      // Create disclosure icon or spacer
      var disclosureIcon = this._getItemDisclosureIcon(itemContent);
      var indentElement = this._getItemSpacer(itemContent);

      if (!disclosureIcon) {
        disclosureIcon = document.createElement('ins');
        this._addTreeViewIconClass(disclosureIcon);
        if (indentElement) {
          itemContent.insertBefore(disclosureIcon, indentElement.nextElementSibling); // @HTMLUpdateOK
        } else {
          itemContent.insertBefore(disclosureIcon, itemContent.children[0]); // @HTMLUpdateOK
        }
      }

      if (!indentElement) {
        indentElement = document.createElement('span');
        this._addTreeviewSpacerClass(indentElement);
        itemContent.insertBefore(indentElement, disclosureIcon); // @HTMLUpdateOK
      }

      this._addIndentation(item, indentElement);
      if (this._isDnD()) {
        item.classList.add(this.constants.OJ_DRAGGABLE);
        itemContent.classList.add(this.constants.OJ_DRAGGABLE);
      }

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
     * Add the indentation on a spacer
     * @private
     */
    _addIndentation: function (item, spacer) {
      // 0 index the depth for style purposes
      let depth = this._getDepth(item) - 1;
      const spacerStyle = spacer.style;
      const isRedwood = parseJSONFromFontFamily('oj-theme-json').behavior === 'redwood';
      let paddingOffset = 0;
      if (this._hasIcon(item) && isRedwood) {
        /* in redwood treeview icons have margin-inline-end: 0.5rem to add space between icon and text,
          if our items have icons we need to add 0.5 * depth to spacer to properly align them */
        paddingOffset = depth * this.constants.TREEVIEW_CONTENT_PADDING_REM;
      }
      if (this._isLeaf(item)) {
        depth += 1;
      }
      spacerStyle.width =
        'calc(calc(' + depth + ' * var(--oj-tree-view-indent-width)) + ' + paddingOffset + 'rem)';
    },
    _hasIcon: function (item) {
      return item.querySelectorAll('.oj-treeview-icon.oj-component-icon').length > 0;
    },
    /**
     * removes the indentation on the spacer
     * @private
     */
    _removeIndentation: function (spacer) {
      spacer.style.removeProperty('width');
      spacer.removeAttribute('class');
      spacer.classList.add(this.constants.OJ_TREEVIEW_SPACER);
    },
    _addTreeviewSpacerClass: function (item) {
      item.classList.add(this.constants.OJ_TREEVIEW_SPACER);
    },
    _addTreeViewIconClass: function (item) {
      item.classList.add(this.constants.OJ_TREEVIEW_ICON);
    },
    _addTreeviewLeafClass: function (item) {
      item.classList.add(this.constants.OJ_TREEVIEW_LEAF);
    },
    _removeTreeviewLeafClass: function (item) {
      item.classList.remove(this.constants.OJ_TREEVIEW_LEAF);
    },
    _addDisclosureClasses: function (item) {
      item.classList.add(this.constants.OJ_TREEVIEW_DISCLOSURE_ICON);
      item.classList.add(this.constants.OJ_COMPONENT_ICON);
      item.classList.add(this.constants.OJ_CLICKABLE_ICON_NOCONTEXT);
      item.classList.add(this.constants.OJ_DEFAULT);
    },
    _removeDisclosureClasses: function (item) {
      item.classList.remove(this.constants.OJ_TREEVIEW_DISCLOSURE_ICON);
      item.classList.remove(this.constants.OJ_COMPONENT_ICON);
      item.classList.remove(this.constants.OJ_CLICKABLE_ICON_NOCONTEXT);
      item.classList.remove(this.constants.OJ_DEFAULT);
    },
    /**
      /**
       * Returns all the item elements that belongs to the TreeView.
       * @return {Element} All the item elements that belongs to the TreeView.
       * @private
       */
    _getItems: function () {
      return this.element[0].querySelectorAll(
        this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM
      );
    },

    /**
     * Returns the key of the provided item.
     * @param {Element} item The TreeView item element.
     * @return {any} The key.
     * @private
     */
    _getKey: function (item) {
      if (!item) {
        return null;
      }
      // Rely on the key in the metadata first. The DOM id stringifies the key,
      // so it won't return the correct key if the key isn't string.
      var metadata = item[this.constants.OJ_ITEM_METADATA];
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
    _getItemByKey: function (key) {
      // Rely on the key in the metadata first. The DOM id stringifies the key,
      // so it won't return the correct key if the key isn't string.
      var itemList = this.element[0].getElementsByTagName('li');
      var item;
      for (var i = 0; i < itemList.length; i++) {
        var metadata = itemList[i][this.constants.OJ_ITEM_METADATA];
        if (metadata) {
          if (oj.KeyUtils.equals(metadata.key, key)) {
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
          if (keyElement && root.contains(keyElement)) {
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
    _getItemContent: function (item) {
      if (!item) {
        return null;
      }
      // : _getItemContent can give you non direct children's content
      var children = item.children;
      for (var i = 0; i < children.length; i++) {
        if (
          item.children[i].classList &&
          item.children[i].classList.contains(this.constants.OJ_TREEVIEW_ITEM_CONTENT)
        ) {
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
    _getChildItems: function (item) {
      var listElements = [];
      var firstSubList = item.getElementsByClassName(this.constants.OJ_TREEVIEW_LIST)[0];
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
    _getParentItem: function (item) {
      var parentListElement = this._getParents(item, '.oj-treeview-list')[0];
      return this._getParents(
        parentListElement,
        this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM
      )[0];
    },

    /**
     * Returns the subtree element (ul) of the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Element} The subtree element (ul).
     * @private
     */
    _getSubtree: function (item) {
      return item.getElementsByClassName(this.constants.OJ_TREEVIEW_LIST)[0];
    },

    /**
     * Returns the root ul of the TreeView.
     * @return {Element}
     * @private
     */
    _getRoot: function () {
      return this.element[0].getElementsByClassName(this.constants.OJ_TREEVIEW_LIST)[0];
    },

    /**
     * Returns whether the item is a leaf item.
     * @param {Element} item The TreeView item element.
     * @return {boolean}
     * @private
     */
    _isLeaf: function (item) {
      if (!item) {
        return null;
      }
      var metadata = item[this.constants.OJ_ITEM_METADATA];
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
    _isInitExpanded: function (key, uiExpanded) {
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
    _isExpanded: function (item) {
      return item.classList.contains(this.constants.OJ_EXPANDED);
    },

    /**
     * Whether the group item is currently in the middle of expanding/collapsing
     * @param {Object} key the key of the group item
     * @return {boolean} true if it's expanding/collapsing, false otherwise
     * @private
     */
    _isDisclosing: function (key) {
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
    _setDisclosing: function (key, flag) {
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
    _expand: function (item, animate, event, vetoable) {
      var self = this;
      if (
        this._isExpanded(item) ||
        this._isLeaf(item) ||
        (animate && this._isDisclosing(this._getKey(item)))
      ) {
        return;
      }

      if (animate) {
        var cancelled = !this._trigger('beforeExpand', event, this._getEventPayload(item));
        if (cancelled && vetoable !== false) {
          return;
        }
      }
      if (event && this._isActionable(item, 'focus')) {
        this._focus(item, event);
      }

      var subtree = this._getSubtree(item);
      var key = self._getKey(item);
      if (!subtree) {
        this._uiExpanded = this._uiExpanded.add([key]);
        this._fetchChildren(key, function (response) {
          // if the item is already expanded or is no longer in the expanded option bail early
          // no need to check refreshId because is handled at fetchChildren layer
          // uiExpanded is used because on ui gesture the expanded is not set until
          // fetch/animation completes, so we need an internal expanded option to track that
          if (
            (self._isExpanded(item) && !self._isSkeletonSupported()) ||
            (!self._isInitExpanded(key) && !self._isInitExpanded(key, self._uiExpanded))
          ) {
            return;
          }

          var fetchListResult = response.values[0];
          self._truncateIfOverMaxCount(fetchListResult.value);

          var skeletonContainerLength = item.getElementsByClassName(
            self.constants.OJ_TREEVIEW_SKELETON_CONTAINER
          ).length;
          var params = { fetchListResult: fetchListResult.value, parentElem: item };
          if (
            self._isSkeletonSupported() &&
            skeletonContainerLength > 0 &&
            response.shouldRemoveSkeleton &&
            !self._isLeafOnlySelectionEnabled()
          ) {
            self._renderItems(params).then(function () {
              var itemHeight = item.offsetHeight;
              var skeletonHeight = itemHeight * 3; // Three tiered skeleton
              var contentHeight = itemHeight * fetchListResult.value.data.length;
              subtree = self._getSubtree(item);
              var options = {
                startMaxHeight: skeletonHeight + 'px',
                endMaxHeight: contentHeight + 'px'
              };
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
              if (self.isReady() && self._isLeafOnlySelectionEnabled()) {
                self._initLeafOnlySelectionMode();
              }
            });
          } else {
            self._renderItems(params).then(function () {
              self._expandAfterFetch(item, animate, event);
              if (self.isReady() && self._isLeafOnlySelectionEnabled()) {
                self._initLeafOnlySelectionMode();
              }
            });
          }
        });
        return;
      }
      this._expandAfterFetch(item, animate, event);
    },
    /**
     * Inits leafOnly selectionMode by computing initial selected state.
     * @private
     */
    _initLeafOnlySelectionMode: function () {
      const attributesMap = { keyAttributes: 'key', childrenAttribute: 'children' };
      let createKeyMap = (m) => new Map(m);
      if (this.options.data.createOptimizedKeyMap) {
        createKeyMap = (m) => this.options.data.createOptimizedKeyMap(m);
      }
      let createKeySet = (s) => new Set(s);
      if (this.options.data.createOptimizedKeySet) {
        createKeySet = (s) => this.options.data.createOptimizedKeySet(s);
      }
      this.treeviewSelectionManager = new TreeviewSelectionManager(
        this._rawData,
        attributesMap,
        createKeyMap,
        createKeySet
      );
      this._userSelectedOptionChange(this._filterOutParentKeys(this._getSelected()), null, true);
      var root = this._getRoot();
      var skeletonContainer = this._getSkeletonContainer(this.element[0]);
      if (skeletonContainer) {
        var skeletonRemovedPromise = this._removeSkeleton(null);
        skeletonRemovedPromise.then(
          function () {
            if (root) {
              // eslint-disable-next-line no-param-reassign
              root.style.display = 'block';
            }
            var defaults = this._getOptionDefaults();
            fadeIn(root, { duration: defaults.dataFadeInDuration });
          }.bind(this)
        );
      } else if (root) {
        // eslint-disable-next-line no-param-reassign
        root.style.display = 'block';
      }
    },
    /**
     * Adds necessary expand classes to an item .
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setItemExpanded: function (item) {
      item.classList.remove(this.constants.OJ_COLLAPSED);
      item.classList.add(this.constants.OJ_EXPANDED);
      this._setAriaExpanded(item, 'true');
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
    _animateSkeletonRemoval: function (action, item, subtree, options, event) {
      var key = this._getKey(item);
      var skeletonRemovedPromise = this._removeSkeleton(key);
      skeletonRemovedPromise.then(
        function () {
          this._setItemExpanded(item);
          var self = this;
          var fadeinPromise;
          var defaults = this._getOptionDefaults();
          // eslint-disable-next-line no-param-reassign
          subtree.style.display = 'block';
          fadeinPromise = fadeIn(subtree, { duration: defaults.dataFadeInDuration });
          fadeinPromise.then(
            function () {
              var animationPromise;
              var busyResolve = this._addBusyState('animating skeleton removal', key);
              item.classList.add(this.constants.OJ_TREEVIEW_ANIMATED); // animation flag
              this._setDisclosing(this._getKey(item), true);
              if (action === 'expand') {
                animationPromise = this._startAnimation(subtree, 'expand', options);
                animationPromise.then(
                  this._resolveAnimationPromise(self, item, event, busyResolve)
                );
              } else if (action === 'collapse') {
                animationPromise = this._startAnimation(subtree, 'collapse', options);
                animationPromise.then(
                  this._resolveAnimationPromise(self, item, event, busyResolve)
                );
              } else {
                var resolve = this._resolveAnimationPromise(self, item, event, busyResolve);
                resolve();
              }
            }.bind(this)
          );
        }.bind(this)
      );
    },
    /**
     * Expands an item after its child items have been fetched.
     * @param {Element} item The TreeView item element.
     * @param {boolean} animate Whether the expand should be animated.
     * @param {Event} event The event that triggers the expand.
     * @private
     */
    _expandAfterFetch: function (item, animate, event) {
      this._setItemExpanded(item);
      var key = this._getKey(item);

      var subtree = this._getSubtree(item);
      if (subtree) {
        subtree.style.display = 'block';
      }

      if (animate) {
        var busyResolve = this._addBusyState('animating expand', key);
        item.classList.add(this.constants.OJ_TREEVIEW_ANIMATED); // animation flag
        this._setDisclosing(key, true);
        this._startAnimation(subtree, 'expand').then(
          this._resolveAnimationPromise(this, item, event, busyResolve)
        );
      }
    },
    _setExpandedState: function (self, item, event) {
      self._setDisclosing(self._getKey(item), false);
      item.classList.remove(self.constants.OJ_TREEVIEW_ANIMATED);
      self._trigger('expand', event, self._getEventPayload(item));
      // Update option and fire optionChange
      var expanded = self.options.expanded;
      var newExpanded = expanded.add([self._getKey(item)]);
      self._refreshTopAndBottomSelectionClasses();
      self._userOptionChange('expanded', newExpanded, event);
    },
    _resolveAnimationPromise: function (self, item, event, busyResolve) {
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
    _collapse: function (item, animate, event, vetoable) {
      var self = this;
      var key = this._getKey(item);

      if (
        item.classList.contains(this.constants.OJ_COLLAPSED) ||
        this._isLeaf(item) ||
        (animate && this._isDisclosing(key))
      ) {
        return;
      }

      if (event && this._isActionable(item, 'focus')) {
        this._focus(item, event);
      } else if (item.contains(this._currentItem)) {
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
        this._setDisclosing(key, true);
      }

      item.classList.remove(this.constants.OJ_EXPANDED);
      item.classList.add(this.constants.OJ_COLLAPSED);
      this._setAriaExpanded(item, 'false');

      var subtree = this._getSubtree(item);
      if (animate) {
        var busyResolve = this._addBusyState('animating collapse', key);
        item.classList.add(this.constants.OJ_TREEVIEW_ANIMATED); // animation flag

        this._uiExpanded = this._uiExpanded.delete([key]);
        this._startAnimation(subtree, 'collapse').then(function () {
          self._setDisclosing(key, false);
          subtree.style.display = 'none';
          item.classList.remove(self.constants.OJ_TREEVIEW_ANIMATED);
          self._trigger('collapse', event, self._getEventPayload(item));

          // Update option and fire optionChange
          var expanded = self.options.expanded;
          var newExpanded = expanded.delete([key]);
          self._refreshTopAndBottomSelectionClasses();
          self._userOptionChange('expanded', newExpanded, event);
          busyResolve();
        });
      } else if (subtree) {
        subtree.style.display = 'none';
        this._refreshTopAndBottomSelectionClasses();
      }
      if (this._isLeafOnlySelectionEnabled() && !subtree) {
        this._fetchChildren(key, function (response) {
          var fetchListResult = response.values[0];
          self._truncateIfOverMaxCount(fetchListResult.value);
          var params = { fetchListResult: fetchListResult.value, parentElem: item };
          self._renderItems(params).then(function () {
            if (self.isReady() && self._isLeafOnlySelectionEnabled()) {
              self._initLeafOnlySelectionMode();
            }
          });
        });
      }
    },

    /**
     * Starts the animation for the specific action.
     * @param {Element} elem The element to animate.
     * @param {string} action The name of the action to animate.
     * @return {Promise} A promise that will be resolved when the animation ends.
     * @private
     */
    _startAnimation: function (elem, action, options) {
      var defaultAnimations = {};
      if (defaultAnimations[action] == null) {
        defaultAnimations[action] = JSON.parse(this._getOptionDefaults()[`${action}Animation`]);
      }
      var effects = defaultAnimations[action];
      if (options) {
        if (effects.effect === 'expand' || effects.effect === 'collapse') {
          Object.assign(effects, options);
        }
      }
      return startAnimation(elem, action, effects, this);
    },

    /**
     * Returns the default event payload for the provided item element.
     * @param {Element} item The TreeView item element.
     * @return {Object}
     * @private
     */
    _getEventPayload: function (item) {
      return { key: this._getKey(item), item: item };
    },

    /**
     * Returns whether an action (select or focus) can be performed on the item.
     * @param {Element} item The TreeView item element.
     * @param {string} actionName The action name: 'select' or 'focus'.
     * @return {boolean}
     * @private
     */
    _isActionable: function (item, actionName) {
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
    _isSelected: function (item) {
      var selectionMode = this.options.selectionMode;
      var selected = this._getSelected();

      if (selectionMode === 'none') {
        return false;
      }

      var key = this._getKey(item);
      return selected.has(key);
    },
    /**
     * Returns the actual selected state. In leafOnly mode this contains leaves and parents.
     * @return {Object}
     * @private
     */
    _getSelected: function () {
      if (this._isLeafOnlySelectionEnabled() && this._selectedKeysets) {
        return this._selectedKeysets.selected;
      }
      return this.options.selected;
    },
    /**
     * Selects or unselects an item, depending on what triggers the selection.
     * @param {Element} item The TreeView item element.
     * @param {Event} event The event that triggers the select.
     * @private
     */
    _select: function (item, event) {
      var selectionMode = this.options.selectionMode;
      if (selectionMode === 'none') {
        return;
      }

      // Check whether the item is selectable
      if (!this._isActionable(item, 'focus') || !this._isActionable(item, 'select')) {
        return;
      }

      var isSelected = this._isSelected(item);

      if (event) {
        var eventKey = event.key || event.keyCode;
        var sourceCapabilityTouch =
          event.originalEvent.sourceCapabilities &&
          event.originalEvent.sourceCapabilities.firesTouchEvents;
        var isTouch =
          isTouchSupported() &&
          (sourceCapabilityTouch ||
            (this.touchStartEvent != null && this.touchStartEvent.target === event.target));
        var isMetaKey = isMetaKeyPressed(event);
        var isNavigation =
          isArrowUpKeyEvent(eventKey) ||
          isArrowDownKeyEvent(eventKey);
        var key = this._getKey(item);
        var selected = new KeySetImpl();
        if (
          (this._isMultiSelectionEnabled() || this._isLeafOnlySelectionEnabled()) &&
          event.shiftKey &&
          !isNavigation &&
          this._selectionAnchor
        ) {
          let nextItem = this._getItemByKey(this._selectionAnchor);

          if (isMetaKey) {
            selected = this._getSelected();
          } else {
            this._clearSelection();
          }

          // Select a range from the last selected item to the current item
          var getNextItem =
            nextItem && nextItem.offsetTop < item.offsetTop
              ? this._getNextActionableItem.bind(this)
              : this._getPreviousActionableItem.bind(this);

          while (nextItem && nextItem !== item) {
            var nextKey = this._getKey(nextItem);
            if (!selected.has(nextKey)) {
              selected = selected.add([nextKey]);
              this._setSelected(nextItem);
            }
            nextItem = getNextItem(nextItem, 'select');
          }
          isSelected = true;
          selected = selected.add([key]);
        } else if (
          (this._isMultiSelectionEnabled() || this._isLeafOnlySelectionEnabled()) &&
          (isMetaKey || isTouch || isNavigation)
        ) {
          // Toggle selection of current item while maintaining the selection of the other items
          isSelected = !isSelected;
          selected = this._getSelected();
          if (isSelected) {
            selected = selected.add([key]);
          } else {
            selected = selected.delete([key]);
          }
          this._selectionAnchor = key;
        } else if ((isTouch || isSpaceBarKeyEvent(eventKey)) && isSelected) {
          // On touch or spacebar, toggle the selection of the current item
          // Otherwise, select the current item even if it is already selected
          isSelected = false;
          selected = new KeySetImpl();
        } else {
          isSelected = true;
          selected = new KeySetImpl([key]);
          this._selectionAnchor = key;
        }
        // Since clicking on the item resets the selection, ignore the previous selection when computing the final selection for the leafOnly case.
        this._userSelectedOptionChange(selected, event, !isMetaKey && !isNavigation && !isTouch);
      }

      if (isSelected) {
        this._setSelected(item);
      } else {
        this._setUnselected(item);
      }
    },
    /**
     * Returns a oj-selector by Key.
     * @param {Object} key The key of the item.
     * @private
     */
    _getSelectorByItem: function (item) {
      return item.getElementsByTagName('oj-selector')[0];
    },
    /**
     * Clears old intermediate state and sets new state.
     * @param {Set} partialParents The keyset of the new partial state.
     * @private
     */
    _updateIndeterminateState: function (partialParents) {
      if (!this._isDefaultCheckBoxesEnabled()) {
        return;
      }
      var indeterminateSelectorSpans = Array.from(
        this.element[0].getElementsByClassName('oj-indeterminate')
      );
      var partialParentsArray = Array.from(partialParents.values());
      var selector;
      var i;
      for (i = indeterminateSelectorSpans.length - 1; i >= 0; i--) {
        selector = indeterminateSelectorSpans[i].parentElement;
        var rowKey = selector.rowKey;
        var indexOfPartialParent = partialParentsArray.indexOf(rowKey);
        if (indexOfPartialParent !== -1) {
          partialParentsArray.splice(indexOfPartialParent, 1);
        } else {
          selector.indeterminate = false;
        }
      }
      for (i = 0; i < partialParentsArray.length; i++) {
        var item = this._getItemByKey(partialParentsArray[i]);
        selector = this._getSelectorByItem(item);
        selector.indeterminate = true;
      }
    },
    /**
     * Style the provided item as selected.
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setSelected: function (item) {
      var itemContent = this._getItemContent(item);
      itemContent.classList.add(this.constants.OJ_SELECTED);
      item.setAttribute('aria-selected', 'true');
      var key = this._getKey(item);
      this._setupSelector(key, item, false);
    },
    _isHiddenElement: function (item) {
      const parents = this._getParents(
        item,
        this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM
      );
      for (let i = 1; i < parents.length; i++) {
        const subtree = this._getSubtree(parents[i]);
        if (subtree && subtree.style.display === 'none' && item !== parents[i]) {
          return true;
        }
      }
      return false;
    },
    _refreshTopAndBottomSelectionClasses: function () {
      if (this._isLeafOnlySelectionEnabled() || this._isMultiSelectionEnabled()) {
        const flatList = this._getFlatList();
        let previousItem;
        flatList.forEach((element) => {
          const itemContent = this._getItemContent(element);
          itemContent.classList.remove(this.constants.OJ_TREEVIEW_SELECTED_TOP_ITEM);
          itemContent.classList.remove(this.constants.OJ_TREEVIEW_SELECTED_BOTTOM_ITEM);
          const isSelected = this._isSelected(element);
          if (!previousItem && isSelected) {
            itemContent.classList.add(this.constants.OJ_TREEVIEW_SELECTED_TOP_ITEM);
            previousItem = element;
          }
          if (previousItem && isSelected) {
            const nextItem = this._getNextItem(element);
            if (!nextItem || !this._isSelected(nextItem)) {
              itemContent.classList.add(this.constants.OJ_TREEVIEW_SELECTED_BOTTOM_ITEM);
              previousItem = null;
            }
          }
        });
      }
    },
    /**
     * Style the provided item as unselected.
     * @param {Element} item The TreeView item element.
     * @private
     */
    _setUnselected: function (item) {
      var itemContent = this._getItemContent(item);
      itemContent.classList.remove(this.constants.OJ_SELECTED);
      item.setAttribute('aria-selected', 'false');
      var key = this._getKey(item);
      this._setupSelector(key, item, true);
    },
    /**
     * Clears the selection of all items.
     * @private
     */
    _clearSelection: function () {
      var items = this._getSelectedItemContents();
      for (var i = items.length - 1; i >= 0; i--) {
        this._setUnselected(items[i].parentElement);
      }
      if (this._isLeafOnlySelectionEnabled() || this._isMultiSelectionEnabled()) {
        const topItemContents = this.element[0].querySelectorAll(
          this.constants.PERIOD + this.constants.OJ_TREEVIEW_SELECTED_TOP_ITEM
        );
        topItemContents.forEach((itemContent) => {
          itemContent.classList.remove(this.constants.OJ_TREEVIEW_SELECTED_TOP_ITEM);
        });
        const bottomItemContents = this.element[0].querySelectorAll(
          this.constants.PERIOD + this.constants.OJ_TREEVIEW_SELECTED_BOTTOM_ITEM
        );
        bottomItemContents.forEach((itemContent) => {
          itemContent.classList.remove(this.constants.OJ_TREEVIEW_SELECTED_BOTTOM_ITEM);
        });
      }
    },
    _setupSelector: function (key, item, isEmpty) {
      if (this._isDefaultCheckBoxesEnabled()) {
        var selector = this._getSelectorByItem(item);
        var initialVal = isEmpty ? [] : [key];
        if (selector) {
          selector.selectedKeys = new KeySetImpl(initialVal);
        }
      }
    },
    /**
     * Retrieves selected item content divs.
     * @private
     *
     */
    _getSelectedItemContents: function () {
      return this.element[0].querySelectorAll(
        this.constants.PERIOD +
          this.constants.OJ_TREEVIEW_ITEM_CONTENT +
          this.constants.PERIOD +
          this.constants.OJ_SELECTED
      );
    },
    /**
     * Sets the focus (current item) on the provided item element.
     * @param {Element} item The TreeView item element.
     * @param {Event} event The event that triggers the focus.
     * @private
     */
    _focus: function (item, event) {
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
        }

        // Update option and fire optionChange
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
    _resetFocus: function () {
      if (this.options.currentItem) {
        var currentItem = this._getItemByKey(this.options.currentItem);
        if (currentItem) {
          this._setCurrentItem(currentItem);
          return;
        }
      }

      // CurrentItem not specified, so default to the first item.
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
    _setCurrentItem: function (item) {
      this._currentItem = item;
      // Set the item content to be the activedescendant so that the screen reader
      // does not read the child items.
      var root = this._getRoot();
      if (root && item) {
        root.setAttribute('aria-activedescendant', this._getItemId(item));
      }
    },
    _getItemId: function (item) {
      return item.getAttribute('id');
    },
    _getUniqueItemId: function () {
      return ElementUtils.getUniqueId(this.element[0].getAttribute('id')).concat(
        '_' + this._getTreeViewItemCount()
      );
    },
    _getTreeViewItemCount: function () {
      return this._getItems().length;
    },
    /**
     * Adds a busy state.
     * @param {string} description The description of the busy state.
     * @param {Objet} key The key of the item that is busy.
     * @return {Function} The resolve function of the busy state.
     * @private
     */
    _addBusyState: function (description, key) {
      var busyContext = Context.getContext(this.element[0]).getBusyContext();
      var id = this.element.attr('id');
      var busyContextPromise = busyContext.addBusyState({
        description: "The component identified by '" + id + "', " + description
      });
      this.m_fetching.add(key);
      this._changeStatusMessage(key, false);
      return function () {
        this._changeStatusMessage(key, true);
        this.m_fetching.delete(key);
        busyContextPromise();
        Promise.resolve(this._processEventQueue());
      }.bind(this);
    },
    /**
     * Changes aria live-region to give user message node is being fetched.
     * @param {Objet} key The key of the item that is being fetched.
     * @param {string} completed If fetching was completed by node.
     * @private
     */
    _changeStatusMessage: function (key, completed) {
      const status = this.element[0].getElementsByClassName('oj-helper-hidden-accessible')[0];
      let statusText;
      const nodeText =
        key !== null ? this._getNodeTextByKey(key) : this.element[0].getAttribute('id');
      if (!completed) {
        statusText = getTranslatedString('oj-ojTreeView.retrievingDataAria', {
          nodeText: nodeText
        });
      } else {
        statusText = getTranslatedString('oj-ojTreeView.receivedDataAria', {
          nodeText: nodeText
        });
      }
      status.textContent = statusText;
    },
    /**
     * Returns node text by key,
     * @param {Objet} key The key of the node..
     * @private
     */
    _getNodeTextByKey: function (key) {
      const item = this._getItemByKey(key);
      if (item) {
        const itemContent = this._getItemContent(item);
        const regularEx = /[\n\r]+|[\s]{2,}/g;
        // trim white space
        return itemContent.textContent.replace(regularEx, ' ').trim();
      }
      return null;
    },
    /**
     * Writes back a user-triggered change into the option.
     * @param {string} key The option name.
     * @param {Object} value The new value of the option.
     * @param {Event} event The event that triggers the change.
     * @private
     */
    _userOptionChange: function (key, value, event) {
      this.option(key, value, {
        _context: { originalEvent: event, writeback: true, internalSet: true }
      });
    },
    /**
     * Writes back a user-triggered selected change into the option.
     * @param {string} selected The selected key set thats user has triggered.
     * @param {Event} event The event that triggers the change.
     * @param {boolean} ignorePreviousSelection optional param to ignore previous selection.
     * @private
     */
    _userSelectedOptionChange: function (selected, event, ignorePreviousSelection) {
      let currentKeys = selected;
      if (this._isLeafOnlySelectionEnabled()) {
        let previousKeys = ignorePreviousSelection
          ? this._getEmptyKeySet(currentKeys)
          : this._getSelected();
        this._selectedKeysets = this.treeviewSelectionManager.computeSelection(
          currentKeys,
          previousKeys
        );
        currentKeys = this._selectedKeysets.selectedLeaves;
      }

      this._refreshTopAndBottomSelectionClasses();
      this._userOptionChange('selected', currentKeys, event);
      this._userOptionChange('selection', KeySetUtils.toArray(currentKeys), event);
      this._refreshSelectionItems();
    },
    /**
     * Returns an empty version of the given currentKeys.
     * @param {string} currentKeys current key set impl we should base off.
     * @private
     */
    _getEmptyKeySet: function (currentKeys) {
      if (currentKeys.isAddAll()) {
        return new AllKeySetImpl();
      }
      return new KeySetImpl();
    },
    /**
     * Filters out keys that are parents.
     * @param {string} currentKeys keyset we should be filtering.
     * @private
     */
    _filterOutParentKeys: function (currentKeys) {
      if (currentKeys.isAddAll()) {
        let baseAllKeySet = new AllKeySetImpl();
        let deletedLeafValues = [...currentKeys.deletedValues()].filter(
          (key) => !this.treeviewSelectionManager.parentKeyNodeMap.has(key)
        );
        baseAllKeySet = baseAllKeySet.delete(deletedLeafValues);
        return baseAllKeySet;
      }
      return new KeySetImpl(
        [...currentKeys.values()].filter(
          (key) => !this.treeviewSelectionManager.parentKeyNodeMap.has(key)
        )
      );
    },
    /**
     * Returns the dnd.drag.items option.
     * @return {Object} The option object. Defaults to {}.
     * @private
     */
    _getDragOptions: function () {
      return ((this.options.dnd || {}).drag || {}).items || {};
    },

    /**
     * Returns the dnd.drop.items option.
     * @return {Object} The option object. Defaults to {}.
     * @private
     */
    _getDropOptions: function () {
      return ((this.options.dnd || {}).drop || {}).items || {};
    },

    /**
     * Returns the closest item to the element.
     * @param {Element} elem The element.
     * @return {Element} The item content element.
     * @private
     */
    _getClosestItem: function (elem) {
      return this._closest(elem, this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM);
    },

    /**
     * Returns the closest item content to the element.
     * @param {Element} elem The element.
     * @return {Element} The item content element.
     * @private
     */
    _getClosestItemContent: function (elem) {
      return this._closest(elem, '.oj-treeview-item-content');
    },

    /**
     * Returns the closest disclosure icon to the element.
     * @param {Element} elem The element.
     * @return {Element} The disclosure icon element.
     * @private
     */
    _getClosestDisclosureIcon: function (elem) {
      return this._closest(elem, '.oj-treeview-disclosure-icon');
    },

    /**
     * Handles click event.
     * @param {Event} event The event.
     * @private
     */
    _handleClick: function (event) {
      // disable click event if selector is target
      if (isFromDefaultSelector(event)) {
        return;
      }
      var item;
      // Clicking on disclosure icon
      var disclosureIcon = this._getClosestDisclosureIcon(event.target);
      if (disclosureIcon) {
        item = this._getClosestItem(disclosureIcon);
        var itemKey = this._getKey(item);
        if (this.m_fetching.has(itemKey)) {
          return;
        }
        if (this._isExpanded(item)) {
          this._collapse(item, true, event);
        } else {
          this._expand(item, true, event);
        }
        this.touchStartEvent = null;
        return;
      }

      // Clicking on item content
      var itemContent = this._getClosestItemContent(event.target);
      if (itemContent) {
        item = itemContent.parentNode;
        this._select(item, event);
        this._focus(item, event);
        this.touchStartEvent = null;
        return;
      }

      // Clear selection otherwise
      var selectionMode = this.options.selectionMode;
      if (selectionMode !== 'none') {
        this._clearSelection();
        this._userSelectedOptionChange(new KeySetImpl(), event);
      }

      this.touchStartEvent = null;
    },
    _isDnD: function () {
      var dragOptions = this._getDragOptions();
      return Object.keys(dragOptions).length > 0;
    },
    /**
     * Handles mouse over event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseOver: function (event) {
      // Don't add hover effect for touch
      if (isTouchSupported() && this.touchStartEvent) {
        return;
      }

      var selectionMode = this.options.selectionMode;
      if (selectionMode === 'none' && !this._isDnD()) {
        return;
      }

      var target = this._getClosestDisclosureIcon(event.target);

      if (!target) {
        target = this._getClosestItemContent(event.target);
      }

      // Add hover effect
      if (target) {
        target.classList.remove(this.constants.OJ_DEFAULT);
        target.classList.add(this.constants.OJ_HOVER);
      }
    },

    /**
     * Handles mouse out event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseOut: function (event) {
      var target = this._getClosestDisclosureIcon(event.target);
      if (target) {
        target.classList.remove(this.constants.OJ_SELECTED);
      }

      if (!target) {
        target = this._getClosestItemContent(event.target);
      }

      // Remove hover effect
      if (target) {
        target.classList.add(this.constants.OJ_DEFAULT);
        target.classList.remove(this.constants.OJ_HOVER);
      }
    },

    /**
     * Handles mouse down event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseDown: function (event) {
      // disable click event if selector is target
      if (isFromDefaultSelector(event)) {
        return;
      }
      var disclosureIcon = this._getClosestDisclosureIcon(event.target);
      if (disclosureIcon) {
        disclosureIcon.classList.add(this.constants.OJ_SELECTED);
      }
    },

    /**
     * Handles mouse up event.
     * @param {Event} event The event.
     * @private
     */
    _handleMouseUp: function (event) {
      var disclosureIcon = this._getClosestDisclosureIcon(event.target);
      if (disclosureIcon) {
        disclosureIcon.classList.remove(this.constants.OJ_SELECTED);
      }
    },

    /**
     * Handles key down event.
     * @param {Event} event The event.
     * @private
     */
    _handleKeyDown: function (event) {
      var currentItem = this._currentItem;
      var nextItem;
      var eventKey = event.key || event.keyCode;
      if (
        isArrowUpKeyEvent(eventKey) ||
        isArrowDownKeyEvent(eventKey)
      ) {
        nextItem = isArrowDownKeyEvent(eventKey)
          ? this._getNextActionableItem(currentItem, 'focus')
          : this._getPreviousActionableItem(currentItem, 'focus');
        if (nextItem) {
          event.preventDefault(); // prevent scrolling the page
          if (this._isSelected(currentItem) && event.shiftKey) {
            // Shift+Up/Down either extends the selection to the next item or cancels previous Shift+Down/Up
            this._select(this._isSelected(nextItem) ? currentItem : nextItem, event);
          }
          this._scrollToVisible(nextItem);
          this._focus(nextItem, event);
        }
      } else if (
        isArrowLeftKeyEvent(eventKey) ||
        isArrowRightKeyEvent(eventKey)
      ) {
        var isRTL = this._GetReadingDirection() === 'rtl';
        var isEnd =
          (!isRTL && isArrowRightKeyEvent(eventKey)) ||
          (isRTL && isArrowLeftKeyEvent(eventKey));
        if (isEnd && !this._isLeaf(currentItem) && !this._isExpanded(currentItem)) {
          event.preventDefault(); // prevent scrolling the page
          this._expand(currentItem, true, event);
        } else if (!isEnd && !this._isLeaf(currentItem) && this._isExpanded(currentItem)) {
          event.preventDefault(); // prevent scrolling the page
          this._collapse(currentItem, true, event);
        } else {
          nextItem = isEnd
            ? this._getNextActionableItem(currentItem, 'focus')
            : this._getPreviousActionableItem(currentItem, 'focus');
          if (nextItem) {
            event.preventDefault(); // prevent scrolling the page
            this._focus(nextItem, event);
          }
        }
      } else if (
        isEnterKeyEvent(eventKey) ||
        isSpaceBarKeyEvent(eventKey)
      ) {
        // ENTER or SPACE
        event.preventDefault(); // prevent scrolling the page
        this._select(currentItem, event);
      } else if (
        isLetterAKeyEvent(eventKey) &&
        isMetaKeyPressed(event) &&
        (this._isLeafOnlySelectionEnabled() || this._isMultiSelectionEnabled())
      ) {
        // CTRL - A
        event.preventDefault(); // prevent default ctrl a
        var items = this._getItems();
        var selected = new AllKeySetImpl();
        for (var i = 0; i < items.length; i++) {
          if (this._isActionable(items[i], 'select')) {
            this._setSelected(items[i]);
          }
        }
        this._userSelectedOptionChange(selected, event);
      }
    },
    /**
     * Scroll as needed to make an element visible in the viewport
     * @param {Element} elem the element to make visible
     * @private
     */
    _scrollToVisible: function (elem) {
      const tree = this.element[0];
      const spacerHeight = this._getItemSpacer(elem).offsetHeight;

      const treeBoundingClientRect = tree.getBoundingClientRect();
      const viewportStart = treeBoundingClientRect.top;
      const viewportEnd = treeBoundingClientRect.bottom;

      const elemBoundingClientRect = elem.getBoundingClientRect();
      const elemTop = elemBoundingClientRect.top;
      const elemBottom = elemBoundingClientRect.top + spacerHeight;

      if (elemTop >= viewportStart && elemBottom <= viewportEnd) {
        return;
      }
      // +- 1 for the focus border
      if (elemTop < viewportStart) {
        tree.scrollTop += elemTop - viewportStart - 1;
      } else if (elemBottom > viewportEnd) {
        tree.scrollTop += elemBottom - viewportEnd + 1;
      }
    },
    /**
     * Returns the item below the provided item.
     * @param {Element} item The TreeView item element.
     * @return {Element} The next item element.
     * @private
     */
    _getNextItem: function (item) {
      // If the item is expanded, go to the first child
      if (!this._isLeaf(item) && this._isExpanded(item)) {
        var firstChild = this._getChildItems(item)[0];
        if (firstChild) {
          return firstChild;
        }
      }

      // Otherwise, go to the next sibling of the item or its ancestors
      var parent = item;
      while (parent) {
        var nextSibling = this._getNextSibling(
          parent,
          this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM
        );
        if (nextSibling) {
          return nextSibling;
        }

        parent = this._getParentItem(parent);
      }

      // Otherwise, don't go anywhere
      return null;
    },

    /**
     * Returns the closest item below the provided item that can accept the specified action.
     * @param {Element} item The TreeView item element.
     * @param {string} actionName The action name: 'select' or 'focus'.
     * @return {Element} The next item element.
     * @private
     */
    _getNextActionableItem: function (item, actionName) {
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
    _getPreviousItem: function (item) {
      // Go to the last expanded child of the previous sibling
      var prevSibling = this._getPreviousSibling(
        item,
        this.constants.PERIOD + this.constants.OJ_TREEVIEW_ITEM
      );
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
      }

      // Otherwise, go to the parent
      var parent = this._getParentItem(item);
      if (parent) {
        return parent;
      }

      // Otherwise, don't go anywhere
      return null;
    },
    /**
     * Returns the closest item above the provided item that can accept the specified action.
     * @param {Element} item The TreeView item element.
     * @param {string} actionName The action name: 'select' or 'focus'.
     * @return {Element} The previous item element.
     * @private
     */
    _getPreviousActionableItem: function (item, actionName) {
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
    _handleDragStart: function (event) {
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
      }

      this._refreshTopAndBottomSelectionClasses();

      var dragOptions = this._getDragOptions();
      var dataTransfer = event.originalEvent.dataTransfer;

      var dragImage = document.createElement('ul');
      dragImage.classList.add(this.constants.OJ_TREEVIEW_DRAG_IMAGE);
      dragImage.classList.add(this.constants.OJ_TREEVIEW_LIST);
      if (isSafari()) {
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
        const data = item[self.constants.OJ_ITEM_DATA];
        if (data) {
          dragData.push(data);
        } else {
          dragData.push(item.parentElement.innerHTML);
        }

        var itemSpacer = self._getItemSpacer(item);
        var offset = item.getBoundingClientRect();

        // added in case window has scrolled the treeview down
        const windowScrollLeft =
          window.pageXOffset !== undefined
            ? window.pageXOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
        const windowScrollTop =
          window.pageYOffset !== undefined
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop;

        var offsetTop = offset.top + windowScrollTop;
        var offsetLeft = itemSpacer === undefined ? 0 : itemSpacer.offsetWidth + windowScrollLeft;

        if (isRTL) {
          var itemContentChildren = self._getItemContent(item).children;
          var childrenWidth = 0;

          for (var j = 0; j < itemContentChildren.length; j++) {
            childrenWidth += itemContentChildren[j].offsetWidth;
          }
          offsetLeft = self._getTreeviewWidth() + offset.x - childrenWidth - offsetLeft;
        }

        offsetTop += document.body.scrollTop;
        offsetLeft += document.body.scrollLeft;

        var clonedItem = item.cloneNode(true);
        clonedItem.style.top = offsetTop + 'px';
        clonedItem.style.left = offsetLeft + 'px';

        item.classList.add(self.constants.OJ_TREEVIEW_DRAG_SOURCE);
        clonedItem.classList.add(self.constants.OJ_TREEVIEW_DRAG_IMAGE);
        clonedItem.classList.add(self.constants.OJ_TREEVIEW_DRAG_IMAGE_ITEM);

        // Don't include children in the drag image
        var children = self._getSubtree(clonedItem);
        if (children) {
          clonedItem.removeChild(children);
        }

        var clonedItemContent = self._getItemContent(clonedItem);
        self._setUnselected(clonedItem);
        clonedItemContent.classList.remove(self.constants.OJ_TREEVIEW_SELECTED_TOP_ITEM);
        clonedItemContent.classList.remove(self.constants.OJ_TREEVIEW_SELECTED_BOTTOM_ITEM);
        clonedItemContent.classList.remove(self.constants.OJ_FOCUS);
        clonedItemContent.classList.remove(self.constants.OJ_HOVER);
        clonedItemContent.classList.remove(self.constants.OJ_FOCUS_HIGHLIGHT);
        clonedItemContent.classList.remove(self.constants.OJ_DRAGGABLE);

        var clonedItemSpacer = clonedItem.getElementsByClassName(
          self.constants.OJ_TREEVIEW_SPACER
        )[0];
        if (clonedItemSpacer) {
          var spacer = document.createElement('span');
          self._addTreeviewSpacerClass(spacer);
          clonedItemContent.insertBefore(spacer, clonedItemSpacer); // @HTMLUpdateOK
          clonedItemContent.removeChild(clonedItemSpacer);
        }

        if (
          self._isDefaultCheckBoxesEnabled() &&
          self._isActionable(item, 'focus') &&
          self._isActionable(item, 'select')
        ) {
          var clonedSelector = clonedItem.getElementsByClassName(
            self.constants.OJ_TREEVIEW_SELECTOR
          )[0];
          clonedSelector.firstChild.selectedKeys = self.options.selected;
          clonedSelector.firstChild.rowKey = self._getKey(item);
        }
        // Drag image offset is based on the top left corner of the resulting drag image
        if (offsetTop < topmost) {
          topmost = offsetTop;
        }
        if (offsetLeft < leftmost) {
          leftmost = offsetLeft;
        }

        dragImage.appendChild(clonedItem); // @HTMLUpdateOK
      });
      // : There's inconsistency in how the drag image offset is computed
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
      }

      // Drag image has to be attached to the DOM when being assigned to the dataTransfer.
      // It has to be removed afterwards to prevent leaks.
      document.body.appendChild(dragImage); // @HTMLUpdateOK
      dataTransfer.setDragImage(dragImage, event.pageX - leftmost, event.pageY - topmost);
      setTimeout(function () {
        dragImage.parentElement.removeChild(dragImage);
      }, 0);

      var callback = dragOptions.dragStart;
      if (callback) {
        callback(event.originalEvent, { items: dragData });
      }

      if (event.originalEvent.defaultPrevented) {
        items.forEach((element) => {
          element.classList.remove(this.constants.OJ_TREEVIEW_DRAG_SOURCE);
        });
      }
    },
    /**
     * Handles DnD drag and dragEnd events.
     * @param {Event} event The event.
     * @param {string} eventType The event type (drag or dragEnd).
     * @private
     */
    _handleDragSourceEvent: function (event, eventType) {
      if (this.touchStartEvent && this.contextMenuOpen && eventType === 'drag') {
        event.preventDefault();
        return;
      }
      if (eventType === 'dragEnd') {
        this._removeGhostElements();
        this._dropLine.style.display = 'none';
      }
      var callback = this._getDragOptions()[eventType];
      if (callback) {
        callback(event.originalEvent);
      }
    },
    _getTreeviewWidth: function () {
      return this.element[0].offsetWidth;
    },
    _getItemSpacer: function (item) {
      return item.getElementsByClassName(this.constants.OJ_TREEVIEW_SPACER)[0];
    },
    /**
     * Handles DnD dragEnter, dragOver, dragLeave, and drop events.
     * @param {Event} event The event.
     * @param {string} eventType The event type (dragEnter, dragOver, dragLeave, or drop).
     * @private
     */
    _handleDropTargetEvent: function (event, eventType) {
      var dropOptions = this._getDropOptions();
      var optionTypes = dropOptions.dataTypes;
      var dropDataTypes = typeof optionTypes === 'string' ? [optionTypes] : optionTypes || [];
      var callback = dropOptions[eventType];
      var targetItem = this._getClosestItem(event.target);
      if (!targetItem) {
        return;
      }

      if (this.touchStartEvent && this.contextMenuOpen) {
        event.preventDefault();
        return;
      }

      if (
        this.touchStartEvent &&
        (eventType === 'dragEnter' || eventType === 'dragOver' || eventType === 'dragLeave')
      ) {
        this.isTouchDrag = true;
      }

      // Position drop effects based on the spacer (disclosure icon) because it takes up the entire item height
      var spacer = this._getItemSpacer(targetItem);
      var spacerRect = spacer.getBoundingClientRect();

      var position = 'inside';
      var relativeY = event.originalEvent.clientY - spacerRect.top;
      if (relativeY < 0.25 * spacerRect.height) {
        position = 'before';
      } else if (relativeY > 0.75 * spacerRect.height) {
        position = this._isExpanded(targetItem) ? 'first' : 'after';
      }

      if (callback) {
        callback(event.originalEvent, { item: targetItem, position: position });
      }

      for (var i = 0; i < dropDataTypes.length; i++) {
        var dataTypes = event.originalEvent.dataTransfer.types;
        if (dataTypes && dataTypes.indexOf(dropDataTypes[i]) >= 0) {
          event.preventDefault();
          break;
        }
      }

      if (
        (eventType === 'dragEnter' || eventType === 'dragOver') &&
        event.originalEvent.defaultPrevented
      ) {
        var isRTL = this._GetReadingDirection() === 'rtl';
        // Draw the drop target effect on dragEnter and dragOver
        var dropLineTop = targetItem.offsetTop;
        if (position !== 'before') {
          dropLineTop += spacerRect.height;
        }

        if (position !== 'inside') {
          // calculate drop line size
          var dropLineOffset;
          var disclosureIcon;
          var parentItem = this._getParentItem(targetItem);
          if (parentItem && this._isLeaf(targetItem)) {
            dropLineOffset = spacerRect.width;
            disclosureIcon = this._getItemDisclosureIcon(parentItem);
            // using height here because we pad the width giving incorrect fontSize
            dropLineOffset -= disclosureIcon.offsetHeight;
          } else if (parentItem && !this._isLeaf(targetItem)) {
            dropLineOffset = spacerRect.width;
            if (position === 'first') {
              // first inside expanded parent align drop line with children
              disclosureIcon = this._getItemDisclosureIcon(targetItem);
              // using height here because we pad the width giving incorrect fontSize
              dropLineOffset += disclosureIcon.offsetHeight;
            }
          } else if (!parentItem) {
            dropLineOffset = 0;
            if (position === 'first') {
              // first inside expanded parent align drop line with children
              disclosureIcon = this._getItemDisclosureIcon(targetItem);
              // using height here because we pad the width giving incorrect fontSize
              dropLineOffset += disclosureIcon.offsetHeight;
            }
          }
          this._removeDropClass(targetItem);
          var width = this._getTreeviewWidth() - parseInt(dropLineOffset, 10) + 'px';
          var left = isRTL ? '0px' : dropLineOffset + 'px';
          this._dropLine.style.width = width;
          this._dropLine.style.left = left;
          this._dropLine.style.top = dropLineTop + 'px';
          this._dropLine.style.display = '';
        } else {
          this._dropLine.style.display = 'none';
          this._addDropClass(targetItem);
        }
      } else {
        if (eventType === 'drop') {
          this._removeGhostElements();
          this._dropLine.style.display = 'none';
          this._removeDropClass(targetItem);
        }

        /* Only remove the dropline on dragLeave if it's leaving treeview or else it will flicker in-between items.
         *  For X: we only care about the last DragLeave before exiting the treeview witch will be on div itemContent
         *  and where that drag happens in respect to the itemContent width.
         *  For Y: only process dragLeave if it gets fired on the appropriate item with the appropriate position.
         */
        if (eventType === 'dragLeave') {
          var targetWidth = targetItem.offsetWidth;
          if (
            event.target.nodeName === 'DIV' &&
            event.target.classList.contains(this.constants.OJ_TREEVIEW_ITEM_CONTENT) &&
            (event.offsetX >= targetWidth || event.offsetX <= 0)
          ) {
            this._dropLine.style.display = 'none';
            this._removeDropClass(targetItem);
          } else if (event.offsetY >= targetItem.offsetHeight || event.offsetY <= 0) {
            var treeviewItems = this._getItems();
            if (treeviewItems.length > 0) {
              var firstItem = treeviewItems[0];
              var lastItem = treeviewItems[treeviewItems.length - 1];
              if (
                (targetItem === lastItem && position === 'after') ||
                (targetItem === firstItem && position === 'before')
              ) {
                this._dropLine.style.display = 'none';
              }
            } else if (treeviewItems.length === 0) {
              this._dropLine.style.display = 'none';
            }
          }
          if (position !== 'inside') {
            this._removeDropClass(targetItem);
          }
        }
      }
    },
    _addDropClass: function (item) {
      var itemContent = this._getItemContent(item);
      itemContent.classList.add(this.constants.OJ_TREEVIEW_DROP_ZONE);
    },
    _removeDropClass: function (item) {
      var itemContent = this._getItemContent(item);
      itemContent.classList.remove(this.constants.OJ_TREEVIEW_DROP_ZONE);
    },
    _removeGhostElements: function () {
      var ghostElements = this.element[0].querySelectorAll(
        this.constants.PERIOD + this.constants.OJ_TREEVIEW_DRAG_SOURCE
      );
      for (var i = ghostElements.length - 1; i >= 0; i--) {
        ghostElements[i].classList.remove(this.constants.OJ_TREEVIEW_DRAG_SOURCE);
      }
    },
    // @inheritdoc
    _NotifyContextMenuGesture: function (menu, event, eventType) {
      if (eventType === 'keyboard') {
        // If launched by Shift+F10, the context menu should be rendered next
        // to the currentItem.
        var launcher = this._currentItem ? this._getItemContent(this._currentItem) : this.element;
        var openOptions = {
          launcher: this._getRoot(),
          initialFocus: 'menu',
          position: { my: 'start top', at: 'start bottom', of: launcher }
        };
        this._OpenContextMenu(event, eventType, openOptions);
      } else if (!this.isTouchDrag) {
        if (this.touchStartEvent) {
          this.contextMenuOpen = true;
        }
        var item = this._getClosestItem(event.target);
        if (item) {
          this._setCurrentItem(item);
          this._userOptionChange('currentItem', this._getKey(this._currentItem), event);
          this._superApply(arguments);
        }
      }
    },
    // @inheritdoc
    refresh: function () {
      this._super();
      this._refreshId += 1;

      delete this.m_template;
      delete this.m_engine;
      delete this.m_dataSource;

      this._expandedChildrenMap = new Map();
      this.m_fetching = new Set();

      this._render();
    },

    // @inheritdoc
    getNodeBySubId: function (locator) {
      if (locator == null) {
        return this.element ? this.element[0] : null;
      }

      var key = locator.key;
      var subId = locator.subId;
      var item = this._getItemByKey(key);
      var ret;

      if (subId === 'oj-treeview-disclosure' && item) {
        ret = item.getElementsByClassName(this.constants.OJ_TREEVIEW_DISCLOSURE_ICON)[0];
      } else if (subId === this.constants.OJ_TREEVIEW_ITEM && item) {
        ret = item.getElementsByClassName(this.constants.OJ_TREEVIEW_ITEM_CONTENT)[0];
      }

      // Non-null locators have to be handled by the component subclasses
      return ret || null;
    },

    // @inheritdoc
    getSubIdByNode: function (node) {
      if (!this.element[0].contains(node)) {
        return null;
      }

      var subId;
      var disclosureIcon = this._getClosestDisclosureIcon(node);
      var item = this._getClosestItem(node);

      if (disclosureIcon) {
        subId = 'oj-treeview-disclosure';
      } else if (item) {
        subId = this.constants.OJ_TREEVIEW_ITEM;
      } else {
        return null;
      }

      return { subId: subId, key: this._getKey(item) };
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
    getContextByNode: function (node) {
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
        if (itemParentChildren[i].classList.contains(this.constants.OJ_TREEVIEW_ITEM)) {
          treeViewItems.push(itemParentChildren[i]);
        }
      }

      var context = {
        subId: this.constants.OJ_TREEVIEW_ITEM,
        index: treeViewItems.indexOf(item),
        parentKey: this._getKey(this._getParentItem(item))
      };

      context.component = __GetWidgetConstructor(this.element);
      if (this._FixRendererContext) {
        context = this._FixRendererContext(context);
      }

      var metadata = item[this.constants.OJ_ITEM_METADATA];
      if (metadata) {
        context.metadata = metadata;
        context.data = item[this.constants.OJ_ITEM_DATA];
        context.datasource = this.options.data;

        // Merge properties from metadata into item context
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
    _setOption: function (key, value, flags) {
      var self = this;
      var i;
      var items;

      // Call the super to update the property values
      if (
        !this._isLeafOnlySelectionEnabled() ||
        (this._isLeafOnlySelectionEnabled() && (key !== 'selected' || key !== 'selection'))
      ) {
        this._superApply(arguments);
      }

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
      } else if (key === 'selected') {
        if (this._isLeafOnlySelectionEnabled()) {
          let currentKeys = value;
          currentKeys = this._filterOutParentKeys(currentKeys);
          let previousKeys = this._getEmptyKeySet(currentKeys);
          this._selectedKeysets = this.treeviewSelectionManager.computeSelection(
            currentKeys,
            previousKeys
          );
          // eslint-disable-next-line no-param-reassign
          value = this._selectedKeysets.selectedLeaves;
          arguments[1] = value;
          this._superApply(arguments);
        }
        var selectedArray = KeySetUtils.toArray(value);
        this._userOptionChange('selection', selectedArray, null);
        this._refreshSelectionItems();
      } else if (key === 'selection') {
        var selectionKeySet = KeySetUtils.toKeySet(value);
        if (this._isLeafOnlySelectionEnabled()) {
          let currentKeys = selectionKeySet;
          currentKeys = this._filterOutParentKeys(currentKeys);
          let previousKeys = this._getEmptyKeySet(currentKeys);
          this._selectedKeysets = this.treeviewSelectionManager.computeSelection(
            currentKeys,
            previousKeys
          );
          // eslint-disable-next-line no-param-reassign
          selectionKeySet = this._selectedKeysets.selectedLeaves;
          arguments[1] = KeySetUtils.toArray(selectionKeySet);
          this._superApply(arguments);
        }
        this._userOptionChange('selected', selectionKeySet, null);
        this._refreshSelectionItems();
      } else if (key === 'currentItem') {
        this._resetFocus();
      } else if (key === 'data') {
        this._removeDataProviderEventListeners();
        this.options.data = value;
        if (!this.options.data) {
          this._getRoot().remove();
        }
        this._addDataProviderEventListeners();
        this.refresh();
      } else {
        this.refresh();
      }
    },
    _SetupResources: function () {
      this._super();
      this._addDataProviderEventListeners();
    },
    _ReleaseResources: function () {
      this._super();
      this._removeDataProviderEventListeners();
    },
    // @inheritdoc
    _destroy: function () {
      this._removeDataProviderEventListeners();
      this._super();
    },
    _addDataProviderEventListeners: function () {
      var dataProvider = this.options.data;
      if (dataProvider && oj.DataProviderFeatureChecker.isTreeDataProvider(dataProvider)) {
        this.m_handleModelMutateEventListener = this.handleModelMutateEvent.bind(this);
        this.m_handleModelRefreshEventListener = this.handleModelRefreshEvent.bind(this);

        dataProvider.addEventListener('mutate', this.m_handleModelMutateEventListener);
        dataProvider.addEventListener('refresh', this.m_handleModelRefreshEventListener);
      }
    },
    _removeDataProviderEventListeners: function () {
      var dataProvider = this.options.data;
      if (dataProvider && oj.DataProviderFeatureChecker.isTreeDataProvider(dataProvider)) {
        dataProvider.removeEventListener('mutate', this.m_handleModelMutateEventListener);
        dataProvider.removeEventListener('refresh', this.m_handleModelRefreshEventListener);
      }
    },
    handleModelMutateEvent: function (event) {
      if (this._isLeafOnlySelectionEnabled()) {
        error('Mutations are not supported in selectionMode: leafOnly  ');
        return;
      }
      if (!this.isReady()) {
        this._pushToEventQueue(event);
        return;
      }
      if (event.detail.remove != null) {
        this.handleModelRemoveEvent(event);
      }
      if (event.detail.add != null) {
        this.handleModelAddEvent(event);
      }
      if (event.detail.update != null) {
        this.handleModelChangeEvent(event);
      }
      this._processEventQueue();
    },
    _pushToEventQueue: function (event) {
      if (this.m_eventQueue == null) {
        this.m_eventQueue = [];
      }

      this.m_eventQueue.push(event);
    },
    _clearEventQueue: function () {
      if (this.m_eventQueue != null) {
        this.m_eventQueue.length = 0;
      }
    },
    _processEventQueue: function () {
      if (!this.isReady()) {
        return;
      }
      let event;

      if (this.m_eventQueue != null && this.m_eventQueue.length > 0) {
        // see if we can find a refresh event
        for (var i = 0; i < this.m_eventQueue.length; i++) {
          event = this.m_eventQueue[i];
          if (event.type === 'refresh' && (!event.detail || (event.detail && !event.detail.keys))) {
            this.handleModelRefreshEvent(event);
            // we are done
            return;
          }
        }

        // we'll just need to handle one event at a time since processEventQueue will be triggered whenever an event is done processing
        event = this.m_eventQueue.shift();
        if (event.type === 'mutate') {
          this.handleModelMutateEvent(event);
        }
        if (event.type === 'refresh' && event.detail && event.detail.keys) {
          this.handleModelRefreshEvent(event);
        }
      }
    },
    isReady: function () {
      return this.m_fetching.size === 0;
    },
    handleModelRemoveEvent: function (event) {
      var self = this;
      var keys = event.detail.remove.keys;
      var removedKeys = [];
      if (keys == null || keys.size === 0) {
        return;
      }

      const currentItemKey = this._getKey(this._currentItem);
      const oldFlatList = this._getFlatList();
      const oldCurrentItemIndex = oldFlatList.indexOf(this._currentItem);

      keys.forEach(function (key) {
        let savedParentKey;
        const addEvent = event.detail.add;
        if (!addEvent || (addEvent && !addEvent.keys.has(key))) {
          const itemParentKey = self._getKey(self._getParentItem(self._getItemByKey(key)));
          if (addEvent && addEvent.parentKeys) {
            const foundParentKey = addEvent.parentKeys.find((parentKey) =>
              oj.KeyUtils.equals(parentKey, itemParentKey)
            );
            if (foundParentKey) {
              savedParentKey = foundParentKey;
            }
          }
          removedKeys = removedKeys.concat(self._removeAllChildrenOfParentKey(key, savedParentKey));
        }
      });

      if (removedKeys.length === 0) {
        return;
      }

      // checks whether the removed item is selected, and adjust the value as needed
      var selected = this._getSelected();
      if (selected != null) {
        var newSelected = selected.delete(removedKeys);
        // update selected/selection option if it did changed
        if (selected !== newSelected) {
          this._userSelectedOptionChange(newSelected, event);
        }
      }
      this._refreshTopAndBottomSelectionClasses();

      // checks whether the removed item is expanded, and adjust the value as needed
      var expanded = this.options.expanded;
      if (expanded != null) {
        var newExpanded = expanded.delete(removedKeys);
        this._uiExpanded.delete(removedKeys);
        // update selection option if it did changed
        if (expanded !== newExpanded) {
          this._userOptionChange('expanded', newExpanded, null);
        }
      }
      if (!this._getItemByKey(currentItemKey)) {
        const newFlatList = this._getFlatList();
        let newCurrentItem = null;
        if (newFlatList.length > 0) {
          for (let i = oldCurrentItemIndex - 1; i >= 0; --i) {
            if (
              newFlatList.includes(oldFlatList[i]) &&
              this._isActionable(oldFlatList[i], 'focus')
            ) {
              newCurrentItem = oldFlatList[i];
              break;
            }
          }
          if (!newCurrentItem) {
            for (let i = oldCurrentItemIndex; i < oldFlatList.length; i++) {
              if (
                newFlatList.includes(oldFlatList[i]) &&
                this._isActionable(oldFlatList[i], 'focus')
              ) {
                newCurrentItem = oldFlatList[i];
                break;
              }
            }
          }
          if (!newCurrentItem) {
            const items = this._getItems();
            if (items.length > 0) {
              newCurrentItem = items[0];
            }
          }
          if (newCurrentItem) {
            this._setCurrentItem(newCurrentItem);
            this._userOptionChange('currentItem', this._getKey(this._currentItem), event);
            return;
          }
        }
      }
      this._resetFocus();
    },
    _getFlatList: function () {
      const flatList = [];
      this._getItems().forEach((item) => {
        const isHiddenElement = this._isHiddenElement(item);
        if (!isHiddenElement) {
          flatList.push(item);
        }
      });
      return flatList;
    },
    _changeNodeToLeaf: function (item, subtree) {
      if (item === this.element[0]) {
        return;
      }

      item.removeChild(subtree);
      // eslint-disable-next-line no-param-reassign
      item[this.constants.OJ_ITEM_METADATA].leaf = true;
      item.classList.add(this.constants.OJ_TREEVIEW_LEAF);
      item.classList.remove(this.constants.OJ_EXPANDED);
      item.removeAttribute('aria-expanded');
      item.classList.remove(this.constants.OJ_COLLAPSED);
      var spacer = this._getItemSpacer(item);
      this._removeIndentation(spacer);
      this._addIndentation(item, spacer);

      var key = this._getKey(item);
      var keys = [];
      keys.push(key);
      var expanded = this.options.expanded;
      if (expanded != null) {
        var newExpanded = expanded.delete(keys);
        this._uiExpanded.delete(keys);
        // update selection option if it did changed
        if (expanded !== newExpanded) {
          this._userOptionChange('expanded', newExpanded, null);
        }
      }

      var disclosureIcon = this._getItemDisclosureIcon(item);
      this._removeDisclosureClasses(disclosureIcon);
    },
    _changeNodeToParent: function (item) {
      // eslint-disable-next-line no-param-reassign
      item[this.constants.OJ_ITEM_METADATA].leaf = false;
      item.classList.remove(this.constants.OJ_TREEVIEW_LEAF);
      item.classList.add(this.constants.OJ_COLLAPSED);
      this._setAriaExpanded(item, 'false');
      var spacer = this._getItemSpacer(item);
      this._removeIndentation(spacer);
      this._addIndentation(item, spacer);

      var disclosureIcon = this._getItemDisclosureIcon(item);
      this._addDisclosureClasses(disclosureIcon);
    },
    _setAriaExpanded: function (item, state) {
      item.setAttribute('aria-expanded', state);
    },
    _getItemDisclosureIcon: function (item) {
      return item.getElementsByTagName('ins')[0];
    },
    _removeAllChildrenOfParentKey: function (key, savedParentKey) {
      /* savedParentKey means remove all children but leave parent called when we have a smart refresh event from the dp*/
      var self = this;
      var removedKeys = [];
      var elem = this._getItemByKey(key);
      if (elem) {
        this._getChildItems(elem).forEach(function (child) {
          var childkey = self._getKey(child);
          var childKeys = self._removeAllChildrenOfParentKey(childkey, savedParentKey);
          removedKeys = removedKeys.concat(childKeys);
        });
        var subtree = elem.parentNode;
        if (!oj.KeyUtils.equals(key, savedParentKey)) {
          subtree.removeChild(elem);
          this._keyList.delete(key);
          removedKeys.push(key);
        }
        if (subtree.getElementsByTagName('li').length === 0 && !savedParentKey) {
          this._changeNodeToLeaf(subtree.parentNode, subtree);
        }
      }
      return removedKeys;
    },
    _isLeafIcon: function (item) {
      return item.classList.contains(this.constants.OJ_TREEVIEW_LEAF);
    },
    handleModelReorder: function (moveKey, locationKey, afterFlag) {
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
        locationItemParent.insertBefore(reorderItem, locationItem.nextSibling); // @HTMLUpdateOK
      } else {
        locationItemParent.insertBefore(reorderItem, locationItem); // @HTMLUpdateOK
      }
    },
    getLastItemKey(list) {
      return this._getKey(list[list.length - 1]);
    },
    handleModelAddEvent: function (event) {
      var addEvent = event.detail.add;
      var parentKeys = addEvent.parentKeys;
      var indexes = addEvent.indexes;
      var i = 0;
      var self = this;
      var addKeys = event.detail.add.keys;
      const keys = [];
      const addEventBusyResolve = this._addBusyState(
        'validating mutation data for add event',
        null
      );
      this._fetchEventDataForKeys(addEvent).then((validatededEventData) => {
        if (validatededEventData === null) {
          addEventBusyResolve();
          return;
        }
        this._truncateIfOverMaxCount(validatededEventData);
        const data = validatededEventData.data;
        const metadata = validatededEventData.metadata;
        addKeys.forEach((key) => {
          if (
            !event.detail.remove ||
            (event.detail.remove && !event.options.detail.remove.keys.has(key))
          ) {
            keys.push(key);
          } else if (
            addEvent.addBeforeKeys &&
            addEvent.addBeforeKeys[i] &&
            addEvent.addBeforeKeys.length !== 0
          ) {
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
        });
        parentKeys.forEach(function (key) {
          var parentItem = self._getItemByKey(key);
          if (parentItem && self._isLeafIcon(parentItem)) {
            self._changeNodeToParent(parentItem);
          }
        });
        const initialKeys = this._getAllTreeviewKeys();
        const finalKeys = getAddEventKeysResult(initialKeys, addEvent, true);
        if (
          data &&
          keys.length > 0 &&
          data.length > 0 &&
          keys.length === data.length &&
          (indexes == null || indexes.length === data.length)
        ) {
          for (i = 0; i < data.length; i++) {
            var parentKey = parentKeys[i];
            var index = this._getInsertIndex(metadata[i].key, parentKey, finalKeys);
            if (index === null) {
              // cannot find index, skip this iteration
              // eslint-disable-next-line no-continue
              continue;
            }
            var parentItem = this._getItemByKey(parentKey);
            var subtree;
            if (parentKey == null) {
              subtree = this._getRoot();
              if (subtree) {
                this._renderItem(subtree, { data: [data[i]], metadata: [metadata[i]] }, 0, index);
              }
            } else if (parentItem) {
              subtree = this._getSubtree(parentItem);
              if (subtree) {
                this._renderItem(subtree, { data: [data[i]], metadata: [metadata[i]] }, 0, index);
              }
            }
          }
          this._refreshTopAndBottomSelectionClasses();
        }
        addEventBusyResolve();
      });
    },
    _getInsertIndex: function (key, parentKey, finalKeys) {
      let parent;
      if (!parentKey) {
        parent = this.element[0];
      } else {
        parent = this._getItemByKey(parentKey);
      }
      // bad parent key or do not have parentKey yet
      // potentially parent added out of order real gross
      if (!parent) {
        return null;
      }
      let finalKeysIndex = finalKeys.indexOf(key);
      if (finalKeysIndex === -1) {
        return null;
      }
      let childItems = this._getChildItems(parent);
      // assume insert at end
      let index = childItems.length;
      for (let i = 0; i < childItems.length; i++) {
        let child = childItems[i];
        let childKey = this._getKey(child);
        if (finalKeys.indexOf(childKey) > finalKeysIndex) {
          index = i;
          break;
        }
      }
      return index;
    },
    _getAllTreeviewKeys: function () {
      const keys = [];
      const items = this._getItems();
      for (let i = 0; i < items.length; i++) {
        keys.push(this._getKey(items[i]));
      }
      return keys;
    },
    handleModelChangeEvent: function (event) {
      const changeEvent = event.detail.update;
      const changeEventBusyResolve = this._addBusyState(
        'validating mutation data for change event',
        null
      );
      this._fetchEventDataForKeys(changeEvent).then((validatededEventData) => {
        if (validatededEventData === null) {
          changeEventBusyResolve();
          return;
        }
        const keys = [...validatededEventData.keys];
        for (let i = 0; i < keys.length; i++) {
          const elem = this._getItemByKey(keys[i]);
          if (elem != null) {
            const insertIndex = this._indexToParent(elem);
            this._renderItem(
              null,
              {
                data: [validatededEventData.data[i]],
                metadata: [validatededEventData.metadata[i]]
              },
              0,
              insertIndex,
              true
            );
          }
        }
        this._resetFocus();
        this._refreshTopAndBottomSelectionClasses();
        changeEventBusyResolve();
      });
    },
    _fetchEventDataForKeys: function (eventData) {
      return new Promise((resolve) => {
        const dataProviderPromiseBusyResolve = this._addBusyState('getting data provider', null);
        const dataProviderPromise = this._getDataProvider();
        dataProviderPromise.then(
          (dataProvider) => {
            resolve(getEventDetail(dataProvider, eventData));
            dataProviderPromiseBusyResolve();
          },
          function (reason) {
            error(this.constants.ERROR_FETCHING_DATA + reason);
            dataProviderPromiseBusyResolve();
          }
        );
      });
    },
    _indexToParent: function (elem) {
      var index = 0;
      for (var i = 0; i < elem.parentNode.children.length; i++) {
        if (elem.parentNode.children[i] === elem) {
          index = i;
          break;
        }
      }
      return index;
    },
    handleModelRefreshEvent: function (event) {
      // if treeview is busy, queue it for processing later
      if (!this.isReady()) {
        this._pushToEventQueue(event);
        return;
      }
      if (event.detail && event.detail.keys) {
        const keys = event.detail.keys;
        // smart refresh
        keys.forEach((key) => {
          const item = this._getItemByKey(key);
          if (item && !this._isLeaf(item)) {
            // recrusive method needs to pass parent key down
            this._removeAllChildrenOfParentKey(key, key);
            const subtree = this._getSubtree(item);
            if (subtree) {
              item.removeChild(subtree);
            }
            if (this._isExpanded(item)) {
              item.classList.remove(this.constants.OJ_EXPANDED);
              this._expand(item, true);
            }
          }
        });
        this._refreshTopAndBottomSelectionClasses();
      } else {
        // full refresh
        this._clearEventQueue();
        this.refresh();
      }
    },
    _isSkeletonSupported: function () {
      var defaults = this._getOptionDefaults();
      return defaults.loadIndicator === 'skeleton';
    },
    _getOptionDefaults: function () {
      if (this.defaultOptions == null) {
        this.defaultOptions = {};
        const keys = Object.keys(this.constants.OJ_TREEVIEW_CSS_VARS);
        const vars = keys.map((key) => this.constants.OJ_TREEVIEW_CSS_VARS[key]);
        const values = getCachedCSSVarValues(vars);
        keys.forEach((key, i) => {
          this.defaultOptions[key] = values[i];
        });
      }
      return this.defaultOptions;
    },
    _renderChildSkeletons: function (parentKey) {
      var parentItem = this._getItemByKey(parentKey);
      this._removeExistingSkeletons(parentItem);
      var disclosureIconWidth = this._getItemDisclosureIcon(parentItem).offsetWidth;
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
    _renderInitialSkeletons: function () {
      this._removeExistingSkeletons(this.element[0]);
      var threeItemedSkeleton = this._buildThreeItemedSkeleton();
      var twoItemedSkeleton = this._buildTwoItemedSkeleton();
      var skeletonContainer = this._buildSkeletonContainer();
      skeletonContainer.appendChild(threeItemedSkeleton); // @HTMLUpdateOK
      skeletonContainer.appendChild(twoItemedSkeleton); // @HTMLUpdateOK
      this.element[0].classList.add(this.constants.OJ_COMPLETE);
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
        var skeletonContents = skeletonContainer.querySelectorAll(
          this.constants.PERIOD + this.constants.OJ_TREEVIEW_SKELETON_CONTENT
        );
        for (i = skeletonContents.length - 1; i >= 0; i--) {
          skeletonHeight -= treeviewItemHeight;
          skeletonContainer.removeChild(skeletonContents[i]);
          if (skeletonHeight <= treeviewHeight) {
            break;
          }
        }
      }
    },
    _removeExistingSkeletons: function (item) {
      var existingSkeletonContainers = item.querySelectorAll(
        this.constants.PERIOD + this.constants.OJ_TREEVIEW_SKELETON_CONTAINER
      );
      for (var i = 0; i < existingSkeletonContainers.length; i++) {
        item.removeChild(existingSkeletonContainers[i]);
      }
    },
    _getSkeletonContainer: function (item) {
      return item.getElementsByClassName(this.constants.OJ_TREEVIEW_SKELETON_CONTAINER)[0];
    },
    _removeSkeleton: function (parentKey) {
      return new Promise(
        function (resolve) {
          var self = this;
          var skeletonBusyResolve = self._addBusyState('removing skeleton', parentKey);
          var skeletonContainer;
          if (parentKey === null) {
            skeletonContainer = this._getSkeletonContainer(self.element[0]);
          } else {
            skeletonContainer = this._getSkeletonContainer(this._getItemByKey(parentKey));
          }
          if (!skeletonContainer) {
            skeletonBusyResolve();
            resolve();
          } else {
            fadeOut(skeletonContainer, { duration: '100ms' }).then(function () {
              if (skeletonContainer.parentElement) {
                skeletonContainer.parentElement.removeChild(skeletonContainer);
              }
              skeletonBusyResolve();
              resolve();
            });
          }
        }.bind(this)
      );
    },
    _buildThreeItemedSkeleton: function () {
      var fragment = this._buildTwoItemedSkeleton();
      var leaf = this._buildSkeletonLeafContent();
      fragment.appendChild(leaf); // @HTMLUpdateOK
      return fragment;
    },
    _buildTwoItemedSkeleton: function () {
      var fragment = new DocumentFragment();
      var firstChild = this._buildSkeletonContent(false);
      fragment.appendChild(firstChild); // @HTMLUpdateOK
      var secondChild = this._buildSkeletonContent(true);
      fragment.appendChild(secondChild); // @HTMLUpdateOK
      return fragment;
    },
    _buildSkeletonContainer: function () {
      var skeletonContainer = document.createElement('div');
      skeletonContainer.classList.add(this.constants.OJ_TREEVIEW_SKELETON_CONTAINER);
      skeletonContainer.classList.add(this.constants.OJ_ANIMATION_SKELETON_FADE_IN);
      return skeletonContainer;
    },
    _buildSkeletonContent: function (child) {
      var contentDiv = document.createElement('div');
      contentDiv.classList.add(this.constants.OJ_TREEVIEW_SKELETON_CONTENT);
      var carrotDiv = this._buildSkeletonCarrot();
      if (child) {
        carrotDiv.classList.add(this.constants.OJ_TREEVIEW_SKELETON_CHILD);
      }
      contentDiv.appendChild(carrotDiv); // @HTMLUpdateOK
      contentDiv.appendChild(this._buildSkeletonItem()); // @HTMLUpdateOK
      return contentDiv;
    },
    _buildSkeletonCarrot: function () {
      var carrotDiv = document.createElement('div');
      carrotDiv.classList.add(this.constants.OJ_TREEVIEW_SKELETON_CARROT);
      carrotDiv.classList.add(this.constants.OJ_ANIMATION_SKELETON);
      return carrotDiv;
    },
    _buildSkeletonItem: function () {
      var itemDiv = document.createElement('div');
      itemDiv.classList.add(this.constants.OJ_TREEVIEW_SKELETON_ITEM);
      itemDiv.classList.add(this.constants.OJ_ANIMATION_SKELETON);
      return itemDiv;
    },
    _buildSkeletonLeafContent: function () {
      var contentDiv = document.createElement('div');
      contentDiv.classList.add(this.constants.OJ_TREEVIEW_SKELETON_CONTENT);
      contentDiv.appendChild(this._buildSkeletonLeafItem()); // @HTMLUpdateOK
      return contentDiv;
    },
    _buildSkeletonLeafItem: function () {
      var leafDiv = document.createElement('div');
      leafDiv.classList.add(this.constants.OJ_TREEVIEW_SKELETON_LEAF);
      leafDiv.classList.add(this.constants.OJ_ANIMATION_SKELETON);
      return leafDiv;
    },
    _closest: function (element, selector) {
      if (!element) {
        return null;
      }
      if (!element.closest) {
        do {
          if (this._matches(element, selector)) return element;
          // eslint-disable-next-line no-param-reassign
          element = element.parentElement || element.parentNode;
        } while (element !== null && element.nodeType === 1);
        return null;
      }
      return element.closest(selector);
    },
    _getParents: function (elem, parentSelector) {
      var parents = [];
      // eslint-disable-next-line no-param-reassign
      for (; elem && elem !== this.element[0]; elem = elem.parentNode) {
        if (this._matches(elem, parentSelector)) {
          parents.push(elem);
        }
      }
      return parents;
    },
    _getNextSibling: function (elem, selector) {
      var sibling = elem.nextElementSibling;
      if (!selector) return sibling;
      while (sibling) {
        if (this._matches(sibling, selector)) return sibling;
        sibling = sibling.nextElementSibling;
      }
      return null;
    },
    _getPreviousSibling: function (elem, selector) {
      var sibling = elem.previousElementSibling;
      if (!selector) return sibling;
      while (sibling) {
        if (this._matches(sibling, selector)) return sibling;
        sibling = sibling.previousElementSibling;
      }
      return null;
    },
    _matches: function (elem, selector) {
      if (!elem.matches) {
        // eslint-disable-next-line no-param-reassign
        elem.matches =
          Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
      }
      return elem.matches(selector);
    }
  });
})();

var __oj_tree_view_metadata = 
{
  "properties": {
    "currentItem": {
      "type": "any",
      "writeback": true,
      "readOnly": true
    },
    "data": {
      "type": "object",
      "extension": {
        "webelement": {
          "exceptionStatus": [
            {
              "type": "unsupported",
              "since": "13.0.0",
              "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
            }
          ]
        }
      }
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
                "drag": {
                  "type": "function"
                },
                "dragEnd": {
                  "type": "function"
                },
                "dragStart": {
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
                "dragLeave": {
                  "type": "function"
                },
                "dragOver": {
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
    "scrollPolicyOptions": {
      "type": "Object<number>",
      "properties": {
        "maxCount": {
          "type": "number",
          "value": 500
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
        "leafOnly",
        "multiple",
        "none",
        "single"
      ],
      "value": "none"
    },
    "translations": {
      "type": "object",
      "value": {},
      "properties": {
        "receivedDataAria": {
          "type": "string"
        },
        "retrievingDataAria": {
          "type": "string"
        },
        "treeViewSelectorAria": {
          "type": "string"
        }
      }
    }
  },
  "methods": {
    "getContextByNode": {},
    "getProperty": {},
    "refresh": {},
    "setProperties": {},
    "setProperty": {},
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
/* global __oj_tree_view_metadata:false */
(function () {
  __oj_tree_view_metadata.extension._WIDGET_NAME = 'ojTreeView';
  oj.CustomElementBridge.register('oj-tree-view', { metadata: __oj_tree_view_metadata });
})();
