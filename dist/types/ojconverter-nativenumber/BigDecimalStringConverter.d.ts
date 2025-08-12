/**
 * @license
 * Copyright (c) 2022 2025, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { ConverterOptions, ResolvedConverterOptions } from './types';
export declare class BigDecimalStringConverter {
    private locale;
    private options;
    private cachedResolvedAndNativeOptions;
    constructor(options?: ConverterOptions);
    /**
     * Formats a big decimal and returns the formatted string, using the options this converter was
     * initialized with.
     *
     * @param {string} value to be formatted for display
     * @return {string} the localized and formatted value suitable for display. When the value is
     * formatted as a percent it's multiplied by 100.
     *
     * @throws {Error} an error when both when formatting fails, or if the options provided during
     * initialization cannot be resolved correctly.
     * @memberof BigDecimalStringConverter
     * @instance
     * @method format
     */
    format(value: string): string;
    /**
     * Parses a string value to return a string representation of the number, using the options this converter was initialized with.
     *
     * @param {string} input to parse
     * @return {string} the string representation of the number
     * @throws {Error} an error when parsing fails, or when the options provided during
     * initialization cannot be resolved correctly.
     * @memberof BigDecimalStringConverter
     * @instance
     * @method parse
     */
    parse(input: string): string;
    /**
     * Returns an object literal with properties reflecting the number formatting options computed based
     * on the options parameter. If an option is not provided, the properties will be derived from the
     * locale defaults.
     * @return {Object} An object literal containing the resolved options.
     * @see BigDecimalStringConverter.ConverterOptions
     *
     * @throws an error when the options that the converter was initialized with are invalid.
     * @ojsignature {target:"Type", for: "returns",
     *    value: "BigDecimalStringConverter.ConverterOptions"}
     * @memberof BigDecimalStringConverter
     * @instance
     * @method resolvedOptions
     */
    resolvedOptions(): ResolvedConverterOptions;
    getHint(): null;
    private _format;
    private _stitchFractionOnly;
    private _stitchWholeAndFraction;
    private _formatWithCustomSeparators;
    private _getFractionPart;
    private _getMinimumIntegerDigitsForFraction;
    private _formatDecimalPart;
    private _getResolvedAndNativeOptions;
}
