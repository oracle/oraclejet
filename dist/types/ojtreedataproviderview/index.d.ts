import TreeDataProvider = require('../ojtreedataprovider');
import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, DataMapping, FetchListResult, FetchListParameters,
   FetchAttribute } from '../ojdataprovider';
declare class TreeDataProviderView<K, D, Kin, Din> implements TreeDataProvider<K, D> {
    dataMapping?: DataMapping<K, D, Kin, Din>;
    constructor(dataProvider: TreeDataProvider<K, D>, options?: TreeDataProviderView.Options<K, D, Kin, Din>);
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
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
declare namespace TreeDataProviderView {
    // tslint:disable-next-line interface-over-type-literal
    type Options<K, D, Kin, Din> = {
        dataMapping?: DataMapping<K, D, Kin, Din>;
    };
}
export = TreeDataProviderView;
