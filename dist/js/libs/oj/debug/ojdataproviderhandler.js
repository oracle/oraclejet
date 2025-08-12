/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'preact/jsx-runtime', 'preact'], function (exports, jsxRuntime, preact) { 'use strict';

    /**
     * @classdesc
     * A utility class containing helper functions related to dataprovider
     * functionalities for preact based components
     */
    class DataProviderHandlerUtils {
        /**
         * Constructs a new array with updates applied to the copy of the current data array.
         * An optional dataProvider can be passed which will be used to fetch
         * data, in case the data is not available in the mutation event detail.
         *
         * @param detail The mutation detail object
         * @param currentData The current data array
         * @param dataProvider The dataprovider instance
         * @returns The updated data array
         */
        static async getUpdatedItemsFromMutationDetail(detail, currentData, dataProvider) {
            const { add, remove, update } = detail ?? {};
            const keyIndexMap = new Map();
            // Build the keyIndex map for the current, so that future ops will be cheap
            for (const [index, item] of currentData.entries()) {
                keyIndexMap.set(item.key, index);
            }
            let mutatedData = [...currentData];
            // First remove the items
            if (remove) {
                mutatedData = DataProviderHandlerUtils._removeItemsFromDetail(remove, mutatedData, keyIndexMap);
            }
            // Now add the new items
            if (add) {
                mutatedData = await DataProviderHandlerUtils._addItemsFromDetail(add, mutatedData, keyIndexMap, dataProvider);
            }
            // Finally perform updates
            if (update) {
                mutatedData = await DataProviderHandlerUtils._updateItemsFromDetail(update, mutatedData, keyIndexMap, dataProvider);
            }
            return mutatedData;
        }
        ////////////////////////////
        // Private Helper Methods //
        ////////////////////////////
        /**
         * Adds items to the original array at the end
         *
         * @param itemsToAdd The new items to be added
         * @param itemMetadataToAdd The new itemMetaData to be added
         * @param items The original array of items
         * @returns The mutated items array
         */
        static _addItemsAtEnd(itemsToAdd, itemMetadataToAdd, items) {
            // make a shallow copy of the data array to mutate
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
        /**
         * Adds items to the original array at the specified indices with the corresponding
         * data
         *
         * @param indices The indices at which the new items are to be added
         * @param itemsToAdd The new items to be added
         * @param itemMetadataToAdd The new metadata corresponding to the items
         * @param items The original array of items
         * @returns The mutated items array
         */
        static _addItemsAtIndices(indices, itemsToAdd, itemMetadataToAdd, items) {
            // make a shallow copy of the data array to mutate
            const returnItems = [...items];
            indices.forEach((addAtIndex, index) => {
                const addItem = {
                    data: itemsToAdd[index],
                    key: itemMetadataToAdd[index]?.key,
                    metadata: itemMetadataToAdd[index]
                };
                // For all positive indices, add at the index
                if (addAtIndex >= 0) {
                    returnItems.splice(addAtIndex, 0, addItem);
                }
                else {
                    // id index is negative, then add the item to the end
                    returnItems.push(addItem);
                }
            });
            return returnItems;
        }
        /**
         * Adds items to the original array at before the items with the specified keys
         * with the corresponding data
         *
         * @param beforeKeys The keys before which the new data should be added
         * @param itemsToAdd The new items to be added
         * @param items The original array of items
         * @param keyIndexMap A map containing key-index mapping
         * @returns The mutated items array
         */
        static _addItemsBeforeKeys(beforeKeys, itemsToAdd, items, keyIndexMap) {
            const addIndices = [];
            const itemMetadataToAdd = [];
            beforeKeys.forEach((key) => {
                addIndices.push(DataProviderHandlerUtils._getIndexByKey(keyIndexMap, key));
                itemMetadataToAdd.push({ key });
            });
            return DataProviderHandlerUtils._addItemsAtIndices(addIndices, itemsToAdd, itemMetadataToAdd, items);
        }
        /**
         * Adds items to the array from the add operation detail
         *
         * @param detail The add operation detail
         * @param items The current items array
         * @param keyIndexMap A map containing key-index mapping
         * @param dataProvider The instance of DataProvider for fetching data
         * @returns Promise that resolves to the new items array
         */
        static async _addItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
            const { addBeforeKeys, afterKeys, data, indexes, keys, metadata } = detail;
            let mutatedData = [...items];
            let treatedData = data || [];
            let treatedMetaData = metadata || [];
            // Check if keys are available but the data is not, then fetch the data from the DP
            if (treatedData.length === 0 && keys?.size) {
                const fetchResults = (await DataProviderHandlerUtils._fetchDataByKeys(dataProvider, keys)) ?? [];
                treatedData = fetchResults.map((itemContext) => itemContext.data);
                treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
            }
            // Check if metadata is empty and keys are available, populate metadata from key
            if (treatedMetaData.length === 0 && keys?.size) {
                treatedMetaData = [...keys].map((key) => ({ key }));
            }
            // Perform the addition only if the data is available
            if (treatedData.length) {
                // Check in the following order of where the items need to be inserted
                // - indexes
                // - addBeforeKeys
                // - afterKeys
                // if none of them are available, just append to the end of the data
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
        /**
         * Fetches the data from the dataprovider for the keys specified and returns the fetched data
         *
         * @param dataProvider The dataProvider instance for fetching the data
         * @param keys The set of keys whose data needs to be fetched
         * @returns A promise that resolves with the fetched data
         */
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
        /**
         * Fetches the index of the item with the corresponding key
         *
         * @param keyIndexMap A map containing key-index mapping
         * @param key The key whose index has to be found
         * @returns The index of the item with the provided key
         */
        static _getIndexByKey(keyIndexMap, key) {
            if (keyIndexMap.has(key)) {
                return keyIndexMap.get(key);
            }
            // If key is not in the data return -1
            return -1;
        }
        /**
         * Removes items from the original items array with the corresponding indices
         *
         * @param indices An array of indices to be removed
         * @param items The original items array
         * @returns The mutated items array
         */
        static _removeItemsAtIndices(indices, items) {
            // make a shallow copy of the data array to mutate
            const returnItems = [...items];
            // sort the indices in desc order so the items can be removed from
            // the end
            indices.sort((a, b) => b - a);
            // iterate through indices and remove items
            indices.forEach((index) => {
                if (index < returnItems.length) {
                    returnItems.splice(index, 1);
                }
            });
            return returnItems;
        }
        /**
         * Removes items from the original items array with the corresponding keys
         *
         * @param keys A set of keys whose corresponding data has to be removed
         * @param items The original items array
         * @param keyIndexMap A map containing key-index mapping
         * @returns The mutated items array
         */
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
        /**
         * Removes items from the array using the remove operation detail
         *
         * @param detail The remove operation detail
         * @param items The current items array
         * @param keyIndexMap A map containing key-index mapping
         * @returns Promise that resolves to the new items array
         */
        static _removeItemsFromDetail(detail, items, keyIndexMap) {
            const { indexes, keys } = detail;
            let mutatedData = [...items];
            // Check for list of indices first
            if (indexes?.length) {
                mutatedData = DataProviderHandlerUtils._removeItemsAtIndices(indexes, mutatedData);
            }
            else if (keys?.size) {
                mutatedData = DataProviderHandlerUtils._removeItemsAtKeys(keys, mutatedData, keyIndexMap);
            }
            return mutatedData;
        }
        /**
         * Updates items in the original array at the specified indices with the corresponding
         * data
         *
         * @param indices The indices at which the items are to be updated
         * @param itemsToUpdate The new items with updated data
         * @param itemMetadataToUpdate The new metadata corresponding to the items
         * @param items The original array of items
         * @returns The mutated items array
         */
        static _updateItemsAtIndices(indices, itemsToUpdate, itemMetadataToUpdate, items) {
            // make a shallow copy of the data array to mutate
            const returnItems = [...items];
            indices.forEach((updateAtIndex, index) => {
                // Update values only for existing items
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
        /**
         * Updates items in the original array at the specified indices with the corresponding
         * data
         *
         * @param keys The keys at which the items are to be updated
         * @param itemsToUpdate The new items with updated data
         * @param itemMetadataToUpdate The new metadata corresponding to the items
         * @param items The original array of items
         * @param keyIndexMap A map containing key-index mapping
         * @returns The mutated items array
         */
        static _updateItemsAtKeys(keys, itemsToUpdate, itemMetadataToUpdate, items, keyIndexMap) {
            // make a shallow copy of the data array to mutate
            const returnItems = [...items];
            keys.forEach((key) => {
                const index = this._getIndexByKey(keyIndexMap, key);
                const addItem = {
                    data: itemsToUpdate[index],
                    key: itemMetadataToUpdate[index]?.key,
                    metadata: itemMetadataToUpdate[index]
                };
                // Update only if item exists in the current data
                if (index >= 0) {
                    returnItems.splice(index, 1, addItem);
                }
            });
            return returnItems;
        }
        /**
         * Updates items in the array using the update operation detail
         *
         * @param detail The update operation detail
         * @param items The current items array
         * @param keyIndexMap A map containing key-index mapping
         * @param dataProvider The instance of DataProvider for fetching data
         * @returns Promise that resolves to the new items array
         */
        static async _updateItemsFromDetail(detail, items, keyIndexMap, dataProvider) {
            const { data, indexes, keys, metadata } = detail;
            let mutatedData = [...items];
            let treatedData = data || [];
            let treatedMetaData = metadata || [];
            // Check if keys are available but the data is not, then fetch the data from the DP
            if (treatedData.length === 0 && keys?.size) {
                const fetchResults = (await DataProviderHandlerUtils._fetchDataByKeys(dataProvider, keys)) ?? [];
                treatedData = fetchResults.map((itemContext) => itemContext.data);
                treatedMetaData = fetchResults.map((itemContext) => itemContext.metadata);
            }
            // Check if metadata is empty and keys are available, populate metadata from key
            if (treatedMetaData.length === 0 && keys?.size) {
                treatedMetaData = [...keys].map((key) => ({ key }));
            }
            // Perform the update only if the data is available
            if (treatedData.length) {
                // Check in the following order for updating data
                // - indexes
                // - keys
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

    /**
     * @classdesc
     * This class handles DataProvider mechanisms for the preact components
     * @ignore
     */
    class DataProviderHandler {
        ///////////////////////////
        // Handler functions end //
        ///////////////////////////
        /**
         * Instantiates the MessagesDataProviderHandler.
         *
         * @param dataProvider The data provider instance that is being used by the component
         * @param addBusyState A function reference that set busy state in the component
         * @param callback A callback that will be invoked whenever data changes
         */
        constructor(dataProvider, addBusyState, callback) {
            ////////////////////////////////////////////////////////////////////////
            // Handler functions are created as members to have them 'this' bound //
            ////////////////////////////////////////////////////////////////////////
            /**
             * Handles the mutation event triggered by the dataprovider and calls corresponding
             * callbacks.
             *
             * @param event DP mutation event object containing details relevant to the event
             */
            this._handleMutateEvent = async (event) => {
                const { detail } = event;
                // Add busy state while updating the data
                const resolver = this._addBusyState('updating data from mutation event');
                const updatedData = await DataProviderHandlerUtils.getUpdatedItemsFromMutationDetail(detail, this._currentData, this._dataProvider);
                // Resolve the busy state
                resolver?.();
                // store the newly created data and notify the consumer with the new data
                this._currentData = updatedData;
                this._callback?.onDataUpdated?.(updatedData);
            };
            /**
             * Handles the refresh event triggered by the dataprovider and calls corresponding
             * callbacks.
             *
             * @param event DP mutation event object containing details relevant to the event
             */
            this._handleRefreshEvent = (event) => {
                // For refresh event, we will simply fetch new data and notify
                this._fetchDataAndNotify();
            };
            this._addBusyState = addBusyState;
            this._callback = callback;
            this._dataProvider = dataProvider;
            this._currentData = [];
            // Subscribe to the data provider events
            dataProvider.addEventListener('refresh', this._handleRefreshEvent);
            dataProvider.addEventListener('mutate', this._handleMutateEvent);
            // Initialize a fetch
            this._fetchDataAndNotify();
        }
        ////////////////////
        // Public Methods //
        ////////////////////
        /**
         * Destroys all resources un-registers all events
         */
        destroy() {
            // Clean up callbacks so that existing fetches will not update the component
            this._callback = undefined;
            // empty the store data
            this._currentData = [];
            // Clean up data provider
            this._dataProvider.removeEventListener('refresh', this._handleRefreshEvent);
            this._dataProvider.removeEventListener('mutate', this._handleMutateEvent);
        }
        ////////////////////////
        // Public Methods End //
        ////////////////////////
        ////////////////////////////
        // Private Helper Methods //
        ////////////////////////////
        /**
         * Fetches the data from the dataprovider and returns the fetched data
         *
         * @returns A promise that resolves with the fetched data
         */
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
            // Store a copy of data before returning
            this._currentData = fetchedData.slice();
            return fetchedData;
        }
        /**
         * Fetches the data from the dataprovider and calls the corresponding
         * callback with the fetched data.
         */
        async _fetchDataAndNotify() {
            // Set the busy state
            const resolver = this._addBusyState('fetching data');
            const fetchedData = await this._fetchData();
            this._callback?.onDataUpdated?.(fetchedData);
            // Now that the data is fetched, clear the busy state
            resolver();
        }
    }

    /**
     * A HOC for converting a DataProvider<K, D> into an Array<ItemContext<K, D>
     * data source. This component also subscribes to the DP events and updates
     * the data prop of the WrappedComponent automatically. The HOC expects the
     * Prop specified as the data property of the WrappedComponent to accept an
     * Array of ItemContext<K, D>.
     *
     * @template K type of the key in DP
     * @template D type of the Data in DP
     * @template P type of the Props of the WrappedComponent
     *
     * @param WrappedComponent The Class Component or Functional Component to be wrapped
     * @param dataProp The name of the data Prop in the WrappedComponent. This property
     *                 should accept an Array of ItemContext<K, D>
     * @returns The HOC generated component that does DP -> array conversion for the data prop
     */
    function withDataProvider(WrappedComponent, dataProp) {
        var _a;
        return _a = class extends preact.Component {
                ///////////////////////////
                // Handler functions end //
                ///////////////////////////
                /**
                 * Instantiates Banner Component
                 *
                 * @param props The component properties
                 */
                constructor(props) {
                    super(props);
                    ////////////////////////////////////////////////////////////////////////
                    // Handler functions are created as members to have them 'this' bound //
                    ////////////////////////////////////////////////////////////////////////
                    /**
                     * Handles when the component receives fresh data from the DP handler
                     *
                     * @param fetchedData The newly fetched data
                     */
                    this._handleDataUpdate = (fetchedData) => {
                        this.setState({ fetchedData });
                    };
                    this.state = {
                        fetchedData: []
                    };
                }
                //////////////////////////////////////
                // Component Life Cycle Hooks Start //
                //////////////////////////////////////
                /**
                 * Life Cycle hook that gets called when the component is mounted to the DOM.
                 * Do one-time initializations here.
                 */
                componentDidMount() {
                    // Fetch the data only after the component is mounted on to the DOM.
                    this._initDataProviderHandler();
                }
                /**
                 * Life Cycle hook that gets called when the component's state or props is updated
                 * after it is rendered for the first time.
                 *
                 * @param previousProps Previous Props
                 */
                componentDidUpdate(previousProps) {
                    // Check if the data source is modified and reinitialize the data provider handler
                    if (this.props.data !== previousProps.data) {
                        this._resetDataProviderHandler();
                    }
                }
                /**
                 * Life Cycle hook that gets called right before the component gets unmounted from the DOM.
                 * Release all resources here.
                 */
                componentWillUnmount() {
                    this._releaseDataProviderHandler();
                }
                ////////////////////////////////////
                // Component Life Cycle Hooks End //
                ////////////////////////////////////
                /**
                 * Renders the WrappedComponent instance
                 *
                 * @param props The current properties of the component
                 * @param state The current state of the component
                 *
                 * @returns The rendered component
                 */
                render(props, state) {
                    const { data, addBusyState, ...passThroughProps } = props;
                    const { fetchedData } = state;
                    const childProps = {
                        [dataProp]: fetchedData,
                        ...passThroughProps
                    };
                    return jsxRuntime.jsx(WrappedComponent, { ...childProps });
                }
                ////////////////////////////
                // Private helper methods //
                ////////////////////////////
                /**
                 * Initializes the DataProviderHandler. By default fetches the data.
                 */
                _initDataProviderHandler() {
                    const { data, addBusyState } = this.props;
                    // Initialize only if data provider exists in the current props.
                    if (data != null) {
                        this._dataProviderHandler = new DataProviderHandler(data, addBusyState, {
                            onDataUpdated: this._handleDataUpdate
                        });
                    }
                }
                /**
                 * Destroys the current DataProviderHandler instance
                 */
                _releaseDataProviderHandler() {
                    this._dataProviderHandler?.destroy();
                    this._dataProviderHandler = undefined;
                }
                /**
                 * Resets the DataProviderHandler. By default fetches the data.
                 */
                _resetDataProviderHandler() {
                    // Destroy existing dataprovider handler
                    this._releaseDataProviderHandler();
                    // Reinitialize a new one
                    this._initDataProviderHandler();
                }
            },
            /**
             * Display Name of the component
             */
            _a.displayName = `WithDataProvider(${getDisplayName(WrappedComponent)})`,
            _a;
    }
    /**
     * Obtains a Component's display name.
     *
     * @param WrappedComponent The Component whose displayName has to be obtained
     * @returns The displayName of the component if one exists or uses 'Component' as default
     */
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';
    }

    exports.withDataProvider = withDataProvider;

    Object.defineProperty(exports, '__esModule', { value: true });

});
