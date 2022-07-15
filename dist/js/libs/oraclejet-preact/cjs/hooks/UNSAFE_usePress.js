/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

/**
 * Returns a click handler that can make a target element either clickable or keyboard pressable.
 * Note that some elements such as Button may generate a click event upon ENTER, so if this is applied to a button,
 * specify true to suppress duplicates to avoid two events.
 *
 * @param onPressHandler function
 * @param isSuppressDup boolean
 * @returns
 */
function usePress(onPressHandler, settings = { isDisabled: false, isSuppressDup: true }) {
    const onKeyDown = hooks.useCallback((event) => {
        if (event.key === ' ' || (!settings.isSuppressDup && event.key === 'Enter')) {
            event.preventDefault();
            onPressHandler(event);
        }
    }, [settings.isSuppressDup, onPressHandler]);
    const pressProps = settings.isDisabled ? {} : { onClick: onPressHandler, onKeyDown };
    return {
        pressProps
    };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.usePress = usePress;
/*  */
//# sourceMappingURL=UNSAFE_usePress.js.map
