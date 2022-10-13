/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_HiddenAccessible.css';

const hiddenAccessibleStyle = "aei1uf";
/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */

function HiddenAccessible({
  children
}) {
  return jsx("span", Object.assign({
    class: hiddenAccessibleStyle
  }, {
    children: children
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { HiddenAccessible };
/*  */
//# sourceMappingURL=UNSAFE_HiddenAccessible.js.map
