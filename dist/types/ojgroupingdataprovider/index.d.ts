import ArrayDataProvider = require('../ojarraydataprovider');
import TreeDataProvider = require('../ojtreedataprovider');
import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
declare class GroupingDataProvider<K, D> implements TreeDataProvider<K, D> {
    constructor(dataProvider: DataProvider<K, D>, sortComparator: ((param0: D, param1: D) => boolean), sectionRenderer: ((param0: K) => D), options?: GroupingDataProvider.Options<D>);
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName?: string): any;
    getChildDataProvider(parentKey: any): GroupingDataProvider<K, D>;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
declare namespace GroupingDataProvider {
    // tslint:disable-next-line interface-over-type-literal
    type Options<D> = {
        groupByStrategy: ((param0: D) => string[]);
        keyAttributes?: string | string[];
    };
}
export = GroupingDataProvider;
