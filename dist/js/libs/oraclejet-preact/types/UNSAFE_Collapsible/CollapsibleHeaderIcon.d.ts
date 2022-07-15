declare type IconProps = {
    contentId: string;
    isDisabled: boolean;
    headerId: string;
    isExpanded: boolean;
    onClick?: (event: Event) => void;
};
/**
 * Header icon subcomponent
 */
export declare const CollapsibleHeaderIcon: ({ contentId, isDisabled, headerId, isExpanded, onClick }: IconProps) => import("preact").JSX.Element;
export {};
