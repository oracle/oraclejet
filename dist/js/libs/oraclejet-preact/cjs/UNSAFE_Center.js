/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
require('./UNSAFE_Flex.js');
var Flex = require('./Flex-327ae051.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./_curry1-94f22a19.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./utils/UNSAFE_classNames.js');
require('./classNames-82bfab52.js');
require('./_curry2-e6dc9cf1.js');
require('./_has-556488e4.js');

require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-0a611b24.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');

/**
 * Center is a convenience component that creates a flexbox
 * with justifyContent: center and alignItems: center.
 * TODO: How do I add background-color, border, etc?
 *
 */
function Center(_a) {
    var { children, width = '100%', height = '100%' } = _a, props = tslib_es6.__rest(_a, ["children", "width", "height"]);
    return (jsxRuntime.jsx(Flex.Flex, Object.assign({}, props, { justify: "center", align: "center", width: width, height: height }, { children: children })));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.Center = Center;
/*  */
//# sourceMappingURL=UNSAFE_Center.js.map
