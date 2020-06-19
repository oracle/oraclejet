/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface feedBaseComponent<SP extends feedBaseComponentSettableProperties = feedBaseComponentSettableProperties> extends baseComponent<SP> {
    addEventListener<T extends keyof feedBaseComponentEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: feedBaseComponentEventMap<SP>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof feedBaseComponentSettableProperties>(property: T): feedBaseComponent<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof feedBaseComponentSettableProperties>(property: T, value: feedBaseComponentSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, feedBaseComponentSettableProperties>): void;
    setProperties(properties: feedBaseComponentSettablePropertiesLenient): void;
}
// These interfaces are empty but required to keep the event chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface feedBaseComponentEventMap<SP extends feedBaseComponentSettableProperties = feedBaseComponentSettableProperties> extends baseComponentEventMap<SP> {
}
// These interfaces are empty but required to keep the component chain intact. Avoid lint-rule
// tslint:disable-next-line no-empty-interface
export interface feedBaseComponentSettableProperties extends baseComponentSettableProperties {
}
export interface feedBaseComponentSettablePropertiesLenient extends Partial<feedBaseComponentSettableProperties> {
    [key: string]: any;
}
