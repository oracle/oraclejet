/* @oracle/oraclejet-preact: 13.0.0 */
import { useState, useMemo } from 'preact/hooks';

/**
 * useToggle is a state toggle hook
 *
 * @param defaultValue
 * @returns
 */
function useToggle(defaultValue = false) {
    const [bool, setBool] = useState(defaultValue);
    const toggleHandlers = useMemo(() => {
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

export { useToggle };
/*  */
//# sourceMappingURL=UNSAFE_useToggle.js.map
