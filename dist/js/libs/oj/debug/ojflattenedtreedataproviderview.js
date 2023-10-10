/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojset', 'ojs/ojeventtarget', 'ojs/ojobservable', 'ojs/ojmap', 'ojs/ojdataprovider', 'ojs/ojkeyset'], function (oj, ojSet, ojeventtarget, ojobservable, ojMap, ojdataprovider, ojkeyset) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    ojSet = ojSet && Object.prototype.hasOwnProperty.call(ojSet, 'default') ? ojSet['default'] : ojSet;
    ojMap = ojMap && Object.prototype.hasOwnProperty.call(ojMap, 'default') ? ojMap['default'] : ojMap;

    /**
     * @preserve Copyright 2013 jQuery Foundation and other contributors
     * Released under the MIT license.
     * http://jquery.org/license
     */

    /* jslint browser: true,devel:true*/
    /**
     *
     * @since 7.0.0
     * @export
     * @final
     * @class FlattenedTreeDataProviderView
     * @ojtsmodule
     * @implements DataProvider
     * @classdesc Provides row expander optimizations for TreeDataProvider by flattening the tree.
     * <h3 id="events-section">
     *   Events
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#events-section"></a>
     * </h3>
     * Consumers can add event listeners to listen for the following event types and respond to data change.
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
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * <h4>Fetch Performance</h4>
     * <p>FlattenedTreeDataProviderView will fetch depth first on expanded items. </p>
     * <p>If items are expanded and a fetch size requested is satisfied by the fetching of child nodes, the leftover unreturned higher level items will be discarded and may be re-fetched. Applications can implement their own caching data provider layer to avoid multiple fetches of the same data.</p>
     * </h3>
     *
     *
     * @param {TreeDataProvider} dataProvider the wrapped TreeDataProvider to flatten.
     * @param {FlattenedTreeDataProviderView.Options=} options Options for FlattenedTreeDataProviderView
     * @ojsignature [{target: "Type",
     *               value: "class FlattenedTreeDataProviderView<K, D> implements DataProvider<K, D>",
     *               genericParameters: [{"name": "K", "description": "Type of output key"}, {"name": "D", "description": "Type of output data"}]},
     *               {target: "Type",
     *               value: "TreeDataProvider<K, D>",
     *               for: "dataProvider"},
     *               {target: "Type",
     *               value: "FlattenedTreeDataProviderView.Options<K>",
     *               for: "options"}]
     * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: "TreeDataProvider"}
     * @ojtsimport {module: "ojkeyset", type: "AMD", imported: ["KeySet", "AllKeySetImpl", "KeySetImpl"]}
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion",
     *   "FetchByKeysParameters","ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters", "FetchByOffsetResults",
     *   "FetchListResult","FetchListParameters"]}
     *
     */

    /**
     * @typedef {Object} FlattenedTreeDataProviderView.Options
     * @property {any=} expanded - Optional key set to track the expansion state. To monitor the expansion state use the getExpandedObvservable method. To update the
     *   expansion state use the setExpanded method.
     * @ojsignature [
     *  {target: "Type", value: "<K>", for: "genericTypeParameters"},
     *  {target: "Type", value: "KeySetImpl<K> | AllKeySetImpl<K>", for: "expanded"}
     * ]
     */

    /**
     * Set a new expanded property on the FlattenedTreeDataProviderView.
     *
     *
     * @export
     * @expose
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name setExpanded
     * @param {KeySet} keySet the new key set representing expanded
     * @ojsignature {target: "Type",
     *               value: "(keySet: KeySet<K>): void"}
     */

    /**
     * Get the observable with information about the expanded state to subscribe to.
     * Consumers can call subscribe and unsubscribe to receive changes to the expanded property.
     * <p>On the first subscribe call, the initial value will be passed to the subscriber.
     * <p>The observed value is an object with the following properties:
     * value: KeySet - new expanded key set
     * completionPromise?: Promise - resolved after all mutations have fired
     *                   relevant to the expand/collapse.
     *
     * <i>Example of consumer listening for the "mutate" event type:</i>
     * <pre class="prettyprint"><code>expandedObserexpandedObservable = dataprovider.getExpandedObservable();
     * subscriber = expandedObservable.subscribe(function(detail){
     *  expanded = detail.value;
     *  promise = detail.completionPromise;
     *  // handle changes
     * });
     * // unsubscribe later
     * subscriber.unsubscribe();
     * </code></pre>
     *
     * @return {Object} an object to call subscribe on to receive changes to the expanded property. The subscribe function returns an object to call unsubscribe on.
     *
     * @export
     * @expose
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name getExpandedObservable
     * @see {@link https://github.com/tc39/proposal-observable} for further information on Observable and Subscription.
     * @ojsignature {target: "Type",
     *               value: "():{ subscribe( subscriber : ((expanded: {value: KeySet<K>, completionPromise: Promise<any>}) => void) ): {unsubscribe(): void, closed(): boolean}}"}
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name containsKeys
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name createOptimizedKeySet
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name createOptimizedKeyMap
     */

    /**
     * Get an AsyncIterable object for iterating the data.
     * <p>
     * AsyncIterable contains a Symbol.asyncIterator method that returns an AsyncIterator.
     * AsyncIterator contains a “next” method for fetching the next block of data.
     * </p><p>
     * The "next" method returns a promise that resolves to an object, which contains a "value" property for the data and a "done" property
     * that is set to true when there is no more data to be fetched.  The "done" property should be set to true only if there is no "value"
     * in the result.  Note that "done" only reflects whether the iterator is done at the time "next" is called.  Future calls to "next"
     * may or may not return more rows for a mutable data source.
     * </p>
     * <p>
     * Please see the <a href="DataProvider.html#custom-implementations-section">DataProvider documentation</a> for
     * more information on custom implementations.
     * </p>
     *
     * @param {FetchListParameters=} params fetch parameters
     * @return {AsyncIterable.<FetchListResult>} AsyncIterable with {@link FetchListResult}
     * @see {@link https://github.com/tc39/proposal-async-iteration} for further information on AsyncIterable.
     * @export
     * @expose
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name fetchFirst
     * @ojsignature {target: "Type",
     *               value: "(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>"}
     * @ojtsexample <caption>Get an asyncIterator and then fetch first block of data by executing next() on the iterator. Subsequent blocks can be fetched by executing next() again.</caption>
     * let asyncIterator = dataprovider.fetchFirst(options)[Symbol.asyncIterator]();
     * let result = await asyncIterator.next();
     * let value = result.value;
     * let data = value.data;
     * let keys = value.metadata.map(function(val) {
     *   return val.key;
     * });
     * // true or false for done
     * let done = result.done;
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name fetchByKeys
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name fetchByOffset
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name getCapability
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name getTotalSize
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name isEmpty
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name addEventListener
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name removeEventListener
     */

    /**
     * @inheritdoc
     * @memberof FlattenedTreeDataProviderView
     * @instance
     * @method
     * @name dispatchEvent
     */

    // end of jsdoc

    var __awaiter = (null && null.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class FlattenedTreeDataProviderView {
        constructor(dataProvider, options) {
            var _a;
            this.dataProvider = dataProvider;
            this.options = options;
            this.AsyncIterable = (_a = class {
                    constructor(_parent, _asyncIterator) {
                        this._parent = _parent;
                        this._asyncIterator = _asyncIterator;
                        this[Symbol.asyncIterator] = () => {
                            return this._asyncIterator;
                        };
                        this._clientId = Symbol();
                        this._parent._mapClientIdToIteratorInfo.set(this._clientId, 0);
                    }
                },
                Symbol.asyncIterator,
                _a);
            this.AsyncIterator = class {
                constructor(_parent, _nextFunc, _params) {
                    this._parent = _parent;
                    this._nextFunc = _nextFunc;
                    this._params = _params;
                }
                ['next']() {
                    return this._nextFunc(this._params);
                }
            };
            this.AsyncIteratorYieldResult = class {
                constructor(_parent, value) {
                    this._parent = _parent;
                    this.value = value;
                    this.value = value;
                    this.done = false;
                }
            };
            this.AsyncIteratorReturnResult = class {
                constructor(_parent, value) {
                    this._parent = _parent;
                    this.value = value;
                    this.value = value;
                    this.done = true;
                }
            };
            this.Item = class {
                constructor(_parent, metadata, data) {
                    this._parent = _parent;
                    this.metadata = metadata;
                    this.data = data;
                    this.metadata = metadata;
                    this.data = data;
                }
            };
            this.FlattenedTreeItemMetadata = class {
                constructor(_parent, key, parentKey, indexFromParent, treeDepth, isLeaf) {
                    this._parent = _parent;
                    this.key = key;
                    this.parentKey = parentKey;
                    this.indexFromParent = indexFromParent;
                    this.treeDepth = treeDepth;
                    this.isLeaf = isLeaf;
                    this.key = key;
                    this.parentKey = parentKey;
                    this.indexFromParent = indexFromParent;
                    this.treeDepth = treeDepth;
                    this.isLeaf = isLeaf;
                }
            };
            this.FetchListResult = class {
                constructor(_parent, fetchParameters, data, metadata) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.data = data;
                    this.metadata = metadata;
                    this.fetchParameters = fetchParameters;
                    this.data = data;
                    this.metadata = metadata;
                }
            };
            this.FetchByOffsetParameters = class {
                constructor(_parent, offset, size, sortCriteria, filterCriterion, attributes) {
                    this._parent = _parent;
                    this.offset = offset;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this.filterCriterion = filterCriterion;
                    this.attributes = attributes;
                    this.offset = offset;
                    this.size = size;
                    this.sortCriteria = sortCriteria;
                    this.filterCriterion = filterCriterion;
                    this.attributes = attributes;
                }
            };
            this.FetchByOffsetResults = class {
                constructor(_parent, fetchParameters, results, done) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.done = done;
                }
            };
            this.FetchByKeysResults = class {
                constructor(_parent, fetchParameters, results) {
                    this._parent = _parent;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                    this.fetchParameters = fetchParameters;
                    this.results = results;
                }
            };
            this.DataProviderMutationEventDetail = class {
                constructor(_parent, add, remove, update) {
                    this._parent = _parent;
                    this.add = add;
                    this.remove = remove;
                    this.update = update;
                    this.add = add;
                    this.remove = remove;
                    this.update = update;
                }
            };
            this.DataProviderRefreshEventDetail = class {
                constructor(disregardAfterKey) {
                    this.disregardAfterKey = disregardAfterKey;
                    this.disregardAfterKey = disregardAfterKey;
                }
            };
            this.DataProviderOperationEventDetail = class {
                constructor(_parent, keys, metadata, data, indexes, transient) {
                    this._parent = _parent;
                    this.keys = keys;
                    this.metadata = metadata;
                    this.data = data;
                    this.indexes = indexes;
                    this.transient = transient;
                    this.keys = keys;
                    this.metadata = metadata;
                    this.data = data;
                    this.indexes = indexes;
                    this.transient = transient;
                }
            };
            this.DataProviderAddOperationEventDetail = class {
                constructor(_parent, keys, afterKeys, addBeforeKeys, metadata, data, indexes) {
                    this._parent = _parent;
                    this.keys = keys;
                    this.afterKeys = afterKeys;
                    this.addBeforeKeys = addBeforeKeys;
                    this.metadata = metadata;
                    this.data = data;
                    this.indexes = indexes;
                    this.keys = keys;
                    this.afterKeys = afterKeys;
                    this.addBeforeKeys = addBeforeKeys;
                    this.metadata = metadata;
                    this.data = data;
                    this.indexes = indexes;
                }
            };
            if (this.options == null) {
                this.options = {};
            }
            if (!this.options.expanded) {
                this.options.expanded = new ojkeyset.KeySetImpl([]);
            }
            this._expandedObservable = new ojobservable.BehaviorSubject(this._getExpandedObservableValue(this.options.expanded, Promise.resolve()));
            this.dataProvider.addEventListener('mutate', this._handleUnderlyingMutation.bind(this));
            this.dataProvider.addEventListener('refresh', this._handleUnderlyingRefresh.bind(this));
            this._cache = [];
            this._mapClientIdToIteratorInfo = new Map();
            this._mapParentKeyToInfo = new ojMap();
            this._done = false;
        }
        _getChildrenFromCacheByParentKey(parentKey) {
            return this._cache.filter((item) => item.metadata.parentKey === parentKey);
        }
        _calculateItemIndex(parentKey, addEvent, index) {
            var _a, _b;
            let newIndex;
            if (this._currentSortCriteria) {
                const children = this._getChildrenFromCacheByParentKey(parentKey);
                const sortComparator = ojdataprovider.SortUtils.getNaturalSortCriteriaComparator(this._currentSortCriteria);
                const lastChildItem = children[children.length - 1];
                if (children.length > 0) {
                    if (sortComparator(lastChildItem.data, addEvent.data[index]) >= 0) {
                        for (let i = 0; i < children.length; i++) {
                            if (sortComparator(addEvent.data[index], children[i].data) < 0) {
                                newIndex = this._getItemIndexByKey(children[i].metadata.key) - 1;
                                break;
                            }
                        }
                    }
                    else {
                        newIndex =
                            this._getItemIndexByKey(lastChildItem.metadata.key) +
                                this._getLocalDescendentCount(lastChildItem.metadata.key) +
                                1;
                    }
                }
                else {
                    newIndex = this._getItemIndexByKey(parentKey);
                }
            }
            else {
                if (((_a = addEvent === null || addEvent === void 0 ? void 0 : addEvent.addBeforeKeys) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    if (parentKey === null) {
                        const beforeKey = addEvent.addBeforeKeys[index];
                        if (beforeKey !== null) {
                            let beforeIndex = this._getItemIndexByKey(addEvent.addBeforeKeys[index]);
                            newIndex = beforeIndex - 1;
                        }
                        else {
                            newIndex = this._cache.length;
                        }
                    }
                    else {
                        const parentIndex = this._getItemIndexByKey(parentKey);
                        newIndex = parentIndex + this._getLocalDescendentCount(parentKey);
                        if (newIndex === this._cache.length - 1) {
                            newIndex += 1;
                        }
                    }
                }
                else if (((_b = addEvent === null || addEvent === void 0 ? void 0 : addEvent.indexes) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    const parentIndex = this._getItemIndexByKey(parentKey);
                    newIndex =
                        parentIndex === -1
                            ? addEvent.indexes[index] + 1
                            : parentIndex + this._getLocalDescendentCount(parentKey) + 1;
                }
                else {
                    newIndex =
                        this._getItemIndexByKey(this._getLastItemByParentKey(parentKey).metadata.key) + 1;
                }
            }
            return newIndex;
        }
        _incrementIndexFromParent(newIndex, depth) {
            const lastIndex = this._getLastIndex();
            for (let j = newIndex; j <= lastIndex; j++) {
                let newItem = this._getEntry(j);
                if (newItem != null) {
                    const newDepth = newItem.metadata.treeDepth;
                    if (newDepth === depth) {
                        newItem.metadata.indexFromParent += 1;
                    }
                    else if (newDepth < depth) {
                        return;
                    }
                }
            }
        }
        _decrementIndexFromParent(newIndex, depth) {
            const lastIndex = this._getLastIndex();
            for (let j = newIndex; j <= lastIndex; j++) {
                let newItem = this._getEntry(j);
                if (newItem != null) {
                    const newDepth = newItem.metadata.treeDepth;
                    if (newDepth === depth) {
                        newItem.metadata.indexFromParent -= 1;
                    }
                    else if (newDepth < depth) {
                        return;
                    }
                }
            }
        }
        _handleUnderlyingMutation(mutationEventDetail) {
            let operationAddEventDetail = null;
            let operationRemoveEventDetail = null;
            let operationUpdateEventDetail = null;
            const addEvent = mutationEventDetail.detail.add;
            if (addEvent && addEvent.data && addEvent.data.length) {
                const addMetadataArray = [];
                const addDataArray = [];
                const addIndexArray = [];
                const addBeforeKeys = [];
                const addParentKeys = [];
                const addAfterKeySet = new Set();
                const addKeySet = new Set();
                addEvent.parentKeys.forEach((parentKey, index) => {
                    if ((parentKey === null || (this._isExpanded(parentKey) && this._getItemByKey(parentKey))) &&
                        (!this._currentFilterCriteria ||
                            (this._currentFilterCriteria &&
                                this._currentFilterCriteria.filter(addEvent.data[index])))) {
                        let newIndex = this._calculateItemIndex(parentKey, addEvent, index);
                        const item = this._updateItemMetadata(new this.Item(this, addEvent.metadata[index], addEvent.data[index]), parentKey, addEvent.indexes[index]);
                        this._spliceItemToCache(item, newIndex);
                        this._incrementIndexFromParent(newIndex + 1, item.metadata.treeDepth);
                        addDataArray.push(item.data);
                        addMetadataArray.push(item.metadata);
                        addIndexArray.push(newIndex + 1);
                        addParentKeys.push(parentKey);
                        addKeySet.add(addEvent.metadata[index].key);
                        addBeforeKeys.push(this._getKeyByIndex(newIndex + 2));
                        this._incrementIteratorOffset(newIndex + 1);
                    }
                    else {
                        this._mapParentKeyToInfo.delete(parentKey);
                    }
                });
                if (addKeySet.size > 0) {
                    operationAddEventDetail = new this.DataProviderAddOperationEventDetail(this, addKeySet, addAfterKeySet, addBeforeKeys, addMetadataArray, addDataArray, addIndexArray);
                }
            }
            const removeEvent = mutationEventDetail.detail.remove;
            if (removeEvent && removeEvent.data && removeEvent.data.length) {
                const removeKeys = removeEvent.metadata.map((metadata) => {
                    return metadata.key;
                });
                const removeMetadataArray = [];
                const removeDataArray = [];
                const removeIndexArray = [];
                const removeKeySet = new Set();
                removeKeys.forEach((key, index) => {
                    const cacheIndex = this._getItemIndexByKey(key);
                    if (cacheIndex != -1) {
                        const count = this._getLocalDescendentCount(key) + 1;
                        this._decrementIndexFromParent(cacheIndex, this._cache[cacheIndex].metadata.treeDepth);
                        const deletedItems = this._cache.splice(cacheIndex, count);
                        deletedItems.forEach((item, index) => {
                            removeKeySet.add(item.metadata.key);
                            removeMetadataArray.push(item.metadata);
                            removeDataArray.push(item.data);
                            removeIndexArray.push(cacheIndex + index);
                            this._decrementIteratorOffset(cacheIndex);
                            this._mapParentKeyToInfo.delete(item.metadata.key);
                        });
                    }
                });
                if (removeKeySet.size > 0) {
                    operationRemoveEventDetail = new this.DataProviderOperationEventDetail(this, removeKeySet, removeMetadataArray, removeDataArray, removeIndexArray);
                }
            }
            const updateEvent = mutationEventDetail.detail.update;
            if (updateEvent && updateEvent.data && updateEvent.data.length) {
                const updateMetadataArray = [];
                const updateDataArray = [];
                const updateIndexArray = [];
                const updateKeySet = new Set();
                updateEvent.metadata.forEach((metadata, index) => {
                    this._mapParentKeyToInfo.delete(metadata.key);
                    const item = this._getItemByKey(metadata.key);
                    if (item != null) {
                        const itemIndex = this._getItemIndexByKey(metadata.key);
                        const newData = updateEvent.data[index];
                        const newMetadata = new this.FlattenedTreeItemMetadata(this, updateEvent.metadata[index].key, item.metadata.parentKey, item.metadata.indexFromParent, item.metadata.treeDepth, this.getChildDataProvider(updateEvent.metadata[index].key) === null);
                        this._cache.splice(itemIndex, 1, new this.Item(this, newMetadata, newData));
                        updateKeySet.add(updateEvent.metadata[index].key);
                        updateMetadataArray.push(newMetadata);
                        updateDataArray.push(newData);
                        updateIndexArray.push(itemIndex);
                    }
                });
                if (updateKeySet.size > 0) {
                    operationUpdateEventDetail = new this.DataProviderOperationEventDetail(this, updateKeySet, updateMetadataArray, updateDataArray, updateIndexArray);
                }
            }
            if (operationAddEventDetail || operationRemoveEventDetail || operationUpdateEventDetail) {
                const finalMutationEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, operationRemoveEventDetail, operationUpdateEventDetail);
                this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(finalMutationEventDetail));
            }
        }
        _handleUnderlyingRefresh(event) {
            var _a;
            if ((_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.keys) {
                const keys = event.detail.keys;
                for (let i = 0; i < this._cache.length; i++) {
                    const item = this._cache[i];
                    if (keys.has(item.metadata.key)) {
                        this._mapParentKeyToInfo.delete(item.metadata.key);
                        const refreshEvent = new ojdataprovider.DataProviderRefreshEvent(new this.DataProviderRefreshEventDetail(item.metadata.key));
                        const removedItems = this._cache.splice(i + 1, this._cache.length);
                        removedItems.forEach((item) => {
                            this._decrementIteratorOffset(i + 1);
                            this._mapParentKeyToInfo.delete(item.metadata.key);
                        });
                        this.dispatchEvent(refreshEvent);
                        break;
                    }
                }
            }
            else {
                this._clearCaches();
                this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
        }
        _getExpandedObservableValue(expanded, completionPromise) {
            return {
                value: expanded,
                completionPromise: completionPromise
            };
        }
        getChildDataProvider(parentKey) {
            if (!this._mapParentKeyToInfo.has(parentKey)) {
                if (this._isExpanded(parentKey)) {
                    this._mapParentKeyToInfo.set(parentKey, { done: false });
                }
            }
            return this.dataProvider.getChildDataProvider(parentKey);
        }
        containsKeys(params) {
            return this.dataProvider.containsKeys(params);
        }
        fetchByKeys(params) {
            const results = new ojMap();
            params.keys.forEach((key) => {
                const item = this._getItemByKey(key);
                if (item) {
                    results.set(key, item);
                    params.keys.delete(key);
                }
            });
            if (params.keys.size === 0) {
                return Promise.resolve(new this.FetchByKeysResults(this, params, results));
            }
            return this.dataProvider.fetchByKeys(params).then((byKeysResult) => {
                byKeysResult.results.forEach((value, searchKey) => {
                    results.set(searchKey, value);
                });
                return new this.FetchByKeysResults(this, byKeysResult.fetchParameters, results);
            });
        }
        fetchByOffset(params) {
            const size = (params === null || params === void 0 ? void 0 : params.size) != null ? params.size : -1;
            const sortCriteria = (params === null || params === void 0 ? void 0 : params.sortCriteria) != null ? params.sortCriteria : null;
            const offset = (params === null || params === void 0 ? void 0 : params.offset) != null ? (params.offset > 0 ? params.offset : 0) : 0;
            const filterCriterion = (params === null || params === void 0 ? void 0 : params.filterCriterion) != null ? params.filterCriterion : null;
            const fetchAttributes = (params === null || params === void 0 ? void 0 : params.attributes) != null ? params.attributes : null;
            params = new this.FetchByOffsetParameters(this, offset, size, sortCriteria, filterCriterion, fetchAttributes);
            if (this._isSameCriteria(sortCriteria, filterCriterion)) {
                if (this._checkCacheByOffset(params)) {
                    Promise.resolve(this._getFetchByOffsetResultsFromCache(params));
                }
            }
            else {
                this._clearCaches();
                this._currentSortCriteria = sortCriteria;
                this._currentFilterCriteria = filterCriterion;
            }
            return this._fetchByOffset(params);
        }
        fetchFirst(params) {
            this._fetchSize = params != null ? params.size : -1;
            const sortCriteria = params != null ? params.sortCriteria : null;
            const filterCriterion = params != null ? params.filterCriterion : null;
            const fetchAttributes = params != null ? params.attributes : null;
            if (!this._isSameCriteria(sortCriteria, filterCriterion)) {
                this._currentSortCriteria = sortCriteria;
                this._currentFilterCriteria = filterCriterion;
                this._clearCaches();
            }
            const iteratorFunction = () => {
                const currentOffset = this._mapClientIdToIteratorInfo.get(newIterator._clientId);
                let updatedParams = new this.FetchByOffsetParameters(this, currentOffset, this._fetchSize, sortCriteria, filterCriterion, fetchAttributes);
                return this.fetchByOffset(updatedParams).then((result) => {
                    const results = result.results;
                    const data = results.map((value) => {
                        return value.data;
                    });
                    const metadata = results.map((value) => {
                        return value.metadata;
                    });
                    const done = data.length === 0 ? true : false;
                    if (!this._isSameCriteria(result.fetchParameters.sortCriteria, result.fetchParameters.filterCriterion)) {
                        updatedParams.sortCriteria = result.fetchParameters.sortCriteria;
                        updatedParams.filterCriterion = result.fetchParameters.filterCriterion;
                    }
                    this._mapClientIdToIteratorInfo.set(newIterator._clientId, currentOffset + metadata.length);
                    if (done) {
                        return new this.AsyncIteratorReturnResult(this, new this.FetchListResult(this, updatedParams, data, metadata));
                    }
                    return new this.AsyncIteratorYieldResult(this, new this.FetchListResult(this, updatedParams, data, metadata));
                });
            };
            const newIterator = new this.AsyncIterable(this, new this.AsyncIterator(this, (() => {
                return iteratorFunction;
            })(), params));
            return newIterator;
        }
        getCapability(capabilityName) {
            if (capabilityName === 'fetchByOffset') {
                const capabilityObject = {
                    caching: 'visitedByCurrentIterator',
                    implementation: 'randomAccess'
                };
                return capabilityObject;
            }
            else if (capabilityName === 'fetchFirst') {
                const capabilityObject = {
                    caching: 'visitedByCurrentIterator',
                    iterationSpeed: 'delayed'
                };
                return capabilityObject;
            }
            return this.dataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return Promise.resolve(-1);
        }
        isEmpty() {
            return this.dataProvider.isEmpty();
        }
        _isSameCriteria(sortCriteria, filterCriterion) {
            if (sortCriteria) {
                if (!this._currentSortCriteria ||
                    sortCriteria[0].attribute != this._currentSortCriteria[0].attribute ||
                    sortCriteria[0].direction != this._currentSortCriteria[0].direction) {
                    return false;
                }
            }
            else {
                if (this._currentSortCriteria) {
                    return false;
                }
            }
            if (filterCriterion) {
                if (!this._currentFilterCriteria) {
                    return false;
                }
                else {
                    for (const prop in this._currentFilterCriteria) {
                        if (!this._filterCompare(this._currentFilterCriteria, filterCriterion, prop)) {
                            return false;
                        }
                    }
                    for (const prop in filterCriterion) {
                        if (!this._filterCompare(this._currentFilterCriteria, filterCriterion, prop)) {
                            return false;
                        }
                    }
                }
            }
            else {
                if (this._currentFilterCriteria) {
                    return false;
                }
            }
            return true;
        }
        _filterCompare(cachedFilter, newFilter, prop) {
            if (cachedFilter[prop] && newFilter[prop] && cachedFilter[prop] === newFilter[prop]) {
                return true;
            }
            return false;
        }
        _checkCacheByOffset(params, expandKey) {
            if (params.size === -1 && this._done === true) {
                return true;
            }
            else if (expandKey != null) {
                if (this._getLocalDescendentCount(expandKey) >= params.size && params.size !== -1) {
                    return true;
                }
            }
            else if (this._cache.length >= params.offset + params.size && params.size !== -1) {
                return true;
            }
            return false;
        }
        _getFetchByOffsetResultsFromCache(params) {
            const data = this._cache.slice(params.offset, params.size === -1 ? undefined : params.offset + params.size);
            const done = ![...this._mapParentKeyToInfo.values()].some((value) => value.done === false);
            return new this.FetchByOffsetResults(this, params, data, done);
        }
        _clearCaches() {
            this._cache = [];
            this._mapParentKeyToInfo.clear();
        }
        _fetchByOffset(params) {
            if (this._cache.length === 0) {
                const remainingSize = params.size === -1 ? -1 : params.offset + params.size;
                const newParams = new this.FetchByOffsetParameters(this, 0, remainingSize, params.sortCriteria, params.filterCriterion, params.attributes);
                return this._fetchChildrenByOffsetFromDataProvider(newParams, this.dataProvider, null, params).then((result) => {
                    return result.fetchResult;
                });
            }
            const lastEntry = this._getLastEntry();
            let key = lastEntry.metadata.key;
            let index = 0;
            if (lastEntry.metadata.isLeaf || !this._isExpanded(key)) {
                key = lastEntry.metadata.parentKey;
                index = lastEntry.metadata.indexFromParent + 1;
            }
            const dataProvider = key === null ? this.dataProvider : this.getChildDataProvider(key);
            const remainingSize = this._getRemainingSize(params);
            const newParams = new this.FetchByOffsetParameters(this, index, remainingSize, params.sortCriteria, params.filterCriterion, params.attributes);
            return this._fetchChildrenByOffsetFromAncestors(newParams, dataProvider, key, params).then((result) => {
                return result.fetchResult;
            });
        }
        _fetchChildrenByOffsetFromAncestors(params, dataProvider, parentKey, finalParams, expandKey) {
            const handleFetchFromAncestors = (lastParentKey, result) => {
                const lastEntry = this._getItemByKey(lastParentKey);
                if (this._checkCacheByOffset(finalParams, expandKey) ||
                    (result.done && lastParentKey === null) ||
                    lastEntry === null) {
                    return Promise.resolve();
                }
                const lastEntryParentKey = lastEntry.metadata.parentKey;
                const lastEntryParentIndex = lastEntry.metadata.indexFromParent;
                const childDataProvider = lastEntryParentKey === null
                    ? this.dataProvider
                    : this.getChildDataProvider(lastEntryParentKey);
                const newParams = new this.FetchByOffsetParameters(this, lastEntryParentIndex + 1, this._getRemainingSize(finalParams), params.sortCriteria, params.filterCriterion, params.attributes);
                const childrenPromise = this._fetchChildrenByOffsetFromDataProvider(newParams, childDataProvider, lastEntryParentKey, finalParams, expandKey);
                return childrenPromise.then(handleFetchFromAncestors.bind(this, lastEntryParentKey));
            };
            return this._fetchChildrenByOffsetFromDataProvider(params, dataProvider, parentKey, finalParams, expandKey)
                .then(handleFetchFromAncestors.bind(this, parentKey))
                .then(() => {
                const result = this._getFetchByOffsetResultsFromCache(finalParams);
                return { fetchResult: result };
            });
        }
        _fetchChildrenByOffsetFromDataProvider(params, dataProvider, parentKey, finalParams, expandKey) {
            var _a;
            if ((_a = this._mapParentKeyToInfo.get(parentKey)) === null || _a === void 0 ? void 0 : _a.done) {
                return Promise.resolve({
                    fetchResult: new this.FetchByOffsetResults(this, params, [], true)
                });
            }
            const handleNextItemInResults = (result) => __awaiter(this, void 0, void 0, function* () {
                const results = result.results;
                if (!this._isSameCriteria(result.fetchParameters.sortCriteria, result.fetchParameters.filterCriterion)) {
                    finalParams.sortCriteria = result.fetchParameters.sortCriteria;
                    finalParams.filterCriterion = result.fetchParameters.filterCriterion;
                }
                if (results.length === 0 || this._checkCacheByOffset(finalParams, expandKey)) {
                    const returnObject = {};
                    if (expandKey) {
                        returnObject.expandKey = expandKey;
                    }
                    returnObject.done = results.length === 0 ? result.done : false;
                    return Promise.resolve(returnObject);
                }
                const item = results.shift();
                const updatedItem = this._updateItemMetadata(item, parentKey);
                this._pushItemToCache(updatedItem, parentKey);
                if (this._isExpanded(updatedItem.metadata.key)) {
                    const parentKeyInfo = this._mapParentKeyToInfo.get(updatedItem.metadata.key);
                    const childDataProvider = this.getChildDataProvider(updatedItem.metadata.key);
                    const remainingSize = this._getRemainingSize(finalParams, expandKey);
                    if (childDataProvider != null && !parentKeyInfo.done && remainingSize !== 0) {
                        const newParams = new this.FetchByOffsetParameters(this, 0, remainingSize, params.sortCriteria, params.filterCriterion, params.attributes);
                        yield this._fetchChildrenByOffsetFromDataProvider(newParams, childDataProvider, updatedItem.metadata.key, finalParams, expandKey);
                    }
                }
                return handleNextItemInResults(new this.FetchByOffsetResults(this, params, results, result.done));
            });
            return dataProvider
                .fetchByOffset(params)
                .then(handleNextItemInResults)
                .then((nextItemResults) => {
                this._mapParentKeyToInfo.set(parentKey, {
                    done: nextItemResults.done
                });
                const result = this._getFetchByOffsetResultsFromCache(finalParams);
                const validationObject = {
                    fetchResult: result
                };
                if (nextItemResults.expandKey) {
                    validationObject.returnObject = nextItemResults;
                    nextItemResults.done =
                        nextItemResults.done === true
                            ? this._isDescendentTreeDone(nextItemResults.expandKey)
                            : false;
                }
                return validationObject;
            });
        }
        _isDescendentTreeDone(key) {
            const children = this._getChildrenFromCacheByParentKey(key);
            if (children.length === 0) {
                return true;
            }
            const itemDone = this._isDone(key);
            if (!itemDone) {
                return false;
            }
            const childKey = children[children.length - 1].metadata.key;
            return this._isDescendentTreeDone(childKey);
        }
        _isDone(key) {
            return this._mapParentKeyToInfo.has(key) && this._mapParentKeyToInfo.get(key).done;
        }
        _getRemainingSize(params, expandKey) {
            if (params.size === -1) {
                return -1;
            }
            if (expandKey) {
                return params.size - this._getLocalDescendentCount(expandKey);
            }
            return params.size + params.offset - this._cache.length;
        }
        _isExpanded(key) {
            const expanded = this.options.expanded;
            return expanded.has(key);
        }
        setExpanded(keySet) {
            const toExpand = this.createOptimizedKeySet();
            const toCollapse = this.createOptimizedKeySet();
            this._oldExpanded = this.options.expanded;
            this.options.expanded = keySet;
            const oldSet = this._oldExpanded;
            const newSet = this.options.expanded;
            if (!newSet.isAddAll() && !oldSet.isAddAll()) {
                const newValues = newSet.values();
                const oldValues = oldSet.values();
                newValues.forEach((value) => {
                    if (!oldSet.has(value)) {
                        toExpand.add(value);
                    }
                });
                oldValues.forEach((value) => {
                    if (!newSet.has(value)) {
                        toCollapse.add(value);
                    }
                });
            }
            else if (newSet.isAddAll() && oldSet.isAddAll()) {
                const newDeletedValues = newSet.deletedValues();
                const oldDeletedValues = oldSet.deletedValues();
                newDeletedValues.forEach((value) => {
                    if (oldSet.has(value)) {
                        toCollapse.add(value);
                    }
                });
                oldDeletedValues.forEach((value) => {
                    if (newSet.has(value)) {
                        toExpand.add(value);
                    }
                });
            }
            else {
                this._clearCaches();
                this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
                this.getExpandedObservable().next(this._getExpandedObservableValue(this.options.expanded, Promise.resolve()));
                return;
            }
            const keysInCache = this._removeKeysNotInCache(toExpand);
            const expandPromise = this._expand(keysInCache);
            const operationRemoveEventDetail = this._collapse(toCollapse);
            const completionPromise = new Promise((resolve) => {
                expandPromise.then((expandReturnObject) => {
                    const operationAddEventDetail = expandReturnObject.operationAddEventDetail;
                    const fetchedCountMap = expandReturnObject.fetchedCountMap;
                    let disregardAfterKey = null;
                    let previousCacheIndex = null;
                    if (this._fetchSize !== -1) {
                        fetchedCountMap.forEach((value, key) => {
                            const fetchedCount = value.count;
                            if (!value.done && fetchedCount >= this._fetchSize) {
                                const currentCacheIndex = this._getItemIndexByKey(key);
                                if (currentCacheIndex < previousCacheIndex || previousCacheIndex === null) {
                                    previousCacheIndex = currentCacheIndex;
                                    disregardAfterKey = key;
                                }
                            }
                        });
                    }
                    if (previousCacheIndex !== null) {
                        const lastDescendentItem = this._getLastDescendentByParentKey(disregardAfterKey);
                        const lastDescendentIndex = this._getItemIndexByKey(lastDescendentItem.metadata.key);
                        const removedItems = this._cache.splice(lastDescendentIndex + 1, this._cache.length);
                        removedItems.forEach((item) => {
                            this._mapParentKeyToInfo.delete(item.metadata.key);
                            if (this._mapParentKeyToInfo.has(item.metadata.parentKey)) {
                                this._mapParentKeyToInfo.set(item.metadata.parentKey, { done: false });
                            }
                        });
                        const decrementValueTotal = removedItems.length + fetchedCountMap.get(disregardAfterKey).count;
                        for (let i = 0; i < decrementValueTotal; i++) {
                            this._decrementIteratorOffset(previousCacheIndex + 1);
                        }
                    }
                    if (disregardAfterKey === null) {
                        const mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, operationRemoveEventDetail, null);
                        if (operationAddEventDetail.keys.size > 0 || operationRemoveEventDetail.keys.size > 0) {
                            this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
                        }
                    }
                    if (disregardAfterKey !== null) {
                        const refreshEvent = new ojdataprovider.DataProviderRefreshEvent(new this.DataProviderRefreshEventDetail(disregardAfterKey));
                        this.dispatchEvent(refreshEvent);
                    }
                    resolve();
                });
            });
            this.getExpandedObservable().next(this._getExpandedObservableValue(this.options.expanded, completionPromise));
        }
        getExpandedObservable() {
            return this._expandedObservable;
        }
        _pushItemToCache(item, parentKey) {
            const lastEntry = this._getLastItemByParentKey(parentKey);
            const index = lastEntry == null
                ? this._getItemIndexByKey(parentKey)
                : this._getItemIndexByKey(lastEntry.metadata.key) +
                    this._getLocalDescendentCount(lastEntry.metadata.key);
            this._cache.splice(index + 1, 0, item);
        }
        _spliceItemToCache(item, index) {
            this._cache.splice(index + 1, 0, item);
        }
        _removeKeysNotInCache(keysToExpand) {
            const keysInCache = new Set();
            keysToExpand.forEach((key) => {
                const item = this._getItemByKey(key);
                if (item) {
                    keysInCache.add(key);
                }
            });
            return keysInCache;
        }
        _updateItemMetadata(item, parentKey, indexFromParent) {
            let treeDepth = 0;
            const lastEntry = this._getLastItemByParentKey(parentKey);
            let parentIndex = lastEntry == null ? 0 : lastEntry.metadata.indexFromParent + 1;
            if (indexFromParent != null) {
                parentIndex = indexFromParent;
            }
            if (parentKey != null) {
                const parentItem = this._getItemByKey(parentKey);
                treeDepth = parentItem.metadata.treeDepth + 1;
            }
            return new this.Item(this, new this.FlattenedTreeItemMetadata(this, item.metadata.key, parentKey, parentIndex, treeDepth, this.getChildDataProvider(item.metadata.key) === null), item.data);
        }
        _getItemByKey(key) {
            let returnItem = null;
            this._cache.some((item) => {
                if (oj.Object.compareValues(item.metadata.key, key)) {
                    returnItem = item;
                    return true;
                }
            });
            return returnItem;
        }
        _getItemIndexByKey(key) {
            let index = -1;
            this._cache.some((item, i) => {
                if (oj.Object.compareValues(item.metadata.key, key)) {
                    index = i;
                    return true;
                }
            });
            return index;
        }
        _getLastEntry() {
            return this._cache[this._getLastIndex()];
        }
        _getEntry(i) {
            return this._cache[i];
        }
        _getLastDescendentByParentKey(parentKey) {
            const lastItem = this._getLastItemByParentKey(parentKey);
            if (!lastItem) {
                return this._getItemByKey(parentKey);
            }
            if (lastItem.metadata.isLeaf) {
                return lastItem;
            }
            return this._getLastDescendentByParentKey(lastItem.metadata.key);
        }
        _getLastItemByParentKey(parentKey) {
            let returnItem = null;
            this._cache
                .slice()
                .reverse()
                .some((item) => {
                if (oj.Object.compareValues(item.metadata.parentKey, parentKey)) {
                    returnItem = item;
                    return true;
                }
            });
            return returnItem;
        }
        _getLastIndex() {
            return this._cache.length - 1;
        }
        _getLocalDescendentCount(key) {
            const item = this._getItemByKey(key);
            let count = 0;
            if (item != null) {
                const cacheIndex = this._getItemIndexByKey(key);
                const depth = item.metadata.treeDepth;
                const lastIndex = this._getLastIndex();
                for (let j = cacheIndex + 1; j <= lastIndex; j++) {
                    const newItem = this._getEntry(j);
                    const newDepth = newItem.metadata.treeDepth;
                    if (newDepth > depth) {
                        count += 1;
                    }
                    else {
                        return count;
                    }
                }
            }
            return count;
        }
        _expand(keys) {
            const promises = [];
            keys.forEach((key) => {
                const params = new this.FetchByOffsetParameters(this, 0, this._fetchSize, this._currentSortCriteria, this._currentFilterCriteria, null);
                this._mapParentKeyToInfo.set(key, { done: false });
                const dataProvider = this.getChildDataProvider(key);
                promises.push(this._fetchChildrenByOffsetFromDataProvider(params, dataProvider, key, params, key));
            });
            return Promise.all(promises).then((value) => {
                const keySet = this.createOptimizedKeySet();
                const afterKeySet = this.createOptimizedKeySet();
                const beforeArray = [];
                const metadataArray = [];
                const dataArray = [];
                const indexArray = [];
                const fetchedCountMap = new Map();
                keys.forEach((key) => {
                    const count = this._getLocalDescendentCount(key);
                    if (count > 0) {
                        fetchedCountMap.set(key, { count: count, done: false });
                        for (let i = 0; i < value.length; i++) {
                            if (value[i].returnObject &&
                                value[i].returnObject.expandKey === key &&
                                value[i].returnObject.done) {
                                fetchedCountMap.get(key).done = true;
                                break;
                            }
                        }
                        const insertIndex = this._getItemIndexByKey(key) + 1;
                        let afterKey = key;
                        const addedItems = this._cache.slice(insertIndex, insertIndex + count);
                        addedItems.forEach((item, index) => {
                            keySet.add(item.metadata.key);
                            afterKeySet.add(afterKey);
                            metadataArray.push(item.metadata);
                            dataArray.push(item.data);
                            indexArray.push(insertIndex + index);
                            beforeArray.push(this._getKeyByIndex(insertIndex + index + 1));
                            afterKey = item.metadata.key;
                            this._incrementIteratorOffset(insertIndex);
                        });
                    }
                });
                return {
                    operationAddEventDetail: new this.DataProviderAddOperationEventDetail(this, keySet, afterKeySet, beforeArray, metadataArray, dataArray, indexArray),
                    fetchedCountMap: fetchedCountMap
                };
            });
        }
        _getKeyByIndex(index) {
            var _a, _b;
            return ((_b = (_a = this._cache[index]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.key) ? this._cache[index].metadata.key : null;
        }
        _collapse(keys) {
            const metadataArray = [];
            const dataArray = [];
            const indexArray = [];
            const keySet = this.createOptimizedKeySet();
            keys.forEach((key) => {
                const count = this._getLocalDescendentCount(key);
                this._mapParentKeyToInfo.delete(key);
                if (count > 0) {
                    const cacheIndex = this._getItemIndexByKey(key);
                    const deletedItems = this._cache.splice(cacheIndex + 1, count);
                    deletedItems.forEach((item, index) => {
                        this._mapParentKeyToInfo.delete(item.metadata.key);
                        keySet.add(item.metadata.key);
                        metadataArray.push(item.metadata);
                        dataArray.push(item.data);
                        indexArray.push(cacheIndex + index + 1);
                        this._decrementIteratorOffset(cacheIndex + 1);
                    });
                }
            });
            return new this.DataProviderOperationEventDetail(this, keySet, metadataArray, dataArray, indexArray, true);
        }
        _decrementIteratorOffset(index) {
            this._mapClientIdToIteratorInfo.forEach((offset, symbol) => {
                if (index < offset) {
                    this._mapClientIdToIteratorInfo.set(symbol, offset - 1);
                }
            });
        }
        _incrementIteratorOffset(index) {
            this._mapClientIdToIteratorInfo.forEach((offset, symbol) => {
                if (index < offset) {
                    this._mapClientIdToIteratorInfo.set(symbol, offset + 1);
                }
            });
        }
        createOptimizedKeySet(initialSet) {
            if (this.dataProvider.createOptimizedKeySet) {
                return this.dataProvider.createOptimizedKeySet(initialSet);
            }
            return new ojSet(initialSet);
        }
        createOptimizedKeyMap(initialMap) {
            if (this.dataProvider.createOptimizedKeyMap) {
                return this.dataProvider.createOptimizedKeyMap(initialMap);
            }
            if (initialMap) {
                const map = new ojMap();
                initialMap.forEach((value, key) => {
                    map.set(key, value);
                });
                return map;
            }
            return new ojMap();
        }
    }
    oj._registerLegacyNamespaceProp('FlattenedTreeDataProviderView', FlattenedTreeDataProviderView);
    ojeventtarget.EventTargetMixin.applyMixin(FlattenedTreeDataProviderView);

    return FlattenedTreeDataProviderView;

});
