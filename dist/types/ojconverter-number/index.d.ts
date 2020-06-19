/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Converter = require('../ojconverter');
export class IntlNumberConverter extends NumberConverter {
    constructor(options?: IntlNumberConverter.ConverterOptions);
    format(value: number): string;
    getHint(): null;
    getOptions(): IntlNumberConverter.ConverterOptions;
    parse(value: string): number | null;
    resolvedOptions(): IntlNumberConverter.ConverterOptions;
}
export namespace IntlNumberConverter {
    // tslint:disable-next-line interface-over-type-literal
    type ConverterOptions = {
        style?: 'decimal' | 'currency' | 'percent' | 'unit';
        currency?: string;
        unit?: 'byte' | 'bit';
        currencyDisplay?: 'code' | 'symbol' | 'name';
        decimalFormat?: 'standard' | 'short' | 'long';
        currencyFormat?: 'standard' | 'short' | 'long';
        minimumIntegerDigits?: number;
        minimumFractionDigits?: number;
        maximumFractionDigits?: number;
        useGrouping?: boolean;
        pattern?: string;
        roundingMode?: 'HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'UP' | 'DOWN' | 'CEILING' | 'FLOOR';
        roundDuringParse?: boolean;
        separators?: Separators;
        lenientParse?: 'full' | 'none';
    };
    // tslint:disable-next-line interface-over-type-literal
    type Separators = {
        decimal?: string;
        group?: string;
    };
}
export abstract class NumberConverter implements Converter<number> {
    format(value: number): string | null;
    parse(value: string): number | null;
}
