import { JSX } from 'preact';
declare type IntrinsicProps = Pick<JSX.HTMLAttributes<HTMLDivElement>, 'children'>;
declare type DropdownProps = IntrinsicProps & {
    /**
     * Dropdown title.
     */
    title?: string;
    /**
     * Options list.
     */
    list: string;
};
export declare const Dropdown: ({ title, list }: DropdownProps) => JSX.Element;
export {};
