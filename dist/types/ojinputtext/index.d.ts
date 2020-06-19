/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { IntlDateTimeConverter, DateTimeConverter } from '../ojconverter-datetime';
import ColorConverter = require('../ojconverter-color');
import { IntlNumberConverter, NumberConverter } from '../ojconverter-number';
import RequiredValidator = require('../ojvalidator-required');
import RegExpValidator = require('../ojvalidator-regexp');
import NumberRangeValidator = require('../ojvalidator-numberrange');
import LengthValidator = require('../ojvalidator-length');
import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import DateRestrictionValidator = require('../ojvalidator-daterestriction');
import AsyncValidator = require('../ojvalidator-async');
import Validator = require('../ojvalidator');
import Converter = require('../ojconverter');
import { Validation } from '../ojvalidationfactory-base';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface inputBase<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> extends editableValue<V, SP, SV, RV> {
    asyncValidators: Array<AsyncValidator<V>>;
    autocomplete: 'on' | 'off' | string;
    autofocus: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    placeholder: string;
    readonly rawValue: RV;
    readonly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof inputBaseEventMap<V, SP, SV, RV>>(type: T, listener: (this: HTMLElement, ev: inputBaseEventMap<V, SP, SV, RV>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof inputBaseSettableProperties<V, SV, RV>>(property: T): inputBase<V, SP, SV, RV>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof inputBaseSettableProperties<V, SV, RV>>(property: T, value: inputBaseSettableProperties<V, SV, RV>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, inputBaseSettableProperties<V, SV, RV>>): void;
    setProperties(properties: inputBaseSettablePropertiesLenient<V, SV, RV>): void;
    refresh(): void;
    validate(): Promise<'valid' | 'invalid'>;
}
export namespace inputBase {
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
    type asyncValidatorsChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["autocomplete"]>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["autofocus"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = JetElementCustomEvent<inputBase<V, SP, SV, RV>["validators"]>;
}
export interface inputBaseEventMap<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> extends editableValueEventMap<V, SP, SV, RV> {
    'ojAnimateEnd': inputBase.ojAnimateEnd;
    'ojAnimateStart': inputBase.ojAnimateStart;
    'asyncValidatorsChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["autofocus"]>;
    'displayOptionsChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["labelledBy"]>;
    'placeholderChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["required"]>;
    'validatorsChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["validators"]>;
}
export interface inputBaseSettableProperties<V, SV = V, RV = V> extends editableValueSettableProperties<V, SV, RV> {
    asyncValidators: Array<AsyncValidator<V>>;
    autocomplete: 'on' | 'off' | string;
    autofocus: boolean;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    placeholder: string;
    readonly rawValue: RV;
    readonly: boolean;
    required: boolean;
    validators: Array<Validator<V> | AsyncValidator<V>> | null;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface inputBaseSettablePropertiesLenient<V, SV = V, RV = V> extends Partial<inputBaseSettableProperties<V, SV, RV>> {
    [key: string]: any;
}
export interface ojInputPassword<V = string> extends inputBase<V, ojInputPasswordSettableProperties<V>> {
    value: V | null;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
    addEventListener<T extends keyof ojInputPasswordEventMap<V>>(type: T, listener: (this: HTMLElement, ev: ojInputPasswordEventMap<V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojInputPasswordSettableProperties<V>>(property: T): ojInputPassword<V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojInputPasswordSettableProperties<V>>(property: T, value: ojInputPasswordSettableProperties<V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojInputPasswordSettableProperties<V>>): void;
    setProperties(properties: ojInputPasswordSettablePropertiesLenient<V>): void;
}
export namespace ojInputPassword {
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
    type valueChanged<V = string> = JetElementCustomEvent<ojInputPassword<V>["value"]>;
}
export interface ojInputPasswordEventMap<V = string> extends inputBaseEventMap<V, ojInputPasswordSettableProperties<V>> {
    'ojAnimateEnd': ojInputPassword.ojAnimateEnd;
    'ojAnimateStart': ojInputPassword.ojAnimateStart;
    'valueChanged': JetElementCustomEvent<ojInputPassword<V>["value"]>;
}
export interface ojInputPasswordSettableProperties<V = string> extends inputBaseSettableProperties<V> {
    value: V | null;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
    };
}
export interface ojInputPasswordSettablePropertiesLenient<V = string> extends Partial<ojInputPasswordSettableProperties<V>> {
    [key: string]: any;
}
export interface ojInputText<V = any> extends inputBase<V, ojInputTextSettableProperties<V>> {
    clearIcon: 'never' | 'always' | 'conditional';
    converter: Promise<Converter<V>> | Converter<V> | null;
    length: {
        countBy: 'codePoint' | 'codeUnit';
        max: number | null;
    };
    list: string;
    virtualKeyboard: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    addEventListener<T extends keyof ojInputTextEventMap<V>>(type: T, listener: (this: HTMLElement, ev: ojInputTextEventMap<V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojInputTextSettableProperties<V>>(property: T): ojInputText<V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojInputTextSettableProperties<V>>(property: T, value: ojInputTextSettableProperties<V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojInputTextSettableProperties<V>>): void;
    setProperties(properties: ojInputTextSettablePropertiesLenient<V>): void;
}
export namespace ojInputText {
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
    type clearIconChanged<V = any> = JetElementCustomEvent<ojInputText<V>["clearIcon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<V = any> = JetElementCustomEvent<ojInputText<V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lengthChanged<V = any> = JetElementCustomEvent<ojInputText<V>["length"]>;
    // tslint:disable-next-line interface-over-type-literal
    type listChanged<V = any> = JetElementCustomEvent<ojInputText<V>["list"]>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged<V = any> = JetElementCustomEvent<ojInputText<V>["virtualKeyboard"]>;
}
export interface ojInputTextEventMap<V = any> extends inputBaseEventMap<V, ojInputTextSettableProperties<V>> {
    'ojAnimateEnd': ojInputText.ojAnimateEnd;
    'ojAnimateStart': ojInputText.ojAnimateStart;
    'clearIconChanged': JetElementCustomEvent<ojInputText<V>["clearIcon"]>;
    'converterChanged': JetElementCustomEvent<ojInputText<V>["converter"]>;
    'lengthChanged': JetElementCustomEvent<ojInputText<V>["length"]>;
    'listChanged': JetElementCustomEvent<ojInputText<V>["list"]>;
    'virtualKeyboardChanged': JetElementCustomEvent<ojInputText<V>["virtualKeyboard"]>;
}
export interface ojInputTextSettableProperties<V = any> extends inputBaseSettableProperties<V> {
    clearIcon: 'never' | 'always' | 'conditional';
    converter: Promise<Converter<V>> | Converter<V> | null;
    length: {
        countBy: 'codePoint' | 'codeUnit';
        max: number | null;
    };
    list: string;
    virtualKeyboard: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
}
export interface ojInputTextSettablePropertiesLenient<V = any> extends Partial<ojInputTextSettableProperties<V>> {
    [key: string]: any;
}
export interface ojTextArea<V = any> extends inputBase<V, ojTextAreaSettableProperties<V>> {
    converter: Promise<Converter<V>> | Converter<V> | null;
    length: {
        countBy: 'codePoint' | 'codeUnit';
        counter: 'none' | 'remaining';
        max: number | null;
    };
    maxRows: number;
    resizeBehavior: 'both' | 'horizontal' | 'vertical' | 'none';
    rows: number;
    addEventListener<T extends keyof ojTextAreaEventMap<V>>(type: T, listener: (this: HTMLElement, ev: ojTextAreaEventMap<V>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojTextAreaSettableProperties<V>>(property: T): ojTextArea<V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojTextAreaSettableProperties<V>>(property: T, value: ojTextAreaSettableProperties<V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojTextAreaSettableProperties<V>>): void;
    setProperties(properties: ojTextAreaSettablePropertiesLenient<V>): void;
}
export namespace ojTextArea {
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
    type converterChanged<V = any> = JetElementCustomEvent<ojTextArea<V>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type lengthChanged<V = any> = JetElementCustomEvent<ojTextArea<V>["length"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxRowsChanged<V = any> = JetElementCustomEvent<ojTextArea<V>["maxRows"]>;
    // tslint:disable-next-line interface-over-type-literal
    type resizeBehaviorChanged<V = any> = JetElementCustomEvent<ojTextArea<V>["resizeBehavior"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rowsChanged<V = any> = JetElementCustomEvent<ojTextArea<V>["rows"]>;
}
export interface ojTextAreaEventMap<V = any> extends inputBaseEventMap<V, ojTextAreaSettableProperties<V>> {
    'ojAnimateEnd': ojTextArea.ojAnimateEnd;
    'ojAnimateStart': ojTextArea.ojAnimateStart;
    'converterChanged': JetElementCustomEvent<ojTextArea<V>["converter"]>;
    'lengthChanged': JetElementCustomEvent<ojTextArea<V>["length"]>;
    'maxRowsChanged': JetElementCustomEvent<ojTextArea<V>["maxRows"]>;
    'resizeBehaviorChanged': JetElementCustomEvent<ojTextArea<V>["resizeBehavior"]>;
    'rowsChanged': JetElementCustomEvent<ojTextArea<V>["rows"]>;
}
export interface ojTextAreaSettableProperties<V = any> extends inputBaseSettableProperties<V> {
    converter: Promise<Converter<V>> | Converter<V> | null;
    length: {
        countBy: 'codePoint' | 'codeUnit';
        counter: 'none' | 'remaining';
        max: number | null;
    };
    maxRows: number;
    resizeBehavior: 'both' | 'horizontal' | 'vertical' | 'none';
    rows: number;
}
export interface ojTextAreaSettablePropertiesLenient<V = any> extends Partial<ojTextAreaSettableProperties<V>> {
    [key: string]: any;
}
