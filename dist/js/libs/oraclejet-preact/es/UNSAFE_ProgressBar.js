/* @oracle/oraclejet-preact: 13.1.0 */
import { _ as __rest } from './tslib.es6-deee4931.js';
import { jsx } from 'preact/jsx-runtime';
import { classNames } from './utils/UNSAFE_classNames.js';
import './UNSAFE_ProgressBar.css';
import { useUser } from './hooks/UNSAFE_useUser.js';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import 'preact/hooks';
import './UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_Layer.js';
import 'preact/compat';

function ProgressBar(_a) {
  var {
    value,
    max
  } = _a,
      otherProps = __rest(_a, ["value", "max"]);

  return value === 'indeterminate' ? jsx(IndeterminateProgressBar, Object.assign({}, otherProps)) : jsx(DeterminateProgressBar, Object.assign({
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
  } = useUser();
  const classes = classNames([styles.value, styles.indeterminate, styles[direction]]);
  const baseClasses = classNames([styles.base, edge === 'none' && styles.standalone]);
  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  return jsx(BarTrack, Object.assign({
    id: id,
    ariaValueText: accessibleLabel || translations.progressIndeterminate(),
    class: baseClasses,
    width: width
  }, {
    children: jsx(BarValue, {
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
  const baseClasses = classNames([styles.base, edge === 'none' && styles.standalone]);
  return jsx(BarTrack, Object.assign({
    value: value,
    max: max,
    id: id,
    width: width,
    class: baseClasses
  }, {
    children: jsx(BarValue, {
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
      otherProps = __rest(_a, ["value", "max", "min", "id", "width", "children", "ariaValueText", "color"]);

  const ariaMin = value != null ? min ? min : '0' : null;
  const ariaMax = value != null ? max : null;
  const ariaNow = value != null ? value : null;
  return jsx("div", Object.assign({
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
      otherProps = __rest(_a, ["width", "color"]);

  return jsx("div", {
    class: otherProps.class,
    style: {
      width: width,
      backgroundColor: color
    }
  });
};

const styles = {
  base: "_f0ixjh",
  value: "kywy72",
  indeterminate: "_jlqptl",
  standalone: "_ilu9sk",
  rtl: "_2du5hf",
  ltr: "_6ostrg"
};

export { ProgressBar };
/*  */
//# sourceMappingURL=UNSAFE_ProgressBar.js.map
