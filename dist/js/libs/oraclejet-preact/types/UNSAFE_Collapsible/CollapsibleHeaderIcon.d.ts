import { h } from 'preact';
declare type IconProps = {
    contentId: string;
    disabled: boolean;
    headerId: string;
    expanded: boolean;
    fill?: string;
    onClick?: (event: Event) => void;
};
/**
 * Header icon subcomponent
 */
export declare const CollapsibleHeaderIcon: ({ contentId, disabled, headerId, expanded, fill, onClick }: IconProps) => h.JSX.Element;
export {};
