/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var tslib_es6 = require('./tslib.es6-5c843188.js');

var hooks_UNSAFE_usePress = require('./hooks/UNSAFE_usePress.js');
var hooks_UNSAFE_useHover = require('./hooks/UNSAFE_useHover.js');
require('./utils/UNSAFE_classNames.js');
var compat = require('preact/compat');
var utils_UNSAFE_interpolations_dimensions = require('./utils/UNSAFE_interpolations/dimensions.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
require('./utils/PRIVATE_clientHints.js');
var clientHints$1 = require('./clientHints-90ca1b41.js');
var classNames = require('./classNames-69178ebf.js');

const NullFunction = () => null;

const compStyles$1 = {
  base: "b1m12t60",
  hover: "h1h5apjf",
  pseudohover: "p11lfugp",
  unstyled: "usfllum",
  min: "mabs2bd",
  disabled: "d1fq6ucp",
  bottom: "bpzvdp8"
};
const interpolations = [...Object.values(utils_UNSAFE_interpolations_dimensions.dimensionInterpolations)];
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
const clientHints = clientHints$1.getClientHints(); // :active only works on IOS devices if a touch handler exists

const iosProps = clientHints.platform === 'ios' ? {
  ontouchstart: function () {}
} : {};
const isHybrid = clientHints$1.getClientHints().isHybrid;
const BaseButton = compat.forwardRef((_a, ref) => {
  var {
    variant = 'outlined',
    isDisabled = false,
    size = 'md',
    elementDetails = {
      type: 'button'
    },
    styling = 'default',
    edge = 'none',
    accessibleLabel
  } = _a,
      props = tslib_es6.__rest(_a, ["variant", "isDisabled", "size", "elementDetails", "styling", "edge", "accessibleLabel"]);

  const {
    pressProps
  } = hooks_UNSAFE_usePress.usePress(props.onAction ? props.onAction : NullFunction, {
    isDisabled
  });
  const {
    hoverProps,
    isHover
  } = hooks_UNSAFE_useHover.useHover({
    isDisabled: isHybrid
  });

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = tslib_es6.__rest(_b, ["class"]);

  const rootStyles = classNames.classNames([styling === 'default' && compStyles$1.base, styling === 'unstyled' && compStyles$1.unstyled, styling === 'min' && compStyles$1.base || compStyles$1.min, `oj-c-button-${variant}`, `oj-c-button-${size}`, isDisabled && compStyles$1.disabled, edge === 'bottom' && compStyles$1.bottom, !isHybrid && compStyles$1.pseudohover, isHybrid && isHover && compStyles$1.hover]);

  const _c = Object.assign({}, elementDetails),
        {
    type: elementType = 'button'
  } = _c,
        elementProps = tslib_es6.__rest(_c, ["type"]);

  const role = elementType === 'button' ? {
    type: 'button'
  } : {
    role: 'link'
  };
  const tooltip = props.title || accessibleLabel;
  const ElementType = elementDetails.type;
  return jsxRuntime.jsx(ElementType, Object.assign({
    ref: ref,
    disabled: isDisabled,
    class: `${rootStyles} ${cls}`,
    style: styles,
    autofocus: props['autofocus'],
    title: tooltip,
    tabIndex: isDisabled ? -1 : 0,
    "aria-label": accessibleLabel
  }, elementProps, role, pressProps, iosProps, hoverProps, {
    children: props.children
  }));
});

const compStyles = {
  text: "tqmqswo",
  icon: "i1n928z1",
  startText: "s18f9tk6",
  endText: "e7wof2a",
  startIcon: "s1p2y79g",
  startIconOnly: "s1y1p2f8",
  endIcon: "e1rcbirt",
  label: "l1egk2oi"
};

const isNullOrUndefined = value => {
  return value === null || value === undefined;
};

function ButtonLayout(_a) {
  var {
    size = 'md',
    display = 'all'
  } = _a,
      props = tslib_es6.__rest(_a, ["size", "display"]);

  const showIcons = display == 'all' || display == 'icons';
  const showText = display == 'all' || display == 'label';
  const labelClass = compStyles.label;
  const isOnlyIcon = props.startIcon && (display === 'icons' || !props.children) && !props.endIcon;
  const textStartIcon = !isNullOrUndefined(props.startIcon) && display === 'all';
  const textEndIcon = !isNullOrUndefined(props.endIcon) && display === 'all';
  const isTwoIcons = props.startIcon && props.endIcon;
  const endIconClass = `${compStyles.icon} oj-c-button-layout-${size} ${compStyles.endIcon}`;
  const startIconStyles = classNames.classNames([compStyles.icon, `oj-c-button-layout-${size}`, isOnlyIcon ? compStyles.startIconOnly : compStyles.startIcon]);
  const textStyles = classNames.classNames([compStyles.text, textStartIcon && !isTwoIcons && compStyles.endText, textEndIcon && !isTwoIcons && compStyles.startText]);
  return jsxRuntime.jsxs("span", Object.assign({
    class: labelClass
  }, {
    children: [showIcons && props.startIcon && jsxRuntime.jsx("span", Object.assign({
      class: startIconStyles
    }, {
      children: props.startIcon
    })), showText && props.children && jsxRuntime.jsxs("span", Object.assign({
      class: textStyles
    }, {
      children: [" ", props.children, " "]
    })), showIcons && props.endIcon && jsxRuntime.jsx("span", Object.assign({
      class: endIconClass
    }, {
      children: props.endIcon
    }))]
  }));
}

const Button = compat.forwardRef(({ variant = 'outlined', isDisabled = false, size = 'md', display = 'all', endIcon, startIcon, autofocus, edge, onAction, label = '', accessibleLabel, title, width }, ref) => {
    const labelOnly = (!startIcon && !endIcon) || display === 'label';
    const content = labelOnly ? (label) : (jsxRuntime.jsx(ButtonLayout, Object.assign({ display: display, startIcon: startIcon, endIcon: endIcon, size: size }, { children: label })));
    return (jsxRuntime.jsx(BaseButton, Object.assign({ ref: ref, isDisabled: isDisabled, size: size, width: width, autofocus: autofocus, edge: edge, variant: variant, styling: labelOnly ? 'min' : 'default', onAction: onAction, accessibleLabel: accessibleLabel !== null && accessibleLabel !== void 0 ? accessibleLabel : (display === 'icons' ? label : undefined), title: title !== null && title !== void 0 ? title : (display === 'icons' ? accessibleLabel !== null && accessibleLabel !== void 0 ? accessibleLabel : label : undefined), "aria-label": display === 'icons' ? label : null }, { children: content })));
});

exports.Button = Button;
/*  */
//# sourceMappingURL=Button-bdcdb4e3.js.map
