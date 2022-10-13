import { ValueUpdateDetail } from '../../utils/UNSAFE_valueUpdateDetail';
declare type TextFieldInputProps = {
    currentCommitValue?: string;
    value?: string;
    onInput?: (detail: ValueUpdateDetail<string>) => void;
    onCommit?: (detail: ValueUpdateDetail<string>) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
};
export declare function useTextFieldInputHandlers({ currentCommitValue, value, onInput, onCommit, onKeyDown }: TextFieldInputProps): {
    onBlur: (event: Event) => void;
    onKeyDown: (event: KeyboardEvent) => void;
    oncompositionstart: () => void;
    oncompositionend: () => void;
    onInput: (event: Event) => void;
};
export {};
