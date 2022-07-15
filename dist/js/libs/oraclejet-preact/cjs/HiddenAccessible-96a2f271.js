/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');


const hiddenAccessibleStyle = "hbvw96q";
/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */

function HiddenAccessible({
  children
}) {
  return jsxRuntime.jsx("span", Object.assign({
    class: hiddenAccessibleStyle
  }, {
    children: children
  }));
}

exports.HiddenAccessible = HiddenAccessible;
/*  */
//# sourceMappingURL=HiddenAccessible-96a2f271.js.map
