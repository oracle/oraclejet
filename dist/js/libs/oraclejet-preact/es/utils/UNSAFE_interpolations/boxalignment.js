/* @oracle/oraclejet-preact: 13.1.0 */
import './boxalignment.css';
import { k as keys_1 } from '../../keys-77d2b8e6.js';
import { sizeToCSS } from '../UNSAFE_size.js';
import { coerceArray } from '../UNSAFE_arrayUtils.js';
import '../../_curry1-b6f34fc4.js';
import '../../_has-f370c697.js';
import '../UNSAFE_stringUtils.js';

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
