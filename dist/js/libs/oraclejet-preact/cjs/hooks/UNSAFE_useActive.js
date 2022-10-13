/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks_UNSAFE_useToggle = require('./UNSAFE_useToggle.js');
var hooks = require('preact/hooks');

/**
 * Indicates if primary mouse button is down
 * @param e
 * @returns
 */
const isPrimaryMouseButtonDown = (e) => {
    const flags = e.buttons !== undefined ? e.buttons : e.which;
    const primaryMouseButtonDown = (flags & 1) === 1;
    if (primaryMouseButtonDown) {
        return true;
    }
    return false;
};
/**
 * Returns properties to manage active state indication
 * @returns
 */
function useActive(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = hooks_UNSAFE_useToggle.useToggle(false);
    const wasActive = hooks.useRef(false);
    const mouseDownTarget = hooks.useCallback((e) => {
        if (isPrimaryMouseButtonDown(e)) {
            setTrue();
        }
    }, []);
    const leftTarget = hooks.useCallback((e) => {
        if (isPrimaryMouseButtonDown(e)) {
            wasActive.current = true;
        }
        setFalse();
    }, []);
    const enteredTarget = hooks.useCallback((e) => {
        if (wasActive.current) {
            if (isPrimaryMouseButtonDown(e)) {
                setTrue();
            }
            wasActive.current = false;
        }
    }, []);
    const activeProps = settings.isDisabled
        ? {}
        : {
            onMouseDown: mouseDownTarget,
            onMouseOut: leftTarget,
            onMouseEnter: enteredTarget,
            onMouseUp: setFalse,
            onTouchStart: setTrue,
            onTouchEnd: setFalse,
            onTouchCancel: setFalse
        };
    return {
        isActive: settings.isDisabled ? false : bool,
        activeProps: activeProps
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useActive = useActive;
/*  */
//# sourceMappingURL=UNSAFE_useActive.js.map
