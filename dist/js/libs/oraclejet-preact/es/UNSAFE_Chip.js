/* @oracle/oraclejet-preact: 13.0.0 */
import { jsx } from 'preact/jsx-runtime';
import { useActionable } from './hooks/UNSAFE_useActionable.js';
import './UNSAFE_Chip.css';
import { useCallback } from 'preact/hooks';
import { classNames } from './utils/UNSAFE_classNames.js';
import './utils/UNSAFE_mergeProps.js';
import './hooks/UNSAFE_useHover.js';
import './hooks/UNSAFE_useToggle.js';
import './hooks/UNSAFE_useActive.js';
import './hooks/UNSAFE_useFocus.js';
import './hooks/UNSAFE_usePress.js';

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
  const handleAction = useCallback(() => {
    onToggle === null || onToggle === void 0 ? void 0 : onToggle({
      previousValue: isSelected,
      value: !isSelected
    });
  }, [isSelected, onToggle]);
  const {
    actionableProps,
    isHover,
    isActive
  } = useActionable(handleAction, {
    isSuppressDup: false
  });
  const variant = isDisabled ? 'disabled' : isSelected || isActive ? 'info' : isHover ? 'infoSubtle' : 'infoSubtleLighter';
  const classes = classNames([styles.base, isDisabled ? styles.disabled : `${styles.base} ${styles[variant]} ${cursorandFocusStyle}`]);
  return isDisabled ? jsx("div", Object.assign({
    class: classes
  }, {
    children: children
  })) : jsx("div", Object.assign({}, actionableProps, {
    class: classes,
    tabIndex: 0,
    "aria-label": accessibleLabel,
    role: "switch",
    "aria-checked": isSelected ? 'true' : 'false'
  }, {
    children: children
  }));
}

export { Chip };
/*  */
//# sourceMappingURL=UNSAFE_Chip.js.map
