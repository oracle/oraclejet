export function formatWithYearFormat(formatInstance: Intl.DateTimeFormat, yearInstance: Intl.DateTimeFormat, value: Date): string;
export function getDateTimePreferences(): Readonly<DateTimePreferences>;
export function getNumberPreferences(): Readonly<NumberPreferences>;
export function setDateTimePreferences(options: DateTimePreferences): void;
export function setNumberPreferences(options: NumberPreferences): void;
// tslint:disable-next-line interface-over-type-literal
export type CurrencyStylePreferences = {
    currency: NumberPreferencesSeparators;
};
// tslint:disable-next-line interface-over-type-literal
export type DateStylePreferencesPattern = {
    short: {
        pattern: string;
        year?: never;
    };
};
// tslint:disable-next-line interface-over-type-literal
export type DateStylePreferencesYear = {
    short: {
        year: 'numeric' | '2-digit';
        pattern?: never;
    };
};
// tslint:disable-next-line interface-over-type-literal
export type DateTimePreferences = (DateTimePreferencesYear | DateTimePreferencesPattern) & {
    timeZone?: string;
};
// tslint:disable-next-line interface-over-type-literal
export type DateTimePreferencesPattern = {
    dateStyle: DateStylePreferencesPattern;
    timeStyle: TimeStylePreferencesPattern;
};
// tslint:disable-next-line interface-over-type-literal
export type DateTimePreferencesYear = {
    dateStyle?: Partial<DateStylePreferencesYear>;
    timeStyle?: {
        short?: {
            pattern: never;
        };
    };
};
// tslint:disable-next-line interface-over-type-literal
export type DecimalSeparators = '.' | ',';
// tslint:disable-next-line interface-over-type-literal
export type DecimalStylePreferences = {
    decimal: NumberPreferencesSeparators;
};
// tslint:disable-next-line interface-over-type-literal
export type GroupSeparators = " " | "." | "," | "'";
// tslint:disable-next-line interface-over-type-literal
export type NumberPreferences = {
    style?: Partial<DecimalStylePreferences> & Partial<CurrencyStylePreferences>;
};
// tslint:disable-next-line interface-over-type-literal
export type NumberPreferencesSeparators = {
    separators: NumberPreferencesSeparatorsContent;
};
// tslint:disable-next-line interface-over-type-literal
export type NumberPreferencesSeparatorsContent = {
    group: GroupSeparators;
    decimal: DecimalSeparators;
};
// tslint:disable-next-line interface-over-type-literal
export type TimeStylePreferencesPattern = {
    short?: {
        pattern: string;
    };
};
