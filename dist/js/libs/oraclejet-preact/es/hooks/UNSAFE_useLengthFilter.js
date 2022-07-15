/* @oracle/oraclejet-preact: 13.0.0 */
import { useState, useCallback, useEffect } from 'preact/hooks';
import { filter, calcLength } from '../utils/UNSAFE_lengthFilter.js';

/**
 * A custom hook that applies the length filter to text field input
 * @param param0 The props for the useLengthFilter hook
 * @returns The filtered event handlers
 */
function useLengthFilter({ maxLength, maxLengthUnit, onCommit, onInput, value }) {
    const [isMaxLengthExceeded, setMaxLengthExceeded] = useState(false);
    const parse = useCallback((value) => filter(value, maxLength, maxLengthUnit), [maxLength, maxLengthUnit]);
    // Reapply maxLength filter when the value is changed
    useEffect(() => {
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
    const onFilteredInput = useCallback((...args) => {
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
        valueLength: value === undefined ? undefined : calcLength(value, maxLengthUnit),
        onFilteredInput
    };
}

export { useLengthFilter };
/*  */
//# sourceMappingURL=UNSAFE_useLengthFilter.js.map
