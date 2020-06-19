/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojRefresher extends baseComponent<ojRefresherSettableProperties> {
    refreshContent: (() => Promise<any>);
    target: Element;
    text: string;
    threshold: number;
    translations: {
        ariaRefreshCompleteLink?: string;
        ariaRefreshLink?: string;
        ariaRefreshingLink?: string;
    };
    addEventListener<T extends keyof ojRefresherEventMap>(type: T, listener: (this: HTMLElement, ev: ojRefresherEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojRefresherSettableProperties>(property: T): ojRefresher[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojRefresherSettableProperties>(property: T, value: ojRefresherSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojRefresherSettableProperties>): void;
    setProperties(properties: ojRefresherSettablePropertiesLenient): void;
}
export namespace ojRefresher {
    // tslint:disable-next-line interface-over-type-literal
    type refreshContentChanged = JetElementCustomEvent<ojRefresher["refreshContent"]>;
    // tslint:disable-next-line interface-over-type-literal
    type targetChanged = JetElementCustomEvent<ojRefresher["target"]>;
    // tslint:disable-next-line interface-over-type-literal
    type textChanged = JetElementCustomEvent<ojRefresher["text"]>;
    // tslint:disable-next-line interface-over-type-literal
    type thresholdChanged = JetElementCustomEvent<ojRefresher["threshold"]>;
}
export interface ojRefresherEventMap extends baseComponentEventMap<ojRefresherSettableProperties> {
    'refreshContentChanged': JetElementCustomEvent<ojRefresher["refreshContent"]>;
    'targetChanged': JetElementCustomEvent<ojRefresher["target"]>;
    'textChanged': JetElementCustomEvent<ojRefresher["text"]>;
    'thresholdChanged': JetElementCustomEvent<ojRefresher["threshold"]>;
}
export interface ojRefresherSettableProperties extends baseComponentSettableProperties {
    refreshContent: (() => Promise<any>);
    target: Element;
    text: string;
    threshold: number;
    translations: {
        ariaRefreshCompleteLink?: string;
        ariaRefreshLink?: string;
        ariaRefreshingLink?: string;
    };
}
export interface ojRefresherSettablePropertiesLenient extends Partial<ojRefresherSettableProperties> {
    [key: string]: any;
}
