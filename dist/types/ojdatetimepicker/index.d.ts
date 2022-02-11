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
import { inputBase, inputBaseEventMap, inputBaseSettableProperties } from '../ojinputtext';
import { JetElement, JetSettableProperties, JetElementCustomEvent, JetSetPropertyType } from '..';
export interface ojDatePicker extends ojInputDate<ojDatePickerSettableProperties> {
    keyboardEdit: 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    readonly rawValue: string;
    renderMode: 'jet';
    value: string;
    addEventListener<T extends keyof ojDatePickerEventMap>(type: T, listener: (this: HTMLElement, ev: ojDatePickerEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ojDatePickerSettableProperties>(property: T): ojDatePicker[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ojDatePickerSettableProperties>(property: T, value: ojDatePickerSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ojDatePickerSettableProperties>): void;
    setProperties(properties: ojDatePickerSettablePropertiesLenient): void;
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
    type maxChanged = JetElementCustomEvent<ojDatePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDatePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDatePicker["rawValue"]>;
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
    type converterChanged = ojInputDate.converterChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDate.dayFormatterChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDate.dayMetaDataChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = ojInputDate.describedByChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = ojInputDate.disabledChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = ojInputDate.displayOptionsChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = ojInputDate.helpChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = ojInputDate.helpHintsChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = ojInputDate.labelEdgeChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = ojInputDate.labelHintChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = ojInputDate.labelledByChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = ojInputDate.messagesCustomChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = ojInputDate.placeholderChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDate.readonlyChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = ojInputDate.requiredChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = ojInputDate.userAssistanceDensityChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = ojInputDate.validChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = ojInputDate.validatorsChanged<ojDatePickerSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojDatePickerEventMap extends ojInputDateEventMap<ojDatePickerSettableProperties> {
    'ojAnimateEnd': ojDatePicker.ojAnimateEnd;
    'ojAnimateStart': ojDatePicker.ojAnimateStart;
    'maxChanged': JetElementCustomEvent<ojDatePicker["max"]>;
    'minChanged': JetElementCustomEvent<ojDatePicker["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    'rawValueChanged': JetElementCustomEvent<ojDatePicker["rawValue"]>;
    'valueChanged': JetElementCustomEvent<ojDatePicker["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojDatePicker["asyncValidators"]>;
    'autofocusChanged': JetElementCustomEvent<ojDatePicker["autofocus"]>;
    'converterChanged': JetElementCustomEvent<ojDatePicker["converter"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojDatePicker["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojDatePicker["dayMetaData"]>;
    'describedByChanged': JetElementCustomEvent<ojDatePicker["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojDatePicker["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojDatePicker["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojDatePicker["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojDatePicker["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojDatePicker["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojDatePicker["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojDatePicker["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojDatePicker["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojDatePicker["placeholder"]>;
    'readonlyChanged': JetElementCustomEvent<ojDatePicker["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojDatePicker["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojDatePicker["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojDatePicker["valid"]>;
    'validatorsChanged': JetElementCustomEvent<ojDatePicker["validators"]>;
}
export interface ojDatePickerSettableProperties extends ojInputDateSettableProperties {
    keyboardEdit: 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    readonly rawValue: string;
    renderMode: 'jet';
    value: string;
}
export interface ojDatePickerSettablePropertiesLenient extends Partial<ojDatePickerSettableProperties> {
    [key: string]: any;
}
export interface ojDateTimePicker extends ojInputDateTime<ojDateTimePickerSettableProperties> {
    keyboardEdit: 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    readonly rawValue: string;
    renderMode: 'jet';
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
    type maxChanged = JetElementCustomEvent<ojDateTimePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDateTimePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDateTimePicker["rawValue"]>;
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
    type converterChanged = ojInputDateTime.converterChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged = ojInputDateTime.datePickerChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDateTime.dayFormatterChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDateTime.dayMetaDataChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = ojInputDateTime.describedByChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = ojInputDateTime.disabledChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = ojInputDateTime.displayOptionsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = ojInputDateTime.helpChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = ojInputDateTime.helpHintsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = ojInputDateTime.labelEdgeChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = ojInputDateTime.labelHintChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = ojInputDateTime.labelledByChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = ojInputDateTime.messagesCustomChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = ojInputDateTime.placeholderChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDateTime.readonlyChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = ojInputDateTime.requiredChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = ojInputDateTime.userAssistanceDensityChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = ojInputDateTime.validChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = ojInputDateTime.validatorsChanged<ojDateTimePickerSettableProperties>;
    //------------------------------------------------------------
    // End: generated events for inherited properties
    //------------------------------------------------------------
}
export interface ojDateTimePickerEventMap extends ojInputDateTimeEventMap<ojDateTimePickerSettableProperties> {
    'ojAnimateEnd': ojDateTimePicker.ojAnimateEnd;
    'ojAnimateStart': ojDateTimePicker.ojAnimateStart;
    'maxChanged': JetElementCustomEvent<ojDateTimePicker["max"]>;
    'minChanged': JetElementCustomEvent<ojDateTimePicker["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    'rawValueChanged': JetElementCustomEvent<ojDateTimePicker["rawValue"]>;
    'valueChanged': JetElementCustomEvent<ojDateTimePicker["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojDateTimePicker["asyncValidators"]>;
    'autofocusChanged': JetElementCustomEvent<ojDateTimePicker["autofocus"]>;
    'converterChanged': JetElementCustomEvent<ojDateTimePicker["converter"]>;
    'datePickerChanged': JetElementCustomEvent<ojDateTimePicker["datePicker"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojDateTimePicker["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojDateTimePicker["dayMetaData"]>;
    'describedByChanged': JetElementCustomEvent<ojDateTimePicker["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojDateTimePicker["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojDateTimePicker["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojDateTimePicker["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojDateTimePicker["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojDateTimePicker["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojDateTimePicker["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojDateTimePicker["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojDateTimePicker["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojDateTimePicker["placeholder"]>;
    'readonlyChanged': JetElementCustomEvent<ojDateTimePicker["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojDateTimePicker["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojDateTimePicker["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojDateTimePicker["valid"]>;
    'validatorsChanged': JetElementCustomEvent<ojDateTimePicker["validators"]>;
}
export interface ojDateTimePickerSettableProperties extends ojInputDateTimeSettableProperties {
    keyboardEdit: 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    readonly rawValue: string;
    renderMode: 'jet';
    value: string;
}
export interface ojDateTimePickerSettablePropertiesLenient extends Partial<ojDateTimePickerSettableProperties> {
    [key: string]: any;
}
export interface ojInputDate<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> extends inputBase<string, SP> {
    converter: Promise<Converter<any>> | Converter<any>;
    datePicker: {
        changeMonth?: string;
        changeYear?: string;
        currentMonthPos?: number;
        daysOutsideMonth?: string;
        footerLayout?: string;
        numberOfMonths?: number;
        showOn?: string;
        stepBigMonths?: number;
        stepMonths?: 'numberOfMonths' | number;
        weekDisplay?: string;
        yearRange?: string;
    };
    dayFormatter: (param: ojInputDate.DayFormatterInput) => (null | 'all' | ojInputDate.DayFormatterOutput);
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
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    renderMode: 'jet' | 'native';
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        currentText?: string;
        dateRestriction?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        dateTimeRange?: {
            hint?: {
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        nextText?: string;
        prevText?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        tooltipCalendar?: string;
        tooltipCalendarDisabled?: string;
        tooltipCalendarTime?: string;
        tooltipCalendarTimeDisabled?: string;
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
    type converterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["datePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayFormatter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayMetaData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["keyboardEdit"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["renderMode"]>;
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
    type autocompleteChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.autocompleteChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.autofocusChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.describedByChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.disabledChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.displayOptionsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpHintsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelEdgeChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelHintChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelledByChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.messagesCustomChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.placeholderChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.rawValueChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.readonlyChanged<string, SP>;
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
    'converterChanged': JetElementCustomEvent<ojInputDate<SP>["converter"]>;
    'datePickerChanged': JetElementCustomEvent<ojInputDate<SP>["datePicker"]>;
    'dayFormatterChanged': JetElementCustomEvent<ojInputDate<SP>["dayFormatter"]>;
    'dayMetaDataChanged': JetElementCustomEvent<ojInputDate<SP>["dayMetaData"]>;
    'keyboardEditChanged': JetElementCustomEvent<ojInputDate<SP>["keyboardEdit"]>;
    'maxChanged': JetElementCustomEvent<ojInputDate<SP>["max"]>;
    'minChanged': JetElementCustomEvent<ojInputDate<SP>["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojInputDate<SP>["pickerAttributes"]>;
    'renderModeChanged': JetElementCustomEvent<ojInputDate<SP>["renderMode"]>;
    'validatorsChanged': JetElementCustomEvent<ojInputDate<SP>["validators"]>;
    'valueChanged': JetElementCustomEvent<ojInputDate<SP>["value"]>;
    'asyncValidatorsChanged': JetElementCustomEvent<ojInputDate<SP>["asyncValidators"]>;
    'autocompleteChanged': JetElementCustomEvent<ojInputDate<SP>["autocomplete"]>;
    'autofocusChanged': JetElementCustomEvent<ojInputDate<SP>["autofocus"]>;
    'describedByChanged': JetElementCustomEvent<ojInputDate<SP>["describedBy"]>;
    'disabledChanged': JetElementCustomEvent<ojInputDate<SP>["disabled"]>;
    'displayOptionsChanged': JetElementCustomEvent<ojInputDate<SP>["displayOptions"]>;
    'helpChanged': JetElementCustomEvent<ojInputDate<SP>["help"]>;
    'helpHintsChanged': JetElementCustomEvent<ojInputDate<SP>["helpHints"]>;
    'labelEdgeChanged': JetElementCustomEvent<ojInputDate<SP>["labelEdge"]>;
    'labelHintChanged': JetElementCustomEvent<ojInputDate<SP>["labelHint"]>;
    'labelledByChanged': JetElementCustomEvent<ojInputDate<SP>["labelledBy"]>;
    'messagesCustomChanged': JetElementCustomEvent<ojInputDate<SP>["messagesCustom"]>;
    'placeholderChanged': JetElementCustomEvent<ojInputDate<SP>["placeholder"]>;
    'rawValueChanged': JetElementCustomEvent<ojInputDate<SP>["rawValue"]>;
    'readonlyChanged': JetElementCustomEvent<ojInputDate<SP>["readonly"]>;
    'requiredChanged': JetElementCustomEvent<ojInputDate<SP>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputDate<SP>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputDate<SP>["valid"]>;
}
export interface ojInputDateSettableProperties extends inputBaseSettableProperties<string> {
    converter: Promise<Converter<any>> | Converter<any>;
    datePicker: {
        changeMonth?: string;
        changeYear?: string;
        currentMonthPos?: number;
        daysOutsideMonth?: string;
        footerLayout?: string;
        numberOfMonths?: number;
        showOn?: string;
        stepBigMonths?: number;
        stepMonths?: 'numberOfMonths' | number;
        weekDisplay?: string;
        yearRange?: string;
    };
    dayFormatter: (param: ojInputDate.DayFormatterInput) => (null | 'all' | ojInputDate.DayFormatterOutput);
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
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    renderMode: 'jet' | 'native';
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        currentText?: string;
        dateRestriction?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        dateTimeRange?: {
            hint?: {
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        nextText?: string;
        prevText?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        tooltipCalendar?: string;
        tooltipCalendarDisabled?: string;
        tooltipCalendarTime?: string;
        tooltipCalendarTimeDisabled?: string;
        weekHeader?: string;
    };
}
export interface ojInputDateSettablePropertiesLenient extends Partial<ojInputDateSettableProperties> {
    [key: string]: any;
}
export interface ojInputDateTime<SP extends ojInputDateTimeSettableProperties = ojInputDateTimeSettableProperties> extends ojInputDate<SP> {
    converter: Promise<Converter<any>> | Converter<any>;
    max: string | null;
    min: string | null;
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        cancel?: string;
        currentText?: string;
        dateRestriction?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        dateTimeRange?: {
            hint?: {
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        done?: string;
        nextText?: string;
        prevText?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        time?: string;
        tooltipCalendar?: string;
        tooltipCalendarDisabled?: string;
        tooltipCalendarTime?: string;
        tooltipCalendarTimeDisabled?: string;
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
    'requiredChanged': JetElementCustomEvent<ojInputDateTime<SP>["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputDateTime<SP>["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputDateTime<SP>["valid"]>;
}
export interface ojInputDateTimeSettableProperties extends ojInputDateSettableProperties {
    converter: Promise<Converter<any>> | Converter<any>;
    max: string | null;
    min: string | null;
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        cancel?: string;
        currentText?: string;
        dateRestriction?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        dateTimeRange?: {
            hint?: {
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        done?: string;
        nextText?: string;
        prevText?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
            messageSummary?: string;
        };
        time?: string;
        tooltipCalendar?: string;
        tooltipCalendarDisabled?: string;
        tooltipCalendarTime?: string;
        tooltipCalendarTimeDisabled?: string;
        weekHeader?: string;
    };
}
export interface ojInputDateTimeSettablePropertiesLenient extends Partial<ojInputDateTimeSettableProperties> {
    [key: string]: any;
}
export interface ojInputTime extends inputBase<string, ojInputTimeSettableProperties> {
    converter: Promise<Converter<any>> | Converter<any>;
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        ampmWheelLabel?: string;
        cancelText?: string;
        currentTimeText?: string;
        dateTimeRange?: {
            hint?: {
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        hourWheelLabel?: string;
        minuteWheelLabel?: string;
        okText?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
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
    'requiredChanged': JetElementCustomEvent<ojInputTime["required"]>;
    'userAssistanceDensityChanged': JetElementCustomEvent<ojInputTime["userAssistanceDensity"]>;
    'validChanged': JetElementCustomEvent<ojInputTime["valid"]>;
}
export interface ojInputTimeSettableProperties extends inputBaseSettableProperties<string> {
    converter: Promise<Converter<any>> | Converter<any>;
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        class?: string;
        style?: string;
    };
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn?: 'focus' | 'userFocus' | 'image';
        timeIncrement?: string;
    };
    validators: Array<Validator<string> | AsyncValidator<string>> | null;
    value: string;
    translations: {
        accessibleMaxLengthExceeded?: string;
        accessibleMaxLengthRemaining?: string;
        ampmWheelLabel?: string;
        cancelText?: string;
        currentTimeText?: string;
        dateTimeRange?: {
            hint?: {
                inRange?: string;
                max?: string;
                min?: string;
            };
            messageDetail?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
            messageSummary?: {
                rangeOverflow?: string;
                rangeUnderflow?: string;
            };
        };
        hourWheelLabel?: string;
        minuteWheelLabel?: string;
        okText?: string;
        regexp?: {
            messageDetail?: string;
            messageSummary?: string;
        };
        required?: {
            hint?: string;
            messageDetail?: string;
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
    type maxChanged = JetElementCustomEvent<ojDatePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDatePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDatePicker["rawValue"]>;
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
    type converterChanged = ojInputDate.converterChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDate.dayFormatterChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDate.dayMetaDataChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = ojInputDate.describedByChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = ojInputDate.disabledChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = ojInputDate.displayOptionsChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = ojInputDate.helpChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = ojInputDate.helpHintsChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = ojInputDate.labelEdgeChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = ojInputDate.labelHintChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = ojInputDate.labelledByChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = ojInputDate.messagesCustomChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = ojInputDate.placeholderChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDate.readonlyChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = ojInputDate.requiredChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = ojInputDate.userAssistanceDensityChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = ojInputDate.validChanged<ojDatePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = ojInputDate.validatorsChanged<ojDatePickerSettableProperties>;
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
    type maxChanged = JetElementCustomEvent<ojDateTimePicker["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged = JetElementCustomEvent<ojDateTimePicker["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged = JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged = JetElementCustomEvent<ojDateTimePicker["rawValue"]>;
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
    type converterChanged = ojInputDateTime.converterChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged = ojInputDateTime.datePickerChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged = ojInputDateTime.dayFormatterChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged = ojInputDateTime.dayMetaDataChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged = ojInputDateTime.describedByChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged = ojInputDateTime.disabledChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged = ojInputDateTime.displayOptionsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged = ojInputDateTime.helpChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged = ojInputDateTime.helpHintsChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged = ojInputDateTime.labelEdgeChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged = ojInputDateTime.labelHintChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged = ojInputDateTime.labelledByChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged = ojInputDateTime.messagesCustomChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged = ojInputDateTime.placeholderChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged = ojInputDateTime.readonlyChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type requiredChanged = ojInputDateTime.requiredChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type userAssistanceDensityChanged = ojInputDateTime.userAssistanceDensityChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validChanged = ojInputDateTime.validChanged<ojDateTimePickerSettableProperties>;
    // tslint:disable-next-line interface-over-type-literal
    type validatorsChanged = ojInputDateTime.validatorsChanged<ojDateTimePickerSettableProperties>;
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
    type converterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["converter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type datePickerChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["datePicker"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayFormatterChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayFormatter"]>;
    // tslint:disable-next-line interface-over-type-literal
    type dayMetaDataChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["dayMetaData"]>;
    // tslint:disable-next-line interface-over-type-literal
    type keyboardEditChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["keyboardEdit"]>;
    // tslint:disable-next-line interface-over-type-literal
    type maxChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["max"]>;
    // tslint:disable-next-line interface-over-type-literal
    type minChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["min"]>;
    // tslint:disable-next-line interface-over-type-literal
    type pickerAttributesChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["pickerAttributes"]>;
    // tslint:disable-next-line interface-over-type-literal
    type renderModeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = JetElementCustomEvent<ojInputDate<SP>["renderMode"]>;
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
    type autocompleteChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.autocompleteChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type autofocusChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.autofocusChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type describedByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.describedByChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type disabledChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.disabledChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type displayOptionsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.displayOptionsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type helpHintsChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.helpHintsChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelEdgeChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelEdgeChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelHintChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelHintChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type labelledByChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.labelledByChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type messagesCustomChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.messagesCustomChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type placeholderChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.placeholderChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type rawValueChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.rawValueChanged<string, SP>;
    // tslint:disable-next-line interface-over-type-literal
    type readonlyChanged<SP extends ojInputDateSettableProperties = ojInputDateSettableProperties> = inputBase.readonlyChanged<string, SP>;
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
    onojAnimateEnd?: (value: ojDatePickerEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojDatePickerEventMap['ojAnimateStart']) => void;
    onmaxChanged?: (value: ojDatePickerEventMap['maxChanged']) => void;
    onminChanged?: (value: ojDatePickerEventMap['minChanged']) => void;
    onpickerAttributesChanged?: (value: ojDatePickerEventMap['pickerAttributesChanged']) => void;
    onrawValueChanged?: (value: ojDatePickerEventMap['rawValueChanged']) => void;
    onvalueChanged?: (value: ojDatePickerEventMap['valueChanged']) => void;
    onasyncValidatorsChanged?: (value: ojDatePickerEventMap['asyncValidatorsChanged']) => void;
    onautofocusChanged?: (value: ojDatePickerEventMap['autofocusChanged']) => void;
    onconverterChanged?: (value: ojDatePickerEventMap['converterChanged']) => void;
    ondayFormatterChanged?: (value: ojDatePickerEventMap['dayFormatterChanged']) => void;
    ondayMetaDataChanged?: (value: ojDatePickerEventMap['dayMetaDataChanged']) => void;
    ondescribedByChanged?: (value: ojDatePickerEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojDatePickerEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojDatePickerEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojDatePickerEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojDatePickerEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojDatePickerEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojDatePickerEventMap['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojDatePickerEventMap['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojDatePickerEventMap['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojDatePickerEventMap['placeholderChanged']) => void;
    onreadonlyChanged?: (value: ojDatePickerEventMap['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojDatePickerEventMap['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojDatePickerEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojDatePickerEventMap['validChanged']) => void;
    onvalidatorsChanged?: (value: ojDatePickerEventMap['validatorsChanged']) => void;
    children?: ComponentChildren;
}
export interface DateTimePickerIntrinsicProps extends Partial<Readonly<ojDateTimePickerSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojDateTimePickerEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojDateTimePickerEventMap['ojAnimateStart']) => void;
    onmaxChanged?: (value: ojDateTimePickerEventMap['maxChanged']) => void;
    onminChanged?: (value: ojDateTimePickerEventMap['minChanged']) => void;
    onpickerAttributesChanged?: (value: ojDateTimePickerEventMap['pickerAttributesChanged']) => void;
    onrawValueChanged?: (value: ojDateTimePickerEventMap['rawValueChanged']) => void;
    onvalueChanged?: (value: ojDateTimePickerEventMap['valueChanged']) => void;
    onasyncValidatorsChanged?: (value: ojDateTimePickerEventMap['asyncValidatorsChanged']) => void;
    onautofocusChanged?: (value: ojDateTimePickerEventMap['autofocusChanged']) => void;
    onconverterChanged?: (value: ojDateTimePickerEventMap['converterChanged']) => void;
    ondatePickerChanged?: (value: ojDateTimePickerEventMap['datePickerChanged']) => void;
    ondayFormatterChanged?: (value: ojDateTimePickerEventMap['dayFormatterChanged']) => void;
    ondayMetaDataChanged?: (value: ojDateTimePickerEventMap['dayMetaDataChanged']) => void;
    ondescribedByChanged?: (value: ojDateTimePickerEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: ojDateTimePickerEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojDateTimePickerEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojDateTimePickerEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojDateTimePickerEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojDateTimePickerEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojDateTimePickerEventMap['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojDateTimePickerEventMap['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojDateTimePickerEventMap['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojDateTimePickerEventMap['placeholderChanged']) => void;
    onreadonlyChanged?: (value: ojDateTimePickerEventMap['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojDateTimePickerEventMap['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojDateTimePickerEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojDateTimePickerEventMap['validChanged']) => void;
    onvalidatorsChanged?: (value: ojDateTimePickerEventMap['validatorsChanged']) => void;
    children?: ComponentChildren;
}
export interface InputDateIntrinsicProps extends Partial<Readonly<ojInputDateSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojInputDateEventMap<any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojInputDateEventMap<any>['ojAnimateStart']) => void;
    onconverterChanged?: (value: ojInputDateEventMap<any>['converterChanged']) => void;
    ondatePickerChanged?: (value: ojInputDateEventMap<any>['datePickerChanged']) => void;
    ondayFormatterChanged?: (value: ojInputDateEventMap<any>['dayFormatterChanged']) => void;
    ondayMetaDataChanged?: (value: ojInputDateEventMap<any>['dayMetaDataChanged']) => void;
    onkeyboardEditChanged?: (value: ojInputDateEventMap<any>['keyboardEditChanged']) => void;
    onmaxChanged?: (value: ojInputDateEventMap<any>['maxChanged']) => void;
    onminChanged?: (value: ojInputDateEventMap<any>['minChanged']) => void;
    onpickerAttributesChanged?: (value: ojInputDateEventMap<any>['pickerAttributesChanged']) => void;
    onrenderModeChanged?: (value: ojInputDateEventMap<any>['renderModeChanged']) => void;
    onvalidatorsChanged?: (value: ojInputDateEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputDateEventMap<any>['valueChanged']) => void;
    onasyncValidatorsChanged?: (value: ojInputDateEventMap<any>['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojInputDateEventMap<any>['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojInputDateEventMap<any>['autofocusChanged']) => void;
    ondescribedByChanged?: (value: ojInputDateEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputDateEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputDateEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojInputDateEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputDateEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputDateEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputDateEventMap<any>['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojInputDateEventMap<any>['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputDateEventMap<any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: ojInputDateEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputDateEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputDateEventMap<any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojInputDateEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputDateEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputDateEventMap<any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface InputDateTimeIntrinsicProps extends Partial<Readonly<ojInputDateTimeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojInputDateTimeEventMap<any>['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojInputDateTimeEventMap<any>['ojAnimateStart']) => void;
    onconverterChanged?: (value: ojInputDateTimeEventMap<any>['converterChanged']) => void;
    onmaxChanged?: (value: ojInputDateTimeEventMap<any>['maxChanged']) => void;
    onminChanged?: (value: ojInputDateTimeEventMap<any>['minChanged']) => void;
    onrenderModeChanged?: (value: ojInputDateTimeEventMap<any>['renderModeChanged']) => void;
    ontimePickerChanged?: (value: ojInputDateTimeEventMap<any>['timePickerChanged']) => void;
    onvalidatorsChanged?: (value: ojInputDateTimeEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputDateTimeEventMap<any>['valueChanged']) => void;
    onasyncValidatorsChanged?: (value: ojInputDateTimeEventMap<any>['asyncValidatorsChanged']) => void;
    onautocompleteChanged?: (value: ojInputDateTimeEventMap<any>['autocompleteChanged']) => void;
    onautofocusChanged?: (value: ojInputDateTimeEventMap<any>['autofocusChanged']) => void;
    ondatePickerChanged?: (value: ojInputDateTimeEventMap<any>['datePickerChanged']) => void;
    ondayFormatterChanged?: (value: ojInputDateTimeEventMap<any>['dayFormatterChanged']) => void;
    ondayMetaDataChanged?: (value: ojInputDateTimeEventMap<any>['dayMetaDataChanged']) => void;
    ondescribedByChanged?: (value: ojInputDateTimeEventMap<any>['describedByChanged']) => void;
    ondisabledChanged?: (value: ojInputDateTimeEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: ojInputDateTimeEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: ojInputDateTimeEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: ojInputDateTimeEventMap<any>['helpHintsChanged']) => void;
    onkeyboardEditChanged?: (value: ojInputDateTimeEventMap<any>['keyboardEditChanged']) => void;
    onlabelEdgeChanged?: (value: ojInputDateTimeEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: ojInputDateTimeEventMap<any>['labelHintChanged']) => void;
    onlabelledByChanged?: (value: ojInputDateTimeEventMap<any>['labelledByChanged']) => void;
    onmessagesCustomChanged?: (value: ojInputDateTimeEventMap<any>['messagesCustomChanged']) => void;
    onpickerAttributesChanged?: (value: ojInputDateTimeEventMap<any>['pickerAttributesChanged']) => void;
    onplaceholderChanged?: (value: ojInputDateTimeEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: ojInputDateTimeEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: ojInputDateTimeEventMap<any>['readonlyChanged']) => void;
    onrequiredChanged?: (value: ojInputDateTimeEventMap<any>['requiredChanged']) => void;
    onuserAssistanceDensityChanged?: (value: ojInputDateTimeEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: ojInputDateTimeEventMap<any>['validChanged']) => void;
    children?: ComponentChildren;
}
export interface InputTimeIntrinsicProps extends Partial<Readonly<ojInputTimeSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAnimateEnd?: (value: ojInputTimeEventMap['ojAnimateEnd']) => void;
    onojAnimateStart?: (value: ojInputTimeEventMap['ojAnimateStart']) => void;
    onconverterChanged?: (value: ojInputTimeEventMap['converterChanged']) => void;
    onkeyboardEditChanged?: (value: ojInputTimeEventMap['keyboardEditChanged']) => void;
    onmaxChanged?: (value: ojInputTimeEventMap['maxChanged']) => void;
    onminChanged?: (value: ojInputTimeEventMap['minChanged']) => void;
    onpickerAttributesChanged?: (value: ojInputTimeEventMap['pickerAttributesChanged']) => void;
    onrenderModeChanged?: (value: ojInputTimeEventMap['renderModeChanged']) => void;
    ontimePickerChanged?: (value: ojInputTimeEventMap['timePickerChanged']) => void;
    onvalidatorsChanged?: (value: ojInputTimeEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: ojInputTimeEventMap['valueChanged']) => void;
    onasyncValidatorsChanged?: (value: ojInputTimeEventMap['asyncValidatorsChanged']) => void;
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
