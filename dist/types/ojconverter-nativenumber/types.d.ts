export type RoundingMode = 'HALF_UP' | 'HALF_DOWN' | 'HALF_EVEN' | 'UP' | 'DOWN' | 'CEILING' | 'FLOOR';
export type BCP47Locale = string;
export type ISO4217CurrencyCode = string;
type Separators = Partial<{
    decimal: string;
    group: string;
}>;
type SharedConverterOptions = Partial<{
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
type FormatOptions = 'standard' | 'short' | 'long';
type CurrencyFormatOptions = 'standard' | 'short';
export type DecimalOptions = SharedConverterOptions & {
    style?: 'decimal';
    decimalFormat?: FormatOptions;
};
export type CurrencyOptions = SharedConverterOptions & {
    style: 'currency';
    currency: ISO4217CurrencyCode;
    currencyDisplay?: 'code' | 'symbol' | 'name';
    currencyFormat?: CurrencyFormatOptions;
};
type PercentOptions = SharedConverterOptions & {
    style: 'percent';
};
type UnitOptions = SharedConverterOptions & {
    style: 'unit';
    unit: 'byte' | 'bit';
};
type ResolvedDecimalOptions = Omit<Required<DecimalOptions>, 'separators'> & {
    separators: Required<Separators>;
};
type ResolvedCurrencyOptions = Omit<Required<CurrencyOptions>, 'separators'> & {
    separators: Required<Separators>;
};
type ResolvedPercentOptions = Omit<Required<PercentOptions>, 'separators'> & {
    separators: Required<Separators>;
};
type ResolvedUnitOptions = Omit<Required<UnitOptions>, 'separators'> & {
    separators: Required<Separators>;
};
export type ConverterOptions = DecimalOptions | CurrencyOptions | PercentOptions | UnitOptions;
export type ResolvedConverterOptions = ResolvedDecimalOptions | ResolvedCurrencyOptions | ResolvedPercentOptions | ResolvedUnitOptions;
export {};
