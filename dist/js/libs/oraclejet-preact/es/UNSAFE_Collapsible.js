/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { useState, useEffect, useRef } from 'preact/hooks';
import { useId } from './hooks/UNSAFE_useId.js';
import './UNSAFE_Collapsible.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { Flex } from './UNSAFE_Flex.js';
import { CollapseIcon } from './UNSAFE_ThemedIcons.js';
import { IcoChevronDown as SvgIcoChevronDown } from './UNSAFE_Icons.js';
import { useAnimation } from './hooks/UNSAFE_useAnimation.js';
import './tslib.es6-deee4931.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-77d2b8e6.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './hooks/UNSAFE_useTheme.js';

const styles$1 = {
  base: "_qztm4t",
  disabled: "_fwsa20"
};
/**
 * Header icon subcomponent
 */

const CollapsibleHeaderIcon = ({
  contentId,
  isDisabled,
  headerId,
  isExpanded,
  onClick
}) => {
  const classes = classNames([styles$1.base, isDisabled && styles$1.disabled]);
  const Icon = isExpanded ? SvgIcoChevronDown : CollapseIcon;
  return jsx("button", Object.assign({
    class: classes,
    "aria-labelledby": headerId,
    "aria-controls": contentId,
    "aria-expanded": isExpanded,
    onClick: onClick
  }, {
    children: jsx(Icon, {
      size: "6x"
    })
  }));
};

const styles = {
  base: "_5zk568",
  disabled: "_1458rr"
};
/**
 * Header subcomponent
 */

const CollapsibleHeader = ({
  children,
  id,
  contentId,
  isDisabled,
  isExpanded,
  toggleHandler
}) => {
  const classes = classNames([styles.base, isDisabled && styles.disabled]);
  return jsx("div", Object.assign({
    id: id,
    class: classes,
    onClick: toggleHandler
  }, {
    children: jsxs(Flex, Object.assign({
      align: "center"
    }, {
      children: [jsx(CollapsibleHeaderIcon, {
        isDisabled: isDisabled,
        headerId: id,
        contentId: contentId,
        isExpanded: isExpanded
      }), children]
    }))
  }));
};

const CollapsibleContent = ({ children, id, isExpanded, onTransitionEnd }) => {
    const [state, setState] = useState(isExpanded ? 'mounted' : 'unmounted');
    const [prevExpanded, setPrevExpanded] = useState(isExpanded);
    const isAnimating = isExpanded !== prevExpanded || ['mounting', 'unmounting'].includes(state);
    useEffect(() => {
        if (isAnimating) {
            setState(isExpanded ? 'mounting' : 'unmounting');
        }
    }, [isExpanded, isAnimating]);
    const { nodeRef } = useAnimation(['mounted', 'mounting'].includes(state) ? 'expanded' : 'collapsed', {
        animationStates,
        onAnimationEnd: ({ animationState }) => {
            const isExpanded = animationState === 'expanded';
            setState(isExpanded ? 'mounted' : 'unmounted');
            setPrevExpanded(isExpanded);
            onTransitionEnd === null || onTransitionEnd === void 0 ? void 0 : onTransitionEnd();
        }
    });
    return (jsx("div", Object.assign({ ref: nodeRef, id: id, tabIndex: -1, "aria-hidden": !isExpanded || undefined }, { children: (isAnimating || state === 'mounted') && children })));
};
/**
 * The transition from collapsed to expanded works as follows:
 * 1. When the component is initially rendered in the collapsed state, we
 *    explicitly set maxHeight and overflowY from "to" configuration.
 * 2. When the expanded prop changes from false to true, we first mount the content children.
 * 3. Once this is mounted we trigger an animation updating animationState value of useAnimationHook.
 * 4. Configuration is represented inside hook. Passed config depends if previous animation was completed or not.
 *    We could check that based on node.style.maxHeight.
 *
 * The transition from expanded to collapsed is similar:
 * 1. We trigger an animation updating animationState value of useAnimationHook.
 * 2. Once animation is completed, with the help of end config,we set max-Height as 'none'.
 *    This will allow us to keep adding content.
 * 3. Once this is done, onAnimationEnd is called(as 'from collapsed to expanded"). Here, content children are unmouunted.
 *
 * In some future, handling unmounting would be handled using another API agnostic to useAnimation hook. For now, this is handled by user.
 */
const animationStates = {
    expanded: (node) => {
        return {
            to: {
                maxHeight: `${node.scrollHeight}px`,
                overflowY: 'hidden'
            },
            options: {
                duration: 400
            },
            end: {
                maxHeight: 'none'
            }
        };
    },
    collapsed: (node) => {
        return Object.assign(Object.assign({}, (node.style.maxHeight === 'none' && {
            from: {
                maxHeight: `${node.scrollHeight}px`
            }
        })), { to: {
                overflowY: 'hidden',
                maxHeight: '0'
            }, options: {
                duration: 400
            } });
    }
};

/**
 * Controlled Collapsible component
 */
const Collapsible = ({ id, header, children, isDisabled = false, isExpanded = false, onToggle, onTransitionEnd }) => {
    const rootRef = useRef(null);
    const uniqueID = useId();
    const headerId = `oj-collapsible-header-${uniqueID}`;
    const contentId = `oj-collapsible-content-${uniqueID}`;
    /**
     * Function handling toggle and invoking callback for collapsing/expanding
     */
    const toggleHandler = () => {
        if (isDisabled) {
            return;
        }
        onToggle === null || onToggle === void 0 ? void 0 : onToggle({
            value: !isExpanded
        });
    };
    /**
     * Function that is triggerd when animation ends
     */
    const transitionEndHandler = () => {
        onTransitionEnd === null || onTransitionEnd === void 0 ? void 0 : onTransitionEnd({
            value: isExpanded
        });
    };
    return (jsxs("div", Object.assign({ id: id, ref: rootRef }, { children: [jsx(CollapsibleHeader, Object.assign({ id: headerId, contentId: contentId, toggleHandler: toggleHandler, isDisabled: isDisabled, isExpanded: isExpanded }, { children: header })), jsx(CollapsibleContent, Object.assign({ id: contentId, isExpanded: isExpanded, onTransitionEnd: transitionEndHandler }, { children: children }))] })));
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Collapsible };
/*  */
//# sourceMappingURL=UNSAFE_Collapsible.js.map
