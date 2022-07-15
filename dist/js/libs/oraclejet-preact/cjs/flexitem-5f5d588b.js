/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';


var keys = require('./keys-4bd017bf.js');

const alignSelfStyles = {
  baseline: "b14bx1c2",
  center: "c1sb9krb",
  end: "e1bnlvyb",
  start: "s19k3u2a",
  inherit: "iamf5cl",
  initial: "i25bvtv",
  stretch: "swdgzqr"
};
const flexitemStyles = {
  alignSelf: alignSelfStyles
};
const alignSelfs = keys.keys_1(alignSelfStyles);
const flexitemInterpolations = {
  alignSelf: ({
    alignSelf
  }) => alignSelf === undefined ? {} : {
    class: alignSelfStyles[alignSelf]
  },
  flex: ({
    flex
  }) => flex === undefined ? {} : {
    flex
  },
  order: ({
    order
  }) => order === undefined ? {} : {
    order
  }
};

exports.alignSelfs = alignSelfs;
exports.flexitemInterpolations = flexitemInterpolations;
exports.flexitemStyles = flexitemStyles;
/*  */
//# sourceMappingURL=flexitem-5f5d588b.js.map
