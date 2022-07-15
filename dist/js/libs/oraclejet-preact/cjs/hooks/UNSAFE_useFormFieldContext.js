/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var preact = require('preact');
var hooks = require('preact/hooks');

/**
 * Context which the parent component can use to provide various FormControl related
 * information
 */
const FormFieldContext = preact.createContext({
    hasValue: false,
    isDisabled: false,
    isFocused: false,
    isLoading: false,
    isReadonly: false
});

/**
 * Utility hook for consuming the FormFieldContext
 *
 * @returns The value of closest FormControl provider
 */
function useFormFieldContext() {
    return hooks.useContext(FormFieldContext);
}

exports.FormFieldContext = FormFieldContext;
exports.useFormFieldContext = useFormFieldContext;
/*  */
//# sourceMappingURL=UNSAFE_useFormFieldContext.js.map
