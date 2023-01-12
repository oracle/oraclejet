/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojdataprovider', 'ojs/ojeventtarget', 'ojs/ojcachediteratorresultsdataprovider'], function (oj, ojdataprovider, ojeventtarget, CachedIteratorResultsDataProvider) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;

    /**
     * @license
     * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
     * Licensed under The Universal Permissive License (UPL), Version 1.0
     * @ignore
     */
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
     * @ojhidden
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

    // end of jsdoc

    class DedupDataProvider {
        constructor(dataProvider) {
            var _a, _b;
            this.dataProvider = dataProvider;
            this.DedupAsyncIterable = (_b = class {
                    constructor(_parent, params, dataProviderAsyncIterator, cache) {
                        this._parent = _parent;
                        this.params = params;
                        this.dataProviderAsyncIterator = dataProviderAsyncIterator;
                        this.cache = cache;
                        this[_a] = () => {
                            return new this._parent.DedupAsyncIterator(this._parent, this.params, this.dataProviderAsyncIterator, this.cache);
                        };
                    }
                },
                _a = Symbol.asyncIterator,
                _b);
            this.DedupAsyncIterator = class {
                constructor(_parent, params, asyncIterator, cache) {
                    this._parent = _parent;
                    this.params = params;
                    this.asyncIterator = asyncIterator;
                    this.cache = cache;
                    this._cachedOffset = 0;
                }
                ['next']() {
                    const cachedKeys = new Set();
                    if (this.params.size > 0) {
                        const cachedFetchByOffsetResults = this._parent.cache.getDataByOffset({
                            offset: 0,
                            size: this._cachedOffset
                        });
                        cachedFetchByOffsetResults.results.forEach((item) => {
                            cachedKeys.add(item.metadata.key);
                        });
                    }
                    return this.asyncIterator.next().then((result) => {
                        const value = result[DedupDataProvider._VALUE];
                        const keys = value.metadata.map((value) => {
                            return value[DedupDataProvider._KEY];
                        });
                        this._cachedOffset = this._cachedOffset + keys.length;
                        const fetchKeys = new Set();
                        keys.forEach((key) => {
                            fetchKeys.add(key);
                        });
                        const removeKeysArray = [];
                        const removeDataArray = [];
                        const removeMetadataArray = [];
                        fetchKeys.forEach((fetchKey, index) => {
                            if (cachedKeys.has(fetchKey)) {
                                removeKeysArray.push(fetchKey);
                                removeDataArray.push(value.data[index]);
                                removeMetadataArray.push(value.metadata[index]);
                            }
                        });
                        if (removeKeysArray.length > 0) {
                            const removekeySet = new Set();
                            for (const key of removeKeysArray) {
                                removekeySet.add(key);
                            }
                            const operationRemoveEventDetail = new this._parent.DataProviderOperationEventDetail(this._parent, removekeySet, removeMetadataArray, removeDataArray, []);
                            const mutationRemoveEventDetail = new this._parent.DataProviderMutationEventDetail(this._parent, null, operationRemoveEventDetail, null);
                            this._parent.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationRemoveEventDetail));
                        }
                        if (!(this._parent.dataProvider instanceof CachedIteratorResultsDataProvider)) {
                            this._parent.cache.addListResult(result);
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
            if (dataProvider instanceof CachedIteratorResultsDataProvider) {
                this.cache = dataProvider.cache;
            }
            else {
                this.cache = new oj.DataCache();
            }
            if (dataProvider.createOptimizedKeyMap) {
                this.createOptimizedKeyMap = (initialMap) => {
                    return dataProvider.createOptimizedKeyMap(initialMap);
                };
            }
            if (dataProvider.createOptimizedKeySet) {
                this.createOptimizedKeySet = (initialSet) => {
                    return dataProvider.createOptimizedKeySet(initialSet);
                };
            }
            dataProvider.addEventListener(DedupDataProvider._MUTATE, (event) => {
                if (event.detail && event.detail.add) {
                    this._processAddMutations(event.detail.add);
                }
                this.dispatchEvent(event);
            });
            dataProvider.addEventListener(DedupDataProvider._REFRESH, (event) => {
                this.cache.reset();
                this.dispatchEvent(event);
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
            const capability = this.dataProvider.getCapability(capabilityName);
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
            const eventDetailKeys = detail[DedupDataProvider._KEYS];
            if (eventDetailKeys && eventDetailKeys.size > 0) {
                const removeKeys = new Set();
                const removeDataArray = [];
                const removeMetadataArray = [];
                const value = this.cache.getDataByKeys({ keys: eventDetailKeys });
                value.results.forEach((item, key) => {
                    removeKeys.add(key);
                    removeDataArray.push(item.data);
                    removeMetadataArray.push(item.metadata);
                });
                if (removeKeys.size > 0) {
                    const operationRemoveEventDetail = new this.DataProviderOperationEventDetail(this, removeKeys, removeMetadataArray, removeDataArray, []);
                    const mutationRemoveEventDetail = new this.DataProviderMutationEventDetail(this, null, operationRemoveEventDetail, null);
                    this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(mutationRemoveEventDetail));
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
    ojeventtarget.EventTargetMixin.applyMixin(DedupDataProvider);
    oj._registerLegacyNamespaceProp('DedupDataProvider', DedupDataProvider);

    return DedupDataProvider;

});
