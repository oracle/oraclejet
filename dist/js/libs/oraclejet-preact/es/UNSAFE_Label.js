/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import { useFormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_Label.css';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import 'preact';
import 'preact/hooks';

const labelStyles = {
  base: "yz8etg",
  startBase: "_q3agwh",
  topBase: "_8l2kx4",
  insideBase: "_1yjqj",
  insideReadonlyInEnabledForm: "_yokbv",
  insideReadonlyNotInEnabledForm: "c737yd",
  insideNonReadonly: "v9odi8",
  insideNonReadonlyHasValue: "_qzlzu",
  insideDisabled: "_wmrmyn",
  insideFocused: "_b1rcmh",
  insideError: "_gumw1q",
  insideWarning: "_h7yz0",
  noWrap: "_g7qdqc"
};

const StyledLabel = _a => {
  var {
    hasValue,
    readonly,
    disabled,
    isFocused,
    variant = 'inside'
  } = _a,
      props = __rest(_a, ["hasValue", "readonly", "disabled", "isFocused", "variant"]);

  const {
    isFormLayout,
    isReadonly: isReadonlyForm,
    labelWrapping
  } = useFormContext();
  const cssClassNames = variant === 'inside' || variant === 'insideError' || variant === 'insideWarning' ? classNames([labelStyles.base, labelStyles.insideBase, readonly && (isFormLayout && !isReadonlyForm ? labelStyles.insideReadonlyInEnabledForm : labelStyles.insideReadonlyNotInEnabledForm), !readonly && labelStyles.insideNonReadonly, !readonly && (hasValue || isFocused) && labelStyles.insideNonReadonlyHasValue, !readonly && isFocused && labelStyles.insideFocused, disabled && labelStyles.insideDisabled, !disabled && !readonly && (variant === 'insideError' || variant === 'insideWarning') && labelStyles[variant]]) : variant === 'start' ? classNames([labelStyles.base, labelStyles.startBase, labelWrapping === 'truncate' && labelStyles.noWrap]) : variant === 'top' ? classNames([labelStyles.base, labelStyles.topBase, labelWrapping === 'truncate' && labelStyles.noWrap]) : undefined; // TODO: We need to decide whether to standardize on 'class' or 'className'.  Otherwise, we'll
  // run into issues destructuring style interpolations, for example having to concatenate both.

  return jsx("label", Object.assign({}, props, {
    class: cssClassNames
  }));
};

const Label = _a => {
  var {
    forId
  } = _a,
      props = __rest(_a, ["forId"]);

  const {
    hasValue,
    isDisabled,
    isFocused,
    isReadonly
  } = useFormFieldContext();
  return jsx(StyledLabel, Object.assign({
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

export { Label };
/*  */
//# sourceMappingURL=UNSAFE_Label.js.map
