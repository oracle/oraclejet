import { Validation } from '../ojvalidationfactory-base';
import Converter = require('../ojconverter');
export namespace IntlConverterUtils {
    function dateToLocalIso(date: Date): string;
    function dateToLocalIsoDateString(date: Date): string;
    function getConverterInstance<T>(converterOption: string | Validation.RegisteredConverter | Converter<T>): Converter<T> | null;
    function getInitials(firstName?: string, lastName?: string): string | undefined;
    function getLocalTimeZoneOffset(date?: Date): string;
    function isoToDate(isoString: string): Date;
    function isoToLocalDate(isoString: string): Date;
}
