import { ComponentChild } from 'preact';
export declare const positions: ("end" | "start" | "bottom" | "top" | "top-start" | "bottom-start" | "top-end" | "bottom-end")[];
declare type Position = typeof positions[number];
export declare const anchorTos: ("pointer" | "element")[];
declare type AnchorTo = typeof anchorTos[number];
declare type AnchorModel = {
    x: AnchorTo;
    y: AnchorTo;
};
declare type Props = {
    text?: string;
    variant?: 'tooltip' | 'datatip';
    isOpen: boolean;
    position?: Position;
    isDisabled?: boolean;
    anchor?: AnchorModel;
    offset?: {
        mainAxis?: number;
        crossAxis?: number;
    };
    onToggle?: (details: {
        value: boolean;
    }) => void;
};
export declare const useTooltipControlled: ({ text, isOpen, variant, position, isDisabled, anchor, offset, onToggle }: Props) => {
    tooltipContent: ComponentChild;
    tooltipProps: Record<string, any>;
};
export {};
