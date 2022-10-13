/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
function calcLength(text, countBy = 'codeUnit') {
    if (!text) {
        return 0;
    }
    const codeUnitLength = text.length;
    let length;
    let surrogateLength = 0;
    switch (countBy) {
        case 'codePoint':
            // if countBy is "codePoint", then count supplementary characters as length of one
            // For UTF-16, a "Unicode  surrogate pair" represents a single supplementary character.
            // The first (high) surrogate is a 16-bit code value in the range U+D800 to U+DBFF.
            // The second (low) surrogate is a 16-bit code value in the range U+DC00 to U+DFFF.
            // This code figures out if a charCode is a high or low surrogate and if so,
            // increments surrogateLength
            for (let i = 0; i < codeUnitLength; i++) {
                // eslint-disable-next-line no-bitwise
                if ((text.charCodeAt(i) & 0xf800) === 0xd800) {
                    surrogateLength += 1;
                }
            }
            // e.g., if the string is two supplementary characters, codeUnitLength is 4, and the
            // surrogateLength is 4, so we will return two.
            // oj.Assert.assert(surrogateLength % 2 === 0,
            // 'the number of surrogate chars must be an even number.');
            length = codeUnitLength - surrogateLength / 2;
            break;
        case 'codeUnit':
        default:
            // Javascript's length function counts # of code units.
            // A supplementary character has a length of 2 code units.
            length = codeUnitLength;
    }
    return length;
}
/**
 * Filters the text based on the maximum length allowed.
 *
 * @param proposedText The proposed displayValue
 * @param max The max characters allowed
 * @param countBy The unit to be used for counting
 * @returns The filtered display value
 */
function filter(proposedText, max, countBy) {
    if (max == null) {
        // No length filter
        return proposedText;
    }
    if (max < 1) {
        throw new Error(`length filter's max option cannot be less than 1. max option is ${max}`);
    }
    return calcLength(proposedText, countBy) <= max ? proposedText : proposedText.slice(0, max);
}

exports.calcLength = calcLength;
exports.filter = filter;
/*  */
//# sourceMappingURL=UNSAFE_lengthFilter.js.map
