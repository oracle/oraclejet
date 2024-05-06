/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import { DataProvider } from '../ojdataprovider';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojProgressList extends JetElement<ojProgressListSettableProperties> {
    data: DataProvider<any, any> | null;
    addEventListener<T extends keyof ojProgressListEventMap>(type: T, listener: (this: HTMLElement, ev: ojProgressListEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojProgressListSettableProperties>(property: T): ojProgressList[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojProgressListSettableProperties>(property: T, value: ojProgressListSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojProgressListSettableProperties>): void;
    setProperties(properties: ojProgressListSettablePropertiesLenient): void;
}
export namespace ojProgressList {
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged = JetElementCustomEvent<ojProgressList["data"]>;
}
export interface ojProgressListEventMap extends HTMLElementEventMap {
    'dataChanged': JetElementCustomEvent<ojProgressList["data"]>;
}
export interface ojProgressListSettableProperties extends JetSettableProperties {
    data: DataProvider<any, any> | null;
}
export interface ojProgressListSettablePropertiesLenient extends Partial<ojProgressListSettableProperties> {
    [key: string]: any;
}
export interface ProgressItem {
    addEventListener(eventType: ProgressItem.EventType, listener: EventListener): void;
    removeEventListener(eventType: ProgressItem.EventType, listener: EventListener): void;
}
export namespace ProgressItem {
    type EventType = "loadstart" | "progress" | "abort" | "error" | "load" | "timeout" | "loadend";
    type Status = "queued" | "loadstarted" | "aborted" | "errored" | "timedout" | "loaded";
}
export type ProgressListElement = ojProgressList;
export namespace ProgressListElement {
    // tslint:disable-next-line interface-over-type-literal
    type dataChanged = JetElementCustomEvent<ojProgressList["data"]>;
}
export interface ProgressListIntrinsicProps extends Partial<Readonly<ojProgressListSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ondataChanged?: (value: ojProgressListEventMap['dataChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-progress-list": ProgressListIntrinsicProps;
        }
    }
}
