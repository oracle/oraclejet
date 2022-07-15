import { ComponentChildren, JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'children'>;
declare type Props = IntrinsicProps & {
    /**
     * Collapsible's header. If not specified, the header contains only an open/close icon. Note that the header text is required for JET collapsible for accessibility purposes.
     */
    header?: ComponentChildren;
    /**
     * Disables the collapsible if set to true
     */
    isDisabled?: boolean;
    /**
     * Specifies if the content is expanded
     */
    isExpanded?: boolean;
    /**
     * Property that triggers a callback immediately when toggle happens and value of expanded property should be updated
     */
    onToggle?: (details: ToggleDetail) => void;
    /**
     * Property that triggers a callback after toggle animation is done
     */
    onTransitionEnd?: (details: ToggleDetail) => void;
};
export declare type ToggleDetail = {
    value: boolean;
};
/**
 * Controlled Collapsible component
 */
export declare const Collapsible: ({ id, header, children, isDisabled, isExpanded, onToggle, onTransitionEnd }: Props) => JSX.Element;
export {};
