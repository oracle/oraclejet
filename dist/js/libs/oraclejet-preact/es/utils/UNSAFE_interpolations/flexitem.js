/* @oracle/oraclejet-preact: 13.0.0 */
import './flexitem.css';
import { k as keys_1 } from '../../keys-cb973048.js';
import '../../_curry1-8b0d63fc.js';
import '../../_has-77a27fd6.js';

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
