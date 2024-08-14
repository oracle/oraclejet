export interface DataGridProvider<D> {
    addEventListener(eventType: string, listener: EventListener): void;
    fetchByOffset(parameters: FetchByOffsetGridParameters): Promise<FetchByOffsetGridResults<D>>;
    getCapability(capabilityName: string): any;
    isEmpty(): 'yes' | 'no' | 'unknown';
    removeEventListener(eventType: string, listener: EventListener): void;
}
export class DataGridProviderAddEvent extends Event {
    detail: DataGridProviderAddOperationEventDetail;
    type: 'add';
    constructor(detail: DataGridProviderAddOperationEventDetail);
}
export interface DataGridProviderAddOperationEventDetail {
    axis: 'row' | 'column';
    ranges: Array<{
        offset: number;
        count: number;
    }>;
    version: number;
}
export class DataGridProviderRefreshEvent extends Event {
    detail?: DataGridProviderRefreshOperationEventDetail;
    type: 'refresh';
    constructor(detail?: DataGridProviderRefreshOperationEventDetail);
}
export interface DataGridProviderRefreshOperationEventDetail {
    disregardAfterColumnOffset?: number;
    disregardAfterRowOffset?: number;
    preserved?: 'rows' | 'columns';
}
export class DataGridProviderRemoveEvent extends Event {
    detail: DataGridProviderRemoveOperationEventDetail;
    type: 'remove';
    constructor(detail: DataGridProviderRemoveOperationEventDetail);
}
export interface DataGridProviderRemoveOperationEventDetail {
    axis: 'row' | 'column';
    ranges: Array<{
        offset: number;
        count: number;
    }>;
    version: number;
}
export class DataGridProviderUpdateEvent extends Event {
    detail: DataGridProviderUpdateOperationEventDetail;
    type: 'update';
    constructor(detail: DataGridProviderUpdateOperationEventDetail);
}
export interface DataGridProviderUpdateOperationEventDetail {
    ranges: Array<{
        rowOffset: number;
        columnOffset: number;
        rowCount: number;
        columnCount: number;
    }>;
    version: number;
}
export interface FetchByOffsetGridParameters {
    columnCount: number;
    columnOffset: number;
    fetchRegions?: Set<FetchByOffsetGridParameters.FetchRegionValues>;
    rowCount: number;
    rowOffset: number;
}
export namespace FetchByOffsetGridParameters {
    // tslint:disable-next-line interface-over-type-literal
    type FetchRegionValues = 'all' | 'databody' | 'rowHeader' | 'rowEndHeader' | 'columnHeader' | 'columnEndHeader' | 'rowHeaderLabel' | 'rowEndHeaderLabel' | 'columnHeaderLabel' |
       'columnEndHeaderLabel';
}
export interface FetchByOffsetGridResults<D> {
    columnCount: number;
    columnDone: boolean;
    columnOffset: number;
    fetchParameters: FetchByOffsetGridParameters;
    next?: Promise<FetchByOffsetGridResults<D>>;
    results: {
        columnEndHeader?: Array<GridHeaderItem<D>>;
        columnEndHeaderLabel?: Array<GridItem<D>>;
        columnHeader?: Array<GridHeaderItem<D>>;
        columnHeaderLabel?: Array<GridItem<D>>;
        databody?: Array<GridBodyItem<D>>;
        rowEndHeader?: Array<GridHeaderItem<D>>;
        rowEndHeaderLabel?: Array<GridItem<D>>;
        rowHeader?: Array<GridHeaderItem<D>>;
        rowHeaderLabel?: Array<GridItem<D>>;
    };
    rowCount: number;
    rowDone: boolean;
    rowOffset: number;
    totalColumnCount: number;
    totalRowCount: number;
    version?: number;
}
export interface GridBodyItem<D> {
    columnExtent: number;
    columnIndex: number;
    data: D;
    metadata: GridBodyItemMetadata & {
        [propName: string]: any;
    };
    rowExtent: number;
    rowIndex: number;
}
export interface GridBodyItemMetadata {
    validity?: 'valid' | 'invalidShown' | 'pending' | 'invalidHidden';
}
export interface GridHeaderItem<D> {
    data: D;
    depth: number;
    extent: number;
    index: number;
    level: number;
    metadata: GridHeaderMetadata & {
        [propName: string]: any;
    };
}
export interface GridHeaderMetadata {
    expanded?: 'expanded' | 'collapsed';
    filter?: 'filterable' | 'filtered';
    showRequired?: boolean;
    sortDirection?: 'ascending' | 'descending' | 'unsorted';
    treeDepth?: number;
}
export interface GridItem<D> {
    data: D;
    metadata: GridItemMetadata & {
        [propName: string]: any;
    };
}
export interface GridItemMetadata {
    sortDirection?: 'ascending' | 'descending' | 'unsorted';
}
export interface VersionCapability {
    implementation: 'none' | 'monotonicallyIncreasing';
}
