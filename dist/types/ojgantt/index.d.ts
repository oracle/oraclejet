import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DvtTimeComponentScale } from '../ojdvttimecomponentscale';
import { ojTimeAxis } from '../ojtimeaxis';
import Converter = require('../ojconverter');
import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtTimeComponent, dvtTimeComponentEventMap, dvtTimeComponentSettableProperties } from '../ojtime-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojGantt<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow |
   any> extends dvtTimeComponent<ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    axisPosition: 'bottom' | 'top';
    dependencyData?: (DataProvider<K1, D1>);
    dependencyLineShape: 'rectilinear' | 'straight';
    dnd: {
        move?: {
            tasks?: 'disabled' | 'enabled';
        };
    };
    dragMode: 'pan' | 'select';
    end: string;
    expanded: KeySet<K3 | K2>;
    gridlines: {
        horizontal?: 'hidden' | 'visible' | 'auto';
        vertical?: 'hidden' | 'visible' | 'auto';
    };
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale?: (string | DvtTimeComponentScale);
        zoomOrder?: Array<string | DvtTimeComponentScale>;
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale?: (string | DvtTimeComponentScale);
        zoomOrder?: Array<string | DvtTimeComponentScale>;
    };
    referenceObjects: ojGantt.ReferenceObject[];
    rowAxis: {
        label?: {
            renderer: ((context: ojGantt.RowAxisLabelRendererContext<K2, D2>) => ({
                insert: Element;
            }));
        };
        maxWidth?: string;
        rendered?: 'on' | 'off';
        width?: string;
    };
    rowData?: (DataProvider<K3, D3>);
    rowDefaults: {
        height?: number;
    };
    scrollPosition: {
        offsetY?: number;
        rowIndex?: number;
        y?: number;
    };
    selection: K2[];
    selectionBehavior: 'highlightDependencies' | 'normal';
    selectionMode: 'none' | 'single' | 'multiple';
    start: string;
    taskAggregation: 'on' | 'off';
    taskData?: (DataProvider<K2, D2>);
    taskDefaults: {
        attribute?: {
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        baseline?: {
            borderRadius?: string;
            height?: number;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        downtime?: {
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        height?: number;
        labelPosition?: (string | string[]);
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
            offset?: number;
        };
        overtime?: {
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        resizable?: 'disabled' | 'enabled';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    timeCursor: 'on' | 'off';
    tooltip: {
        renderer: ((context: ojGantt.TooltipRendererContext<K2, D2, K3, D3>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    valueFormats: {
        attribute?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        baselineDate?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        baselineEnd?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        baselineStart?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        date?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        downtimeEnd?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        downtimeStart?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        end?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        label?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        overtimeEnd?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        overtimeStart?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        progress?: {
            converter?: (Converter<number>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        row?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        start?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
    };
    viewportEnd: string;
    viewportStart: string;
    zooming: 'on' | 'off';
    translations: {
        accessibleContainsControls?: string;
        accessibleDependencyInfo?: string;
        accessiblePredecessorInfo?: string;
        accessibleSuccessorInfo?: string;
        accessibleTaskTypeMilestone?: string;
        accessibleTaskTypeSummary?: string;
        componentName?: string;
        finishFinishDependencyAriaDesc?: string;
        finishStartDependencyAriaDesc?: string;
        labelAndValue?: string;
        labelAttribute?: string;
        labelBaselineDate?: string;
        labelBaselineEnd?: string;
        labelBaselineStart?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDowntimeEnd?: string;
        labelDowntimeStart?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelLabel?: string;
        labelLevel?: string;
        labelMoveBy?: string;
        labelNoData?: string;
        labelOvertimeEnd?: string;
        labelOvertimeStart?: string;
        labelProgress?: string;
        labelResizeBy?: string;
        labelRow?: string;
        labelStart?: string;
        startFinishDependencyAriaDesc?: string;
        startStartDependencyAriaDesc?: string;
        stateCollapsed?: string;
        stateDrillable?: string;
        stateExpanded?: string;
        stateHidden?: string;
        stateIsolated?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        taskMoveCancelled?: string;
        taskMoveFinalized?: string;
        taskMoveInitiated?: string;
        taskMoveInitiatedInstruction?: string;
        taskMoveSelectionInfo?: string;
        taskResizeCancelled?: string;
        taskResizeEndHandle?: string;
        taskResizeEndInitiated?: string;
        taskResizeFinalized?: string;
        taskResizeInitiatedInstruction?: string;
        taskResizeSelectionInfo?: string;
        taskResizeStartHandle?: string;
        taskResizeStartInitiated?: string;
        tooltipZoomIn?: string;
        tooltipZoomOut?: string;
    };
    addEventListener<T extends keyof ojGanttEventMap<K1, K2, D1, D2, K3, D3>>(type: T, listener: (this: HTMLElement, ev: ojGanttEventMap<K1, K2, D1, D2, K3, D3>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>>(property: T): ojGantt<K1, K2, D1, D2, K3, D3>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>>(property: T, value: ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>>): void;
    setProperties(properties: ojGanttSettablePropertiesLenient<K1, K2, D1, D2, K3, D3>): void;
    getContextByNode(node: Element): {
        subId: 'oj-gantt-row-label';
        index: number;
    } | {
        subId: 'oj-gantt-taskbar';
        rowIndex: number;
        index: number;
    } | null;
}
export namespace ojGantt {
    interface ojMove<K2 = any, D2 = any, K3 = any, D3 = any> extends CustomEvent<{
        baselineEnd: string;
        baselineStart: string;
        end: string;
        rowContext: {
            rowData: Row<K2, D2, K3, D3>;
            componentElement: Element;
        };
        start: string;
        taskContexts: Array<{
            data: RowTask<K2, D2>;
            rowData: Row<K2, D2, K3, D3>;
            itemData: D2 | null;
            color: string;
        }>;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojResize<K2 = any, D2 = any, K3 = any, D3 = any> extends CustomEvent<{
        end: string;
        start: string;
        taskContexts: Array<{
            data: RowTask<K2, D2>;
            rowData: Row<K2, D2, K3, D3>;
            itemData: D2 | null;
            color: string;
        }>;
        type: string;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChange extends CustomEvent<{
        majorAxisScale: string;
        minorAxisScale: string;
        viewportEnd: string;
        viewportStart: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type axisPositionChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["axisPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dependencyDataChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["dependencyData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dependencyLineShapeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["dependencyLineShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dragModeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["dragMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type majorAxisChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["majorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minorAxisChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["minorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowAxisChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["rowAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowDataChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["rowData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowDefaultsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["rowDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionBehaviorChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["selectionBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskAggregationChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["taskAggregation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDataChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["taskData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDefaultsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["taskDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timeCursorChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["timeCursor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportEndChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["viewportEnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportStartChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["viewportStart"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomingChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["zooming"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any, K3, D3 extends DataRow | any> = dvtTimeComponent.trackResizeChanged<ojGanttSettableProperties<K1,
       K2, D1, D2, K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataRow<K3 = any, D3 = any, K2 = any, D2 = any> = {
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        referenceObjects?: Array<Partial<ReferenceObject>>;
        shortDesc?: (string | ((context: RowShortDescContext<K3, D3>) => string));
        tasks?: Array<DataTask<K2, D2>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataTask<K2 = any, D2 = any> = {
        attribute?: {
            rendered?: 'on' | 'off';
            shortDesc?: (string | ((context: TaskShortDescContext<K2, D2>) => string));
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        downtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        end?: string;
        height?: number;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
        };
        overtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            value?: number;
        };
        rowId?: any;
        shortDesc?: (string | ((context: TaskShortDescContext<K2, D2>) => string));
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        taskId?: string;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Dependency<K1, K2 = any> = {
        id: K1;
        predecessorTaskId: K2;
        shortDesc?: string;
        successorTaskId: K2;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
    };
    // tslint:disable-next-line interface-over-type-literal
    type DependencyContentTemplateContext<K1, K2 = any, D1 = any> = {
        content: {
            predecessorX: number;
            predecessorY: number;
            successorX: number;
            successorY: number;
        };
        data: Dependency<K1, K2>;
        itemData: D1;
        state: {
            focused: boolean;
            hovered: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type DependencyTemplateContext<K1, D1> = {
        componentElement: Element;
        data: D1;
        index: number;
        key: K1;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        end?: string;
        label?: string;
        shortDesc?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'area' | 'line';
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObjectMappingTemplateContext = {
        data: object;
        index: number;
        rowData: object;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row<K2 = any, D2 = any, K3 = any, D3 = any> = {
        id?: any;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        referenceObjects?: Array<Partial<ReferenceObject>>;
        shortDesc?: (string | ((context: RowShortDescContext<K3, D3>) => string));
        tasks?: Array<RowTask<K2, D2>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelRendererContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        componentElement: Element;
        data: D3 | null;
        depth: number;
        itemData: D2[];
        leaf: boolean;
        maxHeight: number;
        maxWidth: number;
        parentElement: Element;
        parentKey: any;
        rowData: Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelTemplateContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        componentElement: Element;
        data: D3 | null;
        depth: number;
        itemData: D2[];
        leaf: boolean;
        maxHeight: number;
        maxWidth: number;
        parentElement: Element;
        parentKey: any;
        rowData: Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowMappingTemplateContext<K3, D3> = {
        data: D3;
        depth: number;
        index: number;
        key: K3;
        leaf: boolean;
        parentKey: K3;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowShortDescContext<K3, D3> = {
        data: Row<any, any, K3, D3>;
        itemData: D3;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTask<K2 = any, D2 = any> = {
        attribute?: {
            rendered?: 'on' | 'off';
            shortDesc?: (string | ((context: TaskShortDescContext<K2, D2>) => string));
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        downtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        end?: string;
        height?: number;
        id: K2;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
        };
        overtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            value?: number;
        };
        shortDesc?: (string | ((context: TaskShortDescContext<K2, D2>) => string));
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTemplateContext = {
        componentElement: Element;
        id: any;
        index: number;
        tasks: Array<{
            data: object;
            index: number;
            key: any;
            parentData: object[];
            parentKey: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskContentTemplateContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        content: {
            height: number;
            width: number;
        };
        data: RowTask<K2, D2>;
        itemData: D2;
        rowData: Row<K2, D2, K3, D3>;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskMappingTemplateContext<D2, D3> = {
        data: D2;
        index: number;
        rowData: D3;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskShortDescContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        data: RowTask<K2, D2>;
        itemData: D2;
        rowData: Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
        parentData: object[];
        parentKey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        color: string;
        componentElement: Element;
        data: RowTask<K2, D2>;
        itemData: D2;
        parentElement: Element;
        rowData: Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        color: string;
        componentElement: Element;
        data: RowTask<K2, D2>;
        itemData: D2;
        parentElement: Element;
        rowData: Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderDependencyContentTemplate<K1, K2 = any, D1 = any> = import('ojs/ojvcomponent').TemplateSlot<DependencyContentTemplateContext<K1, K2, D1>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderDependencyTemplate<K1, D1> = import('ojs/ojvcomponent').TemplateSlot<DependencyTemplateContext<K1, D1>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderReferenceObjectMappingTemplate = import('ojs/ojvcomponent').TemplateSlot<ReferenceObjectMappingTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowAxisLabelTemplate<K2 = any, D2 = any, K3 = any, D3 = any> = import('ojs/ojvcomponent').TemplateSlot<RowAxisLabelTemplateContext<K2, D2, K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowMappingTemplate<K3, D3> = import('ojs/ojvcomponent').TemplateSlot<RowMappingTemplateContext<K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowTemplate = import('ojs/ojvcomponent').TemplateSlot<RowTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTaskContentTemplate<K2 = any, D2 = any, K3 = any, D3 = any> = import('ojs/ojvcomponent').TemplateSlot<TaskContentTemplateContext<K2, D2, K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTaskMappingTemplate<D2, D3> = import('ojs/ojvcomponent').TemplateSlot<TaskMappingTemplateContext<D2, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTaskTemplate = import('ojs/ojvcomponent').TemplateSlot<TaskTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K2 = any, D2 = any, K3 = any, D3 = any> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K2, D2, K3, D3>>;
}
export interface ojGanttEventMap<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow |
   any> extends dvtTimeComponentEventMap<ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>> {
    'ojMove': ojGantt.ojMove<K2, D2, K3, D3>;
    'ojResize': ojGantt.ojResize<K2, D2, K3, D3>;
    'ojViewportChange': ojGantt.ojViewportChange;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["as"]>;
    'axisPositionChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["axisPosition"]>;
    'dependencyDataChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["dependencyData"]>;
    'dependencyLineShapeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["dependencyLineShape"]>;
    'dndChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["dnd"]>;
    'dragModeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["dragMode"]>;
    'endChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["end"]>;
    'expandedChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["expanded"]>;
    'gridlinesChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["gridlines"]>;
    'majorAxisChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["majorAxis"]>;
    'minorAxisChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["minorAxis"]>;
    'referenceObjectsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["referenceObjects"]>;
    'rowAxisChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["rowAxis"]>;
    'rowDataChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["rowData"]>;
    'rowDefaultsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["rowDefaults"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["scrollPosition"]>;
    'selectionChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["selection"]>;
    'selectionBehaviorChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["selectionBehavior"]>;
    'selectionModeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["selectionMode"]>;
    'startChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["start"]>;
    'taskAggregationChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["taskAggregation"]>;
    'taskDataChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["taskData"]>;
    'taskDefaultsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["taskDefaults"]>;
    'timeCursorChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["timeCursor"]>;
    'tooltipChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["tooltip"]>;
    'valueFormatsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["valueFormats"]>;
    'viewportEndChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["viewportEnd"]>;
    'viewportStartChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["viewportStart"]>;
    'zoomingChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["zooming"]>;
    'trackResizeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3, D3>["trackResize"]>;
}
export interface ojGanttSettableProperties<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow |
   any> extends dvtTimeComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    axisPosition: 'bottom' | 'top';
    dependencyData?: (DataProvider<K1, D1>);
    dependencyLineShape: 'rectilinear' | 'straight';
    dnd: {
        move?: {
            tasks?: 'disabled' | 'enabled';
        };
    };
    dragMode: 'pan' | 'select';
    end: string;
    expanded: KeySet<K3 | K2>;
    gridlines: {
        horizontal?: 'hidden' | 'visible' | 'auto';
        vertical?: 'hidden' | 'visible' | 'auto';
    };
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale?: (string | DvtTimeComponentScale);
        zoomOrder?: Array<string | DvtTimeComponentScale>;
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale?: (string | DvtTimeComponentScale);
        zoomOrder?: Array<string | DvtTimeComponentScale>;
    };
    referenceObjects: ojGantt.ReferenceObject[];
    rowAxis: {
        label?: {
            renderer: ((context: ojGantt.RowAxisLabelRendererContext<K2, D2>) => ({
                insert: Element;
            }));
        };
        maxWidth?: string;
        rendered?: 'on' | 'off';
        width?: string;
    };
    rowData?: (DataProvider<K3, D3>);
    rowDefaults: {
        height?: number;
    };
    scrollPosition: {
        offsetY?: number;
        rowIndex?: number;
        y?: number;
    };
    selection: K2[];
    selectionBehavior: 'highlightDependencies' | 'normal';
    selectionMode: 'none' | 'single' | 'multiple';
    start: string;
    taskAggregation: 'on' | 'off';
    taskData?: (DataProvider<K2, D2>);
    taskDefaults: {
        attribute?: {
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        baseline?: {
            borderRadius?: string;
            height?: number;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        downtime?: {
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        height?: number;
        labelPosition?: (string | string[]);
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
            offset?: number;
        };
        overtime?: {
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        resizable?: 'disabled' | 'enabled';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    timeCursor: 'on' | 'off';
    tooltip: {
        renderer: ((context: ojGantt.TooltipRendererContext<K2, D2, K3, D3>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    valueFormats: {
        attribute?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        baselineDate?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        baselineEnd?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        baselineStart?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        date?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        downtimeEnd?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        downtimeStart?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        end?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        label?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        overtimeEnd?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        overtimeStart?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        progress?: {
            converter?: (Converter<number>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        row?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        start?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
    };
    viewportEnd: string;
    viewportStart: string;
    zooming: 'on' | 'off';
    translations: {
        accessibleContainsControls?: string;
        accessibleDependencyInfo?: string;
        accessiblePredecessorInfo?: string;
        accessibleSuccessorInfo?: string;
        accessibleTaskTypeMilestone?: string;
        accessibleTaskTypeSummary?: string;
        componentName?: string;
        finishFinishDependencyAriaDesc?: string;
        finishStartDependencyAriaDesc?: string;
        labelAndValue?: string;
        labelAttribute?: string;
        labelBaselineDate?: string;
        labelBaselineEnd?: string;
        labelBaselineStart?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDowntimeEnd?: string;
        labelDowntimeStart?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelLabel?: string;
        labelLevel?: string;
        labelMoveBy?: string;
        labelNoData?: string;
        labelOvertimeEnd?: string;
        labelOvertimeStart?: string;
        labelProgress?: string;
        labelResizeBy?: string;
        labelRow?: string;
        labelStart?: string;
        startFinishDependencyAriaDesc?: string;
        startStartDependencyAriaDesc?: string;
        stateCollapsed?: string;
        stateDrillable?: string;
        stateExpanded?: string;
        stateHidden?: string;
        stateIsolated?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        taskMoveCancelled?: string;
        taskMoveFinalized?: string;
        taskMoveInitiated?: string;
        taskMoveInitiatedInstruction?: string;
        taskMoveSelectionInfo?: string;
        taskResizeCancelled?: string;
        taskResizeEndHandle?: string;
        taskResizeEndInitiated?: string;
        taskResizeFinalized?: string;
        taskResizeInitiatedInstruction?: string;
        taskResizeSelectionInfo?: string;
        taskResizeStartHandle?: string;
        taskResizeStartInitiated?: string;
        tooltipZoomIn?: string;
        tooltipZoomOut?: string;
    };
}
export interface ojGanttSettablePropertiesLenient<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow |
   any> extends Partial<ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>> {
    [key: string]: any;
}
export interface ojGanttDependency extends JetElement<ojGanttDependencySettableProperties> {
    predecessorTaskId: any;
    shortDesc?: string | null;
    successorTaskId: any;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
    addEventListener<T extends keyof ojGanttDependencyEventMap>(type: T, listener: (this: HTMLElement, ev: ojGanttDependencyEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttDependencySettableProperties>(property: T): ojGanttDependency[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttDependencySettableProperties>(property: T, value: ojGanttDependencySettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttDependencySettableProperties>): void;
    setProperties(properties: ojGanttDependencySettablePropertiesLenient): void;
}
export namespace ojGanttDependency {
    // tslint:disable-next-line interface-over-type-literal
    type predecessorTaskIdChanged = JetElementCustomEvent<ojGanttDependency["predecessorTaskId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojGanttDependency["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type successorTaskIdChanged = JetElementCustomEvent<ojGanttDependency["successorTaskId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojGanttDependency["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojGanttDependency["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojGanttDependency["type"]>;
}
export interface ojGanttDependencyEventMap extends HTMLElementEventMap {
    'predecessorTaskIdChanged': JetElementCustomEvent<ojGanttDependency["predecessorTaskId"]>;
    'shortDescChanged': JetElementCustomEvent<ojGanttDependency["shortDesc"]>;
    'successorTaskIdChanged': JetElementCustomEvent<ojGanttDependency["successorTaskId"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojGanttDependency["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojGanttDependency["svgStyle"]>;
    'typeChanged': JetElementCustomEvent<ojGanttDependency["type"]>;
}
export interface ojGanttDependencySettableProperties extends JetSettableProperties {
    predecessorTaskId: any;
    shortDesc?: string | null;
    successorTaskId: any;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
}
export interface ojGanttDependencySettablePropertiesLenient extends Partial<ojGanttDependencySettableProperties> {
    [key: string]: any;
}
export interface ojGanttReferenceObject extends JetElement<ojGanttReferenceObjectSettableProperties> {
    end?: string;
    start?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    addEventListener<T extends keyof ojGanttReferenceObjectEventMap>(type: T, listener: (this: HTMLElement, ev: ojGanttReferenceObjectEventMap[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttReferenceObjectSettableProperties>(property: T): ojGanttReferenceObject[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttReferenceObjectSettableProperties>(property: T, value: ojGanttReferenceObjectSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttReferenceObjectSettableProperties>): void;
    setProperties(properties: ojGanttReferenceObjectSettablePropertiesLenient): void;
}
export namespace ojGanttReferenceObject {
    // tslint:disable-next-line interface-over-type-literal
    type endChanged = JetElementCustomEvent<ojGanttReferenceObject["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged = JetElementCustomEvent<ojGanttReferenceObject["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojGanttReferenceObject["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojGanttReferenceObject["svgStyle"]>;
}
export interface ojGanttReferenceObjectEventMap extends HTMLElementEventMap {
    'endChanged': JetElementCustomEvent<ojGanttReferenceObject["end"]>;
    'startChanged': JetElementCustomEvent<ojGanttReferenceObject["start"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojGanttReferenceObject["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojGanttReferenceObject["svgStyle"]>;
}
export interface ojGanttReferenceObjectSettableProperties extends JetSettableProperties {
    end?: string;
    start?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
}
export interface ojGanttReferenceObjectSettablePropertiesLenient extends Partial<ojGanttReferenceObjectSettableProperties> {
    [key: string]: any;
}
export interface ojGanttRow<K3 = any, D3 = any> extends dvtTimeComponent<ojGanttRowSettableProperties<K3, D3>> {
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration>;
    referenceObjects: object[];
    shortDesc?: (string | ((context: ojGantt.RowShortDescContext<K3, D3>) => string));
    tasks: object[];
    addEventListener<T extends keyof ojGanttRowEventMap<K3, D3>>(type: T, listener: (this: HTMLElement, ev: ojGanttRowEventMap<K3, D3>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttRowSettableProperties<K3, D3>>(property: T): ojGanttRow<K3, D3>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttRowSettableProperties<K3, D3>>(property: T, value: ojGanttRowSettableProperties<K3, D3>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttRowSettableProperties<K3, D3>>): void;
    setProperties(properties: ojGanttRowSettablePropertiesLenient<K3, D3>): void;
}
export namespace ojGanttRow {
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tasksChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["tasks"]>;
}
export interface ojGanttRowEventMap<K3 = any, D3 = any> extends dvtTimeComponentEventMap<ojGanttRowSettableProperties<K3, D3>> {
    'labelChanged': JetElementCustomEvent<ojGanttRow<K3, D3>["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojGanttRow<K3, D3>["labelStyle"]>;
    'referenceObjectsChanged': JetElementCustomEvent<ojGanttRow<K3, D3>["referenceObjects"]>;
    'shortDescChanged': JetElementCustomEvent<ojGanttRow<K3, D3>["shortDesc"]>;
    'tasksChanged': JetElementCustomEvent<ojGanttRow<K3, D3>["tasks"]>;
}
export interface ojGanttRowSettableProperties<K3 = any, D3 = any> extends dvtTimeComponentSettableProperties {
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration>;
    referenceObjects: object[];
    shortDesc?: (string | ((context: ojGantt.RowShortDescContext<K3, D3>) => string));
    tasks: object[];
}
export interface ojGanttRowSettablePropertiesLenient<K3 = any, D3 = any> extends Partial<ojGanttRowSettableProperties<K3, D3>> {
    [key: string]: any;
}
export interface ojGanttTask<K2 = any, D2 = any> extends dvtTimeComponent<ojGanttTaskSettableProperties<K2, D2>> {
    attribute?: {
        rendered?: 'on' | 'off';
        shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    baseline?: {
        borderRadius?: string;
        end?: string;
        height?: number;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    borderRadius?: string;
    downtime?: {
        end?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    end?: string;
    height?: number;
    label?: string;
    labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
    labelStyle?: Partial<CSSStyleDeclaration>;
    overlap?: {
        behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
    };
    overtime?: {
        end?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    progress?: {
        borderRadius?: string;
        height?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value?: number;
    };
    rowId?: any;
    shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
    start?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    taskId: string;
    type?: 'normal' | 'milestone' | 'summary' | 'auto';
    addEventListener<T extends keyof ojGanttTaskEventMap<K2, D2>>(type: T, listener: (this: HTMLElement, ev: ojGanttTaskEventMap<K2, D2>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttTaskSettableProperties<K2, D2>>(property: T): ojGanttTask<K2, D2>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttTaskSettableProperties<K2, D2>>(property: T, value: ojGanttTaskSettableProperties<K2, D2>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttTaskSettableProperties<K2, D2>>): void;
    setProperties(properties: ojGanttTaskSettablePropertiesLenient<K2, D2>): void;
}
export namespace ojGanttTask {
    // tslint:disable-next-line interface-over-type-literal
    type attributeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["attribute"]>;
    // tslint:disable-next-line interface-over-type-literal
    type baselineChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["baseline"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["borderRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type downtimeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["downtime"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type heightChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["height"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overlapChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["overlap"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overtimeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["overtime"]>;
    // tslint:disable-next-line interface-over-type-literal
    type progressChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["progress"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowIdChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["rowId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskIdChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["taskId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["type"]>;
}
export interface ojGanttTaskEventMap<K2 = any, D2 = any> extends dvtTimeComponentEventMap<ojGanttTaskSettableProperties<K2, D2>> {
    'attributeChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["attribute"]>;
    'baselineChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["baseline"]>;
    'borderRadiusChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["borderRadius"]>;
    'downtimeChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["downtime"]>;
    'endChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["end"]>;
    'heightChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["height"]>;
    'labelChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["labelStyle"]>;
    'overlapChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["overlap"]>;
    'overtimeChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["overtime"]>;
    'progressChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["progress"]>;
    'rowIdChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["rowId"]>;
    'shortDescChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["shortDesc"]>;
    'startChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["start"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["svgStyle"]>;
    'taskIdChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["taskId"]>;
    'typeChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["type"]>;
}
export interface ojGanttTaskSettableProperties<K2 = any, D2 = any> extends dvtTimeComponentSettableProperties {
    attribute?: {
        rendered?: 'on' | 'off';
        shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    baseline?: {
        borderRadius?: string;
        end?: string;
        height?: number;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    borderRadius?: string;
    downtime?: {
        end?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    end?: string;
    height?: number;
    label?: string;
    labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
    labelStyle?: Partial<CSSStyleDeclaration>;
    overlap?: {
        behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
    };
    overtime?: {
        end?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    progress?: {
        borderRadius?: string;
        height?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value?: number;
    };
    rowId?: any;
    shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
    start?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    taskId: string;
    type?: 'normal' | 'milestone' | 'summary' | 'auto';
}
export interface ojGanttTaskSettablePropertiesLenient<K2 = any, D2 = any> extends Partial<ojGanttTaskSettableProperties<K2, D2>> {
    [key: string]: any;
}
export type GanttElement<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = ojGantt<K1, K2, D1, D2, K3, D3>;
export type GanttDependencyElement = ojGanttDependency;
export type GanttReferenceObjectElement = ojGanttReferenceObject;
export type GanttRowElement<K3 = any, D3 = any> = ojGanttRow<K3>;
export type GanttTaskElement<K2 = any, D2 = any> = ojGanttTask<K2>;
export namespace GanttElement {
    interface ojMove<K2 = any, D2 = any, K3 = any, D3 = any> extends CustomEvent<{
        baselineEnd: string;
        baselineStart: string;
        end: string;
        rowContext: {
            rowData: ojGantt.Row<K2, D2, K3, D3>;
            componentElement: Element;
        };
        start: string;
        taskContexts: Array<{
            data: ojGantt.RowTask<K2, D2>;
            rowData: ojGantt.Row<K2, D2, K3, D3>;
            itemData: D2 | null;
            color: string;
        }>;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojResize<K2 = any, D2 = any, K3 = any, D3 = any> extends CustomEvent<{
        end: string;
        start: string;
        taskContexts: Array<{
            data: ojGantt.RowTask<K2, D2>;
            rowData: ojGantt.Row<K2, D2, K3, D3>;
            itemData: D2 | null;
            color: string;
        }>;
        type: string;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChange extends CustomEvent<{
        majorAxisScale: string;
        minorAxisScale: string;
        viewportEnd: string;
        viewportStart: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1,
       K2, D1, D2, K3, D3>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2,
       D1, D2, K3, D3>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type axisPositionChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["axisPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dependencyDataChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["dependencyData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dependencyLineShapeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1,
       K2, D1, D2, K3, D3>["dependencyLineShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dragModeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["dragMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type majorAxisChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["majorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minorAxisChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["minorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2,
       D1, D2, K3, D3>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowAxisChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["rowAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowDataChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["rowData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowDefaultsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["rowDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionBehaviorChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2,
       D1, D2, K3, D3>["selectionBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2, K3,
       D3>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskAggregationChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2,
       D1, D2, K3, D3>["taskAggregation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDataChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["taskData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDefaultsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["taskDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timeCursorChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["timeCursor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportEndChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["viewportEnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportStartChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1,
       D2, K3, D3>["viewportStart"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomingChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2,
       K3, D3>["zooming"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any, K3, D3 extends ojGantt.DataRow |
       any> = dvtTimeComponent.trackResizeChanged<ojGanttSettableProperties<K1, K2, D1, D2, K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataRow<K3 = any, D3 = any, K2 = any, D2 = any> = {
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        referenceObjects?: Array<Partial<ojGantt.ReferenceObject>>;
        shortDesc?: (string | ((context: ojGantt.RowShortDescContext<K3, D3>) => string));
        tasks?: Array<ojGantt.DataTask<K2, D2>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataTask<K2 = any, D2 = any> = {
        attribute?: {
            rendered?: 'on' | 'off';
            shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        downtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        end?: string;
        height?: number;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
        };
        overtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            value?: number;
        };
        rowId?: any;
        shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        taskId?: string;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Dependency<K1, K2 = any> = {
        id: K1;
        predecessorTaskId: K2;
        shortDesc?: string;
        successorTaskId: K2;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
    };
    // tslint:disable-next-line interface-over-type-literal
    type DependencyContentTemplateContext<K1, K2 = any, D1 = any> = {
        content: {
            predecessorX: number;
            predecessorY: number;
            successorX: number;
            successorY: number;
        };
        data: ojGantt.Dependency<K1, K2>;
        itemData: D1;
        state: {
            focused: boolean;
            hovered: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type DependencyTemplateContext<K1, D1> = {
        componentElement: Element;
        data: D1;
        index: number;
        key: K1;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        end?: string;
        label?: string;
        shortDesc?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'area' | 'line';
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObjectMappingTemplateContext = {
        data: object;
        index: number;
        rowData: object;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row<K2 = any, D2 = any, K3 = any, D3 = any> = {
        id?: any;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        referenceObjects?: Array<Partial<ojGantt.ReferenceObject>>;
        shortDesc?: (string | ((context: ojGantt.RowShortDescContext<K3, D3>) => string));
        tasks?: Array<ojGantt.RowTask<K2, D2>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelRendererContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        componentElement: Element;
        data: D3 | null;
        depth: number;
        itemData: D2[];
        leaf: boolean;
        maxHeight: number;
        maxWidth: number;
        parentElement: Element;
        parentKey: any;
        rowData: ojGantt.Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelTemplateContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        componentElement: Element;
        data: D3 | null;
        depth: number;
        itemData: D2[];
        leaf: boolean;
        maxHeight: number;
        maxWidth: number;
        parentElement: Element;
        parentKey: any;
        rowData: ojGantt.Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowMappingTemplateContext<K3, D3> = {
        data: D3;
        depth: number;
        index: number;
        key: K3;
        leaf: boolean;
        parentKey: K3;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowShortDescContext<K3, D3> = {
        data: ojGantt.Row<any, any, K3, D3>;
        itemData: D3;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTask<K2 = any, D2 = any> = {
        attribute?: {
            rendered?: 'on' | 'off';
            shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        downtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        end?: string;
        height?: number;
        id: K2;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
        };
        overtime?: {
            end?: string;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
            value?: number;
        };
        shortDesc?: (string | ((context: ojGantt.TaskShortDescContext<K2, D2>) => string));
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTemplateContext = {
        componentElement: Element;
        id: any;
        index: number;
        tasks: Array<{
            data: object;
            index: number;
            key: any;
            parentData: object[];
            parentKey: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskContentTemplateContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        content: {
            height: number;
            width: number;
        };
        data: ojGantt.RowTask<K2, D2>;
        itemData: D2;
        rowData: ojGantt.Row<K2, D2, K3, D3>;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskMappingTemplateContext<D2, D3> = {
        data: D2;
        index: number;
        rowData: D3;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskShortDescContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        data: ojGantt.RowTask<K2, D2>;
        itemData: D2;
        rowData: ojGantt.Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
        parentData: object[];
        parentKey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        color: string;
        componentElement: Element;
        data: ojGantt.RowTask<K2, D2>;
        itemData: D2;
        parentElement: Element;
        rowData: ojGantt.Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K2 = any, D2 = any, K3 = any, D3 = any> = {
        color: string;
        componentElement: Element;
        data: ojGantt.RowTask<K2, D2>;
        itemData: D2;
        parentElement: Element;
        rowData: ojGantt.Row<K2, D2, K3, D3>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderDependencyContentTemplate<K1, K2 = any, D1 = any> = import('ojs/ojvcomponent').TemplateSlot<DependencyContentTemplateContext<K1, K2, D1>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderDependencyTemplate<K1, D1> = import('ojs/ojvcomponent').TemplateSlot<DependencyTemplateContext<K1, D1>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderReferenceObjectMappingTemplate = import('ojs/ojvcomponent').TemplateSlot<ReferenceObjectMappingTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowAxisLabelTemplate<K2 = any, D2 = any, K3 = any, D3 = any> = import('ojs/ojvcomponent').TemplateSlot<RowAxisLabelTemplateContext<K2, D2, K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowMappingTemplate<K3, D3> = import('ojs/ojvcomponent').TemplateSlot<RowMappingTemplateContext<K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderRowTemplate = import('ojs/ojvcomponent').TemplateSlot<RowTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTaskContentTemplate<K2 = any, D2 = any, K3 = any, D3 = any> = import('ojs/ojvcomponent').TemplateSlot<TaskContentTemplateContext<K2, D2, K3, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTaskMappingTemplate<D2, D3> = import('ojs/ojvcomponent').TemplateSlot<TaskMappingTemplateContext<D2, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTaskTemplate = import('ojs/ojvcomponent').TemplateSlot<TaskTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K2 = any, D2 = any, K3 = any, D3 = any> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K2, D2, K3, D3>>;
}
export namespace GanttDependencyElement {
    // tslint:disable-next-line interface-over-type-literal
    type predecessorTaskIdChanged = JetElementCustomEvent<ojGanttDependency["predecessorTaskId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojGanttDependency["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type successorTaskIdChanged = JetElementCustomEvent<ojGanttDependency["successorTaskId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojGanttDependency["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojGanttDependency["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojGanttDependency["type"]>;
}
export namespace GanttReferenceObjectElement {
    // tslint:disable-next-line interface-over-type-literal
    type endChanged = JetElementCustomEvent<ojGanttReferenceObject["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged = JetElementCustomEvent<ojGanttReferenceObject["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojGanttReferenceObject["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojGanttReferenceObject["svgStyle"]>;
}
export namespace GanttRowElement {
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tasksChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojGanttRow<K3, D3>["tasks"]>;
}
export namespace GanttTaskElement {
    // tslint:disable-next-line interface-over-type-literal
    type attributeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["attribute"]>;
    // tslint:disable-next-line interface-over-type-literal
    type baselineChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["baseline"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["borderRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type downtimeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["downtime"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type heightChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["height"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overlapChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["overlap"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overtimeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["overtime"]>;
    // tslint:disable-next-line interface-over-type-literal
    type progressChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["progress"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowIdChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["rowId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskIdChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["taskId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["type"]>;
}
export interface GanttIntrinsicProps extends Partial<Readonly<ojGanttSettableProperties<any, any, any, any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojMove?: (value: ojGanttEventMap<any, any, any, any, any, any>['ojMove']) => void;
    onojResize?: (value: ojGanttEventMap<any, any, any, any, any, any>['ojResize']) => void;
    onojViewportChange?: (value: ojGanttEventMap<any, any, any, any, any, any>['ojViewportChange']) => void;
    onanimationOnDataChangeChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['asChanged']) => void;
    onaxisPositionChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['axisPositionChanged']) => void;
    ondependencyDataChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['dependencyDataChanged']) => void;
    ondependencyLineShapeChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['dependencyLineShapeChanged']) => void;
    ondndChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['dndChanged']) => void;
    ondragModeChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['dragModeChanged']) => void;
    onendChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['endChanged']) => void;
    onexpandedChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['expandedChanged']) => void;
    ongridlinesChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['gridlinesChanged']) => void;
    onmajorAxisChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['majorAxisChanged']) => void;
    onminorAxisChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['minorAxisChanged']) => void;
    onreferenceObjectsChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['referenceObjectsChanged']) => void;
    onrowAxisChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['rowAxisChanged']) => void;
    onrowDataChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['rowDataChanged']) => void;
    onrowDefaultsChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['rowDefaultsChanged']) => void;
    onscrollPositionChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['scrollPositionChanged']) => void;
    onselectionChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['selectionChanged']) => void;
    onselectionBehaviorChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['selectionBehaviorChanged']) => void;
    onselectionModeChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['selectionModeChanged']) => void;
    onstartChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['startChanged']) => void;
    ontaskAggregationChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['taskAggregationChanged']) => void;
    ontaskDataChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['taskDataChanged']) => void;
    ontaskDefaultsChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['taskDefaultsChanged']) => void;
    ontimeCursorChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['timeCursorChanged']) => void;
    ontooltipChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['tooltipChanged']) => void;
    onvalueFormatsChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['valueFormatsChanged']) => void;
    onviewportEndChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['viewportEndChanged']) => void;
    onviewportStartChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['viewportStartChanged']) => void;
    onzoomingChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['zoomingChanged']) => void;
    ontrackResizeChanged?: (value: ojGanttEventMap<any, any, any, any, any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface GanttDependencyIntrinsicProps extends Partial<Readonly<ojGanttDependencySettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onpredecessorTaskIdChanged?: (value: ojGanttDependencyEventMap['predecessorTaskIdChanged']) => void;
    onshortDescChanged?: (value: ojGanttDependencyEventMap['shortDescChanged']) => void;
    onsuccessorTaskIdChanged?: (value: ojGanttDependencyEventMap['successorTaskIdChanged']) => void;
    onsvgClassNameChanged?: (value: ojGanttDependencyEventMap['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojGanttDependencyEventMap['svgStyleChanged']) => void;
    ontypeChanged?: (value: ojGanttDependencyEventMap['typeChanged']) => void;
    children?: ComponentChildren;
}
export interface GanttReferenceObjectIntrinsicProps extends Partial<Readonly<ojGanttReferenceObjectSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onendChanged?: (value: ojGanttReferenceObjectEventMap['endChanged']) => void;
    onstartChanged?: (value: ojGanttReferenceObjectEventMap['startChanged']) => void;
    onsvgClassNameChanged?: (value: ojGanttReferenceObjectEventMap['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojGanttReferenceObjectEventMap['svgStyleChanged']) => void;
    children?: ComponentChildren;
}
export interface GanttRowIntrinsicProps extends Partial<Readonly<ojGanttRowSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onlabelChanged?: (value: ojGanttRowEventMap<any>['labelChanged']) => void;
    onlabelStyleChanged?: (value: ojGanttRowEventMap<any>['labelStyleChanged']) => void;
    onreferenceObjectsChanged?: (value: ojGanttRowEventMap<any>['referenceObjectsChanged']) => void;
    onshortDescChanged?: (value: ojGanttRowEventMap<any>['shortDescChanged']) => void;
    ontasksChanged?: (value: ojGanttRowEventMap<any>['tasksChanged']) => void;
    children?: ComponentChildren;
}
export interface GanttTaskIntrinsicProps extends Partial<Readonly<ojGanttTaskSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onattributeChanged?: (value: ojGanttTaskEventMap<any>['attributeChanged']) => void;
    onbaselineChanged?: (value: ojGanttTaskEventMap<any>['baselineChanged']) => void;
    onborderRadiusChanged?: (value: ojGanttTaskEventMap<any>['borderRadiusChanged']) => void;
    ondowntimeChanged?: (value: ojGanttTaskEventMap<any>['downtimeChanged']) => void;
    onendChanged?: (value: ojGanttTaskEventMap<any>['endChanged']) => void;
    onheightChanged?: (value: ojGanttTaskEventMap<any>['heightChanged']) => void;
    onlabelChanged?: (value: ojGanttTaskEventMap<any>['labelChanged']) => void;
    onlabelPositionChanged?: (value: ojGanttTaskEventMap<any>['labelPositionChanged']) => void;
    onlabelStyleChanged?: (value: ojGanttTaskEventMap<any>['labelStyleChanged']) => void;
    onoverlapChanged?: (value: ojGanttTaskEventMap<any>['overlapChanged']) => void;
    onovertimeChanged?: (value: ojGanttTaskEventMap<any>['overtimeChanged']) => void;
    onprogressChanged?: (value: ojGanttTaskEventMap<any>['progressChanged']) => void;
    onrowIdChanged?: (value: ojGanttTaskEventMap<any>['rowIdChanged']) => void;
    onshortDescChanged?: (value: ojGanttTaskEventMap<any>['shortDescChanged']) => void;
    onstartChanged?: (value: ojGanttTaskEventMap<any>['startChanged']) => void;
    onsvgClassNameChanged?: (value: ojGanttTaskEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojGanttTaskEventMap<any>['svgStyleChanged']) => void;
    ontaskIdChanged?: (value: ojGanttTaskEventMap<any>['taskIdChanged']) => void;
    ontypeChanged?: (value: ojGanttTaskEventMap<any>['typeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-gantt": GanttIntrinsicProps;
            "oj-gantt-dependency": GanttDependencyIntrinsicProps;
            "oj-gantt-reference-object": GanttReferenceObjectIntrinsicProps;
            "oj-gantt-row": GanttRowIntrinsicProps;
            "oj-gantt-task": GanttTaskIntrinsicProps;
        }
    }
}
