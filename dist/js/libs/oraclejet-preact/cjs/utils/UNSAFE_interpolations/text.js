/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('identity-obj-proxy');
var keys = require('../../keys-0a611b24.js');
require('../../_curry1-94f22a19.js');
require('../../_has-556488e4.js');

const textAlignStyles = {
  start: "_wibxf",
  end: "cgdb3m",
  right: "n4t3gp"
};
const textStyles = {
  textAlign: textAlignStyles
};
const textAligns = keys.keys_1(textAlignStyles);
const textInterpolations = {
  textAlign: ({
    textAlign
  }) => textAlign === undefined ? {} : {
    class: textAlignStyles[textAlign]
  }
};

exports.textAlignStyles = textAlignStyles;
exports.textAligns = textAligns;
exports.textInterpolations = textInterpolations;
exports.textStyles = textStyles;
/*  */
//# sourceMappingURL=text.js.map
