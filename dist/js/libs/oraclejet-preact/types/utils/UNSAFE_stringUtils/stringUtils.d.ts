/**
 * @license
 * Copyright (c) 2004 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Returns true if the value is null or if the trimmed value is of zero length.
 *
 * @param {Object|string|null} value
 * @returns true if the string or Object (e.g., Array) is of zero length.
 */
export declare function isEmpty(value: object | string | null): boolean;
/**
 * Returns true if the value is null, undefined or if the trimmed value is of zero length.
 *
 * @param {Object|string|null=} value
 * @returns true if the string or Object (e.g., Array) is of zero length.
 */
export declare function isEmptyOrUndefined(value?: object | string | null): boolean;
/**
 * Test if an object is a string (either a string constant or a string object)
 * @param {Object|string|null} obj object to test
 * @return true if a string constant or string object
 */
export declare function isString(obj: object | string | null): boolean;
/**
 * Remove leading and trailing whitespace
 * @param {Object|string|null} data to trim
 * @returns trimmed input
 */
export declare function trim(data: object | string | null): string | object | null;
/**
 * Port of the Java String.hashCode method.
 * http://erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
 *
 * @param {string} str
 * @returns The hashCode of the string
 */
export declare function hashCode(str: string): number;
