/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hooks = require('preact/hooks');

const currentValueReducer = (state, { type, payload }) => {
    switch (type) {
        case 'input':
            return Object.assign(Object.assign({}, state), { currentInputValue: payload });
        case 'commit':
            return Object.assign(Object.assign({}, state), { currentCommitValue: payload, currentInputValue: payload });
        default:
            throw new Error(`Unknown action type: ${type}`);
    }
};
/**
 * This hook takes an Object with a value, and returns currentCommitValue and dispatch.
 *
 * Whenever you call onInput, call dispatch({ type: 'input', payload: value });
 * For example:
 * dispatch({ type: 'input', payload: detail.value });
 * onInput?.(detail);
 * And similarly whenever you call onCommit, call dispatch({ type: 'commit', payload: value });
 *
 * The state is used to determine if the component's value property was programmatically
 * changed or just changed from an onInput listener to update the value back
 * to what the user typed in which is required for a controlled component.
 *
 * @param param0 The props for the useCurrentValueReducer hook
 * @returns
 */
function useCurrentValueReducer({ value }) {
    const [state, dispatch] = hooks.useReducer(currentValueReducer, {
        currentInputValue: value,
        currentCommitValue: value
    });
    hooks.useEffect(() => {
        // If the value is different than the currentInputValue, that means
        // the value was programmatically changed. state.currentInputValue gets
        // updated on every keystroke (onInput).
        const programmaticallyChanged = value !== state.currentInputValue;
        if (programmaticallyChanged) {
            // dispatch type commit synces up the currentCommitValue and the currentInputValue.
            // We don't want to call the user's
            // onCommit for the case where the value is programmatically changed, so we sync the
            // input/commit states every time onCommit is called and also here.
            // For more details, see useTextFieldInputHandler#onChange
            dispatch({ type: 'commit', payload: value });
        }
    }, [value, state.currentInputValue]);
    return {
        currentCommitValue: state.currentCommitValue,
        dispatch
    };
}

exports.useCurrentValueReducer = useCurrentValueReducer;
/*  */
//# sourceMappingURL=UNSAFE_useCurrentValueReducer.js.map
