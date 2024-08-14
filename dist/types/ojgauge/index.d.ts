import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import Converter = require('../ojconverter');
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface dvtBaseGauge<SP extends dvtBaseGaugeSettableProperties = dvtBaseGaugeSettableProperties> extends dvtBaseComponent<SP> {
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
    addEventListener<T extends keyof dvtBaseGaugeEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: dvtBaseGaugeEventMap<SP>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof dvtBaseGaugeSettableProperties>(property: T): dvtBaseGauge<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof dvtBaseGaugeSettableProperties>(property: T, value: dvtBaseGaugeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, dvtBaseGaugeSettableProperties>): void;
    setProperties(properties: dvtBaseGaugeSettablePropertiesLenient): void;
}
export namespace dvtBaseGauge {
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged<SP extends dvtBaseGaugeSettableProperties = dvtBaseGaugeSettableProperties> = dvtBaseComponent.trackResizeChanged<SP>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
// These interfaces are empty but required to keep the event chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface dvtBaseGaugeEventMap<SP extends dvtBaseGaugeSettableProperties = dvtBaseGaugeSettableProperties> extends dvtBaseComponentEventMap<SP> {
    'trackResizeChanged': JetElementCustomEvent<dvtBaseGauge<SP>["trackResize"]>;
}
export interface dvtBaseGaugeSettableProperties extends dvtBaseComponentSettableProperties {
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
export interface dvtBaseGaugeSettablePropertiesLenient extends Partial<dvtBaseGaugeSettableProperties> {
    [key: string]: any;
}
export interface ojLedGauge extends dvtBaseGauge<ojLedGaugeSettableProperties> {
    borderColor?: string;
    color?: string;
    label?: {
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
    };
    markerSize?: 'sm' | 'md' | 'lg' | 'fit';
    max?: number;
    metricLabel?: {
        converter?: Converter<string>;
        rendered?: 'on' | 'off';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min?: number;
    rotation?: 90 | 180 | 270 | 0;
    size?: number;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    thresholds?: ojLedGauge.Threshold[];
    tooltip?: {
        renderer: ((context: ojLedGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    type?: 'arrow' | 'diamond' | 'square' | 'rectangle' | 'triangle' | 'star' | 'human' | 'circle' | string;
    value: number | null;
    visualEffects?: 'none' | 'auto';
    addEventListener<T extends keyof ojLedGaugeEventMap>(type: T, listener: (this: HTMLElement, ev: ojLedGaugeEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojLedGaugeSettableProperties>(property: T): ojLedGauge[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLedGaugeSettableProperties>(property: T, value: ojLedGaugeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLedGaugeSettableProperties>): void;
    setProperties(properties: ojLedGaugeSettablePropertiesLenient): void;
}
export namespace ojLedGauge {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojLedGauge["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojLedGauge["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojLedGauge["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged = JetElementCustomEvent<ojLedGauge["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojLedGauge["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type metricLabelChanged = JetElementCustomEvent<ojLedGauge["metricLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojLedGauge["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged = JetElementCustomEvent<ojLedGauge["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeChanged = JetElementCustomEvent<ojLedGauge["size"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojLedGauge["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojLedGauge["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdsChanged = JetElementCustomEvent<ojLedGauge["thresholds"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged = JetElementCustomEvent<ojLedGauge["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojLedGauge["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojLedGauge["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged = JetElementCustomEvent<ojLedGauge["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseGauge.trackResizeChanged<ojLedGaugeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Threshold = {
        borderColor?: string;
        color?: string;
        max?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        label: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export interface ojLedGaugeEventMap extends dvtBaseGaugeEventMap<ojLedGaugeSettableProperties> {
    'borderColorChanged': JetElementCustomEvent<ojLedGauge["borderColor"]>;
    'colorChanged': JetElementCustomEvent<ojLedGauge["color"]>;
    'labelChanged': JetElementCustomEvent<ojLedGauge["label"]>;
    'markerSizeChanged': JetElementCustomEvent<ojLedGauge["markerSize"]>;
    'maxChanged': JetElementCustomEvent<ojLedGauge["max"]>;
    'metricLabelChanged': JetElementCustomEvent<ojLedGauge["metricLabel"]>;
    'minChanged': JetElementCustomEvent<ojLedGauge["min"]>;
    'rotationChanged': JetElementCustomEvent<ojLedGauge["rotation"]>;
    'sizeChanged': JetElementCustomEvent<ojLedGauge["size"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojLedGauge["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojLedGauge["svgStyle"]>;
    'thresholdsChanged': JetElementCustomEvent<ojLedGauge["thresholds"]>;
    'tooltipChanged': JetElementCustomEvent<ojLedGauge["tooltip"]>;
    'typeChanged': JetElementCustomEvent<ojLedGauge["type"]>;
    'valueChanged': JetElementCustomEvent<ojLedGauge["value"]>;
    'visualEffectsChanged': JetElementCustomEvent<ojLedGauge["visualEffects"]>;
    'trackResizeChanged': JetElementCustomEvent<ojLedGauge["trackResize"]>;
}
export interface ojLedGaugeSettableProperties extends dvtBaseGaugeSettableProperties {
    borderColor?: string;
    color?: string;
    label?: {
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
    };
    markerSize?: 'sm' | 'md' | 'lg' | 'fit';
    max?: number;
    metricLabel?: {
        converter?: Converter<string>;
        rendered?: 'on' | 'off';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min?: number;
    rotation?: 90 | 180 | 270 | 0;
    size?: number;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    thresholds?: ojLedGauge.Threshold[];
    tooltip?: {
        renderer: ((context: ojLedGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    type?: 'arrow' | 'diamond' | 'square' | 'rectangle' | 'triangle' | 'star' | 'human' | 'circle' | string;
    value: number | null;
    visualEffects?: 'none' | 'auto';
}
export interface ojLedGaugeSettablePropertiesLenient extends Partial<ojLedGaugeSettableProperties> {
    [key: string]: any;
}
export interface ojRatingGauge extends dvtBaseGauge<ojRatingGaugeSettableProperties> {
    changed?: boolean;
    changedState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    describedBy?: string | null;
    disabled?: boolean;
    hoverState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    labelledBy?: string | null;
    max?: number;
    min?: number;
    orientation?: 'vertical' | 'horizontal';
    preserveAspectRatio?: 'none' | 'meet';
    readonly?: boolean;
    selectedState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    size?: 'sm' | 'md' | 'lg' | 'fit' | 'small' | 'medium' | 'large';
    step?: 0.5 | 1 | number;
    thresholds?: ojRatingGauge.Threshold[];
    tooltip?: {
        renderer: ((context: ojRatingGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue?: number | null;
    unselectedState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    value: number | null;
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
    addEventListener<T extends keyof ojRatingGaugeEventMap>(type: T, listener: (this: HTMLElement, ev: ojRatingGaugeEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojRatingGaugeSettableProperties>(property: T): ojRatingGauge[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojRatingGaugeSettableProperties>(property: T, value: ojRatingGaugeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojRatingGaugeSettableProperties>): void;
    setProperties(properties: ojRatingGaugeSettablePropertiesLenient): void;
}
export namespace ojRatingGauge {
    // tslint:disable-next-line interface-over-type-literal
    type changedChanged = JetElementCustomEvent<ojRatingGauge["changed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type changedStateChanged = JetElementCustomEvent<ojRatingGauge["changedState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojRatingGauge["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojRatingGauge["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverStateChanged = JetElementCustomEvent<ojRatingGauge["hoverState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojRatingGauge["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojRatingGauge["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojRatingGauge["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojRatingGauge["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type preserveAspectRatioChanged = JetElementCustomEvent<ojRatingGauge["preserveAspectRatio"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojRatingGauge["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedStateChanged = JetElementCustomEvent<ojRatingGauge["selectedState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeChanged = JetElementCustomEvent<ojRatingGauge["size"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojRatingGauge["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdsChanged = JetElementCustomEvent<ojRatingGauge["thresholds"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged = JetElementCustomEvent<ojRatingGauge["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojRatingGauge["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type unselectedStateChanged = JetElementCustomEvent<ojRatingGauge["unselectedState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojRatingGauge["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged = JetElementCustomEvent<ojRatingGauge["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseGauge.trackResizeChanged<ojRatingGaugeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Threshold = {
        borderColor?: string;
        color?: string;
        max?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        label: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export interface ojRatingGaugeEventMap extends dvtBaseGaugeEventMap<ojRatingGaugeSettableProperties> {
    'changedChanged': JetElementCustomEvent<ojRatingGauge["changed"]>;
    'changedStateChanged': JetElementCustomEvent<ojRatingGauge["changedState"]>;
    'describedByChanged': JetElementCustomEvent<ojRatingGauge["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojRatingGauge["disabled"]>;
    'hoverStateChanged': JetElementCustomEvent<ojRatingGauge["hoverState"]>;
    'labelledByChanged': JetElementCustomEvent<ojRatingGauge["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojRatingGauge["max"]>;
    'minChanged': JetElementCustomEvent<ojRatingGauge["min"]>;
    'orientationChanged': JetElementCustomEvent<ojRatingGauge["orientation"]>;
    'preserveAspectRatioChanged': JetElementCustomEvent<ojRatingGauge["preserveAspectRatio"]>;
    'readonlyChanged': JetElementCustomEvent<ojRatingGauge["readonly"]>;
    'selectedStateChanged': JetElementCustomEvent<ojRatingGauge["selectedState"]>;
    'sizeChanged': JetElementCustomEvent<ojRatingGauge["size"]>;
    'stepChanged': JetElementCustomEvent<ojRatingGauge["step"]>;
    'thresholdsChanged': JetElementCustomEvent<ojRatingGauge["thresholds"]>;
    'tooltipChanged': JetElementCustomEvent<ojRatingGauge["tooltip"]>;
    'transientValueChanged': JetElementCustomEvent<ojRatingGauge["transientValue"]>;
    'unselectedStateChanged': JetElementCustomEvent<ojRatingGauge["unselectedState"]>;
    'valueChanged': JetElementCustomEvent<ojRatingGauge["value"]>;
    'visualEffectsChanged': JetElementCustomEvent<ojRatingGauge["visualEffects"]>;
    'trackResizeChanged': JetElementCustomEvent<ojRatingGauge["trackResize"]>;
}
export interface ojRatingGaugeSettableProperties extends dvtBaseGaugeSettableProperties {
    changed?: boolean;
    changedState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    describedBy?: string | null;
    disabled?: boolean;
    hoverState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    labelledBy?: string | null;
    max?: number;
    min?: number;
    orientation?: 'vertical' | 'horizontal';
    preserveAspectRatio?: 'none' | 'meet';
    readonly?: boolean;
    selectedState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    size?: 'sm' | 'md' | 'lg' | 'fit' | 'small' | 'medium' | 'large';
    step?: 0.5 | 1 | number;
    thresholds?: ojRatingGauge.Threshold[];
    tooltip?: {
        renderer: ((context: ojRatingGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue?: number | null;
    unselectedState?: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    value: number | null;
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
export interface ojRatingGaugeSettablePropertiesLenient extends Partial<ojRatingGaugeSettableProperties> {
    [key: string]: any;
}
export interface ojStatusMeterGauge extends dvtBaseGauge<ojStatusMeterGaugeSettableProperties> {
    angleExtent?: number;
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    borderColor?: string;
    borderRadius?: string;
    center?: {
        renderer: ((context: ojStatusMeterGauge.CenterContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    color?: string;
    describedBy?: string | null;
    indicatorSize?: number;
    innerRadius?: number;
    label?: {
        position?: 'center' | 'start' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
    };
    labelledBy?: string | null;
    max?: number;
    metricLabel?: {
        converter?: Converter<string | number>;
        position?: 'center' | 'insideIndicatorEdge' | 'outsideIndicatorEdge' | 'outsidePlotArea' | 'withLabel' | 'auto';
        rendered?: 'on' | 'off' | 'auto';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min?: number;
    orientation?: 'circular' | 'vertical' | 'horizontal';
    plotArea?: {
        borderColor?: string;
        borderRadius?: string;
        color?: string;
        rendered?: 'on' | 'off' | 'auto';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    readonly?: boolean;
    referenceLines?: ojStatusMeterGauge.ReferenceLine[];
    size?: 'sm' | 'md' | 'lg' | 'fit';
    startAngle?: number;
    step?: number | null;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    thresholdDisplay?: 'currentOnly' | 'all' | 'onIndicator';
    thresholds?: ojStatusMeterGauge.Threshold[];
    tooltip?: {
        renderer: ((context: ojStatusMeterGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue?: number | null;
    value: number | null;
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
    addEventListener<T extends keyof ojStatusMeterGaugeEventMap>(type: T, listener: (this: HTMLElement, ev: ojStatusMeterGaugeEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojStatusMeterGaugeSettableProperties>(property: T): ojStatusMeterGauge[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojStatusMeterGaugeSettableProperties>(property: T, value: ojStatusMeterGaugeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojStatusMeterGaugeSettableProperties>): void;
    setProperties(properties: ojStatusMeterGaugeSettablePropertiesLenient): void;
}
export namespace ojStatusMeterGauge {
    // tslint:disable-next-line interface-over-type-literal
    type angleExtentChanged = JetElementCustomEvent<ojStatusMeterGauge["angleExtent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged = JetElementCustomEvent<ojStatusMeterGauge["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged = JetElementCustomEvent<ojStatusMeterGauge["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged = JetElementCustomEvent<ojStatusMeterGauge["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojStatusMeterGauge["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged = JetElementCustomEvent<ojStatusMeterGauge["borderRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type centerChanged = JetElementCustomEvent<ojStatusMeterGauge["center"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojStatusMeterGauge["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojStatusMeterGauge["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorSizeChanged = JetElementCustomEvent<ojStatusMeterGauge["indicatorSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type innerRadiusChanged = JetElementCustomEvent<ojStatusMeterGauge["innerRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojStatusMeterGauge["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojStatusMeterGauge["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojStatusMeterGauge["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type metricLabelChanged = JetElementCustomEvent<ojStatusMeterGauge["metricLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojStatusMeterGauge["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojStatusMeterGauge["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type plotAreaChanged = JetElementCustomEvent<ojStatusMeterGauge["plotArea"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojStatusMeterGauge["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceLinesChanged = JetElementCustomEvent<ojStatusMeterGauge["referenceLines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeChanged = JetElementCustomEvent<ojStatusMeterGauge["size"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startAngleChanged = JetElementCustomEvent<ojStatusMeterGauge["startAngle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojStatusMeterGauge["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojStatusMeterGauge["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojStatusMeterGauge["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdDisplayChanged = JetElementCustomEvent<ojStatusMeterGauge["thresholdDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdsChanged = JetElementCustomEvent<ojStatusMeterGauge["thresholds"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged = JetElementCustomEvent<ojStatusMeterGauge["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojStatusMeterGauge["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojStatusMeterGauge["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged = JetElementCustomEvent<ojStatusMeterGauge["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseGauge.trackResizeChanged<ojStatusMeterGaugeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Bounds = {
        height: number;
        width: number;
        x: number;
        y: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CenterContext = {
        componentElement: Element;
        innerBounds: Bounds;
        metricLabel: string;
        outerBounds: Bounds;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceLine = {
        color?: string;
        lineStyle?: 'dashed' | 'dotted' | 'solid';
        lineWidth?: number;
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Threshold = {
        borderColor?: string;
        color?: string;
        max?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        label: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderCenterTemplate = import('ojs/ojvcomponent').TemplateSlot<CenterContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export interface ojStatusMeterGaugeEventMap extends dvtBaseGaugeEventMap<ojStatusMeterGaugeSettableProperties> {
    'angleExtentChanged': JetElementCustomEvent<ojStatusMeterGauge["angleExtent"]>;
    'animationDurationChanged': JetElementCustomEvent<ojStatusMeterGauge["animationDuration"]>;
    'animationOnDataChangeChanged': JetElementCustomEvent<ojStatusMeterGauge["animationOnDataChange"]>;
    'animationOnDisplayChanged': JetElementCustomEvent<ojStatusMeterGauge["animationOnDisplay"]>;
    'borderColorChanged': JetElementCustomEvent<ojStatusMeterGauge["borderColor"]>;
    'borderRadiusChanged': JetElementCustomEvent<ojStatusMeterGauge["borderRadius"]>;
    'centerChanged': JetElementCustomEvent<ojStatusMeterGauge["center"]>;
    'colorChanged': JetElementCustomEvent<ojStatusMeterGauge["color"]>;
    'describedByChanged': JetElementCustomEvent<ojStatusMeterGauge["describedBy"]>;
    'indicatorSizeChanged': JetElementCustomEvent<ojStatusMeterGauge["indicatorSize"]>;
    'innerRadiusChanged': JetElementCustomEvent<ojStatusMeterGauge["innerRadius"]>;
    'labelChanged': JetElementCustomEvent<ojStatusMeterGauge["label"]>;
    'labelledByChanged': JetElementCustomEvent<ojStatusMeterGauge["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojStatusMeterGauge["max"]>;
    'metricLabelChanged': JetElementCustomEvent<ojStatusMeterGauge["metricLabel"]>;
    'minChanged': JetElementCustomEvent<ojStatusMeterGauge["min"]>;
    'orientationChanged': JetElementCustomEvent<ojStatusMeterGauge["orientation"]>;
    'plotAreaChanged': JetElementCustomEvent<ojStatusMeterGauge["plotArea"]>;
    'readonlyChanged': JetElementCustomEvent<ojStatusMeterGauge["readonly"]>;
    'referenceLinesChanged': JetElementCustomEvent<ojStatusMeterGauge["referenceLines"]>;
    'sizeChanged': JetElementCustomEvent<ojStatusMeterGauge["size"]>;
    'startAngleChanged': JetElementCustomEvent<ojStatusMeterGauge["startAngle"]>;
    'stepChanged': JetElementCustomEvent<ojStatusMeterGauge["step"]>;
    'svgClassNameChanged': JetElementCustomEvent<ojStatusMeterGauge["svgClassName"]>;
    'svgStyleChanged': JetElementCustomEvent<ojStatusMeterGauge["svgStyle"]>;
    'thresholdDisplayChanged': JetElementCustomEvent<ojStatusMeterGauge["thresholdDisplay"]>;
    'thresholdsChanged': JetElementCustomEvent<ojStatusMeterGauge["thresholds"]>;
    'tooltipChanged': JetElementCustomEvent<ojStatusMeterGauge["tooltip"]>;
    'transientValueChanged': JetElementCustomEvent<ojStatusMeterGauge["transientValue"]>;
    'valueChanged': JetElementCustomEvent<ojStatusMeterGauge["value"]>;
    'visualEffectsChanged': JetElementCustomEvent<ojStatusMeterGauge["visualEffects"]>;
    'trackResizeChanged': JetElementCustomEvent<ojStatusMeterGauge["trackResize"]>;
}
export interface ojStatusMeterGaugeSettableProperties extends dvtBaseGaugeSettableProperties {
    angleExtent?: number;
    animationDuration?: number;
    animationOnDataChange?: 'auto' | 'none';
    animationOnDisplay?: 'auto' | 'none';
    borderColor?: string;
    borderRadius?: string;
    center?: {
        renderer: ((context: ojStatusMeterGauge.CenterContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    color?: string;
    describedBy?: string | null;
    indicatorSize?: number;
    innerRadius?: number;
    label?: {
        position?: 'center' | 'start' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
    };
    labelledBy?: string | null;
    max?: number;
    metricLabel?: {
        converter?: Converter<string | number>;
        position?: 'center' | 'insideIndicatorEdge' | 'outsideIndicatorEdge' | 'outsidePlotArea' | 'withLabel' | 'auto';
        rendered?: 'on' | 'off' | 'auto';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: Partial<CSSStyleDeclaration>;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min?: number;
    orientation?: 'circular' | 'vertical' | 'horizontal';
    plotArea?: {
        borderColor?: string;
        borderRadius?: string;
        color?: string;
        rendered?: 'on' | 'off' | 'auto';
        svgClassName?: string;
        svgStyle?: Partial<CSSStyleDeclaration>;
    };
    readonly?: boolean;
    referenceLines?: ojStatusMeterGauge.ReferenceLine[];
    size?: 'sm' | 'md' | 'lg' | 'fit';
    startAngle?: number;
    step?: number | null;
    svgClassName?: string;
    svgStyle?: Partial<CSSStyleDeclaration>;
    thresholdDisplay?: 'currentOnly' | 'all' | 'onIndicator';
    thresholds?: ojStatusMeterGauge.Threshold[];
    tooltip?: {
        renderer: ((context: ojStatusMeterGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue?: number | null;
    value: number | null;
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
export interface ojStatusMeterGaugeSettablePropertiesLenient extends Partial<ojStatusMeterGaugeSettableProperties> {
    [key: string]: any;
}
export type LedGaugeElement = ojLedGauge;
export type RatingGaugeElement = ojRatingGauge;
export type StatusMeterGaugeElement = ojStatusMeterGauge;
export namespace LedGaugeElement {
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojLedGauge["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojLedGauge["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojLedGauge["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type markerSizeChanged = JetElementCustomEvent<ojLedGauge["markerSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojLedGauge["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type metricLabelChanged = JetElementCustomEvent<ojLedGauge["metricLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojLedGauge["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rotationChanged = JetElementCustomEvent<ojLedGauge["rotation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeChanged = JetElementCustomEvent<ojLedGauge["size"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojLedGauge["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojLedGauge["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdsChanged = JetElementCustomEvent<ojLedGauge["thresholds"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged = JetElementCustomEvent<ojLedGauge["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojLedGauge["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojLedGauge["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged = JetElementCustomEvent<ojLedGauge["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseGauge.trackResizeChanged<ojLedGaugeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Threshold = {
        borderColor?: string;
        color?: string;
        max?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        label: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export namespace RatingGaugeElement {
    // tslint:disable-next-line interface-over-type-literal
    type changedChanged = JetElementCustomEvent<ojRatingGauge["changed"]>;
    // tslint:disable-next-line interface-over-type-literal
    type changedStateChanged = JetElementCustomEvent<ojRatingGauge["changedState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojRatingGauge["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojRatingGauge["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type hoverStateChanged = JetElementCustomEvent<ojRatingGauge["hoverState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojRatingGauge["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojRatingGauge["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojRatingGauge["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojRatingGauge["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type preserveAspectRatioChanged = JetElementCustomEvent<ojRatingGauge["preserveAspectRatio"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojRatingGauge["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type selectedStateChanged = JetElementCustomEvent<ojRatingGauge["selectedState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeChanged = JetElementCustomEvent<ojRatingGauge["size"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojRatingGauge["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdsChanged = JetElementCustomEvent<ojRatingGauge["thresholds"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged = JetElementCustomEvent<ojRatingGauge["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojRatingGauge["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type unselectedStateChanged = JetElementCustomEvent<ojRatingGauge["unselectedState"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojRatingGauge["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged = JetElementCustomEvent<ojRatingGauge["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseGauge.trackResizeChanged<ojRatingGaugeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Threshold = {
        borderColor?: string;
        color?: string;
        max?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        label: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export namespace StatusMeterGaugeElement {
    // tslint:disable-next-line interface-over-type-literal
    type angleExtentChanged = JetElementCustomEvent<ojStatusMeterGauge["angleExtent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationDurationChanged = JetElementCustomEvent<ojStatusMeterGauge["animationDuration"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDataChangeChanged = JetElementCustomEvent<ojStatusMeterGauge["animationOnDataChange"]>;
    // tslint:disable-next-line interface-over-type-literal
    type animationOnDisplayChanged = JetElementCustomEvent<ojStatusMeterGauge["animationOnDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderColorChanged = JetElementCustomEvent<ojStatusMeterGauge["borderColor"]>;
    // tslint:disable-next-line interface-over-type-literal
    type borderRadiusChanged = JetElementCustomEvent<ojStatusMeterGauge["borderRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type centerChanged = JetElementCustomEvent<ojStatusMeterGauge["center"]>;
    // tslint:disable-next-line interface-over-type-literal
    type colorChanged = JetElementCustomEvent<ojStatusMeterGauge["color"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojStatusMeterGauge["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type indicatorSizeChanged = JetElementCustomEvent<ojStatusMeterGauge["indicatorSize"]>;
    // tslint:disable-next-line interface-over-type-literal
    type innerRadiusChanged = JetElementCustomEvent<ojStatusMeterGauge["innerRadius"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojStatusMeterGauge["label"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojStatusMeterGauge["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojStatusMeterGauge["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type metricLabelChanged = JetElementCustomEvent<ojStatusMeterGauge["metricLabel"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojStatusMeterGauge["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type orientationChanged = JetElementCustomEvent<ojStatusMeterGauge["orientation"]>;
    // tslint:disable-next-line interface-over-type-literal
    type plotAreaChanged = JetElementCustomEvent<ojStatusMeterGauge["plotArea"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojStatusMeterGauge["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type referenceLinesChanged = JetElementCustomEvent<ojStatusMeterGauge["referenceLines"]>;
    // tslint:disable-next-line interface-over-type-literal
    type sizeChanged = JetElementCustomEvent<ojStatusMeterGauge["size"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startAngleChanged = JetElementCustomEvent<ojStatusMeterGauge["startAngle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojStatusMeterGauge["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgClassNameChanged = JetElementCustomEvent<ojStatusMeterGauge["svgClassName"]>;
    // tslint:disable-next-line interface-over-type-literal
    type svgStyleChanged = JetElementCustomEvent<ojStatusMeterGauge["svgStyle"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdDisplayChanged = JetElementCustomEvent<ojStatusMeterGauge["thresholdDisplay"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdsChanged = JetElementCustomEvent<ojStatusMeterGauge["thresholds"]>;
    // tslint:disable-next-line interface-over-type-literal
    type tooltipChanged = JetElementCustomEvent<ojStatusMeterGauge["tooltip"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojStatusMeterGauge["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojStatusMeterGauge["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type visualEffectsChanged = JetElementCustomEvent<ojStatusMeterGauge["visualEffects"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseGauge.trackResizeChanged<ojStatusMeterGaugeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Bounds = {
        height: number;
        width: number;
        x: number;
        y: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type CenterContext = {
        componentElement: Element;
        innerBounds: ojStatusMeterGauge.Bounds;
        metricLabel: string;
        outerBounds: ojStatusMeterGauge.Bounds;
    };
    // tslint:disable-next-line interface-over-type-literal
    type ReferenceLine = {
        color?: string;
        lineStyle?: 'dashed' | 'dotted' | 'solid';
        lineWidth?: number;
        value?: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Threshold = {
        borderColor?: string;
        color?: string;
        max?: number;
        shortDesc?: string;
    };
    // tslint:disable-next-line interface-over-type-literal
    type TooltipContext = {
        color: string;
        componentElement: Element;
        label: string;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type RenderCenterTemplate = import('ojs/ojvcomponent').TemplateSlot<CenterContext>;
    // tslint:disable-next-line interface-over-type-literal
    type RenderTooltipTemplate = import('ojs/ojvcomponent').TemplateSlot<TooltipContext>;
}
export interface LedGaugeIntrinsicProps extends Partial<Readonly<ojLedGaugeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onborderColorChanged?: (value: ojLedGaugeEventMap['borderColorChanged']) => void;
    oncolorChanged?: (value: ojLedGaugeEventMap['colorChanged']) => void;
    onlabelChanged?: (value: ojLedGaugeEventMap['labelChanged']) => void;
    onmarkerSizeChanged?: (value: ojLedGaugeEventMap['markerSizeChanged']) => void;
    onmaxChanged?: (value: ojLedGaugeEventMap['maxChanged']) => void;
    onmetricLabelChanged?: (value: ojLedGaugeEventMap['metricLabelChanged']) => void;
    onminChanged?: (value: ojLedGaugeEventMap['minChanged']) => void;
    onrotationChanged?: (value: ojLedGaugeEventMap['rotationChanged']) => void;
    onsizeChanged?: (value: ojLedGaugeEventMap['sizeChanged']) => void;
    onsvgClassNameChanged?: (value: ojLedGaugeEventMap['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojLedGaugeEventMap['svgStyleChanged']) => void;
    onthresholdsChanged?: (value: ojLedGaugeEventMap['thresholdsChanged']) => void;
    ontooltipChanged?: (value: ojLedGaugeEventMap['tooltipChanged']) => void;
    ontypeChanged?: (value: ojLedGaugeEventMap['typeChanged']) => void;
    onvalueChanged?: (value: ojLedGaugeEventMap['valueChanged']) => void;
    onvisualEffectsChanged?: (value: ojLedGaugeEventMap['visualEffectsChanged']) => void;
    ontrackResizeChanged?: (value: ojLedGaugeEventMap['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface RatingGaugeIntrinsicProps extends Partial<Readonly<ojRatingGaugeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onchangedChanged?: (value: ojRatingGaugeEventMap['changedChanged']) => void;
    onchangedStateChanged?: (value: ojRatingGaugeEventMap['changedStateChanged']) => void;
    ondescribedByChanged?: (value: ojRatingGaugeEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojRatingGaugeEventMap['disabledChanged']) => void;
    onhoverStateChanged?: (value: ojRatingGaugeEventMap['hoverStateChanged']) => void;
    onlabelledByChanged?: (value: ojRatingGaugeEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojRatingGaugeEventMap['maxChanged']) => void;
    onminChanged?: (value: ojRatingGaugeEventMap['minChanged']) => void;
    onorientationChanged?: (value: ojRatingGaugeEventMap['orientationChanged']) => void;
    onpreserveAspectRatioChanged?: (value: ojRatingGaugeEventMap['preserveAspectRatioChanged']) => void;
    onreadonlyChanged?: (value: ojRatingGaugeEventMap['readonlyChanged']) => void;
    onselectedStateChanged?: (value: ojRatingGaugeEventMap['selectedStateChanged']) => void;
    onsizeChanged?: (value: ojRatingGaugeEventMap['sizeChanged']) => void;
    onstepChanged?: (value: ojRatingGaugeEventMap['stepChanged']) => void;
    onthresholdsChanged?: (value: ojRatingGaugeEventMap['thresholdsChanged']) => void;
    ontooltipChanged?: (value: ojRatingGaugeEventMap['tooltipChanged']) => void;
    ontransientValueChanged?: (value: ojRatingGaugeEventMap['transientValueChanged']) => void;
    onunselectedStateChanged?: (value: ojRatingGaugeEventMap['unselectedStateChanged']) => void;
    onvalueChanged?: (value: ojRatingGaugeEventMap['valueChanged']) => void;
    onvisualEffectsChanged?: (value: ojRatingGaugeEventMap['visualEffectsChanged']) => void;
    ontrackResizeChanged?: (value: ojRatingGaugeEventMap['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
export interface StatusMeterGaugeIntrinsicProps extends Partial<Readonly<ojStatusMeterGaugeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onangleExtentChanged?: (value: ojStatusMeterGaugeEventMap['angleExtentChanged']) => void;
    onanimationDurationChanged?: (value: ojStatusMeterGaugeEventMap['animationDurationChanged']) => void;
    onanimationOnDataChangeChanged?: (value: ojStatusMeterGaugeEventMap['animationOnDataChangeChanged']) => void;
    onanimationOnDisplayChanged?: (value: ojStatusMeterGaugeEventMap['animationOnDisplayChanged']) => void;
    onborderColorChanged?: (value: ojStatusMeterGaugeEventMap['borderColorChanged']) => void;
    onborderRadiusChanged?: (value: ojStatusMeterGaugeEventMap['borderRadiusChanged']) => void;
    oncenterChanged?: (value: ojStatusMeterGaugeEventMap['centerChanged']) => void;
    oncolorChanged?: (value: ojStatusMeterGaugeEventMap['colorChanged']) => void;
    ondescribedByChanged?: (value: ojStatusMeterGaugeEventMap['describedByChanged']) => void;
    onindicatorSizeChanged?: (value: ojStatusMeterGaugeEventMap['indicatorSizeChanged']) => void;
    oninnerRadiusChanged?: (value: ojStatusMeterGaugeEventMap['innerRadiusChanged']) => void;
    onlabelChanged?: (value: ojStatusMeterGaugeEventMap['labelChanged']) => void;
    onlabelledByChanged?: (value: ojStatusMeterGaugeEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojStatusMeterGaugeEventMap['maxChanged']) => void;
    onmetricLabelChanged?: (value: ojStatusMeterGaugeEventMap['metricLabelChanged']) => void;
    onminChanged?: (value: ojStatusMeterGaugeEventMap['minChanged']) => void;
    onorientationChanged?: (value: ojStatusMeterGaugeEventMap['orientationChanged']) => void;
    onplotAreaChanged?: (value: ojStatusMeterGaugeEventMap['plotAreaChanged']) => void;
    onreadonlyChanged?: (value: ojStatusMeterGaugeEventMap['readonlyChanged']) => void;
    onreferenceLinesChanged?: (value: ojStatusMeterGaugeEventMap['referenceLinesChanged']) => void;
    onsizeChanged?: (value: ojStatusMeterGaugeEventMap['sizeChanged']) => void;
    onstartAngleChanged?: (value: ojStatusMeterGaugeEventMap['startAngleChanged']) => void;
    onstepChanged?: (value: ojStatusMeterGaugeEventMap['stepChanged']) => void;
    onsvgClassNameChanged?: (value: ojStatusMeterGaugeEventMap['svgClassNameChanged']) => void;
    onsvgStyleChanged?: (value: ojStatusMeterGaugeEventMap['svgStyleChanged']) => void;
    onthresholdDisplayChanged?: (value: ojStatusMeterGaugeEventMap['thresholdDisplayChanged']) => void;
    onthresholdsChanged?: (value: ojStatusMeterGaugeEventMap['thresholdsChanged']) => void;
    ontooltipChanged?: (value: ojStatusMeterGaugeEventMap['tooltipChanged']) => void;
    ontransientValueChanged?: (value: ojStatusMeterGaugeEventMap['transientValueChanged']) => void;
    onvalueChanged?: (value: ojStatusMeterGaugeEventMap['valueChanged']) => void;
    onvisualEffectsChanged?: (value: ojStatusMeterGaugeEventMap['visualEffectsChanged']) => void;
    ontrackResizeChanged?: (value: ojStatusMeterGaugeEventMap['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-led-gauge": LedGaugeIntrinsicProps;
            "oj-rating-gauge": RatingGaugeIntrinsicProps;
            "oj-status-meter-gauge": StatusMeterGaugeIntrinsicProps;
        }
    }
}
