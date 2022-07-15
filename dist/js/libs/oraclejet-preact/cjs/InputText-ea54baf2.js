/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');
var compat = require('preact/compat');
var hooks = require('preact/hooks');
var hooks_UNSAFE_useClearIcon = require('./hooks/UNSAFE_useClearIcon.js');
var hooks_UNSAFE_useFocusableTextField = require('./hooks/UNSAFE_useFocusableTextField.js');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var hooks_UNSAFE_useHover = require('./hooks/UNSAFE_useHover.js');
var hooks_UNSAFE_useLengthFilter = require('./hooks/UNSAFE_useLengthFilter.js');
var hooks_UNSAFE_useTextField = require('./hooks/UNSAFE_useTextField.js');
var UNSAFE_Label = require('./UNSAFE_Label.js');
var UNSAFE_TextField = require('./UNSAFE_TextField.js');
var UNSAFE_UserAssistance = require('./UNSAFE_UserAssistance.js');
require('./utils/PRIVATE_clientHints.js');
var utils_UNSAFE_componentUtils = require('./utils/UNSAFE_componentUtils.js');
var ClearIcon = require('./ClearIcon-ebb9372a.js');
var clientHints = require('./clientHints-90ca1b41.js');
var TextFieldInput = require('./TextFieldInput-3f8612a3.js');

/**
 * Helper function to determine whether the current device is a mobile device
 * @returns true if runnning on a mobile device, false otherwise
 */
function isMobile() {
    const deviceType = clientHints.getClientHints().deviceType;
    return deviceType === 'phone' || deviceType === 'tablet';
}
const InputText = compat.forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, hasClearIcon, endContent, helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, maxLength, maxLengthUnit, messages, placeholder, role, startContent, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, virtualKeyboard, onInput, onCommit }, ref) => {
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, labelStartWidth: formLabelStartWidth, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = hooks_UNSAFE_useFormContext.useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const labelStartWidth = propLabelStartWidth !== null && propLabelStartWidth !== void 0 ? propLabelStartWidth : formLabelStartWidth;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { enabledElementRef, focusProps, isFocused, readonlyElementRef } = hooks_UNSAFE_useFocusableTextField.useFocusableTextField({ isDisabled, isReadonly, ref });
    const { hoverProps, isHover } = hooks_UNSAFE_useHover.useHover({ isDisabled: isReadonly || isDisabled || false });
    const { formFieldContext, inputProps, labelProps, textFieldProps, userAssistanceProps } = hooks_UNSAFE_useTextField.useTextField({
        id,
        isDisabled,
        isFocused,
        isReadonly,
        labelEdge,
        messages,
        value
    });
    const onClickClearIcon = hooks.useCallback(() => {
        var _a;
        // Clicking the clear icon should put the focus on the input field
        (_a = enabledElementRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        // Send an event to clear the field's value
        onInput === null || onInput === void 0 ? void 0 : onInput({ previousValue: value, value: '' });
    }, [onInput, value]);
    const maybeClearIcon = hooks_UNSAFE_useClearIcon.useClearIcon({
        clearIcon: jsxRuntime.jsx(ClearIcon.ClearIcon, { onClick: onClickClearIcon }),
        display: hasClearIcon,
        hasValue: formFieldContext.hasValue,
        isFocused,
        isEnabled: !isReadonly && !isDisabled,
        isHover
    });
    const endContentCombined = utils_UNSAFE_componentUtils.beforeVNode(endContent, maybeClearIcon);
    // Handle length filter for user-typed inputs and controlled inputs
    const { isMaxLengthExceeded, valueLength, onFilteredInput } = hooks_UNSAFE_useLengthFilter.useLengthFilter({
        maxLength,
        maxLengthUnit,
        value,
        onInput,
        onCommit
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
    userAssistanceDensity !== 'efficient' ? undefined : (jsxRuntime.jsx(UNSAFE_UserAssistance.InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsxRuntime.jsx(UNSAFE_UserAssistance.InlineUserAssistance, Object.assign({ assistiveText: assistiveText, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        // TODO: should be able to configure whether start/end content is shown when readonly
        // JET-49916 - Preact InputText: show start/end content when readonly
        return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin }, fieldLabelProps, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "div", autoFocus: autoFocus, elementRef: readonlyElementRef, id: textFieldProps.id, textAlign: textAlign, value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx(TextFieldInput.TextFieldInput, Object.assign({ ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', inputRef: enabledElementRef, isRequired: isRequired, placeholder: placeholder, role: role, textAlign: textAlign, type: isMobile() ? virtualKeyboard : undefined, value: value, onCommit: onCommit, onInput: onFilteredInput }, inputProps)), maxLength !== undefined && (jsxRuntime.jsx(UNSAFE_TextField.MaxLengthLiveRegion, Object.assign({}, { isMaxLengthExceeded, maxLength, valueLength })))] }));
    return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.TextField, Object.assign({ endContent: endContentCombined, inlineUserAssistance: inlineUserAssistance, mainContent: mainContent, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin, startContent: startContent }, textFieldProps, fieldLabelProps, hoverProps)) })));
});

exports.InputText = InputText;
/*  */
//# sourceMappingURL=InputText-ea54baf2.js.map
