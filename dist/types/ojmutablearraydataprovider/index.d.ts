import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
declare class MutableArrayDataProvider<K, D> implements DataProvider<K, D> {
    data: D[];
    constructor(data?: any[], options?: MutableArrayDataProvider.Options<D>);
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    createOptimizedKeyMap?(initialMap?: Map<K, D>): Map<K, D>;
    createOptimizedKeySet?(initialSet?: Set<K>): Set<K>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
declare namespace MutableArrayDataProvider {
    // tslint:disable-next-line interface-over-type-literal
    type Options<D> = {
        implicitSort?: Array<SortCriterion<D>>;
        keyAttributes?: string | string[];
        sortComparators?: SortComparators<D>;
        textFilterAttributes?: string[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type SortComparators<D> = {
        comparators: Map<keyof D, (a: any, b: any) => number>;
    };
}
export = MutableArrayDataProvider;
