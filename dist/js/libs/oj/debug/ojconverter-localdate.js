/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['exports', 'ojs/ojconverter-nativedatetime', 'ojs/ojconverter-preferences', 'ojs/ojconverter-datetimeerror', '@oracle/oraclejet-preact/UNSAFE_IntlDateTime'], function (exports, ojconverterNativedatetime, ojconverterPreferences, ojconverterDatetimeerror, UNSAFE_IntlDateTime) { 'use strict';

    // A date-only converter that merges in user preferences, if any.
    class LocalDateConverter {
        constructor(options) {
            // Make the default options to be 'short'.
            const defaultOptions = { dateStyle: 'short' };
            const originalOptions = options ?? defaultOptions;
            const mo = ojconverterPreferences.getMergedDateTimePreferencesWithOptions(originalOptions);
            // datetime preferences might have timeZone but there is no timeZone in a local date, so remove it.
            delete mo.timeZone;
            const constantLocalOptions = {
                isoStrFormat: 'local',
                numberingSystem: 'latn',
                calendar: 'gregory',
                lenientParse: 'full'
            };
            // If the merged options contain a pattern, that indicates that the user has a pattern as their preferred date format.
            if (mo.pattern) {
                // need the pattern, else there is a typescript error since pattern is optional in mo but required in NDTPC constructor.
                const patternOptions = {
                    pattern: mo.pattern,
                    ...mo,
                    ...constantLocalOptions
                };
                this.wrapped = new ojconverterNativedatetime.NativeDateTimePatternConverter(patternOptions);
                // When the user inputs something that cannot be parsed, an error message appears with an hard-coded date formatted as an example,
                // e.g., "Try again using this format: 11/29/2023".
                // This exampleFormatConverter is used to format the example date.
                // We format the date in the user's preferred date format that uses their date pattern.
                this.exampleFormatConverter = this.wrapped;
            }
            else {
                const newOptions = { ...mo, ...constantLocalOptions };
                this.wrapped = new ojconverterNativedatetime.NativeDateTimeConverter(newOptions);
                // This exampleFormatConverter is used to format the example date shown to the user due to a parse error.
                // The example date is a short format with a 'numeric' (4-digit) year.
                this.exampleFormatConverter = new ojconverterNativedatetime.NativeDateTimeConverter({
                    locale: newOptions.locale,
                    dateStyle: 'short',
                    dateStyleShortYear: 'numeric'
                });
            }
        }
        /**
         * Formats a date-only iso string and returns the formatted string, using the options this converter was
         * initialized with.
         *
         * @param {DateISOStr} date-only iso string value to be formatted for display
         * @return {string} the localized and formatted value suitable for display.
         *
         * @throws {Error} an error when formatting fails.
         * @memberof LocalDateConverter
         * @instance
         * @method format
         */
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
        /**
         * Parses a string value to return a date-only iso string, using the options this converter was initialized with.
         *
         * @param {string} input to parse
         * @return {DateISOStr} the parsed input
         * @throws {Error} an error when parsing fails.
         * @memberof LocalDateConverter
         * @instance
         * @method parse
         */
        parse(input) {
            try {
                return this.wrapped.parse(input);
            }
            catch (e) {
                var converterError = this._processConverterError(e);
                throw converterError;
            }
        }
        /**
         * Returns an object literal with properties reflecting the date formatting options computed based
         * on the options parameter. If an option is not provided, the properties will be derived from the
         * locale defaults.
         * @return {Object} An object literal containing the resolved options.
         * @see LocalDateConverter.ConverterOptions
         *
         * @throws {Error} an error when the options that the converter was initialized with are invalid.
         * @ojsignature {target:"Type", for: "returns",
         *    value: "LocalDateConverter.ConverterOptions"}
         * @memberof LocalDateConverter
         * @instance
         * @method resolvedOptions
         */
        resolvedOptions() {
            return this.wrapped.resolvedOptions();
        }
        /**
         * Processes the error returned by format or parse and returns a new Error with a message.
         * @param {Error} e the error to process.
         * @returns new Error with a message
         * @private
         */
        _processConverterError(e) {
            // In the case of a parse error, the UX design calls for the user to see an example of the format in a short form, like:
            // "Try again using a format like this: 11/29/2023". We pass in the exampleFormatConverter's format to format the 2023-11-29
            // hard-coded date for the locale.
            const formatter = this.exampleFormatConverter.format.bind(this.exampleFormatConverter);
            const { detail } = ojconverterDatetimeerror._processConverterError(e, formatter, 'date');
            return new Error(detail);
        }
    }

    exports.LocalDateConverter = LocalDateConverter;

    Object.defineProperty(exports, '__esModule', { value: true });

});
