/* @oracle/oraclejet-preact: 13.1.0 */
import './flexitem.css';
import { k as keys_1 } from '../../keys-77d2b8e6.js';
import '../../_curry1-b6f34fc4.js';
import '../../_has-f370c697.js';

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
const alignSelfs = keys_1(alignSelfStyles);
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

export { alignSelfs, flexitemInterpolations, flexitemStyles };
/*  */
//# sourceMappingURL=flexitem.js.map
