/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { EventTargetMixin } from 'ojs/ojeventtarget';
import CachedIteratorResultsDataProvider from 'ojs/ojcachediteratorresultsdataprovider';
import CachedFetchByOffsetResultsDataProvider from 'ojs/ojcachedfetchbyoffsetresultsdataprovider';
import DedupDataProvider from 'ojs/ojdedupdataprovider';
import MutateEventFilteringDataProvider from 'ojs/ojmutateeventfilteringdataprovider';

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
 * or "visitedByCurrentIterator" caching, there is no need to wrap it. But if "forceLocalCaching" is set to "enabled" then wrapped dataprovider is returned irrespective of base dataprovider's caching capability.</p>
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
 * @property {Object=} fetchFirst - If "visitedByCurrentIterator" is specified for the "caching" property and base dataprovider does not support caching, then enhance the base DataProvider
 * to cache the results returned by its iterators. Cached results, if available, can be returned when fetchByKeys, fetchByOffset, or
 * containsKeys is called on the enhanced DataProvider. If fetchFirst caching and fetchByOffset caching both are specified then fetchByOffset caching wins over fetchFirst.
 * <p>If "forceLocalCaching" is set to "enabled" then wrapped dataprovider is returned irrespective of base dataprovider's caching capability.<p>
 * <p>If "exact" is specified for the "totalFilteredRowCount" property, enhance the base DataProvider to include totalFilteredRowCount in the iterator
 * results.  Note that this enhancement can be expensive because all rows will be iterated to determine totalFilteredRowCount.</p>
 * @property {Object=} fetchByOffset - If "visitedByOffset" is specified for the "caching" property, enhance the base DataProvider
 * to cache the results returned by fetchByOffset calls.  Cached results, if available, can be returned when fetchByKeys, fetchByOffset, or
 * containsKeys is called on the enhanced DataProvider. If fetchFirst caching and fetchByOffset caching both are specified then fetchByOffset caching wins over fetchFirst.<br>
 * Note: In some scenarios, few cached records are refetched to avoid multiple fetch calls to underlying dataprovider. For example, row0 to row9 and row20 to row25 is cached. Now fetch request with offset 10 and size 20 will cause row20 to row25 to be refetched.
 * @property {Object=} eventFiltering - If "iterator" is specified for the "type" property, enhance the base DataProvider to filter mutate
 * events to hide items that are not within range of items that have been returned by its iterators.
 * @ojsignature [
 *  {target: "Type", value: '{caching?: "visitedByCurrentIterator", forceLocalCaching?: "enabled", totalFilteredRowCount?: "exact"}', for: "fetchFirst", jsdocOverride: true},
 *  {target: "Type", value: '{caching?: "visitedByOffset"}', for: "fetchByOffset", jsdocOverride: true},
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
    const fetchFirstCapability = capabilityConfigurations?.fetchFirst;
    const fetchByOffsetCapability = capabilityConfigurations?.fetchByOffset;
    const dedupCapability = capabilityConfigurations?.dedup;
    const eventFilteringCapability = capabilityConfigurations?.eventFiltering;
    const dataProviderFetchFirstCapability = dataProvider.getCapability('fetchFirst') || dataProvider.getCapability('fetchCapability');
    const dataProviderFetchByOffsetCapability = dataProvider.getCapability('fetchByOffset') || dataProvider.getCapability('fetchCapability');
    const dataProviderDedupCapability = dataProvider.getCapability('dedup');
    const dataProviderEventFilteringCapability = dataProvider.getCapability('eventFiltering');
    let needsFetchFirstCaching = false;
    let needsFetchByOffsetCaching = false;
    let needsFetchFirstRowCount = false;
    let needsDedup = false;
    let needsEventFiltering = false;
    const dataProviderFetchFirstCapabilityCaching = dataProviderFetchFirstCapability?.caching;
    const dataProviderFetchByOffsetCapabilityCaching = dataProviderFetchByOffsetCapability?.caching;
    if (fetchFirstCapability?.caching === 'visitedByCurrentIterator' &&
        (fetchFirstCapability?.forceLocalCaching === 'enabled' ||
            (dataProviderFetchFirstCapabilityCaching !== 'all' &&
                dataProviderFetchFirstCapabilityCaching !== 'visitedByCurrentIterator'))) {
        needsFetchFirstCaching = true;
    }
    const dataProviderFetchFirstCapabilityRowCount = dataProviderFetchFirstCapability?.totalFilteredRowCount;
    if (fetchFirstCapability?.totalFilteredRowCount === 'exact' &&
        dataProviderFetchFirstCapabilityRowCount !== 'exact') {
        needsFetchFirstRowCount = true;
    }
    if (fetchByOffsetCapability?.caching === 'visitedByOffset' &&
        dataProviderFetchByOffsetCapabilityCaching !== 'all' &&
        dataProviderFetchByOffsetCapabilityCaching !== 'visitedByOffset') {
        needsFetchByOffsetCaching = true;
    }
    const dataProviderDedupCapabilityType = dataProviderDedupCapability?.type;
    if (dedupCapability?.type === 'iterator' &&
        dataProviderDedupCapabilityType !== 'global' &&
        dataProviderDedupCapabilityType !== 'iterator') {
        needsDedup = true;
    }
    const dataProviderEventFilteringCapabilityType = dataProviderEventFilteringCapability?.type;
    if (eventFilteringCapability?.type === 'iterator' &&
        dataProviderEventFilteringCapabilityType !== 'global' &&
        dataProviderEventFilteringCapabilityType !== 'iterator') {
        needsEventFiltering = true;
    }
    let wrappedDataProvider = dataProvider;
    if (needsFetchFirstCaching || needsFetchFirstRowCount) {
        wrappedDataProvider = new CachedIteratorResultsDataProvider(wrappedDataProvider, needsFetchFirstRowCount ? { includeFilteredRowCount: 'enabled' } : undefined);
    }
    if (needsFetchByOffsetCaching) {
        wrappedDataProvider = new CachedFetchByOffsetResultsDataProvider(wrappedDataProvider);
    }
    if (needsDedup) {
        wrappedDataProvider = new DedupDataProvider(wrappedDataProvider);
    }
    if (needsEventFiltering) {
        wrappedDataProvider = new MutateEventFilteringDataProvider(wrappedDataProvider);
    }
    // Additionally wrap with EnhancedTreeDataProvider if dataProvider is a TreeDataProvider
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
        // Listen to mutate event on wrapped DataProvider
        enhancedDataProvider.addEventListener(EnhancedTreeDataProvider._MUTATE, (event) => {
            this.updateCache(event);
            this.dispatchEvent(event);
        });
        // Listen to refresh event on wrapped DataProvider
        enhancedDataProvider.addEventListener(EnhancedTreeDataProvider._REFRESH, (event) => {
            this.flushCache();
            this.dispatchEvent(event);
        });
        // Add createOptimizedKeyMap method to this TreeDataProvider if the wrapped TreeDataProvider supports it
        if (enhancedDataProvider.createOptimizedKeyMap) {
            this.createOptimizedKeyMap = (initialMap) => {
                return enhancedDataProvider.createOptimizedKeyMap(initialMap);
            };
        }
        // Add createOptimizedKeySet method to this TreeDataProvider if the wrapped TreeDataProvider supports it
        if (enhancedDataProvider.createOptimizedKeySet) {
            this.createOptimizedKeySet = (initialSet) => {
                return enhancedDataProvider.createOptimizedKeySet(initialSet);
            };
        }
        this._mapKeyToChild = new Map();
    }
    /*** Extra method for TreeDataProvider ***/
    getChildDataProvider(parentKey) {
        const enhancedDP = this._mapKeyToChild.get(parentKey);
        if (enhancedDP) {
            return enhancedDP;
        }
        else {
            return this.cacheEnhancedDataProvider(parentKey);
        }
    }
    /*** Methods for DataProvider ***/
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
        // add event ignored
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
EventTargetMixin.applyMixin(EnhancedTreeDataProvider);

export { getEnhancedDataProvider };
