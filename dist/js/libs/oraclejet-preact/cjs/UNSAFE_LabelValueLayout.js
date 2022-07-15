/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');
require('identity-obj-proxy');
require('./UNSAFE_Flex.js');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var utils_UNSAFE_size = require('./utils/UNSAFE_size.js');
var classNames = require('./classNames-69178ebf.js');
var Flex = require('./Flex-b2488744.js');
require('./tslib.es6-5c843188.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./_curry1-33165c71.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-bca189f8.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-40682636.js');
require('./_has-2cbf94e8.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-4bd017bf.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-c4644897.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-5f5d588b.js');
require('preact');
require('preact/hooks');

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
  const width = utils_UNSAFE_size.sizeToCSS(labelStartWidth);
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
  } = hooks_UNSAFE_useFormContext.useFormContext();
  const {
    isReadonly
  } = hooks_UNSAFE_useFormFieldContext.useFormFieldContext();
  const isPureReadonly = isFormLayout && isFormReadonly || !isFormLayout && isReadonly;
  const labelStyleClasses = classNames.classNames([labelSlotStyles.base, labelEdge === 'start' && labelSlotStyles.start, // labelEdge === 'start' && isPureReadonly && labelSlotStyles.startReadonly,
  // labelEdge === 'start' && !isPureReadonly && labelSlotStyles.startNotPureReadonly,
  labelEdge === 'top' && labelSlotStyles.top, labelEdge === 'top' && isPureReadonly && labelSlotStyles.topPureReadonly]);
  const labelInnerClasses = classNames.classNames([labelInnerStyles.base, labelEdge === 'start' && labelInnerStyles.start, labelEdge === 'start' && !isPureReadonly && labelInnerStyles.startNotPureReadonly, labelWrapping === 'truncate' && labelInnerStyles.noWrap]);
  return jsxRuntime.jsxs(Flex.Flex, Object.assign({
    wrap: "wrap",
    align: "start"
  }, {
    children: [jsxRuntime.jsx("div", Object.assign({
      class: labelStyleClasses,
      style: labelStyles
    }, {
      children: jsxRuntime.jsx("div", Object.assign({
        class: labelInnerClasses
      }, {
        children: label
      }))
    })), jsxRuntime.jsx("div", Object.assign({
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

exports.LabelValueLayout = LabelValueLayout;
/*  */
//# sourceMappingURL=UNSAFE_LabelValueLayout.js.map
