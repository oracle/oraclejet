/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Adapted from D3.js -- d3-scale-chromatic
 * Contains utility function to pick a certain color out of a color palette
 * @ojmodulecontainer ojpaletteutils
 * @ojtsmodule
 * @ojhidden
 * @since 11.0.0
 */
/**
 * Returns a color for the specified value from the array of provided colors.
 * This function will divide the range [0, 1] into equally-sized subranges based on the number of colors provided
 * and then return the color whose subrange contains the specified value.
 * @ojexports
 * @param {Array<string>} palette An array of provided colors that will be divided into equally sized subranges based on the number of colors provided.
 * @param {number} value The value for which a color should be returned.  Value will be constrained to 0, 1 if outside that range.
 * @return {string} The color whose subrange contains the specified value
 * @method
 * @memberof ojpaletteutils
 * @name getColorValue
 */

function getColorValue(palette, value) {
    const bin = value > 1 ? 1 : value < 0 ? 0 : value;
    const len = palette.length;
    return palette[Math.max(0, Math.min(len - 1, Math.floor(len * bin)))];
}

export { getColorValue };
