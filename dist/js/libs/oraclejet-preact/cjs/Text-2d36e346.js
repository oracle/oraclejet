/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');

var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');

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
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
function Text(_a) {
  var {
    children
  } = _a,
      props = tslib_es6.__rest(_a, ["children"]);

  const _b = styleInterpolations(props),
        {
    class: cls
  } = _b,
        styles = tslib_es6.__rest(_b, ["class"]);

  return jsxRuntime.jsx("span", Object.assign({
    class: cls,
    style: styles
  }, {
    children: children
  }));
}

exports.Text = Text;
/*  */
//# sourceMappingURL=Text-2d36e346.js.map
