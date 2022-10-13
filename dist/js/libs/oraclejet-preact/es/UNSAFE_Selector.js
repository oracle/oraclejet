/* @oracle/oraclejet-preact: 13.1.0 */
import { jsx } from 'preact/jsx-runtime';
import './UNSAFE_Selector.css';
import { classNames } from './utils/UNSAFE_classNames.js';
import { containsKey } from './utils/UNSAFE_keys.js';
import { useSelection } from './hooks/PRIVATE_useSelection.js';
import './UNSAFE_ThemedIcons.js';
import { Flex } from './UNSAFE_Flex.js';
import { useTranslationBundle } from './hooks/UNSAFE_useTranslationBundle.js';
import { CheckboxOn as SvgCheckboxOn, CheckboxOff as SvgCheckboxOff } from './UNSAFE_Icons.js';
import 'preact/hooks';
import './utils/UNSAFE_arrayUtils.js';
import './UNSAFE_Icon.js';
import './tslib.es6-deee4931.js';
import './hooks/UNSAFE_useUser.js';
import './UNSAFE_Environment.js';
import 'preact';
import './UNSAFE_Layer.js';
import 'preact/compat';
import './hooks/UNSAFE_useTheme.js';
import './utils/UNSAFE_interpolations/dimensions.js';
import './utils/UNSAFE_size.js';
import './utils/UNSAFE_stringUtils.js';
import './_curry1-b6f34fc4.js';
import './utils/UNSAFE_mergeInterpolations.js';
import './_curry2-255e04d1.js';
import './_has-f370c697.js';
import './utils/UNSAFE_interpolations/boxalignment.js';
import './keys-77d2b8e6.js';
import './utils/UNSAFE_interpolations/flexbox.js';
import './utils/UNSAFE_interpolations/flexitem.js';

const styles = {
  base: "_6n6967",
  container: "_2y127"
};
const checkboxStyles = {
  base: "_lz3e1",
  unselected: "_4duf70",
  selected: "_badi6g"
}; // internal component to use in place of the real Checkbox

function Checkbox(props) {
  const classes = classNames([checkboxStyles.base, props.checked ? checkboxStyles.selected : checkboxStyles.unselected]);
  const translations = useTranslationBundle('@oracle/oraclejet-preact');
  const ariaLabel = props.checked ? translations.selector_selected() : translations.selector_unselected();
  return jsx("div", Object.assign({
    class: classes,
    tabIndex: -1,
    type: "checkbox",
    checked: props.checked,
    "aria-label": props.accessibleLabel || ariaLabel,
    onClick: props.onClick
  }, {
    children: props.checked ? jsx(SvgCheckboxOn, {}) : jsx(SvgCheckboxOff, {})
  }));
} // click event handler used by Selector


const handleClick = event => {
  // we don't want container component like ListView to process it
  event.stopPropagation();
}; // update selectionProps onClick event to call event.stopPropagation()


const updateSelectionProps = selectionProps => {
  // click event handler return from useSelection
  const onClick = selectionProps.onClick;

  if (onClick) {
    // click event handler used by Selector
    selectionProps.onClick = event => {
      onClick(event);
      handleClick(event);
    };

    return selectionProps;
  }

  return {
    onClick: handleClick
  };
};
/**
 * The Selector component is used to enable multi-selection in Collection components.
 */


function Selector({
  accessibleLabel,
  rowKey,
  selectedKeys,
  onChange
}) {
  const {
    selectionProps
  } = useSelection(() => rowKey, selectedKeys, 'multiple', false, 'toggle', onChange); // TODO: replace internal with Preact checkbox component once it is available

  return jsx("div", Object.assign({
    class: styles.container
  }, updateSelectionProps(selectionProps), {
    children: jsx("div", Object.assign({
      class: styles.base
    }, {
      children: jsx(Flex, Object.assign({
        align: "center",
        justify: "center",
        width: "11x",
        height: "11x"
      }, {
        children: jsx(Checkbox, {
          checked: containsKey(selectedKeys, rowKey),
          accessibleLabel: accessibleLabel
        })
      }))
    }))
  }));
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { Selector };
/*  */
//# sourceMappingURL=UNSAFE_Selector.js.map
