import { ComponentChildren, JSX } from 'preact';
import { Size } from '../utils/UNSAFE_size';
declare type Props = {
    /**
     * Label content of the layout
     */
    label?: ComponentChildren;
    /**
     * Defines how the label is going to be positioned
     */
    labelEdge?: 'start' | 'top';
    /**
     * Defines the label width for labelEdge 'start' ('top' is always 100%)
     */
    labelStartWidth?: Size;
    /**
     * Value content of the layout
     */
    children: ComponentChildren;
};
export declare const LabelValueLayout: ({ label, labelEdge, children, labelStartWidth }: Props) => JSX.Element;
export {};
