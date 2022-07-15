import { ComponentChildren } from 'preact';
export declare type UseClearIconProps = {
    clearIcon?: ComponentChildren;
    display?: 'always' | 'conditionally' | 'never';
    hasValue?: boolean;
    isEnabled?: boolean;
    isFocused?: boolean;
    isHover?: boolean;
};
/**
 * A custom hook that handles showing/hiding clear icon
 */
export declare function useClearIcon({ clearIcon, display, hasValue, isEnabled, isFocused, isHover }: UseClearIconProps): ComponentChildren;
