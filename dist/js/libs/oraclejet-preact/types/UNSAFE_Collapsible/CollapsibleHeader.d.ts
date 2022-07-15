import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'id' | 'children'>;
declare type HeaderProps = IntrinsicProps & {
    id: string;
    contentId: string;
    isDisabled: boolean;
    isExpanded: boolean;
    toggleHandler: () => void;
};
/**
 * Header subcomponent
 */
export declare const CollapsibleHeader: ({ children, id, contentId, isDisabled, isExpanded, toggleHandler }: HeaderProps) => JSX.Element;
export {};
