/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Converter = require('../ojconverter');
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface dvtBaseGauge<SP extends dvtBaseGaugeSettableProperties = dvtBaseGaugeSettableProperties> extends dvtBaseComponent<SP> {
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
    addEventListener<T extends keyof dvtBaseGaugeEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: dvtBaseGaugeEventMap<SP>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof dvtBaseGaugeSettableProperties>(property: T): dvtBaseGauge<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof dvtBaseGaugeSettableProperties>(property: T, value: dvtBaseGaugeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, dvtBaseGaugeSettableProperties>): void;
    setProperties(properties: dvtBaseGaugeSettablePropertiesLenient): void;
}
// These interfaces are empty but required to keep the event chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface dvtBaseGaugeEventMap<SP extends dvtBaseGaugeSettableProperties = dvtBaseGaugeSettableProperties> extends dvtBaseComponentEventMap<SP> {
}
export interface dvtBaseGaugeSettableProperties extends dvtBaseComponentSettableProperties {
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
export interface dvtBaseGaugeSettablePropertiesLenient extends Partial<dvtBaseGaugeSettableProperties> {
    [key: string]: any;
}
export interface ojLedGauge extends dvtBaseGauge<ojLedGaugeSettableProperties> {
    borderColor: string;
    color: string;
    label: {
        style?: CSSStyleDeclaration;
        text?: string;
    };
    max: number;
    metricLabel: {
        converter?: Converter<string>;
        rendered?: 'on' | 'off';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: CSSStyleDeclaration;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min: number;
    rotation: 90 | 180 | 270 | 0;
    size: number;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    thresholds: ojLedGauge.Threshold[];
    tooltip: {
        renderer: ((context: ojLedGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    type: 'arrow' | 'diamond' | 'square' | 'rectangle' | 'triangle' | 'star' | 'human' | 'circle';
    value: number | null;
    visualEffects: 'none' | 'auto';
    addEventListener<T extends keyof ojLedGaugeEventMap>(type: T, listener: (this: HTMLElement, ev: ojLedGaugeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
}
export interface ojLedGaugeEventMap extends dvtBaseGaugeEventMap<ojLedGaugeSettableProperties> {
    'borderColorChanged': JetElementCustomEvent<ojLedGauge["borderColor"]>;
    'colorChanged': JetElementCustomEvent<ojLedGauge["color"]>;
    'labelChanged': JetElementCustomEvent<ojLedGauge["label"]>;
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
}
export interface ojLedGaugeSettableProperties extends dvtBaseGaugeSettableProperties {
    borderColor: string;
    color: string;
    label: {
        style?: CSSStyleDeclaration;
        text?: string;
    };
    max: number;
    metricLabel: {
        converter?: Converter<string>;
        rendered?: 'on' | 'off';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: CSSStyleDeclaration;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min: number;
    rotation: 90 | 180 | 270 | 0;
    size: number;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    thresholds: ojLedGauge.Threshold[];
    tooltip: {
        renderer: ((context: ojLedGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    type: 'arrow' | 'diamond' | 'square' | 'rectangle' | 'triangle' | 'star' | 'human' | 'circle';
    value: number | null;
    visualEffects: 'none' | 'auto';
}
export interface ojLedGaugeSettablePropertiesLenient extends Partial<ojLedGaugeSettableProperties> {
    [key: string]: any;
}
export interface ojRatingGauge extends dvtBaseGauge<ojRatingGaugeSettableProperties> {
    changed: boolean;
    changedState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    describedBy: string | null;
    disabled: boolean;
    hoverState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    labelledBy: string | null;
    max: number;
    min: number;
    orientation: 'vertical' | 'horizontal';
    preserveAspectRatio: 'none' | 'meet';
    readonly: boolean;
    selectedState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    step: 0.5 | 1;
    thresholds: ojRatingGauge.Threshold[];
    tooltip: {
        renderer: ((context: ojRatingGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue: number | null;
    unselectedState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    value: number | null;
    visualEffects: 'none' | 'auto';
    addEventListener<T extends keyof ojRatingGaugeEventMap>(type: T, listener: (this: HTMLElement, ev: ojRatingGaugeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    'stepChanged': JetElementCustomEvent<ojRatingGauge["step"]>;
    'thresholdsChanged': JetElementCustomEvent<ojRatingGauge["thresholds"]>;
    'tooltipChanged': JetElementCustomEvent<ojRatingGauge["tooltip"]>;
    'transientValueChanged': JetElementCustomEvent<ojRatingGauge["transientValue"]>;
    'unselectedStateChanged': JetElementCustomEvent<ojRatingGauge["unselectedState"]>;
    'valueChanged': JetElementCustomEvent<ojRatingGauge["value"]>;
    'visualEffectsChanged': JetElementCustomEvent<ojRatingGauge["visualEffects"]>;
}
export interface ojRatingGaugeSettableProperties extends dvtBaseGaugeSettableProperties {
    changed: boolean;
    changedState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    describedBy: string | null;
    disabled: boolean;
    hoverState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    labelledBy: string | null;
    max: number;
    min: number;
    orientation: 'vertical' | 'horizontal';
    preserveAspectRatio: 'none' | 'meet';
    readonly: boolean;
    selectedState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    step: 0.5 | 1;
    thresholds: ojRatingGauge.Threshold[];
    tooltip: {
        renderer: ((context: ojRatingGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue: number | null;
    unselectedState: {
        borderColor?: string;
        color?: string;
        shape?: 'circle' | 'diamond' | 'human' | 'square' | 'star' | 'triangle' | string;
        source?: string;
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    value: number | null;
    visualEffects: 'none' | 'auto';
}
export interface ojRatingGaugeSettablePropertiesLenient extends Partial<ojRatingGaugeSettableProperties> {
    [key: string]: any;
}
export interface ojStatusMeterGauge extends dvtBaseGauge<ojStatusMeterGaugeSettableProperties> {
    angleExtent: number;
    animationDuration?: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    borderColor: string;
    borderRadius: string;
    center: {
        renderer: ((context: ojStatusMeterGauge.CenterContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    color: string;
    describedBy: string | null;
    indicatorSize: number;
    innerRadius: number;
    label: {
        position?: 'center' | 'start' | 'auto';
        style?: CSSStyleDeclaration;
        text?: string;
    };
    labelledBy: string | null;
    max: number;
    metricLabel: {
        converter?: Converter<string>;
        position?: 'center' | 'insideIndicatorEdge' | 'outsideIndicatorEdge' | 'outsidePlotArea' | 'withLabel' | 'auto';
        rendered?: 'on' | 'off' | 'auto';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: CSSStyleDeclaration;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min: number;
    orientation: 'circular' | 'vertical' | 'horizontal';
    plotArea: {
        borderColor?: string;
        borderRadius?: string;
        color?: string;
        rendered?: 'on' | 'off' | 'auto';
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    readonly: boolean;
    referenceLines: ojStatusMeterGauge.ReferenceLine[];
    startAngle: number;
    step: number | null;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    thresholdDisplay: 'currentOnly' | 'all' | 'onIndicator';
    thresholds: ojStatusMeterGauge.Threshold[];
    tooltip: {
        renderer: ((context: ojStatusMeterGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue: number | null;
    value: number | null;
    visualEffects: 'none' | 'auto';
    addEventListener<T extends keyof ojStatusMeterGaugeEventMap>(type: T, listener: (this: HTMLElement, ev: ojStatusMeterGaugeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    // tslint:disable-next-line interface-over-type-literal
    type Bounds = {
        x: number;
        y: number;
        width: number;
        height: number;
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
        value?: number;
        lineWidth?: number;
        lineStyle?: 'dashed' | 'dotted' | 'solid';
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
}
export interface ojStatusMeterGaugeSettableProperties extends dvtBaseGaugeSettableProperties {
    angleExtent: number;
    animationDuration?: number;
    animationOnDataChange: 'auto' | 'none';
    animationOnDisplay: 'auto' | 'none';
    borderColor: string;
    borderRadius: string;
    center: {
        renderer: ((context: ojStatusMeterGauge.CenterContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    color: string;
    describedBy: string | null;
    indicatorSize: number;
    innerRadius: number;
    label: {
        position?: 'center' | 'start' | 'auto';
        style?: CSSStyleDeclaration;
        text?: string;
    };
    labelledBy: string | null;
    max: number;
    metricLabel: {
        converter?: Converter<string>;
        position?: 'center' | 'insideIndicatorEdge' | 'outsideIndicatorEdge' | 'outsidePlotArea' | 'withLabel' | 'auto';
        rendered?: 'on' | 'off' | 'auto';
        scaling?: 'none' | 'thousand' | 'million' | 'billion' | 'trillion' | 'quadrillion' | 'auto';
        style?: CSSStyleDeclaration;
        text?: string;
        textType?: 'percent' | 'number';
    };
    min: number;
    orientation: 'circular' | 'vertical' | 'horizontal';
    plotArea: {
        borderColor?: string;
        borderRadius?: string;
        color?: string;
        rendered?: 'on' | 'off' | 'auto';
        svgClassName?: string;
        svgStyle?: CSSStyleDeclaration;
    };
    readonly: boolean;
    referenceLines: ojStatusMeterGauge.ReferenceLine[];
    startAngle: number;
    step: number | null;
    svgClassName: string;
    svgStyle: CSSStyleDeclaration;
    thresholdDisplay: 'currentOnly' | 'all' | 'onIndicator';
    thresholds: ojStatusMeterGauge.Threshold[];
    tooltip: {
        renderer: ((context: ojStatusMeterGauge.TooltipContext) => ({
            insert: Element | string;
        } | {
            preventDefault: boolean;
        }));
    };
    readonly transientValue: number | null;
    value: number | null;
    visualEffects: 'none' | 'auto';
}
export interface ojStatusMeterGaugeSettablePropertiesLenient extends Partial<ojStatusMeterGaugeSettableProperties> {
    [key: string]: any;
}
