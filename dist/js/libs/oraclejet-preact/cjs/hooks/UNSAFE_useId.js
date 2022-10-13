/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

/**
 * Generates random string that can be used as ID. Serves as replacement for
 * getUniqueId() function from "ojs/ojvcomponent-preact", until React 18 is
 * released with useId hook (https://github.com/preactjs/preact/issues/3373).
 * 1. Pick a random number in the range between 0 (inclusive) and 1 (exclusive)
 * 2. Convert the number to a base-36 string (using characters 0-9 and a-z)
 * 3. Slice off the leading '0.' prefix
 * 4. ids should always start with a letter, so prefix it with 'id'
 */
const useId = () => {
    const [id] = hooks.useState(() => `_${Math.random().toString(36).slice(2)}`); //@RandomNumberOK
    return id;
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useId = useId;
/*  */
//# sourceMappingURL=UNSAFE_useId.js.map
