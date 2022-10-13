/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

/*
 * TODO: These default breakpoints are temporary (will be set by Provider in the future)
 *
 * This object defines default breakpoints for screens and containers.
 */
const defaultBreakpoints = {
    sm: '0px',
    md: '600px',
    lg: '1024px',
    xl: '1440px'
};
/*
 * Simple custom hook which returns the current breakpoints based on viewport width.
 * The breakpoints are returned as an object that is a set of boolean values keyed to each breakpoint.
 * The window/viewport min-width is matched against a range of pixel values defined as the breakpoints.
 *
 * TODO: Investigate useBreakpoints scalability if a component that uses useBreakpoints ends up being stamped out in some collection component (JET-49558)
 *
 * TODO: Parameterize this hook type such that we enable type checking on the returned record key; introduce a type parameter that corresponds to the Record key type
 */
function useBreakpoints(breakpoints = defaultBreakpoints) {
    // this handler will return current breakpoints as a single object we can watch, rather than looping through each breakpoint key
    const queryMatches = () => {
        const currentMatches = {};
        Object.entries(breakpoints).forEach(([key, value]) => {
            currentMatches[key] = window.matchMedia(`(min-width: ${value})`).matches;
        });
        return currentMatches;
    };
    const [matches, setMatches] = hooks.useState(() => queryMatches());
    hooks.useEffect(() => {
        const onResize = () => {
            setMatches(queryMatches());
        };
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return matches;
}

exports.defaultBreakpoints = defaultBreakpoints;
exports.useBreakpoints = useBreakpoints;
/*  */
//# sourceMappingURL=UNSAFE_useBreakpoints.js.map
