/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import 'geojson';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojThematicMap<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
   any> extends dvtBaseComponent<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>> {
    animationDuration: number;
    animationOnDisplay: 'auto' | 'none';
    areaData: DataProvider<K1, D1> | null;
    as: string;
    focusRenderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverRenderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    initialZooming: 'auto' | 'none';
    isolatedItem: K1;
    labelDisplay: 'on' | 'off' | 'auto';
    labelType: 'long' | 'short';
    linkData: DataProvider<K2, D2> | null;
    mapProvider: {
        geo: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
        propertiesKeys: {
            id: string;
            longLabel?: string;
            shortLabel?: string;
        };
    };
    markerData: DataProvider<K3, D3> | null;
    markerZoomBehavior: 'zoom' | 'fixed';
    maxZoom: number;
    panning: 'auto' | 'none';
    renderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    selection: Array<K1 | K2 | K3>;
    selectionMode: 'none' | 'single' | 'multiple';
    selectionRenderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults: {
        areaSvgStyle?: CSSStyleDeclaration;
        dataAreaDefaults?: {
            borderColor?: string;
            hoverColor?: string;
            selectedInnerColor?: string;
            selectedOuterColor?: string;
        };
        dataMarkerDefaults?: {
            borderColor?: string;
            borderStyle?: 'none' | 'solid';
            borderWidth?: number;
            color?: string;
            height?: number;
            labelStyle?: CSSStyleDeclaration;
            opacity?: number;
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            width?: number;
        };
        hoverBehaviorDelay?: number;
        labelStyle?: CSSStyleDeclaration;
        linkDefaults?: {
            color?: string;
            width?: number;
        };
    };
    tooltip: {
        renderer: ((context: ojThematicMap.TooltipContext<K1, K2, K3, D1, D2, D3>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    tooltipDisplay: 'auto' | 'labelAndShortDesc' | 'none' | 'shortDesc';
    touchResponse: 'touchStart' | 'auto';
    zooming: 'auto' | 'none';
    translations: {
        areasRegion?: string;
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        linksRegion?: string;
        markersRegion?: string;
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
    addEventListener<T extends keyof ojThematicMapEventMap<K1, K2, K3, D1, D2, D3>>(type: T, listener: (this: HTMLElement, ev: ojThematicMapEventMap<K1, K2, K3, D1, D2, D3>[T]) => any,
       useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>>(property: T): ojThematicMap<K1, K2, K3, D1, D2, D3>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>>(property: T, value: ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>>): void;
    setProperties(properties: ojThematicMapSettablePropertiesLenient<K1, K2, K3, D1, D2, D3>): void;
    getContextByNode(node: Element): ojThematicMap.NodeContext | null;
}
export namespace ojThematicMap {
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaDataChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["areaData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type focusRendererChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["focusRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverRendererChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["hoverRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type initialZoomingChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["initialZooming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type isolatedItemChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["isolatedItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelTypeChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["labelType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkDataChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["linkData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type mapProviderChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["mapProvider"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDataChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["markerData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerZoomBehaviorChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["markerZoomBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxZoomChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["maxZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panningChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["panning"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rendererChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["renderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRendererChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["selectionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipDisplayChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["tooltipDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomingChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> | any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2,
       D3>["zooming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Area<K> = {
        categories?: string[];
        color?: string;
        id?: K;
        label?: string;
        labelStyle?: CSSStyleDeclaration;
        location: string;
        opacity?: number;
        selectable?: 'auto' | 'off';
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type AreaTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataContext = {
        color: string;
        label: string;
        selected: boolean;
        tooltip: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Link<K1, K2> = {
        categories?: string[];
        color?: string;
        endLocation: {
            id?: K2;
            location?: string;
            x?: number;
            y?: number;
        };
        id?: K1;
        selectable?: 'auto' | 'off';
        shortDesc?: string;
        startLocation: {
            id?: K2;
            location?: string;
            x?: number;
            y?: number;
        };
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        width?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Marker<K> = {
        borderColor?: string;
        borderStyle?: 'solid' | 'none';
        borderWidth?: number;
        categories?: string[];
        color?: string;
        height?: number;
        id?: K;
        label?: string;
        labelPosition?: 'bottom' | 'center' | 'top';
        labelStyle?: CSSStyleDeclaration;
        location?: string;
        opacity?: number;
        rotation?: number;
        selectable?: 'auto' | 'off';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        shortDesc?: string;
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        value?: number;
        width?: number;
        x?: number;
        y?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type MarkerTemplateContext = {
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
    type RendererContext<K1, K2, K3, D1, D2, D3> = {
        color: string;
        componentElement: Element;
        data: Area<K1> | Link<K2, K1 | K3> | Marker<K3>;
        id: K1 | K2 | K3;
        itemData: D1 | D2 | D3 | null;
        label: string;
        location: string | null;
        parentElement: Element;
        previousState: {
            hovered: boolean;
            selected: boolean;
            focused: boolean;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        root: Element | null;
        state: {
            hovered: boolean;
            selected: boolean;
            focused: boolean;
        };
        x: number | null;
        y: number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K1, K2, K3, D1, D2, D3> = {
        color: string | null;
        componentElement: Element;
        data: Area<K1> | Link<K2, K1 | K3> | Marker<K3> | null;
        id: K1 | K2 | K3 | null;
        itemData: D1 | D2 | D3 | null;
        label: string | null;
        location: string | null;
        locationName: string | null;
        parentElement: Element;
        tooltip: string;
        x: number;
        y: number;
    };
}
export interface ojThematicMapEventMap<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
   any> extends dvtBaseComponentEventMap<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>> {
    'animationDurationChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["animationDuration"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["animationOnDisplay"]>;
    'areaDataChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["areaData"]>;
    'asChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["as"]>;
    'focusRendererChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["focusRenderer"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["hiddenCategories"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["hoverBehavior"]>;
    'hoverRendererChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["hoverRenderer"]>;
    'initialZoomingChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["initialZooming"]>;
    'isolatedItemChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["isolatedItem"]>;
    'labelDisplayChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["labelDisplay"]>;
    'labelTypeChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["labelType"]>;
    'linkDataChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["linkData"]>;
    'mapProviderChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["mapProvider"]>;
    'markerDataChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["markerData"]>;
    'markerZoomBehaviorChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["markerZoomBehavior"]>;
    'maxZoomChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["maxZoom"]>;
    'panningChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["panning"]>;
    'rendererChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["renderer"]>;
    'selectionChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["selectionMode"]>;
    'selectionRendererChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["selectionRenderer"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["styleDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["tooltip"]>;
    'tooltipDisplayChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["tooltipDisplay"]>;
    'touchResponseChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["touchResponse"]>;
    'zoomingChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["zooming"]>;
}
export interface ojThematicMapSettableProperties<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
   any> extends dvtBaseComponentSettableProperties {
    animationDuration: number;
    animationOnDisplay: 'auto' | 'none';
    areaData: DataProvider<K1, D1> | null;
    as: string;
    focusRenderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories: string[];
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    hoverRenderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    initialZooming: 'auto' | 'none';
    isolatedItem: K1;
    labelDisplay: 'on' | 'off' | 'auto';
    labelType: 'long' | 'short';
    linkData: DataProvider<K2, D2> | null;
    mapProvider: {
        geo: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
        propertiesKeys: {
            id: string;
            longLabel?: string;
            shortLabel?: string;
        };
    };
    markerData: DataProvider<K3, D3> | null;
    markerZoomBehavior: 'zoom' | 'fixed';
    maxZoom: number;
    panning: 'auto' | 'none';
    renderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    selection: Array<K1 | K2 | K3>;
    selectionMode: 'none' | 'single' | 'multiple';
    selectionRenderer: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults: {
        areaSvgStyle?: CSSStyleDeclaration;
        dataAreaDefaults?: {
            borderColor?: string;
            hoverColor?: string;
            selectedInnerColor?: string;
            selectedOuterColor?: string;
        };
        dataMarkerDefaults?: {
            borderColor?: string;
            borderStyle?: 'none' | 'solid';
            borderWidth?: number;
            color?: string;
            height?: number;
            labelStyle?: CSSStyleDeclaration;
            opacity?: number;
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            width?: number;
        };
        hoverBehaviorDelay?: number;
        labelStyle?: CSSStyleDeclaration;
        linkDefaults?: {
            color?: string;
            width?: number;
        };
    };
    tooltip: {
        renderer: ((context: ojThematicMap.TooltipContext<K1, K2, K3, D1, D2, D3>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    tooltipDisplay: 'auto' | 'labelAndShortDesc' | 'none' | 'shortDesc';
    touchResponse: 'touchStart' | 'auto';
    zooming: 'auto' | 'none';
    translations: {
        areasRegion?: string;
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        linksRegion?: string;
        markersRegion?: string;
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
export interface ojThematicMapSettablePropertiesLenient<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
   any> extends Partial<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>> {
    [key: string]: any;
}
export interface ojThematicMapArea extends JetElement<ojThematicMapAreaSettableProperties> {
    categories: string[];
    color: string;
    label: string;
    labelStyle: CSSStyleDeclaration;
    location: string;
    opacity: number;
    selectable: 'auto' | 'off';
    shortDesc: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    addEventListener<T extends keyof ojThematicMapAreaEventMap>(type: T, listener: (this: HTMLElement, ev: ojThematicMapAreaEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojThematicMapAreaSettableProperties>(property: T): ojThematicMapArea[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapAreaSettableProperties>(property: T, value: ojThematicMapAreaSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapAreaSettableProperties>): void;
    setProperties(properties: ojThematicMapAreaSettablePropertiesLenient): void;
}
export namespace ojThematicMapArea {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojThematicMapArea["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojThematicMapArea["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojThematicMapArea["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojThematicMapArea["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type locationChanged = JetElementCustomEvent<ojThematicMapArea["location"]>;
    // tslint:disable-next-line interface-over-type-literal
    type opacityChanged = JetElementCustomEvent<ojThematicMapArea["opacity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojThematicMapArea["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojThematicMapArea["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojThematicMapArea["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojThematicMapArea["svgStyle"]>;
}
export interface ojThematicMapAreaEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEvent<ojThematicMapArea["categories"]>;
    'colorChanged': JetElementCustomEvent<ojThematicMapArea["color"]>;
    'labelChanged': JetElementCustomEvent<ojThematicMapArea["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojThematicMapArea["labelStyle"]>;
    'locationChanged': JetElementCustomEvent<ojThematicMapArea["location"]>;
    'opacityChanged': JetElementCustomEvent<ojThematicMapArea["opacity"]>;
    'selectableChanged': JetElementCustomEvent<ojThematicMapArea["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojThematicMapArea["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojThematicMapArea["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojThematicMapArea["svgStyle"]>;
}
export interface ojThematicMapAreaSettableProperties extends JetSettableProperties {
    categories: string[];
    color: string;
    label: string;
    labelStyle: CSSStyleDeclaration;
    location: string;
    opacity: number;
    selectable: 'auto' | 'off';
    shortDesc: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
}
export interface ojThematicMapAreaSettablePropertiesLenient extends Partial<ojThematicMapAreaSettableProperties> {
    [key: string]: any;
}
export interface ojThematicMapLink extends JetElement<ojThematicMapLinkSettableProperties> {
    categories: string[];
    color: string;
    endLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    selectable: 'auto' | 'off';
    shortDesc: string;
    startLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    width: number;
    addEventListener<T extends keyof ojThematicMapLinkEventMap>(type: T, listener: (this: HTMLElement, ev: ojThematicMapLinkEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojThematicMapLinkSettableProperties>(property: T): ojThematicMapLink[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapLinkSettableProperties>(property: T, value: ojThematicMapLinkSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapLinkSettableProperties>): void;
    setProperties(properties: ojThematicMapLinkSettablePropertiesLenient): void;
}
export namespace ojThematicMapLink {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojThematicMapLink["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojThematicMapLink["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endLocationChanged = JetElementCustomEvent<ojThematicMapLink["endLocation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojThematicMapLink["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojThematicMapLink["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startLocationChanged = JetElementCustomEvent<ojThematicMapLink["startLocation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojThematicMapLink["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojThematicMapLink["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged = JetElementCustomEvent<ojThematicMapLink["width"]>;
}
export interface ojThematicMapLinkEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEvent<ojThematicMapLink["categories"]>;
    'colorChanged': JetElementCustomEvent<ojThematicMapLink["color"]>;
    'endLocationChanged': JetElementCustomEvent<ojThematicMapLink["endLocation"]>;
    'selectableChanged': JetElementCustomEvent<ojThematicMapLink["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojThematicMapLink["shortDesc"]>;
    'startLocationChanged': JetElementCustomEvent<ojThematicMapLink["startLocation"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojThematicMapLink["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojThematicMapLink["svgStyle"]>;
    'widthChanged': JetElementCustomEvent<ojThematicMapLink["width"]>;
}
export interface ojThematicMapLinkSettableProperties extends JetSettableProperties {
    categories: string[];
    color: string;
    endLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    selectable: 'auto' | 'off';
    shortDesc: string;
    startLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    width: number;
}
export interface ojThematicMapLinkSettablePropertiesLenient extends Partial<ojThematicMapLinkSettableProperties> {
    [key: string]: any;
}
export interface ojThematicMapMarker extends JetElement<ojThematicMapMarkerSettableProperties> {
    borderColor: string;
    borderStyle: 'solid' | 'none';
    borderWidth: number;
    categories: string[];
    color: string;
    height: number;
    label: string;
    labelPosition: 'bottom' | 'center' | 'top';
    labelStyle: CSSStyleDeclaration;
    location: string;
    opacity: number;
    rotation: number;
    selectable: 'auto' | 'off';
    shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    shortDesc: string;
    source: string;
    sourceHover: string;
    sourceHoverSelected: string;
    sourceSelected: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    value: number;
    width: number;
    x: number | null;
    y: number | null;
    addEventListener<T extends keyof ojThematicMapMarkerEventMap>(type: T, listener: (this: HTMLElement, ev: ojThematicMapMarkerEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojThematicMapMarkerSettableProperties>(property: T): ojThematicMapMarker[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapMarkerSettableProperties>(property: T, value: ojThematicMapMarkerSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapMarkerSettableProperties>): void;
    setProperties(properties: ojThematicMapMarkerSettablePropertiesLenient): void;
}
export namespace ojThematicMapMarker {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojThematicMapMarker["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderStyleChanged = JetElementCustomEvent<ojThematicMapMarker["borderStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged = JetElementCustomEvent<ojThematicMapMarker["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojThematicMapMarker["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojThematicMapMarker["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type heightChanged = JetElementCustomEvent<ojThematicMapMarker["height"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojThematicMapMarker["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged = JetElementCustomEvent<ojThematicMapMarker["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojThematicMapMarker["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type locationChanged = JetElementCustomEvent<ojThematicMapMarker["location"]>;
    // tslint:disable-next-line interface-over-type-literal
    type opacityChanged = JetElementCustomEvent<ojThematicMapMarker["opacity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged = JetElementCustomEvent<ojThematicMapMarker["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged = JetElementCustomEvent<ojThematicMapMarker["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shapeChanged = JetElementCustomEvent<ojThematicMapMarker["shape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojThematicMapMarker["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged = JetElementCustomEvent<ojThematicMapMarker["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged = JetElementCustomEvent<ojThematicMapMarker["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged = JetElementCustomEvent<ojThematicMapMarker["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged = JetElementCustomEvent<ojThematicMapMarker["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojThematicMapMarker["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojThematicMapMarker["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojThematicMapMarker["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged = JetElementCustomEvent<ojThematicMapMarker["width"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xChanged = JetElementCustomEvent<ojThematicMapMarker["x"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yChanged = JetElementCustomEvent<ojThematicMapMarker["y"]>;
}
export interface ojThematicMapMarkerEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojThematicMapMarker["borderColor"]>;
    'borderStyleChanged': JetElementCustomEvent<ojThematicMapMarker["borderStyle"]>;
    'borderWidthChanged': JetElementCustomEvent<ojThematicMapMarker["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojThematicMapMarker["categories"]>;
    'colorChanged': JetElementCustomEvent<ojThematicMapMarker["color"]>;
    'heightChanged': JetElementCustomEvent<ojThematicMapMarker["height"]>;
    'labelChanged': JetElementCustomEvent<ojThematicMapMarker["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojThematicMapMarker["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojThematicMapMarker["labelStyle"]>;
    'locationChanged': JetElementCustomEvent<ojThematicMapMarker["location"]>;
    'opacityChanged': JetElementCustomEvent<ojThematicMapMarker["opacity"]>;
    'rotationChanged': JetElementCustomEvent<ojThematicMapMarker["rotation"]>;
    'selectableChanged': JetElementCustomEvent<ojThematicMapMarker["selectable"]>;
    'shapeChanged': JetElementCustomEvent<ojThematicMapMarker["shape"]>;
    'shortDescChanged': JetElementCustomEvent<ojThematicMapMarker["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojThematicMapMarker["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojThematicMapMarker["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojThematicMapMarker["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojThematicMapMarker["sourceSelected"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojThematicMapMarker["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojThematicMapMarker["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojThematicMapMarker["value"]>;
    'widthChanged': JetElementCustomEvent<ojThematicMapMarker["width"]>;
    'xChanged': JetElementCustomEvent<ojThematicMapMarker["x"]>;
    'yChanged': JetElementCustomEvent<ojThematicMapMarker["y"]>;
}
export interface ojThematicMapMarkerSettableProperties extends JetSettableProperties {
    borderColor: string;
    borderStyle: 'solid' | 'none';
    borderWidth: number;
    categories: string[];
    color: string;
    height: number;
    label: string;
    labelPosition: 'bottom' | 'center' | 'top';
    labelStyle: CSSStyleDeclaration;
    location: string;
    opacity: number;
    rotation: number;
    selectable: 'auto' | 'off';
    shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    shortDesc: string;
    source: string;
    sourceHover: string;
    sourceHoverSelected: string;
    sourceSelected: string;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    value: number;
    width: number;
    x: number | null;
    y: number | null;
}
export interface ojThematicMapMarkerSettablePropertiesLenient extends Partial<ojThematicMapMarkerSettableProperties> {
    [key: string]: any;
}
