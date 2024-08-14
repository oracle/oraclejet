import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import 'geojson';
import { DataProvider } from '../ojdataprovider';
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojThematicMap<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
   any> extends dvtBaseComponent<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>> {
    animationDuration?: number;
    animationOnDisplay?: 'auto' | 'none';
    areaData?: DataProvider<K1, D1> | null;
    as?: string;
    focusRenderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverRenderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    initialZooming?: 'auto' | 'none';
    isolatedItem?: K1;
    labelDisplay?: 'on' | 'off' | 'auto';
    labelType?: 'long' | 'short';
    linkData?: DataProvider<K2, D2> | null;
    mapProvider: {
        geo: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
        propertiesKeys: {
            id: string;
            longLabel?: string;
            shortLabel?: string;
        };
    };
    markerData?: DataProvider<K3, D3> | null;
    markerZoomBehavior?: 'zoom' | 'fixed';
    maxZoom?: number;
    panning?: 'auto' | 'none';
    renderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    selection?: Array<K1 | K2 | K3>;
    selectionMode?: 'none' | 'single' | 'multiple';
    selectionRenderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults?: {
        areaSvgStyle?: Partial<CSSStyleDeclaration>;
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
            labelStyle?: Partial<CSSStyleDeclaration>;
            opacity?: number;
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            width?: number;
        };
        hoverBehaviorDelay?: number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        linkDefaults?: {
            color?: string;
            width?: number;
        };
    };
    tooltip?: {
        renderer: ((context: ojThematicMap.TooltipContext<K1, K2, K3, D1, D2, D3>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    tooltipDisplay?: 'auto' | 'labelAndShortDesc' | 'none' | 'shortDesc';
    touchResponse?: 'touchStart' | 'auto';
    zooming?: 'auto' | 'none';
    translations: {
        accessibleContainsControls?: string;
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
       options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, K3, D1 extends Area<K1> | any, D2 extends Link<K2, K1 | K3> | any, D3 extends Marker<K3> |
       any> = dvtBaseComponent.trackResizeChanged<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type Area<K, D = any> = {
        categories?: string[];
        color?: string;
        id?: K;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        location: string;
        opacity?: number;
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: AreaShortDescContext<K, D>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type AreaShortDescContext<K1, D1> = {
        data: Area<K1, D1>;
        id: K1;
        itemData: D1 | null;
        label: string;
        location: string | null;
        locationName: string | null;
        x: number;
        y: number;
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
    type Link<K1, K2, D1 = any> = {
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
        shortDesc?: (string | ((context: LinkShortDescContext<K1, K2, D1>) => string));
        startLocation: {
            id?: K2;
            location?: string;
            x?: number;
            y?: number;
        };
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkShortDescContext<K1, K2, D1> = {
        data: Link<K1, K2, D1>;
        id: K1;
        itemData: D1 | null;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Marker<K3, D3 = any> = {
        borderColor?: string;
        borderStyle?: 'solid' | 'none';
        borderWidth?: number;
        categories?: string[];
        color?: string;
        height?: number;
        id?: K3;
        label?: string;
        labelPosition?: 'bottom' | 'center' | 'top';
        labelStyle?: Partial<CSSStyleDeclaration>;
        location?: string;
        opacity?: number;
        rotation?: number;
        selectable?: 'auto' | 'off';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        shortDesc?: (string | ((context: MarkerShortDescContext<K3, D3>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value?: number;
        width?: number;
        x?: number;
        y?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type MarkerShortDescContext<K3, D3> = {
        data: Marker<K3>;
        id: K3;
        itemData: D3 | null;
        label: string;
        location: string | null;
        locationName: string | null;
        x: number;
        y: number;
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
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RendererContext<K1, K2, K3, D1, D2, D3> = {
        color: string;
        componentElement: Element;
        data: Area<K1, D1> | Link<K2, K1 | K3, D2> | Marker<K3, D3>;
        id: K1 | K2 | K3;
        itemData: D1 | D2 | D3 | null;
        label: string;
        location: string | null;
        parentElement: Element;
        previousState: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        root: Element | null;
        state: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
        x: number | null;
        y: number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K1, K2, K3, D1, D2, D3> = {
        color: string | null;
        componentElement: Element;
        data: Area<K1, D1> | Link<K2, K1 | K3, D2> | Marker<K3, D3> | null;
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
    // tslint:disable-next-line interface-over-type-literal
    type RenderAreaTemplate = import('ojs/ojvcomponent').TemplateSlot<AreaTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderLinkTemplate = import('ojs/ojvcomponent').TemplateSlot<LinkTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderMarkerContentTemplate<K1, K2, K3, D1, D2, D3> = import('ojs/ojvcomponent').TemplateSlot<RendererContext<K1, K2, K3, D1, D2, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderMarkerTemplate = import('ojs/ojvcomponent').TemplateSlot<MarkerTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K1, K2, K3, D1, D2, D3> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K1, K2, K3, D1, D2, D3>>;
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
    'trackResizeChanged': JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["trackResize"]>;
}
export interface ojThematicMapSettableProperties<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
   any> extends dvtBaseComponentSettableProperties {
    animationDuration?: number;
    animationOnDisplay?: 'auto' | 'none';
    areaData?: DataProvider<K1, D1> | null;
    as?: string;
    focusRenderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    hiddenCategories?: string[];
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    hoverRenderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    initialZooming?: 'auto' | 'none';
    isolatedItem?: K1;
    labelDisplay?: 'on' | 'off' | 'auto';
    labelType?: 'long' | 'short';
    linkData?: DataProvider<K2, D2> | null;
    mapProvider: {
        geo: GeoJSON.Feature<GeoJSON.Polygon | GeoJSON.MultiPolygon> | GeoJSON.FeatureCollection<GeoJSON.Polygon | GeoJSON.MultiPolygon>;
        propertiesKeys: {
            id: string;
            longLabel?: string;
            shortLabel?: string;
        };
    };
    markerData?: DataProvider<K3, D3> | null;
    markerZoomBehavior?: 'zoom' | 'fixed';
    maxZoom?: number;
    panning?: 'auto' | 'none';
    renderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    selection?: Array<K1 | K2 | K3>;
    selectionMode?: 'none' | 'single' | 'multiple';
    selectionRenderer?: ((context: ojThematicMap.RendererContext<K1, K2, K3, D1, D2, D3>) => {
        insert: SVGElement;
    } | void) | null;
    styleDefaults?: {
        areaSvgStyle?: Partial<CSSStyleDeclaration>;
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
            labelStyle?: Partial<CSSStyleDeclaration>;
            opacity?: number;
            shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
            width?: number;
        };
        hoverBehaviorDelay?: number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        linkDefaults?: {
            color?: string;
            width?: number;
        };
    };
    tooltip?: {
        renderer: ((context: ojThematicMap.TooltipContext<K1, K2, K3, D1, D2, D3>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    tooltipDisplay?: 'auto' | 'labelAndShortDesc' | 'none' | 'shortDesc';
    touchResponse?: 'touchStart' | 'auto';
    zooming?: 'auto' | 'none';
    translations: {
        accessibleContainsControls?: string;
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
export interface ojThematicMapArea<K1 = any, D1 = any> extends dvtBaseComponent<ojThematicMapAreaSettableProperties<K1, D1>> {
    categories?: string[];
    color?: string;
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration>;
    location: string;
    opacity?: number;
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojThematicMap.AreaShortDescContext<K1, D1>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    addEventListener<T extends keyof ojThematicMapAreaEventMap<K1, D1>>(type: T, listener: (this: HTMLElement, ev: ojThematicMapAreaEventMap<K1, D1>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojThematicMapAreaSettableProperties<K1, D1>>(property: T): ojThematicMapArea<K1, D1>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapAreaSettableProperties<K1, D1>>(property: T, value: ojThematicMapAreaSettableProperties<K1, D1>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapAreaSettableProperties<K1, D1>>): void;
    setProperties(properties: ojThematicMapAreaSettablePropertiesLenient<K1, D1>): void;
}
export namespace ojThematicMapArea {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type locationChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["location"]>;
    // tslint:disable-next-line interface-over-type-literal
    type opacityChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["opacity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["svgStyle"]>;
}
export interface ojThematicMapAreaEventMap<K1 = any, D1 = any> extends dvtBaseComponentEventMap<ojThematicMapAreaSettableProperties<K1, D1>> {
    'categoriesChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["color"]>;
    'labelChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["label"]>;
    'labelStyleChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["labelStyle"]>;
    'locationChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["location"]>;
    'opacityChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["opacity"]>;
    'selectableChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["shortDesc"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojThematicMapArea<K1, D1>["svgStyle"]>;
}
export interface ojThematicMapAreaSettableProperties<K1 = any, D1 = any> extends dvtBaseComponentSettableProperties {
    categories?: string[];
    color?: string;
    label?: string;
    labelStyle?: Partial<CSSStyleDeclaration>;
    location: string;
    opacity?: number;
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojThematicMap.AreaShortDescContext<K1, D1>) => string));
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
}
export interface ojThematicMapAreaSettablePropertiesLenient<K1 = any, D1 = any> extends Partial<ojThematicMapAreaSettableProperties<K1, D1>> {
    [key: string]: any;
}
export interface ojThematicMapLink<K1 = any, K2 = any, D1 = any> extends dvtBaseComponent<ojThematicMapLinkSettableProperties<K1, K2, D1>> {
    categories?: string[];
    color?: string;
    endLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojThematicMap.LinkShortDescContext<K1, K2, D1>) => string));
    startLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    width?: number;
    addEventListener<T extends keyof ojThematicMapLinkEventMap<K1, K2, D1>>(type: T, listener: (this: HTMLElement, ev: ojThematicMapLinkEventMap<K1, K2, D1>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojThematicMapLinkSettableProperties<K1, K2, D1>>(property: T): ojThematicMapLink<K1, K2, D1>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapLinkSettableProperties<K1, K2, D1>>(property: T, value: ojThematicMapLinkSettableProperties<K1, K2, D1>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapLinkSettableProperties<K1, K2, D1>>): void;
    setProperties(properties: ojThematicMapLinkSettablePropertiesLenient<K1, K2, D1>): void;
}
export namespace ojThematicMapLink {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endLocationChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["endLocation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startLocationChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["startLocation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["width"]>;
}
export interface ojThematicMapLinkEventMap<K1 = any, K2 = any, D1 = any> extends dvtBaseComponentEventMap<ojThematicMapLinkSettableProperties<K1, K2, D1>> {
    'categoriesChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["color"]>;
    'endLocationChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["endLocation"]>;
    'selectableChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["selectable"]>;
    'shortDescChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["shortDesc"]>;
    'startLocationChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["startLocation"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["svgStyle"]>;
    'widthChanged': JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["width"]>;
}
export interface ojThematicMapLinkSettableProperties<K1 = any, K2 = any, D1 = any> extends dvtBaseComponentSettableProperties {
    categories?: string[];
    color?: string;
    endLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    selectable?: 'auto' | 'off';
    shortDesc?: (string | ((context: ojThematicMap.LinkShortDescContext<K1, K2, D1>) => string));
    startLocation: {
        id?: any;
        location?: string;
        x?: number;
        y?: number;
    };
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    width?: number;
}
export interface ojThematicMapLinkSettablePropertiesLenient<K1 = any, K2 = any, D1 = any> extends Partial<ojThematicMapLinkSettableProperties<K1, K2, D1>> {
    [key: string]: any;
}
export interface ojThematicMapMarker<K3 = any, D3 = any> extends dvtBaseComponent<ojThematicMapMarkerSettableProperties<K3, D3>> {
    borderColor?: string;
    borderStyle?: 'solid' | 'none';
    borderWidth?: number;
    categories?: string[];
    color?: string;
    height?: number;
    label?: string;
    labelPosition?: 'bottom' | 'center' | 'top';
    labelStyle?: Partial<CSSStyleDeclaration>;
    location?: string;
    opacity?: number;
    rotation?: number;
    selectable?: 'auto' | 'off';
    shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    shortDesc?: (string | ((context: ojThematicMap.MarkerShortDescContext<K3, D3>) => string));
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value?: number;
    width?: number;
    x?: number | null;
    y?: number | null;
    addEventListener<T extends keyof ojThematicMapMarkerEventMap<K3, D3>>(type: T, listener: (this: HTMLElement, ev: ojThematicMapMarkerEventMap<K3, D3>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojThematicMapMarkerSettableProperties<K3, D3>>(property: T): ojThematicMapMarker<K3, D3>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojThematicMapMarkerSettableProperties<K3, D3>>(property: T, value: ojThematicMapMarkerSettableProperties<K3, D3>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojThematicMapMarkerSettableProperties<K3, D3>>): void;
    setProperties(properties: ojThematicMapMarkerSettablePropertiesLenient<K3, D3>): void;
}
export namespace ojThematicMapMarker {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type heightChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["height"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type locationChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["location"]>;
    // tslint:disable-next-line interface-over-type-literal
    type opacityChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["opacity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shapeChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["shape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["width"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["x"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["y"]>;
}
export interface ojThematicMapMarkerEventMap<K3 = any, D3 = any> extends dvtBaseComponentEventMap<ojThematicMapMarkerSettableProperties<K3, D3>> {
    'borderColorChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderColor"]>;
    'borderStyleChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderStyle"]>;
    'borderWidthChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderWidth"]>;
    'categoriesChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["categories"]>;
    'colorChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["color"]>;
    'heightChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["height"]>;
    'labelChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["labelStyle"]>;
    'locationChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["location"]>;
    'opacityChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["opacity"]>;
    'rotationChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["rotation"]>;
    'selectableChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["selectable"]>;
    'shapeChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["shape"]>;
    'shortDescChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceSelected"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["value"]>;
    'widthChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["width"]>;
    'xChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["x"]>;
    'yChanged': JetElementCustomEvent<ojThematicMapMarker<K3, D3>["y"]>;
}
export interface ojThematicMapMarkerSettableProperties<K3 = any, D3 = any> extends dvtBaseComponentSettableProperties {
    borderColor?: string;
    borderStyle?: 'solid' | 'none';
    borderWidth?: number;
    categories?: string[];
    color?: string;
    height?: number;
    label?: string;
    labelPosition?: 'bottom' | 'center' | 'top';
    labelStyle?: Partial<CSSStyleDeclaration>;
    location?: string;
    opacity?: number;
    rotation?: number;
    selectable?: 'auto' | 'off';
    shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    shortDesc?: (string | ((context: ojThematicMap.MarkerShortDescContext<K3, D3>) => string));
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value?: number;
    width?: number;
    x?: number | null;
    y?: number | null;
}
export interface ojThematicMapMarkerSettablePropertiesLenient<K3 = any, D3 = any> extends Partial<ojThematicMapMarkerSettableProperties<K3, D3>> {
    [key: string]: any;
}
export type ThematicMapElement<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> | any> = ojThematicMap<K1, K2,
   K3, D1, D2, D3>;
export type ThematicMapAreaElement<K1 = any, D1 = any> = ojThematicMapArea<K1, D1>;
export type ThematicMapLinkElement<K1 = any, K2 = any, D1 = any> = ojThematicMapLink<K1>;
export type ThematicMapMarkerElement<K3 = any, D3 = any> = ojThematicMapMarker<K3>;
export namespace ThematicMapElement {
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaDataChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["areaData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type focusRendererChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["focusRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverRendererChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["hoverRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type initialZoomingChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["initialZooming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type isolatedItemChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["isolatedItem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelDisplayChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["labelDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelTypeChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["labelType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type linkDataChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["linkData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type mapProviderChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["mapProvider"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDataChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["markerData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerZoomBehaviorChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["markerZoomBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxZoomChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["maxZoom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type panningChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["panning"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rendererChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["renderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionRendererChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["selectionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipDisplayChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["tooltipDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomingChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = JetElementCustomEvent<ojThematicMap<K1, K2, K3, D1, D2, D3>["zooming"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K1, K2, K3, D1 extends ojThematicMap.Area<K1> | any, D2 extends ojThematicMap.Link<K2, K1 | K3> | any, D3 extends ojThematicMap.Marker<K3> |
       any> = dvtBaseComponent.trackResizeChanged<ojThematicMapSettableProperties<K1, K2, K3, D1, D2, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type Area<K, D = any> = {
        categories?: string[];
        color?: string;
        id?: K;
        label?: string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        location: string;
        opacity?: number;
        selectable?: 'auto' | 'off';
        shortDesc?: (string | ((context: ojThematicMap.AreaShortDescContext<K, D>) => string));
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type AreaShortDescContext<K1, D1> = {
        data: ojThematicMap.Area<K1, D1>;
        id: K1;
        itemData: D1 | null;
        label: string;
        location: string | null;
        locationName: string | null;
        x: number;
        y: number;
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
    type Link<K1, K2, D1 = any> = {
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
        shortDesc?: (string | ((context: ojThematicMap.LinkShortDescContext<K1, K2, D1>) => string));
        startLocation: {
            id?: K2;
            location?: string;
            x?: number;
            y?: number;
        };
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        width?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkShortDescContext<K1, K2, D1> = {
        data: ojThematicMap.Link<K1, K2, D1>;
        id: K1;
        itemData: D1 | null;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LinkTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Marker<K3, D3 = any> = {
        borderColor?: string;
        borderStyle?: 'solid' | 'none';
        borderWidth?: number;
        categories?: string[];
        color?: string;
        height?: number;
        id?: K3;
        label?: string;
        labelPosition?: 'bottom' | 'center' | 'top';
        labelStyle?: Partial<CSSStyleDeclaration>;
        location?: string;
        opacity?: number;
        rotation?: number;
        selectable?: 'auto' | 'off';
        shape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        shortDesc?: (string | ((context: ojThematicMap.MarkerShortDescContext<K3, D3>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value?: number;
        width?: number;
        x?: number;
        y?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type MarkerShortDescContext<K3, D3> = {
        data: ojThematicMap.Marker<K3>;
        id: K3;
        itemData: D3 | null;
        label: string;
        location: string | null;
        locationName: string | null;
        x: number;
        y: number;
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
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RendererContext<K1, K2, K3, D1, D2, D3> = {
        color: string;
        componentElement: Element;
        data: ojThematicMap.Area<K1, D1> | ojThematicMap.Link<K2, K1 | K3, D2> | ojThematicMap.Marker<K3, D3>;
        id: K1 | K2 | K3;
        itemData: D1 | D2 | D3 | null;
        label: string;
        location: string | null;
        parentElement: Element;
        previousState: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
        renderDefaultFocus: (() => void);
        renderDefaultHover: (() => void);
        renderDefaultSelection: (() => void);
        root: Element | null;
        state: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
        x: number | null;
        y: number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K1, K2, K3, D1, D2, D3> = {
        color: string | null;
        componentElement: Element;
        data: ojThematicMap.Area<K1, D1> | ojThematicMap.Link<K2, K1 | K3, D2> | ojThematicMap.Marker<K3, D3> | null;
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
    // tslint:disable-next-line interface-over-type-literal
    type RenderAreaTemplate = import('ojs/ojvcomponent').TemplateSlot<AreaTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderLinkTemplate = import('ojs/ojvcomponent').TemplateSlot<LinkTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderMarkerContentTemplate<K1, K2, K3, D1, D2, D3> = import('ojs/ojvcomponent').TemplateSlot<RendererContext<K1, K2, K3, D1, D2, D3>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderMarkerTemplate = import('ojs/ojvcomponent').TemplateSlot<MarkerTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K1, K2, K3, D1, D2, D3> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K1, K2, K3, D1, D2, D3>>;
}
export namespace ThematicMapAreaElement {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type locationChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["location"]>;
    // tslint:disable-next-line interface-over-type-literal
    type opacityChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["opacity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K1 = any, D1 = any> = JetElementCustomEvent<ojThematicMapArea<K1, D1>["svgStyle"]>;
}
export namespace ThematicMapLinkElement {
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endLocationChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["endLocation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startLocationChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["startLocation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged<K1 = any, K2 = any, D1 = any> = JetElementCustomEvent<ojThematicMapLink<K1, K2, D1>["width"]>;
}
export namespace ThematicMapMarkerElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type heightChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["height"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type locationChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["location"]>;
    // tslint:disable-next-line interface-over-type-literal
    type opacityChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["opacity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectableChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["selectable"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shapeChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["shape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type widthChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["width"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["x"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yChanged<K3 = any, D3 = any> = JetElementCustomEvent<ojThematicMapMarker<K3, D3>["y"]>;
}
export interface ThematicMapIntrinsicProps extends Partial<Readonly<ojThematicMapSettableProperties<any, any, any, any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onanimationDurationChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['animationDurationChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['animationOnDisplayChanged']) => void;
    onareaDataChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['areaDataChanged']) => void;
    onasChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['asChanged']) => void;
    onfocusRendererChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['focusRendererChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['hoverBehaviorChanged']) => void;
    onhoverRendererChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['hoverRendererChanged']) => void;
    oninitialZoomingChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['initialZoomingChanged']) => void;
    onisolatedItemChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['isolatedItemChanged']) => void;
    onlabelDisplayChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['labelDisplayChanged']) => void;
    onlabelTypeChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['labelTypeChanged']) => void;
    onlinkDataChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['linkDataChanged']) => void;
    onmapProviderChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['mapProviderChanged']) => void;
    onmarkerDataChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['markerDataChanged']) => void;
    onmarkerZoomBehaviorChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['markerZoomBehaviorChanged']) => void;
    onmaxZoomChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['maxZoomChanged']) => void;
    onpanningChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['panningChanged']) => void;
    onrendererChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['rendererChanged']) => void;
    onselectionChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['selectionModeChanged']) => void;
    onselectionRendererChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['selectionRendererChanged']) => void;
    onstyleDefaultsChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['styleDefaultsChanged']) => void;
    ontooltipChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['tooltipChanged']) => void;
    ontooltipDisplayChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['tooltipDisplayChanged']) => void;
    ontouchResponseChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['touchResponseChanged']) => void;
    onzoomingChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['zoomingChanged']) => void;
    ontrackResizeChanged?: (value: ojThematicMapEventMap<any, any, any, any, any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface ThematicMapAreaIntrinsicProps extends Partial<Readonly<ojThematicMapAreaSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: ojThematicMapAreaEventMap<any, any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojThematicMapAreaEventMap<any, any>['colorChanged']) => void;
    onlabelChanged?: (value: ojThematicMapAreaEventMap<any, any>['labelChanged']) => void;
    onlabelStyleChanged?: (value: ojThematicMapAreaEventMap<any, any>['labelStyleChanged']) => void;
    onlocationChanged?: (value: ojThematicMapAreaEventMap<any, any>['locationChanged']) => void;
    onopacityChanged?: (value: ojThematicMapAreaEventMap<any, any>['opacityChanged']) => void;
    onselectableChanged?: (value: ojThematicMapAreaEventMap<any, any>['selectableChanged']) => void;
    onshortDescChanged?: (value: ojThematicMapAreaEventMap<any, any>['shortDescChanged']) => void;
    onsvgClassNameChanged?: (value: ojThematicMapAreaEventMap<any, any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojThematicMapAreaEventMap<any, any>['svgStyleChanged']) => void;
    children?: ComponentChildren;
}
export interface ThematicMapLinkIntrinsicProps extends Partial<Readonly<ojThematicMapLinkSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: ojThematicMapLinkEventMap<any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojThematicMapLinkEventMap<any>['colorChanged']) => void;
    onendLocationChanged?: (value: ojThematicMapLinkEventMap<any>['endLocationChanged']) => void;
    onselectableChanged?: (value: ojThematicMapLinkEventMap<any>['selectableChanged']) => void;
    onshortDescChanged?: (value: ojThematicMapLinkEventMap<any>['shortDescChanged']) => void;
    onstartLocationChanged?: (value: ojThematicMapLinkEventMap<any>['startLocationChanged']) => void;
    onsvgClassNameChanged?: (value: ojThematicMapLinkEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojThematicMapLinkEventMap<any>['svgStyleChanged']) => void;
    onwidthChanged?: (value: ojThematicMapLinkEventMap<any>['widthChanged']) => void;
    children?: ComponentChildren;
}
export interface ThematicMapMarkerIntrinsicProps extends Partial<Readonly<ojThematicMapMarkerSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojThematicMapMarkerEventMap<any>['borderColorChanged']) => void;
    onborderStyleChanged?: (value: ojThematicMapMarkerEventMap<any>['borderStyleChanged']) => void;
    onborderWidthChanged?: (value: ojThematicMapMarkerEventMap<any>['borderWidthChanged']) => void;
    oncategoriesChanged?: (value: ojThematicMapMarkerEventMap<any>['categoriesChanged']) => void;
    oncolorChanged?: (value: ojThematicMapMarkerEventMap<any>['colorChanged']) => void;
    onheightChanged?: (value: ojThematicMapMarkerEventMap<any>['heightChanged']) => void;
    onlabelChanged?: (value: ojThematicMapMarkerEventMap<any>['labelChanged']) => void;
    onlabelPositionChanged?: (value: ojThematicMapMarkerEventMap<any>['labelPositionChanged']) => void;
    onlabelStyleChanged?: (value: ojThematicMapMarkerEventMap<any>['labelStyleChanged']) => void;
    onlocationChanged?: (value: ojThematicMapMarkerEventMap<any>['locationChanged']) => void;
    onopacityChanged?: (value: ojThematicMapMarkerEventMap<any>['opacityChanged']) => void;
    onrotationChanged?: (value: ojThematicMapMarkerEventMap<any>['rotationChanged']) => void;
    onselectableChanged?: (value: ojThematicMapMarkerEventMap<any>['selectableChanged']) => void;
    onshapeChanged?: (value: ojThematicMapMarkerEventMap<any>['shapeChanged']) => void;
    onshortDescChanged?: (value: ojThematicMapMarkerEventMap<any>['shortDescChanged']) => void;
    onsourceChanged?: (value: ojThematicMapMarkerEventMap<any>['sourceChanged']) => void;
    onsourceHoverChanged?: (value: ojThematicMapMarkerEventMap<any>['sourceHoverChanged']) => void;
    onsourceHoverSelectedChanged?: (value: ojThematicMapMarkerEventMap<any>['sourceHoverSelectedChanged']) => void;
    onsourceSelectedChanged?: (value: ojThematicMapMarkerEventMap<any>['sourceSelectedChanged']) => void;
    onsvgClassNameChanged?: (value: ojThematicMapMarkerEventMap<any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojThematicMapMarkerEventMap<any>['svgStyleChanged']) => void;
    onvalueChanged?: (value: ojThematicMapMarkerEventMap<any>['valueChanged']) => void;
    onwidthChanged?: (value: ojThematicMapMarkerEventMap<any>['widthChanged']) => void;
    onxChanged?: (value: ojThematicMapMarkerEventMap<any>['xChanged']) => void;
    onyChanged?: (value: ojThematicMapMarkerEventMap<any>['yChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-thematic-map": ThematicMapIntrinsicProps;
            "oj-thematic-map-area": ThematicMapAreaIntrinsicProps;
            "oj-thematic-map-link": ThematicMapLinkIntrinsicProps;
            "oj-thematic-map-marker": ThematicMapMarkerIntrinsicProps;
        }
    }
}
