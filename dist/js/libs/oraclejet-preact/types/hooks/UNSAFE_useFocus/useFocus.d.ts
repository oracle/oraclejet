export declare type FocusOptions = {
    isDisabled?: boolean;
};
/**
 * Get status on whether target has focus or not
 * @returns
 */
export declare function useFocus(settings?: FocusOptions): {
    isFocus: boolean;
    focusProps: Record<string, any>;
};
