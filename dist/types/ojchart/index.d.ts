import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import Converter = require('../ojconverter');
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojChart<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends dvtBaseComponent<ojChartSettableProperties<K, D, I, C>> {
    animationOnDataChange?: 'slideToLeft' | 'slideToRight' | 'auto' | 'none';
    animationOnDisplay?: 'alphaFade' | 'zoom' | 'auto' | 'none';
    as?: string;
    comboSeriesOrder?: 'data' | 'seriesType';
    coordinateSystem?: 'polar' | 'cartesian';
    data: DataProvider<K, D> | null;
    dataCursor?: 'off' | 'on' | 'auto';
    dataCursorBehavior?: 'smooth' | 'snap' | 'auto';
    dataCursorPosition?: ojChart.DataCursorPosition;
    dataLabel?: ((context: ojChart.DataLabelContext<K, D, I>) => (string[] | string | number[] | number));
    dnd?: {
        drag?: ojChart.DndDragConfigs<K, D, I>;
        drop?: ojChart.DndDropConfigs;
    };
    dragMode?: 'pan' | 'zoom' | 'select' | 'off' | 'user';
    drilling?: 'on' | 'seriesOnly' | 'groupsOnly' | 'off';
    groupComparator?: ((context1: ojChart.GroupTemplateContext<D>, context2: ojChart.GroupTemplateContext<D>) => number);
    hiddenCategories?: string[];
    hideAndShowBehavior?: 'withRescale' | 'withoutRescale' | 'none';
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    initialZooming?: 'first' | 'last' | 'none';
    legend?: ojChart.Legend;
    multiSeriesDrilling?: 'on' | 'off';
    orientation?: 'horizontal' | 'vertical';
    otherThreshold?: number;
    overview?: ojChart.Overview<C>;
    pieCenter?: ojChart.PieCenter;
    plotArea?: ojChart.PlotArea;
    polarGridShape?: 'polygon' | 'circle';
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    seriesComparator?: ((context1: ojChart.SeriesTemplateContext<D>, context2: ojChart.SeriesTemplateContext<D>) => number);
    sorting?: 'ascending' | 'descending' | 'off';
    splitDualY?: 'on' | 'off' | 'auto';
    splitterPosition?: number;
    stack?: 'on' | 'off';
    stackLabel?: 'on' | 'off';
    stackLabelProvider?: ((context: ojChart.StackLabelContext<K, D, I>) => (string));
    styleDefaults?: ojChart.StyleDefaults;
    timeAxisType?: 'enabled' | 'mixedFrequency' | 'skipGaps' | 'disabled' | 'auto';
    tooltip?: {
        renderer: dvtBaseComponent.PreventableDOMRendererFunction<ojChart.TooltipRendererContext<K, D, I>>;
    };
    touchResponse?: 'touchStart' | 'auto';
    type?: ojChart.ChartType;
    valueFormats?: ojChart.ValueFormats;
    xAxis?: ojChart.XAxis;
    y2Axis?: ojChart.Y2Axis;
    yAxis?: ojChart.YAxis;
    zoomAndScroll?: 'delayedScrollOnly' | 'liveScrollOnly' | 'delayed' | 'live' | 'off';
    zoomDirection?: 'x' | 'y' | 'auto';
    translations: {
        accessibleContainsControls?: string;
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
        stateLoaded?: string;
        stateLoading?: string;
        stateMaximized?: string;
        stateMinimized?: string;
        stateSelected?: string;
        stateUnselected?: string;
        stateVisible?: string;
        tooltipPan?: string;
        tooltipSelect?: string;
        tooltipZoom?: string;
    };
    addEventListener<T extends keyof ojChartEventMap<K, D, I, C>>(type: T, listener: (this: HTMLElement, ev: ojChartEventMap<K, D, I, C>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojChartSettableProperties<K, D, I, C>>(property: T): ojChart<K, D, I, C>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojChartSettableProperties<K, D, I, C>>(property: T, value: ojChartSettableProperties<K, D, I, C>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojChartSettableProperties<K, D, I, C>>): void;
    setProperties(properties: ojChartSettablePropertiesLenient<K, D, I, C>): void;
    getAutomation(): any;
    getContextByNode(node: Element): ojChart.PieCenterLabelContext | ojChart.LegendItemContext | ojChart.ReferenceObject | ojChart.GroupContext | ojChart.AxisTitleContext | ojChart.ItemContext |
       ojChart.SeriesContext;
    getLegend(): {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    getPlotArea(): {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    getValuesAt(x: number, y: number): {
        x: number | string | null;
        y: number | null;
        y2: number | null;
    };
    getXAxis(): {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        getPreferredSize(width: number, height: number): {
            width: number;
            height: number;
        };
    };
    getY2Axis(): {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        getPreferredSize(width: number, height: number): {
            width: number;
            height: number;
        };
    };
    getYAxis(): {
        bounds: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        getPreferredSize(width: number, height: number): {
            width: number;
            height: number;
        };
    };
}
export namespace ojChart {
    interface ojDrill<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        data: Item<K, I> | number | null;
        group: string;
        groupData: Group[] | null;
        id: string;
        itemData: D;
        series: string;
        seriesData: Series<K, I> | null;
        [propName: string]: any;
    }> {
    }
    interface ojGroupDrill<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        group: string | string[];
        groupData: Group[];
        id: string;
        items: Array<DrillItem<K, D, I>>;
        [propName: string]: any;
    }> {
    }
    interface ojItemDrill<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        data: Item<K, I> | number;
        group: string | string[];
        groupData: Group[];
        id: string;
        itemData: D;
        series: string;
        seriesData: Series<K, I>;
        [propName: string]: any;
    }> {
    }
    interface ojMultiSeriesDrill<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        items: Array<DrillItem<K, D, I>>;
        series: string[];
        seriesData: Series<K, I>;
        [propName: string]: any;
    }> {
    }
    interface ojSelectInput<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        endGroup: string;
        items: string[];
        selectionData: Array<{
            data: Item<K, I> | number;
            groupData: Group[];
            itemData: D;
            seriesData: Series<K, I>;
        }>;
        startGroup: string;
        xMax: number;
        xMin: number;
        yMax: number;
        yMin: number;
        [propName: string]: any;
    }> {
    }
    interface ojSeriesDrill<K, D, I extends Array<Item<any, null>> | number[] | null> extends CustomEvent<{
        id: string;
        items: Array<DrillItem<K, D, I>>;
        series: string;
        seriesData: Series<K, I>;
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
    type comboSeriesOrderChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["comboSeriesOrder"]>;
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
    type multiSeriesDrillingChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["multiSeriesDrilling"]>;
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
    type stackLabelProviderChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["stackLabelProvider"]>;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends DataItem<I> | any, I extends Array<Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = dvtBaseComponent.trackResizeChanged<ojChartSettableProperties<K, D, I, C>>;
    // tslint:disable-next-line interface-over-type-literal
    type AxisLine = {
        lineColor?: string;
        lineWidth?: number;
        rendered?: 'off' | 'on' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type AxisTitleContext = {
        axis: 'xAxis' | 'yAxis' | 'y2Axis';
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type BoxPlotDefaults = {
        medianSvgClassName?: string;
        medianSvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerEndLength?: string;
        whiskerEndSvgClassName?: string;
        whiskerEndSvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerSvgClassName?: string;
        whiskerSvgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type BoxPlotStyle = {
        medianSvgClassName?: string;
        medianSvgStyle?: Partial<CSSStyleDeclaration>;
        q2Color?: string;
        q2SvgClassName?: string;
        q2SvgStyle?: Partial<CSSStyleDeclaration>;
        q3Color?: string;
        q3SvgClassName?: string;
        q3SvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerEndLength?: string;
        whiskerEndSvgClassName?: string;
        whiskerEndSvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerSvgClassName?: string;
        whiskerSvgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CategoricalValueFormat<T extends string | number = string | number> = {
        converter?: (Converter<T>);
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ChartType = 'line' | 'area' | 'lineWithArea' | 'bar' | 'stock' | 'boxPlot' | 'combo' | 'pie' | 'scatter' | 'bubble' | 'funnel' | 'pyramid';
    // tslint:disable-next-line interface-over-type-literal
    type DataCursorDefaults = {
        lineColor?: string;
        lineStyle?: LineStyle;
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'off' | 'on';
        markerSize?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataCursorPosition<T extends number | string = number | string> = {
        x?: T;
        y?: number;
        y2?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataItem<I extends Array<Item<any, null>> | number[] | null, K = any, D = any> = {
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: BoxPlotStyle;
        categories?: string[];
        close?: number;
        color?: string;
        drilling?: 'on' | 'off' | 'inherit';
        groupId: Array<(string | number)>;
        high?: number;
        label?: string | string[];
        labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        labelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
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
        shortDesc?: (string | ((context: ItemShortDescContext<K, D, I>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        targetValue?: number;
        value?: number;
        volume?: number;
        x?: number | string;
        y?: number;
        z?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataLabelContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        close: number;
        componentElement: Element;
        data: Item<K, Array<Item<any, null>> | number[] | null> | number | null;
        dimensions: {
            height: number;
            width: number;
        };
        group: string | string[];
        groupData: Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDragConfig<T> = {
        dataTypes?: string | string[];
        drag?: ((param0: Event) => void);
        dragEnd?: ((param0: Event) => void);
        dragStart?: ((event: Event, context: T) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDragConfigs<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        groups?: DndDragConfig<DndGroup>;
        items?: DndDragConfig<DndItem<K, D, I>>;
        series?: DndDragConfig<DndSeries<K, I>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDrop = {
        x: number | null;
        y: number | null;
        y2: number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDropConfig = {
        dataTypes?: string | string[];
        dragEnter?: ((event: Event, context: DndDrop) => void);
        dragLeave?: ((event: Event, context: DndDrop) => void);
        dragOver?: ((event: Event, context: DndDrop) => void);
        drop?: ((event: Event, context: DndDrop) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDropConfigs = {
        legend?: DndDropConfig;
        plotArea?: DndDropConfig;
        xAxis?: DndDropConfig;
        y2Axis?: DndDropConfig;
        yAxis?: DndDropConfig;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndGroup = {
        group: string | number | Array<(string | number)>;
        id: string | number | Array<(string | number)>;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndItem<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        item: Array<DataLabelContext<K, D, I>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndSeries<K, I extends Array<Item<any, null>> | number[] | null> = {
        color: string;
        componentElement: any;
        id: string | number;
        series: string | number;
        seriesData: Series<K, I>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DrillItem<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        data: Item<K, Array<Item<any, null>> | number[] | null> | number;
        group: string | string[];
        id: K;
        itemData: D;
        series: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Group = {
        drilling?: 'on' | 'off' | 'inherit';
        groups?: Group[];
        id?: string | number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        name?: string;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupContext = {
        indexPath: any[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupSeparatorDefaults = {
        color?: string;
        rendered?: 'off' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupTemplateContext<D> = {
        componentElement: Element;
        depth: number;
        ids: string[];
        index: number;
        items: Array<{
            data: D;
            index: number;
            key: any;
        }>;
        leaf: boolean;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupValueFormat = {
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string | string[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type Item<K, I extends Array<Item<any, null>> | number[] | null, D = any> = {
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: BoxPlotStyle;
        categories?: string[];
        close?: number;
        color?: string;
        drilling?: 'on' | 'off' | 'inherit';
        high?: number;
        id: K;
        items?: I;
        label?: string | string[];
        labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        labelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
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
        shortDesc?: (string | ((context: ItemShortDescContext<K, D, I>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        targetValue?: number;
        value?: number;
        volume?: number;
        x?: number | string;
        y?: number;
        z?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext = {
        itemIndex: number;
        seriesIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemShortDescContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        close: number;
        data: Item<K, Array<Item<any, null>> | number[] | null> | number | null;
        group: string | string[];
        groupData: Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        index: number;
        key: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LabelValueFormat = {
        converter?: (Converter<string>);
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Legend = {
        backgroundColor?: string;
        borderColor?: string;
        maxSize?: string;
        position?: 'start' | 'end' | 'bottom' | 'top' | 'auto';
        referenceObjectSection?: LegendReferenceObjectSection;
        rendered?: 'on' | 'off' | 'auto';
        scrolling?: 'off' | 'asNeeded';
        sectionTitleHalign?: 'center' | 'end' | 'start';
        sectionTitleStyle?: Partial<CSSStyleDeclaration>;
        sections?: LegendSection[];
        seriesSection?: LegendSeriesSection;
        size?: string;
        symbolHeight?: number;
        symbolWidth?: number;
        textStyle?: Partial<CSSStyleDeclaration>;
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
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
        text: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendItemContext = {
        itemIndex: number;
        sectionIndexPath: any[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendReferenceObjectSection = {
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendSection = {
        items?: LegendItem[];
        sections?: LegendSection[];
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendSeriesSection = {
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LineStyle = 'dotted' | 'dashed' | 'solid';
    // tslint:disable-next-line interface-over-type-literal
    type LineType = 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight';
    // tslint:disable-next-line interface-over-type-literal
    type MajorTick = {
        baselineColor?: 'inherit' | 'auto' | string;
        baselineStyle?: LineStyle;
        baselineWidth?: number;
        lineColor?: string;
        lineStyle?: LineStyle;
        lineWidth?: number;
        rendered?: 'off' | 'on' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type MinorTick = {
        lineColor?: string;
        lineStyle?: LineStyle;
        lineWidth?: number;
        rendered?: 'off' | 'on' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NumericValueFormat = {
        converter?: (Converter<number>);
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Overview<C> = {
        content?: C;
        height?: string;
        rendered?: 'on' | 'off';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenter = {
        converter?: (Converter<number>);
        label?: number | string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        renderer?: dvtBaseComponent.PreventableDOMRendererFunction<PieCenterRendererContext>;
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterContext = {
        componentElement: Element;
        innerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        label: string;
        labelStyle: Partial<CSSStyleDeclaration>;
        outerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        totalValue: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterLabelContext = {
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterRendererContext = {
        componentElement: Element;
        innerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        label: string;
        labelStyle: Partial<CSSStyleDeclaration>;
        outerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        totalValue: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PlotArea = {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        rendered?: 'off' | 'on';
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        axis: 'xAxis' | 'yAxis' | 'y2Axis';
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObjectItem<T extends number | string = number | string> = {
        high?: number;
        low?: number;
        value?: number;
        x?: T;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Series<K, I extends Array<Item<any, null>> | number[] | null> = {
        areaColor?: string;
        areaSvgClassName?: string;
        areaSvgStyle?: Partial<CSSStyleDeclaration>;
        assignedToY2?: 'on' | 'off';
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: BoxPlotStyle;
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off' | 'auto';
        drilling?: 'on' | 'off' | 'inherit';
        id?: string | number;
        items?: (Array<Item<K, Array<Item<any, null>> | number[] | null>> | number[]);
        lineStyle?: LineStyle;
        lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight' | 'auto';
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
        markerSize?: number;
        markerSvgClassName?: string;
        markerSvgStyle?: Partial<CSSStyleDeclaration>;
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
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'line' | 'area' | 'lineWithArea' | 'bar' | 'candlestick' | 'boxPlot' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesContext = {
        itemIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesTemplateContext<D> = {
        componentElement: Element;
        id: string;
        index: number;
        items: Array<{
            data: D;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesValueFormat = {
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type StackLabelContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        data: Array<Item<K, Array<Item<any, null>> | number[] | null> | number | null>;
        groupData: Group[] | null;
        groups: string | string[];
        itemData: D[];
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type StyleDefaults = {
        animationDownColor?: string;
        animationDuration?: number;
        animationIndicators?: 'none' | 'all';
        animationUpColor?: string;
        barGapRatio?: number;
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: BoxPlotDefaults;
        colors?: string[];
        dataCursor?: DataCursorDefaults;
        dataItemGaps?: string;
        dataLabelCollision?: 'fitInBounds' | 'none';
        dataLabelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        dataLabelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
        funnelBackgroundColor?: string;
        groupSeparators?: GroupSeparatorDefaults;
        hoverBehaviorDelay?: number;
        lineStyle?: LineStyle;
        lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight' | 'none' | 'auto';
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
        markerSize?: number;
        marqueeBorderColor?: string;
        marqueeColor?: string;
        maxBarWidth?: number;
        otherColor?: string;
        patterns?: string[];
        pieFeelerColor?: string;
        pieInnerRadius?: number;
        selectionEffect?: 'explode' | 'highlightAndExplode' | 'highlight';
        seriesEffect?: 'color' | 'pattern' | 'gradient';
        shapes?: string[];
        stackLabelStyle?: Partial<CSSStyleDeclaration>;
        stockFallingColor?: string;
        stockRangeColor?: string;
        stockRisingColor?: string;
        stockVolumeColor?: string;
        threeDEffect?: 'on' | 'off';
        tooltipLabelStyle?: Partial<CSSStyleDeclaration>;
        tooltipValueStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        close: number;
        color: string;
        componentElement: Element;
        data: Item<K, Array<Item<any, null>> | number[] | null> | number | null;
        group: string | string[];
        groupData: Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        parentElement: Element;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K, D, I extends Array<Item<any, null>> | number[] | null> = {
        close: number;
        color: string;
        componentElement: Element;
        data: Item<K, Array<Item<any, null>> | number[] | null> | number | null;
        group: string | string[];
        groupData: Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        parentElement: Element;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ValueFormats = {
        close?: NumericValueFormat;
        group?: GroupValueFormat;
        high?: NumericValueFormat;
        label?: LabelValueFormat;
        low?: NumericValueFormat;
        open?: NumericValueFormat;
        q1?: NumericValueFormat;
        q2?: NumericValueFormat;
        q3?: NumericValueFormat;
        series?: SeriesValueFormat;
        targetValue?: NumericValueFormat;
        value?: NumericValueFormat;
        volume?: NumericValueFormat;
        x?: CategoricalValueFormat;
        y?: NumericValueFormat;
        y2?: NumericValueFormat;
        z?: NumericValueFormat;
    };
    // tslint:disable-next-line interface-over-type-literal
    type XAxis<T extends number | string = number | string> = {
        axisLine?: AxisLine;
        baselineScaling?: 'min' | 'zero';
        dataMax?: number;
        dataMin?: number;
        majorTick?: MajorTick;
        max?: T;
        maxSize?: string;
        min?: T;
        minStep?: number;
        minorStep?: number;
        minorTick?: MinorTick;
        referenceObjects?: Array<XReferenceObject<T>>;
        rendered?: 'off' | 'on';
        scale?: 'log' | 'linear';
        size?: string;
        step?: number;
        tickLabel?: XTickLabel<T>;
        title?: string;
        titleStyle?: Partial<CSSStyleDeclaration>;
        viewportEndGroup?: T;
        viewportMax?: T;
        viewportMin?: T;
        viewportStartGroup?: T;
    };
    // tslint:disable-next-line interface-over-type-literal
    type XReferenceObject<T extends number | string = number | string> = {
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off';
        high?: T;
        id?: string;
        lineStyle?: LineStyle;
        lineWidth?: number;
        location?: 'front' | 'back';
        low?: T;
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        text?: string;
        type?: 'area' | 'line';
        value?: T;
    };
    // tslint:disable-next-line interface-over-type-literal
    type XTickLabel<T extends number | string = number | string> = {
        converter?: (Array<Converter<T>> | Converter<T>);
        rendered?: 'off' | 'on';
        rotation?: 'none' | 'auto';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Y2Axis = {
        alignTickMarks?: 'off' | 'on';
        axisLine?: AxisLine;
        baselineScaling?: 'min' | 'zero';
        dataMax?: number;
        dataMin?: number;
        majorTick?: MajorTick;
        max?: number;
        maxSize?: string;
        min?: number;
        minStep?: number;
        minorStep?: number;
        minorTick?: MinorTick;
        position?: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects?: YReferenceObject[];
        rendered?: 'off' | 'on';
        scale?: 'log' | 'linear';
        size?: string;
        step?: number;
        tickLabel?: YTickLabel;
        title?: string;
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type YAxis = {
        axisLine?: AxisLine;
        baselineScaling?: 'min' | 'zero';
        dataMax?: number;
        dataMin?: number;
        majorTick?: MajorTick;
        max?: number;
        maxSize?: string;
        min?: number;
        minStep?: number;
        minorStep?: number;
        minorTick?: MinorTick;
        position?: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects?: YReferenceObject[];
        rendered?: 'off' | 'on';
        scale?: 'log' | 'linear';
        size?: string;
        step?: number;
        tickLabel?: YTickLabel;
        title?: string;
        titleStyle?: Partial<CSSStyleDeclaration>;
        viewportMax?: number;
        viewportMin?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type YReferenceObject = {
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off';
        high?: number;
        id?: string;
        items?: ReferenceObjectItem[];
        lineStyle?: LineStyle;
        lineType?: LineType;
        lineWidth?: number;
        location?: 'front' | 'back';
        low?: number;
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        text?: string;
        type?: 'area' | 'line';
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type YTickLabel = {
        converter?: (Converter<number>);
        position?: 'inside' | 'outside';
        rendered?: 'off' | 'on';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderGroupTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<GroupTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderPieCenterTemplate = import('ojs/ojvcomponent').TemplateSlot<PieCenterContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderSeriesTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<SeriesTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D, I extends Array<Item<any, null>> | number[] | null> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D, I>>;
}
export interface ojChartEventMap<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends dvtBaseComponentEventMap<ojChartSettableProperties<K, D, I, C>> {
    'ojDrill': ojChart.ojDrill<K, D, I>;
    'ojGroupDrill': ojChart.ojGroupDrill<K, D, I>;
    'ojItemDrill': ojChart.ojItemDrill<K, D, I>;
    'ojMultiSeriesDrill': ojChart.ojMultiSeriesDrill<K, D, I>;
    'ojSelectInput': ojChart.ojSelectInput<K, D, I>;
    'ojSeriesDrill': ojChart.ojSeriesDrill<K, D, I>;
    'ojViewportChange': ojChart.ojViewportChange;
    'ojViewportChangeInput': ojChart.ojViewportChangeInput;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojChart<K, D, I, C>["animationOnDisplay"]>;
    'asChanged': JetElementCustomEvent<ojChart<K, D, I, C>["as"]>;
    'comboSeriesOrderChanged': JetElementCustomEvent<ojChart<K, D, I, C>["comboSeriesOrder"]>;
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
    'multiSeriesDrillingChanged': JetElementCustomEvent<ojChart<K, D, I, C>["multiSeriesDrilling"]>;
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
    'stackLabelProviderChanged': JetElementCustomEvent<ojChart<K, D, I, C>["stackLabelProvider"]>;
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
    'trackResizeChanged': JetElementCustomEvent<ojChart<K, D, I, C>["trackResize"]>;
}
export interface ojChartSettableProperties<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
   null> extends dvtBaseComponentSettableProperties {
    animationOnDataChange?: 'slideToLeft' | 'slideToRight' | 'auto' | 'none';
    animationOnDisplay?: 'alphaFade' | 'zoom' | 'auto' | 'none';
    as?: string;
    comboSeriesOrder?: 'data' | 'seriesType';
    coordinateSystem?: 'polar' | 'cartesian';
    data: DataProvider<K, D> | null;
    dataCursor?: 'off' | 'on' | 'auto';
    dataCursorBehavior?: 'smooth' | 'snap' | 'auto';
    dataCursorPosition?: ojChart.DataCursorPosition;
    dataLabel?: ((context: ojChart.DataLabelContext<K, D, I>) => (string[] | string | number[] | number));
    dnd?: {
        drag?: ojChart.DndDragConfigs<K, D, I>;
        drop?: ojChart.DndDropConfigs;
    };
    dragMode?: 'pan' | 'zoom' | 'select' | 'off' | 'user';
    drilling?: 'on' | 'seriesOnly' | 'groupsOnly' | 'off';
    groupComparator?: ((context1: ojChart.GroupTemplateContext<D>, context2: ojChart.GroupTemplateContext<D>) => number);
    hiddenCategories?: string[];
    hideAndShowBehavior?: 'withRescale' | 'withoutRescale' | 'none';
    highlightMatch?: 'any' | 'all';
    highlightedCategories?: string[];
    hoverBehavior?: 'dim' | 'none';
    initialZooming?: 'first' | 'last' | 'none';
    legend?: ojChart.Legend;
    multiSeriesDrilling?: 'on' | 'off';
    orientation?: 'horizontal' | 'vertical';
    otherThreshold?: number;
    overview?: ojChart.Overview<C>;
    pieCenter?: ojChart.PieCenter;
    plotArea?: ojChart.PlotArea;
    polarGridShape?: 'polygon' | 'circle';
    selection?: K[];
    selectionMode?: 'none' | 'single' | 'multiple';
    seriesComparator?: ((context1: ojChart.SeriesTemplateContext<D>, context2: ojChart.SeriesTemplateContext<D>) => number);
    sorting?: 'ascending' | 'descending' | 'off';
    splitDualY?: 'on' | 'off' | 'auto';
    splitterPosition?: number;
    stack?: 'on' | 'off';
    stackLabel?: 'on' | 'off';
    stackLabelProvider?: ((context: ojChart.StackLabelContext<K, D, I>) => (string));
    styleDefaults?: ojChart.StyleDefaults;
    timeAxisType?: 'enabled' | 'mixedFrequency' | 'skipGaps' | 'disabled' | 'auto';
    tooltip?: {
        renderer: dvtBaseComponent.PreventableDOMRendererFunction<ojChart.TooltipRendererContext<K, D, I>>;
    };
    touchResponse?: 'touchStart' | 'auto';
    type?: ojChart.ChartType;
    valueFormats?: ojChart.ValueFormats;
    xAxis?: ojChart.XAxis;
    y2Axis?: ojChart.Y2Axis;
    yAxis?: ojChart.YAxis;
    zoomAndScroll?: 'delayedScrollOnly' | 'liveScrollOnly' | 'delayed' | 'live' | 'off';
    zoomDirection?: 'x' | 'y' | 'auto';
    translations: {
        accessibleContainsControls?: string;
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
        stateLoaded?: string;
        stateLoading?: string;
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
    labelStyle?: Partial<CSSStyleDeclaration>;
    name?: string;
    shortDesc?: string;
    addEventListener<T extends keyof ojChartGroupEventMap>(type: T, listener: (this: HTMLElement, ev: ojChartGroupEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    labelStyle?: Partial<CSSStyleDeclaration>;
    name?: string;
    shortDesc?: string;
}
export interface ojChartGroupSettablePropertiesLenient extends Partial<ojChartGroupSettableProperties> {
    [key: string]: any;
}
export interface ojChartItem<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] |
   null> extends dvtBaseComponent<ojChartItemSettableProperties<K, D, I>> {
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
    labelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
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
    shortDesc?: (string | ((context: ojChart.ItemShortDescContext<K, D, I>) => string));
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    targetValue?: number;
    value?: number;
    volume?: number;
    x?: number | string;
    y?: number;
    z?: number;
    addEventListener<T extends keyof ojChartItemEventMap<K, D, I>>(type: T, listener: (this: HTMLElement, ev: ojChartItemEventMap<K, D, I>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojChartItemSettableProperties<K, D, I>>(property: T): ojChartItem<K, D, I>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojChartItemSettableProperties<K, D, I>>(property: T, value: ojChartItemSettableProperties<K, D, I>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojChartItemSettableProperties<K, D, I>>): void;
    setProperties(properties: ojChartItemSettablePropertiesLenient<K, D, I>): void;
}
export namespace ojChartItem {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type boxPlotChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["boxPlot"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type closeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["close"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupIdChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["groupId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["high"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemsChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["items"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lowChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["low"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDisplayedChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K,
       D, I>["markerDisplayed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type openChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["open"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q1Changed<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["q1"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q2Changed<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["q2"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q3Changed<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["q3"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesIdChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["seriesId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] |
       null> = JetElementCustomEvent<ojChartItem<K, D, I>["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K,
       D, I>["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type targetValueChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["targetValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type volumeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["volume"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["x"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["y"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["z"]>;
}
export interface ojChartItemEventMap<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] |
   null> extends dvtBaseComponentEventMap<ojChartItemSettableProperties<K, D, I>> {
    'borderColorChanged': JetElementCustomEvent<ojChartItem<K, D, I>["borderColor"]>;
    'borderWidthChanged': JetElementCustomEvent<ojChartItem<K, D, I>["borderWidth"]>;
    'boxPlotChanged': JetElementCustomEvent<ojChartItem<K, D, I>["boxPlot"]>;
    'categoriesChanged': JetElementCustomEvent<ojChartItem<K, D, I>["categories"]>;
    'closeChanged': JetElementCustomEvent<ojChartItem<K, D, I>["close"]>;
    'colorChanged': JetElementCustomEvent<ojChartItem<K, D, I>["color"]>;
    'drillingChanged': JetElementCustomEvent<ojChartItem<K, D, I>["drilling"]>;
    'groupIdChanged': JetElementCustomEvent<ojChartItem<K, D, I>["groupId"]>;
    'highChanged': JetElementCustomEvent<ojChartItem<K, D, I>["high"]>;
    'itemsChanged': JetElementCustomEvent<ojChartItem<K, D, I>["items"]>;
    'labelChanged': JetElementCustomEvent<ojChartItem<K, D, I>["label"]>;
    'labelPositionChanged': JetElementCustomEvent<ojChartItem<K, D, I>["labelPosition"]>;
    'labelStyleChanged': JetElementCustomEvent<ojChartItem<K, D, I>["labelStyle"]>;
    'lowChanged': JetElementCustomEvent<ojChartItem<K, D, I>["low"]>;
    'markerDisplayedChanged': JetElementCustomEvent<ojChartItem<K, D, I>["markerDisplayed"]>;
    'markerShapeChanged': JetElementCustomEvent<ojChartItem<K, D, I>["markerShape"]>;
    'markerSizeChanged': JetElementCustomEvent<ojChartItem<K, D, I>["markerSize"]>;
    'openChanged': JetElementCustomEvent<ojChartItem<K, D, I>["open"]>;
    'patternChanged': JetElementCustomEvent<ojChartItem<K, D, I>["pattern"]>;
    'q1Changed': JetElementCustomEvent<ojChartItem<K, D, I>["q1"]>;
    'q2Changed': JetElementCustomEvent<ojChartItem<K, D, I>["q2"]>;
    'q3Changed': JetElementCustomEvent<ojChartItem<K, D, I>["q3"]>;
    'seriesIdChanged': JetElementCustomEvent<ojChartItem<K, D, I>["seriesId"]>;
    'shortDescChanged': JetElementCustomEvent<ojChartItem<K, D, I>["shortDesc"]>;
    'sourceChanged': JetElementCustomEvent<ojChartItem<K, D, I>["source"]>;
    'sourceHoverChanged': JetElementCustomEvent<ojChartItem<K, D, I>["sourceHover"]>;
    'sourceHoverSelectedChanged': JetElementCustomEvent<ojChartItem<K, D, I>["sourceHoverSelected"]>;
    'sourceSelectedChanged': JetElementCustomEvent<ojChartItem<K, D, I>["sourceSelected"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojChartItem<K, D, I>["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojChartItem<K, D, I>["svgStyle"]>;
    'targetValueChanged': JetElementCustomEvent<ojChartItem<K, D, I>["targetValue"]>;
    'valueChanged': JetElementCustomEvent<ojChartItem<K, D, I>["value"]>;
    'volumeChanged': JetElementCustomEvent<ojChartItem<K, D, I>["volume"]>;
    'xChanged': JetElementCustomEvent<ojChartItem<K, D, I>["x"]>;
    'yChanged': JetElementCustomEvent<ojChartItem<K, D, I>["y"]>;
    'zChanged': JetElementCustomEvent<ojChartItem<K, D, I>["z"]>;
}
export interface ojChartItemSettableProperties<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] |
   null> extends dvtBaseComponentSettableProperties {
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
    labelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
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
    shortDesc?: (string | ((context: ojChart.ItemShortDescContext<K, D, I>) => string));
    source?: string;
    sourceHover?: string;
    sourceHoverSelected?: string;
    sourceSelected?: string;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    targetValue?: number;
    value?: number;
    volume?: number;
    x?: number | string;
    y?: number;
    z?: number;
}
export interface ojChartItemSettablePropertiesLenient<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] |
   null> extends Partial<ojChartItemSettableProperties<K, D, I>> {
    [key: string]: any;
}
export interface ojChartSeries extends JetElement<ojChartSeriesSettableProperties> {
    areaColor?: string;
    areaSvgClassName?: string;
    areaSvgStyle?: Partial<CSSStyleDeclaration>;
    assignedToY2?: 'on' | 'off';
    borderColor?: string;
    borderWidth?: number;
    boxPlot?: ojChart.BoxPlotStyle;
    categories?: string[];
    color?: string;
    displayInLegend?: 'on' | 'off' | 'auto';
    drilling?: 'on' | 'off' | 'inherit';
    lineStyle?: ojChart.LineStyle;
    lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight' | 'auto';
    lineWidth?: number;
    markerColor?: string;
    markerDisplayed?: 'on' | 'off' | 'auto';
    markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
    markerSize?: number;
    markerSvgClassName?: string;
    markerSvgStyle?: Partial<CSSStyleDeclaration>;
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
    svgStyle?: Partial<CSSStyleDeclaration>;
    type?: 'line' | 'area' | 'lineWithArea' | 'bar' | 'candlestick' | 'boxPlot' | 'auto';
    addEventListener<T extends keyof ojChartSeriesEventMap>(type: T, listener: (this: HTMLElement, ev: ojChartSeriesEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    areaSvgStyle?: Partial<CSSStyleDeclaration>;
    assignedToY2?: 'on' | 'off';
    borderColor?: string;
    borderWidth?: number;
    boxPlot?: ojChart.BoxPlotStyle;
    categories?: string[];
    color?: string;
    displayInLegend?: 'on' | 'off' | 'auto';
    drilling?: 'on' | 'off' | 'inherit';
    lineStyle?: ojChart.LineStyle;
    lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight' | 'auto';
    lineWidth?: number;
    markerColor?: string;
    markerDisplayed?: 'on' | 'off' | 'auto';
    markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
    markerSize?: number;
    markerSvgClassName?: string;
    markerSvgStyle?: Partial<CSSStyleDeclaration>;
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
    svgStyle?: Partial<CSSStyleDeclaration>;
    type?: 'line' | 'area' | 'lineWithArea' | 'bar' | 'candlestick' | 'boxPlot' | 'auto';
}
export interface ojChartSeriesSettablePropertiesLenient extends Partial<ojChartSeriesSettableProperties> {
    [key: string]: any;
}
export interface ojSparkChart<K, D extends ojSparkChart.Item | any> extends dvtBaseComponent<ojSparkChartSettableProperties<K, D>> {
    animationDuration?: number | null;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    areaColor?: string;
    areaSvgClassName?: string;
    areaSvgStyle?: Partial<CSSStyleDeclaration>;
    as?: string;
    barGapRatio?: number;
    baselineScaling?: 'zero' | 'min';
    color?: string;
    data: DataProvider<K, D> | null;
    firstColor?: string;
    highColor?: string;
    lastColor?: string;
    lineStyle?: 'dotted' | 'dashed' | 'solid';
    lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight';
    lineWidth?: number;
    lowColor?: string;
    markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize?: number;
    referenceObjects?: ojSparkChart.ReferenceObject[];
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    tooltip?: {
        renderer: ((context: ojSparkChart.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    type?: 'area' | 'lineWithArea' | 'bar' | 'line';
    visualEffects?: 'none' | 'auto';
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
    addEventListener<T extends keyof ojSparkChartEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: ojSparkChartEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends Item | any> = dvtBaseComponent.trackResizeChanged<ojSparkChartSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type Item = {
        borderColor?: string;
        color?: string;
        date?: Date;
        high?: number;
        low?: number;
        markerDisplayed?: 'on' | 'off';
        markerShape?: 'square' | 'circle' | 'diamond' | 'plus' | 'triangleDown' | 'triangleUp' | 'human' | 'star' | 'auto' | string;
        markerSize?: number;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value?: number;
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
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        index: number;
        key: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        color?: string;
        high?: number;
        lineStyle?: 'dotted' | 'dashed' | 'solid';
        lineWidth?: number;
        location?: 'front' | 'back';
        low?: number;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'area' | 'line';
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
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
    'trackResizeChanged': JetElementCustomEvent<ojSparkChart<K, D>["trackResize"]>;
}
export interface ojSparkChartSettableProperties<K, D extends ojSparkChart.Item | any> extends dvtBaseComponentSettableProperties {
    animationDuration?: number | null;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    areaColor?: string;
    areaSvgClassName?: string;
    areaSvgStyle?: Partial<CSSStyleDeclaration>;
    as?: string;
    barGapRatio?: number;
    baselineScaling?: 'zero' | 'min';
    color?: string;
    data: DataProvider<K, D> | null;
    firstColor?: string;
    highColor?: string;
    lastColor?: string;
    lineStyle?: 'dotted' | 'dashed' | 'solid';
    lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight';
    lineWidth?: number;
    lowColor?: string;
    markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize?: number;
    referenceObjects?: ojSparkChart.ReferenceObject[];
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    tooltip?: {
        renderer: ((context: ojSparkChart.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        })) | null;
    };
    type?: 'area' | 'lineWithArea' | 'bar' | 'line';
    visualEffects?: 'none' | 'auto';
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
export interface ojSparkChartSettablePropertiesLenient<K, D extends ojSparkChart.Item | any> extends Partial<ojSparkChartSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ojSparkChartItem extends JetElement<ojSparkChartItemSettableProperties> {
    borderColor?: string;
    color?: string;
    date?: string;
    high?: number | null;
    low?: number | null;
    markerDisplayed?: 'off' | 'on';
    markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize?: number;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value?: number | null;
    addEventListener<T extends keyof ojSparkChartItemEventMap>(type: T, listener: (this: HTMLElement, ev: ojSparkChartItemEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    borderColor?: string;
    color?: string;
    date?: string;
    high?: number | null;
    low?: number | null;
    markerDisplayed?: 'off' | 'on';
    markerShape?: 'auto' | 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | string;
    markerSize?: number;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    value?: number | null;
}
export interface ojSparkChartItemSettablePropertiesLenient extends Partial<ojSparkChartItemSettableProperties> {
    [key: string]: any;
}
export type ChartElement<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = ojChart<K, D, I, C>;
export type ChartGroupElement = ojChartGroup;
export type ChartItemElement<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = ojChartItem<K, D, I>;
export type ChartSeriesElement = ojChartSeries;
export type SparkChartElement<K, D extends ojSparkChart.Item | any> = ojSparkChart<K, D>;
export type SparkChartItemElement = ojSparkChartItem;
export namespace ChartElement {
    interface ojDrill<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> extends CustomEvent<{
        data: ojChart.Item<K, I> | number | null;
        group: string;
        groupData: ojChart.Group[] | null;
        id: string;
        itemData: D;
        series: string;
        seriesData: ojChart.Series<K, I> | null;
        [propName: string]: any;
    }> {
    }
    interface ojGroupDrill<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> extends CustomEvent<{
        group: string | string[];
        groupData: ojChart.Group[];
        id: string;
        items: Array<ojChart.DrillItem<K, D, I>>;
        [propName: string]: any;
    }> {
    }
    interface ojItemDrill<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> extends CustomEvent<{
        data: ojChart.Item<K, I> | number;
        group: string | string[];
        groupData: ojChart.Group[];
        id: string;
        itemData: D;
        series: string;
        seriesData: ojChart.Series<K, I>;
        [propName: string]: any;
    }> {
    }
    interface ojMultiSeriesDrill<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> extends CustomEvent<{
        items: Array<ojChart.DrillItem<K, D, I>>;
        series: string[];
        seriesData: ojChart.Series<K, I>;
        [propName: string]: any;
    }> {
    }
    interface ojSelectInput<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> extends CustomEvent<{
        endGroup: string;
        items: string[];
        selectionData: Array<{
            data: ojChart.Item<K, I> | number;
            groupData: ojChart.Group[];
            itemData: D;
            seriesData: ojChart.Series<K, I>;
        }>;
        startGroup: string;
        xMax: number;
        xMin: number;
        yMax: number;
        yMin: number;
        [propName: string]: any;
    }> {
    }
    interface ojSeriesDrill<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> extends CustomEvent<{
        id: string;
        items: Array<ojChart.DrillItem<K, D, I>>;
        series: string;
        seriesData: ojChart.Series<K, I>;
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
    type animationOnDataChangeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D, I,
       C>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type comboSeriesOrderChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["comboSeriesOrder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type coordinateSystemChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["coordinateSystem"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataCursorChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["dataCursor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataCursorBehaviorChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["dataCursorBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataCursorPositionChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["dataCursorPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataLabelChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["dataLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dndChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["dnd"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dragModeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["dragMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupComparatorChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["groupComparator"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hiddenCategoriesChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["hiddenCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hideAndShowBehaviorChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["hideAndShowBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightMatchChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["highlightMatch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highlightedCategoriesChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["highlightedCategories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverBehaviorChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["hoverBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type initialZoomingChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["initialZooming"]>;
    // tslint:disable-next-line interface-over-type-literal
    type legendChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["legend"]>;
    // tslint:disable-next-line interface-over-type-literal
    type multiSeriesDrillingChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["multiSeriesDrilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type otherThresholdChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["otherThreshold"]>;
    // tslint:disable-next-line interface-over-type-literal
    type overviewChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["overview"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pieCenterChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["pieCenter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type plotAreaChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["plotArea"]>;
    // tslint:disable-next-line interface-over-type-literal
    type polarGridShapeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["polarGridShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["selection"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectionModeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["selectionMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesComparatorChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["seriesComparator"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sortingChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["sorting"]>;
    // tslint:disable-next-line interface-over-type-literal
    type splitDualYChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["splitDualY"]>;
    // tslint:disable-next-line interface-over-type-literal
    type splitterPositionChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["splitterPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stackChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["stack"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stackLabelChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["stackLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stackLabelProviderChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["stackLabelProvider"]>;
    // tslint:disable-next-line interface-over-type-literal
    type styleDefaultsChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["styleDefaults"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timeAxisTypeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["timeAxisType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type touchResponseChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["touchResponse"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueFormatsChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["valueFormats"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xAxisChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["xAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type y2AxisChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K,
       D, I, C>["y2Axis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yAxisChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> | null> = JetElementCustomEvent<ojChart<K, D,
       I, C>["yAxis"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomAndScrollChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["zoomAndScroll"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zoomDirectionChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = JetElementCustomEvent<ojChart<K, D, I, C>["zoomDirection"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojChart.DataItem<I> | any, I extends Array<ojChart.Item<any, null>> | number[] | null, C extends ojChart<K, D, I, null> |
       null> = dvtBaseComponent.trackResizeChanged<ojChartSettableProperties<K, D, I, C>>;
    // tslint:disable-next-line interface-over-type-literal
    type AxisLine = {
        lineColor?: string;
        lineWidth?: number;
        rendered?: 'off' | 'on' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type AxisTitleContext = {
        axis: 'xAxis' | 'yAxis' | 'y2Axis';
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type BoxPlotDefaults = {
        medianSvgClassName?: string;
        medianSvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerEndLength?: string;
        whiskerEndSvgClassName?: string;
        whiskerEndSvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerSvgClassName?: string;
        whiskerSvgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type BoxPlotStyle = {
        medianSvgClassName?: string;
        medianSvgStyle?: Partial<CSSStyleDeclaration>;
        q2Color?: string;
        q2SvgClassName?: string;
        q2SvgStyle?: Partial<CSSStyleDeclaration>;
        q3Color?: string;
        q3SvgClassName?: string;
        q3SvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerEndLength?: string;
        whiskerEndSvgClassName?: string;
        whiskerEndSvgStyle?: Partial<CSSStyleDeclaration>;
        whiskerSvgClassName?: string;
        whiskerSvgStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CategoricalValueFormat<T extends string | number = string | number> = {
        converter?: (Converter<T>);
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ChartType = 'line' | 'area' | 'lineWithArea' | 'bar' | 'stock' | 'boxPlot' | 'combo' | 'pie' | 'scatter' | 'bubble' | 'funnel' | 'pyramid';
    // tslint:disable-next-line interface-over-type-literal
    type DataCursorDefaults = {
        lineColor?: string;
        lineStyle?: ojChart.LineStyle;
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'off' | 'on';
        markerSize?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataCursorPosition<T extends number | string = number | string> = {
        x?: T;
        y?: number;
        y2?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataItem<I extends Array<ojChart.Item<any, null>> | number[] | null, K = any, D = any> = {
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: ojChart.BoxPlotStyle;
        categories?: string[];
        close?: number;
        color?: string;
        drilling?: 'on' | 'off' | 'inherit';
        groupId: Array<(string | number)>;
        high?: number;
        label?: string | string[];
        labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        labelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
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
        shortDesc?: (string | ((context: ojChart.ItemShortDescContext<K, D, I>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        targetValue?: number;
        value?: number;
        volume?: number;
        x?: number | string;
        y?: number;
        z?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DataLabelContext<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        close: number;
        componentElement: Element;
        data: ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null> | number | null;
        dimensions: {
            height: number;
            width: number;
        };
        group: string | string[];
        groupData: ojChart.Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: ojChart.Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDragConfig<T> = {
        dataTypes?: string | string[];
        drag?: ((param0: Event) => void);
        dragEnd?: ((param0: Event) => void);
        dragStart?: ((event: Event, context: T) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDragConfigs<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        groups?: ojChart.DndDragConfig<ojChart.DndGroup>;
        items?: ojChart.DndDragConfig<ojChart.DndItem<K, D, I>>;
        series?: ojChart.DndDragConfig<ojChart.DndSeries<K, I>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDrop = {
        x: number | null;
        y: number | null;
        y2: number | null;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDropConfig = {
        dataTypes?: string | string[];
        dragEnter?: ((event: Event, context: ojChart.DndDrop) => void);
        dragLeave?: ((event: Event, context: ojChart.DndDrop) => void);
        dragOver?: ((event: Event, context: ojChart.DndDrop) => void);
        drop?: ((event: Event, context: ojChart.DndDrop) => void);
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndDropConfigs = {
        legend?: ojChart.DndDropConfig;
        plotArea?: ojChart.DndDropConfig;
        xAxis?: ojChart.DndDropConfig;
        y2Axis?: ojChart.DndDropConfig;
        yAxis?: ojChart.DndDropConfig;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndGroup = {
        group: string | number | Array<(string | number)>;
        id: string | number | Array<(string | number)>;
        label: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndItem<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        item: Array<ojChart.DataLabelContext<K, D, I>>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DndSeries<K, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        color: string;
        componentElement: any;
        id: string | number;
        series: string | number;
        seriesData: ojChart.Series<K, I>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DrillItem<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        data: ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null> | number;
        group: string | string[];
        id: K;
        itemData: D;
        series: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Group = {
        drilling?: 'on' | 'off' | 'inherit';
        groups?: ojChart.Group[];
        id?: string | number;
        labelStyle?: Partial<CSSStyleDeclaration>;
        name?: string;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupContext = {
        indexPath: any[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupSeparatorDefaults = {
        color?: string;
        rendered?: 'off' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupTemplateContext<D> = {
        componentElement: Element;
        depth: number;
        ids: string[];
        index: number;
        items: Array<{
            data: D;
            index: number;
            key: any;
        }>;
        leaf: boolean;
    };
    // tslint:disable-next-line interface-over-type-literal
    type GroupValueFormat = {
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string | string[];
    };
    // tslint:disable-next-line interface-over-type-literal
    type Item<K, I extends Array<ojChart.Item<any, null>> | number[] | null, D = any> = {
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: ojChart.BoxPlotStyle;
        categories?: string[];
        close?: number;
        color?: string;
        drilling?: 'on' | 'off' | 'inherit';
        high?: number;
        id: K;
        items?: I;
        label?: string | string[];
        labelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        labelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
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
        shortDesc?: (string | ((context: ojChart.ItemShortDescContext<K, D, I>) => string));
        source?: string;
        sourceHover?: string;
        sourceHoverSelected?: string;
        sourceSelected?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        targetValue?: number;
        value?: number;
        volume?: number;
        x?: number | string;
        y?: number;
        z?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemContext = {
        itemIndex: number;
        seriesIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemShortDescContext<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        close: number;
        data: ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null> | number | null;
        group: string | string[];
        groupData: ojChart.Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: ojChart.Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        index: number;
        key: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LabelValueFormat = {
        converter?: (Converter<string>);
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Legend = {
        backgroundColor?: string;
        borderColor?: string;
        maxSize?: string;
        position?: 'start' | 'end' | 'bottom' | 'top' | 'auto';
        referenceObjectSection?: ojChart.LegendReferenceObjectSection;
        rendered?: 'on' | 'off' | 'auto';
        scrolling?: 'off' | 'asNeeded';
        sectionTitleHalign?: 'center' | 'end' | 'start';
        sectionTitleStyle?: Partial<CSSStyleDeclaration>;
        sections?: ojChart.LegendSection[];
        seriesSection?: ojChart.LegendSeriesSection;
        size?: string;
        symbolHeight?: number;
        symbolWidth?: number;
        textStyle?: Partial<CSSStyleDeclaration>;
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
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
        text: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendItemContext = {
        itemIndex: number;
        sectionIndexPath: any[];
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendReferenceObjectSection = {
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendSection = {
        items?: ojChart.LegendItem[];
        sections?: ojChart.LegendSection[];
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LegendSeriesSection = {
        title?: string;
        titleHalign?: 'center' | 'end' | 'start';
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type LineStyle = 'dotted' | 'dashed' | 'solid';
    // tslint:disable-next-line interface-over-type-literal
    type LineType = 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight';
    // tslint:disable-next-line interface-over-type-literal
    type MajorTick = {
        baselineColor?: 'inherit' | 'auto' | string;
        baselineStyle?: ojChart.LineStyle;
        baselineWidth?: number;
        lineColor?: string;
        lineStyle?: ojChart.LineStyle;
        lineWidth?: number;
        rendered?: 'off' | 'on' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type MinorTick = {
        lineColor?: string;
        lineStyle?: ojChart.LineStyle;
        lineWidth?: number;
        rendered?: 'off' | 'on' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type NumericValueFormat = {
        converter?: (Converter<number>);
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Overview<C> = {
        content?: C;
        height?: string;
        rendered?: 'on' | 'off';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenter = {
        converter?: (Converter<number>);
        label?: number | string;
        labelStyle?: Partial<CSSStyleDeclaration>;
        renderer?: dvtBaseComponent.PreventableDOMRendererFunction<ojChart.PieCenterRendererContext>;
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterContext = {
        componentElement: Element;
        innerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        label: string;
        labelStyle: Partial<CSSStyleDeclaration>;
        outerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        totalValue: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterLabelContext = {
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PieCenterRendererContext = {
        componentElement: Element;
        innerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        label: string;
        labelStyle: Partial<CSSStyleDeclaration>;
        outerBounds: {
            height: number;
            width: number;
            x: number;
            y: number;
        };
        totalValue: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type PlotArea = {
        backgroundColor?: string;
        borderColor?: string;
        borderWidth?: number;
        rendered?: 'off' | 'on';
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        axis: 'xAxis' | 'yAxis' | 'y2Axis';
        index: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObjectItem<T extends number | string = number | string> = {
        high?: number;
        low?: number;
        value?: number;
        x?: T;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Series<K, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        areaColor?: string;
        areaSvgClassName?: string;
        areaSvgStyle?: Partial<CSSStyleDeclaration>;
        assignedToY2?: 'on' | 'off';
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: ojChart.BoxPlotStyle;
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off' | 'auto';
        drilling?: 'on' | 'off' | 'inherit';
        id?: string | number;
        items?: (Array<ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null>> | number[]);
        lineStyle?: ojChart.LineStyle;
        lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'none' | 'straight' | 'auto';
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
        markerSize?: number;
        markerSvgClassName?: string;
        markerSvgStyle?: Partial<CSSStyleDeclaration>;
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
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'line' | 'area' | 'lineWithArea' | 'bar' | 'candlestick' | 'boxPlot' | 'auto';
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesContext = {
        itemIndex: number;
        subId: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesTemplateContext<D> = {
        componentElement: Element;
        id: string;
        index: number;
        items: Array<{
            data: D;
            index: number;
            key: any;
        }>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type SeriesValueFormat = {
        tooltipDisplay?: 'off' | 'auto';
        tooltipLabel?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type StackLabelContext<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        data: Array<ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null> | number | null>;
        groupData: ojChart.Group[] | null;
        groups: string | string[];
        itemData: D[];
        value: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type StyleDefaults = {
        animationDownColor?: string;
        animationDuration?: number;
        animationIndicators?: 'none' | 'all';
        animationUpColor?: string;
        barGapRatio?: number;
        borderColor?: string;
        borderWidth?: number;
        boxPlot?: ojChart.BoxPlotDefaults;
        colors?: string[];
        dataCursor?: ojChart.DataCursorDefaults;
        dataItemGaps?: string;
        dataLabelCollision?: 'fitInBounds' | 'none';
        dataLabelPosition?: 'center' | 'outsideSlice' | 'aboveMarker' | 'belowMarker' | 'beforeMarker' | 'afterMarker' | 'insideBarEdge' | 'outsideBarEdge' | 'none' | 'auto';
        dataLabelStyle?: Partial<CSSStyleDeclaration> | Array<Partial<CSSStyleDeclaration>>;
        funnelBackgroundColor?: string;
        groupSeparators?: ojChart.GroupSeparatorDefaults;
        hoverBehaviorDelay?: number;
        lineStyle?: ojChart.LineStyle;
        lineType?: 'curved' | 'stepped' | 'centeredStepped' | 'segmented' | 'centeredSegmented' | 'straight' | 'none' | 'auto';
        lineWidth?: number;
        markerColor?: string;
        markerDisplayed?: 'on' | 'off' | 'auto';
        markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto' | string;
        markerSize?: number;
        marqueeBorderColor?: string;
        marqueeColor?: string;
        maxBarWidth?: number;
        otherColor?: string;
        patterns?: string[];
        pieFeelerColor?: string;
        pieInnerRadius?: number;
        selectionEffect?: 'explode' | 'highlightAndExplode' | 'highlight';
        seriesEffect?: 'color' | 'pattern' | 'gradient';
        shapes?: string[];
        stackLabelStyle?: Partial<CSSStyleDeclaration>;
        stockFallingColor?: string;
        stockRangeColor?: string;
        stockRisingColor?: string;
        stockVolumeColor?: string;
        threeDEffect?: 'on' | 'off';
        tooltipLabelStyle?: Partial<CSSStyleDeclaration>;
        tooltipValueStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        close: number;
        color: string;
        componentElement: Element;
        data: ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null> | number | null;
        group: string | string[];
        groupData: ojChart.Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        parentElement: Element;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: ojChart.Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipRendererContext<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = {
        close: number;
        color: string;
        componentElement: Element;
        data: ojChart.Item<K, Array<ojChart.Item<any, null>> | number[] | null> | number | null;
        group: string | string[];
        groupData: ojChart.Group[] | null;
        high: number;
        id: any;
        itemData: D;
        label: string;
        low: number;
        open: number;
        parentElement: Element;
        q1: number;
        q2: number;
        q3: number;
        series: string;
        seriesData: ojChart.Series<K, I> | null;
        targetValue: number;
        totalValue: number;
        value: number;
        volume: number;
        x: number | string;
        y: number;
        z: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ValueFormats = {
        close?: ojChart.NumericValueFormat;
        group?: ojChart.GroupValueFormat;
        high?: ojChart.NumericValueFormat;
        label?: ojChart.LabelValueFormat;
        low?: ojChart.NumericValueFormat;
        open?: ojChart.NumericValueFormat;
        q1?: ojChart.NumericValueFormat;
        q2?: ojChart.NumericValueFormat;
        q3?: ojChart.NumericValueFormat;
        series?: ojChart.SeriesValueFormat;
        targetValue?: ojChart.NumericValueFormat;
        value?: ojChart.NumericValueFormat;
        volume?: ojChart.NumericValueFormat;
        x?: ojChart.CategoricalValueFormat;
        y?: ojChart.NumericValueFormat;
        y2?: ojChart.NumericValueFormat;
        z?: ojChart.NumericValueFormat;
    };
    // tslint:disable-next-line interface-over-type-literal
    type XAxis<T extends number | string = number | string> = {
        axisLine?: ojChart.AxisLine;
        baselineScaling?: 'min' | 'zero';
        dataMax?: number;
        dataMin?: number;
        majorTick?: ojChart.MajorTick;
        max?: T;
        maxSize?: string;
        min?: T;
        minStep?: number;
        minorStep?: number;
        minorTick?: ojChart.MinorTick;
        referenceObjects?: Array<ojChart.XReferenceObject<T>>;
        rendered?: 'off' | 'on';
        scale?: 'log' | 'linear';
        size?: string;
        step?: number;
        tickLabel?: ojChart.XTickLabel<T>;
        title?: string;
        titleStyle?: Partial<CSSStyleDeclaration>;
        viewportEndGroup?: T;
        viewportMax?: T;
        viewportMin?: T;
        viewportStartGroup?: T;
    };
    // tslint:disable-next-line interface-over-type-literal
    type XReferenceObject<T extends number | string = number | string> = {
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off';
        high?: T;
        id?: string;
        lineStyle?: ojChart.LineStyle;
        lineWidth?: number;
        location?: 'front' | 'back';
        low?: T;
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        text?: string;
        type?: 'area' | 'line';
        value?: T;
    };
    // tslint:disable-next-line interface-over-type-literal
    type XTickLabel<T extends number | string = number | string> = {
        converter?: (Array<Converter<T>> | Converter<T>);
        rendered?: 'off' | 'on';
        rotation?: 'none' | 'auto';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Y2Axis = {
        alignTickMarks?: 'off' | 'on';
        axisLine?: ojChart.AxisLine;
        baselineScaling?: 'min' | 'zero';
        dataMax?: number;
        dataMin?: number;
        majorTick?: ojChart.MajorTick;
        max?: number;
        maxSize?: string;
        min?: number;
        minStep?: number;
        minorStep?: number;
        minorTick?: ojChart.MinorTick;
        position?: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects?: ojChart.YReferenceObject[];
        rendered?: 'off' | 'on';
        scale?: 'log' | 'linear';
        size?: string;
        step?: number;
        tickLabel?: ojChart.YTickLabel;
        title?: string;
        titleStyle?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type YAxis = {
        axisLine?: ojChart.AxisLine;
        baselineScaling?: 'min' | 'zero';
        dataMax?: number;
        dataMin?: number;
        majorTick?: ojChart.MajorTick;
        max?: number;
        maxSize?: string;
        min?: number;
        minStep?: number;
        minorStep?: number;
        minorTick?: ojChart.MinorTick;
        position?: 'start' | 'end' | 'top' | 'bottom' | 'auto';
        referenceObjects?: ojChart.YReferenceObject[];
        rendered?: 'off' | 'on';
        scale?: 'log' | 'linear';
        size?: string;
        step?: number;
        tickLabel?: ojChart.YTickLabel;
        title?: string;
        titleStyle?: Partial<CSSStyleDeclaration>;
        viewportMax?: number;
        viewportMin?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type YReferenceObject = {
        categories?: string[];
        color?: string;
        displayInLegend?: 'on' | 'off';
        high?: number;
        id?: string;
        items?: ojChart.ReferenceObjectItem[];
        lineStyle?: ojChart.LineStyle;
        lineType?: ojChart.LineType;
        lineWidth?: number;
        location?: 'front' | 'back';
        low?: number;
        shortDesc?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        text?: string;
        type?: 'area' | 'line';
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type YTickLabel = {
        converter?: (Converter<number>);
        position?: 'inside' | 'outside';
        rendered?: 'off' | 'on';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderGroupTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<GroupTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderPieCenterTemplate = import('ojs/ojvcomponent').TemplateSlot<PieCenterContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderSeriesTemplate<D> = import('ojs/ojvcomponent').TemplateSlot<SeriesTemplateContext<D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate<K, D, I extends Array<ojChart.Item<any, null>> | number[] | null> = import('ojs/ojvcomponent').TemplateSlot<TooltipContext<K, D, I>>;
}
export namespace ChartGroupElement {
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged = JetElementCustomEvent<ojChartGroup["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged = JetElementCustomEvent<ojChartGroup["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type nameChanged = JetElementCustomEvent<ojChartGroup["name"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged = JetElementCustomEvent<ojChartGroup["shortDesc"]>;
}
export namespace ChartItemElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderWidthChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["borderWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type boxPlotChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["boxPlot"]>;
    // tslint:disable-next-line interface-over-type-literal
    type categoriesChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["categories"]>;
    // tslint:disable-next-line interface-over-type-literal
    type closeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["close"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type drillingChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["drilling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type groupIdChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["groupId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["high"]>;
    // tslint:disable-next-line interface-over-type-literal
    type itemsChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["items"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelPositionChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["labelPosition"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelStyleChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["labelStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lowChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["low"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerDisplayedChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K,
       D, I>["markerDisplayed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type openChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["open"]>;
    // tslint:disable-next-line interface-over-type-literal
    type patternChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["pattern"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q1Changed<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["q1"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q2Changed<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["q2"]>;
    // tslint:disable-next-line interface-over-type-literal
    type q3Changed<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["q3"]>;
    // tslint:disable-next-line interface-over-type-literal
    type seriesIdChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["seriesId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type shortDescChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["shortDesc"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["source"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["sourceHover"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceHoverSelectedChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] |
       null> = JetElementCustomEvent<ojChartItem<K, D, I>["sourceHoverSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sourceSelectedChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K,
       D, I>["sourceSelected"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type targetValueChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["targetValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type volumeChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D,
       I>["volume"]>;
    // tslint:disable-next-line interface-over-type-literal
    type xChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["x"]>;
    // tslint:disable-next-line interface-over-type-literal
    type yChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["y"]>;
    // tslint:disable-next-line interface-over-type-literal
    type zChanged<K = any, D = any, I extends Array<ojChart.Item<any, null>> | number[] | null = Array<ojChart.Item<any, null>> | number[] | null> = JetElementCustomEvent<ojChartItem<K, D, I>["z"]>;
}
export namespace ChartSeriesElement {
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
export namespace SparkChartElement {
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaColorChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["areaColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaSvgClassNameChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["areaSvgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type areaSvgStyleChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["areaSvgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type asChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["as"]>;
    // tslint:disable-next-line interface-over-type-literal
    type barGapRatioChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["barGapRatio"]>;
    // tslint:disable-next-line interface-over-type-literal
    type baselineScalingChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["baselineScaling"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["data"]>;
    // tslint:disable-next-line interface-over-type-literal
    type firstColorChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["firstColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type highColorChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["highColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lastColorChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lastColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineStyleChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lineStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineTypeChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lineType"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lineWidthChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lineWidth"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lowColorChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["lowColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerShapeChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["markerShape"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceObjectsChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["referenceObjects"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged<K, D extends ojSparkChart.Item | any> = JetElementCustomEvent<ojSparkChart<K, D>["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<K, D extends ojSparkChart.Item | any> = dvtBaseComponent.trackResizeChanged<ojSparkChartSettableProperties<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type Item = {
        borderColor?: string;
        color?: string;
        date?: Date;
        high?: number;
        low?: number;
        markerDisplayed?: 'on' | 'off';
        markerShape?: 'square' | 'circle' | 'diamond' | 'plus' | 'triangleDown' | 'triangleUp' | 'human' | 'star' | 'auto' | string;
        markerSize?: number;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        value?: number;
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
    type ItemTemplateContext<K = any, D = any> = {
        componentElement: Element;
        data: D;
        index: number;
        key: K;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceObject = {
        color?: string;
        high?: number;
        lineStyle?: 'dotted' | 'dashed' | 'solid';
        lineWidth?: number;
        location?: 'front' | 'back';
        low?: number;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
        type?: 'area' | 'line';
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderItemTemplate<K = any, D = any> = import('ojs/ojvcomponent').TemplateSlot<ItemTemplateContext<K, D>>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export namespace SparkChartItemElement {
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
export interface ChartIntrinsicProps extends Partial<Readonly<ojChartSettableProperties<any, any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojDrill?: (value: ojChartEventMap<any, any, any, any>['ojDrill']) => void;
    onojGroupDrill?: (value: ojChartEventMap<any, any, any, any>['ojGroupDrill']) => void;
    onojItemDrill?: (value: ojChartEventMap<any, any, any, any>['ojItemDrill']) => void;
    onojMultiSeriesDrill?: (value: ojChartEventMap<any, any, any, any>['ojMultiSeriesDrill']) => void;
    onojSelectInput?: (value: ojChartEventMap<any, any, any, any>['ojSelectInput']) => void;
    onojSeriesDrill?: (value: ojChartEventMap<any, any, any, any>['ojSeriesDrill']) => void;
    onojViewportChange?: (value: ojChartEventMap<any, any, any, any>['ojViewportChange']) => void;
    onojViewportChangeInput?: (value: ojChartEventMap<any, any, any, any>['ojViewportChangeInput']) => void;
    onanimationOnDataChangeChanged?: (value: ojChartEventMap<any, any, any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojChartEventMap<any, any, any, any>['animationOnDisplayChanged']) => void;
    onasChanged?: (value: ojChartEventMap<any, any, any, any>['asChanged']) => void;
    oncomboSeriesOrderChanged?: (value: ojChartEventMap<any, any, any, any>['comboSeriesOrderChanged']) => void;
    oncoordinateSystemChanged?: (value: ojChartEventMap<any, any, any, any>['coordinateSystemChanged']) => void;
    ondataChanged?: (value: ojChartEventMap<any, any, any, any>['dataChanged']) => void;
    ondataCursorChanged?: (value: ojChartEventMap<any, any, any, any>['dataCursorChanged']) => void;
    ondataCursorBehaviorChanged?: (value: ojChartEventMap<any, any, any, any>['dataCursorBehaviorChanged']) => void;
    ondataCursorPositionChanged?: (value: ojChartEventMap<any, any, any, any>['dataCursorPositionChanged']) => void;
    ondataLabelChanged?: (value: ojChartEventMap<any, any, any, any>['dataLabelChanged']) => void;
    ondndChanged?: (value: ojChartEventMap<any, any, any, any>['dndChanged']) => void;
    ondragModeChanged?: (value: ojChartEventMap<any, any, any, any>['dragModeChanged']) => void;
    ondrillingChanged?: (value: ojChartEventMap<any, any, any, any>['drillingChanged']) => void;
    ongroupComparatorChanged?: (value: ojChartEventMap<any, any, any, any>['groupComparatorChanged']) => void;
    onhiddenCategoriesChanged?: (value: ojChartEventMap<any, any, any, any>['hiddenCategoriesChanged']) => void;
    onhideAndShowBehaviorChanged?: (value: ojChartEventMap<any, any, any, any>['hideAndShowBehaviorChanged']) => void;
    onhighlightMatchChanged?: (value: ojChartEventMap<any, any, any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: ojChartEventMap<any, any, any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: ojChartEventMap<any, any, any, any>['hoverBehaviorChanged']) => void;
    oninitialZoomingChanged?: (value: ojChartEventMap<any, any, any, any>['initialZoomingChanged']) => void;
    onlegendChanged?: (value: ojChartEventMap<any, any, any, any>['legendChanged']) => void;
    onmultiSeriesDrillingChanged?: (value: ojChartEventMap<any, any, any, any>['multiSeriesDrillingChanged']) => void;
    onorientationChanged?: (value: ojChartEventMap<any, any, any, any>['orientationChanged']) => void;
    onotherThresholdChanged?: (value: ojChartEventMap<any, any, any, any>['otherThresholdChanged']) => void;
    onoverviewChanged?: (value: ojChartEventMap<any, any, any, any>['overviewChanged']) => void;
    onpieCenterChanged?: (value: ojChartEventMap<any, any, any, any>['pieCenterChanged']) => void;
    onplotAreaChanged?: (value: ojChartEventMap<any, any, any, any>['plotAreaChanged']) => void;
    onpolarGridShapeChanged?: (value: ojChartEventMap<any, any, any, any>['polarGridShapeChanged']) => void;
    onselectionChanged?: (value: ojChartEventMap<any, any, any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: ojChartEventMap<any, any, any, any>['selectionModeChanged']) => void;
    onseriesComparatorChanged?: (value: ojChartEventMap<any, any, any, any>['seriesComparatorChanged']) => void;
    onsortingChanged?: (value: ojChartEventMap<any, any, any, any>['sortingChanged']) => void;
    onsplitDualYChanged?: (value: ojChartEventMap<any, any, any, any>['splitDualYChanged']) => void;
    onsplitterPositionChanged?: (value: ojChartEventMap<any, any, any, any>['splitterPositionChanged']) => void;
    onstackChanged?: (value: ojChartEventMap<any, any, any, any>['stackChanged']) => void;
    onstackLabelChanged?: (value: ojChartEventMap<any, any, any, any>['stackLabelChanged']) => void;
    onstackLabelProviderChanged?: (value: ojChartEventMap<any, any, any, any>['stackLabelProviderChanged']) => void;
    onstyleDefaultsChanged?: (value: ojChartEventMap<any, any, any, any>['styleDefaultsChanged']) => void;
    ontimeAxisTypeChanged?: (value: ojChartEventMap<any, any, any, any>['timeAxisTypeChanged']) => void;
    ontooltipChanged?: (value: ojChartEventMap<any, any, any, any>['tooltipChanged']) => void;
    ontouchResponseChanged?: (value: ojChartEventMap<any, any, any, any>['touchResponseChanged']) => void;
    ontypeChanged?: (value: ojChartEventMap<any, any, any, any>['typeChanged']) => void;
    onvalueFormatsChanged?: (value: ojChartEventMap<any, any, any, any>['valueFormatsChanged']) => void;
    onxAxisChanged?: (value: ojChartEventMap<any, any, any, any>['xAxisChanged']) => void;
    ony2AxisChanged?: (value: ojChartEventMap<any, any, any, any>['y2AxisChanged']) => void;
    onyAxisChanged?: (value: ojChartEventMap<any, any, any, any>['yAxisChanged']) => void;
    onzoomAndScrollChanged?: (value: ojChartEventMap<any, any, any, any>['zoomAndScrollChanged']) => void;
    onzoomDirectionChanged?: (value: ojChartEventMap<any, any, any, any>['zoomDirectionChanged']) => void;
    ontrackResizeChanged?: (value: ojChartEventMap<any, any, any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface ChartGroupIntrinsicProps extends Partial<Readonly<ojChartGroupSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondrillingChanged?: (value: ojChartGroupEventMap['drillingChanged']) => void;
    onlabelStyleChanged?: (value: ojChartGroupEventMap['labelStyleChanged']) => void;
    onnameChanged?: (value: ojChartGroupEventMap['nameChanged']) => void;
    onshortDescChanged?: (value: ojChartGroupEventMap['shortDescChanged']) => void;
    children?: ComponentChildren;
}
export interface ChartItemIntrinsicProps extends Partial<Readonly<ojChartItemSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojChartItemEventMap<any, any, any>['borderColorChanged']) => void;
    onborderWidthChanged?: (value: ojChartItemEventMap<any, any, any>['borderWidthChanged']) => void;
    onboxPlotChanged?: (value: ojChartItemEventMap<any, any, any>['boxPlotChanged']) => void;
    oncategoriesChanged?: (value: ojChartItemEventMap<any, any, any>['categoriesChanged']) => void;
    oncloseChanged?: (value: ojChartItemEventMap<any, any, any>['closeChanged']) => void;
    oncolorChanged?: (value: ojChartItemEventMap<any, any, any>['colorChanged']) => void;
    ondrillingChanged?: (value: ojChartItemEventMap<any, any, any>['drillingChanged']) => void;
    ongroupIdChanged?: (value: ojChartItemEventMap<any, any, any>['groupIdChanged']) => void;
    onhighChanged?: (value: ojChartItemEventMap<any, any, any>['highChanged']) => void;
    onitemsChanged?: (value: ojChartItemEventMap<any, any, any>['itemsChanged']) => void;
    onlabelChanged?: (value: ojChartItemEventMap<any, any, any>['labelChanged']) => void;
    onlabelPositionChanged?: (value: ojChartItemEventMap<any, any, any>['labelPositionChanged']) => void;
    onlabelStyleChanged?: (value: ojChartItemEventMap<any, any, any>['labelStyleChanged']) => void;
    onlowChanged?: (value: ojChartItemEventMap<any, any, any>['lowChanged']) => void;
    onmarkerDisplayedChanged?: (value: ojChartItemEventMap<any, any, any>['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: ojChartItemEventMap<any, any, any>['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: ojChartItemEventMap<any, any, any>['markerSizeChanged']) => void;
    onopenChanged?: (value: ojChartItemEventMap<any, any, any>['openChanged']) => void;
    onpatternChanged?: (value: ojChartItemEventMap<any, any, any>['patternChanged']) => void;
    onq1Changed?: (value: ojChartItemEventMap<any, any, any>['q1Changed']) => void;
    onq2Changed?: (value: ojChartItemEventMap<any, any, any>['q2Changed']) => void;
    onq3Changed?: (value: ojChartItemEventMap<any, any, any>['q3Changed']) => void;
    onseriesIdChanged?: (value: ojChartItemEventMap<any, any, any>['seriesIdChanged']) => void;
    onshortDescChanged?: (value: ojChartItemEventMap<any, any, any>['shortDescChanged']) => void;
    onsourceChanged?: (value: ojChartItemEventMap<any, any, any>['sourceChanged']) => void;
    onsourceHoverChanged?: (value: ojChartItemEventMap<any, any, any>['sourceHoverChanged']) => void;
    onsourceHoverSelectedChanged?: (value: ojChartItemEventMap<any, any, any>['sourceHoverSelectedChanged']) => void;
    onsourceSelectedChanged?: (value: ojChartItemEventMap<any, any, any>['sourceSelectedChanged']) => void;
    onsvgClassNameChanged?: (value: ojChartItemEventMap<any, any, any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojChartItemEventMap<any, any, any>['svgStyleChanged']) => void;
    ontargetValueChanged?: (value: ojChartItemEventMap<any, any, any>['targetValueChanged']) => void;
    onvalueChanged?: (value: ojChartItemEventMap<any, any, any>['valueChanged']) => void;
    onvolumeChanged?: (value: ojChartItemEventMap<any, any, any>['volumeChanged']) => void;
    onxChanged?: (value: ojChartItemEventMap<any, any, any>['xChanged']) => void;
    onyChanged?: (value: ojChartItemEventMap<any, any, any>['yChanged']) => void;
    onzChanged?: (value: ojChartItemEventMap<any, any, any>['zChanged']) => void;
    children?: ComponentChildren;
}
export interface ChartSeriesIntrinsicProps extends Partial<Readonly<ojChartSeriesSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onareaColorChanged?: (value: ojChartSeriesEventMap['areaColorChanged']) => void;
    onareaSvgClassNameChanged?: (value: ojChartSeriesEventMap['areaSvgClassNameChanged']) => void;
    onareaSvgStyleChanged?: (value: ojChartSeriesEventMap['areaSvgStyleChanged']) => void;
    onassignedToY2Changed?: (value: ojChartSeriesEventMap['assignedToY2Changed']) => void;
    onborderColorChanged?: (value: ojChartSeriesEventMap['borderColorChanged']) => void;
    onborderWidthChanged?: (value: ojChartSeriesEventMap['borderWidthChanged']) => void;
    onboxPlotChanged?: (value: ojChartSeriesEventMap['boxPlotChanged']) => void;
    oncategoriesChanged?: (value: ojChartSeriesEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: ojChartSeriesEventMap['colorChanged']) => void;
    ondisplayInLegendChanged?: (value: ojChartSeriesEventMap['displayInLegendChanged']) => void;
    ondrillingChanged?: (value: ojChartSeriesEventMap['drillingChanged']) => void;
    onlineStyleChanged?: (value: ojChartSeriesEventMap['lineStyleChanged']) => void;
    onlineTypeChanged?: (value: ojChartSeriesEventMap['lineTypeChanged']) => void;
    onlineWidthChanged?: (value: ojChartSeriesEventMap['lineWidthChanged']) => void;
    onmarkerColorChanged?: (value: ojChartSeriesEventMap['markerColorChanged']) => void;
    onmarkerDisplayedChanged?: (value: ojChartSeriesEventMap['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: ojChartSeriesEventMap['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: ojChartSeriesEventMap['markerSizeChanged']) => void;
    onmarkerSvgClassNameChanged?: (value: ojChartSeriesEventMap['markerSvgClassNameChanged']) => void;
    onmarkerSvgStyleChanged?: (value: ojChartSeriesEventMap['markerSvgStyleChanged']) => void;
    onnameChanged?: (value: ojChartSeriesEventMap['nameChanged']) => void;
    onpatternChanged?: (value: ojChartSeriesEventMap['patternChanged']) => void;
    onpieSliceExplodeChanged?: (value: ojChartSeriesEventMap['pieSliceExplodeChanged']) => void;
    onshortDescChanged?: (value: ojChartSeriesEventMap['shortDescChanged']) => void;
    onsourceChanged?: (value: ojChartSeriesEventMap['sourceChanged']) => void;
    onsourceHoverChanged?: (value: ojChartSeriesEventMap['sourceHoverChanged']) => void;
    onsourceHoverSelectedChanged?: (value: ojChartSeriesEventMap['sourceHoverSelectedChanged']) => void;
    onsourceSelectedChanged?: (value: ojChartSeriesEventMap['sourceSelectedChanged']) => void;
    onstackCategoryChanged?: (value: ojChartSeriesEventMap['stackCategoryChanged']) => void;
    onsvgClassNameChanged?: (value: ojChartSeriesEventMap['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojChartSeriesEventMap['svgStyleChanged']) => void;
    ontypeChanged?: (value: ojChartSeriesEventMap['typeChanged']) => void;
    children?: ComponentChildren;
}
export interface SparkChartIntrinsicProps extends Partial<Readonly<ojSparkChartSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onanimationDurationChanged?: (value: ojSparkChartEventMap<any, any>['animationDurationChanged']) => void;
    onanimationOnDataChangeChanged?: (value: ojSparkChartEventMap<any, any>['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojSparkChartEventMap<any, any>['animationOnDisplayChanged']) => void;
    onareaColorChanged?: (value: ojSparkChartEventMap<any, any>['areaColorChanged']) => void;
    onareaSvgClassNameChanged?: (value: ojSparkChartEventMap<any, any>['areaSvgClassNameChanged']) => void;
    onareaSvgStyleChanged?: (value: ojSparkChartEventMap<any, any>['areaSvgStyleChanged']) => void;
    onasChanged?: (value: ojSparkChartEventMap<any, any>['asChanged']) => void;
    onbarGapRatioChanged?: (value: ojSparkChartEventMap<any, any>['barGapRatioChanged']) => void;
    onbaselineScalingChanged?: (value: ojSparkChartEventMap<any, any>['baselineScalingChanged']) => void;
    oncolorChanged?: (value: ojSparkChartEventMap<any, any>['colorChanged']) => void;
    ondataChanged?: (value: ojSparkChartEventMap<any, any>['dataChanged']) => void;
    onfirstColorChanged?: (value: ojSparkChartEventMap<any, any>['firstColorChanged']) => void;
    onhighColorChanged?: (value: ojSparkChartEventMap<any, any>['highColorChanged']) => void;
    onlastColorChanged?: (value: ojSparkChartEventMap<any, any>['lastColorChanged']) => void;
    onlineStyleChanged?: (value: ojSparkChartEventMap<any, any>['lineStyleChanged']) => void;
    onlineTypeChanged?: (value: ojSparkChartEventMap<any, any>['lineTypeChanged']) => void;
    onlineWidthChanged?: (value: ojSparkChartEventMap<any, any>['lineWidthChanged']) => void;
    onlowColorChanged?: (value: ojSparkChartEventMap<any, any>['lowColorChanged']) => void;
    onmarkerShapeChanged?: (value: ojSparkChartEventMap<any, any>['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: ojSparkChartEventMap<any, any>['markerSizeChanged']) => void;
    onreferenceObjectsChanged?: (value: ojSparkChartEventMap<any, any>['referenceObjectsChanged']) => void;
    onsvgClassNameChanged?: (value: ojSparkChartEventMap<any, any>['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojSparkChartEventMap<any, any>['svgStyleChanged']) => void;
    ontooltipChanged?: (value: ojSparkChartEventMap<any, any>['tooltipChanged']) => void;
    ontypeChanged?: (value: ojSparkChartEventMap<any, any>['typeChanged']) => void;
    onvisualEffectsChanged?: (value: ojSparkChartEventMap<any, any>['visualEffectsChanged']) => void;
    ontrackResizeChanged?: (value: ojSparkChartEventMap<any, any>['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface SparkChartItemIntrinsicProps extends Partial<Readonly<ojSparkChartItemSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojSparkChartItemEventMap['borderColorChanged']) => void;
    oncolorChanged?: (value: ojSparkChartItemEventMap['colorChanged']) => void;
    ondateChanged?: (value: ojSparkChartItemEventMap['dateChanged']) => void;
    onhighChanged?: (value: ojSparkChartItemEventMap['highChanged']) => void;
    onlowChanged?: (value: ojSparkChartItemEventMap['lowChanged']) => void;
    onmarkerDisplayedChanged?: (value: ojSparkChartItemEventMap['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: ojSparkChartItemEventMap['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: ojSparkChartItemEventMap['markerSizeChanged']) => void;
    onsvgClassNameChanged?: (value: ojSparkChartItemEventMap['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojSparkChartItemEventMap['svgStyleChanged']) => void;
    onvalueChanged?: (value: ojSparkChartItemEventMap['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-chart": ChartIntrinsicProps;
            "oj-chart-group": ChartGroupIntrinsicProps;
            "oj-chart-item": ChartItemIntrinsicProps;
            "oj-chart-series": ChartSeriesIntrinsicProps;
            "oj-spark-chart": SparkChartIntrinsicProps;
            "oj-spark-chart-item": SparkChartItemIntrinsicProps;
        }
    }
}
