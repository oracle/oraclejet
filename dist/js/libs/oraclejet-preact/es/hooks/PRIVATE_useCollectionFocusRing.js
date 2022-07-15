/* @oracle/oraclejet-preact: 13.0.0 */
import { useState, useRef, useCallback } from 'preact/hooks';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Hook for handling focus ring management in Collection components.
 *
 * @param contains function that returns true if the Collection contains the specified element.
 * @param navigationKeys set of keys that are considered as navigation keys for Collection.
 * @returns
 */
function useCollectionFocusRing(contains, navigationKeys) {
    const [focusRingVisible, setFocusRingVisible] = useState(false);
    const recentPointer = useRef(false);
    const onFocus = useCallback((event) => {
        if (event.relatedTarget == null || !contains(event.relatedTarget)) {
            if (!focusRingVisible && recentPointer.current === false) {
                setFocusRingVisible(true);
            }
        }
    }, [focusRingVisible]);
    const onBlur = useCallback((event) => {
        setTimeout(() => {
            if ((event.relatedTarget == null || !contains(document.activeElement)) &&
                focusRingVisible) {
                // remove focus ring
                setFocusRingVisible(false);
            }
        }, FOCUS_SHIFT_TIMEOUT);
    }, [focusRingVisible]);
    const onPointerDown = useCallback(() => {
        if (focusRingVisible) {
            setFocusRingVisible(false);
        }
        recentPointer.current = true;
        setTimeout(() => {
            recentPointer.current = false;
        }, FOCUS_SHIFT_TIMEOUT);
    }, [focusRingVisible]);
    const onKeyDown = useCallback((event) => {
        if (navigationKeys.indexOf(event.key) > -1) {
            if (!focusRingVisible) {
                setFocusRingVisible(true);
            }
        }
    }, [focusRingVisible]);
    const focusRingProps = { onFocus, onBlur, onPointerDown, onKeyDown };
    return [focusRingVisible, focusRingProps];
}
const FOCUS_SHIFT_TIMEOUT = 100;

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { useCollectionFocusRing };
/*  */
//# sourceMappingURL=PRIVATE_useCollectionFocusRing.js.map
