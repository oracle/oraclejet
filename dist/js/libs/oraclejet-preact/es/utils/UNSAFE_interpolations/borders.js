/* @oracle/oraclejet-preact: 13.1.0 */
const borderInterpolations = {
    border: ({ border }) => border === undefined
        ? {}
        : {
            border
        },
    borderBlockStart: ({ borderBlockStart }) => borderBlockStart === undefined
        ? {}
        : {
            borderBlockStart
        },
    borderBlockEnd: ({ borderBlockEnd }) => borderBlockEnd === undefined
        ? {}
        : {
            borderBlockEnd
        },
    borderInlineStart: ({ borderInlineStart }) => borderInlineStart === undefined
        ? {}
        : {
            borderInlineStart
        },
    borderInlineEnd: ({ borderInlineEnd }) => borderInlineEnd === undefined
        ? {}
        : {
            borderInlineEnd
        },
    borderRadius: ({ borderRadius }) => borderRadius === undefined
        ? {}
        : {
            borderRadius
        }
};

export { borderInterpolations };
/*  */
//# sourceMappingURL=borders.js.map
