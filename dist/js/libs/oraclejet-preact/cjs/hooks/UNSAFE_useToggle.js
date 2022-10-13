/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

/**
 * useToggle is a state toggle hook
 *
 * @param defaultValue
 * @returns
 */
function useToggle(defaultValue = false) {
    const [bool, setBool] = hooks.useState(defaultValue);
    const toggleHandlers = hooks.useMemo(() => {
        return {
            toggle: () => setBool((x) => !x),
            setTrue: () => setBool(true),
            setFalse: () => setBool(false)
        };
    }, []);
    return Object.assign({ bool }, toggleHandlers);
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useToggle = useToggle;
/*  */
//# sourceMappingURL=UNSAFE_useToggle.js.map
