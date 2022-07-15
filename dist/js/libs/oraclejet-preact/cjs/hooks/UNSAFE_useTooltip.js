/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
var hooks_UNSAFE_useId = require('./UNSAFE_useId.js');
var UNSAFE_Floating = require('../UNSAFE_Floating.js');
var UNSAFE_Layer = require('../UNSAFE_Layer.js');
var hooks_UNSAFE_useHover = require('./UNSAFE_useHover.js');
var hooks_UNSAFE_useFocus = require('./UNSAFE_useFocus.js');
var hooks_UNSAFE_useTouch = require('./UNSAFE_useTouch.js');
var utils_UNSAFE_mergeProps = require('../utils/UNSAFE_mergeProps.js');
var utils_UNSAFE_arrayUtils = require('../utils/UNSAFE_arrayUtils.js');
require('../utils/UNSAFE_classNames.js');
var classNames = require('../classNames-69178ebf.js');
require('preact/compat');
require('../index-d49bf124.js');
require('./UNSAFE_useOutsideClick.js');
require('preact');
require('./UNSAFE_useToggle.js');

const positions = utils_UNSAFE_arrayUtils.stringLiteralArray(['start', 'top-start', 'top', 'top-end', 'end', 'bottom-end', 'bottom', 'bottom-start']);
const anchorTos = utils_UNSAFE_arrayUtils.stringLiteralArray(['element', 'pointer']);
const styles = {
  wrapper: "w1vvnp2m",
  base: "b1gymgil",
  datatip: "d1hwecin"
};
const useTooltipControlled = ({
  text,
  isOpen = false,
  variant = 'tooltip',
  position = 'bottom',
  isDisabled = false,
  anchor = {
    x: 'element',
    y: 'element'
  },
  offset = {
    mainAxis: 0,
    crossAxis: 0
  },
  onToggle
}) => {
  // TODO - consider using useReducer to potentially simplify the implementation
  // as part of a future improvement issue.
  const [state, setState] = hooks.useState(isOpen ? 'mounted' : 'hidden');
  const isDatatip = variant === 'datatip';
  const {
    hoverProps,
    isHover
  } = hooks_UNSAFE_useHover.useHover({
    isDisabled
  });
  const {
    focusProps,
    isFocus
  } = hooks_UNSAFE_useFocus.useFocus({
    isDisabled
  });
  const {
    touchProps,
    isTouch
  } = hooks_UNSAFE_useTouch.useTouch({
    isDisabled
  }); // TODO replace by useLongPress actionhook

  const {
    hoverProps: popoverHoverProps,
    isHover: popoverIsHover
  } = hooks_UNSAFE_useHover.useHover({
    isDisabled
  });
  const {
    touchProps: popoverTouchProps,
    isTouch: popoverIsTouch
  } = hooks_UNSAFE_useTouch.useTouch({
    isDisabled
  });
  const uniqueID = hooks_UNSAFE_useId.useId();
  const isInitialRender = hooks.useRef(true);
  const popoverRef = hooks.useRef(null);
  const targetRef = hooks.useRef(null);
  const coordsRef = hooks.useRef({
    x: 0,
    y: 0
  });
  const usedRef = anchor.x === 'element' && anchor.y === 'element' ? targetRef : coordsRef;
  const delay = isDatatip ? 0 : 250;

  const handleToggle = isOpen => {
    setState(isOpen ? 'mountTimeout' : 'unmountTimeout');
  };

  hooks.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } // No state updates in case focus or touch is already present


    if (isFocus || isTouch) {
      return;
    }

    handleToggle(isHover);
  }, [isHover]);
  hooks.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } // No state updates in case hover or touch is already present


    if (isHover || isTouch) {
      return;
    }

    handleToggle(isFocus);
  }, [isFocus]);
  hooks.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } // No state updates in case hover or focus is already present


    if (isHover || isFocus) {
      return;
    }

    handleToggle(isTouch);
  }, [isTouch]);
  hooks.useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (['mounted', 'unmountTimeout'].includes(state)) {
      setState(popoverIsHover || popoverIsTouch ? 'mounted' : 'unmountTimeout');
    }
  }, [popoverIsHover, popoverIsTouch]);
  hooks.useEffect(() => {
    let timeout;

    switch (state) {
      case 'mountTimeout':
        timeout = setTimeout(() => setState('mountInitialize'), delay);
        break;

      case 'mountInitialize':
        setState('mounting');
        onToggle === null || onToggle === void 0 ? void 0 : onToggle({
          value: true
        });
        break;

      case 'mounting':
        setState('mounted');
        break;

      case 'unmountTimeout':
        timeout = setTimeout(() => setState('unmounting'), delay);
        break;

      case 'unmounting':
        setState('unmounted');
        onToggle === null || onToggle === void 0 ? void 0 : onToggle({
          value: false
        });
        break;
    }

    return () => clearTimeout(timeout);
  }, [state]);
  let actionableProps;

  if (isDisabled) {
    actionableProps = {};
  } else {
    const anchorInitProps = Object.assign(Object.assign({
      'aria-describedby': uniqueID,
      onMouseEnter: event => {
        if (event.eventPhase === Event.AT_TARGET) {
          targetRef.current = event.target;
        }
      }
    }, (anchor.x === 'pointer' || anchor.y === 'pointer') && {
      onMouseMove: event => {
        if (event.eventPhase === Event.AT_TARGET) {
          handleMouseMove(event);
        }
      }
    }), {
      onFocus: event => {
        if (event.eventPhase === Event.AT_TARGET) {
          targetRef.current = event.target;
        }
      }
    });
    actionableProps = utils_UNSAFE_mergeProps.mergeProps(hoverProps, focusProps, touchProps, anchorInitProps);
  } // No need to process tooltip if disabled or no text is provided
  // Include actionableProps to detect mouseenter in components
  // hovered state won't update unless actionableProps are already present in the component when mouse enters


  if (isDisabled || !text) {
    return {
      tooltipContent: null,
      tooltipProps: actionableProps
    };
  } // TODO JET-51708 useFloating.ts deepEqual compares function using toString method.
  // We want it to evaluate false on each rerender so that we get the updated offset value.


  const offsetFunctionLeft = ({
    floating
  }) => ({
    mainAxis: offset === null || offset === void 0 ? void 0 : offset.mainAxis,
    crossAxis: -floating.width - (offset.crossAxis || 0)
  });

  const offsetFunctionRight = ({
    floating
  }) => ({
    mainAxis: offset === null || offset === void 0 ? void 0 : offset.mainAxis,
    crossAxis: floating.width + (offset.crossAxis || 0)
  });

  const POSITIONS = {
    top: {
      placement: 'top',
      offsetValue: offset
    },
    'top-end': {
      placement: 'top-end',
      offsetValue: offsetFunctionRight
    },
    end: {
      placement: 'right',
      offsetValue: offset
    },
    'bottom-end': {
      placement: 'bottom-end',
      offsetValue: offsetFunctionRight
    },
    bottom: {
      placement: 'bottom',
      offsetValue: offset
    },
    'bottom-start': {
      placement: 'bottom-start',
      offsetValue: offsetFunctionLeft
    },
    start: {
      placement: 'left',
      offsetValue: offset
    },
    'top-start': {
      placement: 'top-start',
      offsetValue: offsetFunctionLeft
    }
  };
  const placements = POSITIONS[position];
  const isHidden = state === 'hidden' || state === 'mountTimeout';
  const popoverNode = popoverRef.current;
  const transitionStyles = {
    popoverOpacity: ['mounted', 'unmountTimeout'].includes(state) ? isDatatip ? '100%' : '95%' : '0%',
    wrapperHeight: !isHidden && popoverNode ? `${popoverNode === null || popoverNode === void 0 ? void 0 : popoverNode.offsetHeight}px` : 'auto',
    popoverHeight: state === 'mountInitialize' ? 'none' : ['mounted', 'unmountTimeout'].includes(state) && popoverNode ? `${popoverNode === null || popoverNode === void 0 ? void 0 : popoverNode.offsetHeight}px` : '0'
  };
  let mouseMoveTimeout;

  const handleMouseMove = event => {
    clearTimeout(mouseMoveTimeout);

    if (anchor.x === 'pointer' && anchor.y === 'pointer') {
      // Display tooltip at the mouse position if both anchors are set to pointer
      coordsRef.current = {
        x: event.clientX,
        y: event.clientY
      };
      setState(state === 'mounted' ? 'mounting' : 'mounted');
    } else if (anchor.x === 'pointer') {
      // Tooltip maintains static offset from top side of the window
      // if X anchor is set to 'pointer'
      mouseMoveTimeout = setTimeout(() => {
        var _a, _b;

        const childrenY = ((_a = targetRef === null || targetRef === void 0 ? void 0 : targetRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight) || 0;
        const childrenTop = ((_b = targetRef === null || targetRef === void 0 ? void 0 : targetRef.current) === null || _b === void 0 ? void 0 : _b.offsetTop) || 0;
        const distance = childrenTop + childrenY;
        coordsRef.current = {
          x: event.clientX,
          y: distance
        };
        onToggle === null || onToggle === void 0 ? void 0 : onToggle({
          value: true
        });
      }, delay);
    } else if (anchor.y === 'pointer') {
      // Tooltip maintains static offset from left side of window
      // if Y anchor is set to 'pointer'
      mouseMoveTimeout = setTimeout(() => {
        var _a, _b;

        const childrenX = ((_a = targetRef === null || targetRef === void 0 ? void 0 : targetRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth) || 0;
        const childrenLeft = ((_b = targetRef === null || targetRef === void 0 ? void 0 : targetRef.current) === null || _b === void 0 ? void 0 : _b.offsetLeft) || 0;
        const distance = childrenLeft + childrenX;
        coordsRef.current = {
          x: distance,
          y: event.clientY
        };
        onToggle === null || onToggle === void 0 ? void 0 : onToggle({
          value: true
        });
      }, delay);
    }
  };

  const handleTransitionEnd = _ => {
    if (state === 'mounting') {
      setState('mounted');
    }

    if (state === 'unmounted') {
      setState('hidden');
    }
  };

  const renderContent = jsxRuntime.jsx(UNSAFE_Layer.Layer, {
    children: jsxRuntime.jsx(UNSAFE_Floating.Floating, Object.assign({
      anchorRef: usedRef,
      placement: placements.placement,
      offsetValue: placements.offsetValue
    }, {
      children: jsxRuntime.jsx("div", Object.assign({
        id: uniqueID,
        role: "tooltip"
      }, popoverHoverProps, popoverTouchProps, {
        class: styles.wrapper,
        style: {
          height: transitionStyles.wrapperHeight
        }
      }, {
        children: jsxRuntime.jsx("div", Object.assign({
          style: {
            opacity: transitionStyles.popoverOpacity,
            maxHeight: transitionStyles.popoverHeight,
            transition: 'max-height 0.1s cubic-bezier(0.0, 0.0, 0.2, 1), opacity 0.1s cubic-bezier(0.0, 0.0, 0.2, 1)'
          },
          onTransitionEnd: handleTransitionEnd
        }, {
          children: jsxRuntime.jsx("div", Object.assign({
            ref: popoverRef,
            class: classNames.classNames([styles.base, isDatatip ? styles[variant] : ''])
          }, {
            children: text
          }))
        }))
      }))
    }))
  });

  return {
    tooltipContent: !isHidden && renderContent,
    tooltipProps: actionableProps
  };
};

const useTooltip = ({ text, position = 'bottom', isDisabled = false, anchor = { x: 'element', y: 'element' }, offset = { mainAxis: 0, crossAxis: 0 } }) => {
    const [isOpen, setIsOpen] = hooks.useState(false);
    const disabled = isDisabled || !text;
    const { tooltipContent, tooltipProps } = useTooltipControlled({
        text,
        isOpen,
        position,
        isDisabled: disabled,
        offset,
        anchor,
        onToggle: ({ value }) => setIsOpen(value)
    });
    return {
        tooltipContent,
        tooltipProps
    };
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useTooltip = useTooltip;
exports.useTooltipControlled = useTooltipControlled;
/*  */
//# sourceMappingURL=UNSAFE_useTooltip.js.map
