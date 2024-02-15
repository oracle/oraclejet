/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import './oj-requirejs-plugins';
export namespace oj {
    let revision: string;
    let version: string;
}
export interface baseComponent<SP extends baseComponentSettableProperties = baseComponentSettableProperties> extends JetElement<SP> {
    translations: object | null;
    addEventListener<T extends keyof baseComponentEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: baseComponentEventMap<SP>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof baseComponentSettableProperties>(property: T): baseComponent<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof baseComponentSettableProperties>(property: T, value: baseComponentSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, baseComponentSettableProperties>): void;
    setProperties(properties: baseComponentSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace baseComponent {
    // tslint:disable-next-line interface-over-type-literal
    type translationsChanged<SP extends baseComponentSettableProperties = baseComponentSettableProperties> = JetElementCustomEvent<baseComponent<SP>["translations"]>;
}
export interface baseComponentEventMap<SP extends baseComponentSettableProperties = baseComponentSettableProperties> extends HTMLElementEventMap {
    'translationsChanged': JetElementCustomEvent<baseComponent<SP>["translations"]>;
}
export interface baseComponentSettableProperties extends JetSettableProperties {
    translations: object | null;
}
export interface baseComponentSettablePropertiesLenient extends Partial<baseComponentSettableProperties> {
    [key: string]: any;
}
export interface GenericSetter<SP> {
    set<K extends keyof SP>(propertyName: K, propertyValue: SP[K]): void;
    unset(propertyName: keyof SP): void;
}
export interface JetElement<SP> extends HTMLElement, GenericSetter<SP> {
    set<K extends keyof SP>(propertyName: K, propertyValue: SP[K]): void;
    unset(propertyName: keyof SP): void;
    addEventListener<T extends keyof HTMLElementEventMap>(type: T, listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof JetSettableProperties>(property: T): JetElement<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof JetSettableProperties>(property: T, value: JetSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, JetSettableProperties>): void;
    setProperties(properties: JetSettableProperties): void;
}
export interface JetElementCustomEvent<V> extends CustomEvent<{
    value: V;
    previousValue: V;
    updatedFrom: 'external' | 'internal';
    subproperty: {
        path: string;
        value: any;
        previousValue: any;
        [key: string]: any;
    };
    [key: string]: any;
}> {
}
export interface JetElementCustomEventStrict<V> extends CustomEvent<{
    value: V;
    previousValue: V;
    updatedFrom: 'external' | 'internal';
    subproperty: {
        path: string;
        value: any;
        previousValue: any;
    };
}> {
}
// This interfaces is empty but required to keep the component chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface JetSettableProperties {
}
export type JetSetPropertyType<K, U extends JetSettableProperties> = K extends keyof U ? U[K] : any;
