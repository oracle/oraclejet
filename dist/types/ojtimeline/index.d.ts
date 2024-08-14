import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DvtTimeComponentScale } from '../ojdvttimecomponentscale';
import { ojTimeAxis } from '../ojtimeaxis';
import Converter = require('../ojconverter');
import { DataProvider } from '../ojdataprovider';
import { dvtTimeComponent, dvtTimeComponentEventMap, dvtTimeComponentSettableProperties } from '../ojtime-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTimeline<K, D extends ojTimeline.DataItem | any> extends dvtTimeComponent<ojTimelineSettableProperties<K, D>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    data?: (DataProvider<K, D>);
    dnd: {
        move?: {
            items?: 'disabled' | 'enabled';
        };
    };
    end: string;
    itemDefaults: {
        feelers?: 'off' | 'on';
        resizable?: 'disabled' | 'enabled';
    };
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale?: (string | DvtTimeComponentScale);
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale?: (string | DvtTimeComponentScale);
        svgStyle?: Partial<CSSStyleDeclaration>;
        zoomOrder?: Array<string | DvtTimeComponentScale>;
    };
    orientation: 'vertical' | 'horizontal';
    overview: {
        rendered?: 'on' | 'off';
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    referenceObjects: ojTimeline.ReferenceObject[];
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    start: string;
    styleDefaults: {
        animationDuration?: number;
        borderColor?: string;
        item?: {
            backgroundColor?: string;
            borderColor?: string;
            descriptionStyle?: Partial<CSSStyleDeclaration>;
            hoverBackgroundColor?: string;
            hoverBorderColor?: string;
            selectedBackgroundColor?: string;
            selectedBorderColor?: string;
            titleStyle?: Partial<CSSStyleDeclaration>;
        };
        majorAxis?: {
            labelStyle?: Partial<CSSStyleDeclaration>;
            separatorColor?: string;
        };
        minorAxis?: {
            backgroundColor?: string;
            borderColor?: string;
            labelStyle?: Partial<CSSStyleDeclaration>;
            separatorColor?: string;
        };
        overview?: {
            backgroundColor?: string;
            labelStyle?: Partial<CSSStyleDeclaration>;
            window?: {
                backgroundColor?: string;
                borderColor?: string;
            };
        };
        referenceObject?: {
            color?: string;
        };
        series?: {
            backgroundColor?: string;
            colors?: string[];
            emptyTextStyle?: Partial<CSSStyleDeclaration>;
            labelStyle?: Partial<CSSStyleDeclaration>;
        };
    };
    tooltip: {
        renderer: ((context: ojTimeline.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    valueFormats: {
        date?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        description?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        end?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        series?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        start?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        title?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
    };
    viewportEnd: string;
    viewportNavigationMode: 'continuous' | 'discrete';
    viewportStart: string;
    translations: {
        accessibleContainsControls?: string;
        accessibleItemDesc?: string;
        accessibleItemEnd?: string;
        accessibleItemStart?: string;
        accessibleItemTitle?: string;
        componentName?: string;
        itemMoveCancelled?: string;
        itemMoveFinalized?: string;
        itemMoveInitiated?: string;
        itemMoveInitiatedInstruction?: string;
        itemMoveSelectionInfo?: string;
        itemResizeCancelled?: string;
        itemResizeEndHandle?: string;
        itemResizeEndInitiated?: string;
        itemResizeFinalized?: string;
        itemResizeInitiatedInstruction?: string;
        itemResizeSelectionInfo?: string;
        itemResizeStartHandle?: string;
        itemResizeStartInitiated?: string;
        labelAccNavNextPage?: string;
        labelAccNavPreviousPage?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDescription?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelMoveBy?: string;
        labelNoData?: string;
        labelResizeBy?: string;
        labelSeries?: string;
        labelStart?: string;
        labelTitle?: string;
        navArrowDisabledState?: string;
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
        tipArrowNextPage?: string;
        tipArrowPreviousPage?: string;
        tooltipZoomIn?: string;
        tooltipZoomOut?: string;
    };
    addEventListener<T extends keyof ojTimelineEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTimelineEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTimelineSettableProperties<K, D>>(property: T): ojTimeline<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTimelineSettableProperties<K, D>>(property: T, value: ojTimelineSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTimelineSettableProperties<K, D>>): void;
    setProperties(properties: ojTimelineSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojTimeline.NodeContext | null;
}
export namespace ojTimeline {
    interface ojMove<K, D> extends CustomEvent<{
        end: string;
        itemContexts: Array<{
            itemType: string;
            data: SeriesItem<K>;
            seriesData: Series<K>;
            itemData: D | null;
            color: string;
        }>;
        start: string;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojResize<K, D> extends CustomEvent<{
        end: string;
        itemContexts: Array<{
            itemType: string;
            data: SeriesItem<K>;
            seriesData: Series<K>;
            itemData: D | null;
            color: string;
        }>;
        start: string;
        typeDetail: string;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChange extends CustomEvent<{
        minorAxisScale: string;
        viewportEnd: string;
        viewportStart: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemDefaultsChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["itemDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type majorAxisChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["majorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minorAxisChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["minorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportEndChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportEnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportNavigationModeChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportNavigationMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportStartChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportStart"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends DataItem | any> = dvtTimeComponent.trackResizeChanged<ojTimelineSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataItem<K = any, D = any> = {
        background?: 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'green';
        description?: string;
        durationFillColor?: string;
        end?: string;
        itemType?: 'event' | 'duration-bar' | 'duration-event' | 'auto';
        seriesId: string;
        shortDesc?: (string | ((context: ItemShortDescContext<K, D>) => string));
        start: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        thumbnail?: string;
        title?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemBubbleTemplateContext<K, D> = {
        contentWidth: number | null;
        data: SeriesItem<K>;
        durationWidth: number | null;
        itemData: D;
        maxAvailableWidth: number;
        previousState: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
        seriesData: Series<K>;
        state: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemShortDescContext<K, D> = {
        data: SeriesItem<K>;
        itemData: D;
        seriesData: Series<K>;
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
        itemIndex: number;
        seriesIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        label?: string;
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Series<K> = {
        emptyText?: string;
        id: string;
        itemLayout?: 'auto' | 'bottomToTop' | 'topToBottom';
        items?: Array<SeriesItem<K>>;
        label?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesItem<K, D = any> = {
        background?: 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'green';
        description?: string;
        durationFillColor?: string;
        end?: string;
        id: K;
        itemType?: 'event' | 'duration-bar' | 'duration-event' | 'auto';
        shortDesc?: (string | ((context: ItemShortDescContext<K, D>) => string));
        start: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        thumbnail?: string;
        title?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesTemplateContext = {
        componentElement: Element;
        id: any;
        index: number;
        items: Array<{
            data: object;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        color: string;
        componentElement: Element;
        data: SeriesItem<K>;
        itemData: D;
        parentElement: Element;
        seriesData: Series<K>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemBubbleContentTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<ItemBubbleTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderSeriesTemplate = import('ojs/ojvcomponent').TemplateSlot<SeriesTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D>>;
}
export interface ojTimelineEventMap<K, D extends ojTimeline.DataItem | any> extends dvtTimeComponentEventMap<ojTimelineSettableProperties<K, D>> {
    'ojMove': ojTimeline.ojMove<K, D>;
    'ojResize': ojTimeline.ojResize<K, D>;
    'ojViewportChange': ojTimeline.ojViewportChange;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojTimeline<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojTimeline<K, D>["animationOnDisplay"]>;
    'dataChanged': JetElementCustomEvent<ojTimeline<K, D>["data"]>;
    'dndChanged': JetElementCustomEvent<ojTimeline<K, D>["dnd"]>;
    'endChanged': JetElementCustomEvent<ojTimeline<K, D>["end"]>;
    'itemDefaultsChanged': JetElementCustomEvent<ojTimeline<K, D>["itemDefaults"]>;
    'majorAxisChanged': JetElementCustomEvent<ojTimeline<K, D>["majorAxis"]>;
    'minorAxisChanged': JetElementCustomEvent<ojTimeline<K, D>["minorAxis"]>;
    'orientationChanged': JetElementCustomEvent<ojTimeline<K, D>["orientation"]>;
    'overviewChanged': JetElementCustomEvent<ojTimeline<K, D>["overview"]>;
    'referenceObjectsChanged': JetElementCustomEvent<ojTimeline<K, D>["referenceObjects"]>;
    'selectionChanged': JetElementCustomEvent<ojTimeline<K, D>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojTimeline<K, D>["selectionMode"]>;
    'startChanged': JetElementCustomEvent<ojTimeline<K, D>["start"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojTimeline<K, D>["styleDefaults"]>;
    'tooltipChanged': JetElementCustomEvent<ojTimeline<K, D>["tooltip"]>;
    'valueFormatsChanged': JetElementCustomEvent<ojTimeline<K, D>["valueFormats"]>;
    'viewportEndChanged': JetElementCustomEvent<ojTimeline<K, D>["viewportEnd"]>;
    'viewportNavigationModeChanged': JetElementCustomEvent<ojTimeline<K, D>["viewportNavigationMode"]>;
    'viewportStartChanged': JetElementCustomEvent<ojTimeline<K, D>["viewportStart"]>;
    'trackResizeChanged': JetElementCustomEvent<ojTimeline<K, D>["trackResize"]>;
}
export interface ojTimelineSettableProperties<K, D extends ojTimeline.DataItem | any> extends dvtTimeComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    data?: (DataProvider<K, D>);
    dnd: {
        move?: {
            items?: 'disabled' | 'enabled';
        };
    };
    end: string;
    itemDefaults: {
        feelers?: 'off' | 'on';
        resizable?: 'disabled' | 'enabled';
    };
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale?: (string | DvtTimeComponentScale);
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale?: (string | DvtTimeComponentScale);
        svgStyle?: Partial<CSSStyleDeclaration>;
        zoomOrder?: Array<string | DvtTimeComponentScale>;
    };
    orientation: 'vertical' | 'horizontal';
    overview: {
        rendered?: 'on' | 'off';
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    referenceObjects: ojTimeline.ReferenceObject[];
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    start: string;
    styleDefaults: {
        animationDuration?: number;
        borderColor?: string;
        item?: {
            backgroundColor?: string;
            borderColor?: string;
            descriptionStyle?: Partial<CSSStyleDeclaration>;
            hoverBackgroundColor?: string;
            hoverBorderColor?: string;
            selectedBackgroundColor?: string;
            selectedBorderColor?: string;
            titleStyle?: Partial<CSSStyleDeclaration>;
        };
        majorAxis?: {
            labelStyle?: Partial<CSSStyleDeclaration>;
            separatorColor?: string;
        };
        minorAxis?: {
            backgroundColor?: string;
            borderColor?: string;
            labelStyle?: Partial<CSSStyleDeclaration>;
            separatorColor?: string;
        };
        overview?: {
            backgroundColor?: string;
            labelStyle?: Partial<CSSStyleDeclaration>;
            window?: {
                backgroundColor?: string;
                borderColor?: string;
            };
        };
        referenceObject?: {
            color?: string;
        };
        series?: {
            backgroundColor?: string;
            colors?: string[];
            emptyTextStyle?: Partial<CSSStyleDeclaration>;
            labelStyle?: Partial<CSSStyleDeclaration>;
        };
    };
    tooltip: {
        renderer: ((context: ojTimeline.TooltipContext<K, D>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    valueFormats: {
        date?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        description?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        end?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        series?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        start?: {
            converter?: (Converter<string>);
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
        title?: {
            tooltipDisplay?: 'off' | 'auto';
            tooltipLabel?: string;
        };
    };
    viewportEnd: string;
    viewportNavigationMode: 'continuous' | 'discrete';
    viewportStart: string;
    translations: {
        accessibleContainsControls?: string;
        accessibleItemDesc?: string;
        accessibleItemEnd?: string;
        accessibleItemStart?: string;
        accessibleItemTitle?: string;
        componentName?: string;
        itemMoveCancelled?: string;
        itemMoveFinalized?: string;
        itemMoveInitiated?: string;
        itemMoveInitiatedInstruction?: string;
        itemMoveSelectionInfo?: string;
        itemResizeCancelled?: string;
        itemResizeEndHandle?: string;
        itemResizeEndInitiated?: string;
        itemResizeFinalized?: string;
        itemResizeInitiatedInstruction?: string;
        itemResizeSelectionInfo?: string;
        itemResizeStartHandle?: string;
        itemResizeStartInitiated?: string;
        labelAccNavNextPage?: string;
        labelAccNavPreviousPage?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDescription?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelMoveBy?: string;
        labelNoData?: string;
        labelResizeBy?: string;
        labelSeries?: string;
        labelStart?: string;
        labelTitle?: string;
        navArrowDisabledState?: string;
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
        tipArrowNextPage?: string;
        tipArrowPreviousPage?: string;
        tooltipZoomIn?: string;
        tooltipZoomOut?: string;
    };
}
export interface ojTimelineSettablePropertiesLenient<K, D extends ojTimeline.DataItem | any> extends Partial<ojTimelineSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojTimelineItem<K = any, D = any> extends dvtTimeComponent<ojTimelineItemSettableProperties<K, D>> {
    background?: 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'green';
    description?: string;
    durationFillColor?: string | null;
    end?: string;
    itemType?: 'event' | 'duration-bar' | 'duration-event' | 'auto';
    label?: string;
    seriesId: string;
    shortDesc?: (string | ((context: ojTimeline.ItemShortDescContext<K, D>) => string));
    start: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    thumbnail?: string;
    addEventListener<T extends keyof ojTimelineItemEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTimelineItemEventMap<K, D>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTimelineItemSettableProperties<K, D>>(property: T): ojTimelineItem<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTimelineItemSettableProperties<K, D>>(property: T, value: ojTimelineItemSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTimelineItemSettableProperties<K, D>>): void;
    setProperties(properties: ojTimelineItemSettablePropertiesLenient<K, D>): void;
}
export namespace ojTimelineItem {
    // tslint:disable-next-line interface-over-type-literal
    type backgroundChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["background"]>;
    // tslint:disable-next-line interface-over-type-literal
    type descriptionChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["description"]>;
    // tslint:disable-next-line interface-over-type-literal
    type durationFillColorChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["durationFillColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTypeChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["itemType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesIdChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["seriesId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thumbnailChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["thumbnail"]>;
}
export interface ojTimelineItemEventMap<K = any, D = any> extends dvtTimeComponentEventMap<ojTimelineItemSettableProperties<K, D>> {
    'backgroundChanged': JetElementCustomEvent<ojTimelineItem<K, D>["background"]>;
    'descriptionChanged': JetElementCustomEvent<ojTimelineItem<K, D>["description"]>;
    'durationFillColorChanged': JetElementCustomEvent<ojTimelineItem<K, D>["durationFillColor"]>;
    'endChanged': JetElementCustomEvent<ojTimelineItem<K, D>["end"]>;
    'itemTypeChanged': JetElementCustomEvent<ojTimelineItem<K, D>["itemType"]>;
    'labelChanged': JetElementCustomEvent<ojTimelineItem<K, D>["label"]>;
    'seriesIdChanged': JetElementCustomEvent<ojTimelineItem<K, D>["seriesId"]>;
    'shortDescChanged': JetElementCustomEvent<ojTimelineItem<K, D>["shortDesc"]>;
    'startChanged': JetElementCustomEvent<ojTimelineItem<K, D>["start"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTimelineItem<K, D>["svgStyle"]>;
    'thumbnailChanged': JetElementCustomEvent<ojTimelineItem<K, D>["thumbnail"]>;
}
export interface ojTimelineItemSettableProperties<K = any, D = any> extends dvtTimeComponentSettableProperties {
    background?: 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'green';
    description?: string;
    durationFillColor?: string | null;
    end?: string;
    itemType?: 'event' | 'duration-bar' | 'duration-event' | 'auto';
    label?: string;
    seriesId: string;
    shortDesc?: (string | ((context: ojTimeline.ItemShortDescContext<K, D>) => string));
    start: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    thumbnail?: string;
}
export interface ojTimelineItemSettablePropertiesLenient<K = any, D = any> extends Partial<ojTimelineItemSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojTimelineSeries extends JetElement<ojTimelineSeriesSettableProperties> {
    emptyText?: string;
    itemLayout?: 'auto' | 'bottomToTop' | 'topToBottom';
    label?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    addEventListener<T extends keyof ojTimelineSeriesEventMap>(type: T, listener: (this: HTMLElement, ev: ojTimelineSeriesEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTimelineSeriesSettableProperties>(property: T): ojTimelineSeries[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTimelineSeriesSettableProperties>(property: T, value: ojTimelineSeriesSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTimelineSeriesSettableProperties>): void;
    setProperties(properties: ojTimelineSeriesSettablePropertiesLenient): void;
}
export namespace ojTimelineSeries {
    // tslint:disable-next-line interface-over-type-literal
    type emptyTextChanged = JetElementCustomEvent<ojTimelineSeries["emptyText"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemLayoutChanged = JetElementCustomEvent<ojTimelineSeries["itemLayout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojTimelineSeries["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojTimelineSeries["svgStyle"]>;
}
export interface ojTimelineSeriesEventMap extends HTMLElementEventMap {
    'emptyTextChanged': JetElementCustomEvent<ojTimelineSeries["emptyText"]>;
    'itemLayoutChanged': JetElementCustomEvent<ojTimelineSeries["itemLayout"]>;
    'labelChanged': JetElementCustomEvent<ojTimelineSeries["label"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTimelineSeries["svgStyle"]>;
}
export interface ojTimelineSeriesSettableProperties extends JetSettableProperties {
    emptyText?: string;
    itemLayout?: 'auto' | 'bottomToTop' | 'topToBottom';
    label?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
}
export interface ojTimelineSeriesSettablePropertiesLenient extends Partial<ojTimelineSeriesSettableProperties> {
    [key: string]: any;
}
export type TimelineElement<K, D extends ojTimeline.DataItem | any> = ojTimeline<K, D>;
export type TimelineItemElement<K = any, D = any> = ojTimelineItem<K, D>;
export type TimelineSeriesElement = ojTimelineSeries;
export namespace TimelineElement {
    interface ojMove<K, D> extends CustomEvent<{
        end: string;
        itemContexts: Array<{
            itemType: string;
            data: ojTimeline.SeriesItem<K>;
            seriesData: ojTimeline.Series<K>;
            itemData: D | null;
            color: string;
        }>;
        start: string;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojResize<K, D> extends CustomEvent<{
        end: string;
        itemContexts: Array<{
            itemType: string;
            data: ojTimeline.SeriesItem<K>;
            seriesData: ojTimeline.Series<K>;
            itemData: D | null;
            color: string;
        }>;
        start: string;
        typeDetail: string;
        value: string;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChange extends CustomEvent<{
        minorAxisScale: string;
        viewportEnd: string;
        viewportStart: string;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemDefaultsChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["itemDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type majorAxisChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["majorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minorAxisChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["minorAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportEndChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportEnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportNavigationModeChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportNavigationMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type viewportStartChanged<K, D extends ojTimeline.DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportStart"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojTimeline.DataItem | any> = dvtTimeComponent.trackResizeChanged<ojTimelineSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type DataItem<K = any, D = any> = {
        background?: 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'green';
        description?: string;
        durationFillColor?: string;
        end?: string;
        itemType?: 'event' | 'duration-bar' | 'duration-event' | 'auto';
        seriesId: string;
        shortDesc?: (string | ((context: ojTimeline.ItemShortDescContext<K, D>) => string));
        start: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        thumbnail?: string;
        title?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemBubbleTemplateContext<K, D> = {
        contentWidth: number | null;
        data: ojTimeline.SeriesItem<K>;
        durationWidth: number | null;
        itemData: D;
        maxAvailableWidth: number;
        previousState: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
        seriesData: ojTimeline.Series<K>;
        state: {
            focused: boolean;
            hovered: boolean;
            selected: boolean;
        };
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemShortDescContext<K, D> = {
        data: ojTimeline.SeriesItem<K>;
        itemData: D;
        seriesData: ojTimeline.Series<K>;
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
        itemIndex: number;
        seriesIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        label?: string;
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Series<K> = {
        emptyText?: string;
        id: string;
        itemLayout?: 'auto' | 'bottomToTop' | 'topToBottom';
        items?: Array<ojTimeline.SeriesItem<K>>;
        label?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesItem<K, D = any> = {
        background?: 'blue' | 'orange' | 'purple' | 'red' | 'teal' | 'green';
        description?: string;
        durationFillColor?: string;
        end?: string;
        id: K;
        itemType?: 'event' | 'duration-bar' | 'duration-event' | 'auto';
        shortDesc?: (string | ((context: ojTimeline.ItemShortDescContext<K, D>) => string));
        start: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        thumbnail?: string;
        title?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesTemplateContext = {
        componentElement: Element;
        id: any;
        index: number;
        items: Array<{
            data: object;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        color: string;
        componentElement: Element;
        data: ojTimeline.SeriesItem<K>;
        itemData: D;
        parentElement: Element;
        seriesData: ojTimeline.Series<K>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemBubbleContentTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<ItemBubbleTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderSeriesTemplate = import('ojs/ojvcomponent').TemplateSlot<SeriesTemplateContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D>>;
}
export namespace TimelineItemElement {
    // tslint:disable-next-line interface-over-type-literal
    type backgroundChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["background"]>;
    // tslint:disable-next-line interface-over-type-literal
    type descriptionChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["description"]>;
    // tslint:disable-next-line interface-over-type-literal
    type durationFillColorChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["durationFillColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemTypeChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["itemType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesIdChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["seriesId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thumbnailChanged<K = any, D = any> = JetElementCustomEvent<ojTimelineItem<K, D>["thumbnail"]>;
}
export namespace TimelineSeriesElement {
    // tslint:disable-next-line interface-over-type-literal
    type emptyTextChanged = JetElementCustomEvent<ojTimelineSeries["emptyText"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemLayoutChanged = JetElementCustomEvent<ojTimelineSeries["itemLayout"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojTimelineSeries["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojTimelineSeries["svgStyle"]>;
}
export interface TimelineIntrinsicProps extends Partial<Readonly<ojTimelineSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojMove?: (value: ojTimelineEventMap<any, any>['ojMove']) => void;
    onojResize?: (value: ojTimelineEventMap<any, any>['ojResize']) => void;
    onojViewportChange?: (value: ojTimelineEventMap<any, any>['ojViewportChange']) => void;
    onanimationOnDataChangeChanged?: (value: ojTimelineEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojTimelineEventMap<any, any>['animationOnDisplayChanged']) => void;
    ondataChanged?: (value: ojTimelineEventMap<any, any>['dataChanged']) => void;
    ondndChanged?: (value: ojTimelineEventMap<any, any>['dndChanged']) => void;
    onendChanged?: (value: ojTimelineEventMap<any, any>['endChanged']) => void;
    onitemDefaultsChanged?: (value: ojTimelineEventMap<any, any>['itemDefaultsChanged']) => void;
    onmajorAxisChanged?: (value: ojTimelineEventMap<any, any>['majorAxisChanged']) => void;
    onminorAxisChanged?: (value: ojTimelineEventMap<any, any>['minorAxisChanged']) => void;
    onorientationChanged?: (value: ojTimelineEventMap<any, any>['orientationChanged']) => void;
    onoverviewChanged?: (value: ojTimelineEventMap<any, any>['overviewChanged']) => void;
    onreferenceObjectsChanged?: (value: ojTimelineEventMap<any, any>['referenceObjectsChanged']) => void;
    onselectionChanged?: (value: ojTimelineEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojTimelineEventMap<any, any>['selectionModeChanged']) => void;
    onstartChanged?: (value: ojTimelineEventMap<any, any>['startChanged']) => void;
    onstyleDefaultsChanged?: (value: ojTimelineEventMap<any, any>['styleDefaultsChanged']) => void;
    ontooltipChanged?: (value: ojTimelineEventMap<any, any>['tooltipChanged']) => void;
    onvalueFormatsChanged?: (value: ojTimelineEventMap<any, any>['valueFormatsChanged']) => void;
    onviewportEndChanged?: (value: ojTimelineEventMap<any, any>['viewportEndChanged']) => void;
    onviewportNavigationModeChanged?: (value: ojTimelineEventMap<any, any>['viewportNavigationModeChanged']) => void;
    onviewportStartChanged?: (value: ojTimelineEventMap<any, any>['viewportStartChanged']) => void;
    ontrackResizeChanged?: (value: ojTimelineEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface TimelineItemIntrinsicProps extends Partial<Readonly<ojTimelineItemSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onbackgroundChanged?: (value: ojTimelineItemEventMap<any, any>['backgroundChanged']) => void;
    ondescriptionChanged?: (value: ojTimelineItemEventMap<any, any>['descriptionChanged']) => void;
    ondurationFillColorChanged?: (value: ojTimelineItemEventMap<any, any>['durationFillColorChanged']) => void;
    onendChanged?: (value: ojTimelineItemEventMap<any, any>['endChanged']) => void;
    onitemTypeChanged?: (value: ojTimelineItemEventMap<any, any>['itemTypeChanged']) => void;
    onlabelChanged?: (value: ojTimelineItemEventMap<any, any>['labelChanged']) => void;
    onseriesIdChanged?: (value: ojTimelineItemEventMap<any, any>['seriesIdChanged']) => void;
    onshortDescChanged?: (value: ojTimelineItemEventMap<any, any>['shortDescChanged']) => void;
    onstartChanged?: (value: ojTimelineItemEventMap<any, any>['startChanged']) => void;
    onsvgStyleChanged?: (value: ojTimelineItemEventMap<any, any>['svgStyleChanged']) => void;
    onthumbnailChanged?: (value: ojTimelineItemEventMap<any, any>['thumbnailChanged']) => void;
    children?: ComponentChildren;
}
export interface TimelineSeriesIntrinsicProps extends Partial<Readonly<ojTimelineSeriesSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onemptyTextChanged?: (value: ojTimelineSeriesEventMap['emptyTextChanged']) => void;
    onitemLayoutChanged?: (value: ojTimelineSeriesEventMap['itemLayoutChanged']) => void;
    onlabelChanged?: (value: ojTimelineSeriesEventMap['labelChanged']) => void;
    onsvgStyleChanged?: (value: ojTimelineSeriesEventMap['svgStyleChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-timeline": TimelineIntrinsicProps;
            "oj-timeline-item": TimelineItemIntrinsicProps;
            "oj-timeline-series": TimelineSeriesIntrinsicProps;
        }
    }
}
