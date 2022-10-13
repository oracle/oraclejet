/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
var flexitem = require('./flexitem-91650faf.js');

const interpolations = [...Object.values(utils_UNSAFE_interpolations_dimensions.dimensionInterpolations), flexitem.flexitemInterpolations.flex];
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
const Spacer = (_a) => {
    var props = tslib_es6.__rest(_a, []);
    const _b = styleInterpolations(props), { class: cls } = _b, styles = tslib_es6.__rest(_b, ["class"]);
    return jsxRuntime.jsx("div", { class: `${cls}`, style: styles });
};

exports.Spacer = Spacer;
/*  */
//# sourceMappingURL=Spacer-d11810a2.js.map
