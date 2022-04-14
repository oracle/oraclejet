import { h } from 'preact';

const hiddenAccessibleStyle = "oj-hidden-accessible-hiddenAccessibleStyle-10xavsd";
/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */

function HiddenAccessible({
  children
}) {
  return h("span", {
    class: hiddenAccessibleStyle
  }, children);
}

export { HiddenAccessible };
