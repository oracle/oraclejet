/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget', 'ojs/ojrestdataprovider', 'ojs/ojdataprovider', 'ojs/ojcomponentcore'], function (exports, ojeventtarget, ojrestdataprovider, ojdataprovider, ojcomponentcore) { 'use strict';

    class RESTTreeDataProvider {
        constructor(options) {
            var _a;
            this.options = options;
            this.TreeAsyncIterator = class {
                constructor(_rootDataProvider, _baseIterable) {
                    this._rootDataProvider = _rootDataProvider;
                    this._baseIterable = _baseIterable;
                }
                async ['next']() {
                    const result = await this._baseIterable[Symbol.asyncIterator]().next();
                    for (let i = 0; i < result.value.data.length; i++) {
                        this._rootDataProvider._setMapEntry(result.value.metadata[i].key, {
                            data: result.value.data[i],
                            metadata: result.value.metadata[i]
                        });
                    }
                    return result;
                }
            };
            this.TreeAsyncIterable = (_a = class {
                    constructor(_asyncIterator) {
                        this._asyncIterator = _asyncIterator;
                        this[Symbol.asyncIterator] = () => {
                            return this._asyncIterator;
                        };
                    }
                },
                Symbol.asyncIterator,
                _a);
            this._baseDataProvider = new ojrestdataprovider.RESTDataProvider(options);
            this._mapKeyToItem = new Map();
        }
        fetchFirst(fetchParameters) {
            const baseIterable = this._baseDataProvider.fetchFirst(fetchParameters);
            const rootDataProvider = this._getRootDataProvider();
            return new this.TreeAsyncIterable(new this.TreeAsyncIterator(rootDataProvider, baseIterable));
        }
        async fetchByKeys(parameters) {
            const unCachedKeys = new Set();
            const results = new Map();
            parameters.keys.forEach((key) => {
                const item = this._getItemFromKey(key);
                if (item) {
                    results.set(key, item);
                }
                else {
                    unCachedKeys.add(key);
                }
            });
            if (unCachedKeys.size) {
                const fetchByKeysResult = await this._baseDataProvider.fetchByKeys({
                    ...parameters,
                    keys: unCachedKeys
                });
                fetchByKeysResult.results.forEach((item) => {
                    this._setMapEntry(item.metadata.key, item);
                    results.set(item.metadata.key, item);
                });
            }
            return {
                fetchParameters: parameters,
                results
            };
        }
        async fetchByOffset(parameters) {
            const fetchByOffsetResult = await this._baseDataProvider.fetchByOffset(parameters);
            fetchByOffsetResult.results.forEach((item) => {
                this._setMapEntry(item.metadata.key, item);
            });
            return fetchByOffsetResult;
        }
        async containsKeys(containsParameters) {
            return this._baseDataProvider.containsKeys(containsParameters);
        }
        createOptimizedKeySet(initialSet) {
            return this._baseDataProvider.createOptimizedKeySet(initialSet);
        }
        createOptimizedKeyMap(initialMap) {
            return this._baseDataProvider.createOptimizedKeyMap(initialMap);
        }
        isEmpty() {
            return this._baseDataProvider.isEmpty();
        }
        getCapability(capabilityName) {
            return this._baseDataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this._baseDataProvider.getTotalSize();
        }
        refresh() {
            this._flushMaps();
            this.dispatchEvent(new ojdataprovider.DataProviderRefreshEvent());
        }
        mutate(detail) {
            this._addMetadataToMutationEventDetail(detail);
            if (detail.remove) {
                this._updateMapFromMutationDetail('remove', detail.remove);
            }
            if (detail.add) {
                this._updateMapFromMutationDetail('add', detail.add);
            }
            if (detail.update) {
                this._updateMapFromMutationDetail('update', detail.update);
            }
            this._baseDataProvider.mutate(detail);
            this.dispatchEvent(new ojdataprovider.DataProviderMutationEvent(detail));
        }
        getChildDataProvider(key) {
            const item = this._getItemFromKey(key);
            const dataprovider = this.options.getChildDataProvider(item);
            if (!dataprovider) {
                return null;
            }
            return ojcomponentcore.DataProviderFeatureChecker.isTreeDataProvider(dataprovider)
                ? dataprovider
                : new TreeDataProviderWrapper(dataprovider);
        }
        _getItemFromKey(key) {
            const rootDataProvider = this._getRootDataProvider();
            return rootDataProvider._mapKeyToItem.get(key);
        }
        _setMapEntry(key, item) {
            const rootDataProvider = this._getRootDataProvider();
            const currentValue = rootDataProvider._mapKeyToItem.get(key);
            if (currentValue) {
                rootDataProvider._mapKeyToItem.set(key, {
                    data: { ...currentValue.data, ...item.data },
                    metadata: { ...currentValue.metadata, ...item.metadata }
                });
            }
            else {
                rootDataProvider._mapKeyToItem.set(key, item);
            }
        }
        _deleteMapEntry(key) {
            const rootDataProvider = this._getRootDataProvider();
            rootDataProvider._mapKeyToItem.delete(key);
        }
        _flushMaps() {
            const rootDataProvider = this._getRootDataProvider();
            rootDataProvider._mapKeyToItem.clear();
        }
        _getRootDataProvider() {
            if (this.options.rootDataProvider) {
                return this.options.rootDataProvider;
            }
            return this;
        }
        _addMetadataToMutationEventDetail(detail) {
            Object.keys(detail).forEach((operation) => {
                if (!detail[operation].metadata ||
                    (detail[operation].metadata && !detail[operation].metadata.length)) {
                    detail[operation].metadata = [];
                    detail[operation].keys.forEach((key) => {
                        detail[operation].metadata.push({ key });
                    });
                }
            });
        }
        _updateMapFromMutationDetail(operation, detail) {
            if (operation === 'remove') {
                detail.keys.forEach((key) => {
                    this._deleteMapEntry(key);
                });
            }
            else {
                const data = detail.data;
                const metadata = detail.metadata;
                if (Array.isArray(data) && Array.isArray(metadata)) {
                    for (let i = 0; i < data.length; i++) {
                        this._setMapEntry(metadata[i].key, { data: data[i], metadata: metadata[i] });
                    }
                }
                else if (Array.isArray(metadata)) {
                    for (let i = 0; i < metadata.length; i++) {
                        const item = this._getItemFromKey(metadata[i].key);
                        if (item) {
                            this._setMapEntry(metadata[i].key, { data: item.data, metadata: metadata[i] });
                        }
                    }
                }
            }
        }
    }
    class TreeDataProviderWrapper {
        constructor(dataprovider) {
            this.dataprovider = dataprovider;
        }
        fetchFirst(parameters) {
            return this.dataprovider.fetchFirst(parameters);
        }
        async fetchByKeys(fetchParameters) {
            return this.dataprovider.fetchByKeys(fetchParameters);
        }
        async fetchByOffset(fetchParameters) {
            return this.dataprovider.fetchByOffset(fetchParameters);
        }
        async containsKeys(parameters) {
            return this.dataprovider.containsKeys(parameters);
        }
        createOptimizedKeySet(initialSet) {
            return this.dataprovider.createOptimizedKeySet(initialSet);
        }
        createOptimizedKeyMap(initialMap) {
            return this.dataprovider.createOptimizedKeyMap(initialMap);
        }
        isEmpty() {
            const isEmpty = this.dataprovider.isEmpty();
            if (isEmpty === 'yes') {
                return 'yes';
            }
            else if (isEmpty === 'no') {
                return 'no';
            }
            return 'unknown';
        }
        getCapability(capabilityName) {
            return this.dataprovider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this.dataprovider.getTotalSize();
        }
        getChildDataProvider(key) {
            return null;
        }
        addEventListener(event, listener) {
            this.dataprovider.addEventListener(event, listener);
        }
        removeEventListener(event, listener) {
            this.dataprovider.removeEventListener(event, listener);
        }
        dispatchEvent(event) {
            return this.dataprovider.dispatchEvent(event);
        }
    }
    ojeventtarget.EventTargetMixin.applyMixin(RESTTreeDataProvider);

    exports.RESTTreeDataProvider = RESTTreeDataProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
