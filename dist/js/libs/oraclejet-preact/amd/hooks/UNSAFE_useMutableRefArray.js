define(['exports', 'preact', 'preact/hooks'], (function (exports, preact, hooks) { 'use strict';

  /**
   * Creates an array of refs that can be mutated
   * @param length The number of refs needed. When updated, a new set of refs will be created
   * @returns An Array of refs
   */
  function useMutableRefArray(length = 0) {
      return hooks.useMemo(() => new Array(length).fill(undefined).map(() => preact.createRef()), [length]);
  }

  exports.useMutableRefArray = useMutableRefArray;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
