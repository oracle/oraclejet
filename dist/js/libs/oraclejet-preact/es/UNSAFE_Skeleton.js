/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Skeleton.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { borderInterpolations } from './utils/UNSAFE_interpolations/borders.js';
import { stringLiteralArray } from './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';

const dimensions = stringLiteralArray(['height', 'width']);
const border = stringLiteralArray(['borderRadius']); // Create an array [dimensionInterpolations['height'], dimensionInterpolations['width']]

const skeletonDimensionInterpolation = Array.from(dimensions, x => dimensionInterpolations[x]);
const borderRadiusInterpolation = Array.from(border, x => borderInterpolations[x]);
const interpolations = [...Object.values(borderRadiusInterpolation), ...Object.values(skeletonDimensionInterpolation)];
const SkeletonInterpolations = mergeInterpolations(interpolations);
/* Styling for skeleton main (loop) animation */

const animationSkeletonStyle = {
  base: "fu3s55"
};
/**
 * Skeleton component allows the appropriate skeleton to be rendered based on the
 * property values
 **/

function Skeleton(_a) {
  var props = __rest(_a, []);

  let skeletonDimensions = SkeletonInterpolations(Object.assign({
    width: '100%',
    borderRadius: 0
  }, props));
  const itemClasses = classNames([animationSkeletonStyle.base]);
  return jsx("div", {
    style: skeletonDimensions,
    class: itemClasses
  });
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Skeleton };
/*  */
//# sourceMappingURL=UNSAFE_Skeleton.js.map
