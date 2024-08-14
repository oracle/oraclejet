/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
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

    class FlattenedTreeDataProviderView {
        constructor(dataProvider, options) {
            var _a;
            this.dataProvider = dataProvider;
            this.options = options;
            this._cacheInstantiated = false;
            this._createAddItem = (event, insertIndex) => {
                const key = event.key;
                const parentKey = event.parentKey;
                const isLeaf = this.getChildDataProvider(key) === null;
                let treeDepth = 0;
                if (parentKey != null) {
                    const parentItem = this._getItemByKey(parentKey);
                    treeDepth = parentItem.metadata.treeDepth + 1;
                }
                const indexFromParent = this._getInsertIndexFromParent(treeDepth, insertIndex);
                return this._updateItemMetadata(new this.Item(this, event.metadata, event.data), parentKey, treeDepth, indexFromParent, isLeaf);
            };
            this._unshiftAddToCache = (event) => {
                let item = this._createAddItem(event, 0);
                this._cache.unshift(item);
                this._incrementIndexFromParent(1, item.metadata.treeDepth);
                this._incrementIteratorOffset(0);
                return item;
            };
            this._pushAddToCache = (event) => {
                let item = this._createAddItem(event, this._cache.length);
                this._cache.push(item);
                this._incrementIteratorOffset(this._cache.length - 1);
                return item;
            };
            this._spliceAddToCache = (event, newIndex) => {
                let item = this._createAddItem(event, newIndex);
                this._cache.splice(newIndex, 0, item);
                this._incrementIndexFromParent(newIndex + 1, item.metadata.treeDepth);
                this._incrementIteratorOffset(newIndex);
                return item;
            };
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
            this._fetchQueue = [];
            this._notDoneKeyMap = new ojMap();
            this._notDoneKeyMap.set(null, true);
        }
        _getChildrenFromCacheByParentKey(parentKey) {
            return this._cache.filter((item) => item.metadata.parentKey === parentKey);
        }
        sortedIndex(array, value) {
            var low = 0, high = array.length;
            if (value.index === null) {
                return high;
            }
            while (low < high) {
                var mid = (low + high) >>> 1;
                if (array[mid].index !== null && array[mid].index < value.index)
                    low = mid + 1;
                else
                    high = mid;
            }
            return low;
        }
        _processAddEvent(addEventDetail) {
            let events = [];
            let indexInDetail = 0;
            addEventDetail.keys.forEach(function (key) {
                events.push({
                    key,
                    parentKey: addEventDetail.parentKeys[indexInDetail],
                    beforeKey: addEventDetail.addBeforeKeys?.[indexInDetail],
                    index: addEventDetail.indexes?.[indexInDetail],
                    data: addEventDetail.data?.[indexInDetail],
                    metadata: addEventDetail.metadata?.[indexInDetail]
                });
                indexInDetail++;
            });
            if (this._cacheSortCriteria) {
                let leftOverLength = 0;
                while (events.length !== leftOverLength) {
                    leftOverLength = events.length;
                    for (let i = events.length - 1; i >= 0; i--) {
                        const event = events[i];
                        const key = event.key;
                        const parentKey = event.parentKey;
                        if ((parentKey === null || (this._isExpanded(parentKey) && this._containsKey(parentKey))) &&
                            !this._containsKey(key) &&
                            (!this._currentFilterCriteria ||
                                (this._currentFilterCriteria && this._currentFilterCriteria.filter(event.data)))) {
                            const children = this._getChildrenFromCacheByParentKey(parentKey);
                            const sortComparator = ojdataprovider.SortUtils.getNaturalSortCriteriaComparator(this._cacheSortCriteria);
                            let added = false;
                            for (let j = 0; j < children.length; j++) {
                                if (sortComparator(event.data, children[j].data) < 0) {
                                    this._spliceAddToCache(event, this._getItemIndexByKey(children[j].metadata.key));
                                    added = true;
                                    events.splice(i, 1);
                                    break;
                                }
                            }
                            if (!added && this._isKeyDone(parentKey)) {
                                if (parentKey === null) {
                                    this._pushAddToCache(event);
                                    events.splice(i, 1);
                                }
                                else {
                                    const beforeIndex = this._getItemIndexByKey(parentKey) + this._getLocalDescendentCount(parentKey) + 1;
                                    this._spliceAddToCache(event, beforeIndex);
                                    events.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            }
            else if (addEventDetail?.addBeforeKeys?.length > 0) {
                let leftOverLength = 0;
                while (events.length !== leftOverLength) {
                    leftOverLength = events.length;
                    for (let i = events.length - 1; i >= 0; i--) {
                        const event = events[i];
                        const key = event.key;
                        const parentKey = event.parentKey;
                        const parentIndex = this._getItemIndexByKey(parentKey);
                        if ((parentKey === null || (this._isExpanded(parentKey) && parentIndex !== -1)) &&
                            !this._containsKey(key) &&
                            (!this._currentFilterCriteria ||
                                (this._currentFilterCriteria && this._currentFilterCriteria.filter(event.data)))) {
                            const beforeKey = event.beforeKey;
                            if (beforeKey != null) {
                                const beforeIndex = this._getItemIndexByKey(beforeKey);
                                if (beforeIndex !== -1) {
                                    this._spliceAddToCache(event, beforeIndex);
                                    events.splice(i, 1);
                                }
                            }
                            else if (this._isKeyDone(parentKey)) {
                                if (parentKey === null) {
                                    this._pushAddToCache(event);
                                    events.splice(i, 1);
                                }
                                else {
                                    const beforeIndex = parentIndex + this._getLocalDescendentCount(parentKey) + 1;
                                    this._spliceAddToCache(event, beforeIndex);
                                    events.splice(i, 1);
                                }
                            }
                        }
                    }
                }
            }
            else if (addEventDetail?.indexes?.length > 0) {
                let eventBuckets = Array.from(events
                    .reduce((buckets, event) => {
                    const parentKey = event.parentKey;
                    if (!buckets.has(parentKey)) {
                        buckets.set(parentKey, [event]);
                    }
                    else {
                        let bucket = buckets.get(parentKey);
                        bucket.splice(this.sortedIndex(bucket, event), 0, event);
                    }
                    return buckets;
                }, new Map())
                    .entries());
                let leftOverLength = 0;
                while (eventBuckets.length !== leftOverLength) {
                    leftOverLength = eventBuckets.length;
                    for (let i = 0; i < eventBuckets.length;) {
                        const eventBucket = eventBuckets[i];
                        const parentKey = eventBucket[0];
                        const parentKeyIndex = this._getItemIndexByKey(parentKey);
                        if (parentKey === null || (this._isExpanded(parentKey) && parentKeyIndex !== -1)) {
                            const children = this._getChildrenFromCacheByParentKey(parentKey);
                            const eventsInBucket = eventBucket[1];
                            eventsInBucket.forEach((eventInBucket) => {
                                const key = eventInBucket.key;
                                if (!this._containsKey(key) &&
                                    (!this._currentFilterCriteria ||
                                        (this._currentFilterCriteria &&
                                            this._currentFilterCriteria.filter(eventInBucket.data)))) {
                                    const indexFromParent = eventInBucket.index;
                                    let item;
                                    if (indexFromParent === 0) {
                                        if (parentKey === null) {
                                            item = this._unshiftAddToCache(eventInBucket);
                                        }
                                        else {
                                            item = this._spliceAddToCache(eventInBucket, parentKeyIndex + 1);
                                        }
                                        children.unshift(item);
                                    }
                                    else if (indexFromParent === null || indexFromParent > children.length) {
                                        if (this._isKeyDone(parentKey)) {
                                            if (parentKey === null) {
                                                item = this._pushAddToCache(eventInBucket);
                                            }
                                            else {
                                                const insertIndex = parentKeyIndex + this._getLocalDescendentCount(parentKey) + 1;
                                                item = this._spliceAddToCache(eventInBucket, insertIndex);
                                            }
                                            children.push(item);
                                        }
                                    }
                                    else {
                                        const insertIndex = this._getItemIndexByKey(children[indexFromParent - 1].metadata.key) +
                                            this._getLocalDescendentCount(children[indexFromParent - 1].metadata.key) +
                                            1;
                                        item = this._spliceAddToCache(eventInBucket, insertIndex);
                                        children.splice(indexFromParent, 0, item);
                                    }
                                }
                            });
                            eventBuckets.splice(i, 1);
                        }
                        else {
                            i++;
                        }
                    }
                }
            }
            else {
                events.forEach((event) => {
                    const parentKey = event.parentKey;
                    const key = event.key;
                    if ((parentKey === null || (this._isExpanded(parentKey) && this._containsKey(parentKey))) &&
                        !this._containsKey(key) &&
                        (!this._currentFilterCriteria ||
                            (this._currentFilterCriteria &&
                                this._currentFilterCriteria.filter(event.data) &&
                                this._isKeyDone(parentKey)))) {
                        if (parentKey === null) {
                            this._pushAddToCache(event);
                        }
                        else {
                            const beforeIndex = this._getItemIndexByKey(parentKey) + this._getLocalDescendentCount(parentKey) + 1;
                            this._spliceAddToCache(event, beforeIndex);
                        }
                    }
                });
            }
        }
        _incrementIndexFromParent(newIndex, depth) {
            const lastIndex = this._getLastItemIndex();
            for (let j = newIndex; j <= lastIndex; j++) {
                let newItem = this._getItem(j);
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
            const lastIndex = this._getLastItemIndex();
            for (let j = newIndex; j <= lastIndex; j++) {
                let newItem = this._getItem(j);
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
                this._processAddEvent(addEvent);
                addEvent.keys.forEach((key) => {
                    const { index, item } = this._getItemAndIndexByKey(key);
                    if (item != null) {
                        addDataArray.push(item.data);
                        addMetadataArray.push(item.metadata);
                        addIndexArray.push(index);
                        addParentKeys.push(item.metadata.parentKey);
                        addKeySet.add(key);
                        addBeforeKeys.push(this._getKeyByIndex(index + 1));
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
                            this._notDoneKeyMap.delete(item.metadata.key);
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
            if (event?.detail?.keys) {
                const keys = event.detail.keys;
                for (let i = 0; i < this._cache.length; i++) {
                    const item = this._cache[i];
                    if (keys.has(item.metadata.key)) {
                        this._notDoneKeyMap.set(item.metadata.key, true);
                        this._markParentsAsNotDone(item);
                        const refreshEvent = new ojdataprovider.DataProviderRefreshEvent(new this.DataProviderRefreshEventDetail(item.metadata.key));
                        const removedItems = this._cache.splice(i + 1, this._cache.length);
                        removedItems.forEach((item) => {
                            this._decrementIteratorOffset(i + 1);
                            this._notDoneKeyMap.delete(item.metadata.key);
                        });
                        this.dispatchEvent(refreshEvent);
                        break;
                    }
                }
            }
            else {
                this._fetchSize = null;
                this._clearCaches();
                this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
            }
        }
        _markParentsAsNotDone(item) {
            const parentKey = item.metadata.parentKey;
            this._notDoneKeyMap.set(parentKey, true);
            if (parentKey === null) {
                return;
            }
            this._markParentsAsNotDone(this._getItemByKey(parentKey));
        }
        _getExpandedObservableValue(expanded, completionPromise) {
            return {
                value: expanded,
                completionPromise: completionPromise
            };
        }
        getChildDataProvider(parentKey) {
            return this.dataProvider.getChildDataProvider(parentKey);
        }
        containsKeys(params) {
            return this.dataProvider.containsKeys(params);
        }
        fetchByKeys(params) {
            const results = new ojMap();
            const keysToFetch = new ojSet();
            params.keys.forEach((key) => {
                const item = this._getItemByKey(key);
                if (item) {
                    results.set(key, item);
                }
                else {
                    keysToFetch.add(key);
                }
            });
            if (keysToFetch.size === 0) {
                return Promise.resolve(new this.FetchByKeysResults(this, params, results));
            }
            return this.dataProvider.fetchByKeys({ ...params, keys: keysToFetch }).then((byKeysResult) => {
                byKeysResult.results.forEach((value, searchKey) => {
                    results.set(searchKey, value);
                });
                return new this.FetchByKeysResults(this, { ...byKeysResult.fetchParameters, keys: params.keys }, results);
            });
        }
        fetchByOffset(params) {
            const size = params?.size != null ? params.size : -1;
            if (this._fetchSize == null) {
                this._fetchSize = size;
            }
            const offset = params?.offset != null ? (params.offset > 0 ? params.offset : 0) : 0;
            const clonedParams = Object.assign({}, params);
            clonedParams.size = size;
            clonedParams.offset = offset;
            if (this._isSameCriteria(clonedParams.sortCriteria, clonedParams.filterCriterion)) {
                this._currentSortCriteria = clonedParams.sortCriteria;
                this._currentFilterCriteria = clonedParams.filterCriterion;
                if (this._doesCacheSatisfyParameters(clonedParams)) {
                    return Promise.resolve(this._getFetchByOffsetResultsFromCache(clonedParams));
                }
            }
            else {
                this._clearCaches();
                this._currentSortCriteria = clonedParams.sortCriteria;
                this._currentFilterCriteria = clonedParams.filterCriterion;
            }
            return this._fetchByOffset(clonedParams);
        }
        fetchFirst(params) {
            this._fetchSize = params != null ? params.size : -1;
            if (!this._isSameCriteria(params?.sortCriteria, params?.filterCriterion)) {
                this._clearCaches();
            }
            this._currentSortCriteria = params?.sortCriteria;
            this._currentFilterCriteria = params?.filterCriterion;
            const iteratorFunction = () => {
                const currentOffset = this._mapClientIdToIteratorInfo.get(newIterator._clientId);
                const clonedParams = Object.assign({}, params);
                clonedParams.offset = currentOffset;
                clonedParams.size = this._fetchSize;
                return this.fetchByOffset(clonedParams).then((result) => {
                    const results = result.results;
                    const data = results.map((value) => {
                        return value.data;
                    });
                    const metadata = results.map((value) => {
                        return value.metadata;
                    });
                    const done = data.length === 0 ? true : false;
                    const fetchFirstParameters = Object.assign({}, result.fetchParameters);
                    delete fetchFirstParameters.offset;
                    this._mapClientIdToIteratorInfo.set(newIterator._clientId, currentOffset + metadata.length);
                    if (done) {
                        return new this.AsyncIteratorReturnResult(this, new this.FetchListResult(this, fetchFirstParameters, data, metadata));
                    }
                    return new this.AsyncIteratorYieldResult(this, new this.FetchListResult(this, fetchFirstParameters, data, metadata));
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
        _doesCacheSatisfyParameters(params, isExpand = false, fetchCountSoFar = 0) {
            if (params.size === -1) {
                return this._isDone();
            }
            if (isExpand) {
                return fetchCountSoFar >= params.size;
            }
            return this._cache.length >= params.offset + params.size;
        }
        _getFetchByOffsetResultsFromCache(params) {
            let data;
            let done = this._isDone();
            if (params.size === -1) {
                data = this._cache.slice(params.offset, undefined);
            }
            else {
                data = this._cache.slice(params.offset, params.offset + params.size);
                done = done && params.offset + params.size >= this._cache.length;
            }
            params.sortCriteria = this._cacheSortCriteria;
            params.filterCriterion = this._cacheFilterCriteria;
            return new this.FetchByOffsetResults(this, params, data, done);
        }
        _clearCaches() {
            this._cache = [];
            this._cacheSortCriteria = null;
            this._cacheFilterCriteria = null;
            this._cacheInstantiated = false;
            this._notDoneKeyMap.clear();
            this._notDoneKeyMap.set(null, true);
        }
        _isDone() {
            return this._notDoneKeyMap.size === 0;
        }
        _isCacheEmpty() {
            return this._cache.length === 0;
        }
        _getFetchDetails(levelOffset = 0, parentKey = null, level = 0, cacheOffset = this._cache.length, isExpand = false, ancestorsAddedCount = 0) {
            return { parentKey, level, levelOffset, cacheOffset, isExpand, ancestorsAddedCount };
        }
        async _fetchByOffset(params) {
            let levelOffset = 0;
            if (!this._isCacheEmpty()) {
                const returnVal = await this._fetchChildrenByOffsetFromAncestors(params, this._getLastItem());
                if (returnVal.paramsSatisfied) {
                    return this._getFetchByOffsetResultsFromCache(params);
                }
                levelOffset = returnVal.ancestor.metadata.indexFromParent + 1;
            }
            const fetchDetails = this._getFetchDetails(levelOffset);
            await this._fetchChildrenByOffsetFromDataProvider(this.dataProvider, params, fetchDetails);
            return this._getFetchByOffsetResultsFromCache(params);
        }
        async _fetchChildrenByOffsetFromAncestors(params, item, levelOffset = 0) {
            let paramsSatisfied = false;
            let returnVal;
            const key = item.metadata.key;
            const parentKey = item.metadata.parentKey;
            const isLeaf = item.metadata.isLeaf;
            if (!isLeaf && this._isExpanded(key) && !this._isKeyDone(key)) {
                const dataProvider = this.getChildDataProvider(key);
                const fetchDetails = this._getFetchDetails(levelOffset, key, item.metadata.treeDepth + 1);
                returnVal = await this._fetchChildrenByOffsetFromDataProvider(dataProvider, params, fetchDetails);
                paramsSatisfied = returnVal.paramsSatisfied;
                if (paramsSatisfied) {
                    return { paramsSatisfied, ancestor: item };
                }
            }
            if (parentKey === null) {
                return { paramsSatisfied, ancestor: item };
            }
            const parentItem = this._getItemByKey(parentKey);
            const parentChildCount = item.metadata.indexFromParent + 1;
            returnVal = await this._fetchChildrenByOffsetFromAncestors(params, parentItem, parentChildCount);
            paramsSatisfied = returnVal.paramsSatisfied;
            return { paramsSatisfied, ancestor: returnVal.ancestor };
        }
        async _fetchChildrenByOffsetFromDataProvider(dataProvider, fetchParams, fetchDetails) {
            const { parentKey, level, levelOffset, cacheOffset, isExpand, ancestorsAddedCount } = fetchDetails;
            const modifiedParameters = this._getModifiedFetchParameters(fetchParams, fetchDetails);
            const results = await dataProvider.fetchByOffset(modifiedParameters);
            const result = results.results;
            if (!this._cacheInstantiated) {
                this._cacheSortCriteria = results.fetchParameters.sortCriteria;
                this._cacheFilterCriteria = results.fetchParameters.filterCriterion;
                this._cacheInstantiated = true;
            }
            let paramsSatisfied = false;
            let descendentsAddedCount = 0;
            let allResultsCached = true;
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                const key = item.metadata.key;
                const childDataProvider = this.getChildDataProvider(key);
                const isLeaf = childDataProvider == null;
                const isExpanded = this._isExpanded(key);
                const isEmpty = isLeaf ? true : childDataProvider.isEmpty() === 'yes';
                const mightHaveChildren = !isEmpty && isExpanded;
                if (mightHaveChildren) {
                    this._notDoneKeyMap.set(key, true);
                }
                const updatedItem = this._updateItemMetadata(item, parentKey, level, levelOffset + i, isLeaf);
                this._cache.splice(cacheOffset + descendentsAddedCount, 0, updatedItem);
                descendentsAddedCount++;
                allResultsCached = i === result.length - 1;
                paramsSatisfied = this._doesCacheSatisfyParameters(fetchParams, isExpand, descendentsAddedCount + ancestorsAddedCount);
                if (paramsSatisfied) {
                    break;
                }
                if (mightHaveChildren) {
                    let childFetchDetails = this._getFetchDetails(0, key, level + 1, cacheOffset + descendentsAddedCount, isExpand, descendentsAddedCount);
                    let returnVal = await this._fetchChildrenByOffsetFromDataProvider(childDataProvider, fetchParams, childFetchDetails);
                    descendentsAddedCount += returnVal.descendentsAddedCount;
                    paramsSatisfied = returnVal.paramsSatisfied;
                    if (paramsSatisfied) {
                        break;
                    }
                }
            }
            if (allResultsCached && results.done) {
                this._notDoneKeyMap.delete(parentKey);
            }
            return { paramsSatisfied, descendentsAddedCount };
        }
        _isKeyDone(key) {
            return !this._notDoneKeyMap.has(key);
        }
        _isExpanded(key) {
            return this.options.expanded?.has(key);
        }
        _getModifiedFetchParameters(params, levelInfo) {
            let clonedParams = Object.assign({}, params);
            let offset = levelInfo.levelOffset;
            let size;
            if (levelInfo.isExpand) {
                size = params.size - levelInfo.ancestorsAddedCount;
            }
            else {
                size = params.size === -1 ? -1 : params.offset + params.size - this._cache.length;
            }
            clonedParams.offset = offset;
            clonedParams.size = size;
            return clonedParams;
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
            const expandPromise = this._expand(toExpand);
            const operationRemoveEventDetail = this._collapse(toCollapse);
            const completionPromise = new Promise((resolve) => {
                expandPromise.then((expandReturnObject) => {
                    const operationAddEventDetail = expandReturnObject.operationAddEventDetail;
                    const disregardAfterItem = expandReturnObject.disregardAfterItem;
                    const disregardAfterDescendentsAddedCount = expandReturnObject.disregardAfterDescendentsAddedCount;
                    if (disregardAfterItem != null) {
                        const disregardAfterKey = disregardAfterItem.metadata.key;
                        const disregardAfterKeyIndex = this._getItemIndexByKey(disregardAfterKey);
                        const removedItems = this._cache.splice(disregardAfterKeyIndex + disregardAfterDescendentsAddedCount + 1, this._cache.length);
                        this._markParentsAsNotDone(disregardAfterItem);
                        removedItems.forEach((item) => {
                            this._notDoneKeyMap.delete(item.metadata.key);
                        });
                        for (let i = 0; i < removedItems.length; i++) {
                            this._decrementIteratorOffset(disregardAfterKeyIndex + 1);
                        }
                    }
                    if (operationAddEventDetail?.keys?.size > 0 || operationRemoveEventDetail?.keys?.size > 0) {
                        const mutationEventDetail = new this.DataProviderMutationEventDetail(this, operationAddEventDetail, operationRemoveEventDetail, null);
                        this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationEventDetail));
                    }
                    if (disregardAfterItem != null) {
                        const refreshEvent = new ojdataprovider.DataProviderRefreshEvent(new this.DataProviderRefreshEventDetail(disregardAfterItem.metadata.key));
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
        _updateItemMetadata(item, parentKey, treeDepth, indexFromParent, isLeaf) {
            return new this.Item(this, new this.FlattenedTreeItemMetadata(this, item.metadata.key, parentKey, indexFromParent, treeDepth, isLeaf), item.data);
        }
        _containsKey(key) {
            return this._cache.some((item) => {
                return oj.Object.compareValues(item.metadata.key, key);
            });
        }
        _getItemByKey(key) {
            return this._cache.find((item) => {
                return oj.Object.compareValues(item.metadata.key, key);
            });
        }
        _getItemIndexByKey(key) {
            return this._cache.findIndex((item) => {
                return oj.Object.compareValues(item.metadata.key, key);
            });
        }
        _getItemAndIndexByKey(key) {
            let index = -1;
            let item = this._cache.find((item, i) => {
                index = i;
                return oj.Object.compareValues(item.metadata.key, key);
            });
            if (item == null) {
                index = -1;
            }
            return { item, index };
        }
        _getPreviousSibling(item) {
            return this._cache[this._getLastItemIndex()];
        }
        _getLastItem() {
            return this._cache[this._getLastItemIndex()];
        }
        _getItem(i) {
            return this._cache[i];
        }
        _getLastItemIndex() {
            return this._cache.length - 1;
        }
        _getLocalDescendentCount(key) {
            if (key === null) {
                return this._cache.length;
            }
            const item = this._getItemByKey(key);
            let count = 0;
            if (item != null) {
                const cacheIndex = this._getItemIndexByKey(key);
                const depth = item.metadata.treeDepth;
                const lastIndex = this._getLastItemIndex();
                for (let j = cacheIndex + 1; j <= lastIndex; j++) {
                    const newItem = this._getItem(j);
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
        _getInsertIndexFromParent(depth, insertIndex) {
            for (let i = insertIndex - 1; i >= 0; i--) {
                const newItem = this._getItem(i);
                const newDepth = newItem.metadata.treeDepth;
                if (newDepth === depth) {
                    return newItem.metadata.indexFromParent + 1;
                }
                else if (newDepth < depth) {
                    return 0;
                }
            }
            return 0;
        }
        async _expand(keys) {
            const orderedKeys = this._filterAndSortKeysByIndex(keys);
            let disregardAfterItem;
            const keySet = this.createOptimizedKeySet();
            const afterKeySet = this.createOptimizedKeySet();
            const beforeArray = [];
            const metadataArray = [];
            const dataArray = [];
            const indexArray = [];
            let disregardAfterDescendentsAddedCount;
            for (let i = 0; i < orderedKeys.length; i++) {
                const key = orderedKeys[i];
                const itemIndex = this._getItemIndexByKey(key);
                const dataProvider = this.getChildDataProvider(key);
                if (dataProvider == null) {
                    continue;
                }
                const item = this._getItem(itemIndex);
                const insertIndex = itemIndex + 1;
                const params = new this.FetchByOffsetParameters(this, 0, this._fetchSize, this._currentSortCriteria, this._currentFilterCriteria, null);
                const fetchDetails = this._getFetchDetails(0, key, item.metadata.treeDepth + 1, insertIndex, true);
                this._notDoneKeyMap.set(key, true);
                let { descendentsAddedCount } = await this._fetchChildrenByOffsetFromDataProvider(dataProvider, params, fetchDetails);
                if (!this._isKeyDone(key)) {
                    disregardAfterItem = item;
                    disregardAfterDescendentsAddedCount = descendentsAddedCount;
                    break;
                }
                let afterKey = key;
                const addedItems = this._cache.slice(insertIndex, insertIndex + descendentsAddedCount);
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
            const operationAddEventDetail = keySet.size > 0
                ? new this.DataProviderAddOperationEventDetail(this, keySet, afterKeySet, beforeArray, metadataArray, dataArray, indexArray)
                : null;
            return { operationAddEventDetail, disregardAfterItem, disregardAfterDescendentsAddedCount };
        }
        _getKeyByIndex(index) {
            return this._cache[index]?.metadata?.key ? this._cache[index].metadata.key : null;
        }
        _filterAndSortKeysByIndex(keys) {
            return [...keys]
                .reduce((filtered, key) => {
                let index = this._getItemIndexByKey(key);
                if (index != -1) {
                    filtered.push({ key, index });
                }
                return filtered;
            }, [])
                .sort((a, b) => a.index - b.index)
                .map((item) => item.key);
        }
        _collapse(keys) {
            const metadataArray = [];
            const dataArray = [];
            const indexArray = [];
            const keySet = this.createOptimizedKeySet();
            keys.forEach((key) => {
                const count = this._getLocalDescendentCount(key);
                this._notDoneKeyMap.delete(key);
                if (count > 0) {
                    const cacheIndex = this._getItemIndexByKey(key);
                    const deletedItems = this._cache.splice(cacheIndex + 1, count);
                    deletedItems.forEach((item, index) => {
                        this._notDoneKeyMap.delete(item.metadata.key);
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
