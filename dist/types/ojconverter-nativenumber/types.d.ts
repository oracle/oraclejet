export declare type RoundingMode = 'HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'UP' | 'DOWN' | 'CEILING' | 'FLOOR';
export declare type BCP47Locale = string;
export declare type ISO4217CurrencyCode = string;
declare type Separators = Partial<{
    decimal: string;
    group: string;
}>;
declare type SharedConverterOptions = Partial<{
    minimumIntegerDigits: number;
    minimumFractionDigits: number;
    maximumFractionDigits: number;
    useGrouping: boolean;
    roundingMode: RoundingMode;
    roundDuringParse: boolean;
    separators: Separators;
    lenientParse: 'full' | 'none';
    locale: BCP47Locale;
}>;
declare type FormatOptions = 'standard' | 'short' | 'long';
declare type CurrencyFormatOptions = 'standard' | 'short';
export declare type DecimalOptions = SharedConverterOptions & {
    style?: 'decimal';
    decimalFormat?: FormatOptions;
};
export declare type CurrencyOptions = SharedConverterOptions & {
    style: 'currency';
    currency: ISO4217CurrencyCode;
    currencyDisplay?: 'code' | 'symbol' | 'name';
    currencyFormat?: CurrencyFormatOptions;
};
declare type PercentOptions = SharedConverterOptions & {
    style: 'percent';
};
declare type UnitOptions = SharedConverterOptions & {
    style: 'unit';
    unit: 'byte' | 'bit';
};
declare type ResolvedDecimalOptions = Omit<Required<DecimalOptions>, 'separators'> & {
    separators: Required<Separators>;
};
declare type ResolvedCurrencyOptions = Omit<Required<CurrencyOptions>, 'separators'> & {
    separators: Required<Separators>;
};
declare type ResolvedPercentOptions = Omit<Required<PercentOptions>, 'separators'> & {
    separators: Required<Separators>;
};
declare type ResolvedUnitOptions = Omit<Required<UnitOptions>, 'separators'> & {
    separators: Required<Separators>;
};
export declare type ConverterOptions = DecimalOptions | CurrencyOptions | PercentOptions | UnitOptions;
export declare type ResolvedConverterOptions = ResolvedDecimalOptions | ResolvedCurrencyOptions | ResolvedPercentOptions | ResolvedUnitOptions;
export {};
