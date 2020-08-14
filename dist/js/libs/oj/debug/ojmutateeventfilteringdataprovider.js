/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojdataprovider', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojdedupdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget'], function(oj, $, __DataProvider, CachedIteratorResultsDataProvider, DedupDataProvider)
{
  "use strict";

class MutateEventFilteringDataProvider {
    constructor(dataProvider) {
        this.dataProvider = dataProvider;
        this.MutateEventFilteringAsyncIterable = class {
            constructor(_parent, params, dataProviderAsyncIterator, cache) {
                this._parent = _parent;
                this.params = params;
                this.dataProviderAsyncIterator = dataProviderAsyncIterator;
                this.cache = cache;
                this[Symbol.asyncIterator] = () => {
                    return new this._parent.MutateEventFilteringAsyncIterator(this._parent, this.params, this.dataProviderAsyncIterator, this.cache);
                };
            }
        };
        this.MutateEventFilteringAsyncIterator = class {
            constructor(_parent, params, asyncIterator, cache) {
                this._parent = _parent;
                this.params = params;
                this.asyncIterator = asyncIterator;
                this.cache = cache;
            }
            ['next']() {
                let self = this;
                return this.asyncIterator.next().then((result) => {
                    if (!(self._parent.dataProvider instanceof CachedIteratorResultsDataProvider) &&
                        !(self._parent.dataProvider instanceof DedupDataProvider)) {
                        self._parent.cache.addListResult(result);
                    }
                    return result;
                });
            }
        };
        this.DataProviderMutationEventDetail = class {
            constructor(add, remove, update) {
                this.add = add;
                this.remove = remove;
                this.update = update;
                this[MutateEventFilteringDataProvider._ADD] = add;
                this[MutateEventFilteringDataProvider._REMOVE] = remove;
                this[MutateEventFilteringDataProvider._UPDATE] = update;
            }
        };
        let self = this;
        if (dataProvider instanceof CachedIteratorResultsDataProvider) {
            this.cache = dataProvider.cache;
        }
        else if (dataProvider instanceof DedupDataProvider) {
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
        dataProvider.addEventListener(MutateEventFilteringDataProvider._MUTATE, (event) => {
            if (event.detail) {
                let removeDetail = self._processMutations(event.detail.remove);
                let updateDetail = self._processMutations(event.detail.update);
                if ((removeDetail && removeDetail.keys && removeDetail.keys.size > 0) ||
                    (updateDetail && updateDetail.keys && updateDetail.keys.size > 0) ||
                    (event.detail.add && event.detail.add.keys && event.detail.add.keys.size > 0)) {
                    let mutationEventDetail = new self.DataProviderMutationEventDetail(event.detail.add, removeDetail, updateDetail);
                    let eventClone = Object.assign({}, event);
                    eventClone.detail = mutationEventDetail;
                    self.dispatchEvent(eventClone);
                }
            }
            else {
                self.dispatchEvent(event);
            }
        });
        // Listen to refresh event on wrapped DataProvider
        dataProvider.addEventListener(MutateEventFilteringDataProvider._REFRESH, (event) => {
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
        return new this.MutateEventFilteringAsyncIterable(this, params, asyncIterable[Symbol.asyncIterator](), this.cache);
    }
    getCapability(capabilityName) {
        let capability = this.dataProvider.getCapability(capabilityName);
        if (capabilityName === 'eventFiltering') {
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
    _processMutations(detail) {
        let self = this;
        if (detail) {
            let eventDetailKeys = detail[MutateEventFilteringDataProvider._KEYS];
            if (eventDetailKeys && eventDetailKeys.size > 0) {
                // check if the cache contains the key
                let removeKeys = new Set();
                let value = this.cache.getDataByKeys({ keys: eventDetailKeys });
                eventDetailKeys.forEach(function (key) {
                    if (!value.results.has(key)) {
                        removeKeys.add(key);
                    }
                });
                let detailClone = Object.assign({}, detail);
                removeKeys.forEach(function (key) {
                    let keyArray = [];
                    detailClone.keys.forEach(function (val) {
                        keyArray.push(val);
                    });
                    let keyIndex = keyArray.indexOf(key);
                    detailClone.keys.delete(key);
                    delete detailClone.data[keyIndex];
                    delete detailClone.indexes[keyIndex];
                    delete detailClone.metadata[keyIndex];
                });
                return detailClone;
            }
        }
        return detail;
    }
}
MutateEventFilteringDataProvider._KEY = 'key';
MutateEventFilteringDataProvider._KEYS = 'keys';
MutateEventFilteringDataProvider._DATA = 'data';
MutateEventFilteringDataProvider._METADATA = 'metadata';
MutateEventFilteringDataProvider._ITEMS = 'items';
MutateEventFilteringDataProvider._FROM = 'from';
MutateEventFilteringDataProvider._OFFSET = 'offset';
MutateEventFilteringDataProvider._REFRESH = 'refresh';
MutateEventFilteringDataProvider._MUTATE = 'mutate';
MutateEventFilteringDataProvider._SIZE = 'size';
MutateEventFilteringDataProvider._FETCHPARAMETERS = 'fetchParameters';
MutateEventFilteringDataProvider._VALUE = 'value';
MutateEventFilteringDataProvider._DONE = 'done';
MutateEventFilteringDataProvider._RESULTS = 'results';
MutateEventFilteringDataProvider._ADD = 'add';
MutateEventFilteringDataProvider._UPDATE = 'update';
MutateEventFilteringDataProvider._REMOVE = 'remove';
MutateEventFilteringDataProvider._INDEXES = 'indexes';
oj['MutateEventFilteringDataProvider'] = MutateEventFilteringDataProvider;
oj.MutateEventFilteringDataProvider = MutateEventFilteringDataProvider;
oj.EventTargetMixin.applyMixin(MutateEventFilteringDataProvider);


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
 * @class MutateEventFilteringDataProvider
 * @implements DataProvider
 * @classdesc This is an internal wrapper class meant to be used by JET collection components to provide mutation event filtering.
 * @param {DataProvider} dataProvider the DataProvider.
 * @ojsignature [{target: "Type",
 *               value: "class MutateEventFilteringDataProvider<K, D> implements DataProvider<K, D>",
 *               genericParameters: [{"name": "K", "description": "Type of Key"}, {"name": "D", "description": "Type of Data"}]},
 *               {target: "Type",
 *               value: "MutateEventFilteringDataProvider<K, D> | DataProvider<K, D>",
 *               for: "dataProvider"}]
 * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider", "SortCriterion", "FetchByKeysParameters",
 * "ContainsKeysResults","FetchByKeysResults","FetchByOffsetParameters","FetchByOffsetResults",
 * "FetchListResult","FetchListParameters"]}
 * @ojtsmodule
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name containsKeys
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name createOptimizedKeySet
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name createOptimizedKeyMap
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name fetchFirst
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name fetchByKeys
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name fetchByOffset
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name getCapability
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name getTotalSize
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name isEmpty
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name addEventListener
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name removeEventListener
 */

/**
 * @inheritdoc
 * @memberof MutateEventFilteringDataProvider
 * @instance
 * @method
 * @name dispatchEvent
 */

/**
 * End of jsdoc
 */

  return MutateEventFilteringDataProvider;
});