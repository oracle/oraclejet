import { GlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren } from 'preact';
import RequiredValidator = require('../ojvalidator-required');
import RegExpValidator = require('../ojvalidator-regexp');
import LengthValidator = require('../ojvalidator-length');
import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import DateRestrictionValidator = require('../ojvalidator-daterestriction');
import { IntlDateTimeConverter, DateTimeConverter } from '../ojconverter-datetime';
import AsyncValidator = require('../ojvalidator-async');
import Validator = require('../ojvalidator');
import NumberRangeValidator = require('../ojvalidator-numberrange');
import Converter = require('../ojconverter');
import { Validation } from '../ojvalidationfactory-base';
import Message = require('../ojmessaging');
import { inputBase, inputBaseEventMap, inputBaseSettableProperties } from '../ojinputtext';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojDatePicker extends ojInputDate<ojDatePickerSettableProperties> {
    /** @deprecated since 18.0.0 - To highlight the today cell in a different timezone use the new today-time-zone property instead. */
    converter: Converter<any>;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    describedBy: string | null;
    /** @deprecated since 17.0.0 - Disabled is not supported by the Date Picker UX specification, use readonly property instead. */
    disabled: boolean;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    displayOptions: {
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        converterHint?: 'display' | 'none';
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        messages?: 'display' | 'none';
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        validatorHint?: 'display' | 'none';
    };
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    help: {
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        instruction?: string;
    };
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    helpHints: {
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        definition?: string;
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        source?: string;
    };
    /** @deprecated since 17.0.0 - This was never intended for oj-date-picker. */
    keyboardEdit: 'disabled';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    labelEdge: 'inside' | 'none' | 'provided';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    labelHint: string;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    labelledBy: string | null;
    max: string | null;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    messagesCustom: Message[];
    min: string | null;
    /** @deprecated since 17.0.0 - Changing the Class or Style property is not recommended, as it leads to an inconsistent UI. */
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 17.0.0 - oj-date-picker doesn't have a text input, so this was never needed. */
    placeholder: string;
    /** @deprecated since 11.0.0 - This property is deprecated because it was incorrectly exposed on oj-date-picker and not fully implemented. */
    readonly rawValue: string;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    required: boolean;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    addEventListener<T extends keyof ojDatePickerEventMap>(type: T, listener: (this: HTMLElement, ev: ojDatePickerEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDatePickerSettableProperties>(property: T): ojDatePicker[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDatePickerSettableProperties>(property: T, value: ojDatePickerSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDatePickerSettableProperties>): void;
    setProperties(properties: ojDatePickerSettablePropertiesLenient): void;
    reset(): void;
    showMessages(): void;
    validate(): Promise<'valid' | 'invalid'>;
}
export namespace ojDatePicker {
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
    type converterChanged = JetElementCustomEvent<ojDatePicker["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojDatePicker["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojDatePicker["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojDatePicker["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojDatePicker["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = JetElementCustomEvent<ojDatePicker["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojDatePicker["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = JetElementCustomEvent<ojDatePicker["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojDatePicker["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojDatePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = JetElementCustomEvent<ojDatePicker["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDatePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojDatePicker["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDatePicker["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = JetElementCustomEvent<ojDatePicker["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = JetElementCustomEvent<ojDatePicker["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = JetElementCustomEvent<ojDatePicker["valid"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojDatePicker["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojDatePicker["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged = ojInputDate.asyncValidatorsChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = ojInputDate.autofocusChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDate.dayFormatterChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDate.dayMetaDataChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDate.readonlyChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type todayTimeZoneChanged = ojInputDate.todayTimeZoneChanged<ojDatePickerSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojDatePickerEventMap extends ojInputDateEventMap<ojDatePickerSettableProperties> {
    'ojAnimateEnd': ojDatePicker.ojAnimateEnd;
    'ojAnimateStart': ojDatePicker.ojAnimateStart;
    'converterChanged': JetElementCustomEvent<ojDatePicker["converter"]>;
    'describedByChanged': JetElementCustomEvent<ojDatePicker["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojDatePicker["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojDatePicker["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojDatePicker["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojDatePicker["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojDatePicker["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojDatePicker["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojDatePicker["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojDatePicker["max"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojDatePicker["messagesCustom"]>;
    'minChanged': JetElementCustomEvent<ojDatePicker["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojDatePicker["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojDatePicker["rawValue"]>;
    'requiredChanged': JetElementCustomEvent<ojDatePicker["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojDatePicker["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojDatePicker["valid"]>;
    'validatorsChanged': JetElementCustomEvent<ojDatePicker["validators"]>;
    'valueChanged': JetElementCustomEvent<ojDatePicker["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojDatePicker["asyncValidators"]>;
    'autofocusChanged': JetElementCustomEvent<ojDatePicker["autofocus"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojDatePicker["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojDatePicker["dayMetaData"]>;
    'readonlyChanged': JetElementCustomEvent<ojDatePicker["readonly"]>;
    'todayTimeZoneChanged': JetElementCustomEvent<ojDatePicker["todayTimeZone"]>;
}
export interface ojDatePickerSettableProperties extends ojInputDateSettableProperties {
    /** @deprecated since 18.0.0 - To highlight the today cell in a different timezone use the new today-time-zone property instead. */
    converter: Converter<any>;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    describedBy: string | null;
    /** @deprecated since 17.0.0 - Disabled is not supported by the Date Picker UX specification, use readonly property instead. */
    disabled: boolean;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    displayOptions: {
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        converterHint?: 'display' | 'none';
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        messages?: 'display' | 'none';
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        validatorHint?: 'display' | 'none';
    };
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    help: {
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        instruction?: string;
    };
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    helpHints: {
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        definition?: string;
        /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
        source?: string;
    };
    /** @deprecated since 17.0.0 - This was never intended for oj-date-picker. */
    keyboardEdit: 'disabled';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    labelEdge: 'inside' | 'none' | 'provided';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    labelHint: string;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    labelledBy: string | null;
    max: string | null;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    messagesCustom: Message[];
    min: string | null;
    /** @deprecated since 17.0.0 - Changing the Class or Style property is not recommended, as it leads to an inconsistent UI. */
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 17.0.0 - oj-date-picker doesn't have a text input, so this was never needed. */
    placeholder: string;
    /** @deprecated since 11.0.0 - This property is deprecated because it was incorrectly exposed on oj-date-picker and not fully implemented. */
    readonly rawValue: string;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    required: boolean;
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to be validated, display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    readonly valid: 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
    /** @deprecated since 17.0.0 - The oj-date-picker is used internally by the input date component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-picker is not intended to be a form component. */
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
}
export interface ojDatePickerSettablePropertiesLenient extends Partial<ojDatePickerSettableProperties> {
    [key: string]: any;
}
/** @deprecated since 17.0.0 - Suggested alternatives: oj-date-picker, oj-input-date, oj-input-time. The use of oj-date-time-picker is a Redwood anti-pattern. */
export interface ojDateTimePicker extends ojInputDateTime<ojDateTimePickerSettableProperties> {
    /** @deprecated since 17.0.0 - This property has been deprecated. */
    converter: Converter<any>;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    describedBy: string | null;
    /** @deprecated since 17.0.0 - Disabled is not supported by the Date Picker UX specification, use readonly property instead. */
    disabled: boolean;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    help: {
        /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
        instruction?: string;
    };
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    helpHints: {
        /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
        definition?: string;
        /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
        source?: string;
    };
    /** @deprecated since 17.0.0 - This was never intended for the oj-date-time-picker component. */
    keyboardEdit: 'disabled';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    labelEdge: 'inside' | 'none' | 'provided';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    labelHint: string;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    labelledBy: string | null;
    max: string | null;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    messagesCustom: Message[];
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 17.0.0 - oj-date-time-picker doesn't have a text input, so this was never needed. */
    placeholder: string;
    /** @deprecated since 11.0.0 - This property is deprecated because it was incorrectly exposed on oj-date-time-picker and not fully implemented. */
    readonly rawValue: string;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    required: boolean;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    addEventListener<T extends keyof ojDateTimePickerEventMap>(type: T, listener: (this: HTMLElement, ev: ojDateTimePickerEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDateTimePickerSettableProperties>(property: T): ojDateTimePicker[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDateTimePickerSettableProperties>(property: T, value: ojDateTimePickerSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDateTimePickerSettableProperties>): void;
    setProperties(properties: ojDateTimePickerSettablePropertiesLenient): void;
}
export namespace ojDateTimePicker {
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
    type converterChanged = JetElementCustomEvent<ojDateTimePicker["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojDateTimePicker["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojDateTimePicker["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojDateTimePicker["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = JetElementCustomEvent<ojDateTimePicker["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojDateTimePicker["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = JetElementCustomEvent<ojDateTimePicker["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojDateTimePicker["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojDateTimePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = JetElementCustomEvent<ojDateTimePicker["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDateTimePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojDateTimePicker["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDateTimePicker["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = JetElementCustomEvent<ojDateTimePicker["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = JetElementCustomEvent<ojDateTimePicker["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojDateTimePicker["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojDateTimePicker["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged = ojInputDateTime.asyncValidatorsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = ojInputDateTime.autofocusChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged = ojInputDateTime.datePickerChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDateTime.dayFormatterChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDateTime.dayMetaDataChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = ojInputDateTime.displayOptionsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDateTime.readonlyChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged = ojInputDateTime.readonlyUserAssistanceShownChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = ojInputDateTime.validChanged<ojDateTimePickerSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojDateTimePickerEventMap extends ojInputDateTimeEventMap<ojDateTimePickerSettableProperties> {
    'ojAnimateEnd': ojDateTimePicker.ojAnimateEnd;
    'ojAnimateStart': ojDateTimePicker.ojAnimateStart;
    'converterChanged': JetElementCustomEvent<ojDateTimePicker["converter"]>;
    'describedByChanged': JetElementCustomEvent<ojDateTimePicker["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojDateTimePicker["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojDateTimePicker["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojDateTimePicker["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojDateTimePicker["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojDateTimePicker["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojDateTimePicker["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojDateTimePicker["max"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojDateTimePicker["messagesCustom"]>;
    'minChanged': JetElementCustomEvent<ojDateTimePicker["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojDateTimePicker["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojDateTimePicker["rawValue"]>;
    'requiredChanged': JetElementCustomEvent<ojDateTimePicker["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojDateTimePicker["userAssistanceDensity"]>;
    'validatorsChanged': JetElementCustomEvent<ojDateTimePicker["validators"]>;
    'valueChanged': JetElementCustomEvent<ojDateTimePicker["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojDateTimePicker["asyncValidators"]>;
    'autofocusChanged': JetElementCustomEvent<ojDateTimePicker["autofocus"]>;
    'datePickerChanged': JetElementCustomEvent<ojDateTimePicker["datePicker"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojDateTimePicker["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojDateTimePicker["dayMetaData"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojDateTimePicker["displayOptions"]>;
    'readonlyChanged': JetElementCustomEvent<ojDateTimePicker["readonly"]>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEvent<ojDateTimePicker["readonlyUserAssistanceShown"]>;
    'validChanged': JetElementCustomEvent<ojDateTimePicker["valid"]>;
}
export interface ojDateTimePickerSettableProperties extends ojInputDateTimeSettableProperties {
    /** @deprecated since 17.0.0 - This property has been deprecated. */
    converter: Converter<any>;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    describedBy: string | null;
    /** @deprecated since 17.0.0 - Disabled is not supported by the Date Picker UX specification, use readonly property instead. */
    disabled: boolean;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    help: {
        /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
        instruction?: string;
    };
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    helpHints: {
        /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
        definition?: string;
        /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
           or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
        source?: string;
    };
    /** @deprecated since 17.0.0 - This was never intended for the oj-date-time-picker component. */
    keyboardEdit: 'disabled';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    labelEdge: 'inside' | 'none' | 'provided';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    labelHint: string;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    labelledBy: string | null;
    max: string | null;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    messagesCustom: Message[];
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 17.0.0 - oj-date-time-picker doesn't have a text input, so this was never needed. */
    placeholder: string;
    /** @deprecated since 11.0.0 - This property is deprecated because it was incorrectly exposed on oj-date-time-picker and not fully implemented. */
    readonly rawValue: string;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    required: boolean;
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    userAssistanceDensity: 'reflow' | 'efficient' | 'compact';
    /** @deprecated since 17.0.0 - The oj-date-time-picker is used internally by the oj-input-date-time component and is not meant to display messages, be labelled,
       or be in a form layout by itself. Per the Redwood UX specification, the oj-date-time-picker is not intended to be a form component. */
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
}
export interface ojDateTimePickerSettablePropertiesLenient extends Partial<ojDateTimePickerSettableProperties> {
    [key: string]: any;
}
export interface ojInputDate<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> extends inputBase<string, SP> {
    /** @deprecated since 17.0.0 - The date field contains mask segments instead of a general input, so autocomplete is not supported. */
    autocomplete: 'on' | 'off' | string;
    /** @deprecated since 17.0.0 - This is not recommended for accessibility reasons. */
    autofocus: boolean;
    /** @deprecated since 18.0.0 - It is recommended to either use oj-c-input-date-picker which has a picker but no formatting support,
       or use oj-c-input-date-text for formatting but has no picker. The property is being deprecated because the oj-input-date component has an implicit date converter that formats dates in the required short format with a four-digit year. Additionally,
       the new today-time-zone property allows applications to highlight the today cell in a different timezone. Along with the new two-digit-start-year property,
       which allows applications to specify the earliest date of a 100-year period within which the two-digit year will be interpreted, the explicit converter is unnecessary. */
    converter: Converter<any>;
    datePicker: {
        changeMonth?: string;
        changeYear?: string;
        /** @deprecated since 17.0.0 - This is required when date-picker.number-of-months > 1, which is now deprecated, so this is no longer needed. */
        currentMonthPos?: number;
        daysOutsideMonth?: string;
        /** @deprecated since 8.2.0 - This attribute is deprecated and should not be used as it will be ignored in new UX design. */
        footerLayout?: string;
        /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification for Date Picker. See the Range Picker UX specification. */
        numberOfMonths?: number;
        /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
        showOn?: string;
        /** @deprecated since 17.0.0 - This is not in the Redwood UX specification. */
        stepBigMonths?: number;
        /** @deprecated since 17.0.0 - This is not in the Redwood UX specification. */
        stepMonths?: 'numberOfMonths' | number;
        weekDisplay?: string;
        /** @deprecated since 17.0.0 - This is not in the Redwood UX specification. The 'min' and 'max' properties should be used instead. */
        yearRange?: string;
    };
    dayFormatter: (param: ojInputDate.DayFormatterInput) => (null | 'all' | ojInputDate.DayFormatterOutput);
    /** @deprecated since 17.0.0 - Use dayFormatter instead, as it is more flexible. */
    dayMetaData: {
        [key: string]: {
            [key: string]: {
                [key: string]: {
                    disabled?: boolean;
                    className?: string;
                    tooltip?: string;
                };
            };
        };
    };
    displayOptions?: {
        /** @deprecated since 17.0.0 - Please use help-hints instead. */
        converterHint?: 'display' | 'none';
        /** @deprecated since 9.0.0 - If you want none, remove help-instruction attribute. */
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
    keyboardEdit: 'enabled' | 'disabled';
    /** @deprecated since 17.0.0 - This is an internal API and is not supported in the Redwood UX specification. */
    labelledBy: string | null;
    max: string | null;
    min: string | null;
    /** @deprecated since 17.0.0 - Changing the Class or Style property is not recommended, as it leads to an inconsistent UI. */
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 17.0.0 - The date field contains mask segments instead of a general input, so placeholder is not supported. */
    placeholder: string;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    todayTimeZone: string;
    twoDigitYearStart: number;
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthExceeded?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthRemaining?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        currentText?: string;
        dateRestriction?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: string;
        };
        dateTimeRange?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: {
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                inRange?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                max?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: {
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeOverflow?: string;
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeUnderflow?: string;
            };
        };
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        nextText?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        prevText?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        regexp?: {
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageSummary?: string;
        };
        required?: {
            /** @deprecated since 17.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendar?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarDisabled?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTime?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTimeDisabled?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        weekHeader?: string;
    };
    addEventListener<T extends keyof ojInputDateEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: ojInputDateEventMap<SP>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojInputDateSettableProperties>(property: T): ojInputDate<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojInputDateSettableProperties>(property: T, value: ojInputDateSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojInputDateSettableProperties>): void;
    setProperties(properties: ojInputDateSettablePropertiesLenient): void;
    hide(): void;
    refresh(): void;
    show(): void;
}
export namespace ojInputDate {
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
    type autocompleteChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["autocomplete"]>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["autofocus"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["datePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayFormatter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayMetaData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["keyboardEdit"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type todayTimeZoneChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["todayTimeZone"]>;
    // tslint:disable-next-line interface-over-type-literal
    type twoDigitYearStartChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["twoDigitYearStart"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.asyncValidatorsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.describedByChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.disabledChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpHintsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelEdgeChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelHintChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.messagesCustomChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.rawValueChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.readonlyChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.readonlyUserAssistanceShownChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.requiredChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.userAssistanceDensityChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.validChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type DayFormatterInput = {
        date: number;
        fullYear: number;
        month: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DayFormatterOutput = {
        className?: string;
        disabled?: boolean;
        tooltip?: string;
    };
}
export interface ojInputDateEventMap<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> extends inputBaseEventMap<string, SP> {
    'ojAnimateEnd': ojInputDate.ojAnimateEnd;
    'ojAnimateStart': ojInputDate.ojAnimateStart;
    'autocompleteChanged': JetElementCustomEvent<ojInputDate<SP>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputDate<SP>["autofocus"]>;
    'converterChanged': JetElementCustomEvent<ojInputDate<SP>["converter"]>;
    'datePickerChanged': JetElementCustomEvent<ojInputDate<SP>["datePicker"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojInputDate<SP>["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojInputDate<SP>["dayMetaData"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputDate<SP>["displayOptions"]>;
    'keyboardEditChanged': JetElementCustomEvent<ojInputDate<SP>["keyboardEdit"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputDate<SP>["labelledBy"]>;
    'maxChanged': JetElementCustomEvent<ojInputDate<SP>["max"]>;
    'minChanged': JetElementCustomEvent<ojInputDate<SP>["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojInputDate<SP>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputDate<SP>["placeholder"]>;
    'renderModeChanged': JetElementCustomEvent<ojInputDate<SP>["renderMode"]>;
    'todayTimeZoneChanged': JetElementCustomEvent<ojInputDate<SP>["todayTimeZone"]>;
    'twoDigitYearStartChanged': JetElementCustomEvent<ojInputDate<SP>["twoDigitYearStart"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputDate<SP>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojInputDate<SP>["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputDate<SP>["asyncValidators"]>;
    'describedByChanged': JetElementCustomEvent<ojInputDate<SP>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputDate<SP>["disabled"]>;
    'helpChanged': JetElementCustomEvent<ojInputDate<SP>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputDate<SP>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputDate<SP>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputDate<SP>["labelHint"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputDate<SP>["messagesCustom"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputDate<SP>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputDate<SP>["readonly"]>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEvent<ojInputDate<SP>["readonlyUserAssistanceShown"]>;
    'requiredChanged': JetElementCustomEvent<ojInputDate<SP>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputDate<SP>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputDate<SP>["valid"]>;
}
export interface ojInputDateSettableProperties extends inputBaseSettableProperties<string> {
    /** @deprecated since 17.0.0 - The date field contains mask segments instead of a general input, so autocomplete is not supported. */
    autocomplete: 'on' | 'off' | string;
    /** @deprecated since 17.0.0 - This is not recommended for accessibility reasons. */
    autofocus: boolean;
    /** @deprecated since 18.0.0 - It is recommended to either use oj-c-input-date-picker which has a picker but no formatting support,
       or use oj-c-input-date-text for formatting but has no picker. The property is being deprecated because the oj-input-date component has an implicit date converter that formats dates in the required short format with a four-digit year. Additionally,
       the new today-time-zone property allows applications to highlight the today cell in a different timezone. Along with the new two-digit-start-year property,
       which allows applications to specify the earliest date of a 100-year period within which the two-digit year will be interpreted, the explicit converter is unnecessary. */
    converter: Converter<any>;
    datePicker: {
        changeMonth?: string;
        changeYear?: string;
        /** @deprecated since 17.0.0 - This is required when date-picker.number-of-months > 1, which is now deprecated, so this is no longer needed. */
        currentMonthPos?: number;
        daysOutsideMonth?: string;
        /** @deprecated since 8.2.0 - This attribute is deprecated and should not be used as it will be ignored in new UX design. */
        footerLayout?: string;
        /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification for Date Picker. See the Range Picker UX specification. */
        numberOfMonths?: number;
        /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
        showOn?: string;
        /** @deprecated since 17.0.0 - This is not in the Redwood UX specification. */
        stepBigMonths?: number;
        /** @deprecated since 17.0.0 - This is not in the Redwood UX specification. */
        stepMonths?: 'numberOfMonths' | number;
        weekDisplay?: string;
        /** @deprecated since 17.0.0 - This is not in the Redwood UX specification. The 'min' and 'max' properties should be used instead. */
        yearRange?: string;
    };
    dayFormatter: (param: ojInputDate.DayFormatterInput) => (null | 'all' | ojInputDate.DayFormatterOutput);
    /** @deprecated since 17.0.0 - Use dayFormatter instead, as it is more flexible. */
    dayMetaData: {
        [key: string]: {
            [key: string]: {
                [key: string]: {
                    disabled?: boolean;
                    className?: string;
                    tooltip?: string;
                };
            };
        };
    };
    displayOptions?: {
        /** @deprecated since 17.0.0 - Please use help-hints instead. */
        converterHint?: 'display' | 'none';
        /** @deprecated since 9.0.0 - If you want none, remove help-instruction attribute. */
        helpInstruction?: Array<'notewindow' | 'none'> | 'notewindow' | 'none';
        messages?: 'display' | 'none';
        validatorHint?: 'display' | 'none';
    };
    /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
    keyboardEdit: 'enabled' | 'disabled';
    /** @deprecated since 17.0.0 - This is an internal API and is not supported in the Redwood UX specification. */
    labelledBy: string | null;
    max: string | null;
    min: string | null;
    /** @deprecated since 17.0.0 - Changing the Class or Style property is not recommended, as it leads to an inconsistent UI. */
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 17.0.0 - The date field contains mask segments instead of a general input, so placeholder is not supported. */
    placeholder: string;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    todayTimeZone: string;
    twoDigitYearStart: number;
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthExceeded?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthRemaining?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        currentText?: string;
        dateRestriction?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: string;
        };
        dateTimeRange?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: {
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                inRange?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                max?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: {
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeOverflow?: string;
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeUnderflow?: string;
            };
        };
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        nextText?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        prevText?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        regexp?: {
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageSummary?: string;
        };
        required?: {
            /** @deprecated since 17.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendar?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarDisabled?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTime?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTimeDisabled?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        weekHeader?: string;
    };
}
export interface ojInputDateSettablePropertiesLenient extends Partial<ojInputDateSettableProperties> {
    [key: string]: any;
}
export interface ojInputDateTime<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> extends ojInputDate<SP> {
    converter: Converter<any>;
    max: string | null;
    min: string | null;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    timePicker: {
        /** @deprecated since 8.2.0 - This attribute is deprecated and should not be used as it will be ignored in new UX design. */
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthExceeded?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthRemaining?: string;
        cancel?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        currentText?: string;
        dateRestriction?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: string;
        };
        dateTimeRange?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: {
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                inRange?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                max?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: {
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeOverflow?: string;
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeUnderflow?: string;
            };
        };
        done?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        nextText?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        prevText?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        regexp?: {
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageSummary?: string;
        };
        required?: {
            /** @deprecated since 17.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
        time?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendar?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarDisabled?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTime?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTimeDisabled?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        weekHeader?: string;
    };
    addEventListener<T extends keyof ojInputDateTimeEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: ojInputDateTimeEventMap<SP>[T]) => any, options?: (boolean |
       AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojInputDateTimeSettableProperties>(property: T): ojInputDateTime<SP>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojInputDateTimeSettableProperties>(property: T, value: ojInputDateTimeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojInputDateTimeSettableProperties>): void;
    setProperties(properties: ojInputDateTimeSettablePropertiesLenient): void;
    hideTimePicker(): void;
    show(): void;
    showTimePicker(): void;
}
export namespace ojInputDateTime {
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
    type converterChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timePickerChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["timePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.asyncValidatorsChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.autocompleteChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.autofocusChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.datePickerChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.dayFormatterChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.dayMetaDataChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.describedByChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.disabledChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.displayOptionsChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.helpChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.helpHintsChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.keyboardEditChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.labelEdgeChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.labelHintChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.labelledByChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.messagesCustomChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.pickerAttributesChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.placeholderChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.rawValueChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.readonlyChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.readonlyUserAssistanceShownChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.requiredChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.userAssistanceDensityChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.validChanged<SP>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojInputDateTimeEventMap<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> extends ojInputDateEventMap<SP> {
    'ojAnimateEnd': ojInputDateTime.ojAnimateEnd;
    'ojAnimateStart': ojInputDateTime.ojAnimateStart;
    'converterChanged': JetElementCustomEvent<ojInputDateTime<SP>["converter"]>;
    'maxChanged': JetElementCustomEvent<ojInputDateTime<SP>["max"]>;
    'minChanged': JetElementCustomEvent<ojInputDateTime<SP>["min"]>;
    'renderModeChanged': JetElementCustomEvent<ojInputDateTime<SP>["renderMode"]>;
    'timePickerChanged': JetElementCustomEvent<ojInputDateTime<SP>["timePicker"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputDateTime<SP>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojInputDateTime<SP>["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputDateTime<SP>["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojInputDateTime<SP>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputDateTime<SP>["autofocus"]>;
    'datePickerChanged': JetElementCustomEvent<ojInputDateTime<SP>["datePicker"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojInputDateTime<SP>["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojInputDateTime<SP>["dayMetaData"]>;
    'describedByChanged': JetElementCustomEvent<ojInputDateTime<SP>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputDateTime<SP>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputDateTime<SP>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojInputDateTime<SP>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputDateTime<SP>["helpHints"]>;
    'keyboardEditChanged': JetElementCustomEvent<ojInputDateTime<SP>["keyboardEdit"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputDateTime<SP>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputDateTime<SP>["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputDateTime<SP>["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputDateTime<SP>["messagesCustom"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojInputDateTime<SP>["pickerAttributes"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputDateTime<SP>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputDateTime<SP>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputDateTime<SP>["readonly"]>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEvent<ojInputDateTime<SP>["readonlyUserAssistanceShown"]>;
    'requiredChanged': JetElementCustomEvent<ojInputDateTime<SP>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputDateTime<SP>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputDateTime<SP>["valid"]>;
}
export interface ojInputDateTimeSettableProperties extends ojInputDateSettableProperties {
    converter: Converter<any>;
    max: string | null;
    min: string | null;
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    timePicker: {
        /** @deprecated since 8.2.0 - This attribute is deprecated and should not be used as it will be ignored in new UX design. */
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthExceeded?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        accessibleMaxLengthRemaining?: string;
        cancel?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        currentText?: string;
        dateRestriction?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: string;
        };
        dateTimeRange?: {
            /** @deprecated since 17.0.0 - Please use help-hints instead. */
            hint?: {
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                inRange?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                max?: string;
                /** @deprecated since 17.0.0 - Please use help-hints instead. */
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: {
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeOverflow?: string;
                /** @deprecated since 17.0.0 - This is not supported in the Redwood UX specification. */
                rangeUnderflow?: string;
            };
        };
        done?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        nextText?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        prevText?: string;
        /** @deprecated since 17.0.0 - This is not supported by the component. */
        regexp?: {
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageDetail?: string;
            /** @deprecated since 17.0.0 - This is not supported by the component. */
            messageSummary?: string;
        };
        required?: {
            /** @deprecated since 17.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
        time?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendar?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarDisabled?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTime?: string;
        /** @deprecated since 17.0.0 - This is not configurable per component instance in the Redwood UX specification. */
        tooltipCalendarTimeDisabled?: string;
        /** @deprecated since 17.0.0 - The Redwood UX specification does not allow this to be configurable. */
        weekHeader?: string;
    };
}
export interface ojInputDateTimeSettablePropertiesLenient extends Partial<ojInputDateTimeSettableProperties> {
    [key: string]: any;
}
export interface ojInputTime extends inputBase<string, ojInputTimeSettableProperties> {
    converter: Converter<any>;
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    timePicker: {
        /** @deprecated since 8.2.0 - This attribute is deprecated and should not be used as it will be ignored in new UX design. */
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        /** @deprecated since 18.0.0 - This message text should be consistent across the application, and not configured per component instance. */
        accessibleMaxLengthExceeded?: string;
        /** @deprecated since 18.0.0 - This message text should be consistent across the application, and not configured per component instance. */
        accessibleMaxLengthRemaining?: string;
        ampmWheelLabel?: string;
        cancelText?: string;
        currentTimeText?: string;
        dateTimeRange?: {
            /** @deprecated since 18.0.0 - Please use help-hints instead. */
            hint?: {
                /** @deprecated since 18.0.0 - Please use help-hints instead. */
                inRange?: string;
                /** @deprecated since 18.0.0 - Please use help-hints instead. */
                max?: string;
                /** @deprecated since 18.0.0 - Please use help-hints instead. */
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            /** @deprecated since 18.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: {
                /** @deprecated since 18.0.0 - This is not supported in the Redwood UX specification. */
                rangeOverflow?: string;
                /** @deprecated since 18.0.0 - This is not supported in the Redwood UX specification. */
                rangeUnderflow?: string;
            };
        };
        hourWheelLabel?: string;
        minuteWheelLabel?: string;
        okText?: string;
        /** @deprecated since 18.0.0 - The implicit regexp validator is not supported by the component. */
        regexp?: {
            /** @deprecated since 18.0.0 - The implicit regexp validator is not supported by the component. */
            messageDetail?: string;
            /** @deprecated since 18.0.0 - The implicit regexp validator is not supported by the component. */
            messageSummary?: string;
        };
        required?: {
            /** @deprecated since 18.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
        tooltipTime?: string;
        tooltipTimeDisabled?: string;
    };
    addEventListener<T extends keyof ojInputTimeEventMap>(type: T, listener: (this: HTMLElement, ev: ojInputTimeEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojInputTimeSettableProperties>(property: T): ojInputTime[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojInputTimeSettableProperties>(property: T, value: ojInputTimeSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojInputTimeSettableProperties>): void;
    setProperties(properties: ojInputTimeSettablePropertiesLenient): void;
    hide(): void;
    refresh(): void;
    show(): void;
}
export namespace ojInputTime {
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
    type converterChanged = JetElementCustomEvent<ojInputTime["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged = JetElementCustomEvent<ojInputTime["keyboardEdit"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojInputTime["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojInputTime["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojInputTime["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged = JetElementCustomEvent<ojInputTime["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timePickerChanged = JetElementCustomEvent<ojInputTime["timePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojInputTime["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojInputTime["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged = inputBase.asyncValidatorsChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged = inputBase.autocompleteChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = inputBase.autofocusChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = inputBase.describedByChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = inputBase.disabledChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = inputBase.displayOptionsChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = inputBase.helpChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = inputBase.helpHintsChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = inputBase.labelEdgeChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = inputBase.labelHintChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = inputBase.labelledByChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = inputBase.messagesCustomChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = inputBase.placeholderChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = inputBase.rawValueChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = inputBase.readonlyChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged = inputBase.readonlyUserAssistanceShownChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = inputBase.requiredChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = inputBase.userAssistanceDensityChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = inputBase.validChanged<string, ojInputTimeSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojInputTimeEventMap extends inputBaseEventMap<string, ojInputTimeSettableProperties> {
    'ojAnimateEnd': ojInputTime.ojAnimateEnd;
    'ojAnimateStart': ojInputTime.ojAnimateStart;
    'converterChanged': JetElementCustomEvent<ojInputTime["converter"]>;
    'keyboardEditChanged': JetElementCustomEvent<ojInputTime["keyboardEdit"]>;
    'maxChanged': JetElementCustomEvent<ojInputTime["max"]>;
    'minChanged': JetElementCustomEvent<ojInputTime["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojInputTime["pickerAttributes"]>;
    'renderModeChanged': JetElementCustomEvent<ojInputTime["renderMode"]>;
    'timePickerChanged': JetElementCustomEvent<ojInputTime["timePicker"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputTime["validators"]>;
    'valueChanged': JetElementCustomEvent<ojInputTime["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputTime["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojInputTime["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputTime["autofocus"]>;
    'describedByChanged': JetElementCustomEvent<ojInputTime["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputTime["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputTime["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojInputTime["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputTime["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputTime["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputTime["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputTime["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputTime["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputTime["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputTime["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputTime["readonly"]>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEvent<ojInputTime["readonlyUserAssistanceShown"]>;
    'requiredChanged': JetElementCustomEvent<ojInputTime["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputTime["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputTime["valid"]>;
}
export interface ojInputTimeSettableProperties extends inputBaseSettableProperties<string> {
    converter: Converter<any>;
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    /** @deprecated since 8.0.0 - Support for "native" mode rendering is deprecated because JET promotes a consistent Oracle UX based upon the Redwood design system. As a result,
       the theme variable "$inputDateTimeRenderModeOptionDefault" is also deprecated. */
    renderMode: 'jet' | 'native';
    timePicker: {
        /** @deprecated since 8.2.0 - This attribute is deprecated and should not be used as it will be ignored in new UX design. */
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        /** @deprecated since 18.0.0 - This message text should be consistent across the application, and not configured per component instance. */
        accessibleMaxLengthExceeded?: string;
        /** @deprecated since 18.0.0 - This message text should be consistent across the application, and not configured per component instance. */
        accessibleMaxLengthRemaining?: string;
        ampmWheelLabel?: string;
        cancelText?: string;
        currentTimeText?: string;
        dateTimeRange?: {
            /** @deprecated since 18.0.0 - Please use help-hints instead. */
            hint?: {
                /** @deprecated since 18.0.0 - Please use help-hints instead. */
                inRange?: string;
                /** @deprecated since 18.0.0 - Please use help-hints instead. */
                max?: string;
                /** @deprecated since 18.0.0 - Please use help-hints instead. */
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            /** @deprecated since 18.0.0 - This is not supported in the Redwood UX specification. */
            messageSummary?: {
                /** @deprecated since 18.0.0 - This is not supported in the Redwood UX specification. */
                rangeOverflow?: string;
                /** @deprecated since 18.0.0 - This is not supported in the Redwood UX specification. */
                rangeUnderflow?: string;
            };
        };
        hourWheelLabel?: string;
        minuteWheelLabel?: string;
        okText?: string;
        /** @deprecated since 18.0.0 - The implicit regexp validator is not supported by the component. */
        regexp?: {
            /** @deprecated since 18.0.0 - The implicit regexp validator is not supported by the component. */
            messageDetail?: string;
            /** @deprecated since 18.0.0 - The implicit regexp validator is not supported by the component. */
            messageSummary?: string;
        };
        required?: {
            /** @deprecated since 18.0.0 - Setting a required validator hint is not recommended in the Redwood design system. */
            hint?: string;
            messageDetail?: string;
            /** @deprecated since 14.0.0 - In the Redwood design system form components do not show validator summaries, so this is no longer needed. */
            messageSummary?: string;
        };
        tooltipTime?: string;
        tooltipTimeDisabled?: string;
    };
}
export interface ojInputTimeSettablePropertiesLenient extends Partial<ojInputTimeSettableProperties> {
    [key: string]: any;
}
export type DatePickerElement = ojDatePicker;
/** @deprecated since 17.0.0 - Suggested alternatives: oj-date-picker, oj-input-date, oj-input-time. The use of oj-date-time-picker is a Redwood anti-pattern. */
export type DateTimePickerElement = ojDateTimePicker;
export type InputDateElement<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = ojInputDate<SP>;
export type InputDateTimeElement<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDateTime<SP>;
export type InputTimeElement = ojInputTime;
export namespace DatePickerElement {
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
    type converterChanged = JetElementCustomEvent<ojDatePicker["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojDatePicker["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojDatePicker["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = JetElementCustomEvent<ojDatePicker["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojDatePicker["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = JetElementCustomEvent<ojDatePicker["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojDatePicker["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = JetElementCustomEvent<ojDatePicker["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojDatePicker["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojDatePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = JetElementCustomEvent<ojDatePicker["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDatePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojDatePicker["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDatePicker["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = JetElementCustomEvent<ojDatePicker["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = JetElementCustomEvent<ojDatePicker["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = JetElementCustomEvent<ojDatePicker["valid"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojDatePicker["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojDatePicker["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged = ojInputDate.asyncValidatorsChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = ojInputDate.autofocusChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDate.dayFormatterChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDate.dayMetaDataChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDate.readonlyChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type todayTimeZoneChanged = ojInputDate.todayTimeZoneChanged<ojDatePickerSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace DateTimePickerElement {
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
    type converterChanged = JetElementCustomEvent<ojDateTimePicker["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = JetElementCustomEvent<ojDateTimePicker["describedBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = JetElementCustomEvent<ojDateTimePicker["disabled"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = JetElementCustomEvent<ojDateTimePicker["help"]>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = JetElementCustomEvent<ojDateTimePicker["helpHints"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = JetElementCustomEvent<ojDateTimePicker["labelEdge"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = JetElementCustomEvent<ojDateTimePicker["labelHint"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = JetElementCustomEvent<ojDateTimePicker["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojDateTimePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = JetElementCustomEvent<ojDateTimePicker["messagesCustom"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDateTimePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = JetElementCustomEvent<ojDateTimePicker["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDateTimePicker["rawValue"]>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = JetElementCustomEvent<ojDateTimePicker["required"]>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = JetElementCustomEvent<ojDateTimePicker["userAssistanceDensity"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojDateTimePicker["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojDateTimePicker["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged = ojInputDateTime.asyncValidatorsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = ojInputDateTime.autofocusChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged = ojInputDateTime.datePickerChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDateTime.dayFormatterChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDateTime.dayMetaDataChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = ojInputDateTime.displayOptionsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDateTime.readonlyChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged = ojInputDateTime.readonlyUserAssistanceShownChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = ojInputDateTime.validChanged<ojDateTimePickerSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace InputDateElement {
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
    type autocompleteChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["autocomplete"]>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["autofocus"]>;
    // tslint:disable-next-line interface-over-type-literal
    type converterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["datePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayFormatter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayMetaData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["displayOptions"]>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["keyboardEdit"]>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["labelledBy"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["placeholder"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type todayTimeZoneChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["todayTimeZone"]>;
    // tslint:disable-next-line interface-over-type-literal
    type twoDigitYearStartChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["twoDigitYearStart"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.asyncValidatorsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.describedByChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.disabledChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpHintsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelEdgeChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelHintChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.messagesCustomChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.rawValueChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.readonlyChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.readonlyUserAssistanceShownChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.requiredChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.userAssistanceDensityChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.validChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type DayFormatterInput = {
        date: number;
        fullYear: number;
        month: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DayFormatterOutput = {
        className?: string;
        disabled?: boolean;
        tooltip?: string;
    };
}
export namespace InputDateTimeElement {
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
    type converterChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timePickerChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["timePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = JetElementCustomEvent<ojInputDateTime<SP>["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.asyncValidatorsChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.autocompleteChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.autofocusChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.datePickerChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.dayFormatterChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.dayMetaDataChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.describedByChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.disabledChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.displayOptionsChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.helpChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.helpHintsChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.keyboardEditChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.labelEdgeChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.labelHintChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.labelledByChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.messagesCustomChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.pickerAttributesChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.placeholderChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.rawValueChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.readonlyChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.readonlyUserAssistanceShownChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.requiredChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.userAssistanceDensityChanged<SP>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> = ojInputDate.validChanged<SP>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export namespace InputTimeElement {
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
    type converterChanged = JetElementCustomEvent<ojInputTime["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged = JetElementCustomEvent<ojInputTime["keyboardEdit"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged = JetElementCustomEvent<ojInputTime["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojInputTime["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojInputTime["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged = JetElementCustomEvent<ojInputTime["renderMode"]>;
    // tslint:disable-next-line interface-over-type-literal
    type timePickerChanged = JetElementCustomEvent<ojInputTime["timePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = JetElementCustomEvent<ojInputTime["validators"]>;
    // tslint:disable-next-line interface-over-type-literal
    type valueChanged = JetElementCustomEvent<ojInputTime["value"]>;
    //------------------------------------------------------------
    // Start: generated events for inherited properties
    //------------------------------------------------------------
    // tslint:disable-next-line interface-over-type-literal
    type asyncValidatorsChanged = inputBase.asyncValidatorsChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autocompleteChanged = inputBase.autocompleteChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged = inputBase.autofocusChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = inputBase.describedByChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = inputBase.disabledChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = inputBase.displayOptionsChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = inputBase.helpChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = inputBase.helpHintsChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = inputBase.labelEdgeChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = inputBase.labelHintChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = inputBase.labelledByChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = inputBase.messagesCustomChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = inputBase.placeholderChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = inputBase.rawValueChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = inputBase.readonlyChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyUserAssistanceShownChanged = inputBase.readonlyUserAssistanceShownChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = inputBase.requiredChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = inputBase.userAssistanceDensityChanged<string, ojInputTimeSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = inputBase.validChanged<string, ojInputTimeSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface DatePickerIntrinsicProps extends Partial<Readonly<ojDatePickerSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojDatePickerEventMap['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojDatePickerEventMap['ojAnimateStart']) => void;
    /** @deprecated since 18.0.0 */ onconverterChanged?: (value: ojDatePickerEventMap['converterChanged']) => void;
    /** @deprecated since 17.0.0 */ ondescribedByChanged?: (value: ojDatePickerEventMap['describedByChanged']) => void;
    /** @deprecated since 17.0.0 */ ondisabledChanged?: (value: ojDatePickerEventMap['disabledChanged']) => void;
    /** @deprecated since 17.0.0 */ ondisplayOptionsChanged?: (value: ojDatePickerEventMap['displayOptionsChanged']) => void;
    /** @deprecated since 17.0.0 */ onhelpChanged?: (value: ojDatePickerEventMap['helpChanged']) => void;
    /** @deprecated since 17.0.0 */ onhelpHintsChanged?: (value: ojDatePickerEventMap['helpHintsChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelEdgeChanged?: (value: ojDatePickerEventMap['labelEdgeChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelHintChanged?: (value: ojDatePickerEventMap['labelHintChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelledByChanged?: (value: ojDatePickerEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojDatePickerEventMap['maxChanged']) => void;
    /** @deprecated since 17.0.0 */ onmessagesCustomChanged?: (value: ojDatePickerEventMap['messagesCustomChanged']) => void;
    onminChanged?: (value: ojDatePickerEventMap['minChanged']) => void;
    /** @deprecated since 17.0.0 */ onpickerAttributesChanged?: (value: ojDatePickerEventMap['pickerAttributesChanged']) => void;
    /** @deprecated since 17.0.0 */ onplaceholderChanged?: (value: ojDatePickerEventMap['placeholderChanged']) => void;
    /** @deprecated since 11.0.0 */ onrawValueChanged?: (value: ojDatePickerEventMap['rawValueChanged']) => void;
    /** @deprecated since 17.0.0 */ onrequiredChanged?: (value: ojDatePickerEventMap['requiredChanged']) => void;
    /** @deprecated since 17.0.0 */ onuserAssistanceDensityChanged?: (value: ojDatePickerEventMap['userAssistanceDensityChanged']) => void;
    /** @deprecated since 17.0.0 */ onvalidChanged?: (value: ojDatePickerEventMap['validChanged']) => void;
    /** @deprecated since 17.0.0 */ onvalidatorsChanged?: (value: ojDatePickerEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: ojDatePickerEventMap['valueChanged']) => void;
    /** @deprecated since 8.0.0 */ onasyncValidatorsChanged?: (value: ojDatePickerEventMap['asyncValidatorsChanged']) => void;
    /** @deprecated since 17.0.0 */ onautofocusChanged?: (value: ojDatePickerEventMap['autofocusChanged']) => void;
    ondayFormatterChanged?: (value: ojDatePickerEventMap['dayFormatterChanged']) => void;
    /** @deprecated since 17.0.0 */ ondayMetaDataChanged?: (value: ojDatePickerEventMap['dayMetaDataChanged']) => void;
    onreadonlyChanged?: (value: ojDatePickerEventMap['readonlyChanged']) => void;
    ontodayTimeZoneChanged?: (value: ojDatePickerEventMap['todayTimeZoneChanged']) => void;
    children?: ComponentChildren;
}
export interface DateTimePickerIntrinsicProps extends Partial<Readonly<ojDateTimePickerSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojDateTimePickerEventMap['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojDateTimePickerEventMap['ojAnimateStart']) => void;
    /** @deprecated since 17.0.0 */ onconverterChanged?: (value: ojDateTimePickerEventMap['converterChanged']) => void;
    /** @deprecated since 17.0.0 */ ondescribedByChanged?: (value: ojDateTimePickerEventMap['describedByChanged']) => void;
    /** @deprecated since 17.0.0 */ ondisabledChanged?: (value: ojDateTimePickerEventMap['disabledChanged']) => void;
    /** @deprecated since 17.0.0 */ onhelpChanged?: (value: ojDateTimePickerEventMap['helpChanged']) => void;
    /** @deprecated since 17.0.0 */ onhelpHintsChanged?: (value: ojDateTimePickerEventMap['helpHintsChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelEdgeChanged?: (value: ojDateTimePickerEventMap['labelEdgeChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelHintChanged?: (value: ojDateTimePickerEventMap['labelHintChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelledByChanged?: (value: ojDateTimePickerEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: ojDateTimePickerEventMap['maxChanged']) => void;
    /** @deprecated since 17.0.0 */ onmessagesCustomChanged?: (value: ojDateTimePickerEventMap['messagesCustomChanged']) => void;
    onminChanged?: (value: ojDateTimePickerEventMap['minChanged']) => void;
    onpickerAttributesChanged?: (value: ojDateTimePickerEventMap['pickerAttributesChanged']) => void;
    /** @deprecated since 17.0.0 */ onplaceholderChanged?: (value: ojDateTimePickerEventMap['placeholderChanged']) => void;
    /** @deprecated since 11.0.0 */ onrawValueChanged?: (value: ojDateTimePickerEventMap['rawValueChanged']) => void;
    /** @deprecated since 17.0.0 */ onrequiredChanged?: (value: ojDateTimePickerEventMap['requiredChanged']) => void;
    /** @deprecated since 17.0.0 */ onuserAssistanceDensityChanged?: (value: ojDateTimePickerEventMap['userAssistanceDensityChanged']) => void;
    /** @deprecated since 17.0.0 */ onvalidatorsChanged?: (value: ojDateTimePickerEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: ojDateTimePickerEventMap['valueChanged']) => void;
    /** @deprecated since 8.0.0 */ onasyncValidatorsChanged?: (value: ojDateTimePickerEventMap['asyncValidatorsChanged']) => void;
    /** @deprecated since 17.0.0 */ onautofocusChanged?: (value: ojDateTimePickerEventMap['autofocusChanged']) => void;
    ondatePickerChanged?: (value: ojDateTimePickerEventMap['datePickerChanged']) => void;
    ondayFormatterChanged?: (value: ojDateTimePickerEventMap['dayFormatterChanged']) => void;
    /** @deprecated since 17.0.0 */ ondayMetaDataChanged?: (value: ojDateTimePickerEventMap['dayMetaDataChanged']) => void;
    ondisplayOptionsChanged?: (value: ojDateTimePickerEventMap['displayOptionsChanged']) => void;
    onreadonlyChanged?: (value: ojDateTimePickerEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: ojDateTimePickerEventMap['readonlyUserAssistanceShownChanged']) => void;
    onvalidChanged?: (value: ojDateTimePickerEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
export interface InputDateIntrinsicProps extends Partial<Readonly<ojInputDateSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojInputDateEventMap<any>['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojInputDateEventMap<any>['ojAnimateStart']) => void;
    /** @deprecated since 17.0.0 */ onautocompleteChanged?: (value: ojInputDateEventMap<any>['autocompleteChanged']) => void;
    /** @deprecated since 17.0.0 */ onautofocusChanged?: (value: ojInputDateEventMap<any>['autofocusChanged']) => void;
    /** @deprecated since 18.0.0 */ onconverterChanged?: (value: ojInputDateEventMap<any>['converterChanged']) => void;
    ondatePickerChanged?: (value: ojInputDateEventMap<any>['datePickerChanged']) => void;
    ondayFormatterChanged?: (value: ojInputDateEventMap<any>['dayFormatterChanged']) => void;
    /** @deprecated since 17.0.0 */ ondayMetaDataChanged?: (value: ojInputDateEventMap<any>['dayMetaDataChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputDateEventMap<any>['displayOptionsChanged']) => void;
    /** @deprecated since 17.0.0 */ onkeyboardEditChanged?: (value: ojInputDateEventMap<any>['keyboardEditChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelledByChanged?: (value: ojInputDateEventMap<any>['labelledByChanged']) => void;
    onmaxChanged?: (value: ojInputDateEventMap<any>['maxChanged']) => void;
    onminChanged?: (value: ojInputDateEventMap<any>['minChanged']) => void;
    /** @deprecated since 17.0.0 */ onpickerAttributesChanged?: (value: ojInputDateEventMap<any>['pickerAttributesChanged']) => void;
    /** @deprecated since 17.0.0 */ onplaceholderChanged?: (value: ojInputDateEventMap<any>['placeholderChanged']) => void;
    /** @deprecated since 8.0.0 */ onrenderModeChanged?: (value: ojInputDateEventMap<any>['renderModeChanged']) => void;
    ontodayTimeZoneChanged?: (value: ojInputDateEventMap<any>['todayTimeZoneChanged']) => void;
    ontwoDigitYearStartChanged?: (value: ojInputDateEventMap<any>['twoDigitYearStartChanged']) => void;
    onvalidatorsChanged?: (value: ojInputDateEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputDateEventMap<any>['valueChanged']) => void;
    /** @deprecated since 8.0.0 */ onasyncValidatorsChanged?: (value: ojInputDateEventMap<any>['asyncValidatorsChanged']) => void;
    ondescribedByChanged?: (value: ojInputDateEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputDateEventMap<any>['disabledChanged']) => void;
    onhelpChanged?: (value: ojInputDateEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputDateEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputDateEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputDateEventMap<any>['labelHintChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputDateEventMap<any>['messagesCustomChanged']) => void;
    onrawValueChanged?: (value: ojInputDateEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputDateEventMap<any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: ojInputDateEventMap<any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: ojInputDateEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputDateEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputDateEventMap<any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface InputDateTimeIntrinsicProps extends Partial<Readonly<ojInputDateTimeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojInputDateTimeEventMap<any>['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojInputDateTimeEventMap<any>['ojAnimateStart']) => void;
    onconverterChanged?: (value: ojInputDateTimeEventMap<any>['converterChanged']) => void;
    onmaxChanged?: (value: ojInputDateTimeEventMap<any>['maxChanged']) => void;
    onminChanged?: (value: ojInputDateTimeEventMap<any>['minChanged']) => void;
    /** @deprecated since 8.0.0 */ onrenderModeChanged?: (value: ojInputDateTimeEventMap<any>['renderModeChanged']) => void;
    ontimePickerChanged?: (value: ojInputDateTimeEventMap<any>['timePickerChanged']) => void;
    onvalidatorsChanged?: (value: ojInputDateTimeEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputDateTimeEventMap<any>['valueChanged']) => void;
    /** @deprecated since 8.0.0 */ onasyncValidatorsChanged?: (value: ojInputDateTimeEventMap<any>['asyncValidatorsChanged']) => void;
    /** @deprecated since 17.0.0 */ onautocompleteChanged?: (value: ojInputDateTimeEventMap<any>['autocompleteChanged']) => void;
    /** @deprecated since 17.0.0 */ onautofocusChanged?: (value: ojInputDateTimeEventMap<any>['autofocusChanged']) => void;
    ondatePickerChanged?: (value: ojInputDateTimeEventMap<any>['datePickerChanged']) => void;
    ondayFormatterChanged?: (value: ojInputDateTimeEventMap<any>['dayFormatterChanged']) => void;
    /** @deprecated since 17.0.0 */ ondayMetaDataChanged?: (value: ojInputDateTimeEventMap<any>['dayMetaDataChanged']) => void;
    ondescribedByChanged?: (value: ojInputDateTimeEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputDateTimeEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputDateTimeEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojInputDateTimeEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputDateTimeEventMap<any>['helpHintsChanged']) => void;
    /** @deprecated since 17.0.0 */ onkeyboardEditChanged?: (value: ojInputDateTimeEventMap<any>['keyboardEditChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputDateTimeEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputDateTimeEventMap<any>['labelHintChanged']) => void;
    /** @deprecated since 17.0.0 */ onlabelledByChanged?: (value: ojInputDateTimeEventMap<any>['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputDateTimeEventMap<any>['messagesCustomChanged']) => void;
    /** @deprecated since 17.0.0 */ onpickerAttributesChanged?: (value: ojInputDateTimeEventMap<any>['pickerAttributesChanged']) => void;
    /** @deprecated since 17.0.0 */ onplaceholderChanged?: (value: ojInputDateTimeEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputDateTimeEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputDateTimeEventMap<any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: ojInputDateTimeEventMap<any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: ojInputDateTimeEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputDateTimeEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputDateTimeEventMap<any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface InputTimeIntrinsicProps extends Partial<Readonly<ojInputTimeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateEnd?: (value: ojInputTimeEventMap['ojAnimateEnd']) => void;
    /** @deprecated since 12.1.0 - This web component no longer supports this event. */
    onojAnimateStart?: (value: ojInputTimeEventMap['ojAnimateStart']) => void;
    onconverterChanged?: (value: ojInputTimeEventMap['converterChanged']) => void;
    onkeyboardEditChanged?: (value: ojInputTimeEventMap['keyboardEditChanged']) => void;
    onmaxChanged?: (value: ojInputTimeEventMap['maxChanged']) => void;
    onminChanged?: (value: ojInputTimeEventMap['minChanged']) => void;
    onpickerAttributesChanged?: (value: ojInputTimeEventMap['pickerAttributesChanged']) => void;
    /** @deprecated since 8.0.0 */ onrenderModeChanged?: (value: ojInputTimeEventMap['renderModeChanged']) => void;
    ontimePickerChanged?: (value: ojInputTimeEventMap['timePickerChanged']) => void;
    onvalidatorsChanged?: (value: ojInputTimeEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputTimeEventMap['valueChanged']) => void;
    /** @deprecated since 8.0.0 */ onasyncValidatorsChanged?: (value: ojInputTimeEventMap['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojInputTimeEventMap['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojInputTimeEventMap['autofocusChanged']) => void;
    ondescribedByChanged?: (value: ojInputTimeEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputTimeEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputTimeEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojInputTimeEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputTimeEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputTimeEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputTimeEventMap['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojInputTimeEventMap['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputTimeEventMap['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojInputTimeEventMap['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputTimeEventMap['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputTimeEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: ojInputTimeEventMap['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: ojInputTimeEventMap['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputTimeEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputTimeEventMap['validChanged']) => void;
    children?: ComponentChildren;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            "oj-date-picker": DatePickerIntrinsicProps;
            "oj-date-time-picker": DateTimePickerIntrinsicProps;
            "oj-input-date": InputDateIntrinsicProps;
            "oj-input-date-time": InputDateTimeIntrinsicProps;
            "oj-input-time": InputTimeIntrinsicProps;
        }
    }
}
