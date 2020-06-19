/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, DataMapping, FetchListResult, FetchListParameters,
   FetchAttribute, DataFilter, Item, ItemWithOptionalData, ItemMessage } from '../ojdataprovider';
declare class BufferingDataProvider<K, D> implements DataProvider<K, D> {
    constructor(dataProvider: DataProvider<K, D>, options?: object);
    addEventListener(eventType: string, listener: EventListener): void;
    addItem(item: Item<K, D>): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    createOptimizedKeyMap?(initialMap?: Map<K, D>): Map<K, D>;
    createOptimizedKeySet?(initialSet?: Set<K>): Set<K>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getSubmittableItems(): Array<BufferingDataProvider.EditItem<K, D>>;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
    removeItem(item: ItemWithOptionalData<K, D>): void;
    resetAllUnsubmittedItems(): any;
    resetUnsubmittedItem(key: K): void;
    setItemStatus(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage): void;
    updateItem(item: Item<K, D>): void;
}
export = BufferingDataProvider;
declare namespace BufferingDataProvider {
    interface EditItem<K, D> {
        readonly item: ItemWithOptionalData<K, D>;
        readonly operation: 'add' | 'remove' | 'update';
    }
}
