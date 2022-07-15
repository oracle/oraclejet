/* @oracle/oraclejet-preact: 13.0.0 */
import { useState, useRef, useMemo, useCallback } from 'preact/hooks';
import { defaultBreakpoints } from './UNSAFE_useBreakpoints.js';

/*
 * This custom hook returns the current breakpoints based on the width of a container, which is a DOM object.
 * The breakpoints are returned as a set of boolean values keyed to each breakpoint.
 *
 * TODO: Refactor to use a single ResizeObserver for better performance
 */
function useContainerBreakpoints(breakpoints = defaultBreakpoints) {
    const [width, setWidth] = useState(0);
    const observedNodeRef = useRef(null);
    const resizeObserver = useMemo(() => new ResizeObserver((entries) => {
        for (let entry of entries) {
            setWidth(entry.contentRect.width);
        }
    }), []);
    const ref = useCallback((node) => {
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
    const breakpointMatches = useMemo(() => {
        const matches = {};
        for (let k in breakpoints) {
            matches[k] = width >= parseInt(breakpoints[k]);
        }
        return matches;
    }, [width]);
    return { breakpointMatches, ref };
}

export { useContainerBreakpoints };
/*  */
//# sourceMappingURL=UNSAFE_useContainerBreakpoints.js.map
