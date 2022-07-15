/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { Fragment } from 'preact';
import { forwardRef } from 'preact/compat';
import { useCallback } from 'preact/hooks';
import { useClearIcon } from './hooks/UNSAFE_useClearIcon.js';
import { useFocusableTextField } from './hooks/UNSAFE_useFocusableTextField.js';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import { FormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { useHover } from './hooks/UNSAFE_useHover.js';
import { useLengthFilter } from './hooks/UNSAFE_useLengthFilter.js';
import { useTextField } from './hooks/UNSAFE_useTextField.js';
import { Label } from './UNSAFE_Label.js';
import { ReadonlyTextField, ReadonlyTextFieldInput, TextFieldInput, MaxLengthLiveRegion, TextField } from './UNSAFE_TextField.js';
import { InlineUserAssistance } from './UNSAFE_UserAssistance.js';
import { getClientHints } from './utils/PRIVATE_clientHints.js';
import { beforeVNode } from './utils/UNSAFE_componentUtils.js';
import { C as ClearIcon } from './ClearIcon-41582422.js';
import './hooks/UNSAFE_useToggle.js';
import './tslib.es6-fc945e53.js';
import './hooks/UNSAFE_useFocusWithin.js';
import './utils/UNSAFE_lengthFilter.js';
import './hooks/UNSAFE_useId.js';
import './utils/UNSAFE_classNames.js';
import './UNSAFE_InputText.css';
import './utils/UNSAFE_interpolations/text.js';
import './keys-cb973048.js';
import './_curry1-8b0d63fc.js';
import './_has-77a27fd6.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-6a0eecef.js';
import './hooks/UNSAFE_useTranslationBundle.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import './UNSAFE_LabelValueLayout.js';
import './UNSAFE_Flex.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import './hooks/UNSAFE_useTextFieldInputHandlers.js';
import './hooks/UNSAFE_useDebounce.js';
import './UNSAFE_LiveRegion.js';
import './UNSAFE_ComponentMessage.js';
import './UNSAFE_Message.js';
import './utils/UNSAFE_getLocale.js';
import './UNSAFE_ThemedIcons.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './hooks/UNSAFE_useTheme.js';
import './UNSAFE_Icons.js';
import './utils/UNSAFE_logger.js';
import './utils/UNSAFE_soundUtils.js';
import './UNSAFE_TransitionGroup.js';
import './hooks/UNSAFE_usePress.js';

/**
 * Helper function to determine whether the current device is a mobile device
 * @returns true if runnning on a mobile device, false otherwise
 */
function isMobile() {
    const deviceType = getClientHints().deviceType;
    return deviceType === 'phone' || deviceType === 'tablet';
}
const InputText = forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, hasClearIcon, endContent, helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, maxLength, maxLengthUnit, messages, placeholder, role, startContent, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, virtualKeyboard, onInput, onCommit }, ref) => {
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, labelStartWidth: formLabelStartWidth, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const labelStartWidth = propLabelStartWidth !== null && propLabelStartWidth !== void 0 ? propLabelStartWidth : formLabelStartWidth;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { enabledElementRef, focusProps, isFocused, readonlyElementRef } = useFocusableTextField({ isDisabled, isReadonly, ref });
    const { hoverProps, isHover } = useHover({ isDisabled: isReadonly || isDisabled || false });
    const { formFieldContext, inputProps, labelProps, textFieldProps, userAssistanceProps } = useTextField({
        id,
        isDisabled,
        isFocused,
        isReadonly,
        labelEdge,
        messages,
        value
    });
    const onClickClearIcon = useCallback(() => {
        var _a;
        // Clicking the clear icon should put the focus on the input field
        (_a = enabledElementRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        // Send an event to clear the field's value
        onInput === null || onInput === void 0 ? void 0 : onInput({ previousValue: value, value: '' });
    }, [onInput, value]);
    const maybeClearIcon = useClearIcon({
        clearIcon: jsx(ClearIcon, { onClick: onClickClearIcon }),
        display: hasClearIcon,
        hasValue: formFieldContext.hasValue,
        isFocused,
        isEnabled: !isReadonly && !isDisabled,
        isHover
    });
    const endContentCombined = beforeVNode(endContent, maybeClearIcon);
    // Handle length filter for user-typed inputs and controlled inputs
    const { isMaxLengthExceeded, valueLength, onFilteredInput } = useLengthFilter({
        maxLength,
        maxLengthUnit,
        value,
        onInput,
        onCommit
    });
    const labelComp = labelEdge !== 'none' ? jsx(Label, Object.assign({}, labelProps, { children: label })) : undefined;
    const fieldLabelProps = {
        label: labelEdge !== 'none' ? labelComp : undefined,
        labelEdge: labelEdge !== 'none' ? labelEdge : undefined,
        labelStartWidth: labelEdge !== 'none' ? labelStartWidth : undefined
    };
    const ariaLabel = labelEdge === 'none' ? label : undefined;
    const inlineUserAssistance = isDisabled || isReadonly ? (
    // save space for user assistance if density is 'efficient', even though we don't
    // render user assistance for disabled or readonly fields
    userAssistanceDensity !== 'efficient' ? undefined : (jsx(InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsx(InlineUserAssistance, Object.assign({ assistiveText: assistiveText, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        // TODO: should be able to configure whether start/end content is shown when readonly
        // JET-49916 - Preact InputText: show start/end content when readonly
        return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin }, fieldLabelProps, { children: jsx(ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "div", autoFocus: autoFocus, elementRef: readonlyElementRef, id: textFieldProps.id, textAlign: textAlign, value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxs(Fragment, { children: [jsx(TextFieldInput, Object.assign({ ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', inputRef: enabledElementRef, isRequired: isRequired, placeholder: placeholder, role: role, textAlign: textAlign, type: isMobile() ? virtualKeyboard : undefined, value: value, onCommit: onCommit, onInput: onFilteredInput }, inputProps)), maxLength !== undefined && (jsx(MaxLengthLiveRegion, Object.assign({}, { isMaxLengthExceeded, maxLength, valueLength })))] }));
    return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(TextField, Object.assign({ endContent: endContentCombined, inlineUserAssistance: inlineUserAssistance, mainContent: mainContent, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin, startContent: startContent }, textFieldProps, fieldLabelProps, hoverProps)) })));
});

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { InputText };
/*  */
//# sourceMappingURL=UNSAFE_InputText.js.map
