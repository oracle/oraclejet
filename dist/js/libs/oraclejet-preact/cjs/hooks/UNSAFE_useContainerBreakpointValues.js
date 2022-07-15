/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks_UNSAFE_useContainerBreakpoints = require('./UNSAFE_useContainerBreakpoints.js');
var hooks_UNSAFE_useBreakpoints = require('./UNSAFE_useBreakpoints.js');
require('preact/hooks');

/*
 * Custom hook to allow the user to define custom values that are returned if a breakpoint is reached.
 * The Responsive object is a set of one or more key/value pairs, with each breakpoint as a key.
 */
function useContainerBreakpointValues(breakpointValues, breakpoints = hooks_UNSAFE_useBreakpoints.defaultBreakpoints) {
    const { breakpointMatches, ref } = hooks_UNSAFE_useContainerBreakpoints.useContainerBreakpoints(breakpoints);
    const result = Object.entries(breakpointValues).reduce((p, c) => {
        const key = c[0]; // first entry in breakpoint values is the key
        return breakpointMatches[key] ? c : p; // if current breakpoint is true, return it, else stay with previous
    });
    const breakpoint = result[1]; // second entry in breakpoint values is the value
    return { breakpoint, ref };
}

exports.useContainerBreakpointValues = useContainerBreakpointValues;
/*  */
//# sourceMappingURL=UNSAFE_useContainerBreakpointValues.js.map
