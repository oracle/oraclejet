/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { baseComponent, baseComponentEventMap, baseComponentSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojLabel extends baseComponent<ojLabelSettableProperties> {
    for: string | null;
    help: {
        definition?: string | null;
        source?: string | null;
    };
    labelId: string | null;
    showRequired: boolean | null;
    translations: {
        tooltipHelp?: string;
        tooltipRequired?: string;
    };
    addEventListener<T extends keyof ojLabelEventMap>(type: T, listener: (this: HTMLElement, ev: ojLabelEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojLabelSettableProperties>(property: T): ojLabel[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojLabelSettableProperties>(property: T, value: ojLabelSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojLabelSettableProperties>): void;
    setProperties(properties: ojLabelSettablePropertiesLenient): void;
    refresh(): void;
}
export namespace ojLabel {
    // tslint:disable-next-line interface-over-type-literal
    type forChanged = JetElementCustomEvent<ojLabel["for"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojLabel["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelIdChanged = JetElementCustomEvent<ojLabel["labelId"]>;
    // tslint:disable-next-line interface-over-type-literal
    type showRequiredChanged = JetElementCustomEvent<ojLabel["showRequired"]>;
}
export interface ojLabelEventMap extends baseComponentEventMap<ojLabelSettableProperties> {
    'forChanged': JetElementCustomEvent<ojLabel["for"]>;
    'helpChanged': JetElementCustomEvent<ojLabel["help"]>;
    'labelIdChanged': JetElementCustomEvent<ojLabel["labelId"]>;
    'showRequiredChanged': JetElementCustomEvent<ojLabel["showRequired"]>;
}
export interface ojLabelSettableProperties extends baseComponentSettableProperties {
    for: string | null;
    help: {
        definition?: string | null;
        source?: string | null;
    };
    labelId: string | null;
    showRequired: boolean | null;
    translations: {
        tooltipHelp?: string;
        tooltipRequired?: string;
    };
}
export interface ojLabelSettablePropertiesLenient extends Partial<ojLabelSettableProperties> {
    [key: string]: any;
}
