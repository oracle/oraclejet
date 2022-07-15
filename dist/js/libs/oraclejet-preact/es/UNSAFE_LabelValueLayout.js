/* @oracle/oraclejet-preact: 13.0.0 */
import { jsxs, jsx } from 'preact/jsx-runtime';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_LabelValueLayout.css';
import { Flex } from './UNSAFE_Flex.js';
import { useFormContext } from './hooks/UNSAFE_useFormContext.js';
import { useFormFieldContext } from './hooks/UNSAFE_useFormFieldContext.js';
import { sizeToCSS } from './utils/UNSAFE_size.js';
import './tslib.es6-fc945e53.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_arrayUtils.js';
import './_curry1-8b0d63fc.js';
import './utils/UNSAFE_stringUtils.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-6a0eecef.js';
import './_has-77a27fd6.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-cb973048.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';
import 'preact';
import 'preact/hooks';

const labelSlotStyles = {
  base: "b3rhoif",
  start: "s1ejed7k",
  top: "t1hxzyqn",
  topPureReadonly: "t1oxsith"
};
const labelInnerStyles = {
  // base is labelEdge 'top'
  base: "b6iz1xm",
  start: "sjye8qc",
  startNotPureReadonly: "s1ri2ukc",
  // TODO: Use Text Component instead of CSS
  noWrap: "n1b91k80"
};
const valueSlotStyles = "v3l5soi";
const LabelValueLayout = ({
  label,
  labelEdge,
  children,
  labelStartWidth = '33%'
}) => {
  const width = sizeToCSS(labelStartWidth);
  const valueWidth = `calc(100% - ${width})`;
  const labelStyles = labelEdge === 'start' ? {
    flexBasis: width,
    width: width,
    maxWidth: width
  } : {};
  const valueStyles = labelEdge === 'start' ? {
    flexBasis: valueWidth,
    width: valueWidth,
    maxWidth: valueWidth
  } : {};
  const {
    isFormLayout,
    isReadonly: isFormReadonly,
    labelWrapping
  } = useFormContext();
  const {
    isReadonly
  } = useFormFieldContext();
  const isPureReadonly = isFormLayout && isFormReadonly || !isFormLayout && isReadonly;
  const labelStyleClasses = classNames([labelSlotStyles.base, labelEdge === 'start' && labelSlotStyles.start, // labelEdge === 'start' && isPureReadonly && labelSlotStyles.startReadonly,
  // labelEdge === 'start' && !isPureReadonly && labelSlotStyles.startNotPureReadonly,
  labelEdge === 'top' && labelSlotStyles.top, labelEdge === 'top' && isPureReadonly && labelSlotStyles.topPureReadonly]);
  const labelInnerClasses = classNames([labelInnerStyles.base, labelEdge === 'start' && labelInnerStyles.start, labelEdge === 'start' && !isPureReadonly && labelInnerStyles.startNotPureReadonly, labelWrapping === 'truncate' && labelInnerStyles.noWrap]);
  return jsxs(Flex, Object.assign({
    wrap: "wrap",
    align: "start"
  }, {
    children: [jsx("div", Object.assign({
      class: labelStyleClasses,
      style: labelStyles
    }, {
      children: jsx("div", Object.assign({
        class: labelInnerClasses
      }, {
        children: label
      }))
    })), jsx("div", Object.assign({
      class: valueSlotStyles,
      style: valueStyles
    }, {
      children: children
    }))]
  }));
};

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { LabelValueLayout };
/*  */
//# sourceMappingURL=UNSAFE_LabelValueLayout.js.map
