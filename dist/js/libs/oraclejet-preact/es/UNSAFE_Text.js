/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Text.css';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import './utils/UNSAFE_classNames.js';
import './_curry1-b6f34fc4.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';

const styles = {
  base: "_ocbw3g",
  lineClamp: "_ywxj2",
  truncation: {
    none: '',
    clip: "ns033",
    ellipsis: "_y8onv0"
  },
  variant: {
    primary: "_q70zwd",
    secondary: "_1479pd",
    disabled: "cj7bhe",
    danger: "_43cquc",
    warning: "_e2luz",
    success: "_w3ax2",
    inherit: "gnztqz"
  },
  size: {
    '2xs': "_jt5lc2",
    xs: "_q0n3f5",
    sm: "_yhn5jq",
    md: "_nbcuhk",
    lg: "grzy4w",
    xl: "_p87xpe",
    inherit: "_w52uu"
  },
  weight: {
    normal: "_m8p8kc",
    semiBold: "tia5ko",
    bold: "v5af11",
    inherit: "_e3tlvr"
  },
  hyphens: {
    auto: "_aauij7",
    none: "czwf1j"
  }
};
const interpolations = [() => ({
  class: styles.base
}), ({
  size = 'inherit'
}) => ({
  class: styles.size[size]
}), ({
  weight = 'inherit'
}) => ({
  class: styles.weight[weight]
}), ({
  variant = 'inherit'
}) => ({
  class: styles.variant[variant]
}), ({
  hyphens = 'auto'
}) => ({
  class: styles.hyphens[hyphens]
}), ({
  truncation = 'none'
}) => ({
  class: styles.truncation[truncation]
}), ({
  lineClamp
}) => !lineClamp ? {} : {
  class: styles.lineClamp,
  webkitLineClamp: lineClamp
}];
const styleInterpolations = mergeInterpolations(interpolations);
function Text(_a) {
  var {
    children
  } = _a,
      props = __rest(_a, ["children"]);

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = __rest(_b, ["class"]);

  return jsx("span", Object.assign({
    class: cls,
    style: styles
  }, {
    children: children
  }));
}

export { Text };
/*  */
//# sourceMappingURL=UNSAFE_Text.js.map
