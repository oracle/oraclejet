import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import { IntlDateTimeConverter } from '../ojconverter-datetime';
import DateRestrictionValidator = require('../ojvalidator-daterestriction');
export interface DateRestrictionValidatorFactory {
    createValidator(options?: DateRestrictionValidator.ValidatorOptions): DateRestrictionValidator;
}
export interface DateTimeConverterFactory {
    createConverter(options?: IntlDateTimeConverter.ConverterOptions): IntlDateTimeConverter;
}
export interface DateTimeRangeValidatorFactory {
    createValidator(options?: DateTimeRangeValidator.ValidatorOptions): DateTimeRangeValidator;
}
