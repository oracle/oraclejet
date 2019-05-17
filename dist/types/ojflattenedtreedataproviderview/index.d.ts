import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult,
   FetchListParameters } from '../ojdataprovider';
import { KeySet, ExpandedKeySet, ExpandAllKeySet } from '../ojkeyset';
import TreeDataProvider = require('../ojtreedataprovider');
declare class FlattenedTreeDataProviderView<K, D> implements DataProvider<K, D> {
    constructor(dataProvider: TreeDataProvider<K, D>, options?: {
        expanded?: KeySet<K>;
    });
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(evt: Event): boolean;
    fetchByKeys(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    fetchByOffset(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(params?: FetchListParameters<D>): AsyncIterable<FetchListResult<K, D>>;
    getCapability(capabilityName: string): any;
    getExpandedObservable(): {
        subscribe(subscriber: ((expanded: {
            value: KeySet<K>;
            completionPromise: Promise<any>;
        }) => void)): {
            unsubscribe(): void;
            closed(): boolean;
        };
    };
    getTotalSize(): Promise<number>;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
    setExpanded(keySet: KeySet<K>): void;
}
export = FlattenedTreeDataProviderView;
