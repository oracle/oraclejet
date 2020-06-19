/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojToolbar extends baseComponent<ojToolbarSettableProperties> {
    chroming: 'solid' | 'outlined' | 'borderless' | 'full' | 'half';
    addEventListener<T extends keyof ojToolbarEventMap>(type: T, listener: (this: HTMLElement, ev: ojToolbarEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
