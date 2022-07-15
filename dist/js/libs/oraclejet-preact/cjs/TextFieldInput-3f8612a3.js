/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');

var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var hooks_UNSAFE_useTextFieldInputHandlers = require('./hooks/UNSAFE_useTextFieldInputHandlers.js');
require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_interpolations_text = require('./utils/UNSAFE_interpolations/text.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var classNames = require('./classNames-69178ebf.js');

const rootStyles$1 = {
  base: "bz3fot0",
  labelInside: "ls05z7w"
};
const getFormControlClasses = hasInsideLabel => {
  return classNames.classNames([rootStyles$1.base, hasInsideLabel && rootStyles$1.labelInside]);
};
const getLoadingAriaLabel = () => {
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  return translations.formControl_loading();
};

const textFieldStyles = {
  base: "b1xca3of",
  nonReadonly: "ni40gqb"
};
const readonlyStyles = {
  base: "bun4eps",
  insideEnabledForm: "ijdzj0w",
  textarea: "t13hvi0u",
  insideEnabledFormLabelInside: "i1hdg7a3",
  notInsideEnabledForm: "nbcpkci",
  textareaNotInsideEnabledForm: "tzp1pxl"
}; //Consolidating all loading styles on form elements here

const loadingStyles = "l1omatdu";
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
  base: "b5vrti3",
  textarea: "tqajw3e",
  labelInsideBase: "lz92e5s",
  textareaLabelInsideBase: "tu7n3hp",
  labelInsideNoValueAndHasFocus: "l1anaj9x",
  hasStartContent: "h11v9ury",
  hasEndContent: "h1lksuif",
  disabled: "d9vukc7"
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
      props = tslib_es6.__rest(_a, ["as", "ariaAutocomplete", "ariaControls", "ariaDescribedby", "ariaExpanded", "ariaInvalid", "ariaLabel", "ariaLabelledby", "autoComplete", "autoFocus", "hasEndContent", "hasInsideLabel", "hasStartContent", "id", "inputRef", "placeholder", "isRequired", "role", "rows", "spellcheck", "type", "value", "onInput", "onCommit", "onKeyDown", "onKeyUp"]);

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
  const inputClasses = classNames.classNames(['oj-c-text-field-input', rootStyles.base, as === 'textarea' && rootStyles.textarea, hasInsideLabel && classNames.classNames([rootStyles.labelInsideBase, as === 'textarea' && rootStyles.textareaLabelInsideBase, !hasValue && isFocused && rootStyles.labelInsideNoValueAndHasFocus]), hasStartContent && rootStyles.hasStartContent, hasEndContent && rootStyles.hasEndContent, isDisabled && rootStyles.disabled, styleInterpolationClasses]);
  const Comp = as || 'input';
  const handlers = hooks_UNSAFE_useTextFieldInputHandlers.useTextFieldInputHandlers({
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
//# sourceMappingURL=TextFieldInput-3f8612a3.js.map
