/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_UNSAFE_arrayUtils = require('../UNSAFE_arrayUtils.js');
var utils_UNSAFE_size = require('../UNSAFE_size.js');
require('../UNSAFE_stringUtils.js');
require('../../stringUtils-b22cc214.js');

const paddingstartends = utils_UNSAFE_arrayUtils.stringLiteralArray([
    'paddingBlockStart',
    'paddingBlockEnd',
    'paddingInlineStart',
    'paddingInlineEnd'
]);
const paddingInterpolations = {
    padding: ({ padding }) => {
        if (padding === undefined) {
            return {};
        }
        else {
            const [topPadding, rightPadding = topPadding, bottomPadding = topPadding, leftPadding = rightPadding] = utils_UNSAFE_arrayUtils.coerceArray(padding);
            return {
                padding: `${utils_UNSAFE_size.sizeToCSS(topPadding)} ${utils_UNSAFE_size.sizeToCSS(rightPadding)} 
        ${utils_UNSAFE_size.sizeToCSS(bottomPadding)} ${utils_UNSAFE_size.sizeToCSS(leftPadding)}`
            };
        }
    },
    paddingBlockStart: ({ paddingBlockStart }) => paddingBlockStart === undefined
        ? {}
        : {
            paddingBlockStart: `${utils_UNSAFE_size.sizeToCSS(paddingBlockStart)}`
        },
    paddingBlockEnd: ({ paddingBlockEnd }) => paddingBlockEnd === undefined
        ? {}
        : {
            paddingBlockEnd: `${utils_UNSAFE_size.sizeToCSS(paddingBlockEnd)}`
        },
    paddingInlineStart: ({ paddingInlineStart }) => paddingInlineStart === undefined
        ? {}
        : {
            paddingInlineStart: `${utils_UNSAFE_size.sizeToCSS(paddingInlineStart)}`
        },
    paddingInlineEnd: ({ paddingInlineEnd }) => paddingInlineEnd === undefined
        ? {}
        : {
            paddingInlineEnd: `${utils_UNSAFE_size.sizeToCSS(paddingInlineEnd)}`
        }
};

exports.paddingInterpolations = paddingInterpolations;
/*  */
//# sourceMappingURL=padding.js.map
