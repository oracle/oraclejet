/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var hooks_UNSAFE_useBreakpoints = require('./UNSAFE_useBreakpoints.js');

/*
 * This custom hook returns the current breakpoints based on the width of a container, which is a DOM object.
 * The breakpoints are returned as a set of boolean values keyed to each breakpoint.
 *
 * TODO: Refactor to use a single ResizeObserver for better performance
 */
function useContainerBreakpoints(breakpoints = hooks_UNSAFE_useBreakpoints.defaultBreakpoints) {
    const [width, setWidth] = hooks.useState(0);
    const observedNodeRef = hooks.useRef(null);
    const resizeObserver = hooks.useMemo(() => new ResizeObserver((entries) => {
        for (let entry of entries) {
            setWidth(entry.contentRect.width);
        }
    }), []);
    const ref = hooks.useCallback((node) => {
        const observedNode = observedNodeRef.current;
        if (node != observedNode) {
            if (observedNode) {
                resizeObserver.unobserve(observedNode);
            }
            if (node) {
                resizeObserver.observe(node);
            }
            observedNodeRef.current = node;
        }
    }, []);
    const breakpointMatches = hooks.useMemo(() => {
        const matches = {};
        for (let k in breakpoints) {
            matches[k] = width >= parseInt(breakpoints[k]);
        }
        return matches;
    }, [width]);
    return { breakpointMatches, ref };
}

exports.useContainerBreakpoints = useContainerBreakpoints;
/*  */
//# sourceMappingURL=UNSAFE_useContainerBreakpoints.js.map
