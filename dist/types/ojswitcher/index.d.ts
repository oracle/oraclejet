import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojSwitcher extends JetElement<ojSwitcherSettableProperties> {
    value: string;
    addEventListener<T extends keyof ojSwitcherEventMap>(type: T, listener: (this: HTMLElement, ev: ojSwitcherEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojSwitcherSettableProperties>(property: T): ojSwitcher[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSwitcherSettableProperties>(property: T, value: ojSwitcherSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSwitcherSettableProperties>): void;
    setProperties(properties: ojSwitcherSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojSwitcher {
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSwitcher["value"]>;
}
export interface ojSwitcherEventMap extends HTMLElementEventMap {
    'valueChanged': JetElementCustomEvent<ojSwitcher["value"]>;
}
export interface ojSwitcherSettableProperties extends JetSettableProperties {
    value: string;
}
export interface ojSwitcherSettablePropertiesLenient extends Partial<ojSwitcherSettableProperties> {
    [key: string]: any;
}
export type SwitcherElement = ojSwitcher;
export namespace SwitcherElement {
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojSwitcher["value"]>;
}
export interface SwitcherIntrinsicProps extends Partial<Readonly<ojSwitcherSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onvalueChanged?: (value: ojSwitcherEventMap['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-switcher": SwitcherIntrinsicProps;
        }
    }
}
