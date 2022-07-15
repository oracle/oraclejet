/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var utils_UNSAFE_interpolations_grid = require('./utils/UNSAFE_interpolations/grid.js');
var utils_UNSAFE_interpolations_boxalignment = require('./utils/UNSAFE_interpolations/boxalignment.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
require('./keys-4bd017bf.js');
require('./_curry1-33165c71.js');
require('./_has-2cbf94e8.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-bca189f8.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_classNames.js');
require('./classNames-69178ebf.js');
require('./_curry2-40682636.js');

const baseStyles = "b5ak6kf";
const interpolations = [...Object.values(utils_UNSAFE_interpolations_grid.gridInterpolations), ...Object.values(utils_UNSAFE_interpolations_boxalignment.boxAlignmentInterpolations)];
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
/**
 * An implicit grid. Resize your browser to see how items reflow.
 */

const Grid = _a => {
  var {
    children
  } = _a,
      props = tslib_es6.__rest(_a, ["children"]);

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = tslib_es6.__rest(_b, ["class"]);

  const allStyles = Object.assign({}, styles);
  return jsxRuntime.jsx("div", Object.assign({
    class: `${baseStyles} ${cls}`,
    style: allStyles
  }, {
    children: children
  }));
};

exports.Grid = Grid;
/*  */
//# sourceMappingURL=UNSAFE_Grid.js.map
