/* @oracle/oraclejet-preact: 13.0.0 */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var hooks_UNSAFE_useActionable = require('./hooks/UNSAFE_useActionable.js');

var hooks = require('preact/hooks');
require('./utils/UNSAFE_classNames.js');
var classNames = require('./classNames-69178ebf.js');

const cursorandFocusStyle = "c1drwgih";
const styles = {
  base: "b16hrnn0",
  disabled: "d16riqis",
  info: "i1abp3op",
  infoSubtle: "iu2igik",
  infoSubtleLighter: "i149ovoc"
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
//# sourceMappingURL=Chip-adde9fa4.js.map
