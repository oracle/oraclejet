/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import DateRestrictionValidator = require('../ojvalidator-daterestriction');
import AsyncValidator = require('../ojvalidator-async');
declare class AsyncDateRestrictionValidator<V> implements AsyncValidator<V> {
    hint: Promise<(string | null)>;
    constructor(options?: DateRestrictionValidator.ValidatorOptions);
    validate(value: V): Promise<void>;
}
export = AsyncDateRestrictionValidator;
