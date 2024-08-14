import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTagCloud<K, D extends ojTagCloud.Item<K> | any> extends dvtBaseComponent<ojTagCloudSettableProperties<K, D>> {
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    as?: string;
    data: DataProvider<K, D> | null;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    layout?: 'cloud' | 'rectangular';
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    styleDefaults?: {
        animationDuration?: number;
        hoverBehaviorDelay?: number;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    tooltip?: {
        renderer: ((context: ojTagCloud.TooltipRendererContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    trackResize: 'on' | 'off';
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
    addEventListener<T extends keyof ojTagCloudEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTagCloudEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTagCloudSettableProperties<K, D>>(property: T): ojTagCloud<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTagCloudSettableProperties<K, D>>(property: T, value: ojTagCloudSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTagCloudSettableProperties<K, D>>): void;
    setProperties(properties: ojTagCloudSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojTagCloud.NodeContext | null;
}
export namespace ojTagCloud {
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["trackResize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        categories?: string[];
        color?: string;
        id?: K;
        label: string;
        shortDesc?: (string | ((context: ItemShortDescContext<K>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        url?: string;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext = {
        color: string;
        label: string;
        selected: boolean;
        tooltip: string;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemShortDescContext<K> = {
        id: K;
        label: string;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K> = {
        componentElement: Element;
        data: object;
        index: number;
        key: K;
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
        id: K;
        label: string;
        parentElement: Element;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K> = {
        color: string;
        componentElement: Element;
        id: K;
        label: string;
        parentElement: Element;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K>>;
}
export interface ojTagCloudEventMap<K, D extends ojTagCloud.Item<K> | any> extends dvtBaseComponentEventMap<ojTagCloudSettableProperties<K, D>> {
    'animationOnDataChangeChanged': JetElementCustomEvent<ojTagCloud<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojTagCloud<K, D>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojTagCloud<K, D>["as"]>;
    'dataChanged': JetElementCustomEvent<ojTagCloud<K, D>["data"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojTagCloud<K, D>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojTagCloud<K, D>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojTagCloud<K, D>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojTagCloud<K, D>["hoverBehavior"]>;
    'layoutChanged': JetElementCustomEvent<ojTagCloud<K, D>["layout"]>;
    'selectionChanged': JetElementCustomEvent<ojTagCloud<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojTagCloud<K, D>["selectionMode"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojTagCloud<K, D>["styleDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojTagCloud<K, D>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojTagCloud<K, D>["touchResponse"]>;
    'trackResizeChanged': JetElementCustomEvent<ojTagCloud<K, D>["trackResize"]>;
}
export interface ojTagCloudSettableProperties<K, D extends ojTagCloud.Item<K> | any> extends dvtBaseComponentSettableProperties {
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    as?: string;
    data: DataProvider<K, D> | null;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    layout?: 'cloud' | 'rectangular';
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    styleDefaults?: {
        animationDuration?: number;
        hoverBehaviorDelay?: number;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    tooltip?: {
        renderer: ((context: ojTagCloud.TooltipRendererContext<K>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse?: 'touchStart' | 'auto';
    trackResize: 'on' | 'off';
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
export interface ojTagCloudSettablePropertiesLenient<K, D extends ojTagCloud.Item<K> | any> extends Partial<ojTagCloudSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojTagCloudItem<K = any> extends dvtBaseComponent<ojTagCloudItemSettableProperties<K>> {
    categories?: string[];
    color?: string;
    label?: string;
    shortDesc?: (string | ((context: ojTagCloud.ItemShortDescContext<K>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    url?: string;
    value?: number | null;
    addEventListener<T extends keyof ojTagCloudItemEventMap<K>>(type: T, listener: (this: HTMLElement, ev: ojTagCloudItemEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTagCloudItemSettableProperties<K>>(property: T): ojTagCloudItem<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTagCloudItemSettableProperties<K>>(property: T, value: ojTagCloudItemSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTagCloudItemSettableProperties<K>>): void;
    setProperties(properties: ojTagCloudItemSettablePropertiesLenient<K>): void;
}
export namespace ojTagCloudItem {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type urlChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["url"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["value"]>;
}
export interface ojTagCloudItemEventMap<K = any> extends dvtBaseComponentEventMap<ojTagCloudItemSettableProperties<K>> {
    'categoriesChanged': JetElementCustomEvent<ojTagCloudItem<K>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojTagCloudItem<K>["color"]>;
    'labelChanged': JetElementCustomEvent<ojTagCloudItem<K>["label"]>;
    'shortDescChanged': JetElementCustomEvent<ojTagCloudItem<K>["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojTagCloudItem<K>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTagCloudItem<K>["svgStyle"]>;
    'urlChanged': JetElementCustomEvent<ojTagCloudItem<K>["url"]>;
    'valueChanged': JetElementCustomEvent<ojTagCloudItem<K>["value"]>;
}
export interface ojTagCloudItemSettableProperties<K = any> extends dvtBaseComponentSettableProperties {
    categories?: string[];
    color?: string;
    label?: string;
    shortDesc?: (string | ((context: ojTagCloud.ItemShortDescContext<K>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    url?: string;
    value?: number | null;
}
export interface ojTagCloudItemSettablePropertiesLenient<K = any> extends Partial<ojTagCloudItemSettableProperties<K>> {
    [key: string]: any;
}
export type TagCloudElement<K, D extends ojTagCloud.Item<K> | any> = ojTagCloud<K, D>;
export type TagCloudItemElement<K = any> = ojTagCloudItem<K>;
export namespace TagCloudElement {
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type layoutChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["layout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojTagCloud.Item<K> | any> = JetElementCustomEvent<ojTagCloud<K, D>["trackResize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Item<K> = {
        categories?: string[];
        color?: string;
        id?: K;
        label: string;
        shortDesc?: (string | ((context: ojTagCloud.ItemShortDescContext<K>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        url?: string;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext = {
        color: string;
        label: string;
        selected: boolean;
        tooltip: string;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemShortDescContext<K> = {
        id: K;
        label: string;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K> = {
        componentElement: Element;
        data: object;
        index: number;
        key: K;
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
        id: K;
        label: string;
        parentElement: Element;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K> = {
        color: string;
        componentElement: Element;
        id: K;
        label: string;
        parentElement: Element;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K>>;
}
export namespace TagCloudItemElement {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type urlChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["url"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any> = JetElementCustomEvent<ojTagCloudItem<K>["value"]>;
}
export interface TagCloudIntrinsicProps extends Partial<Readonly<ojTagCloudSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onanimationOnDataChangeChanged?: (value: ojTagCloudEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojTagCloudEventMap<any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojTagCloudEventMap<any, any>['asChanged']) => void;
    ondataChanged?: (value: ojTagCloudEventMap<any, any>['dataChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojTagCloudEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojTagCloudEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojTagCloudEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojTagCloudEventMap<any, any>['hoverBehaviorChanged']) => void;
    onlayoutChanged?: (value: ojTagCloudEventMap<any, any>['layoutChanged']) => void;
    onselectionChanged?: (value: ojTagCloudEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojTagCloudEventMap<any, any>['selectionModeChanged']) => void;
    onstyleDefaultsChanged?: (value: ojTagCloudEventMap<any, any>['styleDefaultsChanged']) => void;
    ontooltipChanged?: (value: ojTagCloudEventMap<any, any>['tooltipChanged']) => void;
    ontouchResponseChanged?: (value: ojTagCloudEventMap<any, any>['touchResponseChanged']) => void;
    ontrackResizeChanged?: (value: ojTagCloudEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface TagCloudItemIntrinsicProps extends Partial<Readonly<ojTagCloudItemSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: ojTagCloudItemEventMap<any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojTagCloudItemEventMap<any>['colorChanged']) => void;
    onlabelChanged?: (value: ojTagCloudItemEventMap<any>['labelChanged']) => void;
    onshortDescChanged?: (value: ojTagCloudItemEventMap<any>['shortDescChanged']) => void;
    onsvgClassNameChanged?: (value: ojTagCloudItemEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojTagCloudItemEventMap<any>['svgStyleChanged']) => void;
    onurlChanged?: (value: ojTagCloudItemEventMap<any>['urlChanged']) => void;
    onvalueChanged?: (value: ojTagCloudItemEventMap<any>['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-tag-cloud": TagCloudIntrinsicProps;
            "oj-tag-cloud-item": TagCloudItemIntrinsicProps;
        }
    }
}
