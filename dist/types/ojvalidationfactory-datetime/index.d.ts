/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import { IntlDateTimeConverter } from '../ojconverter-datetime';
import DateRestrictionValidator = require('../ojvalidator-daterestriction');
/** @deprecated since 8.0.0 - Directly create new instances of {@link DateRestrictionValidator} instead. */
export interface DateRestrictionValidatorFactory {
    createValidator(options?: DateRestrictionValidator.ValidatorOptions): DateRestrictionValidator;
}
/** @deprecated since 8.0.0 - Directly create new instances of {@link IntlDateTimeConverter} instead. */
export interface DateTimeConverterFactory {
    createConverter(options?: IntlDateTimeConverter.ConverterOptions): IntlDateTimeConverter;
}
/** @deprecated since 8.0.0 - Directly create new instances of {@link DateTimeRangeValidator} instead. */
export interface DateTimeRangeValidatorFactory {
    createValidator(options?: DateTimeRangeValidator.ValidatorOptions): DateTimeRangeValidator;
}
