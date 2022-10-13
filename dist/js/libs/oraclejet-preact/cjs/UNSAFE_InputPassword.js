/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
var compat = require('preact/compat');
var hooks = require('preact/hooks');
var hooks_UNSAFE_useFocusableTextField = require('./hooks/UNSAFE_useFocusableTextField.js');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var hooks_UNSAFE_useTextField = require('./hooks/UNSAFE_useTextField.js');
var hooks_UNSAFE_useHover = require('./hooks/UNSAFE_useHover.js');
var UNSAFE_Label = require('./UNSAFE_Label.js');
var UNSAFE_TextField = require('./UNSAFE_TextField.js');
var UNSAFE_UserAssistance = require('./UNSAFE_UserAssistance.js');
require('identity-obj-proxy');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var hooks_UNSAFE_usePress = require('./hooks/UNSAFE_usePress.js');
require('./index-dcd95188.js');
var UNSAFE_Icons = require('./index-e2b299b3.js');
var hooks_UNSAFE_useClearIcon = require('./hooks/UNSAFE_useClearIcon.js');
var utils_UNSAFE_componentUtils = require('./utils/UNSAFE_componentUtils.js');
var ClearIcon = require('./ClearIcon-a579c8f3.js');
var hooks_UNSAFE_useToggle = require('./hooks/UNSAFE_useToggle.js');
var hooks_UNSAFE_useCurrentValueReducer = require('./hooks/UNSAFE_useCurrentValueReducer.js');
var TextFieldInput = require('./TextFieldInput-40fdc487.js');
require('./tslib.es6-e91f819d.js');
require('./hooks/UNSAFE_useFocusWithin.js');
require('./useFocusWithin-b68e203b.js');
require('preact');
require('./hooks/UNSAFE_useId.js');
require('./utils/UNSAFE_classNames.js');
require('./classNames-82bfab52.js');
require('./utils/UNSAFE_interpolations/text.js');
require('./keys-0a611b24.js');
require('./_curry1-94f22a19.js');
require('./_has-556488e4.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-e6dc9cf1.js');
require('./UNSAFE_LabelValueLayout.js');
require('./UNSAFE_Flex.js');
require('./Flex-327ae051.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');
require('./hooks/UNSAFE_useDebounce.js');
require('./UNSAFE_LiveRegion.js');
require('./UNSAFE_ComponentMessage.js');
require('./ComponentMessage-a872eb39.js');
require('./UNSAFE_HiddenAccessible.js');
require('./HiddenAccessible-12dce52a.js');
require('./UNSAFE_Message.js');
require('./MessageCloseButton-c5605b75.js');
require('./MessageDetail-4d43ff71.js');
require('./MessageFormattingUtils-6764fed3.js');
require('./utils/UNSAFE_getLocale.js');
require('./Message.types-2c9b978d.js');
require('./MessageStartIcon-600451b4.js');
require('./MessageSummary-f93feb7b.js');
require('./MessageTimestamp-abe719cf.js');
require('./MessageUtils-68957380.js');
require('./utils/UNSAFE_logger.js');
require('./utils/UNSAFE_soundUtils.js');
require('./MessagesManager-e88df2a4.js');
require('./UNSAFE_TransitionGroup.js');
require('./UNSAFE_Icon.js');
require('./Icon-42559ff1.js');
require('./hooks/UNSAFE_useUser.js');
require('./UNSAFE_Environment.js');
require('./UNSAFE_Layer.js');
require('./hooks/UNSAFE_useTheme.js');
require('./ComponentMessageContainer-caebad7b.js');
require('./hooks/UNSAFE_useTextFieldInputHandlers.js');
require('./utils/PRIVATE_clientHints.js');
require('./clientHints-d9b5605d.js');

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
  } = hooks_UNSAFE_usePress.usePress(onPress);
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact'); // title attribute. We removed these because title is taking precedence over aria-label and this
  // is messing up the screen readers. To be accessible we are removing title and will implement
  // this as a <Tooltip> component when we have one.
  // TODO JET-51517 implement reveal icon title as a Tooltip
  // const hidePasswordStr = translations.inputPassword_hide();
  // const showPasswordStr = translations.inputPassword_show();

  const passwordMaskedStr = translations.inputPassword_hidden(); // TODO: Use toggle <Button> when that is available, JET-49207

  return jsxRuntime.jsx("button", Object.assign({
    "aria-label": passwordMaskedStr,
    role: "switch",
    "aria-checked": isRevealed ? false : true,
    class: revealToggleIconStyles.base,
    tabIndex: 0
  }, pressProps, {
    children: isRevealed ? jsxRuntime.jsx(UNSAFE_Icons.SvgIcoViewHide, {}) : jsxRuntime.jsx(UNSAFE_Icons.SvgIcoView, {})
  }));
}

// One way InputPassword differs from InputText is InputPassword's readonly
// is implemented with an <input> and not a <div>.
const InputPassword = compat.forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, hasClearIcon, hasRevealToggle = 'always', helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, messages, placeholder, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, onInput, onCommit }, ref) => {
    const { currentCommitValue, dispatch } = hooks_UNSAFE_useCurrentValueReducer.useCurrentValueReducer({ value });
    const onInputAndDispatch = hooks.useCallback((detail) => {
        // Should dispatch happen first? This will queue up a re-render, ordering should not cause issues (this is async)
        dispatch({ type: 'input', payload: detail.value });
        onInput === null || onInput === void 0 ? void 0 : onInput(detail);
    }, [onInput]);
    const onCommitAndDispatch = hooks.useCallback((detail) => {
        // Should dispatch happen first? This will queue up a re-render, ordering should not cause issues (this is async)
        dispatch({ type: 'commit', payload: detail.value });
        onCommit === null || onCommit === void 0 ? void 0 : onCommit(detail);
    }, [onCommit]);
    const { isDisabled: isFormDisabled, isReadonly: isFormReadonly, labelEdge: formLabelEdge, textAlign: formTextAlign, userAssistanceDensity: formUserAssistanceDensity } = hooks_UNSAFE_useFormContext.useFormContext();
    // default to FormContext values if component properties are not specified
    const isDisabled = propIsDisabled !== null && propIsDisabled !== void 0 ? propIsDisabled : isFormDisabled;
    const isReadonly = propIsReadonly !== null && propIsReadonly !== void 0 ? propIsReadonly : isFormReadonly;
    const labelEdge = propLabelEdge !== null && propLabelEdge !== void 0 ? propLabelEdge : formLabelEdge;
    const textAlign = propTextAlign !== null && propTextAlign !== void 0 ? propTextAlign : formTextAlign;
    const userAssistanceDensity = propUserAssistanceDensity !== null && propUserAssistanceDensity !== void 0 ? propUserAssistanceDensity : formUserAssistanceDensity;
    const { bool: isRevealed, setFalse: setRevealedFalse, setTrue: setRevealedTrue } = hooks_UNSAFE_useToggle.useToggle(false);
    const { enabledElementRef, focusProps, isFocused, readonlyElementRef } = hooks_UNSAFE_useFocusableTextField.useFocusableTextField({ isDisabled, isReadonly, ref, onBlurWithin: setRevealedFalse });
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
    // Callback on the RevealToggleButton.
    // When the user clicks on the reveal buttton,
    // toggle revealing/masking password
    const onRevealIconPress = hooks.useCallback(() => {
        isRevealed ? setRevealedFalse() : setRevealedTrue();
    }, [isRevealed]);
    const revealToggleIcon = !isDisabled && hasRevealToggle === 'always' ? (jsxRuntime.jsx(RevealToggleIcon, { onPress: onRevealIconPress, isRevealed: isRevealed })) : null;
    const onClickClearIcon = hooks.useCallback(() => {
        var _a;
        // Clicking the clear icon should put the focus on the input field
        (_a = enabledElementRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        // Send an event to clear the field's value
        onInputAndDispatch === null || onInputAndDispatch === void 0 ? void 0 : onInputAndDispatch({ previousValue: value, value: '' });
    }, [onInput, value]);
    const maybeClearIcon = hooks_UNSAFE_useClearIcon.useClearIcon({
        clearIcon: jsxRuntime.jsx(ClearIcon.ClearIcon, { onClick: onClickClearIcon }),
        display: hasClearIcon,
        hasValue: formFieldContext.hasValue,
        isFocused,
        isEnabled: !isReadonly && !isDisabled,
        isHover
    });
    const endContentCombined = utils_UNSAFE_componentUtils.beforeVNode(revealToggleIcon, maybeClearIcon);
    const labelComp = labelEdge !== 'none' ? jsxRuntime.jsx(UNSAFE_Label.Label, Object.assign({}, labelProps, { children: label })) : undefined;
    const fieldLabelProps = {
        label: labelEdge !== 'none' ? labelComp : undefined,
        labelEdge: labelEdge !== 'none' ? labelEdge : undefined
    };
    const ariaLabel = labelEdge === 'none' ? label : undefined;
    const inlineUserAssistance = isDisabled || isReadonly ? (
    // save space for user assistance if density is 'efficient', even though we don't
    // render user assistance for disabled or readonly fields
    userAssistanceDensity !== 'efficient' ? undefined : (jsxRuntime.jsx(UNSAFE_UserAssistance.InlineUserAssistance, Object.assign({ userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)))) : (jsxRuntime.jsx(UNSAFE_UserAssistance.InlineUserAssistance, Object.assign({ assistiveText: assistiveText, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, messages: messages, isRequiredShown: isRequiredShown, userAssistanceDensity: userAssistanceDensity }, userAssistanceProps)));
    if (isReadonly) {
        return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance }, fieldLabelProps, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "input", autoFocus: autoFocus, elementRef: readonlyElementRef, id: id, textAlign: textAlign, type: "password", value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxRuntime.jsx(TextFieldInput.TextFieldInput, Object.assign({ ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, currentCommitValue: currentCommitValue, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', inputRef: enabledElementRef, isRequired: isRequired, onInput: onInputAndDispatch, onCommit: onCommitAndDispatch, placeholder: placeholder, textAlign: textAlign, value: value, type: isRevealed ? 'text' : 'password' }, inputProps)));
    return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.TextField, Object.assign({ endContent: endContentCombined, inlineUserAssistance: inlineUserAssistance, mainContent: mainContent, onBlur: focusProps.onfocusout, onFocus: focusProps.onfocusin }, textFieldProps, fieldLabelProps, hoverProps)) })));
});

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.InputPassword = InputPassword;
/*  */
//# sourceMappingURL=UNSAFE_InputPassword.js.map
