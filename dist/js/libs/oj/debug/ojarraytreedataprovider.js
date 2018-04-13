/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojeventtarget', 'ojs/ojtreedataprovider'], function(oj, $, ko)
{
  var ArrayDataProvider = oj['ArrayDataProvider'];

var ArrayTreeDataProvider = /** @class */ (function () {
    function ArrayTreeDataProvider(treeData, options, _rootDataProvider) {
        this.treeData = treeData;
        this.options = options;
        this._rootDataProvider = _rootDataProvider;
        this.TreeAsyncIterator = /** @class */ (function () {
            function class_1(_parent, _baseIterable) {
                this._parent = _parent;
                this._baseIterable = _baseIterable;
            }
            class_1.prototype['next'] = function () {
                var self = this;
                return this._baseIterable[Symbol.asyncIterator]().next().then(function (result) {
                    var metadata = result.value.metadata;
                    for (var i = 0; i < metadata.length; i++) {
                        // Replace flat array metadata with tree array metadata 
                        metadata[i] = self._parent._getNodeMetadata(result.value.data[i]);
                    }
                    return result;
                });
            };
            return class_1;
        }());
        this.TreeAsyncIterable = /** @class */ (function () {
            function class_2(_parent, _asyncIterator) {
                this._parent = _parent;
                this._asyncIterator = _asyncIterator;
                this[Symbol.asyncIterator] = function () {
                    return this._asyncIterator;
                };
            }
            return class_2;
        }());
        this._baseDataProvider = new oj['ArrayDataProvider'](treeData, options);
        this._mapKeyToNode = new Map();
        this._mapNodeToKey = new Map();
        this._nodeSequenceNum = 0;
        // Subscribe to all children observableArray at the top-level
        if (_rootDataProvider == null) {
            this._subscribeObservableArray(treeData, []);
        }
    }
    ArrayTreeDataProvider.prototype.containsKeys = function (params) {
        var self = this;
        return this.fetchByKeys(params).then(function (fetchByKeysResult) {
            var results = new Set();
            params['keys'].forEach(function (key) {
                if (fetchByKeysResult['results'].get(key) != null) {
                    results.add(key);
                }
            });
            return Promise.resolve({ 'containsParameters': params, 'results': results });
        });
    };
    ArrayTreeDataProvider.prototype.getCapability = function (capabilityName) {
        return this._baseDataProvider.getCapability(capabilityName);
    };
    ArrayTreeDataProvider.prototype.getTotalSize = function () {
        return this._baseDataProvider.getTotalSize();
    };
    ArrayTreeDataProvider.prototype.isEmpty = function () {
        return this._baseDataProvider.isEmpty();
    };
    ArrayTreeDataProvider.prototype.getChildDataProvider = function (parentKey, options) {
        var node = this._getNodeForKey(parentKey);
        if (node) {
            var children = this._getChildren(node);
            if (children) {
                var childDataProvider = new ArrayTreeDataProvider(children, this.options, this._getRootDataProvider());
                return childDataProvider;
            }
        }
        return null;
    };
    ArrayTreeDataProvider.prototype.fetchFirst = function (params) {
        var baseIterable = this._baseDataProvider.fetchFirst(params);
        return new this.TreeAsyncIterable(this, new this.TreeAsyncIterator(this, baseIterable));
    };
    ArrayTreeDataProvider.prototype.fetchByOffset = function (params) {
        var basePromise = this._baseDataProvider.fetchByOffset(params);
        var self = this;
        return basePromise.then(function (result) {
            // Repackage the results with tree node metadata
            var results = result.results;
            var newResults = [];
            for (var i = 0; i < results.length; i++) {
                var metadata = results[i]['metadata'];
                var data = results[i]['data'];
                metadata = self._getNodeMetadata(data);
                newResults.push({ 'data': data, 'metadata': metadata });
            }
            return { 'done': result['done'],
                'fetchParameters': result['fetchParameters'],
                'results': newResults };
        });
    };
    ArrayTreeDataProvider.prototype.fetchByKeys = function (params) {
        var self = this;
        var results = new Map();
        params['keys'].forEach(function (key) {
            var node = self._getNodeForKey(key);
            if (node) {
                results.set(key, { 'metadata': { 'key': key },
                    'data': node });
            }
        });
        return Promise.resolve({ 'fetchParameters': params,
            'results': results });
    };
    ArrayTreeDataProvider.prototype._getChildren = function (node) {
        var childrenAttr = this.options && this.options['childrenAttribute'] ? this.options['childrenAttribute'] : 'children';
        return this._getVal(node, childrenAttr);
    };
    ArrayTreeDataProvider.prototype._getRootDataProvider = function () {
        if (this._rootDataProvider) {
            return this._rootDataProvider;
        }
        else {
            return this;
        }
    };
    ArrayTreeDataProvider.prototype._handleArrayChange = function (changes, treeData, parentKeyPath) {
        var self = this;
        var i, id, dataArray = [], keyArray = [], indexArray = [], metadataArray = [];
        // first see if we have deletes and adds. If we do then just do a refresh
        var foundDelete = false;
        var foundAdd = false;
        var dispatchRefreshEvent = false;
        for (i = 0; i < changes.length; i++) {
            if (changes[i]['status'] === 'deleted') {
                foundDelete = true;
                break;
            }
        }
        for (i = 0; i < changes.length; i++) {
            if (changes[i]['status'] === 'added') {
                foundAdd = true;
                break;
            }
        }
        if (foundAdd && foundDelete) {
            dispatchRefreshEvent = true;
        }
        if (foundDelete) {
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'deleted') {
                    var node = changes[i].value;
                    var key = self._getKeyForNode(node);
                    keyArray.push(key);
                    dataArray.push(node);
                    indexArray.push(changes[i].index);
                    self._deleteMapEntry(key, node);
                }
            }
            if (keyArray.length > 0 && !dispatchRefreshEvent) {
                metadataArray = keyArray.map(function (value) {
                    return { 'key': value };
                });
                var keySet_1 = new Set();
                keyArray.map(function (key) {
                    keySet_1.add(key);
                });
                var operationEventDetail = { data: dataArray, indexes: indexArray, keys: keySet_1, metadata: metadataArray };
                var mutationEventDetail = { remove: operationEventDetail };
                self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
            }
        }
        if (foundAdd) {
            var nodeArray_1 = treeData();
            for (i = 0; i < changes.length; i++) {
                if (changes[i]['status'] === 'added') {
                    var node = changes[i].value;
                    var keyObj = self._createKeyObj(node, parentKeyPath, -1);
                    self._setMapEntry(keyObj.key, node);
                    keyArray.push(keyObj.key);
                    dataArray.push(node);
                    indexArray.push(changes[i].index);
                }
            }
            if (keyArray.length > 0 && !dispatchRefreshEvent) {
                metadataArray = keyArray.map(function (value) {
                    return { key: value };
                });
                var keySet_2 = new Set();
                keyArray.map(function (key) {
                    keySet_2.add(key);
                });
                var afterKeySet_1 = new Set();
                indexArray.map(function (addIndex) {
                    var afterKey;
                    if (addIndex >= nodeArray_1.length - 1) {
                        afterKey = '';
                    }
                    else {
                        afterKey = self._getKeyForNode(nodeArray_1[addIndex + 1]);
                    }
                    afterKeySet_1.add(afterKey);
                });
                var operationEventDetail = { afterKeys: afterKeySet_1, data: dataArray, indexes: indexArray, keys: keySet_2, metadata: metadataArray };
                var mutationEventDetail = { add: operationEventDetail };
                self.dispatchEvent(new oj.DataProviderMutationEvent(mutationEventDetail));
            }
            if (dispatchRefreshEvent) {
                self.dispatchEvent(new oj.DataProviderRefreshEvent());
            }
        }
    };
    /**
     * If observableArray, then subscribe to it
     */
    ArrayTreeDataProvider.prototype._subscribeObservableArray = function (treeData, parentKeyPath) {
        var self = this;
        var dataArray;
        if (treeData instanceof Array) {
            dataArray = treeData;
        }
        else {
            if (!(ko.isObservable(treeData) && !(treeData['destroyAll'] === undefined))) {
                // we only support Array or ko.observableArray
                throw new Error('Invalid data type. ArrayTreeDataProvider only supports Array or observableArray.');
            }
            // subscribe to observableArray arrayChange event to get individual updates
            treeData['subscribe'](function (changes) {
                self._handleArrayChange(changes, treeData, parentKeyPath);
            }, null, 'arrayChange');
            dataArray = treeData();
        }
        dataArray.forEach(function (node, i) {
            var keyObj = self._createKeyObj(node, parentKeyPath, i);
            self._setMapEntry(keyObj.key, node);
            // Keep track of a sequence number so if any node get added later on,
            // we won't reuse existing key if there is no keyAttributes and we generate
            // the id.
            ++self._nodeSequenceNum;
            var children = self._getChildren(node);
            if (children) {
                self._subscribeObservableArray(children, keyObj.keyPath);
            }
        });
    };
    ArrayTreeDataProvider.prototype._createKeyObj = function (node, parentKeyPath, idx) {
        var key = this._getId(node);
        var keyPath = parentKeyPath ? parentKeyPath.slice() : [];
        if (key == null) {
            // _getId returns null if keyAttributes is not specified.  In this case we 
            // use the index path of the node as the key.
            keyPath.push(idx >= 0 ? idx : this._nodeSequenceNum++);
            key = keyPath;
        }
        else {
            keyPath.push(key);
            if (this.options && this.options['keyAttributesScope'] == 'siblings') {
                // If the id is only unique among siblings, we use the id path of the 
                // node as the key.
                key = keyPath;
            }
        }
        return { 'key': key, 'keyPath': keyPath };
    };
    /**
     * Get id value for row
     */
    ArrayTreeDataProvider.prototype._getId = function (row) {
        var id;
        var keyAttributes = this.options != null ? this.options['keyAttributes'] : null;
        if (keyAttributes != null) {
            if (Array.isArray(keyAttributes)) {
                var i;
                id = [];
                for (i = 0; i < keyAttributes.length; i++) {
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
    };
    ;
    /**
     * Get value for attribute
     */
    ArrayTreeDataProvider.prototype._getVal = function (val, attr) {
        if (typeof attr == 'string') {
            var dotIndex = attr.indexOf('.');
            if (dotIndex > 0) {
                var startAttr = attr.substring(0, dotIndex);
                var endAttr = attr.substring(dotIndex + 1);
                var subObj = val[startAttr];
                if (subObj) {
                    return this._getVal(subObj, endAttr);
                }
            }
        }
        if (typeof (val[attr]) == 'function') {
            return val[attr]();
        }
        return val[attr];
    };
    ;
    /**
     * Get all values in a row
     */
    ArrayTreeDataProvider.prototype._getAllVals = function (val) {
        var self = this;
        return Object.keys(val).map(function (key) {
            return self._getVal(val, key);
        });
    };
    ;
    ArrayTreeDataProvider.prototype._getNodeMetadata = function (node) {
        return { 'key': this._getKeyForNode(node) };
    };
    ArrayTreeDataProvider.prototype._getNodeForKey = function (key) {
        var rootDataProvider = this._getRootDataProvider();
        return rootDataProvider._mapKeyToNode.get(key);
    };
    ArrayTreeDataProvider.prototype._getKeyForNode = function (node) {
        var rootDataProvider = this._getRootDataProvider();
        return rootDataProvider._mapNodeToKey.get(node);
    };
    ArrayTreeDataProvider.prototype._setMapEntry = function (key, node) {
        var rootDataProvider = this._getRootDataProvider();
        rootDataProvider._mapKeyToNode.set(key, node);
        rootDataProvider._mapNodeToKey.set(node, key);
    };
    ArrayTreeDataProvider.prototype._deleteMapEntry = function (key, node) {
        var rootDataProvider = this._getRootDataProvider();
        rootDataProvider._mapKeyToNode.delete(key);
        rootDataProvider._mapNodeToKey.delete(node);
    };
    return ArrayTreeDataProvider;
}());
oj.ArrayTreeDataProvider = ArrayTreeDataProvider;
oj['ArrayTreeDataProvider'] = ArrayTreeDataProvider;
oj.EventTargetMixin.applyMixin(ArrayTreeDataProvider);

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/*jslint browser: true,devel:true*/
/**
 * @ignore
 * @ojstatus preview
 * @since 5.1.0
 * @export
 * @class oj.ArrayTreeDataProvider
 * @implements oj.TreeDataProvider
 * @classdesc This class implements {@link oj.TreeDataProvider} and is used to represent hierachical data available from an array.<br><br>
 *            Each array element represents a tree node, which can contain nested child object array for its subtree.  
 *            Array elements can be in any shape and form, but is usually an object with a "children" property.  The name of the "children" property
 *            can optionaly be specified with the "childrenAttribute" option.<br><br>
 *            For nodes that cannot have children, the "children" property should not be set.
 *            For nodes that can but don't have children, the "children" property should be set to an empty array.<br><br>
 *            Data can be passed as a regular array or a Knockout observableArray.  If a Knockout observableArray is
 *            used, any mutation must be performed with observableArray methods.  The events described below will be dispatched to the ArrayTreeDataProvider
 *            with the appropriate event payload.  
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
 * Event payload is found under <code class="prettyprint">event.detail</code>, which implements the {@link oj.DataProviderMutationEventDetail} interface.
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
 * @param {Object=} options Options for the ArrayTreeDataProvider
 * @param {oj.SortComparators=} options.sortComparators Optional {@link oj.sortComparator} to use for sort.
 * @param {Array.<oj.SortCriterion>=} options.implicitSort Optional array of {@link oj.sortCriterion} used to specify sort information when the data loaded into the dataprovider is already sorted.
 * @param {(string | Array.<string>)=} options.keyAttributes Optional attribute name(s) which stores the key in the data. Can be a string denoting a single key attribute or an array
 *                                                         of strings for multiple key attributes.  Dot notation can be used to specify nested attribute (e.g. 'attr.id').<br><br>
 *                      If specified, caller must ensure that the keyAttributes contains values that are either unique within the entire tree,
 *                        or unique among the siblings of each node.  In the latter case, Caller must also set the keyAttributesScope option to 'siblings'.<br>
 *                      If keyAttributes is specified and keyAttributesScope is 'global', the attribute value will be used as the key.<br>
 *                      If keyAttributes is specified and keyAttributesScope is 'siblings', a path array of the attribute values, starting from the root node, will be used as the key.<br>
 *                      If keyAttributes is not specified, a path array of node index, starting from the root node, will be used as the key.
 * @param {('global'|'siblings')=} options.keyAttributesScope Optional scope of the key values in the fields specified by keyAttributes.  Supported values:<br>
 *                                           <ul>
 *                                             <li>'global': the key values are unique within the entire tree.
 *                                             <li>'siblings': the key values are unique among the siblings of each node.
 *                                           </ul>
 *                                           Default is 'global'.
 * @param {string=} options.childrenAttribute Optional field name which stores the children of nodes in the data.  Dot notation can be used to specify nested attribute.
 *                                                  If this is not specified, the default is "children".
 * @ojsignature [{target: "Type",
 *               value: "class ArrayTreeDataProvider<K, D> implements TreeDataProvider<K, D>"},
 *               {target: "Type",
 *               value: "SortCriterion<D>[]", 
 *               for: "options.implicitSort"},
 *               {target: "Type",
 *               value: "SortComparators<D>", 
 *               for: "options.sortComparators"}]
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
 * var dataprovider = new oj.ArrayTreeDataProvider(treeData, {keyAttributes: 'attr.id'});
 */

/**
 * Fetch rows by keys in the entire tree.
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.FetchByKeysResults>} Promise which resolves to {@link oj.FetchByKeysResults}
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>"}
 */

/**
 * Get a data provider for the children of the row identified by parentKey.
 * 
 * @ojstatus preview
 * @param {any} parentKey key of the row to get child data provider for.
 * @return {ArrayTreeDataProvider | null} An ArrayTreeDataProvider if the row can (but doesn't have to) have children; or null if the row cannot have children.
 *   Use the <code class="prettyprint">isEmpty</code> method on the returned ArrayTreeDataProvider to determine if it currently has children.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name getChildDataProvider
 * @ojsignature {target: "Type",
 *               value: "(any): ArrayTreeDataProvider<K, D>"}
 */

/**
 * Check if there are rows containing the specified keys in the entire tree.
 *
 * @ojstatus preview
 * @param {oj.FetchByKeysParameters} params Fetch by keys parameters
 * @return {Promise.<oj.ContainsKeysResults>} Promise which resolves to {@link oj.ContainsKeysResults}
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name containsKeys
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>"}
 */

/**
 * Fetch rows by offset at the top level.
 *
 * @ojstatus preview
 * @param {oj.FetchByOffsetParameters} params Fetch by offset parameters
 * @return {Promise.<oj.FetchByOffsetResults>} Promise which resolves to {@link oj.FetchByOffsetResults}
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 * @ojsignature {target: "Type",
 *               value: "(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>"}
 */

/**
 * Fetch the first set of rows at the current level.
 * <p>
 * If <code class="prettyprint">params.sortCriteria</code> is specified, the default sorting algorithm used is natural sort.
 * </p>
 * 
 * @ojstatus preview
 * @param {oj.FetchListParameters=} params Fetch parameters
 * @return {AsyncIterable.<oj.FetchListResult>} AsyncIterable with {@link oj.FetchListResult}
 * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name fetchFirst
 * @ojsignature {target: "Type",
 *               value: "<F extends FetchListResult<K, D>>(params?: FetchListParameters<D>): AsyncIterable<F>"}
 */

/**
 * Determines whether this data provider supports certain feature.
 * 
 * @ojstatus preview
 * @param {string} capabilityName capability name. Supported capability names are:
 *                  "fetchByKeys", "fetchByOffset", and "sort".
 * @return {Object} capability information or null if unsupported
 * <ul>
 *   <li>If capabilityName is "fetchByKeys", returns a {@link oj.FetchByKeysCapability} object.</li>
 *   <li>If capabilityName is "fetchByOffset", returns a {@link oj.FetchByOffsetCapability} object.</li>
 *   <li>If capabilityName is "sort", returns a {@link oj.SortCapability} object.</li>
 * </ul>
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name getCapability
 * @ojsignature {target: "Type",
 *               value: "(capabilityName?: string): any"}
 */

/**
 * Return the total number of rows at the top level.
 * 
 * @ojstatus preview
 * @return {Promise.<number>} Returns a Promise which resolves to the total number of rows. -1 is unknown row count.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * Return a string that indicates if this data provider is empty.
 * 
 * @ojstatus preview
 * @return {string} a string that indicates if this data provider is empty. Valid values are:
 *                  "yes": this data provider is empty.
 *                  "no": this data provider is not empty.
 *                  "unknown": it is not known if this data provider is empty until a fetch is made.
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * Add a callback function to listen for a specific event type.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name addEventListener
 * @param {string} eventType The event type to listen for.
 * @param {EventListener} listener The callback function that receives the event notification.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Remove a listener previously registered with addEventListener.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name removeEventListener
 * @param {string} eventType The event type that the listener was registered for.
 * @param {EventListener} listener The callback function that was registered.
 * @ojsignature {target: "Type",
 *               value: "(eventType: string, listener: EventListener): void"}
 */

/**
 * Dispatch an event and invoke any registered listeners.
 *
 * @ojstatus preview
 * @export
 * @expose
 * @memberof oj.ArrayTreeDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 * @param {Event} event The event object to dispatch.
 * @return {boolean} Return false if a registered listener has cancelled the event. Return true otherwise.
 * @ojsignature {target: "Type",
 *               value: "(evt: Event): boolean"}
 */

/**
 * End of jsdoc
 */
});