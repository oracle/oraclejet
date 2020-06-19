/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DataProvider } from '../ojdataprovider';
import Converter = require('../ojconverter');
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojChart<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends dvtBaseComponent<ojChartSettableProperties<K, D, I, C>> {
    animationOnDataChange: 'auto' | 'slideToLeft' | 'slideToRight' | 'none';
    animationOnDisplay: 'auto' | 'alphaFade' | 'zoom' | 'none';
    as: string;
    coordinateSystem: 'polar' | 'cartesian';
    data: DataProvider<K, D> | null;
    dataCursor: 'off' | 'on' | 'auto';
    dataCursorBehavior: 'smooth' | 'snap' | 'auto';
    dataCursorPosition: {
        x: number | string;
        y: number;
        y2: number;
    };
    dataLabel: ((context: ojChart.DataLabelContext<K, D, I>) => (string[] | string | number[] | number));
    dnd: {
        drag: {
            groups: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: ojChart.DndGroup) => void);
            };
            items: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: ojChart.DndItem<K, D, I>) => void);
            };
            series: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: ojChart.DndSeries<K, I>) => void);
            };
        };
        drop: {
            legend: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            plotArea: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            xAxis: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            y2Axis: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            yAxis: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
        };
    };
    dragMode: 'pan' | 'zoom' | 'select' | 'off' | 'user';
    drilling: 'on' | 'seriesOnly' | 'groupsOnly' | 'off';
    groupComparator: ((context1: ojChart.GroupTemplateContext<D>, context2: ojChart.GroupTemplateContext<D>) => number);
    hiddenCategories: string[];
    hideAndShowBehavior: 'withRescale' | 'withoutRescale' | 'none';
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    initialZooming: 'first' | 'last' | 'none';
    legend: {
        backgroundColor: string;
        borderColor: string;
        maxSize: string;
        position: 'start' | 'end' | 'bottom' | 'top' | 'auto';
        referenceObjectSection: {
            title: string;
            titleHalign: 'center' | 'end' | 'start';
            titleStyle: CSSStyleDeclaration;
        };
        rendered: 'on' | 'off' | 'auto';
        scrolling: 'off' | 'asNeeded';
        sections: ojChart.LegendSection[];
        seriesSection: {
            title: string;
            titleHalign: 'center' | 'end' | 'start';
            titleStyle: CSSStyleDeclaration;
        };
        size: string;
        symbolHeight: number;
        symbolWidth: number;
        textStyle: CSSStyleDeclaration;
        title: string;
        titleHalign: 'center' | 'end' | 'start';
        titleStyle: CSSStyleDeclaration;
    };
    orientation: 'horizontal' | 'vertical';
    otherThreshold: number;
    overview: {
        content: C;
        height: string;
        rendered: 'on' | 'off';
    };
    pieCenter: {
        converter?: (Converter<number>);
        label: string;
        labelStyle: CSSStyleDeclaration;
        renderer: ((context: ojChart.PieCenterContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
        scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
    };
    plotArea: {
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        rendered: 'off' | 'on';
    };
    polarGridShape: 'polygon' | 'circle';
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    seriesComparator: ((context1: ojChart.SeriesTemplateContext<D>, context2: ojChart.SeriesTemplateContext<D>) => number);
    sorting: 'ascending' | 'descending' | 'off';
    splitDualY: 'on' | 'off' | 'auto';
    splitterPosition: number;
    stack: 'on' | 'off';
    stackLabel: 'on' | 'off';
    styleDefaults: {
        animationDownColor: string;
        animationDuration: number;
        animationIndicators: 'none' | 'all';
        animationUpColor: string;
        barGapRatio: number;
        borderColor: string;
        borderWidth: number;
        boxPlot: {
            medianSvgClassName: string;
            medianSvgStyle: CSSStyleDeclaration;
            whiskerEndLength: string;
            whiskerEndSvgClassName: string;
            whiskerEndSvgStyle: CSSStyleDeclaration;
            whiskerSvgClassName: string;
            whiskerSvgStyle: CSSStyleDeclaration;
        };
        colors: string[];
        dataCursor: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            markerColor: string;
            markerDisplayed: 'off' | 'on';
            markerSize: number;
        };
        dataItemGaps: string;
        dataLabelCollision: 'fitInBounds' | 'none';
        dataLabelPosition: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        dataLabelStyle: CSSStyleDeclaration | CSSStyleDeclaration[];
        funnelBackgroundColor: string;
        groupSeparators: {
            color: string;
            rendered: 'off' | 'auto';
        };
        hoverBehaviorDelay: number;
        lineStyle: 'dotted' | 'dashed' | 'solid';
        lineType: 'straight' | 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'auto';
        lineWidth: number;
        markerColor: string;
        markerDisplayed: 'on' | 'off' | 'auto';
        markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        markerSize: number;
        marqueeBorderColor: string;
        marqueeColor: string;
        maxBarWidth: number;
        otherColor: string;
        patterns: string[];
        pieFeelerColor: string;
        pieInnerRadius: number;
        selectionEffect: 'explode' | 'highlightAndExplode' | 'highlight';
        seriesEffect: 'color' | 'pattern' | 'gradient';
        shapes: string[];
        stackLabelStyle: CSSStyleDeclaration;
        stockFallingColor: string;
        stockRangeColor: string;
        stockRisingColor: string;
        stockVolumeColor: string;
        threeDEffect: 'on' | 'off';
        tooltipLabelStyle: CSSStyleDeclaration;
        tooltipValueStyle: CSSStyleDeclaration;
    };
    timeAxisType: 'enabled' | 'mixedFrequency' | 'skipGaps' | 'disabled' | 'auto';
    tooltip: {
        renderer: ((context: ojChart.TooltipContext<K, D, I>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    type: 'line' | 'area' | 'lineWithArea' | 'stock' | 'boxPlot' | 'combo' | 'pie' | 'scatter' | 'bubble' | 'funnel' | 'pyramid' | 'bar';
    valueFormats: {
        close: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        group: {
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string | string[];
        };
        high: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        label: {
            converter?: (Converter<string>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        };
        low: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        open: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        q1: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        q2: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        q3: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        series: {
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        targetValue: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        value: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        volume: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        x: {
            converter?: (Converter<string | number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        y: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        y2: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        z: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
    };
    xAxis: {
        axisLine: {
            lineColor: string;
            lineWidth: number;
            rendered: 'off' | 'on';
        };
        baselineScaling: 'min' | 'zero';
        dataMax: number;
        dataMin: number;
        majorTick: {
            baselineColor: 'inherit' | 'auto';
            baselineStyle: 'dotted' | 'dashed' | 'solid';
            baselineWidth: number;
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        max: number | string;
        maxSize: string;
        min: number | string;
        minStep: number;
        minorStep: number;
        minorTick: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        referenceObjects: Array<{
            categories: string[];
            color: string;
            displayInLegend: 'on' | 'off';
            high: number | string;
            id: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            location: 'front' | 'back';
            low: number | string;
            shortDesc: string;
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            text: string;
            type: 'area' | 'line';
            value: number | string;
        }>;
        rendered: 'off' | 'on';
        scale: 'log' | 'linear';
        size: string;
        step: number;
        tickLabel: {
            converter?: (Converter<string | number>);
            rendered: 'off' | 'on';
            rotation: 'none' | 'auto';
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            style: CSSStyleDeclaration;
        };
        title: string;
        titleStyle: CSSStyleDeclaration;
        viewportEndGroup: number | string;
        viewportMax: number | string;
        viewportMin: number | string;
        viewportStartGroup: number | string;
    };
    y2Axis: {
        alignTickMarks: 'off' | 'on';
        axisLine: {
            lineColor: string;
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        baselineScaling: 'min' | 'zero';
        dataMax: number;
        dataMin: number;
        majorTick: {
            baselineColor: 'inherit' | 'auto';
            baselineStyle: 'dotted' | 'dashed' | 'solid';
            baselineWidth: number;
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        max: number;
        maxSize: string;
        min: number;
        minStep: number;
        minorStep: number;
        minorTick: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        position: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects: Array<{
            categories: string[];
            color: string;
            displayInLegend: 'on' | 'off';
            high: number;
            id: string;
            items: Array<{
                high: number;
                low: number;
                value: number;
                x: number | string;
            }>;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineType: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight';
            lineWidth: number;
            location: 'front' | 'back';
            low: number;
            shortDesc: string;
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            text: string;
            type: 'area' | 'line';
            value: number;
        }>;
        rendered: 'off' | 'on';
        scale: 'log' | 'linear';
        size: string;
        step: number;
        tickLabel: {
            converter?: (Converter<number>);
            position: 'inside' | 'outside';
            rendered: 'off' | 'on';
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            style: CSSStyleDeclaration;
        };
        title: string;
        titleStyle: CSSStyleDeclaration;
    };
    yAxis: {
        axisLine: {
            lineColor: string;
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        baselineScaling: 'min' | 'zero';
        dataMax: number;
        dataMin: number;
        majorTick: {
            baselineColor: 'inherit' | 'auto';
            baselineStyle: 'dotted' | 'dashed' | 'solid';
            baselineWidth: number;
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        max: number;
        maxSize: string;
        min: number;
        minStep: number;
        minorStep: number;
        minorTick: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        position: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects: Array<{
            categories: string[];
            color: string;
            displayInLegend: 'on' | 'off';
            high: number;
            id: string;
            items: Array<{
                high: number;
                low: number;
                value: number;
                x: number | string;
            }>;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineType: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight';
            lineWidth: number;
            location: 'front' | 'back';
            low: number;
            shortDesc: string;
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            text: string;
            type: 'area' | 'line';
            value: number;
        }>;
        rendered: 'off' | 'on';
        scale: 'log' | 'linear';
        size: string;
        step: number;
        tickLabel: {
            converter?: (Converter<number>);
            position: 'inside' | 'outside';
            rendered: 'off' | 'on';
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            style: CSSStyleDeclaration;
        };
        title: string;
        titleStyle: CSSStyleDeclaration;
        viewportMax: number;
        viewportMin: number;
    };
    zoomAndScroll: 'delayedScrollOnly' | 'liveScrollOnly' | 'delayed' | 'live' | 'off';
    zoomDirection: 'x' | 'y' | 'auto';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelClose?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDefaultGroupName?: string;
        labelGroup?: string;
        labelHigh?: string;
        labelInvalidData?: string;
        labelLow?: string;
        labelNoData?: string;
        labelOpen?: string;
        labelOther?: string;
        labelPercentage?: string;
        labelQ1?: string;
        labelQ2?: string;
        labelQ3?: string;
        labelSeries?: string;
        labelTargetValue?: string;
        labelValue?: string;
        labelVolume?: string;
        labelX?: string;
        labelY?: string;
        labelZ?: string;
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
        tooltipPan?: string;
        tooltipSelect?: string;
        tooltipZoom?: string;
    };
    addEventListener<T extends keyof ojChartEventMap<K, D, I, C>>(type: T, listener: (this: HTMLElement, ev: ojChartEventMap<K, D, I, C>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojChartSettableProperties<K, D, I, C>>(property: T): ojChart<K, D, I, C>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojChartSettableProperties<K, D, I, C>>(property: T, value: ojChartSettableProperties<K, D, I, C>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojChartSettableProperties<K, D, I, C>>): void;
    setProperties(properties: ojChartSettablePropertiesLenient<K, D, I, C>): void;
    getContextByNode(node: Element): ojChart.PieCenterLabelContext | ojChart.LegendItemContext | ojChart.ReferenceObject | ojChart.GroupContext | ojChart.AxisTitleContext | ojChart.ItemContext |
       ojChart.SeriesContext;
    getValuesAt(x: number, y: number): {
        x: number | string | null;
        y: number | null;
        y2: number | null;
    };
}
export namespace ojChart {
    interface ojDrill<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        id: string;
        series: string;
        group: string;
        data: Item<K, I> | number | null;
        itemData: D;
        seriesData: Series<K, I> | null;
        groupData: Group[] | null;
        [propName: string]: any;
    }> {
    }
    interface ojSelectInput<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        items: string[];
        selectionData: Array<{
            data: Item<K, I> | number;
            itemData: D;
            groupData: Group[];
            seriesData: Series<K, I>;
        }>;
        endGroup: string;
        startGroup: string;
        xMax: number;
        xMin: number;
        yMax: number;
        yMin: number;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChange extends CustomEvent<{
        endGroup: string;
        startGroup: string;
        xMax: number;
        xMin: number;
        yMax: number;
        yMin: number;
        [propName: string]: any;
    }> {
    }
    interface ojViewportChangeInput extends CustomEvent<{
        endGroup: string;
        startGroup: string;
        xMax: number;
        xMin: number;
        yMax: number;
        yMin: number;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I, C>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type coordinateSystemChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["coordinateSystem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I, C>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataCursorChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["dataCursor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataCursorBehaviorChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["dataCursorBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataCursorPositionChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["dataCursorPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataLabelChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["dataLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I, C>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dragModeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["dragMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupComparatorChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["groupComparator"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hideAndShowBehaviorChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["hideAndShowBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type initialZoomingChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["initialZooming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type legendChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["legend"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherThresholdChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["otherThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pieCenterChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["pieCenter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type plotAreaChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["plotArea"]>;
    // tslint:disable-next-line interface-over-type-literal
    type polarGridShapeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["polarGridShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesComparatorChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["seriesComparator"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sortingChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["sorting"]>;
    // tslint:disable-next-line interface-over-type-literal
    type splitDualYChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["splitDualY"]>;
    // tslint:disable-next-line interface-over-type-literal
    type splitterPositionChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["splitterPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stackChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["stack"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stackLabelChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["stackLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timeAxisTypeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["timeAxisType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I, C>["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xAxisChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["xAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type y2AxisChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["y2Axis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yAxisChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["yAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomAndScrollChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["zoomAndScroll"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomDirectionChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["zoomDirection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type AxisTitleContext = {
        axis: 'xAxis' | 'yAxis' | 'y2Axis';
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type BoxPlotStyle = {
        medianSvgClassName?: string;
        medianSvgStyle?: CSSStyleDeclaration;
        q2Color?: string;
        q2SvgClassName?: string;
        q2SvgStyle?: CSSStyleDeclaration;
        q3Color?: string;
        q3SvgClassName?: string;
        q3SvgStyle?: CSSStyleDeclaration;
        whiskerEndLength?: string;
        whiskerEndSvgClassName?: string;
        whiskerEndSvgStyle?: CSSStyleDeclaration;
        whiskerSvgClassName?: string;
        whiskerSvgStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataItem<I extends Array<Item<any, null>> | number[] | null> = {
        groupId: Array<(string | number)>;
        seriesId: string | number;
        x?: number | string;
        y?: number;
        z?: number;
        low?: number;
        high?: number;
        open?: number;
        close?: number;
        volume?: number;
        q1?: number;
        q2?: number;
        q3?: number;
        shortDesc?: string;
        color?: string;
        borderColor?: string;
        borderWidth?: number;
        pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
           'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
        markerSize?: number;
        source?: string;
        sourceHover?: string;
        sourceSelected?: string;
        sourceHoverSelected?: string;
        label?: string | string[];
        labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        labelStyle?: CSSStyleDeclaration | CSSStyleDeclaration[];
        categories?: string[];
        value?: number;
        targetValue?: number;
        drilling?: 'on' | 'off' | 'inherit';
        boxPlot?: BoxPlotStyle;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataLabelContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        id: any;
        series: string;
        group: string | string[];
        value: number;
        targetValue: number;
        x: number | string;
        y: number;
        z: number;
        low: number;
        high: number;
        open: number;
        close: number;
        volume: number;
        label: string;
        totalValue: number;
        data: Item<K, Array<Item<any, null>> | number[] | null> | number | null;
        itemData: D;
        seriesData: Series<K, I> | null;
        groupData: Group[] | null;
        dimensions: {
            width: number;
            height: number;
        };
        componentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDrop = {
        x: number | null;
        y: number | null;
        y2: number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndGroup = {
        id: string | number | Array<(string | number)>;
        group: string | number | Array<(string | number)>;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndItem<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        item: Array<DataLabelContext<K, D, I>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndSeries<K, I extends Array<Item<any, null>> | number[] | null> = {
        id: string | number;
        color: string;
        componentElement: any;
        series: string | number;
        seriesData: Series<K, I>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Group = {
        id?: string | number;
        groups?: Group[];
        drilling?: 'on' | 'off' | 'inherit';
        labelStyle?: CSSStyleDeclaration;
        name?: string;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupContext = {
        indexPath: any[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupTemplateContext<D> = {
        componentElement: Element;
        index: number;
        ids: string[];
        depth: number;
        leaf: boolean;
        items: Array<{
            data: D;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Item<K, I extends Array<Item<any, null>> | number[] | null> = {
        id: K;
        items?: I;
        x?: number | string;
        y?: number;
        z?: number;
        low?: number;
        high?: number;
        open?: number;
        close?: number;
        volume?: number;
        q1?: number;
        q2?: number;
        q3?: number;
        shortDesc?: string;
        color?: string;
        borderColor?: string;
        borderWidth?: number;
        pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
           'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
        markerSize?: number;
        source?: string;
        sourceHover?: string;
        sourceSelected?: string;
        sourceHoverSelected?: string;
        label?: string | string[];
        labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        labelStyle?: CSSStyleDeclaration | CSSStyleDeclaration[];
        categories?: string[];
        value?: number;
        targetValue?: number;
        drilling?: 'on' | 'off' | 'inherit';
        boxPlot?: BoxPlotStyle;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext = {
        seriesIndex: number;
        itemIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        index: number;
        data: object;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendItem = {
        borderColor?: string;
        categories?: string[];
        categoryVisibility?: 'hidden' | 'visible';
        color?: string;
        id?: string;
        lineStyle?: 'dashed' | 'dotted' | 'solid';
        lineWidth?: number;
        markerColor?: string;
        markerShape?: 'circle' | 'diamond' | 'ellipse' | 'human' | 'plus' | 'rectangle' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        pattern?: 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' | 'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'none' | 'smallChecker' | 'smallCrosshatch' |
           'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle';
        shortDesc?: string;
        source?: string;
        symbolType?: 'image' | 'line' | 'lineWithMarker' | 'marker';
        text?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendItemContext = {
        sectionIndexPath: any[];
        itemIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendSection = {
        items?: LegendItem[];
        sections?: LegendSection[];
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: CSSStyleDeclaration;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterContext = {
        outerBounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        innerBounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        labelStyle: CSSStyleDeclaration;
        label: string;
        totalValue: number;
        componentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterLabelContext = {
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        axis: 'xAxis' | 'yAxis' | 'y2Axis';
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Series<K, I extends Array<Item<any, null>> | number[] | null> = {
        id?: string | number;
        items?: (Array<Item<K, Array<Item<any, null>> | number[] | null>> | number[]);
        areaColor?: string;
        areaSvgClassName?: string;
        areaSvgStyle?: CSSStyleDeclaration;
        assignedToY2?: 'on' | 'off';
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: BoxPlotStyle;
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off' | 'auto';
        drilling?: 'on' | 'off' | 'inherit';
        lineStyle?: 'dotted' | 'dashed' | 'solid';
        lineType?: 'straight' | 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'auto';
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'auto' | 'square' | 'circle' | 'diamond' | 'plus' | 'triangleDown' | 'triangleUp' | 'human' | 'star' | string;
        markerSize?: number;
        markerSvgClassName?: string;
        markerSvgStyle?: CSSStyleDeclaration;
        name?: string;
        pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
           'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
        pieSliceExplode?: number;
        shortDesc?: string;
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        stackCategory?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        type?: 'bar' | 'line' | 'area' | 'lineWithArea' | 'candlestick' | 'boxPlot' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesContext = {
        itemIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesTemplateContext<D> = {
        componentElement: Element;
        index: number;
        id: string;
        items: Array<{
            data: D;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        parentElement: Element;
        id: any;
        series: string;
        group: string | string[];
        label: string;
        value: number;
        x: number | string;
        y: number;
        z: number;
        low: number;
        high: number;
        open: number;
        close: number;
        volume: number;
        targetValue: number;
        data: Item<K, Array<Item<any, null>> | number[] | null> | number | null;
        itemData: D;
        seriesData: Series<K, I> | null;
        groupData: Group[] | null;
        componentElement: Element;
        color: string;
    };
}
export interface ojChartEventMap<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends dvtBaseComponentEventMap<ojChartSettableProperties<K, D, I, C>> {
    'ojDrill': ojChart.ojDrill<K, D, I>;
    'ojSelectInput': ojChart.ojSelectInput<K, D, I>;
    'ojViewportChange': ojChart.ojViewportChange;
    'ojViewportChangeInput': ojChart.ojViewportChangeInput;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojChart<K, D, I, C>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojChart<K, D, I, C>["as"]>;
    'coordinateSystemChanged': JetElementCustomEvent<ojChart<K, D, I, C>["coordinateSystem"]>;
    'dataChanged': JetElementCustomEvent<ojChart<K, D, I, C>["data"]>;
    'dataCursorChanged': JetElementCustomEvent<ojChart<K, D, I, C>["dataCursor"]>;
    'dataCursorBehaviorChanged': JetElementCustomEvent<ojChart<K, D, I, C>["dataCursorBehavior"]>;
    'dataCursorPositionChanged': JetElementCustomEvent<ojChart<K, D, I, C>["dataCursorPosition"]>;
    'dataLabelChanged': JetElementCustomEvent<ojChart<K, D, I, C>["dataLabel"]>;
    'dndChanged': JetElementCustomEvent<ojChart<K, D, I, C>["dnd"]>;
    'dragModeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["dragMode"]>;
    'drillingChanged': JetElementCustomEvent<ojChart<K, D, I, C>["drilling"]>;
    'groupComparatorChanged': JetElementCustomEvent<ojChart<K, D, I, C>["groupComparator"]>;
    'hiddenCategoriesChanged': JetElementCustomEvent<ojChart<K, D, I, C>["hiddenCategories"]>;
    'hideAndShowBehaviorChanged': JetElementCustomEvent<ojChart<K, D, I, C>["hideAndShowBehavior"]>;
    'highlightMatchChanged': JetElementCustomEvent<ojChart<K, D, I, C>["highlightMatch"]>;
    'highlightedCategoriesChanged': JetElementCustomEvent<ojChart<K, D, I, C>["highlightedCategories"]>;
    'hoverBehaviorChanged': JetElementCustomEvent<ojChart<K, D, I, C>["hoverBehavior"]>;
    'initialZoomingChanged': JetElementCustomEvent<ojChart<K, D, I, C>["initialZooming"]>;
    'legendChanged': JetElementCustomEvent<ojChart<K, D, I, C>["legend"]>;
    'orientationChanged': JetElementCustomEvent<ojChart<K, D, I, C>["orientation"]>;
    'otherThresholdChanged': JetElementCustomEvent<ojChart<K, D, I, C>["otherThreshold"]>;
    'overviewChanged': JetElementCustomEvent<ojChart<K, D, I, C>["overview"]>;
    'pieCenterChanged': JetElementCustomEvent<ojChart<K, D, I, C>["pieCenter"]>;
    'plotAreaChanged': JetElementCustomEvent<ojChart<K, D, I, C>["plotArea"]>;
    'polarGridShapeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["polarGridShape"]>;
    'selectionChanged': JetElementCustomEvent<ojChart<K, D, I, C>["selection"]>;
    'selectionModeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["selectionMode"]>;
    'seriesComparatorChanged': JetElementCustomEvent<ojChart<K, D, I, C>["seriesComparator"]>;
    'sortingChanged': JetElementCustomEvent<ojChart<K, D, I, C>["sorting"]>;
    'splitDualYChanged': JetElementCustomEvent<ojChart<K, D, I, C>["splitDualY"]>;
    'splitterPositionChanged': JetElementCustomEvent<ojChart<K, D, I, C>["splitterPosition"]>;
    'stackChanged': JetElementCustomEvent<ojChart<K, D, I, C>["stack"]>;
    'stackLabelChanged': JetElementCustomEvent<ojChart<K, D, I, C>["stackLabel"]>;
    'styleDefaultsChanged': JetElementCustomEvent<ojChart<K, D, I, C>["styleDefaults"]>;
    'timeAxisTypeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["timeAxisType"]>;
    'tooltipChanged': JetElementCustomEvent<ojChart<K, D, I, C>["tooltip"]>;
    'touchResponseChanged': JetElementCustomEvent<ojChart<K, D, I, C>["touchResponse"]>;
    'typeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["type"]>;
    'valueFormatsChanged': JetElementCustomEvent<ojChart<K, D, I, C>["valueFormats"]>;
    'xAxisChanged': JetElementCustomEvent<ojChart<K, D, I, C>["xAxis"]>;
    'y2AxisChanged': JetElementCustomEvent<ojChart<K, D, I, C>["y2Axis"]>;
    'yAxisChanged': JetElementCustomEvent<ojChart<K, D, I, C>["yAxis"]>;
    'zoomAndScrollChanged': JetElementCustomEvent<ojChart<K, D, I, C>["zoomAndScroll"]>;
    'zoomDirectionChanged': JetElementCustomEvent<ojChart<K, D, I, C>["zoomDirection"]>;
}
export interface ojChartSettableProperties<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends dvtBaseComponentSettableProperties {
    animationOnDataChange: 'auto' | 'slideToLeft' | 'slideToRight' | 'none';
    animationOnDisplay: 'auto' | 'alphaFade' | 'zoom' | 'none';
    as: string;
    coordinateSystem: 'polar' | 'cartesian';
    data: DataProvider<K, D> | null;
    dataCursor: 'off' | 'on' | 'auto';
    dataCursorBehavior: 'smooth' | 'snap' | 'auto';
    dataCursorPosition: {
        x: number | string;
        y: number;
        y2: number;
    };
    dataLabel: ((context: ojChart.DataLabelContext<K, D, I>) => (string[] | string | number[] | number));
    dnd: {
        drag: {
            groups: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: ojChart.DndGroup) => void);
            };
            items: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: ojChart.DndItem<K, D, I>) => void);
            };
            series: {
                dataTypes: string | string[];
                drag: ((param0: Event) => void);
                dragEnd: ((param0: Event) => void);
                dragStart: ((event: Event, context: ojChart.DndSeries<K, I>) => void);
            };
        };
        drop: {
            legend: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            plotArea: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            xAxis: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            y2Axis: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
            yAxis: {
                dataTypes: string | string[];
                dragEnter: ((event: Event, context: ojChart.DndDrop) => void);
                dragLeave: ((event: Event, context: ojChart.DndDrop) => void);
                dragOver: ((event: Event, context: ojChart.DndDrop) => void);
                drop: ((event: Event, context: ojChart.DndDrop) => void);
            };
        };
    };
    dragMode: 'pan' | 'zoom' | 'select' | 'off' | 'user';
    drilling: 'on' | 'seriesOnly' | 'groupsOnly' | 'off';
    groupComparator: ((context1: ojChart.GroupTemplateContext<D>, context2: ojChart.GroupTemplateContext<D>) => number);
    hiddenCategories: string[];
    hideAndShowBehavior: 'withRescale' | 'withoutRescale' | 'none';
    highlightMatch: 'any' | 'all';
    highlightedCategories: string[];
    hoverBehavior: 'dim' | 'none';
    initialZooming: 'first' | 'last' | 'none';
    legend: {
        backgroundColor: string;
        borderColor: string;
        maxSize: string;
        position: 'start' | 'end' | 'bottom' | 'top' | 'auto';
        referenceObjectSection: {
            title: string;
            titleHalign: 'center' | 'end' | 'start';
            titleStyle: CSSStyleDeclaration;
        };
        rendered: 'on' | 'off' | 'auto';
        scrolling: 'off' | 'asNeeded';
        sections: ojChart.LegendSection[];
        seriesSection: {
            title: string;
            titleHalign: 'center' | 'end' | 'start';
            titleStyle: CSSStyleDeclaration;
        };
        size: string;
        symbolHeight: number;
        symbolWidth: number;
        textStyle: CSSStyleDeclaration;
        title: string;
        titleHalign: 'center' | 'end' | 'start';
        titleStyle: CSSStyleDeclaration;
    };
    orientation: 'horizontal' | 'vertical';
    otherThreshold: number;
    overview: {
        content: C;
        height: string;
        rendered: 'on' | 'off';
    };
    pieCenter: {
        converter?: (Converter<number>);
        label: string;
        labelStyle: CSSStyleDeclaration;
        renderer: ((context: ojChart.PieCenterContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
        scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
    };
    plotArea: {
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        rendered: 'off' | 'on';
    };
    polarGridShape: 'polygon' | 'circle';
    selection: K[];
    selectionMode: 'none' | 'single' | 'multiple';
    seriesComparator: ((context1: ojChart.SeriesTemplateContext<D>, context2: ojChart.SeriesTemplateContext<D>) => number);
    sorting: 'ascending' | 'descending' | 'off';
    splitDualY: 'on' | 'off' | 'auto';
    splitterPosition: number;
    stack: 'on' | 'off';
    stackLabel: 'on' | 'off';
    styleDefaults: {
        animationDownColor: string;
        animationDuration: number;
        animationIndicators: 'none' | 'all';
        animationUpColor: string;
        barGapRatio: number;
        borderColor: string;
        borderWidth: number;
        boxPlot: {
            medianSvgClassName: string;
            medianSvgStyle: CSSStyleDeclaration;
            whiskerEndLength: string;
            whiskerEndSvgClassName: string;
            whiskerEndSvgStyle: CSSStyleDeclaration;
            whiskerSvgClassName: string;
            whiskerSvgStyle: CSSStyleDeclaration;
        };
        colors: string[];
        dataCursor: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            markerColor: string;
            markerDisplayed: 'off' | 'on';
            markerSize: number;
        };
        dataItemGaps: string;
        dataLabelCollision: 'fitInBounds' | 'none';
        dataLabelPosition: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        dataLabelStyle: CSSStyleDeclaration | CSSStyleDeclaration[];
        funnelBackgroundColor: string;
        groupSeparators: {
            color: string;
            rendered: 'off' | 'auto';
        };
        hoverBehaviorDelay: number;
        lineStyle: 'dotted' | 'dashed' | 'solid';
        lineType: 'straight' | 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'auto';
        lineWidth: number;
        markerColor: string;
        markerDisplayed: 'on' | 'off' | 'auto';
        markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
        markerSize: number;
        marqueeBorderColor: string;
        marqueeColor: string;
        maxBarWidth: number;
        otherColor: string;
        patterns: string[];
        pieFeelerColor: string;
        pieInnerRadius: number;
        selectionEffect: 'explode' | 'highlightAndExplode' | 'highlight';
        seriesEffect: 'color' | 'pattern' | 'gradient';
        shapes: string[];
        stackLabelStyle: CSSStyleDeclaration;
        stockFallingColor: string;
        stockRangeColor: string;
        stockRisingColor: string;
        stockVolumeColor: string;
        threeDEffect: 'on' | 'off';
        tooltipLabelStyle: CSSStyleDeclaration;
        tooltipValueStyle: CSSStyleDeclaration;
    };
    timeAxisType: 'enabled' | 'mixedFrequency' | 'skipGaps' | 'disabled' | 'auto';
    tooltip: {
        renderer: ((context: ojChart.TooltipContext<K, D, I>) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    touchResponse: 'touchStart' | 'auto';
    type: 'line' | 'area' | 'lineWithArea' | 'stock' | 'boxPlot' | 'combo' | 'pie' | 'scatter' | 'bubble' | 'funnel' | 'pyramid' | 'bar';
    valueFormats: {
        close: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        group: {
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string | string[];
        };
        high: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        label: {
            converter?: (Converter<string>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        };
        low: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        open: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        q1: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        q2: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        q3: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        series: {
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        targetValue: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        value: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        volume: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        x: {
            converter?: (Converter<string | number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        y: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        y2: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
        z: {
            converter?: (Converter<number>);
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            tooltipDisplay: 'off' | 'auto';
            tooltipLabel: string;
        };
    };
    xAxis: {
        axisLine: {
            lineColor: string;
            lineWidth: number;
            rendered: 'off' | 'on';
        };
        baselineScaling: 'min' | 'zero';
        dataMax: number;
        dataMin: number;
        majorTick: {
            baselineColor: 'inherit' | 'auto';
            baselineStyle: 'dotted' | 'dashed' | 'solid';
            baselineWidth: number;
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        max: number | string;
        maxSize: string;
        min: number | string;
        minStep: number;
        minorStep: number;
        minorTick: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        referenceObjects: Array<{
            categories: string[];
            color: string;
            displayInLegend: 'on' | 'off';
            high: number | string;
            id: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            location: 'front' | 'back';
            low: number | string;
            shortDesc: string;
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            text: string;
            type: 'area' | 'line';
            value: number | string;
        }>;
        rendered: 'off' | 'on';
        scale: 'log' | 'linear';
        size: string;
        step: number;
        tickLabel: {
            converter?: (Converter<string | number>);
            rendered: 'off' | 'on';
            rotation: 'none' | 'auto';
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            style: CSSStyleDeclaration;
        };
        title: string;
        titleStyle: CSSStyleDeclaration;
        viewportEndGroup: number | string;
        viewportMax: number | string;
        viewportMin: number | string;
        viewportStartGroup: number | string;
    };
    y2Axis: {
        alignTickMarks: 'off' | 'on';
        axisLine: {
            lineColor: string;
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        baselineScaling: 'min' | 'zero';
        dataMax: number;
        dataMin: number;
        majorTick: {
            baselineColor: 'inherit' | 'auto';
            baselineStyle: 'dotted' | 'dashed' | 'solid';
            baselineWidth: number;
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        max: number;
        maxSize: string;
        min: number;
        minStep: number;
        minorStep: number;
        minorTick: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        position: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects: Array<{
            categories: string[];
            color: string;
            displayInLegend: 'on' | 'off';
            high: number;
            id: string;
            items: Array<{
                high: number;
                low: number;
                value: number;
                x: number | string;
            }>;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineType: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight';
            lineWidth: number;
            location: 'front' | 'back';
            low: number;
            shortDesc: string;
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            text: string;
            type: 'area' | 'line';
            value: number;
        }>;
        rendered: 'off' | 'on';
        scale: 'log' | 'linear';
        size: string;
        step: number;
        tickLabel: {
            converter?: (Converter<number>);
            position: 'inside' | 'outside';
            rendered: 'off' | 'on';
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            style: CSSStyleDeclaration;
        };
        title: string;
        titleStyle: CSSStyleDeclaration;
    };
    yAxis: {
        axisLine: {
            lineColor: string;
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        baselineScaling: 'min' | 'zero';
        dataMax: number;
        dataMin: number;
        majorTick: {
            baselineColor: 'inherit' | 'auto';
            baselineStyle: 'dotted' | 'dashed' | 'solid';
            baselineWidth: number;
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        max: number;
        maxSize: string;
        min: number;
        minStep: number;
        minorStep: number;
        minorTick: {
            lineColor: string;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineWidth: number;
            rendered: 'on' | 'off' | 'auto';
        };
        position: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects: Array<{
            categories: string[];
            color: string;
            displayInLegend: 'on' | 'off';
            high: number;
            id: string;
            items: Array<{
                high: number;
                low: number;
                value: number;
                x: number | string;
            }>;
            lineStyle: 'dotted' | 'dashed' | 'solid';
            lineType: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight';
            lineWidth: number;
            location: 'front' | 'back';
            low: number;
            shortDesc: string;
            svgClassName: string;
            svgStyle: CSSStyleDeclaration;
            text: string;
            type: 'area' | 'line';
            value: number;
        }>;
        rendered: 'off' | 'on';
        scale: 'log' | 'linear';
        size: string;
        step: number;
        tickLabel: {
            converter?: (Converter<number>);
            position: 'inside' | 'outside';
            rendered: 'off' | 'on';
            scaling: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
            style: CSSStyleDeclaration;
        };
        title: string;
        titleStyle: CSSStyleDeclaration;
        viewportMax: number;
        viewportMin: number;
    };
    zoomAndScroll: 'delayedScrollOnly' | 'liveScrollOnly' | 'delayed' | 'live' | 'off';
    zoomDirection: 'x' | 'y' | 'auto';
    translations: {
        componentName?: string;
        labelAndValue?: string;
        labelClearSelection?: string;
        labelClose?: string;
        labelCountWithTotal?: string;
        labelDataVisualization?: string;
        labelDate?: string;
        labelDefaultGroupName?: string;
        labelGroup?: string;
        labelHigh?: string;
        labelInvalidData?: string;
        labelLow?: string;
        labelNoData?: string;
        labelOpen?: string;
        labelOther?: string;
        labelPercentage?: string;
        labelQ1?: string;
        labelQ2?: string;
        labelQ3?: string;
        labelSeries?: string;
        labelTargetValue?: string;
        labelValue?: string;
        labelVolume?: string;
        labelX?: string;
        labelY?: string;
        labelZ?: string;
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
        tooltipPan?: string;
        tooltipSelect?: string;
        tooltipZoom?: string;
    };
}
export interface ojChartSettablePropertiesLenient<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends Partial<ojChartSettableProperties<K, D, I, C>> {
    [key: string]: any;
}
export interface ojChartGroup extends JetElement<ojChartGroupSettableProperties> {
    drilling?: 'on' | 'off' | 'inherit';
    labelStyle?: CSSStyleDeclaration;
    name?: string;
    shortDesc?: string;
    addEventListener<T extends keyof ojChartGroupEventMap>(type: T, listener: (this: HTMLElement, ev: ojChartGroupEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojChartGroupSettableProperties>(property: T): ojChartGroup[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojChartGroupSettableProperties>(property: T, value: ojChartGroupSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojChartGroupSettableProperties>): void;
    setProperties(properties: ojChartGroupSettablePropertiesLenient): void;
}
export namespace ojChartGroup {
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojChartGroup["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojChartGroup["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nameChanged = JetElementCustomEvent<ojChartGroup["name"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojChartGroup["shortDesc"]>;
}
export interface ojChartGroupEventMap extends HTMLElementEventMap {
    'drillingChanged': JetElementCustomEvent<ojChartGroup["drilling"]>;
    'labelStyleChanged': JetElementCustomEvent<ojChartGroup["labelStyle"]>;
    'nameChanged': JetElementCustomEvent<ojChartGroup["name"]>;
    'shortDescChanged': JetElementCustomEvent<ojChartGroup["shortDesc"]>;
}
export interface ojChartGroupSettableProperties extends JetSettableProperties {
    drilling?: 'on' | 'off' | 'inherit';
    labelStyle?: CSSStyleDeclaration;
    name?: string;
    shortDesc?: string;
}
export interface ojChartGroupSettablePropertiesLenient extends Partial<ojChartGroupSettableProperties> {
    [key: string]: any;
}
export interface ojChartItem extends JetElement<ojChartItemSettableProperties> {
    borderColor?: string;
    borderWidth?: number;
    boxPlot?: ojChart.BoxPlotStyle;
    categories?: string[];
    close?: number;
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    groupId: Array<(string | number)>;
    high?: number;
    items?: (Array<ojChart.Item<any, null>> | number[]);
    label?: string | string[];
    labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
    labelStyle?: CSSStyleDeclaration | CSSStyleDeclaration[];
    low?: number;
    markerDisplayed?: 'on' | 'off' | 'auto';
    markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
    markerSize?: number;
    open?: number;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
    q1?: number;
    q2?: number;
    q3?: number;
    seriesId: string | number;
    shortDesc?: string;
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    targetValue?: number;
    value?: number;
    volume?: number;
    x?: number | string;
    y?: number;
    z?: number;
    addEventListener<T extends keyof ojChartItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojChartItemEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojChartItemSettableProperties>(property: T): ojChartItem[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojChartItemSettableProperties>(property: T, value: ojChartItemSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojChartItemSettableProperties>): void;
    setProperties(properties: ojChartItemSettablePropertiesLenient): void;
}
export namespace ojChartItem {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojChartItem["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged = JetElementCustomEvent<ojChartItem["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type boxPlotChanged = JetElementCustomEvent<ojChartItem["boxPlot"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojChartItem["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type closeChanged = JetElementCustomEvent<ojChartItem["close"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojChartItem["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojChartItem["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupIdChanged = JetElementCustomEvent<ojChartItem["groupId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highChanged = JetElementCustomEvent<ojChartItem["high"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemsChanged = JetElementCustomEvent<ojChartItem["items"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojChartItem["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged = JetElementCustomEvent<ojChartItem["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojChartItem["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lowChanged = JetElementCustomEvent<ojChartItem["low"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDisplayedChanged = JetElementCustomEvent<ojChartItem["markerDisplayed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged = JetElementCustomEvent<ojChartItem["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged = JetElementCustomEvent<ojChartItem["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type openChanged = JetElementCustomEvent<ojChartItem["open"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged = JetElementCustomEvent<ojChartItem["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q1Changed = JetElementCustomEvent<ojChartItem["q1"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q2Changed = JetElementCustomEvent<ojChartItem["q2"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q3Changed = JetElementCustomEvent<ojChartItem["q3"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesIdChanged = JetElementCustomEvent<ojChartItem["seriesId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojChartItem["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged = JetElementCustomEvent<ojChartItem["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged = JetElementCustomEvent<ojChartItem["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged = JetElementCustomEvent<ojChartItem["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged = JetElementCustomEvent<ojChartItem["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojChartItem["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojChartItem["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type targetValueChanged = JetElementCustomEvent<ojChartItem["targetValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojChartItem["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type volumeChanged = JetElementCustomEvent<ojChartItem["volume"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xChanged = JetElementCustomEvent<ojChartItem["x"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yChanged = JetElementCustomEvent<ojChartItem["y"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zChanged = JetElementCustomEvent<ojChartItem["z"]>;
}
export interface ojChartItemEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojChartItem["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojChartItem["borderWidth"]>;
    'boxPlotChanged': JetElementCustomEvent<ojChartItem["boxPlot"]>;
    'categoriesChanged': JetElementCustomEvent<ojChartItem["categories"]>;
    'closeChanged': JetElementCustomEvent<ojChartItem["close"]>;
    'colorChanged': JetElementCustomEvent<ojChartItem["color"]>;
    'drillingChanged': JetElementCustomEvent<ojChartItem["drilling"]>;
    'groupIdChanged': JetElementCustomEvent<ojChartItem["groupId"]>;
    'highChanged': JetElementCustomEvent<ojChartItem["high"]>;
    'itemsChanged': JetElementCustomEvent<ojChartItem["items"]>;
    'labelChanged': JetElementCustomEvent<ojChartItem["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojChartItem["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojChartItem["labelStyle"]>;
    'lowChanged': JetElementCustomEvent<ojChartItem["low"]>;
    'markerDisplayedChanged': JetElementCustomEvent<ojChartItem["markerDisplayed"]>;
    'markerShapeChanged': JetElementCustomEvent<ojChartItem["markerShape"]>;
    'markerSizeChanged': JetElementCustomEvent<ojChartItem["markerSize"]>;
    'openChanged': JetElementCustomEvent<ojChartItem["open"]>;
    'patternChanged': JetElementCustomEvent<ojChartItem["pattern"]>;
    'q1Changed': JetElementCustomEvent<ojChartItem["q1"]>;
    'q2Changed': JetElementCustomEvent<ojChartItem["q2"]>;
    'q3Changed': JetElementCustomEvent<ojChartItem["q3"]>;
    'seriesIdChanged': JetElementCustomEvent<ojChartItem["seriesId"]>;
    'shortDescChanged': JetElementCustomEvent<ojChartItem["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojChartItem["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojChartItem["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojChartItem["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojChartItem["sourceSelected"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojChartItem["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojChartItem["svgStyle"]>;
    'targetValueChanged': JetElementCustomEvent<ojChartItem["targetValue"]>;
    'valueChanged': JetElementCustomEvent<ojChartItem["value"]>;
    'volumeChanged': JetElementCustomEvent<ojChartItem["volume"]>;
    'xChanged': JetElementCustomEvent<ojChartItem["x"]>;
    'yChanged': JetElementCustomEvent<ojChartItem["y"]>;
    'zChanged': JetElementCustomEvent<ojChartItem["z"]>;
}
export interface ojChartItemSettableProperties extends JetSettableProperties {
    borderColor?: string;
    borderWidth?: number;
    boxPlot?: ojChart.BoxPlotStyle;
    categories?: string[];
    close?: number;
    color?: string;
    drilling?: 'on' | 'off' | 'inherit';
    groupId: Array<(string | number)>;
    high?: number;
    items?: (Array<ojChart.Item<any, null>> | number[]);
    label?: string | string[];
    labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
    labelStyle?: CSSStyleDeclaration | CSSStyleDeclaration[];
    low?: number;
    markerDisplayed?: 'on' | 'off' | 'auto';
    markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
    markerSize?: number;
    open?: number;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
    q1?: number;
    q2?: number;
    q3?: number;
    seriesId: string | number;
    shortDesc?: string;
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    targetValue?: number;
    value?: number;
    volume?: number;
    x?: number | string;
    y?: number;
    z?: number;
}
export interface ojChartItemSettablePropertiesLenient extends Partial<ojChartItemSettableProperties> {
    [key: string]: any;
}
export interface ojChartSeries extends JetElement<ojChartSeriesSettableProperties> {
    areaColor?: string;
    areaSvgClassName?: string;
    areaSvgStyle?: CSSStyleDeclaration;
    assignedToY2?: 'on' | 'off';
    borderColor?: string;
    borderWidth?: number;
    boxPlot?: ojChart.BoxPlotStyle;
    categories?: string[];
    color?: string;
    displayInLegend?: 'on' | 'off' | 'auto';
    drilling?: 'on' | 'off' | 'inherit';
    lineStyle?: 'dotted' | 'dashed' | 'solid';
    lineType?: 'straight' | 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'auto';
    lineWidth?: number;
    markerColor?: string;
    markerDisplayed?: 'on' | 'off' | 'auto';
    markerShape?: 'auto' | 'square' | 'circle' | 'diamond' | 'plus' | 'triangleDown' | 'triangleUp' | 'human' | 'star' | string;
    markerSize?: number;
    markerSvgClassName?: string;
    markerSvgStyle?: CSSStyleDeclaration;
    name?: string;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
    pieSliceExplode?: number;
    shortDesc?: string;
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    stackCategory?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    type?: 'bar' | 'line' | 'area' | 'lineWithArea' | 'candlestick' | 'boxPlot' | 'auto';
    addEventListener<T extends keyof ojChartSeriesEventMap>(type: T, listener: (this: HTMLElement, ev: ojChartSeriesEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojChartSeriesSettableProperties>(property: T): ojChartSeries[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojChartSeriesSettableProperties>(property: T, value: ojChartSeriesSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojChartSeriesSettableProperties>): void;
    setProperties(properties: ojChartSeriesSettablePropertiesLenient): void;
}
export namespace ojChartSeries {
    // tslint:disable-next-line interface-over-type-literal
    type areaColorChanged = JetElementCustomEvent<ojChartSeries["areaColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaSvgClassNameChanged = JetElementCustomEvent<ojChartSeries["areaSvgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaSvgStyleChanged = JetElementCustomEvent<ojChartSeries["areaSvgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type assignedToY2Changed = JetElementCustomEvent<ojChartSeries["assignedToY2"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojChartSeries["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged = JetElementCustomEvent<ojChartSeries["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type boxPlotChanged = JetElementCustomEvent<ojChartSeries["boxPlot"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged = JetElementCustomEvent<ojChartSeries["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojChartSeries["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayInLegendChanged = JetElementCustomEvent<ojChartSeries["displayInLegend"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojChartSeries["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineStyleChanged = JetElementCustomEvent<ojChartSeries["lineStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineTypeChanged = JetElementCustomEvent<ojChartSeries["lineType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineWidthChanged = JetElementCustomEvent<ojChartSeries["lineWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerColorChanged = JetElementCustomEvent<ojChartSeries["markerColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDisplayedChanged = JetElementCustomEvent<ojChartSeries["markerDisplayed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged = JetElementCustomEvent<ojChartSeries["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged = JetElementCustomEvent<ojChartSeries["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSvgClassNameChanged = JetElementCustomEvent<ojChartSeries["markerSvgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSvgStyleChanged = JetElementCustomEvent<ojChartSeries["markerSvgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nameChanged = JetElementCustomEvent<ojChartSeries["name"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged = JetElementCustomEvent<ojChartSeries["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pieSliceExplodeChanged = JetElementCustomEvent<ojChartSeries["pieSliceExplode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojChartSeries["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged = JetElementCustomEvent<ojChartSeries["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged = JetElementCustomEvent<ojChartSeries["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged = JetElementCustomEvent<ojChartSeries["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged = JetElementCustomEvent<ojChartSeries["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stackCategoryChanged = JetElementCustomEvent<ojChartSeries["stackCategory"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojChartSeries["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojChartSeries["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojChartSeries["type"]>;
}
export interface ojChartSeriesEventMap extends HTMLElementEventMap {
    'areaColorChanged': JetElementCustomEvent<ojChartSeries["areaColor"]>;
    'areaSvgClassNameChanged': JetElementCustomEvent<ojChartSeries["areaSvgClassName"]>;
    'areaSvgStyleChanged': JetElementCustomEvent<ojChartSeries["areaSvgStyle"]>;
    'assignedToY2Changed': JetElementCustomEvent<ojChartSeries["assignedToY2"]>;
    'borderColorChanged': JetElementCustomEvent<ojChartSeries["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojChartSeries["borderWidth"]>;
    'boxPlotChanged': JetElementCustomEvent<ojChartSeries["boxPlot"]>;
    'categoriesChanged': JetElementCustomEvent<ojChartSeries["categories"]>;
    'colorChanged': JetElementCustomEvent<ojChartSeries["color"]>;
    'displayInLegendChanged': JetElementCustomEvent<ojChartSeries["displayInLegend"]>;
    'drillingChanged': JetElementCustomEvent<ojChartSeries["drilling"]>;
    'lineStyleChanged': JetElementCustomEvent<ojChartSeries["lineStyle"]>;
    'lineTypeChanged': JetElementCustomEvent<ojChartSeries["lineType"]>;
    'lineWidthChanged': JetElementCustomEvent<ojChartSeries["lineWidth"]>;
    'markerColorChanged': JetElementCustomEvent<ojChartSeries["markerColor"]>;
    'markerDisplayedChanged': JetElementCustomEvent<ojChartSeries["markerDisplayed"]>;
    'markerShapeChanged': JetElementCustomEvent<ojChartSeries["markerShape"]>;
    'markerSizeChanged': JetElementCustomEvent<ojChartSeries["markerSize"]>;
    'markerSvgClassNameChanged': JetElementCustomEvent<ojChartSeries["markerSvgClassName"]>;
    'markerSvgStyleChanged': JetElementCustomEvent<ojChartSeries["markerSvgStyle"]>;
    'nameChanged': JetElementCustomEvent<ojChartSeries["name"]>;
    'patternChanged': JetElementCustomEvent<ojChartSeries["pattern"]>;
    'pieSliceExplodeChanged': JetElementCustomEvent<ojChartSeries["pieSliceExplode"]>;
    'shortDescChanged': JetElementCustomEvent<ojChartSeries["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojChartSeries["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojChartSeries["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojChartSeries["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojChartSeries["sourceSelected"]>;
    'stackCategoryChanged': JetElementCustomEvent<ojChartSeries["stackCategory"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojChartSeries["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojChartSeries["svgStyle"]>;
    'typeChanged': JetElementCustomEvent<ojChartSeries["type"]>;
}
export interface ojChartSeriesSettableProperties extends JetSettableProperties {
    areaColor?: string;
    areaSvgClassName?: string;
    areaSvgStyle?: CSSStyleDeclaration;
    assignedToY2?: 'on' | 'off';
    borderColor?: string;
    borderWidth?: number;
    boxPlot?: ojChart.BoxPlotStyle;
    categories?: string[];
    color?: string;
    displayInLegend?: 'on' | 'off' | 'auto';
    drilling?: 'on' | 'off' | 'inherit';
    lineStyle?: 'dotted' | 'dashed' | 'solid';
    lineType?: 'straight' | 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'auto';
    lineWidth?: number;
    markerColor?: string;
    markerDisplayed?: 'on' | 'off' | 'auto';
    markerShape?: 'auto' | 'square' | 'circle' | 'diamond' | 'plus' | 'triangleDown' | 'triangleUp' | 'human' | 'star' | string;
    markerSize?: number;
    markerSvgClassName?: string;
    markerSvgStyle?: CSSStyleDeclaration;
    name?: string;
    pattern?: 'smallChecker' | 'smallCrosshatch' | 'smallDiagonalLeft' | 'smallDiagonalRight' | 'smallDiamond' | 'smallTriangle' | 'largeChecker' | 'largeCrosshatch' | 'largeDiagonalLeft' |
       'largeDiagonalRight' | 'largeDiamond' | 'largeTriangle' | 'auto';
    pieSliceExplode?: number;
    shortDesc?: string;
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    stackCategory?: string;
    svgClassName?: string;
    svgStyle?: CSSStyleDeclaration;
    type?: 'bar' | 'line' | 'area' | 'lineWithArea' | 'candlestick' | 'boxPlot' | 'auto';
}
export interface ojChartSeriesSettablePropertiesLenient extends Partial<ojChartSeriesSettableProperties> {
    [key: string]: any;
}
export interface ojSparkChart<K, D extends ojSparkChart.Item | any> extends dvtBaseComponent<ojSparkChartSettableProperties<K, D>> {
    animationDuration: number | null;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    areaColor: string;
    areaSvgClassName: string;
    areaSvgStyle: CSSStyleDeclaration;
    as: string;
    barGapRatio: number;
    baselineScaling: 'zero' | 'min';
    color: string;
    data: DataProvider<K, D> | null;
    firstColor: string;
    highColor: string;
    lastColor: string;
    lineStyle: 'dotted' | 'dashed' | 'solid';
    lineType: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight';
    lineWidth: number;
    lowColor: string;
    markerShape: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize: number;
    referenceObjects: ojSparkChart.ReferenceObject[];
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    tooltip: {
        renderer: ((context: ojSparkChart.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    type: 'area' | 'lineWithArea' | 'bar' | 'line';
    visualEffects: 'none' | 'auto';
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
    addEventListener<T extends keyof ojSparkChartEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojSparkChartEventMap<K, D>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSparkChartSettableProperties<K, D>>(property: T): ojSparkChart<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSparkChartSettableProperties<K, D>>(property: T, value: ojSparkChartSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSparkChartSettableProperties<K, D>>): void;
    setProperties(properties: ojSparkChartSettablePropertiesLenient<K, D>): void;
}
export namespace ojSparkChart {
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaColorChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["areaColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaSvgClassNameChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["areaSvgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaSvgStyleChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["areaSvgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type barGapRatioChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["barGapRatio"]>;
    // tslint:disable-next-line interface-over-type-literal
    type baselineScalingChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["baselineScaling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type firstColorChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["firstColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highColorChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["highColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lastColorChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lastColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineStyleChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lineStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineTypeChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lineType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineWidthChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lineWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lowColorChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lowColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged<K, D extends Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["visualEffects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Item = {
        borderColor: string;
        color: string;
        date: Date;
        high: number;
        low: number;
        markerDisplayed: 'on' | 'off';
        markerShape: 'square' | 'circle' | 'diamond' | 'plus' | 'triangleDown' | 'triangleUp' | 'human' | 'star' | 'auto' | string;
        markerSize: number;
        svgClassName: string;
        svgStyle: CSSStyleDeclaration;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext = {
        borderColor: string;
        color: string;
        date: Date;
        high: number;
        low: number;
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext = {
        componentElement: Element;
        data: object;
        index: number;
        key: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        color?: string;
        high?: number;
        lineWidth?: number;
        lineStyle: 'dotted' | 'dashed' | 'solid';
        location: 'front' | 'back';
        low?: number;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
        type: 'area' | 'line';
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        parentElement: Element;
    };
}
export interface ojSparkChartEventMap<K, D extends ojSparkChart.Item | any> extends dvtBaseComponentEventMap<ojSparkChartSettableProperties<K, D>> {
    'animationDurationChanged': JetElementCustomEvent<ojSparkChart<K, D>["animationDuration"]>;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojSparkChart<K, D>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojSparkChart<K, D>["animationOnDisplay"]>;
    'areaColorChanged': JetElementCustomEvent<ojSparkChart<K, D>["areaColor"]>;
    'areaSvgClassNameChanged': JetElementCustomEvent<ojSparkChart<K, D>["areaSvgClassName"]>;
    'areaSvgStyleChanged': JetElementCustomEvent<ojSparkChart<K, D>["areaSvgStyle"]>;
    'asChanged': JetElementCustomEvent<ojSparkChart<K, D>["as"]>;
    'barGapRatioChanged': JetElementCustomEvent<ojSparkChart<K, D>["barGapRatio"]>;
    'baselineScalingChanged': JetElementCustomEvent<ojSparkChart<K, D>["baselineScaling"]>;
    'colorChanged': JetElementCustomEvent<ojSparkChart<K, D>["color"]>;
    'dataChanged': JetElementCustomEvent<ojSparkChart<K, D>["data"]>;
    'firstColorChanged': JetElementCustomEvent<ojSparkChart<K, D>["firstColor"]>;
    'highColorChanged': JetElementCustomEvent<ojSparkChart<K, D>["highColor"]>;
    'lastColorChanged': JetElementCustomEvent<ojSparkChart<K, D>["lastColor"]>;
    'lineStyleChanged': JetElementCustomEvent<ojSparkChart<K, D>["lineStyle"]>;
    'lineTypeChanged': JetElementCustomEvent<ojSparkChart<K, D>["lineType"]>;
    'lineWidthChanged': JetElementCustomEvent<ojSparkChart<K, D>["lineWidth"]>;
    'lowColorChanged': JetElementCustomEvent<ojSparkChart<K, D>["lowColor"]>;
    'markerShapeChanged': JetElementCustomEvent<ojSparkChart<K, D>["markerShape"]>;
    'markerSizeChanged': JetElementCustomEvent<ojSparkChart<K, D>["markerSize"]>;
    'referenceObjectsChanged': JetElementCustomEvent<ojSparkChart<K, D>["referenceObjects"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojSparkChart<K, D>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojSparkChart<K, D>["svgStyle"]>;
    'tooltipChanged': JetElementCustomEvent<ojSparkChart<K, D>["tooltip"]>;
    'typeChanged': JetElementCustomEvent<ojSparkChart<K, D>["type"]>;
    'visualEffectsChanged': JetElementCustomEvent<ojSparkChart<K, D>["visualEffects"]>;
}
export interface ojSparkChartSettableProperties<K, D extends ojSparkChart.Item | any> extends dvtBaseComponentSettableProperties {
    animationDuration: number | null;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    areaColor: string;
    areaSvgClassName: string;
    areaSvgStyle: CSSStyleDeclaration;
    as: string;
    barGapRatio: number;
    baselineScaling: 'zero' | 'min';
    color: string;
    data: DataProvider<K, D> | null;
    firstColor: string;
    highColor: string;
    lastColor: string;
    lineStyle: 'dotted' | 'dashed' | 'solid';
    lineType: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight';
    lineWidth: number;
    lowColor: string;
    markerShape: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize: number;
    referenceObjects: ojSparkChart.ReferenceObject[];
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    tooltip: {
        renderer: ((context: ojSparkChart.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    type: 'area' | 'lineWithArea' | 'bar' | 'line';
    visualEffects: 'none' | 'auto';
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
export interface ojSparkChartSettablePropertiesLenient<K, D extends ojSparkChart.Item | any> extends Partial<ojSparkChartSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojSparkChartItem extends JetElement<ojSparkChartItemSettableProperties> {
    borderColor: string;
    color: string;
    date: string;
    high: number | null;
    low: number | null;
    markerDisplayed: 'off' | 'on';
    markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize: number;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    value: number | null;
    addEventListener<T extends keyof ojSparkChartItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojSparkChartItemEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSparkChartItemSettableProperties>(property: T): ojSparkChartItem[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSparkChartItemSettableProperties>(property: T, value: ojSparkChartItemSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSparkChartItemSettableProperties>): void;
    setProperties(properties: ojSparkChartItemSettablePropertiesLenient): void;
}
export namespace ojSparkChartItem {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojSparkChartItem["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojSparkChartItem["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dateChanged = JetElementCustomEvent<ojSparkChartItem["date"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highChanged = JetElementCustomEvent<ojSparkChartItem["high"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lowChanged = JetElementCustomEvent<ojSparkChartItem["low"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDisplayedChanged = JetElementCustomEvent<ojSparkChartItem["markerDisplayed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged = JetElementCustomEvent<ojSparkChartItem["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged = JetElementCustomEvent<ojSparkChartItem["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojSparkChartItem["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojSparkChartItem["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSparkChartItem["value"]>;
}
export interface ojSparkChartItemEventMap extends HTMLElementEventMap {
    'borderColorChanged': JetElementCustomEvent<ojSparkChartItem["borderColor"]>;
    'colorChanged': JetElementCustomEvent<ojSparkChartItem["color"]>;
    'dateChanged': JetElementCustomEvent<ojSparkChartItem["date"]>;
    'highChanged': JetElementCustomEvent<ojSparkChartItem["high"]>;
    'lowChanged': JetElementCustomEvent<ojSparkChartItem["low"]>;
    'markerDisplayedChanged': JetElementCustomEvent<ojSparkChartItem["markerDisplayed"]>;
    'markerShapeChanged': JetElementCustomEvent<ojSparkChartItem["markerShape"]>;
    'markerSizeChanged': JetElementCustomEvent<ojSparkChartItem["markerSize"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojSparkChartItem["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojSparkChartItem["svgStyle"]>;
    'valueChanged': JetElementCustomEvent<ojSparkChartItem["value"]>;
}
export interface ojSparkChartItemSettableProperties extends JetSettableProperties {
    borderColor: string;
    color: string;
    date: string;
    high: number | null;
    low: number | null;
    markerDisplayed: 'off' | 'on';
    markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize: number;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    value: number | null;
}
export interface ojSparkChartItemSettablePropertiesLenient extends Partial<ojSparkChartItemSettableProperties> {
    [key: string]: any;
}
