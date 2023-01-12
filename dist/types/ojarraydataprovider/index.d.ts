import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
declare class ArrayDataProvider<K, D> implements DataProvider<K, D> {
    constructor(data: any[] | (() => any[]), options?: ArrayDataProvider.Options<K, D> | ArrayDataProvider.DeprecatedOptions<D>);
    static getCapability(capabilityName: string): any;
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
declare namespace ArrayDataProvider {
    // tslint:disable-next-line interface-over-type-literal
    type DeprecatedOptions<D> = {
        idAttribute?: string | string[];
        implicitSort?: Array<SortCriterion<D>>;
        keyAttributes?: string | string[];
        keys?: any;
        sortComparators?: SortComparators<D>;
        textFilterAttributes?: string[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type Options<K, D> = {
        implicitSort?: Array<SortCriterion<D>>;
        keyAttributes?: string | string[];
        keys?: K[] | (() => K[]);
        sortComparators?: SortComparators<D>;
        textFilterAttributes?: string[];
    };
    interface SortComparators<D> {
        comparators: Map<keyof D, (a: any, b: any) => number>;
    }
}
export = ArrayDataProvider;
