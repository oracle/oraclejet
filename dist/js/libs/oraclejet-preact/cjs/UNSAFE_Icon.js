/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Icon = require('./Icon-b60b3f23.js');
var jsxRuntime = require('preact/jsx-runtime');
var hooks_UNSAFE_useUser = require('./hooks/UNSAFE_useUser.js');
var hooks_UNSAFE_useTheme = require('./hooks/UNSAFE_useTheme.js');
require('./tslib.es6-5c843188.js');
require('identity-obj-proxy');
require('./utils/UNSAFE_classNames.js');
require('./classNames-69178ebf.js');
require('preact/hooks');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');

// Returns a component that renders one of the given icon components based on reading direction
const withDirectionIcon = (LtrIcon, RtlIcon) => {
    const { direction } = hooks_UNSAFE_useUser.useUser();
    return (props) => {
        return direction === 'ltr' ? jsxRuntime.jsx(LtrIcon, Object.assign({}, props)) : jsxRuntime.jsx(RtlIcon, Object.assign({}, props));
    };
};

// Returns a component that renders one of the given icon components based on theme
const withThemeIcon = (themeIcons) => {
    const { name } = hooks_UNSAFE_useTheme.useTheme();
    return (props) => {
        const Component = themeIcons[name];
        return jsxRuntime.jsx(Component, Object.assign({}, props));
    };
};

exports.Icon = Icon.Icon;
exports.withDirectionIcon = withDirectionIcon;
exports.withThemeIcon = withThemeIcon;
/*  */
//# sourceMappingURL=UNSAFE_Icon.js.map
