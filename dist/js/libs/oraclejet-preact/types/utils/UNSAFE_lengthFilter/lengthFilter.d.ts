/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export declare type CountUnit = 'codePoint' | 'codeUnit';
export declare function calcLength(text: string, countBy?: CountUnit): number;
/**
 * Filters the text based on the maximum length allowed.
 *
 * @param proposedText The proposed displayValue
 * @param max The max characters allowed
 * @param countBy The unit to be used for counting
 * @returns The filtered display value
 */
export declare function filter(proposedText: string, max?: number, countBy?: CountUnit): string;
