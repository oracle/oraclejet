export declare type Props = {
    /**
     * Sets the variant for the badge. Badge can be subtle or solid with different colors.
     */
    variant?: 'neutral' | 'neutralSubtle' | 'danger' | 'dangerSubtle' | 'success' | 'successSubtle' | 'warning' | 'warningSubtle' | 'info' | 'infoSubtle';
    /**
     * Specifies the size of the badge. Consists of two options: Medium and small.
     */
    size?: 'sm' | 'md';
    /**
     * Specifies the placement of the badge. Badges can be attached to the end edge of another component. They lose their default corner rounding on right side for ltr direction or left side for rtl direction.
     */
    placement?: 'none' | 'end';
    /**
     * Specifies the string that will be rendered in the badge.
     */
    children: string;
};
export declare function Badge({ variant, size, placement, children }: Props): import("preact").JSX.Element;
