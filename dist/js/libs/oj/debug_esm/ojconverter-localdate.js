/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { NativeDateTimePatternConverter, NativeDateTimeConverter } from 'ojs/ojconverter-nativedatetime';
import { getMergedDateTimePreferencesWithOptions } from 'ojs/ojconverter-preferences';
import { _processConverterError } from 'ojs/ojconverter-datetimeerror';
import { DateTimeUtils } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';

class LocalDateConverter {
    constructor(options) {
        const defaultOptions = { dateStyle: 'short' };
        const originalOptions = options ?? defaultOptions;
        const mo = getMergedDateTimePreferencesWithOptions(originalOptions);
        delete mo.timeZone;
        const constantLocalOptions = {
            isoStrFormat: 'local',
            numberingSystem: 'latn',
            calendar: 'gregory',
            lenientParse: 'full'
        };
        if (mo.pattern) {
            const patternOptions = {
                pattern: mo.pattern,
                ...mo,
                ...constantLocalOptions
            };
            this.wrapped = new NativeDateTimePatternConverter(patternOptions);
            this.exampleFormatConverter = this.wrapped;
        }
        else {
            const newOptions = { ...mo, ...constantLocalOptions };
            this.wrapped = new NativeDateTimeConverter(newOptions);
            this.exampleFormatConverter = new NativeDateTimeConverter({
                locale: newOptions.locale,
                dateStyle: 'short',
                dateStyleShortYear: 'numeric'
            });
        }
    }
    format(value) {
        if (!DateTimeUtils.isDateOnlyIsoString(value))
            throw new Error('The value to format must be a date-only ISO string.');
        try {
            return this.wrapped.format(value);
        }
        catch (e) {
            var converterError = this._processConverterError(e);
            throw converterError;
        }
    }
    parse(input) {
        try {
            return this.wrapped.parse(input);
        }
        catch (e) {
            var converterError = this._processConverterError(e);
            throw converterError;
        }
    }
    resolvedOptions() {
        return this.wrapped.resolvedOptions();
    }
    _processConverterError(e) {
        const formatter = this.exampleFormatConverter.format.bind(this.exampleFormatConverter);
        const { detail } = _processConverterError(e, formatter, 'date');
        return new Error(detail);
    }
}

export { LocalDateConverter };
