/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Text.css';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import './utils/UNSAFE_classNames.js';
import './_curry1-8b0d63fc.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';

const styles = {
  base: "b6jdwjx",
  lineClamp: "l1qmwoxi",
  truncation: {
    none: '',
    clip: "cfwqzmb",
    ellipsis: "emidvu4"
  },
  variant: {
    primary: "p1ezhrks",
    secondary: "syopp45",
    disabled: "d1dsnorh",
    danger: "dfe2mvw",
    warning: "w1e228g6",
    success: "s1fkxo46",
    inherit: "ij5xq93"
  },
  size: {
    '2xs': "_1ry6lz",
    xs: "xfmc0g5",
    sm: "s1kbi77g",
    md: "m1f81o2h",
    lg: "l2qflkf",
    xl: "xpwod3h",
    inherit: "i1io10yt"
  },
  weight: {
    normal: "n13qnuwk",
    semiBold: "s15uoq1h",
    bold: "bmma8xm",
    inherit: "i1qk6uxk"
  },
  hyphens: {
    auto: "a15141z6",
    none: "nlosoml"
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
