import { ComponentChildren, ComponentProps, JSX, Ref } from 'preact';
import { TextFieldContent } from './TextFieldContent';
import { Size } from '../utils/UNSAFE_size';
declare type PickedPropsFromTextFieldContent = Pick<ComponentProps<typeof TextFieldContent>, 'startContent' | 'mainContent' | 'endContent' | 'variant' | 'resize'>;
declare type PickedPropsFromHTMLElement = Pick<JSX.HTMLAttributes<HTMLElement>, 'id'>;
declare type FocusEvents = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'onFocus' | 'onBlur'>;
declare type KeyEvents = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'onKeyDown'>;
declare type MouseEvents = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'onMouseDown' | 'onMouseEnter' | 'onMouseLeave'>;
declare type LabelProps = {
    label?: ComponentChildren;
    labelEdge?: 'inside' | 'start' | 'top';
    labelStartWidth?: Size;
};
declare type Props = PickedPropsFromTextFieldContent & PickedPropsFromHTMLElement & FocusEvents & KeyEvents & MouseEvents & LabelProps & {
    inlineUserAssistance?: ComponentChildren;
    mainFieldRef?: Ref<HTMLDivElement>;
};
export declare const TextField: ({ id, endContent, mainContent, startContent, inlineUserAssistance, label, labelEdge, labelStartWidth, mainFieldRef, resize, variant, onFocus, onBlur, onKeyDown, onMouseDown, onMouseEnter, onMouseLeave }: Props) => JSX.Element;
export {};
