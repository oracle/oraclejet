/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

/**
 * A custom hook for handling uncontrolled properties. These are the properties for which
 * we need to maintain an internal state and also trigger certain callbacks whenever we
 * update the internal state.
 *
 * Examples:
 * 1. The `value` property in an uncontrolled InputText
 *
 * Here, we will have `value` property and a corresponding `onValueChanged` callback. When
 * one interacts with the component and updates the value on the UI, we need to update the
 * `value` prop accordingly. Being uncontrolled, we do not have to rely on the parent to push
 * back the value, so we maintain an internal state for it and update the internal state.
 * Even though we are maintaining an internal state, we still need to invoke the callback
 * so we do that when the new value is different from the current value.
 *
 * We use useUncontrolledState hook for getting this behavior like follows:
 * ```
 * const [uncontrolledValue, setUncontrolledValue] = useUncontrolledState(value, onValueChanged);
 * ```
 *
 * Whenever you want to change this value, you would simply do:
 * ```
 * // set the new value
 * setUncontrolledValue(newValue);
 * ```
 * This call automatically calls the `onValueChanged` callback for you when the new value is different.
 * Essentially, you might want to consider using this method if your property supports writeback. This
 * way, whenever we update the internal state, the onPropertyChanged will be invoked automatically with
 * the new value which would in turn writes back the new value on the prop.
 *
 * @param initialState The initial value for the internal state. Calling this hook again with a different
 *                     value for this argument will not update the internal state.
 * @param onStateChange The callback function that needs to be called whenever the state value is updated.
 * @returns A stateful value and a setter function to update it. Here the setter function identity
 *          is stable and won't change on re-renders (similar to useState's setter function)
 */
function useUncontrolledState(initialState, onStateChange) {
    // Internal state for storing the value
    const [stateValue, setStateValue] = hooks.useState(initialState);
    // Internal ref to store value. This is to know what the previous value was.
    const stateRef = hooks.useRef(stateValue);
    // In order to make the setter function returned by this hook stable, we need to remove
    // any external dependency from it. So, we use a ref that gets updated every render
    // to store the onStateChange callback function. This way we can refer to this function
    // without making it a dependency.
    const onStateChangeRef = hooks.useRef(onStateChange);
    onStateChangeRef.current = onStateChange;
    // A setter function for updating the state
    const setUncontrolledValue = hooks.useCallback((state, ...args) => {
        var _a;
        // update the internal state
        setStateValue(state);
        // Call the onChange callback only if the value is changed
        if (stateRef.current !== state) {
            (_a = onStateChangeRef.current) === null || _a === void 0 ? void 0 : _a.call(onStateChangeRef, state, ...args);
            stateRef.current = state;
        }
    }, []);
    // The setUncontrolledValue function returned here is guaranteed to
    // be the same.
    return [stateValue, setUncontrolledValue];
}

exports.useUncontrolledState = useUncontrolledState;
/*  */
//# sourceMappingURL=UNSAFE_useUncontrolledState.js.map
