/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var preact = require('preact');
var hooks = require('preact/hooks');

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
const FormContext = preact.createContext(DefaultFormContext);

/**
 * Utility hook for consuming the FormContext
 *
 * @returns The value of closest FormContext provider
 */
function useFormContext() {
    const context = hooks.useContext(FormContext);
    // merge the returned context into the default context so that all props are specified
    const contextWithDefaults = Object.assign({}, DefaultFormContext, context);
    return contextWithDefaults;
}

exports.FormContext = FormContext;
exports.useFormContext = useFormContext;
/*  */
//# sourceMappingURL=UNSAFE_useFormContext.js.map
