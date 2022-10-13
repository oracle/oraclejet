/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const ariaInterpolations = {
    ariaLabel: ({ ariaLabel }) => ariaLabel === undefined
        ? {}
        : {
            ariaLabel
        },
    labelledBy: ({ labelledBy }) => labelledBy === undefined
        ? {}
        : {
            ariaLabelledBy: labelledBy
        }
};

exports.ariaInterpolations = ariaInterpolations;
/*  */
//# sourceMappingURL=aria.js.map
