/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('identity-obj-proxy');
var keys = require('../../keys-4bd017bf.js');
var utils_UNSAFE_size = require('../UNSAFE_size.js');
var utils_UNSAFE_arrayUtils = require('../UNSAFE_arrayUtils.js');
require('../../_curry1-33165c71.js');
require('../../_has-2cbf94e8.js');
require('../UNSAFE_stringUtils.js');
require('../../stringUtils-bca189f8.js');

// align, and gap.

const alignStyles = {
  baseline: "b1hfcv8t",
  center: "coc1cbu",
  end: "e48xkrk",
  start: "skrlc38",
  inherit: "i13jv0tx",
  initial: "izwuuu1",
  stretch: "s12b86de"
};
const justifyStyles = {
  center: "cwbq0ib",
  end: "ei13mle",
  start: "s1bbko6s",
  inherit: "ipgkr5n",
  initial: "ihg9slo",
  around: "a4gorz7",
  between: "b14ouk2h",
  evenly: "eolmhjh"
};
const boxAlignmentInterpolations = {
  align: ({
    align
  }) => align === undefined ? {} : {
    class: alignStyles[align]
  },
  justify: ({
    justify
  }) => justify === undefined ? {} : {
    class: justifyStyles[justify]
  },
  // See https://developer.mozilla.org/en-US/docs/Web/CSS/gap
  gap: ({
    gap
  }) => {
    if (gap === undefined) {
      return {};
    } else {
      const [rowSize, columnSize = rowSize] = utils_UNSAFE_arrayUtils.coerceArray(gap);
      return {
        gap: `${utils_UNSAFE_size.sizeToCSS(rowSize)} ${utils_UNSAFE_size.sizeToCSS(columnSize)}`
      };
    }
  }
}; // These consts are exported so they can be used in stories to show the allowed options
// e.g., See Flex.stories.tsx:   align: {control: 'select',options: aligns}

const aligns = keys.keys_1(alignStyles);
const justifies = keys.keys_1(justifyStyles);

exports.aligns = aligns;
exports.boxAlignmentInterpolations = boxAlignmentInterpolations;
exports.justifies = justifies;
/*  */
//# sourceMappingURL=boxalignment.js.map
