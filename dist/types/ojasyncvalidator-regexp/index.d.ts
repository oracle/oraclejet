/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import RegExpValidator = require('../ojvalidator-regexp');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncRegExpValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: RegExpValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncRegExpValidator;
