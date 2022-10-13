/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_Badge.css';

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
  const textClasses = classNames([styles.base, size === 'sm' && 'oj-badge-sm', placement === 'end' && styles.end, styles[variant]]);
  return jsx("span", Object.assign({
    class: textClasses
  }, {
    children: children
  }));
}

export { Badge };
/*  */
//# sourceMappingURL=UNSAFE_Badge.js.map
