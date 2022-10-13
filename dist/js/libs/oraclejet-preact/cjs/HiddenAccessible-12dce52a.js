/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');


const hiddenAccessibleStyle = "aei1uf";
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
//# sourceMappingURL=HiddenAccessible-12dce52a.js.map
