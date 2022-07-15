import { ComponentChildren, JSX } from 'preact';
import { StyledComponentProps } from '../utils/UNSAFE_typeUtils';
declare type UAProps = {
    inlineUserAssistance?: ComponentChildren;
};
export declare type StyleProps = UAProps & {
    label?: ComponentChildren;
    labelEdge?: 'inside' | 'start' | 'top';
    variant?: 'textarea';
};
declare type Props = StyledComponentProps<'div', StyleProps>;
export declare const ReadonlyTextField: ({ label, labelEdge, children, variant, ...props }: Props) => JSX.Element;
export {};
