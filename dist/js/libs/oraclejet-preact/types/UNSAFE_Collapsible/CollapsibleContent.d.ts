import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare type ContentProps = IntrinsicProps & {
    id: string;
    isExpanded: boolean;
    onTransitionEnd: () => void;
};
export declare const CollapsibleContent: ({ children, id, isExpanded, onTransitionEnd }: ContentProps) => JSX.Element;
export {};
