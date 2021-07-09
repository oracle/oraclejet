import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojOption extends JetElement<ojOptionSettableProperties> {
    disabled: boolean;
    value: any;
    addEventListener<T extends keyof ojOptionEventMap>(type: T, listener: (this: HTMLElement, ev: ojOptionEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojOptionSettableProperties>(property: T): ojOption[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojOptionSettableProperties>(property: T, value: ojOptionSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojOptionSettableProperties>): void;
    setProperties(properties: ojOptionSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojOption {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojOption["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojOption["value"]>;
}
export interface ojOptionEventMap extends HTMLElementEventMap {
    'disabledChanged': JetElementCustomEvent<ojOption["disabled"]>;
    'valueChanged': JetElementCustomEvent<ojOption["value"]>;
}
export interface ojOptionSettableProperties extends JetSettableProperties {
    disabled: boolean;
    value: any;
}
export interface ojOptionSettablePropertiesLenient extends Partial<ojOptionSettableProperties> {
    [key: string]: any;
}
export type OptionElement = ojOption;
export namespace OptionElement {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojOption["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojOption["value"]>;
}
export interface OptionIntrinsicProps extends Partial<Readonly<ojOptionSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondisabledChanged?: (value: ojOptionEventMap['disabledChanged']) => void;
    onvalueChanged?: (value: ojOptionEventMap['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-option": OptionIntrinsicProps;
        }
    }
}
