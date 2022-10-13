/* @oracle/oraclejet-preact: 13.1.0 */
import './flexbox.css';
import { k as keys_1 } from '../../keys-77d2b8e6.js';
import '../../_curry1-b6f34fc4.js';
import '../../_has-f370c697.js';

const directionStyles = {
  row: "_6pi910",
  column: "_fl77vc"
};
const wrapStyles = {
  nowrap: "_wlm76g",
  wrap: "k5phjz",
  reverse: "_efubwl",
  inherit: "_7itfo3",
  initial: "hztuvz"
};
const flexboxStyles = {
  direction: directionStyles,
  wrap: wrapStyles
};
const directions = keys_1(directionStyles);
const wraps = keys_1(wrapStyles);
const flexboxInterpolations = {
  direction: ({
    direction
  }) => direction === undefined ? {} : {
    class: directionStyles[direction]
  },
  wrap: ({
    wrap
  }) => wrap === undefined ? {} : {
    class: wrapStyles[wrap]
  }
};

export { directions, flexboxInterpolations, flexboxStyles, wraps };
/*  */
//# sourceMappingURL=flexbox.js.map
