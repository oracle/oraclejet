/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// If the value is an array, just return it, otherwise make a single entry array out of it and return it.
const coerceArray = (value) => (Array.isArray(value) ? value : [value]);
// By default TS will infer `string[]` for an array so use this function to
// extract string literal unions. This will automatically type your array.
// Example:
// const dimensions1 = ["height", "width"]; // dimensions1 type is string[].
// const dimensions = stringLiteralArray(["height", "width"]);
// dimensions type is ("height"|"width")[] (an array that can only have "height" and "width" in it)
const stringLiteralArray = (xs) => xs;

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.coerceArray = coerceArray;
exports.stringLiteralArray = stringLiteralArray;
/*  */
//# sourceMappingURL=UNSAFE_arrayUtils.js.map
