import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojOptgroup extends JetElement<ojOptgroupSettableProperties> {
    disabled: boolean;
    label: string;
    addEventListener<T extends keyof ojOptgroupEventMap>(type: T, listener: (this: HTMLElement, ev: ojOptgroupEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojOptgroupSettableProperties>(property: T): ojOptgroup[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojOptgroupSettableProperties>(property: T, value: ojOptgroupSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojOptgroupSettableProperties>): void;
    setProperties(properties: ojOptgroupSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojOptgroup {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojOptgroup["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojOptgroup["label"]>;
}
export interface ojOptgroupEventMap extends HTMLElementEventMap {
    'disabledChanged': JetElementCustomEvent<ojOptgroup["disabled"]>;
    'labelChanged': JetElementCustomEvent<ojOptgroup["label"]>;
}
export interface ojOptgroupSettableProperties extends JetSettableProperties {
    disabled: boolean;
    label: string;
}
export interface ojOptgroupSettablePropertiesLenient extends Partial<ojOptgroupSettableProperties> {
    [key: string]: any;
}
export type OptgroupElement = ojOptgroup;
export namespace OptgroupElement {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojOptgroup["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelChanged = JetElementCustomEvent<ojOptgroup["label"]>;
}
export interface OptgroupIntrinsicProps extends Partial<Readonly<ojOptgroupSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondisabledChanged?: (value: ojOptgroupEventMap['disabledChanged']) => void;
    onlabelChanged?: (value: ojOptgroupEventMap['labelChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-optgroup": OptgroupIntrinsicProps;
        }
    }
}
