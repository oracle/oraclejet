/* @oracle/oraclejet-preact: 13.1.0 */
import { useState, useRef, useEffect } from 'preact/hooks';
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_useTooltip.css';
import { useId } from './UNSAFE_useId.js';
import { Floating } from '../UNSAFE_Floating.js';
import { Layer } from '../UNSAFE_Layer.js';
import { useHover } from './UNSAFE_useHover.js';
import { useFocus } from './UNSAFE_useFocus.js';
import { useTouch } from './UNSAFE_useTouch.js';
import { mergeProps } from '../utils/UNSAFE_mergeProps.js';
import { stringLiteralArray } from '../utils/UNSAFE_arrayUtils.js';
import { classNames } from '../utils/UNSAFE_classNames.js';
import 'preact/compat';
import '../index-46e68d3c.js';
import './UNSAFE_useUser.js';
import '../UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_useOutsideClick.js';
import './UNSAFE_useToggle.js';

const positions = stringLiteralArray(['start', 'top-start', 'top', 'top-end', 'end', 'bottom-end', 'bottom', 'bottom-start']);
const anchorTos = stringLiteralArray(['element', 'pointer']);
const styles = {
  wrapper: "_uophsw",
  base: "_gg49p7",
  datatip: "pb2ba7"
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
  const [state, setState] = useState(isOpen ? 'mounted' : 'hidden');
  const isDatatip = variant === 'datatip';
  const {
    hoverProps,
    isHover
  } = useHover({
    isDisabled
  });
  const {
    focusProps,
    isFocus
  } = useFocus({
    isDisabled
  });
  const {
    touchProps,
    isTouch
  } = useTouch({
    isDisabled
  }); // TODO replace by useLongPress actionhook

  const {
    hoverProps: popoverHoverProps,
    isHover: popoverIsHover
  } = useHover({
    isDisabled
  });
  const {
    touchProps: popoverTouchProps,
    isTouch: popoverIsTouch
  } = useTouch({
    isDisabled
  });
  const uniqueID = useId();
  const isInitialRender = useRef(true);
  const popoverRef = useRef(null);
  const targetRef = useRef(null);
  const coordsRef = useRef({
    x: 0,
    y: 0
  });
  const usedRef = anchor.x === 'element' && anchor.y === 'element' ? targetRef : coordsRef;
  const delay = isDatatip ? 0 : 250;

  const handleToggle = isOpen => {
    setState(isOpen ? 'mountTimeout' : 'unmountTimeout');
  };

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } // No state updates in case focus or touch is already present


    if (isFocus || isTouch) {
      return;
    }

    handleToggle(isHover);
  }, [isHover]);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } // No state updates in case hover or touch is already present


    if (isHover || isTouch) {
      return;
    }

    handleToggle(isFocus);
  }, [isFocus]);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    } // No state updates in case hover or focus is already present


    if (isHover || isFocus) {
      return;
    }

    handleToggle(isTouch);
  }, [isTouch]);
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    if (['mounted', 'unmountTimeout'].includes(state)) {
      setState(popoverIsHover || popoverIsTouch ? 'mounted' : 'unmountTimeout');
    }
  }, [popoverIsHover, popoverIsTouch]);
  useEffect(() => {
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
    actionableProps = mergeProps(hoverProps, focusProps, touchProps, anchorInitProps);
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

  const renderContent = jsx(Layer, {
    children: jsx(Floating, Object.assign({
      anchorRef: usedRef,
      placement: placements.placement,
      offsetValue: placements.offsetValue
    }, {
      children: jsx("div", Object.assign({
        id: uniqueID,
        role: "tooltip"
      }, popoverHoverProps, popoverTouchProps, {
        class: styles.wrapper,
        style: {
          height: transitionStyles.wrapperHeight
        }
      }, {
        children: jsx("div", Object.assign({
          style: {
            opacity: transitionStyles.popoverOpacity,
            maxHeight: transitionStyles.popoverHeight,
            transition: 'max-height 0.1s cubic-bezier(0.0, 0.0, 0.2, 1), opacity 0.1s cubic-bezier(0.0, 0.0, 0.2, 1)'
          },
          onTransitionEnd: handleTransitionEnd
        }, {
          children: jsx("div", Object.assign({
            ref: popoverRef,
            class: classNames([styles.base, isDatatip ? styles[variant] : ''])
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
    const [isOpen, setIsOpen] = useState(false);
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

export { useTooltip, useTooltipControlled };
/*  */
//# sourceMappingURL=UNSAFE_useTooltip.js.map
