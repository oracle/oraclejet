import { stringLiteralArray } from '@oracle/oraclejet-preact/utils/stringLiteralArray';
import { isNumber, px } from '@oracle/oraclejet-preact/utils/units';

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
const size = (n) => !isNumber(n) || n > 1 ? px(n) : n === 0 ? "0" : `${n * 100}%`;
//export default size;

function _isPlaceholder(a) {
  return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
}

/**
 * Optimized internal one-arity curry function.
 *
 * @private
 * @category Function
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */

function _curry1(fn) {
  return function f1(a) {
    if (arguments.length === 0 || _isPlaceholder(a)) {
      return f1;
    } else {
      return fn.apply(this, arguments);
    }
  };
}

/**
 * Checks if the input value is `null` or `undefined`.
 *
 * @func
 * @memberOf R
 * @since v0.9.0
 * @category Type
 * @sig * -> Boolean
 * @param {*} x The value to test.
 * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
 * @example
 *
 *      R.isNil(null); //=> true
 *      R.isNil(undefined); //=> true
 *      R.isNil(0); //=> false
 *      R.isNil([]); //=> false
 */

var isNil =
/*#__PURE__*/
_curry1(function isNil(x) {
  return x == null;
});

var isNil$1 = isNil;

// if we don't run this array through this stringLiteralArray function, then the type is string[].
// After running it through this stringLiteralArray function its type changes to be
// ("height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "width")[].
// The typed dimensions array can be exported to show options in a test or storybook.
const dimensions = stringLiteralArray([
    "height",
    "maxHeight",
    "maxWidth",
    "minHeight",
    "minWidth",
    "width",
]);
// Pick<DimensionProps, Key> Constructs a type by picking the set of properties Keys (string literal or union
// of string literals ) from DimensionProps.
// TODO: Question for Urban. 
// We changed this from Props to DimensionProps since it made the code clearer to us, but now
// we see that in index.ts we have export {Props as DimensionProps}. Why not just call it DimensionProps here?
// TODO: This <Key extends Dimension> doesn't seem correct. Key could have a Key that isn't in DimensionProps, then we can't pick from it.
// This is the dimension interpolation function. pass in a key and it passes back out
// an object with the key and it passes out a function that takes the props.
// then when this returned function is called with a prop, it will pass out
// an object with key/size(prop);
const propToSize = (key) => (props) => {
    // Storing a local copy of the prop for proper type guarding in the ternary (conditional) below.
    const val = props[key];
    // casting val as Size because we know it can't be undefined
    return isNil$1(props[key]) ? {} : { [key]: size(val) };
};
// A map of dimension style props to size style interpolation functions.
// Since TS infers the return type of `reduce` from the `initialValue`,
// we need to manually write the type so is isn't cast as `{}` which is effectively `any`.
const interpolations = dimensions.reduce((acc, key) => Object.assign(acc, { [key]: propToSize(key) }), 
// The return type will be an object with the keys of our dimensions and a corresponding function that requires
// an object with that same dimension key and will return an empty object or the non-null CSS property and value.
{});

export { interpolations as dimensionInterpolations, dimensions, size };
