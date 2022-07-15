/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

require('./utils/UNSAFE_classNames.js');
var hooks_UNSAFE_usePress = require('./hooks/UNSAFE_usePress.js');
var classNames = require('./classNames-69178ebf.js');

const styles = {
  default: "d84zyna",
  primary: "pbavu3n",
  secondary: "s8zm58y",
  standalone: "sf2d2uo",
  embedded: "enzr2k5"
};

const noop = () => {};

function Link({
  href,
  variant = 'default',
  placement = 'standalone',
  target,
  children,
  onClick
}) {
  const linkClass = classNames.classNames([styles.default, styles[placement], variant !== 'default' && styles[variant]]);
  const {
    pressProps
  } = hooks_UNSAFE_usePress.usePress(onClick !== null && onClick !== void 0 ? onClick : noop);
  return jsxRuntime.jsx("a", Object.assign({
    href: href,
    target: target
  }, pressProps, {
    class: linkClass
  }, {
    children: children
  }));
}

exports.Link = Link;
/*  */
//# sourceMappingURL=Link-1287b33e.js.map
