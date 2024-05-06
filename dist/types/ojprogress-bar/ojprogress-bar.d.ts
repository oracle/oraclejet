import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from 'ojs/ojvcomponent';
import { Component, ComponentChild } from 'preact';
type Props = {
    max?: number;
    value?: number;
};
export declare class ProgressBar extends Component<ExtendGlobalProps<Props>> {
    static defaultProps: Partial<Props>;
    render(props: ExtendGlobalProps<Props>): ComponentChild;
    private _renderDeterminateBar;
    private _renderIndeterminateBar;
}
export {};
export interface ProgressBarElement extends JetElement<ProgressBarElementSettableProperties>, ProgressBarElementSettableProperties {
    addEventListener<T extends keyof ProgressBarElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProgressBarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ProgressBarElementSettableProperties>(property: T): ProgressBarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ProgressBarElementSettableProperties>(property: T, value: ProgressBarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProgressBarElementSettableProperties>): void;
    setProperties(properties: ProgressBarElementSettablePropertiesLenient): void;
}
export namespace ProgressBarElement {
    type maxChanged = JetElementCustomEventStrict<ProgressBarElement['max']>;
    type valueChanged = JetElementCustomEventStrict<ProgressBarElement['value']>;
}
export interface ProgressBarElementEventMap extends HTMLElementEventMap {
    'maxChanged': JetElementCustomEventStrict<ProgressBarElement['max']>;
    'valueChanged': JetElementCustomEventStrict<ProgressBarElement['value']>;
}
export interface ProgressBarElementSettableProperties extends JetSettableProperties {
    max?: Props['max'];
    value?: Props['value'];
}
export interface ProgressBarElementSettablePropertiesLenient extends Partial<ProgressBarElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressBarIntrinsicProps extends Partial<Readonly<ProgressBarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmaxChanged?: (value: ProgressBarElementEventMap['maxChanged']) => void;
    onvalueChanged?: (value: ProgressBarElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-progress-bar': ProgressBarIntrinsicProps;
        }
    }
}
