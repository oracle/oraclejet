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
export interface ojPictoChart<K, D extends ojPictoChart.Item<K> | any> extends dvtBaseComponent<ojPictoChartSettableProperties<K, D>> {
    animationDuration?: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'popIn' | 'alphaFade' | 'zoom' | 'none';
    as: string;
    columnCount: number | null;
    columnWidth: number | null;
    data: DataProvider<K, D> | null;
    drilling: 'on' | 'off';
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverBehaviorDelay: number;
    layout: 'vertical' | 'horizontal';
    layoutOrigin: 'topEnd' | 'bottomStart' | 'bottomEnd' | 'topStart';
    rowCount: number | null;
    rowHeight: number | null;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    tooltip: {
        renderer: ((context: ojPictoChart.TooltipContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
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
    addEventListener<T extends keyof ojPictoChartEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojPictoChartEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojPictoChartSettableProperties<K, D>>(property: T): ojPictoChart<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojPictoChartSettableProperties<K, D>>(property: T, value: ojPictoChartSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojPictoChartSettableProperties<K, D>>): void;
    setProperties(properties: ojPictoChartSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojPictoChart.NodeContext | null;
}
export namespace ojPictoChart {
    interface ojDrill extends CustomEvent<{
        id: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnCountChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["columnCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnWidthChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["columnWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutOriginChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["layoutOrigin"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowCountChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["rowCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowHeightChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["rowHeight"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        id?: K;
        name?: string;
        shape?: 'ellipse' | 'square' | 'circle' | 'diamond' | 'triangleUp' | 'triangleDown' | 'star' | 'plus' | 'human' | 'none' | 'rectangle' | string;
        color?: string;
        borderColor?: string;
        borderWidth?: number;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        sourceHover?: string;
        sourceSelected?: string;
        sourceHoverSelected?: string;
        count?: number;
        rowSpan?: number;
        columnSpan?: number;
        shortDesc?: string;
        categories?: string[];
        drilling?: 'inherit' | 'off' | 'on';
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext<K> = {
        color: string;
        count: number;
        id: K;
        name: string;
        selected: boolean;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        subId: string;
        index: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K> = {
        parentElement: Element;
        id: K;
        name: string;
        count: number;
        color: string;
        componentElement: Element;
    };
}
export interface ojPictoChartEventMap<K, D extends ojPictoChart.Item<K> | any> extends dvtBaseComponentEventMap<ojPictoChartSettableProperties<K, D>> {
    'ojDrill': ojPictoChart.ojDrill;
    'animationDurationChanged': JetElementCustomEvent<ojPictoChart<K, D>["animationDuration"]>;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojPictoChart<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojPictoChart<K, D>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojPictoChart<K, D>["as"]>;
    'columnCountChanged': JetElementCustomEvent<ojPictoChart<K, D>["columnCount"]>;
    'columnWidthChanged': JetElementCustomEvent<ojPictoChart<K, D>["columnWidth"]>;
    'dataChanged': JetElementCustomEvent<ojPictoChart<K, D>["data"]>;
    'drillingChanged': JetElementCustomEvent<ojPictoChart<K, D>["drilling"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojPictoChart<K, D>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojPictoChart<K, D>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojPictoChart<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojPictoChart<K, D>["hoverBehavior"]>;
    'hoverBehaviorDelayChanged': JetElementCustomEvent<ojPictoChart<K, D>["hoverBehaviorDelay"]>;
    'layoutChanged': JetElementCustomEvent<ojPictoChart<K, D>["layout"]>;
    'layoutOriginChanged': JetElementCustomEvent<ojPictoChart<K, D>["layoutOrigin"]>;
    'rowCountChanged': JetElementCustomEvent<ojPictoChart<K, D>["rowCount"]>;
    'rowHeightChanged': JetElementCustomEvent<ojPictoChart<K, D>["rowHeight"]>;
    'selectionChanged': JetElementCustomEvent<ojPictoChart<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojPictoChart<K, D>["selectionMode"]>;
    'tooltipChanged': JetElementCustomEvent<ojPictoChart<K, D>["tooltip"]>;
}
export interface ojPictoChartSettableProperties<K, D extends ojPictoChart.Item<K> | any> extends dvtBaseComponentSettableProperties {
    animationDuration?: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'popIn' | 'alphaFade' | 'zoom' | 'none';
    as: string;
    columnCount: number | null;
    columnWidth: number | null;
    data: DataProvider<K, D> | null;
    drilling: 'on' | 'off';
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverBehaviorDelay: number;
    layout: 'vertical' | 'horizontal';
    layoutOrigin: 'topEnd' | 'bottomStart' | 'bottomEnd' | 'topStart';
    rowCount: number | null;
    rowHeight: number | null;
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    tooltip: {
        renderer: ((context: ojPictoChart.TooltipContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
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
export interface ojPictoChartSettablePropertiesLenient<K, D extends ojPictoChart.Item<K> | any> extends Partial<ojPictoChartSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojPictoChartItem extends JetElement<ojPictoChartItemSettableProperties> {
    borderColor: string;
    borderWidth: number;
    categories: string[];
    color: string;
    columnSpan: number;
    count: number;
    drilling: 'inherit' | 'off' | 'on';
    name: string;
    rowSpan: number;
    shape?: 'circle' | 'diamond' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'none' | string;
    shortDesc: string;
    source: string;
    sourceHover: string;
    sourceHoverSelected: string;
    sourceSelected: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    addEventListener<T extends keyof ojPictoChartItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojPictoChartItemEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojPictoChartItemSettableProperties>(property: T): ojPictoChartItem[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojPictoChartItemSettableProperties>(property: T, value: ojPictoChartItemSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojPictoChartItemSettableProperties>): void;
    setProperties(properties: ojPictoChartItemSettablePropertiesLenient): void;
}
export namespace ojPictoChartItem {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojPictoChartItem["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged = JetElementCustomEvent<ojPictoChartItem["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojPictoChartItem["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojPictoChartItem["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnSpanChanged = JetElementCustomEvent<ojPictoChartItem["columnSpan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type countChanged = JetElementCustomEvent<ojPictoChartItem["count"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojPictoChartItem["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nameChanged = JetElementCustomEvent<ojPictoChartItem["name"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowSpanChanged = JetElementCustomEvent<ojPictoChartItem["rowSpan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shapeChanged = JetElementCustomEvent<ojPictoChartItem["shape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojPictoChartItem["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged = JetElementCustomEvent<ojPictoChartItem["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged = JetElementCustomEvent<ojPictoChartItem["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged = JetElementCustomEvent<ojPictoChartItem["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged = JetElementCustomEvent<ojPictoChartItem["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojPictoChartItem["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojPictoChartItem["svgStyle"]>;
}
export interface ojPictoChartItemEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojPictoChartItem["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojPictoChartItem["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojPictoChartItem["categories"]>;
    'colorChanged': JetElementCustomEvent<ojPictoChartItem["color"]>;
    'columnSpanChanged': JetElementCustomEvent<ojPictoChartItem["columnSpan"]>;
    'countChanged': JetElementCustomEvent<ojPictoChartItem["count"]>;
    'drillingChanged': JetElementCustomEvent<ojPictoChartItem["drilling"]>;
    'nameChanged': JetElementCustomEvent<ojPictoChartItem["name"]>;
    'rowSpanChanged': JetElementCustomEvent<ojPictoChartItem["rowSpan"]>;
    'shapeChanged': JetElementCustomEvent<ojPictoChartItem["shape"]>;
    'shortDescChanged': JetElementCustomEvent<ojPictoChartItem["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojPictoChartItem["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojPictoChartItem["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojPictoChartItem["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojPictoChartItem["sourceSelected"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojPictoChartItem["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojPictoChartItem["svgStyle"]>;
}
export interface ojPictoChartItemSettableProperties extends JetSettableProperties {
    borderColor: string;
    borderWidth: number;
    categories: string[];
    color: string;
    columnSpan: number;
    count: number;
    drilling: 'inherit' | 'off' | 'on';
    name: string;
    rowSpan: number;
    shape?: 'circle' | 'diamond' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'none' | string;
    shortDesc: string;
    source: string;
    sourceHover: string;
    sourceHoverSelected: string;
    sourceSelected: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
}
export interface ojPictoChartItemSettablePropertiesLenient extends Partial<ojPictoChartItemSettableProperties> {
    [key: string]: any;
}
