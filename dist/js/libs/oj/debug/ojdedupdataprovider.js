/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovider', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget'], function(oj, $, __DataProvider, CachedIteratorResultsDataProvider)
{
  "use strict";

class DedupDataProvider {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        this.DedupAsyncIterable = class {
            constructor(_parent, params, dataProviderAsyncIterator, cache) {
                this._parent = _parent;
                this.params = params;
                this.dataProviderAsyncIterator = dataProviderAsyncIterator;
                this.cache = cache;
                this[Symbol.asyncIterator] = () => {
                    return new this._parent.DedupAsyncIterator(this._parent, this.params, this.dataProviderAsyncIterator, this.cache);
                };
            }
        };
        this.DedupAsyncIterator = class {
            constructor(_parent, params, asyncIterator, cache) {
                this._parent = _parent;
                this.params = params;
                this.asyncIterator = asyncIterator;
                this.cache = cache;
                this._cachedOffset = 0;
            }
            ['next']() {
                let self = this;
                let cachedKeys = new Set();
                if (this.params.size > 0) {
                    // de-dup by checking if the cache already contains the row. If so then
                    // publish a delete mutation for the old one first.
                    // we only want to do this if we are iteratively fetching blocks.
                    // fetching everything with size = -1 is covered by block deduping.
                    let cachedFetchByOffsetResults = this._parent.cache.getDataByOffset({
                        offset: 0,
                        size: this._cachedOffset
                    });
                    cachedFetchByOffsetResults.results.forEach(function (item) {
                        cachedKeys.add(item.metadata.key);
                    });
                }
                return this.asyncIterator.next().then((result) => {
                    let value = result[DedupDataProvider._VALUE];
                    let keys = value.metadata.map(function (value) {
                        return value[DedupDataProvider._KEY];
                    });
                    this._cachedOffset = this._cachedOffset + keys.length;
                    let fetchKeys = new Set();
                    keys.forEach(function (key) {
                        fetchKeys.add(key);
                    });
                    let removeKeysArray = [];
                    let removeDataArray = [];
                    let removeMetadataArray = [];
                    fetchKeys.forEach(function (fetchKey, index) {
                        if (cachedKeys.has(fetchKey)) {
                            removeKeysArray.push(fetchKey);
                            removeDataArray.push(value.data[index]);
                            removeMetadataArray.push(value.metadata[index]);
                        }
                    });
                    if (removeKeysArray.length > 0) {
                        let removekeySet = new Set();
                        removeKeysArray.map(function (key) {
                            removekeySet.add(key);
                        });
                        let operationRemoveEventDetail = new self._parent.DataProviderOperationEventDetail(self._parent, removekeySet, removeMetadataArray, removeDataArray, []);
                        let mutationRemoveEventDetail = new self._parent.DataProviderMutationEventDetail(self._parent, null, operationRemoveEventDetail, null);
                        self._parent.dispatchEvent(new oj.DataProviderMutationEvent(mutationRemoveEventDetail));
                    }
                    // if it's our cache then update it
                    if (!(self._parent.dataProvider instanceof CachedIteratorResultsDataProvider)) {
                        self._parent.cache.addListResult(result);
                    }
                    return result;
                });
            }
        };
        this.DataProviderMutationEventDetail = class {
            constructor(_parent, add, remove, update) {
                this._parent = _parent;
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[DedupDataProvider._ADD] = add;
                this[DedupDataProvider._REMOVE] = remove;
                this[DedupDataProvider._UPDATE] = update;
            }
        };
        this.DataProviderOperationEventDetail = class {
            constructor(_parent, keys, metadata, data, indexes) {
                this._parent = _parent;
                this.keys = keys;
                this.metadata = metadata;
                this.data = data;
                this.indexes = indexes;
                this[DedupDataProvider._KEYS] = keys;
                this[DedupDataProvider._METADATA] = metadata;
                this[DedupDataProvider._DATA] = data;
                this[DedupDataProvider._INDEXES] = indexes;
            }
        };
        let self = this;
        if (dataProvider instanceof CachedIteratorResultsDataProvider) {
            this.cache = dataProvider.cache;
        }
        else {
            this.cache = new __DataProvider.DataCache();
        }
        // Add createOptimizedKeyMap method to this DataProvider if the wrapped DataProvider supports it
        if (dataProvider.createOptimizedKeyMap) {
            this.createOptimizedKeyMap = (initialMap) => {
                return dataProvider.createOptimizedKeyMap(initialMap);
            };
        }
        // Add createOptimizedKeySet method to this DataProvider if the wrapped DataProvider supports it
        if (dataProvider.createOptimizedKeySet) {
            this.createOptimizedKeySet = (initialSet) => {
                return dataProvider.createOptimizedKeySet(initialSet);
            };
        }
        // Listen to mutate event on wrapped DataProvider
        dataProvider.addEventListener(DedupDataProvider._MUTATE, (event) => {
            if (event.detail && event.detail.add) {
                // de-dup add mutations
                this._processAddMutations(event.detail.add);
            }
            self.dispatchEvent(event);
        });
        // Listen to refresh event on wrapped DataProvider
        dataProvider.addEventListener(DedupDataProvider._REFRESH, (event) => {
            // Invalidate the cache on refresh event
            self.cache.reset();
            self.dispatchEvent(event);
        });
    }
    containsKeys(params) {
        return this.dataProvider.containsKeys(params);
    }
    fetchByKeys(params) {
        return this.dataProvider.fetchByKeys(params);
    }
    fetchByOffset(params) {
        return this.dataProvider.fetchByOffset(params);
    }
    fetchFirst(params) {
        const asyncIterable = this.dataProvider.fetchFirst(params);
        return new this.DedupAsyncIterable(this, params, asyncIterable[Symbol.asyncIterator](), this.cache);
    }
    getCapability(capabilityName) {
        let capability = this.dataProvider.getCapability(capabilityName);
        if (capabilityName === 'dedup') {
            return { type: 'iterator' };
        }
        return capability;
    }
    getTotalSize() {
        return this.dataProvider.getTotalSize();
    }
    isEmpty() {
        return this.dataProvider.isEmpty();
    }
    _processAddMutations(detail) {
        let self = this;
        let eventDetailKeys = detail[DedupDataProvider._KEYS];
        if (eventDetailKeys && eventDetailKeys.size > 0) {
            // check if the cache contains the key. If it does then dispatch a remove to remove them
            let removeKeys = new Set();
            let removeDataArray = [];
            let removeMetadataArray = [];
            let value = this.cache.getDataByKeys({ keys: eventDetailKeys });
            value.results.forEach(function (item, key) {
                removeKeys.add(key);
                removeDataArray.push(item.data);
                removeMetadataArray.push(item.metadata);
            });
            if (removeKeys.size > 0) {
                let operationRemoveEventDetail = new self.DataProviderOperationEventDetail(self, removeKeys, removeMetadataArray, removeDataArray, []);
                let mutationRemoveEventDetail = new self.DataProviderMutationEventDetail(self, null, operationRemoveEventDetail, null);
                self.dispatchEvent(new oj.DataProviderMutationEvent(mutationRemoveEventDetail));
            }
        }
    }
}
DedupDataProvider._KEY = 'key';
DedupDataProvider._KEYS = 'keys';
DedupDataProvider._DATA = 'data';
DedupDataProvider._METADATA = 'metadata';
DedupDataProvider._ITEMS = 'items';
DedupDataProvider._FROM = 'from';
DedupDataProvider._OFFSET = 'offset';
DedupDataProvider._REFRESH = 'refresh';
DedupDataProvider._MUTATE = 'mutate';
DedupDataProvider._SIZE = 'size';
DedupDataProvider._FETCHPARAMETERS = 'fetchParameters';
DedupDataProvider._VALUE = 'value';
DedupDataProvider._DONE = 'done';
DedupDataProvider._RESULTS = 'results';
DedupDataProvider._ADD = 'add';
DedupDataProvider._UPDATE = 'update';
DedupDataProvider._REMOVE = 'remove';
DedupDataProvider._INDEXES = 'indexes';
oj['DedupDataProvider'] = DedupDataProvider;
oj.DedupDataProvider = DedupDataProvider;
oj.EventTargetMixin.applyMixin(DedupDataProvider);


/**
 * @preserve Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */

/* jslint browser: true,devel:true*/
/**
 *
 * @since 9.1.0
 * @export
 * @final
 * @class DedupDataProvider
 * @implements DataProvider
 * @classdesc This is an internal wrapper class meant to be used by JET collection component to provide de-duping.
 * @param {DataProvider} dataProvider the DataProvider.
 * @ojsignature [{target: "Type",
 *               value: "class DedupDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "DedupDataProvider<K, D> | DataProvider<K, D>",
 *               for: "dataProvider"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof DedupDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * End of jsdoc
 */

  return DedupDataProvider
});