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
        currency?: string;
        currencyDisplay?: 'code' | 'symbol' | 'name';
        currencyFormat?: 'standard' | 'short' | 'long';
        decimalFormat?: 'standard' | 'short' | 'long';
        lenientParse?: 'full' | 'none';
        maximumFractionDigits?: number;
        minimumFractionDigits?: number;
        minimumIntegerDigits?: number;
        pattern?: string;
        roundDuringParse?: boolean;
        roundingMode?: 'HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'UP' | 'DOWN' | 'CEILING' | 'FLOOR';
        separators?: Separators;
        style?: 'decimal' | 'currency' | 'percent' | 'unit';
        unit?: 'byte' | 'bit';
        useGrouping?: boolean;
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
