/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { _ as __rest } from './tslib.es6-fc945e53.js';
import './UNSAFE_Button.css';
import { usePress } from './hooks/UNSAFE_usePress.js';
import { useHover } from './hooks/UNSAFE_useHover.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import { forwardRef } from 'preact/compat';
import { dimensionInterpolations } from './utils/UNSAFE_interpolations/dimensions.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { getClientHints } from './utils/PRIVATE_clientHints.js';
import 'preact/hooks';
import './hooks/UNSAFE_useToggle.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-8b0d63fc.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';

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
const interpolations = [...Object.values(dimensionInterpolations)];
const styleInterpolations = mergeInterpolations(interpolations);
const clientHints = getClientHints(); // :active only works on IOS devices if a touch handler exists

const iosProps = clientHints.platform === 'ios' ? {
  ontouchstart: function () {}
} : {};
const isHybrid = getClientHints().isHybrid;
const BaseButton = forwardRef((_a, ref) => {
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
      props = __rest(_a, ["variant", "isDisabled", "size", "elementDetails", "styling", "edge", "accessibleLabel"]);

  const {
    pressProps
  } = usePress(props.onAction ? props.onAction : NullFunction, {
    isDisabled
  });
  const {
    hoverProps,
    isHover
  } = useHover({
    isDisabled: isHybrid
  });

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = __rest(_b, ["class"]);

  const rootStyles = classNames([styling === 'default' && compStyles$1.base, styling === 'unstyled' && compStyles$1.unstyled, styling === 'min' && compStyles$1.base || compStyles$1.min, `oj-c-button-${variant}`, `oj-c-button-${size}`, isDisabled && compStyles$1.disabled, edge === 'bottom' && compStyles$1.bottom, !isHybrid && compStyles$1.pseudohover, isHybrid && isHover && compStyles$1.hover]);

  const _c = Object.assign({}, elementDetails),
        {
    type: elementType = 'button'
  } = _c,
        elementProps = __rest(_c, ["type"]);

  const role = elementType === 'button' ? {
    type: 'button'
  } : {
    role: 'link'
  };
  const tooltip = props.title || accessibleLabel;
  const ElementType = elementDetails.type;
  return jsx(ElementType, Object.assign({
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
      props = __rest(_a, ["size", "display"]);

  const showIcons = display == 'all' || display == 'icons';
  const showText = display == 'all' || display == 'label';
  const labelClass = compStyles.label;
  const isOnlyIcon = props.startIcon && (display === 'icons' || !props.children) && !props.endIcon;
  const textStartIcon = !isNullOrUndefined(props.startIcon) && display === 'all';
  const textEndIcon = !isNullOrUndefined(props.endIcon) && display === 'all';
  const isTwoIcons = props.startIcon && props.endIcon;
  const endIconClass = `${compStyles.icon} oj-c-button-layout-${size} ${compStyles.endIcon}`;
  const startIconStyles = classNames([compStyles.icon, `oj-c-button-layout-${size}`, isOnlyIcon ? compStyles.startIconOnly : compStyles.startIcon]);
  const textStyles = classNames([compStyles.text, textStartIcon && !isTwoIcons && compStyles.endText, textEndIcon && !isTwoIcons && compStyles.startText]);
  return jsxs("span", Object.assign({
    class: labelClass
  }, {
    children: [showIcons && props.startIcon && jsx("span", Object.assign({
      class: startIconStyles
    }, {
      children: props.startIcon
    })), showText && props.children && jsxs("span", Object.assign({
      class: textStyles
    }, {
      children: [" ", props.children, " "]
    })), showIcons && props.endIcon && jsx("span", Object.assign({
      class: endIconClass
    }, {
      children: props.endIcon
    }))]
  }));
}

const Button = forwardRef(({ variant = 'outlined', isDisabled = false, size = 'md', display = 'all', endIcon, startIcon, autofocus, edge, onAction, label = '', accessibleLabel, title, width }, ref) => {
    const labelOnly = (!startIcon && !endIcon) || display === 'label';
    const content = labelOnly ? (label) : (jsx(ButtonLayout, Object.assign({ display: display, startIcon: startIcon, endIcon: endIcon, size: size }, { children: label })));
    return (jsx(BaseButton, Object.assign({ ref: ref, isDisabled: isDisabled, size: size, width: width, autofocus: autofocus, edge: edge, variant: variant, styling: labelOnly ? 'min' : 'default', onAction: onAction, accessibleLabel: accessibleLabel !== null && accessibleLabel !== void 0 ? accessibleLabel : (display === 'icons' ? label : undefined), title: title !== null && title !== void 0 ? title : (display === 'icons' ? accessibleLabel !== null && accessibleLabel !== void 0 ? accessibleLabel : label : undefined), "aria-label": display === 'icons' ? label : null }, { children: content })));
});

export { Button };
/*  */
//# sourceMappingURL=UNSAFE_Button.js.map
