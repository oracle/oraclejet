import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
import ArrayDataProvider = require('../ojarraydataprovider');
import TreeDataProvider = require('../ojtreedataprovider');
export class SuppressNodeTreeDataProvider<K, D> implements TreeDataProvider<K, D> {
    constructor(treeDataProvider: TreeDataProvider<K, D>, options?: SuppressNodeTreeDataProvider.Options);
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    createOptimizedKeyMap?(initialMap?: Map<K, D>): Map<K, D>;
    createOptimizedKeySet?(initialSet?: Set<K>): Set<K>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getChildDataProvider(key: K): TreeDataProvider<K, D> | null;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
export namespace SuppressNodeTreeDataProvider {
    // tslint:disable-next-line interface-over-type-literal
    type Options = {
        suppressNode: 'never' | 'ifEmptyChildren';
    };
}
