import type { ConverterOptions, ResolvedConverterOptions } from './types';
export declare class NumberConverter {
    private locale;
    private options;
    private cachedResolvedAndNativeOptions;
    constructor(options?: ConverterOptions);
    format(value: number): string;
    parse(input: string): number;
    resolvedOptions(): ResolvedConverterOptions;
    getHint(): null;
    private _getResolvedAndNativeOptions;
}
