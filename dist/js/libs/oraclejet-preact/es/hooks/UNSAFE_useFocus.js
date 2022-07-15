/* @oracle/oraclejet-preact: 13.0.0 */
import { useToggle } from './UNSAFE_useToggle.js';
import 'preact/hooks';

/**
 * Get status on whether target has focus or not
 * @returns
 */
function useFocus(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = useToggle(false);
    const focusProps = settings.isDisabled
        ? {}
        : {
            onFocus: setTrue,
            onBlur: setFalse
        };
    return {
        isFocus: settings.isDisabled ? false : bool,
        focusProps: focusProps
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { useFocus };
/*  */
//# sourceMappingURL=UNSAFE_useFocus.js.map
