/* @oracle/oraclejet-preact: 13.1.0 */
import { mergeProps } from '../utils/UNSAFE_mergeProps.js';
import { useHover } from './UNSAFE_useHover.js';
import { useActive } from './UNSAFE_useActive.js';
import { useFocus } from './UNSAFE_useFocus.js';
import { usePress } from './UNSAFE_usePress.js';
import './UNSAFE_useToggle.js';
import 'preact/hooks';

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
    const { pressProps } = usePress(onActionHandler, settings);
    const { hoverProps, isHover } = useHover({ isDisabled: settings.isDisabled });
    const { focusProps, isFocus } = useFocus({ isDisabled: settings.isDisabled });
    const { activeProps, isActive } = useActive({ isDisabled: settings.isDisabled });
    const actionableProps = mergeProps(pressProps, hoverProps, activeProps, focusProps);
    return { actionableProps, isActive, isHover, isFocus };
}

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

export { useActionable };
/*  */
//# sourceMappingURL=UNSAFE_useActionable.js.map
