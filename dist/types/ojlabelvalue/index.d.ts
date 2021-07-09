import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojLabelValue extends JetElement<ojLabelValueSettableProperties> {
    colspan: number;
    labelEdge: 'inside' | 'start' | 'top' | 'inherit';
    labelWidth: string;
    addEventListener<T extends keyof ojLabelValueEventMap>(type: T, listener: (this: HTMLElement, ev: ojLabelValueEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojLabelValueSettableProperties>(property: T): ojLabelValue[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLabelValueSettableProperties>(property: T, value: ojLabelValueSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLabelValueSettableProperties>): void;
    setProperties(properties: ojLabelValueSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojLabelValue {
    // tslint:disable-next-line interface-over-type-literal
    type colspanChanged = JetElementCustomEvent<ojLabelValue["colspan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojLabelValue["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelWidthChanged = JetElementCustomEvent<ojLabelValue["labelWidth"]>;
}
export interface ojLabelValueEventMap extends HTMLElementEventMap {
    'colspanChanged': JetElementCustomEvent<ojLabelValue["colspan"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojLabelValue["labelEdge"]>;
    'labelWidthChanged': JetElementCustomEvent<ojLabelValue["labelWidth"]>;
}
export interface ojLabelValueSettableProperties extends JetSettableProperties {
    colspan: number;
    labelEdge: 'inside' | 'start' | 'top' | 'inherit';
    labelWidth: string;
}
export interface ojLabelValueSettablePropertiesLenient extends Partial<ojLabelValueSettableProperties> {
    [key: string]: any;
}
export type LabelValueElement = ojLabelValue;
export namespace LabelValueElement {
    // tslint:disable-next-line interface-over-type-literal
    type colspanChanged = JetElementCustomEvent<ojLabelValue["colspan"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojLabelValue["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelWidthChanged = JetElementCustomEvent<ojLabelValue["labelWidth"]>;
}
export interface LabelValueIntrinsicProps extends Partial<Readonly<ojLabelValueSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncolspanChanged?: (value: ojLabelValueEventMap['colspanChanged']) => void;
    onlabelEdgeChanged?: (value: ojLabelValueEventMap['labelEdgeChanged']) => void;
    onlabelWidthChanged?: (value: ojLabelValueEventMap['labelWidthChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-label-value": LabelValueIntrinsicProps;
        }
    }
}
