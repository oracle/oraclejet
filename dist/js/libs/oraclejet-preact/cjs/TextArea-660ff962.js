/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');
var compat = require('preact/compat');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var hooks_UNSAFE_useFocusableTextField = require('./hooks/UNSAFE_useFocusableTextField.js');
var UNSAFE_Label = require('./UNSAFE_Label.js');
var UNSAFE_TextField = require('./UNSAFE_TextField.js');
var hooks_UNSAFE_useTextField = require('./hooks/UNSAFE_useTextField.js');
var UNSAFE_UserAssistance = require('./UNSAFE_UserAssistance.js');
var hooks_UNSAFE_useLengthFilter = require('./hooks/UNSAFE_useLengthFilter.js');
var hooks_UNSAFE_useCurrentValueReducer = require('./hooks/UNSAFE_useCurrentValueReducer.js');
var TextFieldInput = require('./TextFieldInput-40fdc487.js');

const TextArea = compat.forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, maxLength, maxLengthUnit, messages, 
//TODO: Add counter to show the length remaining - JET-50752
placeholder, resize, role, rows, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, onInput, onCommit }, ref) => {
    const { currentCommitValue, dispatch } = hooks_UNSAFE_useCurrentValueReducer.useCurrentValueReducer({ value });
    const onInputAndDispatch = compat.useCallback((detail) => {
        // Should dispatch happen first? This will queue up a re-render, ordering should not cause issues (this is async)
        dispatch({ type: 'input', payload: detail.value });
        onInput === null || onInput === void 0 ? void 0 : onInput(detail);
    }, [onInput]);
    const onCommitAndDispatch = compat.useCallback((detail) => {
        // Should dispatch happen first? This will queue up a re-render, ordering should not cause issues (this is async)
        dispatch({ type: 'commit', payload: detail.value });
        onCommit === null || onCommit === void 0 ? void 0 : onCommit(detail);
    }, [onCommit]);
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, labelStartWidth: formLabelStartWidth, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = hooks_UNSAFE_useFormContext.useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const labelStartWidth = propLabelStartWidth !== null && propLabelStartWidth !== void 0 ? propLabelStartWidth : formLabelStartWidth;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { enabledElementRef, readonlyElementRef, focusProps, isFocused } = hooks_UNSAFE_useFocusableTextField.useFocusableTextField({ isDisabled, isReadonly, ref });
    const { formFieldContext, inputProps, labelProps, textFieldProps, userAssistanceProps } = hooks_UNSAFE_useTextField.useTextField({
        id,
        isDisabled,
        isFocused,
        isReadonly,
        labelEdge,
        messages,
        value,
        variant: 'textarea'
    });
    // Handle length filter for user-typed inputs and controlled inputs
    const { isMaxLengthExceeded, valueLength, onFilteredInput } = hooks_UNSAFE_useLengthFilter.useLengthFilter({
        maxLength,
        maxLengthUnit,
        value,
        onInput: onInputAndDispatch,
        onCommit: onCommitAndDispatch
    });
    const labelComp = labelEdge !== 'none' ? jsxRuntime.jsx(UNSAFE_Label.Label, Object.assign({}, labelProps, { children: label })) : undefined;
    const fieldLabelProps = {
        label: labelEdge !== 'none' ? labelComp : undefined,
        labelEdge: labelEdge !== 'none' ? labelEdge : undefined,
        labelStartWidth: labelEdge !== 'none' ? labelStartWidth : undefined
    };
    const ariaLabel = labelEdge === 'none' ? label : undefined;
    const inlineUserAssistance = isDisabled || isReadonly ? (
    // save space for user assistance if density is 'efficient', even though we don't
    // render user assistance for disabled or readonly fields
    userAssistanceDensity !== 'efficient' ? undefined : (jsxRuntime.jsx(UNSAFE_UserAssistance.InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsxRuntime.jsx(UNSAFE_UserAssistance.InlineUserAssistance, Object.assign({ assistiveText: assistiveText, fieldLabel: label, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        // TODO: We need to conditionally render the readonly innerReadonlyField as a textarea or div
        //  also, the div will need to use white-space: pre-wrap so that the text will wrap like textarea
        //  see JET-50636
        return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, variant: "textarea" }, fieldLabelProps, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "textarea", elementRef: readonlyElementRef, rows: rows, autoFocus: autoFocus, id: id, textAlign: textAlign, value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx(TextFieldInput.TextFieldInput, Object.assign({ as: "textarea", ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, currentCommitValue: currentCommitValue, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', isRequired: isRequired, inputRef: enabledElementRef, onCommit: onCommitAndDispatch, onInput: onFilteredInput, placeholder: placeholder, role: role, rows: rows, textAlign: textAlign, value: value }, inputProps)), maxLength !== undefined && (jsxRuntime.jsx(UNSAFE_TextField.MaxLengthLiveRegion, Object.assign({}, { isMaxLengthExceeded, maxLength, valueLength })))] }));
    return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.TextField, Object.assign({ mainContent: mainContent, inlineUserAssistance: inlineUserAssistance, onBlur: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusout, onFocus: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusin, resize: resize }, textFieldProps, fieldLabelProps)) })));
});

exports.TextArea = TextArea;
/*  */
//# sourceMappingURL=TextArea-660ff962.js.map
