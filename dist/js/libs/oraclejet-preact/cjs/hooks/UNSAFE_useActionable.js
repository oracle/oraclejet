/* @oracle/oraclejet-preact: 13.1.0 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var utils_UNSAFE_mergeProps = require('../utils/UNSAFE_mergeProps.js');
var hooks_UNSAFE_useHover = require('./UNSAFE_useHover.js');
var hooks_UNSAFE_useActive = require('./UNSAFE_useActive.js');
var hooks_UNSAFE_useFocus = require('./UNSAFE_useFocus.js');
var hooks_UNSAFE_usePress = require('./UNSAFE_usePress.js');
require('./UNSAFE_useToggle.js');
require('preact/hooks');

const DefaultActionableOptions = {
    isDisabled: false,
    isSuppressDup: true
};
/**
 * A hook that can add actionable support to a target element, turning it into a
 * clickable button, div, card, etc.
 * As buttons generate a click event upon a keyboard ENTER, isSuppressDup should be used to avoid duplicate invocations.
 * If isHover, isFocus, and isActive are only used for changing visual rendering, it would be
 * faster to not use this hook, and instead use :hover, :focus-visible, :active and usePress.
 * @param onActionHandler
 * @returns
 */
function useActionable(onActionHandler, settings = DefaultActionableOptions) {
    const { pressProps } = hooks_UNSAFE_usePress.usePress(onActionHandler, settings);
    const { hoverProps, isHover } = hooks_UNSAFE_useHover.useHover({ isDisabled: settings.isDisabled });
    const { focusProps, isFocus } = hooks_UNSAFE_useFocus.useFocus({ isDisabled: settings.isDisabled });
    const { activeProps, isActive } = hooks_UNSAFE_useActive.useActive({ isDisabled: settings.isDisabled });
    const actionableProps = utils_UNSAFE_mergeProps.mergeProps(pressProps, hoverProps, activeProps, focusProps);
    return { actionableProps, isActive, isHover, isFocus };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

exports.useActionable = useActionable;
/*  */
//# sourceMappingURL=UNSAFE_useActionable.js.map
