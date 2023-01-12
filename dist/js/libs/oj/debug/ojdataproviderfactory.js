/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget', 'ojs/ojcachediteratorresultsdataprovider', 'ojs/ojdedupdataprovider', 'ojs/ojmutateeventfilteringdataprovider'], function (exports, ojeventtarget, CachedIteratorResultsDataProvider, DedupDataProvider, MutateEventFilteringDataProvider) { 'use strict';

    CachedIteratorResultsDataProvider = CachedIteratorResultsDataProvider && Object.prototype.hasOwnProperty.call(CachedIteratorResultsDataProvider, 'default') ? CachedIteratorResultsDataProvider['default'] : CachedIteratorResultsDataProvider;
    DedupDataProvider = DedupDataProvider && Object.prototype.hasOwnProperty.call(DedupDataProvider, 'default') ? DedupDataProvider['default'] : DedupDataProvider;
    MutateEventFilteringDataProvider = MutateEventFilteringDataProvider && Object.prototype.hasOwnProperty.call(MutateEventFilteringDataProvider, 'default') ? MutateEventFilteringDataProvider['default'] : MutateEventFilteringDataProvider;

    /**
     *
     * @ojmodulecontainer ojdataproviderfactory
     * @ojtsmodule
     * @ojhidden
     * @since 12.0.0
     *
     * @ojtsimport {module: "ojdataprovider", type: "AMD", imported: ["DataProvider"]}
     * @ojtsimport {module: "ojtreedataprovider", type: "AMD", importName: ["TreeDataProvider"]}
     *
     * @classdesc
     * <p>This module contains a utility function <code>getEnhancedDataProvider()</code> that enhances a base DataProvier with additional capabilities.
     * </p>
     * <p>The additional capabilites available are:
     * <ul>
     * <li>Caching - the wrapper DataProvider caches the results returned by the iterators of the base DataProvider.
     * The wrapper DataProvider then optimizes fetch methods such as fetchByKeys, fetchByOffset, and containsKeys to retrieve data from cached items
     * before calling the base DataProvider's methods for any missing data.
     * </li>
     * <li>Mutate event filtering - the wrapper DataProvider excludes details of mutate events from the base DataProvider
     * that are not within the range of items previously returned by its iterators.
     * </li>
     * </ul>
     * <p>
     *
     */

    /**
     *
     * Utility function that enhances a base DataProvier with additional capabilities by wrapping it in other DataProviders.
     *
     * @ojexports
     * @memberof ojdataproviderfactory
     * @method
     * @name getEnhancedDataProvider
     * @param {Object} dataProvider - The base DataProvider to enhance.
     * <p>If this is a TreeDataProvider, the base DataProvider and each DataProvider returned by getChildDataProvider will be enhanced.</p>
     * @param {Object} capabilityConfigurations - Capabilities being requested.  The capabilities of the base DataProvider will be checked
     * to see if it already supports at least the requested capabilities.  Any capability it doesn't support will be provided by wrapping DataProviders.
     * <p>For example, if "visitedByCurrentIterator" caching is requested for the fetchFirst capability, and the base DataProvider already supports "all"
     * or "visitedByCurrentIterator" caching, there is no need to wrap it.</p>
     * @return {Object} The outermost wrapping DataProvider.  This may be the base DataProvider itself if it already supports all of the requested capabilities.
     * @ojsignature [{target: "Type", value:"<K, D>", for: "genericTypeParameters"},
     *              {target: "Type", value:"DataProvider<K, D>", for:"dataProvider"},
     *              {target: "Type", value:"CapabilityConfigurations", for:"capabilityConfigurations"},
     *              {target: "Type", value:"DataProvider<K, D>", for:"returns"}]
     */

    /**
     *
     * @ojexports
     * @memberof ojdataproviderfactory
     * @typedef {Object} CapabilityConfigurations
     * @property {Object=} fetchFirst - If "visitedByCurrentIterator" is specified for the "caching" property, enhance the base DataProvider
     * to cache the results returned by its iterators.  Cached results, if available, can be returned when fetchByKeys, fetchByOffset, or
     * containsKeys is called on the enhanced DataProvider.
     * <p>If "exact" is specified for the "totalFilteredRowCount" property, enhance the base DataProvider to include totalFilteredRowCount in the iterator
     * results.  Note that this enhancement can be expensive because all rows will be iterated to determine totalFilteredRowCount.</p>
     * @property {Object=} eventFiltering - If "iterator" is specified for the "type" property, enhance the base DataProvider to filter mutate
     * events to hide items that are not within range of items that have been returned by its iterators.
     * @ojsignature [
     *  {target: "Type", value: '{caching?: "visitedByCurrentIterator", totalFilteredRowCount?: "exact"}', for: "fetchFirst", jsdocOverride: true},
     *  {target: "Type", value: '{type?: "iterator"}', for: "eventFiltering", jsdocOverride: true}]
     *
     * @ojtsexample <caption>Using getEnhancedDataProvider() to retrieve a wrapper DataProvider with mutate event filtering capability</caption>
     * const enhancedDataProvider = getEnhancedDataProvider(baseDataProvider,
     *   {
     *     eventFiltering: {type: "iterator"},
     *   }
     * );
     *
     * @ojtsexample <caption>Using getEnhancedDataProvider() to retrieve a wrapper DataProvider with caching capability</caption>
     * const enhancedDataProvider = getEnhancedDataProvider(baseDataProvider,
     *   {
     *     fetchFirst: {caching: "visitedByCurrentIterator"}
     *   }
     * );
     *
     * @ojtsexample <caption>Using getEnhancedDataProvider() to retrieve a wrapper DataProvider with all capabilities</caption>
     * const enhancedDataProvider = getEnhancedDataProvider(baseDataProvider,
     *   {
     *     eventFiltering: {type: "iterator"},
     *     fetchFirst: {caching: "visitedByCurrentIterator"}
     *   }
     * );
     */

    function getEnhancedDataProvider(dataProvider, capabilityConfigurations) {
        const fetchCapability = capabilityConfigurations === null || capabilityConfigurations === void 0 ? void 0 : capabilityConfigurations.fetchFirst;
        const dedupCapability = capabilityConfigurations === null || capabilityConfigurations === void 0 ? void 0 : capabilityConfigurations.dedup;
        const eventFilteringCapability = capabilityConfigurations === null || capabilityConfigurations === void 0 ? void 0 : capabilityConfigurations.eventFiltering;
        const dataProviderFetchCapability = dataProvider.getCapability('fetchFirst') || dataProvider.getCapability('fetchCapability');
        const dataProviderDedupCapability = dataProvider.getCapability('dedup');
        const dataProviderEventFilteringCapability = dataProvider.getCapability('eventFiltering');
        let needsCaching = false;
        let needsRowCount = false;
        let needsDedup = false;
        let needsEventFiltering = false;
        const dataProviderFetchCapabilityCaching = dataProviderFetchCapability === null || dataProviderFetchCapability === void 0 ? void 0 : dataProviderFetchCapability.caching;
        if ((fetchCapability === null || fetchCapability === void 0 ? void 0 : fetchCapability.caching) === 'visitedByCurrentIterator' &&
            dataProviderFetchCapabilityCaching !== 'all' &&
            dataProviderFetchCapabilityCaching !== 'visitedByCurrentIterator') {
            needsCaching = true;
        }
        const dataProviderFetchCapabilityRowCount = dataProviderFetchCapability === null || dataProviderFetchCapability === void 0 ? void 0 : dataProviderFetchCapability.totalFilteredRowCount;
        if ((fetchCapability === null || fetchCapability === void 0 ? void 0 : fetchCapability.totalFilteredRowCount) === 'exact' &&
            dataProviderFetchCapabilityRowCount !== 'exact') {
            needsRowCount = true;
        }
        const dataProviderDedupCapabilityType = dataProviderDedupCapability === null || dataProviderDedupCapability === void 0 ? void 0 : dataProviderDedupCapability.type;
        if ((dedupCapability === null || dedupCapability === void 0 ? void 0 : dedupCapability.type) === 'iterator' &&
            dataProviderDedupCapabilityType !== 'global' &&
            dataProviderDedupCapabilityType !== 'iterator') {
            needsDedup = true;
        }
        const dataProviderEventFilteringCapabilityType = dataProviderEventFilteringCapability === null || dataProviderEventFilteringCapability === void 0 ? void 0 : dataProviderEventFilteringCapability.type;
        if ((eventFilteringCapability === null || eventFilteringCapability === void 0 ? void 0 : eventFilteringCapability.type) === 'iterator' &&
            dataProviderEventFilteringCapabilityType !== 'global' &&
            dataProviderEventFilteringCapabilityType !== 'iterator') {
            needsEventFiltering = true;
        }
        let wrappedDataProvider = dataProvider;
        if (needsCaching || needsRowCount) {
            wrappedDataProvider = new CachedIteratorResultsDataProvider(wrappedDataProvider, needsRowCount ? { includeFilteredRowCount: 'enabled' } : undefined);
        }
        if (needsDedup) {
            wrappedDataProvider = new DedupDataProvider(wrappedDataProvider);
        }
        if (needsEventFiltering) {
            wrappedDataProvider = new MutateEventFilteringDataProvider(wrappedDataProvider);
        }
        if (dataProvider['getChildDataProvider']) {
            wrappedDataProvider = new EnhancedTreeDataProvider(dataProvider, wrappedDataProvider, capabilityConfigurations);
        }
        return wrappedDataProvider;
    }
    class EnhancedTreeDataProvider {
        constructor(treeDataProvider, enhancedDataProvider, capabilityConfigurations) {
            this.treeDataProvider = treeDataProvider;
            this.enhancedDataProvider = enhancedDataProvider;
            this.capabilityConfigurations = capabilityConfigurations;
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
                const enhancedDP = getEnhancedDataProvider(childDataProvider, this.capabilityConfigurations);
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
