/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');

require('./utils/UNSAFE_classNames.js');
var hooks_UNSAFE_usePress = require('./hooks/UNSAFE_usePress.js');
var classNames = require('./classNames-82bfab52.js');

const styles = {
  default: "_1zfo6",
  primary: "lcxov1",
  secondary: "_200l65",
  standalone: "_s6ypvg",
  embedded: "_deg018"
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
//# sourceMappingURL=Link-a3e25f1c.js.map
