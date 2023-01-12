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
        dateFormat?: 'short' | 'medium' | 'long' | 'full';
        day?: '2-digit' | 'numeric';
        era?: 'narrow' | 'short' | 'long';
        formatType?: 'date' | 'time' | 'datetime';
        hour?: '2-digit' | 'numeric';
        hour12?: boolean;
        hourCycle?: 'h11' | 'h12' | 'h23' | 'h24';
        isoStrFormat?: 'offset' | 'zulu' | 'local' | 'auto';
        lenientParse?: 'full' | 'none';
        millisecond?: 'numeric';
        minute?: '2-digit' | 'numeric';
        month?: '2-digit' | 'numeric' | 'narrow' | 'short' | 'long';
        pattern?: string;
        second?: '2-digit' | 'numeric';
        timeFormat?: 'short' | 'medium' | 'long' | 'full';
        timeZone?: string;
        timeZoneName?: 'short' | 'long';
        'two-digit-year-start'?: number;
        weekday?: 'narrow' | 'short' | 'long';
        year?: '2-digit' | 'numeric';
    };
}
