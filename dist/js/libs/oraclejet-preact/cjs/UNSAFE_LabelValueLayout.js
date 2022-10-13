/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');
require('identity-obj-proxy');
require('./UNSAFE_Flex.js');
var hooks_UNSAFE_useFormContext = require('./hooks/UNSAFE_useFormContext.js');
var hooks_UNSAFE_useFormFieldContext = require('./hooks/UNSAFE_useFormFieldContext.js');
var utils_UNSAFE_size = require('./utils/UNSAFE_size.js');
var classNames = require('./classNames-82bfab52.js');
var Flex = require('./Flex-327ae051.js');
require('./tslib.es6-e91f819d.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_arrayUtils.js');
require('./_curry1-94f22a19.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-e6dc9cf1.js');
require('./_has-556488e4.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-0a611b24.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');
require('preact');
require('preact/hooks');

const labelSlotStyles = {
  base: "_679b43",
  start: "_dhalxg",
  top: "aa00qt",
  topPureReadonly: "zf108r"
};
const labelInnerStyles = {
  // base is labelEdge 'top'
  base: "_w9jxr",
  start: "l9bvr2",
  startNotPureReadonly: "bwq2w7",
  // TODO: Use Text Component instead of CSS
  noWrap: "_qu2y3"
};
const valueSlotStyles = "g03sh4";
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
