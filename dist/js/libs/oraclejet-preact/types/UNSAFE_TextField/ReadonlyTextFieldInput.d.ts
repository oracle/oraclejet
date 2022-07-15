import { ComponentChildren, JSX, Ref } from 'preact';
import type { TextProps } from '../utils/UNSAFE_interpolations/text';
declare type AutoFocusProp = JSX.HTMLAttributes<HTMLInputElement>['autofocus'];
declare type ReadonlyAsInputProps = {
    as: 'input';
    type: JSX.HTMLAttributes<HTMLInputElement>['type'];
    elementRef?: Ref<HTMLInputElement>;
    rows?: never;
};
declare type ReadonlyAsTextAreaProps = {
    as: 'textarea';
    elementRef?: Ref<HTMLTextAreaElement>;
    type?: never;
    rows?: number;
};
declare type ReadonlyAsDivProps = {
    as?: 'div';
    elementRef?: Ref<HTMLDivElement>;
    type?: never;
    rows?: never;
};
declare type Props = TextProps & (ReadonlyAsDivProps | ReadonlyAsInputProps | ReadonlyAsTextAreaProps) & {
    ariaLabel?: string;
    ariaLabelledby?: string;
    autoFocus?: AutoFocusProp;
    hasInsideLabel?: boolean;
    id?: string;
    inlineUserAssistance?: ComponentChildren;
    innerReadonlyField?: ComponentChildren;
    value?: string;
};
export declare function ReadonlyTextFieldInput({ ariaLabel, ariaLabelledby, autoFocus, as, elementRef, hasInsideLabel, id, inlineUserAssistance, innerReadonlyField, rows, type, value, ...props }: Props): JSX.Element;
export {};
