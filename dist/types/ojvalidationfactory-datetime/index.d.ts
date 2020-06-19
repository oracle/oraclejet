/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

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
