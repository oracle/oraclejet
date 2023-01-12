/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojcore-base', 'jquery', 'ojs/ojarraydataprovider', 'ojs/ojeventtarget', 'ojs/ojlogger'], function (exports, oj, $, ArrayDataProvider, ojeventtarget, Logger) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
    ArrayDataProvider = ArrayDataProvider && Object.prototype.hasOwnProperty.call(ArrayDataProvider, 'default') ? ArrayDataProvider['default'] : ArrayDataProvider;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /**
     * @since 13.0.0
     * @class MutableArrayTreeDataProvider
     * @implements TreeDataProvider
     * @ojexports
     * @classdesc This class implements {@link TreeDataProvider} and is used to represent hierachical data available from an array.<br><br>
     *            Each array element represents a tree node, which can contain a nested child object array for its subtree.
     *            Array elements can be in any shape and form, but is usually an object with a "children" property.  The name of the "children" property
     *            can optionally be specified with the "childrenAttribute" option.<br><br>
     *            For nodes that cannot have children, the "children" property should not be set.
     *            For nodes that can but don't have children, the "children" property should be set to an empty array.<br><br>
     *            The events described below will be dispatched to the MutableArrayTreeDataProvider with the appropriate event payload.<br><br>
     *            Filtering is supported and, by default, applied only on leaf nodes. Empty tree nodes are not collapsed.
     *            The filtering on leaf nodes only works by combining the passed in filter definition with an OR expression
     *            of the "children" property to determine if a node is a tree or leaf.
     *
     * <h3 id="events-section">
     * Events
     * <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
     * </h3>
     * <p>Consumers can add event listeners to listen for the following event types and respond to data change.
     * Event listeners should be added to the root-level MutableArrayTreeDataProvider created by the application. The root-level MutableArrayTreeDataProvider receives events for the entire tree.
     * Child-level MutableArrayTreeDataProvider returned by getChildDataProvider does not receive events.
     * </p>
     * <h4 id="event:mutate" class="name">
     * mutate
     * </h4>
     * This event is fired when items are added into a leaf node or updated in an array.  The event is the array specific.
     * <p>
     * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
     * </p>
     *
     * <h4 id="event:refresh" class="name">
     *   refresh
     * </h4>
     * <p>
     * This event with no payload is fired when the data has been refreshed and components need to re-fetch the data.
     * In this case, the re-fetch is from the root.
     * </p>
     * <p>This event with payload 'keys' is fired when updated nodes include any changes in their children.  The 'keys' is
     * the set of keys of the nodes with changes in their children, and components need to re-fetch the sub-tree of 'keys'.
     * In this case, the re-fetch should be from each key.
     * </p>
     * <p>
     * Event payload is found under <code class="prettyprint">event.detail</code>,
     * which implements the {@link DataProviderRefreshEventDetail} interface.
     * </p>
     *
     * <i>Example of a tree structured data:</i>
     * <pre class="prettyprint"><code>
     * // initiate an array
     * const treeData = [
     *   {title:"News", id:"news"},
     *   {title:"Blogs", id:"blogs", "children": [
     *     {title:"Today", id:"today"},
     *     {title:"Yesterday", id:"yesterday"},
     *     {title:"Archive", id:"archive", "children": [
     *       {title: "Links", id:'links'}
     *      ]}
     *   ]}
     * ];
     * Initial an immutable array treeData.
     * </code></pre>
     *
     * <p>With the data above, the following are actions on an array and events expected.
     * The mutation are created according to <a href="#algorithm-section">Algorithm section</a>, check it for more details.
     * </p>
     *<table class="keyboard-table">
     *  <thead>
     *    <tr>
     *      <th width='15%'>Action</th>
     *      <th width='20%'>Example Code</th>
     *      <th width='15%'>Expected Events</th>
     *   </tr>
     * </thead>
     *  <tbody>
     *  <tr>
     *  <td><kbd>Add a node as a sibling to non-root node</kbd></td>
     *     <td>
     *      <pre class="prettyprint">
     *       <code>
     * Add a sibling 'Links' node next to 'Today'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = addNode(treeData, [1, 1],
     *  {title: "Links", id: "links"});
     * rootTreeDataProvider.data = treeData;
     *       </code>
     *       </pre>
     *      </td>
     *    <td><a href="#algorithm-section-step3">'refresh': {keys: 'blogs'}</a></td>
     *  </tr>
     *  <tr>
     *    <tr>
     *      <td><kbd>Add node 'Links' as a sibling to root node</kbd></td>
     *      <td>
     *       <pre class="prettyprint">
     *        <code>
     * Add a sibling node 'Links' next to 'Blogs'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = addNode(treeData, [1],
     *  {title: "Links", id: "links"});
     * rootTreeDataProvider.data = treeData;
     *        </code>
     *        </pre>
     *      </td>
     *      <td><a href="#algorithm-section-step3">'refresh'</a></td>
     *    </tr>
     *    <tr>
     *    <td><kbd>Add a child to a non-root non-leaf node </kbd></td>
     *    <td>
     *     <pre class="prettyprint">
     *      <code>
     * Add a child node 'Child3' under 'Archive'<br/>
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = addNode(treeData,
     *  [1, 2, 0],
     *  {title: "Child3", id: "child3"});
     * rootTreeDataProvider.data = treeData;
     *      </code>
     *      </pre>
     *    </td>
     *    <td><a href="#algorithm-section-step3">'refresh': {keys: 'archive'}</a></td>
     *  </tr>
     *    <td><kbd>Add a child to a non-root leaf node </kbd></td>
     *    <td>
     *     <pre class="prettyprint">
     *      <code>
     * Add a child node 'Child1' under 'Today'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = addNode(treeData,
     *  [1, 0, 0],
     *  {title: "Child1", id: "child1"});
     * rootTreeDataProvider.data = treeData;
     *      </code>
     *      </pre>
     *    </td>
     *    <td><a href="#algorithm-section-step3">'refresh': {keys: 'blogs'}</a></td>
     *    <tr>
     *      <td><kbd>Add a child to a root leaf node </kbd></td>
     *      <td>
     *       <pre class="prettyprint">
     *        <code>
     * Add another child node 'Child2' under 'News'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = addNode(treeData, [0, 0],
     *  {title: "Child2", id: "child2"});
     * rootTreeDataProvider.data = treeData;
     *        </code>
     *        </pre>
     *      </td>
     *      <td><a href="#algorithm-section-step3">'refresh'</a></td>
     *    </tr>
     *     <td><kbd>Add a child to a root non-leaf node </kbd></td>
     *     <td>
     *      <pre class="prettyprint">
     *       <code>
     * Add a child node 'Child4' under 'Blogs'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = addNode(treeData, [1, 0],
     *  {title: "Child4", id: "child4"});
     * rootTreeDataProvider.data = treeData;
     *       </code>
     *       </pre>
     *     </td>
     *     <td><a href="#algorithm-section-step3">'refresh': {keys: 'blogs'}</a></td>
     * </tr>
     * <tr>
     *   <tr>
     *     <td><kbd>Remove a non-root node</kbd></td>
     *     <td>
     *      <pre class="prettyprint">
     *       <code>
     * Remove node 'Yesterday' under parent node Blogs
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = removeNode(treeData,
     *  [1, 1]);
     * rootTreeDataProvider.data = treeData;
     *       </code>
     *       </pre>
     *         </td>
     *     <td><a href="#algorithm-section-step3">'refresh': {keys: 'blogs'}</a></td>
     *   </tr>
     *     <tr>
     *   <td><kbd>Remove a root node</kbd></td>
     *   <td>
     *    <pre class="prettyprint">
     *     <code>
     * Remove node 'News'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = removeNode(treeData, [0]);
     * rootTreeDataProvider.data = treeData;
     *     </code>
     *     </pre>
     *       </td>
     *   <td><a href="#algorithm-section-step3">'refresh'</a></td>
     * </tr>
     * <tr>
     *   <td><kbd>Remove (change a root non-leaf node to root leaf node)</kbd></td>
     *   <td>
     *    <pre class="prettyprint">
     *     <code>
     * Remove child node under 'Blogs'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = removeNode( treeData, [1, 0]);
     * rootTreeDataProvider.data = treeData;
     *     </code>
     *     </pre>
     *       </td>
     *   <td><a href="#algorithm-section-step3">'refresh'</a></td>
     * </tr>
     * <tr>
     *   <td><kbd>Remove (change a non-root non-leaf node to non-root leaf node)</kbd></td>
     *   <td>
     *    <pre class="prettyprint">
     *     <code>
     * Remove child node under 'Today'
     * // for example you can use util functions from ojimmutabletreedatautils
     * treeData = removeNode( treeData,
     *  [1, 0, 0]);
     * rootTreeDataProvider.data = treeData;
     *     </code>
     *     </pre>
     *       </td>
     *   <td><a href="#algorithm-section-step3">'refresh': {keys: 'blogs'}</a></td>
     * </tr>
     * <tr>
     *   <td><kbd>Update a node</kbd></td>
     *   <td>
     *   <pre class="prettyprint">
     *     <code>
     * Update node 'News' to 'OldNews'
     * // for example you can use util functions from ojimmutabletreedatautils
     * const newNode = {...treeData[0]};
     * treeData = reolaceNode( treeData,
     *  [0], newNode);
     * rootTreeDataProvider.data = treeData;
     *     </code>
     *     </pre>
     *       </td>
     *   <td><a href="#algorithm-section-step2">mutation': {update: {keys: 'news', data:{title: 'OldNews', id: 'news'}}}</a></td>
     * </tr>
     * </tbody>
     *  </table>
     * <br/>
     *
     * <i>Example of consumer listening for the events:</i>
     * <pre class="prettyprint"><code>
     * dataProvider.addEventListener("mutate", handleMutate);
     * dataProvider.addEventListener("refresh", handleRefresh);
     *
     * const handleMutate = function(event) {
     *   if (event.detail.update) {
     *     const updateDetail = event.detail.update;
     *     // Handle updated items
     *   }
     * };
     *
     * const handleRefresh = function(event) {
     *   const detail=event.detail;
     *   if (detail && detail.keys) {
     *     event.detail.keys.forEach ((key) => {
     *       // refresh children for key
     *     });
     *   }
     *   else {
     *     // refresh children for root
     *   }
     * }
     * </code></pre>
     *
     * <h3 id="algorithm-section">
     * Algorithm
     * <a class="bookmarkable-link" title="Bookmarkable Link" href="#algorithm-section"></a>
     * </h3>
     * <p>
     * When setting this property, MutableArrayTreeDataProvider will use the following algorithm to compare:
     * We would use ‘limited’ recursive deep comparison to figure out what mutation events to fire.
     * This is done to avoid having to fire a top-level refresh event for any mutation of the subtree.
     * We can start by optimizing only the case where there the number of children is still the same,
     * and the identity comparison fails for at most one child:<br/>
     * <ol>
     * <li><h4 id="algorithm-section-step1"></h4>
     * If the two nodes are equal, we are done. There are no changes.</li>
     * <li><h4 id="algorithm-section-step2"></h4>
     * If they are not equal, we fire an ‘update’ mutation. Note that we do not deep-compare the node’s properties.</li>
     * <li><h4 id="algorithm-section-step3"></h4>
     * We compare the node’s old and new child lists. If the sizes are different, we fire a ‘refresh’
     * event with 'parentKey' and do not recurse further</li>
     * <li><h4 id="algorithm-section-step4"></h4>
     * If we find more than one child with identity comparison failing, we fire a ‘refresh’ event with 'parentKey'
     * and do not recurse further</li>
     * <li><h4 id="algorithm-section-step5"></h4>
     * If we find 0 children with identity comparison failing, we do not recurse further</li>
     * <li><h4 id="algorithm-section-step6"></h4>
     * If we find 1 child with identity comparison failing, we recurse into that child and repeat these steps from the beginning</li>
     * </ol>
     * </p>
     *
     * @param {any} data Applications shouldn't call array mutation methods such as splice or push on "data" directly.
     * Applications need to use {@link ojimmutabletreedatautils} or immutable libs like immutablejs to update the array, and set it back into the "data" property.
     * @param {string} keyAttribute The field name which stores the key in the data. Can be a string denoting a single key attribute. Please note that the ids in MutableArrayTreeDataProvider must always be unique.
     *                                                  Please do not introduce duplicate ids, even during temporary mutation operations.@value will cause MutableArrayTreeDataProvider to
     *                                                  use all attributes as key.
     * @param {MutableArrayTreeDataProvider.Options=} options Options for the MutableArrayTreeDataProvider
     * @ojsignature [{target: "Type",
     *               value: "class MutableArrayTreeDataProvider<K, D> implements TreeDataProvider<K, D>",
     *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
     *               {target: "Type",
     *               value: "MutableArrayTreeDataProvider.Options<D>",
     *               for: "options"},
     *               {target: "Type", value: "string | '@value'", for: "keyAttribute"}
     * ]
     * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
     * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion",
     *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
     *   "FetchListResult","FetchListParameters"]}
     * @ojtsexample
     * import { MutableArrayTreeDataProvider } from "ojs/ojmutablearraytreedataprovider";
     * // First initialize the tree data.  This can be defined locally or read from file.
     * const treeData = [
     *                  {"attr": {"id": "dir1", "title": "Directory 1"},
     *                   "children": [
     *                     {"attr": {"id": "subdir1", "title": "Subdirectory 1"},
     *                      "children": [
     *                        {"attr": {"id": "file1", "title": "File 1"}},
     *                        {"attr": {"id": "file2", "title": "File 2"}},
     *                        {"attr": {"id": "file3", "title": "File 3"}}
     *                      ]},
     *                     {"attr": {"id": "subdir2", "title": "Subdirectory 2"},
     *                      "children": []}
     *                   ]},
     *                  {"attr": {"id": "dir2", "title": "Directory 2"},
     *                   "children": [
     *                     {"attr": {"id": "file4", "title": "File 4"}},
     *                     {"attr": {"id": "file5", "title": "File 5"}},
     *                   ]}
     *                ];
     *
     * // Then create an MutableArrayTreeDataProvider object with the array
     * create an immutable array treeDataImmutable
     * const dp = new MutableArrayTreeDataProvider(treeDataImmutable, 'attr.id');
     */

    /**
     * @memberof MutableArrayTreeDataProvider
     * @typedef {Object} MutableArrayTreeDataProvider.Options
     * @property {ArrayDataProvider.SortComparators=} sortComparators - Optional sortComparator to use for sort.
     * <p>
     * Sort follows JavaScript's localeCompare <code>{numeric: true}</code>.
     * Please check {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#numeric_sorting|String.prototype.localeCompare()} for details.
     * </p>
     * <p>
     * For numbers, we convert them into strings then compare them with localeCompare, which may not sort floating point numbers based on their numeric values.
     * If you want to sort floating point numbers based on their numeric values, sortComparator can be used to do a custom sort.
     * </p>
     * <p>
     * For undefined and null values, they are considered as the largest values during sorting. For an empty string, it is considered as the smallest value during sorting.
     * </p>
     * @property {SortCriterion=} implicitSort - Optional array of {@link SortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
     * This is used for cases where we would like display some indication that the data is already sorted.
     * For example, ojTable will display the column sort indicator for the corresponding column in either ascending or descending order upon initial render.
     * This option is not used for cases where we want the MutableArrayTreeDataProvider to apply a sort on initial fetch.
     * For those cases, please wrap in a ListDataProviderView and set the sortCriteria property on it.
     * @property {string=} textFilterAttributes - Optionally specify which attributes the filter should be applied on when a TextFilter
     * filterCriteria is specified. If this option is not specified then the filter will be applied to all attributes.
     * @property {string=} keyAttributeScope - Optional scope of the key values in the fields specified by keyAttribute.  Supported values:<br>
     *                                           <ul>
     *                                             <li>'global': the key values are unique within the entire tree.
     *                                             <li>'siblings': the key values are unique among the siblings of each node.
     *                                           </ul>
     *                                           Default is 'global'.
     * @property {string=} childrenAttribute - Optional field name which stores the children of nodes in the data. Dot notation can be used to specify nested attribute. If this is not specified, the default is "children".
     * @ojsignature [
     *  {target: "Type", value: "<D>", for: "genericTypeParameters"},
     *  {target: "Type", value: "ArrayDataProvider.SortComparators<D>", for: "sortComparators"},
     *  {target: "Type", value: "Array<SortCriterion<D>>", for: "implicitSort"},
     *  {target: "Type", value: "string[]", for: "textFilterAttributes"},
     *  {target: "Type", value: "'siblings' | 'global'", for: "keyAttributeScope"},
     *  {target: "Type", value: "string", for: "childrenAttribute"},
     * ]
     */

    /**
     * <p>The underlying data array.
     * </p>
     * <p>Applications can get this property directly only can set it on the root data provider, such as setting it to a different array.
     * </p>
     * <p>Applications should not call array mutation methods
     * such as splice or push on "data" directly.  Applications need to create a new immutable array by {@link ojimmutabletreedatautils} or
     * immutable libs and set it back into the "data" property.
     * </p>
     * @since 13.0.0
     * @name data
     * @export
     * @expose
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @property {any} data
     * @ojsignature {target: "Type", value: "any"}
     * @ojtsexample <caption>Example of mutating the entire tree</caption>
     * const rootTreeDataProvider = new MutableArrayTreeDataProvider(rootData, 'id');
     * let newRootData;
     * Initialize newRootData to a new immutable array newRootDataImmutable
     * rootTreeDataProvider.data = newRootDataImmutable;
     * @ojtsexample <caption>Example of mutating the data in a branch</caption>
     * create an immutable array immutableData
     * const rootTreeDataProvider = new MutableArrayTreeDataProvider(immutableData, 'id');
     * update immutableData
     * // set it back to rootTreeDataProvider.data
     * rootTreeDataProvider.data = immutableData;
     */

    /**
     * @memberof MutableArrayTreeDataProvider
     * @export
     * @since 13.0.0
     * @expose
     * @instance
     * @method
     * @name getChildDataProvider
     * @ojsignature {target: "Type",
     *               value: "(parentKey: K): MutableArrayTreeDataProvider<K, D> | null"}
     * @return {MutableArrayTreeDataProvider | null} A TreeDataProvider if the row can (but doesn't have to) have children;
     * or null if the row cannot have children.
     * Use the <code class="prettyprint">isEmpty</code> method on the returned TreeDataProvider to determine if it currently has children.
     * @ojtsexample <caption>Example for getChildDataProvider</caption>
     * // Get child data provider for node 10
     * let childDataProvider = dataprovider.getChildDataProvider(10);
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name containsKeys
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name fetchFirst
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name createOptimizedKeySet
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name createOptimizedKeyMap
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof MutableArrayTreeDataProvider
     * @instance
     * @method
     * @name dispatchEvent
     */

    // end of jsdoc

    class MutableArrayTreeDataProvider {
        constructor(data, keyAttribute, options, _rootDataProvider) {
            var _a;
            this.keyAttribute = keyAttribute;
            this.options = options;
            this._rootDataProvider = _rootDataProvider;
            this.TreeAsyncIterator = class {
                constructor(_parent, _baseIterable) {
                    this._parent = _parent;
                    this._baseIterable = _baseIterable;
                }
                ['next']() {
                    return this._baseIterable[Symbol.asyncIterator]()
                        .next()
                        .then((result) => {
                        const metadata = result.value.metadata;
                        for (let i = 0; i < metadata.length; i++) {
                            metadata[i] = this._parent._getTreeMetadata(metadata[i], result.value.data[i]);
                        }
                        return result;
                    });
                }
            };
            this.TreeAsyncIterable = (_a = class {
                    constructor(_parent, _asyncIterator) {
                        this._parent = _parent;
                        this._asyncIterator = _asyncIterator;
                        this[Symbol.asyncIterator] = () => {
                            return this._asyncIterator;
                        };
                    }
                },
                Symbol.asyncIterator,
                _a);
            this._mapKeyToNode = new Map();
            this._mapNodeToKey = new Map();
            this._mapKeyToParentNodePath = new Map();
            this._baseDPOptions = { keyAttributes: keyAttribute };
            if (options) {
                if (options.sortComparators) {
                    this._baseDPOptions.sortComparators = options.sortComparators;
                }
                if (options.implicitSort) {
                    this._baseDPOptions.implicitSort = options.implicitSort;
                }
                if (options.keyAttributeScope) {
                    this._baseDPOptions.keyAttributesScope = options.keyAttributeScope;
                }
                if (options.childrenAttribute) {
                    this._baseDPOptions.childrenAttribute = options.childrenAttribute;
                }
            }
            this._baseDataProvider = new ArrayDataProvider(data, this._baseDPOptions);
            this._childrenAttr =
                this.options && this.options['childrenAttribute']
                    ? this.options['childrenAttribute']
                    : 'children';
            if (_rootDataProvider == null) {
                this._parentNodePath = [];
                this._processTreeArray(data, []);
            }
            this.data = data;
        }
        set data(value) {
            const oldData = this._data == undefined ? [] : this._data;
            this._data = value;
            if (this._getRootDataProvider() !== this) {
                return;
            }
            if (((oldData == undefined || oldData.length === 0) &&
                this._data != undefined &&
                this._data.length > 0) ||
                ((this._data == undefined || this._data.length === 0) &&
                    oldData != undefined &&
                    oldData.length > 0) ||
                this._data.length !== oldData.length) {
                this._keys = null;
                this._baseDataProvider = new ArrayDataProvider(this._data, this._baseDPOptions);
                this._dataRefreshed(null, null);
            }
            else {
                const changes = this.findDiffNodes(this._data, oldData, [], '', {}, {});
                const updates = changes.add;
                const { refresh } = changes;
                this._baseDataProvider = new ArrayDataProvider(this._data, this._baseDPOptions);
                if (updates.length > 0 || refresh.length > 0) {
                    const { mutationEvent, refreshEvent } = this._dataMutated(updates, changes.refresh);
                    this._dataRefreshed(mutationEvent, refreshEvent);
                }
            }
        }
        get data() {
            return this._data;
        }
        getChildDataProvider(parentKey, options) {
            const node = this._getNodeForKey(parentKey);
            if (node) {
                const children = this._getChildren(node);
                if (children) {
                    const childDataProvider = new MutableArrayTreeDataProvider(children, this.keyAttribute, this.options, this._getRootDataProvider());
                    Object.defineProperty(childDataProvider, 'data', {
                        writable: false
                    });
                    if (childDataProvider != null) {
                        const rootDataProvider = this._getRootDataProvider();
                        childDataProvider._parentNodePath = rootDataProvider._mapKeyToParentNodePath.get(JSON.stringify(parentKey));
                    }
                    return childDataProvider;
                }
            }
            return null;
        }
        fetchFirst(params) {
            params = this._applyLeafNodeFilter(params);
            const baseIterable = this._baseDataProvider.fetchFirst(params);
            return new this.TreeAsyncIterable(this, new this.TreeAsyncIterator(this, baseIterable));
        }
        fetchByOffset(params) {
            params = this._applyLeafNodeFilter(params);
            const basePromise = this._baseDataProvider.fetchByOffset(params);
            return basePromise.then((result) => {
                const results = result.results;
                const newResults = [];
                for (const result of results) {
                    let metadata = result['metadata'];
                    const data = result['data'];
                    metadata = this._getTreeMetadata(metadata, data);
                    newResults.push({ data, metadata });
                }
                const data = {
                    done: result['done'],
                    fetchParameters: result['fetchParameters'],
                    results: newResults
                };
                if (params.includeFilteredRowCount === 'enabled') {
                    data['totalFilteredRowCount'] = result.totalFilteredRowCount;
                }
                return data;
            });
        }
        fetchByKeys(params) {
            const results = new Map();
            params['keys'].forEach((key) => {
                const node = this._getNodeForKey(key);
                if (node) {
                    results.set(key, { metadata: { key }, data: node });
                }
            });
            return Promise.resolve({ fetchParameters: params, results });
        }
        containsKeys(params) {
            return this.fetchByKeys(params).then((fetchByKeysResult) => {
                const results = new Set();
                params['keys'].forEach((key) => {
                    if (fetchByKeysResult['results'].get(key) != null) {
                        results.add(key);
                    }
                });
                return Promise.resolve({ containsParameters: params, results });
            });
        }
        getCapability(capabilityName) {
            return this._baseDataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this._baseDataProvider.getTotalSize();
        }
        isEmpty() {
            return this._baseDataProvider.isEmpty();
        }
        createOptimizedKeySet(initialSet) {
            return this._baseDataProvider.createOptimizedKeySet(initialSet);
        }
        createOptimizedKeyMap(initialMap) {
            return this._baseDataProvider.createOptimizedKeyMap(initialMap);
        }
        _processTreeArray(treeData, parentKeyPath) {
            let dataArray;
            let changesIdx, changes;
            if (treeData instanceof Array) {
                dataArray = treeData;
            }
            dataArray.forEach((node, i) => {
                this._processNode(node, parentKeyPath, treeData);
            });
        }
        _getRootDataProvider() {
            if (this._rootDataProvider) {
                return this._rootDataProvider;
            }
            else {
                return this;
            }
        }
        _processNode(node, parentKeyPath, treeData) {
            const keyObj = this._createKeyObj(node, parentKeyPath, treeData);
            this._setMapEntry(keyObj.key, node);
            const rootDataProvider = this._getRootDataProvider();
            rootDataProvider._mapKeyToParentNodePath.set(JSON.stringify(keyObj.key), keyObj.keyPath);
            if (node) {
                const children = this._getChildren(node);
                if (children) {
                    this._processTreeArray(children, keyObj.keyPath);
                }
            }
            return keyObj;
        }
        _setMapEntry(key, node) {
            const rootDataProvider = this._getRootDataProvider();
            const keyCopy = JSON.stringify(key);
            if (rootDataProvider._mapKeyToNode.has(keyCopy)) {
                Logger.warn(`Duplicate key ${keyCopy} found in MutableArrayTreeDataProvider.  Keys must be unique when keyAttributes ${this.keyAttribute} is specified`);
            }
            rootDataProvider._mapKeyToNode.set(keyCopy, node);
            rootDataProvider._mapNodeToKey.set(node, key);
        }
        _createKeyObj(node, parentKeyPath, treeData) {
            let key = this._getId(node);
            const keyPath = parentKeyPath ? parentKeyPath.slice() : [];
            keyPath.push(key);
            if (this.options && this.options['keyAttributeScope'] === 'siblings') {
                key = keyPath;
            }
            return { key, keyPath };
        }
        _getChildren(node) {
            return this._getVal(node, this._childrenAttr, true);
        }
        _getVal(val, attr, keepFunc) {
            if (typeof attr === 'string') {
                const dotIndex = attr.indexOf('.');
                if (dotIndex > 0) {
                    const startAttr = attr.substring(0, dotIndex);
                    const endAttr = attr.substring(dotIndex + 1);
                    const subObj = val[startAttr];
                    if (subObj) {
                        return this._getVal(subObj, endAttr);
                    }
                }
            }
            if (keepFunc !== true && typeof val[attr] === 'function') {
                return val[attr]();
            }
            return val[attr];
        }
        _getId(row) {
            let id;
            const keyAttributes = this.keyAttribute;
            if (keyAttributes == '@value') {
                id = this._getAllVals(row);
            }
            else {
                id = this._getVal(row, keyAttributes);
            }
            return id;
        }
        _getAllVals(val) {
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                return val;
            }
            return Object.keys(val).map((key) => {
                return this._getVal(val, key);
            });
        }
        _getNodeMetadata(node) {
            return { key: this._getKeyForNode(node) };
        }
        _getNodeForKey(key) {
            const rootDataProvider = this._getRootDataProvider();
            let nodeDataJS = rootDataProvider._mapKeyToNode.get(JSON.stringify(key));
            return nodeDataJS;
        }
        _getKeyForNode(node) {
            const rootDataProvider = this._getRootDataProvider();
            return rootDataProvider._mapNodeToKey.get(node);
        }
        _applyLeafNodeFilter(params) {
            if (params && params.filterCriterion) {
                const paramsClone = $.extend({}, params);
                paramsClone.filterCriterion = this._getLeafNodeFilter(paramsClone.filterCriterion);
                paramsClone.filterCriterion.filter = params.filterCriterion.filter;
                params = paramsClone;
            }
            return params;
        }
        _getLeafNodeFilter(filter) {
            const attributeFilter = filter;
            const childrenNull = { op: '$ne', attribute: this._childrenAttr, value: null };
            const childrenUndefined = { op: '$ne', attribute: this._childrenAttr, value: undefined };
            const excludeParentNodeFilter = { op: '$and', criteria: [childrenNull, childrenUndefined] };
            return { op: '$or', criteria: [attributeFilter, excludeParentNodeFilter] };
        }
        findDiffNodes(newArray, oldArray, parentKeyPath, parentKey, rootNode, oldRootNode) {
            const changes = { add: [], refresh: [] };
            if (!newArray && !oldArray) {
                return changes;
            }
            const newPath = parentKeyPath.slice();
            newPath.pop();
            if ((!newArray && oldArray) || (newArray && !oldArray)) {
                changes.refresh.push({
                    parentKey: newPath[newPath.length - 1],
                    rootNode,
                    oldRootNode
                });
                return changes;
            }
            if (newArray.length !== oldArray.length) {
                changes.refresh.push({
                    parentKey,
                    rootNode,
                    oldRootNode
                });
                return changes;
            }
            else {
                let diffCount = 0;
                let diffNodeIndex = 0;
                for (let index = 0; index < newArray.length; index++) {
                    const newNode = newArray[index];
                    const oldNode = oldArray[index];
                    if (newNode !== oldNode) {
                        diffCount++;
                        diffNodeIndex = index;
                    }
                }
                if (diffCount === 0) {
                    return changes;
                }
                else if (diffCount > 1) {
                    changes.refresh.push({
                        parentKey: newPath[newPath.length - 1],
                        rootNode,
                        oldRootNode
                    });
                    return changes;
                }
                else {
                    const newDiffNode = newArray[diffNodeIndex];
                    const oldDiffNode = oldArray[diffNodeIndex];
                    if (parentKey === '') {
                        rootNode = newDiffNode;
                        oldRootNode = oldDiffNode;
                    }
                    const { refresh, add } = this.compareNode(newDiffNode, oldDiffNode, diffNodeIndex, parentKeyPath, newArray, rootNode, oldRootNode);
                    changes.refresh = [...changes.refresh, ...refresh];
                    changes.add = [...changes.add, ...add];
                    return changes;
                }
            }
        }
        compareNode(newNode, oldNode, diffNodeIndex, parentKeyPath, parentChildList, rootNode, oldRootNode) {
            const changes = { add: [], refresh: [] };
            const newKeys = Object.keys(newNode);
            if (newNode === oldNode) {
                return changes;
            }
            if (newNode === null ||
                oldNode === null ||
                ['number', 'string', 'undefined'].indexOf(typeof newNode) >= 0 ||
                ['number', 'string', 'undefined'].indexOf(typeof oldNode) >= 0) {
                changes.add.push({
                    index: diffNodeIndex,
                    value: newNode,
                    treeData: parentChildList,
                    parentKeyPath: parentKeyPath,
                    oldValue: oldNode
                });
                return changes;
            }
            for (let index = 0; index < newKeys.length; index++) {
                const key = newKeys[index];
                if (key !== this._childrenAttr && newNode[key] !== oldNode[key]) {
                    changes.add.push({
                        index: diffNodeIndex,
                        value: newNode,
                        treeData: parentChildList,
                        parentKeyPath: parentKeyPath,
                        oldValue: oldNode
                    });
                    break;
                }
            }
            const newPath = parentKeyPath.slice();
            const newParentKey = newNode['id'];
            newPath.push(newParentKey);
            const { refresh, add } = this.findDiffNodes(newNode[this._childrenAttr], oldNode[this._childrenAttr], newPath, newParentKey, rootNode, oldRootNode);
            changes.refresh = [...changes.refresh, ...refresh];
            changes.add = [...changes.add, ...add];
            return changes;
        }
        _dataMutated(changes, refresh) {
            let i, dataArray = [], keyArray = [], indexArray = [], metadataArray = [];
            let mutationEvent = null;
            let refreshEvent = null;
            const updatedIndexes = [];
            let operationUpdateEventDetail = null;
            let operationAddEventDetail = null;
            let operationRemoveEventDetail = null;
            const refreshKeySet = new Set();
            const dataJS = this._data;
            for (let index = 0; index < refresh.length; index++) {
                if (refresh[index]) {
                    if (!refresh[index].parentKey) {
                        this._getRootDataProvider()._flushMaps();
                        this._getRootDataProvider()._processTreeArray(dataJS, []);
                        refreshEvent = new oj.DataProviderRefreshEvent();
                        return { mutationEvent, refreshEvent };
                    }
                    refreshKeySet.add(refresh[index].parentKey);
                    this._getRootDataProvider()._flushMaps();
                    this._getRootDataProvider()._processTreeArray(this._data, []);
                }
            }
            dataArray = [];
            keyArray = [];
            indexArray = [];
            metadataArray = [];
            const updateKeyArray = [];
            const updateDataArray = [];
            const updateIndexArray = [];
            const updateMetadataArray = [];
            for (i = 0; i < changes.length; i++) {
                if (changes[i]) {
                    const node = changes[i].value;
                    const oldNode = changes[i].oldValue;
                    this._getRootDataProvider()._flushMaps();
                    this._getRootDataProvider()._processTreeArray(dataJS, []);
                    let currTreeData = changes[i].treeData;
                    let path = changes[i].parentKeyPath;
                    const keyObj = this._createKeyObj(node, path, currTreeData);
                    updateKeyArray.push(keyObj.key);
                    updateDataArray.push(node);
                    updateIndexArray.push(changes[i].index);
                    updateMetadataArray.push({ key: keyObj.key });
                }
            }
            if (changes.length > 0) {
                const updateKeySet = new Set();
                updateKeyArray.forEach((key) => {
                    updateKeySet.add(key);
                });
                operationUpdateEventDetail = {
                    data: updateDataArray,
                    indexes: updateIndexArray,
                    keys: updateKeySet,
                    metadata: updateMetadataArray
                };
            }
            if (operationUpdateEventDetail) {
                mutationEvent = new oj.DataProviderMutationEvent({
                    add: operationAddEventDetail,
                    remove: operationRemoveEventDetail,
                    update: operationUpdateEventDetail
                });
            }
            if (refreshKeySet.size || refresh.length) {
                refreshEvent = new oj.DataProviderRefreshEvent({ keys: refreshKeySet });
            }
            return { mutationEvent, refreshEvent };
        }
        _dataRefreshed(mutationEvent, refreshEvent) {
            if (mutationEvent || refreshEvent) {
                if (mutationEvent) {
                    this._getRootDataProvider().dispatchEvent(mutationEvent);
                }
                if (refreshEvent) {
                    this._getRootDataProvider().dispatchEvent(refreshEvent);
                }
            }
            else {
                this._getRootDataProvider()._flushMaps();
                this._getRootDataProvider()._processTreeArray(this._data, []);
                this._getRootDataProvider().dispatchEvent(new oj.DataProviderRefreshEvent());
            }
        }
        _getTreeMetadata(metadata, data) {
            let keyIsPath = false;
            let treeKey = metadata.key;
            if (this.options && this.options.keyAttributeScope == 'siblings') {
                keyIsPath = true;
            }
            if (keyIsPath) {
                treeKey = this._parentNodePath ? this._parentNodePath.slice() : [];
                treeKey.push(metadata.key);
            }
            metadata = this._getNodeMetadata(this._getNodeForKey(treeKey));
            return metadata;
        }
        _releaseTreeArray(treeData) {
            let dataArray;
            if (treeData instanceof Array) {
                dataArray = treeData;
            }
            else {
                dataArray = treeData();
            }
            dataArray.forEach((node, i) => {
                this._releaseNode(node);
            });
        }
        _releaseNode(node) {
            const key = this._getKeyForNode(node);
            this._deleteMapEntry(key, node);
            if (node) {
                const children = this._getChildren(node);
                if (children) {
                    this._releaseTreeArray(children);
                }
            }
        }
        _deleteMapEntry(key, node) {
            const rootDataProvider = this._getRootDataProvider();
            rootDataProvider._mapKeyToNode.delete(JSON.stringify(key));
            rootDataProvider._mapNodeToKey.delete(node);
        }
        _flushMaps() {
            const rootDataProvider = this._getRootDataProvider();
            rootDataProvider._mapKeyToNode.clear();
            rootDataProvider._mapNodeToKey.clear();
        }
    }
    ojeventtarget.EventTargetMixin.applyMixin(MutableArrayTreeDataProvider);
    oj._registerLegacyNamespaceProp('MutableArrayTreeDataProvider', MutableArrayTreeDataProvider);

    exports.MutableArrayTreeDataProvider = MutableArrayTreeDataProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
