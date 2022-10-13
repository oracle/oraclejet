/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var hooks_UNSAFE_useActionable = require('./hooks/UNSAFE_useActionable.js');

var hooks = require('preact/hooks');
require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-82bfab52.js');

const cursorandFocusStyle = "_sxeu7d";
const styles = {
  base: "vds7d",
  disabled: "_07cpx4",
  info: "vrs1no",
  infoSubtle: "sz8twf",
  infoSubtleLighter: "q6dzqw"
};
function Chip({
  isSelected,
  isDisabled,
  accessibleLabel,
  children,
  onToggle
}) {
  const handleAction = hooks.useCallback(() => {
    onToggle === null || onToggle === void 0 ? void 0 : onToggle({
      previousValue: isSelected,
      value: !isSelected
    });
  }, [isSelected, onToggle]);
  const {
    actionableProps,
    isHover,
    isActive
  } = hooks_UNSAFE_useActionable.useActionable(handleAction, {
    isSuppressDup: false
  });
  const variant = isDisabled ? 'disabled' : isSelected || isActive ? 'info' : isHover ? 'infoSubtle' : 'infoSubtleLighter';
  const classes = classNames.classNames([styles.base, isDisabled ? styles.disabled : `${styles.base} ${styles[variant]} ${cursorandFocusStyle}`]);
  return isDisabled ? jsxRuntime.jsx("div", Object.assign({
    class: classes
  }, {
    children: children
  })) : jsxRuntime.jsx("div", Object.assign({}, actionableProps, {
    class: classes,
    tabIndex: 0,
    "aria-label": accessibleLabel,
    role: "switch",
    "aria-checked": isSelected ? 'true' : 'false'
  }, {
    children: children
  }));
}

exports.Chip = Chip;
/*  */
//# sourceMappingURL=Chip-b6236b18.js.map
