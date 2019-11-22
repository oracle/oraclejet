import { ItemMetadata } from '../ojdataprovider';
// tslint:disable-next-line no-unnecessary-class
// tslint:disable-next-line interface-over-type-literal
export type ItemContext<K, D> = {
    key: K;
    data: D;
    metadata?: ItemMetadata<K>;
};
