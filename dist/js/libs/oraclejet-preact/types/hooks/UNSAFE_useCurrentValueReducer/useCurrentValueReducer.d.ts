import { ComponentProps } from 'preact';
import { TextFieldInput } from '../../UNSAFE_TextField';
declare type TextFieldInputProps = ComponentProps<typeof TextFieldInput>;
declare type UseCurrentValueProps = {
    value?: TextFieldInputProps['value'];
};
declare type CurrentValueDispatchAction = {
    type: 'input' | 'commit';
    payload?: string;
};
/**
 * This hook takes an Object with a value, and returns currentCommitValue and dispatch.
 *
 * Whenever you call onInput, call dispatch({ type: 'input', payload: value });
 * For example:
 * dispatch({ type: 'input', payload: detail.value });
 * onInput?.(detail);
 * And similarly whenever you call onCommit, call dispatch({ type: 'commit', payload: value });
 *
 * The state is used to determine if the component's value property was programmatically
 * changed or just changed from an onInput listener to update the value back
 * to what the user typed in which is required for a controlled component.
 *
 * @param param0 The props for the useCurrentValueReducer hook
 * @returns
 */
export declare function useCurrentValueReducer({ value }: UseCurrentValueProps): {
    currentCommitValue: string | undefined;
    dispatch: (action: CurrentValueDispatchAction) => void;
};
export {};
