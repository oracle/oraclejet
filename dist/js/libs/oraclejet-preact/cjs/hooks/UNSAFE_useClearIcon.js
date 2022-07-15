/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var hooks_UNSAFE_useToggle = require('./UNSAFE_useToggle.js');

/**
 * A custom hook that handles showing/hiding clear icon
 */
function useClearIcon({ clearIcon, display, hasValue, isEnabled = true, isFocused = false, isHover = false }) {
    const shouldRenderClearIcon = hooks.useCallback(() => isEnabled &&
        (display === 'always' || (display === 'conditionally' && hasValue && (isFocused || isHover))), [display, hasValue, isEnabled, isFocused, isHover]);
    const { bool, setFalse, setTrue } = hooks_UNSAFE_useToggle.useToggle(shouldRenderClearIcon());
    hooks.useEffect(() => {
        shouldRenderClearIcon() ? setTrue() : setFalse();
    }, [shouldRenderClearIcon]);
    return bool ? clearIcon : null;
}

exports.useClearIcon = useClearIcon;
/*  */
//# sourceMappingURL=UNSAFE_useClearIcon.js.map
