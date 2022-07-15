/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('../tslib.es6-5c843188.js');
var hooks = require('preact/hooks');
require('./UNSAFE_useFocusWithin.js');
var useFocusWithin = require('../useFocusWithin-4642944b.js');

/**
 * A custom hook that handles the focus when the text field
 * is toggled between readonly and enabled
 * @typedef E represents the type of the enabled element
 * @typedef R represents the type of the readonly element
 */
function useFocusableTextField(_a) {
    var { isReadonly, ref = () => { } } = _a, useFocusWithinProps = tslib_es6.__rest(_a, ["isReadonly", "ref"]);
    const { focusProps, isFocused } = useFocusWithin.useFocusWithin(useFocusWithinProps);
    const previousIsFocusedRef = hooks.useRef(isFocused);
    const enabledElementRef = hooks.useRef(null);
    const readonlyElementRef = hooks.useRef(null);
    // Retain focus when toggling between readonly and enabled
    hooks.useEffect(() => {
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
    hooks.useEffect(() => {
        previousIsFocusedRef.current = isFocused;
    }, [isFocused]);
    // Add focus and blur methods
    hooks.useImperativeHandle(ref, () => ({
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

exports.useFocusableTextField = useFocusableTextField;
/*  */
//# sourceMappingURL=UNSAFE_useFocusableTextField.js.map
