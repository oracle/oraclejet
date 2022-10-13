/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./UNSAFE_stringUtils.js');
var stringUtils = require('../stringUtils-b22cc214.js');

/**
 * Given a value that is of type Size, transform the value into
 * something that is usable in a css style property.
 * @param {string | 0 } v - a value to transform
 * @returns {string | 0}
 */
const sizeToCSS = (v) => {
    // We want '0%' and any non-string to return 0
    if (v === 0 || parseFloat(v) === 0 || !stringUtils.isString(v)) {
        return 0;
    }
    // from here down v is guaranteed to be a string
    let css;
    css = percentToCSS(v);
    if (css !== null) {
        return css;
    }
    css = doubleDashToCSS(v);
    if (css !== null) {
        return css;
    }
    css = xToCSS(v);
    if (css !== null) {
        return css;
    }
    // return 0 for any invalid v.
    return 0;
};
/**
 * This transforms a number + 'x' to a css calc.
 * E.g., if v is '1.2x' this method returns `calc(1.2 * var(--oj-c-PRIVATE-DO-NOT-USE-core-spacing-1x))`
 * @param {string } v - a value to transform
 * @returns {string | null}
 */
const xToCSS = (v) => {
    if (v.endsWith('x')) {
        // parse out the 'x'
        const nStr = v.slice(0, v.length - 1);
        // nStr should now only contain characters that could be part of a floating number.
        // I don't want a string with random characters in it to be ignored as it would with
        // parseFloat, so I'm using Number here. parseFloat('1.2p') -> 1.2. whereas
        // Number('1.2p') returns NaN.
        const num = Number(nStr);
        if (!isNaN(num)) {
            // Note: 1x is equal to about 4px
            return num === 1
                ? `var(--oj-c-PRIVATE-DO-NOT-USE-core-spacing-1x)`
                : `calc(${num} * var(--oj-c-PRIVATE-DO-NOT-USE-core-spacing-1x))`;
        }
    }
    return null;
};
/**
 * This transforms a string that starts with '--' to a css var.
 * E.g., if v is '--oj-input-text' this method returns `var(--oj-input-text)`
 * @param {string } v - a value to transform
 * @returns {string | null}
 */
const doubleDashToCSS = (v) => {
    if (v.startsWith('--')) {
        return `var(${v})`;
    }
    return null;
};
/**
 * This checks if the string v ends with '%' and if so passes it out unchanged.
 * @param {string } v - a value to transform, if needed
 * @returns {string | null}
 */
const percentToCSS = (v) => {
    if (v.endsWith('%')) {
        return v;
    }
    return null;
};

exports.sizeToCSS = sizeToCSS;
/*  */
//# sourceMappingURL=UNSAFE_size.js.map
