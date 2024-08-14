import type { ConverterOptions, ResolvedConverterOptions } from './types';
export declare class BigDecimalStringConverter {
    private locale;
    private options;
    private cachedResolvedAndNativeOptions;
    constructor(options?: ConverterOptions);
    format(value: string): string;
    parse(input: string): string;
    resolvedOptions(): ResolvedConverterOptions;
    getHint(): null;
    private _format;
    private _stitchFractionOnly;
    private _stitchWholeAndFraction;
    private _formatWithCustomSeparators;
    private _formatToPartsWithCustomSeparators;
    private _getFractionPart;
    private _getMinimumIntegerDigitsForFraction;
    private _formatDecimalPart;
    private _getResolvedAndNativeOptions;
}
