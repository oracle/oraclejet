import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import ojcommontypes = require('../ojcommontypes');
import { KeySet } from '../ojkeyset';
import { DataProvider, Item } from '../ojdataprovider';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTable<K, D> extends baseComponent<ojTableSettableProperties<K, D>> {
    accessibility: {
        rowHeader: string | string[];
    };
    addRowDisplay: 'top' | 'hidden';
    as: string;
    columnResizeBehavior: 'redistribute' | 'add';
    columns: Array<ojTable.Column<K, D>> | null;
    columnsDefault: ojTable.ColumnDefault<K, D> | null;
    currentRow: ojTable.CurrentRow<K> | null;
    data: DataProvider<K, D> | null;
    display: 'list' | 'grid';
    dnd: {
        drag?: {
            rows?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojTable.DragRowContext<K, D>) => void);
            };
        };
        drop?: {
            columns?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
                drop: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
            };
            rows?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
                drop: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
            };
        };
        reorder?: {
            columns: 'enabled' | 'disabled';
        };
    };
    editMode: 'none' | 'rowEdit';
    editRow: ojTable.EditRow<K> | null;
    readonly firstSelectedRow: ojcommontypes.ItemContext<K, D>;
    horizontalGridVisible: 'auto' | 'enabled' | 'disabled';
    layout: 'contents' | 'fixed';
    row: {
        editable?: ((item: Item<K, D>) => 'on' | 'off') | null;
        selectable?: ((item: Item<K, D>) => 'on' | 'off') | null;
        sticky?: ((item: Item<K, D>) => 'on' | 'off') | null;
    };
    rowRenderer: ((context: ojTable.RowRendererContext<K, D>) => {
        insert: HTMLElement;
    } | void) | null;
    scrollPolicy: 'auto' | 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string | null;
        scrollerOffsetBottom?: number | null;
        scrollerOffsetEnd?: number | null;
        scrollerOffsetStart?: number | null;
        scrollerOffsetTop?: number | null;
    };
    scrollPosition: {
        columnIndex?: number;
        columnKey?: string;
        offsetX?: number;
        offsetY?: number;
        rowIndex?: number;
        rowKey?: any;
        x?: number;
        y?: number;
    };
    scrollToKey: 'auto' | 'capability' | 'always' | 'never';
    selectAllControl: 'visible' | 'hidden';
    selected: {
        row?: KeySet<K>;
        column?: KeySet<string>;
    };
    selection: Array<ojTable.RowSelectionStart<K> & ojTable.RowSelectionEnd<K>> | Array<ojTable.ColumnSelectionStart & ojTable.ColumnSelectionEnd>;
    selectionMode: {
        column?: 'none' | 'single' | 'multiple';
        row?: 'none' | 'single' | 'multiple';
    };
    selectionRequired: boolean;
    verticalGridVisible: 'auto' | 'enabled' | 'disabled';
    translations: {
        accessibleAddRow?: string;
        accessibleColumnContext?: string;
        accessibleColumnFooterContext?: string;
        accessibleColumnHeaderContext?: string;
        accessibleColumnsSpan?: string;
        accessibleContainsControls?: string;
        accessibleRowContext?: string;
        accessibleSortAscending?: string;
        accessibleSortDescending?: string;
        accessibleSortable?: string;
        accessibleStateSelected?: string;
        accessibleStateUnselected?: string;
        accessibleSummaryEstimate?: string;
        accessibleSummaryExact?: string;
        editableSummary?: string;
        labelAccSelectionAffordanceBottom?: string;
        labelAccSelectionAffordanceTop?: string;
        labelColumnWidth?: string;
        labelDisableNonContiguousSelection?: string;
        labelEditRow?: string;
        labelEnableNonContiguousSelection?: string;
        labelResize?: string;
        labelResizeColumn?: string;
        labelResizeColumnDialog?: string;
        labelResizeDialogApply?: string;
        labelResizePopupCancel?: string;
        labelResizePopupSpinner?: string;
        labelResizePopupSubmit?: string;
        labelSelectAllRows?: string;
        labelSelectAndEditRow?: string;
        labelSelectColum?: string;
        labelSelectRow?: string;
        labelSort?: string;
        labelSortAsc?: string;
        labelSortDsc?: string;
        msgColumnResizeWidthValidation?: string;
        msgFetchingData?: string;
        msgInitializing?: string;
        msgNoData?: string;
        msgScrollPolicyMaxCountDetail?: string;
        msgScrollPolicyMaxCountSummary?: string;
        msgStatusSortAscending?: string;
        msgStatusSortDescending?: string;
        tooltipRequired?: string;
    };
    addEventListener<T extends keyof ojTableEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTableEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTableSettableProperties<K, D>>(property: T): ojTable<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTableSettableProperties<K, D>>(property: T, value: ojTableSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTableSettableProperties<K, D>>): void;
    setProperties(properties: ojTableSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): {
        subId: 'oj-table-cell';
        rowIndex: number;
        columnIndex: number;
        key: K;
    } | {
        subId: 'oj-table-footer' | 'oj-table-header';
        index: number;
    };
    getDataForVisibleRow(rowIndex: number): {
        data: D;
        index: number;
        key: K;
    } | null;
    refresh(): void;
    refreshRow(rowIdx: number): Promise<boolean>;
}
export namespace ojTable {
    interface ojAnimateEnd extends CustomEvent<{
        action: 'add' | 'remove' | 'update';
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: 'add' | 'remove' | 'update';
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentRow<K> extends CustomEvent<{
        currentRow: CurrentRow<K>;
        previousCurrentRow: CurrentRow<K>;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRowAddEnd extends CustomEvent<{
        accept: Function;
        cancelAdd: boolean;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRowEdit<K, D> extends CustomEvent<{
        accept: (acceptPromise: Promise<void>) => void;
        rowContext: {
            componentElement: Element;
            datasource: DataProvider<K, D> | null;
            item: Item<K, D>;
            mode: 'edit' | 'navigation';
            parentElement: Element;
            status: ContextStatus<K>;
        };
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRowEditEnd<K, D> extends CustomEvent<{
        accept: (acceptPromise: Promise<void>) => void;
        cancelEdit: boolean;
        rowContext: {
            componentElement: Element;
            datasource: DataProvider<K, D> | null;
            item: Item<K, D>;
            mode: 'edit' | 'navigation';
            parentElement: Element;
            status: ContextStatus<K>;
        };
        setUpdatedItem: (param: Promise<{
            updatedItem: Item<K, D>;
        }>) => void;
        [propName: string]: any;
    }> {
    }
    interface ojRowAction<K, D> extends CustomEvent<{
        context: ojcommontypes.ItemContext<K, D>;
        originalEvent: Event;
        [propName: string]: any;
    }> {
    }
    interface ojSort extends CustomEvent<{
        direction: 'ascending' | 'descending';
        header: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type accessibilityChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["accessibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type addRowDisplayChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["addRowDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnResizeBehaviorChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["columnResizeBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["columns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsDefaultChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["columnsDefault"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentRowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["currentRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type editModeChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["editMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type editRowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["editRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type firstSelectedRowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["firstSelectedRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type horizontalGridVisibleChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["horizontalGridVisible"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["row"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowRendererChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["rowRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollPolicy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollPolicyOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollToKeyChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollToKey"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectAllControlChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selectAllControl"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRequiredChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selectionRequired"]>;
    // tslint:disable-next-line interface-over-type-literal
    type verticalGridVisibleChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["verticalGridVisible"]>;
    // tslint:disable-next-line interface-over-type-literal
    type AddRowCellTemplateContext<K, D> = {
        columnIndex: number;
        columnKey: keyof D;
        datasource: DataProvider<K, D> | null;
        submitAddRow?: ((param0: boolean) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type AddRowTemplateContext<K, D> = {
        datasource: DataProvider<K, D> | null;
        submitAddRow?: ((param0: boolean) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellTemplateContext<K, D> = {
        columnIndex: number;
        columnKey: keyof D;
        componentElement: Element;
        data: D[keyof D];
        datasource: DataProvider<K, D> | null;
        index: number;
        item: Item<K, D>;
        key: any;
        mode: 'edit' | 'navigation';
        row: any;
        rowEditable: 'on' | 'off';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Column<K, D> = {
        className?: string | null;
        field?: string | null;
        footerClassName?: string | null;
        footerRenderer?: ((context: FooterRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        footerStyle?: string | null;
        footerTemplate?: string | null;
        frozenEdge?: 'start' | 'end' | null;
        headerClassName?: string | null;
        headerRenderer?: ((context: HeaderRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        headerStyle?: string | null;
        headerTemplate?: string | null;
        headerText?: string | null;
        id?: string | null;
        maxWidth?: string | number | null;
        minWidth?: 'auto' | string | number | null;
        renderer?: ((context: ColumnsRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        resizable?: 'enabled' | 'disabled';
        showRequired?: boolean;
        sortProperty?: string | null;
        sortable?: 'auto' | 'enabled' | 'disabled';
        style?: string | null;
        template?: string | null;
        weight?: number | null;
        width?: string | number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnDefault<K, D> = {
        className?: string | null;
        field?: string | null;
        footerClassName?: string | null;
        footerRenderer?: ((context: FooterRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        footerStyle?: string | null;
        footerTemplate?: string | null;
        headerClassName?: string | null;
        headerRenderer?: ((context: HeaderRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        headerStyle?: string | null;
        headerTemplate?: string | null;
        headerText?: string | null;
        maxWidth?: string | number | null;
        minWidth?: 'auto' | string | number | null;
        renderer?: ((context: ColumnsRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        resizable?: 'enabled' | 'disabled';
        showRequired?: boolean;
        sortProperty?: string | null;
        sortable?: 'auto' | 'enabled' | 'disabled';
        style?: string | null;
        template?: string | null;
        weight?: number | null;
        width?: string | number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnSelectionEnd = {
        endIndex: {
            column: number;
        };
        endKey?: {
            column: string;
        };
    } | {
        endIndex?: {
            column: number;
        };
        endKey: {
            column: string;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnSelectionStart = {
        startIndex: {
            column: number;
        };
        startKey?: {
            column: string;
        };
    } | {
        startIndex?: {
            column: number;
        };
        startKey: {
            column: string;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnsRendererContext<K, D> = {
        cellContext: {
            datasource: DataProvider<K, D> | null;
            mode: 'edit' | 'navigation';
            rowEditable: 'on' | 'off';
            status: ContextStatus<K>;
        };
        columnIndex: number;
        componentElement: Element;
        data: any;
        parentElement: Element;
        row: D;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ContextStatus<K> = {
        currentRow: CurrentRow<K>;
        rowIndex: number;
        rowKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CurrentRow<K> = {
        rowIndex: number;
        rowKey?: K;
    } | {
        rowIndex?: number;
        rowKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DragRowContext<K, D> = {
        rows: Array<{
            data: D;
            index: number;
            key: K;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropColumnContext = {
        columnIndex: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropRowContext = {
        rowIndex: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type EditRow<K> = {
        rowIndex: number;
        rowKey?: K;
    } | {
        rowIndex?: number;
        rowKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FooterRendererContext<K, D> = {
        columnIndex: number;
        componentElement: Element;
        footerContext: {
            datasource: DataProvider<K, D> | null;
        };
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FooterTemplateContext<D> = {
        columnIndex: number;
        columnKey: keyof D;
        componentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderRendererContext<K, D> = {
        columnHeaderDefaultRenderer?: ((param0: object, param1: ((param0: Element) => void)) => void);
        columnHeaderSortableIconRenderer?: ((param0: object, param1: ((param0: Element) => void)) => void);
        columnIndex: number;
        componentElement: Element;
        data: string;
        headerContext: {
            datasource: DataProvider<K, D> | null;
        };
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderTemplateContext<D> = {
        columnIndex: number;
        columnKey: keyof D;
        componentElement: Element;
        data: any;
        headerText: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowRendererContext<K, D> = {
        componentElement: Element;
        data: D;
        parentElement: Element;
        rowContext: {
            datasource: DataProvider<K, D> | null;
            editable: 'on' | 'off';
            mode: 'edit' | 'navigation';
            status: ContextStatus<K>;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowSelectionEnd<K> = {
        endIndex: {
            row: number;
        };
        endKey?: {
            row: K;
        };
    } | {
        endIndex?: {
            row: number;
        };
        endKey: {
            row: K;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowSelectionStart<K> = {
        startIndex: {
            row: number;
        };
        startKey?: {
            row: K;
        };
    } | {
        startIndex?: {
            row: number;
        };
        startKey: {
            row: K;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTemplateContext<K, D> = {
        componentElement: Element;
        data: any;
        datasource: DataProvider<K, D> | null;
        editable: 'on' | 'off';
        index: number;
        item: Item<K, D>;
        key: any;
        mode: 'edit' | 'navigation';
        rowContext: object;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderAddRowCellTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<AddRowCellTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderAddRowTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<AddRowTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderCellTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<CellTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderFooterTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<FooterTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<RowTemplateContext<K, D>>;
}
export interface ojTableEventMap<K, D> extends baseComponentEventMap<ojTableSettableProperties<K, D>> {
    'ojAnimateEnd': ojTable.ojAnimateEnd;
    'ojAnimateStart': ojTable.ojAnimateStart;
    'ojBeforeCurrentRow': ojTable.ojBeforeCurrentRow<K>;
    'ojBeforeRowAddEnd': ojTable.ojBeforeRowAddEnd;
    'ojBeforeRowEdit': ojTable.ojBeforeRowEdit<K, D>;
    'ojBeforeRowEditEnd': ojTable.ojBeforeRowEditEnd<K, D>;
    'ojRowAction': ojTable.ojRowAction<K, D>;
    'ojSort': ojTable.ojSort;
    'accessibilityChanged': JetElementCustomEvent<ojTable<K, D>["accessibility"]>;
    'addRowDisplayChanged': JetElementCustomEvent<ojTable<K, D>["addRowDisplay"]>;
    'asChanged': JetElementCustomEvent<ojTable<K, D>["as"]>;
    'columnResizeBehaviorChanged': JetElementCustomEvent<ojTable<K, D>["columnResizeBehavior"]>;
    'columnsChanged': JetElementCustomEvent<ojTable<K, D>["columns"]>;
    'columnsDefaultChanged': JetElementCustomEvent<ojTable<K, D>["columnsDefault"]>;
    'currentRowChanged': JetElementCustomEvent<ojTable<K, D>["currentRow"]>;
    'dataChanged': JetElementCustomEvent<ojTable<K, D>["data"]>;
    'displayChanged': JetElementCustomEvent<ojTable<K, D>["display"]>;
    'dndChanged': JetElementCustomEvent<ojTable<K, D>["dnd"]>;
    'editModeChanged': JetElementCustomEvent<ojTable<K, D>["editMode"]>;
    'editRowChanged': JetElementCustomEvent<ojTable<K, D>["editRow"]>;
    'firstSelectedRowChanged': JetElementCustomEvent<ojTable<K, D>["firstSelectedRow"]>;
    'horizontalGridVisibleChanged': JetElementCustomEvent<ojTable<K, D>["horizontalGridVisible"]>;
    'layoutChanged': JetElementCustomEvent<ojTable<K, D>["layout"]>;
    'rowChanged': JetElementCustomEvent<ojTable<K, D>["row"]>;
    'rowRendererChanged': JetElementCustomEvent<ojTable<K, D>["rowRenderer"]>;
    'scrollPolicyChanged': JetElementCustomEvent<ojTable<K, D>["scrollPolicy"]>;
    'scrollPolicyOptionsChanged': JetElementCustomEvent<ojTable<K, D>["scrollPolicyOptions"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojTable<K, D>["scrollPosition"]>;
    'scrollToKeyChanged': JetElementCustomEvent<ojTable<K, D>["scrollToKey"]>;
    'selectAllControlChanged': JetElementCustomEvent<ojTable<K, D>["selectAllControl"]>;
    'selectedChanged': JetElementCustomEvent<ojTable<K, D>["selected"]>;
    'selectionChanged': JetElementCustomEvent<ojTable<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojTable<K, D>["selectionMode"]>;
    'selectionRequiredChanged': JetElementCustomEvent<ojTable<K, D>["selectionRequired"]>;
    'verticalGridVisibleChanged': JetElementCustomEvent<ojTable<K, D>["verticalGridVisible"]>;
}
export interface ojTableSettableProperties<K, D> extends baseComponentSettableProperties {
    accessibility: {
        rowHeader: string | string[];
    };
    addRowDisplay: 'top' | 'hidden';
    as: string;
    columnResizeBehavior: 'redistribute' | 'add';
    columns: Array<ojTable.Column<K, D>> | null;
    columnsDefault: ojTable.ColumnDefault<K, D> | null;
    currentRow: ojTable.CurrentRow<K> | null;
    data: DataProvider<K, D> | null;
    display: 'list' | 'grid';
    dnd: {
        drag?: {
            rows?: {
                dataTypes?: string | string[];
                drag?: ((param0: DragEvent) => void);
                dragEnd?: ((param0: DragEvent) => void);
                dragStart?: ((param0: DragEvent, param1: ojTable.DragRowContext<K, D>) => void);
            };
        };
        drop?: {
            columns?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
                drop: ((param0: DragEvent, param1: ojTable.DropColumnContext) => void);
            };
            rows?: {
                dataTypes: string | string[];
                dragEnter?: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
                dragLeave?: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
                dragOver?: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
                drop: ((param0: DragEvent, param1: ojTable.DropRowContext) => void);
            };
        };
        reorder?: {
            columns: 'enabled' | 'disabled';
        };
    };
    editMode: 'none' | 'rowEdit';
    editRow: ojTable.EditRow<K> | null;
    readonly firstSelectedRow: ojcommontypes.ItemContext<K, D>;
    horizontalGridVisible: 'auto' | 'enabled' | 'disabled';
    layout: 'contents' | 'fixed';
    row: {
        editable?: ((item: Item<K, D>) => 'on' | 'off') | null;
        selectable?: ((item: Item<K, D>) => 'on' | 'off') | null;
        sticky?: ((item: Item<K, D>) => 'on' | 'off') | null;
    };
    rowRenderer: ((context: ojTable.RowRendererContext<K, D>) => {
        insert: HTMLElement;
    } | void) | null;
    scrollPolicy: 'auto' | 'loadAll' | 'loadMoreOnScroll';
    scrollPolicyOptions: {
        fetchSize?: number;
        maxCount?: number;
        scroller?: keyof HTMLElementTagNameMap | keyof SVGElementTagNameMap | string | null;
        scrollerOffsetBottom?: number | null;
        scrollerOffsetEnd?: number | null;
        scrollerOffsetStart?: number | null;
        scrollerOffsetTop?: number | null;
    };
    scrollPosition: {
        columnIndex?: number;
        columnKey?: string;
        offsetX?: number;
        offsetY?: number;
        rowIndex?: number;
        rowKey?: any;
        x?: number;
        y?: number;
    };
    scrollToKey: 'auto' | 'capability' | 'always' | 'never';
    selectAllControl: 'visible' | 'hidden';
    selected: {
        row?: KeySet<K>;
        column?: KeySet<string>;
    };
    selection: Array<ojTable.RowSelectionStart<K> & ojTable.RowSelectionEnd<K>> | Array<ojTable.ColumnSelectionStart & ojTable.ColumnSelectionEnd>;
    selectionMode: {
        column?: 'none' | 'single' | 'multiple';
        row?: 'none' | 'single' | 'multiple';
    };
    selectionRequired: boolean;
    verticalGridVisible: 'auto' | 'enabled' | 'disabled';
    translations: {
        accessibleAddRow?: string;
        accessibleColumnContext?: string;
        accessibleColumnFooterContext?: string;
        accessibleColumnHeaderContext?: string;
        accessibleColumnsSpan?: string;
        accessibleContainsControls?: string;
        accessibleRowContext?: string;
        accessibleSortAscending?: string;
        accessibleSortDescending?: string;
        accessibleSortable?: string;
        accessibleStateSelected?: string;
        accessibleStateUnselected?: string;
        accessibleSummaryEstimate?: string;
        accessibleSummaryExact?: string;
        editableSummary?: string;
        labelAccSelectionAffordanceBottom?: string;
        labelAccSelectionAffordanceTop?: string;
        labelColumnWidth?: string;
        labelDisableNonContiguousSelection?: string;
        labelEditRow?: string;
        labelEnableNonContiguousSelection?: string;
        labelResize?: string;
        labelResizeColumn?: string;
        labelResizeColumnDialog?: string;
        labelResizeDialogApply?: string;
        labelResizePopupCancel?: string;
        labelResizePopupSpinner?: string;
        labelResizePopupSubmit?: string;
        labelSelectAllRows?: string;
        labelSelectAndEditRow?: string;
        labelSelectColum?: string;
        labelSelectRow?: string;
        labelSort?: string;
        labelSortAsc?: string;
        labelSortDsc?: string;
        msgColumnResizeWidthValidation?: string;
        msgFetchingData?: string;
        msgInitializing?: string;
        msgNoData?: string;
        msgScrollPolicyMaxCountDetail?: string;
        msgScrollPolicyMaxCountSummary?: string;
        msgStatusSortAscending?: string;
        msgStatusSortDescending?: string;
        tooltipRequired?: string;
    };
}
export interface ojTableSettablePropertiesLenient<K, D> extends Partial<ojTableSettableProperties<K, D>> {
    [key: string]: any;
}
export type TableElement<K, D> = ojTable<K, D>;
export namespace TableElement {
    interface ojAnimateEnd extends CustomEvent<{
        action: 'add' | 'remove' | 'update';
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: 'add' | 'remove' | 'update';
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    interface ojBeforeCurrentRow<K> extends CustomEvent<{
        currentRow: ojTable.CurrentRow<K>;
        previousCurrentRow: ojTable.CurrentRow<K>;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRowAddEnd extends CustomEvent<{
        accept: Function;
        cancelAdd: boolean;
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRowEdit<K, D> extends CustomEvent<{
        accept: (acceptPromise: Promise<void>) => void;
        rowContext: {
            componentElement: Element;
            datasource: DataProvider<K, D> | null;
            item: Item<K, D>;
            mode: 'edit' | 'navigation';
            parentElement: Element;
            status: ojTable.ContextStatus<K>;
        };
        [propName: string]: any;
    }> {
    }
    interface ojBeforeRowEditEnd<K, D> extends CustomEvent<{
        accept: (acceptPromise: Promise<void>) => void;
        cancelEdit: boolean;
        rowContext: {
            componentElement: Element;
            datasource: DataProvider<K, D> | null;
            item: Item<K, D>;
            mode: 'edit' | 'navigation';
            parentElement: Element;
            status: ojTable.ContextStatus<K>;
        };
        setUpdatedItem: (param: Promise<{
            updatedItem: Item<K, D>;
        }>) => void;
        [propName: string]: any;
    }> {
    }
    interface ojRowAction<K, D> extends CustomEvent<{
        context: ojcommontypes.ItemContext<K, D>;
        originalEvent: Event;
        [propName: string]: any;
    }> {
    }
    interface ojSort extends CustomEvent<{
        direction: 'ascending' | 'descending';
        header: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type accessibilityChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["accessibility"]>;
    // tslint:disable-next-line interface-over-type-literal
    type addRowDisplayChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["addRowDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnResizeBehaviorChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["columnResizeBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["columns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsDefaultChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["columnsDefault"]>;
    // tslint:disable-next-line interface-over-type-literal
    type currentRowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["currentRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["display"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type editModeChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["editMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type editRowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["editRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type firstSelectedRowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["firstSelectedRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type horizontalGridVisibleChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["horizontalGridVisible"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["row"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowRendererChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["rowRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollPolicy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPolicyOptionsChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollPolicyOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollToKeyChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["scrollToKey"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectAllControlChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selectAllControl"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRequiredChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["selectionRequired"]>;
    // tslint:disable-next-line interface-over-type-literal
    type verticalGridVisibleChanged<K, D> = JetElementCustomEvent<ojTable<K, D>["verticalGridVisible"]>;
    // tslint:disable-next-line interface-over-type-literal
    type AddRowCellTemplateContext<K, D> = {
        columnIndex: number;
        columnKey: keyof D;
        datasource: DataProvider<K, D> | null;
        submitAddRow?: ((param0: boolean) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type AddRowTemplateContext<K, D> = {
        datasource: DataProvider<K, D> | null;
        submitAddRow?: ((param0: boolean) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellTemplateContext<K, D> = {
        columnIndex: number;
        columnKey: keyof D;
        componentElement: Element;
        data: D[keyof D];
        datasource: DataProvider<K, D> | null;
        index: number;
        item: Item<K, D>;
        key: any;
        mode: 'edit' | 'navigation';
        row: any;
        rowEditable: 'on' | 'off';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Column<K, D> = {
        className?: string | null;
        field?: string | null;
        footerClassName?: string | null;
        footerRenderer?: ((context: ojTable.FooterRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        footerStyle?: string | null;
        footerTemplate?: string | null;
        frozenEdge?: 'start' | 'end' | null;
        headerClassName?: string | null;
        headerRenderer?: ((context: ojTable.HeaderRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        headerStyle?: string | null;
        headerTemplate?: string | null;
        headerText?: string | null;
        id?: string | null;
        maxWidth?: string | number | null;
        minWidth?: 'auto' | string | number | null;
        renderer?: ((context: ojTable.ColumnsRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        resizable?: 'enabled' | 'disabled';
        showRequired?: boolean;
        sortProperty?: string | null;
        sortable?: 'auto' | 'enabled' | 'disabled';
        style?: string | null;
        template?: string | null;
        weight?: number | null;
        width?: string | number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnDefault<K, D> = {
        className?: string | null;
        field?: string | null;
        footerClassName?: string | null;
        footerRenderer?: ((context: ojTable.FooterRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        footerStyle?: string | null;
        footerTemplate?: string | null;
        headerClassName?: string | null;
        headerRenderer?: ((context: ojTable.HeaderRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        headerStyle?: string | null;
        headerTemplate?: string | null;
        headerText?: string | null;
        maxWidth?: string | number | null;
        minWidth?: 'auto' | string | number | null;
        renderer?: ((context: ojTable.ColumnsRendererContext<K, D>) => {
            insert: HTMLElement | string;
        } | void) | null;
        resizable?: 'enabled' | 'disabled';
        showRequired?: boolean;
        sortProperty?: string | null;
        sortable?: 'auto' | 'enabled' | 'disabled';
        style?: string | null;
        template?: string | null;
        weight?: number | null;
        width?: string | number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnSelectionEnd = {
        endIndex: {
            column: number;
        };
        endKey?: {
            column: string;
        };
    } | {
        endIndex?: {
            column: number;
        };
        endKey: {
            column: string;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnSelectionStart = {
        startIndex: {
            column: number;
        };
        startKey?: {
            column: string;
        };
    } | {
        startIndex?: {
            column: number;
        };
        startKey: {
            column: string;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type ColumnsRendererContext<K, D> = {
        cellContext: {
            datasource: DataProvider<K, D> | null;
            mode: 'edit' | 'navigation';
            rowEditable: 'on' | 'off';
            status: ojTable.ContextStatus<K>;
        };
        columnIndex: number;
        componentElement: Element;
        data: any;
        parentElement: Element;
        row: D;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ContextStatus<K> = {
        currentRow: ojTable.CurrentRow<K>;
        rowIndex: number;
        rowKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CurrentRow<K> = {
        rowIndex: number;
        rowKey?: K;
    } | {
        rowIndex?: number;
        rowKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DragRowContext<K, D> = {
        rows: Array<{
            data: D;
            index: number;
            key: K;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropColumnContext = {
        columnIndex: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DropRowContext = {
        rowIndex: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type EditRow<K> = {
        rowIndex: number;
        rowKey?: K;
    } | {
        rowIndex?: number;
        rowKey: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FooterRendererContext<K, D> = {
        columnIndex: number;
        componentElement: Element;
        footerContext: {
            datasource: DataProvider<K, D> | null;
        };
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type FooterTemplateContext<D> = {
        columnIndex: number;
        columnKey: keyof D;
        componentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderRendererContext<K, D> = {
        columnHeaderDefaultRenderer?: ((param0: object, param1: ((param0: Element) => void)) => void);
        columnHeaderSortableIconRenderer?: ((param0: object, param1: ((param0: Element) => void)) => void);
        columnIndex: number;
        componentElement: Element;
        data: string;
        headerContext: {
            datasource: DataProvider<K, D> | null;
        };
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type HeaderTemplateContext<D> = {
        columnIndex: number;
        columnKey: keyof D;
        componentElement: Element;
        data: any;
        headerText: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowRendererContext<K, D> = {
        componentElement: Element;
        data: D;
        parentElement: Element;
        rowContext: {
            datasource: DataProvider<K, D> | null;
            editable: 'on' | 'off';
            mode: 'edit' | 'navigation';
            status: ojTable.ContextStatus<K>;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowSelectionEnd<K> = {
        endIndex: {
            row: number;
        };
        endKey?: {
            row: K;
        };
    } | {
        endIndex?: {
            row: number;
        };
        endKey: {
            row: K;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowSelectionStart<K> = {
        startIndex: {
            row: number;
        };
        startKey?: {
            row: K;
        };
    } | {
        startIndex?: {
            row: number;
        };
        startKey: {
            row: K;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTemplateContext<K, D> = {
        componentElement: Element;
        data: any;
        datasource: DataProvider<K, D> | null;
        editable: 'on' | 'off';
        index: number;
        item: Item<K, D>;
        key: any;
        mode: 'edit' | 'navigation';
        rowContext: object;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderAddRowCellTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<AddRowCellTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderAddRowTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<AddRowTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderCellTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<CellTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderFooterTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<FooterTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderHeaderTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<RowTemplateContext<K, D>>;
}
export interface TableIntrinsicProps extends Partial<Readonly<ojTableSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojTableEventMap<any, any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojTableEventMap<any, any>['ojAnimateStart']) => void;
    onojBeforeCurrentRow?: (value: ojTableEventMap<any, any>['ojBeforeCurrentRow']) => void;
    onojBeforeRowAddEnd?: (value: ojTableEventMap<any, any>['ojBeforeRowAddEnd']) => void;
    onojBeforeRowEdit?: (value: ojTableEventMap<any, any>['ojBeforeRowEdit']) => void;
    onojBeforeRowEditEnd?: (value: ojTableEventMap<any, any>['ojBeforeRowEditEnd']) => void;
    onojRowAction?: (value: ojTableEventMap<any, any>['ojRowAction']) => void;
    onojSort?: (value: ojTableEventMap<any, any>['ojSort']) => void;
    onaccessibilityChanged?: (value: ojTableEventMap<any, any>['accessibilityChanged']) => void;
    onaddRowDisplayChanged?: (value: ojTableEventMap<any, any>['addRowDisplayChanged']) => void;
    onasChanged?: (value: ojTableEventMap<any, any>['asChanged']) => void;
    oncolumnResizeBehaviorChanged?: (value: ojTableEventMap<any, any>['columnResizeBehaviorChanged']) => void;
    oncolumnsChanged?: (value: ojTableEventMap<any, any>['columnsChanged']) => void;
    oncolumnsDefaultChanged?: (value: ojTableEventMap<any, any>['columnsDefaultChanged']) => void;
    oncurrentRowChanged?: (value: ojTableEventMap<any, any>['currentRowChanged']) => void;
    ondataChanged?: (value: ojTableEventMap<any, any>['dataChanged']) => void;
    ondisplayChanged?: (value: ojTableEventMap<any, any>['displayChanged']) => void;
    ondndChanged?: (value: ojTableEventMap<any, any>['dndChanged']) => void;
    oneditModeChanged?: (value: ojTableEventMap<any, any>['editModeChanged']) => void;
    oneditRowChanged?: (value: ojTableEventMap<any, any>['editRowChanged']) => void;
    onfirstSelectedRowChanged?: (value: ojTableEventMap<any, any>['firstSelectedRowChanged']) => void;
    onhorizontalGridVisibleChanged?: (value: ojTableEventMap<any, any>['horizontalGridVisibleChanged']) => void;
    onlayoutChanged?: (value: ojTableEventMap<any, any>['layoutChanged']) => void;
    onrowChanged?: (value: ojTableEventMap<any, any>['rowChanged']) => void;
    onrowRendererChanged?: (value: ojTableEventMap<any, any>['rowRendererChanged']) => void;
    onscrollPolicyChanged?: (value: ojTableEventMap<any, any>['scrollPolicyChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: ojTableEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onscrollPositionChanged?: (value: ojTableEventMap<any, any>['scrollPositionChanged']) => void;
    onscrollToKeyChanged?: (value: ojTableEventMap<any, any>['scrollToKeyChanged']) => void;
    onselectAllControlChanged?: (value: ojTableEventMap<any, any>['selectAllControlChanged']) => void;
    onselectedChanged?: (value: ojTableEventMap<any, any>['selectedChanged']) => void;
    onselectionChanged?: (value: ojTableEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojTableEventMap<any, any>['selectionModeChanged']) => void;
    onselectionRequiredChanged?: (value: ojTableEventMap<any, any>['selectionRequiredChanged']) => void;
    onverticalGridVisibleChanged?: (value: ojTableEventMap<any, any>['verticalGridVisibleChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-table": TableIntrinsicProps;
        }
    }
}
