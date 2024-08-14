import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
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
    converter: Converter<number>;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
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
    addEventListener<T extends keyof ojInputNumberEventMap>(type: T, listener: (this: HTMLElement, ev: ojInputNumberEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
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
    'describedByChanged': JetElementCustomEvent<ojInputNumber["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputNumber["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojInputNumber["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputNumber["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputNumber["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputNumber["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputNumber["messagesCustom"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputNumber["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputNumber["valid"]>;
}
export interface ojInputNumberSettableProperties extends editableValueSettableProperties<number | null, number | null, string> {
    asyncValidators: Array<AsyncValidator<number>>;
    autocomplete: 'on' | 'off' | string;
    autofocus: boolean;
    converter: Converter<number>;
    displayOptions?: {
        converterHint?: 'display' | 'none';
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
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
export type InputNumberElement = ojInputNumber;
export namespace InputNumberElement {
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
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = editableValue.describedByChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = editableValue.disabledChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = editableValue.helpChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = editableValue.helpHintsChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = editableValue.labelEdgeChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = editableValue.labelHintChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = editableValue.messagesCustomChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = editableValue.userAssistanceDensityChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = editableValue.validChanged<number | null, ojInputNumberSettableProperties, number | null, string>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface InputNumberIntrinsicProps extends Partial<Readonly<ojInputNumberSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojInputNumberEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojInputNumberEventMap['ojAnimateStart']) => void;
    onasyncValidatorsChanged?: (value: ojInputNumberEventMap['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojInputNumberEventMap['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojInputNumberEventMap['autofocusChanged']) => void;
    onconverterChanged?: (value: ojInputNumberEventMap['converterChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputNumberEventMap['displayOptionsChanged']) => void;
    onlabelledByChanged?: (value: ojInputNumberEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojInputNumberEventMap['maxChanged']) => void;
    onminChanged?: (value: ojInputNumberEventMap['minChanged']) => void;
    onplaceholderChanged?: (value: ojInputNumberEventMap['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputNumberEventMap['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputNumberEventMap['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojInputNumberEventMap['requiredChanged']) => void;
    onstepChanged?: (value: ojInputNumberEventMap['stepChanged']) => void;
    ontransientValueChanged?: (value: ojInputNumberEventMap['transientValueChanged']) => void;
    onvalidatorsChanged?: (value: ojInputNumberEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputNumberEventMap['valueChanged']) => void;
    onvirtualKeyboardChanged?: (value: ojInputNumberEventMap['virtualKeyboardChanged']) => void;
    ondescribedByChanged?: (value: ojInputNumberEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputNumberEventMap['disabledChanged']) => void;
    onhelpChanged?: (value: ojInputNumberEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputNumberEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputNumberEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputNumberEventMap['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputNumberEventMap['messagesCustomChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputNumberEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputNumberEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-input-number": InputNumberIntrinsicProps;
        }
    }
}
