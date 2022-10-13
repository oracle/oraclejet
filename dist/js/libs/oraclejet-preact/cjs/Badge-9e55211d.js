/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');

var classNames = require('./classNames-82bfab52.js');

const styles = {
  base: "tn08m2",
  //right-aligned with the right edge of another component for ltr direction
  //left-aligned for rtl direction pending by
  //https://jira.oraclecorp.com/jira/browse/JET-47572: need an api for rtl
  end: "a7igkf",
  neutral: "_4uh43s",
  danger: "fa1e52",
  warning: "w2op4l",
  success: "_yaohz2",
  info: "_yvc3bl",
  neutralSubtle: "n0gf0d",
  dangerSubtle: "s5sehe",
  warningSubtle: "_kv88wp",
  successSubtle: "_n1l5su",
  infoSubtle: "_denzcr"
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
//# sourceMappingURL=Badge-9e55211d.js.map
