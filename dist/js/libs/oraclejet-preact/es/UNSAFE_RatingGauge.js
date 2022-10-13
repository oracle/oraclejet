/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx, jsxs } from 'preact/jsx-runtime';
import { Fragment } from 'preact';
import { useRef, useState, useEffect } from 'preact/hooks';
import './UNSAFE_RatingGauge.css';
import { useUser } from './hooks/UNSAFE_useUser.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import { useTooltipControlled } from './hooks/UNSAFE_useTooltip.js';
import { mergeProps } from './utils/UNSAFE_mergeProps.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './hooks/UNSAFE_useId.js';
import './UNSAFE_Floating.js';
import './index-46e68d3c.js';
import './hooks/UNSAFE_useOutsideClick.js';
import './utils/UNSAFE_arrayUtils.js';
import './hooks/UNSAFE_useHover.js';
import './hooks/UNSAFE_useToggle.js';
import './hooks/UNSAFE_useFocus.js';
import './hooks/UNSAFE_useTouch.js';

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
  return jsx("svg", Object.assign({
    viewBox: "0 0 36 36",
    height: "100%",
    width: "100%",
    class: ratingStarStyles.base
  }, {
    children: jsxs("g", {
      children: [jsx("path", {
        class: innerStyleClass,
        d: "m18 1 5.0061 11.9524 12.9939 1.0344-9.9 8.4215 3.0246 12.5917-11.1246-6.7476-11.12461 6.7476 3.02461-12.5917-9.9-8.4215 12.9939-1.0344z"
      }), jsx("path", {
        class: outerStyleClass,
        d: "m23.0061 12.9524-5.0061-11.9524-5.0061 11.9524-12.9939 1.0344 9.9 8.4215-3.02461 12.5917 11.12461-6.7476 11.1246 6.7476-3.0246-12.5917 9.9-8.4215zm10.5043 1.8394-8.5262 7.2528 2.6077 10.8562-9.5919-5.818-9.59192 5.818 2.60772-10.8562-8.52615-7.2528 11.19115-.891 4.3192-10.31227 4.3192 10.31227z"
      })]
    })
  }));
};

const ratingStarStyles = {
  base: "_k7180v",
  selectedColor: "_29ecq3",
  selectedBorderColor: "_2r2o6x",
  unselectedColor: "_qc4qse",
  unselectedBorderColor: "_o7hntv",
  selectedReadonlyColor: "_mgr4kj",
  selectedReadonlyBorderColor: "_53rojp",
  unselectedReadonlyColor: "goezwb",
  unselectedReadonlyBorderColor: "g13d7e",
  selectedDisabledColor: "_dbjry0",
  unselectedDisabledColor: "ks0ff2",
  selectedDisabledBorderColor: "jwlywu",
  unselectedDisabledBorderColor: "_5nh9vh"
};

const RatingGaugeItem = ({
  fillRatio,
  isDisabled,
  isReadonly
}) => {
  const {
    direction
  } = useUser();
  const isRtl = direction === 'rtl';

  if (fillRatio === 1 || fillRatio === 0) {
    return jsx(RatingStar, {
      isSelected: fillRatio === 1,
      isDisabled: isDisabled,
      isReadOnly: isReadonly
    });
  } // if fillRatio is not 1 or zero, absolutely position selected star above the
  // unselected star and clip both to form partially selected star.


  return jsxs(Fragment, {
    children: [jsx("div", Object.assign({
      class: fractionalStar.base,
      style: {
        clipPath: `inset(0% ${isRtl ? (1 - fillRatio) * 100 : 0}% 0% ${isRtl ? 0 : fillRatio * 100}%)`
      }
    }, {
      children: jsx(RatingStar, {
        isSelected: false,
        isDisabled: isDisabled,
        isReadOnly: isReadonly
      })
    })), jsx("div", Object.assign({
      class: fractionalStar.base,
      style: {
        clipPath: `inset(0% ${isRtl ? 0 : (1 - fillRatio) * 100}% 0% ${isRtl ? (1 - fillRatio) * 100 : 0}%)`
      }
    }, {
      children: jsx(RatingStar, {
        isSelected: true,
        isDisabled: isDisabled,
        isReadOnly: isReadonly
      })
    }))]
  });
};

const fractionalStar = {
  base: "rwtkdq"
};

function getValue(pageX, max, step, dimensionsRef, isRtl) {
    const dimensions = dimensionsRef.current;
    if (!dimensions || dimensions.width === 0) {
        return -1;
    }
    const width = pageX - dimensions.x;
    const val = (max * (isRtl ? dimensions.width - width : width)) / dimensions.width;
    const numSteps = val / step;
    return numSteps < 0.5 ? 0 : Math.ceil(numSteps) * step;
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
const useEvents = (max, step, value, rootRef, dimensionsRef, isInteractive, onCommit, onInput) => {
    const currentInput = useRef();
    const { direction } = useUser();
    if (!isInteractive) {
        return {};
    }
    const isRtl = direction === 'rtl';
    const handleInput = (inputValue) => {
        onInput === null || onInput === void 0 ? void 0 : onInput({ value: inputValue });
        currentInput.current = inputValue;
    };
    const cancelEvent = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };
    const pointerUpHandler = (event) => {
        const val = getValue(event.pageX, max, step, dimensionsRef, isRtl);
        if (val !== -1) {
            onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: val });
        }
    };
    // When the document or rating gauge parent scrolls, we need to update the dimensionRef.current.x.
    // Instead of updating it for every scroll event, recalculate the dims the first time mouse enters
    // so we get fresh dimension value.
    const pointerEnterHandler = () => {
        dimensionsRef.current = getDimensions(rootRef.current);
    };
    const hoverHandler = (event) => {
        const val = getValue(event.pageX, max, step, dimensionsRef, isRtl);
        if (val !== -1 && val != currentInput.current) {
            handleInput(val);
        }
    };
    const blurHandler = () => {
        onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: value });
    };
    const pointerLeaveHandler = () => {
        handleInput(undefined);
    };
    const keyDownHandler = (event) => {
        const key = event.key;
        switch (key) {
            case 'Tab':
                return;
            case 'ArrowDown':
                handleInput(Math.max(0, value - step));
                break;
            case 'ArrowUp':
                handleInput(Math.min(max, value + step));
                break;
            case 'ArrowLeft': {
                const inputValue = isRtl ? Math.min(max, value + step) : Math.max(0, value - step);
                handleInput(inputValue);
                break;
            }
            case 'ArrowRight': {
                const inputValue = isRtl ? Math.max(0, value - step) : Math.min(max, value + step);
                handleInput(inputValue);
                break;
            }
        }
        cancelEvent(event);
    };
    const keyUpHandler = (event) => {
        const key = event.key;
        switch (key) {
            case 'Enter':
                onCommit === null || onCommit === void 0 ? void 0 : onCommit({ value: value });
                break;
            case 'Tab':
                handleInput(value);
                break;
            case 'Home':
                handleInput(0);
                break;
            case 'End':
                handleInput(max);
                break;
        }
        cancelEvent(event);
    };
    return {
        onPointerUp: pointerUpHandler,
        onBlur: blurHandler,
        onPointerMove: hoverHandler,
        onKeyUp: keyUpHandler,
        onKeyDown: keyDownHandler,
        onPointerLeave: pointerLeaveHandler,
        onPointerEnter: pointerEnterHandler
    };
};

function useTooltipOrDatatip({ max, value, isReadonly, isDisabled, tooltip, datatip, ariaDescribedBy, width }) {
    const [isOpen, setIsOpen] = useState(false);
    const tooltipVariant = isReadonly && !isDisabled ? 'tooltip' : 'datatip';
    const datatipIndex = Math.max(1, Math.ceil(value));
    const offset = tooltipVariant === 'tooltip' ? 0 : ((datatipIndex - Math.ceil(max / 2)) * width) / max;
    const { tooltipContent, tooltipProps } = useTooltipControlled({
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
      props = __rest(_a, ["max", "value", "size", "step", "isReadonly", "isDisabled"]);

  const rootRef = useRef(null);
  const dimensionsRef = useRef(getDimensions(null));
  const isInteractive = !isReadonly && !isDisabled; // Since the dimension are compute lazily after render, store width and x in ref
  // This is used to identify hovered and clicked star.
  // width of the gauge depends on size and max so passing them as dependencies for useEffect

  useEffect(() => {
    dimensionsRef.current = getDimensions(rootRef.current);
  }, [size, max]);
  const eventProps = useEvents(max, step, value, rootRef, dimensionsRef, isInteractive, props.onCommit, props.onInput);
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
  const mergedEventProps = mergeProps(eventProps, tooltipProps);
  const ariaLabel = getAriaLabel({
    accessibleLabel: props.accessibleLabel,
    tooltip: props.tooltip,
    isReadonly,
    isDisabled
  });
  return jsxs(Fragment, {
    children: [jsx("div", Object.assign({
      ref: rootRef,
      class: classNames([ratingStyles.base, isInteractive ? ratingStyles.interactive : undefined]),
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
        return jsx("div", Object.assign({
          className: classNames([ratingStyles[size], ratingStyles.item])
        }, {
          children: jsx(RatingGaugeItem, {
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
  base: "jdcynz",
  interactive: "l6g07z",
  lg: "_yb85ls",
  md: "_3j3phs",
  sm: "_y7g8lb",
  item: "_wrhoe9"
};

export { RatingGauge };
/*  */
//# sourceMappingURL=UNSAFE_RatingGauge.js.map
