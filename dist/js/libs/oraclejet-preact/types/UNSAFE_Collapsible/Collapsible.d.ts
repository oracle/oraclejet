import { ComponentChild, h, JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'children'>;
declare type Props = IntrinsicProps & {
    /**
     * Collapsible's header. If not specified, the header contains only an open/close icon. Note that the header text is required for JET collapsible for accessibility purposes.
     */
    header?: ComponentChild;
    /**
     * Disables the collapsible if set to true
     */
    disabled?: boolean;
    /**
     * Specifies if the content is expanded
     */
    expanded?: boolean;
    /**
     * Property that triggers a callback immediately when toggle happens and value of expanded property should be updated
     */
    onToggle?: (details: ToggleDetail, event?: Event) => void;
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
export declare const Collapsible: ({ id, header, children, disabled, expanded, onToggle, onTransitionEnd }: Props) => h.JSX.Element;
export {};
