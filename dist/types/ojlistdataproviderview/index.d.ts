import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, DataMapping, FetchListResult, FetchListParameters,
   FetchAttribute, DataFilter } from '../ojdataprovider';
declare class ListDataProviderView<K, D, Kin, Din> implements DataProvider<K, D> {
    attributes?: Array<string | FetchAttribute>;
    dataMapping?: DataMapping<K, D, Kin, Din>;
    filterCriterion?: DataFilter.Filter<D>;
    from?: Kin;
    offset?: number;
    sortCriteria?: Array<SortCriterion<D>>;
    constructor(dataProvider: DataProvider<Kin, Din>, options?: ListDataProviderView.Options<K, D, Kin, Din>);
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
declare namespace ListDataProviderView {
    // tslint:disable-next-line interface-over-type-literal
    type Options<K, D, Kin, Din> = {
        attributes?: Array<string | FetchAttribute>;
        dataMapping?: DataMapping<K, D, Kin, Din>;
        filterCriterion?: DataFilter.Filter<D>;
        from?: Kin;
        offset?: number;
        sortCriteria?: Array<SortCriterion<D>>;
    };
}
export = ListDataProviderView;
