export declare type ActionableOptions = {
    isDisabled?: boolean;
    isSuppressDup?: boolean;
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
export declare function useActionable(onActionHandler: (event: Event) => void, settings?: ActionableOptions): {
    isActive: boolean;
    isHover: boolean;
    isFocus: boolean;
    actionableProps: Record<string, any>;
};
