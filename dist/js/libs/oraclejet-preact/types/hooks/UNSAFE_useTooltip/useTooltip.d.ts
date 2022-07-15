import { useTooltipControlled } from './useTooltipControlled';
declare type tooltipParameters = Parameters<typeof useTooltipControlled>[0];
declare type Props = {
    text?: string;
    position?: tooltipParameters['position'];
    isDisabled?: boolean;
    anchor?: tooltipParameters['anchor'];
    offset?: {
        mainAxis?: number;
        crossAxis?: number;
    };
};
export declare const useTooltip: ({ text, position, isDisabled, anchor, offset }: Props) => ReturnType<typeof useTooltipControlled>;
export {};
