// tslint:disable-next-line no-unnecessary-class
export interface AttributeExprFilter<D> extends AttributeExprFilterDef<D>, BaseDataFilter<D> {
}
export interface AttributeExprFilterDef<D> {
    attribute: AttributeFilterDef.AttributeExpression | string;
    op: AttributeFilterDef.AttributeOperator;
    value: any;
}
// tslint:disable-next-line no-unnecessary-class
export interface AttributeFilter<D> extends AttributeFilterDef<D>, BaseDataFilter<D> {
}
export interface AttributeFilterCapability {
    defaultShape?: object;
    expansion?: object;
    ordering?: object;
}
export interface AttributeFilterDef<D> {
    collationOptions?: {
        sensitivity?: 'base' | 'accent' | 'case' | 'variant';
    };
    op: AttributeFilterDef.AttributeOperator;
    value: any;
}
export namespace AttributeFilterDef {
    type AttributeExpression = "*";
    type AttributeOperator = "$co" | "$eq" | "$ew" | "$pr" | "$gt" | "$ge" | "$lt" | "$le" | "$ne" | "$regex" | "$sw";
}
export interface AttributeFilterOperator<D> {
    attribute: string;
    op: AttributeFilterOperator.AttributeOperator;
    value: any;
}
export namespace AttributeFilterOperator {
    type AttributeOperator = "$co" | "$eq" | "$ew" | "$pr" | "$gt" | "$ge" | "$lt" | "$le" | "$ne" | "$regex" | "$sw";
}
export interface BaseDataFilter<D> {
    filter(item: D, index?: number, array?: D[]): boolean;
}
// tslint:disable-next-line no-unnecessary-class
export interface CompoundFilter<D> extends CompoundFilterDef<D>, BaseDataFilter<D> {
}
export interface CompoundFilterDef<D> {
    criteria: Array<AttributeFilterDef<D> | AttributeExprFilterDef<D> | CompoundFilterDef<D>>;
    op: CompoundFilterDef.CompoundOperator;
}
export namespace CompoundFilterDef {
    type CompoundOperator = "$and" | "$or";
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
// tslint:disable-next-line no-unnecessary-class
export namespace DataFilter {
    // tslint:disable-next-line interface-over-type-literal
    type Filter<D> = AttributeFilter<D> | AttributeExprFilter<D> | CompoundFilter<D> | ExtendedCompoundFilter<D> | NestedFilter<D> | TextFilter<D>;
    // tslint:disable-next-line interface-over-type-literal
    type FilterDef<D> = AttributeFilterDef<D> | AttributeExprFilterDef<D> | CompoundFilterDef<D> | ExtendedCompoundFilterDef<D> | NestedFilterDef<D> | TextFilterDef;
}
export interface DataMapping<K, D, Kin, Din> {
    mapFields: (item: Item<Kin, Din>) => Item<K, D>;
    mapFilterCriterion?: (filterCriterion: DataFilter.Filter<D>) => DataFilter.Filter<Din>;
    mapSortCriteria?: (sortCriteria: Array<SortCriterion<D>>) => Array<SortCriterion<Din>>;
    unmapFilterCriterion?: (filterCriterion: DataFilter.Filter<Din>) => DataFilter.Filter<D>;
    unmapSortCriteria?: (sortCriteria: Array<SortCriterion<Din>>) => Array<SortCriterion<D>>;
}
export interface DataProvider<K, D> extends EventTarget {
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
export interface DataProviderAddOperationEventDetail<K, D> extends DataProviderOperationEventDetail<K, D> {
    addBeforeKeys?: K[];
    parentKeys?: K[];
}
export class DataProviderMutationEvent<K, D> implements Event {
    AT_TARGET: 2;
    BUBBLING_PHASE: 3;
    CAPTURING_PHASE: 1;
    NONE: 0;
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    composedPath: () => EventTarget[];
    currentTarget: EventTarget;
    deepPath: () => EventTarget[];
    defaultPrevented: boolean;
    detail: DataProviderMutationEventDetail<K, D>;
    eventPhase: number;
    initEvent: (eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void;
    isTrusted: boolean;
    preventDefault: () => void;
    returnValue: boolean;
    scoped: boolean;
    srcElement: Element | null;
    stopImmediatePropagation: () => void;
    stopPropagation: () => void;
    target: EventTarget;
    timeStamp: number;
    type: string;
    constructor(detail: DataProviderMutationEventDetail<K, D>);
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
    transient?: boolean;
}
export class DataProviderRefreshEvent<K> {
    AT_TARGET: 2;
    BUBBLING_PHASE: 3;
    CAPTURING_PHASE: 1;
    NONE: 0;
    bubbles: boolean;
    cancelBubble: boolean;
    cancelable: boolean;
    composed: boolean;
    composedPath: () => EventTarget[];
    currentTarget: EventTarget;
    deepPath: () => EventTarget[];
    defaultPrevented: boolean;
    detail?: DataProviderRefreshEventDetail<K>;
    eventPhase: number;
    initEvent: (eventTypeArg: string, canBubbleArg: boolean, cancelableArg: boolean) => void;
    isTrusted: boolean;
    preventDefault: () => void;
    returnValue: boolean;
    scoped: boolean;
    srcElement: Element | null;
    stopImmediatePropagation: () => void;
    stopPropagation: () => void;
    target: EventTarget;
    timeStamp: number;
    type: string;
    constructor();
}
export interface DataProviderRefreshEventDetail<K> {
    disregardAfterKey?: K;
    keys?: K;
}
export interface DedupCapability {
    type: 'global' | 'none' | 'iterator';
}
export interface EventFilteringCapability {
    type: 'global' | 'none' | 'iterator';
}
// tslint:disable-next-line no-unnecessary-class
export interface ExtendedCompoundFilter<D> extends ExtendedCompoundFilterDef<D>, BaseDataFilter<D> {
}
export interface ExtendedCompoundFilterDef<D> extends Omit<CompoundFilterDef<D>, 'criteria'> {
    criteria: Array<AttributeFilterDef<D> | AttributeExprFilterDef<D> | ExtendedCompoundFilterDef<D> | NestedFilterDef<D> | TextFilterDef>;
}
export interface FetchAttribute {
    attributes?: Array<string | FetchAttribute>;
    name: string;
}
export interface FetchByKeysCapability {
    attributeFilter?: AttributeFilterCapability;
    caching?: 'all' | 'none' | 'visitedByCurrentIterator';
    implementation: 'iteration' | 'lookup' | 'batchLookup';
}
export namespace FetchByKeysMixin {
    function applyMixin(derivedCtor: {
        new (): DataProvider<any, any>;
    }): any;
}
export interface FetchByKeysParameters<K> {
    attributes?: Array<string | FetchAttribute>;
    keys: Set<K>;
    scope?: FetchByKeysParameters.Scope;
    signal?: AbortSignal;
}
export namespace FetchByKeysParameters {
    type Scope = "local" | "global";
}
export interface FetchByKeysResults<K, D> {
    fetchParameters: FetchByKeysParameters<K>;
    results: Map<K, Item<K, D>>;
}
export interface FetchByOffsetCapability {
    attributeFilter?: AttributeFilterCapability;
    caching?: 'all' | 'none' | 'visitedByCurrentIterator';
    implementation: 'iteration' | 'randomAccess';
    totalFilteredRowCount?: 'exact' | 'none';
}
export namespace FetchByOffsetMixin {
    function applyMixin(derivedCtor: {
        new (): DataProvider<any, any>;
    }): any;
}
export interface FetchByOffsetParameters<D> extends FetchListParameters<D> {
    attributes?: Array<string | FetchAttribute>;
    includeFilteredRowCount?: 'enabled' | 'disabled';
    offset: number;
    signal?: AbortSignal;
}
export interface FetchByOffsetResults<K, D> {
    done: boolean;
    fetchParameters: FetchByOffsetParameters<D>;
    results: Array<Item<K, D>>;
    totalFilteredRowCount?: number;
}
export interface FetchCapability {
    attributeFilter?: AttributeFilterCapability;
    caching?: 'all' | 'none' | 'visitedByCurrentIterator';
}
export interface FetchFirstCapability {
    attributeFilter?: AttributeFilterCapability;
    caching?: 'all' | 'none' | 'visitedByCurrentIterator';
    iterationSpeed: 'immediate' | 'delayed';
    totalFilteredRowCount?: 'exact' | 'none';
}
export interface FetchListParameters<D> {
    attributes?: Array<string | FetchAttribute>;
    clientId?: symbol;
    filterCriterion?: DataFilter.Filter<D>;
    includeFilteredRowCount?: 'enabled' | 'disabled';
    signal?: AbortSignal;
    size?: number;
    sortCriteria?: Array<SortCriterion<D>>;
}
export interface FetchListResult<K, D> {
    data: D[];
    fetchParameters: FetchListParameters<D>;
    metadata: Array<ItemMetadata<K>>;
    totalFilteredRowCount?: number;
}
export interface FilterCapability {
    attributeExpression?: AttributeFilterDef.AttributeExpression[];
    collationOptions?: {
        sensitivity?: Array<'base' | 'accent' | 'case' | 'variant'>;
    };
    nestedFilter?: any;
    operators?: Array<AttributeFilterDef.AttributeOperator | CompoundFilterDef.CompoundOperator | NestedFilterDef.NestedOperator>;
    textFilter?: any;
    textFilterMatching?: {
        matchBy?: Array<'phrase' | 'startsWith' | 'contains' | 'fuzzy'>;
    };
}
export class FilterFactory<D> {
    static getFilter(options: {
        filterDef: DataFilter.FilterDef<any>;
        filterOptions?: any;
    }): DataFilter.Filter<any>;
}
export interface FilterOperator<D> {
    op: AttributeFilterOperator.AttributeOperator | CompoundFilterOperator.CompoundOperator;
    filter(data: any[]): any[];
}
export interface Item<K, D> extends ItemWithOptionalData<K, D> {
    data: D;
    metadata: ItemMetadata<K>;
}
export interface ItemMessage {
    detail: string;
    severity?: (ItemMessage.SEVERITY_TYPE | ItemMessage.SEVERITY_LEVEL);
    summary: string;
}
export namespace ItemMessage {
    // tslint:disable-next-line interface-over-type-literal
    type SEVERITY_LEVEL = 1 | 2 | 3 | 4 | 5;
    // tslint:disable-next-line interface-over-type-literal
    type SEVERITY_TYPE = 'confirmation' | 'info' | 'warning' | 'error' | 'fatal';
}
export interface ItemMetadata<K> {
    indexFromParent?: number;
    isLeaf?: boolean;
    key: K;
    message?: ItemMessage;
    parentKey?: K;
    suggestion?: SuggestionMetadata;
    treeDepth?: number;
}
export interface ItemWithOptionalData<K, D> {
    data?: D;
    metadata: ItemMetadata<K>;
}
// tslint:disable-next-line no-unnecessary-class
export interface NestedFilter<D> extends NestedFilterDef<D>, BaseDataFilter<D> {
}
export interface NestedFilterDef<D> {
    attribute: AttributeFilterDef.AttributeExpression | string;
    criterion: AttributeFilterDef<D> | AttributeExprFilterDef<D> | ExtendedCompoundFilterDef<D> | NestedFilterDef<D>;
    op: NestedFilterDef.NestedOperator;
}
export namespace NestedFilterDef {
    type NestedOperator = "$exists";
}
export interface SortCapability {
    attributes: 'none' | 'single' | 'multiple';
}
export interface SortCriterion<D> {
    attribute: keyof D;
    direction: string;
}
// tslint:disable-next-line no-unnecessary-class
export interface SuggestionMetadata {
}
// tslint:disable-next-line no-unnecessary-class
export interface TextFilter<D> extends TextFilterDef, BaseDataFilter<D> {
}
export interface TextFilterDef {
    matchBy?: 'phrase' | 'startsWith' | 'contains' | 'fuzzy' | 'unknown';
    text: string;
}
