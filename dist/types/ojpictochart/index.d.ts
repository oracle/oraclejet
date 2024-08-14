import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojPictoChart<K, D extends ojPictoChart.Item<K> | any> extends dvtBaseComponent<ojPictoChartSettableProperties<K, D>> {
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'popIn' | 'alphaFade' | 'zoom' | 'none';
    as?: string;
    columnCount?: number | null;
    columnWidth?: number | null;
    data: DataProvider<K, D> | null;
    drilling?: 'on' | 'off';
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverBehaviorDelay?: number;
    layout?: 'vertical' | 'horizontal';
    layoutOrigin?: 'topEnd' | 'bottomStart' | 'bottomEnd' | 'topStart';
    rowCount?: number | null;
    rowHeight?: number | null;
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    tooltip?: {
        renderer: ((context: ojPictoChart.TooltipRendererContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    translations: {
        accessibleContainsControls?: string;
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
    addEventListener<T extends keyof ojPictoChartEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojPictoChartEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Item<K> | any> = dvtBaseComponent.trackResizeChanged<ojPictoChartSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        columnSpan?: number;
        count?: number;
        drilling?: 'inherit' | 'off' | 'on';
        id?: K;
        name?: string;
        rowSpan?: number;
        shape?: 'ellipse' | 'square' | 'circle' | 'diamond' | 'triangleUp' | 'triangleDown' | 'star' | 'plus' | 'human' | 'none' | 'rectangle' | string;
        shortDesc?: (string | ((context: ItemShortDescContext<K>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
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
    type ItemShortDescContext<K> = {
        count: number;
        id: K;
        name: string;
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
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K> = {
        color: string;
        componentElement: Element;
        count: number;
        id: K;
        name: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K> = {
        color: string;
        componentElement: Element;
        count: number;
        id: K;
        name: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K>>;
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
    'trackResizeChanged': JetElementCustomEvent<ojPictoChart<K, D>["trackResize"]>;
}
export interface ojPictoChartSettableProperties<K, D extends ojPictoChart.Item<K> | any> extends dvtBaseComponentSettableProperties {
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'popIn' | 'alphaFade' | 'zoom' | 'none';
    as?: string;
    columnCount?: number | null;
    columnWidth?: number | null;
    data: DataProvider<K, D> | null;
    drilling?: 'on' | 'off';
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverBehaviorDelay?: number;
    layout?: 'vertical' | 'horizontal';
    layoutOrigin?: 'topEnd' | 'bottomStart' | 'bottomEnd' | 'topStart';
    rowCount?: number | null;
    rowHeight?: number | null;
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    tooltip?: {
        renderer: ((context: ojPictoChart.TooltipRendererContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    translations: {
        accessibleContainsControls?: string;
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
export interface ojPictoChartItem<K = any> extends dvtBaseComponent<ojPictoChartItemSettableProperties<K>> {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    columnSpan?: number;
    count?: number;
    drilling?: 'inherit' | 'off' | 'on';
    name?: string;
    rowSpan?: number;
    shape?: 'circle' | 'diamond' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'none' | string;
    shortDesc?: (string | ((context: ojPictoChart.ItemShortDescContext<K>) => string));
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    addEventListener<T extends keyof ojPictoChartItemEventMap<K>>(type: T, listener: (this: HTMLElement, ev: ojPictoChartItemEventMap<K>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojPictoChartItemSettableProperties<K>>(property: T): ojPictoChartItem<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojPictoChartItemSettableProperties<K>>(property: T, value: ojPictoChartItemSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojPictoChartItemSettableProperties<K>>): void;
    setProperties(properties: ojPictoChartItemSettablePropertiesLenient<K>): void;
}
export namespace ojPictoChartItem {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnSpanChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["columnSpan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type countChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["count"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nameChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["name"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowSpanChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["rowSpan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shapeChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["shape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["svgStyle"]>;
}
export interface ojPictoChartItemEventMap<K = any> extends dvtBaseComponentEventMap<ojPictoChartItemSettableProperties<K>> {
    'borderColorChanged': JetElementCustomEvent<ojPictoChartItem<K>["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojPictoChartItem<K>["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojPictoChartItem<K>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojPictoChartItem<K>["color"]>;
    'columnSpanChanged': JetElementCustomEvent<ojPictoChartItem<K>["columnSpan"]>;
    'countChanged': JetElementCustomEvent<ojPictoChartItem<K>["count"]>;
    'drillingChanged': JetElementCustomEvent<ojPictoChartItem<K>["drilling"]>;
    'nameChanged': JetElementCustomEvent<ojPictoChartItem<K>["name"]>;
    'rowSpanChanged': JetElementCustomEvent<ojPictoChartItem<K>["rowSpan"]>;
    'shapeChanged': JetElementCustomEvent<ojPictoChartItem<K>["shape"]>;
    'shortDescChanged': JetElementCustomEvent<ojPictoChartItem<K>["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojPictoChartItem<K>["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojPictoChartItem<K>["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojPictoChartItem<K>["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojPictoChartItem<K>["sourceSelected"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojPictoChartItem<K>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojPictoChartItem<K>["svgStyle"]>;
}
export interface ojPictoChartItemSettableProperties<K = any> extends dvtBaseComponentSettableProperties {
    borderColor?: string;
    borderWidth?: number;
    categories?: string[];
    color?: string;
    columnSpan?: number;
    count?: number;
    drilling?: 'inherit' | 'off' | 'on';
    name?: string;
    rowSpan?: number;
    shape?: 'circle' | 'diamond' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'none' | string;
    shortDesc?: (string | ((context: ojPictoChart.ItemShortDescContext<K>) => string));
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
}
export interface ojPictoChartItemSettablePropertiesLenient<K = any> extends Partial<ojPictoChartItemSettableProperties<K>> {
    [key: string]: any;
}
export type PictoChartElement<K, D extends ojPictoChart.Item<K> | any> = ojPictoChart<K, D>;
export type PictoChartItemElement<K = any> = ojPictoChartItem<K>;
export namespace PictoChartElement {
    interface ojDrill extends CustomEvent<{
        id: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnCountChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["columnCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnWidthChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["columnWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorDelayChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["hoverBehaviorDelay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutOriginChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["layoutOrigin"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowCountChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["rowCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowHeightChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["rowHeight"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojPictoChart.Item<K> | any> = JetElementCustomEvent<ojPictoChart<K, D>["tooltip"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojPictoChart.Item<K> | any> = dvtBaseComponent.trackResizeChanged<ojPictoChartSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        borderColor?: string;
        borderWidth?: number;
        categories?: string[];
        color?: string;
        columnSpan?: number;
        count?: number;
        drilling?: 'inherit' | 'off' | 'on';
        id?: K;
        name?: string;
        rowSpan?: number;
        shape?: 'ellipse' | 'square' | 'circle' | 'diamond' | 'triangleUp' | 'triangleDown' | 'star' | 'plus' | 'human' | 'none' | 'rectangle' | string;
        shortDesc?: (string | ((context: ojPictoChart.ItemShortDescContext<K>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
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
    type ItemShortDescContext<K> = {
        count: number;
        id: K;
        name: string;
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
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K> = {
        color: string;
        componentElement: Element;
        count: number;
        id: K;
        name: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K> = {
        color: string;
        componentElement: Element;
        count: number;
        id: K;
        name: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K>>;
}
export namespace PictoChartItemElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type columnSpanChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["columnSpan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type countChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["count"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nameChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["name"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowSpanChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["rowSpan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shapeChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["shape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any> = JetElementCustomEvent<ojPictoChartItem<K>["svgStyle"]>;
}
export interface PictoChartIntrinsicProps extends Partial<Readonly<ojPictoChartSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojDrill?: (value: ojPictoChartEventMap<any, any>['ojDrill']) => void;
    onanimationDurationChanged?: (value: ojPictoChartEventMap<any, any>['animationDurationChanged']) => void;
    onanimationOnDataChangeChanged?: (value: ojPictoChartEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojPictoChartEventMap<any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojPictoChartEventMap<any, any>['asChanged']) => void;
    oncolumnCountChanged?: (value: ojPictoChartEventMap<any, any>['columnCountChanged']) => void;
    oncolumnWidthChanged?: (value: ojPictoChartEventMap<any, any>['columnWidthChanged']) => void;
    ondataChanged?: (value: ojPictoChartEventMap<any, any>['dataChanged']) => void;
    ondrillingChanged?: (value: ojPictoChartEventMap<any, any>['drillingChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojPictoChartEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojPictoChartEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojPictoChartEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojPictoChartEventMap<any, any>['hoverBehaviorChanged']) => void;
    onhoverBehaviorDelayChanged?: (value: ojPictoChartEventMap<any, any>['hoverBehaviorDelayChanged']) => void;
    onlayoutChanged?: (value: ojPictoChartEventMap<any, any>['layoutChanged']) => void;
    onlayoutOriginChanged?: (value: ojPictoChartEventMap<any, any>['layoutOriginChanged']) => void;
    onrowCountChanged?: (value: ojPictoChartEventMap<any, any>['rowCountChanged']) => void;
    onrowHeightChanged?: (value: ojPictoChartEventMap<any, any>['rowHeightChanged']) => void;
    onselectionChanged?: (value: ojPictoChartEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojPictoChartEventMap<any, any>['selectionModeChanged']) => void;
    ontooltipChanged?: (value: ojPictoChartEventMap<any, any>['tooltipChanged']) => void;
    ontrackResizeChanged?: (value: ojPictoChartEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface PictoChartItemIntrinsicProps extends Partial<Readonly<ojPictoChartItemSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojPictoChartItemEventMap<any>['borderColorChanged']) => void;
    onborderWidthChanged?: (value: ojPictoChartItemEventMap<any>['borderWidthChanged']) => void;
    oncategoriesChanged?: (value: ojPictoChartItemEventMap<any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojPictoChartItemEventMap<any>['colorChanged']) => void;
    oncolumnSpanChanged?: (value: ojPictoChartItemEventMap<any>['columnSpanChanged']) => void;
    oncountChanged?: (value: ojPictoChartItemEventMap<any>['countChanged']) => void;
    ondrillingChanged?: (value: ojPictoChartItemEventMap<any>['drillingChanged']) => void;
    onnameChanged?: (value: ojPictoChartItemEventMap<any>['nameChanged']) => void;
    onrowSpanChanged?: (value: ojPictoChartItemEventMap<any>['rowSpanChanged']) => void;
    onshapeChanged?: (value: ojPictoChartItemEventMap<any>['shapeChanged']) => void;
    onshortDescChanged?: (value: ojPictoChartItemEventMap<any>['shortDescChanged']) => void;
    onsourceChanged?: (value: ojPictoChartItemEventMap<any>['sourceChanged']) => void;
    onsourceHoverChanged?: (value: ojPictoChartItemEventMap<any>['sourceHoverChanged']) => void;
    onsourceHoverSelectedChanged?: (value: ojPictoChartItemEventMap<any>['sourceHoverSelectedChanged']) => void;
    onsourceSelectedChanged?: (value: ojPictoChartItemEventMap<any>['sourceSelectedChanged']) => void;
    onsvgClassNameChanged?: (value: ojPictoChartItemEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojPictoChartItemEventMap<any>['svgStyleChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-picto-chart": PictoChartIntrinsicProps;
            "oj-picto-chart-item": PictoChartItemIntrinsicProps;
        }
    }
}
