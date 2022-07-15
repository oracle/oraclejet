/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');

var utils_UNSAFE_interpolations_boxalignment = require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
var flexbox = require('./flexbox-c4644897.js');
var flexitem = require('./flexitem-5f5d588b.js');

const baseStyles = "b12c3cqv";
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
//# sourceMappingURL=Flex-b2488744.js.map
