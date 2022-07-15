export declare type PressOptions = {
    isDisabled?: boolean;
    isSuppressDup?: boolean;
};
/**
 * Returns a click handler that can make a target element either clickable or keyboard pressable.
 * Note that some elements such as Button may generate a click event upon ENTER, so if this is applied to a button,
 * specify true to suppress duplicates to avoid two events.
 *
 * @param onPressHandler function
 * @param isSuppressDup boolean
 * @returns
 */
export declare function usePress(onPressHandler: (event: Event) => void, settings?: PressOptions): {
    pressProps: Record<string, any>;
};
