import { ComponentChildren, Ref } from 'preact';
declare type Props = {
    mainContent?: ComponentChildren;
    insideLabel?: ComponentChildren;
    startContent?: ComponentChildren;
    endContent?: ComponentChildren;
    resize?: 'horizontal' | 'vertical' | 'both';
    variant?: 'error' | 'warning' | 'textarea' | 'textareaError' | 'textareaWarning';
    rootRef?: Ref<HTMLDivElement>;
};
export declare const TextFieldContent: ({ insideLabel, mainContent, startContent, endContent, resize, variant, rootRef }: Props) => import("preact").JSX.Element;
export {};
