/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

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
        style?: string;
        class?: string;
    };
    renderMode: 'jet';
    value: string;
    addEventListener<T extends keyof ojDatePickerEventMap>(type: T, listener: (this: HTMLElement, ev: ojDatePickerEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    type valueChanged = JetElementCustomEvent<ojDatePicker["value"]>;
}
export interface ojDatePickerEventMap extends ojInputDateEventMap<ojDatePickerSettableProperties> {
    'ojAnimateEnd': ojDatePicker.ojAnimateEnd;
    'ojAnimateStart': ojDatePicker.ojAnimateStart;
    'maxChanged': JetElementCustomEvent<ojDatePicker["max"]>;
    'minChanged': JetElementCustomEvent<ojDatePicker["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojDatePicker["pickerAttributes"]>;
    'valueChanged': JetElementCustomEvent<ojDatePicker["value"]>;
}
export interface ojDatePickerSettableProperties extends ojInputDateSettableProperties {
    keyboardEdit: 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
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
        style?: string;
        class?: string;
    };
    renderMode: 'jet';
    value: string;
    addEventListener<T extends keyof ojDateTimePickerEventMap>(type: T, listener: (this: HTMLElement, ev: ojDateTimePickerEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    type valueChanged = JetElementCustomEvent<ojDateTimePicker["value"]>;
}
export interface ojDateTimePickerEventMap extends ojInputDateTimeEventMap<ojDateTimePickerSettableProperties> {
    'ojAnimateEnd': ojDateTimePicker.ojAnimateEnd;
    'ojAnimateStart': ojDateTimePicker.ojAnimateStart;
    'maxChanged': JetElementCustomEvent<ojDateTimePicker["max"]>;
    'minChanged': JetElementCustomEvent<ojDateTimePicker["min"]>;
    'pickerAttributesChanged': JetElementCustomEvent<ojDateTimePicker["pickerAttributes"]>;
    'valueChanged': JetElementCustomEvent<ojDateTimePicker["value"]>;
}
export interface ojDateTimePickerSettableProperties extends ojInputDateTimeSettableProperties {
    keyboardEdit: 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
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
        style?: string;
        class?: string;
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
    addEventListener<T extends keyof ojInputDateEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: ojInputDateEventMap<SP>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
    // tslint:disable-next-line interface-over-type-literal
    type DayFormatterInput = {
        fullYear: number;
        month: number;
        date: number;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DayFormatterOutput = {
        disabled?: boolean;
        className?: string;
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
        style?: string;
        class?: string;
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
        showOn: 'focus' | 'image';
        timeIncrement: string;
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
        tooltipCalendar?: string;
        tooltipCalendarDisabled?: string;
        tooltipCalendarTime?: string;
        tooltipCalendarTimeDisabled?: string;
        weekHeader?: string;
    };
    addEventListener<T extends keyof ojInputDateTimeEventMap<SP>>(type: T, listener: (this: HTMLElement, ev: ojInputDateTimeEventMap<SP>[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
}
export interface ojInputDateTimeSettableProperties extends ojInputDateSettableProperties {
    converter: Promise<Converter<any>> | Converter<any>;
    max: string | null;
    min: string | null;
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn: 'focus' | 'image';
        timeIncrement: string;
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
        style?: string;
        class?: string;
    };
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn: 'focus' | 'image';
        timeIncrement: string;
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
    addEventListener<T extends keyof ojInputTimeEventMap>(type: T, listener: (this: HTMLElement, ev: ojInputTimeEventMap[T]) => any, useCapture?: boolean): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, useCapture?: boolean): void;
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
}
export interface ojInputTimeSettableProperties extends inputBaseSettableProperties<string> {
    converter: Promise<Converter<any>> | Converter<any>;
    keyboardEdit: 'enabled' | 'disabled';
    max: string | null;
    min: string | null;
    pickerAttributes: {
        style?: string;
        class?: string;
    };
    renderMode: 'jet' | 'native';
    timePicker: {
        footerLayout: '' | 'now';
        showOn: 'focus' | 'image';
        timeIncrement: string;
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
