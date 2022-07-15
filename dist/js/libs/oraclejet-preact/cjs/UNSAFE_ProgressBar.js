/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-5c843188.js');
var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');
require('identity-obj-proxy');
var hooks_UNSAFE_useUser = require('./hooks/UNSAFE_useUser.js');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var classNames = require('./classNames-69178ebf.js');
require('preact/hooks');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');

function ProgressBar(_a) {
  var {
    value,
    max
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["value", "max"]);

  return value === 'indeterminate' ? jsxRuntime.jsx(IndeterminateProgressBar, Object.assign({}, otherProps)) : jsxRuntime.jsx(DeterminateProgressBar, Object.assign({
    value: value,
    max: max
  }, otherProps));
}

const IndeterminateProgressBar = ({
  accessibleLabel,
  id,
  width,
  edge = 'none'
}) => {
  const {
    direction
  } = hooks_UNSAFE_useUser.useUser();
  const classes = classNames.classNames([styles.value, styles.indeterminate, styles[direction]]);
  const baseClasses = classNames.classNames([styles.base, edge === 'none' && styles.standalone]);
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  return jsxRuntime.jsx(BarTrack, Object.assign({
    id: id,
    ariaValueText: accessibleLabel || translations.progressIndeterminate(),
    class: baseClasses,
    width: width
  }, {
    children: jsxRuntime.jsx(BarValue, {
      class: classes
    })
  }));
};

const DeterminateProgressBar = ({
  value = 0,
  max = 100,
  id,
  width,
  edge = 'none'
}) => {
  const percentage = `${Math.min(Math.max(0, value / max), 1) * 100}%`;
  const baseClasses = classNames.classNames([styles.base, edge === 'none' && styles.standalone]);
  return jsxRuntime.jsx(BarTrack, Object.assign({
    value: value,
    max: max,
    id: id,
    width: width,
    class: baseClasses
  }, {
    children: jsxRuntime.jsx(BarValue, {
      class: styles.value,
      width: percentage
    })
  }));
};

const BarTrack = _a => {
  var {
    value,
    max,
    min,
    id,
    width,
    children,
    ariaValueText,
    color
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["value", "max", "min", "id", "width", "children", "ariaValueText", "color"]);

  const ariaMin = value != null ? min ? min : '0' : null;
  const ariaMax = value != null ? max : null;
  const ariaNow = value != null ? value : null;
  return jsxRuntime.jsx("div", Object.assign({
    role: "progressbar",
    id: id,
    "aria-valuemin": ariaMin,
    "aria-valuemax": ariaMax,
    "aria-valuenow": ariaNow,
    "aria-valuetext": ariaValueText,
    class: otherProps.class,
    style: {
      width: width,
      backgroundColor: color
    }
  }, {
    children: children
  }));
};

const BarValue = _a => {
  var {
    width,
    color
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["width", "color"]);

  return jsxRuntime.jsx("div", {
    class: otherProps.class,
    style: {
      width: width,
      backgroundColor: color
    }
  });
};

const styles = {
  base: "b1ivnjsl",
  value: "vv4ipiv",
  indeterminate: "i16t7nhx",
  standalone: "s1bvzqgk",
  rtl: "r7hk5fg",
  ltr: "luxx1rg"
};

exports.ProgressBar = ProgressBar;
/*  */
//# sourceMappingURL=UNSAFE_ProgressBar.js.map
