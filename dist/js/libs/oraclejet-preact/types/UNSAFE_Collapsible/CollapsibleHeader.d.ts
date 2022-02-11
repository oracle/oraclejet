import { h, JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'children'>;
declare type HeaderProps = IntrinsicProps & {
    id: string;
    contentId: string;
    disabled: boolean;
    expanded: boolean;
    toggleHandler: (event: Event) => void;
};
/**
 * Header subcomponent
 */
export declare const CollapsibleHeader: ({ children, id, contentId, disabled, expanded, toggleHandler }: HeaderProps) => h.JSX.Element;
export {};
