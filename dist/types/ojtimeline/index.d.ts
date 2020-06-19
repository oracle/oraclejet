/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { ojTimeAxis } from '../ojtimeaxis';
import Converter = require('../ojconverter');
import { DataProvider } from '../ojdataprovider';
import { dvtTimeComponent, dvtTimeComponentEventMap, dvtTimeComponentSettableProperties } from '../ojtime-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTimeline<K, D extends ojTimeline.DataItem | any> extends dvtTimeComponent<ojTimelineSettableProperties<K, D>> {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    data?: (DataProvider<K, D>);
    end: string;
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        svgStyle: CSSStyleDeclaration;
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        svgStyle: CSSStyleDeclaration;
        zoomOrder?: string[];
    };
    orientation: 'vertical' | 'horizontal';
    overview: {
        rendered?: 'on' | 'off';
        svgStyle: CSSStyleDeclaration;
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
            descriptionStyle: CSSStyleDeclaration;
            hoverBackgroundColor?: string;
            hoverBorderColor?: string;
            selectedBackgroundColor?: string;
            selectedBorderColor?: string;
            titleStyle: CSSStyleDeclaration;
        };
        majorAxis?: {
            labelStyle: CSSStyleDeclaration;
            separatorColor?: string;
        };
        minorAxis?: {
            backgroundColor?: string;
            borderColor?: string;
            labelStyle: CSSStyleDeclaration;
            separatorColor?: string;
        };
        overview?: {
            backgroundColor?: string;
            labelStyle: CSSStyleDeclaration;
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
            emptyTextStyle: CSSStyleDeclaration;
            labelStyle: CSSStyleDeclaration;
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
    viewportStart: string;
    translations: {
        accessibleItemDesc?: string;
        accessibleItemEnd?: string;
        accessibleItemStart?: string;
        accessibleItemTitle?: string;
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDescription?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelSeries?: string;
        labelStart?: string;
        labelTitle?: string;
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
        tooltipZoomIn?: string;
        tooltipZoomOut?: string;
    };
    addEventListener<T extends keyof ojTimelineEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojTimelineEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTimelineSettableProperties<K, D>>(property: T): ojTimeline<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTimelineSettableProperties<K, D>>(property: T, value: ojTimelineSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTimelineSettableProperties<K, D>>): void;
    setProperties(properties: ojTimelineSettablePropertiesLenient<K, D>): void;
    getContextByNode(node: Element): ojTimeline.NodeContext | null;
}
export namespace ojTimeline {
    interface ojViewportChange extends CustomEvent<{
        viewportStart: string;
        viewportEnd: string;
        minorAxisScale: string;
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
    type endChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["end"]>;
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
    type viewportStartChanged<K, D extends DataItem | any> = JetElementCustomEvent<ojTimeline<K, D>["viewportStart"]>;
    // tslint:disable-next-line interface-over-type-literal
    type DataItem = {
        seriesId: string;
        title?: string;
        description?: string;
        durationFillColor?: string;
        end?: string;
        shortDesc?: string;
        start: string;
        svgStyle?: CSSStyleDeclaration;
        thumbnail?: string;
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
        seriesIndex: number;
        itemIndex: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        value?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Series<K> = {
        id: string;
        items?: Array<SeriesItem<K>>;
        emptyText?: string;
        itemLayout?: 'auto' | 'bottomToTop' | 'topToBottom';
        label?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesItem<K> = {
        id: K;
        title?: string;
        description?: string;
        durationFillColor?: string;
        end?: string;
        shortDesc?: string;
        start: string;
        svgStyle?: CSSStyleDeclaration;
        thumbnail?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesTemplateContext = {
        componentElement: Element;
        index: number;
        id: any;
        items: Array<{
            data: object;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D> = {
        parentElement: Element;
        data: SeriesItem<K>;
        seriesData: Series<K>;
        itemData: D;
        componentElement: Element;
        color: string;
    };
}
export interface ojTimelineEventMap<K, D extends ojTimeline.DataItem | any> extends dvtTimeComponentEventMap<ojTimelineSettableProperties<K, D>> {
    'ojViewportChange': ojTimeline.ojViewportChange;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojTimeline<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojTimeline<K, D>["animationOnDisplay"]>;
    'dataChanged': JetElementCustomEvent<ojTimeline<K, D>["data"]>;
    'endChanged': JetElementCustomEvent<ojTimeline<K, D>["end"]>;
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
    'viewportStartChanged': JetElementCustomEvent<ojTimeline<K, D>["viewportStart"]>;
}
export interface ojTimelineSettableProperties<K, D extends ojTimeline.DataItem | any> extends dvtTimeComponentSettableProperties {
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    data?: (DataProvider<K, D>);
    end: string;
    majorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        svgStyle: CSSStyleDeclaration;
    };
    minorAxis: {
        converter?: (ojTimeAxis.Converters | Converter<string>);
        scale: 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'quarters' | 'years';
        svgStyle: CSSStyleDeclaration;
        zoomOrder?: string[];
    };
    orientation: 'vertical' | 'horizontal';
    overview: {
        rendered?: 'on' | 'off';
        svgStyle: CSSStyleDeclaration;
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
            descriptionStyle: CSSStyleDeclaration;
            hoverBackgroundColor?: string;
            hoverBorderColor?: string;
            selectedBackgroundColor?: string;
            selectedBorderColor?: string;
            titleStyle: CSSStyleDeclaration;
        };
        majorAxis?: {
            labelStyle: CSSStyleDeclaration;
            separatorColor?: string;
        };
        minorAxis?: {
            backgroundColor?: string;
            borderColor?: string;
            labelStyle: CSSStyleDeclaration;
            separatorColor?: string;
        };
        overview?: {
            backgroundColor?: string;
            labelStyle: CSSStyleDeclaration;
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
            emptyTextStyle: CSSStyleDeclaration;
            labelStyle: CSSStyleDeclaration;
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
    viewportStart: string;
    translations: {
        accessibleItemDesc?: string;
        accessibleItemEnd?: string;
        accessibleItemStart?: string;
        accessibleItemTitle?: string;
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDescription?: string;
        labelEnd?: string;
        labelInvalidData?: string;
        labelNoData?: string;
        labelSeries?: string;
        labelStart?: string;
        labelTitle?: string;
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
        tooltipZoomIn?: string;
        tooltipZoomOut?: string;
    };
}
export interface ojTimelineSettablePropertiesLenient<K, D extends ojTimeline.DataItem | any> extends Partial<ojTimelineSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojTimelineItem extends JetElement<ojTimelineItemSettableProperties> {
    description?: string;
    durationFillColor?: string | null;
    end?: string;
    label?: string;
    seriesId: string;
    shortDesc?: string | null;
    start: string;
    svgStyle?: CSSStyleDeclaration;
    thumbnail?: string;
    addEventListener<T extends keyof ojTimelineItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojTimelineItemEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTimelineItemSettableProperties>(property: T): ojTimelineItem[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTimelineItemSettableProperties>(property: T, value: ojTimelineItemSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTimelineItemSettableProperties>): void;
    setProperties(properties: ojTimelineItemSettablePropertiesLenient): void;
}
export namespace ojTimelineItem {
    // tslint:disable-next-line interface-over-type-literal
    type descriptionChanged = JetElementCustomEvent<ojTimelineItem["description"]>;
    // tslint:disable-next-line interface-over-type-literal
    type durationFillColorChanged = JetElementCustomEvent<ojTimelineItem["durationFillColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged = JetElementCustomEvent<ojTimelineItem["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojTimelineItem["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesIdChanged = JetElementCustomEvent<ojTimelineItem["seriesId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojTimelineItem["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged = JetElementCustomEvent<ojTimelineItem["start"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojTimelineItem["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thumbnailChanged = JetElementCustomEvent<ojTimelineItem["thumbnail"]>;
}
export interface ojTimelineItemEventMap extends HTMLElementEventMap {
    'descriptionChanged': JetElementCustomEvent<ojTimelineItem["description"]>;
    'durationFillColorChanged': JetElementCustomEvent<ojTimelineItem["durationFillColor"]>;
    'endChanged': JetElementCustomEvent<ojTimelineItem["end"]>;
    'labelChanged': JetElementCustomEvent<ojTimelineItem["label"]>;
    'seriesIdChanged': JetElementCustomEvent<ojTimelineItem["seriesId"]>;
    'shortDescChanged': JetElementCustomEvent<ojTimelineItem["shortDesc"]>;
    'startChanged': JetElementCustomEvent<ojTimelineItem["start"]>;
    'svgStyleChanged': JetElementCustomEvent<ojTimelineItem["svgStyle"]>;
    'thumbnailChanged': JetElementCustomEvent<ojTimelineItem["thumbnail"]>;
}
export interface ojTimelineItemSettableProperties extends JetSettableProperties {
    description?: string;
    durationFillColor?: string | null;
    end?: string;
    label?: string;
    seriesId: string;
    shortDesc?: string | null;
    start: string;
    svgStyle?: CSSStyleDeclaration;
    thumbnail?: string;
}
export interface ojTimelineItemSettablePropertiesLenient extends Partial<ojTimelineItemSettableProperties> {
    [key: string]: any;
}
export interface ojTimelineSeries extends JetElement<ojTimelineSeriesSettableProperties> {
    emptyText?: string;
    itemLayout?: 'auto' | 'bottomToTop' | 'topToBottom';
    label?: string;
    svgStyle?: CSSStyleDeclaration;
    addEventListener<T extends keyof ojTimelineSeriesEventMap>(type: T, listener: (this: HTMLElement, ev: ojTimelineSeriesEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    svgStyle?: CSSStyleDeclaration;
}
export interface ojTimelineSeriesSettablePropertiesLenient extends Partial<ojTimelineSeriesSettableProperties> {
    [key: string]: any;
}
