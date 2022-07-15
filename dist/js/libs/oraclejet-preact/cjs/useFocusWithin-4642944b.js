/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var hooks = require('preact/hooks');

function useFocusWithin({ isDisabled, onBlurWithin, onFocusWithin } = {}) {
    const [isFocused, setIsFocused] = hooks.useState(false);
    const onfocusin = hooks.useCallback((event) => {
        if (!isFocused) {
            onFocusWithin === null || onFocusWithin === void 0 ? void 0 : onFocusWithin(event);
            setIsFocused(true);
        }
    }, [onFocusWithin, isFocused]);
    const onfocusout = hooks.useCallback((event) => {
        // Trigger focus event changes only when the focus goes outside of the current
        // target. Ignore focus changes within the current target
        if (isFocused &&
            (event.relatedTarget == null ||
                !event.currentTarget.contains(event.relatedTarget))) {
            onBlurWithin === null || onBlurWithin === void 0 ? void 0 : onBlurWithin(event);
            setIsFocused(false);
        }
    }, [onBlurWithin, isFocused]);
    return isDisabled
        ? {
            isFocused: false,
            focusProps: {}
        }
        : {
            isFocused,
            focusProps: {
                onfocusin,
                onfocusout
            }
        };
}

exports.useFocusWithin = useFocusWithin;
/*  */
//# sourceMappingURL=useFocusWithin-4642944b.js.map
