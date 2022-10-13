/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_arrayUtils = require('./utils/UNSAFE_arrayUtils.js');
var classNames = require('./classNames-82bfab52.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./_curry1-94f22a19.js');
require('./_curry2-e6dc9cf1.js');
require('./_has-556488e4.js');

// hack to get aspect-ratio to work.
// CSS now has an aspect-ratio attribute that makes this super easy.
// aspect-ratio is supported in all major browsers, most recently in Safari 15.
// https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio
// However, it isn't until jet 14 that we drop support for Safari 14.
// When jet 14 comes out we can replace the padding-bottom hack with aspect-ratio css property.
// Also a user could just put aspect-ratio directly on their dom, instead of wrapping
// it inside this AspectRatio component.
// NOTE: padding-bottom has to be on a dom node that is the child of a dom node that has
// width, not the same dom node. From css doc:
// The size of the padding as a percentage, relative to the width of the containing block.
// So the root dom node has the dimensions styling and the '::before' dom node
// has the padding information.
// 100%/ratio. 100/(4/3) = 75%
// e.g., 16/9 = 56.25%, 4/3 = 75%, 1/1=100%, 2/1=50%

const baseDivStyles = "_atcn2l"; // common aspect ratios
// The box’s preferred aspect ratio is the specified ratio of width / height.
// The ratio has a '/' as a separator and not a ':' because the '/' is what
// the CSS aspect-ratio uses.
// TODO: Don't use fixed ratios. Let them specify any number

const ratios = utils_UNSAFE_arrayUtils.stringLiteralArray(['9/16', '1/1', '6/5', '5/4', '4/3', '11/8', '1.43/1', '3/2', '14/9', '16/10', '1.6180/1', '5/3', '16/9', '1.85/1', '1.9/1', '2/1', '2.2/1', '64/21', '2.4/1', '2.414/1', '2.76/1', '32/9', '18/5', '4/1']);
const dimensions = utils_UNSAFE_arrayUtils.stringLiteralArray(['maxWidth', 'minWidth', 'width']); // Create an array [dimensionInterpolations['maxWidth'], dimensionInterpolations['width'], dimensionInterpolations['minWidth']]

const widthDimensionInterpolation = Array.from(dimensions, x => utils_UNSAFE_interpolations_dimensions.dimensionInterpolations[x]);
const interpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(widthDimensionInterpolation);
/**
 * The AspectRatio component displays its content with a certain ratio based on the dimension
 * properties. Overflow content is hidden.
 *
 * It uses a common padding-bottom hack to do this. In future versions it will
 * be implemented using the CSS's aspect-ratio property when the browsers we need to support
 * all have it. For example, Safari 15 has it, but we won't drop Safari 14 until jet 14.
 *
 */

function AspectRatio(_a) {
  var {
    children,
    ratio = '1/1'
  } = _a,
      props = tslib_es6.__rest(_a, ["children", "ratio"]);

  const _b = interpolations(props),
        {
    class: cls
  } = _b,
        styles = tslib_es6.__rest(_b, ["class"]);

  const stylesWithAspectRatioVar = Object.assign(Object.assign({}, styles), {
    '--oj-c-PRIVATE-DO-NOT-USE-aspect-ratio': ratio
  });
  return jsxRuntime.jsx("div", Object.assign({
    class: classNames.classNames([baseDivStyles, cls]),
    style: stylesWithAspectRatioVar
  }, {
    children: children
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.AspectRatio = AspectRatio;
exports.ratios = ratios;
/*  */
//# sourceMappingURL=UNSAFE_AspectRatio.js.map
