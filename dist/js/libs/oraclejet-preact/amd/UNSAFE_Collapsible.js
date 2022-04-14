define(['exports', 'preact', 'preact/hooks', '@oracle/oraclejet-preact/hooks/UNSAFE_useId', '@oracle/oraclejet-preact/utils/classNames', '@oracle/oraclejet-preact/UNSAFE_Flex'], (function (exports, preact, hooks, UNSAFE_useId, classNames, UNSAFE_Flex) { 'use strict';

  const styles$2 = {
    base: "oj-collapsible-base-1glatks",
    disabled: "oj-collapsible-disabled-oaykyi"
  };
  /**
   * Header icon subcomponent
   */

  const CollapsibleHeaderIcon = ({
    contentId,
    disabled,
    headerId,
    expanded,
    fill = 'currentColor',
    onClick
  }) => {
    var _a;

    const classes = classNames.classNames([styles$2.base, disabled && styles$2.disabled]); // TODO - replace by RTL API (https://jira.oraclecorp.com/jira/browse/JET-47572)

    const dir = (_a = document.documentElement.getAttribute('dir')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const transform = expanded ? {} : {
      transform: dir === 'rtl' ? 'rotate(90, 12, 12)' : 'rotate(270, 12, 12)'
    };
    return preact.h("button", {
      class: classes,
      "aria-labelledby": headerId,
      "aria-controls": contentId,
      "aria-expanded": expanded,
      onClick: onClick
    }, preact.h("svg", {
      height: "24",
      viewBox: "0 0 24 24",
      width: "24",
      xmlns: "http://www.w3.org/2000/svg"
    }, preact.h("path", Object.assign({
      d: "m6.3497489 8-1.3497489 1.73856619 7 6.26143381 7-6.26143381-1.3497489-1.73856619-5.6502511 5.0540962z",
      fill: fill,
      "fill-rule": "evenodd"
    }, transform))));
  };

  const styles$1 = {
    base: "oj-collapsible-base-1pf2uk6",
    disabled: "oj-collapsible-disabled-n3j7vy"
  };
  /**
   * Header subcomponent
   */

  const CollapsibleHeader = ({
    children,
    id,
    contentId,
    disabled,
    expanded,
    toggleHandler
  }) => {
    const classes = classNames.classNames([styles$1.base, disabled && styles$1.disabled]);
    return preact.h("div", {
      id: id,
      class: classes,
      onClick: toggleHandler
    }, preact.h(UNSAFE_Flex.Flex, {
      align: "center"
    }, preact.h(CollapsibleHeaderIcon, {
      disabled: disabled,
      headerId: id,
      contentId: contentId,
      expanded: expanded
    }), children));
  };

  const styles = {
    content: "oj-collapsible-content-hho2zv"
  };
  /**
   * Content subcomponent - expand/collapse animation is implemented using a CSS
   * transition on the max-height style property.
   *
   * The transition from collapsed to expanded works as follows:
   * 1. When the component is initially rendered in the collapsed state, we
   *    explicitly set the max-height to 0.
   * 2. When the expanded prop changes from false to true, we trigger the
   *    transition by setting manually setting the max-height to match the
   *    component's scroll height.
   * 3. Once the transition has completed, we no longer want to constriain
   *    the max-height, since the component content should be free to reflow
   *    as needed. As such, we reset the max-height to "none" on transition end.
   *
   * The transition from expanded to collapsed is similar:
   * 1. When detect that the expanded prop is changing from true to to false,
   *    we pin the max-height to the current scroll height during render.
   * 2. Then max-height is manually set to 0 in an effect callback.
   * 3. Unlike in the expanded case, we don't bother resetting the max-height
   *    after the transition completes, as the collapsed content is not visible
   *    and thus does not reflow.
   */

  const CollapsibleContent = ({
    children,
    id,
    expanded,
    onTransitionEnd
  }) => {
    // The state hook is used in order to track animation status and
    // implement conditional rendering of the content.
    const [state, setState] = hooks.useState(expanded ? 'mounted' : 'unmounted'); // Previous state is tracked to determine when component should start animation

    const [prevExpanded, setPrevExpanded] = hooks.useState(expanded);
    const isAnimating = expanded !== prevExpanded || ['mounting', 'unmounting'].includes(state);
    const contentRef = hooks.useRef(null);
    hooks.useEffect(() => {
      if (isAnimating) {
        setState(expanded ? 'mounting' : 'unmounting');
      }
    }, [expanded, isAnimating]);
    const handleTransitionEnd = hooks.useCallback(event => {
      setState(expanded ? 'mounted' : 'unmounted');
      setPrevExpanded(expanded);
      onTransitionEnd === null || onTransitionEnd === void 0 ? void 0 : onTransitionEnd(event);
    }, [expanded, onTransitionEnd]);
    const node = contentRef.current; // When expanding, we start from a max-height=0 and animate up
    // to the scroll height. When collapsing, we do the opposite.
    // When component is expanded, content can reflow freely without restrictions.
    // When component is collapsed, we set max-height to 0.

    const maxHeight = {
      mounting: isAnimating && node ? `${node.scrollHeight}px` : 'none',
      mounted: isAnimating && node ? `${node.scrollHeight}px` : 'none',
      unmounting: '0',
      unmounted: '0'
    }[state];
    return preact.h("div", {
      ref: contentRef,
      id: id,
      tabIndex: -1,
      class: styles.content,
      style: {
        maxHeight
      },
      "aria-hidden": !expanded || undefined,
      onTransitionEnd: handleTransitionEnd
    }, (isAnimating || state === 'mounted') && children);
  };

  /**
   * Controlled Collapsible component
   */
  const Collapsible = ({ id, header, children, disabled = false, expanded = false, onToggle, onTransitionEnd }) => {
      const rootRef = hooks.useRef(null);
      const uniqueID = UNSAFE_useId.useId();
      const headerId = `oj-collapsible-header-${uniqueID}`;
      const contentId = `oj-collapsible-content-${uniqueID}`;
      /**
       * Function handling toggle and invoking callback for collapsing/expanding
       */
      const toggleHandler = (event) => {
          if (disabled) {
              return;
          }
          onToggle === null || onToggle === void 0 ? void 0 : onToggle({
              value: !expanded
          }, event);
      };
      /**
       * Function that is triggerd when animation ends
       */
      const transitionEndHandler = () => {
          onTransitionEnd === null || onTransitionEnd === void 0 ? void 0 : onTransitionEnd({
              value: expanded
          });
      };
      return (preact.h("div", { id: id, ref: rootRef },
          preact.h(CollapsibleHeader, { id: headerId, contentId: contentId, toggleHandler: toggleHandler, disabled: disabled, expanded: expanded }, header),
          preact.h(CollapsibleContent, { id: contentId, expanded: expanded, onTransitionEnd: transitionEndHandler }, children)));
  };

  exports.Collapsible = Collapsible;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
