/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import RequiredValidator = require('../ojvalidator-required');
import RegExpValidator = require('../ojvalidator-regexp');
import NumberRangeValidator = require('../ojvalidator-numberrange');
import LengthValidator = require('../ojvalidator-length');
import { IntlNumberConverter, NumberConverter } from '../ojconverter-number';
import AsyncValidator = require('../ojvalidator-async');
import Validator = require('../ojvalidator');
import Converter = require('../ojconverter');
import { Validation } from '../ojvalidationfactory-base';
import { editableValue, editableValueEventMap, editableValueSettableProperties } from '../ojeditablevalue';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojInputNumber extends editableValue<number | null, ojInputNumberSettableProperties, number | null, string> {
    asyncValidators: Array<AsyncValidator<number>>;
    autocomplete: 'on' | 'off' | string;
    autofocus: boolean;
    converter: Promise<Converter<number>> | Converter<number>;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    max: number | null;
    min: number | null;
    placeholder: string | null;
    readonly rawValue: string;
    readonly: boolean | null;
    required: boolean;
    step: number | null;
    readonly transientValue: number | null;
    validators: Array<Validator<number> | AsyncValidator<number>>;
    value: number | null;
    virtualKeyboard: 'auto' | 'number' | 'text';
    translations: {
        numberRange?: {
            hint?: {
                exact?: string;
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                exact?: string;
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        tooltipDecrement?: string;
        tooltipIncrement?: string;
    };
    addEventListener<T extends keyof ojInputNumberEventMap>(type: T, listener: (this: HTMLElement, ev: ojInputNumberEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
    getProperty<T extends keyof ojInputNumberSettableProperties>(property: T): ojInputNumber[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojInputNumberSettableProperties>(property: T, value: ojInputNumberSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojInputNumberSettableProperties>): void;
    setProperties(properties: ojInputNumberSettablePropertiesLenient): void;
    refresh(): void;
    stepDown(steps?: number): void;
    stepUp(steps?: number): void;
    validate(): Promise<string>;
}
export namespace ojInputNumber {
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
    type asyncValidatorsChanged = JetElementCustomEvent<ojInputNumber["asyncValidators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged = JetElementCustomEvent<ojInputNumber["autocomplete"]>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = JetElementCustomEvent<ojInputNumber["autofocus"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged = JetElementCustomEvent<ojInputNumber["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojInputNumber["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojInputNumber["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojInputNumber["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojInputNumber["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojInputNumber["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojInputNumber["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = JetElementCustomEvent<ojInputNumber["readonly"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = JetElementCustomEvent<ojInputNumber["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type stepChanged = JetElementCustomEvent<ojInputNumber["step"]>;
    // tslint:disable-next-line interface-over-type-literal
    type transientValueChanged = JetElementCustomEvent<ojInputNumber["transientValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojInputNumber["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojInputNumber["value"]>;
    // tslint:disable-next-line interface-over-type-literal
    type virtualKeyboardChanged = JetElementCustomEvent<ojInputNumber["virtualKeyboard"]>;
}
export interface ojInputNumberEventMap extends editableValueEventMap<number | null, ojInputNumberSettableProperties, number | null, string> {
    'ojAnimateEnd': ojInputNumber.ojAnimateEnd;
    'ojAnimateStart': ojInputNumber.ojAnimateStart;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputNumber["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojInputNumber["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputNumber["autofocus"]>;
    'converterChanged': JetElementCustomEvent<ojInputNumber["converter"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputNumber["displayOptions"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputNumber["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojInputNumber["max"]>;
    'minChanged': JetElementCustomEvent<ojInputNumber["min"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputNumber["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputNumber["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputNumber["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojInputNumber["required"]>;
    'stepChanged': JetElementCustomEvent<ojInputNumber["step"]>;
    'transientValueChanged': JetElementCustomEvent<ojInputNumber["transientValue"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputNumber["validators"]>;
    'valueChanged': JetElementCustomEvent<ojInputNumber["value"]>;
    'virtualKeyboardChanged': JetElementCustomEvent<ojInputNumber["virtualKeyboard"]>;
}
export interface ojInputNumberSettableProperties extends editableValueSettableProperties<number | null, number | null, string> {
    asyncValidators: Array<AsyncValidator<number>>;
    autocomplete: 'on' | 'off' | string;
    autofocus: boolean;
    converter: Promise<Converter<number>> | Converter<number>;
    displayOptions: {
        converterHint: Array<'placeholder' | 'notewindow' | 'none'> | 'placeholder' | 'notewindow' | 'none';
        helpInstruction: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages: Array<'inline' | 'notewindow' | 'none'> | 'inline' | 'notewindow' | 'none';
        validatorHint: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
    };
    labelledBy: string | null;
    max: number | null;
    min: number | null;
    placeholder: string | null;
    readonly rawValue: string;
    readonly: boolean | null;
    required: boolean;
    step: number | null;
    readonly transientValue: number | null;
    validators: Array<Validator<number> | AsyncValidator<number>>;
    value: number | null;
    virtualKeyboard: 'auto' | 'number' | 'text';
    translations: {
        numberRange?: {
            hint?: {
                exact?: string;
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                exact?: string;
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        tooltipDecrement?: string;
        tooltipIncrement?: string;
    };
}
export interface ojInputNumberSettablePropertiesLenient extends Partial<ojInputNumberSettableProperties> {
    [key: string]: any;
}
