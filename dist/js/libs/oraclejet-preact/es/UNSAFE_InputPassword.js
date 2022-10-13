/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';
import { forwardRef } from 'preact/compat';
import { useCallback } from 'preact/hooks';
import { useFocusableTextField } from './hooks/UNSAFE_useFocusableTextField.js';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import { FormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { useTextField } from './hooks/UNSAFE_useTextField.js';
import { useHover } from './hooks/UNSAFE_useHover.js';
import { Label } from './UNSAFE_Label.js';
import { ReadonlyTextField, ReadonlyTextFieldInput, TextFieldInput, TextField } from './UNSAFE_TextField.js';
import { InlineUserAssistance } from './UNSAFE_UserAssistance.js';
import './UNSAFE_InputPassword.css';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import { usePress } from './hooks/UNSAFE_usePress.js';
import './UNSAFE_ThemedIcons.js';
import { IcoViewHide as SvgIcoViewHide, IcoView as SvgIcoView } from './UNSAFE_Icons.js';
import { useClearIcon } from './hooks/UNSAFE_useClearIcon.js';
import { beforeVNode } from './utils/UNSAFE_componentUtils.js';
import { C as ClearIcon } from './ClearIcon-2b8fb446.js';
import { useToggle } from './hooks/UNSAFE_useToggle.js';
import { useCurrentValueReducer } from './hooks/UNSAFE_useCurrentValueReducer.js';
import './tslib.es6-deee4931.js';
import './hooks/UNSAFE_useFocusWithin.js';
import 'preact';
import './hooks/UNSAFE_useId.js';
import './utils/UNSAFE_classNames.js';
import './utils/UNSAFE_interpolations/text.js';
import './keys-77d2b8e6.js';
import './_curry1-b6f34fc4.js';
import './_has-f370c697.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-255e04d1.js';
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
import './UNSAFE_ComponentMessage.js';
import './UNSAFE_HiddenAccessible.js';
import './UNSAFE_Message.js';
import './utils/UNSAFE_getLocale.js';
import './utils/UNSAFE_logger.js';
import './utils/UNSAFE_soundUtils.js';
import './UNSAFE_TransitionGroup.js';
import './UNSAFE_Icon.js';
import './hooks/UNSAFE_useUser.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import './hooks/UNSAFE_useTheme.js';

// will need to refactor to use that.
// TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-height) once it is available

const ojButtonHeight = '2.75rem'; // TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-border-radius) once it is available

const ojButtonBorderRadius = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-border-radius-md)'; // TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-borderless-chrome-text-color) once it is available

const ojButtonBorderlessChromeTextColor = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-primary)'; // TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-borderless-chrome-text-color-hover) once it is available

const ojButtonBorderlessChromeTextColorHover = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-text-color-primary)'; // TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-borderless-chrome-bg-color-hover) once it is available

const ojButtonBorderlessChromeBgColorHover = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-bg-color-hover)'; // TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-borderless-chrome-border-color-hover) once it is available

const ojButtonBorderlessChromeBorderColorHover = 'transparent'; // TODO: replace this with var(--oj-c-PRIVATE-DO-NOT-USE-button-icon-size) once it is available

const ojButtonIconSize = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-icon-size-lg)';
const revealToggleIconStyles = {
  base: "_f2rlos"
};
function RevealToggleIcon({
  isRevealed,
  onPress
}) {
  const {
    pressProps
  } = usePress(onPress);
  const translations = useTranslationBundle('@oracle/oraclejet-preact'); // title attribute. We removed these because title is taking precedence over aria-label and this
  // is messing up the screen readers. To be accessible we are removing title and will implement
  // this as a <Tooltip> component when we have one.
  // TODO JET-51517 implement reveal icon title as a Tooltip
  // const hidePasswordStr = translations.inputPassword_hide();
  // const showPasswordStr = translations.inputPassword_show();

  const passwordMaskedStr = translations.inputPassword_hidden(); // TODO: Use toggle <Button> when that is available, JET-49207

  return jsx("button", Object.assign({
    "aria-label": passwordMaskedStr,
    role: "switch",
    "aria-checked": isRevealed ? false : true,
    class: revealToggleIconStyles.base,
    tabIndex: 0
  }, pressProps, {
    children: isRevealed ? jsx(SvgIcoViewHide, {}) : jsx(SvgIcoView, {})
  }));
}

// One way InputPassword differs from InputText is InputPassword's readonly
// is implemented with an <input> and not a <div>.
const InputPassword = forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, hasClearIcon, hasRevealToggle = 'always', helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, messages, placeholder, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, onInput, onCommit }, ref) => {
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
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { bool: isRevealed, setFalse: setRevealedFalse, setTrue: setRevealedTrue } = useToggle(false);
    const { enabledElementRef, focusProps, isFocused, readonlyElementRef } = useFocusableTextField({ isDisabled, isReadonly, ref, onBlurWithin: setRevealedFalse });
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
    // Callback on the RevealToggleButton.
    // When the user clicks on the reveal buttton,
    // toggle revealing/masking password
    const onRevealIconPress = useCallback(() => {
        isRevealed ? setRevealedFalse() : setRevealedTrue();
    }, [isRevealed]);
    const revealToggleIcon = !isDisabled && hasRevealToggle === 'always' ? (jsx(RevealToggleIcon, { onPress: onRevealIconPress, isRevealed: isRevealed })) : null;
    const onClickClearIcon = useCallback(() => {
        var _a;
        // Clicking the clear icon should put the focus on the input field
        (_a = enabledElementRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        // Send an event to clear the field's value
        onInputAndDispatch === null || onInputAndDispatch === void 0 ? void 0 : onInputAndDispatch({ previousValue: value, value: '' });
    }, [onInput, value]);
    const maybeClearIcon = useClearIcon({
        clearIcon: jsx(ClearIcon, { onClick: onClickClearIcon }),
        display: hasClearIcon,
        hasValue: formFieldContext.hasValue,
        isFocused,
        isEnabled: !isReadonly && !isDisabled,
        isHover
    });
    const endContentCombined = beforeVNode(revealToggleIcon, maybeClearIcon);
    const labelComp = labelEdge !== 'none' ? jsx(Label, Object.assign({}, labelProps, { children: label })) : undefined;
    const fieldLabelProps = {
        label: labelEdge !== 'none' ? labelComp : undefined,
        labelEdge: labelEdge !== 'none' ? labelEdge : undefined
    };
    const ariaLabel = labelEdge === 'none' ? label : undefined;
    const inlineUserAssistance = isDisabled || isReadonly ? (
    // save space for user assistance if density is 'efficient', even though we don't
    // render user assistance for disabled or readonly fields
    userAssistanceDensity !== 'efficient' ? undefined : (jsx(InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsx(InlineUserAssistance, Object.assign({ assistiveText: assistiveText, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance }, fieldLabelProps, { children: jsx(ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "input", autoFocus: autoFocus, elementRef: readonlyElementRef, id: id, textAlign: textAlign, type: "password", value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsx(TextFieldInput, Object.assign({ ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, currentCommitValue: currentCommitValue, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', inputRef: enabledElementRef, isRequired: isRequired, onInput: onInputAndDispatch, onCommit: onCommitAndDispatch, placeholder: placeholder, textAlign: textAlign, value: value, type: isRevealed ? 'text' : 'password' }, inputProps)));
    return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(TextField, Object.assign({ endContent: endContentCombined, inlineUserAssistance: inlineUserAssistance, mainContent: mainContent, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin }, textFieldProps, fieldLabelProps, hoverProps)) })));
});

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { InputPassword };
/*  */
//# sourceMappingURL=UNSAFE_InputPassword.js.map
