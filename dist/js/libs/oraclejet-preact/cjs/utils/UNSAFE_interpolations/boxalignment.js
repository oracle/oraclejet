/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('identity-obj-proxy');
var keys = require('../../keys-0a611b24.js');
var utils_UNSAFE_size = require('../UNSAFE_size.js');
var utils_UNSAFE_arrayUtils = require('../UNSAFE_arrayUtils.js');
require('../../_curry1-94f22a19.js');
require('../../_has-556488e4.js');
require('../UNSAFE_stringUtils.js');
require('../../stringUtils-b22cc214.js');

// align, and gap.

const alignStyles = {
  baseline: "klvue0",
  center: "_v1pufi",
  end: "szsgpl",
  start: "_x69i5n",
  inherit: "_u6mp9r",
  initial: "rrxsr6",
  stretch: "_kkrwzj"
};
const justifyStyles = {
  center: "ataoye",
  end: "_awwr4",
  start: "_xgdc22",
  inherit: "_t1r35v",
  initial: "byxkkh",
  around: "_lk9m3",
  between: "_3ui4p2",
  evenly: "y2mpjt"
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
