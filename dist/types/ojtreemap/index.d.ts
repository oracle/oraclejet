import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTreemap<K, D extends ojTreemap.Node<K> | any> extends dvtBaseComponent<ojTreemapSettableProperties<K, D>> {
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    animationUpdateColor?: string;
    as?: string;
    colorLabel?: string;
    data: DataProvider<K, D> | null;
    displayLevels?: number;
    drilling?: 'on' | 'off';
    groupGaps?: 'all' | 'none' | 'outer';
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightMode?: 'categories' | 'descendants';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverBehaviorDelay?: number;
    isolatedNode?: any;
    layout?: 'sliceAndDiceHorizontal' | 'sliceAndDiceVertical' | 'squarified';
    nodeContent?: {
        renderer: ((context: ojTreemap.NodeContentContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    nodeDefaults?: {
        groupLabelDisplay?: 'node' | 'off' | 'header';
        header?: {
            backgroundColor?: string;
            borderColor?: string;
            hoverBackgroundColor?: string;
            hoverInnerColor?: string;
            hoverOuterColor?: string;
            isolate?: 'off' | 'on';
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: Partial<CSSStyleDeclaration>;
            selectedBackgroundColor?: string;
            selectedInnerColor?: string;
            selectedOuterColor?: string;
            useNodeColor?: 'on' | 'off';
        };
        hoverColor?: string;
        labelDisplay?: 'off' | 'node';
        labelHalign?: 'start' | 'end' | 'center';
        labelMinLength?: number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        labelValign?: 'top' | 'bottom' | 'center';
        selectedInnerColor?: string;
        selectedOuterColor?: string;
    };
    nodeSeparators?: 'bevels' | 'gaps';
    rootNode?: any;
    selection?: any[];
    selectionMode?: 'none' | 'single' | 'multiple';
    sizeLabel?: string;
    sorting?: 'on' | 'off';
    tooltip?: {
        renderer: ((context: ojTreemap.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    translations: {
        accessibleContainsControls?: string;
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
        stateLoaded?: string;
        stateLoading?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        tooltipIsolate?: string;
        tooltipRestore?: string;
    };
    addEventListener<T extends keyof ojTreemapEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTreemapEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTreemapSettableProperties<K, D>>(property: T): ojTreemap<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTreemapSettableProperties<K, D>>(property: T, value: ojTreemapSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTreemapSettableProperties<K, D>>): void;
    setProperties(properties: ojTreemapSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojTreemap.NodeContext | null;
}
export namespace ojTreemap {
    interface ojBeforeDrill<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojDrill<K, D> extends CustomEvent<{
        data: Node<K>;
        id: K;
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
    type highlightModeChanged<K, D extends Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["highlightMode"]>;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Node<K> | any> = dvtBaseComponent.trackResizeChanged<ojTreemapSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        size: number;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K, D = any> = {
        categories?: string[];
        color?: string;
        drilling?: 'inherit' | 'off' | 'on';
        groupLabelDisplay?: string;
        header?: {
            isolate?: 'off' | 'on';
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: Partial<CSSStyleDeclaration>;
            useNodeColor?: 'off' | 'on';
        };
        id?: K;
        label?: string;
        labelDisplay?: 'node' | 'off';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: Partial<CSSStyleDeclaration>;
        labelValign?: 'bottom' | 'center' | 'top';
        nodes?: Array<Node<K>>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: NodeShortDescContext<K, D>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContentContext<K, D> = {
        bounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        componentElement: Element;
        data: Node<K>;
        id: K;
        itemData: D;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        indexPath: number[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K, D> = {
        data: Node<K>;
        id: K;
        itemData: D;
        label: string;
        value: number;
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
        color: string;
        componentElement: Element;
        data: Node<K>;
        id: K;
        itemData: D;
        label: string;
        parentElement: Element;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeContentTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<NodeContentContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D>>;
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
    'highlightModeChanged': JetElementCustomEvent<ojTreemap<K, D>["highlightMode"]>;
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
    'trackResizeChanged': JetElementCustomEvent<ojTreemap<K, D>["trackResize"]>;
}
export interface ojTreemapSettableProperties<K, D extends ojTreemap.Node<K> | any> extends dvtBaseComponentSettableProperties {
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    animationUpdateColor?: string;
    as?: string;
    colorLabel?: string;
    data: DataProvider<K, D> | null;
    displayLevels?: number;
    drilling?: 'on' | 'off';
    groupGaps?: 'all' | 'none' | 'outer';
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightMode?: 'categories' | 'descendants';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverBehaviorDelay?: number;
    isolatedNode?: any;
    layout?: 'sliceAndDiceHorizontal' | 'sliceAndDiceVertical' | 'squarified';
    nodeContent?: {
        renderer: ((context: ojTreemap.NodeContentContext<K, D>) => ({
            insert: Element | string;
        }));
    };
    nodeDefaults?: {
        groupLabelDisplay?: 'node' | 'off' | 'header';
        header?: {
            backgroundColor?: string;
            borderColor?: string;
            hoverBackgroundColor?: string;
            hoverInnerColor?: string;
            hoverOuterColor?: string;
            isolate?: 'off' | 'on';
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: Partial<CSSStyleDeclaration>;
            selectedBackgroundColor?: string;
            selectedInnerColor?: string;
            selectedOuterColor?: string;
            useNodeColor?: 'on' | 'off';
        };
        hoverColor?: string;
        labelDisplay?: 'off' | 'node';
        labelHalign?: 'start' | 'end' | 'center';
        labelMinLength?: number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        labelValign?: 'top' | 'bottom' | 'center';
        selectedInnerColor?: string;
        selectedOuterColor?: string;
    };
    nodeSeparators?: 'bevels' | 'gaps';
    rootNode?: any;
    selection?: any[];
    selectionMode?: 'none' | 'single' | 'multiple';
    sizeLabel?: string;
    sorting?: 'on' | 'off';
    tooltip?: {
        renderer: ((context: ojTreemap.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    translations: {
        accessibleContainsControls?: string;
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
        stateLoaded?: string;
        stateLoading?: string;
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
export interface ojTreemapNode<K = any, D = any> extends dvtBaseComponent<ojTreemapNodeSettableProperties<K, D>> {
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    groupLabelDisplay?: 'node' | 'off' | 'header';
    header?: {
        isolate?: 'off' | 'on';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: Partial<CSSStyleDeclaration>;
        useNodeColor?: 'on' | 'off';
    };
    label?: string;
    labelDisplay?: 'off' | 'node';
    labelHalign?: 'start' | 'end' | 'center';
    labelStyle?: Partial<CSSStyleDeclaration>;
    labelValign?: 'top' | 'bottom' | 'center';
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    selectable?: 'off' | 'auto';
    shortDesc?: (string | ((context: ojTreemap.NodeShortDescContext<K, D>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value: number;
    addEventListener<T extends keyof ojTreemapNodeEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTreemapNodeEventMap<K, D>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTreemapNodeSettableProperties<K, D>>(property: T): ojTreemapNode<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTreemapNodeSettableProperties<K, D>>(property: T, value: ojTreemapNodeSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTreemapNodeSettableProperties<K, D>>): void;
    setProperties(properties: ojTreemapNodeSettablePropertiesLenient<K, D>): void;
}
export namespace ojTreemapNode {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupLabelDisplayChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["groupLabelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["header"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHalignChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelValignChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelValign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["value"]>;
}
export interface ojTreemapNodeEventMap<K = any, D = any> extends dvtBaseComponentEventMap<ojTreemapNodeSettableProperties<K, D>> {
    'categoriesChanged': JetElementCustomEvent<ojTreemapNode<K, D>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojTreemapNode<K, D>["color"]>;
    'drillingChanged': JetElementCustomEvent<ojTreemapNode<K, D>["drilling"]>;
    'groupLabelDisplayChanged': JetElementCustomEvent<ojTreemapNode<K, D>["groupLabelDisplay"]>;
    'headerChanged': JetElementCustomEvent<ojTreemapNode<K, D>["header"]>;
    'labelChanged': JetElementCustomEvent<ojTreemapNode<K, D>["label"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojTreemapNode<K, D>["labelDisplay"]>;
    'labelHalignChanged': JetElementCustomEvent<ojTreemapNode<K, D>["labelHalign"]>;
    'labelStyleChanged': JetElementCustomEvent<ojTreemapNode<K, D>["labelStyle"]>;
    'labelValignChanged': JetElementCustomEvent<ojTreemapNode<K, D>["labelValign"]>;
    'patternChanged': JetElementCustomEvent<ojTreemapNode<K, D>["pattern"]>;
    'selectableChanged': JetElementCustomEvent<ojTreemapNode<K, D>["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojTreemapNode<K, D>["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojTreemapNode<K, D>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTreemapNode<K, D>["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojTreemapNode<K, D>["value"]>;
}
export interface ojTreemapNodeSettableProperties<K = any, D = any> extends dvtBaseComponentSettableProperties {
    categories?: string[];
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    groupLabelDisplay?: 'node' | 'off' | 'header';
    header?: {
        isolate?: 'off' | 'on';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: Partial<CSSStyleDeclaration>;
        useNodeColor?: 'on' | 'off';
    };
    label?: string;
    labelDisplay?: 'off' | 'node';
    labelHalign?: 'start' | 'end' | 'center';
    labelStyle?: Partial<CSSStyleDeclaration>;
    labelValign?: 'top' | 'bottom' | 'center';
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none';
    selectable?: 'off' | 'auto';
    shortDesc?: (string | ((context: ojTreemap.NodeShortDescContext<K, D>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value: number;
}
export interface ojTreemapNodeSettablePropertiesLenient<K = any, D = any> extends Partial<ojTreemapNodeSettableProperties<K, D>> {
    [key: string]: any;
}
export type TreemapElement<K, D extends ojTreemap.Node<K> | any> = ojTreemap<K, D>;
export type TreemapNodeElement<K = any, D = any> = ojTreemapNode<K, D>;
export namespace TreemapElement {
    interface ojBeforeDrill<K, D> extends CustomEvent<{
        data: ojTreemap.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    interface ojDrill<K, D> extends CustomEvent<{
        data: ojTreemap.Node<K>;
        id: K;
        itemData: D;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationUpdateColorChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["animationUpdateColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorLabelChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["colorLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayLevelsChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["displayLevels"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupGapsChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["groupGaps"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightModeChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["highlightMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type isolatedNodeChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["isolatedNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeContentChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["nodeContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeDefaultsChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["nodeDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nodeSeparatorsChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["nodeSeparators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rootNodeChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["rootNode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeLabelChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["sizeLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sortingChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["sorting"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends ojTreemap.Node<K> | any> = JetElementCustomEvent<ojTreemap<K, D>["touchResponse"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojTreemap.Node<K> | any> = dvtBaseComponent.trackResizeChanged<ojTreemapSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        size: number;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Node<K, D = any> = {
        categories?: string[];
        color?: string;
        drilling?: 'inherit' | 'off' | 'on';
        groupLabelDisplay?: string;
        header?: {
            isolate?: 'off' | 'on';
            labelHalign?: 'center' | 'end' | 'start';
            labelStyle?: Partial<CSSStyleDeclaration>;
            useNodeColor?: 'off' | 'on';
        };
        id?: K;
        label?: string;
        labelDisplay?: 'node' | 'off';
        labelHalign?: 'center' | 'end' | 'start';
        labelStyle?: Partial<CSSStyleDeclaration>;
        labelValign?: 'bottom' | 'center' | 'top';
        nodes?: Array<ojTreemap.Node<K>>;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: ojTreemap.NodeShortDescContext<K, D>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContentContext<K, D> = {
        bounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        componentElement: Element;
        data: ojTreemap.Node<K>;
        id: K;
        itemData: D;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        indexPath: number[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeShortDescContext<K, D> = {
        data: ojTreemap.Node<K>;
        id: K;
        itemData: D;
        label: string;
        value: number;
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
        color: string;
        componentElement: Element;
        data: ojTreemap.Node<K>;
        id: K;
        itemData: D;
        label: string;
        parentElement: Element;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeContentTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<NodeContentContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderNodeTemplate = import('ojs/ojvcomponent').TemplateSlot<NodeTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D>>;
}
export namespace TreemapNodeElement {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupLabelDisplayChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["groupLabelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type headerChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["header"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHalignChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelHalign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelValignChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["labelValign"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any, D = any> = JetElementCustomEvent<ojTreemapNode<K, D>["value"]>;
}
export interface TreemapIntrinsicProps extends Partial<Readonly<ojTreemapSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojBeforeDrill?: (value: ojTreemapEventMap<any, any>['ojBeforeDrill']) => void;
    onojDrill?: (value: ojTreemapEventMap<any, any>['ojDrill']) => void;
    onanimationDurationChanged?: (value: ojTreemapEventMap<any, any>['animationDurationChanged']) => void;
    onanimationOnDataChangeChanged?: (value: ojTreemapEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojTreemapEventMap<any, any>['animationOnDisplayChanged']) => void;
    onanimationUpdateColorChanged?: (value: ojTreemapEventMap<any, any>['animationUpdateColorChanged']) => void;
    onasChanged?: (value: ojTreemapEventMap<any, any>['asChanged']) => void;
    oncolorLabelChanged?: (value: ojTreemapEventMap<any, any>['colorLabelChanged']) => void;
    ondataChanged?: (value: ojTreemapEventMap<any, any>['dataChanged']) => void;
    ondisplayLevelsChanged?: (value: ojTreemapEventMap<any, any>['displayLevelsChanged']) => void;
    ondrillingChanged?: (value: ojTreemapEventMap<any, any>['drillingChanged']) => void;
    ongroupGapsChanged?: (value: ojTreemapEventMap<any, any>['groupGapsChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojTreemapEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojTreemapEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightModeChanged?: (value: ojTreemapEventMap<any, any>['highlightModeChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojTreemapEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojTreemapEventMap<any, any>['hoverBehaviorChanged']) => void;
    onhoverBehaviorDelayChanged?: (value: ojTreemapEventMap<any, any>['hoverBehaviorDelayChanged']) => void;
    onisolatedNodeChanged?: (value: ojTreemapEventMap<any, any>['isolatedNodeChanged']) => void;
    onlayoutChanged?: (value: ojTreemapEventMap<any, any>['layoutChanged']) => void;
    onnodeContentChanged?: (value: ojTreemapEventMap<any, any>['nodeContentChanged']) => void;
    onnodeDefaultsChanged?: (value: ojTreemapEventMap<any, any>['nodeDefaultsChanged']) => void;
    onnodeSeparatorsChanged?: (value: ojTreemapEventMap<any, any>['nodeSeparatorsChanged']) => void;
    onrootNodeChanged?: (value: ojTreemapEventMap<any, any>['rootNodeChanged']) => void;
    onselectionChanged?: (value: ojTreemapEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojTreemapEventMap<any, any>['selectionModeChanged']) => void;
    onsizeLabelChanged?: (value: ojTreemapEventMap<any, any>['sizeLabelChanged']) => void;
    onsortingChanged?: (value: ojTreemapEventMap<any, any>['sortingChanged']) => void;
    ontooltipChanged?: (value: ojTreemapEventMap<any, any>['tooltipChanged']) => void;
    ontouchResponseChanged?: (value: ojTreemapEventMap<any, any>['touchResponseChanged']) => void;
    ontrackResizeChanged?: (value: ojTreemapEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface TreemapNodeIntrinsicProps extends Partial<Readonly<ojTreemapNodeSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: ojTreemapNodeEventMap<any, any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojTreemapNodeEventMap<any, any>['colorChanged']) => void;
    ondrillingChanged?: (value: ojTreemapNodeEventMap<any, any>['drillingChanged']) => void;
    ongroupLabelDisplayChanged?: (value: ojTreemapNodeEventMap<any, any>['groupLabelDisplayChanged']) => void;
    onheaderChanged?: (value: ojTreemapNodeEventMap<any, any>['headerChanged']) => void;
    onlabelChanged?: (value: ojTreemapNodeEventMap<any, any>['labelChanged']) => void;
    onlabelDisplayChanged?: (value: ojTreemapNodeEventMap<any, any>['labelDisplayChanged']) => void;
    onlabelHalignChanged?: (value: ojTreemapNodeEventMap<any, any>['labelHalignChanged']) => void;
    onlabelStyleChanged?: (value: ojTreemapNodeEventMap<any, any>['labelStyleChanged']) => void;
    onlabelValignChanged?: (value: ojTreemapNodeEventMap<any, any>['labelValignChanged']) => void;
    onpatternChanged?: (value: ojTreemapNodeEventMap<any, any>['patternChanged']) => void;
    onselectableChanged?: (value: ojTreemapNodeEventMap<any, any>['selectableChanged']) => void;
    onshortDescChanged?: (value: ojTreemapNodeEventMap<any, any>['shortDescChanged']) => void;
    onsvgClassNameChanged?: (value: ojTreemapNodeEventMap<any, any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojTreemapNodeEventMap<any, any>['svgStyleChanged']) => void;
    onvalueChanged?: (value: ojTreemapNodeEventMap<any, any>['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-treemap": TreemapIntrinsicProps;
            "oj-treemap-node": TreemapNodeIntrinsicProps;
        }
    }
}
