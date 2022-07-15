/* @oracle/oraclejet-preact: 13.0.0 */
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
var hooks = require('preact/hooks');
var TextFieldInput = require('./TextFieldInput-3f8612a3.js');

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
    hooks.useLayoutEffect(() => {
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

const TextAreaAutosize = compat.forwardRef(({ assistiveText, autoComplete = 'off', autoFocus = false, helpSourceLink, helpSourceText, id, isDisabled: propIsDisabled, isReadonly: propIsReadonly, isRequired = false, isRequiredShown, label, labelEdge: propLabelEdge, labelStartWidth: propLabelStartWidth, maxLength, maxLengthUnit, maxRows, messages, minRows = 2, placeholder, role, 
//TODO: Add counter to show the length remaining - JET-50752
textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value, onInput, onCommit }, ref) => {
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
        return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextField, Object.assign({ role: "presentation", inlineUserAssistance: inlineUserAssistance, variant: "textarea" }, fieldLabelProps, { children: jsxRuntime.jsx(UNSAFE_TextField.ReadonlyTextFieldInput, { ariaLabel: ariaLabel, ariaLabelledby: labelProps.id, as: "textarea", elementRef: readonlyElementRef, rows: minRows, autoFocus: autoFocus, id: id, textAlign: textAlign, value: value, hasInsideLabel: label !== undefined && labelEdge === 'inside' }) })) })));
    }
    const mainContent = (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx(TextFieldInput.TextFieldInput, Object.assign({ as: "textarea", ariaLabel: ariaLabel, autoComplete: autoComplete, autoFocus: autoFocus, hasInsideLabel: labelComp !== undefined && labelEdge === 'inside', isRequired: isRequired, inputRef: enabledElementRef, onInput: onFilteredInput, onCommit: onCommit, placeholder: placeholder, role: role, rows: minRows, textAlign: textAlign, value: value }, inputProps)), maxLength !== undefined && (jsxRuntime.jsx(UNSAFE_TextField.MaxLengthLiveRegion, Object.assign({}, { isMaxLengthExceeded, maxLength, valueLength })))] }));
    return (jsxRuntime.jsx(hooks_UNSAFE_useFormFieldContext.FormFieldContext.Provider, Object.assign({ value: formFieldContext }, { children: jsxRuntime.jsx(UNSAFE_TextField.TextField, Object.assign({ mainContent: mainContent, inlineUserAssistance: inlineUserAssistance, onBlur: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusout, onFocus: focusProps === null || focusProps === void 0 ? void 0 : focusProps.onfocusin }, textFieldProps, fieldLabelProps)) })));
});

exports.TextAreaAutosize = TextAreaAutosize;
/*  */
//# sourceMappingURL=TextAreaAutosize-08c04dd9.js.map
