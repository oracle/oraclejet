/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Link.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { usePress } from './hooks/UNSAFE_usePress.js';
import 'preact/hooks';

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
  const linkClass = classNames([styles.default, styles[placement], variant !== 'default' && styles[variant]]);
  const {
    pressProps
  } = usePress(onClick !== null && onClick !== void 0 ? onClick : noop);
  return jsx("a", Object.assign({
    href: href,
    target: target
  }, pressProps, {
    class: linkClass
  }, {
    children: children
  }));
}

export { Link };
/*  */
//# sourceMappingURL=UNSAFE_Link.js.map
