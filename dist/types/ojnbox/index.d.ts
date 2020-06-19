/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojNBox<K, D extends ojNBox.Node<K> | any> extends dvtBaseComponent<ojNBoxSettableProperties<K, D>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    cellContent: 'counts' | 'auto';
    cellMaximize: 'off' | 'on';
    cells: Promise<ojNBox.Cell[]> | null;
    columns: Promise<ojNBox.Column[]> | null;
    columnsTitle: string;
    countLabel: ((context: ojNBox.CountLabelContext) => (string | null));
    data: DataProvider<K, D> | null;
    groupAttributes: 'color' | 'indicatorColor' | 'indicatorIconColor' | 'indicatorIconPattern' | 'indicatorIconShape';
    groupBehavior: 'acrossCells' | 'none' | 'withinCell';
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    labelTruncation: 'ifRequired' | 'on';
    maximizedColumn: string;
    maximizedRow: string;
    otherColor: string;
    otherThreshold: number;
    rows: Promise<ojNBox.Row[]> | null;
    rowsTitle: string;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    styleDefaults: {
        animationDuration: number;
        cellDefaults: {
            labelHalign: 'center' | 'end' | 'start';
            labelStyle: CSSStyleDeclaration;
            maximizedSvgStyle: CSSStyleDeclaration;
            minimizedSvgStyle: CSSStyleDeclaration;
            showCount: 'on' | 'off' | 'auto';
            svgStyle: CSSStyleDeclaration;
        };
        columnLabelStyle: CSSStyleDeclaration;
        columnsTitleStyle: CSSStyleDeclaration;
        hoverBehaviorDelay: number;
        nodeDefaults: {
            borderColor: string;
            borderWidth: number;
            color: string;
            iconDefaults: {
                background: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
                borderColor: string;
                borderRadius: string;
                borderWidth: number;
                color: string;
                height: number;
                opacity: number;
                pattern: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
                   'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star';
                source: string;
                width: number;
            };
            indicatorColor: string;
            indicatorIconDefaults: {
                borderColor: string;
                borderRadius: string;
                borderWidth: number;
                color: string;
                height: number;
                opacity: number;
                pattern: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
                   'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star';
                source: string;
                width: number;
            };
            labelStyle: CSSStyleDeclaration;
            secondaryLabelStyle: CSSStyleDeclaration;
        };
        rowLabelStyle: CSSStyleDeclaration;
        rowsTitleStyle: CSSStyleDeclaration;
    };
    tooltip: {
        renderer: ((context: ojNBox.TooltipContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    touchResponse: 'touchStart' | 'auto';
    translations: {
        componentName?: string;
        highlightedCount?: string;
        labelAdditionalData?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelGroup?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelOther?: string;
        labelSize?: string;
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
    };
    addEventListener<T extends keyof ojNBoxEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojNBoxEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojNBoxSettableProperties<K, D>>(property: T): ojNBox<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojNBoxSettableProperties<K, D>>(property: T, value: ojNBoxSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojNBoxSettableProperties<K, D>>): void;
    setProperties(properties: ojNBoxSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojNBox.NodeContext<K> | ojNBox.CellContext | ojNBox.DialogContext | ojNBox.GroupNodeContext | null;
}
export namespace ojNBox {
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellContentChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cellContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellMaximizeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cellMaximize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type cellsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["cells"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["columns"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnsTitleChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["columnsTitle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type countLabelChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["countLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupAttributesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["groupAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupBehaviorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["groupBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelTruncationChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["labelTruncation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximizedColumnChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["maximizedColumn"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximizedRowChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["maximizedRow"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherColorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["otherColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherThresholdChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["otherThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["rows"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsTitleChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["rowsTitle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojNBox<K, D>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Cell = {
        label?: string;
        column: string;
        labelHalign?: string;
        labelStyle?: CSSStyleDeclaration;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        maximizedSvgStyle?: CSSStyleDeclaration;
        maximizedSvgClassName?: string;
        minimizedSvgStyle?: CSSStyleDeclaration;
        minimizedSvgClassName?: string;
        row: string;
        showCount?: 'on' | 'off' | 'auto';
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CellContext = {
        row: string;
        column: string;
        subId: 'oj-nbox-cell';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Column = {
        id: string;
        label?: string;
        labelStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CountLabelContext = {
        row: string;
        column: string;
        nodeCount: number;
        totalNodeCount: number;
        highlightedNodeCount: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DialogContext = {
        subId: 'oj-nbox-dialog';
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupNodeContext = {
        row: string;
        column: string;
        groupCategory: string;
        subId: 'oj-nbox-group-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K> = {
        id?: K;
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        column: string;
        groupCategory?: string;
        icon?: {
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            height?: number;
            opacity?: number;
            pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
               'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            initials?: string;
            background: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
            width?: number;
        };
        indicatorColor?: string;
        indicatorIcon?: {
            borderColor?: string;
            borderRadius?: string;
            borderWidth?: number;
            color?: string;
            height?: number;
            opacity?: number;
            pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
               'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            source?: string;
            svgClassName?: string;
            svgStyle?: CSSStyleDeclaration;
            width?: number;
        };
        row: string;
        label?: string;
        secondaryLabel?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        xPercentage?: number;
        yPercentage?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext<K> = {
        id: K;
        subId: 'oj-nbox-node';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Row = {
        id: string;
        label?: string;
        labelStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K> = {
        parentElement: Element;
        id: K;
        label: string;
        secondaryLabel: string;
        row: string;
        column: string;
        color: string;
        indicatorColor: string;
        componentElement: Element;
    };
}
export interface ojNBoxEventMap<K, D extends ojNBox.Node<K> | any> extends dvtBaseComponentEventMap<ojNBoxSettableProperties<K, D>> {
    'animationOnDataChangeChanged': JetElementCustomEvent<ojNBox<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojNBox<K, D>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojNBox<K, D>["as"]>;
    'cellContentChanged': JetElementCustomEvent<ojNBox<K, D>["cellContent"]>;
    'cellMaximizeChanged': JetElementCustomEvent<ojNBox<K, D>["cellMaximize"]>;
    'cellsChanged': JetElementCustomEvent<ojNBox<K, D>["cells"]>;
    'columnsChanged': JetElementCustomEvent<ojNBox<K, D>["columns"]>;
    'columnsTitleChanged': JetElementCustomEvent<ojNBox<K, D>["columnsTitle"]>;
    'countLabelChanged': JetElementCustomEvent<ojNBox<K, D>["countLabel"]>;
    'dataChanged': JetElementCustomEvent<ojNBox<K, D>["data"]>;
    'groupAttributesChanged': JetElementCustomEvent<ojNBox<K, D>["groupAttributes"]>;
    'groupBehaviorChanged': JetElementCustomEvent<ojNBox<K, D>["groupBehavior"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojNBox<K, D>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojNBox<K, D>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojNBox<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojNBox<K, D>["hoverBehavior"]>;
    'labelTruncationChanged': JetElementCustomEvent<ojNBox<K, D>["labelTruncation"]>;
    'maximizedColumnChanged': JetElementCustomEvent<ojNBox<K, D>["maximizedColumn"]>;
    'maximizedRowChanged': JetElementCustomEvent<ojNBox<K, D>["maximizedRow"]>;
    'otherColorChanged': JetElementCustomEvent<ojNBox<K, D>["otherColor"]>;
    'otherThresholdChanged': JetElementCustomEvent<ojNBox<K, D>["otherThreshold"]>;
    'rowsChanged': JetElementCustomEvent<ojNBox<K, D>["rows"]>;
    'rowsTitleChanged': JetElementCustomEvent<ojNBox<K, D>["rowsTitle"]>;
    'selectionChanged': JetElementCustomEvent<ojNBox<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojNBox<K, D>["selectionMode"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojNBox<K, D>["styleDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojNBox<K, D>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojNBox<K, D>["touchResponse"]>;
}
export interface ojNBoxSettableProperties<K, D extends ojNBox.Node<K> | any> extends dvtBaseComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    cellContent: 'counts' | 'auto';
    cellMaximize: 'off' | 'on';
    cells: ojNBox.Cell[] | Promise<ojNBox.Cell[]> | null;
    columns: ojNBox.Column[] | Promise<ojNBox.Column[]> | null;
    columnsTitle: string;
    countLabel: ((context: ojNBox.CountLabelContext) => (string | null));
    data: DataProvider<K, D> | null;
    groupAttributes: 'color' | 'indicatorColor' | 'indicatorIconColor' | 'indicatorIconPattern' | 'indicatorIconShape';
    groupBehavior: 'acrossCells' | 'none' | 'withinCell';
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    labelTruncation: 'ifRequired' | 'on';
    maximizedColumn: string;
    maximizedRow: string;
    otherColor: string;
    otherThreshold: number;
    rows: ojNBox.Row[] | Promise<ojNBox.Row[]> | null;
    rowsTitle: string;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    styleDefaults: {
        animationDuration: number;
        cellDefaults: {
            labelHalign: 'center' | 'end' | 'start';
            labelStyle: CSSStyleDeclaration;
            maximizedSvgStyle: CSSStyleDeclaration;
            minimizedSvgStyle: CSSStyleDeclaration;
            showCount: 'on' | 'off' | 'auto';
            svgStyle: CSSStyleDeclaration;
        };
        columnLabelStyle: CSSStyleDeclaration;
        columnsTitleStyle: CSSStyleDeclaration;
        hoverBehaviorDelay: number;
        nodeDefaults: {
            borderColor: string;
            borderWidth: number;
            color: string;
            iconDefaults: {
                background: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
                borderColor: string;
                borderRadius: string;
                borderWidth: number;
                color: string;
                height: number;
                opacity: number;
                pattern: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
                   'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star';
                source: string;
                width: number;
            };
            indicatorColor: string;
            indicatorIconDefaults: {
                borderColor: string;
                borderRadius: string;
                borderWidth: number;
                color: string;
                height: number;
                opacity: number;
                pattern: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
                   'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
                shape: 'circle' | 'ellipse' | 'square' | 'plus' | 'diamond' | 'triangleUp' | 'triangleDown' | 'human' | 'rectangle' | 'star';
                source: string;
                width: number;
            };
            labelStyle: CSSStyleDeclaration;
            secondaryLabelStyle: CSSStyleDeclaration;
        };
        rowLabelStyle: CSSStyleDeclaration;
        rowsTitleStyle: CSSStyleDeclaration;
    };
    tooltip: {
        renderer: ((context: ojNBox.TooltipContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    touchResponse: 'touchStart' | 'auto';
    translations: {
        componentName?: string;
        highlightedCount?: string;
        labelAdditionalData?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelGroup?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelOther?: string;
        labelSize?: string;
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
    };
}
export interface ojNBoxSettablePropertiesLenient<K, D extends ojNBox.Node<K> | any> extends Partial<ojNBoxSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojNBoxNode extends JetElement<ojNBoxNodeSettableProperties> {
    borderColor: string;
    borderWidth: number;
    categories: string[];
    color?: string;
    column: string;
    groupCategory?: string;
    icon?: {
        background: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
        borderColor?: string;
        borderRadius?: string;
        borderWidth: number;
        color?: string;
        height?: number | null;
        initials: string;
        opacity: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string;
        svgClassName: string;
        svgStyle?: CSSStyleDeclaration;
        width?: number | null;
    };
    indicatorColor?: string;
    indicatorIcon?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth: number;
        color?: string;
        height?: number | null;
        opacity: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string | null;
        svgClassName: string;
        svgStyle?: CSSStyleDeclaration | null;
        width?: number | null;
    };
    label: string;
    row: string;
    secondaryLabel: string;
    shortDesc: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration | null;
    xPercentage?: number | null;
    yPercentage?: number | null;
    addEventListener<T extends keyof ojNBoxNodeEventMap>(type: T, listener: (this: HTMLElement, ev: ojNBoxNodeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojNBoxNodeSettableProperties>(property: T): ojNBoxNode[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojNBoxNodeSettableProperties>(property: T, value: ojNBoxNodeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojNBoxNodeSettableProperties>): void;
    setProperties(properties: ojNBoxNodeSettablePropertiesLenient): void;
}
export namespace ojNBoxNode {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojNBoxNode["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged = JetElementCustomEvent<ojNBoxNode["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojNBoxNode["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojNBoxNode["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnChanged = JetElementCustomEvent<ojNBoxNode["column"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupCategoryChanged = JetElementCustomEvent<ojNBoxNode["groupCategory"]>;
    // tslint:disable-next-line interface-over-type-literal
    type iconChanged = JetElementCustomEvent<ojNBoxNode["icon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorColorChanged = JetElementCustomEvent<ojNBoxNode["indicatorColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorIconChanged = JetElementCustomEvent<ojNBoxNode["indicatorIcon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojNBoxNode["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowChanged = JetElementCustomEvent<ojNBoxNode["row"]>;
    // tslint:disable-next-line interface-over-type-literal
    type secondaryLabelChanged = JetElementCustomEvent<ojNBoxNode["secondaryLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojNBoxNode["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojNBoxNode["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojNBoxNode["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xPercentageChanged = JetElementCustomEvent<ojNBoxNode["xPercentage"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yPercentageChanged = JetElementCustomEvent<ojNBoxNode["yPercentage"]>;
}
export interface ojNBoxNodeEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojNBoxNode["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojNBoxNode["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojNBoxNode["categories"]>;
    'colorChanged': JetElementCustomEvent<ojNBoxNode["color"]>;
    'columnChanged': JetElementCustomEvent<ojNBoxNode["column"]>;
    'groupCategoryChanged': JetElementCustomEvent<ojNBoxNode["groupCategory"]>;
    'iconChanged': JetElementCustomEvent<ojNBoxNode["icon"]>;
    'indicatorColorChanged': JetElementCustomEvent<ojNBoxNode["indicatorColor"]>;
    'indicatorIconChanged': JetElementCustomEvent<ojNBoxNode["indicatorIcon"]>;
    'labelChanged': JetElementCustomEvent<ojNBoxNode["label"]>;
    'rowChanged': JetElementCustomEvent<ojNBoxNode["row"]>;
    'secondaryLabelChanged': JetElementCustomEvent<ojNBoxNode["secondaryLabel"]>;
    'shortDescChanged': JetElementCustomEvent<ojNBoxNode["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojNBoxNode["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojNBoxNode["svgStyle"]>;
    'xPercentageChanged': JetElementCustomEvent<ojNBoxNode["xPercentage"]>;
    'yPercentageChanged': JetElementCustomEvent<ojNBoxNode["yPercentage"]>;
}
export interface ojNBoxNodeSettableProperties extends JetSettableProperties {
    borderColor: string;
    borderWidth: number;
    categories: string[];
    color?: string;
    column: string;
    groupCategory?: string;
    icon?: {
        background: 'neutral' | 'red' | 'orange' | 'forest' | 'green' | 'teal' | 'mauve' | 'purple';
        borderColor?: string;
        borderRadius?: string;
        borderWidth: number;
        color?: string;
        height?: number | null;
        initials: string;
        opacity: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'mallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string;
        svgClassName: string;
        svgStyle?: CSSStyleDeclaration;
        width?: number | null;
    };
    indicatorColor?: string;
    indicatorIcon?: {
        borderColor?: string;
        borderRadius?: string;
        borderWidth: number;
        color?: string;
        height?: number | null;
        opacity: number;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        source?: string | null;
        svgClassName: string;
        svgStyle?: CSSStyleDeclaration | null;
        width?: number | null;
    };
    label: string;
    row: string;
    secondaryLabel: string;
    shortDesc: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration | null;
    xPercentage?: number | null;
    yPercentage?: number | null;
}
export interface ojNBoxNodeSettablePropertiesLenient extends Partial<ojNBoxNodeSettableProperties> {
    [key: string]: any;
}
