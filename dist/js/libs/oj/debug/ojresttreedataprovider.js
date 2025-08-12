/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojeventtarget', 'ojs/ojrestdataprovider', 'ojs/ojdataprovider', 'ojs/ojset', 'ojs/ojmap'], function (exports, ojeventtarget, ojrestdataprovider, ojdataprovider, ojSet, ojMap) { 'use strict';

    ojSet = ojSet && Object.prototype.hasOwnProperty.call(ojSet, 'default') ? ojSet['default'] : ojSet;
    ojMap = ojMap && Object.prototype.hasOwnProperty.call(ojMap, 'default') ? ojMap['default'] : ojMap;

    class RESTTreeDataProvider {
        constructor(options) {
            var _a;
            this.options = options;
            this.TreeAsyncIterator = class {
                constructor(_rootDataProvider, _baseIterable, currentRestTreeDataProvider, _shouldKeyPath, _shouldStringify) {
                    this._rootDataProvider = _rootDataProvider;
                    this._baseIterable = _baseIterable;
                    this.currentRestTreeDataProvider = currentRestTreeDataProvider;
                    this._shouldKeyPath = _shouldKeyPath;
                    this._shouldStringify = _shouldStringify;
                }
                async next() {
                    const result = await this._baseIterable[Symbol.asyncIterator]().next();
                    for (let i = 0; i < result.value.data.length; i++) {
                        let tempKey = result.value.metadata[i].key;
                        if (this._shouldKeyPath) {
                            tempKey = this.currentRestTreeDataProvider.createKeyPath(result.value.metadata[i].key);
                        }
                        if (this._shouldStringify) {
                            tempKey = JSON.stringify(tempKey);
                        }
                        result.value.metadata[i].key = tempKey;
                        this._rootDataProvider._setMapEntry(tempKey, {
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
            const baseDPOptions = { ...options, enforceKeyStringify: 'off' };
            this._baseDataProvider = new ojrestdataprovider.RESTDataProvider(baseDPOptions);
            // This map is used as an internal cache to look up the Item<K,D> corresponding to a node by
            // its key. It is needed in order to pass an item to options.getChildDataProvider, the goal
            // being to provide applications as much information as possible in order to return a child
            // data provider or null. Item<K,D> values have a "data" field containing the node and a "metadata"
            // field containing the metadata of the node such as whether it is a leaf. The "metadata" can be populated
            // from the REST endpoint via the response fetch response.
            // This map is available on every RESTTreeDataProvider but only populated and updated on the
            // root / top-level RESTTreeDataProvider (see _getRootDataProvider) in order to have a single
            // source of truth. In a future version, we should provide a public interface for
            // accessing the map instead of allowing child data providers to access the root data providers
            // private properties
            this._mapKeyToItem = new ojMap();
        }
        _shouldKeyPath() {
            const options = this._getRootDataProvider().options;
            return options?.useKeyPaths === 'on';
        }
        _shouldStringify() {
            const options = this._getRootDataProvider().options;
            return options?.enforceKeyStringify === 'on';
        }
        _getParentPath() {
            return this.options.rootDataProvider ? this[Symbol.for('parentKey')] : [];
        }
        createKeyPath(key) {
            return [...this._getParentPath(), key];
        }
        fetchFirst(fetchParameters) {
            const baseIterable = this._baseDataProvider.fetchFirst(fetchParameters);
            const rootDataProvider = this._getRootDataProvider();
            return new this.TreeAsyncIterable(new this.TreeAsyncIterator(rootDataProvider, baseIterable, this, this._shouldKeyPath(), this._shouldStringify()));
        }
        isKeyPathDescendant(keyPath) {
            const parentKeyPath = this._getParentPath();
            if (parentKeyPath.length >= keyPath.length) {
                return false;
            }
            for (let i = 0; i < parentKeyPath.length; i++) {
                if (parentKeyPath[i] !== keyPath[i]) {
                    return false;
                }
            }
            return true;
        }
        async fetchByKeys(parameters) {
            const unCachedKeys = new Set();
            const results = new Map();
            const shouldKeyPath = this._shouldKeyPath();
            parameters.keys.forEach((currentKey) => {
                let key = currentKey;
                const item = this._getItemFromKey(key);
                if (item) {
                    if (!shouldKeyPath || (shouldKeyPath && this.isKeyPathDescendant(key))) {
                        results.set(key, item);
                    }
                }
                else {
                    if (this._shouldStringify()) {
                        key = JSON.parse(currentKey);
                    }
                    unCachedKeys.add(key);
                }
            });
            if (unCachedKeys.size) {
                if (shouldKeyPath) {
                    for (const key of unCachedKeys) {
                        const findResults = await this.findKeys(key.slice(), key.slice(), parameters, this);
                        const item = findResults.fetchByKeysResults.results.get(findResults.lastKey);
                        if (item) {
                            let tempKey = key;
                            if (this._shouldStringify()) {
                                tempKey = JSON.stringify(key);
                            }
                            const updatedItem = {
                                data: item.data,
                                metadata: { ...item.metadata, key: tempKey }
                            };
                            this._setMapEntry(tempKey, updatedItem);
                            results.set(tempKey, updatedItem);
                        }
                    }
                }
                else {
                    const fetchByKeysResult = await this._baseDataProvider.fetchByKeys({
                        ...parameters,
                        keys: unCachedKeys
                    });
                    fetchByKeysResult.results.forEach((item) => {
                        let tempKey = item.metadata.key;
                        if (this._shouldStringify()) {
                            tempKey = JSON.stringify(tempKey);
                        }
                        const updatedItem = {
                            data: item.data,
                            metadata: { ...item.metadata, key: tempKey }
                        };
                        this._setMapEntry(tempKey, updatedItem);
                        results.set(tempKey, updatedItem);
                    });
                }
            }
            return {
                fetchParameters: parameters,
                results
            };
        }
        async findKeys(currentKeyPath, originalKeyPath, params, dataProvider) {
            if (currentKeyPath.length === 1) {
                let lastKey = currentKeyPath[0];
                const convertedFetchParameters = { ...params };
                convertedFetchParameters.keys = new Set();
                convertedFetchParameters.keys.add(lastKey);
                return {
                    fetchByKeysResults: await dataProvider._baseDataProvider.fetchByKeys(convertedFetchParameters),
                    lastKey: lastKey
                };
            }
            else {
                let firstKey = [currentKeyPath.shift()];
                const firstItem = this._getItemFromKey(firstKey);
                let childDataProvider;
                if (firstItem) {
                    childDataProvider = dataProvider.getChildDataProvider(firstKey);
                }
                else {
                    firstKey = firstKey[0];
                    const newFetchParameters = { ...params };
                    newFetchParameters.keys = new Set();
                    newFetchParameters.keys.add(firstKey);
                    const fetchByKeysResults = await dataProvider._baseDataProvider.fetchByKeys(newFetchParameters);
                    if (fetchByKeysResults.results.size > 0) {
                        const indexOfKey = originalKeyPath.indexOf(firstKey);
                        const keyPath = originalKeyPath.slice(0, indexOfKey + 1);
                        fetchByKeysResults.results.forEach((value) => {
                            const item = {
                                data: value.data,
                                metadata: { ...value.metadata, key: keyPath }
                            };
                            this._setMapEntry(keyPath, item);
                        });
                        childDataProvider = dataProvider.getChildDataProvider(keyPath);
                    }
                }
                if (childDataProvider) {
                    return this.findKeys(currentKeyPath, originalKeyPath, params, childDataProvider);
                }
                else {
                    return null;
                }
            }
        }
        async fetchByOffset(parameters) {
            const fetchByOffsetResult = await this._baseDataProvider.fetchByOffset(parameters);
            const newOffsetResults = { ...fetchByOffsetResult };
            newOffsetResults.results = [];
            fetchByOffsetResult.results.forEach((item) => {
                let tempKey = item.metadata.key;
                if (this._shouldKeyPath()) {
                    tempKey = this.createKeyPath(item.metadata.key);
                }
                if (this._shouldStringify()) {
                    tempKey = JSON.stringify(tempKey);
                }
                const updatedItem = {
                    data: item.data,
                    metadata: { ...item.metadata, key: tempKey }
                };
                newOffsetResults.results.push(updatedItem);
                this._setMapEntry(tempKey, updatedItem);
            });
            return newOffsetResults;
        }
        async containsKeys(fetchParameters) {
            if (this._shouldKeyPath()) {
                const results = new ojSet();
                const fetchByKeysResults = await this.fetchByKeys(fetchParameters);
                fetchParameters.keys.forEach((key) => {
                    if (fetchByKeysResults.results.get(key) != null) {
                        results.add(key);
                    }
                });
                return { containsParameters: fetchParameters, results };
            }
            if (this._shouldStringify()) {
                const results = new ojSet();
                const newFetchParameters = { ...fetchParameters };
                if (this._shouldStringify()) {
                    newFetchParameters.keys = new Set();
                    fetchParameters.keys.forEach((key) => {
                        newFetchParameters.keys.add(JSON.parse(key));
                    });
                }
                const containsResults = await this._baseDataProvider.containsKeys(newFetchParameters);
                fetchParameters.keys.forEach((key) => {
                    if (containsResults.results.has(JSON.parse(key))) {
                        results.add(key);
                    }
                });
                return { containsParameters: fetchParameters, results };
            }
            return this._baseDataProvider.containsKeys(fetchParameters);
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
            if (capabilityName === 'key') {
                if (this._shouldKeyPath()) {
                    if (this._shouldStringify()) {
                        return { structure: 'pathArrayString' };
                    }
                    return { structure: 'pathArray' };
                }
                return { structure: 'none' };
            }
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
            const treeDataProvider = ojdataprovider.DataProviderFeatureChecker.isTreeDataProvider(dataprovider)
                ? dataprovider
                : new TreeDataProviderWrapper(dataprovider);
            if (this._shouldKeyPath()) {
                treeDataProvider[Symbol.for('parentKey')] = key;
            }
            return treeDataProvider;
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
            // DataProvider contract specifies that isEmpty returns
            // 'string' so 'yes' | 'no' | 'unknown' is not accepted by Typescript
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
        getChildDataProvider(_key) {
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
