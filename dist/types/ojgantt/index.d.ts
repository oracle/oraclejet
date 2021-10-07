import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DvtTimeComponentScale } from '../ojdvttimecomponentscale';
import { ojTimeAxis } from '../ojtimeaxis';
import Converter = require('../ojconverter');
import { KeySet } from '../ojkeyset';
import { DataProvider } from '../ojdataprovider';
import { dvtTimeComponent, dvtTimeComponentEventMap, dvtTimeComponentSettableProperties } from '../ojtime-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojGantt<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> extends dvtTimeComponent<ojGanttSettableProperties<K1, K2, D1, D2>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    axisPosition: 'bottom' | 'top';
    dependencyData?: (DataProvider<K1, D1>);
    dnd: {
        move?: {
            tasks?: 'disabled' | 'enabled';
        };
    };
    dragMode: 'pan' | 'select';
    end: string;
    expanded: KeySet<K2>;
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
    rowDefaults: {
        height?: number;
    };
    scrollPosition: {
        offsetY?: number;
        rowIndex?: number;
        y?: number;
    };
    selection: K2[];
    selectionMode: 'none' | 'single' | 'multiple';
    start: string;
    taskData?: (DataProvider<K2, D2>);
    taskDefaults: {
        baseline?: {
            borderRadius?: string;
            height?: number;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        height?: number;
        labelPosition?: (string | string[]);
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
            offset?: number;
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
    tooltip: {
        renderer: ((context: ojGantt.TooltipContext<K2, D2>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    valueFormats: {
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
        end?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        label?: {
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
    translations: {
        accessibleDependencyInfo?: string;
        accessiblePredecessorInfo?: string;
        accessibleSuccessorInfo?: string;
        accessibleTaskTypeMilestone?: string;
        accessibleTaskTypeSummary?: string;
        componentName?: string;
        finishFinishDependencyAriaDesc?: string;
        finishStartDependencyAriaDesc?: string;
        labelAndValue?: string;
        labelBaselineDate?: string;
        labelBaselineEnd?: string;
        labelBaselineStart?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelLabel?: string;
        labelLevel?: string;
        labelMoveBy?: string;
        labelNoData?: string;
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
    addEventListener<T extends keyof ojGanttEventMap<K1, K2, D1, D2>>(type: T, listener: (this: HTMLElement, ev: ojGanttEventMap<K1, K2, D1, D2>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttSettableProperties<K1, K2, D1, D2>>(property: T): ojGantt<K1, K2, D1, D2>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttSettableProperties<K1, K2, D1, D2>>(property: T, value: ojGanttSettableProperties<K1, K2, D1, D2>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttSettableProperties<K1, K2, D1, D2>>): void;
    setProperties(properties: ojGanttSettablePropertiesLenient<K1, K2, D1, D2>): void;
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
    interface ojMove<K2, D2> extends CustomEvent<{
        baselineEnd: string;
        baselineStart: string;
        end: string;
        rowContext: {
            rowData: Row<K2>;
            componentElement: Element;
        };
        start: string;
        taskContexts: Array<{
            data: RowTask<K2>;
            rowData: Row<K2>;
            itemData: D2 | null;
            color: string;
        }>;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojResize<K2, D2> extends CustomEvent<{
        end: string;
        start: string;
        taskContexts: Array<{
            data: RowTask<K2>;
            rowData: Row<K2>;
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
    type animationOnDataChangeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type axisPositionChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["axisPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dependencyDataChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dependencyData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dragModeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dragMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type majorAxisChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["majorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minorAxisChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["minorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowAxisChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["rowAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowDefaultsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["rowDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDataChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["taskData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDefaultsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["taskDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportEndChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["viewportEnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportStartChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["viewportStart"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, D1 extends Dependency<K1, K2> | any, D2 extends DataTask | any> = dvtTimeComponent.trackResizeChanged<ojGanttSettableProperties<K1, K2, D1, D2>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataTask<K2 = any, D2 = any> = {
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        end?: string;
        height?: number;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
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
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Dependency<K1, K2> = {
        id: K1;
        predecessorTaskId: K2;
        shortDesc?: string;
        successorTaskId: K2;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
    };
    // tslint:disable-next-line interface-over-type-literal
    type DependencyContentTemplateContext<K1, K2, D1> = {
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
    type DependencyTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        end?: string;
        shortDesc?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'area' | 'line';
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row<K2> = {
        id?: any;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        tasks?: Array<RowTask<K2>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelRendererContext<K2, D2> = {
        componentElement: Element;
        itemData: D2[];
        maxHeight: number;
        maxWidth: number;
        parentElement: Element;
        rowData: Row<K2>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTask<K2, D2 = any> = {
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        end?: string;
        height?: number;
        id: K2;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
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
    type TaskContentTemplateContext<K2, D2> = {
        content: {
            height: number;
            width: number;
        };
        data: RowTask<K2>;
        itemData: D2;
        rowData: Row<K2>;
        state: {
            expanded: boolean;
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type TaskShortDescContext<K2, D2> = {
        data: RowTask<K2, D2>;
        itemData: D2;
        rowData: Row<K2>;
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
    type TooltipContext<K2, D2> = {
        color: string;
        componentElement: Element;
        data: RowTask<K2>;
        itemData: D2;
        parentElement: Element;
        rowData: Row<K2>;
    };
}
export interface ojGanttEventMap<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> extends dvtTimeComponentEventMap<ojGanttSettableProperties<K1, K2, D1, D2>> {
    'ojMove': ojGantt.ojMove<K2, D2>;
    'ojResize': ojGantt.ojResize<K2, D2>;
    'ojViewportChange': ojGantt.ojViewportChange;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["as"]>;
    'axisPositionChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["axisPosition"]>;
    'dependencyDataChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dependencyData"]>;
    'dndChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dnd"]>;
    'dragModeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dragMode"]>;
    'endChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["end"]>;
    'expandedChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["expanded"]>;
    'gridlinesChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["gridlines"]>;
    'majorAxisChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["majorAxis"]>;
    'minorAxisChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["minorAxis"]>;
    'referenceObjectsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["referenceObjects"]>;
    'rowAxisChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["rowAxis"]>;
    'rowDefaultsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["rowDefaults"]>;
    'scrollPositionChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["scrollPosition"]>;
    'selectionChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["selectionMode"]>;
    'startChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["start"]>;
    'taskDataChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["taskData"]>;
    'taskDefaultsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["taskDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["tooltip"]>;
    'valueFormatsChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["valueFormats"]>;
    'viewportEndChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["viewportEnd"]>;
    'viewportStartChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["viewportStart"]>;
    'trackResizeChanged': JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["trackResize"]>;
}
export interface ojGanttSettableProperties<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> extends dvtTimeComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    axisPosition: 'bottom' | 'top';
    dependencyData?: (DataProvider<K1, D1>);
    dnd: {
        move?: {
            tasks?: 'disabled' | 'enabled';
        };
    };
    dragMode: 'pan' | 'select';
    end: string;
    expanded: KeySet<K2>;
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
    rowDefaults: {
        height?: number;
    };
    scrollPosition: {
        offsetY?: number;
        rowIndex?: number;
        y?: number;
    };
    selection: K2[];
    selectionMode: 'none' | 'single' | 'multiple';
    start: string;
    taskData?: (DataProvider<K2, D2>);
    taskDefaults: {
        baseline?: {
            borderRadius?: string;
            height?: number;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        height?: number;
        labelPosition?: (string | string[]);
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
            offset?: number;
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
    tooltip: {
        renderer: ((context: ojGantt.TooltipContext<K2, D2>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    valueFormats: {
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
        end?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        label?: {
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
    translations: {
        accessibleDependencyInfo?: string;
        accessiblePredecessorInfo?: string;
        accessibleSuccessorInfo?: string;
        accessibleTaskTypeMilestone?: string;
        accessibleTaskTypeSummary?: string;
        componentName?: string;
        finishFinishDependencyAriaDesc?: string;
        finishStartDependencyAriaDesc?: string;
        labelAndValue?: string;
        labelBaselineDate?: string;
        labelBaselineEnd?: string;
        labelBaselineStart?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelLabel?: string;
        labelLevel?: string;
        labelMoveBy?: string;
        labelNoData?: string;
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
export interface ojGanttSettablePropertiesLenient<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> extends Partial<ojGanttSettableProperties<K1, K2, D1, D2>> {
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
export interface ojGanttRow extends JetElement<ojGanttRowSettableProperties> {
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration>;
    addEventListener<T extends keyof ojGanttRowEventMap>(type: T, listener: (this: HTMLElement, ev: ojGanttRowEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojGanttRowSettableProperties>(property: T): ojGanttRow[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttRowSettableProperties>(property: T, value: ojGanttRowSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttRowSettableProperties>): void;
    setProperties(properties: ojGanttRowSettablePropertiesLenient): void;
}
export namespace ojGanttRow {
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojGanttRow["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojGanttRow["labelStyle"]>;
}
export interface ojGanttRowEventMap extends HTMLElementEventMap {
    'labelChanged': JetElementCustomEvent<ojGanttRow["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojGanttRow["labelStyle"]>;
}
export interface ojGanttRowSettableProperties extends JetSettableProperties {
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration>;
}
export interface ojGanttRowSettablePropertiesLenient extends Partial<ojGanttRowSettableProperties> {
    [key: string]: any;
}
export interface ojGanttTask<K2 = any, D2 = any> extends dvtTimeComponent<ojGanttTaskSettableProperties<K2, D2>> {
    baseline?: {
        borderRadius?: string;
        end?: string;
        height?: number;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    borderRadius?: string;
    end?: string;
    height?: number;
    label?: string;
    labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
    labelStyle?: Partial<CSSStyleDeclaration>;
    overlap?: {
        behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
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
    type baselineChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["baseline"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["borderRadius"]>;
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
    type typeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["type"]>;
}
export interface ojGanttTaskEventMap<K2 = any, D2 = any> extends dvtTimeComponentEventMap<ojGanttTaskSettableProperties<K2, D2>> {
    'baselineChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["baseline"]>;
    'borderRadiusChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["borderRadius"]>;
    'endChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["end"]>;
    'heightChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["height"]>;
    'labelChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["labelStyle"]>;
    'overlapChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["overlap"]>;
    'progressChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["progress"]>;
    'rowIdChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["rowId"]>;
    'shortDescChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["shortDesc"]>;
    'startChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["start"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["svgStyle"]>;
    'typeChanged': JetElementCustomEvent<ojGanttTask<K2, D2>["type"]>;
}
export interface ojGanttTaskSettableProperties<K2 = any, D2 = any> extends dvtTimeComponentSettableProperties {
    baseline?: {
        borderRadius?: string;
        end?: string;
        height?: number;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    borderRadius?: string;
    end?: string;
    height?: number;
    label?: string;
    labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
    labelStyle?: Partial<CSSStyleDeclaration>;
    overlap?: {
        behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
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
    type?: 'normal' | 'milestone' | 'summary' | 'auto';
}
export interface ojGanttTaskSettablePropertiesLenient<K2 = any, D2 = any> extends Partial<ojGanttTaskSettableProperties<K2, D2>> {
    [key: string]: any;
}
export type GanttElement<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = ojGantt<K1, K2, D1, D2>;
export type GanttDependencyElement = ojGanttDependency;
export type GanttRowElement = ojGanttRow;
export type GanttTaskElement<K2 = any, D2 = any> = ojGanttTask<K2>;
export namespace GanttElement {
    interface ojMove<K2, D2> extends CustomEvent<{
        baselineEnd: string;
        baselineStart: string;
        end: string;
        rowContext: {
            rowData: ojGantt.Row<K2>;
            componentElement: Element;
        };
        start: string;
        taskContexts: Array<{
            data: ojGantt.RowTask<K2>;
            rowData: ojGantt.Row<K2>;
            itemData: D2 | null;
            color: string;
        }>;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojResize<K2, D2> extends CustomEvent<{
        end: string;
        start: string;
        taskContexts: Array<{
            data: ojGantt.RowTask<K2>;
            rowData: ojGantt.Row<K2>;
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
    type animationOnDataChangeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type axisPositionChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["axisPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dependencyDataChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dependencyData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dragModeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["dragMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type expandedChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["expanded"]>;
    // tslint:disable-next-line interface-over-type-literal
    type gridlinesChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["gridlines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type majorAxisChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["majorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minorAxisChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["minorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowAxisChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["rowAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowDefaultsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["rowDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scrollPositionChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["scrollPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDataChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["taskData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type taskDefaultsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["taskDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportEndChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["viewportEnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportStartChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = JetElementCustomEvent<ojGantt<K1, K2, D1, D2>["viewportStart"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, D1 extends ojGantt.Dependency<K1, K2> | any, D2 extends ojGantt.DataTask | any> = dvtTimeComponent.trackResizeChanged<ojGanttSettableProperties<K1, K2, D1, D2>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataTask<K2 = any, D2 = any> = {
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: Partial<CSSStyleDeclaration>;
        };
        borderRadius?: string;
        end?: string;
        height?: number;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: Partial<CSSStyleDeclaration>;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
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
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type DependencyContentTemplateContext<K1, K2, D1> = {
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
    type ReferenceObject = {
        end?: string;
        shortDesc?: string;
        start?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'area' | 'line';
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelRendererContext<K2, D2> = {
        componentElement: Element;
        itemData: D2[];
        maxHeight: number;
        maxWidth: number;
        parentElement: Element;
        rowData: ojGantt.Row<K2>;
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
    type TaskShortDescContext<K2, D2> = {
        data: ojGantt.RowTask<K2, D2>;
        itemData: D2;
        rowData: ojGantt.Row<K2>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K2, D2> = {
        color: string;
        componentElement: Element;
        data: ojGantt.RowTask<K2>;
        itemData: D2;
        parentElement: Element;
        rowData: ojGantt.Row<K2>;
    };
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
export namespace GanttRowElement {
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojGanttRow["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojGanttRow["labelStyle"]>;
}
export namespace GanttTaskElement {
    // tslint:disable-next-line interface-over-type-literal
    type baselineChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["baseline"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["borderRadius"]>;
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
    type typeChanged<K2 = any, D2 = any> = JetElementCustomEvent<ojGanttTask<K2, D2>["type"]>;
}
export interface GanttIntrinsicProps extends Partial<Readonly<ojGanttSettableProperties<any, any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojMove?: (value: ojGanttEventMap<any, any, any, any>['ojMove']) => void;
    onojResize?: (value: ojGanttEventMap<any, any, any, any>['ojResize']) => void;
    onojViewportChange?: (value: ojGanttEventMap<any, any, any, any>['ojViewportChange']) => void;
    onanimationOnDataChangeChanged?: (value: ojGanttEventMap<any, any, any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojGanttEventMap<any, any, any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojGanttEventMap<any, any, any, any>['asChanged']) => void;
    onaxisPositionChanged?: (value: ojGanttEventMap<any, any, any, any>['axisPositionChanged']) => void;
    ondependencyDataChanged?: (value: ojGanttEventMap<any, any, any, any>['dependencyDataChanged']) => void;
    ondndChanged?: (value: ojGanttEventMap<any, any, any, any>['dndChanged']) => void;
    ondragModeChanged?: (value: ojGanttEventMap<any, any, any, any>['dragModeChanged']) => void;
    onendChanged?: (value: ojGanttEventMap<any, any, any, any>['endChanged']) => void;
    onexpandedChanged?: (value: ojGanttEventMap<any, any, any, any>['expandedChanged']) => void;
    ongridlinesChanged?: (value: ojGanttEventMap<any, any, any, any>['gridlinesChanged']) => void;
    onmajorAxisChanged?: (value: ojGanttEventMap<any, any, any, any>['majorAxisChanged']) => void;
    onminorAxisChanged?: (value: ojGanttEventMap<any, any, any, any>['minorAxisChanged']) => void;
    onreferenceObjectsChanged?: (value: ojGanttEventMap<any, any, any, any>['referenceObjectsChanged']) => void;
    onrowAxisChanged?: (value: ojGanttEventMap<any, any, any, any>['rowAxisChanged']) => void;
    onrowDefaultsChanged?: (value: ojGanttEventMap<any, any, any, any>['rowDefaultsChanged']) => void;
    onscrollPositionChanged?: (value: ojGanttEventMap<any, any, any, any>['scrollPositionChanged']) => void;
    onselectionChanged?: (value: ojGanttEventMap<any, any, any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojGanttEventMap<any, any, any, any>['selectionModeChanged']) => void;
    onstartChanged?: (value: ojGanttEventMap<any, any, any, any>['startChanged']) => void;
    ontaskDataChanged?: (value: ojGanttEventMap<any, any, any, any>['taskDataChanged']) => void;
    ontaskDefaultsChanged?: (value: ojGanttEventMap<any, any, any, any>['taskDefaultsChanged']) => void;
    ontooltipChanged?: (value: ojGanttEventMap<any, any, any, any>['tooltipChanged']) => void;
    onvalueFormatsChanged?: (value: ojGanttEventMap<any, any, any, any>['valueFormatsChanged']) => void;
    onviewportEndChanged?: (value: ojGanttEventMap<any, any, any, any>['viewportEndChanged']) => void;
    onviewportStartChanged?: (value: ojGanttEventMap<any, any, any, any>['viewportStartChanged']) => void;
    ontrackResizeChanged?: (value: ojGanttEventMap<any, any, any, any>['trackResizeChanged']) => void;
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
export interface GanttRowIntrinsicProps extends Partial<Readonly<ojGanttRowSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onlabelChanged?: (value: ojGanttRowEventMap['labelChanged']) => void;
    onlabelStyleChanged?: (value: ojGanttRowEventMap['labelStyleChanged']) => void;
    children?: ComponentChildren;
}
export interface GanttTaskIntrinsicProps extends Partial<Readonly<ojGanttTaskSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onbaselineChanged?: (value: ojGanttTaskEventMap<any>['baselineChanged']) => void;
    onborderRadiusChanged?: (value: ojGanttTaskEventMap<any>['borderRadiusChanged']) => void;
    onendChanged?: (value: ojGanttTaskEventMap<any>['endChanged']) => void;
    onheightChanged?: (value: ojGanttTaskEventMap<any>['heightChanged']) => void;
    onlabelChanged?: (value: ojGanttTaskEventMap<any>['labelChanged']) => void;
    onlabelPositionChanged?: (value: ojGanttTaskEventMap<any>['labelPositionChanged']) => void;
    onlabelStyleChanged?: (value: ojGanttTaskEventMap<any>['labelStyleChanged']) => void;
    onoverlapChanged?: (value: ojGanttTaskEventMap<any>['overlapChanged']) => void;
    onprogressChanged?: (value: ojGanttTaskEventMap<any>['progressChanged']) => void;
    onrowIdChanged?: (value: ojGanttTaskEventMap<any>['rowIdChanged']) => void;
    onshortDescChanged?: (value: ojGanttTaskEventMap<any>['shortDescChanged']) => void;
    onstartChanged?: (value: ojGanttTaskEventMap<any>['startChanged']) => void;
    onsvgClassNameChanged?: (value: ojGanttTaskEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojGanttTaskEventMap<any>['svgStyleChanged']) => void;
    ontypeChanged?: (value: ojGanttTaskEventMap<any>['typeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-gantt": GanttIntrinsicProps;
            "oj-gantt-dependency": GanttDependencyIntrinsicProps;
            "oj-gantt-row": GanttRowIntrinsicProps;
            "oj-gantt-task": GanttTaskIntrinsicProps;
        }
    }
}
