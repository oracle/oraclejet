/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Converter = require('../ojconverter');
export abstract class DateTimeConverter implements Converter<string> {
    abstract calculateWeek(value: string): number | undefined;
    compareISODates(isoStr: string, isoStr2: string): number;
    format(value: string): string | null;
    getAvailableTimeZones(): any[];
    abstract isDayNameSet(): boolean;
    abstract isDaySet(): boolean;
    abstract isHourInAMPMSet(): boolean;
    abstract isHourInDaySet(): boolean;
    abstract isMilliSecondSet(): boolean;
    abstract isMinuteSet(): boolean;
    abstract isMonthSet(): boolean;
    abstract isSecondSet(): boolean;
    abstract isYearSet(): boolean;
    parse(value: string): string | null;
}
export class IntlDateTimeConverter extends DateTimeConverter {
    constructor(options?: IntlDateTimeConverter.ConverterOptions);
    calculateWeek(value: string): number;
    compareISODates(isoStr: string, isoStr2: string): number;
    format(value: string): string | null;
    formatRelative(value: string, relativeOptions?: {
        formatUsing?: string;
        dateField?: string;
        relativeTime?: string;
        dateOnly?: boolean;
        timeZone?: string;
    }): string | null;
    getAvailableTimeZones(): any[];
    getHint(): null;
    getOptions(): IntlDateTimeConverter.ConverterOptions;
    isDayNameSet(): boolean;
    isDaySet(): boolean;
    isHourInAMPMSet(): boolean;
    isHourInDaySet(): boolean;
    isMilliSecondSet(): boolean;
    isMinuteSet(): boolean;
    isMonthSet(): boolean;
    isSecondSet(): boolean;
    isYearSet(): boolean;
    parse(value: string): string | null;
    resolvedOptions(): IntlDateTimeConverter.ConverterOptions;
}
export namespace IntlDateTimeConverter {
    // tslint:disable-next-line interface-over-type-literal
    type ConverterOptions = {
        year?: '2-digit' | 'numeric';
        'two-digit-year-start'?: number;
        month?: '2-digit' | 'numeric' | 'narrow' | 'short' | 'long';
        day?: '2-digit' | 'numeric';
        hour?: '2-digit' | 'numeric';
        minute?: '2-digit' | 'numeric';
        second?: '2-digit' | 'numeric';
        millisecond?: 'numeric';
        weekday?: 'narrow' | 'short' | 'long';
        era?: 'narrow' | 'short' | 'long';
        timeZoneName?: 'short' | 'long';
        timeZone?: string;
        isoStrFormat?: 'offset' | 'zulu' | 'local' | 'auto';
        dst?: boolean;
        hour12?: boolean;
        pattern?: string;
        formatType?: 'date' | 'time' | 'datetime';
        dateFormat?: 'short' | 'medium' | 'long' | 'full';
        timeFormat?: 'short' | 'medium' | 'long' | 'full';
        lenientParse?: 'full' | 'none';
    };
}
