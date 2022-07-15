/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';


var keys = require('./keys-4bd017bf.js');

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
const directions = keys.keys_1(directionStyles);
const wraps = keys.keys_1(wrapStyles);
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

exports.directions = directions;
exports.flexboxInterpolations = flexboxInterpolations;
exports.flexboxStyles = flexboxStyles;
exports.wraps = wraps;
/*  */
//# sourceMappingURL=flexbox-c4644897.js.map
