/* @oracle/oraclejet-preact: 13.0.0 */
import { useRef, useCallback } from 'preact/hooks';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Returns event handlers that can make a target element tapable.
 * useTap is used for non-keyboard elements.
 *
 * @param onTap function
 * @param settings object
 * @returns
 */
function useTap(onTap, { isDisabled } = { isDisabled: false }) {
    const ref = useRef({
        pointerDownId: null,
        startTime: 0
    });
    const onPointerDown = useCallback((e) => {
        // return if it is not a left click
        if (e.pointerType === 'mouse' && e.button !== 0) {
            return;
        }
        if (!ref.current.pointerDownId) {
            ref.current = { pointerDownId: e.pointerId, startTime: e.timeStamp };
        }
        else {
            clearTap();
        }
    }, []);
    const onPointerUp = useCallback((e) => {
        if (e.pointerId === ref.current.pointerDownId) {
            const tapTime = e.timeStamp - ref.current.startTime;
            // 250ms maximum tap time based on numbers used in Hammer
            if (tapTime <= 250) {
                onTap({ x: e.offsetX, y: e.offsetY });
            }
        }
        clearTap();
    }, [onTap]);
    const clearTap = useCallback(() => {
        ref.current = { pointerDownId: null, startTime: 0 };
    }, []);
    const tapProps = isDisabled
        ? {}
        : {
            onPointerDown,
            onPointerUp,
            onPointerLeave: clearTap,
            onPointerCancel: clearTap
        };
    return {
        tapProps
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { useTap };
/*  */
//# sourceMappingURL=UNSAFE_useTap.js.map
