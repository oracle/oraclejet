/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import { DateTimeConverter } from '../ojconverter-datetime';
import Validator = require('../ojvalidator');
declare class DateTimeRangeValidator implements Validator<string> {
    constructor(options?: DateTimeRangeValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string): void;
}
declare namespace DateTimeRangeValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        converter: DateTimeConverter;
        hint?: {
            inRange?: string;
            max?: string;
            min?: string;
        };
        max?: string;
        messageDetail?: {
            rangeOverflow?: string;
            rangeUnderflow?: string;
        };
        messageSummary?: {
            rangeOverflow?: string;
            rangeUnderflow?: string;
        };
        min?: string;
        translationKey?: string;
    };
}
export = DateTimeRangeValidator;
