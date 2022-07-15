/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Link.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { usePress } from './hooks/UNSAFE_usePress.js';
import 'preact/hooks';

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
