import { DataGridProvider, FetchByOffsetGridParameters, FetchByOffsetGridResults } from '../ojdatagridprovider';
import { KeySet } from '../ojkeyset';
import { DataProvider, Item } from '../ojdataprovider';
export class RowDataGridProvider<D, K, R> implements DataGridProvider<{
    data: D;
}> {
    constructor(dataProvider: DataProvider<K, R>, options?: RowDataGridProvider.Options<K, R>);
    addEventListener(eventType: string, listener: EventListener): void;
    fetchByOffset(parameters: FetchByOffsetGridParameters): Promise<FetchByOffsetGridResults<{
        data: D;
    }>>;
    getCapability(capabilityName: string): any;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
export namespace RowDataGridProvider {
    // tslint:disable-next-line interface-over-type-literal
    type ColumnHeaderLabelsFunction<R> = (headers: NestedHeader[]) => string[];
    // tslint:disable-next-line interface-over-type-literal
    type ColumnHeaders<R> = {
        column?: 'attributeName' | string[] | NestedHeader[] | ColumnHeadersFunction<R>;
        columnEnd?: 'attributeName' | string[] | NestedHeader[] | ColumnHeadersFunction<R>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnHeadersFunction<R> = (columns: Array<keyof R>) => NestedHeader[];
    // tslint:disable-next-line interface-over-type-literal
    type Columns<K, R> = {
        databody?: Array<keyof R> | ColumnsFunction<K, R>;
        rowEndHeader?: Array<keyof R> | ColumnsFunction<K, R>;
        rowHeader?: Array<keyof R> | ColumnsFunction<K, R>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnsFunction<K, R> = (firstItem: Item<K, R>) => Array<keyof R>;
    // tslint:disable-next-line interface-over-type-literal
    type HeaderLabels<R> = {
        column?: string[] | ColumnHeaderLabelsFunction<R>;
        columnEnd?: string[] | ColumnHeaderLabelsFunction<R>;
        row?: 'attributeName' | string[] | RowHeaderLabelsFunction<R>;
        rowEnd?: 'attributeName' | string[] | RowHeaderLabelsFunction<R>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NestedHeader = {
        children?: NestedHeader[];
        data?: string;
        depth?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Options<K, R> = {
        columnHeaders?: ColumnHeaders<R>;
        columns?: Columns<K, R>;
        expandedObservable?: {
            subscribe(subscriber: ((expanded: {
                value: KeySet<K>;
                completionPromise: Promise<any>;
            }) => void)): {
                unsubscribe(): void;
                closed(): boolean;
            };
        };
        headerLabels?: HeaderLabels<R>;
        sortable?: boolean;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowHeaderLabelsFunction<R> = (columns: Array<keyof R>) => string[];
    interface GridBodyItemMetadata<K, R> {
        rowItem?: Item<K, R>;
    }
}
