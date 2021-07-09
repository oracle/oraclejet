import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojValidationGroup extends JetElement<ojValidationGroupSettableProperties> {
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    addEventListener<T extends keyof ojValidationGroupEventMap>(type: T, listener: (this: HTMLElement, ev: ojValidationGroupEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojValidationGroupSettableProperties>(property: T): ojValidationGroup[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojValidationGroupSettableProperties>(property: T, value: ojValidationGroupSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojValidationGroupSettableProperties>): void;
    setProperties(properties: ojValidationGroupSettablePropertiesLenient): void;
    focusOn(key?: '@firstInvalidShown'): void;
    showMessages(): void;
}
export namespace ojValidationGroup {
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = JetElementCustomEvent<ojValidationGroup["valid"]>;
}
export interface ojValidationGroupEventMap extends HTMLElementEventMap {
    'validChanged': JetElementCustomEvent<ojValidationGroup["valid"]>;
}
export interface ojValidationGroupSettableProperties extends JetSettableProperties {
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
}
export interface ojValidationGroupSettablePropertiesLenient extends Partial<ojValidationGroupSettableProperties> {
    [key: string]: any;
}
export type ValidationGroupElement = ojValidationGroup;
export namespace ValidationGroupElement {
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = JetElementCustomEvent<ojValidationGroup["valid"]>;
}
export interface ValidationGroupIntrinsicProps extends Partial<Readonly<ojValidationGroupSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onvalidChanged?: (value: ojValidationGroupEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-validation-group": ValidationGroupIntrinsicProps;
        }
    }
}
