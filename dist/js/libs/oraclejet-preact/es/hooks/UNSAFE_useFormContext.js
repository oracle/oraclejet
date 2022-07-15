/* @oracle/oraclejet-preact: 13.0.0 */
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';

const DefaultFormContext = {
    isDisabled: false,
    isFormLayout: false,
    isReadonly: false,
    labelEdge: 'inside',
    labelStartWidth: '33%',
    labelWrapping: 'wrap',
    textAlign: 'start',
    userAssistanceDensity: 'reflow'
};
/**
 * Context which the parent component can use to provide various FormLayout related
 * information to descendant form controls.
 */
const FormContext = createContext(DefaultFormContext);

/**
 * Utility hook for consuming the FormContext
 *
 * @returns The value of closest FormContext provider
 */
function useFormContext() {
    const context = useContext(FormContext);
    // merge the returned context into the default context so that all props are specified
    const contextWithDefaults = Object.assign({}, DefaultFormContext, context);
    return contextWithDefaults;
}

export { FormContext, useFormContext };
/*  */
//# sourceMappingURL=UNSAFE_useFormContext.js.map
