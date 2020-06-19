/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DataProvider } from '../ojdataprovider';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojCheckboxset<K, D, V = any> extends editableValue<V[], ojCheckboxsetSettableProperties<K, D, V>> {
    disabled: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    optionRenderer?: ((param0: ojCheckboxset.OptionContext<D>) => Element) | null;
    options: DataProvider<K, D> | null;
    optionsKeys?: ojCheckboxset.OptionsKeys;
    readOnly: boolean | null;
    required: boolean;
    value: V[] | null;
    translations: {
        readonlyNoValue?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojCheckboxsetEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojCheckboxsetEventMap<K, D, V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojCheckboxsetSettableProperties<K, D, V>>(property: T): ojCheckboxset<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojCheckboxsetSettableProperties<K, D, V>>(property: T, value: ojCheckboxsetSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojCheckboxsetSettableProperties<K, D, V>>): void;
    setProperties(properties: ojCheckboxsetSettablePropertiesLenient<K, D, V>): void;
    refresh(): void;
    validate(): Promise<string>;
}
export namespace ojCheckboxset {
    interface ojAnimateEnd extends CustomEvent<{
        action: string;
        element: Element;
        [propName: string]: any;
    }> {
    }
    interface ojAnimateStart extends CustomEvent<{
        action: string;
        element: Element;
        endCallback: (() => void);
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readOnlyChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["readOnly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojCheckboxset<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext<D> = {
        component: Element;
        index: number;
        data: D;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        label?: string;
        value?: string;
    };
}
export interface ojCheckboxsetEventMap<K, D, V = any> extends editableValueEventMap<V[], ojCheckboxsetSettableProperties<K, D, V>> {
    'ojAnimateEnd': ojCheckboxset.ojAnimateEnd;
    'ojAnimateStart': ojCheckboxset.ojAnimateStart;
    'disabledChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["labelledBy"]>;
    'optionRendererChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["optionsKeys"]>;
    'readOnlyChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["readOnly"]>;
    'requiredChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojCheckboxset<K, D, V>["value"]>;
}
export interface ojCheckboxsetSettableProperties<K, D, V> extends editableValueSettableProperties<V[]> {
    disabled: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    optionRenderer?: ((param0: ojCheckboxset.OptionContext<D>) => Element) | null;
    options: DataProvider<K, D> | null;
    optionsKeys?: ojCheckboxset.OptionsKeys;
    readOnly: boolean | null;
    required: boolean;
    value: V[] | null;
    translations: {
        readonlyNoValue?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojCheckboxsetSettablePropertiesLenient<K, D, V> extends Partial<ojCheckboxsetSettableProperties<K, D, V>> {
    [key: string]: any;
}
