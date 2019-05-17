/// <reference types="../ojindexer" />
/// <reference types="../ojtreedataprovider" />
/// <reference types='../ojindexer'/>
/// <reference types='../ojtreedataprovider'/>
export class IndexerModelTreeDataProvider implements IndexerModel, TreeDataProvider {
    constructor(data: any[], options?: {
        keyAttributes?: string | string[];
        sections?: string[] | object[];
        sectionChangeHandler?: (section: string | object) => Promise<string | object>;
        groupingAttribute?: string;
        groupingStrategy?: (data: any) => string | object;
        sortComparators?: SortComparators;
        implicitSort?: SortCriterion[];
    });
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getChildDataProvider(parentKey: any): TreeDataProvider<K, D>;
    getIndexableSections(): string[] | object[];
    getMissingSections(): string[] | object[];
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    setSection(section: string | object): Promise<string> | Promise<object>;
}
