import ArrayDataProvider = require('../ojarraydataprovider');
import { IndexerModel } from '../ojindexer';
import TreeDataProvider = require('../ojtreedataprovider');
import { FetchByKeysParameters, SortCriterion, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListParameters, FetchListResult } from '../ojdataprovider';
declare class IndexerModelTreeDataProvider<K, D> implements IndexerModel, TreeDataProvider<K, D> {
    constructor(data: any[], options?: {
        keyAttributes?: string | string[];
        sections?: string[] | object[];
        sectionChangeHandler?: (section: IndexerModel.Section) => Promise<IndexerModel.Section>;
        groupingAttribute?: string;
        groupingStrategy?: (data: D) => IndexerModel.Section;
        sortComparators?: ArrayDataProvider.SortComparators<D>;
        implicitSort?: Array<SortCriterion<D>>;
    });
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getChildDataProvider(parentKey: any): TreeDataProvider<K, D>;
    getIndexableSections(): IndexerModel.Section[];
    getMissingSections(): IndexerModel.Section[];
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
    setSection(section: IndexerModel.Section): Promise<IndexerModel.Section>;
}
export = IndexerModelTreeDataProvider;
