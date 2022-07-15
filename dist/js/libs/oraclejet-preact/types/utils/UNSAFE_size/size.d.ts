export declare type Size = 0 | `--${string}` | `${number}%` | `${number}x`;
/**
 * Given a value that is of type Size, transform the value into
 * something that is usable in a css style property.
 * @param {string | 0 } v - a value to transform
 * @returns {string | 0}
 */
export declare const sizeToCSS: (v: Size) => string | 0;
