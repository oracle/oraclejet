/* @oracle/oraclejet-preact: 13.1.0 */
import { stringLiteralArray } from '../UNSAFE_arrayUtils.js';
import { sizeToCSS } from '../UNSAFE_size.js';
import { _ as _curry1_1 } from '../../_curry1-b6f34fc4.js';
import '../UNSAFE_stringUtils.js';

var _curry1 =

_curry1_1;
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

var isNil_1 = isNil;

/**
 * This file contains a style interpolation for dimension css properties.
 * It contains prop => style functions related to a UI elements
 * dimensions.
 * Style interpolations are functions that transform props to UI styling.
 * This technique is often used in Styled Components to provide consistent,
 * reusable styled props API.
 *
 * This file contains dimension properties like width, height,
 * maxHeight, etc. The intent of this dimension interpolation file
 * is that all component apis that need dimension properties
 * will use these dimensions interpolations so that the properties, in whatever component they are used,
 * will type the properties the same way and will also interpolate the
 * property values the same way. This gives us consistent apis and behavior.
 * I.e., The dimension properties are all typed with Size, and the user's values all run through the same sizeToCSS() function.
 */
// if we don't run this array through this stringLiteralArray function, then the type is string[].
// After running it through this stringLiteralArray function its type changes to be
// ("height" | "maxHeight" | "maxWidth" | "minHeight" | "minWidth" | "width")[].
// The typed dimensions array can be exported to show options in a test or storybook.
const dimensions = stringLiteralArray([
    'height',
    'maxHeight',
    'maxWidth',
    'minHeight',
    'minWidth',
    'width'
]);
// Pick<DimensionProps, Key> Constructs a type by picking the set of properties Keys (string literal or union
// of string literals ) from DimensionProps.
// This is the *dimension interpolation function*. All dimension properties run through this function;
// it runs the dimension's value through the sizeToCSS() function to return the css that can be used
// in the html style property.
// e.g., it maps 50x to calc(50 * var(--oj-core-spacing-1x)))
const propToSize = (key) => (props) => {
    // Storing a local copy of the prop for proper type guarding in the ternary (conditional) below.
    const val = props[key];
    // casting val as Size because we know it can't be undefined
    return isNil_1(props[key]) ? {} : { [key]: sizeToCSS(val) };
};
// A map of dimension style props to size style interpolation functions.
// Since TS infers the return type of `reduce` from the `initialValue`,
// we need to manually write the type so is isn't cast as `{}` which is effectively `any`.
// Our initial object {} is cast to Interpolations type.
// This will reduce the dimensions array to an Object that has the dimension keys, like
// width, height, etc., and an interpolation funcion.
// In component code that uses dimensionInterpolations, we run the dimension
// props through this interpolation function to get the value, a class, else a style
// (dimensions return styles, not style classes.). Other interpolations, like flexitem,
// may return classes for properties that have distinct prop values, like start, center, end
// or sm, md, lg.
// Search component .tsx files for a dimensionInterpolations usage example.
const dimensionInterpolations = dimensions.reduce((acc, key) => Object.assign(acc, { [key]: propToSize(key) }), {});

export { dimensionInterpolations, dimensions };
/*  */
//# sourceMappingURL=dimensions.js.map
