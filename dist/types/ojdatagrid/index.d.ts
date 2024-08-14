import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { ImmutableKeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { DataGridProvider, GridBodyItem, GridHeaderItem, GridItem } from '../ojdatagridprovider';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojDataGrid<K, D> extends baseComponent<ojDataGridSettableProperties<K, D>> {
    bandingInterval: {
        column?: number;
        row?: number;
    };
    cell: {
        alignment?: {
            horizontal?: ((context: ojDataGrid.CellContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
            vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
        };
        className?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
        editable?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string;
        renderer?: ((context: ojDataGrid.CellContext<K, D>) => {
            insert: HTMLElement | string;
        } | void | null) | null;
        style?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
    };
    currentCell: ojDataGrid.CurrentCell<K> | null;
    data: DataGridProvider<D>;
    dataTransferOptions: {
        copy?: 'disable' | 'enable';
        cut?: 'disable' | 'enable';
        fill?: 'disable' | 'enable';
        headerLabelCut?: 'disable' | 'enable';
        paste?: 'disable' | 'enable';
    };
    dnd: {
        drag?: {
            columnEndLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            columnLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            columns?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderContext) => void);
            };
            rowEndLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            rowLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            rows?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderContext) => void);
            };
        };
        drop?: {
            columnEndLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            columnLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            columns?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
            };
            rowEndLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            rowLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            rows?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
            };
        };
        reorder?: {
            row?: 'enable' | 'disable';
        };
    };
    editMode: 'none' | 'cellNavigation' | 'cellEdit';
    frozenColumnCount: number;
    frozenRowCount: number;
    gridlines: {
        horizontal?: 'visible' | 'hidden';
        vertical?: 'visible' | 'hidden';
    };
    header: {
        column?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            filterable?: ((context: ojDataGrid.HeaderContext<K, D>) => 'auto' | 'disable') | 'auto' | 'disable';
            freezable?: 'enable' | 'disable';
            hidable?: string;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                    insertContent?: never;
                } | {
                    insert?: never;
                    insertContent: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
                insertContent?: never;
            } | {
                insert?: never;
                insertContent: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        columnEnd?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        row?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            freezable?: 'enable' | 'disable';
            hidable?: string;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                    insertContent?: never;
                } | {
                    insert?: never;
                    insertContent: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
                insertContent?: never;
            } | {
                insert?: never;
                insertContent: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width?: 'enable' | 'disable';
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        rowEnd?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width?: 'enable' | 'disable';
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
    };
    hiddenColumns: ImmutableKeySet.ImmutableSet<number>;
    hiddenRows: ImmutableKeySet.ImmutableSet<number>;
    scrollPolicy: 'auto' | 'loadMoreOnScroll' | 'scroll';
    scrollPolicyOptions: {
        maxColumnCount?: number;
        maxRowCount?: number;
    };
    scrollPosition: {
        columnIndex?: number;
        columnKey?: K;
        offsetX?: number;
        offsetY?: number;
        rowIndex?: number;
        rowKey?: K;
        x?: number;
        y?: number;
    };
    scrollToKey: 'auto' | 'capability' | 'always' | 'never';
    selection: Array<ojDataGrid.Selection<K>>;
    selectionMode: {
        cell?: 'none' | 'single' | 'multiple';
        row?: 'none' | 'single' | 'multiple';
    };
    translations: {
        accessibleActionableMode?: string;
        accessibleCollapsed?: string;
        accessibleColumnContext?: string;
        accessibleColumnEndHeaderContext?: string;
        accessibleColumnEndHeaderLabelContext?: string;
        accessibleColumnHeaderContext?: string;
        accessibleColumnHeaderLabelContext?: string;
        accessibleColumnHierarchicalFull?: string;
        accessibleColumnHierarchicalPartial?: string;
        accessibleColumnHierarchicalUnknown?: string;
        accessibleColumnSelected?: string;
        accessibleColumnSpanContext?: string;
        accessibleContainsControls?: string;
        accessibleExpanded?: string;
        accessibleFirstColumn?: string;
        accessibleFirstRow?: string;
        accessibleLastColumn?: string;
        accessibleLastRow?: string;
        accessibleLevelContext?: string;
        accessibleLevelHierarchicalContext?: string;
        accessibleMultiCellSelected?: string;
        accessibleNavigationMode?: string;
        accessibleRangeSelectModeOff?: string;
        accessibleRangeSelectModeOn?: string;
        accessibleRowCollapsed?: string;
        accessibleRowContext?: string;
        accessibleRowEndHeaderContext?: string;
        accessibleRowEndHeaderLabelContext?: string;
        accessibleRowExpanded?: string;
        accessibleRowHeaderContext?: string;
        accessibleRowHeaderLabelContext?: string;
        accessibleRowHierarchicalFull?: string;
        accessibleRowHierarchicalPartial?: string;
        accessibleRowHierarchicalUnknown?: string;
        accessibleRowSelected?: string;
        accessibleRowSpanContext?: string;
        accessibleSelectionAffordanceBottom?: string;
        accessibleSelectionAffordanceTop?: string;
        accessibleSortAscending?: string;
        accessibleSortDescending?: string;
        accessibleSortable?: string;
        accessibleStateSelected?: string;
        accessibleSummaryEstimate?: string;
        accessibleSummaryExact?: string;
        accessibleSummaryExpanded?: string;
        collapsedText?: string;
        columnWidth?: string;
        expandedText?: string;
        labelCopyCells?: string;
        labelCut?: string;
        labelCutCells?: string;
        labelDisableNonContiguous?: string;
        labelEnableNonContiguous?: string;
        labelFillCells?: string;
        labelFilter?: string;
        labelFilterCol?: string;
        labelFreezeCol?: string;
        labelFreezeRow?: string;
        labelHideColumn?: string;
        labelHideRow?: string;
        labelPaste?: string;
        labelPasteCells?: string;
        labelResize?: string;
        labelResizeColumn?: string;
        labelResizeDialogApply?: string;
        labelResizeDialogCancel?: string;
        labelResizeDialogSubmit?: string;
        labelResizeFitToContent?: string;
        labelResizeHeight?: string;
        labelResizeRow?: string;
        labelResizeWidth?: string;
        labelSelectMultiple?: string;
        labelSortAsc?: string;
        labelSortCol?: string;
        labelSortColAsc?: string;
        labelSortColDsc?: string;
        labelSortDsc?: string;
        labelSortRow?: string;
        labelSortRowAsc?: string;
        labelSortRowDsc?: string;
        labelUnfreezeCol?: string;
        labelUnfreezeRow?: string;
        labelUnhideColumn?: string;
        labelUnhideRow?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        msgReadOnly?: string;
        resizeColumnDialog?: string;
        resizeRowDialog?: string;
        rowHeight?: string;
        tooltipRequired?: string;
    };
    addEventListener<T extends keyof ojDataGridEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojDataGridEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDataGridSettableProperties<K, D>>(property: T): ojDataGrid<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDataGridSettableProperties<K, D>>(property: T, value: ojDataGridSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDataGridSettableProperties<K, D>>): void;
    setProperties(properties: ojDataGridSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojDataGrid.CellContext<K, D> & {
        subId: 'oj-datagrid-cell';
    } | ojDataGrid.HeaderContext<K, D> & {
        subId: 'oj-datagrid-header';
    } | ojDataGrid.LabelContext<K, D> & {
        subId: 'oj-datagrid-header-label';
    };
    refresh(): void;
}
export namespace ojDataGrid {
    interface ojBeforeCurrentCell<K> extends CustomEvent<{
        currentCell: CurrentCell<K>;
        previousCurrentCell: CurrentCell<K>;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeEdit<K, D> extends CustomEvent<{
        cellContext: CellContext<K, D>;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeEditEnd<K, D> extends CustomEvent<{
        cancelEdit: boolean;
        cellContext: CellContext<K, D>;
        [propName: string]: any;
    }> {
    }
    interface ojCellResize extends CustomEvent<{
        dimension: 'columnHeaderHeight' | 'columnEndHeaderHeight' | 'rowHeaderWidth' | 'rowEndHeaderWidth' | 'columnWidth' | 'rowHeight';
        indices: number[] | undefined;
        levels: number[] | undefined;
        size: number;
        [propName: string]: any;
    }> {
    }
    interface ojCollapseRequest<D> extends CustomEvent<{
        axis: 'row' | 'column';
        item: GridHeaderItem<D>;
        [propName: string]: any;
    }> {
    }
    interface ojCopyRequest<D> extends CustomEvent<{
        sourceRange: Range;
        [propName: string]: any;
    }> {
    }
    interface ojCutRequest<D> extends CustomEvent<{
        sourceRange: Range;
        [propName: string]: any;
    }> {
    }
    interface ojExpandRequest<D> extends CustomEvent<{
        axis: 'row' | 'column';
        item: GridHeaderItem<D>;
        [propName: string]: any;
    }> {
    }
    interface ojFillRequest<D> extends CustomEvent<{
        action: 'flood' | 'down' | 'end';
        sourceRange: Range;
        targetRange: Range;
        [propName: string]: any;
    }> {
    }
    interface ojFilterRequest<D> extends CustomEvent<{
        anchor: Element;
        axis: 'column';
        item: GridHeaderItem<D>;
        launcher: Element;
        [propName: string]: any;
    }> {
    }
    interface ojHeaderLabelCutRequest extends CustomEvent<{
        axis: 'row' | 'column' | 'rowEnd' | 'columnEnd';
        level: number;
        [propName: string]: any;
    }> {
    }
    interface ojPasteRequest<D> extends CustomEvent<{
        action: 'cut' | 'copy' | 'unknown';
        sourceRange: Range;
        targetRange: Range;
        [propName: string]: any;
    }> {
    }
    interface ojResize extends CustomEvent<{
        header: string | number;
        newDimensions: {
            height: number;
            width: number;
        };
        oldDimensions: {
            height: number;
            width: number;
        };
        [propName: string]: any;
    }> {
    }
    interface ojScroll extends CustomEvent<{
        scrollX: number;
        scrollY: number;
        [propName: string]: any;
    }> {
    }
    interface ojSort extends CustomEvent<{
        direction: 'ascending' | 'descending';
        header: any;
        [propName: string]: any;
    }> {
    }
    interface ojSortLabelRequest<D> extends CustomEvent<{
        axis: 'row' | 'column' | 'rowEnd' | 'columnEnd';
        direction: 'ascending' | 'descending';
        item: GridItem<D>;
        level: number;
        [propName: string]: any;
    }> {
    }
    interface ojSortRequest<D> extends CustomEvent<{
        axis: 'row' | 'column';
        direction: 'ascending' | 'descending';
        item: GridHeaderItem<D>;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type bandingIntervalChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["bandingInterval"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["cell"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentCellChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["currentCell"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataTransferOptionsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["dataTransferOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type editModeChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["editMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type frozenColumnCountChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["frozenColumnCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type frozenRowCountChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["frozenRowCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["header"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenColumnsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["hiddenColumns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenRowsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["hiddenRows"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicyOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollToKeyChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollToKey"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type CellContext<K, D> = {
        cell: D;
        componentElement: Element;
        data: D;
        datasource: DataProvider<K, D> | null;
        extents: {
            column: number;
            row: number;
        };
        indexFromParent: number;
        indexes: {
            column: number;
            row: number;
        };
        isLeaf: boolean;
        keys: {
            column: K;
            row: K;
        };
        metadata: any;
        mode: 'edit' | 'navigation';
        parentElement: Element;
        parentKey: K;
        treeDepth: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridBodyItem<D>;
        mode: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CurrentCell<K> = {
        axis?: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        index?: number;
        indexes?: {
            column: number;
            row: number;
        };
        key?: any;
        keys?: {
            column: K;
            row: K;
        };
        level?: number;
        type: 'cell' | 'header' | 'label';
    };
    // tslint:disable-next-line interface-over-type-literal
    type DragHeaderContext = {
        axis: string;
        range: Range[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type DragHeaderLabelContext = {
        axis: string;
        level: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropHeaderContext = {
        axis: string;
        index: number;
        position: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropHeaderLabelContext = {
        axis: string;
        level: number;
        position: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderContext<K, D> = {
        axis: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        componentElement: Element;
        contentElement: Element;
        data: D;
        datasource: DataProvider<K, D> | null;
        depth: number;
        extent: number;
        index: number;
        indexFromParent: number;
        isLeaf: boolean;
        key: K;
        level: number;
        metadata: any;
        parentElement: Element;
        parentKey: K;
        treeDepth: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridHeaderItem<D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HorizontalAlignment = 'auto' | 'start' | 'center' | 'end' | 'left' | 'right';
    // tslint:disable-next-line interface-over-type-literal
    type LabelContext<K, D> = {
        axis: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        componentElement: Element;
        contentElement: Element;
        datasource: DataProvider<K, D> | null;
        key: K;
        level: number;
        metadata: any;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LabelTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridItem<D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Range = {
        startIndex: {
            row: number;
            column?: number;
        };
        endIndex: {
            row: number;
            column?: number;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type Selection<K> = {
        startIndex?: {
            row: number;
            column?: number;
        };
        startKey?: {
            row: K;
            column?: K;
        };
        endIndex?: {
            row: number;
            column?: number;
        };
        endKey?: {
            row: K;
            column?: K;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type VerticalAlignment = 'auto' | 'top' | 'center' | 'bottom';
    // tslint:disable-next-line interface-over-type-literal
    type RenderCellTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<CellTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnEndHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnEndHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderLabelContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowEndHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowEndHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderLabelContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
}
export interface ojDataGridEventMap<K, D> extends baseComponentEventMap<ojDataGridSettableProperties<K, D>> {
    'ojBeforeCurrentCell': ojDataGrid.ojBeforeCurrentCell<K>;
    'ojBeforeEdit': ojDataGrid.ojBeforeEdit<K, D>;
    'ojBeforeEditEnd': ojDataGrid.ojBeforeEditEnd<K, D>;
    'ojCellResize': ojDataGrid.ojCellResize;
    'ojCollapseRequest': ojDataGrid.ojCollapseRequest<D>;
    'ojCopyRequest': ojDataGrid.ojCopyRequest<D>;
    'ojCutRequest': ojDataGrid.ojCutRequest<D>;
    'ojExpandRequest': ojDataGrid.ojExpandRequest<D>;
    'ojFillRequest': ojDataGrid.ojFillRequest<D>;
    'ojFilterRequest': ojDataGrid.ojFilterRequest<D>;
    'ojHeaderLabelCutRequest': ojDataGrid.ojHeaderLabelCutRequest;
    'ojPasteRequest': ojDataGrid.ojPasteRequest<D>;
    'ojResize': ojDataGrid.ojResize;
    'ojScroll': ojDataGrid.ojScroll;
    'ojSort': ojDataGrid.ojSort;
    'ojSortLabelRequest': ojDataGrid.ojSortLabelRequest<D>;
    'ojSortRequest': ojDataGrid.ojSortRequest<D>;
    'bandingIntervalChanged': JetElementCustomEvent<ojDataGrid<K, D>["bandingInterval"]>;
    'cellChanged': JetElementCustomEvent<ojDataGrid<K, D>["cell"]>;
    'currentCellChanged': JetElementCustomEvent<ojDataGrid<K, D>["currentCell"]>;
    'dataChanged': JetElementCustomEvent<ojDataGrid<K, D>["data"]>;
    'dataTransferOptionsChanged': JetElementCustomEvent<ojDataGrid<K, D>["dataTransferOptions"]>;
    'dndChanged': JetElementCustomEvent<ojDataGrid<K, D>["dnd"]>;
    'editModeChanged': JetElementCustomEvent<ojDataGrid<K, D>["editMode"]>;
    'frozenColumnCountChanged': JetElementCustomEvent<ojDataGrid<K, D>["frozenColumnCount"]>;
    'frozenRowCountChanged': JetElementCustomEvent<ojDataGrid<K, D>["frozenRowCount"]>;
    'gridlinesChanged': JetElementCustomEvent<ojDataGrid<K, D>["gridlines"]>;
    'headerChanged': JetElementCustomEvent<ojDataGrid<K, D>["header"]>;
    'hiddenColumnsChanged': JetElementCustomEvent<ojDataGrid<K, D>["hiddenColumns"]>;
    'hiddenRowsChanged': JetElementCustomEvent<ojDataGrid<K, D>["hiddenRows"]>;
    'scrollPolicyChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicy"]>;
    'scrollPolicyOptionsChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicyOptions"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollPosition"]>;
    'scrollToKeyChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollToKey"]>;
    'selectionChanged': JetElementCustomEvent<ojDataGrid<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojDataGrid<K, D>["selectionMode"]>;
}
export interface ojDataGridSettableProperties<K, D> extends baseComponentSettableProperties {
    bandingInterval: {
        column?: number;
        row?: number;
    };
    cell: {
        alignment?: {
            horizontal?: ((context: ojDataGrid.CellContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
            vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
        };
        className?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
        editable?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string;
        renderer?: ((context: ojDataGrid.CellContext<K, D>) => {
            insert: HTMLElement | string;
        } | void | null) | null;
        style?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
    };
    currentCell: ojDataGrid.CurrentCell<K> | null;
    data: DataGridProvider<D> | null;
    dataTransferOptions: {
        copy?: 'disable' | 'enable';
        cut?: 'disable' | 'enable';
        fill?: 'disable' | 'enable';
        headerLabelCut?: 'disable' | 'enable';
        paste?: 'disable' | 'enable';
    };
    dnd: {
        drag?: {
            columnEndLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            columnLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            columns?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderContext) => void);
            };
            rowEndLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            rowLabels?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderLabelContext) => void);
            };
            rows?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojDataGrid.DragHeaderContext) => void);
            };
        };
        drop?: {
            columnEndLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            columnLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            columns?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
            };
            rowEndLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            rowLabels?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderLabelContext) => void);
            };
            rows?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
                drop: ((param0: DragEvent, param1: ojDataGrid.DropHeaderContext) => void);
            };
        };
        reorder?: {
            row?: 'enable' | 'disable';
        };
    };
    editMode: 'none' | 'cellNavigation' | 'cellEdit';
    frozenColumnCount: number;
    frozenRowCount: number;
    gridlines: {
        horizontal?: 'visible' | 'hidden';
        vertical?: 'visible' | 'hidden';
    };
    header: {
        column?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            filterable?: ((context: ojDataGrid.HeaderContext<K, D>) => 'auto' | 'disable') | 'auto' | 'disable';
            freezable?: 'enable' | 'disable';
            hidable?: string;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                    insertContent?: never;
                } | {
                    insert?: never;
                    insertContent: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
                insertContent?: never;
            } | {
                insert?: never;
                insertContent: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        columnEnd?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        row?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            freezable?: 'enable' | 'disable';
            hidable?: string;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                    insertContent?: never;
                } | {
                    insert?: never;
                    insertContent: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
                insertContent?: never;
            } | {
                insert?: never;
                insertContent: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width?: 'enable' | 'disable';
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        rowEnd?: {
            alignment?: {
                horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
            };
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label?: {
                alignment?: {
                    horizontal?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.HorizontalAlignment) | ojDataGrid.HorizontalAlignment;
                    vertical?: ((context: ojDataGrid.HeaderContext<K, D>) => ojDataGrid.VerticalAlignment) | ojDataGrid.VerticalAlignment;
                };
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                sortable?: ((context: ojDataGrid.LabelContext<K, D>) => string) | string | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable?: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width?: 'enable' | 'disable';
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
    };
    hiddenColumns: ImmutableKeySet.ImmutableSet<number>;
    hiddenRows: ImmutableKeySet.ImmutableSet<number>;
    scrollPolicy: 'auto' | 'loadMoreOnScroll' | 'scroll';
    scrollPolicyOptions: {
        maxColumnCount?: number;
        maxRowCount?: number;
    };
    scrollPosition: {
        columnIndex?: number;
        columnKey?: K;
        offsetX?: number;
        offsetY?: number;
        rowIndex?: number;
        rowKey?: K;
        x?: number;
        y?: number;
    };
    scrollToKey: 'auto' | 'capability' | 'always' | 'never';
    selection: Array<ojDataGrid.Selection<K>>;
    selectionMode: {
        cell?: 'none' | 'single' | 'multiple';
        row?: 'none' | 'single' | 'multiple';
    };
    translations: {
        accessibleActionableMode?: string;
        accessibleCollapsed?: string;
        accessibleColumnContext?: string;
        accessibleColumnEndHeaderContext?: string;
        accessibleColumnEndHeaderLabelContext?: string;
        accessibleColumnHeaderContext?: string;
        accessibleColumnHeaderLabelContext?: string;
        accessibleColumnHierarchicalFull?: string;
        accessibleColumnHierarchicalPartial?: string;
        accessibleColumnHierarchicalUnknown?: string;
        accessibleColumnSelected?: string;
        accessibleColumnSpanContext?: string;
        accessibleContainsControls?: string;
        accessibleExpanded?: string;
        accessibleFirstColumn?: string;
        accessibleFirstRow?: string;
        accessibleLastColumn?: string;
        accessibleLastRow?: string;
        accessibleLevelContext?: string;
        accessibleLevelHierarchicalContext?: string;
        accessibleMultiCellSelected?: string;
        accessibleNavigationMode?: string;
        accessibleRangeSelectModeOff?: string;
        accessibleRangeSelectModeOn?: string;
        accessibleRowCollapsed?: string;
        accessibleRowContext?: string;
        accessibleRowEndHeaderContext?: string;
        accessibleRowEndHeaderLabelContext?: string;
        accessibleRowExpanded?: string;
        accessibleRowHeaderContext?: string;
        accessibleRowHeaderLabelContext?: string;
        accessibleRowHierarchicalFull?: string;
        accessibleRowHierarchicalPartial?: string;
        accessibleRowHierarchicalUnknown?: string;
        accessibleRowSelected?: string;
        accessibleRowSpanContext?: string;
        accessibleSelectionAffordanceBottom?: string;
        accessibleSelectionAffordanceTop?: string;
        accessibleSortAscending?: string;
        accessibleSortDescending?: string;
        accessibleSortable?: string;
        accessibleStateSelected?: string;
        accessibleSummaryEstimate?: string;
        accessibleSummaryExact?: string;
        accessibleSummaryExpanded?: string;
        collapsedText?: string;
        columnWidth?: string;
        expandedText?: string;
        labelCopyCells?: string;
        labelCut?: string;
        labelCutCells?: string;
        labelDisableNonContiguous?: string;
        labelEnableNonContiguous?: string;
        labelFillCells?: string;
        labelFilter?: string;
        labelFilterCol?: string;
        labelFreezeCol?: string;
        labelFreezeRow?: string;
        labelHideColumn?: string;
        labelHideRow?: string;
        labelPaste?: string;
        labelPasteCells?: string;
        labelResize?: string;
        labelResizeColumn?: string;
        labelResizeDialogApply?: string;
        labelResizeDialogCancel?: string;
        labelResizeDialogSubmit?: string;
        labelResizeFitToContent?: string;
        labelResizeHeight?: string;
        labelResizeRow?: string;
        labelResizeWidth?: string;
        labelSelectMultiple?: string;
        labelSortAsc?: string;
        labelSortCol?: string;
        labelSortColAsc?: string;
        labelSortColDsc?: string;
        labelSortDsc?: string;
        labelSortRow?: string;
        labelSortRowAsc?: string;
        labelSortRowDsc?: string;
        labelUnfreezeCol?: string;
        labelUnfreezeRow?: string;
        labelUnhideColumn?: string;
        labelUnhideRow?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        msgReadOnly?: string;
        resizeColumnDialog?: string;
        resizeRowDialog?: string;
        rowHeight?: string;
        tooltipRequired?: string;
    };
}
export interface ojDataGridSettablePropertiesLenient<K, D> extends Partial<ojDataGridSettableProperties<K, D>> {
    [key: string]: any;
}
export type DataGridElement<K, D> = ojDataGrid<K, D>;
export namespace DataGridElement {
    interface ojBeforeCurrentCell<K> extends CustomEvent<{
        currentCell: ojDataGrid.CurrentCell<K>;
        previousCurrentCell: ojDataGrid.CurrentCell<K>;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeEdit<K, D> extends CustomEvent<{
        cellContext: ojDataGrid.CellContext<K, D>;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeEditEnd<K, D> extends CustomEvent<{
        cancelEdit: boolean;
        cellContext: ojDataGrid.CellContext<K, D>;
        [propName: string]: any;
    }> {
    }
    interface ojCellResize extends CustomEvent<{
        dimension: 'columnHeaderHeight' | 'columnEndHeaderHeight' | 'rowHeaderWidth' | 'rowEndHeaderWidth' | 'columnWidth' | 'rowHeight';
        indices: number[] | undefined;
        levels: number[] | undefined;
        size: number;
        [propName: string]: any;
    }> {
    }
    interface ojCollapseRequest<D> extends CustomEvent<{
        axis: 'row' | 'column';
        item: GridHeaderItem<D>;
        [propName: string]: any;
    }> {
    }
    interface ojCopyRequest<D> extends CustomEvent<{
        sourceRange: ojDataGrid.Range;
        [propName: string]: any;
    }> {
    }
    interface ojCutRequest<D> extends CustomEvent<{
        sourceRange: ojDataGrid.Range;
        [propName: string]: any;
    }> {
    }
    interface ojExpandRequest<D> extends CustomEvent<{
        axis: 'row' | 'column';
        item: GridHeaderItem<D>;
        [propName: string]: any;
    }> {
    }
    interface ojFillRequest<D> extends CustomEvent<{
        action: 'flood' | 'down' | 'end';
        sourceRange: ojDataGrid.Range;
        targetRange: ojDataGrid.Range;
        [propName: string]: any;
    }> {
    }
    interface ojFilterRequest<D> extends CustomEvent<{
        anchor: Element;
        axis: 'column';
        item: GridHeaderItem<D>;
        launcher: Element;
        [propName: string]: any;
    }> {
    }
    interface ojHeaderLabelCutRequest extends CustomEvent<{
        axis: 'row' | 'column' | 'rowEnd' | 'columnEnd';
        level: number;
        [propName: string]: any;
    }> {
    }
    interface ojPasteRequest<D> extends CustomEvent<{
        action: 'cut' | 'copy' | 'unknown';
        sourceRange: ojDataGrid.Range;
        targetRange: ojDataGrid.Range;
        [propName: string]: any;
    }> {
    }
    interface ojResize extends CustomEvent<{
        header: string | number;
        newDimensions: {
            height: number;
            width: number;
        };
        oldDimensions: {
            height: number;
            width: number;
        };
        [propName: string]: any;
    }> {
    }
    interface ojScroll extends CustomEvent<{
        scrollX: number;
        scrollY: number;
        [propName: string]: any;
    }> {
    }
    interface ojSort extends CustomEvent<{
        direction: 'ascending' | 'descending';
        header: any;
        [propName: string]: any;
    }> {
    }
    interface ojSortLabelRequest<D> extends CustomEvent<{
        axis: 'row' | 'column' | 'rowEnd' | 'columnEnd';
        direction: 'ascending' | 'descending';
        item: GridItem<D>;
        level: number;
        [propName: string]: any;
    }> {
    }
    interface ojSortRequest<D> extends CustomEvent<{
        axis: 'row' | 'column';
        direction: 'ascending' | 'descending';
        item: GridHeaderItem<D>;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type bandingIntervalChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["bandingInterval"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["cell"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentCellChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["currentCell"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataTransferOptionsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["dataTransferOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type editModeChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["editMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type frozenColumnCountChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["frozenColumnCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type frozenRowCountChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["frozenRowCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["header"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenColumnsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["hiddenColumns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenRowsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["hiddenRows"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicyOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollToKeyChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["scrollToKey"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type CellContext<K, D> = {
        cell: D;
        componentElement: Element;
        data: D;
        datasource: DataProvider<K, D> | null;
        extents: {
            column: number;
            row: number;
        };
        indexFromParent: number;
        indexes: {
            column: number;
            row: number;
        };
        isLeaf: boolean;
        keys: {
            column: K;
            row: K;
        };
        metadata: any;
        mode: 'edit' | 'navigation';
        parentElement: Element;
        parentKey: K;
        treeDepth: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridBodyItem<D>;
        mode: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CurrentCell<K> = {
        axis?: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        index?: number;
        indexes?: {
            column: number;
            row: number;
        };
        key?: any;
        keys?: {
            column: K;
            row: K;
        };
        level?: number;
        type: 'cell' | 'header' | 'label';
    };
    // tslint:disable-next-line interface-over-type-literal
    type DragHeaderContext = {
        axis: string;
        range: ojDataGrid.Range[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type DragHeaderLabelContext = {
        axis: string;
        level: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropHeaderContext = {
        axis: string;
        index: number;
        position: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropHeaderLabelContext = {
        axis: string;
        level: number;
        position: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderContext<K, D> = {
        axis: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        componentElement: Element;
        contentElement: Element;
        data: D;
        datasource: DataProvider<K, D> | null;
        depth: number;
        extent: number;
        index: number;
        indexFromParent: number;
        isLeaf: boolean;
        key: K;
        level: number;
        metadata: any;
        parentElement: Element;
        parentKey: K;
        treeDepth: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridHeaderItem<D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HorizontalAlignment = 'auto' | 'start' | 'center' | 'end' | 'left' | 'right';
    // tslint:disable-next-line interface-over-type-literal
    type LabelContext<K, D> = {
        axis: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        componentElement: Element;
        contentElement: Element;
        datasource: DataProvider<K, D> | null;
        key: K;
        level: number;
        metadata: any;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LabelTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridItem<D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Range = {
        startIndex: {
            row: number;
            column?: number;
        };
        endIndex: {
            row: number;
            column?: number;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type Selection<K> = {
        startIndex?: {
            row: number;
            column?: number;
        };
        startKey?: {
            row: K;
            column?: K;
        };
        endIndex?: {
            row: number;
            column?: number;
        };
        endKey?: {
            row: K;
            column?: K;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type VerticalAlignment = 'auto' | 'top' | 'center' | 'bottom';
    // tslint:disable-next-line interface-over-type-literal
    type RenderCellTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<CellTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnEndHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnEndHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderLabelContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderColumnHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowEndHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowEndHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderLabelContentTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderLabelTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<LabelTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
}
export interface DataGridIntrinsicProps extends Partial<Readonly<ojDataGridSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeCurrentCell?: (value: ojDataGridEventMap<any, any>['ojBeforeCurrentCell']) => void;
    onojBeforeEdit?: (value: ojDataGridEventMap<any, any>['ojBeforeEdit']) => void;
    onojBeforeEditEnd?: (value: ojDataGridEventMap<any, any>['ojBeforeEditEnd']) => void;
    onojCellResize?: (value: ojDataGridEventMap<any, any>['ojCellResize']) => void;
    onojCollapseRequest?: (value: ojDataGridEventMap<any, any>['ojCollapseRequest']) => void;
    onojCopyRequest?: (value: ojDataGridEventMap<any, any>['ojCopyRequest']) => void;
    onojCutRequest?: (value: ojDataGridEventMap<any, any>['ojCutRequest']) => void;
    onojExpandRequest?: (value: ojDataGridEventMap<any, any>['ojExpandRequest']) => void;
    onojFillRequest?: (value: ojDataGridEventMap<any, any>['ojFillRequest']) => void;
    onojFilterRequest?: (value: ojDataGridEventMap<any, any>['ojFilterRequest']) => void;
    onojHeaderLabelCutRequest?: (value: ojDataGridEventMap<any, any>['ojHeaderLabelCutRequest']) => void;
    onojPasteRequest?: (value: ojDataGridEventMap<any, any>['ojPasteRequest']) => void;
    onojResize?: (value: ojDataGridEventMap<any, any>['ojResize']) => void;
    onojScroll?: (value: ojDataGridEventMap<any, any>['ojScroll']) => void;
    onojSort?: (value: ojDataGridEventMap<any, any>['ojSort']) => void;
    onojSortLabelRequest?: (value: ojDataGridEventMap<any, any>['ojSortLabelRequest']) => void;
    onojSortRequest?: (value: ojDataGridEventMap<any, any>['ojSortRequest']) => void;
    onbandingIntervalChanged?: (value: ojDataGridEventMap<any, any>['bandingIntervalChanged']) => void;
    oncellChanged?: (value: ojDataGridEventMap<any, any>['cellChanged']) => void;
    oncurrentCellChanged?: (value: ojDataGridEventMap<any, any>['currentCellChanged']) => void;
    ondataChanged?: (value: ojDataGridEventMap<any, any>['dataChanged']) => void;
    ondataTransferOptionsChanged?: (value: ojDataGridEventMap<any, any>['dataTransferOptionsChanged']) => void;
    ondndChanged?: (value: ojDataGridEventMap<any, any>['dndChanged']) => void;
    oneditModeChanged?: (value: ojDataGridEventMap<any, any>['editModeChanged']) => void;
    onfrozenColumnCountChanged?: (value: ojDataGridEventMap<any, any>['frozenColumnCountChanged']) => void;
    onfrozenRowCountChanged?: (value: ojDataGridEventMap<any, any>['frozenRowCountChanged']) => void;
    ongridlinesChanged?: (value: ojDataGridEventMap<any, any>['gridlinesChanged']) => void;
    onheaderChanged?: (value: ojDataGridEventMap<any, any>['headerChanged']) => void;
    onhiddenColumnsChanged?: (value: ojDataGridEventMap<any, any>['hiddenColumnsChanged']) => void;
    onhiddenRowsChanged?: (value: ojDataGridEventMap<any, any>['hiddenRowsChanged']) => void;
    onscrollPolicyChanged?: (value: ojDataGridEventMap<any, any>['scrollPolicyChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: ojDataGridEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onscrollPositionChanged?: (value: ojDataGridEventMap<any, any>['scrollPositionChanged']) => void;
    onscrollToKeyChanged?: (value: ojDataGridEventMap<any, any>['scrollToKeyChanged']) => void;
    onselectionChanged?: (value: ojDataGridEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojDataGridEventMap<any, any>['selectionModeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-data-grid": DataGridIntrinsicProps;
        }
    }
}
