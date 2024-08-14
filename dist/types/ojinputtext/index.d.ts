import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
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
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
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
    addEventListener<T extends keyof inputBaseEventMap<V, SP, SV, RV>>(type: T, listener: (this: HTMLElement, ev: inputBaseEventMap<V, SP, SV, RV>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.describedByChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.disabledChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.helpChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.helpHintsChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.labelEdgeChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.labelHintChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.messagesCustomChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.userAssistanceDensityChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.validChanged<V, SP, SV, RV>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V, SP extends inputBaseSettableProperties<V, SV>, SV = V, RV = V> = editableValue.valueChanged<V, SP, SV, RV>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
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
    'describedByChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["disabled"]>;
    'helpChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["valid"]>;
    'valueChanged': JetElementCustomEvent<inputBase<V, SP, SV, RV>["value"]>;
}
export interface inputBaseSettableProperties<V, SV = V, RV = V> extends editableValueSettableProperties<V, SV, RV> {
    asyncValidators: Array<AsyncValidator<V>>;
    autocomplete: 'on' | 'off' | string;
    autofocus: boolean;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
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
    maskIcon: 'hidden' | 'visible';
    value: V | null;
    translations: {
        accessibleHidePassword?: string;
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        accessibleShowPassword?: string;
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
    addEventListener<T extends keyof ojInputPasswordEventMap<V>>(type: T, listener: (this: HTMLElement, ev: ojInputPasswordEventMap<V>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    type maskIconChanged<V = string> = JetElementCustomEvent<ojInputPassword<V>["maskIcon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V = string> = JetElementCustomEvent<ojInputPassword<V>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<V = string> = inputBase.asyncValidatorsChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V = string> = inputBase.autocompleteChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V = string> = inputBase.autofocusChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V = string> = inputBase.describedByChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V = string> = inputBase.disabledChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V = string> = inputBase.displayOptionsChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V = string> = inputBase.helpChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V = string> = inputBase.helpHintsChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V = string> = inputBase.labelEdgeChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V = string> = inputBase.labelHintChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V = string> = inputBase.labelledByChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V = string> = inputBase.messagesCustomChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V = string> = inputBase.placeholderChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V = string> = inputBase.rawValueChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V = string> = inputBase.readonlyChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V = string> = inputBase.requiredChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V = string> = inputBase.userAssistanceDensityChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V = string> = inputBase.validChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V = string> = inputBase.validatorsChanged<V, ojInputPasswordSettableProperties<V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojInputPasswordEventMap<V = string> extends inputBaseEventMap<V, ojInputPasswordSettableProperties<V>> {
    'ojAnimateEnd': ojInputPassword.ojAnimateEnd;
    'ojAnimateStart': ojInputPassword.ojAnimateStart;
    'maskIconChanged': JetElementCustomEvent<ojInputPassword<V>["maskIcon"]>;
    'valueChanged': JetElementCustomEvent<ojInputPassword<V>["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputPassword<V>["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojInputPassword<V>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputPassword<V>["autofocus"]>;
    'describedByChanged': JetElementCustomEvent<ojInputPassword<V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputPassword<V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputPassword<V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojInputPassword<V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputPassword<V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputPassword<V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputPassword<V>["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputPassword<V>["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputPassword<V>["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputPassword<V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputPassword<V>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputPassword<V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojInputPassword<V>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputPassword<V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputPassword<V>["valid"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputPassword<V>["validators"]>;
}
export interface ojInputPasswordSettableProperties<V = string> extends inputBaseSettableProperties<V> {
    maskIcon: 'hidden' | 'visible';
    value: V | null;
    translations: {
        accessibleHidePassword?: string;
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        accessibleShowPassword?: string;
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
    converter: Converter<V> | null;
    length: {
        countBy?: 'codePoint' | 'codeUnit';
        max: number | null;
    };
    list: string;
    virtualKeyboard: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    translations: {
        accessibleClearIcon?: string;
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
    addEventListener<T extends keyof ojInputTextEventMap<V>>(type: T, listener: (this: HTMLElement, ev: ojInputTextEventMap<V>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<V = any> = inputBase.asyncValidatorsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V = any> = inputBase.autocompleteChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V = any> = inputBase.autofocusChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V = any> = inputBase.describedByChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V = any> = inputBase.disabledChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V = any> = inputBase.displayOptionsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V = any> = inputBase.helpChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V = any> = inputBase.helpHintsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V = any> = inputBase.labelEdgeChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V = any> = inputBase.labelHintChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V = any> = inputBase.labelledByChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V = any> = inputBase.messagesCustomChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V = any> = inputBase.placeholderChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V = any> = inputBase.rawValueChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V = any> = inputBase.readonlyChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V = any> = inputBase.requiredChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V = any> = inputBase.userAssistanceDensityChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V = any> = inputBase.validChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V = any> = inputBase.validatorsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V = any> = inputBase.valueChanged<V, ojInputTextSettableProperties<V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojInputTextEventMap<V = any> extends inputBaseEventMap<V, ojInputTextSettableProperties<V>> {
    'ojAnimateEnd': ojInputText.ojAnimateEnd;
    'ojAnimateStart': ojInputText.ojAnimateStart;
    'clearIconChanged': JetElementCustomEvent<ojInputText<V>["clearIcon"]>;
    'converterChanged': JetElementCustomEvent<ojInputText<V>["converter"]>;
    'lengthChanged': JetElementCustomEvent<ojInputText<V>["length"]>;
    'listChanged': JetElementCustomEvent<ojInputText<V>["list"]>;
    'virtualKeyboardChanged': JetElementCustomEvent<ojInputText<V>["virtualKeyboard"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputText<V>["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojInputText<V>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputText<V>["autofocus"]>;
    'describedByChanged': JetElementCustomEvent<ojInputText<V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputText<V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputText<V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojInputText<V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputText<V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputText<V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputText<V>["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputText<V>["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputText<V>["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputText<V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputText<V>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputText<V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojInputText<V>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputText<V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputText<V>["valid"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputText<V>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojInputText<V>["value"]>;
}
export interface ojInputTextSettableProperties<V = any> extends inputBaseSettableProperties<V> {
    clearIcon: 'never' | 'always' | 'conditional';
    converter: Converter<V> | null;
    length: {
        countBy?: 'codePoint' | 'codeUnit';
        max: number | null;
    };
    list: string;
    virtualKeyboard: 'auto' | 'email' | 'number' | 'search' | 'tel' | 'text' | 'url';
    translations: {
        accessibleClearIcon?: string;
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
export interface ojInputTextSettablePropertiesLenient<V = any> extends Partial<ojInputTextSettableProperties<V>> {
    [key: string]: any;
}
export interface ojTextArea<V = any> extends inputBase<V, ojTextAreaSettableProperties<V>> {
    converter: Converter<V> | null;
    length: {
        countBy?: 'codePoint' | 'codeUnit';
        counter?: 'none' | 'remaining';
        max: number | null;
    };
    maxRows: number;
    resizeBehavior: 'both' | 'horizontal' | 'vertical' | 'none';
    rows: number;
    addEventListener<T extends keyof ojTextAreaEventMap<V>>(type: T, listener: (this: HTMLElement, ev: ojTextAreaEventMap<V>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<V = any> = inputBase.asyncValidatorsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V = any> = inputBase.autocompleteChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V = any> = inputBase.autofocusChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V = any> = inputBase.describedByChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V = any> = inputBase.disabledChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V = any> = inputBase.displayOptionsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V = any> = inputBase.helpChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V = any> = inputBase.helpHintsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V = any> = inputBase.labelEdgeChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V = any> = inputBase.labelHintChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V = any> = inputBase.labelledByChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V = any> = inputBase.messagesCustomChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V = any> = inputBase.placeholderChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V = any> = inputBase.rawValueChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V = any> = inputBase.readonlyChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V = any> = inputBase.requiredChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V = any> = inputBase.userAssistanceDensityChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V = any> = inputBase.validChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V = any> = inputBase.validatorsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V = any> = inputBase.valueChanged<V, ojTextAreaSettableProperties<V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojTextAreaEventMap<V = any> extends inputBaseEventMap<V, ojTextAreaSettableProperties<V>> {
    'ojAnimateEnd': ojTextArea.ojAnimateEnd;
    'ojAnimateStart': ojTextArea.ojAnimateStart;
    'converterChanged': JetElementCustomEvent<ojTextArea<V>["converter"]>;
    'lengthChanged': JetElementCustomEvent<ojTextArea<V>["length"]>;
    'maxRowsChanged': JetElementCustomEvent<ojTextArea<V>["maxRows"]>;
    'resizeBehaviorChanged': JetElementCustomEvent<ojTextArea<V>["resizeBehavior"]>;
    'rowsChanged': JetElementCustomEvent<ojTextArea<V>["rows"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojTextArea<V>["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojTextArea<V>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojTextArea<V>["autofocus"]>;
    'describedByChanged': JetElementCustomEvent<ojTextArea<V>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojTextArea<V>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojTextArea<V>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojTextArea<V>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojTextArea<V>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojTextArea<V>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojTextArea<V>["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojTextArea<V>["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojTextArea<V>["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojTextArea<V>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojTextArea<V>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojTextArea<V>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojTextArea<V>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojTextArea<V>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojTextArea<V>["valid"]>;
    'validatorsChanged': JetElementCustomEvent<ojTextArea<V>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojTextArea<V>["value"]>;
}
export interface ojTextAreaSettableProperties<V = any> extends inputBaseSettableProperties<V> {
    converter: Converter<V> | null;
    length: {
        countBy?: 'codePoint' | 'codeUnit';
        counter?: 'none' | 'remaining';
        max: number | null;
    };
    maxRows: number;
    resizeBehavior: 'both' | 'horizontal' | 'vertical' | 'none';
    rows: number;
}
export interface ojTextAreaSettablePropertiesLenient<V = any> extends Partial<ojTextAreaSettableProperties<V>> {
    [key: string]: any;
}
export type InputPasswordElement<V = string> = ojInputPassword<V>;
export type InputTextElement<V = any> = ojInputText<V>;
export type TextAreaElement<V = any> = ojTextArea<V>;
export namespace InputPasswordElement {
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
    type maskIconChanged<V = string> = JetElementCustomEvent<ojInputPassword<V>["maskIcon"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V = string> = JetElementCustomEvent<ojInputPassword<V>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<V = string> = inputBase.asyncValidatorsChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V = string> = inputBase.autocompleteChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V = string> = inputBase.autofocusChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V = string> = inputBase.describedByChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V = string> = inputBase.disabledChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V = string> = inputBase.displayOptionsChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V = string> = inputBase.helpChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V = string> = inputBase.helpHintsChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V = string> = inputBase.labelEdgeChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V = string> = inputBase.labelHintChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V = string> = inputBase.labelledByChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V = string> = inputBase.messagesCustomChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V = string> = inputBase.placeholderChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V = string> = inputBase.rawValueChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V = string> = inputBase.readonlyChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V = string> = inputBase.requiredChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V = string> = inputBase.userAssistanceDensityChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V = string> = inputBase.validChanged<V, ojInputPasswordSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V = string> = inputBase.validatorsChanged<V, ojInputPasswordSettableProperties<V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace InputTextElement {
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<V = any> = inputBase.asyncValidatorsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V = any> = inputBase.autocompleteChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V = any> = inputBase.autofocusChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V = any> = inputBase.describedByChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V = any> = inputBase.disabledChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V = any> = inputBase.displayOptionsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V = any> = inputBase.helpChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V = any> = inputBase.helpHintsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V = any> = inputBase.labelEdgeChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V = any> = inputBase.labelHintChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V = any> = inputBase.labelledByChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V = any> = inputBase.messagesCustomChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V = any> = inputBase.placeholderChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V = any> = inputBase.rawValueChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V = any> = inputBase.readonlyChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V = any> = inputBase.requiredChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V = any> = inputBase.userAssistanceDensityChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V = any> = inputBase.validChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V = any> = inputBase.validatorsChanged<V, ojInputTextSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V = any> = inputBase.valueChanged<V, ojInputTextSettableProperties<V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace TextAreaElement {
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<V = any> = inputBase.asyncValidatorsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<V = any> = inputBase.autocompleteChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<V = any> = inputBase.autofocusChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<V = any> = inputBase.describedByChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<V = any> = inputBase.disabledChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<V = any> = inputBase.displayOptionsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<V = any> = inputBase.helpChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<V = any> = inputBase.helpHintsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<V = any> = inputBase.labelEdgeChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<V = any> = inputBase.labelHintChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<V = any> = inputBase.labelledByChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<V = any> = inputBase.messagesCustomChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<V = any> = inputBase.placeholderChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<V = any> = inputBase.rawValueChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<V = any> = inputBase.readonlyChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<V = any> = inputBase.requiredChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<V = any> = inputBase.userAssistanceDensityChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<V = any> = inputBase.validChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<V = any> = inputBase.validatorsChanged<V, ojTextAreaSettableProperties<V>>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<V = any> = inputBase.valueChanged<V, ojTextAreaSettableProperties<V>>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface InputPasswordIntrinsicProps extends Partial<Readonly<ojInputPasswordSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojInputPasswordEventMap<any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojInputPasswordEventMap<any>['ojAnimateStart']) => void;
    onmaskIconChanged?: (value: ojInputPasswordEventMap<any>['maskIconChanged']) => void;
    onvalueChanged?: (value: ojInputPasswordEventMap<any>['valueChanged']) => void;
    onasyncValidatorsChanged?: (value: ojInputPasswordEventMap<any>['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojInputPasswordEventMap<any>['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojInputPasswordEventMap<any>['autofocusChanged']) => void;
    ondescribedByChanged?: (value: ojInputPasswordEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputPasswordEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputPasswordEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojInputPasswordEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputPasswordEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputPasswordEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputPasswordEventMap<any>['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojInputPasswordEventMap<any>['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputPasswordEventMap<any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojInputPasswordEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputPasswordEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputPasswordEventMap<any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojInputPasswordEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputPasswordEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputPasswordEventMap<any>['validChanged']) => void;
    onvalidatorsChanged?: (value: ojInputPasswordEventMap<any>['validatorsChanged']) => void;
    children?: ComponentChildren;
}
export interface InputTextIntrinsicProps extends Partial<Readonly<ojInputTextSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojInputTextEventMap<any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojInputTextEventMap<any>['ojAnimateStart']) => void;
    onclearIconChanged?: (value: ojInputTextEventMap<any>['clearIconChanged']) => void;
    onconverterChanged?: (value: ojInputTextEventMap<any>['converterChanged']) => void;
    onlengthChanged?: (value: ojInputTextEventMap<any>['lengthChanged']) => void;
    onlistChanged?: (value: ojInputTextEventMap<any>['listChanged']) => void;
    onvirtualKeyboardChanged?: (value: ojInputTextEventMap<any>['virtualKeyboardChanged']) => void;
    onasyncValidatorsChanged?: (value: ojInputTextEventMap<any>['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojInputTextEventMap<any>['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojInputTextEventMap<any>['autofocusChanged']) => void;
    ondescribedByChanged?: (value: ojInputTextEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputTextEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputTextEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojInputTextEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputTextEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputTextEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputTextEventMap<any>['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojInputTextEventMap<any>['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputTextEventMap<any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojInputTextEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputTextEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputTextEventMap<any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojInputTextEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputTextEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputTextEventMap<any>['validChanged']) => void;
    onvalidatorsChanged?: (value: ojInputTextEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputTextEventMap<any>['valueChanged']) => void;
    children?: ComponentChildren;
}
export interface TextAreaIntrinsicProps extends Partial<Readonly<ojTextAreaSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojTextAreaEventMap<any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojTextAreaEventMap<any>['ojAnimateStart']) => void;
    onconverterChanged?: (value: ojTextAreaEventMap<any>['converterChanged']) => void;
    onlengthChanged?: (value: ojTextAreaEventMap<any>['lengthChanged']) => void;
    onmaxRowsChanged?: (value: ojTextAreaEventMap<any>['maxRowsChanged']) => void;
    onresizeBehaviorChanged?: (value: ojTextAreaEventMap<any>['resizeBehaviorChanged']) => void;
    onrowsChanged?: (value: ojTextAreaEventMap<any>['rowsChanged']) => void;
    onasyncValidatorsChanged?: (value: ojTextAreaEventMap<any>['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojTextAreaEventMap<any>['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojTextAreaEventMap<any>['autofocusChanged']) => void;
    ondescribedByChanged?: (value: ojTextAreaEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojTextAreaEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojTextAreaEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojTextAreaEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojTextAreaEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojTextAreaEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojTextAreaEventMap<any>['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojTextAreaEventMap<any>['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojTextAreaEventMap<any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojTextAreaEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojTextAreaEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojTextAreaEventMap<any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojTextAreaEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojTextAreaEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojTextAreaEventMap<any>['validChanged']) => void;
    onvalidatorsChanged?: (value: ojTextAreaEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojTextAreaEventMap<any>['valueChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-input-password": InputPasswordIntrinsicProps;
            "oj-input-text": InputTextIntrinsicProps;
            "oj-text-area": TextAreaIntrinsicProps;
        }
    }
}
