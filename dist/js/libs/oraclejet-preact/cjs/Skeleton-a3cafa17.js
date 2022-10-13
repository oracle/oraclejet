/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');

require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
var utils_UNSAFE_interpolations_borders = require('./utils/UNSAFE_interpolations/borders.js');
var utils_UNSAFE_arrayUtils = require('./utils/UNSAFE_arrayUtils.js');
var classNames = require('./classNames-82bfab52.js');

const dimensions = utils_UNSAFE_arrayUtils.stringLiteralArray(['height', 'width']);
const border = utils_UNSAFE_arrayUtils.stringLiteralArray(['borderRadius']); // Create an array [dimensionInterpolations['height'], dimensionInterpolations['width']]

const skeletonDimensionInterpolation = Array.from(dimensions, x => utils_UNSAFE_interpolations_dimensions.dimensionInterpolations[x]);
const borderRadiusInterpolation = Array.from(border, x => utils_UNSAFE_interpolations_borders.borderInterpolations[x]);
const interpolations = [...Object.values(borderRadiusInterpolation), ...Object.values(skeletonDimensionInterpolation)];
const SkeletonInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
/* Styling for skeleton main (loop) animation */

const animationSkeletonStyle = {
  base: "fu3s55"
};
/**
 * Skeleton component allows the appropriate skeleton to be rendered based on the
 * property values
 **/

function Skeleton(_a) {
  var props = tslib_es6.__rest(_a, []);

  let skeletonDimensions = SkeletonInterpolations(Object.assign({
    width: '100%',
    borderRadius: 0
  }, props));
  const itemClasses = classNames.classNames([animationSkeletonStyle.base]);
  return jsxRuntime.jsx("div", {
    style: skeletonDimensions,
    class: itemClasses
  });
}

exports.Skeleton = Skeleton;
/*  */
//# sourceMappingURL=Skeleton-a3cafa17.js.map
