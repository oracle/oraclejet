/* @oracle/oraclejet-preact: 13.0.0 */
import { useRef, useReducer, useCallback } from 'preact/hooks';
import { getClientHints } from '../utils/PRIVATE_clientHints.js';

function useTextFieldInputHandlers({ value, onInput, onCommit, onKeyDown }) {
    const isComposing = useRef(false);
    // It is difficult to determine the previous value because, we will get a new value prop when
    // user types and also when it is updated programmatically. It cannot be differentiated without an
    // internal state. And we only need to trigger an onCommit for user interacted changes.
    // So, we maintain two refs here one gets updated on input and another one gets updated on commit.
    const previousCommitValue = useRef(value);
    const previousInputValue = useRef(value);
    // When we get a value this is different from previousInputValue, this means the value is updated
    // programmatically and we need to update the commit value as well.
    if (value !== previousInputValue.current) {
        previousCommitValue.current = value;
    }
    // preactjs/preact #1899 - https://github.com/preactjs/preact/issues/1899
    // Preact does not force the native input to be controlled, so we need to
    // trigger a rerender in order to keep it fully controlled.
    // Force update hack is from https://reactjs.org/docs/hooks-faq.html#is-there-something-like-forceupdate
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    // TODO: Currently, this assumes that the input field is a text field
    // so that the change event can be simulated by capturing blur and enter keydown
    // event. We might have to make this generic to handle other input types
    // as well like radio, select, checkbox.
    const handleChange = useCallback((event) => {
        const currentValue = event.target.value;
        if (previousCommitValue.current !== currentValue) {
            onCommit === null || onCommit === void 0 ? void 0 : onCommit({ previousValue: previousCommitValue.current, value: currentValue });
            previousCommitValue.current = currentValue;
        }
    }, [onCommit]);
    const handleKeyDown = useCallback((event) => {
        onKeyDown === null || onKeyDown === void 0 ? void 0 : onKeyDown(event);
        if (event.key === 'Enter') {
            handleChange(event);
        }
    }, [handleChange, onKeyDown]);
    const handleCompositionStart = useCallback(() => {
        isComposing.current = true;
    }, []);
    const handleCompositionEnd = useCallback(() => {
        isComposing.current = false;
    }, []);
    const handleInput = useCallback((event) => {
        // In android device we need to update input value even for composition events
        // See JET-39086 for more details.
        if (!isComposing.current || getClientHints().platform === 'android') {
            const newValue = event.target.value;
            // update the internal ref to the new value
            previousInputValue.current = newValue;
            onInput === null || onInput === void 0 ? void 0 : onInput({ previousValue: value, value: newValue });
            // preactjs/preact #1899 - https://github.com/preactjs/preact/issues/1899
            // Preact does not force the native input to be controlled, so we need to
            // trigger a rerender in order to keep it fully controlled.
            // Force a rerender here, so if the value was not pushed back, the input
            // will be reset to the old value mimicking a controlled input.
            // One minor issue here is that the cursor position will also be reverted
            // back to the end due to the forced value update. But this behavior should
            // be fine as it happens in our oj-input-text as well.
            forceUpdate(null);
        }
    }, [value, onInput]);
    return {
        // With preact/compat, we will not have an onChange event.
        // "If you're using preact/compat, most onChange events are internally converted to onInput
        // to emulate React's behavior. This is one of the tricks we use to ensure maximum
        // compatibility with the React ecosystem."
        // Since we need the onChange event, we will be simulating this to match the native event
        // as best as we can. To do this, we will be capturing `blur` event and Enter `keydown` event.
        // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
        onBlur: handleChange,
        onKeyDown: handleKeyDown,
        // Since, preact does not support onCompositionStart and onCompositionEnd events
        // we need to use all lowercase event name to use the native DOM events. Also,
        // currently we do not have any need for the event object in these two handlers
        // so ignored the arguments here.
        oncompositionstart: handleCompositionStart,
        oncompositionend: handleCompositionEnd,
        onInput: handleInput
    };
}

export { useTextFieldInputHandlers };
/*  */
//# sourceMappingURL=UNSAFE_useTextFieldInputHandlers.js.map
