/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';


var keys = require('./keys-0a611b24.js');

const alignSelfStyles = {
  baseline: "_h1axri",
  center: "_b9d2m9",
  end: "_jma7d",
  start: "bw4q4",
  inherit: "_suds4",
  initial: "_yfk337",
  stretch: "ylxb7s"
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
//# sourceMappingURL=flexitem-91650faf.js.map
