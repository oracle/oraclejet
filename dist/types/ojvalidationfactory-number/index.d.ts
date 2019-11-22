import NumberRangeValidator = require('../ojvalidator-numberrange');
import { IntlNumberConverter } from '../ojconverter-number';
export interface NumberConverterFactory {
    createConverter(options?: IntlNumberConverter.ConverterOptions): IntlNumberConverter;
}
export interface NumberRangeValidatorFactory {
    createValidator(options?: NumberRangeValidator.ValidatorOptions): NumberRangeValidator;
}
