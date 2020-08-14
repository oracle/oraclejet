/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Validator = require('../ojvalidator');
declare class RequiredValidator implements Validator<object | string | number> {
    constructor(options?: RequiredValidator.ValidatorOptions);
    getHint(): string | null;
    validate(value: any): void;
}
declare namespace RequiredValidator {
    // tslint:disable-next-line interface-over-type-literal
    type ValidatorOptions = {
        hint?: string;
        label?: string;
        messageSummary?: string;
        messageDetail?: string;
    };
}
export = RequiredValidator;
