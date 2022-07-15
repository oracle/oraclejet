/* @oracle/oraclejet-preact: 13.0.0 */
import './flexbox.css';
import { k as keys_1 } from '../../keys-cb973048.js';
import '../../_curry1-8b0d63fc.js';
import '../../_has-77a27fd6.js';

const directionStyles = {
  row: "rklb1n5",
  column: "c1l998vu"
};
const wrapStyles = {
  nowrap: "nphc8w3",
  wrap: "w1xnl1g6",
  reverse: "r8ires5",
  inherit: "ignq9s5",
  initial: "i1tzicbr"
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
