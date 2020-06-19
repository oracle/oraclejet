/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import AsyncValidator = require('../ojvalidator-async');
import Validator = require('../ojvalidator');
import Converter = require('../ojconverter');
import { Validation } from '../ojvalidationfactory-base';
import { DataProvider } from '../ojdataprovider';
import RequiredValidator = require('../ojvalidator-required');
import RegExpValidator = require('../ojvalidator-regexp');
import NumberRangeValidator = require('../ojvalidator-numberrange');
import LengthValidator = require('../ojvalidator-length');
import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import DateRestrictionValidator = require('../ojvalidator-daterestriction');
import { IntlDateTimeConverter, DateTimeConverter } from '../ojconverter-datetime';
import { IntlNumberConverter, NumberConverter } from '../ojconverter-number';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojCombobox<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> extends editableValue<V, SP, SV, RV> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    addEventListener<T extends keyof ojComboboxEventMap<V, SP, SV, RV>>(type: T, listener: (this: HTMLElement, ev: ojComboboxEventMap<V, SP, SV, RV>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojComboboxSettableProperties<V, SV, RV>>(property: T): ojCombobox<V, SP, SV, RV>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojComboboxSettableProperties<V, SV, RV>>(property: T, value: ojComboboxSettableProperties<V, SV, RV>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojComboboxSettableProperties<V, SV, RV>>): void;
    setProperties(properties: ojComboboxSettablePropertiesLenient<V, SV, RV>): void;
    refresh(): void;
    validate(): Promise<any>;
}
export namespace ojCombobox {
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
    type displayOptionsChanged<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> = JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Optgroup = {
        disabled?: boolean;
        label: string;
        children: Array<Option | Optgroup>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext = {
        componentElement: Element;
        parent: Element;
        index: number;
        depth: number;
        leaf: boolean;
        data: object;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        label?: string;
        value?: string;
        children?: string;
        childKeys?: OptionsKeys;
    };
}
export interface ojComboboxEventMap<V, SP extends ojComboboxSettableProperties<V, SV, RV>, SV = V, RV = V> extends editableValueEventMap<V, SP, SV, RV> {
    'ojAnimateEnd': ojCombobox.ojAnimateEnd;
    'ojAnimateStart': ojCombobox.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojCombobox<V, SP, SV, RV>["displayOptions"]>;
}
export interface ojComboboxSettableProperties<V, SV = V, RV = V> extends editableValueSettableProperties<V, SV, RV> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
}
export interface ojComboboxSettablePropertiesLenient<V, SV = V, RV = V> extends Partial<ojComboboxSettableProperties<V, SV, RV>> {
    [key: string]: any;
}
export interface ojComboboxMany<K, D, V = any> extends ojCombobox<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]> {
    asyncValidators: Array<AsyncValidator<V[]>>;
    converter: Promise<Converter<V>> | Converter<V> | null;
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readonly rawValue: string[] | null;
    readOnly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojComboboxManyEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojComboboxManyEventMap<K, D, V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojComboboxManySettableProperties<K, D, V>>(property: T): ojComboboxMany<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojComboboxManySettableProperties<K, D, V>>(property: T, value: ojComboboxManySettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojComboboxManySettableProperties<K, D, V>>): void;
    setProperties(properties: ojComboboxManySettablePropertiesLenient<K, D, V>): void;
}
export namespace ojComboboxMany {
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
    type asyncValidatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minLengthChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["minLength"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readOnlyChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["readOnly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxMany<K, D, V>["valueOptions"]>;
}
export interface ojComboboxManyEventMap<K, D, V = any> extends ojComboboxEventMap<V[], ojComboboxManySettableProperties<K, D, V>, V[], string[]> {
    'ojAnimateEnd': ojComboboxMany.ojAnimateEnd;
    'ojAnimateStart': ojComboboxMany.ojAnimateStart;
    'asyncValidatorsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["asyncValidators"]>;
    'converterChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["converter"]>;
    'labelledByChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["maximumResultCount"]>;
    'minLengthChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["minLength"]>;
    'optionRendererChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["rawValue"]>;
    'readOnlyChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["readOnly"]>;
    'requiredChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["required"]>;
    'validatorsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["value"]>;
    'valueOptionsChanged': JetElementCustomEvent<ojComboboxMany<K, D, V>["valueOptions"]>;
}
export interface ojComboboxManySettableProperties<K, D, V = any> extends ojComboboxSettableProperties<V[]> {
    asyncValidators: Array<AsyncValidator<V[]>>;
    converter: Promise<Converter<V>> | Converter<V> | null;
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readonly rawValue: string[] | null;
    readOnly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojComboboxManySettablePropertiesLenient<K, D, V = any> extends Partial<ojComboboxManySettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface ojComboboxOne<K, D, V = any> extends ojCombobox<V, ojComboboxOneSettableProperties<K, D, V>, V, string> {
    asyncValidators: Array<AsyncValidator<V>>;
    converter: Promise<Converter<V>> | Converter<V> | null;
    filterOnOpen: 'none' | 'rawValue';
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readonly rawValue: string | null;
    readOnly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V | null;
    valueOption: {
        value: V | null;
        label?: string;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojComboboxOneEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojComboboxOneEventMap<K, D, V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojComboboxOneSettableProperties<K, D, V>>(property: T): ojComboboxOne<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojComboboxOneSettableProperties<K, D, V>>(property: T, value: ojComboboxOneSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojComboboxOneSettableProperties<K, D, V>>): void;
    setProperties(properties: ojComboboxOneSettablePropertiesLenient<K, D, V>): void;
}
export namespace ojComboboxOne {
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
    interface ojValueUpdated extends CustomEvent<{
        value: any;
        previousValue: any;
        [propName: string]: any;
    }> {
    }
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type filterOnOpenChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["filterOnOpen"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minLengthChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["minLength"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readOnlyChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["readOnly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionChanged<K, D, V = any> = JetElementCustomEvent<ojComboboxOne<K, D, V>["valueOption"]>;
}
export interface ojComboboxOneEventMap<K, D, V = any> extends ojComboboxEventMap<V, ojComboboxOneSettableProperties<K, D, V>, V, string> {
    'ojAnimateEnd': ojComboboxOne.ojAnimateEnd;
    'ojAnimateStart': ojComboboxOne.ojAnimateStart;
    'ojValueUpdated': ojComboboxOne.ojValueUpdated;
    'asyncValidatorsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["asyncValidators"]>;
    'converterChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["converter"]>;
    'filterOnOpenChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["filterOnOpen"]>;
    'labelledByChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["maximumResultCount"]>;
    'minLengthChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["minLength"]>;
    'optionRendererChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["rawValue"]>;
    'readOnlyChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["readOnly"]>;
    'requiredChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["required"]>;
    'validatorsChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["value"]>;
    'valueOptionChanged': JetElementCustomEvent<ojComboboxOne<K, D, V>["valueOption"]>;
}
export interface ojComboboxOneSettableProperties<K, D, V = any> extends ojComboboxSettableProperties<V> {
    asyncValidators: Array<AsyncValidator<V>>;
    converter: Promise<Converter<V>> | Converter<V> | null;
    filterOnOpen: 'none' | 'rawValue';
    labelledBy: string | null;
    maximumResultCount: number;
    minLength: number;
    optionRenderer?: ((param0: ojCombobox.OptionContext) => Element) | null;
    options: Array<ojCombobox.Option | ojCombobox.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojCombobox.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readonly rawValue: string | null;
    readOnly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    value: V | null;
    valueOption: {
        value: V | null;
        label?: string;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojComboboxOneSettablePropertiesLenient<K, D, V = any> extends Partial<ojComboboxOneSettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface ojSelect<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> extends editableValue<V, SP, SV> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    addEventListener<T extends keyof ojSelectEventMap<V, SP, SV>>(type: T, listener: (this: HTMLElement, ev: ojSelectEventMap<V, SP, SV>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSelectSettableProperties<V, SV>>(property: T): ojSelect<V, SP, SV>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectSettableProperties<V, SV>>(property: T, value: ojSelectSettableProperties<V, SV>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectSettableProperties<V, SV>>): void;
    setProperties(properties: ojSelectSettablePropertiesLenient<V, SV>): void;
    refresh(): void;
    validate(): Promise<any>;
}
export namespace ojSelect {
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
    type displayOptionsChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = JetElementCustomEvent<ojSelect<V, SP, SV>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> = JetElementCustomEvent<ojSelect<V, SP, SV>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type Optgroup = {
        disabled?: boolean;
        label: string;
        children: Array<(Option | Optgroup)>;
    };
    // tslint:disable-next-line interface-over-type-literal
    type Option = {
        disabled?: boolean;
        label?: string;
        value: any;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionContext = {
        componentElement: Element;
        parent: Element;
        index: number;
        depth: number;
        leaf: boolean;
        data: object;
        parentElement: Element;
    };
    // tslint:disable-next-line interface-over-type-literal
    type OptionsKeys = {
        label?: string;
        value?: string;
        children?: string;
        childKeys?: (OptionsKeys);
    };
}
export interface ojSelectEventMap<V, SP extends ojSelectSettableProperties<V, SV>, SV = V> extends editableValueEventMap<V, SP, SV> {
    'ojAnimateEnd': ojSelect.ojAnimateEnd;
    'ojAnimateStart': ojSelect.ojAnimateStart;
    'displayOptionsChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojSelect<V, SP, SV>["labelledBy"]>;
}
export interface ojSelectSettableProperties<V, SV = V> extends editableValueSettableProperties<V, SV> {
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
}
export interface ojSelectSettablePropertiesLenient<V, SV = V> extends Partial<ojSelectSettableProperties<V, SV>> {
    [key: string]: any;
}
export interface ojSelectMany<K, D, V = any> extends ojSelect<V[], ojSelectManySettableProperties<K, D, V>> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readOnly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
    addEventListener<T extends keyof ojSelectManyEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojSelectManyEventMap<K, D, V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSelectManySettableProperties<K, D, V>>(property: T): ojSelectMany<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectManySettableProperties<K, D, V>>(property: T, value: ojSelectManySettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectManySettableProperties<K, D, V>>): void;
    setProperties(properties: ojSelectManySettablePropertiesLenient<K, D, V>): void;
}
export namespace ojSelectMany {
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
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minimumResultsForSearchChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["minimumResultsForSearch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readOnlyChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["readOnly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectMany<K, D, V>["valueOptions"]>;
}
export interface ojSelectManyEventMap<K, D, V = any> extends ojSelectEventMap<V[], ojSelectManySettableProperties<K, D, V>> {
    'ojAnimateEnd': ojSelectMany.ojAnimateEnd;
    'ojAnimateStart': ojSelectMany.ojAnimateStart;
    'labelledByChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["maximumResultCount"]>;
    'minimumResultsForSearchChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["minimumResultsForSearch"]>;
    'optionRendererChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["placeholder"]>;
    'readOnlyChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["readOnly"]>;
    'renderModeChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["renderMode"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["value"]>;
    'valueOptionsChanged': JetElementCustomEvent<ojSelectMany<K, D, V>["valueOptions"]>;
}
export interface ojSelectManySettableProperties<K, D, V = any[]> extends ojSelectSettableProperties<V[]> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readOnly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V[] | null;
    valueOptions: Array<{
        value: V;
        label?: string;
    }> | null;
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
}
export interface ojSelectManySettablePropertiesLenient<K, D, V = any[]> extends Partial<ojSelectManySettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface ojSelectOne<K, D, V = any> extends ojSelect<V, ojSelectOneSettableProperties<K, D, V>> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readOnly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V | null;
    valueOption: {
        value: V | null;
        label?: string;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
    addEventListener<T extends keyof ojSelectOneEventMap<K, D, V>>(type: T, listener: (this: HTMLElement, ev: ojSelectOneEventMap<K, D, V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojSelectOneSettableProperties<K, D, V>>(property: T): ojSelectOne<K, D, V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojSelectOneSettableProperties<K, D, V>>(property: T, value: ojSelectOneSettableProperties<K, D, V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojSelectOneSettableProperties<K, D, V>>): void;
    setProperties(properties: ojSelectOneSettablePropertiesLenient<K, D, V>): void;
}
export namespace ojSelectOne {
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
    type labelledByChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maximumResultCountChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["maximumResultCount"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minimumResultsForSearchChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["minimumResultsForSearch"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionRendererChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["optionRenderer"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["options"]>;
    // tslint:disable-next-line interface-over-type-literal
    type optionsKeysChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["optionsKeys"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readOnlyChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["readOnly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueOptionChanged<K, D, V = any> = JetElementCustomEvent<ojSelectOne<K, D, V>["valueOption"]>;
}
export interface ojSelectOneEventMap<K, D, V = any> extends ojSelectEventMap<V, ojSelectOneSettableProperties<K, D, V>> {
    'ojAnimateEnd': ojSelectOne.ojAnimateEnd;
    'ojAnimateStart': ojSelectOne.ojAnimateStart;
    'labelledByChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["labelledBy"]>;
    'maximumResultCountChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["maximumResultCount"]>;
    'minimumResultsForSearchChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["minimumResultsForSearch"]>;
    'optionRendererChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["optionRenderer"]>;
    'optionsChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["options"]>;
    'optionsKeysChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["optionsKeys"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["placeholder"]>;
    'readOnlyChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["readOnly"]>;
    'renderModeChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["renderMode"]>;
    'requiredChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["required"]>;
    'valueChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["value"]>;
    'valueOptionChanged': JetElementCustomEvent<ojSelectOne<K, D, V>["valueOption"]>;
}
export interface ojSelectOneSettableProperties<K, D, V = any> extends ojSelectSettableProperties<V> {
    labelledBy: string | null;
    maximumResultCount: number;
    minimumResultsForSearch: number;
    optionRenderer?: ((param0: ojSelect.OptionContext) => Element) | null;
    options: Array<ojSelect.Option | ojSelect.Optgroup> | DataProvider<K, D> | null;
    optionsKeys: ojSelect.OptionsKeys | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    placeholder: string | null;
    readOnly: boolean;
    renderMode: 'jet' | 'native';
    required: boolean;
    value: V | null;
    valueOption: {
        value: V | null;
        label?: string;
    };
    translations: {
        filterFurther?: string;
        moreMatchesFound?: string;
        noMatchesFound?: string;
        oneMatchesFound?: string;
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        searchField?: string;
    };
}
export interface ojSelectOneSettablePropertiesLenient<K, D, V = any> extends Partial<ojSelectOneSettableProperties<K, D, V>> {
    [key: string]: any;
}
export interface Optgroup {
    children: Array<(Option | Optgroup)>;
    disabled?: boolean;
    label: string;
}
export interface Option {
    disabled?: boolean;
    label?: string;
    value: object;
}
