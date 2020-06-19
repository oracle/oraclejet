/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojValidationGroup extends JetElement<ojValidationGroupSettableProperties> {
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    addEventListener<T extends keyof ojValidationGroupEventMap>(type: T, listener: (this: HTMLElement, ev: ojValidationGroupEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
