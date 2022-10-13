/* @oracle/oraclejet-preact: 13.1.0 */
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

/**
 * Context which the parent component can use to provide various FormControl related
 * information
 */
const FormFieldContext = createContext({
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
    return useContext(FormFieldContext);
}

export { FormFieldContext, useFormFieldContext };
/*  */
//# sourceMappingURL=UNSAFE_useFormFieldContext.js.map
