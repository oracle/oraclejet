/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';


var keys = require('./keys-0a611b24.js');

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
//# sourceMappingURL=flexbox-3d991801.js.map
