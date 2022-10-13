/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');
var utils_UNSAFE_lengthFilter = require('../utils/UNSAFE_lengthFilter.js');

/**
 * A custom hook that applies the length filter to text field input
 * @param param0 The props for the useLengthFilter hook
 * @returns The filtered event handlers
 */
function useLengthFilter({ maxLength, maxLengthUnit, onCommit, onInput, value }) {
    const [isMaxLengthExceeded, setMaxLengthExceeded] = hooks.useState(false);
    const parse = hooks.useCallback((value) => utils_UNSAFE_lengthFilter.filter(value, maxLength, maxLengthUnit), [maxLength, maxLengthUnit]);
    // Reapply maxLength filter when the value is changed
    hooks.useEffect(() => {
        if (value === undefined) {
            return;
        }
        const filteredValue = parse(value);
        if (filteredValue !== value) {
            onInput === null || onInput === void 0 ? void 0 : onInput({ previousValue: value, value: filteredValue });
            onCommit === null || onCommit === void 0 ? void 0 : onCommit({ previousValue: value, value: filteredValue });
            // Value is filtered, means that the max length is exceeded
            setMaxLengthExceeded(true);
        }
        else {
            // Value is not filtered, means that the max length is not exceeded
            setMaxLengthExceeded(false);
        }
    }, [value, onCommit, onInput, parse]);
    const onFilteredInput = hooks.useCallback((...args) => {
        const { previousValue, value } = args[0];
        const filteredValue = parse(value !== null && value !== void 0 ? value : '');
        // Call the onInput event only when the value is changed
        if (previousValue !== filteredValue) {
            onInput === null || onInput === void 0 ? void 0 : onInput(Object.assign(Object.assign({}, args[0]), { value: filteredValue }));
            // value is not filtered, so the max length is not exceeded
            setMaxLengthExceeded(false);
        }
        else {
            // value is changed but then filtered to previous value
            // meaning that the max length was exceeded
            setMaxLengthExceeded(true);
        }
    }, [onInput, parse]);
    return {
        isMaxLengthExceeded,
        valueLength: value === undefined ? undefined : utils_UNSAFE_lengthFilter.calcLength(value, maxLengthUnit),
        onFilteredInput
    };
}

exports.useLengthFilter = useLengthFilter;
/*  */
//# sourceMappingURL=UNSAFE_useLengthFilter.js.map
