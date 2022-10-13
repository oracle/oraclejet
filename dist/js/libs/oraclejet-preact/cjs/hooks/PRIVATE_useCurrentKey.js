/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var utils_UNSAFE_keys = require('../utils/UNSAFE_keys.js');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Hook for handling current key update due to user interaction including keyboard navigation.
 * This can be reuse by all Collection components.
 *
 * @param keyExtractor function to extract the key based on event that trigger the current change.
 * @param getPrevKey function to get the previous key based on the current key
 * @param getNextKey function to get the next key based on the current key
 * @param currentKey the current key
 * @param onCurrentChange function to invoke if the current key has changed
 * @returns
 */
function useCurrentKey(keyExtractor, getPrevKey, getNextKey, currentKey, onChange) {
    const onKeyDown = hooks.useCallback((event) => {
        if (onChange && utils_UNSAFE_keys.isKeyDefined(currentKey)) {
            // TODO: support horizontal layout (left/right arrow key)
            if (event.key === 'ArrowDown' && !event.shiftKey) {
                const nextKey = getNextKey();
                if (utils_UNSAFE_keys.isKeyDefined(nextKey) && currentKey != nextKey) {
                    onChange({ value: nextKey });
                }
                event.preventDefault();
            }
            else if (event.key === 'ArrowUp' && !event.shiftKey) {
                const prevKey = getPrevKey();
                if (utils_UNSAFE_keys.isKeyDefined(prevKey) && currentKey != prevKey) {
                    onChange({ value: prevKey });
                }
                event.preventDefault();
            }
        }
    }, [currentKey, getNextKey, getPrevKey, onChange]);
    const onClick = hooks.useCallback((event) => {
        if (onChange && !event.shiftKey) {
            const nextKey = keyExtractor(event);
            if (utils_UNSAFE_keys.isKeyDefined(nextKey) && currentKey != nextKey) {
                onChange({ value: nextKey });
            }
        }
    }, [currentKey, keyExtractor, onChange]);
    const currentKeyProps = onChange == null ? {} : { onClick, onKeyDown };
    return { currentKeyProps };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useCurrentKey = useCurrentKey;
/*  */
//# sourceMappingURL=PRIVATE_useCurrentKey.js.map
