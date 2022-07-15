/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
require('./utils/UNSAFE_classNames.js');
require('identity-obj-proxy');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var classNames = require('./classNames-69178ebf.js');
require('preact');
require('preact/hooks');

const labelStyles = {
  base: "bqpszk1",
  startBase: "s8tyzhy",
  topBase: "t1nf0aj6",
  insideBase: "ibq10wn",
  insideReadonlyInEnabledForm: "itgrc9d",
  insideReadonlyNotInEnabledForm: "iurpzj3",
  insideNonReadonly: "im4lvc5",
  insideNonReadonlyHasValue: "i3diidy",
  insideDisabled: "i1jkkk8p",
  insideFocused: "i1fr54gj",
  insideError: "ilnjrnk",
  insideWarning: "i1p5m3qn",
  noWrap: "n8alcy4"
};

const StyledLabel = _a => {
  var {
    hasValue,
    readonly,
    disabled,
    isFocused,
    variant = 'inside'
  } = _a,
      props = tslib_es6.__rest(_a, ["hasValue", "readonly", "disabled", "isFocused", "variant"]);

  const {
    isFormLayout,
    isReadonly: isReadonlyForm,
    labelWrapping
  } = hooks_UNSAFE_useFormContext.useFormContext();
  const cssClassNames = variant === 'inside' || variant === 'insideError' || variant === 'insideWarning' ? classNames.classNames([labelStyles.base, labelStyles.insideBase, readonly && (isFormLayout && !isReadonlyForm ? labelStyles.insideReadonlyInEnabledForm : labelStyles.insideReadonlyNotInEnabledForm), !readonly && labelStyles.insideNonReadonly, !readonly && (hasValue || isFocused) && labelStyles.insideNonReadonlyHasValue, !readonly && isFocused && labelStyles.insideFocused, disabled && labelStyles.insideDisabled, !disabled && !readonly && (variant === 'insideError' || variant === 'insideWarning') && labelStyles[variant]]) : variant === 'start' ? classNames.classNames([labelStyles.base, labelStyles.startBase, labelWrapping === 'truncate' && labelStyles.noWrap]) : variant === 'top' ? classNames.classNames([labelStyles.base, labelStyles.topBase, labelWrapping === 'truncate' && labelStyles.noWrap]) : undefined; // TODO: We need to decide whether to standardize on 'class' or 'className'.  Otherwise, we'll
  // run into issues destructuring style interpolations, for example having to concatenate both.

  return jsxRuntime.jsx("label", Object.assign({}, props, {
    class: cssClassNames
  }));
};

const Label = _a => {
  var {
    forId
  } = _a,
      props = tslib_es6.__rest(_a, ["forId"]);

  const {
    hasValue,
    isDisabled,
    isFocused,
    isReadonly
  } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
  return jsxRuntime.jsx(StyledLabel, Object.assign({
    for: forId,
    hasValue: hasValue,
    disabled: isDisabled,
    isFocused: isFocused,
    readonly: isReadonly
  }, props));
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.Label = Label;
/*  */
//# sourceMappingURL=UNSAFE_Label.js.map
