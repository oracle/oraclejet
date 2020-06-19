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
export interface ojTreemap<K, D extends ojTreemap.Node<K> | any> extends dvtBaseComponent<ojTreemapSettableProperties<K, D>> {
    animationDuration: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    animationUpdateColor: string;
    as: string;
    colorLabel: string;
    data: DataProvider<K, D> | null;
    displayLevels: number;
    drilling: 'on' | 'off';
    groupGaps: 'all' | 'none' | 'outer';
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverBehaviorDelay: number;
    isolatedNode: any;
    layout: 'sliceAndDiceHorizontal' | 'sliceAndDiceVertical' | 'squarified';
    nodeContent: {
        renderer: ((context: ojTreemap.NodeContentContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    nodeDefaults: {
        groupLabelDisplay: 'node' | 'off' | 'header';
        header: {
            backgroundColor: string;
            borderColor: string;
            hoverBackgroundColor: string;
            hoverInnerColor: string;
            hoverOuterColor: string;
            isolate: 'off' | 'on';
            labelHalign: 'center' | 'end' | 'start';
            labelStyle: CSSStyleDeclaration;
            selectedBackgroundColor: string;
            selectedInnerColor: string;
            selectedOuterColor: string;
            useNodeColor: 'on' | 'off';
        };
        hoverColor: string;
        labelDisplay: 'off' | 'node';
        labelHalign: 'start' | 'end' | 'center';
        labelMinLength: number;
        labelStyle: CSSStyleDeclaration;
        labelValign: 'top' | 'bottom' | 'center';
        selectedInnerColor: string;
        selectedOuterColor: string;
    };
    nodeSeparators: 'bevels' | 'gaps';
    rootNode: any;
    selection: any[];
    selectionMode: 'none' | 'single' | 'multiple';
    sizeLabel: string;
    sorting: 'on' | 'off';
    tooltip: {
        renderer: ((context: ojTreemap.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelColor?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
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
        tooltipIsolate?: string;
        tooltipRestore?: string;
    };
    addEventListener<T extends keyof ojTreemapEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTreemapEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTreemapSettableProperties<K, D>>(property: T): ojTreemap<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTreemapSettableProperties<K, D>>(property: T, value: ojTreemapSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTreemapSettableProperties<K, D>>): void;
    setProperties(properties: ojTreemapSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojTreemap.NodeContext | null;
}
export namespace ojTreemap {
    interface ojBeforeDrill<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojDrill<K, D> extends CustomEvent<{
        id: K;
        data: Node<K>;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationUpdateColorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationUpdateColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorLabelChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["colorLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayLevelsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["displayLevels"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupGapsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["groupGaps"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type isolatedNodeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["isolatedNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeContentChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["nodeContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDefaultsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["nodeDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeSeparatorsChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["nodeSeparators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootNodeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["rootNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeLabelChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["sizeLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sortingChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["sorting"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        size: number;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K> = {
        categories?: string[];
        color?: string;
        drilling?: 'inherit' | 'off' | 'on';
        groupLabelDisplay?: string;
        header?: {
            isolate?: 'off' | 'on';
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: CSSStyleDeclaration;
            useNodeColor?: 'off' | 'on';
        };
        id?: K;
        label?: string;
        labelDisplay?: 'node' | 'off';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: CSSStyleDeclaration;
        labelValign?: 'bottom' | 'center' | 'top';
        nodes?: Array<Node<K>>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        selectable?: 'auto' | 'off';
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContentContext<K, D> = {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        id: K;
        data: Node<K>;
        itemData: D;
        componentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        subId: string;
        indexPath: number[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
        parentData: any[];
        parentKey: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        parentElement: Element;
        id: K;
        label: string;
        value: number;
        color: string;
        data: Node<K>;
        itemData: D;
        componentElement: Element;
    };
}
export interface ojTreemapEventMap<K, D extends ojTreemap.Node<K> | any> extends dvtBaseComponentEventMap<ojTreemapSettableProperties<K, D>> {
    'ojBeforeDrill': ojTreemap.ojBeforeDrill<K, D>;
    'ojDrill': ojTreemap.ojDrill<K, D>;
    'animationDurationChanged': JetElementCustomEvent<ojTreemap<K, D>["animationDuration"]>;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojTreemap<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojTreemap<K, D>["animationOnDisplay"]>;
    'animationUpdateColorChanged': JetElementCustomEvent<ojTreemap<K, D>["animationUpdateColor"]>;
    'asChanged': JetElementCustomEvent<ojTreemap<K, D>["as"]>;
    'colorLabelChanged': JetElementCustomEvent<ojTreemap<K, D>["colorLabel"]>;
    'dataChanged': JetElementCustomEvent<ojTreemap<K, D>["data"]>;
    'displayLevelsChanged': JetElementCustomEvent<ojTreemap<K, D>["displayLevels"]>;
    'drillingChanged': JetElementCustomEvent<ojTreemap<K, D>["drilling"]>;
    'groupGapsChanged': JetElementCustomEvent<ojTreemap<K, D>["groupGaps"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojTreemap<K, D>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojTreemap<K, D>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojTreemap<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojTreemap<K, D>["hoverBehavior"]>;
    'hoverBehaviorDelayChanged': JetElementCustomEvent<ojTreemap<K, D>["hoverBehaviorDelay"]>;
    'isolatedNodeChanged': JetElementCustomEvent<ojTreemap<K, D>["isolatedNode"]>;
    'layoutChanged': JetElementCustomEvent<ojTreemap<K, D>["layout"]>;
    'nodeContentChanged': JetElementCustomEvent<ojTreemap<K, D>["nodeContent"]>;
    'nodeDefaultsChanged': JetElementCustomEvent<ojTreemap<K, D>["nodeDefaults"]>;
    'nodeSeparatorsChanged': JetElementCustomEvent<ojTreemap<K, D>["nodeSeparators"]>;
    'rootNodeChanged': JetElementCustomEvent<ojTreemap<K, D>["rootNode"]>;
    'selectionChanged': JetElementCustomEvent<ojTreemap<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojTreemap<K, D>["selectionMode"]>;
    'sizeLabelChanged': JetElementCustomEvent<ojTreemap<K, D>["sizeLabel"]>;
    'sortingChanged': JetElementCustomEvent<ojTreemap<K, D>["sorting"]>;
    'tooltipChanged': JetElementCustomEvent<ojTreemap<K, D>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojTreemap<K, D>["touchResponse"]>;
}
export interface ojTreemapSettableProperties<K, D extends ojTreemap.Node<K> | any> extends dvtBaseComponentSettableProperties {
    animationDuration: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    animationUpdateColor: string;
    as: string;
    colorLabel: string;
    data: DataProvider<K, D> | null;
    displayLevels: number;
    drilling: 'on' | 'off';
    groupGaps: 'all' | 'none' | 'outer';
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverBehaviorDelay: number;
    isolatedNode: any;
    layout: 'sliceAndDiceHorizontal' | 'sliceAndDiceVertical' | 'squarified';
    nodeContent: {
        renderer: ((context: ojTreemap.NodeContentContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    nodeDefaults: {
        groupLabelDisplay: 'node' | 'off' | 'header';
        header: {
            backgroundColor: string;
            borderColor: string;
            hoverBackgroundColor: string;
            hoverInnerColor: string;
            hoverOuterColor: string;
            isolate: 'off' | 'on';
            labelHalign: 'center' | 'end' | 'start';
            labelStyle: CSSStyleDeclaration;
            selectedBackgroundColor: string;
            selectedInnerColor: string;
            selectedOuterColor: string;
            useNodeColor: 'on' | 'off';
        };
        hoverColor: string;
        labelDisplay: 'off' | 'node';
        labelHalign: 'start' | 'end' | 'center';
        labelMinLength: number;
        labelStyle: CSSStyleDeclaration;
        labelValign: 'top' | 'bottom' | 'center';
        selectedInnerColor: string;
        selectedOuterColor: string;
    };
    nodeSeparators: 'bevels' | 'gaps';
    rootNode: any;
    selection: any[];
    selectionMode: 'none' | 'single' | 'multiple';
    sizeLabel: string;
    sorting: 'on' | 'off';
    tooltip: {
        renderer: ((context: ojTreemap.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelColor?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
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
        tooltipIsolate?: string;
        tooltipRestore?: string;
    };
}
export interface ojTreemapSettablePropertiesLenient<K, D extends ojTreemap.Node<K> | any> extends Partial<ojTreemapSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojTreemapNode extends JetElement<ojTreemapNodeSettableProperties> {
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    groupLabelDisplay?: 'node' | 'off' | 'header';
    header?: {
        isolate?: 'off' | 'on';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: CSSStyleDeclaration;
        useNodeColor?: 'on' | 'off';
    };
    label?: string;
    labelDisplay?: 'off' | 'node';
    labelHalign?: 'start' | 'end' | 'center';
    labelStyle?: CSSStyleDeclaration;
    labelValign?: 'top' | 'bottom' | 'center';
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    selectable?: 'off' | 'auto';
    shortDesc?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    value: number;
    addEventListener<T extends keyof ojTreemapNodeEventMap>(type: T, listener: (this: HTMLElement, ev: ojTreemapNodeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTreemapNodeSettableProperties>(property: T): ojTreemapNode[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTreemapNodeSettableProperties>(property: T, value: ojTreemapNodeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTreemapNodeSettableProperties>): void;
    setProperties(properties: ojTreemapNodeSettablePropertiesLenient): void;
}
export namespace ojTreemapNode {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojTreemapNode["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojTreemapNode["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojTreemapNode["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupLabelDisplayChanged = JetElementCustomEvent<ojTreemapNode["groupLabelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged = JetElementCustomEvent<ojTreemapNode["header"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojTreemapNode["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged = JetElementCustomEvent<ojTreemapNode["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHalignChanged = JetElementCustomEvent<ojTreemapNode["labelHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojTreemapNode["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelValignChanged = JetElementCustomEvent<ojTreemapNode["labelValign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged = JetElementCustomEvent<ojTreemapNode["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojTreemapNode["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojTreemapNode["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojTreemapNode["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojTreemapNode["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojTreemapNode["value"]>;
}
export interface ojTreemapNodeEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEvent<ojTreemapNode["categories"]>;
    'colorChanged': JetElementCustomEvent<ojTreemapNode["color"]>;
    'drillingChanged': JetElementCustomEvent<ojTreemapNode["drilling"]>;
    'groupLabelDisplayChanged': JetElementCustomEvent<ojTreemapNode["groupLabelDisplay"]>;
    'headerChanged': JetElementCustomEvent<ojTreemapNode["header"]>;
    'labelChanged': JetElementCustomEvent<ojTreemapNode["label"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojTreemapNode["labelDisplay"]>;
    'labelHalignChanged': JetElementCustomEvent<ojTreemapNode["labelHalign"]>;
    'labelStyleChanged': JetElementCustomEvent<ojTreemapNode["labelStyle"]>;
    'labelValignChanged': JetElementCustomEvent<ojTreemapNode["labelValign"]>;
    'patternChanged': JetElementCustomEvent<ojTreemapNode["pattern"]>;
    'selectableChanged': JetElementCustomEvent<ojTreemapNode["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojTreemapNode["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojTreemapNode["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTreemapNode["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojTreemapNode["value"]>;
}
export interface ojTreemapNodeSettableProperties extends JetSettableProperties {
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    groupLabelDisplay?: 'node' | 'off' | 'header';
    header?: {
        isolate?: 'off' | 'on';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: CSSStyleDeclaration;
        useNodeColor?: 'on' | 'off';
    };
    label?: string;
    labelDisplay?: 'off' | 'node';
    labelHalign?: 'start' | 'end' | 'center';
    labelStyle?: CSSStyleDeclaration;
    labelValign?: 'top' | 'bottom' | 'center';
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    selectable?: 'off' | 'auto';
    shortDesc?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    value: number;
}
export interface ojTreemapNodeSettablePropertiesLenient extends Partial<ojTreemapNodeSettableProperties> {
    [key: string]: any;
}
