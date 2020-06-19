/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojProgress extends baseComponent<ojProgressSettableProperties> {
    max: number;
    type: 'bar' | 'circle';
    value: number;
    translations: {
        ariaIndeterminateProgressText?: string;
    };
    addEventListener<T extends keyof ojProgressEventMap>(type: T, listener: (this: HTMLElement, ev: ojProgressEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojProgressSettableProperties>(property: T): ojProgress[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojProgressSettableProperties>(property: T, value: ojProgressSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojProgressSettableProperties>): void;
    setProperties(properties: ojProgressSettablePropertiesLenient): void;
}
export namespace ojProgress {
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojProgress["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type typeChanged = JetElementCustomEvent<ojProgress["type"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojProgress["value"]>;
}
export interface ojProgressEventMap extends baseComponentEventMap<ojProgressSettableProperties> {
    'maxChanged': JetElementCustomEvent<ojProgress["max"]>;
    'typeChanged': JetElementCustomEvent<ojProgress["type"]>;
    'valueChanged': JetElementCustomEvent<ojProgress["value"]>;
}
export interface ojProgressSettableProperties extends baseComponentSettableProperties {
    max: number;
    type: 'bar' | 'circle';
    value: number;
    translations: {
        ariaIndeterminateProgressText?: string;
    };
}
export interface ojProgressSettablePropertiesLenient extends Partial<ojProgressSettableProperties> {
    [key: string]: any;
}
