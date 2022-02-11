import { createRef } from 'preact';
import { useMemo } from 'preact/hooks';

/**
 * Creates an array of refs that can be mutated
 * @param length The number of refs needed. When updated, a new set of refs will be created
 * @returns An Array of refs
 */
function useMutableRefArray(length = 0) {
    return useMemo(() => new Array(length).fill(undefined).map(() => createRef()), [length]);
}

export { useMutableRefArray };
