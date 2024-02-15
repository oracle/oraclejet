/**
 * @license
 * Copyright (c) 2014, 2024, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconverter-nativedatetime', 'ojs/ojconverter-preferences', 'ojs/ojconverter-datetimeerror', '@oracle/oraclejet-preact/UNSAFE_IntlDateTime'], function (exports, ojconverterNativedatetime, ojconverterPreferences, ojconverterDatetimeerror, UNSAFE_IntlDateTime) { 'use strict';

    class LocalDateConverter {
        constructor(options) {
            const defaultOptions = { dateStyle: 'short' };
            const originalOptions = options ?? defaultOptions;
            const mo = ojconverterPreferences.getMergedDateTimePreferencesWithOptions(originalOptions);
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
                this.wrapped = new ojconverterNativedatetime.NativeDateTimePatternConverter(patternOptions);
                this.exampleFormatConverter = this.wrapped;
            }
            else {
                const newOptions = { ...mo, ...constantLocalOptions };
                this.wrapped = new ojconverterNativedatetime.NativeDateTimeConverter(newOptions);
                this.exampleFormatConverter = new ojconverterNativedatetime.NativeDateTimeConverter({
                    locale: newOptions.locale,
                    dateStyle: 'short',
                    dateStyleShortYear: 'numeric'
                });
            }
        }
        format(value) {
            if (!UNSAFE_IntlDateTime.DateTimeUtils.isDateOnlyIsoString(value))
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
            const { detail } = ojconverterDatetimeerror._processConverterError(e, formatter, 'date');
            return new Error(detail);
        }
    }

    exports.LocalDateConverter = LocalDateConverter;

    Object.defineProperty(exports, '__esModule', { value: true });

});
