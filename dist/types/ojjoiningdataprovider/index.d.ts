import { DataProvider, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, DataMapping, FetchListResult, FetchListParameters,
   FetchAttribute } from '../ojdataprovider';
declare namespace JoiningDataProvider {
    interface DataProviderJoinInfo<BD, JK, JD> {
        foreignKeyMapping: SingleForeignKey<BD, any, JK> | MultipleForeignKeys<BD, any, JK>;
        joinedDataProvider: DataProvider<JK, JD>;
    }
    // tslint:disable-next-line interface-over-type-literal
    type DataProviderOptions<D, BD> = {
        joins: Record<keyof Omit<D, keyof BD>, DataProviderJoinInfo<D, any, any>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Options<D, BD> = {
        joins: Record<keyof Omit<D, keyof BD>, DataProviderJoinInfo<D, any, any>>;
    };
    interface MultipleForeignKeys<BD, FK extends keyof BD, JK> {
        foreignKeys: FK;
        transform: (key: object) => FK;
    }
    interface SingleForeignKey<BD, FK extends keyof BD, JK> {
        foreignKey: FK;
        transform?: (key: object) => FK;
    }
}
declare class JoiningDataProvider<K, D extends BD, BD> implements DataProvider<K, D> {
    constructor(baseDataProvider: DataProvider<K, BD>, options: JoiningDataProvider.Options<D, BD> | JoiningDataProvider.DataProviderOptions<D, BD>);
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
export = JoiningDataProvider;
