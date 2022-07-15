/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');
var utils_UNSAFE_interpolations_borders = require('./utils/UNSAFE_interpolations/borders.js');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
var utils_UNSAFE_interpolations_colors = require('./utils/UNSAFE_interpolations/colors.js');
var utils_UNSAFE_interpolations_padding = require('./utils/UNSAFE_interpolations/padding.js');
var utils_UNSAFE_interpolations_aria = require('./utils/UNSAFE_interpolations/aria.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
var utils_UNSAFE_arrayUtils = require('./utils/UNSAFE_arrayUtils.js');
var flexitem = require('./flexitem-5f5d588b.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-bca189f8.js');
require('./_curry1-33165c71.js');

require('./keys-4bd017bf.js');
require('./_has-2cbf94e8.js');
require('./utils/UNSAFE_classNames.js');
require('./classNames-69178ebf.js');
require('./_curry2-40682636.js');

const elementTypes = utils_UNSAFE_arrayUtils.stringLiteralArray(['div', 'main', 'article', 'section', 'aside']);
const interpolations = [
    ...Object.values(utils_UNSAFE_interpolations_borders.borderInterpolations),
    ...Object.values(utils_UNSAFE_interpolations_dimensions.dimensionInterpolations),
    ...Object.values(flexitem.flexitemInterpolations),
    ...Object.values(utils_UNSAFE_interpolations_colors.colorInterpolations),
    ...Object.values(utils_UNSAFE_interpolations_padding.paddingInterpolations),
    ...Object.values(utils_UNSAFE_interpolations_aria.ariaInterpolations)
];
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
const View = (_a) => {
    var { as, children } = _a, props = tslib_es6.__rest(_a, ["as", "children"]);
    const _b = styleInterpolations(props), { class: cls } = _b, styles = tslib_es6.__rest(_b, ["class"]);
    // we hardcode box-sizing: border-box on all of our Preact components.
    styles['boxSizing'] = 'border-box';
    const Component = as || 'div';
    return (jsxRuntime.jsx(Component, Object.assign({ class: cls, style: styles }, { children: children })));
};

exports.View = View;
exports.elementTypes = elementTypes;
/*  */
//# sourceMappingURL=UNSAFE_View.js.map
