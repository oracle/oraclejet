export declare type Size = string | number;
/**
 * A function for coercing number or string input into a CSS dimension value where:
 *
 * - `0` is treated as a unitless value
 * - Numbers greater than `0` and less than or equal to `1` are converted to a percentage (e.g. `1/2` becomes "50%")
 * - Numbers greater than `1` are converted to pixels
 * - Strings can be used for other CSS values (e.g. `"50vw"` or `"1rem"`)
 *
 * @param {string | number } n - a value to coerce
 * @returns {string | number}
 */
export declare const size: (n: Size) => string | number;
