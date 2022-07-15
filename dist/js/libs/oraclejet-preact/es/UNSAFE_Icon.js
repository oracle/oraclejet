/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx, jsxs } from 'preact/jsx-runtime';
import './UNSAFE_Icon.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { useUser } from './hooks/UNSAFE_useUser.js';
import { useTheme } from './hooks/UNSAFE_useTheme.js';
import 'preact/hooks';
import './UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_Layer.js';
import 'preact/compat';

const Icon = ({
  size = '1em',
  color = 'currentColor',
  accessibleLabel = '',
  viewBox = 'none',
  children
}) => jsx(Svg, Object.assign({
  height: "1em",
  width: "1em",
  viewBox: viewBox,
  accessibleLabel: accessibleLabel,
  class: classNames([colorStyles[color], sizeStyles[size]])
}, {
  children: children
}));

const Svg = _a => {
  var {
    accessibleLabel
  } = _a,
      otherProps = __rest(_a, ["accessibleLabel"]);

  return accessibleLabel !== '' ? jsx(SemanticSvg, Object.assign({
    accessibleLabel: accessibleLabel
  }, otherProps)) : jsx(DecorativeSvg, Object.assign({}, otherProps));
};

const DecorativeSvg = props => jsx("svg", Object.assign({}, props)); // TODO: When we're able to, implement Preact tooltips instead,
// remove the title element, and set an aria-label on the svg.
// See JET-50716


const SemanticSvg = _a => {
  var {
    accessibleLabel,
    children
  } = _a,
      props = __rest(_a, ["accessibleLabel", "children"]);

  return jsxs("svg", Object.assign({
    role: "img"
  }, props, {
    children: [jsx("title", {
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

// Returns a component that renders one of the given icon components based on reading direction
const withDirectionIcon = (LtrIcon, RtlIcon) => {
    const { direction } = useUser();
    return (props) => {
        return direction === 'ltr' ? jsx(LtrIcon, Object.assign({}, props)) : jsx(RtlIcon, Object.assign({}, props));
    };
};

// Returns a component that renders one of the given icon components based on theme
const withThemeIcon = (themeIcons) => {
    const { name } = useTheme();
    return (props) => {
        const Component = themeIcons[name];
        return jsx(Component, Object.assign({}, props));
    };
};

export { Icon, withDirectionIcon, withThemeIcon };
/*  */
//# sourceMappingURL=UNSAFE_Icon.js.map
