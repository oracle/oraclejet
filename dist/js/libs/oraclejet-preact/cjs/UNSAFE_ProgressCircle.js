/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib_es6 = require('./tslib.es6-e91f819d.js');
var jsxRuntime = require('preact/jsx-runtime');
require('./utils/UNSAFE_classNames.js');
require('identity-obj-proxy');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var classNames = require('./classNames-82bfab52.js');
require('preact/hooks');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');

function ProgressCircle(_a) {
  var {
    value,
    max
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["value", "max"]);

  return value === 'indeterminate' ? jsxRuntime.jsx(IndeterminateProgressCircle, Object.assign({}, otherProps)) : jsxRuntime.jsx(DeterminateProgressCircle, Object.assign({
    value: value,
    max: max
  }, otherProps));
}

const IndeterminateProgressCircle = ({
  accessibleLabel,
  id,
  size = 'md'
}) => {
  const baseClasses = classNames.classNames([styles.base, `oj-c-progress-circle-${size}`, styles.indeterminateOuter]);
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  return jsxRuntime.jsx(CircleWrapper, Object.assign({
    id: id,
    ariaValuetext: accessibleLabel || translations.progressIndeterminate(),
    class: baseClasses
  }, {
    children: jsxRuntime.jsx(CircleInner, {
      class: styles.indeterminateInner
    })
  }));
};

const DeterminateProgressCircle = ({
  value = 0,
  max = 100,
  id,
  size = 'md'
}) => {
  const percentage = Math.min(Math.max(0, value / max), 1);
  const baseClasses = classNames.classNames([styles.base, `oj-c-progress-circle-${size}`]);

  const clipPath = _getClipPath(percentage);

  return jsxRuntime.jsxs(CircleWrapper, Object.assign({
    id: id,
    max: max,
    value: value,
    class: baseClasses
  }, {
    children: [jsxRuntime.jsx(CircleInner, {
      class: classNames.classNames([styles.determinateInner, styles.track])
    }), jsxRuntime.jsx(CircleInner, {
      class: classNames.classNames([styles.determinateInner, styles.value]),
      clipPath: clipPath
    })]
  }));
};

const CircleWrapper = _a => {
  var {
    value,
    max,
    min,
    id,
    children,
    ariaValuetext,
    color
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["value", "max", "min", "id", "children", "ariaValuetext", "color"]);

  const ariaMin = value != null ? min ? min : '0' : null;
  const ariaMax = value != null ? max : null;
  const ariaNow = value != null ? value : null;
  return jsxRuntime.jsx("div", Object.assign({
    role: "progressbar",
    id: id,
    "aria-valuemin": ariaMin,
    "aria-valuemax": ariaMax,
    "aria-valuenow": ariaNow,
    "aria-valuetext": ariaValuetext,
    class: otherProps.class,
    style: {
      borderColor: color
    }
  }, {
    children: children
  }));
};

const CircleInner = _a => {
  var {
    clipPath,
    color
  } = _a,
      otherProps = tslib_es6.__rest(_a, ["clipPath", "color"]);

  return jsxRuntime.jsx("div", {
    class: otherProps.class,
    style: {
      clipPath: clipPath,
      borderColor: color
    }
  });
};

const styles = {
  base: "_3lr0d6",
  indeterminateOuter: "_d7hulw",
  indeterminateInner: "_3fy22f",
  determinateInner: "ilt9ry",
  track: "_fgu73v",
  value: "bab7ro"
};

function _getClipPath(percentage) {
  let tangent;

  if (percentage < 0.125) {
    tangent = _calculateTangent(percentage) + 50;
    return `polygon(50% 0, ${tangent}% 0, 50% 50%)`;
  } else if (percentage < 0.375) {
    if (percentage < 0.25) {
      tangent = 50 - _calculateTangent(0.25 - percentage);
    } else {
      tangent = _calculateTangent(percentage - 0.25) + 50;
    }

    return `polygon(50% 0, 100% 0, 100% ${tangent}%, 50% 50%)`;
  } else if (percentage < 0.625) {
    if (percentage < 0.5) {
      tangent = 50 + _calculateTangent(0.5 - percentage);
    } else {
      tangent = 50 - _calculateTangent(percentage - 0.5);
    }

    return `polygon(50% 0, 100% 0, 100% 100%, ${tangent}% 100%, 50% 50%)`;
  } else if (percentage < 0.875) {
    if (percentage < 0.75) {
      tangent = 50 + _calculateTangent(0.75 - percentage);
    } else {
      tangent = 50 - _calculateTangent(percentage - 0.75);
    }

    return `polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% ${tangent}%, 50% 50%)`;
  }

  tangent = 50 - _calculateTangent(1 - percentage);
  return `polygon(50% 0, 100% 0, 100% 100%, 0% 100%, 0% 0%, ${tangent}% 0%, 50% 50%)`;
}

function _calculateTangent(percentage) {
  return 50 * Math.tan(percentage * 2 * Math.PI);
}

exports.ProgressCircle = ProgressCircle;
/*  */
//# sourceMappingURL=UNSAFE_ProgressCircle.js.map