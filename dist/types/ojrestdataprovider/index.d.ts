import { DataProvider, SortCriterion, FetchByKeysParameters, ContainsKeysResults, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListResult, FetchListParameters,
   FetchByKeysCapability, FetchByOffsetCapability, FilterCapability, SortCapability, DataProviderMutationEventDetail, ItemMetadata } from '../ojdataprovider';
export class RESTDataProvider<K, D> implements DataProvider<K, D> {
    constructor(options: RESTDataProvider.Options<K, D>);
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
    mutate(detail: DataProviderMutationEventDetail<K, D>): void;
    refresh(): void;
    removeEventListener(eventType: string, listener: EventListener): void;
}
export namespace RESTDataProvider {
    // tslint:disable-next-line interface-over-type-literal
    type Capabilities = {
        fetchByKeys?: FetchByKeysCapability;
        fetchByOffset?: FetchByOffsetCapability;
        filter?: FilterCapability;
        sort?: SortCapability;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchByKeysRequestTransform<K> = (options: FetchByKeysRequestTransformOptions<K>) => Promise<Request>;
    // tslint:disable-next-line interface-over-type-literal
    type FetchByKeysRequestTransformOptions<K> = {
        fetchParameters: FetchByKeysParameters<K>;
        fetchType: 'fetchByKeys';
        url: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchByKeysTransforms<K, D> = {
        request?: FetchByKeysRequestTransform<K>;
        response?: FetchResponseTransform<K, D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchByOffsetRequestTransform<K, D> = (options: FetchByOffsetRequestTransformOptions<K, D>) => Promise<Request>;
    // tslint:disable-next-line interface-over-type-literal
    type FetchByOffsetRequestTransformOptions<K, D> = {
        fetchOptions: {
            textFilterAttributes?: Options<K, D>['textFilterAttributes'];
        };
        fetchParameters: FetchByOffsetParameters<D>;
        fetchType: 'fetchFirst' | 'fetchByOffset';
        url: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchByOffsetTransforms<K, D> = {
        request?: FetchByOffsetRequestTransform<K, D>;
        response?: FetchResponseTransform<K, D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchErrorDetail<K, D> = {
        err: TypeError;
        error: TypeError;
        fetchParameters: FetchListParameters<D> | FetchByKeysParameters<K> | FetchByOffsetParameters<D>;
        fetchType: 'fetchFirst' | 'fetchByKeys' | 'fetchByOffset';
        options: Options<K, D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchResponseErrorDetail<K, D> = {
        fetchParameters: FetchListParameters<D> | FetchByKeysParameters<K> | FetchByOffsetParameters<D>;
        fetchType: 'fetchFirst' | 'fetchByKeys' | 'fetchByOffset';
        options: Options<K, D>;
        response: FetchResponseOptions;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchResponseOptions = {
        body: any;
        headers: Headers;
        status: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchResponseTransform<K, D> = (options: FetchResponseTransformOptions) => Promise<FetchResponseTransformResult<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type FetchResponseTransformOptions = {
        body: any;
        headers: Headers;
        status: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FetchResponseTransformResult<K, D> = {
        data: D[];
        hasMore?: boolean;
        keys?: K[];
        metadata?: ItemMetadata<K>[];
        totalSize?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Options<K, D> = {
        capabilities?: Capabilities;
        error?: ((response: FetchErrorDetail<K, D> | FetchResponseErrorDetail<K, D>) => void);
        implicitSort?: Array<SortCriterion<D>>;
        iterationLimit?: number;
        keyAttributes: string | string[];
        textFilterAttributes?: string[];
        transforms: Transforms<K, D>;
        url: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Transforms<K, D> = {
        fetchByKeys?: FetchByKeysTransforms<K, D>;
        fetchByOffset?: FetchByOffsetTransforms<K, D>;
        fetchFirst?: FetchByOffsetTransforms<K, D>;
    };
}
