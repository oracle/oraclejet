/* @oracle/oraclejet-preact: 13.1.0 */
import { stringLiteralArray, coerceArray } from '../UNSAFE_arrayUtils.js';
import { sizeToCSS } from '../UNSAFE_size.js';
import '../UNSAFE_stringUtils.js';

const paddingstartends = stringLiteralArray([
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
            const [topPadding, rightPadding = topPadding, bottomPadding = topPadding, leftPadding = rightPadding] = coerceArray(padding);
            return {
                padding: `${sizeToCSS(topPadding)} ${sizeToCSS(rightPadding)} 
        ${sizeToCSS(bottomPadding)} ${sizeToCSS(leftPadding)}`
            };
        }
    },
    paddingBlockStart: ({ paddingBlockStart }) => paddingBlockStart === undefined
        ? {}
        : {
            paddingBlockStart: `${sizeToCSS(paddingBlockStart)}`
        },
    paddingBlockEnd: ({ paddingBlockEnd }) => paddingBlockEnd === undefined
        ? {}
        : {
            paddingBlockEnd: `${sizeToCSS(paddingBlockEnd)}`
        },
    paddingInlineStart: ({ paddingInlineStart }) => paddingInlineStart === undefined
        ? {}
        : {
            paddingInlineStart: `${sizeToCSS(paddingInlineStart)}`
        },
    paddingInlineEnd: ({ paddingInlineEnd }) => paddingInlineEnd === undefined
        ? {}
        : {
            paddingInlineEnd: `${sizeToCSS(paddingInlineEnd)}`
        }
};

export { paddingInterpolations };
/*  */
//# sourceMappingURL=padding.js.map
