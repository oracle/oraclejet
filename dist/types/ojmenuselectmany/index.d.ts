/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DataProvider } from '../ojdataprovider';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojMenuSelectMany extends JetElement<ojMenuSelectManySettableProperties> {
    disabled: boolean;
    options: ojMenuSelectMany.Option[] | DataProvider<any, any> | null;
    value: any[];
    addEventListener<T extends keyof ojMenuSelectManyEventMap>(type: T, listener: (this: HTMLElement, ev: ojMenuSelectManyEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojMenuSelectManySettableProperties>(property: T): ojMenuSelectMany[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojMenuSelectManySettableProperties>(property: T, value: ojMenuSelectManySettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojMenuSelectManySettableProperties>): void;
    setProperties(properties: ojMenuSelectManySettablePropertiesLenient): void;
}
export namespace ojMenuSelectMany {
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojMenuSelectMany["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged = JetElementCustomEvent<ojMenuSelectMany["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojMenuSelectMany["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        id?: string;
        disabled?: boolean;
        label: string;
        value: any;
    };
}
export interface ojMenuSelectManyEventMap extends HTMLElementEventMap {
    'disabledChanged': JetElementCustomEvent<ojMenuSelectMany["disabled"]>;
    'optionsChanged': JetElementCustomEvent<ojMenuSelectMany["options"]>;
    'valueChanged': JetElementCustomEvent<ojMenuSelectMany["value"]>;
}
export interface ojMenuSelectManySettableProperties extends JetSettableProperties {
    disabled: boolean;
    options: ojMenuSelectMany.Option[] | DataProvider<any, any> | null;
    value: any[];
}
export interface ojMenuSelectManySettablePropertiesLenient extends Partial<ojMenuSelectManySettableProperties> {
    [key: string]: any;
}
