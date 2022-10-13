/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');

var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var hooks_UNSAFE_useTextFieldInputHandlers = require('./hooks/UNSAFE_useTextFieldInputHandlers.js');
require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_interpolations_text = require('./utils/UNSAFE_interpolations/text.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var classNames = require('./classNames-82bfab52.js');

const rootStyles$1 = {
  base: "_p7jaqt",
  labelInside: "_mh88i5"
};
const getFormControlClasses = hasInsideLabel => {
  return classNames.classNames([rootStyles$1.base, hasInsideLabel && rootStyles$1.labelInside]);
};
const getLoadingAriaLabel = () => {
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  return translations.formControl_loading();
};

const textFieldStyles = {
  base: "_p2gfel",
  nonReadonly: "_dn1zg"
};
const readonlyStyles = {
  base: "_qcacp5",
  insideEnabledForm: "_6z8p96",
  textarea: "_cqjxkn",
  insideEnabledFormLabelInside: "_nj5aga",
  notInsideEnabledForm: "_mt8uw",
  textareaNotInsideEnabledForm: "b90zw3"
}; //Consolidating all loading styles on form elements here

const loadingStyles = "mqs4hy";
const getTextFieldClasses = readonly => {
  const classes = classNames.classNames([textFieldStyles.base, !readonly && textFieldStyles.nonReadonly]);
  return classes;
};
const getReadonlyClasses = (isInsideNonReadonlyForm, hasInsideLabel, variant) => {
  const classes = classNames.classNames([readonlyStyles.base, variant === 'textarea' && readonlyStyles.textarea, isInsideNonReadonlyForm ? readonlyStyles.insideEnabledForm : readonlyStyles.notInsideEnabledForm, variant === 'textarea' && !isInsideNonReadonlyForm && readonlyStyles.textareaNotInsideEnabledForm, isInsideNonReadonlyForm && hasInsideLabel && readonlyStyles.insideEnabledFormLabelInside]);
  return classes;
};
const getInputId = id => {
  return (id !== null && id !== void 0 ? id : '') + '|input';
};
const isInputPlaceholderShown = (hasInsideLabel, hasValue, isFocused) => {
  return !(hasInsideLabel && !hasValue && !isFocused);
};

const rootStyles = {
  base: "_td6wml",
  textarea: "v1wu0m",
  password: "b9zln2",
  labelInsideBase: "onu3ux",
  textareaLabelInsideBase: "_h206",
  labelInsideNoValueAndHasFocus: "nntzq3",
  hasStartContent: "_la3rso",
  hasEndContent: "_tcvcyf",
  disabled: "a8aw7n"
};
const interpolations = [...Object.values(utils_UNSAFE_interpolations_text.textInterpolations)];
const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
const TextFieldInput = _a => {
  var {
    as,
    ariaAutocomplete,
    ariaControls,
    ariaDescribedby,
    ariaExpanded,
    ariaInvalid,
    ariaLabel,
    ariaLabelledby,
    autoComplete,
    autoFocus,
    currentCommitValue,
    hasEndContent = false,
    hasInsideLabel = false,
    hasStartContent = false,
    id,
    inputRef,
    placeholder,
    isRequired,
    role,
    rows,
    spellcheck,
    type,
    value = '',
    onInput,
    onCommit,
    onKeyDown,
    onKeyUp
  } = _a,
      props = tslib_es6.__rest(_a, ["as", "ariaAutocomplete", "ariaControls", "ariaDescribedby", "ariaExpanded", "ariaInvalid", "ariaLabel", "ariaLabelledby", "autoComplete", "autoFocus", "currentCommitValue", "hasEndContent", "hasInsideLabel", "hasStartContent", "id", "inputRef", "placeholder", "isRequired", "role", "rows", "spellcheck", "type", "value", "onInput", "onCommit", "onKeyDown", "onKeyUp"]);

  const hasValue = value !== '';
  const {
    isDisabled,
    isFocused,
    isLoading,
    isReadonly
  } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
  const myPlaceholder = isInputPlaceholderShown(hasInsideLabel, hasValue, isFocused) ? placeholder : undefined;
  const {
    class: styleInterpolationClasses
  } = styleInterpolations(props);
  const inputClasses = classNames.classNames(['oj-c-text-field-input', rootStyles.base, as === 'textarea' && rootStyles.textarea, type === 'password' && rootStyles.password, hasInsideLabel && classNames.classNames([rootStyles.labelInsideBase, as === 'textarea' && rootStyles.textareaLabelInsideBase, !hasValue && isFocused && rootStyles.labelInsideNoValueAndHasFocus]), hasStartContent && rootStyles.hasStartContent, hasEndContent && rootStyles.hasEndContent, isDisabled && rootStyles.disabled, styleInterpolationClasses]);
  const Comp = as || 'input';
  const handlers = hooks_UNSAFE_useTextFieldInputHandlers.useTextFieldInputHandlers({
    currentCommitValue,
    value,
    onInput,
    onCommit,
    onKeyDown
  }); // the implicit default for tabindex on an input is 0, so do not explicitly set it.
  // TODO: for autoComplete='off', need to configure attrs appropriately to make sure it
  // works across browsers and versions  (from review on 3/11/22)

  return jsxRuntime.jsx(Comp, Object.assign({
    "aria-autocomplete": ariaAutocomplete,
    "aria-controls": ariaControls,
    "aria-describedby": ariaDescribedby,
    "aria-expanded": ariaExpanded,
    "aria-invalid": ariaInvalid,
    "aria-label": isLoading ? getLoadingAriaLabel() : ariaLabel ? ariaLabel : undefined,
    "aria-labelledby": ariaLabelledby,
    "aria-required": isRequired ? true : undefined,
    autocomplete: autoComplete,
    autofocus: autoFocus,
    class: inputClasses,
    disabled: isDisabled,
    id: id,
    onKeyUp: onKeyUp,
    placeholder: myPlaceholder,
    readonly: isReadonly,
    // @ts-ignore
    ref: inputRef,
    role: role,
    rows: rows,
    spellcheck: spellcheck,
    type: type,
    value: value
  }, handlers));
};

exports.TextFieldInput = TextFieldInput;
exports.getFormControlClasses = getFormControlClasses;
exports.getInputId = getInputId;
exports.getLoadingAriaLabel = getLoadingAriaLabel;
exports.getReadonlyClasses = getReadonlyClasses;
exports.getTextFieldClasses = getTextFieldClasses;
exports.loadingStyles = loadingStyles;
/*  */
//# sourceMappingURL=TextFieldInput-40fdc487.js.map
