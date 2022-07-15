declare type SelectedChangeDetail = {
    previousValue?: boolean;
    value?: boolean;
};
declare type Props = {
    /**
     * Specifies if the chip component is selected.
     */
    isSelected?: boolean;
    /**
     * Disables the component.
     */
    isDisabled?: boolean;
    /**
     * Specifies some screen reader text.
     */
    accessibleLabel?: string;
    children: string;
    /**
     * Triggered when a chip is clickable, whether by keyboard, mouse, or touch events.
     */
    onToggle?: (detail: SelectedChangeDetail) => void;
};
export declare function Chip({ isSelected, isDisabled, accessibleLabel, children, onToggle }: Props): import("preact").JSX.Element;
export {};
