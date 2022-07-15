import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DvtTimeComponentScale } from '../ojdvttimecomponentscale';
import Converter = require('../ojconverter');
import { dvtBaseComponent, dvtBaseComponentEventMap, dvtBaseComponentSettableProperties } from '../ojdvt-base';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojTimeAxis extends dvtBaseComponent<ojTimeAxisSettableProperties> {
    converter: ojTimeAxis.Converters | Converter<string>;
    end: string;
    scale?: (string | DvtTimeComponentScale);
    start: string;
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
    addEventListener<T extends keyof ojTimeAxisEventMap>(type: T, listener: (this: HTMLElement, ev: ojTimeAxisEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojTimeAxisSettableProperties>(property: T): ojTimeAxis[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTimeAxisSettableProperties>(property: T, value: ojTimeAxisSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTimeAxisSettableProperties>): void;
    setProperties(properties: ojTimeAxisSettablePropertiesLenient): void;
}
export namespace ojTimeAxis {
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged = JetElementCustomEvent<ojTimeAxis["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged = JetElementCustomEvent<ojTimeAxis["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scaleChanged = JetElementCustomEvent<ojTimeAxis["scale"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged = JetElementCustomEvent<ojTimeAxis["start"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseComponent.trackResizeChanged<ojTimeAxisSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Converters = {
        days?: Converter<string>;
        default?: Converter<string>;
        hours?: Converter<string>;
        minutes?: Converter<string>;
        months?: Converter<string>;
        quarters?: Converter<string>;
        seconds?: Converter<string>;
        weeks?: Converter<string>;
        years?: Converter<string>;
    };
}
export interface ojTimeAxisEventMap extends dvtBaseComponentEventMap<ojTimeAxisSettableProperties> {
    'converterChanged': JetElementCustomEvent<ojTimeAxis["converter"]>;
    'endChanged': JetElementCustomEvent<ojTimeAxis["end"]>;
    'scaleChanged': JetElementCustomEvent<ojTimeAxis["scale"]>;
    'startChanged': JetElementCustomEvent<ojTimeAxis["start"]>;
    'trackResizeChanged': JetElementCustomEvent<ojTimeAxis["trackResize"]>;
}
export interface ojTimeAxisSettableProperties extends dvtBaseComponentSettableProperties {
    converter: ojTimeAxis.Converters | Converter<string>;
    end: string;
    scale?: (string | DvtTimeComponentScale);
    start: string;
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
export interface ojTimeAxisSettablePropertiesLenient extends Partial<ojTimeAxisSettableProperties> {
    [key: string]: any;
}
export type TimeAxisElement = ojTimeAxis;
export namespace TimeAxisElement {
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged = JetElementCustomEvent<ojTimeAxis["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type endChanged = JetElementCustomEvent<ojTimeAxis["end"]>;
    // tslint:disable-next-line interface-over-type-literal
    type scaleChanged = JetElementCustomEvent<ojTimeAxis["scale"]>;
    // tslint:disable-next-line interface-over-type-literal
    type startChanged = JetElementCustomEvent<ojTimeAxis["start"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type trackResizeChanged = dvtBaseComponent.trackResizeChanged<ojTimeAxisSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type Converters = {
        days?: Converter<string>;
        default?: Converter<string>;
        hours?: Converter<string>;
        minutes?: Converter<string>;
        months?: Converter<string>;
        quarters?: Converter<string>;
        seconds?: Converter<string>;
        weeks?: Converter<string>;
        years?: Converter<string>;
    };
}
export interface TimeAxisIntrinsicProps extends Partial<Readonly<ojTimeAxisSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onconverterChanged?: (value: ojTimeAxisEventMap['converterChanged']) => void;
    onendChanged?: (value: ojTimeAxisEventMap['endChanged']) => void;
    onscaleChanged?: (value: ojTimeAxisEventMap['scaleChanged']) => void;
    onstartChanged?: (value: ojTimeAxisEventMap['startChanged']) => void;
    ontrackResizeChanged?: (value: ojTimeAxisEventMap['trackResizeChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-time-axis": TimeAxisIntrinsicProps;
        }
    }
}
