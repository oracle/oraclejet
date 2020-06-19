/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

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
    end: string;
    expanded: KeySet<K2>;
    gridlines: {
        horizontal?: 'hidden' | 'visible' | 'auto';
        vertical?: 'hidden' | 'visible' | 'auto';
    };
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        zoomOrder?: string[];
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        zoomOrder?: string[];
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
            svgStyle: CSSStyleDeclaration;
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
            svgStyle: CSSStyleDeclaration;
        };
        resizable?: 'disabled' | 'enabled';
        svgClassName?: string;
        svgStyle: CSSStyleDeclaration;
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
    addEventListener<T extends keyof ojGanttEventMap<K1, K2, D1, D2>>(type: T, listener: (this: HTMLElement, ev: ojGanttEventMap<K1, K2, D1, D2>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
        taskContexts: Array<{
            data: RowTask<K2>;
            rowData: Row<K2>;
            itemData: D2 | null;
            color: string;
        }>;
        value: string;
        start: string;
        end: string;
        baselineStart: string;
        baselineEnd: string;
        rowContext: {
            rowData: Row<K2>;
            componentElement: Element;
        };
        [propName: string]: any;
    }> {
    }
    interface ojResize<K2, D2> extends CustomEvent<{
        taskContexts: Array<{
            data: RowTask<K2>;
            rowData: Row<K2>;
            itemData: D2 | null;
            color: string;
        }>;
        type: string;
        value: string;
        start: string;
        end: string;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChange extends CustomEvent<{
        viewportStart: string;
        viewportEnd: string;
        majorAxisScale: string;
        minorAxisScale: string;
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
    // tslint:disable-next-line interface-over-type-literal
    type DataTask = {
        rowId?: any;
        borderRadius?: string;
        end?: string;
        height?: number;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: CSSStyleDeclaration;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
        };
        start?: string;
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
            value?: number;
        };
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type Dependency<K1, K2> = {
        id: K1;
        predecessorTaskId: K2;
        shortDesc?: string;
        successorTaskId: K2;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
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
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row<K2> = {
        id?: any;
        tasks?: Array<RowTask<K2>>;
        label?: string;
        labelStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowAxisLabelRendererContext<K2, D2> = {
        parentElement: Element;
        rowData: Row<K2>;
        itemData: D2[];
        componentElement: Element;
        maxWidth: number;
        maxHeight: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTask<K2> = {
        id: K2;
        borderRadius?: string;
        end?: string;
        height?: number;
        label?: string;
        labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
        labelStyle?: CSSStyleDeclaration;
        overlap?: {
            behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
        };
        start?: string;
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        type?: 'normal' | 'milestone' | 'summary' | 'auto';
        progress?: {
            borderRadius?: string;
            height?: string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
            value?: number;
        };
        baseline?: {
            borderRadius?: string;
            end?: string;
            height?: number;
            start?: string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type RowTemplateContext = {
        componentElement: Element;
        index: number;
        id: any;
        tasks: Array<{
            data: object;
            index: number;
            key: any;
            parentData: object[];
            parentKey: any;
        }>;
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
        parentElement: Element;
        data: RowTask<K2>;
        rowData: Row<K2>;
        itemData: D2;
        componentElement: Element;
        color: string;
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
    end: string;
    expanded: KeySet<K2>;
    gridlines: {
        horizontal?: 'hidden' | 'visible' | 'auto';
        vertical?: 'hidden' | 'visible' | 'auto';
    };
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        zoomOrder?: string[];
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        height?: number;
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        zoomOrder?: string[];
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
            svgStyle: CSSStyleDeclaration;
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
            svgStyle: CSSStyleDeclaration;
        };
        resizable?: 'disabled' | 'enabled';
        svgClassName?: string;
        svgStyle: CSSStyleDeclaration;
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
    svgStyle?: CSSStyleDeclaration;
    type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
    addEventListener<T extends keyof ojGanttDependencyEventMap>(type: T, listener: (this: HTMLElement, ev: ojGanttDependencyEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    svgStyle?: CSSStyleDeclaration;
    type?: 'finishStart' | 'finishFinish' | 'startStart' | 'startFinish';
}
export interface ojGanttDependencySettablePropertiesLenient extends Partial<ojGanttDependencySettableProperties> {
    [key: string]: any;
}
export interface ojGanttRow extends JetElement<ojGanttRowSettableProperties> {
    label?: string;
    labelStyle?: CSSStyleDeclaration;
    addEventListener<T extends keyof ojGanttRowEventMap>(type: T, listener: (this: HTMLElement, ev: ojGanttRowEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    labelStyle?: CSSStyleDeclaration;
}
export interface ojGanttRowSettablePropertiesLenient extends Partial<ojGanttRowSettableProperties> {
    [key: string]: any;
}
export interface ojGanttTask extends JetElement<ojGanttTaskSettableProperties> {
    baseline?: {
        borderRadius?: string;
        end?: string;
        height?: number;
        start?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    borderRadius?: string;
    end?: string;
    height?: number;
    label?: string;
    labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
    labelStyle?: CSSStyleDeclaration;
    overlap?: {
        behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
    };
    progress?: {
        borderRadius?: string;
        height?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        value?: number;
    };
    rowId?: any;
    shortDesc?: string | null;
    start?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    type?: 'normal' | 'milestone' | 'summary' | 'auto';
    addEventListener<T extends keyof ojGanttTaskEventMap>(type: T, listener: (this: HTMLElement, ev: ojGanttTaskEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojGanttTaskSettableProperties>(property: T): ojGanttTask[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojGanttTaskSettableProperties>(property: T, value: ojGanttTaskSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojGanttTaskSettableProperties>): void;
    setProperties(properties: ojGanttTaskSettablePropertiesLenient): void;
}
export namespace ojGanttTask {
    // tslint:disable-next-line interface-over-type-literal
    type baselineChanged = JetElementCustomEvent<ojGanttTask["baseline"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged = JetElementCustomEvent<ojGanttTask["borderRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged = JetElementCustomEvent<ojGanttTask["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type heightChanged = JetElementCustomEvent<ojGanttTask["height"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojGanttTask["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged = JetElementCustomEvent<ojGanttTask["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojGanttTask["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overlapChanged = JetElementCustomEvent<ojGanttTask["overlap"]>;
    // tslint:disable-next-line interface-over-type-literal
    type progressChanged = JetElementCustomEvent<ojGanttTask["progress"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowIdChanged = JetElementCustomEvent<ojGanttTask["rowId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojGanttTask["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged = JetElementCustomEvent<ojGanttTask["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojGanttTask["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojGanttTask["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojGanttTask["type"]>;
}
export interface ojGanttTaskEventMap extends HTMLElementEventMap {
    'baselineChanged': JetElementCustomEvent<ojGanttTask["baseline"]>;
    'borderRadiusChanged': JetElementCustomEvent<ojGanttTask["borderRadius"]>;
    'endChanged': JetElementCustomEvent<ojGanttTask["end"]>;
    'heightChanged': JetElementCustomEvent<ojGanttTask["height"]>;
    'labelChanged': JetElementCustomEvent<ojGanttTask["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojGanttTask["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojGanttTask["labelStyle"]>;
    'overlapChanged': JetElementCustomEvent<ojGanttTask["overlap"]>;
    'progressChanged': JetElementCustomEvent<ojGanttTask["progress"]>;
    'rowIdChanged': JetElementCustomEvent<ojGanttTask["rowId"]>;
    'shortDescChanged': JetElementCustomEvent<ojGanttTask["shortDesc"]>;
    'startChanged': JetElementCustomEvent<ojGanttTask["start"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojGanttTask["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojGanttTask["svgStyle"]>;
    'typeChanged': JetElementCustomEvent<ojGanttTask["type"]>;
}
export interface ojGanttTaskSettableProperties extends JetSettableProperties {
    baseline?: {
        borderRadius?: string;
        end?: string;
        height?: number;
        start?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    borderRadius?: string;
    end?: string;
    height?: number;
    label?: string;
    labelPosition?: 'start' | 'innerCenter' | 'innerStart' | 'innerEnd' | 'end' | 'none';
    labelStyle?: CSSStyleDeclaration;
    overlap?: {
        behavior?: 'stack' | 'stagger' | 'overlay' | 'auto';
    };
    progress?: {
        borderRadius?: string;
        height?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        value?: number;
    };
    rowId?: any;
    shortDesc?: string | null;
    start?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    type?: 'normal' | 'milestone' | 'summary' | 'auto';
}
export interface ojGanttTaskSettablePropertiesLenient extends Partial<ojGanttTaskSettableProperties> {
    [key: string]: any;
}
