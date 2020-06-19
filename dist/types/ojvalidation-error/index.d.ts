/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

import Message = require('../ojmessaging');
export interface ConverterError {
    // constructor(summary: string, detail: string);
    getMessage(): Message;
}
export interface ValidatorError {
    // constructor(summary: string, detail: string);
    getMessage(): Message;
}
