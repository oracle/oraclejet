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
import { useLayoutEffect } from 'preact/hooks';
import { useCurrentValueReducer } from './hooks/UNSAFE_useCurrentValueReducer.js';
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

// returns the lineHeight as a number of pixels.
const calculateLineHeight = (textarea) => {
    const computedStyle = window.getComputedStyle(textarea);
    const computedlineHeight = computedStyle.lineHeight;
    if (computedlineHeight === 'normal') {
        // We get 'normal' for values 'initial', 'inherit', 'unset' and 'normal'
        // TODO: Unclear if we need this.
        // getComputedStyle always return fontSize in pixels.  Not likely a float, but since it's legal
        // we use parseFloat()
        var fontSize = parseFloat(computedStyle.fontSize);
        return 1.2 * fontSize;
    }
    return parseFloat(computedlineHeight);
};
const getStylingHeight = (textarea) => {
    const cssStyle = window.getComputedStyle(textarea);
    const paddingTop = parseFloat(cssStyle.paddingTop);
    const paddingBottom = parseFloat(cssStyle.paddingBottom);
    const borderTop = parseFloat(cssStyle.borderTop);
    const borderBottom = parseFloat(cssStyle.borderBottom);
    return { paddingHeight: paddingTop + paddingBottom, borderHeight: borderTop + borderBottom };
};

// TODO: Make this fire when the container resizes - JET-50840
const useTextAreaAutosizing = ({ isReadonly, enabledElementRef, readonlyElementRef, minRows = 2, maxRows, value }) => {
    useLayoutEffect(() => {
        const textareaRef = isReadonly ? readonlyElementRef : enabledElementRef;
        if (textareaRef.current === null)
            return;
        const textarea = textareaRef.current;
        const lineHeight = calculateLineHeight(textarea);
        textarea.style.height = '0';
        const { paddingHeight, borderHeight } = getStylingHeight(textarea);
        const heightForMinRows = lineHeight * minRows + paddingHeight + borderHeight;
        const scrollHeight = textarea.scrollHeight + borderHeight;
        var resizedHeight = 0;
        // if maxRows is -1 the textarea will grow or shrink to fit all the content.
        // it won't shrink any less than rows.
        if (maxRows === undefined) {
            // we want to fit the entire scrollHeight, but we don't want
            // to shrink smaller than the height for rows.
            if (scrollHeight < heightForMinRows) {
                resizedHeight = heightForMinRows;
            }
            else {
                resizedHeight = scrollHeight;
            }
        }
        else if (maxRows > minRows) {
            // if maxRows is positive and greater than rows, the textarea will grow to fit the content
            // up to maxrows, or shrink to fit the content and down to rows.
            const heightForMaxRows = lineHeight * maxRows + paddingHeight + borderHeight;
            if (scrollHeight > heightForMaxRows) {
                resizedHeight = heightForMaxRows;
            }
            else if (scrollHeight < heightForMinRows) {
                resizedHeight = heightForMinRows;
            }
            else {
                resizedHeight = scrollHeight;
            }
        }
        else {
            resizedHeight = heightForMinRows;
        }
        // The 0.5 gaurantees that the clientHeight will be bigger than the scrollHeight, so no scrollbar appears.
        textarea.style.height = resizedHeight + 0.5 + 'px';
    }, [value, minRows, maxRows, isReadonly]);
};

const TextAreaAutosize = forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, maxLength, maxLengthUnit, maxRows, messages, minRows = 2, placeholder, role, 
//TODO: Add counter to show the length remaining - JET-50752
textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, onInput, onCommit }, ref) => {
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
    useTextAreaAutosizing({
        isReadonly,
        enabledElementRef,
        readonlyElementRef,
        minRows,
        maxRows,
        value
    });
    if (isReadonly) {
        // TODO: should be able to configure whether start/end content is shown when readonly
        // JET-49916 - Preact InputText: show start/end content when readonly
        return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, variant: "textarea" }, fieldLabelProps, { children: jsx(ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "textarea", elementRef: readonlyElementRef, rows: minRows, autoFocus: autoFocus, id: id, textAlign: textAlign, value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxs(Fragment, { children: [jsx(TextFieldInput, Object.assign({ as: "textarea", ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, currentCommitValue: currentCommitValue, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', isRequired: isRequired, inputRef: enabledElementRef, onCommit: onCommitAndDispatch, onInput: onFilteredInput, placeholder: placeholder, role: role, rows: minRows, textAlign: textAlign, value: value }, inputProps)), maxLength !== undefined && (jsx(MaxLengthLiveRegion, Object.assign({}, { isMaxLengthExceeded, maxLength, valueLength })))] }));
    return (jsx(FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsx(TextField, Object.assign({ mainContent: mainContent, inlineUserAssistance: inlineUserAssistance, onBlur: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusout, onFocus: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusin }, textFieldProps, fieldLabelProps)) })));
});

export { TextAreaAutosize };
/*  */
//# sourceMappingURL=UNSAFE_TextAreaAutosize.js.map
