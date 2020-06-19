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
export interface ojTagCloud<K, D extends ojTagCloud.Item<K> | any> extends dvtBaseComponent<ojTagCloudSettableProperties<K, D>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    data: DataProvider<K, D> | null;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    layout: 'cloud' | 'rectangular';
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    styleDefaults: {
        animationDuration?: number;
        hoverBehaviorDelay?: number;
        svgStyle?: CSSStyleDeclaration;
    };
    tooltip: {
        renderer: ((context: ojTagCloud.TooltipContext<K>) => ({
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
    addEventListener<T extends keyof ojTagCloudEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTagCloudEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    type Item<K> = {
        categories?: string[];
        color?: string;
        id?: K;
        label: string;
        shortDesc?: string;
        svgStyle?: CSSStyleDeclaration;
        svgClassName?: string;
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
    type ItemTemplateContext<K> = {
        componentElement: Element;
        data: object;
        index: number;
        key: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type NodeContext = {
        subId: string;
        index: number;
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
}
export interface ojTagCloudSettableProperties<K, D extends ojTagCloud.Item<K> | any> extends dvtBaseComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    as: string;
    data: DataProvider<K, D> | null;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    layout: 'cloud' | 'rectangular';
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    styleDefaults: {
        animationDuration?: number;
        hoverBehaviorDelay?: number;
        svgStyle?: CSSStyleDeclaration;
    };
    tooltip: {
        renderer: ((context: ojTagCloud.TooltipContext<K>) => ({
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
export interface ojTagCloudItem extends JetElement<ojTagCloudItemSettableProperties> {
    categories: string[];
    color?: string;
    label: string;
    shortDesc: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    url: string;
    value: number | null;
    addEventListener<T extends keyof ojTagCloudItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojTagCloudItemEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTagCloudItemSettableProperties>(property: T): ojTagCloudItem[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTagCloudItemSettableProperties>(property: T, value: ojTagCloudItemSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTagCloudItemSettableProperties>): void;
    setProperties(properties: ojTagCloudItemSettablePropertiesLenient): void;
}
export namespace ojTagCloudItem {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojTagCloudItem["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojTagCloudItem["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojTagCloudItem["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojTagCloudItem["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojTagCloudItem["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojTagCloudItem["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type urlChanged = JetElementCustomEvent<ojTagCloudItem["url"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojTagCloudItem["value"]>;
}
export interface ojTagCloudItemEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEvent<ojTagCloudItem["categories"]>;
    'colorChanged': JetElementCustomEvent<ojTagCloudItem["color"]>;
    'labelChanged': JetElementCustomEvent<ojTagCloudItem["label"]>;
    'shortDescChanged': JetElementCustomEvent<ojTagCloudItem["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojTagCloudItem["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTagCloudItem["svgStyle"]>;
    'urlChanged': JetElementCustomEvent<ojTagCloudItem["url"]>;
    'valueChanged': JetElementCustomEvent<ojTagCloudItem["value"]>;
}
export interface ojTagCloudItemSettableProperties extends JetSettableProperties {
    categories: string[];
    color?: string;
    label: string;
    shortDesc: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    url: string;
    value: number | null;
}
export interface ojTagCloudItemSettablePropertiesLenient extends Partial<ojTagCloudItemSettableProperties> {
    [key: string]: any;
}
