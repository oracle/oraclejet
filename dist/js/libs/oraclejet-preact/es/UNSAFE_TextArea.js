/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx, jsxs } from 'preact/jsx-runtime';
import { Fragment } from 'preact';
import { forwardRef, useCallback } from 'preact/compat';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import { FormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { useFocusableTextField } from './hooks/UNSAFE_useFocusableTextField.js';
import { Label } from './UNSAFE_Label.js';
import { ReadonlyTextField, ReadonlyTextFieldInput, TextFieldInput, MaxLengthLiveRegion, TextField } from './UNSAFE_TextField.js';
import { useTextField } from './hooks/UNSAFE_useTextField.js';
import { InlineUserAssistance } from './UNSAFE_UserAssistance.js';
import { useLengthFilter } from './hooks/UNSAFE_useLengthFilter.js';
import { useCurrentValueReducer } from './hooks/UNSAFE_useCurrentValueReducer.js';
import 'preact/hooks';
import './tslib.es6-deee4931.js';
import './hooks/UNSAFE_useFocusWithin.js';
import './utils/UNSAFE_classNames.js';

import './utils/UNSAFE_interpolations/text.js';
import './keys-77d2b8e6.js';
import './_curry1-b6f34fc4.js';
import './_has-f370c697.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-255e04d1.js';
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
import './utils/PRIVATE_clientHints.js';
import './hooks/UNSAFE_useDebounce.js';
import './UNSAFE_LiveRegion.js';
import './hooks/UNSAFE_useId.js';
import './UNSAFE_ComponentMessage.js';
import './UNSAFE_HiddenAccessible.js';
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
import './utils/UNSAFE_lengthFilter.js';

const TextArea = forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, maxLength, maxLengthUnit, messages, 
//TODO: Add counter to show the length remaining - JET-50752
placeholder, resize, role, rows, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, onInput, onCommit }, ref) => {
    const { currentCommitValue, dispatch } = useCurrentValueReducer({ value });
    const onInputAndDispatch = useCallback((detail) => {
        // Should dispatch happen first? This will queue up a re-render, ordering should not cause issues (this is async)
        dispatch({ type: 'input', payload: detail.value });
        onInput === null || onInput === void 0 ? void 0 : onInput(detail);
    }, [onInput]);
    const onCommitAndDispatch = useCallback((detail) => {
        // Should dispatch happen first? This will queue up a re-render, ordering should not cause issues (this is async)
        dispatch({ type: 'commit', payload: detail.value });
        onCommit === null || onCommit === void 0 ? void 0 : onCommit(detail);
    }, [onCommit]);
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, labelStartWidth: formLabelStartWidth, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const labelStartWidth = propLabelStartWidth !== null && propLabelStartWidth !== void 0 ? propLabelStartWidth : formLabelStartWidth;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { enabledElementRef, readonlyElementRef, focusProps, isFocused } = useFocusableTextField({ isDisabled, isReadonly, ref });
    const { formFieldContext, inputProps, labelProps, textFieldProps, userAssistanceProps } = useTextField({
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
    const { isMaxLengthExceeded, valueLength, onFilteredInput } = useLengthFilter({
        maxLength,
        maxLengthUnit,
        value,
        onInput: onInputAndDispatch,
        onCommit: onCommitAndDispatch
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
    userAssistanceDensity !== 'efficient' ? undefined : (jsx(InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsx(InlineUserAssistance, Object.assign({ assistiveText: assistiveText, fieldLabel: label, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        // TODO: We need to conditionally render the readonly innerReadonlyField as a textarea or div
        //  also, the div will need to use white-space: pre-wrap so that the text will wrap like textarea
        //  see JET-50636
        return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, variant: "textarea" }, fieldLabelProps, { children: jsx(ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "textarea", elementRef: readonlyElementRef, rows: rows, autoFocus: autoFocus, id: id, textAlign: textAlign, value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxs(Fragment, { children: [jsx(TextFieldInput, Object.assign({ as: "textarea", ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, currentCommitValue: currentCommitValue, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', isRequired: isRequired, inputRef: enabledElementRef, onCommit: onCommitAndDispatch, onInput: onFilteredInput, placeholder: placeholder, role: role, rows: rows, textAlign: textAlign, value: value }, inputProps)), maxLength !== undefined && (jsx(MaxLengthLiveRegion, Object.assign({}, { isMaxLengthExceeded, maxLength, valueLength })))] }));
    return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(TextField, Object.assign({ mainContent: mainContent, inlineUserAssistance: inlineUserAssistance, onBlur: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusout, onFocus: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusin, resize: resize }, textFieldProps, fieldLabelProps)) })));
});

export { TextArea };
/*  */
//# sourceMappingURL=UNSAFE_TextArea.js.map
