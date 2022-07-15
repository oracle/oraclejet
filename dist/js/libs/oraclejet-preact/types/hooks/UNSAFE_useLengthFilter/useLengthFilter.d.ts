import { ComponentProps } from 'preact';
import { TextFieldInput } from '../../UNSAFE_TextField';
import { CountUnit as _CountUnit } from '../../utils/UNSAFE_lengthFilter';
export declare type CountUnit = _CountUnit;
declare type PickedPropsFromTextFieldInput = Pick<ComponentProps<typeof TextFieldInput>, 'onCommit' | 'onInput' | 'value'>;
declare type UseLengthFilterProps = PickedPropsFromTextFieldInput & {
    maxLength?: number;
    maxLengthUnit?: CountUnit;
};
/**
 * A custom hook that applies the length filter to text field input
 * @param param0 The props for the useLengthFilter hook
 * @returns The filtered event handlers
 */
export declare function useLengthFilter({ maxLength, maxLengthUnit, onCommit, onInput, value }: UseLengthFilterProps): {
    isMaxLengthExceeded: boolean;
    valueLength: number | undefined;
    onFilteredInput: (detail: import("../../utils/UNSAFE_valueUpdateDetail").ValueUpdateDetail<string>) => void;
};
export {};
