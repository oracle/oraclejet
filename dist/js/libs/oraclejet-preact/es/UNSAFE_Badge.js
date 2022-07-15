/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx } from 'preact/jsx-runtime';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_Badge.css';

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
