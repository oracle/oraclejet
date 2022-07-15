/* @oracle/oraclejet-preact: 13.0.0 */
import { useCallback, useEffect } from 'preact/hooks';
import { useToggle } from './UNSAFE_useToggle.js';

/**
 * A custom hook that handles showing/hiding clear icon
 */
function useClearIcon({ clearIcon, display, hasValue, isEnabled = true, isFocused = false, isHover = false }) {
    const shouldRenderClearIcon = useCallback(() => isEnabled &&
        (display === 'always' || (display === 'conditionally' && hasValue && (isFocused || isHover))), [display, hasValue, isEnabled, isFocused, isHover]);
    const { bool, setFalse, setTrue } = useToggle(shouldRenderClearIcon());
    useEffect(() => {
        shouldRenderClearIcon() ? setTrue() : setFalse();
    }, [shouldRenderClearIcon]);
    return bool ? clearIcon : null;
}

export { useClearIcon };
/*  */
//# sourceMappingURL=UNSAFE_useClearIcon.js.map
