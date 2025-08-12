import { DataProvider, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult, FetchListParameters, Item, ItemWithOptionalData,
   ItemMessage } from '../ojdataprovider';
import TreeDataProvider = require('../ojtreedataprovider');
import BufferingDataProvider = require('../ojbufferingdataprovider');
declare class BufferingTreeDataProvider<K, D> implements TreeDataProvider<K, D> {
    constructor(dataProvider: DataProvider<K, D>, options?: BufferingTreeDataProvider.Options<K, D>);
    addEventListener(eventType: string, listener: EventListener): void;
    addItem(item: Item<K, D>, addDetail?: {
        nullParentKey?: K;
        addBeforeKey?: K | null;
    }): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    createOptimizedKeyMap?(initialMap?: Map<K, D>): Map<K, D>;
    createOptimizedKeySet?(initialSet?: Set<K>): Set<K>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getChildDataProvider(key: K): TreeDataProvider<K, D> | null;
    getSubmittableItems(): Array<BufferingDataProvider.EditItem<K, D>>;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
    removeItem(item: ItemWithOptionalData<K, D>): void;
    resetAllUnsubmittedItems(): void;
    resetUnsubmittedItem(key: K): void;
    setItemStatus(editItem: BufferingDataProvider.EditItem<K, D>, newStatus: 'unsubmitted' | 'submitting' | 'submitted', error?: ItemMessage, newKey?: K): void;
    updateItem(item: Item<K, D>): void;
}
declare namespace BufferingTreeDataProvider {
    // tslint:disable-next-line interface-over-type-literal
    type Options<K, D> = {
        keyGenerator?: (value: Partial<D>) => K;
    };
}
export = BufferingTreeDataProvider;
