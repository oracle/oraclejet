/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from '../tslib.es6-deee4931.js';
import { useRef, useEffect, useImperativeHandle } from 'preact/hooks';
import { useFocusWithin } from './UNSAFE_useFocusWithin.js';

/**
 * A custom hook that handles the focus when the text field
 * is toggled between readonly and enabled
 * @typedef E represents the type of the enabled element
 * @typedef R represents the type of the readonly element
 */
function useFocusableTextField(_a) {
    var { isReadonly, ref = () => { } } = _a, useFocusWithinProps = __rest(_a, ["isReadonly", "ref"]);
    const { focusProps, isFocused } = useFocusWithin(useFocusWithinProps);
    const previousIsFocusedRef = useRef(isFocused);
    const enabledElementRef = useRef(null);
    const readonlyElementRef = useRef(null);
    // Retain focus when toggling between readonly and enabled
    useEffect(() => {
        // if the readonly state is changed and previously we
        // were holding focus, set the focus to newly rendered element
        if (previousIsFocusedRef.current) {
            if (isReadonly) {
                setTimeout(() => { var _a; return (_a = readonlyElementRef.current) === null || _a === void 0 ? void 0 : _a.focus(); });
            }
            else {
                setTimeout(() => { var _a; return (_a = enabledElementRef.current) === null || _a === void 0 ? void 0 : _a.focus(); });
            }
        }
    }, [isReadonly]);
    // Keep the previousFocusRef in sync, but be sure to run this hook
    // after handling focus for the readonly toggling.
    useEffect(() => {
        previousIsFocusedRef.current = isFocused;
    }, [isFocused]);
    // Add focus and blur methods
    useImperativeHandle(ref, () => ({
        focus: () => {
            var _a, _b;
            if (isReadonly) {
                (_a = readonlyElementRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                (_b = enabledElementRef.current) === null || _b === void 0 ? void 0 : _b.focus();
            }
        },
        blur: () => {
            var _a, _b;
            if (isReadonly) {
                (_a = readonlyElementRef.current) === null || _a === void 0 ? void 0 : _a.blur();
            }
            else {
                (_b = enabledElementRef.current) === null || _b === void 0 ? void 0 : _b.blur();
            }
        }
    }), [isReadonly]);
    return {
        enabledElementRef,
        readonlyElementRef,
        isFocused,
        focusProps
    };
}

export { useFocusableTextField };
/*  */
//# sourceMappingURL=UNSAFE_useFocusableTextField.js.map
