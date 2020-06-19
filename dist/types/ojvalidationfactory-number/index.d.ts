/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import NumberRangeValidator = require('../ojvalidator-numberrange');
import { IntlNumberConverter } from '../ojconverter-number';
export interface NumberConverterFactory {
    createConverter(options?: IntlNumberConverter.ConverterOptions): IntlNumberConverter;
}
export interface NumberRangeValidatorFactory {
    createValidator(options?: NumberRangeValidator.ValidatorOptions): NumberRangeValidator;
}
