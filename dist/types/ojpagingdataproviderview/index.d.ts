import { PagingModel } from '../ojpagingmodel';
import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
declare class PagingDataProviderView<K, D> implements DataProvider<K, D>, PagingModel {
    constructor(dataProvider: DataProvider<K, D>);
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName?: string): any;
    getEndItemIndex(): number;
    getGlobalIndex(value: number): number;
    getPage(): number;
    getPageCount(): number;
    getStartItemIndex(): number;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
    setPage(value: number, options?: object): Promise<any>;
    totalSize(): number;
    totalSizeConfidence(): string;
}
export = PagingDataProviderView;
