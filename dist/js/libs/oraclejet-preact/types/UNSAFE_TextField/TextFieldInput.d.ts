import { JSX, Ref } from 'preact';
import type { TextProps } from '../utils/UNSAFE_interpolations/text';
import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
declare type Autocomplete = 'off' | 'on' | string;
declare type OrigPickedPropsFromInput = Pick<JSX.HTMLAttributes<HTMLInputElement>, 'autofocus' | 'id' | 'placeholder' | 'required' | 'role' | 'spellcheck' | 'type'>;
declare type RenamedPropsFromInput = Omit<OrigPickedPropsFromInput, 'autofocus' | 'required'> & {
    autoFocus?: OrigPickedPropsFromInput['autofocus'];
    isRequired?: OrigPickedPropsFromInput['required'];
};
declare type InputProps = {
    as?: 'input';
    type?: Pick<JSX.HTMLAttributes<HTMLInputElement>, 'type'>['type'];
    rows?: never;
    inputRef?: Ref<HTMLInputElement>;
};
declare type TextAreaProps = {
    as: 'textarea';
    type?: never;
    rows?: number;
    inputRef?: Ref<HTMLTextAreaElement>;
};
declare type UniqueProps = InputProps | TextAreaProps;
declare type AriaProps = {
    ariaAutocomplete?: 'none' | 'inline' | 'list' | 'both';
    ariaControls?: string;
    ariaDescribedby?: string;
    ariaExpanded?: boolean;
    ariaInvalid?: string;
    ariaLabel?: string;
    ariaLabelledby?: string;
};
declare type Props = UniqueProps & TextProps & RenamedPropsFromInput & AriaProps & {
    autoComplete?: Autocomplete;
    currentCommitValue?: string;
    hasEndContent?: boolean;
    hasInsideLabel?: boolean;
    hasStartContent?: boolean;
    value?: string;
    onInput?: (detail: ValueUpdateDetail<string>) => void;
    onCommit?: (detail: ValueUpdateDetail<string>) => void;
    onKeyDown?: (event: KeyboardEvent) => void;
    onKeyUp?: (event: KeyboardEvent) => void;
};
export declare const TextFieldInput: ({ as, ariaAutocomplete, ariaControls, ariaDescribedby, ariaExpanded, ariaInvalid, ariaLabel, ariaLabelledby, autoComplete, autoFocus, currentCommitValue, hasEndContent, hasInsideLabel, hasStartContent, id, inputRef, placeholder, isRequired, role, rows, spellcheck, type, value, onInput, onCommit, onKeyDown, onKeyUp, ...props }: Props) => JSX.Element;
export {};
