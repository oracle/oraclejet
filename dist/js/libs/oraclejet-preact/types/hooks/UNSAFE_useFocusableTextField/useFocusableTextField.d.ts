import { Ref } from 'preact';
import { useFocusWithin } from '../UNSAFE_useFocusWithin';
export declare type FocusableHandle = {
    focus: () => void;
    blur: () => void;
};
declare type UseFocusWithinProps = Parameters<typeof useFocusWithin>[0];
declare type UseFocusableTextFieldProps = UseFocusWithinProps & {
    /**
     * flag indicating whether the field is readonly
     */
    isReadonly?: boolean;
    /**
     * An optional ref to add imperative handles
     */
    ref?: Ref<FocusableHandle>;
};
/**
 * A custom hook that handles the focus when the text field
 * is toggled between readonly and enabled
 * @typedef E represents the type of the enabled element
 * @typedef R represents the type of the readonly element
 */
export declare function useFocusableTextField<E extends HTMLElement, R extends HTMLElement>({ isReadonly, ref, ...useFocusWithinProps }: UseFocusableTextFieldProps): {
    enabledElementRef: import("preact/hooks").Ref<E>;
    readonlyElementRef: import("preact/hooks").Ref<R>;
    isFocused: boolean;
    focusProps: {
        onfocusin?: undefined;
        onfocusout?: undefined;
    } | {
        onfocusin: (event: FocusEvent) => void;
        onfocusout: (event: FocusEvent) => void;
    };
};
export {};
