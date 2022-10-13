/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
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
