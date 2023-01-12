/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojdedupdataprovider', 'ojs/ojcomponentcore', 'ojs/ojeventtarget', 'ojs/ojdataprovider'], function (oj, CachedIteratorResultsDataProvider, DedupDataProvider, ojcomponentcore, ojeventtarget, ojdataprovider) { 'use strict';

    oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
    CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;
    DedupDataProvider = DedupDataProvider && Object.prototype.hasOwnProperty.call(DedupDataProvider, 'default') ? DedupDataProvider['default'] : DedupDataProvider;

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
     * @ojhidden
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

    // end of jsdoc

    class MutateEventFilteringDataProvider {
        constructor(dataProvider) {
            var _a, _b;
            this.dataProvider = dataProvider;
            this.MutateEventFilteringAsyncIterable = (_b = class {
                    constructor(_parent, params, dataProviderAsyncIterator, cache) {
                        this._parent = _parent;
                        this.params = params;
                        this.dataProviderAsyncIterator = dataProviderAsyncIterator;
                        this.cache = cache;
                        this[_a] = () => {
                            return new this._parent.MutateEventFilteringAsyncIterator(this._parent, this.params, this.dataProviderAsyncIterator, this.cache);
                        };
                    }
                },
                _a = Symbol.asyncIterator,
                _b);
            this.MutateEventFilteringAsyncIterator = class {
                constructor(_parent, params, asyncIterator, cache) {
                    this._parent = _parent;
                    this.params = params;
                    this.asyncIterator = asyncIterator;
                    this.cache = cache;
                }
                ['next']() {
                    var _b;
                    let self = this;
                    const signal = (_b = this.params) === null || _b === void 0 ? void 0 : _b.signal;
                    if (signal && signal.aborted) {
                        const reason = signal.reason;
                        return Promise.reject(new DOMException(reason, 'AbortError'));
                    }
                    return new Promise((resolve, reject) => {
                        if (signal) {
                            const reason = signal.reason;
                            signal.addEventListener('abort', (e) => {
                                return reject(new DOMException(reason, 'AbortError'));
                            });
                        }
                        return resolve(this.asyncIterator.next().then((result) => {
                            if (!(self._parent.dataProvider instanceof CachedIteratorResultsDataProvider) &&
                                !(self._parent.dataProvider instanceof DedupDataProvider)) {
                                self._parent.cache.addListResult(result);
                            }
                            return result;
                        }));
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
            dataProvider.addEventListener(MutateEventFilteringDataProvider._REFRESH, (event) => {
                self.cache.reset();
                self.dispatchEvent(event);
            });
        }
        containsKeys(params) {
            return this.dataProvider.containsKeys(params);
        }
        fetchByKeys(params) {
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            if (signal && signal.aborted) {
                const reason = signal.reason;
                return Promise.reject(new DOMException(reason, 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                if (signal) {
                    const reason = signal.reason;
                    signal.addEventListener('abort', (e) => {
                        return reject(new DOMException(reason, 'AbortError'));
                    });
                }
                return resolve(this.dataProvider.fetchByKeys(params));
            });
        }
        fetchByOffset(params) {
            const signal = params === null || params === void 0 ? void 0 : params.signal;
            if (signal && signal.aborted) {
                const reason = signal.reason;
                return Promise.reject(new DOMException(reason, 'AbortError'));
            }
            return new Promise((resolve, reject) => {
                if (signal) {
                    const reason = signal.reason;
                    signal.addEventListener('abort', (e) => {
                        return reject(new DOMException(reason, 'AbortError'));
                    });
                }
                return resolve(this.dataProvider.fetchByOffset(params));
            });
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
                        keyArray.splice(keyIndex, 1);
                        if (detailClone.data) {
                            detailClone.data.splice(keyIndex, 1);
                        }
                        if (detailClone.indexes) {
                            detailClone.indexes.splice(keyIndex, 1);
                        }
                        if (detailClone.metadata) {
                            detailClone.metadata.splice(keyIndex, 1);
                        }
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
    ojeventtarget.EventTargetMixin.applyMixin(MutateEventFilteringDataProvider);
    oj._registerLegacyNamespaceProp('MutateEventFilteringDataProvider', MutateEventFilteringDataProvider);

    return MutateEventFilteringDataProvider;

});
