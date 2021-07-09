import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojToolbar extends baseComponent<ojToolbarSettableProperties> {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    addEventListener<T extends keyof ojToolbarEventMap>(type: T, listener: (this: HTMLElement, ev: ojToolbarEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojToolbarSettableProperties>(property: T): ojToolbar[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojToolbarSettableProperties>(property: T, value: ojToolbarSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojToolbarSettableProperties>): void;
    setProperties(properties: ojToolbarSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojToolbar {
    // tslint:disable-next-line interface-over-type-literal
    type chromingChanged = JetElementCustomEvent<ojToolbar["chroming"]>;
}
export interface ojToolbarEventMap extends baseComponentEventMap<ojToolbarSettableProperties> {
    'chromingChanged': JetElementCustomEvent<ojToolbar["chroming"]>;
}
export interface ojToolbarSettableProperties extends baseComponentSettableProperties {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
}
export interface ojToolbarSettablePropertiesLenient extends Partial<ojToolbarSettableProperties> {
    [key: string]: any;
}
export type ToolbarElement = ojToolbar;
export namespace ToolbarElement {
    // tslint:disable-next-line interface-over-type-literal
    type chromingChanged = JetElementCustomEvent<ojToolbar["chroming"]>;
}
export interface ToolbarIntrinsicProps extends Partial<Readonly<ojToolbarSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onchromingChanged?: (value: ojToolbarEventMap['chromingChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-toolbar": ToolbarIntrinsicProps;
        }
    }
}
