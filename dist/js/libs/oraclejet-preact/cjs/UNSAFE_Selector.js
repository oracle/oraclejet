/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('preact/jsx-runtime');
require('identity-obj-proxy');
require('./utils/UNSAFE_classNames.js');
var utils_UNSAFE_keys = require('./utils/UNSAFE_keys.js');
var hooks_PRIVATE_useSelection = require('./hooks/PRIVATE_useSelection.js');
require('./index-dcd95188.js');
require('./UNSAFE_Flex.js');
var hooks_UNSAFE_useTranslationBundle = require('./hooks/UNSAFE_useTranslationBundle.js');
var classNames = require('./classNames-82bfab52.js');
var UNSAFE_Icons = require('./index-e2b299b3.js');
var Flex = require('./Flex-327ae051.js');
require('preact/hooks');
require('./utils/UNSAFE_arrayUtils.js');
require('./UNSAFE_Icon.js');
require('./Icon-42559ff1.js');
require('./tslib.es6-e91f819d.js');
require('./hooks/UNSAFE_useUser.js');
require('./UNSAFE_Environment.js');
require('preact');
require('./UNSAFE_Layer.js');
require('preact/compat');
require('./hooks/UNSAFE_useTheme.js');
require('./utils/UNSAFE_interpolations/dimensions.js');
require('./utils/UNSAFE_size.js');
require('./utils/UNSAFE_stringUtils.js');
require('./stringUtils-b22cc214.js');
require('./_curry1-94f22a19.js');
require('./utils/UNSAFE_mergeInterpolations.js');
require('./_curry2-e6dc9cf1.js');
require('./_has-556488e4.js');
require('./utils/UNSAFE_interpolations/boxalignment.js');
require('./keys-0a611b24.js');
require('./utils/UNSAFE_interpolations/flexbox.js');
require('./flexbox-3d991801.js');
require('./utils/UNSAFE_interpolations/flexitem.js');
require('./flexitem-91650faf.js');

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
  const classes = classNames.classNames([checkboxStyles.base, props.checked ? checkboxStyles.selected : checkboxStyles.unselected]);
  const translations = hooks_UNSAFE_useTranslationBundle.useTranslationBundle('@oracle/oraclejet-preact');
  const ariaLabel = props.checked ? translations.selector_selected() : translations.selector_unselected();
  return jsxRuntime.jsx("div", Object.assign({
    class: classes,
    tabIndex: -1,
    type: "checkbox",
    checked: props.checked,
    "aria-label": props.accessibleLabel || ariaLabel,
    onClick: props.onClick
  }, {
    children: props.checked ? jsxRuntime.jsx(UNSAFE_Icons.SvgCheckboxOn, {}) : jsxRuntime.jsx(UNSAFE_Icons.SvgCheckboxOff, {})
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
  } = hooks_PRIVATE_useSelection.useSelection(() => rowKey, selectedKeys, 'multiple', false, 'toggle', onChange); // TODO: replace internal with Preact checkbox component once it is available

  return jsxRuntime.jsx("div", Object.assign({
    class: styles.container
  }, updateSelectionProps(selectionProps), {
    children: jsxRuntime.jsx("div", Object.assign({
      class: styles.base
    }, {
      children: jsxRuntime.jsx(Flex.Flex, Object.assign({
        align: "center",
        justify: "center",
        width: "11x",
        height: "11x"
      }, {
        children: jsxRuntime.jsx(Checkbox, {
          checked: utils_UNSAFE_keys.containsKey(selectedKeys, rowKey),
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

exports.Selector = Selector;
/*  */
//# sourceMappingURL=UNSAFE_Selector.js.map
