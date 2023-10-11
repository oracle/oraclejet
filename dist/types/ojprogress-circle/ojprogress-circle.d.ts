import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
type Props = {
    max?: number;
    value?: number;
    size?: 'sm' | 'md' | 'lg';
};
export declare class ProgressCircle extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Partial<Props>;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _renderIndeterminateCircle;
    private _renderDeterminateCircle;
    private _getClipPath;
    private _calculateTangent;
}
export {};
export interface ProgressCircleElement extends JetElement<ProgressCircleElementSettableProperties>, ProgressCircleElementSettableProperties {
    addEventListener<T extends keyof ProgressCircleElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProgressCircleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ProgressCircleElementSettableProperties>(property: T): ProgressCircleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ProgressCircleElementSettableProperties>(property: T, value: ProgressCircleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProgressCircleElementSettableProperties>): void;
    setProperties(properties: ProgressCircleElementSettablePropertiesLenient): void;
}
export namespace ProgressCircleElement {
    type maxChanged = JetElementCustomEventStrict<ProgressCircleElement['max']>;
    type sizeChanged = JetElementCustomEventStrict<ProgressCircleElement['size']>;
    type valueChanged = JetElementCustomEventStrict<ProgressCircleElement['value']>;
}
export interface ProgressCircleElementEventMap extends HTMLElementEventMap {
    'maxChanged': JetElementCustomEventStrict<ProgressCircleElement['max']>;
    'sizeChanged': JetElementCustomEventStrict<ProgressCircleElement['size']>;
    'valueChanged': JetElementCustomEventStrict<ProgressCircleElement['value']>;
}
export interface ProgressCircleElementSettableProperties extends JetSettableProperties {
    max?: Props['max'];
    size?: Props['size'];
    value?: Props['value'];
}
export interface ProgressCircleElementSettablePropertiesLenient extends Partial<ProgressCircleElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressCircleIntrinsicProps extends Partial<Readonly<ProgressCircleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmaxChanged?: (value: ProgressCircleElementEventMap['maxChanged']) => void;
    onsizeChanged?: (value: ProgressCircleElementEventMap['sizeChanged']) => void;
    onvalueChanged?: (value: ProgressCircleElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-progress-circle': ProgressCircleIntrinsicProps;
        }
    }
}
