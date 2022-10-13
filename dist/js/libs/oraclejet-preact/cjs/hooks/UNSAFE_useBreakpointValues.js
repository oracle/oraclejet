/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks_UNSAFE_useBreakpoints = require('./UNSAFE_useBreakpoints.js');
require('preact/hooks');

/*
 * Custom hook to allow the user to define custom values that are returned if a breakpoint is reached.
 * The Responsive object is a set of one or more key/value pairs, with each breakpoint as a key.
 *
 * TODO: Fix breakpoint value Type:
 *  The second arg allows arbitrary breakpoints to be specified, but the first arg only allows values for "sm", "md", "lg" and "xl"; if we allow custom breakpoints to be specified via the second arg, the first arg needs to allow values for those same custom breakpoints to be passed in.
 */
function useBreakpointValues(breakpointValues, breakpoints = hooks_UNSAFE_useBreakpoints.defaultBreakpoints) {
    const current = hooks_UNSAFE_useBreakpoints.useBreakpoints(breakpoints);
    const breakpoint = Object.entries(breakpointValues).reduce((p, c) => {
        const key = c[0]; // first entry in breakpoint values is the key
        return current[key] ? c : p; // if current breakpoint is true, return it, else stay with previous
    });
    return breakpoint[1]; // second entry in breakpoint values is the value
}

exports.useBreakpointValues = useBreakpointValues;
/*  */
//# sourceMappingURL=UNSAFE_useBreakpointValues.js.map
