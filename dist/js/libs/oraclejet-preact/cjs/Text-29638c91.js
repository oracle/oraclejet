/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');

var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');

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
//# sourceMappingURL=Text-29638c91.js.map
