/* @oracle/oraclejet-preact: 13.0.0 */
import { _ as __rest } from './tslib.es6-fc945e53.js';
import { jsx, jsxs } from 'preact/jsx-runtime';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_ProgressCircle.css';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import 'preact/hooks';
import './UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_Layer.js';
import 'preact/compat';

function ProgressCircle(_a) {
  var {
    value,
    max
  } = _a,
      otherProps = __rest(_a, ["value", "max"]);

  return value === 'indeterminate' ? jsx(IndeterminateProgressCircle, Object.assign({}, otherProps)) : jsx(DeterminateProgressCircle, Object.assign({
    value: value,
    max: max
  }, otherProps));
}

const IndeterminateProgressCircle = ({
  accessibleLabel,
  id,
  size = 'md'
}) => {
  const baseClasses = classNames([styles.base, `oj-c-progress-circle-${size}`, styles.indeterminateOuter]);
  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  return jsx(CircleWrapper, Object.assign({
    id: id,
    ariaValuetext: accessibleLabel || translations.progressIndeterminate(),
    class: baseClasses
  }, {
    children: jsx(CircleInner, {
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
  const baseClasses = classNames([styles.base, `oj-c-progress-circle-${size}`]);

  const clipPath = _getClipPath(percentage);

  return jsxs(CircleWrapper, Object.assign({
    id: id,
    max: max,
    value: value,
    class: baseClasses
  }, {
    children: [jsx(CircleInner, {
      class: classNames([styles.determinateInner, styles.track])
    }), jsx(CircleInner, {
      class: classNames([styles.determinateInner, styles.value]),
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
      otherProps = __rest(_a, ["value", "max", "min", "id", "children", "ariaValuetext", "color"]);

  const ariaMin = value != null ? min ? min : '0' : null;
  const ariaMax = value != null ? max : null;
  const ariaNow = value != null ? value : null;
  return jsx("div", Object.assign({
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
      otherProps = __rest(_a, ["clipPath", "color"]);

  return jsx("div", {
    class: otherProps.class,
    style: {
      clipPath: clipPath,
      borderColor: color
    }
  });
};

const styles = {
  base: "bn7wf4q",
  indeterminateOuter: "iv2lv64",
  indeterminateInner: "i1p1jgv8",
  determinateInner: "d1d0ra29",
  track: "tl8cvpa",
  value: "v1oiv99s"
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

export { ProgressCircle };
/*  */
//# sourceMappingURL=UNSAFE_ProgressCircle.js.map
