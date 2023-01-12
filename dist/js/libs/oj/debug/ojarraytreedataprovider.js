/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojarraydataprovider', 'ojs/ojeventtarget', 'ojs/ojlogger'], function (oj, $, ArrayDataProvider, ojeventtarget, Logger) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  ArrayDataProvider = ArrayDataProvider && Object.prototype.hasOwnProperty.call(ArrayDataProvider, 'default') ? ArrayDataProvider['default'] : ArrayDataProvider;

  /**
   * @preserve Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   */

  /* jslint browser: true,devel:true*/
  /**
   *
   * @since 5.1.0
   * @export
   * @final
   * @class ArrayTreeDataProvider
   * @implements TreeDataProvider
   * @classdesc This class implements {@link TreeDataProvider} and is used to represent hierachical data available from an array.<br><br>
   *            Each array element represents a tree node, which can contain nested child object array for its subtree.
   *            Array elements can be in any shape and form, but is usually an object with a "children" property.  The name of the "children" property
   *            can optionaly be specified with the "childrenAttribute" option.<br><br>
   *            For nodes that cannot have children, the "children" property should not be set.
   *            For nodes that can but don't have children, the "children" property should be set to an empty array.<br><br>
   *            Data can be passed as a regular array or a Knockout observableArray.  If a Knockout observableArray is
   *            used, any mutation must be performed with observableArray methods.<br/><br/>
   *            ArrayTreeDataProvider subscribes to all changes of Knockout observableArrays including root and any children observableArrays.<br/><br/>
   *            The events described below will be dispatched to the ArrayTreeDataProvider with the appropriate event payload.<br><br>
   *            Filtering is supported and, by default, applied only on leaf nodes. Empty tree nodes are not collapsed.
   *            The filtering on leaf nodes only works by combining the passed in filter definition with an OR expression
   *            of the "children" property to determine if a node is a tree or leaf.
   *
   * <h3 id="events-section">
   * Events
   * <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
   * </h3>
   * <p>Consumers can add event listeners to listen for the following event types and respond to data change.
   * Event listeners should be added to the root-level ArrayTreeDataProvider created by the application. The root-level ArrayTreeDataProvider receives events for the entire tree.
   * Child-level ArrayTreeDataProvider returned by getChildDataProvider does not receive events.
   * </p>
   * <h4 id="event:mutate" class="name">
   * mutate
   * </h4>
   * This event is fired when items are added to, removed from, or updated in an observableArray.  The event is the observableArray specific.
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
   * // initiate a nested observable array
   * const obData = ko.observableArray([
   *   {title:"News", id:"news"},
   *   {title:"Blogs", id:"blogs", "children": ko.observableArray([
   *     {title:"Today", id:"today"},
   *     {title:"Yesterday", id:"yesterday"},
   *     {title:"Archive", id:"archive"}
   *   ])}
   * ]);
   * </code></pre>
   *
   * <p>With the data above, the following are actions on an observableArray and events expected.
   * </p>
   * <table class="keyboard-table">
   *   <thead>
   *     <tr>
   *       <th width='15%'>Action</th>
   *       <th width='30%'>Data Mutation</th>
   *       <th width='20%'>Example</th>
   *       <th width='20%'>Code</th>
   *       <th width='15%'>Expected Events</th>
   *     </tr>
   *   </thead>
   *   <tbody>
   *     <tr>
   *       <td><kbd>add a node as a sibling</kbd></td>
   *       <td>Action is an 'add' on the observableArray containing the node.    This action has no impact to the parent node.</td>
   *       <td>Add sibling 'Links' to root level</td>
   *       <td>obData.push({title: "Links", id: "links"});</td>
   *       <td>'mutate' with 'add' for node</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>remove a node</kbd></td>
   *       <td>Action is a 'remove' on the observableArray containing the node.  This action has no impact to the parent node.</td>
   *       <td>Remove node 'Links'</td>
   *       <td>obData.splice(2,1);</td>
   *       <td>'mutate' with 'remove' for node</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>add a child to a leaf node </kbd></td>
         <td>The node doesn't have any children (null or undefined),
    action is an 'update' on the observableArray containting the node
    which replaces the node with a new node of the same value plus the child under it.</td>
   *       <td>Add a child under 'News'</td>
   *       <td>const newNode = obData.slice(0,1);<br/>
  newNode["children"] = new ko.observableArray([{title: "Child1", id: "child1"}]);<br/>
  obData.splice(0, 1, newNode);</td>
   *       <td>'mutate' with 'update' for parent<br/>
  'refresh' with 'keys' for parent</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Add a child to a non-leaf node </kbd></td>
   *       <td>The node already has children (including []) which is an observableArray,
   action is actually 'add a sibling to a node' where the node is one of the chidren node</td>
   *       <td>Add another child under 'News'</td>
   *       <td>obData()[0].children.push({title: "Child2", id: "child2"});</td>
   *       <td>'mutate' with 'add' for child</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Update a node without children changes</kbd></td>
   *       <td>Action is an 'update' on the observableArray containg the node.</td>
   *       <td>Update node 'News' to 'OldNews'</td>
   *       <td>obData.splice(0,1,{title: "OldNews", id: "news"});</td>
   *       <td>'mutate' with 'update' for node</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Update a node with children changes</kbd></td>
   *       <td>Action is an 'update' on the observableArray containg the node. Refer to the above 'Add a child to a node' as an example.
   The children changes could be any changes in the chidren of the node.</td>
   *       <td></td>
   *       <td></td>
   *       <td>'mutate' with 'update' for parent<br/>
  'refresh' with 'keys' for parent</td>
   *     </tr>
   *     <tr>
   *       <td><kbd>Reorder or move a node</kbd></td>
   *       <td>Action is a 'remove' on the original observableArray containging the node, and an 'add a child to a leaf node'
   if new parent is a leaf node, or 'Add a child to a non-leaf node' if the new parent is a non-leaf node.</td>
   *       <td>Move node 'Today' from 'Blogs' to 'News'</td>
   *       <td>const moveNode = obData()[1].children.splice(0,1);<br/>
  obData()[0].children.push(moveNode);</td>
   *       <td>'mutate' with 'remove' for node <br/>
  'mutate' with 'add' for node</td>
   *     </tr>
   *   </tbody>
   * </table>
   * <br/>
   *
   <i>Example of consumer listening for the events:</i>
   * <pre class="prettyprint"><code>
   * dataProvider.addEventListener("mutate", handleMutate);
   * dataProvider.addEventListener("refresh", handleRefresh);
   *
   * const handleMutate = function(event) {
   *   if (event.detail.remove) {
   *     const removeDetail = event.detail.remove;
   *     // Handle removed items
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
   * <i>Example of when 'mutate' or 'feresh' event will be fired:</i>
   * <pre class="prettyprint"><code>
   * // initiate a nested observable array
   * const obData = ko.observableArray([
   *   {title:"News", id:"news"},
   *   {title:"Blogs", id:"blogs", "children": ko.observableArray([
   *     {title:"Today", id:"today"},
   *     {title:"Yesterday", id:"yesterday"},
   *     {title:"Archive", id:"archive"}
   *   ])}
   * ]);
   *
   * // add a new node to children of 'Blogs' by adding directly to the observableArray obData()[1].children.
   * // 'mutate' event with add will be fired on observableArray obData()[1].children.
   * const newNode = {title: 'Future', id: 'future'};
   * obData()[1].children.push(newNode);
   *
   * // add a new node to children of 'Blogs' by updating the node 'Blogs' of the observableArray obData with updated children.
   * // 'mutate' event with update will be fired on observableArray obData.
   * // 'refresh' event with 'keys' as 'blogs' will be fired since the children of 'blogs' is changed.
   * const newBlogsNode = {title:"Blogs", id:"blogs", "children": ko.observableArray([
   *     {title:"Today", id:"today"},
   *     {title:"Yesterday", id:"yesterday"},
   *     {title:"Archive", id:"archive"},
   *     newNode
   *   ])};
   * obData.splice(1, 1, newBlogsNode);
   * </code></pre>
   *
   * <p>Observe that these two ways of mutating data result to the same final data.  The observableArray methods apply to different observableArray
   * results to differnt events fired.
   * </p>
   *
   * @param {(Array|function():Array)} data data supported by the components
   *                                      <p>This can be either an Array, or a Knockout observableArray.</p>
   * @param {ArrayTreeDataProvider.Options=} options Options for the ArrayTreeDataProvider
   * @ojsignature [{target: "Type",
   *               value: "class ArrayTreeDataProvider<K, D> implements TreeDataProvider<K, D>",
   *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
   *               {target: "Type",
   *               value: "ArrayTreeDataProvider.Options<D>",
   *               for: "options"}
   * ]
   * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
   * @ojtsimport {module: "ojarraydataprovider", type: "AMD", importName: "ArrayDataProvider"}
   * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion",
   *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
   *   "FetchListResult","FetchListParameters"]}
   * @ojtsmodule
   * @example
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
   * // Then create an ArrayTreeDataProvider object with the array
   * const dataprovider = new ArrayTreeDataProvider(treeData, {keyAttributes: 'attr.id'});
   */

  /**
   * @typedef {Object} ArrayTreeDataProvider.Options
   * @property {ArrayDataProvider.SortComparators=} sortComparators - Optional sortComparator to use for sort.
   * @property {SortCriterion=} implicitSort - Optional array of {@link SortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
   * This is used for cases where we would like display some indication that the data is already sorted.
   * For example, ojTable will display the column sort indicator for the corresponding column in either ascending or descending order upon initial render.
   * This option is not used for cases where we want the ArrayDataProvider to apply a sort on initial fetch.
   * For those cases, please wrap in a ListDataProviderView and set the sortCriteria property on it.
   * @property {string=} keyAttributes - Optionally the field name which stores the key in the data. Can be a string denoting a single key attribute or an array
   *                                                  of strings for multiple key attributes. Please note that the ids in ArrayDataProvider must always be unique. Please do not introduce duplicate ids, even during temporary mutation operations. @index causes ArrayDataProvider to use index as key and @value will cause ArrayDataProvider to
   *                                                  use all attributes as key. @index is the default.
   *                                                  <p>With "@index", the key generation is based on the item index only initially.  The key for an item, once assigned,
   *                                                  will not change even if the item index changes (e.g. by inserting/removing items from the array).  Assigned keys will
   *                                                  never be reassigned.  If the array is replaced with new items, the new items will be assigned keys that are different
   *                                                  from their indices.  In general, caller should specify keyAttributes whenever possible and should never assume that the
   *                                                  generated keys are the same as the item indices.</p>
   *                                                  <p>This option is ignored if the "keys" option is specified.</p>
   * @property {string=} textFilterAttributes - Optionally specify which attributes the filter should be applied on when a TextFilter filterCriteria is specified. If this option is not specified then the filter will be applied to all attributes.
   * @property {string=} keyAttributesScope - Optional scope of the key values in the fields specified by keyAttributes.  Supported values:<br>
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
   *  {target: "Type", value: "string | Array<string>", for: "keyAttributes"},
   *  {target: "Type", value: "string[]", for: "textFilterAttributes"},
   *  {target: "Type", value: "'siblings' | 'global'", for: "keyAttributesScope"},
   *  {target: "Type", value: "string", for: "childrenAttribute"},
   * ]
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name getChildDataProvider
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name containsKeys
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name fetchFirst
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name fetchByKeys
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name fetchByOffset
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name getCapability
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name getTotalSize
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name isEmpty
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name createOptimizedKeySet
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name createOptimizedKeyMap
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name addEventListener
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name removeEventListener
   */

  /**
   * @inheritdoc
   * @memberof ArrayTreeDataProvider
   * @instance
   * @method
   * @name dispatchEvent
   */

  // end of jsdoc

  class ArrayTreeDataProvider {
      constructor(treeData, options, _rootDataProvider) {
          var _a;
          this.treeData = treeData;
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
          this._baseDataProvider = new ArrayDataProvider(treeData, options);
          this._mapKeyToNode = new Map();
          this._mapNodeToKey = new Map();
          this._mapArrayToSequenceNum = new Map();
          this._mapKoArrayToSubscriptions = new Map();
          this._mapKeyToParentNodePath = new Map();
          this._parentNodeKeys = new Set();
          this._childrenAttr =
              this.options && this.options['childrenAttribute']
                  ? this.options['childrenAttribute']
                  : 'children';
          if (_rootDataProvider == null) {
              this._parentNodePath = [];
              this._processTreeArray(treeData, []);
          }
          else {
              this._getTreeKeys(this.treeData);
          }
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
      getChildDataProvider(parentKey, options) {
          const rootDP = this._getRootDataProvider();
          const node = this._getNodeForKey(parentKey);
          if (node) {
              const children = this._getChildren(node);
              if (children) {
                  const childDataProvider = new ArrayTreeDataProvider(children, this.options, rootDP);
                  if (childDataProvider != null) {
                      childDataProvider._parentNodePath = rootDP._mapKeyToParentNodePath.get(JSON.stringify(parentKey));
                      rootDP.addEventListener('refresh', (e) => {
                          childDataProvider._getTreeKeys(children);
                      });
                      rootDP.addEventListener('mutate', (e) => {
                          childDataProvider._getTreeKeys(children);
                      });
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
              if (this._parentNodePath.length === 0 || this._parentNodeKeys.has(key)) {
                  const node = this._getNodeForKey(key);
                  if (node) {
                      results.set(key, { metadata: { key }, data: node });
                  }
              }
          });
          return Promise.resolve({ fetchParameters: params, results });
      }
      _getTreeKeys(treeData) {
          const arrTreeData = treeData instanceof Array ? treeData : treeData();
          for (const node of arrTreeData) {
              const key = this._getKeyForNode(node);
              this._parentNodeKeys.add(key);
              if (node[this._childrenAttr]) {
                  this._getTreeKeys(node[this._childrenAttr]);
              }
          }
      }
      _getChildren(node) {
          return this._getVal(node, this._childrenAttr, true);
      }
      _getRootDataProvider() {
          if (this._rootDataProvider) {
              return this._rootDataProvider;
          }
          else {
              return this;
          }
      }
      _subscribeObservableArray(treeData, parentKeyPath) {
          if (!(typeof treeData === 'function' &&
              treeData.subscribe &&
              treeData['destroyAll'] !== undefined)) {
              throw new Error('Invalid data type. ArrayTreeDataProvider only supports Array or observableArray.');
          }
          let mutationEvent = null;
          let refreshEvent = null;
          const subscriptions = new Array(2);
          subscriptions[0] = treeData['subscribe']((changes) => {
              let i, dataArray = [], keyArray = [], indexArray = [], metadataArray = [];
              let j, index;
              const updatedIndexes = [];
              let operationUpdateEventDetail = null;
              let operationAddEventDetail = null;
              let operationRemoveEventDetail = null;
              const refreshKeySet = new Set();
              const removeDuplicate = [];
              const changesCopy = [];
              for (let i = 0; i < changes.length; i++) {
                  changesCopy[i] = { index: changes[i]['index'], status: changes[i]['status'] };
              }
              for (let i = 0; i < changesCopy.length; i++) {
                  const index = changesCopy[i].index;
                  const status = changesCopy[i].status;
                  if (status === 'deleted') {
                      for (let j = 0; j < changesCopy.length; j++) {
                          if (changesCopy[j].status === 'deleted' && changesCopy[j].index > index) {
                              changesCopy[j].index--;
                          }
                      }
                  }
                  else if (status === 'added') {
                      for (let j = 0; j < changesCopy.length; j++) {
                          if (changesCopy[j].status === 'added' && changesCopy[j].index > index) {
                              changesCopy[j].index++;
                          }
                      }
                  }
              }
              for (i = 0; i < changesCopy.length; i++) {
                  index = changesCopy[i].index;
                  status = changesCopy[i].status;
                  const iKey = this._getId(changes[i].value);
                  if (iKey) {
                      for (j = 0; j < changesCopy.length; j++) {
                          if (j !== i &&
                              index === changesCopy[j].index &&
                              status !== changesCopy[j]['status'] &&
                              updatedIndexes.indexOf(i) < 0 &&
                              removeDuplicate.indexOf(i) < 0) {
                              const jKey = this._getId(changes[j].value);
                              if (oj.Object.compareValues(iKey, jKey)) {
                                  if (status === 'deleted') {
                                      removeDuplicate.push(i);
                                      updatedIndexes.push(j);
                                      this._releaseNode(changes[i].value);
                                  }
                                  else {
                                      removeDuplicate.push(j);
                                      updatedIndexes.push(i);
                                  }
                                  if (!this._compareChildren(changes[i].value, changes[j].value)) {
                                      refreshKeySet.add(iKey);
                                  }
                              }
                          }
                      }
                  }
              }
              for (i = 0; i < changes.length; i++) {
                  if (changes[i]['status'] === 'deleted' &&
                      updatedIndexes.indexOf(i) < 0 &&
                      removeDuplicate.indexOf(i) < 0) {
                      const node = changes[i].value;
                      const key = this._getKeyForNode(node);
                      keyArray.push(key);
                      dataArray.push(node);
                      indexArray.push(changes[i].index);
                      this._releaseNode(node);
                  }
              }
              if (keyArray.length > 0) {
                  metadataArray = keyArray.map((value) => {
                      return { key: value };
                  });
                  const keySet = new Set();
                  keyArray.forEach((key) => {
                      keySet.add(key);
                  });
                  operationRemoveEventDetail = {
                      data: dataArray,
                      indexes: indexArray,
                      keys: keySet,
                      metadata: metadataArray
                  };
              }
              dataArray = [];
              keyArray = [];
              indexArray = [];
              metadataArray = [];
              const nodeArray = treeData();
              const updateKeyArray = [];
              const updateDataArray = [];
              const updateIndexArray = [];
              const updateMetadataArray = [];
              for (i = 0; i < changes.length; i++) {
                  if (changes[i]['status'] === 'added' && removeDuplicate.indexOf(i) < 0) {
                      const node = changes[i].value;
                      const keyObj = this._processNode(node, parentKeyPath, treeData);
                      if (updatedIndexes.indexOf(i) < 0) {
                          keyArray.push(keyObj.key);
                          dataArray.push(node);
                          indexArray.push(changes[i].index);
                          metadataArray.push({ key: keyObj.key });
                      }
                      else {
                          updateKeyArray.push(keyObj.key);
                          updateDataArray.push(node);
                          updateIndexArray.push(changes[i].index);
                          updateMetadataArray.push({ key: keyObj.key });
                      }
                  }
              }
              if (keyArray.length > 0) {
                  const keySet = new Set();
                  keyArray.forEach((key) => {
                      keySet.add(key);
                  });
                  const afterKeySet = new Set();
                  const afterKeyArray = [];
                  const parentKeyArray = [];
                  let parentKey;
                  if (this.options &&
                      this.options.keyAttributes &&
                      this.options.keyAttributesScope !== 'siblings') {
                      parentKey = parentKeyPath.length > 0 ? parentKeyPath[parentKeyPath.length - 1] : null;
                  }
                  else {
                      parentKey = parentKeyPath.length > 0 ? parentKeyPath : null;
                  }
                  indexArray.forEach((addIndex) => {
                      let afterKey;
                      if (addIndex >= nodeArray.length - 1) {
                          afterKey = null;
                      }
                      else {
                          afterKey = this._getKeyForNode(nodeArray[addIndex + 1]);
                      }
                      afterKeySet.add(afterKey);
                      afterKeyArray.push(afterKey);
                      parentKeyArray.push(parentKey);
                  });
                  operationAddEventDetail = {
                      afterKeys: afterKeySet,
                      addBeforeKeys: afterKeyArray,
                      parentKeys: parentKeyArray,
                      data: dataArray,
                      indexes: indexArray,
                      keys: keySet,
                      metadata: metadataArray
                  };
              }
              if (updateKeyArray.length > 0) {
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
              if (operationAddEventDetail || operationRemoveEventDetail || operationUpdateEventDetail) {
                  mutationEvent = new oj.DataProviderMutationEvent({
                      add: operationAddEventDetail,
                      remove: operationRemoveEventDetail,
                      update: operationUpdateEventDetail
                  });
              }
              if (refreshKeySet.size) {
                  refreshEvent = new oj.DataProviderRefreshEvent({ keys: refreshKeySet });
              }
          }, null, 'arrayChange');
          subscriptions[1] = treeData['subscribe']((changes) => {
              if (mutationEvent || refreshEvent) {
                  if (mutationEvent) {
                      this.dispatchEvent(mutationEvent);
                  }
                  if (refreshEvent) {
                      this.dispatchEvent(refreshEvent);
                  }
              }
              else {
                  this._flushMaps();
                  this._processTreeArray(this.treeData, []);
                  this.dispatchEvent(new oj.DataProviderRefreshEvent());
              }
              mutationEvent = null;
              refreshEvent = null;
          }, null, 'change');
          this._mapKoArrayToSubscriptions.set(treeData, subscriptions);
      }
      _flushMaps() {
          const rootDataProvider = this._getRootDataProvider();
          rootDataProvider._mapKeyToNode.clear();
          rootDataProvider._mapNodeToKey.clear();
          rootDataProvider._mapArrayToSequenceNum.clear();
          rootDataProvider._mapKoArrayToSubscriptions.forEach((subscription, treeData) => {
              this._unsubscribeObservableArray(treeData);
          });
      }
      _unsubscribeObservableArray(treeData) {
          if (typeof treeData === 'function' &&
              treeData.subscribe &&
              !(treeData['destroyAll'] === undefined)) {
              const subscriptions = this._mapKoArrayToSubscriptions.get(treeData);
              if (subscriptions) {
                  subscriptions[0].dispose();
                  subscriptions[1].dispose();
                  this._mapKoArrayToSubscriptions.delete(treeData);
              }
          }
      }
      _processTreeArray(treeData, parentKeyPath) {
          let dataArray;
          if (treeData instanceof Array) {
              dataArray = treeData;
          }
          else {
              this._subscribeObservableArray(treeData, parentKeyPath);
              dataArray = treeData();
          }
          dataArray.forEach((node, i) => {
              this._processNode(node, parentKeyPath, treeData);
          });
      }
      _releaseTreeArray(treeData) {
          let dataArray;
          if (treeData instanceof Array) {
              dataArray = treeData;
          }
          else {
              this._unsubscribeObservableArray(treeData);
              dataArray = treeData();
          }
          dataArray.forEach((node, i) => {
              this._releaseNode(node);
          });
      }
      _processNode(node, parentKeyPath, treeData) {
          const keyObj = this._createKeyObj(node, parentKeyPath, treeData);
          this._setMapEntry(keyObj.key, node);
          const rootDataProvider = this._getRootDataProvider();
          rootDataProvider._mapKeyToParentNodePath.set(JSON.stringify(keyObj.key), keyObj.keyPath);
          const children = this._getChildren(node);
          if (children) {
              this._processTreeArray(children, keyObj.keyPath);
          }
          return keyObj;
      }
      _releaseNode(node) {
          const key = this._getKeyForNode(node);
          this._deleteMapEntry(key, node);
          const children = this._getChildren(node);
          if (children) {
              this._releaseTreeArray(children);
          }
      }
      _createKeyObj(node, parentKeyPath, treeData) {
          let key = this._getId(node);
          const keyPath = parentKeyPath ? parentKeyPath.slice() : [];
          if (key == null) {
              this._setUseIndexAsKey(true);
              keyPath.push(this._incrementSequenceNum(treeData));
              key = keyPath;
          }
          else {
              keyPath.push(key);
              if (this.options && this.options['keyAttributesScope'] === 'siblings') {
                  key = keyPath;
              }
          }
          return { key, keyPath };
      }
      _getId(row) {
          let id;
          const keyAttributes = this.options != null ? this.options['keyAttributes'] : null;
          if (keyAttributes != null) {
              if (Array.isArray(keyAttributes)) {
                  id = [];
                  for (let i = 0; i < keyAttributes.length; i++) {
                      id[i] = this._getVal(row, keyAttributes[i]);
                  }
              }
              else if (keyAttributes == '@value') {
                  id = this._getAllVals(row);
              }
              else {
                  id = this._getVal(row, keyAttributes);
              }
              return id;
          }
          else {
              return null;
          }
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
          return rootDataProvider._mapKeyToNode.get(JSON.stringify(key));
      }
      _getKeyForNode(node) {
          const rootDataProvider = this._getRootDataProvider();
          return rootDataProvider._mapNodeToKey.get(node);
      }
      _setMapEntry(key, node) {
          const rootDataProvider = this._getRootDataProvider();
          const keyCopy = JSON.stringify(key);
          if (rootDataProvider._mapKeyToNode.has(keyCopy)) {
              Logger.warn(`Duplicate key ${keyCopy} found in ArrayTreeDataProvider.  Keys must be unique when keyAttributes ${this.options.keyAttributes} is specified`);
          }
          rootDataProvider._mapKeyToNode.set(keyCopy, node);
          rootDataProvider._mapNodeToKey.set(node, key);
      }
      _deleteMapEntry(key, node) {
          const rootDataProvider = this._getRootDataProvider();
          rootDataProvider._mapKeyToNode.delete(JSON.stringify(key));
          rootDataProvider._mapNodeToKey.delete(node);
      }
      _incrementSequenceNum(treeData) {
          const rootDataProvider = this._getRootDataProvider();
          const seqNum = rootDataProvider._mapArrayToSequenceNum.get(treeData) || 0;
          rootDataProvider._mapArrayToSequenceNum.set(treeData, seqNum + 1);
          return seqNum;
      }
      _getUseIndexAsKey() {
          const rootDataProvider = this._getRootDataProvider();
          return rootDataProvider._useIndexAsKey;
      }
      _setUseIndexAsKey(value) {
          const rootDataProvider = this._getRootDataProvider();
          return (rootDataProvider._useIndexAsKey = value);
      }
      _getLeafNodeFilter(filter) {
          const attributeFilter = filter;
          const childrenNull = { op: '$ne', attribute: this._childrenAttr, value: null };
          const childrenUndefined = { op: '$ne', attribute: this._childrenAttr, value: undefined };
          const excludeParentNodeFilter = { op: '$and', criteria: [childrenNull, childrenUndefined] };
          return { op: '$or', criteria: [attributeFilter, excludeParentNodeFilter] };
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
      _getTreeMetadata(metadata, data) {
          let keyIsPath = false;
          let treeKey = metadata.key;
          if (this.options == undefined ||
              this.options.keyAttributes == undefined ||
              this.options.keyAttributesScope == 'siblings' ||
              this.options.keyAttributes == '@index' ||
              this._getUseIndexAsKey()) {
              keyIsPath = true;
          }
          if (keyIsPath) {
              treeKey = this._parentNodePath ? this._parentNodePath.slice() : [];
              treeKey.push(metadata.key);
          }
          metadata = this._getNodeMetadata(this._getNodeForKey(treeKey));
          return metadata;
      }
      _compareChildren(node1, node2) {
          let bSame = true;
          const nodeChildren1 = node1[this._childrenAttr];
          const nodeChildren2 = node2[this._childrenAttr];
          const children1 = typeof nodeChildren1 === 'function' ? nodeChildren1() : nodeChildren1;
          const children2 = typeof nodeChildren2 === 'function' ? nodeChildren2() : nodeChildren2;
          if ((!children1 && children2) || (children1 && !children2)) {
              bSame = false;
          }
          else if (children1 && children2) {
              if (children1.length !== children2.length) {
                  bSame = false;
              }
              else {
                  for (let i = 0; i < children1.length; i++) {
                      if (!oj.Object.compareValues(children1[i], children2[i])) {
                          bSame = false;
                          break;
                      }
                  }
              }
          }
          return bSame;
      }
  }
  ojeventtarget.EventTargetMixin.applyMixin(ArrayTreeDataProvider);
  oj._registerLegacyNamespaceProp('ArrayTreeDataProvider', ArrayTreeDataProvider);

  return ArrayTreeDataProvider;

});
