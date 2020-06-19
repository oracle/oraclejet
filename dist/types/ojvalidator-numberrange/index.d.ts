/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { NumberConverter } from '../ojconverter-number';
import Validator = require('../ojvalidator');
declare class NumberRangeValidator implements Validator<string | number> {
    constructor(options?: NumberRangeValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string | number): void;
}
declare namespace NumberRangeValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        converter?: NumberConverter;
        min?: number;
        max?: number;
        hint?: {
            max?: string;
            min?: string;
            inRange?: string;
            exact?: string;
        };
        messageDetail?: {
            rangeUnderflow?: string;
            rangeOverflow?: string;
            exact?: string;
        };
        messageSummary?: {
            rangeUnderflow?: string;
            rangeOverflow?: string;
        };
    };
}
export = NumberRangeValidator;
