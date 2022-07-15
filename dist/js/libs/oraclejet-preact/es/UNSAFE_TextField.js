/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx, jsxs } from 'preact/jsx-runtime';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import './UNSAFE_TextField.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { textInterpolations } from './utils/UNSAFE_interpolations/text.js';
import { mergeInterpolations } from './utils/UNSAFE_mergeInterpolations.js';
import { useFormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import { LabelValueLayout } from './UNSAFE_LabelValueLayout.js';
import { Fragment } from 'preact';
import { Flex } from './UNSAFE_Flex.js';
import { a as _isPlaceholder_1, _ as _curry1_1 } from './_curry1-8b0d63fc.js';
import { _ as _curry2_1 } from './_curry2-6a0eecef.js';
import { useTextFieldInputHandlers } from './hooks/UNSAFE_useTextFieldInputHandlers.js';
import { useDebounce } from './hooks/UNSAFE_useDebounce.js';
import { LiveRegion } from './UNSAFE_LiveRegion.js';
import 'preact/hooks';
import './keys-cb973048.js';
import './_has-77a27fd6.js';
import './UNSAFE_Environment.js';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import './utils/PRIVATE_clientHints.js';

const rootStyles$1 = {
  base: "bz3fot0",
  labelInside: "ls05z7w"
};
const getFormControlClasses = hasInsideLabel => {
  return classNames([rootStyles$1.base, hasInsideLabel && rootStyles$1.labelInside]);
};
const getLoadingAriaLabel = () => {
  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  return translations.formControl_loading();
};

const readOnlyTextFieldStyles = {
  base: "byczszj",
  textareaBase: "to9zpcl",
  inEnabledFormBase: "iuhxjs8",
  textareaInEnabledFormBase: "t1ch5h18",
  inEnabledFormLabelInside: "iol9fno",
  textareaInEnabledFormLabelInside: "t15jwrza",
  // We don't want any default padding the browser provides for readonly
  textareaInReadonlyFormNotInside: "t1y841pv",
  inEnabledFormNoLabelInside: "i1cijd50",
  // don't apply this for textarea
  inEnabledFormNoStartContent: "i1of5qyc"
};
function ReadonlyTextFieldInput(_a) {
  var {
    ariaLabel,
    ariaLabelledby,
    autoFocus,
    as = 'div',
    elementRef,
    hasInsideLabel = false,
    id,
    inlineUserAssistance,
    innerReadonlyField,
    rows,
    type,
    value = ''
  } = _a,
      props = __rest(_a, ["ariaLabel", "ariaLabelledby", "autoFocus", "as", "elementRef", "hasInsideLabel", "id", "inlineUserAssistance", "innerReadonlyField", "rows", "type", "value"]);

  const {
    isFormLayout,
    isReadonly: isReadonlyForm
  } = useFormContext();
  const {
    isLoading
  } = useFormFieldContext();
  const ariaLabelForReadonly = isLoading ? getLoadingAriaLabel() : ariaLabel; // get classes for text align

  const interpolations = [...Object.values(textInterpolations)];
  const styleInterpolations = mergeInterpolations(interpolations);
  const {
    class: styleInterpolationClasses
  } = styleInterpolations(props);
  const readonlyDivClasses = classNames([as !== 'textarea' && 'oj-c-hide-scrollbar', readOnlyTextFieldStyles.base, as === 'textarea' && readOnlyTextFieldStyles.textareaBase, isFormLayout && !isReadonlyForm && readOnlyTextFieldStyles.inEnabledFormBase, isFormLayout && !isReadonlyForm && as === 'textarea' && readOnlyTextFieldStyles.textareaInEnabledFormBase, isFormLayout && !isReadonlyForm && (hasInsideLabel ? readOnlyTextFieldStyles.inEnabledFormLabelInside : readOnlyTextFieldStyles.inEnabledFormNoLabelInside), isFormLayout && !isReadonlyForm && as === 'textarea' && hasInsideLabel && readOnlyTextFieldStyles.textareaInEnabledFormLabelInside, isFormLayout && isReadonlyForm && as === 'textarea' && !hasInsideLabel && readOnlyTextFieldStyles.textareaInReadonlyFormNotInside, isFormLayout && !isReadonlyForm && as !== 'textarea' && readOnlyTextFieldStyles.inEnabledFormNoStartContent, styleInterpolationClasses]);

  if (as === 'input') {
    return jsx("input", {
      "aria-label": ariaLabelForReadonly,
      "aria-labelledby": ariaLabelledby,
      autofocus: autoFocus,
      class: readonlyDivClasses,
      id: id,
      readonly: true,
      // @ts-ignore
      ref: elementRef,
      type: type,
      value: value
    });
  }

  if (as === 'textarea') {
    return jsx("textarea", Object.assign({
      "aria-label": ariaLabelForReadonly,
      "aria-labelledby": ariaLabelledby,
      autofocus: autoFocus,
      class: readonlyDivClasses,
      id: id,
      readonly: true,
      // @ts-ignore
      ref: elementRef,
      rows: rows
    }, {
      children: value
    }));
  }

  return jsx("div", Object.assign({
    "aria-label": ariaLabelForReadonly,
    "aria-labelledby": ariaLabelledby,
    "aria-readonly": true,
    autofocus: autoFocus,
    class: readonlyDivClasses,
    // @ts-ignore
    ref: elementRef,
    role: "textbox",
    tabIndex: 0
  }, {
    children: value
  }));
}

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
  const classes = classNames([textFieldStyles.base, !readonly && textFieldStyles.nonReadonly]);
  return classes;
};
const getReadonlyClasses = (isInsideNonReadonlyForm, hasInsideLabel, variant) => {
  const classes = classNames([readonlyStyles.base, variant === 'textarea' && readonlyStyles.textarea, isInsideNonReadonlyForm ? readonlyStyles.insideEnabledForm : readonlyStyles.notInsideEnabledForm, variant === 'textarea' && !isInsideNonReadonlyForm && readonlyStyles.textareaNotInsideEnabledForm, isInsideNonReadonlyForm && hasInsideLabel && readonlyStyles.insideEnabledFormLabelInside]);
  return classes;
};
const getInputId = id => {
  return (id !== null && id !== void 0 ? id : '') + '|input';
};
const isInputPlaceholderShown = (hasInsideLabel, hasValue, isFocused) => {
  return !(hasInsideLabel && !hasValue && !isFocused);
};

const StartTopLabelReadonlyTextField = (_a) => {
    var { outerClassNames, innerClassNames, label, labelEdge, labelStartWidth, inlineUserAssistance, children } = _a, props = __rest(_a, ["outerClassNames", "innerClassNames", "label", "labelEdge", "labelStartWidth", "inlineUserAssistance", "children"]);
    return (jsxs("div", Object.assign({}, props, { class: outerClassNames }, { children: [jsx(LabelValueLayout, Object.assign({ label: label, labelEdge: labelEdge, labelStartWidth: labelStartWidth }, { children: jsx("div", Object.assign({ class: innerClassNames }, { children: children })) })), inlineUserAssistance] })));
};
const InsideLabelReadonlyTextField = (_a) => {
    var { outerClassNames, innerClassNames, inlineUserAssistance, children } = _a, props = __rest(_a, ["outerClassNames", "innerClassNames", "inlineUserAssistance", "children"]);
    return (jsxs("div", Object.assign({}, props, { class: outerClassNames }, { children: [jsx("div", Object.assign({ class: innerClassNames }, { children: children })), inlineUserAssistance] })));
};
const ReadonlyTextField = (_a) => {
    var { label, labelEdge, children, variant } = _a, props = __rest(_a, ["label", "labelEdge", "children", "variant"]);
    const { isFormLayout, isReadonly: isReadonlyForm } = useFormContext();
    const { isLoading } = useFormFieldContext();
    const hasInsideLabel = label !== undefined && labelEdge === 'inside';
    // TODO: We need to re-evaluate how we use CSS multi-classing to our VDOM components
    const formControlClassNames = getFormControlClasses(hasInsideLabel);
    const textFieldClassNames = getTextFieldClasses(true);
    const readonlyClassNames = getReadonlyClasses(isFormLayout && !isReadonlyForm, hasInsideLabel, variant);
    const outerClassNames = classNames([formControlClassNames, textFieldClassNames]);
    const innerClassNames = classNames([readonlyClassNames, isLoading && loadingStyles]);
    if (label !== undefined && (labelEdge === 'start' || labelEdge === 'top')) {
        return (jsx(StartTopLabelReadonlyTextField, Object.assign({ outerClassNames: outerClassNames, innerClassNames: innerClassNames, label: label, labelEdge: labelEdge }, props, { children: children })));
    }
    return (jsxs(InsideLabelReadonlyTextField, Object.assign({ outerClassNames: outerClassNames, innerClassNames: innerClassNames }, props, { children: [label, children] })));
};

function _arity$2(n, fn) {
  /* eslint-disable no-unused-vars */
  switch (n) {
    case 0:
      return function () {
        return fn.apply(this, arguments);
      };

    case 1:
      return function (a0) {
        return fn.apply(this, arguments);
      };

    case 2:
      return function (a0, a1) {
        return fn.apply(this, arguments);
      };

    case 3:
      return function (a0, a1, a2) {
        return fn.apply(this, arguments);
      };

    case 4:
      return function (a0, a1, a2, a3) {
        return fn.apply(this, arguments);
      };

    case 5:
      return function (a0, a1, a2, a3, a4) {
        return fn.apply(this, arguments);
      };

    case 6:
      return function (a0, a1, a2, a3, a4, a5) {
        return fn.apply(this, arguments);
      };

    case 7:
      return function (a0, a1, a2, a3, a4, a5, a6) {
        return fn.apply(this, arguments);
      };

    case 8:
      return function (a0, a1, a2, a3, a4, a5, a6, a7) {
        return fn.apply(this, arguments);
      };

    case 9:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
        return fn.apply(this, arguments);
      };

    case 10:
      return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
        return fn.apply(this, arguments);
      };

    default:
      throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
  }
}

var _arity_1 = _arity$2;

var _arity$1 =

_arity_1;

var _isPlaceholder =

_isPlaceholder_1;
/**
 * Internal curryN function.
 *
 * @private
 * @category Function
 * @param {Number} length The arity of the curried function.
 * @param {Array} received An array of arguments received thus far.
 * @param {Function} fn The function to curry.
 * @return {Function} The curried function.
 */


function _curryN$1(length, received, fn) {
  return function () {
    var combined = [];
    var argsIdx = 0;
    var left = length;
    var combinedIdx = 0;

    while (combinedIdx < received.length || argsIdx < arguments.length) {
      var result;

      if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
        result = received[combinedIdx];
      } else {
        result = arguments[argsIdx];
        argsIdx += 1;
      }

      combined[combinedIdx] = result;

      if (!_isPlaceholder(result)) {
        left -= 1;
      }

      combinedIdx += 1;
    }

    return left <= 0 ? fn.apply(this, combined) : _arity$1(left, _curryN$1(length, combined, fn));
  };
}

var _curryN_1 = _curryN$1;

var _arity =

_arity_1;

var _curry1$1 =

_curry1_1;

var _curry2 =

_curry2_1;

var _curryN =

_curryN_1;
/**
 * Returns a curried equivalent of the provided function, with the specified
 * arity. The curried function has two unusual capabilities. First, its
 * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.5.0
 * @category Function
 * @sig Number -> (* -> a) -> (* -> a)
 * @param {Number} length The arity for the returned function.
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curry
 * @example
 *
 *      const sumArgs = (...args) => R.sum(args);
 *
 *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */


var curryN$1 =
/*#__PURE__*/
_curry2(function curryN(length, fn) {
  if (length === 1) {
    return _curry1$1(fn);
  }

  return _arity(length, _curryN(length, [], fn));
});

var curryN_1 = curryN$1;

var _curry1 =

_curry1_1;

var curryN =

curryN_1;
/**
 * Returns a curried equivalent of the provided function. The curried function
 * has two unusual capabilities. First, its arguments needn't be provided one
 * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
 * following are equivalent:
 *
 *   - `g(1)(2)(3)`
 *   - `g(1)(2, 3)`
 *   - `g(1, 2)(3)`
 *   - `g(1, 2, 3)`
 *
 * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
 * "gaps", allowing partial application of any combination of arguments,
 * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
 * the following are equivalent:
 *
 *   - `g(1, 2, 3)`
 *   - `g(_, 2, 3)(1)`
 *   - `g(_, _, 3)(1)(2)`
 *   - `g(_, _, 3)(1, 2)`
 *   - `g(_, 2)(1)(3)`
 *   - `g(_, 2)(1, 3)`
 *   - `g(_, 2)(_, 3)(1)`
 *
 * @func
 * @memberOf R
 * @since v0.1.0
 * @category Function
 * @sig (* -> a) -> (* -> a)
 * @param {Function} fn The function to curry.
 * @return {Function} A new, curried function.
 * @see R.curryN, R.partial
 * @example
 *
 *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
 *
 *      const curriedAddFourNumbers = R.curry(addFourNumbers);
 *      const f = curriedAddFourNumbers(1, 2);
 *      const g = f(3);
 *      g(4); //=> 10
 */


var curry =
/*#__PURE__*/
_curry1(function curry(fn) {
  return curryN(fn.length, fn);
});

var curry_1 = curry;

const ojButtonHeight = '2.75rem'; // TODO: replace this with var(--oj-button-sm-height) once it is available

const ojButtonSmHeight = '2.25rem'; // TODO: replace this with var(--oj-button-icon-size) once it is available

const ojButtonIconSize = 'var(--oj-c-PRIVATE-DO-NOT-USE-core-icon-size-lg)'; // TODO: replace this with var(--oj-button-sm-icon-size) once it is available

const ojButtonSmIconSize = '1.25rem';
const textFieldContainerStyles = {
  base: "bpxth0a",
  textarea: "t1nwf48c",
  labelInside: "l1asas25",
  focused: "f1fkvmlv",
  resize: {
    both: "byvh15",
    horizontal: "haatqwl",
    vertical: "vnx52bj"
  },
  disabled: "de62cmy",
  error: "ewejuy9",
  warning: "w1ywmvcj"
};
const containerContentVariantStyles = {
  textarea: textFieldContainerStyles.textarea,
  textareaError: textFieldContainerStyles.textarea,
  textareaWarning: textFieldContainerStyles.textarea
};
const containerStatusVariantStyles = {
  error: textFieldContainerStyles.error,
  textareaError: textFieldContainerStyles.error,
  warning: textFieldContainerStyles.warning,
  textareaWarning: textFieldContainerStyles.warning
};
const getStyle = curry_1((styles, variant) => variant && styles[variant]);
const getContainerContentVariantStyles = getStyle(containerContentVariantStyles);
const getContainerStatusVariantStyles = getStyle(containerStatusVariantStyles);
const textFieldStartContentStyles = {
  base: "bwv846o",
  labelInside: "l4zuwwr",
  disabled: "deqisnl"
};
const textFieldMiddleStyles = {
  base: "b1g2m4fu",
  textarea: "ti5cls5"
};
const middleContentVariantStyles = {
  textarea: textFieldMiddleStyles.textarea,
  textareaError: textFieldMiddleStyles.textarea,
  textareaWarning: textFieldMiddleStyles.textarea
};
const getMiddleContentVariantStyles = getStyle(middleContentVariantStyles);
const textFieldEndContentStyles = {
  base: "b1m9i38d",
  labelInside: "loikvln"
}; // Renders the oj-text-field-container dom which includes the
// start, middle (where the inside label and inputElem goes),
// and end pieces of the form component.
// This does not include user assistance because that is rendered outside the
// oj-text-field-container; that is rendered in the TextField component.

const TextFieldContent = ({
  insideLabel,
  mainContent,
  startContent,
  endContent,
  resize,
  variant,
  rootRef
}) => {
  const {
    isDisabled,
    isFocused,
    isLoading
  } = useFormFieldContext();
  let statusVariant = variant === null || variant === void 0 ? void 0 : variant.toLowerCase().replace('textarea', ''); // if statusVariant is the empty string, set to undefined

  statusVariant = statusVariant ? statusVariant : undefined;
  const rootStyles = classNames([textFieldContainerStyles.base, insideLabel !== undefined && textFieldContainerStyles.labelInside, resize && textFieldContainerStyles.resize[resize], isFocused && textFieldContainerStyles.focused, isDisabled ? textFieldContainerStyles.disabled : classNames([getContainerStatusVariantStyles(variant), // TODO: don't use class names: https://jira.oraclecorp.com/jira/browse/JET-50572
  variant && `oj-c-text-field-${statusVariant}`]), isLoading && loadingStyles, getContainerContentVariantStyles(variant)]);
  const startContentStyles = classNames([textFieldStartContentStyles.base, insideLabel != undefined && textFieldStartContentStyles.labelInside, isDisabled && textFieldStartContentStyles.disabled]);
  const middleStyles = classNames([textFieldMiddleStyles.base, getMiddleContentVariantStyles(variant)]);
  const endContentStyles = classNames([textFieldEndContentStyles.base, insideLabel != undefined && textFieldEndContentStyles.labelInside]);
  return jsxs("div", Object.assign({
    role: "presentation",
    class: rootStyles,
    ref: rootRef
  }, {
    children: [startContent && jsx("span", Object.assign({
      class: startContentStyles
    }, {
      children: jsx(Flex, Object.assign({
        justify: "center",
        align: "center"
      }, {
        children: startContent
      }))
    })), jsxs("div", Object.assign({
      class: middleStyles
    }, {
      children: [insideLabel, mainContent]
    })), endContent && jsx("span", Object.assign({
      class: endContentStyles
    }, {
      children: jsx(Flex, Object.assign({
        justify: "center",
        align: "center"
      }, {
        children: endContent
      }))
    }))]
  }));
};

const StyledTextField = (_a) => {
    var { hasInsideLabel = false } = _a, props = __rest(_a, ["hasInsideLabel"]);
    const { isReadonly } = useFormFieldContext();
    // TODO: We need to re-evaluate how we use CSS multi-classing to our VDOM components
    const formControlClassNames = getFormControlClasses(hasInsideLabel);
    const textFieldClassNames = getTextFieldClasses(isReadonly);
    const cssClassNames = classNames([formControlClassNames, textFieldClassNames]);
    return jsx("div", Object.assign({}, props, { class: cssClassNames }));
};

// TODO: Do we need named props for start/endContent, or could they just be children that get
// wrapped in a flex layout?  (from review on 3/8/22)
// TODO: Instead of passing the inputElem, label, and userAssistance as named props here, should we
// have a separate layout component that lays them out, which could just be passed as a child
// to the TextField?  (from review on 3/8/22)
const TextField = ({ id, endContent, mainContent, startContent, inlineUserAssistance, label, labelEdge, labelStartWidth, mainFieldRef, resize, variant, onFocus, onBlur, onKeyDown, onMouseDown, onMouseEnter, onMouseLeave }) => {
    // TODO: What are the implications for interoperability between new preact-based form components
    // and the existing JET oj-form-layout?  The preact form components create their own start/top
    // labels, while oj-form-layout expects to create those itself and wire them to the existing form
    // components through attributes like labelled-by.  (from review on 3/8/22)
    // TODO: How should a parent form component render component-specific content within TextField,
    // for example an aria live region?  Instead of a children prop on TextField, could the parent
    // component pass comp-specific content through other props, like inputElem?   The parent could
    // have its own component that composes inputElem with additional DOM.  (from review on 3/8/22)
    const styledTextFieldChildren = label !== undefined && (labelEdge === 'start' || labelEdge === 'top') ? (jsx(LabelValueLayout, Object.assign({ label: label, labelEdge: labelEdge, labelStartWidth: labelStartWidth }, { children: jsxs(Fragment, { children: [jsx(TextFieldContent, { startContent: startContent, mainContent: mainContent, endContent: endContent, resize: resize, variant: variant, rootRef: mainFieldRef }), inlineUserAssistance] }) }))) : (jsxs(Fragment, { children: [jsx(TextFieldContent, { insideLabel: label, startContent: startContent, mainContent: mainContent, endContent: endContent, resize: resize, variant: variant, rootRef: mainFieldRef }), inlineUserAssistance] }));
    return (jsx(StyledTextField, Object.assign({ id: id, hasInsideLabel: label !== undefined && labelEdge === 'inside', onfocusin: onFocus, onfocusout: onBlur, onKeyDown: onKeyDown, onMouseDown: onMouseDown, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, { children: styledTextFieldChildren })));
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
const interpolations = [...Object.values(textInterpolations)];
const styleInterpolations = mergeInterpolations(interpolations);
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
      props = __rest(_a, ["as", "ariaAutocomplete", "ariaControls", "ariaDescribedby", "ariaExpanded", "ariaInvalid", "ariaLabel", "ariaLabelledby", "autoComplete", "autoFocus", "hasEndContent", "hasInsideLabel", "hasStartContent", "id", "inputRef", "placeholder", "isRequired", "role", "rows", "spellcheck", "type", "value", "onInput", "onCommit", "onKeyDown", "onKeyUp"]);

  const hasValue = value !== '';
  const {
    isDisabled,
    isFocused,
    isLoading,
    isReadonly
  } = useFormFieldContext();
  const myPlaceholder = isInputPlaceholderShown(hasInsideLabel, hasValue, isFocused) ? placeholder : undefined;
  const {
    class: styleInterpolationClasses
  } = styleInterpolations(props);
  const inputClasses = classNames(['oj-c-text-field-input', rootStyles.base, as === 'textarea' && rootStyles.textarea, hasInsideLabel && classNames([rootStyles.labelInsideBase, as === 'textarea' && rootStyles.textareaLabelInsideBase, !hasValue && isFocused && rootStyles.labelInsideNoValueAndHasFocus]), hasStartContent && rootStyles.hasStartContent, hasEndContent && rootStyles.hasEndContent, isDisabled && rootStyles.disabled, styleInterpolationClasses]);
  const Comp = as || 'input';
  const handlers = useTextFieldInputHandlers({
    value,
    onInput,
    onCommit,
    onKeyDown
  }); // the implicit default for tabindex on an input is 0, so do not explicitly set it.
  // TODO: for autoComplete='off', need to configure attrs appropriately to make sure it
  // works across browsers and versions  (from review on 3/11/22)

  return jsx(Comp, Object.assign({
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

const MAX_LENGTH_UPDATE_DELAY = 500;
function MaxLengthLiveRegion({ isMaxLengthExceeded, maxLength, valueLength = 0 }) {
    // Comment copied from InputBase.js in Big JET:
    // Only update the aria-live div when the user has paused for more than
    // 500 milliseconds. That way, we avoid queued up aria-live messages which
    // would be annoying and not helpful. The 500ms was agreed upon in the
    // accessibility review meeting.
    const debouncedRemainingChars = useDebounce(maxLength - valueLength, MAX_LENGTH_UPDATE_DELAY);
    const translations = useTranslationBundle('@oracle/oraclejet-preact');
    const maxLengthExceededTranslatedString = translations.formControl_maxLengthExceeded({
        MAX_LENGTH: `${maxLength}`
    });
    const remainingCharsTranslatedString = translations.formControl_maxLengthRemaining({
        CHARACTER_COUNT: `${debouncedRemainingChars}`
    });
    return (jsxs(Fragment, { children: [jsx(LiveRegion, { children: remainingCharsTranslatedString }), isMaxLengthExceeded && (jsx(LiveRegion, Object.assign({ type: "assertive" }, { children: maxLengthExceededTranslatedString })))] }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { MaxLengthLiveRegion, ReadonlyTextField, ReadonlyTextFieldInput, TextField, TextFieldInput, getInputId };
/*  */
//# sourceMappingURL=UNSAFE_TextField.js.map
