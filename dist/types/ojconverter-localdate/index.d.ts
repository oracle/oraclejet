export class LocalDateConverter {
    constructor(options?: LocalDateConverter.ConverterOptions);
    format(value: LocalDateConverter.DateISOStr): string;
    parse(input: string): LocalDateConverter.DateISOStr;
    resolvedOptions(): LocalDateConverter.ConverterOptions;
}
export namespace LocalDateConverter {
    // tslint:disable-next-line interface-over-type-literal
    type BCP47Locale = string;
    // tslint:disable-next-line interface-over-type-literal
    type ConverterOptions = {
        dateStyle?: 'short' | 'medium' | 'long' | 'full';
        locale?: BCP47Locale;
    };
    // tslint:disable-next-line interface-over-type-literal
    type DateISOStr = string;
}
