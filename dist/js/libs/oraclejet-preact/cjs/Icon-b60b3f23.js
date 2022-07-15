/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');

require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-69178ebf.js');

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
  '1em': "_9nac0f",
  '1x': "_1jaiq1b",
  '2x': "_1puxizk",
  '3x': "_1c3qvh7",
  '4x': "_1ybw47b",
  '5x': "_ljayyj",
  '6x': "_1aydtil",
  '7x': "_1d899hp",
  '8x': "_1ok5en6",
  '9x': "_orim7s",
  '10x': "_vf34xt",
  '11x': "_sl4bfi",
  '12x': "_1xyz8wn"
};
const colorStyles = {
  primary: "pgrs8zp",
  secondary: "sxqh1wz",
  disabled: "d86rf1x",
  danger: "dqi69lw",
  warning: "w1w3h8bf",
  success: "sx3np7l",
  info: "ibec5dk",
  currentColor: "c186ccwk"
};

exports.Icon = Icon;
/*  */
//# sourceMappingURL=Icon-b60b3f23.js.map
