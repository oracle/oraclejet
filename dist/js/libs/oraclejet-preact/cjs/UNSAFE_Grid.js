/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var utils_UNSAFE_interpolations_grid = require('./utils/UNSAFE_interpolations/grid.js');
var utils_UNSAFE_interpolations_boxalignment = require('./utils/UNSAFE_interpolations/boxalignment.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
require('./keys-0a611b24.js');
require('./_curry1-94f22a19.js');
require('./_has-556488e4.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_classNames.js');
require('./classNames-82bfab52.js');
require('./_curry2-e6dc9cf1.js');

const baseStyles = "_5kzhi2";
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
