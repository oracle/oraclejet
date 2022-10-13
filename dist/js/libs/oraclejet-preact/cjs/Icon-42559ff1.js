/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');

require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-82bfab52.js');

const Icon = ({
  size = '1em',
  color = 'currentColor',
  accessibleLabel = '',
  viewBox = 'none',
  children
}) => jsxRuntime.jsx(Svg, Object.assign({
  height: "1em",
  width: "1em",
  viewBox: viewBox,
  accessibleLabel: accessibleLabel,
  class: classNames.classNames([colorStyles[color], sizeStyles[size]])
}, {
  children: children
}));

const Svg = _a => {
  var {
    accessibleLabel
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["accessibleLabel"]);

  return accessibleLabel !== '' ? jsxRuntime.jsx(SemanticSvg, Object.assign({
    accessibleLabel: accessibleLabel
  }, otherProps)) : jsxRuntime.jsx(DecorativeSvg, Object.assign({}, otherProps));
};

const DecorativeSvg = props => jsxRuntime.jsx("svg", Object.assign({}, props)); // TODO: When we're able to, implement Preact tooltips instead,
// remove the title element, and set an aria-label on the svg.
// See JET-50716


const SemanticSvg = _a => {
  var {
    accessibleLabel,
    children
  } = _a,
      props = tslib_es6.__rest(_a, ["accessibleLabel", "children"]);

  return jsxRuntime.jsxs("svg", Object.assign({
    role: "img"
  }, props, {
    children: [jsxRuntime.jsx("title", {
      children: accessibleLabel
    }), children]
  }));
}; // TODO: Remove this and refactor as necessary to uptake
// the dimensions type and values when they're available.
// See JET-50717


const sizeStyles = {
  '1em': "_c4fe53",
  '1x': "rrae9h",
  '2x': "_by48t9",
  '3x': "fdupy4",
  '4x': "osiq1l",
  '5x': "gvtc7g",
  '6x': "_41uyo8",
  '7x': "_ss8mw",
  '8x': "_hbuhmw",
  '9x': "_i1hrcm",
  '10x': "opk1y",
  '11x': "_0xd71v",
  '12x': "_ipt43g"
};
const colorStyles = {
  primary: "bd7zl7",
  secondary: "knq0dk",
  disabled: "_jz995w",
  danger: "_8dj6gg",
  warning: "yhzbxr",
  success: "_bxs21n",
  info: "_84wwqe",
  currentColor: "f2jaxp"
};

exports.Icon = Icon;
/*  */
//# sourceMappingURL=Icon-42559ff1.js.map
