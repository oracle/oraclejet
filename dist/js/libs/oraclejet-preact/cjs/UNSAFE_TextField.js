/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
require('identity-obj-proxy');
require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_interpolations_text = require('./utils/UNSAFE_interpolations/text.js');
var utils_UNSAFE_mergeInterpolations = require('./utils/UNSAFE_mergeInterpolations.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var TextFieldInput = require('./TextFieldInput-40fdc487.js');
var classNames = require('./classNames-82bfab52.js');
var UNSAFE_LabelValueLayout = require('./UNSAFE_LabelValueLayout.js');
var preact = require('preact');
require('./UNSAFE_Flex.js');
var _curry1$2 = require('./_curry1-94f22a19.js');
var _curry2$1 = require('./_curry2-e6dc9cf1.js');
var Flex = require('./Flex-327ae051.js');
var hooks_UNSAFE_useDebounce = require('./hooks/UNSAFE_useDebounce.js');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var UNSAFE_LiveRegion = require('./UNSAFE_LiveRegion.js');
require('preact/hooks');
require('./keys-0a611b24.js');
require('./_has-556488e4.js');
require('./hooks/UNSAFE_useTextFieldInputHandlers.js');
require('./utils/PRIVATE_clientHints.js');
require('./clientHints-d9b5605d.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');
require('./UNSAFE_Environment.js');
require('./UNSAFE_Layer.js');
require('preact/compat');

// and the textarea, so the the textarea's focus outline doesn't get truncated.
// The 0.25rem is an aesthetically pleasing amount of margin to make the readonly
// focus ring visible.

const borderToTextAreaContentMargin = '0.25rem';
const readOnlyTextFieldStyles = {
  base: "_n1b6om",
  textareaBase: "znllbr",
  inEnabledFormBase: "_psuy0h",
  textareaInEnabledFormBase: "_qrph7n",
  inEnabledFormLabelInside: "_eeetkl",
  textareaInEnabledFormLabelInside: "_bmdju7",
  inEnabledFormNoLabelInside: "zr8b2q",
  // don't apply this for textarea
  inEnabledFormNoStartContent: "wg3pte"
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
      props = tslib_es6.__rest(_a, ["ariaLabel", "ariaLabelledby", "autoFocus", "as", "elementRef", "hasInsideLabel", "id", "inlineUserAssistance", "innerReadonlyField", "rows", "type", "value"]);

  const {
    isFormLayout,
    isReadonly: isReadonlyForm
  } = hooks_UNSAFE_useFormContext.useFormContext();
  const {
    isLoading
  } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
  const ariaLabelForReadonly = isLoading ? TextFieldInput.getLoadingAriaLabel() : ariaLabel; // get classes for text align

  const interpolations = [...Object.values(utils_UNSAFE_interpolations_text.textInterpolations)];
  const styleInterpolations = utils_UNSAFE_mergeInterpolations.mergeInterpolations(interpolations);
  const {
    class: styleInterpolationClasses
  } = styleInterpolations(props);
  const readonlyDivClasses = classNames.classNames([as !== 'textarea' && 'oj-c-hide-scrollbar', readOnlyTextFieldStyles.base, as === 'textarea' && readOnlyTextFieldStyles.textareaBase, isFormLayout && !isReadonlyForm && readOnlyTextFieldStyles.inEnabledFormBase, as === 'textarea' && isFormLayout && !isReadonlyForm && readOnlyTextFieldStyles.textareaInEnabledFormBase, isFormLayout && !isReadonlyForm && (hasInsideLabel ? readOnlyTextFieldStyles.inEnabledFormLabelInside : readOnlyTextFieldStyles.inEnabledFormNoLabelInside), as === 'textarea' && isFormLayout && !isReadonlyForm && hasInsideLabel && readOnlyTextFieldStyles.textareaInEnabledFormLabelInside, as !== 'textarea' && // not for textarea element
  isFormLayout && !isReadonlyForm && readOnlyTextFieldStyles.inEnabledFormNoStartContent, styleInterpolationClasses]);

  if (as === 'input') {
    return jsxRuntime.jsx("input", {
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
    return jsxRuntime.jsx("textarea", Object.assign({
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

  return jsxRuntime.jsx("div", Object.assign({
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

const StartTopLabelReadonlyTextField = (_a) => {
    var { outerClassNames, innerClassNames, label, labelEdge, labelStartWidth, inlineUserAssistance, children } = _a, props = tslib_es6.__rest(_a, ["outerClassNames", "innerClassNames", "label", "labelEdge", "labelStartWidth", "inlineUserAssistance", "children"]);
    return (jsxRuntime.jsxs("div", Object.assign({}, props, { class: outerClassNames }, { children: [jsxRuntime.jsx(UNSAFE_LabelValueLayout.LabelValueLayout, Object.assign({ label: label, labelEdge: labelEdge, labelStartWidth: labelStartWidth }, { children: jsxRuntime.jsx("div", Object.assign({ class: innerClassNames }, { children: children })) })), inlineUserAssistance] })));
};
const InsideLabelReadonlyTextField = (_a) => {
    var { outerClassNames, innerClassNames, inlineUserAssistance, children } = _a, props = tslib_es6.__rest(_a, ["outerClassNames", "innerClassNames", "inlineUserAssistance", "children"]);
    return (jsxRuntime.jsxs("div", Object.assign({}, props, { class: outerClassNames }, { children: [jsxRuntime.jsx("div", Object.assign({ class: innerClassNames }, { children: children })), inlineUserAssistance] })));
};
const ReadonlyTextField = (_a) => {
    var { label, labelEdge, children, variant } = _a, props = tslib_es6.__rest(_a, ["label", "labelEdge", "children", "variant"]);
    const { isFormLayout, isReadonly: isReadonlyForm } = hooks_UNSAFE_useFormContext.useFormContext();
    const { isLoading } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
    const hasInsideLabel = label !== undefined && labelEdge === 'inside';
    // TODO: We need to re-evaluate how we use CSS multi-classing to our VDOM components
    const formControlClassNames = TextFieldInput.getFormControlClasses(hasInsideLabel);
    const textFieldClassNames = TextFieldInput.getTextFieldClasses(true);
    const readonlyClassNames = TextFieldInput.getReadonlyClasses(isFormLayout && !isReadonlyForm, hasInsideLabel, variant);
    const outerClassNames = classNames.classNames([formControlClassNames, textFieldClassNames]);
    const innerClassNames = classNames.classNames([readonlyClassNames, isLoading && TextFieldInput.loadingStyles]);
    if (label !== undefined && (labelEdge === 'start' || labelEdge === 'top')) {
        return (jsxRuntime.jsx(StartTopLabelReadonlyTextField, Object.assign({ outerClassNames: outerClassNames, innerClassNames: innerClassNames, label: label, labelEdge: labelEdge }, props, { children: children })));
    }
    return (jsxRuntime.jsxs(InsideLabelReadonlyTextField, Object.assign({ outerClassNames: outerClassNames, innerClassNames: innerClassNames }, props, { children: [label, children] })));
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

_curry1$2._isPlaceholder_1;
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

_curry1$2._curry1_1;

var _curry2 =

_curry2$1._curry2_1;

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

_curry1$2._curry1_1;

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
  base: "jrzml0",
  textarea: "_9mcyl0",
  labelInside: "j78ji5",
  focused: "_lxrr59",
  resize: {
    both: "_r7uwp3",
    horizontal: "_ungs9n",
    vertical: "_jpfde"
  },
  disabled: "_1fz7c7",
  error: "j6tnap",
  warning: "_qd3ih"
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
  base: "vnnb98",
  labelInside: "_wv3kzo",
  disabled: "_pxtnet"
};
const textFieldMiddleStyles = {
  base: "ftj5wx",
  textarea: "qnnx9f"
};
const middleContentVariantStyles = {
  textarea: textFieldMiddleStyles.textarea,
  textareaError: textFieldMiddleStyles.textarea,
  textareaWarning: textFieldMiddleStyles.textarea
};
const getMiddleContentVariantStyles = getStyle(middleContentVariantStyles);
const textFieldEndContentStyles = {
  base: "_w86pwh",
  labelInside: "_mlam0"
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
  } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
  let statusVariant = variant === null || variant === void 0 ? void 0 : variant.toLowerCase().replace('textarea', ''); // if statusVariant is the empty string, set to undefined

  statusVariant = statusVariant ? statusVariant : undefined;
  const rootStyles = classNames.classNames([textFieldContainerStyles.base, insideLabel !== undefined && textFieldContainerStyles.labelInside, resize && textFieldContainerStyles.resize[resize], isFocused && textFieldContainerStyles.focused, isDisabled ? textFieldContainerStyles.disabled : classNames.classNames([getContainerStatusVariantStyles(variant), // TODO: don't use class names: https://jira.oraclecorp.com/jira/browse/JET-50572
  variant && `oj-c-text-field-${statusVariant}`]), isLoading && TextFieldInput.loadingStyles, getContainerContentVariantStyles(variant)]);
  const startContentStyles = classNames.classNames([textFieldStartContentStyles.base, insideLabel != undefined && textFieldStartContentStyles.labelInside, isDisabled && textFieldStartContentStyles.disabled]);
  const middleStyles = classNames.classNames([textFieldMiddleStyles.base, getMiddleContentVariantStyles(variant)]);
  const endContentStyles = classNames.classNames([textFieldEndContentStyles.base, insideLabel != undefined && textFieldEndContentStyles.labelInside]);
  return jsxRuntime.jsxs("div", Object.assign({
    role: "presentation",
    class: rootStyles,
    ref: rootRef
  }, {
    children: [startContent && jsxRuntime.jsx("span", Object.assign({
      class: startContentStyles
    }, {
      children: jsxRuntime.jsx(Flex.Flex, Object.assign({
        justify: "center",
        align: "center"
      }, {
        children: startContent
      }))
    })), jsxRuntime.jsxs("div", Object.assign({
      class: middleStyles
    }, {
      children: [insideLabel, mainContent]
    })), endContent && jsxRuntime.jsx("span", Object.assign({
      class: endContentStyles
    }, {
      children: jsxRuntime.jsx(Flex.Flex, Object.assign({
        justify: "center",
        align: "center"
      }, {
        children: endContent
      }))
    }))]
  }));
};

const StyledTextField = (_a) => {
    var { hasInsideLabel = false } = _a, props = tslib_es6.__rest(_a, ["hasInsideLabel"]);
    const { isReadonly } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
    // TODO: We need to re-evaluate how we use CSS multi-classing to our VDOM components
    const formControlClassNames = TextFieldInput.getFormControlClasses(hasInsideLabel);
    const textFieldClassNames = TextFieldInput.getTextFieldClasses(isReadonly);
    const cssClassNames = classNames.classNames([formControlClassNames, textFieldClassNames]);
    return jsxRuntime.jsx("div", Object.assign({}, props, { class: cssClassNames }));
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
    const styledTextFieldChildren = label !== undefined && (labelEdge === 'start' || labelEdge === 'top') ? (jsxRuntime.jsx(UNSAFE_LabelValueLayout.LabelValueLayout, Object.assign({ label: label, labelEdge: labelEdge, labelStartWidth: labelStartWidth }, { children: jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx(TextFieldContent, { startContent: startContent, mainContent: mainContent, endContent: endContent, resize: resize, variant: variant, rootRef: mainFieldRef }), inlineUserAssistance] }) }))) : (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx(TextFieldContent, { insideLabel: label, startContent: startContent, mainContent: mainContent, endContent: endContent, resize: resize, variant: variant, rootRef: mainFieldRef }), inlineUserAssistance] }));
    return (jsxRuntime.jsx(StyledTextField, Object.assign({ id: id, hasInsideLabel: label !== undefined && labelEdge === 'inside', onfocusin: onFocus, onfocusout: onBlur, onKeyDown: onKeyDown, onMouseDown: onMouseDown, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, { children: styledTextFieldChildren })));
};

const MAX_LENGTH_UPDATE_DELAY = 500;
function MaxLengthLiveRegion({ isMaxLengthExceeded, maxLength, valueLength = 0 }) {
    // Comment copied from InputBase.js in Big JET:
    // Only update the aria-live div when the user has paused for more than
    // 500 milliseconds. That way, we avoid queued up aria-live messages which
    // would be annoying and not helpful. The 500ms was agreed upon in the
    // accessibility review meeting.
    const debouncedRemainingChars = hooks_UNSAFE_useDebounce.useDebounce(maxLength - valueLength, MAX_LENGTH_UPDATE_DELAY);
    const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
    const maxLengthExceededTranslatedString = translations.formControl_maxLengthExceeded({
        MAX_LENGTH: `${maxLength}`
    });
    const remainingCharsTranslatedString = translations.formControl_maxLengthRemaining({
        CHARACTER_COUNT: `${debouncedRemainingChars}`
    });
    return (jsxRuntime.jsxs(preact.Fragment, { children: [jsxRuntime.jsx(UNSAFE_LiveRegion.LiveRegion, { children: remainingCharsTranslatedString }), isMaxLengthExceeded && (jsxRuntime.jsx(UNSAFE_LiveRegion.LiveRegion, Object.assign({ type: "assertive" }, { children: maxLengthExceededTranslatedString })))] }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.TextFieldInput = TextFieldInput.TextFieldInput;
exports.getInputId = TextFieldInput.getInputId;
exports.MaxLengthLiveRegion = MaxLengthLiveRegion;
exports.ReadonlyTextField = ReadonlyTextField;
exports.ReadonlyTextFieldInput = ReadonlyTextFieldInput;
exports.TextField = TextField;
/*  */
//# sourceMappingURL=UNSAFE_TextField.js.map
