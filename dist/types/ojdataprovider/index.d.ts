export interface AttributeFilter<D> {
    filterfilter(item: D, index?: number, array?: D[]): boolean;
}
export interface AttributeFilterCapability {
    defaultShape?: object;
    expansion?: object;
    ordering?: object;
}
export interface AttributeFilterDef<D> {
    attribute?: string;
    op: string;
    value: any;
}
export interface AttributeFilterOperator<D> {
    attribute: string;
    op: AttributeFilterOperator.AttributeOperator;
    value: any;
}
export namespace AttributeFilterOperator {
    type AttributeOperator = "$co" | "$eq" | "$ew" | "$pr" | "$gt" | "$ge" | "$lt" | "$le" | "$ne" | "$regex" | "$sw";
}
export interface CompoundFilter<D> {
    filterfilter(item: D, index?: number, array?: D[]): boolean;
}
export interface CompoundFilterDef<D> {
    criteria: Array<AttributeFilterDef<D> | CompoundFilterDef<D>>;
    op: string;
}
export interface CompoundFilterOperator<D> {
    criteria: Array<FilterOperator<D>>;
    op: CompoundFilterOperator.CompoundOperator;
}
export namespace CompoundFilterOperator {
    type CompoundOperator = "$and" | "$or";
}
export interface ContainsKeysResults<K> {
    containsParameters: FetchByKeysParameters<K>;
    results: Set<K>;
}
export interface DataMapping<K, D, Kin, Din> {
    mapFields: (item: Item<Kin, Din>) => Item<K, D>;
    mapFilterCriterion?: (filterCriterion: AttributeFilter<D> | CompoundFilter<D>) => AttributeFilter<Din> | CompoundFilter<Din>;
    mapSortCriteria?: (sortCriteria: Array<SortCriterion<D>>) => Array<SortCriterion<Din>>;
    unmapSortCriteria?: (sortCriteria: Array<SortCriterion<Din>>) => Array<SortCriterion<D>>;
}
export interface DataProvider<K, D> extends EventTarget {
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    createOptimizedKeyMap?(initialMap?: Map<K, D>): Map<K, D>;
    createOptimizedKeyMap?(initialMap?: Map<K, D>): Map<K, D>;
    createOptimizedKeySet?(initialSet?: Set<K>): Set<K>;
    createOptimizedKeySet?(initialSet?: Set<K>): Set<K>;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
}
export interface DataProviderAddOperationEventDetail<K, D> extends DataProviderOperationEventDetail<K, D> {
    addBeforeKeys?: K[];
    parentKeys?: K[];
}
export interface DataProviderMutationEventDetail<K, D> {
    add?: DataProviderAddOperationEventDetail<K, D>;
    remove?: DataProviderOperationEventDetail<K, D>;
    update?: DataProviderOperationEventDetail<K, D>;
}
export interface DataProviderOperationEventDetail<K, D> {
    data?: D[];
    indexes?: number[];
    keys: Set<K>;
    metadata?: Array<ItemMetadata<K>>;
}
export interface FetchAttribute {
    attributes?: Array<string | FetchAttribute>;
    name: string;
}
export interface FetchByKeysCapability<D> {
    implementation: 'iteration' | 'lookup';
}
export namespace FetchByKeysMixin {
    function applyMixin(derivedCtor: {
        new (): DataProvider<any, any>;
    }): any;
}
export interface FetchByKeysParameters<K> {
    attributes?: Array<string | FetchAttribute>;
    keys: Set<K>;
    scope: 'local' | 'global';
}
export interface FetchByKeysResults<K, D> {
    fetchParameters: FetchByKeysParameters<K>;
    results: Map<K, Item<K, D>>;
}
export interface FetchByOffsetCapability<D> {
    implementation: 'iteration' | 'randomAccess';
}
export namespace FetchByOffsetMixin {
    function applyMixin(derivedCtor: {
        new (): DataProvider<any, any>;
    }): any;
}
export interface FetchByOffsetParameters<D> extends FetchListParameters<D> {
    attributes?: Array<string | FetchAttribute>;
    offset: number;
}
export interface FetchByOffsetResults<K, D> {
    done: boolean;
    fetchParameters: FetchByOffsetParameters<D>;
    results: Array<Item<K, D>>;
}
export interface FetchCapability {
    attributeFilter: AttributeFilterCapability;
}
export interface FetchListParameters<D> {
    attributes?: Array<string | FetchAttribute>;
    filterCriterion?: AttributeFilter<D> | CompoundFilter<D> | FilterOperator<D>;
    size: number;
    sortCriteria?: Array<SortCriterion<D>>;
}
export interface FetchListResult<K, D> {
    data: D[];
    fetchParameters: FetchListParameters<D>;
    metadata: Array<ItemMetadata<K>>;
}
export interface FilterCapability {
    operators: string[];
}
export class FilterFactory<D> {
    getFilter(options: {
        filterDef: AttributeFilterDef<D> | CompoundFilterDef<D>;
    }): AttributeFilter<D> | CompoundFilter<D>;
}
export interface FilterOperator<D> {
    op: AttributeFilterOperator.AttributeOperator | CompoundFilterOperator.CompoundOperator;
    filter(data: any[]): any[];
}
export interface Item<K, D> {
    data: D;
    metadata: ItemMetadata<K>;
}
export interface ItemMetadata<K> {
    key: K;
}
export interface SortCapability<D> {
    attributes: 'none' | 'single' | 'multiple';
}
export interface SortCriterion<D> {
    attribute: keyof D;
    direction: string;
}
