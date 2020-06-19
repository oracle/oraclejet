/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import DateTimeRangeValidator = require('../ojvalidator-datetimerange');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncDateTimeRangeValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: DateTimeRangeValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncDateTimeRangeValidator;
