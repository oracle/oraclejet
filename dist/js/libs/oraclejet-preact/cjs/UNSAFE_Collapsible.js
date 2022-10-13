/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
var hooks = require('preact/hooks');
var hooks_UNSAFE_useId = require('./hooks/UNSAFE_useId.js');
require('identity-obj-proxy');
require('./utils/UNSAFE_classNames.js');
require('./UNSAFE_Flex.js');
var UNSAFE_ThemedIcons = require('./index-dcd95188.js');
var classNames = require('./classNames-82bfab52.js');
var UNSAFE_Icons = require('./index-e2b299b3.js');
var Flex = require('./Flex-327ae051.js');
var hooks_UNSAFE_useAnimation = require('./hooks/UNSAFE_useAnimation.js');
require('./tslib.es6-e91f819d.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./_curry1-94f22a19.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-e6dc9cf1.js');
require('./_has-556488e4.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-0a611b24.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');
require('./UNSAFE_Icon.js');
require('./Icon-42559ff1.js');
require('./hooks/UNSAFE_useUser.js');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');
require('./hooks/UNSAFE_useTheme.js');

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
  const classes = classNames.classNames([styles$1.base, isDisabled && styles$1.disabled]);
  const Icon = isExpanded ? UNSAFE_Icons.SvgIcoChevronDown : UNSAFE_ThemedIcons.CollapseIcon;
  return jsxRuntime.jsx("button", Object.assign({
    class: classes,
    "aria-labelledby": headerId,
    "aria-controls": contentId,
    "aria-expanded": isExpanded,
    onClick: onClick
  }, {
    children: jsxRuntime.jsx(Icon, {
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
  const classes = classNames.classNames([styles.base, isDisabled && styles.disabled]);
  return jsxRuntime.jsx("div", Object.assign({
    id: id,
    class: classes,
    onClick: toggleHandler
  }, {
    children: jsxRuntime.jsxs(Flex.Flex, Object.assign({
      align: "center"
    }, {
      children: [jsxRuntime.jsx(CollapsibleHeaderIcon, {
        isDisabled: isDisabled,
        headerId: id,
        contentId: contentId,
        isExpanded: isExpanded
      }), children]
    }))
  }));
};

const CollapsibleContent = ({ children, id, isExpanded, onTransitionEnd }) => {
    const [state, setState] = hooks.useState(isExpanded ? 'mounted' : 'unmounted');
    const [prevExpanded, setPrevExpanded] = hooks.useState(isExpanded);
    const isAnimating = isExpanded !== prevExpanded || ['mounting', 'unmounting'].includes(state);
    hooks.useEffect(() => {
        if (isAnimating) {
            setState(isExpanded ? 'mounting' : 'unmounting');
        }
    }, [isExpanded, isAnimating]);
    const { nodeRef } = hooks_UNSAFE_useAnimation.useAnimation(['mounted', 'mounting'].includes(state) ? 'expanded' : 'collapsed', {
        animationStates,
        onAnimationEnd: ({ animationState }) => {
            const isExpanded = animationState === 'expanded';
            setState(isExpanded ? 'mounted' : 'unmounted');
            setPrevExpanded(isExpanded);
            onTransitionEnd === null || onTransitionEnd === void 0 ? void 0 : onTransitionEnd();
        }
    });
    return (jsxRuntime.jsx("div", Object.assign({ ref: nodeRef, id: id, tabIndex: -1, "aria-hidden": !isExpanded || undefined }, { children: (isAnimating || state === 'mounted') && children })));
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
    const rootRef = hooks.useRef(null);
    const uniqueID = hooks_UNSAFE_useId.useId();
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
    return (jsxRuntime.jsxs("div", Object.assign({ id: id, ref: rootRef }, { children: [jsxRuntime.jsx(CollapsibleHeader, Object.assign({ id: headerId, contentId: contentId, toggleHandler: toggleHandler, isDisabled: isDisabled, isExpanded: isExpanded }, { children: header })), jsxRuntime.jsx(CollapsibleContent, Object.assign({ id: contentId, isExpanded: isExpanded, onTransitionEnd: transitionEndHandler }, { children: children }))] })));
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.Collapsible = Collapsible;
/*  */
//# sourceMappingURL=UNSAFE_Collapsible.js.map
