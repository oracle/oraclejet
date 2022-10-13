/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');

var utils_UNSAFE_interpolations_boxalignment = require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
var flexbox = require('./flexbox-3d991801.js');
var flexitem = require('./flexitem-91650faf.js');

const baseStyles = "_hpdtdu";
const interpolations = [...Object.values(utils_UNSAFE_interpolations_dimensions.dimensionInterpolations), ...Object.values(flexbox.flexboxInterpolations), ...Object.values(flexitem.flexitemInterpolations), ...Object.values(utils_UNSAFE_interpolations_boxalignment.boxAlignmentInterpolations)];
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
const Flex = _a => {
  var {
    children
  } = _a,
      props = tslib_es6.__rest(_a, ["children"]);

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = tslib_es6.__rest(_b, ["class"]);

  return jsxRuntime.jsx("div", Object.assign({
    class: `${baseStyles} ${cls}`,
    style: styles
  }, {
    children: children
  }));
};

exports.Flex = Flex;
/*  */
//# sourceMappingURL=Flex-327ae051.js.map
