import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { DataGridProvider, GridBodyItem, GridHeaderItem, GridItem } from '../ojdatagridprovider';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojDataGrid<K, D> extends baseComponent<ojDataGridSettableProperties<K, D>> {
    bandingInterval: {
        column: number;
        row: number;
    };
    cell: {
        className?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
        renderer?: ((context: ojDataGrid.CellContext<K, D>) => {
            insert: HTMLElement | string;
        } | void | null) | null;
        style?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
    };
    currentCell: ojDataGrid.CurrentCell<K> | null;
    data: DataGridProvider<D>;
    dataTransferOptions: {
        copy: 'disable' | 'enable';
        cut: 'disable' | 'enable';
        fill: 'disable' | 'enable';
        paste: 'disable' | 'enable';
    };
    dnd: {
        reorder: {
            row: 'enable' | 'disable';
        };
    };
    editMode: 'none' | 'cellNavigation' | 'cellEdit';
    gridlines: {
        horizontal: 'visible' | 'hidden';
        vertical: 'visible' | 'hidden';
    };
    header: {
        column: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        columnEnd: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        row: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width: 'enable' | 'disable';
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        rowEnd: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width: 'enable' | 'disable';
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
    };
    scrollPolicy: 'auto' | 'loadMoreOnScroll' | 'scroll';
    scrollPolicyOptions: {
        maxColumnCount: number;
        maxRowCount: number;
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
        cell: 'none' | 'single' | 'multiple';
        row: 'none' | 'single' | 'multiple';
    };
    translations: {
        accessibleActionableMode?: string;
        accessibleCollapsed?: string;
        accessibleColumnContext?: string;
        accessibleColumnEndHeaderContext?: string;
        accessibleColumnEndHeaderLabelContext?: string;
        accessibleColumnHeaderContext?: string;
        accessibleColumnHeaderLabelContext?: string;
        accessibleColumnSelected?: string;
        accessibleColumnSpanContext?: string;
        accessibleContainsControls?: string;
        accessibleExpanded?: string;
        accessibleFirstColumn?: string;
        accessibleFirstRow?: string;
        accessibleLastColumn?: string;
        accessibleLastRow?: string;
        accessibleLevelContext?: string;
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
        accessibleRowSelected?: string;
        accessibleRowSpanContext?: string;
        accessibleSelectionAffordanceBottom?: string;
        accessibleSelectionAffordanceTop?: string;
        accessibleSortAscending?: string;
        accessibleSortDescending?: string;
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
        labelSortCol?: string;
        labelSortColAsc?: string;
        labelSortColDsc?: string;
        labelSortRow?: string;
        labelSortRowAsc?: string;
        labelSortRowDsc?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        resizeColumnDialog?: string;
        resizeRowDialog?: string;
        rowHeight?: string;
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
    type gridlinesChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["header"]>;
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
    type HeaderContext<K, D> = {
        axis: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        componentElement: Element;
        data: D;
        datasource: DataProvider<K, D> | null;
        depth: number;
        extent: number;
        index: number;
        indexFromParent: number;
        isLeaf: boolean;
        key: K;
        level: number;
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
    type LabelContext<K, D> = {
        axis: 'column' | 'columnEnd' | 'row' | 'rowEnd';
        componentElement: Element;
        datasource: DataProvider<K, D> | null;
        key: K;
        level: number;
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
}
export interface ojDataGridEventMap<K, D> extends baseComponentEventMap<ojDataGridSettableProperties<K, D>> {
    'ojBeforeCurrentCell': ojDataGrid.ojBeforeCurrentCell<K>;
    'ojBeforeEdit': ojDataGrid.ojBeforeEdit<K, D>;
    'ojBeforeEditEnd': ojDataGrid.ojBeforeEditEnd<K, D>;
    'ojCollapseRequest': ojDataGrid.ojCollapseRequest<D>;
    'ojCopyRequest': ojDataGrid.ojCopyRequest<D>;
    'ojCutRequest': ojDataGrid.ojCutRequest<D>;
    'ojExpandRequest': ojDataGrid.ojExpandRequest<D>;
    'ojFillRequest': ojDataGrid.ojFillRequest<D>;
    'ojPasteRequest': ojDataGrid.ojPasteRequest<D>;
    'ojResize': ojDataGrid.ojResize;
    'ojScroll': ojDataGrid.ojScroll;
    'ojSort': ojDataGrid.ojSort;
    'ojSortRequest': ojDataGrid.ojSortRequest<D>;
    'bandingIntervalChanged': JetElementCustomEvent<ojDataGrid<K, D>["bandingInterval"]>;
    'cellChanged': JetElementCustomEvent<ojDataGrid<K, D>["cell"]>;
    'currentCellChanged': JetElementCustomEvent<ojDataGrid<K, D>["currentCell"]>;
    'dataChanged': JetElementCustomEvent<ojDataGrid<K, D>["data"]>;
    'dataTransferOptionsChanged': JetElementCustomEvent<ojDataGrid<K, D>["dataTransferOptions"]>;
    'dndChanged': JetElementCustomEvent<ojDataGrid<K, D>["dnd"]>;
    'editModeChanged': JetElementCustomEvent<ojDataGrid<K, D>["editMode"]>;
    'gridlinesChanged': JetElementCustomEvent<ojDataGrid<K, D>["gridlines"]>;
    'headerChanged': JetElementCustomEvent<ojDataGrid<K, D>["header"]>;
    'scrollPolicyChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicy"]>;
    'scrollPolicyOptionsChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollPolicyOptions"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollPosition"]>;
    'scrollToKeyChanged': JetElementCustomEvent<ojDataGrid<K, D>["scrollToKey"]>;
    'selectionChanged': JetElementCustomEvent<ojDataGrid<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojDataGrid<K, D>["selectionMode"]>;
}
export interface ojDataGridSettableProperties<K, D> extends baseComponentSettableProperties {
    bandingInterval: {
        column: number;
        row: number;
    };
    cell: {
        className?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
        renderer?: ((context: ojDataGrid.CellContext<K, D>) => {
            insert: HTMLElement | string;
        } | void | null) | null;
        style?: ((context: ojDataGrid.CellContext<K, D>) => string | void | null) | string | null;
    };
    currentCell: ojDataGrid.CurrentCell<K> | null;
    data: DataGridProvider<D> | null;
    dataTransferOptions: {
        copy: 'disable' | 'enable';
        cut: 'disable' | 'enable';
        fill: 'disable' | 'enable';
        paste: 'disable' | 'enable';
    };
    dnd: {
        reorder: {
            row: 'enable' | 'disable';
        };
    };
    editMode: 'none' | 'cellNavigation' | 'cellEdit';
    gridlines: {
        horizontal: 'visible' | 'hidden';
        vertical: 'visible' | 'hidden';
    };
    header: {
        column: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        columnEnd: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height: 'enable' | 'disable';
                width?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        row: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width: 'enable' | 'disable';
            };
            sortable?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
        rowEnd: {
            className?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
            label: {
                className?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
                renderer?: ((context: ojDataGrid.LabelContext<K, D>) => {
                    insert: HTMLElement | string;
                } | void | null) | null;
                style?: ((context: ojDataGrid.LabelContext<K, D>) => string | void | null) | string | null;
            };
            renderer?: ((context: ojDataGrid.HeaderContext<K, D>) => {
                insert: HTMLElement | string;
            } | void | null) | null;
            resizable: {
                height?: ((context: ojDataGrid.HeaderContext<K, D>) => string) | string | null;
                width: 'enable' | 'disable';
            };
            style?: ((context: ojDataGrid.HeaderContext<K, D>) => string | void | null) | string | null;
        };
    };
    scrollPolicy: 'auto' | 'loadMoreOnScroll' | 'scroll';
    scrollPolicyOptions: {
        maxColumnCount: number;
        maxRowCount: number;
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
        cell: 'none' | 'single' | 'multiple';
        row: 'none' | 'single' | 'multiple';
    };
    translations: {
        accessibleActionableMode?: string;
        accessibleCollapsed?: string;
        accessibleColumnContext?: string;
        accessibleColumnEndHeaderContext?: string;
        accessibleColumnEndHeaderLabelContext?: string;
        accessibleColumnHeaderContext?: string;
        accessibleColumnHeaderLabelContext?: string;
        accessibleColumnSelected?: string;
        accessibleColumnSpanContext?: string;
        accessibleContainsControls?: string;
        accessibleExpanded?: string;
        accessibleFirstColumn?: string;
        accessibleFirstRow?: string;
        accessibleLastColumn?: string;
        accessibleLastRow?: string;
        accessibleLevelContext?: string;
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
        accessibleRowSelected?: string;
        accessibleRowSpanContext?: string;
        accessibleSelectionAffordanceBottom?: string;
        accessibleSelectionAffordanceTop?: string;
        accessibleSortAscending?: string;
        accessibleSortDescending?: string;
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
        labelSortCol?: string;
        labelSortColAsc?: string;
        labelSortColDsc?: string;
        labelSortRow?: string;
        labelSortRowAsc?: string;
        labelSortRowDsc?: string;
        msgFetchingData?: string;
        msgNoData?: string;
        resizeColumnDialog?: string;
        resizeRowDialog?: string;
        rowHeight?: string;
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
    type gridlinesChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged<K, D> = JetElementCustomEvent<ojDataGrid<K, D>["header"]>;
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
        mode: 'edit' | 'navigation';
        parentElement: Element;
        parentKey: K;
        treeDepth: number;
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
    type HeaderTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridHeaderItem<D>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LabelTemplateContext<D> = {
        datasource: DataGridProvider<D>;
        item: GridItem<D>;
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
}
export interface DataGridIntrinsicProps extends Partial<Readonly<ojDataGridSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeCurrentCell?: (value: ojDataGridEventMap<any, any>['ojBeforeCurrentCell']) => void;
    onojBeforeEdit?: (value: ojDataGridEventMap<any, any>['ojBeforeEdit']) => void;
    onojBeforeEditEnd?: (value: ojDataGridEventMap<any, any>['ojBeforeEditEnd']) => void;
    onojCollapseRequest?: (value: ojDataGridEventMap<any, any>['ojCollapseRequest']) => void;
    onojCopyRequest?: (value: ojDataGridEventMap<any, any>['ojCopyRequest']) => void;
    onojCutRequest?: (value: ojDataGridEventMap<any, any>['ojCutRequest']) => void;
    onojExpandRequest?: (value: ojDataGridEventMap<any, any>['ojExpandRequest']) => void;
    onojFillRequest?: (value: ojDataGridEventMap<any, any>['ojFillRequest']) => void;
    onojPasteRequest?: (value: ojDataGridEventMap<any, any>['ojPasteRequest']) => void;
    onojResize?: (value: ojDataGridEventMap<any, any>['ojResize']) => void;
    onojScroll?: (value: ojDataGridEventMap<any, any>['ojScroll']) => void;
    onojSort?: (value: ojDataGridEventMap<any, any>['ojSort']) => void;
    onojSortRequest?: (value: ojDataGridEventMap<any, any>['ojSortRequest']) => void;
    onbandingIntervalChanged?: (value: ojDataGridEventMap<any, any>['bandingIntervalChanged']) => void;
    oncellChanged?: (value: ojDataGridEventMap<any, any>['cellChanged']) => void;
    oncurrentCellChanged?: (value: ojDataGridEventMap<any, any>['currentCellChanged']) => void;
    ondataChanged?: (value: ojDataGridEventMap<any, any>['dataChanged']) => void;
    ondataTransferOptionsChanged?: (value: ojDataGridEventMap<any, any>['dataTransferOptionsChanged']) => void;
    ondndChanged?: (value: ojDataGridEventMap<any, any>['dndChanged']) => void;
    oneditModeChanged?: (value: ojDataGridEventMap<any, any>['editModeChanged']) => void;
    ongridlinesChanged?: (value: ojDataGridEventMap<any, any>['gridlinesChanged']) => void;
    onheaderChanged?: (value: ojDataGridEventMap<any, any>['headerChanged']) => void;
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
