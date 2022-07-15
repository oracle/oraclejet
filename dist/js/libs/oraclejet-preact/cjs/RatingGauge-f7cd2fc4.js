/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');
var hooks = require('preact/hooks');

var hooks_UNSAFE_useUser = require('./hooks/UNSAFE_useUser.js');
require('./utils/UNSAFE_classNames.js');
var hooks_UNSAFE_useTooltip = require('./hooks/UNSAFE_useTooltip.js');
var utils_UNSAFE_mergeProps = require('./utils/UNSAFE_mergeProps.js');
var classNames = require('./classNames-69178ebf.js');

const RatingStar = ({
  isSelected,
  isDisabled,
  isReadOnly
}) => {
  const selectionState = isSelected ? 'selected' : 'unselected';
  const disabledState = isDisabled && 'Disabled';
  const readonlyState = isReadOnly && 'Readonly';
  const styleStatePrefix = `${selectionState}${disabledState || readonlyState || ''}`;
  const innerStyleClass = ratingStarStyles[`${styleStatePrefix}Color`];
  const outerStyleClass = ratingStarStyles[`${styleStatePrefix}BorderColor`];
  return jsxRuntime.jsx("svg", Object.assign({
    viewBox: "0 0 36 36",
    height: "100%",
    width: "100%",
    class: ratingStarStyles.base
  }, {
    children: jsxRuntime.jsxs("g", {
      children: [jsxRuntime.jsx("path", {
        class: innerStyleClass,
        d: "m18 1 5.0061 11.9524 12.9939 1.0344-9.9 8.4215 3.0246 12.5917-11.1246-6.7476-11.12461 6.7476 3.02461-12.5917-9.9-8.4215 12.9939-1.0344z"
      }), jsxRuntime.jsx("path", {
        class: outerStyleClass,
        d: "m23.0061 12.9524-5.0061-11.9524-5.0061 11.9524-12.9939 1.0344 9.9 8.4215-3.02461 12.5917 11.12461-6.7476 11.1246 6.7476-3.0246-12.5917 9.9-8.4215zm10.5043 1.8394-8.5262 7.2528 2.6077 10.8562-9.5919-5.818-9.59192 5.818 2.60772-10.8562-8.52615-7.2528 11.19115-.891 4.3192-10.31227 4.3192 10.31227z"
      })]
    })
  }));
};

const ratingStarStyles = {
  base: "b1fpmsq7",
  selectedColor: "s1ub3kc",
  selectedBorderColor: "s11mpjof",
  unselectedColor: "uh6i9jh",
  unselectedBorderColor: "uwvnsek",
  selectedReadonlyColor: "s10t37jt",
  selectedReadonlyBorderColor: "s1onntbs",
  unselectedReadonlyColor: "u2vyvvv",
  unselectedReadonlyBorderColor: "u9973ms",
  selectedDisabledColor: "s1bebe5q",
  unselectedDisabledColor: "u1eb2oqr",
  selectedDisabledBorderColor: "s1euhvz3",
  unselectedDisabledBorderColor: "usuv7wt"
};

const RatingGaugeItem = ({
  fillRatio,
  isDisabled,
  isReadonly
}) => {
  const {
    direction
  } = hooks_UNSAFE_useUser.useUser();
  const isRtl = direction === 'rtl';

  if (fillRatio === 1 || fillRatio === 0) {
    return jsxRuntime.jsx(RatingStar, {
      isSelected: fillRatio === 1,
      isDisabled: isDisabled,
      isReadOnly: isReadonly
    });
  } // if fillRatio is not 1 or zero, absolutely position selected star above the
  // unselected star and clip both to form partially selected star.


  return jsxRuntime.jsxs(preact.Fragment, {
    children: [jsxRuntime.jsx("div", Object.assign({
      class: fractionalStar.base,
      style: {
        clipPath: `inset(0% ${isRtl ? (1 - fillRatio) * 100 : 0}% 0% ${isRtl ? 0 : fillRatio * 100}%)`
      }
    }, {
      children: jsxRuntime.jsx(RatingStar, {
        isSelected: false,
        isDisabled: isDisabled,
        isReadOnly: isReadonly
      })
    })), jsxRuntime.jsx("div", Object.assign({
      class: fractionalStar.base,
      style: {
        clipPath: `inset(0% ${isRtl ? 0 : (1 - fillRatio) * 100}% 0% ${isRtl ? (1 - fillRatio) * 100 : 0}%)`
      }
    }, {
      children: jsxRuntime.jsx(RatingStar, {
        isSelected: true,
        isDisabled: isDisabled,
        isReadOnly: isReadonly
      })
    }))]
  });
};

const fractionalStar = {
  base: "b1htd91l"
};

function getValue(pageX, max, step, dimensionsRef, isRtl) {
    const dimensions = dimensionsRef.current;
    if (!dimensions || dimensions.width === 0) {
        return -1;
    }
    let val = (max * (pageX - dimensions.x)) / dimensions.width;
    const stepNum = val / step;
    if (stepNum < 0.5) {
        val = 0;
    }
    else {
        val = Math.ceil(stepNum) * step;
    }
    return isRtl ? max - val : val;
}
function getDimensions(element) {
    if (!element) {
        return {
            width: 0,
            x: 0
        };
    }
    const rect = element.getBoundingClientRect();
    return {
        width: Math.round(rect.width),
        x: Math.round(rect.x + window.scrollX)
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
const useEvents = (max, step, value, dimensionsRef, isInteractive, onCommit, onInput) => {
    const currentInput = hooks.useRef();
    const { direction } = hooks_UNSAFE_useUser.useUser();
    if (!isInteractive) {
        return {};
    }
    const isRtl = direction === 'rtl';
    const pointerUpHandler = (event) => {
        const val = getValue(event.pageX, max, step, dimensionsRef, isRtl);
        if (val !== -1) {
            onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: val });
        }
    };
    const hoverHandler = (event) => {
        const val = getValue(event.pageX, max, step, dimensionsRef, isRtl);
        if (val !== -1 && val != currentInput.current) {
            onInput === null || onInput === void 0 ? void 0 : onInput({ value: val });
            currentInput.current = val;
        }
    };
    const blurHandler = () => {
        onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: value });
    };
    const pointerLeaveHandler = () => {
        onInput === null || onInput === void 0 ? void 0 : onInput({ value: undefined });
        currentInput.current = undefined;
    };
    const keyboardHandler = (event) => {
        const key = event.key;
        if (key === 'Tab') {
            return;
        }
        if (key === 'Enter') {
            onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: value });
            return;
        }
        let inputValue = undefined;
        switch (key) {
            case 'ArrowLeft': {
                inputValue = Math.max(0, value - step);
                break;
            }
            case 'ArrowRight': {
                inputValue = Math.min(max, value + step);
                break;
            }
            case 'Home': {
                inputValue = 0;
                break;
            }
            case 'End': {
                inputValue = max;
                break;
            }
        }
        if (inputValue !== undefined) {
            onInput === null || onInput === void 0 ? void 0 : onInput({ value: inputValue });
            currentInput.current = inputValue;
        }
        event.preventDefault();
        event.stopPropagation();
    };
    return {
        onPointerUp: pointerUpHandler,
        onBlur: blurHandler,
        onPointerMove: hoverHandler,
        onKeyUp: keyboardHandler,
        onPointerLeave: pointerLeaveHandler
    };
};

function useTooltipOrDatatip({ max, value, isReadonly, isDisabled, tooltip, datatip, ariaDescribedBy, width }) {
    const [isOpen, setIsOpen] = hooks.useState(false);
    const tooltipVariant = isReadonly && !isDisabled ? 'tooltip' : 'datatip';
    const datatipIndex = Math.max(1, Math.ceil(value));
    const offset = tooltipVariant === 'tooltip' ? 0 : ((datatipIndex - Math.ceil(max / 2)) * width) / max;
    const { tooltipContent, tooltipProps } = hooks_UNSAFE_useTooltip.useTooltipControlled({
        text: tooltipVariant === 'tooltip' ? tooltip : datatip,
        isOpen,
        anchor: {
            x: 'element',
            y: 'element'
        },
        position: 'bottom',
        offset: {
            mainAxis: 8,
            crossAxis: offset
        },
        isDisabled: isDisabled,
        onToggle: ({ value }) => setIsOpen(value),
        variant: tooltipVariant
    });
    if (ariaDescribedBy) {
        tooltipProps['aria-describedby'] = ariaDescribedBy;
    }
    return {
        tooltipContent,
        tooltipProps
    };
}

const getAriaLabel = props => {
  return props.accessibleLabel ? props.accessibleLabel : props.tooltip && props.isReadonly && !props.isDisabled ? props.tooltip : undefined;
};

function RatingGauge(_a) {
  var {
    max = 5,
    value = 0,
    size = 'md',
    step = 1,
    isReadonly,
    isDisabled
  } = _a,
      props = tslib_es6.__rest(_a, ["max", "value", "size", "step", "isReadonly", "isDisabled"]);

  const rootRef = hooks.useRef(null);
  const dimensionsRef = hooks.useRef(getDimensions(null));
  const isInteractive = !isReadonly && !isDisabled; // Since the dimension are compute lazily after render, store width and x in ref
  // This is used to identify hovered and clicked star.
  // width of the gauge depends on size and max so passing them as dependencies for useEffect

  hooks.useEffect(() => {
    dimensionsRef.current = getDimensions(rootRef.current);
  }, [size, max]);
  const eventProps = useEvents(max, step, value, dimensionsRef, isInteractive, props.onCommit, props.onInput);
  const {
    tooltipContent,
    tooltipProps
  } = useTooltipOrDatatip({
    max,
    value,
    isReadonly,
    isDisabled,
    tooltip: props.tooltip,
    datatip: props.datatip,
    width: dimensionsRef.current.width,
    ariaDescribedBy: props.ariaDescribedBy
  });
  const mergedEventProps = utils_UNSAFE_mergeProps.mergeProps(eventProps, tooltipProps);
  const ariaLabel = getAriaLabel({
    accessibleLabel: props.accessibleLabel,
    tooltip: props.tooltip,
    isReadonly,
    isDisabled
  });
  return jsxRuntime.jsxs(preact.Fragment, {
    children: [jsxRuntime.jsx("div", Object.assign({
      ref: rootRef,
      class: classNames.classNames([ratingStyles.base, isInteractive ? ratingStyles.interactive : undefined]),
      "aria-label": ariaLabel,
      role: "slider",
      "aria-valuemin": "0",
      "aria-valuenow": value,
      "aria-valuemax": max,
      "aria-valuetext": value,
      "aria-labelledby": props.ariaLabelledBy,
      tabIndex: isDisabled ? undefined : 0,
      "aria-disabled": isDisabled ? 'true' : undefined
    }, mergedEventProps, {
      children: [...Array(max)].map((_, index) => {
        const fillRatio = Math.min(Math.max(0, value - index), 1);
        return jsxRuntime.jsx("div", Object.assign({
          className: classNames.classNames([ratingStyles[size], ratingStyles.item])
        }, {
          children: jsxRuntime.jsx(RatingGaugeItem, {
            fillRatio: fillRatio,
            isDisabled: isDisabled,
            isReadonly: isReadonly
          })
        }));
      })
    })), tooltipContent]
  });
}
const ratingStyles = {
  base: "b97wbq7",
  interactive: "i1vpcap0",
  lg: "l152t3gc",
  md: "m19upflt",
  sm: "s33yyxs",
  item: "i16crsb0"
};

exports.RatingGauge = RatingGauge;
/*  */
//# sourceMappingURL=RatingGauge-f7cd2fc4.js.map
