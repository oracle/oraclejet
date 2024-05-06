/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact'], function (exports, jsxRuntime, preact) { 'use strict';

    class DataProviderHandlerUtils {
        static async getUpdatedItemsFromMutationDetail(detail, currentData, dataProvider) {
            const { add, remove, update } = detail ?? {};
            const keyIndexMap = new Map();
            for (const [index, item] of currentData.entries()) {
                keyIndexMap.set(item.key, index);
            }
            let mutatedData = [...currentData];
            if (remove) {
                mutatedData = DataProviderHandlerUtils._removeItemsFromDetail(remove, mutatedData, keyIndexMap);
            }
            if (add) {
                mutatedData = await DataProviderHandlerUtils._addItemsFromDetail(add, mutatedData, keyIndexMap, dataProvider);
            }
            if (update) {
                mutatedData = await DataProviderHandlerUtils._updateItemsFromDetail(update, mutatedData, keyIndexMap, dataProvider);
            }
            return mutatedData;
        }
        static _addItemsAtEnd(itemsToAdd, itemMetadataToAdd, items) {
            const returnItems = [...items];
            itemsToAdd.forEach((item, index) => {
                const addItem = {
                    data: item,
                    key: itemMetadataToAdd[index]?.key,
                    metadata: itemMetadataToAdd[index]
                };
                returnItems.push(addItem);
            });
            return returnItems;
        }
        static _addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items) {
            const returnItems = [...items];
            indices.forEach((addAtIndex, index) => {
                const addItem = {
                    data: itemsToAdd[index],
                    key: itemMetadataToAdd[index]?.key,
                    metadata: itemMetadataToAdd[index]
                };
                if (addAtIndex >= 0) {
                    returnItems.splice(addAtIndex, 0, addItem);
                }
                else {
                    returnItems.push(addItem);
                }
            });
            return returnItems;
        }
        static _addItemsBeforeKeys(beforeKeys, itemsToAdd, items, keyIndexMap) {
            const addIndices = [];
            const itemMetadataToAdd = [];
            beforeKeys.forEach((key) => {
                addIndices.push(DataProviderHandlerUtils._getIndexByKey(keyIndexMap, key));
                itemMetadataToAdd.push({ key });
            });
            return DataProviderHandlerUtils._addItemsAtIndices(addIndices, itemsToAdd, itemMetadataToAdd, items);
        }
        static async _addItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
            const { addBeforeKeys, afterKeys, data, indexes, keys, metadata } = detail;
            let mutatedData = [...items];
            let treatedData = data || [];
            let treatedMetaData = metadata || [];
            if (treatedData.length === 0 && keys?.size) {
                const fetchResults = (await DataProviderHandlerUtils._fetchDataByKeys(dataProvider, keys)) ?? [];
                treatedData = fetchResults.map((itemContext) => itemContext.data);
                treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
            }
            if (treatedMetaData.length === 0 && keys?.size) {
                treatedMetaData = [...keys].map((key) => ({ key }));
            }
            if (treatedData.length) {
                if (indexes?.length) {
                    mutatedData = DataProviderHandlerUtils._addItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
                }
                else if (addBeforeKeys?.length) {
                    mutatedData = DataProviderHandlerUtils._addItemsBeforeKeys(addBeforeKeys, treatedData, mutatedData, keyIndexMap);
                }
                else if (afterKeys?.size) {
                    mutatedData = DataProviderHandlerUtils._addItemsBeforeKeys([...afterKeys], treatedData, mutatedData, keyIndexMap);
                }
                else {
                    mutatedData = DataProviderHandlerUtils._addItemsAtEnd(treatedData, treatedMetaData, mutatedData);
                }
            }
            return mutatedData;
        }
        static async _fetchDataByKeys(dataProvider, keys) {
            const fetchedData = [];
            const results = (await dataProvider.fetchByKeys({ keys })).results;
            for (const key of keys) {
                if (results.has(key)) {
                    const result = results.get(key);
                    fetchedData.push({ ...result, key });
                }
            }
            return fetchedData;
        }
        static _getIndexByKey(keyIndexMap, key) {
            if (keyIndexMap.has(key)) {
                return keyIndexMap.get(key);
            }
            return -1;
        }
        static _removeItemsAtIndices(indices, items) {
            const returnItems = [...items];
            indices.sort((a, b) => b - a);
            indices.forEach((index) => {
                if (index < returnItems.length) {
                    returnItems.splice(index, 1);
                }
            });
            return returnItems;
        }
        static _removeItemsAtKeys(keys, items, keyIndexMap) {
            const indicesToRemove = [];
            keys.forEach((key) => {
                const index = DataProviderHandlerUtils._getIndexByKey(keyIndexMap, key);
                if (index !== -1) {
                    indicesToRemove.push(index);
                }
            });
            return DataProviderHandlerUtils._removeItemsAtIndices(indicesToRemove, items);
        }
        static _removeItemsFromDetail(detail, items, keyIndexMap) {
            const { indexes, keys } = detail;
            let mutatedData = [...items];
            if (indexes?.length) {
                mutatedData = DataProviderHandlerUtils._removeItemsAtIndices(indexes, mutatedData);
            }
            else if (keys?.size) {
                mutatedData = DataProviderHandlerUtils._removeItemsAtKeys(keys, mutatedData, keyIndexMap);
            }
            return mutatedData;
        }
        static _updateItemsAtIndices(indices, itemsToUpdate, itemMetadataToUpdate, items) {
            const returnItems = [...items];
            indices.forEach((updateAtIndex, index) => {
                if (returnItems[updateAtIndex]) {
                    const addItem = {
                        data: itemsToUpdate[index],
                        key: itemMetadataToUpdate[index]?.key,
                        metadata: itemMetadataToUpdate[index]
                    };
                    returnItems.splice(updateAtIndex, 1, addItem);
                }
            });
            return returnItems;
        }
        static _updateItemsAtKeys(keys, itemsToUpdate, itemMetadataToUpdate, items, keyIndexMap) {
            const returnItems = [...items];
            keys.forEach((key) => {
                const index = this._getIndexByKey(keyIndexMap, key);
                const addItem = {
                    data: itemsToUpdate[index],
                    key: itemMetadataToUpdate[index]?.key,
                    metadata: itemMetadataToUpdate[index]
                };
                if (index >= 0) {
                    returnItems.splice(index, 1, addItem);
                }
            });
            return returnItems;
        }
        static async _updateItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
            const { data, indexes, keys, metadata } = detail;
            let mutatedData = [...items];
            let treatedData = data || [];
            let treatedMetaData = metadata || [];
            if (treatedData.length === 0 && keys?.size) {
                const fetchResults = (await DataProviderHandlerUtils._fetchDataByKeys(dataProvider, keys)) ?? [];
                treatedData = fetchResults.map((itemContext) => itemContext.data);
                treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
            }
            if (treatedMetaData.length === 0 && keys?.size) {
                treatedMetaData = [...keys].map((key) => ({ key }));
            }
            if (treatedData.length) {
                if (indexes?.length) {
                    mutatedData = DataProviderHandlerUtils._updateItemsAtIndices(indexes, treatedData, treatedMetaData, mutatedData);
                }
                else if (keys?.size) {
                    mutatedData = DataProviderHandlerUtils._updateItemsAtKeys(keys, treatedData, treatedMetaData, mutatedData, keyIndexMap);
                }
            }
            return mutatedData;
        }
    }

    class DataProviderHandler {
        constructor(dataProvider, addBusyState, callback) {
            this._handleMutateEvent = async (event) => {
                const { detail } = event;
                const resolver = this._addBusyState('updating data from mutation event');
                const updatedData = await DataProviderHandlerUtils.getUpdatedItemsFromMutationDetail(detail, this._currentData, this._dataProvider);
                resolver?.();
                this._currentData = updatedData;
                this._callback?.onDataUpdated?.(updatedData);
            };
            this._handleRefreshEvent = (event) => {
                this._fetchDataAndNotify();
            };
            this._addBusyState = addBusyState;
            this._callback = callback;
            this._dataProvider = dataProvider;
            this._currentData = [];
            dataProvider.addEventListener('refresh', this._handleRefreshEvent);
            dataProvider.addEventListener('mutate', this._handleMutateEvent);
            this._fetchDataAndNotify();
        }
        destroy() {
            this._callback = undefined;
            this._currentData = [];
            this._dataProvider.removeEventListener('refresh', this._handleRefreshEvent);
            this._dataProvider.removeEventListener('mutate', this._handleMutateEvent);
        }
        async _fetchData() {
            const fetchedData = [];
            const asyncIterable = this._dataProvider.fetchFirst({ size: -1 });
            for await (const results of asyncIterable) {
                const contextArray = results.data.map((item, index) => {
                    return {
                        data: item,
                        key: results.metadata[index].key,
                        metadata: results.metadata[index]
                    };
                });
                fetchedData.push(...contextArray);
            }
            this._currentData = fetchedData.slice();
            return fetchedData;
        }
        async _fetchDataAndNotify() {
            const resolver = this._addBusyState('fetching data');
            const fetchedData = await this._fetchData();
            this._callback?.onDataUpdated?.(fetchedData);
            resolver();
        }
    }

    function withDataProvider(WrappedComponent, dataProp) {
        var _a;
        return _a = class extends preact.Component {
                constructor(props) {
                    super(props);
                    this._handleDataUpdate = (fetchedData) => {
                        this.setState({ fetchedData });
                    };
                    this.state = {
                        fetchedData: []
                    };
                }
                componentDidMount() {
                    this._initDataProviderHandler();
                }
                componentDidUpdate(previousProps) {
                    if (this.props.data !== previousProps.data) {
                        this._resetDataProviderHandler();
                    }
                }
                componentWillUnmount() {
                    this._releaseDataProviderHandler();
                }
                render(props, state) {
                    const { data, addBusyState, ...passThroughProps } = props;
                    const { fetchedData } = state;
                    const childProps = {
                        [dataProp]: fetchedData,
                        ...passThroughProps
                    };
                    return jsxRuntime.jsx(WrappedComponent, { ...childProps });
                }
                _initDataProviderHandler() {
                    const { data, addBusyState } = this.props;
                    if (data != null) {
                        this._dataProviderHandler = new DataProviderHandler(data, addBusyState, {
                            onDataUpdated: this._handleDataUpdate
                        });
                    }
                }
                _releaseDataProviderHandler() {
                    this._dataProviderHandler?.destroy();
                    this._dataProviderHandler = undefined;
                }
                _resetDataProviderHandler() {
                    this._releaseDataProviderHandler();
                    this._initDataProviderHandler();
                }
            },
            _a.displayName = `WithDataProvider(${getDisplayName(WrappedComponent)})`,
            _a;
    }
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';
    }

    exports.withDataProvider = withDataProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
