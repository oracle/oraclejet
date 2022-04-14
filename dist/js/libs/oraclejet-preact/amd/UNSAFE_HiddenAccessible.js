define(['exports', 'preact'], (function (exports, preact) { 'use strict';

  const hiddenAccessibleStyle = "oj-hidden-accessible-hiddenAccessibleStyle-10xavsd";
  /**
   * HiddenAccessible is a helper component that hides its children visually,
   * but keeps them visible to screen readers.
   *
   */

  function HiddenAccessible({
    children
  }) {
    return preact.h("span", {
      class: hiddenAccessibleStyle
    }, children);
  }

  exports.HiddenAccessible = HiddenAccessible;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
