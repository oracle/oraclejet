/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojarraydataprovider', 'ojs/ojeventtarget'], function (oj, $, ArrayDataProvider, ojeventtarget) { 'use strict';

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
     *            used, any mutation must be performed with observableArray methods.  The events described below will be dispatched to the ArrayTreeDataProvider
     *            with the appropriate event payload.<br><br>
     *            Filtering is supported and, by default, applied only on leaf nodes. Empty tree nodes are not collapsed. The filtering on leaf nodes only works
     *            by combining the passed in filter definition with an OR expression of the "children" property to determine if a node is a tree or leaf.
     *
     * <h3 id="events-section">
     *   Events
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
     * </h3>
     * Consumers can add event listeners to listen for the following event types and respond to data change.
     * Event listeners should be added to the root-level ArrayTreeDataProvider created by the application. The root-level ArrayTreeDataProvider receives events for the entire tree.
     * Child-level ArrayTreeDataProvider returned by getChildDataProvider does not receive events.
     * <h4 id="event:mutate" class="name">
     *   mutate
     * </h4>
     * This event is fired when items have been added or removed from the data.
     * <p>
     * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link DataProviderMutationEventDetail} interface.
     * </p>
     *
     * <h4 id="event:refresh" class="name">
     *   refresh
     * </h4>
     * This event is fired when the data has been refreshed and components need to re-fetch the data.
     * <p>
     * This event contains no additional event payload.
     * </p>
     *
     * <i>Example of consumer listening for the "mutate" event type:</i>
     * <pre class="prettyprint"><code>var listener = function(event) {
     *   if (event.detail.remove) {
     *     var removeDetail = event.detail.remove;
     *     // Handle removed items
     *   }
     * };
     * dataProvider.addEventListener("mutate", listener);
     * </code></pre>
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
     * var treeData = [
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
     * var dataprovider = new ArrayTreeDataProvider(treeData, {keyAttributes: 'attr.id'});
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
     *  {target: "Type", value: "'sibling' | 'global'", for: "keyAttributesScope"},
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

    /**
     * End of jsdoc
     */

    class ArrayTreeDataProvider {
        constructor(treeData, options, _rootDataProvider) {
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
            this.TreeAsyncIterable = class {
                constructor(_parent, _asyncIterator) {
                    this._parent = _parent;
                    this._asyncIterator = _asyncIterator;
                    this[Symbol.asyncIterator] = () => {
                        return this._asyncIterator;
                    };
                }
            };
            this._baseDataProvider = new ArrayDataProvider(treeData, options);
            this._mapKeyToNode = new Map();
            this._mapNodeToKey = new Map();
            this._mapArrayToSequenceNum = new Map();
            this._mapKoArrayToSubscriptions = new Map();
            this._mapKeyToParentNodePath = new Map();
            if (_rootDataProvider == null) {
                this._parentNodePath = [];
                this._processTreeArray(treeData, []);
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
            const node = this._getNodeForKey(parentKey);
            if (node) {
                const children = this._getChildren(node);
                if (children) {
                    const childDataProvider = new ArrayTreeDataProvider(children, this.options, this._getRootDataProvider());
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
                return {
                    done: result['done'],
                    fetchParameters: result['fetchParameters'],
                    results: newResults
                };
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
        _getChildren(node) {
            const childrenAttr = this.options && this.options['childrenAttribute']
                ? this.options['childrenAttribute']
                : 'children';
            return this._getVal(node, childrenAttr, true);
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
            const subscriptions = new Array(2);
            subscriptions[0] = treeData['subscribe']((changes) => {
                let i, dataArray = [], keyArray = [], indexArray = [], metadataArray = [];
                let j, index;
                const updatedIndexes = [];
                let operationUpdateEventDetail = null;
                let operationAddEventDetail = null;
                let operationRemoveEventDetail = null;
                const removeDuplicate = [];
                for (i = 0; i < changes.length; i++) {
                    index = changes[i].index;
                    status = changes[i].status;
                    const iKey = this._getId(changes[i].value);
                    if (iKey) {
                        for (j = 0; j < changes.length; j++) {
                            if (j !== i &&
                                index === changes[j].index &&
                                status !== changes[j]['status'] &&
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
                mutationEvent = new oj.DataProviderMutationEvent({
                    add: operationAddEventDetail,
                    remove: operationRemoveEventDetail,
                    update: operationUpdateEventDetail
                });
            }, null, 'arrayChange');
            subscriptions[1] = treeData['subscribe']((changes) => {
                if (mutationEvent) {
                    this.dispatchEvent(mutationEvent);
                }
                else {
                    this._flushMaps();
                    this._processTreeArray(this.treeData, []);
                    this.dispatchEvent(new oj.DataProviderRefreshEvent());
                }
                mutationEvent = null;
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
            rootDataProvider._mapKeyToNode.set(JSON.stringify(key), node);
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
            const childrenAttr = this.options && this.options['childrenAttribute']
                ? this.options['childrenAttribute']
                : 'children';
            const childrenNull = { op: '$ne', attribute: childrenAttr, value: null };
            const childrenUndefined = { op: '$ne', attribute: childrenAttr, value: undefined };
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
    }
    ojeventtarget.EventTargetMixin.applyMixin(ArrayTreeDataProvider);
    oj._registerLegacyNamespaceProp('ArrayTreeDataProvider', ArrayTreeDataProvider);

    return ArrayTreeDataProvider;

});
