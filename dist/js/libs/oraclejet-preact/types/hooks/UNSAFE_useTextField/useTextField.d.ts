import { ComponentProps } from 'preact';
import { TextField } from '../../UNSAFE_TextField';
import { InlineUserAssistance } from '../../UNSAFE_UserAssistance';
import { FormFieldContextProps } from '../UNSAFE_useFormFieldContext';
declare type PickedUserAssistanceProps = Pick<ComponentProps<typeof InlineUserAssistance>, 'messages'>;
declare type UseTextFieldProps<V> = PickedUserAssistanceProps & {
    id?: string;
    isDisabled?: boolean;
    isFocused?: boolean;
    isLoading?: boolean;
    isReadonly?: boolean;
    labelEdge?: ComponentProps<typeof TextField>['labelEdge'] | 'none';
    value?: V;
    variant?: 'textarea';
};
/**
 * A custom hook to determine the props for a component that renders
 * a text field
 */
export declare function useTextField<V>({ id: propId, isDisabled, isFocused, isLoading, isReadonly, labelEdge, messages, value, variant }: UseTextFieldProps<V>): {
    baseId: string;
    formFieldContext: FormFieldContextProps;
    inputProps: {
        id: string | undefined;
        ariaDescribedby: string | undefined;
        ariaInvalid: string | undefined;
    };
    labelProps: {
        forId: string | undefined;
        id: string | undefined;
        variant: "start" | "top" | "inside" | "insideError" | "insideWarning" | undefined;
    };
    textFieldProps: {
        id: string;
        variant: "textarea" | "warning" | "error" | "textareaError" | "textareaWarning" | undefined;
    };
    userAssistanceProps: {
        id: string | undefined;
    };
};
export {};
