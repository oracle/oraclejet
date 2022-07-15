/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');

var classNames = require('./classNames-69178ebf.js');

const styles = {
  base: "b1p6r8y1",
  //right-aligned with the right edge of another component for ltr direction
  //left-aligned for rtl direction pending by
  //https://jira.oraclecorp.com/jira/browse/JET-47572: need an api for rtl
  end: "ejfnjah",
  neutral: "ncn0ths",
  danger: "d9z2tc0",
  warning: "w1tk4m7e",
  success: "s1vtrr8j",
  info: "i1fjs3t3",
  neutralSubtle: "nmgj8vm",
  dangerSubtle: "d688ooe",
  warningSubtle: "w1g35qkp",
  successSubtle: "s1dzbo4i",
  infoSubtle: "iuorc8j"
};
function Badge({
  variant = 'neutral',
  size = 'md',
  placement = 'none',
  children
}) {
  const textClasses = classNames.classNames([styles.base, size === 'sm' && 'oj-badge-sm', placement === 'end' && styles.end, styles[variant]]);
  return jsxRuntime.jsx("span", Object.assign({
    class: textClasses
  }, {
    children: children
  }));
}

exports.Badge = Badge;
/*  */
//# sourceMappingURL=Badge-45915fb6.js.map
