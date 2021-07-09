/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojdedupdataprovider', 'ojs/ojmutateeventfilteringdataprovider'], function (exports, ojeventtarget, CachedIteratorResultsDataProvider, DedupDataProvider, MutateEventFilteringDataProvider) { 'use strict';

    CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;
    DedupDataProvider = DedupDataProvider && Object.prototype.hasOwnProperty.call(DedupDataProvider, 'default') ? DedupDataProvider['default'] : DedupDataProvider;
    MutateEventFilteringDataProvider = MutateEventFilteringDataProvider && Object.prototype.hasOwnProperty.call(MutateEventFilteringDataProvider, 'default') ? MutateEventFilteringDataProvider['default'] : MutateEventFilteringDataProvider;

    function getEnhancedDataProvider(dataProvider, options) {
        var _a, _b, _c;
        const fetchCapability = (_a = options === null || options === void 0 ? void 0 : options.capabilities) === null || _a === void 0 ? void 0 : _a.fetchCapability;
        const dedupCapability = (_b = options === null || options === void 0 ? void 0 : options.capabilities) === null || _b === void 0 ? void 0 : _b.dedupCapability;
        const eventFilteringCapability = (_c = options === null || options === void 0 ? void 0 : options.capabilities) === null || _c === void 0 ? void 0 : _c.eventFilteringCapability;
        const dataProviderFetchCapability = dataProvider.getCapability('fetchCapability');
        const dataProviderDedupCapability = dataProvider.getCapability('dedup');
        const dataProviderEventFilteringCapability = dataProvider.getCapability('eventFiltering');
        let needsCaching = true;
        let needsDedup = true;
        let needsEventFiltering = true;
        const dataProviderFetchCapabilityCaching = dataProviderFetchCapability === null || dataProviderFetchCapability === void 0 ? void 0 : dataProviderFetchCapability.caching;
        if ((fetchCapability === null || fetchCapability === void 0 ? void 0 : fetchCapability.caching) === 'none' ||
            dataProviderFetchCapabilityCaching === 'all' ||
            dataProviderFetchCapabilityCaching === 'visitedByCurrentIterator') {
            needsCaching = false;
        }
        const dataProviderDedupCapabilityType = dataProviderDedupCapability === null || dataProviderDedupCapability === void 0 ? void 0 : dataProviderDedupCapability.type;
        if ((dedupCapability === null || dedupCapability === void 0 ? void 0 : dedupCapability.type) === 'none' ||
            dataProviderDedupCapabilityType === 'global' ||
            dataProviderDedupCapabilityType === 'iterator') {
            needsDedup = false;
        }
        const dataProviderEventFilteringCapabilityType = dataProviderEventFilteringCapability === null || dataProviderEventFilteringCapability === void 0 ? void 0 : dataProviderEventFilteringCapability.type;
        if ((eventFilteringCapability === null || eventFilteringCapability === void 0 ? void 0 : eventFilteringCapability.type) === 'none' ||
            dataProviderEventFilteringCapabilityType === 'global' ||
            dataProviderEventFilteringCapabilityType === 'iterator') {
            needsEventFiltering = false;
        }
        let wrappedDataProvider = dataProvider;
        if (needsCaching) {
            wrappedDataProvider = new CachedIteratorResultsDataProvider(wrappedDataProvider);
        }
        if (needsDedup) {
            wrappedDataProvider = new DedupDataProvider(wrappedDataProvider);
        }
        if (needsEventFiltering) {
            wrappedDataProvider = new MutateEventFilteringDataProvider(wrappedDataProvider);
        }
        if (dataProvider['getChildDataProvider']) {
            wrappedDataProvider = new EnhancedTreeDataProvider(dataProvider, wrappedDataProvider, options);
        }
        return wrappedDataProvider;
    }
    class EnhancedTreeDataProvider {
        constructor(treeDataProvider, enhancedDataProvider, options) {
            this.treeDataProvider = treeDataProvider;
            this.enhancedDataProvider = enhancedDataProvider;
            this.options = options;
            enhancedDataProvider.addEventListener(EnhancedTreeDataProvider._MUTATE, (event) => {
                this.updateCache(event);
                this.dispatchEvent(event);
            });
            enhancedDataProvider.addEventListener(EnhancedTreeDataProvider._REFRESH, (event) => {
                this.flushCache();
                this.dispatchEvent(event);
            });
            if (enhancedDataProvider.createOptimizedKeyMap) {
                this.createOptimizedKeyMap = (initialMap) => {
                    return enhancedDataProvider.createOptimizedKeyMap(initialMap);
                };
            }
            if (enhancedDataProvider.createOptimizedKeySet) {
                this.createOptimizedKeySet = (initialSet) => {
                    return enhancedDataProvider.createOptimizedKeySet(initialSet);
                };
            }
            this._mapKeyToChild = new Map();
        }
        getChildDataProvider(parentKey) {
            const enhancedDP = this._mapKeyToChild.get(parentKey);
            if (enhancedDP) {
                return enhancedDP;
            }
            else {
                return this.cacheEnhancedDataProvider(parentKey);
            }
        }
        containsKeys(parameters) {
            return this.enhancedDataProvider.containsKeys(parameters);
        }
        fetchByKeys(parameters) {
            return this.enhancedDataProvider.fetchByKeys(parameters);
        }
        fetchByOffset(parameters) {
            return this.enhancedDataProvider.fetchByOffset(parameters);
        }
        fetchFirst(parameters) {
            return this.enhancedDataProvider.fetchFirst(parameters);
        }
        getCapability(capabilityName) {
            return this.enhancedDataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this.enhancedDataProvider.getTotalSize();
        }
        isEmpty() {
            return this.enhancedDataProvider.isEmpty();
        }
        cacheEnhancedDataProvider(parentKey) {
            const childDataProvider = this.treeDataProvider.getChildDataProvider(parentKey);
            if (childDataProvider) {
                const enhancedDP = getEnhancedDataProvider(childDataProvider, this.options);
                this._mapKeyToChild.set(parentKey, enhancedDP);
                return enhancedDP;
            }
            else {
                return null;
            }
        }
        updateCache(event) {
            const remove = event.detail.remove;
            const update = event.detail.update;
            let keys;
            if (remove) {
                keys = remove.keys;
                if (keys) {
                    keys.forEach((key) => {
                        this._mapKeyToChild.delete(key);
                    });
                }
            }
            if (update) {
                keys = update.keys;
                if (keys) {
                    keys.forEach((key) => {
                        this._mapKeyToChild.delete(key);
                    });
                }
            }
        }
        flushCache() {
            this._mapKeyToChild.clear();
        }
    }
    EnhancedTreeDataProvider._REFRESH = 'refresh';
    EnhancedTreeDataProvider._MUTATE = 'mutate';
    ojeventtarget.EventTargetMixin.applyMixin(EnhancedTreeDataProvider);

    exports.getEnhancedDataProvider = getEnhancedDataProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
