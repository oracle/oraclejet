/* @oracle/oraclejet-preact: 13.0.0 */
import './boxalignment.css';
import { k as keys_1 } from '../../keys-cb973048.js';
import { sizeToCSS } from '../UNSAFE_size.js';
import { coerceArray } from '../UNSAFE_arrayUtils.js';
import '../../_curry1-8b0d63fc.js';
import '../../_has-77a27fd6.js';
import '../UNSAFE_stringUtils.js';

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
      const [rowSize, columnSize = rowSize] = coerceArray(gap);
      return {
        gap: `${sizeToCSS(rowSize)} ${sizeToCSS(columnSize)}`
      };
    }
  }
}; // These consts are exported so they can be used in stories to show the allowed options
// e.g., See Flex.stories.tsx:   align: {control: 'select',options: aligns}

const aligns = keys_1(alignStyles);
const justifies = keys_1(justifyStyles);

export { aligns, boxAlignmentInterpolations, justifies };
/*  */
//# sourceMappingURL=boxalignment.js.map
