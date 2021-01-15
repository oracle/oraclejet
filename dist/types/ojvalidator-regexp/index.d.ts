/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Validator = require('../ojvalidator');
declare class RegExpValidator implements Validator<string | number> {
    constructor(options?: RegExpValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: string | number): void;
}
declare namespace RegExpValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        hint?: string;
        label?: string;
        messageDetail?: string;
        messageSummary?: string;
        pattern?: string;
    };
}
export = RegExpValidator;
