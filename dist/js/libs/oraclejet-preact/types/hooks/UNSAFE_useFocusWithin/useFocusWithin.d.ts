declare type FocusEvents = {
    onBlurWithin?: (e: FocusEvent) => void;
    onFocusWithin?: (e: FocusEvent) => void;
};
declare type UseFocusWithinProps = FocusEvents & {
    isDisabled?: boolean;
};
export declare function useFocusWithin({ isDisabled, onBlurWithin, onFocusWithin }?: UseFocusWithinProps): {
    isFocused: boolean;
    focusProps: {
        onfocusin?: undefined;
        onfocusout?: undefined;
    };
} | {
    isFocused: boolean;
    focusProps: {
        onfocusin: (event: FocusEvent) => void;
        onfocusout: (event: FocusEvent) => void;
    };
};
export {};
