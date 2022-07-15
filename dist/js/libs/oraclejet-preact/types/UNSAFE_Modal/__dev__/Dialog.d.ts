import { JSX, ComponentChild } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare type DialogProps = IntrinsicProps & {
    /**
     * On Close callback.
     */
    onClose?: () => void;
    /**
     * Determines whether the Dialog is open.
     */
    isOpen: boolean;
    /**
     * Dialog title.
     */
    dialogTitle?: string;
    /**
     * Dialog footer.
     */
    footer?: ComponentChild;
};
export declare const Dialog: ({ children, isOpen, dialogTitle, footer, onClose }: DialogProps) => JSX.Element;
export {};
