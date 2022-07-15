/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('identity-obj-proxy');
var keys = require('../../keys-4bd017bf.js');
require('../../_curry1-33165c71.js');
require('../../_has-2cbf94e8.js');

const textAlignStyles = {
  start: "so5vivr",
  end: "exraja",
  right: "rnoefqf"
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
