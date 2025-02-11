/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import NumberRangeValidator = require('../ojvalidator-numberrange');
import { IntlNumberConverter } from '../ojconverter-number';
/** @deprecated since 8.0.0 - Directly create new instances of {@link IntlNumberConverter} instead. */
export interface NumberConverterFactory {
    createConverter(options?: IntlNumberConverter.ConverterOptions): IntlNumberConverter;
}
/** @deprecated since 8.0.0 - Directly create new instances of {@link NumberRangeValidator} instead. */
export interface NumberRangeValidatorFactory {
    createValidator(options?: NumberRangeValidator.ValidatorOptions): NumberRangeValidator;
}
